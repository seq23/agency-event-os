# Video Architecture

## Current State

Video is intentionally mocked.

## Provider Abstraction

The schema and types include:

- `VideoRoom`
- `VideoRoomType`
- `VideoRoomStatus`
- `provider`
- `providerRoomId`

## Supported Future Providers

- LiveKit
- Daily
- Agora
- Mux
- Twilio
- Other

## Rule

Do not hard-code provider-specific behavior directly into UI components.
