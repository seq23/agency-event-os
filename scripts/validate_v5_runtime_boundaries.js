const fs = require("fs");
const migrationFiles = fs.readdirSync("db/migrations").filter((name) => /^\d{4}_.*\.sql$/.test(name));
const nums = new Map();
for (const file of migrationFiles) {
  const num = file.slice(0, 4);
  if (nums.has(num)) throw new Error(`Duplicate migration number ${num}: ${nums.get(num)} and ${file}`);
  nums.set(num, file);
}
const migration = fs.readFileSync("db/migrations/0019_v5_access_security_runtime_boundaries.sql", "utf8");
for (const token of ["v5_access_attempt_events", "v5_runtime_fallback_events", "v5_analytics_events", "service_role", "enable row level security"]) {
  if (!migration.includes(token)) throw new Error(`Migration missing runtime boundary invariant: ${token}`);
}
for (const file of ["services/runtime/runtimeStoreFactory.ts", "services/runtime/fileRuntimeStore.ts", "services/runtime/supabaseRuntimeStore.ts", "services/analytics/analyticsEventService.ts", "services/video/roomFallbackService.ts", "services/audit/createAuditLog.ts"]) {
  if (!fs.existsSync(file)) throw new Error(`Missing runtime boundary file: ${file}`);
}
const fallback = fs.readFileSync("services/video/roomFallbackService.ts", "utf8");
if (fallback.includes("logAccessAttempt")) throw new Error("Video fallback must not be logged as access attempts.");
for (const token of ["getRuntimeStore", "appendFallbackEvent", "setFallbackState", "manual_switch", "rollback"]) {
  if (!fallback.includes(token)) throw new Error(`Fallback runtime missing ${token}`);
}
const analytics = fs.readFileSync("services/analytics/analyticsEventService.ts", "utf8");
if (!analytics.includes("getRuntimeStore") || !analytics.includes("appendAnalyticsEvent")) throw new Error("Analytics events must persist through runtime store adapter.");
console.log("validate_v5_runtime_boundaries: PASS");
