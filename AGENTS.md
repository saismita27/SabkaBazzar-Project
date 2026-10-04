# SABKA BAZAAR — PROJECT INSTRUCTIONS

## Project Purpose

Sabka Bazaar is a modern multilingual e-commerce web application inspired by
platforms such as Amazon, Flipkart and Nykaa.

The main purpose of the project is to make online shopping easier for users of
different age groups, especially older adults who may not be comfortable with
English or typing exact English product names.

A key idea of the application is:

"Shopping in the language you are comfortable with."

Example:
A customer should be able to search for "tej patta" instead of needing to know
that the English term is "bay leaf".

The application should eventually support regional-language product discovery
and voice-based product search.

---

## Target Users

- General online shoppers
- Elderly users
- Users uncomfortable with English
- Users who prefer regional languages
- Users who prefer voice input instead of typing
- Mobile and desktop users

---

## Main E-Commerce Flow

The intended application flow is:

Login / Signup
→ Home Page
→ Browse Categories
→ Search Products
→ Product Details
→ Add to Cart / Wishlist
→ Buy Now
→ Checkout
→ Order Confirmation
→ Order Details
→ Order Tracking

---

## Main Product Categories

The application should support categories such as:

- Electronics
- Mobiles
- Fashion / Dresses
- Shoes / Sandals
- Beauty
- Grocery / Food Items
- Home products
- Other useful e-commerce categories where appropriate

---

## Core Features

The project should support or progressively implement:

- Login
- Signup / Account creation
- Home page
- Product categories
- Product listing
- Product detail pages
- Search
- Multilingual search
- Voice search
- Regional-language product terms
- Add to cart
- Remove from cart
- Quantity adjustment
- Wishlist
- Buy Now
- Checkout
- Order details
- Order history
- Order tracking
- Customer care / support
- User profile
- Responsive UI
- Search suggestions
- Product filtering and sorting

---

## Accessibility / Elder-Friendly UX

This is an important differentiating feature of Sabka Bazaar.

The UI should remain:

- simple
- readable
- visually clear
- easy to navigate
- suitable for elderly users
- usable without requiring advanced technical knowledge

Where appropriate provide:

- larger touch targets
- readable text
- obvious buttons
- clear icons
- minimal unnecessary steps
- regional-language options
- voice input

Do not make the interface unnecessarily complicated just to make it look modern.

---

## Branding

Project name:

Sabka Bazaar

Brand personality:

- inclusive
- Indian
- friendly
- modern
- trustworthy
- simple
- family-oriented

The project should not look like a direct clone of Amazon or Flipkart.

It may take inspiration from established e-commerce UX patterns but should
maintain its own identity.

---

## Design Direction

Use a polished modern e-commerce interface.

Priorities:

1. usability
2. clean layout
3. responsive design
4. visual consistency
5. accessibility
6. strong product presentation

Avoid:

- cluttered screens
- excessive animation
- random redesigns
- inconsistent typography
- unnecessary gradients/effects
- changing working UI without a reason

---

## IMPORTANT DEVELOPMENT RULES

Before making any modification:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Read this AGENTS.md.
4. Read PROJECT_STATUS.md.
5. Preserve completed functionality.
6. Do not rebuild the project from scratch.
7. Do not delete working features merely to implement a new feature.
8. Reuse existing components where appropriate.
9. Follow the current project's framework and coding conventions.
10. Keep changes focused on the user's requested task.

---

## Existing Work Must Be Preserved

This project has already undergone considerable development.

Do NOT assume this is a new project.

Always inspect existing:

- source files
- components
- routes
- styles
- assets
- API/backend logic
- configuration
- package dependencies

before making architectural changes.

---

## When Fixing Bugs

Do not immediately rewrite large sections of the application.

Use this sequence:

1. reproduce/understand the issue
2. identify the root cause
3. inspect related files
4. make the smallest reliable fix
5. verify the change
6. confirm existing functionality still works

---

## When Adding Features

Before implementing a feature:

- identify existing related components
- determine whether reusable functionality already exists
- preserve the current visual language
- integrate instead of duplicating functionality

---

## Safety Rule

Never put real:

- passwords
- API secrets
- access tokens
- private keys

inside source-control files.

Use environment variables where required.

---

## Continuation Rule for New Codex Sessions

If this repository is opened in a new Codex account/session:

DO NOT start building immediately.

First:

1. Read AGENTS.md completely.
2. Read PROJECT_STATUS.md completely.
3. Inspect the repository structure.
4. Inspect the most relevant existing files.
5. Determine what is already implemented.
6. Continue from the existing state.

The goal is continuity, not rebuilding.
## Verified implementation and continuation context (October 4–5, 2026)

This section supplies concrete current facts in addition to the design rules above. Follow the human's current request when it conflicts with a generic continuation instruction.

### Technologies and folder structure

- `backend/`: C++17 HTTP server, native terminal client, C++ smoke tests and help trigger; CMake builds these on Linux.
- `backend/server.cpp`: SQLite prepared statements, RAII resources, mutex serialization, checkout transactions and session-scoped operations.
- `backend/search.hpp`: ICU normalization and name/alias ranking.
- `backend/help_bridge.hpp`: POSIX descriptors, poll/read, worker thread and cleanup.
- `backend/catalogue.json`: 160 existing sample product records and source-photo references.
- `src/`: existing React 19/TypeScript web UI, translated labels and browser speech. `src/backend/useCppStore.ts` delegates connected shopping actions to C++.
- `public/`: product images and photo credits. Preserve the image/product associations.
- `embedded/driver/`: educational C character driver, wait queue and file operations.
- `embedded/system_service/`, `embedded/systemd/`: legacy standalone exercises; not the current backend deployment.
- `docs/`: implementation/verification notes, photo sources and native Linux walkthrough.
- `backend/build/`, `dist/`, `node_modules/`: generated files, excluded from Git.

Libraries: cpp-httplib for HTTP; nlohmann-json for serialization; SQLite for transactions and persistence; ICU for Unicode NFKC case folding; libsodium for unpredictable session tokens; Linux/POSIX APIs and C++ threads for help events and shutdown. Optional web tooling uses Vite/Tailwind and React. Do not use Python. Do not inflate C++ percentages or rename TypeScript files to suggest conversion.

### Completed and verified

C++ catalogue/alias search, quantity and stock checks, cart, wishlist, address/profile persistence, transactional mock checkout, idempotency, orders, valid tracking/cancellation, support persistence and paired help events. Native C++ CLI exposes search/cart/wishlist/checkout/orders/tracking/support, without requiring a browser or Node. C++ help trigger writes to the explicit FIFO/device interface. Ubuntu build and integration tests, including restart and native flows, passed; see PROJECT_STATUS.md.

### Known issues and pending work

Profiles are not authentication. No protected admin boundary, real payment, real courier, phone agent or AI model. The real driver has not been compiled/loaded because the WSL matching kernel build tree is absent. Native menus are English and voice stays browser-only. Translation/accessibility review, 200 products per subcategory, live prices and catalogue updates remain unfinished. Browser stock labels can lag, but checkout checks server stock. Kiosk pairing resets on server restart. See PROJECT_STATUS.md for next tasks; do not mark simulation as a finished kernel demonstration.

### Commands and safe configuration

Native path, Ubuntu repository root:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json - --fifo
# Another Ubuntu terminal:
backend/build/sabka_cli
# After pairing the session, another terminal:
backend/build/sabka_help_trigger --fifo
# Stop demo before integration tests:
bash backend/test.sh
```

Optional website: `npm ci`, `npm run lint`, `npm run build:cpp`; replace `-` with `dist` in the backend command and browse http://127.0.0.1:8080. `npm run dev` is the old browser-local path, not the C++ demonstration.

SQLite defaults are positional arguments in the backend command. The database contains `clients` JSON session documents and `products` with authoritative stock. WAL is enabled; seed inserts missing product IDs and does not reset existing stock. Do not delete the demo DB as an upgrade strategy. Native cookie defaults to `/tmp/sabka-cli-<uid>.session` mode 0600; `SABKA_SESSION_FILE` can choose an isolated private path. FIFO is `/tmp/sabka-backend-<uid>/help.fifo`. No credentials need to be committed. Server is loopback-only and not suitable for public deployment.

### Important decisions and things not to change

- Keep the existing website/branding/product photos and complete flows. The terminal client shares the C++ backend, not a separate implementation of pricing or stock rules.
- Use integer paise calculations, prepared statements, atomic stock/order updates and checkout idempotency. Never trust client-supplied prices.
- Keep mock payments/tracking/support clearly labelled. Use fictional delivery details for tests.
- Preserve existing data and unrelated user edits. Keep secrets, session files and databases out of Git.
- Never install/load a driver or alter boot/kernel/security configuration without explaining the host change and obtaining necessary authorization.
- UI direction: warm cream/orange, readable text, restrained motion, visible language/help, larger Easy Shopping controls, responsive dialogs with reachable close buttons. Preserve Add to Cart becoming Go to Cart.
- Brand copy approved by user: “Where every family finds its favourites” and “From daily essentials to little celebrations — sabke liye, sab kuch”, without trailing full stops.
- Project remains Sabka Bazaar. Keep architecture and evidence honest; do not describe the whole repository as exclusively C/C++ while the optional web UI remains TypeScript.
