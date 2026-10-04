# Sabka Bazaar — C++ / Linux Shopping Demonstration

**Where every family finds its favourites**

From daily essentials to little celebrations — sabke liye, sab kuch

The active storefront is rendered by C++17. Ordinary HTML forms call the same C++/SQLite shopping logic used by the native terminal client. No Node, React, TypeScript, browser JavaScript or Python is needed to build or run this version. HTML and CSS remain presentation formats; JSON is catalogue data and Bash/CMake are build/test orchestration, so do not describe every repository file as C++.

## Run on Ubuntu

Install dependencies once if absent:

```bash
sudo apt update
sudo apt install build-essential cmake pkg-config libcpp-httplib-dev nlohmann-json3-dev libsqlite3-dev libsodium-dev libicu-dev
```

From this repository's root in Ubuntu:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

Open **http://127.0.0.1:8080/**. Stop with Ctrl+C. The server is deliberately loopback-only. Run `backend/build/sabka_cli` in another Ubuntu terminal for the native C++ interface. Do not use the old npm commands or ports 3000–3004.

## Implemented

- Existing 160-product catalogue and local branded photographs.
- C++ Unicode-normalized alias search, department filter and price sorting.
- Product pages, persistent session cart and wishlist; Add to Cart becomes Go to Cart.
- Server-side stock checks, transactional demo checkout and duplicate-submit protection.
- Orders, simulated tracking, eligible cancellation and stock restoration.
- Persistent support tickets, demo profile and Easy Shopping controls.
- Paired Linux help events using descriptors, poll, a worker thread and graceful signal shutdown.
- HTML escaping, per-session form CSRF tokens and restrictive script-free page policy.

## Test

Stop the demo server first, then:

```bash
bash backend/test.sh
```

This launches isolated test databases and C++ test executables. Tests cover checkout, quantity bounds, stock, session isolation, cancellation, support, alias search, FIFO targeting, restart persistence, CLI flow and HTML forms. It does not load a kernel module.

## Architecture and files

- `backend/server.cpp`: HTTP routes, SQLite storage and transaction rules.
- `backend/web.hpp`: C++ page renderer and form controllers.
- `backend/cli.cpp`: native C++ terminal UI.
- `backend/search.hpp`: ICU normalization.
- `backend/help_bridge.hpp`, `backend/help_trigger.cpp`: Linux userspace event integration.
- `backend/smoke.cpp`, `backend/web_smoke.cpp`: compiled integration tests.
- `backend/catalogue.json`: preserved catalogue, translations/aliases and photo references.
- `public/store.css`, `public/images/`: presentation and preserved product photographs.
- `embedded/driver/sabka_help_driver.c`: educational C character-device source.
- `docs/`: historical implementation notes and evidence; this README and PROJECT_STATUS.md describe the current run path.

SQLite stores session documents and authoritative product stock. Seeding inserts missing IDs without resetting existing stock. Keep runtime databases/cookies out of Git. Payments, delivery, prices and stock are demonstrations, not live commercial services.

## Limits to present honestly

Profiles are not authenticated accounts. Secure login, session expiration and protected administrator functions remain pending. The English interface offers catalogue language selection, but many product translations fall back to English and need human review. Browser voice is unavailable in the JavaScript-free interface. Help events appear on page refresh; they do not automatically open a browser panel. Buy Now adds the item and opens checkout for the current cart. The catalogue is 160 products, not 200 per subcategory. No real payments, courier, agent, SMS or AI chatbot is connected.

The C driver has **not** been compiled/loaded on the current WSL kernel because matching kernel build files are absent. FIFO testing does not satisfy the real driver demonstration. Use a compatible Linux host to complete that requirement; do not change the kernel just to hide this limitation.

The previous React implementation is recoverable at commit `bf91a2bd4b1c729f9e68c8ea68d815c399acc573` and local branch `backup/before-server-rendered-cpp`. This conversion replaces the active interface, rather than disguising TypeScript as C++.
