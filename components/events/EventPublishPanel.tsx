import { getEvent } from "@/lib/runtime/getRuntimeData";
import { getEventPublishState, getPublishReadiness, canPublishEvent } from "@/services/events/eventPublishService";
import { ManageEventTabs } from "@/components/events/ManageEventTabs";

export function EventPublishPanel({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const state = getEventPublishState(eventId);
  const readiness = getPublishReadiness(eventId);
  const ready = canPublishEvent(eventId);

  return (
    <div className="space-y-6">
      <ManageEventTabs eventId={eventId} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Publishing</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Publish {event.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Setup complete is not published. Published is not live. This screen keeps the review, validation, PR, deploy, smoke, live, and archive boundaries explicit.</p>
        <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
          <p className="text-sm font-bold">Current publish state: {state.replaceAll("_", " ")}</p>
          <p className="mt-1 text-sm text-slate-300">Actions-first publishing is the primary path. PR automation and config package export remain fallbacks. The app must never direct-commit to main.</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {readiness.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-950">{item.label}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === "pass" ? "bg-emerald-100 text-emerald-800" : item.status === "warning" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-brand-black px-5 py-3 text-sm font-bold text-white" disabled={!ready}>Mark ready for review</button>
          <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800">Generate config package</button>
          <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800">Open GitHub Actions checklist</button>
        </div>
      </section>
    </div>
  );
}
