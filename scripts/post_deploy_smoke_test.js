#!/usr/bin/env node
const assert = require("assert");

const baseUrl = (process.env.WPL_SMOKE_BASE_URL || "https://westpeek.live").replace(/\/$/, "");
const routes = ["/", "/login", "/signup", "/forgot-password", "/venue/demo/lobby", "/events/demo/register"];
const dynamicHeaderRoutes = ["/app", "/app/events", "/venue/demo/lobby"];

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function checkRoute(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { redirect: "follow" });
  const html = await response.text();
  const text = visibleText(html);
  return {
    type: "route",
    path: pathname,
    status: response.status,
    title: (html.match(/<title>(.*?)<\/title>/i) || [])[1] || null,
    hasBrand: text.includes("West Peek"),
    visible404: text.includes("404: This page could not be found"),
    hasApplicationError: text.includes("Application error"),
  };
}

async function checkHeaders(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, { method: "HEAD", redirect: "follow" });
  return {
    type: "headers",
    path: pathname,
    status: response.status,
    server: response.headers.get("server"),
    openNext: response.headers.get("x-opennext"),
    poweredBy: response.headers.get("x-powered-by"),
  };
}

async function postJson(pathname, payload) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch {}
  return { type: "api", path: pathname, status: response.status, json };
}

function hasNestedToken(result) {
  return Boolean(result?.json?.result?.token?.token || result?.json?.token);
}

function hasNestedUrl(result, key) {
  return Boolean(result?.json?.result?.[key] || result?.json?.[key]);
}

(async () => {
  const results = [];
  for (const route of routes) results.push(await checkRoute(route));
  for (const route of dynamicHeaderRoutes) results.push(await checkHeaders(route));

  results.push(await postJson("/api/video/livekit-token", {
    eventId: "demo",
    roomId: "demo-main-stage",
    roomType: "main_stage",
    displayName: "Smoke Tester",
    role: "producer",
  }));

  results.push(await postJson("/api/video/daily-token", {
    eventId: "demo",
    roomId: "demo-main-stage",
    roomType: "main_stage",
    displayName: "Smoke Tester",
    role: "producer",
  }));

  results.push(await postJson("/api/video/zoom-signature", {
    meetingNumber: "12345678901",
    role: 0,
  }));

  for (const result of results) console.log(JSON.stringify(result));

  for (const result of results) {
    if (result.type === "route") {
      assert(result.status < 400, `${result.path} returned ${result.status}`);
      assert(result.hasBrand, `${result.path} did not include visible West Peek brand text`);
      assert(!result.visible404, `${result.path} rendered visible 404 text`);
      assert(!result.hasApplicationError, `${result.path} rendered a visible application error`);
    }

    if (result.type === "headers") {
      assert(result.status < 400, `${result.path} header check returned ${result.status}`);
      assert(String(result.server || "").toLowerCase().includes("cloudflare"), `${result.path} is not served by Cloudflare`);
      assert(result.openNext === "1", `${result.path} is missing x-opennext: 1`);
    }
  }

  const liveKit = results.find((result) => result.path === "/api/video/livekit-token");
  assert(liveKit.status === 200, `LiveKit token route returned ${liveKit.status}`);
  assert(liveKit.json?.ok === true, "LiveKit token route did not return ok=true");
  assert(hasNestedToken(liveKit), "LiveKit token route did not return a token");
  assert(hasNestedUrl(liveKit, "livekitUrl"), "LiveKit token route did not return livekitUrl");

  const daily = results.find((result) => result.path === "/api/video/daily-token");
  assert(daily.status === 200, `Daily fallback route returned ${daily.status}`);
  assert(daily.json?.ok === true, "Daily fallback route did not return ok=true");
  assert(hasNestedToken(daily), "Daily fallback route did not return a token");
  assert(hasNestedUrl(daily, "dailyUrl"), "Daily fallback route did not return dailyUrl");
  assert(daily.json?.result?.fallbackProvider === "daily", "Daily fallback route did not identify daily fallback provider");

  const zoom = results.find((result) => result.path === "/api/video/zoom-signature");
  assert(zoom.status === 200, `Zoom signature route returned ${zoom.status}`);
  assert(Boolean(zoom.json?.signature), "Zoom signature route did not return a signature");
  assert(Boolean(zoom.json?.sdkKey), "Zoom signature route did not return sdkKey");

  console.log("post_deploy_smoke_test: OK");
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
