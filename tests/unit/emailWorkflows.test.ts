import { describe, expect, it } from "vitest";
import { buildEmailWorkflowPayload, renderEmailWorkflowText, requiredEmailWorkflows } from "@/services/email";

describe("email workflow foundation", () => {
  it("builds normalized email workflow payloads", () => {
    const payload = buildEmailWorkflowPayload({
      workflowType: "speaker_invite",
      to: "speaker@example.com",
      subject: "  Speaker invite  ",
      eventName: "Founder Summit",
      recipientName: "Jane",
      actionUrl: "https://example.com/speaker",
    });

    expect(payload.subject).toBe("Speaker invite");
    expect(payload.summary).toContain("speaker invite");
  });

  it("renders workflow body text", () => {
    const text = renderEmailWorkflowText({
      workflowType: "approval_request",
      to: "client@example.com",
      subject: "Approval needed",
      recipientName: "Client",
      actionUrl: "https://example.com/approval",
      summary: "Please approve the sponsor booth.",
    });

    expect(text).toContain("Hi Client");
    expect(text).toContain("Please approve the sponsor booth.");
  });

  it("covers required workflows", () => {
    expect(requiredEmailWorkflows).toContain("testing_failure_alert");
    expect(requiredEmailWorkflows).toContain("report_ready");
  });
});
