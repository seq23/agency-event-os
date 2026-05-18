import type { ID } from "@/types/core";

export type ApprovalItemType =
  | "speaker_headshot"
  | "speaker_bio"
  | "speaker_deck"
  | "speaker_script"
  | "speaker_release"
  | "speaker_intro"
  | "sponsor_logo"
  | "sponsor_booth_copy"
  | "sponsor_offer"
  | "sponsor_video"
  | "sponsor_pdf"
  | "sponsor_cta"
  | "client_brand_asset"
  | "run_of_show_public_view"
  | "event_report_preview";

export type EventApprovalStatus =
  | "draft"
  | "submitted"
  | "needs_agency_review"
  | "needs_client_review"
  | "changes_requested"
  | "approved"
  | "locked"
  | "used_live"
  | "archived";

export type ApprovalBlockingScope = "none" | "speaker" | "sponsor" | "run_of_show" | "venue" | "reporting" | "event";

export interface EventApprovalItem {
  id: ID;
  agencyId: ID;
  clientId: ID;
  eventId: ID;
  itemType: ApprovalItemType;
  title: string;
  submittedByName: string;
  relatedSpeakerId?: ID;
  relatedSponsorId?: ID;
  relatedRunOfShowSegmentId?: ID;
  status: EventApprovalStatus;
  dueAt: string;
  currentOwner: "agency" | "client" | "speaker" | "sponsor";
  clientApprovalRequired: boolean;
  producerApprovalRequired: boolean;
  blockingScope: ApprovalBlockingScope;
  lastComment: string;
  nextAction: string;
}

export interface AssetApprovalRule {
  assetType: ApprovalItemType;
  agencyApprovesTechnicalFit: boolean;
  clientApprovesBrandFit: boolean;
  submitterApprovesOwnPublicInfo: boolean;
  producerLocksFinalUse: boolean;
}
