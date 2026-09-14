// FILE: app/company/icons.tsx
// Inline SVG glyphs for the AskEvo LLC hub (v2). Kept in their own
// file so app/company/page.tsx stays under the size ceiling.
// v2 (his call): the social glyphs wear their own platform colors
// instead of grey - Instagram in its yellow-orange-pink-purple
// gradient, YouTube in YouTube red. useId keeps every Instagram
// instance's gradient id unique, since the page paints five of them.
// The store glyphs (Apple, Play) still ride currentColor because
// they sit INSIDE the mint Spotmint buttons and must read black.
// 24x24 viewBox throughout; sized by css (.ae-soc svg / .ae-btn svg).

import { useId } from "react";

type IconProps = { className?: string };

const YOUTUBE_RED = "#ff0000";

export function InstagramIcon({ className }: IconProps) {
  const id = useId();
  const g = "ig" + id.replace(/:/g, "");
  return (
    <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 24 24">
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={g} x1="3" x2="21" y1="21" y2="3">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="55%" stopColor="#d62976" />
          <stop offset="80%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect height="19" rx="5" stroke={"url(#" + g + ")"} strokeWidth="1.9" width="19" x="2.5" y="2.5" />
      <circle cx="12" cy="12" r="4.3" stroke={"url(#" + g + ")"} strokeWidth="1.9" />
      <circle cx="17.5" cy="6.6" fill={"url(#" + g + ")"} r="1.2" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 24 24">
      <rect fill={YOUTUBE_RED} height="15" rx="4.2" stroke={YOUTUBE_RED} strokeWidth="1.9" width="21" x="1.5" y="4.5" />
      <path d="M10 8.8 L16 12 L10 15.2 Z" fill="#fff" />
    </svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M16.9 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.2-.8-1.7 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.1-.8-2.1-3.9z" />
      <path d="M14.5 5.4c.7-.8 1.1-1.9 1-3.1-1 0-2.2.7-2.9 1.5-.7.7-1.2 1.8-1.1 2.9 1.1.1 2.3-.6 3-1.3z" />
    </svg>
  );
}

export function PlayStoreIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" focusable="false" viewBox="0 0 24 24">
      <path d="M4.1 2.3c-.4.3-.6.8-.6 1.4v16.6c0 .6.2 1.1.6 1.4l9-9.7-9-9.7z" />
      <path d="M14.6 13.2l2.9-3.1 3.1 1.8c.9.5.9 1.7 0 2.2l-3.1 1.8-2.9-2.7z" />
      <path d="M5.2 1.8c.4-.1.9 0 1.4.3l9.4 5.4-2.4 2.6-8.4-8.3z" />
      <path d="M5.2 22.2c.4.1.9 0 1.4-.3l9.4-5.4-2.4-2.6-8.4 8.3z" />
    </svg>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/icons.tsx (v2 - platform colors)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
