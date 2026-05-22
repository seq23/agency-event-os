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
OWNER_MASTER_ACCESS_PASSWORD=Owner-Command-2026!
```

Owner gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/owner
```

---

## 3. Operator access

Use this for Day 1 show operation, launchpad, event creation, setup, preview, run-of-show, crew manager, video health, incidents, approval queue, and change control.

```text
OPERATOR_LAUNCHPAD_PASSWORD=Show-Runner-2026!
```

Operator gate:

```text
https://west-peek-live.seq-taylor.workers.dev/production-access/operator
```

---

## 4. Crew access

Use this for show-day crew surfaces: crew home, call sheet, run-of-show, tasks, fallback, escalation, and show instructions.

```text
CREW_ACCESS_PASSWORD=Crew-Call-2026!
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
EVENT_DEMO_CLIENT_CODE=Demo-Client-2026!
EVENT_DEMO_CREW_LITE_CODE=Demo-CrewLite-2026!
EVENT_DEMO_SPEAKER_CODE=Demo-Speaker-2026!
EVENT_DEMO_SPONSOR_CODE=Demo-Sponsor-2026!
EVENT_DEMO_VIP_CODE=Demo-VIP-2026!
```

---

## 7. Leadership Reset Webinar access codes

```text
EVENT_LEADERSHIP_RESET_WEBINAR_CLIENT_CODE=Leadership-Client-2026!
EVENT_LEADERSHIP_RESET_WEBINAR_CREW_LITE_CODE=Leadership-CrewLite-2026!
EVENT_LEADERSHIP_RESET_WEBINAR_SPEAKER_CODE=Leadership-Speaker-2026!
EVENT_LEADERSHIP_RESET_WEBINAR_SPONSOR_CODE=Leadership-Sponsor-2026!
EVENT_LEADERSHIP_RESET_WEBINAR_VIP_CODE=Leadership-VIP-2026!
```

---

## 8. Premium Workshop Intensive access codes

```text
EVENT_PREMIUM_WORKSHOP_INTENSIVE_CLIENT_CODE=Workshop-Client-2026!
EVENT_PREMIUM_WORKSHOP_INTENSIVE_CREW_LITE_CODE=Workshop-CrewLite-2026!
EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPEAKER_CODE=Workshop-Speaker-2026!
EVENT_PREMIUM_WORKSHOP_INTENSIVE_SPONSOR_CODE=Workshop-Sponsor-2026!
EVENT_PREMIUM_WORKSHOP_INTENSIVE_VIP_CODE=Workshop-VIP-2026!
```

---

## 9. Provider Innovation Expo access codes

```text
EVENT_PROVIDER_INNOVATION_EXPO_CLIENT_CODE=Expo-Client-2026!
EVENT_PROVIDER_INNOVATION_EXPO_CREW_LITE_CODE=Expo-CrewLite-2026!
EVENT_PROVIDER_INNOVATION_EXPO_SPEAKER_CODE=Expo-Speaker-2026!
EVENT_PROVIDER_INNOVATION_EXPO_SPONSOR_CODE=Expo-Sponsor-2026!
EVENT_PROVIDER_INNOVATION_EXPO_VIP_CODE=Expo-VIP-2026!
```

---

## 10. Seed Demo Day access codes

```text
EVENT_SEED_DEMO_DAY_CLIENT_CODE=SeedDemo-Client-2026!
EVENT_SEED_DEMO_DAY_CREW_LITE_CODE=SeedDemo-CrewLite-2026!
EVENT_SEED_DEMO_DAY_SPEAKER_CODE=SeedDemo-Speaker-2026!
EVENT_SEED_DEMO_DAY_SPONSOR_CODE=SeedDemo-Sponsor-2026!
EVENT_SEED_DEMO_DAY_VIP_CODE=SeedDemo-VIP-2026!
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

## 11A. Speaker materials and teleprompter intake

Speaker materials have one producer review queue. The intake path can vary, but the destination must not vary.

| Intake path | Who uses it | What happens | Show-day rule |
|---|---|---|---|
| Speaker self-serve | Speaker | Speaker opens `/speaker/events/[eventId]/teleprompter` and submits teleprompter notes, deck links, or supporting document links. | Preferred path. Nothing goes live until producer review. |
| hello@ email fallback | Speaker or assistant | Operator/crew copies the email summary or file link into the speaker material intake panel on the event approval queue. | Email is not the system of record; the producer queue is. |
| Crew/operator upload or handoff | Crew, operator, producer | Crew/operator records the handoff in the same speaker material intake panel. | Use when a speaker sends a file by text, Drive, Slack, or live handoff. |

Operational rule: materials may arrive through self-serve, hello@ email, or crew/operator handoff, but they must end in the event-specific producer review queue before teleprompter/deck/show materials are changed. Speakers cannot directly publish script, slide, or teleprompter changes to the live show.

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

- Production feed/source: StreamYard.
- Primary embedded event engine/distribution: LiveKit.
- Secondary embedded fallback: Daily.
- White-label backup rooms: Zoom + Google Meet links.
- Zoom and Google Meet are backup continuity links, not the core event engine.
- Do not collapse StreamYard and LiveKit into the same failure plane: StreamYard is the production feed/source; LiveKit is the embedded event distribution layer.

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
