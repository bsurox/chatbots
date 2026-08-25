// FILE: lib/foremanprep/blquestions.ts

// ForemanPrep Business & Law data model + helpers (v1). Mirrors
// questions.ts for the GC exam: the 120 questions live in
// ./blbank (which landed first and is self-contained); this file
// adds the domain list, the set builders, and the fixed free
// sample. The shuffle helper is a local copy ON PURPOSE - pulling
// it from ./questions would drag the whole 156-question GC bank
// into every bundle that only needs Business & Law.

import { BL_BANK, type BlDomainKey, type BlQuestion } from "./blbank";

export type { BlDomainKey, BlQuestion } from "./blbank";

export type BlDomain = {
  key: BlDomainKey;
  name: string;
};

// The 10 core Business & Law domains - the shared body that every
// state's B&L exam draws from. No per-state question counts are
// claimed here: state exams weight these differently, and v1
// teaches the material, not one state's blueprint.
export const BL_DOMAINS: BlDomain[] = [
  { key: "li", name: "Licensing & Business Organization" },
  { key: "eb", name: "Estimating & Bidding" },
  { key: "ct", name: "Contracts" },
  { key: "pj", name: "Project Management & Scheduling" },
  { key: "ib", name: "Insurance & Bonding" },
  { key: "lb", name: "Labor & Employment Law" },
  { key: "fm", name: "Financial Management" },
  { key: "tx", name: "Taxes & Payroll" },
  { key: "ln", name: "Liens & Payment" },
  { key: "sf", name: "Safety & OSHA" },
];

export function getBlDomain(key: string): BlDomain | null {
  return BL_DOMAINS.find((d) => d.key === key) ?? null;
}

export const BL_QUESTIONS: BlQuestion[] = BL_BANK;

// ---- Helpers -----------------------------------------------------

export function blQuestionsByDomain(key: BlDomainKey): BlQuestion[] {
  return BL_QUESTIONS.filter((q) => q.domain === key);
}

export function getBlQuestion(id: string): BlQuestion | null {
  return BL_QUESTIONS.find((q) => q.id === id) ?? null;
}

function blShuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A practice set: one domain or the whole pool, shuffled, capped.
export function buildBlPracticeSet(key: BlDomainKey | "all", count: number): BlQuestion[] {
  const pool = key === "all" ? BL_QUESTIONS : blQuestionsByDomain(key);
  return blShuffle(pool).slice(0, count);
}

// ---- Free sample round -------------------------------------------

// The free tier always serves this exact set - the first question
// of each domain, same ten, same order, every time. Same doctrine
// as the GC demo set: a rotating sample would leak the bank ten
// questions at a time; a fixed sample stays a taste.
export const BL_DEMO_IDS: string[] = [
  "bl-li-001",
  "bl-eb-001",
  "bl-ct-001",
  "bl-pj-001",
  "bl-ib-001",
  "bl-lb-001",
  "bl-fm-001",
  "bl-tx-001",
  "bl-ln-001",
  "bl-sf-001",
];

export function buildBlDemoSet(): BlQuestion[] {
  return BL_DEMO_IDS
    .map((id) => getBlQuestion(id))
    .filter((q): q is BlQuestion => q !== null);
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/blquestions.ts (v1 - domains,
// builders, fixed demo set)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
