export type BrowserDiagnosticKind =
  | "camera_permission"
  | "camera_preview"
  | "microphone_permission"
  | "microphone_level"
  | "speaker_tone"
  | "browser_compatibility"
  | "network_quality";

export type BrowserDiagnosticStatus = "not_started" | "running" | "pass" | "warn" | "fail" | "blocked";

export interface BrowserDiagnosticResult {
  id: string;
  kind: BrowserDiagnosticKind;
  label: string;
  status: BrowserDiagnosticStatus;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  recommendedAction: string;
  measuredAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface BrowserReadinessSummary {
  status: "ready" | "monitor" | "not_ready";
  score: number;
  blockingFailures: number;
  warningCount: number;
  producerSummary: string;
}

export interface NetworkQualityInput {
  downlinkMbps?: number;
  effectiveType?: string;
  rttMs?: number;
  saveData?: boolean;
}
