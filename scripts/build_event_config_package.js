const fs = require("fs");
const path = require("path");
const slug = process.argv[2] || "demo";
function fail(message) { console.error(message); process.exit(1); }
if (!/^[a-z0-9-]+$/.test(slug)) fail("Slug must be kebab-case.");
const out = path.join("event-config-packages", slug);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const files = [
  `data/events/${slug}/event.json`,
  `data/events/${slug}/branding.json`,
  `data/events/${slug}/attendee.json`,
  `data/events/${slug}/agenda.json`,
  `data/events/${slug}/speakers.json`,
  `data/events/${slug}/sponsors.json`,
  `data/events/${slug}/run-of-show.json`,
  `data/events/${slug}/video.json`,
  `data/events/${slug}/communications.json`,
  "data/access/event-access-config.json",
];
for (const file of files) {
  if (!fs.existsSync(file)) fail(`Cannot package missing file ${file}`);
  const target = path.join(out, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
}
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify({ slug, generatedAt: new Date().toISOString(), files }, null, 2) + "\n");
console.log(`Built ${out}`);
