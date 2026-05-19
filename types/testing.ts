export type DiagnosticStatus = "pass" | "warn" | "fail" | "pending" | "skipped";

export type DiagnosticSeverity = "low" | "medium" | "high" | "critical";

export type WhiteLabelBackupProvider = "none" | "daily" | "zoom" | "google_meet" | "custom_embed" | "phone_bridge";

export interface DiagnosticCheck {
  id: string;
  label: string;
  description: string;
  status: DiagnosticStatus;
  severity: DiagnosticSeverity;
  recommendedAction: string;
  lastRunAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface DeviceDiagnostic {
  id: string;
  kind: "camera" | "microphone" | "speaker" | "network" | "browser" | "permission";
  label: string;
  status: DiagnosticStatus;
  details: string;
  recommendedAction: string;
}

export interface RoomDiagnostic {
  id: string;
  eventId: string;
  roomName: string;
  roomType: "main_stage" | "backstage" | "breakout_session" | "networking_match" | "sponsor_booth" | "rehearsal_room";
  provider: "mock" | "livekit" | "daily" | "zoom_sdk" | "google_meet" | "agora" | "mux" | "twilio" | "other";
  status: DiagnosticStatus;
  joinTestStatus: DiagnosticStatus;
  audioStatus: DiagnosticStatus;
  videoStatus: DiagnosticStatus;
  recordingStatus: DiagnosticStatus;
  latencyMs?: number;
  packetLossPercent?: number;
  recommendedAction: string;
}

export interface TestingIncident {
  id: string;
  eventId: string;
  title: string;
  severity: DiagnosticSeverity;
  status: "open" | "monitoring" | "resolved" | "closed";
  summary: string;
  platformRecoveryRequired: boolean;
  createdAt: string;
}

export interface TestingConsoleSnapshot {
  eventId: string;
  overallStatus: DiagnosticStatus;
  goNoGo: "go" | "monitor" | "no_go";
  recoveryMode: "none" | "retry" | "isolate_room" | "switch_device" | "switch_network" | "open_backup_room" | "producer_intervention";
  whiteLabelBackupProvider: WhiteLabelBackupProvider;
  whiteLabelBackupLabel?: string;
  whiteLabelBackupUrl?: string;
  whiteLabelBackupEnabled: boolean;
  checks: DiagnosticCheck[];
  devices: DeviceDiagnostic[];
  rooms: RoomDiagnostic[];
  incidents: TestingIncident[];
  smokeChecks: DiagnosticCheck[];
  fallbackOrder: string[];
  dailyAutomaticFallbackEnabled: boolean;
  generatedAt: string;
}
