function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function base(eventId = "demo", stageId = "main-stage") {
  return {
    eventId,
    stageId,
    activeStreamSource: "LIVEKIT_INGRESS",
    producerStudioSource: "STREAMYARD",
    streamStatus: "GENERATING_CREDENTIALS",
    failurePlane: "NONE",
    fallbackMode: "MANUAL_REQUIRED",
    hasEverStarted: false,
    operatorMarkedShowEnded: false,
    manualFallbackDisabled: false,
    mainStageAttendeeJoinEnabled: false,
    fallbackRecommendation: "Generate StreamYard credentials, connect StreamYard custom RTMP, then wait for LiveKit ingress_started.",
  };
}

function evaluate(previous, signal, reason) {
  const state = { ...previous };
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
    state.activeStreamSource = "LIVEKIT_INGRESS";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackRecommendation = "StreamYard is connected through LiveKit Ingress. Keep producer stage monitor muted to avoid delayed audio feedback.";
  }
  if (signal === "ingress_ended") {
    if (state.hasEverStarted) {
      state.streamStatus = "SWITCHING_TO_DAILY";
      state.failurePlane = "STREAMYARD_FEED";
      state.activeStreamSource = "DAILY";
      state.producerStudioSource = "STREAMYARD";
      state.fallbackMode = "AUTO_RECOMMENDED";
      state.fallbackReason = reason || "StreamYard feed stopped after being live.";
      state.mainStageAttendeeJoinEnabled = false;
      state.fallbackRecommendation = "StreamYard feed was lost while LiveKit may still be reachable. Default: switch attendees to Daily while production tries to restore StreamYard.";
    } else {
      state.streamStatus = "READY_FOR_STREAMYARD";
      state.failurePlane = "NONE";
    }
  }
  if (["livekit_room_unreachable", "livekit_token_failure", "attendee_livekit_disconnect_after_started"].includes(signal)) {
    state.streamStatus = "SWITCHING_TO_DAILY";
    state.failurePlane = "LIVEKIT_DISTRIBUTION";
    state.activeStreamSource = "DAILY";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackMode = "AUTO_RECOMMENDED";
    state.fallbackRecommendation = "LiveKit delivery is degraded. Default: keep StreamYard running for production and switch attendees to Daily. Only abandon StreamYard if producer confirms.";
  }
  if (signal === "manual_switch_to_daily") {
    state.streamStatus = "DAILY_LIVE";
    state.failurePlane = state.failurePlane === "NONE" ? "DAILY_FALLBACK" : state.failurePlane;
    state.activeStreamSource = "DAILY";
    state.producerStudioSource = "STREAMYARD";
    state.fallbackMode = "MANUAL_OVERRIDE";
    state.mainStageAttendeeJoinEnabled = false;
    state.fallbackRecommendation = "Attendees are on Daily. Keep StreamYard running unless the producer chooses to move the production team to Daily.";
  }
  return state;
}

let state = base();
state = evaluate(state, "generate_credentials");
assert(state.streamStatus === "READY_FOR_STREAMYARD", "generate_credentials must produce READY_FOR_STREAMYARD");
assert(state.activeStreamSource === "LIVEKIT_INGRESS", "credentials state must keep LiveKit ingress as attendee distribution path");
assert(state.producerStudioSource === "STREAMYARD", "credentials state must identify StreamYard as production source");

state = evaluate(state, "ingress_started");
assert(state.streamStatus === "LIVEKIT_INGRESS_LIVE", "ingress_started must produce LIVEKIT_INGRESS_LIVE");
assert(state.hasEverStarted === true, "ingress_started must mark hasEverStarted");
assert(state.producerStudioSource === "STREAMYARD", "live ingress must preserve StreamYard production source");

const streamyardLoss = evaluate(state, "ingress_ended", "mock StreamYard feed stopped");
assert(streamyardLoss.failurePlane === "STREAMYARD_FEED", "ingress_ended after live must classify STREAMYARD_FEED");
assert(streamyardLoss.activeStreamSource === "DAILY", "StreamYard feed loss must move attendees toward Daily");
assert(/StreamYard feed/.test(streamyardLoss.fallbackRecommendation), "StreamYard loss recommendation must mention StreamYard feed");

const livekitLoss = evaluate(state, "livekit_room_unreachable", "mock LiveKit distribution stopped");
assert(livekitLoss.failurePlane === "LIVEKIT_DISTRIBUTION", "LiveKit delivery failure must classify LIVEKIT_DISTRIBUTION");
assert(livekitLoss.producerStudioSource === "STREAMYARD", "LiveKit distribution failure must keep StreamYard running");
assert(/keep StreamYard running/.test(livekitLoss.fallbackRecommendation), "LiveKit loss recommendation must say keep StreamYard running");

const daily = evaluate(state, "manual_switch_to_daily", "operator manual fallback");
assert(daily.streamStatus === "DAILY_LIVE", "manual_switch_to_daily must produce DAILY_LIVE");
assert(daily.activeStreamSource === "DAILY", "manual_switch_to_daily must set active stream source to Daily");
assert(daily.producerStudioSource === "STREAMYARD", "manual attendee fallback must not abandon StreamYard production source");

console.log("streamyard_livekit_mock_transactional_probe: PASS — app-side StreamYard/LiveKit/Daily state transitions proven with mocked provider semantics; real media/provider proof is separate.");
