# West Peek Live! Deployment Env Checklist

## Required env vars

```txt
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_REPLY_TO=
AUTH_SESSION_COOKIE_NAME=
VIDEO_PROVIDER=livekit
```

## Expected values

```txt
EMAIL_FROM="Scooter (CEO of West Peek) <notifications@events.westpeek.live>"
EMAIL_REPLY_TO=hello@westpeek.live
VIDEO_PROVIDER=livekit
```

## Rules

- Never commit `.env.local`.
- Deployment env vars must be added to the hosting provider separately.
- Local env backup does not configure production.
- Service role key must remain server-side.
- `LIVEKIT_URL` should start with `wss://`.
- `RESEND_API_KEY` should start with `re_`.

## Verification command

Run locally after restoring `.env.local`:

```zsh
python3 - <<'PY'
from pathlib import Path

path = Path(".env.local")
required = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "LIVEKIT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "EMAIL_REPLY_TO",
]
text = path.read_text()
missing = [key for key in required if not any(line.startswith(key + "=") for line in text.splitlines())]
print("missing:", missing)
print("env_check:", "OK" if not missing else "NEEDS_FIX")
PY
```


## Optional white-label fallback video env vars

Required only if embedded Zoom fallback is enabled:

```txt
ZOOM_MEETING_SDK_KEY=
ZOOM_MEETING_SDK_SECRET=
NEXT_PUBLIC_ENABLE_ZOOM_EMBEDDED_FALLBACK=true
```

Emergency managed fallback only:

```txt
GOOGLE_MEET_MANAGED_FALLBACK_URL=
```

## Canonical Deployment Authority

- GitHub repo: `agency-event-os`
- Framework: `Next.js`
- Adapter: `OpenNext for Cloudflare`
- Host: `Cloudflare Workers / Cloudflare platform`
- App domain: `westpeek.live`
- Email sending domain: `events.westpeek.live`
- Outbound sender: `notifications@events.westpeek.live`
- Reply-to: `hello@westpeek.live`

### Domain Separation Rule

`westpeek.live` is the West Peek Live! app and public product domain.

`events.westpeek.live` is reserved for Resend email sending infrastructure only.

Do not deploy the app to `events.westpeek.live` unless this deployment authority document is explicitly changed.

