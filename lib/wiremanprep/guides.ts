// FILE: lib/wiremanprep/guides.ts
import "server-only";

// WiremanPrep guide library (v1) - five SEO articles targeting
// the searches electricians actually type: free practice test,
// is-it-hard, which states, reference books, how to study. Facts
// verified September 2026 against nascla.org and the PSI
// candidate bulletin (100+10 questions, 270 min, 75 bar, NEC 2020
// OR 2023 candidate's choice, approved reference list, 17 boards
// with the endorsement/transcript/score-window caveats). No
// prices anywhere - evergreen. Mirrors the ForemanPrep guide
// shape; rendering: app/wiremanprep/guides/[slug]/page.tsx.

export type WmGuideFact = { l: string; v: string };

export type WmGuideSection = {
  h?: string;
  p?: string[];
  list?: string[];
  facts?: WmGuideFact[];
};

export type WmGuideCta = { label: string; href: string; ghost?: boolean };

export type WmGuide = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  updated: string;
  intro: string[];
  sections: WmGuideSection[];
  ctaH: string;
  ctaP: string;
  ctas: WmGuideCta[];
  related: string[];
};

export const WM_GUIDES: WmGuide[] = [
  {
    slug: "free-nascla-electrical-practice-test",
    metaTitle: "Free NASCLA Electrical Practice Test - 10 Real-Style Questions",
    metaDescription: "Try a free 10-question practice round for the NASCLA Master/Unlimited Electrical Contractor exam - real exam style, instant explanations, Code citations, no signup.",
    eyebrow: "Free practice",
    h1: "Free NASCLA Electrical Practice Test",
    updated: "Updated September 2026",
    intro: [
      "The fastest way to know where you stand on the NASCLA Master/Unlimited electrical exam is to sit ten questions written the way the real test writes them - and you can do that right now, free, no signup.",
      "The sample below draws from the same question bank our full course uses: one question from each of the nine official subject areas, plus a second from the biggest one.",
    ],
    sections: [
      {
        h: "What the free round includes",
        p: [
          "Ten fixed questions in the real exam's style: multiple choice, four options, open-book oriented - the kind that hand you a scenario and expect you to know exactly which NEC table settles it.",
          "Every question comes with an instant explanation and the exact Code section or reference it lives in, because on this exam knowing WHERE to look is the skill being tested.",
        ],
      },
      {
        h: "What the real exam looks like",
        facts: [
          { l: "Scored questions", v: "100 (plus 10 unscored pretest items)" },
          { l: "Time limit", v: "270 minutes - 4.5 hours" },
          { l: "Passing score", v: "75 of 100 - 75%" },
          { l: "Format", v: "Open book, approved references only" },
          { l: "Administered by", v: "PSI (test centers)" },
        ],
      },
      {
        h: "How to use the sample",
        p: [
          "Take it cold, no books, and count your score. Seven or better cold usually means your fundamentals are in decent shape and your study plan should focus on look-up speed. Below five means the Code layout itself needs work first - which is normal, and fixable.",
          "Then take it again WITH your Code book and time yourself. The real exam gives you about 2 minutes 42 seconds a question - if a look-up takes you five minutes, that gap is your study plan.",
        ],
      },
      {
        h: "Why the sample never changes",
        p: [
          "The ten questions are fixed on purpose. A rotating sample would leak the full bank one free round at a time, and the value of the paid bank is that the questions stay fresh for practice.",
        ],
      },
    ],
    ctaH: "Ready for the full bank?",
    ctaP: "153 questions across the official 9-subject outline, a true 1:1 exam simulator on the real clock, and an AI tutor on every question.",
    ctas: [
      { label: "Start the free practice round", href: "/practice" },
      { label: "See what Full Access includes", href: "/buy", ghost: true },
    ],
    related: ["is-the-nascla-electrical-exam-hard", "how-to-study-for-the-nascla-electrical-exam", "nascla-electrical-exam-states"],
  },
  {
    slug: "is-the-nascla-electrical-exam-hard",
    metaTitle: "Is the NASCLA Electrical Exam Hard? Pass Bar, Format, Honest Take",
    metaDescription: "An honest look at the NASCLA Master/Unlimited electrical exam's difficulty: the 75% pass bar, the 4.5-hour open-book format, what trips people up, and how to prepare.",
    eyebrow: "Exam guide",
    h1: "Is the NASCLA Electrical Exam Hard?",
    updated: "Updated September 2026",
    intro: [
      "Honest answer: it is harder than most state electrical exams in one specific way - the pass bar is 75 of 100, where many trade exams pass you at 70 - but it is very beatable if you train the skill it actually tests.",
      "Here is what makes it hard, what makes it fair, and where people actually lose their points.",
    ],
    sections: [
      {
        h: "The numbers",
        facts: [
          { l: "Questions", v: "100 scored + 10 unscored pretest" },
          { l: "Clock", v: "4.5 hours - about 2 min 42 sec per question" },
          { l: "Pass bar", v: "75% - tougher than most trade exams" },
          { l: "Format", v: "Open book with the approved reference list" },
        ],
      },
      {
        h: "Why open book is the trap",
        p: [
          "You can bring the NEC, the OSHA standards, NFPA 70E, and Ugly's into the room - thousands of pages. Nobody fails because the answers are missing; they fail because they cannot find them fast enough.",
          "At 2:42 a question, a five-minute fumble through Article 430 costs you two other questions. The exam is really a speed test disguised as a knowledge test.",
        ],
      },
      {
        h: "Where the points actually go",
        p: [
          "The two biggest subject areas are General Code Requirements and Wiring & Protection - 17 questions each. Add Wiring Methods & Materials at 16 and Equipment at 13, and nearly two-thirds of the exam is straight NEC navigation.",
          "Calculations show up across subjects: ampacity adjustments, box fill, motor sizing, transformer protection, voltage drop. They are formula-driven and completely learnable - and they are the questions that separate passers from repeaters.",
        ],
      },
      {
        h: "The one advantage this exam gives you",
        p: [
          "It is standardized. The same 100-question outline everywhere it is accepted, and the exam lets you bring YOUR Code edition - 2020 or 2023. Train on the outline once and you are trained for every participating board.",
        ],
      },
    ],
    ctaH: "Train the skill it actually tests",
    ctaP: "Our practice questions cite the exact Code section on every answer, and the 1:1 simulator runs the real clock and the real subject weights.",
    ctas: [
      { label: "Try 10 free questions", href: "/practice" },
      { label: "See the full course", href: "/buy", ghost: true },
    ],
    related: ["how-to-study-for-the-nascla-electrical-exam", "free-nascla-electrical-practice-test", "nascla-electrical-exam-reference-books"],
  },
  {
    slug: "nascla-electrical-exam-states",
    metaTitle: "Which States Accept the NASCLA Electrical Exam? All 17 Boards",
    metaDescription: "The 17 licensing boards that accept the NASCLA Master/Unlimited electrical exam, the endorsement-only states, the transcript caveats, and what each board still requires.",
    eyebrow: "State guide",
    h1: "Which States Accept the NASCLA Electrical Exam?",
    updated: "Updated September 2026",
    intro: [
      "Seventeen licensing boards recognize the NASCLA Master/Unlimited electrical exam: Alabama, Arizona, Washington DC, Idaho, Kentucky, Louisiana, Mississippi, Missouri, Nebraska, New Mexico, North Carolina, South Carolina, Tennessee, Utah, Virginia, West Virginia, and Vanderburgh County in Indiana.",
      "But the list alone is misleading - the boards accept it in very different ways, and three caveats matter before you plan a multi-state career around one exam pass.",
    ],
    sections: [
      {
        h: "How the transfer normally works",
        p: [
          "You apply through NASCLA's National Examination Database, pass the exam once, and your score lives in the database. When you apply to a participating board, you send them an official NASCLA transcript electronically - no retesting.",
          "That is the promise, and for most of the 17 boards it works exactly that way.",
        ],
      },
      {
        h: "Caveat 1: the endorsement-only states",
        p: [
          "Utah and New Mexico only recognize the exam AFTER it has earned you a license somewhere else - Utah wants that license held at least 12 months, New Mexico wants a letter of good standing showing at least a year. Neither takes the exam as a direct substitute for a first license.",
          "If you hold no license anywhere yet, start with a direct-acceptance state and endorse into Utah or New Mexico later.",
        ],
      },
      {
        h: "Caveat 2: the test-through-us boards",
        p: [
          "Nebraska and Vanderburgh County (Evansville, Indiana) administer the NASCLA exam as their own exam but do NOT accept incoming transcripts - a pass earned for another state will not transfer in. If either is your home jurisdiction, apply there first and take the exam through them.",
          "A pass taken through Nebraska still lands in the national database, so it counts everywhere else too - the door only swings one way.",
        ],
      },
      {
        h: "Caveat 3: score windows",
        p: [
          "Kentucky and South Carolina accept scores only within 3 years of the exam date, and Tennessee treats exams as valid for about 2 years. An old pass can quietly expire for those boards - apply while your score is fresh.",
          "Every board also layers its own requirements on top: business and law exams, experience hours, insurance, financial statements. Our state pages break down each board's stack - and always confirm current rules with the board itself before scheduling.",
        ],
      },
    ],
    ctaH: "One exam, seventeen doors",
    ctaP: "See your board's exact requirements on the state pages, then train for the one exam that opens them all.",
    ctas: [
      { label: "Browse the state pages", href: "/states" },
      { label: "Start free practice", href: "/practice", ghost: true },
    ],
    related: ["is-the-nascla-electrical-exam-hard", "free-nascla-electrical-practice-test", "how-to-study-for-the-nascla-electrical-exam"],
  },
  {
    slug: "nascla-electrical-exam-reference-books",
    metaTitle: "NASCLA Electrical Exam Reference Books - What You Can Bring",
    metaDescription: "The approved reference list for the NASCLA Master/Unlimited electrical exam: NEC 2020 or 2023 (your choice), OSHA standards, NFPA 70E, Ugly's, tabbing rules, and how to use them fast.",
    eyebrow: "Exam guide",
    h1: "The NASCLA Electrical Exam Reference Books",
    updated: "Updated September 2026",
    intro: [
      "The NASCLA Master/Unlimited electrical exam is open book - but only the approved references get through the door, and how well you know your way around them decides your score.",
      "Here is the list, the one choice you get to make, and the tabbing rules.",
    ],
    sections: [
      {
        h: "The approved references",
        list: [
          "National Electrical Code (NEC) or NEC Handbook - YOUR CHOICE of the 2020 or 2023 edition",
          "OSHA 29 CFR 1926 (construction) and 29 CFR 1910 (general industry) standards",
          "NFPA 70E, Standard for Electrical Safety in the Workplace (2024)",
          "Ugly's Electrical References (2023)",
          "NASCLA Contractors Guide to Business, Law and Project Management (14th edition)",
          "A Guide to the Project Management Body of Knowledge (PMBOK Guide, 7th edition)",
        ],
      },
      {
        h: "The 2020-or-2023 choice",
        p: [
          "This exam is unusual: it accepts either the 2020 or the 2023 NEC, so you bring the edition you already own and work with. You do not need to buy the newer book to sit the exam.",
          "Check the current PSI candidate bulletin before test day - reference lists get updated, and the bulletin is the final word on what gets through the door.",
        ],
      },
      {
        h: "Tabbing rules",
        p: [
          "Permanent tabs are allowed and you should use them heavily - the difference between a 30-second look-up and a three-minute one is usually a tab. Loose papers and removable notes are not allowed, and books get inspected at check-in.",
          "Tab the workhorses: Table 310.16, the adjustment factors, box fill in 314.16, conduit fill in Chapter 9 and Annex C, the motor tables in 430, transformer protection in 450.3, and the grounding tables 250.66 and 250.122.",
        ],
      },
      {
        h: "Train with the books you will carry",
        p: [
          "Every practice question in our course cites the exact section or table the answer lives in - so every practice round doubles as navigation training in the actual books you will bring to the exam.",
        ],
      },
    ],
    ctaH: "Learn where every answer lives",
    ctaP: "153 practice questions, each one pointing at the exact Code section - the open-book skill, trained the direct way.",
    ctas: [
      { label: "Try 10 free questions", href: "/practice" },
      { label: "See the full course", href: "/buy", ghost: true },
    ],
    related: ["how-to-study-for-the-nascla-electrical-exam", "is-the-nascla-electrical-exam-hard", "free-nascla-electrical-practice-test"],
  },
  {
    slug: "how-to-study-for-the-nascla-electrical-exam",
    metaTitle: "How to Study for the NASCLA Electrical Exam - A Working Plan",
    metaDescription: "A practical study plan for the NASCLA Master/Unlimited electrical exam: weight your time like the outline, train look-up speed, drill the calculations, and simulate the real 4.5-hour clock.",
    eyebrow: "Study plan",
    h1: "How to Study for the NASCLA Electrical Exam",
    updated: "Updated September 2026",
    intro: [
      "You do not need six months. You need a plan that matches the exam's actual shape: nine subject areas with known weights, an open-book format that rewards navigation speed, and a 75% bar that punishes guessing.",
      "Here is the plan we would give a working electrician with a job and a family and three weeks.",
    ],
    sections: [
      {
        h: "Step 1: Weight your time like the exam does",
        p: [
          "The outline is public: General Code Requirements and Wiring & Protection are 17 questions each, Wiring Methods & Materials is 16, Equipment is 13, Theory is 11, Safety is 9, Project Design & Management and Special Occupancies are 8 each, Communication Systems is 1.",
          "Study in that proportion. An evening on Communication Systems is a wasted evening; an evening in Chapter 3 of the Code is 16 points.",
        ],
      },
      {
        h: "Step 2: Train look-ups, not memory",
        p: [
          "This exam does not reward memorizing ampacities - it rewards FINDING them in under a minute. Every practice question you miss, do not just read the explanation: physically open your Code book to the cited section and put your finger on the answer. That motion is the exam skill.",
          "Tab your book as you go. By exam day the tabs should be worn.",
        ],
      },
      {
        h: "Step 3: Drill the calculations until they bore you",
        p: [
          "Box fill, conductor derating, voltage drop, motor conductor and overload sizing, transformer protection percentages. These follow fixed recipes, they show up all over the exam, and they are the questions where prepared candidates bank points fast.",
          "Do them on paper, show your steps, and check them - arithmetic slips under time pressure are the classic way a 78 becomes a 73.",
        ],
      },
      {
        h: "Step 4: Simulate the real thing at least twice",
        p: [
          "Before test day, sit at least two full 100-question, 4.5-hour simulated exams at the real subject weights. The first one teaches you what four and a half hours feels like; the second one proves your pacing fix worked.",
          "Flag and skip anything that stalls you - the real exam lets you navigate freely, and the discipline of coming back to hard ones is worth several points on its own.",
        ],
      },
      {
        h: "Step 5: The last week",
        p: [
          "Stop learning new material three days out. Re-run your missed questions, re-walk your tabs, and confirm your test-center paperwork and approved references against the current PSI bulletin. Sleep is worth more than a final cram.",
        ],
      },
    ],
    ctaH: "Everything in that plan, in one place",
    ctaP: "Weighted practice by subject, Code citations on every answer, a 1:1 simulator on the real clock, and an AI tutor when an explanation is not enough.",
    ctas: [
      { label: "Start free practice", href: "/practice" },
      { label: "Get Full Access", href: "/buy", ghost: true },
    ],
    related: ["free-nascla-electrical-practice-test", "nascla-electrical-exam-reference-books", "is-the-nascla-electrical-exam-hard"],
  },
];

export function getWmGuide(slug: string): WmGuide | null {
  return WM_GUIDES.find((g) => g.slug === slug) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/wiremanprep/guides.ts (v1 - five verified
// SEO guides, no prices, evergreen)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
