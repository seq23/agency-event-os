# Artifact Manifest — agency-event-os

Artifact: `agency-event-os-main_BASELINE_06-12-26_tier4_attendee_surface_hostile_pass.zip`
Repo: `agency-event-os`
Packaged root: repository root
Artifact type: full baseline snapshot ZIP
Status: STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED

## Source

Input artifact: `agency-event-os-main_BASELINE_06-12-26_tier4_attendee_surface_final.zip`

## Change summary

This hostile pass preserves the prior Tier 4 fixes and closes one remaining proof weakness:

- `stage-stream-fallback` returns public-safe stream state, not raw provider/private state.
- Unknown Tier 4 runtime event IDs preserve identity instead of falling back to the Nova demo event.
- `LiveKitIngressStagePlayer` keeps a stable attendee surface wrapper across loading/token-issued/token-error states.
- Tier 4 attendee browser proof now requires actual browser token issuance and `token-issued` surface state, not just surface presence.
- Validators now guard against reverting to surface-count-only proof.

## Changed files in this hostile pass

- `scripts/tier4_attendee_live_consumption_gauntlet.mjs`
- `scripts/validate_tier4_attendee_live_consumption_contract.mjs`
- `scripts/validate_stage_player_ux_contract.js`
- `HOSTILE_REVIEW_TIER4_ATTENDEE_SURFACE_FINAL_2026-06-12.md`
- `ARTIFACT_MANIFEST.md`
- `_artifact_manifest.json`

## Validation performed in sandbox

- `node --check scripts/tier4_attendee_live_consumption_gauntlet.mjs` — PASS
- `node --check scripts/validate_tier4_attendee_live_consumption_contract.mjs` — PASS
- `node --check scripts/validate_stage_player_ux_contract.js` — PASS
- `npm run validate:stage-player-ux` — PASS
- `npm run validate:tier4-attendee-live-consumption-contract` — PASS
- `npm run validate:tier4-live-event-fallback-runtime` — PASS
- `npm run validate:tier4-provider-ladder-contract` — PASS

## Validation not claimed

- Full `npm run validate` after this hostile pass was not rerun in sandbox because dependency install timed out here.
- Deployed Tier 4 live-provider proof was not run in sandbox because it requires local encrypted env and provider credentials.
- Cloudflare deployment status was not checked from sandbox.

## Required local sequence

After applying this ZIP locally:

```bash
npm run validate
```

After deploy:

```bash
npm run env:run -- -- bash -lc 'set -a; . ./.env.local; set +a; export POSTDEPLOY_BASE_URL=https://west-peek-live.seq-taylor.workers.dev PLAYWRIGHT_BASE_URL=https://west-peek-live.seq-taylor.workers.dev SMOKE_BASE_URL=https://west-peek-live.seq-taylor.workers.dev TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1 TIER4_CONTROLLED_RTMP_BROADCASTER=1 TIER4_CLOUDFLARE_STREAM_CONTROLLED_BROADCASTER=1 TIER4_RESEND_SEND_APPROVED=1 STREAMYARD_REAL_PROVIDER_SMOKE=1 STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 TIER4_STREAMYARD_LIVE_EVIDENCE_PATH=reports/tier4/streamyard-livekit-evidence.json TIER4_EMAIL_TEST_TO="${TIER4_EMAIL_TEST_TO:-${EMAIL_REPLY_TO:-}}"; npm run tier4:auto-controlled-livekit-proof'
```
