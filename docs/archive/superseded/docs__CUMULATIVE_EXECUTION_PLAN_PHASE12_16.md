<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Cumulative Execution Plan — Phase 12 through Phase 16

## Phase 12 — Pre-Venue Completion Hardening

- Dashboard + CRUD usability
- Production workflow UI completion
- Testing console persistence
- LiveKit room UX hardening
- Asset upload/review controls
- Audit and activity feed
- Reports UI completion

## Phase 13 — Virtual Venue Completion

- Shared venue navigation
- Lobby command center
- Main stage experience
- Sessions experience
- Breakout rooms experience
- Expo / sponsor booth experience
- Networking attendee UX
- People directory
- Replay center
- Help center

## Phase 14 — Supabase Query Integration

- Query service wrappers for venue, reports, production state, assets, and replay
- Seeded runtime read models remain a fallback only
- Services accept Supabase clients so route-by-route integration can happen without rewriting UI

## Phase 15 — Live Production Operations

- Start/end session state
- Open/close stage state
- Breakout/networking activation records
- Incident triage model
- Replay/report publish state
- Backup room activation model

## Phase 16 — Recording / Replay / LiveKit Egress

- Recording request model
- LiveKit egress job model
- Recording status transitions
- Replay asset linkage
- Recording failure states
- Replay center integration

## Resend Boundary

Production email sending waits until manual Resend setup is complete.

## V2 Boundary

Billing/Stripe/commercial layer is documented in `docs/V2_BILLING_AND_COMMERCIAL_BACKLOG.md` and is not part of the MVP execution path.
