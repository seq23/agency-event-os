"use client";
import { useEffect, useState } from "react";
import { DailyVideoRoom } from "@/components/video/DailyVideoRoom";

interface DailyFallbackStagePlayerProps {
  eventId: string;
  roomId: string;
  displayName: string;
  muted: boolean;
  volume: number;
}

export function DailyFallbackStagePlayer({ eventId, roomId, displayName, muted, volume }: DailyFallbackStagePlayerProps) {
  const [dailyUrl, setDailyUrl] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/video/daily-stage-token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ eventId, roomId, roomType: "main_stage", displayName, role: "attendee" }) });
        const json = await response.json();
        if (!cancelled) {
          if (json.ok) setDailyUrl(json.result.dailyUrl);
          else setError(json.error || "Daily fallback is not ready.");
        }
      } catch {
        if (!cancelled) setError("Daily fallback could not be loaded safely.");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [eventId, roomId, displayName]);
  if (error) return <div className="rounded-3xl border border-amber-300/30 bg-amber-950/30 p-6 text-amber-50"><p className="font-black">Backup stream is being prepared.</p><p className="mt-2 text-sm">{error}</p></div>;
  return <DailyVideoRoom roomUrl={dailyUrl} title="Daily backup stage" description={`Backup stream loaded with attendee-safe token. Preferred volume: ${Math.round(volume * 100)}%, muted: ${muted ? "yes" : "no"}.`} />;
}
