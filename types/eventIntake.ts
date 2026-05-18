import type { ID } from "@/types/core";
export type IntakeSourceChannel="portal_upload"|"email_attachment"|"cloud_link"|"producer_manual_upload"|"client_upload";
export type IntakeItemStatus="new"|"needs_matching"|"matched"|"needs_review"|"converted_to_asset"|"converted_to_approval"|"ignored"|"archived";
export interface EventMagicLink{ id:ID; eventId:ID; eventCode:string; role:"speaker"|"sponsor"|"client"|"contractor"; label:string; url:string; status:"active"|"expired"|"revoked"; }
export interface ProductionInboxItem{ id:ID; agencyId:ID; clientId:ID; eventId:ID; eventCode:string; sourceChannel:IntakeSourceChannel; status:IntakeItemStatus; senderName:string; senderEmail:string; subject:string; summary:string; possibleMatchType?:"speaker"|"sponsor"|"client"|"run_of_show"; possibleMatchId?:ID; receivedAt:string; nextAction:string; }
