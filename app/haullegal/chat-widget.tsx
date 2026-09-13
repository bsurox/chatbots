// FILE: app/haullegal/chat-widget.tsx
"use client";
import "../foremanprep/chat.css";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { fill, HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal help chat (v2 - his call: the button sits bottom-RIGHT
// beside the account circle (class hl-dock, placed by
// haullegal.css v4), not bottom-left.)
// v1 notes - the green sibling of the ForemanPrep and WiremanPrep
// widgets, sharing chat.css; haullegal.css recolors the accents
// green under .hl-zone. Mounted once in the
// HaulLegal layout and decides for itself where to appear: the
// landing page, the walkthrough, the calendar, the guides and the
// state pages - both the clean haullegal.com URLs and the island
// paths. Never on buy, thanks, account, terms or privacy.
// Calls /haullegal/api/chat (Haiku, verified-facts prompt, no
// asterisks ever) and sends the language switch along so the
// answer comes back in Spanish when the site is in Spanish. The
// visitor gets 10 AI messages a day - counted client-side for the
// meter under its own per-day localStorage key, enforced
// server-side per IP in Postgres. At the limit (or a server 429)
// the input swaps for a support form that mails name + email + the
// question to support@askevo.ai through the existing /api/support
// pipe, with the tail of the transcript attached.

const CLIENT_CAP = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STORE_KEY = "hl-chat-used";

function allowed(pathname: string): boolean {
  if (pathname === "/" || pathname === "/haullegal") return true;
  return /^(\/haullegal)?\/(start|calendar|guides|states)(\/|$)/.test(pathname);
}

function todayStamp(): string {
  const d = new Date();
  return d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate();
}

function loadUsedToday(): number {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data?.day === todayStamp() && typeof data?.count === "number") {
      return Math.max(0, Math.min(data.count, CLIENT_CAP));
    }
  } catch {
    // Storage unavailable - the server cap still stands.
  }
  return 0;
}

function saveUsedToday(count: number): void {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ day: todayStamp(), count }));
  } catch {
    // Storage unavailable - the server cap still stands.
  }
}

const CHAT_ICON = (
  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

type Turn = { role: "user" | "assistant"; content: string };

export default function HlChatWidget() {
  const pathname = usePathname();
  const [lang] = useHlLang();
  const t = HL_UI[lang].chat;
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
    const used = loadUsedToday();
    if (used > 0) setSent(used);
    if (used >= CLIENT_CAP) setCapped(true);
  }, []);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread, busy, capped]);

  if (!allowed(pathname)) return null;

  async function send() {
    const text = input.trim();
    if (!text || busy || capped) return;
    const nextThread = [...thread, { role: "user" as const, content: text }];
    setThread(nextThread);
    setInput("");
    setErrMsg("");
    setBusy(true);
    try {
      const res = await fetch("/haullegal/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextThread, lang }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reply) {
        setThread((th) => [...th, { role: "assistant", content: data.reply }]);
        const used = sent + 1;
        setSent(used);
        saveUsedToday(used);
        if (used >= CLIENT_CAP) setCapped(true);
      } else if (res.status === 429) {
        setCapped(true);
        saveUsedToday(CLIENT_CAP);
      } else {
        setErrMsg(t.err);
      }
    } catch {
      setErrMsg(t.err);
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
          name: "HaulLegal Live Chat Handoff",
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
        <div className="fc-panel hl-dock">
          <div className="fc-head">
            <p className="fc-title">
              Haul<span>Legal</span> {t.titleTail}
            </p>
            <button aria-label={t.close} className="fc-close" onClick={() => setOpen(false)} type="button">
              x
            </button>
          </div>
          <div className="fc-thread" ref={threadRef}>
            <div className="fc-msg bot">{t.greeting}</div>
            {thread.map((m, i) => (
              <div className={m.role === "user" ? "fc-msg me" : "fc-msg bot"} key={`${m.role}-${i}`}>
                {m.content}
              </div>
            ))}
            {busy ? <div className="fc-msg bot thinking">{t.typing}</div> : null}
          </div>
          {errMsg ? <p className="fc-err">{errMsg}</p> : null}
          {capped ? (
            formPhase === "done" ? (
              <div className="fc-form">
                <p className="fc-fok">{t.formOk}</p>
              </div>
            ) : (
              <div className="fc-form">
                <p className="fc-formh">{t.limitH}</p>
                <p className="fc-formd">{t.limitD}</p>
                <input className="fc-fin" disabled={formPhase === "sending"} maxLength={120} onChange={(e) => setFormName(e.target.value)} placeholder={t.formName} value={formName} />
                <input className="fc-fin" disabled={formPhase === "sending"} inputMode="email" maxLength={200} onChange={(e) => setFormEmail(e.target.value)} placeholder={t.formEmail} type="email" value={formEmail} />
                <textarea className="fc-fin fc-fta" disabled={formPhase === "sending"} maxLength={1500} onChange={(e) => setFormMsg(e.target.value)} placeholder={t.formMsg} value={formMsg} />
                {formPhase === "error" ? <p className="fc-err">{t.formErr}</p> : null}
                <button className="fc-fsend" disabled={formPhase === "sending"} onClick={sendForm} type="button">
                  {formPhase === "sending" ? t.formSending : t.formSend}
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
                  placeholder={t.placeholder}
                  value={input}
                />
                <button className="fc-send" disabled={busy || input.trim().length === 0} onClick={send} type="button">
                  {t.send}
                </button>
              </div>
              {sent > 0 ? <p className="fc-count">{fill(t.left, { n: Math.max(CLIENT_CAP - sent, 0), cap: CLIENT_CAP })}</p> : null}
            </>
          )}
        </div>
      ) : null}
      <button aria-label={open ? t.close : t.openLabel} className="fc-fab hl-dock" onClick={() => setOpen((o) => !o)} type="button">
        {CHAT_ICON}
      </button>
    </>
  );
}

// ============================================================
// END OF FILE - app/haullegal/chat-widget.tsx (v2 - green chat
// docked beside the account circle, EN/ES, 10/day meter, support
// handoff)
// If you can see this comment, the paste was not truncated.
// ============================================================
