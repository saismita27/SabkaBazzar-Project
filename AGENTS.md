# AGENTS.md — Sabka Bazaar

Read README.md and PROJECT_STATUS.md before editing. Continue this existing project; preserve user work and photos. Latest user explicitly requested conversion to C/C++.

## Purpose and implementation

A multilingual product-discovery and accessible shopping demonstration for Linux training. The active browser pages and application logic are C++17, with a native C++ terminal client and educational C driver. No Python, React, TypeScript, browser JavaScript or Node requirement should be reintroduced without user authorization. HTML/CSS are presentation and JSON is data; do not pretend these are C++ files.

Libraries: cpp-httplib (HTTP), SQLite (persistent transactions), nlohmann-json (data), libsodium (session randomness), ICU (Unicode normalization), POSIX and C++ threads (help listener and shutdown).

## Folder structure

backend/: server.cpp storage/API; web.hpp page renderer/forms; cli.cpp terminal client; search.hpp normalization; help_bridge.hpp and help_trigger.cpp Linux event handling; smoke.cpp and web_smoke.cpp tests; catalogue.json preserved data.
public/: store.css, local product photographs and credits.
embedded/driver/: C educational character-device module.
embedded/system_service and embedded/systemd: legacy standalone exercises, not current deployment.
docs/: documentation and historical verification/photo source records.

## Completed

Catalogue, alias search, department filtering, price sorting, product pages, cart/wishlist, stock validation, transaction/idempotent mock checkout, persisted orders, simulated tracking/cancellation, support tickets, demo profile, Easy Shopping and paired userspace help events. C++ CLI and browser-form tests run on Ubuntu.

## Pending / known issues

No genuine authentication or protected admin. UI instructions English; catalogue translations unreviewed/fallback. Voice unavailable without native replacement. Help opens on manual refresh. Advanced variants/saved addresses/admin management need fuller browser controls. Only 160 sample records, not requested 200 per subcategory. Real driver build/load remains untested due to absent matching WSL kernel build tree. Never claim simulation is real GPIO or a completed module test.

## Safe run/configuration

From Ubuntu repository root:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
# second terminal
backend/build/sabka_cli
# after pairing
backend/build/sabka_help_trigger --fifo
# stop server before tests
bash backend/test.sh
```

Browser http://127.0.0.1:8080/. No npm commands. SQLite clients/products store JSON and authoritative stock; WAL enabled. Seed does not reset existing IDs/stock. Private CLI session /tmp/sabka-cli-<uid>.session, override SABKA_SESSION_FILE. FIFO /tmp/sabka-backend-<uid>/help.fifo. Keep databases, sessions, secrets and binaries out of Git. Bind only loopback until real security is implemented.

## Decisions / must preserve

- Reuse C++ Store for both interfaces; do not duplicate pricing/stock business rules.
- Integer paise calculations, prepared statements, atomic stock/order changes, checkout idempotency.
- Form CSRF validation, escaped HTML and restrictive no-script CSP.
- Preserve photo/product associations and existing data. Prior React code remains at bf91a2b / backup/before-server-rendered-cpp.
- Explain and obtain necessary authorization before changing kernel/boot/security configuration or loading a module.
- Clearly label simulated payment, tracking, support and demo profiles; no fabricated test or product verification claims.

## UI/UX direction

Warm cream/orange, clean product cards, readable controls, responsive layout, keyboard focus, language/Easy Shopping options, Help on every page and Add to Cart becoming Go to Cart. Preserve approved copy without trailing full stops:
Where every family finds its favourites
From daily essentials to little celebrations — sabke liye, sab kuch
