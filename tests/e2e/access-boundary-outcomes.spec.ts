import { test, expect } from "@playwright/test";

test("attendee registration does not grant speaker, sponsor, crew, operator, admin, publish, or restricted access", async ({ page }) => {
  await page.goto("/events/demo/register");
  await expect(page.locator("body")).toContainText(/does not grant speaker, sponsor, client, crew, operator, admin/i);
  await expect(page.locator("body")).toContainText(/does not grant.*camera\/mic publishing access/i);
  await expect(page.locator("body")).toContainText(/Planning.*never grants VIP|restricted access/i);

  await page.goto("/production-access/launchpad");
  await expect(page.locator("body")).toContainText(/Operator|password|access/i);
  await page.goto("/production-access/crew");
  await expect(page.locator("body")).not.toContainText(/Operator Launchpad.*unlocked/i);
});
