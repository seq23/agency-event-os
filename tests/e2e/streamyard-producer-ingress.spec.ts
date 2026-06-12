import { expect, test } from "@playwright/test";
import { expectVisibleRoute, grantOperatorAccess, isDeployedBrowserRun } from "./helpers/roleJourney";

test("producer console exposes StreamYard ingress credentials and failover decisioning", async ({ page }) => {
  test.skip(process.env.STREAMYARD_REAL_PROVIDER_SMOKE === "1" && !process.env.TIER4_EVENT_ID && !process.env.STREAMYARD_E2E_EVENT_ID, "Real provider smoke requires an explicit event id; seeded demo fallback is not accepted.");
  const eventId = process.env.TIER4_EVENT_ID || process.env.STREAMYARD_E2E_EVENT_ID || "demo";
  await grantOperatorAccess(page, "executive_producer", eventId);
  await expectVisibleRoute(page, { path: `/admin/testing/${eventId}`, label: "testing console", anyOf: ["streamyard", "ingress", "fallback", "daily"] });
  if (isDeployedBrowserRun()) return;
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const term of ["click to copy rtmp url", "click to copy stream key", "failure plane", "keep streamyard running", "switch attendees to daily"]) {
    expect(body).toContain(term);
  }
});
