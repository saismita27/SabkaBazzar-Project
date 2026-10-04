> Original sample planning document: implementation and test claims below are not independently verified. See ../README.md and ../REPAIR_VERIFICATION.md for actual repair status.

# Embedded Linux & C++ Final Year Viva / Interview Preparation Guide
**Project:** Sabka Bazzar — Accessible Multilingual Kiosk & Embedded Linux Subsystem  
**Target:** B.Tech CSIT Viva Voce & Technical Interview Defense

---

### Q1: Why did you choose a Character Device Driver for this project?
**Answer:**  
In Linux, devices are categorized into Character devices, Block devices, and Network devices.  
A physical help/panic button generates discrete sequential event streams (character/byte-oriented data) without requiring structured fixed-size sector buffering like a hard disk or block device. A character device driver (`/dev/sabka_help`) provides a clean POSIX interface where standard system calls (`open`, `read`, `write`, `poll`, `close`) can be used by any userspace language or C++ application.

---

### Q2: What do the Major and Minor numbers represent?
**Answer:**  
- **Major Number:** Identifies the driver associated with the device (the kernel uses the major number to index into the character device switch table and route calls to our `file_operations` struct).
- **Minor Number:** Used internally by the driver to distinguish between different physical instances or channels controlled by the same driver (e.g. Kiosk #1 vs Kiosk #2). In our driver, we used dynamic allocation via `alloc_chrdev_region()`.

---

### Q3: Why is `copy_to_user()` / `copy_from_user()` mandatory? Why can't we use standard `memcpy()`?
**Answer:**  
Kernel space and userspace operate in completely isolated virtual address spaces with hardware MMU protection.  
Directly dereferencing a userspace pointer in kernel space with `memcpy()` is dangerous because:
1. The userspace pointer might be invalid, unmapped, NULL, or swapped out to disk, triggering a Kernel Panic / Oops.
2. It would create severe security vulnerabilities (arbitrary kernel memory access).
3. `copy_to_user()` and `copy_from_user()` safely check the validity of the userspace memory range (`access_ok`), handle page faults gracefully, and return the number of uncopied bytes if memory is inaccessible.

---

### Q4: Why did you use `poll()` instead of a simple `while(true)` loop with `read()`?
**Answer:**  
A naive `while(true)` loop either consumes 100% of the CPU core (busy waiting / spinning) or requires imprecise `sleep()` delays that introduce latency.  
By implementing `.poll` in the driver using Linux Wait Queues (`poll_wait`, `wait_queue_head_t`), when userspace calls `poll()`, the calling thread is placed into a deep sleeping state (`TASK_INTERRUPTIBLE`) by the kernel scheduler. The thread consumes **0% CPU** until the driver triggers `wake_up_interruptible()`, instantly waking the userspace thread with microsecond latency.

---

### Q5: How would physical hardware differ from your simulation?
**Answer:**  
In real production hardware:
- The button is physically wired to an SoC GPIO pin (e.g., Raspberry Pi BCM GPIO 17).
- The driver registers an Interrupt Request (IRQ) using `gpio_to_irq()` and `request_irq()`.
- Top-Half / Bottom-Half: The hardware interrupt quickly flags the event (top-half), and schedules a tasklet or threaded IRQ (bottom-half) to avoid disabling interrupts for too long.
- In our test demonstration and sandbox environments without root kernel loading privileges, we implemented both:
  1. Full compilable kernel module source (`sabka_help_driver.c`) with `sysfs` & `fops`.
  2. A userspace device simulator (`sabka_help_simulator.cpp`) that simulates the event stream through a POSIX FIFO and file descriptors, allowing seamless integration testing without crashing the host OS.

---

### Q6: How does the application prevent accidental duplicate orders?
**Answer:**  
We implement an **Idempotency Token** pattern. When a user navigates to the checkout review step, the client generates a unique cryptographically random token (`UUIDv4`). When the user clicks "Place Order", the token is sent with the payload. The backend validates and locks the token in the transactional database. If a second click occurs due to lag or double-clicking, the backend detects the duplicate token and returns the existing order confirmation rather than billing or decrementing stock twice.

---

### Q7: How does your Vernacular Alias search work without paying for external translation APIs?
**Answer:**  
We designed an in-memory Unicode-normalized Trie and multi-key inverted index mapping regional transliterations and vernacular terms to canonical product IDs.  
For example:
- `tej patta` (Latin transliteration)
- `tejpatta` (Compound word transliteration)
- `तेज पत्ता` (Devanagari Hindi)
- `ତେଜପତ୍ର` (Odia script)
All map to Canonical Product: **Indian Bay Leaf (Cinnamomum tamala)**. This delivers instant, zero-cost, offline-capable search.
