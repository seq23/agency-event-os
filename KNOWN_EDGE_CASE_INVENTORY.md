# Known Edge Case Inventory — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

## Access/session

| Edge case | Required behavior | E2E location |
|---|---|---|
| Invalid special guest code | Safe denial, no crash, no fallback into wrong role. | `master-contract-edge-cases.spec.ts` |
| Invalid event code | Safe denial with useful correction. | `master-contract-edge-cases.spec.ts` |
| Expired role cookie | Redirect/deny safely. | `master-contract-edge-cases.spec.ts` |
| Revoked/garbage role cookie | Redirect/deny safely. | `master-contract-edge-cases.spec.ts` |
| Cross-role portal attempt | Deny route or show gate. | `day1-showtime-master-gauntlet.spec.ts`, `master-contract-edge-cases.spec.ts` |

## Event lifecycle/state

| Edge case | Required behavior | E2E location |
|---|---|---|
| Duplicate attendee registration | Update existing or clearly report duplicate behavior; no duplicate-stale ambiguity. | `master-contract-edge-cases.spec.ts` |
| Two created events | Data/codes/routes cannot leak between event A and event B. | `cross-event-scope-isolation.spec.ts` |
| Refresh/re-entry | State remains usable after reload. | `day1-showtime-master-gauntlet.spec.ts`, `cross-event-scope-isolation.spec.ts` |

## Provider/media

| Edge case | Required behavior | E2E location |
|---|---|---|
| Unsigned LiveKit webhook | 401 closed failure. | `provider-webhook-security.spec.ts` |
| Invalid signature | 401 closed failure. | `provider-webhook-security.spec.ts` |
| Malformed signed JSON | 400 controlled failure. | `provider-webhook-security.spec.ts` |
| Unknown LiveKit event | 200 ignored; no unsafe state transition. | `provider-webhook-security.spec.ts` |
| StreamYard feed ends after live | `STREAMYARD_FEED` failure plane. | `day1-showtime-master-gauntlet.spec.ts` |
| LiveKit distribution failure | `LIVEKIT_DISTRIBUTION` failure plane. | `day1-showtime-master-gauntlet.spec.ts` |
| Real StreamYard/LiveKit media | Requires live provider proof. | `real-streamyard-livekit-media.spec.ts` |

## Mobile

| Edge case | Required behavior | E2E location |
|---|---|---|
| Public front door mobile | Primary CTA reachable. | `mobile-critical-journeys.spec.ts` |
| Registration mobile | Form fields usable. | `mobile-critical-journeys.spec.ts` |
| Venue mobile | Lobby/stage/help usable. | `mobile-critical-journeys.spec.ts` |
| Operator mobile emergency access | Launchpad/testing console usable enough for show-day check. | `mobile-critical-journeys.spec.ts` |
