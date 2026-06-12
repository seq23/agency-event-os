# Tier 4 Live Provider Operational Proof — agency-event-os

Status: ACTIVE
Date: 2026-06-12

## Purpose

Tier 4 proves the thing Tier 3 must not pretend to prove:

A real deployed production event operation using real credentials, real provider resources, real role boundaries, real persistence, real fallback behavior, and a safe evidence bundle.

## Tier 4 is intentionally expensive

Tier 4 may:

- use real StreamYard, LiveKit, Daily, Zoom, Resend, Supabase, and Cloudflare credentials
- create provider rooms, ingresses, tokens, messages, and persisted records
- require a human operator to start or confirm a private StreamYard broadcast
- require cleanup of provider resources
- produce reports that must be checked for secret leakage

Tier 4 is not a routine postdeploy smoke. It is the final operational proof lane.

## Required evidence packet

The StreamYard/LiveKit lane requires `TIER4_STREAMYARD_LIVE_EVIDENCE_PATH` pointing to JSON with this shape:

```json
{
  "providerLane": "streamyard-livekit",
  "deployedBaseUrl": "https://example.com",
  "eventId": "tier4-2026-06-12-001",
  "stageId": "main-stage",
  "operatorConfirmedBroadcast": true,
  "streamyardBroadcastStartedAt": "2026-06-12T00:00:00.000Z",
  "streamyardBroadcastEndedAt": "2026-06-12T00:10:00.000Z",
  "livekitIngressIdRedacted": "ingress_xxx...redacted",
  "livekitRoomNameRedacted": "tier4-event-main-stage",
  "appReportedStates": ["READY_FOR_STREAMYARD", "LIVEKIT_INGRESS_LIVE", "SWITCHING_TO_DAILY"],
  "operatorEvidenceFiles": ["reports/tier4/operator-streamyard-live.png"],
  "attendeeEvidenceFiles": ["reports/tier4/attendee-stage-live.png"],
  "secretsExposed": false,
  "cleanupStatus": "deleted_or_retained_with_reason",
  "notes": "No raw stream keys, API secrets, bearer tokens, or service role keys are stored here."
}
```

The evidence packet must never include raw RTMP stream keys, API keys, service-role keys, bearer tokens, OAuth secrets, webhook secrets, or cookies.

## Required Tier 4 lanes

The Tier 4 real provider journey probe must run through `npm run tier4:real-provider-journey-probe`. It performs deployed app route/provider checks for role boundaries, LiveKit ingress, Supabase production write/readback, Daily fallback, Zoom authorization-gated signature readiness, and Resend provider email where configured.

Zoom signature route is server-side authorization gated. Unauthenticated/public callers must receive denial before any SDK signature is issued.

Supabase production write/readback is mandatory for Tier 4 COMPLETE. A static env check does not satisfy persistence proof.

Resend sends exactly one approved test email only when `TIER4_RESEND_SEND_APPROVED=1` is set.

1. Real deployed runtime identity
2. Real StreamYard Custom RTMP or controlled broadcaster into LiveKit
3. Real LiveKit ingress/media/webhook state
4. Real Supabase persistence/readback when production store is enabled
5. Real Daily fallback when Daily is enabled
6. Real Zoom signature readiness when Zoom is enabled
7. Real Resend transactional send to approved test recipient when Resend is enabled
8. Role-boundary checks around private/provider surfaces
9. Evidence bundle no-secret scan
10. Cleanup/retention record

## Status rules

- `TIER 4 PASSED — REAL LIVE PROVIDER OPERATIONAL PROOF` only when all required lanes pass.
- `BLOCKED — TIER 4 LIVE PROVIDER EVIDENCE REQUIRED` when credentials/evidence/operator action are missing.
- `PARTIAL — DEPLOYED SAFE PROOF ONLY` when Tier 3 passes but Tier 4 does not run.

## Command

```bash
npm run tier4:live-provider-operational-proof
```

This command writes:

- `reports/tier4/tier4-provider-proof-report.json`
- `reports/tier4/tier4-provider-proof-report.md`
- `reports/tier4/tier4-real-provider-journey-report.json`
- `reports/tier4/tier4-real-provider-journey-report.md`
