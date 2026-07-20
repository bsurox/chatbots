// Patch notes for the hidden /updates page.
// To post a new update: copy the block between the braces below, paste it
// as a NEW entry anywhere in this array, and edit the fields. The page
// sorts by sortKey automatically, so order in this file does not matter.

export type PatchNote = {
  slug: string;
  date: string;
  sortKey: string;
  title: string;
  tagline: string;
  body: string;
};

export const PATCH_NOTES: PatchNote[] = [
  {
    slug: "cinematic-update",
    date: "July 19, 2026",
    sortKey: "2026-07-19",
    title: "The Cinematic Update",
    tagline: "Veo 3.1, sound control, honest images, and ghost-audio busting.",
    body: `🎬 NEW — Veo 3.1 is here
- Cinematic tier videos now run on Veo 3.1, Google's newest video model. Same tier, noticeably better output.
- Cinematic now comes in 4, 6, or 8 seconds — pick your length.
- Sound on / sound off toggle for Cinematic. Native audio and dialogue when you want it, pure visuals when you don't. Sound is now Cinematic's signature — it's the dedicated audio tier of the lineup.
- Site-wide announcement banner, and "Try it" drops you on the video page with Cinematic locked, loaded, and ready.

🖼️ IMPROVED — Image generation got honest
- Wide is now actually wide. Tall is actually tall. Every preset generates in its true shape.
- Custom sizes come back at your exact pixels, anywhere from 512 to 2048 per side.

🎙️ IMPROVED — Voice & transcription
- The voice engine went multilingual — 28+ languages now sound like they should.
- Live character counter so long scripts never surprise you.
- Smarter audio uploads: better MP3/M4A handling, accurate length detection, and clear limits with friendly errors instead of mystery failures.

🧹 FIXED — The little things you felt
- MP3 previews finally stop when you leave the page. No more ghost audio haunting your session. 👻
- Leave mid-recording? Your microphone now shuts off instantly.
- Picking a video format (Widescreen/Vertical) is now required before generating — no more accidentally rendering the wrong shape. The page will politely turn red until you choose.
- Dozens of under-the-hood reliability and stability upgrades across chat, generation, and checkout.

More soon. Go make something. 💎`,
  },
];

// ============================================================
// END OF FILE - app/updates/updates-data.ts (v1)
// If you can see this comment, the paste was not truncated.
// ============================================================
