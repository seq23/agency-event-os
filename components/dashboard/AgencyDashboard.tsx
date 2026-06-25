import Link from "next/link";
import { getRuntimeData } from "@/lib/runtime/getRuntimeData";
import { calculateEventReadiness } from "@/lib/readiness/calculateEventReadiness";
import { ReadinessScore } from "@/components/shared/ReadinessScore";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatEventDate } from "@/lib/utils/format";
import { getPersistenceModeLabel } from "@/services/persistence/coreReadModel";
import { WestPeekProductionsLogo } from "@/components/brand/WestPeekProductionsLogo";

export function AgencyDashboard() {
  const data = getRuntimeData();
  const upcoming = data.events.filter((event) => !["ended", "archived"].includes(event.status)).slice(0, 4);
  const pendingApprovals = data.approvals.filter((approval) => !["approved", "locked"].includes(approval.status));
  const reportsDue = data.events.filter((event) => event.status === "ended" && event.reportingEnabled);
  const mainEvent = data.events.find((event) => event.id === "event-summit") ?? data.events[0];
  const readiness = calculateEventReadiness(data, mainEvent.id);
  const persistenceMode = getPersistenceModeLabel();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <WestPeekProductionsLogo size="sm" />
        <p className="mt-4 text-sm font-medium text-slate-300">Agency command center</p>
        <h1 className="mt-2 text-3xl font-semibold">Run every client event from one cockpit.</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Track client approvals, speaker readiness, sponsor deliverables, crew confirmations, run-of-show blockers, and post-event reports before they become fires.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">{persistenceMode}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-orange">Recommended Day 1 path</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Production Console</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">If no real client conference is configured yet, start here. The app is not pretending there is a real client event; the demo venue is intentional training and sales theatre powered by the same venue components as real events.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/app/events/new" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Create First Event</Link>
          <Link href="/venue/demo/lobby" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold">Preview Demo Venue</Link>
          <Link href="/operator-packet" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold">Open Operator Packet</Link>
          <Link href="/production-access/crew" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold">Test Crew Login</Link>
          <Link href="/production-access/special-guest" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold">Test Speaker/Sponsor Login</Link>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-950">Demo event available: Leadership Reset Webinar</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/app/events/event-summit/setup" className="font-bold underline">Open setup preview</Link>
            <Link href="/venue/demo/lobby" className="font-bold underline">Open guest venue</Link>
            <Link href="/app/events/event-summit/crew" className="font-bold underline">Open crew console</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active clients" value={data.clients.length} />
        <MetricCard label="Events in motion" value={upcoming.length} />
        <MetricCard label="Open approvals" value={pendingApprovals.length} />
        <MetricCard label="Reports due" value={reportsDue.length} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard title="Upcoming client events" eyebrow="Portfolio">
          <div className="space-y-3">
            {upcoming.map((event) => {
              const client = data.clients.find((item) => item.id === event.clientId);
              const eventReadiness = calculateEventReadiness(data, event.id);
              return (
                <Link key={event.id} href={`/app/events/${event.id}/overview`} className="block rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-950">{event.name}</h3>
                      <p className="text-sm text-slate-500">{client?.name} · {formatEventDate(event.startAt)}</p>
                    </div>
                    <StatusBadge status={event.status} />
                  </div>
                  <div className="mt-3 text-sm text-slate-600">Readiness: {eventReadiness.overallScore}% · {eventReadiness.categories.filter((c) => c.status !== "ready").length} categories need attention</div>
                </Link>
              );
            })}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <ReadinessScore score={readiness.overallScore} label={`${mainEvent.name} readiness`} />
          <SectionCard title="Blocking issues" eyebrow="Needs attention">
            <ul className="space-y-2 text-sm text-slate-600">
              {readiness.categories.filter((category) => category.status !== "ready").slice(0, 5).map((category) => (
                <li key={category.key} className="rounded-xl bg-slate-50 p-3">
                  <span className="font-medium text-slate-900">{category.label}:</span> {category.missingItems[0] ?? category.recommendedActions[0]}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <SectionCard title="Pending approvals">
          <div className="space-y-2">
            {pendingApprovals.map((approval) => (
              <Link key={approval.id} href={`/app/events/${approval.eventId}/approvals`} className="block rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-950">{approval.title}</p>
                <p className="text-slate-500">Due {approval.dueAt}</p>
              </Link>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Contractor confirmations">
          <div className="space-y-2">
            {data.contractorAssignments.map((assignment) => (
              <div key={assignment.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium">{assignment.role}</p>
                <p className="text-slate-500">{assignment.status} · call time {formatEventDate(assignment.callTimeAt)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Reports due">
          <div className="space-y-2">
            {reportsDue.map((event) => (
              <Link key={event.id} href={`/app/events/${event.id}/report`} className="block rounded-xl bg-slate-50 p-3 text-sm">
                <p className="font-medium">{event.name}</p>
                <p className="text-slate-500">Client report ready</p>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
