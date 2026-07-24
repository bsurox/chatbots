import "../spotmint.css";

// Spotmint Terms of Service - adapted from the AskEvo terms page.
// Spotmint is a product of AskEvo LLC, so the legal entity and the
// governing terms are the same; this page speaks Spotmint and covers
// the app + spotmint.store specifics (video ads, store purchases,
// shared credit balance). Public page - no auth guard. The shell
// layout wraps it, so the tab bar shows here like everywhere else.

const UPDATED = "July 23, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Agreement to These Terms",
    b: `These Terms of Service ("Terms") are a binding agreement between you and AskEvo LLC ("AskEvo", "we", "us"). Spotmint is a product of AskEvo LLC. By creating an account or using Spotmint (including the Spotmint app and spotmint.store), you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the services.`,
  },
  {
    t: "2. Eligibility",
    b: `You must be at least 13 years old to use the services. If you are under 18, you may use the services only with the permission of a parent or legal guardian who agrees to these Terms on your behalf.`,
  },
  {
    t: "3. Your Account",
    b: `You are responsible for your account credentials and for all activity under your account. Provide accurate information and keep it up to date. Notify us at support@askevo.ai if you suspect unauthorized use of your account.`,
  },
  {
    t: "4. The Services",
    b: `Spotmint provides AI-powered video ad generation. Features may change, improve, or be discontinued over time. Some features consume credits as described below.`,
  },
  {
    t: "5. Credits and Purchases",
    b: `Credits are a prepaid balance used to pay for generations at the rates displayed in the app. Credits are purchased at spotmint.store and are added to your account balance; the same balance may also be usable in other AskEvo LLC products. Credit costs for specific features may change from time to time; changes apply going forward and never to credits already spent.

Credits have no cash value, are not transferable, and are not redeemable for money except where required by law. Purchased credits do not expire while your account remains in good standing.

If a generation fails, the credits for that job are automatically returned to your balance.`,
  },
  {
    t: "6. Refunds",
    b: `Except where required by applicable law, credit purchases are final and non-refundable. If you believe you were charged in error, contact support@askevo.ai and we will review it. If we permanently discontinue the services, we will refund the value of unused purchased credits.`,
  },
  {
    t: "7. Acceptable Use",
    b: `You agree not to use the services to: violate any law; create or share content that sexualizes or exploits minors in any way; infringe intellectual property or privacy rights; generate malware or content intended to harm systems; harass, threaten, or defame others; produce deceptive content presented as authentic, such as impersonating a real person without consent; or attempt to probe, overload, or circumvent our systems, rate limits, or credit accounting.

Your use must also comply with the acceptable-use policies of the third-party AI providers that power the services. We may remove content and suspend or terminate accounts that violate this section.`,
  },
  {
    t: "8. Your Content and AI Outputs",
    b: `You retain your rights to the content you submit, such as prompts and files. You grant us a limited license to host and process that content solely to operate and provide the services.

As between you and AskEvo, you own the outputs generated for you, to the extent permitted by applicable law and subject to the terms of the underlying AI providers. AI outputs may be similar to outputs generated for other users and may not be protectable by copyright. You are responsible for how you use outputs, including compliance with law, advertising regulations, and third-party rights.`,
  },
  {
    t: "9. AI Disclaimer",
    b: `AI-generated content can be inaccurate, incomplete, or offensive. Outputs are not professional advice. Review every generated ad before publishing it, and do not rely on the services for medical, legal, financial, or other professional decisions without independent verification.`,
  },
  {
    t: "10. Our Intellectual Property",
    b: `The Spotmint and AskEvo names, logos, sites, and software are owned by AskEvo LLC or its licensors. These Terms do not grant you any rights to our brands or software except as needed to use the services.`,
  },
  {
    t: "11. Termination",
    b: `You may stop using the services or request account deletion at any time via support@askevo.ai. We may suspend or terminate your account if you violate these Terms; in that case, remaining credits are forfeited. Sections that by their nature should survive termination, including ownership, disclaimers, and liability limits, survive.`,
  },
  {
    t: "12. Disclaimers",
    b: `The services are provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the services will be uninterrupted, error-free, or secure.`,
  },
  {
    t: "13. Limitation of Liability",
    b: `To the maximum extent permitted by law, AskEvo will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, data, or goodwill. Our total liability for all claims relating to the services is limited to the greater of $50 or the amount you paid us in the 12 months before the claim.`,
  },
  {
    t: "14. Indemnification",
    b: `You agree to defend and hold AskEvo harmless from claims arising out of your content, your use of the services, or your violation of these Terms.`,
  },
  {
    t: "15. Governing Law",
    b: `These Terms are governed by the laws of the State of Idaho, USA, without regard to conflict-of-law rules. Disputes will be resolved in the state or federal courts located in Idaho, and you consent to their jurisdiction.`,
  },
  {
    t: "16. Changes to These Terms",
    b: `We may update these Terms from time to time. We will post the updated version with a new "Last updated" date, and material changes may be communicated in the app or by email. Continued use after changes take effect means you accept the updated Terms.`,
  },
  {
    t: "17. Contact",
    b: `Questions? Email support@askevo.ai. AskEvo LLC, Idaho, USA.`,
  },
];

export default function SpotmintTermsPage() {
  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">Terms of Service - Last updated: {UPDATED}</p>
      {SECTIONS.map((s) => (
        <div key={s.t} style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#fff" }}>{s.t}</h2>
          <p style={{ whiteSpace: "pre-wrap", color: "#c7c7c7", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{s.b}</p>
        </div>
      ))}
      <p className="sp-note">Powered by AskEvo LLC - support@askevo.ai</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/terms/page.tsx (v1 - spotmint terms)
// If you can see this comment, the paste was not truncated.
// ============================================================
