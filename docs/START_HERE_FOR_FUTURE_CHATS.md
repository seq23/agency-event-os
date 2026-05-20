# START HERE FOR FUTURE CHATS — West Peek Live

CRITICAL — DO NOT SKIP.

West Peek Live is not a simple static site. It has:

- Cloudflare Worker runtime
- OpenNext bundling
- Cloudflare secrets
- role-gated production access
- crew/special guest access cookies
- demo access codes
- runtime persistence
- Supabase runtime tables
- LiveKit/Daily/Zoom/Google Meet fallback behavior
- public/demo/front-door venue routes

Local source validation is not enough.

## Required reading before changing this repo

Read these files before making repo changes:

1. docs/CHAT_HANDOFF_DEPLOYMENT_PARITY_RULES.md
2. docs/DEPLOYMENT_PARITY_CHECKLIST.md
3. docs/DEPLOYMENT_ENV_CHECKLIST.md
4. docs/MASTER_PLAN_V7_UX_BRAND_DEMO_REPAIR.md
5. docs/AGENCY_EVENT_OS_DAY1_OPERATOR_PACKET.md
6. deployment/cloudflare-required-secrets.json
7. scripts/post_deploy_smoke_test.js
8. package.json scripts

## Non-negotiable delivery rule

A ZIP is not deploy-ready until:

- fresh-ZIP validation passes
- npm run validate passes
- npm run build passes
- npm run cf:build passes
- deploy-parity validators pass
- post_deploy_smoke_test.js is current

A Cloudflare deploy is not complete until this passes against the actual Worker URL:

```bash
SMOKE_BASE_URL=https://west-peek-live.seq-taylor.workers.dev node scripts/post_deploy_smoke_test.js
```

Never claim COMPLETE before live smoke passes.

## What failed previously

The repo validated locally, but deployed Cloudflare runtime still failed because:

- required Cloudflare secrets were missing
- smoke test paths/markers had drifted
- runtime persistence behaved differently in the Worker
- front-door routes were not smoke-tested as a hard deploy gate

This repo now has deploy-parity validators to prevent future chats from repeating that mistake.


## Runtime store deploy keys

For the Day 1 Cloudflare demo deployment, these runtime-store keys must be represented in the Cloudflare secret manifest and deployment docs:

```text
AGENCY_EVENT_OS_RUNTIME_STORE=file
ALLOW_FILE_RUNTIME_STORE_IN_PRODUCTION=true
```

These are intentional for the current demo Worker so front-door venue/admin smoke routes do not hard-depend on Supabase runtime writes while the production database path is still being stabilized.
