export function SpeedNetworkingQueuePanel({ eventId }: { eventId: string }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">Queue status</h3>
      <p className="mt-2 text-slate-600">Networking is open for this event.</p>
      <div className="mt-4 grid gap-3">
        <a href={`/venue/${eventId}/networking?state=waiting`} className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white">Join queue</a>
        <a href={`/venue/${eventId}/help`} className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Report issue</a>
      </div>
    </section>
  );
}
