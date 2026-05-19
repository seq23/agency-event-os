import { clearRoomFallbackOverrideAction, runVideoHealthCheckAction } from "@/lib/actions/videoFallbackActions";
import { canAutoSwitchTo, getRoomFallbackState, recommendFallbackProvider } from "@/services/video/roomFallbackService";
import type { V4RoomType, V4VideoProvider } from "@/types/v4";
import { FallbackConfirmationModal } from "@/components/video/FallbackConfirmationModal";
import { ProviderHealthGrid } from "@/components/video/ProviderHealthGrid";

const providers: V4VideoProvider[] = ["daily", "zoom", "google_meet"];

export async function RoomFallbackControlPanel({ eventId, roomType }: { eventId: string; roomType: V4RoomType }) {
  const state = await getRoomFallbackState(eventId, roomType);
  const recommended = recommendFallbackProvider(state);
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-black capitalize text-slate-950">{roomType.replaceAll("_", " ")}</h2>
          <p className="mt-1 text-sm text-slate-500">Active: {state.activeProvider} · Recommended: {recommended} · {canAutoSwitchTo(recommended) ? "Automatic allowed" : "Crew confirmation required"}</p>
          <p className="mt-1 text-xs text-slate-400">Last checked: {state.lastCheckedAt}</p>
        </div>
        <form action={runVideoHealthCheckAction}>
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="roomType" value={roomType} />
          <button type="submit" className="rounded-full border border-slate-300 px-4 py-2 text-xs font-black text-slate-700">Run health check</button>
        </form>
      </div>
      <div className="mt-4"><ProviderHealthGrid state={state} /></div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {providers.map((provider) => <FallbackConfirmationModal key={provider} eventId={eventId} roomType={roomType} provider={provider} />)}
      </div>
      {state.rollbackAvailable ? (
        <form action={clearRoomFallbackOverrideAction} className="mt-4">
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="roomType" value={roomType} />
          <button type="submit" className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white">Clear override and return to automatic provider mode</button>
        </form>
      ) : null}
    </div>
  );
}
