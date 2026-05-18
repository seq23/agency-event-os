import { describe, expect, it } from "vitest";
import { buildAssetStoragePath, createAssetRecordDraft, validateAssetUploadInput } from "@/services/assets";

describe("asset upload foundation", () => {
  it("validates allowed speaker deck uploads", () => {
    const result = validateAssetUploadInput({
      assetType: "speaker_deck",
      mimeType: "application/pdf",
      sizeBytes: 1_000_000,
    });

    expect(result.ok).toBe(true);
    expect(result.bucketName).toBe("speaker-assets");
  });

  it("rejects oversized files", () => {
    const result = validateAssetUploadInput({
      assetType: "speaker_headshot",
      mimeType: "image/png",
      sizeBytes: 10_000_000,
    });

    expect(result.ok).toBe(false);
  });

  it("builds deterministic versioned storage paths", () => {
    const path = buildAssetStoragePath({
      agencyId: "agency-1",
      eventId: "event-1",
      ownerType: "speaker",
      ownerId: "speaker-1",
      assetType: "speaker_deck",
      fileName: "Final Deck v2.pdf",
      versionNumber: 2,
    });

    expect(path).toContain("agency-1/events/event-1/speaker/speaker-1/speaker_deck/v2/");
    expect(path).toContain("Final-Deck-v2.pdf");
  });

  it("creates asset record drafts", () => {
    const record = createAssetRecordDraft({
      agencyId: "agency-1",
      eventId: "event-1",
      speakerId: "speaker-1",
      ownerType: "speaker",
      ownerId: "speaker-1",
      assetType: "speaker_script",
      fileName: "script.txt",
      mimeType: "text/plain",
      fileSizeBytes: 1000,
    });

    expect(record.bucketName).toBe("speaker-assets");
    expect(record.reviewStatus).toBe("needs_review");
  });
});
