import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getEvent } from "@/lib/runtime/getRuntimeData";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { V6RuntimeSnapshot } from "@/services/runtime/runtimeStore";

function countByKind(runtime: V6RuntimeSnapshot, eventId: string, kind: string) {
  return runtime.analyticsEvents.filter((event) => event.eventId === eventId && event.kind === kind).length;
}

export async function EventAnalyticsDashboard({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const runtime = await getRuntimeStore().readSnapshot();
  const analytics = runtime.analyticsEvents.filter((item) => item.eventId === event.id);
  const registrations = runtime.registrations.filter((item) => item.eventId === event.id).length;
  const lobbyJoins = countByKind(runtime, event.id, "attendee_joined_lobby");
  const sessionJoins = countByKind(runtime, event.id, "attendee_joined_session");
  const boothVisits = countByKind(runtime, event.id, "attendee_visited_sponsor_booth");
  const sponsorClicks = countByKind(runtime, event.id, "sponsor_cta_clicked");
  const replayViews = countByKind(runtime, event.id, "replay_watched");
  const networkingJoins = countByKind(runtime, event.id, "networking_joined");
  const supportRequests = runtime.supportRequests.filter((item) => item.eventId === event.id).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-slate-500">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 text-slate-600">This dashboard reads persisted runtime events. Empty metrics mean no event has been recorded yet, not a fake zero-proof success.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Registrations" value={registrations} />
        <MetricCard label="Lobby joins" value={lobbyJoins} />
        <MetricCard label="Session joins" value={sessionJoins} />
        <MetricCard label="Replay views" value={replayViews} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <SectionCard title="Engagement events">
          <div className="grid gap-3 md:grid-cols-2">
            <MetricCard label="Sponsor booth visits" value={boothVisits} />
            <MetricCard label="Sponsor CTA clicks" value={sponsorClicks} />
            <MetricCard label="Networking joins" value={networkingJoins} />
            <MetricCard label="Support requests" value={supportRequests} />
          </div>
        </SectionCard>

        <SectionCard title="Raw event feed">
          <div className="space-y-2">
            {analytics.slice(-8).reverse().map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <strong>{item.kind}</strong>
                  <StatusBadge status="recorded" tone="good" />
                </div>
                <p className="mt-1 text-slate-500">{item.createdAt}</p>
              </div>
            ))}
            {analytics.length === 0 ? <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No analytics events have been recorded yet.</p> : null}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export async function ClientReportBuilder({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const runtime = await getRuntimeStore().readSnapshot();
  const registrations = runtime.registrations.filter((item) => item.eventId === event.id).length;
  const support = runtime.supportRequests.filter((item) => item.eventId === event.id).length;
  const analytics = runtime.analyticsEvents.filter((item) => item.eventId === event.id).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm text-slate-300">Client report builder</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 text-slate-300">Report values are based on persisted runtime data.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Registrations" value={registrations} />
        <MetricCard label="Analytics events" value={analytics} />
        <MetricCard label="Support requests" value={support} />
      </div>
    </div>
  );
}

export async function SponsorReportBuilder() {
  const runtime = await getRuntimeStore().readSnapshot();
  const boothVisits = runtime.analyticsEvents.filter((item) => item.kind === "attendee_visited_sponsor_booth").length;
  const ctaClicks = runtime.analyticsEvents.filter((item) => item.kind === "sponsor_cta_clicked").length;
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm text-slate-500">Sponsor report</p>
          <h1 className="mt-2 text-3xl font-semibold">Runtime sponsor performance</h1>
          <p className="mt-2 text-slate-600">Sponsor report values come from booth and CTA runtime analytics.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard label="Booth visits" value={boothVisits} />
          <MetricCard label="CTA clicks" value={ctaClicks} />
        </div>
      </div>
    </main>
  );
}
