// FILE: lib/foremanprep/blstates.ts

// ForemanPrep B&L STATE DATA (v2 - ALL 16 Business & Law states).
// Two layers live here now:
// 1. EXAM FORMATS for every NASCLA state with a B&L-type exam -
//    question count, clock, pass bar, book policy, reference,
//    administrator - each verified Aug 2026 against the PSI/Prov
//    candidate bulletin or the state board itself. The honesty
//    notes carry the oddballs: CA is CLOSED book and reports only
//    pass/fail; AZ's SRE is an online course with no published
//    format (sim: "none"); LA runs untimed in the board's portal;
//    VA is a 3-part exam (we sim the 50-question General part);
//    WV renamed its exam in 2024 and dropped the NASCLA guide.
//    North Carolina is EXCLUDED on purpose: no separate B&L exam.
// 2. STATE QUESTION PACKS (statute-verified) - TN, GA, SC so far,
//    8 questions each; more states land as batches. States without
//    a pack yet carry an empty questions array.
// v1 notes: TN/GA/SC packs, 8 questions each. This is the state-specific layer
// the core bank deliberately leaves out: lien deadlines, license
// thresholds, retainage caps - the numbers that differ state to
// state. Every fact verified against primary sources Aug 2026:
// state statutes (T.C.A., O.C.G.A., S.C. Code), the SC CLB's own
// 2023 legislative update (the $10,000 threshold), and the PSI
// exam bulletins for formats. More states land as separate
// batches. Self-contained on the same doctrine as blbank: only a
// type import, so it typechecks the moment it lands.

import type { BlQuestion } from "./blbank";

export type BlStatePack = {
  key: string;
  name: string;
  blName: string;
  admin: string;
  simQuestions: number | null;
  minutes: number | null;
  passPct: number | null;
  book: "open" | "closed" | "course";
  reference: string;
  note: string;
  sim: "timed" | "untimed" | "none";
  examLine: string;
  verified: string;
  questions: BlQuestion[];
};

export const BL_STATE_PACKS: BlStatePack[] = [
  {
    key: "tn",
    name: "Tennessee",
    blName: "Business and Law Management Examination",
    admin: "PSI",
    simQuestions: 50,
    minutes: 140,
    passPct: 73,
    book: "open",
    reference: "NASCLA Contractors Guide, Tennessee edition",
    note: "Open book on the NASCLA Tennessee guide. 37 of 50 to pass.",
    sim: "timed",
    examLine: "50 questions - 140 min - 73% - open book",
    verified: "verified Aug 2026",
    questions: [
      {
        id: "bl-tn-001",
        domain: "li",
        q: "In Tennessee, a contractor's license is required before bidding or offering a price on a project where the total cost is:",
        choices: [
          "$1,000 or more",
          "$10,000 or more",
          "$25,000 or more",
          "$100,000 or more",
        ],
        answer: 2,
        explain:
          "Tennessee's line is $25,000: at or above it, you must hold the license BEFORE you bid, not just before you build. Bidding unlicensed is itself a violation, and recovery for unlicensed work is limited to documented expenses.",
        cite: "Tennessee Board for Licensing Contractors; T.C.A. Title 62, Ch. 6",
      },
      {
        id: "bl-tn-002",
        domain: "fm",
        q: "Under Tennessee's Prompt Pay Act, retainage withheld on a construction contract may not exceed:",
        choices: ["10% of the contract amount", "5% of the contract amount", "3.5% of the contract amount", "There is no limit"],
        answer: 1,
        explain:
          "Tennessee caps retainage at 5% of the contract amount - half the 10% habit many contractors bring from other states. The cap applies down the chain: what the owner may hold from the prime, the prime may hold from subs.",
        cite: "T.C.A. 66-34-103 (Prompt Pay Act)",
      },
      {
        id: "bl-tn-003",
        domain: "fm",
        q: "Once work is completed under a Tennessee contract, the owner must release retainage to the prime contractor within:",
        choices: ["10 days", "30 days", "90 days", "One year"],
        answer: 2,
        explain:
          "Ninety days after completion of the work, the retainage must be released and paid to the prime - who then has 10 days to pass each sub's share down. The clocks are statutory, not negotiable courtesy.",
        cite: "T.C.A. 66-34-103",
      },
      {
        id: "bl-tn-004",
        domain: "ln",
        q: "A Tennessee subcontractor who did NOT contract directly with the owner preserves lien rights by serving a Notice of Nonpayment within:",
        choices: [
          "30 days of the project's final completion, one notice total",
          "One year of the contract signing",
          "10 days of each unpaid invoice",
          "90 days of the last day of EACH month in which work or materials were furnished",
        ],
        answer: 3,
        explain:
          "Tennessee's rule is month-by-month: for every unpaid month of furnishing, a separate Notice of Nonpayment is due within 90 days of that month's last day. Miss a month's notice and that month's lien rights are gone - the calendar discipline IS the lien right.",
        cite: "T.C.A. 66-11-145",
      },
      {
        id: "bl-tn-005",
        domain: "ln",
        q: "A Tennessee prime contractor must file suit to enforce its mechanics lien within:",
        choices: [
          "6 months of recording the lien",
          "1 year from the last date of furnishing labor or materials",
          "30 days of substantial completion",
          "There is no deadline for prime contractors",
        ],
        answer: 1,
        explain:
          "The prime's enforcement window runs one year from last furnishing (an owner's written demand can shorten it). Remote claimants run on faster clocks tied to their lien filing - in lien law, who you contracted with decides which calendar you live on.",
        cite: "T.C.A. Title 66, Ch. 11 (mechanics liens)",
      },
      {
        id: "bl-tn-006",
        domain: "ln",
        q: "On an owner-occupied residence of one to four units in Tennessee, mechanics lien rights belong to:",
        choices: [
          "Every contractor, sub, and supplier on the job",
          "Only parties who contracted directly with the owner",
          "Only material suppliers",
          "No one - residential property is exempt from liens",
        ],
        answer: 1,
        explain:
          "Tennessee shields owner-occupied 1-4 unit homes from remote claims: subs and suppliers with no direct contract with the homeowner have no lien there. Prime contractors - and anyone else in direct privity with the owner - keep their rights.",
        cite: "T.C.A. Title 66, Ch. 11 (residential restriction)",
      },
      {
        id: "bl-tn-007",
        domain: "li",
        q: "Tennessee's Business and Law exam runs:",
        choices: [
          "50 questions in 140 minutes, 73% to pass",
          "115 questions in 330 minutes, 70% to pass",
          "60 questions in 180 minutes, 70% to pass",
          "100 questions in 240 minutes, 75% to pass",
        ],
        answer: 0,
        explain:
          "Fifty questions, 140 minutes, 37 correct (73%) to pass - open book on the NASCLA Contractors Guide, Tennessee edition. That is a 2:48-per-question pace, which is exactly what this course's exam timer trains.",
        cite: "PSI Candidate Bulletin - Tennessee Business and Law Management",
      },
      {
        id: "bl-tn-008",
        domain: "fm",
        q: "A Tennessee owner or contractor who violates the retainage rules (over-withholding or late release) faces:",
        choices: [
          "No penalty - the rules are advisory",
          "Only a civil claim for the money",
          "A Class A misdemeanor with fines that can reach $3,000 per day of violation",
          "Automatic license suspension, nothing else",
        ],
        answer: 2,
        explain:
          "Tennessee gave its retainage statute teeth: violations are a Class A misdemeanor with per-day fines up to $3,000, on top of owing the money. Retainage in Tennessee is compliance, not a negotiating chip.",
        cite: "T.C.A. 66-34-103 (penalties)",
      },
    ],
  },
  {
    key: "ga",
    name: "Georgia",
    blName: "Georgia Business and Law Examination",
    admin: "PSI",
    simQuestions: 60,
    minutes: 180,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Georgia edition",
    note: "A full 3:00 per question - roomier than most states.",
    sim: "timed",
    examLine: "60 questions - 180 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [
      {
        id: "bl-ga-001",
        domain: "li",
        q: "In Georgia, a state contractor's license is required for construction projects where the combined labor and materials cost exceeds:",
        choices: ["$2,500", "$10,000", "$25,000", "$50,000"],
        answer: 0,
        explain:
          "Georgia's threshold is low: over $2,500 in combined labor and materials requires a state license from the State Licensing Board for Residential and General Contractors. Plenty of 'small' jobs clear that bar.",
        cite: "Georgia State Licensing Board for Residential and General Contractors",
      },
      {
        id: "bl-ga-002",
        domain: "li",
        q: "A Georgia General Contractor LIMITED tier license caps each contract at:",
        choices: ["$500,000", "$1,000,000", "$2,500,000", "It carries no cap - only the Residential tiers are capped"],
        answer: 1,
        explain:
          "The Limited tier may take any type of construction work but no single contract over $1,000,000; the Unlimited tier removes the cap. The Residential-Basic and Residential-Light Commercial classifications are scope-limited rather than dollar-capped.",
        cite: "Georgia State Licensing Board - general contractor classifications",
      },
      {
        id: "bl-ga-003",
        domain: "ln",
        q: "A Georgia claim of lien must be filed within:",
        choices: [
          "60 days of the contract date",
          "90 days after the claimant last furnished labor or materials",
          "6 months after project completion",
          "30 days after the owner's final payment to the prime",
        ],
        answer: 1,
        explain:
          "Ninety days from the claimant's own last furnishing - not from project completion. Each party's clock runs on its own last day of work or delivery, and a lien filed on day 91 is no lien at all.",
        cite: "O.C.G.A. 44-14-361.1",
      },
      {
        id: "bl-ga-004",
        domain: "ln",
        q: "When a Notice of Commencement has been filed on a Georgia project, a sub-tier claimant preserves lien rights by sending a Notice to Contractor within:",
        choices: [
          "30 days of first furnishing labor or materials",
          "90 days of last furnishing",
          "10 days of signing its subcontract",
          "No notice is ever required in Georgia",
        ],
        answer: 0,
        explain:
          "Where a Notice of Commencement is on file, remote claimants must send the Notice to Contractor - to the owner and the general contractor - within 30 days of FIRST furnishing. No Notice of Commencement on file, no NTC requirement; check the record at job start.",
        cite: "O.C.G.A. 44-14-361.3 / 44-14-361.5",
      },
      {
        id: "bl-ga-005",
        domain: "ln",
        q: "After recording a Georgia claim of lien, the claimant must commence its enforcement action within:",
        choices: [
          "90 days of recording",
          "180 days of recording",
          "365 days of recording",
          "There is no deadline once the lien is recorded",
        ],
        answer: 2,
        explain:
          "Georgia gives 365 days from the lien filing to start the action - and within 30 days of filing suit, a notice of commencement of lien action goes to the county records. Recording preserves the claim; suing on time keeps it alive.",
        cite: "O.C.G.A. 44-14-361.1",
      },
      {
        id: "bl-ga-006",
        domain: "ln",
        q: "Under Georgia lien law, the total of all liens on an improvement is capped at:",
        choices: [
          "The property's assessed value",
          "There is no cap on aggregate liens",
          "The contract price of the improvements or services",
          "Twice the prime contract amount",
        ],
        answer: 2,
        explain:
          "The aggregate of all claims cannot exceed the contract price - an owner who has managed payments properly cannot be liened into paying for the project twice. It is one of Georgia's core owner protections, and waiver discipline is how contractors live inside it.",
        cite: "O.C.G.A. 44-14-361.1",
      },
      {
        id: "bl-ga-007",
        domain: "li",
        q: "Georgia's Business and Law exam runs:",
        choices: [
          "50 questions in 140 minutes, 73% to pass",
          "60 questions in 180 minutes, 70% to pass",
          "115 questions in 330 minutes, 70% to pass",
          "80 questions in 200 minutes, 75% to pass",
        ],
        answer: 1,
        explain:
          "Sixty questions, 180 minutes, 70% to pass - a full 3:00 per question, roomier than Tennessee's 2:48. Train at the tighter pace and Georgia's clock will feel generous.",
        cite: "PSI Candidate Bulletin - Georgia Business and Law",
      },
      {
        id: "bl-ga-008",
        domain: "li",
        q: "The Georgia board that licenses general and residential contractors is:",
        choices: [
          "The Georgia Construction Industry Licensing Board",
          "The State Licensing Board for Residential and General Contractors",
          "The Georgia Department of Transportation",
          "Each county's building department - there is no state board",
        ],
        answer: 1,
        explain:
          "Georgia licenses through the State Licensing Board for Residential and General Contractors under the Secretary of State. Knowing your board's exact name matters - it is where license law questions, renewals, and complaints actually live.",
        cite: "Georgia Secretary of State - State Licensing Board for Residential and General Contractors",
      },
    ],
  },
  {
    key: "sc",
    name: "South Carolina",
    blName: "Business Management and Law Examination",
    admin: "PSI",
    simQuestions: 50,
    minutes: 120,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, South Carolina edition",
    note: "35 of 50 to pass, open book on the NASCLA SC guide.",
    sim: "timed",
    examLine: "50 questions - 120 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [
      {
        id: "bl-sc-001",
        domain: "li",
        q: "In South Carolina, a commercial contractor's license (CLB) is required when the total cost of construction is greater than:",
        choices: ["$5,000", "$10,000", "$30,000", "$50,000"],
        answer: 1,
        explain:
          "The threshold is greater than $10,000 - raised from $5,000 by the 2023 legislative update (H4115). An older '$5,000' answer is exactly the kind of stale fact exams and old study guides still carry; the board's current line is $10,000.",
        cite: "S.C. Contractor's Licensing Board - 2023 legislative update (H4115)",
      },
      {
        id: "bl-sc-002",
        domain: "li",
        q: "South Carolina general contractor license GROUPS set each licensee's bid/job limit. Group 1's limit, and the basis for qualifying into higher groups, are:",
        choices: [
          "$100,000 - qualify by net worth OR working capital shown in financial documentation",
          "$50,000 - qualify by years of experience only",
          "$250,000 - qualify by exam score",
          "There are no groups - every SC license is unlimited",
        ],
        answer: 0,
        explain:
          "Group 1 caps bids and jobs at $100,000, and the ladder climbs to Group 5's unlimited. Since the 2023 update you qualify for a group by meeting the NET WORTH or the WORKING CAPITAL requirement - either one, shown through your financial documentation.",
        cite: "S.C. Contractor's Licensing Board - license groups (H4115 update)",
      },
      {
        id: "bl-sc-003",
        domain: "li",
        q: "Commercial and residential construction in South Carolina are licensed by:",
        choices: [
          "One combined state contractor board",
          "Two separate bodies - the Contractor's Licensing Board (commercial) and the Residential Builders Commission (residential)",
          "County building departments only",
          "The Secretary of State directly",
        ],
        answer: 1,
        explain:
          "South Carolina splits the house: the CLB licenses general and mechanical (commercial) contractors, while the Residential Builders Commission handles residential builders and specialty contractors - both under LLR. Which board owns your license decides which rules govern you.",
        cite: "S.C. Department of Labor, Licensing and Regulation (LLR)",
      },
      {
        id: "bl-sc-004",
        domain: "ln",
        q: "A South Carolina mechanics lien must be filed AND served on the owner within:",
        choices: [
          "30 days of project completion",
          "6 months of the contract date",
          "1 year of last furnishing",
          "90 days of the claimant's last furnishing of labor or materials",
        ],
        answer: 3,
        explain:
          "Both steps - recording with the register of deeds AND service on the owner - must land inside the same 90-day window from last furnishing. Filing without timely service is a lien with a hole in it.",
        cite: "S.C. Code Title 29, Ch. 5 (mechanics liens)",
      },
      {
        id: "bl-sc-005",
        domain: "ln",
        q: "To keep a South Carolina mechanics lien alive, suit (with a notice of pendency) must be commenced within:",
        choices: [
          "6 months after the claimant last furnished labor or materials",
          "365 days after recording the lien",
          "90 days after recording the lien",
          "2 years after project completion",
        ],
        answer: 0,
        explain:
          "Six months from last furnishing - suit filed and lis pendens recorded - or the lien dissolves by statute. South Carolina's enforcement clock is one of the shorter ones; calendar it the day the work ends.",
        cite: "S.C. Code 29-5-90",
      },
      {
        id: "bl-sc-006",
        domain: "ln",
        q: "South Carolina is an 'unpaid balance' lien state, which means a subcontractor's lien is limited to:",
        choices: [
          "10% of the prime contract",
          "The sub's actual costs, excluding profit",
          "The amount the owner still owes the general contractor when the lien is filed",
          "The full value of the sub's contract, regardless of what the owner has paid",
        ],
        answer: 2,
        explain:
          "The owner's exposure is capped at what remains unpaid to the GC at filing time. An owner who has paid the prime in full can beat a sub's lien - which is why timing, notices, and watching the money upstream matter so much for SC subs.",
        cite: "S.C. Code Title 29, Ch. 5 (unpaid balance rule)",
      },
      {
        id: "bl-sc-007",
        domain: "ln",
        q: "Before filing a lien, a South Carolina claimant who did NOT contract directly with the owner must:",
        choices: [
          "Obtain the general contractor's written permission",
          "Post a bond with the county",
          "Nothing - no preliminary step exists in South Carolina",
          "Serve the owner and general contractor with a Notice of Furnishing Labor or Materials",
        ],
        answer: 3,
        explain:
          "Remote claimants serve the Notice of Furnishing on the owner and GC to set up their lien rights. The general contractor's optional Notice of Project Commencement (within 15 days of starting) changes the notice landscape too - check for one at job start.",
        cite: "S.C. Code Title 29, Ch. 5 (notice of furnishing)",
      },
      {
        id: "bl-sc-008",
        domain: "li",
        q: "A South Carolina RESIDENTIAL builder's license (Residential Builders Commission) is required for residential projects exceeding:",
        choices: ["$500", "$5,000", "$10,000", "$25,000"],
        answer: 1,
        explain:
          "Residential builders license at over $5,000; residential SPECIALTY contractors register at over $500. Note the commercial CLB threshold is different ($10,000) - three different numbers, three different doors, a classic exam trap.",
        cite: "S.C. Residential Builders Commission (LLR)",
      },
    ],
  },
  {
    key: "al",
    name: "Alabama",
    blName: "Business and Law Examination",
    admin: "PSI",
    simQuestions: 50,
    minutes: 120,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Alabama General edition",
    note: "35 of 50 to pass, open book on the NASCLA Alabama guide.",
    sim: "timed",
    examLine: "50 questions - 120 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "az",
    name: "Arizona",
    blName: "Statutes and Rules Exam (SRE)",
    admin: "AZ Registrar of Contractors (online, GMetrix)",
    simQuestions: null,
    minutes: null,
    passPct: 70,
    book: "course",
    reference: "The ROC's own online Statutes & Rules training course",
    note: "Arizona's SRE is an ONLINE course with a built-in exam run by the Registrar - no published question count or clock, so there is no 1:1 sim to build. Drill the core bank here, then take the ROC's course.",
    sim: "none",
    examLine: "Online course + exam via the ROC - 70% to pass",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "ar",
    name: "Arkansas",
    blName: "Business and Law Examination",
    admin: "PSI",
    simQuestions: 50,
    minutes: 120,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Arkansas edition",
    note: "35 of 50 to pass, open book on the NASCLA Arkansas guide.",
    sim: "timed",
    examLine: "50 questions - 120 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "ca",
    name: "California",
    blName: "CSLB Law and Business Examination",
    admin: "PSI for the CSLB",
    simQuestions: 115,
    minutes: 210,
    passPct: null,
    book: "closed",
    reference: "The CSLB's free Law and Business Study Guide",
    note: "The only CLOSED-book B&L exam in the NASCLA states - no references allowed on the real thing. The CSLB reports pass/fail only (about 115 questions in 3.5 hours is the widely reported format); this sim grades at a 70% training bar.",
    sim: "timed",
    examLine: "~115 questions - 210 min - CLOSED book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "fl",
    name: "Florida",
    blName: "Business and Finance Examination",
    admin: "Pearson VUE / Professional Testing for the DBPR",
    simQuestions: 120,
    minutes: 390,
    passPct: 70,
    book: "open",
    reference: "Florida's approved reference list (Contractors Manual, AIA forms, FS 455)",
    note: "The marathon: 120 questions in one 6.5-hour sitting - the longest B&L-type exam anywhere. Open book from Florida's own reference list (not the NASCLA guide).",
    sim: "timed",
    examLine: "120 questions - 390 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "la",
    name: "Louisiana",
    blName: "Louisiana Business and Law Exam",
    admin: "LSLBC (online, in the board's portal)",
    simQuestions: 50,
    minutes: null,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Louisiana edition (the board's own course is the official prep)",
    note: "Taken ONLINE in the LSLBC licensing portal with no hard time limit - the board says most finish in 30-45 minutes. We run this sim untimed, like the real thing.",
    sim: "untimed",
    examLine: "50 questions - untimed (online) - 70%",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "ms",
    name: "Mississippi",
    blName: "Law and Business Management Examination",
    admin: "PSI",
    simQuestions: 50,
    minutes: 120,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Mississippi 6th edition",
    note: "Open book on the NASCLA Mississippi guide (6th edition only since Oct 2023).",
    sim: "timed",
    examLine: "50 questions - 120 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "nv",
    name: "Nevada",
    blName: "Contractor Management Survey (CMS) Examination",
    admin: "PSI",
    simQuestions: 60,
    minutes: 120,
    passPct: 75,
    book: "open",
    reference: "Construction Business and Law Manual for Nevada (PSI)",
    note: "Nevada calls it the CMS exam and sets the bar at 75% (45 of 60) - higher than most states.",
    sim: "timed",
    examLine: "60 questions - 120 min - 75% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "nm",
    name: "New Mexico",
    blName: "Business and Law Exam",
    admin: "PSI",
    simQuestions: 50,
    minutes: 130,
    passPct: 75,
    book: "open",
    reference: "NASCLA Contractors Guide, Basic 14th edition",
    note: "75% to pass (38 of 50) - and New Mexico uses the NASCLA BASIC edition, not a state edition.",
    sim: "timed",
    examLine: "50 questions - 130 min - 75% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "or",
    name: "Oregon",
    blName: "Oregon CCB License Examination",
    admin: "PSI",
    simQuestions: 80,
    minutes: 180,
    passPct: 70,
    book: "open",
    reference: "NASCLA Oregon Construction Contractors edition",
    note: "Oregon's CCB exam IS the business/law exam - 80 scored questions on business practice and Oregon law, taken after the 16-hour pre-license training.",
    sim: "timed",
    examLine: "80 questions - 180 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "ut",
    name: "Utah",
    blName: "Utah Business and Law Examination",
    admin: "Prov",
    simQuestions: 60,
    minutes: 120,
    passPct: 70,
    book: "open",
    reference: "NASCLA Utah edition or the Utah Contractor Education Book",
    note: "Utah also requires the 25-hour pre-license course (plus a 5-hour business & law course for general classifications) - the exam is only part of the door.",
    sim: "timed",
    examLine: "60 questions - 120 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "va",
    name: "Virginia",
    blName: "Virginia Contractor Business Exam (3 parts)",
    admin: "PSI for DPOR",
    simQuestions: 50,
    minutes: 100,
    passPct: 70,
    book: "open",
    reference: "NASCLA Contractors Guide, Virginia edition + the Virginia USBC",
    note: "Virginia's exam is THREE parts in one sitting for Class A - Virginia (24q/48min/75%), General (50q/100min/70%), and Advanced (24q/60min) - each passed separately, all open book. This sim runs the 50-question General part, the business & law heart.",
    sim: "timed",
    examLine: "3 parts, 98 questions total - sim runs the 50-q General part",
    verified: "verified Aug 2026",
    questions: [],
  },
  {
    key: "wv",
    name: "West Virginia",
    blName: "Contractor Licensing Act Examination",
    admin: "Prov",
    simQuestions: 90,
    minutes: 180,
    passPct: 70,
    book: "open",
    reference: "West Virginia Contractor Licensing Act Study Guide (Prov)",
    note: "West Virginia RENAMED this exam in late 2024 (it was 'Business & Law', now 90 questions as the 'Contractor Licensing Act' exam) and its official study guide is WV's own book, NOT the NASCLA guide. Our core bank drills the shared fundamentals; get the WV guide for the statute layer.",
    sim: "timed",
    examLine: "90 questions - 180 min - 70% - open book",
    verified: "verified Aug 2026",
    questions: [],
  },
];

export function getBlStatePack(key: string): BlStatePack | null {
  return BL_STATE_PACKS.find((p) => p.key === key) ?? null;
}

export function getBlStateQuestion(id: string): BlQuestion | null {
  for (const pack of BL_STATE_PACKS) {
    const q = pack.questions.find((x) => x.id === id);
    if (q) return q;
  }
  return null;
}

// The states with statute question packs so far. The bl practice
// page's pack section filters on this.
export const BL_PACKS_LIVE: BlStatePack[] = BL_STATE_PACKS.filter(
  (p) => p.questions.length > 0
);

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/blstates.ts (v2 - all 16 B&L
// states with verified exam formats; TN/GA/SC question packs)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
