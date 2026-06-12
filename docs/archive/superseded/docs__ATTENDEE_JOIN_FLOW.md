<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Attendee Join Flow

Attendees use event code or public event link only. They must never see production, client, speaker, sponsor, crew, or admin routes.

## Validation

This document is part of Master Plan v4 and is covered by v4 validators and smoke tests.


## Attendee retention policy

Default attendee retention is event-scoped and cost-aware: attendee profiles, registrations, attendance summaries, and sponsor opt-ins are retained for 12 months unless a client policy shortens that window. Raw chat is retained for 90–180 days. Presence, telemetry, access attempts, and short-lived attendee session tokens expire within the live/replay support window or 30–90 days depending on operational need. Raw analytics should be aggregated or anonymized after 90–180 days. All queries must filter by `eventId`, paginate, and select only needed columns.
