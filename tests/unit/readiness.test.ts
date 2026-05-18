import { describe, expect, it } from "vitest";
import { calculateEventReadiness } from "@/lib/readiness/calculateEventReadiness";
import { mockData } from "@/lib/mock/mockData";

describe("calculateEventReadiness", () => {
  it("returns a readiness score and categories for an event", () => {
    const result = calculateEventReadiness(mockData, "event-summit");
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.categories.length).toBeGreaterThanOrEqual(10);
  });
});
