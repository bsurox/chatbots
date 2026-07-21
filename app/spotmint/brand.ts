// Central brand configuration for the Spotmint surface.
// Every Spotmint-facing string lives here. When niche app #2 happens,
// copy the folder and edit this file first.

export const BRAND = {
  name: "Spotmint",
  tagline: "AI video ads for your business, in minutes",
  supportEmail: "support@askevo.ai",
  poweredBy: "Powered by AskEvo LLC",
  storeDomain: "spotmint.store",
  jobKey: "spotmint_video_job",
  promptPlaceholder:
    "Describe your ad: A 10-second ad for a cozy downtown coffee shop, warm morning light, latte art close-up...",
} as const;

export type Brand = typeof BRAND;

// ============================================================
// END OF FILE - app/spotmint/brand.ts (v2 - LLC + store domain)
// If you can see this comment, the paste was not truncated.
// ============================================================
