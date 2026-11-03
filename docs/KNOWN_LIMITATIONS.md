# KNOWN LIMITATIONS — honest list (2026-11-03)

Anything unfinished is labelled `INCOMPLETE` or `PARTIAL` in `/erp/status` (`GET /api/v1/features`),
`docs/FEATURE_CHECKLIST.md` and the final report. Current live totals:
**64 features — 43 COMPLETE, 20 PARTIAL, 1 INCOMPLETE.** Nothing here is presented as done.

## Resolved in this session (no longer gaps)

* WebAuthn passkeys (A15): real `@simplewebauthn` verification, one-time challenges, revoke, browser E2E.
* PIN offline cache: browser E2E confirmed 4/4 encrypted IndexedDB rows; 4 unit tests.
* Playwright-style visual regression: 11 pages × 4 viewports = 44 real Chromium baselines, 0 % drift.
* Lighthouse mobile: 100/100/100 on `/`, `/products`, `/product/:slug`; axe-core: 0 violations on 8 pages.
* Urdu A4 print/PDF proof on desktop + Android-emulated Chromium (a *physical* device is still untested).
* App-wide CSRF (29 write routes), RBAC/IDOR private reads, SQLi and stored-XSS gates (5 new tests).
* A19 dedicated quota/cache test; generation-aware cache purge; Turnstile server gate + local tests.
* New-project `wrangler.v2.jsonc` with staging/production dry-runs (exit 0, 0 warnings).

## INCOMPLETE / unverified

1. **Cloudflare deployment (`P12-DEPLOY`)** — no verified staging/production URL. `wrangler.v2.jsonc`
   has staging/production dry-runs only; the old `wrangler.jsonc` is untouched and still has
   `REPLACE_WITH_REAL_D1_UUID` placeholders. No D1/R2 created, no remote migrations, no deploy.
2. **Cloudflare API reachability** — from this sandbox `api.cloudflare.com` and the R2 S3 endpoint
   return `curl (35) SSL_ERROR_SYSCALL` / `http=000`, while `registry.npmjs.org` returns 200. A real
   `CI=1 npx wrangler deploy -c wrangler.v2.jsonc --env staging` was attempted on 2026-11-03 and exited 1
   (`In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN ...`; 0 credential
   env vars present). Outbound is limited to github.com / npm / pypi, so `d1 create`, `r2 bucket create`,
   `secret put` and `deploy` cannot complete here. A safe `workflow_dispatch` workflow
   (`.github/workflows/deploy-v2.yml`) was added so the owner can deploy from GitHub Actions using
   repository secrets; it has **NOT been run**. Commands: `docs/NEW_PROJECT_DEPLOY.md`.
3. **Domain / RP ID** — deferred by the owner. WebAuthn credentials are domain-bound, so passkeys must
   be enrolled only after the final domain is set.
4. **Real Cloudflare Turnstile `siteverify`** — the server gate is implemented and unit-tested with an
   injected verifier; the real CF service has not been called.
5. **Real Cloudflare edge Cache API purge** — generation-based invalidation + known-key deletion pass
   locally; behaviour of `caches.default` on the edge is unverified.
6. **Real staging D1 restore (A16)** — a local staging-equivalent restore passed (1032 rows, FK +
   journal PASS); `staging_restore_result` remains `NOT_TESTED` for production purposes.
7. **Nightly encrypted backup to production R2** — local fallback writes `.dev/`; production R2 binding
   and the live Cron run are unverified. `scripts/backup` returns `501 INCOMPLETE_R2` where R2 is absent.
8. **Physical Android Chrome screenshot** — only viewport/user-agent emulation was captured.
9. **13 phase-by-phase `Phase n done: <evidence>` commits** — not made; see `docs/PHASES.md`.
10. **Re-verification of external figures** — Cloudflare limits/prices and Punjab pesticide/fertiliser
    regulatory facts cannot be re-fetched from this sandbox; re-check at deploy time.
11. **Concurrent duplicate `idempotency_key` protection** — `Posting.syncOperation()` uses
    `ON CONFLICT DO NOTHING`; sequential duplicates are safe, two truly concurrent same-key posts could
    double-post. Needs a unique index + conditional-write fix.
12. **Owner-supplied values** — 1 من = ? kg, bag sizes/unit conversions, licence numbers + expiry,
    opening balances, legal copy, domain and Cloudflare access were never invented and remain `NEEDS OWNER INPUT`.

## PARTIAL (works, narrower than the master prompt)

* 20 `/erp/status` items are PARTIAL, notably: CMS legal text is `REVIEW_REQUIRED` until owner legal
  review (`PUB-06`, `PUB-08`); global search index; MANUAL allocation picker; returns line picker;
  enquiry→Sale one-click conversion; quarantine workflow UI; banner upload UI; party edit/archive UI;
  employee advance form; bulk statement packs; full report gallery + scheduled emails; standalone
  offline page; production R2 binding; real Turnstile; real staging restore; new-project config not deployed.
* 12 reports are wired; advanced reconciliation views are not.
* Private R2 uploads work in local preview via a local upload dir; production requires the R2 binding.
* Quarter/period locking, CNIC encryption, audit and RBAC are implemented; a route-by-route IDOR matrix
  with real cross-tenant records is not automated (only deny-by-default role cases are).
* `@playwright/test`'s own spec runner (`tests/visual/erp.spec.ts`, `playwright.config.ts`) exists but the
  committed visual evidence comes from `scripts/visual-baselines.mjs` (playwright-core + pixelmatch).
  `lighthouserc.json` / CI workflows remain disabled behind repo variables.

## Not invented (by design)

Prices, stock, opening balances, licence/tax numbers, emails, opening hours, reviews, ratings,
farmer/customer/supplier names, maund value, bag sizes, and any government/bank/JazzCash integration.
The production catalogue starts **EMPTY**; the local preview DB is reset to 0 products after tests.
Biometric data never reaches the server (WebAuthn public keys only).
