// FILE: lib/haullegal/guides.ts
import "server-only";

// HaulLegal guide library (v1) - ten SEO articles targeting the
// searches a brand-new owner-operator actually types: how to get
// trucking authority, what it costs, USDOT vs MC number, the
// BOC-3, Motus and the ID check, the New Entrant audit, IFTA, the
// four by-the-mile states, Form 2290, and the MCS-150 update.
// Every fact is the same primary-source-verified fact set the
// walkthrough runs on (FMCSA, eCFR, IRS, UCR, IFTA and the state
// tax pages, September 2026) - government fees appear because they
// ARE the content; HaulLegal's own prices never appear in guide
// copy so the articles stay evergreen when pricing moves. Mirrors
// the WiremanPrep guide shape; rendering: app/haullegal/guides/
// [slug]/page.tsx. Text wrapped in single asterisks renders bold.

export type HlGuideFact = { l: string; v: string };

export type HlGuideSection = {
  h?: string;
  p?: string[];
  list?: string[];
  facts?: HlGuideFact[];
};

export type HlGuideCta = { label: string; href: string; ghost?: boolean };

export type HlGuide = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  updated: string;
  intro: string[];
  sections: HlGuideSection[];
  ctaH: string;
  ctaP: string;
  ctas: HlGuideCta[];
  related: string[];
};

const UPDATED = "Updated September 2026";

const CTA_WALK: HlGuideCta[] = [
  { label: "See the steps free", href: "/haullegal/start" },
  { label: "Try the deadline calendar", href: "/haullegal/calendar", ghost: true },
];

export const HL_GUIDES: HlGuide[] = [
  {
    slug: "how-to-get-trucking-authority",
    metaTitle: "How to Get Your Trucking Authority in 2026 (Motus, Step by Step)",
    metaDescription: "The 2026 order of operations for a new owner-operator: USDOT number, operating authority, the $300 fee, insurance filing, BOC-3, UCR - on FMCSA's new Motus system.",
    eyebrow: "Getting started",
    h1: "How to Get Your Trucking Authority in 2026",
    updated: UPDATED,
    intro: [
      "Getting your own authority means the federal government has given your trucking company permission to haul other people's freight for money across state lines. In 2026 the whole thing runs through FMCSA's new registration system, *Motus*, and the order you do things in matters more than any single form.",
      "Here is the sequence, with the real government fee at each step. Almost everything below is free or cheap from the government itself; what people pay hundreds for is knowing which button to click.",
    ],
    sections: [
      {
        h: "Before you touch the application",
        list: [
          "*Set up the business and lock the exact legal name.* FMCSA says any deviation in the company name between your application and your filings delays the grant. Pick the name once and copy it everywhere.",
          "*Get your EIN from the IRS.* Free, online, about ten minutes. You will need it for the heavy-vehicle tax, which does not accept a Social Security number.",
          "*Run FMCSA's own wizard.* Interstate, for-hire, over 10,000 lbs means a USDOT number plus operating authority. Intrastate-only may need only the USDOT number - and the $300 authority fee is non-refundable if you apply for the wrong thing.",
          "*Line up insurance.* The minimum for general freight is $750,000 in liability coverage, and your insurer, not you, files proof with FMCSA within 20 days of your application being published.",
        ],
      },
      {
        h: "The federal steps, in order",
        facts: [
          { l: "Login.gov account, sign in to Motus", v: "$0" },
          { l: "Identity check (smartphone selfie + government ID)", v: "No fee listed" },
          { l: "USDOT number", v: "$0" },
          { l: "Operating authority (property carrier)", v: "$300, non-refundable" },
          { l: "Insurer files BMC-91/91X", v: "$0 to FMCSA" },
          { l: "Process agent files BOC-3", v: "About $35-$75, private" },
          { l: "UCR registration, 1-2 trucks", v: "$46 (2026) / $55 (2027)" },
        ],
        p: [
          "After you pay the $300, FMCSA publishes your application in its Register and anyone has *10 days* to protest it. Your insurance filing and your BOC-3 both have to be on file within *20 days* of that publication; miss it and FMCSA sends a dismissal notice with 60 days to fix it, or the application is dismissed and the $300 is gone.",
          "FMCSA's own guidance says first-time applications typically take *20 to 25 business days*, and applications picked for extra vetting can add two to eight weeks. Motus now shows the reason behind a Pending status - FMCSA Review, Process Agent filing, or Financial Responsibility filing - so you can see who owes the next move.",
        ],
      },
      {
        h: "What changed with Motus",
        p: [
          "Since May 2026 the old registration system is permanently offline. Every new applicant proves who they are through FMCSA's identity partner on a smartphone or tablet, and roughly 800,000 existing carriers are going through the same check the first time they log in. Anyone applying on your behalf must pass the same check, and you, the company official, still sign the final certifications yourself.",
          "That is why the old 'we do it all for you' packages cannot fully do it anymore. The person holding the phone is the person on the ID.",
        ],
      },
      {
        h: "After the authority is active",
        p: [
          "Do not book a paid load on 'it should be active by Friday' - brokers check FMCSA's SAFER lookup before they tender freight. Once you are active, the clock starts on everything else: the drug and alcohol testing pool, the Clearinghouse, the heavy-vehicle tax, apportioned plates, the fuel-tax license, and the *New Entrant safety audit* that comes within your first 12 months.",
        ],
      },
    ],
    ctaH: "Want every step with the click path and the official link?",
    ctaP: "The HaulLegal walkthrough lays out all 23 steps in order, with the real fee, what to do first, and the mistakes FMCSA warns about. The first four are free.",
    ctas: CTA_WALK,
    related: ["what-trucking-authority-costs", "usdot-number-vs-mc-number", "motus-identity-verification"],
  },
  {
    slug: "what-trucking-authority-costs",
    metaTitle: "What Trucking Authority Really Costs in 2026 (Government Fees vs Packages)",
    metaDescription: "The actual government fees to start a trucking company - $0 USDOT number, $300 authority, $46 UCR, $550 heavy-vehicle tax - next to what the filing packages charge.",
    eyebrow: "Real prices",
    h1: "What Trucking Authority Really Costs",
    updated: UPDATED,
    intro: [
      "Search for trucking authority and the first page is packages: $300, $500, $995. Here is what the government itself actually charges, line by line, so you know what you are paying for when you pay someone else to click.",
    ],
    sections: [
      {
        h: "The government's price list",
        facts: [
          { l: "USDOT number", v: "$0" },
          { l: "Operating authority, per type", v: "$300" },
          { l: "Biennial update (MCS-150)", v: "$0" },
          { l: "Name change", v: "$14" },
          { l: "Reinstatement", v: "$80" },
          { l: "UCR, 0-2 vehicles (2026 / 2027)", v: "$46 / $55" },
          { l: "Heavy vehicle use tax, 80,000-lb truck", v: "$550 a year" },
          { l: "Clearinghouse query", v: "$1.25 each" },
        ],
        p: [
          "That is the whole federal bill: *$300 once* for the authority and small annual fees after. FMCSA's page puts it in capitals - the $300 filing fee is non-refundable - and it says out loud that the government does not endorse and generally does not require the use of private businesses or vendors.",
        ],
      },
      {
        h: "The things you genuinely have to buy from somebody",
        list: [
          "*A BOC-3 process agent filing.* Only a process agent can file it; a blanket agent covers all 48 states plus DC. Retail runs about $35 to $75, one time.",
          "*A drug and alcohol testing consortium.* A self-employed driver must be in a random testing pool and cannot run his own. Roughly $66 to $85 a year at the consortiums that publish prices, plus the tests.",
          "*Insurance.* The $750,000 liability minimum is the biggest cost of starting, and the premium depends on you, your truck and your record.",
          "*An ELD*, unless you qualify for the short-haul or pre-2000-engine exemptions.",
        ],
      },
      {
        h: "What the packages are charging for",
        p: [
          "A $399 authority package that includes the $300 government fee is charging about $99 for the clicks; a $995 package is charging about $695. Since Motus, the owner has to do the phone ID check personally anyway, so 'we handle everything' has a hole in it. Monthly compliance services run from about $49.50 to $247 a month for reminders and filings you can put on a calendar yourself.",
          "None of that is a scam; it is a convenience fee. Just know the number underneath it.",
        ],
      },
    ],
    ctaH: "Every step, with the government price beside it.",
    ctaP: "HaulLegal shows the real fee next to every click so you never pay $500 for a free form. Start with the four free steps.",
    ctas: CTA_WALK,
    related: ["how-to-get-trucking-authority", "boc-3-process-agent-explained", "form-2290-heavy-vehicle-use-tax"],
  },
  {
    slug: "usdot-number-vs-mc-number",
    metaTitle: "USDOT Number vs MC Number: Which One Does a New Trucker Need?",
    metaDescription: "A USDOT number is the free federal ID for your trucking business; operating authority (the MC number) is the $300 permission to haul for hire across state lines. Here is who needs which.",
    eyebrow: "Plain English",
    h1: "USDOT Number vs MC Number",
    updated: UPDATED,
    intro: [
      "These two get mixed up constantly, and the mix-up costs people a non-refundable $300. Here is the difference in one breath: the *USDOT number* identifies your company; the *MC number* (operating authority) gives your company permission to haul other people's freight for money across state lines.",
    ],
    sections: [
      {
        h: "USDOT number",
        p: [
          "The federal ID number for the trucking business itself. It is required for interstate vehicles rated 10,001 lbs or more, it is *free*, and each USDOT number has exactly one designated company official - the owner, a partner, or an authorized officer. Motus randomizes newly issued numbers, so yours will not look like a sequence.",
          "Many states also require a USDOT number for trucks that never leave the state. FMCSA's wizard tells you in five minutes.",
        ],
      },
      {
        h: "Operating authority (the MC number)",
        p: [
          "Permission to work as a for-hire carrier in interstate commerce. For a general-freight trucker the type is Motor Carrier of Property (except household goods). It costs *$300 per authority type*, paid through Pay.gov inside the application, and it is not refundable if you pick the wrong type or do not need it.",
          "You cannot haul a for-hire load until the authority is active - applied is not active. FMCSA had planned to eliminate MC numbers, but that change was deferred and is not part of the 2026 Motus release, so the docket number still exists; new ones carry a suffix, and C means property-carrier authority.",
        ],
      },
      {
        h: "Who needs which",
        facts: [
          { l: "Interstate, hauling for hire", v: "USDOT + authority" },
          { l: "Interstate, hauling only your own goods", v: "USDOT only" },
          { l: "Intrastate only", v: "USDOT in many states + state rules" },
        ],
      },
    ],
    ctaH: "Not sure which you need?",
    ctaP: "Step three of the free walkthrough sends you to FMCSA's own wizard and explains the answer before you pay anything.",
    ctas: CTA_WALK,
    related: ["how-to-get-trucking-authority", "what-trucking-authority-costs", "mcs-150-biennial-update"],
  },
  {
    slug: "boc-3-process-agent-explained",
    metaTitle: "BOC-3 Explained: The One Trucking Form You Cannot File Yourself",
    metaDescription: "Form BOC-3 names a process agent who can receive legal papers for your trucking company in every state. Only a process agent can file it; here is what it costs and when it is due.",
    eyebrow: "The forms",
    h1: "BOC-3 Explained",
    updated: UPDATED,
    intro: [
      "Of all the pieces of paper in getting your authority, the BOC-3 is the one that confuses people most, because it is the one you are not allowed to file yourself.",
    ],
    sections: [
      {
        h: "What it is",
        p: [
          "Form BOC-3 designates a *process agent* - a person or company that can accept legal papers on your behalf - in every state you might operate in. The rule says every motor carrier must designate process agents for all 48 contiguous states and the District of Columbia. A *blanket* agent is a company that has filed a list of agents for every state with FMCSA, so one filing covers you everywhere.",
        ],
      },
      {
        h: "Who files it and what it costs",
        p: [
          "FMCSA's own page says it plainly: only a process agent, on behalf of the carrier, can file Form BOC-3. You choose a blanket agent, pay them, and they submit it electronically in Motus. Retail prices at the agents themselves run about *$35 to $75*, one time. Pick one from FMCSA's list of blanket process agents, not from an ad.",
        ],
      },
      {
        h: "When it is due",
        p: [
          "Within *20 days* of your application being published in the FMCSA Register - the same deadline as your insurance filing. Until it lands, your status reads 'Pending - Process Agent (Form BOC-3) Filings'. Miss the window and the application can be dismissed, with 60 days to cure.",
        ],
      },
    ],
    ctaH: "See where the BOC-3 falls in the order.",
    ctaP: "The walkthrough puts every filing in sequence with its deadline, so the 20-day window never sneaks up on you.",
    ctas: CTA_WALK,
    related: ["how-to-get-trucking-authority", "what-trucking-authority-costs", "motus-identity-verification"],
  },
  {
    slug: "motus-identity-verification",
    metaTitle: "FMCSA's Motus System: What Changed and How the Identity Check Works",
    metaDescription: "Motus replaced FMCSA's registration system in May 2026. Login.gov, the smartphone ID check, the 800,000 re-verifications, what third parties can still do, and what the statuses mean.",
    eyebrow: "The new system",
    h1: "Motus and the Identity Check",
    updated: UPDATED,
    intro: [
      "In May 2026 FMCSA switched every registration - new USDOT numbers, authority applications, updates - onto a new system called Motus. The old Unified Registration System is permanently offline. If you are starting a trucking company now, this is the door you walk through.",
    ],
    sections: [
      {
        h: "Signing in",
        p: [
          "Motus uses *Login.gov* with two-factor authentication. FMCSA's quick-start guide tells you not to use your public business email for the Motus profile - use a private address you control. If you ever had an FMCSA Portal login, use the same email so your history links up.",
        ],
      },
      {
        h: "The identity check",
        p: [
          "Every new applicant proves identity through FMCSA's partner IDEMIA: scan a QR code with a smartphone or tablet, photograph a valid government ID, take a selfie. Accepted documents are from the United States, Mexico and Canada only; for Mexico, only a passport. There is no limit on attempts, walk-in enrollment centers exist if the phone route fails, and FMCSA's identity hotline is 1-833-832-5530.",
          "Approximately *800,000 existing registrants* go through the same check the first time they log in.",
        ],
      },
      {
        h: "What a third party can and cannot do",
        p: [
          "Motus has a formal role for companies that help with registrations, but you must designate them first, anyone who applies on your behalf must pass the identity check too, and the company official - you - still reviews the entries and submits the final oaths and certifications. FMCSA also warns that it never telemarkets, never asks for card numbers by phone, and never charges for forms.",
        ],
      },
      {
        h: "Reading your status",
        list: [
          "*Pending - FMCSA Review*: the agency is looking at it, or it was flagged for vetting (2-8 extra weeks).",
          "*Pending - Process Agent (Form BOC-3) Filings*: your process agent has not filed yet.",
          "*Pending - Financial Responsibility Filings*: your insurer has not filed the BMC-91/91X yet.",
          "*Not Authorized*: no active authority - you cannot haul for hire yet.",
        ],
      },
    ],
    ctaH: "The walkthrough is built for Motus.",
    ctaP: "Every federal step names the screen, the button and the status you should see next.",
    ctas: CTA_WALK,
    related: ["how-to-get-trucking-authority", "boc-3-process-agent-explained", "mcs-150-biennial-update"],
  },
  {
    slug: "new-entrant-safety-audit-checklist",
    metaTitle: "New Entrant Safety Audit: How to Pass It in Your First Year",
    metaDescription: "FMCSA audits every new carrier inside its first 12 months. The paperwork that fails it automatically - no drug program, no random pool, no logs, no insurance - and how to have it ready.",
    eyebrow: "First year",
    h1: "The New Entrant Safety Audit",
    updated: UPDATED,
    intro: [
      "For your first 18 months you are a 'new entrant' and FMCSA is watching. A safety audit comes within your first 12 months - it can come after as little as three months of operation - and it is almost entirely a paperwork test.",
    ],
    sections: [
      {
        h: "The automatic failures",
        p: [
          "The regulation lists 16 violations that fail the audit on the spot. The ones that catch one-truck carriers are all things you control from day one:",
        ],
        list: [
          "No alcohol and/or drug testing program.",
          "No *random* alcohol and/or drug testing program - meaning you are not in a consortium pool.",
          "Using a driver without a valid CDL.",
          "Operating without the required level of insurance in effect.",
          "Failing to keep hours-of-service records.",
          "Operating a vehicle that was placed out of service before it was repaired.",
        ],
      },
      {
        h: "What the auditor asks for",
        list: [
          "Your consortium enrollment certificate and your own negative pre-employment test result.",
          "Your Clearinghouse registration and query record.",
          "Your driver qualification file: CDL, medical certificate, driving record pulled and reviewed within the last 12 months.",
          "Six months of logs (ELD data or paper if you are exempt).",
          "Maintenance records, the annual inspection reports for the tractor and the trailer, and any driver vehicle inspection reports.",
          "Proof of insurance in force.",
        ],
      },
      {
        h: "If you fail",
        p: [
          "You get *60 days* to submit evidence that you corrected the problems. Miss that and the registration is revoked. The fix is simple and boring: do everything in the 'Legal on the road' phase in month one, not month eleven.",
        ],
      },
    ],
    ctaH: "Every item above is a step in the walkthrough.",
    ctaP: "Check them off as you go and the audit is a formality.",
    ctas: CTA_WALK,
    related: ["how-to-get-trucking-authority", "ifta-for-owner-operators", "mcs-150-biennial-update"],
  },
  {
    slug: "ifta-for-owner-operators",
    metaTitle: "IFTA for a One-Truck Operation: License, Decals, and the Quarterly Return",
    metaDescription: "Who needs an IFTA license, how the two decals work, the four quarterly due dates, why you file even with zero miles, and the January-February grace period.",
    eyebrow: "Fuel tax",
    h1: "IFTA for a One-Truck Operation",
    updated: UPDATED,
    intro: [
      "Fuel tax is owed to every state you drive in, based on the miles you run there, not where you bought the fuel. The International Fuel Tax Agreement lets you file *one* return with your base state instead of one per state. It is a good deal - and one of the most-missed deadlines in trucking.",
    ],
    sections: [
      {
        h: "Who needs it",
        p: [
          "A qualified motor vehicle is one used in combination when the combined weight exceeds *26,000 lbs* (or with three or more axles), operating in two or more member jurisdictions. That is every tractor-trailer that crosses a state line.",
        ],
      },
      {
        h: "License and decals",
        p: [
          "Your base state issues the license and two decals per qualified vehicle. The license is valid for the calendar year and expires *December 31*. If your renewal is filed, January and February are a grace period for displaying the new decals.",
        ],
      },
      {
        h: "The quarterly return",
        facts: [
          { l: "January - March", v: "due April 30" },
          { l: "April - June", v: "due July 31" },
          { l: "July - September", v: "due October 31" },
          { l: "October - December", v: "due January 31" },
        ],
        p: [
          "If the due date falls on a weekend or holiday it moves to the next business day. And the rule everyone learns the hard way: *tax returns are required even if no operations were conducted*. A zero-mile quarter still gets a return. Keep every fuel receipt and your miles by state; the return is built from them.",
        ],
      },
    ],
    ctaH: "Put the four dates on a calendar that reminds you.",
    ctaP: "The Stay Legal calendar works out IFTA quarters, the license renewal, UCR, Form 2290 and the rest from your details.",
    ctas: [
      { label: "Try the deadline calendar", href: "/haullegal/calendar" },
      { label: "See the walkthrough", href: "/haullegal/start", ghost: true },
    ],
    related: ["weight-distance-tax-states", "form-2290-heavy-vehicle-use-tax", "mcs-150-biennial-update"],
  },
  {
    slug: "weight-distance-tax-states",
    metaTitle: "The Four States That Charge Trucks by the Mile: Kentucky, New Mexico, New York, Oregon",
    metaDescription: "KYU, New Mexico weight-distance tax, New York HUT and Oregon weight-mile tax: thresholds, rates, filing frequency, and the penalties for skipping a zero-mile return.",
    eyebrow: "State taxes",
    h1: "The Four States That Charge by the Mile",
    updated: UPDATED,
    intro: [
      "IFTA covers fuel tax. Four states also charge a separate tax on the miles you run inside them, with their own registration and their own returns - and all four want a return even for a period with no miles.",
    ],
    sections: [
      {
        h: "Kentucky (KYU)",
        p: [
          "Trucks with a combined license weight over 59,999 lbs pay *$0.0285 per Kentucky mile*, filed quarterly by the last day of the month after the quarter. Zero-mile returns are required; skip them and the license is revoked with a *$500* reinstatement fee. A temporary permit exists for one-off trips.",
        ],
      },
      {
        h: "New Mexico (weight-distance tax)",
        p: [
          "Trucks over 26,000 lbs need a New Mexico weight-distance electronic permit for each vehicle, renewed every year, and file quarterly returns due April 30, July 31, October 31 and January 31 - even if the truck never touched a New Mexico road that quarter.",
        ],
      },
      {
        h: "New York (highway use tax)",
        p: [
          "Trucks over 18,000 lbs need a HUT certificate of registration and decal, *$1.50 per vehicle*. Most new carriers file quarterly, by the last day of the month after the period, even when no tax is due. Late returns cost 10% plus 1% a month (capped at 30%); running without the certificate is a *$500 to $2,000* fine the first time. A $25 trip certificate covers a one-off, up to ten a year.",
        ],
      },
      {
        h: "Oregon (weight-mile tax)",
        p: [
          "Trucks over 26,000 lbs pay by the mile - *$0.2512 per mile* at 78,001 to 80,000 lbs - and report *monthly*, postmarked by the last day of the month for the previous month, unless the state approves quarterly filing. A bond is required to enroll. If you rarely go, a temporary pass costs $9 plus the mileage tax.",
        ],
      },
    ],
    ctaH: "Tell the calendar which states you run.",
    ctaP: "Flip Kentucky, New Mexico, New York or Oregon on and their returns join your deadline list automatically.",
    ctas: [
      { label: "Try the deadline calendar", href: "/haullegal/calendar" },
      { label: "See the walkthrough", href: "/haullegal/start", ghost: true },
    ],
    related: ["ifta-for-owner-operators", "form-2290-heavy-vehicle-use-tax", "how-to-get-trucking-authority"],
  },
  {
    slug: "form-2290-heavy-vehicle-use-tax",
    metaTitle: "Form 2290 (Heavy Vehicle Use Tax) for New Owner-Operators",
    metaDescription: "Who owes the federal heavy vehicle use tax, the July-June tax year, the August 31 and first-use deadlines, the $550 top rate, and why your plates depend on the stamped Schedule 1.",
    eyebrow: "Federal tax",
    h1: "Form 2290 for New Owner-Operators",
    updated: UPDATED,
    intro: [
      "The heavy vehicle use tax is a yearly federal tax on trucks of 55,000 lbs and up, filed on IRS Form 2290. It is small, it is annual, and your state will not plate the truck without proof you paid it.",
    ],
    sections: [
      {
        h: "The numbers",
        facts: [
          { l: "Applies at taxable gross weight of", v: "55,000 lbs and up" },
          { l: "Tax year", v: "July 1 - June 30" },
          { l: "Tax at 55,000 lbs", v: "$100" },
          { l: "Tax at 75,000 lbs and over", v: "$550" },
          { l: "Deadline for a truck used in July", v: "August 31" },
          { l: "Deadline otherwise", v: "Last day of the month after first use" },
        ],
      },
      {
        h: "The two things people get wrong",
        list: [
          "*You need an EIN.* The IRS does not accept a Social Security number on Form 2290. Get the EIN first - it is free and takes minutes.",
          "*The deadline follows first use, not registration.* Put the truck on the road in October and the return is due November 30, whatever the plates say.",
        ],
      },
      {
        h: "The stamped Schedule 1",
        p: [
          "When the IRS accepts the return it sends back a stamped Schedule 1. That is the document your IRP office asks for before issuing apportioned plates, so file 2290 before you go for plates. E-filing is only mandatory at 25 vehicles or more, but e-filed Schedule 1s come back fast and paper takes weeks.",
        ],
      },
    ],
    ctaH: "The calendar knows the first-use rule.",
    ctaP: "Tell it the month the truck hit the road and it computes the 2290 date, then the August 31 renewal every year after.",
    ctas: [
      { label: "Try the deadline calendar", href: "/haullegal/calendar" },
      { label: "See the walkthrough", href: "/haullegal/start", ghost: true },
    ],
    related: ["ifta-for-owner-operators", "what-trucking-authority-costs", "weight-distance-tax-states"],
  },
  {
    slug: "mcs-150-biennial-update",
    metaTitle: "MCS-150 Biennial Update: How Your USDOT Number Sets the Deadline",
    metaDescription: "Every carrier updates its FMCSA registration every two years. The last digit of your USDOT number picks the month, the next-to-last picks odd or even years; miss it and the number is deactivated.",
    eyebrow: "Every two years",
    h1: "The MCS-150 Biennial Update",
    updated: UPDATED,
    intro: [
      "Even if nothing about your company has changed, FMCSA requires you to confirm your information every 24 months. It is free, it takes minutes in Motus, and forgetting it deactivates your USDOT number.",
    ],
    sections: [
      {
        h: "How the deadline is set",
        p: [
          "The rule works off your USDOT number. The *last digit* sets the month: 1 is January, 2 is February, through 9 for September, and 0 is October. The *next-to-last digit* sets the year: odd means you file in odd-numbered years, even means even-numbered years. The update is due by the last day of that month.",
          "Example: a USDOT number ending in 57 files in July (last digit 7) of odd-numbered years (next-to-last digit 5).",
        ],
      },
      {
        h: "What happens if you miss it",
        p: [
          "Deactivation of the USDOT number, and civil penalties of up to $1,000 a day, capped at $10,000. FMCSA paused deactivations during the Motus rollout starting June 1, 2026, but the duty did not go away - the update is still due on schedule.",
        ],
      },
      {
        h: "Changes in between",
        p: [
          "A change of name, address or business form must be filed within 30 days whenever it happens; that does not reset your two-year cycle.",
        ],
      },
    ],
    ctaH: "Type your USDOT number in and the date appears.",
    ctaP: "The Stay Legal calendar works out your update month and year from the number and reminds you before it is due.",
    ctas: [
      { label: "Try the deadline calendar", href: "/haullegal/calendar" },
      { label: "See the walkthrough", href: "/haullegal/start", ghost: true },
    ],
    related: ["usdot-number-vs-mc-number", "motus-identity-verification", "new-entrant-safety-audit-checklist"],
  },
];

export function getHlGuide(slug: string): HlGuide | null {
  return HL_GUIDES.find((g) => g.slug === slug) ?? null;
}

// ============================================================
// END OF FILE - lib/haullegal/guides.ts (v1 - ten verified SEO
// guides for new owner-operators)
// If you can see this comment, the paste was not truncated.
// ============================================================
