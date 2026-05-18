const nav = [
  ["Dashboard", "/app"],
  ["Clients", "/app/clients"],
  ["Events", "/app/events"],
  ["Templates", "/app/templates"],
  ["Contractors", "/app/contractors"],
  ["Vendors", "/app/vendors"],
  ["Assets", "/app/assets"],
  ["Reports", "/app/reports"],
  ["Settings", "/app/settings"],
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-slate-950 p-5 text-white lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Agency Event OS</p>
        <h1 className="mt-2 text-xl font-semibold">West Peek Productions</h1>
      </div>
      <nav className="space-y-1">
        {nav.map(([label, href]) => (
          <a key={href} href={href} className="block rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white">
            {label}
          </a>
        ))}
      </nav>
      <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
        <p className="font-medium text-white">Build Mode</p>
        <p className="mt-1 text-slate-300">Mock data shell. No live auth, video, or payments yet.</p>
      </div>
    </aside>
  );
}
