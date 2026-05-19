# West Peek Live! Mobile + Tablet QA

## Required viewport checks

Test these widths before deployment:

- 375px phone
- 390px phone
- 430px large phone
- 768px tablet
- 1024px tablet
- 1280px laptop
- 1440px desktop

## App shell checks

- Sidebar becomes usable horizontal mobile navigation.
- Topbar stacks cleanly on small screens.
- Main content uses mobile padding.
- No route requires horizontal scrolling for primary actions.
- Cards stack into one column on phone.
- Buttons are easy to tap.

## Venue checks

Test:

- Lobby
- Main Stage
- Sessions
- Session room
- Breakouts
- Expo
- Sponsor booth
- Networking
- People
- Replay
- Help

A mobile attendee must be able to:

- enter the venue
- move between surfaces
- find the main stage
- open sessions
- find help
- browse sponsor booths
- use networking surfaces
- access replay

## Tablet checks

A tablet producer must be able to:

- read command-center cards
- use report controls
- review tables
- use email/test panels
- move between live-event surfaces
- operate without clipped controls

## LiveKit checks

- Join controls remain visible.
- Prejoin state is readable.
- Disconnect/reconnect state is readable.
- Fallback room links are visible.
- Participant/video containers do not overflow the viewport.

## Forms and tables

- Inputs are full-width on phones.
- Table content scrolls only inside the table region when needed.
- Form labels remain visible.
- Buttons do not collapse into unreadable widths.
