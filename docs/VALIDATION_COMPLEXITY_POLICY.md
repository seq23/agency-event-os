# Validation Complexity Policy

Validation protects production risk. It is not theater.

## Proof layers

1. Static contract validators prove files, routes, forbidden imports, env parity, registry presence, and secret exposure boundaries.
2. Unit tests prove pure rules and decision functions.
3. Integration tests prove persistence, actions, cookies, and webhook state transitions.
4. Transactional E2E proves forms, redirects, runtime writes, cookies, and access-safe failures.
5. Outcome E2E proves persona-correct results: the UI promise matches the route, auth expectation, access boundary, and human job-to-be-done.

## Hard-fail categories

Hard-fail only for security, privacy, money, data integrity, deployment contracts, access boundaries, secret exposure, provider fail-safe behavior, and critical public UX.

## Diagnostic categories

Copy polish, optional helper text, layout polish, non-critical docs drift, and roadmap wording are diagnostic-only. They must never block deploy unless they create user surprise, security confusion, or access ambiguity.

## Non-overclaiming rule

Every static contract validator must state what it proves and what it does not prove. Static validators do not prove browser behavior, persistence writes, cookie issuance, or deployed route behavior. Those require tests.
