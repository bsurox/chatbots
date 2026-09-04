// FILE: app/wiremanprep/sitemap.xml/route.ts

// WiremanPrep sitemap (v1). Served at /wiremanprep/sitemap.xml,
// which on wiremanprep.com is the address to submit to Google
// Search Console (the root /sitemap.xml path is excluded from the
// proxy by the app-wide matcher, so the island carries its own -
// same doctrine as ForemanPrep's sitemap). Lists the CLEAN public
// URLs that proxy.ts v18 rewrites onto the island. Small on
// purpose: the marketing surface is the landing page, the two
// free doors, and the storefront; guide/state SEO pages join this
// list when they exist.

const BASE = "https://wiremanprep.com";

export function GET(): Response {
  const staticPaths = ["/", "/practice", "/exam", "/buy"];
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
// END OF FILE - app/wiremanprep/sitemap.xml/route.ts (v1 -
// landing, practice, exam, buy)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
