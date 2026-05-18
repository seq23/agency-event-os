import type { ID, RunOfShowSegment } from "@/types/core";
export type RunOfShowLiveStatus = "scheduled" | "current" | "completed" | "delayed" | "skipped" | "extended" | "shortened" | "moved" | "blocked" | "cancelled";
export type RunOfShowLiveReadinessStatus = "not_ready" | "needs_attention" | "ready" | "live" | "done";
export interface LiveRunOfShowSegment extends RunOfShowSegment { liveStatus: RunOfShowLiveStatus; liveReadinessStatus: RunOfShowLiveReadinessStatus; actualStartAt?: string; actualEndAt?: string; delayMinutes?: number; liveNotes?: string; emergencyNotes?: string; lastUpdatedAt: string; lastUpdatedByUserId: ID; }
export interface RunOfShowProgressSnapshot { eventId: ID; currentSegment?: LiveRunOfShowSegment; previousSegment?: LiveRunOfShowSegment; nextSegment?: LiveRunOfShowSegment; upcomingSegments: LiveRunOfShowSegment[]; completedCount: number; totalCount: number; progressPercent: number; onTimeStatus: "on_time" | "monitor" | "behind" | "blocked"; producerWarning?: string; generatedAt: string; }
export interface RunOfShowVisibilityProfile { viewer: "agency" | "client" | "crew" | "speaker" | "sponsor" | "attendee"; canSeeInternalNotes: boolean; canSeeTechnicalCues: boolean; canSeeBackupPlan: boolean; canSeeEmergencyNotes: boolean; canControlLiveStatus: boolean; }
export const RUN_OF_SHOW_VISIBILITY: Record<RunOfShowVisibilityProfile["viewer"], RunOfShowVisibilityProfile> = {
 agency:{viewer:"agency",canSeeInternalNotes:true,canSeeTechnicalCues:true,canSeeBackupPlan:true,canSeeEmergencyNotes:true,canControlLiveStatus:true},
 client:{viewer:"client",canSeeInternalNotes:false,canSeeTechnicalCues:false,canSeeBackupPlan:false,canSeeEmergencyNotes:false,canControlLiveStatus:false},
 crew:{viewer:"crew",canSeeInternalNotes:true,canSeeTechnicalCues:true,canSeeBackupPlan:true,canSeeEmergencyNotes:true,canControlLiveStatus:false},
 speaker:{viewer:"speaker",canSeeInternalNotes:false,canSeeTechnicalCues:false,canSeeBackupPlan:false,canSeeEmergencyNotes:false,canControlLiveStatus:false},
 sponsor:{viewer:"sponsor",canSeeInternalNotes:false,canSeeTechnicalCues:false,canSeeBackupPlan:false,canSeeEmergencyNotes:false,canControlLiveStatus:false},
 attendee:{viewer:"attendee",canSeeInternalNotes:false,canSeeTechnicalCues:false,canSeeBackupPlan:false,canSeeEmergencyNotes:false,canControlLiveStatus:false},
};
