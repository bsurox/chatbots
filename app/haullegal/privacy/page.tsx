// FILE: app/haullegal/privacy/page.tsx
import Link from "next/link";

// HaulLegal Privacy Policy (v4 - the AI help chat and step tutor
// are live: section 4 now says so in the present tense, and lists
// what is sent to the AI provider (the question, the step content,
// and the visitor's own recent messages in that chat), plus the
// daily-limit counting by IP address.)
// v3 notes - TEXT-MESSAGE REMINDERS: section 2
// lists the mobile number and the consent record, section 4 names
// Twilio as the messaging provider, and the new section 8 is the
// carrier-required disclosure: opt-in on the web form only,
// message frequency, rates, STOP / HELP, and the promise that
// numbers and consent are never sold or shared with third parties
// for their marketing. Cookies moves to 9 and the rest renumber.
// The campaign registered with the carriers points at this page.)
// v2 notes - the language choice (English or Spanish) is stored on
// your device, disclosed under Information We Collect; the
// walkthrough progress and calendar profile also save to the
// account when you are signed in.
// v1 notes - adapted from the WiremanPrep
// privacy pattern (same legal entity, AskEvo LLC). HaulLegal
// specifics: the walkthrough and calendar store BUSINESS details
// you type in (USDOT number, company name, dates, states you run),
// reminder emails are a core feature, and the subscription status
// is recorded from Stripe. No ad pixels yet - haullegal.com carries
// NO Google Ads tag or Meta pixel today, so the cookies section
// honestly says essential cookies only; the disclosure and the
// pixels ship the same day, never apart.
// Public page - the haullegal layout wraps it; the proxy host block
// rewrites haullegal.com/privacy here.

const UPDATED = "September 14, 2026";

const SECTIONS: Array<{ t: string; b: string }> = [
  {
    t: "1. Who We Are",
    b: `HaulLegal is a product of AskEvo LLC ("AskEvo", "we", "us"), a company based in Boise, Idaho, USA. We operate haullegal.com. This policy explains what information we collect, how we use it, and the choices you have.`,
  },
  {
    t: "2. Information We Collect",
    b: `Account information: your email address and a password (stored in hashed form - we cannot see your password).

Walkthrough and calendar details: the business information you choose to enter so the service can work - for example your company name, USDOT number, the dates of your filings, inspections and medical certificate, the states you operate in, and which steps you have marked complete. Enter only information about a business you are authorized to represent.

Reminder settings: the email address reminders go to and whether email reminders are turned on. If you turn on text-message reminders, we also store the mobile number you enter, the fact that you checked the consent box, and the date and time you did so.

Preferences stored on your device: your language choice (English or Spanish) and, until you sign in, your walkthrough progress and calendar entries are kept in your browser's storage on the device you used. Clearing the browser's site data removes them.

Payment information: payments are processed by Stripe. We receive transaction confirmations and record that your account purchased the walkthrough and whether your Stay Legal subscription is active. We never receive or store your full card number.

Support submissions: your name, email address, and message when you contact support.

Usage data: basic technical information such as IP address, browser type, and timestamps, collected for security, reliability, and fair-use limits on free features.`,
  },
  {
    t: "3. How We Use Information",
    b: `We use your information to: provide and operate the services; save your walkthrough progress and build your deadline calendar; send the reminder messages you ask for; process purchases and manage your subscription; respond to support requests; send service communications (such as receipts and important changes); protect against fraud, abuse, and security issues; and improve the services. We do not use your business details for anything except running your account.`,
  },
  {
    t: "4. Service Providers and AI Processing",
    b: `We use Stripe (payment processing and subscription billing), Resend (transactional and reminder email), Twilio (text-message delivery, only if you turn on text reminders), and cloud hosting and database providers such as Vercel to run the service. The help chat and the step tutor are AI features: what you type to them, the recent messages in that chat, and (for the tutor) the text of the step you are asking about are sent to Anthropic, the AI provider, acting on our behalf, and are not used to train the AI model under our provider agreement. Chats are not tied to your name unless you include it; daily message limits are counted by IP address (and, for walkthrough owners, by account). If you use the support form inside the chat, your name, email, message and the tail of that chat go to support@askevo.ai.

Your HaulLegal account is an AskEvo LLC account; if you use other AskEvo products, those products' providers apply as described in their policies.

We do not sell your personal information, and we do not show third-party advertising inside our products. When you follow a partner link to another company, that company's privacy policy applies to what you do there.`,
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
    t: "7. Email Reminders",
    b: `Reminder emails are part of the Stay Legal service and go only to the address on your account. You can turn individual reminders off in your calendar settings, and canceling the subscription stops reminder emails. Service emails about your account or purchases (receipts, security notices, material changes) are sent as needed regardless of reminder settings.`,
  },
  {
    t: "8. Text-Message (SMS) Reminders",
    b: `Text reminders are optional and off by default. You turn them on yourself, on the Stay Legal calendar page at haullegal.com/calendar, by entering a US mobile number and checking a box that reads: "Text me my deadline reminders. Message and data rates may apply. Message frequency varies. Reply STOP to cancel, HELP for help." The box is never pre-checked, and we do not enroll numbers any other way - not by phone, paper, or purchased lists.

What we send: reminders that a deadline you entered on your calendar is coming up (30, 7 and 1 days ahead), and replies to STOP, START and HELP. We do not send marketing texts. Message frequency varies with the deadlines on your calendar - typically a few messages per month. Message and data rates may apply according to your mobile plan. Carriers are not liable for delayed or undelivered messages.

How to stop: reply STOP to any message, uncheck the box on your calendar page, or email support@askevo.ai. Reply HELP to any message, or email support@askevo.ai, for help. Replying START to our number turns reminders back on for a number that previously consented.

Your mobile number and your consent record are used only to send the reminders you asked for and to keep the record carriers require. We do not sell them, and we do not share them with third parties or affiliates for their marketing. Twilio processes messages on our behalf under its own privacy terms.`,
  },
  {
    t: "9. Cookies",
    b: `We use essential cookies to keep you signed in and to operate the service. We do not currently use advertising or analytics pixels on haullegal.com. If that changes, we will update this policy with a clear description of the tools involved before or at the time they are introduced.`,
  },
  {
    t: "10. Children",
    b: `Our services are not directed to children under 18 and are intended for people operating a business. Do not use the services if you are under 18.`,
  },
  {
    t: "11. Security",
    b: `We use reasonable technical and organizational measures to protect your information, including encryption in transit and hashed password storage. No method of transmission or storage is 100% secure, so we cannot guarantee absolute security.`,
  },
  {
    t: "12. Changes to This Policy",
    b: `We may update this policy from time to time. When we do, we will post the updated version on this page with a new "Last updated" date. Your continued use of the services after an update means you accept the revised policy.`,
  },
  {
    t: "13. Contact",
    b: `Questions about this policy or your data? Email support@askevo.ai. AskEvo LLC, Boise, Idaho, USA.`,
  },
];

export default function HaulLegalPrivacyPage() {
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
      <p className="fp-badge">Privacy Policy - Last updated: {UPDATED}</p>
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
// END OF FILE - app/haullegal/privacy/page.tsx (v4 - AI chat +
// tutor disclosure; SMS reminder
// disclosure (opt-in, STOP / HELP, rates, no sharing); language
// preference + on-device storage; business details, reminder
// emails; essential cookies only)
// If you can see this comment, the paste was not truncated.
// ============================================================
