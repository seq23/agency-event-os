# West Peek Live! Post-Deployment Smoke Test

## Build/load

- Deployed URL loads.
- No server error on home page.
- App metadata shows West Peek Live!.
- Public brand uses black/white/orange styling.
- Wordmark shows orange skewed `Live!`.

## App routes

Check:

- `/`
- `/app`
- `/app/clients`
- `/app/events`
- `/app/email`
- `/app/reports`
- `/admin/testing`

## Venue routes

Check with a known test event id:

- `/venue/<eventId>/lobby`
- `/venue/<eventId>/stage`
- `/venue/<eventId>/sessions`
- `/venue/<eventId>/breakouts`
- `/venue/<eventId>/expo`
- `/venue/<eventId>/networking`
- `/venue/<eventId>/people`
- `/venue/<eventId>/replay`
- `/venue/<eventId>/help`

## Supabase

- Create/read a client.
- Create/read an event.
- Confirm no browser console exposes service-role data.
- Confirm email log tables exist.

## LiveKit

- Token route responds.
- Room join state renders.
- Disconnect/fallback state is understandable.
- Backup room links remain secondary.

## Resend

- Send one safe test email.
- Confirm sender domain is `events.westpeek.live`.
- Confirm reply-to is `hello@westpeek.live`.
- Confirm email log/status behavior.

## Mobile/tablet

Check at:

- 375px
- 390px
- 430px
- 768px
- 1024px

Confirm:

- no trapped navigation
- venue nav scrolls horizontally where needed
- forms are tappable
- cards stack cleanly
- primary live-event actions remain visible
