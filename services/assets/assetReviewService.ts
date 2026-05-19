import type { AssetRecord } from "@/types/assets";
import type { AssetReviewActionDraft } from "@/types/preVenueHardening";

export function applyAssetReviewAction(asset: AssetRecord, action: AssetReviewActionDraft["action"]): AssetRecord {
  if (action === "approved") {
    return { ...asset, reviewStatus: "approved" };
  }

  if (action === "changes_requested") {
    return { ...asset, reviewStatus: "changes_requested" };
  }

  if (action === "locked") {
    return { ...asset, isLocked: true };
  }

  if (action === "made_live") {
    return { ...asset, isLiveVersion: true, reviewStatus: "approved" };
  }

  return { ...asset, status: "archived", isLiveVersion: false };
}

export function buildAssetReviewAction(input: AssetReviewActionDraft): AssetReviewActionDraft {
  return {
    agencyId: input.agencyId,
    eventId: input.eventId,
    assetRecordId: input.assetRecordId,
    actorProfileId: input.actorProfileId,
    action: input.action,
    notes: input.notes,
  };
}
