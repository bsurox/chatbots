// FILE: app/foremanprep/analytics.tsx
"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ForemanPrep ad measurement (v2). Loads the Google Ads tag and the
// Meta pixel ONLY when the page is served on foremanprep.com - the
// same island pages viewed through askevo.ai stay untracked, so ad
// data never mixes across brands. Both loaders queue events until
// the real scripts arrive, and the helpers below self-initialize,
// so a conversion fired early in a page's life is never lost.
// The price riding on Meta events reads the clock (v2): $99 until
// Sept 7, 2026, 11:59 PM Mountain (= Sept 8 05:59 UTC), $149 from
// that moment - same PRICE_FLIP_MS constant as checkout v5 and
// landing v14, evaluated at event time so no edit is needed at the
// flip. ONE thing stays manual: the fixed $99 value inside the
// Google Ads conversion SETTING lives in their dashboard - edit it
// to $149 on Sept 8. PageView re-fires on route changes so
// Meta sees real browsing, not just the landing hit.

const GOOGLE_TAG_ID = "AW-18382529129";
const GOOGLE_PURCHASE_LABEL = "kXy2CObaw98cEOnEvL1E";
const META_PIXEL_ID = "3451854201639118";
const EARLY_PRICE_USD = 99.0;
const REGULAR_PRICE_USD = 149.0;
// Sept 7, 2026, 11:59 PM MDT (UTC-6) = Sept 8, 05:59 UTC.
// Month index 8 = September.
const PRICE_FLIP_MS = Date.UTC(2026, 8, 8, 5, 59, 0);

function priceUsd(): number {
  return Date.now() < PRICE_FLIP_MS ? EARLY_PRICE_USD : REGULAR_PRICE_USD;
}

function isForemanHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return host === "foremanprep.com" || host === "www.foremanprep.com";
}

function loadGoogle(): void {
  const w = window as any;
  if (w.gtag) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GOOGLE_TAG_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GOOGLE_TAG_ID;
  document.head.appendChild(s);
}

function loadMeta(): void {
  const w = window as any;
  if (w.fbq) return;
  const q: any = function () {
    if (q.callMethod) {
      q.callMethod.apply(q, arguments);
    } else {
      q.queue.push(arguments);
    }
  };
  w.fbq = q;
  if (!w._fbq) w._fbq = q;
  q.push = q;
  q.loaded = true;
  q.version = "2.0";
  q.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  w.fbq("init", META_PIXEL_ID);
  w.fbq("track", "PageView");
}

function ensureLoaded(): boolean {
  if (!isForemanHost()) return false;
  loadGoogle();
  loadMeta();
  return true;
}

export function fpTrackBeginCheckout(): void {
  if (!ensureLoaded()) return;
  const w = window as any;
  w.fbq("track", "InitiateCheckout", { value: priceUsd(), currency: "USD" });
}

export function fpTrackPurchase(transactionId: string): void {
  if (!ensureLoaded()) return;
  const w = window as any;
  w.gtag("event", "conversion", {
    send_to: GOOGLE_TAG_ID + "/" + GOOGLE_PURCHASE_LABEL,
    transaction_id: transactionId,
  });
  w.fbq("track", "Purchase", { value: priceUsd(), currency: "USD" });
}

export default function FpAnalytics() {
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    ensureLoaded();
  }, []);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (!isForemanHost()) return;
    const w = window as any;
    if (w.gtag) w.gtag("config", GOOGLE_TAG_ID, { page_path: pathname });
    if (w.fbq) w.fbq("track", "PageView");
  }, [pathname]);

  return null;
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/analytics.tsx (v2 - event values
// flip themselves to $149 at Sept 7, 11:59 PM MDT)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
