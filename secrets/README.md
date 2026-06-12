# Secrets Vault Policy

This repo does not commit plaintext `.env.local`, plaintext backups, or real provider secrets.

Agency Event OS now uses an **external private env restore model**. The baseline ZIP does not need to contain `secrets/agency-event-os.env.local.gpg`.

Approved local-only private sources:

- `AGENCY_EVENT_OS_ENV_GPG_PATH=/absolute/path/to/agency-event-os.env.local.gpg`
- `AGENCY_EVENT_OS_ENV_LOCAL_PATH=/absolute/path/to/.env.local.backup`
- `AGENCY_EVENT_OS_ENV_BACKUP=/absolute/path/to/.env.local.backup`
- `~/.config/agency-event-os/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.gpg`
- `~/agency-event-os.env.local.backup`

Restore for a single command with:

```bash
npm run test:everything:tier3:with-env
```

The wrapper restores `.env.local`, runs the command, and removes `.env.local` again if the wrapper created it.

The passphrase and/or private backup path must live outside the repo in the owner password manager. Do not commit raw secret values.
