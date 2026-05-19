# West Peek Live!

West Peek Live! is a multi-client virtual event production platform for agencies.

It combines:

1. A Hopin-style virtual event venue.
2. An agency production operating system for client events.

## Current Baseline

This starter baseline includes:

- Product documentation
- Next.js App Router-style route structure
- TypeScript domain types
- Centralized permission helper
- Readiness scoring helper
- WPP-style seeded data
- Agency dashboard
- Client and event management
- Run-of-show and task planning
- Contractor/vendor/speaker/sponsor shells
- Client portal
- Production command center
- Public event pages
- Attendee venue shell
- Analytics and reporting shell
- Test scaffolding
- Vitest alias configuration
- Auth shell pages
- Technical debt register

## Planned Post-MVP Scope

- Production auth
- Supabase persistence
- RLS
- Real video provider integration
- Payments
- Email notifications
- File uploads
- Real chat persistence
- Real analytics ingestion
- Report export

## Validation Status

STRUCTURALLY CHECKED — LOCAL VALIDATION REQUIRED

Full npm validation has not been run in this environment.


## Backend Foundation Added

This baseline now includes Supabase/Auth/Resend foundation scaffolding:

- Environment validation
- Supabase browser/server/admin clients
- Seeded-backed auth helpers
- Permission-required helper
- Resend-compatible email provider abstraction
- Seeded email provider
- Audit log service abstraction
- Initial SQL migration draft
- Seed SQL draft
- Backend setup docs
- Unit tests for env/email/audit helpers

## Remaining Post-MVP Scope

- Live Supabase CRUD wiring
- Supabase Auth session resolution
- RLS policy implementation
- Real email sending in app flows
- Production deployment

## Master Plan v4

V4 product model: Public Experience Plane, Access Plane, Event Operations Plane, Governance + Deployment Plane.

## V6 End-to-End Operationalization

This baseline includes the V6 operational layer for Master Plan v4/v5 completion:

- named setup subroutes under `/app/events/[eventId]` for branding, attendee flow, venue, agenda, access, communications, and preview
- repo-config-driven event code resolution
- HMAC signed production access cookies
- role/event-scoped special guest access
- crew action capability helpers
- config package builder/importer and PR-only publishing workflow
- runtime persistence for access, audit, analytics, fallback, support, email, registrations, incidents, and run-of-show events
- room-level video fallback controls with rollback
- operational communications dashboard with honest Resend availability
- runtime-backed analytics dashboard
- v6 completion/audit validators

Run fast structural checks with:

```bash
npm run validate:v5-hard
npm run validate:v6-audit
```

Full validation remains local-updater owned unless dependencies are installed and `npm run validate` passes in the execution environment.
