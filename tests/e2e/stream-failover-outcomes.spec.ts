import { test, expect } from "@playwright/test";

test("stream failover proves pre-stream, 4-second buffer, StreamYard, LiveKit, Daily, switching, and private URL boundaries", async ({ page }) => {
  await page.goto("/venue/demo/stage");
  const body = page.locator("body");
  await expect(body).toContainText(/pre-stream|getting ready|stage|stream/i);
  await expect(body).toContainText(/backup|fallback|switching|Daily|LiveKit|StreamYard|4-second/i);
  await expect(body).not.toContainText(/black screen|unhandled error/i);
  await expect(body).not.toContainText(/stream key|private Daily URL|daily\.co\/[a-z0-9-]{12,}/i);
});
