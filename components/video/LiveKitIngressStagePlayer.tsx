"use client";
import { useEffect, useRef, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer, useTracks, ParticipantTile, GridLayout } from "@livekit/components-react";
import { Track } from "livekit-client";

function IngressTrackView() {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }], { onlySubscribed: false });
  return <GridLayout tracks={tracks} className="min-h-[420px] rounded-2xl bg-slate-950/70 p-3"><ParticipantTile /></GridLayout>;
}

interface Props {
  eventId: string;
  roomId: string;
  displayName: string;
  onIngressDropAfterLive: (reason: string) => void;
  muted: boolean;
  volume: number;
  initialBufferMs?: number;
}

export function LiveKitIngressStagePlayer({ eventId, roomId, displayName, onIngressDropAfterLive, muted, volume, initialBufferMs = 4_000 }: Props) {
  const [token, setToken] = useState<string | undefined>();
  const [serverUrl, setServerUrl] = useState<string | undefined>();
  const [startedOnce, setStartedOnce] = useState(false);
  const [bufferOpen, setBufferOpen] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const fallbackTriggered = useRef(false);
  useEffect(() => {
    const timeout = window.setTimeout(() => setBufferOpen(false), initialBufferMs);
    return () => window.clearTimeout(timeout);
  }, [initialBufferMs]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/video/livekit-token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ eventId, roomId, roomType: "main_stage", displayName, role: "attendee" }) });
        const json = await response.json();
        if (!cancelled) {
          if (json.ok && json.result?.token?.token && json.result?.livekitUrl) { setToken(json.result.token.token); setServerUrl(json.result.livekitUrl); }
          else setError(json.error || "LiveKit stream is not ready yet.");
        }
      } catch { if (!cancelled) setError("LiveKit stream token could not be loaded."); }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId, roomId, displayName]);

  useEffect(() => {
    if (error && startedOnce && !fallbackTriggered.current) {
      fallbackTriggered.current = true;
      onIngressDropAfterLive(error);
    }
  }, [error, startedOnce, onIngressDropAfterLive]);

  if (error && !startedOnce) return <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-900 p-8 text-center text-white"><p>Stage is getting ready. Live stream will begin shortly.</p></div>;
  if (error && startedOnce) return <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-900 p-8 text-center text-white"><p>Switching to backup stream, please hold...</p></div>;
  if (!token || !serverUrl) return <div className="flex aspect-video items-center justify-center rounded-3xl bg-slate-900 p-8 text-center text-white"><p>{bufferOpen ? "Stage is getting ready. Live stream will begin shortly." : "Connecting to LiveKit Ingress feed..."}</p></div>;

  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect audio={!muted} video={false} onConnected={() => setStartedOnce(true)} onDisconnected={() => { if (startedOnce && !bufferOpen && !fallbackTriggered.current) { fallbackTriggered.current = true; onIngressDropAfterLive("LiveKit disconnected after stream had started."); } }} onError={(e) => { if (startedOnce && !bufferOpen && !fallbackTriggered.current) { fallbackTriggered.current = true; onIngressDropAfterLive(e.message); } else setError(e.message); }} className="rounded-3xl border border-white/10 bg-black/40 p-4">
      <IngressTrackView />
      <RoomAudioRenderer />
      <p className="sr-only">Preferred muted state: {muted ? "muted" : "sound on"}; preferred volume: {volume}</p>
    </LiveKitRoom>
  );
}
