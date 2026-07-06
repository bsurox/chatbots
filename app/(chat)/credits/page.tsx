"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToolHeader } from "@/components/chat/tool-header";

type Bundle = {
  id: string;
  name: string;
  price: string;
  credits: number;
  originalCredits?: number;
  badge?: string;
};

const BUNDLES: Bundle[] = [
  { id: "starter", name: "Starter", price: "$5", credits: 220 },
  { id: "power", name: "Power", price: "$15", credits: 800 },
  { id: "pro", name: "Pro", price: "$40", credits: 2400 },
  { id: "premium", name: "Premium Pack", price: "$75", credits: 5000, badge: "Best value for video" },
  { id: "ultra", name: "Ultra Pack", price: "$150", credits: 11750, originalCredits: 11000 },
];
export default function CreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/credits");
      return;
    }
    const isGuest = /^guest-\d+$/.test(session.user.email ?? "");
    if (isGuest) {
      router.push("/register?redirectUrl=/credits");
    }
  }, [session, status, router]);
  if (status === "loading") {
    return (
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }
  const isGuest = /^guest-\d+$/.test(session?.user?.email ?? "");
  if (!session?.user || isGuest) {
    return null;
  }
  async function handleBuy(bundleId: string) {
    setLoading(bundleId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundle: bundleId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(null);
    }
  }
  return (
    <>
      <ToolHeader />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#22c55e" }}>
        Buy Credits
      </h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        Use credits for chat, images, voice, and video generation.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            style={{
              border: bundle.badge ? "2px solid #22c55e" : "1px solid #333",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {bundle.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -11,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#22c55e",
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                {bundle.badge}
              </div>
            )}
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {bundle.name}
            </h2>
            <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
              {bundle.price}
            </p>
            <p style={{ color: "#888", marginBottom: 16 }}>
              {bundle.originalCredits ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#666", marginRight: 6 }}>
                    {bundle.originalCredits.toLocaleString()}
                  </span>
                  <span style={{ color: "#22c55e", fontWeight: 600 }}>
                    {bundle.credits.toLocaleString()} credits
                  </span>
                </>
              ) : (
                `${bundle.credits.toLocaleString()} credits`
              )}
            </p>
            <button
              type="button"
              onClick={() => handleBuy(bundle.id)}
              disabled={loading === bundle.id}
              style={{
                width: "100%",
                padding: "10px 0",
                borderRadius: 8,
                background: "#fff",
                color: "#000",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                marginTop: "auto",
              }}
            >
              {loading === bundle.id ? "Loading..." : "Buy"}
            </button>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
