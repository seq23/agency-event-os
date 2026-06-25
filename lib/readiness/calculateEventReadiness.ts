import type { EventReadiness, ReadinessCategory } from "@/types/readiness";
import type { MockData } from "@/types/core";

function statusFromScore(score: number): ReadinessCategory["status"] {
  if (score >= 85) return "ready";
  if (score >= 65) return "needs_attention";
  if (score >= 40) return "at_risk";
  return "blocked";
}

function category(key: ReadinessCategory["key"], label: string, score: number, missingItems: string[], recommendedActions: string[]): ReadinessCategory {
  return {
    key,
    label,
    score,
    status: statusFromScore(score),
    missingItems,
    recommendedActions,
  };
}

export function calculateEventReadiness(data: MockData, eventId: string): EventReadiness {
  const event = data.events.find((item) => item.id === eventId);
  const approvals = data.approvals.filter((approval) => approval.eventId === eventId);
  const ros = data.runOfShowSegments.filter((segment) => segment.eventId === eventId);
  const speakers = data.speakers.filter((speaker) => speaker.eventId === eventId);
  const sponsors = data.sponsors.filter((sponsor) => sponsor.eventId === eventId);
  const assets = data.assets.filter((asset) => asset.eventId === eventId || asset.clientId === event?.clientId);
  const contractors = data.contractorAssignments.filter((assignment) => assignment.eventId === eventId);
  const vendors = data.vendorAssignments.filter((assignment) => assignment.eventId === eventId);
  const videoRooms = data.videoRooms.filter((room) => room.eventId === eventId);

  const openApprovals = approvals.filter((approval) => !["approved", "locked"].includes(approval.status));
  const unreadyRos = ros.filter((segment) => segment.readinessStatus !== "ready");
  const unreadySpeakers = speakers.filter((speaker) => speaker.readinessStatus !== "ready");
  const unreadySponsors = sponsors.filter((sponsor) => !["live", "report_delivered"].includes(sponsor.status));
  const pendingAssets = assets.filter((asset) => !["approved", "locked"].includes(asset.status));

  const categories = [
    category("event_setup", "Event setup", event ? 82 : 0, event ? [] : ["Event missing"], ["Confirm event basics and lifecycle state."]),
    category("client_approvals", "Client approvals", Math.max(20, 100 - openApprovals.length * 25), openApprovals.map((a) => a.title), ["Resolve open approvals before locking production."]),
    category("run_of_show", "Run of show", Math.max(30, 100 - unreadyRos.length * 25), unreadyRos.map((s) => s.segmentTitle), ["Clear segment blockers and approval gaps."]),
    category("speakers", "Speakers", Math.max(35, 100 - unreadySpeakers.length * 20), unreadySpeakers.map((s) => s.name), ["Collect assets and complete tech checks."]),
    category("sponsors", "Sponsors", Math.max(45, 100 - unreadySponsors.length * 25), unreadySponsors.map((s) => s.name), ["Finalize booth assets and approvals."]),
    category("contractors", "Contractors/crew", contractors.every((c) => c.status === "confirmed") ? 90 : 62, contractors.filter((c) => c.status !== "confirmed").map((c) => c.role), ["Confirm crew call times."]),
    category("vendors", "Vendors", vendors.every((v) => v.status === "confirmed" || v.status === "complete") ? 88 : 60, vendors.filter((v) => !["confirmed", "complete"].includes(v.status)).map((v) => v.serviceCategory), ["Confirm vendor deliverables."]),
    category("assets", "Assets", Math.max(30, 100 - pendingAssets.length * 15), pendingAssets.map((a) => a.name), ["Review and approve submitted assets."]),
    category("venue_configuration", "Venue configuration", videoRooms.length > 0 ? 78 : 25, videoRooms.length > 0 ? [] : ["Video rooms not configured"], ["Confirm stage/session/expo LiveKit room surfaces."]),
    category("rehearsal", "Rehearsal readiness", speakers.every((s) => s.techCheckStatus === "completed") ? 90 : 55, speakers.filter((s) => s.techCheckStatus !== "completed").map((s) => s.name), ["Complete speaker tech checks."]),
    category("reporting", "Reporting setup", event?.reportingEnabled ? 82 : 30, event?.reportingEnabled ? [] : ["Reporting disabled"], ["Confirm report exports and sponsor metrics."]),
  ];

  const overallScore = Math.round(categories.reduce((sum, item) => sum + item.score, 0) / categories.length);

  return {
    eventId,
    overallScore,
    status: statusFromScore(overallScore),
    categories,
  };
}
