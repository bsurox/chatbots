// FILE: lib/foremanprep/bllessons.ts
import type { BlDomainKey } from "./blbank";

// ForemanPrep Business & Law drive-time lessons (v1). Ten
// spoken-word scripts, one per B&L domain, written in the same
// foreman voice as the GC lessons - every fact in these scripts
// also lives in a cited question in blbank v3 (which was audited
// against primary sources AND the NASCLA guide 14th edition in
// Aug 2026). State-specific numbers are deliberately absent:
// where the law varies, the script says so and points at the
// state packs. The audio-gen route (v6) reads these to generate
// lesson-<key>.mp3 files; the B&L audio page plays them. Minutes
// are estimates at a natural reading pace (~150 words a minute).

export type BlLesson = {
  key: BlDomainKey;
  title: string;
  minutes: number;
  script: string;
};

export const BL_LESSONS: BlLesson[] = [
  {
    key: "li",
    title: "Licensing & Business Organization",
    minutes: 4,
    script: `This is your Licensing and Business Organization lesson - how your company is built, and why the state cares.

Start with the structures. A sole proprietorship is you - legally inseparable from the business. Its debts are your debts, and your house and truck are exposed. A general partnership is worse than most people think: every general partner is personally liable for the partnership's obligations, including deals the OTHER partner signed. One partner can bind the partnership, and everybody is on the hook for the result.

The fix is a separate legal entity. A limited liability company - the LLC - gives you a corporate-style liability shield, and by default its profits pass straight through to the members' personal tax returns. One layer of tax, personal assets protected. That combination is why so many contractors run as LLCs. A C corporation shields owners too, but its profits can be taxed twice - once to the corporation, and again when they come out as dividends. An S corporation avoids the double tax by passing profits through, but with strings attached: a capped number of shareholders, limits on who can hold shares, and one class of stock.

A D B A - doing business as - is only a name registration. Smith Construction L L C can build as Summit Builders, but nothing changes about liability, taxes, or licensing. The entity behind the name is what matters. Every registered entity also names a registered agent - the person or company at an in-state address designated to receive lawsuits and official state mail. Let that lapse and you can eat a default judgment you never saw coming. And the E I N - your employer identification number - comes from the I R S, free, and it is the business's federal tax ID for payroll and returns.

Now licensing. The primary purpose of contractor licensing laws is to protect the public from unqualified or dishonest contractors. Not revenue, not limiting competition - consumer protection. Exams love that framing. Boards license the business through a qualifying party - the individual whose exam credential and experience satisfy the board on the company's behalf. If the qualifier leaves, most boards give you a set window to replace them. And working unlicensed where a license is required? Penalties, sure - but the sharpest tooth is that many states bar an unlicensed contractor from using the courts to collect payment for that work. Do the job, finish the job, and legally whistle for your money.

Last, the business plan. Nobody at the licensing board demands one - its purpose is to map how the company will operate, market, and stay financially viable, and to back up requests for financing. Lenders expect it; smart owners do the thinking either way.

Recap. Sole prop and general partnership - personal liability. LLC - shield plus pass-through. C corp - double tax. S corp - pass-through with limits. Licensing protects the public, through a qualifying party. No license, no courthouse. That is the backbone of this domain.`,
  },
  {
    key: "eb",
    title: "Estimating & Bidding",
    minutes: 4,
    script: `This is your Estimating and Bidding lesson - the math that decides whether you make money before the job ever starts.

First, know your costs. Direct costs can be traced to one specific job: the framing crew's wages, the lumber, the equipment on that site, the subs. Office rent, office staff, marketing - those serve every job at once, so they are overhead, and your estimates have to recover them through markup or the company quietly bleeds.

Labor never costs just the wage. Labor burden is the employer's added cost on top - payroll taxes, workers' compensation, benefits. A carpenter at twenty dollars an hour with a thirty-five percent burden really costs twenty times one point three five: twenty-seven dollars an hour. Estimate with bare wages and you understate labor on every line.

Now the trap that catches more contractors than any other: markup is not margin. Take an eighty-thousand-dollar cost and a twenty-five percent markup on cost - the bid is one hundred thousand. But the twenty thousand of gross profit is only twenty percent of the PRICE. A twenty-five percent markup produces a twenty percent margin, every time. Flip it around: if you WANT a twenty-five percent margin, you have to mark cost up by thirty-three percent. Margin equals markup divided by one plus the markup. Burn that in.

Overhead recovery is the same discipline. Expect one hundred fifty thousand of annual overhead against a million of annual direct cost, and every estimate carries fifteen percent on top of its direct costs - a hundred-thousand-dollar job absorbs fifteen thousand of overhead before profit even enters the room. Some companies run the rate against total revenue instead of direct cost - the arithmetic differs, but every job must carry its share either way.

Takeoff math. A hundred-sixty-foot wall with studs sixteen inches on center: convert to inches, divide by spacing - that is one hundred twenty spaces - then add the closing stud. One hundred twenty-one. Spaces plus one. Production rates turn quantities into time: five thousand square feet of tile at two hundred fifty a day is twenty crew-days, and the best rates come from your own job-cost history.

A few judgment calls. Contingency is a priced allowance for what you cannot see yet - weather, surprises, quantity variance. It is not profit, and hiding it in profit hides the risk it was built to absorb. A unit-price contract fits when final quantities are uncertain - excavation being the classic - the owner pays measured quantities at your bid unit rates. And before a subcontractor's low quote goes into your bid, scope-check it: confirm its inclusions and exclusions actually cover that trade's work. A low number with a hole in its scope is not low.

One ethics line: bid shopping - using one sub's confidential price to squeeze lower numbers out of others, before or after award. It poisons your sub relationships and some public work prohibits it outright.

Recap. Direct versus overhead. Burden on every wage. Markup is not margin - twenty-five gets you twenty. Overhead rate on every estimate. Spaces plus one. Contingency is not profit. Scope-check every quote.`,
  },
  {
    key: "ct",
    title: "Contracts",
    minutes: 4,
    script: `This is your Contracts lesson - the document that decides who carries the risk.

A contract needs offer and acceptance, consideration, capable parties, and a legal purpose. Notice what it does NOT need: notarization. That is a favorite wrong answer. Oral deals can bind, but agreements involving interests in real property generally must be in writing.

Contract types are really risk assignments. Lump sum: the price is fixed, so estimating misses and price spikes eat the CONTRACTOR'S margin - which is why lump-sum work demands complete scope and a careful estimate. Cost-plus reimburses your costs plus a fee, shifting risk to the owner. Add a guaranteed maximum price - a G M P - and the owner's exposure is capped: you absorb overruns past the ceiling, and savings below it are kept or shared as the contract says. Time and materials fits work nobody can scope in advance - emergencies - with the owner carrying most of the cost risk, which is why owners bolt on not-to-exceed limits.

Changes. The safest practice, and the exam answer, is a written, signed change order covering scope, price, and time BEFORE the changed work is performed. Oral changes can sometimes bind anyway - which is exactly why the disputes over them get ugly. The writing is protection, not formality.

Clauses to know cold. Liquidated damages: a fixed daily amount for late completion, enforceable when it is a reasonable advance estimate of the owner's delay losses - if it is really a punishment, courts can strike it. Indemnification shifts risk by agreement: one party promises to cover defined losses or claims of the other - and your insurance had better line up with what you promised. A flow-down clause binds the subcontractor to the prime by the same obligations the prime owes the owner, for the sub's scope - subs should read the prime contract they are inheriting.

Milestones with legal weight. Substantial completion is the point where the owner can occupy or use the project for its intended purpose - it commonly starts warranties and triggers retainage and final-payment clocks. Termination for convenience lets the owner end the job without contractor fault: you are paid for work properly performed plus reasonable wind-down costs, but generally not profit on work never performed.

Two doctrines that win claims. A Type One differing site condition means the ground materially differs from what the contract documents INDICATED - the borings said one thing, the site delivered another. Type Two covers unknown, unusual conditions the documents were silent about. And after the other side breaches, you still have a duty to mitigate - take reasonable steps to keep the damages from growing, because losses you could reasonably have avoided are generally not recoverable.

Recap. Four elements, no notary. Lump sum - your risk. G M P - capped owner risk. Change orders in writing, signed, first. Liquidated damages estimate, never punish. Substantial completion opens the building and starts the clocks. Mitigate your damages.`,
  },
  {
    key: "pj",
    title: "Project Management & Scheduling",
    minutes: 3,
    script: `This is your Project Management and Scheduling lesson - turning a contract into a finished building on time.

Start with C P M - the critical path method. The critical path is the LONGEST chain of dependent activities through the schedule, and its length IS the project duration. Everything on it carries zero float: slip a critical activity one day and the finish date slips a day. Float - slack - is the room everything else has: an activity with five days of float can slide five days before the end date moves. A simple Gantt bar chart is easy to read but silent about logic - it cannot show which bars push which, and that is exactly what C P M adds. Most schedule logic is finish-to-start: footings finish, then walls start. Milestones are zero-duration markers - dried-in, substantial completion - the scoreboard, not the work. And the two-to-three-week look-ahead schedule is where the superintendent turns the master plan into crews, materials, and coordination for what the field does next.

Now the paper that moves the money. The schedule of values breaks the contract sum into work items so each pay application can bill percent complete, line by line. Owners review it up front - front-load it and every draw becomes a fight. The pay-app math goes like this: a line worth fifty thousand dollars, sixty percent complete, earns thirty thousand; ten percent retainage holds back three thousand; twenty-seven thousand is payable. Earned value minus retainage, every draw, released at or near completion per the contract.

The information pipeline. An R F I gets written clarification of the contract documents - and keeps a record, because R F I answers become the basis for change orders when they move cost or time. Submittals - shop drawings, product data, samples - are reviewed BEFORE fabrication or installation, so nonconforming products get caught on paper where fixing them is cheap. Install ahead of an approved submittal and you have bought rework at your own expense.

The finish line. Near substantial completion the walk-through produces the punch list - the minor incomplete and corrective items standing between you and final completion, usually tied to final payment and retainage release. Closeout hands the owner what running the building requires: as-built drawings showing the work as actually constructed, operation and maintenance manuals, warranties, final lien waivers. Slow closeout is slow final payment - the paperwork is part of the work.

Recap. Critical path: longest chain, zero float, sets the duration. Schedule of values feeds the pay apps - earned value minus retainage. R F Is ask, submittals approve, as-builts record. Punch list, then closeout, then the last check.`,
  },
  {
    key: "ib",
    title: "Insurance & Bonding",
    minutes: 4,
    script: `This is your Insurance and Bonding lesson - who pays when things go wrong, and who vouches for you when they must not.

Insurance first, policy by policy. Commercial general liability - C G L - covers THIRD parties: the passerby hit by debris off your scaffold, the neighbor's property your operations damage. Your own injured employee is never a C G L claim - that is workers' compensation, the no-fault bargain: injured workers get defined benefits without proving anybody was at fault, and in exchange they generally cannot sue the employer. It is required for most construction employers in nearly every state - Texas being the famous elective exception - with thresholds that vary by state; your state pack has your numbers.

Builder's risk covers the structure itself while it is being built - fire, storm, theft of the half-finished building and typically materials on site. Property coverage, not liability, and the contract says who buys it. Your tools and equipment moving between jobs ride on an inland marine policy - an equipment floater that follows the gear wherever it goes. And the umbrella - excess liability - sits on top of your underlying policies: when a big claim burns through the primary limits, the umbrella's limits take over. Extra limits above your policies, never a replacement for them.

Two technical points that show up on exams. An occurrence policy responds based on WHEN the damage happened - a claim surfacing years later still lands on the policy that was in force back then, which matters for construction's long tail. And a certificate of insurance is a snapshot, not a policy: it proves coverage existed when issued, but rights come from the policy and its endorsements. If a G C needs protection under a sub's policy, it needs the additional insured ENDORSEMENT - which extends the sub's coverage to the G C for liability arising from the sub's work. Collecting certificates alone is a costly shortcut.

Now bonds - and hear this clearly: a bond is not insurance. It is a three-party guarantee. The principal is the contractor, the obligee is the party protected, and the surety backs the principal's obligation - and if the surety ever pays, it expects the contractor to pay it back under the indemnity agreement. Insurance transfers risk; suretyship extends credit.

The bid bond backs your bid - its penal sum is usually a percentage of the bid amount, commonly five to ten percent, set by the solicitation. On federal construction, the Miller Act requires performance and payment bonds on contracts exceeding one hundred fifty thousand dollars - the original hundred-thousand line was inflation-adjusted up in twenty-ten. The performance bond protects the government; the payment bond protects the subs and suppliers, who cannot lien federal property. States mirror it with their Little Miller Acts. And your bonding capacity comes from surety underwriting - capital, capacity, character - expressed as a single-project limit and an aggregate limit for all bonded work at once. Growing it is a financial-statement project.

Recap. C G L for third parties, comp for your people, builder's risk for the building, inland marine for the gear, umbrella on top. Certificates prove, endorsements grant. Bonds: three parties, credit not insurance, Miller Act at one hundred fifty thousand.`,
  },
  {
    key: "lb",
    title: "Labor & Employment Law",
    minutes: 4,
    script: `This is your Labor and Employment Law lesson - the rules that ride on every payroll.

Overtime first. Under the Fair Labor Standards Act, a nonexempt employee earns time and a half for hours over forty in a workweek. Federal law sets no daily overtime and no weekend premium - some states add their own - and employees cannot waive overtime by agreement. Being SALARIED alone exempts nobody: an exemption requires meeting the tests - salary basis PLUS executive, administrative, or professional duties. Misclassify someone as exempt and the back-overtime liability compounds quietly for years.

Same trap, different flavor: employee versus independent contractor. The I R S looks at behavioral control, financial control, and the relationship of the parties - substance beats labels, and a signed contractor agreement does not save a classification the facts contradict. Get it wrong and you owe back payroll taxes, penalties, and interest, plus exposure on overtime, workers' comp, and benefits. Agencies share data - one audit invites the others.

The hiring paperwork trio, which exams love to swap. The I nine verifies identity and authorization to work - every new hire completes one, citizens included, and verifying selectively is itself discrimination. The W four records the employee's federal income tax withholding elections. The W two reports annual wages. I nine authorizes, W four withholds, W two reports.

Federal statutes by headcount and situation. Title Seven of the Civil Rights Act bars employment discrimination based on race, color, religion, sex, or national origin - applying at fifteen or more employees, with related statutes covering age forty and over, and disability. The Family and Medical Leave Act gives eligible employees of covered employers - fifty or more - up to twelve weeks of UNPAID, job-protected leave for qualifying family and medical reasons. On covered federal construction, the Davis-Bacon Act requires paying at least local prevailing wages by craft, documented with weekly certified payrolls on form W H three forty-seven - a wage floor and paperwork regime, not a union mandate.

Young workers: under the federal child labor rules, workers under eighteen may not perform occupations declared hazardous - roofing, excavation, power-driven saws among them. Parental permission does not override the orders, and violations are penalized per minor.

Two housekeeping numbers. F L S A payroll records: keep at least three years, with wage-computation backup two years - many contractors just standardize on the longest clock they face. And your workers' comp premium is driven by payroll in each classification code multiplied by your experience modification rate - the E M R, your claims history scored against your industry. Safety pays twice: fewer injuries, and a lower mod on every payroll dollar.

Recap. Time and a half over forty. Exemptions need salary plus duties. Control tests decide contractor status. I nine, W four, W two - authorize, withhold, report. Davis-Bacon means prevailing wage plus certified payroll. No minors on hazardous work. Three years of payroll records. E M R runs your comp bill.`,
  },
  {
    key: "fm",
    title: "Financial Management",
    minutes: 4,
    script: `This is your Financial Management lesson - reading the numbers that decide whether the company lives.

The backbone is the accounting equation: assets equal liabilities plus owner's equity. Everything the company owns was financed by someone - creditors or owners - and every transaction keeps that equation true. The income statement and balance sheet split the story: the income statement is a movie, revenue and expenses across a period; the balance sheet is a photograph, what is owned and owed at one moment.

The health checks sureties and lenders read first. Current ratio: current assets over current liabilities - two hundred thousand over one hundred thousand is two point oh, the ability to pay bills coming due within the year. Working capital is the cushion itself: current assets MINUS current liabilities - and sureties size bonding programs partly on it. The quick ratio asks a harsher question by dropping inventory and other slow assets: could you pay near-term bills with just cash and receivables?

Accounting method matters. Accrual accounting records revenue when it is EARNED and expenses when incurred - that is what makes job profitability visible; cash-basis books only track money movement and can hide how jobs are really doing. On long-term contracts, the percentage-of-completion method recognizes revenue as the work progresses - commonly cost-to-cost: costs to date over total estimated cost. The completed-contract alternative defers everything to the end and whipsaws the income statement.

Construction's own vocabulary. Job costing ties every labor hour and invoice to the job that caused it - the early-warning system for this job and the database the next estimate is built from. Billings in excess of costs - overbilling - is a LIABILITY: you have collected for work not yet earned and still owe it in labor and materials. Costs in excess of billings - underbilling - is the asset-side twin, and heavy underbilling is a classic sign of trouble.

Now the margin math. Sell a job for five hundred thousand with four hundred ten thousand of direct cost: ninety thousand gross, which is eighteen percent of revenue. Gross profit still has to cover overhead before anything is net. Break-even revenue equals overhead divided by gross margin: carry one hundred twenty thousand of overhead at a twenty percent margin and you need six hundred thousand of revenue before the first dollar of net profit exists.

And the lesson contractors learn the hard way: profit is not cash. Construction pays late by design - you fund labor and materials now, bill later, collect later still, minus retainage - and growth widens the gap. A profitable contractor can absolutely fail for lack of cash. Cash flow projections, not the income statement, are what keep payroll clearing.

Recap. Assets equal liabilities plus equity. Current ratio, working capital, quick ratio - the health panel. Accrual shows the truth; percentage-of-completion earns as you build. Overbilling is a liability. Break-even is overhead over margin. Profit is not cash.`,
  },
  {
    key: "tx",
    title: "Taxes & Payroll",
    minutes: 4,
    script: `This is your Taxes and Payroll lesson - the money you collect for the government, and the trouble it causes when you keep it.

Start with who pays what. F I C A - Social Security and Medicare - is a matched tax: half withheld from the employee's check, half contributed by the employer. F U T A - federal unemployment - is the opposite: employer-paid entirely, nothing from the employee's check. State unemployment runs employer-paid in nearly all states, with a few - Alaska, New Jersey, Pennsylvania - collecting a small employee share. A self-employed owner has no employer to match, so self-employment tax covers BOTH halves of Social Security and Medicare, computed on net earnings. And income with no withholding means quarterly estimated tax payments - skip quarters and penalties accrue even if April's balance gets paid in full.

The two words that should scare you: trust fund. Taxes withheld from paychecks - income tax and the employee F I C A share - are the government's money sitting in your account. Spend it on payroll or materials and the trust fund recovery penalty can pierce the entity and land on the responsible individuals PERSONALLY. It is the classic failing-contractor mistake, and there is no entity shield against it.

Deposits run on their own calendar. The I R S assigns your deposit schedule - monthly or semiweekly - from your lookback-period liability, and late deposits draw escalating penalties. Payday is not the deadline; the deposit date is its own obligation. One more clock: accumulate one hundred thousand dollars or more of liability and that deposit is due the NEXT business day, whatever your assigned schedule.

Paper for the people you pay. Payments to an unincorporated independent subcontractor above the annual threshold go on form ten ninety-nine N E C - and collect the W nine up front so the taxpayer number is on file before the year-end scramble. Older references still say ten ninety-nine M I S C; that form carried nonemployee compensation before twenty-twenty. Employees get W twos - never mix the lanes.

Purchases and equipment. Use tax is sales tax's backstop: buy taxable materials with no sales tax collected - commonly out of state - and you owe the equivalent use tax to your own state. Depreciation spreads a long-lived asset's cost over its useful life; the Section one seventy-nine election can, within annual limits, deduct the full cost of qualifying equipment in the year it goes into service - a planning decision that helps most in a high-income year.

Keep the proof: employment tax records at least four years after the tax is due or paid.

Recap. F I C A matched, F U T A employer-only, self-employment tax both halves. Trust fund money is never yours. Deposit on the assigned clock - a hundred grand means next day. Ten ninety-nine N E C for subs, W two for employees. Four years of records.`,
  },
  {
    key: "ln",
    title: "Liens & Payment",
    minutes: 4,
    script: `This is your Liens and Payment lesson - the machinery that gets construction people paid.

A mechanics lien gives an unpaid contractor, sub, laborer, or supplier a security interest in the improved real property itself - the land and building the work went into, nothing else the owner has. It can cloud title, block a sale or refinance, and ultimately force a foreclosure sale to satisfy the debt. Lien rights typically reach the whole chain that improved the property - including subs and suppliers who never contracted with the owner - which is precisely why owners fear them.

The rights come from statute, and every state draws its own calendar. Three clocks rule this world. First, many states condition a sub's or supplier's rights on a preliminary notice - telling the owner early that you are furnishing labor or materials - often due within a set number of days after FIRST furnishing; miss it where required and the lien right can die before the unpaid invoice exists. Second, the lien filing deadline, typically measured from completion or from YOUR last furnishing of labor or materials. Third, enforcement: a recorded lien expires unless you file the foreclosure action within its statutory period. Liens are leverage with an expiration date. Your state pack carries your state's exact numbers.

Waivers are where lien rights get signed away - sometimes by accident. A CONDITIONAL waiver takes effect only if the payment actually arrives and clears; an UNCONDITIONAL waiver gives up rights the moment you sign. Sign unconditional against a check that bounces and the rights are gone anyway - so the safe exchange is conditional with payment, converting to unconditional after funds clear. Progress waivers release rights only through a stated date or amount, keeping later work protected; the final waiver at the end releases the rest. Read the form - a progress waiver drafted with final language takes more than it should.

Both sides run protection systems. Owners collect lien waivers from subs and suppliers with every payment - because paying the general in full does not, in many states, stop an unpaid sub's lien. Generals worried a sub might stiff its supplier write joint checks payable to both - the check cannot be cashed without the supplier's endorsement, so the money provably reached the party who could lien.

Public work flips the board: mechanics liens generally cannot attach to public property, so payment BONDS substitute - the Miller Act federally, Little Miller Acts in the states. An unpaid sub on a bonded public job gives the required bond-claim notices and sues on the payment bond within the statutory deadlines - the same calendar discipline, aimed at the surety instead of the land.

Recap. Lien equals security interest in the improved property. Three clocks: preliminary notice, filing, enforcement. Conditional until the money clears. Waivers per payment, joint checks for shaky chains. Public work runs on payment bonds.`,
  },
  {
    key: "sf",
    title: "Safety & OSHA",
    minutes: 3,
    script: `This is your Safety and OSHA lesson - pure memory work, and every number is a point on the exam.

The foundation is the General Duty Clause: every employer must provide a workplace free from recognized hazards likely to cause death or serious harm - citable even where no specific standard applies. The construction standards themselves live in twenty-nine C F R nineteen twenty-six; general industry's nineteen ten still reaches construction where nineteen twenty-six is silent.

Now the numbers, rapid fire. Fall protection in construction: required at SIX feet above a lower level - guardrails, nets, or personal fall arrest - with scaffolds carrying their own ten-foot threshold. Falls are still construction's deadliest hazard. Excavations: a protective system - sloping, shoring, or shielding - at FIVE feet of depth, unless the cut is entirely in stable rock; and trenches four feet or deeper need an exit within twenty-five feet of lateral travel. A competent person inspects daily and after rain. Extension ladders: side rails extend at least THREE feet above the upper landing - the handhold for the transition where most ladder falls happen.

That phrase, competent person, has a two-part legal definition: someone who can IDENTIFY existing and predictable hazards AND has the employer's AUTHORITY to promptly correct them. Both halves required - a sharp-eyed worker with no authority to stop work does not qualify.

Chemicals: the Hazard Communication standard is right-to-know - labeled containers, training, and safety data sheets accessible to employees for every hazardous chemical on site. S D S binders locked in an office truck across town fail the point of the standard.

Paperwork and clocks. Recordable injuries - anything beyond first aid: medical treatment, restricted duty, days away, loss of consciousness - go on the three hundred log. Band-aids stay off; stitches go on. The three hundred A annual summary posts in the workplace from February first through April thirtieth, covering the prior year - even a zero-injury year. Reporting is faster and separate: a work-related FATALITY goes to OSHA within EIGHT hours; an in-patient hospitalization, amputation, or loss of an eye within TWENTY-FOUR hours, by phone or the online portal.

Two employer-pays rules. Required P P E - hard hats, harnesses - is provided at the employer's cost, with narrow exceptions like everyday safety-toe boots. And the OSHA Job Safety and Health poster hangs where employees can see it - inspectors look.

Recap, numbers only. Six feet - falls. Ten - scaffolds. Five - trenches. Four and twenty-five - trench exits. Three - ladder rails. Eight hours - fatality. Twenty-four - hospitalization, amputation, eye. February first to April thirtieth - the three hundred A. Learn the numbers, collect the points.`,
  },
];

export function getBlLesson(key: string): BlLesson | null {
  return BL_LESSONS.find((l) => l.key === key) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/bllessons.ts (v1 - ten B&L
// drive-time lessons, every fact traceable to blbank v3)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
