import { NextResponse } from "next/server";
import { authorizeVideoTokenRequest } from "@/lib/auth/videoTokenRequestGuard";
import { generateZoomMeetingSdkSignature } from "@/services/video/zoomMeetingSdkAuth";
import type { VideoParticipantRole } from "@/types/video";

const allowedVideoRoles = new Set<VideoParticipantRole>([
  "producer",
  "host",
  "speaker",
  "sponsor",
  "attendee",
  "contractor",
  "client",
  "observer",
]);

function coerceVideoRole(value: unknown, zoomRole: 0 | 1): VideoParticipantRole {
  if (typeof value === "string" && allowedVideoRoles.has(value as VideoParticipantRole)) return value as VideoParticipantRole;
  return zoomRole === 1 ? "producer" : "attendee";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const meetingNumber = String(body.meetingNumber ?? "").replace(/\s/g, "");
    const eventId = String(body.eventId ?? "").trim();
    const zoomRole: 0 | 1 = Number(body.zoomRole ?? body.meetingRole ?? body.role ?? 0) === 1 ? 1 : 0;
    const videoRole = coerceVideoRole(body.videoRole ?? body.participantRole ?? (typeof body.role === "string" ? body.role : undefined), zoomRole);

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required for Zoom fallback authorization." }, { status: 400 });
    }
    if (!meetingNumber || !/^\d{9,12}$/.test(meetingNumber)) {
      return NextResponse.json({ error: "A valid room number is required." }, { status: 400 });
    }

    const auth = await authorizeVideoTokenRequest({ role: videoRole, eventId });
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 403 });

    const signature = generateZoomMeetingSdkSignature({ meetingNumber, role: zoomRole });

    return NextResponse.json({ ok: true, result: { ...signature, eventId, videoRole } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Zoom embedded room could not be prepared.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
