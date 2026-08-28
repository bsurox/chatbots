// FILE: lib/foremanprep/blstates.ts

// ForemanPrep B&L STATE DATA (v3 - EVERY STATE HAS ITS PACK).
// The 13 remaining statute packs land: AL, AR, AZ, CA, FL, LA,
// MS, NM, NV, OR, UT, VA, WV join TN/GA/SC at 8 questions each -
// 128 statute questions across all 16 B&L states. Every fact was
// verified against a PRIMARY source in Aug 2026 (the state code
// on the official legislature site, the licensing board's own
// pages, or the official PSI/Prov/board candidate bulletin), with
// the source URL and a verbatim proof quote captured during
// research. Recent law changes are reflected on purpose: CA's
// $1,000 minor-work exemption (AB 2622, 2025), LA's $50,000
// residential threshold and 7-day prompt pay (2026 rewrite),
// UT's $7,000 handyman line (2024), MS's 5% private retainage
// cap (2024), VA's $1,000/$30,000/$150,000 class tiers. AZ has
// no B&L exam (its SRE is a course) but its pack drills the same
// A.R.S. numbers the SRE teaches. Two layers live here:
// 1. EXAM FORMATS for every NASCLA state with a B&L-type exam.
// 2. STATE QUESTION PACKS - now all 16 states.
// v2 notes: ALL 16 Business & Law states' exam formats:
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
    questions: [
      {
        id: "bl-al-001",
        domain: "li",
        q: "In Alabama, a state general contractor's license is required for commercial or industrial construction when the cost of the undertaking is:",
        choices: [
          "$10,000 or more",
          "$25,000 or more",
          "$50,000 or more",
          "$100,000 or more",
        ],
        answer: 2,
        explain:
          "Alabama draws the line at $50,000, and it covers superintending as well as building, so managing a $50,000 job for a fee without a license is still unlicensed contracting. Subcontractors need a license at the same $50,000 level, and swimming pool work has its own much lower $5,000 trigger.",
        cite: "Ala. Code 34-8-1 (Licensing Board for General Contractors)",
      },
      {
        id: "bl-al-002",
        domain: "li",
        q: "Alabama's Home Builders Licensure Board license is required for residential construction or remodeling when the cost of the undertaking exceeds:",
        choices: [
          "$2,500",
          "$10,000",
          "$30,000",
          "$50,000",
        ],
        answer: 1,
        explain:
          "Residential work runs under a separate board with a much lower line: over $10,000 and you need the HBLB license, while the $50,000 figure belongs to the commercial general contractor board. Residential roofers trip an even lower $2,500 trigger, and building homes unlicensed is a Class A misdemeanor.",
        cite: "Ala. Code 34-14A-2, 34-14A-14 (Home Builders Licensure Law)",
      },
      {
        id: "bl-al-003",
        domain: "eb",
        q: "The Alabama Licensing Board for General Contractors sets a licensee's maximum bid limit at:",
        choices: [
          "10 times the lesser of net worth or working capital",
          "10 times gross annual revenue",
          "5 times bonding capacity",
          "There is no bid limit in Alabama",
        ],
        answer: 0,
        explain:
          "Your financial statement decides how big a job you may bid: the cap is ten times net worth or working capital, whichever is LESS, and you need at least $10,000 of each just to hold a license. Thin working capital shrinks your ceiling even when net worth looks strong, so watch what you pull out of the company.",
        cite: "Ala. Admin. Code r. 230-X-1-.02 (Licensing Board for General Contractors)",
      },
      {
        id: "bl-al-004",
        domain: "ln",
        q: "An original (prime) contractor in Alabama must file its verified statement of mechanics lien within:",
        choices: [
          "30 days after last work",
          "4 months after last work",
          "6 months after the last item of work or material",
          "1 year after completion",
        ],
        answer: 2,
        explain:
          "Alabama staggers the clocks: the original contractor gets six months from the last item of work or materials furnished, every other claimant gets four months, and journeymen and day laborers only 30 days. Miss your window and the lien right is gone no matter how much you are owed.",
        cite: "Ala. Code 35-11-215",
      },
      {
        id: "bl-al-005",
        domain: "li",
        q: "Engaging in general contracting in Alabama without the required license is:",
        choices: [
          "A civil violation only, no criminal exposure",
          "A Class A misdemeanor",
          "A Class C misdemeanor",
          "A Class D felony",
        ],
        answer: 1,
        explain:
          "Unlicensed general contracting is a Class A misdemeanor, Alabama's most serious misdemeanor class, and each offense is punished as provided by law. On top of the criminal exposure, awarding authorities and permit offices are directed to check licenses, so working unlicensed can stop a project cold.",
        cite: "Ala. Code 34-8-6",
      },
      {
        id: "bl-al-006",
        domain: "lb",
        q: "Under Alabama's workers' compensation law, coverage is generally required once an employer regularly employs:",
        choices: [
          "1 or more employees",
          "3 or more employees",
          "5 or more employees",
          "10 or more employees",
        ],
        answer: 2,
        explain:
          "The general trigger is five employees, counting part-timers and corporate officers. But the exemption for smaller crews does not extend to the business of building new single-family detached homes, so residential builders can owe coverage regardless of headcount - a trap that catches small framing and homebuilding outfits.",
        cite: "Ala. Code 25-5-50; Alabama Department of Labor",
      },
      {
        id: "bl-al-007",
        domain: "fm",
        q: "On an Alabama public works contract, before the job reaches 50 percent completion, retainage withheld from the contractor may not exceed:",
        choices: [
          "10% of work performed",
          "5% of the estimated value of work performed and stored materials",
          "15% until substantial completion",
          "Retainage is prohibited on public work",
        ],
        answer: 1,
        explain:
          "Public awarding authorities hold at most 5 percent on the first half of the job, and once completed work and stored materials pass 50 percent no new retainage accrues - the state manual carries it as 2.5 percent of the total contract from there. Private commercial jobs run under Alabama's separate Prompt Pay Act rules in Title 8.",
        cite: "Ala. Code 39-2-12; Alabama DCM Manual of Procedures Ch. 7",
      },
      {
        id: "bl-al-008",
        domain: "li",
        q: "Alabama's Business and Law examination for general contractors (PSI) is:",
        choices: [
          "50 questions, 120 minutes, 70% to pass, open book",
          "100 questions, 240 minutes, 75% to pass, closed book",
          "50 questions, 120 minutes, 70% to pass, closed book",
          "80 questions, 180 minutes, 60% to pass, open book",
        ],
        answer: 0,
        explain:
          "Plan for 50 questions in 120 minutes with 70 percent to pass, open book with the NASCLA Contractors Guide to Business Law and Project Management, Alabama General 3rd edition. Highlight, underline and tab the book before test day - it cannot be written in at the site and no loose papers are allowed.",
        cite: "PSI Candidate Information Bulletin (State of Alabama contractors)",
      },
    ],
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
    questions: [
      {
        id: "bl-az-001",
        domain: "li",
        q: "Arizona's handyman exemption allows unlicensed work only when the aggregate contract price for the whole undertaking - labor, materials and all other items - is less than:",
        choices: [
          "$500",
          "$1,000",
          "$5,000",
          "$10,000",
        ],
        answer: 1,
        explain:
          "The line is $1,000 for the entire undertaking, counted across one or more contracts, so splitting a $3,000 job into three invoices does not work - and the exemption dies if the work needs a building permit or is part of a larger operation. The work also must be casual or minor, and any advertising has to disclose \"not a licensed contractor.\" Everything else requires an ROC license.",
        cite: "A.R.S. 32-1121(A)(14)",
      },
      {
        id: "bl-az-002",
        domain: "li",
        q: "A first conviction for acting as a contractor without a license in Arizona is:",
        choices: [
          "A petty offense with a $250 fine",
          "A class 1 misdemeanor with a fine of not less than $1,000",
          "A class 6 felony",
          "A civil violation with no criminal record",
        ],
        answer: 1,
        explain:
          "Unlicensed contracting is a class 1 misdemeanor - Arizona's most serious misdemeanor class - and the statute sets a floor, not a ceiling: the first-offense fine is at least $1,000. Repeat offenses escalate from there. The ROC actively runs stings, so this is not a theoretical risk.",
        cite: "A.R.S. 32-1164",
      },
      {
        id: "bl-az-003",
        domain: "ct",
        q: "To sue for payment on licensed-scope work in Arizona, a contractor must allege and prove it was duly licensed:",
        choices: [
          "Only on the day the lawsuit is filed",
          "Both when the contract was entered into and when the cause of action arose",
          "At any single point during the project",
          "Licensure is not a prerequisite to suit in Arizona",
        ],
        answer: 1,
        explain:
          "Arizona checks the license at two moments - contract signing and when the claim arose - and if you cannot prove both, the courthouse door is closed on your collection action. A lapse at either point can wipe out your right to get paid. Keep the license active for the whole life of every job.",
        cite: "A.R.S. 32-1153",
      },
      {
        id: "bl-az-004",
        domain: "ln",
        q: "Arizona's preliminary twenty day notice - the prerequisite to a valid mechanics lien - must be served no later than 20 days after:",
        choices: [
          "Signing the contract",
          "The claimant first furnishes labor or materials to the jobsite",
          "The lien is recorded",
          "Completion of the project",
        ],
        answer: 1,
        explain:
          "The clock starts when you first put labor, services or materials on the jobsite, and the notice goes to the owner, the original contractor, the construction lender and whoever hired you. Serve it late or not at all and the lien behind it fails. Make the 20-day notice part of your mobilization checklist on every private job.",
        cite: "A.R.S. 33-992.01(B), (C)",
      },
      {
        id: "bl-az-005",
        domain: "ln",
        q: "An Arizona mechanics lien must normally be recorded within 120 days after completion - but if a notice of completion is recorded, the deadline shrinks to:",
        choices: [
          "90 days after recordation of the notice",
          "75 days after recordation of the notice",
          "60 days after recordation of the notice",
          "30 days after recordation of the notice",
        ],
        answer: 2,
        explain:
          "The default is 120 days after completion of the improvement, but an owner who records a notice of completion cuts the window to 60 days from that recording. That is nearly half the time, so track county records on every open receivable. Completion has its own statutory definition, so do not assume it means the punch list.",
        cite: "A.R.S. 33-993(A)",
      },
      {
        id: "bl-az-006",
        domain: "ib",
        q: "Arizona's Residential Contractors' Recovery Fund will pay a wronged homeowner up to ___ per claim, with total payouts against any one contractor's license capped at ___.",
        choices: [
          "$20,000 / $100,000",
          "$30,000 / $200,000",
          "$50,000 / $250,000",
          "$15,000 / no aggregate cap",
        ],
        answer: 1,
        explain:
          "The fund - built from assessments on residential licensees - covers owner-occupants damaged by a licensed residential contractor, paying actual damages up to $30,000 per claimant per residence. Each license carries a $200,000 lifetime cap, and payouts the contractor does not repay lead to license suspension. It is Arizona's homeowner backstop in place of larger bonds.",
        cite: "A.R.S. 32-1132.01; A.R.S. 32-1139",
      },
      {
        id: "bl-az-007",
        domain: "lb",
        q: "An Arizona contractor hires its first regular employee. Workers' compensation coverage is:",
        choices: [
          "Not required until there are three or more employees",
          "Required - the law reaches every employer that regularly employs any workers",
          "Required only for jobs valued over $10,000",
          "Not required if the employee is a family member",
        ],
        answer: 1,
        explain:
          "Arizona's workers' comp law covers every employer with workers regularly employed in the business - there is no three-employee or five-employee floor. One regular hire, even part-time, puts you under the act. Sole proprietors themselves are not automatically covered, but their employees are from day one.",
        cite: "A.R.S. 23-902(A)",
      },
      {
        id: "bl-az-008",
        domain: "li",
        q: "Instead of a proctored business management exam, Arizona's ROC now requires a license qualifying party to complete:",
        choices: [
          "The NASCLA Business and Law exam at a PSI test center",
          "The online Arizona Statutes and Rules Education (SRE) training course and exam",
          "A 16-hour classroom course at a community college",
          "Nothing - Arizona dropped all business-knowledge requirements",
        ],
        answer: 1,
        explain:
          "Arizona swapped its old business management exam for the SRE - a computer-based training course and exam taken entirely online (through Gmetrix) that drills Arizona's own contracting statutes and ROC rules. It cannot be waived, even for NASCLA-accredited candidates, precisely because the content is Arizona-specific. Trade exams may still apply depending on the license classification.",
        cite: "Arizona ROC - SRE requirement; A.R.S. Title 32, Ch. 10",
      },
    ],
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
    questions: [
      {
        id: "bl-ar-001",
        domain: "li",
        q: "Arkansas requires a commercial contractor's license when the cost of the work, including labor and materials, is:",
        choices: [
          "$20,000 or more",
          "$35,000 or more",
          "$50,000 or more",
          "$100,000 or more",
        ],
        answer: 2,
        explain:
          "The commercial line is $50,000 including labor and materials, and the definition reaches anyone who even attempts or submits a bid at that level - you can violate the chapter before you ever swing a hammer. Price the whole job, not just your labor, when you check the threshold.",
        cite: "Ark. Code 17-25-101; ACLB Commercial Contractors Law",
      },
      {
        id: "bl-ar-002",
        domain: "li",
        q: "In Arkansas, a residential builder's license is required to build a single-family residence when the project cost is more than:",
        choices: [
          "$2,000",
          "$10,000",
          "$20,000",
          "$50,000",
        ],
        answer: 0,
        explain:
          "Home building trips the license requirement at just $2,000 including labor and material - one of the lowest lines in the country and a world away from the $50,000 commercial trigger. Almost any real residential job in Arkansas needs a licensed builder unless an exception applies.",
        cite: "Ark. Code 17-25-501 et seq.; Arkansas Contractors Licensing Board",
      },
      {
        id: "bl-ar-003",
        domain: "eb",
        q: "An Arkansas Restricted Commercial contractor's license limits the holder to commercial projects that are:",
        choices: [
          "less than $250,000",
          "less than $500,000",
          "less than $750,000",
          "any size once the bond is filed",
        ],
        answer: 2,
        explain:
          "The restricted ticket caps you at commercial projects under $750,000; only an unrestricted license lets you take jobs of any size. Which license you qualify for turns on your financial statement and experience, so line up the upgrade before you chase bigger bid work.",
        cite: "Arkansas Contractors Licensing Board - license classifications",
      },
      {
        id: "bl-ar-004",
        domain: "ib",
        q: "To keep a valid Arkansas commercial contractor's license, the contractor must have on file with the Board a surety bond of:",
        choices: [
          "$5,000",
          "$10,000",
          "$25,000",
          "$50,000",
        ],
        answer: 1,
        explain:
          "Every commercial contractor and registered subcontractor keeps a $10,000 surety bond on file with the Board - no bond on file, no valid license. It is a license bond protecting the public, separate from any bid or performance bond a particular project may demand.",
        cite: "Ark. Code 17-25-401 et seq. (Contractors' Bonds)",
      },
      {
        id: "bl-ar-005",
        domain: "ct",
        q: "A contractor who should have held an Arkansas license but worked without one sues the owner for the unpaid contract balance. What happens?",
        choices: [
          "The suit proceeds; licensing does not affect private contracts",
          "The court hears it but limits recovery to actual costs",
          "No action may be brought at law or in equity to enforce the contract",
          "The case is stayed until the contractor gets licensed",
        ],
        answer: 2,
        explain:
          "This is Arkansas's no-license-no-sue rule: courts will not enforce a contract entered into in violation of the licensing chapter, at law or in equity. Finish a $200,000 job unlicensed and the customer can simply refuse to pay the balance - and the courthouse door stays shut.",
        cite: "Ark. Code 17-25-103(d)",
      },
      {
        id: "bl-ar-006",
        domain: "li",
        q: "Criminally, unlicensed commercial contracting in Arkansas is:",
        choices: [
          "not a crime, only a civil matter",
          "a Class D felony",
          "a fine-only offense capped at $200 total",
          "a Class A misdemeanor, with each day a separate offense",
        ],
        answer: 3,
        explain:
          "Every day you work unlicensed is its own Class A misdemeanor, and the Board can stack a civil penalty of $100 to $400 per day on top of the criminal charge. A single month on an unlicensed job can turn into thirty counts plus a five-figure penalty.",
        cite: "Ark. Code 17-25-103(a), (e)",
      },
      {
        id: "bl-ar-007",
        domain: "lb",
        q: "On the Arkansas commercial contractor license application, proof of workers' compensation coverage is required if the applicant has:",
        choices: [
          "three or more employees",
          "five or more employees",
          "one or more employees",
          "ten or more employees",
        ],
        answer: 2,
        explain:
          "The Board wants proof of comp coverage the moment you have a single employee - do not confuse this licensing rule with the higher headcount thresholds you may have heard from other states. For a licensed Arkansas contractor the working answer is simple: got an employee, get coverage.",
        cite: "Arkansas Contractors Licensing Board - commercial license application",
      },
      {
        id: "bl-ar-008",
        domain: "li",
        q: "The Arkansas Business and Law examination for contractors is:",
        choices: [
          "50 questions, 120 minutes, 70% (35 correct) to pass, open book",
          "50 questions, 60 minutes, 75% to pass, closed book",
          "100 questions, 120 minutes, 70% to pass, open book",
          "25 questions, 60 minutes, 80% to pass, open book",
        ],
        answer: 0,
        explain:
          "PSI gives you 50 questions in a 2-hour window and 35 correct answers - 70 percent - passes. It is open book and tested only from the NASCLA Contractors Guide to Business, Law and Project Management, Arkansas Edition, so tab and highlight that book before exam day.",
        cite: "ACLB Business and Law Test instructions; PSI exam outline",
      },
    ],
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
    questions: [
      {
        id: "bl-ca-001",
        domain: "li",
        q: "As of January 1, 2025, California's minor work exemption lets an unlicensed person take a project only when the total price of labor and materials is less than:",
        choices: [
          "$500",
          "$750",
          "$1,000",
          "$2,500",
        ],
        answer: 2,
        explain:
          "AB 2622 doubled the old $500 exemption to $1,000 effective January 1, 2025. The exemption disappears the moment the job needs any permit or the person hires even one worker - then a license is required no matter how small the ticket.",
        cite: "B&P Code 7048 (as amended by AB 2622); CSLB",
      },
      {
        id: "bl-ca-002",
        domain: "ct",
        q: "On a California home improvement contract, the down payment a contractor may collect is capped at:",
        choices: [
          "10 percent of the contract price with no dollar cap",
          "$1,000 or 10 percent of the contract price, whichever is less",
          "$1,000 or 10 percent of the contract price, whichever is greater",
          "A flat $500",
        ],
        answer: 1,
        explain:
          "California caps the home improvement down payment at $1,000 or 10 percent, whichever is LESS - on a $6,000 job that means $600, not $1,000. The same cap applies to swimming pool contracts, excluding finance charges.",
        cite: "B&P Code 7159(d) (home improvement contracts)",
      },
      {
        id: "bl-ca-003",
        domain: "ln",
        q: "To keep full mechanics lien protection on a California private job, a subcontractor or supplier must give its preliminary notice within how many days of first furnishing labor or materials?",
        choices: [
          "20 days",
          "30 days",
          "60 days",
          "90 days",
        ],
        answer: 0,
        explain:
          "California's preliminary notice is a 20-day notice. Serving it late does not kill the lien outright, but the lien then only reaches work done 20 days before the notice was delivered and after - everything furnished earlier is unprotected.",
        cite: "Civil Code 8204 (preliminary notice)",
      },
      {
        id: "bl-ca-004",
        domain: "ln",
        q: "A California owner records a Notice of Completion. The direct (prime) contractor now has how long to record its mechanics lien?",
        choices: [
          "90 days",
          "60 days",
          "30 days",
          "10 days",
        ],
        answer: 1,
        explain:
          "Without a Notice of Completion, everyone gets 90 days after completion to record. A recorded Notice of Completion cuts the prime contractor to 60 days and cuts subcontractors and suppliers to 30 - the shortened clock that kills more liens than any other rule.",
        cite: "Civil Code 8412, 8414 (claim of lien deadlines)",
      },
      {
        id: "bl-ca-005",
        domain: "fm",
        q: "A California prime contractor receives a progress payment from the owner. Unless otherwise agreed in writing, subcontractors must be paid their share within:",
        choices: [
          "30 days",
          "21 days",
          "10 days",
          "7 days",
        ],
        answer: 3,
        explain:
          "Section 7108.5 gives you seven days after receipt of each progress payment to pass the money down the chain. Sit on it and the sub can collect a penalty of 2 percent of the amount due per month, plus it is cause for license discipline; in a good faith dispute you may hold back no more than 150 percent of the disputed amount.",
        cite: "B&P Code 7108.5 (prompt payment to subcontractors)",
      },
      {
        id: "bl-ca-006",
        domain: "li",
        q: "A first-offense conviction for contracting without a license in California is a misdemeanor punishable by:",
        choices: [
          "A $500 infraction ticket only",
          "Civil penalties only, with no jail exposure",
          "Up to 6 months in jail and/or a $5,000 fine",
          "A mandatory 1-year state prison term",
        ],
        answer: 2,
        explain:
          "First offense means up to six months in county jail and/or a $5,000 fine, plus an administrative fine of $200 to $15,000. Do it again and the second offense carries a mandatory 90-day jail sentence and a fine of 20 percent of the contract price or $5,000.",
        cite: "B&P Code 7028 (unlicensed contracting)",
      },
      {
        id: "bl-ca-007",
        domain: "ib",
        q: "Every California contractor must have on file with CSLB a contractor's license bond in the amount of:",
        choices: [
          "$10,000",
          "$15,000",
          "$25,000",
          "$50,000",
        ],
        answer: 2,
        explain:
          "SB 607 raised the contractor's bond from $15,000 to $25,000 effective January 1, 2023. When a bond of qualifying individual is required, that one is also $25,000 under B&P 7071.9 - price both into your overhead.",
        cite: "B&P Code 7071.6 (contractor's bond)",
      },
      {
        id: "bl-ca-008",
        domain: "li",
        q: "How much time does CSLB give you to complete the Law and Business examination?",
        choices: [
          "90 minutes",
          "3-1/2 hours",
          "2 hours",
          "5 hours",
        ],
        answer: 1,
        explain:
          "CSLB allows 3-1/2 hours for each examination, taken on computer as multiple choice with four choices per question. You leave with a printed pass/fail report - pass and they do not even show your score, fail and you get a section-by-section breakdown.",
        cite: "CSLB Examination FAQ; CSLB Law and Business Study Guide",
      },
    ],
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
    questions: [
      {
        id: "bl-fl-001",
        domain: "li",
        q: "A first-offense conviction for contracting without a license in Florida (outside a declared state of emergency) is punished as:",
        choices: [
          "A civil infraction with a fine only",
          "A misdemeanor of the first degree",
          "A felony of the third degree",
          "A felony of the second degree",
        ],
        answer: 1,
        explain:
          "First time you get caught contracting - or even advertising yourself as available to contract - without a license, it is a first-degree misdemeanor. Do it a second time, or do it during a governor-declared state of emergency, and it jumps to a third-degree felony.",
        cite: "F.S. 489.127(2) (Florida Statutes)",
      },
      {
        id: "bl-fl-002",
        domain: "ct",
        q: "Under F.S. 489.128, a construction contract entered into by an unlicensed contractor is:",
        choices: [
          "Enforceable if the work passes inspection",
          "Enforceable only up to the cost of materials",
          "Unenforceable in law or in equity by the unlicensed contractor",
          "Voidable only at the owner's option",
        ],
        answer: 2,
        explain:
          "Florida flat-out bars the unlicensed contractor from enforcing the deal - no suit for the money, no lien, not in law and not in equity. The customer can still come after you, but you cannot use the courts to collect. Get the license before you sign.",
        cite: "F.S. 489.128(1) (Florida Statutes)",
      },
      {
        id: "bl-fl-003",
        domain: "ln",
        q: "A subcontractor or supplier with no direct contract with the owner preserves its lien rights under Florida's Construction Lien Law by serving the Notice to Owner:",
        choices: [
          "Before starting work or within 45 days after first furnishing labor or materials",
          "Within 15 days after the first delivery",
          "Within 90 days after final furnishing",
          "Only before the owner makes any payment",
        ],
        answer: 0,
        explain:
          "The Notice to Owner is your ticket into lien rights when you are not in privity with the owner - serve it before you start or no later than 45 days after you first furnish labor, services, or materials. Miss the window and the lien is dead no matter how good the work was. Laborers are the one group excused from the notice.",
        cite: "F.S. 713.06(2)(a) (Construction Lien Law)",
      },
      {
        id: "bl-fl-004",
        domain: "ln",
        q: "Under Florida's Construction Lien Law, a claim of lien must be recorded no later than:",
        choices: [
          "45 days after final furnishing",
          "60 days after final furnishing",
          "90 days after final furnishing of labor, services, or materials",
          "120 days after substantial completion",
        ],
        answer: 2,
        explain:
          "The clock is 90 days from your final furnishing of labor, services, or materials - not from when the invoice went out or came due. Warranty calls and punch-list touch-ups generally do not restart it. Record late and the lien is gone.",
        cite: "F.S. 713.08(5) (Construction Lien Law)",
      },
      {
        id: "bl-fl-005",
        domain: "ln",
        q: "A recorded Florida claim of lien expires unless an action to enforce it is commenced within:",
        choices: [
          "1 year after the claim of lien is recorded",
          "90 days after the claim of lien is recorded",
          "180 days after final furnishing",
          "5 years after the claim of lien is recorded",
        ],
        answer: 0,
        explain:
          "Recording the lien is only half the job - the lien does not continue past 1 year after recording unless you file the foreclosure suit inside that year. An owner can shorten that fuse further by recording a Notice of Contest of Lien, so do not sit on it.",
        cite: "F.S. 713.22(1) (Construction Lien Law)",
      },
      {
        id: "bl-fl-006",
        domain: "pj",
        q: "Before the first inspection, a Florida permit applicant must file a copy of the recorded Notice of Commencement with the permitting authority whenever the direct contract is greater than:",
        choices: [
          "$2,500",
          "$5,000",
          "$7,500",
          "$15,000",
        ],
        answer: 1,
        explain:
          "The permit office holds up your first inspection until the Notice of Commencement paperwork is on file any time the direct contract runs over $5,000. One carve-out: repairing or replacing an existing heating or air-conditioning system is excused below $15,000. Get the NOC recorded before work starts, not after.",
        cite: "F.S. 713.135(1)(d) (Construction Lien Law)",
      },
      {
        id: "bl-fl-007",
        domain: "lb",
        q: "In Florida's construction industry, an employer is required to carry workers' compensation coverage when it employs:",
        choices: [
          "Four or more employees",
          "Ten or more employees",
          "Two or more employees",
          "One or more employees",
        ],
        answer: 3,
        explain:
          "Construction is the exception to Florida's usual four-employee rule - in this industry a single employee on the payroll triggers mandatory workers' comp coverage. Eligible corporate officers can apply for exemptions, but the default trigger is one hire.",
        cite: "F.S. 440.02(20)(b)2 (Workers' Compensation Law)",
      },
      {
        id: "bl-fl-008",
        domain: "fm",
        q: "A Florida contractor who takes an initial payment of more than 10% of the contract price must apply for the necessary permits within:",
        choices: [
          "10 days after the payment is made",
          "30 days after the payment is made",
          "60 days after the contract is signed",
          "90 days after the payment is made",
        ],
        answer: 1,
        explain:
          "Take more than 10% of the contract price up front and Florida starts a clock on you: apply for the needed permits within 30 days after the payment, then start the work within 90 days after all permits issue. The only outs are just cause or the customer agreeing in writing to a longer wait.",
        cite: "F.S. 489.126(2)(a) (Florida Statutes)",
      },
    ],
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
    questions: [
      {
        id: "bl-la-001",
        domain: "li",
        q: "Under Louisiana's contractor licensing law, a commercial contractor's license is required when the project value (labor and materials included) is:",
        choices: [
          "$10,000 or more",
          "$50,000 or more",
          "$75,000 or more",
          "$100,000 or more",
        ],
        answer: 1,
        explain:
          "Louisiana draws the commercial line at $50,000 - hit that project value, counting labor and materials, and you need an LSLBC license before you bid or build. Splitting one job into smaller tickets to duck the threshold does not fool the board.",
        cite: "La. R.S. 37:2150.1(4)(a) (contractor definition)",
      },
      {
        id: "bl-la-002",
        domain: "li",
        q: "Under current Louisiana law, a residential contractor's license is required for constructing or superintending construction of a residential structure when the project value is:",
        choices: [
          "$75,000 or more",
          "$100,000 or more",
          "$50,000 or more",
          "$25,000 or more",
        ],
        answer: 2,
        explain:
          "The residential trigger is now $50,000 - the old $75,000 threshold is gone from the statute, so do not run on habit. Build or superintend a house job at $50,000 or more and you need the residential license, not just a home improvement credential.",
        cite: "La. R.S. 37:2150.1(19)(a) (residential contractor definition)",
      },
      {
        id: "bl-la-003",
        domain: "li",
        q: "Louisiana defines a \"home improvement contractor\" as one taking on residential improvement projects valued at:",
        choices: [
          "At least $7,500 but less than $50,000",
          "At least $7,500 but not more than $75,000",
          "At least $1,500 but less than $7,500",
          "Any amount under $100,000",
        ],
        answer: 0,
        explain:
          "Home improvement work on an existing residence sits in its own lane: at least $7,500 but under $50,000. Below $7,500 the board does not require the credential, and at $50,000 or more you have graduated into residential contractor territory. The old $75,000 ceiling is no longer the law.",
        cite: "La. R.S. 37:2150.1(11) (home improvement contractor definition)",
      },
      {
        id: "bl-la-004",
        domain: "li",
        q: "If you bid or perform contracting work in Louisiana without the required license, the State Licensing Board for Contractors can fine you:",
        choices: [
          "A flat $500 per violation",
          "Up to 25% of the contract amount",
          "Up to 10% of the total contract or the value of the work bid",
          "A maximum of $10,000",
        ],
        answer: 2,
        explain:
          "After notice and a hearing, the board can hit a violator for up to 10% of the total contract or of the work bid or being performed - on a $300,000 job that is a $30,000 exposure. The board can also get a cease and desist or an injunction to shut the work down.",
        cite: "La. R.S. 37:2164(A) (violations; civil penalty)",
      },
      {
        id: "bl-la-005",
        domain: "ln",
        q: "On a Louisiana commercial job where no notice of contract was filed, a subcontractor must file its statement of claim or privilege under the Private Works Act no later than:",
        choices: [
          "30 days after the notice of termination is filed",
          "45 days after final furnishing",
          "60 days after the notice of termination is filed (or substantial completion or abandonment if none is filed)",
          "90 days after substantial completion",
        ],
        answer: 2,
        explain:
          "The default window is 60 days from the filed notice of termination - or from substantial completion or abandonment when no notice gets filed. If a notice of contract WAS properly filed, the window for subs tightens to 30 days, and on residential work a claimant who sent the owner a notice of nonpayment can stretch it to 70.",
        cite: "La. R.S. 9:4822(A) (Private Works Act)",
      },
      {
        id: "bl-la-006",
        domain: "ln",
        q: "After filing its statement of claim or privilege under Louisiana's Private Works Act, a claimant must file suit against the owner to enforce it within:",
        choices: [
          "90 days",
          "6 months",
          "3 years",
          "1 year",
        ],
        answer: 3,
        explain:
          "Filing the lien paperwork is only half the job - the claim and the privilege securing it are extinguished unless you institute an action against the owner within one year after filing your statement of claim or privilege. Settlement talks do not pause that clock.",
        cite: "La. R.S. 9:4823(A)(2) (Private Works Act)",
      },
      {
        id: "bl-la-007",
        domain: "fm",
        q: "Under Louisiana's rewritten prompt payment law, once a contractor receives payment from the owner, each subcontractor's share must be paid no later than:",
        choices: [
          "The 7th day after the contractor receives payment",
          "The 14th day after the contractor receives payment",
          "The 21st day after the contractor receives payment",
          "The 30th day after the contractor receives payment",
        ],
        answer: 0,
        explain:
          "The 2026 rewrite put money on a fast track: subs get their share no later than the 7th day after the contractor is paid - the old 14-day habit is history. Owners themselves owe the contractor within 35 days of a proper written request, and late amounts rack up a penalty of 1.5% per month.",
        cite: "La. R.S. 9:2784(B) (prompt payment, as rewritten 2026)",
      },
      {
        id: "bl-la-008",
        domain: "li",
        q: "Louisiana's Business and Law examination for contractor licensure is:",
        choices: [
          "120 questions taken in 6.5 hours at Pearson VUE",
          "A 50-question test taken online through the LSLBC Contractor Licensing Portal, passed with a score of 70 or above",
          "100 closed-book questions at a PSI testing center",
          "An oral interview at the board office in Baton Rouge",
        ],
        answer: 1,
        explain:
          "Louisiana splits its testing: Business and Law is the board's own 50-question exam taken from the LSLBC Contractor Licensing Portal, and 70 or better passes. It typically runs about 30 to 45 minutes. The trade exams are the ones you schedule separately through PSI.",
        cite: "LSLBC - What Happens After I Apply (official board website)",
      },
    ],
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
    questions: [
      {
        id: "bl-ms-001",
        domain: "li",
        q: "Mississippi requires a Certificate of Responsibility for commercial construction work, public or private, when the contract or undertaking exceeds:",
        choices: [
          "$10,000",
          "$25,000",
          "$50,000",
          "$100,000",
        ],
        answer: 2,
        explain:
          "The Board's reach starts above $50,000 on both public and private projects - the statute carves out work below that line (a few specialty trades like fire protection have lower triggers). Knowingly bidding without a required COR is itself punishable, so check the threshold before the bid goes out, not after.",
        cite: "Miss. Code 31-3-1, 31-3-14, 31-3-21",
      },
      {
        id: "bl-ms-002",
        domain: "ct",
        q: "A Mississippi contract awarded to a contractor who lacks the required Certificate of Responsibility is:",
        choices: [
          "Voidable at the owner's option",
          "Enforceable once the work is complete",
          "Null and void",
          "Valid but subject to a 10% penalty",
        ],
        answer: 2,
        explain:
          "The statute is blunt: a contract issued or awarded in violation of the certificate requirement is null and void, so there is nothing for the unlicensed contractor to enforce. Add the criminal side - up to a $1,000 fine and six months in jail for knowingly bidding without a COR - and unlicensed work in Mississippi is all downside.",
        cite: "Miss. Code 31-3-15, 31-3-21",
      },
      {
        id: "bl-ms-003",
        domain: "ln",
        q: "Under Mississippi's construction lien law, a claim of lien must be filed of record within:",
        choices: [
          "60 days after last work",
          "90 days after the claimant's last work, labor, services or materials",
          "6 months after completion",
          "1 year after the contract date",
        ],
        answer: 1,
        explain:
          "You get 90 days from your last work or materials to get the claim of lien on record, and no later than two business days after filing you must send a true and accurate copy to the owner. Blow either step and the lien fails - the clock runs from YOUR last work, not the project's end.",
        cite: "Miss. Code 85-7-405(1)",
      },
      {
        id: "bl-ms-004",
        domain: "ln",
        q: "After filing a Mississippi claim of lien, the claimant must commence its payment action within:",
        choices: [
          "90 days from filing",
          "120 days from last work",
          "180 days from the date of filing the claim of lien",
          "2 years from filing",
        ],
        answer: 2,
        explain:
          "The lien dies unless you start the payment action within 180 days of putting the claim on record - filing alone protects nothing long-term. And remember the door only opens for licensed contractors: Mississippi's lien article gives no lien at all to a contractor or sub who should be licensed and is not.",
        cite: "Miss. Code 85-7-405, 85-7-403(5)",
      },
      {
        id: "bl-ms-005",
        domain: "fm",
        q: "On most private commercial construction contracts in Mississippi, retainage withheld may not exceed:",
        choices: [
          "10% throughout the job",
          "5% of the estimated amount of work",
          "3% after 50% completion",
          "There is no cap on private work",
        ],
        answer: 1,
        explain:
          "Since July 1, 2024 Mississippi caps private-job retainage at 5 percent; withhold more and interest runs at 1 percent per month on the excess, and retainage must be released within 60 days after final completion. Residential homebuilding, projects of 16 or fewer residential units, and contracts of $10,000 or less are carved out.",
        cite: "Miss. Laws 2024, SB 2762 (private construction payments)",
      },
      {
        id: "bl-ms-006",
        domain: "li",
        q: "Mississippi licenses residential builders for new-home work over $50,000. A residential REMODELER's license is required when improvements to an existing residence exceed:",
        choices: [
          "$2,500",
          "$10,000",
          "$25,000",
          "$50,000",
        ],
        answer: 1,
        explain:
          "Remodeling has its own lower line - over $10,000 needs a remodeler's license, while ground-up homebuilding is licensed above $50,000. Cross either line unlicensed and you face a misdemeanor fine of up to $5,000, possible jail time, and a contract the courts will not enforce.",
        cite: "Miss. Code 73-59-1, 73-59-9",
      },
      {
        id: "bl-ms-007",
        domain: "lb",
        q: "Mississippi's workers' compensation law requires coverage from employers with:",
        choices: [
          "1 or more employees",
          "3 or more employees",
          "5 or more regularly employed workers",
          "coverage is always optional in Mississippi",
        ],
        answer: 2,
        explain:
          "Five regularly employed workers is the trigger, and smaller employers can still elect coverage voluntarily. Most GCs also demand comp certificates from every sub regardless of crew size, because an uninsured sub's injured worker is a problem nobody wants landing on the prime's doorstep.",
        cite: "Miss. Code 71-3-5; Mississippi Workers' Compensation Commission",
      },
      {
        id: "bl-ms-008",
        domain: "li",
        q: "Mississippi's Law and Business Management examination (PSI) is:",
        choices: [
          "75 questions, 3 hours, 75% to pass, closed book",
          "50 questions, 2 hours, 70% to pass, open book",
          "50 questions, 2 hours, 80% to pass, closed book",
          "60 questions, 90 minutes, 70% to pass, open book",
        ],
        answer: 1,
        explain:
          "Plan for 50 questions in two hours with 70 percent to pass, open book with the NASCLA Contractors Guide to Business, Law and Project Management - Mississippi edition. Only the 6th edition is referenced now, so study and tab the current book, not an old copy.",
        cite: "PSI Candidate Information Bulletin (Mississippi contractor examinations)",
      },
    ],
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
    questions: [
      {
        id: "bl-nv-001",
        domain: "li",
        q: "The monetary limit the Nevada State Contractors Board places on every license is:",
        choices: [
          "A cap on the contractor's annual gross revenue",
          "The maximum contract amount the licensee may undertake on one or more contracts on a single construction site for a single client",
          "The maximum bond the contractor must post",
          "A suggested guideline with no legal effect",
        ],
        answer: 1,
        explain:
          "Nevada stamps a dollar ceiling right on the license: the most you may undertake on one or more contracts on a single construction site or subdivision site for a single client. Bid past your limit and you are working outside the scope of your license - a real compliance problem, not a paperwork footnote.",
        cite: "NRS 624.220(2)",
      },
      {
        id: "bl-nv-002",
        domain: "li",
        q: "Nevada's handyman exemption allows unlicensed repair or maintenance work only when the value of the work, labor and materials included, is under:",
        choices: [
          "$500",
          "$750",
          "$1,000",
          "$2,500",
        ],
        answer: 2,
        explain:
          "NRS 624.031 draws the line at $1,000 including labor and materials. The exemption evaporates if the work needs a building permit or is plumbing, electrical, refrigeration, heating or air-conditioning type work - and it does not cover pieces of a larger project split up to evade licensing.",
        cite: "NRS 624.031(6)",
      },
      {
        id: "bl-nv-003",
        domain: "ib",
        q: "A homeowner harmed by a licensed Nevada residential contractor may claim against the Residential Recovery Fund for actual damages up to:",
        choices: [
          "$40,000 per claim",
          "$10,000 per claim",
          "$100,000 per claim",
          "Whatever a court awards, with no cap",
        ],
        answer: 0,
        explain:
          "A single Recovery Fund claim tops out at $40,000, and total claims against any one contractor are capped at $750,000 or 20 percent of the account balance, whichever is less. The fund protects owner-occupants of single-family residences who hired a licensed residential contractor - it is what those recovery fund assessments on your license pay for.",
        cite: "NRS 624.400-624.560 (Residential Recovery Fund)",
      },
      {
        id: "bl-nv-004",
        domain: "ln",
        q: "No notice of completion has been recorded on a Nevada project. A lien claimant must record its notice of lien within how many days after completion of the work of improvement?",
        choices: [
          "30 days",
          "60 days",
          "90 days",
          "6 months",
        ],
        answer: 2,
        explain:
          "NRS 108.226 runs 90 days from the latest triggering event, completion of the work of improvement chief among them. Miss the window and the lien right is gone - Nevada courts do not stretch it for you.",
        cite: "NRS 108.226",
      },
      {
        id: "bl-nv-005",
        domain: "ln",
        q: "A valid notice of completion is recorded and served on a Nevada job. Lien claimants now have how long to record their notices of lien?",
        choices: [
          "15 days",
          "40 days",
          "60 days",
          "The 90-day period is unchanged",
        ],
        answer: 1,
        explain:
          "A properly recorded and served notice of completion shrinks the lien window from 90 days to 40. Owners use it to start the clock early, so treat any notice of completion like a fire alarm on your lien rights.",
        cite: "NRS 108.226; NRS 108.228 (notice of completion)",
      },
      {
        id: "bl-nv-006",
        domain: "fm",
        q: "On a private Nevada construction job, the retention amount the owner withholds from a progress payment may not exceed:",
        choices: [
          "10 percent of the payment",
          "5 percent of the payment",
          "3.5 percent of the payment",
          "There is no statutory limit on private work",
        ],
        answer: 1,
        explain:
          "SB 254 (2015) cut Nevada retainage from 10 percent to 5 percent for contracts entered into on or after January 1, 2016 - private jobs under NRS 624.609 and public works under NRS 338.515 alike. The same 5 percent cap flows down the chain to lower-tiered contractors under NRS 624.624.",
        cite: "NRS 624.609(2) (as amended by SB 254, 2015)",
      },
      {
        id: "bl-nv-007",
        domain: "li",
        q: "Get caught contracting without a license in Nevada more than once and the charges climb. The progression under NRS 624.700 is:",
        choices: [
          "Misdemeanor every time, fines only",
          "Misdemeanor, then felony on the second offense",
          "Gross misdemeanor first, felony second",
          "Misdemeanor, then gross misdemeanor, then Class E felony",
        ],
        answer: 3,
        explain:
          "Nevada stair-steps it: first offense is a misdemeanor, second a gross misdemeanor, and the third offense a Class E felony. That criminal exposure sits on top of anything the Board does administratively - unlicensed work is not a business plan.",
        cite: "NRS 624.700",
      },
      {
        id: "bl-nv-008",
        domain: "li",
        q: "Nevada's business and law test, the Construction Management Survey (CMS), runs:",
        choices: [
          "60 scored questions in 120 minutes, 75 percent to pass",
          "115 questions in 210 minutes, pass/fail only",
          "100 questions in 240 minutes, 70 percent to pass",
          "50 questions in 60 minutes, 80 percent to pass",
        ],
        answer: 0,
        explain:
          "Per PSI's official candidate bulletin, the CMS is 60 scored items in 120 minutes with a minimum passing score of 45, which is 75 percent correct. Content areas include licensing, lien law, tax laws and labor laws - so drill the Nevada numbers before test day.",
        cite: "NSCB/PSI Candidate Information Bulletin (CMS examination)",
      },
    ],
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
    questions: [
      {
        id: "bl-nm-001",
        domain: "li",
        q: "New Mexico's \"casual, minor or inconsequential\" handyman exemption lets an unlicensed individual take on small jobs only while total compensation stays under what limit?",
        choices: [
          "$1,000 per project",
          "$7,200 compensation per year",
          "$10,000 per year",
          "There is no dollar limit if no permit is required",
        ],
        answer: 1,
        explain:
          "New Mexico draws the line at $7,200 compensation a year, working one undertaking at a time, and the work must truly be casual or minor - think handyman repairs. Advertise yourself as a contractor or fold the work into a bigger operation and the exemption vanishes, and an annual declaration must be filed with the division. Everything else in New Mexico requires a CID license, with no general per-job dollar floor.",
        cite: "NMSA 60-13-3(D)(14) (Construction Industries Licensing Act)",
      },
      {
        id: "bl-nm-002",
        domain: "ct",
        q: "An unlicensed New Mexico contractor finishes a remodel and the customer refuses to pay. Under the Construction Industries Licensing Act, the contractor may:",
        choices: [
          "Sue for the full contract price",
          "Sue, but only for the cost of materials",
          "Not maintain any court action to collect - he must allege and prove he was licensed",
          "Skip court and file a mechanics lien instead",
        ],
        answer: 2,
        explain:
          "NMSA 60-13-30 shuts the courthouse door: no action to collect compensation for work requiring a license unless you plead and prove you were duly licensed when the cause of action arose. Work unlicensed and you have no legal way to force payment. That is a bigger financial risk than any fine.",
        cite: "NMSA 60-13-30(A)",
      },
      {
        id: "bl-nm-003",
        domain: "ln",
        q: "Under New Mexico's mechanics lien statute, the original (prime) contractor must file its lien claim with the county clerk within:",
        choices: [
          "120 days after completion of the contract",
          "90 days after completion",
          "60 days after completion",
          "1 year after completion",
        ],
        answer: 0,
        explain:
          "The original contractor gets 120 days after completing the contract; everyone else - subs and suppliers - gets only 90 days. Know which clock you are on, because the shorter 90-day window is the one that catches most trades.",
        cite: "NMSA 48-2-6(A) (as amended 2023, HB 179)",
      },
      {
        id: "bl-nm-004",
        domain: "ln",
        q: "Since New Mexico's 2023 lien-law amendment, a claimant who files a mechanics lien must also get a copy of the filed claim to the property owner within:",
        choices: [
          "5 days of filing",
          "15 days of filing",
          "30 days of filing",
          "No copy is required - recording is enough",
        ],
        answer: 1,
        explain:
          "The 2023 amendment added a notice step: mail, email, certified mail or hand-deliver a copy of the filed lien to the owner within 15 days of filing with the county clerk. Blow it off and you can lose interest, attorney fees and costs on the lien. Recording alone no longer does the whole job.",
        cite: "NMSA 48-2-6(B) (2023, HB 179)",
      },
      {
        id: "bl-nm-005",
        domain: "fm",
        q: "How much retainage may be withheld from progress payments on a New Mexico construction project under the Prompt Payment Act?",
        choices: [
          "10% of each payment",
          "5% of each payment",
          "3.5% of each payment",
          "None - withholding retainage is prohibited",
        ],
        answer: 3,
        explain:
          "New Mexico banned retainage outright in 2007 - owners, contractors and subs \"shall not retain, withhold, hold back\" amounts owed for work performed. Undisputed pay requests also ride a clock: the owner pays within 21 days of an undisputed request, and money must flow down to subs and suppliers within 7 days of receipt. Contractors coming from 5% or 10% retainage states get this one wrong constantly.",
        cite: "NMSA 57-28-5 (Prompt Payment Act)",
      },
      {
        id: "bl-nm-006",
        domain: "lb",
        q: "A New Mexico roofing company has one part-time employee. Does it need workers' compensation coverage?",
        choices: [
          "No - coverage kicks in at three or more employees",
          "Yes - construction businesses licensed under CILA must carry coverage regardless of employee count",
          "No - part-time employees do not count toward coverage",
          "Only if the employee works more than 30 hours a week",
        ],
        answer: 1,
        explain:
          "New Mexico's general trigger is three or more workers, but the Workers' Compensation Act applies to every employer required to be licensed under the Construction Industries Licensing Act no matter how many people are on the payroll. One part-timer means you carry coverage. The three-employee rule is for everybody outside construction.",
        cite: "NMSA 52-1-6; NM Workers' Compensation Administration",
      },
      {
        id: "bl-nm-007",
        domain: "ib",
        q: "As a condition of initial licensure and every renewal, a New Mexico contractor must furnish the Construction Industries Division a bond in the amount of:",
        choices: [
          "$5,000",
          "$10,000",
          "$25,000",
          "No bond is required in New Mexico",
        ],
        answer: 1,
        explain:
          "The licensing rule requires a $10,000 bond from a corporate surety authorized to do business in New Mexico, filed at initial licensure and kept up at renewal. It is a license bond that backs your obligations under the licensing act - it is not insurance and does not replace liability coverage.",
        cite: "14.6.3.8(C)(1) NMAC",
      },
      {
        id: "bl-nm-008",
        domain: "li",
        q: "New Mexico's contractor Business and Law exam, administered by PSI, is:",
        choices: [
          "50 questions, 130 minutes, 75% to pass, open book",
          "80 questions, 180 minutes, 70% to pass, closed book",
          "60 questions, 120 minutes, 70% to pass, closed book",
          "There is no exam - it was replaced by an online course",
        ],
        answer: 0,
        explain:
          "PSI's New Mexico bulletin sets it at 50 questions in 130 minutes with 75% (38 correct) to pass, and it is open book using the NASCLA Contractors Guide to Business, Law and Project Management, Basic 14th Edition. Most classifications take a trade exam on top of Business and Law. The 75% bar is higher than the 70% many other states use.",
        cite: "PSI Candidate Information Bulletin - New Mexico; 14.6.3.8 NMAC",
      },
    ],
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
    questions: [
      {
        id: "bl-or-001",
        domain: "li",
        q: "Under ORS 701.021, who needs a CCB license in Oregon?",
        choices: [
          "Only contractors on jobs over $5,000",
          "Only residential contractors",
          "Any person who undertakes, offers to undertake, or submits a bid to do work as a contractor",
          "Only contractors whose work requires a building permit",
        ],
        answer: 2,
        explain:
          "Oregon licenses the act of contracting itself - even offering or bidding on work requires a current CCB license before you do it. There is no general dollar threshold like many states have; the only size carve-out is the narrow casual-work exemption for jobs under $1,000. Bid first, license later is itself a violation.",
        cite: "ORS 701.021(1)",
      },
      {
        id: "bl-or-002",
        domain: "li",
        q: "Oregon's only small-job exemption from CCB licensing applies when a person's aggregate contract price on one structure or project is less than:",
        choices: [
          "$500",
          "$1,000, and the work is casual, minor or inconsequential",
          "$2,500",
          "$5,000",
        ],
        answer: 1,
        explain:
          "All of that person's contracts on the one structure or project - labor, materials and all other items combined - must total under $1,000, and the work still has to be casual, minor or inconsequential in nature. Advertising yourself as a contractor kills the exemption. It is a true handyman-odd-jobs carve-out, not a way to run small jobs unlicensed.",
        cite: "ORS 701.010(4)",
      },
      {
        id: "bl-or-003",
        domain: "ct",
        q: "An Oregon contractor whose CCB license lapsed partway through a job wants to file a construction lien and sue for unpaid work. Under ORS 701.131 the contractor:",
        choices: [
          "May lien and sue as long as it was licensed when the contract was signed",
          "May not perfect a lien or commence a court or arbitration claim unless it was validly licensed for the work",
          "May sue in court but may not file a lien",
          "Only needs to be licensed on the day the lien is recorded",
        ],
        answer: 1,
        explain:
          "Oregon ties both the lien and the lawsuit to licensure - you generally must have been continuously licensed with the right endorsement while doing the work, not just on signing day. Courts can excuse a brief lapse only in narrow substantial-injustice situations. A lapsed license can turn a six-figure receivable into a donation.",
        cite: "ORS 701.131(1)",
      },
      {
        id: "bl-or-004",
        domain: "ln",
        q: "In Oregon, a claim of construction lien must be perfected (filed) no later than:",
        choices: [
          "75 days after the person ceased providing labor or materials, or 75 days after completion, whichever is earlier",
          "90 days after last furnishing labor or materials",
          "120 days after completion of construction",
          "180 days after substantial completion",
        ],
        answer: 0,
        explain:
          "Oregon runs one of the shorter lien clocks out there: 75 days from when you stopped working or from completion of construction, whichever comes first. Miss it and the lien right is gone no matter how good the debt is. Subs and suppliers also need their pre-lien notices in order to make the lien stick.",
        cite: "ORS 87.035",
      },
      {
        id: "bl-or-005",
        domain: "ln",
        q: "Once an Oregon construction lien is filed, a foreclosure suit must be brought within:",
        choices: [
          "60 days after filing",
          "75 days after filing",
          "120 days after the claim of lien is filed",
          "1 year after filing",
        ],
        answer: 2,
        explain:
          "A filed lien only binds the property for 120 days - file suit in that window or the lien dies on its own. Oregon also requires notices around foreclosure (like the notice of intent to foreclose), so calendar the whole sequence the day you record. Filing the lien is the start of collection, not the finish.",
        cite: "ORS 87.055",
      },
      {
        id: "bl-or-006",
        domain: "fm",
        q: "On an Oregon construction contract, retainage withheld from progress payments may not exceed:",
        choices: [
          "10% of the contract price",
          "5%",
          "3.5%",
          "There is no statutory limit on private jobs",
        ],
        answer: 1,
        explain:
          "Oregon caps retainage at 5% - half the 10% habit contractors bring from elsewhere - and the cap runs down the chain from owner to prime to subs. Since the 2019 amendment, on contracts over $500,000 the party withholding retainage must park it in an interest-bearing escrow account. Public contracts carry matching rules in ORS chapter 279C.",
        cite: "ORS 701.420 (as amended 2019, HB 2415)",
      },
      {
        id: "bl-or-007",
        domain: "ib",
        q: "To hold an Oregon residential general contractor endorsement, the CCB surety bond required is:",
        choices: [
          "$10,000",
          "$15,000",
          "$20,000",
          "$25,000",
        ],
        answer: 3,
        explain:
          "Residential general contractors post $25,000; residential specialty is $20,000 and residential limited is $15,000. Commercial work runs much heavier - a commercial general contractor level 1 posts $80,000. On top of the bond, a residential general must carry at least $500,000 in liability insurance.",
        cite: "ORS 701.081(1) (residential); ORS 701.084 (commercial)",
      },
      {
        id: "bl-or-008",
        domain: "li",
        q: "Oregon's CCB contractor licensing exam is:",
        choices: [
          "80 scored questions, 180 minutes, 70% to pass, open book",
          "50 questions, 130 minutes, 75% to pass",
          "100 questions, closed book, 80% to pass",
          "There is no exam - Oregon only requires a surety bond",
        ],
        answer: 0,
        explain:
          "The CCB test is 80 scored questions (plus a handful of unscored experimental items) in 180 minutes, and you need 70% to pass. It is open book using the NASCLA contractors guide Oregon edition, which is exactly why knowing where Oregon's numbers live matters more than memorizing the whole book.",
        cite: "Oregon CCB Examination Bulletin",
      },
    ],
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
    questions: [
      {
        id: "bl-ut-001",
        domain: "li",
        q: "Utah's handyman exemption currently lets an unlicensed person do alteration, repair or remodeling work on a building when the contracted value (labor and materials) is less than:",
        choices: [
          "$1,000",
          "$3,000",
          "$7,000",
          "$10,000",
        ],
        answer: 2,
        explain:
          "Utah raised the handyman line from $3,000 to $7,000 starting with the 2024 amendments, counting labor and materials together. The carve-out never covers licensed-trade work like plumbing, electrical or HVAC, and once a project tops $3,000 the handyman must file a one-time affirmation with the division confirming liability insurance and any required workers' comp. Old $1,000 or $3,000 numbers floating around study guides are out of date.",
        cite: "Utah Code 58-55-305(1)(h)",
      },
      {
        id: "bl-ut-002",
        domain: "li",
        q: "Contracting without a license in Utah exposes you to which penalties?",
        choices: [
          "A written warning for a first offense, fines only after that",
          "A class A misdemeanor, plus citation fines up to $1,000 for a first offense and $2,000 for a second",
          "An automatic third degree felony",
          "A civil fine capped at $500",
        ],
        answer: 1,
        explain:
          "Unlawful conduct under 58-55-501 - including contracting without a license - is a class A misdemeanor, and DOPL can also write citations running up to $1,000 first offense, $2,000 second, and $2,000 per day for a continuing offense. Keep at it and the numbers stack fast. Utah treats it as a real crime, not a paperwork slip.",
        cite: "Utah Code 58-55-503",
      },
      {
        id: "bl-ut-003",
        domain: "ct",
        q: "A Utah contractor was unlicensed when it signed the contract, then licensed up mid-job. When it sues the owner for the unpaid balance, the court will:",
        choices: [
          "Award the money since the work got done",
          "Award only the cost of materials",
          "Dismiss - the contractor must allege and prove it was licensed when the contract was entered and when the cause of action arose",
          "Refer the dispute to DOPL for arbitration",
        ],
        answer: 2,
        explain:
          "Utah's statute bars a contractor from maintaining any collection action without pleading and proving proper licensure at both key moments - contract signing and when the claim arose. Getting licensed later does not cure the day you signed. No license, no lawsuit, no leverage.",
        cite: "Utah Code 58-55-604",
      },
      {
        id: "bl-ut-004",
        domain: "ln",
        q: "To preserve Utah construction lien rights, a sub or supplier must file a preliminary notice with the State Construction Registry no later than:",
        choices: [
          "10 days after first delivering materials",
          "20 days after the person commences providing construction work",
          "45 days after signing the subcontract",
          "Utah does not require a preliminary notice",
        ],
        answer: 1,
        explain:
          "Utah runs its notices through the online State Construction Registry, and the preliminary notice is due within 20 days after you start your own work on the project. It is the ticket into the lien process - skip it and your lien rights on that project are in serious jeopardy. File it electronically the week you mobilize and forget about it.",
        cite: "Utah Code 38-1a-501(1)(a)",
      },
      {
        id: "bl-ut-005",
        domain: "ln",
        q: "If no notice of completion is filed, a Utah notice of construction lien must be filed within ___ after final completion of the original contract; a filed notice of completion shortens that to ___.",
        choices: [
          "90 days / 30 days",
          "180 days / 90 days",
          "120 days / 60 days",
          "1 year / 180 days",
        ],
        answer: 1,
        explain:
          "The default window is 180 days after final completion of the original contract. If someone files a notice of completion in the registry, you get only 90 days from that filing - and never more than the 180-day outer limit. Watch the registry, because the notice of completion is what cuts your clock in half.",
        cite: "Utah Code 38-1a-502(1)(a)",
      },
      {
        id: "bl-ut-006",
        domain: "fm",
        q: "On a Utah private construction contract, total retention proceeds withheld may not exceed:",
        choices: [
          "10% of the contract price",
          "5% of the total construction price",
          "3.5% of each progress payment",
          "There is no cap unless the contract sets one",
        ],
        answer: 1,
        explain:
          "Utah caps retention two ways: no more than 5% out of any single payment, and no more than 5% of the total construction price overall. The cap applies down the chain, so a prime cannot hold more from a sub than the statute allows. Contracts cannot lawfully demand more.",
        cite: "Utah Code 13-8-5(3)",
      },
      {
        id: "bl-ut-007",
        domain: "lb",
        q: "Which Utah employers must carry workers' compensation insurance?",
        choices: [
          "Only employers with three or more employees",
          "Only employers with five or more employees",
          "With few exceptions, every employer with employees - there is no minimum head count",
          "Only construction and other hazardous-industry employers",
        ],
        answer: 2,
        explain:
          "Utah's rule is simple: essentially every employer must secure workers' comp for all its employees, with only narrow exceptions - there is no three-employee or five-employee threshold to hide behind. For contractors that means coverage from your first hire. It is also a standing item DOPL expects licensed contractors to have squared away.",
        cite: "Utah Code 34A-2-201; Utah Labor Commission",
      },
      {
        id: "bl-ut-008",
        domain: "li",
        q: "Utah's contractor Business and Law exam, administered by Prov, is:",
        choices: [
          "60 questions, 2 hours, 70% to pass, open book",
          "50 questions, 130 minutes, 75% to pass, closed book",
          "100 questions, 4 hours, 75% to pass",
          "There is no Business and Law exam in Utah",
        ],
        answer: 0,
        explain:
          "Prov's Utah handbook puts it at 60 questions in 2 hours with 70% to pass, open book - candidates work from the Utah-specific references, including the NASCLA guide's Utah edition. Because it is open book, the exam rewards knowing exactly where Utah's thresholds and deadlines sit. It is required for the main contractor classifications, including B100-type general licenses.",
        cite: "Prov State of Utah Contracting Exam Handbook",
      },
    ],
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
    questions: [
      {
        id: "bl-va-001",
        domain: "li",
        q: "Under Va. Code 54.1-1100, a Class A contractor license is required when the total value of a single contract or project is:",
        choices: [
          "$1,000,000 or more",
          "$120,000 or more",
          "$150,000 or more",
          "There is no single-project dollar trigger for Class A",
        ],
        answer: 2,
        explain:
          "Cross $150,000 on one job and you need the Class A ticket - the class with no ceiling. The other trigger is volume: $1 million or more of work in any 12-month period also puts you in Class A territory.",
        cite: "Va. Code 54.1-1100 (Class A contractors)",
      },
      {
        id: "bl-va-002",
        domain: "li",
        q: "A Virginia remodeler signs a single contract for $100,000. The minimum license class required for that job is:",
        choices: [
          "Class A",
          "Class B",
          "Class C",
          "No license is required under $150,000",
        ],
        answer: 1,
        explain:
          "$100,000 falls in the Class B lane - single contracts of $30,000 up to but not including $150,000, or $250,000 to under $1 million of work across any 12 months. Hit $150,000 on one contract and you have jumped to Class A.",
        cite: "Va. Code 54.1-1100 (Class B contractors)",
      },
      {
        id: "bl-va-003",
        domain: "li",
        q: "In Virginia, a contractor license (at least Class C) is required once the value of a single project exceeds:",
        choices: [
          "$500",
          "$2,500",
          "$5,000",
          "$1,000",
        ],
        answer: 3,
        explain:
          "Virginia's license floor is $1,000 - Class C covers single jobs over $1,000 but under $30,000. Do not carry over the $5,000 habit from West Virginia; Virginia's trigger sits four thousand dollars lower.",
        cite: "Va. Code 54.1-1100 (Class C contractors)",
      },
      {
        id: "bl-va-004",
        domain: "li",
        q: "Contracting or bidding without the required Virginia contractor license is punishable as:",
        choices: [
          "A civil infraction with a flat $100 fine",
          "A Class 3 misdemeanor with no monetary penalty",
          "A Class 1 misdemeanor, plus a fine of up to $500 per day of violation",
          "A felony on the first offense",
        ],
        answer: 2,
        explain:
          "Unlicensed contracting is a Class 1 misdemeanor, and the fine can run up to $500 for every day you stay in violation. Worse for your wallet: an unlicensed contractor who knew a license was required generally cannot enforce the contract to collect payment.",
        cite: "Va. Code 54.1-1115 (prohibited acts)",
      },
      {
        id: "bl-va-005",
        domain: "ln",
        q: "Under Va. Code 43-4, a memorandum of mechanics lien must be recorded no later than:",
        choices: [
          "90 days from the last day of the month in which the claimant last performed work or furnished material, and never later than 90 days after completion",
          "6 months after the claimant's last day on the job",
          "100 days after completion of the contract",
          "90 days from the date the contract was signed",
        ],
        answer: 0,
        explain:
          "Two 90-day clocks run at once: 90 days from the last day of the month you last worked or supplied, and in no event later than 90 days after the project is completed or terminated. A separate 150-day rule bars the memorandum from including sums for work done more than 150 days before your last day of work.",
        cite: "Va. Code 43-4 (perfection of lien)",
      },
      {
        id: "bl-va-006",
        domain: "ln",
        q: "A perfected Virginia mechanics lien is lost unless suit to enforce it is brought within:",
        choices: [
          "30 days of recording the memorandum",
          "90 days of the claimant's last work",
          "6 months from recording the memorandum, or 60 days from completion of the building, whichever is later",
          "1 year from recording the memorandum",
        ],
        answer: 2,
        explain:
          "Recording only preserves the lien - you then get six months from recording, or 60 days from completion of the building, whichever lands later, to file suit. Miss that window and the lien is dead no matter how solid the debt is.",
        cite: "Va. Code 43-17 (limitation on suit)",
      },
      {
        id: "bl-va-007",
        domain: "ib",
        q: "The Virginia Contractor Transaction Recovery Fund will pay a claimant holding an unpaid judgment against a contractor no more than what amount for a single transaction?",
        choices: [
          "$20,000",
          "$30,000",
          "$50,000",
          "$100,000",
        ],
        answer: 1,
        explain:
          "The Fund pays a wronged consumer up to $30,000 on a single transaction with one contractor, and only on an unpaid court judgment for improper or dishonest conduct. Total claims against any one contractor are capped at $100,000 per biennium.",
        cite: "Va. Code 54.1-1123 (Recovery Fund)",
      },
      {
        id: "bl-va-008",
        domain: "fm",
        q: "On a Virginia public construction contract, after the general contractor receives a payment from the public body, it must pay each subcontractor its share - or send written notice of intent to withhold - within:",
        choices: [
          "7 days",
          "14 days",
          "30 days",
          "45 days",
        ],
        answer: 0,
        explain:
          "The prime has seven days from getting paid to either pass each sub its proportionate share or give written notice of what it is withholding and why. Sit on the money past that and interest runs at 1 percent per month, and the same obligation flows down the chain to lower-tier subs.",
        cite: "Va. Code 2.2-4354 (public construction payment clauses)",
      },
    ],
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
    questions: [
      {
        id: "bl-wv-001",
        domain: "li",
        q: "Under West Virginia's Contractor Licensing Act (W. Va. Code 30-42), a contractor license is required when the cost of the undertaking reaches:",
        choices: [
          "$1,000 for any work",
          "$2,500 for any work",
          "$5,000 for residential work or $25,000 for commercial work",
          "$10,000 for all work",
        ],
        answer: 2,
        explain:
          "The rewritten Act splits the trigger: $5,000 or more for residential work, $25,000 or more for commercial. And you need the license in hand before you even submit a bid, not just before you swing a hammer.",
        cite: "W. Va. Code 30-42-3 (contractor definition)",
      },
      {
        id: "bl-wv-002",
        domain: "li",
        q: "Under W. Va. Code 30-42-3, a \"general building contractor\" is one whose structures require the use of how many contractor classifications in their construction?",
        choices: [
          "More than two",
          "More than three",
          "Only one",
          "More than five",
        ],
        answer: 0,
        explain:
          "A general building contractor puts up structures for the support, shelter, and enclosure of people or property where the job takes more than two contractor classifications - or supervises the whole or part of the construction. West Virginia licenses by classification (general building, general engineering, electrical, plumbing, HVAC, multifamily, residential, specialty), not by dollar-tier letters like Virginia's A/B/C.",
        cite: "W. Va. Code 30-42-3 (general building contractor)",
      },
      {
        id: "bl-wv-003",
        domain: "li",
        q: "A West Virginia contractor keeps working after being served the board's cease and desist order for unlicensed contracting. A first offense conviction carries a fine of:",
        choices: [
          "$50 to $500",
          "$100 to $500",
          "$200 to $1,000",
          "$1,000 to $5,000",
        ],
        answer: 2,
        explain:
          "Once the board finds unlicensed contracting it must issue a cease and desist order, and continuing to work after service is a misdemeanor - $200 to $1,000 for a first offense. A second offense runs $500 to $5,000 with up to six months in jail, and on projects of $25,000 or more the board can stack an administrative penalty of up to $200 per day.",
        cite: "W. Va. Code 30-42-14 (violations; penalties)",
      },
      {
        id: "bl-wv-004",
        domain: "ln",
        q: "Under W. Va. Code 38-2-8, a general contractor preserves its mechanics lien by recording the notice of lien with the county clerk within:",
        choices: [
          "100 days after completion of the contract work",
          "90 days after the last day of the month of last work",
          "60 days after completion",
          "6 months after completion",
        ],
        answer: 0,
        explain:
          "The general contractor gets 100 days after completing the work under the contract to record the notice of lien. That is 10 days more than Virginia's 90-day rule - keep the two straight when you work both sides of the state line.",
        cite: "W. Va. Code 38-2-8 (perfecting lien)",
      },
      {
        id: "bl-wv-005",
        domain: "ln",
        q: "A West Virginia mechanics lien is discharged unless an action to enforce it is commenced in circuit court within:",
        choices: [
          "60 days of last work",
          "1 year of recording the notice",
          "2 years of project completion",
          "6 months after the notice of lien was filed",
        ],
        answer: 3,
        explain:
          "Filing the notice only preserves the lien - you must start the enforcement suit within six months of filing or the lien is discharged. The clock runs from the notice filing in the clerk's office, not from your last day on the job.",
        cite: "W. Va. Code 38-2-34 (limitation on suit)",
      },
      {
        id: "bl-wv-006",
        domain: "lb",
        q: "Under W. Va. Code 21-5-14, an employer newly engaging in construction work in West Virginia must post a wage bond equal to:",
        choices: [
          "Four weeks of gross payroll at full capacity plus 15 percent",
          "Two weeks of gross payroll plus 10 percent",
          "A flat $10,000",
          "No wage bond is required in West Virginia",
        ],
        answer: 0,
        explain:
          "New construction employers post a wage bond covering four weeks of gross payroll at full capacity plus 15 percent of that total, protecting workers' wages and fringe benefits if the company folds. Employers who have actively done construction business in the state for at least one year are exempt.",
        cite: "W. Va. Code 21-5-14 (wage bond)",
      },
      {
        id: "bl-wv-007",
        domain: "ib",
        q: "For West Virginia's workers compensation \"casual employer\" exemption to apply, the employer's workforce may not exceed:",
        choices: [
          "5 employees",
          "3 employees",
          "10 employees",
          "2 employees",
        ],
        answer: 1,
        explain:
          "The casual-employer exemption is a tight box: no more than three employees, and only temporary, intermittent, sporadic work totaling 10 or fewer calendar days in a quarter. A construction crew running regular jobs will not fit it - carry the coverage.",
        cite: "W. Va. Code 23-2-1 (employers subject to chapter)",
      },
      {
        id: "bl-wv-008",
        domain: "li",
        q: "The West Virginia Contractor Licensing Act examination, administered by Prov, consists of:",
        choices: [
          "50 questions in 2 hours",
          "80 questions in 2.5 hours",
          "90 questions in 3 hours, with 70 percent to pass",
          "100 questions in 4 hours",
        ],
        answer: 2,
        explain:
          "Every applicant sits the Contractor Licensing Act exam through Prov: 90 questions, 3 hours, scored against a 70 percent cut score. It tests West Virginia's own statutes and rules - the board's online course study guide or Prov's WV study guide covers the material, and the older WV Business and Law 6th Edition guide still contains the statutes tested.",
        cite: "Prov Candidate Information Bulletin (WV Contractor Licensing Board)",
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

// The states with statute question packs - as of v3, all of
// them. The bl practice page's pack section and the /bl-packs
// page both filter on this.
export const BL_PACKS_LIVE: BlStatePack[] = BL_STATE_PACKS.filter(
  (p) => p.questions.length > 0
);

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/blstates.ts (v3 - statute
// packs for ALL 16 B&L states, 128 questions, source-verified)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
