// FILE: app/company/brands.ts
// One source of truth for every AskEvo LLC business (v2). The
// landing page and the businesses page both read this file, so a
// brand's color, copy, links and social accounts are written once.
// Each brand's slug is also its anchor on /businesses, which is how
// a card click on the landing page deep-links into its section.
// v2: Facebook joins the social kinds. ForemanPrep has a page and
// AskEvo LLC has one of its own (ASKEVO_FB, drawn in the header);
// the other brands get theirs here the day they exist.

export type Door = { label: string; href: string; color: string; ghost?: boolean; external?: boolean; icon?: "play" | "apple" };
export type Social = { kind: "ig" | "yt" | "fb"; href: string; label: string };
export type Brand = {
  slug: string;
  name: string;
  color: string;
  tag: string;
  domain: string;
  desc: string;
  who: string;
  long: Array<string>;
  gets: Array<string>;
  doors: Array<Door>;
  socials: Array<Social>;
};

export const ASKEVO_IG = "https://www.instagram.com/askevo.ai";
export const ASKEVO_FB = "https://www.facebook.com/profile.php?id=61591921765482";

const SPOTMINT_APP_STORE = "https://apps.apple.com/us/app/spotmint-ai-video-ads/id6796510023";
const SPOTMINT_PLAY = "https://play.google.com/store/apps/details?id=com.askevo.spotmint";

export const BRANDS: Array<Brand> = [
  {
    slug: "foremanprep",
    name: "ForemanPrep",
    color: "#f97316",
    tag: "Contractor exam prep",
    domain: "foremanprep.com",
    desc: "Exam prep for the NASCLA general contractor license exam: unlimited practice questions, a full-length exam simulator, and an AI tutor that explains every answer. Business & Law prep with state packs and drive-time audio lessons sits alongside it.",
    who: "For builders getting licensed in the states that accept the NASCLA exam.",
    long: [
      "Getting a contractor license means passing a long, open-book trade exam, and most people study for it out of a stack of code books with no idea whether they are ready. ForemanPrep replaces that with practice you can measure. Work through questions by subject, sit a full-length simulator that mirrors the real exam's length and passing score, and get an explanation for every answer instead of just a red X.",
      "The AI tutor is the part people come back for. Miss a question and you can ask why, in plain words, and keep asking until it lands - it knows which question you were on and which answer you picked.",
      "Business & Law is its own exam in most states, so it is its own room here: practice, a state-specific simulator, state packs for the rules that change at the state line, and audio lessons for drive time.",
    ],
    gets: [
      "Unlimited practice questions, sorted by exam subject",
      "A full-length exam simulator on the real clock and passing score",
      "An AI tutor that explains any question, any answer",
      "Business & Law prep with per-state packs",
      "Audio lessons for the truck",
      "Free state-by-state licensing guides",
    ],
    doors: [
      { label: "Visit ForemanPrep", href: "https://foremanprep.com", color: "#f97316", external: true },
      { label: "Business & Law prep", href: "https://foremanprep.com/bl-prep", color: "#38bdf8", external: true },
    ],
    socials: [
      { kind: "yt", href: "https://www.youtube.com/@Foremanprep", label: "ForemanPrep on YouTube" },
      { kind: "ig", href: "https://www.instagram.com/foremanprep", label: "ForemanPrep on Instagram" },
      { kind: "fb", href: "https://www.facebook.com/profile.php?id=61593295284880", label: "ForemanPrep on Facebook" },
    ],
  },
  {
    slug: "wiremanprep",
    name: "WiremanPrep",
    color: "#ceff00",
    tag: "Electrical exam prep",
    domain: "wiremanprep.com",
    desc: "The same prep tools built for electricians: practice, a true-to-form exam simulator and an AI tutor for the NASCLA Master, Journeyman and Residential electrical exams, with per-state board guides.",
    who: "For electricians testing through NASCLA in the states that accept it.",
    long: [
      "WiremanPrep is ForemanPrep's trade rebuilt for electricians. Three separate exams are covered - Master, Journeyman and Residential - and each gets its own question bank weighted the way the real exam outline is weighted, so the practice you do matches the test you sit.",
      "The simulators are not generic. Each one runs the real question count, the real time limit and the real passing score for its exam, because a Journeyman sitting has a different clock than a Master sitting and studying against the wrong one teaches the wrong pace.",
      "Everything is written to be safe across both code editions candidates are allowed to bring, so nothing you practice depends on which book you carry into the room.",
    ],
    gets: [
      "Separate banks for Master, Journeyman and Residential",
      "A 1:1 simulator per exam - real count, real clock, real pass mark",
      "An AI tutor that answers code questions in plain language",
      "Guides for every state board that accepts the exam",
      "Written safe across both allowed code editions",
    ],
    doors: [{ label: "Visit WiremanPrep", href: "https://wiremanprep.com", color: "#ceff00", external: true }],
    socials: [{ kind: "ig", href: "https://www.instagram.com/wiremanprep_/", label: "WiremanPrep on Instagram" }],
  },
  {
    slug: "haullegal",
    name: "HaulLegal",
    color: "#22c55e",
    tag: "Trucking authority",
    domain: "haullegal.com",
    desc: "A plain-English, step-by-step walkthrough for new owner-operators getting a USDOT number and operating authority, plus Stay Legal: a calendar that tracks every filing deadline and sends reminders so the truck never gets parked over paperwork.",
    who: "For drivers going out on their own. Available in English and Spanish.",
    long: [
      "Going out on your own as a driver means a pile of federal and state paperwork that nobody hands you in order. HaulLegal lays the whole thing out as numbered steps - what to file, where, in what order, and what the government actually charges for it. Every step shows the real government fee beside it, so nobody gets talked into paying a middleman four times the price.",
      "Stay Legal is the part that matters after the truck is rolling. It is a calendar built from your own operation: which states you run, what you haul, what the truck weighs. It works out your filing dates from that and sends a reminder before each one, by email and by text, so a missed update does not end with a truck sitting.",
      "There are also free guides for all fifty states and for the parts people get wrong most often. We are not the government, we are not lawyers, and we never file anything on anyone's behalf - the walkthrough shows you how to do it yourself.",
    ],
    gets: [
      "A numbered walkthrough from nothing to operating authority",
      "The real government price printed beside every step",
      "Stay Legal: a deadline calendar built from your own operation",
      "Email and text reminders before each filing date",
      "Free guides for all fifty states",
      "The whole site in English and Spanish",
    ],
    doors: [{ label: "Visit HaulLegal", href: "https://haullegal.com", color: "#22c55e", external: true }],
    socials: [{ kind: "ig", href: "https://www.instagram.com/haullegal", label: "HaulLegal on Instagram" }],
  },
  {
    slug: "spotmint",
    name: "Spotmint",
    color: "#46dba8",
    tag: "AI video ads",
    domain: "App Store and Google Play",
    desc: "Turns a few sentences about a business into a finished video ad - no filming, no editing, no agency. Pick a format, pick sound on or off, and save the ad straight to your phone.",
    who: "For small business owners who need marketing video without a production budget.",
    long: [
      "Most small businesses cannot justify a video crew, so they post photos and hope. Spotmint closes that gap: describe the business in a few sentences, pick the shape you need - upright for stories and reels, wide for everything else - and get a finished ad back.",
      "Sound is a choice, not an upsell decision made for you. Generate silent for a feed that autoplays muted, or with audio when the ad needs a voice. Finished ads save straight to the camera roll or share out to wherever they are going, and recent ones stay in a library on the account.",
      "Spotmint is the smallest of our businesses and it started as a test - it was how we learned what shipping to the App Store and Google Play actually takes. It stayed because people use it.",
    ],
    gets: [
      "A finished video ad from a few sentences of description",
      "Upright or wide, your pick",
      "Sound on or off",
      "Saves straight to your phone, or shares out",
      "A library of your recent ads",
      "On iPhone, Android, and the web",
    ],
    doors: [
      { label: "Spotmint on Google Play", href: SPOTMINT_PLAY, color: "#46dba8", external: true, icon: "play" },
      { label: "Spotmint on the App Store", href: SPOTMINT_APP_STORE, color: "#46dba8", external: true, icon: "apple" },
      { label: "Use it on the web", href: "/spotmint", color: "#46dba8", ghost: true },
    ],
    socials: [{ kind: "ig", href: "https://www.instagram.com/spotmintvids", label: "Spotmint on Instagram" }],
  },
];

// -----------------------------------------------------------
// END OF FILE - app/company/brands.ts (v2 - facebook links)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
