import { BrandHomeLink } from "@/components/brand/BrandHomeLink";
import { LegalFooter } from "@/components/legal/LegalFooter";

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly, including name, email address, company or affiliation, title or role, website or social profile links if provided, event registration details, attendee profile details, planned sessions, sponsor booth interests, networking goals, sponsor lead opt-in choices, help requests, access information, event setup inputs, and communications preferences.",
      "We may collect event participation information, including attendance and check-in status, venue pages visited, session participation, chat messages, networking activity, sponsor booth engagement, help interactions, access attempts, moderation actions, camera or microphone request status, and event analytics.",
      "We may automatically collect technical and usage information, including IP address, browser type, device type, operating system, referring page, pages viewed, timestamps, approximate location derived from IP address, cookie/session identifiers, error logs, performance logs, security logs, and event audit logs.",
      "Event organizers, clients, sponsors, speakers, or production teams may provide information so we can configure, operate, support, or report on an event."
    ]
  },
  {
    title: "2. How We Use Information",
    body: [
      "We use information to operate West Peek Live, register attendees, create and manage event-scoped attendee sessions, provide virtual venue access, support agendas, sessions, stages, expo areas, networking, help desks, replay areas, production workflows, operator tools, crew tools, sponsor/speaker/client portals, access verification, security, support, event communications, sponsor lead opt-ins, moderation, troubleshooting, analytics, operational reporting, and legal or contractual compliance.",
      "We do not use attendee registration alone to silently provide every sponsor with attendee profile information. Sponsor access to attendee information should occur only when the attendee intentionally engages, opts in, or otherwise authorizes that sharing through the event experience."
    ]
  },
  {
    title: "3. Cookies and Similar Technologies",
    body: [
      "We use cookies and similar technologies to keep users signed in or sessioned into an event, remember event-scoped attendee identity, manage operator, crew, speaker, sponsor, client, VIP, and other access sessions, secure role-gated pages, prevent unauthorized access, maintain event state, and support analytics and diagnostics.",
      "Some cookies are necessary for the platform to work. Disabling cookies may prevent access to registration, venue, production, or role-gated features."
    ]
  },
  {
    title: "4. How We Share Information",
    body: [
      "We may share event-related information with the event organizer, client, or production owner responsible for the event, including registration information, attendance data, help requests, engagement activity, and event analytics.",
      "We may share information with vendors that help us operate the platform, including hosting, database, authentication, email, analytics, video, livestreaming, support, and security providers.",
      "We do not automatically provide sponsors or exhibitors with all attendee information merely because someone attends an event. Sponsor lead information should be shared only when an attendee intentionally engages with a sponsor, opts in, requests follow-up, submits a sponsor form, scans into a sponsor experience, or otherwise authorizes the sharing.",
      "We may share limited information with speakers, crew, moderators, operators, and production staff when needed to run the event, provide support, moderate interactions, manage access, or resolve technical problems.",
      "We may disclose information if we believe it is necessary to comply with law, enforce our terms, protect users, protect event integrity, prevent fraud or abuse, investigate security issues, or respond to lawful requests."
    ]
  },
  {
    title: "5. Data Retention",
    body: [
      "We retain information for as long as needed to operate events, provide support, maintain security, satisfy contractual obligations, and comply with legal obligations.",
      "Event registration/profile records may be retained through the event and post-event reporting period. Attendance summaries and sponsor opt-in records may be retained for reporting, audit, and follow-up. Raw chat, presence, telemetry, access attempts, and short-lived session data may be retained for shorter periods. Aggregated or anonymized analytics may be retained longer.",
      "We may delete, anonymize, or aggregate information when it is no longer needed."
    ]
  },
  {
    title: "6. Security",
    body: [
      "We use administrative, technical, and organizational measures designed to protect information from unauthorized access, loss, misuse, alteration, or disclosure. These measures may include access controls, encrypted transport, role-based permissions, secure cookies, audit logs, provider security controls, and operational review.",
      "No method of transmission or storage is perfectly secure. We cannot guarantee absolute security, but we work to protect information in a manner appropriate to the nature of the platform and the information processed."
    ]
  },
  {
    title: "7. Your Choices and Requests",
    body: [
      "Depending on where you live and the nature of your relationship with an event, you may have rights to request access to, correction of, deletion of, or restriction of certain personal information. You may also have rights to object to certain processing or request information about how your data has been shared.",
      "To make a privacy request, email info@westpeek.ventures. We may need to verify your identity and the event relationship before responding.",
      "If your information was provided to us by an event organizer or client, we may direct your request to that organizer or coordinate with them to respond."
    ]
  },
  {
    title: "8. California Privacy Notice",
    body: [
      "California residents may have rights under California privacy laws, depending on whether the law applies to the relevant business relationship and data processing activity. These rights may include the right to know, access, correct, delete, opt out of certain sharing or sales, limit certain uses of sensitive personal information, and not be discriminated against for exercising privacy rights.",
      "We do not intend to sell attendee personal information. We also do not intend to share attendee profile information with sponsors except where the attendee intentionally engages, opts in, or requests follow-up."
    ]
  },
  {
    title: "9. International Users",
    body: [
      "West Peek Live is operated from the United States. If you access the platform from outside the United States, information may be processed in the United States or other locations where our service providers operate.",
      "Where required, we rely on appropriate legal bases for processing, such as providing the event services, fulfilling contracts, legitimate operational and security interests, consent where requested, and compliance with legal obligations."
    ]
  },
  {
    title: "10. Children",
    body: [
      "West Peek Live is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we collected personal information from a child under 13 without appropriate consent, we will take reasonable steps to delete it.",
      "Events intended for minors, schools, youth groups, or family audiences may require additional event-specific privacy terms and parental or guardian consent processes."
    ]
  },
  {
    title: "11. Third-Party Links and Services",
    body: [
      "Events may include links to third-party websites, sponsor pages, livestream providers, video tools, calendar tools, payment systems, social platforms, or other services. We are not responsible for the privacy practices of third-party services. Review their privacy policies before providing information to them."
    ]
  },
  {
    title: "12. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will update the effective date. Material changes may be communicated through the platform or other appropriate channels."
    ]
  },
  {
    title: "13. Contact",
    body: [
      "For privacy, support, or data request questions, email info@westpeek.ventures. Please include the event name, your role, and the email address used for registration. Do not include passwords, secret keys, private access codes, payment information, or other sensitive credentials in your message."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-ash text-brand-black">
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <BrandHomeLink size="md" />
        <article className="mt-8 rounded-[2rem] border border-brand-line bg-white p-6 shadow-brand sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-orange">Privacy Policy</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-sm font-bold text-brand-muted">Effective Date: May 21, 2026</p>
          <p className="mt-6 text-sm leading-7 text-brand-muted">
            West Peek Live is an event operating platform produced by West Peek Productions LLC (“West Peek Productions,” “we,” “us,” or “our”). This Privacy Policy explains how we collect, use, disclose, retain, and protect information when you use West Peek Live websites, event registration pages, virtual venue pages, production access pages, operator tools, crew tools, sponsor/speaker/client portals, and related support workflows.
          </p>
          <p className="mt-4 text-sm leading-7 text-brand-muted">
            This Privacy Policy applies to West Peek Live and related event experiences that link to this Privacy Policy. It does not replace any separate privacy notice provided by a specific event organizer, sponsor, client, or third-party service.
          </p>
          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-black tracking-tight">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-brand-muted">
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>
      <LegalFooter variant="standard" />
    </main>
  );
}
