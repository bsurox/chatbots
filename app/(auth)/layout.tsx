// FILE: app/(auth)/layout.tsx
"use client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GemIcon } from "@/components/chat/gem-icon";
import { Preview } from "@/components/chat/preview";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Spotmint face (v5): when this door is reached from a Spotmint
  // surface - the spotmint.store host or the wrapped app's signature -
  // the auth screens wear Spotmint branding with AskEvo LLC in fine
  // print. Detection happens client-side after mount: server-side
  // header access here breaks prerendering on this Next version.
  // ForemanPrep face (v7): the same treatment for foremanprep.com -
  // buyers creating the account their purchase attaches to should
  // see the brand they came from, not AskEvo.
  // v8: full ForemanPrep color scheme - the theme tokens are
  // overridden inline when isForeman, so the background goes pure
  // black (no green tint) and the primary buttons go safety orange
  // without touching the shared auth form components.
  // v9: the favicon follows the brand too. Browsers keep ONE icon
  // per site and the newest fetch wins - these shared doors were
  // declaring the AskEvo icon on foremanprep.com, so a login visit
  // stamped the whole site with the wrong brand (his Mac). When
  // isForeman, the icon links are rewritten client-side to
  // /fp-icon.png, same after-mount pattern as the rest of this
  // file. AskEvo and Spotmint faces are untouched.
  // v10: B&L blue face. A login reached from a Business & Law
  // page carries ?brand=bl (the bl-prep header button sends it),
  // and the ForemanPrep auth screens then wear B&L sky blue -
  // wordmark accent, buttons, focus ring - instead of safety
  // orange. The choice survives the login <-> register <->
  // forgot-password hops even though those links carry no param:
  // when the param is present it is remembered in sessionStorage,
  // an arrival FROM another auth door reads the remembered value,
  // and any fresh paramless arrival from elsewhere clears it - so
  // a later plain ForemanPrep login is orange again, never stale
  // blue. Storage failures (private mode) just mean the param
  // alone decides. Spotmint, AskEvo, and the favicon logic are
  // untouched.
  const [isSpotmint, setIsSpotmint] = useState(false);
  const [isForeman, setIsForeman] = useState(false);
  const [isBl, setIsBl] = useState(false);
  useEffect(() => {
    if (
      window.location.hostname.includes("spotmint.store") ||
      navigator.userAgent.includes("SpotmintApp")
    ) {
      setIsSpotmint(true);
    }
    if (window.location.hostname.includes("foremanprep.com")) {
      setIsForeman(true);
    }
    const blParam =
      new URLSearchParams(window.location.search).get("brand") === "bl";
    const fromAuthDoor = /\/(login|register|forgot-password|reset-password)/.test(
      document.referrer
    );
    let bl = blParam;
    try {
      if (blParam) {
        window.sessionStorage.setItem("fp-auth-brand", "bl");
      } else if (fromAuthDoor) {
        bl = window.sessionStorage.getItem("fp-auth-brand") === "bl";
      } else {
        window.sessionStorage.removeItem("fp-auth-brand");
      }
    } catch {
      // Storage blocked - the param alone still decides.
    }
    setIsBl(bl);
  }, []);

  useEffect(() => {
    if (!isForeman) return;
    const links = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );
    for (const link of Array.from(links)) {
      (link as HTMLLinkElement).href = "/fp-icon.png";
    }
    if (links.length === 0) {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.href = "/fp-icon.png";
      document.head.appendChild(link);
    }
  }, [isForeman]);
  const branded = isSpotmint || isForeman;
  // ForemanPrep theme: override the design tokens the auth forms
  // are built on. Inline custom properties cascade to every child,
  // so bg-background renders black and bg-primary renders the
  // brand accent - safety orange normally, B&L sky blue when the
  // visitor came from a Business & Law page.
  const fpAccent = isBl ? "#38bdf8" : "#f97316";
  const foremanTheme = {
    "--background": "#0a0a0a",
    "--sidebar": "#0a0a0a",
    "--primary": fpAccent,
    "--primary-foreground": "#000000",
    "--ring": fpAccent,
  } as React.CSSProperties;
  return (
    <div className="flex h-dvh w-screen bg-sidebar" style={isForeman ? foremanTheme : undefined}>
      <div className={branded ? "flex w-full flex-col bg-background p-8 md:p-16" : "flex w-full flex-col bg-background p-8 xl:w-[600px] xl:shrink-0 xl:rounded-r-2xl xl:border-r xl:border-border/40 md:p-16"}>
        <Link
          className="flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-10">
          <div className="flex flex-col gap-2">
            {isSpotmint ? (
              <div className="mb-2 font-extrabold text-white text-xl tracking-tight">
                Spot<span style={{ color: "var(--primary)" }}>mint</span>
              </div>
            ) : isForeman ? (
              <div className="mb-2 font-extrabold text-white text-xl tracking-tight">
                Foreman<span style={{ color: fpAccent }}>Prep</span>
              </div>
            ) : (
              <div
                className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/50"
                style={{ color: "#f59e0b" }}
              >
                <GemIcon className="size-3.5" />
              </div>
            )}
            {children}
            {branded && (
              <p className="mt-6 text-center text-[11px] text-muted-foreground">
                Powered by AskEvo LLC
              </p>
            )}
          </div>
        </div>
      </div>
      {!branded && (
        <div className="hidden flex-1 flex-col overflow-hidden pl-12 xl:flex">
          <div className="flex-1 pt-4">
            <Preview />
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(auth)/layout.tsx (v10 - B&L blue face via
// ?brand=bl, orange stays the ForemanPrep default)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
