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
