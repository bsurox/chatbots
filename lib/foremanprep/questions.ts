// FILE: lib/foremanprep/questions.ts

// ForemanPrep question data model + helpers. The 12 subjects and
// their official counts mirror the PSI content outline for the
// NASCLA Commercial General Building Contractor exam (115 total).
// The questions themselves live in ./bank (imported below) so the
// bank can grow without touching this file. Everything here -
// types, DOMAINS, and the set/exam builders - stays put.

import { BANK } from "./bank";

export type DomainKey =
  | "procurement"
  | "general"
  | "site"
  | "concrete"
  | "metals"
  | "mep"
  | "wood"
  | "thermal"
  | "finishes"
  | "masonry"
  | "doors"
  | "electrical";

export type ForemanDomain = {
  key: DomainKey;
  name: string;
  examCount: number;
};

export type ForemanQuestion = {
  id: string;
  domain: DomainKey;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  cite: string;
};

// Official outline weights - 115 questions on the real exam.
export const DOMAINS: ForemanDomain[] = [
  { key: "procurement", name: "Procurement & Contracting", examCount: 31 },
  { key: "general", name: "General Requirements & Safety", examCount: 25 },
  { key: "site", name: "Site Construction", examCount: 15 },
  { key: "concrete", name: "Concrete", examCount: 6 },
  { key: "metals", name: "Metals", examCount: 6 },
  { key: "mep", name: "Mechanical & Plumbing", examCount: 6 },
  { key: "wood", name: "Wood", examCount: 5 },
  { key: "thermal", name: "Thermal & Moisture Protection", examCount: 5 },
  { key: "finishes", name: "Finishes", examCount: 5 },
  { key: "masonry", name: "Masonry", examCount: 4 },
  { key: "doors", name: "Doors, Windows & Glazing", examCount: 4 },
  { key: "electrical", name: "Electrical Systems", examCount: 3 },
];

export function getDomain(key: string): ForemanDomain | null {
  return DOMAINS.find((d) => d.key === key) ?? null;
}

// The full bank lives in ./bank; this module just re-exports it
// so existing imports of QUESTIONS keep working unchanged.
export const QUESTIONS: ForemanQuestion[] = BANK;

// ---- Helpers -----------------------------------------------------

export function questionsByDomain(key: DomainKey): ForemanQuestion[] {
  return QUESTIONS.filter((q) => q.domain === key);
}

export function getQuestion(id: string): ForemanQuestion | null {
  return QUESTIONS.find((q) => q.id === id) ?? null;
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A practice set: one subject or the whole pool, shuffled, capped.
export function buildPracticeSet(key: DomainKey | "all", count: number): ForemanQuestion[] {
  const pool = key === "all" ? QUESTIONS : questionsByDomain(key);
  return shuffle(pool).slice(0, count);
}

// A full mock exam form: official per-subject counts, or as many as
// the bank holds while batches are still landing. Order is shuffled
// within the whole form, like the real thing feels.
export function buildExamForm(): ForemanQuestion[] {
  const form: ForemanQuestion[] = [];
  for (const d of DOMAINS) {
    form.push(...shuffle(questionsByDomain(d.key)).slice(0, d.examCount));
  }
  return shuffle(form);
}

// ============================================================
// END OF FILE - lib/foremanprep/questions.ts (v2 - bank split out)
// If you can see this comment, the paste was not truncated.
// ============================================================
