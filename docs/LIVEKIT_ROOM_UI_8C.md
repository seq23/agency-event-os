# Phase 8C — LiveKit Room UI and Token Flow

## Added

- LiveKit room shell component
- Real LiveKit client component using `@livekit/components-react` and `livekit-client`
- Main stage room route
- Green room route
- Backstage route
- Testing room route
- Server route for issuing LiveKit room tokens
- Server action for issuing LiveKit room tokens
- Room UI state types
- Join session and UI state migration

## Not Yet Included

- Live chat
- Egress/recording
- Production deployment env wiring

## Rule

Tokens are issued server-side. LiveKit API secrets must never be exposed to browser code.
