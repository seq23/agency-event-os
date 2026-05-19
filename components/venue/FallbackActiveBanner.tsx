import type { V4RoomFallbackState } from "@/types/v4";

export function FallbackActiveBanner({ state }: { state: V4RoomFallbackState }) {
  if (!state.manualOverrideProvider && state.activeProvider === "livekit") return null;
  return <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Fallback active for {state.roomType.replaceAll("_", " ")}: {state.activeProvider}. Support can route you if the room feels degraded.</section>;
}
