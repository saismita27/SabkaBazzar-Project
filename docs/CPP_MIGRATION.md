# C++ migration evidence — October 4, 2026

## What moved

In C++ mode, the frontend sends operations to POST /api/action. C++ validates and persists:
cart add/set/remove/clear; wishlist toggle; profile/address data; checkout; cancellation and tracking state transitions; support creation/replies.

GET /api/products performs Unicode-normalized alias/name/brand ranking and category/subcategory filtering.
GET /api/state retrieves the anonymous session's SQLite-backed state.
GET /api/health identifies C++17 and SQLite.

The frontend remains TypeScript and still renders cards, dialogs, translations and browser speech.
Default npm run dev is the legacy browser-local version. npm run build:cpp creates the connected version.

## Architecture

Browser UI -> localhost C++ HTTP server -> SQLite
Linux FIFO (or optional /dev/sabka_help) -> C++ poll/read worker -> paired session event -> browser Help panel

A mutex serializes SQLite access across HTTP workers and the help worker.
BEGIN IMMEDIATE / COMMIT surrounds cart/order mutations; exceptions trigger ROLLBACK.
Prepared-statement destruction finalizes SQLite statements. HelpBridge destruction joins its worker and closes the descriptor.
SIGINT/SIGTERM are blocked before worker creation; sigwait stops the HTTP server and shutdown joins workers.

## Observed tests

Compiled with Ubuntu GCC 13.3.0; TypeScript typecheck and production frontend build passed.
The C++ smoke suite passed checkout, empty cart after checkout, same-key retry, stock deducted once, independent session order isolation, invalid tracking rejection, cancellation stock restoration, repeated cancellation rejection and mismatched idempotency payload rejection.
FIFO input delivered a persisted help event only to the paired session.
Alias query tej patta returned results.
SIGTERM shutdown completed; restarting against the same database retained the order and support ticket.
Browser observation: C++ mode served the preserved storefront and adding a cart item survived page reload.

The Vite build reports the existing large-bundle warning; it is not a test failure.
No kernel module was compiled or loaded. Matching WSL kernel headers remain missing.
No claims of production authentication, secure admin authorization, actual GPIO, real payments, translation accuracy or 80% C++.

## Short demonstration

1. Show backend/server.cpp and backend/CMakeLists.txt.
2. Run the server from Ubuntu; open localhost:8080.
3. Search tej patta; add a product; open Cart.
4. Perform a simulated checkout with fictional details; show saved order and timeline.
5. Pair the kiosk with the footer simulator button; send HELP into the FIFO from another Ubuntu terminal.
6. Show backend/test.sh and its actual output.
7. Explain the C driver source and explicitly state the untested module limitation.

## Dependency purpose

cpp-httplib: HTTP parsing and serving; SQLite: persistent transactions; nlohmann-json: request/response serialization; libsodium: unpredictable session IDs (not password authentication here); ICU: Unicode normalization; POSIX/Linux APIs: descriptors, poll, signals and threads.

## Remaining work

Authenticated accounts, privileged admin boundary, help acknowledgement persistence, full normalized schema, runtime catalogue refresh after stock changes, product editing, real kernel-driver test on a compatible host, full accessibility/language review, and removal/rewrite of the frontend if the trainer requires only C/C++.
