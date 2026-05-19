import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEnv, getV5AccessCookieNames, getV5AccessCookieSecret } from "@/lib/env";
import { createV5AccessCookie, getV5CookieOptions } from "@/lib/auth/productionAccess";
import { resolveSpecialGuestAccess } from "@/services/access/eventAccessResolver";
import { logAccessAttempt } from "@/services/access/accessAuditService";
import type { V4SpecialGuestRole } from "@/types/v4";

async function enterGuest(formData: FormData) {
  "use server";
  const eventCode = String(formData.get("eventCode") ?? "");
  const roleCode = String(formData.get("roleCode") ?? "");
  const access = await resolveSpecialGuestAccess(eventCode, roleCode);
  if (!access.ok || !access.destination || !access.eventId || !access.role) {
    await logAccessAttempt({ status: "access_denied", accessKind: "special_guest", eventId: access.eventId, role: String(access.role || "unknown"), reason: access.reason, route: "/production-access/special-guest" });
    redirect(`/production-access/special-guest?error=${access.reason ?? "invalid"}`);
  }
  const env = getEnv();
  const { specialGuestCookieName } = getV5AccessCookieNames(env);
  const role = access.role as V4SpecialGuestRole;
  await logAccessAttempt({ status: "access_granted", accessKind: "special_guest", eventId: access.eventId, role, route: access.destination });
  const cookie = await createV5AccessCookie({ kind: "special_guest", eventId: access.eventId, role, issuedAt: Date.now(), expiresAt: Date.now() + 1000 * 60 * 60 * 12 }, getV5AccessCookieSecret(env));
  cookies().set(specialGuestCookieName, cookie, getV5CookieOptions(60 * 60 * 12));
  redirect(access.destination);
}

export default function SpecialGuestAccessPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-10 text-brand-black sm:px-8 lg:px-12">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Special guest gate</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Client, speaker, sponsor, crew-lite, or VIP</h1>
        <p className="mt-4 text-sm leading-6 text-brand-muted">Enter the event code and your role-scoped access code from production. Raw access codes live only in environment settings, never in repo config or source.</p>
        <form action={enterGuest} className="mt-6 space-y-3">
          <input name="eventCode" aria-label="Event code" className="min-h-12 w-full rounded-full border border-brand-line px-5 text-sm" />
          <input name="roleCode" aria-label="Role access code" className="min-h-12 w-full rounded-full border border-brand-line px-5 text-sm" />
          <button className="w-full rounded-full bg-brand-black px-6 py-3 text-sm font-bold text-white">Continue</button>
        </form>
        {searchParams?.error ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800">Access was not granted. Check the event code and role code.</p> : null}
      </section>
    </main>
  );
}
