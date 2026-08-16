// FILE: lib/foremanprep/lessons.ts
import type { DomainKey } from "./questions";

// ForemanPrep drive-time lessons (v1). Twelve spoken-word scripts,
// one per exam subject, written in the foreman voice from the
// bank's own verified explanations - every fact in these scripts
// also lives in a cited question. The audio-gen route reads these
// to generate lesson-<key>.mp3 files (ElevenLabs, stock Adam);
// the audio page plays them. Minutes are estimates at a natural
// reading pace (~150 words per minute).

export type ForemanLesson = {
  key: DomainKey;
  title: string;
  minutes: number;
  script: string;
};

export const LESSONS: ForemanLesson[] = [
  {
    key: "procurement",
    title: "Procurement & Contracting",
    minutes: 6,
    script: `This is your Procurement and Contracting lesson - and listen close, because this is the biggest subject on the whole exam. Thirty-one of the one hundred fifteen questions come from right here. Get strong on this one subject and you are more than a quarter of the way to passing.

Start with what makes a contract a contract. Four elements, every time: offer and acceptance, consideration, competent parties, and legal purpose. Consideration means both sides give up something of value - money for services. No consideration, no contract, just a one-sided promise. Competent parties means legal age and sound mind - minors, the mentally incompetent, and people under the influence can void a deal. And notice what is NOT on that list: profit margin. Making money is your business decision, not a legal requirement. The exam loves that distractor.

Oral agreements can be binding, but the sale or purchase of land must be in writing. And when contract wording is genuinely unclear, courts read the ambiguity AGAINST the party who wrote it. Lawyers call it contra proferentem. You just need to remember: vague language hurts the drafter.

Now contract types, by who carries the risk. Lump sum: fixed price, the contractor eats overruns but keeps savings - the risk is yours. Cost plus: the owner reimburses actual costs plus a fee - the risk shifts to the owner. Unit price: a set price per cubic yard or linear foot, paid on actual quantities - built for work like excavation where nobody knows the exact quantities up front. And design build gives the owner one point of responsibility for both design and construction, instead of separate contracts.

Paperwork next, because the exam tests whether you know which document does what. An addendum changes the bid documents BEFORE bids come in, so everyone prices the same scope. A change order is the written modification AFTER the contract is signed. Mixing those up is a classic trap. An RFI just asks a question. A submittal - shop drawings, product data, samples - gets the architect's blessing before you order or build. As-builts get recorded after construction. The notice to proceed starts the contract clock at the beginning of the job; the certificate of occupancy comes at the very end.

Money mechanics. Retainage: commonly five to ten percent held back from each progress payment - the owner's leverage to get the job finished and corrected - released at or near final completion. Liquidated damages: a fixed daily dollar amount for finishing late, agreed up front so the owner never has to prove actual losses. They are about time, not defects. And a mechanic's lien is your claim against the property itself when you go unpaid - but strict notice and filing deadlines apply, so the paperwork has to move fast.

Now bonds - the exam gold mine. A bid bond backs the bid itself: if the winner walks away, the owner claims against it. A performance bond guarantees the work gets completed if the contractor defaults. A payment bond makes sure subs and suppliers get paid - which also shields the owner from liens. A maintenance bond covers defective workmanship that shows up within the stated period, often one year. A completion bond protects the lender - whoever is funding the job. A fidelity bond covers employee dishonesty - theft by your own people - and that is different from burglary insurance, which covers outsiders only. Bond premiums run about one half of one percent up to two percent of the contract amount. A bank letter of credit is NOT a bond - it is a bank-backed cash guarantee, customarily covering only five to ten percent of the contract. And the surety qualifies you on financial stability, credit, references, experience, and equipment.

Federal law: the Miller Act requires performance and payment bonds on federal construction contracts over one hundred thousand dollars, with the performance bond normally at one hundred percent of the contract price. States copied it with their Little Miller Acts for state and local public work.

Insurance, quickly. CGL - commercial general liability - covers third parties: bodily injury, property damage, personal and advertising injury. Your own employees hurt on the job? That is workers' comp - required by law and paid entirely by the employer, not one dime from wages. Builder's risk covers the building under construction itself - fire, theft, weather. Umbrella liability sits on top of the CGL and kicks in when its limit runs out.

Last piece: when deals go bad. Negotiation first - cheapest and simplest. Then mediation, where a neutral helps the parties reach their OWN agreement - a mediator cannot force anything. Then arbitration, where the arbitrator acts like a private judge and the decision is BINDING. Court is the last resort. Mediator facilitates, arbitrator decides. Lock that in.

Quick recap. Four contract elements. Addendum before bid, change order after. Lump sum risk on you, cost plus risk on the owner, unit price for unknown quantities. Bid, performance, payment, maintenance bonds - know which protects whom. Miller Act at one hundred thousand. Retainage five to ten percent. Mediator facilitates, arbitrator decides. That is the backbone of thirty-one questions.`,
  },
  {
    key: "general",
    title: "General Requirements & Safety",
    minutes: 5,
    script: `This is your General Requirements and Safety lesson. Twenty-five questions on the exam - the second biggest subject - and most of it is OSHA. The good news: OSHA questions are pure memory. Learn the numbers, collect the points.

Start at the top. OSHA - the Occupational Safety and Health Administration - was created by the OSH Act of 1970. Its construction standard is 29 CFR 1926. That is THE number for this exam. The look-alikes are traps: 1910 is general industry, 1904 is injury recordkeeping. Construction means 1926, every time.

Fall protection. The general construction trigger is six feet. Not four - four feet is general industry, and the exam will dangle it in front of you. And scaffolds are the exception: scaffolds get their own trigger at ten feet. Six for construction, ten for scaffolds. Two numbers, two easy points.

More life-saving numbers. Stay at least ten feet from overhead power lines, and treat every line as energized until the utility says otherwise. Before you dig, call 811 - the One Call system - so buried utilities get marked. A competent person, by OSHA's definition, has two prongs: capable of IDENTIFYING hazards, and AUTHORIZED to correct them. Training alone does not make someone competent - authority is half the definition.

Hazard communication: every hazardous chemical on site needs an accessible Safety Data Sheet - hazards, PPE, first aid, handling - and workers have the right to review them any time.

Recordkeeping and enforcement. OSHA Form 300 is the running log of recordable injuries. 300A is the annual summary that gets posted. 301 is the individual incident report. A willful violation - knowing, or plainly indifferent to the law - carries the steepest penalties, up to one hundred fifty-six thousand dollars and possible criminal charges if a worker dies. Falsifying OSHA records is criminal too: ten thousand dollars, up to six months in jail, or both. Retaliating against a worker for using their OSHA rights is prohibited, and the worker has thirty days to notify OSHA. Inspections come in two flavors: programmed - planned visits targeting high-injury industries - and unprogrammed, which respond to fatalities, catastrophes, and complaints. And your EMR - experience modification rate - benchmarks your safety losses against an average of one point zero. Above one, your premiums climb and owners start screening you out of bids.

Environmental rules, because the exam sprinkles these in. Lead: the RRP rule targets pre-1978 housing - that is the year lead paint was banned for residential use. Renovators disturbing paint in those homes must be certified, follow lead-safe practices, and hand the owner the EPA pamphlet - Protect Your Family From Lead in Your Home - BEFORE work starts, with confirmation of receipt. Stormwater: the NPDES permit system under the Clean Water Act controls runoff from construction sites - disturb enough land and you need a permit with erosion controls. Find hazardous waste on site? Notify the authorities or the National Response Center promptly, and dispose of it only at a permitted facility.

Now the project management side. The critical path is the chain of activities with ZERO float - delay any one of them and the whole job slides. Float, or slack, is the wiggle room a non-critical activity has before it starts pushing the finish date. A bar chart - a Gantt chart - shows activities as horizontal bars on a calendar, easy to read but it does not show dependencies; that is what the critical path network is for. Contingency time is deliberate cushion for weather and surprises. Daily reports - weather, crews, work done, delays - are the paper trail that wins disputes. Quality assurance is the PROACTIVE system - procedures and checks that prevent defects, not just catch them. And cash management: you pay for labor and materials before the owner's progress payment arrives - managing that gap is what keeps a profitable job from dying broke. The certificate of occupancy closes the job; the notice to proceed opens it.

Recap. 1926, construction. Six feet fall protection, ten on scaffolds. Ten feet from power lines. Call 811. Competent person: identify AND authorized. Form 300 log, 300A summary, 301 incident. Pre-1978 lead rule. Critical path has zero float. Twenty-five questions, most of them exactly this list.`,
  },
  {
    key: "site",
    title: "Site Construction",
    minutes: 4,
    script: `This is your Site Construction lesson. Fifteen questions - the third biggest subject - covering excavation safety, soils, foundations, and sitework equipment.

Trench safety first, because these numbers save lives and score points. Excavations five feet deep or more require a protective system - sloping, shoring, or a trench box. At four feet, a different rule kicks in: a means of egress - a ladder or ramp - within twenty-five feet of lateral travel. Spoil piles and equipment stay at least two feet back from the trench edge, so material cannot roll back in and the extra weight cannot collapse the wall. Soil types: stable rock is the most stable, Type A is cohesive soil like clay, and Type C - gravel, sand, anything submerged - is the LEAST stable and demands the flattest slopes and the strongest protection.

Before anything gets built, the site gets evaluated - and the order matters. Feasibility comes FIRST: if the intended use does not fit the site's features, location, and zoning, there is no point studying the dirt. Then the physical evaluation runs in two phases - a preliminary investigation before design, and a final investigation to set the foundation parameters.

Soil behavior you need cold: a bank cubic yard is soil in its natural, undisturbed state. Dig it up and it bulks - swells about fifteen to twenty percent - so the volume you haul is bigger than the volume you dug. Estimators who forget bulking order too few trucks.

Foundations. They go below the frost line, so freeze-thaw cannot heave and crack them - how deep depends on your climate. Shallow foundations - pad footings under columns, strip footings under walls - are cast-in-place reinforced concrete a short distance below grade. When good soil is deep, you go to piles and caissons. A composite pile pairs two materials - most commonly a wood bottom with a concrete top. Pile hammers come in drop, mechanical, and vibratory types. A caisson stays in the ground as a permanent unit and concrete form; a cofferdam is only a temporary box to hold back water or earth while you work, then it comes out. And here is a neighborly warning the exam likes: dewatering - pulling the water table down - can make the buildings NEXT DOOR settle, so their condition matters before you start pumping.

Equipment and surveying. Loose, noncohesive soils - sand and gravel - load efficiently with a hydraulic excavator; soil type drives the equipment choice. When the ground is too soft to drive on, a crawler crane sits on firm ground and reaches out with a dragline or clamshell - which is why that rig handles dredging. A bench mark is a surveyed point with a KNOWN elevation, permanently marked with a brass plate. The arbitrary reference is a datum point, and batter boards are the bars on posts that guide your excavation lines.

Pavement, last. Two families: rigid - concrete - and flexible - asphalt - designed for a useful life of roughly ten to twenty years. Under a parking lot, the granular base goes at least six inches thick, compacted to ninety-eight percent of the modified Proctor so it will not settle under traffic.

Recap. Five feet: protection required. Four feet: egress within twenty-five feet. Two feet: spoil setback. Type C is the weakest soil. Feasibility before physical evaluation. Bank yards swell fifteen to twenty percent. Foundations below frost line. Caisson permanent, cofferdam temporary. Ninety-eight percent Proctor under parking. Fifteen questions, and you just heard most of them.`,
  },
  {
    key: "concrete",
    title: "Concrete",
    minutes: 3,
    script: `This is your Concrete lesson. Six questions on the exam, and they cluster around a handful of fundamentals.

What concrete IS: cement-and-water paste plus aggregate. The paste coats the aggregate, fills the voids, and binds everything into a dense solid mass. Strength comes from hydration - the chemical reaction between cement and water - and hydration needs water and workable temperatures over TIME. That is why curing matters: curing keeps water IN, not out. Let fresh concrete dry out early and hydration stops - strength is lost permanently.

The single most important ratio in this subject: water to cement. LOWER water-cement ratio means denser, stronger concrete. So when a crew adds water at the chute to make the mix easier to place, they are weakening the slab - fastest mistake in the business. The slump test measures workability - how stiff or fluid the fresh mix is. It does NOT measure strength; strength gets measured later by breaking cured cylinders.

Reinforcement. Concrete is strong in compression, weak and brittle in tension. Steel is excellent in tension and ductile. Put steel where the tension goes and you get reinforced concrete - each material doing the job it is good at. Clear cover is the concrete distance from the surface to the nearest bar - it protects the steel from corrosion and fire, and it is a code issue, not a suggestion.

Formwork is the temporary framing that holds plastic concrete in shape while it cures - and it also supports the rebar and construction loads until the concrete can carry itself. Slip forms move continuously upward, drawn by jacks climbing vertical steel rods anchored at the base - that is how tall cores and silos get poured. Construction joints divide one construction activity from another - they are where a day's placement ends. And for placing concrete, the pump has become the method of choice - versatility and speed have pushed the older methods into supporting roles.

Two specialty facts the exam pulls from the book. Type IV cement - low heat of hydration - is for massive structures like dams, where heat buildup must be kept to a minimum. Structural lightweight concrete: twenty-eight-day strength greater than twenty-five hundred psi, air-dry weight under one hundred fifteen pounds per cubic foot.

Recap. Curing keeps water in. Lower water-cement ratio, stronger concrete. Slump measures workability, cylinders measure strength. Steel carries the tension. Cover protects the steel. Type IV for dams. Lightweight: over twenty-five hundred psi, under one fifteen pounds. Six questions - and they come straight from this list.`,
  },
  {
    key: "metals",
    title: "Metals",
    minutes: 2,
    script: `This is your Metals lesson. Six questions, mostly about steel - and steel is friendly to memorize.

Rebar first. Bar sizes count in EIGHTHS of an inch. A number four bar is four eighths - half an inch. A number eight bar is a full inch. Learn the eighths rule and you can size any bar in your head. The ribs on rebar - the deformations - are there to lock the bar into the concrete so the two act together under load. Smooth bars would slip. Corrosion protection comes from concrete cover and coatings, not from the ribs.

Structural steel grades - two numbers to own. A36 is the old standby: thirty-six thousand psi yield strength. A992 is the modern standard for wide-flange beams and columns: fifty thousand psi. If the question says W-shape or wide flange, think A992 and fifty.

Steel's properties, because the exam asks WHY we use it. Steel is ductile, has a high strength-to-weight ratio, and - here is the key phrase - it is equally strong in tension and compression. That is why concrete and timber lean on steel to cover their weaknesses. And steel is genuinely reusable: a steel frame can be disassembled and its beams and columns used again without major refining.

Connections. The A325 high-strength carbon steel bolt is the most common bolt in structural steel connections. For welding, remember GMAW - gas metal arc welding - relies on a shielding gas over the molten pool. Wind blows the shield away, so GMAW cannot be used in wind - it is a SHOP process, not a field process. If the question contrasts shop welding and field welding, that is the answer they want.

Recap. Rebar in eighths - number four is half an inch. A36 is thirty-six, A992 is fifty. Ribs lock the bar in. Steel: equal in tension and compression, reusable. A325 is the bolt. GMAW stays in the shop, away from wind. Six questions, six facts.`,
  },
  {
    key: "mep",
    title: "Mechanical & Plumbing",
    minutes: 4,
    script: `This is your Mechanical and Plumbing lesson. Six questions on the exam, split between plumbing and HVAC. It is number-heavy, so let the numbers roll past you more than once.

Plumbing basics. Every fixture connects to the drain through a P-trap - that bend holds a plug of water that seals sewer gases out of the building. A backflow preventer does a different job: it stops reverse flow from pulling contaminants into the clean water supply when pressure drops. Trap blocks gas, backflow preventer protects the water. Do not let the exam swap them on you.

Copper pipe walls, thickest to thinnest: K, L, ACR, M, and DWV the thinnest. Outside diameter stays the same for a given size - a thicker wall just means a smaller inside. Remember K is the thickest and you can order the rest.

Pressure and temperature numbers. Building water pressure can never exceed eighty psi - if the street main runs higher, a pressure-reducing valve goes where the service enters. The T and P relief valve on a water heater: temperature side opens at two hundred ten degrees - just before boiling - and the pressure side opens at a minimum of one hundred twenty-five psi. Testing a drainage system: seal it, pump air to a uniform five psi, and it must hold for fifteen minutes with no air added.

Drainage sizing. A water closet - a toilet - is rated at six drainage fixture units and needs at least a three-inch waste pipe and a two-inch vent. And here is the counterintuitive one: drain pipes flow best at about ONE-THIRD full, because that keeps the water moving fast enough to scour solids along. Oversize the pipe and flow goes shallow and slow, solids drop out, and the line clogs. Bigger is not better underground.

HVAC. A Btu is the heat needed to change one pound of water one degree Fahrenheit; equipment is rated in Btu per hour. A ton of cooling comes from melting one ton of ice over twenty-four hours. Boilers: the safety relief valve mounts at the TOP, with no other valve between it and the boiler, discharging when pressure exceeds the maximum allowable working pressure. A steam trap removes air and condensate and returns the condensate to the boiler as feedwater. Refrigeration always has the same four players: the evaporator absorbs heat, the condenser rejects it, the compressor creates flow, and the expansion device turns liquid refrigerant into a liquid-vapor mix. Heat pumps in heating mode run the cycle backward - the INDOOR coil becomes the condenser - and a reversing valve flips the refrigerant flow because the compressor only pumps one direction.

One more term: commissioning. That is the process that verifies and documents that building systems actually perform as designed. If the question describes microprocessor control of systems, that is a building automation system - different answer.

Recap. Trap seals gas, backflow preventer guards supply. Type K thickest. Eighty psi max in the building. Two ten and one twenty-five on the T and P valve. Toilet: six fixture units, three-inch waste. Drains scour at one-third full. Indoor coil is the condenser when a heat pump heats. Six questions - the numbers are the answers.`,
  },
  {
    key: "wood",
    title: "Wood",
    minutes: 2,
    script: `This is your Wood lesson. Five questions on the exam, built around a few facts every framer half-knows - the exam checks whether you know them all the way.

Number one, the most famous trick in lumber: nominal versus actual size. Nominal is the rough-cut call-out; the finished, dried board is smaller. A two-by-four actually measures one and a half by three and a half inches. Estimate off nominal dimensions and your layout and material counts come out wrong - and the exam knows contractors do it.

Framing an opening: the HEADER spans the opening and carries the load above it down into the jack studs - also called trimmer studs - on each side. The sill sits at the bottom of a window opening. The sole plate runs along the floor. Three different pieces; the header does the heavy lifting.

Why wood works: good strength in both tension and compression, and it lasts a long time IF you keep it safe from its two enemies - decay, which needs moisture and fungus, and insects. That protection comes from preservative treatment: creosote, Wolman salts, and copper compound solutions, driven deep into the wood under pressure for long-lasting effect. Fire protection works similarly - chemicals like water-soluble ammonium salts are pressure-impregnated, and when flame hits, they release a gas that impedes the spread of fire.

Engineered wood. Glulam - glue-laminated timber - is built from layers of dimensioned lumber bonded together, which lets designers create long-span beams and arches bigger and stronger than any single solid timber. And plywood is not just sheathing - it builds structural units: box beams, web beams, and stressed-skin panels.

Recap. A two-by-four is one and a half by three and a half. Headers carry the load to the jack studs. Wood's enemies are decay and insects - pressure treatment is the defense. Glulam for long spans. Plywood for built-up structural units. Five questions, five facts.`,
  },
  {
    key: "thermal",
    title: "Thermal & Moisture Protection",
    minutes: 2,
    script: `This is your Thermal and Moisture Protection lesson. Five questions about keeping heat, water, sound, and fire where they belong.

R-value first: it rates how well a material RESISTS heat flow. Higher R-value, better insulation. That is all it tells you - nothing about fire rating, nothing about weight. But insulation in a building envelope actually works three jobs: it holds temperature without wasting energy, it plays a part in controlling flame spread, and it limits sound transmission. The right material handles a combination of all three.

Moisture. Flashing is a water-management detail - it channels water away from vulnerable joints and penetrations so it sheds off the building instead of soaking in. It is not structural and it does not insulate. The vapor retarder goes on the WARM side of the wall - inside in cold climates, outside in hot ones - so moisture in warm air cannot diffuse into the wall and condense inside the assembly. Warm side. The exam will offer you the cold side; do not take it.

Roofing: single-ply membrane systems are less labor intensive, but they have NO redundancy against penetrations - one layer means one puncture is a leak. Rooftop equipment and foot traffic have to be weighed, and every joint and edge still needs careful sealing.

Fire classification, from the book: noncombustible materials are mineral based - concrete, gypsum plaster, glass, and natural rock like slate, sandstone, and marble. Asphalt, felt, and pitch are combustible. And one acoustics fact: those floor assemblies rated STC fifty for airborne sound still have an impact rating of not more than thirty - good at blocking voices, poor at blocking footsteps.

Recap. Higher R, better insulation - and insulation serves heat, fire, and sound. Flashing sheds water. Vapor retarder on the warm side. Single-ply roofs have no redundancy. Mineral-based means noncombustible. Five questions covered.`,
  },
  {
    key: "finishes",
    title: "Finishes",
    minutes: 2,
    script: `This is your Finishes lesson. Five questions about the trades that make the building look done.

Drywall. Type X has a core with additives that resist fire longer - that is why rated assemblies like garage walls and stairwells call for it. Moisture resistance is a DIFFERENT product - green board or cement board. Fire is X; do not let the exam blur the two. Joints get tape and successive coats of joint compound to bridge and conceal the seams so the wall reads as one flat plane - the mud is cosmetic and crack-resistant, not structural. The screws do the holding.

Plaster: three-coat work goes scratch coat, brown coat, finish coat. The brown coat - about three-eighths of an inch - carries a higher sand content, which means less cement and less shrinkage, and that is what minimizes cracking. Scratch, brown, finish. The exam likes the order and it likes the brown coat's job.

Know the boundary between interior and exterior finishing. Interior covers partitions, wall and floor finishes, stairs, ceilings, trim, and cabinets. Cladding, exterior glazing, and parking areas belong to exterior finishing.

Three facts straight from the book. Tile: the adhesive ridges should flatten and contact at least SIXTY percent of the back surface of the tile. Suspended acoustical ceiling panels are fire resistant, composed of glass fiberboard, ceramic, or mineral wool fiberboard. And THICK plastic laminates - not the thin countertop kind - are used for partitions, sliding doors, baseboards, window sills, and table tops.

Recap. Type X is fire, green board is moisture. Scratch, brown, finish - brown coat fights shrinkage. Sixty percent tile contact. Interior versus exterior scope. Five questions, no surprises.`,
  },
  {
    key: "masonry",
    title: "Masonry",
    minutes: 2,
    script: `This is your Masonry lesson. Four questions, and half of them come down to two memory devices.

First device: mortar types by strength, strongest to weakest - M, S, N, O. Remember MaSoN worK - the consonants give you the order. Type M is the strongest, used where high compressive strength or ground contact is needed.

Second device: the sixteen-inch module. A standard concrete masonry unit is called out by NOMINAL size - eight by eight by sixteen - but the actual block is three-eighths of an inch smaller each way: seven and five-eighths square by fifteen and five-eighths long. Add the three-eighths mortar joint and everything lays out on a clean sixteen by eight grid. That is why an eight-foot wall takes exactly twelve courses. Nominal minus three-eighths - that subtraction answers several different exam questions.

How block is made: a dry, NO-SLUMP concrete mix, pressed and vibrated into molds, then steam cured - one hundred twenty-two to one hundred seventy-six degrees for about sixteen hours. Lightweight aggregate swaps in to make lighter units.

Walls by job. An exterior masonry wall that carries no gravity load is a CURTAIN wall - but it still resists lateral wind and hands that load to the frame. The non-load-bearing wall INSIDE the building is a partition wall. Exterior curtain, interior partition.

Two field rules from the book: in cold weather, fresh mortar needs protection for at least forty-eight hours or the bond may be poor. And stone patterns - ashlar means cut stone with well-defined course lines; rubble means uncut or semi-cut stone with few or none.

Recap. MaSoN worK - M, S, N, O. Sixteen-inch module, actual is nominal minus three-eighths, twelve courses in eight feet. No-slump mix, steam cured. Curtain outside, partition inside. Forty-eight hours of protection. Four questions, fully covered.`,
  },
  {
    key: "doors",
    title: "Doors, Windows & Glazing",
    minutes: 2,
    script: `This is your Doors, Windows and Glazing lesson. Four questions about openings - where safety codes and building science meet.

Safety glazing first. Tempered glass is heat-treated so that when it breaks, it crumbles into small, relatively harmless pieces instead of long knife-like shards. That is exactly why code requires it in hazardous locations - doors, low windows, anywhere a person could fall into the glass.

Egress doors: when a door serves a higher occupant load, it must swing IN THE DIRECTION OF TRAVEL - out, with the crowd. A crowd pushing against an out-swinging door forces it open; against an in-swinging door, it jams it shut. The exam states it dryly, but that rule is written in old tragedies.

Curtain walls - and yes, they show up in this subject too. A curtain wall is a non-load-bearing exterior wall - it carries none of the building's gravity load - but it still catches WIND, and it must be designed to carry those lateral loads back to the structural frame. Non-load-bearing never means no loads at all.

Three book facts to bank. In a masonry cavity wall, the cavity must be at least two inches wide and kept free of mortar droppings, so moisture cannot bridge to the inner wythe. Low-E glass coatings are transparent to visible light and short-wave infrared but REFLECT long-wave infrared - that keeps heat in during winter and out during summer. And silicone sealants: excellent adhesion, cohesion, and exposure resistance, with one significant drawback - they are NOT paintable.

Recap. Tempered crumbles safely - hazardous locations. Egress swings with the crowd. Curtain walls still fight wind. Two-inch clean cavity. Low-E reflects long-wave infrared. Silicone will not take paint. Four questions, six facts, easy points.`,
  },
  {
    key: "electrical",
    title: "Electrical Systems",
    minutes: 2,
    script: `This is your Electrical Systems lesson - the shortest subject on the exam at three questions, and every one of them is winnable.

Safety devices first, because that is where the exam usually goes. A GFCI - ground fault circuit interrupter - compares the current going out with the current coming back, and when current leaks to ground - through a person, a damaged cord, wet conditions - it opens the circuit in a fraction of a second. It is a LIFE-SAFETY device, protecting people, not equipment. Lockout tagout is the other lifesaver: de-energize the equipment and physically LOCK the disconnect so nobody can re-energize it while someone is working. It is the core defense against unexpected startup and stored energy.

Theory, one formula deep. Ohm's law: current equals voltage divided by resistance. Twelve volts across three ohms is four amps. If the exam does electrical math, it is this math. DC flows one direction; AC - alternating current - reverses direction at regular intervals. A step-up transformer has MORE turns on the secondary coil than the primary - more turns out, more voltage out.

Wiring facts. AWG wire gauge runs backward: the LARGER the number, the SMALLER the wire. Number fourteen feeds lighting circuits; big number two feeds service panels. A single-family dwelling needs at least a ONE HUNDRED amp service entrance - bigger houses and electric heat push it to two hundred. And on a three-way switch, the BLACK or darker screw is the common terminal for the incoming power; brass or silver screws are travelers, green is ground.

Recap. GFCI protects people, trips on leaked current. Lockout tagout locks the disconnect. Amps equal volts over ohms. Bigger AWG number, smaller wire. One hundred amp minimum service. Dark screw is common. Three questions - go get all three.`,
  },
];

export function getLesson(key: string): ForemanLesson | null {
  return LESSONS.find((l) => l.key === key) ?? null;
}

// -----------------------------------------------------------
// END OF FILE - lib/foremanprep/lessons.ts (v1 - 12 drive-time
// lesson scripts)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
