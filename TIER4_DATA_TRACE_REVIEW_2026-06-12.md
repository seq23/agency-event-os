# Tier 4 Data Trace Review — agency-event-os

Status: STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED
Date: 2026-06-12
Scope: pre-test hostile data trace of Tier 4 scripts/tests added for real-provider operational proof.

## Trace path reviewed

1. Operator env input
   - `POSTDEPLOY_BASE_URL` / `PLAYWRIGHT_BASE_URL`
   - `TIER4_LIVE_PROVIDER_OPERATIONAL_PROOF`
   - `TIER4_EVENT_ID` / `TIER4_STAGE_ID`
   - StreamYard operator confirmation + evidence path
   - LiveKit, Supabase, Daily, Zoom, Resend provider envs
   - `V5_ACCESS_COOKIE_SECRET` for deployed operator-scoped API proof

2. Tier 4 orchestrator
   - `scripts/tier4_live_provider_operational_proof.mjs`
   - validates env/evidence before any expensive provider proof commands
   - derives event/stage IDs from evidence and forwards them consistently into probes/smokes/E2E

3. StreamYard/LiveKit smoke
   - `scripts/streamyard_livekit_real_provider_smoke.sh`
   - validates evidence without rejecting safe explanatory language
   - forwards Tier 4 event/stage IDs into the StreamYard producer ingress E2E

4. Real provider journey probe
   - `scripts/tier4_real_provider_journey_probe.mjs`
   - deployment identity
   - public denial for private provider APIs
   - operator-scoped LiveKit ingress
   - Supabase write/readback/cleanup
   - Daily room/token/cleanup when configured
   - Zoom unauthenticated denial + authorized signature when configured
   - Resend single approved test email when configured

5. Tier 4 Playwright
   - `tests/e2e/tier4-real-provider-journeys.spec.ts`
   - `tests/e2e/real-streamyard-livekit-media.spec.ts`
   - `tests/e2e/streamyard-producer-ingress.spec.ts`

## Issues found and fixed before local testing

1. Isolated Playwright request context bug
   - Problem: Tier 4 Playwright logged in through `page`, then used the isolated `request` fixture for operator-scoped API calls.
   - Risk: operator API checks could fail falsely because the API request context might not carry the operator cookie.
   - Fix: use `grantOperatorAccess(...)` and `page.context().request` for operator-scoped provider calls.

2. Tier 4 event ID drift / demo fallback risk
   - Problem: the StreamYard/LiveKit media E2E used `STREAMYARD_E2E_EVENT_ID || demo`, while the orchestrator derived the real event from the evidence packet.
   - Risk: Tier 4 could test `demo` while evidence referred to a different real event.
   - Fix: orchestrator now derives `TIER4_EVENT_ID` + `TIER4_STAGE_ID` from evidence and forwards both Tier 4 and StreamYard env aliases to every Tier 4 lane. Tier 4 tests now skip if no explicit event ID is present.

3. Evidence no-secret scan false positives
   - Problem: the evidence scanner rejected safe text such as “stream keys” or “bearer tokens” in explanatory notes.
   - Risk: valid redacted evidence copied from the template would fail before testing.
   - Fix: scanner now targets actual raw secret/value patterns rather than safe descriptive language.

4. Public provider API denial was too loose
   - Problem: Tier 4 public-denial test allowed `500`/`502` as “safe.”
   - Risk: server crashes or provider-env execution could masquerade as correct access denial.
   - Fix: public provider API calls must deny before provider execution with `401` or `403`.

5. V5 access cookie secret dependency was implicit
   - Problem: Tier 4 required deployed operator-scoped proof but did not fail early on missing `V5_ACCESS_COOKIE_SECRET` in the main orchestrator.
   - Risk: tests could fail later with unclear authentication behavior.
   - Fix: Tier 4 orchestrator now requires `V5_ACCESS_COOKIE_SECRET`; Playwright tests skip clearly if it is missing.

6. StreamYard producer smoke hard-coded demo
   - Problem: the smoke E2E always opened `/admin/testing/demo`.
   - Risk: Tier 4 could prove a seeded demo route instead of the live test event.
   - Fix: smoke E2E now uses explicit `TIER4_EVENT_ID` / `STREAMYARD_E2E_EVENT_ID`; real-provider mode skips without an explicit event ID.

## Remaining unproven layers

- TypeScript compile not run in sandbox because `node_modules/` is absent.
- Playwright not run in sandbox.
- Cloudflare/OpenNext build not run in sandbox.
- Tier 3 deployed proof not run.
- Tier 4 real-provider proof not run because it requires deployed URL, real credentials, StreamYard operator action, and evidence.

## Sandbox validation run after fixes

- `node --check scripts/tier4_live_provider_operational_proof.mjs` — PASS
- `node --check scripts/tier4_real_provider_journey_probe.mjs` — PASS
- `bash -n scripts/streamyard_livekit_real_provider_smoke.sh` — PASS
- evidence template no-secret scan false-positive check — PASS
- `npm run validate:tier4-contract` — PASS
- `npm run validate:final-tier-contract` — PASS
- `npm run validate:validator-admission` — PASS
- `npm run validate:no-generated-artifacts` — PASS
