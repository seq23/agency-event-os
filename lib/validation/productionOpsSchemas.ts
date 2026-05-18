import { z } from "zod";

export const approvalDecisionSchema = z.object({
  approvalRequestId: z.string().min(1),
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  eventId: z.string().min(1),
  decision: z.enum(["approve", "request_changes", "lock", "archive"]),
  comment: z.string().max(2000).optional(),
});

export const productionInboxDecisionSchema = z.object({
  inboxItemId: z.string().min(1),
  agencyId: z.string().min(1),
  eventId: z.string().min(1),
  nextStatus: z.enum(["matched", "needs_review", "converted_to_asset", "converted_to_approval", "ignored", "archived"]),
  linkedResourceType: z.string().max(80).optional(),
  linkedResourceId: z.string().optional(),
  nextAction: z.string().max(500).optional(),
});

export const lastMinuteChangeDecisionSchema = z.object({
  changeRequestId: z.string().min(1),
  agencyId: z.string().min(1),
  clientId: z.string().min(1),
  eventId: z.string().min(1),
  decision: z.enum(["approve", "approve_with_conditions", "reject", "push_to_live", "rollback"]),
  note: z.string().max(2000).optional(),
});

export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;
export type ProductionInboxDecisionInput = z.infer<typeof productionInboxDecisionSchema>;
export type LastMinuteChangeDecisionInput = z.infer<typeof lastMinuteChangeDecisionSchema>;
