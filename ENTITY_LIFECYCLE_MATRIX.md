# Entity Lifecycle Matrix

| Entity | Create | View | Edit/Update | Approve/Reject | Archive/Delete/Revoke | Restore | Readback | Refresh/Re-entry | Permission Owner |
|---|---|---|---|---|---|---|---|---|---|
| event | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| client | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| contractor | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| vendor | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| speaker | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| sponsor | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| attendee | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| crew assignment | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| run-of-show | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| task | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| approval | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| asset | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| communication | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| incident | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| venue/session | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| provider room/ingress | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| access session | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| template | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |
| report | REQUIRED | REQUIRED | REQUIRED | product-specific | archive/revoke/soft-delete unless law permits hard delete | where supported | REQUIRED | REQUIRED | role/consent matrix |

No durable entity may be trapped. Mutation success requires fresh readback and refresh/re-entry. Cleanup targets exact fixture IDs only.
