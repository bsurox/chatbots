// FILE: app/haullegal/terms/page.tsx
import Link from "next/link";

// HaulLegal Terms of Service (v2 - TEXT-MESSAGE REMINDERS: section
// 7 gains the SMS program terms the carriers require - opt-in by
// the calendar consent box only, message frequency, rates, STOP /
// HELP, carrier non-liability - and section 3 asks that the mobile
// number you enter be your own. The campaign registered with the
// carriers points at this page.)
// v1 notes - adapted from the WiremanPrep terms (same legal
// entity, AskEvo LLC) for a very different product: a self-filing walkthrough plus a subscription deadline
// calendar. The load-bearing sections are 4 (we are not the
// government, not lawyers, and we never file on your behalf), 5
// (one-time purchase plus a monthly subscription that auto-renews
// until canceled), 7 (you verify current requirements; reminders
// are a convenience, not a guarantee) and 8 (partner links and
// referral compensation). Public page - the haullegal layout wraps
// it; the proxy host block rewrites haullegal.com/terms here.

const UPDATED = "September 13, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Agreement to These Terms",
    b: `These Terms of Service ("Terms") are a binding agreement between you and AskEvo LLC ("AskEvo", "we", "us"). HaulLegal is a product of AskEvo LLC. By creating an account, making a purchase, or using HaulLegal (including haullegal.com), you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the services.`,
  },
  {
    t: "2. Eligibility",
    b: `You must be at least 18 years old and able to form a binding contract to purchase HaulLegal. The services are intended for people starting or operating a motor carrier business in the United States.`,
  },
  {
    t: "3. Your Account",
    b: `You are responsible for your account credentials and for all activity under your account. Your account and your purchases are personal to you (or to the single business you enter) and may not be shared, transferred, or resold. Provide accurate information and keep it up to date. If you enter a mobile number for text reminders, it must be a number you own or are authorized to use. Notify us at support@askevo.ai if you suspect unauthorized use of your account.`,
  },
  {
    t: "4. What HaulLegal Is - and Is Not",
    b: `HaulLegal provides informational and organizational tools: a step-by-step walkthrough of the registrations a new motor carrier completes, the published government fees for each, a deadline calendar built from the information you enter, and reminder messages.

HaulLegal is NOT a government agency and is not affiliated with, endorsed by, or approved by the U.S. Department of Transportation, the Federal Motor Carrier Safety Administration (FMCSA), the Internal Revenue Service, or any state agency. Their names appear here only to identify the registrations our materials explain.

HaulLegal is NOT a law firm, accounting firm, or insurance agency, and nothing on the service is legal, tax, or insurance advice. We do not act as your agent, process agent, consortium or third-party administrator, insurer, or Transportation Service Provider. We do not file, submit, sign, or pay for anything on your behalf, and we never access your government accounts. You complete every filing yourself, using your own accounts, and you are responsible for what you submit.`,
  },
  {
    t: "5. Purchases, Subscriptions, and Billing",
    b: `The launch walkthrough is a one-time purchase at the price displayed at checkout. It does not renew.

Stay Legal is a monthly subscription at the price displayed at checkout. It renews automatically each month until you cancel. When a free first month is offered with a walkthrough purchase, billing begins when that free period ends unless you cancel before then. You can cancel at any time from your account page or by emailing support@askevo.ai; cancellation stops future charges and your access continues through the end of the period already paid.

Payments are processed by Stripe; your card statement will read ASKEVO* HAULLEGAL. Prices may change for future purchases or renewal periods with notice on the site or by email; a price change never applies to a period you have already paid for.`,
  },
  {
    t: "6. Refunds",
    b: `Except where required by applicable law, the one-time walkthrough purchase is final and non-refundable once access is granted. Subscription charges are not refunded for partial months; cancel before the renewal date to avoid the next charge. If you believe you were charged in error, contact support@askevo.ai and we will review it.`,
  },
  {
    t: "7. Verify Your Requirements - Reminders Are a Convenience",
    b: `Registration rules, fees, forms, and deadlines change, and they vary by state, by vehicle weight, by what you haul, and by where you operate. We check our content against government sources and show the date it was last verified, but we cannot promise it is complete, current, or correct for your situation. You are responsible for confirming current requirements with FMCSA, the IRS, your state agencies, and your own advisors before you act.

The deadline calendar computes dates from the information you enter and the rules as we understand them. Reminders are sent as a convenience and may be delayed, blocked, or missed for reasons outside our control (email filtering, carrier issues, outages). A missed or wrong reminder does not transfer any filing responsibility, penalty, fine, or out-of-service consequence to us. Keep your own record of your deadlines.

Text-message reminders (SMS program terms): text reminders are optional. You turn them on by entering a US mobile number on the Stay Legal calendar page and checking the consent box; we never enroll a number any other way. We send deadline reminders 30, 7 and 1 days before dates on your calendar, plus replies to STOP, START and HELP - no marketing texts. Message frequency varies with your calendar. Message and data rates may apply. Reply STOP to any message to cancel, HELP for help, or email support@askevo.ai. Mobile carriers are not liable for delayed or undelivered messages. Our Privacy Policy explains how the number and your consent are stored.`,
  },
  {
    t: "8. Third-Party Services and Partner Links",
    b: `Process agents, drug and alcohol consortiums, insurers, formation services, ELD vendors, factoring companies, load boards, and other providers linked from the service are independent businesses. Their terms and prices govern your dealings with them, and we are not responsible for their products, filings, or conduct. Some links are partner links: if you purchase through them we may receive referral compensation at no extra cost to you. We show the published price of each provider where we can, and we do not accept compensation to hide a cheaper official route.`,
  },
  {
    t: "9. AI Features and Content Disclaimer",
    b: `Any AI-generated answers on the service are produced automatically and can be inaccurate or incomplete. Our step content and deadline rules are written and checked with care, but they are organizational aids, not official government instructions or professional advice. Always verify against the official agency page or regulation cited with each step. AI features are subject to fair-use daily limits so the service stays fast and affordable for everyone.`,
  },
  {
    t: "10. Acceptable Use",
    b: `You agree not to: share your account or resell access; copy, scrape, publish, or redistribute the walkthrough, deadline rules, or other content; use the content to build a competing product; attempt to probe, overload, or circumvent our systems, rate limits, or purchase requirements; enter information about a business you are not authorized to represent; or use the services to violate any law. We may suspend or terminate accounts that violate this section.`,
  },
  {
    t: "11. Our Intellectual Property",
    b: `The HaulLegal and AskEvo names, logos, sites, software, walkthrough content, deadline rules, and other content are owned by AskEvo LLC or its licensors. These Terms grant you a limited, personal, non-transferable license to use the content for your own motor carrier business, and no other rights. Government forms, regulations, and agency pages linked from the service belong to their agencies.`,
  },
  {
    t: "12. Termination",
    b: `You may stop using the services or request account deletion at any time via support@askevo.ai. We may suspend or terminate your account if you violate these Terms; in that case, no refund is owed. Sections that by their nature should survive termination, including ownership, disclaimers, and liability limits, survive.`,
  },
  {
    t: "13. Disclaimers",
    b: `The services are provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted, error-free, or secure, that any content is free of errors, or that using the services will result in any registration being granted, any audit being passed, or any penalty being avoided.`,
  },
  {
    t: "14. Limitation of Liability",
    b: `To the maximum extent permitted by law, AskEvo will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, lost loads, revoked or delayed registrations, government fees, fines, penalties, interest, out-of-service orders, insurance costs, or lost work opportunities. Our total liability for all claims relating to the services is limited to the amount you paid us for HaulLegal in the twelve months before the claim.`,
  },
  {
    t: "15. Indemnification",
    b: `You agree to defend and hold AskEvo harmless from claims arising out of your use of the services, the information you submit to any agency or provider, or your violation of these Terms.`,
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

export default function HaulLegalTermsPage() {
  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Haul<span>Legal</span>
        </div>
        <Link className="fp-backpill" href="/haullegal">
          Back to{" "}
          <span className="fp-wordmark">
            Haul<span>Legal</span>
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
        HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government
        agency; not affiliated with the U.S. DOT, FMCSA, the IRS, or any
        state agency. Not a law firm. support@askevo.ai
      </p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/terms/page.tsx (v2 - SMS program
// terms; self-filing doctrine, one-time + monthly subscription,
// partner links)
// If you can see this comment, the paste was not truncated.
// ============================================================
