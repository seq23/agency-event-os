# Artifact Manifest — agency-event-os

Artifact: `agency-event-os-main_BASELINE_06-12-26_d7595a6f.zip`
Repo: `agency-event-os`
Packaged root: repository root
Artifact type: full baseline snapshot ZIP
Status: STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED

## Source

Input artifact: `agency-event-os-main_BASELINE_06-12-26_3b7cdfa4.zip`
User-reported failing proof: Tier 4 real-provider journeys blocked because owner/master login reached the operator gate but did not enter the private provider controls surface.

## Change summary

Packaging correction in this repack:

- Restored committed `.env.example` from the user-supplied source artifact.
- Restored committed `.env.local.example` from the user-supplied source artifact.
- Rechecked file inventory against the original upload; after restore, no files are missing from the original baseline inventory.

This pass closes the owner/master universal authority gap across production access gates while preserving role-specific boundaries:

- Operator Launchpad now accepts a valid owner master cookie as universal authority in addition to the operator cookie.
- Operator Packet now accepts a valid owner master cookie in addition to the operator cookie.
- Operator, crew, and special-guest gates preserve a safe `next` target so owner/master login can continue to the originally requested protected surface.
- Crew capability server actions now allow owner/master authority before evaluating crew-role capability limits.
- Speaker/sponsor/client/VIP event-role server actions now allow owner/master authority before evaluating special-guest role limits.
- Logout now clears the owner cookie as well as crew/operator/special-guest cookies.
- Access-boundary and V7 validators were updated to enforce both requirements: operator access remains required, and owner/master universal authority remains accepted.
- Unit coverage was expanded so owner/master route authority covers operator, crew, speaker, sponsor, client, VIP/venue, billing, app, admin, and operator-packet surfaces; operator still cannot escalate into owner-only or special-guest surfaces.

## Changed files

- `app/operator-packet/page.tsx`
- `app/production-access/crew/page.tsx`
- `app/production-access/launchpad/page.tsx`
- `app/production-access/logout/route.ts`
- `app/production-access/operator/page.tsx`
- `app/production-access/special-guest/page.tsx`
- `lib/auth/requireCrewCapability.ts`
- `lib/auth/requireEventRole.ts`
- `lib/env/safeEnv.ts`
- `scripts/validate_access_boundary_contract.js`
- `scripts/validate_v7_operator_launchpad.js`
- `scripts/validate_v7_route_safety.js`
- `tests/unit/v5RouteAuthorization.test.ts`
- `ARTIFACT_MANIFEST.md`
- `.env.example`
- `.env.local.example`
- `_artifact_manifest.json`

## Validation performed in sandbox

- `npm run typecheck` — PASS
- `npm run lint` — PASS, no warnings/errors
- `npm run test -- --run tests/unit/v5RouteAuthorization.test.ts tests/unit/crewCapabilityLoginFlow.test.ts tests/unit/specialGuestAccessFlow.test.ts tests/unit/productionAccessCookie.test.ts` — PASS, 18 tests
- `npm run validate:access-boundaries` — PASS
- `npm run validate:v7` — PASS
- `npm run validate:tier4-provider-ladder-contract` — PASS
- `npm run validate:tier4-live-event-fallback-runtime` — PASS
- `npm run validate:tier4-attendee-live-consumption-contract` — PASS
- `npm run validate` — PASS, including typecheck, lint, 64 unit test files / 146 tests, V5 hard validators, V7 validators, deploy-parity validators, Tier 4 contract validators
- `npm run validate:tier4-contract` — PASS
- `npm run validate:no-generated-artifacts` — PASS after cleanup
- `npm run validate:env` — PASS; examples inspected: `.env.example`, `.env.local.example`; missing from examples: none
- `npm run validate:env-access-gates` — PASS
- `npm run validate:required-env-registry` — PASS
- `npm run validate:v5-no-secrets` — PASS

## Browser/provider validation attempted but not proven in sandbox

- `npx playwright test tests/e2e/tier4-real-provider-journeys.spec.ts --trace on --workers=1` was attempted against deployed Cloudflare and local self-spawn contexts.
- Container browser/network policy blocked browser navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`; the deployed request pass also hit transient DNS `EAI_AGAIN`.
- This is not counted as app failure proof and not counted as browser proof success.
- Full Tier 4 live-provider proof still must run on the user's local machine with encrypted `.env.local` and provider credentials.

## Required local sequence

After applying this ZIP locally with the v3 updater, run:

```bash
npm run validate
```

Then run the Tier 4 provider proof command locally:

```bash
npm run env:run -- -- bash -lc 'set -a; . ./.env.local; set +a; export POSTDEPLOY_BASE_URL=https://west-peek-live.seq-taylor.workers.dev PLAYWRIGHT_BASE_URL=https://west-peek-live.seq-taylor.workers.dev SMOKE_BASE_URL=https://west-peek-live.seq-taylor.workers.dev TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 TIER4_CONTROLLED_RTMP_BROADCASTER=1 TIER4_CLOUDFLARE_STREAM_CONTROLLED_BROADCASTER=1 TIER4_RESEND_SEND_APPROVED=1 STREAMYARD_REAL_PROVIDER_SMOKE=1 STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 TIER4_STREAMYARD_LIVE_EVIDENCE_PATH=reports/tier4/streamyard-livekit-evidence.json TIER4_EMAIL_TEST_TO="${TIER4_EMAIL_TEST_TO:-${EMAIL_REPLY_TO:-}}"; npm run tier4:auto-controlled-livekit-proof'
```
