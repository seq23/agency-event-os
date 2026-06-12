# Environment Setup Runbook — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

## Canonical files

- Env contract: `_env_contract.json`
- Existing registry: `deployment/env-var-registry.json`
- Cloudflare required secrets: `deployment/cloudflare-required-secrets.json`
- Local private restore policy: `ENV_RESTORE_POLICY.md`

## Local env source policy

Real secret values and plaintext `.env.local` are not committed to source ZIPs.

The repo no longer requires a repo-local `secrets/agency-event-os.env.local.gpg` file. Instead, local Tier 2/Tier 3 testing restores `.env.local` from an external private source discovered by `npm run env:restore`.

Approved local-only sources:

- `AGENCY_EVENT_OS_ENV_GPG_PATH=/absolute/path/to/agency-event-os.env.local.gpg`
- `AGENCY_EVENT_OS_ENV_LOCAL_PATH=/absolute/path/to/.env.local.backup`
- `AGENCY_EVENT_OS_ENV_BACKUP=/absolute/path/to/.env.local.backup`
- `~/.config/agency-event-os/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.backup`

## Optional local vault creation

From a trusted local machine with a correct `.env.local`, create an external vault outside the repo:

```bash
mkdir -p ~/.config/agency-event-os
gpg --symmetric --cipher-algo AES256 --output ~/.config/agency-event-os/agency-event-os.env.local.gpg .env.local
```

Do not store the passphrase in the repo.

## Restore/remove

```bash
npm run env:restore
npm run env:remove
```

## Temporary env test wrapper

Predeploy local proof:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:tier2:with-env
```

Postdeploy / final provider proof:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" \
PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" \
NODE_OPTIONS="--max-old-space-size=3072" \
npm run test:everything:tier3:with-env
```

## Parity trace

```bash
npm run env:trace
```

## Cloudflare secret sync

Dry-run:

```bash
npm run cloudflare:secrets:sync -- --dry-run
```

Execute:

```bash
npm run cloudflare:secrets:sync -- --execute
```

This sets expected secret names only from `.env.local`; values are not printed.
