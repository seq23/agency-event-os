# Persona Route Outcome Map

| Persona | Allowed outcomes | Forbidden outcomes | Auth expectation |
|---|---|---|---|
| Public visitor | Discover event, request event, register, view safe public pages | Surprise `/app` or `/admin` route | No login unless CTA says login/workspace/admin |
| Registered attendee | Venue lobby, main stage, breakout/session chat, My Agenda, help, people directory if opted in | Speaker/sponsor/client/crew/operator/admin access, publish by default, restricted/VIP access from planning | Event-scoped attendee session only |
| Speaker | Speaker ready room after event-specific code | Operator/admin workspace | Special guest access only |
| Sponsor | Sponsor ready room and opt-in lead capture | Silent attendee data dump | Special guest or sponsor-scoped access |
| Client/VIP | Preview-safe venue surfaces | Admin/operator controls | Special guest access only |
| Crew | Crew testing and show support | Operator launchpad unless operator auth | Crew password disclosed on crew routes |
| Operator/producer | Operator launchpad and testing console | Supabase auth/admin impersonation | Operator password; not Supabase Auth |
| Admin/owner | Admin workspace | Public ambiguity | Account/admin login must be clear |
| Future self-serve customer | Safe disabled/redirected V2 surfaces | Billing or admin trap while disabled | Clear disabled state |
