# Daily Automatic Fallback

West Peek Live! uses this video fallback order:

```txt
LiveKit → Daily → Zoom → Google Meet
```

Daily is the first automatic backup provider. It is not treated as an emergency manual room and it does not require producer permission when the backend toggle is enabled.

## Backend setting

```txt
DAILY_FALLBACK_ENABLED=true
```

When enabled, LiveKit setup failures can fall through to Daily automatically. When disabled, the resolver skips Daily and falls through to Zoom, then Google Meet.

## Required server-side secrets

```txt
DAILY_API_KEY=
DAILY_API_BASE_URL=https://api.daily.co/v1
DAILY_DOMAIN=westpeeklive.daily.co
DAILY_FALLBACK_ENABLED=true
```

`DAILY_API_KEY` must never be shipped to the browser. Room creation and meeting token creation run server-side only.

## Smoke-test expectations

The Testing Console should surface:

- LiveKit token readiness
- Daily automatic fallback readiness
- Zoom signature readiness
- Google Meet managed fallback readiness
- Resend send readiness
- Supabase write/read readiness
- Cloudflare/OpenNext route readiness
- Browser console scan readiness

## Operator rule

Daily is in-platform backup. Do not label it as a panic fallback to attendees. Zoom and Google Meet remain later-stage managed fallback options.
