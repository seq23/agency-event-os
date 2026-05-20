import type { V5AccessCookiePayload } from "@/lib/auth/productionAccess";
import type { V4CrewRole, V4SpecialGuestRole } from "@/types/v4";

const roleRoutePrefixes: Record<V4SpecialGuestRole, readonly string[]> = {
  client: ["/client/"],
  speaker: ["/speaker/events/"],
  sponsor: ["/sponsor/events/"],
  crew_lite: ["/crew/events/"],
  vip: ["/venue/"],
};

const crewActionPermissions: Record<V4CrewRole, readonly string[]> = {
  crew: ["view_event", "view_run_of_show"],
  executive_producer: ["view_event", "publish_event", "deploy_event", "switch_video_fallback", "archive_event", "view_audit"],
  producer: ["view_event", "publish_event", "view_audit", "log_incident"],
  technical_director: ["view_event", "switch_video_fallback", "clear_video_fallback", "run_video_health_check"],
  show_caller: ["view_event", "advance_run_of_show", "delay_segment", "log_incident"],
  moderator: ["view_event", "moderate_session", "log_incident"],
  va: ["view_event", "edit_draft_setup", "mark_ready_for_review"],
  support: ["view_event", "view_support", "log_incident"],
};

function segments(pathname: string) {
  return pathname.split("?")[0].split("/").filter(Boolean);
}

export function eventIdFromPath(pathname: string): string | undefined {
  const parts = segments(pathname);
  const eventsIndex = parts.indexOf("events");
  if (eventsIndex >= 0 && parts[eventsIndex + 1]) return parts[eventsIndex + 1];
  if (parts[0] === "venue" && parts[1]) return parts[1];
  if (parts[0] === "admin" && parts[1] === "testing" && parts[2]) return parts[2];
  return undefined;
}

export function pathIncludesEvent(pathname: string, eventId: string) {
  return eventIdFromPath(pathname) === eventId;
}

export function canCrewAccessPath(pathname: string, payload?: V5AccessCookiePayload) {
  if (!payload || payload.kind !== "crew") return false;
  if (!pathname.startsWith("/app") && !pathname.startsWith("/crew") && !pathname.startsWith("/admin/testing")) return false;
  const pathEventId = eventIdFromPath(pathname);
  if (payload.eventId) return pathEventId === payload.eventId;
  return true;
}

export function canSpecialGuestAccessPath(pathname: string, payload?: V5AccessCookiePayload) {
  if (!payload || payload.kind !== "special_guest" || !payload.eventId || !payload.role) return false;
  const allowedPrefixes = roleRoutePrefixes[payload.role];
  if (!allowedPrefixes?.some((prefix) => pathname.startsWith(prefix))) return false;
  const pathEventId = eventIdFromPath(pathname);
  if (!pathEventId) return false;
  return pathEventId === payload.eventId;
}

export function canPerformCrewAction(payload: V5AccessCookiePayload | undefined, action: string, eventId?: string) {
  if (!payload || payload.kind !== "crew") return false;
  if (eventId && payload.eventId && payload.eventId !== eventId) return false;
  const role = (payload.role || "crew") as V4CrewRole;
  return crewActionPermissions[role]?.includes(action) ?? false;
}

export function assertCanPerformCrewAction(payload: V5AccessCookiePayload | undefined, action: string, eventId?: string) {
  if (!canPerformCrewAction(payload, action, eventId)) throw new Error(`Forbidden crew action: ${action}`);
}

export function specialGuestEntryPathFor(pathname: string) {
  return pathname.startsWith("/app") ? "/production-access/crew" : "/production-access/special-guest";
}
