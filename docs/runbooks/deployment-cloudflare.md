# Cloudflare Deployment Runbook — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

Deployment target: Cloudflare Worker through OpenNext.

## Automatic push deploy path

This repo includes `.github/workflows/deploy-cloudflare-worker.yml`.

On push to `main`, GitHub Actions will:

1. install dependencies with `npm ci`
2. run `npm run validate:everything -- --tier=1`
3. run `NODE_OPTIONS=--max-old-space-size=3072 npm run cf:build`
4. deploy with Cloudflare Wrangler
5. run postdeploy smoke if `POSTDEPLOY_BASE_URL` is configured as a repository variable/secret

Required GitHub Secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Required Cloudflare Worker secrets are listed in `_env_contract.json` and `deployment/cloudflare-required-secrets.json`.

## Manual deploy

```bash
npm run deploy:doctor
NODE_OPTIONS="--max-old-space-size=3072" npm run cf:build
npm run cf:deploy
POSTDEPLOY_BASE_URL="https://westpeek.live" npm run postdeploy:full
```

Local success is not deployed proof.

## Cloudflare dashboard command rule

Cloudflare deploys must not run plain `next build` followed by `npx wrangler deploy`. The repo default `npm run build` is now Cloudflare-aware and emits `.open-next` output for dashboard builds. Manual operators may still run `npm run cf:build` followed by `npm run cf:deploy`.

`postdeploy:browser` is scoped to deployed-safe browser proof only. Local credentialed/operator journey gauntlets remain local validation lanes unless matching deployed test credentials and real provider proof are intentionally supplied.

