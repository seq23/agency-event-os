# Auth Implementation

## Current Status

Auth is scaffolded but mock-backed.

Current files:

- `lib/auth/getCurrentUser.ts`
- `lib/auth/requireUser.ts`
- `lib/auth/requirePermission.ts`
- `lib/auth/authTypes.ts`

## Current Behavior

`getCurrentUser()` returns the mock agency owner.

## Future Supabase Behavior

1. Read Supabase session.
2. Resolve profile.
3. Resolve agency/client/event role assignments.
4. Normalize into `PermissionUser`.
5. Use `can(user, action, resource)` for route/server action protection.

## Guardrail

Do not scatter role checks across components. Use centralized permission helpers.
