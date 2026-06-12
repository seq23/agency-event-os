import { expect, test } from '@playwright/test';
import { expectVisibleRoute, expectLinksStayFirstParty, loginAsOperator } from './helpers/roleJourney';

test.setTimeout(180_000);

const publicRoutes = [
  '/', '/start', '/start/create-event', '/request-event', '/operator-packet', '/join', '/events/demo', '/events/demo/register', '/events/demo/agenda', '/events/demo/speakers', '/events/demo/sponsors', '/privacy', '/terms'
];
const venueRoutes = ['/venue/demo/lobby', '/venue/demo/stage', '/venue/demo/sessions', '/venue/demo/breakouts', '/venue/demo/networking', '/venue/demo/expo', '/venue/demo/people', '/venue/demo/replay', '/venue/demo/help'];
const protectedRoutes = ['/production-access', '/production-access/operator', '/production-access/crew', '/production-access/special-guest'];

test('public, venue, access, and operator CTA crosswalk routes render with first-party links', async ({ page }) => {
  for (const path of [...publicRoutes, ...venueRoutes, ...protectedRoutes]) {
    await expectVisibleRoute(page, { path, label: path, anyOf: ['West Peek', 'Event', 'production', 'Register', 'Venue', 'access', 'privacy', 'terms'] });
    await expectLinksStayFirstParty(page);
  }

  await loginAsOperator(page, '/production-access/launchpad');
  await expect(page.locator('body')).toContainText(/Create Event|Preview Demo Venue|Crew Briefing|Testing Console|Run of Show/i);
  for (const label of ['Create Event in Admin Workspace', 'Preview Demo Venue', 'Crew Briefing', 'Testing Console']) {
    await expect(page.getByRole('link', { name: new RegExp(label, 'i') }).first(), `${label} CTA should exist`).toBeVisible();
  }
});
