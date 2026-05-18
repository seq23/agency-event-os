import type { ID } from "@/types/core";

export type {
  DbApprovalRequestRecord,
  DbAssetRecord,
  DbLastMinuteChangeRequestRecord,
  DbProductionInboxItemRecord,
} from "@/types/persistence";

export interface DbApprovalCommentRecord {
  id: ID;
  agency_id: ID;
  approval_request_id: ID;
  body: string;
  visibility: "internal" | "client_visible" | "speaker_visible" | "sponsor_visible" | string;
  created_by_user_id?: ID | null;
  created_at?: string;
  updated_at?: string;
}
