# Tier 4 Data Trace Review — LiveKit RTMP/Twirp Failure Class

## Purpose

This note locks the Tier 4 validation matrix distinction between:

- **Tier 4 harness/test failures** — the proof runner, local env restore, ffmpeg broadcaster, evidence writer, or test orchestration fails before exercising the deployed app.
- **Real deployed app failures** — the deployed Worker/API route executes and returns an error from app code, runtime API usage, provider integration, persistence, authorization, or fallback handling.

The controlled RTMP proof must trace both. A quiet test harness pass is not enough. A test harness failure is also not automatically an app failure.

## Hostile finding

Two LiveKit Twirp callers existed:

1. `services/video/livekitIngressService.ts` — real deployed app path: `/api/video/livekit-ingress`
2. `scripts/tier4_controlled_rtmp_broadcaster_proof.mjs` — Tier 4 harness/provider observation path

Both can receive `LIVEKIT_URL=wss://...` because the same value is also valid for browser/client LiveKit connections. Server-side Twirp `fetch()` must use the HTTP API base URL instead.

Required normalization:

- `wss://host` → `https://host`
- `ws://host` → `http://host`
- `https://host` remains unchanged

## Contract added

`validate:livekit-twirp-url-contract` now hard-fails if a LiveKit Twirp caller builds `/twirp/livekit...` from a raw LiveKit URL without explicit WebSocket-to-HTTP normalization. It also requires Tier 4 controlled proof reports to include:

- `failureClass`
- `tier4DataTrace` / `trace`
- deployed app ingress request/response phase
- harness LiveKit Twirp request phase

## Resulting validation model

- `npm run validate` catches this URL-normalization class before deploy.
- `npm run postdeploy:full` proves the deployed public/runtime route bundle is still safe.
- `npm run tier4:auto-controlled-livekit-proof` distinguishes harness failures from deployed app failures and preserves the trace in `reports/tier4/tier4-controlled-rtmp-broadcaster-proof.json`.

## Hostile-review conclusion

This patch fixes both the real app LiveKit Twirp path and the Tier 4 harness LiveKit Twirp path. It also changes the harness output so the next Tier 4 result exposes whether the blocker is env/operator gate, test harness, provider, or deployed app behavior.

## Remaining proof boundary

This patch does not claim real Tier 4 pass. It removes a known failure class and improves proof traceability so the next Tier 4 run can expose the next true blocker, whether harness-side or app-side.
