# Batch 3A — Supabase Auth + Real Current User

## Purpose

Batch 3A replaces seeded current-user assumptions with real Supabase Auth session awareness.

The app can now:

- log in with Supabase email/password
- sign up through Supabase Auth
- request password reset emails
- store a server-readable HTTP-only auth cookie
- resolve the current Supabase user
- load profile and role-access records
- normalize those records into `PermissionUser`
- protect app/client/crew/speaker/sponsor route families

## Scope Boundary

This batch does not add real CRUD, uploads, Resend invite flows, Stripe, or real video rooms.

## Required Manual Setup

Supabase must have:

- project URL
- anon key
- service role key
- email auth enabled
- Site URL set to `http://localhost:3000`
- redirect URL `http://localhost:3000/**`
- migration + seed already applied

## Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_SESSION_COOKIE_NAME=agency_event_os_session
```

## Access Model

`getCurrentUser()` resolves:

1. server auth cookie
2. Supabase Auth user
3. `profiles`
4. `agency_members`
5. `role_assignments`
6. `client_contacts`
7. contractor/vendor/speaker/sponsor event access

The result is normalized into the existing `PermissionUser` shape used by `can()`.

## Protected Routes

- `/app/*` requires signed-in agency access
- `/client/*` requires signed-in client access
- `/crew/*` requires signed-in crew/contractor access
- `/speaker/*` requires signed-in speaker access
- `/sponsor/*` requires signed-in sponsor access

Middleware enforces presence of a session cookie. Server utilities enforce actual permission resolution.

## Post-MVP Scope

- invite token persistence
- Resend invite/reminder emails
- Supabase Storage
- asset persistence
- approval persistence
- video provider tokens
- Stripe billing
