const fs = require("fs");

const reads = (file) => {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(file, "utf8");
};

const requiredByFile = {
  "app/app/events/new/page.tsx": ["Production feed / source", "StreamYard", "Primary embedded distribution", "LiveKit", "Daily, then Zoom + Google Meet"],
  "app/operator-packet/page.tsx": ["StreamYard production feed/source", "LiveKit embedded distribution", "Daily embedded fallback", "Zoom + Google Meet backup continuity links", "Public pages must never display Day 1 passwords"],
  "lib/crew/crewBriefing.ts": ["Production feed/source is StreamYard", "Primary embedded venue distribution is LiveKit", "Daily is the secondary embedded fallback candidate", "Zoom and Google Meet are white-label backup room links"],
  "docs/AGENCY_EVENT_OS_DAY1_OPERATOR_PACKET.md": ["Production feed/source: StreamYard", "Primary embedded event engine/distribution: LiveKit", "Do not collapse StreamYard and LiveKit into the same failure plane"],
  "tests/e2e/day1-showtime-master-gauntlet.spec.ts": ["Production feed", "StreamYard", "Primary embedded distribution", "Click to Copy RTMP URL", "Click to Copy Stream Key", "LIVEKIT_INGRESS_LIVE", "STREAMYARD_FEED", "LIVEKIT_DISTRIBUTION", "DAILY_LIVE"],
  "tests/e2e/streamyard-producer-ingress.spec.ts": ["StreamYard", "ingress", "keep streamyard running", "switch attendees to daily"],
  "scripts/validate_v7_day1_packet.js": ["StreamYard", "Production feed/source", "Primary embedded event engine/distribution"],
};

const staleByFile = {
  "app/app/events/new/page.tsx": ["Primary video provider"],
  "app/operator-packet/page.tsx": ["LiveKit primary → Daily fallback"],
  "lib/crew/crewBriefing.ts": ["Primary venue distribution is LiveKit unless production announces otherwise", "Confirm LiveKit primary and Daily / Zoom / Google Meet fallback context"],
  "docs/AGENCY_EVENT_OS_DAY1_OPERATOR_PACKET.md": ["Primary embedded event engine: LiveKit."],
  "tests/e2e/day1-showtime-master-gauntlet.spec.ts": ["getByLabel(/Primary video provider/i)", "toContainText(/LiveKit.*Daily, then Zoom"],
};


const stalePatternByFile = {
  "app/operator-packet/page.tsx": [/SpeakerGuest-\d{4}!/, /SponsorGuest-\d{4}!/, /VIPGuest-\d{4}!/],
};

const failures = [];
for (const [file, tokens] of Object.entries(requiredByFile)) {
  const text = reads(file);
  for (const token of tokens) {
    if (!text.includes(token)) failures.push(`${file} missing required StreamYard model token: ${token}`);
  }
}
for (const [file, tokens] of Object.entries(staleByFile)) {
  const text = reads(file);
  for (const token of tokens) {
    if (text.includes(token)) failures.push(`${file} still contains stale operator-facing model token: ${token}`);
  }
}
for (const [file, patterns] of Object.entries(stalePatternByFile)) {
  const text = reads(file);
  for (const pattern of patterns) {
    if (pattern.test(text)) failures.push(`${file} still contains legacy guest-code pattern: ${pattern}`);
  }
}

for (const file of ["app/venue/[eventId]/stage/page.tsx", "app/venue/[eventId]/lobby/page.tsx", "app/events/[eventSlug]/page.tsx"]) {
  if (!fs.existsSync(file)) continue;
  const text = reads(file);
  for (const secretToken of ["livekitStreamKey", "Click to Copy Stream Key", "Stream Key", "RTMP URL"]) {
    if (text.includes(secretToken)) failures.push(`${file} must not expose operator-only StreamYard credential token: ${secretToken}`);
  }
}

if (failures.length) {
  console.error("validate_day1_streamyard_model_contract: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("validate_day1_streamyard_model_contract: PASS — static model/copy/guardrail proof only; real provider smoke is separate.");
