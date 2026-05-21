import { redirect } from "next/navigation";
import { WestPeekProductionsLogo } from "@/components/brand/WestPeekProductionsLogo";
import { createEventSetupDraft } from "@/services/events/eventDraftStore";

export const dynamic = "force-dynamic";

async function startEventSetup(formData: FormData) {
  "use server";
  const draft = createEventSetupDraft(formData);
  redirect(`/app/events/event-summit/setup?draftId=${encodeURIComponent(draft.id)}`);
}

const fields = [
  ["eventName", "Event name", "Leadership Reset Webinar"],
  ["eventCode", "Event code / slug", "leadership-reset-webinar"],
  ["clientName", "Client or organizer name", "West Peek Productions"],
  ["eventDate", "Event date", "2026-06-01"],
  ["audience", "Primary audience", "Guests, speakers, sponsors, VIPs"],
  ["eventType", "Event type", "Webinar / summit / workshop / expo"],
  ["primaryVideo", "Primary video provider", "LiveKit"],
  ["fallbackVideo", "Fallback video provider", "Daily, then Zoom + Google Meet"],
] as const;

export default function CreateFirstEventPage() {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-8 text-brand-black sm:px-8 lg:px-12">
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
        <WestPeekProductionsLogo size="md" />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Create Event in Admin Workspace</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Start a guided event setup.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-brand-muted">This route creates a real local/runtime event setup draft, then sends the operator into the setup spine. It keeps Day 1 operators out of JSON and hidden routes.</p>
        <form action={startEventSetup} className="mt-8 grid gap-5 md:grid-cols-2">
          {fields.map(([id, label, placeholder]) => (
            <div key={id}>
              <label htmlFor={id} className="text-sm font-black">{label} <span className="text-brand-orange">*</span></label>
              <p className="mt-1 text-xs text-brand-muted">Required for the setup draft and operator handoff.</p>
              <input id={id} name={id} placeholder={placeholder} required className="mt-2 min-h-12 w-full rounded-full border border-brand-line px-5 text-sm" />
            </div>
          ))}
          <div className="md:col-span-2">
            <button className="rounded-full bg-brand-black px-5 py-3 text-sm font-bold text-white">Create setup draft and continue</button>
            <a href="/production-access/launchpad" className="ml-3 inline-flex rounded-full border border-brand-black px-5 py-3 text-sm font-bold">Back to operator launchpad</a>
          </div>
        </form>
        <div className="mt-8 rounded-3xl bg-brand-ash p-5 text-sm leading-6 text-brand-muted">
          <p className="font-black text-brand-black">Guided setup spine</p>
          <p>Basics → Branding → Attendee Flow → Venue → Agenda → Access → Communications → Preview → Publish.</p>
        </div>
      </section>
    </main>
  );
}
