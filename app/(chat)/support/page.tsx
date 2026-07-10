"use client";
import { useState } from "react";
import { ToolHeader } from "@/components/chat/tool-header";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const canSend =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    comment.trim().length > 0 &&
    state !== "sending";

  async function submit() {
    if (!canSend) return;
    setErrMsg("");
    setState("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setErrMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  const labelStyle = {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
    color: "#fff",
  };

  const inputStyle = {
    width: "100%",
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    marginBottom: 20,
  };

  return (
    <>
      <ToolHeader />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
          Support
        </h1>
        <p style={{ color: "#888", marginBottom: 8, lineHeight: 1.6 }}>
          Have a question or need assistance? Send us a message below, or email us
          directly at{" "}
          <span style={{ color: "#22c55e", fontWeight: 600 }}>support@askevo.ai</span>
        </p>
        <p style={{ color: "#888", marginBottom: 32, fontSize: 14 }}>
          We typically respond within 1-3 business days.
        </p>

        {state === "done" ? (
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              border: "1px solid rgba(34,197,94,0.4)",
              background: "rgba(34,197,94,0.08)",
              color: "#22c55e",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Message sent! We typically respond within 1-3 business days.
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Name</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={state === "sending"}
            />

            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={state === "sending"}
            />

            <label style={labelStyle}>How can we help?</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical" as const }}
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what is going on..."
              disabled={state === "sending"}
            />

            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                background: canSend ? "#22c55e" : "#1c1c1c",
                color: canSend ? "#000" : "#555",
              }}
            >
              {state === "sending" ? "Sending..." : "Send message"}
            </button>

            {state === "error" && errMsg && (
              <p style={{ marginTop: 12, fontSize: 14, color: "#f87171" }}>{errMsg}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE (support page) - if you can see these lines
// after pasting, the whole file made it. Safe to commit.
// -----------------------------------------------------------
