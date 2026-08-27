// FILE: app/foremanprep/bl-owner-swap.tsx
"use client";
import { useEffect, useState } from "react";

// B&L owner swap (v1) - the "never pitch what they already
// bought" doctrine for the SERVER-rendered /bl-prep landing.
// That page stays a server component on purpose (real metadata,
// whole-page prerender for Google), so it cannot know who is
// signed in. This tiny client island can: wrap any sell furniture
// in <BlOwnerSwap sell={...} owned={...} /> and the server HTML
// renders the sell variant (what crawlers and visitors should
// see), then after hydration one access check swaps every
// instance on the page at once - B&L owners get the owned variant
// (or nothing, when owned is omitted). The access fetch is cached
// at module level, so four islands on one page still make exactly
// one request. Same island pattern as bl-auth-button v1.

// One shared access lookup per page view, however many islands
// mount. Guests and errors resolve to "not an owner", which
// leaves the sell furniture up - the safe default.
let accessCache: Promise<boolean> | null = null;

function fetchBlOwned(): Promise<boolean> {
  if (!accessCache) {
    accessCache = fetch("/foremanprep/api/access")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => Boolean(data?.bl))
      .catch(() => false);
  }
  return accessCache;
}

export default function BlOwnerSwap({
  sell,
  owned = null,
}: {
  sell: React.ReactNode;
  owned?: React.ReactNode;
}) {
  const [blOwned, setBlOwned] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchBlOwned().then((v) => {
      if (alive && v) setBlOwned(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return <>{blOwned ? owned : sell}</>;
}

// ============================================================
// END OF FILE - app/foremanprep/bl-owner-swap.tsx (v1 - owner-
// aware island for the server-rendered B&L landing)
// If you can see this comment, the paste was not truncated.
// ============================================================
