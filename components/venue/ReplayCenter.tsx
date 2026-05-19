import type { VirtualVenueReplay } from "@/types/virtualVenue";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { ReplayCard } from "./ReplayCard";

export function ReplayCenter({ eventId, replays }: { eventId: string; replays: VirtualVenueReplay[] }) {
  return (
    <section>
      <AnalyticsBeacon eventId={eventId} kind="replay_watched" metadata={{ replayCount: replays.length }} />
      <h2 className="mb-4 text-2xl font-semibold">Replay center</h2>
      {replays.length === 0 ? <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">Replay is not ready yet. Production will publish replay access when processing completes.</p> : <div className="grid gap-4 md:grid-cols-3">{replays.map((replay) => <ReplayCard key={replay.id} replay={replay} />)}</div>}
    </section>
  );
}
