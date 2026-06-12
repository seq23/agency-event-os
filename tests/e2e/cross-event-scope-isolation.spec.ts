import { expect, test } from '@playwright/test';
import { gotoAndAssert } from './helpers/assertNoAppError';
import { loginAsOperator } from './helpers/roleJourney';

async function createEvent(page: any, slug: string, name: string) {
  await loginAsOperator(page, '/app/events/new');
  await page.getByLabel(/^Event name/i).fill(name);
  await page.getByLabel(/Event code \/ slug/i).fill(slug);
  await page.getByLabel(/Client or organizer name/i).fill('West Peek Productions');
  await page.getByLabel(/Event date/i).fill('2026-06-15');
  await page.getByLabel(/Primary audience/i).fill('Scope isolation reviewers');
  await page.getByLabel(/Event type/i).fill('Virtual summit');
  await page.getByLabel(/Production feed \/ source/i).fill('StreamYard');
  await page.getByLabel(/Primary embedded distribution/i).fill('LiveKit');
  await page.getByLabel(/Fallback video provider/i).fill('Daily');
  await page.getByRole('button', { name: /Create setup draft and continue/i }).click();
  await expect(page).toHaveURL(new RegExp(`/app/events/${slug}/setup`));
  const codes = {
    speaker: (await page.getByTestId('generated-speaker-code').innerText()).trim(),
    sponsor: (await page.getByTestId('generated-sponsor-code').innerText()).trim(),
  };
  return codes;
}

test('cross-event: two newly-created events keep routes, codes, and scoped portals isolated', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const suffix = Date.now().toString(36);
  const eventA = `scope-a-${suffix}`;
  const eventB = `scope-b-${suffix}`;
  const codesA = await createEvent(page, eventA, `Scope Isolation A ${suffix}`);
  const codesB = await createEvent(page, eventB, `Scope Isolation B ${suffix}`);
  expect(codesA.speaker).not.toEqual(codesB.speaker);
  expect(codesA.sponsor).not.toEqual(codesB.sponsor);

  await gotoAndAssert(page, `/events/${eventA}`);
  await expect(page.locator('body')).toContainText(`Scope Isolation A ${suffix}`);
  await expect(page.locator('body')).not.toContainText(`Scope Isolation B ${suffix}`);

  await gotoAndAssert(page, `/events/${eventB}`);
  await expect(page.locator('body')).toContainText(`Scope Isolation B ${suffix}`);
  await expect(page.locator('body')).not.toContainText(`Scope Isolation A ${suffix}`);

  await gotoAndAssert(page, '/production-access/special-guest');
  await page.getByLabel(/event code/i).fill(eventB);
  await page.getByLabel(/special guest password/i).fill(codesA.speaker);
  await page.getByRole('button', { name: /continue to assigned portal/i }).click();
  await expect(page.locator('body')).toContainText(/not valid|special guest|code/i);
  await expect(page.locator('body')).not.toContainText(/Application error|Internal Server Error|__next_error__|digest/i);
  await context.close();
});
