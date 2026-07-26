// FILE: app/spotmint/delete-account/page.tsx
"use client";
import "../spotmint.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BRAND } from "../brand";

// Account deletion request page - required by Google Play's data
// safety policy (and useful regardless). Deliberately PUBLIC: store
// reviewers open this URL in a cold browser, so there is no auth
// guard; a signed-in visitor just gets their email prefilled.
// Requests ride the existing support pipe with a loud subject
// prefix so they are impossible to miss in the inbox. Deleting the
// account deletes the whole AskEvo LLC account (shared balance),
// and the copy says so honestly.

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

export default function SpotmintDeleteAccountPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const known = session?.user?.email ?? "";
    if (known.includes("@")) setEmail((prev) => prev || known);
  }, [session]);

  async function handleSend() {
    if (state === "sending") return;
    setState("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Account deletion request",
          email,
          comment: `ACCOUNT DELETION REQUEST\n\nPlease delete the account registered to this email address and its associated data.\n\n${message}`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrMsg(data.error || "Could not send your request.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setErrMsg("Could not send your request. Please email " + BRAND.supportEmail + " directly.");
      setState("error");
    }
  }

  const canSend = email.trim().length > 0 && state !== "sending" && state !== "done";

  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">Delete your account</p>

      <p className="sp-mm">
        Use this page to request deletion of your account and its
        associated data. Your account is shared across Spotmint and
        other AskEvo LLC products, so deletion removes it everywhere.
        Any remaining credits are forfeited and are not refundable.
        Records of past transactions may be retained where the law
        requires. We acknowledge deletion requests at the email you
        provide, typically within 1-3 business days.
      </p>

      <label className="sp-label">Account email</label>
      <input style={FIELD_STYLE} type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={state === "sending" || state === "done"} />

      <label className="sp-label">Anything we should know? (optional)</label>
      <textarea
        className="sp-ta"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={state === "sending" || state === "done"}
      />

      <button type="button" className="sp-gen" onClick={handleSend} disabled={!canSend}>
        {state === "sending" ? "Sending..." : state === "done" ? "Request sent" : "Request account deletion"}
      </button>

      {state === "done" && (
        <p className="sp-done" style={{ marginTop: 14 }}>Your deletion request has been received. We will follow up at the email you provided.</p>
      )}
      {state === "error" && errMsg && <div className="sp-err">{errMsg}</div>}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/delete-account/page.tsx (v1 -
// deletion request page)
// If you can see this comment, the paste was not truncated.
// ============================================================
