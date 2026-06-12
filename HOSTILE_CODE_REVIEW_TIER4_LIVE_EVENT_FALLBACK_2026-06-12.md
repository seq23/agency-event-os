# Hostile Code Review — Tier 4 Live Event Fallback Runtime

Date: 2026-06-12  
Repo: agency-event-os  
Scope: app runtime fallback ladder, owner/showrunner/crew controls, attendee masking, provider proof limits, and Tier 4 validation contracts.

## Verdict

PATCH REQUIRED AND APPLIED.

The previous Tier 4 provider proof was stronger than the earlier version, but the app runtime still had mismatches against real show-day behavior:

1. StreamYard feed loss moved directly toward Daily instead of the new Cloudflare Stream rung.
2. The attendee stage displayed provider/source/status details that should be backend-only.
3. Owner/showrunner/crew had limited ladder controls and no compact stage-stream event log inside the fallback console.
4. Rollback/move-back-up controls were not explicit across the ladder.
5. The static validation contract did not force the live app runtime to match the Tier 4 provider ladder.

## Show-day ladder order

Required order:

1. StreamYard-compatible RTMP source into LiveKit primary stage delivery.
2. LiveKit + Cloudflare Stream Live fallback.
3. Daily embedded fallback.
4. Zoom embedded/manual escalation.
5. Google Meet final continuity fallback.

Applied runtime signals now support:

- `ingress_ended` → Cloudflare Stream when the show had already started.
- `cloudflare_stream_failed` → Daily.
- `daily_failed` → Zoom.
- `zoom_failed` → Google Meet.
- manual move-down controls for Cloudflare Stream, Daily, Zoom, and Google Meet.
- move-back-up controls to LiveKit/StreamYard, Cloudflare Stream, and Daily.

## Attendee-visible provider leakage

Finding: attendee UI previously displayed active provider/source/status language.

Applied changes:

- Main stage copy no longer prints active provider names.
- fallback banner no longer prints provider ids except Google Meet final-room instruction semantics.
- StagePlayer now gives attendees generic branded-stage language through Zoom.
- backend roles still see actual provider source/status.

Residual limit: client-side JavaScript can never be treated as a secrecy boundary. This patch removes provider churn from normal attendee UI, not from source-code inspection.

## Owner / showrunner / crew notification and logs

Applied changes:

- StreamYardIngressPanel is now the backend showrunner fallback console.
- It displays the active rung, failure plane, last webhook, recommendation, and event log.
- It includes explicit move-down and move-back-up controls.
- stage-stream runtime events are appended through `applyStageStreamSignal` and surfaced in the backend panel.

## Move back up the ladder

Applied rollback signals:

- `operator_rollback_to_livekit`
- `operator_rollback_to_cloudflare_stream`
- `operator_rollback_to_daily`

These restore the active backend stage source after owner/showrunner/crew confirm the upstream provider has recovered.

## Remaining proof limit

StreamYard API automation is not claimed because StreamYard API access is enterprise-only. The automated primary proof remains the valid substitute: controlled RTMP into the same LiveKit ingress path that StreamYard Custom RTMP uses.

Cloudflare Stream, Daily, Zoom, and Google Meet must still pass real Tier 4 provider checks with real local/Cloudflare env. Static validators prove the contract and runtime code paths; they do not replace live provider credentials or live provider availability.

## Validation added

Added `validate:tier4-live-event-fallback-runtime` to hard-check:

- runtime ladder order,
- Cloudflare Stream rung before Daily,
- attendee provider masking,
- owner/showrunner/crew control labels,
- event log presence,
- rollback controls,
- unit test coverage markers,
- hostile review documentation.
