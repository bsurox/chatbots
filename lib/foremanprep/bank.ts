// FILE: lib/foremanprep/bank.ts
import type { ForemanQuestion } from "./questions";

// ForemanPrep question bank. All original items, written to teach
// the same material the NASCLA references cover, each answer tagged
// with where to find it. Batches append here; questions.ts imports
// this array. Type-only import above keeps the module graph acyclic.

export const BANK: ForemanQuestion[] = [
  // ---- Procurement & Contracting -------------------------------
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
      "A bid bond backs the bid itself: if the winning bidder walks away or cannot provide the required performance and payment bonds, the owner can claim against it. It does not cover schedule, defects, or subcontractor payment.",
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
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
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
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
    cite: "NASCLA Guide, Ch. 7 - Retainage (p. 7-3)",
  },
  {
    id: "pc-004",
    domain: "procurement",
    q: "Which document formally modifies the scope, price, or time of an existing construction contract?",
    choices: ["A submittal", "A request for information (RFI)", "A change order", "A punch list"],
    answer: 2,
    explain:
      "A change order is the written, agreed modification to the contract. An RFI asks a question, a submittal proposes materials or methods, and a punch list tracks closeout corrections - none of them change the contract by themselves.",
    cite: "NASCLA Guide, Ch. 7 - Making Changes to the Contract (p. 7-7)",
  },
  {
    id: "pc-005",
    domain: "procurement",
    q: "A payment bond exists mainly to protect:",
    choices: [
      "The owner, against defective work",
      "Subcontractors and material suppliers, against nonpayment by the prime contractor",
      "The contractor, against weather delays",
      "The architect, against design errors",
    ],
    answer: 1,
    explain:
      "The payment bond assures that subcontractors and suppliers get paid even if the prime contractor does not pay them, which also shields the owner from liens. Completion of the work is the separate performance bond.",
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
  },
  {
    id: "pc-006",
    domain: "procurement",
    q: "A change to the bidding documents issued to all bidders BEFORE bids are opened is called:",
    choices: ["A change order", "An addendum", "A submittal", "A field directive"],
    answer: 1,
    explain:
      "An addendum revises the bid documents before bids come in, so every bidder prices the same scope. A change order only exists after a contract is signed. Mixing these two up is a classic exam trap.",
    cite: "NASCLA Guide, Ch. 6 - Bid Documents (p. 6-1)",
  },
  {
    id: "pc-007",
    domain: "procurement",
    q: "Liquidated damages in a contract are:",
    choices: [
      "A bonus paid for finishing early",
      "A pre-agreed amount owed for each day the project finishes late",
      "The cost of materials damaged on site",
      "Money withheld for defective work",
    ],
    answer: 1,
    explain:
      "Liquidated damages set a fixed daily dollar amount for late completion, agreed up front so the owner does not have to prove actual losses. They are about time, not defects or damaged material.",
    cite: "NASCLA Guide, Ch. 7 - Breach of Contract, liquidated damages (p. 7-4)",
  },
  {
    id: "pc-008",
    domain: "procurement",
    q: "A subcontractor who is not paid for labor and materials furnished to a project may secure the debt by filing:",
    choices: ["A performance bond", "A mechanic's lien", "A change order", "An addendum"],
    answer: 1,
    explain:
      "A mechanic's (or construction) lien places a claim against the improved property for unpaid labor or materials. Strict notice and filing deadlines apply, which is why prompt paperwork matters.",
    cite: "NASCLA Guide, Ch. 7 - Contract Management (lien laws)",
  },
  {
    id: "pc-009",
    domain: "procurement",
    q: "Shop drawings and product data the contractor sends to the design team for approval before fabrication are called:",
    choices: ["Submittals", "As-builts", "Change orders", "Punch lists"],
    answer: 0,
    explain:
      "Submittals (shop drawings, product data, samples) let the architect or engineer confirm what will be installed matches the design intent before anything is ordered or built. As-builts are recorded after construction.",
    cite: "NASCLA Guide, Ch. 8 - Detailed Shop Drawings (p. 8-10)",
  },
  {
    id: "pc-010",
    domain: "procurement",
    q: "The document by which the owner authorizes the contractor to begin work, often starting the contract time, is the:",
    choices: ["Notice to proceed", "Certificate of occupancy", "Punch list", "Lien waiver"],
    answer: 0,
    explain:
      "The notice to proceed is the owner's official go-ahead, and the contract clock usually starts on its date. A certificate of occupancy comes at the end, when the building may be used.",
    cite: "NASCLA Guide, Ch. 8 - Contract Award (p. 8-8)",
  },
  {
    id: "pc-011",
    domain: "procurement",
    q: "Under a lump-sum (fixed-price) contract, who generally bears the risk of cost overruns?",
    choices: ["The owner", "The contractor", "The architect", "The surety"],
    answer: 1,
    explain:
      "In a lump-sum contract the contractor agrees to a fixed price and assumes the risk of extra costs - but also keeps any savings. If materials or labor run over, the contractor absorbs it, not the owner.",
    cite: "NASCLA Guide, Ch. 7 - Lump-Sum Contract (p. 7-5)",
  },
  {
    id: "pc-012",
    domain: "procurement",
    q: "Under a cost-plus contract, the contractor is paid:",
    choices: [
      "A single fixed price agreed before work begins",
      "The actual cost of labor and materials plus a markup fee",
      "A set price per unit of work installed",
      "Only for materials, with labor donated",
    ],
    answer: 1,
    explain:
      "Cost-plus reimburses the contractor for actual labor and material costs and adds a markup - a percentage or a fixed fee - for overhead and profit. It shifts more of the cost risk toward the owner.",
    cite: "NASCLA Guide, Ch. 7 - Cost-Plus Contract (p. 7-6)",
  },
  {
    id: "pc-013",
    domain: "procurement",
    q: "A unit-price contract is the best fit when:",
    choices: [
      "The full scope and quantities are known precisely in advance",
      "The exact quantities of work cannot be determined in advance",
      "The owner wants one guaranteed total price",
      "The job has no measurable quantities",
    ],
    answer: 1,
    explain:
      "Unit-price sets a price per unit - per cubic yard, per linear foot - and the contractor is paid for the actual quantities used. It fits work like excavation where you cannot pin down exact quantities up front.",
    cite: "NASCLA Guide, Ch. 7 - Unit-Price Contract (p. 7-6)",
  },
  {
    id: "pc-014",
    domain: "procurement",
    q: "Under the design/build delivery method, the owner:",
    choices: [
      "Hires the designer and the builder under two separate contracts",
      "Contracts with a single entity responsible for both design and construction",
      "Acts as their own general contractor",
      "Contracts only for design, then self-performs construction",
    ],
    answer: 1,
    explain:
      "Design/build gives the owner one point of responsibility - a single company handles design through construction. That differs from the traditional single-prime method, where design and construction are separate contracts.",
    cite: "NASCLA Guide, Ch. 7 - Design/Build (p. 7-6)",
  },
  {
    id: "pc-015",
    domain: "procurement",
    q: "How does binding arbitration differ from mediation?",
    choices: [
      "Arbitration is always free; mediation is not",
      "In arbitration the arbitrator issues a legally binding decision, while a mediator cannot impose one",
      "Mediation always takes place in a courtroom",
      "Arbitration cannot be used for construction disputes",
    ],
    answer: 1,
    explain:
      "An arbitrator acts like a private judge and issues a binding decision. A mediator is only a neutral facilitator who helps the parties reach their own agreement and cannot force an outcome.",
    cite: "NASCLA Guide, Ch. 7 - Alternative Dispute Resolution (p. 7-8)",
  },
  {
    id: "pc-016",
    domain: "procurement",
    q: "Among the common forms of alternative dispute resolution, which is generally the first and least formal step?",
    choices: ["Litigation", "Arbitration", "Negotiation", "A jury trial"],
    answer: 2,
    explain:
      "Negotiation - the parties talking directly to reach agreement - is the simplest, cheapest first step. If it fails, disputes typically move to mediation, then arbitration, with court as the last resort.",
    cite: "NASCLA Guide, Ch. 7 - Alternative Dispute Resolution (p. 7-7)",
  },
  {
    id: "pc-017",
    domain: "procurement",
    q: "The most reliable way to get a substitute product accepted on a project is to:",
    choices: [
      "Install it and ask forgiveness later",
      "Obtain prior approval during the bid stage",
      "Substitute it only after final inspection",
      "Pick any product of a lower price",
    ],
    answer: 1,
    explain:
      "Getting a substitution approved during the bid stage - the 'or equal' / prior-approval process - keeps the playing field level for all bidders and protects you. Substituting on your own after the fact risks rejection and rework.",
    cite: "NASCLA Guide, Ch. 7 - Making Substitutions (p. 7-8)",
  },
  {
    id: "pc-018",
    domain: "procurement",
    q: "If a contract provision is ambiguous and the parties dispute its meaning, courts will most often interpret it:",
    choices: [
      "In favor of whichever party is larger",
      "Against the party who drafted the contract",
      "In favor of the contractor automatically",
      "By ignoring the ambiguous clause entirely",
    ],
    answer: 1,
    explain:
      "When wording is genuinely unclear, the interpretation generally goes against the party who wrote it. That is why drafting in plain, precise language protects you - vague terms get read in the other side's favor.",
    cite: "NASCLA Guide, Ch. 7 - Legal Interpretation (p. 7-10)",
  },
  {
    id: "pc-019",
    domain: "procurement",
    q: "Which agreement generally must be in writing to be legally enforceable?",
    choices: [
      "A quick change to a paint color",
      "The sale or purchase of land",
      "A verbal instruction to a crew member",
      "A handshake on lunch plans",
    ],
    answer: 1,
    explain:
      "Oral agreements can be binding, but some - notably the sale or purchase of land - must be in writing to be enforceable. In general, putting construction agreements in writing is far safer than a handshake.",
    cite: "NASCLA Guide, Ch. 7 - Are Oral Agreements Legally Binding? (p. 7-9)",
  },
  {
    id: "pc-020",
    domain: "procurement",
    q: "In contract law, 'consideration' means:",
    choices: [
      "Being polite during negotiations",
      "Each party gives up something of value in an exchange",
      "The time taken to think over an offer",
      "The contractor's profit margin",
    ],
    answer: 1,
    explain:
      "Consideration is the exchange - both parties must give up something of value, such as money for services. Without it there is no binding contract, only a one-sided promise.",
    cite: "NASCLA Guide, Ch. 7 - Consideration (p. 7-2)",
  },
  {
    id: "pc-021",
    domain: "procurement",
    q: "A contract may be voidable because a party lacked legal capacity if that party was:",
    choices: [
      "An experienced contractor",
      "A minor, or someone mentally incompetent or under the influence of drugs or alcohol",
      "A licensed architect",
      "A corporation",
    ],
    answer: 1,
    explain:
      "Competent parties must be of legal age and sound mind. Minors, the mentally incompetent, and people under the influence may lack the capacity to be bound, so the contract can be voided.",
    cite: "NASCLA Guide, Ch. 7 - Competent Parties (p. 7-2)",
  },
  {
    id: "pc-022",
    domain: "procurement",
    q: "Which of the following is NOT one of the four required elements of a binding contract?",
    choices: [
      "Offer and acceptance",
      "Consideration",
      "A profit margin of at least 10 percent",
      "Legal purpose",
    ],
    answer: 2,
    explain:
      "The four elements are offer and acceptance, consideration, competent parties, and legal purpose. A specific profit margin is a business decision, not a legal requirement for a contract to be binding.",
    cite: "NASCLA Guide, Ch. 7 - Required Contract Elements (p. 7-1)",
  },
  {
    id: "pc-023",
    domain: "procurement",
    q: "A maintenance bond guarantees that:",
    choices: [
      "The contractor submitted the lowest bid",
      "For a stated period (typically one year), no defective workmanship or material will appear in the completed project",
      "Subcontractors will be paid",
      "The owner will make progress payments on time",
    ],
    answer: 1,
    explain:
      "A maintenance bond backs the quality of the finished work - if defective workmanship or materials show up within the stated period (often one year), it's covered. Paying subs is the payment bond; finishing the job is the performance bond.",
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
  },
  {
    id: "pc-024",
    domain: "procurement",
    q: "A completion bond provides assurance primarily to:",
    choices: [
      "The subcontractors",
      "The financial backers (lender) of a project that it will be completed",
      "The contractor's employees",
      "The building inspector",
    ],
    answer: 1,
    explain:
      "A completion bond assures the project's financial backers - the lender - that construction will be finished. It is aimed at whoever is funding the job, not the subs or the workers.",
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
  },
  {
    id: "pc-025",
    domain: "procurement",
    q: "A fidelity bond protects a business owner against:",
    choices: [
      "Weather delays",
      "Losses caused by dishonest acts of their own employees",
      "Defective materials from suppliers",
      "Nonpayment by the owner",
    ],
    answer: 1,
    explain:
      "A fidelity bond covers losses from employee dishonesty - theft or fraud by your own people. Contrast it with burglary and theft insurance, which covers outside acts but NOT employee acts.",
    cite: "NASCLA Guide, Ch. 3 - Types of Bonds (p. 3-7)",
  },
  {
    id: "pc-026",
    domain: "procurement",
    q: "Under the federal Miller Act, performance and payment bonds are required on federal construction projects valued at more than:",
    choices: ["$25,000", "$50,000", "$100,000", "$500,000"],
    answer: 2,
    explain:
      "The Miller Act requires performance and payment bonds on federal construction contracts greater than $100,000. It is the federal bonding law and a favorite exam fact.",
    cite: "NASCLA Guide, Ch. 3 - Laws Governing Bonding of Federal Construction Projects (p. 3-8)",
  },
  {
    id: "pc-027",
    domain: "procurement",
    q: "Under the Miller Act, the performance bond is normally required in an amount equal to what percent of the contract price?",
    choices: ["25 percent", "50 percent", "75 percent", "100 percent"],
    answer: 3,
    explain:
      "The Miller Act performance bond is normally 100 percent of the contracted price - the contracting officer sets an amount regarded as adequate, and that is typically the full contract value.",
    cite: "NASCLA Guide, Ch. 3 - Laws Governing Bonding of Federal Construction Projects (p. 3-8)",
  },
  {
    id: "pc-028",
    domain: "procurement",
    q: "State laws that require surety bonds on state and local public works projects, modeled on the federal Miller Act, are commonly called:",
    choices: ["Little Miller Acts", "Lien laws", "Right-to-work laws", "Prompt payment acts"],
    answer: 0,
    explain:
      "Most states have their own bonding laws for public works, patterned on the federal Miller Act - the 'Little Miller Acts.' They extend bond protection to state and local government jobs.",
    cite: "NASCLA Guide, Ch. 3 - Laws Governing Bonding of Federal Construction Projects (p. 3-8)",
  },
  {
    id: "pc-029",
    domain: "procurement",
    q: "The premium (cost) to obtain a construction bond typically runs about what share of the contract amount?",
    choices: [
      "Half a percent to two percent",
      "Five to ten percent",
      "Fifteen to twenty percent",
      "Twenty-five percent",
    ],
    answer: 0,
    explain:
      "Bond premiums usually range from about one-half of one percent up to two percent of the contract amount, priced on the contractor's risk. It is a small fraction of the job, not a double-digit cost.",
    cite: "NASCLA Guide, Ch. 3 - Bond Language (p. 3-7)",
  },
  {
    id: "pc-030",
    domain: "procurement",
    q: "When deciding whether to issue a bond, a surety company evaluates all of the following EXCEPT:",
    choices: [
      "The contractor's financial stability and credit",
      "The contractor's experience and equipment",
      "The contractor's references",
      "The color of the contractor's trucks",
    ],
    answer: 3,
    explain:
      "A surety underwrites the contractor: financial stability, credit, references, experience, and equipment to complete the work. Cosmetic things like vehicle color have nothing to do with it.",
    cite: "NASCLA Guide, Ch. 3 - Qualifying for a Bond (p. 3-7)",
  },
  {
    id: "pc-031",
    domain: "procurement",
    q: "How does a bank letter of credit differ from a bid bond?",
    choices: [
      "It is issued by a surety company",
      "It is a bank cash guarantee that customarily covers only 5 to 10 percent of the contract, not a bond",
      "It always covers 100 percent of the contract",
      "It guarantees the work will be free of defects",
    ],
    answer: 1,
    explain:
      "A bank letter of credit is not a bond - it is a bank-backed cash guarantee, and it customarily covers only 5 to 10 percent of the contract rather than the full amount.",
    cite: "NASCLA Guide, Ch. 3 - Bond Language (p. 3-7)",
  },
  {
    id: "pc-032",
    domain: "procurement",
    q: "Commercial General Liability (CGL) insurance covers which of the following?",
    choices: [
      "Damage to the contractor's own tools",
      "Bodily injury and property damage to third parties, plus personal and advertising injury",
      "Employee injuries on the job",
      "The contractor's lost income during a shutdown",
    ],
    answer: 1,
    explain:
      "CGL is the core liability policy: third-party bodily injury and property damage, plus personal injury (like slander) and advertising injury. On-the-job employee injuries are workers' comp, not CGL.",
    cite: "NASCLA Guide, Ch. 3 - Commercial General Liability (CGL) (p. 3-4)",
  },
  {
    id: "pc-033",
    domain: "procurement",
    q: "All-risk builder's risk insurance primarily covers:",
    choices: [
      "Employee injuries",
      "The structure under construction plus its materials and fixtures",
      "The contractor's vehicles",
      "Legal defense costs in a lawsuit",
    ],
    answer: 1,
    explain:
      "Builder's risk (all-risk) covers the building under construction along with materials, equipment, and fixtures against loss - fire, theft, vandalism, weather. It protects the work in progress, not people or autos.",
    cite: "NASCLA Guide, Ch. 3 - All-Risk Builder's Risk Insurance (p. 3-3)",
  },
  {
    id: "pc-034",
    domain: "procurement",
    q: "Workers' compensation insurance premiums are:",
    choices: [
      "Split evenly between employer and employee",
      "Paid entirely by the employer, with no part deducted from the employee's pay",
      "Deducted from the employee's paycheck",
      "Optional in every state",
    ],
    answer: 1,
    explain:
      "Workers' comp is employer-paid - no part comes out of the employee's wages - and it is required by law. It covers employees injured on the job regardless of fault.",
    cite: "NASCLA Guide, Ch. 3 - Workers' Compensation Insurance (p. 3-5)",
  },
  {
    id: "pc-035",
    domain: "procurement",
    q: "An umbrella liability policy is used to:",
    choices: [
      "Replace the need for any CGL policy",
      "Supplement and extend coverage above the limits of the CGL policy",
      "Cover only company vehicles",
      "Insure the building during construction",
    ],
    answer: 1,
    explain:
      "Umbrella liability sits on top of the CGL, kicking in once that policy's limit is reached to add another layer of protection. It supplements the CGL rather than replacing it.",
    cite: "NASCLA Guide, Ch. 3 - Umbrella Liability Insurance (p. 3-4)",
  },
  // ---- General Requirements & Safety ---------------------------
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
      "The definition (29 CFR 1926.32(f)) has two prongs: capable of identifying hazards and authorized to correct them. Training and experience help, but neither is the definition.",
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
    cite: "NASCLA Guide, Ch. 8 - Critical Path Method (p. 8-5)",
  },
  {
    id: "gr-004",
    domain: "general",
    q: "On a supported scaffold, OSHA generally requires fall protection for workers at a height above:",
    choices: ["4 feet", "6 feet", "10 feet", "15 feet"],
    answer: 2,
    explain:
      "Scaffolds have their own trigger: 10 feet (29 CFR 1926.451(g)). Don't confuse it with the 6-foot general fall-protection height - the exam likes to see if you know scaffolds are the exception.",
    cite: "OSHA 29 CFR 1926, Subpart L",
  },
  {
    id: "gr-005",
    domain: "general",
    q: "Under OSHA's Hazard Communication standard, information on a hazardous chemical's hazards and safe handling is found on its:",
    choices: [
      "Safety Data Sheet (SDS)",
      "Bill of lading",
      "Certificate of occupancy",
      "Submittal log",
    ],
    answer: 0,
    explain:
      "Every hazardous chemical on site must have an accessible Safety Data Sheet (SDS) covering hazards, PPE, first aid, and handling. Workers have the right to review them at any time.",
    cite: "NASCLA Guide, Ch. 11 - Safety Data Sheets (SDS) (p. 11-6)",
  },
  {
    id: "gr-006",
    domain: "general",
    q: "In scheduling, the amount of time an activity can be delayed without delaying the project completion date is called:",
    choices: ["Lag", "Float (slack)", "Duration", "Lead"],
    answer: 1,
    explain:
      "Float (or slack) is the wiggle room a non-critical activity has before it starts pushing the finish date. Critical-path activities have zero float, which is what makes them critical.",
    cite: "NASCLA Guide, Ch. 8 - Scheduling Methods (p. 8-2)",
  },
  {
    id: "gr-007",
    domain: "general",
    q: "A bar chart (Gantt chart) schedule displays project activities as:",
    choices: [
      "A network of nodes and arrows showing every dependency",
      "Horizontal bars plotted against a timeline",
      "A pie chart of cost percentages",
      "A list of subcontractor phone numbers",
    ],
    answer: 1,
    explain:
      "A bar (Gantt) chart shows each activity as a horizontal bar along a calendar timeline - easy to read at a glance. It is simpler than a critical-path network, which is built to show the dependencies between activities.",
    cite: "NASCLA Guide, Ch. 8 - Scheduling Methods (p. 8-4)",
  },
  {
    id: "gr-008",
    domain: "general",
    q: "Contingency time in a construction schedule is:",
    choices: [
      "Extra time added for unexpected delays or problems",
      "The time spent on the critical path",
      "Overtime paid to workers",
      "The warranty period after completion",
    ],
    answer: 0,
    explain:
      "Contingency time is built-in cushion for the unexpected - weather, delivery slips, surprises. It keeps one hiccup from blowing the whole completion date.",
    cite: "NASCLA Guide, Ch. 8 - Scheduling (p. 8-5)",
  },
  {
    id: "gr-009",
    domain: "general",
    q: "A daily report on a construction project typically records:",
    choices: [
      "Only the final cost of the job",
      "Weather, labor on site, work performed, and deliveries for that day",
      "The owner's personal schedule",
      "Next year's marketing plan",
    ],
    answer: 1,
    explain:
      "Daily reports document what happened on site each day - weather, crews present, work done, deliveries, delays. They are the paper trail that protects you in disputes and claims.",
    cite: "NASCLA Guide, Ch. 8 - Tracking the Progress of the Project (p. 8-9)",
  },
  {
    id: "gr-010",
    domain: "general",
    q: "A certificate of occupancy is issued:",
    choices: [
      "Before construction begins",
      "At project closeout, allowing the building to be legally occupied",
      "When the bid is accepted",
      "Only for federal projects",
    ],
    answer: 1,
    explain:
      "The certificate of occupancy comes at the end - it certifies the building meets code and may be occupied. The notice to proceed is what kicks the job off at the start.",
    cite: "NASCLA Guide, Ch. 8 - Job Completion and Closeout (p. 8-9)",
  },
  {
    id: "gr-011",
    domain: "general",
    q: "In construction project management, quality assurance refers to:",
    choices: [
      "Inspecting only the finished product",
      "The planned system of processes used to ensure work meets required standards",
      "The lowest-cost way to build",
      "A type of insurance policy",
    ],
    answer: 1,
    explain:
      "Quality assurance is the proactive system - procedures, submittals, checks - set up to make sure the work meets spec. It is about preventing defects through process, not just catching them at the end.",
    cite: "NASCLA Guide, Ch. 8 - Quality Assurance (p. 8-10)",
  },
  {
    id: "gr-012",
    domain: "general",
    q: "Why is cash flow management critical during a construction project?",
    choices: [
      "It determines the color scheme",
      "Expenses often come due before progress payments arrive, so the contractor must manage the timing",
      "It sets the OSHA penalty amount",
      "It replaces the need for a schedule",
    ],
    answer: 1,
    explain:
      "Contractors routinely pay for labor and materials before the owner's progress payment lands. Managing that timing gap is what keeps a profitable job from running out of cash mid-project.",
    cite: "NASCLA Guide, Ch. 8 - Cash Management (p. 8-6)",
  },
  {
    id: "gr-013",
    domain: "general",
    q: "The federal agency that sets and enforces workplace safety standards, created by the Occupational Safety and Health Act of 1970, is:",
    choices: ["The EPA", "OSHA", "The SBA", "The NLRB"],
    answer: 1,
    explain:
      "OSHA - the Occupational Safety and Health Administration - was established by the OSH Act of 1970 to set and enforce workplace safety standards. The EPA handles environmental matters, a different lane.",
    cite: "NASCLA Guide, Ch. 11 - Safety Standards (p. 11-1)",
  },
  {
    id: "gr-014",
    domain: "general",
    q: "OSHA's safety and health regulations specifically for the construction industry are found in:",
    choices: ["29 CFR 1910", "29 CFR 1926", "29 CFR 1904", "the Miller Act"],
    answer: 1,
    explain:
      "29 CFR 1926 is the construction standard. 29 CFR 1910 is general industry and 1904 covers injury recordkeeping - a classic set of look-alike distractors.",
    cite: "NASCLA Guide, Ch. 11 - Safety Standards (p. 11-1)",
  },
  {
    id: "gr-015",
    domain: "general",
    q: "An Experience Modification Rating (EMR) above 1.0 means a contractor:",
    choices: [
      "Has a better-than-average safety record and lower premiums",
      "Has a worse-than-average safety record and pays higher insurance premiums",
      "Is exempt from OSHA inspections",
      "Has completed OSHA 30 training",
    ],
    answer: 1,
    explain:
      "The EMR benchmarks a contractor's safety losses against average (1.0). Above 1.0 is worse than average and drives premiums up - and owners often screen out high-EMR contractors when awarding work.",
    cite: "NASCLA Guide, Ch. 11 - Safety Standards (p. 11-1)",
  },
  {
    id: "gr-016",
    domain: "general",
    q: "Which OSHA form is the log used to record work-related injuries and illnesses?",
    choices: ["Form 300", "Form 300A", "Form 301", "Form 1926"],
    answer: 0,
    explain:
      "OSHA Form 300 is the running log of recordable injuries and illnesses. Form 300A is the annual summary that gets posted, and Form 301 is the individual incident report.",
    cite: "NASCLA Guide, Ch. 11 - OSHA Recordkeeping (p. 11-4)",
  },
  {
    id: "gr-017",
    domain: "general",
    q: "Which OSHA violation type carries the most severe penalties, applying when an employer knowingly or with plain indifference commits a violation?",
    choices: ["Other-than-serious", "De minimis", "Willful", "Failure to abate"],
    answer: 2,
    explain:
      "A willful violation - knowing, or in plain indifference to the law - carries the steepest penalties (up to $156,259 per violation, and possible criminal charges if a death results). Other-than-serious and de minimis are the mild end.",
    cite: "NASCLA Guide, Ch. 11 - Penalties (p. 11-8)",
  },
  {
    id: "gr-018",
    domain: "general",
    q: "An employee who believes they were punished for reporting a safety concern to OSHA must file a discrimination complaint within how many days?",
    choices: ["10 days", "30 days", "90 days", "One year"],
    answer: 1,
    explain:
      "Retaliation against workers who exercise their OSHA rights is prohibited, and the employee must notify OSHA within 30 days of the discriminatory action for it to investigate.",
    cite: "NASCLA Guide, Ch. 11 - Employee Rights (p. 11-7)",
  },
  {
    id: "gr-019",
    domain: "general",
    q: "When working near overhead power lines, OSHA guidance is to keep workers and equipment at least how far away?",
    choices: ["3 feet", "6 feet", "10 feet", "25 feet"],
    answer: 2,
    explain:
      "Stay at least 10 feet from overhead power lines, and always assume the lines are energized until the utility confirms otherwise. Contact is a leading cause of jobsite electrocutions.",
    cite: "NASCLA Guide, Ch. 11 - Overhead Power Line Safety (p. 11-6)",
  },
  {
    id: "gr-020",
    domain: "general",
    q: "Before excavating, a contractor should identify underground utilities by:",
    choices: [
      "Digging a small test hole first",
      "Calling 811 / the One Call Center to have utilities located",
      "Checking the weather forecast",
      "Notifying OSHA",
    ],
    answer: 1,
    explain:
      "Call 811 (the One Call / Common Ground Alliance system) before you dig so utilities get marked. Excavating blind risks striking gas, power, or water lines - a safety and cost disaster.",
    cite: "NASCLA Guide, Ch. 11 - Underground Utility Safety (p. 11-6)",
  },
  {
    id: "gr-021",
    domain: "general",
    q: "The EPA's Renovation, Repair and Painting (RRP) Rule for lead-based paint applies to renovations of housing and child-occupied facilities built:",
    choices: ["Before 1978", "After 2000", "Before 1950 only", "In any year"],
    answer: 0,
    explain:
      "The RRP rule targets pre-1978 housing, because lead-based paint was banned for residential use in 1978. Renovators disturbing paint in those buildings must be certified and follow lead-safe work practices.",
    cite: "NASCLA Guide, Ch. 11 - Remodeling or Renovating with Lead-Based Paint (p. 11-13)",
  },
  {
    id: "gr-022",
    domain: "general",
    q: "Before renovating pre-1978 housing, federal law requires the contractor to give owners and occupants:",
    choices: [
      "A copy of the contractor's license",
      "The 'Protect Your Family From Lead in Your Home' pamphlet",
      "A performance bond",
      "An OSHA 300 log",
    ],
    answer: 1,
    explain:
      "The contractor must distribute the EPA pamphlet 'Protect Your Family From Lead in Your Home' and get confirmation of receipt before starting work on pre-1978 housing. It is a required notification, not optional.",
    cite: "NASCLA Guide, Ch. 11 - Remodeling or Renovating with Lead-Based Paint (p. 11-13)",
  },
  {
    id: "gr-023",
    domain: "general",
    q: "A construction site's stormwater discharges into U.S. waters are regulated under the Clean Water Act primarily through:",
    choices: [
      "An OSHA 300 log",
      "A National Pollutant Discharge Elimination System (NPDES) permit",
      "A performance bond",
      "The Miller Act",
    ],
    answer: 1,
    explain:
      "The NPDES permitting system controls stormwater discharges from construction sites under the Clean Water Act. Disturbing enough land triggers the need for a stormwater permit and erosion/sediment controls.",
    cite: "NASCLA Guide, Ch. 11 - National Pollutant Discharge Elimination System (p. 11-11)",
  },
  {
    id: "gr-024",
    domain: "general",
    q: "If a contractor discovers hazardous waste on a jobsite, they must notify state and local authorities or:",
    choices: [
      "The building's architect",
      "The National Response Center",
      "The bonding company",
      "The nearest hardware store",
    ],
    answer: 1,
    explain:
      "Discovering hazardous waste requires prompt notification to state/local authorities or the National Response Center. The waste must then be treated and disposed of at a permitted facility - you cannot just haul it off.",
    cite: "NASCLA Guide, Ch. 11 - Hazardous Substances (p. 11-12)",
  },
  // ---- Site Construction ---------------------------------------
  {
    id: "sc-001",
    domain: "site",
    q: "Under OSHA, a trench must have a protective system (sloping, shoring, or a box) once it reaches what depth, unless it is entirely in stable rock?",
    choices: ["3 feet", "4 feet", "5 feet", "6 feet"],
    answer: 2,
    explain:
      "Excavations 5 feet deep or more require a protective system (29 CFR 1926.652). At 4 feet, remember the separate rule: a means of egress within 25 feet of lateral travel.",
    cite: "OSHA 29 CFR 1926, Subpart P",
  },
  {
    id: "sc-002",
    domain: "site",
    q: "Excavated spoil and other materials must be kept back from the edge of a trench by at least:",
    choices: ["6 inches", "1 foot", "2 feet", "5 feet"],
    answer: 2,
    explain:
      "Spoil piles and equipment must sit at least 2 feet from the trench edge (29 CFR 1926.651(j)), so material can't roll back in on workers and the added surcharge load can't collapse the wall.",
    cite: "OSHA 29 CFR 1926, Subpart P",
  },
  {
    id: "sc-003",
    domain: "site",
    q: "In OSHA's soil classification for excavations, which soil type is the LEAST stable?",
    choices: ["Stable rock", "Type A", "Type B", "Type C"],
    answer: 3,
    explain:
      "Type C is the least stable (for example, gravel, sand, or submerged soil) and needs the flattest sloping or the most robust protective system. Stable rock is the most stable; Type A is cohesive like clay.",
    cite: "OSHA 29 CFR 1926, Subpart P, Appendix A",
  },
  // ---- Concrete ------------------------------------------------
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
      "Strength comes from cement hydration, which needs water and workable temperatures over time. Letting concrete dry out early stops hydration and permanently costs strength - curing keeps water in, not out.",
    cite: "Contractor's Guide to Quality Concrete Construction",
  },
  {
    id: "co-002",
    domain: "concrete",
    q: "A slump test on fresh concrete measures its:",
    choices: [
      "Compressive strength",
      "Consistency and workability",
      "Air content",
      "Cure time",
    ],
    answer: 1,
    explain:
      "The slump test gauges how stiff or fluid the fresh mix is - its workability. Compressive strength is measured later by breaking cured cylinders, not at the chute.",
    cite: "Contractor's Guide to Quality Concrete Construction",
  },
  {
    id: "co-003",
    domain: "concrete",
    q: "For a given set of materials, lowering the water-to-cement ratio of a concrete mix generally:",
    choices: [
      "Lowers its strength",
      "Increases its strength",
      "Has no effect on strength",
      "Increases slump",
    ],
    answer: 1,
    explain:
      "A lower water-cement ratio yields denser, stronger concrete. Adding water on site to make placement easier is the fastest way to weaken a slab - it raises the ratio and cuts strength.",
    cite: "Contractor's Guide to Quality Concrete Construction",
  },
  // ---- Metals --------------------------------------------------
  {
    id: "me-001",
    domain: "metals",
    q: "A reinforcing bar marked #4 has a nominal diameter of:",
    choices: ["1/4 inch", "3/8 inch", "1/2 inch", "5/8 inch"],
    answer: 2,
    explain:
      "Rebar sizes count in eighths of an inch, so #4 is 4/8 = 1/2 inch. A #8 bar is 8/8 = 1 inch. Knowing the eighths rule lets you size any bar fast.",
    cite: "Placing Reinforcing Bars (CRSI)",
  },
  {
    id: "me-002",
    domain: "metals",
    q: "Deformations (ridges) rolled onto reinforcing bars are there mainly to:",
    choices: [
      "Make the bars easier to cut",
      "Improve the bond between the steel and the surrounding concrete",
      "Reduce the weight of the bar",
      "Prevent the steel from rusting",
    ],
    answer: 1,
    explain:
      "The ribs lock the bar into the concrete so the two act together under load. Smooth bars would pull out. Corrosion is handled by cover and coatings, not the deformations.",
    cite: "Placing Reinforcing Bars (CRSI)",
  },
  // ---- Mechanical & Plumbing -----------------------------------
  {
    id: "mp-001",
    domain: "mep",
    q: "The main job of a P-trap under a plumbing fixture is to:",
    choices: [
      "Increase water pressure",
      "Hold a water seal that blocks sewer gas from entering the building",
      "Filter debris out of the drain",
      "Slow the flow of waste water",
    ],
    answer: 1,
    explain:
      "The bend in a P-trap keeps a plug of water that seals off sewer gases from coming back up through the fixture. Every fixture connected to the drain system needs one.",
    cite: "NASCLA Contractors Guide, Mechanical & Plumbing systems",
  },
  {
    id: "mp-002",
    domain: "mep",
    q: "A backflow preventer is installed to:",
    choices: [
      "Boost hot water recovery",
      "Keep contaminated water from being drawn back into the potable water supply",
      "Reduce noise in supply lines",
      "Trap sewer gas at the fixture",
    ],
    answer: 1,
    explain:
      "A backflow preventer stops reverse flow that could pull contaminants into the clean water supply during a pressure drop. Sewer-gas blocking at the fixture is the trap's job, not the backflow device.",
    cite: "NASCLA Contractors Guide, Mechanical & Plumbing systems",
  },
  // ---- Wood ----------------------------------------------------
  {
    id: "wd-001",
    domain: "wood",
    q: "A piece of lumber sold as a nominal 2x4 has an actual dry, surfaced size of about:",
    choices: ['2" x 4"', '1-1/2" x 3-1/2"', '1-3/4" x 3-3/4"', '1-1/2" x 4"'],
    answer: 1,
    explain:
      "Nominal is the rough-cut call-out; the finished, dried board is smaller - a 2x4 is actually 1-1/2 by 3-1/2 inches. Estimating from nominal instead of actual dimensions throws off layout and material counts.",
    cite: "Carpentry & Building Construction",
  },
  {
    id: "wd-002",
    domain: "wood",
    q: "In wood framing, the structural member that carries the load across the top of a door or window opening is the:",
    choices: ["Sill", "Header", "Jack stud", "Sole plate"],
    answer: 1,
    explain:
      "The header spans the opening and carries the loads above it down to the jack (trimmer) studs on each side. The sill is at the bottom of a window opening; the sole plate runs along the floor.",
    cite: "Carpentry & Building Construction",
  },
  // ---- Thermal & Moisture Protection ---------------------------
  {
    id: "tm-001",
    domain: "thermal",
    q: "The R-value of insulation is a measure of its:",
    choices: [
      "Fire resistance",
      "Resistance to heat flow",
      "Weight per square foot",
      "Moisture absorption",
    ],
    answer: 1,
    explain:
      "R-value rates how well a material resists heat flow - the higher the R-value, the better the insulation. It says nothing about fire rating or weight.",
    cite: "NASCLA Contractors Guide, Thermal & Moisture Protection",
  },
  {
    id: "tm-002",
    domain: "thermal",
    q: "Flashing installed at roof and wall intersections is there to:",
    choices: [
      "Add structural support",
      "Direct water away from joints and prevent leaks",
      "Improve the building's insulation value",
      "Provide a nailing surface for siding",
    ],
    answer: 1,
    explain:
      "Flashing is a water-management detail: it channels water away from vulnerable joints and penetrations so it sheds off the building instead of soaking in. It is not structural or insulating.",
    cite: "NASCLA Contractors Guide, Thermal & Moisture Protection",
  },
  // ---- Finishes ------------------------------------------------
  {
    id: "fn-001",
    domain: "finishes",
    q: "Type X gypsum board is specified primarily because it provides:",
    choices: [
      "A moisture-resistant surface for showers",
      "Improved fire resistance",
      "A smoother surface for paint",
      "Greater sound absorption than any other board",
    ],
    answer: 1,
    explain:
      "Type X drywall has a core with additives that resist fire longer, so it is used in rated assemblies like garage walls and stairwells. Moisture resistance is a different product (often 'green board' or cement board).",
    cite: "Gypsum Construction Handbook",
  },
  {
    id: "fn-002",
    domain: "finishes",
    q: "In drywall finishing, the purpose of taping and applying joint compound over seams is to:",
    choices: [
      "Add fire resistance to the wall",
      "Create a smooth, continuous surface that hides the joints between panels",
      "Fasten the panels to the studs",
      "Increase the wall's insulation value",
    ],
    answer: 1,
    explain:
      "Tape and successive coats of joint compound bridge and conceal the seams so the finished wall reads as one flat plane. Screws or nails fasten the panels; the mud is cosmetic and crack-resistant, not structural.",
    cite: "Gypsum Construction Handbook",
  },
  // ---- Masonry -------------------------------------------------
  {
    id: "ma-001",
    domain: "masonry",
    q: "Among standard mortar types M, S, N, and O, which has the HIGHEST compressive strength?",
    choices: ["Type O", "Type N", "Type S", "Type M"],
    answer: 3,
    explain:
      "Type M is the strongest, used where high compressive strength or ground contact is needed. The order from strongest to weakest is M, S, N, O - remember the odd letters in 'MaSoN worK'.",
    cite: "Modern Masonry",
  },
  {
    id: "ma-002",
    domain: "masonry",
    q: "A standard concrete masonry unit (CMU) described as 8 x 8 x 16 is stated in its:",
    choices: [
      "Actual dimensions",
      "Nominal dimensions, which include a mortar joint",
      "Metric dimensions",
      "Weight in pounds",
    ],
    answer: 1,
    explain:
      "CMU are called out by nominal size; the actual block is about 3/8 inch smaller each way (7-5/8 x 7-5/8 x 15-5/8) so that with a 3/8-inch mortar joint it lays out on an 8-inch module.",
    cite: "Modern Masonry",
  },
  // ---- Doors, Windows & Glazing --------------------------------
  {
    id: "dw-001",
    domain: "doors",
    q: "Building codes require safety (tempered) glazing in locations such as doors and next to tubs and showers because tempered glass:",
    choices: [
      "Is cheaper than ordinary glass",
      "Breaks into small blunt pieces instead of large sharp shards",
      "Never breaks under impact",
      "Blocks more heat than ordinary glass",
    ],
    answer: 1,
    explain:
      "Tempered glass is heat-treated so that when it does break it crumbles into small, relatively harmless pieces rather than long knife-like shards - that is why code demands it in hazardous locations.",
    cite: "IBC Chapter 24, Glass and Glazing",
  },
  {
    id: "dw-002",
    domain: "doors",
    q: "For rooms with a high occupant load, egress doors are generally required to:",
    choices: [
      "Swing in the direction of exit travel",
      "Swing into the room",
      "Slide horizontally",
      "Be locked from the inside",
    ],
    answer: 0,
    explain:
      "Egress doors serving higher occupant loads must swing in the direction people travel to get out, so a crowd pushing to leave forces the door open rather than jamming it shut.",
    cite: "IBC Chapter 10, Means of Egress",
  },
  // ---- Electrical ----------------------------------------------
  {
    id: "el-001",
    domain: "electrical",
    q: "On construction sites, GFCI protection for receptacle outlets exists primarily to:",
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
  {
    id: "el-002",
    domain: "electrical",
    q: "Before servicing or repairing equipment that could unexpectedly energize, OSHA requires workers to follow:",
    choices: [
      "Lockout/tagout procedures",
      "A hot-work permit",
      "A fall-protection plan",
      "The confined-space entry program",
    ],
    answer: 0,
    explain:
      "Lockout/tagout de-energizes the equipment and physically locks the disconnect so it cannot be turned back on while someone is working on it. It is the core defense against unexpected startup and stored energy.",
    cite: "OSHA 29 CFR 1926, Subpart K / control of hazardous energy",
  },
];

// ============================================================
// END OF FILE - lib/foremanprep/bank.ts (v5 - +31 verified questions from Chapters 3, 8, 11)
// If you can see this comment, the paste was not truncated.
// ============================================================
