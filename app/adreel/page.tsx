"use client";
import "./adreel.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEMOS = ["/adreel/demo1.mp4", "/adreel/demo2.mp4", "/adreel/demo3.mp4"];

export default function AdReelPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const [claimUrl, setClaimUrl] = useState("");

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
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, business, source: "adreel-landing" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      const url = "/register?promo=adreel&email=" + encodeURIComponent(cleanEmail);
      setClaimUrl(url);
      setState("done");
      router.push(url);
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
          First AI video ad is free. <span className="ar-grad">Start creating in under a minute.</span>
        </h1>
        <p className="ar-sub">
          Sign up free and get 250 video credits instantly - enough to create one
          premium AI video ad with sound for your business. Built for TikTok,
          Reels, and Shorts. No videographer, no editing, no card required.
        </p>

        {state === "done" ? (
          <div style={{ marginBottom: 60 }}>
            <p className="ar-ok">You are in! Your 250 free credits are attached to your email.</p>
            <p className="ar-note">Taking you to create your account and claim them...</p>
            <button className="ar-btn" type="button" onClick={() => router.push(claimUrl)}>
              Continue
            </button>
          </div>
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
                {state === "sending" ? "Working..." : "Get my free video ad"}
              </button>
            </div>
            <p className="ar-note">Free signup = 250 credits instantly, enough for one premium video ad with audio. No card required.</p>
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
            <div className="ar-step-t">Sign up free</div>
            <div className="ar-step-d">Enter your email and create your account. 250 video credits are applied instantly.</div>
          </div>
          <div className="ar-step">
            <div className="ar-step-n">STEP 2</div>
            <div className="ar-step-t">Describe your product</div>
            <div className="ar-step-d">Tell the AI what you sell in a sentence or two. It builds a short, high-energy video ad with sound.</div>
          </div>
          <div className="ar-step">
            <div className="ar-step-n">STEP 3</div>
            <div className="ar-step-t">Download and post</div>
            <div className="ar-step-d">Grab your video and publish to TikTok, Reels, or Shorts. Ready to post the same day.</div>
          </div>
        </div>

        <div className="ar-foot">
          AdReel is powered by AskEvo LLC. Questions or need help? Contact support@askevo.ai
          <div style={{ marginTop: 10 }}>
            <Link
              href="/privacy"
              rel="noopener noreferrer"
              style={{ color: "#a3a3a3", textDecoration: "underline" }}
              target="_blank"
            >
              Privacy Policy
            </Link>
            <span style={{ margin: "0 10px", color: "#525252" }}>|</span>
            <Link
              href="/terms"
              rel="noopener noreferrer"
              style={{ color: "#a3a3a3", textDecoration: "underline" }}
              target="_blank"
            >
              Terms of Service
            </Link>
          </div>
        </div>
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

// -----------------------------------------------------------
// END OF FILE - app/adreel/page.tsx (v5 - instant redirect)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
