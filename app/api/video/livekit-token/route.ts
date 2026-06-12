import { NextResponse } from "next/server";
import { buildResilientVideoJoinResult } from "@/services/video/livekitRoomUiService";
import { canAttendeeJoinLive, canAttendeePublishLive } from "@/services/venue/attendeeLivePermissionService";
import { authorizeVideoTokenRequest } from "@/lib/auth/videoTokenRequestGuard";
import { getCurrentAttendeeIdentity } from "@/services/attendees/attendeeSessionService";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<LiveKitJoinRequest>;

  if (!body.eventId || !body.roomId || !body.roomType || !body.role) {
    return NextResponse.json({ ok: false, error: "eventId, roomId, roomType, and role are required." }, { status: 400 });
  }
  if (body.role !== "attendee" && !body.displayName) {
    return NextResponse.json({ ok: false, error: "displayName is required for non-attendee video roles." }, { status: 400 });
  }

  const auth = await authorizeVideoTokenRequest({ role: body.role, eventId: body.eventId });
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 403 });

  let displayName = body.displayName;
  let profileId = body.profileId;
  let publishPermission: Awaited<ReturnType<typeof canAttendeePublishLive>> | undefined;

  if (body.role === "attendee") {
    const identity = (auth as any).identity || await getCurrentAttendeeIdentity(body.eventId);
    if (!identity) return NextResponse.json({ ok: false, error: "Registered attendee session required for attendee video token." }, { status: 403 });
    displayName = identity.displayName;
    profileId = identity.attendeeId;
    const roomKind = body.roomType === "main_stage" ? "main_stage" : body.roomType === "breakout" ? "breakout" : "session";
    const joinPermission = await canAttendeeJoinLive({ eventId: body.eventId, roomKind, roomId: body.roomId, attendeeId: identity.attendeeId });
    if (!joinPermission.canJoin) return NextResponse.json({ ok: false, error: joinPermission.reason, accessStatus: joinPermission.status }, { status: 403 });
    publishPermission = await canAttendeePublishLive({ eventId: body.eventId, roomKind, roomId: body.roomId, attendeeId: identity.attendeeId });
  }

  const result = await buildResilientVideoJoinResult({
    eventId: body.eventId,
    roomId: body.roomId,
    roomType: body.roomType,
    displayName: displayName || "Registered attendee",
    role: body.role,
    profileId,
    permissionOverride: publishPermission ? { canPublishAudio: publishPermission.canPublishAudio, canPublishVideo: publishPermission.canPublishVideo, canShareScreen: publishPermission.canShareScreen } : undefined,
  });

  return NextResponse.json({ ok: true, result });
}
