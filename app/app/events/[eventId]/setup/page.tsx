import { cookies } from "next/headers";
import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { BasicsSetupPanel } from "@/components/events/setup/SetupPanels";
import { EVENT_SETUP_DRAFT_COOKIE_NAME, decodeEventSetupDraftCookie, getEventSetupDraftById, getEventSetupDraftRoleCodes } from "@/services/events/eventDraftStore";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default async function EventSetupPage({ params, searchParams }: { params: Promise<{ eventId: string }>; searchParams?: Promise<{ draftId?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const config = getEventConfigPackage(resolvedParams.eventId);
  const draftFromStore = resolvedSearchParams?.draftId ? getEventSetupDraftById(resolvedSearchParams.draftId) : undefined;
  const draftFromCookie = decodeEventSetupDraftCookie((await cookies()).get(EVENT_SETUP_DRAFT_COOKIE_NAME)?.value);
  const draft = draftFromStore || (draftFromCookie?.id === resolvedSearchParams?.draftId ? draftFromCookie : undefined);
  const generatedRoleCodes = draft ? getEventSetupDraftRoleCodes(draft.eventCode) : undefined;
  return (
    <EventSetupShell eventId={resolvedParams.eventId} active="basics" eyebrow="Setup · Basics" title="Event basics">
      {draft ? (
        <section className="mb-6 rounded-3xl border border-brand-line bg-white p-5 shadow-sm" data-testid="event-setup-draft-summary">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Setup draft created</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">{draft.eventName}</h2>
          <div className="mt-4 grid gap-3 text-sm text-brand-muted md:grid-cols-2">
            <p><span className="font-black text-brand-black">Client / organizer:</span> {draft.clientName}</p>
            <p><span className="font-black text-brand-black">Event code:</span> {draft.eventCode}</p>
            <p><span className="font-black text-brand-black">Event date:</span> {draft.eventDate || "Not set"}</p>
            <p><span className="font-black text-brand-black">Audience:</span> {draft.audience}</p>
            <p><span className="font-black text-brand-black">Event type:</span> {draft.eventType}</p>
            <p><span className="font-black text-brand-black">Video plan:</span> {draft.productionFeed || "StreamYard"} production feed/source; {draft.primaryVideo} embedded distribution; {draft.fallbackVideo} fallback</p>
          </div>

          {generatedRoleCodes ? (
            <div className="mt-5 rounded-3xl bg-brand-ash p-5" data-testid="generated-event-role-codes">
              <p className="text-sm font-black text-brand-black">Generated event-specific role codes</p>
              <p className="mt-1 text-xs text-brand-muted">These are scoped to this newly-created event for local gauntlet/proof use. Store production codes in the private env backup and platform secret store before a real client event.</p>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><dt className="font-black text-brand-black">Client</dt><dd data-testid="generated-client-code">{generatedRoleCodes.client}</dd></div>
                <div><dt className="font-black text-brand-black">Speaker</dt><dd data-testid="generated-speaker-code">{generatedRoleCodes.speaker}</dd></div>
                <div><dt className="font-black text-brand-black">Sponsor</dt><dd data-testid="generated-sponsor-code">{generatedRoleCodes.sponsor}</dd></div>
                <div><dt className="font-black text-brand-black">VIP</dt><dd data-testid="generated-vip-code">{generatedRoleCodes.vip}</dd></div>
                <div><dt className="font-black text-brand-black">Crew Lite</dt><dd data-testid="generated-crew-lite-code">{generatedRoleCodes.crew_lite}</dd></div>
              </dl>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="rounded-full bg-brand-black px-4 py-2 text-sm font-bold text-white" href={`/venue/${resolvedParams.eventId}/lobby`}>Preview event</a>
            <a className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold" href={`/app/events/${resolvedParams.eventId}/preview`}>Review setup preview</a>
            <a className="rounded-full border border-brand-black px-4 py-2 text-sm font-bold" href={`/app/events/${resolvedParams.eventId}/run-of-show`}>Open run of show</a>
            <a className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold" href="/production-access/launchpad">Back to operator launchpad</a>
          </div>

          <div className="mt-6 rounded-3xl border border-brand-line bg-brand-ash p-5" data-testid="event-scoped-day1-command-links">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Event-scoped Day 1 command links</p>
            <h3 className="mt-2 text-xl font-black text-brand-black">Operate this event, not the demo event.</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">Every link below is scoped to this event code so operators do not accidentally jump back to event-summit during client setup, rehearsal, or show day.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/events/${resolvedParams.eventId}`}>Public Event Page</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/events/${resolvedParams.eventId}/register`}>Registration Page</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/venue/${resolvedParams.eventId}/lobby`}>Venue Lobby</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/app/events/${resolvedParams.eventId}/run-of-show`}>Run of Show</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/app/events/${resolvedParams.eventId}/crew`}>Crew Briefing & Instructions</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/app/events/${resolvedParams.eventId}/access`}>Role Access & Codes</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/app/events/${resolvedParams.eventId}/approval-queue`}>Producer Approval Queue</a>
              <a className="rounded-2xl bg-white p-4 text-sm font-bold shadow-sm" href={`/admin/testing/${resolvedParams.eventId}`}>Testing Console</a>
            </div>
          </div>
        </section>
      ) : null}
      <BasicsSetupPanel event={config.event} />
    </EventSetupShell>
  );
}
