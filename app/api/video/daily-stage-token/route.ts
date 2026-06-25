/* eslint-disable @typescript-eslint/no-explicit-any -- boundary adapters normalize legacy/runtime payloads before typed domain use */
import { NextResponse } from "next/server";
import { createDailyStageFallbackToken } from "@/services/video/dailyStageFallbackService";
import { getPublicStageStreamState } from "@/services/video/stageStreamStateService";
import { authorizeVideoTokenRequest } from "@/lib/auth/videoTokenRequestGuard";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LiveKitJoinRequest>;
    if (!body.eventId || !body.roomId || !body.roomType || !body.role) {
      return NextResponse.json({ ok: false, error: "eventId, roomId, roomType, and role are required." }, { status: 400 });
    }
    const auth = await authorizeVideoTokenRequest({ role: body.role, eventId: body.eventId });
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: 403 });
    const displayName = body.role === "attendee" ? (auth as any).identity.displayName : body.displayName;
    const profileId = body.role === "attendee" ? (auth as any).identity.attendeeId : body.profileId;
    if (!displayName) return NextResponse.json({ ok: false, error: "displayName is required for non-attendee stage fallback roles." }, { status: 400 });
    const stageState = await getPublicStageStreamState(body.eventId, body.roomId);
    if (stageState.activeStreamSource !== "DAILY" && stageState.streamStatus !== "SWITCHING_TO_DAILY") {
      return NextResponse.json({ ok: false, error: "Daily fallback is not active for this stage." }, { status: 409 });
    }
    const result = await createDailyStageFallbackToken({ ...body, displayName, profileId } as LiveKitJoinRequest);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Daily private stage fallback token could not be issued safely.", details: error instanceof Error ? error.message : "Unknown error" }, { status: 403 });
  }
}
