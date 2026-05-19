import { ManageEventTabs } from "@/components/events/ManageEventTabs";
import { RoomFallbackControlPanel } from "@/components/video/RoomFallbackControlPanel";
import type { V4RoomType } from "@/types/v4";

const rooms: V4RoomType[] = ["main_stage", "backstage", "breakout_session", "networking_match", "sponsor_booth", "rehearsal_room"];

export function VideoHealthPanel({ eventId }: { eventId: string }) {
  return (
    <div className="space-y-6">
      <ManageEventTabs eventId={eventId} />
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange">Video health</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Room-level fallback control</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">LiveKit remains primary. Daily can be automatic. Zoom requires crew confirmation. Google Meet is last-resort manual. Every switch creates a fallback runtime event and rollback path.</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {rooms.map((room) => <RoomFallbackControlPanel key={room} eventId={eventId} roomType={room} />)}
        </div>
      </section>
    </div>
  );
}
