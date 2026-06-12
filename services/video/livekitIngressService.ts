import { createHmac } from "crypto";
import { getLiveKitEnv } from "@/lib/env";
import { applyStageStreamSignal, getOrCreateStageStreamState, stageStreamKey } from "@/services/video/stageStreamStateService";
import { getRuntimeStore } from "@/services/runtime/runtimeStoreFactory";

export interface LiveKitIngressProvisioningResult {
  ok: boolean;
  eventId: string;
  stageId: string;
  roomName: string;
  ingressId?: string;
  rtmpUrl?: string;
  streamKey?: string;
  status: "GENERATING_CREDENTIALS" | "READY_FOR_STREAMYARD" | "ERROR_SAFE";
  message: string;
}

function normalizeRoomName(eventId: string, stageId: string) {
  return `${eventId}-${stageId}`.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase();
}

export function normalizeLiveKitApiBaseUrl(livekitUrl: string) {
  const trimmed = livekitUrl.replace(/\/$/, "");
  if (trimmed.startsWith("wss://")) return `https://${trimmed.slice("wss://".length)}`;
  if (trimmed.startsWith("ws://")) return `http://${trimmed.slice("ws://".length)}`;
  return trimmed;
}

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function createLiveKitServerToken(input: { apiKey: string; apiSecret: string; roomName: string }) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({
    iss: input.apiKey,
    sub: "west-peek-live-ingress-provisioner",
    iat: now,
    nbf: now,
    exp: now + 300,
    video: {
      roomCreate: true,
      roomAdmin: true,
      ingressAdmin: true,
      room: input.roomName,
    },
  }));
  const signature = createHmac("sha256", input.apiSecret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
}

async function livekitTwirp<T>(input: { livekitUrl: string; token: string; method: string; body: unknown }): Promise<T> {
  const response = await fetch(`${normalizeLiveKitApiBaseUrl(input.livekitUrl)}/twirp/livekit.${input.method}`, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${input.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(input.body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`LiveKit API ${input.method} failed (${response.status}): ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) as T : {} as T;
}

async function ensureLiveKitRoom(livekitUrl: string, token: string, roomName: string) {
  try {
    await livekitTwirp({ livekitUrl, token, method: "RoomService/CreateRoom", body: { name: roomName, empty_timeout: 300, max_participants: 1000 } });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (!message.includes("already") && !message.includes("exists")) throw error;
  }
}

interface LiveKitIngressInfo {
  ingress_id?: string;
  url?: string;
  stream_key?: string;
  room_name?: string;
}

interface LiveKitIngressListResponse {
  items?: LiveKitIngressInfo[];
  ingress?: LiveKitIngressInfo[];
}

async function findExistingLiveKitIngress(livekitUrl: string, token: string, input: { roomName: string; ingressId: string }) {
  const listed = await livekitTwirp<LiveKitIngressListResponse>({
    livekitUrl,
    token,
    method: "Ingress/ListIngress",
    body: { room_name: input.roomName },
  });
  const items = listed.items || listed.ingress || [];
  return items.find((item) => item.ingress_id === input.ingressId) || null;
}

async function createLiveKitRtmpIngress(livekitUrl: string, token: string, input: { eventId: string; stageId: string; roomName: string }) {
  return livekitTwirp<LiveKitIngressInfo>({
    livekitUrl,
    token,
    method: "Ingress/CreateIngress",
    body: {
      input_type: "RTMP_INPUT",
      name: `StreamYard ${input.eventId} ${input.stageId}`,
      room_name: input.roomName,
      participant_identity: `streamyard-${input.eventId}-${input.stageId}`.replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase(),
      participant_name: "StreamYard Production Feed",
      enable_transcoding: true,
    },
  });
}

export async function provisionStreamYardLiveKitIngress(input: { eventId: string; stageId?: string; actorRole?: string }): Promise<LiveKitIngressProvisioningResult> {
  const stageId = input.stageId || "main-stage";
  const livekit = getLiveKitEnv();
  const roomName = normalizeRoomName(input.eventId, stageId);
  const current = await getOrCreateStageStreamState(input.eventId, stageId);

  if (!livekit.livekitUrl || !livekit.livekitApiKey || !livekit.livekitApiSecret) {
    return { ok: false, eventId: input.eventId, stageId, roomName, status: "ERROR_SAFE", message: "LiveKit server credentials are missing. Set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET before generating StreamYard RTMP credentials." };
  }

  try {
    const token = createLiveKitServerToken({ apiKey: livekit.livekitApiKey, apiSecret: livekit.livekitApiSecret, roomName });
    if (current.livekitIngressId && current.livekitIngressUrl && current.livekitStreamKey) {
      const existingIngress = await findExistingLiveKitIngress(livekit.livekitUrl, token, { roomName, ingressId: current.livekitIngressId });
      if (existingIngress) {
        return { ok: true, eventId: input.eventId, stageId, roomName, ingressId: current.livekitIngressId, rtmpUrl: current.livekitIngressUrl, streamKey: current.livekitStreamKey, status: "READY_FOR_STREAMYARD", message: "Existing StreamYard RTMP credentials are ready and were verified against LiveKit. Reuse these credentials unless the producer intentionally regenerates ingress." };
      }
    }

    await ensureLiveKitRoom(livekit.livekitUrl, token, roomName);
    const ingress = await createLiveKitRtmpIngress(livekit.livekitUrl, token, { eventId: input.eventId, stageId, roomName });
    if (!ingress.ingress_id || !ingress.url || !ingress.stream_key) throw new Error("LiveKit did not return ingress_id, url, and stream_key.");
    const updated = await applyStageStreamSignal({ eventId: input.eventId, stageId, signal: "generate_credentials", reason: "LiveKit RTMP ingress created for StreamYard production." });
    const state = { ...updated, livekitRoomName: roomName, livekitIngressId: ingress.ingress_id, livekitIngressUrl: ingress.url, livekitStreamKey: ingress.stream_key, updatedAt: new Date().toISOString() };
    await getRuntimeStore().setStageStreamState(stageStreamKey(input.eventId, stageId), state);
    return { ok: true, eventId: input.eventId, stageId, roomName, ingressId: ingress.ingress_id, rtmpUrl: ingress.url, streamKey: ingress.stream_key, status: "READY_FOR_STREAMYARD", message: "Ready for StreamYard Connection. Paste the RTMP URL and Stream Key into StreamYard Custom RTMP." };
  } catch (error) {
    return { ok: false, eventId: input.eventId, stageId, roomName, status: "ERROR_SAFE", message: error instanceof Error ? error.message : "LiveKit ingress provisioning failed safely." };
  }
}
