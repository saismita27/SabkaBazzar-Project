> Original sample planning document: implementation and test claims below are not independently verified. See ../README.md and ../REPAIR_VERIFICATION.md for actual repair status.

# Stage 2 — Product Requirements Document (PRD) & Engineering Plan
**Project:** Sabka Bazzar (सबका बाज़ार / ସବୁଙ୍କ ବଜାର)  
**Version:** 1.0.0 (Milestone October 5, 2026)  
**Target Platform:** Linux (Ubuntu 22.04 / Debian / Embedded Yocto or Raspberry Pi OS target; WSL2 compliant)

---

## 1. Functional Requirements (FR)

### FR-1: Multilingual & Accessibility Layer
- **FR-1.1:** System shall support 8 Indian languages (English, हिन्दी Hindi, ଓଡ଼ିଆ Odia, मराठी Marathi, বাংলা Bengali, தமிழ் Tamil, తెలుగు Telugu, ગુજરાતી Gujarati).
- **FR-1.2:** Language selection must be persistently stored in `localStorage` / session and accessible from the global top navigation bar on every screen.
- **FR-1.3:** "Easy Shopping Mode" (सुगम खरीदारी) switch that doubles typography scale, increases touch targets to min 48px, simplifies views into large action cards, and eliminates extraneous visual noise.
- **FR-1.4:** High-contrast color palette with WCAG AAA conformance for senior citizens and low-vision shoppers.
- **FR-1.5:** Local Voice Recognition input (Web Speech API) with explicit mic request, preview before query submission, and audio status announcer.

### FR-2: Catalog & Vernacular Alias Search
- **FR-2.1:** Deep catalogue spanning 12 retail categories:
  1. Electronics
  2. Fashion (Men, Women, Kids)
  3. Grocery, Food & Spices
  4. Shoes & Sandals
  5. Mobiles & Accessories
  6. Smart Gadgets & Wearables
  7. Home & Kitchen
  8. Beauty & Personal Care
  9. Toys & Baby Care
  10. Sports & Fitness
  11. Furniture
  12. Pet Store
- **FR-2.2:** Vernacular alias resolver: Queries such as `tej patta`, `tejpatta`, `तेज पत्ता`, or `bay leaf` must resolve to the identical product.
- **FR-2.3:** Ranking priority: Exact Alias Match > Name Prefix > Substring > Category fallbacks.

### FR-3: Account, Cart & Checkout Pipeline
- **FR-3.1:** User authentication with session state, protected profile, addresses, wishlist, and orders.
- **FR-3.2:** Cart with real-time stock validation, quantity stepper, price recalculation, GST (5% / 18%), and delivery fee waiver threshold (₹499).
- **FR-3.3:** Transactional mock checkout supporting "Cash on Delivery (COD)", "UPI / QR Code", and "RuPay / Debit Card".
- **FR-3.4:** Duplicate submission prevention via unique client-side idempotency tokens.

### FR-4: Order Lifecycle & Tracking State Machine
- **FR-4.1:** Six discrete states:
  `Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered` (or `Cancelled`).
- **FR-4.2:** Strict transition guard: Cancellation allowed only during `Placed` or `Confirmed` stages.
- **FR-4.3:** Admin dashboard allowing simulated progression through the pipeline for classroom demonstration.

### FR-5: Persistent Customer Care & Kiosk Panic Button
- **FR-5.1:** Instant 1-click customer care accessible from sticky header.
- **FR-5.2:** Options for AI assistant FAQ simulation, SMS callback request, and support ticket creation.
- **FR-5.3:** Integration with `/dev/sabka_help` Linux character device. When an event arrives from the kernel or simulator, the active kiosk session triggers a visual & audio help modal.

---

## 2. Non-Functional Requirements (NFR)
- **NFR-1 (Portability & Reproducibility):** Clean C++17/20 compliance with zero non-standard compiler extensions.
- **NFR-2 (Simplicity & Maintainability):** Monolithic modular architecture; zero microservice sprawl; straightforward explanation during interview.
- **NFR-3 (Security & Trust):** No plaintext passwords; zero real banking credential collection; all payments clearly marked as simulation.
- **NFR-4 (Performance):** Sub-10ms query resolution for vernacular product dictionary in memory.

---

## 3. MoSCoW Prioritization (For October 5, 2026 Submission)

| Priority | Feature / Module | Status / Target |
|---|---|---|
| **Must-Have** | Multilingual UI (English, Hindi, Odia, Marathi, etc.) + Language Switcher | Stage 4 |
| **Must-Have** | Vernacular Alias Search ("tej patta" → Bay Leaf) | Stage 4 |
| **Must-Have** | 12 Product Categories with seed items, pricing in INR, stock | Stage 4 |
| **Must-Have** | Easy Shopping Mode (senior-friendly, large fonts) | Stage 4 |
| **Must-Have** | Cart, Wishlist, Address selector, Mock Checkout (COD/UPI) | Stage 4 |
| **Must-Have** | Order State Machine (`Placed` → `Delivered`) + Admin State Advancer | Stage 4 |
| **Must-Have** | Complete Linux Character Device Driver C Source (`sabka_help_driver.c`) | Stage 3-5 |
| **Must-Have** | Userspace Device Simulator (`sabka_help_sim`) for sandbox/WSL | Stage 3-5 |
| **Must-Have** | C++ System Daemon with `poll()`, POSIX threads, signal handling | Stage 4-5 |
| **Should-Have** | Voice Search with Web Speech API & audio confirmation | Stage 5 |
| **Should-Have** | Embedded Linux Interview Q&A Viva Cheat-sheet | Stage 6 |
| **Stretch** | Systemd unit files & Udev rules for automated deployment | Stage 5 |

---

## 4. Development Schedule & Risk Analysis

- **Day 1 (Oct 2):** Architecture, PRD, Driver Feasibility Check, Core UI & Catalogue Engine, C++ Driver & Simulator Source.
- **Day 2 (Oct 3):** Multilingual Dictionary, Voice Search, Cart & Order State Machine, Admin Console.
- **Day 3 (Oct 4):** Integration of Hardware/Software Bridge, Poll listener, Test Cases, Edge Condition handling.
- **Day 4 (Oct 5):** Final Polish, Interview Viva Practice, Submission Package & Presentation Outline.
