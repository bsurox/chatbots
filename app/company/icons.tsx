// FILE: app/company/icons.tsx
// Inline SVG glyphs for the AskEvo LLC hub (v1). Kept in their own
// file so app/company/page.tsx stays under the size ceiling.
// Every glyph paints with currentColor, so the card's own hover
// rules recolor it - no per-icon color plumbing.
// 24x24 viewBox throughout; sized by css (.ae-soc svg / .ae-btn svg).

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 24 24">
      <rect height="19" rx="5" stroke="currentColor" strokeWidth="1.9" width="19" x="2.5" y="2.5" />
      <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.5" cy="6.6" fill="currentColor" r="1.2" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 24 24">
      <rect height="15" rx="4.2" stroke="currentColor" strokeWidth="1.9" width="21" x="1.5" y="4.5" />
      <path d="M10 8.8 L16 12 L10 15.2 Z" fill="currentColor" />
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
// END OF FILE - app/company/icons.tsx (v1 - social + store glyphs)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
