import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCrewAccessPassword, getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { createV5AccessCookie, getV5CookieOptions } from "@/lib/auth/productionAccess";
import { resolveCrewAccess } from "@/services/access/eventAccessResolver";
import { logAccessAttempt } from "@/services/access/accessAuditService";
import type { V4CrewRole } from "@/types/v4";

const allowedCrewRoles: V4CrewRole[] = ["executive_producer", "producer", "technical_director", "show_caller", "moderator", "va", "support"];

function normalizeCrewRole(value: FormDataEntryValue | null): V4CrewRole {
  const role = String(value || "producer");
  if (allowedCrewRoles.includes(role as V4CrewRole)) return role as V4CrewRole;
  return "producer";
}

async function enterCrew(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const eventCode = String(formData.get("eventCode") ?? "");
  const crewRole = normalizeCrewRole(formData.get("crewRole"));
  const env = getEnv();

  if (!password || password !== getCrewAccessPassword(env)) {
    await logAccessAttempt({ status: "access_denied", accessKind: "crew", role: crewRole, reason: "invalid_password", route: "/production-access/crew" });
    redirect("/production-access/crew?error=invalid");
  }

  const access = resolveCrewAccess(eventCode || undefined, crewRole);
  if (!access.ok) {
    await logAccessAttempt({ status: "access_denied", accessKind: "crew", eventId: access.eventId, role: crewRole, reason: access.reason, route: "/production-access/crew" });
    redirect("/production-access/crew?error=invalid_event");
  }
  await logAccessAttempt({ status: "access_granted", accessKind: "crew", eventId: access.eventId, role: access.role || crewRole, route: access.destination });
  const { crewCookieName } = getV5AccessCookieNames(env);
  const cookie = await createV5AccessCookie({ kind: "crew", eventId: access.eventId, role: crewRole, issuedAt: Date.now(), expiresAt: Date.now() + 1000 * 60 * 60 * 8 }, getV5AccessCookieSecret(env));
  cookies().set(crewCookieName, cookie, getV5CookieOptions(60 * 60 * 8));
  redirect(access.destination ?? "/app/events");
}

export default function CrewAccessPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-10 text-brand-black sm:px-8 lg:px-12">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Crew gate</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Production team access</h1>
        <p className="mt-4 text-sm leading-6 text-brand-muted">Use the shared crew password for MVP access. Select your production role so server actions can enforce capability-specific permissions.</p>
        <form action={enterCrew} className="mt-6 space-y-3">
          <input name="password" type="password" aria-label="Crew password" className="min-h-12 w-full rounded-full border border-brand-line px-5 text-sm" />
          <input name="eventCode" aria-label="Optional event code" className="min-h-12 w-full rounded-full border border-brand-line px-5 text-sm" />
          <select name="crewRole" aria-label="Crew role" defaultValue="producer" className="min-h-12 w-full rounded-full border border-brand-line px-5 text-sm">
            <option value="executive_producer">Executive Producer</option>
            <option value="producer">Producer</option>
            <option value="technical_director">Technical Director</option>
            <option value="show_caller">Show Caller</option>
            <option value="moderator">Moderator</option>
            <option value="va">VA / Production Assistant</option>
            <option value="support">Support</option>
          </select>
          <button className="w-full rounded-full bg-brand-black px-6 py-3 text-sm font-bold text-white">Enter production</button>
        </form>
        {searchParams?.error ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">Access was not granted. Check the password, event code, and role selection.</p> : null}
      </section>
    </main>
  );
}
