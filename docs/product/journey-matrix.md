# Persona Journey Matrix — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

| Persona | Entry route | Intended outcome | Required state change | Allowed destinations | Forbidden destinations | Proof required |
|---|---|---|---|---|---|---|
| Public visitor | `/` / `/join` | Discover event and enter code/request flow | none or request row | public/event routes | admin/operator/crew/private sponsor/speaker surfaces | surface E2E + postdeploy smoke |
| Operator | `/production-access/operator` / `/start/create-event` | Create/configure event and launch production workspace | new event id/slug/config | operator launchpad, event setup, testing console | owner-only controls unless owner | local Master Gauntlet + postdeploy critical lane |
| Attendee | `/join` / `/events/[slug]` | Register/enter event | attendee registration/profile/session | attendee event/lobby/stage | speaker/sponsor/crew/admin surfaces | transactional E2E + duplicate/invalid lane |
| Speaker | `/speaker` | Enter speaker-scoped prep/stage surface | speaker session/scope | speaker green room/materials | sponsor/crew/admin/other event data | role-boundary E2E |
| Sponsor | `/sponsor` | Enter sponsor-scoped portal | sponsor session/scope | sponsor assets/approval surface | speaker/crew/admin/other sponsor data | role-boundary E2E |
| Crew | `/production-access/crew` | Execute show-day support | crew session/capability | crew show-day ops | owner-only/admin settings | role-boundary E2E |
| Owner/Admin | `/production-access/owner` / `/admin/testing` | Access elevated operations/testing | owner/admin session | owner/testing/admin surfaces | cross-event leaks | auth + negative E2E |
