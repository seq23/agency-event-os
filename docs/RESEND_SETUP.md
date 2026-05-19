# Resend Setup

## Current Status

Email is scaffolded behind an abstraction.

Files:

- `services/email/EmailProvider.ts`
- `services/email/SeededEmailProvider.ts`
- `services/email/ResendEmailProvider.ts`
- `services/email/emailService.ts`

## Environment Variables

```txt
RESEND_API_KEY=
EMAIL_FROM=
```

## Behavior

If Resend is configured, the app can use `ResendEmailProvider`.

If Resend is not configured, the app uses `SeededEmailProvider`.

## First Email Use Cases

- Approval requested
- Client approved item
- Client requested changes
- Speaker asset reminder
- Sponsor asset reminder
- Contractor assignment
- Report ready
