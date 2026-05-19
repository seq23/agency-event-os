# West Peek Live — Master Plan v5

## Status

V5 is a repair plan, not a feature expansion. The goal is to convert the v4 shell implementation into a secure, deterministic, validator-aligned system.

## Non-negotiable correction

The v4 artifact must not be applied as production-safe. V5 starts by fixing validator regression and auth/access security before touching UX polish.

## V5 execution order

### Phase 0 — Restore validator baseline

1. Fix `.env.example` so existing branding, Daily fallback, and white-label video validators pass.
2. Restore post-deploy smoke coverage removed by v4.
3. Split validators into hard-fail, strong-warning, and warning lanes.

### Phase 1 — Security/auth/access hardening

1. Replace weak cookie signature with real HMAC.
2. Remove default/backup access secrets from production paths.
3. Remove raw demo role codes from source.
4. Implement role + event scoped route authorization.
5. Add access attempt audit logging.
6. Replace logout page with route handler.
7. Add tests.

### Phase 2 — Config authority + runtime bridge

1. Add event config repository.
2. Load public code and role env-key config from `data/events` and `data/access`.
3. Normalize demo slug/publicCode/eventId.
4. Add schema and cross-file validators.

### Phase 3 — Publishing pipeline honesty

1. Pick one canonical workflow filename.
2. Implement payload/config-package ingestion.
3. Fail if workflow creates no diff.
4. Keep PR boundary; no app direct commit to main.

### Phase 4 — Runtime state and persistence

1. Fix migration type strategy and add constraints/indexes/RLS position.
2. Wire audit/access/analytics/fallback events into runtime service interfaces.
3. Make reports explicitly real or unavailable.

### Phase 5 — Video fallback operations

1. Preserve LiveKit → Daily → Zoom → Google Meet.
2. Daily auto only.
3. Zoom crew-confirmed.
4. Google Meet manual last resort.
5. Add room override/rollback mutation and audit.

### Phase 6 — Public attendee and portal UX states

1. Make public event slug handling safe.
2. Make registration real or clearly disabled.
3. Add not-open/ended/replay/fallback/support/mobile states.
4. Add role-specific portal denial states.

### Phase 7 — Docs/runbooks reconciliation

Docs must describe what the code does, not what v4 wanted the code to do.

## V5 hard-fail validator list

- `validate:structure`
- `validate:brand`
- `validate:daily-static`
- `validate:whitelabel-video`
- `validate:v5-access-security`
- `validate:v5-route-authorization`
- `validate:v5-no-secrets`
- `validate:v5-event-config-schema`
- `validate:v5-publishing`
- `smoke:post-deploy` critical route subset

## V5 strong-warning validator list

- `validate:v5-ux-states`
- `validate:v5-analytics-coverage`
- `validate:v5-testing-console-coverage`
- `validate:v5-docs-code-consistency`
- `validate:v5-comms-coverage`

## V5 warning list

- accessibility labels
- visual polish
- copy consistency
- duplicate docs
- future import support

## Completion bar

V5 can be delivered as structurally checked only if all hard-fail validators pass inside the container. If `npm ci`, typecheck, or full app validation cannot run in the container, final status must remain `STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED`.
