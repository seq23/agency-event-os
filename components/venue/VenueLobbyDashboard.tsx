import type { VirtualVenueModel } from "@/types/virtualVenue";
import { buildVenueLobbySections } from "@/services/venue";
import { SessionCard } from "./SessionCard";
import { BreakoutRoomCard } from "./BreakoutRoomCard";
import { SponsorBoothCard } from "./SponsorBoothCard";

export function VenueLobbyDashboard({ model }: { model: VirtualVenueModel }) {
  const sections = buildVenueLobbySections(model);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Lobby</p>
        <h2 className="mt-2 text-3xl font-semibold">Welcome to the event</h2>
        <p className="mt-2 max-w-3xl text-slate-600">Start at the main stage, browse sessions, join breakouts, visit sponsors, or enter networking.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={sections.heroCta} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Join live session</a>
          <a href={`/venue/${model.eventId}/networking`} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold">Start networking</a>
          <a href={`/venue/${model.eventId}/help`} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold">Get help</a>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">Live now</h3>
          <div className="space-y-3">{sections.liveNow.map((session) => <SessionCard key={session.id} session={session} />)}</div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold">Up next</h3>
          <div className="space-y-3">{sections.upNext.map((session) => <SessionCard key={session.id} session={session} />)}</div>
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Breakouts</h3>
        <div className="grid gap-3 md:grid-cols-3">{sections.breakouts.map((room) => <BreakoutRoomCard key={room.id} room={room} />)}</div>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">Expo</h3>
        <div className="grid gap-3 md:grid-cols-4">{sections.booths.map((booth) => <SponsorBoothCard key={booth.id} booth={booth} />)}</div>
      </section>
    </div>
  );
}
