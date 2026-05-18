import { describe, expect, it } from "vitest";
import { getSponsorFulfillmentSummary, getSponsorPackage, getSponsorReadyRoomSnapshot } from "@/services/sponsor-ops";

describe("sponsor ops", () => {
  it("returns sponsor package deliverables", () => {
    const sponsorPackage = getSponsorPackage("event-summit");

    expect(sponsorPackage.tierName).toBe("Gold Sponsor");
    expect(sponsorPackage.deliverables.length).toBeGreaterThan(0);
  });

  it("returns sponsor ready room snapshot", () => {
    const snapshot = getSponsorReadyRoomSnapshot("event-summit");
    const summary = getSponsorFulfillmentSummary("event-summit");

    expect(snapshot.sponsorName).toBe("Clarity AI");
    expect(summary.totalDeliverables).toBeGreaterThan(0);
  });
});
