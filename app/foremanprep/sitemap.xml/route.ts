// FILE: app/foremanprep/sitemap.xml/route.ts
import { GUIDES } from "@/lib/foremanprep/guides";
import { STATES } from "@/lib/foremanprep/states";

// ForemanPrep sitemap (v2). Served at /foremanprep/sitemap.xml,
// which on foremanprep.com is the address you submit to Google
// Search Console (the root /sitemap.xml path is excluded from the
// proxy by the app-wide matcher, so the island carries its own).
// Lists the CLEAN public URLs that proxy.ts v11 rewrites onto the
// island - the same addresses the guide and state pages declare
// as their canonicals. v2 adds the 17 state guides plus /states.

const BASE = "https://foremanprep.com";
const GUIDES_UPDATED = "2026-08-21";
const STATES_UPDATED = "2026-08-22";

export function GET(): Response {
  const staticPaths = ["/", "/guides", "/states", "/practice", "/exam", "/audio", "/buy"];
  const urls: Array<{ loc: string; lastmod?: string }> = [
    ...staticPaths.map((p) => ({ loc: BASE + (p === "/" ? "" : p) })),
    ...GUIDES.map((g) => ({
      loc: `${BASE}/guides/${g.slug}`,
      lastmod: GUIDES_UPDATED,
    })),
    ...STATES.map((st) => ({
      loc: `${BASE}/states/${st.slug}`,
      lastmod: STATES_UPDATED,
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) =>
      [
        "  <url>",
        `    <loc>${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : "",
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n")
    ),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

// -----------------------------------------------------------
// END OF FILE - app/foremanprep/sitemap.xml/route.ts (v2 -
// state guide URLs added)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
