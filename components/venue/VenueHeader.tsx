import type { VirtualVenueModel } from "@/types/virtualVenue";
import { VenueNav } from "./VenueNav";
import { VenueStatusBar } from "./VenueStatusBar";

export function VenueHeader({ model }: { model: VirtualVenueModel }) {
  return (
    <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Virtual venue</p>
      <h1 className="mt-2 text-3xl font-semibold">{model.eventName}</h1>
      <p className="mt-2 max-w-3xl text-slate-300">Lobby, stage, sessions, breakouts, expo, networking, people, replay, and support in one event venue.</p>
      <div className="mt-5"><VenueStatusBar model={model} /></div>
      <div className="mt-5"><VenueNav items={model.nav} /></div>
    </header>
  );
}
