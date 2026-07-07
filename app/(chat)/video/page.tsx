"use client";
import "./video.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToolHeader } from "@/components/chat/tool-header";

type Tier = {
  id: "fast" | "standard" | "premium" | "cinematic";
  name: string;
  desc: string;
  credits5?: number;
  credits10?: number;
  fixedSeconds?: number;
  credits8?: number;
};

const TIERS: Tier[] = [
  { id: "fast", name: "Fast", desc: "Quick drafts & ideas", credits5: 75, credits10: 150 },
  { id: "standard", name: "Standard", desc: "Balanced quality & speed", credits5: 110, credits10: 220 },
  { id: "premium", name: "Premium", desc: "Top quality, up to 10s", credits5: 250, credits10: 500 },
  { id: "cinematic", name: "Cinematic", desc: "Highest quality + sound (Veo 3)", fixedSeconds: 8, credits8: 375 },
];

const JOB_KEY = "askevo_video_job";

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function download(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "askevo-video.mp4";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function VideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [tierId, setTierId] = useState<Tier["id"]>("standard");
  const [length, setLength] = useState<5 | 10>(5);
  const [credits, setCredits] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "starting" | "generating" | "done" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumedRef = useRef(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/video");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/video");
    }
  }, [session, status, router]);

  const loadCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (typeof data.credits === "number") setCredits(data.credits);
    } catch {
      // ignore
    }
  }, []);

  const poll = useCallback(
    async (requestId: string) => {
      try {
        const res = await fetch(`/api/video/status?requestId=${encodeURIComponent(requestId)}`);
        const data = await res.json();
        if (data.status === "completed" && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setPhase("done");
          setStatusLabel(null);
          if (typeof data.credits === "number") setCredits(data.credits);
          localStorage.removeItem(JOB_KEY);
          return;
        }
        if (data.status === "failed") {
          setErrorMsg(data.error || "Generation failed. Your credits were refunded.");
          setPhase("error");
          setStatusLabel(null);
          localStorage.removeItem(JOB_KEY);
          loadCredits();
          return;
        }
        if (data.statusLabel) setStatusLabel(data.statusLabel);
        pollRef.current = setTimeout(() => poll(requestId), 4000);
      } catch {
        pollRef.current = setTimeout(() => poll(requestId), 5000);
      }
    },
    [loadCredits]
  );

  useEffect(() => {
    if (!session?.user || resumedRef.current) return;
    resumedRef.current = true;
    loadCredits();
    const saved = localStorage.getItem(JOB_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.requestId) {
          setStartedAt(parsed.startedAt || Date.now());
          setPhase("generating");
          poll(parsed.requestId);
        }
      } catch {
        localStorage.removeItem(JOB_KEY);
      }
    }
  }, [session, loadCredits, poll]);

  useEffect(() => {
    if ((phase === "generating" || phase === "starting") && startedAt) {
      const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, [phase, startedAt]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  if (status === "loading") {
    return <div className="vg-wrap"><p style={{ color: "#888" }}>Loading...</p></div>;
  }
  if (!session?.user || /^guest-\d+$/.test(session?.user?.email ?? "")) {
    return null;
  }

  const tier = TIERS.find((t) => t.id === tierId)!;
  const isFixed = !!tier.fixedSeconds;
  const effectiveSeconds = isFixed ? (tier.fixedSeconds as number) : length;
  const cost = isFixed
    ? (tier.credits8 as number)
    : length === 5
    ? (tier.credits5 as number)
    : (tier.credits10 as number);
  const notEnough = credits !== null && cost > credits;
  const busy = phase === "starting" || phase === "generating";
  const canGenerate = prompt.trim().length > 0 && !busy && !notEnough;

  let stage = statusLabel;
  if (!stage) {
    if (elapsed < 8) stage = "Queued - reserving a spot...";
    else if (elapsed < 40) stage = "Warming up the model...";
    else if (elapsed < 240) stage = "Rendering frames...";
    else stage = "Finalizing your video...";
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    setErrorMsg(null);
    setVideoUrl(null);
    setStatusLabel(null);
    const started = Date.now();
    setStartedAt(started);
    setElapsed(0);
    setPhase("starting");
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), tier: tierId, length: effectiveSeconds }),
      });
      const data = await res.json();
      if (!res.ok || !data.requestId) {
        setErrorMsg(data.error || "Could not start generation.");
        setPhase("error");
        loadCredits();
        return;
      }
      if (typeof data.credits === "number") setCredits(data.credits);
      localStorage.setItem(JOB_KEY, JSON.stringify({ requestId: data.requestId, startedAt: started }));
      setPhase("generating");
      poll(data.requestId);
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setPhase("error");
      loadCredits();
    }
  }

  return (
    <>
      <ToolHeader />
      <div className="vg-wrap">
        <h1 className="vg-h1">Video Generator</h1>
        <p className="vg-sub">Turn a prompt into a short video. Generation is async and can take a few minutes.</p>
        <p className="vg-bal">
          Balance: <span className="vg-green">{credits === null ? "..." : credits.toLocaleString()} credits</span>
        </p>

        <label className="vg-label">Prompt</label>
        <textarea
          className="vg-ta"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon hummingbird flying through a rainy Tokyo street at night, cinematic..."
          rows={3}
          disabled={busy}
        />

        <label className="vg-label">Length</label>
        {isFixed ? (
          <div style={{ marginBottom: 24 }}>
            <div className="vg-fixed">8 seconds</div>
            <p className="vg-note">Cinematic renders a single 8-second clip with sound - this is the max length for this tier.</p>
          </div>
        ) : (
          <div className="vg-len">
            {[5, 10].map((sec) => (
              <button
                key={sec}
                type="button"
                className={length === sec ? "on" : undefined}
                onClick={() => setLength(sec as 5 | 10)}
                disabled={busy}
              >
                {sec} seconds
              </button>
            ))}
          </div>
        )}

        <label className="vg-label">Quality</label>
        <div className="vg-tiers">
          {TIERS.map((t) => {
            const tFixed = !!t.fixedSeconds;
            const tCost = tFixed
              ? (t.credits8 as number)
              : length === 5
              ? (t.credits5 as number)
              : (t.credits10 as number);
            return (
              <button
                key={t.id}
                type="button"
                className={t.id === tierId ? "vg-tier on" : "vg-tier"}
                onClick={() => setTierId(t.id)}
                disabled={busy}
              >
                <div className="vg-tn">{t.name}</div>
                <div className="vg-td">{t.desc}</div>
                <div className="vg-tc">{tCost.toLocaleString()} credits</div>
                {tFixed && <div className="vg-tmax">8-second max</div>}
              </button>
            );
          })}
        </div>

        <button type="button" className="vg-gen" onClick={handleGenerate} disabled={!canGenerate}>
          {phase === "starting"
            ? "Starting..."
            : phase === "generating"
            ? "Generating..."
            : `Generate Video - ${cost.toLocaleString()} credits`}
        </button>

        {notEnough && !busy && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#f87171" }}>
            Not enough credits for this option.{" "}
            <button type="button" className="vg-link" onClick={() => router.push("/credits")}>Buy more</button>
          </p>
        )}

        {busy && (
          <div className="vg-loader">
            <div className="vg-ring" />
            <div className="vg-time">{fmt(elapsed)}</div>
            <div className="vg-stage">{stage}</div>
            <div className="vg-bar"><span /></div>
            <p className="vg-hint">This usually takes 2-6 minutes, and can run a little longer at peak times. You can keep this tab open; if you refresh, it will pick right back up.</p>
          </div>
        )}

        {phase === "error" && errorMsg && <div className="vg-err">{errorMsg}</div>}

        {phase === "done" && videoUrl && (
          <div style={{ marginTop: 24 }}>
            <p className="vg-done">Done in {fmt(elapsed)}</p>
            <video className="vg-video" controls src={videoUrl} />
            <div style={{ marginTop: 12 }}>
              <button type="button" className="vg-link" onClick={() => download(videoUrl)}>Download video</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
