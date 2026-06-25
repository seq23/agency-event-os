const fs = require("fs");
const cookie = fs.readFileSync("lib/auth/productionAccess.ts", "utf8");
const audit = fs.readFileSync("services/access/accessAuditService.ts", "utf8");
const tests = fs.readFileSync("tests/unit/productionAccessCookie.test.ts", "utf8");
if (!cookie.includes("HMAC") || !cookie.includes("SHA-256") || !cookie.includes("constantTimeEqual")) throw new Error("Access cookies must use HMAC SHA-256 and constant time comparison.");
for (const bad of ["local-v4-access-secret", "crew-demo", "client-demo", "speaker-demo", "sponsor-demo", "vip-demo"]) {
  if (cookie.includes(bad) || audit.includes(bad)) throw new Error(`Hardcoded access fallback found: ${bad}`);
}
for (const token of ["ipHash", "userAgentHash", "access_attempted", "access_denied", "appendAccessAttempt"]) {
  if (!audit.includes(token)) throw new Error(`Missing access audit invariant: ${token}`);
}
for (const token of ["tampered", "expired", "unusable secrets"]) {
  if (!tests.includes(token)) throw new Error(`Missing access cookie behavioral test: ${token}`);
}
console.log("validate_v5_access_security: PASS");
