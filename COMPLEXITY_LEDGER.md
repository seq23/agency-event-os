# Complexity Ledger — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

Complexity: Level 6-leaning Level 5.

Why: multi-role event platform with auth/access boundaries, event-scoped data, provider-backed live media, fallback paths, production deployment, and trust-sensitive client event delivery.

Required proof burden:

1. Static contract proof for env, no secrets, deployment parity, route/access model, video provider model.
2. Unit/integration proof for permissions, runtime state, provider state transitions, fallback decisions.
3. Local Master Gauntlet for new-event lifecycle, personas, role boundaries, persistence/readback, refresh/re-entry, invalid/duplicate paths.
4. Cloudflare/OpenNext build proof.
5. Postdeploy smoke/E2E against deployed URL.
6. Real StreamYard Custom RTMP to LiveKit proof, or explicit `STREAMYARD → LIVEKIT REAL MEDIA FLOW: UNPROVEN`.

Highest allowed status without real StreamYard/LiveKit provider smoke: not production live-media ready.
