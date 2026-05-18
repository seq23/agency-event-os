# Security Model

## Current State

This baseline is a mock-data shell. It does not include production authentication, authorization middleware, Supabase RLS, or real secrets.

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
