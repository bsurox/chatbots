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
    slug: "july-20-tune-up",
    date: "July 20, 2026",
    sortKey: "2026-07-20",
    title: "A Smoother AskEvo + Something New Is Coming",
    tagline: "A simpler video lineup, cleaner names, a brief video outage explained - and our next project gets a codename.",
    body: `📱 ANNOUNCED — Our next project has a codename
- AskEvo is officially building its next product: a dedicated mobile app, coming to the iOS App Store and Google Play.
- Codename: ADREEL.
- That is all we are saying for now. More soon. 👀

🎬 CHANGED — A simpler video lineup
- Video generation is now three tiers: Fast, Premium, and Cinematic.
- Fast for quick drafts, Premium for top-quality video, Cinematic for the highest quality with optional sound — still the audio king of the lineup.
- Nothing you need to do: old links and bookmarks keep working.

⚠️ RESOLVED — Brief video page outage
- Earlier today, while the new lineup rolled out, the video page failed to load for signed-in users for a short window. The rest of the site was unaffected, and the issue is fully resolved.
- If this outage caused a problem for you, please reach out through our support page at askevo.ai/support, or email support@askevo.ai with as much detail as you can, plus your name and account email. We will verify and respond within 1-3 days — and we will make it right.

🧼 POLISH — Cleaner names, tighter screws
- Credit packs got cleaner names: Premium and Ultra drop the "Pack" — now matching the rest of the lineup everywhere, including checkout.
- Dozens of small under-the-hood reliability and polish improvements across the site.

More soon. Go make something. 💎`,
  },
  {
    slug: "downtime-july-19",
    date: "July 19, 2026",
    sortKey: "2026-07-19.2",
    title: "Unexpected Website Downtime - Resolved",
    tagline: "A short outage today, what happened, and how to reach us if you were affected.",
    body: `As part of background maintenance conducted today, July 19th, AskEvo experienced unexpected sitewide downtime - visitors to the askevo.ai domain saw a 404 error for roughly 20 minutes, beginning around 6:48 PM Mountain Time.

We quickly reverted the changes to restore full website function, and the intended maintenance was completed successfully afterward.

If you were affected by the outage, please reach out through our support page at askevo.ai/support, or email us directly at support@askevo.ai. When you contact us, include as much detail as you can about the issue you experienced, along with your name and account email address. We will verify the information and respond within 1-3 days - and if this downtime caused a problem for you, we will make it right.

Thank you for using AskEvo. For any other questions, contact our support team. To stay up to speed on updates and important information, follow our official patch notes - launched today - right here at askevo.ai/updates.`,
  },
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
// END OF FILE - app/updates/updates-data.ts (v3 - july 20 tune-up)
// If you can see this comment, the paste was not truncated.
// ============================================================
