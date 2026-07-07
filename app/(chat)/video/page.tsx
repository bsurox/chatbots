"use client";
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

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function triggerDownload(url: string) {
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

  // loading-sequence state
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumedRef = useRef(false);

  // auth / guest guard (mirrors the credits page)
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/video");
      return;
    }
    const isGuest = /^guest-\d+$/.test(session.user.email ?? "");
    if (isGuest) {
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
        const res = await fetch(
          `/api/video/status?requestId=${encodeURIComponent(requestId)}`
        );
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
          setErrorMsg(
            data.error || "Generation failed. Your credits were refunded."
          );
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

  // load balance + resume any in-flight job after a refresh
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

  // live elapsed timer while a job is in flight
  useEffect(() => {
    if ((phase === "generating" || phase === "starting") && startedAt) {
      const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, [phase, startedAt]);

  // cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  if (status === "loading") {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }

  const isGuest = /^guest-\d+$/.test(session?.user?.email ?? "");
  if (!session?.user || isGuest) {
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
    if (elapsed < 6) stage = "Queued - reserving a spot...";
    else if (elapsed < 20) stage = "Warming up the model...";
    else if (elapsed < 75) stage = "Rendering frames...";
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
        body: JSON.stringify({
          prompt: prompt.trim(),
          tier: tierId,
          length: effectiveSeconds,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.requestId) {
        setErrorMsg(data.error || "Could not start generation.");
        setPhase("error");
        loadCredits();
        return;
      }
      if (typeof data.credits === "number") setCredits(data.credits);
      localStorage.setItem(
        JOB_KEY,
        JSON.stringify({ requestId: data.requestId, startedAt: started })
      );
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
      <style>{`
        .video-tiers {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .video-tiers { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .video-tiers { grid-template-columns: 1fr; }
        }
        @keyframes ae-spin { to { transform: rotate(360deg); } }
        @keyframes ae-indeterminate {
          0% { left: -40%; }
          100% { left: 100%; }
        }
        @keyframes ae-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .video-loader {
          margin-top: 24px;
          padding: 30px 24px;
          border-radius: 14px;
          border: 1px solid #2a2a2a;
          background: linear-gradient(180deg, #121212, #0d0d0d);
          text-align: center;
          animation: ae-fade 0.3s ease;
        }
        .video-loader-ring {
          width: 46px; height: 46px;
          border-radius: 50%;
          border: 3px solid #222;
          border-top-color: #22c55e;
          animation: ae-spin 0.9s linear infinite;
          margin: 0 auto 18px;
        }
        .video-loader-time {
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          font-variant-numeric: tabular-nums;
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 6px;
        }
        .video-loader-stage {
          font-size: 14px;
          color: #22c55e;
          font-weight: 600;
          margin-bottom: 18px;
        }
        .video-loader-bar {
          position: relative;
          height: 6px;
          border-radius: 999px;
          background: #1a1a1a;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .video-loader-bar span {
          position: absolute;
          top: 0; bottom: 0;
          width: 40%;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          animation: ae-indeterminate 1.4s ease-in-out infinite;
        }
        .video-loader-hint {
          font-size: 13px;
          color: #777;
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
          Video Generator
        </h1>
        <p style={{ color: "#888", marginBottom: 4 }}>
          Turn a prompt into a short video. Generation is async and can take a
          few minutes.
        </p>
        <p style={{ color: "#888", marginBottom: 28, fontSize: 14 }}>
          Balance:{" "}
          <span style={{ color: "#22c55e", fontWeight: 600 }}>
            {credits === null ? "..." : credits.toLocaleString()} credits
          </span>
        </p>

        {/* Prompt */}
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon hummingbird flying through a rainy Tokyo street at night, cinematic..."
          rows={3}
          disabled={busy}
          style={{
            width: "100%",
            resize: "vertical",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 10,
            padding: "12px 14px",
            fontSize: 14,
            fontFamily: "inherit",
            marginBottom: 24,
            boxSizing: "border-box",
            opacity: busy ? 0.6 : 1,
          }}
        />

        {/* Length */}
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Length
        </label>
        {isFixed ? (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "2px solid #22c55e",
              }}
            >
              8 seconds
            </div>
            <p style={{ color: "#777", fontSize: 13, marginTop: 8, marginBottom: 0 }}>
              Cinematic renders a single 8-second
