import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000";
const systemChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium";
const executablePath = fs.existsSync(systemChromium) ? systemChromium : undefined;
const disableVideo = process.env.PLAYWRIGHT_DISABLE_VIDEO === "1" || process.env.PLAYWRIGHT_DISABLE_VIDEO === "true";
const headed = process.env.PLAYWRIGHT_HEADED === "1" || process.env.PLAYWRIGHT_HEADED === "true";
const retries = Number.parseInt(process.env.PLAYWRIGHT_RETRIES || (process.env.CI ? "1" : "0"), 10);

const chromiumArgs = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-proxy-server",
  "--proxy-bypass-list=*",
  "--allow-insecure-localhost",
  "--disable-web-security",
  "--disable-features=BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessSendPreflights",
];

if (executablePath && !headed) {
  chromiumArgs.unshift("--headless=new");
}

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: disableVideo ? "off" : "on-first-retry",
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: headed ? false : undefined,
        launchOptions: {
          executablePath,
          args: chromiumArgs,
        },
      },
    },
  ],
});
