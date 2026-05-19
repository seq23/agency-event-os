import type { VirtualVenueModel } from "@/types/virtualVenue";

export function VenueStatusBar({ model }: { model: VirtualVenueModel }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs uppercase tracking-wide text-slate-400">Live now</p><p className="text-lg font-semibold">{model.liveNow.length}</p></div>
      <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs uppercase tracking-wide text-slate-400">Sessions</p><p className="text-lg font-semibold">{model.sessions.length}</p></div>
      <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs uppercase tracking-wide text-slate-400">Expo</p><p className="text-lg font-semibold">{model.booths.length}</p></div>
      <div className="rounded-2xl bg-white/10 p-3"><p className="text-xs uppercase tracking-wide text-slate-400">Networking</p><p className="text-lg font-semibold">Open</p></div>
    </div>
  );
}
