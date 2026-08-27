// FILE: lib/foremanprep/blstates.ts

// ForemanPrep B&L STATE PACKS (v1 - Tennessee, Georgia, South
// Carolina; 8 questions each). This is the state-specific layer
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
  examLine: string;
  verified: string;
  questions: BlQuestion[];
};

export const BL_STATE_PACKS: BlStatePack[] = [
  {
    key: "tn",
    name: "Tennessee",
    examLine: "50 questions, 140 minutes, 73% to pass - open book",
    verified: "facts verified Aug 2026",
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
    examLine: "60 questions, 180 minutes, 70% to pass",
    verified: "facts verified Aug 2026",
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
    examLine: "Business Management & Law exam via PSI - open book",
    verified: "facts verified Aug 2026",
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

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/blstates.ts (v1 - TN, GA, SC
// state packs: 24 verified state-specific questions)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
