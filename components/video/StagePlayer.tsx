"use client";
import { useEffect, useState, useTransition } from "react";
import type { PublicStageStreamState } from "@/types/stageStream";
import { DailyFallbackStagePlayer } from "@/components/video/DailyFallbackStagePlayer";
import { LiveKitIngressStagePlayer } from "@/components/video/LiveKitIngressStagePlayer";
import { StagePreStreamCard } from "@/components/video/StagePreStreamCard";
import { StageSwitchingOverlay } from "@/components/video/StageSwitchingOverlay";
import { useStagePlayerPreferences } from "@/components/video/useStagePlayerPreferences";

interface StagePlayerProps {
  initialState: PublicStageStreamState;
  eventId: string;
  stageId?: string;
  viewerRole?: "attendee" | "producer" | "operator" | "crew" | "admin";
  displayName?: string;
  profileId?: string;
}

export function StagePlayer({ initialState, eventId, stageId = "main-stage", viewerRole = "attendee", displayName = "Attendee", profileId }: StagePlayerProps) {
  const [state, setState] = useState(initialState);
  const [isPending, startTransition] = useTransition();
  const defaultMuted = ["producer", "operator", "crew", "admin"].includes(viewerRole);
  const { preferences, setMuted, setVolume, rememberSource } = useStagePlayerPreferences(defaultMuted);
  useEffect(() => { rememberSource(state.activeStreamSource); }, [state.activeStreamSource, rememberSource]);
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const response = await fetch(`/api/video/stage-stream-state?eventId=${encodeURIComponent(eventId)}&stageId=${encodeURIComponent(stageId)}`);
        const json = await response.json();
        if (!cancelled && json.ok) setState(json.state);
      } catch {}
    }
    hydrate();
    const interval = window.setInterval(hydrate, 10_000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [eventId, stageId]);

  function switchToDaily(reason: string) {
    void (async () => {
      try {
        const response = await fetch(`/api/video/stage-stream-state?eventId=${encodeURIComponent(eventId)}&stageId=${encodeURIComponent(stageId)}`);
        const json = await response.json();
        if (json.ok && (json.state?.activeStreamSource === "DAILY" || json.state?.streamStatus === "SWITCHING_TO_DAILY")) {
          startTransition(() => setState(json.state));
          return;
        }
      } catch {}
      startTransition(() => setState((current) => ({ ...current, streamStatus: "LIVEKIT_DEGRADED", failurePlane: "LIVEKIT_DISTRIBUTION", fallbackRecommendation: `LiveKit connection dropped locally: ${reason}. Waiting for server-confirmed fallback state before mounting Daily.`, updatedAt: new Date().toISOString() })));
    })();
  }

  const shouldShowPreStream = state.activeStreamSource === "LIVEKIT_INGRESS" && !state.hasEverStarted && (state.streamStatus === "GENERATING_CREDENTIALS" || state.streamStatus === "READY_FOR_STREAMYARD" || state.streamStatus === "STREAMYARD_CONNECTED");
  return (
    <div className="relative rounded-3xl bg-slate-950">
      {(isPending || state.streamStatus === "SWITCHING_TO_DAILY") ? <StageSwitchingOverlay message={state.failurePlane === "STREAMYARD_FEED" ? "The production feed is reconnecting. Switching to backup stream..." : "Switching to backup stream, please hold..."} /> : null}
      {shouldShowPreStream ? <StagePreStreamCard /> : state.activeStreamSource === "DAILY" ? <DailyFallbackStagePlayer eventId={eventId} roomId={stageId} displayName={displayName} muted={preferences.muted} volume={preferences.volume} /> : <LiveKitIngressStagePlayer eventId={eventId} roomId={stageId} displayName={displayName} muted={preferences.muted} volume={preferences.volume} onIngressDropAfterLive={switchToDaily} />}
      <div className="flex items-center justify-between gap-3 rounded-b-3xl border-t border-white/10 bg-slate-950 px-4 py-3 text-xs text-slate-300">
        <span>Source: {state.activeStreamSource} · Status: {state.streamStatus}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMuted(!preferences.muted)} className="rounded-full border border-white/15 px-3 py-1 font-bold">{preferences.muted ? "Muted" : "Sound on"}</button>
          <input aria-label="Stage player volume" type="range" min="0" max="1" step="0.05" value={preferences.volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-24" />
        </div>
      </div>
    </div>
  );
}
