// FILE: lib/haullegal/steps.ts

// HaulLegal walkthrough content (v1). This is the spine of the
// product: every step a brand-new one-truck, interstate, for-hire
// carrier (general freight, no hazmat) takes to get legal to haul,
// in the order they happen, with the REAL official fee, where the
// step is done, what must be done first, how long it takes, the
// mistakes FMCSA itself warns about, and a citation for every hard
// number. Verified September 10, 2026 against FMCSA, eCFR, IRS,
// UCR, IFTA/IRP and state tax pages (no secondary sources; see the
// federal dossier in the build notes). Facts that could not be
// verified against a primary source are phrased as ranges or
// "varies" rather than invented.
// Doctrine baked into the copy: HaulLegal never files anything and
// never touches a government account. It prepares and guides; the
// owner clicks. Government prices are shown next to every step so
// nobody pays $500 for a $0 form.
// Data model is self-contained (no imports) so the walkthrough
// page, the landing page and future server routes can all read it.
// v1 tradeoff, same as ForemanPrep's launch: the full step list
// ships to the browser and the paywall is enforced in the UI. A
// server route for locked steps can harden that later.

export type HlPhase = "before" | "federal" | "state" | "operate";

export type HlPartner =
  | "formation"
  | "insurance"
  | "boc3"
  | "consortium"
  | "eld"
  | "loadboard"
  | "factoring";

export type HlStep = {
  id: string;
  phase: HlPhase;
  title: string;
  summary: string;
  fee: string;
  where: string;
  url: string;
  needs: string[];
  time: string;
  gotchas: string[];
  citeLabel: string;
  cite: string;
  partner?: HlPartner;
  free: boolean;
};

export const HL_PHASES: Array<{ id: HlPhase; title: string; blurb: string }> = [
  {
    id: "before",
    title: "Before you apply",
    blurb: "Get the business, the tax ID and the insurance quote lined up first. The application asks for all of it, and a name mismatch is the number one reason authority stalls.",
  },
  {
    id: "federal",
    title: "Federal registration (Motus)",
    blurb: "The USDOT number, the operating authority, the two filings other companies make for you, and the day you become ACTIVE.",
  },
  {
    id: "state",
    title: "Taxes, plates and fuel",
    blurb: "The heavy-truck tax, apportioned plates, the fuel-tax license, and the four states that charge by the mile.",
  },
  {
    id: "operate",
    title: "Legal on the road",
    blurb: "Drug testing, the logbook, your paperwork file, the safety audit in your first year, and getting paid.",
  },
];

export const HL_STEPS: HlStep[] = [
  {
    id: "entity",
    phase: "before",
    title: "Set up the business and lock the exact legal name",
    summary:
      "Decide whether you will run as a sole proprietor or form an LLC, then use that exact legal name - spelled the same way - on every form that follows: the FMCSA application, your insurance policy, your process-agent filing and your state plates.",
    fee: "State filing fee (varies by state); sole proprietors pay $0",
    where: "Your state's Secretary of State site, or a formation service",
    url: "https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate",
    needs: [],
    time: "Same day to a few weeks, depending on the state",
    gotchas: [
      "FMCSA says it plainly: any deviation in the company name between your application and your filings delays the grant of your authority. Pick the name once and copy-paste it everywhere.",
      "An LLC is not required by FMCSA. Many owner-operators start as sole proprietors and form an LLC later - talk to a tax professional about which fits you.",
    ],
    citeLabel: "FMCSA - Get an MC Number / Authority to Operate",
    cite: "https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate",
    partner: "formation",
    free: true,
  },
  {
    id: "ein",
    phase: "before",
    title: "Get your EIN from the IRS (free, online, minutes)",
    summary:
      "An Employer Identification Number is your business tax ID. The IRS issues it free on its website in about ten minutes. You will need it for the heavy-vehicle tax (Form 2290 does not accept a Social Security number), your bank account and most of the filings below.",
    fee: "$0 - the IRS never charges for an EIN",
    where: "IRS.gov online EIN application",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number",
    needs: ["entity"],
    time: "About 10 minutes online",
    gotchas: [
      "Never pay a website for an EIN. If a page asks for a card number to 'process' one, it is a middleman marking up a free form.",
      "Apply as the business (the LLC or your sole-proprietor name), not as a random new company - the EIN name should match your legal name.",
    ],
    citeLabel: "IRS - Trucking Tax Center (EIN required for Form 2290)",
    cite: "https://www.irs.gov/businesses/small-businesses-self-employed/trucking-tax-center",
    free: true,
  },
  {
    id: "wizard",
    phase: "before",
    title: "Confirm what you actually need with FMCSA's own wizard",
    summary:
      "Interstate, for-hire, hauling other people's freight in a truck over 10,000 lbs means two things: a USDOT number (free) and operating authority ($300). If you will only ever haul inside one state, you may need only the USDOT number plus your state's rules - and the $300 authority fee is non-refundable if you apply for the wrong thing.",
    fee: "$0",
    where: "FMCSA registration wizard",
    url: "https://www.fmcsa.dot.gov/usdot-wizard",
    needs: [],
    time: "5 minutes",
    gotchas: [
      "The $300 filing fee is non-refundable, and FMCSA's own page warns applicants to apply for the correct type of authority. Run the wizard before you pay anything.",
      "A USDOT number is required for interstate vehicles rated 10,001 lbs or more - that is the truck's rating, not what you happen to be hauling.",
    ],
    citeLabel: "FMCSA - Do I need a USDOT number?",
    cite: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    free: true,
  },
  {
    id: "insurance-quote",
    phase: "before",
    title: "Line up your insurance before you file",
    summary:
      "Federal law sets the minimum liability coverage for a for-hire property carrier at $750,000 (general freight, trucks over 10,000 lbs). Your insurance company - not you - files proof with FMCSA electronically, and it has 20 days from the day your application is published to do it. Get quotes now so the policy is ready the moment your application posts.",
    fee: "Premium varies widely (new authority, your driving record and your truck all matter)",
    where: "A commercial truck insurance agent",
    url: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements",
    needs: ["entity"],
    time: "A few days to quote; the filing itself is same-day once bound",
    gotchas: [
      "The minimum is $750,000 for non-hazardous property. Hauling oil or certain hazardous materials moves it to $1,000,000, and the most dangerous classes to $5,000,000.",
      "FMCSA does not require cargo insurance for general freight, but brokers and shippers almost always ask for it (commonly $100,000). Price it in.",
      "The policy must be issued to the exact legal name on your application, or the filing will not match and your authority will stall.",
    ],
    citeLabel: "49 CFR 387.9 - Financial responsibility, minimum levels",
    cite: "https://www.ecfr.gov/current/title-49/section-387.9",
    partner: "insurance",
    free: true,
  },
  {
    id: "login",
    phase: "federal",
    title: "Create a Login.gov account and sign in to Motus",
    summary:
      "Motus is FMCSA's registration system - it replaced the old system in May 2026, and the old one is permanently offline. You sign in with a Login.gov account (two-factor required), accept the rules of behavior, and build your user profile.",
    fee: "$0",
    where: "motus.dot.gov, via Login.gov",
    url: "https://motus.dot.gov/",
    needs: [],
    time: "15 minutes",
    gotchas: [
      "FMCSA's quick-start guide says not to use your public business email for the Motus user profile - use a private address you control.",
      "If you ever had an FMCSA Portal login, use the same email so your history links up.",
    ],
    citeLabel: "FMCSA - Motus Quick-Start (first login)",
    cite: "https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/2026-05/Motus%20Quickstart%20First%20Login.pdf",
    free: false,
  },
  {
    id: "identity",
    phase: "federal",
    title: "Verify your identity (you, personally, on your phone)",
    summary:
      "Every new applicant proves who they are through FMCSA's identity partner, IDEMIA: scan a QR code with a smartphone or tablet, photograph a valid government ID and take a selfie. Roughly 800,000 existing carriers are going through the same check the first time they log in. Anyone who applies on your behalf must pass the same check - and you, the company official, still sign the final certifications yourself.",
    fee: "No fee listed by FMCSA",
    where: "Inside Motus, on your phone (walk-in enrollment centers exist if the phone route fails)",
    url: "https://www.fmcsa.dot.gov/registration/identity-verification-enrollment-center-locations",
    needs: ["login"],
    time: "Minutes; unlimited attempts",
    gotchas: [
      "Accepted IDs are from the United States, Mexico and Canada only; for Mexico, only a passport is accepted.",
      "This is why 'we do it all for you' services cannot fully do it anymore. The person holding the phone is the person on the ID.",
      "Trouble? FMCSA's identity hotline is 1-833-832-5530.",
    ],
    citeLabel: "Federal Register - Availability of Motus (Apr 29, 2026)",
    cite: "https://www.federalregister.gov/documents/2026/04/29/2026-08334/availability-of-motus-fmcsas-new-registration-system",
    free: false,
  },
  {
    id: "usdot",
    phase: "federal",
    title: "Apply for your USDOT number (free)",
    summary:
      "From your Motus profile, start a new registration and create the company account. The USDOT number is the federal ID for the trucking business itself. There is no charge for it, and each USDOT number has exactly one designated Company Official - the owner, a partner or an authorized officer. That is you.",
    fee: "$0 - there is no charge for a USDOT number",
    where: "Motus - Start a New Registration",
    url: "https://www.fmcsa.dot.gov/registration/move-motus",
    needs: ["identity", "entity", "ein"],
    time: "30-60 minutes of questions",
    gotchas: [
      "Motus randomizes newly issued USDOT numbers, so your number will not look like a sequence - that is normal.",
      "The company name, address and entity type you enter must match your EIN paperwork and your insurance exactly.",
    ],
    citeLabel: "FMCSA FAQ - USDOT number cost and Company Official",
    cite: "https://www.fmcsa.dot.gov/faq?keyword=USDOT%20number&page=2",
    free: false,
  },
  {
    id: "authority",
    phase: "federal",
    title: "Apply for operating authority and pay the $300",
    summary:
      "Operating authority is the federal permission to haul other people's freight for money across state lines. For a general-freight trucker the type is 'Motor Carrier of Property (except household goods)'. The fee is $300 per authority type, paid through Pay.gov inside the application, and it is non-refundable. FMCSA then publishes your application in its Register and anyone has 10 days to protest it.",
    fee: "$300 per authority type, non-refundable",
    where: "Motus, paid through Pay.gov",
    url: "https://www.fmcsa.dot.gov/registration/get-mc-number-authority-operate",
    needs: ["usdot"],
    time: "FMCSA's guidance: 20-25 business days typical; applications picked for vetting can add 2-8 weeks",
    gotchas: [
      "Apply for one authority type unless you truly need more - every extra type is another non-refundable $300.",
      "You cannot haul a for-hire load until the authority is ACTIVE. Applied is not active.",
      "Since September 30, 2025 FMCSA takes no paper payments - everything runs through Pay.gov.",
      "Motus shows the reason behind a Pending status (FMCSA Review, Process Agent filing, or Financial Responsibility filing). Read it - it tells you who owes the next move.",
    ],
    citeLabel: "49 CFR 365.115 - Protests (10-day window)",
    cite: "https://www.ecfr.gov/current/title-49/section-365.115",
    free: false,
  },
  {
    id: "insurance-file",
    phase: "federal",
    title: "Your insurer files the BMC-91 or BMC-91X",
    summary:
      "Once your application is published, call your agent and give them the docket number. The insurance company files the proof-of-coverage form (BMC-91 or BMC-91X) electronically in Motus. FMCSA will not grant authority until that filing is on file, and the deadline is 20 days from publication.",
    fee: "$0 to FMCSA (your premium goes to the insurer)",
    where: "Filed by your insurance company inside Motus",
    url: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements",
    needs: ["authority", "insurance-quote"],
    time: "Usually 1-3 business days after you ask",
    gotchas: [
      "Miss the 20 days and FMCSA sends a dismissal notice; you then have 60 days to fix it or the application is dismissed and the $300 is gone.",
      "Your status will read 'Pending - Financial Responsibility Filings' until this lands.",
    ],
    citeLabel: "FMCSA - Insurance filing requirements",
    cite: "https://www.fmcsa.dot.gov/registration/insurance-filing-requirements",
    free: false,
  },
  {
    id: "boc3",
    phase: "federal",
    title: "A process agent files your BOC-3",
    summary:
      "Form BOC-3 names a company that can receive legal papers for you in every state. Only a process agent can file it, and a 'blanket' agent covers all 48 contiguous states plus DC in one filing. It has to be on file within 20 days of publication, same as the insurance. Retail price from the agents themselves runs about $35 to $75, one time.",
    fee: "About $35-$75 one time, paid to the process-agent company (no FMCSA fee)",
    where: "Any blanket process agent on FMCSA's list",
    url: "https://www.fmcsa.dot.gov/registration/form-boc-3-designation-agents-service-process",
    needs: ["authority"],
    time: "Minutes to hours after you order",
    gotchas: [
      "You cannot file this yourself - the rule says only a process agent can. Pick one from FMCSA's own list of blanket agents, not from an ad.",
      "Your status will read 'Pending - Process Agent (Form BOC-3) Filings' until the agent submits it.",
    ],
    citeLabel: "49 CFR 366.4 - Designation of process agents",
    cite: "https://www.ecfr.gov/current/title-49/section-366.4",
    partner: "boc3",
    free: false,
  },
  {
    id: "active",
    phase: "federal",
    title: "Watch for ACTIVE - then you can haul for hire",
    summary:
      "After the 10-day protest window closes and both filings are in, FMCSA grants the authority by issuing your certificate and the status flips to active. Check it in Motus or on FMCSA's SAFER lookup. Print the certificate and keep a copy in the truck.",
    fee: "$0",
    where: "Motus status page; FMCSA SAFER company snapshot",
    url: "https://safer.fmcsa.dot.gov/",
    needs: ["insurance-file", "boc3"],
    time: "Per FMCSA's decision; most new carriers see it inside the 20-25 business day window",
    gotchas: [
      "Do not book a paid load on 'it should be active by Friday'. Brokers check SAFER before they tender freight.",
      "A newly issued docket number carries a suffix; C means property-carrier authority.",
    ],
    citeLabel: "49 CFR 365.115 - grant effective by issuance of certificate",
    cite: "https://www.ecfr.gov/current/title-49/section-365.115",
    free: false,
  },
  {
    id: "ucr",
    phase: "federal",
    title: "Register with UCR (annual, $46 for 1-2 trucks)",
    summary:
      "The Unified Carrier Registration is a yearly fee every interstate for-hire carrier pays, sized by fleet. For 0-2 vehicles it is $46 for the 2026 registration year and $55 for 2027; the 2027 window opens October 1, 2026, and you must be registered before January 1 of the year you are paying for.",
    fee: "$46 (2026) / $55 (2027) for 0-2 vehicles, once a year",
    where: "ucr.gov (the official national registration system)",
    url: "https://www.ucr.gov/",
    needs: ["usdot"],
    time: "10 minutes",
    gotchas: [
      "Register only at ucr.gov or through your state - lookalike sites charge 'service fees' on top of the $46.",
      "Some states (for example Arizona, Florida, Nevada, Oregon and New Jersey) do not participate in UCR; carriers based there still register, through a participating state.",
    ],
    citeLabel: "UCR Plan - Fee brackets",
    cite: "https://plan.ucr.gov/fee-brackets",
    free: false,
  },
  {
    id: "drug",
    phase: "operate",
    title: "Join a drug and alcohol testing consortium - and test yourself first",
    summary:
      "A self-employed CDL driver is both the employer and the driver, and the rules apply both ways. You must be in a random testing pool run by a consortium (you cannot run your own pool of one), and you must have a negative pre-employment drug test result before your first safety-sensitive work - yes, on yourself. The 2026 random rates are 50% for drugs and 10% for alcohol.",
    fee: "About $66-$85 per year for the consortium, plus the tests themselves",
    where: "A DOT consortium / third-party administrator (C/TPA)",
    url: "https://www.fmcsa.dot.gov/regulations/drug-alcohol-testing/what-are-consortiumthird-party-administrators",
    needs: ["usdot"],
    time: "Same-day enrollment; the pre-employment test takes a lab visit",
    gotchas: [
      "No testing program and no random pool are two of the 16 automatic failures on the New Entrant safety audit. This is not optional paperwork.",
      "Keep the consortium certificate and your negative test result in your file - an auditor asks for both.",
    ],
    citeLabel: "49 CFR 382.103(b) and 382.301",
    cite: "https://www.ecfr.gov/current/title-49/part-382/subpart-A/section-382.103",
    partner: "consortium",
    free: false,
  },
  {
    id: "clearinghouse",
    phase: "operate",
    title: "Register in the Clearinghouse and query yourself",
    summary:
      "The FMCSA Drug and Alcohol Clearinghouse is the federal database of CDL drug-test violations. As an owner-operator you register as both employer and driver, designate your consortium as your C/TPA (you cannot take any action until you do), then run a full query on yourself before your first load and at least one query every year after. Queries cost $1.25 each and never expire.",
    fee: "$1.25 per query",
    where: "clearinghouse.fmcsa.dot.gov",
    url: "https://clearinghouse.fmcsa.dot.gov/Learn/Owner-Operator",
    needs: ["drug"],
    time: "30 minutes",
    gotchas: [
      "Since April 27, 2026 the Clearinghouse itself requires identity proofing for certain account types - another reason to do it yourself.",
      "Your consortium cannot buy queries for you; the employer account buys them.",
    ],
    citeLabel: "49 CFR 382.701 and 382.705",
    cite: "https://www.ecfr.gov/current/title-49/part-382/subpart-G/section-382.701",
    free: false,
  },
  {
    id: "hvut",
    phase: "state",
    title: "File IRS Form 2290 (heavy vehicle use tax)",
    summary:
      "Any truck with a taxable gross weight of 55,000 lbs or more owes the federal heavy vehicle use tax every year. The tax year runs July 1 to June 30. If you first use the truck in July, file by August 31; otherwise file by the last day of the month after the month you first put it on the road. At 75,000 lbs and up the tax is $550. The stamped Schedule 1 the IRS returns is what your state needs before it will plate the truck.",
    fee: "$100 at 55,000 lbs, rising to $550 at 75,000 lbs and over, per year",
    where: "IRS - e-file through an approved provider, or paper",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/trucking-tax-center",
    needs: ["ein"],
    time: "Minutes online; e-filed Schedule 1 comes back fast, paper takes weeks",
    gotchas: [
      "You need an EIN - the IRS does not accept a Social Security number on Form 2290.",
      "The filing deadline is tied to the month you first use the truck, not to when you registered it.",
      "Keep the stamped Schedule 1; the IRP office will ask for it.",
    ],
    citeLabel: "IRS - Trucking Tax Center",
    cite: "https://www.irs.gov/businesses/small-businesses-self-employed/trucking-tax-center",
    free: false,
  },
  {
    id: "irp",
    phase: "state",
    title: "Get apportioned plates (IRP) from your base state",
    summary:
      "If your combined weight is over 26,000 lbs and you run in two or more states, you register the truck once with your base state under the International Registration Plan and get plates good in every state. Fees are split among the states by the share of miles you run in each. Bring your stamped Schedule 1, proof of insurance and your business paperwork.",
    fee: "Varies by state and by your mileage split",
    where: "Your base state's IRP office (usually the DMV or motor carrier division)",
    url: "https://www.irponline.org/",
    needs: ["hvut", "insurance-quote"],
    time: "Same day to a few weeks depending on the state",
    gotchas: [
      "You must renew every year in the month your base state assigns - that is one of the dates the Stay Legal calendar tracks.",
      "Most states want an established place of business in the state before they will be your base.",
    ],
    citeLabel: "International Registration Plan, Inc.",
    cite: "https://www.irponline.org/",
    free: false,
  },
  {
    id: "ifta",
    phase: "state",
    title: "Get your IFTA license and decals",
    summary:
      "The International Fuel Tax Agreement lets you file one fuel-tax return for every state you drove in instead of one per state. Your base state issues the license and two decals per truck. Then, every quarter, you file a return - due April 30, July 31, October 31 and January 31 - even for a quarter with zero miles. The license expires December 31 and is renewed yearly.",
    fee: "Base-state fee (often small or $0); the quarterly return settles tax owed or credited",
    where: "Your base state's IFTA office (often the same office as IRP)",
    url: "https://www.iftach.org/",
    needs: ["irp"],
    time: "Same day to a few weeks",
    gotchas: [
      "File the quarterly return even if you did not move - 'tax returns are required even if no operations were conducted'. A missed zero return is still a missed return.",
      "Keep every fuel receipt and your mileage by state; the return is built from them.",
    ],
    citeLabel: "IFTA - Articles of Agreement (2026)",
    cite: "https://www.iftach.org/manuals/2026/AA/Articles%20of%20Agreement%20-%2003-11-2026.pdf",
    free: false,
  },
  {
    id: "state-extra",
    phase: "state",
    title: "Four states charge by the mile - register before you enter them",
    summary:
      "Kentucky (KYU, trucks over 59,999 lbs, $0.0285 per mile, quarterly), New Mexico (weight-distance permit for trucks over 26,000 lbs, renewed yearly, quarterly returns), New York (highway use tax certificate and decal for trucks over 18,000 lbs, returns usually quarterly) and Oregon (weight-mile tax over 26,000 lbs, monthly reports, bond required) each want their own registration and their own returns - and all four want a return even for a period with no miles.",
    fee: "Small registration fees plus per-mile tax when you run there",
    where: "Each state's motor carrier or tax site",
    url: "https://drive.ky.gov/motor-carriers/Pages/KYU.aspx",
    needs: ["irp"],
    time: "Minutes each, online",
    gotchas: [
      "Kentucky revokes a KYU license for skipped zero-mile returns and charges a $500 reinstatement fee.",
      "New York fines $500 to $2,000 for a first offense of running without the HUT certificate; a $25 trip certificate covers a one-off (max 10 a year).",
      "Oregon sells a temporary pass ($9 plus the mileage tax) if you rarely go there.",
    ],
    citeLabel: "KY KYU / NM WDT / NY HUT / OR weight-mile pages",
    cite: "https://www.tax.ny.gov/bus/hut/huidx.htm",
    free: false,
  },
  {
    id: "eld",
    phase: "operate",
    title: "Put a registered ELD in the truck (unless you are exempt)",
    summary:
      "An electronic logging device records your hours of service. Most interstate drivers need one. You are exempt if you stay within 150 air-miles and are off the clock within 14 hours (short-haul), if you keep paper logs no more than 8 days in any 30, or if the truck's engine is older than model year 2000. Devices FMCSA removed from its registry in August 2026 must be replaced by October 6, 2026.",
    fee: "Device plus a monthly subscription (vendor pricing varies)",
    where: "Any device on FMCSA's registered ELD list",
    url: "https://eld.fmcsa.dot.gov/",
    needs: ["active"],
    time: "An afternoon to install and set up",
    gotchas: [
      "Buy only from FMCSA's registered list - a delisted device is the same as no device at a roadside inspection.",
      "If the ELD breaks you have 8 days to fix or replace it, and you keep paper logs meanwhile.",
      "The carrier keeps 6 months of logs; the driver carries the previous 7 days.",
    ],
    citeLabel: "49 CFR 395.8 and FMCSA ELD registry",
    cite: "https://www.ecfr.gov/current/title-49/part-395/section-395.8",
    partner: "eld",
    free: false,
  },
  {
    id: "files",
    phase: "operate",
    title: "Build your paperwork file (you are your own safety department)",
    summary:
      "Keep a driver qualification file on yourself: your CDL, your medical certificate (a new DOT physical at least every 24 months, from an examiner on the National Registry), a motor vehicle record pulled and reviewed at least once every 12 months, and your road test or equivalent. Keep maintenance records for any truck you control 30 days or more, a periodic inspection on the tractor AND the trailer at least every 12 months, and the daily inspection report whenever you find a defect.",
    fee: "Physical and MVR fees vary; the file itself costs nothing",
    where: "A folder in the truck and a copy at home (or in the cloud)",
    url: "https://www.ecfr.gov/current/title-49/section-391.51",
    needs: ["active"],
    time: "An hour to set up; minutes a month to keep",
    gotchas: [
      "Since June 23, 2025 the medical examiner sends your certificate to the state electronically - still verify the examiner is on the National Registry before you pay for the physical.",
      "Annual inspection proof rides with the vehicle; the report itself is kept 14 months. The qualification file is kept 3 years after you stop driving for the company.",
    ],
    citeLabel: "49 CFR 391.45, 391.25, 391.51, 396.3, 396.17",
    cite: "https://www.ecfr.gov/current/title-49/section-391.45",
    free: false,
  },
  {
    id: "roadside",
    phase: "operate",
    title: "Know what a roadside inspection checks - including your English",
    summary:
      "Inspectors check the ELD, the medical card, the insurance card, IRP cab card and IFTA decals, the annual inspection sticker and the vehicle itself. Since June 25, 2025 they also apply the English-proficiency rule: a driver must be able to read and speak English well enough to talk with the public, understand traffic signs, respond to officials and fill out reports, and a failure puts the driver out of service on the spot. Between June 2025 and March 2026 that rule produced 60,399 violations and 19,045 out-of-service orders.",
    fee: "$0",
    where: "Weigh stations and roadside",
    url: "https://www.ecfr.gov/current/title-49/part-391/section-391.11",
    needs: ["active"],
    time: "Ongoing",
    gotchas: [
      "The rule is in 49 CFR 391.11(b)(2). FMCSA published a proposed rule on August 10, 2026 to write the out-of-service criteria into regulation.",
      "A separate rule effective March 16, 2026 tightened CDLs for drivers domiciled outside the United States; it does not change anything for U.S. residents.",
    ],
    citeLabel: "49 CFR 391.11(b)(2)",
    cite: "https://www.ecfr.gov/current/title-49/part-391/section-391.11",
    free: false,
  },
  {
    id: "audit",
    phase: "operate",
    title: "Pass the New Entrant safety audit in your first year",
    summary:
      "For your first 18 months you are a 'new entrant' and FMCSA monitors you. A safety audit comes within your first 12 months. Sixteen violations fail it automatically, and they are all paperwork you control: no drug and alcohol program, no random pool, a driver without a valid CDL, no insurance in force, no hours-of-service records, or operating a vehicle that was placed out of service before it was fixed. If you fail, you get 60 days to prove you fixed it or your registration is revoked.",
    fee: "$0",
    where: "FMCSA or state auditor, usually remote",
    url: "https://www.fmcsa.dot.gov/safety/new-entrant-safety-assurance-program",
    needs: ["drug", "files", "eld"],
    time: "A few hours to produce the records; a few weeks of back-and-forth",
    gotchas: [
      "Everything in the 'Legal on the road' phase is exactly what the auditor asks for. Do it in month one, not month eleven.",
      "The audit can happen after just 3 months of operation - do not assume you have a year.",
    ],
    citeLabel: "49 CFR 385.321 - Automatic failure of the safety audit",
    cite: "https://www.ecfr.gov/current/title-49/section-385.321",
    free: false,
  },
  {
    id: "money",
    phase: "operate",
    title: "Get your first load - and get paid",
    summary:
      "Load boards are where brokers post freight; DAT One starts at $59 a month and Truckstop's basic plan at $42. Brokers usually pay 30 to 60 days after delivery, which is why most new carriers use a factoring company that pays within a day or two and keeps a percentage of each invoice. A fuel card takes cents off every gallon. None of this is a legal requirement - it is how the money moves.",
    fee: "Load board $42-$59 a month; factoring a percentage of each invoice; fuel cards usually free",
    where: "Load boards, factoring companies, fuel-card providers",
    url: "https://www.dat.com/",
    needs: ["active"],
    time: "A day to set up",
    gotchas: [
      "Read the factoring contract for the term and the exit fee before you sign - the rate is not the only number.",
      "Brokers check your SAFER page and your insurance before they tender - new authority with everything in order gets loads; new authority with a Pending status does not.",
    ],
    citeLabel: "DAT One and Truckstop published pricing (Sept 2026)",
    cite: "https://www.dat.com/",
    partner: "loadboard",
    free: false,
  },
];

// The real government price list the landing page shows next to
// the "packages" - every line verified against the agency page.
export const HL_GOV_FEES: Array<{ item: string; cost: string; who: string }> = [
  { item: "USDOT number", cost: "$0", who: "FMCSA" },
  { item: "Operating authority (property carrier)", cost: "$300 one time", who: "FMCSA, via Pay.gov" },
  { item: "BOC-3 process agent filing", cost: "About $35-$75 one time", who: "A private process agent" },
  { item: "UCR registration, 1-2 trucks", cost: "$46 a year (2026), $55 (2027)", who: "UCR national registration" },
  { item: "Drug and alcohol consortium", cost: "About $66-$85 a year", who: "A private consortium" },
  { item: "Clearinghouse query", cost: "$1.25 each", who: "FMCSA Clearinghouse" },
  { item: "Heavy vehicle use tax, 80,000 lb truck", cost: "$550 a year", who: "IRS Form 2290" },
  { item: "Biennial update (MCS-150)", cost: "$0", who: "FMCSA" },
];

// What the market charges to do the same clicks for you (published
// prices, September 2026), for the landing's price table.
export const HL_MARKET: Array<{ label: string; value: string; ours?: boolean }> = [
  { label: "Authority 'packages' from filing services", value: "$300 - $995+" },
  { label: "DAT Authority (authority + BOC-3)", value: "$399" },
  { label: "Monthly compliance services", value: "$49.50 - $247 / mo" },
  { label: "HaulLegal launch walkthrough", value: "$249 once", ours: true },
  { label: "HaulLegal Stay Legal calendar", value: "$39 / mo, first month free", ours: true },
];

export const HL_FREE_STEP_IDS: string[] = HL_STEPS.filter((s) => s.free).map((s) => s.id);

export function getHlStep(id: string): HlStep | undefined {
  return HL_STEPS.find((s) => s.id === id);
}

export function stepsForPhase(phase: HlPhase): HlStep[] {
  return HL_STEPS.filter((s) => s.phase === phase);
}

// ============================================================
// END OF FILE - lib/haullegal/steps.ts (v1 - 23 verified steps in
// 4 phases, real government fee table, market price table)
// If you can see this comment, the paste was not truncated.
// ============================================================
