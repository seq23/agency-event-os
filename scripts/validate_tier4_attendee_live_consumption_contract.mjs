import fs from 'node:fs';

const failures = [];
function read(file) { return fs.readFileSync(file, 'utf8'); }
function requireText(file, terms) {
  const text = read(file);
  for (const term of terms) if (!text.includes(term)) failures.push(`${file} missing required term: ${term}`);
}
function requireRegex(file, regex, label) {
  if (!regex.test(read(file))) failures.push(`${file} missing required pattern: ${label}`);
}

requireText('scripts/tier4_attendee_live_consumption_gauntlet.mjs', [
  'controlledRtmpMediaObserved',
  'controlledMedia.eventId && controlledMedia.eventId !== eventId',
  'TIER4_CONTROLLED_MEDIA_EVIDENCE_RUN_ID',
  'runBrowserAttendeeProof',
  'attendeeBrowserReachedLiveStage',
  'attendeeBrowserLiveKitSurfaceRendered',
  'attendeeBrowserLiveKitSurfaceTokenIssued',
  'attendeeBrowserLiveKitTokenIssued',
  'attendeeBrowserStagePlayerLiveKitLive',
  "livekitSurfaceState === 'token-issued'",
  'browserLivekitTokenIssued',
  'stagePlayerLiveKitLive',
  'attendeeTokenRoomMatchesIngressRoom',
  'attendeeLiveTokenIssuedWhenPermitted',
  'livekitParticipantRemoval',
  'revokedAttendeeDeniedLiveToken',
  'rePermittedAttendeeLiveTokenRecovered',
  'backendLogsVisibleToAuthorizedRoles',
  'evidenceGeneratedByThisRun',
  'TIER4_STREAMYARD_LIVE_EVIDENCE_PATH',
]);
requireText('scripts/tier4_controlled_rtmp_broadcaster_proof.mjs', [
  'tier4RunId',
  'TIER4_CONTROLLED_MEDIA_EVIDENCE_RUN_ID',
  'attendeeBrowserReachedLiveStage',
  'attendeeTokenRoomMatchesIngressRoom',
]);
requireText('services/video/livekitRoomNaming.ts', ['normalizeLiveKitRoomName']);
requireText('services/video/livekitIngressService.ts', ['normalizeLiveKitRoomName(input.eventId, stageId)']);
requireText('services/video/livekitRoomUiService.ts', ['normalizeLiveKitRoomName(input.eventId, input.roomId || "main-stage")']);
requireText('services/video/livekitParticipantAdmin.ts', ['RemoveParticipant', 'normalizeLiveKitRoomName', 'roomAdmin']);
requireText('components/video/LiveKitIngressStagePlayer.tsx', ['data-testid="attendee-livekit-room-surface"', 'data-livekit-consumption-state={consumptionState}', 'token-issued', 'token-error', 'loading']);
requireText('components/video/StagePlayer.tsx', ['data-testid="stage-player"', 'data-active-stream-source']);
requireText('app/api/tier4/attendee-live-session/route.ts', [
  'requireLiveEventControlAccessForRequest',
  'ATTENDEE_SESSION_COOKIE',
  'upsertAttendeeProfile',
  'upsertAttendeeSession',
]);
requireText('app/api/attendee-live/access/route.ts', [
  'requireLiveEventControlAccessForRequest',
  'canJoinLiveStream',
  'revoked',
  'appendStageStreamEvent',
  'removeLiveKitParticipantFromMainStage',
  'logs',
  'attendee_access_decision',
]);
requireText('lib/actions/attendeeLiveActions.ts', [
  'requireLiveEventControlAccessForRequest',
  'recordAttendeeLiveDecision',
  'removeLiveKitParticipantFromMainStage',
]);
requireText('app/api/video/livekit-token/route.ts', [
  'canAttendeeJoinLive',
  'joinPermission.canJoin',
  'accessStatus',
]);
requireText('components/venue/AttendeeStageJoinControls.tsx', [
  'attendee-live-access-revoked',
  'attendee-live-access-permitted',
  'crew can revoke or restore access',
]);
requireText('components/testing/AttendeeLiveControlPanel.tsx', [
  'Permit live-stage entry/watch',
  'Revoke live access',
  'Apply live access decision',
]);
requireRegex('types/attendeeLive.ts', /canJoinLiveStream:\s*boolean/, 'Attendee capability must model live-consumption permit');
requireText('tests/unit/attendeeLiveAccessControl.test.ts', [
  'revokes and re-permits attendee live consumption',
  'waiting_for_approval',
  'permitted',
]);
requireText('TIER4_LIVE_ATTENDEE_CONSUMPTION_GAUNTLET_2026-06-12.md', [
  'End-User Outcome Spine',
  'attendee can consume the controlled live stream',
  'permit / revoke / re-permit',
  'backend logs',
  'no provider secrets',
]);

if (failures.length) {
  console.error('TIER 4 ATTENDEE LIVE CONSUMPTION CONTRACT FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('TIER 4 ATTENDEE LIVE CONSUMPTION CONTRACT VALIDATION OK — attendee browser consumption, same-room media trace, permit/revoke/re-permit, backend logs, and generated evidence are explicit.');
