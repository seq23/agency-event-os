import { joinSpeedNetworkingQueueAction } from "@/lib/actions/networkingActions";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";

export async function SpeedNetworkingQueuePanel({ eventId }: { eventId: string }) {
  const identity = await getCurrentAttendeeIdentity(eventId).catch(() => undefined);
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm" data-testid="networking-queue-panel">
      <h3 className="text-xl font-semibold">Queue status</h3>
      <p className="mt-2 text-slate-600">Networking is open for this event. Matching uses your real event-scoped attendee identity and never creates speaker, sponsor, crew, operator, or admin access.</p>
      {identity ? (
        <form action={joinSpeedNetworkingQueueAction} className="mt-4 grid gap-3" data-testid="attendee-networking-queue-form">
          <input type="hidden" name="eventId" value={eventId} />
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">Joining as {identity.displayName} · {identity.company}</p>
          <button type="submit" className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">Join queue</button>
          <a href={`/venue/${eventId}/help`} className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Report issue</a>
        </form>
      ) : (
        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-700" data-testid="networking-registration-required">Register for this event before joining the attendee networking queue.</div>
      )}
    </section>
  );
}
