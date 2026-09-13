// FILE: app/haullegal/sms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

// HaulLegal text-message program page (v1) - the PUBLIC record of
// how text reminders work, built for the carrier reviewers who
// vet the 10DLC campaign: they must be able to see the opt-in form
// and the consent wording without an account, and the real form
// on the calendar page only shows to a signed-in subscriber. This
// page shows the program terms and a faithful, non-working copy of
// that form with the exact consent wording (the same string the
// calendar renders from i18n.ts calendar.smsConsent - keep the two
// identical), plus the sample messages, STOP / HELP behavior,
// frequency and rates. English only on purpose: it is a compliance
// document, and the reviewers read English. Reached at
// haullegal.com/haullegal/sms (no proxy change needed - every
// /haullegal path already passes). Linked from the privacy policy.
// Server component; the form controls are disabled and decorative.

export const metadata: Metadata = {
  title: "HaulLegal text reminders - program terms and opt-in",
  description:
    "How HaulLegal text-message deadline reminders work: who sends them, who gets them, how you opt in on the Stay Legal calendar, message frequency, rates, and how to stop.",
  robots: { index: false, follow: true },
};

const CONSENT =
  "By checking this box I agree to receive deadline reminder text messages from HaulLegal at the mobile number above. Message frequency varies (about 2-6 messages a month). Message and data rates may apply. Reply STOP to cancel or HELP for help. Consent is not a condition of purchase.";

const SAMPLES = [
  "HaulLegal: your IFTA quarterly return is due in 7 days (Oct 31). Reply STOP to opt out, HELP for help.",
  "HaulLegal: your UCR registration renewal is due tomorrow (Dec 31). Reply STOP to opt out, HELP for help.",
  "HaulLegal: text reminders are on. Msg & data rates may apply, frequency varies. Reply STOP to cancel, HELP for help.",
];

const h2: React.CSSProperties = { fontSize: 17, fontWeight: 700, margin: "26px 0 8px", color: "#fff" };
const p: React.CSSProperties = { color: "#c7c7c7", fontSize: 14, lineHeight: 1.7, margin: 0 };

export default function HaulLegalSmsPage() {
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
      <p className="fp-badge">Text-message reminders - program terms</p>
      <h1 className="fp-h1" style={{ fontSize: "28px" }}>
        HaulLegal <span>text reminders</span>
      </h1>
      <p className="fp-sub">
        HaulLegal is a product of AskEvo LLC, Boise, Idaho. This page explains the text-message program: who sends the messages,
        who receives them, how you opt in, and how to stop.
      </p>

      <h2 style={h2}>Who sends and who receives</h2>
      <p style={p}>
        Messages are sent by HaulLegal (AskEvo LLC) to trucking owner-operators who subscribe to the Stay Legal deadline
        calendar at haullegal.com and choose to turn on text reminders. Nobody else receives messages, and we never text a
        number that has not opted in on the form below.
      </p>

      <h2 style={h2}>What the messages are</h2>
      <p style={p}>
        Reminders that a compliance deadline the subscriber entered on their calendar - for example a quarterly IFTA fuel-tax
        return, the annual UCR registration, the MCS-150 biennial update, or a medical-card expiration - is coming up in 30, 7 or
        1 days. Plus short confirmations when you turn reminders on, and replies to STOP and HELP. No marketing messages, no
        promotions, no links.
      </p>

      <h2 style={h2}>How you opt in</h2>
      <p style={p}>
        Only on the web form on the Stay Legal calendar page at haullegal.com/calendar, while signed in. You type your mobile
        number and check a box that is never pre-checked. Here is that form, exactly as it appears on the calendar page:
      </p>
      <div className="hl-form" style={{ marginTop: 12 }}>
        <div className="hl-field hl-wide" style={{ background: "#111", border: "1px solid #262626", borderRadius: 14, padding: 16 }}>
          <p className="hl-fl">Text reminders</p>
          <label className="hl-fh" htmlFor="hl-sms-demo-phone">
            Mobile number
          </label>
          <input className="fp-in" disabled id="hl-sms-demo-phone" placeholder="10-digit US number" readOnly value="" />
          <p className="hl-fh">The number your reminder texts go to. US mobile numbers only.</p>
          <label htmlFor="hl-sms-demo-box" style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 6 }}>
            <input
              checked={false}
              disabled
              id="hl-sms-demo-box"
              readOnly
              style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--fp)", flexShrink: 0 }}
              type="checkbox"
            />
            <span className="hl-stepd" style={{ color: "#ddd" }}>{CONSENT}</span>
          </label>
          <div className="hl-meta">
            <span className="hl-tag">Text reminders: OFF</span>
          </div>
          <p className="hl-fh">
            Texts go out 30, 7 and 1 days before each date, alongside the email. Uncheck the box or reply STOP to any text to
            stop them.
          </p>
          <p className="hl-fh">
            See our{" "}
            <Link href="/haullegal/privacy" style={{ color: "var(--fp)", fontWeight: 700 }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/haullegal/terms" style={{ color: "var(--fp)", fontWeight: 700 }}>
              Terms
            </Link>
            .
          </p>
        </div>
      </div>
      <p style={{ ...p, marginTop: 10 }}>
        The number is saved only when the box is checked, together with the date and time of consent. Checking the box sends
        one confirmation text (sample 3 below).
      </p>

      <h2 style={h2}>Sample messages</h2>
      {SAMPLES.map((s) => (
        <div className="hl-gotcha" key={s}>
          {s}
        </div>
      ))}

      <h2 style={h2}>Frequency and cost</h2>
      <p style={p}>
        Message frequency varies with the deadlines on your calendar - typically 2 to 6 messages a month. Message and data rates
        may apply according to your mobile plan. Carriers are not liable for delayed or undelivered messages.
      </p>

      <h2 style={h2}>How to stop, and how to get help</h2>
      <p style={p}>
        Reply STOP to any message and you will receive one final confirmation and no further texts. You can also uncheck the box
        on your calendar page or email support@askevo.ai. Reply HELP to any message for help, or email support@askevo.ai. Reply
        START to turn reminders back on for a number that previously consented.
      </p>

      <h2 style={h2}>Your number and your privacy</h2>
      <p style={p}>
        Your mobile number and consent record are used only to send the reminders you asked for and to keep the record carriers
        require. We do not sell them and do not share them with third parties or affiliates for their marketing. Full details are
        in our{" "}
        <Link href="/haullegal/privacy" style={{ color: "var(--fp)", fontWeight: 700 }}>
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/haullegal/terms" style={{ color: "var(--fp)", fontWeight: 700 }}>
          Terms of Service
        </Link>
        .
      </p>

      <p className="fp-legal" style={{ marginTop: 30 }}>
        HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government agency; not affiliated with the U.S. DOT, FMCSA, the
        IRS, or any state agency. Not a law firm. support@askevo.ai
      </p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/sms/page.tsx (v1 - public SMS program
// page: sender, recipients, opt-in form copy, samples, STOP/HELP)
// If you can see this comment, the paste was not truncated.
// ============================================================
