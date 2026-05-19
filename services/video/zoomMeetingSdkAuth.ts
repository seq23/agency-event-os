import crypto from "crypto";
import type { ZoomMeetingSdkSignatureRequest, ZoomMeetingSdkSignatureResponse } from "@/types/whiteLabelVideo";

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJwt(payload: Record<string, string | number>, secret: string) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", secret).update(signingInput).digest();

  return `${signingInput}.${base64Url(signature)}`;
}

export function isZoomEmbeddedFallbackConfigured() {
  return Boolean(process.env.ZOOM_MEETING_SDK_KEY && process.env.ZOOM_MEETING_SDK_SECRET);
}

export function generateZoomMeetingSdkSignature(
  input: ZoomMeetingSdkSignatureRequest
): ZoomMeetingSdkSignatureResponse {
  const sdkKey = process.env.ZOOM_MEETING_SDK_KEY;
  const sdkSecret = process.env.ZOOM_MEETING_SDK_SECRET;

  if (!sdkKey || !sdkSecret) {
    throw new Error("Zoom embedded room is not configured.");
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const issuedAt = nowSeconds - 30;
  const expiresAt = nowSeconds + 60 * 60 * 2;

  const payload = {
    appKey: sdkKey,
    sdkKey,
    mn: input.meetingNumber,
    role: input.role,
    iat: issuedAt,
    exp: expiresAt,
    tokenExp: expiresAt,
  };

  return {
    sdkKey,
    signature: signJwt(payload, sdkSecret),
    meetingNumber: input.meetingNumber,
    role: input.role,
  };
}
