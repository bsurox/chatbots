"use client";
import "./image.css";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToolHeader } from "@/components/chat/tool-header";

export default function ImagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  if (status === "loading") {
    return null;
  }
  if (!session?.user) {
    router.push("/register?redirectUrl=/image");
    return null;
  }

  async function handleGenerate() {
    if (!prompt.trim() || busy) {
      return;
    }
    setBusy(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not generate the image.");
        return;
      }
      setImageUrl(data.imageUrl);
      if (typeof data.credits === "number") {
        setCredits(data.credits);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader />
      <div className="ig-wrap">
        <h1 className="ig-h1">Image Generator</h1>
        <p className="ig-sub">Describe the image you want and Evo creates it.</p>

        <label className="ig-label" htmlFor="ig-prompt">Prompt</label>
        <textarea
          id="ig-prompt"
          className="ig-prompt"
          placeholder="A cozy coffee shop interior with warm lighting, plants on wooden shelves..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={busy}
          rows={4}
        />

        <button
          type="button"
          className="ig-gen"
          onClick={handleGenerate}
          disabled={busy || !prompt.trim()}
        >
          {busy ? "Generating..." : "Generate Image - 10 credits"}
        </button>

        {error && <div className="ig-err">{error}</div>}

        {imageUrl && (
          <div className="ig-result">
            <img alt={prompt} className="ig-image" src={imageUrl} />
            <a className="ig-download" download href={imageUrl} rel="noopener noreferrer" target="_blank">
              Open full size
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/image/page.tsx (v2 - no model note)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
