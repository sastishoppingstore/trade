# ACCEPTANCE LIST — A1…A20 (Phase 0 registry, real results in TEST_REPORT.md)

| Gate | Requirement | Automated evidence | Result |
|---|---|---|---|
| A1 | One-time setup creates owner, cannot re-run; unauthenticated 403/401 | `tests/integration.test.ts` A1, H5; `tests/routes.test.ts` deny-by-default | PASS |
| A2 | Publish / unpublish + cache purge appears/disappears on public site | A2 | PASS |
| A3 | Public raw JSON never exposes cost, margin, supplier, exact stock, customers, notes | A3/H6 | PASS |
| A4 | CSV import previews without writes, then confirms with duplicate handling | A4 | PASS |
| A5 | Purchase partly paid from Meezan: stock up, payable correct, bank down | A5 | PASS |
| A6 | Credit sale posts COGS at weighted average; later receipt adds NO extra revenue | A6 | PASS |
| A7 | Expired pesticide batch hard-blocked; legal sale register queryable | A7 | PASS |
| A8 | Seven crops: net-weight arithmetic, sale, lot balance, farmer payment isolated | A8 | PASS |
| A9 | Five other goods books post independently with own stock/profit | A9 | PASS |
| A10 | Four money books separate; transfers not income/expense; fees are expenses | A10 | PASS |
| A11 | Party, book and money-book ledgers agree; statements render from snapshots | A11 | PASS |
| A12 | Expense, shop expense, payroll post; duplicate salary blocked | A12 | PASS |
| A13 | Trial balance balances; balance sheet balances; P&L per book | A13 | PASS |
| A14 | Offline push is idempotent; insufficient stock becomes a flagged CONFLICT | A14 | PASS |
| A15 | Passkey enrol / login / revoke | **NO TEST** — server returns `501 INCOMPLETE_PASSKEYS` | **INCOMPLETE** |
| A16 | Encrypted backup + **staging** restore test | A18 covers encrypted backup; `scripts/restore.ts` passed on a local staging-equivalent DB (1032 rows, FK + journal PASS) | **PARTIAL** — real Cloudflare staging restore not run |
| A17 | Dashboard totals = document totals = party-ledger sums | A17 | PASS |
| A18 | Usage meter + encrypted backup + integrity | A18 | PASS |
| A19 | Quota/cache behaviour (70 % warning, 60–300 s public cache, purge) | usage meter + `/api/v1/usage` tested in A18; edge cache purge only partial; no dedicated A19 test | **PARTIAL / NOT SEPARATELY TESTED** |
| A20 | IDOR / SQLi / XSS | A20 (XSS + injection strings) and A1(b) 403 auditor matrix | PASS for the tested cases; full route-by-route IDOR matrix is PARTIAL |

Additional automated gates: 14 unit tests (H1/H4/security primitives), 4 route-matrix tests, `npm run typecheck` (0 errors), `npm run query:plan` (15/15), `npm run build:web`, local server smoke (HTTP 200/401 checks).

**Do not claim A1–A20 all pass.** A15 is INCOMPLETE, A16 is PARTIAL, A19 is not a separate test.
