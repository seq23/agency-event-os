# Provider Proof Matrix — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

| Provider lane | Current/required proof | Honest status if not run |
|---|---|---|
| StreamYard model/copy contract | `npm run validate:day1-streamyard-model` | PARTIAL |
| LiveKit ingress contract | `npm run validate:streamyard-ingress` | PARTIAL |
| StreamYard/LiveKit/Daily fallback state model | `npm run probe:streamyard-livekit:mock` | PARTIAL |
| Operator-only RTMP/stream key controls | Local Playwright showtime gauntlet | PARTIAL if passed |
| Public routes do not expose stream key | Local Playwright/static contract | PARTIAL if passed |
| Signed LiveKit webhook state transition | Simulated Playwright/API lane | PARTIAL if passed |
| Deployed video surfaces fail safely | `npm run postdeploy:video-provider` | UNPROVEN if not run |
| Real StreamYard Custom RTMP to LiveKit ingress | `npm run smoke:streamyard-livekit:real` with operator-confirmed private broadcast | UNPROVEN if not run |
| Attendee sees real LiveKit media/fallback state | Real provider smoke + postdeploy browser proof | UNPROVEN if not run |
