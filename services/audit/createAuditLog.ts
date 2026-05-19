import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { AuditLog } from "@/types/core";
import type { CreateAuditLogInput } from "./auditTypes";

export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLog> {
  const log: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
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

  await getRuntimeStore().appendAuditLog(log);
  return log;
}
