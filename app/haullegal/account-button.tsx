// FILE: app/haullegal/account-button.tsx
"use client";
import Link from "next/link";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal account button (v1) - his spec: not a pill in the top
// bar but a small circle pinned to the bottom-left corner of the
// screen with a person icon, on every product page (landing,
// walkthrough, calendar, buy). Tapping it opens the account page -
// the place to manage Stay Legal - and for a signed-out visitor
// that page shows the sign-in doors. Bottom-LEFT on purpose: the
// bottom-right corner is reserved for the chat widget the other
// brands carry. Styled inline (no css edit); the icon is a plain
// inline SVG painted with the brand green from the layout's
// .hl-zone. Fixed position, above page content, below modals.

const wrap: React.CSSProperties = {
  position: "fixed",
  left: "16px",
  bottom: "16px",
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#161616",
  border: "1px solid #333",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  zIndex: 40,
};

export default function HlAccountButton() {
  const [lang] = useHlLang();
  const label = HL_UI[lang].common.account;
  return (
    <Link aria-label={label} href="/haullegal/account" style={wrap} title={label}>
      <svg aria-hidden="true" fill="none" height="22" stroke="var(--fp)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="22">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    </Link>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/account-button.tsx (v1 - floating
// bottom-left account circle with person icon)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
