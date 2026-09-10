// FILE: lib/wiremanprep/rquestions.ts

// WiremanPrep RESIDENTIAL data model + helpers (v1). Mirrors
// questions.ts (the Master wrapper): the 153 questions live in
// ./rbank (landed first, self-contained); this file adds the
// domain list, the set builders, the official exam weights, and
// the fixed free sample. The shuffle helper is a local copy ON
// PURPOSE - importing one from another product file would drag
// that bank into every Residential bundle.

import { WR_BANK, type WrDomainKey, type WrQuestion } from "./rbank";

export type { WrDomainKey, WrQuestion } from "./rbank";

export type WrDomain = {
  key: WrDomainKey;
  name: string;
  examCount: number;
};

// The 10 subject areas of the NASCLA Residential Electrical
// Contractors trade exam, with the OFFICIAL item counts from the
// PSI content outline (CIB 6677 rev 7/7/2026; they sum to 100 -
// the real exam's scored length). examCount drives the 1:1
// simulator draw.
export const WR_DOMAINS: WrDomain[] = [
  { key: "th", name: "Theory", examCount: 9 },
  { key: "sf", name: "Personal / Jobsite Safety", examCount: 8 },
  { key: "pd", name: "Project Design, Estimating & Management", examCount: 8 },
  { key: "gb", name: "Grounding & Bonding", examCount: 14 },
  { key: "ss", name: "Special Systems & Special Equipment", examCount: 7 },
  { key: "tl", name: "Tools & Test Equipment", examCount: 7 },
  { key: "cp", name: "Circuit Protection & Installation", examCount: 16 },
  { key: "wm", name: "Wiring Methods & Practices", examCount: 17 },
  { key: "eq", name: "Equipment for General Use", examCount: 13 },
  { key: "ee", name: "Energy Efficiency / Management", examCount: 1 },
];

export function getWrDomain(key: string): WrDomain | null {
  return WR_DOMAINS.find((d) => d.key === key) ?? null;
}

export const WR_QUESTIONS: WrQuestion[] = WR_BANK;

// ---- Helpers -----------------------------------------------------

export function wrQuestionsByDomain(key: WrDomainKey): WrQuestion[] {
  return WR_QUESTIONS.filter((q) => q.domain === key);
}

export function getWrQuestion(id: string): WrQuestion | null {
  return WR_QUESTIONS.find((q) => q.id === id) ?? null;
}

function wrShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A practice set: one domain or the whole pool, shuffled, capped.
export function buildWrPracticeSet(key: WrDomainKey | "all", count: number): WrQuestion[] {
  const pool = key === "all" ? WR_QUESTIONS : wrQuestionsByDomain(key);
  return wrShuffle(pool).slice(0, count);
}

// ---- 1:1 exam simulator draw -------------------------------------

// Builds a 100-question set weighted exactly like the real exam:
// examCount questions drawn at random from each domain's pool,
// then the whole set shuffled so domains interleave the way PSI
// mixes them. The bank carries at least 1.5x every domain's
// examCount, so no draw ever comes up short.
export function buildWrExamSet(): WrQuestion[] {
  const drawn: WrQuestion[] = [];
  for (const d of WR_DOMAINS) {
    drawn.push(...wrShuffle(wrQuestionsByDomain(d.key)).slice(0, d.examCount));
  }
  return wrShuffle(drawn);
}

// ---- Free sample round -------------------------------------------

// The free tier always serves this exact set - the first question
// of each of the 10 domains. Same doctrine as the Master and
// ForemanPrep demo sets: a rotating sample would leak the bank
// ten questions at a time; a fixed sample stays a taste.
export const WR_DEMO_IDS: string[] = [
  "wr-th-001",
  "wr-sf-001",
  "wr-pd-001",
  "wr-gb-001",
  "wr-ss-001",
  "wr-tl-001",
  "wr-cp-001",
  "wr-wm-001",
  "wr-eq-001",
  "wr-ee-001",
];

export function buildWrDemoSet(): WrQuestion[] {
  return WR_DEMO_IDS
    .map((id) => getWrQuestion(id))
    .filter((q): q is WrQuestion => q !== null);
}

// -----------------------------------------------------------
// END OF FILE - lib/wiremanprep/rquestions.ts (v1 - Residential
// domains w/ official exam weights, builders, 1:1 exam draw,
// fixed 10-question demo)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
