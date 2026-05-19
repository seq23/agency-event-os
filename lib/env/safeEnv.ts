export const DAY1_CREW_PASSWORD = "CrewAccess-2026!";
export const DAY1_SPEAKER_PASSWORD = "SpeakerGuest-2026!";
export const DAY1_SPONSOR_PASSWORD = "SponsorGuest-2026!";
export const DAY1_VIP_PASSWORD = "VIPGuest-2026!";

export function missingAccessEnv() {
  const missing: string[] = [];
  if (!process.env.CREW_ACCESS_PASSWORD) missing.push("CREW_ACCESS_PASSWORD");
  if (!process.env.V5_ACCESS_COOKIE_SECRET && !process.env.V4_ACCESS_COOKIE_SECRET) missing.push("V5_ACCESS_COOKIE_SECRET");
  return missing;
}

export function hasAccessEnv() {
  return missingAccessEnv().length === 0;
}

export function accessDefaultLines() {
  return [
    `CREW_ACCESS_PASSWORD=${DAY1_CREW_PASSWORD}`,
    `EVENT_DEMO_SPEAKER_CODE=${DAY1_SPEAKER_PASSWORD}`,
    `EVENT_DEMO_SPONSOR_CODE=${DAY1_SPONSOR_PASSWORD}`,
    `EVENT_DEMO_VIP_CODE=${DAY1_VIP_PASSWORD}`,
    "V5_ACCESS_COOKIE_SECRET=<32+ character internal cookie secret>",
  ];
}

export function safeAccessCookieNames() {
  return {
    crewCookieName: process.env.V5_CREW_COOKIE_NAME || process.env.V4_CREW_COOKIE_NAME || "wpl_crew_access",
    specialGuestCookieName: process.env.V5_SPECIAL_GUEST_COOKIE_NAME || process.env.V4_SPECIAL_GUEST_COOKIE_NAME || "wpl_guest_access",
  };
}
