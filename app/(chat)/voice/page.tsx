"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ToolHeader } from "@/components/chat/tool-header";

type Voice = {
  id: string;
  name: string;
  category: string;
  accent: string;
  gender: string;
  age: string;
  description: string;
  previewUrl: string;
};

export default function VoicePage() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(true);
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const creditCost = Math.max(1, Math.ceil(text.length / 20));
  const creditLabel = creditCost === 1 ? "credit" : "credits";

  useEffect(() => {
    let cancelled = false;
    async function loadVoices() {
      try {
        const res = await fetch("/api/voice/voices");
        if (!res.ok) {
          throw new Error("failed");
        }
        const data = await res.json();
        if (!cancelled) {
          setVoices(data.voices ?? []);
          if (data.voices?.length > 0) {
            setSelectedVoice(data.voices[0].id);
          }
        }
      } catch {
        if (!cancelled) {
          setError("Could not load voices. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoadingVoices(false);
        }
      }
    }
    loadVoices();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredVoices = voices.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.accent.toLowerCase().includes(q) ||
      v.gender.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q)
    );
  });

  function playPreview(voice: Voice) {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    if (playingPreview === voice.id) {
      setPlayingPreview(null);
      return;
    }
    const el = new Audio(voice.previewUrl);
    previewAudioRef.current = el;
    setPlayingPreview(voice.id);
    el.play().catch(() => setPlayingPreview(null));
    el.onended = () => setPlayingPreview(null);
  }

  async function handleGenerate() {
    if (!text.trim() || !selectedVoice || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    setAudio(null);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), voiceId: selectedVoice }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not generate audio.");
        return;
      }
      setAudio(data.audioUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToolHeader />
      <div className="vc-wrap" style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Voice Generator</h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: 14, marginBottom: 24 }}>
          Type your text, pick a voice, and Evo speaks it.
        </p>

        <label htmlFor="vc-text" style={{ display: "block", fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
          Text
        </label>
        <textarea
          id="vc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          rows={4}
          placeholder="Type what you want Evo to say..."
          style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", padding: 12, fontSize: 15, marginBottom: 16 }}
        />

        <label htmlFor="vc-search" style={{ display: "block", fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>
          Voices
        </label>
        <input
          id="vc-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search voices by name, accent, or style..."
          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", padding: "8px 12px", fontSize: 14, marginBottom: 12 }}
        />

        {loadingVoices ? (
          <p style={{ color: "var(--muted-foreground)", fontSize: 14 }}>Loading voices...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, maxHeight: 320, overflowY: "auto", marginBottom: 20 }}>
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                style={{
                  borderRadius: 12,
                  border: voice.id === selectedVoice ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: voice.id === selectedVoice ? "color-mix(in oklab, var(--primary) 10%, transparent)" : "var(--card)",
                  padding: 12,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedVoice(voice.id)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{voice.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPreview(voice);
                    }}
                    style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    {playingPreview === voice.id ? "Stop" : "Preview"}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {voice.gender} - {voice.accent} - {voice.age}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !text.trim() || !selectedVoice}
          style={{
            width: "100%",
            borderRadius: 12,
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            padding: "12px 16px",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            opacity: loading || !text.trim() ? 0.6 : 1,
          }}
        >
          {loading ? "Generating..." : `Generate Voice - ${creditCost} ${creditLabel}`}
        </button>

        {error && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#f87171" }}>{error}</p>
        )}

        {audio && (
          <div style={{ marginTop: 24 }}>
            <audio controls ref={audioRef} src={audio} style={{ width: "100%" }} />
            <div style={{ marginTop: 8 }}>
              <Link
                href={audio}
                target="_blank"
                style={{ fontSize: 13, color: "var(--primary)", textDecoration: "underline" }}
              >
                Open audio in new tab
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/voice/page.tsx (v2 - no model note)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
