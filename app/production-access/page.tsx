export default function ProductionAccessPage() {
  return (
    <main className="min-h-screen bg-brand-ash px-5 py-10 text-brand-black sm:px-8 lg:px-12">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Production Access</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Choose your controlled path</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted">Crew and special guests are not public attendees. This gate separates production tools, client review, speaker prep, sponsor setup, crew-lite assignments, and VIP access.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a href="/production-access/crew" className="rounded-3xl border border-slate-200 p-6 hover:border-brand-orange">
            <h2 className="text-2xl font-black">Crew / Production Team</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">High-trust crew password, optional event code, signed crew cookie, then manage events and command center access.</p>
          </a>
          <a href="/production-access/special-guest" className="rounded-3xl border border-slate-200 p-6 hover:border-brand-orange">
            <h2 className="text-2xl font-black">Conference Special Guest</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Event code plus role code for client, speaker, sponsor, crew-lite, or VIP destinations.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
