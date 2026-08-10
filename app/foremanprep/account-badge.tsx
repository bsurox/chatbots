// FILE: app/foremanprep/account-badge.tsx
"use client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

// Floating account badge for every ForemanPrep page. Signed-out
// visitors see nothing at all. Signed-in users get a small person
// icon pinned to the bottom-right corner; tapping it opens a card
// with their account status and a Log out button. Sign-out uses
// the same next-auth call as the Spotmint account page and lands
// back on the ForemanPrep home page.

export default function AccountBadge() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [paid, setPaid] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.loggedIn) {
          setLoggedIn(true);
          setPaid(Boolean(data.paid));
        }
      })
      .catch(() => {});
  }, []);

  if (!loggedIn) return null;

  return (
    <div className="fp-fabwrap">
      {open ? (
        <div className="fp-fabpop">
          <p className="fp-fabstat">
            {paid ? (
              <>
                Signed in - <b>Full Access</b>
              </>
            ) : (
              "Signed in - free account"
            )}
          </p>
          <button
            className="fp-fabout"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              signOut({ redirectTo: "/foremanprep" });
            }}
            type="button"
          >
            {busy ? "Signing out..." : "Log out"}
          </button>
        </div>
      ) : null}
      <button
        aria-label="Account"
        className="fp-fab"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================
// END OF FILE - app/foremanprep/account-badge.tsx (v1 - person
// icon + log out)
// If you can see this comment, the paste was not truncated.
// ============================================================
