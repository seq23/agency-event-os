import type { ID } from "@/types/core";
export type BreakoutRoomStatus="scheduled"|"opening_soon"|"live"|"closing_soon"|"closed"|"replay_ready"|"cancelled";
export type BreakoutRoomType="scheduled_breakout"|"ad_hoc_breakout"|"workshop_room"|"roundtable_room"|"sponsor_session"|"speaker_rehearsal"|"green_room";
export interface BreakoutRoom{ id:ID; eventId:ID; title:string; description:string; roomType:BreakoutRoomType; hostName:string; status:BreakoutRoomStatus; capacity:number; cameraOnLimit:number; watcherLimit:number; chatEnabled:boolean; qAndAEnabled:boolean; pollsEnabled:boolean; recordingEnabled:boolean; startsAt:string; endsAt:string; }
export type NetworkingMatchStatus="queued"|"matched"|"in_call"|"completed"|"skipped"|"connected"|"reported"|"expired"|"no_match";
export type NetworkingMatchingMode="random"|"interest_based"|"sponsor_weighted"|"role_based";
export interface SpeedNetworkingSettings{ eventId:ID; durationSeconds:number; matchingMode:NetworkingMatchingMode; queueOpen:boolean; maxMatchesPerAttendee:number; cooldownSeconds:number; reportEnabled:boolean; }
export interface SpeedNetworkingMatch{ id:ID; eventId:ID; attendeeAName:string; attendeeBName:string; status:NetworkingMatchStatus; startedAt?:string; expiresAt?:string; secondsRemaining:number; }
