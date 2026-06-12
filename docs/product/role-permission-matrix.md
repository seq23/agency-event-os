# Role Permission Matrix — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

| Role | Can see | Can create/update | Must never access | Required negative proof |
|---|---|---|---|---|
| Public visitor | public pages, event discovery | request event / join attempts | admin, owner, operator, crew, sponsor, speaker private surfaces | unauthenticated route denial |
| Attendee | attendee event/lobby/stage state | registration/profile/participation where enabled | operator, crew, owner, sponsor, speaker private controls | attendee cannot elevate |
| Speaker | speaker event-scoped surfaces | speaker materials/profile where enabled | sponsor private assets, crew controls, owner/admin | wrong-role denial |
| Sponsor | sponsor event-scoped surfaces | sponsor assets/profile where enabled | speaker private materials, crew controls, owner/admin | wrong-role denial |
| Crew | show-day operational surfaces | assigned show tasks | owner-only settings/billing/admin exports | crew cannot owner/admin |
| Operator | event setup/testing/launchpad | event config and production workflow | owner-only global controls unless granted | operator cannot owner-only |
| Owner/Admin | elevated ops/testing | controlled admin actions | raw secrets display/download/copy | admin health never leaks secrets |
