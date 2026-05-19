import { describe, expect, it } from "vitest";
import {
  buildClientInvite,
  buildEmailSendLog,
  buildEmailWorkflowStatus,
  buildProductionEmailRequest,
  buildReportReadyEmail,
  buildTestingFailureAlert,
  buildWorkflowPreview,
  renderEmailWorkflowText,
} from "@/services/email";

describe("production email sending", () => {
  it("builds production email requests for required workflows", () => {
    const request = buildProductionEmailRequest({
      workflowType: "client_invite",
      to: "client@example.com",
      subject: "Client invite",
      eventName: "Founder Summit",
      recipientName: "Ava",
      actionUrl: "https://example.com/client",
      agencyId: "agency-1",
      eventId: "event-1",
    });

    expect(request.workflowType).toBe("client_invite");
    expect(request.recipient.email).toBe("client@example.com");
    expect(request.html).toContain("Open task");
    expect(request.text).toContain("Agency Event OS");
  });

  it("builds workflow-specific production requests", () => {
    expect(buildClientInvite({ to: "client@example.com", eventName: "Event" }).workflowType).toBe("client_invite");
    expect(buildTestingFailureAlert({ to: "producer@example.com", eventName: "Event" }).workflowType).toBe("testing_failure_alert");
    expect(buildReportReadyEmail({ to: "client@example.com", eventName: "Event" }).workflowType).toBe("report_ready");
  });

  it("builds send logs and workflow statuses", () => {
    const request = buildProductionEmailRequest({
      workflowType: "report_ready",
      to: "client@example.com",
      subject: "Report ready",
      eventName: "Founder Summit",
    });

    const log = buildEmailSendLog({
      request,
      result: {
        id: "resend-1",
        provider: "resend",
        status: "sent",
      },
    });

    expect(log.status).toBe("sent");
    expect(log.providerMessageId).toBe("resend-1");

    const status = buildEmailWorkflowStatus({
      agencyId: "agency-1",
      eventId: "event-1",
      workflowType: "report_ready",
    });

    expect(status.liveSendingEnabled).toBe(true);
  });

  it("renders previews", () => {
    const preview = buildWorkflowPreview({
      workflowType: "speaker_invite",
      to: "speaker@example.com",
      subject: "",
      eventName: "Founder Summit",
    });

    expect(preview.subject).toContain("Speaker invite");
    expect(renderEmailWorkflowText({
      workflowType: "speaker_invite",
      to: "speaker@example.com",
      subject: "Speaker",
      summary: "Join backstage.",
    })).toContain("Join backstage.");
  });
});
