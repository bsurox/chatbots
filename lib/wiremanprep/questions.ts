// FILE: lib/wiremanprep/questions.ts

// WiremanPrep data model + helpers (v1). Mirrors the ForemanPrep
// pattern (questions.ts / blquestions.ts): the 153 questions live
// in ./bank (landed first, self-contained); this file adds the
// domain list, the set builders, the official exam weights, and
// the fixed free sample. The shuffle helper is a local copy ON
// PURPOSE - importing one from lib/foremanprep would drag a
// ForemanPrep bank into every WiremanPrep bundle.

import { WM_BANK, type WmDomainKey, type WmQuestion } from "./bank";

export type { WmDomainKey, WmQuestion } from "./bank";

export type WmDomain = {
  key: WmDomainKey;
  name: string;
  examCount: number;
};

// The 9 subject areas of the NASCLA Master/Unlimited electrical
// exam, with the OFFICIAL item counts from the PSI content
// outline (they sum to 100 - the real exam's scored length).
// examCount drives the 1:1 simulator draw.
export const WM_DOMAINS: WmDomain[] = [
  { key: "pd", name: "Project Design & Management", examCount: 8 },
  { key: "sf", name: "Safety", examCount: 9 },
  { key: "th", name: "Electrical Theory & Principles", examCount: 11 },
  { key: "gc", name: "General Code Requirements", examCount: 17 },
  { key: "wp", name: "Wiring & Protection", examCount: 17 },
  { key: "wm", name: "Wiring Methods & Materials", examCount: 16 },
  { key: "eq", name: "Equipment for General Use", examCount: 13 },
  { key: "sp", name: "Special Occupancies, Equipment & Conditions", examCount: 8 },
  { key: "cm", name: "Communication Systems", examCount: 1 },
];

export function getWmDomain(key: string): WmDomain | null {
  return WM_DOMAINS.find((d) => d.key === key) ?? null;
}

export const WM_QUESTIONS: WmQuestion[] = WM_BANK;

// ---- Helpers -----------------------------------------------------

export function wmQuestionsByDomain(key: WmDomainKey): WmQuestion[] {
  return WM_QUESTIONS.filter((q) => q.domain === key);
}

export function getWmQuestion(id: string): WmQuestion | null {
  return WM_QUESTIONS.find((q) => q.id === id) ?? null;
}

function wmShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A practice set: one domain or the whole pool, shuffled, capped.
export function buildWmPracticeSet(key: WmDomainKey | "all", count: number): WmQuestion[] {
  const pool = key === "all" ? WM_QUESTIONS : wmQuestionsByDomain(key);
  return wmShuffle(pool).slice(0, count);
}

// ---- 1:1 exam simulator draw -------------------------------------

// Builds a 100-question set weighted exactly like the real exam:
// examCount questions drawn at random from each domain's pool,
// then the whole set shuffled so domains interleave the way PSI
// mixes them. The bank carries at least 1.5x every domain's
// examCount, so no draw ever comes up short.
export function buildWmExamSet(): WmQuestion[] {
  const drawn: WmQuestion[] = [];
  for (const d of WM_DOMAINS) {
    drawn.push(...wmShuffle(wmQuestionsByDomain(d.key)).slice(0, d.examCount));
  }
  return wmShuffle(drawn);
}

// ---- Free sample round -------------------------------------------

// The free tier always serves this exact set - the first question
// of each of the 9 domains plus a second General Code question to
// round out ten. Same doctrine as ForemanPrep's demo sets: a
// rotating sample would leak the bank ten questions at a time; a
// fixed sample stays a taste.
export const WM_DEMO_IDS: string[] = [
  "wm-pd-001",
  "wm-sf-001",
  "wm-th-001",
  "wm-gc-001",
  "wm-gc-002",
  "wm-wp-001",
  "wm-wm-001",
  "wm-eq-001",
  "wm-sp-001",
  "wm-cm-001",
];

export function buildWmDemoSet(): WmQuestion[] {
  return WM_DEMO_IDS
    .map((id) => getWmQuestion(id))
    .filter((q): q is WmQuestion => q !== null);
}

// -----------------------------------------------------------
// END OF FILE - lib/wiremanprep/questions.ts (v1 - domains w/
// official exam weights, builders, 1:1 exam draw, fixed demo)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
