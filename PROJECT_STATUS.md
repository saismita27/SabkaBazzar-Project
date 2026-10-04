# Project Status — October 5, 2026

## Current state

C++17 now renders the active browser storefront and handles HTML form actions. There is no active React/TypeScript/JavaScript application dependency. The native C++ CLI shares the same SQLite backend. Existing 160 products and local photographs are preserved. HTML/CSS presentation, JSON data, CMake and Bash orchestration remain.

## What I was working on last

Replaced the React storefront with C++ server-rendered catalogue/search, product, wishlist, cart, checkout, orders, support and demo profile pages. Added form CSRF checks, HTML escaping and page CSP. Preserved previous implementation in Git history/backup branch. Ubuntu build, backend/CLI regressions and new compiled HTML-form tests passed on October 5.

## Next 5 tasks

1. Genuine password authentication, expiring/revocable sessions and protected admin controls.
2. Compile/load/test the C driver on a compatible Linux host; current WSL matching build tree is missing.
3. Complete interface translations, review product text and accessibility with speakers/users.
4. Port remaining advanced product controls, saved-address management and admin catalogue/support editing into C++ pages.
5. Add a native speech solution if needed, larger verified catalogue and broader concurrency/sanitizer coverage.

## Known problems

This is a working shopping demonstration, not completion of every original requirement. Profiles are anonymous-session demos; order advancement is labelled demo control. Browser voice, automatic help-panel opening, full UI translation and secure admin are unavailable. Help requires refresh; kiosk pairing resets on restart. Buy Now checks out the current cart. Catalogue prices are samples and only 160 records exist. Real kernel module tests remain outstanding. The layout now uses full pages rather than React dialogs.

## Files recently modified

backend/web.hpp, backend/web_smoke.cpp, backend/server.cpp, backend/CMakeLists.txt, backend/test.sh, public/store.css, README.md, AGENTS.md, PROJECT_STATUS.md and RUNNING_ON_DESKTOP.md. React source/build manifests removed from the active tree; prior commit bf91a2b preserves them.

## Verification evidence

Ubuntu GCC build passed. C++ backend tests passed quantity bounds, duplicate checkout/stock, cancellation, session isolation, Unicode alias search, support, help targeting/acknowledgement, SIGTERM and restart persistence. C++ HTML tests passed homepage/no script, CSRF rejection, alias search, Go to Cart, repeat checkout only creating one order, escaped support text, CSP and page responses. Native CLI shopping/support/help tests passed. Test run directory: /tmp/tmp.GrbpUvlHdM (temporary local evidence). No driver build/load claim.

## Run

See README.md for dependencies. In Ubuntu at repository root:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

Browse http://127.0.0.1:8080/. Stop before `bash backend/test.sh`. Database and session files are excluded from Git.
