# Live Provider Evidence Template — agency-event-os

Status: ACTIVE
Date: 2026-06-12

## Purpose

This file defines the human/operator evidence required when a provider action cannot be fully automated from source alone.

For normal postdeploy safe-failure proof, use Tier 3.
For real StreamYard/LiveKit production-event proof, use Tier 4 and `TIER4_PROVIDER_EVIDENCE_TEMPLATE.json`.

## Tier 4 StreamYard/LiveKit evidence fields

Required JSON path:

`TIER4_STREAMYARD_LIVE_EVIDENCE_PATH=reports/tier4/streamyard-livekit-evidence.json`

Required fields:

- providerLane = `streamyard-livekit`
- deployedBaseUrl
- eventId
- stageId
- operatorConfirmedBroadcast = true
- streamyardBroadcastStartedAt
- streamyardBroadcastEndedAt when available
- livekitIngressIdRedacted
- livekitRoomNameRedacted
- appReportedStates
- operatorEvidenceFiles
- attendeeEvidenceFiles
- secretsExposed = false
- cleanupStatus
- notes

Forbidden evidence content:

- raw RTMP stream keys
- full RTMP/RTMPS URLs
- provider API keys
- Supabase service-role keys
- bearer tokens
- cookies
- webhook secrets
- OAuth secrets

## Status labels

- `TIER 4 PASSED — REAL LIVE PROVIDER OPERATIONAL PROOF`
- `BLOCKED — TIER 4 LIVE PROVIDER EVIDENCE REQUIRED`
- `PARTIAL — DEPLOYED SAFE PROOF ONLY`
