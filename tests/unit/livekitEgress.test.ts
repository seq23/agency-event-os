import { describe, expect, it } from "vitest";
import { buildLiveKitEgressRequest, buildReplayPublicationEvent, markEgressCompleted, markEgressFailed, markEgressStarted } from "@/services/video";

describe("livekit egress and replay", () => {
  it("models recording lifecycle", () => {
    const request = buildLiveKitEgressRequest({
      agencyId: "agency-1",
      eventId: "event-1",
      roomId: "room-1",
      storageBucket: "replay-assets",
      storagePath: "event-1/main-stage.mp4",
    });

    expect(request.status).toBe("requested");

    const active = markEgressStarted(request, "egress-123");
    expect(active.status).toBe("active");

    const completed = markEgressCompleted(active);
    expect(completed.status).toBe("completed");

    const failed = markEgressFailed(request, "Storage rejected upload");
    expect(failed.status).toBe("failed");
  });

  it("builds replay publication events", () => {
    const event = buildReplayPublicationEvent({
      agencyId: "agency-1",
      eventId: "event-1",
      replayAssetId: "replay-1",
      status: "available",
    });

    expect(event.status).toBe("available");
  });
});
