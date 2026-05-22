# Role Journey E2E Matrix

Status: ACTIVE

Purpose: define the pre-deploy browser journey coverage expected for West Peek Live.

## Coverage standard

The local headed Playwright gauntlet must validate role surfaces from the user's point of view without requiring production secrets or mutating production data.

## Role journeys

| Role | Required coverage |
| --- | --- |
| Visitor | home, join, production access, event landing, agenda, registration, speakers, sponsors, speaker/sponsor submission |
| Attendee | lobby, stage, run of show, sessions, breakouts, expo, booth, networking, people, replay, help |
| Speaker | event home, onboarding, tech check, green room, backstage, teleprompter |
| Sponsor | event home, setup, booth, leads, ready room, report |
| Crew | event home, call sheet, run of show, tasks |
| Client | event home, approvals, assets, reports, run of show, timeline |
| Producer/Admin | dashboard, event setup, agenda, run of show, approvals, assets, communications, inbox, incidents, tasks, video health, publish, report, preview |
| Crew Testing Console | showtime readiness, livestream status, matchmaking/networking health, route health, run-of-show readiness, fallback decision helper |
| Safe Failure | production access, crew access, special guest access, setup error states |

## Non-brittle rules

- Tests must assert user-visible intent, not exact layouts.
- Tests must fail on HTTP 500, Next digest/server crashes, generic application errors, and missing major role surfaces.
- Tests must allow intentional setup screens when secrets are absent.
- Tests must not require production credentials unless a dedicated seeded test environment exists.
- Tests must not perform irreversible production writes.

## Showtime readiness cockpit requirements

The crew testing console must help a producer answer:

1. Is livestream/video provider readiness acceptable?
2. Is the fallback ladder clear: LiveKit → Daily → Zoom → Google Meet?
3. Is matchmaking/networking likely to work?
4. Are route health, run of show, attendee experience, and runtime persistence visible?
5. What should the crew debug first?
6. When should the crew switch to backup room?


## Go/no-go decision standard

The crew testing console must expose a go/no-go barometer that summarizes livestream readiness, LiveKit primary status, Daily automatic fallback status, Zoom / Google Meet manual fallback readiness, matchmaking/networking status, route health, run-of-show readiness, and the producer's next debugging action.

A producer should be able to decide before showtime whether to proceed, monitor, or switch fallback rooms without reading source code or interpreting raw logs.


## Speaker teleprompter material queue

Master gauntlet must prove speaker portal access, teleprompter route, self-serve material submission, queued producer review, and operator approval queue visibility for the same newly-created event slug.
