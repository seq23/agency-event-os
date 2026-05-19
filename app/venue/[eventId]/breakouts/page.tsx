import { buildVirtualVenueModel, sortBreakouts } from "@/services/venue";
import { BreakoutRoomCard } from "@/components/venue/BreakoutRoomCard";
import { VenuePageShell } from "@/components/venue/VenuePageShell";

export default function BreakoutsPage({ params }: { params: { eventId: string } }) {
  const model = buildVirtualVenueModel(params.eventId);
  const rooms = sortBreakouts(model.breakouts);
  return (
    <VenuePageShell model={model}>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Breakout rooms</h2>
        <div className="grid gap-4 md:grid-cols-3">{rooms.map((room) => <BreakoutRoomCard key={room.id} room={room} />)}</div>
      </section>
    </VenuePageShell>
  );
}
