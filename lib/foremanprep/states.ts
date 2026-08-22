// FILE: lib/foremanprep/states.ts
import "server-only";

// ForemanPrep state library (v1) - the 17 state SEO pages. One
// entry per NASCLA-participating state: which agency accepts the
// exam, what it counts for THERE, what the state still requires
// (business/law exams etc.), score windows where they exist, and
// the official board site. Facts verified August 2026 against
// nascla.org's per-agency pages plus targeted checks per state
// (Arizona SRE, Georgia + Alabama business/law, California's
// out-of-state-only waiver, New Mexico's one-year letter, Oregon
// training-waiver, Utah experience-substitute). Where a detail
// could not be pinned to an official source, the copy points at
// the board instead of guessing. No prices anywhere - evergreen.
// Rendering: app/foremanprep/states/[slug]/page.tsx.

export type StateFact = { l: string; v: string };

export type StateSection = { h?: string; p?: string[] };

export type StateEntry = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  updated: string;
  boardLabel: string;
  boardUrl: string;
  intro: string[];
  facts: StateFact[];
  sections: StateSection[];
  related: string[];
};

export const STATES: StateEntry[] = [
  {
    slug: "alabama",
    name: "Alabama",
    metaTitle: "Alabama Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Alabama licensing: what it satisfies with the Alabama Licensing Board for General Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Alabama Contractor License",
    updated: "Updated August 2026",
    boardLabel: "genconbd.alabama.gov",
    boardUrl: "https://genconbd.alabama.gov",
    intro: [
      "Alabama is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Alabama Licensing Board for General Contractors, and what Alabama still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Alabama Licensing Board for General Contractors" },
      { l: "NASCLA counts for", v: "Building classifications (commercial)" },
      { l: "Still required", v: "the Alabama Business and Law exam" },
      { l: "Official board site", v: "genconbd.alabama.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Alabama",
        p: [
          "Building classifications (commercial general contracting). NASCLA itself confirms Alabama's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Alabama still requires",
        p: [
          "Alabama still runs its own Business and Law exam - every applicant takes it, NASCLA or not. It is open book and covers Alabama's contractor statutes, lien law, payroll, and safety rules.",
          "An Alabama general contractor license is generally required once a commercial project hits $50,000.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Alabama",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Alabama Licensing Board for General Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["arizona", "arkansas"],
  },
  {
    slug: "arizona",
    name: "Arizona",
    metaTitle: "Arizona Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Arizona licensing: what it satisfies with the Arizona Registrar of Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Arizona Contractor License",
    updated: "Updated August 2026",
    boardLabel: "roc.az.gov",
    boardUrl: "https://roc.az.gov",
    intro: [
      "Arizona is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Arizona Registrar of Contractors, and what Arizona still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Arizona Registrar of Contractors" },
      { l: "NASCLA counts for", v: "B-1 and B-2 commercial classifications" },
      { l: "Still required", v: "Arizona's Statutes and Rules Exam (SRE)" },
      { l: "NASCLA score window", v: "Within 2 years" },
      { l: "Official board site", v: "roc.az.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Arizona",
        p: [
          "B-1 and B-2 general commercial building classifications (accepted in lieu of the trade exam since November 2017). NASCLA itself confirms Arizona's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Arizona still requires",
        p: [
          "Arizona's own Statutes and Rules Exam (SRE) is always required and cannot be waived - it covers Arizona-specific law. The ROC also grants trade-exam waivers in some prior-license situations, so check your exact path with them.",
          "Your NASCLA transcript must be from within the past two years for Arizona.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Arizona",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Arizona Registrar of Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["arkansas", "california"],
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    metaTitle: "Arkansas Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Arkansas licensing: what it satisfies with the Arkansas Contractors Licensing Board, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Arkansas Contractor License",
    updated: "Updated August 2026",
    boardLabel: "labor.arkansas.gov",
    boardUrl: "https://labor.arkansas.gov/licensing/arkansas-contractors-licensing-board",
    intro: [
      "Arkansas is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Arkansas Contractors Licensing Board, and what Arkansas still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Arkansas Contractors Licensing Board" },
      { l: "NASCLA counts for", v: "Commercial license (also counts as experience)" },
      { l: "Still required", v: "the Arkansas Business and Law exam" },
      { l: "Official board site", v: "labor.arkansas.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Arkansas",
        p: [
          "Commercial contractor licensing - Arkansas also accepts a NASCLA pass in lieu of documenting experience on the application. NASCLA itself confirms Arkansas's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Arkansas still requires",
        p: [
          "Arkansas runs its own Business and Law exam alongside the trade credential, and the board reviews financials as part of the application.",
          "Unusual perk: Arkansas can accept the NASCLA pass in place of experience documentation on the application.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Arkansas",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Arkansas Contractors Licensing Board - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["california", "florida"],
  },
  {
    slug: "california",
    name: "California",
    metaTitle: "California Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits California licensing: what it satisfies with the Contractors State License Board (CSLB), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a California Contractor License",
    updated: "Updated August 2026",
    boardLabel: "cslb.ca.gov",
    boardUrl: "https://www.cslb.ca.gov",
    intro: [
      "California is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Contractors State License Board (CSLB), and what California still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Contractors State License Board (CSLB)" },
      { l: "NASCLA counts for", v: "B trade exam - out-of-state waiver only" },
      { l: "Still required", v: "the California Law and Business exam" },
      { l: "Official board site", v: "cslb.ca.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in California",
        p: [
          "The B General Building trade exam - but ONLY for out-of-state applicants who have held a comparable license in good standing for at least 5 years. NASCLA itself confirms California's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What California still requires",
        p: [
          "Everyone takes California's Law and Business exam - the NASCLA never replaces it. And California's door is narrower than other states: the B trade-exam waiver applies to out-of-state contractors with 5+ years licensed in good standing elsewhere, not to first-time California applicants.",
          "If you are building a multi-state plan, pass the NASCLA first, license up elsewhere, and California's waiver path opens after five years of good standing.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches California",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Contractors State License Board (CSLB) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["florida", "georgia"],
  },
  {
    slug: "florida",
    name: "Florida",
    metaTitle: "Florida Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Florida licensing: what it satisfies with the Construction Industry Licensing Board (DBPR), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Florida Contractor License",
    updated: "Updated August 2026",
    boardLabel: "myfloridalicense.com",
    boardUrl: "https://www2.myfloridalicense.com",
    intro: [
      "Florida is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Construction Industry Licensing Board (DBPR), and what Florida still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Construction Industry Licensing Board (DBPR)" },
      { l: "NASCLA counts for", v: "Certified General Contractor trade portion" },
      { l: "Still required", v: "Florida's Business/Finance exam and the Florida Building Code exam" },
      { l: "Official board site", v: "myfloridalicense.com" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Florida",
        p: [
          "The trade portion for Certified General Contractor licensure (accepted since March 2019). NASCLA itself confirms Florida's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Florida still requires",
        p: [
          "Florida keeps two of its own exam portions on top of the NASCLA: the Business and Finance exam and the Florida Building Code exam. The NASCLA replaces the trade portion only.",
          "Florida is one of the two biggest markets on the NASCLA list - the extra two portions are worth it.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Florida",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Construction Industry Licensing Board (DBPR) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["georgia", "louisiana"],
  },
  {
    slug: "georgia",
    name: "Georgia",
    metaTitle: "Georgia Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Georgia licensing: what it satisfies with the State Licensing Board for Residential and General Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Georgia Contractor License",
    updated: "Updated August 2026",
    boardLabel: "sos.ga.gov",
    boardUrl: "https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors",
    intro: [
      "Georgia is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the State Licensing Board for Residential and General Contractors, and what Georgia still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "State Licensing Board for Residential and General Contractors" },
      { l: "NASCLA counts for", v: "The General Contractor trade exam" },
      { l: "Still required", v: "the Georgia Business and Law exam" },
      { l: "Official board site", v: "sos.ga.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Georgia",
        p: [
          "The General Contractor trade exam. NASCLA itself confirms Georgia's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Georgia still requires",
        p: [
          "Georgia still requires its own Business and Law exam - 60 questions, 3 hours, 70% to pass. The NASCLA covers the trade side.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Georgia",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the State Licensing Board for Residential and General Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["louisiana", "mississippi"],
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    metaTitle: "Louisiana Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Louisiana licensing: what it satisfies with the Louisiana State Licensing Board for Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Louisiana Contractor License",
    updated: "Updated August 2026",
    boardLabel: "lslbc.gov",
    boardUrl: "https://lslbc.gov",
    intro: [
      "Louisiana is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Louisiana State Licensing Board for Contractors, and what Louisiana still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Louisiana State Licensing Board for Contractors" },
      { l: "NASCLA counts for", v: "Building Construction trade exam" },
      { l: "Still required", v: "Louisiana's Business and Law exam" },
      { l: "Official board site", v: "lslbc.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Louisiana",
        p: [
          "The Building Construction trade exam for commercial licensure. NASCLA itself confirms Louisiana's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Louisiana still requires",
        p: [
          "Louisiana pairs the trade credential with its own Business and Law exam, and the board reviews financial statements as part of the commercial license application.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Louisiana",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Louisiana State Licensing Board for Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["mississippi", "nevada"],
  },
  {
    slug: "mississippi",
    name: "Mississippi",
    metaTitle: "Mississippi Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Mississippi licensing: what it satisfies with the Mississippi State Board of Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Mississippi Contractor License",
    updated: "Updated August 2026",
    boardLabel: "msboc.us",
    boardUrl: "https://www.msboc.us",
    intro: [
      "Mississippi is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Mississippi State Board of Contractors, and what Mississippi still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Mississippi State Board of Contractors" },
      { l: "NASCLA counts for", v: "Building Construction trade exam" },
      { l: "Still required", v: "Mississippi's Law and Business exam" },
      { l: "Official board site", v: "msboc.us" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Mississippi",
        p: [
          "The Building Construction trade exam for the commercial license. NASCLA itself confirms Mississippi's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Mississippi still requires",
        p: [
          "Mississippi runs its own open-book Law and Business exam alongside the trade credential.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Mississippi",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Mississippi State Board of Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["nevada", "new-mexico"],
  },
  {
    slug: "nevada",
    name: "Nevada",
    metaTitle: "Nevada Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Nevada licensing: what it satisfies with the Nevada State Contractors Board, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Nevada Contractor License",
    updated: "Updated August 2026",
    boardLabel: "nvcontractorsboard.com",
    boardUrl: "https://www.nvcontractorsboard.com",
    intro: [
      "Nevada is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Nevada State Contractors Board, and what Nevada still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Nevada State Contractors Board" },
      { l: "NASCLA counts for", v: "B - General Building trade exam" },
      { l: "Still required", v: "Nevada's Business and Law exam (the CMS exam)" },
      { l: "Official board site", v: "nvcontractorsboard.com" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Nevada",
        p: [
          "The trade exam for the B - General Building classification. NASCLA itself confirms Nevada's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Nevada still requires",
        p: [
          "Nevada still requires its Construction Management Survey - the state's business and law exam - plus the board's experience and financial review.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Nevada",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Nevada State Contractors Board - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["new-mexico", "north-carolina"],
  },
  {
    slug: "new-mexico",
    name: "New Mexico",
    metaTitle: "New Mexico Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits New Mexico licensing: what it satisfies with the Construction Industries Division (RLD), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a New Mexico Contractor License",
    updated: "Updated August 2026",
    boardLabel: "rld.nm.gov",
    boardUrl: "https://www.rld.nm.gov/construction-industries",
    intro: [
      "New Mexico is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Construction Industries Division (RLD), and what New Mexico still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Construction Industries Division (RLD)" },
      { l: "NASCLA counts for", v: "GB98 general building trade exam" },
      { l: "Still required", v: "New Mexico's Business and Law exam" },
      { l: "Official board site", v: "rld.nm.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in New Mexico",
        p: [
          "The trade exam for the GB98 general building license. NASCLA itself confirms New Mexico's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What New Mexico still requires",
        p: [
          "Two New Mexico specifics: the state's own Business and Law exam still applies, and since January 2023 NASCLA candidates must also show a letter proving they have been licensed and in good standing with another state for at least one year.",
          "New Mexico's NASCLA door is for contractors already licensed somewhere - a year of good standing elsewhere is part of the deal.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches New Mexico",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Construction Industries Division (RLD) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["north-carolina", "oregon"],
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    metaTitle: "North Carolina Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits North Carolina licensing: what it satisfies with the North Carolina Licensing Board for General Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a North Carolina Contractor License",
    updated: "Updated August 2026",
    boardLabel: "nclbgc.org",
    boardUrl: "https://nclbgc.org",
    intro: [
      "North Carolina is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the North Carolina Licensing Board for General Contractors, and what North Carolina still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "North Carolina Licensing Board for General Contractors" },
      { l: "NASCLA counts for", v: "Commercial + Residential Building classifications" },
      { l: "Still required", v: "the board's application, financial, and reference requirements" },
      { l: "NASCLA score window", v: "Within 2 years" },
      { l: "Official board site", v: "nclbgc.org" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in North Carolina",
        p: [
          "Both the Commercial Building Construction and Residential Building Contractor classifications. NASCLA itself confirms North Carolina's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What North Carolina still requires",
        p: [
          "North Carolina does not add a separate business-and-law exam - the NASCLA pass covers the examination requirement for the Building classifications, and the rest is the board's application: financial statement at your license limit, references, and fees.",
          "Your NASCLA pass must be from within the past two years for North Carolina.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches North Carolina",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the North Carolina Licensing Board for General Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["oregon", "south-carolina"],
  },
  {
    slug: "oregon",
    name: "Oregon",
    metaTitle: "Oregon Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Oregon licensing: what it satisfies with the Oregon Construction Contractors Board (CCB), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Oregon Contractor License",
    updated: "Updated August 2026",
    boardLabel: "oregon.gov/ccb",
    boardUrl: "https://www.oregon.gov/ccb",
    intro: [
      "Oregon is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Oregon Construction Contractors Board (CCB), and what Oregon still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Oregon Construction Contractors Board (CCB)" },
      { l: "NASCLA counts for", v: "The 16-hour pre-license training requirement" },
      { l: "Still required", v: "Oregon's own CCB licensing exam" },
      { l: "Official board site", v: "oregon.gov/ccb" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Oregon",
        p: [
          "Oregon accepts the NASCLA pass in lieu of the 16-hour pre-license training requirement. NASCLA itself confirms Oregon's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Oregon still requires",
        p: [
          "Oregon works differently than most NASCLA states: the pass substitutes for the 16-hour pre-license training, and your Responsible Managing Individual still takes Oregon's own CCB exam, which is centered on Oregon law and business practices.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Oregon",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Oregon Construction Contractors Board (CCB) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["south-carolina", "tennessee"],
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    metaTitle: "South Carolina Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits South Carolina licensing: what it satisfies with the South Carolina Contractors' Licensing Board, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a South Carolina Contractor License",
    updated: "Updated August 2026",
    boardLabel: "llr.sc.gov/clb",
    boardUrl: "https://llr.sc.gov/clb",
    intro: [
      "South Carolina is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the South Carolina Contractors' Licensing Board, and what South Carolina still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "South Carolina Contractors' Licensing Board" },
      { l: "NASCLA counts for", v: "Commercial Building classification trade exam" },
      { l: "Still required", v: "the South Carolina Business Management and Law exam" },
      { l: "NASCLA score window", v: "Within 3 years" },
      { l: "Official board site", v: "llr.sc.gov/clb" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in South Carolina",
        p: [
          "The trade exam for the commercial Building classification (up to Unlimited license groups). NASCLA itself confirms South Carolina's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What South Carolina still requires",
        p: [
          "South Carolina pairs the trade credential with its own Business Management and Law exam, and license groups are set by your financials.",
          "South Carolina accepts NASCLA scores from within the past three years.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches South Carolina",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the South Carolina Contractors' Licensing Board - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["tennessee", "utah"],
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    metaTitle: "Tennessee Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Tennessee licensing: what it satisfies with the Tennessee Board for Licensing Contractors, what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Tennessee Contractor License",
    updated: "Updated August 2026",
    boardLabel: "tn.gov/commerce",
    boardUrl: "https://www.tn.gov/commerce/regboards/contractors.html",
    intro: [
      "Tennessee is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Tennessee Board for Licensing Contractors, and what Tennessee still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Tennessee Board for Licensing Contractors" },
      { l: "NASCLA counts for", v: "BC - Building Construction trade exam" },
      { l: "Still required", v: "the Tennessee Business and Law exam" },
      { l: "Official board site", v: "tn.gov/commerce" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Tennessee",
        p: [
          "The trade exam for the BC - Building Construction classification. NASCLA itself confirms Tennessee's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Tennessee still requires",
        p: [
          "Tennessee still requires its own Business and Law exam, plus the board's financial review that sets your monetary limit. A license is generally required once a project reaches $25,000.",
          "Tennessee also ADMINISTERS the NASCLA exam in-state (since March 2021), so Tennessee candidates can take it as their trade exam from the start.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Tennessee",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Tennessee Board for Licensing Contractors - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["utah", "virginia"],
  },
  {
    slug: "utah",
    name: "Utah",
    metaTitle: "Utah Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Utah licensing: what it satisfies with the Utah Division of Occupational and Professional Licensing (DOPL), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Utah Contractor License",
    updated: "Updated August 2026",
    boardLabel: "commerce.utah.gov/dopl",
    boardUrl: "https://commerce.utah.gov/dopl/licensing/contracting",
    intro: [
      "Utah is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Utah Division of Occupational and Professional Licensing (DOPL), and what Utah still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Utah Division of Occupational and Professional Licensing (DOPL)" },
      { l: "NASCLA counts for", v: "The 2-year experience requirement" },
      { l: "Still required", v: "Utah's business and law requirements and pre-license course" },
      { l: "Official board site", v: "commerce.utah.gov/dopl" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Utah",
        p: [
          "Utah requires no trade exam at all - instead, a NASCLA pass can satisfy the two-year experience requirement for general building contractors. NASCLA itself confirms Utah's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Utah still requires",
        p: [
          "Utah's angle is unique: there is no trade exam to replace, so the NASCLA pass works as a substitute for the two-year experience requirement. Utah's own business-and-law step and pre-license course still apply - DOPL spells out the current sequence.",
          "For a newer contractor short on documented years, the NASCLA pass IS the experience shortcut in Utah.", "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Utah",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Utah Division of Occupational and Professional Licensing (DOPL) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["virginia", "west-virginia"],
  },
  {
    slug: "virginia",
    name: "Virginia",
    metaTitle: "Virginia Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits Virginia licensing: what it satisfies with the Virginia Board for Contractors (DPOR), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a Virginia Contractor License",
    updated: "Updated August 2026",
    boardLabel: "dpor.virginia.gov",
    boardUrl: "https://www.dpor.virginia.gov/boards/contractors",
    intro: [
      "Virginia is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the Virginia Board for Contractors (DPOR), and what Virginia still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "Virginia Board for Contractors (DPOR)" },
      { l: "NASCLA counts for", v: "Commercial Building (CBC) classification" },
      { l: "Still required", v: "Virginia's own license class requirements" },
      { l: "Official board site", v: "dpor.virginia.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in Virginia",
        p: [
          "Comparable to the Commercial Building (CBC) classification (accepted since January 2016). NASCLA itself confirms Virginia's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What Virginia still requires",
        p: [
          "Virginia's Class A/B/C license structure adds its own steps - pre-license education and Virginia-specific exam requirements depending on your class. The NASCLA pass covers the commercial building specialty side; DPOR's checklist for your class covers the rest.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches Virginia",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the Virginia Board for Contractors (DPOR) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["west-virginia", "alabama"],
  },
  {
    slug: "west-virginia",
    name: "West Virginia",
    metaTitle: "West Virginia Contractor License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Commercial General Building Contractor exam fits West Virginia licensing: what it satisfies with the West Virginia Contractor Licensing Board (Division of Labor), what the state still requires, and how the transcript works.",
    h1: "The NASCLA Route to a West Virginia Contractor License",
    updated: "Updated August 2026",
    boardLabel: "labor.wv.gov",
    boardUrl: "https://labor.wv.gov",
    intro: [
      "West Virginia is one of the 17 states (plus the US Virgin Islands) that accept the NASCLA Commercial General Building Contractor exam - pass it once and the trade-exam box is checked here and in every other participating state, no retesting.",
      "Here is exactly what the NASCLA covers with the West Virginia Contractor Licensing Board (Division of Labor), and what West Virginia still asks of you on top of it.",
    ],
    facts: [
      { l: "Licensing agency", v: "West Virginia Contractor Licensing Board (Division of Labor)" },
      { l: "NASCLA counts for", v: "General Building trade exam" },
      { l: "Still required", v: "West Virginia's Business and Law exam" },
      { l: "Official board site", v: "labor.wv.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA covers in West Virginia",
        p: [
          "The trade exam for General Building contractor licensure. NASCLA itself confirms West Virginia's participation, and scores flow to the state electronically (details below).",
        ],
      },
      {
        h: "What West Virginia still requires",
        p: [
          "West Virginia pairs the trade credential with its own Business and Law exam. One quirk: the board does not accept NASCLA scores or transcripts from before September 1, 2013.",
          "Every state also runs its own application - experience or financial documentation, references, and fees - so treat the board's current checklist as the source of truth: requirements change, and this page was last verified against official sources in August 2026.",
        ],
      },
      {
        h: "How your NASCLA score reaches West Virginia",
        p: [
          "After you pass, your score lands in NASCLA's National Examination Database within about 48 hours. You then request an electronic transcript to the West Virginia Contractor Licensing Board (Division of Labor) - and to any other participating state you ever apply to. One exam, seventeen states.",
        ],
      },
    ],
    related: ["alabama", "arizona"],
  },
];

export function getState(slug: string): StateEntry | null {
  return STATES.find((s) => s.slug === slug) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/states.ts (v1 - 17 state entries,
// facts verified vs nascla.org + boards Aug 2026)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
