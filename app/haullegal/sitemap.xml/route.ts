// FILE: app/haullegal/sitemap.xml/route.ts

// HaulLegal sitemap (v1). Served at /haullegal/sitemap.xml, which
// on haullegal.com is the address to submit to Google Search
// Console (the root /sitemap.xml path is excluded from the proxy by
// the app-wide matcher, so the island carries its own - same
// doctrine as the ForemanPrep and WiremanPrep sitemaps). Lists the
// CLEAN public URLs the proxy host block rewrites onto the island.
// v1 = the launch surfaces only; the SEO library (/guides, the
// per-state authority pages) joins in a later version, compiled
// from its data files the way WiremanPrep's does.

const BASE = "https://haullegal.com";

export function GET(): Response {
  const staticPaths = ["/", "/start", "/calendar", "/buy"];
  const urls = staticPaths.map((p) => BASE + (p === "/" ? "" : p));

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
// END OF FILE - app/haullegal/sitemap.xml/route.ts (v1 - four
// launch URLs)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
