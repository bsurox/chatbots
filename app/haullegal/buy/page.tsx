// FILE: app/haullegal/buy/page.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import HlAccountButton from "@/app/haullegal/account-button";
import HlLangToggle from "@/app/haullegal/lang-toggle";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// The HaulLegal storefront (v6 - the floating bottom-left account
// circle (account-button.tsx) joins the page.)
// v5 notes - footer gains the "Account" link, the door to managing
// Stay Legal.
// v4 notes - SPANISH: every string comes from
// lib/haullegal/i18n.ts through the hl-lang switch, the EN / ES
// pill sits in the top bar, and the checkout request now carries
// the language so Stripe's hosted page opens in Spanish too
// (checkout v3 reads it). The Stay Legal card lists Connecticut
// among the by-the-mile states. Prices, products and the
// already-owned logic are unchanged.)
// v3 notes - his spec: the "Includes your first 30 days of Stay
// Legal free" line moves out of the bullet list and sits as a green
// chip right beside the $249, wrapping under it on narrow phones.
// v2 notes - THE FREE MONTH IS IN THE CARD, his spec: the
// walkthrough card says outright that it includes the first 30
// days of Stay Legal, then $39 a month until canceled. Checkout v2
// charges exactly that in one Stripe session. Card 2 (Stay Legal
// alone, $39 a month, no trial) stays for people who only want the
// calendar or who canceled and want back in.
// v1 notes - two cards, both flat, no clock. Doctrine carried over
// from the prep storefronts: signed-out visitors get the auth doors
// first (a purchase must attach to a real account), the checkout
// route is the charge authority and guards double-buying, owners
// see their doors instead of a buy button. No ad-pixel call.
// No Date.now()/Math.random() in render (Next 16 prerender rule).

type Access = { loggedIn: boolean; paid: boolean; sub: boolean };
type Product = "walkthrough" | "staylegal";

export default function HaulLegalBuyPage() {
  const [access, setAccess] = useState<Access | null>(null);
  const [buying, setBuying] = useState<Product | null>(null);
  const [err, setErr] = useState("");
  const [lang] = useHlLang();
  const ui = HL_UI[lang];
  const t = ui.buy;

  useEffect(() => {
    fetch("/haullegal/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAccess({ loggedIn: Boolean(data.loggedIn), paid: Boolean(data.paid), sub: Boolean(data.sub) });
        } else {
          setAccess({ loggedIn: false, paid: false, sub: false });
        }
      })
      .catch(() => setAccess({ loggedIn: false, paid: false, sub: false }));
  }, []);

  async function buy(product: Product) {
    if (buying) return;
    setBuying(product);
    setErr("");
    try {
      const res = await fetch("/haullegal/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, lang }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok && data?.already) {
        setAccess((a) =>
          a ? { ...a, loggedIn: true, paid: product === "walkthrough" ? true : a.paid, sub: product === "staylegal" ? true : a.sub } : a
        );
        setBuying(null);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        setAccess({ loggedIn: false, paid: false, sub: false });
        setBuying(null);
        return;
      }
      setErr(t.err);
      setBuying(null);
    } catch {
      setErr(t.err);
      setBuying(null);
    }
  }

  const doors = (
    <div className="fp-authrow">
      <Link className="fp-authbtn" href="/register">
        {t.doorCreate}
      </Link>
      <Link className="fp-authbtn ghost" href="/login">
        {t.doorHave}
      </Link>
    </div>
  );

  return (
    <div className="fp-wrap">
      <div className="fp-top" style={{ flexWrap: "wrap", gap: "8px" }}>
        <Link className="fp-backpill" href="/haullegal">
          {ui.common.backTo}{" "}
          <span className="fp-wordmark">
            Haul<span>Legal</span>
          </span>
        </Link>
        <HlLangToggle />
      </div>

      <div className="fp-buycard">
        <p className="fp-buyh">{t.walkH}</p>
        <p className="fp-buysub">{t.walkSub}</p>
        <div className="fp-pricebig" style={{ flexWrap: "wrap", rowGap: "8px" }}>
          <span className="fp-pricenow">$249</span>
          <span className="fp-chip" style={{ whiteSpace: "normal", lineHeight: 1.4 }}>
            {t.chip}
          </span>
        </div>
        <p className="fp-pricetag">{t.walkTag}</p>
        <div className="fp-feats">
          {t.walkFeatures.map((f) => (
            <div className="fp-feat" key={f}>
              <b>+</b>
              <span>{f}</span>
            </div>
          ))}
        </div>
        {access === null ? (
          <button className="fp-buybtn" disabled type="button">
            {ui.common.loading}
          </button>
        ) : access.paid ? (
          <div className="fp-owned">
            <p className="fp-ownedh">{t.ownWalk}</p>
            <div className="fp-authrow">
              <Link className="fp-authbtn" href="/haullegal/start">
                {t.openWalk}
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <>
            <button className="fp-buybtn" disabled={buying !== null} onClick={() => buy("walkthrough")} type="button">
              {buying === "walkthrough" ? t.openingCheckout : t.buyWalk}
            </button>
            <p className="fp-buynote">{access.sub ? t.noteSubRunning : t.noteBundle}</p>
          </>
        ) : (
          doors
        )}
      </div>

      <div className="fp-buycard" style={{ marginTop: "18px" }}>
        <p className="fp-buyh">{t.stayH}</p>
        <p className="fp-buysub">{t.staySub}</p>
        <div className="fp-pricebig">
          <span className="fp-pricenow">$39</span>
          <span className="fp-pricewas" style={{ textDecoration: "none" }}>{t.perMonth}</span>
        </div>
        <p className="fp-pricetag">{t.stayTag}</p>
        <div className="fp-feats">
          {t.stayFeatures.map((f) => (
            <div className="fp-feat" key={f}>
              <b>+</b>
              <span>{f}</span>
            </div>
          ))}
        </div>
        {access === null ? (
          <button className="fp-buybtn" disabled type="button">
            {ui.common.loading}
          </button>
        ) : access.sub ? (
          <div className="fp-owned">
            <p className="fp-ownedh">{t.stayOn}</p>
            <div className="fp-authrow">
              <Link className="fp-authbtn" href="/haullegal/calendar">
                {t.openCal}
              </Link>
              <Link className="fp-authbtn ghost" href="/haullegal/account">
                {t.manageSub}
              </Link>
            </div>
          </div>
        ) : access.loggedIn ? (
          <button className="fp-buybtn" disabled={buying !== null} onClick={() => buy("staylegal")} type="button">
            {buying === "staylegal" ? t.openingCheckout : t.buyStay}
          </button>
        ) : (
          doors
        )}
        {err ? <p className="fp-buyerr">{err}</p> : null}
        <p className="fp-buynote">{t.secure}</p>
      </div>

      <div className="fp-foot">
        <div className="fp-links">
          <Link className="fp-link" href="/haullegal/account">
            {ui.common.account}
          </Link>
          <Link className="fp-link" href="/haullegal/terms">
            {ui.common.terms}
          </Link>
          <Link className="fp-link" href="/haullegal/privacy">
            {ui.common.privacy}
          </Link>
        </div>
        <p className="fp-legal">{t.legal}</p>
      </div>
      <HlAccountButton />
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/buy/page.tsx (v6 - account circle,
// footer Account link; Spanish switch, language passed to checkout; free-month
// chip beside the $249;
// auto-renew fine print; Stay Legal alone card; auth doors; owned
// states)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
