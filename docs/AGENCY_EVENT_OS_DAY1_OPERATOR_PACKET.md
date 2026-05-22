# West Peek Live — Private Day 1 Owner / Operator Packet

**Audience:** Scooter / private owner-level operator  
**System:** West Peek Live / Agency Event OS  
**Production Worker:** https://west-peek-live.seq-taylor.workers.dev  
**Repo commit deployed:** `91c27fd`  
**Cloudflare Worker version proven after deploy:** `f53649b1-93ac-4330-8867-5985cf6f3bf3`  
**Status:** deployed and postdeploy browser-validated

> Private packet. Do not commit this file to GitHub. Do not paste this file into public tickets, public docs, Slack channels, or email threads unless the recipient is explicitly owner-approved.

---

## 1. Production front doors

| Purpose | URL |
|---|---|
| Production Access Hub | `https://west-peek-live.seq-taylor.workers.dev/production-access` |
| Owner / Boss Master Gate | `https://west-peek-live.seq-taylor.workers.dev/production-access/owner` |
| Operator Launchpad Gate | `https://west-peek-live.seq-taylor.workers.dev/production-access/operator` |
| Crew Gate | `https://west-peek-live.seq-taylor.workers.dev/production-access/crew` |
| Special Guest Gate | `https://west-peek-live.seq-taylor.workers.dev/production-access/special-guest` |
| Public Join | `https://west-peek-live.seq-taylor.workers.dev/join` |
| Demo Event Public Page | `https://west-peek-live.seq-taylor.workers.dev/events/demo` |
| Demo Venue Lobby | `https://west-peek-live.seq-taylor.workers.dev/venue/demo/lobby` |
| Event Summit Venue Lobby | `https://west-peek-live.seq-taylor.workers.dev/venue/event-summit/lobby` |
| Operator Packet Route | `https://west-peek-live.seq-taylor.workers.dev/operator-packet` |
| Testing Console | `https://west-peek-live.seq-taylor.workers.dev/admin/testing` |

---

## 2. Owner / boss master access

Use this only for owner-level control, settings, billing, admin testing, and full workspace access.

```text
OWNER_MASTER_ACCESS_PASSWORD=OwnerMaster-2026!
```

Owner gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/owner
```

---

## 3. Operator access

Use this for Day 1 show operation, launchpad, event creation, setup, preview, run-of-show, crew manager, video health, incidents, approval queue, and change control.

```text
OPERATOR_LAUNCHPAD_PASSWORD=OperatorLaunchpad-2026!
```

Operator gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/operator
```

---

## 4. Crew access

Use this for show-day crew surfaces: crew home, call sheet, run-of-show, tasks, fallback, escalation, and show instructions.

```text
CREW_ACCESS_PASSWORD=CrewAccess-2026!
```

Crew gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/crew
```

---

## 5. Special guest access model

Special guests use the Special Guest Gate plus the event-specific code for their role.

Special Guest Gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/special-guest
```

Roles:

- Client → client portal
- Speaker → speaker portal
- Sponsor → sponsor portal
- VIP → venue/lobby access
- Crew Lite → crew instruction surfaces, not full operator launchpad

---

## 6. Demo event access codes

```text
EVENT_DEMO_CLIENT_CODE=PrYQ0PUDfonDxO-rYA-v-4U1YR8PNrpg
EVENT_DEMO_CREW_LITE_CODE=BlyZ2QfZZWOXsj4BZuVrv3I-fklo67JZ
EVENT_DEMO_SPEAKER_CODE=cTehLlo_kiXFoYR_IROc-S1D0UBKtrE-
EVENT_DEMO_SPONSOR_CODE=ASFbEmnJ_Ga4Xp0jCXkmeTXhiiTIwdp7
EVENT_DEMO_VIP_CODE=SBYFMZODMzZm8IrpIKMjxgASdzVOsMkX
```

---

## 7. Leadership Reset Webinar access codes

```text
EVENT_LEADERSHIP_RESET_WEBINAR_CLIENT_CODE=k3VSeIa_Ka8TWYqvi-NRkGBEIz3Iw0q6
EVENT_LEADERSHIP_RESET_WEBINAR_CREW_LITE_CODE=wi1AeitcWDyW01Jztfs0rC0gbdlDk8Gj
EVENT_LEADERSHIP_RESET_WEBINAR_SPEAKER_CODE=QEr9ehV9mA3oHkLdMcXHA9jWvtF98_Qv
EVENT_LEADERSHIP_RESET_WEBINAR_SPONSOR_CODE=ky8noBJRGtS6V5nRjTX7Ju-Ul7l4t3fl
EVENT_LEADERSHIP_RESET_WEBINAR_VIP_CODE=Xci1kZVzQXm1mghh6cZtjlDX9hUDzEFz
```

---

## 8. Premium Workshop Intensive access codes

```text
EVENT_PREMIUM_WORKSHOP_INTENSIVE_CLIENT_CODE=MRruS-m3jztox1ZWPlUOuS0wW7Ezx3rE
EVENT_PREMIUM_WORKSHOP_INTENSIVE_CREW_LITE_CODE=yJFC6Ojt6Dryr-t8WrZyq2JOQJWMm_v-
EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPEAKER_CODE=JSNKiJLGyaBNdWpzj5xEDVE8jK--rqsf
EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPONSOR_CODE=9goixfw44tkXNR2tFKXmQKRH7KQWAvnX
EVENT_PREMIUM_WORKSHOP_INTENSIVE_VIP_CODE=QGzqouoJaeOjxFxKVGWap15dvi-GKW4D
```

---

## 9. Provider Innovation Expo access codes

```text
EVENT_PROVIDER_INNOVATION_EXPO_CLIENT_CODE=FnvZCEe0A_iTUvMGC1I0owMUA2CUrK0j
EVENT_PROVIDER_INNOVATION_EXPO_CREW_LITE_CODE=dpc8LH6U41pIV7A5pu4fqcDZelVvjUTF
EVENT_PROVIDER_INNOVATION_EXPO_SPEAKER_CODE=eFkuJoVGB_8N2PgfdsLZ5Al6U3oRXahb
EVENT_PROVIDER_INNOVATION_EXPO_SPONSOR_CODE=uBA8ud4sa8MewG0dtEc-UT9ojnSlFJ8s
EVENT_PROVIDER_INNOVATION_EXPO_VIP_CODE=iZKH6BxA1TJ-5fnb6x3vqfbDDp4xFJht
```

---

## 10. Seed Demo Day access codes

```text
EVENT_SEED_DEMO_DAY_CLIENT_CODE=Uirggpw0N-n1yJ1U4MD6QLo_jv6c4PwS
EVENT_SEED_DEMO_DAY_CREW_LITE_CODE=MbiSwARGHaqFG8WkrlL1bKCGXVZID8Dh
EVENT_SEED_DEMO_DAY_SPEAKER_CODE=ZpNE8vQ9ENnARtHsp0zJh9B_Xw15zkKk
EVENT_SEED_DEMO_DAY_SPONSOR_CODE=RldlFefyX-tmoRgVdkT7NoCK05-rLkzc
EVENT_SEED_DEMO_DAY_VIP_CODE=OdZhmiybVyHepvcb_xLSPxmRzT0_kLYW
```

---

## 11. Day 1 show workflow

1. Open Owner Gate if owner-level settings, billing, admin testing, or full workspace access are needed.
2. Open Operator Gate for show operation.
3. Enter Operator Launchpad.
4. Use **Create Event in Admin Workspace** to create a new event setup draft.
5. Confirm the setup page renders the event name, provider plan, and next actions.
6. Use **Preview event** to open the real attendee venue lobby.
7. Review Run of Show.
8. Review Crew Briefing & Instructions.
9. Review Video Health.
10. Test Crew Gate.
11. Test Special Guest Gate with the relevant role code.
12. Open Lobby, Stage, Sessions, Breakouts, Networking, Expo, People, Replay, and Help.
13. Keep Incidents and Change Control available during the show.

---

## 12. Access boundaries

- Owner / Boss: full owner-level access.
- Operator: event-production access, not owner-only settings/billing unless owner key is used.
- Crew: crew instructions only.
- Crew Lite: crew instruction surfaces, not operator launchpad.
- Speaker: speaker portal only.
- Sponsor: sponsor portal only.
- Client: client portal only.
- VIP: venue/lobby experience.
- Attendee: registered attendee venue access only.

---

## 13. Video provider model

- Primary embedded event engine: LiveKit.
- Secondary embedded fallback: Daily.
- White-label backup rooms: Zoom + Google Meet links.
- Zoom and Google Meet are backup continuity links, not the core event engine.

---

## 14. Validation proof from latest deployment

Latest local + deployed proof completed:

- `deploy:doctor`: PASS
- Cloudflare required secret-name parity: PASS, 61 required names present
- Supabase schema parity: PASS
- Cloudflare deploy: PASS
- `postdeploy:full`: PASS
- Deployed browser suite: 46 passed, 4 skipped
- Day 1 showtime master gauntlet: PASS deployed

Proof limit:

- Cloudflare secret audit proves required secret names exist; it does not read secret values.
- Supabase schema parity proves required tables/columns are queryable; it does not print secret values.

---

## 15. Private environment reference

The companion file `west-peek-live-private-owner-env-vars.txt` contains the environment reference for off-repo owner storage.

Do not commit that file to GitHub. If using it locally, copy values into `.env.local` only temporarily, then remove `.env.local` before validation/deploy.

Local use:

```bash
cp /secure/path/west-peek-live-private-owner-env-vars.txt .env.local
```

Before validation/deploy:

```bash
rm -f .env.local
rm -rf .open-next .next .wrangler .runtime-data test-results playwright-report
```
