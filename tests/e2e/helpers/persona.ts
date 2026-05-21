import fs from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";

function runtimePath() {
  return process.env.AGENCY_EVENT_OS_RUNTIME_STORE_PATH || path.join(process.cwd(), ".runtime-data", "local-playwright-runtime.json");
}

function readRuntimeSnapshot() {
  const file = runtimePath();
  if (!fs.existsSync(file)) {
    return {
      attendeeProfiles: [],
      attendeeSessions: [],
      attendeeAgendaIntents: [],
      analyticsEvents: [],
      supportRequests: [],
      helpRequests: [],
      networkingQueue: [],
    };
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeRuntimeSnapshot(snapshot: any) {
  const file = runtimePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(snapshot, null, 2)}
`, "utf8");
}

function seedRegisteredAttendee(eventId: string) {
  const sessionId = "e2e-session";
  const attendeeId = `e2e-attendee-${eventId}`;
  const snapshot = readRuntimeSnapshot();
  snapshot.attendeeProfiles = snapshot.attendeeProfiles || [];
  snapshot.attendeeSessions = snapshot.attendeeSessions || [];

  if (!snapshot.attendeeProfiles.some((profile: any) => profile.eventId === eventId && profile.attendeeId === attendeeId)) {
    snapshot.attendeeProfiles.push({
      attendeeId,
      eventId,
      name: "E2E Registered Attendee",
      email: `e2e-${eventId}@example.com`,
      company: "E2E Company",
      title: "Founder",
      status: "active",
      networkingOptIn: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  if (!snapshot.attendeeSessions.some((session: any) => session.eventId === eventId && session.sessionId === sessionId)) {
    snapshot.attendeeSessions.push({
      sessionId,
      attendeeId,
      eventId,
      role: "attendee",
      status: "active",
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      lastSeenAt: new Date().toISOString(),
    });
  }

  writeRuntimeSnapshot(snapshot);
}

export type PersonaId = "public_visitor" | "registered_attendee" | "speaker" | "sponsor" | "client_vip" | "crew" | "operator" | "admin_owner" | "future_self_serve_customer";

export async function asPublicVisitor(page: Page) {
  await page.context().clearCookies();
  return { id: "public_visitor" as const };
}

export async function asRegisteredAttendee(page: Page, eventId = "demo") {
  seedRegisteredAttendee(eventId);
  await page.context().addCookies([{ name: "wpl_attendee_session", value: `${eventId}.e2e-session`, url: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000", httpOnly: true, sameSite: "Lax" }]);
  return { id: "registered_attendee" as const, eventId };
}

export function asSpeaker() { return { id: "speaker" as const }; }
export function asSponsor() { return { id: "sponsor" as const }; }
export function asCrew() { return { id: "crew" as const }; }
export function asOperator() { return { id: "operator" as const }; }
export function asAdmin() { return { id: "admin_owner" as const }; }
