const fs = require("fs");
function fail(message) { console.error("validate_global_logo_and_stage_features: FAIL — " + message); process.exit(1); }
const layout = fs.readFileSync("app/layout.tsx", "utf8");
if (!layout.includes("GlobalWestPeekLogoLink")) fail("Root layout must render the global West Peek Productions logo link");
const logo = fs.readFileSync("components/brand/GlobalWestPeekLogoLink.tsx", "utf8");
if (!logo.includes("https://westpeek.live")) fail("Global logo must link to https://westpeek.live");
const stage = fs.readFileSync("components/venue/MainStageExperience.tsx", "utf8");
for (const term of ["MainStageLiveChat", "MainStageAgendaStrip", "FloatingHelpButton"]) if (!stage.includes(term)) fail("Main stage missing " + term);
const people = fs.readFileSync("components/venue/PeopleDirectoryCard.tsx", "utf8");
for (const term of ["reasonForAttending", "interestingFact", "personalWebsite", "socialLinks"]) if (!people.includes(term)) fail("People profile cards missing " + term);
console.log("validate_global_logo_and_stage_features: PASS");

const agenda = fs.readFileSync("components/venue/MainStageAgendaStrip.tsx", "utf8");
if (!agenda.includes("/run-of-show") || !agenda.includes("Open Run of Show")) fail("Main stage agenda strip must link to attendee Run of Show");
if (!fs.existsSync("app/venue/[eventId]/run-of-show/page.tsx")) fail("Attendee-safe venue Run of Show route must exist");
for (const file of ["tests/e2e/role-gates.spec.ts", "tests/e2e/registration-profile.spec.ts", "tests/e2e/people-profile.spec.ts"]) if (!fs.existsSync(file)) fail("missing browser coverage " + file);
