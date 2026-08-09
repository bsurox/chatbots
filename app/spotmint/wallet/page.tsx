// FILE: app/spotmint/wallet/page.tsx
"use client";
import "../spotmint.css";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Credits tab (car four of the shell train). v6 = In-App Purchase,
// born from Apple's second 3.1.1 rejection (IAP parity required).
// iOS: the five credit packs sell through Apple via the RevenueCat
// Capacitor plugin, reached through the runtime bridge
// (window.Capacitor.Plugins.Purchases) so this web repo needs no
// plugin dependency. Fulfillment: RevenueCat webhook -> /api/iap ->
// credits on the account. The web link-out stays BELOW the packs
// with the honest steering pitch (cheaper + 10% bonus on the web),
// which the US storefront rules allow next to IAP. Old builds
// without the plugin fall back to the v2 link-out automatically.
// ANDROID keeps the v1 inert copy (Google forbids steering). Web
// keeps its in-site Buy button. Balance refreshes on foreground.

const RC_API_KEY = "appl_TRYloIhCBQnCvVvZLqOXSVlepRu";

const IAP_PACKS: { id: string; name: string; credits: number }[] = [
  { id: "com.askevo.spotmint.credits.starter", name: "Starter", credits: 220 },
  { id: "com.askevo.spotmint.credits.power2", name: "Power", credits: 800 },
  { id: "com.askevo.spotmint.credits.pro", name: "Pro", credits: 2400 },
  { id: "com.askevo.spotmint.credits.premium", name: "Premium", credits: 5000 },
  { id: "com.askevo.spotmint.credits.ultra", name: "Ultra", credits: 11750 },
];

type RcProduct = { identifier: string; priceString: string };
type RcPlugin = {
  configure: (opts: { apiKey: string; appUserID: string }) => Promise<void>;
  getProducts: (opts: { productIdentifiers: string[] }) => Promise<{ products: RcProduct[] }>;
  purchaseStoreProduct: (opts: { product: RcProduct }) => Promise<unknown>;
};

function getPurchasesBridge(): RcPlugin | null {
  // v4: modern Capacitor plugins are not always pre-listed on
  // Capacitor.Plugins - the JS proxy normally gets created by the
  // plugin's own npm package, which this web repo deliberately never
  // imports. registerPlugin on the runtime builds the proxy for the
  // NATIVE plugin on demand, so we try the legacy registry first and
  // then register the proxy ourselves.
  const cap = (window as { Capacitor?: { Plugins?: { Purchases?: RcPlugin }; registerPlugin?: (name: string) => RcPlugin } }).Capacitor;
  if (!cap) return null;
  if (cap.Plugins?.Purchases) return cap.Plugins.Purchases;
  try {
    return cap.registerPlugin ? cap.registerPlugin("Purchases") : null;
  } catch {
    return null;
  }
}

export default function SpotmintWalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [isApp, setIsApp] = useState(false);
  const [isAndroidApp, setIsAndroidApp] = useState(false);
  const [iapProducts, setIapProducts] = useState<RcProduct[] | null>(null);
  const [buying, setBuying] = useState<string | null>(null);
  const [iapMsg, setIapMsg] = useState<string | null>(null);

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

  // iOS only: wake RevenueCat through the native bridge and fetch the
  // five packs with Apple's own localized prices. Missing bridge
  // (old build, Android, web) leaves iapProducts null and the page
  // falls back to the link-out.
  useEffect(() => {
    const email = session?.user?.email ?? "";
    if (!isApp || isAndroidApp || !email || /^guest-\d+$/.test(email)) return;
    const rc = getPurchasesBridge();
    if (!rc) return;
    let cancelled = false;
    (async () => {
      try {
        await rc.configure({ apiKey: RC_API_KEY, appUserID: email });
        const res = await rc.getProducts({ productIdentifiers: IAP_PACKS.map((p) => p.id) });
        if (!cancelled && res.products.length > 0) {
          setIapProducts(res.products);
        } else if (!cancelled) {
          setIapMsg("Credit packs are temporarily unavailable here - the web store below has you covered.");
        }
      } catch {
        // bridge exists but store fetch failed - link-out fallback stands
        if (!cancelled) {
          setIapMsg("Credit packs are temporarily unavailable here - the web store below has you covered.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isApp, isAndroidApp, session]);

  async function buyPack(productId: string) {
    if (buying) return;
    const rc = getPurchasesBridge();
    const product = iapProducts?.find((p) => p.identifier === productId);
    if (!rc || !product) return;
    setBuying(productId);
    setIapMsg(null);
    try {
      await rc.purchaseStoreProduct({ product });
      setIapMsg("Purchase complete - your credits are being added.");
      setTimeout(loadCredits, 2000);
      setTimeout(loadCredits, 6000);
      setTimeout(loadCredits, 12000);
    } catch (err) {
      if (!(err as { userCancelled?: boolean })?.userCancelled) {
        setIapMsg("Purchase did not go through. You were not charged beyond what Apple shows.");
      }
    }
    setBuying(null);
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
          {iapMsg && (
            <p className="sp-done" style={{ marginTop: 18 }}>{iapMsg}</p>
          )}
          {iapProducts !== null && (
            <div className="sp-tiers" style={{ marginTop: 18 }}>
              {IAP_PACKS.map((pack) => {
                const product = iapProducts.find((p) => p.identifier === pack.id);
                if (!product) return null;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    className="sp-tier sp-pack"
                    style={{ borderColor: "#262626", background: "#111214" }}
                    onClick={() => buyPack(pack.id)}
                    disabled={buying !== null}
                  >
                    <div>
                      <div className="sp-tn">{pack.name}</div>
                      <p className="sp-td">{pack.credits.toLocaleString()} credits</p>
                    </div>
                    <div className="sp-tc">{buying === pack.id ? "..." : product.priceString}</div>
                  </button>
                );
              })}
            </div>
          )}
          <button
            type="button"
            className="sp-gen"
            style={{ marginTop: 22 }}
            onClick={() => window.open("https://" + BRAND.storeDomain, "_blank")}
          >
            {iapProducts !== null ? "Purchase on the web store for less" : "Buy credits"}
          </button>
          <p className="sp-mm" style={{ textAlign: "center", marginTop: 14 }}>
            {iapProducts !== null
              ? "Same packs, lower prices, plus 10% bonus credits at " + BRAND.storeDomain + " - opens in your browser, same account."
              : "Opens " + BRAND.storeDomain + " in your browser. Sign in with this same account - your new balance shows up here right away."}
          </p>
        </>
      ) : (
        <>
          <button type="button" className="sp-gen" style={{ marginTop: 22 }} onClick={() => router.push("/spotmint/credits")}>
            Buy credits
          </button>
        </>
      )}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/wallet/page.tsx (v6 - quiet pack boxes + clearer steering label)
// If you can see this comment, the paste was not truncated.
// ============================================================
