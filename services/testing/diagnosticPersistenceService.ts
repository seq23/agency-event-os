import type { DiagnosticIncidentLinkDraft } from "@/types/preVenueHardening";
import type { BrowserDiagnosticResult } from "@/types/browserDiagnostics";

export function shouldCreateIncidentFromDiagnostic(result: BrowserDiagnosticResult) {
  return result.status === "fail" || result.severity === "critical";
}

export function buildDiagnosticIncidentLink(input: DiagnosticIncidentLinkDraft): DiagnosticIncidentLinkDraft {
  return {
    agencyId: input.agencyId,
    eventId: input.eventId,
    diagnosticRunId: input.diagnosticRunId,
    diagnosticResultId: input.diagnosticResultId,
    incidentId: input.incidentId,
    linkReason: input.linkReason || "diagnostic_failure",
  };
}

export function summarizeDiagnosticPersistence(results: BrowserDiagnosticResult[]) {
  const failed = results.filter(shouldCreateIncidentFromDiagnostic);
  return {
    resultCount: results.length,
    failureCount: failed.length,
    incidentRequired: failed.length > 0,
  };
}
