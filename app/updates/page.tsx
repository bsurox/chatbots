"use client";

import Link from "next/link";
import { useState } from "react";
import { GemIcon } from "@/components/chat/gem-icon";
import { PATCH_NOTES, type PatchNote } from "./updates-data";

export default function UpdatesPage() {
  const [selected, setSelected] = useState<PatchNote | null>(null);
  const notes = [...PATCH_NOTES].sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <header className="mb-10">
          <Link className="mb-6 inline-flex items-center gap-2" href="/">
            <span className="flex size-9 items-center justify-center rounded-xl border border-primary/50 bg-primary/10">
              <GemIcon className="size-4 text-amber-400" />
            </span>
            <span className="font-semibold text-foreground text-lg">AskEvo</span>
          </Link>
          <h1 className="font-bold text-3xl">Dev Updates</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Patch notes and behind-the-scenes changes, straight from the workshop.
          </p>
        </header>

        {selected ? (
          <article>
            <button
              className="mb-6 font-medium text-primary text-sm underline-offset-4 hover:underline"
              onClick={() => setSelected(null)}
              type="button"
            >
              Back to all updates
            </button>
            <p className="font-medium text-primary text-sm">{selected.date}</p>
            <h2 className="mt-1 font-bold text-2xl">{selected.title}</h2>
            <p className="mt-1.5 text-muted-foreground text-sm">{selected.tagline}</p>
            <div className="mt-6 whitespace-pre-wrap text-[15px] text-foreground/90 leading-7">
              {selected.body}
            </div>
            <button
              className="mt-10 font-medium text-primary text-sm underline-offset-4 hover:underline"
              onClick={() => setSelected(null)}
              type="button"
            >
              Back to all updates
            </button>
          </article>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.map((note) => (
              <button
                className="rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/50"
                key={note.slug}
                onClick={() => setSelected(note)}
                type="button"
              >
                <p className="font-medium text-primary text-sm">{note.date}</p>
                <h2 className="mt-1 font-semibold text-lg">{note.title}</h2>
                <p className="mt-1.5 text-muted-foreground text-sm">{note.tagline}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// END OF FILE - app/updates/page.tsx (v1)
// If you can see this comment, the paste was not truncated.
// ============================================================
