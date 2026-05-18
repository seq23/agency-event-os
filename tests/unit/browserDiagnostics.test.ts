import { describe, expect, it } from "vitest";
import {
  buildTestingIncidentDraft,
  classifyNetworkQuality,
  createBrowserDiagnosticResult,
  summarizeBrowserReadiness,
} from "@/services/testing";

describe("real browser diagnostic services", () => {
  it("classifies poor network as a critical failure", () => {
    const result = classifyNetworkQuality({ downlinkMbps: 1.2, rttMs: 700, effectiveType: "3g" });

    expect(result.status).toBe("fail");
    expect(result.severity).toBe("critical");
  });

  it("summarizes readiness from diagnostic results", () => {
    const pass = createBrowserDiagnosticResult({
      kind: "browser_compatibility",
      label: "Browser",
      status: "pass",
      severity: "low",
      summary: "OK",
      recommendedAction: "Proceed",
    });
    const warn = createBrowserDiagnosticResult({
      kind: "microphone_level",
      label: "Mic",
      status: "warn",
      severity: "high",
      summary: "Low input",
      recommendedAction: "Select the correct microphone",
    });

    const summary = summarizeBrowserReadiness([pass, warn]);

    expect(summary.status).toBe("monitor");
    expect(summary.warningCount).toBe(1);
  });

  it("builds testing incident drafts from failed diagnostics", () => {
    const result = createBrowserDiagnosticResult({
      kind: "camera_permission",
      label: "Camera permission",
      status: "blocked",
      severity: "critical",
      summary: "Camera blocked",
      recommendedAction: "Enable camera permission",
    });

    expect(buildTestingIncidentDraft({ eventId: "event-1", result })).toMatchObject({
      eventId: "event-1",
      diagnosticType: "camera_permission",
      severity: "critical",
      status: "open",
    });
  });
});
