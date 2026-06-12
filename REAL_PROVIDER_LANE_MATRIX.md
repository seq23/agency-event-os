# Real Provider Lane Matrix — agency-event-os

Status: ACTIVE
Date: 2026-06-11

Tier 3 is the final release gate. Every row below must be passed, blocked with owner acceptance, or explicitly ruled not applicable before COMPLETE.

| Provider lane | Provider | Runtime/surface | Env keys / inputs | Tier 3 proof required | Status |
|---|---|---|---|---|---|
| LiveKit | LiveKit | Stage media rooms, ingress/webhook/media state | LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_WEBHOOK_SECRET, LIVEKIT_INGRESS_RTMP_BASE_URL | Real provider room/ingress/webhook lane passes or returns controlled unavailable state; no mock provider in final tier. | REQUIRED FOR TIER 3 |
| StreamYard | StreamYard | Primary operator broadcast source into stage pipeline | STREAMYARD_PRIMARY_ENABLED, STAGE_STREAM_DEFAULT_SOURCE, StreamYard/live provider settings | Real StreamYard to LiveKit smoke proves stream path or marks operator evidence required. | REQUIRED FOR TIER 3 |
| Daily / Zoom fallbacks | Daily / Zoom fallbacks | Fallback stage/meeting providers | DAILY_API_KEY, DAILY_DOMAIN, ZOOM_MEETING_SDK_KEY, ZOOM_MEETING_SDK_SECRET | Fallback routes/tokens fail safely or connect in explicit provider proof mode. | REQUIRED FOR TIER 3 |
| Supabase | Supabase | Production persistence, self-serve events, role state, reports | NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY | Newly-created event lifecycle writes/readbacks real scoped data with no demo leakage. | REQUIRED FOR TIER 3 |
| Email / Resend | Email / Resend | Transactional notifications and event comms | RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO | Email workflow proof sends only approved test messages or records provider proof without leaking PII. | REQUIRED FOR TIER 3 |
| Cloudflare/OpenNext Worker | Cloudflare/OpenNext Worker | Deployed runtime and edge middleware | NEXT_PUBLIC_APP_URL, worker/env secrets | Fresh deploy + explicit postdeploy smoke + role/provider critical E2E pass. | REQUIRED FOR TIER 3 |

## Rule

A mocked/local provider test may support Tier 2 but cannot satisfy this matrix. Tier 3 must run against deployed runtime and live provider evidence or return BLOCKED/UNPROVEN.
