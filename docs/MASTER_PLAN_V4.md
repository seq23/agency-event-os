STATE

* I audited the current repo evidence we have from the latest terminal outputs, deploy logs, validation logs, and the Master Plan v3 context.
* I did **not** re-open the live repo filesystem in this turn, so this is a planning/product-architecture audit based on the available repo evidence and attached plan, not a fresh code-by-code diff.
* Current repo evidence shows the app already has the broad route skeleton for agency app, event admin, client, crew, speaker, sponsor, public event, venue, testing, run-of-show, video, auth, and Cloudflare deploy paths. The uploaded terminal output shows route/files such as `/app/events/[eventId]/run-of-show`, `/crew/events/[eventId]/run-of-show`, `/speaker/events/[eventId]/backstage`, `/sponsor/events/[eventId]/booth`, `/venue/[eventId]/lobby`, `/venue/[eventId]/stage`, and related components/services/tests. 
* The original product spine already required a production command center with current segment, next cues, speaker readiness, room status, crew assignments, incident logs, moderation placeholders, audit logs, and video provider abstraction. 
* Master Plan v3 correctly moved away from a single “Production Workspace” door and toward a two-path Production Access hub with **Crew / Production Team** and **Conference Special Guest**, with repo config for routing and Cloudflare/local env for secrets. 

# West Peek Live — Master Plan v4

## Final End-to-End Product, Access, Event Setup, Publishing, Live Ops, QA + Security Plan

## 1. Lead Architect Verdict

The core idea is strong: **West Peek Live should not be just a video venue.** It should be a virtual event operating system where the public attendee experience is clean, while crew, clients, speakers, sponsors, and producers all have their own controlled paths.

The biggest flaw in v3 is that it still treats “event config publishing” as the main bridge between crew setup and attendee access. That is necessary, but not sufficient.

The better v4 architecture needs four connected planes:

```txt
1. Public Experience Plane
Homepage → Join Event → Event Landing/Register/Lobby

2. Access Plane
Production Access → Crew Gate / Special Guest Gate

3. Event Operations Plane
Manage Events → Setup → Run of Show → Video Health → Publish

4. Governance + Deployment Plane
Repo config → GitHub Actions/PR/package → validate → deploy → smoke
```

The product becomes near-perfect when these four planes are connected and every user type has an obvious path.

---

# 2. Critical Gaps Found in v3

## Gap 1 — “Join an Event” needs event states, not just redirects

The `/join` page cannot simply resolve `demo → /venue/demo/lobby`.

It needs event-state logic:

```txt
draft       → not publicly visible
upcoming    → branded holding / landing page
open        → landing/register allowed
live        → lobby/stage allowed
ended       → replay/recap allowed
archived    → unavailable unless direct/private access
```

Without this, attendees can enter events too early, too late, or into the wrong place.

## Gap 2 — Special guests are not the same as attendees

A speaker is not “an attendee with a better link.”

They need:

* pre-event onboarding
* tech check
* backstage/green room
* session assignment
* speaker assets
* emergency contact
* producer notes
* join links
* day-of status

Sponsor users need a different journey:

* booth setup
* logo/assets
* offer/CTA
* booth preview
* lead capture
* sponsor report

Clients need yet another journey:

* approvals
* timeline
* polished run-of-show
* assets
* preview
* report

So v4 must treat “Conference Special Guest” as a role resolver, not just a password page.

## Gap 3 — Crew gate alone is not enough for production safety

A shared crew password is acceptable for MVP, but crew actions need internal roles after entry:

```txt
Executive Producer
Producer
Technical Director
Show Caller
Moderator
VA / Production Assistant
Support
```

They can all enter through one crew gate, but the UI still needs permission-aware actions.

For example:

* VA can set up event config.
* Show caller can advance run-of-show.
* Technical director can switch video fallback.
* Executive producer can publish/deploy.
* Support can view attendee issues but not alter event setup.

## Gap 4 — Publishing needs a staging/review boundary

A VA should not accidentally make a public event live just because they filled a form.

Event setup needs a publish lifecycle:

```txt
Draft → Ready for Review → Approved → Published → Live → Ended → Archived
```

And separate concepts:

```txt
Setup complete ≠ Published
Published ≠ Live
Live ≠ Replay available
```

## Gap 5 — Event setup needs import paths

Manual wizard entry is not enough.

Real event teams receive:

* spreadsheets
* speaker forms
* sponsor forms
* CSVs
* run-of-show docs
* client brand kits
* image folders
* agenda exports

The system should support:

```txt
Manual entry
CSV import
Copy from template
Duplicate prior event
Config package import
```

## Gap 6 — No explicit comms/email layer in v3

An event platform needs operational emails:

* speaker invite
* sponsor invite
* client review link
* attendee registration confirmation
* event reminder
* access code resend
* backstage reminder
* post-event replay/report email

The repo already has Resend/email work, so v4 needs an event communications layer tied to setup and access.

## Gap 7 — Video fallback needs room-level overrides

v3 says LiveKit → Daily → Zoom → Google Meet. Good.

But the real world failure mode is often room-specific:

* main stage is failing
* one breakout is failing
* sponsor booth room is failing
* speaker backstage is failing
* networking room is failing

So fallback control needs both:

```txt
event-level fallback
room-level fallback
```

## Gap 8 — Attendee lobby needs degraded/offline states

A beautiful lobby is not enough.

It needs:

* event not open
* live now
* session full
* stream unavailable
* fallback active
* replay not ready
* agenda empty
* no sponsors
* no speakers
* networking closed
* support escalation
* mobile browser warning
* unsupported browser warning

## Gap 9 — Audit logs must become first-class

The original product spec already emphasized audit logging. v4 must carry that through.

Audit every sensitive action:

* access gate success/failure
* crew login
* special guest login
* event publish
* deploy trigger
* video fallback switch
* run-of-show advance
* incident creation
* asset approval
* speaker/sponsor approval
* event status change

## Gap 10 — Analytics and post-event reporting need to start now

Even if MVP reporting is a shell, the data events must exist early:

* attendee joined lobby
* joined session
* visited sponsor booth
* clicked CTA
* asked question
* networking joined
* replay watched
* support requested

If this is not captured early, post-event reports become fake.

---

# 3. Final Product Model v4

## Product identity

```txt
West Peek Live is a virtual event production operating system for agencies and production teams running branded online events, combining attendee venues, production command centers, guest portals, run-of-show control, video fallback, access gates, and post-event reporting.
```

## Core planes

```txt
Public Plane:
Homepage, Join Event, public event pages, registration, venue/lobby.

Access Plane:
Crew access, special guest access, role-scoped portals.

Operations Plane:
Manage events, setup wizard, run-of-show, video health, assets, approvals, incident logs.

Publishing Plane:
Repo config, GitHub Actions/PR/package, validation, deploy, smoke, baseline snapshot.
```

---

# 4. Final Homepage Flow

Homepage should show:

```txt
[ Join an Event ]      [ Production Access ]

Preview demo venue →
```

## Primary CTA — Join an Event

Route:

```txt
/join
```

Purpose:

* attendee event code entry
* direct public event access
* friendly invalid-code handling

## Secondary CTA — Production Access

Route:

```txt
/production-access
```

Purpose:

* crew access
* special guest access

## Tertiary CTA — Preview demo venue

Route:

```txt
/venue/demo/lobby
```

Rules:

* subdued text link
* no production access
* no special guest cookies
* no implied login

---

# 5. End-to-End User Journey Audit

## 5.1 Public Attendee

### Path

```txt
Homepage
→ Join an Event
→ /join
→ enters event code
→ resolver checks config/status
→ event landing/register/lobby
→ attends event
→ replay/report if available
```

### Required UX states

```txt
loading resolver
invalid event code
event not open
registration required
registration closed
event live
event ended
replay available
unsupported browser
mobile warning
network degraded
session full
stream fallback active
support/contact needed
```

### What they must never see

```txt
/app
/admin/testing
/production-access/crew success
/speaker
/sponsor
/client
/crew
raw error pages
404 for invalid event code
```

### Final destination quality bar

The lobby must feel like a branded event venue, not a route shell:

```txt
Event logo
Event title
Live status
Now live card
Next session card
Agenda
Sponsors/expo
Networking
Help
Replay if enabled
Mobile-safe navigation
```

---

## 5.2 Crew / Production Team

### Path

```txt
Homepage
→ Production Access
→ Crew / Production Team
→ crew password
→ optional event code
→ /app or /app/events/[eventId]
→ manage event / command center
```

### Crew workspace must show

```txt
Current / Live events
Upcoming events
Draft events
Past events
Archived events
Events at risk
Missing assets
Readiness scores
Publish/deploy status
Video health status
Run-of-show progress
Incidents
Approvals
```

### Crew roles after access

Even if one password gates entry, app roles should exist internally:

```txt
Executive Producer
Producer
Technical Director
Show Caller
Moderator
VA / Production Assistant
Support
```

### Crew critical actions

```txt
create event
duplicate event
import event data
edit branding
upload assets
configure attendee flow
configure portals
generate access codes
build run-of-show
preview venue
publish config
trigger GitHub Actions / PR
deploy
run smoke tests
mark event live
switch fallback provider
log incident
end event
archive event
```

### Required UX states

```txt
no events yet
events loading
publish in progress
validation failed
deploy failed
smoke failed
event missing required fields
asset upload failed
video health degraded
fallback recommended
fallback switched
incident active
```

---

## 5.3 VA / Production Assistant

This is not just “crew.” VA handling needs a safer workflow.

### Path

```txt
Production Access
→ Crew gate
→ Manage Events
→ Create Event Wizard
→ Fill setup steps
→ Ready for Review
```

### VA should be allowed to

```txt
create drafts
add/edit basics
upload branding
add agenda
add speakers
add sponsors
add assets
prepare access config
generate config package
mark ready for review
```

### VA should not be allowed to

```txt
deploy directly
switch video fallback during live event
delete live event
archive event without approval
change production crew password
expose access codes
override validation hard-fails
```

### UX requirement

Use a checklist-style wizard with clear completion markers.

```txt
Basics
Branding
Attendee Flow
Venue Modules
Agenda
Speakers
Sponsors
Access
Run of Show
Video
Preview
Publish
```

---

## 5.4 Executive Producer / Owner

### Path

```txt
Production Access
→ Crew gate
→ /app
→ current event dashboard / approvals / publishing
```

### Needs to see

```txt
events at risk
readiness score
missing blockers
client approvals pending
speaker/sponsor readiness
run-of-show completeness
video fallback readiness
publish status
deploy status
post-event reporting status
```

### Owner-only actions

```txt
approve publish
trigger deploy
approve live mode
override event status
switch to Zoom fallback
archive event
rotate crew password
view audit logs
```

---

## 5.5 Technical Director

### Path

```txt
Production Access
→ Crew gate
→ Event Command Center
→ Video Health
```

### Needs to see

```txt
LiveKit health
Daily health
Zoom readiness
Google Meet emergency link
room-level health
token route status
join URL status
provider API status
latency
recent errors
active provider
manual override state
```

### Allowed actions

```txt
run health check
switch room to Daily
recommend Zoom
confirm Zoom fallback if permission allows
clear manual override
open backup room
copy emergency links
```

### Safety rule

Zoom fallback must be crew-confirmed. Google Meet must be explicit last-resort.

---

## 5.6 Show Caller

### Path

```txt
Production Access
→ Crew gate
→ Event Command Center
→ Run of Show
```

### Needs to see

```txt
current segment
next three cues
progress bar
late/on-time indicator
speaker readiness
asset readiness
room status
producer notes
technical cues
incident log
```

### Allowed actions

```txt
mark segment live
mark segment complete
delay segment
skip segment
add issue note
trigger cue
open linked room
open linked asset
```

---

## 5.7 Client

### Path

```txt
Production Access
→ Conference Special Guest
→ event code + client code
→ /client/[clientSlug]/events/[eventId]
```

### Needs to see

```txt
polished event overview
timeline
approval requests
client-facing run-of-show
assets for review
venue preview
reports
support/contact
```

### Must not see

```txt
internal production chaos
contractor/vendor details unless approved
private producer notes
internal incident detail
all-client data
financial/internal settings
```

---

## 5.8 Speaker

### Path

```txt
Production Access
→ Conference Special Guest
→ event code + speaker code
→ /speaker/events/[eventId]
```

### Needs to see

```txt
assigned sessions
tech check
green room / backstage
upload bio/headshot
session details
call time
run-of-show excerpt
producer contact
slides/assets checklist
join link
```

### Missing UX states to include

```txt
speaker not assigned to session
tech check incomplete
missing headshot
missing slides
backstage not open yet
join link not ready
session complete
```

---

## 5.9 Sponsor

### Path

```txt
Production Access
→ Conference Special Guest
→ event code + sponsor code
→ /sponsor/events/[eventId]
```

### Needs to see

```txt
booth setup
logo upload
CTA URL
booth preview
sponsor rep access
lead capture
sponsor deliverables
post-event sponsor report
```

### Missing UX states

```txt
booth not configured
logo missing
CTA missing
leads unavailable yet
report not ready
sponsor package incomplete
```

---

## 5.10 Crew Lite / Contractor

### Path

```txt
Production Access
→ Conference Special Guest
→ event code + crew-lite code
→ /crew/events/[eventId]
```

### Needs to see

```txt
call sheet
assigned tasks
assigned rooms
assigned run-of-show segments
incident contact
support escalation
```

### Must not see

```txt
full app dashboard
all clients
all events
publish/deploy controls
secret/access-code management
```

---

## 5.11 VIP

### Path

```txt
Production Access
→ Conference Special Guest
→ event code + VIP code
→ VIP lobby or event page
```

### Needs to see

```txt
VIP event access
special lobby state
possibly private session links
no production tools
```

VIP is not a producer. Do not over-grant.

---

# 6. Final Access Architecture

## Access planes

```txt
Attendee:
event code/link only

Crew:
shared high-trust crew password + signed crew cookie

Special Guest:
event code + role-scoped access code + signed event-role cookie

Future:
Supabase as access registry/audit store, not primary login
```

## Hard security rules

```txt
No raw secrets in repo
No raw access codes in config
All access cookies signed
All sensitive cookies httpOnly + secure + sameSite=lax
Crew cookie short TTL
Special guest cookie event-scoped
Route guard in middleware
Audit all access attempts
Generic failure messages
Rate limiting planned
No direct commit to main from app
```

## Missing from v3: access attempt logging

Add event:

```txt
access_attempted
access_granted
access_denied
access_expired
access_revoked
```

Fields:

```txt
eventId
role
accessKind
route
ip hash
user agent hash
timestamp
reason
```

Do not log raw submitted codes.

---

# 7. Event Setup System v4

## Crew creates event through

```txt
/app/events/new
```

## Manage Events routes

```txt
/app/events
/app/events/[eventId]
/app/events/[eventId]/setup
/app/events/[eventId]/branding
/app/events/[eventId]/attendee-flow
/app/events/[eventId]/venue
/app/events/[eventId]/agenda
/app/events/[eventId]/speakers
/app/events/[eventId]/sponsors
/app/events/[eventId]/access
/app/events/[eventId]/run-of-show
/app/events/[eventId]/video-health
/app/events/[eventId]/communications
/app/events/[eventId]/analytics
/app/events/[eventId]/preview
/app/events/[eventId]/publish
```

## New v4 addition: Communications

Add event communications because access without comms is incomplete.

Communications should include:

```txt
attendee registration confirmation
attendee reminders
speaker invite
speaker tech check reminder
sponsor invite
client review request
crew call sheet
event live notice
replay available notice
post-event report notice
```

Backed by Resend.

---

# 8. Manage Events Dashboard v4

Route:

```txt
/app/events
```

Tabs:

```txt
Live Now
Upcoming
Drafts
Needs Review
Past
Archived
All
```

Card fields:

```txt
event name
client
date/time/timezone
event status
readiness score
setup completion
access readiness
speaker readiness
sponsor readiness
asset readiness
run-of-show status
video health
publish status
last smoke result
incident count
reporting status
```

Buttons:

```txt
Manage Event
Preview Venue
Run of Show
Video Health
Publish
Reports
```

Live card:

```txt
Live now
Current segment
Elapsed time
Next segment
Run-of-show progress
Video provider health
Fallback recommendation
Open command center
```

Empty state:

```txt
No events yet.
Create your first event or duplicate the demo event.
```

---

# 9. Event Command Center v4

Route:

```txt
/app/events/[eventId]
```

This is the day-of control room.

Sections:

```txt
Show status
Run-of-show progress
Now / Next
Video health
Incidents
Speaker readiness
Sponsor readiness
Attendee support
Announcements
Fallback controls
Quick links
Audit trail
```

## Live event status bar

```txt
Event: Live
Current segment: Founder Lessons
Progress: 42%
On time: +2 min late
Active provider: LiveKit
Fallback: Daily ready
Open incidents: 1
```

## Operational buttons

```txt
Mark event live
Open attendee lobby
Open backstage
Open testing console
Run smoke test
Switch fallback
Log incident
End event
```

---

# 10. Run-of-Show v4

Existing spine stays. v4 adds command-grade operations.

## Required views

```txt
Builder view
Client-facing view
Crew call sheet view
Live show caller view
Speaker excerpt view
Sponsor excerpt view if relevant
```

## Segment model

```txt
id
eventId
title
type
start
end
duration
room
stage/session
speakerIds
sponsorIds
owner
technical cues
producer notes
client-visible notes
assets
backup plan
status
incidentIds
```

## Live controls

```txt
mark ready
mark live
mark complete
skip
delay
jump
add incident
add note
open room
open asset
trigger announcement
```

## Progress logic

Use both:

```txt
scheduled time progress
segment completion progress
```

Why both? Time-based progress handles live clock reality; segment-based progress handles show-caller state.

---

# 11. Video Health + Fallback v4

## Provider ladder remains

```txt
LiveKit → Daily → Zoom → Google Meet
```

## v4 upgrade: room-level health

Track health for:

```txt
main_stage
backstage
breakout_session
networking_match
sponsor_booth
rehearsal_room
```

## Health signals

```txt
token route status
provider API status
join URL status
room provision status
latency
recent errors
participant count if available
recording status
last checked
```

## Fallback rules

```txt
LiveKit degraded/down → Daily automatic if enabled
Daily degraded/down → Zoom recommended, not automatic
Zoom unavailable → Google Meet manual emergency
```

## Crew confirmation required for Zoom

Zoom should never silently replace production unless crew confirms.

Confirm modal:

```txt
Switch this event/room to Zoom fallback?

LiveKit is degraded and Daily is not healthy.
Zoom is ready as managed fallback.

This changes the join target for affected users.

[ Confirm switch to Zoom ] [ Cancel ]
```

## Missing v3 addition: rollback

Crew must be able to clear fallback:

```txt
Clear manual override
Return to automatic provider mode
```

---

# 12. Publishing Pipeline v4

## Locked hierarchy

```txt
1. GitHub Actions-first publishing
2. App-triggered GitHub Actions dispatch
3. GitHub PR automation from app
4. Config package fallback
5. Never direct commit to main from app
```

## Why Actions-first is better

GitHub Actions gives:

```txt
auditable workflow
validation logs
review boundary
repeatability
less application-side GitHub complexity
```

## Event publish workflow

```txt
Crew/VA completes setup
→ Ready for Review
→ Producer approves
→ Publish page
→ GitHub Actions publish
→ branch/PR generated
→ validators run
→ merge
→ deploy
→ smoke test
→ event becomes publicly resolvable
```

## Required workflow

```txt
.github/workflows/publish-event-config.yml
```

It must:

```txt
accept payload/artifact
validate schema
reject secrets
validate assets
validate routes
validate access env keys
validate run-of-show
validate video config
create branch
open PR
attach validation summary
```

## Fallback package

If GitHub integration is annoying:

```txt
Generate Config Package
```

Downloads:

```txt
event-config-[slug].zip
```

The package includes only repo-safe config/assets. No secrets.

---

# 13. Repo Config v4

## Required files

```txt
data/events/events.json
data/events/[slug]/event.json
data/events/[slug]/branding.json
data/events/[slug]/attendee.json
data/events/[slug]/agenda.json
data/events/[slug]/speakers.json
data/events/[slug]/sponsors.json
data/events/[slug]/run-of-show.json
data/events/[slug]/video.json
data/events/[slug]/communications.json
data/access/event-access-config.json
```

## Public assets

```txt
public/events/[slug]/logo.svg
public/events/[slug]/hero.jpg
public/events/[slug]/speakers/[speaker-id].jpg
public/events/[slug]/sponsors/[sponsor-id]-logo.svg
```

## Future heavy assets

Move later to R2/Supabase Storage.

Repo stores URLs only.

---

# 14. Data Persistence Position

v3 underplays this.

Repo config is good for deployable event configuration, but operational runtime state should not live only in repo.

Use:

## Repo config for

```txt
event identity
routing
branding refs
venue modules
planned agenda
planned run-of-show
access env key names
role redirects
communications templates
video fallback policy
```

## Runtime store for

```txt
access attempts
live run-of-show status
incidents
fallback switches
attendee registrations
analytics events
chat/Q&A/polls
support requests
email sends
audit logs
```

This can be Supabase later, but the plan must separate:

```txt
planned config ≠ live operational state
```

That is a critical architectural correction.

---

# 15. Testing Console v4

Testing Console should become the operator’s confidence panel.

Panels:

```txt
Route Health
Access Gate
Event Config
Publishing
Video Providers
Email/Resend
Supabase Runtime
Run of Show
Attendee Experience
Security
Smoke Tests
```

## Must show

```txt
status
last checked
pass/fail
warning
action needed
```

## Never show

```txt
API keys
passwords
raw access codes
tokens
full JWTs
private headers
```

---

# 16. UX State Audit Checklist

Every major page must support:

```txt
loading
empty
error
unauthorized
forbidden
not found
not configured
disabled
coming soon
offline/degraded
success
validation failed
pending review
published
live
ended
archived
```

## Specific pages

### `/join`

```txt
loading resolver
invalid code
event not open
event ended
registration closed
event live
```

### `/production-access`

```txt
crew gate unavailable
special guest unavailable
invalid code
expired access
locked out
```

### `/app/events`

```txt
no events
loading events
events at risk
current live
past/archived empty
```

### `/app/events/[eventId]/publish`

```txt
not ready
ready for review
validation running
validation failed
PR created
deploy running
deploy failed
smoke passed
```

### `/venue/[eventId]/lobby`

```txt
not open
live
session unavailable
provider degraded
help needed
replay available
```

---

# 17. Security Risks + Fixes

## Risk: shared crew password too broad

Fix:

```txt
short TTL
signed cookie
audit login
optional internal crew role selection
rotate secret
separate deploy/publish permissions
```

## Risk: special guest code leaks

Fix:

```txt
event-scoped code
role-scoped redirect
TTL
generic failure messages
revocation via env rotation
future access registry
```

## Risk: route escalation by editing cookie

Fix:

```txt
signed cookie
server-side verification
route guard checks role + event
```

## Risk: PR automation token misuse

Fix:

```txt
least-privilege GitHub token
workflow-limited token
never expose token client-side
PR only, no direct main commit
audit publish attempts
```

## Risk: video fallback accidentally disrupts live event

Fix:

```txt
health-based recommendation
crew confirmation
room-level scope
clear rollback
audit log
```

## Risk: secrets accidentally committed

Fix:

```txt
secret scanners
validator against raw code patterns
.env.local ignored
config only stores env key names
```

---

# 18. Validators v4

Add validators:

```txt
validate_front_door.js
validate_access_gate.js
validate_event_config.js
validate_event_assets.js
validate_event_routes.js
validate_event_publish_workflow.js
validate_run_of_show.js
validate_video_fallback_policy.js
validate_runtime_state_boundaries.js
validate_no_secrets.js
validate_ux_states.js
```

Main validation should fail if:

```txt
/join missing
production access missing
preview CTA primary-styled
event config invalid
access config contains raw secrets
middleware guard missing
run-of-show invalid
video fallback ladder changed
Zoom automatic fallback allowed
publish UI claims Actions but workflow missing
route references broken
required empty/error states missing
smoke test excludes front door
```

---

# 19. Smoke Tests v4

Post-deploy smoke must check:

```txt
/
 /join
 /production-access
 /production-access/crew
 /production-access/special-guest
 /events/demo
 /events/demo/register
 /venue/demo/lobby
 /app redirects/guards correctly
 /admin/testing guards correctly
 /api/video/livekit-token
 /api/video/daily-token
 /api/video/zoom-signature
 access invalid code rejects
 event demo resolves
 smoke never prints secrets
```

Browser smoke:

```txt
homepage has Join Event
homepage has Production Access
preview is subdued
join form submits
invalid code friendly error
demo reaches event/venue
production access page has two paths
lobby has branded content
no console errors
```

---

# 20. Docs v4

Add/update:

```txt
docs/MASTER_PLAN_V4.md
docs/FRONT_DOOR_FLOW.md
docs/ATTENDEE_JOIN_FLOW.md
docs/ACCESS_GATE_ARCHITECTURE.md
docs/EVENT_SETUP_SYSTEM.md
docs/MANAGE_EVENTS_DASHBOARD.md
docs/VA_EVENT_CREATION_RUNBOOK.md
docs/EVENT_CONFIG_SCHEMA.md
docs/GITHUB_EVENT_PUBLISHING.md
docs/PUBLISHING_FALLBACKS.md
docs/RUN_OF_SHOW_OPERATIONS.md
docs/VIDEO_FALLBACK_OPERATIONS.md
docs/COMMUNICATIONS_RUNBOOK.md
docs/SECURITY_MODEL.md
docs/ROUTE_MAP.md
docs/UX_STATES.md
docs/QA_SMOKE_TESTS.md
docs/DEPLOYMENT_ENV_CHECKLIST.md
docs/TESTING_CONSOLE.md
docs/README.md
```

---

# 21. Implementation Roadmap v4

## Phase 1 — Front Door + Join Flow

Deliver:

```txt
homepage CTA hierarchy
/join page
event resolver
invalid/not-open states
subdued preview link
front-door validator
```

## Phase 2 — Access Gate

Deliver:

```txt
/production-access
/production-access/crew
/production-access/special-guest
signed cookies
middleware guards
logout
access validator
```

## Phase 3 — Manage Events Dashboard

Deliver:

```txt
/app/events tabs
event cards
readiness scores
live/current/upcoming/past
empty states
event command center shell
```

## Phase 4 — Event Setup Wizard

Deliver:

```txt
basics
branding
attendee flow
venue modules
agenda
speakers
sponsors
access
run-of-show
video
communications
preview
publish
```

## Phase 5 — Repo Config + Publishing

Deliver:

```txt
data/events structure
access config
event config validators
GitHub Actions publish workflow
PR automation fallback
config package fallback
```

## Phase 6 — Live Ops Command Center

Deliver:

```txt
run-of-show progress
now/next cues
incident log
speaker readiness
room status
crew assignments
audit events
```

## Phase 7 — Video Health + Fallback

Deliver:

```txt
provider health panel
room-level health
Daily automatic fallback
Zoom crew-confirmed fallback
Google Meet manual fallback
rollback override
audit log
```

## Phase 8 — Communications

Deliver:

```txt
email templates
speaker/sponsor/client invites
registration confirmations
reminders
post-event notices
send logs
```

## Phase 9 — Analytics + Reporting

Deliver:

```txt
analytics event model
attendee/session/sponsor tracking
client report shell
sponsor report shell
replay metrics
```

## Phase 10 — QA / Security / Docs

Deliver:

```txt
validators
Testing Console panels
post-deploy smoke
security docs
VA runbooks
baseline snapshot
```

---

# 22. Final Locked v4 Decisions

```txt
Homepage:
Join an Event
Production Access
Preview demo venue →
```

```txt
Attendee:
Join Event → /join → event resolver → landing/register/lobby
```

```txt
Production:
Production Access → Crew or Conference Special Guest
```

```txt
Crew:
shared high-trust password now
internal permission-aware actions
event setup + live command center
```

```txt
Special Guest:
event code + role code
client/speaker/sponsor/crew-lite/VIP portals
```

```txt
Event setup:
crew/VA creates event through wizard
config flows to repo
runtime state does not live only in repo
```

```txt
Publishing:
GitHub Actions first
GitHub PR automation second
config package fallback third
never direct commit to main from app
```

```txt
Run of show:
existing spine remains
v4 adds live progress, now/next, incidents, cues, audit
```

```txt
Video:
LiveKit → Daily → Zoom → Google Meet
Daily automatic
Zoom crew-confirmed
Google Meet last-resort manual
room-level overrides
rollback available
```

```txt
Security:
no raw secrets in repo
signed cookies
generic failures
audit logs
route guards
secret scanners
```

```txt
QA:
validators + Testing Console + post-deploy smoke must cover front door, access, event setup, publishing, run-of-show, video, and security
```

STATUS
MASTER PLAN v4 READY.
