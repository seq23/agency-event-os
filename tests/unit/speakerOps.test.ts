import { describe, expect, it } from "vitest";
import { getSpeakerApprovalSummary, getSpeakerGreenRoomSnapshot, getSpeakerReadiness } from "@/services/speaker-ops";

describe("speaker ops", () => {
  it("returns a green room snapshot with approved and pending script versions", () => {
    const snapshot = getSpeakerGreenRoomSnapshot("event-summit");

    expect(snapshot.speakerName).toBe("Drake Speaker");
    expect(snapshot.approvedScriptVersion?.isLiveVersion).toBe(true);
    expect(snapshot.pendingScriptVersion?.status).toBe("needs_review");
  });

  it("summarizes speaker readiness", () => {
    const readiness = getSpeakerReadiness("event-summit");
    const summary = getSpeakerApprovalSummary("event-summit");

    expect(readiness.checklist.length).toBeGreaterThan(0);
    expect(summary.approvedItems).toBe(summary.totalItems);
  });
});
