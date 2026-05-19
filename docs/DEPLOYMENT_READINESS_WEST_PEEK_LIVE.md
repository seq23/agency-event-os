# West Peek Live! Deployment Readiness

## Status

Required before public deployment.

## Deployment gates

- White-label fallback video gate is complete.
- `npm run validate:whitelabel-video` passes.
- Zoom embedded fallback env vars are configured if enabled.
- Google Meet is treated only as a managed emergency alternate room unless later approved.


- `npm run validate` passes locally.
- `npm run validate:brand` is included in default validation.
- Supabase migrations `0001` through `0017` are applied.
- Supabase RLS review is complete.
- LiveKit env vars are present.
- Resend env vars are present.
- Email domain `events.westpeek.live` is verified in Resend.
- `hello@westpeek.live` forwarding is confirmed.
- Mobile/tablet QA is complete.
- Post-deployment smoke test plan is ready.

## Required services

### Supabase

Used for persistence, event records, production workflow data, venue data, email logs, reports, replay metadata, and operational records.

### LiveKit

Primary live video provider.

Zoom and Google Meet are backup room links only. They are not the core event engine.

### Resend

Production email provider.

Configured sender:

- `Scooter (CEO of West Peek) <notifications@events.westpeek.live>`

Configured reply-to:

- `hello@westpeek.live`

## Do not deploy if

- validation fails
- Supabase migration state is incomplete
- env vars are missing from deployment provider
- email sending has not been smoke-tested
- venue navigation is broken on mobile
- stale deprecated product-name text appears
- RLS review has not been performed

## Canonical Deployment Authority

- GitHub repo: `agency-event-os`
- Framework: `Next.js`
- Adapter: `OpenNext for Cloudflare`
- Host: `Cloudflare Workers / Cloudflare platform`
- App domain: `westpeek.live`
- Email sending domain: `events.westpeek.live`
- Outbound sender: `notifications@events.westpeek.live`
- Reply-to: `hello@westpeek.live`

### Domain Separation Rule

`westpeek.live` is the West Peek Live! app and public product domain.

`events.westpeek.live` is reserved for Resend email sending infrastructure only.

Do not deploy the app to `events.westpeek.live` unless this deployment authority document is explicitly changed.

