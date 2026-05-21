import { test, expect } from "@playwright/test";

test("deployed outcome smoke uses configured baseURL and checks public front door", async ({ page }, testInfo) => {
  test.skip(!process.env.PLAYWRIGHT_DEPLOYED, "Deployed smoke only runs with PLAYWRIGHT_DEPLOYED=1.");
  expect(testInfo.project.use.baseURL || process.env.PLAYWRIGHT_BASE_URL).toBeTruthy();
  await page.goto("/");
  await expect(page.locator("body")).toContainText(/West Peek|event|production|join/i);
});
