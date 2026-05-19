import { afterEach, describe, expect, it } from "vitest";
import { getTestingConsoleSnapshot, requiresProducerRecovery } from "@/services/testing";

describe("testing console service", () => {
  afterEach(() => {
    delete process.env.DAILY_API_KEY;
    delete process.env.DAILY_DOMAIN;
    delete process.env.DAILY_API_BASE_URL;
    delete process.env.DAILY_FALLBACK_ENABLED;
  });

  it("returns a diagnostic snapshot for an event", () => {
    process.env.DAILY_API_KEY = "daily-key";
    process.env.DAILY_API_BASE_URL = "https://api.daily.co/v1";
    process.env.DAILY_DOMAIN = "westpeeklive.daily.co";
    process.env.DAILY_FALLBACK_ENABLED = "true";
    const snapshot = getTestingConsoleSnapshot("event-summit");

    expect(snapshot.eventId).toBe("event-summit");
    expect(snapshot.checks.length).toBeGreaterThan(0);
    expect(snapshot.rooms.length).toBeGreaterThan(0);
    expect(snapshot.smokeChecks.length).toBeGreaterThan(0);
    expect(snapshot.fallbackOrder).toContain("daily");
  });

  it("requires platform recovery when a critical open incident requires it", () => {
    process.env.DAILY_API_KEY = "daily-key";
    process.env.DAILY_API_BASE_URL = "https://api.daily.co/v1";
    process.env.DAILY_DOMAIN = "westpeeklive.daily.co";
    process.env.DAILY_FALLBACK_ENABLED = "true";
    const snapshot = getTestingConsoleSnapshot("event-summit");

    expect(requiresProducerRecovery(snapshot)).toBe(true);
    expect(snapshot.goNoGo).toBe("no_go");
    expect(snapshot.whiteLabelBackupProvider).toBe("daily");
  });
});
