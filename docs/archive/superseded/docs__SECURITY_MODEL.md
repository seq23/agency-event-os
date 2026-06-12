<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Security Model

## Current State

This baseline is a seeded-data shell. It does not include production authentication, authorization middleware, Supabase RLS, or real secrets.

## Security Principles

1. All permission checks centralize through `can(user, action, resource)`.
2. Client users receive client-facing resources only.
3. Contractors and vendors receive assigned work only.
4. Speakers receive own speaker records only.
5. Sponsors receive own booth/leads/reporting only.
6. Attendees receive venue-facing content only.
7. Production command center is restricted to agency-side production roles.
8. Internal notes, rates, vendor costs, and agency margin are never exposed to external views.

## Future Implementation

- Supabase Auth
- Supabase Row Level Security
- Server-side route protection
- Storage policies
- Video token generation server-side only
- Audit log persistence


## Batch 3A Auth Boundary

Supabase Auth is now the session source. The app stores a server-readable HTTP-only session cookie after login/callback and normalizes profile + role records into `PermissionUser`. Middleware protects signed-in route families, while `requireUser` and `requirePermission` remain the server-side enforcement points.

## Master Plan v4

V4 security: no raw secrets in repo, signed httpOnly cookies, generic failure messages, route guards, audit attempts, PR-only publishing boundary, secret scanners.


## V5 access correction
Access cookies use HMAC SHA-256, are httpOnly, sameSite=lax, secure in production, and are checked by role + event scoped middleware. Raw role codes are environment values only. Access attempts must be audited without logging raw submitted codes.
