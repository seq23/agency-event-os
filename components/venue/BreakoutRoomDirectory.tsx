import { getBreakoutRooms } from "@/services/networking-ops";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function BreakoutRoomDirectory({ eventId }: { eventId: string }) {
  const rooms = getBreakoutRooms(eventId);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Breakout rooms</p>
        <h1 className="mt-2 text-3xl font-semibold">Live sessions, roundtables, workshops, and sponsor rooms</h1>
        <p className="mt-2 text-slate-600">Hopin-style session rooms with room state, capacity, chat/Q&A/poll settings, and future video provider hooks.</p>
      </div>

      <SectionCard title="Available rooms">
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{room.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{room.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Host: {room.hostName} · Capacity {room.capacity} · Camera seats {room.cameraOnLimit}</p>
                </div>
                <StatusBadge status={room.status} tone={room.status === "live" ? "good" : "neutral"} />
              </div>
              <button type="button" className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Join room</button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
