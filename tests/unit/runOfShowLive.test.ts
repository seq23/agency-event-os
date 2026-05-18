import { describe, expect, it } from "vitest";
import { getCurrentAndNextRunOfShow, getLiveRunOfShowSegments, getRunOfShowProgressSnapshot } from "@/services/run-of-show";
import { RUN_OF_SHOW_VISIBILITY } from "@/types/runOfShowLive";

describe("live run of show service", () => {
  it("creates live segments for an event", () => {
    const segments = getLiveRunOfShowSegments("event-summit");

    expect(segments.length).toBeGreaterThan(0);
    expect(segments.some((segment) => segment.liveStatus === "current")).toBe(true);
  });

  it("returns current and next segments", () => {
    const result = getCurrentAndNextRunOfShow("event-summit");

    expect(result.current?.liveStatus).toBe("current");
    expect(result.next).toBeDefined();
    expect(result.upcoming.length).toBeGreaterThan(0);
  });

  it("calculates progress snapshot", () => {
    const snapshot = getRunOfShowProgressSnapshot("event-summit");

    expect(snapshot.totalCount).toBeGreaterThan(0);
    expect(snapshot.progressPercent).toBeGreaterThanOrEqual(0);
    expect(snapshot.progressPercent).toBeLessThanOrEqual(100);
  });

  it("keeps client visibility separate from agency visibility", () => {
    expect(RUN_OF_SHOW_VISIBILITY.agency.canSeeInternalNotes).toBe(true);
    expect(RUN_OF_SHOW_VISIBILITY.client.canSeeInternalNotes).toBe(false);
    expect(RUN_OF_SHOW_VISIBILITY.client.canControlLiveStatus).toBe(false);
  });
});
