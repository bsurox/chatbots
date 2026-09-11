// FILE: lib/haullegal/deadlines.ts

// HaulLegal "Stay Legal" calendar rules (v2 - blank defaults: no
// switch is pre-selected; see HL_EMPTY_PROFILE). Every recurring
// obligation a one-truck interstate for-hire carrier keeps up with
// after the authority is active, with the exact frequency and
// due-date RULE (verified September 10, 2026 against eCFR, FMCSA,
// IRS, IFTA, UCR and the four weight-distance states), plus pure
// date helpers that turn a carrier's profile into a sorted list of
// upcoming due dates. The helpers take the "from" date as an
// argument on purpose: nothing here reads the clock, so the
// calendar page can call them from a useEffect and stay clean
// under the Next 16 prerender rule (no Date.now() in render).
// Self-contained: no imports, no server-only, safe to ship to the
// browser and to reuse from the reminder job later.

export type HlFreq =
  | "once"
  | "monthly"
  | "quarterly"
  | "annual"
  | "biennial"
  | "every-24-months"
  | "ongoing";

// "always" applies to every carrier; the rest switch on the profile.
export type HlWhen = "always" | "hvut" | "ifta" | "irp" | "eld" | "ky" | "nm" | "ny" | "or";

export type HlObligation = {
  id: string;
  title: string;
  summary: string;
  freq: HlFreq;
  rule: string;
  when: HlWhen;
  cost: string;
  missed: string;
  citeLabel: string;
  cite: string;
};

export const HL_OBLIGATIONS: HlObligation[] = [
  {
    id: "mcs150",
    title: "Biennial update (MCS-150)",
    summary: "Confirm or update your company information with FMCSA every two years, even if nothing changed. Name, address or business-form changes must be filed within 30 days whenever they happen.",
    freq: "biennial",
    rule: "The last digit of your USDOT number sets the month (1 = January ... 9 = September, 0 = October). If the next-to-last digit is odd you file in odd-numbered years; if even, in even-numbered years. Due by the last day of that month.",
    when: "always",
    cost: "$0",
    missed: "Deactivation of your USDOT number and civil penalties of up to $1,000 a day, capped at $10,000. (FMCSA paused deactivations during the Motus rollout starting June 1, 2026 - the duty did not go away.)",
    citeLabel: "49 CFR 390.19T / 390.201",
    cite: "https://www.ecfr.gov/current/title-49/section-390.201",
  },
  {
    id: "ucr",
    title: "UCR registration",
    summary: "Pay the Unified Carrier Registration fee for the coming year. 0-2 vehicles: $46 for 2026, $55 for 2027.",
    freq: "annual",
    rule: "Register and pay before January 1 of the registration year. The 2027 portal opens October 1, 2026.",
    when: "always",
    cost: "$46 (2026) / $55 (2027) for 0-2 vehicles",
    missed: "Roadside citations and fines set by each state; some states hold plates or registrations until UCR is paid.",
    citeLabel: "UCR Plan fee brackets",
    cite: "https://plan.ucr.gov/fee-brackets",
  },
  {
    id: "consortium",
    title: "Drug and alcohol consortium membership",
    summary: "Stay enrolled in a random testing pool all year. The 2026 random rates are 50% for drugs and 10% for alcohol, spread through the year, unannounced.",
    freq: "annual",
    rule: "Renew the enrollment before it lapses (most consortiums bill yearly from your enrollment date). Take every random test you are selected for, on the day.",
    when: "always",
    cost: "About $66-$85 a year plus tests",
    missed: "An automatic failure on the New Entrant audit and out-of-service exposure at roadside.",
    citeLabel: "49 CFR 382.103(b), 382.305",
    cite: "https://www.ecfr.gov/current/title-49/section-382.305",
  },
  {
    id: "query",
    title: "Clearinghouse annual query (on yourself)",
    summary: "Run at least one Clearinghouse query on every CDL driver you employ - including yourself - every year. A limited query is enough; if it finds a record you must run a full query within 24 hours.",
    freq: "annual",
    rule: "At least once every 12 months from the last query.",
    when: "always",
    cost: "$1.25 per query",
    missed: "A violation on audit; queries are one of the first things an auditor asks for.",
    citeLabel: "49 CFR 382.701",
    cite: "https://www.ecfr.gov/current/title-49/part-382/subpart-G/section-382.701",
  },
  {
    id: "medcard",
    title: "DOT medical certificate",
    summary: "A new physical from a National Registry examiner before your certificate expires - never more than 24 months apart, sooner if the examiner issued a shorter card.",
    freq: "every-24-months",
    rule: "Before the expiration date printed on the certificate (maximum 24 months from the exam).",
    when: "always",
    cost: "Exam fee varies by clinic",
    missed: "Your CDL medical status flips to not-certified and the state can downgrade the license; out of service at roadside.",
    citeLabel: "49 CFR 391.45",
    cite: "https://www.ecfr.gov/current/title-49/section-391.45",
  },
  {
    id: "mvr",
    title: "Annual driving-record (MVR) review",
    summary: "Pull your motor vehicle record from every state that licensed you in the last year, review it, and put a dated note in your qualification file.",
    freq: "annual",
    rule: "At least once every 12 months.",
    when: "always",
    cost: "State MVR fee (a few dollars)",
    missed: "A qualification-file violation on audit.",
    citeLabel: "49 CFR 391.25",
    cite: "https://www.ecfr.gov/current/title-49/section-391.25",
  },
  {
    id: "inspection",
    title: "Annual inspection - tractor AND trailer",
    summary: "Every commercial motor vehicle you run, including the trailer, passes a periodic inspection of every item in Appendix A at least once every 12 months. Proof rides on the vehicle; the report is kept 14 months.",
    freq: "annual",
    rule: "Within 12 months of the previous inspection, per vehicle.",
    when: "always",
    cost: "Shop fee varies",
    missed: "Out-of-service exposure at roadside and a maintenance violation on audit.",
    citeLabel: "49 CFR 396.17",
    cite: "https://www.ecfr.gov/current/title-49/part-396/section-396.17",
  },
  {
    id: "insurance",
    title: "Liability insurance renewal",
    summary: "Keep the $750,000 minimum liability policy in force without a gap. Your insurer's filing with FMCSA stays on file only while the policy does.",
    freq: "annual",
    rule: "Renew before the policy expiration date.",
    when: "always",
    cost: "Premium varies",
    missed: "The insurer cancels the federal filing, FMCSA revokes the authority, and you are not legal to haul for hire.",
    citeLabel: "49 CFR 387.9",
    cite: "https://www.ecfr.gov/current/title-49/section-387.9",
  },
  {
    id: "hvut",
    title: "Heavy vehicle use tax (Form 2290)",
    summary: "The federal tax on trucks of 55,000 lbs and up. The tax year runs July 1 to June 30; an 80,000-lb rig pays $550.",
    freq: "annual",
    rule: "By August 31 for a truck used in July. A truck first put on the road later in the year is due the last day of the month after its first-use month.",
    when: "hvut",
    cost: "$100 at 55,000 lbs up to $550 at 75,000 lbs and over",
    missed: "IRS penalties and interest, and no stamped Schedule 1 for your plates.",
    citeLabel: "IRS Trucking Tax Center",
    cite: "https://www.irs.gov/businesses/small-businesses-self-employed/trucking-tax-center",
  },
  {
    id: "ifta-q",
    title: "IFTA quarterly fuel-tax return",
    summary: "Report miles and fuel by state for the quarter. Required even for a quarter with zero miles.",
    freq: "quarterly",
    rule: "Last day of the month after the quarter ends: April 30, July 31, October 31 and January 31 (next business day if that falls on a weekend or holiday).",
    when: "ifta",
    cost: "Tax owed or credited",
    missed: "Penalty and interest set by your base state; repeated misses revoke the license.",
    citeLabel: "IFTA Articles of Agreement",
    cite: "https://www.iftach.org/manuals/2026/AA/Articles%20of%20Agreement%20-%2003-11-2026.pdf",
  },
  {
    id: "ifta-renew",
    title: "IFTA license and decal renewal",
    summary: "The license expires December 31. Renew and put the new year's two decals on each truck. If the renewal is filed, January and February are a grace period for displaying them.",
    freq: "annual",
    rule: "Before December 31.",
    when: "ifta",
    cost: "Base-state fee",
    missed: "Running without a valid license or decals is a citation in every member state.",
    citeLabel: "IFTA renewal grace period bulletin",
    cite: "https://www.iftach.org/bulletins/2026%20Renewal%20Grace%20Period.pdf",
  },
  {
    id: "irp",
    title: "IRP apportioned registration renewal",
    summary: "Renew the apportioned plates and cab card with your base state. You will need a current stamped Schedule 1 from Form 2290.",
    freq: "annual",
    rule: "In the renewal month your base state assigned when it issued the plates.",
    when: "irp",
    cost: "Distance-based fees",
    missed: "Expired plates: the truck is not registered to run interstate.",
    citeLabel: "IRP, Inc.",
    cite: "https://www.irponline.org/",
  },
  {
    id: "kyu",
    title: "Kentucky KYU weight-distance return",
    summary: "Trucks with a combined license weight over 59,999 lbs that run Kentucky roads pay $0.0285 per mile and file quarterly - including zero-mile returns.",
    freq: "quarterly",
    rule: "Last day of the month after the quarter: April 30, July 31, October 31 and January 31.",
    when: "ky",
    cost: "$0.0285 per Kentucky mile",
    missed: "Penalty, interest and a $500 revocation fee to get the KYU license back.",
    citeLabel: "Kentucky KYU",
    cite: "https://drive.ky.gov/motor-carriers/Pages/KYU.aspx",
  },
  {
    id: "nm",
    title: "New Mexico weight-distance return and permit",
    summary: "Trucks over 26,000 lbs need a New Mexico weight-distance permit for each vehicle, renewed every year, and file a quarterly return even for a quarter with no New Mexico miles.",
    freq: "quarterly",
    rule: "Returns due April 30, July 31, October 31 and January 31; the electronic permit is renewed each year.",
    when: "nm",
    cost: "Per-mile tax by weight class",
    missed: "Penalty and interest; running without the permit is a citation.",
    citeLabel: "New Mexico Taxation and Revenue - Weight Distance Tax",
    cite: "https://www.tax.newmexico.gov/businesses/weight-distance-tax/",
  },
  {
    id: "ny",
    title: "New York highway use tax return",
    summary: "Trucks over 18,000 lbs need a New York HUT certificate and decal ($1.50 per vehicle) and file returns - quarterly for most new carriers - even when no tax is due.",
    freq: "quarterly",
    rule: "Last day of the month after the period (quarterly unless the state moves you to annual or monthly filing based on last year's tax).",
    when: "ny",
    cost: "Per-mile tax; certificate $1.50 per vehicle",
    missed: "Late returns cost 10% plus 1% a month (max 30%); running without the certificate is a $500-$2,000 fine the first time.",
    citeLabel: "NY Tax - Highway use tax filing requirements",
    cite: "https://www.tax.ny.gov/pubs_and_bulls/tg_bulletins/hut/filing_requirements.htm",
  },
  {
    id: "or",
    title: "Oregon weight-mile tax report",
    summary: "Trucks over 26,000 lbs running Oregon pay by the mile ($0.2512 per mile at 78,001-80,000 lbs) and report MONTHLY unless the state approves quarterly filing. A bond is required to enroll.",
    freq: "monthly",
    rule: "Postmarked by the last day of the month for the previous month's operations.",
    when: "or",
    cost: "$0.2512 per Oregon mile at 78,001-80,000 lbs",
    missed: "10% late penalty plus interest; the account can be suspended.",
    citeLabel: "Oregon ODOT - File tax reports",
    cite: "https://www.oregon.gov/odot/MCT/Pages/File-Tax-Reports.aspx",
  },
  {
    id: "audit",
    title: "New Entrant safety audit",
    summary: "FMCSA monitors you for 18 months and audits you inside the first 12. It can come after only 3 months of operation.",
    freq: "once",
    rule: "Within 12 months of your authority going active; have the drug program, driver file, logs, maintenance and insurance records ready from month one.",
    when: "always",
    cost: "$0",
    missed: "Fail the audit and you have 60 days to prove corrections or the registration is revoked.",
    citeLabel: "49 CFR 385.307 / 385.321",
    cite: "https://www.ecfr.gov/current/title-49/section-385.321",
  },
  {
    id: "eld",
    title: "Logbook (ELD) housekeeping",
    summary: "Keep 6 months of logs and supporting documents; carry the previous 7 days in the truck; a broken ELD must be fixed or replaced within 8 days.",
    freq: "ongoing",
    rule: "Every driving day.",
    when: "eld",
    cost: "ELD subscription",
    missed: "Hours-of-service violations are among the most common out-of-service orders at roadside, and no HOS records is an automatic audit failure.",
    citeLabel: "49 CFR 395.8",
    cite: "https://www.ecfr.gov/current/title-49/part-395/section-395.8",
  },
  {
    id: "records",
    title: "Maintenance records and daily inspection reports",
    summary: "For any vehicle you control 30 days or more, keep a maintenance schedule and a record of every inspection and repair (kept 1 year, and 6 months after the vehicle leaves you). Write a driver vehicle inspection report whenever a defect turns up; keep it 3 months.",
    freq: "ongoing",
    rule: "Continuous.",
    when: "always",
    cost: "$0",
    missed: "Maintenance violations on audit and at roadside.",
    citeLabel: "49 CFR 396.3, 396.11",
    cite: "https://www.ecfr.gov/current/title-49/part-396/section-396.3",
  },
];

// ---- Carrier profile the calendar is built from -------------------

export type HlProfile = {
  usdot?: string;
  authorityActive?: string;
  medCardIssued?: string;
  lastMvr?: string;
  lastQuery?: string;
  consortiumEnrolled?: string;
  tractorInspected?: string;
  trailerInspected?: string;
  insuranceRenews?: string;
  irpRenews?: string;
  firstUseMonth?: number;
  firstUseYear?: number;
  hvut: boolean;
  ifta: boolean;
  irp: boolean;
  eld: boolean;
  ky: boolean;
  nm: boolean;
  ny: boolean;
  or: boolean;
};

// v2: every switch starts OFF. Nothing is assumed about the
// carrier's operation - the calendar page asks him to select all
// that apply, and a saved profile always carries explicit values.
export const HL_EMPTY_PROFILE: HlProfile = {
  hvut: false,
  ifta: false,
  irp: false,
  eld: false,
  ky: false,
  nm: false,
  ny: false,
  or: false,
};

export type HlDue = {
  id: string;
  obligationId: string;
  title: string;
  due: Date;
  detail: string;
};

// ---- Pure date helpers (local dates at noon, no clock reads) ------

export function localDate(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function lastDayOfMonth(y: number, m: number): Date {
  return new Date(y, m, 0, 12, 0, 0, 0);
}

export function parseYmd(s: string | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const d = localDate(Number(m[1]), Number(m[2]), Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addMonths(date: Date, n: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth() + n;
  const d = date.getDate();
  const target = new Date(y, m, 1, 12, 0, 0, 0);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, last));
  return target;
}

export function daysUntil(due: Date, from: Date): number {
  const a = localDate(from.getFullYear(), from.getMonth() + 1, from.getDate()).getTime();
  return Math.round((due.getTime() - a) / 86400000);
}

export function formatYmd(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// MCS-150: month from the last digit, parity from the next-to-last.
export function mcs150Slot(usdot: string | undefined): { month: number; parity: "odd" | "even" } | null {
  const digits = (usdot ?? "").replace(/\D/g, "");
  if (digits.length < 2) return null;
  const last = Number(digits[digits.length - 1]);
  const prev = Number(digits[digits.length - 2]);
  const month = last === 0 ? 10 : last;
  return { month, parity: prev % 2 === 1 ? "odd" : "even" };
}

export function nextMcs150Due(usdot: string | undefined, from: Date): Date | null {
  const slot = mcs150Slot(usdot);
  if (!slot) return null;
  for (let y = from.getFullYear(); y <= from.getFullYear() + 2; y++) {
    const isOdd = y % 2 === 1;
    if ((slot.parity === "odd") !== isOdd) continue;
    const due = lastDayOfMonth(y, slot.month);
    if (due.getTime() >= from.getTime()) return due;
  }
  return null;
}

// Quarterly returns: Jan 31, Apr 30, Jul 31, Oct 31.
export function nextQuarterlyDue(from: Date): Date {
  const y = from.getFullYear();
  const candidates = [lastDayOfMonth(y, 1), lastDayOfMonth(y, 4), lastDayOfMonth(y, 7), lastDayOfMonth(y, 10), lastDayOfMonth(y + 1, 1)];
  for (const c of candidates) {
    if (c.getTime() >= from.getTime()) return c;
  }
  return candidates[candidates.length - 1];
}

// Monthly reports (Oregon): last day of this month, else next month.
export function nextMonthlyDue(from: Date): Date {
  const thisMonth = lastDayOfMonth(from.getFullYear(), from.getMonth() + 1);
  if (thisMonth.getTime() >= from.getTime()) return thisMonth;
  return lastDayOfMonth(from.getFullYear(), from.getMonth() + 2);
}

// UCR: pay for next year before January 1 - treat December 31 as the due date.
export function nextUcrDue(from: Date): Date {
  return lastDayOfMonth(from.getFullYear(), 12);
}

// IFTA license renewal: December 31.
export function nextIftaRenewal(from: Date): Date {
  return lastDayOfMonth(from.getFullYear(), 12);
}

// Form 2290: August 31 each year; a later first-use month in the
// current tax year is due the last day of the following month.
export function next2290Due(from: Date, firstUseMonth?: number, firstUseYear?: number): Date {
  if (firstUseMonth && firstUseYear && firstUseMonth >= 1 && firstUseMonth <= 12) {
    const special = firstUseMonth === 12 ? lastDayOfMonth(firstUseYear + 1, 1) : lastDayOfMonth(firstUseYear, firstUseMonth + 1);
    if (special.getTime() >= from.getTime() && firstUseMonth !== 7) return special;
  }
  const thisYear = lastDayOfMonth(from.getFullYear(), 8);
  if (thisYear.getTime() >= from.getTime()) return thisYear;
  return lastDayOfMonth(from.getFullYear() + 1, 8);
}

function nextAnniversary(base: Date | null, months: number, from: Date): Date | null {
  if (!base) return null;
  let d = addMonths(base, months);
  let guard = 0;
  while (d.getTime() < from.getTime() && guard < 40) {
    d = addMonths(d, months);
    guard += 1;
  }
  return d;
}

function title(id: string): string {
  return HL_OBLIGATIONS.find((o) => o.id === id)?.title ?? id;
}

// ---- The calendar --------------------------------------------------

export function buildCalendar(profile: HlProfile, from: Date): { dues: HlDue[]; missing: string[] } {
  const dues: HlDue[] = [];
  const missing: string[] = [];

  const mcs = nextMcs150Due(profile.usdot, from);
  if (mcs) {
    const slot = mcs150Slot(profile.usdot);
    dues.push({ id: "mcs150", obligationId: "mcs150", title: title("mcs150"), due: mcs, detail: `Your USDOT number puts you in month ${slot?.month} of ${slot?.parity}-numbered years. Free, in Motus.` });
  } else {
    missing.push("USDOT number (sets your biennial update month)");
  }

  dues.push({ id: "ucr", obligationId: "ucr", title: title("ucr"), due: nextUcrDue(from), detail: "Register for next year at ucr.gov before January 1." });

  if (profile.hvut) {
    dues.push({ id: "hvut", obligationId: "hvut", title: title("hvut"), due: next2290Due(from, profile.firstUseMonth, profile.firstUseYear), detail: "IRS Form 2290. Keep the stamped Schedule 1 for your plates." });
  }
  if (profile.ifta) {
    dues.push({ id: "ifta-q", obligationId: "ifta-q", title: title("ifta-q"), due: nextQuarterlyDue(from), detail: "File even for a zero-mile quarter." });
    dues.push({ id: "ifta-renew", obligationId: "ifta-renew", title: title("ifta-renew"), due: nextIftaRenewal(from), detail: "New license and two decals per truck for the coming year." });
  }
  if (profile.ky) dues.push({ id: "kyu", obligationId: "kyu", title: title("kyu"), due: nextQuarterlyDue(from), detail: "Zero-mile returns are still required." });
  if (profile.nm) dues.push({ id: "nm", obligationId: "nm", title: title("nm"), due: nextQuarterlyDue(from), detail: "Return required even with no New Mexico miles; permit renews yearly." });
  if (profile.ny) dues.push({ id: "ny", obligationId: "ny", title: title("ny"), due: nextQuarterlyDue(from), detail: "File even when no tax is due." });
  if (profile.or) dues.push({ id: "or", obligationId: "or", title: title("or"), due: nextMonthlyDue(from), detail: "Monthly report for last month's Oregon miles." });

  const med = nextAnniversary(parseYmd(profile.medCardIssued), 24, from);
  if (med) dues.push({ id: "medcard", obligationId: "medcard", title: title("medcard"), due: med, detail: "Latest possible date - use the expiration printed on your card if it is sooner." });
  else missing.push("Date of your last DOT physical (medical card)");

  const mvr = nextAnniversary(parseYmd(profile.lastMvr), 12, from);
  if (mvr) dues.push({ id: "mvr", obligationId: "mvr", title: title("mvr"), due: mvr, detail: "Pull, review, and date-stamp it into your qualification file." });
  else missing.push("Date of your last driving-record (MVR) review");

  const q = nextAnniversary(parseYmd(profile.lastQuery), 12, from);
  if (q) dues.push({ id: "query", obligationId: "query", title: title("query"), due: q, detail: "$1.25 in the Clearinghouse. A limited query is enough." });
  else missing.push("Date of your last Clearinghouse query");

  const con = nextAnniversary(parseYmd(profile.consortiumEnrolled), 12, from);
  if (con) dues.push({ id: "consortium", obligationId: "consortium", title: title("consortium"), due: con, detail: "Renew before it lapses - there is no grace period on a random pool." });
  else missing.push("Date you enrolled in your drug and alcohol consortium");

  const tr = nextAnniversary(parseYmd(profile.tractorInspected), 12, from);
  if (tr) dues.push({ id: "inspection-tractor", obligationId: "inspection", title: "Annual inspection - tractor", due: tr, detail: "Full Appendix A inspection; proof stays on the truck." });
  else missing.push("Date of the tractor's last annual inspection");

  const tl = nextAnniversary(parseYmd(profile.trailerInspected), 12, from);
  if (tl) dues.push({ id: "inspection-trailer", obligationId: "inspection", title: "Annual inspection - trailer", due: tl, detail: "The trailer is its own commercial motor vehicle - it needs its own inspection." });
  else missing.push("Date of the trailer's last annual inspection");

  const ins = nextAnniversary(parseYmd(profile.insuranceRenews), 12, from);
  if (ins) dues.push({ id: "insurance", obligationId: "insurance", title: title("insurance"), due: ins, detail: "No gap, ever - a lapse cancels your federal filing." });
  else missing.push("Your insurance policy renewal date");

  if (profile.irp) {
    const irp = nextAnniversary(parseYmd(profile.irpRenews), 12, from);
    if (irp) dues.push({ id: "irp", obligationId: "irp", title: title("irp"), due: irp, detail: "Bring the current stamped Schedule 1." });
    else missing.push("Your IRP plate renewal date");
  }

  const active = parseYmd(profile.authorityActive);
  if (active) {
    const audit = addMonths(active, 12);
    if (audit.getTime() >= from.getTime()) {
      dues.push({ id: "audit", obligationId: "audit", title: title("audit"), due: audit, detail: "Latest date for the New Entrant audit - it can come as early as month 3." });
    }
  } else {
    missing.push("The date your authority went active (starts the New Entrant clock)");
  }

  dues.sort((a, b) => a.due.getTime() - b.due.getTime());
  return { dues, missing };
}

// ============================================================
// END OF FILE - lib/haullegal/deadlines.ts (v2 - blank profile
// defaults; 19 verified obligations, date helpers, buildCalendar)
// If you can see this comment, the paste was not truncated.
// ============================================================
