// FILE: lib/foremanprep/audio-config.ts

// ForemanPrep audio location (v1). AUDIO_BASE is the Vercel Blob
// host that holds every generated mp3 (set after the first
// generation run on /foremanprep/admin-audio, 2026-08 full-bank
// batch). If this ever needs to move stores, changing this one
// constant repoints every Listen button in the app.

export const AUDIO_BASE = "https://p3q2jedb1b2obdqb.public.blob.vercel-storage.com";

export function audioUrl(kind: "q" | "e", id: string): string {
  return `${AUDIO_BASE}/foremanprep-audio/${kind}-${id}.mp3`;
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/audio-config.ts (v1 - blob base)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
