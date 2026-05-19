# White-Label Backup Rooms

## Purpose

White-label backup rooms give the production team a controlled continuity option if a room, device, browser, or provider issue cannot be recovered fast enough inside the primary venue.

This is not a generic unmanaged external-call pattern.

The user-facing framing should remain:

- Backup Room
- Client Event Backup Room
- West Peek Live! Backup Room
- [Client Name] Continuity Room

## Supported Provider Options

- white-label video provider
- Google Meet
- custom embedded provider
- phone bridge

## Required Configuration

Each event may eventually define:

- backup provider
- backup label
- backup URL
- producer approval required
- rooms covered
- access instructions
- client-visible language
- incident logging behavior

## Activation Rule

App-side recovery always happens first:

1. Retry room join.
2. Re-check media permissions.
3. Switch camera/microphone.
4. Switch network.
5. Move to backup in-platform room.
6. Open white-label backup provider only after producer approval.

## Product Rule

The app should help WPP avoid the embarrassment and operational damage of an unmanaged external fallback. If a backup room is required, it should feel intentional, branded, prepared, and controlled.
