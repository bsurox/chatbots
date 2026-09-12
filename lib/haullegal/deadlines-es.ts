// FILE: lib/haullegal/deadlines-es.ts
import type { HlFreq } from "@/lib/haullegal/deadlines";

// HaulLegal calendar content in Spanish (v1) - the 20 obligations
// of lib/haullegal/deadlines.ts v3 (title, summary, rule, cost,
// what happens if missed), the frequency words, the one-line
// detail under each computed due date (keyed by the due id), the
// two inspection row titles, and the "to see more, add" prompts
// (keyed by the missingKeys the calendar returns). The date math
// itself never changes language - it lives in deadlines.ts and the
// reminder job. Accents are \u escapes (ASCII file).

export type HlObligationEs = { title: string; summary: string; rule: string; cost: string; missed: string };

export const HL_OBLIGATIONS_ES: Record<string, HlObligationEs> = {
  mcs150: {
    title: "Actualizaci\u00f3n bienal (MCS-150)",
    summary: "Confirma o actualiza la informaci\u00f3n de tu empresa con FMCSA cada dos a\u00f1os, aunque nada haya cambiado. Los cambios de nombre, direcci\u00f3n o forma legal se presentan dentro de 30 d\u00edas, cuando ocurran.",
    rule: "El \u00faltimo d\u00edgito de tu n\u00famero USDOT fija el mes (1 = enero ... 9 = septiembre, 0 = octubre). Si el pen\u00faltimo d\u00edgito es impar, presentas en a\u00f1os impares; si es par, en a\u00f1os pares. Vence el \u00faltimo d\u00eda de ese mes.",
    cost: "$0",
    missed: "Desactivaci\u00f3n de tu n\u00famero USDOT y multas civiles de hasta $1,000 por d\u00eda, con tope de $10,000. (FMCSA paus\u00f3 las desactivaciones durante el arranque de Motus desde el 1 de junio de 2026 - la obligaci\u00f3n no desapareci\u00f3.)",
  },
  ucr: {
    title: "Registro UCR",
    summary: "Paga la cuota del Unified Carrier Registration para el a\u00f1o siguiente. 0-2 veh\u00edculos: $46 para 2026, $55 para 2027.",
    rule: "Reg\u00edstrate y paga antes del 1 de enero del a\u00f1o de registro. El portal de 2027 abre el 1 de octubre de 2026.",
    cost: "$46 (2026) / $55 (2027) para 0-2 veh\u00edculos",
    missed: "Infracciones en carretera y multas que fija cada estado; algunos estados retienen placas o registros hasta que se paga UCR.",
  },
  consortium: {
    title: "Membres\u00eda en el consorcio de drogas y alcohol",
    summary: "Mantente inscrito en un grupo de pruebas aleatorias todo el a\u00f1o. Las tasas aleatorias de 2026 son 50% para drogas y 10% para alcohol, repartidas durante el a\u00f1o, sin aviso.",
    rule: "Renueva la inscripci\u00f3n antes de que venza (la mayor\u00eda de los consorcios cobra cada a\u00f1o desde tu fecha de inscripci\u00f3n). Hazte cada prueba aleatoria para la que te seleccionen, el mismo d\u00eda.",
    cost: "Unos $66-$85 al a\u00f1o m\u00e1s las pruebas",
    missed: "Reprobaci\u00f3n autom\u00e1tica en la auditor\u00eda de nuevo transportista y riesgo de fuera de servicio en carretera.",
  },
  query: {
    title: "Consulta anual en el Clearinghouse (sobre ti mismo)",
    summary: "Corre al menos una consulta en el Clearinghouse sobre cada chofer con CDL que emplees - incluido t\u00fa - cada a\u00f1o. Una consulta limitada basta; si encuentra un registro, debes correr una consulta completa dentro de 24 horas.",
    rule: "Al menos una vez cada 12 meses desde la \u00faltima consulta.",
    cost: "$1.25 por consulta",
    missed: "Una infracci\u00f3n en la auditor\u00eda; las consultas son de lo primero que pide un auditor.",
  },
  medcard: {
    title: "Certificado m\u00e9dico DOT",
    summary: "Un examen f\u00edsico nuevo con un examinador del Registro Nacional antes de que venza tu certificado - nunca m\u00e1s de 24 meses entre uno y otro, antes si el examinador emiti\u00f3 una tarjeta m\u00e1s corta.",
    rule: "Antes de la fecha de vencimiento impresa en el certificado (m\u00e1ximo 24 meses desde el examen).",
    cost: "La cuota del examen var\u00eda seg\u00fan la cl\u00ednica",
    missed: "Tu estatus m\u00e9dico de CDL cambia a no certificado y el estado puede degradar la licencia; fuera de servicio en carretera.",
  },
  mvr: {
    title: "Revisi\u00f3n anual del historial de manejo (MVR)",
    summary: "Obt\u00e9n tu historial de manejo de cada estado que te haya dado licencia en el \u00faltimo a\u00f1o, rev\u00edsalo y guarda una nota fechada en tu archivo de calificaci\u00f3n.",
    rule: "Al menos una vez cada 12 meses.",
    cost: "Cuota estatal del MVR (unos pocos d\u00f3lares)",
    missed: "Una infracci\u00f3n del archivo de calificaci\u00f3n en la auditor\u00eda.",
  },
  inspection: {
    title: "Inspecci\u00f3n anual - tractor Y remolque",
    summary: "Cada veh\u00edculo comercial que operas, incluido el remolque, pasa una inspecci\u00f3n peri\u00f3dica de cada punto del Ap\u00e9ndice A al menos una vez cada 12 meses. La prueba viaja en el veh\u00edculo; el reporte se guarda 14 meses.",
    rule: "Dentro de los 12 meses de la inspecci\u00f3n anterior, por veh\u00edculo.",
    cost: "La cuota del taller var\u00eda",
    missed: "Riesgo de fuera de servicio en carretera y una infracci\u00f3n de mantenimiento en la auditor\u00eda.",
  },
  insurance: {
    title: "Renovaci\u00f3n del seguro de responsabilidad civil",
    summary: "Mant\u00e9n en vigor la p\u00f3liza m\u00ednima de responsabilidad civil de $750,000 sin interrupciones. El registro de tu aseguradora ante FMCSA solo sigue vigente mientras la p\u00f3liza lo est\u00e9.",
    rule: "Renueva antes de la fecha de vencimiento de la p\u00f3liza.",
    cost: "La prima var\u00eda",
    missed: "La aseguradora cancela el registro federal, FMCSA revoca la autoridad, y no est\u00e1s legal para transportar por contrato.",
  },
  hvut: {
    title: "Impuesto por uso de veh\u00edculos pesados (Formulario 2290)",
    summary: "El impuesto federal para camiones de 55,000 libras o m\u00e1s. El a\u00f1o fiscal va del 1 de julio al 30 de junio; un equipo de 80,000 libras paga $550.",
    rule: "Antes del 31 de agosto para un cami\u00f3n usado en julio. Un cami\u00f3n que sale a la carretera m\u00e1s tarde en el a\u00f1o vence el \u00faltimo d\u00eda del mes siguiente a su mes de primer uso.",
    cost: "$100 a las 55,000 libras hasta $550 a partir de 75,000 libras",
    missed: "Multas e intereses del IRS, y sin Schedule 1 sellado para tus placas.",
  },
  "ifta-q": {
    title: "Declaraci\u00f3n trimestral IFTA de impuesto al combustible",
    summary: "Reporta millas y combustible por estado del trimestre. Obligatoria incluso en un trimestre con cero millas.",
    rule: "\u00daltimo d\u00eda del mes siguiente al cierre del trimestre: 30 de abril, 31 de julio, 31 de octubre y 31 de enero (el siguiente d\u00eda h\u00e1bil si cae en fin de semana o feriado).",
    cost: "Impuesto a pagar o a favor",
    missed: "Multa e intereses que fija tu estado base; las faltas repetidas revocan la licencia.",
  },
  "ifta-renew": {
    title: "Renovaci\u00f3n de licencia y calcoman\u00edas IFTA",
    summary: "La licencia vence el 31 de diciembre. Renueva y pon las dos calcoman\u00edas del a\u00f1o nuevo en cada cami\u00f3n. Si la renovaci\u00f3n est\u00e1 presentada, enero y febrero son un periodo de gracia para exhibirlas.",
    rule: "Antes del 31 de diciembre.",
    cost: "Cuota del estado base",
    missed: "Circular sin licencia o calcoman\u00edas vigentes es una infracci\u00f3n en cada estado miembro.",
  },
  irp: {
    title: "Renovaci\u00f3n del registro IRP (placas prorrateadas)",
    summary: "Renueva las placas prorrateadas y la cab card con tu estado base. Vas a necesitar un Schedule 1 sellado vigente del Formulario 2290.",
    rule: "En el mes de renovaci\u00f3n que tu estado base asign\u00f3 al emitir las placas.",
    cost: "Cuotas seg\u00fan la distancia",
    missed: "Placas vencidas: el cami\u00f3n no est\u00e1 registrado para circular interestatal.",
  },
  kyu: {
    title: "Declaraci\u00f3n de peso-distancia KYU de Kentucky",
    summary: "Los camiones con un peso combinado de licencia de m\u00e1s de 59,999 libras que circulan por Kentucky pagan $0.0285 por milla y declaran cada trimestre - incluidas las declaraciones en cero millas.",
    rule: "\u00daltimo d\u00eda del mes siguiente al trimestre: 30 de abril, 31 de julio, 31 de octubre y 31 de enero.",
    cost: "$0.0285 por milla en Kentucky",
    missed: "Multa, intereses y una cuota de $500 por revocaci\u00f3n para recuperar la licencia KYU.",
  },
  nm: {
    title: "Declaraci\u00f3n y permiso de peso-distancia de Nuevo M\u00e9xico",
    summary: "Los camiones de m\u00e1s de 26,000 libras necesitan un permiso de peso-distancia de Nuevo M\u00e9xico por cada veh\u00edculo, renovado cada a\u00f1o, y declaran cada trimestre incluso sin millas en Nuevo M\u00e9xico.",
    rule: "Declaraciones el 30 de abril, 31 de julio, 31 de octubre y 31 de enero; el permiso electr\u00f3nico se renueva cada a\u00f1o.",
    cost: "Impuesto por milla seg\u00fan la clase de peso",
    missed: "Multa e intereses; circular sin el permiso es una infracci\u00f3n.",
  },
  ny: {
    title: "Declaraci\u00f3n del impuesto por uso de carreteras de Nueva York",
    summary: "Los camiones de m\u00e1s de 18,000 libras necesitan un certificado y calcoman\u00eda HUT de Nueva York ($1.50 por veh\u00edculo) y presentan declaraciones - trimestrales para la mayor\u00eda de los transportistas nuevos - aunque no deban impuesto.",
    rule: "\u00daltimo d\u00eda del mes siguiente al periodo (trimestral, a menos que el estado te pase a anual o mensual seg\u00fan el impuesto del a\u00f1o anterior).",
    cost: "Impuesto por milla; certificado $1.50 por veh\u00edculo",
    missed: "Las declaraciones tard\u00edas cuestan 10% m\u00e1s 1% al mes (m\u00e1ximo 30%); circular sin el certificado es una multa de $500-$2,000 la primera vez.",
  },
  or: {
    title: "Reporte del impuesto peso-milla de Oregon",
    summary: "Los camiones de m\u00e1s de 26,000 libras que circulan por Oregon pagan por milla ($0.2512 por milla a 78,001-80,000 libras) y reportan CADA MES a menos que el estado apruebe la declaraci\u00f3n trimestral. Se requiere una fianza para inscribirse.",
    rule: "Con matasellos a m\u00e1s tardar el \u00faltimo d\u00eda del mes por las operaciones del mes anterior.",
    cost: "$0.2512 por milla en Oregon a 78,001-80,000 libras",
    missed: "Multa del 10% por retraso m\u00e1s intereses; la cuenta puede suspenderse.",
  },
  ct: {
    title: "Declaraci\u00f3n del Highway Use Fee de Connecticut",
    summary: "Los camiones de 26,000 libras o m\u00e1s (Clase 8-13 de la FHWA) que circulan por las carreteras de Connecticut pagan una cuota por milla - 2.5 centavos por milla a 26,000-28,000 libras, subiendo hasta 17.5 centavos a partir de 80,001 libras - y declaran cada trimestre por myconneCT, incluidos los trimestres sin millas en Connecticut.",
    rule: "\u00daltimo d\u00eda del mes siguiente al trimestre: 30 de abril, 31 de julio, 31 de octubre y 31 de enero (trimestral desde el periodo de octubre de 2023; reg\u00edstrate en myconneCT antes de la primera milla en Connecticut).",
    cost: "De 2.5 a 17.5 centavos por milla en Connecticut, seg\u00fan el peso",
    missed: "10% de la cuota debida o $50, lo que sea mayor, m\u00e1s intereses - y la declaraci\u00f3n es obligatoria incluso en un trimestre sin millas en Connecticut.",
  },
  audit: {
    title: "Auditor\u00eda de seguridad de nuevo transportista",
    summary: "FMCSA te vigila durante 18 meses y te audita dentro de los primeros 12. Puede llegar con apenas 3 meses de operaci\u00f3n.",
    rule: "Dentro de los 12 meses de que tu autoridad quede activa; ten listos desde el mes uno el programa de drogas, el archivo del chofer, las bit\u00e1coras, el mantenimiento y los registros del seguro.",
    cost: "$0",
    missed: "Si repruebas la auditor\u00eda tienes 60 d\u00edas para demostrar las correcciones o el registro se revoca.",
  },
  eld: {
    title: "Mantenimiento de la bit\u00e1cora (ELD)",
    summary: "Guarda 6 meses de bit\u00e1coras y documentos de respaldo; lleva los 7 d\u00edas anteriores en el cami\u00f3n; un ELD descompuesto debe repararse o reemplazarse dentro de 8 d\u00edas.",
    rule: "Cada d\u00eda que manejes.",
    cost: "Suscripci\u00f3n del ELD",
    missed: "Las infracciones de horas de servicio est\u00e1n entre las \u00f3rdenes de fuera de servicio m\u00e1s comunes en carretera, y no tener registros de horas es reprobaci\u00f3n autom\u00e1tica en la auditor\u00eda.",
  },
  records: {
    title: "Registros de mantenimiento y reportes de inspecci\u00f3n diaria",
    summary: "Para cualquier veh\u00edculo que controles 30 d\u00edas o m\u00e1s, guarda un programa de mantenimiento y un registro de cada inspecci\u00f3n y reparaci\u00f3n (se conserva 1 a\u00f1o, y 6 meses despu\u00e9s de que el veh\u00edculo deje de estar contigo). Escribe un reporte de inspecci\u00f3n del chofer cada vez que aparezca un defecto; gu\u00e1rdalo 3 meses.",
    rule: "Continuo.",
    cost: "$0",
    missed: "Infracciones de mantenimiento en la auditor\u00eda y en carretera.",
  },
};

export const HL_FREQ_ES: Record<HlFreq, string> = {
  once: "una vez",
  monthly: "mensual",
  quarterly: "trimestral",
  annual: "anual",
  biennial: "cada dos a\u00f1os",
  "every-24-months": "cada 24 meses",
  ongoing: "permanente",
};

export const HL_DUE_DETAILS_ES: Record<string, string> = {
  ucr: "Reg\u00edstrate para el a\u00f1o siguiente en ucr.gov antes del 1 de enero.",
  hvut: "Formulario 2290 del IRS. Guarda el Schedule 1 sellado para tus placas.",
  "ifta-q": "Pres\u00e9ntala aunque el trimestre sea de cero millas.",
  "ifta-renew": "Licencia nueva y dos calcoman\u00edas por cami\u00f3n para el a\u00f1o que viene.",
  kyu: "Las declaraciones en cero millas siguen siendo obligatorias.",
  nm: "Declaraci\u00f3n obligatoria aunque no haya millas en Nuevo M\u00e9xico; el permiso se renueva cada a\u00f1o.",
  ny: "Pres\u00e9ntala aunque no debas impuesto.",
  or: "Reporte mensual de las millas del mes pasado en Oregon.",
  ct: "Pres\u00e9ntala por myconneCT aunque el trimestre no tenga millas en Connecticut.",
  medcard: "Fecha m\u00e1xima - usa el vencimiento impreso en tu tarjeta si es antes.",
  mvr: "Obtenlo, rev\u00edsalo y gu\u00e1rdalo con fecha en tu archivo de calificaci\u00f3n.",
  query: "$1.25 en el Clearinghouse. Una consulta limitada basta.",
  consortium: "Renueva antes de que venza - no hay periodo de gracia en un grupo aleatorio.",
  "inspection-tractor": "Inspecci\u00f3n completa del Ap\u00e9ndice A; la prueba se queda en el cami\u00f3n.",
  "inspection-trailer": "El remolque es su propio veh\u00edculo comercial - necesita su propia inspecci\u00f3n.",
  insurance: "Sin interrupciones, nunca - un lapso cancela tu registro federal.",
  irp: "Lleva el Schedule 1 sellado vigente.",
  audit: "Fecha l\u00edmite de la auditor\u00eda de nuevo transportista - puede llegar desde el mes 3.",
};

export const HL_DUE_TITLES_ES: Record<string, string> = {
  "inspection-tractor": "Inspecci\u00f3n anual - tractor",
  "inspection-trailer": "Inspecci\u00f3n anual - remolque",
};

export const HL_MISSING_ES: Record<string, string> = {
  usdot: "N\u00famero USDOT (fija tu mes de actualizaci\u00f3n bienal)",
  medCardIssued: "Fecha de tu \u00faltimo examen f\u00edsico DOT (tarjeta m\u00e9dica)",
  lastMvr: "Fecha de tu \u00faltima revisi\u00f3n del historial de manejo (MVR)",
  lastQuery: "Fecha de tu \u00faltima consulta en el Clearinghouse",
  consortiumEnrolled: "Fecha en que te inscribiste en tu consorcio de drogas y alcohol",
  tractorInspected: "Fecha de la \u00faltima inspecci\u00f3n anual del tractor",
  trailerInspected: "Fecha de la \u00faltima inspecci\u00f3n anual del remolque",
  insuranceRenews: "Fecha de renovaci\u00f3n de tu p\u00f3liza de seguro",
  irpRenews: "Fecha de renovaci\u00f3n de tus placas IRP",
  authorityActive: "La fecha en que tu autoridad qued\u00f3 activa (arranca el reloj de nuevo transportista)",
};

// -----------------------------------------------------------
// END OF FILE - lib/haullegal/deadlines-es.ts (v1 - Spanish for
// the 20 obligations, due details and form prompts)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
