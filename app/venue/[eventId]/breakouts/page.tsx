import { BreakoutRoomDirectory } from "@/components/venue/BreakoutRoomDirectory";

export default function VenueBreakoutsPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <BreakoutRoomDirectory eventId={params.eventId} />
      </div>
    </main>
  );
}
