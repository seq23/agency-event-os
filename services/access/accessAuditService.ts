import { createHash } from "crypto";
import { createAuditLog } from "@/services/audit/createAuditLog";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { V4AccessKind } from "@/types/v4";

export type V5AccessAuditStatus = "access_attempted" | "access_granted" | "access_denied" | "access_expired" | "access_revoked";

function hashOptional(value: string | undefined) {
  if (!value) return undefined;
  return createHash("sha256").update(value).digest("hex");
}

export async function logAccessAttempt(input: {
  status: V5AccessAuditStatus;
  accessKind: V4AccessKind;
  eventId?: string;
  role?: string;
  route?: string;
  reason?: string;
  ip?: string;
  userAgent?: string;
  ipHash?: string;
  userAgentHash?: string;
}) {
  const createdAt = new Date().toISOString();
  const runtimeEvent = await getRuntimeStore().appendAccessAttempt({
    id: `access-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    status: input.status,
    accessKind: input.accessKind,
    eventId: input.eventId,
    role: input.role,
    route: input.route,
    reason: input.reason,
    ipHash: input.ipHash || hashOptional(input.ip),
    userAgentHash: input.userAgentHash || hashOptional(input.userAgent),
    createdAt,
  });

  await createAuditLog({
    agencyId: "west-peek-live",
    eventId: input.eventId,
    actorUserId: "system-access-gate",
    actorRole: input.role || input.accessKind,
    action: input.status,
    resourceType: "access_gate",
    resourceId: input.route || input.eventId || input.accessKind,
    newValue: {
      accessKind: input.accessKind,
      role: input.role,
      route: input.route,
      reason: input.reason,
      ipHash: runtimeEvent.ipHash,
      userAgentHash: runtimeEvent.userAgentHash,
    },
    visibility: "system_only",
  });

  return runtimeEvent;
}
