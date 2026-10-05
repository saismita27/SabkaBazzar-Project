# AGENTS.md — Sabka Bazaar C/C++ Linux kiosk

Read README.md and PROJECT_STATUS.md before editing. Preserve the existing project, catalogue and photos. Latest user explicitly requested C/C++ Linux/embedded conversion. Do not reintroduce Python, React, TypeScript, JavaScript or Node application dependencies. Do not fake language percentages or call HTML/CSS/JSON C++.

## Purpose and technologies

A multilingual product-discovery and accessible shopping-kiosk training project. Application logic, native interface, optional browser renderer, account handling and device utilities are C++17. The kernel driver is C. Linux/POSIX descriptors, poll, worker threads, mutexes, signal shutdown and an optional systemd unit form the integrated systems component. cpp-httplib handles HTTP; SQLite persistence/transactions; ICU normalization; nlohmann-json data; libsodium Argon2id passwords and session randomness.

## Structure

- Root CMakeLists.txt: Linux-only build and backend subdirectory.
- backend/server.cpp: Store, HTTP APIs, SQLite transactions and application entry point.
- backend/accounts.hpp: credentials, hashed expiring sessions, login throttling and server-side roles.
- backend/cli.cpp: native C++ shopping/account/admin menus.
- backend/web.hpp: escaped C++ HTML renderer, CSRF-protected forms, no scripts.
- backend/help_bridge.hpp, help_protocol.hpp: poll worker, validation and bounded FIFO framing.
- backend/help_trigger.cpp, device_test.cpp, diagnostics.cpp: compiled Linux utilities.
- backend/*smoke.cpp, protocol_test.cpp: meaningful compiled tests.
- backend/catalogue.json and public/: preserved 160 records, product photos, CSS, credits.
- embedded/driver/: C module and shared sabka_help_protocol.h.
- embedded/systemd/sabka-bazaar.service: optional current per-user FIFO service.
- Other embedded/system_service and sabka_kiosk.service files are historical exercises, not current deployment.
- docs/: current EMBEDDED_LINUX.md plus historical notes.

## Completed / tested

C++ catalogue/Unicode alias search, department filtering/sorting, cart/wishlist, stock checks, idempotent transactional mock checkout, persisted orders, cancellation, support, paired help events, native and browser interfaces. Registration/login with Argon2id, hashed one-hour sessions, logout revocation and role checks. Registered-account administrators can advance orders/reply to tickets. Clean Ubuntu build and integration/protocol/account/form tests passed; consult PROJECT_STATUS.md for observations.

## Pending / limitations

Real module build/load and physical board/GPIO testing are outstanding: current WSL matching kernel build tree absent. No real payments/courier/agent/AI. Only 160 sample products. Full translations, voice, automatic browser help opening, product-admin controls, advanced variant/address UI and guest-ticket admin inbox remain incomplete. No email verification/password recovery/public security audit. Do not mark these completed. Service files exist but were not installed/enabled on the user's host.

## Commands / safe configuration

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j2
build/backend/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
# second terminal
build/backend/sabka_cli
# stop demo first
SABKA_BUILD_DIR=build/backend bash backend/test.sh
ctest --test-dir build --output-on-failure
```

Native menus 10 (accounts), 11 (registered administrator). Browser http://127.0.0.1:8080/. No npm commands. Backend-only build remains supported. Runtime database: clients/products plus accounts/logins/auth_attempts. Account data uses distinct owner keys; login tokens are hashed in the login table. Do not log passwords/session tokens or commit databases. Native session file defaults /tmp/sabka-cli-<uid>.session (0600); SABKA_SESSION_FILE overrides it. FIFO /tmp/sabka-backend-<uid>/help.fifo. SQLite seed does not reset existing stock. Bind only loopback until separately hardened.

## Must preserve / design decisions

Use shared Store rules for both interfaces. Prepared statements, integer paise totals, stock/order transaction, idempotency, strict role authorization, CSRF and HTML escaping must remain. A profile field must never grant authorization. Admin role requires explicit local operator promotion, never a registration parameter. Preserve existing data/photos and prior Git history. Never change kernel/boot/security settings or load a module without explaining and obtaining necessary authorization. Distinguish FIFO, write-triggered kernel device and real GPIO evidence.

UI: cream/orange, readable controls, keyboard focus, responsive full pages, Easy Shopping, visible help/account and Go to Cart state. Approved branding without trailing full stops:
Where every family finds its favourites
From daily essentials to little celebrations — sabke liye, sab kuch
