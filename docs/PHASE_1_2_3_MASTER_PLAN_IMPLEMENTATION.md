# Phase 1–3 Implementation Notes

This repo pass implements the pasted roadmap as code, docs, validators, and E2E coverage targets.

## Phase 1 — Attendees

- registration now requires name, email, company/affiliation, and title/role
- registration creates/updates an event-scoped attendee profile
- registration creates an attendee session cookie
- registration persists optional agenda intent
- chat and attendee live controls derive identity from attendee session instead of demo placeholders
- My Agenda and attendee profile panels surface event-scoped attendee state
- Supabase migration `0022_attendee_identity_and_agenda_intents.sql` adds profiles, sessions, agenda intents, and sponsor lead opt-ins

## Phase 2 — Validation Complexity

- validation policy and proof matrix docs added
- static validators added for attendee registration, CTA promises, outcome E2E, and proof matrix
- warning lane added as `audit:warnings`
- package scripts updated with explicit outcome E2E lanes
- LiveKit webhook base64 decode no longer uses Node Buffer
- stage stream key generation no longer imports Node `crypto`

## Phase 3 — Outcome E2E

- persona route outcome map added
- CTA promise registry added
- Playwright helper files added
- outcome suites added for persona promises, attendee registration, attendee identity, access boundaries, stream failover, attendee live participation, and deployed outcome smoke

## Proof limit

This pass is structurally checked in-chat. Full local validation still belongs to the local updater workflow.
