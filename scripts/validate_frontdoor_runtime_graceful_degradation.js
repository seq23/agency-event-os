const fs = require("fs");

function fail(message) {
  console.error(`validate_frontdoor_runtime_graceful_degradation: FAIL — ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`missing required file ${file}`);
  return fs.readFileSync(file, "utf8");
}

const venueLobby = read("components/venue/VenueLobbyDashboard.tsx");
if (!venueLobby.includes("createInitialRoomFallbackState") || !venueLobby.includes(".catch(")) {
  fail("VenueLobbyDashboard must catch fallback-state runtime persistence failure and use createInitialRoomFallbackState");
}

const roomFallback = read("services/video/roomFallbackService.ts");
if (!roomFallback.includes("export function createInitialRoomFallbackState")) {
  fail("roomFallbackService must export createInitialRoomFallbackState for graceful venue fallback");
}

const middleware = read("middleware.ts");
if (!middleware.includes('"/admin/:path*"')) {
  fail("middleware matcher must protect /admin before TestingConsole can render");
}
if (!middleware.includes('pathname.startsWith("/admin")')) {
  fail("middleware must allow authenticated /admin sessions consistently");
}

const routeAccess = read("lib/auth/routeAccess.ts");
if (!routeAccess.includes('prefix: "/admin"')) {
  fail("route access requirements must include /admin");
}

const frontDoorFiles = [
  "app/production-access/crew/page.tsx",
  "app/production-access/special-guest/page.tsx",
  "app/join/page.tsx"
];

for (const file of frontDoorFiles) {
  const body = read(file);
  if (!body.includes("<label") || !body.includes("required")) {
    fail(`${file} must include visible labels and required inputs`);
  }
}

console.log("validate_frontdoor_runtime_graceful_degradation: PASS");
