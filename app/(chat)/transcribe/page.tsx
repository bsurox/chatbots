"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ToolHeader } from "@/components/chat/tool-header";

export default function TranscribePage() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const creditCost = Math.max(5, Math.ceil(duration) * 5);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      startTimeRef.current = Date.now();
      setRecording(true);
      setAudioBlob(null);
      setAudioUrl(null);
      setTranscript(null);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setAudioBlob(null);
    setTranscript(null);
    setDuration(0);
  }

  async function handleTranscribe() {
    const source = audioBlob ?? uploadedFile;
    if (!source) return;

    setLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const formData = new FormData();
      formData.append("audio", source, "audio.webm");
      formData.append("duration", String(Math.max(1, Math.ceil(duration))));

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
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

      setTranscript(data.text);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function copyToClipboard() {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
    }
  }

  const hasAudio = audioBlob || uploadedFile;

  return (
    <>
      <ToolHeader />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", paddingBottom: 60 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Transcription</h1>
        <p style={{ color: "#888" }}>Ask Evo to convert any audio into text instantly.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ padding: 24, borderRadius: 12, border: "1px solid #333", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Record from microphone</p>
            {recording && (
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444", marginBottom: 12, fontVariantNumeric: "tabular-nums" }}>
                {formatTime(duration)}
              </div>
            )}
            {!recording ? (
              <button
                type="button"
                onClick={startRecording}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                🎙️ Start Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>

          <div style={{ padding: 24, borderRadius: 12, border: "1px solid #333", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Upload an audio file</p>
            <label style={{ display: "block", width: "100%", padding: "12px", borderRadius: 8, border: "1px dashed #444", color: "#888", fontSize: 13, cursor: "pointer", textAlign: "center" }}>
              {uploadedFile ? uploadedFile.name : "Click to upload MP3, WAV, M4A, WEBM"}
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        {audioUrl && (
          <div style={{ padding: 16, borderRadius: 12, border: "1px solid #333", background: "rgba(34,197,94,0.05)" }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>Preview:</p>
            <audio controls src={audioUrl} style={{ width: "100%" }} />
          </div>
        )}

        {hasAudio && (
          <button
            type="button"
            onClick={handleTranscribe}
            disabled={loading}
            style={{ padding: "14px", borderRadius: 8, border: "none", background: loading ? "#333" : "linear-gradient(135deg, #22c55e, #16a34a)", color: loading ? "#666" : "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Transcribing..." : `Transcribe — ${creditCost} credits`}
          </button>
        )}

        {error && (
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
            {error}
            {error.includes("credits") && (
              <Link href="/credits" style={{ marginLeft: 8, textDecoration: "underline", color: "#22c55e" }}>Buy more credits</Link>
            )}
          </div>
        )}

        {transcript && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: 20, borderRadius: 12, border: "1px solid #333", background: "rgba(34,197,94,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "#888" }}>Transcript:</p>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#888", fontSize: 12, cursor: "pointer" }}
                >
                  Copy
                </button>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{transcript}</p>
            </div>
          </div>
        )}

      </div>

      </div>
    </>
  );
}

// -----------------------------------------------------------
// END OF FILE - app/(chat)/transcribe/page.tsx (v2 - no model note)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
