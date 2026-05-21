import { randomId, base64UrlEncode } from "@/lib/security/portableCrypto";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";
import type { StageStreamEvent, StageStreamSignal, StageStreamState } from "@/types/stageStream";
import { toOperatorStageStreamState, toPublicStageStreamState } from "@/types/stageStream";

export function stageStreamKey(eventId: string, stageId = "main-stage") {
  return `${eventId}:${stageId}`;
}

function now() {
  return new Date().toISOString();
}

function defaultStageStreamState(eventId: string, stageId = "main-stage"): StageStreamState {
  const timestamp = now();
  return {
    eventId,
    stageId,
    activeStreamSource: "LIVEKIT_INGRESS",
    producerStudioSource: "STREAMYARD",
    streamStatus: "GENERATING_CREDENTIALS",
    failurePlane: "NONE",
    fallbackMode: "MANUAL_REQUIRED",
    livekitRoomName: `${eventId}-${stageId}`.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase(),
    hasEverStarted: false,
    operatorMarkedShowEnded: false,
    manualFallbackDisabled: false,
    mainStageAttendeeJoinEnabled: false,
    breakoutAttendeeCameraEnabled: true,
    fallbackRecommendation: "Generate StreamYard credentials, connect StreamYard custom RTMP, then wait for LiveKit ingress_started.",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function getOrCreateStageStreamState(eventId: string, stageId = "main-stage") {
  const store = getRuntimeStore();
  const key = stageStreamKey(eventId, stageId);
  const existing = await store.getStageStreamState(key).catch(() => undefined);
  if (existing) return existing;
  const created = defaultStageStreamState(eventId, stageId);
  await store.setStageStreamState(key, created).catch(() => created);
  return created;
}

export async function getPublicStageStreamState(eventId: string, stageId = "main-stage") {
  return toPublicStageStreamState(await getOrCreateStageStreamState(eventId, stageId));
}

export async function getOperatorStageStreamState(eventId: string, stageId = "main-stage") {
  return toOperatorStageStreamState(await getOrCreateStageStreamState(eventId, stageId));
}

function eventFor(state: StageStreamState, signal: StageStreamSignal, previousSource: StageStreamState["activeStreamSource"], message: string): StageStreamEvent {
  return {
    id: randomId("stage-stream"),
    eventId: state.eventId,
    stageId: state.stageId,
    signal,
    previousSource,
    nextSource: state.activeStreamSource,
    failurePlane: state.failurePlane,
    message,
    createdAt: now(),
  };
}

export function evaluateStageFallbackDecision(previous: StageStreamState, signal: StageStreamSignal, reason?: string): StageStreamState {
  const state: StageStreamState = { ...previous, updatedAt: now() };
  if (signal === "generate_credentials") {
    state.streamStatus = "READY_FOR_STREAMYARD";
    state.failurePlane = "NONE";
    state.fallbackMode = "MANUAL_REQUIRED";
    state.activeStreamSource = "LIVEKIT_INGRESS";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackRecommendation = "Credentials are ready. Paste RTMP URL and Stream Key into StreamYard Custom RTMP. Attendees will see the pre-stream card until ingress starts.";
  }
  if (signal === "ingress_started") {
    state.hasEverStarted = true;
    state.streamStatus = "LIVEKIT_INGRESS_LIVE";
    state.failurePlane = "NONE";
    state.fallbackMode = "MANUAL_REQUIRED";
    state.activeStreamSource = "LIVEKIT_INGRESS";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackReason = undefined;
    state.fallbackRecommendation = "StreamYard is connected through LiveKit Ingress. Keep producer stage monitor muted to avoid delayed audio feedback.";
  }
  if (signal === "ingress_ended") {
    state.lastWebhookEvent = "ingress_ended";
    state.lastWebhookAt = now();
    if (state.operatorMarkedShowEnded) {
      state.streamStatus = "ENDED";
      state.failurePlane = "NONE";
      state.fallbackRecommendation = "Show was intentionally ended. Do not activate Daily fallback.";
    } else if (state.hasEverStarted) {
      state.streamStatus = "SWITCHING_TO_DAILY";
      state.failurePlane = "STREAMYARD_FEED";
      state.activeStreamSource = "DAILY";
      state.producerStudioSource = "STREAMYARD";
      state.fallbackMode = state.manualFallbackDisabled ? "MANUAL_REQUIRED" : "AUTO_RECOMMENDED";
      state.fallbackReason = reason || "StreamYard feed stopped after being live.";
      state.fallbackActivatedAt = state.manualFallbackDisabled ? undefined : now();
      state.mainStageAttendeeJoinEnabled = false;
      state.fallbackRecommendation = "StreamYard feed was lost while LiveKit may still be reachable. Default: switch attendees to Daily while production tries to restore StreamYard.";
    } else {
      state.streamStatus = "READY_FOR_STREAMYARD";
      state.failurePlane = "NONE";
      state.fallbackRecommendation = "Ingress ended before the show ever started. Keep attendees on pre-stream state; do not fallback during setup.";
    }
  }
  if (signal === "livekit_room_unreachable" || signal === "livekit_token_failure" || signal === "attendee_livekit_disconnect_after_started") {
    state.streamStatus = "SWITCHING_TO_DAILY";
    state.failurePlane = "LIVEKIT_DISTRIBUTION";
    state.activeStreamSource = "DAILY";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackMode = "AUTO_RECOMMENDED";
    state.fallbackReason = reason || "LiveKit distribution failed while the production source may still be usable.";
    state.fallbackActivatedAt = now();
    state.mainStageAttendeeJoinEnabled = false;
    state.fallbackRecommendation = "LiveKit delivery is degraded. Default: keep StreamYard running for production and switch attendees to Daily. Only abandon StreamYard if producer confirms.";
  }
  if (signal === "manual_switch_to_daily") {
    state.streamStatus = "DAILY_LIVE";
    state.failurePlane = state.failurePlane === "NONE" ? "DAILY_FALLBACK" : state.failurePlane;
    state.activeStreamSource = "DAILY";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackMode = "MANUAL_OVERRIDE";
    state.fallbackReason = reason || "Producer manually switched attendees to Daily.";
    state.fallbackActivatedAt = now();
    state.mainStageAttendeeJoinEnabled = false;
    state.fallbackRecommendation = "Attendees are on Daily. Keep StreamYard running unless the producer chooses to move the production team to Daily.";
  }
  if (signal === "move_production_to_daily") {
    state.streamStatus = "DAILY_LIVE";
    state.failurePlane = "PRIMARY_PIPELINE_TOTAL_FAILURE";
    state.activeStreamSource = "DAILY";
    state.producerStudioSource = "DAILY";
    state.fallbackMode = "MANUAL_OVERRIDE";
    state.fallbackReason = reason || "Producer moved production team and attendees to Daily.";
    state.fallbackActivatedAt = now();
    state.mainStageAttendeeJoinEnabled = false;
    state.fallbackRecommendation = "Primary pipeline is abandoned. Production and attendees are now on Daily.";
  }
  if (signal === "operator_mark_show_ended") {
    state.operatorMarkedShowEnded = true;
    state.streamStatus = "ENDED";
    state.failurePlane = "NONE";
    state.fallbackMode = "MANUAL_OVERRIDE";
    state.fallbackRecommendation = "Show marked ended intentionally. Do not fallback.";
  }
  if (signal === "operator_reset_primary") {
    const reset = defaultStageStreamState(state.eventId, state.stageId);
    return { ...reset, livekitRoomName: state.livekitRoomName, livekitIngressId: state.livekitIngressId, livekitIngressUrl: state.livekitIngressUrl, livekitStreamKey: state.livekitStreamKey, createdAt: state.createdAt, updatedAt: now() };
  }
  return state;
}

export async function applyStageStreamSignal(input: { eventId: string; stageId?: string; signal: StageStreamSignal; reason?: string; webhookEvent?: string }) {
  const current = await getOrCreateStageStreamState(input.eventId, input.stageId || "main-stage");
  const previousSource = current.activeStreamSource;
  const next = evaluateStageFallbackDecision(current, input.signal, input.reason);
  if (input.webhookEvent) {
    next.lastWebhookEvent = input.webhookEvent;
    next.lastWebhookAt = now();
  }
  const store = getRuntimeStore();
  const key = stageStreamKey(next.eventId, next.stageId);
  await store.setStageStreamState(key, next);
  await store.appendStageStreamEvent(eventFor(next, input.signal, previousSource, input.reason || next.fallbackRecommendation || input.signal)).catch(() => undefined);
  return next;
}

export function createStreamKey(eventId: string, stageId: string) {
  const secret = process.env.LIVEKIT_API_SECRET || process.env.V5_ACCESS_COOKIE_SECRET || "dev-only-stage-stream-secret";
  return base64UrlEncode(`${eventId}:${stageId}:${Date.now()}:${randomId("stream")}:${secret}`).slice(0, 48);
}
