import type { AuditLog } from "@/types/core";
import type { CreateAuditLogInput } from "./auditTypes";

/**
 * Mock audit log creator.
 *
 * Future Supabase implementation should insert into audit_logs from a server-only service.
 */
export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLog> {
  return {
    id: `audit-${Date.now()}`,
    agencyId: input.agencyId,
    clientId: input.clientId,
    eventId: input.eventId,
    actorUserId: input.actorUserId,
    actorRole: input.actorRole,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId,
    createdAt: new Date().toISOString(),
    visibility: input.visibility || "internal_agency",
  };
}
