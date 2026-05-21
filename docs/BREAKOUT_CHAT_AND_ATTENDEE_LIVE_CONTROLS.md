# Breakout Chat and Attendee Live Participation Controls

The venue now distinguishes:

- Stage viewer: attendee watches the programmed stage stream.
- Live participant: attendee publishes camera/mic into a stage, session, or breakout room.

Main stage attendee publishing is request/approval based and off by default. Breakout publishing defaults to enabled for camera/mic but can be locked by crew.

Room chat is scoped by eventId + roomKind + roomId:

- `main_stage/main-stage`
- `breakout/<roomId>`
- `session/<sessionId>`

Crew controls include:

- main-stage camera/mic request toggle
- breakout camera/mic toggles
- screen-share toggle
- emergency publishing disable
- per-attendee approval/revoke path

Failover safety:

When the main stage enters Daily fallback because of a StreamYard or LiveKit failure, main-stage attendee publishing is disabled by default so producers are not managing new live guests during an emergency switch.
