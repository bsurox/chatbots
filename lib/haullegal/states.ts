// FILE: lib/haullegal/states.ts
import "server-only";

// HaulLegal state library (v1) - the 50 state pages at
// haullegal.com/states/<slug>. One entry per state, written for a
// brand-new owner-operator who has (or is getting) federal
// authority and now needs the STATE layer: where apportioned plates
// (IRP) come from, who issues the IFTA license, whether the state
// wants its own registration or authority for trucks that never
// leave it, whether it requires a USDOT number for in-state-only
// trucks, the four by-the-mile taxes, UCR participation, oversize
// permits, and who runs roadside enforcement. Facts verified
// September 2026 by five research passes against the state agency
// pages, state statutes and codes, FMCSA's intrastate-USDOT list,
// and the UCR Plan's participating-state list. Where an agency did
// not publish a figure (many IFTA license fees, several intrastate
// authority fees) the copy says to ask the office rather than
// guessing. Government fees appear because they ARE the content;
// HaulLegal's own prices never appear here.
// Shape: RAW holds compact per-state facts; build() turns each
// into the full article (intro, fact box, sections, official links)
// so the shared sentences live once. Rendering: app/haullegal/
// states/[slug]/page.tsx; index: app/haullegal/states/page.tsx.
// External links on these pages are real anchors (the standing
// exception) because they leave the site for the state office.

export type HlStateFact = { l: string; v: string };

export type HlStateLink = { label: string; url: string };

export type HlStateSection = { h?: string; p?: string[]; list?: string[] };

export type HlStateEntry = {
  slug: string;
  name: string;
  abbr: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  updated: string;
  card: string;
  intro: string[];
  facts: HlStateFact[];
  sections: HlStateSection[];
  links: HlStateLink[];
  related: string[];
  guides: string[];
};

type HlOffice = { agency: string; url: string; base?: string; note?: string };

type HlIfta = { agency: string; url: string; same: boolean; fee?: string; note?: string };

type HlUsdot = { rule: "required" | "not-required" | "unclear"; note?: string; url?: string };

type HlIntra = {
  status: "required" | "none" | "unclear";
  what?: string;
  agency?: string;
  url?: string;
  fee?: string;
  insurance?: string;
  note?: string;
};

type HlWd = { name: string; threshold: string; url: string; note?: string };

type HlExtra = { name: string; url?: string; note?: string };

type HlStateRaw = {
  slug: string;
  name: string;
  abbr: string;
  irp?: HlOffice;
  irpAlt?: string;
  ifta?: HlIfta;
  iftaAlt?: string;
  usdot: HlUsdot;
  intra: HlIntra;
  wd?: HlWd;
  mileFee?: string;
  ucr: { participates: boolean; note?: string };
  oversize?: { agency: string; url?: string };
  extras: HlExtra[];
  enforcement?: { agency: string; url?: string };
  island?: boolean;
  near: string[];
};

const RAW: HlStateRaw[] = [
  {
    slug: "alabama",
    name: "Alabama",
    abbr: "AL",
    irp: {
      agency: "Alabama Department of Revenue, Motor Vehicle Division - Motor Carrier Services",
      url: "https://www.revenue.alabama.gov/motor-vehicle/irp/",
      base: "Applicant must have an established place of business located in Alabama or demonstrate residency by providing three items of proof (ADOR Motor Carrier Services Manual).",
      note: "IRP and IFTA both run through the MyDMV portal (mydmv.revenue.alabama.gov); IRP renewal applications open online on the first day of the renewal month. Fees are apportioned by the percentage of fleet miles in each member jurisdiction; no flat fee schedule is shown.",
    },
    ifta: {
      agency: "Alabama Department of Revenue, Motor Vehicle Division - Motor Carrier Services",
      url: "https://www.revenue.alabama.gov/motor-vehicle/irp-ifta-information/",
      same: true,
      note: "IFTA accounts renew through MyDMV starting in November before the license year; two decals are issued per qualified vehicle.",
    },
    usdot: {
      rule: "required",
      note: "ALEA says all commercial vehicles in Alabama must be marked with an interstate or intrastate USDOT number, except intrastate straight trucks and truck-trailer combinations of 26,000 lbs GVWR/GCWR or less (non-passenger, non-hazmat), which are exempt from the federal rules in Alabama and do not need a USDOT number. Alabama is also on FMCSA's list of states requiring a USDOT number for intrastate registrants.",
      url: "https://www.alea.gov/dps/highway-patrol/motor-carrier-safety-unit",
    },
    intra: {
      status: "required",
      what: "Alabama Public Service Commission intrastate motor carrier authority (certificate/permit for for-hire transportation of property, application Form 14A)",
      agency: "Alabama Public Service Commission, Transportation Division - Motor Carrier Section",
      url: "https://psc.alabama.gov/motor-carrier-section/",
      fee: "$100.00 filing fee (cashier's check or money order only)",
      insurance: "Split limits of $100,000 per person and $300,000 per accident for bodily injury, $50,000 property damage, plus $5,000 cargo insurance, kept on file with the PSC",
      note: "Required when transporting property (including household goods) by motor vehicle for compensation between points within Alabama; exemptions are in PSC Rules 2.1-2.3 and Ala. Code 37-3-4. Carriers must keep liability and cargo insurance on file, keep an approved tariff on file, and file an annual report by April 30.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Alabama Department of Transportation, Oversize/Overweight Permit Office (ALPASS online permitting)",
      url: "https://www.dot.state.al.us/business/permits/osowPermits.html",
    },
    extras: [
      {
        name: "ALEA intrastate USDOT marking rule (26,000 lb line)",
        url: "https://www.alea.gov/dps/highway-patrol/motor-carrier-safety-unit",
        note: "Intrastate CMVs over 26,000 lbs GVWR/GCWR (and all hazmat and passenger CMVs) must display an intrastate USDOT number; 26,000 lbs and under are exempt from the federal regulations while operating only in Alabama.",
      },
    ],
    enforcement: {
      agency: "Alabama Law Enforcement Agency (ALEA), Highway Patrol Division - Motor Carrier Safety Unit",
      url: "https://www.alea.gov/dps/highway-patrol/motor-carrier-safety-unit",
    },
    near: [
      "mississippi",
      "tennessee",
      "georgia",
    ],
  },
  {
    slug: "alaska",
    name: "Alaska",
    abbr: "AK",
    usdot: {
      rule: "required",
      note: "Alaska is on FMCSA's list of states requiring a USDOT number for intrastate registrants. The Alaska DMV commercial vehicle registration page requires a USDOT number and tax ID for vehicles over 8,000 lbs and explains that registration is linked to the PRISM safety program.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Alaska DOT&PF, Measurement Standards and Commercial Vehicle Compliance (MS/CVC)",
      url: "https://dot.alaska.gov/mscvc/pages/cve.shtml",
      note: "Alaska has no state operating authority for general freight. The state-level steps are Alaska DMV commercial registration (with your USDOT number and tax ID above 8,000 lbs) and the DOT&PF size, weight and permit rules (17 AAC 25).",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Alaska DOT&PF, Commercial Vehicle Customer Service Center (CVCSC) - AKSWOOP online permits",
      url: "https://dot.alaska.gov/mscvc/pages/permits.shtml",
    },
    extras: [
      {
        name: "Temporary Truck/Trailer (TRT) registration for out-of-state units",
        url: "https://dot.alaska.gov/mscve/permits/forms/TRT_MyAlaska_Instructions.pdf",
        note: "Any commercial vehicle entering Alaska without Alaska registration must buy a 30-day TRT ($350 per power unit, $10 per trailer, nonrefundable); the vehicle must be registered elsewhere and the carrier's MCS-150 updated within 24 months; drivers must stop at all open weigh stations.",
      },
    ],
    enforcement: {
      agency: "Alaska DOT&PF, Measurement Standards and Commercial Vehicle Compliance - Commercial Vehicle Compliance (enforces federal and state commercial vehicle regulations)",
      url: "https://dot.alaska.gov/mscvc/pages/cve.shtml",
    },
    near: [
      "washington",
      "oregon",
      "idaho",
    ],
    irpAlt: "Alaska is not an IRP member; DOT&PF says every commercial vehicle entering Alaska must obtain Alaska registration. Alaska-based trucks register with the Alaska DMV as commercial vehicles (fees based on unladen weight; vehicles over 8,000 lbs file Form V1 and provide a USDOT number and tax ID; 12- or 24-month terms). Out-of-state carriers entering Alaska buy a 30-day Temporary Truck/Trailer registration through myAlaska ($350 per power unit, $10 per trailer).",
    iftaAlt: "Alaska is not an IFTA member and has no fuel-use-tax license of its own. An Alaska-based carrier that drives through IFTA jurisdictions (Yukon, British Columbia, the lower 48) satisfies those jurisdictions' fuel-tax rules directly - usually with trip permits bought before entering - so confirm with each jurisdiction you will cross before the first run.",
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbr: "AZ",
    irp: {
      agency: "Arizona Department of Transportation, Motor Vehicle Division - Motor Carrier Services (MVD Motor Carrier Program, Phoenix)",
      url: "https://azdot.gov/mvd/businesses-organizations/motor-carrier-services",
      base: "Evidence of an established place of business in Arizona (business license, commercial or real estate lease, or utility bill in the business name - virtual offices are not accepted) or proof of Arizona residency (AZ DL/CDL/ID plus two supporting documents such as personal vehicle registration, tax filing, property tax, utility bill, or lease/mortgage).",
      note: "Apply with the Full Reciprocity Plan application (form 70-0502); renewals available online through AZ MVD Now (azmvdnow.gov) with restrictions; mailing address MVD Motor Carrier Program, P.O. Box 2100, MD 527M, Phoenix, AZ 85001. No flat fee schedule shown.",
    },
    ifta: {
      agency: "Arizona Department of Transportation, Motor Vehicle Division - Motor Carrier Services",
      url: "https://azdot.gov/mvd/businesses-organizations/motor-carrier-services",
      same: true,
      note: "A bond of $3,250 may be required depending on the carrier's standing or if the carrier has never held an IFTA license in any member jurisdiction. IFTA renewal uses form 96-0424.",
    },
    usdot: {
      rule: "required",
      note: "Arizona DPS states that CMVs identified under A.A.C. R17-5-203(B)(3) must obtain a USDOT number from FMCSA for intrastate travel within Arizona and display it. ADOT's Motor Carrier Services page describes the USDOT number as applying to vehicles over 10,000 lbs GVWR in interstate commerce or over 26,000 lbs in intrastate commerce. Arizona is on FMCSA's list.",
      url: "https://www.azdps.gov/services/enforcement-services/commercial-vehicle-enforcement",
    },
    intra: {
      status: "none",
      agency: "Arizona Department of Transportation, Motor Vehicle Division - Motor Carrier Services",
      url: "https://azdot.gov/mvd/businesses-organizations/motor-carrier-services",
      note: "Arizona has no state operating authority or motor carrier permit for general freight. What ADOT and DPS describe for an in-state-only truck is Arizona commercial registration through the MVD and a USDOT number once you are over 26,000 lbs.",
    },
    ucr: {
      participates: false,
      note: "An Arizona-based interstate carrier must still register: if it has an office or operating facility in a participating state it must use that state; otherwise it selects one of AK, CA, CO, ID, MT, ND, NM, SD, UT or WA as its base state and registers at ucr.gov.",
    },
    oversize: {
      agency: "ADOT Enforcement and Compliance Division - Commercial Vehicle Permits (ADOT ePRO online permits, 602-712-4039)",
      url: "https://azdot.gov/mvd/services/enforcement/commercial-vehicle-permits",
    },
    extras: [
      {
        name: "ADOT ePRO commercial (oversize/overweight) permits",
        url: "https://azdot.gov/motor-vehicles/enforcement/commercial-vehicle-permits/general-permit-information",
        note: "OS/OW permits are issued as single-trip or 30-day permits for state routes, interstates and US highways only; loads over 250,000 lbs, 120 ft long, 16 ft high or 14 ft wide need a Class C permit; holiday travel restrictions apply.",
      },
      {
        name: "DPS intrastate USDOT number rule (R17-5-203)",
        url: "https://www.azdps.gov/services/enforcement-services/commercial-vehicle-enforcement",
        note: "DPS is Arizona's MCSAP lead agency and requires covered intrastate CMVs to obtain and display a USDOT number; DPS also conducts new entrant safety audits.",
      },
    ],
    enforcement: {
      agency: "Arizona Department of Public Safety, Commercial Vehicle Enforcement (MCSAP lead agency)",
      url: "https://www.azdps.gov/services/enforcement-services/commercial-vehicle-enforcement",
    },
    near: [
      "california",
      "nevada",
      "new-mexico",
    ],
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    abbr: "AR",
    irp: {
      agency: "Arkansas Department of Finance and Administration, Office of Motor Vehicle (IRP) - Arkansas Trucking Portal / Arkansas Motor Carrier System (AMCS)",
      url: "https://www.dfa.arkansas.gov/office/trucking-portal/",
      note: "DFA's Office of Motor Vehicle (Ragland Building, 1900 W 7th St, Little Rock; 501-682-4692) administers IRP; transactions run through the Arkansas Motor Carrier System (amcs.arkansas.gov).",
    },
    ifta: {
      agency: "Arkansas Department of Finance and Administration, Excise Tax Administration - Motor Fuel Tax Section",
      url: "https://www.dfa.arkansas.gov/excise-tax/motor-fuel-tax/",
      same: false,
      note: "The Motor Fuel Tax section administers IFTA for the motor carrier industry; quarterly returns are filed online through AMCS (amcs.arkansas.gov). No license or decal fee is shown.",
    },
    usdot: {
      rule: "not-required",
      note: "Arkansas is not on FMCSA's list of states that require a USDOT number for intrastate-only carriers; the Arkansas Highway Police FAQ simply points carriers to FMCSA's 'do I need a USDOT number' page. Confirm with ARDOT (501-569-2355) if in doubt.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Arkansas Intrastate Operating Authority permit (ARDOT Legal Division) - general freight application, renewed yearly",
      agency: "Arkansas Department of Transportation, Legal Division (Motor Carrier)",
      url: "https://ardot.gov/divisions/legal/arkansas-intrastate-authority/",
      fee: "$25 application fee plus $5 per vehicle for general freight (ARDOT intrastate authority FAQ)",
      insurance: "Public liability and property damage insurance in the amounts set by ARDOT Rule 13.1, on file before the permit issues",
      note: "ARDOT: all for-hire motor carriers transporting property or passengers wholly within Arkansas must apply for authority; exempt commodities are listed in a linked PDF; private carriers hauling their own freight and owner-operators leased to a for-hire carrier do not need it. Applications are separate for general freight/mobile home, household goods ($50) and passenger carriers ($50). Contact 501-569-2160.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Arkansas Department of Transportation, Arkansas Highway Police - Permit Section (online at ar.gotpermits.com/arpars)",
      url: "https://ardot.gov/divisions/arkansas-highway-police/oversize-and-overweight-permits/",
    },
    extras: [],
    enforcement: {
      agency: "Arkansas Highway Police (a division of the Arkansas Department of Transportation)",
      url: "https://www.ardot.gov/divisions/arkansas-highway-police/",
    },
    near: [
      "tennessee",
      "missouri",
      "oklahoma",
    ],
  },
  {
    slug: "california",
    name: "California",
    abbr: "CA",
    irp: {
      agency: "California Department of Motor Vehicles, IRP Operations Section (Sacramento)",
      url: "https://www.dmv.ca.gov/portal/vehicle-registration/new-registration/commercial-vehicle-registration/international-registration-program/",
      base: "California will only accept IRP applications from carriers who provide proof of residency or an established place of business in California - a location owned, leased or rented by the registrant, with a street address, publicly listed phone, staff and accessible operational records; a home address qualifies for owner-operators.",
      note: "Applications are mailed to IRP Operations (P.O. Box 932320, MS H160, Sacramento, CA 94232-3200; 916-657-7971) with forms MC 2117 I, MC 2118 I, MC 522 I and REG 31 plus USDOT number, tax ID, proof of address and vehicle documents. Payment options: 100 percent California fees, apportioned fees plus other jurisdictions' fees, or flat monthly rates of $250 per vehicle ($300 for vehicles priced $200,000 or more).",
    },
    ifta: {
      agency: "California Department of Tax and Fee Administration (CDTFA)",
      url: "https://www.cdtfa.ca.gov/taxes-and-fees/ifta-ciudft-di-license.htm",
      same: false,
      note: "CDTFA issues the IFTA license; carriers whose interstate travel is limited to Mexico and California, or who are not based in an IFTA jurisdiction, get an Interstate User Diesel Fuel Tax license instead. No license or decal fee is shown on the overview page.",
    },
    usdot: {
      rule: "required",
      note: "California is on FMCSA's list of states requiring a USDOT number for intrastate registrants; the DMV IRP page also requires the USDOT number on applications. California's own carrier identifier is the CA number issued by CHP.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "California Motor Carrier Permit (MCP) from DMV, which requires a California Carrier Identification (CA) number from the California Highway Patrol",
      agency: "California DMV, Motor Carrier Permit Unit (916-657-8153); CA number from the California Highway Patrol",
      url: "https://www.dmv.ca.gov/portal/vehicle-industry-services/motor-carrier-services-mcs/motor-carrier-permits/",
      fee: "$250 total for a for-hire carrier with 1 power unit ($120 base fee + $130 Carrier Inspection Fee), for both original application and renewal",
      insurance: "$300,000 to $5,000,000 combined single limit depending on vehicle type and what you haul (the exact figure for your operation is in the DMV's Motor Carrier Permit handbook)",
      note: "The MCP is required for anyone transporting property for compensation, operating a CMV over 10,001 lbs GVWR, hauling hazmat, or requiring a CDL; it is evidence the carrier has registered its CA number with DMV. Get the CA number from CHP first (online at canumber.chp.ca.gov or form CHP 362 to the nearest Motor Carrier Safety Unit). Intrastate MCPs renew annually; interstate carriers receive a non-expiring MCP and do not pay renewal fees.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Caltrans, Office of Commercial Vehicle Operations - Transportation Permits (Permits Issuance Branch, Sacramento; CTPS online system, 916-322-1297)",
      url: "https://dot.ca.gov/programs/traffic-operations/transportation-permits",
    },
    extras: [
      {
        name: "CARB Clean Truck Check (HD I/M)",
        url: "https://ww2.arb.ca.gov/our-work/programs/CTC",
        note: "Applies to non-gasoline heavy-duty vehicles over 14,000 lbs GVWR operating in California, including out-of-state vehicles; owners must report the vehicle in CTC-VIS, pay an annual compliance fee ($32.13 per vehicle effective 1/1/2026) and submit passing periodic emissions tests.",
      },
      {
        name: "CA number (California Carrier Identification Number)",
        url: "https://www.chp.ca.gov/programs-services/programs/commercial-vehicle-section",
        note: "The CA number is issued only by CHP and is used as the MCP number; apply online at canumber.chp.ca.gov or with form CHP 362. CHP also runs the Basic Inspection of Terminals (BIT) program and Motor Carrier Safety Units that inspect carriers.",
      },
      {
        name: "Motor Carrier Permit fee and Carrier Inspection Fee",
        url: "https://www.dmv.ca.gov/portal/file/basic-inspection-of-terminals-and-carrier-inspection-fee/",
        note: "For a 1-power-unit for-hire carrier the MCP costs $120 plus a $130 Carrier Inspection Fee ($250 total); the CIF is not apportioned or prorated.",
      },
    ],
    enforcement: {
      agency: "California Highway Patrol, Commercial Vehicle Section (Motor Carrier Safety Units, roadside inspections, BIT program)",
      url: "https://www.chp.ca.gov/programs-services/programs/commercial-vehicle-section",
    },
    near: [
      "oregon",
      "nevada",
      "arizona",
    ],
  },
  {
    slug: "colorado",
    name: "Colorado",
    abbr: "CO",
    irp: {
      agency: "Colorado Department of Revenue, Division of Motor Vehicles - IRP (Lakewood)",
      url: "https://dmv.colorado.gov/international-registration-plan",
      base: "Applicant must provide three proofs of Colorado residency or place of business (for example utility bills, tax returns, property tax statements, business license).",
      note: "Register in person at 3265 S Wadsworth Blvd, Lakewood, CO 80214 or online through myDMV (mydmv.colorado.gov); application form DR 7553; valid USDOT number and FEIN required; IRS Form 2290 for vehicles 55,000 lbs and up; multiyear registration available for some commercial trailers. Fees are distance-apportioned; no flat schedule shown.",
    },
    ifta: {
      agency: "Colorado Department of Revenue, Taxation Division - Fuel Tax Unit",
      url: "https://tax.colorado.gov/IFTA",
      same: false,
      note: "Apply by email (DOR_FuelTax@state.co.us), mail, a secure message in Revenue Online, or in person at the Lakewood DMV during IRP registration; the business must be registered with the Colorado Secretary of State and the vehicle registered (IRP or county). Applications without compliance issues are processed within 5 business days; license valid for the calendar year.",
    },
    usdot: {
      rule: "required",
      note: "Colorado is on FMCSA's list of states requiring a USDOT number for intrastate registrants.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Colorado Public Utilities Commission, Transportation Section",
      url: "https://puc.colorado.gov/trans",
      note: "The Colorado PUC lists exactly which carriers it permits - towing, household goods, passenger carriers, limousines, charter buses, transportation network companies, taxis and booting companies - and general freight is not on the list, so a freight hauler needs no PUC permit. Household goods and towing do (303-894-2000, option 2).",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Colorado Department of Transportation, Office of Freight Mobility and Safety - Permit Office (COOPR online permitting, 303-757-9539)",
      url: "https://freight.colorado.gov/permitting-information",
    },
    extras: [
      {
        name: "Colorado State Patrol new entrant information",
        url: "https://csp.colorado.gov/new-entrant-information",
        note: "CSP publishes a new-entrant orientation covering insurance, driver qualification, hours of service and vehicle maintenance for carriers that have just received a USDOT number; CSP also handles DataQs challenges for Colorado inspections (303-239-4500).",
      },
    ],
    enforcement: {
      agency: "Colorado State Patrol, Motor Carrier Safety Section",
      url: "https://csp.colorado.gov/motor-carrier-safety",
    },
    near: [
      "wyoming",
      "nebraska",
      "kansas",
    ],
  },
  {
    slug: "connecticut",
    name: "Connecticut",
    abbr: "CT",
    irp: {
      agency: "Connecticut Department of Motor Vehicles, IRP Unit (60 State Street, Room 102, Wethersfield)",
      url: "https://portal.ct.gov/dmv/commercial-and-industry-services/apply-irp",
      base: "Applicant must submit three different documents showing the same business name and Connecticut address (driver's license, Secretary of State filing, tax return, utility bill, property title, bank statement, etc.).",
      note: "New applications are dropped off at the IRP office or submitted through the CT IRP portal (dmvirp.ct.gov/ctenterprise); payment for new accounts and renewals must be guaranteed funds (certified check, bank check or money order); processing 7-10 business days; $150 per vehicle late renewal fee; the carrier's MCS-150 must be current. IRP Unit phone 860-263-5281.",
    },
    ifta: {
      agency: "Connecticut Department of Revenue Services (DRS)",
      url: "https://portal.ct.gov/DRS/IFTA/Connecticut-IFTA",
      same: false,
      note: "Register and manage IFTA through myconneCT after registering as a Connecticut business; a valid USDOT number in good standing and an FEIN or SSN are required; DRS mails the license and decals.",
    },
    usdot: {
      rule: "required",
      note: "Connecticut is on FMCSA's list. The CT DMV commercial registration page says a USDOT number 'is sometimes needed' (check FMCSA) and that federal inspection requirements apply to vehicles over 10,000 lbs in interstate commerce or over 18,000 lbs in intrastate commerce.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Connecticut Department of Motor Vehicles",
      url: "https://portal.ct.gov/dmv/commercial-and-industry-services/register-commercial-vehicle",
      note: "Connecticut has no state operating authority for general freight. A truck that never leaves Connecticut registers through the DMV's commercial process (form H-13B, proof of insurance and ownership, fees by GVWR) instead of IRP, gets its USDOT number, and registers for the Highway Use Fee once it is 26,000 lbs or heavier.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Connecticut Department of Transportation, Bureau of Highway Operations - Oversize/Overweight Permit Office (CVO WebPortal cvoportal.ct.gov, 860-594-2560)",
      url: "https://portal.ct.gov/dot/permits/oversize-overweight-permits",
    },
    extras: [
      {
        name: "Connecticut Highway Use Fee (HUF)",
        url: "https://portal.ct.gov/drs/businesses/highway-use-fee/huf",
        note: "Since January 1, 2023, anyone operating a Class 8-13 vehicle of 26,000 lbs or more gross weight on Connecticut highways must register for the Highway Use Fee in myconneCT and file quarterly (since Oct 2023); the per-mile rate runs from 2.5 cents (26,000-28,000 lbs) to 17.5 cents (over 80,000 lbs).",
      },
    ],
    enforcement: {
      agency: "Connecticut Department of Motor Vehicles, Commercial Vehicle Safety Division (MCSAP; six fixed weigh/inspection sites)",
      url: "https://portal.ct.gov/dmv/commercial-and-industry-services/get-commercial-safety-inspection",
    },
    near: [
      "new-york",
      "massachusetts",
      "rhode-island",
    ],
    mileFee: "Connecticut Highway Use Fee (26,000 lbs and up, per-mile, quarterly)",
  },
  {
    slug: "delaware",
    name: "Delaware",
    abbr: "DE",
    irp: {
      agency: "Delaware Division of Motor Vehicles, Motor Carrier Services Section (Dover)",
      url: "https://www.dmv.de.gov/VehicleServices/MC/index.shtml",
      base: "Established place of business means a physical structure owned, leased or rented by the fleet registrant; alternatively residency is shown by a Delaware driver's license, principal owner residency, federal tax returns filed from a Delaware address, Delaware income or property taxes, or Delaware utility bills (Delaware IRP Manual).",
      note: "Office at the Public Safety Building, 303 Transportation Circle, Dover, DE 19901; 302-744-2702; dot.motorcarrier@delaware.gov. IRP renewals can be filed online, by email, fax or mail; a billing notice is sent with the amount owed.",
    },
    ifta: {
      agency: "Delaware Division of Motor Vehicles, Motor Carrier Services Section - IFTA Unit",
      url: "https://dmv.de.gov/VehicleServices/MC/index.shtml?dc=iftaFAQs",
      same: true,
      note: "Delaware is the base jurisdiction if the qualified vehicles are registered in Delaware, the carrier has an established place of business there, keeps operational records there (or can make them available) and travels Delaware highways; the IFTA application comes from the Motor Carrier Services / IFTA Unit and returns are filed online or by mail.",
    },
    usdot: {
      rule: "required",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Delaware Division of Motor Vehicles, Motor Carrier Services",
      url: "https://www.dmv.de.gov/VehicleServices/MC/index.shtml",
      note: "Delaware has no state operating authority for general freight. The state-level items for an in-state-only truck are weight-based DMV registration and the USDOT number.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Delaware Department of Transportation, Hauling Permit Office - Oversize/Overweight Permit System (deldot.gov/osow)",
      url: "https://deldot.gov/osow/",
    },
    extras: [
      {
        name: "Weight-based truck registration fees",
        url: "https://dmv.de.gov/Common/DMVFees/index.shtml",
        note: "Delaware's DMV fee schedule lists tiered yearly registration fees for trucks, buses and cargo vans over 5,000 lbs; IRP/IFTA amounts are not on the general schedule.",
      },
    ],
    enforcement: {
      agency: "Delaware State Police, Traffic Operations Section - Commercial Vehicle Enforcement Unit (CVEU); weigh stations at Blackbird and Middletown",
      url: "https://dsp.delaware.gov/traffic-unit/",
    },
    near: [
      "maryland",
      "pennsylvania",
      "new-jersey",
    ],
  },
  {
    slug: "florida",
    name: "Florida",
    abbr: "FL",
    irp: {
      agency: "Florida Department of Highway Safety and Motor Vehicles (FLHSMV), Bureau of Commercial Vehicle and Driver Services",
      url: "https://www.flhsmv.gov/driver-licenses-id-cards/commercial-motor-vehicle-drivers/international-registration-plan/",
      base: "An established place of business is a physical structure owned, leased or rented by the registrant, open during normal business hours, with a person conducting the registrant's business and the fleet's operational records inside; alternatively, at least three proofs of Florida residency (all applicants must provide three forms of proof).",
      note: "Fees are computed from mileage percentages by jurisdiction and vehicle weight; late penalties run $5-$250; Bureau phone (850) 617-3711; transactions can be started online (e-file) but must be finished in the channel where they were started. The IRP Trucking Manual says USDOT numbers must be active, classified interstate and in good standing or registration is denied.",
    },
    ifta: {
      agency: "FLHSMV, Bureau of Commercial Vehicle and Driver Services",
      url: "https://www.flhsmv.gov/driver-licenses-id-cards/commercial-motor-vehicle-drivers/international-fuel-tax-agreement/",
      same: true,
      fee: "$0 for the annual IFTA license; decals $4.00 per set (pair)",
      note: "Online IFTA transactions are finalized through the ICFS team and cannot be moved to walk-in or mail; see the Florida IFTA Trucking Manual for full requirements.",
    },
    usdot: {
      rule: "required",
      note: "Florida is on FMCSA's list. F.S. 316.302 applies 49 CFR parts 382-386 and 390-397 to owners and drivers of CMVs in intrastate commerce, with exceptions for vehicles under 26,001 lbs not hauling hazmat and different intrastate hours-of-service limits.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Florida Highway Safety and Motor Vehicles / Florida Highway Patrol",
      url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0300-0399/0316/Sections/0316.302.html",
      insurance: "F.S. 627.7415: $50,000 per occurrence for CMVs 26,000-34,999 lbs gross weight; $100,000 for 35,000-43,999 lbs; $300,000 for 44,000 lbs and up (vehicles subject to 49 CFR part 387 must meet the federal minimums)",
      note: "Florida has no state operating authority for general freight. What Florida does instead is adopt the federal safety rules for in-state trucks (F.S. 316.302, with exceptions under 26,001 lbs and different intrastate hours-of-service limits) and set its own liability floor by weight in F.S. 627.7415.",
    },
    ucr: {
      participates: false,
      note: "A Florida-based interstate carrier must still register at ucr.gov: if it has an office or operating facility in a participating state it must use that state; otherwise it selects one of AL, AR, GA, KY, LA, MS, NC, OK, SC, TN or TX as its base state.",
    },
    oversize: {
      agency: "Florida Department of Transportation, State Permit Office (Tallahassee, 850-410-5777) - Permit Application System (PAS)",
      url: "https://www.fdot.gov/maintenance/divisions.shtm/structures/owodpermits.shtm",
    },
    extras: [
      {
        name: "Weight-based liability minimums (F.S. 627.7415)",
        url: "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0600-0699/0627/Sections/0627.7415.html",
        note: "Florida sets its own liability floor for commercial motor vehicles by gross weight: $50,000 (26,000-34,999 lbs), $100,000 (35,000-43,999 lbs), $300,000 (44,000 lbs and up); federally regulated carriers follow 49 CFR 387 instead.",
      },
      {
        name: "FHP new entrant audits and compliance reviews",
        url: "https://www.flhsmv.gov/florida-highway-patrol/commercial-vehicle-enforcement/",
        note: "FHP CVE is the Governor's designated lead agency for commercial vehicle operations; it conducts new entrant safety audits and compliance reviews at the carrier's principal place of business, in addition to roadside inspections.",
      },
    ],
    enforcement: {
      agency: "Florida Highway Patrol, Office of Commercial Vehicle Enforcement (safety); FDOT Motor Carrier Size and Weight (weigh stations)",
      url: "https://www.flhsmv.gov/florida-highway-patrol/commercial-vehicle-enforcement/",
    },
    near: [
      "georgia",
      "alabama",
      "south-carolina",
    ],
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbr: "GA",
    irp: {
      agency: "Georgia Department of Revenue, Motor Vehicle Division - Georgia Trucking Portal (EZ IRP)",
      url: "https://dor.georgia.gov/motor-vehicles/georgia-trucking-portal",
      base: "Five proofs from the Established Place of Business list or three proofs from the Georgia Residency list; proofs cannot be mixed between lists and all addresses must match.",
      note: "Since July 3, 2023 all new IRP accounts are opened through EZ IRP (ezirp.dor.ga.gov); renewals and permits run through the enterprise portal (cmv.dor.ga.gov); allow five business days for a response; payment is required before a Temporary Apportioned Permit issues. No flat fee is shown - DOR points to an IRP fee estimator.",
    },
    ifta: {
      agency: "Georgia Department of Revenue (Georgia Tax Center)",
      url: "https://dor.georgia.gov/register-new-ifta-account",
      same: false,
      note: "Register through the Georgia Tax Center (GTC) as a new Georgia business; DOR requires a vehicle that travels outside Georgia, a qualified motor vehicle (over 26,000 lbs or three or more axles), an established place of business in Georgia, the USDOT number if applicable, and SSNs for officers. No license or decal fee shown.",
    },
    usdot: {
      rule: "required",
      note: "Georgia is on FMCSA's list. The DPS GIMC program covers intrastate carriers with vehicles of 10,001 lbs GVWR or more, and DPS reminds all USDOT holders (including intrastate carriers) to complete biennial MCS-150 updates or face deactivation.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "GIMC registration (Georgia Intrastate Motor Carrier) with the Department of Public Safety, renewed yearly with a Form E insurance filing",
      agency: "Georgia Department of Public Safety, Motor Carrier Compliance Division - UCR/GIMC Section (844-238-8097)",
      url: "https://gamccd.net/UCR/UCRGa.aspx",
      fee: "A per-vehicle registration fee set by DPS (its GIMC page lists $25 per vehicle - confirm the current amount when you apply)",
      insurance: "Form E certificate of liability and property damage insurance filed by your insurer (DPS sets the amounts)",
      note: "GIMC (effective July 1, 2015) applies to motor carriers operating only in Georgia with vehicles of 10,001 lbs GVWR or more, more than 10 passengers, or placarded hazmat; interstate carriers registered under UCR are exempt, as are covered farm vehicles, school buses and government vehicles. For-hire applicants file the GIMC application, Form E, a notarized Georgia Security and Immigration Compliance affidavit, a secure ID copy, proof of motor carrier safety training within 12 months, and payment. Household goods, passenger, limousine and non-consensual towing carriers need separate DPS certificates.",
    },
    ucr: {
      participates: true,
      note: "DPS's UCR/GIMC Section handles UCR for Georgia-based interstate carriers and GIMC for intrastate-only carriers.",
    },
    oversize: {
      agency: "Georgia Department of Public Safety, Oversize Permit Unit - GAPROS (Georgia Permitting and Routing Optimization System, 844-837-5500)",
      url: "https://gamccd.net/OSPermit/OSPMain.aspx",
    },
    extras: [
      {
        name: "GIMC registration and motor carrier safety training",
        url: "https://gamccd.net/Documents/GIMC_update_2015.pdf",
        note: "Intrastate-only carriers with 10,001 lb+ vehicles register annually with DPS; for-hire applicants must show completion of motor carrier safety training within the past 12 months and file Form E insurance.",
      },
      {
        name: "Georgia intrastate ELD rule",
        url: "https://gamccd.net/Default.aspx",
        note: "DPS states that intrastate carriers operating solely in Georgia must comply with the ELD rule since January 1, 2019, with the usual short-haul (150 air-mile) and 8-days-in-30 exceptions.",
      },
    ],
    enforcement: {
      agency: "Georgia Department of Public Safety, Motor Carrier Compliance Division (Commercial Vehicle Enforcement)",
      url: "https://dps.georgia.gov/divisions/motor-carrier-compliance-division",
    },
    near: [
      "florida",
      "south-carolina",
      "tennessee",
    ],
  },
  {
    slug: "hawaii",
    name: "Hawaii",
    abbr: "HI",
    usdot: {
      rule: "required",
      note: "Hawaii is on FMCSA's list of states requiring a USDOT number for intrastate registrants.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Hawaii Public Utilities Commission Motor Carrier Certificate (certificate of public convenience and necessity) for transporting property for compensation",
      agency: "Hawaii Public Utilities Commission (808-586-2020)",
      url: "https://puc.hawaii.gov/all-puc-faq/motor-carrier-property-certificate-application-general-info-and-instructions/",
      fee: "Set by the PUC (plus an annual gross revenue fee of 0.25 percent of gross revenue, minimum $20)",
      insurance: "$250,000 per person and $750,000 per accident bodily injury liability plus $250,000 property damage (PUC motor carrier FAQ)",
      note: "The PUC says a motor carrier certificate is required by any motor carrier that transports people or property for compensation or hire over any public highway in the state; apply electronically (form 92-001a) through the PUC's CDMS eServices with supporting customer letters, vehicle inventory and tax clearance. Processing takes six to twelve weeks or longer and cannot be expedited. Certificate holders pay an annual Gross Revenue Fee (gross revenue x 0.0025, minimum $20) and common carriers must keep a tariff on file under HAR 16-603.",
    },
    ucr: {
      participates: false,
      note: "UCR applies to interstate operations, which a Hawaii truck cannot perform by road; if a Hawaii-based company must register, it uses an office in a participating state or selects one of AK, CA, CO, ID, MT, ND, NM, SD, UT or WA as its base state.",
    },
    oversize: {
      agency: "Hawaii Department of Transportation, Highways Division - district permit offices (Oahu 808-831-6700 x107; Maui 808-873-3535; Hawaii Island 808-933-8866; Kauai 808-241-3000)",
      url: "https://hidot.hawaii.gov/highways/home/doing-business/guide-to-permits/oversized-and-overweight-vehicles-on-state-highways/",
    },
    extras: [
      {
        name: "PUC Gross Revenue Fee and tariff filing",
        url: "https://puc.hawaii.gov/motor_carriers/faqs-for-motor-carriers/",
        note: "Certificated carriers pay an annual fee of gross revenue x 0.0025 (minimum $20); common carriers of property must have a tariff on file with the PUC (HAR 16-603), contract carriers do not.",
      },
      {
        name: "HDOT Motor Vehicle Safety Office new-carrier requirements",
        url: "https://hidot.hawaii.gov/highways/library/motor-vehicle-safety-office/",
        note: "HDOT publishes Instructions for New Motor Carriers, General Requirements for Motor Carriers, a USDOT number requirement notice, Vehicle Identification Card (VIC) instructions and DOT safety-check rules for CMVs; the office sets Hawaii's motor carrier safety rules.",
      },
    ],
    enforcement: {
      agency: "Hawaii Department of Transportation, Highways Division - Motor Vehicle Safety Office",
      url: "https://hidot.hawaii.gov/highways/library/motor-vehicle-safety-office/function-of-motor-vehicle-safety-office/",
    },
    near: [
      "california",
      "washington",
      "oregon",
    ],
    irpAlt: "Hawaii is not an IRP member - there is no interstate road travel from the islands - so trucks are registered with the county motor vehicle office where they are based (Honolulu, Maui, Hawaii or Kauai county).",
    iftaAlt: "Hawaii is not an IFTA member. A Hawaii truck cannot drive into another jurisdiction, so there is no fuel-use-tax license to get; state and county fuel taxes are paid at the pump.",
    island: true,
  },
  {
    slug: "idaho",
    name: "Idaho",
    abbr: "ID",
    irp: {
      agency: "Idaho Transportation Department, DMV Commercial Vehicle Services (CVS)",
      url: "https://itd.idaho.gov/dmv/commercial-vehicle-services/",
      base: "Established place of business: a physical structure in Idaho owned, leased or rented by the registrant, open and staffed during regular business hours by the registrant's employees for trucking-related business; or Idaho residency shown by at least three documents (Idaho driver's license, personal vehicle registration, tax filings, property tax assessment, utility bill, lease or mortgage statement).",
      note: "CVS contact cvs@itd.idaho.gov, (208) 872-3163; online account access through the Idaho enterprise registration site (crs.idaho.celtic-host.com/IDEnterprise) and the Idaho Trucking Portal; USDOT numbers on the account must be in good standing or the account is suspended. Commercial vehicles over 60,000 lbs must register through CVS; 8,001-26,000 lbs may use CVS or the county assessor. No flat fee shown.",
    },
    ifta: {
      agency: "Idaho State Tax Commission",
      url: "https://tax.idaho.gov/taxes/product-excise-taxes/fuels-taxes-and-fees/consumer-fuels/ifta-licenses/licensing/apply/",
      same: false,
      fee: "$10 processing fee plus $0.60 per set of two decals (two sets required per vehicle)",
      note: "Apply online through TAP (tax.idaho.gov/gotoTAP), by mail with Form IMC-2, or by fax/email with phone payment through the IFTA Help Desk; license valid January through December; decals go on both sides of the lower rear of the cab.",
    },
    usdot: {
      rule: "required",
      note: "ITD's Trucker's Handbook says the USDOT number applies to interstate trucks over 10,000 lbs and intrastate trucks over 26,000 lbs, with the Idaho State Police Commercial Vehicle Safety office (208-884-7220) handling intrastate numbers; Idaho is also on FMCSA's list.",
      url: "https://itd.idaho.gov/wp-content/uploads/2016/07/truckershandbook.pdf",
    },
    intra: {
      status: "none",
      agency: "Idaho Transportation Department, DMV Commercial Vehicle Services",
      url: "https://itd.idaho.gov/dmv/commercial-vehicle-services/",
      note: "Idaho has no state operating authority for general freight - ITD's publications treat operating authority as a purely federal matter. An Idaho-only truck registers under the Full Fee program through Commercial Vehicle Services (or the county assessor between 8,001 and 26,000 lbs) and gets a USDOT number above 26,000 lbs.",
    },
    ucr: {
      participates: true,
      note: "ITD publishes a UCR fact sheet.",
    },
    oversize: {
      agency: "Idaho Transportation Department, Special Permits Office (800-662-7133) - permits4idaho.com / Idaho Trucking Online",
      url: "https://itd.idaho.gov/dmv/commercial-vehicle-services/",
    },
    extras: [
      {
        name: "Special permits through permits4idaho.com",
        url: "https://itd.idaho.gov/wp-content/uploads/2016/07/truckershandbook.pdf",
        note: "Single-trip and annual oversize/overweight special permits are ordered online at permits4idaho.com or by phone at 800-662-7133.",
      },
      {
        name: "ISP new entrant audits and medical certificate out-of-service rule",
        url: "https://isp.idaho.gov/cvs/",
        note: "ISP CVS conducts the new entrant safety audits for Idaho-based carriers and notes that since April 1, 2025 a driver without a valid medical certificate is placed out of service.",
      },
    ],
    enforcement: {
      agency: "Idaho State Police, Commercial Vehicle Safety (CVS) Division",
      url: "https://isp.idaho.gov/cvs/",
    },
    near: [
      "washington",
      "oregon",
      "montana",
    ],
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbr: "IL",
    irp: {
      agency: "Illinois Secretary of State, Commercial and Farm Truck Division",
      url: "https://www.ilsos.gov/",
      note: "The Secretary of State's Commercial and Farm Truck Division in Springfield runs Illinois apportioned registration; start from ilsos.gov and its Commercial and Farm Truck pages.",
    },
    ifta: {
      agency: "Illinois Department of Revenue (Motor Fuel Use Tax / IFTA)",
      url: "https://tax.illinois.gov/research/taxinformation/motorfuel/mfut/licensereg.html",
      same: false,
      fee: "License is free; decals $3.75 per vehicle (set of two)",
      note: "Register with Form MFUT-12 through MyTax Illinois (two-step verification); a USDOT number is required before registering; Illinois must be the base jurisdiction (vehicles registered in Illinois, established place of business, records kept there, miles in Illinois). License valid January 1 - December 31.",
    },
    usdot: {
      rule: "not-required",
      note: "Illinois is not on FMCSA's list of states requiring a USDOT number for intrastate-only carriers. (IDOR does require a USDOT number to register for IFTA, which is an interstate program.)",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Illinois Commerce Commission Public Carrier Certificate (intrastate for-hire transportation of property other than household goods)",
      agency: "Illinois Commerce Commission, Transportation Division",
      url: "https://www.illinois.gov/services/service.public-carrier-certificate.html",
      note: "The State of Illinois says plainly that anyone doing for-hire transportation of property other than household goods over public roads in intrastate commerce must hold a Public Carrier Certificate from the Illinois Commerce Commission. The application is ICC form PCC-1 and your insurer files proof of insurance on the ICC's forms; the ICC's own site (icc.illinois.gov) has the current fee and insurance minimums.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Illinois Department of Transportation, Bureau of Operations - Permit Office (Springfield; ITAP - Illinois Transportation Automated Permit system; 800-252-8636 in Illinois)",
      url: "https://idot.illinois.gov/doing-business/permit-and-sales-marketplace/oversize-and-overweight-permits.html",
    },
    extras: [
      {
        name: "IFTA registration through MyTax Illinois",
        url: "https://tax.illinois.gov/research/taxinformation/motorfuel/mfut/licensereg.html",
        note: "Free license, $3.75 per vehicle for decals, Form MFUT-12 in MyTax Illinois; a USDOT number is required before applying.",
      },
    ],
    enforcement: {
      agency: "Illinois State Police, Division of Patrol - Commercial Motor Vehicle Officers (commercial motor vehicle law and hazmat enforcement)",
      url: "https://isp.illinois.gov/Patrol",
    },
    near: [
      "indiana",
      "wisconsin",
      "missouri",
    ],
  },
  {
    slug: "indiana",
    name: "Indiana",
    abbr: "IN",
    irp: {
      agency: "Indiana Department of Revenue, Motor Carrier Services (MCS)",
      url: "https://www.in.gov/dor/motor-carrier-services/international-registration-plan-irp/",
      note: "Fully online IRP system (process, pay and print cab cards from home); a 10% penalty applies to IRP renewals paid after the due date. MCS office is in Indianapolis, in-person by appointment.",
    },
    ifta: {
      agency: "Indiana Department of Revenue, Motor Carrier Services (MCS) - Fuel Tax (IFTA/MCFT)",
      url: "https://www.in.gov/dor/motor-carrier-services/motor-carrier-online-services/",
      same: true,
      note: "The MCS online IFTA/MCFT fuel tax system handles quarterly returns, renewals and additional decals.",
    },
    usdot: {
      rule: "required",
      note: "MCS FAQ: intrastate carriers need a USDOT number if a vehicle has a GVWR/GCWR of 10,001 lbs or more (or hauls placarded hazmat); intrastate haulers of their own non-hazardous property under 26,000 lbs are exempt. Indiana is also on FMCSA's list of states requiring USDOT numbers for intrastate carriers.",
      url: "https://www.in.gov/dor/motor-carrier-services/frequently-asked-questions-motor-carrier-services/",
    },
    intra: {
      status: "none",
      agency: "Indiana Department of Revenue, Motor Carrier Services",
      url: "https://www.in.gov/dor/motor-carrier-services/usdot-and-ucr/indiana-intrastate-passenger-and-household-good-authority/",
      note: "Indiana's intrastate authority ($100 certificate from DOR Motor Carrier Services) is only for household goods and passenger carriers. For general freight the rule is simpler: a for-hire truck of 10,001 lbs or more needs a USDOT number, and one under 10,000 lbs GVWR needs an Indiana ID Number from Motor Carrier Services.",
    },
    ucr: {
      participates: true,
      note: "MCS online services page directs interstate carriers to register and pay at ucr.gov.",
    },
    oversize: {
      agency: "Indiana Department of Revenue, Motor Carrier Services - Oversize/Overweight Permitting",
      url: "https://www.in.gov/dor/motor-carrier-services/",
    },
    extras: [
      {
        name: "Indiana Motor Carrier Fuel Tax (MCFT) license",
        url: "https://www.in.gov/dor/motor-carrier-services/files/cmv-guidebook.pdf",
        note: "Intrastate-only carriers with vehicles over 26,001 lbs combined gross/registered weight register for MCFT (Indiana's in-state fuel tax) instead of IFTA; decals are issued per vehicle.",
      },
      {
        name: "Indiana ID Number (for-hire intrastate under 10,000 lbs)",
        url: "https://www.in.gov/dor/motor-carrier-services/frequently-asked-questions-motor-carrier-services/",
        note: "MCS FAQ: any for-hire carrier hauling someone else's property intrastate with a GVWR under 10,000 lbs needs an Indiana ID Number.",
      },
    ],
    enforcement: {
      agency: "Indiana State Police, Commercial Vehicle Enforcement Division",
      url: "https://www.in.gov/isp/",
    },
    near: [
      "illinois",
      "ohio",
      "kentucky",
    ],
  },
  {
    slug: "iowa",
    name: "Iowa",
    abbr: "IA",
    irp: {
      agency: "Iowa Department of Transportation, Office of Vehicle and Motor Carrier Services",
      url: "https://iowadot.gov/motor-carriers/irp-international-registration-plan",
      base: "Carriers register with the home state where they have an established business location; the physical address for registration must be in Iowa (three forms of address verification required).",
      note: "Online system at iftairp.iowadot.gov; new IRP accounts cannot be opened in person - submit by email or mail to the Ankeny office; invoices must be paid with guaranteed funds.",
    },
    ifta: {
      agency: "Iowa Department of Transportation, Office of Vehicle and Motor Carrier Services",
      url: "https://iowadot.gov/motor-carriers/ifta-international-fuel-tax-agreement",
      same: true,
      fee: "$10 application fee plus $1 per set of IFTA decals",
      note: "IFTA page states a $10 application fee and $1 annual fee per set of decals; the motor carriers landing page notes House File 992 raised decals from 50 cents to $1 effective July 1, 2026. Same iftairp.iowadot.gov portal as IRP.",
    },
    usdot: {
      rule: "required",
      note: "Iowa is on FMCSA's list of states requiring USDOT numbers for intrastate carriers; the Iowa Motor Truck Information Guide says intrastate-only carriers display the USDOT number followed by the letters 'IA'.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Iowa Intrastate Motor Carrier Permit/Certificate (Form 441052)",
      agency: "Iowa Department of Transportation, Office of Vehicle and Motor Carrier Services",
      url: "https://iowadot.gov/motor-carriers/forms",
      fee: "Set by Iowa DOT (Form 441052; the permit itself does not expire)",
      insurance: "$750,000 for non-hazardous property in vehicles of 10,000 lbs GVW and up (Iowa Motor Truck Information Guide)",
      note: "The Iowa Motor Truck Information Guide says intrastate for-hire carriers of household goods, liquid (nondairy), liquid dairy and 'property (other freight)' must obtain a non-expiring Motor Carrier Permit before operating, with a Form E insurance filing.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Iowa Department of Transportation, Office of Vehicle and Motor Carrier Services",
      url: "https://iowadot.gov/motor-carriers/how-do-i-get-oversize-overweight-permits",
    },
    extras: [
      {
        name: "'IA' suffix on USDOT marking for intrastate-only carriers",
        url: "https://iowadot.gov/media/1146/download?inline=",
        note: "Carriers that operate only in Iowa must include the letters 'IA' after the USDOT number on the vehicle.",
      },
    ],
    enforcement: {
      agency: "Iowa State Patrol, Commercial Motor Vehicle Unit",
      url: "https://iowadot.gov/media/1146/download?inline=",
    },
    near: [
      "minnesota",
      "missouri",
      "nebraska",
    ],
  },
  {
    slug: "kansas",
    name: "Kansas",
    abbr: "KS",
    irp: {
      agency: "Kansas Department of Revenue, Division of Vehicles - Commercial Motor Vehicle Office (Motor Carrier Services Bureau)",
      url: "https://www.ksrevenue.gov/dovirp.html",
      base: "To base in Kansas the registrant must have an established place of business in Kansas (a physical structure owned, leased or rented), a listed Kansas phone number, accrue Kansas mileage, and keep records in Kansas or make them available for audit.",
      note: "Office at 300 SW 29th St, Topeka; the office calculates apportioned fees and invoices you. The Trucking Through Kansas page links to the Kansas Commercial Motor Vehicle Registration System (KCoVRS) for online transactions.",
    },
    ifta: {
      agency: "Kansas Department of Revenue, Motor Fuel Tax (IFTA)",
      url: "https://www.ksrevenue.gov/forms-mfifta.html",
      same: false,
      fee: "$10 for the first qualified vehicle plus $1 for each additional vehicle (per Form MF-39)",
      note: "Same department (KDOR) but a different unit from the CMV registration office. Online filing, renewals and decal orders through the KDOR Customer Service Center; apply on Form MF-39.",
    },
    usdot: {
      rule: "required",
      note: "KCC's safety compliance guide says intrastate carriers need a USDOT number and must mark vehicles with legal name and USDOT number; Kansas is also on FMCSA's list of states requiring USDOT numbers for intrastate carriers.",
      url: "https://www.kcc.ks.gov/images/PDFs/transportation/10-2021_redbook.pdf",
    },
    intra: {
      status: "required",
      what: "Kansas Corporation Commission intrastate operating authority (certificate of public service / 'Kan-C' authority)",
      agency: "Kansas Corporation Commission, Transportation Division",
      url: "https://www.kcc.ks.gov/transportation",
      fee: "Set by the KCC (filed and paid through its KTRAN system)",
      note: "KCC's guide: a person transporting property for hire point to point in Kansas needs Kan-C authority and must register with KCC before operating; K.A.R. 82-4-27 requires a certificate of public service for intrastate common carriers. Filings and payments go through KCC's KTRAN system (ACH $1.50 / card 2.5% processing fees from Oct 1, 2025).",
    },
    ucr: {
      participates: true,
      note: "KCC issues UCR penalty orders, indicating it administers UCR in Kansas.",
    },
    oversize: {
      agency: "Kansas Department of Transportation - Kansas Truck Routing and Intelligent Permitting System (K-TRIPS)",
      url: "https://www.ksdot.gov/doing-business/commercial-vehicle-information",
    },
    extras: [],
    enforcement: {
      agency: "Kansas Highway Patrol (with KCC Transportation Division)",
      url: "https://www.kcc.ks.gov/images/PDFs/transportation/10-2021_redbook.pdf",
    },
    near: [
      "missouri",
      "oklahoma",
      "nebraska",
    ],
  },
  {
    slug: "kentucky",
    name: "Kentucky",
    abbr: "KY",
    irp: {
      agency: "Kentucky Transportation Cabinet, Division of Motor Carriers",
      url: "https://drive.ky.gov/motor-carriers/Pages/IRP.aspx",
      base: "A Kentucky-based IRP account requires a physical Kentucky location, proven with three forms of Kentucky physical address documentation.",
      note: "IRP transactions through the Motor Carrier Portal ('IRP Online'); page says 80,000 lb plates may cost roughly $1,250 to $2,500 depending on jurisdictions; e-payment fee $3 ACH or 4% card.",
    },
    ifta: {
      agency: "Kentucky Transportation Cabinet, Division of Motor Carriers",
      url: "https://drive.ky.gov/motor-carriers/Pages/IFTA.aspx",
      same: true,
      fee: "$0 (Form TC 95-1: 'No fees are required to apply for IFTA')",
      note: "Apply with the Kentucky Trucking Application (TC 95-1); file and renew through Motor Carrier Connect (ky.motorcarrierconnect.com). Intrastate-only carriers use KIT instead of IFTA.",
    },
    usdot: {
      rule: "required",
      note: "KYTC page: USDOT number is required and must be displayed for intrastate vehicles 10,001-26,000 lbs GVWR and over 26,000 lbs combined licensed weight; not required under 10,001 lbs. Kentucky is also on FMCSA's list.",
      url: "https://drive.ky.gov/Motor-Carriers/Pages/Inter-Intrastate-Carriers.aspx",
    },
    intra: {
      status: "required",
      what: "Kentucky Intrastate For-Hire Certificate",
      agency: "Kentucky Transportation Cabinet, Division of Motor Carriers",
      url: "https://drive.ky.gov/Motor-Carriers/Pages/Inter-Intrastate-Carriers.aspx",
      fee: "$25 registration (and yearly renewal) plus $10 per vehicle (per Form TC 95-1)",
      insurance: "Form E (Uniform Motor Carrier BI/PD certificate) filed by the insurer before applying; limits per KRS 281.655",
      note: "Anyone who transports others' goods within Kentucky for payment needs an Intrastate For-Hire Certificate, applied for through the Motor Carrier Portal; at least one vehicle must be available before the certificate is granted. Interstate for-hire carriers apply once ($25 one-time) and it stays active while insurance is on file.",
    },
    wd: {
      name: "KYU",
      threshold: "over 59,999 lbs combined licensed weight",
      url: "https://drive.ky.gov/motor-carriers/Pages/KYU.aspx",
      note: "KYU is the Kentucky Weight Distance Tax: $0.0285 per Kentucky mile (KRS 138.660), with the KYU number issued at the end of the online application through a KYID account. Quarterly returns are required even with zero miles, or you face penalty, interest and a $500 revocation fee. Farm-plated vehicles are exempt; temporary permits exist for one-off trips.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Kentucky Transportation Cabinet - Overweight/Over-Dimensional Permits (Kentucky Automated Permit System)",
      url: "https://drive.ky.gov/Motor-Carriers/Overweight-Over-Dimensional/Pages/OWOD-Permits.aspx",
    },
    extras: [
      {
        name: "KIT (Kentucky Intrastate Tax) fuel license",
        url: "https://drive.ky.gov/motor-carriers/Pages/KIT.aspx",
        note: "Intrastate-only Kentucky carriers with vehicles of 26,001+ lbs combined licensed weight or 3+ axles license under KIT instead of IFTA; quarterly filing required even with no travel ($500 revocation fee if not).",
      },
      {
        name: "KYID account / Motor Carrier Portal",
        url: "https://drive.ky.gov/motor-carriers/Pages/default.aspx",
        note: "All Kentucky motor carrier credentials (KYU, IFTA/KIT, IRP, intrastate certificates, OW/OD permits) run through the Motor Carrier Portal, which requires a KYID account.",
      },
    ],
    enforcement: {
      agency: "Kentucky State Police, Commercial Vehicle Enforcement",
    },
    near: [
      "tennessee",
      "ohio",
      "indiana",
    ],
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    abbr: "LA",
    irp: {
      agency: "Louisiana Department of Public Safety, Office of Motor Vehicles (IRP)",
      url: "https://expresslane.la.gov/omv/vehicles/international-registration-plan/irp-apportioned-plates/",
      base: "Established place of business means a physical structure owned or leased for at least 12 months, staffed at least 20 hours a week by permanent employees, with signage and posted hours; virtual or shared offices do not qualify.",
      note: "New applicants need a USDOT number and the IRP New Account Checklist; filed at eight regional OMV offices; fees based on fleet miles and vehicle characteristics, payable in certified funds. Additional info at la-trucks-online.org.",
    },
    ifta: {
      agency: "Louisiana Department of Revenue, Excise Taxes Section",
      url: "https://dam.ldr.la.gov/taxforms/5682-6-20.pdf",
      same: false,
      fee: "$35 initial license fee; decals $1 each on initial order, $2 per set for renewals/additional sets",
      note: "Per the LDR IFTA Compliance Manual; apply by paper or through LDR's online business registration; file returns and order decals through LaTAP.",
    },
    usdot: {
      rule: "not-required",
      note: "Louisiana is not on FMCSA's list of states that require a USDOT number for intrastate-only carriers.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Louisiana Public Service Commission, Transportation Division",
      url: "https://lpsc.louisiana.gov/Carrier_Regs",
      note: "The Louisiana Public Service Commission's carrier certificates and permits cover waste, saltwater, household goods, passengers and towing - general freight is not on its list, so a freight hauler working inside Louisiana needs no LPSC authority. Household goods and waste haulers do.",
    },
    ucr: {
      participates: true,
      note: "Louisiana OMV has a UCR page and will deny IRP registration for vehicles under a USDOT number that is out of UCR compliance.",
    },
    oversize: {
      agency: "Louisiana DOTD, Office of Operations - Oversize/Overweight Truck Permits (LaGeaux system)",
      url: "https://www.dotd.louisiana.gov/about/office-of-operations/oversized-and-overweight-truck-permits/",
    },
    extras: [
      {
        name: "UCR tied to IRP",
        url: "https://expresslane.la.gov/omv/vehicles/international-registration-plan/unified-carrier-registration-ucr/",
        note: "OMV will deny IRP registration for any vehicles associated with a USDOT number that has not paid UCR.",
      },
    ],
    enforcement: {
      agency: "Louisiana State Police (motor carrier safety / MCSAP)",
      url: "https://lsp.org/",
    },
    near: [
      "texas",
      "mississippi",
      "arkansas",
    ],
  },
  {
    slug: "maine",
    name: "Maine",
    abbr: "ME",
    irp: {
      agency: "Maine Bureau of Motor Vehicles, Motor Carrier Services - IRP Unit",
      url: "https://www.maine.gov/sos/bmv/vehicles/commercial-vehicles-motor-carrier-services/international-registration-plan",
      note: "Online at me.motorcarrierconnect.com; contact the IRP Unit (207-624-9000 ext. 52135) to open an account; 72-hour trip permits available.",
    },
    ifta: {
      agency: "Maine Bureau of Motor Vehicles, Motor Carrier Services - Fuel Tax Unit",
      url: "https://www.maine.gov/sos/bmv/vehicles/commercial-vehicles-motor-carrier-services/fuel-tax-licensing-and-reporting",
      same: true,
      fee: "$5.00 per set of decals",
      note: "Annual license expires Dec 31; IFTA E-Pay and me.motorcarrierconnect.com for online payment/filing; $50 72-hour fuel trip permit. Maine-based intrastate-only carriers must still license qualified vehicles but may be excused from quarterly reports if all fuel is tax-paid in Maine.",
    },
    usdot: {
      rule: "required",
      note: "The BMV says a truck over 26,000 lbs must get and display a USDOT number even if it never leaves Maine (10,000 to 26,000 lbs are exempt under the state rule), while the State Police FAQ uses 10,001 lbs - Maine is on FMCSA's list either way, so the safe move is to get the free number for anything over 10,000 lbs.",
      url: "https://maine.gov/sos/bmv/commercial/usdot.html",
    },
    intra: {
      status: "none",
      agency: "Maine Bureau of Motor Vehicles, Motor Carrier Services - For-Hire Insurance (Operating Authority Unit)",
      url: "https://www.maine.gov/sos/bmv/commercial/operatingauth.html",
      insurance: "$350,000 combined single limit for property carriers on the BMV's for-hire insurance table (interstate general freight still needs the federal $750,000)",
      note: "Maine has no certificate or permit for trucking general freight inside the state. What it does have is a for-hire insurance filing: the Secretary of State will not register a vehicle operated for hire until the owner files proof of insurance with the BMV's Operating Authority Unit (forhireins@maine.gov, 207-624-9000 ext. 52131). Only passenger carriers get an actual BMV permit.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Maine Bureau of Motor Vehicles, Motor Carrier Services - Overlimit Permit Unit",
      url: "https://www.maine.gov/sos/bmv/vehicles/commercial-vehicles-motor-carrier-services/overlimit-permits",
    },
    extras: [
      {
        name: "For-Hire Insurance filing (BMV Operating Authority Unit)",
        url: "https://www.maine.gov/sos/bmv/vehicles/commercial-vehicles-motor-carrier-services/for-hire-insurance",
      },
    ],
    enforcement: {
      agency: "Maine State Police, Troop K Commercial Vehicle Enforcement Unit",
      url: "https://www.maine.gov/dps/msp/investigation-traffic/commercial-vehicle-unit",
    },
    near: [
      "new-hampshire",
      "massachusetts",
      "vermont",
    ],
  },
  {
    slug: "maryland",
    name: "Maryland",
    abbr: "MD",
    irp: {
      agency: "Maryland MDOT Motor Vehicle Administration (MVA) - IRP",
      url: "https://mva.maryland.gov/vehicles/Pages/registration/irp.aspx",
      note: "Register online through the myMVA Business Portal or by appointment at an MVA branch; page mentions a tax credit for Class F tractors (up to $400 per vehicle, $10,000 max per year).",
    },
    ifta: {
      agency: "Comptroller of Maryland, Motor Fuel Tax Unit (IFTA)",
      url: "https://interactive.marylandtaxes.gov/extranet/red/mftb/iftareg/IFTAInformation.asp",
      same: false,
      note: "Apply for the license and decals through the Comptroller's online IFTA registration (about two weeks processing); quarterly returns to the Annapolis office; $50 minimum penalty for late returns.",
    },
    usdot: {
      rule: "required",
      note: "Maryland Motor Carrier Handbook: intrastate carriers with vehicles of 10,001 lbs or more GVWR/GCWR need a USDOT number; Maryland is on FMCSA's list.",
      url: "https://www.roads.maryland.gov/OOTS/motorcarrierhandbook.pdf",
    },
    intra: {
      status: "none",
      agency: "Maryland Public Service Commission (passenger carriers only)",
      url: "https://www.roads.maryland.gov/OOTS/motorcarrierhandbook.pdf",
      note: "Maryland's Motor Carrier Handbook says only intrastate passenger carriers need a Public Service Commission permit - there is no state operating authority for hauling general freight inside Maryland beyond the USDOT number. For-hire property carriers over 26,000 lbs carry the federal Part 387 minimum ($750,000 for non-hazardous freight).",
    },
    ucr: {
      participates: false,
      note: "A carrier with its principal place of business in Maryland still must register and may select CT, DE, MA, ME, NH, NY, PA, RI, VA or WV as its UCR base state.",
    },
    oversize: {
      agency: "MDOT State Highway Administration, Motor Carrier Division - Hauling Permits (Maryland One / marylandone.gotpermits.com)",
      url: "https://roads.maryland.gov/mdotsha/pages/cvo.aspx?did=ahps&PageId=23",
    },
    extras: [
      {
        name: "UCR base-state selection for Maryland carriers",
        url: "https://plan.ucr.gov/frequently-asked-questions/",
        note: "Because Maryland does not participate, a Maryland-based interstate carrier registers for UCR through a neighboring participating state (CT, DE, MA, ME, NH, NY, PA, RI, VA or WV).",
      },
    ],
    enforcement: {
      agency: "Maryland State Police, Commercial Vehicle Enforcement Division",
      url: "https://www.roads.maryland.gov/OOTS/motorcarrierhandbook.pdf",
    },
    near: [
      "virginia",
      "pennsylvania",
      "delaware",
    ],
  },
  {
    slug: "massachusetts",
    name: "Massachusetts",
    abbr: "MA",
    irp: {
      agency: "Massachusetts Registry of Motor Vehicles (MassDOT RMV) - IRP Section",
      url: "https://www.mass.gov/international-registration-plan-irp",
      base: "An interstate carrier files its application with the jurisdiction in which it is based (the base jurisdiction).",
      note: "Manage IRP accounts through myRMV; page links to new and renewal applications and RMV forms.",
    },
    ifta: {
      agency: "Massachusetts Department of Revenue (DOR)",
      url: "https://www.mass.gov/info-details/international-fuels-tax-agreement-for-motor-carriers-ifta",
      same: false,
      fee: "$8 per vehicle (decal fee on Form IFTA-1)",
      note: "Register and file quarterly through MassTaxConnect; annual renewal. Form IFTA-1 shows $8 per vehicle for decals.",
    },
    usdot: {
      rule: "required",
      note: "RMV bulletin under 540 CMR 2.22: intrastate CMVs with GVWR/GCWR of 10,001 lbs or more must obtain and display a USDOT number (effective Sept 1, 2018; enforcement from Jan 1, 2019). Massachusetts is on FMCSA's list.",
      url: "https://www.mass.gov/regulatory-bulletin/new-usdot-number-requirement-for-intrastate-cmvs",
    },
    intra: {
      status: "none",
      agency: "Massachusetts Department of Public Utilities, Transportation Oversight Division (household goods, buses, police tows)",
      url: "https://www.mass.gov/orgs/transportation-oversight-division",
      note: "The DPU's Transportation Oversight Division licenses household goods movers, intrastate bus companies and police-ordered towing - it does not offer a certificate for general freight, so there is nothing to apply for at the state level beyond the USDOT number and the RMV's commercial registration. Household goods movers do need a DPU license ($100 application, $40 per decal, $100 tariff filing).",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "MassDOT Highway Division, Truck Permit Office (Weston) - OASIS permitting system",
      url: "https://www.mass.gov/commercial-truck-permits",
    },
    extras: [
      {
        name: "540 CMR 2.22 commercial marking (USDOT on intrastate CMVs)",
        url: "https://www.mass.gov/regulatory-bulletin/new-usdot-number-requirement-for-intrastate-cmvs",
        note: "Failure to obtain and display a USDOT number on a 10,001+ lb intrastate CMV can mean a civil fine and/or the vehicle placed out of service.",
      },
    ],
    enforcement: {
      agency: "Massachusetts State Police, Commercial Vehicle Enforcement Section",
    },
    near: [
      "connecticut",
      "new-hampshire",
      "rhode-island",
    ],
  },
  {
    slug: "michigan",
    name: "Michigan",
    abbr: "MI",
    irp: {
      agency: "Michigan Department of State (Secretary of State) - IRP",
      url: "https://www.michigan.gov/sos/industry-services/irp",
      base: "An interstate carrier files its apportioned registration application in the state or province where the carrier is based (the base jurisdiction).",
      note: "Processed online through SOS e-Services (dsvsesvc.sos.state.mi.us/TAP); all documents must be in hand before processing; IRP Manual revised 09/2025.",
    },
    ifta: {
      agency: "Michigan Department of Treasury - IFTA",
      url: "https://www.michigan.gov/ifta",
      same: false,
      fee: "$0 ('There is no fee for a Michigan IFTA license and decals')",
      note: "Apply and file through the IFTA Processing Consortium / mi.motorcarrierconnect.com; quarterly returns required even with no operations; annual renewal by March 15.",
    },
    usdot: {
      rule: "required",
      note: "MSP CVED says a USDOT number application is required for intrastate authority when GVWR is over 26,001 lbs; Michigan is on FMCSA's list of states requiring USDOT numbers for intrastate carriers.",
      url: "https://www.michigan.gov/msp/divisions/cved/regulatory",
    },
    intra: {
      status: "required",
      what: "Michigan intrastate operating authority ('CVED Authority') under the Motor Carrier Act, Public Act 254 of 1933",
      agency: "Michigan State Police, Commercial Vehicle Enforcement Division - Regulatory and Credentialing Section",
      url: "https://www.michigan.gov/msp/divisions/cved/regulatory",
      fee: "Processing and decal fees set by MSP CVED (annual renewal window October 1 to December 1)",
      insurance: "Certificate of liability insurance plus Form E filed by the insurer (Form H additionally for household goods)",
      note: "All intrastate for-hire carriers must obtain CVED authority before operating on any public road in Michigan; your insurer files a certificate of liability insurance and Form E first. Processing and decal fees apply, and the authority renews every year between October 1 and December 1. The same MSP section also administers UCR for Michigan.",
    },
    ucr: {
      participates: true,
      note: "UCR is administered by the MSP CVED Regulatory and Credentialing Section.",
    },
    oversize: {
      agency: "Michigan Department of Transportation, Transport Permits Unit (MiTRIP)",
      url: "https://www.michigan.gov/mdot/business/permits/oversize-overweight",
    },
    extras: [],
    enforcement: {
      agency: "Michigan State Police, Commercial Vehicle Enforcement Division",
      url: "https://www.michigan.gov/msp/divisions/cved",
    },
    near: [
      "ohio",
      "indiana",
      "wisconsin",
    ],
  },
  {
    slug: "minnesota",
    name: "Minnesota",
    abbr: "MN",
    irp: {
      agency: "Minnesota Department of Public Safety, Driver and Vehicle Services (DVS) - IRP/IFTA Office",
      url: "https://dps.mn.gov/divisions/dvs/business/irp-and-ifta",
      note: "DVS page describes IRP as an optional registration method for interstate fleets and links to the DVS IRP manual; contact 651-205-4141 / dvs.prorate@state.mn.us per the MnDOT regulations book.",
    },
    ifta: {
      agency: "Minnesota Department of Public Safety, Driver and Vehicle Services (DVS) - IRP/IFTA Office",
      url: "https://dps.mn.gov/divisions/dvs/business/irp-and-ifta",
      same: true,
      fee: "$28 annual fuel license fee plus $11 annual filing fee plus $2.50 per vehicle decal fee (per MnDOT 2022 Commercial Truck and Passenger Regulations book)",
    },
    usdot: {
      rule: "required",
      note: "Minnesota is on FMCSA's list of states requiring USDOT numbers for intrastate carriers; MnDOT's 2022 regulations book says a USDOT number is required for intrastate vehicles and vehicles must be marked with company name and USDOT number.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Motor Carrier of Property Certificate of Registration (Minn. Stat. 221.0251)",
      agency: "Minnesota Department of Transportation, Office of Freight and Commercial Vehicle Operations",
      url: "https://www.dot.state.mn.us/cvo/applications/propertyapplication.pdf",
      fee: "$0 (application form: 'NEW APPLICATION (No Fee)')",
      insurance: "$100,000/$300,000 public liability and $50,000 property damage, certified by the insurer on a Form E to MnDOT",
      note: "Intrastate for-hire property carriers register with MnDOT; workers' compensation compliance is required and carriers must complete the Initial Motor Carrier Contact (IMCC) education within 90 days of the certificate.",
    },
    ucr: {
      participates: true,
      note: "MnDOT CVO hosts the UCR registration page (dot.state.mn.us/cvo/do-i-need-to-register.html).",
    },
    oversize: {
      agency: "Minnesota Department of Transportation - Oversize/Overweight Permits (online ordering)",
      url: "http://www.dot.state.mn.us/cvo/oversize/",
    },
    extras: [
      {
        name: "Initial Motor Carrier Contact (IMCC) education",
        url: "https://dot.state.mn.us/cvo/mntruckbook/2022/section-06.pdf",
        note: "New intrastate carriers must complete the IMCC education requirement within 90 days of being issued a certificate of registration.",
      },
      {
        name: "Minnesota Commercial Vehicle Resource Book 2026",
        url: "https://www.dot.state.mn.us/cvo/mntruckbook/index.html",
        note: "MnDOT's free annual guide to Minnesota trucking rules (PDF download or mailed hard copy).",
      },
    ],
    enforcement: {
      agency: "Minnesota State Patrol, Commercial Vehicle Section",
      url: "https://dps.mn.gov/divisions/msp/commercial-vehicles",
    },
    near: [
      "wisconsin",
      "iowa",
      "north-dakota",
    ],
  },
  {
    slug: "mississippi",
    name: "Mississippi",
    abbr: "MS",
    irp: {
      agency: "Mississippi Department of Revenue - IRP Section (Interstate Commercial Vehicles)",
      url: "https://www.dor.ms.gov/business/interstate-commercial-vehicles",
      base: "Carrier must have an established place of business in Mississippi (a physical structure owned or leased, open and staffed during regular business hours), accrue Mississippi distance, and keep records available (per IRP manual).",
      note: "Apply and manage IRP accounts through TAP (tap.dor.ms.gov); a USDOT number, taxpayer ID and current MCS-150 are required; IRP office at 500 Clinton Center Dr, Clinton, MS (601-923-7142).",
    },
    ifta: {
      agency: "Mississippi Department of Revenue - IFTA/IRP (Interstate Commercial Vehicles)",
      url: "https://www.dor.ms.gov/business/interstate-commercial-vehicles",
      same: true,
    },
    usdot: {
      rule: "not-required",
      note: "Mississippi is not on FMCSA's list of states requiring USDOT numbers for intrastate carriers. Note that MDOT's intrastate authority application has a USDOT number field and MDOT's permit manual requires a valid federal DOT number for OS/OW permits.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Mississippi Intrastate General Freight Operating Authority",
      agency: "Mississippi Department of Transportation, Motor Carrier Section (Permit and Motor Carrier Division)",
      url: "https://mdot.ms.gov/documents/Enforcement/Regulations/General%20Freight%20Application.pdf",
      fee: "$50 registration for new carriers plus $10 per vehicle; fees waived for carriers that participate in UCR",
      insurance: "$750,000 liability for non-hazardous property (higher for hazmat); cargo insurance $5,000 (loads of 3 tons or under) or $10,000 (over 3 tons)",
      note: "MDOT's Motor Carrier Section issues Intrastate General Freight Operating Authority to carriers hauling for hire inside Mississippi. The application goes to MDOT Motor Carrier Section/66-05, P.O. Box 1850, Jackson, MS 39215-1850, with proof of liability and cargo insurance on file.",
    },
    ucr: {
      participates: true,
      note: "MDOT waives intrastate authority fees for UCR participants.",
    },
    oversize: {
      agency: "Mississippi Department of Transportation, Permit and Motor Carrier Division (ExpressPass at permits.mdot.ms.gov)",
      url: "https://mdot.ms.gov/documents/Enforcement/Permits/Permits%20Manual%2009.21.24.pdf",
    },
    extras: [],
    enforcement: {
      agency: "Mississippi Department of Public Safety (roadside) and the MDOT Office of Enforcement (permits and weights)",
      url: "https://mdot.ms.gov/documents/Enforcement/Permits/Permits%20Manual%2009.21.24.pdf",
    },
    near: [
      "alabama",
      "louisiana",
      "tennessee",
    ],
  },
  {
    slug: "missouri",
    name: "Missouri",
    abbr: "MO",
    irp: {
      agency: "Missouri Department of Transportation, Motor Carrier Services (MCS)",
      url: "https://www.modot.org/irp",
      note: "All transactions through MoDOT Carrier Express (MCE); staggered renewal periods; late renewal filing penalty $100, late payment $50 per power unit up to $150; requires Secretary of State documents, title/lease, Form 2290 over 55,000 lbs, personal property tax receipt.",
    },
    ifta: {
      agency: "Missouri Department of Transportation, Motor Carrier Services (MCS)",
      url: "https://www.modot.org/international-fuel-tax-agreement",
      same: true,
      fee: "$0 (MCS FAQ: 'Missouri does not charge for an IFTA license or decals')",
      note: "Apply and file through MoDOT Carrier Express (modot.org/mce); license and decals valid Jan 1 - Dec 31. The no-fee statement comes from the MCS FAQ document dated 2016.",
    },
    usdot: {
      rule: "required",
      note: "MoDOT: 'To obtain intrastate operating authority, you must obtain a USDOT number'; Missouri is on FMCSA's list of states requiring USDOT numbers for intrastate carriers.",
      url: "https://www.modot.org/MOPA",
    },
    intra: {
      status: "required",
      what: "Missouri Operating Authority (intrastate) - Form MO-1 via MoDOT Carrier Express",
      agency: "Missouri Department of Transportation, Motor Carrier Services",
      url: "https://www.modot.org/MOPA",
      fee: "$10 per power unit annual license fee only if the carrier is not required to participate in UCR; renewal decals $10 each",
      insurance: "$100,000 per person / $300,000 per accident / $50,000 property damage for non-hazardous property (per MCS FAQ)",
      note: "All for-hire carriers of property or passengers wholly within Missouri must apply for authority; needs a USDOT number, online MCE application, and insurance filed by the insurer; exemptions listed in RSMo 390.030. Passenger and HHG applicants also file financial statements/tariffs.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Missouri Department of Transportation, Motor Carrier Services - OSOW permits (MoDOT Carrier Express)",
      url: "https://www.modot.org/OSOW",
    },
    extras: [
      {
        name: "MoDOT Carrier Express (MCE) account",
        url: "https://www.modot.org/UsingMCE",
        note: "IRP, IFTA, Missouri operating authority, OSOW permits and UCR all run through the MCE online portal; e-check $0.50, card 2% plus $0.25 per transaction.",
      },
    ],
    enforcement: {
      agency: "Missouri State Highway Patrol, Commercial Vehicle Enforcement Division",
    },
    near: [
      "illinois",
      "kansas",
      "arkansas",
    ],
  },
  {
    slug: "montana",
    name: "Montana",
    abbr: "MT",
    irp: {
      agency: "Montana Department of Transportation, Motor Carrier Services (MCS)",
      url: "https://www.mdt.mt.gov/business/mcs/licenses.aspx",
      base: "Carriers must show a permanent business location in Montana with permanent signage and posted hours (temporary/paper signs not accepted); resident accounts must re-prove residency every three years.",
      note: "IRP and IFTA are handled together by MDT MCS through the ePART online system (mdt.epart.celtic-host.com); new account checklist requires a USDOT number and FEIN. Fee schedule changed October 1, 2025.",
    },
    ifta: {
      agency: "Montana Department of Transportation (Motor Carrier Services / Fiscal Services)",
      url: "https://mdt.mt.gov/business/fueltax/ifta.aspx",
      same: true,
      note: "Apply with the MDT IFTA application form or through ePART; three proofs of Montana residency are required for a new account.",
    },
    usdot: {
      rule: "required",
      note: "Montana is on FMCSA's list of states that require intrastate registrants to obtain a USDOT number; MDT's new-account guide also says a USDOT number is mandatory.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Montana intrastate vehicle registration with MDT Motor Carrier Services (GVW fees) - no operating-authority certificate for general freight",
      agency: "Montana Department of Transportation, Motor Carrier Services",
      url: "https://www.mdt.mt.gov/business/mcs/licenses.aspx",
      note: "Montana does not certificate general freight haulers (the Public Service Commission only oversees household goods, garbage and passenger carriers). What a Montana-only truck does need is MDT Motor Carrier Services registration with the gross-vehicle-weight fees and a USDOT number.",
    },
    ucr: {
      participates: true,
      note: "MDT's new-account guide directs carriers to register and pay at ucr.gov.",
    },
    oversize: {
      agency: "Montana Department of Transportation, Motor Carrier Services (MT eTRIPS permit system)",
      url: "https://www.mdt.mt.gov/business/mcs/permits.aspx",
    },
    extras: [
      {
        name: "New account checklist (IFTA/IRP/UCR)",
        url: "https://www.mdt.mt.gov/other/webdata/external/mcs/NEW_ACCOUNT_INFORMATION_FOR_IFTA_IRP_AND_UCR.pdf",
        note: "Requires USDOT number, FEIN, three proofs of residency for IFTA, IRP Schedules A/C, and possible Secretary of State business registration.",
      },
    ],
    enforcement: {
      agency: "Montana Department of Transportation, Motor Carrier Services Division (with Montana Highway Patrol and FMCSA)",
      url: "https://www.mdt.mt.gov/business/mcs/safety-regs.aspx",
    },
    near: [
      "idaho",
      "wyoming",
      "north-dakota",
    ],
  },
  {
    slug: "nebraska",
    name: "Nebraska",
    abbr: "NE",
    irp: {
      agency: "Nebraska Department of Motor Vehicles, Motor Carrier Services Division",
      url: "https://dmv.nebraska.gov/mc/irp",
      note: "Apply through the Motor Carrier System (mcis.nebraska.gov/NEEnterprise); fees depend on type of operation, jurisdictional mileage and combined gross weight. Nebraska participates in PRISM. Office in Lincoln, 402-471-4435, appointments available.",
    },
    ifta: {
      agency: "Nebraska Department of Motor Vehicles, Motor Carrier Services Division",
      url: "https://dmv.nebraska.gov/mc/ifta",
      same: true,
      fee: "$10 for the first qualified vehicle and $1 for each additional vehicle",
      note: "Nebraska DMV has administered IFTA since 1990; one license plus a set of decals per vehicle, quarterly returns filed online.",
    },
    usdot: {
      rule: "required",
      note: "Nebraska is on FMCSA's list of states requiring a USDOT number for intrastate registrants; the Nebraska State Patrol Carrier Enforcement page also references USDOT numbers for intrastate operations.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Nebraska Public Service Commission, Transportation Department (passenger and household goods only)",
      url: "https://psc.nebraska.gov/transportation",
      note: "The Nebraska Public Service Commission's transportation authority covers passenger carriers, household goods movers and transportation network companies - not general freight - so a freight hauler working inside Nebraska needs no PSC authority.",
    },
    ucr: {
      participates: true,
      note: "Nebraska DMV UCR page: file at ucr.gov (national site); Nebraska accepts registrations from Nebraska, Missouri, Manitoba and Ontario based carriers.",
    },
    oversize: {
      agency: "Nebraska Department of Transportation, Permits Office (Automated Truck Permit System, ne.gotpermits.com)",
      url: "https://dot.nebraska.gov/business-center/permits/truck/",
    },
    extras: [
      {
        name: "Nebraska UCR fee bracket",
        url: "https://dmv.nebraska.gov/mc/ucr",
      },
      {
        name: "Motor Carrier System online services",
        url: "https://dmv.nebraska.gov/mc/motor-carrier-online-services",
        note: "IRP, IFTA, UCR, 72-hour fuel/prorate trip permits and OS/OW permits are all reached through the MCS portal.",
      },
    ],
    enforcement: {
      agency: "Nebraska State Patrol, Carrier Enforcement Division",
      url: "https://statepatrol.nebraska.gov/divisions/field-services/carrier-enforcement",
    },
    near: [
      "iowa",
      "kansas",
      "colorado",
    ],
  },
  {
    slug: "nevada",
    name: "Nevada",
    abbr: "NV",
    irp: {
      agency: "Nevada Department of Motor Vehicles, Motor Carrier Division",
      url: "https://dmv.nv.gov/mcoverview.htm",
      note: "The Motor Carrier Division handles registration for commercial vehicles 26,001 lbs and over; new carriers choose an interstate (IRP/IFTA) or intrastate (Nevada-only) registration path. Quarterly IFTA and account services are through the Motor Carrier Connect (MCC) portal.",
    },
    ifta: {
      agency: "Nevada Department of Motor Vehicles, Motor Carrier Division",
      url: "https://dmv.nv.gov/mcexisting.htm",
      same: true,
      note: "Quarterly IFTA returns are filed through the Motor Carrier Connect portal (nv.motorcarrierconnect.com); records must be kept 4 years.",
    },
    usdot: {
      rule: "required",
      note: "The DMV new-carrier guide says a USDOT number is required for vehicles 26,001 lbs and over even when operating only in Nevada; Nevada is also on FMCSA's list.",
      url: "https://dmv.nv.gov/mcnew.htm",
    },
    intra: {
      status: "required",
      what: "Nevada-only commercial registration through the DMV Motor Carrier Division (the Transportation Authority certificate is only for passenger, household goods and tow carriers)",
      agency: "Nevada Department of Motor Vehicles, Motor Carrier Division",
      url: "https://dmv.nv.gov/mcnew.htm",
      note: "Per the DMV's new-carrier guide, operating authority for passenger and household goods carriers comes from the Nevada Transportation Authority, while general freight is handled by the DMV: a Nevada-only truck of 26,001 lbs or more registers with the Motor Carrier Division on the intrastate path and holds a USDOT number. New businesses register through SilverFlume first.",
    },
    ucr: {
      participates: false,
    },
    oversize: {
      agency: "Nevada Department of Transportation, Over-Dimensional Vehicle Permits (Carson City office / ODV online system)",
      url: "https://www.dot.nv.gov/doing-business/commercial-vehicles/commercial-vehicle-permits",
    },
    extras: [
      {
        name: "Nevada Transportation Authority certificate (passenger/HHG/tow only)",
        url: "https://nta.nv.gov/",
      },
      {
        name: "Nevada trip and fuel permits",
        url: "https://dmv.nv.gov/mcpermits.htm",
        note: "Vehicles not registered/licensed for Nevada need a trip permit ($5.00 + $0.15 per mile) and, at 26,001 lbs and over, a fuel permit ($30.00 flat) before entering the state.",
      },
    ],
    enforcement: {
      agency: "Nevada State Police Highway Patrol, Commercial Enforcement (Motor Carrier Enforcement / Motor Carrier Safety)",
      url: "https://nhp.nv.gov/Commercial/Enforcement/",
    },
    near: [
      "california",
      "arizona",
      "utah",
    ],
  },
  {
    slug: "new-hampshire",
    name: "New Hampshire",
    abbr: "NH",
    irp: {
      agency: "New Hampshire Department of Safety, Division of Motor Vehicles",
      url: "https://www.dmv.nh.gov/vehicles-boats-or-titles/vehicle-registrations/international-registration-plan-apportioned-plates",
      base: "Applicant must select a base jurisdiction where it has an established place of business or can show residence with at least three supporting documents.",
      note: "IRP FAQ says fees are computed from the percentage of miles in each jurisdiction times that jurisdiction's fees; forms are obtained from DMV offices and no online application system is described. IRP phone (603) 227-4110.",
    },
    ifta: {
      agency: "New Hampshire Department of Safety, Division of Motor Vehicles",
      url: "https://www.dmv.nh.gov/",
      same: true,
      note: "IFTA licensing sits inside the same Department of Safety DMV that handles IRP; start from dmv.nh.gov.",
    },
    usdot: {
      rule: "not-required",
      note: "New Hampshire is not on FMCSA's list of states requiring USDOT numbers for intrastate registrants; the NH State Police Troop G FAQ frames the USDOT number as an interstate requirement. IRP FAQ: vehicles over 10,000 lbs must display a DOT number when traveling outside the base jurisdiction.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "New Hampshire Division of Motor Vehicles",
      url: "https://www.dmv.nh.gov/",
      note: "No New Hampshire agency issues an operating authority for hauling general freight inside the state; the DMV handles registration and the State Police handle safety. If you are unsure whether your particular service is regulated, ask Troop G's motor carrier unit.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "New Hampshire Department of Transportation, Oversize/Overweight Permit Office",
      url: "https://www.nhdotpermits.org/PermitSelectionWizard.aspx",
    },
    extras: [
      {
        name: "NH Overweight Certification",
        url: "https://www.dmv.nh.gov/vehicles-boats-or-titles/vehicle-registrations/overweight-certification",
        note: "A supplement to registration that must be carried in the vehicle to haul above RSA 266:18 limits; $105.00 base fee for power units plus a monthly surcharge of $3.20 to $22.80 depending on axle configuration.",
      },
      {
        name: "New Entrant safety audits by State Police",
        url: "https://www.nhsp.dos.nh.gov/our-services/troop-g/troop-g-motor-carrier-enforcement",
        note: "Troop G's New Entrant Team administers the federal New Entrant Safety Assurance Program audits in New Hampshire.",
      },
    ],
    enforcement: {
      agency: "New Hampshire State Police, Troop G (Motor Carrier Enforcement)",
      url: "https://www.nhsp.dos.nh.gov/our-services/troop-g/troop-g-motor-carrier-enforcement",
    },
    near: [
      "massachusetts",
      "maine",
      "vermont",
    ],
  },
  {
    slug: "new-jersey",
    name: "New Jersey",
    abbr: "NJ",
    irp: {
      agency: "New Jersey Motor Vehicle Commission, Motor Carrier Services",
      url: "https://www.nj.gov/mvc/business/irp.htm",
      base: "Proof of a New Jersey address is required when opening an account, renewing or changing address.",
      note: "Apply by mail (225 East State Street, Trenton), by email, or through the online Motor Carrier Services portal. The MVC asks for a certificate of insurance showing $1.5 million automobile liability before an apportioned vehicle goes on the road - well above the federal $750,000, so tell your agent before you quote.",
    },
    ifta: {
      agency: "New Jersey Motor Vehicle Commission, Motor Carrier Services",
      url: "https://www.nj.gov/mvc/business/ifta.htm",
      same: true,
      note: "Apply online through the MVC Motor Carrier Services system or by paper application; licenses/decals expire December 31 with a two-month grace period if renewed on time. Failing to file the Q4 return suspends both IFTA and IRP credentials.",
    },
    usdot: {
      rule: "required",
      note: "NJ State Police FMCSR adoption page: 'Interstate and Intrastate carriers are now required to register with the FMCSA and obtain a USDOT#'; New Jersey is also on FMCSA's list.",
      url: "https://www.nj.gov/njsp/nj-fmcsr-adoption/changes-new-requirements.shtml",
    },
    intra: {
      status: "none",
      agency: "New Jersey Motor Vehicle Commission, Motor Carrier Services",
      url: "https://www.nj.gov/mvc/business/irp.htm",
      note: "New Jersey has no state operating authority for general freight. In-state-only trucks still register with the MVC, get a USDOT number, and follow the state-adopted federal safety rules (N.J.A.C. 13:60), including the marking rules below.",
    },
    ucr: {
      participates: false,
    },
    oversize: {
      agency: "New Jersey Department of Transportation (SUPERLOAD online permitting, issued on behalf of NJMVC)",
      url: "https://www.nj.gov/transportation/freight/trucking/oversize.shtm",
    },
    extras: [
      {
        name: "NJ vehicle marking rules (N.J.A.C. 13:60)",
        url: "https://www.nj.gov/njsp/nj-fmcsr-adoption/changes-new-requirements.shtml",
        note: "All CMVs (interstate and intrastate) must show USDOT number and legal name on both sides, the municipality of the principal place of business in 3-inch letters, and the GVWR if GVWR/GCWR/registered weight exceeds 26,000 lbs.",
      },
    ],
    enforcement: {
      agency: "New Jersey State Police, Commercial Carrier Safety Inspection Unit",
      url: "https://www.nj.gov/njsp/division/homeland-security/Commercial_carrier_safety_Inspection_unit.shtml",
    },
    near: [
      "new-york",
      "pennsylvania",
      "delaware",
    ],
  },
  {
    slug: "new-mexico",
    name: "New Mexico",
    abbr: "NM",
    irp: {
      agency: "New Mexico Taxation and Revenue Department, Motor Vehicle Division - Commercial Vehicle Bureau",
      url: "https://www.mvd.newmexico.gov/commercial/commercial-vehicles/international-registration-plan-irp/",
      base: "Interstate carriers file with the state where they are based.",
      note: "Commercial Vehicle Bureau, 2546 Camino Entrada, Santa Fe; 1-888-683-4636 prompt 6.",
    },
    ifta: {
      agency: "New Mexico Taxation and Revenue Department, Motor Vehicle Division - Commercial Vehicle Bureau",
      url: "https://www.mvd.newmexico.gov/commercial/commercial-vehicles/fuels-tax/",
      same: true,
    },
    usdot: {
      rule: "not-required",
      note: "New Mexico is not on FMCSA's list of states that require a USDOT number for in-state-only trucks, and the MVD lists the USDOT number only among the interstate steps.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "New Mexico intrastate operating authority - a 'warrant' for transportation of property (18.3.2 NMAC)",
      agency: "New Mexico Department of Transportation, Transportation Regulation Bureau",
      url: "https://www.dot.nm.gov/trb/faqs/",
      fee: "$50 warrant application (18.3.5.7 NMAC)",
      insurance: "The federal minimums of 49 CFR 387.9 - $750,000 for general freight in trucks of 10,001 lbs or more (18.3.3.10 NMAC); your insurer files with TRB.InsFiling@dot.nm.gov",
      note: "Hauling other people's property for hire between points inside New Mexico takes a warrant from the Transportation Regulation Bureau, which now lives at NMDOT rather than the Public Regulation Commission (Senate Bill 160 moved it on July 1, 2024 - older pages still say PRC). Passenger service takes a certificate instead; household goods have their own rules. You also title the truck in New Mexico and register each vehicle for the Weight Distance Tax e-permit.",
    },
    wd: {
      name: "Weight Distance Tax",
      threshold: "declared gross weight or GVW over 26,000 lbs",
      url: "https://www.tax.newmexico.gov/businesses/weight-distance-tax/",
      note: "Administered by NM Taxation and Revenue Department; register annually for a Weight Distance Tax Electronic Permit per vehicle and file quarterly (April 30, July 31, October 31, January 31). Rate (mill rate) depends on weight and one-way vs two-way hauling.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "New Mexico Department of Public Safety (NM State Police Commercial Vehicle Enforcement / Motor Transportation Police)",
      url: "https://www.mvd.newmexico.gov/how-do-i-get-an-oversize-overweight-permit/",
    },
    extras: [
      {
        name: "Ports of entry stop requirement",
        url: "https://www.mvd.newmexico.gov/commercial/commercial-vehicles/ports-of-entry-information/",
        note: "Commercial vehicles (intrastate at 26,001+ lbs GVWR, interstate at 10,001+) must stop at every operating port of entry; ports issue trip permits, oversize permits and IFTA fuel permits.",
      },
      {
        name: "Intrastate ELD rule",
        url: "https://www.dps.nm.gov/nmsp/commercial-vehicle-enforcement/",
        note: "Intrastate operations must comply with ELD rules; the NM intrastate short-haul radius is 150 air miles.",
      },
    ],
    enforcement: {
      agency: "New Mexico State Police, Commercial Vehicle Enforcement (lead MCSAP agency)",
      url: "https://www.dps.nm.gov/nmsp/commercial-vehicle-enforcement/",
    },
    near: [
      "texas",
      "arizona",
      "colorado",
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    abbr: "NY",
    irp: {
      agency: "New York State Department of Motor Vehicles, International Registration Bureau (IRB)",
      url: "https://dmv.ny.gov/business/apply-for-the-international-registration-plan-irp",
      note: "Apply by mail to the IRB in Albany or online through OSCAR (One Stop Credentialing and Registration); the IRB public counter is closed. Replacement plates with cab card $27.50.",
    },
    ifta: {
      agency: "New York State Department of Taxation and Finance",
      url: "https://tax.ny.gov/bus/ifta/fuel.htm",
      same: false,
      fee: "$0 license; $8 per set of two decals",
      note: "Apply with Form IFTA-21 or through OSCAR (oscar.ny.gov); license valid January 1 - December 31. Publication 536 is the IFTA guide.",
    },
    usdot: {
      rule: "required",
      note: "New York is on FMCSA's list of states requiring a USDOT number for intrastate registrants.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "NYSDOT operating authority - a certificate (common carrier) or permit (contract carrier) for hauling property for hire inside New York",
      agency: "New York State Department of Transportation",
      url: "https://www.nysenate.gov/legislation/laws/TRA/172",
      note: "New York Transportation Law section 172 says no one may carry property for hire between points inside the state without a certificate or permit from NYSDOT - this is separate from, and in addition to, any federal authority. NYSDOT runs it through its Motor Carrier Compliance Bureau; ask them for the current application fee and insurance filing amounts before you apply.",
    },
    wd: {
      name: "Highway Use Tax (HUT)",
      threshold: "gross weight over 18,000 lbs",
      url: "https://www.tax.ny.gov/bus/hut/huidx.htm",
      note: "A HUT certificate of registration and decal is required for each truck/tractor over 18,000 lbs before operating on NY public highways; tax is based on NY miles and vehicle weight, filed through OSCAR/Web File. Administered by NYS Department of Taxation and Finance.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "New York State Department of Transportation, Central Permit Office (NYPERMITS)",
    },
    extras: [
      {
        name: "OSCAR one-stop credentialing",
        url: "https://tax.ny.gov/bus/ifta/fuel.htm",
        note: "OSCAR (oscar.ny.gov) is the shared online portal for HUT, IFTA and IRP applications and renewals - one login for all three.",
      },
      {
        name: "HUT certificate and decal",
        url: "https://www.tax.ny.gov/bus/hut/huidx.htm",
        note: "Even trucks that never leave New York need a HUT certificate of registration and decal above 18,000 lbs, and must file HUT returns even when no tax is due.",
      },
    ],
    enforcement: {
      agency: "New York State Police, Commercial Vehicle Enforcement Unit (with NYSDOT)",
      url: "https://troopers.ny.gov/commercial-vehicles",
    },
    near: [
      "new-jersey",
      "pennsylvania",
      "connecticut",
    ],
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbr: "NC",
    irp: {
      agency: "North Carolina Division of Motor Vehicles, IRP (Commercial Trucking) - Raleigh and Charlotte offices",
      url: "https://www.ncdot.gov/dmv/title-registration/commercial-trucking/Pages/default.aspx",
      base: "Register where you have an established place of business and where mileage is accrued; new accounts need three NC documents proving residency or an established place of business owned/leased at least 12 months, with signage, posted hours and staffing at least 20 hours per week.",
      note: "New account checklist requires an active interstate USDOT number in the account name (or a lease to a carrier with one), titles, Form 2290 for 55,000+ lbs and proof of insurance. Renewals through TRANSEXPRESS. Raleigh (919) 615-6700.",
    },
    ifta: {
      agency: "North Carolina Department of Revenue, Excise Tax Division (Motor Carrier Tax IFTA/Intrastate)",
      url: "https://www.ncdor.gov/taxes-forms/motor-carrier-tax",
      same: false,
      note: "IFTA is at NCDOR, not NCDMV. Apply with form GAS-1274; file and order credentials through the IFTA/Intrastate eFile system (bank draft free; $2 per $100 for card payments). No license/decal fee shown.",
    },
    usdot: {
      rule: "required",
      note: "North Carolina is on FMCSA's list.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "North Carolina Utilities Commission (household goods and passengers only)",
      url: "https://www.ncuc.gov/Industries/transportation/transportation.html",
      insurance: "$750,000 liability for intrastate motor carriers, per the State Highway Patrol",
      note: "North Carolina's Utilities Commission only certificates household goods movers, bus companies and passenger brokers - state law (G.S. 62-3) defines a motor common carrier as one carrying people or household goods, so there is no state operating authority to apply for if you haul general freight inside the state. What the state does expect is the USDOT number, North Carolina Intrastate fuel decals from NCDOR if you never leave the state, and liability insurance of at least $750,000.",
    },
    ucr: {
      participates: true,
      note: "NCDMV commercial trucking page recommends registering through the national UCR site.",
    },
    oversize: {
      agency: "North Carolina Department of Transportation, Oversize/Overweight Permit Unit (PIMS online system)",
      url: "https://connect.ncdot.gov/business/trucking/pages/overpermits.aspx",
    },
    extras: [
      {
        name: "NC Intrastate (IN) fuel tax credentials",
        url: "https://www.ncdor.gov/file-pay/motor-carrier-iftaintrastate-efile",
        note: "Qualified motor vehicles (2 axles over 26,000 lbs, or 3+ axles) operating only in North Carolina must obtain NC Intrastate license and decals from NCDOR instead of IFTA (form GAS-1274/1274A).",
      },
    ],
    enforcement: {
      agency: "North Carolina State Highway Patrol, Motor Carrier Enforcement Administration Section",
      url: "https://www.ncshp.gov/ncshp/commercial-motor-vehicle-enforcement",
    },
    near: [
      "south-carolina",
      "virginia",
      "tennessee",
    ],
  },
  {
    slug: "north-dakota",
    name: "North Dakota",
    abbr: "ND",
    irp: {
      agency: "North Dakota Department of Transportation, Motor Vehicle Division - Prorate Section (Motor Carrier Services)",
      url: "https://www.dot.nd.gov/motor-vehicle/international-registration-plans-ifta-irp-and-ucr",
      base: "Three proofs of residency showing the same North Dakota street address (no PO boxes).",
      note: "Call 701-328-1287 for the new account packet, then make an appointment; account management through IRP/IFTA Online Access (apps.nd.gov/dot/cvisn). USDOT number required 'if over 10,000 pounds and crossing state lines'.",
    },
    ifta: {
      agency: "North Dakota Department of Transportation, Motor Vehicle Division - Prorate Section",
      url: "https://www.dot.nd.gov/motor-vehicle/international-registration-plans-ifta-irp-and-ucr",
      same: true,
      note: "Same NDDOT page and office as IRP; duplicate decals $3-$4, other fees are in the IFTA manual PDF. 3% of IRP/IFTA carriers are audited each year.",
    },
    usdot: {
      rule: "not-required",
      note: "North Dakota is not on FMCSA's list; NDDOT's IRP/IFTA page says a USDOT number is needed if over 10,000 lbs and crossing state lines, and NDHP says the state does not issue separate intrastate rules.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "North Dakota Department of Transportation, Motor Carrier Services",
      url: "https://www.dot.nd.gov/motor-vehicle/motor-carrier-services",
      note: "North Dakota has no separate state operating authority for general freight, and the Highway Patrol says the state does not issue separate intrastate safety rules. An in-state-only truck registers with NDDOT and follows the size and weight rules.",
    },
    ucr: {
      participates: true,
      note: "NDDOT's IFTA/IRP/UCR page links to ucr.gov for registration.",
    },
    oversize: {
      agency: "North Dakota Highway Patrol, Permit Office (NDHP e-permits)",
      url: "https://www.statepatrol.nd.gov/e-permits",
    },
    extras: [
      {
        name: "Unladen permit",
        url: "https://www.dot.nd.gov/motor-vehicle/motor-carrier-services",
        note: "Unladen (hunter) permits are $30 and valid up to 14 days.",
      },
    ],
    enforcement: {
      agency: "North Dakota Highway Patrol, Motor Carrier Operations (MCSAP, new entrant, size and weight)",
      url: "https://www.statepatrol.nd.gov/motor-carrier-operations",
    },
    near: [
      "minnesota",
      "south-dakota",
      "montana",
    ],
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbr: "OH",
    irp: {
      agency: "Ohio Bureau of Motor Vehicles (Department of Public Safety), IRP Unit",
      url: "https://www.bmv.ohio.gov/vr-irp-geninfo.aspx",
      note: "New accounts use the BMV 4890 packet (mail, fax or email only - not at deputy registrars) and base jurisdiction form BMV 4856; renewals and supplements through Ohio Commercial Registration Online System (OHCORS). Page says an 80,000 lb vehicle averages $1,600-$2,400 for a full-year plate; USDOT number/MCS-150 required before registration.",
    },
    ifta: {
      agency: "Ohio Department of Taxation",
      url: "https://tax.ohio.gov/business/international-fuel-tax-agreement",
      same: false,
      note: "Register through OH|TAX eServices (myportal.tax.ohio.gov); decals required annually for qualified vehicles that cross state lines. No license or decal fee stated.",
    },
    usdot: {
      rule: "required",
      note: "Ohio is on FMCSA's list; the BMV IRP page also says all commercial vehicles need a USDOT number before registration is issued.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "PUCO For-Hire Intrastate Motor Carrier Registration (the Ohio certificate of public convenience and necessity)",
      agency: "Public Utilities Commission of Ohio, Transportation Department",
      url: "https://puco.ohio.gov/wps/portal/gov/puco/transportation/trucking",
      fee: "$30 a year per tractor (or truck pulling a trailer) and $20 a year per straight truck, renewed May 1 to June 30 (Ohio Revised Code 4921.19)",
      insurance: "$750,000 liability for for-hire property carriers; $300,000 for property vehicles under 10,001 lbs; higher for hazmat - filed with PUCO before you operate (Ohio Administrative Code 4901:2-13-03)",
      note: "Ohio Revised Code 4921.03 says no for-hire motor carrier may operate in intrastate commerce without a current certificate from PUCO, and that includes general freight. You register through PUCO's online Motor Carrier Registration system; your insurer files the proof of insurance with PUCO first.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Ohio Department of Transportation, Special Hauling Permits Office (Ohio Hauling Permit System, OHPS)",
      url: "https://www.transportation.ohio.gov/business/publications/operational-guide-special-hauling",
    },
    extras: [
      {
        name: "Ohio Hauling Permit System (OHPS)",
        url: "https://haulingpermits.transportation.ohio.gov/",
        note: "Oversize/overweight permits are ordered through OHPS; office phone 614-351-2300.",
      },
    ],
    enforcement: {
      agency: "Ohio State Highway Patrol (roadside) and the PUCO Transportation Department (compliance reviews)",
      url: "https://puco.ohio.gov/wps/portal/gov/puco/transportation/trucking/resources/motor-carrier-compliance-reviews",
    },
    near: [
      "pennsylvania",
      "indiana",
      "michigan",
    ],
  },
  {
    slug: "oklahoma",
    name: "Oklahoma",
    abbr: "OK",
    irp: {
      agency: "Oklahoma Corporation Commission, Transportation Division",
      url: "https://oklahoma.gov/occ/divisions/transportation/trucking/occ-transportation-division-irp.html",
      base: "Use the state where you have an established place of business, accrue mileage and can make operational records available; if none, use your state of residence.",
      note: "Apply through the online IFTA/IRP system (apps.occ.ok.gov/IRPIFTA) or paper Schedules A/B; some motor license (tag) agents also process IRP. Page says an average new 80,000 lb apportioned plate for all jurisdictions is $1,600-$1,800.",
    },
    ifta: {
      agency: "Oklahoma Corporation Commission, Transportation Division",
      url: "https://oklahoma.gov/occ/divisions/transportation/trucking/occ-transportation-division-ifta.html",
      same: true,
      fee: "$2 per pair of decals (no separate posted license fee)",
      note: "Same OCC online IFTA/IRP system as IRP; renewals annually with new decals.",
    },
    usdot: {
      rule: "required",
      note: "OCC: 'Intrastate for-hire motor carriers and intrastate private carriers must obtain and display a USDOT number.' Oklahoma is also on FMCSA's list.",
      url: "https://oklahoma.gov/occ/divisions/transportation/trucking/occ-transportation-division-usdot-numbers.html",
    },
    intra: {
      status: "required",
      what: "Oklahoma Intrastate For-Hire Motor Carrier License (OCC)",
      agency: "Oklahoma Corporation Commission, Transportation Division",
      url: "https://oklahoma.gov/occ/divisions/transportation/trucking/intrastate-licenses-for-hire-motor-carriers.html",
      fee: "$100 initial license (one year); $7.00 per vehicle identification stamp",
      insurance: "Limits depend on carrier type and are set in OCC rules; your insurer files the proof",
      note: "Required for carriers transporting passengers or property for hire within Oklahoma (household goods carriers need a separate HHG certificate).",
    },
    ucr: {
      participates: true,
      note: "OCC Transportation Division handles UCR in Oklahoma.",
    },
    oversize: {
      agency: "Oklahoma Department of Transportation, Size and Weight Permits Division (OkiePROS online system)",
      url: "https://oklahoma.gov/odot/about-us/laws-and-rules/size-and-weight-permits.html",
    },
    extras: [
      {
        name: "OCC weigh station and weight enforcement",
        url: "https://oklahoma.gov/occ/divisions/transportation/trucking/motor-carrier-and-motor-vehicle-enforcement.html",
        note: "OCC officers operate fixed weigh stations and audit carriers and shippers for weight and registration compliance, separate from OHP Troop S safety enforcement.",
      },
    ],
    enforcement: {
      agency: "Oklahoma Corporation Commission Motor Carrier/Vehicle Enforcement Section (weight/registration) and Oklahoma Highway Patrol Troop S (commercial vehicle and federal safety regulations)",
      url: "https://oklahoma.gov/dps/programs-services/troop-s/programs-services/size-weight.html",
    },
    near: [
      "texas",
      "kansas",
      "arkansas",
    ],
  },
  {
    slug: "oregon",
    name: "Oregon",
    abbr: "OR",
    irp: {
      agency: "Oregon Department of Transportation, Commerce and Compliance Division (CCD)",
      url: "https://www.oregon.gov/odot/MCT/Pages/Oregon-IRP-Registration.aspx",
      base: "Must be based in Oregon with a physical Oregon address; the requirements page adds a street address, open business hours and employees/records on site.",
      note: "Apply with Schedule A (combined IRP/IFTA), B and C forms; must be registered with FMCSA and submit Form 2290 proof within 60 days. Accounts are managed in Oregon Trucking Online (TOL).",
    },
    ifta: {
      agency: "Oregon Department of Transportation, Commerce and Compliance Division (CCD)",
      url: "https://www.oregon.gov/odot/MCT/Pages/Interstate-Operations-IFTA.aspx",
      same: true,
      note: "Oregon's own heavy-vehicle road charge is the weight-mile tax, so IFTA licensees must file an Oregon mileage tax report in addition to the quarterly IFTA return, and can buy fuel in Oregon tax-free once enrolled in the weight-mile program.",
    },
    usdot: {
      rule: "required",
      note: "Oregon is on FMCSA's list; ODOT's own requirements page states the 10,000 lb USDOT rule for interstate carriers.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "ODOT motor carrier account (Oregon commercial registration above 26,000 lbs plus Weight-Mile Tax enrollment)",
      agency: "Oregon Department of Transportation, Commerce and Compliance Division",
      url: "https://www.oregon.gov/odot/MCT/Pages/Oregon-Motor-Carrier-Requirements.aspx",
      note: "Any carrier running trucks over 26,000 lbs combined weight in Oregon, for hire or private, opens an account with ODOT's Commerce and Compliance Division. Oregon-based power units over 26,000 lbs are registered through CCD at their heaviest loaded weight, Oregon insurance requirements and a highway-use bond apply, and every mile is reported under the weight-mile tax.",
    },
    wd: {
      name: "Weight-Mile Tax",
      threshold: "combined/registered weight over 26,000 lbs (26,001-80,000 lbs Table A; 80,001-105,500 lbs Table B)",
      url: "https://www.oregon.gov/odot/MCT/Pages/Weight-Mile-Tax-Program-Enrollment.aspx",
      note: "Enroll through Oregon Trucking Online after opening a CCD account; reports are monthly by default (quarterly with approval), rates by declared weight. Fuel bought in Oregon is tax-free for enrolled carriers. ODOT notes the structure will be simplified effective July 1, 2027 under HB 3991.",
    },
    ucr: {
      participates: false,
    },
    oversize: {
      agency: "Oregon Department of Transportation, Commerce and Compliance Division - Over-Dimension Permits (ORION online system)",
      url: "https://www.oregon.gov/odot/MCT/Pages/Over-Dimension-Operations-Oregon.aspx",
    },
    extras: [
      {
        name: "UCR through another state",
        url: "https://www.oregon.gov/ODOT/MCT/Pages/UCRAgreement.aspx",
        note: "Oregon does not participate in UCR; interstate carriers based in Oregon must register and pay to a chosen participating base state.",
      },
      {
        name: "Oregon Trucking Online (TOL)",
        url: "https://www.oregon.gov/odot/MCT/Pages/Online-Services.aspx",
        note: "Single portal for registration, weight-mile tax filing, IRP/IFTA and permit links; ORION handles over-dimension permits.",
      },
    ],
    enforcement: {
      agency: "Oregon Department of Transportation, Commerce and Compliance Division (commercial vehicle safety and enforcement)",
      url: "https://www.oregon.gov/odot/MCT/Pages/Commercial-Vehicle-Safety-Enforcement.aspx",
    },
    near: [
      "washington",
      "california",
      "idaho",
    ],
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbr: "PA",
    irp: {
      agency: "Pennsylvania Department of Transportation (PennDOT), Driver and Vehicle Services - Apportioned Registration",
      url: "https://www.pa.gov/agencies/dmv/vehicle-services/title-and-registration/apportioned-registration-program",
      base: "Account holder must be a Pennsylvania resident or have an established place of business in Pennsylvania (or be leased to a carrier that does); PO boxes are not accepted, and three identification documents with matching address are required.",
      note: "Applications (MV-550/550A/551) are mailed; payment by certified check, money order or wire. Apportioned registrations expire May 31; fees are based on actual distance in the July 1 - June 30 reporting period. USDOT number required for apportioned registrants.",
    },
    ifta: {
      agency: "Pennsylvania Department of Revenue (Motor Carriers Road Tax / IFTA)",
      url: "https://www.pa.gov/agencies/revenue/resources/tax-types-and-information/motor-and-alternative-fuel-taxes/motor-carriers-road-tax",
      same: false,
      fee: "$12 per vehicle per calendar year (decal)",
      note: "Department of Revenue issues IFTA credentials for interstate carriers and Motor Carriers Road Tax (MCRT) decals for qualified vehicles operating only intrastate; credit is given for tax paid on fuel purchases.",
    },
    usdot: {
      rule: "required",
      note: "PennDOT FAQ: intrastate vehicles must also display USDOT numbers per 67 Pa. Code Chapter 231; Pennsylvania is also on FMCSA's list.",
      url: "https://www.pa.gov/agencies/dmv/faqs/motor-vehicle-faqs/apportioned-registration-faqs",
    },
    intra: {
      status: "required",
      what: "PA PUC motor carrier authority (Motor Common Carrier of Property certificate / PUC number)",
      agency: "Pennsylvania Public Utility Commission",
      url: "https://www.puc.pa.gov/media/3066/motor_carrier_faq062524.pdf",
      fee: "$100 application fee for property (truck) authority; no recurring license fee, but annual PUC assessment on non-exempt revenue",
      insurance: "$750,000 bodily injury/property damage per accident for vehicles over 10,000 lbs GVWR ($300,000 at 10,000 lbs or less); $5,000 cargo; filed by insurer on Forms E and H",
      note: "Needed for any for-hire transportation with both origin and destination in Pennsylvania; a USDOT or MC number does not authorize intrastate business. Property carriers are regulated for safety and insurance only. Operating without authority carries a $1,000 fine per violation.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Pennsylvania Department of Transportation, Central Permit Office / district offices (APRAS online system)",
      url: "https://www.pa.gov/services/penndot/apply-for-a-penndot-hauling-permit",
    },
    extras: [
      {
        name: "Motor Carriers Road Tax (MCRT) decal for intrastate-only trucks",
        url: "https://www.pa.gov/agencies/revenue/resources/tax-types-and-information/motor-and-alternative-fuel-taxes/motor-carriers-road-tax",
        note: "Qualified vehicles that never leave Pennsylvania still need an annual MCRT decal ($12 per vehicle) and are subject to fuel taxation under the road tax.",
      },
      {
        name: "PUC insurance filings (Form E / Form H)",
        url: "https://www.puc.pa.gov/motor-carrier/insurance/",
        note: "Insurer must electronically file binding proof within 60 days of application or the application is dismissed.",
      },
    ],
    enforcement: {
      agency: "Pennsylvania State Police, Commercial Vehicle Safety Division (MCSAP)",
      url: "https://www.pa.gov/agencies/psp/contact-psp/bureau-and-office-directory/psp-commercial-vehicle-safety-division",
    },
    near: [
      "ohio",
      "new-york",
      "new-jersey",
    ],
  },
  {
    slug: "rhode-island",
    name: "Rhode Island",
    abbr: "RI",
    irp: {
      agency: "Rhode Island Division of Motor Vehicles, IRP Office",
      url: "https://dmv.ri.gov/registrations-plates-titles/international-registration-plan-irp",
      base: "Carriers register in their home jurisdiction; RI requires three business-establishment documents plus a USDOT number and FEIN/SSN with the application.",
      note: "IRP Office is at 150 Midway Rd Ste 153, Cranston, RI 02920 (401-946-0090, RIIRP@mcarrier.com). A Vehicle (over 26,000 lbs) Weight and Axles Certification form is mandatory.",
    },
    ifta: {
      agency: "Rhode Island Division of Taxation, Excise Tax Section",
      url: "https://tax.ri.gov/tax-sections/sales-excise-taxes/international-fuel-tax-agreement-ifta",
      same: false,
      fee: "$0 (Division of Taxation excise page states the IFTA license renews annually with no fee)",
      note: "Apply with form IFTA-APP (IFTA-1); all IFTA filing must go through the RI Tax Portal (taxportal.ri.gov) since April 1, 2024. Renewals due December 1 each year. Contact Tax.Excise@tax.ri.gov / 401-574-8955.",
    },
    usdot: {
      rule: "not-required",
      note: "Rhode Island is not on FMCSA's list of states that require a USDOT number for intrastate commerce.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "RI Division of Public Utilities and Carriers (DPUC) Motor Carriers Division certificate for intrastate common carrier of property (R.I. Gen. Laws Chapter 39-12)",
      agency: "Rhode Island Division of Public Utilities and Carriers, Motor Carriers Division",
      url: "https://ripuc.ri.gov/utility-information/motor-carriers/responsibilities-and-jurisdiction-motor-carriers-division",
      fee: "$250 filing fee (check or money order only), plus $10 proof-of-insurance filing and $20 per vehicle registration, per the Property Carrier Application",
      insurance: "Proof of insurance filed with the Motor Carriers Division ($10 filing fee; the application does not print the liability minimum)",
      note: "The Division regulates all for-hire transportation companies operating within Rhode Island, including freight haulers. Applicants must show they are fit, willing and able, a public hearing is scheduled once a complete application is filed (notice published at least ten days ahead), and proof of insurance is filed with the Motor Carriers Division. Forms are on the Division's motor carrier forms page.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Rhode Island Department of Transportation, Oversize/Overweight (OS/OW) unit",
      url: "https://www.dot.ri.gov/travel/truckrestrictions.php",
    },
    extras: [
      {
        name: "Motor carrier forms (DPUC)",
        url: "https://ripuc.ri.gov/utility-information/motor-carriers/motor-carrier-forms",
        note: "The Property Carrier Application, insurance filing forms and the Release Waiver Form every applicant completes.",
      },
      {
        name: "RI Tax Portal e-filing for IFTA",
        url: "https://tax.ri.gov/tax-sections/sales-excise-taxes/international-fuel-tax-agreement-ifta",
        note: "All IFTA filers must use taxportal.ri.gov as of April 1, 2024; renewal applications are due by December 1.",
      },
      {
        name: "RIDOT OSOW online permit portal",
        url: "https://osowpermits.dot.ri.gov/",
        note: "Oversize/overweight permits and routing are issued through the RIDOT OSOW portal; OS/OW unit phone (401) 563-4582, DOT.OSOW@dot.ri.gov.",
      },
    ],
    enforcement: {
      agency: "Rhode Island State Police",
      url: "https://risp.ri.gov/",
    },
    near: [
      "massachusetts",
      "connecticut",
      "new-york",
    ],
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    abbr: "SC",
    irp: {
      agency: "South Carolina Department of Motor Vehicles, Motor Carrier Services (MCS)",
      url: "https://dmv.sc.gov/business-customers/motor-carriers/international-registration-plan",
      base: "Established place of business requires four proofs in the business name at a non-residential business location (SC Secretary of State articles, commercial lease or deed, Form 941, business tax return); residency alternative requires three proofs in the individual's name.",
      note: "MCS is at 10311 Wilson Boulevard, Building C, Blythewood, SC 29016 (PO Box 1498). New accounts are opened through the online Motor Carrier Services portal (scdmvonline.com) with a valid USDOT and EIN; allow five business days for review. Required: title, proof of liability insurance, MC-7 records agreement, Form 2290, Schedule A/E and B. Replacement cab card $1, replacement plate $6, late penalties $10-$75.",
    },
    ifta: {
      agency: "South Carolina Department of Motor Vehicles, Motor Carrier Services (MCS)",
      url: "https://dmv.sc.gov/business-customers/motor-carriers/international-fuel-tax-agreement",
      same: true,
      fee: "No charge for the IFTA decals",
      note: "Apply with form IFTA-1 by mail or through the MCS online portal; mail-in renewals must arrive by December 1 and tax returns must be current through Q3 to renew.",
    },
    usdot: {
      rule: "required",
      note: "South Carolina is on FMCSA's list of states requiring intrastate CMV registrants to obtain a USDOT number. SCDMV also requires a valid USDOT before opening an IRP/IFTA account.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "SCDMV Certificate of Compliance (COC) for intrastate for-hire motor carriers (Class E-L or Class E-LC)",
      agency: "South Carolina Department of Motor Vehicles, Motor Carrier Services",
      url: "https://dmv.sc.gov/business-customers/motor-carriers/certificate-of-compliance",
      fee: "Set by SCDMV (the Certificate of Compliance page does not list a dollar amount; ask Motor Carrier Services when you apply)",
      insurance: "Minimum liability ranges from $300,000 to $5,000,000 depending on GVWR and whether hazardous materials are hauled; Class E-LC requires cargo insurance, Class E-L (low-value commodities such as dump truck materials) does not",
      note: "A COC is issued to all intrastate for-hire motor carriers except passenger, household goods, and hazardous-waste-for-disposal carriers, which instead need a certificate from the SC Public Service Commission / Office of Regulatory Staff (Class E). Apply with SCDMV Form COC; the name must match exactly on insurance filings and Articles of Incorporation/Organization.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "South Carolina Department of Transportation, Oversize/Overweight (OSOW) Permit Office",
      url: "https://www.scdot.org/business/permits-osow.html",
    },
    extras: [
      {
        name: "SC ORS / PSC Class E certificate (household goods or hazardous waste)",
        url: "https://ors.sc.gov/consumers/transportation/ors-regulated-motor-carriers-south-carolina",
        note: "Only carriers of household goods or hazardous waste (Class E) and passenger carriers need a PSC certificate of public convenience and necessity through ORS; general freight is handled by the SCDMV COC instead.",
      },
      {
        name: "SCDMV Motor Carrier Portal new-account review",
        url: "https://dmv.sc.gov/business-customers/motor-carriers/trucking-communications",
        note: "New IRP/IFTA accounts require a valid USDOT and EIN plus four proofs of an established (non-residential) place of business or three proofs of residency; allow five business days for review before credentials are issued.",
      },
    ],
    enforcement: {
      agency: "South Carolina Department of Public Safety, State Transport Police",
      url: "https://scdps.sc.gov/stp",
    },
    near: [
      "north-carolina",
      "georgia",
      "tennessee",
    ],
  },
  {
    slug: "south-dakota",
    name: "South Dakota",
    abbr: "SD",
    irp: {
      agency: "South Dakota Department of Revenue, Motor Vehicle Division, Motor Carrier Section",
      url: "https://dor.sd.gov/businesses/motor-vehicle/motor-carrier-services/",
      base: "South Dakota is the base jurisdiction if vehicles are registered in SD, their use is controlled from a South Dakota location, and operational records are maintained or can be made available there.",
      note: "Described as a one-stop shop for IRP and IFTA for SD-based interstate carriers; online system is Motor Carrier Connect (MCC). IRP will not be renewed if the carrier's USDOT number is out of service. Contact (605) 773-3541 or sdmotorcarrier@state.sd.us.",
    },
    ifta: {
      agency: "South Dakota Department of Revenue, Motor Vehicle Division, Motor Carrier Section",
      url: "https://dor.sd.gov/businesses/motor-vehicle/motor-carrier-services/",
      same: true,
      fee: "$10 annual license; $2.50 per annual decal set",
      note: "Filed through Motor Carrier Connect / SD Interstate Online.",
    },
    usdot: {
      rule: "not-required",
      note: "South Dakota is not on FMCSA's list of states requiring a USDOT number for intrastate commerce. The sdtruckinfo FAQ describes the DOT number requirement only for carriers crossing state lines over 10,000 lbs and refers other cases to SDHP Motor Carrier Services (605-224-7364).",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "County Treasurer (title, registration and commercial plates)",
      url: "https://sdtruckinfo.sd.gov/intrastate-carriers/",
      note: "South Dakota's official trucking site sends in-state-only carriers to their county treasurer for title, registration and commercial plates and lists no state operating authority for hauling general freight. If you want it in writing, the Highway Patrol's Motor Carrier Services office (605-224-7364) is the one to ask.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "South Dakota Highway Patrol, Motor Carrier Services (Ports of Entry) - SDAPS permitting system",
      url: "https://sdtruckinfo.sd.gov/permits/",
    },
    extras: [
      {
        name: "sdtruckinfo.sd.gov one-stop trucking site",
        url: "https://sdtruckinfo.sd.gov/",
        note: "Official joint site of the Department of Revenue, DOT and Highway Patrol covering IRP, IFTA, UCR, intrastate plates, permits and CDL for South Dakota carriers.",
      },
    ],
    enforcement: {
      agency: "South Dakota Highway Patrol, Motor Carrier Services",
      url: "https://sdtruckinfo.sd.gov/contact-us/",
    },
    near: [
      "north-dakota",
      "nebraska",
      "minnesota",
    ],
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    abbr: "TN",
    irp: {
      agency: "Tennessee Department of Revenue, Vehicle Services Division (Motor Carrier)",
      url: "https://www.tn.gov/revenue/motor-carrier/international-registration-plan.html",
      note: "Apply online through TNTAP (Tennessee Taxpayer Access Point) or by mail with Schedule A (new) / Schedule B (renewal) and the New Account Checklist; stamped Form 2290 Schedule 1 required for vehicles 55,000 lbs or more. Tennessee trip permits are $30 per permit plus wire service fees.",
    },
    ifta: {
      agency: "Tennessee Department of Revenue",
      url: "https://www.tn.gov/revenue/motor-carrier/international-fuel-tax-agreement.html",
      same: true,
      note: "Open, renew and file quarterly IFTA returns through TNTAP; returns due April 30, July 31, October 31 and January 31. Temporary fuel use permit is $30 plus wire service fees.",
    },
    usdot: {
      rule: "not-required",
      note: "Tennessee is not on FMCSA's list of states requiring a USDOT number for intrastate commerce.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Tennessee Intrastate Authority (Department of Revenue)",
      agency: "Tennessee Department of Revenue, Motor Carrier section",
      url: "https://www.tn.gov/revenue/motor-carrier/intrastate-authority.html",
      fee: "Set by the Department of Revenue (ask when you apply through TNTAP)",
      insurance: "Your insurer files Form E (liability) and, for general freight, Form H (cargo) with the Department before the authority is issued",
      note: "Intrastate Authority allows for-hire motor carriers (and private towing/wrecker services) to transport persons or property in intrastate commerce on Tennessee highways. Apply online through TNTAP or by paper (Intrastate Authority Application plus Designated Agent for Service of Process form); insurer must file Form E (liability) and Form H (cargo) for general freight, household goods and mobile homes.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Tennessee Department of Transportation, Oversize and Overweight Permit Office",
      url: "https://www.tn.gov/content/tn/tdot/traffic-operations-division/oversize---overweight-permits.html",
    },
    extras: [
      {
        name: "TNTAP (Tennessee Taxpayer Access Point) motor carrier portal",
        url: "https://www.tn.gov/revenue/motor-carrier.html",
        note: "IRP, IFTA, UCR and Intrastate Authority are all handled by the Department of Revenue through TNTAP.",
      },
      {
        name: "Form E / Form H insurance filings for Intrastate Authority",
        url: "https://revenue.support.tn.gov/hc/en-us/articles/360060995211-MC-Intrastate-2-How-to-Apply",
        note: "The insurer must file Form E (liability) and, for general freight, household goods or mobile homes, Form H (cargo) plus a certificate of liability insurance before intrastate authority is issued; a Designated Agent for Service of Process form is also required.",
      },
      {
        name: "Tennessee trip and fuel use permits",
        url: "https://www.tn.gov/revenue/motor-carrier/international-fuel-tax-agreement.html",
        note: "Temporary trip permits and fuel use permits cost $30 per permit plus wire service fees for carriers without IRP/IFTA credentials.",
      },
    ],
    enforcement: {
      agency: "Tennessee Department of Safety and Homeland Security, Tennessee Highway Patrol Commercial Vehicle Enforcement",
      url: "https://www.tn.gov/safety/tnhp/cvemain.html",
    },
    near: [
      "georgia",
      "kentucky",
      "north-carolina",
    ],
  },
  {
    slug: "texas",
    name: "Texas",
    abbr: "TX",
    irp: {
      agency: "Texas Department of Motor Vehicles, Motor Carrier Division",
      url: "https://www.txdmv.gov/motor-carriers/commercial-fleet-registration/apportioned-registration",
      note: "All new motor carrier accounts must be created online in TxFLEET (TxFLEET@TxDMV.gov, 1-888-368-4689); fees are based on distance percentages by jurisdiction; proof of HVUT (Form 2290) required for vehicles 55,000 lbs or more.",
    },
    ifta: {
      agency: "Texas Comptroller of Public Accounts",
      url: "https://comptroller.texas.gov/taxes/fuels/ifta.php",
      same: false,
      note: "Apply online through Webfile (about 10 minutes; needs SSN/EIN, IRP cab card number and USDOT number) or paper Form AP-178; quarterly reports must be filed electronically through Webfile. Late penalty is $50 or 10 percent of tax due, whichever is greater.",
    },
    usdot: {
      rule: "required",
      note: "Texas is on FMCSA's intrastate USDOT list, and TxDMV states 'Before you begin you must have a valid USDOT Number' and that exclusively-Texas operations should register with USDOT as intrastate.",
      url: "https://www.txdmv.gov/motor-carriers/txdmv-number",
    },
    intra: {
      status: "required",
      what: "TxDMV Motor Carrier Registration (TxDMV Number)",
      agency: "Texas Department of Motor Vehicles, Motor Carrier Division",
      url: "https://www.txdmv.gov/motor-carriers/txdmv-number",
      fee: "1-year: $100 application + $10 per vehicle + $100 insurance filing; 2-year: $100 + $20 per vehicle + $100; 90-day: $25 + $10 per vehicle + $100; 7-day: $5 + $10 per vehicle + $100 (application fee is one-time while registration stays active)",
      insurance: "$500,000 for general commercial carriers over 26,000 lbs; $300,000 household goods; $1,000,000 hazmat; $5,000,000 high-risk hazmat; $500,000 school buses",
      note: "Required for intrastate carriers operating CMVs over 26,000 lbs gross weight, hauling placardable hazmat, farm vehicles 48,000 lbs or more, 15+ passengers, commercial school buses, or household goods for compensation at any weight. Apply through TxMCCS (Texas Motor Carrier Credentialing System, txmccs.txdmv.gov); questions (800) 299-1700 options 3-3.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Texas Department of Motor Vehicles, Motor Carrier Division, Oversize/Overweight Permits Office",
      url: "https://www.txdmv.gov/motor-carriers/oversize-overweight-permits",
    },
    extras: [],
    enforcement: {
      agency: "Texas Department of Public Safety, Commercial Vehicle Enforcement (Motor Carrier Bureau)",
      url: "https://www.dps.texas.gov/section/commercial-vehicle-enforcement",
    },
    near: [
      "oklahoma",
      "louisiana",
      "new-mexico",
    ],
  },
  {
    slug: "utah",
    name: "Utah",
    abbr: "UT",
    irp: {
      agency: "Utah State Tax Commission, Division of Motor Vehicles, Motor Carrier Services Section",
      url: "https://dmv.utah.gov/register/apportioned-registration/",
      base: "An owner or operator of a Utah based fleet of commercial vehicles operating in two or more jurisdictions may apply for apportioned registration; fees are prorated by fleet mileage in each jurisdiction.",
      note: "Motor Carrier Services Section: 210 N 1950 W, Salt Lake City, UT 84134, (801) 297-6800 / 1-888-251-9555; second office at 100 S 5300 W, Hurricane, UT 84737. Online services through the Utah Motor Vehicle Portal (MVP).",
    },
    ifta: {
      agency: "Utah State Tax Commission (Miscellaneous Taxes)",
      url: "https://tax.utah.gov/fuel/ifta-sfu",
      same: false,
      note: "Apply and file through Taxpayer Access Point (tap.tax.utah.gov) or form TC-69; decals are only available at the Salt Lake and Washington County offices; renewals due December 31. A $100 reinstatement fee applies if the license is revoked. Contact 801-297-7710 / miscellaneoustaxes@utah.gov.",
    },
    usdot: {
      rule: "required",
      url: "https://connect.udot.utah.gov/business/motor-carriers/motor-carrier-registration-credentials/usdot-numbers-registering-with-the-fmcsa/",
    },
    intra: {
      status: "none",
      agency: "Utah DMV (vehicle registration for combined gross weight) / UDOT Motor Carrier Division",
      url: "https://connect.udot.utah.gov/business/motor-carriers/motor-carrier-registration-credentials/motor-carrier-operating-authority/",
      note: "Utah has no separate state operating authority for general freight. UDOT's credential list for an in-state-only truck is the USDOT number, Utah intrastate registration at the combined gross weight, and compliance with the federal safety rules.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Utah Department of Transportation, Motor Carrier Division (Size and Weight Permitting)",
      url: "https://connect.udot.utah.gov/business/motor-carriers/size-weight-permitting/",
    },
    extras: [
      {
        name: "Utah intrastate USDOT number requirement",
        url: "https://connect.udot.utah.gov/business/motor-carriers/motor-carrier-registration-credentials/usdot-numbers-registering-with-the-fmcsa/",
        note: "UDOT requires companies hauling cargo in intrastate or interstate commerce to register with FMCSA and carry a USDOT number.",
      },
      {
        name: "Utah intrastate registration for combined gross weight",
        url: "https://connect.udot.utah.gov/business/motor-carriers/motor-carrier-registration-credentials/utah-intrastate-registration/",
        note: "Under Utah Code 41-1a-201 the power unit must be registered for the combined gross weight of the truck/tractor and all trailers when loaded.",
      },
      {
        name: "IFTA decals in person only",
        url: "https://tax.utah.gov/fuel/ifta-sfu",
        note: "IFTA decals are available only at the Salt Lake and Washington County (Hurricane) offices; renewals are due December 31.",
      },
    ],
    enforcement: {
      agency: "Utah Department of Transportation, Motor Carrier Division (Ports of Entry and Motor Carrier Investigations)",
      url: "https://connect.udot.utah.gov/business/motor-carriers/dot-safety-regulations/",
    },
    near: [
      "nevada",
      "arizona",
      "colorado",
    ],
  },
  {
    slug: "vermont",
    name: "Vermont",
    abbr: "VT",
    irp: {
      agency: "Vermont Department of Motor Vehicles, Commercial Vehicle Operations (Commercial Vehicle Office, Montpelier)",
      url: "https://dmv.vermont.gov/CVO/international-registration-plan-irp",
      base: "Applicant must have a physical structure in Vermont owned or leased by the registrant and staffed during regular business hours by permanent employees running the trucking operation, verified with three or more documents (tax returns, utility bills, lease, or a Vermont CDL of an 80%+ owner).",
      note: "IRP registrations can only be processed at the Commercial Vehicle Office, 120 State Street, Montpelier, VT 05603 (802-828-2071); no online IRP portal is named.",
    },
    ifta: {
      agency: "Vermont Department of Motor Vehicles, Commercial Vehicle Operations (CVO Unit - IFTA)",
      url: "https://dmv.vermont.gov/CVO/fuel-tax/international-fuel-tax-agreement-ifta",
      same: true,
      note: "Apply or renew with form CVO-112 (IFTA Motor Fuel Tax License Credentials and Decals); contact (802) 828-2070.",
    },
    usdot: {
      rule: "not-required",
      note: "Vermont is not on FMCSA's list of states requiring a USDOT number for intrastate commerce; Vermont DMV's motor carrier safety guide does not address a USDOT requirement for intrastate carriers.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "Vermont Department of Motor Vehicles, Commercial Vehicle Operations",
      url: "https://dmv.vermont.gov/CVO/international-registration-plan-irp",
      note: "Vermont's DMV commercial vehicle pages cover IRP, IFTA and permits and describe no state operating authority for general freight; the DMV's safety guide applies the federal safety rules to in-state trucks of 26,001 lbs and up.",
    },
    ucr: {
      participates: false,
      note: "A Vermont-based carrier must register through a participating state where it has an office or operating facility; if none, it may select CT, DE, MA, ME, NH, NY, PA, RI, VA or WV as its UCR base state.",
    },
    oversize: {
      agency: "Vermont Department of Motor Vehicles, Commercial Vehicle Office (VT Haul Pass permitting system)",
      url: "https://dmv.vermont.gov/CVO/permits",
    },
    extras: [
      {
        name: "UCR non-participation - pick a base state",
        url: "https://plan.ucr.gov/frequently-asked-questions/",
        note: "Vermont does not participate in UCR; Vermont-based interstate carriers register in a participating state where they have a facility, otherwise one of CT, DE, MA, ME, NH, NY, PA, RI, VA or WV.",
      },
      {
        name: "All trucks must enter Vermont weigh stations",
        url: "https://dmv.vermont.gov/enforcement-and-safety/motor-carrier-safety-assistance-program",
        note: "Vermont's MCSAP page states that regardless of weight, all trucks must enter Vermont's weigh stations.",
      },
    ],
    enforcement: {
      agency: "Vermont Department of Motor Vehicles, Vermont Highway Patrol (Commercial Vehicle Enforcement Section)",
      url: "https://dmv.vermont.gov/enforcement-and-safety",
    },
    near: [
      "new-hampshire",
      "new-york",
      "massachusetts",
    ],
  },
  {
    slug: "virginia",
    name: "Virginia",
    abbr: "VA",
    irp: {
      agency: "Virginia Department of Motor Vehicles, Motor Carrier Services",
      url: "https://www.dmv.virginia.gov/businesses/motor-carriers/irp",
      note: "Virginia DMV administers IRP; cab cards may be shown electronically or on paper. IRP and IFTA electronic services run through the VIIM system (https://www.dmv.virginia.gov/businesses/motor-carriers/viim-system).",
    },
    ifta: {
      agency: "Virginia Department of Motor Vehicles, Motor Carrier Services",
      url: "https://www.dmv.virginia.gov/businesses/motor-carriers/ifta",
      same: true,
      note: "One quarterly return filed with Virginia DMV covers all jurisdictions; the IFTA license is carried as an electronic image (paper licenses no longer required). Fees are in the DMV fee chart, not on this page.",
    },
    usdot: {
      rule: "not-required",
      note: "Virginia is not on FMCSA's list of states requiring a USDOT number for intrastate commerce; the Virginia DMV intrastate operating authority page does not mention a USDOT requirement.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Virginia DMV intrastate operating authority (operating certificate, license or permit as appropriate for the service)",
      agency: "Virginia Department of Motor Vehicles, Motor Carrier Services",
      url: "https://www.dmv.virginia.gov/businesses/motor-carriers/intrastate",
      fee: "On the Virginia DMV fee chart (ask Motor Carrier Services when you apply)",
      insurance: "Proof of liability insurance (and cargo, if applicable) filed with the DMV",
      note: "For-hire carriers transporting property or passengers within Virginia must obtain operating authority unless exempt or using vehicles under 10,000 lbs GVWR for property. Vehicles must first be titled in Virginia, registered as for-hire and carry for-hire plates; proof of liability (and cargo, if applicable) insurance is required. Online applications available since January 1, 2026 and mandatory from February 1, 2027 (except TNC renewals).",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Virginia Department of Motor Vehicles, Hauling Permits Section (EZ Haul)",
      url: "https://www.dmv.virginia.gov/businesses/hauling",
    },
    extras: [
      {
        name: "VIIM online IRP/IFTA system",
        url: "https://www.dmv.virginia.gov/businesses/motor-carriers",
        note: "Virginia's VIIM system is the one-stop portal for IFTA and IRP electronic services including IFTA return calculation.",
      },
    ],
    enforcement: {
      agency: "Virginia State Police, Motor Carrier Safety",
    },
    near: [
      "north-carolina",
      "maryland",
      "tennessee",
    ],
  },
  {
    slug: "washington",
    name: "Washington",
    abbr: "WA",
    irp: {
      agency: "Washington State Department of Licensing, Prorate and Fuel Tax Services",
      url: "https://dol.wa.gov/vehicles-and-boats/prorate-and-fuel-tax/international-registration-plan-prorate/register-irp-prorate",
      base: "Applicants file an Established Place of Business, Residency, or Change of Address form (450004) with the IRP application.",
      note: "Register online through License eXpress for prorate and fuel tax, by mail (PO Box 9048, Olympia, WA 98507-9048) or in person; requires IRP Application 450011, Form 2290, current Washington registrations in the account name and the carrier's USDOT number. Fees are quoted at processing; contact 360-664-1858 or motorcarrierservices@dol.wa.gov.",
    },
    ifta: {
      agency: "Washington State Department of Licensing, Prorate and Fuel Tax Services",
      url: "https://www.dol.wa.gov/vehicles-and-boats/taxes-fuel-tax-and-other-fees/fuel-tax/international-fuel-tax-agreement-ifta",
      same: true,
      note: "IFTA, IRP and fuel tax accounts are managed online through License eXpress (My License Express); quarterly IFTA returns filed with Washington.",
    },
    usdot: {
      rule: "required",
      note: "Washington is on FMCSA's intrastate list, and under RCW 46.32.080 the UTC requires common carriers to have a USDOT number when operating vehicles of 16,001+ lbs GVW or hauling hazmat at any weight; household goods, solid waste and bus carriers need one regardless of weight.",
      url: "https://www.utc.wa.gov/regulated-industries/transportation/regulated-transportation-industries/common-carriers/usdot-number-requirement",
    },
    intra: {
      status: "required",
      what: "Washington UTC common carrier permit (intrastate for-hire transportation of property)",
      agency: "Washington Utilities and Transportation Commission (UTC)",
      url: "https://www.utc.wa.gov/regulated-industries/transportation/regulated-transportation-industries/common-carriers",
      fee: "Paid online with the application (the UTC does not print the amount - Transportation@utc.wa.gov or 360-664-1222)",
      insurance: "$300,000 combined single limit for vehicles under 10,000 lbs; $750,000 CSL over 10,000 lbs; $1,000,000 for hazardous waste; $5,000,000 for bulk hazardous substances/explosives (Form E filed by the insurer)",
      note: "A common carrier is a company or person that moves property (other than household goods) for pay in Washington State; household goods movers need a separate household goods carrier permit. Complete applications usually process in about one day. Your insurer files a Form E first.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Washington State Department of Transportation, Commercial Vehicle Services",
      url: "https://wsdot.wa.gov/travel/commercial-vehicles/commercial-vehicle-permits",
    },
    extras: [
      {
        name: "UTC intrastate insurance requirements",
        url: "https://www.utc.wa.gov/regulated-industries/transportation/licensing-insurance/intrastate-motor-carrier-insurance-requirements",
        note: "The UTC's table of liability minimums by weight and cargo for permitted carriers ($750,000 combined single limit over 10,000 lbs).",
      },
      {
        name: "Washington intrastate USDOT threshold (16,001 lbs)",
        url: "https://www.utc.wa.gov/regulated-industries/transportation/regulated-transportation-industries/common-carriers/usdot-number-requirement",
        note: "Even if FMCSA's site says no USDOT is needed, Washington law (RCW 46.32.080) requires one for intrastate common carriers over 16,000 lbs GVW or hauling hazmat.",
      },
      {
        name: "WSDOT self-issued OS/OW permits",
        url: "https://wsdot.wa.gov/travel/commercial-vehicles/commercial-vehicle-permits",
        note: "Most routine oversize/overweight permits can be self-issued online 24/7; WSDOT provides a permit fee calculator. Contact CVSpermits@wsdot.wa.gov, 360-704-6340.",
      },
    ],
    enforcement: {
      agency: "Washington State Patrol, Commercial Vehicle Enforcement Division",
      url: "https://wsp.wa.gov/driver/commercial-vehicle-driver/",
    },
    near: [
      "oregon",
      "idaho",
      "montana",
    ],
  },
  {
    slug: "west-virginia",
    name: "West Virginia",
    abbr: "WV",
    irp: {
      agency: "West Virginia Division of Motor Vehicles, Motor Carrier Services Section",
      url: "https://transportation.wv.gov/DMV/Motor-Carriers/Pages/IRP-IFTA.aspx",
      base: "An applicant may elect as base jurisdiction any member jurisdiction where it has an established place of business, where the fleet accrues distance, and where operational records are maintained or can be made available (per the WV Commercial Vehicle Manual).",
      note: "Office is across from the Kanawha City Regional Office in The Shops at Kanawha, Charleston, WV 25317 (304-926-0799), Mon-Fri 8:30-5:00 with a 2 pm cutoff for new accounts. All registrants must have a USDOT number unless leased onto another carrier's USDOT. Replacement cab card $10, transfer $10 plus prorated fees, TEAR temporary registration $3 per vehicle.",
    },
    ifta: {
      agency: "West Virginia State Tax Division (licensing rules) with credentials issued by the WV DMV/IRP Office",
      url: "https://tax.wv.gov/Business/MotorFuel/InternationalFuelTaxAgreement/Pages/InternationalFuelTaxAgreementLicensing.aspx",
      same: true,
      note: "New carriers obtain a Letter of Good Standing (GSR-01) from the Tax Division, then submit it with the IFTA application to the DMV/IRP Office, which issues the license and decals; one decal set per qualified vehicle, renewed each calendar year. Fuel tax reporting through MyTaxes.",
    },
    usdot: {
      rule: "required",
      note: "West Virginia is on FMCSA's list of states requiring intrastate CMV registrants to obtain a USDOT number.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "none",
      agency: "West Virginia Public Service Commission, Motor Carrier Section (household goods and other non-preempted services)",
      url: "https://code.wvlegislature.gov/24A-1-3/",
      note: "West Virginia's certificate rule (Code 24A-2-5) still covers motor carriers, but Code 24A-1-3 exempts from the whole chapter the vehicles federal law preempts from state economic regulation - which is what general freight trucking is. In practice the PSC's Motor Carrier Section regulates household goods movers and similar services, not general freight. The PSC does handle West Virginia's UCR program, and its Transportation Enforcement officers run roadside enforcement.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "West Virginia Department of Transportation, Division of Highways, Permit Section",
      url: "https://transportation.wv.gov/oversizeoverweight-hauling-permits",
    },
    extras: [
      {
        name: "Tax Division Letter of Good Standing for IFTA",
        url: "https://tax.wv.gov/Business/MotorFuel/InternationalFuelTaxAgreement/Pages/InternationalFuelTaxAgreementLicensing.aspx",
        note: "New IFTA applicants must first get a Letter of Good Standing (form GSR-01) from the Tax Division and send it with the IFTA application to the DMV/IRP Office to receive credentials.",
      },
      {
        name: "Temporary Evidence of Apportioned Registration (TEAR)",
        url: "https://transportation.wv.gov/DMV/DMVFormSearch/2025_Commercial_Vehicle_Manual.pdf",
        note: "A 40-day TEAR is available for $3 per vehicle while IRP credentials are processed; all IRP registrants need a USDOT number unless leased to another carrier.",
      },
    ],
    enforcement: {
      agency: "West Virginia Public Service Commission, Transportation Enforcement Division (with the State Police)",
    },
    near: [
      "pennsylvania",
      "virginia",
      "ohio",
    ],
  },
  {
    slug: "wisconsin",
    name: "Wisconsin",
    abbr: "WI",
    irp: {
      agency: "Wisconsin Department of Transportation, DMV Motor Carrier Services",
      url: "https://wisconsindot.gov/Pages/dmv/com-drv-vehs/mtr-car-trkr/irp.aspx",
      base: "You may register in Wisconsin if you have an established place of business here, or, as an owner-operator, if you are a Wisconsin resident.",
      note: "Apply through the WisCRS online IRP/IFTA system; requires a current USDOT number in the exact legal name of the registrant, a FEIN on file with FMCSA, Wisconsin DFI business registration, and for for-hire carriers valid insurance and authority on file. The Hill Farms customer counter is permanently closed (drop box outside the south entrance). Contact (608) 266-9900 or irp-ifta@dot.wi.gov.",
    },
    ifta: {
      agency: "Wisconsin Department of Transportation, DMV Motor Carrier Services",
      url: "https://wisconsindot.gov/Pages/dmv/com-drv-vehs/mtr-car-trkr/ifta.aspx",
      same: true,
      note: "Apply with form MV2667 (renewal MV2766) or through WisCRS; requires an active USDOT number, business registration and, for for-hire carriers, insurance and authority on file. Renewal notices go out in early October. Mail: Motor Carrier Services, P.O. Box 7979, Madison WI 53707-7979.",
    },
    usdot: {
      rule: "required",
      note: "Wisconsin is on FMCSA's intrastate USDOT list; the WisDOT authority application (MV2843) states that carriers operating at over 10,000 lbs must have a USDOT number.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Wisconsin Intrastate Local Cartage (LC) motor carrier authority",
      agency: "Wisconsin Department of Transportation, DMV Motor Carrier Services",
      url: "https://wisconsindot.gov/Pages/dmv/com-drv-vehs/mtr-car-trkr/mc-authority.aspx",
      fee: "$500 for LC (property) authority per application form MV2843",
      insurance: "For-hire liability insurance under Wis. Stat. 194.41 must be on file with Motor Carrier Services before you apply",
      note: "Motor carrier operating authority is permission to carry property (or passengers) for someone else for compensation; intrastate-only carriers get state authority (LC + number for property) while interstate carriers use FMCSA authority. Apply with form MV2843; for-hire liability insurance under Wis. Stat. 194.41 must be on file with Motor Carrier Services before applying.",
    },
    ucr: {
      participates: true,
    },
    oversize: {
      agency: "Wisconsin Department of Transportation, Bureau of Highway Maintenance, Oversize/Overweight Permits",
      url: "https://wisconsindot.gov/Pages/dmv/com-drv-vehs/mtr-car-trkr/osowgeneral.aspx",
    },
    extras: [
      {
        name: "Wisconsin LC intrastate authority ($500)",
        url: "https://wisconsindot.gov/Documents/formdocs/mv2843.pdf",
        note: "Intrastate for-hire property carriers need Local Cartage (LC) authority; the MV2843 application fee is $500 and for-hire liability insurance must be on file first.",
      },
    ],
    enforcement: {
      agency: "Wisconsin State Patrol (WisDOT Division of State Patrol), Field Operations Bureau - motor carrier inspection and Safety and Weight Enforcement Facilities",
      url: "https://wisconsindot.gov/Pages/about-wisdot/who-we-are/dsp/default.aspx",
    },
    near: [
      "minnesota",
      "illinois",
      "michigan",
    ],
  },
  {
    slug: "wyoming",
    name: "Wyoming",
    abbr: "WY",
    irp: {
      agency: "Wyoming Department of Transportation, Motor Vehicle Services",
      url: "https://www.dot.state.wy.us/home/trucking_commercial_vehicles/irp.html",
      base: "Applicants must file a Certification of Established Place of Business or Wyoming Residency (form CC-101) to base in Wyoming.",
      note: "Apply through the Commercial Carriers of Wyoming System (CCOWS) online or with the Wyoming IRP Application, Schedule A/C and Agreement to Prepare and Maintain Records; a USDOT number is required. Contact (307) 777-4829.",
    },
    ifta: {
      agency: "Wyoming Department of Transportation, Motor Vehicle Services",
      url: "https://www.dot.state.wy.us/home/trucking_commercial_vehicles/ifta.html",
      same: true,
      note: "Apply with IFTA Application CC-105 plus New IFTA Account Checklist, CC-102 records agreement and CC-101 place-of-business certification, or online through CCOWS (ccows.dot.state.wy.us); quarterly returns and payments filed through CCOWS. Contact 307-777-4827.",
    },
    usdot: {
      rule: "required",
      note: "Wyoming is on FMCSA's list of states requiring a USDOT number for in-state-only trucks; WYDOT's own operating authority manual puts the line at 26,000 lbs GVW for contract carriers - get the free number regardless if you are over 10,000 lbs.",
      url: "https://www.fmcsa.dot.gov/registration/do-i-need-usdot-number",
    },
    intra: {
      status: "required",
      what: "Wyoming Intrastate Operating Authority - Contract Motor Carrier (WYDOT Motor Vehicle Services)",
      agency: "Wyoming Department of Transportation, Motor Vehicle Services",
      url: "https://www.dot.state.wy.us/home/trucking_commercial_vehicles/operating_authority.html",
      fee: "$50 application (contract motor carrier); duplicate letters $10; no annual renewal fee listed in the manual",
      insurance: "Form E liability $750,000 combined single limit; Form H cargo $10,000; Form MC61E $5,000 for mobile home cargo (insurer must file WYDOT forms; ACORD certificates not accepted)",
      note: "A contract motor carrier is any person engaged in the intrastate transportation of people or property on state highways for compensation; private carriers over 26,000 lbs GVW also need authority, while carriers under 26,000 lbs that always own what they haul do not. Apply with the Wyoming Operating Authority Application (MC100); contact 307-777-4850.",
    },
    ucr: {
      participates: false,
    },
    oversize: {
      agency: "Wyoming Highway Patrol, Commercial Carrier Section / Ports of Entry (WYDOT e-permitting at wydotpermits.wyo.gov)",
      url: "https://whp.wyo.gov/commercial-carrier/ports-of-entry",
    },
    extras: [
      {
        name: "Wyoming Operating Authority Manual (2020)",
        url: "https://www.dot.state.wy.us/files/live/sites/wydot/files/shared/Motor%20Vehicle%20Services/IRP_IFTA/2020%20Wyoming%20Operating%20Authority%20Manual.pdf",
        note: "WYDOT's manual with the application steps, fee table and insurance forms - the figures on this page come from its December 2020 revision, so confirm them when you apply.",
      },
      {
        name: "Mandatory port of entry stops",
        url: "https://whp.wyo.gov/commercial-carrier/ports-of-entry",
        note: "All commercial vehicles entering Wyoming must stop at designated ports of entry unless cleared by PrePass; oversize/overweight loads and livestock haulers must always stop. Commercial carrier contact (307) 777-4312.",
      },
      {
        name: "CCOWS online IRP/IFTA system",
        url: "https://www.dot.state.wy.us/home/trucking_commercial_vehicles/ifta.html",
        note: "IRP and IFTA applications, quarterly returns and payments are filed through the Commercial Carriers of Wyoming System (CCOWS).",
      },
    ],
    enforcement: {
      agency: "Wyoming Highway Patrol, Commercial Carrier Section (Ports of Entry)",
      url: "https://whp.wyo.gov/commercial-carrier/ports-of-entry",
    },
    near: [
      "colorado",
      "montana",
      "utah",
    ],
  },
];

const UPDATED = "Updated September 2026";

const GUIDES_BASE = [
  "how-to-get-trucking-authority",
  "ifta-for-owner-operators",
  "form-2290-heavy-vehicle-use-tax",
];

// "Texas Department of Motor Vehicles, Motor Carrier Division" ->
// "Texas Department of Motor Vehicles" for the short mentions.
function shortAgency(a: string): string {
  return a.split(" (")[0].split(" - ")[0].split(", ")[0].trim();
}

function shortWhat(w: string): string {
  return w.split(" (")[0].split(" - ")[0].trim();
}

// "Applicant must submit three documents" -> "applicant must submit
// three documents" when it follows a colon; state names and acronyms
// keep their capitals.
function lead(s: string, name: string): string {
  const first = s.split(" ")[0];
  if (s.startsWith(name) || first === first.toUpperCase()) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function sentence(s: string | undefined): string {
  if (!s) return "";
  const t = s.trim();
  if (!t) return "";
  return /[.!?]$/.test(t) ? t + " " : t + ". ";
}

function build(r: HlStateRaw): HlStateEntry {
  const n = r.name;
  const irpShort = r.irp ? shortAgency(r.irp.agency) : null;
  const iftaShort = r.ifta ? shortAgency(r.ifta.agency) : null;

  // ---- fact box -------------------------------------------------
  const usdotFact =
    r.usdot.rule === "required"
      ? "Required by the state even for in-state-only trucks"
      : r.usdot.rule === "not-required"
        ? "Not required by the state for in-state-only trucks (get the free number anyway)"
        : "Depends on weight - ask the state";
  const intraFact =
    r.intra.status === "required"
      ? shortWhat(r.intra.what ?? "State registration required")
      : r.intra.status === "none"
        ? "None for general freight"
        : "Unclear - confirm with " + (r.intra.agency ?? "the state");
  const facts: HlStateFact[] = [
    { l: "Apportioned plates (IRP)", v: irpShort ?? "Not an IRP member - see below" },
    {
      l: "Fuel tax license (IFTA)",
      v: iftaShort ? (r.ifta && r.ifta.same ? iftaShort + " (same office as IRP)" : iftaShort) : "Not an IFTA member - see below",
    },
    { l: "USDOT number, " + n + "-only trucks", v: usdotFact },
    { l: n + "-only for-hire authority", v: intraFact },
    { l: "By-the-mile tax", v: r.wd ? r.wd.name + " (" + r.wd.threshold + ")" : (r.mileFee ?? "None") },
    {
      l: "UCR",
      v: r.ucr.participates
        ? "Participating state - register at ucr.gov"
        : "Does not participate - register at ucr.gov through a participating base state",
    },
    { l: "Oversize / overweight permits", v: r.oversize ? shortAgency(r.oversize.agency) : "State DOT permit office" },
  ];

  // ---- intro ----------------------------------------------------
  const oneOffice = r.irp && r.ifta && r.ifta.same;
  const sameParent = r.irp && r.ifta && !r.ifta.same && irpShort === iftaShort;
  const officeLine =
    r.irp && r.ifta
      ? oneOffice
        ? "In " + n + " one office handles both apportioned plates and the IFTA license - the " + irpShort + ". "
        : sameParent
          ? "In " + n + " both apportioned plates and the IFTA license come from the " + irpShort + ", through two different units. "
          : "In " + n + " apportioned plates come from the " + irpShort + " while the IFTA license comes from the " + iftaShort + ". "
      : "";
  const introTwo =
    officeLine +
    (r.intra.status === "required"
      ? n + (officeLine ? " also has" : " has") + " its own registration for trucks that haul for hire without leaving the state: the " + shortWhat(r.intra.what ?? "state authority") + ". "
      : r.intra.status === "none"
        ? "There is no separate " + n + " operating authority for general freight - the state layer is plates, fuel tax, the USDOT number and permits. "
        : "Whether " + n + " wants its own authority for in-state-only freight is covered below. ") +
    (r.wd ? n + " is one of the four states that charges trucks by the mile - the " + r.wd.name + ". " : "") +
    (r.ucr.participates ? "" : n + " does not take part in UCR, which changes where you file that one. ");
  const intro = [
    "Your USDOT number and operating authority come from FMCSA and work the same in every state. What changes when you are based in " +
      n +
      " is the second layer: where you get apportioned plates, who issues your fuel-tax license, whether " +
      n +
      " wants its own registration for trucks that never leave the state, and which state office checks on you. Here is that layer for " +
      n +
      ", checked against the state's own pages in September 2026.",
    introTwo.trim(),
  ];

  // ---- sections -------------------------------------------------
  const sections: HlStateSection[] = [];

  if (r.island) {
    sections.push({
      h: "Everything in " + n + " is in-state",
      p: [
        "A truck based in " +
          n +
          " cannot drive to another state, so the interstate layer - operating authority, IRP plates, the IFTA license - does not apply the way it does on the mainland. What applies is the federal USDOT number (" +
          n +
          " requires it), the state's own certificate for hauling for hire, county registration, and the state DOT's safety and permit rules. The rest of this page walks through that layer.",
      ],
    });
  } else sections.push({
    h: "Interstate or " + n + "-only? Decide this first",
    p: [
      "Two different rulebooks apply depending on where the truck goes. Cross a state line for pay and you are an interstate carrier: FMCSA issues your USDOT number and operating authority (the $300 filing) and sets the insurance and BOC-3 rules, and " +
        n +
        "'s job is plates, fuel tax and roadside enforcement. Stay inside " +
        n +
        " and you are an intrastate carrier: no federal authority is needed, and " +
        n +
        "'s own rules take over - covered in the in-state section below.",
      "Most new owner-operators run interstate, so this page assumes that unless it says otherwise. If you are truly " +
        n +
        "-only, you register the truck and its fuel with the state instead of IRP and IFTA, and the in-state section is the one to read closely.",
    ],
  });

  if (r.irp) {
    sections.push({
      h: "Apportioned plates (IRP) in " + n,
      p: [
        n +
          "'s IRP office is the " +
          r.irp.agency +
          ". " +
          (r.irp.base ? "To base a fleet in " + n + " you have to show a real connection to the state: " + sentence(lead(r.irp.base, n)) : "") +
          sentence(r.irp.note),
        "Bring what every IRP office wants: your USDOT number and EIN, the truck's title or lease, proof of insurance, and a stamped Form 2290 Schedule 1 if the truck is 55,000 lbs or heavier. Fees are split among the states by the share of miles you run in each, so nobody can quote a flat price up front - the states that publish an estimate put a first-year 80,000 lb plate at roughly $1,250 to $2,500. You renew every year in the month " +
          n +
          " assigns you.",
      ].map((x) => x.trim()),
    });
  } else {
    sections.push({
      h: "Plates in " + n + " (not an IRP state)",
      p: [sentence(r.irpAlt).trim()],
    });
  }

  if (r.ifta) {
    sections.push({
      h: "IFTA in " + n,
      p: [
        (r.ifta.same
          ? "The same office handles IFTA - the " + r.ifta.agency + ". "
          : sameParent
            ? "IFTA is handled by a different unit of the same department: the " + r.ifta.agency + ". "
            : "IFTA lives at a different agency: the " + r.ifta.agency + ". ") +
          (r.ifta.fee ? "License and decal fee: " + sentence(r.ifta.fee) : "") +
          sentence(r.ifta.note),
        "Once licensed you file a quarterly return - due April 30, July 31, October 31 and January 31 - even for a quarter with zero miles. Keep every fuel receipt and your miles by state; the return is built from them. The license expires December 31 and is renewed every year.",
      ].map((x) => x.trim()),
    });
  } else {
    sections.push({
      h: "Fuel tax in " + n + " (not an IFTA state)",
      p: [sentence(r.iftaAlt).trim()],
    });
  }

  const usdotPara =
    r.usdot.rule === "required"
      ? "If the truck never leaves " +
        n +
        " you do not need federal operating authority (the $300 filing) - but " +
        n +
        " is one of the states that still wants in-state-only trucks to hold a USDOT number. " +
        sentence(r.usdot.note) +
        "The number is free, so get it early; almost every state form asks for it."
      : r.usdot.rule === "not-required"
        ? "If the truck never leaves " +
          n +
          " you do not need federal operating authority, and " +
          n +
          " is not one of the states that requires a USDOT number for in-state-only trucks. " +
          sentence(r.usdot.note) +
          "Most carriers get the free number anyway: many state forms ask for it, and you will need it the day you cross a state line."
        : "If the truck never leaves " +
          n +
          " you do not need federal operating authority. Whether the state wants a USDOT number depends on your weight - " +
          sentence(r.usdot.note) +
          "The number is free, so getting it is the safe move.";

  let intraPara = "";
  if (r.intra.status === "required") {
    intraPara =
      n +
      " also has its own registration for hauling other people's freight for hire inside the state: the " +
      (r.intra.what ?? "state authority") +
      (r.intra.agency ? ", issued by the " + r.intra.agency : "") +
      ". " +
      sentence(r.intra.note);
  } else if (r.intra.status === "none") {
    intraPara = sentence(r.intra.note);
  } else {
    intraPara =
      sentence(r.intra.note) +
      "Call " +
      (r.intra.agency ?? "the state") +
      " before you take an in-state load and get the answer in writing.";
  }
  const intraDetail =
    (r.intra.status === "required" && r.intra.fee ? "Fee: " + sentence(r.intra.fee) : "") +
    (r.intra.insurance ? (r.intra.status === "required" ? "Insurance: " : "State insurance rule: ") + sentence(r.intra.insurance) : "");
  const intraP = [usdotPara.trim(), intraPara.trim()];
  if (intraDetail.trim()) intraP.push(intraDetail.trim());
  sections.push({ h: "Hauling only inside " + n, p: intraP });

  sections.push({
    h: "UCR when you are based in " + n,
    p: [
      (r.ucr.participates
        ? n +
          " takes part in the Unified Carrier Registration program. Interstate carriers register once a year at ucr.gov - $46 for 0-2 trucks in 2026, $55 in 2027. "
        : n +
          " does not take part in UCR, but that does not excuse you: an interstate carrier based in " +
          n +
          " still registers every year at ucr.gov ($46 for 0-2 trucks in 2026, $55 in 2027), choosing a participating state as its base. ") +
        sentence(r.ucr.note) +
        "Carriers that only haul inside the state do not register for UCR at all.",
    ].map((x) => x.trim()),
  });

  if (r.wd) {
    sections.push({
      h: r.wd.name + ": " + n + " charges by the mile",
      p: [
        n +
          " is one of the four states with its own by-the-mile tax on top of fuel tax. " +
          r.wd.name +
          " applies at " +
          r.wd.threshold +
          ". " +
          sentence(r.wd.note) +
          "Register before your first mile, and file every period even when you did not run - a skipped zero return is what gets licenses revoked. The Stay Legal calendar tracks these returns when you switch " +
          n +
          " on.",
      ].map((x) => x.trim()),
    });
  }

  const extrasList = r.extras.map((e) => e.name + ": " + (e.note ?? "").trim()).filter((x) => !x.endsWith(": "));
  const otherP = [
    r.oversize
      ? "Oversize and overweight permits come from the " + r.oversize.agency + " - every state wants its own permit for a load beyond the legal size or weight, and most now sell them online."
      : "Oversize and overweight permits come from the state DOT permit office - every state wants its own permit for a load beyond the legal size or weight.",
  ];
  if (extrasList.length > 0) {
    otherP.push("Other " + n + "-specific things a new one-truck carrier runs into:");
  }
  sections.push({ h: "Other " + n + " permits and programs", p: otherP, list: extrasList.length > 0 ? extrasList : undefined });

  sections.push({
    h: "Who checks on you in " + n,
    p: [
      (r.enforcement
        ? "Roadside inspections in " + n + " are run by the " + r.enforcement.agency + ", working with FMCSA. "
        : "Roadside inspections in " + n + " are run by the state's commercial vehicle enforcement officers, working with FMCSA. ") +
        "Expect the New Entrant safety audit within your first 12 months of interstate operation - the walkthrough's audit checklist covers the 16 things that fail it automatically.",
    ],
  });

  const order: string[] = r.island
    ? [
        "Form the business and get a free EIN from the IRS.",
        "Get your USDOT number (free) through FMCSA's Motus system.",
        "File Form 2290 with the IRS if the truck is 55,000 lbs or heavier and keep the stamped Schedule 1.",
      ]
    : [
        "Form the business and get a free EIN from the IRS.",
        "Get your USDOT number (free) through FMCSA's Motus system - and apply for operating authority ($300) if you will ever cross a state line.",
        "Have your insurer file the federal proof of insurance and hire a process agent for the BOC-3.",
        "File Form 2290 with the IRS if the truck is 55,000 lbs or heavier and keep the stamped Schedule 1 - the plate office asks for it.",
      ];
  if (r.irp) {
    order.push("Get apportioned plates from the " + irpShort + " (or " + n + " commercial plates if the truck will never leave the state).");
  } else {
    order.push("Register the truck with the state (see the plates section above).");
  }
  if (r.ifta) {
    order.push("Get your IFTA license and decals from the " + iftaShort + ".");
  }
  if (!r.island) {
    order.push(
      r.ucr.participates
        ? "Register for UCR at ucr.gov if you run interstate."
        : "Register for UCR at ucr.gov through a participating base state if you run interstate."
    );
  }
  if (r.intra.status === "required") {
    order.push("If you will haul " + n + "-only loads, get the " + shortWhat(r.intra.what ?? "state authority") + " before the first one.");
  }
  if (r.wd) {
    order.push("Register for " + r.wd.name + " before your first mile in " + n + ".");
  }
  order.push(
    "Put the deadlines in the Stay Legal calendar: MCS-150 update, IFTA quarters, UCR, Form 2290, medical card, annual inspection" +
      (r.wd ? ", and the " + r.wd.name + " returns." : ".")
  );
  sections.push({ h: "The order to do it in", list: order });

  sections.push({
    h: "Always confirm with " + n,
    p: [
      "Fees and forms move without notice. Before you pay anyone, open the official pages below and check the current figures - it takes ten minutes and prevents expensive surprises. HaulLegal is not the government, is not a law firm, and never files anything for you; you do every step yourself.",
    ],
  });

  // ---- official links (real anchors in the renderer) --------------
  const links: HlStateLink[] = [];
  const seen = new Set<string>();
  const add = (label: string, url: string | undefined) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    links.push({ label, url });
  };
  if (r.irp) add("IRP / apportioned plates - " + shortAgency(r.irp.agency), r.irp.url);
  if (r.ifta) add("IFTA - " + shortAgency(r.ifta.agency), r.ifta.url);
  if (r.intra.status === "required") add(shortWhat(r.intra.what ?? "In-state authority"), r.intra.url);
  else if (r.intra.url) add("In-state rules - " + shortAgency(r.intra.agency ?? n), r.intra.url);
  if (r.wd) add(r.wd.name, r.wd.url);
  if (r.oversize) add("Oversize / overweight permits", r.oversize.url);
  for (const e of r.extras) add(e.name, e.url);
  if (r.enforcement) add("Enforcement - " + shortAgency(r.enforcement.agency), r.enforcement.url);
  if (r.usdot.url) add("USDOT number rule for in-state trucks", r.usdot.url);

  // ---- meta -----------------------------------------------------
  const intraShort =
    r.intra.status === "required"
      ? "the " + shortWhat(r.intra.what ?? "state authority") + " for in-state hauling"
      : r.intra.status === "none"
        ? "no extra state authority for general freight"
        : "the in-state rules";
  const metaDescription = r.irp && r.ifta
    ? n +
      " state steps for a new owner-operator: IRP plates (" +
      irpShort +
      "), IFTA (" +
      iftaShort +
      "), " +
      intraShort +
      ", " +
      (r.wd ? r.wd.name + ", " : "") +
      "UCR and permits - verified September 2026."
    : n +
      " state steps for a new owner-operator: " +
      n +
      " is not an IRP or IFTA member, so plates and fuel tax work differently; " +
      intraShort +
      ", the USDOT number and permits - verified September 2026.";
  const card =
    (r.irp && r.ifta
      ? oneOffice
        ? "IRP and IFTA both at the " + irpShort + "; "
        : "IRP at the " + irpShort + ", IFTA at the " + iftaShort + "; "
      : "not an IRP or IFTA state; ") +
    intraShort +
    (r.wd ? "; " + r.wd.name + " by the mile" : "") +
    (r.ucr.participates ? "." : "; UCR through another state.");

  return {
    slug: r.slug,
    name: n,
    abbr: r.abbr,
    metaTitle: n + " Trucking Authority: IRP, IFTA, UCR and State Rules (2026)",
    metaDescription,
    h1: "Starting a Trucking Company in " + n + ": The State-Level Steps",
    updated: UPDATED,
    card: card.charAt(0).toUpperCase() + card.slice(1),
    intro,
    facts,
    sections,
    links,
    related: r.near,
    guides: r.wd ? [...GUIDES_BASE, "weight-distance-tax-states"] : GUIDES_BASE,
  };
}

export const HL_STATES: HlStateEntry[] = RAW.map(build);

export function getHlState(slug: string): HlStateEntry | null {
  return HL_STATES.find((s) => s.slug === slug) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/haullegal/states.ts (v1 - 50 state pages,
// verified Sept 2026, built from compact per-state facts)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
