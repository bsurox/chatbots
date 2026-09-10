// FILE: lib/wiremanprep/jquestions.ts

// WiremanPrep JOURNEYMAN data model + helpers (v1). Mirrors
// questions.ts (the Master wrapper): the 150 questions live in
// ./jbank (landed first, self-contained); this file adds the
// domain list, the set builders, the official exam weights, and
// the fixed free sample. The shuffle helper is a local copy ON
// PURPOSE - importing one from another product file would drag
// that bank into every Journeyman bundle.

import { WJ_BANK, type WjDomainKey, type WjQuestion } from "./jbank";

export type { WjDomainKey, WjQuestion } from "./jbank";

export type WjDomain = {
  key: WjDomainKey;
  name: string;
  examCount: number;
};

// The 10 subject areas of the NASCLA Journeyman Electricians
// exam, with the OFFICIAL item counts from the PSI content
// outline (CIB 6677 rev 7/7/2026; they sum to 100 - the real
// exam's scored length). examCount drives the 1:1 simulator draw.
export const WJ_DOMAINS: WjDomain[] = [
  { key: "pl", name: "Interpreting Plans & Specifications", examCount: 6 },
  { key: "sf", name: "Basic Electrical Safety", examCount: 8 },
  { key: "th", name: "Electrical Theory & Principles", examCount: 10 },
  { key: "tt", name: "Testing & Troubleshooting", examCount: 7 },
  { key: "gc", name: "General Code Requirements", examCount: 15 },
  { key: "wp", name: "Wiring & Protection", examCount: 18 },
  { key: "wm", name: "Wiring Methods & Materials", examCount: 16 },
  { key: "eq", name: "Equipment for General Use", examCount: 10 },
  { key: "sp", name: "Special Occupancies & Special Equipment", examCount: 8 },
  { key: "cc", name: "Special Conditions & Communication Systems", examCount: 2 },
];

export function getWjDomain(key: string): WjDomain | null {
  return WJ_DOMAINS.find((d) => d.key === key) ?? null;
}

export const WJ_QUESTIONS: WjQuestion[] = WJ_BANK;

// ---- Helpers -----------------------------------------------------

export function wjQuestionsByDomain(key: WjDomainKey): WjQuestion[] {
  return WJ_QUESTIONS.filter((q) => q.domain === key);
}

export function getWjQuestion(id: string): WjQuestion | null {
  return WJ_QUESTIONS.find((q) => q.id === id) ?? null;
}

function wjShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A practice set: one domain or the whole pool, shuffled, capped.
export function buildWjPracticeSet(key: WjDomainKey | "all", count: number): WjQuestion[] {
  const pool = key === "all" ? WJ_QUESTIONS : wjQuestionsByDomain(key);
  return wjShuffle(pool).slice(0, count);
}

// ---- 1:1 exam simulator draw -------------------------------------

// Builds a 100-question set weighted exactly like the real exam:
// examCount questions drawn at random from each domain's pool,
// then the whole set shuffled so domains interleave the way PSI
// mixes them. The bank carries at least 1.5x every domain's
// examCount, so no draw ever comes up short.
export function buildWjExamSet(): WjQuestion[] {
  const drawn: WjQuestion[] = [];
  for (const d of WJ_DOMAINS) {
    drawn.push(...wjShuffle(wjQuestionsByDomain(d.key)).slice(0, d.examCount));
  }
  return wjShuffle(drawn);
}

// ---- Free sample round -------------------------------------------

// The free tier always serves this exact set - the first question
// of each of the 10 domains. Same doctrine as the Master and
// ForemanPrep demo sets: a rotating sample would leak the bank
// ten questions at a time; a fixed sample stays a taste.
export const WJ_DEMO_IDS: string[] = [
  "wj-pl-001",
  "wj-sf-001",
  "wj-th-001",
  "wj-tt-001",
  "wj-gc-001",
  "wj-wp-001",
  "wj-wm-001",
  "wj-eq-001",
  "wj-sp-001",
  "wj-cc-001",
];

export function buildWjDemoSet(): WjQuestion[] {
  return WJ_DEMO_IDS
    .map((id) => getWjQuestion(id))
    .filter((q): q is WjQuestion => q !== null);
}

// -----------------------------------------------------------
// END OF FILE - lib/wiremanprep/jquestions.ts (v1 - Journeyman
// domains w/ official exam weights, builders, 1:1 exam draw,
// fixed 10-question demo)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
