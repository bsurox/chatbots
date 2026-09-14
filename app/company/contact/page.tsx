// FILE: app/company/contact/page.tsx
"use client";
import Link from "next/link";
import { useState } from "react";

// The contact page (v1). Lifted off the landing page at his call,
// so the front door ends on the about section and reaching us is
// its own destination. The form posts to the shared support pipe
// (/api/support -> Resend -> support@askevo.ai), the same endpoint
// every brand's support form uses; proxy.ts passes that route
// publicly, so a visitor with no session can send.
// "use client" because of the form state - which is why this page
// carries no metadata export of its own and inherits the hub's.
// Reached at askevo.ai/contact - proxy.ts rewrites that clean URL
// onto this route.

export default function ContactPage() {
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
    <>
      <section className="ae-pagehead">
        <p className="ae-kicker">AskEvo LLC</p>
        <h1 className="ae-h1 small">Contact</h1>
        <p className="ae-lead">
          Support for any of our products, partnership and affiliate questions, press, or anything about the company itself. A real person reads these.
        </p>
      </section>

      <section className="ae-section">
        <div className="ae-contact">
          <div>
            <p className="ae-kicker" style={{ marginBottom: 4 }}>Email</p>
            <p className="ae-email">support@askevo.ai</p>
            <p className="ae-note" style={{ marginTop: 12 }}>
              Writing about a specific product? Say which one - ForemanPrep, WiremanPrep, HaulLegal or Spotmint - and it gets to the right place faster.
            </p>
            <p className="ae-note" style={{ marginTop: 12 }}>
              Already have an account with one of our products? Each site has its own support form inside it, which tells us who you are automatically.
            </p>
          </div>
          <div className="ae-form">
            <input className="ae-in" maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="Your name" value={name} />
            <input className="ae-in" maxLength={200} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" type="email" value={email} />
            <textarea className="ae-in ae-ta" maxLength={5000} onChange={(e) => setComment(e.target.value)} placeholder="What can we help with?" value={comment} />
            <button className="ae-cta ae-send" disabled={state === "sending"} onClick={send} type="button">
              {state === "sending" ? "Sending..." : "Send message"}
            </button>
            {msg ? <p className={"ae-note " + (state === "ok" ? "ok" : state === "err" ? "err" : "")}>{msg}</p> : null}
          </div>
        </div>
      </section>

      <section className="ae-section">
        <div className="ae-aboutdoors">
          <Link className="ae-navbtn" href="/businesses" prefetch={false}>See our businesses</Link>
        </div>
      </section>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/contact/page.tsx (v1 - its own page)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
