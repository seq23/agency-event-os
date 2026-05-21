import { cookies } from "next/headers";
import { randomId } from "@/lib/security/portableCrypto";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { AttendeeProfile } from "@/types/attendeeRegistration";
import type { AttendeeSession } from "@/types/attendeeSession";

export const ATTENDEE_SESSION_COOKIE = "wpl_attendee_session";
const SESSION_DAYS = 14;

function cookieValue(eventId: string, sessionId: string) {
  return `${eventId}.${sessionId}`;
}

function parseCookie(value?: string) {
  if (!value) return undefined;
  const firstDot = value.indexOf(".");
  if (firstDot < 1) return undefined;
  return { eventId: value.slice(0, firstDot), sessionId: value.slice(firstDot + 1) };
}

export async function createAttendeeSession(profile: AttendeeProfile) {
  const now = Date.now();
  const session: AttendeeSession = {
    sessionId: randomId("attendee-session"),
    attendeeId: profile.attendeeId,
    eventId: profile.eventId,
    role: "attendee",
    status: "active",
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
  await getRuntimeStore().upsertAttendeeSession(session);
  cookies().set(ATTENDEE_SESSION_COOKIE, cookieValue(session.eventId, session.sessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return session;
}

export async function getCurrentAttendeeSession(eventId: string) {
  const parsed = parseCookie(cookies().get(ATTENDEE_SESSION_COOKIE)?.value);
  if (!parsed || parsed.eventId !== eventId) return undefined;
  const session = await getRuntimeStore().getAttendeeSession(eventId, parsed.sessionId).catch(() => undefined);
  if (!session || session.status !== "active") return undefined;
  if (new Date(session.expiresAt).getTime() < Date.now()) return undefined;
  return session;
}

export async function getCurrentAttendeeProfile(eventId: string) {
  const session = await getCurrentAttendeeSession(eventId);
  if (!session) return undefined;
  const profile = await getRuntimeStore().getAttendeeProfile(eventId, session.attendeeId).catch(() => undefined);
  if (!profile || profile.status !== "active") return undefined;
  return profile;
}

export async function getCurrentAttendeeIdentity(eventId: string) {
  const profile = await getCurrentAttendeeProfile(eventId);
  if (!profile) return undefined;
  return { attendeeId: profile.attendeeId, displayName: profile.name, company: profile.company, title: profile.title, role: "attendee" as const };
}
