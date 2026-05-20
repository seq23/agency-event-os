import type { TestingConsoleSnapshot } from "@/types/testing";

function statusLabel(status: string) {
  return status.replace(/_/g, " ").toUpperCase();
}

function statusClass(status: string) {
  if (status === "pass" || status === "go") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (status === "warn" || status === "monitor" || status === "pending") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

export function ShowtimeReadinessPanel({ snapshot }: { snapshot: TestingConsoleSnapshot }) {
  const livekitRooms = snapshot.rooms.filter((room) => room.provider === "livekit");
  const dailyReady = snapshot.rooms.some((room) => room.provider === "daily" && room.status === "pass");
  const livestreamReady = livekitRooms.some((room) => room.roomType === "main_stage" && ["pass", "warn"].includes(room.status));
  const networkingReady = snapshot.rooms.some((room) => room.roomType === "networking_match" && ["pass", "warn", "pending"].includes(room.status)) || snapshot.smokeChecks.some((check) => check.label.toLowerCase().includes("browser console"));
  const criticalIncidents = snapshot.incidents.filter((incident) => incident.status === "open" && incident.platformRecoveryRequired);
  const fallbackDecision = criticalIncidents.length > 0
    ? "Producer intervention required. Try in-platform recovery first, keep Daily ready, and switch to Zoom or Google Meet only if LiveKit/Daily recovery cannot stabilize show-critical rooms."
    : snapshot.goNoGo === "go"
      ? "Proceed with LiveKit as primary. Keep Daily staged and Zoom/Google Meet links visible to crew."
      : "Proceed only with producer monitoring. Re-run browser, mic, network, route, and video checks before showtime.";

  const majorSystems = [
    {
      label: "Livestream / LiveKit primary",
      status: livestreamReady ? "monitor" : "fail",
      detail: livestreamReady ? "Main stage can be monitored; verify room join/token smoke before showtime." : "Main stage livestream readiness is not proven.",
    },
    {
      label: "Daily automatic fallback",
      status: dailyReady && snapshot.dailyAutomaticFallbackEnabled ? "pass" : dailyReady ? "monitor" : "fail",
      detail: dailyReady ? "Daily backup room is staged before Zoom/Google Meet escalation." : "Daily backup room is not ready.",
    },
    {
      label: "Zoom / Google Meet manual fallback",
      status: snapshot.fallbackOrder.some((provider) => provider.includes("zoom")) ? "monitor" : "pending",
      detail: "Use only after LiveKit and Daily are unavailable, unsuitable, or producer declares show-critical failure.",
    },
    {
      label: "Matchmaking / networking",
      status: networkingReady ? "monitor" : "fail",
      detail: "Queue, matching, timer, no-repeat, and fallback context must be visible before opening networking.",
    },
    {
      label: "Run of show",
      status: snapshot.checks.some((check) => check.label.toLowerCase().includes("browser")) ? "monitor" : "pending",
      detail: "Confirm active segment, next cue, delay/skip/complete actions, and backup plan are visible.",
    },
    {
      label: "Route / browser smoke",
      status: snapshot.smokeChecks.some((check) => check.label.toLowerCase().includes("browser") && check.status === "pass") ? "pass" : "monitor",
      detail: "Use local headed Playwright and deployed URL smoke to catch page crashes before showtime.",
    },
  ];

  return (
    <section data-testid="showtime-readiness-barometer" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Showtime readiness</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Go / No-Go barometer for crew and producers</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            This is the pre-show cockpit: livestream readiness, matchmaking, route health, run of show, diagnostics, debug notes, fix guidance, go/no-go review, and backup-room decisions in one place.
          </p>
        </div>
        <div className={`rounded-2xl border px-4 py-3 ${statusClass(snapshot.goNoGo)}`}>
          <p className="text-xs font-semibold uppercase tracking-wide">Current Go / No-Go decision</p>
          <p className="text-2xl font-black">{statusLabel(snapshot.goNoGo)}</p>
          <p className="mt-1 text-xs">Recovery: {statusLabel(snapshot.recoveryMode)}</p>
        </div>
      </div>

      <div data-testid="major-system-health-grid" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {majorSystems.map((system) => (
          <div key={system.label} className={`rounded-2xl border p-4 ${statusClass(system.status)}`}>
            <p className="text-sm font-black">{system.label}</p>
            <p className="mt-2 text-xs leading-5">{system.detail}</p>
          </div>
        ))}
      </div>

      <div data-testid="fallback-decision-helper" className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-black text-slate-950">Fallback decision helper</p>
        <p className="mt-2"><strong>Debug / fix path:</strong> inspect the readiness barometer, browser diagnostics, route health, provider token status, runtime store, and fallback events before switching rooms.</p>
        <p className="mt-2">{fallbackDecision}</p>
        <p className="mt-2"><strong>Fallback order:</strong> {snapshot.fallbackOrder.join(" → ")}.</p>
        <p className="mt-1"><strong>Manual switch rule:</strong> switch to Zoom or Google Meet only after the producer confirms LiveKit/Daily recovery is not enough for the current show-critical segment.</p>
      </div>
    </section>
  );
}
