import { NextResponse } from "next/server";
import { buildResilientVideoJoinResult } from "@/services/video/livekitRoomUiService";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<LiveKitJoinRequest>;

  if (!body.eventId || !body.roomId || !body.roomType || !body.displayName || !body.role) {
    return NextResponse.json(
      {
        ok: false,
        error: "eventId, roomId, roomType, displayName, and role are required.",
      },
      { status: 400 },
    );
  }

  const result = await buildResilientVideoJoinResult({
    eventId: body.eventId,
    roomId: body.roomId,
    roomType: body.roomType,
    displayName: body.displayName,
    role: body.role,
    profileId: body.profileId,
  });

  return NextResponse.json({
    ok: true,
    result,
  });
}
