"use client";
import "../spotmint.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Support tab (car five of the shell train). Spotmint-dressed contact
// form on the SAME pipe as AskEvo support: POST /api/support with
// { name, email, comment } -> Resend -> support@askevo.ai. The route
// is untouched; the message body's first line says it came from
// Spotmint so replies can be triaged. Email prefills from the signed
// in account. Reachable only by direct URL until layout v3.

const FIELD_STYLE = {
  width: "100%",
  background: "#111",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 15,
  boxSizing: "border-box",
  marginBottom: 12,
} as const;

export default function SpotmintSupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/spotmint/support");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint/support");
      return;
    }
    const known = session.user.email ?? "";
    if (known.includes("@")) setEmail((prev) => prev || known);
  }, [session, status, router]);

  async function handleSend() {
    if (state === "sending") return;
    setState("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          comment: `Sent from: Spotmint\n\n${message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrMsg(data.error || "Could not send your message.");
        setState("error");
        return;
      }
      setState("done");
      setMessage("");
    } catch {
      setErrMsg("Could not send your message. Please email " + BRAND.supportEmail + " directly.");
      setState("error");
    }
  }

  if (status === "loading") {
    return <div className="sp-wrap"><p style={{ color: "#888" }}>Loading...</p></div>;
  }
  if (!session?.user || /^guest-\d+$/.test(session?.user?.email ?? "")) {
    return null;
  }

  const canSend = name.trim().length > 0 && email.trim().length > 0 && message.trim().length > 0 && state !== "sending";

  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">We answer every message</p>

      <label className="sp-label">Your name</label>
      <input style={FIELD_STYLE} value={name} onChange={(e) => setName(e.target.value)} disabled={state === "sending"} />

      <label className="sp-label">Your email</label>
      <input style={FIELD_STYLE} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === "sending"} />

      <label className="sp-label">How can we help?</label>
      <textarea
        className="sp-ta"
        style={{ height: 120 }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell us what happened or what you need"
        disabled={state === "sending"}
      />

      <button type="button" className="sp-gen" onClick={handleSend} disabled={!canSend}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>

      {state === "done" && (
        <p className="sp-done" style={{ marginTop: 14 }}>Message sent - we will reply to your email.</p>
      )}
      {state === "error" && errMsg && <div className="sp-err">{errMsg}</div>}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/support/page.tsx (v1 - support tab)
// If you can see this comment, the paste was not truncated.
// ============================================================
