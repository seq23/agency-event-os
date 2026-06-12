# Validation Operations — Agency Event OS

Status: ACTIVE  
Date: 2026-06-11

## Canonical command

```bash
npm run validate:everything
```

Writes:

- `reports/validate-everything.md`
- `reports/validate-everything.json`
- `logs/validate-everything-*.log`

## Static CI tier

```bash
npm run validate:everything -- --tier=1
```

## Full local tier

```bash
npm run validate:everything -- --tier=2
```

## Postdeploy tier

```bash
POSTDEPLOY_BASE_URL="https://westpeek.live" npm run validate:everything -- --tier=3 --postdeploy
```

## Real provider tier

```bash
STREAMYARD_REAL_PROVIDER_SMOKE=1 POSTDEPLOY_BASE_URL="https://westpeek.live" npm run validate:everything -- --tier=3 --postdeploy --real-provider
# Before running, export LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_WEBHOOK_SECRET, and V5_ACCESS_COOKIE_SECRET from the secure vault.
```

Without the real provider lane, report:

`STREAMYARD → LIVEKIT REAL MEDIA FLOW: UNPROVEN`.
