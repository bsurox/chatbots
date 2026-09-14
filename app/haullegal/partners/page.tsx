// FILE: app/haullegal/partners/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

// HaulLegal partner page (v1) - the door for businesses that
// already talk to brand-new carriers and get asked the same twenty
// questions every week: insurance agents (someone has to file the
// BMC-91), CDL schools, truck dealers, process agents, consortiums,
// factoring companies, accountants. The offer is deliberately
// modest and honest - a free printable checklist they can hand out,
// a link exchange, and an open door on revenue share - because we
// have not built an affiliate program yet and will not promise one
// we cannot pay. Everything here is a real, existing asset: the
// PDF at /hl-new-carrier-checklist.pdf, the free calculator, the
// free guides, the Spanish switch.
// English only on purpose: this is a business-to-business page,
// not customer-facing product copy (same call as /haullegal/sms).
// Server component; reached at haullegal.com/partners once the
// proxy clean-URL list carries /partners (proxy v24), and always
// at haullegal.com/haullegal/partners.
// The PDF link is a plain anchor with download - it is a file, not
// a route, so Next Link does not apply.

export const metadata: Metadata = {
  title: "Partner With HaulLegal - For Agents, Schools and Dealers",
  description:
    "You already answer new carriers' questions about USDOT numbers, authority, BOC-3 filings and drug testing. Hand them a free one-page checklist instead, and let us do the explaining.",
  alternates: { canonical: "https://haullegal.com/partners" },
  openGraph: {
    title: "Partner With HaulLegal",
    description:
      "A free printable new-carrier checklist for insurance agents, CDL schools, dealers and consortiums - plus a link exchange with a site that explains the whole process.",
    url: "https://haullegal.com/partners",
    siteName: "HaulLegal",
    type: "website",
  },
};

const WHO: Array<{ n: string; d: string }> = [
  {
    n: "Insurance agents and brokers",
    d: "Every carrier getting authority needs you to file the BMC-91 or BMC-91X, and most of them call you before they understand a single other step. Hand them the checklist and they stop calling you about Form 2290.",
  },
  {
    n: "CDL schools",
    d: "A share of every graduating class wants to run their own truck inside two years. This is the map they are missing, and it costs you nothing to give it to them.",
  },
  {
    n: "Truck dealers and lenders",
    d: "A buyer who cannot get authority cannot make payments. Helping them get legal faster protects the sale.",
  },
  {
    n: "Process agents, consortiums, ELD and factoring companies",
    d: "You sell one required piece. We explain where your piece fits in the other twenty-two, at the moment the carrier is looking for it.",
  },
  {
    n: "Accountants and tax preparers",
    d: "Your trucking clients miss IFTA quarters and Form 2290. Our deadline calculator is free and works with no signup.",
  },
];

const OFFER: Array<{ n: string; d: string }> = [
  {
    n: "A free one-page checklist to hand out",
    d: "Print it, email it, leave it on the counter. Every step in the order it happens, with the official government fee beside it - $0 for a USDOT number, $300 for authority, and so on. No sales pitch on it beyond our name.",
  },
  {
    n: "A free deadline calculator you can point people at",
    d: "haullegal.com/calendar. The carrier enters a USDOT number and a few dates and sees every recurring deadline. No account, no card, nothing to install.",
  },
  {
    n: "A link exchange",
    d: "If you publish a resources page, we will link to you from the step your service belongs to, and ask for a link back. We only list services a new carrier actually needs.",
  },
  {
    n: "Revenue share, if that is how you work",
    d: "We do not have a public affiliate program yet. If you would rather be paid for referrals than trade links, email us and we will work something out in writing.",
  },
];

const h2: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: "30px 0 10px", color: "#fff" };
const p: React.CSSProperties = { color: "#c7c7c7", fontSize: 14.5, lineHeight: 1.7, margin: "0 0 12px" };

export default function HaulLegalPartnersPage() {
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

      <p className="fp-badge">For agents, schools, dealers and vendors</p>
      <h1 className="fp-h1" style={{ fontSize: "30px" }}>
        You already answer <span>these questions.</span>
      </h1>
      <p className="fp-sub">
        Somebody buys a truck, decides to run under their own authority, and starts calling the people around them. Do I need
        an MC number. What is a BOC-3. Why is my authority still pending. You answer those for free, over and over, and it is
        not your job. HaulLegal is the answer you can hand them.
      </p>

      <div className="fp-strip" style={{ marginTop: "26px" }}>
        <p className="fp-st">Start with the free checklist</p>
        <p className="fp-sd">
          One page, print-ready, black on white. All 23 steps in the order they happen, plus what the government actually
          charges for each one - verified September 2026 against FMCSA, the IRS, UCR and IFTA. Nothing on it expires.
        </p>
        <div className="fp-try" style={{ margin: "14px 0 0" }}>
          <a className="fp-try-btn" download href="/hl-new-carrier-checklist.pdf">
            Download the checklist (PDF)
          </a>
        </div>
      </div>

      <h2 style={h2}>Who this is for</h2>
      <div className="fp-grid">
        {WHO.map((w) => (
          <div className="fp-card" key={w.n}>
            <p className="fp-cn">
              <span>+</span>
              {w.n}
            </p>
            <p className="fp-cd">{w.d}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>What we are offering</h2>
      <div className="fp-grid">
        {OFFER.map((o) => (
          <div className="fp-card" key={o.n}>
            <p className="fp-cn">
              <span>+</span>
              {o.n}
            </p>
            <p className="fp-cd">{o.d}</p>
          </div>
        ))}
      </div>

      <h2 style={h2}>What HaulLegal is</h2>
      <p style={p}>
        A step-by-step walkthrough that takes a brand-new owner-operator from forming the business to running legal - where
        exactly the click happens, the official link, the real government fee, the typical wait, the mistakes FMCSA flags, and
        the regulation each step comes from. Built for the Motus system FMCSA launched in May 2026, which means most of the
        advice your customers find online is now out of date. Plus a deadline calendar that tracks every recurring filing and
        emails or texts them before it is due. English and Spanish.
      </p>
      <p style={p}>
        Just as important, what it is not. We are not a government agency and not affiliated with the U.S. DOT, FMCSA or the
        IRS. We are not a law firm. We never file anything on a carrier's behalf and never touch their government accounts -
        they do every filing themselves, in their own accounts, and we show them how. We publish the government's real price
        next to every step, which is the whole point: nobody should pay $500 for a free form.
      </p>

      <h2 style={h2}>Get in touch</h2>
      <p style={p}>
        Email <b style={{ color: "#fff" }}>chase@askevo.ai</b> and tell us what you do and who your customers are. If you want
        a stack of checklists, a version with your name on it, or a link on the step your service belongs to, say so - that is
        the whole conversation.
      </p>

      <div className="fp-foot" style={{ marginTop: "36px" }}>
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/guides">
            Guides
          </Link>
          <Link className="fp-link" href="/haullegal/states">
            State guides
          </Link>
          <Link className="fp-link" href="/haullegal/calendar">
            Deadline calculator
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            Terms
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            Privacy
          </Link>
        </div>
        <p className="fp-legal">
          HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government agency; not affiliated with the U.S. DOT,
          FMCSA, the IRS, or any state agency. Not a law firm. Some links on the site are partner links; if a carrier buys
          through them we may earn a referral fee at no extra cost to them. support@askevo.ai
        </p>
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/partners/page.tsx (v1 - partner door:
// free checklist PDF, who it is for, what we offer, contact)
// If you can see this comment, the paste was not truncated.
// ============================================================
