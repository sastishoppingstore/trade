# KNOWN LIMITATIONS — honest list (2026-11-03)

Anything below is labelled `INCOMPLETE` or `PARTIAL` in `/erp/status`, this file and the final report. Nothing here is presented as done.

## INCOMPLETE / unverified (not built or not browser-verified)

1. **Cloudflare deployment** — no account, domain, D1 UUID or R2 bucket was supplied. `wrangler.jsonc` contains explicit placeholders. No staging or production URL exists. `deploy:*` and `d1:*` scripts were never run.
2. **WebAuthn passkeys / fingerprint login (A15)** — `/api/v1/auth/passkeys/*` returns `501 INCOMPLETE_PASSKEYS`. Password + PBKDF2 + secure session cookies work. The site would never see a biometric even when implemented.
3. **Browser E2E test for the offline PIN gate** — the PIN-derived AES-GCM cache encryption itself is implemented and unit-tested (4 tests), but no Playwright/browser run verified the unlock screen. The Dexie `outbox` is intentionally left readable so queued operations can sync while locked.
4. **Playwright visual regression at 360 / 390 / 768 / 1280** — config + spec exist, but `@playwright/test`/browsers were not installed and no baseline snapshots were captured. «Pixel-perfect» cannot be guaranteed from words; owner mock-ups will override Parts 5–7.
5. **Lighthouse CI / automated a11y (axe)** — config/workflow exist; no run performed. Semantic labels, `aria-*` and logical CSS properties are manual only.
6. **Urdu PDF screenshots** — print pages are browser-rendered HTML+CSS with named `@page` A4/A5/80 mm rules, but no Android Chrome / desktop Chrome screenshot evidence exists. Browser «Save as PDF» is required; no server-side PDF library is used.
7. **Turnstile** — enquiry protection currently uses honeypot + time trap + rate limit + consent.
8. **Cloudflare Cache API key tracking / purge** — `purgePublicCache()` clears the in-process `memoryCache`; the edge Cache API keys written by `cacheWrite()` are not tracked/purged. Publishing is correct in local preview; production purge needs a key registry or a cache-tag/`caches.delete()` strategy.
9. **Concurrent duplicate `idempotency_key` protection** — `Posting.syncOperation()` uses `ON CONFLICT DO NOTHING`, which changes the `changes` assertion; sequential duplicates are handled but two truly concurrent same-key posts could double-post. Needs a unique index + conditional-write fix.
10. **Global search index**, bulk statement packs, enquiry→Sale one-click conversion, quarantine workflow UI, MANUAL allocation picker, returns line picker, standalone banner upload UI, party edit/archive UI, employee advance form.
11. **Real staging D1 restore** — a local staging-equivalent restore passed (1032 rows, FK + journal PASS), but no Cloudflare staging D1 restore was run, so `staging_restore_result` stays `NOT_TESTED`.
12. **Tailwind / vite-plugin-pwa** were not used; see `docs/ASSUMPTIONS.md` for the deliberate deviation (hand-authored CSS + manual SW/manifest implementing the same tokens/cache rules).

## PARTIAL (works, narrower than the master prompt)

* Every ERP/PUB screen has loading/empty/validation/error-retry/offline/permission states, but not every one has been screenshot-verified at all four breakpoints.
* 12 reports are wired; the complete Part-9 report gallery, scheduled emails and advanced reconciliation views are not.
* CMS legal text (privacy/terms/about) is deliberately `REVIEW_REQUIRED` until the owner's legal review; no fake legal copy was invented.
* Receipts support AUTO/ADVANCE; MANUAL allocation is server-validated but has no dedicated line picker.
* Private R2 uploads work in local preview via a local upload dir; production requires the R2 binding.
* Quarter/period locking, CNIC encryption, audit and RBAC are implemented, but a route-by-route IDOR matrix beyond the tested auditor case has not been automated.
* CSRF is enforced on mutating requests by the Worker; a dedicated test that walks **every** route with a missing CSRF header was not written.

## Not invented (by design)

Prices, stock, opening balances, licence/tax numbers, emails, opening hours, reviews, ratings, farmer/customer names, supplier names, maund value, bag sizes, and any government/bank/JazzCash integration. The production catalogue starts EMPTY.

## Verified-but-must-recheck

Cloudflare limits/prices and Punjab pesticide/fertiliser regulatory figures were checked on 2026-11-03 (sources in `docs/ASSUMPTIONS.md` / README) but must be re-verified at deploy time; the owner must confirm current rules with the District Agriculture Office, Layyah. The software only keeps configurable records and exports.
