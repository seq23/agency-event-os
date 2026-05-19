# Audit Logs

## Current Status

Audit logging is scaffolded with a seeded service.

Files:

- `services/audit/auditTypes.ts`
- `services/audit/createAuditLog.ts`
- `lib/audit/createAuditLog.ts`

## Required Audited Actions

- Event created
- Event status changed
- Role assigned
- Role revoked
- Client approval requested
- Client approved item
- Client requested changes
- Run-of-show segment created
- Run-of-show segment edited
- Run-of-show segment deleted
- Speaker readiness changed
- Sponsor booth changed
- Contractor assigned
- Vendor assigned
- Asset uploaded
- Asset approved
- Production note added
- Incident logged
- Report exported
- Video room created
- Networking report submitted

## Future Persistence

`createAuditLog()` should become a server-only insert into `audit_logs`.
