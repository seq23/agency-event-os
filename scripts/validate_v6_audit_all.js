const { execFileSync } = require("child_process");
for (const script of ["validate_v6_hard_fail.js", "validate_v6_strong_warnings.js", "validate_v6_warnings.js"]) {
  execFileSync("node", [`scripts/${script}`], { stdio: "inherit" });
}
console.log("validate_v6_audit_all: PASS");
