import { describe, expect, it } from "vitest";
import { mockData } from "@/lib/mock/mockData";

describe("mock data", () => {
  it("contains the WPP agency and multiple clients/events", () => {
    expect(mockData.agencies[0]?.name).toBe("West Peek Productions");
    expect(mockData.clients.length).toBeGreaterThanOrEqual(3);
    expect(mockData.events.length).toBeGreaterThanOrEqual(5);
  });

  it("maps every event to a client", () => {
    for (const event of mockData.events) {
      expect(mockData.clients.some((client) => client.id === event.clientId)).toBe(true);
    }
  });

  it("contains production-critical mock surfaces", () => {
    expect(mockData.runOfShowSegments.length).toBeGreaterThan(0);
    expect(mockData.tasks.length).toBeGreaterThan(0);
    expect(mockData.approvals.length).toBeGreaterThan(0);
    expect(mockData.auditLogs.length).toBeGreaterThan(0);
  });
});
