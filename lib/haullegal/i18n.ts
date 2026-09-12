// FILE: lib/haullegal/i18n.ts
import { useCallback, useEffect, useState } from "react";

// HaulLegal language layer (v1). One switch, stored on the device
// (localStorage key hl-lang, "en" or "es"), read by every page
// that speaks to the owner: landing, walkthrough, calendar, buy,
// thanks and account. English strings here are the exact copy the
// pages shipped with; Spanish is a full translation, neutral Latin
// American, "tu" register, with the program names drivers know in
// English left in English (USDOT, IRP, IFTA, UCR, BOC-3, ELD,
// Motus, Clearinghouse). The walkthrough step content and the
// calendar rules have their own Spanish files (steps-es.ts,
// deadlines-es.ts); this file carries the page furniture. Every
// non-ASCII character is written as a \u escape so the file stays
// ASCII; the browser renders the accents.
// useHlLang: a hook that reads the stored choice after mount (so
// server HTML and the first client render agree, in English) and
// keeps every mounted component in step through one window event.
// fill(): tiny {placeholder} substitution for the few strings that
// carry a number or a date.
// No server-only import on purpose: this is browser code.

export type HlLang = "en" | "es";

export const HL_LANG_KEY = "hl-lang";

const EVENT = "hl-lang-change";

export function readHlLang(): HlLang {
  try {
    return window.localStorage.getItem(HL_LANG_KEY) === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

export function writeHlLang(lang: HlLang) {
  try {
    window.localStorage.setItem(HL_LANG_KEY, lang);
  } catch {
    // storage unavailable - the choice lasts for this page view only
  }
  try {
    window.dispatchEvent(new CustomEvent<HlLang>(EVENT, { detail: lang }));
  } catch {
    // no CustomEvent - components refresh on their next mount
  }
}

export function useHlLang(): [HlLang, (l: HlLang) => void] {
  const [lang, setLangState] = useState<HlLang>("en");
  useEffect(() => {
    setLangState(readHlLang());
    const on = (e: Event) => {
      const d = (e as CustomEvent<HlLang>).detail;
      setLangState(d === "es" ? "es" : "en");
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  const setLang = useCallback((l: HlLang) => {
    writeHlLang(l);
    setLangState(l);
  }, []);
  return [lang, setLang];
}

export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? ""));
}

const EN = {
  common: {
    logIn: "Log in",
    logOut: "Log out",
    signingOut: "Signing out...",
    backTo: "Back to",
    terms: "Terms",
    privacy: "Privacy",
    guides: "Guides",
    stateGuides: "State guides",
    loading: "Loading...",
    langToggleTitle: "Cambiar a espa\u00f1ol",
  },
  landing: {
    badge: "For new owner-operators - USDOT, authority, and staying legal",
    h1a: "Get legal to haul.",
    h1b: "Stay legal.",
    sub: "The step-by-step walkthrough that gets a new trucking company its USDOT number and operating authority the right way, at the real government prices - then keeps every deadline on your phone.",
    ctaBuy: "Start the walkthrough - $249",
    noteB: "One payment for the launch walkthrough.",
    noteRest: " Stay Legal reminders are $39 a month after your free first month, cancel any time.",
    tryOpen: "Open the walkthrough",
    trySee: "See the steps free",
    tryCal: "Try the deadline calendar",
    tryHint: "Free to look around - no sign-up needed.",
    stats: [
      {
        n: "$300",
        l: "the only federal fee for your authority",
      },
      {
        n: "$0",
        l: "what a USDOT number costs",
      },
      {
        n: "20-25",
        l: "business days, typical wait",
      },
      {
        n: "12 mo",
        l: "until your first safety audit",
      },
    ],
    stripT: "Most of this is free from the government. The confusion is what costs money.",
    stripD: "FMCSA charges $300 for your authority and nothing for your USDOT number, your updates, or the forms. The $500 to $1,000 \"packages\" are charging you for knowing which button to click - and since May 2026 you have to be the one holding the phone for the ID check anyway. HaulLegal shows you every button, in order, with the real price next to it. We never file for you and never touch your government account. You stay in control, and you keep the money.",
    whatYouGet: "What you get",
    features: [
      {
        n: "Every step, in order",
        d: "23 steps across four phases - business, federal registration, taxes and plates, legal on the road - each with the real fee, where the click happens, what you need first, and the mistakes FMCSA itself warns about.",
      },
      {
        n: "Real prices next to every step",
        d: "USDOT number $0. Authority $300. Process agent about $50. UCR $46. We put the government's number beside each step so you never pay $500 for a free form.",
      },
      {
        n: "Built for Motus",
        d: "FMCSA replaced its registration system in May 2026. We walk you through Login.gov, the phone ID check, and what every Pending status actually means. You do every click yourself - we never touch your account.",
      },
      {
        n: "The Stay Legal calendar",
        d: "Enter your USDOT number and a few dates. It works out your biennial update month, IFTA quarters, UCR, Form 2290, medical card, inspections and the five by-the-mile states, and emails you before each one.",
      },
      {
        n: "Cited, not guessed",
        d: "Every fee and deadline links to the regulation or agency page it comes from - 49 CFR, FMCSA, the IRS, UCR, IFTA - verified September 2026.",
      },
      {
        n: "Works in the truck",
        d: "Phone-first. No app to install, no classroom, no phone tag with a 'specialist'. Read a step at the fuel island, do it, check it off.",
      },
    ],
    govTitle: "What the government actually charges",
    govFees: [
      {
        item: "USDOT number",
        cost: "$0",
        who: "FMCSA",
      },
      {
        item: "Operating authority (property carrier)",
        cost: "$300 one time",
        who: "FMCSA, via Pay.gov",
      },
      {
        item: "BOC-3 process agent filing",
        cost: "About $35-$75 one time",
        who: "A private process agent",
      },
      {
        item: "UCR registration, 1-2 trucks",
        cost: "$46 a year (2026), $55 (2027)",
        who: "UCR national registration",
      },
      {
        item: "Drug and alcohol consortium",
        cost: "About $66-$85 a year",
        who: "A private consortium",
      },
      {
        item: "Clearinghouse query",
        cost: "$1.25 each",
        who: "FMCSA Clearinghouse",
      },
      {
        item: "Heavy vehicle use tax, 80,000 lb truck",
        cost: "$550 a year",
        who: "IRS Form 2290",
      },
      {
        item: "Biennial update (MCS-150)",
        cost: "$0",
        who: "FMCSA",
      },
    ],
    marketTitle: "What getting help costs today",
    market: [
      {
        label: "Authority 'packages' from filing services",
        value: "$300 - $995+",
        ours: false,
      },
      {
        label: "DAT Authority (authority + BOC-3)",
        value: "$399",
        ours: false,
      },
      {
        label: "Monthly compliance services",
        value: "$49.50 - $247 / mo",
        ours: false,
      },
      {
        label: "HaulLegal launch walkthrough",
        value: "$249 once",
        ours: true,
      },
      {
        label: "HaulLegal Stay Legal calendar",
        value: "$39 / mo, first month free",
        ours: true,
      },
    ],
    legal: "HaulLegal is a product of AskEvo LLC, Boise, Idaho. We are not a government agency and are not affiliated with or endorsed by the U.S. Department of Transportation, FMCSA, or any state agency. We are not a law firm and nothing here is legal advice. We never file on your behalf or access your government accounts - you complete every filing yourself, with our walkthrough. Some links are partner links; if you buy through them we may earn a referral fee at no extra cost to you. Questions: support@askevo.ai",
  },
  start: {
    badge: "The walkthrough - {n} steps, in order",
    h1a: "Get legal,",
    h1b: "one step at a time.",
    sub: "Work down the list. Every step shows the real government fee, where the click happens, what you need first, and the mistakes FMCSA warns about. Check each one off as you go - your progress is saved on this device, and on your account once you log in.",
    progOf: "of",
    progDone: "done",
    gateH: "The next 19 steps are the walkthrough.",
    gateP: "For every one of them: exactly where the click happens and the official link, the real fee, what has to be done first, the mistakes FMCSA itself warns about, the rule it comes from, and a check-off that saves your place. Federal registration on Motus, taxes and plates, and staying legal on the road. One payment, $249, plus a free first month of Stay Legal reminders.",
    gateBtn: "Get the full walkthrough - $249",
    locked: "Locked - part of the walkthrough",
    showDetails: "Show details",
    hideDetails: "Hide details",
    where: "Where",
    doFirst: "Do first",
    doneMark: " (done)",
    watchOut: "Watch out",
    source: "Source:",
    openOfficial: "Open the official page",
    readRule: "Read the rule",
    done: "\u2713 Done",
    markDone: "Mark done",
    partnerNote: "Partner link - if you buy through it we may earn a referral fee at no extra cost to you.",
    nextT: "Next: the Stay Legal calendar",
    nextP: "Once your authority is active the deadlines start - the biennial update, IFTA every quarter, UCR every year, Form 2290, your medical card, the annual inspections. Put your dates in once and the calendar works them all out.",
    nextBtn: "Open the calendar",
    reset: "Reset progress",
    resetConfirm: "Clear every check mark and start the walkthrough over?",
    legal: "HaulLegal explains the steps; you complete every filing yourself in your own accounts. Not a government agency, not a law firm, not legal advice. Fees and rules verified September 2026 - confirm current requirements with the agency before you act.",
    syncAccount: "Progress saved to your account.",
    syncDevice: "Progress saved on this device only.",
    syncLogin: "Log in to keep it on your account",
  },
  calendar: {
    badge: "Stay Legal calendar",
    h1a: "Every deadline,",
    h1b: "worked out for you.",
    sub: "Type in your USDOT number, flip the switches that match your truck, and add the dates you know. The calendar computes what is due and when, from the actual rules - soonest first.",
    usdotLabel: "USDOT number",
    usdotPh: "e.g. 4123457",
    usdotHelp: "The last two digits set your biennial update month and year.",
    opT: "Your operation - select all that apply",
    opHelp: "Nothing is picked for you. Tap each one that is true for your truck; leave the rest alone.",
    toggles: {
      hvut: "Truck is 55,000 lb or more (Form 2290)",
      ifta: "IFTA licensed (over 26,000 lb, 2+ states)",
      irp: "IRP apportioned plates",
      eld: "Runs an ELD",
      ky: "Runs Kentucky",
      nm: "Runs New Mexico",
      ny: "Runs New York",
      or: "Runs Oregon",
      ct: "Runs Connecticut (26,000 lb+)",
    },
    clear: "Clear everything",
    fumLabel: "Month the truck first hit the road (this tax year)",
    fumDefault: "Not sure / July (standard)",
    fumHelp: "Form 2290 is due the last day of the month after first use.",
    fuyLabel: "First-use year",
    fuyPh: "e.g. 2026",
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    dateFields: {
      authorityActive: {
        label: "Authority went active",
        help: "Starts the 12-month New Entrant audit clock.",
      },
      medCardIssued: {
        label: "Last DOT physical",
        help: "Medical card must be renewed within 24 months.",
      },
      insuranceRenews: {
        label: "Insurance policy renews",
        help: "No gap - a lapse cancels your federal filing.",
      },
      consortiumEnrolled: {
        label: "Consortium enrolled",
        help: "Random pool renews yearly.",
      },
      lastQuery: {
        label: "Last Clearinghouse query",
        help: "At least one query on yourself every year.",
      },
      lastMvr: {
        label: "Last MVR review",
        help: "Driving record pulled and reviewed every 12 months.",
      },
      tractorInspected: {
        label: "Tractor annual inspection",
        help: "Every 12 months per vehicle.",
      },
      trailerInspected: {
        label: "Trailer annual inspection",
        help: "The trailer needs its own.",
      },
      irpRenews: {
        label: "IRP plates renew",
        help: "The month your base state assigned.",
      },
    },
    coming: "What is coming up",
    empty: "Add your USDOT number and a few dates above and the calendar fills in here.",
    pastDue: "{n} days past due",
    dueToday: "Due today",
    dueTomorrow: "Due tomorrow",
    inDays: "In {n} days",
    toSeeMore: "To see more, add",
    mcsDetail: "Your USDOT number puts you in month {month} of {parity}-numbered years. Free, in Motus.",
    odd: "odd",
    even: "even",
    ruleLabel: "Rule:",
    missedLabel: "If missed:",
    howComputed: "How is each date computed?",
    hideComputed: "Hide how each date is computed",
    pitchT: "Want these on your phone before they are due?",
    pitchP: "Stay Legal saves this calendar to your account and emails you 30 days, 7 days and 1 day before every deadline - $39 a month, cancel any time, first month free with the launch walkthrough.",
    pitchBtn: "Get Stay Legal",
    savedAccount: "Saved to your account.",
    savedDevice: "Saved on this device only.",
    logInToSync: "Log in to keep it on your account",
    remindersOn: "Email reminders: ON",
    remindersOff: "Email reminders: OFF",
    remindersHelp: "Stay Legal emails you 30, 7 and 1 days before each date on this list. Tap to turn them off or on.",
    legal: "Dates are computed from the information you enter and the rules as verified in September 2026. They are a convenience, not a guarantee - keep your own record and confirm with the agency.",
    walkLink: "The walkthrough",
  },
  buy: {
    walkH: "Launch walkthrough",
    walkSub: "Every registration a new trucking company needs, in the order it happens, at the real government prices - built for the Motus system FMCSA switched to in May 2026.",
    chip: "Includes your first 30 days of Stay Legal free - the deadline calendar with email reminders",
    walkTag: "One-time payment. After the free month, Stay Legal is $39 a month - cancel any time. Filing services charge $300 to $995 to do these same clicks for you - and since Motus, you still have to do the ID check yourself.",
    walkFeatures: [
      "All 23 steps, in order, from forming the business to your first paid load",
      "The real government fee beside every step - USDOT $0, authority $300, UCR $46",
      "Motus walkthrough: Login.gov, the phone ID check, what every Pending status means",
      "The mistakes FMCSA itself warns about, and the citation for every rule",
      "One-click links to the official page for each step - you do every filing yourself",
      "Check-off progress that follows you between your phone and your laptop",
    ],
    ownWalk: "You own the walkthrough.",
    openWalk: "Open the walkthrough",
    buyWalk: "Get the walkthrough - $249",
    openingCheckout: "Opening secure checkout...",
    noteSubRunning: "Stay Legal is already running on your account, so this charges the $249 walkthrough only.",
    noteBundle: "$249 today. Stay Legal starts free and bills $39 a month after 30 days until you cancel - one click from your account page, any time before then and you pay nothing more.",
    stayH: "Stay Legal",
    staySub: "The deadline calendar that remembers everything after your authority goes active - and emails you before each date.",
    perMonth: "/ month",
    stayTag: "Cancel any time. Included free for 30 days with the walkthrough above; on its own it starts today. Monthly compliance services charge $49.50 to $247.",
    stayFeatures: [
      "Your biennial update month, worked out from your USDOT number",
      "IFTA quarters, UCR, Form 2290, medical card, annual inspections, the New Entrant audit",
      "Kentucky, New Mexico, New York, Oregon and Connecticut by-the-mile filings when you run there",
      "Email reminders 30 days, 7 days and 1 day before every deadline",
      "Saved to your account - update a date once, the calendar moves with it",
      "Cancel any time from your account page",
    ],
    stayOn: "Stay Legal is on.",
    openCal: "Open the calendar",
    manageSub: "Manage subscription",
    buyStay: "Get Stay Legal - $39 / month",
    err: "Could not start checkout - please try again.",
    secure: "Secure checkout by Stripe - charges read ASKEVO on your card statement. Purchases attach to your account, so you can use them from any device. Questions: support@askevo.ai",
    doorCreate: "Create your account to buy",
    doorHave: "I already have an account",
    legal: "HaulLegal is a product of AskEvo LLC, Boise, Idaho. Not a government agency, not a law firm. We never file on your behalf. Questions: support@askevo.ai",
  },
  account: {
    badge: "Your account",
    h1a: "What you own,",
    h1b: "and the switches.",
    signInH: "Sign in to see your account",
    signInP: "Your purchases attach to your account, so sign in from any device.",
    createAccount: "Create an account",
    walkT: "Launch walkthrough",
    walkOwned: "Owned. All 23 steps are unlocked.",
    walkNot: "Not purchased yet.",
    openWalk: "Open the walkthrough",
    buyWalk: "Get the walkthrough - $249",
    stayT: "Stay Legal",
    trialing: "Free trial - your first charge is on {end}.",
    trialingNoEnd: "Free trial.",
    active: "Active - renews on {end}.",
    activeNoEnd: "Active.",
    pastDue: "Payment failed - update your card to keep reminders going.",
    canceled: "Canceled - reminders run through {end}.",
    canceledNoEnd: "Canceled.",
    unpaid: "Unpaid - update your card to restart reminders.",
    none: "Not subscribed.",
    openCal: "Open the calendar",
    manageCancel: "Manage or cancel",
    opening: "Opening...",
    startTrial: "Start my free 30 days",
    buyStay: "Get Stay Legal - $39 / month",
    portalErr: "The billing page is not available right now - email support@askevo.ai and we will handle it the same day.",
    legal: "Billing questions: support@askevo.ai. Card statements read ASKEVO* HAULLEGAL.",
  },
  thanks: {
    remindersOn: "Reminders are on.",
    youreIn: "You're in.",
    subActive: "Stay Legal is active on your account. Put your dates in and the calendar takes it from here.",
    bundleActive: "The full walkthrough is unlocked, and Stay Legal is on - free for 30 days, then $39 a month unless you cancel from your account page.",
    walkUnlocked: "The full walkthrough is unlocked on your account. Time to get legal.",
    activating: "Payment received - your access is activating now. If things still look locked in a minute, refresh this page.",
    openMyCal: "Open my calendar",
    backToWalk: "Back to the walkthrough",
    openWalk: "Open the walkthrough",
    startTrial: "Start my free 30 days of Stay Legal",
    openingCheckout: "Opening secure checkout...",
    err: "Could not open checkout - try again from the buy page.",
    receiptStay: "A receipt is on its way to your email. Manage or cancel Stay Legal any time from your account page.",
    receiptWalk: "A receipt is on its way to your email. The free 30 days needs a card on file and bills $39 a month after - cancel any time from your account page.",
  },
};

export type HlUi = typeof EN;

const ES: HlUi = {
  common: {
    logIn: "Iniciar sesi\u00f3n",
    logOut: "Cerrar sesi\u00f3n",
    signingOut: "Cerrando sesi\u00f3n...",
    backTo: "Volver a",
    terms: "T\u00e9rminos",
    privacy: "Privacidad",
    guides: "Gu\u00edas",
    stateGuides: "Gu\u00edas por estado",
    loading: "Cargando...",
    langToggleTitle: "Switch to English",
  },
  landing: {
    badge: "Para due\u00f1os-operadores nuevos - USDOT, autoridad y mantenerte legal",
    h1a: "Ponte legal para transportar.",
    h1b: "Mantente legal.",
    sub: "La gu\u00eda paso a paso que le consigue a una empresa de transporte nueva su n\u00famero USDOT y su autoridad de operaci\u00f3n de la forma correcta, a los precios reales del gobierno - y luego mantiene cada fecha l\u00edmite en tu tel\u00e9fono.",
    ctaBuy: "Empezar la gu\u00eda - $249",
    noteB: "Un solo pago por la gu\u00eda de arranque.",
    noteRest: " Los recordatorios Stay Legal cuestan $39 al mes despu\u00e9s de tu primer mes gratis; cancela cuando quieras.",
    tryOpen: "Abrir la gu\u00eda",
    trySee: "Ver los pasos gratis",
    tryCal: "Probar el calendario de fechas l\u00edmite",
    tryHint: "Puedes mirar gratis - sin registrarte.",
    stats: [
      {
        n: "$300",
        l: "la \u00fanica cuota federal por tu autoridad",
      },
      {
        n: "$0",
        l: "lo que cuesta un n\u00famero USDOT",
      },
      {
        n: "20-25",
        l: "d\u00edas h\u00e1biles, espera t\u00edpica",
      },
      {
        n: "12 meses",
        l: "hasta tu primera auditor\u00eda de seguridad",
      },
    ],
    stripT: "Casi todo esto es gratis con el gobierno. Lo que cuesta dinero es la confusi\u00f3n.",
    stripD: "FMCSA cobra $300 por tu autoridad y nada por tu n\u00famero USDOT, tus actualizaciones ni los formularios. Los \"paquetes\" de $500 a $1,000 te cobran por saber qu\u00e9 bot\u00f3n apretar - y desde mayo de 2026 de todos modos t\u00fa tienes que ser quien sostiene el tel\u00e9fono para la verificaci\u00f3n de identidad. HaulLegal te muestra cada bot\u00f3n, en orden, con el precio real al lado. Nunca presentamos nada por ti ni tocamos tu cuenta del gobierno. T\u00fa mantienes el control, y te quedas con el dinero.",
    whatYouGet: "Lo que recibes",
    features: [
      {
        n: "Cada paso, en orden",
        d: "23 pasos en cuatro fases - negocio, registro federal, impuestos y placas, legal en la carretera - cada uno con la cuota real, d\u00f3nde se hace el clic, qu\u00e9 necesitas primero, y los errores de los que la propia FMCSA advierte.",
      },
      {
        n: "Precios reales junto a cada paso",
        d: "N\u00famero USDOT $0. Autoridad $300. Agente de proceso unos $50. UCR $46. Ponemos el n\u00famero del gobierno junto a cada paso para que nunca pagues $500 por un formulario gratuito.",
      },
      {
        n: "Hecho para Motus",
        d: "FMCSA reemplaz\u00f3 su sistema de registro en mayo de 2026. Te guiamos por Login.gov, la verificaci\u00f3n de identidad por tel\u00e9fono, y lo que significa de verdad cada estado Pendiente. T\u00fa haces cada clic - nunca tocamos tu cuenta.",
      },
      {
        n: "El calendario Stay Legal",
        d: "Escribe tu n\u00famero USDOT y unas cuantas fechas. Calcula tu mes de actualizaci\u00f3n bienal, los trimestres de IFTA, UCR, el Formulario 2290, la tarjeta m\u00e9dica, las inspecciones y los cinco estados que cobran por milla, y te manda un correo antes de cada una.",
      },
      {
        n: "Con cita, no adivinado",
        d: "Cada cuota y cada fecha l\u00edmite enlaza al reglamento o a la p\u00e1gina de la agencia de donde sale - 49 CFR, FMCSA, el IRS, UCR, IFTA - verificado en septiembre de 2026.",
      },
      {
        n: "Funciona en el cami\u00f3n",
        d: "Pensado para el tel\u00e9fono. Sin app que instalar, sin clases, sin perseguir por tel\u00e9fono a un 'especialista'. Lee un paso en la isla de di\u00e9sel, hazlo, m\u00e1rcalo.",
      },
    ],
    govTitle: "Lo que el gobierno cobra en realidad",
    govFees: [
      {
        item: "N\u00famero USDOT",
        cost: "$0",
        who: "FMCSA",
      },
      {
        item: "Autoridad de operaci\u00f3n (transportista de carga)",
        cost: "$300 una sola vez",
        who: "FMCSA, por Pay.gov",
      },
      {
        item: "Tr\u00e1mite BOC-3 del agente de proceso",
        cost: "Unos $35-$75 una sola vez",
        who: "Un agente de proceso privado",
      },
      {
        item: "Registro UCR, 1-2 camiones",
        cost: "$46 al a\u00f1o (2026), $55 (2027)",
        who: "Registro nacional UCR",
      },
      {
        item: "Consorcio de drogas y alcohol",
        cost: "Unos $66-$85 al a\u00f1o",
        who: "Un consorcio privado",
      },
      {
        item: "Consulta en el Clearinghouse",
        cost: "$1.25 cada una",
        who: "Clearinghouse de FMCSA",
      },
      {
        item: "Impuesto por uso de veh\u00edculos pesados, cami\u00f3n de 80,000 lb",
        cost: "$550 al a\u00f1o",
        who: "Formulario 2290 del IRS",
      },
      {
        item: "Actualizaci\u00f3n bienal (MCS-150)",
        cost: "$0",
        who: "FMCSA",
      },
    ],
    marketTitle: "Lo que cuesta hoy que te ayuden",
    market: [
      {
        label: "'Paquetes' de autoridad de servicios de tr\u00e1mites",
        value: "$300 - $995+",
        ours: false,
      },
      {
        label: "DAT Authority (autoridad + BOC-3)",
        value: "$399",
        ours: false,
      },
      {
        label: "Servicios mensuales de cumplimiento",
        value: "$49.50 - $247 / mes",
        ours: false,
      },
      {
        label: "Gu\u00eda de arranque HaulLegal",
        value: "$249 una vez",
        ours: true,
      },
      {
        label: "Calendario Stay Legal de HaulLegal",
        value: "$39 / mes, primer mes gratis",
        ours: true,
      },
    ],
    legal: "HaulLegal es un producto de AskEvo LLC, Boise, Idaho. No somos una agencia de gobierno y no estamos afiliados ni respaldados por el Departamento de Transporte de EE. UU., FMCSA ni ninguna agencia estatal. No somos un despacho de abogados y nada de esto es asesor\u00eda legal. Nunca presentamos tr\u00e1mites en tu nombre ni entramos a tus cuentas del gobierno - t\u00fa completas cada tr\u00e1mite, con nuestra gu\u00eda. Algunos enlaces son de socios; si compras a trav\u00e9s de ellos podemos recibir una comisi\u00f3n sin costo extra para ti. Preguntas: support@askevo.ai",
  },
  start: {
    badge: "La gu\u00eda - {n} pasos, en orden",
    h1a: "Ponte legal,",
    h1b: "un paso a la vez.",
    sub: "Ve bajando por la lista. Cada paso muestra la cuota real del gobierno, d\u00f3nde se hace el clic, qu\u00e9 necesitas primero, y los errores de los que FMCSA advierte. Marca cada uno al terminarlo - tu avance se guarda en este dispositivo, y en tu cuenta cuando inicias sesi\u00f3n.",
    progOf: "de",
    progDone: "listos",
    gateH: "Los siguientes 19 pasos son la gu\u00eda.",
    gateP: "Para cada uno de ellos: exactamente d\u00f3nde se hace el clic y el enlace oficial, la cuota real, qu\u00e9 debe hacerse antes, los errores de los que la propia FMCSA advierte, la regla de donde sale, y una casilla que guarda tu lugar. Registro federal en Motus, impuestos y placas, y mantenerte legal en la carretera. Un solo pago, $249, m\u00e1s un primer mes gratis de recordatorios Stay Legal.",
    gateBtn: "Obtener la gu\u00eda completa - $249",
    locked: "Bloqueado - parte de la gu\u00eda",
    showDetails: "Ver detalles",
    hideDetails: "Ocultar detalles",
    where: "D\u00f3nde",
    doFirst: "Haz primero",
    doneMark: " (listo)",
    watchOut: "Cuidado con",
    source: "Fuente:",
    openOfficial: "Abrir la p\u00e1gina oficial",
    readRule: "Leer la regla",
    done: "\u2713 Listo",
    markDone: "Marcar como listo",
    partnerNote: "Enlace de socio - si compras a trav\u00e9s de \u00e9l podemos recibir una comisi\u00f3n sin costo extra para ti.",
    nextT: "Siguiente: el calendario Stay Legal",
    nextP: "En cuanto tu autoridad est\u00e9 activa empiezan las fechas l\u00edmite - la actualizaci\u00f3n bienal, IFTA cada trimestre, UCR cada a\u00f1o, el Formulario 2290, tu tarjeta m\u00e9dica, las inspecciones anuales. Pon tus fechas una vez y el calendario las calcula todas.",
    nextBtn: "Abrir el calendario",
    reset: "Reiniciar avance",
    resetConfirm: "\u00bfBorrar todas las marcas y empezar la gu\u00eda de nuevo?",
    legal: "HaulLegal explica los pasos; t\u00fa completas cada tr\u00e1mite en tus propias cuentas. No es una agencia de gobierno, no es un despacho de abogados, no es asesor\u00eda legal. Cuotas y reglas verificadas en septiembre de 2026 - confirma los requisitos vigentes con la agencia antes de actuar.",
    syncAccount: "Avance guardado en tu cuenta.",
    syncDevice: "Avance guardado solo en este dispositivo.",
    syncLogin: "Inicia sesi\u00f3n para guardarlo en tu cuenta",
  },
  calendar: {
    badge: "Calendario Stay Legal",
    h1a: "Cada fecha l\u00edmite,",
    h1b: "calculada por ti.",
    sub: "Escribe tu n\u00famero USDOT, activa los interruptores que describen tu cami\u00f3n, y agrega las fechas que sepas. El calendario calcula qu\u00e9 vence y cu\u00e1ndo, con las reglas reales - lo m\u00e1s pr\u00f3ximo primero.",
    usdotLabel: "N\u00famero USDOT",
    usdotPh: "p. ej. 4123457",
    usdotHelp: "Los \u00faltimos dos d\u00edgitos fijan tu mes y a\u00f1o de actualizaci\u00f3n bienal.",
    opT: "Tu operaci\u00f3n - marca todo lo que aplique",
    opHelp: "Nada viene marcado. Toca cada uno que sea cierto para tu cami\u00f3n; deja el resto en paz.",
    toggles: {
      hvut: "Cami\u00f3n de 55,000 lb o m\u00e1s (Formulario 2290)",
      ifta: "Con licencia IFTA (m\u00e1s de 26,000 lb, 2+ estados)",
      irp: "Placas IRP (prorrateadas)",
      eld: "Usa un ELD",
      ky: "Circula por Kentucky",
      nm: "Circula por Nuevo M\u00e9xico",
      ny: "Circula por Nueva York",
      or: "Circula por Oregon",
      ct: "Circula por Connecticut (26,000 lb+)",
    },
    clear: "Borrar todo",
    fumLabel: "Mes en que el cami\u00f3n sali\u00f3 a la carretera por primera vez (este a\u00f1o fiscal)",
    fumDefault: "No s\u00e9 / julio (lo normal)",
    fumHelp: "El Formulario 2290 vence el \u00faltimo d\u00eda del mes siguiente al primer uso.",
    fuyLabel: "A\u00f1o del primer uso",
    fuyPh: "p. ej. 2026",
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    dateFields: {
      authorityActive: {
        label: "La autoridad qued\u00f3 activa",
        help: "Arranca el reloj de 12 meses de la auditor\u00eda de nuevo transportista.",
      },
      medCardIssued: {
        label: "\u00daltimo examen f\u00edsico DOT",
        help: "La tarjeta m\u00e9dica se renueva dentro de 24 meses.",
      },
      insuranceRenews: {
        label: "Renovaci\u00f3n de la p\u00f3liza de seguro",
        help: "Sin interrupciones - un lapso cancela tu registro federal.",
      },
      consortiumEnrolled: {
        label: "Inscripci\u00f3n en el consorcio",
        help: "El grupo aleatorio se renueva cada a\u00f1o.",
      },
      lastQuery: {
        label: "\u00daltima consulta en el Clearinghouse",
        help: "Al menos una consulta sobre ti mismo cada a\u00f1o.",
      },
      lastMvr: {
        label: "\u00daltima revisi\u00f3n del MVR",
        help: "Historial de manejo obtenido y revisado cada 12 meses.",
      },
      tractorInspected: {
        label: "Inspecci\u00f3n anual del tractor",
        help: "Cada 12 meses por veh\u00edculo.",
      },
      trailerInspected: {
        label: "Inspecci\u00f3n anual del remolque",
        help: "El remolque necesita la suya.",
      },
      irpRenews: {
        label: "Renovaci\u00f3n de placas IRP",
        help: "El mes que asign\u00f3 tu estado base.",
      },
    },
    coming: "Lo que viene",
    empty: "Agrega tu n\u00famero USDOT y unas cuantas fechas arriba y el calendario se llena aqu\u00ed.",
    pastDue: "{n} d\u00edas de retraso",
    dueToday: "Vence hoy",
    dueTomorrow: "Vence ma\u00f1ana",
    inDays: "En {n} d\u00edas",
    toSeeMore: "Para ver m\u00e1s, agrega",
    mcsDetail: "Tu n\u00famero USDOT te pone en el mes {month} de los a\u00f1os {parity}. Gratis, en Motus.",
    odd: "impares",
    even: "pares",
    ruleLabel: "Regla:",
    missedLabel: "Si no cumples:",
    howComputed: "\u00bfC\u00f3mo se calcula cada fecha?",
    hideComputed: "Ocultar c\u00f3mo se calcula cada fecha",
    pitchT: "\u00bfQuieres esto en tu tel\u00e9fono antes de que venza?",
    pitchP: "Stay Legal guarda este calendario en tu cuenta y te manda un correo 30 d\u00edas, 7 d\u00edas y 1 d\u00eda antes de cada fecha l\u00edmite - $39 al mes, cancela cuando quieras, primer mes gratis con la gu\u00eda de arranque.",
    pitchBtn: "Obtener Stay Legal",
    savedAccount: "Guardado en tu cuenta.",
    savedDevice: "Guardado solo en este dispositivo.",
    logInToSync: "Inicia sesi\u00f3n para guardarlo en tu cuenta",
    remindersOn: "Recordatorios por correo: ACTIVADOS",
    remindersOff: "Recordatorios por correo: APAGADOS",
    remindersHelp: "Stay Legal te manda un correo 30, 7 y 1 d\u00edas antes de cada fecha de esta lista. Toca para apagarlos o encenderlos.",
    legal: "Las fechas se calculan con la informaci\u00f3n que escribes y las reglas tal como las verificamos en septiembre de 2026. Son una ayuda, no una garant\u00eda - lleva tu propio registro y confirma con la agencia.",
    walkLink: "La gu\u00eda",
  },
  buy: {
    walkH: "Gu\u00eda de arranque",
    walkSub: "Cada registro que necesita una empresa de transporte nueva, en el orden en que ocurre, a los precios reales del gobierno - hecha para el sistema Motus al que FMCSA cambi\u00f3 en mayo de 2026.",
    chip: "Incluye tus primeros 30 d\u00edas de Stay Legal gratis - el calendario de fechas l\u00edmite con recordatorios por correo",
    walkTag: "Pago \u00fanico. Despu\u00e9s del mes gratis, Stay Legal cuesta $39 al mes - cancela cuando quieras. Los servicios de tr\u00e1mites cobran de $300 a $995 por hacer estos mismos clics por ti - y desde Motus, la verificaci\u00f3n de identidad igual la tienes que hacer t\u00fa.",
    walkFeatures: [
      "Los 23 pasos, en orden, desde formar el negocio hasta tu primera carga pagada",
      "La cuota real del gobierno junto a cada paso - USDOT $0, autoridad $300, UCR $46",
      "Gu\u00eda de Motus: Login.gov, la verificaci\u00f3n de identidad por tel\u00e9fono, qu\u00e9 significa cada estado Pendiente",
      "Los errores de los que la propia FMCSA advierte, y la cita de cada regla",
      "Enlaces de un clic a la p\u00e1gina oficial de cada paso - t\u00fa haces cada tr\u00e1mite",
      "Avance con casillas que te sigue entre tu tel\u00e9fono y tu computadora",
    ],
    ownWalk: "Ya tienes la gu\u00eda.",
    openWalk: "Abrir la gu\u00eda",
    buyWalk: "Obtener la gu\u00eda - $249",
    openingCheckout: "Abriendo el pago seguro...",
    noteSubRunning: "Stay Legal ya est\u00e1 activo en tu cuenta, as\u00ed que esto cobra solo la gu\u00eda de $249.",
    noteBundle: "$249 hoy. Stay Legal empieza gratis y cobra $39 al mes despu\u00e9s de 30 d\u00edas hasta que canceles - un clic desde tu p\u00e1gina de cuenta, en cualquier momento antes de eso y no pagas nada m\u00e1s.",
    stayH: "Stay Legal",
    staySub: "El calendario de fechas l\u00edmite que recuerda todo despu\u00e9s de que tu autoridad quede activa - y te manda un correo antes de cada fecha.",
    perMonth: "/ mes",
    stayTag: "Cancela cuando quieras. Incluido gratis por 30 d\u00edas con la gu\u00eda de arriba; por s\u00ed solo empieza hoy. Los servicios mensuales de cumplimiento cobran de $49.50 a $247.",
    stayFeatures: [
      "Tu mes de actualizaci\u00f3n bienal, calculado a partir de tu n\u00famero USDOT",
      "Trimestres de IFTA, UCR, Formulario 2290, tarjeta m\u00e9dica, inspecciones anuales, la auditor\u00eda de nuevo transportista",
      "Las declaraciones por milla de Kentucky, Nuevo M\u00e9xico, Nueva York, Oregon y Connecticut cuando circulas por ah\u00ed",
      "Recordatorios por correo 30 d\u00edas, 7 d\u00edas y 1 d\u00eda antes de cada fecha l\u00edmite",
      "Guardado en tu cuenta - actualiza una fecha una vez y el calendario se mueve con ella",
      "Cancela cuando quieras desde tu p\u00e1gina de cuenta",
    ],
    stayOn: "Stay Legal est\u00e1 activo.",
    openCal: "Abrir el calendario",
    manageSub: "Administrar suscripci\u00f3n",
    buyStay: "Obtener Stay Legal - $39 / mes",
    err: "No se pudo iniciar el pago - int\u00e9ntalo de nuevo.",
    secure: "Pago seguro por Stripe - los cargos aparecen como ASKEVO en tu estado de cuenta. Las compras se ligan a tu cuenta, as\u00ed que puedes usarlas desde cualquier dispositivo. Preguntas: support@askevo.ai",
    doorCreate: "Crea tu cuenta para comprar",
    doorHave: "Ya tengo una cuenta",
    legal: "HaulLegal es un producto de AskEvo LLC, Boise, Idaho. No es una agencia de gobierno, no es un despacho de abogados. Nunca presentamos tr\u00e1mites en tu nombre. Preguntas: support@askevo.ai",
  },
  account: {
    badge: "Tu cuenta",
    h1a: "Lo que tienes,",
    h1b: "y los interruptores.",
    signInH: "Inicia sesi\u00f3n para ver tu cuenta",
    signInP: "Tus compras se ligan a tu cuenta, as\u00ed que inicia sesi\u00f3n desde cualquier dispositivo.",
    createAccount: "Crear una cuenta",
    walkT: "Gu\u00eda de arranque",
    walkOwned: "Comprada. Los 23 pasos est\u00e1n desbloqueados.",
    walkNot: "Todav\u00eda no comprada.",
    openWalk: "Abrir la gu\u00eda",
    buyWalk: "Obtener la gu\u00eda - $249",
    stayT: "Stay Legal",
    trialing: "Prueba gratis - tu primer cargo es el {end}.",
    trialingNoEnd: "Prueba gratis.",
    active: "Activo - se renueva el {end}.",
    activeNoEnd: "Activo.",
    pastDue: "El pago fall\u00f3 - actualiza tu tarjeta para que sigan los recordatorios.",
    canceled: "Cancelado - los recordatorios siguen hasta el {end}.",
    canceledNoEnd: "Cancelado.",
    unpaid: "Sin pagar - actualiza tu tarjeta para reactivar los recordatorios.",
    none: "Sin suscripci\u00f3n.",
    openCal: "Abrir el calendario",
    manageCancel: "Administrar o cancelar",
    opening: "Abriendo...",
    startTrial: "Empezar mis 30 d\u00edas gratis",
    buyStay: "Obtener Stay Legal - $39 / mes",
    portalErr: "La p\u00e1gina de facturaci\u00f3n no est\u00e1 disponible ahora mismo - escribe a support@askevo.ai y lo resolvemos el mismo d\u00eda.",
    legal: "Preguntas de facturaci\u00f3n: support@askevo.ai. Los estados de cuenta muestran ASKEVO* HAULLEGAL.",
  },
  thanks: {
    remindersOn: "Los recordatorios est\u00e1n activados.",
    youreIn: "Ya est\u00e1s dentro.",
    subActive: "Stay Legal est\u00e1 activo en tu cuenta. Pon tus fechas y el calendario se encarga desde aqu\u00ed.",
    bundleActive: "La gu\u00eda completa est\u00e1 desbloqueada, y Stay Legal est\u00e1 activo - gratis por 30 d\u00edas, luego $39 al mes a menos que canceles desde tu p\u00e1gina de cuenta.",
    walkUnlocked: "La gu\u00eda completa est\u00e1 desbloqueada en tu cuenta. Hora de ponerse legal.",
    activating: "Pago recibido - tu acceso se est\u00e1 activando. Si en un minuto todo sigue bloqueado, recarga esta p\u00e1gina.",
    openMyCal: "Abrir mi calendario",
    backToWalk: "Volver a la gu\u00eda",
    openWalk: "Abrir la gu\u00eda",
    startTrial: "Empezar mis 30 d\u00edas gratis de Stay Legal",
    openingCheckout: "Abriendo el pago seguro...",
    err: "No se pudo abrir el pago - int\u00e9ntalo de nuevo desde la p\u00e1gina de compra.",
    receiptStay: "Un recibo va en camino a tu correo. Administra o cancela Stay Legal cuando quieras desde tu p\u00e1gina de cuenta.",
    receiptWalk: "Un recibo va en camino a tu correo. Los 30 d\u00edas gratis necesitan una tarjeta registrada y cobran $39 al mes despu\u00e9s - cancela cuando quieras desde tu p\u00e1gina de cuenta.",
  },
};

export const HL_UI: Record<HlLang, HlUi> = { en: EN, es: ES };

// -----------------------------------------------------------
// END OF FILE - lib/haullegal/i18n.ts (v1 - EN/ES page strings,
// the hl-lang hook, fill())
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
