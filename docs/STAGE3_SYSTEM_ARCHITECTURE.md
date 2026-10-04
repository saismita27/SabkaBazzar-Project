> Original sample planning document: implementation and test claims below are not independently verified. See ../README.md and ../REPAIR_VERIFICATION.md for actual repair status.

# Stage 3 — System Architecture & Hardware/Software Interaction
**Project:** Sabka Bazzar  
**Component:** Embedded Linux Kiosk & Multilingual Web Subsystem

---

## 1. High-Level Architecture Overview

```text
+-----------------------------------------------------------------------------------+
|                           PHYSICAL HARDWARE LAYER                                  |
|   +--------------------------+          +-------------------------------------+   |
|   |  Physical Help Button    | -------> | Microcontroller / GPIO Pin (Pin 17) |   |
|   |  (Assisted Kiosk Panel)  |          | (Active-Low with Pull-Up Resistor)  |   |
|   +--------------------------+          +-------------------------------------+   |
+---------------------------------------------------|-------------------------------+
                                                    | Hardware IRQ (e.g. IRQ 53)
                                                    v
+-----------------------------------------------------------------------------------+
|                             LINUX KERNEL SPACE                                    |
|   +---------------------------------------------------------------------------+   |
|   | Interrupt Handler (request_irq / Top Half)                                |   |
|   |   -> Acknowledges HW IRQ, schedules Bottom Half                           |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|   +-----------------------------------v---------------------------------------+   |
|   | Sabka Help Character Device Driver (`/dev/sabka_help`, Major: 240, Minor: 0)|   |
|   |   - Struct file_operations: open, read, write, poll, release              |   |
|   |   - Event Ring Buffer + atomic flag `event_pending`                        |   |
|   |   - Wait Queue: `wait_queue_head_t help_wait_queue`                       |   |
|   |   - Wake up on interrupt: `wake_up_interruptible(&help_wait_queue)`       |   |
|   +---------------------------------------------------------------------------+   |
+---------------------------------------|-------------------------------------------+
                                        | System Calls: open(), poll(), read()
                                        v
+-----------------------------------------------------------------------------------+
|                             LINUX USERSPACE                                       |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   | C++ System Daemon (`sabka_daemon` / `help_listener`)                      |   |
|   |   1. Opens `/dev/sabka_help` (O_RDONLY | O_NONBLOCK)                      |   |
|   |   2. Uses `poll(&pfd, 1, timeout)` for efficient zero-CPU event waiting   |   |
|   |   3. Dedicated Worker Thread (`std::thread`, `std::mutex`)                |   |
|   |   4. Dispatches POSIX signal handler (`SIGINT`, `SIGTERM` cleanup)        |   |
|   |   5. IPC Bridge to Web Application via Local Socket / REST IPC Endpoint   |   |
|   +---------------------------------------------------------------------------+   |
|                                       |                                           |
|                                       | Local Loopback / SSE / WebSocket IPC      |
|                                       v                                           |
|   +---------------------------------------------------------------------------+   |
|   | Full-Stack Kiosk Web Application (Node / C++ HTTP / Browser Frontend)     |   |
|   |   - Multilingual Engine (Hindi, Odia, Marathi, Bengali, Tamil, English)   |   |
|   |   - Vernacular Alias Search Index ("tej patta" -> Bay Leaf)               |   |
|   |   - 12 Comprehensive Indian Retail Categories                             |   |
|   |   - Easy Shopping Senior Mode (सुगम खरीदारी)                              |   |
|   |   - Transactional Order Management & State Tracking                       |   |
|   |   - Instant Customer Care & Kiosk Help Modal Trigger                      |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Hardware / Software Boundary Explanation (Interview Ready!)

When an interviewer asks: *"Explain how a physical button press reaches the web browser in your project"*:

1. **Physical Actuation:** A user at an assisted shopping kiosk presses the mechanical red "Help" button. This connects a Raspberry Pi / Embedded SoC GPIO pin (e.g. BCM GPIO 17) to GND (active-low with pull-up resistor).
2. **Interrupt Generation:** The SoC GPIO controller detects a falling edge voltage transition and triggers an Interrupt Request (IRQ line) to the ARM/x86 CPU.
3. **Kernel ISR (Interrupt Service Routine):**
   - The Linux kernel halts current execution and calls our driver's interrupt handler registered via `request_irq()`.
   - The driver sets an internal flag (`event_pending = 1`), writes timestamp and event code (`HELP_REQ_KIOSK_1`) to an internal ring buffer.
   - It executes `wake_up_interruptible(&help_wait_queue)`.
4. **VFS & System Call Transition (Kernel to Userspace):**
   - In userspace, our C++ daemon is blocked on `poll()` on the open file descriptor representing `/dev/sabka_help`.
   - When `wake_up_interruptible` runs, the kernel's `poll()` implementation (`sabka_poll`) returns `POLLIN | POLLRDNORM`.
   - `poll()` unblocks in the C++ daemon without consuming CPU cycles in busy-wait loops.
5. **Userspace Data Transfer:**
   - The C++ daemon executes `read(fd, buffer, sizeof(buffer))`.
   - The driver's `sabka_read` uses `copy_to_user()` to securely transfer the event struct from kernel memory to userspace memory.
6. **Web / UI Dispatch:**
   - The C++ daemon notifies the local kiosk web app via IPC.
   - The web app identifies the active kiosk session and pops open the accessible Support & Attendant Call dialogue with audible chime.

---

## 3. Database Schema & State Transitions

### A. Order State Machine
```text
[Placed] ──────> [Confirmed] ──────> [Packed] ──────> [Shipped] ──────> [Out for Delivery] ──────> [Delivered]
    |                  |
    v                  v
[Cancelled]        [Cancelled]
```
- **Guards:** Cancellation only allowed when status is `Placed` or `Confirmed`. Once `Packed`, the item is committed to logistics.

### B. Relational Schema (SQLite / In-Memory Store)
- `users`: `id`, `name`, `phone`, `email`, `password_hash`, `preferred_language`, `role`
- `categories`: `id`, `slug`, `name_en`, `name_hi`, `name_or`, `icon`
- `products`: `id`, `category_id`, `name_en`, `name_hi`, `name_or`, `price`, `mrp`, `stock`, `rating`, `image_url`, `brand`, `unit`, `description`
- `product_aliases`: `id`, `product_id`, `alias_term`, `language_code`, `script_type` (e.g. `tej patta`, `tejpatta`, `तेज पत्ता`, `bay leaf`)
- `orders`: `id`, `user_id`, `total_amount`, `discount_amount`, `gst_amount`, `delivery_fee`, `status`, `payment_method`, `idempotency_token`, `shipping_address`, `created_at`
- `order_items`: `id`, `order_id`, `product_id`, `quantity`, `unit_price`
- `support_tickets`: `id`, `user_id`, `order_id`, `type`, `subject`, `message`, `status`, `created_at`, `admin_reply`
- `kiosk_events`: `id`, `source`, `event_type`, `payload`, `acknowledged`, `timestamp`
