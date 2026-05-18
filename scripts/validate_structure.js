const fs = require("fs");

const required = [
  "package.json",
  "README.md",
  ".env.example",
  ".gitignore",
  "docs",
  "app",
  "components",
  "lib",
  "services",
  "types",
  "db",
  "tests",
  "scripts"
];

const missing = required.filter((path) => !fs.existsSync(path));

if (missing.length) {
  console.error("Missing required paths:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Structure check passed.");
