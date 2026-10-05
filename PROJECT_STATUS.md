# Project Status — October 5, 2026

## Current state

Sabka Bazaar now builds as a Linux C/C++ project from the root CMakeLists.txt. C++17 implements the native terminal client, shopping backend, optional HTML page renderer, account/session handling, device utilities and tests. C implements the educational character driver. No Node, TypeScript, JavaScript or Python application runtime is needed. HTML/CSS presentation and JSON data remain; these are not disguised as C++.

The project is an embedded-Linux kiosk prototype tested on Ubuntu/WSL x86-64, not a verified physical-board deployment. The current kernel's matching build tree and /dev/sabka_help are absent, so real module build/load remains outstanding.

## What I was working on last

Strengthened the Linux/device integration: shared 48-byte C/C++ event ABI, exact command validation, bounded FIFO framing, kernel-record validation and metadata persistence. Added native diagnostics, protocol unit test, real-device test executable, root build/install rules and optional per-user systemd unit. Implemented Argon2id registration/login, hashed one-hour sessions, logout revocation, login lockout and protected registered-account admin order/support controls in both C++ interfaces.

## Next 5 tasks

1. On an authorized compatible Linux host, compile/load the driver and run sabka_device_test --device; record actual results.
2. Verify on the intended embedded board and add real GPIO/IRQ support only with a defined board/pin specification.
3. Finish product-management, guest-ticket admin handling, variant/address controls and reordering in the C++ interfaces.
4. Complete/review interface translations and assess accessibility with speakers/users; choose a native voice implementation if still required.
5. Add broader concurrency/sanitizer tests, account recovery/email verification and deployment hardening before any public hosting.

## Known problems

No real driver or physical GPIO test completed. No public deployment/security audit. Guest shopping remains available; guest tickets/orders are not in the registered-account admin inbox. Email ownership/password reset are not implemented. Legacy demo profile API is not authentication and cannot grant admin rights. Only 160 sample products, not 200 per subcategory; prices/stock/payment/tracking are simulated. Full UI translations, voice, automatic help popup, advanced catalogue controls remain pending. Pairing resets on restart/logout and only the latest help event is retained. Browser help requires refresh; CLI retrieves it in Help. Buy Now checks out the current cart.

## Files recently modified

CMakeLists.txt; backend/accounts.hpp, server.cpp, cli.cpp, web.hpp, help_bridge.hpp, help_protocol.hpp, diagnostics.cpp, device_test.cpp, protocol_test.cpp, auth_smoke.cpp, smoke.cpp, test.sh and CMakeLists.txt; embedded/driver/sabka_help_protocol.h and sabka_help_driver.c; embedded/systemd/sabka-bazaar.service; README.md, AGENTS.md, docs/EMBEDDED_LINUX.md and this status document.

## Observed verification

- Clean Ubuntu root build: all nine C++ executables compiled successfully.
- CTest protocol test passed partial/combined FIFO commands, malformed/oversized input recovery and shared ABI checks.
- Full integration suite passed on October 5: stock, idempotency, isolation, cancellation, aliases, support, FIFO, shutdown/restart, native CLI and HTML forms.
- Account tests passed registration, Argon2id storage, login persistence, cookie rotation, old guest isolation, invalid password, duplicate registration, forbidden role elevation/admin access, admin order/support actions, logout revocation and expired sessions. C++ registration form and required request header also passed.
- Final integration run logs/database: /tmp/tmp.zX5BTjxV3V (temporary local evidence, not committed).
- Diagnostics observed kernel 6.6.87.2-microsoft-standard-WSL2, x86-64, systemd PID 1, missing matching build tree and absent character device. No kernel test success is claimed.

## Run

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j2
build/backend/sabka_diagnostics
build/backend/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
# second Ubuntu terminal
build/backend/sabka_cli
```

Optional browser http://127.0.0.1:8080/. Stop the server before `SABKA_BUILD_DIR=build/backend bash backend/test.sh`. Native account menu 10; registered administrator menu 11. See README.md for the explicit local account-promotion command. No service has been installed/enabled and no kernel/boot configuration changed.

Installation evidence: a staged `cmake --install build --prefix <temporary-directory>` produced the native binaries, catalogue and assets. `systemd-analyze --user verify` passed for a copy pointing to that staging prefix. The packaged diagnostics ran; the device test returned explicit skip status 77 because the character device is absent. Staging evidence: /tmp/tmp.RUZYEps2SX. No user service was installed or enabled.
