import { submitSponsorLeadAction } from "@/lib/actions/venueRuntimeActions";

export function SponsorLeadCaptureForm({ eventId, boothId }: { eventId: string; boothId: string }) {
  return (
    <form action={submitSponsorLeadAction} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="eventId" value={eventId} />
      <input type="hidden" name="boothId" value={boothId} />
      <h3 className="text-lg font-semibold">Request follow-up</h3>
      <p className="mt-2 text-sm text-slate-500">Sponsor interest is recorded as analytics, not a fake local counter.</p>
      <div className="mt-4 grid gap-3">
        <input required className="rounded-xl border border-slate-200 p-3" name="name" aria-label="Name" />
        <input required className="rounded-xl border border-slate-200 p-3" name="email" type="email" aria-label="Email" />
        <input className="rounded-xl border border-slate-200 p-3" name="company" aria-label="Company" />
        <textarea required className="rounded-xl border border-slate-200 p-3" name="interest" aria-label="Interest" />
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="submit">Send to sponsor</button>
      </div>
    </form>
  );
}
