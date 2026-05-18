import type { AssetRecord } from "@/types/assets";
import { getAssetUploadRule, validateAssetUploadInput } from "./assetRules";

export function buildAssetStoragePath(input: {
  agencyId: string;
  eventId?: string;
  ownerType: "speaker" | "sponsor" | "client" | "event" | "testing" | "replay";
  ownerId: string;
  assetType: string;
  fileName: string;
  versionNumber: number;
}) {
  const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const eventPart = input.eventId ? `events/${input.eventId}/` : "";
  return `${input.agencyId}/${eventPart}${input.ownerType}/${input.ownerId}/${input.assetType}/v${input.versionNumber}/${safeFileName}`;
}

export function createAssetRecordDraft(input: {
  agencyId: string;
  clientId?: string;
  eventId?: string;
  speakerId?: string;
  sponsorId?: string;
  ownerProfileId?: string;
  assetType: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  ownerType: "speaker" | "sponsor" | "client" | "event" | "testing" | "replay";
  ownerId: string;
  versionNumber?: number;
}): AssetRecord {
  const rule = getAssetUploadRule(input.assetType);
  const validation = validateAssetUploadInput({
    assetType: input.assetType,
    mimeType: input.mimeType,
    sizeBytes: input.fileSizeBytes,
  });

  if (!validation.ok || !rule) {
    throw new Error(validation.reason);
  }

  const versionNumber = input.versionNumber ?? 1;

  return {
    id: `asset-${input.assetType}-${versionNumber}`,
    agencyId: input.agencyId,
    clientId: input.clientId,
    eventId: input.eventId,
    ownerProfileId: input.ownerProfileId,
    speakerId: input.speakerId,
    sponsorId: input.sponsorId,
    assetType: input.assetType,
    sourceChannel: "portal_upload",
    bucketName: rule.bucketName,
    storagePath: buildAssetStoragePath({
      agencyId: input.agencyId,
      eventId: input.eventId,
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      assetType: input.assetType,
      fileName: input.fileName,
      versionNumber,
    }),
    fileName: input.fileName,
    fileSizeBytes: input.fileSizeBytes,
    mimeType: input.mimeType,
    versionNumber,
    status: "uploaded",
    reviewStatus: rule.requiresReview ? "needs_review" : "approved",
    isLocked: false,
    isLiveVersion: false,
    uploadedAt: new Date().toISOString(),
  };
}
