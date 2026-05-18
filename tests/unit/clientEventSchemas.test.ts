import { describe, expect, it } from "vitest";
import { clientInputSchema, eventInputSchema, normalizeOptional } from "@/lib/validation/clientEventSchemas";

describe("client/event persistence schemas", () => {
  it("validates client input and rejects bad slugs", () => {
    expect(clientInputSchema.safeParse({ agencyId: "00000000-0000-0000-0000-000000000001", name: "Nova", slug: "nova-capital", status: "active" }).success).toBe(true);
    expect(clientInputSchema.safeParse({ agencyId: "00000000-0000-0000-0000-000000000001", name: "Nova", slug: "Bad Slug", status: "active" }).success).toBe(false);
  });

  it("validates event input", () => {
    const parsed = eventInputSchema.parse({
      agencyId: "00000000-0000-0000-0000-000000000001",
      clientId: "00000000-0000-0000-0000-000000000101",
      name: "Founder Summit",
      slug: "founder-summit",
      eventType: "virtual_summit",
      timezone: "America/Chicago",
    });
    expect(parsed.status).toBe("draft");
    expect(parsed.venueEnabled).toBe(true);
  });

  it("normalizes empty optional values", () => {
    expect(normalizeOptional("")).toBeNull();
    expect(normalizeOptional(" hi ")).toBe("hi");
  });
});
