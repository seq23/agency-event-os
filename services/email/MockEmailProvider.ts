import type { EmailMessage, EmailProvider, EmailSendResult } from "./EmailProvider";

export class MockEmailProvider implements EmailProvider {
  public sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<EmailSendResult> {
    this.sent.push(message);

    return {
      id: `mock-email-${this.sent.length}`,
      provider: "mock",
      status: "queued",
    };
  }
}
