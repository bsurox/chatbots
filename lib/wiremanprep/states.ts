// FILE: lib/wiremanprep/states.ts
import "server-only";

// WiremanPrep state library (v1) - the 17 board SEO pages. One
// entry per licensing agency in the NASCLA electrical program's
// MASTER exam list: what the exam counts for THERE, what the
// board still requires (business/law exams, experience,
// insurance), score windows where they exist, and the official
// site. Facts verified September 2026 by three research passes
// against nascla.org's per-agency pages, the state board sites,
// and the PSI/Prov candidate bulletins. Where a detail could not
// be pinned to an official source, the copy points at the board
// instead of guessing - Virginia and West Virginia carry explicit
// hedges (their acceptance is listed by NASCLA but not restated
// in the states' own documents), and Nebraska and Vanderburgh
// County carry the no-incoming-transcript caveat prominently.
// No prices anywhere - evergreen.
// Rendering: app/wiremanprep/states/[slug]/page.tsx.

export type WmStateFact = { l: string; v: string };

export type WmStateSection = { h?: string; p?: string[] };

export type WmStateEntry = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  updated: string;
  boardLabel: string;
  boardUrl: string;
  intro: string[];
  facts: WmStateFact[];
  sections: WmStateSection[];
  related: string[];
};

export const WM_STATES: WmStateEntry[] = [
  {
    slug: "alabama",
    name: "Alabama",
    metaTitle: "Alabama Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Alabama licensing: what it satisfies with the Alabama Electrical Contractors Board, what the board still requires, an",
    h1: "The NASCLA Route to a Alabama Electrical License",
    updated: "Updated September 2026",
    boardLabel: "aecb.alabama.gov",
    boardUrl: "https://aecb.alabama.gov",
    intro: [
      "Alabama is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Alabama Electrical Contractors Board, what Alabama still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Alabama Electrical Contractors Board" },
      { l: "NASCLA counts for", v: "The Electrical Contractor (master-level) license" },
      { l: "Still required", v: "the Alabama Business and Law exam" },
      { l: "Test vendor", v: "Prov (not PSI) administers Alabama's exam program" },
      { l: "Official site", v: "aecb.alabama.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Alabama",
        p: [
          "The Electrical Contractor (master-level) license - the board offers the NASCLA electrical exam as one of its two accepted exams, administered through Prov.",
        ],
      },
      {
        h: "What Alabama still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the Alabama Business and Law exam (through Prov), an experience affidavit documenting 8,000 supervisory hours, and the board's application documents.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Alabama both administers the NASCLA electrical exam for new candidates and accepts a passing NASCLA score from another state for reciprocal licensing - but reciprocity still requires the 8,000-hour supervisory experience affidavit and the board's waiver application.",
          "Because Alabama runs its exams through Prov rather than PSI, follow the board's candidate bulletin for scheduling - the process looks different from most NASCLA states.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at aecb.alabama.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["arizona", "louisiana", "new-mexico"],
  },
  {
    slug: "arizona",
    name: "Arizona",
    metaTitle: "Arizona Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Arizona licensing: what it satisfies with the Arizona Registrar of Contractors, what the board still requires, and th",
    h1: "The NASCLA Route to a Arizona Electrical License",
    updated: "Updated September 2026",
    boardLabel: "roc.az.gov",
    boardUrl: "https://roc.az.gov",
    intro: [
      "Arizona is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Arizona Registrar of Contractors, what Arizona still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Arizona Registrar of Contractors" },
      { l: "NASCLA counts for", v: "The trade exam for Arizona's commercial electrical classifications (C-11 and CR-11; the ROC also lists R-11 residential electrical as NASCLA-eligible)" },
      { l: "Still required", v: "the Arizona Statutes and Rules Exam" },
      { l: "Test vendor", v: "PSI administers the trade exams" },
      { l: "Official site", v: "roc.az.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Arizona",
        p: [
          "The trade exam for Arizona's commercial electrical classifications (C-11 and CR-11; the ROC also lists R-11 residential electrical as NASCLA-eligible).",
        ],
      },
      {
        h: "What Arizona still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the Arizona Statutes and Rules Exam (SRE) - an online exam through Gmetrix that cannot be waived - plus a license bond, background check, and the classification's experience minimums.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "The NASCLA exam replaces only the trade exam. The SRE is unwaivable and online-only - budget time for it in your application plan.",
          "Your qualifying party still has to meet the experience minimums for the classification; the exam never substitutes for experience in Arizona.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at roc.az.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["washington-dc", "mississippi", "north-carolina"],
  },
  {
    slug: "washington-dc",
    name: "Washington DC",
    metaTitle: "Washington DC Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Washington DC licensing: what it satisfies with the DC Board of Industrial Trades (Department of Licensing and Consum",
    h1: "The NASCLA Route to a Washington DC Electrical License",
    updated: "Updated September 2026",
    boardLabel: "dlcp.dc.gov",
    boardUrl: "https://dlcp.dc.gov/industrialtrades",
    intro: [
      "Washington DC is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the DC Board of Industrial Trades (Department of Licensing and Consumer Protection), what Washington DC still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "DC Board of Industrial Trades (Department of Licensing and Consumer Protection)" },
      { l: "NASCLA counts for", v: "Master Electrician licensure" },
      { l: "Still required", v: "at least 4 years as a journeyman electrician" },
      { l: "Test vendor", v: "PSI administers DC's exams" },
      { l: "Official site", v: "dlcp.dc.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Washington DC",
        p: [
          "Master Electrician licensure - DC's electrician credential checklist includes NASCLA accreditation among accepted qualifications.",
        ],
      },
      {
        h: "What Washington DC still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need at least 4 years as a journeyman electrician (DC Code requires it on top of journeyman qualifications), employment verification letters, and - if you want to contract - a separate electrical contractor license with a bond form.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "DC licenses the person (master electrician) and the business (electrical contractor) separately - plan for both if you run your own shop.",
          "Exact handling of out-of-state NASCLA transcripts is not published in detail - confirm your path with the Board of Industrial Trades before scheduling anything.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at dlcp.dc.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["idaho", "missouri", "south-carolina"],
  },
  {
    slug: "idaho",
    name: "Idaho",
    metaTitle: "Idaho Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Idaho licensing: what it satisfies with the Idaho Electrical Board (Division of Occupational and Professional License",
    h1: "The NASCLA Route to a Idaho Electrical License",
    updated: "Updated September 2026",
    boardLabel: "dopl.idaho.gov",
    boardUrl: "https://dopl.idaho.gov/ele/",
    intro: [
      "Idaho is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Idaho Electrical Board (Division of Occupational and Professional Licenses), what Idaho still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Idaho Electrical Board (Division of Occupational and Professional Licenses)" },
      { l: "NASCLA counts for", v: "The Master Electrician exam" },
      { l: "Still required", v: "at least 4 years as a licensed journeyman" },
      { l: "Test vendor", v: "PSI administers Idaho's exams" },
      { l: "Official site", v: "dopl.idaho.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Idaho",
        p: [
          "The Master Electrician exam - Idaho adopted the NASCLA electrical exams AS its own master and journeyman exams, through PSI.",
        ],
      },
      {
        h: "What Idaho still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need at least 4 years as a licensed journeyman (Idaho Code), and a separate Electrical Contractor license if you contract - Idaho also runs a contractor business-and-law style exam from its own reference manual.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Idaho is one of the cleanest fits in the program: the state exam IS the NASCLA exam, so preparing for one is preparing for the other.",
          "The contractor license (needed to run jobs as a business) is separate from the master card and has its own exam and fee.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at dopl.idaho.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["kentucky", "nebraska", "tennessee"],
  },
  {
    slug: "kentucky",
    name: "Kentucky",
    metaTitle: "Kentucky Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Kentucky licensing: what it satisfies with the Kentucky Department of Housing, Buildings and Construction, what the b",
    h1: "The NASCLA Route to a Kentucky Electrical License",
    updated: "Updated September 2026",
    boardLabel: "dhbc.ky.gov",
    boardUrl: "https://dhbc.ky.gov",
    intro: [
      "Kentucky is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Kentucky Department of Housing, Buildings and Construction, what Kentucky still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Kentucky Department of Housing, Buildings and Construction" },
      { l: "NASCLA counts for", v: "Master Electrician licensure and the electrical contractor path" },
      { l: "Still required", v: "16,000 verifiable hours in the electrical trade" },
      { l: "Test vendor", v: "Kentucky's checklists name Prov and Pearson Vue for its exams" },
      { l: "Timing rule", v: "Kentucky accepts NASCLA exam scores only within 3 years of the exam date" },
      { l: "Official site", v: "dhbc.ky.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Kentucky",
        p: [
          "Master Electrician licensure and the electrical contractor path.",
        ],
      },
      {
        h: "What Kentucky still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need 16,000 verifiable hours in the electrical trade (with listed substitutions), and for the contractor license a Business and Law exam plus liability insurance and workers' comp certificates naming HBC.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Kentucky accepts NASCLA exam scores only within 3 years of the exam date.",
          "The 3-year score window is real and verified - if you passed the NASCLA electrical exam more than three years ago, Kentucky will not take the transcript.",
          "Kentucky requires a 70 percent exam score by regulation, slightly below the NASCLA exam's own 75-of-100 bar - passing the NASCLA exam clears both.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at dhbc.ky.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["louisiana", "new-mexico", "utah"],
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    metaTitle: "Louisiana Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Louisiana licensing: what it satisfies with the Louisiana State Licensing Board for Contractors, what the board still",
    h1: "The NASCLA Route to a Louisiana Electrical License",
    updated: "Updated September 2026",
    boardLabel: "lslbc.gov",
    boardUrl: "https://lslbc.gov",
    intro: [
      "Louisiana is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Louisiana State Licensing Board for Contractors, what Louisiana still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Louisiana State Licensing Board for Contractors" },
      { l: "NASCLA counts for", v: "The trade exam for the commercial Electrical Work classification" },
      { l: "Still required", v: "the mandatory business law course" },
      { l: "Test vendor", v: "PSI has administered Louisiana's trade exams since August 2025" },
      { l: "Official site", v: "lslbc.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Louisiana",
        p: [
          "The trade exam for the commercial Electrical Work classification - Louisiana licenses companies by classification rather than issuing statewide personal master cards.",
        ],
      },
      {
        h: "What Louisiana still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the mandatory business law course (not waivable by statute), a financial statement current within 12 months showing at least $50,000 net worth for commercial licenses, a background check, and a designated qualifying party.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Louisiana's business law requirement is a course, not just an exam, and the statute says it cannot be waived even when the trade exam is.",
          "The $50,000 net-worth financial statement is the requirement that surprises most applicants - get your CPA moving early.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at lslbc.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["mississippi", "north-carolina", "vanderburgh-county"],
  },
  {
    slug: "mississippi",
    name: "Mississippi",
    metaTitle: "Mississippi Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Mississippi licensing: what it satisfies with the Mississippi State Board of Contractors, what the board still requir",
    h1: "The NASCLA Route to a Mississippi Electrical License",
    updated: "Updated September 2026",
    boardLabel: "msboc.us",
    boardUrl: "https://www.msboc.us",
    intro: [
      "Mississippi is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Mississippi State Board of Contractors, what Mississippi still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Mississippi State Board of Contractors" },
      { l: "NASCLA counts for", v: "The Master Electrical trade exam for the electrical classification on a commercial Certificate of Responsibility" },
      { l: "Still required", v: "the Mississippi Business and Law exam" },
      { l: "Test vendor", v: "PSI administers Mississippi's exams, open book" },
      { l: "Official site", v: "msboc.us" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Mississippi",
        p: [
          "The Master Electrical trade exam for the electrical classification on a commercial Certificate of Responsibility - the board's own words: a master electrical contractor 'may choose to take the NASCLA Accredited Electrical Examination instead of the Mississippi Master Electrical exam'.",
        ],
      },
      {
        h: "What Mississippi still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the Mississippi Business and Law exam (required of all applicants), proof of general liability insurance ($300,000 per occurrence / $600,000 aggregate for commercial), and financial documentation.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Mississippi is a direct substitute state - no endorsement hoops, any applicant can choose the NASCLA exam over the state exam.",
          "Budget for the insurance minimums up front; the board wants proof with the application, not after approval.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at msboc.us - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["missouri", "south-carolina", "virginia"],
  },
  {
    slug: "missouri",
    name: "Missouri",
    metaTitle: "Missouri Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Missouri licensing: what it satisfies with the Missouri Office of Statewide Electrical Contractors (Division of Profe",
    h1: "The NASCLA Route to a Missouri Electrical License",
    updated: "Updated September 2026",
    boardLabel: "pr.mo.gov",
    boardUrl: "https://pr.mo.gov/electricalcontractors.asp",
    intro: [
      "Missouri is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Missouri Office of Statewide Electrical Contractors (Division of Professional Registration), what Missouri still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Missouri Office of Statewide Electrical Contractors (Division of Professional Registration)" },
      { l: "NASCLA counts for", v: "The exam requirement for Missouri's statewide electrical contractor license (created 2019)" },
      { l: "Still required", v: "verifiable experience" },
      { l: "Test vendor", v: "PSI administers the program" },
      { l: "Official site", v: "pr.mo.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Missouri",
        p: [
          "The exam requirement for Missouri's statewide electrical contractor license (created 2019) - PSI runs the NASCLA examination program for the office.",
        ],
      },
      {
        h: "What Missouri still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need verifiable experience (12,000 practical hours, with lower tiers down to 4,000 hours plus an electrical engineering degree), $500,000 liability insurance, and bonds with each political subdivision where you work.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Missouri's statewide license is optional - local licensing still exists - but one statewide-licensed supervisor covers the whole company, which is why contractors get it.",
          "There is no separate Missouri business-and-law exam on the statewide path.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at pr.mo.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["nebraska", "tennessee", "west-virginia"],
  },
  {
    slug: "nebraska",
    name: "Nebraska",
    metaTitle: "Nebraska Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Nebraska licensing: what it satisfies with the Nebraska State Electrical Division, what the board still requires, and",
    h1: "The NASCLA Route to a Nebraska Electrical License",
    updated: "Updated September 2026",
    boardLabel: "electrical.nebraska.gov",
    boardUrl: "https://electrical.nebraska.gov",
    intro: [
      "Nebraska is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Nebraska State Electrical Division, what Nebraska still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Nebraska State Electrical Division" },
      { l: "NASCLA counts for", v: "Nebraska's own Electrical Contractor, Journeyman, and Residential Wireman license exams" },
      { l: "Still required", v: "an Exam Application approved by the Division BEFORE PSI will let you schedule" },
      { l: "Test vendor", v: "PSI has administered Nebraska's exams since October 2023" },
      { l: "Timing rule", v: "Nebraska only counts NASCLA exams taken through the Nebraska State Electrical Division, with an exam date after August 1, 2025" },
      { l: "Official site", v: "electrical.nebraska.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Nebraska",
        p: [
          "Nebraska's own Electrical Contractor, Journeyman, and Residential Wireman license exams - the state administers the NASCLA exams as its exams.",
        ],
      },
      {
        h: "What Nebraska still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need an Exam Application approved by the Division BEFORE PSI will let you schedule, plus the license application requirements.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Nebraska only counts NASCLA exams taken through the Nebraska State Electrical Division, with an exam date after August 1, 2025.",
          "THE BIG CAVEAT: Nebraska does not accept incoming NASCLA transcripts from exams taken for other states. You must apply to Nebraska first and take the exam through the Division - a pass earned for, say, Tennessee will not transfer in.",
          "If Nebraska is your home state, this works in your favor: pass through Nebraska and your score also lives in NASCLA's national database for the transfer-friendly states.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at electrical.nebraska.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["new-mexico", "utah", "alabama"],
  },
  {
    slug: "new-mexico",
    name: "New Mexico",
    metaTitle: "New Mexico Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits New Mexico licensing: what it satisfies with the New Mexico Construction Industries Division (Regulation and Licensin",
    h1: "The NASCLA Route to a New Mexico Electrical License",
    updated: "Updated September 2026",
    boardLabel: "rld.nm.gov",
    boardUrl: "https://www.rld.nm.gov/construction-industries/",
    intro: [
      "New Mexico is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the New Mexico Construction Industries Division (Regulation and Licensing Department), what New Mexico still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "New Mexico Construction Industries Division (Regulation and Licensing Department)" },
      { l: "NASCLA counts for", v: "Accepted in lieu of the trade exam for the EE-98 electrical license and journeyman certificate" },
      { l: "Still required", v: "a letter of good standing showing you have been licensed at least 1 year in another state" },
      { l: "Test vendor", v: "PSI administers New Mexico's exams" },
      { l: "Official site", v: "rld.nm.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in New Mexico",
        p: [
          "Accepted in lieu of the trade exam for the EE-98 electrical license and journeyman certificate.",
        ],
      },
      {
        h: "What New Mexico still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need a letter of good standing showing you have been licensed at least 1 year in another state (effective January 2023), the New Mexico contractor Business and Law exam (or an approved course in lieu), and a qualifying party with the required experience within the last 10 years.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "New Mexico is effectively an endorsement state: the NASCLA score only helps if you already hold a license somewhere else and have held it for at least a year.",
          "The business and law requirement can be satisfied by an approved course instead of the exam - often the faster path.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at rld.nm.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["north-carolina", "vanderburgh-county", "arizona"],
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    metaTitle: "North Carolina Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits North Carolina licensing: what it satisfies with the North Carolina State Board of Examiners of Electrical Contractor",
    h1: "The NASCLA Route to a North Carolina Electrical License",
    updated: "Updated September 2026",
    boardLabel: "ncbeec.org",
    boardUrl: "https://www.ncbeec.org",
    intro: [
      "North Carolina is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the North Carolina State Board of Examiners of Electrical Contractors, what North Carolina still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "North Carolina State Board of Examiners of Electrical Contractors" },
      { l: "NASCLA counts for", v: "The exam for the SP, Limited, Intermediate, or Unlimited electrical contractor licenses" },
      { l: "Still required", v: "experience per classification" },
      { l: "Test vendor", v: "PSI administers the exams" },
      { l: "Official site", v: "ncbeec.org" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in North Carolina",
        p: [
          "The exam for the SP, Limited, Intermediate, or Unlimited electrical contractor licenses - your NASCLA transcript goes to NCBEEC as part of the application.",
        ],
      },
      {
        h: "What North Carolina still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need experience per classification (2 years for Limited, 4 for Intermediate, 5 for Unlimited, which also needs two attesting statements), a listed qualified individual, and for Intermediate/Unlimited a bonding ability statement or bank line-of-credit letter.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "North Carolina has no separate business-and-law exam - the NASCLA trade exam plus paperwork covers the testing side entirely.",
          "The classification ladder is experience-driven: the same exam pass supports SP through Unlimited, your documented years decide which you can hold.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at ncbeec.org - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["south-carolina", "virginia", "washington-dc"],
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    metaTitle: "South Carolina Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits South Carolina licensing: what it satisfies with the South Carolina Contractor's Licensing Board (LLR), what the boar",
    h1: "The NASCLA Route to a South Carolina Electrical License",
    updated: "Updated September 2026",
    boardLabel: "llr.sc.gov/clb",
    boardUrl: "https://llr.sc.gov/clb/",
    intro: [
      "South Carolina is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the South Carolina Contractor's Licensing Board (LLR), what South Carolina still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "South Carolina Contractor's Licensing Board (LLR)" },
      { l: "NASCLA counts for", v: "The technical exam for the Electrical classification of a Mechanical Contractor license" },
      { l: "Still required", v: "the S.C. Business Management and Law for Commercial Contractors exam" },
      { l: "Test vendor", v: "PSI administers the exams" },
      { l: "Timing rule", v: "South Carolina accepts NASCLA exam scores only within 3 years" },
      { l: "Official site", v: "llr.sc.gov/clb" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in South Carolina",
        p: [
          "The technical exam for the Electrical classification of a Mechanical Contractor license - one of the two national exams SC offers for multi-state licensing.",
        ],
      },
      {
        h: "What South Carolina still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the S.C. Business Management and Law for Commercial Contractors exam, plus a financial statement meeting your license group's working-capital or net-worth minimums (from $3,500 up to $200,000+ by group).",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "South Carolina accepts NASCLA exam scores only within 3 years.",
          "The 3-year score window is verified on NASCLA's own South Carolina page - do not sit on an old pass.",
          "Your license group (and therefore your job-size ceiling) is set by the financial statement, not the exam - decide the group you need before you file.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at llr.sc.gov/clb - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["tennessee", "west-virginia", "idaho"],
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    metaTitle: "Tennessee Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Tennessee licensing: what it satisfies with the Tennessee Board for Licensing Contractors, what the board still requi",
    h1: "The NASCLA Route to a Tennessee Electrical License",
    updated: "Updated September 2026",
    boardLabel: "tn.gov/commerce",
    boardUrl: "https://www.tn.gov/commerce/regboards/contractors.html",
    intro: [
      "Tennessee is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Tennessee Board for Licensing Contractors, what Tennessee still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Tennessee Board for Licensing Contractors" },
      { l: "NASCLA counts for", v: "The trade exam for the CE (Electrical) contractor classification" },
      { l: "Still required", v: "the Tennessee Business and Law exam, a reviewed or audited CPA financial statement less than 12 months old, ge" },
      { l: "Test vendor", v: "Tennessee's board exams moved from PSI to Prov effective July 2026" },
      { l: "Timing rule", v: "Tennessee treats exams as typically valid for 2 years" },
      { l: "Official site", v: "tn.gov/commerce" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Tennessee",
        p: [
          "The trade exam for the CE (Electrical) contractor classification.",
        ],
      },
      {
        h: "What Tennessee still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the Tennessee Business and Law exam, a reviewed or audited CPA financial statement less than 12 months old, general liability insurance, workers' comp (unless exempt), and a reference letter.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Tennessee treats exams as typically valid for 2 years.",
          "Tennessee's 2-year exam-validity window is the tightest in the program - schedule your application to land inside it.",
          "The CPA-reviewed financial statement is the long-lead item; most applicants start it before they even schedule the exam.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at tn.gov/commerce - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["utah", "alabama", "kentucky"],
  },
  {
    slug: "utah",
    name: "Utah",
    metaTitle: "Utah Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Utah licensing: what it satisfies with the Utah Division of Professional Licensing (Electricians Licensing Board), wh",
    h1: "The NASCLA Route to a Utah Electrical License",
    updated: "Updated September 2026",
    boardLabel: "commerce.utah.gov/dopl",
    boardUrl: "https://commerce.utah.gov/dopl/electrical/",
    intro: [
      "Utah is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Utah Division of Professional Licensing (Electricians Licensing Board), what Utah still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Utah Division of Professional Licensing (Electricians Licensing Board)" },
      { l: "NASCLA counts for", v: "Master Electrician (and Journeyman) licensure BY ENDORSEMENT ONLY" },
      { l: "Still required", v: "a license from another state that used the NASCLA exam, held at least 12 months, a Verification of Licensure, " },
      { l: "Test vendor", v: "Utah's own exams run through Prov" },
      { l: "Official site", v: "commerce.utah.gov/dopl" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Utah",
        p: [
          "Master Electrician (and Journeyman) licensure BY ENDORSEMENT ONLY - Utah does not accept the NASCLA exam as a standalone substitute for its own exams.",
        ],
      },
      {
        h: "What Utah still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need a license from another state that used the NASCLA exam, held at least 12 months, a Verification of Licensure, and the Utah Master Electrician Law and Rule examination (required of all applicants).",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Utah is strictly an endorsement state: the NASCLA pass helps only after it has earned you a license somewhere else and you have held that license for a year.",
          "Everyone - endorsement applicants included - still sits Utah's Law and Rule exam. Our course does not cover that exam; use DOPL's candidate bulletin.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at commerce.utah.gov/dopl - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["vanderburgh-county", "arizona", "louisiana"],
  },
  {
    slug: "vanderburgh-county",
    name: "Vanderburgh County, Indiana",
    metaTitle: "Vanderburgh County Electrical License via the NASCLA Exam - What It Co",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Vanderburgh County licensing: what it satisfies with the Evansville-Vanderburgh County Building Commission, what the ",
    h1: "The NASCLA Route to a Vanderburgh County Electrical License",
    updated: "Updated September 2026",
    boardLabel: "evansvillegov.org",
    boardUrl: "https://www.evansvillegov.org/city/department/division.php?structureid=154",
    intro: [
      "Vanderburgh County, Indiana is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Evansville-Vanderburgh County Building Commission, what Vanderburgh County still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Evansville-Vanderburgh County Building Commission" },
      { l: "NASCLA counts for", v: "The county Electrician/Master Electrician license exam" },
      { l: "Still required", v: "notarized recommendation letters proving at least 4 years of field experience, the license fee, and proof of i" },
      { l: "Test vendor", v: "Prov administers the exam locally (Ivy Tech Certification Center, Evansville)" },
      { l: "Timing rule", v: "Vanderburgh County does not accept transcripts - you must take the exam in Evansville" },
      { l: "Official site", v: "evansvillegov.org" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Vanderburgh County",
        p: [
          "The county Electrician/Master Electrician license exam - the county administers the NASCLA Master exam through Prov at the Ivy Tech center in Evansville.",
        ],
      },
      {
        h: "What Vanderburgh County still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need notarized recommendation letters proving at least 4 years of field experience, the license fee, and proof of insurance and surety bond before a provisional license is issued.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Vanderburgh County does not accept transcripts - you must take the exam in Evansville.",
          "Indiana has no statewide electrical license; Vanderburgh County (Evansville) runs its own, and it is the one Indiana jurisdiction in the NASCLA electrical program.",
          "THE BIG CAVEAT: no transcript transfers in. A NASCLA pass earned for another state does not count here - you sit the exam at the Evansville test center.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at evansvillegov.org - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["virginia", "washington-dc", "mississippi"],
  },
  {
    slug: "virginia",
    name: "Virginia",
    metaTitle: "Virginia Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits Virginia licensing: what it satisfies with the Virginia Board for Contractors (DPOR) - Tradesmen Program, what the bo",
    h1: "The NASCLA Route to a Virginia Electrical License",
    updated: "Updated September 2026",
    boardLabel: "dpor.virginia.gov",
    boardUrl: "https://www.dpor.virginia.gov/Boards/Tradesmen",
    intro: [
      "Virginia is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the Virginia Board for Contractors (DPOR) - Tradesmen Program, what Virginia still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "Virginia Board for Contractors (DPOR) - Tradesmen Program" },
      { l: "NASCLA counts for", v: "Listed by NASCLA as accepted toward Virginia's Master and Journeyman Electrician tradesman licenses" },
      { l: "Still required", v: "experience DPOR verifies separately" },
      { l: "Test vendor", v: "PSI administers DPOR's tradesman exams" },
      { l: "Official site", v: "dpor.virginia.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in Virginia",
        p: [
          "Listed by NASCLA as accepted toward Virginia's Master and Journeyman Electrician tradesman licenses.",
        ],
      },
      {
        h: "What Virginia still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need experience DPOR verifies separately (a year as a licensed journeyman, or roughly 9-10 years of verified practical experience, for the master path), plus the tradesman application; no separate business-and-law exam for tradesman licenses.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Honest hedge: NASCLA's own page lists Virginia as accepting the exam, but DPOR's published tradesman documents do not mention NASCLA by name - call DPOR and confirm your path before scheduling.",
          "Virginia also has direct reciprocity deals for electricians from WV, KY, AL, DC, MD, NC, and OH that may beat the NASCLA route if you hold one of those licenses.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at dpor.virginia.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["west-virginia", "idaho", "missouri"],
  },
  {
    slug: "west-virginia",
    name: "West Virginia",
    metaTitle: "West Virginia Electrical License via the NASCLA Exam - What It Covers",
    metaDescription: "How the NASCLA Master/Unlimited electrical exam fits West Virginia licensing: what it satisfies with the West Virginia Contractor Licensing Board (Division of Labor), wha",
    h1: "The NASCLA Route to a West Virginia Electrical License",
    updated: "Updated September 2026",
    boardLabel: "wvclboard.wv.gov",
    boardUrl: "https://wvclboard.wv.gov",
    intro: [
      "West Virginia is one of the 17 licensing boards in the NASCLA electrical program that recognize the Master/Unlimited exam - the same standardized 100-question, open-book test everywhere it is used.",
      "Here is exactly what the NASCLA electrical exam covers with the West Virginia Contractor Licensing Board (Division of Labor), what West Virginia still asks of you on top of it, and the details that trip people up.",
    ],
    facts: [
      { l: "Licensing agency", v: "West Virginia Contractor Licensing Board (Division of Labor)" },
      { l: "NASCLA counts for", v: "Listed by NASCLA for the Electrical Contractor classification of the contractor (business) license" },
      { l: "Still required", v: "the West Virginia Business and Law exam and the Contractor Licensing Act exam requirements" },
      { l: "Test vendor", v: "Prov administers the WV Contractor Licensing Board exams" },
      { l: "Official site", v: "wvclboard.wv.gov" },
    ],
    sections: [
      {
        h: "What the NASCLA exam covers in West Virginia",
        p: [
          "Listed by NASCLA for the Electrical Contractor classification of the contractor (business) license.",
        ],
      },
      {
        h: "What West Virginia still requires",
        p: [
          "Passing the trade exam is necessary, not sufficient. You still need the West Virginia Business and Law exam and the Contractor Licensing Act exam requirements, plus registration, workers' comp, and unemployment compliance; individual electrician cards from the State Fire Marshal are a separate system.",
        ],
      },
      {
        h: "Watch-outs and fine print",
        p: [
          "Honest hedge: NASCLA lists West Virginia, but the state's own candidate bulletin does not mention NASCLA by name - confirm with the board before relying on a transcript.",
          "Note the two-system split: the contractor LICENSE (this board) is separate from the electrician CARD (State Fire Marshal), and only the contractor side appears in the NASCLA program.",
        ],
      },
      {
        h: "Always confirm with the board",
        p: [
          "Licensing rules change and boards update their bulletins without notice. Before you schedule anything, confirm the current requirements at wvclboard.wv.gov - it takes ten minutes and prevents expensive surprises.",
        ],
      },
    ],
    related: ["alabama", "kentucky", "nebraska"],
  },
];

export function getWmState(slug: string): WmStateEntry | null {
  return WM_STATES.find((s) => s.slug === slug) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/wiremanprep/states.ts (v1 - 17 board pages,
// verified Sept 2026, hedged where boards do not restate NASCLA)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
