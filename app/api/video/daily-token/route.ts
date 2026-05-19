import { NextResponse } from "next/server";
import { buildDefaultTokenPermissions, createVideoRoom, createVideoRoomToken, getVideoFallbackPolicy } from "@/services/video";
import { mapRoomSurfaceToVideoRoomType, buildLiveKitRoomLabel } from "@/services/video/livekitRoomUiService";
import type { LiveKitJoinRequest } from "@/types/livekitRoomUi";

function toSafeError(error: unknown) {
  return error instanceof Error ? error.message : "Unknown Daily fallback failure.";
}

export async function POST(request: Request) {
  try {
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

    const policy = getVideoFallbackPolicy();
    if (!policy.dailyAutomaticFallbackEnabled) {
      return NextResponse.json(
        {
          ok: false,
          error: "Daily automatic fallback is disabled by backend setting.",
        },
        { status: 409 },
      );
    }

    const permissions = buildDefaultTokenPermissions(body.role);
    const room = await createVideoRoom({
      agencyId: body.agencyId ?? `event-${body.eventId}-agency`,
      eventId: body.eventId,
      provider: "daily",
      roomType: mapRoomSurfaceToVideoRoomType(body.roomType),
      label: buildLiveKitRoomLabel({ eventId: body.eventId, roomType: body.roomType }),
      recordingEnabled: false,
      metadata: {
        fallbackFrom: "livekit",
        automaticFallback: true,
      },
    });

    const token = await createVideoRoomToken("daily", {
      roomId: room.providerRoomId ?? room.id,
      eventId: body.eventId,
      displayName: body.displayName,
      profileId: body.profileId,
      role: body.role,
      expiresInSeconds: 60 * 60,
      ...permissions,
    });

    const dailyUrl = room.joinUrl ? `${room.joinUrl}${room.joinUrl.includes("?") ? "&" : "?"}t=${encodeURIComponent(token.token)}` : undefined;

    return NextResponse.json({
      ok: true,
      result: {
        room,
        token,
        dailyUrl,
        fallbackApplied: true,
        fallbackProvider: "daily",
        connectionState: "token_ready",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Daily automatic fallback failed before a room could be prepared.",
        details: toSafeError(error),
      },
      { status: 502 },
    );
  }
}
