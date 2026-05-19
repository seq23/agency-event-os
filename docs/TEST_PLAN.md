# Test Plan

## Current Baseline Tests

- `tests/unit/permissions.test.ts`
- `tests/unit/seededData.test.ts`
- `tests/unit/readiness.test.ts`

## Required Future Tests

1. Permission helper role/scope matrix.
2. Client/internal visibility separation.
3. Contractor assigned-only access.
4. Sponsor own-booth/lead access.
5. Speaker own-profile access.
6. Readiness category calculations.
7. Seeded data relationship integrity.
8. Route smoke tests for all main route groups.
9. Client portal no-internal-field rendering tests.
10. Production command center restricted-access tests.

## Validation Command

```txt
npm run validate
```

## Current Status

Full local validation has not been run in this environment.
