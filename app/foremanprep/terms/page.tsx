// FILE: app/foremanprep/terms/page.tsx
import Link from "next/link";

// ForemanPrep Terms of Service - adapted from the Spotmint/AskEvo
// terms pattern (same legal entity, AskEvo LLC). Speaks ForemanPrep:
// one-time Full Access purchase, the dialed-in pass guarantee
// (completion verified in our records + official PSI score report),
// NASCLA/PSI non-affiliation, AI tutor disclaimer. Public page - the
// foremanprep layout wraps it, proxy island allows /foremanprep*.

const UPDATED = "August 10, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Agreement to These Terms",
    b: `These Terms of Service ("Terms") are a binding agreement between you and AskEvo LLC ("AskEvo", "we", "us"). ForemanPrep is a product of AskEvo LLC. By creating an account, making a purchase, or using ForemanPrep (including foremanprep.com), you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the services.`,
  },
  {
    t: "2. Eligibility",
    b: `You must be at least 13 years old to use the services. If you are under 18, you may use the services only with the permission of a parent or legal guardian who agrees to these Terms on your behalf.`,
  },
  {
    t: "3. Your Account",
    b: `You are responsible for your account credentials and for all activity under your account. Your account and your Full Access purchase are personal to you and may not be shared, transferred, or resold. Provide accurate information and keep it up to date. Notify us at support@askevo.ai if you suspect unauthorized use of your account.`,
  },
  {
    t: "4. The Service",
    b: `ForemanPrep provides study tools for the NASCLA Commercial General Building Contractor examination: practice questions, a timed exam simulator, an AI tutor, and related study materials. The services are educational tools only. Purchasing or completing ForemanPrep does not guarantee that you will pass any examination or obtain any license. Features may change, improve, or be discontinued over time.`,
  },
  {
    t: "5. Purchases and Full Access",
    b: `Full Access is a one-time purchase at the price displayed at checkout - it is not a subscription and never renews or rebills. Payment is processed by Stripe; your card statement will read ASKEVO* FOREMANPREP. Full Access unlocks the paid features described at purchase for as long as we operate the service, on the single account that made the purchase.`,
  },
  {
    t: "6. Pass Guarantee",
    b: `We stand behind the course: if you complete ForemanPrep and still fail the exam, we will refund your full purchase price. A pass guarantee claim must meet ALL of the following conditions:

(a) You completed the course before your exam date: you answered every question in the ForemanPrep question bank at least once and completed the full-length exam simulator at least twice, all prior to the exam. We verify this against our own study records for your account.

(b) The claim is for your FIRST attempt at the NASCLA Commercial General Building Contractor examination taken after your purchase.

(c) You submit your claim within 30 days of your exam date by emailing support@askevo.ai from your account email.

(d) Your claim includes your official PSI score report showing the failing result.

One claim per person and per account. Qualifying refunds are issued in full to the original payment method, and Full Access may be revoked once the refund is issued. Claims that do not meet these conditions are not eligible.`,
  },
  {
    t: "7. Other Refunds",
    b: `Except for qualifying pass guarantee claims and where required by applicable law, purchases are final and non-refundable. If you believe you were charged in error, contact support@askevo.ai and we will review it.`,
  },
  {
    t: "8. Not Affiliated - Verify Your Requirements",
    b: `ForemanPrep is an independent study tool. We are not affiliated with, endorsed by, or approved by NASCLA (the National Association of State Contractors Licensing Agencies), PSI, or any state licensing board. NASCLA is a registered trademark of its owner and is used here only to identify the examination our materials prepare you for.

Licensing requirements, exam eligibility, and which exams are accepted vary by state and can change. You are responsible for verifying the current requirements with your state licensing board before scheduling an exam.`,
  },
  {
    t: "9. AI Tutor and Content Disclaimer",
    b: `The AI tutor generates its answers automatically and can be inaccurate or incomplete. Our practice questions and explanations are written and checked with care, but they are study aids, not official exam content, and are not legal, financial, or professional advice. Always verify against the official reference books and your jurisdiction's current rules. Tutor usage is subject to fair-use daily limits so the service stays fast and affordable for everyone.`,
  },
  {
    t: "10. Acceptable Use",
    b: `You agree not to: share your account or resell access; copy, scrape, publish, or redistribute the question bank, explanations, or other course content; use the content to build a competing product; attempt to probe, overload, or circumvent our systems, rate limits, or purchase requirements; or use the services to violate any law. We may suspend or terminate accounts that violate this section.`,
  },
  {
    t: "11. Our Intellectual Property",
    b: `The ForemanPrep and AskEvo names, logos, sites, software, question bank, explanations, and other course content are owned by AskEvo LLC or its licensors. These Terms grant you a limited, personal, non-transferable license to use the content for your own exam preparation, and no other rights.`,
  },
  {
    t: "12. Termination",
    b: `You may stop using the services or request account deletion at any time via support@askevo.ai. We may suspend or terminate your account if you violate these Terms; in that case, no refund is owed. Sections that by their nature should survive termination, including ownership, disclaimers, and liability limits, survive.`,
  },
  {
    t: "13. Disclaimers",
    b: `The services are provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted, error-free, or secure, or that any content is free of errors.`,
  },
  {
    t: "14. Limitation of Liability",
    b: `To the maximum extent permitted by law, AskEvo will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, exam fees, licensing costs, or lost work opportunities. Our total liability for all claims relating to the services is limited to the amount you paid us for ForemanPrep.`,
  },
  {
    t: "15. Indemnification",
    b: `You agree to defend and hold AskEvo harmless from claims arising out of your use of the services or your violation of these Terms.`,
  },
  {
    t: "16. Governing Law",
    b: `These Terms are governed by the laws of the State of Idaho, USA, without regard to conflict-of-law rules. Disputes will be resolved in the state or federal courts located in Idaho, and you consent to their jurisdiction.`,
  },
  {
    t: "17. Changes to These Terms",
    b: `We may update these Terms from time to time. We will post the updated version with a new "Last updated" date, and material changes may be communicated on the site or by email. Continued use after changes take effect means you accept the updated Terms.`,
  },
  {
    t: "18. Contact",
    b: `Questions? Email support@askevo.ai. AskEvo LLC, Boise, Idaho, USA.`,
  },
];

export default function ForemanTermsPage() {
  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Foreman<span>Prep</span>
        </div>
        <Link className="fp-backpill" href="/foremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Foreman<span>Prep</span>
          </span>
        </Link>
      </div>
      <p className="fp-badge">Terms of Service - Last updated: {UPDATED}</p>
      {SECTIONS.map((s) => (
        <div key={s.t} style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{s.t}</h2>
          <p style={{ whiteSpace: "pre-wrap", color: "#c7c7c7", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.b}</p>
        </div>
      ))}
      <p className="fp-legal">
        ForemanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
        with or endorsed by NASCLA or PSI. support@askevo.ai
      </p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/terms/page.tsx (v3 - back pill)
// If you can see this comment, the paste was not truncated.
// ============================================================
