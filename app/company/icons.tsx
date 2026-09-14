// FILE: app/company/icons.tsx
// Inline SVG glyphs for the AskEvo LLC hub (v4). Kept in their own
// file so app/company/page.tsx stays under the size ceiling.
// v2 (his call): the social glyphs wear their own platform colors
// instead of grey - Instagram in its yellow-orange-pink-purple
// gradient, YouTube in YouTube red. Each Instagram instance takes a
// gid so its gradient id stays unique on a page painting several.
// v3 (his call): the store glyphs get their familiar store colors
// too - the Play mark in its four segments (blue spine, green,
// yellow, red) and the Apple mark in white - so they read the way
// the badges do everywhere else instead of black-on-mint.
// v4: a plain gid prop replaces the useId hook, so these glyphs
// render inside SERVER components too - the shared header in
// layout.tsx paints one and a server component cannot call hooks.
// 24x24 viewBox throughout; sized by css (.ae-soc svg / .ae-btn svg).

type IconProps = { className?: string };
type InstagramProps = { className?: string; gid?: string };

const YOUTUBE_RED = "#ff0000";
const PLAY_BLUE = "#00a0ff";
const PLAY_GREEN = "#00e676";
const PLAY_YELLOW = "#ffce00";
const PLAY_RED = "#ff3a44";

export function InstagramIcon({ className, gid }: InstagramProps) {
  const g = "aeig-" + (gid || "default");
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
    <svg aria-hidden="true" className={className} fill="#fff" focusable="false" viewBox="0 0 24 24">
      <path d="M16.9 12.7c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.2-.8-1.7 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.8.8 3.1.7 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.1-.8-2.1-3.9z" />
      <path d="M14.5 5.4c.7-.8 1.1-1.9 1-3.1-1 0-2.2.7-2.9 1.5-.7.7-1.2 1.8-1.1 2.9 1.1.1 2.3-.6 3-1.3z" />
    </svg>
  );
}

export function PlayStoreIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} focusable="false" viewBox="0 0 24 24">
      <path d="M3.609 1.814 L13.792 12 3.609 22.186a2.01 2.01 0 0 1-.609-1.437V3.251c0-.566.23-1.078.609-1.437z" fill={PLAY_BLUE} />
      <path d="M3.66 1.843a1.5 1.5 0 0 1 1.58-.012l11.554 7.15-3.002 3.019L3.66 1.843z" fill={PLAY_GREEN} />
      <path d="M16.794 8.981l3.366 1.95c1.12.65 1.12 1.488 0 2.138l-3.366 1.95L13.792 12l3.002-3.019z" fill={PLAY_YELLOW} />
      <path d="M3.66 22.157 13.792 12l3.002 3.019-11.554 7.15a1.5 1.5 0 0 1-1.58-.012z" fill={PLAY_RED} />
    </svg>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/company/icons.tsx (v4 - gid, server-safe)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
