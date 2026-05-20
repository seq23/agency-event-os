const fs = require("fs");
const env = fs.readFileSync("lib/env.ts", "utf8");
if (env.includes("VIDEO_PROVIDER=mock is not allowed in production unless")) {
  console.error("validate_env_does_not_crash_access_gates: FAIL — getEnv must not globally block access gates because VIDEO_PROVIDER is unset/mock");
  process.exit(1);
}
console.log("validate_env_does_not_crash_access_gates: PASS");
