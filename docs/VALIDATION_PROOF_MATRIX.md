# Validation Proof Matrix

| Check | Layer | Fail mode | Proves | Does not prove | Risk protected |
|---|---|---|---|---|---|
| validate_attendee_registration_contract.js | Static contract | Hard fail | Registration/session/agenda files and forbidden demo identity strings exist/are absent | Runtime form submission or cookie behavior | Attendee identity and access boundaries |
| validate_cta_promise_registry_contract.js | Static contract | Hard fail | CTA promise registry exists and public CTAs avoid surprise admin/app routes | Browser navigation | Public UX and auth disclosure |
| validate_e2e_outcome_contract.js | Static contract | Hard fail | Outcome E2E docs, registry, helpers, and suites exist | E2E pass/fail | Outcome testing coverage |
| validate_validation_proof_matrix_contract.js | Static contract | Hard fail | Validation policy and proof matrix state proof limits | Validator correctness | Validator theater prevention |
| tests/unit/attendeeRegistrationRules.test.ts | Unit | Hard fail | Registration required-field and duplicate rules | Browser cookie creation | Data integrity |
| tests/unit/attendeeSessionRules.test.ts | Unit | Hard fail | Session shape and expiry intent | Browser persistence | Access boundary |
| tests/unit/attendeeAgendaIntent.test.ts | Unit | Hard fail | Agenda intent is planning only | VIP enforcement | Restricted access separation |
| tests/e2e/persona-outcome-promises.spec.ts | Outcome E2E | Hard fail | CTA promise/outcome alignment in browser | All backend writes | Public route safety |
| tests/e2e/attendee-registration-outcome.spec.ts | Transactional + outcome E2E | Hard fail | Required fields, optional planning, cookie/session redirect | Deployed CDN behavior | Attendee identity spine |
| tests/e2e/stream-failover-outcomes.spec.ts | Outcome E2E | Hard fail | Pre-stream/fallback/switching promises in UI | Actual provider uptime | Video fail-safe UX |


Static contract rows explicitly list what each check does not prove; static contracts do not prove runtime behavior.
