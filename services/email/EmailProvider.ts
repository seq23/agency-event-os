export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  id: string;
  provider: "mock" | "resend";
  status: "queued" | "sent" | "skipped";
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailSendResult>;
}
