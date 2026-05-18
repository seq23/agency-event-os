import { createHmac, randomUUID } from "crypto";
import type { VideoRoomTokenRequest } from "@/types/video";

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export interface LiveKitTokenEnv {
  apiKey: string;
  apiSecret: string;
}

export function createLiveKitAccessToken(input: {
  env: LiveKitTokenEnv;
  request: VideoRoomTokenRequest;
  roomName: string;
}) {
  if (!input.env.apiKey || !input.env.apiSecret) {
    throw new Error("LiveKit API key and secret are required.");
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + input.request.expiresInSeconds;
  const identity =
    input.request.profileId ??
    input.request.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ??
    randomUUID();

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: input.env.apiKey,
    sub: identity,
    name: input.request.displayName,
    iat: now,
    nbf: now,
    exp: expiresAt,
    jti: randomUUID(),
    video: {
      room: input.roomName,
      roomJoin: true,
      canPublish: input.request.canPublishAudio || input.request.canPublishVideo || input.request.canShareScreen,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true,
    },
    metadata: JSON.stringify({
      role: input.request.role,
      eventId: input.request.eventId,
      profileId: input.request.profileId,
    }),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", input.env.apiSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();

  return {
    token: `${encodedHeader}.${encodedPayload}.${base64UrlEncode(signature)}`,
    participantIdentity: identity,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  };
}
