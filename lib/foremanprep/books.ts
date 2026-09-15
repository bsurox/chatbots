// FILE: lib/foremanprep/books.ts
import { BANK } from "./bank";
import type { ForemanQuestion } from "./questions";

// Study by the book (v1). Every question in the GC bank already
// carries a cite naming the approved reference it comes from; this
// file turns those citations into a second way to practice - pick
// the book you are holding and drill only the questions that live
// in it. Born from a customer suggestion: on an open-book exam,
// knowing your way around a specific book IS the skill.
// The mapping runs off cite PREFIXES, so bank batches keep working
// as they land - a new question whose cite starts with a known
// book title files itself. Anything unrecognized falls into the
// "other" bucket, which stays hidden while empty; if it ever shows
// up in the room, a cite got misspelled and this table needs a
// line. The book selection guide page (later round) reads this
// same table, so the room and the guide can never disagree.

export type FpBook = { key: string; title: string; short: string };

// Ordered by how much of the bank each book carries - the order
// the tiles render in. Titles match the NASCLA approved reference
// list spellings.
const BOOK_DEFS: Array<FpBook> = [
  { key: "nascla", title: "NASCLA Contractors Guide to Business, Law and Project Management", short: "NASCLA Contractors Guide" },
  { key: "ppcc", title: "Principles and Practices of Commercial Construction", short: "Principles & Practices" },
  { key: "mesys", title: "Mechanical and Electrical Systems for Construction Managers", short: "Mechanical & Electrical Systems" },
  { key: "osha", title: "OSHA 29 CFR 1926 Construction Standards", short: "OSHA Standards" },
  { key: "concrete", title: "Contractor's Guide to Quality Concrete Construction", short: "Quality Concrete" },
  { key: "crsi", title: "Placing Reinforcing Bars (CRSI)", short: "Placing Reinforcing Bars" },
  { key: "carpentry", title: "Carpentry and Building Construction", short: "Carpentry & Building" },
  { key: "gypsum", title: "The Gypsum Construction Handbook", short: "Gypsum Handbook" },
  { key: "masonry", title: "Modern Masonry", short: "Modern Masonry" },
  { key: "ibc", title: "International Building Code (IBC)", short: "IBC" },
  { key: "other", title: "Other approved references", short: "Other references" },
];

// First matching prefix wins; longest, most specific rules first.
const CITE_RULES: Array<[string, string]> = [
  ["NASCLA", "nascla"],
  ["Principles & Practices", "ppcc"],
  ["Principles and Practices", "ppcc"],
  ["Mechanical & Electrical", "mesys"],
  ["Mechanical and Electrical", "mesys"],
  ["OSHA", "osha"],
  ["29 CFR", "osha"],
  ["Contractor's Guide to Quality Concrete", "concrete"],
  ["Placing Reinforcing Bars", "crsi"],
  ["Carpentry", "carpentry"],
  ["Gypsum", "gypsum"],
  ["Modern Masonry", "masonry"],
  ["IBC", "ibc"],
];

export function bookKeyForCite(cite: string | undefined): string {
  const c = (cite ?? "").trim();
  for (const [prefix, key] of CITE_RULES) {
    if (c.startsWith(prefix)) return key;
  }
  return "other";
}

// Computed once at load: which questions belong to which book.
const IDS_BY_BOOK: Record<string, Array<string>> = {};
for (const q of BANK) {
  const key = bookKeyForCite((q as { cite?: string }).cite);
  if (!IDS_BY_BOOK[key]) IDS_BY_BOOK[key] = [];
  IDS_BY_BOOK[key].push(q.id);
}

export type FpBookWithCount = FpBook & { count: number };

// The tiles the practice room renders: every book that actually
// holds questions, in BOOK_DEFS order, with its live count.
export const FP_BOOKS: Array<FpBookWithCount> = BOOK_DEFS.map((b) => ({
  ...b,
  count: (IDS_BY_BOOK[b.key] ?? []).length,
})).filter((b) => b.count > 0);

function shuffle<T>(arr: Array<T>): Array<T> {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function questionsByBook(key: string): Array<ForemanQuestion> {
  const ids = new Set(IDS_BY_BOOK[key] ?? []);
  return BANK.filter((q) => ids.has(q.id));
}

export function buildBookSet(key: string, count: number): Array<ForemanQuestion> {
  return shuffle(questionsByBook(key)).slice(0, count);
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/books.ts (v1 - study by the book)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
