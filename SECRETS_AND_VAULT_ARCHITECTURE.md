# Secrets and Vault Architecture

**Repo:** `agency-event-os`  
**Policy:** `vault_required`

Real values remain outside source control. The repo stores names, examples, validation, materialize/cleanup hooks, ownership, and severity. Temporary plaintext is restrictive, short-lived, redacted, and removed on failure.
