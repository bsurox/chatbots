// FILE: app/foremanprep/admin-audio/page.tsx
"use client";
import { useRef, useState } from "react";
import { BL_QUESTIONS } from "@/lib/foremanprep/blquestions";
import { BL_PACKS_LIVE } from "@/lib/foremanprep/blstates";
import { LESSONS } from "@/lib/foremanprep/lessons";
import { QUESTIONS } from "@/lib/foremanprep/questions";

// ForemanPrep audio admin (v4) - Chase's one-button factory floor.
// v4 adds Step 5: Generate the state packs - every statute-pack
// question from blstates (TN/GA/SC today; the list grows itself
// as pack states land) through the same route. audio-gen v5 now
// resolves pack ids AND skips files already in the blob store, so
// this step - and any re-run of any step - only pays ElevenLabs
// for what is missing. The Step 1 test button passes force: true
// so a voice audition always generates fresh.
// v3 adds Step 4: Generate the Business & Law bank - all 120 B&L
// questions through the same route (their bl- ids resolve against
// the B&L bank since audio-gen v4), with its own start-at box and
// progress line so the GC files are never redone.
// v2 adds Step 3: Generate lessons - voices the 12 drive-time
// lesson scripts through the same route (kind "lesson").
// Paste the FOREMAN_AUDIO_KEY, test one question to hear the voice,
// then Generate All walks every question in the bank through the
// audio-gen route twice (question audio + explanation audio),
// sequentially, with live progress, an abort switch, and a
// start-at box so an interrupted run resumes without redoing
// everything. Failures collect in a list instead of stopping the
// run. When it finishes, it prints the blob base URL - send that
// to Claude to wire the Listen buttons. The char estimate below is
// client-side math for planning; the route reports exact counts.

const LETTERS = ["A", "B", "C", "D"];

// Every statute-pack question across the live pack states.
const PACK_QUESTIONS = BL_PACKS_LIVE.flatMap((p) => p.questions);

type Job = { id: string; kind: "q" | "e" | "lesson" };

function jobText(job: Job): string {
  const q =
    QUESTIONS.find((x) => x.id === job.id) ??
    BL_QUESTIONS.find((x) => x.id === job.id) ??
    PACK_QUESTIONS.find((x) => x.id === job.id);
  if (!q) return "";
  if (job.kind === "q") {
    const choices = q.choices.map((c, i) => `Option ${LETTERS[i]}: ${c}.`).join(" ");
    return `${q.q} ${choices}`;
  }
  const letter = LETTERS[q.answer] ?? "";
  return `The correct answer is ${letter}: ${q.choices[q.answer]}. ${q.explain} Reference: ${q.cite}.`;
}

const ALL_JOBS: Job[] = QUESTIONS.flatMap((q) => [
  { id: q.id, kind: "q" as const },
  { id: q.id, kind: "e" as const },
]);

const BL_JOBS: Job[] = BL_QUESTIONS.flatMap((q) => [
  { id: q.id, kind: "q" as const },
  { id: q.id, kind: "e" as const },
]);

const ST_JOBS: Job[] = PACK_QUESTIONS.flatMap((q) => [
  { id: q.id, kind: "q" as const },
  { id: q.id, kind: "e" as const },
]);

const TOTAL_CHARS = ALL_JOBS.reduce((sum, j) => sum + jobText(j).length, 0);
const BL_CHARS = BL_JOBS.reduce((sum, j) => sum + jobText(j).length, 0);
const ST_CHARS = ST_JOBS.reduce((sum, j) => sum + jobText(j).length, 0);
const LESSON_CHARS = LESSONS.reduce((sum, l) => sum + l.script.length, 0);

const box = {
  background: "#111",
  border: "1px solid #2c2c2c",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "14px",
} as const;

const btn = {
  background: "#f97316",
  border: "none",
  borderRadius: "9px",
  color: "#000",
  fontWeight: 800,
  fontSize: "14px",
  padding: "11px 18px",
  cursor: "pointer",
  fontFamily: "inherit",
} as const;

const input = {
  width: "100%",
  background: "#0a0a0a",
  border: "1px solid #333",
  borderRadius: "8px",
  color: "#eee",
  fontSize: "14px",
  fontFamily: "inherit",
  padding: "10px 12px",
  boxSizing: "border-box",
} as const;

export default function AdminAudioPage() {
  const [key, setKey] = useState("");
  const [testUrls, setTestUrls] = useState<string[]>([]);
  const [testBusy, setTestBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [current, setCurrent] = useState("");
  const [chars, setChars] = useState(0);
  const [startAt, setStartAt] = useState("1");
  const [failures, setFailures] = useState<string[]>([]);
  const [base, setBase] = useState("");
  const [note, setNote] = useState("");
  const [lessonBusy, setLessonBusy] = useState(false);
  const [lessonDone, setLessonDone] = useState(0);
  const [lessonNow, setLessonNow] = useState("");
  const [blRunning, setBlRunning] = useState(false);
  const [blDone, setBlDone] = useState(0);
  const [blCurrent, setBlCurrent] = useState("");
  const [blStartAt, setBlStartAt] = useState("1");
  const [stRunning, setStRunning] = useState(false);
  const [stDone, setStDone] = useState(0);
  const [stSkipped, setStSkipped] = useState(0);
  const [stCurrent, setStCurrent] = useState("");
  const [stStartAt, setStStartAt] = useState("1");
  const abortRef = useRef(false);

  async function runLessons() {
    if (!key.trim() || lessonBusy || running || testBusy) return;
    setLessonBusy(true);
    setLessonDone(0);
    setNote("");
    for (const l of LESSONS) {
      setLessonNow(l.title);
      const r = await generate({ id: l.key, kind: "lesson" });
      if (r.ok && r.url) {
        recordBase(r.url);
      } else {
        setFailures((f) => [...f, `lesson/${l.key}: ${r.error}`]);
      }
      setLessonDone((d) => d + 1);
    }
    setLessonNow("");
    setNote("Lesson batch complete.");
    setLessonBusy(false);
  }

  async function generate(job: Job, force?: boolean): Promise<{ ok: boolean; url?: string; chars?: number; skipped?: boolean; error?: string }> {
    try {
      const res = await fetch("/foremanprep/api/audio-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, kind: job.kind, id: job.id, force: force === true }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) return { ok: true, url: data.url, chars: data.chars, skipped: data.skipped === true };
      return { ok: false, error: data?.error ?? `HTTP ${res.status}` };
    } catch {
      return { ok: false, error: "network error" };
    }
  }

  function recordBase(url: string) {
    const i = url.indexOf("/foremanprep-audio/");
    if (i > 0) setBase((b) => b || url.slice(0, i));
  }

  async function testOne() {
    if (!key.trim() || testBusy || running) return;
    setTestBusy(true);
    setNote("");
    setTestUrls([]);
    const urls: string[] = [];
    for (const kind of ["q", "e"] as const) {
      // force: true - a voice audition must generate fresh, never
      // return the store's existing file.
      const r = await generate({ id: QUESTIONS[0].id, kind }, true);
      if (r.ok && r.url) {
        urls.push(r.url);
        recordBase(r.url);
      } else {
        setNote(`Test failed (${kind}): ${r.error}`);
        setTestBusy(false);
        return;
      }
    }
    setTestUrls(urls);
    setNote(`Test complete for ${QUESTIONS[0].id} - listen below, then run the full batch.`);
    setTestBusy(false);
  }

  async function runBl() {
    if (!key.trim() || blRunning || running || testBusy || lessonBusy) return;
    const from = Math.max(1, Number.parseInt(blStartAt, 10) || 1) - 1;
    setBlRunning(true);
    abortRef.current = false;
    setNote("");
    for (let i = from; i < BL_JOBS.length; i++) {
      if (abortRef.current) {
        setNote(`Stopped at B&L job ${i + 1}. Enter ${i + 1} in the B&L start box to resume.`);
        break;
      }
      const job = BL_JOBS[i];
      setBlCurrent(`${job.id} (${job.kind === "q" ? "question" : "explanation"})`);
      const r = await generate(job);
      if (r.ok && r.url) {
        recordBase(r.url);
      } else {
        setFailures((f) => [...f, `${job.id}/${job.kind}: ${r.error}`]);
      }
      setBlDone(i + 1);
    }
    if (!abortRef.current) setNote("B&L batch complete.");
    setBlCurrent("");
    setBlRunning(false);
  }

  async function runSt() {
    if (!key.trim() || stRunning || blRunning || running || testBusy || lessonBusy) return;
    const from = Math.max(1, Number.parseInt(stStartAt, 10) || 1) - 1;
    setStRunning(true);
    abortRef.current = false;
    setNote("");
    setStSkipped(0);
    for (let i = from; i < ST_JOBS.length; i++) {
      if (abortRef.current) {
        setNote(`Stopped at state-pack job ${i + 1}. Enter ${i + 1} in the state-pack start box to resume.`);
        break;
      }
      const job = ST_JOBS[i];
      setStCurrent(`${job.id} (${job.kind === "q" ? "question" : "explanation"})`);
      const r = await generate(job);
      if (r.ok && r.url) {
        recordBase(r.url);
        if (r.skipped) setStSkipped((s) => s + 1);
      } else {
        setFailures((f) => [...f, `${job.id}/${job.kind}: ${r.error}`]);
      }
      setStDone(i + 1);
    }
    if (!abortRef.current) setNote("State-pack batch complete.");
    setStCurrent("");
    setStRunning(false);
  }

  async function runAll() {
    if (!key.trim() || running || testBusy) return;
    const from = Math.max(1, Number.parseInt(startAt, 10) || 1) - 1;
    setRunning(true);
    abortRef.current = false;
    setFailures([]);
    setNote("");
    let usedChars = 0;
    let completed = from;
    for (let i = from; i < ALL_JOBS.length; i++) {
      if (abortRef.current) {
        setNote(`Stopped at job ${i + 1}. Enter ${i + 1} in the start box to resume.`);
        break;
      }
      const job = ALL_JOBS[i];
      setCurrent(`${job.id} (${job.kind === "q" ? "question" : "explanation"})`);
      const r = await generate(job);
      if (r.ok && r.url) {
        usedChars += r.chars ?? 0;
        recordBase(r.url);
      } else {
        setFailures((f) => [...f, `${job.id}/${job.kind}: ${r.error}`]);
      }
      completed = i + 1;
      setDone(completed);
      setChars(usedChars);
    }
    if (!abortRef.current && completed >= ALL_JOBS.length) {
      setNote("Full batch complete.");
    }
    setCurrent("");
    setRunning(false);
  }

  return (
    <div className="fp-wrap" style={{ maxWidth: "620px" }}>
      <p style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "18px 0 4px" }}>
        Audio factory
      </p>
      <p style={{ fontSize: "13.5px", color: "#999", lineHeight: 1.5, margin: "0 0 18px" }}>
        {QUESTIONS.length} questions, {ALL_JOBS.length} audio files, about{" "}
        {Math.round(TOTAL_CHARS / 1000)}k ElevenLabs characters for the full
        batch. Keep this tab open while it runs.
      </p>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Admin key
        </p>
        <input
          onChange={(e) => setKey(e.target.value)}
          placeholder="FOREMAN_AUDIO_KEY value"
          style={input}
          type="password"
          value={key}
        />
      </div>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Step 1 - hear the voice
        </p>
        <button disabled={testBusy || running} onClick={testOne} style={btn} type="button">
          {testBusy ? "Generating..." : `Test one question (${QUESTIONS[0].id})`}
        </button>
        {testUrls.map((u) => (
          <audio controls key={u} src={u} style={{ width: "100%", marginTop: "10px" }} />
        ))}
      </div>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Step 2 - generate everything
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", color: "#999" }}>Start at job</span>
          <input
            inputMode="numeric"
            onChange={(e) => setStartAt(e.target.value)}
            style={{ ...input, width: "90px" }}
            value={startAt}
          />
          <span style={{ fontSize: "13px", color: "#999" }}>of {ALL_JOBS.length}</span>
        </div>
        {running ? (
          <button
            onClick={() => {
              abortRef.current = true;
            }}
            style={{ ...btn, background: "#ef4444", color: "#fff" }}
            type="button"
          >
            Stop after current file
          </button>
        ) : (
          <button disabled={testBusy} onClick={runAll} style={btn} type="button">
            Generate all
          </button>
        )}
        <p style={{ fontSize: "13.5px", color: "#ccc", margin: "12px 0 0", fontVariantNumeric: "tabular-nums" }}>
          {done} / {ALL_JOBS.length} done{current ? ` - working on ${current}` : ""} -{" "}
          {Math.round(chars / 1000)}k chars used this run
        </p>
      </div>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          Step 3 - generate the drive-time lessons
        </p>
        <p style={{ fontSize: "12.5px", color: "#999", margin: "0 0 10px" }}>
          {LESSONS.length} lessons, about {Math.round(LESSON_CHARS / 1000)}k characters.
          Each one takes a minute or two - the long scripts generate in pieces.
        </p>
        <button disabled={lessonBusy || running || testBusy} onClick={runLessons} style={btn} type="button">
          {lessonBusy ? "Generating lessons..." : "Generate lessons"}
        </button>
        <p style={{ fontSize: "13.5px", color: "#ccc", margin: "12px 0 0", fontVariantNumeric: "tabular-nums" }}>
          {lessonDone} / {LESSONS.length} lessons done
          {lessonNow ? ` - working on ${lessonNow}` : ""}
        </p>
      </div>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", margin: "0 0 8px" }}>
          Step 4 - generate the Business & Law bank
        </p>
        <p style={{ fontSize: "12.5px", color: "#999", margin: "0 0 10px" }}>
          {BL_QUESTIONS.length} questions, {BL_JOBS.length} audio files, about{" "}
          {Math.round(BL_CHARS / 1000)}k characters. Runs separately so the
          GC files are never touched.
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", color: "#999" }}>Start at job</span>
          <input
            inputMode="numeric"
            onChange={(e) => setBlStartAt(e.target.value)}
            style={{ ...input, width: "90px" }}
            value={blStartAt}
          />
          <span style={{ fontSize: "13px", color: "#999" }}>of {BL_JOBS.length}</span>
        </div>
        {blRunning ? (
          <button
            onClick={() => {
              abortRef.current = true;
            }}
            style={{ ...btn, background: "#ef4444", color: "#fff" }}
            type="button"
          >
            Stop after current file
          </button>
        ) : (
          <button
            disabled={testBusy || running || lessonBusy}
            onClick={runBl}
            style={{ ...btn, background: "#38bdf8" }}
            type="button"
          >
            Generate B&L bank
          </button>
        )}
        <p style={{ fontSize: "13.5px", color: "#ccc", margin: "12px 0 0", fontVariantNumeric: "tabular-nums" }}>
          {blDone} / {BL_JOBS.length} done{blCurrent ? ` - working on ${blCurrent}` : ""}
        </p>
      </div>

      <div style={box}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", margin: "0 0 8px" }}>
          Step 5 - generate the state packs
        </p>
        <p style={{ fontSize: "12.5px", color: "#999", margin: "0 0 10px" }}>
          {PACK_QUESTIONS.length} statute questions across the live pack
          states, {ST_JOBS.length} audio files, about{" "}
          {Math.round(ST_CHARS / 1000)}k characters. Files that already
          exist are skipped automatically, so re-running after new pack
          states land only pays for the new ones.
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", color: "#999" }}>Start at job</span>
          <input
            inputMode="numeric"
            onChange={(e) => setStStartAt(e.target.value)}
            style={{ ...input, width: "90px" }}
            value={stStartAt}
          />
          <span style={{ fontSize: "13px", color: "#999" }}>of {ST_JOBS.length}</span>
        </div>
        {stRunning ? (
          <button
            onClick={() => {
              abortRef.current = true;
            }}
            style={{ ...btn, background: "#ef4444", color: "#fff" }}
            type="button"
          >
            Stop after current file
          </button>
        ) : (
          <button
            disabled={testBusy || running || lessonBusy || blRunning}
            onClick={runSt}
            style={{ ...btn, background: "#38bdf8" }}
            type="button"
          >
            Generate state packs
          </button>
        )}
        <p style={{ fontSize: "13.5px", color: "#ccc", margin: "12px 0 0", fontVariantNumeric: "tabular-nums" }}>
          {stDone} / {ST_JOBS.length} done ({stSkipped} already existed)
          {stCurrent ? ` - working on ${stCurrent}` : ""}
        </p>
      </div>

      {note ? (
        <p style={{ fontSize: "13.5px", color: "#4ade80", margin: "0 0 12px" }}>{note}</p>
      ) : null}

      {failures.length > 0 ? (
        <div style={{ ...box, borderColor: "#7f1d1d" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#f87171", margin: "0 0 8px" }}>
            Failed ({failures.length}) - rerun these later
          </p>
          <p style={{ fontSize: "12.5px", color: "#bbb", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
            {failures.join("\n")}
          </p>
        </div>
      ) : null}

      {base ? (
        <div style={box}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
            Audio base URL - send this to Claude
          </p>
          <p style={{ fontSize: "13px", color: "#f97316", margin: 0, wordBreak: "break-all" }}>{base}</p>
        </div>
      ) : null}
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/admin-audio/page.tsx (v4 -
// Step 5 voices the state packs; test button forces fresh)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
