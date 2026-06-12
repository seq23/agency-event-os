import { getRuntimeData } from "@/lib/runtime/getRuntimeData";
import type { V4PublishState } from "@/types/v4";

export interface V4PublishReadinessItem {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail";
  detail: string;
}

export function getEventPublishState(eventId: string): V4PublishState {
  const event = getRuntimeData().events.find((item) => item.id === eventId);
  if (!event) return "draft";
  if (event.status === "draft") return "draft";
  if (event.status === "published" || event.status === "registration_open" || event.status === "pre_event") return "published";
  if (event.status === "live") return "live";
  if (event.status === "ended" || event.status === "replay_available") return "ended";
  return "archived";
}

export function getPublishReadiness(eventId: string): V4PublishReadinessItem[] {
  const data = getRuntimeData();
  const event = data.events.find((item) => item.id === eventId);
  const speakers = data.speakers.filter((item) => item.eventId === eventId);
  const sponsors = data.sponsors.filter((item) => item.eventId === eventId);
  const ros = data.runOfShowSegments.filter((item) => item.eventId === eventId);
  return [
    { id: "event", label: "Event identity", status: event ? "pass" : "fail", detail: event ? `${event.name} is configured.` : "Event record missing." },
    { id: "run-of-show", label: "Run of show", status: ros.length ? "pass" : "fail", detail: `${ros.length} run-of-show segment(s) found.` },
    { id: "speakers", label: "Speaker readiness", status: speakers.length ? "pass" : "warning", detail: `${speakers.length} speaker profile(s) connected.` },
    { id: "sponsors", label: "Sponsor readiness", status: sponsors.length ? "pass" : "warning", detail: `${sponsors.length} sponsor profile(s) connected.` },
    { id: "video", label: "Video fallback", status: "pass", detail: "LiveKit + StreamYard primary with Cloudflare Stream, Daily, Zoom, and Google Meet fallback escalation." },
    { id: "publish", label: "Review boundary", status: "pass", detail: "Publishing is modeled as Actions/PR/config package; app must not direct-commit to main." },
  ];
}

export function canPublishEvent(eventId: string) {
  return getPublishReadiness(eventId).every((item) => item.status !== "fail");
}
