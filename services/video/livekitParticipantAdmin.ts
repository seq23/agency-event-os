import { createHmac } from "crypto";
import { getLiveKitEnv } from "@/lib/env";
import { normalizeLiveKitRoomName } from "@/services/video/livekitRoomNaming";

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function normalizeLiveKitApiBaseUrl(livekitUrl: string) {
  const trimmed = livekitUrl.replace(/\/$/, "");
  if (trimmed.startsWith("wss://")) return `https://${trimmed.slice("wss://".length)}`;
  if (trimmed.startsWith("ws://")) return `http://${trimmed.slice("ws://".length)}`;
  return trimmed;
}

function createRoomAdminToken(input: { apiKey: string; apiSecret: string; roomName: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({
    iss: input.apiKey,
    sub: "west-peek-live-attendee-revoker",
    iat: now,
    nbf: now,
    exp: now + 300,
    video: { roomAdmin: true, room: input.roomName },
  }));
  const signature = createHmac("sha256", input.apiSecret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

async function livekitRoomService(input: { livekitUrl: string; token: string; method: string; body: unknown }) {
  const response = await fetch(`${normalizeLiveKitApiBaseUrl(input.livekitUrl)}/twirp/livekit.RoomService/${input.method}`, {
    method: "POST",
    headers: { authorization: `Bearer ${input.token}`, "content-type": "application/json" },
    body: JSON.stringify(input.body),
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

export async function removeLiveKitParticipantFromMainStage(input: { eventId: string; stageId: string; attendeeId: string }) {
  const livekit = getLiveKitEnv();
  if (!livekit.livekitUrl || !livekit.livekitApiKey || !livekit.livekitApiSecret) {
    return { attempted: false, removed: false, status: "not_configured" as const };
  }
  const roomName = normalizeLiveKitRoomName(input.eventId, input.stageId || "main-stage");
  const token = createRoomAdminToken({ apiKey: livekit.livekitApiKey, apiSecret: livekit.livekitApiSecret, roomName });
  const result = await livekitRoomService({ livekitUrl: livekit.livekitUrl, token, method: "RemoveParticipant", body: { room: roomName, identity: input.attendeeId } });
  if (result.ok) return { attempted: true, removed: true, status: "removed" as const };
  if (/not[ _-]?found|participant/i.test(result.text) && result.status === 404) return { attempted: true, removed: false, status: "participant_not_found" as const };
  return { attempted: true, removed: false, status: "failed" as const, httpStatus: result.status, message: result.text.slice(0, 300) };
}
