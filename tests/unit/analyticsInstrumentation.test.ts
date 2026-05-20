import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearV5RuntimeStateForTests, readV5RuntimeStateSnapshot } from "@/services/runtime/v5RuntimeStateStore";
import { setRuntimeStoreForTests } from "@/services/runtime/runtimeStoreFactory";
import { FileRuntimeStore } from "@/services/runtime/fileRuntimeStore";
import { recordAnalyticsEvent } from "@/services/analytics/analyticsEventService";

describe("analytics instrumentation", () => {
  const originalRuntimeStore = process.env.AGENCY_EVENT_OS_RUNTIME_STORE;

  beforeEach(() => {
    process.env.AGENCY_EVENT_OS_RUNTIME_STORE = "file";
    setRuntimeStoreForTests(new FileRuntimeStore());
    clearV5RuntimeStateForTests();
  });

  afterEach(() => {
    setRuntimeStoreForTests(undefined);
    if (originalRuntimeStore === undefined) delete process.env.AGENCY_EVENT_OS_RUNTIME_STORE;
    else process.env.AGENCY_EVENT_OS_RUNTIME_STORE = originalRuntimeStore;
    clearV5RuntimeStateForTests();
  });

  it("persists required analytics events", async () => {
    await recordAnalyticsEvent({ eventId: "event-summit", kind: "attendee_joined_lobby" });
    await recordAnalyticsEvent({ eventId: "event-summit", kind: "sponsor_cta_clicked", subjectId: "sponsor-1" });
    expect(readV5RuntimeStateSnapshot().analyticsEvents).toHaveLength(2);
  });
});
