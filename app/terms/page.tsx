import { BrandHomeLink } from "@/components/brand/BrandHomeLink";
import { LegalFooter } from "@/components/legal/LegalFooter";

const sections = [
  ["1. The Platform", "West Peek Live supports virtual and hybrid event operations, including event registration, attendee venue access, livestream and fallback video workflows, chat, expo/sponsor areas, networking, help requests, production dashboards, run-of-show tools, speaker/sponsor/client portals, crew access, and operator workflows. Features may vary by event, configuration, access level, provider availability, and production plan."],
  ["2. Event Organizer Responsibility", "Each event organizer, client, or production owner is responsible for the event content, schedule, speakers, sponsors, attendee communications, event policies, and any promises made to attendees, sponsors, speakers, or clients. West Peek Productions may provide platform infrastructure, production workflows, and operating support, but the event organizer remains responsible for event-specific representations unless otherwise agreed in a separate written agreement."],
  ["3. Accounts, Access, and Credentials", "Some areas require event registration, event codes, access links, passwords, cookies, or role-based credentials. You agree not to share credentials with unauthorized people, bypass role gates, access areas not intended for you, impersonate another user or role, interfere with authentication or access controls, or use leaked, guessed, or unauthorized passwords. We may revoke, suspend, or limit access at any time if we believe access is unauthorized, unsafe, abusive, or inconsistent with these Terms or event rules."],
  ["4. Event Participation Rules", "When participating in an event, you agree to behave professionally and lawfully. You may not harass, threaten, defame, abuse, discriminate, post unlawful or infringing content, spam chats or support tools, disrupt livestreams or sessions, upload malware, record or redistribute event content unless authorized, attempt unauthorized data access, or interfere with moderation or safety controls. We and event organizers may moderate, remove, restrict, or report content or activity that violates these Terms or event rules."],
  ["5. User Content", "You may submit content through the platform, including profile information, chat messages, questions, help requests, sponsor interactions, speaker/sponsor materials, production notes, and event setup information. You retain ownership of content you submit, subject to any separate agreement or event terms. You grant West Peek Productions a limited license to host, process, display, transmit, store, moderate, and use that content as needed to operate the platform, provide event services, support users, maintain security, and create event reports. You are responsible for ensuring you have the rights needed to submit content."],
  ["6. Livestreams, Recordings, and Event Media", "Events may include livestreams, recordings, replays, screenshots, transcripts, chat logs, attendee-submitted content, sponsor materials, and production media. Recording and replay availability depends on event configuration and organizer instructions. You may not record, redistribute, commercialize, or republish event media unless authorized by the event organizer or applicable rights holder. If you appear on camera, speak, submit questions, join networking, participate in chat, or provide materials, your name, likeness, voice, profile information, or submitted content may appear in the event experience or related event records."],
  ["7. Sponsor and Exhibitor Interactions", "Sponsors and exhibitors may operate booths, lead forms, offers, demos, downloads, or follow-up workflows. Attending an event does not automatically authorize every sponsor to receive your full attendee profile. Sponsor information sharing should occur when you intentionally engage, opt in, request follow-up, submit a form, or otherwise authorize the sharing. Third-party sponsor sites, offers, and communications are the responsibility of the sponsor or exhibitor."],
  ["8. Platform Availability and Technical Issues", "We aim to provide a reliable event platform, but live events depend on many systems, including internet connections, browsers, devices, hosting providers, livestream providers, video conferencing tools, databases, email providers, and third-party services. We do not guarantee uninterrupted or error-free operation. Events may experience delays, outages, failovers, provider issues, degraded video quality, chat interruptions, access problems, or other technical disruptions. Where configured, the platform may provide fallback experiences, such as alternate video providers, backup room links, pre-stream cards, switching overlays, replay pages, help flows, or production support."],
  ["9. Third-Party Services", "West Peek Live may integrate with or link to third-party services, including hosting providers, database providers, livestream providers, video conferencing services, email services, analytics tools, payment processors, calendar tools, sponsor websites, and social platforms. Third-party services are governed by their own terms and privacy policies. We are not responsible for third-party services, content, outages, or policies."],
  ["10. Fees, Payments, and Client Agreements", "Some West Peek Live services may be provided under separate proposals, order forms, statements of work, subscriptions, or client agreements. If there is a conflict between these Terms and a signed written agreement with West Peek Productions, the signed written agreement controls for that client relationship."],
  ["11. Intellectual Property", "West Peek Live, West Peek Productions, platform designs, workflows, software, interfaces, documentation, brand elements, logos, and related materials are owned by West Peek Productions or its licensors. You may not copy, modify, reverse engineer, resell, frame, scrape, or create derivative works from the platform except as permitted by law or a written agreement. Event-specific content may be owned by event organizers, clients, speakers, sponsors, or other rights holders."],
  ["12. Feedback", "If you provide feedback, suggestions, ideas, or requests, you allow West Peek Productions to use them without restriction or compensation, unless otherwise agreed in writing."],
  ["13. Privacy", "Our Privacy Policy explains how we collect, use, disclose, and protect information. By using West Peek Live, you also agree to the Privacy Policy."],
  ["14. Prohibited Security Activity", "You may not probe, scan, or test platform vulnerabilities without written authorization; bypass access controls; interfere with rate limits or security systems; attempt to obtain secrets, keys, passwords, tokens, or private configuration; access production, operator, crew, sponsor, speaker, client, or attendee data without authorization; or use automated tools to overload, scrape, or disrupt the platform."],
  ["15. Suspension and Termination", "We may suspend, restrict, revoke, or terminate access if we believe you violated these Terms, event rules, law, security requirements, or the rights of others. Event organizers may also remove or restrict participants from an event."],
  ["16. Disclaimers", "West Peek Live is provided on an “as is” and “as available” basis. To the maximum extent permitted by law, West Peek Productions disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, uninterrupted availability, error-free operation, and that all issues will be corrected. We do not guarantee event attendance, sponsor results, revenue, engagement, lead quality, technical performance, recording quality, or any particular business outcome."],
  ["17. Limitation of Liability", "To the maximum extent permitted by law, West Peek Productions will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost revenue, lost data, lost goodwill, business interruption, or event disruption, even if advised of the possibility of such damages. To the maximum extent permitted by law, West Peek Productions’ total liability for claims relating to the platform will be limited to the amount paid to West Peek Productions for the specific service giving rise to the claim during the three months before the event giving rise to liability, or one hundred dollars if no amount was paid. Some jurisdictions do not allow certain limitations, so some limitations may not apply."],
  ["18. Indemnification", "You agree to defend, indemnify, and hold harmless West Peek Productions from claims, damages, liabilities, losses, and expenses arising from your use of the platform, your content, your violation of these Terms, your violation of law, or your infringement of another person’s rights."],
  ["19. Governing Law", "These Terms are governed by the laws of the State of Tennessee, without regard to conflict-of-law principles, unless a separate written agreement states otherwise."],
  ["20. Changes to These Terms", "We may update these Terms from time to time. When we do, we will update the effective date. Continued use of the platform after changes means you accept the updated Terms."],
  ["21. Contact", "For support or questions about these Terms, email info@westpeek.ventures."]
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-ash text-brand-black">
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <BrandHomeLink size="md" />
        <article className="mt-8 rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Terms of Use</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Terms of Use</h1>
          <p className="mt-4 text-sm font-bold text-brand-muted">Effective Date: May 21, 2026</p>
          <p className="mt-6 text-sm leading-7 text-brand-muted">
            These Terms of Use (“Terms”) govern access to and use of West Peek Live, an event operating platform produced by West Peek Productions LLC (“West Peek Productions,” “we,” “us,” or “our”).
          </p>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            By accessing or using West Peek Live, you agree to these Terms. If you are using West Peek Live on behalf of a company, client, event organizer, sponsor, speaker, production team, or other organization, you represent that you have authority to use the platform on behalf of that organization.
          </p>
          <div className="mt-8 space-y-8">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-xl font-black tracking-tight">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-brand-muted">{body}</p>
              </section>
            ))}
          </div>
        </article>
      </section>
      <LegalFooter variant="standard" />
    </main>
  );
}
