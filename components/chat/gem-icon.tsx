import type { SVGProps } from "react";

export function GemIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7 4h10l4 6-9 10-9-10z" />
      <path d="M3 10h18" />
      <path d="M7 4l2.5 6" />
      <path d="M17 4l-2.5 6" />
    </svg>
  );
}

// -----------------------------------------------------------
// END OF FILE - components/chat/gem-icon.tsx (v2 - wider cut)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
