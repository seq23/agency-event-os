export type AssetBucketName =
  | "event-assets"
  | "speaker-assets"
  | "sponsor-assets"
  | "client-assets"
  | "testing-artifacts"
  | "replay-assets";

export type AssetRecordStatus =
  | "requested"
  | "uploaded"
  | "needs_review"
  | "changes_requested"
  | "approved"
  | "locked"
  | "used_live"
  | "archived";

export type AssetSourceChannel =
  | "portal_upload"
  | "email_attachment"
  | "cloud_link"
  | "producer_manual_upload"
  | "client_upload";

export interface AssetRecord {
  id: string;
  agencyId: string;
  clientId?: string;
  eventId?: string;
  ownerProfileId?: string;
  speakerId?: string;
  sponsorId?: string;
  assetType: string;
  sourceChannel: AssetSourceChannel;
  bucketName: AssetBucketName;
  storagePath: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  versionNumber: number;
  status: AssetRecordStatus;
  reviewStatus: string;
  isLocked: boolean;
  isLiveVersion: boolean;
  uploadedAt: string;
}

export interface AssetUploadRule {
  assetType: string;
  bucketName: AssetBucketName;
  allowedMimeTypes: string[];
  maxSizeBytes: number;
  versioned: boolean;
  requiresReview: boolean;
}
