# E2E Outcome Testing Standard

Surface E2E is not enough. Transactional E2E is not enough. Outcome E2E is the layer that catches technically safe but human-hostile behavior.

## Required proof stack

- Surface: route loads, no crash, safe redirect.
- Transactional: click, submit, cookie, runtime write, redirect, state change.
- Outcome: persona sees the promised destination, expected auth disclosure, and no surprise admin/workspace trap.

## Outcome failure examples

- A public CTA routes into `/app` without saying workspace/login/admin.
- A registered attendee can plan a restricted session and then enter it as if planning were permission.
- A crew link implies operator authority.
- A fallback route exposes a reusable private Daily URL.
- Early main stage shows black/error instead of a branded pre-stream card.

## Required artifacts

- `data/testing/cta-promise-registry.json`
- `data/testing/persona-route-outcomes.json`
- `tests/e2e/helpers/persona.ts`
- `tests/e2e/helpers/outcomeAssertions.ts`
- outcome suites for public CTAs, attendee registration, access boundaries, failover, attendee live participation, and deployed smoke.
