import { getEvent } from "@/lib/runtime/getRuntimeData";
import { SectionCard } from "@/components/shared/SectionCard";
import { MetricCard } from "@/components/shared/MetricCard";
import { LiveKitVideoSurface } from "@/components/venue/LiveKitVideoSurface";
import { getTestingConsoleSnapshot, requiresProducerRecovery } from "@/services/testing";
import { DiagnosticStatusBadge } from "./DiagnosticStatusBadge";
import { BrowserDiagnosticsPanel } from "./BrowserDiagnosticsPanel";

export function TestingConsole({ eventId = "event-summit" }: { eventId?: string }) {
  const event = getEvent(eventId);
  const snapshot = getTestingConsoleSnapshot(event.id);
  const recoveryRequired = requiresProducerRecovery(snapshot);

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Testing console</p>
          <h1 className="mt-2 text-3xl font-semibold">{event.name}</h1>
          <p className="mt-2 max-w-3xl text-slate-300">
            Operator-facing preflight console for video, audio, network, room health, incident triage, and production recovery and backup readiness.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Go / No-Go</p>
              <p className="text-xl font-semibold">{snapshot.goNoGo.toUpperCase()}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Recovery</p>
              <p className="text-xl font-semibold">{recoveryRequired ? "REQUIRED" : "NOT REQUIRED"}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Overall</p>
              <p className="text-xl font-semibold">{snapshot.overallStatus.toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Rooms checked" value={`${snapshot.rooms.filter((room) => room.status !== "pending").length}/${snapshot.rooms.length}`} />
          <MetricCard label="Open incidents" value={snapshot.incidents.filter((incident) => incident.status === "open").length} />
          <MetricCard label="Critical failures" value={snapshot.incidents.filter((incident) => incident.severity === "critical" && incident.status === "open").length} />
          <MetricCard label="Recovery provider" value={snapshot.whiteLabelBackupEnabled ? `${snapshot.whiteLabelBackupProvider.replace(/_/g, " ").toUpperCase()}` : "None"} />
        </div>



        <BrowserDiagnosticsPanel eventId={event.id} />

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <SectionCard title="Operator video/audio preflight" eyebrow="Manual + provider checks">
            <div className="space-y-5">
              <LiveKitVideoSurface label="Camera preview and stage join test" />
              <div className="grid gap-3 md:grid-cols-2">
                {snapshot.devices.map((device) => (
                  <div key={device.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{device.label}</p>
                        <p className="mt-1 text-sm text-slate-600">{device.details}</p>
                      </div>
                      <DiagnosticStatusBadge status={device.status} />
                    </div>
                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{device.recommendedAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recovery decision support" eyebrow="Keep production in-platform">
            <div className="space-y-3 text-sm">
              <div className={`rounded-2xl p-4 ${recoveryRequired ? "bg-rose-50 text-rose-900" : "bg-emerald-50 text-emerald-900"}`}>
                <p className="font-semibold">{recoveryRequired ? "Producer recovery required" : "No recovery required"}</p>
                <p className="mt-1">
                  {recoveryRequired
                    ? "Recover inside Agency Event OS first: isolate the failing room, switch device/network, and open a controlled white-label backup room only if the producer approves."
                    : "Current diagnostics do not require recovery intervention."}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold">Fast debug protocol</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-600">
                  <li>Confirm browser permission.</li>
                  <li>Confirm mic input level.</li>
                  <li>Confirm speaker can hear tone.</li>
                  <li>Confirm room join test.</li>
                  <li>Check latency and packet loss.</li>
                  <li>Escalate to producer intervention and open the white-label backup room only if app-side recovery fails.</li>
                </ol>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Room diagnostics" eyebrow="Stage, backstage, sessions, networking, booths">
          <div className="grid gap-4 lg:grid-cols-2">
            {snapshot.rooms.map((room) => (
              <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{room.roomName}</p>
                    <p className="text-sm text-slate-500">{room.roomType} · provider: {room.provider}</p>
                  </div>
                  <DiagnosticStatusBadge status={room.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">Join: <strong>{room.joinTestStatus}</strong></div>
                  <div className="rounded-xl bg-slate-50 p-3">Audio: <strong>{room.audioStatus}</strong></div>
                  <div className="rounded-xl bg-slate-50 p-3">Video: <strong>{room.videoStatus}</strong></div>
                  <div className="rounded-xl bg-slate-50 p-3">Recording: <strong>{room.recordingStatus}</strong></div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{room.recommendedAction}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Diagnostic checks">
            <div className="space-y-3">
              {snapshot.checks.map((check) => (
                <div key={check.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{check.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{check.description}</p>
                    </div>
                    <DiagnosticStatusBadge status={check.status} />
                  </div>
                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{check.recommendedAction}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Debug incidents">
            <div className="space-y-3">
              {snapshot.incidents.map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{incident.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{incident.summary}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold">{incident.severity.toUpperCase()}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Status: {incident.status} · Recovery: {incident.platformRecoveryRequired ? "yes" : "no"}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
