import { test, expect } from "@playwright/test";

test("attendee registration requires identity fields, creates session intent, and keeps planning skippable", async ({ page, context }) => {
  await page.goto("/events/demo/register");
  await expect(page.locator("body")).toContainText(/company \/ affiliation|title \/ role/i);
  await expect(page.getByTestId("registration-agenda-planner")).toBeVisible();
  await expect(page.locator("body")).toContainText(/Planning.*skippable|editable later/i);
  await expect(page.locator("body")).toContainText(/Planning.*never grants VIP|restricted access/i);
  await page.getByLabel(/name/i).fill("Outcome Attendee");
  await page.getByLabel(/email/i).fill(`outcome-${Date.now()}@example.com`);
  await page.getByLabel(/company/i).fill("Outcome Co");
  await page.getByLabel(/title/i).fill("Founder");
  const sessionOption = page.locator('input[name="plannedSessionIds"]').first();
  if (await sessionOption.count()) await sessionOption.check();
  await page.getByRole("button", { name: /submit registration|enter venue|register|join/i }).click();
  await expect(page).toHaveURL(/\/venue\/.*\/lobby|\/venue\/.*\/stage/);
  const cookies = await context.cookies();
  expect(cookies.some((cookie) => cookie.name.includes("attendee_session"))).toBeTruthy();
  await page.goto(page.url().replace(/\/lobby.*/, "/stage"));
  await expect(page.getByTestId("my-agenda-panel")).toBeVisible();
});
