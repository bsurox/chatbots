"use client";
import "./video.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToolHeader } from "@/components/chat/tool-header";
import { ASPECT_RATIOS, CINEMATIC_PRICING, type CinematicSeconds, DEFAULT_ASPECT_RATIO, download, fmt, JOB_KEY, TIERS, type AspectRatio, type Tier } from "./video-config";

export default function VideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [tierId, setTierId] = useState<Tier["id"]>("standard");
  const [length, setLength] = useState<5 | 10>(5);
  const [cineSeconds, setCineSeconds] = useState<CinematicSeconds>(8);
  const [cineAudio, setCineAudio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(DEFAULT_ASPECT_RATIO);
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

  // AdReel promo preselect: URL params, with a one-shot localStorage
  // fallback set at registration (survives redirects that strip params).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    let t = p.get("tier");
    let d = p.get("duration");
    try {
      if (!t) {
        const saved = JSON.parse(localStorage.getItem("askevo_preselect") || "null");
        if (saved) {
          t = saved.tier;
          d = String(saved.duration);
        }
      }
      localStorage.removeItem("askevo_preselect");
    } catch {
      // ignore
    }
    if (t === "fast" || t === "standard" || t === "premium" || t === "cinematic") setTierId(t);
    if (d === "5") setLength(5);
    if (d === "10") setLength(10);
  }, []);

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
  const isCinematic = tierId === "cinematic";
  const cineRow = CINEMATIC_PRICING.find((r) => r.seconds === cineSeconds) ?? CINEMATIC_PRICING[CINEMATIC_PRICING.length - 1];
  const effectiveSeconds = isCinematic ? cineRow.seconds : length;
  const cost = isCinematic
    ? (cineAudio ? cineRow.audio : cineRow.silent)
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
        body: JSON.stringify({ prompt: prompt.trim(), tier: tierId, length: effectiveSeconds, aspectRatio, audio: isCinematic ? cineAudio : undefined }),
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
        {isCinematic ? (
          <div style={{ marginBottom: 24 }}>
            <div className="vg-len">
              {CINEMATIC_PRICING.map((row) => (
                <button
                  key={row.seconds}
                  type="button"
                  className={cineSeconds === row.seconds ? "on" : undefined}
                  onClick={() => setCineSeconds(row.seconds)}
                  disabled={busy}
                >
                  {row.seconds} seconds
                </button>
              ))}
            </div>
            <label className="vg-label">Sound</label>
            <div className="vg-len">
              <button
                type="button"
                className={cineAudio ? "on" : undefined}
                onClick={() => setCineAudio(true)}
                disabled={busy}
              >
                Sound on - {cineRow.audio.toLocaleString()} credits
              </button>
              <button
                type="button"
                className={!cineAudio ? "on" : undefined}
                onClick={() => setCineAudio(false)}
                disabled={busy}
              >
                Sound off - {cineRow.silent.toLocaleString()} credits
              </button>
            </div>
            <p className="vg-note">Cinematic runs Veo 3.1. Sound on generates native audio and dialogue; sound off costs less.</p>
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
            const tCost = t.id === "cinematic"
              ? (cineAudio ? cineRow.audio : cineRow.silent)
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
                {t.id === "cinematic" && <div className="vg-tmax">4-8s, sound optional</div>}
              </button>
            );
          })}
        </div>

        <label className="vg-label">Format</label>
        <div className="vg-tiers">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={r.id === aspectRatio ? "vg-tier on" : "vg-tier"}
              onClick={() => setAspectRatio(r.id)}
              disabled={busy}
            >
              <div className="vg-tn">{r.label}</div>
              <div className="vg-td">{r.hint}</div>
            </button>
          ))}
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

// END OF FILE - app/(chat)/video/page.tsx (v5 - cinematic controls)
// If you can see this line after pasting, the whole file made it.
