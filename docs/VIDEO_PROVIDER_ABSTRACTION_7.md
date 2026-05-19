# Phase 7 — Video Provider Abstraction

## Purpose

Phase 7 creates a provider-neutral video layer before any real LiveKit, Daily, Agora, Twilio, or Zoom SDK implementation is added.

## Provider Boundary

The app now has a `VideoProvider` interface with methods for:

- creating rooms
- closing rooms
- issuing participant tokens
- checking room health
- starting recordings
- stopping recordings

## Room Types

Supported room types:

- main stage
- green room
- backstage
- breakout
- sponsor booth
- rehearsal
- testing
- speed networking
- white-label backup

## Current Provider

The only implemented provider is `SeededVideoProvider`.

This is intentional. Real provider setup belongs in Phase 8.

## Manual Phase 8 Decision

Recommended primary provider: LiveKit.

White-label backup order is LiveKit primary, Daily automatic in-platform fallback, then Zoom and Google Meet managed emergency fallbacks. Daily does not require producer approval when DAILY_FALLBACK_ENABLED=true; Zoom and Google Meet remain producer-controlled escalation paths.

## Not Included

- real LiveKit keys
- real Daily keys
- real Zoom SDK
- real recording storage
- real attendee room UI
