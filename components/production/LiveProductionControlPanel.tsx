import type { LiveProductionStateEvent } from "@/types/liveProductionOperations";

export function LiveProductionControlPanel({ events }: { events: LiveProductionStateEvent[] }) {
  return (
    <section className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Live operations</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-950">Production state</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {(["stage", "session", "breakout", "networking"] as const).map((stateType) => (
          <button key={stateType} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold capitalize">
            {stateType}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-3">
        {events.map((event, index) => (
          <div key={`${event.stateType}-${event.createdAt}-${index}`} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-semibold">{event.stateType}: {event.stateValue}</p>
            {event.notes ? <p className="mt-1 text-sm text-slate-600">{event.notes}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
