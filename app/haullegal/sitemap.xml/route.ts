// FILE: app/haullegal/sitemap.xml/route.ts

import { HL_GUIDES } from "@/lib/haullegal/guides";

// HaulLegal sitemap (v2). Served at /haullegal/sitemap.xml, which
// on haullegal.com is the address to submit to Google Search
// Console (the root /sitemap.xml path is excluded from the proxy by
// the app-wide matcher, so the island carries its own - same
// doctrine as the ForemanPrep and WiremanPrep sitemaps). Lists the
// CLEAN public URLs the proxy host block rewrites onto the island.
// v2 adds the guide library: /guides plus one URL per article,
// compiled from lib/haullegal/guides.ts so a new guide joins the
// sitemap by itself on the next deploy. The per-state authority
// pages join in v3 the same way.

const BASE = "https://haullegal.com";

export function GET(): Response {
  const staticPaths = ["/", "/start", "/calendar", "/buy", "/guides"];
  const urls = [
    ...staticPaths.map((p) => BASE + (p === "/" ? "" : p)),
    ...HL_GUIDES.map((g) => `${BASE}/guides/${g.slug}`),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) =>
      ["  <url>", `    <loc>${loc}</loc>`, "  </url>"].join("\n")
    ),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

// -----------------------------------------------------------
// END OF FILE - app/haullegal/sitemap.xml/route.ts (v2 - five
// launch URLs plus the guide library)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
