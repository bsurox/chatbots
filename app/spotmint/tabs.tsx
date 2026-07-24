"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Spotmint bottom tab bar. v2: five slots with Create DEAD CENTER -
// Account and Credits on the left, Support and Library on the right,
// so the mint circle sits exactly in the middle of the bar. The
// Credits tab points at the inert wallet page, never at the Stripe
// store page - inside the app the wallet only *names* spotmint.store,
// keeping the app commission-free on both stores. Visual styling
// lives in spotmint.css (.sp-tabs family; flush dimmed circle).

export function SpotmintTabs() {
  const pathname = usePathname();
  const on = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="sp-tabs" aria-label="Spotmint sections">
      <Link href="/spotmint/account" className={on("/spotmint/account", false) ? "sp-tab on" : "sp-tab"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
        <span>Account</span>
      </Link>

      <Link href="/spotmint/wallet" className={on("/spotmint/wallet", false) ? "sp-tab on" : "sp-tab"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
        </svg>
        <span>Credits</span>
      </Link>

      <Link href="/spotmint" className={on("/spotmint", true) ? "sp-tab sp-create on" : "sp-tab sp-create"}>
        <span className="sp-create-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span>Create</span>
      </Link>

      <Link href="/spotmint/support" className={on("/spotmint/support", false) ? "sp-tab on" : "sp-tab"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Support</span>
      </Link>

      <Link href="/spotmint/library" className={on("/spotmint/library", false) ? "sp-tab on" : "sp-tab"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>Library</span>
      </Link>
    </nav>
  );
}

// ============================================================
// END OF FILE - app/spotmint/tabs.tsx (v2 - create centered, library)
// If you can see this comment, the paste was not truncated.
// ============================================================
