<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Phase 17 — Email / Resend Production Sending

## Status

Production email sending is wired for Resend after manual setup.

## Environment

Required local/deployment variables:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`

Current intended identity:

- From: `Scooter (CEO of West Peek) <notifications@events.westpeek.live>`
- Reply-to: `hello@westpeek.live`

## Sending Provider

The production provider uses the Resend HTTP API through server-side `fetch`.

The app does not expose the Resend key to browser code.

## Workflows Covered

- client invite
- speaker invite
- sponsor setup invite
- contractor assignment
- approval request
- changes requested
- tech check reminder
- asset deadline reminder
- show day reminder
- testing failure alert
- report ready

## Logging

Migration `0017_email_production_sending.sql` adds:

- `email_send_logs`
- `email_delivery_attempts`
- `email_workflow_statuses`

## V2 Boundary

Billing/Stripe is still V2 and remains separate from email sending.
