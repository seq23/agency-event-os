import type { ID } from "@/types/core";
export type LastMinuteChangeType="script_edit"|"talking_points_edit"|"deck_replacement"|"bio_update"|"intro_update"|"timing_change"|"sponsor_read_change"|"av_requirement_change";
export type LastMinuteChangeUrgency="normal"|"same_day"|"show_day"|"within_60_minutes"|"live_segment_imminent"|"during_live_event";
export type LastMinuteChangeRisk="low"|"medium"|"high"|"showstopper";
export type LastMinuteChangeStatus="draft"|"submitted"|"triage_needed"|"producer_review"|"client_review_required"|"client_review_skipped"|"approved"|"approved_with_conditions"|"rejected"|"locked"|"pushed_to_live"|"used_live"|"rolled_back"|"archived";
export interface LastMinuteChangeRequest{ id:ID; agencyId:ID; clientId:ID; eventId:ID; speakerId?:ID; sponsorId?:ID; runOfShowSegmentId?:ID; changeType:LastMinuteChangeType; urgency:LastMinuteChangeUrgency; risk:LastMinuteChangeRisk; status:LastMinuteChangeStatus; title:string; oldVersionLabel:string; newVersionLabel:string; diffSummary:string; affectsTiming:boolean; affectsSponsorMention:boolean; affectsClientApprovedCopy:boolean; submittedAt:string; minutesUntilSegment:number; recommendedAction:string; }
