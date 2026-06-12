<!-- ARCHIVED: superseded by active runbooks / ledgers. See docs/archive/ARCHIVE_INDEX.md and docs/DOCS_CONSOLIDATION_MAP.md. -->

# StreamYard → LiveKit Ingress → Daily Failover Architecture

Primary production path: StreamYard Custom RTMP → LiveKit Ingress → LiveKit room → attendee stage player.

Fallback path: Daily private fallback room/token → attendee stage player.

The app tracks two failure planes rather than pretending all video failures are equal:

- StreamYard feed failure: LiveKit may still be healthy, but the program feed stopped. Default action: switch attendees to Daily while production restores StreamYard.
- LiveKit distribution failure: StreamYard may still be usable, but attendee delivery is degraded. Default action: keep StreamYard running and switch attendees to Daily. Only abandon StreamYard if the producer confirms.
- Total primary failure: production and attendees move to Daily.

Producer UX requirements implemented structurally:

- Operator-only RTMP URL and Stream Key fields.
- Click-to-copy controls.
- Stream status badge.
- Last webhook event.
- Failure plane and recommendation copy.
- Manual buttons for switching attendees to Daily, moving production to Daily, and marking show ended.

Attendee UX requirements implemented structurally:

- Pre-stream card instead of a black screen.
- Four-second initial buffer before treating LiveKit connection failure as a fallback event.
- Smooth switching overlay for Daily fallback.
- Local volume/mute preference persistence.
- Producer/operator monitor defaults muted to avoid delayed StreamYard feedback.
- Refresh-safe state hydration from `/api/video/stage-stream-state`.

Security requirements:

- Stream keys are only exposed through operator/testing surfaces.
- Public venue components do not import or render `livekitStreamKey`.
- Daily stage fallback is tokenized through `/api/video/daily-stage-token`.
- Attendee LiveKit tokens remain subscribe-only unless crew controls approve publishing.
