import { describe, expect, it } from "vitest";
import { authCookieTestUtils } from "@/lib/auth/sessionCookie";
import { getRouteRequirement, isProtectedPath } from "@/lib/auth/routeAccess";

const payload = { accessToken: "access-token", refreshToken: "refresh-token", expiresAt: 123 };

describe("auth session utilities", () => {
  it("encodes and decodes auth cookie payloads", () => {
    const encoded = authCookieTestUtils.encodePayload(payload);
    expect(authCookieTestUtils.decodePayload(encoded)).toEqual(payload);
  });

  it("rejects malformed cookie payloads", () => {
    expect(authCookieTestUtils.decodePayload("not-json")).toBeNull();
  });

  it("maps protected route families to access requirements", () => {
    expect(isProtectedPath("/app/events")).toBe(true);
    expect(isProtectedPath("/speaker/events/event-summit/green-room")).toBe(true);
    expect(isProtectedPath("/venue/event-summit/lobby")).toBe(false);
    expect(getRouteRequirement("/sponsor/events/event-summit/setup")?.capability).toBe("sponsor.view_own_booth");
  });
});
