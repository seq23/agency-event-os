import { describe, expect, it } from "vitest";
import { getChangeControlSummary, getLastMinuteChanges } from "@/services/change-control";

describe("change control", () => {
  it("tracks last-minute changes and review requirements", () => {
    const changes = getLastMinuteChanges("event-summit");
    const summary = getChangeControlSummary("event-summit");

    expect(changes.length).toBeGreaterThan(0);
    expect(summary.total).toBe(changes.length);
    expect(summary.highRisk).toBeGreaterThan(0);
  });
});
