# User Journey Test Matrix — agency-event-os

Status: ACTIVE
Date: 2026-06-11

Every meaningful user action must map to local proof, deployed proof, and provider proof where applicable.

| Persona | Action | Expected state change / outcome | Tier 1 source proof | Tier 2 local/browser proof | Tier 3 deployed/provider proof | Negative/edge path | Status |
|---|---|---|---|---|---|---|---|
| Owner/Admin | Create new event and command center | new entity id/slug created; command links remain scoped; no seeded demo fallback | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |
| Client | Access client portal and event dashboard | client role sees only allowed event-scoped data | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |
| Speaker/Sponsor/VIP/Crew | Enter assigned portal | role-specific access succeeds; forbidden cross-role paths fail | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |
| Attendee/Public | Register and enter public/attendee flow | registration persists and role boundaries hold after refresh/re-entry | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |
| Operator | Run stage/provider/fallback controls | provider status and live controls reflect real or controlled-unavailable provider state | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |
| Operator | Postdeploy critical role/provider gauntlet | deployed explicit URL passes role/provider E2E; no localhost smoke. | matrix/docs/validators | headed/self-spawn/browser path | deployed + provider evidence/readback | invalid/duplicate/unauthorized/provider-unavailable path required | REQUIRED |

## Rule

Seeded/demo fixtures may support fast smoke tests but cannot replace newly-created/entity-scoped or provider-backed Tier 3 proof.
