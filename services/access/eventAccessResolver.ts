import { destinationForRole, findEventIndexRecord, getEventAccessConfig } from "@/services/events/eventConfigRepository";
import type { V4AccessResolution, V4CrewRole } from "@/types/v4";

function readEnvCode(envKey: string) {
  return process.env[envKey]?.trim();
}

export async function resolveSpecialGuestAccess(eventCode: string | undefined, roleCode: string | undefined): Promise<V4AccessResolution> {
  const normalizedRoleCode = roleCode?.trim();
  if (!eventCode?.trim() || !normalizedRoleCode) {
    return { ok: false, accessKind: "special_guest", reason: "missing_code", message: "Enter both the event code and your role access code." };
  }

  const eventRecord = findEventIndexRecord(eventCode);
  if (!eventRecord) return { ok: false, accessKind: "special_guest", reason: "invalid_event", message: "We could not match that event code." };

  const accessConfig = getEventAccessConfig(eventRecord.slug);
  if (!accessConfig || accessConfig.eventId !== eventRecord.eventId) {
    return { ok: false, accessKind: "special_guest", eventId: eventRecord.eventId, reason: "invalid_event", message: "This event is not configured for special guest access." };
  }

  const matchingRole = accessConfig.specialGuestCodes.find((item) => {
    const expected = readEnvCode(item.envKey);
    return Boolean(expected && expected === normalizedRoleCode);
  });

  if (!matchingRole) {
    return { ok: false, accessKind: "special_guest", eventId: eventRecord.eventId, reason: "invalid_role_code", message: "That access code is not valid for this event." };
  }

  return {
    ok: true,
    accessKind: "special_guest",
    eventId: eventRecord.eventId,
    role: matchingRole.role,
    destination: destinationForRole(matchingRole.role, eventRecord.eventId),
    message: "Access granted.",
  };
}

export function resolveCrewAccess(eventCode: string | undefined, crewRole: V4CrewRole = "crew"): V4AccessResolution {
  if (!eventCode?.trim()) {
    return { ok: true, accessKind: "crew", role: crewRole, destination: "/crew/events/demo", message: "Crew access granted." };
  }
  const eventRecord = findEventIndexRecord(eventCode);
  if (!eventRecord) {
    return { ok: false, accessKind: "crew", reason: "invalid_event", message: "That event code is not valid for crew routing." };
  }
  return {
    ok: true,
    accessKind: "crew",
    eventId: eventRecord.eventId,
    role: crewRole,
    destination: `/crew/events/${eventRecord.eventId}`,
    message: "Crew access granted.",
  };
}
