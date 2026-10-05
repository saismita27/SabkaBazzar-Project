# Sabka Bazaar — C++ Linux shopping backend and multilingual storefront

The existing visual storefront is preserved. The new **C++17 Linux backend** performs catalogue search, cart validation, price calculations, transactional checkout, stock changes, order transitions, wishlist, address and support persistence. SQLite is authoritative in C++ mode.

**This repository is still mixed-language:** the UI uses React/TypeScript, HTML and CSS. It does not satisfy a strict “only C/C++” rule without a trainer-approved UI exception. No 80% claim is made. Profiles and administrator controls are local demonstrations, not production authentication.

## Run this version

From this project directory in VS Code PowerShell (Node 22.12+):

```powershell
npm ci
npm run build:cpp
wsl -d Ubuntu
```

Then in Ubuntu:

```bash
cd '/mnt/c/Users/saism/OneDrive/Desktop/wipro project/sabka-bazzar-multilingual accessible shopping'
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json dist --fifo
```

Open **http://127.0.0.1:3000/**. Keep the Ubuntu terminal running. Ctrl+C stops the server gracefully. Do not run two servers on port 8080.

On a native Linux machine with Node 22.12+ installed, the frontend build commands also run there. Do not copy Windows node_modules to Linux: install dependencies on the target platform.

Existing Ubuntu dependencies: g++ 13.3, CMake 3.28, cpp-httplib 0.14.3, SQLite 3.45.1, libsodium 1.0.18, nlohmann-json 3.11.3, ICU 74.2. For a fresh Ubuntu installation:

```bash
sudo apt update
sudo apt install build-essential cmake pkg-config libcpp-httplib-dev libsqlite3-dev libsodium-dev nlohmann-json3-dev libicu-dev curl
```

## Demonstrate Linux help events

1. Start with --fifo as above. This explicitly selects a **userspace simulator**.
2. In the intended browser, click the existing **Simulate Kiosk Hardware Help** footer button once. In C++ mode this also pairs that browser session with kiosk 101.
3. Close the help panel.
4. In a second Ubuntu terminal:

```bash
printf 'HELP\n' > /tmp/sabka-backend-$(id -u)/help.fifo
```

The C++ worker waits with poll(), reads the FIFO, persists an event to SQLite, and the paired browser's polling opens Help. Other sessions do not receive it. Pairing is one active session, last explicit pairing wins, and resets when the server restarts. Already delivered events may reappear on page reload; acknowledgement persistence is not implemented.

To use the real driver on a compatible Linux host, replace --fifo with /dev/sabka_help. The existing C driver is write-triggered educational hardware simulation, not genuine GPIO. The driver **has not been built or loaded on this WSL kernel** because the matching build tree is missing. Do not claim the FIFO test validates kernel behaviour.

## Repeat tests

Stop the demo first, then:

```bash
bash backend/test.sh
```

The C++ smoke client checks invalid quantities, checkout, duplicate prevention, stock deduction/restoration, invalid transitions, session isolation, request-header protection, alias search, FIFO session targeting, graceful termination and order/support persistence after restart. Temporary test databases are outside the project; the real demo database is not touched.

## Code map

- backend/server.cpp: HTTP handlers, SQLite prepared statements, RAII cleanup, serialized transactions and business rules.
- backend/search.hpp: ICU Unicode NFKC case-folding and exact/prefix/substring ranking.
- backend/help_bridge.hpp: Linux file descriptors, explicit FIFO/device mode, poll/read, worker lifetime and shutdown.
- backend/smoke.cpp: C++ integration client.
- backend/catalogue.json: existing 160 products, with original images and sample prices.
- src/backend/useCppStore.ts: thin UI request adapter and help-event polling.
- embedded/driver/sabka_help_driver.c: C device driver source with wait queue, poll and copy_to_user.
- docs/CPP_MIGRATION.md: architecture, evidence and limitations.



## Project Architecture

Sabka Bazaar currently follows a layered local-demo architecture. The existing React/TypeScript storefront is preserved as the presentation layer, while the main shopping operations are handled by the C++17 backend running on Linux.

```text
                         SABKA BAZAAR ARCHITECTURE

┌──────────────────────────────────────────────────────────────┐
│                         USER / BROWSER                       │
│                                                              │
│  Login/Profile Demo │ Search │ Categories │ Cart │ Wishlist  │
│  Checkout │ Orders │ Support │ Language UI │ Easy Shopping   │
└───────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND / PRESENTATION LAYER             │
│                                                              │
│  React + TypeScript + HTML + CSS                             │
│  Existing visual storefront                                  │
│                                                              │
│  src/backend/useCppStore.ts                                  │
│  • Sends requests to the C++ backend                         │
│  • Receives shopping data                                    │
│  • Polls for Linux help events                               │
└───────────────────────────────┬──────────────────────────────┘
                                │
                         HTTP / JSON requests
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    C++17 APPLICATION LAYER                   │
│                                                              │
│  backend/server.cpp                                          │
│                                                              │
│  • HTTP request handling                                     │
│  • Session management                                        │
│  • Product catalogue access                                  │
│  • Cart validation                                           │
│  • Wishlist operations                                       │ 
│  • Price calculation                                         │
│  • Checkout                                                  │
│  • Stock updates                                             │
│  • Order state transitions                                   │
│  • Address persistence                                       │
│  • Support ticket persistence                                │
│  • Business-rule validation                                  │
└───────────────┬───────────────────────┬──────────────────────┘
                │                       │
                ▼                       ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│      SEARCH MODULE       │   │       LINUX HELP MODULE      │
│                          │   │                              │
│ backend/search.hpp       │   │ backend/help_bridge.hpp      │
│                          │   │                              │
│ • Unicode normalization  │   │ • Linux file descriptors     │
│ • ICU NFKC case-folding  │   │ • poll()/read()              │
│ • Alias matching         │   │ • FIFO/device mode           │
│ • Exact ranking          │   │ • Worker lifecycle           │
│ • Prefix ranking         │   │ • Graceful shutdown          │
│ • Substring ranking      │   │                              │
└───────────────┬──────────┘   └──────────────┬───────────────┘
                │                             │
                ▼                             ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│        SQLite DB         │   │  EMBEDDED / DEVICE LAYER     │
│                          │   │                              │
│ • Sessions               │   │ FIFO simulator               │
│ • Products               │   │ /tmp/.../help.fifo           │
│ • Product stock          │   │                              │
│ • Cart                   │   │ OR                           │
│ • Wishlist               │   │                              │
│ • Orders                 │   │ /dev/sabka_help              │
│ • Addresses              │   │ Linux C driver source        │
│ • Support records        │   │                              │
└──────────────────────────┘   └──────────────────────────────┘

## Design and limits

Sessions use a random libsodium-generated HttpOnly, SameSite cookie. This isolates browser sessions, but does not verify identity. There is no password authentication or protected administrator role. Support replies and order advancement remain simulation controls scoped to the same session. Loopback-only, for a local demo; do not expose this server publicly.

The server takes product IDs and quantities, looks up prices itself, uses integer paise for totals, and commits stock plus order/session state together. A repeated checkout key returns the existing result; changed address/payment using that key is rejected. Tax is an illustrative rounded 5%, not a verified tax schedule.

Client records are JSON documents inside SQLite; product stock is a separate table. This is intentionally a small prototype, not a fully normalized commerce schema. There are no real payments, deliveries, calls or AI agents.

The browser UI's sample stock labels can lag other sessions; the server validates stock at cart changes and checkout. The original browser-only mode remains available with npm run dev. Its state is separate from the C++ database. Historic repair/stage documents describe earlier work and plans, not proof of current completion.

The catalogue's prices/ratings are demonstration values, not verified live prices. Photo references are in docs and public/photo-credits.html. Language coverage and accessibility require human review.

## Backup

The original uploaded site is preserved on local branch backup/react-before-cpp. Generated binaries, databases, dist, node_modules and secrets are excluded from Git.
