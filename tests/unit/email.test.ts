import { describe, expect, it } from "vitest";
import { MockEmailProvider, sendEmail } from "@/services/email";

describe("email service", () => {
  it("sends through mock provider", async () => {
    const provider = new MockEmailProvider();

    const result = await sendEmail(
      {
        to: "client@example.com",
        subject: "Approval requested",
        html: "<p>Review approval</p>",
      },
      provider,
    );

    expect(result.provider).toBe("mock");
    expect(result.status).toBe("queued");
    expect(provider.sent).toHaveLength(1);
  });
});
