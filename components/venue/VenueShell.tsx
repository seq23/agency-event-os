import type { ReactNode } from "react";
import { getEvent } from "@/lib/runtime/getRuntimeData";
import { WestPeekLiveWordmark } from "@/components/brand/WestPeekLiveWordmark";

const venueNav = [
  ["Lobby", "lobby"],
  ["Stage", "stage"],
  ["Sessions", "sessions"],
  ["Breakouts", "breakouts"],
  ["Networking", "networking"],
  ["Expo", "expo"],
  ["People", "people"],
  ["Replay", "replay"],
  ["Help", "help"],
];

export function VenueShell({ eventId, children }: { eventId: string; children: ReactNode }) {
  const event = getEvent(eventId);

  return (
    <main className="min-h-screen bg-brand-ash text-brand-black">
      <header className="border-b border-brand-line bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <WestPeekLiveWordmark size="sm" />
            <p className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-brand-orange">Attendee venue</p>
            <h1 className="mt-1 truncate text-2xl font-black tracking-[-0.04em] text-brand-black">{event.name}</h1>
          </div>
          <nav className="mobile-scrollbar flex gap-2 overflow-x-auto pb-1">
            {venueNav.map(([label, key]) => (
              <a key={key} href={`/venue/${event.id}/${key}`} className="whitespace-nowrap rounded-full border border-brand-line bg-white px-3 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:text-brand-orange">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
