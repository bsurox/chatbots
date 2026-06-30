"use client";

import { useState } from "react";

const BUNDLES = [
  { id: "starter", name: "Starter", price: "$5", credits: 220 },
  { id: "power", name: "Power", price: "$15", credits: 800 },
  { id: "pro", name: "Pro", price: "$40", credits: 2400 },
];

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);

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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        Buy Credits
      </h1>
      <p style={{ color: "#888", marginBottom: 32 }}>
        Use credits for chat, images, and voice generation.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {BUNDLES.map((bundle) => (
          <div
            key={bundle.id}
            style={{
              border: "1px solid #333",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {bundle.name}
            </h2>
            <p style={{ fontSize: 32, fontWeight: 700, marginBottom: 4 }}>
              {bundle.price}
            </p>
            <p style={{ color: "#888", marginBottom: 16 }}>
              {bundle.credits} credits
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
              }}
            >
              {loading === bundle.id ? "Loading..." : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
