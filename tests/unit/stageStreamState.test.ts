import { describe, expect, it } from "vitest";
import { evaluateStageFallbackDecision } from "@/services/video/stageStreamStateService";
import type { StageStreamState } from "@/types/stageStream";

function base(overrides: Partial<StageStreamState> = {}): StageStreamState {
  return {
    eventId: "event-summit",
    stageId: "main-stage",
    activeStreamSource: "LIVEKIT_INGRESS",
    producerStudioSource: "STREAMYARD",
    streamStatus: "LIVEKIT_INGRESS_LIVE",
    failurePlane: "NONE",
    fallbackMode: "MANUAL_REQUIRED",
    hasEverStarted: true,
    operatorMarkedShowEnded: false,
    manualFallbackDisabled: false,
    mainStageAttendeeJoinEnabled: true,
    breakoutAttendeeCameraEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("stage stream failover decision model", () => {
  it("treats StreamYard feed loss separately from LiveKit distribution loss", () => {
    const next = evaluateStageFallbackDecision(base(), "ingress_ended");
    expect(next.failurePlane).toBe("STREAMYARD_FEED");
    expect(next.activeStreamSource).toBe("DAILY");
    expect(next.producerStudioSource).toBe("STREAMYARD");
  });

  it("keeps StreamYard running when LiveKit distribution fails", () => {
    const next = evaluateStageFallbackDecision(base(), "livekit_room_unreachable");
    expect(next.failurePlane).toBe("LIVEKIT_DISTRIBUTION");
    expect(next.activeStreamSource).toBe("DAILY");
    expect(next.producerStudioSource).toBe("STREAMYARD");
    expect(next.fallbackRecommendation).toContain("keep StreamYard running");
  });

  it("does not fallback when ingress ends before the stream starts", () => {
    const next = evaluateStageFallbackDecision(base({ hasEverStarted: false, streamStatus: "READY_FOR_STREAMYARD" }), "ingress_ended");
    expect(next.activeStreamSource).toBe("LIVEKIT_INGRESS");
    expect(next.failurePlane).toBe("NONE");
  });
});
