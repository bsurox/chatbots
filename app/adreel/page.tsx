"use client";
import "./adreel.css";
import { useEffect, useRef, useState } from "react";

const DEMOS = ["/adreel/demo1.mp4", "/adreel/demo2.mp4", "/adreel/demo3.mp4"];

export default function AdReelPage() {
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const [playing, setPlaying] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === playing && lightbox === null) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [playing, lightbox]);

  async function submit() {
    if (state === "sending") return;
    setErrMsg("");
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, business, source: "adreel-landing" }),
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

  return (
    <div className="ar-page">
      <div className="ar-wrap">
        <div className="ar-badge">Early Access</div>
        <h1 className="ar-h1">
          AI video ads for your business. <span className="ar-grad">In minutes, not weeks.</span>
        </h1>
        <p className="ar-sub">
          AdReel turns a one-line description of your product into a scroll-stopping
          short video ad for TikTok, Reels, and Shorts. No videographer, no editing,
          no experience needed.
        </p>

        {state === "done" ? (
          <p className="ar-ok">You are on the list! We will email you when early access opens.</p>
        ) : (
          <div style={{ marginBottom: 60 }}>
            <div className="ar-form">
              <input
                className="ar-input"
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "sending"}
              />
              <select
                className="ar-select"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                disabled={state === "sending"}
              >
                <option value="">What do you sell?</option>
                <option value="ecommerce">Online store / e-commerce</option>
                <option value="restaurant">Restaurant / food</option>
                <option value="realestate">Real estate</option>
                <option value="services">Local services</option>
                <option value="other">Something else</option>
              </select>
              <button className="ar-btn" type="button" onClick={submit} disabled={state === "sending"}>
                {state === "sending" ? "Joining..." : "Join the waitlist"}
              </button>
            </div>
            <p className="ar-note">Early access pricing: $19/mo, locked in for waitlist members. No card required today.</p>
            {state === "error" && <p className="ar-err">{errMsg}</p>}
          </div>
        )}

        <h2 className="ar-h2">Made with AdReel</h2>
        <div className="ar-vids">
          {DEMOS.map((src, i) => (
            <div
              key={src}
              className={i === playing ? "ar-vidbox on" : "ar-vidbox"}
              onClick={() => setLightbox(i)}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                className="ar-vid"
                src={src}
                muted
                playsInline
                preload="auto"
                onEnded={() => {
                  if (i === playing) setPlaying((p) => (p + 1) % DEMOS.length);
                }}
              />
              <div style={{ position: "absolute", bottom: 10, right: 10, width: 32, height: 32, background: "rgba(0,0,0,0.65)", borderRadius: 8 }}>
                <div style={{ position: "absolute", top: 8, left: 8, width: 8, height: 8, borderTop: "2px solid #fff", borderLeft: "2px solid #fff" }} />
                <div style={{ position: "absolute", bottom: 8, right: 8, width: 8, height: 8, borderBottom: "2px solid #fff", borderRight: "2px solid #fff" }} />
              </div>
            </div>
          ))}
        </div>

        <h2 className="ar-h2">How it works</h2>
        <div className="ar-steps">
          <div className="ar-step">
            <div className="ar-step-n">STEP 1</div>
            <div className="ar-step-t">Describe your product</div>
            <div className="ar-step-d">One sentence about what you sell. That is all AdReel needs.</div>
          </div>
          <div className="ar-step">
            <div className="ar-step-n">STEP 2</div>
            <div className="ar-step-t">AI builds your ad</div>
            <div className="ar-step-d">A short, high-energy video ad designed for TikTok, Reels, and Shorts.</div>
          </div>
          <div className="ar-step">
            <div className="ar-step-n">STEP 3</div>
            <div className="ar-step-t">Post it and grow</div>
            <div className="ar-step-d">Download in vertical format, ready to publish. New ad whenever you want one.</div>
          </div>
        </div>

        <div className="ar-price">
          <div className="ar-price-n">$19/mo</div>
          <div className="ar-price-s">Early access price for waitlist members. Cancel anytime.</div>
        </div>

        <div className="ar-foot">AdReel is powered by AskEvo. Questions? hello@askevo.ai</div>
      </div>

      {lightbox !== null && (
        <div className="ar-lb" onClick={() => setLightbox(null)}>
          <video
            className="ar-lbvid"
            src={DEMOS[lightbox]}
            autoPlay
            controls
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
          <div className="ar-lbclose">Click outside the video to close</div>
        </div>
      )}
    </div>
  );
}
