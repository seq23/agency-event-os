export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Production workspace</p>
          <p className="text-sm text-slate-600">Plan, produce, run, and report on client events.</p>
        </div>
        <div className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">S.L. Taylor</div>
      </div>
    </header>
  );
}
