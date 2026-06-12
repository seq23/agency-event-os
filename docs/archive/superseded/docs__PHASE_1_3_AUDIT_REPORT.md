<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Phase 1–3 Roadmap Audit Report

Status: STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED
Base audited: `agency-event-os-main_BASELINE_05-20-26_1341c4c.zip`
Roadmap source: pasted Phase 1–3 master plan for Hopin clone / Agency Event OS.

## Audit result

The Phase 1–3 roadmap is now represented structurally in the repo.

## Issues found during hostile audit and fixed

1. `lib/actions/attendeeAgendaActions.ts` was missing from the roadmap file map.
   - Fixed by adding an event-scoped My Agenda update action.
2. My Agenda was display-only.
   - Fixed by adding editable session, breakout, sponsor booth, and reminder controls.
3. Attendee profile panel was display-only.
   - Fixed by adding event-scoped profile editing for name, company, title, links, topics, networking goals, and networking opt-in.
4. Networking queue still used local E2E fake identity defaults.
   - Fixed by requiring real attendee session identity for queue joins.
5. Help requests did not bind to attendee identity.
   - Fixed by attaching attendeeId/displayName metadata when a registered attendee submits support.
6. Sponsor lead capture still collected a raw email instead of using intentional attendee-profile opt-in.
   - Fixed by requiring attendee session identity and recording `sponsorLeadOptIns` with allowed fields.
7. People directory did not merge runtime attendee profiles.
   - Fixed by loading active runtime attendee profiles and merging opt-in attendees into the directory.
8. Daily fallback token routes trusted attendee-supplied display/profile values.
   - Fixed by deriving attendee displayName/profileId from the attendee session for attendee video tokens.
9. E2E outcome suite existed but was too shallow against the roadmap acceptance bullets.
   - Fixed by expanding static coverage for required fields, cookies, My Agenda, chat/breakout/networking/help/people identity surfaces, access boundaries, stream failover language, publish/revoke behavior, and CTA/persona promise coverage.
10. Static attendee contract validator was too permissive.
    - Fixed by requiring agenda/profile edit actions, networking identity, help identity, sponsor opt-in, and fake-identity removal.

## Phase 1 coverage

- Registration requires name, email, company/affiliation, and title/role.
- Optional profile enrichment is present.
- Optional agenda planning is present and editable later.
- Registration creates attendee profile, session cookie/token, agenda intent, registration event, and analytics event.
- Chat uses attendee session identity.
- Stage/breakout live requests use attendee session identity.
- Networking queue uses attendee session identity.
- Help requests use attendee session identity when available.
- Sponsor leads require intentional attendee opt-in and are not broadcast globally.
- People directory includes runtime attendee profiles when networking opt-in is enabled.

## Phase 2 coverage

- Validation proof matrix exists.
- Validation complexity policy exists.
- New static contract validators exist.
- Warning lane exists via `audit:warnings`.
- Static validators declare proof limits and do not claim runtime readiness.
- Node crypto is removed from the specific public-sensitive webhook/stage stream files called out in the roadmap.

## Phase 3 coverage

- Outcome E2E docs exist.
- Persona route map exists.
- CTA promise registry exists.
- Persona/outcome helpers exist.
- Outcome suites exist for CTA promises, registration, venue identity, access boundaries, stream failover, attendee live participation, and deployed smoke.
- Runtime trace helper includes attendee profiles, sessions, agenda intents, support requests, sponsor leads, chat, stage stream states, attendee live permissions, and audit events.

## Static checks run in this audit

- `node scripts/validate_attendee_registration_contract.js`
- `node scripts/validate_cta_promise_registry_contract.js`
- `node scripts/validate_e2e_outcome_contract.js`
- `node scripts/validate_validation_proof_matrix_contract.js`
- `node scripts/validate_v7_day1_packet.js`
- `node scripts/validate_no_node_crypto_on_public_runtime.js`
- Existing video/chat/access contract validators were also rerun.

## Not run here

Full dependency install, typecheck, build, Playwright, and Cloudflare/OpenNext validation were not run in this environment. Local updater validation remains the enforcement gate.
