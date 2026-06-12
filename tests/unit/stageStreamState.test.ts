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
  it("moves StreamYard feed loss to LiveKit plus Cloudflare Stream before Daily", () => {
    const next = evaluateStageFallbackDecision(base(), "ingress_ended");
    expect(next.failurePlane).toBe("STREAMYARD_FEED");
    expect(next.activeStreamSource).toBe("CLOUDFLARE_STREAM");
    expect(next.producerStudioSource).toBe("CLOUDFLARE_STREAM");
    expect(next.fallbackRecommendation).toContain("Cloudflare Stream");
  });

  it("keeps attendees provider-neutral while the backend moves through embedded fallbacks", () => {
    const cloudflare = evaluateStageFallbackDecision(base(), "ingress_ended");
    const daily = evaluateStageFallbackDecision(cloudflare, "cloudflare_stream_failed");
    const zoom = evaluateStageFallbackDecision(daily, "daily_failed");
    const meet = evaluateStageFallbackDecision(zoom, "zoom_failed");
    expect(cloudflare.activeStreamSource).toBe("CLOUDFLARE_STREAM");
    expect(daily.activeStreamSource).toBe("DAILY");
    expect(zoom.activeStreamSource).toBe("ZOOM");
    expect(meet.activeStreamSource).toBe("GOOGLE_MEET");
    expect(meet.fallbackRecommendation).toContain("first rung where attendees may need explicit external-room instructions");
  });

  it("allows owner/showrunner/crew to move back up the ladder", () => {
    const cloudflare = evaluateStageFallbackDecision(base(), "manual_switch_to_cloudflare_stream");
    const daily = evaluateStageFallbackDecision(cloudflare, "manual_switch_to_daily");
    const rollback = evaluateStageFallbackDecision(daily, "operator_rollback_to_cloudflare_stream");
    const primary = evaluateStageFallbackDecision(rollback, "operator_rollback_to_livekit");
    expect(rollback.activeStreamSource).toBe("CLOUDFLARE_STREAM");
    expect(primary.activeStreamSource).toBe("LIVEKIT_INGRESS");
    expect(primary.producerStudioSource).toBe("STREAMYARD");
  });

  it("does not fallback when ingress ends before the stream starts", () => {
    const next = evaluateStageFallbackDecision(base({ hasEverStarted: false, streamStatus: "READY_FOR_STREAMYARD" }), "ingress_ended");
    expect(next.activeStreamSource).toBe("LIVEKIT_INGRESS");
    expect(next.failurePlane).toBe("NONE");
  });
});
