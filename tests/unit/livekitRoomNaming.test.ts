import { describe, expect, it } from "vitest";
import { normalizeLiveKitRoomName } from "@/services/video/livekitRoomNaming";

describe("LiveKit room naming", () => {
  it("keeps attendee token room aligned with StreamYard-compatible ingress room", () => {
    expect(normalizeLiveKitRoomName("tier4-event", "main-stage")).toBe("tier4-event-main-stage");
  });
});
