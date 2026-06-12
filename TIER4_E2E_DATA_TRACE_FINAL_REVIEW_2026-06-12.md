# Tier 4 E2E Data Trace Final Review — 2026-06-12

## Purpose

This review exists to prevent the failures observed during Tier 4 from recurring across the provider ladder. The check covers both deployed app paths and Tier 4 harness paths.

## Failure classes reviewed

### 1. LiveKit Twirp URL normalization

Observed failure: server-side `fetch()` attempted to call `wss://.../twirp/...`.

Guards now present:

- App path uses `normalizeLiveKitApiBaseUrl()` before every LiveKit Twirp fetch.
- Tier 4 controlled RTMP harness uses `livekitApiBaseUrl()` before every LiveKit Twirp fetch.
- Tier 4 provider-ladder probe uses `livekitApiBaseUrl()` before every LiveKit Twirp fetch.
- LiveKit cleanup utility uses `livekitApiBaseUrl()` before every LiveKit Twirp fetch.
- `validate:livekit-twirp-url-contract` scans app, services, scripts, and tests for raw Twirp URL construction.

Trace phases:

- `deployed_app_livekit_ingress_request`
- `deployed_app_livekit_ingress_response`
- `harness_livekit_twirp_request`

### 2. LiveKit provider quota / stale ingress cleanup

Observed failure: LiveKit Cloud returned `resource_exhausted` because concurrent ingress limit was full.

Guards now present:

- Controlled RTMP proof auto-deletes created ingress with `Ingress/DeleteIngress`.
- Cleanup is in a `finally` path after ingress creation so a broadcast/harness failure still attempts teardown.
- `tier4:cleanup-livekit-ingress` safely deletes inactive `tier4-auto-*` ingress objects.
- Cleanup report is written to `reports/tier4/livekit-ingress-cleanup-report.json`.
- `validate:tier4-cleanup-contract` enforces cleanup code and docs.

Trace phases:

- `livekit_ingress_cleanup_start`
- `livekit_ingress_cleanup_result`

### 3. Deployed app stale cached ingress credentials

Potential failure found during final review: app runtime state can contain an ingress id that was deleted at the provider layer.

Guard now present:

- Before returning cached RTMP credentials, the app verifies the cached ingress id via `Ingress/ListIngress`.
- If the cached ingress is absent at LiveKit, the app creates a fresh ingress instead of returning stale credentials.

### 4. Controlled RTMP harness vs provider ladder event collision

Potential failure found during final review: controlled RTMP proof cleanup could delete the ingress for an event, then the provider-ladder probe could reuse the same event id and encounter stale cached app state.

Guard now present:

- Controlled RTMP proof and provider-ladder probe use separate event ids.
- Evidence includes `providerLadderEventId`.
- `TIER4_PROVIDER_LADDER_EVENT_ID` can explicitly override the provider-ladder event id.

### 5. Daily fallback resource cleanup

Potential fallback failure: Daily room is created, token proof fails, and cleanup never runs.

Guards now present:

- Daily room creation/token proof is wrapped so created rooms are deleted even when token issuance fails.
- `DAILY_API_BASE_URL` must be HTTPS for Tier 4 real-provider proof.
- Daily lane must prove `cleanupStatus=deleted`.

Trace phases:

- `daily_room_create_start`
- `daily_room_create_result`
- `daily_token_create_start`
- `daily_token_create_result`
- `daily_room_cleanup_start`
- `daily_room_cleanup_result`

### 6. Zoom fallback authorization and cleanup semantics

Zoom Meeting SDK signature issuance is stateless, so there is no provider resource to delete.

Guards now present:

- Unauthenticated Zoom signature request must be denied.
- Operator-authorized Zoom signature request must issue a signature.
- Evidence must record `cleanupStatus=not_required_stateless_signature`.

Trace phases:

- `zoom_unauth_signature_start`
- `zoom_unauth_signature_result`
- `zoom_auth_signature_start`
- `zoom_auth_signature_result`

### 7. Google Meet manual continuity fallback

Google Meet fallback is manual/static continuity. No provider object is created by the app.

Guards now present:

- Tier 4 requires `GOOGLE_MEET_MANAGED_FALLBACK_URL` / `GOOGLE_MEET_EMERGENCY_URL`, or explicit `TIER4_GOOGLE_MEET_NOT_APPLICABLE_REASON`.
- URLs must be HTTPS and Google/Meet-hosted.
- Evidence must record manual-only cleanup semantics.

Trace phases:

- `google_meet_url_check_start`
- `google_meet_url_check_result`

## Validation commands run in this artifact pass

- `node --check scripts/tier4_controlled_rtmp_broadcaster_proof.mjs`
- `node --check scripts/tier4_real_provider_journey_probe.mjs`
- `node --check scripts/livekit_cleanup_stale_ingress.mjs`
- `node scripts/validate_livekit_twirp_url_contract.js`
- `node scripts/validate_tier4_cleanup_contract.mjs`
- `node scripts/validate_tier4_provider_ladder_contract.mjs`
- `node scripts/validate-tier4-contract.mjs`
- `node scripts/validate-final-tier-contract.mjs`
- `node scripts/validate_structure.js`
- `npm run test -- --run tests/unit/livekitUrlNormalization.test.ts tests/unit/dailyProvider.test.ts tests/unit/videoFallbackPolicy.test.ts`
- `npm run validate`
- `node scripts/validate_no_generated_artifacts.js`

## Verdict

The Tier 4 ladder now separates app failure, harness failure, provider quota/cleanup failure, and fallback-specific failures. Tier 4 COMPLETE still requires local/deployed execution with real credentials, but the failure classes experienced today are now represented in code, evidence, cleanup, and validation contracts.
