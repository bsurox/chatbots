// FILE: lib/foremanprep/blbank.ts

// ForemanPrep Business & Law question bank (v3 - core bank: 120
// questions, 10 domains x 12). v3 = the BOOK PASS: Chase scanned
// his physical NASCLA Contractors Guide 14th edition cover to
// cover (153 pages) and every question was read against it. ZERO
// answer keys conflicted. Eight explanations gained a sentence so
// students who study the guide feel at home: umbrella/excess
// framing (ib-008), bid-security percentage source (ib-010),
// revenue-based overhead variant (eb-008), the guide's mirror
// definition of bid shopping (eb-012), oral-change nuance
// (ct-005), the $100k next-day deposit clock (tx-011), and notes
// that the book still teaches pre-2020 1099-MISC (tx-006) and
// pre-2015 OSHA reporting (sf-007) where OUR content is current.
// No answers, choices, or ids changed.
// v2 notes: the Aug 2026 accuracy audit:
// every question was fact-checked against primary sources by
// research agents; 116 of 120 passed clean. Four fixes landed:
// bl-ib-011's Miller Act threshold corrected $100,000 -> $150,000
// (the 2010 inflation adjustment - FAR 28.102-1); bl-lb-009's
// "unlimited hours at 16" distractor replaced (it is literally
// true under the FLSA, an ambiguity defect); bl-ib-003 and
// bl-tx-003 explanations gained accuracy softeners (Texas comp is
// elective; AK/NJ/PA collect a small employee unemployment share).
// v1 notes: All original items teaching the
// state-neutral core that every state Business & Law exam draws
// from - the material of the NASCLA Contractors Guide to Business,
// Law and Project Management. State-specific layers (lien
// deadlines, license thresholds) ship as separate batches later;
// nothing here states a rule that varies by state as if it were
// universal.
// Self-contained ON PURPOSE: the BlQuestion type lives in THIS
// file so it typechecks alone the moment it lands. blquestions.ts
// arrives in the next commit and imports from here - never the
// other way around. That keeps every commit green.

export type BlDomainKey =
  | "li"
  | "eb"
  | "ct"
  | "pj"
  | "ib"
  | "lb"
  | "fm"
  | "tx"
  | "ln"
  | "sf";

export type BlQuestion = {
  id: string;
  domain: BlDomainKey;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  cite: string;
};

export const BL_BANK: BlQuestion[] = [
  // ---- Licensing & Business Organization (li) -------------------
  {
    id: "bl-li-001",
    domain: "li",
    q: "Under which business structure is the owner personally responsible for all debts and obligations of the business?",
    choices: [
      "Sole proprietorship",
      "Limited liability company (LLC)",
      "S corporation",
      "C corporation",
    ],
    answer: 0,
    explain:
      "A sole proprietorship is legally inseparable from its owner: business debts are the owner's personal debts, and personal assets are exposed. LLCs and corporations exist as separate legal entities, which is what creates the liability shield.",
    cite: "NASCLA Guide - Choosing a Business Structure",
  },
  {
    id: "bl-li-002",
    domain: "li",
    q: "In a general partnership, each general partner is:",
    choices: [
      "Personally liable for partnership obligations, including those created by the other partners",
      "Shielded from liability if the partnership is registered with the state",
      "Taxed at the corporate rate on partnership income",
      "Liable only up to the amount invested in the partnership",
    ],
    answer: 0,
    explain:
      "General partners share management and share unlimited personal liability - one partner can bind the partnership, and every general partner is on the hook for the result. Limited liability requires a different structure (LP, LLC, or corporation).",
    cite: "NASCLA Guide - Choosing a Business Structure",
  },
  {
    id: "bl-li-003",
    domain: "li",
    q: "The primary purpose of state contractor licensing laws is to:",
    choices: [
      "Protect the public from unqualified or dishonest contractors",
      "Guarantee contractors a minimum profit margin",
      "Limit the number of contractors competing in the state",
      "Generate fee revenue for the licensing board",
    ],
    answer: 0,
    explain:
      "Licensing is consumer protection: boards verify competence and financial responsibility, and give the public a complaint process. Revenue and competition effects are side effects, not the purpose - exams routinely test this framing.",
    cite: "NASCLA Guide - Contractor Licensing",
  },
  {
    id: "bl-li-004",
    domain: "li",
    q: "Which business structure combines a corporate-style liability shield with pass-through taxation by default?",
    choices: [
      "Limited liability company (LLC)",
      "Sole proprietorship",
      "General partnership",
      "C corporation",
    ],
    answer: 0,
    explain:
      "An LLC protects members' personal assets like a corporation, but by default its profits pass through to the members' personal returns with no entity-level income tax. A C corporation shields owners but is taxed at the entity level.",
    cite: "NASCLA Guide - Choosing a Business Structure",
  },
  {
    id: "bl-li-005",
    domain: "li",
    q: "The tax feature that most distinguishes a C corporation from other business structures is:",
    choices: [
      "Its income is exempt from federal tax",
      "Profits can be taxed twice - once to the corporation and again when paid to owners as dividends",
      "Owners pay self-employment tax on all corporate profits",
      "It cannot deduct employee wages",
    ],
    answer: 1,
    explain:
      "A C corporation pays tax on its profits, and shareholders pay tax again on dividends - the classic double taxation. Pass-through structures (sole proprietorship, partnership, S corporation, default LLC) are taxed once at the owner level.",
    cite: "NASCLA Guide - Choosing a Business Structure",
  },
  {
    id: "bl-li-006",
    domain: "li",
    q: "Which statement about an S corporation is TRUE?",
    choices: [
      "Its profits are taxed at the corporate level and again as dividends",
      "It passes profits through to shareholders but is limited in the number and type of shareholders it may have",
      "It is a structure available only to publicly traded companies",
      "It may have an unlimited number of shareholders",
    ],
    answer: 1,
    explain:
      "The S election gives pass-through taxation while keeping the corporate form, but with strings attached: a capped number of shareholders, eligibility limits on who can hold shares, and one class of stock. Exceed the limits and the election is lost.",
    cite: "NASCLA Guide - Choosing a Business Structure",
  },
  {
    id: "bl-li-007",
    domain: "li",
    q: "In contractor licensing, the \"qualifying party\" (or qualifying agent) is best described as:",
    choices: [
      "Any officer listed on the corporate charter",
      "The surety company that writes the license bond",
      "The company's registered agent for lawsuits",
      "The individual whose exam credential and experience satisfy the board's requirements on behalf of the licensed business",
    ],
    answer: 3,
    explain:
      "Boards license businesses through a qualified individual: the qualifying party passes the exam and proves experience, and the company's license rides on that person. If the qualifier leaves, most boards require a replacement within a set window.",
    cite: "NASCLA Guide - Contractor Licensing",
  },
  {
    id: "bl-li-008",
    domain: "li",
    q: "Registering a trade name (DBA, \"doing business as\") allows a business to:",
    choices: [
      "Pay taxes at a lower rate",
      "Operate under a name different from its legal name - without creating a new legal entity",
      "Shield its owner from personal liability",
      "Avoid state licensing requirements",
    ],
    answer: 1,
    explain:
      "A DBA is only a name registration: Smith Construction LLC can build as \"Summit Builders\". It changes nothing about liability, taxes, or licensing - the entity behind the name is what matters for all three.",
    cite: "NASCLA Guide - Business Start-Up",
  },
  {
    id: "bl-li-009",
    domain: "li",
    q: "The registered agent of a corporation or LLC is the person or company designated to:",
    choices: [
      "Approve all contracts over a set dollar amount",
      "Receive service of process and official state correspondence for the business",
      "Prepare and sign the company's tax returns",
      "Supervise field operations as the license qualifier",
    ],
    answer: 1,
    explain:
      "Every registered entity must name a registered agent with an in-state address so lawsuits and state notices have a reliable place to land. Missing service because the agent lapsed can mean default judgments and administrative dissolution.",
    cite: "NASCLA Guide - Business Start-Up",
  },
  {
    id: "bl-li-010",
    domain: "li",
    q: "An Employer Identification Number (EIN) is issued by:",
    choices: [
      "The IRS, as the business's federal tax identification number",
      "The Social Security Administration, as a replacement for the owner's SSN",
      "The Department of Labor, to authorize hiring",
      "The state contractor licensing board, to track license status",
    ],
    answer: 0,
    explain:
      "The EIN is the IRS's taxpayer ID for the business - required once you hire employees or operate as a partnership or corporation, and used on payroll filings, returns, and most business accounts. It is free directly from the IRS.",
    cite: "IRS - Employer ID Numbers; NASCLA Guide - Business Start-Up",
  },
  {
    id: "bl-li-011",
    domain: "li",
    q: "The primary purpose of a written business plan is to:",
    choices: [
      "Replace the need for accounting records",
      "Set the maximum number of employees the company may hire",
      "Satisfy a filing requirement of the licensing board",
      "Map how the company will operate, market, and stay financially viable - and support requests for financing",
    ],
    answer: 3,
    explain:
      "A business plan forces the owner to think through market, pricing, cash needs, and operations before money is at risk, and it is the document lenders and investors expect to see. No licensing board requires one as a filing; good ones still require the thinking.",
    cite: "NASCLA Guide - Business Planning",
  },
  {
    id: "bl-li-012",
    domain: "li",
    q: "In most licensing states, a contractor who performs work that requires a license while unlicensed risks:",
    choices: [
      "Automatic transfer of the job to a licensed competitor",
      "Nothing, as long as the work passes inspection",
      "Penalties, and often losing the right to use the courts to collect payment for that work",
      "Only a requirement to take the exam within one year",
    ],
    answer: 2,
    explain:
      "License laws grow teeth through the courthouse door: many states bar unlicensed contractors from suing to collect for work that required a license, on top of fines and possible criminal penalties. The exact consequences vary by state - the risk does not.",
    cite: "NASCLA Guide - Contractor Licensing",
  },

  // ---- Estimating & Bidding (eb) --------------------------------
  {
    id: "bl-eb-001",
    domain: "eb",
    q: "Which of the following is a DIRECT cost of a construction project?",
    choices: [
      "Wages of the framing crew working on the job",
      "Rent on the company's main office",
      "The bookkeeper's salary",
      "The company's website hosting fee",
    ],
    answer: 0,
    explain:
      "Direct costs can be traced to one specific job - its labor, materials, equipment, and subcontractors. Office rent, office staff, and marketing serve every job at once, which makes them overhead (indirect costs) that estimates must recover through markup.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-002",
    domain: "eb",
    q: "Labor burden is best described as:",
    choices: [
      "The employer's added costs on top of wages - payroll taxes, workers' compensation, and benefits",
      "The cost of hiring subcontractors instead of employees",
      "Overtime premium pay only",
      "The base hourly wages paid to field workers",
    ],
    answer: 0,
    explain:
      "Every hour of wages drags employer costs behind it: the employer's share of payroll taxes, workers' comp premiums, unemployment taxes, and any benefits. Estimating with bare wage rates and no burden understates labor cost on every line.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-003",
    domain: "eb",
    q: "A carpenter's base wage is $20.00 per hour and the company's labor burden runs 35% of wages. What hourly labor cost should the estimate carry?",
    choices: ["$20.35", "$25.50", "$27.00", "$31.00"],
    answer: 2,
    explain:
      "Burden is applied on top of the wage: $20.00 x 1.35 = $27.00 per hour. The $7.00 difference is the employer's taxes, workers' comp, and benefits - real cash the job must recover even though the worker never sees it in a paycheck.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-004",
    domain: "eb",
    q: "A job's estimated cost is $80,000 and the contractor prices it using a 25% markup on cost. What is the bid price?",
    choices: ["$85,000", "$100,000", "$106,667", "$110,000"],
    answer: 1,
    explain:
      "Markup is applied to cost: $80,000 x 1.25 = $100,000. Note what that price yields as margin: the $20,000 gross profit is 20% of the $100,000 price - a 25% markup produces a 20% margin, never a 25% margin.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-005",
    domain: "eb",
    q: "A 25% markup on cost equals what gross margin on the selling price?",
    choices: ["25%", "20%", "12.5%", "30%"],
    answer: 1,
    explain:
      "Margin = markup / (1 + markup): 0.25 / 1.25 = 20%. Confusing the two is one of the most expensive habits in contracting - a contractor who wants a 25% margin must mark cost up by 33%, not 25%.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-006",
    domain: "eb",
    q: "A single straight wall runs 160 feet and studs are spaced 16 inches on center. How many studs does a basic takeoff call for (one stud per layout mark, counting both ends)?",
    choices: ["120", "121", "160", "241"],
    answer: 1,
    explain:
      "Spaces first, then add the closing stud: (160 ft x 12) / 16 in = 120 spaces, so 120 + 1 = 121 studs. Real walls add studs for corners and openings - but the spacing math itself is spaces plus one, an exam favorite.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-007",
    domain: "eb",
    q: "A crew places 250 square feet of tile per day. How many crew-days should the estimate carry for 5,000 square feet?",
    choices: ["15", "18", "20", "25"],
    answer: 2,
    explain:
      "Quantity divided by production rate: 5,000 / 250 = 20 crew-days. Productivity rates - from the company's own job-cost history whenever possible - are what turn a quantity takeoff into labor hours and dollars.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-008",
    domain: "eb",
    q: "A company expects $150,000 of annual overhead and $1,000,000 of annual direct job costs. Using a direct-cost allocation, what overhead percentage should each estimate carry?",
    choices: ["10%", "15%", "20%", "25%"],
    answer: 1,
    explain:
      "Overhead recovery rate = overhead / direct cost base: 150,000 / 1,000,000 = 15%. Each job then carries its share - a $100,000-cost job absorbs $15,000 of overhead before profit is added. Jobs priced without overhead recovery are quietly sold at a loss. Some contractors recover overhead as a percentage of total revenue instead of direct costs - the arithmetic differs, but every estimate must carry its share either way.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-009",
    domain: "eb",
    q: "The contingency amount in an estimate exists to cover:",
    choices: [
      "The cost of performance and payment bonds",
      "Charitable donations made in the company's name",
      "The contractor's planned profit",
      "Unforeseen conditions and estimating uncertainty",
    ],
    answer: 3,
    explain:
      "Contingency is a priced allowance for what you cannot see yet - weather, minor surprises, quantity variances. It is not profit, and folding it into profit hides the risk it was meant to absorb. Bonds are priced as their own line.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-010",
    domain: "eb",
    q: "A unit-price contract is the best fit when:",
    choices: [
      "The contractor wants to be reimbursed for actual costs plus a fee",
      "The full scope is precisely known before bidding",
      "Final quantities are uncertain, such as excavation - the owner pays measured quantities at bid unit rates",
      "The owner wants a single guaranteed number",
    ],
    answer: 2,
    explain:
      "Unit pricing prices the RATE and leaves the QUANTITY open: each measured unit is paid at the bid rate. That fairly handles work like earthwork where nobody knows the final count. Lump sum fits known scope; cost-plus fits undefined scope.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-eb-011",
    domain: "eb",
    q: "Before using a subcontractor's low quote in a bid, the estimator's most important check is:",
    choices: [
      "Whether the sub's letterhead looks professional",
      "That the quote's scope, inclusions, and exclusions actually cover the work assumed for that trade",
      "Whether the sub is the largest company that quoted",
      "That the quote was received last",
    ],
    answer: 1,
    explain:
      "A low number with a hole in its scope is not low - the gap comes back as change orders or comes out of the contractor's pocket. Scope-check every quote against the plans and specs before it enters the bid.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },
  {
    id: "bl-eb-012",
    domain: "eb",
    q: "\"Bid shopping\" refers to:",
    choices: [
      "Disclosing one subcontractor's price to other subs to pressure them to beat it",
      "Submitting bids on more than one project in the same week",
      "Reviewing plans at a plan room before bidding",
      "Comparing material prices at several suppliers",
    ],
    answer: 0,
    explain:
      "Bid shopping trades on a sub's confidential number to squeeze the market, before or after award. It is widely considered unethical, poisons sub relationships, and some public work and industry codes prohibit it outright. The guide defines the same practice from the other side: approaching subs OTHER than those who bid, hunting a number lower than the original quotes.",
    cite: "NASCLA Guide - Estimating and Bidding",
  },

  // ---- Contracts (ct) -------------------------------------------
  {
    id: "bl-ct-001",
    domain: "ct",
    q: "Which of the following is NOT required for a contract to be enforceable?",
    choices: [
      "Parties with legal capacity and a lawful purpose",
      "Notarization of the signatures",
      "An offer and its acceptance",
      "Consideration - something of value exchanged by each side",
    ],
    answer: 1,
    explain:
      "The classic elements are offer, acceptance, consideration, capacity, and legality. Notarization is almost never an element of contract formation - though certain agreements, like those involving interests in real property, generally must at least be in writing.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-002",
    domain: "ct",
    q: "Under a lump-sum (fixed-price) contract, the risk of cost overruns falls primarily on:",
    choices: [
      "The architect",
      "The owner",
      "The contractor",
      "The lender",
    ],
    answer: 2,
    explain:
      "The price is fixed no matter what the work actually costs, so estimating misses, productivity problems, and price increases eat the contractor's margin. That risk is why lump-sum work demands a complete scope and a careful estimate.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-003",
    domain: "ct",
    q: "Which contract type reimburses the contractor's costs plus a fee, but caps the owner's total exposure?",
    choices: [
      "Lump sum",
      "Time and materials with no cap",
      "Cost-plus with a guaranteed maximum price (GMP)",
      "Unit price",
    ],
    answer: 2,
    explain:
      "A GMP is cost-plus with a ceiling: the owner pays actual cost plus fee up to the guaranteed maximum, and the contractor absorbs overruns beyond it. Savings below the cap are kept or shared per the contract's terms.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-004",
    domain: "ct",
    q: "A time-and-materials (T&M) contract is typically used when:",
    choices: [
      "The owner demands a single guaranteed price",
      "Quantities are known but unit costs are not",
      "The contractor refuses to track labor hours",
      "The scope of work cannot be well defined in advance - and the cost risk sits mostly with the owner",
    ],
    answer: 3,
    explain:
      "T&M bills agreed labor rates plus materials as the work unfolds, which fits emergencies and undefined scopes. Because there is no fixed price, the owner carries most of the cost risk - many owners add a not-to-exceed limit for that reason.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-005",
    domain: "ct",
    q: "The safest practice for handling a change in the work is to:",
    choices: [
      "Rely on the superintendent's verbal approval",
      "Bill the change as a separate invoice without documentation",
      "Perform the change immediately and negotiate the price after the job closes out",
      "Get a written, signed change order covering scope, price, and time BEFORE performing the changed work",
    ],
    answer: 3,
    explain:
      "A signed change order amends the contract itself - scope, dollars, and schedule - before the money is spent. Verbal changes are where contractors go to lose money: proof problems, disputed scope, and waived rights. Oral change agreements can sometimes bind the parties anyway - which is exactly why disputes over them get ugly; the writing is protection, not formality.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-006",
    domain: "ct",
    q: "A liquidated damages clause is generally enforceable when the amount is:",
    choices: [
      "Equal to the contractor's full profit on the job",
      "Large enough to punish the contractor for delay",
      "A reasonable advance estimate of the owner's actual damages from delay, set when the contract is signed",
      "Whatever the owner decides after the delay occurs",
    ],
    answer: 2,
    explain:
      "Courts enforce liquidated damages as a genuine pre-estimate of hard-to-measure delay losses - so much per day, agreed up front. If the number is really a penalty designed to punish, it risks being struck down.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-007",
    domain: "ct",
    q: "An indemnification (hold-harmless) clause in a construction contract:",
    choices: [
      "Transfers specified risks by obligating one party to cover certain losses or claims of the other",
      "Guarantees the project will be completed on time",
      "Sets the interest rate on late payments",
      "Waives all claims between the parties",
    ],
    answer: 0,
    explain:
      "Indemnity shifts risk by agreement: the indemnitor promises to bear defined losses - commonly claims arising from its own work or negligence - that would otherwise land on the indemnitee. Read them closely; insurance must line up with what was promised.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-008",
    domain: "ct",
    q: "A flow-down clause in a subcontract means:",
    choices: [
      "The subcontractor is bound to the prime contractor by the same obligations the prime owes the owner, for the sub's scope",
      "Site drainage is the subcontractor's responsibility",
      "The subcontract price adjusts automatically with material prices",
      "Payments flow from the owner directly to each subcontractor",
    ],
    answer: 0,
    explain:
      "Flow-down incorporates the prime contract's duties into the subcontract, so the sub's scope carries the same specs, schedule, and administrative rules the prime answers for upstream. Subs should read the prime contract they are inheriting.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-009",
    domain: "ct",
    q: "\"Substantial completion\" is generally the point at which:",
    choices: [
      "The building permit is issued",
      "Half of the contract sum has been billed",
      "Every punch-list item has been corrected",
      "The owner can occupy or use the project for its intended purpose",
    ],
    answer: 3,
    explain:
      "Substantial completion is a milestone with legal weight: the work is usable for its purpose even with minor items remaining, and it commonly starts warranty periods, shifts insurance duties, and triggers retainage or final-payment clocks per the contract.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-010",
    domain: "ct",
    q: "When an owner terminates a contract \"for convenience,\" the contractor is typically entitled to:",
    choices: [
      "Ownership of the partially completed structure",
      "Nothing, because the owner may cancel freely",
      "Payment for work properly performed plus reasonable termination costs - but usually not profit on work never performed",
      "The full contract price as if the job had finished",
    ],
    answer: 2,
    explain:
      "Termination for convenience lets the owner end the job without contractor fault, and the clause prices that right: work in place and wind-down costs are paid, while unearned profit generally is not. Termination for cause is a different clause with harsher results.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-011",
    domain: "ct",
    q: "A \"Type I\" differing site condition claim asserts that conditions encountered:",
    choices: [
      "Materially differ from what the contract documents indicated",
      "Are unusual and unknown for the area, though the documents said nothing about them",
      "Resulted from the contractor's own means and methods",
      "Were caused by weather during construction",
    ],
    answer: 0,
    explain:
      "Type I compares the ground to the documents: the borings or drawings said one thing, the site delivered another. Type II covers unknown and unusual conditions the documents were silent about. The distinction decides what a claim must prove.",
    cite: "NASCLA Guide - Contracts",
  },
  {
    id: "bl-ct-012",
    domain: "ct",
    q: "After the other party breaches a contract, the non-breaching contractor has a duty to:",
    choices: [
      "Take reasonable steps to limit (mitigate) its damages",
      "Immediately file a mechanics lien on all of the breaching party's property",
      "Continue performing at double the pace",
      "Let damages accumulate to strengthen the claim",
    ],
    answer: 0,
    explain:
      "The law expects the injured party to act reasonably to keep losses from growing - re-let the work, protect materials, stop the bleeding. Damages a court finds you could reasonably have avoided are generally not recoverable.",
    cite: "NASCLA Guide - Contracts",
  },

  // ---- Project Management & Scheduling (pj) ---------------------
  {
    id: "bl-pj-001",
    domain: "pj",
    q: "In a CPM schedule, the critical path is:",
    choices: [
      "The list of activities the owner considers most important",
      "The path with the most float",
      "The sequence of activities with the largest crew sizes",
      "The longest chain of dependent activities, which sets the shortest possible project duration",
    ],
    answer: 3,
    explain:
      "The critical path is the longest logic-connected chain through the network - its length IS the project duration, and its activities carry zero float. A one-day slip on the critical path slips the finish date by a day.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-002",
    domain: "pj",
    q: "Float (slack) on a schedule activity is:",
    choices: [
      "Time added for weather on every activity",
      "Extra budget assigned to the activity",
      "The time the activity can be delayed without delaying the project finish",
      "The number of workers that can be added",
    ],
    answer: 2,
    explain:
      "Float measures scheduling room: an activity with 5 days of float can slip 5 days before the finish date moves. Critical-path activities have zero float - that is what makes them critical.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-003",
    domain: "pj",
    q: "Compared with a CPM network, a simple Gantt (bar) chart's main limitation is that it:",
    choices: [
      "Cannot show calendar dates",
      "Does not clearly show the logic links between activities, so the effect of a delay is hard to trace",
      "Requires scheduling software to read",
      "Only works for projects under 90 days",
    ],
    answer: 1,
    explain:
      "Bars on a calendar are easy to read but silent about dependencies - you cannot see which bars push which. CPM encodes the logic, which is what lets it find the critical path and forecast the impact of changes.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-004",
    domain: "pj",
    q: "A schedule of values is:",
    choices: [
      "A list of the project's milestone dates",
      "The estimator's private cost breakdown",
      "A register of all executed change orders",
      "The breakdown of the contract sum into work items, used to measure and value progress payments",
    ],
    answer: 3,
    explain:
      "The schedule of values allocates the contract price across the work so each pay application can bill the percent complete of each line. Owners review it up front - front-loading it invites conflict at every draw.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-005",
    domain: "pj",
    q: "A pay application line item carries $50,000 of scheduled value and is 60% complete, with 10% retainage. On the first billing, the amount payable for that line is:",
    choices: ["$30,000", "$27,000", "$25,000", "$33,000"],
    answer: 1,
    explain:
      "Earned value: $50,000 x 60% = $30,000; retainage holds back 10% of the earned amount ($3,000), leaving $27,000 payable. Retainage comes out of every draw and is released per the contract at or near completion.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-006",
    domain: "pj",
    q: "Submittals (such as shop drawings and product data) are reviewed:",
    choices: [
      "Only when the building inspector requests them",
      "Only on public projects",
      "After the material is installed, to document what was used",
      "Before fabrication or installation, to confirm the item conforms to the contract documents",
    ],
    answer: 3,
    explain:
      "The submittal cycle catches nonconforming products on paper, where fixing them is cheap - before they are built into the work. Installing ahead of an approved submittal is how contractors buy rework at their own expense.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-007",
    domain: "pj",
    q: "The purpose of an RFI (request for information) is to:",
    choices: [
      "Schedule the final inspection",
      "Request additional payment for extra work",
      "Obtain written clarification of the contract documents and keep a record of the answer",
      "Reserve the contractor's lien rights",
    ],
    answer: 2,
    explain:
      "An RFI asks the design side to resolve a gap, conflict, or ambiguity in writing. The paper trail matters: RFI answers often become the basis for change orders and are the record if the answer changed cost or time.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-008",
    domain: "pj",
    q: "A punch list is:",
    choices: [
      "The daily list of workers on site",
      "The list of minor incomplete or corrective items assembled near substantial completion",
      "A log of safety violations",
      "The inspector's list of code citations",
    ],
    answer: 1,
    explain:
      "As the project reaches substantial completion, the walk-through produces the punch list - the small items standing between the job and final completion. Clearing it is typically tied to final payment and retainage release.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-009",
    domain: "pj",
    q: "Which document is typically part of project closeout?",
    choices: [
      "The original bid tabulation",
      "The superintendent's employment application",
      "The estimator's takeoff sheets",
      "As-built drawings showing the work as actually constructed",
    ],
    answer: 3,
    explain:
      "Closeout hands the owner what operating the building requires: as-builts, O&M manuals, warranties, and final lien waivers. Slow closeout is slow final payment - the paperwork is part of the work.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-010",
    domain: "pj",
    q: "A two- to three-week look-ahead schedule is used primarily to:",
    choices: [
      "Report company profit to the bank",
      "Track warranty claims after turnover",
      "Replace the master CPM schedule",
      "Plan near-term field work in detail - crews, materials, equipment, and coordination",
    ],
    answer: 3,
    explain:
      "The look-ahead translates the master schedule into what the field does next: short-interval detail the superintendent can staff and supply. It coordinates trades week to week; the master schedule still owns the big picture.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-011",
    domain: "pj",
    q: "In scheduling, a milestone is:",
    choices: [
      "A payment made at the middle of the project",
      "Any activity lasting longer than a month",
      "A zero-duration point that marks a key event, such as \"dried-in\" or substantial completion",
      "The first activity of each trade",
    ],
    answer: 2,
    explain:
      "Milestones consume no time - they flag moments the team and the contract care about, and contracts often hang deadlines or damages on them. Activities do the work; milestones mark the scoreboard.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },
  {
    id: "bl-pj-012",
    domain: "pj",
    q: "The most common dependency between two schedule activities is finish-to-start, which means:",
    choices: [
      "Both activities must finish on the same day",
      "The successor cannot start until its predecessor finishes",
      "The successor must start before the predecessor finishes",
      "The two activities share the same crew",
    ],
    answer: 1,
    explain:
      "Finish-to-start is the default logic tie: footings finish, then walls start. Other relationships (start-to-start, finish-to-finish, and lags) exist for overlapping work, but FS chains are what most critical paths are made of.",
    cite: "NASCLA Guide - Project Management and Scheduling",
  },

  // ---- Insurance & Bonding (ib) ---------------------------------
  {
    id: "bl-ib-001",
    domain: "ib",
    q: "A certificate of insurance provided to an owner or general contractor:",
    choices: [
      "Legally obligates the insurer to cover the certificate holder for any claim",
      "Replaces the need for an additional insured endorsement",
      "Guarantees the policy cannot be canceled",
      "Is evidence that coverage existed when it was issued - it does not itself create or change coverage",
    ],
    answer: 3,
    explain:
      "The certificate is a snapshot, not a policy: rights come from the policy and its endorsements. A party that needs protection under a sub's policy needs the endorsement itself - collecting certificates alone is a common and costly shortcut.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-002",
    domain: "ib",
    q: "Which claim would fall under a contractor's commercial general liability (CGL) policy?",
    choices: [
      "Hail damage to the contractor's own excavator",
      "The cost to re-do out-of-level framing before turnover",
      "A passerby injured by debris falling from the contractor's scaffold",
      "A carpenter employee injured on the job",
    ],
    answer: 2,
    explain:
      "CGL responds to third-party bodily injury and property damage arising from operations. Employee injuries belong to workers' compensation, the contractor's own equipment to inland marine or equipment coverage, and redoing defective work is generally a business cost, not a covered loss.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-003",
    domain: "ib",
    q: "Workers' compensation is described as a \"no-fault, exclusive remedy\" system because:",
    choices: [
      "It only covers accidents caused by the employee's own carelessness",
      "The employer pays only when found negligent",
      "Injured employees receive defined benefits without proving fault, and in exchange generally cannot sue the employer for the injury",
      "Employees choose between comp benefits and unlimited lawsuits",
    ],
    answer: 2,
    explain:
      "The comp bargain trades fault for certainty: medical care and wage benefits flow regardless of blame, and the employer gains protection from injury lawsuits in most circumstances. Coverage is required for most construction employers in nearly every state (Texas is the notable exception - private-employer coverage there is elective), with state-specific thresholds.",
    cite: "NASCLA Guide - Workers' Compensation",
  },
  {
    id: "bl-ib-004",
    domain: "ib",
    q: "Builder's risk insurance covers:",
    choices: [
      "Physical loss or damage to the structure and materials during construction, from perils like fire and storm",
      "Injuries to workers on the site",
      "The contractor's liability for defective design",
      "Loss of profit if the project is canceled",
    ],
    answer: 0,
    explain:
      "Builder's risk is property coverage on the work itself while it is being built - the half-finished building, and typically materials on site awaiting installation. It is not liability coverage; who buys it (owner or contractor) is set by the contract.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-005",
    domain: "ib",
    q: "A contractor's tools, equipment, and materials in transit or spread across jobsites are typically insured under:",
    choices: [
      "The commercial general liability policy",
      "Workers' compensation",
      "The company health plan",
      "An inland marine (equipment floater) policy",
    ],
    answer: 3,
    explain:
      "Property policies tied to a fixed location do not follow gear that moves; inland marine coverage floats with it - in the truck, on the site, between jobs. CGL is liability coverage and never insures the contractor's own property.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-006",
    domain: "ib",
    q: "An \"occurrence\" liability policy responds to a covered claim based on:",
    choices: [
      "When the policy premium was last paid",
      "When the project reached final completion",
      "When the injury or damage happened, even if the claim is filed years later",
      "When the claim is first made against the insured",
    ],
    answer: 2,
    explain:
      "Occurrence coverage attaches to the policy in force when the damage occurred - a claim surfacing years later still lands on that old policy. Claims-made coverage instead keys on when the claim is made, which is why the distinction matters for long construction tail risks.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-007",
    domain: "ib",
    q: "An additional insured endorsement on a subcontractor's CGL policy:",
    choices: [
      "Cancels the sub's own coverage",
      "Extends specified protection under the sub's policy to another party, such as the GC, for liability arising from the sub's work",
      "Doubles the policy limits",
      "Makes the sub's insurer responsible for the GC's payroll",
    ],
    answer: 1,
    explain:
      "Naming the GC or owner as an additional insured puts the sub's insurer in front of claims that arise from the sub's operations. Contracts pair this with the certificate requirement; only the endorsement actually grants the status.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-008",
    domain: "ib",
    q: "A commercial umbrella (excess) policy:",
    choices: [
      "Provides additional limits above the underlying liability policies once their limits are exhausted",
      "Covers floods and earthquakes excluded elsewhere",
      "Replaces workers' compensation in most states",
      "Insures the contractor's buildings and office contents",
    ],
    answer: 0,
    explain:
      "The umbrella sits on top: when a large claim burns through the primary CGL or auto limits, the umbrella's limits take over. It is how contractors meet the higher liability limits many owners and primes require without re-buying primary coverage. The guide treats umbrella and excess liability together: extra limits above your underlying policies, never a replacement for them.",
    cite: "NASCLA Guide - Insurance",
  },
  {
    id: "bl-ib-009",
    domain: "ib",
    q: "The three parties to a surety bond are:",
    choices: [
      "The buyer, the seller, and the lender",
      "The insured, the adjuster, and the broker",
      "The owner, the architect, and the inspector",
      "The principal (contractor), the obligee (the party protected), and the surety",
    ],
    answer: 3,
    explain:
      "A bond is a three-party guarantee, not insurance: the surety backs the principal's obligation to the obligee, and if the surety pays, it expects reimbursement from the contractor under the indemnity agreement. Insurance transfers risk; suretyship extends credit.",
    cite: "NASCLA Guide - Bonds",
  },
  {
    id: "bl-ib-010",
    domain: "ib",
    q: "The penal sum of a bid bond is usually set as:",
    choices: [
      "A flat fee fixed by federal law for all projects",
      "The full contract price of the project",
      "A percentage of the bid amount, commonly in the 5% to 10% range",
      "The contractor's annual revenue",
    ],
    answer: 2,
    explain:
      "Bid security is sized to the bid - typically 5% or 10% as the solicitation specifies. It compensates the owner if the winning bidder refuses to sign or cannot deliver the required performance and payment bonds. The solicitation states the exact figure, so read the invitation - the percentage is the owner's call, not a universal law.",
    cite: "NASCLA Guide - Bonds",
  },
  {
    id: "bl-ib-011",
    domain: "ib",
    q: "On federal construction projects, the Miller Act requires performance and payment bonds on contracts exceeding:",
    choices: ["$10,000", "$50,000", "$150,000", "$1,000,000"],
    answer: 2,
    explain:
      "The Miller Act's operative line is $150,000 - the statute's original $100,000 was inflation-adjusted upward in 2010 and has sat at $150,000 since. Above it, a performance bond protects the government and a payment bond protects subs and suppliers - who cannot lien federal property. States mirror this for public work with their own \"Little Miller Acts\".",
    cite: "Miller Act; NASCLA Guide - Bonds",
  },
  {
    id: "bl-ib-012",
    domain: "ib",
    q: "A surety evaluating a contractor's bonding capacity sets:",
    choices: [
      "The maximum number of employees the contractor may have",
      "A single-project limit and an aggregate limit for all bonded work at once, based on the company's finances, experience, and character",
      "Only the price of the bond premium",
      "The contractor's allowed profit margin",
    ],
    answer: 1,
    explain:
      "Sureties underwrite like careful lenders - capital, capacity, and character - and express the result as a per-job limit and a total program limit. Growing bonding capacity is a financial-statement project: retained earnings, clean job costing, and completed work history.",
    cite: "NASCLA Guide - Bonds",
  },

  // ---- Labor & Employment Law (lb) ------------------------------
  {
    id: "bl-lb-001",
    domain: "lb",
    q: "Under the federal Fair Labor Standards Act (FLSA), a nonexempt employee must be paid overtime at:",
    choices: [
      "1.5 times the regular rate for hours over 40 in a workweek",
      "2 times the regular rate for hours over 8 in a day",
      "1.5 times the regular rate for all weekend hours",
      "Straight time, if the employee agrees in writing",
    ],
    answer: 0,
    explain:
      "The federal trigger is the 40-hour workweek - time and a half beyond it. Federal law sets no daily overtime and no weekend premium (some states add their own rules), and employees cannot waive overtime by agreement.",
    cite: "FLSA - overtime; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-002",
    domain: "lb",
    q: "An employee is exempt from FLSA overtime only if:",
    choices: [
      "The employee is paid a salary of any amount",
      "The employee agrees to the exemption at hiring",
      "The employee works in construction",
      "The employee meets the tests for an exemption, such as salary basis plus executive, administrative, or professional duties",
    ],
    answer: 3,
    explain:
      "\"Salaried\" alone exempts no one: the exemptions turn on how the person is paid AND what they actually do. Misclassifying workers as exempt creates back-overtime liability that compounds quietly for years.",
    cite: "FLSA - exemptions; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-003",
    domain: "lb",
    q: "Form I-9 must be completed:",
    choices: [
      "Only for companies with more than 50 employees",
      "Once per year for the whole workforce",
      "For every new hire, to verify identity and authorization to work in the United States",
      "Only for workers the employer believes are not U.S. citizens",
    ],
    answer: 2,
    explain:
      "Every employee - citizens included - completes an I-9, with the employer's verification section finished within the first days of work. Selective verification is itself discrimination; keep the forms on file and ready for inspection.",
    cite: "USCIS Form I-9; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-004",
    domain: "lb",
    q: "In deciding whether a worker is an employee or an independent contractor, the IRS looks primarily at:",
    choices: [
      "Whether the worker asked to be paid on a 1099",
      "Behavioral control, financial control, and the relationship of the parties",
      "What title the parties put in their written agreement",
      "Whether the worker owns a truck",
    ],
    answer: 1,
    explain:
      "Substance beats labels: who controls how the work is done, who bears profit-and-loss risk, and how permanent the relationship is. A signed \"contractor agreement\" does not save a classification the facts contradict.",
    cite: "IRS - worker classification; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-005",
    domain: "lb",
    q: "A contractor who misclassifies employees as independent contractors is exposed to:",
    choices: [
      "Back payroll taxes, penalties, and interest - plus exposure on overtime, workers' comp, and benefits",
      "Nothing, if the workers signed 1099 agreements",
      "Only a one-time $100 filing fee",
      "Liability that ends when the worker is terminated",
    ],
    answer: 0,
    explain:
      "Misclassification unwinds expensively: the employer share of employment taxes, withholding that never happened, overtime never paid, comp premiums never collected. Agencies share data, so one audit tends to invite the others.",
    cite: "IRS - worker classification; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-006",
    domain: "lb",
    q: "The Davis-Bacon Act requires contractors on covered federal construction projects to:",
    choices: [
      "Hire only union labor",
      "Pay all workers the federal minimum wage only",
      "Limit the workweek to 35 hours",
      "Pay workers at least the local prevailing wages and submit weekly certified payroll reports",
    ],
    answer: 3,
    explain:
      "Federal and federally assisted construction over the Act's threshold carries prevailing wage rates by craft, documented with weekly certified payrolls (form WH-347). It is a wage floor and paperwork regime - not a union mandate.",
    cite: "Davis-Bacon Act - certified payroll (WH-347)",
  },
  {
    id: "bl-lb-007",
    domain: "lb",
    q: "Title VII of the Civil Rights Act prohibits employment discrimination based on:",
    choices: [
      "Union membership only",
      "Wage history only",
      "Race, color, religion, sex, or national origin",
      "Level of experience",
    ],
    answer: 2,
    explain:
      "Title VII is the core federal anti-discrimination statute, applying to employers at or above the employee-count threshold (15). Related statutes extend protection to age (40 and over) and disability - hiring, firing, pay, and terms all covered.",
    cite: "Title VII; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-008",
    domain: "lb",
    q: "The Family and Medical Leave Act (FMLA) generally entitles eligible employees of covered employers (50 or more employees) to:",
    choices: [
      "Retirement benefits after 12 years",
      "Up to 12 weeks of unpaid, job-protected leave for qualifying family and medical reasons",
      "12 weeks of fully paid vacation",
      "Permanent reassignment to lighter duty",
    ],
    answer: 1,
    explain:
      "FMLA protects the job and group health coverage during qualifying leave - birth or adoption, serious health conditions, certain military family needs. The leave is unpaid under federal law; smaller employers below the threshold are not covered by FMLA.",
    cite: "FMLA; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-009",
    domain: "lb",
    q: "Under federal child labor rules, workers under 18 on a construction operation:",
    choices: [
      "May not perform occupations declared hazardous, such as roofing, excavation, and operating power-driven saws",
      "May do any work if a parent signs a waiver",
      "May perform hazardous occupations such as roofing once they turn 16",
      "Are banned from jobsites entirely",
    ],
    answer: 0,
    explain:
      "Minors can hold many jobs, but the hazardous-occupation orders wall off the dangerous ones - roofing, trenching, most power equipment. Parental permission does not override them, and violations carry per-minor penalties.",
    cite: "FLSA - child labor; NASCLA Guide - Labor Laws",
  },
  {
    id: "bl-lb-010",
    domain: "lb",
    q: "Form W-4 is used to:",
    choices: [
      "Verify the employee's eligibility to work",
      "Report annual wages to the Social Security Administration",
      "Enroll the employee in workers' compensation",
      "Record the employee's federal income tax withholding elections",
    ],
    answer: 3,
    explain:
      "The W-4 tells payroll how much federal income tax to withhold from each check. Work authorization is the I-9's job, and annual wage reporting happens on the W-2 - three forms exams love to swap.",
    cite: "IRS Form W-4; NASCLA Guide - Payroll",
  },
  {
    id: "bl-lb-011",
    domain: "lb",
    q: "Under the FLSA, payroll records must be retained at least:",
    choices: [
      "1 year",
      "10 years",
      "3 years",
      "6 months",
    ],
    answer: 2,
    explain:
      "Federal wage law sets a 3-year floor for payroll records (with supporting wage-computation records kept 2 years). Other regimes set their own clocks - employment tax records run longer - so many contractors standardize on the longest applicable period.",
    cite: "FLSA - recordkeeping",
  },
  {
    id: "bl-lb-012",
    domain: "lb",
    q: "A contractor's workers' compensation premium is most directly affected by:",
    choices: [
      "The age of the company's logo",
      "Payroll by classification code and the company's experience modification rate (EMR)",
      "The number of trucks the company owns",
      "The size of the office building",
    ],
    answer: 1,
    explain:
      "Comp pricing starts with payroll in each work classification, then multiplies by the EMR - the company's claims history against its industry. Safety pays twice: fewer injuries and a lower mod on every payroll dollar.",
    cite: "NASCLA Guide - Workers' Compensation",
  },

  // ---- Financial Management (fm) --------------------------------
  {
    id: "bl-fm-001",
    domain: "fm",
    q: "The basic accounting equation is:",
    choices: [
      "Assets = Liabilities + Owner's Equity",
      "Revenue = Expenses + Profit",
      "Cash = Income - Taxes",
      "Assets = Revenue - Liabilities",
    ],
    answer: 0,
    explain:
      "Everything the company owns is financed by someone - creditors (liabilities) or owners (equity) - so the balance sheet must balance: Assets = Liabilities + Equity. Every transaction keeps that equation true.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-002",
    domain: "fm",
    q: "A company has $200,000 in current assets and $100,000 in current liabilities. Its current ratio is:",
    choices: ["2.0", "0.5", "1.0", "20"],
    answer: 0,
    explain:
      "Current ratio = current assets / current liabilities = 200,000 / 100,000 = 2.0. It measures the ability to pay bills coming due within a year; sureties and lenders read it as a first-glance health check.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-003",
    domain: "fm",
    q: "Working capital equals:",
    choices: [
      "Total assets minus total liabilities",
      "Annual revenue minus annual expenses",
      "Cash on hand plus equipment value",
      "Current assets minus current liabilities",
    ],
    answer: 3,
    explain:
      "Working capital is the short-term cushion: what remains of current assets after current obligations are covered. Sureties size bonding programs partly on it - a contractor can be profitable on paper and still fail for lack of working capital.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-004",
    domain: "fm",
    q: "The quick ratio differs from the current ratio because the quick ratio:",
    choices: [
      "Measures profit instead of liquidity",
      "Is always calculated monthly",
      "Excludes inventory and other less-liquid current assets from the numerator",
      "Includes long-term debt in the denominator",
    ],
    answer: 2,
    explain:
      "The quick (acid-test) ratio keeps only assets that convert to cash fast - cash, receivables - and drops inventory. It answers a harsher question than the current ratio: could the company pay its near-term bills without selling stock on hand?",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-005",
    domain: "fm",
    q: "Under the accrual basis of accounting, revenue is recorded when:",
    choices: [
      "The tax return is filed",
      "It is earned, regardless of when the cash is received",
      "The cash lands in the bank",
      "The contract is signed",
    ],
    answer: 1,
    explain:
      "Accrual accounting matches revenue to when it is earned and expenses to when they are incurred, which is what makes job profitability visible. Cash-basis books record only money movement - simpler, but they can hide how jobs are really doing.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-006",
    domain: "fm",
    q: "The percentage-of-completion method recognizes revenue on a long-term contract:",
    choices: [
      "As the work progresses, typically in proportion to costs incurred versus total estimated costs",
      "Only when the project reaches final completion",
      "Only when the owner pays each invoice",
      "In equal monthly amounts across the schedule",
    ],
    answer: 0,
    explain:
      "Percentage-of-completion books revenue as the job earns it - commonly cost-to-cost: percent complete = costs to date / total estimated cost. The completed-contract alternative defers everything to the end, which can whipsaw the income statement.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-007",
    domain: "fm",
    q: "The main purpose of a job costing system is to:",
    choices: [
      "Replace the company's tax return",
      "Calculate employee vacation balances",
      "Set the office rent",
      "Track each job's actual costs against its estimate, so overruns surface early and future bids improve",
    ],
    answer: 3,
    explain:
      "Job costing ties every labor hour, invoice, and equipment charge to the job that caused it. It is both an early-warning system for the current job and the productivity database the next estimate is built from.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-008",
    domain: "fm",
    q: "\"Billings in excess of costs and estimated earnings\" (overbilling) appears on the balance sheet as:",
    choices: [
      "Equity, because it belongs to the owner",
      "It does not appear on the balance sheet",
      "A liability, because the company has billed for work it has not yet earned",
      "An asset, because it increases cash",
    ],
    answer: 2,
    explain:
      "Overbilling is money collected ahead of the work - an obligation still owed in labor and materials, so it books as a liability. Underbilling (costs in excess of billings) is the asset-side twin, and heavy underbilling is a classic sign of trouble.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-009",
    domain: "fm",
    q: "A contract sells for $500,000 with direct costs of $410,000. The gross profit percentage is:",
    choices: ["18%", "22%", "82%", "90%"],
    answer: 0,
    explain:
      "Gross profit = 500,000 - 410,000 = $90,000; as a percentage of revenue: 90,000 / 500,000 = 18%. Gross profit must still cover overhead before anything becomes net profit - a job can be gross-positive and still lose money after overhead.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-010",
    domain: "fm",
    q: "A company carries $120,000 of annual overhead and averages a 20% gross margin. What annual revenue does it need just to break even?",
    choices: ["$600,000", "$144,000", "$240,000", "$1,200,000"],
    answer: 0,
    explain:
      "Break-even revenue = overhead / gross margin: 120,000 / 0.20 = $600,000. Every revenue dollar contributes 20 cents toward overhead; it takes $600,000 of them before the company earns its first dollar of net profit.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-011",
    domain: "fm",
    q: "A profitable contractor can still fail because:",
    choices: [
      "Profitable companies must pay employees weekly",
      "Cash flow and profit are not the same - retainage, slow receivables, and up-front costs can starve a growing company of cash",
      "Profit automatically increases taxes beyond 100%",
      "Banks refuse deposits from construction companies",
    ],
    answer: 1,
    explain:
      "Construction pays late by design: you fund labor and materials now, bill later, collect later still, minus retainage. Growth widens that gap. Cash flow projections - not the income statement - are what keep payroll clearing.",
    cite: "NASCLA Guide - Financial Management",
  },
  {
    id: "bl-fm-012",
    domain: "fm",
    q: "Which statement correctly pairs the financial statements with what they show?",
    choices: [
      "The income statement covers a period of time; the balance sheet is a snapshot at a single date",
      "Both statements cover the same period of time",
      "The balance sheet shows revenue; the income statement shows assets",
      "The income statement is prepared only at year end",
    ],
    answer: 0,
    explain:
      "The income statement is a movie - revenue and expenses across a month, quarter, or year. The balance sheet is a photograph - what is owned and owed at one moment. The cash flow statement bridges the two by explaining where cash went.",
    cite: "NASCLA Guide - Financial Management",
  },

  // ---- Tax Basics (tx) ------------------------------------------
  {
    id: "bl-tx-001",
    domain: "tx",
    q: "Which of the following is NOT withheld from an employee's wages?",
    choices: [
      "Federal income tax",
      "The employee's share of Social Security tax",
      "The employee's share of Medicare tax",
      "Federal unemployment tax (FUTA)",
    ],
    answer: 3,
    explain:
      "FUTA is paid by the employer alone - nothing comes out of the employee's check for it. Income tax withholding and the employee's share of FICA are withheld; the employer then adds its own matching FICA share on top.",
    cite: "IRS Pub 15 (Circular E)",
  },
  {
    id: "bl-tx-002",
    domain: "tx",
    q: "FICA taxes (Social Security and Medicare) are paid:",
    choices: [
      "Entirely by the employer",
      "Only by companies with more than 10 employees",
      "Half by the employee through withholding and half by the employer as a matching share",
      "Entirely by the employee",
    ],
    answer: 2,
    explain:
      "FICA is a matched tax: the employer withholds the employee's share and contributes an equal employer share with each payroll. Self-employed owners pay both halves themselves as self-employment tax.",
    cite: "IRS Pub 15 (Circular E)",
  },
  {
    id: "bl-tx-003",
    domain: "tx",
    q: "Federal and state unemployment taxes (FUTA and SUTA) fund:",
    choices: [
      "The contractor licensing board",
      "Unemployment benefits, and are paid by the employer",
      "Employee retirement accounts, paid by the employee",
      "Workers' compensation claims",
    ],
    answer: 1,
    explain:
      "Unemployment taxes are employer-paid levies on a wage base in nearly all states (a few - Alaska, New Jersey, Pennsylvania - also collect a small employee share), funding state benefit systems (with FUTA backing them federally). A stable claims history keeps the state rate down; workers' comp is a separate insurance system entirely.",
    cite: "IRS Pub 15 (Circular E)",
  },
  {
    id: "bl-tx-004",
    domain: "tx",
    q: "A sole proprietor's self-employment tax covers:",
    choices: [
      "Both the employer and employee shares of Social Security and Medicare",
      "Federal income tax only",
      "State sales tax",
      "Unemployment insurance for the owner",
    ],
    answer: 0,
    explain:
      "With no employer to match, the self-employed owner pays both halves of Social Security and Medicare as self-employment tax, computed on the business's net earnings - on top of, and separate from, regular income tax.",
    cite: "IRS - self-employment tax",
  },
  {
    id: "bl-tx-005",
    domain: "tx",
    q: "Business owners whose income has no withholding generally must:",
    choices: [
      "Pay all tax on April 15 with no penalty regardless of amount",
      "Pay taxes only in years the business is profitable enough to afford it",
      "Have their customers withhold tax from payments",
      "Pay estimated taxes in quarterly installments during the year",
    ],
    answer: 3,
    explain:
      "The tax system is pay-as-you-go: wages achieve it through withholding, owners through quarterly estimated payments. Skipping quarters invites underpayment penalties even if the April balance is paid in full.",
    cite: "IRS - estimated taxes",
  },
  {
    id: "bl-tx-006",
    domain: "tx",
    q: "Payments to an unincorporated independent subcontractor above the IRS annual reporting threshold are reported on:",
    choices: [
      "Form I-9",
      "Form 941 only",
      "Form 1099-NEC",
      "Form W-2",
    ],
    answer: 2,
    explain:
      "Nonemployee compensation goes on the 1099-NEC filed with the IRS and copied to the sub; W-2s are for employees. Collect a Form W-9 from each sub up front so the TIN is on file before the year-end scramble. Older references - the NASCLA guide included - still cite Form 1099-MISC, which carried nonemployee compensation before the IRS revived the 1099-NEC in 2020.",
    cite: "IRS - Form 1099-NEC",
  },
  {
    id: "bl-tx-007",
    domain: "tx",
    q: "Taxes withheld from employee paychecks are called \"trust fund\" taxes because:",
    choices: [
      "They are optional for small employers",
      "The employer holds them in trust for the government - and responsible individuals can be held personally liable for failing to pay them over",
      "They must be kept in a bank trust account earning interest",
      "They belong to the employee's retirement trust",
    ],
    answer: 1,
    explain:
      "Withheld income tax and the employee FICA share are the government's money in the employer's hands. Using it for payroll or materials is the classic failing-contractor mistake - the trust fund recovery penalty pierces the entity and lands on owners personally.",
    cite: "IRS - trust fund recovery penalty",
  },
  {
    id: "bl-tx-008",
    domain: "tx",
    q: "Use tax is owed when:",
    choices: [
      "A business uses taxable goods on which no sales tax was collected - such as materials bought from an out-of-state supplier",
      "A company uses more than one bank account",
      "Equipment is used more than 40 hours per week",
      "A contractor works in more than one county",
    ],
    answer: 0,
    explain:
      "Use tax is sales tax's backstop: buy taxable materials without paying sales tax (commonly from out of state) and the buyer owes the equivalent use tax to its own state. How contractors are taxed on materials varies by state - the concept is universal.",
    cite: "NASCLA Guide - Tax Basics",
  },
  {
    id: "bl-tx-009",
    domain: "tx",
    q: "Depreciation is:",
    choices: [
      "The loss of profit on an underbid job",
      "A penalty for late tax filing",
      "The interest paid on an equipment loan",
      "Deducting the cost of a long-lived asset over its useful life rather than all at once",
    ],
    answer: 3,
    explain:
      "Equipment that serves for years is expensed across those years - that is depreciation. Elections like Section 179 can accelerate qualifying purchases into the year placed in service, subject to limits; the underlying idea stays cost-over-life.",
    cite: "IRS - depreciation; NASCLA Guide - Tax Basics",
  },
  {
    id: "bl-tx-010",
    domain: "tx",
    q: "The Section 179 election allows a business, within annual limits, to:",
    choices: [
      "Pay employees without withholding",
      "Convert income tax into sales tax",
      "Deduct the full cost of qualifying equipment in the year it is placed in service",
      "Skip filing a tax return in a loss year",
    ],
    answer: 2,
    explain:
      "Section 179 trades a stream of depreciation deductions for one immediate deduction on qualifying property, up to the year's limits. Whether to take it is a planning decision - accelerating deductions helps most in a high-income year.",
    cite: "IRS - Section 179",
  },
  {
    id: "bl-tx-011",
    domain: "tx",
    q: "How often an employer must deposit withheld payroll taxes is determined by:",
    choices: [
      "The state contractor licensing board",
      "The IRS deposit schedule assigned from the employer's lookback-period liability (monthly or semiweekly)",
      "Whatever schedule the owner finds convenient",
      "The employee vote at the start of each year",
    ],
    answer: 1,
    explain:
      "The IRS assigns each employer a deposit schedule based on past liability; deposits are made electronically on that clock, and late deposits draw escalating penalties. Payday is not the deadline - the deposit date is its own obligation. One more clock: accumulate $100,000 or more of liability and that deposit is due the next business day, whatever your assigned schedule.",
    cite: "IRS Pub 15 (Circular E)",
  },
  {
    id: "bl-tx-012",
    domain: "tx",
    q: "The IRS recommends keeping employment tax records for at least:",
    choices: ["4 years", "1 year", "18 months", "25 years"],
    answer: 0,
    explain:
      "Employment tax records - returns, deposit proof, W-4s, wage detail - should be kept at least 4 years after the tax is due or paid. Many contractors keep them longer, since other laws set their own retention clocks.",
    cite: "IRS - recordkeeping for employers",
  },

  // ---- Mechanics' Liens & Payment (ln) --------------------------
  {
    id: "bl-ln-001",
    domain: "ln",
    q: "A mechanics lien gives an unpaid contractor, subcontractor, or supplier:",
    choices: [
      "A security interest in the improved real property for the value of labor or materials furnished",
      "The right to repossess installed materials",
      "A claim against the owner's personal bank account",
      "Automatic payment from the state licensing board",
    ],
    answer: 0,
    explain:
      "The lien attaches to the property that was improved - not to equipment or the owner's other assets - and can ultimately force a sale to satisfy the debt. It exists by statute, which is why every state's procedures and deadlines differ.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-002",
    domain: "ln",
    q: "In most states, mechanics lien rights extend to:",
    choices: [
      "Only the general contractor who signed with the owner",
      "Only parties with a written contract notarized before work began",
      "Anyone the owner has ever done business with",
      "General contractors, subcontractors, laborers, and material suppliers who improve the property",
    ],
    answer: 3,
    explain:
      "Lien statutes typically protect the chain of parties whose work or materials went into the improvement, including those with no direct contract with the owner. Exactly who qualifies, and what notices they owe first, is state-specific.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-003",
    domain: "ln",
    q: "The purpose of a preliminary notice (pre-lien notice) is to:",
    choices: [
      "Demand immediate payment before work starts",
      "Terminate the contract",
      "Alert the owner early that a party is supplying labor or materials, preserving that party's right to lien later if unpaid",
      "Record the final lien at the courthouse",
    ],
    answer: 2,
    explain:
      "Many states condition a sub's or supplier's lien rights on sending this early notice - often within a set number of days after first furnishing. Miss it where required and the lien right can be lost before the unpaid invoice ever exists. Deadlines vary by state.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-004",
    domain: "ln",
    q: "Mechanics lien filing deadlines are typically measured from:",
    choices: [
      "The start of the state's fiscal year",
      "Completion of the work or the claimant's last furnishing of labor or materials - with the specific period set by each state",
      "The date the contract was signed",
      "The owner's birthday",
    ],
    answer: 1,
    explain:
      "The clock generally starts at the end of the claimant's involvement - last work or last delivery - and runs for a statutory period that differs by state. Calendar the deadline the day the job ends; a lien filed late is no lien at all.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-005",
    domain: "ln",
    q: "The critical difference between a conditional and an unconditional lien waiver is:",
    choices: [
      "A conditional waiver takes effect only if the payment is actually received and clears; an unconditional waiver gives up rights immediately upon signing",
      "A conditional waiver must be notarized; an unconditional waiver need not be",
      "Conditional waivers apply only to public projects",
      "There is no practical difference",
    ],
    answer: 0,
    explain:
      "Sign an unconditional waiver against a check that later bounces and the lien rights are gone anyway. The safe exchange is a conditional waiver with payment, converting to unconditional only after funds clear.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-006",
    domain: "ln",
    q: "A progress (partial) lien waiver differs from a final waiver in that it:",
    choices: [
      "Waives all rights on the project forever",
      "Applies only to material suppliers",
      "Must be filed with the county recorder to be valid",
      "Releases lien rights only through a stated date or payment amount, leaving rights for later work intact",
    ],
    answer: 3,
    explain:
      "Progress waivers travel with each draw - rights released only for what has been paid, through a cutoff. The final waiver at project end releases what remains. Read the form: a \"progress\" waiver drafted with final language takes more than it should.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-007",
    domain: "ln",
    q: "An owner who pays the general contractor in full can still face a lien from an unpaid subcontractor in many states. The standard protection is to:",
    choices: [
      "Post a no-trespassing sign on the property",
      "Wait until the statute of limitations expires before occupying",
      "Collect lien waivers from subs and suppliers with each payment",
      "Pay the general contractor in cash",
    ],
    answer: 2,
    explain:
      "Because lien rights can flow from parties the owner never contracted with, the owner's real receipt is the waiver chain. Contractors should expect waiver-per-payment discipline and run the same system downstream on their own subs.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-008",
    domain: "ln",
    q: "Mechanics liens generally cannot be filed against public property. On public work, unpaid subs and suppliers instead look to:",
    choices: [
      "The general contractor's personal residence",
      "The payment bond required for the project (Miller Act federally; Little Miller Acts in the states)",
      "The governor's discretionary fund",
      "A lien on the public agency's office building",
    ],
    answer: 1,
    explain:
      "Public property is exempt from liens, so bond statutes substitute: the payment bond stands in for the property as the source of recovery, with its own notice and suit deadlines that demand the same calendar discipline liens do.",
    cite: "Miller Act; NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-009",
    domain: "ln",
    q: "After recording a mechanics lien, a claimant who remains unpaid must:",
    choices: [
      "File a foreclosure (enforcement) action within the statutory period, or the lien expires",
      "Do nothing - the lien collects itself with interest",
      "Renew the lien every 30 days by phone",
      "Transfer the lien to a collection agency to keep it alive",
    ],
    answer: 0,
    explain:
      "Recording is step one; enforcement is a lawsuit on its own statutory clock, and a lien not sued upon in time dies. Liens are leverage with an expiration date - track both the filing deadline and the enforcement deadline.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-010",
    domain: "ln",
    q: "A mechanics lien attaches to:",
    choices: [
      "The contractor's own equipment",
      "The owner's vehicles",
      "The building department's permit file",
      "The real property that was improved",
    ],
    answer: 3,
    explain:
      "The lien encumbers the land and improvements where the labor and materials went - clouding title, complicating sale and refinance, and ultimately supporting foreclosure. It reaches no other assets of the owner.",
    cite: "NASCLA Guide - Mechanics Liens",
  },
  {
    id: "bl-ln-011",
    domain: "ln",
    q: "A general contractor worried that a subcontractor might not pay its material supplier can protect against a supplier lien by:",
    choices: [
      "Refusing to allow materials on site",
      "Requiring the supplier to work for free",
      "Issuing joint checks payable to both the subcontractor and the supplier",
      "Paying the subcontractor in advance for the whole job",
    ],
    answer: 2,
    explain:
      "A joint check cannot be cashed without the supplier's endorsement, so the money demonstrably reached the party who could otherwise lien. Paired with waiver collection, it is a standard control on risky payment chains.",
    cite: "NASCLA Guide - Payment Practices",
  },
  {
    id: "bl-ln-012",
    domain: "ln",
    q: "An unpaid subcontractor on a bonded public project should:",
    choices: [
      "Bill the licensing board for the shortfall",
      "Give the required bond-claim notices and sue on the payment bond within the statutory deadlines",
      "Record a mechanics lien against the public building",
      "Stop work and wait indefinitely",
    ],
    answer: 1,
    explain:
      "The bond claim is the public-work remedy, and it runs on strict notice and suit windows set by the bond statutes. The steps mirror lien practice - notice, claim, timely suit - aimed at the surety instead of the land.",
    cite: "Miller Act; NASCLA Guide - Mechanics Liens",
  },

  // ---- Jobsite Safety & OSHA (sf) -------------------------------
  {
    id: "bl-sf-001",
    domain: "sf",
    q: "OSHA's General Duty Clause requires every employer to:",
    choices: [
      "Provide a workplace free from recognized hazards likely to cause death or serious harm - even where no specific standard applies",
      "Employ a full-time safety director",
      "Hold safety meetings daily",
      "Buy each employee's work boots",
    ],
    answer: 0,
    explain:
      "The General Duty Clause is the catch-all: a recognized, serious, correctable hazard can be cited even if no numbered standard covers it. Specific standards then add their own explicit requirements on top.",
    cite: "OSH Act Sec. 5(a)(1)",
  },
  {
    id: "bl-sf-002",
    domain: "sf",
    q: "The OSHA standards that specifically govern construction work are found in:",
    choices: [
      "29 CFR 1910 only",
      "The International Building Code",
      "NFPA 70",
      "29 CFR 1926",
    ],
    answer: 3,
    explain:
      "Part 1926 is the construction rulebook; Part 1910 (general industry) still reaches construction employers where 1926 is silent. The building code governs what you build - OSHA governs how safely you build it.",
    cite: "29 CFR 1926",
  },
  {
    id: "bl-sf-003",
    domain: "sf",
    q: "In construction, OSHA generally requires fall protection when employees work at heights of:",
    choices: [
      "Any height, including ground level",
      "Only above 30 feet",
      "6 feet or more above a lower level",
      "20 feet or more",
    ],
    answer: 2,
    explain:
      "Six feet is the construction trigger - met with guardrails, safety nets, or personal fall arrest. Scaffolds carry their own 10-foot threshold under the scaffold standard. Falls remain construction's deadliest hazard category.",
    cite: "29 CFR 1926.501",
  },
  {
    id: "bl-sf-004",
    domain: "sf",
    q: "Under OSHA standards, a \"competent person\" is someone who:",
    choices: [
      "Is certified by the licensing board",
      "Can identify existing and predictable hazards AND has the employer's authority to promptly correct them",
      "Has any OSHA 10-hour card",
      "Has worked in construction for at least 10 years",
    ],
    answer: 1,
    explain:
      "The definition has two halves - recognition and authority - and both are required. Several standards (excavations, scaffolds, fall protection) demand a competent person's inspections; a knowledgeable worker with no authority to stop work does not qualify.",
    cite: "29 CFR 1926.32(f)",
  },
  {
    id: "bl-sf-005",
    domain: "sf",
    q: "Under the Hazard Communication standard, employers must:",
    choices: [
      "Keep safety data sheets (SDS) accessible to employees for every hazardous chemical on site, with labeled containers and training",
      "Lock all SDS binders in the main office 30 miles away",
      "Provide chemical information only when an employee is injured",
      "Report every chemical purchase to the EPA",
    ],
    answer: 0,
    explain:
      "HazCom is right-to-know: an inventory of hazardous chemicals, labels that stay on containers, SDSs employees can actually reach during their shift, and training on what it all means. Off-site or locked-up SDSs fail the standard's point.",
    cite: "29 CFR 1910.1200",
  },
  {
    id: "bl-sf-006",
    domain: "sf",
    q: "The OSHA Form 300A annual summary of work-related injuries and illnesses must be posted in the workplace:",
    choices: [
      "During the month of December only",
      "Only after an OSHA inspection",
      "Permanently, in the company vehicle",
      "From February 1 to April 30 each year, covering the prior calendar year",
    ],
    answer: 3,
    explain:
      "Covered employers log recordable cases on the 300 log, summarize the year on the 300A, and post that summary from February 1 through April 30 where employees can see it - even in a year with zero recordables.",
    cite: "29 CFR 1904",
  },
  {
    id: "bl-sf-007",
    domain: "sf",
    q: "An employer must report a work-related fatality to OSHA within:",
    choices: [
      "One week, by certified mail",
      "No report is required if the site was subcontracted",
      "8 hours - and an in-patient hospitalization, amputation, or loss of an eye within 24 hours",
      "30 days, on the annual summary",
    ],
    answer: 2,
    explain:
      "The two reporting clocks are 8 hours for a fatality and 24 hours for in-patient hospitalization, amputation, or eye loss - by phone or OSHA's online portal. These reports are separate from, and faster than, ordinary recordkeeping. Watch for older study materials teaching a pre-2015 rule (reporting only multi-employee hospitalizations) - the current standard is the one here.",
    cite: "29 CFR 1904.39",
  },
  {
    id: "bl-sf-008",
    domain: "sf",
    q: "In excavation work, a protective system (sloping, shoring, or shielding) is generally required when a trench reaches a depth of:",
    choices: [
      "Protective systems are always optional if workers are careful",
      "5 feet, unless the excavation is entirely in stable rock",
      "10 feet in all soil types",
      "15 feet",
    ],
    answer: 1,
    explain:
      "Five feet is the trigger (stable rock excepted), and a competent person must inspect daily and after rain. Related rule worth knowing: trenches 4 feet or deeper need an exit - ladder or ramp - within 25 feet of lateral travel.",
    cite: "29 CFR 1926 Subpart P",
  },
  {
    id: "bl-sf-009",
    domain: "sf",
    q: "When using an extension ladder to access an upper landing surface, the ladder side rails must:",
    choices: [
      "Extend at least 3 feet above the upper landing surface",
      "Stop exactly at the landing height",
      "Be tied off only in winds over 40 mph",
      "Extend 10 feet above the landing",
    ],
    answer: 0,
    explain:
      "The 3-foot extension gives a handhold for the transition on and off the ladder - the moment most ladder falls happen. Pair it with proper setup angle and securing the ladder against movement.",
    cite: "29 CFR 1926.1053",
  },
  {
    id: "bl-sf-010",
    domain: "sf",
    q: "When PPE such as hard hats or fall-protection harnesses is required by OSHA standards, the cost is generally borne by:",
    choices: [
      "The employee, through payroll deduction",
      "The project owner",
      "The state licensing board",
      "The employer, who must provide required PPE at no cost to employees, with limited exceptions such as ordinary work boots",
    ],
    answer: 3,
    explain:
      "OSHA's payment rule puts required PPE on the employer's tab, with narrow exceptions (everyday safety-toe footwear and prescription eyewear among them). Charging workers for required harnesses or hard hats is a citation waiting to happen.",
    cite: "29 CFR 1926.95",
  },
  {
    id: "bl-sf-011",
    domain: "sf",
    q: "Every covered employer must display which federal poster where employees can see it?",
    choices: [
      "The owner's contractor license exam score",
      "A map of the nearest hospital",
      "The OSHA \"Job Safety and Health: It's the Law\" poster",
      "The company's profit and loss statement",
    ],
    answer: 2,
    explain:
      "The OSHA rights poster is a baseline posting duty, alongside other required federal and state employment posters. It informs workers of their right to report hazards without retaliation - and inspectors do look for it.",
    cite: "OSHA - poster requirement",
  },
  {
    id: "bl-sf-012",
    domain: "sf",
    q: "A jobsite injury is OSHA-recordable (belongs on the 300 log) when it involves:",
    choices: [
      "Only injuries to workers with over one year of tenure",
      "Treatment beyond first aid, days away from work, restricted duty, or loss of consciousness",
      "Any use of an adhesive bandage",
      "Only injuries that result in a lawsuit",
    ],
    answer: 1,
    explain:
      "The recordability line sits between first aid and everything more serious: medical treatment, restricted work, transfer, days away, or loss of consciousness. Band-aid cases stay off the log; stitches go on it.",
    cite: "29 CFR 1904.7",
  },
];

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/blbank.ts (v3 - book-pass
// verified against the NASCLA guide 14th ed; 8 explanations
// enriched, zero answers changed)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
