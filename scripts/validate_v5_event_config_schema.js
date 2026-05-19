const fs = require("fs");
function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
const events = read("data/events/events.json").events;
if (!Array.isArray(events) || events.length === 0) throw new Error("data/events/events.json must contain events[].");
const access = read("data/access/event-access-config.json");
for (const event of events) {
  for (const key of ["slug", "eventId", "publicCode", "status", "configPath"]) if (!event[key]) throw new Error(`Event index missing ${key}`);
  const config = read(event.configPath);
  if (config.id !== event.eventId) throw new Error(`Event config id mismatch for ${event.slug}`);
  if (config.slug !== event.slug) throw new Error(`Event config slug mismatch for ${event.slug}`);
  if (!config.clientSlug) throw new Error(`Event config missing clientSlug for ${event.slug}`);
  const accessConfig = access.events[event.slug];
  if (!accessConfig || accessConfig.eventId !== event.eventId) throw new Error(`Access config missing/mismatched for ${event.slug}`);
  for (const role of accessConfig.specialGuestCodes) {
    if (!role.envKey || !/^[A-Z0-9_]+$/.test(role.envKey)) throw new Error(`Invalid envKey for ${event.slug}`);
    if (!role.destinationTemplate || !role.destinationTemplate.includes("{eventId}")) throw new Error(`Role ${role.role} missing destinationTemplate with {eventId}.`);
    if (/demo|password|secret/i.test(role.envKey.replace("EVENT_DEMO", "EVENT")) === false && !role.envKey.startsWith("EVENT_")) throw new Error(`Role ${role.role} envKey must be an env key name.`);
  }
}
console.log("validate_v5_event_config_schema: PASS");
