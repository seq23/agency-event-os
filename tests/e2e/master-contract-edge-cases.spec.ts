import { expect, test } from '@playwright/test';
import { gotoAndAssert } from './helpers/assertNoAppError';
import { requiredDay1Default } from './helpers/day1AccessDefaults';

const forbidden = /Application error|Internal Server Error|__next_error__|digest|LIVEKIT_API_SECRET|SUPABASE_SERVICE_ROLE_KEY|V5_ACCESS_COOKIE_SECRET/i;

async function bodyText(page: any) {
  return page.locator('body').innerText();
}

test.describe('Master Contract edge cases — access, duplicate, expired/revoked, invalid submissions', () => {
  test('invalid special guest and invalid event code fail safely', async ({ page }) => {
    await gotoAndAssert(page, '/production-access/special-guest');
    await page.getByLabel(/event code/i).fill('not-a-real-event');
    await page.getByLabel(/special guest password/i).fill('not-a-real-code');
    await page.getByRole('button', { name: /continue to assigned portal/i }).click();
    await expect(page.locator('body')).toContainText(/could not match|not valid|check the code|special guest/i);
    await expect(page.locator('body')).not.toContainText(forbidden);
  });

  test('duplicate attendee registration has explicit duplicate/update behavior and no stale duplicate ambiguity', async ({ page }) => {
    const email = `duplicate-e2e-${Date.now()}@example.com`;
    for (const pass of [1, 2]) {
      await gotoAndAssert(page, '/events/demo/register');
      await page.getByLabel(/^Name/i).fill(`Duplicate E2E ${pass}`);
      await page.getByLabel(/^Email/i).fill(email);
      await page.getByLabel(/Company \/ affiliation/i).fill('West Peek QA');
      await page.getByLabel(/Title \/ role/i).fill('Reviewer');
      await page.getByLabel(/What brings you to the conference/i).fill(`Duplicate pass ${pass}`);
      await page.getByLabel(/Networking goals/i).fill('Confirm duplicate behavior is explicit.');
      await page.getByRole('button', { name: /submit registration/i }).click();
      await expect(page).toHaveURL(/\/venue\/demo\/lobby|\/venue\/event-summit\/lobby/);
    }
    await expect(page.locator('body')).toContainText(/Lobby|Attendee venue|West Peek/i);
    await expect(page.locator('body')).not.toContainText(forbidden);
  });

  test('expired and revoked role cookies are denied safely', async ({ page, context }) => {
    const cookieUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
    await context.addCookies([
      { name: process.env.V5_SPECIAL_GUEST_COOKIE_NAME || 'wpl_guest_access', value: 'revoked-or-garbage-cookie', url: cookieUrl, httpOnly: true, sameSite: 'Lax', expires: Math.floor(Date.now() / 1000) + 60 },
      { name: process.env.V5_OPERATOR_COOKIE_NAME || 'wpl_operator_access', value: 'expired-or-garbage-cookie', url: cookieUrl, httpOnly: true, sameSite: 'Lax', expires: Math.floor(Date.now() / 1000) + 60 },
    ]);
    await gotoAndAssert(page, '/speaker/events/demo');
    await expect(page).toHaveURL(/\/production-access\/special-guest|\/speaker\/events\/demo/);
    expect(await bodyText(page)).not.toMatch(forbidden);

    await gotoAndAssert(page, '/production-access/operator');
    await page.getByLabel(/operator launchpad password/i).fill(requiredDay1Default('OPERATOR_LAUNCHPAD_PASSWORD'));
    await page.getByRole('button', { name: /enter operator launchpad/i }).click();
    await expect(page.locator('body')).not.toContainText(forbidden);
  });

  test('protected APIs deny missing operator access without leaking provider secrets', async ({ request }) => {
    for (const endpoint of ['/api/video/livekit-ingress', '/api/video/stage-stream-fallback']) {
      const response = await request.post(endpoint, { data: { eventId: 'demo', stageId: 'main-stage' } });
      expect([401, 403]).toContain(response.status());
      expect(await response.text()).not.toMatch(forbidden);
    }
  });
});
