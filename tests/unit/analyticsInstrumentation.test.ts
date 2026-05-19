import { describe, expect, it } from "vitest";
import { clearV5RuntimeStateForTests, readV5RuntimeStateSnapshot } from "@/services/runtime/v5RuntimeStateStore";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";

describe("analytics instrumentation", () => {
  it("persists required analytics events", async () => {
    clearV5RuntimeStateForTests();
    await recordAnalyticsEvent({ eventId: "event-summit", kind: "attendee_joined_lobby" });
    await recordAnalyticsEvent({ eventId: "event-summit", kind: "sponsor_cta_clicked", subjectId: "sponsor-1" });
    expect(readV5RuntimeStateSnapshot().analyticsEvents).toHaveLength(2);
  });
});
