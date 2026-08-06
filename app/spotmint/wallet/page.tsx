// FILE: app/spotmint/wallet/page.tsx
"use client";
import "../spotmint.css";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Credits tab (car four of the shell train). v2 platform split,
// born from Apple's 3.1.3(b) rejection: the 2025 US-storefront rules
// allow real link-outs to the default browser, so the iOS app now
// shows an honest "Buy credits" button that opens the store in
// Safari - no commission, fully compliant. Google Play permits no
// such steering, so the ANDROID app keeps the v1 inert copy that
// only names the store. The web keeps its in-site Buy button.
// Balance refreshes on foreground, so buying in Safari and hopping
// back into the app shows the new number immediately.

export default function SpotmintWalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [isApp, setIsApp] = useState(false);
  const [isAndroidApp, setIsAndroidApp] = useState(false);

  useEffect(() => {
    if ((window as { Capacitor?: unknown }).Capacitor) {
      setIsApp(true);
      if (/Android/i.test(navigator.userAgent)) {
        setIsAndroidApp(true);
      }
    }
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

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/spotmint/wallet");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint/wallet");
      return;
    }
    loadCredits();
  }, [session, status, router, loadCredits]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadCredits();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadCredits]);

  if (status === "loading") {
    return <div className="sp-wrap"><p style={{ color: "#888" }}>Loading...</p></div>;
  }
  if (!session?.user || /^guest-\d+$/.test(session?.user?.email ?? "")) {
    return null;
  }

  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">Your credits</p>

      <div style={{ textAlign: "center", marginTop: 26 }}>
        <div style={{ fontSize: 46, fontWeight: 800, color: "#fff", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {credits === null ? "..." : credits.toLocaleString()}
        </div>
        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: "#22c55e" }}>credits</div>
      </div>

      {isAndroidApp ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <p className="sp-buy">Buy credits at {BRAND.storeDomain}</p>
          </div>
          <p className="sp-mm" style={{ textAlign: "center", marginTop: 14 }}>
            Open {BRAND.storeDomain} in your browser and sign in with this
            same account - your new balance shows up here right away.
          </p>
        </>
      ) : isApp ? (
        <>
          <button
            type="button"
            className="sp-gen"
            style={{ marginTop: 22 }}
            onClick={() => window.open("https://" + BRAND.storeDomain, "_blank")}
          >
            Buy credits
          </button>
          <p className="sp-mm" style={{ textAlign: "center", marginTop: 14 }}>
            Opens {BRAND.storeDomain} in your browser. Sign in with this
            same account - your new balance shows up here right away.
          </p>
        </>
      ) : (
        <button type="button" className="sp-gen" style={{ marginTop: 22 }} onClick={() => router.push("/spotmint/credits")}>
          Buy credits
        </button>
      )}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/wallet/page.tsx (v2 - iOS link-out button)
// If you can see this comment, the paste was not truncated.
// ============================================================
