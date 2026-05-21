import { NextResponse } from "next/server";
import { applyStageStreamSignal } from "@/services/video/stageStreamStateService";

function base64UrlEncode(bytes: Uint8Array) {
  let raw = "";
  for (let index = 0; index < bytes.length; index += 1) raw += String.fromCharCode(bytes[index]);
  return btoa(raw).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}

async function hmacSha256Hex(secret: string, body: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Base64Url(secret: string, body: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return base64UrlEncode(new Uint8Array(signature));
}

function base64UrlDecode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new TextDecoder().decode(bytes);
}

function timingSafeEqualText(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifyHmacWebhook(body: string, signature: string | null) {
  const secret = process.env.LIVEKIT_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = await hmacSha256Hex(secret, body);
  return timingSafeEqualText(expected, signature.replace(/^sha256=/, ""));
}

async function verifyLiveKitBearerToken(token: string | null) {
  const secret = process.env.LIVEKIT_API_SECRET;
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;
  const expected = await hmacSha256Base64Url(secret, `${header}.${payload}`);
  if (!timingSafeEqualText(expected, signature)) return false;
  try {
    const parsed = JSON.parse(base64UrlDecode(payload)) as { exp?: number; iss?: string };
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) return false;
    if (process.env.LIVEKIT_API_KEY && parsed.iss && parsed.iss !== process.env.LIVEKIT_API_KEY) return false;
    return true;
  } catch {
    return false;
  }
}

async function verifyWebhook(body: string, request: Request) {
  const hmacSignature = request.headers.get("x-livekit-signature") || request.headers.get("x-west-peek-live-signature");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || null;
  return (await verifyHmacWebhook(body, hmacSignature)) || (await verifyLiveKitBearerToken(bearer));
}

function eventIdFromRoomName(roomName?: string) {
  if (!roomName) return "event-summit";
  if (roomName.endsWith("-main-stage")) return roomName.slice(0, -"-main-stage".length);
  return roomName.split(":")[0] || "event-summit";
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!(await verifyWebhook(raw, request))) return NextResponse.json({ ok: false, error: "LiveKit webhook verification failed closed." }, { status: 401 });
  let event: { event?: string; ingressInfo?: { roomName?: string; ingressId?: string }; room?: { name?: string }; eventId?: string; stageId?: string };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid webhook JSON." }, { status: 400 });
  }
  const roomName = event.ingressInfo?.roomName || event.room?.name;
  const eventId = event.eventId || eventIdFromRoomName(roomName);
  const stageId = event.stageId || "main-stage";
  if (event.event === "ingress_started") {
    const state = await applyStageStreamSignal({ eventId, stageId, signal: "ingress_started", webhookEvent: "ingress_started", reason: "LiveKit webhook reported StreamYard ingress started." });
    return NextResponse.json({ ok: true, state });
  }
  if (event.event === "ingress_ended") {
    const state = await applyStageStreamSignal({ eventId, stageId, signal: "ingress_ended", webhookEvent: "ingress_ended", reason: "LiveKit webhook reported StreamYard ingress ended." });
    return NextResponse.json({ ok: true, state });
  }
  return NextResponse.json({ ok: true, ignored: true, event: event.event || "unknown" });
}
