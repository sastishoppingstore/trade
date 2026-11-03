# ASSUMPTIONS / مفروضات — Phase 0

Recorded 2026-11-03. Anything requiring owner confirmation is flagged **NEEDS OWNER INPUT** and never guessed in code.

## Defaults used (from the master prompt, not invented)

* Business profile: ذیشان ٹریڈرز / Zeeshan Traders; مقصود چوک، ضلع لیہ، پنجاب، پاکستان; `0307-7864722`, `0345-4654722`; `https://wa.me/923077864722`, `https://wa.me/923454654722`; PKR, Asia/Karachi, `en-PK` grouping, fiscal year July–June, week starts Saturday, Urdu RTL default.
* No email, opening hours, reviews, ratings, prices, stock, balances, tax/licence numbers or opening balances. Production catalogue starts **EMPTY**.
* 17 ledgers: FERT, PEST, CHOK, WAND, CEM, SEED, OTHR; WHEAT, RICE, SESAME, MILLET, MAIZE, MOONG, MUSTARD; plus CASH, JAZZ, MEEZAN, UBL money books and receivable/payable/expense/advance GL accounts.
* Money = integer paisa; quantity = integer milli-units of the product's declared base unit. Grain gross/tare/net are integer grams, therefore identical to milli-kg.
* Document numbering: `FS-YYYY-000001` (purchases/sales), `RC-`, `PV-`, `EX-`, `SL-`, `QT-`, `EQ-`; prefixes editable in settings.
* `template_version = zt-print-1.0`; JSON snapshot saved with every document.

## NEEDS OWNER INPUT — blocking for production, never guessed

| # | Item | Why it matters | Where it is entered |
|---|---|---|---|
| 1 | **1 من = ? kg** | per-maund grain rates are hard-blocked until confirmed | Setup wizard step 3 / `/erp/settings` (`maund_kg`, `maund_confirmed`) |
| 2 | Bag sizes / unit conversions | no silent 50 kg assumption | Product form (base/purchase/sale unit + conversion ratio), `/erp/catalogue/units` |
| 3 | Pesticide & fertiliser licence numbers + expiry | legal register/print header; never fabricated | Setup step 6 / settings |
| 4 | Opening balances (cash, bank, parties, stock) | trial balance must balance | Setup step 4, `/erp/inventory` opening, `/api/v1/accounting/journal` |
| 5 | Domain name | CSP/HSTS, sitemap, canonical URLs | `wrangler.jsonc` + deploy config (not supplied) |
| 6 | Cloudflare account access / D1 UUID / R2 bucket | deployment | `wrangler.jsonc` placeholders |
| 7 | Current Punjab pesticide/fertiliser rules & retention period | legal compliance | owner confirms with District Agriculture Office, Layyah; `record_retention_years` setting (default 3, unverified) |
| 8 | Optional CNIC collection switch & privacy copy | sensitive field | `cnic_enabled`, `privacy_cnic` settings; legal text needs owner review |
| 9 | Owner mock-ups / «pixel-perfect» reference | words cannot guarantee pixel-perfect UI | Playwright snapshots at 360/390/768/1280 lock the current tokens; owner mock-ups override Parts 5–7 |

## Technical decisions and deviations

* **Tailwind / vite-plugin-pwa not used.** The locked Part-5 tokens are implemented in hand-authored `apps/web/src/styles.css` with CSS logical properties (`margin-inline`, `padding-block`, `inset-inline`), RTL/LTR, dark theme, and print sizes; the PWA is a hand-written `public/sw.js` + `public/manifest.webmanifest`. Reason: avoid a build-time dependency that could not be verified offline, while keeping every token and cache rule explicit. The service worker never caches private `/api/*`.
* **Browser print, not server PDF.** `apps/web/src/print.tsx` uses `createPortal` into `document.body` so `@media print` can hide the SPA; A4/A5/80 mm use named `@page` rules. «PDF» in the UI explicitly means browser Print → Save as PDF.
* **Local preview uses `node:sqlite`** (`DatabaseSync`, Node 22) with `BEGIN/COMMIT` around `db.batch()`; production uses the D1 binding. `better-sqlite3` was deliberately abandoned after a native-build failure.
* **Public cache** uses the edge Cache API with 60–300 s TTL and is purged on product/CMS change. *Known gap:* the purge currently clears the in-process `memoryCache` only; Cloudflare Cache API keys are not tracked. See `docs/KNOWN_LIMITATIONS.md`.
* **Offline sync triggers**: app open, `online` event, 60 s timer while visible, manual «Sync Now». Background Sync alone is insufficient. Two devices selling the same last stock produce a flagged `CONFLICT`, never a silent overwrite.
* **Offline PIN cache encryption** (`apps/web/src/offline-security.tsx`, `pin-crypto.ts`): PBKDF2-SHA256 310,000 iterations → non-extractable AES-256-GCM key; role-scoped `refs` and `drafts` are stored encrypted at rest, key only in memory, dropped on lock/logout/reload. The `outbox` stays readable so queued operations can sync. 4 unit tests pass; no browser E2E test yet. The PIN is never transmitted or stored.
* **Backups**: NDJSON chunks → gzip → AES-GCM (12-byte IV prefix) → `backups/`; key from `BACKUP_ENCRYPTION_KEY`. D1 Time Travel is only a safety net. A backup is considered valid only after `scripts/restore.ts` passes on staging.
* **Security**: PBKDF2 ≥310,000 iterations, secure cookies, CSRF header, Zod validation, parameterised SQL, CMS sanitiser, CSP/HSTS/X-Content-Type-Options/Referrer-Policy, private R2, magic-byte/size validation, AES-GCM CNIC, audit on sensitive actions. Passkeys store no biometric — but WebAuthn itself is INCOMPLETE.

## Verified external facts (2026-11-03)

* D1 free caps 5 M reads/day + 100 K writes/day; daily cap → query errors until 00:00 UTC reset; Paid includes 25 B reads / 50 M writes per month; $5/month minimum. [1](https://developers.cloudflare.com/d1/platform/pricing/) [2](https://developers.cloudflare.com/d1/platform/limits/) [3](https://workers.cloudflare.com/plans)
* Time Travel 7 days Free / 30 days Paid; Free DB max 500 MB, 10 DBs/account; Paid DB max 10 GB; 100 bound parameters per query. [2](https://developers.cloudflare.com/d1/platform/limits/)
* Workers CPU 10 ms Free / 5 min ceiling (30 s default) Paid; I/O wait excluded. [4](https://developers.cloudflare.com/workers/platform/limits/)
* R2 free tier 10 GB-month, 1 M Class A, 10 M Class B, free egress. [5](https://developers.cloudflare.com/r2/pricing/)
* Punjab pesticide dealer eBiz application window reported until 5 Nov 2026 with training 6–12 Nov 2026 (press report, **owner must verify**); the 1971 Ordinance and secondary sources mention 3-year registration/licence periods. [6](https://propakistani.pk/2026/10/29/how-to-apply-for-a-pesticide-dealer-license-in-punjab/) [7](http://punjablaws.gov.pk/laws/1211a.html) [8](https://www.scribd.com/document/147954757/Licencing-of-Dealers-and-Vendors-of-Pesticides)

**No regulatory figure in this software is presented as authoritative.** Re-verify at deployment and let the owner confirm with the District Agriculture Office, Layyah.
