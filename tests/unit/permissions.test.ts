import { describe, expect, it } from "vitest";
import { can } from "@/lib/permissions";
import { CAPABILITIES } from "@/lib/permissions/capabilities";
import { mockUsers } from "@/lib/mock/mockData";

const owner = mockUsers.find((user) => user.id === "user-sequoia")!;
const contractor = mockUsers.find((user) => user.id === "user-contractor-ava")!;
const client = mockUsers.find((user) => user.id === "user-client-elena")!;
const sponsor = mockUsers.find((user) => user.id === "user-sponsor-riley")!;
const attendee = mockUsers.find((user) => user.id === "user-attendee-sam")!;

describe("permissions", () => {
  it("allows agency owner broad agency access", () => {
    expect(can(owner, CAPABILITIES.AGENCY_VIEW_DASHBOARD, { id: "agency-wpp", agencyId: "agency-wpp" })).toBe(true);
  });

  it("limits contractors to assigned work", () => {
    expect(
      can(contractor, CAPABILITIES.CONTRACTOR_VIEW_OWN_ASSIGNMENTS, {
        id: "task-1",
        agencyId: "agency-wpp",
        eventId: "event-summit",
        contractorAssignmentId: "contractor-assignment-ava-summit",
      }),
    ).toBe(true);

    expect(
      can(contractor, CAPABILITIES.EVENT_VIEW, {
        id: "event-webinar",
        agencyId: "agency-wpp",
        eventId: "event-webinar",
      }),
    ).toBe(false);
  });

  it("keeps clients on client-facing resources", () => {
    expect(
      can(client, CAPABILITIES.EVENT_VIEW_CLIENT_FACING, {
        id: "event-summit",
        agencyId: "agency-wpp",
        clientId: "client-nova",
        eventId: "event-summit",
        clientVisible: true,
      }),
    ).toBe(true);

    expect(
      can(client, CAPABILITIES.EVENT_VIEW_INTERNAL, {
        id: "event-summit",
        agencyId: "agency-wpp",
        clientId: "client-nova",
        eventId: "event-summit",
        clientVisible: false,
        visibility: "internal_agency",
      }),
    ).toBe(false);
  });

  it("limits sponsors to their own sponsor resources", () => {
    expect(
      can(sponsor, CAPABILITIES.SPONSOR_VIEW_OWN_LEADS, {
        id: "booth-clarity",
        agencyId: "agency-wpp",
        eventId: "event-summit",
        sponsorId: "sponsor-clarity",
      }),
    ).toBe(true);

    expect(
      can(sponsor, CAPABILITIES.SPONSOR_VIEW_OWN_LEADS, {
        id: "booth-other",
        agencyId: "agency-wpp",
        eventId: "event-summit",
        sponsorId: "sponsor-other",
      }),
    ).toBe(false);
  });

  it("denies attendees from admin surfaces", () => {
    expect(can(attendee, CAPABILITIES.PRODUCTION_VIEW_COMMAND_CENTER, { id: "event-summit", agencyId: "agency-wpp", eventId: "event-summit" })).toBe(false);
  });
});
