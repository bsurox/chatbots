// FILE: app/company/page.tsx
"use client";
import Link from "next/link";
import { useState } from "react";

// AskEvo LLC parent-company hub (v1). This is what askevo.ai shows
// now: who the company is, the businesses it owns, and how to
// reach it. Every business button is painted in that business's
// own brand color (the same hex its own site uses) via the table
// below; the wordmark wears the gradient of all of them.
// Both Spotmint store links are live: the App Store listing is
// named "Spotmint - AI Video Ads" (the name collision forced the
// longer store name), the Play listing is plain Spotmint.

const SPOTMINT_APP_STORE = "https://apps.apple.com/us/app/spotmint-ai-video-ads/id6796510023";
const SPOTMINT_PLAY = "https://play.google.com/store/apps/details?id=com.askevo.spotmint";

type Door = { label: string; href: string; color: string; ghost?: boolean; external?: boolean };
type Brand = { name: string; color: string; tag: string; domain: string; desc: string; who: string; doors: Array<Door> };

const BRANDS: Array<Brand> = [
  {
    name: "ForemanPrep",
    color: "#f97316",
    tag: "Contractor exam prep",
    domain: "foremanprep.com",
    desc: "Exam prep for the NASCLA general contractor license exam: unlimited practice questions, a full-length exam simulator, and an AI tutor that explains every answer. Business & Law prep with state packs and drive-time audio lessons sits alongside it.",
    who: "For builders getting licensed in the states that accept the NASCLA exam.",
    doors: [
      { label: "Visit ForemanPrep", href: "https://foremanprep.com", color: "#f97316", external: true },
      { label: "Business & Law prep", href: "https://foremanprep.com/bl-prep", color: "#38bdf8", external: true },
    ],
  },
  {
    name: "WiremanPrep",
    color: "#ceff00",
    tag: "Electrical exam prep",
    domain: "wiremanprep.com",
    desc: "The same prep tools built for electricians: practice, a true-to-form exam simulator and an AI tutor for the NASCLA Master, Journeyman and Residential electrical exams, with per-state board guides.",
    who: "For electricians testing through NASCLA in the states that accept it.",
    doors: [{ label: "Visit WiremanPrep", href: "https://wiremanprep.com", color: "#ceff00", external: true }],
  },
  {
    name: "HaulLegal",
    color: "#22c55e",
    tag: "Trucking authority",
    domain: "haullegal.com",
    desc: "A plain-English, step-by-step walkthrough for new owner-operators getting a USDOT number and operating authority, plus Stay Legal: a calendar that tracks every filing deadline and sends reminders so the truck never gets parked over paperwork.",
    who: "For drivers going out on their own. Available in English and Spanish.",
    doors: [{ label: "Visit HaulLegal", href: "https://haullegal.com", color: "#22c55e", external: true }],
  },
  {
    name: "Spotmint",
    color: "#46dba8",
    tag: "AI video ads",
    domain: "App Store and Google Play",
    desc: "Turns a few sentences about a business into a finished video ad - no filming, no editing, no agency. Pick a format, pick sound on or off, and save the ad straight to your phone.",
    who: "For small business owners who need marketing video without a production budget.",
    doors: [
      { label: "Google Play", href: SPOTMINT_PLAY, color: "#46dba8", external: true },
      { label: "App Store", href: SPOTMINT_APP_STORE, color: "#46dba8", external: true },
      { label: "Use it on the web", href: "/spotmint", color: "#46dba8", ghost: true },
    ],
  },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function DoorButton({ door }: { door: Door }) {
  if (!door.href) return null;
  const style = { ["--btn" as string]: door.color } as React.CSSProperties;
  return (
    <Link
      className={door.ghost ? "ae-btn ghost" : "ae-btn"}
      href={door.href}
      prefetch={false}
      style={style}
      target={door.external ? "_blank" : undefined}
      rel={door.external ? "noopener noreferrer" : undefined}
    >
      {door.label}
    </Link>
  );
}

function BrandCard({ b }: { b: Brand }) {
  const style = { ["--brand" as string]: b.color } as React.CSSProperties;
  return (
    <div className="ae-card" style={style}>
      <div className="ae-cardtop">
        <h3 className="ae-brandname">{b.name}</h3>
        <span className="ae-tag">{b.tag}</span>
      </div>
      <p className="ae-domain">{b.domain}</p>
      <p className="ae-desc">{b.desc}</p>
      <p className="ae-who">{b.who}</p>
      <div className="ae-btns">
        {b.doors.map((d) => (
          <DoorButton door={d} key={d.label} />
        ))}
      </div>
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function send() {
    if (state === "sending") return;
    setState("sending");
    setMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("err");
        setMsg(data.error || "Something went wrong. Email us instead.");
        return;
      }
      setState("ok");
      setMsg("Sent. We read every message and reply from support@askevo.ai.");
      setName("");
      setEmail("");
      setComment("");
    } catch {
      setState("err");
      setMsg("Could not send. Email us instead.");
    }
  }

  return (
    <div className="ae-form">
      <input className="ae-in" maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="Your name" value={name} />
      <input className="ae-in" maxLength={200} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" type="email" value={email} />
      <textarea className="ae-in ae-ta" maxLength={5000} onChange={(e) => setComment(e.target.value)} placeholder="What can we help with?" value={comment} />
      <button className="ae-cta ae-send" disabled={state === "sending"} onClick={send} type="button">
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      {msg ? <p className={"ae-note " + (state === "ok" ? "ok" : state === "err" ? "err" : "")}>{msg}</p> : null}
    </div>
  );
}

export default function CompanyPage() {
  return (
    <div className="ae-wrap">
      <div className="ae-top">
        <h1 className="ae-wordmark ae-grad">AskEvo LLC</h1>
        <div className="ae-nav">
          <button className="ae-navbtn" onClick={() => scrollTo("businesses")} type="button">Businesses</button>
          <button className="ae-navbtn" onClick={() => scrollTo("about")} type="button">About</button>
          <button className="ae-navbtn" onClick={() => scrollTo("contact")} type="button">Contact</button>
        </div>
      </div>
      <div className="ae-rule" />

      <section className="ae-hero">
        <p className="ae-kicker">Boise, Idaho</p>
        <h2 className="ae-h1">
          <span className="ae-grad">AskEvo LLC</span>
          <br />
          builds focused software businesses.
        </h2>
        <p className="ae-lead">
          One company, several brands. Each one solves a single problem for a single group of people - contractors getting licensed, electricians testing, truckers going independent, small businesses that need a video ad - and does it end to end.
        </p>
        <button className="ae-cta" onClick={() => scrollTo("businesses")} type="button">See our businesses</button>
      </section>

      <section className="ae-section" id="businesses">
        <h2 className="ae-h2">Our businesses</h2>
        <p className="ae-sub">Every brand below is owned and operated by AskEvo LLC. Each runs on its own site, in its own colors.</p>
        <div className="ae-grid">
          {BRANDS.map((b) => (
            <BrandCard b={b} key={b.name} />
          ))}
        </div>
      </section>

      <section className="ae-section" id="about">
        <h2 className="ae-h2">Who we are</h2>
        <p className="ae-sub">A small Idaho company that would rather build four useful things than one generic one.</p>
        <div className="ae-about">
          <div className="ae-prose">
            <p>
              AskEvo LLC was formed in Boise, Idaho in 2026. It started as an AI chat assistant - the AskEvo name comes from there. Building that tool taught us the lesson the company now runs on: the technology is the easy part. The value is in taking one specific problem for one specific group of people and solving it completely.
            </p>
            <p>
              So that is what we do. We find work that is confusing, expensive or slow - passing a licensing exam, getting a truck legally on the road, producing a video ad - and we build a product that walks a person through it from start to finish. Each product gets its own brand, its own site and its own colors. The company behind all of them is the same.
            </p>
            <p>
              AskEvo LLC is founded and run by Chase Lindsay. Questions about any of our businesses, partnerships, or the company itself go to the contact below.
            </p>
          </div>
          <div className="ae-facts">
            <div className="ae-fact"><p className="ae-factk">Company</p><p className="ae-factv">AskEvo LLC, an Idaho limited liability company</p></div>
            <div className="ae-fact"><p className="ae-factk">Based in</p><p className="ae-factv">Boise, Idaho</p></div>
            <div className="ae-fact"><p className="ae-factk">Founded</p><p className="ae-factv">2026</p></div>
            <div className="ae-fact"><p className="ae-factk">Brands</p><p className="ae-factv">ForemanPrep, WiremanPrep, HaulLegal, Spotmint</p></div>
          </div>
        </div>
      </section>

      <section className="ae-section" id="contact">
        <h2 className="ae-h2">Contact</h2>
        <p className="ae-sub">For support on any product, partnerships, press, or anything else.</p>
        <div className="ae-contact">
          <div>
            <p className="ae-kicker" style={{ marginBottom: 4 }}>Email</p>
            <p className="ae-email">support@askevo.ai</p>
            <p className="ae-note" style={{ marginTop: 10 }}>
              Product questions get the fastest answer if you mention which business you are writing about.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <div className="ae-foot">
        <div>
          AskEvo LLC, Boise, Idaho. ForemanPrep, WiremanPrep, HaulLegal and Spotmint are trade names of AskEvo LLC.
        </div>
        <div className="ae-footlinks">
          <Link className="ae-footbtn" href="/terms">Terms</Link>
          <Link className="ae-footbtn" href="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/page.tsx (v1 - parent-company hub)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
