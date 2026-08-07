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
// END OF FILE - lib/foremanprep/bank.ts (v4 - +12 verified Chapter 7 Procurement questions)
// If you can see this comment, the paste was not truncated.
// ============================================================
