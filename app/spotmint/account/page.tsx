"use client";
import "../spotmint.css";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Account tab (car three of the shell train). The corner account
// sheet grown into a full page: who is signed in, and the way out.
// Notification settings land here later, once real push exists -
// no dead toggles before then. Reachable only by direct URL until
// app/spotmint/layout.tsx v3 mounts the tab bar.

export default function SpotmintAccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/spotmint/account");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint/account");
    }
  }, [session, status, router]);

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
      <p className="sp-tag">Your account</p>

      <label className="sp-label">Signed in as</label>
      <div className="sp-tier" style={{ cursor: "default" }}>
        <div>
          <div className="sp-tn">{session.user.email}</div>
          <p className="sp-td">Your ads and credits live on this account.</p>
        </div>
      </div>

      <div className="sp-actions">
        <button type="button" className="sp-act" onClick={() => signOut({ redirectTo: "/spotmint" })}>
          Log out
        </button>
      </div>

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/account/page.tsx (v1 - account tab)
// If you can see this comment, the paste was not truncated.
// ============================================================
