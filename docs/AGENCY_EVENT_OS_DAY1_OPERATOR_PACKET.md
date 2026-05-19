# West Peek Live — Day 1 Operator Packet

## 1. What this app is

West Peek Live is an internal virtual event production operating system for West Peek Productions. It helps the agency create, configure, preview, publish, operate, support, and report on branded online events.

## 2. Day 1 passwords

- Crew password: `CrewAccess-2026!`
- Speaker password: `SpeakerGuest-2026!`
- Sponsor password: `SponsorGuest-2026!`
- VIP / Client Preview password: `VIPGuest-2026!`

Crew password is set with `CREW_ACCESS_PASSWORD`. Demo special guest passwords are seeded for training. Real event special guest passwords are created in Event Setup → Access.

## 3. Front doors and Production Gate

The Production Gate is the internal password door. It routes owners, producers, VAs, crew, backend testers, speakers, sponsors, clients, and VIPs into the correct role-aware flow.

## 3A. Front doors

- Public guest: `/join`
- Crew: `/production-access/crew`
- Special guest: `/production-access/special-guest`
- Operator Launchpad: `/production-access/launchpad`
- Demo venue: `/venue/demo/lobby`

## 4. Operator Launchpad

After production access, operators use the Operator Launchpad. It includes Core Production, Demo Event Actions, Event Operations, Backend/Admin Testing, Live Production Controls, Role Entry Testing, and Operator Documentation.

## 5. Create First Event

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
| Create First Event | Guided route available |
| Demo Venue | 1:1 mirror required |
| Crew Gate | Available |
| Special Guest Gate | Available |
| Testing Console | Available |
| LiveKit | Primary provider |
| Daily | Secondary fallback |
| Zoom | Manual backup |
| Google Meet | Manual backup |
| Billing | V2 roadmap |
