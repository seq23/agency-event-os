const fs = require("fs");
const path = require("path");
const forbiddenFiles = [".env", ".env.local", ".env.production", ".open-next", ".wrangler"];
for (const target of forbiddenFiles) if (fs.existsSync(target)) throw new Error(`Forbidden local/generated artifact present: ${target}`);
// node_modules is intentionally allowed in an installed validation workspace. Packaging checks exclude it from delivered ZIPs.
const secretPatterns = [/sk_live_[A-Za-z0-9]/i, /SUPABASE_SERVICE_ROLE_KEY[ \t]*=[ \t]*[^\n#]+/, /RESEND_API_KEY[ \t]*=[ \t]*[^\n#]+/, /LIVEKIT_API_SECRET[ \t]*=[ \t]*[^\n#]+/, /-----BEGIN PRIVATE KEY-----/];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", ".next", ".open-next", ".wrangler"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      const rel = path.relative(process.cwd(), full);
      if (["scripts/validate_v5_no_secrets.js", "scripts/import_event_config_package.js", "scripts/validate_event_config_package.js"].includes(rel)) continue;
      const body = fs.readFileSync(full, "utf8");
      for (const pattern of secretPatterns) if (pattern.test(body)) throw new Error(`Secret-like value found in ${full}`);
    }
  }
}
walk(".");
console.log("validate_v5_no_secrets: PASS");
