import { ManageEventTabs } from "@/components/events/ManageEventTabs";

const incidents = [
  { id: "incident-1", severity: "warning", title: "Speaker tech check not complete", owner: "Producer", status: "open" },
  { id: "incident-2", severity: "info", title: "Daily fallback verified", owner: "Technical Director", status: "monitoring" },
];

export function IncidentPanel({ eventId }: { eventId: string }) {
  return (
    <div className="space-y-6">
      <ManageEventTabs eventId={eventId} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Incidents</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Live incident log</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Sensitive operational actions should create an audit trail: access attempts, fallback switches, run-of-show changes, publish/deploy actions, incidents, approvals, and status changes.</p>
        <div className="mt-6 space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold text-slate-950">{incident.title}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{incident.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Severity: {incident.severity} · Owner: {incident.owner}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
