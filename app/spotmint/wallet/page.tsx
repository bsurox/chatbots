"use client";
import "../spotmint.css";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Credits tab (car four of the shell train). Inside the app this page
// is deliberately inert: it shows the balance and *names* the store -
// no links, no prices, no purchase machinery - which is what keeps
// the app commission-free on both stores. On the web the same page
// gets a real Buy button through to the Spotmint store page. Balance
// refreshes on foreground, so buying in Safari and hopping back into
// the app shows the new number immediately. Reachable only by direct
// URL until app/spotmint/layout.tsx v3 mounts the tab bar.

export default function SpotmintWalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    if ((window as { Capacitor?: unknown }).Capacitor) {
      setIsApp(true);
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
        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>credits</div>
      </div>

      {isApp ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
            <p className="sp-buy">Buy credits at {BRAND.storeDomain}</p>
          </div>
          <p className="sp-mm" style={{ textAlign: "center", marginTop: 14 }}>
            Open {BRAND.storeDomain} in your browser and sign in with this
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
// END OF FILE - app/spotmint/wallet/page.tsx (v1 - credits tab)
// If you can see this comment, the paste was not truncated.
// ============================================================
