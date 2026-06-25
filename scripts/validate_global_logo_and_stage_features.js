const fs = require("fs");

function fail(message) {
  console.error("validate_global_logo_and_stage_features: FAIL — " + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail("missing " + file);
  return fs.readFileSync(file, "utf8");
}

const globalLogo = read("components/brand/GlobalWestPeekLogoLink.tsx");
if (!globalLogo.includes("return null")) fail("Global floating West Peek logo overlay must render null.");

const legalFooter = read("components/legal/LegalFooter.tsx");
for (const term of ["https://westpeek.live", "https://productions.joinwestpeek.com/", "mailto:info@westpeek.ventures"]) {
  if (!legalFooter.includes(term)) fail("LegalFooter missing " + term);
}

const stage = read("components/venue/MainStageExperience.tsx");
for (const term of ["MainStageLiveChat", "MainStageAgendaStrip", "StagePlayer"]) {
  if (!stage.includes(term)) fail("Main stage missing " + term);
}
if (stage.includes("FloatingHelpButton")) fail("Main stage must not render floating Help over player/chat.");

const floatingHelp = read("components/venue/FloatingHelpButton.tsx");
if (!floatingHelp.includes("/venue/${eventId}/help")) fail("FloatingHelpButton must route to event Help.");

const people = read("components/venue/PeopleDirectoryCard.tsx");
for (const term of ["reasonForAttending", "interestingFact", "personalWebsite", "socialLinks"]) {
  if (!people.includes(term)) fail("People profile cards missing " + term);
}

const agenda = read("components/venue/MainStageAgendaStrip.tsx");
if (!agenda.includes("/run-of-show") || !agenda.includes("Open Run of Show")) fail("Main stage agenda strip must link to attendee Run of Show");
if (!fs.existsSync("app/venue/[eventId]/run-of-show/page.tsx")) fail("Attendee-safe venue Run of Show route must exist");
for (const file of ["tests/e2e/role-gates.spec.ts", "tests/e2e/registration-profile.spec.ts", "tests/e2e/people-profile.spec.ts"]) {
  if (!fs.existsSync(file)) fail("missing browser coverage " + file);
}

console.log("validate_global_logo_and_stage_features: PASS");
