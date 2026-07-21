"use client";
import "../spotmint.css";
import { useCallback, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// The Spotmint store: Spotmint-dressed credits page served on
// spotmint.store. Display data below mirrors the server's PRICE_MAP
// in app/(chat)/api/checkout/route.ts - keep them in sync. The
// server's table is what actually charges, so a mismatch here can
// only mislabel, never misbill.

const BUNDLES: { id: string; name: string; price: string; credits: number; badge?: string }[] = [
  { id: "starter", name: "Starter", price: "$5", credits: 220 },
  { id: "power", name: "Power", price: "$15", credits: 800 },
  { id: "pro", name: "Pro", price: "$40", credits: 2400 },
  { id: "premium", name: "Premium", price: "$75", credits: 5000, badge: "Best value for video" },
  { id: "ultra", name: "Ultra", price: "$150", credits: 11750 },
];

export default function SpotmintStorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
      router.push("/register?redirectUrl=/spotmint/credits");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint/credits");
      return;
    }
    loadCredits();
  }, [session, status, router, loadCredits]);

  useEffect(() => {
    // Back from a completed Stripe checkout: show the note and give the
    // webhook a moment to land the credits, refreshing a couple times.
    if (window.location.search.includes("success=1")) {
      setJustPaid(true);
      const t1 = setTimeout(loadCredits, 2000);
      const t2 = setTimeout(loadCredits, 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [loadCredits]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadCredits();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadCredits]);

  async function handleBuy(bundleId: string) {
    setLoading(bundleId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: bundleId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setLoading(null);
    } catch {
      setLoading(null);
    }
  }

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
        <div className="sp-credits">{credits === null ? "..." : credits.toLocaleString()} credits</div>
      </div>
      <p className="sp-tag">Credits power every ad you create</p>

      {justPaid && (
        <p className="sp-done">Payment received - your credits are being added to your balance.</p>
      )}

      <label className="sp-label">Choose a pack</label>
      <div className="sp-tiers">
        {BUNDLES.map((b) => (
          <button
            key={b.id}
            type="button"
            className="sp-tier"
            onClick={() => handleBuy(b.id)}
            disabled={loading !== null}
          >
            <div>
              <div className="sp-tn">{b.name}</div>
              <p className="sp-td">
                {b.credits.toLocaleString()} credits{b.badge ? ` - ${b.badge}` : ""}
              </p>
            </div>
            <div className="sp-tc">{loading === b.id ? "..." : b.price}</div>
          </button>
        ))}
      </div>
      <p className="sp-hint">Checkout is handled securely by Stripe. Credits land on your account within seconds of payment.</p>

      <div className="sp-foot">
        <button type="button" className="sp-acct" onClick={() => setShowAccount(true)} aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
          </svg>
        </button>
      </div>

      {showAccount && (
        <div className="sp-mask" onClick={() => setShowAccount(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <p className="sp-mt">Account</p>
            <p className="sp-mm">Signed in as <em>{session?.user?.email}</em></p>
            <div className="sp-mrow">
              <button type="button" className="sp-mbtn" onClick={() => setShowAccount(false)}>Close</button>
              <button type="button" className="sp-mbtn" onClick={() => signOut({ redirectTo: "/spotmint/credits" })}>Log out</button>
            </div>
          </div>
        </div>
      )}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/credits/page.tsx (v2 - account button)
// If you can see this comment, the paste was not truncated.
// ============================================================
