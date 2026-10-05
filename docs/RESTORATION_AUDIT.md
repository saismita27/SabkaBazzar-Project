# Reference parity audit — development only

Reference: read-only Git snapshot bf91a2b, including Header, CategoryNav, AuthModal, product components, categories and translations. Current C++ source inspected: server.cpp, accounts.hpp, web.hpp, search.hpp, catalogue, asset mount and help components. No reference files or protected branches are changed.

| Reference feature | Current C++ status at audit | Action required |
|---|---|---|
| Branded responsive header / Odisha | Basic header | Restore prominent controls and delivery label |
| Language before login | Product language in collapsed preferences | Visible selector, local UI tables, persisted session language |
| Login/register/logout | IMPLEMENTED and previously tested | Preserve secure authentication; improve page and redirect home |
| Homepage / discovery | Minimal hero | Restore approved copy, department discovery |
| 12 departments / subcategories | Generic department dropdown | Restore named navigation and useful subcategory filters |
| Product cards | Photos, cart, wishlist work | Restore brand, demo price comparison, clear stock and actions |
| Product details / aliases | Basic detail works | Rich layout, variants, source references |
| Local-name search | IMPLEMENTED ICU normalization and aliases | Preserve; refine ranking and suggestions |
| Cart / quantity / wishlist | IMPLEMENTED and tested | Translate presentation; preserve Go to Cart |
| Checkout / duplicate prevention | IMPLEMENTED transactionally | Saved address UI, translated validation |
| Orders / tracking | IMPLEMENTED simulated states | Visual timeline, translated statuses |
| Customer care | IMPLEMENTED persisted tickets/admin replies | Prominent Help, improve request flow |
| Easy Shopping | Larger text only | Visible toggle, fewer choices and simpler layout |
| Voice / read aloud | Missing | C++ Linux capture/recognition prototype; never imply browser microphone access without implementation |
| Admin | Registered order/support management works | Product/price/stock/alias management pending |
| Embedded help | FIFO tested; real device NOT TESTED | Preserve paired-session isolation; improve browser event experience |

## Reuse and implementation order

Reuse Store transactions, Argon2id accounts, CSRF forms, ICU normalization, original 160 catalogue records and local photos, shared device ABI and listener. SQLite stores clients/products and account/session records; do not replace the database. Recovered translation/category data is data only, not execution of reference TS.

Implement in the user's order: common layout/assets; session language; account experience; homepage; departments/subcategories; cards; details; search; cart; wishlist; checkout; orders; support; Easy Shopping; voice prototype; help integration. Compile and run appropriate tests at each checkpoint. Exact visual parity, complete translation review, voice recognition and physical driver operation are not yet achieved.

## Branch rule

Before every commit and push verify `git branch --show-current` is exactly `development`. Push only `origin development`. Never modify main or backup/project-snapshot. No reference checkout or modification.

## Development restoration checkpoint — October 5

IMPLEMENTED and regression-tested: prominent English/Hindi/Odia controls before login; server-persisted language and Easy Shopping with session isolation; translated navigation and account/product controls; all 12 named department links and subcategory filtering; approved homepage copy; distinct login/register views with successful authentication returning Home; rich product details, aliases, variant selector, preserved photos/reference links and honestly labelled sample ratings/prices. Easy Shopping enlarges controls and hides optional discovery/price decorations.

Application remains server-rendered C++ with no browser scripts. Recovered local translation/category literals are compiled as data in backend/web_data.hpp. Translation text is inherited/unreviewed, with English fallback; full validation/checkout/support translation is still pending. Voice entry is PROPOSED, not a working microphone or recognizer. Read-aloud, comprehensive admin product editing and exact reference visual parity remain pending. Buy Now still includes the existing cart. Real driver remains NOT TESTED.

Observed: Linux build passed; complete backend/test.sh suite and CTest passed after this checkpoint. Added checks cover language/Easy state, language isolation, department/subcategory route, honest voice status and registration redirect. Existing auth, checkout, duplicate prevention, restart, support and FIFO targeting checks passed. Latest temporary test evidence: /tmp/tmp.YbdEgl7KhK. Browser inspection confirmed visible header controls and full named department navigation. No claim of exhaustive responsive or translation review.

Next five tasks: finish validation/checkout/support localization; improve discovery and product visual parity; complete saved-address/Buy Now behavior; implement and verify local C++ voice prototype; complete admin product management and help-panel refresh integration. Full feature-gap table and implementation sequence: docs/RESTORATION_AUDIT.md.

Recently modified in this checkpoint: backend/web.hpp, web_data.hpp, web_smoke.cpp, auth_smoke.cpp; public/store.css; docs/RESTORATION_AUDIT.md; AGENTS.md; README.md; PROJECT_STATUS.md.