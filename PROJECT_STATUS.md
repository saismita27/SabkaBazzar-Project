# Project Status — development, October 6, 2026

## Current state

C++17 Linux application, SQLite, server-rendered HTML/CSS, no JavaScript/TypeScript/Node/Python application runtime. Original 160 products/photos preserved. The minimal C kernel driver is permitted for the driver requirement. All work remains on development; main and backup/project-snapshot are protected.

IMPLEMENTED / TESTED: authentication/session isolation; catalogue/aliases; named departments/subcategories; prominent English/Hindi/Odia controls and Easy Shopping; product details, variants and references; cart/wishlist; transactional checkout, duplicate prevention, persisted orders; separate Buy Now basket preserving the cart; saved-address validation and checkout prefill; administrator catalogue price/stock/name/description/alias editing; order/support administration; support tickets; paired FIFO help and a JavaScript-free waiting screen; graceful shutdown/restart. All catalogue image URLs returned successfully in integration tests.

Voice PROTOTYPE: actual local whisper.cpp transcription through WAV upload was tested with the public JFK sample, including editable transcript, playback and invalid-upload rejection. Explicit-consent rejection was tested without recording. Live microphone capture is NOT TESTED: alsa-utils is missing; user installation was requested. Odia recognition is unsupported in this integration. See docs/VOICE_SETUP.md.

SIMULATED: payments, stock/price data, delivery tracking, SMS/callback, FIFO hardware events. Real driver load and physical GPIO are NOT TESTED: matching WSL kernel build tree/device absent.

## What I was working on last

Added local native read-aloud on product cards/details with CSRF protection, timeouts and ordinary HTML audio playback. Restored checkout/support/status translations and important validation messages, saved addresses, isolated Buy Now, protected product administration, help waiting mode and a real local C++ speech-recognition integration. Retained existing secure backend logic and old order snapshots. Browser behaviour uses ordinary forms/HTML, not client scripts.

## Next 5 tasks

1. User installs ALSA tools and explicitly tests the intended microphone; verify WSL audio routing.
2. Obtain human review of Hindi/Odia translations and aliases; complete remaining technical/admin English labels.
3. Review synthesized pronunciation and improve responsive reference parity and accessibility through user testing.
4. Verify the real kernel module on a compatible authorized Linux machine/board.
5. Improve guest-ticket admin coverage, catalogue import, account recovery and deployment hardening.

## Known problems

No claim of exact pixel parity or full translation coverage. Buy Now currently buys one selected unit; ordinary cart supports quantity changes. Read-aloud WAV generation is tested in English/Hindi/Odia; pronunciation needs human review. Some operational/admin/voice labels remain English. 160 sample products, not 200 per subcategory. No real payments/courier/agent/callback/GPIO. No public security audit or email verification/reset. Voice may misrecognize speech; users review text. Pairing resets on restart/logout and retains only the latest help event. Automatic event navigation operates in the dedicated waiting screen, not every shopping page.

## Files recently modified

backend/server.cpp, web.hpp, ui_errors.hpp, voice_routes.hpp, voice_smoke.cpp, web_smoke.cpp, auth_smoke.cpp, CMakeLists.txt; public/store.css; README.md, AGENTS.md, docs/VOICE_SETUP.md, docs/RESTORATION_AUDIT.md and this file.

## Observed verification

Root Ubuntu CMake build passed for all ten C++ executables. Expanded backend/test.sh and CTest passed. Coverage includes existing account/order/support/FIFO/restart checks plus all image URLs, admin rejection/price-and-alias persistence/negative-stock rejection, address prefill, Buy Now cart isolation and repeated checkout, voice consent rejection and help waiting refresh. Latest regression evidence: /tmp/tmp.Q7MavueOuJ (temporary). Real whisper.cpp source revision 60c0be6ac8fa71b1a2ae2dd938a31a34a508e774 with multilingual tiny model passed the C++ multipart upload transcription fixture. No user microphone was used. External engine/model are in the user's cache, not the Git repository.

## Run in Ubuntu, from project root

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j2
build/backend/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

Open http://127.0.0.1:8080/. Use the existing database path consistently; the earlier no-argument launch used sabka.sqlite. Do not switch databases unintentionally. Stop the demo before `SABKA_BUILD_DIR=build/backend bash backend/test.sh`. No npm or Qt is required. Never change protected Git branches.
Latest verification: all shopping/account/FIFO/restart regression checks and CTest passed again. Native read-aloud generated WAV audio for en, hi and or; rejected missing CSRF and invalid products. Evidence directory /tmp/tmp.YqBm9t6Ji1 is temporary. Microphone capture and real kernel module remain NOT TESTED.

## October 6 search checkpoint

Shared C++ search ranking now prioritizes normalized canonical names, literal exact aliases, normalized aliases, prefixes, substrings, then brand discovery. Browser and JSON API use the same function. Category/subcategory and selected price sort persist in sorting forms. New compiled fixtures cover ranking tiers, Hindi/Odia aliases, Unicode compatibility, whitespace and no-match cases. All eleven executables built; both CTest checks and the full shopping/account/FIFO/restart integration suite passed. Evidence: /tmp/tmp.RSKSjDcp7N (temporary). Microphone tools and matching kernel build tree are still absent.

## October 6 screenshot theme restoration

Recreated the reference's dark delivery strip, gradient logo/buttons, two-row header, full-width search, horizontal department pills, cream split hero and three preserved product-photo tiles. Added the eight-language dropdown (English, Hindi, Odia, Marathi, Bengali, Tamil, Telugu, Gujarati) using existing local translation tables and C++ session forms. Login/register now uses the brown/orange scrollable overlay style with a fixed close header; actual hashed-password authentication remains. Errors render inside the overlay.

Verified: Ubuntu build, full regression suite, eight language options, hero markup, closable account panel; desktop screenshot, mobile login with close visible, Hindi switch and return to English. Previewed desktop at reference width and mobile 390px; restored normal browser viewport. Latest test evidence /tmp/tmp.hv6DKeVTgQ. Not a claim of pixel-perfect parity across all pages: some category icons are generic and newer text still falls back to English outside Hindi/Odia. Translation human review remains required.
