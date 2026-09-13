// FILE: app/haullegal/step-tutor.tsx
"use client";
import "../foremanprep/chat.css";
import { useEffect, useRef, useState } from "react";
import { fill, HL_UI, type HlLang } from "@/lib/haullegal/i18n";

// HaulLegal step tutor panel (v1) - the "?" on every walkthrough
// card opens this: the same dark chat panel as the help widget
// (shared chat.css, green under .hl-zone), pinned bottom-right,
// scoped to ONE step. The walkthrough page owns which step is open
// and hands it in; the thread is kept per step id for the life of
// the page, so switching between steps and back keeps each
// conversation. Calls /haullegal/api/tutor with the step id, the
// short back-and-forth and the language switch. Caps come from
// the server: walkthrough owners 25 a day per account, everyone
// else 3 a day per IP on the free steps; a 429 shows the server's
// line and closes the input.

type Turn = { role: "user" | "assistant"; content: string };

export default function HlStepTutor(props: {
  stepId: string | null;
  number: number;
  title: string;
  lang: HlLang;
  onClose: () => void;
}) {
  const { stepId, number, title, lang, onClose } = props;
  const t = HL_UI[lang].tutor;
  const [threads, setThreads] = useState<Record<string, Turn[]>>({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [capped, setCapped] = useState("");
  const threadRef = useRef<HTMLDivElement | null>(null);

  const thread = stepId ? threads[stepId] ?? [] : [];

  useEffect(() => {
    setInput("");
    setErrMsg("");
  }, [stepId]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread, busy]);

  if (!stepId) return null;

  async function send() {
    const text = input.trim();
    if (!text || busy || capped || !stepId) return;
    const id = stepId;
    const next = [...thread, { role: "user" as const, content: text }];
    setThreads((all) => ({ ...all, [id]: next }));
    setInput("");
    setErrMsg("");
    setBusy(true);
    try {
      const res = await fetch("/haullegal/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: id, messages: next, lang }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reply) {
        setThreads((all) => ({ ...all, [id]: [...(all[id] ?? next), { role: "assistant", content: data.reply }] }));
      } else if (res.status === 429) {
        setCapped(data?.free ? t.limitFree : t.limit);
      } else {
        setErrMsg(typeof data?.error === "string" && data.error ? data.error : t.err);
      }
    } catch {
      setErrMsg(t.err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fc-panel">
      <div className="fc-head">
        <p className="fc-title">
          <span>{fill(t.title, { n: number })}</span> - {title}
        </p>
        <button aria-label={t.close} className="fc-close" onClick={onClose} type="button">
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
        <div className="fc-form">
          <p className="fc-formd">{capped}</p>
        </div>
      ) : (
        <div className="fc-inrow">
          <input
            className="fc-in"
            disabled={busy}
            maxLength={1200}
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
      )}
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/step-tutor.tsx (v1 - per-step tutor
// panel, threads kept per step, EN/ES)
// If you can see this comment, the paste was not truncated.
// ============================================================
