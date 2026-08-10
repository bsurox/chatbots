// FILE: app/foremanprep/privacy/page.tsx
import Link from "next/link";

// ForemanPrep Privacy Policy - adapted from the Spotmint/AskEvo
// privacy pattern (same legal entity, AskEvo LLC). ForemanPrep
// specifics: study records (practice + exam attempts, kept partly
// to verify pass guarantee claims), tutor messages processed by
// Anthropic, one-time Stripe purchase, reminder-list emails.
// Public page - the foremanprep layout wraps it.

const UPDATED = "August 10, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Who We Are",
    b: `ForemanPrep is a product of AskEvo LLC ("AskEvo", "we", "us"), a company based in Boise, Idaho, USA. We operate foremanprep.com. This policy explains what information we collect, how we use it, and the choices you have.`,
  },
  {
    t: "2. Information We Collect",
    b: `Account information: your email address and a password (stored in hashed form - we cannot see your password).

Study records: your practice rounds, exam simulator attempts, answers, and scores. We keep these to power your study experience and to verify pass guarantee claims.

Tutor messages: the questions you type to the AI tutor and the replies it gives.

Payment information: payments are processed by Stripe. We receive transaction confirmations and record that your account purchased Full Access. We never receive or store your full card number.

Reminder list: if you give us your email on the landing page, we store it to send you the reminder you asked for.

Support submissions: your name, email address, and message when you contact support.

Usage data: basic technical information such as IP address, browser type, and timestamps, collected for security, reliability, and fair-use limits on free features.`,
  },
  {
    t: "3. How We Use Information",
    b: `We use your information to: provide and operate the services; save your study progress and scores; answer your tutor questions; process purchases and unlock Full Access; verify pass guarantee claims; respond to support requests; send service communications and reminders you asked for; protect against fraud, abuse, and security issues; and improve the services.`,
  },
  {
    t: "4. AI Processing and Service Providers",
    b: `When you use the AI tutor, your messages and the practice question you are viewing are processed by Anthropic, the AI provider that powers the tutor, acting on our behalf. Tutor conversations are not used to train the AI model under our provider agreement.

We also use Stripe (payment processing), Resend (transactional email), and cloud hosting and database providers such as Vercel to run the service. Your ForemanPrep account is an AskEvo LLC account; if you use other AskEvo products, those products' providers apply as described in their policies.

We do not sell your personal information, and we do not show advertising in our products.`,
  },
  {
    t: "5. Data Retention and Deletion",
    b: `We keep your information while your account is active. To request deletion of your entire account and associated data, email support@askevo.ai. Certain records, such as transaction history, may be retained where required for legal, tax, or accounting purposes.`,
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
    b: `Questions about this policy or your data? Email support@askevo.ai. AskEvo LLC, Boise, Idaho, USA.`,
  },
];

export default function ForemanPrivacyPage() {
  return (
    <div className="fp-wrap">
      <div className="fp-top">
        <div className="fp-brand">
          Foreman<span>Prep</span>
        </div>
        <Link className="fp-link" href="/foremanprep">
          Back to{" "}
          <span className="fp-wordmark">
            Foreman<span>Prep</span>
          </span>
        </Link>
      </div>
      <p className="fp-badge">Privacy Policy - Last updated: {UPDATED}</p>
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
// END OF FILE - app/foremanprep/privacy/page.tsx (v2 - wordmark
// back link)
// If you can see this comment, the paste was not truncated.
// ============================================================
