import type {
  BrowserDiagnosticResult,
  BrowserDiagnosticStatus,
  BrowserReadinessSummary,
  NetworkQualityInput,
} from "@/types/browserDiagnostics";

const statusWeight: Record<BrowserDiagnosticStatus, number> = {
  not_started: 0,
  running: 0,
  pass: 1,
  warn: 0.65,
  fail: 0,
  blocked: 0,
};

export function createBrowserDiagnosticResult(input: Omit<BrowserDiagnosticResult, "id" | "measuredAt"> & { id?: string }) {
  return {
    ...input,
    id: input.id ?? `${input.kind}-${Date.now()}`,
    measuredAt: new Date().toISOString(),
  } satisfies BrowserDiagnosticResult;
}

export function classifyNetworkQuality(input: NetworkQualityInput): BrowserDiagnosticResult {
  const downlink = input.downlinkMbps ?? 0;
  const rtt = input.rttMs ?? 0;
  const effectiveType = input.effectiveType ?? "unknown";

  if (input.saveData) {
    return createBrowserDiagnosticResult({
      kind: "network_quality",
      label: "Network quality",
      status: "warn",
      severity: "medium",
      summary: "Data saver is enabled, which may degrade live event media quality.",
      recommendedAction: "Ask the participant to disable data saver or switch to a stronger network before showtime.",
      metadata: { downlinkMbps: downlink, rttMs: rtt, effectiveType, saveData: true },
    });
  }

  if ((downlink > 0 && downlink < 2) || rtt > 600 || ["slow-2g", "2g"].includes(effectiveType)) {
    return createBrowserDiagnosticResult({
      kind: "network_quality",
      label: "Network quality",
      status: "fail",
      severity: "critical",
      summary: "Network conditions are below the production-safe threshold.",
      recommendedAction: "Move to wired ethernet, change Wi-Fi networks, or relocate before joining a live room.",
      metadata: { downlinkMbps: downlink, rttMs: rtt, effectiveType, saveData: false },
    });
  }

  if ((downlink > 0 && downlink < 5) || rtt > 250 || effectiveType === "3g") {
    return createBrowserDiagnosticResult({
      kind: "network_quality",
      label: "Network quality",
      status: "warn",
      severity: "high",
      summary: "Network is usable but fragile for live production.",
      recommendedAction: "Monitor this participant, close bandwidth-heavy apps, and keep a producer recovery path ready.",
      metadata: { downlinkMbps: downlink, rttMs: rtt, effectiveType, saveData: false },
    });
  }

  return createBrowserDiagnosticResult({
    kind: "network_quality",
    label: "Network quality",
    status: "pass",
    severity: "low",
    summary: "Network appears production-safe for browser diagnostics.",
    recommendedAction: "Proceed with room join test and keep monitoring during the live event.",
    metadata: { downlinkMbps: downlink, rttMs: rtt, effectiveType, saveData: false },
  });
}

export function summarizeBrowserReadiness(results: BrowserDiagnosticResult[]): BrowserReadinessSummary {
  if (results.length === 0) {
    return {
      status: "not_ready",
      score: 0,
      blockingFailures: 0,
      warningCount: 0,
      producerSummary: "No browser diagnostics have been run yet.",
    };
  }

  const blockingFailures = results.filter(
    (result) => ["fail", "blocked"].includes(result.status) && ["high", "critical"].includes(result.severity),
  ).length;
  const warningCount = results.filter((result) => result.status === "warn").length;
  const rawScore = results.reduce((sum, result) => sum + statusWeight[result.status], 0) / results.length;
  const score = Math.round(rawScore * 100);
  const status = blockingFailures > 0 ? "not_ready" : warningCount > 0 || score < 85 ? "monitor" : "ready";

  return {
    status,
    score,
    blockingFailures,
    warningCount,
    producerSummary:
      status === "ready"
        ? "Browser diagnostics are production-ready. Continue normal pre-show monitoring."
        : status === "monitor"
          ? "Browser diagnostics are usable with producer monitoring. Resolve warnings before showtime where possible."
          : "Browser diagnostics are not production-ready. Producer intervention is required before this participant joins a live segment.",
  };
}

export function buildTestingIncidentDraft(input: {
  eventId: string;
  result: BrowserDiagnosticResult;
}) {
  return {
    eventId: input.eventId,
    diagnosticType: input.result.kind,
    severity: input.result.severity,
    status: "open" as const,
    title: input.result.label,
    description: input.result.summary,
    recommendedAction: input.result.recommendedAction,
    details: input.result.metadata ?? {},
  };
}
