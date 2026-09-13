// FILE: app/haullegal/account-button.tsx
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal account button (v2 - his spec: the circle moves to the
// bottom-RIGHT corner, and tapping it no longer jumps straight to
// the account page. It opens a small menu above the circle with one
// button, "View account", and that button is what opens the account
// page. Tapping the circle again, tapping anywhere else on the
// page, or pressing Escape closes the menu. The menu reads its
// label from i18n.ts (common.viewAccount), so it follows the EN /
// ES switch.)
// v1 notes - a small circle with a person icon, pinned to a corner
// of every product page (landing, walkthrough, calendar, buy);
// styled inline (no css edit); the icon is a plain inline SVG
// painted with the brand green from the layout's .hl-zone. Fixed
// position, above page content, below modals.

const wrap: React.CSSProperties = {
  position: "fixed",
  right: "16px",
  bottom: "16px",
  zIndex: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
};

const circle: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#161616",
  border: "1px solid #333",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
  fontFamily: "inherit",
};

const menu: React.CSSProperties = {
  background: "#161616",
  border: "1px solid #333",
  borderRadius: "14px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.55)",
  padding: "8px",
  minWidth: "160px",
};

const item: React.CSSProperties = {
  display: "block",
  fontSize: "13.5px",
  fontWeight: 700,
  color: "#000",
  background: "var(--fp)",
  border: "1px solid var(--fp)",
  borderRadius: "999px",
  padding: "9px 14px",
  textAlign: "center",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

export default function HlAccountButton() {
  const [lang] = useHlLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const label = HL_UI[lang].common.account;
  const viewLabel = HL_UI[lang].common.viewAccount;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = box.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} style={wrap}>
      {open ? (
        <div role="menu" style={menu}>
          <Link href="/haullegal/account" onClick={() => setOpen(false)} role="menuitem" style={item}>
            {viewLabel}
          </Link>
        </div>
      ) : null}
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        style={circle}
        title={label}
        type="button"
      >
        <svg aria-hidden="true" fill="none" height="22" stroke="var(--fp)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="22">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </button>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/account-button.tsx (v2 - bottom-right
// circle that opens a "View account" menu)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
