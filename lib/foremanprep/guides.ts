// FILE: lib/foremanprep/guides.ts
import "server-only";

// ForemanPrep guide library (v1) - the SEO question pages. Five
// long-form guides answering the searches NASCLA candidates
// actually type into Google. Every exam fact in here was verified
// against nascla.org and the official PSI candidate information
// bulletin in August 2026: 115 scored questions, 330 minutes, 81
// to pass, the 17 participating states plus the US Virgin Islands
// with their agency names, and the 24-book reference list (25
// items counting the blueprint packet PSI provides onsite). No
// prices appear in guide copy on purpose - pricing lives on /buy,
// so these pages never go stale when the price changes.
// Rendering: app/foremanprep/guides/[slug]/page.tsx. Text wrapped
// in single asterisks (*like this*) renders bold.

export type GuideFact = { l: string; v: string };

export type GuideSection = {
  h?: string;
  p?: string[];
  list?: string[];
  facts?: GuideFact[];
};

export type GuideCta = { label: string; href: string; ghost?: boolean };

export type Guide = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  updated: string;
  intro: string[];
  sections: GuideSection[];
  ctaH: string;
  ctaP: string;
  ctas: GuideCta[];
  related: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "free-nascla-practice-test",
    metaTitle: "Free NASCLA Practice Test - 10 Real-Style Questions, No Signup",
    metaDescription:
      "Take a free NASCLA practice test right now - 10 exam-style questions with explanations and book citations, no signup required. Built for the Commercial General Building Contractor exam.",
    eyebrow: "Free practice",
    h1: "Free NASCLA Practice Test",
    updated: "Updated August 2026",
    intro: [
      "You can take a free NASCLA-style practice round right now - 10 questions, written to the real exam's 12-subject outline, with a full explanation and a book citation on every answer. No signup, no card, no catch. The button at the bottom of this page starts it.",
      "Before you do, it is worth understanding what the real exam asks of you, because practicing the right way matters more than practicing a lot.",
    ],
    sections: [
      {
        h: "What the real NASCLA exam looks like",
        p: [
          "The NASCLA Accredited Commercial General Building Contractor examination is administered by PSI. The format, from the official candidate bulletin:",
        ],
        facts: [
          { l: "Scored questions", v: "115" },
          { l: "Time limit", v: "330 minutes (5.5 hours)" },
          { l: "Passing score", v: "81 of 115 (about 70%)" },
          { l: "Format", v: "Open book, computer-based" },
          { l: "Reference books allowed", v: "24 (tabbed and highlighted)" },
          { l: "Attempts", v: "3 within one year of approval" },
        ],
      },
      {
        h: "Open book is the trap",
        p: [
          "Every year, capable builders walk into this exam relaxed because it is open book - and walk out stunned. Here is the math they missed: 115 questions in 330 minutes is *under three minutes per question*, and the answers are spread across roughly 24 reference books and thousands of pages.",
          "Nobody fails the NASCLA because they cannot build. They fail because they cannot *find answers fast enough*. That is the skill the exam actually tests, and it is the skill a good practice test trains.",
        ],
      },
      {
        h: "What the free practice round includes",
        p: [
          "The free sample is 10 questions from the ForemanPrep bank - the same bank paying members drill. Every question gives you:",
        ],
        list: [
          "*A full explanation* of the right answer - not just a letter.",
          "*A book-and-section citation* telling you exactly where the answer lives in the official references, so you start learning which book covers what.",
          "*Audio* - each question and explanation is voiced, so you can hear it read to you the way our hands-free study mode works.",
        ],
      },
      {
        h: "How to use a practice test properly",
        p: [
          "One run-through to see where you stand is fine. But the practice habit that actually moves your score, according to people who pass: answer by *looking the answer up*, not by recalling it from memory - even when you know it cold. The exam rewards fast look-up, so that is the muscle to train. Time yourself. If you are consistently finding answers in under 90 seconds, you are in passing shape.",
        ],
      },
    ],
    ctaH: "Start the free 10-question round now",
    ctaP: "No signup. Full explanations and citations on every answer. If you like how it teaches, the full bank is 156 questions with a complete 115-question exam simulator on the real 5.5-hour clock.",
    ctas: [
      { label: "Start free practice", href: "/foremanprep/practice" },
      { label: "See everything included", href: "/foremanprep/buy", ghost: true },
    ],
    related: ["is-the-nascla-exam-hard", "how-to-study-for-the-nascla-exam", "nascla-reference-books"],
  },
  {
    slug: "is-the-nascla-exam-hard",
    metaTitle: "Is the NASCLA Exam Hard? Format, Passing Score, Why People Fail",
    metaDescription:
      "Honest answer from a prep company: the NASCLA exam is open book but time-starved - 115 questions, 5.5 hours, 81 to pass. What makes it hard, who fails, and how passers prepare.",
    eyebrow: "Exam difficulty",
    h1: "Is the NASCLA Exam Hard?",
    updated: "Updated August 2026",
    intro: [
      "Honest answer: the NASCLA Commercial General Building Contractor exam is *not a knowledge test - it is a speed test*, and that is exactly what makes it hard. People who prepare for the wrong exam fail it. People who prepare for the real one pass it, often on the first try.",
    ],
    sections: [
      {
        h: "The format on paper",
        facts: [
          { l: "Scored questions", v: "115" },
          { l: "Time limit", v: "330 minutes (5.5 hours)" },
          { l: "Passing score", v: "81 of 115 (about 70%)" },
          { l: "Open book", v: "Yes - about 24 reference books" },
          { l: "Time per question", v: "Under 3 minutes" },
          { l: "Administered by", v: "PSI, at testing centers" },
        ],
        p: [
          "Read that last fact row again. Five and a half hours sounds generous until you divide it by 115 questions across thousands of pages of reference material. NASCLA does not publish a pass rate, but ask anyone who proctors or preps for this exam and they will tell you the same thing: the clock beats more people than the content does.",
        ],
      },
      {
        h: "What actually makes it hard",
        list: [
          "*Volume of references.* Roughly 24 books are allowed on your table - code books, OSHA 1926, business and law, concrete, carpentry, steel, masonry, plumbing and mechanical. Knowing *which book* holds an answer is half the exam.",
          "*The clock.* Under three minutes a question means you cannot hunt. Passers walk in already knowing where 70 to 80 percent of answers live.",
          "*Stamina.* It is a 5.5-hour sit. Fatigue mistakes are real in hour four.",
          "*Math.* Recent test-takers frequently report more math questions than practice exams led them to expect - business math (markup, payroll, retainage) plus construction calculations, and plan-reading questions with math inside them. Most of it is simple arithmetic, but it eats clock.",
        ],
      },
      {
        h: "Who fails it",
        p: [
          "Two groups, mostly. First: experienced builders who assume open book means easy, skip timed practice, and drown in the look-up. Second: strong studiers who memorize content but never drill *finding* it - the exam does not care what you remember, it cares what you can locate and verify in 90 seconds.",
          "The encouraging flip side: this is a very beatable exam for anyone who trains the actual skill. You get three attempts within a year of approval, and most well-prepared candidates do not need the second one.",
        ],
      },
      {
        h: "What passers do differently",
        list: [
          "Tab and highlight every allowed book (permanent tabs only - PSI's rule).",
          "Drill practice questions *by looking up every answer*, even the ones they know, until they average under 90 seconds a question.",
          "Take multiple full-length timed simulations before test day so the 5.5-hour pace is familiar, not frightening.",
          "Learn the book map: which references carry most of the exam and which niche books make for fast, easy points.",
        ],
      },
    ],
    ctaH: "Find out where you stand in 10 questions",
    ctaP: "The free ForemanPrep sample shows you real exam-style questions with citations - and our full 115-question simulator runs the actual 5.5-hour clock, so test day feels like practice.",
    ctas: [
      { label: "Take the free practice test", href: "/foremanprep/practice" },
      { label: "Try the exam simulator", href: "/foremanprep/exam", ghost: true },
    ],
    related: ["free-nascla-practice-test", "how-to-study-for-the-nascla-exam", "nascla-exam-states"],
  },
  {
    slug: "nascla-exam-states",
    metaTitle: "Which States Accept the NASCLA Exam? All 17 States + USVI",
    metaDescription:
      "The NASCLA Commercial General Building Contractor exam is accepted in 17 states plus the US Virgin Islands. Full list with each state's licensing agency, and what acceptance actually means.",
    eyebrow: "State coverage",
    h1: "Which States Accept the NASCLA Exam?",
    updated: "Updated August 2026",
    intro: [
      "Seventeen states plus the US Virgin Islands currently accept the NASCLA Accredited Commercial General Building Contractor examination. Pass it once, and that trade-exam requirement follows you to every participating jurisdiction - no retesting state by state.",
      "That is the entire reason this exam exists, and it is why commercial contractors who work across state lines choose it over single-state exams.",
    ],
    sections: [
      {
        h: "The participating states",
        p: ["Verified against nascla.org, August 2026 - each with the agency that accepts the exam:"],
        facts: [
          { l: "Alabama", v: "Licensing Board for General Contractors" },
          { l: "Arizona", v: "Registrar of Contractors" },
          { l: "Arkansas", v: "Contractors Licensing Board" },
          { l: "California", v: "Contractors State License Board" },
          { l: "Florida", v: "Construction Industry Licensing Board" },
          { l: "Georgia", v: "Board for Residential and General Contractors" },
          { l: "Louisiana", v: "State Licensing Board for Contractors" },
          { l: "Mississippi", v: "State Board of Contractors" },
          { l: "Nevada", v: "State Contractors Board" },
          { l: "New Mexico", v: "Construction Industries Division" },
          { l: "North Carolina", v: "Licensing Board for General Contractors" },
          { l: "Oregon", v: "Construction Contractors Board" },
          { l: "South Carolina", v: "Contractors' Licensing Board" },
          { l: "Tennessee", v: "Board for Licensing Contractors" },
          { l: "Utah", v: "Div. of Occupational & Professional Licensing" },
          { l: "Virginia", v: "Board for Contractors (DPOR)" },
          { l: "West Virginia", v: "Contractors Licensing Board" },
          { l: "US Virgin Islands", v: "Dept. of Licensing & Consumer Affairs" },
        ],
      },
      {
        h: "What acceptance actually means",
        p: [
          "Passing the NASCLA exam satisfies the *trade examination* requirement in the jurisdictions above - it does not hand you a license by itself. Each state still runs its own application: experience documentation, financial statements, references, fees, and in most participating states a separate *business and law exam* specific to that state.",
          "The mechanics are smooth: after you pass, your score lands in NASCLA's National Examination Database within about 48 hours, and you request electronic transcripts to whichever participating state boards you apply to.",
        ],
      },
      {
        h: "Who should take the NASCLA instead of a state exam",
        p: [
          "If you will only ever hold one state's license, your state's own exam may be the shorter path. But if there is any chance you will chase work across state lines - storm work, commercial rollouts, following a big client - one NASCLA pass beats sitting for multiple state trade exams. California and Florida on the list makes it especially valuable: two of the biggest construction markets in the country accept it.",
          "One logistics note from the official bulletin: you apply to NASCLA for approval first, then register with PSI to schedule. Once approved you have one year and up to three attempts.",
        ],
      },
    ],
    ctaH: "Testing in one of these states?",
    ctaP: "ForemanPrep is built specifically for this exam - 156 practice questions written to the official 12-subject outline, a full 115-question simulator on the real 5.5-hour clock, and audio study for the drive between jobs. Start with 10 free questions.",
    ctas: [
      { label: "Start free practice", href: "/foremanprep/practice" },
      { label: "See the full course", href: "/foremanprep/buy", ghost: true },
    ],
    related: ["is-the-nascla-exam-hard", "free-nascla-practice-test", "nascla-reference-books"],
  },
  {
    slug: "nascla-reference-books",
    metaTitle: "NASCLA Exam Book List - All 24 Reference Books + Tabbing Rules",
    metaDescription:
      "The complete NASCLA Commercial General Building Contractor reference list - all 24 allowed books with editions, PSI's highlighting and tabbing rules, and which books carry most of the exam.",
    eyebrow: "Reference books",
    h1: "The NASCLA Reference Book List",
    updated: "Updated August 2026",
    intro: [
      "The NASCLA Commercial General Building Contractor exam is open book, and the official candidate bulletin lists exactly which references you may bring: 24 books, plus a blueprint packet PSI hands you at the testing center. Here is the full list, the marking rules, and - just as important - which books actually carry the exam.",
      "*A caution before you buy anything:* accepted editions change as new versions publish. The list below reflects the official PSI bulletin as of August 2026 - always confirm against the current bulletin before ordering books.",
    ],
    sections: [
      {
        h: "The full list",
        facts: [
          { l: "NASCLA Contractors Guide to Business, Law and Project Management", v: "Basic 14th Ed." },
          { l: "International Building Code (IBC)", v: "2021 or 2024" },
          { l: "OSHA 29 CFR Part 1926 (Construction)", v: "2023 Ed." },
          { l: "Principles and Practices of Commercial Construction", v: "11th Ed." },
          { l: "Carpentry and Building Construction", v: "2016 Ed." },
          { l: "Construction Jobsite Management", v: "4th or 5th Ed." },
          { l: "Construction Project Management", v: "4th or 5th Ed." },
          { l: "Mechanical and Electrical Systems for Construction Managers", v: "4th Ed." },
          { l: "The Contractor's Guide to Quality Concrete Construction", v: "4th Ed." },
          { l: "ACI 318 Building Code (Concrete)", v: "318-14 or 318-19" },
          { l: "Placing Reinforcing Bars", v: "10th Ed." },
          { l: "Modern Masonry - Brick, Block, Stone", v: "9th Ed." },
          { l: "Gypsum Construction Handbook", v: "7th Ed." },
          { l: "Roofing Construction and Estimating", v: "1995 (reprint)" },
          { l: "Pipe and Excavation Contracting", v: "2011" },
          { l: "SDI Manual of Construction with Steel Deck", v: "2016" },
          { l: "Steel Joists Technical Digest No. 9", v: "3rd Ed." },
          { l: "BCSI Wood Truss Guide", v: "2018/2025" },
          { l: "Erectors' Manual - Pre-Cast Concrete", v: "2nd Ed." },
          { l: "Unbonded Post-Tensioning Level 1 Field Fundamentals", v: "3rd Ed." },
          { l: "ICC A117.1 Accessible and Usable Buildings", v: "2017" },
          { l: "ANSI/EIMA 99-A Standard for EIFS", v: "2017" },
          { l: "Green Building Fundamentals", v: "2nd Ed." },
          { l: "Developing Your Stormwater Pollution Prevention Plan", v: "2007" },
          { l: "Blueprint / physical diagram packet", v: "Provided onsite" },
        ],
      },
      {
        h: "The marking rules (straight from the bulletin)",
        list: [
          "Highlighting and underlining are *allowed*.",
          "Tabs are allowed but must be *permanent* - sticky notes and temporary tabs have to come off before the exam starts.",
          "No writing in the books beyond that, and *no loose or attached papers* - notes tucked into a book will get it pulled from your table.",
          "Silent, non-programmable, battery-powered calculators are permitted (no paper tape, no alphabetic keyboard).",
        ],
      },
      {
        h: "Which books carry the exam",
        p: [
          "All 24 are allowed and you should bring every one - the niche books are the fastest, easiest look-ups when their topic appears. But test-takers consistently report that the heavy hitters are a core group: the *IBC*, *OSHA 1926*, the *NASCLA Business and Law guide*, *Construction Jobsite Management*, *Mechanical and Electrical Systems*, *Quality Concrete Construction*, *Carpentry and Building Construction*, and *Principles and Practices of Commercial Construction*.",
          "Study accordingly: know the core books like your own garage, and know the niche books well enough to recognize when a question belongs to one - those are gift points if you can find them fast.",
        ],
      },
      {
        h: "Train the look-up, not just the reading",
        p: [
          "Owning the books is step one. Passing comes from drilling *where answers live*. Every ForemanPrep practice question cites the exact book and section its answer comes from - so every question you drill is also a rep of the look-up skill the exam really tests.",
        ],
      },
    ],
    ctaH: "Drill the books with citations on every question",
    ctaP: "156 practice questions, each one pointing at the exact reference and section - free 10-question sample, no signup.",
    ctas: [
      { label: "Start free practice", href: "/foremanprep/practice" },
      { label: "How to study for the NASCLA", href: "/foremanprep/guides/how-to-study-for-the-nascla-exam", ghost: true },
    ],
    related: ["how-to-study-for-the-nascla-exam", "free-nascla-practice-test", "is-the-nascla-exam-hard"],
  },
  {
    slug: "how-to-study-for-the-nascla-exam",
    metaTitle: "How to Study for the NASCLA Exam - A Working Contractor's Plan",
    metaDescription:
      "A realistic NASCLA study plan for people with day jobs: tab the books, drill timed look-ups to a 90-second bar, run full-length simulations, and use dead windshield time. Step by step.",
    eyebrow: "Study plan",
    h1: "How to Study for the NASCLA Exam",
    updated: "Updated August 2026",
    intro: [
      "This plan is built for someone studying around a job site, not a library. It reflects what successful test-takers consistently report: the NASCLA rewards *look-up speed, book familiarity, and stamina* - so that is what the plan trains. Most people who follow a plan like this spend 8 to 12 weeks preparing.",
    ],
    sections: [
      {
        h: "Step 1 - Set up the books (week 1)",
        p: [
          "Get the current reference books and set them up the way PSI allows: highlight, underline, and add *permanent* tabs for major chapters and the tables you will need under pressure. No loose notes - they are banned on exam day, so do not study with a crutch you cannot bring.",
          "As you tab, you are already studying: the point is a mental map of *which book owns which topic*.",
        ],
      },
      {
        h: "Step 2 - Drill by book, niche to broad (weeks 2-8)",
        p: [
          "Work through the references one at a time, and take practice questions for each as you go. Two rules make this effective:",
        ],
        list: [
          "*Look every answer up*, even the ones you know from the field. You are not training memory - you are training retrieval. The exam gives you under three minutes a question.",
          "*Hold yourself to a bar* before moving on: consistently right, at under about 90 seconds a question, for that book's material.",
        ],
      },
      {
        h: "Step 3 - Full-length simulations (final 2-3 weeks)",
        p: [
          "Nothing replaces sitting the real pace. Run full 115-question, 5.5-hour timed simulations - several of them - before test day. You will learn how you handle hour four, how long your look-ups really take, and which subjects still slow you down. People who walk in having already lived the time crunch describe the real exam as familiar; people who skipped this step describe it as drowning.",
          "A proven test-day strategy to practice during these runs: spend up to 30 minutes at the start sorting questions by which book answers them, then knock them out book by book, niche books first, finishing with the big code books. Budget the final hour for math, plan questions, and review.",
        ],
      },
      {
        h: "Step 4 - Use the dead hours",
        p: [
          "The hardest part of this exam for working contractors is not difficulty - it is finding hours. Two habits recover time you already have: drill 10-question rounds on your phone at lunch, and use audio study on the drive between jobs - hearing questions, answers, and explanations read aloud keeps the material moving on days you never open a book.",
        ],
      },
      {
        h: "Expect the math",
        p: [
          "Plan for more math than you think: business math (markup, overhead, payroll, retainage), construction calculations, and plan-reading questions with arithmetic inside. Most of it is simple - the trap is time. In your simulations, practice the discipline of flagging a long calculation, moving on, and coming back in your final hour rather than burning ten minutes mid-stream.",
        ],
      },
    ],
    ctaH: "Everything in this plan, in one tool",
    ctaP: "ForemanPrep gives you the drills with book-and-section citations, the full 115-question simulator on the real clock, an AI tutor for every question, and the entire bank voiced for hands-free audio study. Start with the free sample.",
    ctas: [
      { label: "Start free practice", href: "/foremanprep/practice" },
      { label: "Hear the audio study room", href: "/foremanprep/audio", ghost: true },
    ],
    related: ["free-nascla-practice-test", "nascla-reference-books", "is-the-nascla-exam-hard"],
  },
];

export function getGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/guides.ts (v1 - five SEO guides,
// facts verified vs nascla.org + PSI bulletin Aug 2026)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
