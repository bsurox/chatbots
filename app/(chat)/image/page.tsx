"use client";

import { useState } from "react";
import Link from "next/link";
import { ToolHeader } from "@/components/chat/tool-header";

const QUALITY_OPTIONS = [
  { id: "core", name: "Standard", description: "Fast, great quality", credits: 8 },
  { id: "ultra", name: "Ultra", description: "Highest quality, more detail", credits: 18 },
];

const PRESET_SIZES = [
  { label: "Square", width: 1024, height: 1024 },
  { label: "Wide (16:9)", width: 1344, height: 768 },
  { label: "Tall (9:16)", width: 768, height: 1344 },
  { label: "Portrait (4:5)", width: 896, height: 1120 },
  { label: "Landscape (3:2)", width: 1216, height: 832 },
  { label: "Custom", width: 0, height: 0 },
];

export default function ImagePage() {
  const [prompt, setPrompt] = useState(() => {
    if (typeof window !== "undefined") {
      return decodeURIComponent(new URLSearchParams(window.location.search).get("prompt") ?? "");
    }
    return "";
  });
  const [quality, setQuality] = useState("core");
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const creditCost = quality === "ultra" ? 18 : 8;

  function handlePresetChange(index: number) {
    setSelectedPreset(index);
    if (PRESET_SIZES[index].width !== 0) {
      setWidth(PRESET_SIZES[index].width);
      setHeight(PRESET_SIZES[index].height);
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width, height, quality }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("Not enough credits. Please buy more credits to continue.");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setImage(data.image);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToolHeader />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", paddingBottom: 60 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Image Generator</h1>
        <p style={{ color: "#888" }}>Ask Evo to generate stunning images of any size using text descriptions.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Describe your image</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city at sunset with neon lights reflecting on wet streets..."
            rows={4}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "inherit", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Quality</label>
          <div style={{ display: "flex", gap: 12 }}>
            {QUALITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setQuality(option.id)}
                style={{ flex: 1, padding: "12px", borderRadius: 8, border: quality === option.id ? "2px solid #22c55e" : "1px solid #333", background: quality === option.id ? "rgba(34,197,94,0.1)" : "transparent", color: "inherit", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{option.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{option.description}</div>
                <div style={{ fontSize: 12, color: "#22c55e", marginTop: 4 }}>{option.credits} credits</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Size</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {PRESET_SIZES.map((preset, index) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetChange(index)}
                style={{ padding: "8px 16px", borderRadius: 8, border: selectedPreset === index ? "2px solid #22c55e" : "1px solid #333", background: selectedPreset === index ? "rgba(34,197,94,0.1)" : "transparent", color: "inherit", cursor: "pointer", fontSize: 13 }}
              >
                {preset.label}
                {preset.width !== 0 && (
                  <span style={{ color: "#888", marginLeft: 6, fontSize: 11 }}>{preset.width}x{preset.height}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => { setWidth(Number(e.target.value)); setSelectedPreset(5); }}
                min={512}
                max={2048}
                step={64}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "inherit", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => { setHeight(Number(e.target.value)); setSelectedPreset(5); }}
                min={512}
                max={2048}
                step={64}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "inherit", fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{ padding: "14px", borderRadius: 8, border: "none", background: loading || !prompt.trim() ? "#333" : "linear-gradient(135deg, #22c55e, #16a34a)", color: loading || !prompt.trim() ? "#666" : "#fff", fontWeight: 700, fontSize: 16, cursor: loading || !prompt.trim() ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating... (this may take 10-20 seconds)" : `Generate Image — ${creditCost} credits`}
        </button>

        {error && (
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
            {error}
            {error.includes("credits") && (
              <Link href="/credits" style={{ marginLeft: 8, textDecoration: "underline", color: "#22c55e" }}>Buy more credits</Link>
            )}
          </div>
        )}

        {image && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img src={image} alt="Generated" style={{ width: "100%", borderRadius: 12, border: "1px solid #333" }} />
            <a href={image} download="askevo-image.png" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, background: "#22c55e", color: "#fff", textDecoration: "none", fontWeight: 600, textAlign: "center" }}>Download Image</a>
          </div>
        )}

      </div>

      <div style={{ marginTop: 48, textAlign: "center", fontSize: 11, color: "#444" }}>
        Image generation powered by Stable Diffusion via Stability AI
      </div>
      </div>
    </>
  );
}
