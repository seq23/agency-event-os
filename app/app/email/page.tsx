import { EmailStatusPanel } from "@/components/email/EmailStatusPanel";
import { EmailWorkflowMatrix } from "@/components/email/EmailWorkflowMatrix";
import { TestEmailPanel } from "@/components/email/TestEmailPanel";

export default function EmailPage() {
  return (
    <main className="space-y-6">
      <EmailStatusPanel />
      <TestEmailPanel />
      <EmailWorkflowMatrix />
    </main>
  );
}
