import { getContractorAssignmentsForEvent, getEvent, getRunOfShowForEvent, getSpeakersForEvent, getVendorAssignmentsForEvent } from "@/lib/mock/getMockData";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatEventDate } from "@/lib/utils/format";

export function ProductionCommandCenter({ eventId }: { eventId: string }) {
  const event = getEvent(eventId);
  const segments = getRunOfShowForEvent(event.id);
  const current = segments[0];
  const next = segments.slice(1, 4);
  const speakers = getSpeakersForEvent(event.id);
  const crew = getContractorAssignmentsForEvent(event.id);
  const vendors = getVendorAssignmentsForEvent(event.id);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-sm font-medium text-slate-300">Live production command center</p>
        <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Mock live cockpit for producers. Future integrations will connect video rooms, moderation, polling, recording, and incident workflows here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Current segment" value={current?.publicTitle ?? "None"} note={current ? formatEventDate(current.startAt) : undefined} />
        <MetricCard label="Speakers" value={`${speakers.filter((s) => s.readinessStatus === "ready").length}/${speakers.length}`} note="ready" />
        <MetricCard label="Crew confirmed" value={`${crew.filter((c) => c.status === "confirmed").length}/${crew.length}`} />
        <MetricCard label="Vendors" value={`${vendors.filter((v) => ["confirmed", "complete"].includes(v.status)).length}/${vendors.length}`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Live segment">
          {current ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{formatEventDate(current.startAt)} · {current.room}</p>
                    <h2 className="mt-1 text-2xl font-semibold">{current.publicTitle}</h2>
                    <p className="mt-2 text-slate-600">{current.clientFacingDescription}</p>
                  </div>
                  <StatusBadge status={current.readinessStatus} tone={current.readinessStatus === "ready" ? "good" : "warn"} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold">Producer notes</p>
                  <p className="mt-2 text-sm text-slate-600">{current.producerNotes}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold">Technical cues</p>
                  <p className="mt-2 text-sm text-slate-600">{current.technicalCues}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>No live segment.</p>
          )}
        </SectionCard>

        <SectionCard title="Next cues">
          <div className="space-y-3">
            {next.map((segment) => (
              <div key={segment.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{formatEventDate(segment.startAt)}</p>
                <p className="font-semibold">{segment.publicTitle}</p>
                <p className="text-sm text-slate-600">{segment.technicalCues}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Speaker readiness">
          <div className="space-y-3">
            {speakers.map((speaker) => (
              <div key={speaker.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{speaker.name}</p>
                  <StatusBadge status={speaker.readinessStatus} tone={speaker.readinessStatus === "ready" ? "good" : "warn"} />
                </div>
                <p className="mt-1 text-sm text-slate-500">Tech check: {speaker.techCheckStatus}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Room status">
          <div className="space-y-3">
            {["Main Stage", "Breakout A", "Expo Booths", "Networking"].map((room, index) => (
              <div key={room} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{room}</p>
                  <StatusBadge status={index === 0 ? "scheduled" : "standby"} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Incident log">
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-medium">No open critical incidents</p>
              <p className="text-sm text-slate-500">Incident logging shell ready for future persistence.</p>
            </div>
            <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">Log incident placeholder</button>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard title="Chat moderation queue">
          <p className="text-sm text-slate-600">Moderation queue shell. Future chat provider events land here.</p>
        </SectionCard>
        <SectionCard title="Q&A queue">
          <p className="text-sm text-slate-600">Question approval and stage-pinning shell.</p>
        </SectionCard>
        <SectionCard title="Poll control">
          <p className="text-sm text-slate-600">Launch/close poll controls placeholder.</p>
        </SectionCard>
      </div>
    </div>
  );
}
