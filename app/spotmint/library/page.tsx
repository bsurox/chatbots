"use client";
import "../spotmint.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BRAND } from "../brand";

// Library tab: the signed-in user's recent finished ads, served by
// /api/video/history (ten newest; anything aged off fal's storage
// drops out server-side). Every item carries the same Save and Share
// actions as a fresh render: Save in the app opens the native share
// sheet with the actual file (Save Video / Save to Files), Save on
// the web downloads directly, Share sends the link. Reachable only
// by direct URL until tabs v2 adds the fifth slot.

type LibraryVideo = { requestId: string; createdAt: string; videoUrl: string };

export default function SpotmintLibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<LibraryVideo[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [isApp, setIsApp] = useState(false);
  const [saveLabels, setSaveLabels] = useState<Record<string, string>>({});
  const [shareLabels, setShareLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    if ((window as { Capacitor?: unknown }).Capacitor) {
      setIsApp(true);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/register?redirectUrl=/spotmint/library");
      return;
    }
    if (/^guest-\d+$/.test(session.user.email ?? "")) {
      router.push("/register?redirectUrl=/spotmint/library");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/video/history");
        const data = await res.json();
        if (!cancelled) setVideos(Array.isArray(data.videos) ? data.videos : []);
      } catch {
        if (!cancelled) {
          setVideos([]);
          setLoadErr(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, status, router]);

  function setSaveLabel(id: string, value: string) {
    setSaveLabels((prev) => ({ ...prev, [id]: value }));
  }
  function setShareLabel(id: string, value: string) {
    setShareLabels((prev) => ({ ...prev, [id]: value }));
  }

  async function saveVideo(id: string, url: string) {
    if ((saveLabels[id] ?? "Save") !== "Save") return;
    setSaveLabel(id, "Preparing...");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      const blob = await res.blob();
      const file = new File([blob], "spotmint-ad.mp4", { type: blob.type || "video/mp4" });
      if (isApp) {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          setSaveLabel(id, "Saved");
        } else {
          throw new Error("file share unavailable");
        }
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "spotmint-ad.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        setSaveLabel(id, "Saved");
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        setSaveLabel(id, "Save");
        return;
      }
      if (!isApp) {
        window.open(url, "_blank");
        setSaveLabel(id, "Save");
        return;
      }
      setSaveLabel(id, "Save failed");
    }
    setTimeout(() => setSaveLabel(id, "Save"), 2200);
  }

  async function shareVideo(id: string, url: string) {
    try {
      if (navigator.share) {
        await navigator.share({ title: BRAND.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel(id, "Link copied");
      setTimeout(() => setShareLabel(id, "Share"), 2000);
    } catch {
      // user cancelled the share sheet - nothing to do
    }
  }

  if (status === "loading") {
    return <div className="sp-wrap"><p style={{ color: "#888" }}>Loading...</p></div>;
  }
  if (!session?.user || /^guest-\d+$/.test(session?.user?.email ?? "")) {
    return null;
  }

  return (
    <div className="sp-wrap">
      <div className="sp-top">
        <div className="sp-brand">Spot<span>mint</span></div>
      </div>
      <p className="sp-tag">Your recent ads</p>

      {videos === null && <p style={{ color: "#888" }}>Loading your ads...</p>}

      {videos !== null && videos.length === 0 && (
        <div>
          {loadErr ? (
            <div className="sp-err">Could not load your ads right now. Please try again in a moment.</div>
          ) : (
            <p className="sp-mm">No ads here yet. Finished ads show up in your library automatically - older ones retire as the files age off storage.</p>
          )}
          <button type="button" className="sp-gen" style={{ marginTop: 14 }} onClick={() => router.push("/spotmint")}>
            Create an ad
          </button>
        </div>
      )}

      {videos !== null &&
        videos.map((v) => (
          <div key={v.requestId} style={{ marginBottom: 26 }}>
            <p className="sp-done">
              {new Date(v.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </p>
            <video className="sp-video" controls playsInline src={v.videoUrl} />
            <div className="sp-actions">
              <button type="button" className="sp-act" onClick={() => saveVideo(v.requestId, v.videoUrl)}>
                {saveLabels[v.requestId] ?? "Save"}
              </button>
              <button type="button" className="sp-act" onClick={() => shareVideo(v.requestId, v.videoUrl)}>
                {shareLabels[v.requestId] ?? "Share"}
              </button>
            </div>
          </div>
        ))}

      <p className="sp-note">{BRAND.poweredBy} - {BRAND.supportEmail}</p>
    </div>
  );
}

// ============================================================
// END OF FILE - app/spotmint/library/page.tsx (v1 - library tab)
// If you can see this comment, the paste was not truncated.
// ============================================================
