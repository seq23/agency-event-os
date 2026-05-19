# Phase 8B — LiveKit Provider Implementation

## Decision

- Primary video provider: LiveKit
- Secondary candidate: Daily
- White-label backup rooms: Zoom + Google Meet links
- Zoom/Google Meet are not the core event engine

## Env Vars

Required server-side environment variables:

```txt
`LIVEKIT_URL` — set locally; never commit
`LIVEKIT_API_KEY` — set locally; never commit
`LIVEKIT_API_SECRET` — set locally; never commit
```

## What This Phase Adds

- `LiveKitVideoProvider`
- LiveKit token generation using server-side API key and secret
- Optional provider registration when env vars are present
- LiveKit provider readiness hooks
- Runtime DB metadata tables that do not store secrets

## What This Phase Does Not Add

- LiveKit React room UI
- Egress/recording implementation
- Webhook handling
- Production deployment env vars
- Daily provider
- Zoom/Google Meet SDK integration
