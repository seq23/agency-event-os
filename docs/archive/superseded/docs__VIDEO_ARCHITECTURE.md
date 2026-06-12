<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# Video Architecture

## Current State

Video is intentionally seededed.

## Provider Abstraction

The schema and types include:

- `VideoRoom`
- `VideoRoomType`
- `VideoRoomStatus`
- `provider`
- `providerRoomId`

## Supported Providers

- LiveKit
- Daily
- Agora
- Mux
- Twilio
- Other

## Rule

Do not hard-code provider-specific behavior directly into UI components.

## Daily Automatic Fallback Layer

Fallback order is now `LiveKit → Daily → Zoom → Google Meet`. Daily is the first automatic in-platform backup and does not require producer permission when `DAILY_FALLBACK_ENABLED=true`. Zoom and Google Meet remain managed emergency fallbacks after Daily.

Required backend-only environment/secrets:

```txt
DAILY_API_KEY=
DAILY_API_BASE_URL=https://api.daily.co/v1
DAILY_DOMAIN=westpeeklive.daily.co
DAILY_FALLBACK_ENABLED=true
```

Operational rules:

- Never expose `DAILY_API_KEY` in browser code.
- Daily room creation and meeting-token generation run server-side only.
- If `DAILY_FALLBACK_ENABLED=false`, the resolver skips Daily and falls through to Zoom, then Google Meet.
- Testing Console must show LiveKit, Daily, Zoom, Google Meet, Resend, Supabase, route, OpenNext, and browser-console smoke status before production events.

