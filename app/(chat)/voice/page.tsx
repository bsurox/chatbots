"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Voice = {
  id: string;
  name: string;
  category: string;
  accent: string;
  gender: string;
  age: string;
  description: string;
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const creditCost = Math.max(1, Math.ceil(text.length / 20));

  useEffect(() => {
    async function fetchVoices() {
      try {
        const res = await fetch("/api/voices");
        const data = await res.json();
        if (data.voices) {
          setVoices(data.voices);
          setSelectedVoice(data.voices[0]?.id ?? "");
        }
      } catch {
        setError("Failed to load voices.");
      } finally {
        setLoadingVoices(false);
      }
    }
    fetchVoices();
  }, []);

  const filteredVoices = voices.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.accent.toLowerCase().includes(search.toLowerCase()) ||
      v.gender.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
  );

  async function handleGenerate() {
    if (!text.trim() || !selectedVoice) return;
    setLoading(true);
    setError(null);
    setAudio(null);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError("Not enough credits. Please buy more to continue.");
        } else {
          setError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setAudio(data.audio);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedVoiceDetails = voices.find((v) => v.id === selectedVoice);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Voice Generator</h1>
        <p style={{ color: "#888" }}>Ask Evo to bring your words to life. Powered by ElevenLabs.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Your text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste the text you want converted to speech..."
            rows={5}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "inherit", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "#888" }}>{text.length} characters</span>
            <span style={{ fontSize: 12, color: "#22c55e" }}>{creditCost} credits</span>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Select a voice</label>
          <input
            type="text"
            placeholder="Search voices by name, gender, accent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "inherit", fontSize: 13, marginBottom: 12, boxSizing: "border-box" }}
          />

          {loadingVoices ? (
            <div style={{ color: "#888", fontSize: 14 }}>Loading voices...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
              {filteredVoices.map((voice) => (
                <button
                  key={voice.id}
                  type="button"
                  onClick={() => setSelectedVoice(voice.id)}
                  style={{
                    padding: "12px",
                    borderRadius: 8,
                    border: selectedVoice === voice.id ? "2px solid #22c55e" : "1px solid #333",
                    background: selectedVoice === voice.id ? "rgba(34,197,94,0.1)" : "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{voice.name}</div>
                  {(voice.gender || voice.accent) && (
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {[voice.gender, voice.accent, voice.age].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {voice.description && (
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{voice.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {selectedVoiceDetails && (
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 13, color: "#888" }}>
              Selected: <span style={{ color: "#22c55e", fontWeight: 600 }}>{selectedVoiceDetails.name}</span>
              {selectedVoiceDetails.gender && ` · ${selectedVoiceDetails.gender}`}
              {selectedVoiceDetails.accent && ` · ${selectedVoiceDetails.accent}`}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !text.trim() || !selectedVoice}
          style={{ padding: "14px", borderRadius: 8, border: "none", background: loading || !text.trim() || !selectedVoice ? "#333" : "linear-gradient(135deg, #22c55e, #16a34a)", color: loading || !text.trim() || !selectedVoice ? "#666" : "#fff", fontWeight: 700, fontSize: 16, cursor: loading || !text.trim() || !selectedVoice ? "not-allowed" : "pointer" }}
        >
          {loading ? "Generating audio..." : `Generate Voice — ${creditCost} credits`}
        </button>

        {error && (
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
            {error}
            {error.includes("credits") && (
              <Link href="/credits" style={{ marginLeft: 8, textDecoration: "underline", color: "#22c55e" }}>Buy more credits</Link>
            )}
          </div>
        )}

        {audio && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 12, border: "1px solid #333", background: "rgba(34,197,94,0.05)" }}>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>Your generated audio:</p>
              <audio ref={audioRef} controls src={audio} style={{ width: "100%" }} />
            </div>
            <a href={audio} download="askevo-voice.mp3" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8, background: "#22c55e", color: "#fff", textDecoration: "none", fontWeight: 600, textAlign: "center" }}>Download Audio</a>
          </div>
        )}

      </div>
    </div>
  );
}
