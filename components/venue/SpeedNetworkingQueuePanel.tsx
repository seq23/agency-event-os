import { joinSpeedNetworkingQueueAction } from "@/lib/actions/networkingActions";

export function SpeedNetworkingQueuePanel({ eventId }: { eventId: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">Queue status</h3>
      <p className="mt-2 text-slate-600">Networking is open for this event. Matching will begin when another attendee is available, and the match timer appears before each timed conversation starts.</p>
      <form action={joinSpeedNetworkingQueueAction} className="mt-4 grid gap-3">
        <input type="hidden" name="eventId" value={eventId} />
        <input type="hidden" name="attendeeName" value="Local E2E Attendee" />
        <input type="hidden" name="attendeeEmail" value="local-e2e-attendee@westpeek.live" />
        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">Join queue</button>
        <a href={`/venue/${eventId}/help`} className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Report issue</a>
      </form>
    </section>
  );
}
