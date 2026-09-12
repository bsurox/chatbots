// FILE: app/haullegal/lang-toggle.tsx
"use client";
import { HL_UI, useHlLang } from "@/lib/haullegal/i18n";

// HaulLegal language pill (v1) - the EN / ES switch that sits in the
// top bar of the landing, walkthrough, calendar, buy and account
// pages. One tap stores the choice on the device (hl-lang) and
// every mounted page re-renders in that language through the
// useHlLang hook; the choice sticks until the owner taps the other
// side. Styled inline in the same shape as the Log in pill so it
// needs no css edit; the active side wears the brand green through
// var(--fp) from the layout's .hl-zone. Renders "EN" active until
// the stored choice is read after mount (hydration rule).

const wrap: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  background: "#161616",
  border: "1px solid #333",
  borderRadius: "999px",
  overflow: "hidden",
};

const btn: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 800,
  fontFamily: "inherit",
  letterSpacing: "0.04em",
  color: "#bbb",
  background: "transparent",
  border: "none",
  padding: "6px 11px",
  cursor: "pointer",
};

const on: React.CSSProperties = {
  ...btn,
  color: "#000",
  background: "var(--fp)",
};

export default function HlLangToggle() {
  const [lang, setLang] = useHlLang();
  const ui = HL_UI[lang];
  return (
    <div aria-label="Language / Idioma" role="group" style={wrap} title={ui.common.langToggleTitle}>
      <button aria-pressed={lang === "en"} onClick={() => setLang("en")} style={lang === "en" ? on : btn} type="button">
        EN
      </button>
      <button aria-pressed={lang === "es"} onClick={() => setLang("es")} style={lang === "es" ? on : btn} type="button">
        ES
      </button>
    </div>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/lang-toggle.tsx (v1 - EN / ES
// pill, stores hl-lang on the device)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
