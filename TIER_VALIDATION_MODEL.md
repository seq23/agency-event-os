# Tier Validation Model — agency-event-os

Status: ACTIVE
Date: 2026-06-11
Scope: repo-wide validation, deployment, provider proof, completion language

## Source authority alignment

Source contract read twice before this patch. Enforcement basis:
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

### Tier 3 — Final release gate: deployed + real-provider proof

Tier 3 is the final validation tier for this repo.

Because this repo has provider-backed production behavior, Tier 3 must include:

- all Tier 1 checks
- all Tier 2 checks
- fresh deployed runtime proof against an explicit deployed base URL
- GitHub Actions/workflow verification when applicable
- runtime secret/env parity proof
- postdeploy smoke against the deployed URL, not localhost
- live provider proof for every provider lane listed in `REAL_PROVIDER_LANE_MATRIX.md`
- real storage/persistence readback for every critical user journey listed in `USER_JOURNEY_TEST_MATRIX.md`
- failure/revoked/invalid/replay/provider-unavailable paths
- generated artifact cleanup and no-secret verification before final packaging

If provider lanes exist and Tier 3 does not run or cannot prove them, Tier 3 must fail or return BLOCKED/UNPROVEN in a way that blocks COMPLETE.

### Tier 4 — not used

There is no Tier 4 validation layer.
Human approval, subjective design review, business acceptance, video/voice quality judgment, and owner signoff are approval overlays. They do not replace Tier 3 provider proof.

## Repo-specific final-tier burden

Level 6 proof burden because it is multi-role production event infrastructure with auth, event lifecycle, LiveKit/StreamYard/Daily/Zoom/email/Supabase providers, Cloudflare/OpenNext deployment, and protected role portals.

## Final command

```bash
npm run validate:everything -- --tier=3
```

## Required final-tier inputs

- POSTDEPLOY_BASE_URL or SMOKE_BASE_URL
- PLAYWRIGHT_BASE_URL
- STREAMYARD_REAL_PROVIDER_SMOKE=1
- LIVEKIT_*
- SUPABASE_*
- DAILY_* / ZOOM_* when fallback lanes run
- RESEND_API_KEY when email proof runs

## Completion language

Allowed:

- TIER 1 PASSED — STATIC/SOURCE ONLY
- TIER 2 PASSED — LOCAL BUILD/BROWSER ONLY
- TIER 3 PASSED — DEPLOYED + REAL PROVIDER PROOF
- BLOCKED — TIER 3 PROVIDER EVIDENCE REQUIRED
- PARTIAL — STATIC/LOCAL PASSED, FINAL TIER UNPROVEN

Forbidden:

- COMPLETE from Tier 1
- COMPLETE from Tier 2
- COMPLETE from mocked provider tests
- COMPLETE from postdeploy smoke without provider proof
- COMPLETE when any final-tier provider lane is UNPROVEN
