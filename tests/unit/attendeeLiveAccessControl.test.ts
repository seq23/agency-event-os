import { describe, expect, it } from "vitest";
import { defaultLiveControlState, evaluateAttendeeLiveAccess } from "@/services/venue/attendeeLivePermissionService";
import type { AttendeeLiveCapability } from "@/types/attendeeLive";

const baseCapability: AttendeeLiveCapability = {
  eventId: "event-summit",
  roomKind: "main_stage",
  roomId: "main-stage",
  attendeeId: "attendee-sam",
  canJoinLiveStream: true,
  canPublishCamera: false,
  canPublishMicrophone: false,
  canShareScreen: false,
  approvedForStage: false,
  revoked: false,
  updatedAt: "2026-06-12T00:00:00.000Z",
};

describe("attendee live stream access control", () => {
  it("allows attendee consumption by default when join approval is not required", () => {
    const control = defaultLiveControlState("event-summit", "main_stage", "main-stage");
    expect(evaluateAttendeeLiveAccess({ control, roomKind: "main_stage" }).canJoin).toBe(true);
  });

  it("requires permit when the owner/showrunner/crew enables live-stage join approval", () => {
    const control = { ...defaultLiveControlState("event-summit", "main_stage", "main-stage"), attendeeJoinRequiresApproval: true };
    expect(evaluateAttendeeLiveAccess({ control, roomKind: "main_stage" })).toMatchObject({ canJoin: false, status: "waiting_for_approval" });
    expect(evaluateAttendeeLiveAccess({ control, capability: baseCapability, roomKind: "main_stage" })).toMatchObject({ canJoin: true, status: "permitted" });
  });

  it("revokes and re-permits attendee live consumption independently from publishing", () => {
    const control = { ...defaultLiveControlState("event-summit", "main_stage", "main-stage"), attendeeJoinRequiresApproval: true };
    const revoked = { ...baseCapability, canJoinLiveStream: false, revoked: true, revokedReason: "Removed by showrunner." };
    expect(evaluateAttendeeLiveAccess({ control, capability: revoked, roomKind: "main_stage" })).toMatchObject({ canJoin: false, status: "revoked" });
    const rePermitted = { ...revoked, canJoinLiveStream: true, revoked: false, revokedReason: undefined };
    expect(evaluateAttendeeLiveAccess({ control, capability: rePermitted, roomKind: "main_stage" })).toMatchObject({ canJoin: true, status: "permitted" });
  });
});
