import { describe, expect, it } from "vitest";
import { assetApprovalMatrix, getApprovalSummary, getEventApprovalQueue } from "@/services/approval-ops";

describe("approval ops", () => {
  it("returns approval queue items for event", () => {
    const items = getEventApprovalQueue("event-summit");
    const summary = getApprovalSummary("event-summit");

    expect(items.length).toBeGreaterThan(0);
    expect(summary.blocking).toBeGreaterThan(0);
  });

  it("includes asset approval matrix rules", () => {
    expect(assetApprovalMatrix.some((rule) => rule.assetType === "speaker_deck" && rule.producerLocksFinalUse)).toBe(true);
  });
});
