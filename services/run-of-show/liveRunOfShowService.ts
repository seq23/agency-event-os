import { getRunOfShowForEvent } from "@/lib/mock/getMockData";
import type { RunOfShowSegment } from "@/types/core";
import type { LiveRunOfShowSegment, RunOfShowLiveStatus, RunOfShowProgressSnapshot } from "@/types/runOfShowLive";

function toLiveStatus(index: number, total: number): RunOfShowLiveStatus {
  if (index < 1) return "completed";
  if (index === 1) return "current";
  if (index === total - 1) return "delayed";
  return "scheduled";
}

function toLiveSegment(segment: RunOfShowSegment, index: number, total: number): LiveRunOfShowSegment {
  const liveStatus = toLiveStatus(index, total);
  return {
    ...segment,
    liveStatus,
    liveReadinessStatus:
      liveStatus === "completed"
        ? "done"
        : liveStatus === "current"
          ? "live"
          : segment.readinessStatus === "ready"
            ? "ready"
            : ["blocked", "at_risk"].includes(segment.readinessStatus)
              ? "needs_attention"
              : "not_ready",
    actualStartAt: liveStatus === "completed" || liveStatus === "current" ? segment.startAt : undefined,
    actualEndAt: liveStatus === "completed" ? segment.endAt : undefined,
    delayMinutes: liveStatus === "delayed" ? 8 : 0,
    liveNotes:
      liveStatus === "current"
        ? "Segment is live. Producer should monitor speaker audio, timing, chat moderation, and next cue readiness."
        : undefined,
    emergencyNotes: liveStatus === "delayed" ? "Watch timing compression before next sponsor mention." : undefined,
    lastUpdatedAt: new Date().toISOString(),
    lastUpdatedByUserId: "user-producer-maya",
  };
}

export function getLiveRunOfShowSegments(eventId: string): LiveRunOfShowSegment[] {
  const segments = getRunOfShowForEvent(eventId);
  return segments.map((segment, index) => toLiveSegment(segment, index, segments.length));
}

export function getRunOfShowProgressSnapshot(eventId: string): RunOfShowProgressSnapshot {
  const liveSegments = getLiveRunOfShowSegments(eventId);
  const currentIndex = liveSegments.findIndex((segment) => segment.liveStatus === "current");
  const currentSegment = liveSegments[currentIndex] ?? liveSegments[0];
  const previousSegment = currentIndex > 0 ? liveSegments[currentIndex - 1] : undefined;
  const nextSegment = currentIndex >= 0 ? liveSegments[currentIndex + 1] : liveSegments[1];
  const completedCount = liveSegments.filter((segment) => segment.liveStatus === "completed").length;
  const totalCount = liveSegments.length || 1;
  const blocked = liveSegments.some((segment) => segment.liveStatus === "blocked");
  const delayed = liveSegments.some((segment) => segment.liveStatus === "delayed");

  return {
    eventId,
    currentSegment,
    previousSegment,
    nextSegment,
    upcomingSegments: currentIndex >= 0 ? liveSegments.slice(currentIndex + 1, currentIndex + 4) : liveSegments.slice(0, 3),
    completedCount,
    totalCount,
    progressPercent: Math.round((completedCount / totalCount) * 100),
    onTimeStatus: blocked ? "blocked" : delayed ? "behind" : currentSegment ? "monitor" : "on_time",
    producerWarning: delayed ? "One upcoming segment is already marked delayed. Prepare compression or transition adjustment." : undefined,
    generatedAt: new Date().toISOString(),
  };
}

export function getCurrentAndNextRunOfShow(eventId: string) {
  const snapshot = getRunOfShowProgressSnapshot(eventId);
  return {
    current: snapshot.currentSegment,
    next: snapshot.nextSegment,
    upcoming: snapshot.upcomingSegments,
  };
}
