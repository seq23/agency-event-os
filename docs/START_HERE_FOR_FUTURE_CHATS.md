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


## Live click audit requirement

Live smoke is not enough.

A Cloudflare deploy is not COMPLETE until the deployed click audit also passes:

\`\`\`bash
SMOKE_BASE_URL=https://west-peek-live.seq-taylor.workers.dev npm run postdeploy:full
\`\`\`

Required final status ladder:

\`\`\`text
LOCAL VALIDATION PASS
CLOUDFLARE BUILD PASS
CLOUDFLARE DEPLOY PASS
LIVE SMOKE PASS
LIVE CLICK AUDIT PASS
COMPLETE
\`\`\`

If the deployed click audit fails, status is BLOCKED.


## Emergency production access regression rule

The crew and special guest gates must never import public-runtime Node-only crypto code or runtime persistence that can throw during page render. Access audit logging is best-effort only: logging failures must never crash `/production-access/crew`, `/production-access/special-guest`, or `/production-access/launchpad`. West Peek Productions logo coverage is global and required on every page through the root layout.

## Production config hard-fail policy

Missing production config is never a success state. Branded setup errors exist only as a user-facing blast shield to prevent generic Next digest pages; they do not make a deployment complete.

Required production env/secret names are derived from `deployment/env-var-registry.json` plus `data/access/event-access-config.json`. When a new `process.env.*` key is added, `validate_required_env_registry.js` forces it to be classified, and `sync_required_secrets_manifest.js` derives the Cloudflare required-secret manifest and `.env.example` from that registry.

Before any trusted deploy, run:

```bash
npm run predeploy:hard
```

This blocks deploys when required production config is missing, when `VIDEO_PROVIDER=mock`, when mock video override is enabled, when Daily fallback is not enabled, or when the Cloudflare secret manifest is out of sync.
