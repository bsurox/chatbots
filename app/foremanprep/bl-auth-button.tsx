// FILE: app/foremanprep/bl-auth-button.tsx
"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// B&L auth button (v1) - the Log in / Log out pill for the
// Business & Law landing page header. The bl-prep page is a
// server component on purpose (real metadata, whole-page
// prerender), so the auth-aware button lives in this tiny client
// island instead: bl-prep just mounts <BlAuthButton /> and stays
// a server component.
// Behavior mirrors the main landing's header button: the access
// check treats guests as signed out, so visitors see Log in and
// signed-in users see Log out. Two B&L-specific choices:
// 1. Log in points at /login?brand=bl - the brand param tells the
//    auth screens (layout v10) to wear the B&L sky blue instead
//    of safety orange.
// 2. Log out lands back on /foremanprep/bl-prep, the page the
//    button lives on - not the orange front door.
// Styling matches the landing pill (dark chip, thin border); the
// blue page identity comes from the login screens, not this chip.

const PILL: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  fontFamily: "inherit",
  color: "#fff",
  background: "#161616",
  border: "1px solid #333",
  borderRadius: "999px",
  padding: "5px 14px",
  whiteSpace: "nowrap",
};

export default function BlAuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.loggedIn) setLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  if (loggedIn) {
    return (
      <button
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          signOut({ redirectTo: "/foremanprep/bl-prep" });
        }}
        style={{ ...PILL, cursor: "pointer" }}
        type="button"
      >
        {signingOut ? "Signing out..." : "Log out"}
      </button>
    );
  }

  return (
    <Link href="/login?brand=bl" style={{ ...PILL, textDecoration: "none" }}>
      Log in
    </Link>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/bl-auth-button.tsx (v1 - Log in
// / Log out island for the B&L landing header)
// If you can see this comment, the paste was not truncated.
// ============================================================
