# West Peek Live — Day 1 Operator Packet

## 1. What this app is

West Peek Live is an internal virtual event production operating system for West Peek Productions. It helps the agency create, configure, preview, publish, operate, support, and report on branded online events.

## 2. Day 1 passwords

DAY 1 OPERATOR ACCESS CREDENTIALS

Use these credentials only for Day 1 production access. Do not forward outside the approved operator / crew group.

OFFICIAL PRODUCTION ACCESS URL

https://west-peek-live.seq-taylor.workers.dev/production-access


OPERATOR ACCESS

Operator Launchpad URL:
https://west-peek-live.seq-taylor.workers.dev/production-access/operator

Operator Launchpad Password:
OperatorLaunchpad-2026!


CREW ACCESS

Crew Access URL:
https://west-peek-live.seq-taylor.workers.dev/production-access/crew

Crew Access Password:
CrewAccess-2026!


SPECIAL GUEST ACCESS

Special Guest Access URL:
https://west-peek-live.seq-taylor.workers.dev/production-access/special-guest


DEMO EVENT ACCESS CODES

Demo Client Code:
PrYQ0PUDfonDxO-rYA-v-4U1YR8PNrpg

Demo Crew Lite Code:
BlyZ2QfZZWOXsj4BZuVrv3I-fklo67JZ

Demo Speaker Code:
cTehLlo_kiXFoYR_IROc-S1D0UBKtrE-

Demo Sponsor Code:
ASFbEmnJ_Ga4Xp0jCXkmeTXhiiTIwdp7

Demo VIP Code:
SBYFMZODMzZm8IrpIKMjxgASdzVOsMkX


LEADERSHIP RESET WEBINAR ACCESS CODES

Client Code:
k3VSeIa_Ka8TWYqvi-NRkGBEIz3Iw0q6

Crew Lite Code:
wi1AeitcWDyW01Jztfs0rC0gbdlDk8Gj

Speaker Code:
QEr9ehV9mA3oHkLdMcXHA9jWvtF98_Qv

Sponsor Code:
ky8noBJRGtS6V5nRjTX7Ju-Ul7l4t3fl

VIP Code:
Xci1kZVzQXm1mghh6cZtjlDX9hUDzEFz


PREMIUM WORKSHOP INTENSIVE ACCESS CODES

Client Code:
MRruS-m3jztox1ZWPlUOuS0wW7Ezx3rE

Crew Lite Code:
yJFC6Ojt6Dryr-t8WrZyq2JOQJWMm_v-

Speaker Code:
JSNKiJLGyaBNdWpzj5xEDVE8jK--rqsf

Sponsor Code:
9goixfw44tkXNR2tFKXmQKRH7KQWAvnX

VIP Code:
QGzqouoJaeOjxFxKVGWap15dvi-GKW4D


PROVIDER INNOVATION EXPO ACCESS CODES

Client Code:
FnvZCEe0A_iTUvMGC1I0owMUA2CUrK0j

Crew Lite Code:
dpc8LH6U41pIV7A5pu4fqcDZelVvjUTF

Speaker Code:
eFkuJoVGB_8N2PgfdsLZ5Al6U3oRXahb

Sponsor Code:
uBA8ud4sa8MewG0dtEc-UT9ojnSlFJ8s

VIP Code:
iZKH6BxA1TJ-5fnb6x3vqfbDDp4xFJht


SEED DEMO DAY ACCESS CODES

Client Code:
Uirggpw0N-n1yJ1U4MD6QLo_jv6c4PwS

Crew Lite Code:
MbiSwARGHaqFG8WkrlL1bKCGXVZID8Dh

Speaker Code:
ZpNE8vQ9ENnARtHsp0zJh9B_Xw15zkKk

Sponsor Code:
RldlFefyX-tmoRgVdkT7NoCK05-rLkzc

VIP Code:
OdZhmiybVyHepvcb_xLSPxmRzT0_kLYW


IMPORTANT SECURITY NOTE

Do not include owner / boss master access in the Day 1 operator packet unless the recipient is explicitly approved for owner-level control.

Owner Master Access is private owner-only access and should stay in the private off-site env/password document, not the operator packet.

## 3. Front doors and Production Gate / Operator Gate

The Production Gate / Operator Gate is the internal password door. It routes owners, producers, VAs, crew, backend testers, speakers, sponsors, clients, and VIPs into the correct role-aware flow.

## 3A. Front doors

- Public guest: `/join`
- Crew: `/production-access/crew`
- Special guest: `/production-access/special-guest`
- Operator Launchpad: `/production-access/launchpad`
- Demo venue: `/venue/demo/lobby`

## 4. Operator Launchpad

After production access, operators use the Operator Launchpad. It includes Core Production, Demo Event Actions, Event Operations, Backend/Admin Testing, Live Production Controls, Role Entry Testing, and Operator Documentation.

## 5. Create Event in Admin Workspace

Go to `/app/events/new`. Fill event name, event code, client or organizer, date, audience, event type, primary video provider, fallback provider, Zoom backup URL, and Google Meet backup URL. Then continue into the setup spine.

## 6. Demo venue

The Preview Demo Venue is a 1:1 mirror of a real attendee event experience. It uses the same venue routes and components as real events: lobby, stage, sessions, networking, expo, sponsor booth, help, replay, people, and fallback states. The only difference is data source.

## 7. Video fallback structure

LiveKit is the primary embedded event room engine. Daily is the secondary embedded fallback. Zoom and Google Meet are manual backup room links. Zoom and Google Meet are not the core app engine; they are continuity links if embedded video fails.

## 8. Setup spine

Basics → Branding → Attendee Flow → Venue → Agenda → Access → Communications → Preview → Publish.

## 9. Access spine

Public guests → Crew → Speakers → Sponsors → Clients/VIPs. Crew uses the crew password. Speakers, sponsors, clients, and VIPs use event-specific special guest passwords.

## 10. Run-of-show spine

Agenda → Run of Show → Call Sheet → Show Caller View → Live Cues → Incidents → Post-Event Report.

## 11. Venue spine

Lobby → Stage / Sessions → Networking → Expo / Sponsor Booths → Help → Replay.

## 12. Fallback spine

LiveKit → Daily → Zoom → Google Meet → Incident Log → Post-Event Report.

## 13. Communications spine

Segments → Templates → Sends → Logs → Resend / Recovery.

## 14. Testing/admin spine

Testing Console → Route Health → Access Gates → Supabase Runtime → Event Config Package → Video Providers → Post-Deploy Smoke → Security Smoke.

## 15. Backend/admin testing

Open Operator Launchpad, then Testing Console. Use route health, access gate tests, video provider tests, Supabase runtime checks, event config package tests, security smoke tests, and post-deploy smoke tests.

## 16. Show-day runbook

1. Open Operator Launchpad.
2. Open the event.
3. Review Run of Show.
4. Review Video Health.
5. Confirm LiveKit readiness.
6. Confirm Daily fallback readiness.
7. Confirm Zoom and Google Meet backup links.
8. Test Crew Gate.
9. Test Special Guest Gate.
10. Open Lobby, Stage, Networking, Expo, Help, and Replay.
11. Keep Incidents and Change Control open during the show.

## 17. V2 billing roadmap

Future billing surfaces: agency workspace billing, per-event billing, per-client billing, sponsor booth/package billing, premium live support, replay/archive hosting, usage-based video costs, `/app/billing`, `/app/clients/[clientId]/billing`, `/app/events/[eventId]/billing`, and `/app/events/[eventId]/sponsor-packages`.

## 18. Feature availability table

| Area | Day 1 status |
|---|---|
| Operator Launchpad | Available |
| Create Event in Admin Workspace | Guided route available |
| Demo Venue | 1:1 mirror required |
| Crew Gate | Available |
| Special Guest Gate | Available |
| Testing Console | Available |
| LiveKit | Primary provider |
| Daily | Secondary fallback |
| Zoom | Manual backup |
| Google Meet | Manual backup |
| Billing | V2 roadmap |

## 19. Phase 1 attendee identity spine

Registration is now the event identity spine. The correct public attendee path is:

1. `/events/[eventSlug]`
2. `/events/[eventSlug]/register`
3. `/venue/[eventId]/lobby`

Registration must create all of the following before venue entry:

- durable event-scoped attendee profile
- attendee session cookie/token scoped to `eventId + attendeeId + role=attendee`
- optional agenda intent
- analytics registration event

Required fields:

- name
- email
- company / affiliation
- title / role

Optional fields:

- personal website
- social links
- reason for attending
- interesting fact
- topics of interest
- networking goals
- networking opt-in

Optional planning fields:

- planned sessions
- planned breakouts
- planned sponsor booths
- session reminders

Planning is skippable and editable later. Planning never grants restricted, VIP, speaker, sponsor, crew, operator, admin, or camera/mic publishing access.

## 20. Attendee access boundaries

Attendee registration grants only attendee venue access. It never grants:

- Supabase Auth
- speaker access
- sponsor access
- client/VIP access
- crew access
- operator access
- admin access
- main-stage publish permission
- restricted/VIP session access

Main-stage chat, breakout chat, people directory, help requests, networking, My Agenda, sponsor lead capture, moderation/revoke targeting, and attendee live requests should use the real attendee profile/session. Do not use `Conference Attendee`, `current-attendee`, or demo identity placeholders for registered-attendee flows.

## 21. My Agenda and profile state

My Agenda reflects attendee planning state only. It is not an authorization layer.

Operators should verify:

1. attendee can register without planning selections
2. attendee can register with planned sessions/breakouts/sponsor booths
3. selected items appear in My Agenda
4. restricted sessions remain restricted even if planned
5. attendee profile shows real name, title, and company

## 22. Sponsor lead boundary

Sponsors receive attendee information only after intentional attendee engagement or opt-in. Attending the event alone does not export all attendee profiles to every sponsor.

Allowed lead payloads must be scoped to the opted-in sponsor booth and only the allowed fields.

## 23. Validation proof levels

Validation is layered:

- Static contracts prove files, forbidden strings, route/registry presence, and secret boundaries.
- Unit tests prove pure rules.
- Integration tests prove actions, persistence, cookies, and webhook behavior.
- Transactional E2E proves forms, redirects, writes, and state changes.
- Outcome E2E proves persona-correct results and catches surprise routing.

Static validators must not claim product readiness. They only prove static contract presence.

## 24. Outcome E2E standard

Outcome E2E is required because a technically safe redirect can still be wrong if the CTA promise is misleading.

Examples of outcome failures:

- public CTA routes to `/app` or `/admin` without saying login/admin/workspace
- crew CTA implies operator access
- attendee CTA leads to protected admin flow
- sponsor CTA implies access to all attendee data without opt-in
- Daily fallback exposes reusable private room URL
- pre-stream stage shows black/error instead of branded pre-stream card

Use these artifacts as the source of truth:

- `docs/E2E_OUTCOME_TESTING_STANDARD.md`
- `docs/PERSONA_ROUTE_OUTCOME_MAP.md`
- `data/testing/cta-promise-registry.json`
- `data/testing/persona-route-outcomes.json`

## 25. Video provider and failover outcomes

Primary video provider is LiveKit. Daily is the embedded fallback. Zoom and Google Meet are white-label backup links only.

Show-day expectations:

1. early stage shows a branded pre-stream card, never a black/error screen
2. LiveKit has a short startup buffer before fallback behavior is considered
3. StreamYard feed failure recommends moving attendees to Daily while production restores StreamYard
4. LiveKit distribution failure keeps StreamYard as production source by default while moving attendees to Daily
5. switching overlay appears during fallback
6. refresh during fallback hydrates the active fallback state
7. attendee viewer tokens subscribe only by default
8. attendee publish requires crew approval

## 26. Final adversarial review gate

Before delivering any repo ZIP, run a hostile Principal Engineer review:

1. search for stale demo identity placeholders
2. search for public route secret exposure
3. verify Day 1 packet includes attendee identity, validation proof levels, and outcome E2E
4. verify CTA and persona registries exist
5. verify new validators are wired into package scripts
6. verify the ZIP is a full baseline snapshot from repo root
7. reopen the ZIP and confirm root files plus expected changed files exist

Do not mark complete unless the artifact has been reopened and the requested validation level has passed.


## Attendee retention policy

Default attendee retention is event-scoped and cost-aware: attendee profiles, registrations, attendance summaries, and sponsor opt-ins are retained for 12 months unless a client policy shortens that window. Raw chat is retained for 90–180 days. Presence, telemetry, access attempts, and short-lived attendee session tokens expire within the live/replay support window or 30–90 days depending on operational need. Raw analytics should be aggregated or anonymized after 90–180 days. All queries must filter by `eventId`, paginate, and select only needed columns.


## Local headed E2E diagnostics before repo update

Before applying a new baseline ZIP to the real local repo or deploying, test the ZIP in a throwaway folder and run:

```bash
npm run test:e2e:predeploy
```

The browser opens visibly. The local app server starts automatically. The runner uses file runtime storage, mock video, and blank Supabase/provider secrets so local tests cannot accidentally mutate production systems. A diagnostics ZIP is written to `~/Downloads` even if tests fail. Upload that diagnostics ZIP for fixes instead of pasting long terminal logs.
