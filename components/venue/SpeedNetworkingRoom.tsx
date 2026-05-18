import { getNetworkingHealth, getSpeedNetworkingMatches, getSpeedNetworkingSettings } from "@/services/networking-ops";
import { MetricCard } from "@/components/shared/MetricCard";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function SpeedNetworkingRoom({ eventId }: { eventId: string }) {
  const settings = getSpeedNetworkingSettings(eventId);
  const matches = getSpeedNetworkingMatches(eventId);
  const health = getNetworkingHealth(eventId);
  const active = matches.find((match) => match.status === "in_call");

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Speed networking</p>
        <h1 className="mt-2 text-3xl font-semibold">3-minute rotating 1:1 meetings</h1>
        <p className="mt-2 text-slate-300">Attendees enter a queue, match into short video rooms, connect/skip/report, and rotate to the next person.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Duration" value={`${settings.durationSeconds / 60} min`} />
        <MetricCard label="Mode" value={settings.matchingMode.replace(/_/g, " ")} />
        <MetricCard label="Active matches" value={health.activeMatches} />
        <MetricCard label="Queue" value={health.queueStatus} />
      </div>

      <SectionCard title="Current match">
        {active ? (
          <div className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Now meeting</p>
            <h2 className="mt-2 text-2xl font-semibold">{active.attendeeAName} ↔ {active.attendeeBName}</h2>
            <p className="mt-2 text-slate-600">{active.secondsRemaining} seconds remaining</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Connect", "Skip", "Report", "Leave queue"].map((label) => (
                <button key={label} type="button" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">{label}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-5 text-slate-600">No active match. Join the queue to begin.</div>
        )}
      </SectionCard>

      <SectionCard title="Match history">
        <div className="space-y-3">
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold">{match.attendeeAName} ↔ {match.attendeeBName}</p>
                <p className="text-sm text-slate-500">{match.secondsRemaining} seconds remaining</p>
              </div>
              <StatusBadge status={match.status} tone={match.status === "reported" ? "bad" : "neutral"} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
