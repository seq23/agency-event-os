import { describe, expect, it } from "vitest";
import { canCrewAccessPath, canOperatorAccessPath, canSpecialGuestAccessPath, eventIdFromPath } from "@/lib/auth/v5RouteAuthorization";
import type { V5AccessCookiePayload } from "@/lib/auth/productionAccess";
import type { V4SpecialGuestRole } from "@/types/v4";

const issuedAt = Date.now();
const expiresAt = issuedAt + 1000 * 60;

function guest(role: V4SpecialGuestRole, eventId = "event-1"): V5AccessCookiePayload {
  return { kind: "special_guest", role, eventId, issuedAt, expiresAt };
}

it("extracts exact event IDs from app, portal, and venue routes", () => {
  expect(eventIdFromPath("/app/events/event-1/publish")).toBe("event-1");
  expect(eventIdFromPath("/client/acme/events/event-1/assets")).toBe("event-1");
  expect(eventIdFromPath("/venue/event-1/lobby")).toBe("event-1");
});

it("does not authorize event-1 cookies on event-12 routes", () => {
  expect(canSpecialGuestAccessPath("/speaker/events/event-12", guest("speaker", "event-1"))).toBe(false);
  expect(canCrewAccessPath("/crew/events/event-12", { kind: "crew", role: "crew", eventId: "event-1", issuedAt, expiresAt })).toBe(false);
});

it("denies role escalation between special guest portals", () => {
  expect(canSpecialGuestAccessPath("/sponsor/events/event-1", guest("speaker"))).toBe(false);
  expect(canSpecialGuestAccessPath("/client/acme/events/event-1", guest("sponsor"))).toBe(false);
  expect(canSpecialGuestAccessPath("/app/events/event-1", guest("vip"))).toBe(false);
});

it("allows only the correct event-scoped portal", () => {
  expect(canSpecialGuestAccessPath("/speaker/events/event-1/green-room", guest("speaker"))).toBe(true);
  expect(canSpecialGuestAccessPath("/venue/event-1/lobby", guest("vip"))).toBe(true);
});


it("keeps crew and operator route permissions separate", () => {
  const crew = { kind: "crew" as const, role: "crew" as const, eventId: "event-1", issuedAt, expiresAt };
  const operator = { kind: "operator" as const, role: "executive_producer" as const, issuedAt, expiresAt };
  expect(canCrewAccessPath("/production-access/launchpad", crew)).toBe(false);
  expect(canOperatorAccessPath("/production-access/launchpad", operator)).toBe(true);
  expect(canOperatorAccessPath("/app/events/new", operator)).toBe(true);
});


import {
  canOperatorAccessPath as __canOperatorAccessPath,
  canOwnerAccessPath as __canOwnerAccessPath,
} from "../../lib/auth/v5RouteAuthorization";

describe("owner route authorization", () => {
  it("owner can access settings while operator cannot escalate to owner settings", () => {
    expect(__canOwnerAccessPath("/app/settings", { kind: "owner", role: "owner", issuedAt: Date.now(), expiresAt: Date.now() + 1000 })).toBe(true);
    expect(__canOwnerAccessPath("/billing", { kind: "owner", role: "owner", issuedAt: Date.now(), expiresAt: Date.now() + 1000 })).toBe(true);
    expect(__canOperatorAccessPath("/app/settings", { kind: "operator", issuedAt: Date.now(), expiresAt: Date.now() + 1000 })).toBe(false);
  });
});
