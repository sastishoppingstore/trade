# NEW PROJECT — deployment plan (NOT DEPLOYED)

**Status: READY, NOT APPLIED (re-validated 2026-11-03).** The owner asked for a completely new project (new Worker,
new D1, new R2 — "old project ko touch nahi karo") and to do the domain later.
This file records exactly what was prepared, why it was not deployed, and the commands
to run from a machine that can reach Cloudflare.

## 1. What is new (nothing old was touched)

| Resource | NEW name | Old name (untouched) |
|---|---|---|
| Worker | `zt-v2` / `zt-v2-staging` | `zeeshan-traders` in `wrangler.jsonc` |
| D1 | `zt-v2-staging`, `zt-v2-production` | `zt-staging`, `zt-production` |
| R2 files | `zt-v2-files-staging`, `zt-v2-files-production` | `zt-private-staging`, `zt-private-production` |
| R2 backups | `zt-v2-backups-staging`, `zt-v2-backups-production` | (none) |
| Config | `wrangler.v2.jsonc` (new file) | `wrangler.jsonc` (unchanged) |

No Cloudflare API call was made, so **no existing Worker, D1 database or bucket was modified**.

## 2. Why there is no deployment / live URL (real evidence)

```
$ curl -sS --max-time 8 -o /dev/null -w 'http=%{http_code}' https://api.cloudflare.com/client/v4/
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to api.cloudflare.com:443
http=000
$ curl -sS --max-time 8 -o /dev/null -w 'http=%{http_code}' \
    https://<ACCOUNT_ID>.r2.cloudflarestorage.com/
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL ...
http=000
$ curl -sS --max-time 8 -o /dev/null -w 'http=%{http_code}' https://registry.npmjs.org/
http=200
```
This sandbox only permits `github.com`, `codeload.github.com`, `api.github.com`,
`registry.npmjs.org`, `pypi.org`, `files.pythonhosted.org`. Wrangler bundles locally but
`d1 create`, `r2 bucket create`, `d1 migrations apply` and `deploy` all need
`api.cloudflare.com`. Therefore: **no D1 created, no R2 created, no remote migrations,
no deploy, no verified URL.** Nothing was faked (hard rule H10).

## 3. Config validated for real (local dry-run)

```
$ npx wrangler deploy --dry-run -c wrangler.v2.jsonc --env staging
Total Upload: 1340.52 KiB / gzip: 244.44 KiB
env.DB (zt-v2-staging)  D1 Database · env.FILES (zt-v2-files-staging)  R2 Bucket · env.ASSETS
--dry-run: exiting now.                         → exit 0, 0 warnings

$ npx wrangler deploy --dry-run -c wrangler.v2.jsonc --env production
Total Upload: 1340.52 KiB / gzip: 244.44 KiB   → exit 0, 0 warnings
```
This also proves the Cloudflare Worker bundle (including the new WebAuthn passkey routes)
compiles with `nodejs_compat`.

## 4. Credentials — handled safely

The owner pasted an Account ID, an API token and R2 S3 credentials into the chat.
The **API token and R2 S3 keys were never written to any file, never committed, never
echoed in command output and never used** (the Cloudflare API is unreachable here).
The Account ID was initially written into `wrangler.v2.jsonc` and this document; it has
since been **removed from both** and must be supplied as `CLOUDFLARE_ACCOUNT_ID` on the
deploy machine. Treat it as an identifier, not a secret, but keep it out of Git. Two different token strings
appeared in the message: the "Your API Token" value and a longer one inside the curl
example (one extra trailing character). Use the **"Your API Token"** value and verify it
with `GET /accounts/{account_id}/tokens/verify` before any deploy.

> ⚠️ Because the token and S3 Secret Access Key were exposed in a chat message, **rotate /
> revoke them in the Cloudflare dashboard** and create fresh ones on the deploy machine.
> Never commit them; never enable `EXPOSE_SETUP_TOKEN` in production.

## 5. Commands to run on a machine WITH Cloudflare access

```bash
export CLOUDFLARE_API_TOKEN='<fresh token>'          # never commit
export CLOUDFLARE_ACCOUNT_ID='<your account id>'   # never commit
cd /home/user/trade
npm install --no-audit --no-fund
npm run build:web

# 1. Create ALL-NEW resources (do not reuse any old ID)
npx wrangler d1 create zt-v2-staging     -c wrangler.v2.jsonc
npx wrangler d1 create zt-v2-production  -c wrangler.v2.jsonc
npx wrangler r2 bucket create zt-v2-files-staging
npx wrangler r2 bucket create zt-v2-files-production
npx wrangler r2 bucket create zt-v2-backups-staging
npx wrangler r2 bucket create zt-v2-backups-production
# 2. Paste the two returned database_id values into wrangler.v2.jsonc
#    (REPLACE_WITH_NEW_STAGING_D1_UUID / REPLACE_WITH_NEW_PRODUCTION_D1_UUID).

# 3. Secrets (names only; values via `wrangler secret put`, one per environment)
for E in staging production; do
  npx wrangler secret put SETUP_TOKEN            -c wrangler.v2.jsonc --env "$E"
  npx wrangler secret put SESSION_SECRET         -c wrangler.v2.jsonc --env "$E"
  npx wrangler secret put DATA_ENCRYPTION_KEY    -c wrangler.v2.jsonc --env "$E"
  npx wrangler secret put BACKUP_ENCRYPTION_KEY  -c wrangler.v2.jsonc --env "$E"
done
# TURNSTILE_SECRET / TURNSTILE_SITEKEY are optional (the gate is off without the secret).

# 4. Migrations on each fresh D1, then staging deploy
npx wrangler d1 migrations apply zt-v2-staging    --remote -c wrangler.v2.jsonc --env staging
npx wrangler deploy -c wrangler.v2.jsonc --env staging
# 5. Verify staging: /api/v1/health, /, /erp, /api/v1/public/home, /api/v1/features,
#    first nightly backup, and a RESTORE INTO STAGING (scripts/restore.ts) before production.
npx wrangler d1 migrations apply zt-v2-production --remote -c wrangler.v2.jsonc --env production
npx wrangler deploy -c wrangler.v2.jsonc --env production
```

**Before the owner enrols a passkey**, set `RP_ID` and `RP_ORIGIN` in the environment vars
to the final domain — WebAuthn credentials are domain-bound (Part 10.3). The domain is
deferred by the owner, so passkeys currently use `localhost` only for local E2E tests.

Recommend **Workers Paid** for production (free plan: 10 ms CPU/request and daily D1
read/write caps that fail queries once hit). Re-verify every Cloudflare limit/price on the
live docs on the deploy date; figures researched 2026-11-03 are in `docs/ASSUMPTIONS.md`.

## 6. What remains INCOMPLETE until step 5 is actually run

`P12-DEPLOY`, real staging restore (`A16` / `P12-RESTORE`), production R2 binding,
real Cloudflare edge cache purge verification, real Turnstile siteverify, a live public URL,
and a physical-Android-Chrome Urdu PDF screenshot. All are labelled honestly in
`/erp/status`, `docs/KNOWN_LIMITATIONS.md` and the final report.

## 7. REAL deploy attempt from this sandbox (2026-11-03, 12:53 PKT)

The owner asked to deploy after the push. A real `wrangler deploy` WAS attempted; no result was faked:

```
$ curl -sS --max-time 8 -o /dev/null -w 'api.cloudflare.com http=%{http_code}' https://api.cloudflare.com/client/v4/
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to api.cloudflare.com:443
api.cloudflare.com http=000
$ curl -sS --max-time 8 -o /dev/null -w 'registry.npmjs.org http=%{http_code}' https://registry.npmjs.org/
registry.npmjs.org http=200
$ env | grep -c '^CLOUDFLARE_'
0
$ CI=1 npx wrangler deploy -c wrangler.v2.jsonc --env staging
⛅️ wrangler 4.45.0
✘ [ERROR] In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN
   environment variable for wrangler to work.
deploy_exit=1
```

Two independent blockers: (1) no Cloudflare credential is stored in this workspace — the API token and
R2 S3 keys pasted in chat were deliberately **never persisted** (and must be rotated); (2) outbound
network is limited to github.com / npm / pypi, so even with a token `api.cloudflare.com` is unreachable.
**Therefore: no deploy, no D1, no R2, no verified URL. Deployment remains INCOMPLETE.**

## 8. Safe one-click path — GitHub Actions (`.github/workflows/deploy-v2.yml`)

GitHub Actions runners CAN reach Cloudflare, so the owner supplies access **securely through GitHub
Secrets** — never in chat, never in Git:

1. GitHub → Settings → Secrets and variables → Actions → **New repository secret**, add:
   `CLOUDFLARE_API_TOKEN` (fresh/rotated), `CLOUDFLARE_ACCOUNT_ID`, `V2_SETUP_TOKEN`,
   `V2_SESSION_SECRET`, `V2_DATA_ENCRYPTION_KEY`, `V2_BACKUP_ENCRYPTION_KEY`.
   Generate the last three with `openssl rand -base64 32`. `V2_SETUP_TOKEN` is shown to the operator
   once and used for the one-time `/api/v1/setup`.
2. Optional: `TURNSTILE_SECRET`, `TURNSTILE_SITEKEY` once the real widget exists.
3. Actions → **Deploy zt-v2 (NEW project only)** → Run workflow → choose `staging` →
   type `CREATE-NEW`. The workflow verifies the token, runs `check:all` + `deploy:dryrun`, creates
   ONLY `zt-v2-*` D1/R2 resources, applies remote migrations, sets Worker secrets, deploys and prints
   the real URL. Repeat with `production` only after staging is verified.
4. Enter `rp_id` / `rp_origin` ONLY after the final domain is chosen; WebAuthn credentials are
   domain-bound, so passkeys must be enrolled afterwards.

The workflow is `workflow_dispatch`-only with a confirmation phrase: it cannot run accidentally and
never references the old project. It is **NOT YET RUN** — no live URL is claimed.
