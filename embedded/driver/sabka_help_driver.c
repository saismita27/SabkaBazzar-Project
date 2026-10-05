/**
 * @file sabka_help_driver.c
 * @brief Educational write-triggered Linux character device; no GPIO hardware handler.
 * @author Final-Year B.Tech CSIT Student & Mentor
 * 
 * This driver registers /dev/sabka_help. A userspace write simulates a button
 * event. One event can be pending; further writes return EBUSY until consumed.
 * Physical GPIO and IRQ handling are not implemented; C++ consumes the shared event ABI.
 *
 * Demonstrates:
 * - Module initialization and cleanup (module_init, module_exit)
 * - Dynamic / Static Character Device Registration (alloc_chrdev_region, cdev_add)
 * - struct file_operations (.open, .release, .read, .write, .poll)
 * - Linux Wait Queues (wait_queue_head_t, wait_event_interruptible, wake_up_interruptible)
 * - Non-blocking vs Blocking I/O
 * - Secure Kernel-to-Userspace data copying (copy_to_user, copy_from_user)
 * - Device Class creation for automatic /dev node generation via udev (class_create, device_create)
 */

#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/device.h>
#include <linux/uaccess.h>
#include <linux/wait.h>
#include <linux/poll.h>
#include <linux/slab.h>
#include <linux/timekeeping.h>
#include <linux/mutex.h>
#include <linux/version.h>

#define DEVICE_NAME "sabka_help"
#define CLASS_NAME  "sabka_kiosk_class"
#define BUFFER_SIZE 256

MODULE_LICENSE("GPL");
MODULE_AUTHOR("B.Tech CSIT Final Year Project");
MODULE_DESCRIPTION("Assisted Shopping Kiosk Help Button Character Device Driver");
MODULE_VERSION("1.0");

#include "sabka_help_protocol.h"

/* Driver State Data Structure */
static dev_t dev_number;                  /* Major & Minor device number */
static struct cdev sabka_cdev;           /* Character device structure */
static struct class *sabka_class = NULL; /* Sysfs device class */
static struct device *sabka_device = NULL;/* Device node representation */

/* Synchronization & Event Buffering */
static DECLARE_WAIT_QUEUE_HEAD(help_wait_queue);
static DEFINE_MUTEX(driver_lock);
static struct sabka_event current_event;
static int event_available = 0;           /* Flag indicating pending unread event */
static uint32_t event_counter = 0;

/**
 * sabka_open() - Invoked when userspace opens /dev/sabka_help
 */
static int sabka_open(struct inode *inodep, struct file *filep)
{
    pr_info("sabka_help: Device opened by PID %d (%s)\n", current->pid, current->comm);
    return 0;
}

/**
 * sabka_release() - Invoked when userspace closes the file descriptor
 */
static int sabka_release(struct inode *inodep, struct file *filep)
{
    pr_info("sabka_help: Device closed by PID %d\n", current->pid);
    return 0;
}

/**
 * sabka_read() - Transfers pending help event to userspace application
 * Supports both blocking and non-blocking (O_NONBLOCK) reads.
 */
static ssize_t sabka_read(struct file *filep, char __user *buffer, size_t len, loff_t *offset)
{
    int ret;
    if (!len) return 0;
    if (len < sizeof(struct sabka_event)) return -EINVAL;
    for (;;) {
        ret = mutex_lock_interruptible(&driver_lock);
        if (ret) return ret;
        if (event_available) break;
        mutex_unlock(&driver_lock);
        if (filep->f_flags & O_NONBLOCK) return -EAGAIN;
        ret = wait_event_interruptible(help_wait_queue, READ_ONCE(event_available));
        if (ret) return ret;
    }
    /* Safe transfer from kernel space to user space memory */
    if (copy_to_user(buffer, &current_event, sizeof(current_event))) {
        mutex_unlock(&driver_lock);
        pr_err("sabka_help: copy_to_user failed\n");
        return -EFAULT;
    }

    /* Reset event flag once consumed */
    WRITE_ONCE(event_available, 0);

    mutex_unlock(&driver_lock);
    wake_up_interruptible(&help_wait_queue);
    return sizeof(struct sabka_event);
}

/**
 * sabka_write() - Allows a test utility or supervisor process to simulate a button press
 */
static ssize_t sabka_write(struct file *filep, const char __user *buffer, size_t len, loff_t *offset)
{
    char user_cmd[32];
    size_t copy_len = min(len, sizeof(user_cmd) - 1);
    if (!len) return 0;
    if (len >= sizeof(user_cmd)) return -EMSGSIZE;

    if (copy_from_user(user_cmd, buffer, copy_len)) {
        return -EFAULT;
    }
    user_cmd[copy_len] = '\0';
    if (len != 5 || memcmp(user_cmd, SABKA_HELP_COMMAND, 5)) return -EINVAL;

    mutex_lock(&driver_lock);
    if (event_available) {
        mutex_unlock(&driver_lock);
        return -EBUSY;
    }
    event_counter++;
    current_event.event_id = event_counter;
    current_event.kiosk_id = SABKA_KIOSK_ID; /* Kiosk Station #1 */
    current_event.timestamp_ns = ktime_get_real_ns();
    snprintf(current_event.trigger_source, sizeof(current_event.trigger_source), "TEST_SIMULATOR");

    WRITE_ONCE(event_available, 1);

    mutex_unlock(&driver_lock);

    pr_info("sabka_help: Button event triggered via write(). Waking up poll listeners...\n");

    /* Wake up any userspace threads waiting in poll(), select(), or read() */
    wake_up_interruptible(&help_wait_queue);

    return len;
}

/**
 * sabka_poll() - Implements poll/select/epoll support for userspace multiplexing
 */
static __poll_t sabka_poll(struct file *filep, struct poll_table_struct *wait)
{
    __poll_t mask = 0;

    /* Register wait queue with the kernel poll table */
    poll_wait(filep, &help_wait_queue, wait);

    mutex_lock(&driver_lock);
    if (event_available) {
        mask |= (EPOLLIN | EPOLLRDNORM); /* Data available for reading */
    }
    if (!event_available) mask |= (EPOLLOUT | EPOLLWRNORM);
    mutex_unlock(&driver_lock);

    return mask;
}

/* File Operations Dispatch Table */
static struct file_operations fops = {
    .owner   = THIS_MODULE,
    .open    = sabka_open,
    .release = sabka_release,
    .read    = sabka_read,
    .write   = sabka_write,
    .poll    = sabka_poll,
};

/**
 * sabka_driver_init() - Driver entry point (insmod)
 */
static int __init sabka_driver_init(void)
{
    int ret;
    pr_info("sabka_help: Initializing Sabka Bazzar Kiosk Help Driver...\n");

    /* Step 1: Allocate Major and Minor numbers dynamically */
    ret = alloc_chrdev_region(&dev_number, 0, 1, DEVICE_NAME);
    if (ret < 0) {
        pr_err("sabka_help: Failed to allocate char device region (err: %d)\n", ret);
        return ret;
    }
    pr_info("sabka_help: Allocated Major %d, Minor %d\n", MAJOR(dev_number), MINOR(dev_number));

    /* Step 2: Initialize and add cdev to the kernel Virtual File System */
    cdev_init(&sabka_cdev, &fops);
    sabka_cdev.owner = THIS_MODULE;
    ret = cdev_add(&sabka_cdev, dev_number, 1);
    if (ret < 0) {
        pr_err("sabka_help: Failed to add cdev (err: %d)\n", ret);
        unregister_chrdev_region(dev_number, 1);
        return ret;
    }

    /* Step 3: Create sysfs class (/sys/class/sabka_kiosk_class) */
#if LINUX_VERSION_CODE >= KERNEL_VERSION(6, 4, 0)
    sabka_class = class_create(CLASS_NAME);
#else
    sabka_class = class_create(THIS_MODULE, CLASS_NAME);
#endif
    if (IS_ERR(sabka_class)) {
        pr_err("sabka_help: Failed to create device class\n");
        cdev_del(&sabka_cdev);
        unregister_chrdev_region(dev_number, 1);
        return PTR_ERR(sabka_class);
    }

    /* Step 4: Create device node (/dev/sabka_help) automatically via uevent */
    sabka_device = device_create(sabka_class, NULL, dev_number, NULL, DEVICE_NAME);
    if (IS_ERR(sabka_device)) {
        pr_err("sabka_help: Failed to create device node /dev/%s\n", DEVICE_NAME);
        class_destroy(sabka_class);
        cdev_del(&sabka_cdev);
        unregister_chrdev_region(dev_number, 1);
        return PTR_ERR(sabka_device);
    }

    pr_info("sabka_help: Successfully loaded! Device created at /dev/%s\n", DEVICE_NAME);
    return 0;
}

/**
 * sabka_driver_exit() - Driver exit point (rmmod)
 */
static void __exit sabka_driver_exit(void)
{
    pr_info("sabka_help: Unloading driver and cleaning up resources...\n");

    device_destroy(sabka_class, dev_number);
    class_destroy(sabka_class);
    cdev_del(&sabka_cdev);
    unregister_chrdev_region(dev_number, 1);

    pr_info("sabka_help: Driver unloaded cleanly.\n");
}

module_init(sabka_driver_init);
module_exit(sabka_driver_exit);
