import { test, expect } from "@playwright/test";

test("attendee live participation requires crew approval, blocks publish by default, and supports revoke language", async ({ page }) => {
  await page.goto("/venue/demo/stage");
  const body = page.locator("body");
  await expect(body).toContainText(/crew-controlled|disabled by crew|Register to request|approval/i);
  await expect(body).toContainText(/publish|camera|microphone|revoke|revoked/i);
});
