# Phase 19A — White-Label Fallback Video Gate

## Status

Pre-deployment product trust gate.

## Purpose

West Peek Live! must preserve a unified attendee experience even when the production team moves a room away from the primary LiveKit engine.

The attendee should stay inside West Peek Live! whenever technically possible.

## Provider hierarchy

1. `livekit_native`
   - Primary engine.
   - Default for West Peek Live! rooms.

2. `zoom_embedded`
   - Embedded room path for when LiveKit cannot be used for a specific room.
   - Uses Zoom Meeting SDK authorization generated server-side.
   - Attendee stays inside a West Peek Live! room wrapper.

3. `external_backup_link`
   - Emergency-only alternate room path.
   - Used for Google Meet or manually created provider links.
   - Attendee copy must avoid panic/failure language.

## Why Zoom requires secrets

Zoom embedded rooms require a Meeting SDK JWT generated on the server. The app uses:

```txt
ZOOM_MEETING_SDK_KEY
ZOOM_MEETING_SDK_SECRET
```

The server generates the JWT through:

```txt
POST /api/video/zoom-signature
```

The client receives only the SDK key, JWT signature, meeting number, and role.

## Why Google Meet is not treated the same

Google Meet can be created or managed by API, and can provide entry points back to users from the app. It is not treated here as a fully in-app white-label embedded video provider.

Google Meet remains an emergency managed fallback link unless a later Google Workspace integration phase is explicitly approved.

## Attendee-facing language rules

Allowed:

- West Peek Live! room
- alternate room
- enhanced room
- opening your room
- production team has opened this room

Forbidden:

- LiveKit failed
- Zoom backup
- Google backup
- fallback failed
- emergency failure
- panic language

## Deployment env vars

```txt
ZOOM_MEETING_SDK_KEY=
ZOOM_MEETING_SDK_SECRET=
NEXT_PUBLIC_ENABLE_ZOOM_EMBEDDED_FALLBACK=false
GOOGLE_MEET_MANAGED_FALLBACK_URL=
```

## Smoke test

Before deployment sharing:

1. Confirm app validates with `npm run validate`.
2. Confirm `validate:whitelabel-video` passes.
3. Add Zoom SDK env vars in deployment provider if embedded Zoom is enabled.
4. Open a Zoom embedded room route/component with a known meeting number.
5. Confirm the attendee sees West Peek Live! framing before entering.
6. Confirm the copy does not say failure/fallback/Zoom backup.
7. Confirm Google Meet remains emergency-only unless API integration is later approved.

## Non-goals

This phase does not:

- replace LiveKit
- add billing
- create Google Meet spaces automatically
- create Zoom meetings automatically
- build full Zoom admin automation
- make Google Meet fully embedded

## Daily Automatic Fallback Layer

Fallback order is now `LiveKit + StreamYard → Cloudflare Stream → Daily → Zoom → Google Meet`. Cloudflare Stream is the first automatic in-platform backup after the StreamYard-compatible RTMP primary, and Daily is the next embedded fallback and does not require producer permission when `DAILY_FALLBACK_ENABLED=true`. Zoom and Google Meet remain managed emergency fallbacks after Daily.

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
- Testing Console must show LiveKit + StreamYard, Cloudflare Stream, Daily, Zoom, Google Meet, Resend, Supabase, route, OpenNext, and browser-console smoke status before production events.

