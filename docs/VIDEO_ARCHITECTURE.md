# Video Architecture

## Current State

Video is intentionally seededed.

## Provider Abstraction

The schema and types include:

- `VideoRoom`
- `VideoRoomType`
- `VideoRoomStatus`
- `provider`
- `providerRoomId`

## Supported Providers

- LiveKit
- Daily
- Agora
- Mux
- Twilio
- Other

## Rule

Do not hard-code provider-specific behavior directly into UI components.
