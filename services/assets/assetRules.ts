import type { AssetUploadRule } from "@/types/assets";

export const assetUploadRules: AssetUploadRule[] = [
  {
    assetType: "speaker_headshot",
    bucketName: "speaker-assets",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes: 5_000_000,
    versioned: true,
    requiresReview: true,
  },
  {
    assetType: "speaker_deck",
    bucketName: "speaker-assets",
    allowedMimeTypes: ["application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    maxSizeBytes: 75_000_000,
    versioned: true,
    requiresReview: true,
  },
  {
    assetType: "speaker_script",
    bucketName: "speaker-assets",
    allowedMimeTypes: ["text/plain", "application/pdf"],
    maxSizeBytes: 5_000_000,
    versioned: true,
    requiresReview: true,
  },
  {
    assetType: "sponsor_logo",
    bucketName: "sponsor-assets",
    allowedMimeTypes: ["image/svg+xml", "image/png", "image/jpeg", "image/webp"],
    maxSizeBytes: 10_000_000,
    versioned: true,
    requiresReview: true,
  },
  {
    assetType: "sponsor_pdf",
    bucketName: "sponsor-assets",
    allowedMimeTypes: ["application/pdf"],
    maxSizeBytes: 50_000_000,
    versioned: true,
    requiresReview: true,
  },
  {
    assetType: "client_brand_asset",
    bucketName: "client-assets",
    allowedMimeTypes: ["image/svg+xml", "image/png", "image/jpeg", "application/pdf"],
    maxSizeBytes: 50_000_000,
    versioned: true,
    requiresReview: true,
  },
];

export function getAssetUploadRule(assetType: string): AssetUploadRule | undefined {
  return assetUploadRules.find((rule) => rule.assetType === assetType);
}

export function validateAssetUploadInput(input: {
  assetType: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const rule = getAssetUploadRule(input.assetType);
  if (!rule) {
    return { ok: false, reason: "Unsupported asset type" };
  }

  if (!rule.allowedMimeTypes.includes(input.mimeType)) {
    return { ok: false, reason: "Unsupported file type" };
  }

  if (input.sizeBytes > rule.maxSizeBytes) {
    return { ok: false, reason: "File exceeds maximum size" };
  }

  return { ok: true, reason: "Upload allowed", bucketName: rule.bucketName };
}
