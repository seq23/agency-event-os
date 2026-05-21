import { EventSetupShell } from "@/components/events/setup/EventSetupShell";
import { BasicsSetupPanel } from "@/components/events/setup/SetupPanels";
import { getEventSetupDraftById } from "@/services/events/eventDraftStore";
import { getEventConfigPackage } from "@/services/events/eventConfigRepository";

export default function EventSetupPage({ params, searchParams }: { params: { eventId: string }; searchParams?: { draftId?: string } }) {
  const config = getEventConfigPackage(params.eventId);
  const draft = searchParams?.draftId ? getEventSetupDraftById(searchParams.draftId) : undefined;
  return (
    <EventSetupShell eventId={params.eventId} active="basics" eyebrow="Setup · Basics" title="Event basics">
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
            <p><span className="font-black text-brand-black">Video plan:</span> {draft.primaryVideo} primary; {draft.fallbackVideo} fallback</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="rounded-full bg-brand-black px-4 py-2 text-sm font-bold text-white" href={`/app/events/${params.eventId}/preview`}>Preview event</a>
            <a className="rounded-full border border-brand-black px-4 py-2 text-sm font-bold" href={`/app/events/${params.eventId}/run-of-show`}>Open run of show</a>
            <a className="rounded-full border border-brand-line px-4 py-2 text-sm font-bold" href="/production-access/launchpad">Back to operator launchpad</a>
          </div>
        </section>
      ) : null}
      <BasicsSetupPanel event={config.event} />
    </EventSetupShell>
  );
}
