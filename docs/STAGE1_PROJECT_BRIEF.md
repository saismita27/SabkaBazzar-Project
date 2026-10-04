> Original sample planning document: implementation and test claims below are not independently verified. See ../README.md and ../REPAIR_VERIFICATION.md for actual repair status.

# Stage 1 — Project Brief: Sabka Bazzar
**Platform:** Multilingual, Accessible Shopping Platform & Embedded Linux Kiosk System  
**Author:** Final-Year B.Tech CSIT Student  
**Target Submission / Presentation Date:** October 5, 2026 (Kick-off: October 2, 2026)  
**Academic Domain:** Embedded Linux, C++ System Programming, Human-Computer Interaction (HCI)

---

## 1. Problem Statement
Commercial e-commerce applications (e.g., Amazon, Flipkart) have sophisticated catalogs, but present substantial barriers for specific demographics in India:
1. **Language & English-Heavy Bias:** Many regional and elderly users struggle with English-first navigation, complex taxonomy, and unfamiliar technical vocabulary.
2. **Local Product Naming vs. Standard Catalog Terms:** Users frequently search using colloquial mother-tongue names or transliterations (e.g., *"tej patta"*, *"तेज पत्ता"*, *"bay leaf"*, *"haldi"*, *"jeera"*). Traditional search engines often fail or deliver irrelevant results if exact catalog English keywords are not entered.
3. **Cognitive Load & Complex UI Hierarchies:** Dense promotion banners, flash sale timers, microscopic fonts, nested filter menus, and convoluted checkout steps cause cognitive fatigue and checkout abandonment among senior citizens and novice smartphone users.
4. **Onerous Customer Care Pipelines:** Finding immediate assistance usually requires traversing bot menus, wallet pages, and FAQs before reaching a resolution.
5. **Lack of Hardware-Assisted Kiosk Accessibility:** In public or assisted-shopping kiosks (e.g., post offices, rural digital seva centers, panchayat kiosks, railway hubs), users with limited digital literacy need a dedicated physical assistance mechanism (such as an embedded hardware **Help Button**) that directly signals the operating system to dispatch a staff attendant or launch guided assistance.

---

## 2. Target Users
- **Senior Citizens:** Benefiting from High-Contrast/Large-Font "Easy Shopping" mode, simplified one-tap ordering, and clear step-by-step order progress.
- **Multilingual & Regional Users:** Shopping in their native tongues (Hindi, Odia, Marathi, Bengali, Tamil, Telugu, Gujarati, and English), with localized voice search.
- **Assisted Kiosk Users:** Shoppers utilizing an embedded Linux terminal equipped with a physical panic/help button (`/dev/sabka_help`).
- **Store Administrators / Kiosk Attendants:** Managing products, reviewing local-name aliases, tracking orders, and responding immediately to kiosk help-line events.

---

## 3. Academic & Technical Objectives
1. **Embedded Linux Device Driver Exploration:**
   - Design a dedicated Linux Character Device Driver (`/dev/sabka_help`) demonstrating `file_operations` (`open`, `read`, `write`, `poll`, `release`), kernel wait-queues (`wait_queue_head_t`), non-blocking/blocking I/O, and `copy_to_user`/`copy_from_user`.
2. **C++ Linux System Programming:**
   - Build a daemon/service utilizing POSIX system calls: `open()`, `poll()`, file descriptors, POSIX threads (`std::thread`), condition variables (`std::condition_variable`), mutexes (`std::mutex`), signal handling (`SIGINT`, `SIGTERM`), and logging.
3. **Hardware / Software Interface (Architecture):**
   - Model the exact boundary between hardware GPIO interrupts, kernel interrupt handlers (top-half / bottom-half tasklet or workqueue), character device node in `/dev`, VFS (Virtual File System), userspace C++ listener, and web frontend IPC.
4. **Production-Grade Multilingual E-Commerce Simulation:**
   - 12 comprehensive retail categories (Electronics, Fashion, Grocery & Spices, Footwear, Mobiles, Gadgets, Home & Kitchen, Beauty, Baby & Toys, Sports, Furniture, Pet Store).
   - Voice Recognition navigation with speech feedback.
   - Robust local transliteration search dictionary.
   - Transactional order placement with duplicate prevention, state machine transitions, and admin dispatch controls.

---

## 4. Scope & Boundaries
- **In-Scope:**
  - Complete accessible web platform with responsive layouts and "Easy Shopping" toggle.
  - Multi-language UI dictionaries (Hindi, Odia, Marathi, Bengali, Tamil, etc.).
  - Phonetic and vernacular alias search index.
  - Fully documented and compilable Linux kernel module source (`sabka_help_driver.c`).
  - Userspace device emulator for environments without kernel module insertion privileges.
  - C++ daemon service (`order_worker` and `help_listener`).
  - Interview preparation guide with system call deep-dives and B.Tech viva Q&A.
- **Explicit Out-of-Scope (Academic Honesty):**
  - No claims of superior accuracy or scale compared to production giants (Flipkart/Amazon).
  - No real financial transactions (all payments are mock/demonstration with clear labels).
  - No live courier GPS tracking (state transitions follow an explicit academic state machine).

---

## 5. Expected Outcome by October 5, 2026
A reproducible, polished, full-stack embedded Linux demonstration featuring:
1. Running accessible e-commerce application.
2. Simulated/Real character device driver interaction triggering UI help modals.
3. Complete C++ system code and CMake build configuration.
4. Rigorous test suite and B.Tech final-year viva defense documentation.
