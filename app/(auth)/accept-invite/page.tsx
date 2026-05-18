export default function AuthShellPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Auth shell</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Accept invite</h1>
        <p className="mt-2 text-slate-600">Mock invitation acceptance shell for agency, client, speaker, sponsor, contractor, and attendee invites.</p>
        <div className="mt-6 space-y-3">
          <div className="h-11 rounded-xl border border-slate-200 bg-slate-50" />
          <div className="h-11 rounded-xl border border-slate-200 bg-slate-50" />
          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Continue placeholder</button>
        </div>
      </div>
    </main>
  );
}
