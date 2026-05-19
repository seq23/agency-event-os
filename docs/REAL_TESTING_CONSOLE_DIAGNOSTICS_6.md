# Phase 6 — Real Testing Console Diagnostics

## Purpose

Move the Testing Console from seeded-only status cards to real browser-side diagnostics.

## Included

- Camera permission check
- Camera preview
- Microphone permission check
- Microphone input meter
- Speaker test tone
- Browser compatibility check
- Network quality estimate
- Producer-facing readiness summary
- Testing incident handoff preview
- Optional diagnostic run/result persistence migration

## Boundary

This phase does not integrate LiveKit, Daily, Agora, Twilio, Mux, Zoom SDK, or any real video room provider.

The browser diagnostics prove that the participant device/browser layer is safe before provider-specific rooms are introduced in Phase 7.

## Manual SQL

Run migration `0005_testing_diagnostics_runs.sql` before relying on stored diagnostic run history.

## Producer Rule

A participant with blocked camera, blocked microphone, critical network quality, or failed speaker output is not production-ready until the producer resolves the diagnostic issue or explicitly activates a white-label backup room.
