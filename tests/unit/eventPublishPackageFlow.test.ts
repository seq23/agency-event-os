import { describe, expect, it } from "vitest";
import { buildEventConfigPackageManifest } from "@/services/events/eventConfigPackageService";

describe("event publish package flow", () => {
  it("builds a safe manifest for the configured demo event", () => {
    const manifest = buildEventConfigPackageManifest("event-summit");
    expect(manifest.slug).toBe("demo");
    expect(manifest.safeConfigRoots).toContain("data/events");
    expect(manifest.files).toContain("data/access/event-access-config.json");
  });
});
