// FILE: app/wiremanprep/terms/page.tsx
import Link from "next/link";

// WiremanPrep Terms of Service (v1) - adapted from the ForemanPrep
// terms (same legal entity, AskEvo LLC), speaking WiremanPrep: the
// NASCLA Master/Unlimited electrical exam, one-time $-at-checkout
// Full Access, NASCLA/PSI/NFPA non-affiliation, AI tutor
// disclaimer. DELIBERATELY ABSENT: a pass-guarantee section - the
// product does not claim one (his call pending); refunds are
// simply final except where law requires. If the guarantee is
// ever extended to this product, this file gains the ForemanPrep
// guarantee section and the refund section gets the carve-out.
// Public page - the wiremanprep layout wraps it, proxy v18
// rewrites wiremanprep.com/terms here.

const UPDATED = "September 3, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Agreement to These Terms",
    b: `These Terms of Service ("Terms") are a binding agreement between you and AskEvo LLC ("AskEvo", "we", "us"). WiremanPrep is a product of AskEvo LLC. By creating an account, making a purchase, or using WiremanPrep (including wiremanprep.com), you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the services.`,
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
    b: `WiremanPrep provides study tools for the NASCLA Accredited Trade Examination for Electrical Contractors (Master Electricians/Unlimited Electricians): practice questions, a timed exam simulator, an AI tutor, and related study materials. The services are educational tools only. Purchasing or completing WiremanPrep does not guarantee that you will pass any examination or obtain any license. Features may change, improve, or be discontinued over time.`,
  },
  {
    t: "5. Purchases and Full Access",
    b: `Full Access is a one-time purchase at the price displayed at checkout - it is not a subscription and never renews or rebills. Payment is processed by Stripe; your card statement will read ASKEVO* WIREMANPREP. Full Access unlocks the paid features described at purchase for as long as we operate the service, on the single account that made the purchase.`,
  },
  {
    t: "6. Refunds",
    b: `Except where required by applicable law, purchases are final and non-refundable. If you believe you were charged in error, contact support@askevo.ai and we will review it.`,
  },
  {
    t: "7. Not Affiliated - Verify Your Requirements",
    b: `WiremanPrep is an independent study tool. We are not affiliated with, endorsed by, or approved by NASCLA (the National Association of State Contractors Licensing Agencies), PSI, the NFPA, or any state licensing board. NASCLA is a registered trademark of its owner, and NEC and National Electrical Code are registered trademarks of the National Fire Protection Association; these marks are used here only to identify the examination and references our materials prepare you for.

Licensing requirements, exam eligibility, and which exams are accepted vary by state and can change. Some agencies accept the NASCLA electrical examination only by endorsement or with additional conditions. You are responsible for verifying the current requirements with your state licensing board before scheduling an exam.`,
  },
  {
    t: "8. AI Tutor and Content Disclaimer",
    b: `The AI tutor generates its answers automatically and can be inaccurate or incomplete. Our practice questions and explanations are written and checked with care, but they are study aids, not official exam content, and are not legal, electrical-engineering, or professional advice. Always verify against the official reference books, the edition of the National Electrical Code adopted in your jurisdiction, and your jurisdiction's current rules. Tutor usage is subject to fair-use daily limits so the service stays fast and affordable for everyone.`,
  },
  {
    t: "9. Acceptable Use",
    b: `You agree not to: share your account or resell access; copy, scrape, publish, or redistribute the question bank, explanations, or other course content; use the content to build a competing product; attempt to probe, overload, or circumvent our systems, rate limits, or purchase requirements; or use the services to violate any law. We may suspend or terminate accounts that violate this section.`,
  },
  {
    t: "10. Our Intellectual Property",
    b: `The WiremanPrep and AskEvo names, logos, sites, software, question bank, explanations, and other course content are owned by AskEvo LLC or its licensors. These Terms grant you a limited, personal, non-transferable license to use the content for your own exam preparation, and no other rights.`,
  },
  {
    t: "11. Termination",
    b: `You may stop using the services or request account deletion at any time via support@askevo.ai. We may suspend or terminate your account if you violate these Terms; in that case, no refund is owed. Sections that by their nature should survive termination, including ownership, disclaimers, and liability limits, survive.`,
  },
  {
    t: "12. Disclaimers",
    b: `The services are provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted, error-free, or secure, or that any content is free of errors.`,
  },
  {
    t: "13. Limitation of Liability",
    b: `To the maximum extent permitted by law, AskEvo will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, exam fees, licensing costs, or lost work opportunities. Our total liability for all claims relating to the services is limited to the amount you paid us for WiremanPrep.`,
  },
  {
    t: "14. Indemnification",
    b: `You agree to defend and hold AskEvo harmless from claims arising out of your use of the services or your violation of these Terms.`,
  },
  {
    t: "15. Governing Law",
    b: `These Terms are governed by the laws of the State of Idaho, USA, without regard to conflict-of-law rules. Disputes will be resolved in the state or federal courts located in Idaho, and you consent to their jurisdiction.`,
  },
  {
    t: "16. Changes to These Terms",
    b: `We may update these Terms from time to time. We will post the updated version with a new "Last updated" date, and material changes may be communicated on the site or by email. Continued use after changes take effect means you accept the updated Terms.`,
  },
  {
    t: "17. Contact",
    b: `Questions? Email support@askevo.ai. AskEvo LLC, Boise, Idaho, USA.`,
  },
];

export default function WiremanTermsPage() {
  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Wireman<span>Prep</span>
        </div>
        <Link className="fp-backpill" href="/wiremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Wireman<span>Prep</span>
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
        WiremanPrep is a product of AskEvo LLC, Boise, Idaho. Not affiliated
        with or endorsed by NASCLA, PSI, or the NFPA. support@askevo.ai
      </p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/wiremanprep/terms/page.tsx (v1 - no pass
// guarantee claimed; refunds final except as law requires)
// If you can see this comment, the paste was not truncated.
// ============================================================
