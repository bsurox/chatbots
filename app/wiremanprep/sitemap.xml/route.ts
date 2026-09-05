// FILE: app/wiremanprep/sitemap.xml/route.ts

import { WM_GUIDES } from "@/lib/wiremanprep/guides";
import { WM_STATES } from "@/lib/wiremanprep/states";

// WiremanPrep sitemap (v2). Served at /wiremanprep/sitemap.xml,
// which on wiremanprep.com is the address to submit to Google
// Search Console (the root /sitemap.xml path is excluded from the
// proxy by the app-wide matcher, so the island carries its own -
// same doctrine as ForemanPrep's sitemap). Lists the CLEAN public
// URLs that proxy.ts v19 rewrites onto the island. v2 adds the
// SEO library: /guides + the five articles, /states + the 17
// board pages - 28 URLs total, compiled from the same data files
// the pages render from, so a new guide or state joins the
// sitemap by itself on the next deploy.

const BASE = "https://wiremanprep.com";

export function GET(): Response {
  const staticPaths = ["/", "/practice", "/exam", "/buy", "/guides", "/states"];
  const urls = [
    ...staticPaths.map((p) => BASE + (p === "/" ? "" : p)),
    ...WM_GUIDES.map((g) => `${BASE}/guides/${g.slug}`),
    ...WM_STATES.map((st) => `${BASE}/states/${st.slug}`),
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
// END OF FILE - app/wiremanprep/sitemap.xml/route.ts (v2 -
// + guides and state pages, 28 URLs)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
