# Sabka Bazaar — Embedded Linux C/C++ Kiosk

**Where every family finds its favourites**

Sabka Bazaar is a Linux shopping-kiosk training project. Its server, terminal interface, browser-page renderer, account handling, tests and device utilities are C++17. Its Linux character driver is C. The terminal demonstration does not require a browser. The optional website uses C++-generated HTML and static CSS; no React, TypeScript, JavaScript, Node or Python is required.

This is an embedded-Linux **application and device-interface prototype**, verified on Ubuntu/WSL x86-64. It has not been deployed to a physical embedded board and the kernel module has not been loaded. Do not claim physical GPIO or completed hardware verification.

## Build and run in Ubuntu

```bash
sudo apt update
sudo apt install build-essential cmake pkg-config libcpp-httplib-dev nlohmann-json3-dev libsqlite3-dev libsodium-dev libicu-dev
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j2
build/backend/sabka_diagnostics
build/backend/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

In a second Ubuntu terminal, from this repository:

```bash
build/backend/sabka_cli
```

Alternatively open http://127.0.0.1:8080/. The server binds only to loopback. Ctrl+C stops it gracefully. Existing `cmake -S backend -B backend/build` commands also remain supported.

## Native C++ demonstration

1. Start the backend with `--fifo` (explicit userspace simulation).
2. Run `sabka_cli`; select **10 Account** and register/login using a unique demo password.
3. Select **1 Search**, enter `tej patta`, then add `prod-bay-leaf` using menu 2.
4. Review cart and checkout using fictional details; payment and delivery are simulated.
5. Menu 9 creates support tickets, pairs this session with kiosk 101 and retrieves help events.
6. After pairing, run `build/backend/sabka_help_trigger --fifo` in a third terminal. Return to Help to see the targeted event.
7. Restart the application and log in again to show database persistence.

## Accounts and administration

Registration/login use libsodium Argon2id password hashing. Only password hashes are stored. Random login tokens are hashed in SQLite, expire after one hour and are revoked at logout. Account data survives logout and is isolated between users. Five failed logins for an email cause a ten-minute lockout. Guest shopping remains supported. This is still a loopback training service, not a hardened public deployment; no email verification or password reset is provided.

Register a separate demo administrator, stop the server, then deliberately promote that existing account using the local database-owner command:

```bash
build/backend/sabka_backend --make-admin backend/demo.sqlite your-demo-admin@example.test
```

Restart and log in to that account. Browser: Account → Administrator workspace. Terminal: menu 11. Administrators can advance **registered-account** orders and reply to registered-account support tickets. Shoppers can cancel their own eligible orders but cannot advance fulfilment. No web request can grant the admin role. The administrator workspace also adds/edits catalogue names, descriptions, prices, stock, local image paths and aliases. Enter a product ID to load an existing item or create a new one. Changes persist in SQLite; old order snapshots remain intact. Guest-ticket admin management remains pending.

## Embedded Linux components

- `embedded/driver/sabka_help_driver.c`: C character device, cdev registration, wait queue, read/write/poll, kernel/userspace copy and module cleanup.
- `embedded/driver/sabka_help_protocol.h`: shared 48-byte C/C++ event ABI.
- `backend/help_bridge.hpp`: RAII descriptor, nonblocking I/O, poll, worker thread, validated events and graceful shutdown.
- `backend/help_trigger.cpp`: explicit FIFO or kernel-device write utility.
- `backend/device_test.cpp`: real-device read/write/poll/backpressure test, compiled but not executed against a loaded module here.
- `backend/diagnostics.cpp`: compiled Linux readiness report.
- `embedded/systemd/sabka-bazaar.service`: optional per-user service; not installed or enabled automatically.

The current WSL kernel lacks `/lib/modules/<running-kernel>/build`. Real module build/load remains outstanding. See [embedded deployment](docs/EMBEDDED_LINUX.md), including matching-host requirements and the native versus simulated boundary.

## Tests

Stop the demo server first:

```bash
ctest --test-dir build --output-on-failure
SABKA_BUILD_DIR=build/backend bash backend/test.sh
```

C++ tests cover stock/quantity validation, idempotent checkout, cancellation, session isolation, Unicode aliases, support, FIFO targeting, event framing, account hashing/login/logout/expiry, forbidden admin operations, browser forms, escaped output and restart persistence. Kernel module tests are a separate outstanding requirement.

## Layout and libraries

`backend/`: C++ application, CLI, tests, catalogue and CMake. `public/`: preserved branded product images, static CSS and credits. `embedded/driver/`: C module/shared protocol. `embedded/systemd/`: deployment unit. `docs/`: architecture, evidence and historical notes. See AGENTS.md and PROJECT_STATUS.md before continuing work.

cpp-httplib handles HTTP; SQLite provides prepared statements/transactions; nlohmann-json stores structured data; ICU normalizes Unicode search; libsodium provides password hashing and random tokens; POSIX/C++ threads implement Linux event handling. CMake, Make, Bash test orchestration, JSON data, HTML/CSS and documentation are not falsely labelled C++.

## Honest limitations

160 sample products, not 200 per subcategory. Prices/stock/payment/tracking are demonstrations. Product language selection preserves existing translations/aliases, but full interface translation and human review remain pending. Local C++ voice upload/transcription is tested; live microphone capture is not yet verified. No real AI chat, SMS or callback. The paired browser can use Help → waiting mode for three-second server-driven event checks without JavaScript. Other pages do not automatically open a help popup. Saved addresses and product administration are available. Read-aloud and advanced catalogue import remain unfinished. No physical board/GPIO tests or real driver load has been completed. The previous React implementation remains recoverable in Git history at bf91a2b.

## Development storefront restoration

See [restoration audit](docs/RESTORATION_AUDIT.md) for current feature parity and test evidence. The development browser interface restores visible English/Hindi/Odia controls, departments/subcategories, account pages and richer product views using C++ HTML generation. Complete translation review, voice recognition and exact visual parity are still pending. No Qt installation is required. Build/run commands above remain valid.

## Restored shopping flows

Buy Now checks out one selected product without consuming the existing cart. Saved addresses can be entered under Account and selected at checkout. Checkout, tracking and support controls include local Hindi/Odia text; translations still require human review and some technical/admin labels remain English. Product editing is protected by the existing server-side administrator role.

Voice Search supports local WAV transcription through whisper.cpp, with review before searching. See [voice setup and observed limits](docs/VOICE_SETUP.md). Live microphone capture needs alsa-utils and a working Linux audio device. No microphone test is claimed.

Product cards/details now provide local English/Hindi/Odia read-aloud through native eSpeak NG and an HTML audio player. Setup and observed limits: [Voice setup](docs/VOICE_SETUP.md). No microphone or browser scripts are required for read-aloud.
