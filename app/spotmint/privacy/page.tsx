import "../spotmint.css";

// Spotmint Privacy Policy - adapted from the AskEvo privacy page.
// Same legal entity (AskEvo LLC), Spotmint-specific framing: video
// ad generation via fal.ai, purchases at spotmint.store via Stripe.
// Public page - no auth guard; the shell layout wraps it. This URL
// also serves as the privacy policy link for the app store listings.

const UPDATED = "July 23, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Who We Are",
    b: `Spotmint is a product of AskEvo LLC ("AskEvo", "we", "us"), a company based in Idaho, USA. We operate the Spotmint app and spotmint.store. This policy explains what information we collect, how we use it, and the choices you have.`,
  },
  {
    t: "2. Information We Collect",
    b: `Account information: your email address and a password (stored in hashed form - we cannot see your password).

Content you provide: the ad prompts you write and the video ads our tools generate for you.

Payment information: payments are processed by Stripe. We receive transaction confirmations and maintain your credit balance. We never receive or store your full card number.

Support submissions: your name, email address, and message when you contact support.

Usage data: basic technical information such as IP address, browser type, and timestamps, collected by our hosting infrastructure for security and reliability.`,
  },
  {
    t: "3. How We Use Information",
    b: `We use your information to: provide and operate the services; generate the video ads you request; process purchases and maintain your credit balance; respond to support requests; send service communications; protect against fraud, abuse, and security issues; and improve the services.`,
  },
  {
    t: "4. AI Processing and Service Providers",
    b: `To fulfill your requests, your prompts are processed by third-party AI providers acting on our behalf, including fal.ai (video generation). Your Spotmint account is an AskEvo LLC account, and if you use other AskEvo products, those products' providers apply as described in the AskEvo privacy policy.

We also use Stripe (payment processing), Resend (transactional email), and cloud hosting and database providers such as Vercel to run the service.

We do not sell your personal information, and we do not show advertising in our products.`,
  },
  {
    t: "5. Data Retention and Deletion",
    b: `We keep your information while your account is active. Generated videos are stored temporarily by our video provider and age off automatically. To request deletion of your entire account and associated data, email support@askevo.ai. Certain records, such as transaction history, may be retained where required for legal, tax, or accounting purposes.`,
  },
  {
    t: "6. Your Rights",
    b: `You may request access to, correction of, or deletion of your personal information by emailing support@askevo.ai. Depending on where you live (for example, California or the EEA/UK), you may have additional rights under local law. We honor valid requests and typically acknowledge them within 1-3 business days.`,
  },
  {
    t: "7. Cookies",
    b: `We use essential cookies to keep you signed in and to operate the service. We do not use advertising cookies.`,
  },
  {
    t: "8. Children",
    b: `Our services are not directed to children under 13, and you may not use them if you are under 13. If you are under 18, you may use the services only with the permission of a parent or legal guardian.`,
  },
  {
    t: "9. Security",
    b: `We use reasonable technical and organizational measures to protect your information, including encryption in transit and hashed password storage. No method of transmission or storage is 100% secure, so we cannot guarantee absolute security.`,
  },
  {
    t: "10. Changes to This Policy",
    b: `We may update this policy from time to time. When we do, we will post the updated version on this page with a new "Last updated" date. Your continued use of the services after an update means you accept the revised policy.`,
  },
  {
    t: "11. Contact",
    b: `Questions about this policy or your data? Email support@askevo.ai. AskEvo LLC, Idaho, USA.`,
  },
];

export default function SpotmintPrivacyPage() {
  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">Privacy Policy - Last updated: {UPDATED}</p>
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
// END OF FILE - app/spotmint/privacy/page.tsx (v1 - spotmint privacy)
// If you can see this comment, the paste was not truncated.
// ============================================================
