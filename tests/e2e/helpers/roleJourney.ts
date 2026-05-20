import { createHmac } from "node:crypto";
import { expect, type Page } from "@playwright/test";
import { gotoAndAssert } from "./assertNoAppError";

type RouteExpectation = {
  path: string;
  label: string;
  terms?: string[];
  anyOf?: string[];
  actions?: string[];
};


const DEFAULT_E2E_SECRET = "local-playwright-gauntlet-cookie-secret-1234567890";

function baseUrl() {
  return process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
}

function cookieSecure() {
  return baseUrl().startsWith("https://");
}

function expiresIn(hours: number) {
  return Math.floor((Date.now() + hours * 60 * 60 * 1000) / 1000);
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function createV5AccessCookie(payload: Record<string, unknown>, secret = process.env.V5_ACCESS_COOKIE_SECRET || DEFAULT_E2E_SECRET) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `v5.${body}.${signature}`;
}

function createSessionCookie() {
  return base64UrlEncode(JSON.stringify({
    accessToken: "local-playwright-gauntlet-session",
    refreshToken: "local-playwright-gauntlet-refresh",
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
  }));
}

export async function grantAgencySession(page: Page) {
  await page.context().addCookies([{ 
    name: process.env.AUTH_SESSION_COOKIE_NAME || "agency_event_os_session",
    value: createSessionCookie(),
    url: baseUrl(),
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "Lax",
    expires: expiresIn(12),
  }]);
}

export async function grantCrewAccess(page: Page, role = "producer", eventId?: string) {
  await page.context().addCookies([{ 
    name: process.env.V5_CREW_COOKIE_NAME || "wpl_crew_access",
    value: createV5AccessCookie({ kind: "crew", role, eventId, issuedAt: Date.now(), expiresAt: Date.now() + 8 * 60 * 60 * 1000 }),
    url: baseUrl(),
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "Lax",
    expires: expiresIn(8),
  }]);
}

export async function grantSpecialGuestAccess(page: Page, role: "client" | "speaker" | "sponsor" | "crew_lite" | "vip", eventId = "demo") {
  await page.context().addCookies([{ 
    name: process.env.V5_SPECIAL_GUEST_COOKIE_NAME || "wpl_guest_access",
    value: createV5AccessCookie({ kind: "special_guest", role, eventId, issuedAt: Date.now(), expiresAt: Date.now() + 12 * 60 * 60 * 1000 }),
    url: baseUrl(),
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "Lax",
    expires: expiresIn(12),
  }]);
}

export async function expectVisibleRoute(page: Page, route: RouteExpectation) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await gotoAndAssert(page, route.path);
  const body = (await page.locator("body").innerText()).toLowerCase();
  expect(body.length, `${route.label} should render meaningful body copy`).toBeGreaterThan(40);

  for (const term of route.terms ?? []) {
    expect(body, `${route.label} should contain ${term}`).toContain(term.toLowerCase());
  }

  if (route.anyOf?.length) {
    expect(
      route.anyOf.some((term) => body.includes(term.toLowerCase())),
      `${route.label} should contain one of: ${route.anyOf.join(", ")}`,
    ).toBeTruthy();
  }

  for (const action of route.actions ?? []) {
    await expect(page.getByText(new RegExp(action, "i")).first(), `${route.label} action ${action} should be visible`).toBeVisible();
  }

  const materialErrors = [...pageErrors, ...consoleErrors].filter((entry) => {
    const text = entry.toLowerCase();
    return !text.includes("favicon") && !text.includes("hydration") && !text.includes("failed to load resource: the server responded with a status of 404");
  });

  expect(materialErrors, `${route.label} should not emit page/console errors`).toEqual([]);
}

export async function expectRouteMatrix(page: Page, routes: RouteExpectation[]) {
  for (const route of routes) {
    await expectVisibleRoute(page, route);
  }
}

export async function expectLinksStayFirstParty(page: Page, selector = "a[href]") {
  const hrefs = await page.locator(selector).evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  for (const href of hrefs) {
    const url = new URL(href);
    expect(["127.0.0.1", "localhost", "westpeek.live", "www.westpeek.live"], `first-party or local link expected: ${href}`).toContain(url.hostname);
  }
}
