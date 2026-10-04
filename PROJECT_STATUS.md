# Sabka Bazaar — Project Status

Updated for the October 4–5, 2026 work session. Read this with AGENTS.md before editing.

## Current state

The same C++17/SQLite shopping backend now serves two interfaces:

- **Native Linux C++ CLI**, which builds and runs without Node, React, TypeScript or a browser. Search, cart, wishlist, simulated checkout, orders, tracking/cancellation and support/kiosk operations are implemented.
- **Preserved React/TypeScript storefront**, connected through `src/backend/useCppStore.ts` when built using `npm run build:cpp`. Default `npm run dev` remains the older browser-local mode.

The backend validates stock, calculates totals, creates orders transactionally, handles duplicate checkout keys, ranks Unicode-normalized names/aliases, isolates anonymous session state and persists data in SQLite. The integrated Linux poll/read worker targets the last explicitly paired session. The C driver source exists but kernel build/load testing is blocked by missing matching WSL kernel build files.

This is a mixed-language repository with a native C++ execution path. Do not claim the entire repository satisfies an only-C/C++ rule, that the kernel driver was tested, or that the prototype is production-ready.

## What I was working on last

Time-boxed native C++ delivery while preserving the website. Added `sabka_cli` and `sabka_help_trigger`. Fixed demo logout erasing order/support history, added persisted help-event acknowledgements, rejected invalid/overflowing quantities, made integration tests independent of frontend assets, and corrected VS Code's obsolete absolute source path. Updated the requested continuation documents.

## Next 5 tasks

1. Demonstrate and rehearse the native C++ path in `docs/NATIVE_LINUX.md`; get trainer guidance on the preserved optional TypeScript website.
2. Compile/load/test the existing C driver on a compatible Linux kernel, then test `/dev/sabka_help` with the integrated backend. Record real output.
3. Implement genuine account authentication, session expiry/revocation and protected administrator authorization. Current profiles and controls are demonstrations.
4. Review translations and accessibility with humans; expand the alias-query test dataset and native menu localization.
5. Harden persistence/configuration: catalogue updates without resetting stock, automatic frontend stock refresh, durable kiosk pairing policy and broader concurrency/sanitizer tests.

## Known problems

- Driver module build/load remains untested on WSL because matching build files are missing. No GPIO hardware integration.
- Anonymous session cookies are not authenticated accounts. Logout only clears the demo profile; the session retains shopping history.
- Simulated admin/order/support controls have no protected administrator role.
- Native menus are English. Voice features remain optional browser capabilities, not part of the CLI.
- Price/rating/stock values are demonstration data; only 160 catalogue entries exist.
- Browser inventory labels may lag other sessions. Server checks stock again at checkout.
- Kiosk binding resets on server restart. Terminal retrieves events when Help opens. Acknowledgements persist; last pairing wins.
- Default npm development mode uses browser-local state; build:cpp is necessary for the connected website.
- Existing Vite bundle-size warning, incomplete language review, no formal accessibility audit.
- Existing `embedded/system_service` and its old systemd sample are legacy standalone exercises. The integrated path is `backend/help_bridge.hpp`; do not install the old root-running service as the current deployment.

## Files recently modified

- `backend/cli.cpp`: native Linux shopping client and private session file.
- `backend/help_trigger.cpp`: explicit C++ FIFO/device event writer.
- `backend/CMakeLists.txt`: CLI/trigger targets alongside backend and smoke client.
- `backend/server.cpp`: native-only hosting option, history-preserving logout, acknowledgements, quantity bounds.
- `backend/smoke.cpp`, `backend/test.sh`: backend regressions and scripted native flow.
- `src/backend/useCppStore.ts`: acknowledge received help events.
- `.vscode/settings.json`: portable backend CMake directory.
- `.gitattributes`: LF conventions for Linux source/docs.
- `README.md`, `docs/NATIVE_LINUX.md`, `docs/CPP_MIGRATION.md`, `AGENTS.md`, this file: run instructions, evidence and limitations.

## Verified during this update

Ubuntu Debug build completed for all four C++ targets. Integration tests passed invalid quantities, checkout/idempotency, stock deduction/restoration, independent-session orders, transition rejection, header protection, alias search, FIFO targeting, help acknowledgements, logout history, graceful shutdown and restart persistence. Scripted CLI tests passed search, cart persistence, checkout, order display, support and paired help reception. TypeScript type checking passed. No kernel-module test or production security claim is implied.

## Run / database

From repository root in Ubuntu:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json - --fifo
```

Second Ubuntu terminal: `backend/build/sabka_cli`. Stop the server before `bash backend/test.sh`. See `docs/NATIVE_LINUX.md` for dependencies and a five-minute walkthrough. Runtime databases, session cookies, dependencies and generated binaries must remain outside Git.
