import { getSpeakerApprovalSummary, getSpeakerGreenRoomSnapshot } from "@/services/speaker-ops";
import { getSponsorFulfillmentSummary, getSponsorReadyRoomSnapshot } from "@/services/sponsor-ops";
import { getChangeControlSummary } from "@/services/change-control";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { LiveChangeAlertsPanel } from "./LiveChangeAlertsPanel";

export function TalentReadinessDashboard({ eventId }: { eventId: string }) {
  const speaker = getSpeakerGreenRoomSnapshot(eventId);
  const speakerSummary = getSpeakerApprovalSummary(eventId);
  const sponsor = getSponsorReadyRoomSnapshot(eventId);
  const sponsorSummary = getSponsorFulfillmentSummary(eventId);
  const changes = getChangeControlSummary(eventId);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Talent command center</p>
        <h1 className="mt-2 text-3xl font-semibold">Speakers, sponsors, readiness, and live change risk</h1>
        <p className="mt-2 text-slate-300">Producer cockpit for the people and deliverables most likely to disrupt a live show.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Speaker readiness" value={`${speakerSummary.approvedItems}/${speakerSummary.totalItems}`} />
        <MetricCard label="Speaker blockers" value={speakerSummary.blockingOpenItems} />
        <MetricCard label="Sponsor deliverables" value={`${sponsorSummary.approvedDeliverables}/${sponsorSummary.totalDeliverables}`} />
        <MetricCard label="Late changes" value={changes.total} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Speaker monitor">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{speaker.speakerName}</p>
            <p className="mt-1 text-sm text-slate-600">{speaker.status.replace(/_/g, " ")} · {speaker.minutesUntilLive} min until live</p>
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm">{speaker.readiness.producerMessage}</p>
          </div>
        </SectionCard>

        <SectionCard title="Sponsor monitor">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="font-semibold">{sponsor.sponsorName}</p>
            <p className="mt-1 text-sm text-slate-600">Booth {sponsor.boothStatus} · reps {sponsor.representativeStatus}</p>
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm">{sponsor.producerMessage}</p>
          </div>
        </SectionCard>
      </div>

      <LiveChangeAlertsPanel eventId={eventId} />
    </div>
  );
}
