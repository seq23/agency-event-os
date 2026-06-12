# Tier Validation Model — agency-event-os

Status: ACTIVE
Date: 2026-06-12
Scope: repo-wide validation, deployment, provider proof, completion language

## Source authority alignment

Enforcement basis:

- Repo work must be correct, recoverable, and honestly validated, not route/file/screenshot theater.
- Runtime contexts are distinct proof layers: local, Playwright self-spawn, test process, CI, deployed runtime, smoke target, and provider dashboard state.
- Provider/webhook debugging starts with environment/signature parity, not guesses.
- Level 5/6 repos require role matrix, journey matrix, provider contract matrix, Master Gauntlet, postdeploy proof, and no demo fallback.
- Test harnesses are production-adjacent infrastructure and must not silently skip provider lanes.
- COMPLETE is blocked if runtime context parity, real provider proof, created-entity lifecycle, role enforcement, explicit smoke URL, no-generated-artifacts, or Master Gauntlet proof is missing.

## Tier model

### Tier 1 — Static / source / contract proof

Tier 1 may run before deploy and before live provider credentials are present.
It proves only static/source contracts: repo identity, docs, env registries, no-secret checks, validator admission, schema/domain checks, and source-level guardrails.

Tier 1 must never be described as deployment proof, browser proof, or real-provider proof.

### Tier 2 — Local runtime / browser / self-spawn proof

Tier 2 includes Tier 1 plus local build/typecheck/unit/integration and local browser proof.
For browser repos, local headed Playwright and self-spawn/server parity are expected where feasible.

Tier 2 must never be described as deployed proof or real-provider proof.

### Tier 3 — Deployed postdeploy critical proof / safe provider boundary

Tier 3 includes Tier 1 and Tier 2 plus deployed runtime proof against an explicit non-local deployed URL.

Tier 3 proves:

- fresh deployed runtime responds at the supplied base URL
- public, access, venue, and provider routes fail safely or render usefully
- critical postdeploy browser lanes run against deployed runtime
- provider routes do not crash, leak secrets, or dead-end when real credentials are absent or unavailable
- Cloudflare/OpenNext runtime differences are exposed through deployed smoke
- protected routes and provider endpoints fail closed when credentials/session context are missing

Tier 3 does **not** prove a real live StreamYard/LiveKit production event, real provider resource creation, real Supabase production persistence, real Daily/Zoom fallback, or real Resend transactional delivery unless those actions are separately run in Tier 4.

### Tier 4 — Final live-provider operational proof

Tier 4 is the final validation tier for this repo.

Tier 4 is intentionally separated from Tier 3 because it may use real credentials, create external provider resources, send provider API calls, require operator evidence, and potentially incur provider-side state or cost.

Tier 4 must prove:

- all Tier 1 checks
- all Tier 2 checks
- all Tier 3 deployed postdeploy checks
- real StreamYard Custom RTMP or controlled real broadcaster feeding LiveKit ingress
- real LiveKit room/ingress/webhook/media-state evidence
- real created-event lifecycle proof using production/deployed persistence where configured
- real Supabase write/readback proof for critical scoped event state
- real Daily fallback lane where Daily credentials are configured
- real Zoom SDK/signature readiness lane where Zoom credentials are configured
- real Resend transactional send proof to an approved test recipient where Resend credentials are configured
- role-boundary checks around all real provider/private surfaces
- no provider secret exposure in browser, traces, logs, reports, or evidence bundles
- cleanup / teardown or explicit retained-resource justification for provider resources

If a provider lane exists and Tier 4 does not run or cannot prove it, Tier 4 must fail or return BLOCKED/UNPROVEN in a way that blocks COMPLETE.

## Repo-specific final-tier burden

Level 6 proof burden because it is multi-role production event infrastructure with auth, event lifecycle, LiveKit/StreamYard/Daily/Zoom/email/Supabase providers, Cloudflare/OpenNext deployment, and protected role portals.

## Commands

Tier 3 deployed-safe gate:

```bash
npm run validate:everything -- --tier=3
```

Tier 4 final live-provider gate:

```bash
npm run validate:everything -- --tier=4
```

Focused Tier 4 live-provider orchestrator:

```bash
npm run tier4:live-provider-operational-proof
```

## Required Tier 3 inputs

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL or NEXT_PUBLIC_APP_URL

## Required Tier 4 inputs

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL
- TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF=1
- TIER4_STREAMYARD_LIVE_EVIDENCE_PATH
- STREAMYARD_REAL_PROVIDER_SMOKE=1
- STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1
- LIVEKIT_*
- SUPABASE_*
- DAILY_* / ZOOM_* when fallback lanes run
- RESEND_API_KEY + TIER4_EMAIL_TEST_TO when email proof runs

## Completion language

Allowed:

- TIER 1 PASSED — STATIC/SOURCE ONLY
- TIER 2 PASSED — LOCAL BUILD/BROWSER ONLY
- TIER 3 PASSED — DEPLOYED SAFE POSTDEPLOY PROOF ONLY
- TIER 4 PASSED — REAL LIVE PROVIDER OPERATIONAL PROOF
- BLOCKED — TIER 4 LIVE PROVIDER EVIDENCE REQUIRED
- PARTIAL — STATIC/LOCAL/POSTDEPLOY PASSED, LIVE PROVIDER FINAL TIER UNPROVEN

Forbidden:

- COMPLETE from Tier 1
- COMPLETE from Tier 2
- COMPLETE from Tier 3 when real provider proof is required
- COMPLETE from mocked provider tests
- COMPLETE from postdeploy smoke without Tier 4 provider proof
- COMPLETE when any Tier 4 provider lane is UNPROVEN

## Tier 3 vs Tier 4 boundary

Tier 3 answers: “Did the deployed app survive and fail safely?”

Tier 4 answers: “Did the actual provider-backed live event operation work with real credentials and evidence?”

Do not collapse these tiers. The separation prevents normal postdeploy validation from becoming bloated while preserving a hard final gate for true production proof.

## LiveKit Twirp URL Contract — 2026-06-12

- Validator: `npm run validate:livekit-twirp-url-contract`
- Included in: `npm run validate` through `validate:deploy-parity`
- Purpose: prevent both deployed app code and Tier 4 proof harnesses from using a `wss://` LiveKit client URL for server-side Twirp `fetch()` calls.
- Required trace: Tier 4 controlled proof reports classify failures as harness/env/provider/deployed-app failures and retain sanitized phase trace.

