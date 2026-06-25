"use client";
import { useEffect, useState, useTransition } from "react";
import type { PublicStageStreamState } from "@/types/stageStream";
import { CloudflareStreamFallbackStagePlayer } from "@/components/video/CloudflareStreamFallbackStagePlayer";
import { DailyFallbackStagePlayer } from "@/components/video/DailyFallbackStagePlayer";
import { GoogleMeetFallbackStagePlayer } from "@/components/video/GoogleMeetFallbackStagePlayer";
import { LiveKitIngressStagePlayer } from "@/components/video/LiveKitIngressStagePlayer";
import { StagePreStreamCard } from "@/components/video/StagePreStreamCard";
import { StageSwitchingOverlay } from "@/components/video/StageSwitchingOverlay";
import { ZoomEmbeddedRoom } from "@/components/video/ZoomEmbeddedRoom";
import { useStagePlayerPreferences } from "@/components/video/useStagePlayerPreferences";

interface StagePlayerProps {
  initialState: PublicStageStreamState;
  eventId: string;
  stageId?: string;
  viewerRole?: "attendee" | "producer" | "operator" | "crew" | "admin";
  displayName?: string;
  profileId?: string;
}

function isBackendViewer(role: StagePlayerProps["viewerRole"]) {
  return ["producer", "operator", "crew", "admin"].includes(role || "attendee");
}

function attendeeOverlayMessage(state: PublicStageStreamState) {
  if (state.activeStreamSource === "GOOGLE_MEET") return "Opening the final backup room...";
  return "Refreshing the live stream. Please stay on this page...";
}

export function StagePlayer({ initialState, eventId, stageId = "main-stage", viewerRole = "attendee", displayName = "Attendee" }: StagePlayerProps) {
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const backendViewer = isBackendViewer(viewerRole);
  const defaultMuted = backendViewer;
  const { preferences, setMuted, setVolume, rememberSource } = useStagePlayerPreferences(defaultMuted);
  useEffect(() => { rememberSource(state.activeStreamSource); }, [state.activeStreamSource, rememberSource]);
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const response = await fetch(`/api/video/stage-stream-state?eventId=${encodeURIComponent(eventId)}&stageId=${encodeURIComponent(stageId)}${backendViewer ? "&view=operator" : ""}`);
        const json = await response.json();
        if (!cancelled && json.ok) setState(json.state);
      } catch {}
    }
    hydrate();
    const interval = window.setInterval(hydrate, 10_000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [eventId, stageId, backendViewer]);

  function requestServerFallback(signal: "attendee_livekit_disconnect_after_started" | "cloudflare_stream_failed" | "daily_failed" | "zoom_failed", reason: string) {
    void (async () => {
      try {
        const response = await fetch(`/api/video/stage-stream-state?eventId=${encodeURIComponent(eventId)}&stageId=${encodeURIComponent(stageId)}${backendViewer ? "&view=operator" : ""}`);
        const json = await response.json();
        if (json.ok && json.state?.activeStreamSource !== state.activeStreamSource) {
          startTransition(() => setState(json.state));
          return;
        }
      } catch {}
      startTransition(() => setState((current) => ({ ...current, streamStatus: current.activeStreamSource === "GOOGLE_MEET" ? "SWITCHING_TO_GOOGLE_MEET" : "LIVEKIT_DEGRADED", failurePlane: signal === "attendee_livekit_disconnect_after_started" ? "LIVEKIT_DISTRIBUTION" : current.failurePlane, fallbackRecommendation: `Connection issue detected: ${reason}. Waiting for server-confirmed fallback state.`, updatedAt: new Date().toISOString() })));
    })();
  }

  const shouldShowPreStream = state.activeStreamSource === "LIVEKIT_INGRESS" && !state.hasEverStarted && (state.streamStatus === "GENERATING_CREDENTIALS" || state.streamStatus === "READY_FOR_STREAMYARD" || state.streamStatus === "STREAMYARD_CONNECTED");
  const switching = isPending || /^SWITCHING_TO_/.test(state.streamStatus);
  const player = shouldShowPreStream ? <StagePreStreamCard />
    : state.activeStreamSource === "CLOUDFLARE_STREAM" ? <CloudflareStreamFallbackStagePlayer playbackUrl={state.cloudflareStreamPlaybackUrl} />
    : state.activeStreamSource === "DAILY" ? <DailyFallbackStagePlayer eventId={eventId} roomId={stageId} displayName={displayName} muted={preferences.muted} volume={preferences.volume} />
    : state.activeStreamSource === "ZOOM" ? <ZoomEmbeddedRoom config={{ providerMode: "zoom_embedded", roomKind: "stage", roomLabel: "West Peek Live! Backup Room", displayName, zoomMeetingNumber: state.zoomMeetingNumber, attendeeSafeStatus: "opening" }} eventId={eventId} userName={displayName} />
    : state.activeStreamSource === "GOOGLE_MEET" ? <GoogleMeetFallbackStagePlayer fallbackUrl={state.googleMeetFallbackUrl} />
    : <LiveKitIngressStagePlayer eventId={eventId} roomId={stageId} displayName={displayName} muted={preferences.muted} volume={preferences.volume} onIngressDropAfterLive={(reason) => requestServerFallback("attendee_livekit_disconnect_after_started", reason)} />;

  return (
    <div className="relative rounded-3xl bg-slate-950" data-testid="stage-player" data-active-stream-source={state.activeStreamSource} data-stream-status={state.streamStatus}>
      {switching ? <StageSwitchingOverlay message={backendViewer ? `${state.activeStreamSource.replaceAll("_", " ")} transition in progress...` : attendeeOverlayMessage(state)} /> : null}
      {player}
      <div className="flex items-center justify-between gap-3 rounded-b-3xl border-t border-white/10 bg-slate-950 px-4 py-3 text-xs text-slate-300">
        <span>{backendViewer ? `Source: ${state.activeStreamSource} · Status: ${state.streamStatus}` : state.activeStreamSource === "GOOGLE_MEET" ? "Final backup room active" : "Live stage connected"}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMuted(!preferences.muted)} className="rounded-full border border-white/15 px-3 py-1 font-bold">{preferences.muted ? "Muted" : "Sound on"}</button>
          <input aria-label="Stage player volume" type="range" min="0" max="1" step="0.05" value={preferences.volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24" />
        </div>
      </div>
      <p className="sr-only">Attendee-facing player hides provider changes until final external-room continuity is required.</p>
    </div>
  );
}
