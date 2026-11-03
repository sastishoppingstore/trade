# ذیشان ٹریڈرز / Zeeshan Traders — v2.0

ایک ہی D1 ڈیٹابیس اور ایک ہی کیٹلاگ پر: اردو-first تیز عوامی ویب سائٹ (PUB-01…09) + نجی، آف لائن قابل ERP / کھاتہ (ERP-01…38)۔
An Urdu-first public catalogue and a private offline-capable ERP sharing **one** Cloudflare D1 database and **one** product catalogue.

> **Status on 2026-11-03:** a working, tested, locally running build. **NOT deployed to Cloudflare.**
> See `docs/TEST_REPORT.md` for real command output and `docs/FEATURE_CHECKLIST.md` for COMPLETE / PARTIAL / INCOMPLETE per screen ID.
> Anything not finished is labelled `INCOMPLETE` in the UI (`/erp/status`), this README, and the final report.

## What actually exists (verified)

| Area | Reality |
|---|---|
| Worker API | Hono `/api/v1/*`, deny-by-default RBAC, CSRF, rate limits, security headers, parameterised SQL |
| Database | `migrations/0001_init.sql` (76 tables), `0002_system_seed.sql` (67 accounts / 30 settings), `0003_hot_path_indexes.sql`; catalogue starts **EMPTY** |
| Business core | 17 books (7 goods + 7 grains + Cash/JazzCash/Meezan/UBL & ledgers), integer-paisa money, integer-milli quantities, atomic `db.batch()` posting, idempotency keys, balanced journals |
| Tests | `npm test` → 41 passing (18 unit incl. 4 PIN-crypto + 19 integration + 4 route matrix); `npm run typecheck` → 0 errors; `npm run query:plan` → 15/15 indexed |
| Web | React 18 + Vite + React Router + TanStack Query, all PUB and ERP routes, Dexie outbox, optional PIN-derived AES-GCM cache encryption, service worker, self-hosted WOFF2 fonts, browser-rendered A4/A5/80mm print templates |
| Local preview | `npm run server` serves the built SPA **and** the real API on one port; persistent `.dev/zt.db` |
| Ops | encrypted NDJSON→gzip→AES-GCM backups, `scripts/restore.ts` with a passing local staging-equivalent restore, cron, usage meter, query-plan CI gate |

## Quick start (local preview — no Cloudflare account needed)

```bash
npm install --no-audit --no-fund
npm run migrate:local         # applies all migrations/*.sql to .dev/zt.db
npm run build:web             # builds apps/web/dist
npm run server                # http://0.0.0.0:3000  (public / and private /erp)
```

The server prints a **one-time setup token** on first start and stores it in `.dev/secrets.json` (mode `0600`).
Open `/erp` → complete the 7-step setup wizard. You must enter the owner-confirmed value for **1 من = ? kg**;
the system refuses per-maund rates until it is confirmed. No product, price, balance, licence, hours, email or review is invented.

```bash
npm run check:all   # typecheck + tests + query plan + web build
```

## Architecture

```
Browser (React SPA, ur/RTL, PWA)  ──relative URLs──▶  Hono Worker  ──▶  D1 (SQL)
        Dexie/IndexedDB outbox                         ├──▶ Cache API (public, 60–300 s)
        WebCrypto AES-GCM (CNIC/backup)                ├──▶ R2 (private files, backups)
                                                        └──▶ Cron (integrity, backup, cleanup)
```

* H1 — money is **INTEGER paisa**; quantities are **INTEGER milli-units** of the declared base unit (kg-base = grams).
* H2 — posted financial rows are immutable; deletion = reversal + replacement, with reason/user/timestamp.
* H3 — one posting = one `db.batch()`; unique `idempotency_key` on every operation.
* H4 — every journal balances (code assertion + nightly/DB integrity check).
* H5 — authorisation on **every** Worker endpoint; UI hiding is cosmetic only.
* H6 — public JSON whitelist: never cost/margin/supplier/exact stock/customers/internal notes.
* H7 — no hard-coded secrets or default password; first owner via a one-time setup token.
* H8 — production catalogue starts empty; only the business profile is prefilled (name/address/2 phones/wa.me, PKR, Asia/Karachi, July–June, Saturday week start, Urdu RTL).

Printable documents are **browser-rendered HTML + CSS** (`apps/web/src/print.tsx`) because server-side PDF libraries do not shape Urdu correctly. Use Print → *Save as PDF*. Each document stores a JSON snapshot plus `template_version`.

## Where things are

```
migrations/                D1 schema + system seed + hot-path indexes
packages/shared/            money, quantity, recipes, Zod schemas, constants, i18n
apps/worker/src/            Hono app, context/security, posting engine, services, routes, cron, local server
apps/web/src/               public site, ERP shell/screens/forms, print templates, PWA state
tests/                      unit, integration (A1…A20), route matrix
scripts/                    gen-seed.ts, check-query-plans.ts, restore.ts
docs/                       ASSUMPTIONS, ROUTE_MAP, ER_DIAGRAM, SCREEN_CHECKLIST, ACCEPTANCE,
                            OPENAPI.yaml, RUNBOOK, OWNER_MANUAL_UR, TEST_REPORT,
                            FEATURE_CHECKLIST, KNOWN_LIMITATIONS
templates/                  CSV templates (products, parties, opening stock, grain rate)
wrangler.jsonc              Cloudflare config skeleton (NOT applied — needs real IDs/domain)
```

## Deployment: **INCOMPLETE**

No Cloudflare account, D1 UUID, R2 bucket or domain was supplied. `wrangler.jsonc` contains `REPLACE_WITH_REAL_D1_UUID` placeholders on purpose.
Production deployment, D1 migration apply, real staging restore, Playwright visual regression (360/390/768/1280) and Lighthouse runs are **INCOMPLETE** — see `docs/KNOWN_LIMITATIONS.md`.
Do not treat the local preview URL as a production URL.

## Verified Cloudflare facts (2026-11-03, re-checked against live docs)

* Workers Free D1: **5,000,000 rows read / day** and **100,000 rows written / day**; hitting the daily cap makes D1 queries **return errors** until the 00:00 UTC reset. Workers Paid includes 25 billion reads / 50 million writes per month, then $0.001 / million reads and $1.00 / million writes; $5/month minimum. [1](https://developers.cloudflare.com/d1/platform/pricing/) [3](https://workers.cloudflare.com/plans)
* D1 limits: Free max DB 500 MB, 10 databases/account; Paid max DB 10 GB; **Time Travel 7 days Free / 30 days Paid**; max 100 bound parameters/query, 30 s query duration. [1](https://developers.cloudflare.com/d1/platform/limits/) — Time Travel is a safety net, **not** a substitute for the nightly encrypted R2 backup.
* Workers CPU: **10 ms per HTTP request Free**, 5 min ceiling (30 s default) on Paid; waiting on D1/fetch does not count as CPU. [1](https://developers.cloudflare.com/workers/platform/limits/)
* R2 free tier: 10 GB-month storage, 1 M Class A and 10 M Class B operations/month, zero egress. [1](https://developers.cloudflare.com/r2/pricing/)

**Recommendation: Workers Paid.** The usage meter warns at 70 % of the free caps (`/erp/settings`, `/erp` dashboard).
Prices/limits were verified on 2026-11-03 and must be re-checked at deploy time.

## Regulatory note (NOT legal advice)

A press report says Punjab pesticide-dealer licence applications via the eBiz portal closed on **5 November 2026**, with training on 6–12 November 2026; the Agricultural Pesticides Ordinance 1971 contemplates 3-year registration/licence periods. [2](https://propakistani.pk/2026/10/29/how-to-apply-for-a-pesticide-dealer-license-in-punjab/) [4](http://punjablaws.gov.pk/laws/1211a.html) [1](https://www.scribd.com/document/147954757/Licencing-of-Dealers-and-Vendors-of-Pesticides)
**The owner must confirm the current rules, licence number/expiry and record-retention period with the District Agriculture Office, Layyah.** This software only keeps configurable records and exports; it does **not** file anything with a government portal, bank or JazzCash, and it never invents licence numbers, prices or stock.
