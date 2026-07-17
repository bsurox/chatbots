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
      <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
      <path d="M10 12l-2 -2.2l.6 -1" />
    </svg>
  );
}

export function gemColorForModel(modelId: string | undefined): string {
  if (modelId === "claude-haiku-4-5") {
    return "text-[#cd8c52]";
  }
  if (modelId === "claude-sonnet-4-5") {
    return "text-slate-400";
  }
  return "text-amber-400";
}

export function gemHexForModel(modelId: string | undefined): string {
  if (modelId === "claude-haiku-4-5") {
    return "#cd8c52";
  }
  if (modelId === "claude-sonnet-4-5") {
    return "#94a3b8";
  }
  return "#fbbf24";
}

// -----------------------------------------------------------
// END OF FILE - components/chat/gem-icon.tsx (v5 - true metals)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
