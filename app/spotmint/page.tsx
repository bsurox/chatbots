"use client";
import "./spotmint.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GemIcon } from "@/components/chat/gem-icon";
import { BRAND } from "./brand";
import { CINEMATIC_PRICING, TIERS, fmt, type AspectRatio, type CinematicSeconds, type Tier } from "../(chat)/video/video-config";

// Spotmint: the focused ad maker. Same engine, same prices, same
// credits as /video - this surface just speaks to business owners
// making ads. Vertical starts selected because ads live on Reels.

const FORMATS: { id: AspectRatio; label: string; hint: string }[] = [
  { id: "9:16", label: "Vertical", hint: "Reels, TikTok, Stories" },
  { id: "16:9", label: "Widescreen", hint: "YouTube, websites" },
];

export default function SpotmintPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [tierId, setTierId] = useState<Tier["id"]>("premium");
  const [length, setLength] = useState<5 | 10>(5);
  const [cineSeconds, setCineSeconds] = useState<CinematicSeconds>(8);
  const [cineAudio, setCineAudio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [credits, setCredits] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "starting" | "generating" | "done" | "error">("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [isApp, setIsApp] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const [saveLabel, setSaveLabel] = useState("Save");

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumedRef = useRef(false);
  const lastUserRef = useRef<string | null>(null);

  // Inside the wrapped app, Capacitor injects window.Capacitor.
  // When present we hide every credit-purchase link so the app
  // stays commission-free on both stores.
  useEffect(() => {
    if ((window as { Capacitor?: unknown }).Capacitor) {
      setIsApp(true);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/spotmint");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint");
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
          localStorage.removeItem(BRAND.jobKey);
          return;
        }
        if (data.status === "failed") {
          setErrorMsg(data.error || "Generation failed. Your credits were refunded.");
          setPhase("error");
          setStatusLabel(null);
          localStorage.removeItem(BRAND.jobKey);
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

  // Credits: re-fetch whenever the signed-in identity changes (the app
  // logs in mid-session while this page instance survives navigation),
  // and whenever the app returns to the foreground - which is also what
  // updates the balance after buying on the web and coming back.
  useEffect(() => {
    const email = session?.user?.email ?? null;
    if (!email || /^guest-\d+$/.test(email)) return;
    if (lastUserRef.current !== email) {
      lastUserRef.current = email;
      loadCredits();
    }
  }, [session, loadCredits]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && lastUserRef.current) loadCredits();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadCredits]);

  useEffect(() => {
    if (!session?.user || resumedRef.current) return;
    resumedRef.current = true;
    const saved = localStorage.getItem(BRAND.jobKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.requestId) {
          setStartedAt(parsed.startedAt || Date.now());
          setPhase("generating");
          poll(parsed.requestId);
        }
      } catch {
        localStorage.removeItem(BRAND.jobKey);
      }
    }
  }, [session, poll]);

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
    return <div className="sp-wrap"><p style={{ color: "#888" }}>Loading...</p></div>;
  }
  if (!session?.user || /^guest-\d+$/.test(session?.user?.email ?? "")) {
    return null;
  }

  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[0];
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
  const canGenerate = prompt.trim().length > 0 && !busy;

  let stage = statusLabel;
  if (!stage) {
    if (elapsed < 8) stage = "Queued - reserving a spot...";
    else if (elapsed < 40) stage = "Warming up the model...";
    else if (elapsed < 240) stage = "Rendering your ad...";
    else stage = "Finalizing your ad...";
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    if (notEnough) {
      setShowCreditsModal(true);
      return;
    }
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
        setErrorMsg(data.error || "Could not start your ad.");
        setPhase("error");
        loadCredits();
        return;
      }
      if (typeof data.credits === "number") setCredits(data.credits);
      localStorage.setItem(BRAND.jobKey, JSON.stringify({ requestId: data.requestId, startedAt: started }));
      setPhase("generating");
      poll(data.requestId);
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setPhase("error");
      loadCredits();
    }
  }

  async function saveVideo(url: string) {
    if (saveLabel !== "Save") return;
    setSaveLabel("Preparing...");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      const blob = await res.blob();
      const file = new File([blob], "spotmint-ad.mp4", { type: blob.type || "video/mp4" });
      if (isApp) {
        // WKWebView has no download manager, so browser-style downloads
        // are silent no-ops inside the app. The native share sheet with
        // the actual file is the real path: it offers Save Video (to
        // Photos) and Save to Files - exactly the two options we want.
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          setSaveLabel("Saved");
        } else {
          throw new Error("file share unavailable");
        }
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "spotmint-ad.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        setSaveLabel("Saved");
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        setSaveLabel("Save");
        return;
      }
      if (!isApp) {
        window.open(url, "_blank");
        setSaveLabel("Save");
        return;
      }
      setSaveLabel("Save failed");
    }
    setTimeout(() => setSaveLabel("Save"), 2200);
  }

  async function shareVideo(url: string) {
    try {
      if (navigator.share) {
        await navigator.share({ title: BRAND.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
      setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      // user cancelled the share sheet - nothing to do
    }
  }

  return (
    <div className={isCinematic ? "sp-wrap" : "sp-wrap sp-roomy"}>
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span><GemIcon className="sp-gemlogo" /></div>
        <div className="sp-credits">{credits === null ? "..." : credits.toLocaleString()} credits</div>
      </div>
      <p className="sp-tag">{BRAND.tagline}</p>

      <label className="sp-label">Describe your ad</label>
      <textarea
        className="sp-ta"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={BRAND.promptPlaceholder}
        rows={2}
        disabled={busy}
      />

      <label className="sp-label">Length</label>
      {isCinematic ? (
        <div style={{ marginBottom: 22 }}>
          <div className="sp-seg">
            {CINEMATIC_PRICING.map((row) => (
              <button
                key={row.seconds}
                type="button"
                className={cineSeconds === row.seconds ? "on" : undefined}
                onClick={() => setCineSeconds(row.seconds)}
                disabled={busy}
              >
                {row.seconds}s
              </button>
            ))}
          </div>
          <label className="sp-label">Sound</label>
          <div className="sp-seg">
            <button type="button" className={cineAudio ? "on" : undefined} onClick={() => setCineAudio(true)} disabled={busy}>
              Sound on - {cineRow.audio.toLocaleString()}
            </button>
            <button type="button" className={!cineAudio ? "on" : undefined} onClick={() => setCineAudio(false)} disabled={busy}>
              Sound off - {cineRow.silent.toLocaleString()}
            </button>
          </div>
        </div>
      ) : (
        <div className="sp-seg">
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

      <label className="sp-label">Quality</label>
      <div className="sp-tiers">
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
              className={t.id === tierId ? "sp-tier on" : "sp-tier"}
              onClick={() => setTierId(t.id)}
              disabled={busy}
            >
              <div>
                <div className="sp-tn">{t.name}</div>
                <p className="sp-td">{t.desc}</p>
              </div>
              <div className="sp-tc">{tCost.toLocaleString()} cr</div>
            </button>
          );
        })}
      </div>

      <label className="sp-label">Format</label>
      <div className="sp-formats">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={f.id === aspectRatio ? "sp-fmt on" : "sp-fmt"}
            onClick={() => setAspectRatio(f.id)}
            disabled={busy}
          >
            <div className="sp-fn">{f.label}</div>
            <p className="sp-fd">{f.hint}</p>
          </button>
        ))}
      </div>

      <button type="button" className="sp-gen" onClick={handleGenerate} disabled={!canGenerate}>
        {phase === "starting" ? "Starting..." : phase === "generating" ? "Creating your ad..." : `Create my ad - ${cost.toLocaleString()} credits`}
      </button>

      {busy && (
        <div className="sp-loader">
          <div className="sp-ring" />
          <div className="sp-time">{fmt(elapsed)}</div>
          <div className="sp-stage">{stage}</div>
          <div className="sp-bar"><span /></div>
          <p className="sp-hint">Ads usually take 2-6 minutes. You can close this and come back - your ad keeps rendering and will be waiting here.</p>
        </div>
      )}

      {phase === "error" && errorMsg && <div className="sp-err">{errorMsg}</div>}

      {phase === "done" && videoUrl && (
        <div style={{ marginTop: 22 }}>
          <p className="sp-done">Done in {fmt(elapsed)}</p>
          <video className="sp-video" controls playsInline src={videoUrl} />
          <div className="sp-actions">
            <button type="button" className="sp-act" onClick={() => saveVideo(videoUrl)}>{saveLabel}</button>
            <button type="button" className="sp-act" onClick={() => shareVideo(videoUrl)}>{shareLabel}</button>
          </div>
        </div>
      )}

      {showCreditsModal && (
        <div className="sp-mask" onClick={() => setShowCreditsModal(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <p className="sp-mt">Not enough credits</p>
            <p className="sp-mm">
              This option costs {cost.toLocaleString()} credits and your balance is {(credits ?? 0).toLocaleString()}.
              {isApp ? <> Credits can be purchased at <em>{BRAND.storeDomain}</em>.</> : <> Top up and your new balance shows here right away.</>}
            </p>
            <div className="sp-mrow">
              <button type="button" className="sp-mbtn" onClick={() => setShowCreditsModal(false)}>Close</button>
              {!isApp && (
                <button type="button" className="sp-mbtn primary" onClick={() => router.push("/credits")}>Buy credits</button>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/page.tsx (v6 - shell cleanup)
// If you can see this comment, the paste was not truncated.
// ============================================================
