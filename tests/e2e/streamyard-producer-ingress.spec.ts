import { expect, test } from "@playwright/test";
import { expectVisibleRoute, loginAsOperator, isDeployedBrowserRun } from "./helpers/roleJourney";

test("producer console exposes StreamYard ingress credentials and failover decisioning", async ({ page }) => {
  await loginAsOperator(page, "/admin/testing/demo");
  await expectVisibleRoute(page, { path: "/admin/testing/demo", label: "testing console", anyOf: ["streamyard", "ingress", "fallback", "daily"] });
  if (isDeployedBrowserRun()) return;
  const body = (await page.locator("body").innerText()).toLowerCase();
  for (const term of ["click to copy rtmp url", "click to copy stream key", "failure plane", "keep streamyard running", "switch attendees to daily"]) {
    expect(body).toContain(term);
  }
});
