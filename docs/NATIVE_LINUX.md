> Historical walkthrough from the initial native conversion. Current account/admin and root-build instructions are in README.md and docs/EMBEDDED_LINUX.md; anonymous-only descriptions below predate the account implementation.

# Sabka Bazaar: native C++ Linux demonstration

This is another interface to the **same shopping backend and SQLite database**, not a separate shopping project. The terminal application and backend are C++17. The educational driver is C. No Node, React, TypeScript or Python is required to build or run this native path. The preserved optional website still contains TypeScript; do not describe the entire repository as C/C++ only.

## Build and run in Ubuntu

Open Ubuntu and change to the repository root. Install dependencies on a fresh machine:

```bash
sudo apt update
sudo apt install build-essential cmake pkg-config libcpp-httplib-dev libsqlite3-dev libsodium-dev nlohmann-json3-dev libicu-dev curl
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
```

Terminal 1, from the repository root:

```bash
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json - --fifo
```

The `-` disables static website hosting. The server binds only to 127.0.0.1:8080. The final argument explicitly selects a userspace FIFO simulator. Ctrl+C stops the server and joins its worker threads.

Terminal 2, from the same repository root:

```bash
backend/build/sabka_cli
```

The CLI uses UTF-8 input, including local aliases. Its menus are currently English. Use an Ubuntu terminal that supports UTF-8 fonts. Default anonymous-session cookie: `/tmp/sabka-cli-<uid>.session`, created with mode 0600 and checked for ownership, file type and symlinks. This is not password authentication. To use a separate demo session, set `SABKA_SESSION_FILE` to a new private file path. Never commit session files.

## Five-minute demonstration

1. Choose **1 Search**, enter `tej patta`. The Bay Leaf item is returned. An empty search lists the catalogue.
2. Choose **2 Add to cart**, product `prod-bay-leaf`, quantity `1`; choose **3 Cart** to see the server-calculated total.
3. Choose **8 Wishlist** to toggle a product by ID. Blank input lists saved products.
4. Choose **5 Checkout**. Enter fictional name/address/city, six-digit PIN and ten-digit demo mobile, choose `COD`, and confirm `yes`. No real payment is collected. `UPI` and `Card` are also simulation labels.
5. Choose **6 Orders** to inspect the saved order. Copy its order ID without quotation marks. Choose **7** and enter `Confirmed`; a jump directly to `Delivered` is rejected. Cancellation is allowed only from Placed or Confirmed.
6. Choose **9 Help**, then **1** to save a support ticket, or **2** to list tickets. No real agent or phone call is connected.
7. Choose **9**, then **3 Pair kiosk**. In a third Ubuntu terminal run:

```bash
backend/build/sabka_help_trigger --fifo
```

Return to the CLI and open **9 Help** to retrieve and acknowledge the event. Only the last explicitly paired session receives help. The browser and CLI are independent sessions by default. Pairing resets on backend restart; acknowledgements persist in SQLite. The terminal checks events when Help is opened, rather than updating the menu asynchronously.

## Architecture and Linux concepts

```text
C++ terminal client -- localhost HTTP --> C++ server -- transactions --> SQLite
                                               ^
C++ help trigger -- write --> FIFO -- poll/read worker

Optional React website uses the same HTTP API
Optional C character device replaces FIFO on a compatible Linux kernel
```

- `backend/cli.cpp`: native menu, UTF-8 query escaping, HTTP requests, private session file using open/read/write/fstat/fsync and RAII.
- `backend/server.cpp`: prepared statements, mutex-protected state, stock validation, checkout transactions, idempotency and legal order transitions.
- `backend/search.hpp`: ICU Unicode NFKC case folding, exact aliases before prefix and substring matching.
- `backend/help_bridge.hpp`: file descriptor, poll/read worker, explicit simulation/device selection and thread cleanup.
- `backend/help_trigger.cpp`: an actual POSIX write to a FIFO or character device, with explicit mode selection.
- `embedded/driver/sabka_help_driver.c`: kernel registration/cleanup, file operations, wait queue, poll and safe copying between userspace and kernel memory.

The HTTP server uses libsodium for random session tokens, not password hashing. SQLite stores JSON session documents plus product records and authoritative stock. Catalogue seeding inserts missing IDs and does not overwrite existing stock on restart. Keep existing databases to preserve orders. Tax is illustrative, not a verified tax schedule.

## Tests and observed evidence

Stop any demo server on 8080, then run:

```bash
bash backend/test.sh
```

Observed in Ubuntu 24.04 / GCC 13.3 during the October 4–5 work session:

- Backend, CLI, smoke client and help trigger compiled.
- Negative, zero, fractional and oversized add quantities rejected.
- Transactional checkout, same-key retry, one stock deduction, session isolation, valid/invalid transitions and cancellation stock restoration passed.
- Logout clears the demo profile while preserving orders/support; it does not revoke the anonymous session.
- FIFO targeting and acknowledgement persistence after restart passed.
- SIGTERM shutdown and order/support restart persistence passed.
- Scripted native CLI alias search, add/cart display, client restart, checkout, order display, support creation and help-trigger receipt passed.
- Existing frontend TypeScript check passed.

The test harness uses temporary databases and cookie files, not `backend/demo.sqlite`. It requires no `dist` directory or Node installation. It refuses to run while the demo endpoint is already active.

## Device-driver boundary

The current WSL kernel is `6.6.87.2-microsoft-standard-WSL2`. Its matching `/lib/modules/<kernel>/build` tree is missing. **No kernel module build or load has been verified.** FIFO success is not evidence of kernel-driver success.

On a compatible Linux machine with matching kernel build files, use `make -C embedded/driver`. Loading requires appropriate host privileges and policy; inspect and explain the change before using `insmod`. Do not change kernel, boot or signing settings merely to make the demonstration work. After a module is genuinely loaded, the backend can use `/dev/sabka_help` instead of `--fifo`, and the trigger can target `/dev/sabka_help`. This is write-triggered educational simulation, not a real GPIO interrupt.

## Remaining limits

Real account authentication and privileged admin access, complete reviewed translations, a live inventory feed, real payment/delivery, general conversational AI, and the real driver demonstration remain unfinished. The catalogue contains 160 sample entries, not 200 per subcategory. Images have source references; prices and ratings are unverified demo values. Native terminal menus do not reproduce the visual website or browser voice functions.
