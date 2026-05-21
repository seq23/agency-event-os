export type StageStreamSource = "LIVEKIT_INGRESS" | "DAILY";
export type ProducerStudioSource = "STREAMYARD" | "DAILY" | "UNKNOWN";
export type StreamFailurePlane = "NONE" | "STREAMYARD_FEED" | "LIVEKIT_DISTRIBUTION" | "PRIMARY_PIPELINE_TOTAL_FAILURE" | "DAILY_FALLBACK" | "UNKNOWN";
export type StageFallbackMode = "AUTO_RECOMMENDED" | "AUTO_SWITCHED" | "MANUAL_REQUIRED" | "MANUAL_OVERRIDE";
export type StageStreamStatus =
  | "GENERATING_CREDENTIALS"
  | "READY_FOR_STREAMYARD"
  | "STREAMYARD_CONNECTED"
  | "LIVEKIT_INGRESS_LIVE"
  | "LIVEKIT_DEGRADED"
  | "STREAMYARD_FEED_LOST"
  | "SWITCHING_TO_DAILY"
  | "DAILY_LIVE"
  | "ENDED"
  | "ERROR_SAFE";

export type StageStreamSignal =
  | "generate_credentials"
  | "ingress_started"
  | "ingress_ended"
  | "livekit_room_unreachable"
  | "livekit_token_failure"
  | "attendee_livekit_disconnect_after_started"
  | "manual_switch_to_daily"
  | "move_production_to_daily"
  | "operator_mark_show_ended"
  | "operator_reset_primary";

export interface StageStreamState {
  eventId: string;
  stageId: string;
  activeStreamSource: StageStreamSource;
  producerStudioSource: ProducerStudioSource;
  streamStatus: StageStreamStatus;
  failurePlane: StreamFailurePlane;
  fallbackMode: StageFallbackMode;
  livekitRoomName?: string;
  livekitIngressId?: string;
  livekitIngressUrl?: string;
  livekitStreamKey?: string;
  dailyRoomName?: string;
  dailyRoomUrl?: string;
  hasEverStarted: boolean;
  operatorMarkedShowEnded: boolean;
  manualFallbackDisabled: boolean;
  mainStageAttendeeJoinEnabled: boolean;
  breakoutAttendeeCameraEnabled: boolean;
  lastWebhookEvent?: string;
  lastWebhookAt?: string;
  lastHealthCheckAt?: string;
  fallbackReason?: string;
  fallbackRecommendation?: string;
  fallbackActivatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StageStreamEvent {
  id: string;
  eventId: string;
  stageId: string;
  signal: StageStreamSignal;
  previousSource?: StageStreamSource;
  nextSource: StageStreamSource;
  failurePlane: StreamFailurePlane;
  message: string;
  createdAt: string;
}

export interface PublicStageStreamState {
  eventId: string;
  stageId: string;
  activeStreamSource: StageStreamSource;
  producerStudioSource: ProducerStudioSource;
  streamStatus: StageStreamStatus;
  failurePlane: StreamFailurePlane;
  fallbackMode: StageFallbackMode;
  hasEverStarted: boolean;
  mainStageAttendeeJoinEnabled: boolean;
  breakoutAttendeeCameraEnabled: boolean;
  fallbackReason?: string;
  fallbackRecommendation?: string;
  updatedAt: string;
}

export interface OperatorStageStreamState extends PublicStageStreamState {
  livekitRoomName?: string;
  livekitIngressId?: string;
  livekitIngressUrl?: string;
  livekitStreamKey?: string;
  dailyRoomName?: string;
  dailyRoomUrl?: string;
  lastWebhookEvent?: string;
  lastWebhookAt?: string;
  lastHealthCheckAt?: string;
  operatorMarkedShowEnded: boolean;
  manualFallbackDisabled: boolean;
}

export function toPublicStageStreamState(state: StageStreamState): PublicStageStreamState {
  return {
    eventId: state.eventId,
    stageId: state.stageId,
    activeStreamSource: state.activeStreamSource,
    producerStudioSource: state.producerStudioSource,
    streamStatus: state.streamStatus,
    failurePlane: state.failurePlane,
    fallbackMode: state.fallbackMode,
    hasEverStarted: state.hasEverStarted,
    mainStageAttendeeJoinEnabled: state.mainStageAttendeeJoinEnabled,
    breakoutAttendeeCameraEnabled: state.breakoutAttendeeCameraEnabled,
    fallbackReason: state.fallbackReason,
    fallbackRecommendation: state.fallbackRecommendation,
    updatedAt: state.updatedAt,
  };
}

export function toOperatorStageStreamState(state: StageStreamState): OperatorStageStreamState {
  return {
    ...toPublicStageStreamState(state),
    livekitRoomName: state.livekitRoomName,
    livekitIngressId: state.livekitIngressId,
    livekitIngressUrl: state.livekitIngressUrl,
    livekitStreamKey: state.livekitStreamKey,
    dailyRoomName: state.dailyRoomName,
    dailyRoomUrl: state.dailyRoomUrl,
    lastWebhookEvent: state.lastWebhookEvent,
    lastWebhookAt: state.lastWebhookAt,
    lastHealthCheckAt: state.lastHealthCheckAt,
    operatorMarkedShowEnded: state.operatorMarkedShowEnded,
    manualFallbackDisabled: state.manualFallbackDisabled,
  };
}
