"use server";

import { createAssetRecordDraft } from "@/services/assets";

export async function createAssetDraftAction(input: Parameters<typeof createAssetRecordDraft>[0]) {
  return createAssetRecordDraft(input);
}
