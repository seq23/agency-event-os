import type { VirtualVenueModel } from "@/types/virtualVenue";
import { AnalyticsBeacon } from "@/components/analytics/AnalyticsBeacon";
import { SpeedNetworkingQueuePanel } from "./SpeedNetworkingQueuePanel";

export function NetworkingLobby({ model }: { model: VirtualVenueModel }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <AnalyticsBeacon eventId={model.eventId} kind="networking_joined" />
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Networking</p>
        <h2 className="mt-2 text-3xl font-semibold">Meet another attendee</h2>
        <p className="mt-2 text-slate-600">Join the queue for timed 1:1 conversations. The matching engine looks for a no-repeat attendee match, starts a visible timer when a match is ready, and falls back safely to queue context when no match is available yet. You can skip, report, or return to the lobby at any time. Joining records a networking analytics event for post-event reporting.</p>
      </section>
      <SpeedNetworkingQueuePanel eventId={model.eventId} />
    </div>
  );
}
