// FILE: lib/foremanprep/questions.ts

// ForemanPrep question bank foundation. The 12 subjects and their
// official question counts mirror the PSI content outline for the
// NASCLA Commercial General Building Contractor exam (115 total).
// Questions live in the repo as data - same philosophy as the
// updates page - so every batch is reviewed, versioned, and fixable
// with a single commit. v1 carries a starter set to prove the whole
// pipeline; the full bank arrives in per-subject batches that append
// to SAMPLE_QUESTIONS' successor files.

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

// ---- Starter bank (batch 0 - proves the pipeline) ----------------

export const QUESTIONS: ForemanQuestion[] = [
  {
    id: "pc-001",
    domain: "procurement",
    q: "What does a bid bond guarantee to the project owner?",
    choices: [
      "That the contractor's work will be free of defects for one year",
      "That the bidder, if awarded the contract, will enter into it and provide the required bonds",
      "That all subcontractors on the project will be paid",
      "That the project will finish on schedule",
    ],
    answer: 1,
    explain:
      "A bid bond backs the bid itself: if the winning bidder walks away or cannot provide the required performance and payment bonds, the owner can claim against the bid bond. It does not cover schedule, defects, or subcontractor payment.",
    cite: "NASCLA Contractors Guide, Bidding chapter",
  },
  {
    id: "pc-002",
    domain: "procurement",
    q: "A performance bond primarily protects which party?",
    choices: [
      "The contractor, against nonpayment by the owner",
      "The surety company, against contractor default",
      "The owner, against the contractor failing to complete the work per the contract",
      "The lender, against cost overruns",
    ],
    answer: 2,
    explain:
      "A performance bond gives the owner a financial backstop if the contractor defaults: the surety must see the work completed or cover the loss. Payment protection for subs and suppliers is the separate payment bond.",
    cite: "NASCLA Contractors Guide, Bonds section",
  },
  {
    id: "pc-003",
    domain: "procurement",
    q: "In a construction contract, retainage is best described as:",
    choices: [
      "A penalty deducted for late completion",
      "A portion of each progress payment withheld until the work is satisfactorily complete",
      "The contractor's markup on materials",
      "A deposit the owner pays before work begins",
    ],
    answer: 1,
    explain:
      "Retainage (commonly 5-10%) is held back from each progress payment to keep leverage for completion and correction of the work, and is released per the contract terms at or near final completion.",
    cite: "NASCLA Contractors Guide, Contract Provisions chapter",
  },
  {
    id: "pc-004",
    domain: "procurement",
    q: "Which document is used to formally modify the scope, price, or time of an existing construction contract?",
    choices: [
      "A submittal",
      "A request for information (RFI)",
      "A change order",
      "A punch list",
    ],
    answer: 2,
    explain:
      "A change order is the written, agreed modification to the contract. An RFI asks a question, a submittal proposes materials or methods, and a punch list tracks closeout corrections - none of them change the contract by themselves.",
    cite: "NASCLA Contractors Guide, Changes chapter",
  },
  {
    id: "gr-001",
    domain: "general",
    q: "Under OSHA construction standards, fall protection is generally required when employees work at or above what height above a lower level?",
    choices: ["4 feet", "6 feet", "8 feet", "10 feet"],
    answer: 1,
    explain:
      "The general construction trigger is 6 feet (29 CFR 1926.501(b)(1)). The 4-foot figure belongs to general industry, not construction - a classic distractor on this exam.",
    cite: "OSHA 29 CFR 1926, Subpart M",
  },
  {
    id: "gr-002",
    domain: "general",
    q: "OSHA defines a 'competent person' as someone who:",
    choices: [
      "Holds a degree in construction management or engineering",
      "Has at least ten years of trade experience",
      "Can identify existing and predictable hazards AND has authority to take prompt corrective action",
      "Has completed an OSHA 30-hour course",
    ],
    answer: 2,
    explain:
      "The definition (29 CFR 1926.32(f)) has two prongs: capability of identifying hazards and the authority to correct them. Training and experience help, but neither is the definition.",
    cite: "OSHA 29 CFR 1926.32(f)",
  },
  {
    id: "gr-003",
    domain: "general",
    q: "On a project schedule, the critical path is:",
    choices: [
      "The sequence of activities with the most safety risk",
      "The longest chain of dependent activities, which sets the shortest possible project duration",
      "The list of activities assigned to the general contractor's own crews",
      "The tasks with the highest cost",
    ],
    answer: 1,
    explain:
      "Any delay to a critical-path activity delays the whole job, because that chain has zero float. Cost, risk, and who performs the work are separate questions.",
    cite: "Construction Project Management, scheduling chapter",
  },
  {
    id: "sc-001",
    domain: "site",
    q: "Under OSHA, a trench must be protected by a system such as sloping, shoring, or a trench box when it reaches what depth (unless it is entirely in stable rock)?",
    choices: ["3 feet", "4 feet", "5 feet", "6 feet"],
    answer: 2,
    explain:
      "Excavations 5 feet deep or more require a protective system (29 CFR 1926.652). At 4 feet, a means of egress within 25 feet of lateral travel is the requirement to remember.",
    cite: "OSHA 29 CFR 1926, Subpart P",
  },
  {
    id: "co-001",
    domain: "concrete",
    q: "The main purpose of curing freshly placed concrete is to:",
    choices: [
      "Speed up drying so finishing can begin sooner",
      "Keep moisture and temperature in ranges that let the concrete gain its designed strength",
      "Prevent rebar from rusting during placement",
      "Reduce the amount of cement needed in the mix",
    ],
    answer: 1,
    explain:
      "Strength comes from cement hydration, which needs water and workable temperatures over time. Letting concrete dry out early stops hydration and permanently costs strength - curing is about keeping water in, not drying out.",
    cite: "Contractor's Guide to Quality Concrete Construction",
  },
  {
    id: "el-001",
    domain: "electrical",
    q: "On construction sites, ground-fault circuit interrupter (GFCI) protection for receptacle outlets exists primarily to:",
    choices: [
      "Protect tools from power surges",
      "Prevent breakers from nuisance-tripping",
      "Protect workers from electric shock caused by ground faults",
      "Reduce energy use on temporary power",
    ],
    answer: 2,
    explain:
      "A GFCI compares outgoing and returning current and opens the circuit in a fraction of a second when current leaks to ground - through a person, a damaged cord, or wet conditions. It is a life-safety device, not equipment protection.",
    cite: "OSHA 29 CFR 1926, Subpart K",
  },
];

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
// END OF FILE - lib/foremanprep/questions.ts (v1 - batch 0)
// If you can see this comment, the paste was not truncated.
// ============================================================
