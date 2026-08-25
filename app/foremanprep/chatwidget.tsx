// FILE: app/foremanprep/chat-widget.tsx
"use client";
import "./chat.css";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// ForemanPrep live chat widget (v1). The floating button in the
// bottom-right corner - the slot the account badge used to hold -
// on the two landing pages and the two practice rooms ONLY. It is
// mounted once in layout.tsx and decides for itself where to
// appear: an allowlist of pathnames covering both the clean URLs
// (foremanprep.com/practice) and the island paths
// (/foremanprep/practice). Never on the exam simulator, audio,
// buy, thanks, guides, or state pages.
// The chat calls /foremanprep/api/chat (Haiku, honest-facts system
// prompt). The visitor gets 10 AI messages a day - counted client-
// side for the UI and enforced server-side per IP. At the limit
// (or a server 429) the input swaps for a support form that mails
// name + email + the question straight to support@askevo.ai
// through the existing /api/support pipe, with the tail of the
// chat transcript attached so replies have context.

const ALLOWED_PATHS = new Set([
  "/",
  "/foremanprep",
  "/practice",
  "/foremanprep/practice",
  "/bl",
  "/foremanprep/bl",
  "/bl-prep",
  "/foremanprep/bl-prep",
]);

const CLIENT_CAP = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CHAT_ICON = (
  <svg
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

type Turn = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [sent, setSent] = useState(0);
  const [capped, setCapped] = useState(false);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [formPhase, setFormPhase] = useState<"idle" | "sending" | "done" | "error">("idle");

  const threadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread, busy, capped]);

  if (!ALLOWED_PATHS.has(pathname)) return null;

  async function send() {
    const text = input.trim();
    if (!text || busy || capped) return;
    const nextThread = [...thread, { role: "user" as const, content: text }];
    setThread(nextThread);
    setInput("");
    setErrMsg("");
    setBusy(true);
    try {
      const res = await fetch("/foremanprep/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextThread }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reply) {
        setThread((t) => [...t, { role: "assistant", content: data.reply }]);
        const used = sent + 1;
        setSent(used);
        if (used >= CLIENT_CAP) setCapped(true);
      } else if (res.status === 429) {
        setCapped(true);
      } else {
        setErrMsg(data?.error ?? "Something went wrong - try again.");
      }
    } catch {
      setErrMsg("Something went wrong - try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendForm() {
    if (formPhase === "sending") return;
    const name = formName.trim();
    const email = formEmail.trim();
    const msg = formMsg.trim();
    if (!name || !EMAIL_RE.test(email) || !msg) {
      setFormPhase("error");
      return;
    }
    setFormPhase("sending");
    const tail = thread
      .slice(-6)
      .map((m) => (m.role === "user" ? "Visitor: " : "AI: ") + m.content.slice(0, 300))
      .join("\n");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "ForemanPrep Live Chat Handoff",
          email,
          comment:
            "LIVE CHAT HANDOFF from " + name + " (" + email + ")\n\n" +
            "Their message:\n" + msg +
            (tail ? "\n\nChat transcript tail:\n" + tail : ""),
        }),
      });
      setFormPhase(res.ok ? "done" : "error");
    } catch {
      setFormPhase("error");
    }
  }

  return (
    <>
      {open ? (
        <div className="fc-panel">
          <div className="fc-head">
            <p className="fc-title">
              Foreman<span>Prep</span> help
            </p>
            <button
              aria-label="Close chat"
              className="fc-close"
              onClick={() => setOpen(false)}
              type="button"
            >
              x
            </button>
          </div>
          <div className="fc-thread" ref={threadRef}>
            <div className="fc-msg bot">
              Hey - questions about ForemanPrep, Business &amp; Law prep,
              your state, or the exams? Ask away.
            </div>
            {thread.map((m, i) => (
              <div
                className={m.role === "user" ? "fc-msg me" : "fc-msg bot"}
                key={`${m.role}-${i}`}
              >
                {m.content}
              </div>
            ))}
            {busy ? <div className="fc-msg bot thinking">Typing...</div> : null}
          </div>
          {errMsg ? <p className="fc-err">{errMsg}</p> : null}
          {capped ? (
            formPhase === "done" ? (
              <div className="fc-form">
                <p className="fc-fok">
                  Got it - your message went straight to our support desk.
                  We'll reply to your email.
                </p>
              </div>
            ) : (
              <div className="fc-form">
                <p className="fc-formh">That's the chat limit for today.</p>
                <p className="fc-formd">
                  Leave your name, email, and question - it goes straight to
                  a real person at support@askevo.ai.
                </p>
                <input
                  className="fc-fin"
                  disabled={formPhase === "sending"}
                  maxLength={120}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name"
                  value={formName}
                />
                <input
                  className="fc-fin"
                  disabled={formPhase === "sending"}
                  inputMode="email"
                  maxLength={200}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  value={formEmail}
                />
                <textarea
                  className="fc-fin fc-fta"
                  disabled={formPhase === "sending"}
                  maxLength={1500}
                  onChange={(e) => setFormMsg(e.target.value)}
                  placeholder="Your question"
                  value={formMsg}
                />
                {formPhase === "error" ? (
                  <p className="fc-err">
                    Check the fields and try again - all three are needed.
                  </p>
                ) : null}
                <button
                  className="fc-fsend"
                  disabled={formPhase === "sending"}
                  onClick={sendForm}
                  type="button"
                >
                  {formPhase === "sending" ? "Sending..." : "Send to support"}
                </button>
              </div>
            )
          ) : (
            <>
              <div className="fc-inrow">
                <input
                  className="fc-in"
                  disabled={busy}
                  maxLength={800}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Ask about the exams, states, pricing..."
                  value={input}
                />
                <button
                  className="fc-send"
                  disabled={busy || input.trim().length === 0}
                  onClick={send}
                  type="button"
                >
                  Send
                </button>
              </div>
              {sent > 0 ? (
                <p className="fc-count">
                  {Math.max(CLIENT_CAP - sent, 0)} of {CLIENT_CAP} messages left today
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
      <button
        aria-label={open ? "Close live chat" : "Open live chat"}
        className="fc-fab"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {CHAT_ICON}
      </button>
    </>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/chat-widget.tsx (v1 - floating
// AI chat on landings + practice rooms, support hand-off form)
// If you can see this comment, the paste was not truncated.
// ============================================================
