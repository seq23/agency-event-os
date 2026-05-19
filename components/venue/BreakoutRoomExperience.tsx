import type { VirtualVenueBreakout } from "@/types/virtualVenue";
import { LiveKitVideoSurface } from "./LiveKitVideoSurface";

export function BreakoutRoomExperience({ room }: { room: VirtualVenueBreakout }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <LiveKitVideoSurface label={room.title} />
      <h2 className="mt-5 text-2xl font-semibold">{room.title}</h2>
      <p className="mt-2 text-slate-600">{room.description}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Host</p><p className="font-semibold">{room.hostName}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Capacity</p><p className="font-semibold">{room.currentCount}/{room.capacity}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Status</p><p className="font-semibold">{room.status}</p></div>
      </div>
    </section>
  );
}
