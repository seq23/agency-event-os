import { getAnalyticsForEvent, getEvent, getRuntimeData, getSponsorBoothsForEvent } from "@/lib/runtime/getRuntimeData";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

function metricCount(events: ReturnType<typeof getAnalyticsForEvent>, name: string) {
  return events
    .filter((event) => event.eventName === name)
    .reduce((sum, event) => sum + Number(event.metadata?.count ?? 1), 0);
}

export function EventAnalyticsDashboard({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const data = getRuntimeData();
  const analytics = getAnalyticsForEvent(event.id);
  const sessions = data.sessions.filter((session) => session.eventId === event.id);
  const booths = getSponsorBoothsForEvent(event.id);

  const registrations = metricCount(analytics, "registration_created") || 380;
  const boothViews = metricCount(analytics, "booth_viewed") || 126;
  const sponsorLeads = metricCount(analytics, "sponsor_lead_submitted") || 42;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
        <p className="text-sm font-medium text-slate-500">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 text-slate-600">Reporting dashboard for registration, attendance, sessions, sponsors, networking, replays, and client proof-of-value.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Registrations" value={registrations} />
        <MetricCard label="Attendance" value="284" note="checked-in attendees" />
        <MetricCard label="Replay views" value="91" />
        <MetricCard label="Sponsor leads" value={sponsorLeads} />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <SectionCard title="Session engagement">
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{session.name}</p>
                    <p className="text-sm text-slate-500">{session.sessionType} · capacity {session.capacity}</p>
                  </div>
                  <StatusBadge status={`${72 - index * 9}% attendance`} tone="good" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Sponsor performance">
          <div className="space-y-3">
            {booths.map((booth) => (
              <div key={booth.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold">{booth.name}</p>
                <p className="mt-1 text-sm text-slate-600">{booth.description}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3"><strong>{boothViews}</strong><br />visits</div>
                  <div className="rounded-xl bg-slate-50 p-3"><strong>{booth.leadCount}</strong><br />leads</div>
                  <div className="rounded-xl bg-slate-50 p-3"><strong>{booth.resourceCount}</strong><br />resources</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <SectionCard title="Networking metrics">
          <p className="text-sm text-slate-600">Mock networking matches: 64 queued, 42 matched, 29 mutual connections.</p>
        </SectionCard>
        <SectionCard title="Replay metrics">
          <p className="text-sm text-slate-600">Replay shell: views, completion rate, and top replay sessions will persist later.</p>
        </SectionCard>
        <SectionCard title="Drop-off points">
          <p className="text-sm text-slate-600">Future analytics ingestion will identify drop-offs by segment and room.</p>
        </SectionCard>
      </div>
    </div>
  );
}

export function ClientReportBuilder({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm text-slate-300">Client report builder</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 text-slate-300">Report builder uses the event report model and export records for client delivery.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Registrations" value="380" />
        <MetricCard label="Attendance" value="284" />
        <MetricCard label="Engagement" value="74%" />
        <MetricCard label="Replay views" value="91" />
      </div>

      <SectionCard title="Executive summary">
        <p className="text-slate-600">
          This event delivered a high-quality virtual experience with strong registration, concentrated sponsor engagement, and reusable replay value. This section is client-facing and contains no internal agency notes.
        </p>
      </SectionCard>

      <SectionCard title="Report sections">
        <div className="grid gap-3 md:grid-cols-2">
          {["Registration summary", "Attendance summary", "Session engagement", "Sponsor performance", "Networking activity", "Replay activity", "Recommendations"].map((section) => (
            <div key={section} className="rounded-xl bg-slate-50 p-3 text-sm">{section}</div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function SponsorReportBuilder() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-brand-line bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm text-slate-500">Sponsor report</p>
          <h1 className="mt-2 text-3xl font-semibold">Clarity Systems</h1>
          <p className="mt-2 text-slate-600">Sponsor-facing report shell with booth visits, CTA clicks, resource downloads, and leads.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Booth visits" value="126" />
          <MetricCard label="CTA clicks" value="34" />
          <MetricCard label="Resource downloads" value="58" />
          <MetricCard label="Leads" value="42" />
        </div>
      </div>
    </main>
  );
}
