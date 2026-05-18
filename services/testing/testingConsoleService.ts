import type { DiagnosticStatus, TestingConsoleSnapshot } from "@/types/testing";
import { mockTestingConsoleSnapshot } from "./mockTestingData";

function rankStatus(status: DiagnosticStatus) {
  const ranks: Record<DiagnosticStatus, number> = {
    pass: 0,
    skipped: 1,
    pending: 2,
    warn: 3,
    fail: 4,
  };

  return ranks[status];
}

export function getTestingConsoleSnapshot(eventId: string): TestingConsoleSnapshot {
  const snapshot = {
    ...mockTestingConsoleSnapshot,
    eventId,
    generatedAt: new Date().toISOString(),
    rooms: mockTestingConsoleSnapshot.rooms.map((room) => ({ ...room, eventId })),
    incidents: mockTestingConsoleSnapshot.incidents.map((incident) => ({ ...incident, eventId })),
  };

  const allStatuses = [
    ...snapshot.checks.map((check) => check.status),
    ...snapshot.devices.map((device) => device.status),
    ...snapshot.rooms.map((room) => room.status),
  ];

  const worst = allStatuses.sort((a, b) => rankStatus(b) - rankStatus(a))[0] || "pending";

  const criticalIncident = snapshot.incidents.some((incident) => incident.status === "open" && incident.platformRecoveryRequired);

  return {
    ...snapshot,
    overallStatus: worst,
    goNoGo: criticalIncident || worst === "fail" ? "no_go" : worst === "warn" || worst === "pending" ? "monitor" : "go",
    recoveryMode: criticalIncident ? "producer_intervention" : "none",
    whiteLabelBackupEnabled: snapshot.whiteLabelBackupEnabled,
    whiteLabelBackupProvider: snapshot.whiteLabelBackupProvider,
    whiteLabelBackupLabel: snapshot.whiteLabelBackupLabel,
    whiteLabelBackupUrl: snapshot.whiteLabelBackupUrl,
  };
}

export function requiresProducerRecovery(snapshot: TestingConsoleSnapshot) {
  return snapshot.goNoGo === "no_go" || snapshot.incidents.some((incident) => incident.platformRecoveryRequired && incident.status === "open");
}
