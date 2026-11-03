# TEST REPORT — 2026-11-03 (Asia/Karachi / UTC+5)

**Every output below is pasted from a command actually run in `/home/user/trade` on branch `arena/e25e3661-trade`.**
No result is claimed for a command that was not run. Full logs: `.dev/check-all.log`, `.dev/smoke.log`, `.dev/query-plan-report.json`, `.dev/restore-test.db.restore-result.json` (all git-ignored working artifacts).

## 1. `npm run check:all` → exit 0 (final run, 2026-11-03 10:13 PKT)

Command chain: `npm run typecheck && npm test && npm run query:plan && npm run build:web`.

```
 Test Files  4 passed (4)
      Tests  41 passed (41)
15/15 hot queries use an index; 0 full scans.
✓ built in 2.54s
```

`npm run typecheck` (`tsc --noEmit -p tsconfig.json`) produced **no output** = 0 errors.
`npm run build:web`:

```
vite v6.4.5 building for production...
transforming...
✓ 109 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.18 kB │ gzip:  0.59 kB
dist/assets/index-DrWZs_56.css   20.47 kB │ gzip:  4.87 kB
dist/assets/query-Bd7GYjYy.js    33.35 kB │ gzip: 10.00 kB
dist/assets/react-dNny9HmG.js   166.35 kB │ gzip: 54.33 kB
dist/assets/index-B20xZ-j5.js   359.30 kB │ gzip: 101.87 kB
✓ built in 2.54s
```

## 2. `npm test` (Vitest 3.2.7, real Worker + real SQL)

Four test files: `unit.test.ts` (14), `integration.test.ts` (19), `routes.test.ts` (4), `pin.test.ts` (4).

```
 ✓ tests/pin.test.ts > PIN-derived offline cache encryption > uses at least 310,000 PBKDF2 iterations and a 256-bit AES-GCM key 62ms
 ✓ tests/pin.test.ts > PIN-derived offline cache encryption > round-trips an Urdu role-scoped cache row and never keeps plaintext in the blob 60ms
 ✓ tests/pin.test.ts > PIN-derived offline cache encryption > a different PIN or salt cannot decrypt the cache (verifier check) 169ms
 ✓ tests/pin.test.ts > PIN-derived offline cache encryption > a fresh 12-byte IV per encryption means identical plaintext yields different ciphertext 58ms
 ✓ tests/unit.test.ts > H1 — integer paisa money > parses rupee strings without floats 2ms
 ✓ tests/unit.test.ts > H1 — integer paisa money > formats with Pakistani digit grouping 1ms
 ✓ tests/unit.test.ts > H1 — integer paisa money > sums and multiplies exactly 0ms
 ✓ tests/unit.test.ts > H1 — integer paisa money > allocates landed cost across lines with an exact integer sum 0ms
 ✓ tests/unit.test.ts > H1 — integer paisa money > weighted-average COGS never overstates inventory value 0ms
 ✓ tests/unit.test.ts > H1 — one quantity rule (integer milli-units / grams) > parses and formats milli-units 1ms
 ✓ tests/unit.test.ts > H1 — one quantity rule (integer milli-units / grams) > net weight arithmetic is transparent and integer 0ms
 ✓ tests/unit.test.ts > H1 — one quantity rule (integer milli-units / grams) > maund conversion requires an owner setting, never an assumption 0ms
 ✓ tests/unit.test.ts > H4 — every posting recipe balances > all 14 recipe variants have sum(debit) == sum(credit) 1ms
 ✓ tests/unit.test.ts > H4 — every posting recipe balances > rejects unbalanced and malformed journals 0ms
 ✓ tests/unit.test.ts > H4 — every posting recipe balances > transfer never touches income/expense accounts 1ms
 ✓ tests/unit.test.ts > H4 — every posting recipe balances > document numbering is zero-padded per sequence 0ms
 ✓ tests/unit.test.ts > security primitives > PBKDF2 hashing verifies and rejects wrong passwords 163ms
 ✓ tests/unit.test.ts > security primitives > CNIC column encryption round-trips with AES-GCM 2ms
 ✓ tests/integration.test.ts > A1 setup creates the owner and cannot be re-run 6ms
 ✓ tests/integration.test.ts > H5: unauthenticated and missing-CSRF requests are rejected by the Worker 3ms
 ✓ tests/integration.test.ts > A2 product publish/unpublish appears on and disappears from the public site (cache purged) 19ms
 ✓ tests/integration.test.ts > A3/H6 public JSON never exposes cost, exact stock, supplier, customers or notes 2ms
 ✓ tests/integration.test.ts > A4 CSV import previews without writing, then confirms with duplicate handling 8ms
 ✓ tests/integration.test.ts > A5 purchase partly paid from Meezan: stock up, payable correct, bank balance down 17ms
 ✓ tests/integration.test.ts > A6 credit sale posts COGS at weighted cost; a later receipt adds NO extra revenue 13ms
 ✓ tests/integration.test.ts > A7 expired pesticide batch is hard-blocked; legal sale register is queryable 8ms
 ✓ tests/integration.test.ts > A8 all seven crops: net-weight arithmetic, sale, lot balance and farmer payment are isolated 101ms
 ✓ tests/integration.test.ts > A9 five other goods books post independently with their own stock and profit 32ms
 ✓ tests/integration.test.ts > A10 four money books are separate, transfers are not income/expense, fees are expenses 15ms
 ✓ tests/integration.test.ts > A11 party, book and money-book ledgers agree and statements render from snapshots 6ms
 ✓ tests/integration.test.ts > A12 expense, shop expense and payroll post; duplicate salary is blocked 11ms
 ✓ tests/integration.test.ts > A13 trial balance balances; balance sheet balances; P&L per book is available 6ms
 ✓ tests/integration.test.ts > A17 dashboard totals equal document totals equal party-ledger sums 5ms
 ✓ tests/integration.test.ts > A14 idempotent sync push does not double-post; insufficient stock becomes a CONFLICT 9ms
 ✓ tests/integration.test.ts > A18 usage meter reports D1 reads/writes; encrypted backup is created and integrity passes 32ms
 ✓ tests/integration.test.ts > A20 XSS in product description and enquiry is neutralised; SQL injection strings are harmless 9ms
 ✓ tests/integration.test.ts > A1 (b) a read-only auditor gets 403 on admin APIs (deny-by-default matrix) 115ms
 ✓ tests/routes.test.ts > web route matrix > every public/private GET used by the UI responds without a server error 236ms
 ✓ tests/routes.test.ts > web route matrix > private endpoints deny unauthenticated callers (H5) 175ms
 ✓ tests/routes.test.ts > web route matrix > feature checklist reports INCOMPLETE items rather than claiming everything is done 68ms
 ✓ tests/routes.test.ts > web route matrix > key POST actions the UI invokes are wired and reject malformed input with 4xx 131ms

 Test Files  4 passed (4)
      Tests  41 passed (41)
   Duration  3.08s (transform 411ms, collect 674ms, tests 1.63s)
```

**A15 (passkey/revoke), A16 (real Cloudflare staging restore) and A19 (dedicated quota/cache test) are NOT separate passing tests.** See `docs/ACCEPTANCE.md`.

## 3. `npm run query:plan` (EXPLAIN QUERY PLAN CI gate)

```
PASS  private products keyset
PASS  public products search
PASS  documents by date
PASS  party ledger by date
PASS  journal P&L by period
PASS  stock ledger by product
PASS  daily summary by date
PASS  sales list by date
PASS  purchases by book/date
PASS  account transactions
PASS  batches FEFO
PASS  audit by date
PASS  grain lots by crop
PASS  sync idempotency lookup
PASS  receipts by party

15/15 hot queries use an index; 0 full scans.
```

The first run failed with `FAIL documents by date / SCAN documents` and `FAIL sales list by date / SCAN sales`; `migrations/0003_hot_path_indexes.sql` was added and the gate now passes. Report: `.dev/query-plan-report.json`.

## 4. Migrations + seed

```
> npm run migrate:local
applied migrations/0001_init.sql
applied migrations/0002_system_seed.sql
applied migrations/0003_hot_path_indexes.sql
OK — 76 tables in /home/user/trade/.dev/zt.db
```

`npm run seed:generate` → `Generated migrations/0002_system_seed.sql with 417 statements.`
In-memory FK-on apply of all migrations succeeds; `0002` seeds 67 chart-of-accounts rows and 30 settings, **zero products**, `setup_complete=false`, `maund_kg=null`.

## 5. Local preview HTTP smoke (`npm run server`, port 3000)

```
/                                          200 1175B
/erp                                       200 1175B
/api/v1/health                             200 120B
/api/v1/public/home                        200 2321B
/api/v1/setup/status                       200 752B
/api/v1/auth/me                            401 149B
/manifest.webmanifest                      200 680B
/sw.js                                     200 3265B
/fonts/nastaliq-700.woff2                  200 157608B
/assets/index-B20xZ-j5.js                  200 359300B
/sitemap.xml                               200 1714B
/robots.txt                                200 99B
/some/unknown/page                         200 1175B
--- features summary ---
features 60 {"COMPLETE":33,"PARTIAL":22,"INCOMPLETE":5}
--- private API without session ---
{"ok":false,"error":{"code":"UNAUTHENTICATED","message_ur":"براہِ کرم دوبارہ لاگ ان کریں","message_en":"Please log in again"}}
```

`/api/v1/health` body: `{"ok":true,"data":{"service":"zeeshan-traders","at":"2026-11-03T09:50:12.735Z","runtime":"local-preview (node:sqlite)"}}`

The unknown non-API path returns the SPA shell (200) — intentional client-side 404. Unknown `/api/*` returns a JSON 404.

## 6. Encrypted backup → restore (local staging-equivalent)

```
> npx tsx scripts/restore.ts --file .test-backups/backups/01M6GDAEH1KFCE30SKAC9G4J1H.ztbak --key "$KEY" --verify-only
DECRYPT OK: 35014 bytes -> 294897 bytes NDJSON, 1032 rows, 48 tables
VERIFY-ONLY: decrypt + parse OK (no database written)

> npx tsx scripts/restore.ts --file ... --target .dev/restore-test.db --i-know-this-is-staging
DECRYPT OK: 35014 bytes -> 294897 bytes NDJSON, 1032 rows, 48 tables
RESTORE + INTEGRITY PASS: {
  "restored_rows": 1032,
  "restored_tables": 48,
  "database_tables": 76,
  "foreign_key_check": "PASS",
  "journal_balanced": true,
  "debit_paisa": 97939267,
  "credit_paisa": 97939267,
  "at": "2026-11-03T09:55:05.752Z"
}
```

This is a **local** staging-equivalent restore. A restore on a real Cloudflare staging D1 database is **INCOMPLETE** (no Cloudflare access), so `staging_restore_result` in `backup_logs` remains `NOT_TESTED` for production purposes.

## 7. NOT RUN / NO EVIDENCE (honest gaps)

| Gate | Status | Why |
|---|---|---|
| Playwright visual regression at 360 / 390 / 768 / 1280 | **INCOMPLETE** | `@playwright/test` and browser binaries are not installed in this sandbox; `playwright.config.ts` + `tests/visual/erp.spec.ts` exist but were never executed. No baseline screenshots exist. |
| Lighthouse CI | **INCOMPLETE** | `lighthouserc.json` + workflow exist; no Lighthouse run performed. |
| Urdu PDF screenshots on Android Chrome + desktop Chrome | **INCOMPLETE** | No browser/emulator available. Print templates are browser-rendered HTML+CSS but have not been screenshot-verified. |
| a11y automated (axe) | **INCOMPLETE** | Manual semantic labels/logical properties only. |
| Cloudflare D1 apply, R2 binding, staging + production deploy | **INCOMPLETE** | No Cloudflare account / domain / D1 UUID supplied; `wrangler.jsonc` has placeholders. |
| WebAuthn passkeys / A15 | **INCOMPLETE** | Server returns `501 INCOMPLETE_PASSKEYS`. |
| PIN-derived AES-GCM cache encryption | **COMPLETE (unit-tested)** | `offline-security.tsx` + `pin-crypto.ts`, 4 passing unit tests; **browser E2E of the unlock screen is INCOMPLETE**. |
| Real URLs | **NONE** | Only the Arena live preview of the local server exists; no verified production URL may be claimed. |

**Screenshots:** none were produced. This report deliberately does not include fabricated images.
