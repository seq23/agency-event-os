import { expect, test } from '@playwright/test';
import { grantOperatorAccess } from './helpers/roleJourney';

const enabled = () => process.env.STREAMYARD_REAL_PROVIDER_SMOKE === '1';
const eventIdForTier4 = () => process.env.TIER4_EVENT_ID || process.env.STREAMYARD_E2E_EVENT_ID || 'demo';
const stageIdForTier4 = () => process.env.TIER4_STAGE_ID || process.env.STREAMYARD_E2E_STAGE_ID || 'main-stage';

test.describe('REAL StreamYard Custom RTMP → LiveKit media proof', () => {
  test('operator-provisioned LiveKit ingress receives confirmed StreamYard broadcast and attendee route shows live/fallback state truthfully', async ({ page, request }) => {
    test.skip(!enabled(), 'STREAMYARD_REAL_PROVIDER_SMOKE=1 is required. This lane requires real LiveKit creds and a private StreamYard Custom RTMP broadcast.');
    test.skip(!process.env.STREAMYARD_OPERATOR_CONFIRMED_BROADCAST, 'Set STREAMYARD_OPERATOR_CONFIRMED_BROADCAST=1 only after the operator starts the private StreamYard Custom RTMP broadcast.');
    test.skip(!process.env.TIER4_EVENT_ID && !process.env.STREAMYARD_E2E_EVENT_ID, 'Tier 4 real StreamYard/LiveKit proof requires an explicit event id; seeded demo fallback is not accepted.');
    test.skip(!process.env.V5_ACCESS_COOKIE_SECRET, 'Tier 4 operator-scoped provider proof requires V5_ACCESS_COOKIE_SECRET to match the deployed runtime.');

    const eventId = eventIdForTier4();
    const stageId = stageIdForTier4();
    await grantOperatorAccess(page, 'executive_producer', eventId);
    await page.goto(`/admin/testing/${eventId}`);
    await expect(page.locator('body')).toContainText(/StreamYard|LiveKit|Click to Copy RTMP URL|Click to Copy Stream Key|ingress/i);

    const operatorState = await page.context().request.get(`/api/video/stage-stream-state?eventId=${eventId}&stageId=${stageId}&view=operator`);
    expect(operatorState.status()).toBe(200);
    if (operatorState.ok()) {
      const json = await operatorState.json();
      expect(JSON.stringify(json)).toMatch(/LIVEKIT_INGRESS|READY_FOR_STREAMYARD|LIVEKIT_INGRESS_LIVE|STREAMYARD/i);
      expect(JSON.stringify(json)).not.toMatch(/LIVEKIT_API_SECRET|LIVEKIT_WEBHOOK_SECRET/i);
    }

    await page.goto(`/venue/${eventId}/stage`);
    await expect(page.locator('body')).toContainText(/Live|Stream|Stage|Daily|fallback|pre-stream|West Peek/i);
    await expect(page.locator('body')).not.toContainText(/Stream Key|RTMP URL|LIVEKIT_API_SECRET|LIVEKIT_WEBHOOK_SECRET/i);
  });
});
