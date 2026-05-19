# West Peek Live — Master Plan v6 E2E Completion

Status: implemented as the V6 operationalization layer.

V6 turns the V4/V5 architecture spine into end-to-end behavior. The completion contract requires named setup subroutes, repo-config authority, runtime persistence, role/event/action authorization, config-package publishing, room-level fallback controls, communications, analytics, Testing Console coverage, and behavioral tests.

## Completion gates

1. Public attendee flow resolves event codes through repo config.
2. Production access routes crew and special guests through signed cookies.
3. Special guest access is role-scoped and event-scoped.
4. Crew actions use capability checks before sensitive mutations.
5. Setup has named routes for basics, branding, attendee flow, venue, agenda, speakers, sponsors, access, run of show, video, communications, preview, publish, and incidents.
6. Event config packages can be built, validated, imported, and published through a PR workflow.
7. Runtime events persist through the runtime store for access, audit, analytics, fallback, incidents, support, email, registrations, and run-of-show actions.
8. Video fallback supports room-level state, Daily automatic fallback, Zoom crew-confirmed fallback, Google Meet manual fallback, and rollback.
9. Communications logs blocked or sent email attempts honestly.
10. Testing Console includes route, access, config, publishing, video, email, runtime, run-of-show, attendee, security, and post-deploy smoke panels.

## Validation

Run:

- `npm run validate:v5-hard`
- `npm run validate:v6-audit`
- local full validation through the updater: `npm run validate`

ChatGPT/container validation remains structural unless full local validation actually runs.
