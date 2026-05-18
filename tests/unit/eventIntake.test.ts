import { describe, expect, it } from "vitest";
import { getInboxSummary, getMagicLinksForEvent, getProductionInboxItems } from "@/services/event-intake";

describe("event intake", () => {
  it("returns magic links and inbox items", () => {
    const links = getMagicLinksForEvent("event-summit");
    const items = getProductionInboxItems("event-summit");
    const summary = getInboxSummary("event-summit");

    expect(links.length).toBeGreaterThan(0);
    expect(items.length).toBeGreaterThan(0);
    expect(summary.needsMatching).toBeGreaterThan(0);
  });
});
