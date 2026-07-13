export type Tier = {
  id: "fast" | "standard" | "premium" | "cinematic";
  name: string;
  desc: string;
  credits5?: number;
  credits10?: number;
  fixedSeconds?: number;
  credits8?: number;
};

export const TIERS: Tier[] = [
  { id: "fast", name: "Fast", desc: "Quick drafts & ideas", credits5: 75, credits10: 150 },
  { id: "standard", name: "Standard", desc: "Balanced quality & speed", credits5: 110, credits10: 220 },
  { id: "premium", name: "Premium", desc: "Top quality, up to 10s", credits5: 250, credits10: 500 },
  { id: "cinematic", name: "Cinematic", desc: "Highest quality + sound (Veo 3)", fixedSeconds: 8, credits8: 375 },
];

export const JOB_KEY = "askevo_video_job";

export function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function download(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "askevo-video.mp4";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export type AspectRatio = "16:9" | "9:16";

export const ASPECT_RATIOS: { id: AspectRatio; label: string; hint: string }[] = [
  { id: "16:9", label: "Widescreen", hint: "YouTube, websites" },
  { id: "9:16", label: "Vertical", hint: "Reels, TikTok, Stories" },
];

export const DEFAULT_ASPECT_RATIO: AspectRatio = "16:9";

// ============================================================
// END OF FILE - app/(chat)/video/video-config.ts (v2 - ratios)
// If you can see this comment, the paste was not truncated.
// ============================================================
