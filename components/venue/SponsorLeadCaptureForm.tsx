export function SponsorLeadCaptureForm({ boothId }: { boothId: string }) {
  return (
    <form className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="boothId" value={boothId} />
      <h3 className="text-lg font-semibold">Request follow-up</h3>
      <div className="mt-4 grid gap-3">
        <input className="rounded-xl border border-slate-200 p-3" name="name" aria-label="Name" />
        <input className="rounded-xl border border-slate-200 p-3" name="email" type="email" aria-label="Email" />
        <input className="rounded-xl border border-slate-200 p-3" name="company" aria-label="Company" />
        <textarea className="rounded-xl border border-slate-200 p-3" name="interest" aria-label="Interest" />
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white" type="submit">Send to sponsor</button>
      </div>
    </form>
  );
}
