import { getEvent } from "@/lib/runtime/getRuntimeData";
import { ManageEventTabs } from "@/components/events/ManageEventTabs";

const steps = [
  ["Basics", "Event identity, client, timezone, goals"],
  ["Branding", "Logo, hero treatment, colors, event voice"],
  ["Attendee Flow", "Join states, registration, replay, help"],
  ["Venue Modules", "Lobby, stage, sessions, expo, networking"],
  ["Agenda", "Public schedule and private production timing"],
  ["Speakers", "Profiles, assignments, onboarding, tech checks"],
  ["Sponsors", "Booths, CTA, lead capture, reports"],
  ["Access", "Event code, guest codes, crew roles"],
  ["Run of Show", "Segments, cues, assets, backup plan"],
  ["Video", "LiveKit, Daily, Zoom, Google Meet fallback"],
  ["Communications", "Invites, reminders, replay/report notices"],
  ["Preview", "Public and guest journey QA"],
  ["Publish", "Review boundary, Actions/PR/package"],
];

export function EventSetupWizard({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  return (
    <div className="space-y-6">
      <ManageEventTabs eventId={eventId} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Setup wizard</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{event.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">A VA-safe checklist for moving an event from draft setup to producer review without accidentally publishing or exposing public access.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {steps.map(([title, detail], index) => (
            <div key={title} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-950">{index + 1}. {title}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Ready</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
