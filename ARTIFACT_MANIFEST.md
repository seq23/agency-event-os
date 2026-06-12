# Artifact Manifest — agency-event-os

Artifact: `agency-event-os-main_BASELINE_06-12-26_b405d3f.zip`
Repo: `agency-event-os`
Packaged root: repository root
Artifact type: full baseline snapshot ZIP
Status: STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED

## Change summary

- Executed against the Tier 4 hostile review report.
- Added server-side authorization to `/api/video/zoom-signature` so Zoom SDK signatures are not public/provider-open.
- Added `scripts/tier4_real_provider_journey_probe.mjs` for deployed real-provider proof across LiveKit ingress, Supabase write/readback, Daily fallback, Zoom gated signature, Resend approved test email, deployment identity, and private provider role boundaries.
- Expanded `scripts/tier4_live_provider_operational_proof.mjs` so Tier 4 now runs the real-provider journey probe plus StreamYard/LiveKit smoke and E2E lanes.
- Expanded Tier 4 evidence requirements so COMPLETE is blocked unless deployment identity, LiveKit provider API proof, Supabase persistence proof, and role-boundary proof are present.
- Added Tier 4 real-provider user-journey Playwright coverage for private provider API denial and attendee no-secret exposure.
- Added `validate:tier4-hostile-coverage` and admitted the new validator/test/probe scripts into the validator admission register and validation matrix.
- Updated Tier 4 env docs/examples for event/stage IDs, Zoom meeting number, Supabase proof table, Resend send approval, and failure-harvest control.

## Changed files

- `.env.example`
- `.env.local.example`
- `ARTIFACT_MANIFEST.md`
- `ENVIRONMENT_VARIABLES.md`
- `REAL_PROVIDER_LANE_MATRIX.md`
- `TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF.md`
- `TIER4_PROVIDER_EVIDENCE_TEMPLATE.json`
- `_artifact_manifest.json`
- `_env_contract.json`
- `_repo_validation_matrix.json`
- `_validator_admission_register.json`
- `deployment/env-var-registry.json`
- `package.json`
- `app/api/video/zoom-signature/route.ts`
- `scripts/tier4_live_provider_operational_proof.mjs`
- `scripts/tier4_real_provider_journey_probe.mjs`
- `scripts/validate-tier4-hostile-coverage.mjs`
- `tests/e2e/tier4-real-provider-journeys.spec.ts`
- `VALIDATOR_ADMISSION_REGISTER.md`

## Validation performed in sandbox

- `node --check scripts/tier4_live_provider_operational_proof.mjs` — PASS
- `node --check scripts/tier4_real_provider_journey_probe.mjs` — PASS
- `node --check scripts/validate-tier4-hostile-coverage.mjs` — PASS
- `npm run tier4:live-provider-operational-proof` without Tier 4 env — EXPECTED BLOCKED exit 2, confirmed fail-closed behavior
- `npm run tier4:real-provider-journey-probe` without Tier 4 env — EXPECTED BLOCKED exit 2, confirmed fail-closed behavior
- `npm run validate:deploy-parity` — PASS
- `npm run validate:tier4-contract` — PASS
- `npm run validate:final-tier-contract` — PASS
- `npm run validate:validator-admission` — PASS
- `npm run validate:no-generated-artifacts` — PASS

## Validation not claimed

- TypeScript compile was not run because `node_modules/` is not present in the sandbox ZIP working copy.
- Full build was not run.
- Local Playwright was not run.
- Cloudflare/OpenNext build was not run.
- Deployed Tier 3 was not run.
- Real live-provider Tier 4 was not run because real credentials, deployed URL, StreamYard operator action, and provider evidence are external prerequisites.

## Expected local sequence

After applying the ZIP locally:

```bash
NODE_OPTIONS="--max-old-space-size=3072" npm run validate:deploy-parity
NODE_OPTIONS="--max-old-space-size=3072" npm run validate:tier4-contract
NODE_OPTIONS="--max-old-space-size=3072" npm run validate:validator-admission
```

After deploy, run Tier 3:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" NODE_OPTIONS="--max-old-space-size=3072" npm run test:everything:tier3:with-env
```

For final real-provider proof, run Tier 4 only after real credentials/operator evidence exist:

```bash
POSTDEPLOY_BASE_URL="https://<fresh-deployment-url>" PLAYWRIGHT_BASE_URL="https://<fresh-deployment-url>" TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 STREAMYARD_REAL_PROVIDER_SMOKE=1 STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 TIER4_STREAMYARD_LIVE_EVIDENCE_PATH="reports/tier4/streamyard-livekit-evidence.json" TIER4_EVENT_ID="tier4-YYYY-MM-DD-001" TIER4_STAGE_ID="main-stage" TIER4_RESEND_SEND_APPROVED=1 NODE_OPTIONS="--max-old-space-size=3072" npm run tier4:live-provider-operational-proof
```
- `scripts/validate_tier4_provider_ladder_contract.mjs` — validates expanded Tier 4 provider ladder data trace and cleanup semantics.
