const fs = require("fs");
const path = require("path");

const root = process.cwd();
const failures = [];

const requiredFiles = [
  "types/whiteLabelVideo.ts",
  "services/video/zoomMeetingSdkAuth.ts",
  "app/api/video/zoom-signature/route.ts",
  "components/video/ZoomEmbeddedRoom.tsx",
  "components/video/WhiteLabelVideoRoom.tsx",
  "docs/WHITE_LABEL_FALLBACK_VIDEO_19A.md",
];

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(root, rel))) {
    failures.push(`Missing white-label fallback file: ${rel}`);
  }
}

const envExamplePath = path.join(root, ".env.example");
const envExample = fs.existsSync(envExamplePath) ? fs.readFileSync(envExamplePath, "utf8") : "";

for (const key of [
  "ZOOM_MEETING_SDK_KEY",
  "ZOOM_MEETING_SDK_SECRET",
  "NEXT_PUBLIC_ENABLE_ZOOM_EMBEDDED_FALLBACK",
]) {
  if (!envExample.includes(`${key}=`)) {
    failures.push(`Missing env example key: ${key}`);
  }
}

const attendeeFiles = [
  "components/video/ZoomEmbeddedRoom.tsx",
  "components/video/WhiteLabelVideoRoom.tsx",
];

for (const rel of attendeeFiles) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8").toLowerCase();
  for (const forbidden of ["fallback failed", "livekit failed", "zoom backup", "google backup", "panic"]) {
    if (text.includes(forbidden)) {
      failures.push(`Attendee-facing forbidden fallback language in ${rel}: ${forbidden}`);
    }
  }
}

if (failures.length) {
  console.error("White-label video validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("White-label video validation passed.");
