# Sabka Bazaar — repaired sample

This copy preserves the supplied React storefront design and fixes startup and several functional defects. It is a browser-local shopping demonstration with separate C/C++ Linux exercises, not a completed secure C++ ecommerce backend.

## Run on Windows
Use Node.js 22.12 or newer (22.20.0 was tested).

```powershell
npm ci
npm run dev
```

Open the localhost address printed by Vite, normally http://127.0.0.1:3000. Stop with Ctrl+C. Scripts invoke Vite through Node directly to avoid the Windows command shim breaking on ampersands in folder names. No `--force` or `--legacy-peer-deps` is required.

```powershell
npm run lint
npm run build
npm run preview
```

## What was repaired

- Removed incompatible direct esbuild dependency and unused server/AI dependencies; regenerated lockfile.
- Windows-safe launch commands, loopback-only server, correct Node requirement.
- 44 missing image paths replaced with a local labelled placeholder; original photos retained. Missing paths are listed in missing-photo-paths.txt. Image fallbacks cannot loop indefinitely.
- Wishlist now opens a saved-products panel rather than the cart.
- Product variant selection and independent cart quantity/removal per variant.
- Removed reverse alias matching that incorrectly returned atta for tej patta; Unicode normalization added to query/alias matching.
- Voice session stored in a React ref and aborted on close; microphone starts only on explicit click. Recognized text can be edited before searching; typing remains available.
- Checkout validates demo address/quantity, keeps one token per attempt, catches errors, uses unique IDs, and retains the order total after clearing the cart.
- Orders start empty; support tickets and addresses persist in browser storage. Signing out clears the current local demo data. Demo state uses a separate storage namespace.
- Order advancement accepts only the next lifecycle state.
- Removed unused password collection and misleading verified-account/reset claims. Local profiles are explicitly labelled simulated.
- Safer C++ shutdown: sigwait in the threaded worker, signal-safe flag in the listener; private per-user FIFO directory. Event log no longer claims browser delivery.
- Driver source fixes: serialized reads, short-buffer rejection, busy-event handling, modern class_create signature. No module was loaded.

## Linux exercises

In Ubuntu from this directory:

```bash
bash embedded/check-userspace.sh
```

This builds both C++17 programs, checks a FIFO event and sends SIGTERM to the test processes. Neither connects to the React browser. The FIFO is /tmp/sabka-help-<uid>/help.fifo; the log is events.log in that private directory.

The driver is educational, write-triggered, with one pending event. It has no GPIO interrupt handler. Build only on a compatible Linux host with matching headers, in a path without spaces (kernel kbuild limitation). Missing headers cause a failed build, not a success message. Loading a module remains a separate manual action; no kernel, boot, service or security setting was changed.

## Important remaining work

- No C++ HTTP backend, SQLite checkout transactions, password verification, secure sessions, protected admin authorization or cross-user security in this sample.
- No connection from the C++ listener to a paired browser session; browser help is a local simulation.
- The catalogue has 160 sample entries, not 200+ per subcategory. Prices, specifications, ratings, discounts, image matches and rights have not been independently verified. Existing photos came from the supplied ZIP.
- Eight language options are present; translations, accessibility conformance, speech availability and mobile behavior need further review. This is not a WCAG compliance claim.
- Payments, tracking, callbacks and the keyword FAQ are demonstrations. No SMS, real calls, delivery, refunds or live AI agent.
- Existing stage documents describe plans and contain unverified claims. They are not evidence of completed testing; this README and REPAIR_VERIFICATION.md describe the actual repair status.

## References

- Vite requirements: https://vite.dev/guide/
- Linux 6.6 class_create API: https://github.com/torvalds/linux/blob/v6.6/include/linux/device/class.h
- Linux wait queues: https://docs.kernel.org/driver-api/basics.html