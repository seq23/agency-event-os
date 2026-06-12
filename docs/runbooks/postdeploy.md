# Postdeploy Runbook — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

## Safe postdeploy smoke

```bash
POSTDEPLOY_BASE_URL="https://westpeek.live" npm run postdeploy:full
```

This proves deployed routes, role-flow smoke, click audit, video provider safe failure, and browser smoke as configured.

## Real StreamYard → LiveKit proof

Required command:

```bash
STREAMYARD_REAL_PROVIDER_SMOKE=1 POSTDEPLOY_BASE_URL="https://westpeek.live" npm run smoke:streamyard-livekit:real
# Before running, export LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_WEBHOOK_SECRET, and V5_ACCESS_COOKIE_SECRET from the secure vault.
```

Required evidence:

1. Operator generates LiveKit ingress credentials.
2. StreamYard Custom RTMP receives generated RTMP URL and stream key.
3. Private test broadcast starts.
4. App receives LiveKit ingress started/webhook state.
5. App state becomes `LIVEKIT_INGRESS_LIVE`.
6. Attendee-facing stage shows correct live/fallback state.
7. Stopping feed produces `STREAMYARD_FEED` fallback behavior.
8. LiveKit distribution failure produces `LIVEKIT_DISTRIBUTION` fallback behavior.

Until this lane passes, the only honest status is:

`STREAMYARD → LIVEKIT REAL MEDIA FLOW: UNPROVEN`.
