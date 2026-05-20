# Transactional Full Buffett Fix Report

## Source diagnostic

Uploaded diagnostic ZIP: local-playwright-gauntlet-20260520_103619.zip.

## Failure class

The surface/role E2E suite passed, but the new transactional suite stopped on the producer run-of-show persistence assertion.

Observed failure:

- Test: `transactional-full-buffett.spec.ts`
- Step: click `Mark live` on `/app/events/demo/run-of-show`
- Expected runtime state: `runOfShowEvents` includes `{ eventId: "event-summit", action: "mark_live" }`
- Actual runtime state: no matching event was observed before timeout.

## Root cause

The test route uses the public/demo alias `/app/events/demo/run-of-show`, while the canonical seeded event ID is `event-summit`.

The app already normalized `demo` for event lookup in some read paths, but the run-of-show write path did not normalize the submitted event ID before writing runtime events. The button could render on the demo route, but the transactional assertion correctly expected canonical event persistence.

A second issue hid this problem: the server action swallowed runtime-store write errors with `.catch(() => undefined)`, which is not acceptable for transactional proof.

## Fix

- Normalize `demo` to `event-summit` inside `recordRunOfShowControlAction` before writing runtime state.
- Normalize `demo` inside `getRunOfShowForEvent` so the producer controls receive real seeded segments on demo routes.
- Remove the silent catch around `appendRunOfShowEvent`; the action must fail loudly if the runtime store cannot write.
- Revalidate both canonical and alias routes when an alias is used.

## Status

Structurally checked. Local headed Playwright must rerun against this ZIP to prove the transactional suite.
