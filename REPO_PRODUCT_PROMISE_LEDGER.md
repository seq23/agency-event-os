# Product Promise Ledger — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

This ledger prevents the event platform from hiding behind route-level proof.

| Promise | Required behavior | Required proof | Completion impact |
|---|---|---|---|
| New event lifecycle | Operator creates a brand-new event, gets a unique slug/id, and public/role surfaces reference that event. | Local Master Gauntlet plus persistence/readback. | COMPLETE blocked if seeded demo only. |
| Attendee journey | Attendee can discover/register/enter event with safe invalid/duplicate handling. | Playwright outcome lane and postdeploy critical lane. | COMPLETE blocked if absent. |
| Speaker journey | Speaker enters the correct event-scoped green room/stage flow only. | Role-boundary E2E. | COMPLETE blocked if absent. |
| Sponsor journey | Sponsor enters sponsor-scoped surface only. | Role-boundary E2E. | COMPLETE blocked if absent. |
| Crew/operator/owner boundaries | Elevated surfaces require correct access; forbidden roles fail safely. | Auth/permission unit tests + Playwright negative lanes. | COMPLETE blocked if absent. |
| StreamYard producer source | StreamYard is the producer studio/source and receives generated RTMP URL/stream key. | Static contract + local UI proof + real provider smoke or UNPROVEN. | Production live-media readiness blocked until real provider smoke PASS. |
| LiveKit distribution/ingress | LiveKit creates ingress and distributes attendee media state. | Static contract + simulated webhook + real CreateIngress/webhook/browser proof or UNPROVEN. | Production live-media readiness blocked until PASS. |
| Daily fallback | Daily fallback is truthful, separate from StreamYard feed and LiveKit distribution failure planes. | Mock state probe + local/postdeploy fallback tests. | COMPLETE blocked if absent. |
| Provider failure honesty | Missing env/provider failures produce branded, safe states; no fake success. | Provider safe-failure tests and postdeploy video provider audit. | COMPLETE blocked if absent. |
