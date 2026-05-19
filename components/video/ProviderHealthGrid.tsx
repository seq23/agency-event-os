import type { V4RoomFallbackState } from "@/types/v4";

export function ProviderHealthGrid({ state }: { state: V4RoomFallbackState }) {
  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {Object.entries(state.health).map(([provider, health]) => (
        <div key={provider} className="rounded-xl bg-slate-50 p-3">
          <strong>{provider}</strong><br />
          <span className="text-slate-500">{health}</span>
        </div>
      ))}
    </div>
  );
}
