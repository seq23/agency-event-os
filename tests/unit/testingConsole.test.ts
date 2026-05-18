import { describe, expect, it } from "vitest";
import { getTestingConsoleSnapshot, requiresProducerRecovery } from "@/services/testing";

describe("testing console service", () => {
  it("returns a diagnostic snapshot for an event", () => {
    const snapshot = getTestingConsoleSnapshot("event-summit");

    expect(snapshot.eventId).toBe("event-summit");
    expect(snapshot.checks.length).toBeGreaterThan(0);
    expect(snapshot.rooms.length).toBeGreaterThan(0);
  });

  it("requires platform recovery when a critical open incident requires it", () => {
    const snapshot = getTestingConsoleSnapshot("event-summit");

    expect(requiresProducerRecovery(snapshot)).toBe(true);
    expect(snapshot.goNoGo).toBe("no_go");
    expect(snapshot.whiteLabelBackupProvider).toBe("zoom");
  });
});
