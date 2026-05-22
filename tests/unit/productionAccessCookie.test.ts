import { describe, expect, it } from "vitest";
import { createV5AccessCookie, readV5AccessCookie } from "@/lib/auth/productionAccess";

const secret = "0123456789abcdef0123456789abcdef";

it("round-trips valid HMAC access cookies", async () => {
  const cookie = await createV5AccessCookie({ kind: "special_guest", eventId: "event-1", role: "speaker", issuedAt: Date.now(), expiresAt: Date.now() + 60000 }, secret);
  const parsed = await readV5AccessCookie(cookie, secret);
  expect(parsed?.kind).toBe("special_guest");
  if (parsed?.kind !== "special_guest") throw new Error("expected special_guest payload");
  expect(parsed.eventId).toBe("event-1");
  expect(parsed?.role).toBe("speaker");
});

it("rejects tampered cookies", async () => {
  const cookie = await createV5AccessCookie({ kind: "crew", role: "crew", issuedAt: Date.now(), expiresAt: Date.now() + 60000 }, secret);
  const tampered = cookie.replace("v5.", "v5.evil");
  await expect(readV5AccessCookie(tampered, secret)).resolves.toBeUndefined();
});

it("rejects expired cookies", async () => {
  const cookie = await createV5AccessCookie({ kind: "crew", role: "crew", issuedAt: Date.now() - 120000, expiresAt: Date.now() - 60000 }, secret);
  await expect(readV5AccessCookie(cookie, secret)).resolves.toBeUndefined();
});

it("rejects unusable secrets", async () => {
  await expect(createV5AccessCookie({ kind: "crew", role: "crew", issuedAt: Date.now(), expiresAt: Date.now() + 60000 }, "short")).rejects.toThrow(/at least 32/);
});
