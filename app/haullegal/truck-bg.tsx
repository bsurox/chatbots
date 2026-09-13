// FILE: app/haullegal/truck-bg.tsx
import Image from "next/image";

// HaulLegal landing backdrop (v1 - the photo, his pick after the
// mockups): a real semi - his royalty-free photo, cropped tight
// around the tractor and trailer, carrier markings painted out,
// saved as public/hl-truck.jpg (1600 x 820) - runs edge to edge
// across the top of the landing page behind the hero. Still the
// dark theme: the photo is turned black and white, dimmed and
// shown at 70%, fades to black under the stats row (vertical
// mask) and toward the left and right edges (the gradient overlay),
// so the text and the green button stay readable on top. The
// landing page wraps itself in a full-width position: relative box
// with isolation: isolate and mounts this first; at z-index -1 the
// photo paints above the page's black canvas and below every bit
// of text. On a phone the crop centers on the tractor so the truck
// stays big. Ignores the mouse, hidden from screen readers; pure
// presentation, renders on the server. The three knobs: OPACITY,
// the band HEIGHT and the FOCUS point of the crop.

const OPACITY = 0.7;
const HEIGHT = "clamp(460px, 48vw, 700px)";
const FOCUS = "50% 60%";

export default function HlTruckBg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: HEIGHT,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -1,
        maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
      }}
    >
      <Image
        alt=""
        fill
        priority
        sizes="100vw"
        src="/hl-truck.jpg"
        style={{
          objectFit: "cover",
          objectPosition: FOCUS,
          filter: "grayscale(1) brightness(0.55) contrast(1.15)",
          opacity: OPACITY,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: "linear-gradient(90deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.05) 20%, rgba(10,10,10,0.05) 80%, rgba(10,10,10,0.7) 100%)",
        }}
      />
    </div>
  );
}

// ============================================================
// END OF FILE - app/haullegal/truck-bg.tsx (v1 - black-and-white
// semi photo faded into the top of the landing page)
// If you can see this comment, the paste was not truncated.
// ============================================================
