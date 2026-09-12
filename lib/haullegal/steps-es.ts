// FILE: lib/haullegal/steps-es.ts
import type { HlPhase } from "@/lib/haullegal/steps";

// HaulLegal walkthrough content in Spanish (v1) - a translation of
// every step and phase in lib/haullegal/steps.ts, keyed by the same
// step ids so the walkthrough page can overlay it on the English
// record when the owner has flipped the language switch. Only the
// words are here: fees, links, citations, order and the free/paid
// split stay in steps.ts, the single source of truth. Neutral Latin
// American Spanish, "tu" register; program names drivers know in
// English stay in English. Accents are \u escapes (ASCII file).
// Verified against the English of steps.ts v2, September 2026.

export type HlStepEs = { title: string; summary: string; fee: string; where: string; time: string; gotchas: string[] };

export const HL_PHASES_ES: Record<HlPhase, { title: string; blurb: string }> = {
  before: {
    title: "Antes de solicitar",
    blurb: "Primero deja listos el negocio, el n\u00famero de identificaci\u00f3n fiscal y la cotizaci\u00f3n del seguro. La solicitud pide todo eso, y un nombre que no coincide es la raz\u00f3n n\u00famero uno por la que se atora la autoridad.",
  },
  federal: {
    title: "Registro federal (Motus)",
    blurb: "El n\u00famero USDOT, la autoridad de operaci\u00f3n, los dos tr\u00e1mites que otras empresas presentan por ti, y el d\u00eda en que quedas ACTIVO.",
  },
  state: {
    title: "Impuestos, placas y combustible",
    blurb: "El impuesto de camiones pesados, las placas IRP, la licencia de impuesto al combustible, y los cinco estados que cobran por milla.",
  },
  operate: {
    title: "Legal en la carretera",
    blurb: "Pruebas de drogas, la bit\u00e1cora electr\u00f3nica, tu archivo de documentos, la auditor\u00eda de seguridad en tu primer a\u00f1o, y c\u00f3mo cobrar.",
  },
};

export const HL_STEPS_ES: Record<string, HlStepEs> = {
  entity: {
    title: "Forma el negocio y fija el nombre legal exacto",
    summary: "Decide si vas a operar como persona f\u00edsica (sole proprietor) o vas a formar una LLC, y luego usa ese nombre legal exacto - escrito igual - en cada formulario que sigue: la solicitud de FMCSA, tu p\u00f3liza de seguro, el tr\u00e1mite del agente de proceso y las placas de tu estado.",
    fee: "Cuota de registro estatal (var\u00eda por estado); una persona f\u00edsica paga $0",
    where: "El sitio del Secretario de Estado de tu estado, o un servicio de formaci\u00f3n de empresas",
    time: "Del mismo d\u00eda a unas semanas, seg\u00fan el estado",
    gotchas: [
      "FMCSA lo dice claro: cualquier diferencia en el nombre de la empresa entre tu solicitud y tus tr\u00e1mites retrasa la aprobaci\u00f3n de tu autoridad. Elige el nombre una vez y c\u00f3pialo igual en todas partes.",
      "FMCSA no exige una LLC. Muchos due\u00f1os-operadores empiezan como persona f\u00edsica y forman la LLC despu\u00e9s - consulta con un profesional de impuestos cu\u00e1l te conviene.",
    ],
  },
  ein: {
    title: "Obt\u00e9n tu EIN del IRS (gratis, en l\u00ednea, en minutos)",
    summary: "El Employer Identification Number (EIN) es el n\u00famero fiscal de tu negocio. El IRS lo emite gratis en su sitio web en unos diez minutos. Lo vas a necesitar para el impuesto de veh\u00edculos pesados (el Formulario 2290 no acepta un n\u00famero de Seguro Social), para tu cuenta bancaria y para casi todos los tr\u00e1mites de abajo.",
    fee: "$0 - el IRS nunca cobra por un EIN",
    where: "Solicitud de EIN en l\u00ednea en IRS.gov",
    time: "Unos 10 minutos en l\u00ednea",
    gotchas: [
      "Nunca pagues a un sitio web por un EIN. Si una p\u00e1gina te pide una tarjeta para 'procesarlo', es un intermediario cobrando por un formulario gratuito.",
      "Solic\u00edtalo a nombre del negocio (la LLC o tu nombre como persona f\u00edsica), no como una empresa nueva cualquiera - el nombre del EIN debe coincidir con tu nombre legal.",
    ],
  },
  wizard: {
    title: "Confirma lo que realmente necesitas con el asistente de FMCSA",
    summary: "Interestatal, por contrato (for-hire), transportando carga ajena en un cami\u00f3n de m\u00e1s de 10,000 libras significa dos cosas: un n\u00famero USDOT (gratis) y autoridad de operaci\u00f3n ($300). Si solo vas a transportar dentro de un estado, puede que necesites solo el n\u00famero USDOT m\u00e1s las reglas de tu estado - y la cuota de $300 de la autoridad no es reembolsable si solicitas lo que no es.",
    fee: "$0",
    where: "Asistente de registro de FMCSA (USDOT wizard)",
    time: "5 minutos",
    gotchas: [
      "La cuota de $300 no es reembolsable, y la propia p\u00e1gina de FMCSA advierte que solicites el tipo de autoridad correcto. Corre el asistente antes de pagar nada.",
      "El n\u00famero USDOT es obligatorio para veh\u00edculos interestatales con capacidad de 10,001 libras o m\u00e1s - cuenta la capacidad del cami\u00f3n, no lo que llevas cargado.",
    ],
  },
  "insurance-quote": {
    title: "Deja listo el seguro antes de presentar la solicitud",
    summary: "La ley federal fija la cobertura m\u00ednima de responsabilidad civil para un transportista de carga por contrato en $750,000 (carga general, camiones de m\u00e1s de 10,000 libras). Tu aseguradora - no t\u00fa - presenta la prueba ante FMCSA por v\u00eda electr\u00f3nica, y tiene 20 d\u00edas desde que tu solicitud se publica para hacerlo. Pide cotizaciones ahora para que la p\u00f3liza est\u00e9 lista en cuanto tu solicitud se publique.",
    fee: "La prima var\u00eda mucho (autoridad nueva, tu historial de manejo y tu cami\u00f3n cuentan)",
    where: "Un agente de seguros para camiones comerciales",
    time: "Unos d\u00edas para cotizar; el tr\u00e1mite en s\u00ed es del mismo d\u00eda una vez emitida la p\u00f3liza",
    gotchas: [
      "El m\u00ednimo es $750,000 para carga no peligrosa. Transportar petr\u00f3leo o ciertos materiales peligrosos lo sube a $1,000,000, y las clases m\u00e1s peligrosas a $5,000,000.",
      "FMCSA no exige seguro de carga (cargo) para carga general, pero los brokers y los embarcadores casi siempre lo piden (normalmente $100,000). Cu\u00e9ntalo en tu presupuesto.",
      "La p\u00f3liza debe emitirse al nombre legal exacto de tu solicitud, o el tr\u00e1mite no coincidir\u00e1 y tu autoridad se atorar\u00e1.",
    ],
  },
  login: {
    title: "Crea una cuenta de Login.gov e ingresa a Motus",
    summary: "Motus es el sistema de registro de FMCSA - reemplaz\u00f3 al sistema anterior en mayo de 2026, y el anterior est\u00e1 apagado para siempre. Entras con una cuenta de Login.gov (con verificaci\u00f3n en dos pasos obligatoria), aceptas las reglas de conducta y armas tu perfil de usuario.",
    fee: "$0",
    where: "motus.dot.gov, a trav\u00e9s de Login.gov",
    time: "15 minutos",
    gotchas: [
      "La gu\u00eda r\u00e1pida de FMCSA dice que no uses el correo p\u00fablico de tu negocio para el perfil de usuario de Motus - usa una direcci\u00f3n privada que controles.",
      "Si alguna vez tuviste una cuenta del FMCSA Portal, usa el mismo correo para que tu historial quede enlazado.",
    ],
  },
  identity: {
    title: "Verifica tu identidad (t\u00fa, en persona, con tu tel\u00e9fono)",
    summary: "Cada solicitante nuevo demuestra qui\u00e9n es a trav\u00e9s del socio de identidad de FMCSA, IDEMIA: escaneas un c\u00f3digo QR con un tel\u00e9fono o tableta, fotograf\u00edas una identificaci\u00f3n oficial vigente y te tomas una selfie. Unos 800,000 transportistas existentes est\u00e1n pasando por la misma verificaci\u00f3n la primera vez que entran. Cualquiera que solicite en tu nombre debe pasar la misma verificaci\u00f3n - y t\u00fa, como funcionario de la empresa, sigues firmando las certificaciones finales personalmente.",
    fee: "FMCSA no indica ninguna cuota",
    where: "Dentro de Motus, en tu tel\u00e9fono (existen centros de inscripci\u00f3n presencial si la v\u00eda del tel\u00e9fono falla)",
    time: "Minutos; intentos ilimitados",
    gotchas: [
      "Solo se aceptan identificaciones de Estados Unidos, M\u00e9xico y Canad\u00e1; de M\u00e9xico, \u00fanicamente el pasaporte.",
      "Por esto los servicios de 'nosotros lo hacemos todo por ti' ya no pueden hacerlo todo. La persona que sostiene el tel\u00e9fono es la persona de la identificaci\u00f3n.",
      "\u00bfProblemas? La l\u00ednea de identidad de FMCSA es 1-833-832-5530.",
    ],
  },
  usdot: {
    title: "Solicita tu n\u00famero USDOT (gratis)",
    summary: "Desde tu perfil de Motus, inicia un registro nuevo y crea la cuenta de la empresa. El n\u00famero USDOT es la identificaci\u00f3n federal del negocio de transporte en s\u00ed. No tiene costo, y cada n\u00famero USDOT tiene exactamente un Funcionario de la Empresa (Company Official) designado - el due\u00f1o, un socio o un directivo autorizado. Ese eres t\u00fa.",
    fee: "$0 - el n\u00famero USDOT no tiene costo",
    where: "Motus - Iniciar un registro nuevo (Start a New Registration)",
    time: "30-60 minutos de preguntas",
    gotchas: [
      "Motus asigna los n\u00fameros USDOT nuevos al azar, as\u00ed que tu n\u00famero no se ver\u00e1 como una secuencia - es normal.",
      "El nombre de la empresa, la direcci\u00f3n y el tipo de entidad que escribas deben coincidir exactamente con tu documentaci\u00f3n del EIN y con tu seguro.",
    ],
  },
  authority: {
    title: "Solicita la autoridad de operaci\u00f3n y paga los $300",
    summary: "La autoridad de operaci\u00f3n es el permiso federal para transportar carga ajena por dinero cruzando l\u00edneas estatales. Para un camionero de carga general el tipo es 'Motor Carrier of Property (except household goods)'. La cuota es de $300 por tipo de autoridad, se paga por Pay.gov dentro de la solicitud, y no es reembolsable. Despu\u00e9s FMCSA publica tu solicitud en su Registro y cualquiera tiene 10 d\u00edas para objetarla.",
    fee: "$300 por tipo de autoridad, no reembolsable",
    where: "Motus, con pago por Pay.gov",
    time: "Seg\u00fan FMCSA: 20-25 d\u00edas h\u00e1biles es lo t\u00edpico; las solicitudes seleccionadas para revisi\u00f3n pueden sumar 2-8 semanas",
    gotchas: [
      "Solicita un solo tipo de autoridad a menos que de verdad necesites m\u00e1s - cada tipo extra son otros $300 no reembolsables.",
      "No puedes llevar una carga por contrato hasta que la autoridad est\u00e9 ACTIVA. Solicitada no es activa.",
      "Desde el 30 de septiembre de 2025 FMCSA no acepta pagos en papel - todo pasa por Pay.gov.",
      "Motus muestra la raz\u00f3n detr\u00e1s de un estado Pendiente (revisi\u00f3n de FMCSA, tr\u00e1mite del agente de proceso, o tr\u00e1mite de responsabilidad financiera). L\u00e9elo - te dice a qui\u00e9n le toca el siguiente paso.",
    ],
  },
  "insurance-file": {
    title: "Tu aseguradora presenta el BMC-91 o BMC-91X",
    summary: "En cuanto tu solicitud se publique, llama a tu agente y dale el n\u00famero de expediente (docket). La aseguradora presenta el formulario de prueba de cobertura (BMC-91 o BMC-91X) por v\u00eda electr\u00f3nica en Motus. FMCSA no otorga la autoridad hasta que ese tr\u00e1mite est\u00e9 registrado, y el plazo es de 20 d\u00edas desde la publicaci\u00f3n.",
    fee: "$0 para FMCSA (tu prima va a la aseguradora)",
    where: "Lo presenta tu aseguradora dentro de Motus",
    time: "Normalmente 1-3 d\u00edas h\u00e1biles despu\u00e9s de que lo pidas",
    gotchas: [
      "Si pasan los 20 d\u00edas, FMCSA env\u00eda un aviso de desestimaci\u00f3n; entonces tienes 60 d\u00edas para corregirlo o la solicitud se desestima y los $300 se pierden.",
      "Tu estado dir\u00e1 'Pending - Financial Responsibility Filings' hasta que esto quede registrado.",
    ],
  },
  boc3: {
    title: "Un agente de proceso presenta tu BOC-3",
    summary: "El formulario BOC-3 designa a una empresa que puede recibir documentos legales por ti en cada estado. Solo un agente de proceso puede presentarlo, y un agente 'blanket' cubre los 48 estados contiguos m\u00e1s DC en un solo tr\u00e1mite. Debe estar registrado dentro de los 20 d\u00edas de la publicaci\u00f3n, igual que el seguro. El precio al p\u00fablico de los propios agentes anda entre $35 y $75, por una sola vez.",
    fee: "Unos $35-$75 por una sola vez, pagados a la empresa del agente de proceso (FMCSA no cobra)",
    where: "Cualquier agente de proceso 'blanket' de la lista de FMCSA",
    time: "De minutos a horas despu\u00e9s de que lo pidas",
    gotchas: [
      "No puedes presentarlo t\u00fa mismo - la regla dice que solo un agente de proceso puede. Elige uno de la propia lista de agentes blanket de FMCSA, no de un anuncio.",
      "Tu estado dir\u00e1 'Pending - Process Agent (Form BOC-3) Filings' hasta que el agente lo env\u00ede.",
    ],
  },
  active: {
    title: "Espera el estado ACTIVO - entonces ya puedes transportar por contrato",
    summary: "Cuando cierra la ventana de 10 d\u00edas para objeciones y los dos tr\u00e1mites est\u00e1n registrados, FMCSA otorga la autoridad emitiendo tu certificado y el estado cambia a activo. Rev\u00edsalo en Motus o en la consulta SAFER de FMCSA. Imprime el certificado y guarda una copia en el cami\u00f3n.",
    fee: "$0",
    where: "P\u00e1gina de estado de Motus; consulta de empresa en SAFER de FMCSA",
    time: "Seg\u00fan la decisi\u00f3n de FMCSA; la mayor\u00eda de los transportistas nuevos lo ve dentro de la ventana de 20-25 d\u00edas h\u00e1biles",
    gotchas: [
      "No aceptes una carga pagada con un 'deber\u00eda estar activo para el viernes'. Los brokers revisan SAFER antes de asignar carga.",
      "Un n\u00famero de expediente reci\u00e9n emitido lleva un sufijo; C significa autoridad de transportista de carga.",
    ],
  },
  ucr: {
    title: "Reg\u00edstrate en UCR (anual, $46 por 1-2 camiones)",
    summary: "El Unified Carrier Registration (UCR) es una cuota anual que paga todo transportista interestatal por contrato, seg\u00fan el tama\u00f1o de su flota. Para 0-2 veh\u00edculos son $46 para el a\u00f1o de registro 2026 y $55 para 2027; la ventana de 2027 abre el 1 de octubre de 2026, y debes estar registrado antes del 1 de enero del a\u00f1o que est\u00e1s pagando.",
    fee: "$46 (2026) / $55 (2027) por 0-2 veh\u00edculos, una vez al a\u00f1o",
    where: "ucr.gov (el sistema nacional de registro oficial)",
    time: "10 minutos",
    gotchas: [
      "Reg\u00edstrate solo en ucr.gov o a trav\u00e9s de tu estado - los sitios imitadores cobran 'cuotas de servicio' encima de los $46.",
      "Algunos estados (por ejemplo Arizona, Florida, Nevada, Oregon y Nueva Jersey) no participan en UCR; los transportistas con base ah\u00ed igual se registran, a trav\u00e9s de un estado participante.",
    ],
  },
  drug: {
    title: "\u00danete a un consorcio de pruebas de drogas y alcohol - y hazte la prueba primero",
    summary: "Un chofer con CDL que trabaja por cuenta propia es el empleador y el conductor a la vez, y las reglas aplican en los dos sentidos. Debes estar en un grupo de pruebas aleatorias administrado por un consorcio (no puedes administrar tu propio grupo de una sola persona), y debes tener un resultado negativo de la prueba de drogas previa al empleo antes de tu primer trabajo sensible a la seguridad - s\u00ed, hecha a ti mismo. Las tasas aleatorias de 2026 son 50% para drogas y 10% para alcohol.",
    fee: "Unos $66-$85 al a\u00f1o por el consorcio, m\u00e1s las pruebas en s\u00ed",
    where: "Un consorcio / administrador externo (C/TPA) del DOT",
    time: "Inscripci\u00f3n el mismo d\u00eda; la prueba previa al empleo requiere una visita al laboratorio",
    gotchas: [
      "No tener programa de pruebas y no estar en un grupo aleatorio son dos de las 16 causas de reprobaci\u00f3n autom\u00e1tica en la auditor\u00eda de seguridad de nuevo transportista. Esto no es papeleo opcional.",
      "Guarda el certificado del consorcio y tu resultado negativo en tu archivo - el auditor pide los dos.",
    ],
  },
  clearinghouse: {
    title: "Reg\u00edstrate en el Clearinghouse y cons\u00faltate a ti mismo",
    summary: "El Drug and Alcohol Clearinghouse de FMCSA es la base de datos federal de violaciones de pruebas de drogas de choferes con CDL. Como due\u00f1o-operador te registras como empleador y como chofer, designas a tu consorcio como tu C/TPA (no puedes hacer nada hasta que lo hagas), y luego corres una consulta completa sobre ti mismo antes de tu primera carga y al menos una consulta cada a\u00f1o despu\u00e9s. Cada consulta cuesta $1.25 y nunca caducan.",
    fee: "$1.25 por consulta",
    where: "clearinghouse.fmcsa.dot.gov",
    time: "30 minutos",
    gotchas: [
      "Desde el 27 de abril de 2026 el propio Clearinghouse exige verificaci\u00f3n de identidad para ciertos tipos de cuenta - otra raz\u00f3n para hacerlo t\u00fa mismo.",
      "Tu consorcio no puede comprar las consultas por ti; las compra la cuenta de empleador.",
    ],
  },
  hvut: {
    title: "Presenta el Formulario 2290 del IRS (impuesto por uso de veh\u00edculos pesados)",
    summary: "Todo cami\u00f3n con un peso bruto gravable de 55,000 libras o m\u00e1s debe el impuesto federal por uso de veh\u00edculos pesados cada a\u00f1o. El a\u00f1o fiscal va del 1 de julio al 30 de junio. Si usas el cami\u00f3n por primera vez en julio, pres\u00e9ntalo antes del 31 de agosto; si no, antes del \u00faltimo d\u00eda del mes siguiente al mes en que lo pusiste en la carretera por primera vez. A partir de 75,000 libras el impuesto es de $550. El Schedule 1 sellado que devuelve el IRS es lo que tu estado necesita antes de darle placas al cami\u00f3n.",
    fee: "$100 a las 55,000 libras, subiendo hasta $550 a partir de 75,000 libras, por a\u00f1o",
    where: "IRS - por e-file a trav\u00e9s de un proveedor aprobado, o en papel",
    time: "Minutos en l\u00ednea; el Schedule 1 por e-file regresa r\u00e1pido, en papel tarda semanas",
    gotchas: [
      "Necesitas un EIN - el IRS no acepta un n\u00famero de Seguro Social en el Formulario 2290.",
      "El plazo depende del mes en que usaste el cami\u00f3n por primera vez, no de cu\u00e1ndo lo registraste.",
      "Guarda el Schedule 1 sellado; la oficina de IRP te lo va a pedir.",
    ],
  },
  irp: {
    title: "Obt\u00e9n placas IRP (prorrateadas) de tu estado base",
    summary: "Si tu peso combinado pasa de 26,000 libras y operas en dos o m\u00e1s estados, registras el cami\u00f3n una sola vez con tu estado base bajo el International Registration Plan (IRP) y recibes placas v\u00e1lidas en todos los estados. Las cuotas se reparten entre los estados seg\u00fan la proporci\u00f3n de millas que corres en cada uno. Lleva tu Schedule 1 sellado, prueba de seguro y los documentos de tu negocio.",
    fee: "Var\u00eda por estado y seg\u00fan tu reparto de millas",
    where: "La oficina de IRP de tu estado base (normalmente el DMV o la divisi\u00f3n de transportistas)",
    time: "Del mismo d\u00eda a unas semanas, seg\u00fan el estado",
    gotchas: [
      "Debes renovar cada a\u00f1o en el mes que te asigne tu estado base - es una de las fechas que sigue el calendario Stay Legal.",
      "La mayor\u00eda de los estados exige un lugar de negocio establecido en el estado antes de aceptarte como base.",
    ],
  },
  ifta: {
    title: "Obt\u00e9n tu licencia y calcoman\u00edas IFTA",
    summary: "El International Fuel Tax Agreement (IFTA) te deja presentar una sola declaraci\u00f3n de impuesto al combustible por todos los estados en los que manejaste, en vez de una por estado. Tu estado base emite la licencia y dos calcoman\u00edas por cami\u00f3n. Despu\u00e9s, cada trimestre, presentas una declaraci\u00f3n - vence el 30 de abril, 31 de julio, 31 de octubre y 31 de enero - incluso en un trimestre con cero millas. La licencia vence el 31 de diciembre y se renueva cada a\u00f1o.",
    fee: "Cuota del estado base (a menudo peque\u00f1a o $0); la declaraci\u00f3n trimestral liquida el impuesto a pagar o a favor",
    where: "La oficina de IFTA de tu estado base (muchas veces la misma oficina que IRP)",
    time: "Del mismo d\u00eda a unas semanas",
    gotchas: [
      "Presenta la declaraci\u00f3n trimestral aunque no te hayas movido - 'las declaraciones son obligatorias aunque no haya habido operaciones'. Una declaraci\u00f3n en cero que no presentas sigue siendo una declaraci\u00f3n faltante.",
      "Guarda cada recibo de combustible y tus millas por estado; la declaraci\u00f3n se arma con ellos.",
    ],
  },
  "state-extra": {
    title: "Cinco estados cobran por milla - reg\u00edstrate antes de entrar",
    summary: "Kentucky (KYU, camiones de m\u00e1s de 59,999 libras, $0.0285 por milla, trimestral), Nuevo M\u00e9xico (permiso de peso-distancia para camiones de m\u00e1s de 26,000 libras, se renueva cada a\u00f1o, declaraciones trimestrales), Nueva York (certificado y calcoman\u00eda del impuesto por uso de carreteras HUT para camiones de m\u00e1s de 18,000 libras, declaraciones normalmente trimestrales), Oregon (impuesto peso-milla arriba de 26,000 libras, reportes mensuales, fianza obligatoria) y Connecticut (Highway Use Fee para camiones de 26,000 libras o m\u00e1s, de 2.5 a 17.5 centavos por milla seg\u00fan el peso, trimestral por myconneCT) exigen cada uno su propio registro y sus propias declaraciones - y los cinco quieren una declaraci\u00f3n incluso por un periodo sin millas.",
    fee: "Cuotas de registro peque\u00f1as m\u00e1s el impuesto por milla cuando circulas ah\u00ed",
    where: "El sitio de transportistas o de impuestos de cada estado",
    time: "Minutos cada uno, en l\u00ednea",
    gotchas: [
      "Kentucky revoca la licencia KYU por declaraciones en cero que no se presentan, y cobra $500 por reinstalarla.",
      "Nueva York multa de $500 a $2,000 la primera vez que circulas sin el certificado HUT; un certificado de viaje de $25 cubre un viaje suelto (m\u00e1ximo 10 al a\u00f1o).",
      "Oregon vende un pase temporal ($9 m\u00e1s el impuesto por milla) si rara vez vas.",
      "La cuota de Connecticut aplica a cualquier cami\u00f3n de 26,000 libras o m\u00e1s en sus carreteras, tenga base ah\u00ed o no; una declaraci\u00f3n que no presentas cuesta el 10% de la cuota o $50, lo que sea mayor.",
    ],
  },
  eld: {
    title: "Instala un ELD registrado en el cami\u00f3n (a menos que est\u00e9s exento)",
    summary: "Un dispositivo de registro electr\u00f3nico (ELD) registra tus horas de servicio. La mayor\u00eda de los choferes interestatales necesita uno. Est\u00e1s exento si te mantienes dentro de un radio de 150 millas a\u00e9reas y terminas tu jornada en 14 horas (corta distancia), si llevas bit\u00e1cora en papel no m\u00e1s de 8 d\u00edas en cualquier periodo de 30, o si el motor del cami\u00f3n es anterior al a\u00f1o modelo 2000. Los dispositivos que FMCSA quit\u00f3 de su registro en agosto de 2026 deben reemplazarse antes del 6 de octubre de 2026.",
    fee: "El dispositivo m\u00e1s una suscripci\u00f3n mensual (el precio var\u00eda por proveedor)",
    where: "Cualquier dispositivo de la lista de ELD registrados de FMCSA",
    time: "Una tarde para instalar y configurar",
    gotchas: [
      "Compra solo de la lista registrada de FMCSA - un dispositivo dado de baja es lo mismo que no tener ninguno en una inspecci\u00f3n en carretera.",
      "Si el ELD se descompone tienes 8 d\u00edas para repararlo o reemplazarlo, y mientras tanto llevas bit\u00e1cora en papel.",
      "El transportista guarda 6 meses de bit\u00e1coras; el chofer lleva consigo los 7 d\u00edas anteriores.",
    ],
  },
  files: {
    title: "Arma tu archivo de documentos (t\u00fa eres tu propio departamento de seguridad)",
    summary: "Mant\u00e9n un archivo de calificaci\u00f3n de chofer sobre ti mismo: tu CDL, tu certificado m\u00e9dico (un examen f\u00edsico DOT nuevo al menos cada 24 meses, con un examinador del Registro Nacional), tu historial de manejo (MVR) obtenido y revisado al menos una vez cada 12 meses, y tu prueba de manejo o equivalente. Guarda registros de mantenimiento de cualquier cami\u00f3n que controles por 30 d\u00edas o m\u00e1s, una inspecci\u00f3n peri\u00f3dica del tractor Y del remolque al menos cada 12 meses, y el reporte de inspecci\u00f3n diaria cada vez que encuentres un defecto.",
    fee: "Las cuotas del examen f\u00edsico y del MVR var\u00edan; el archivo en s\u00ed no cuesta nada",
    where: "Una carpeta en el cami\u00f3n y una copia en casa (o en la nube)",
    time: "Una hora para armarlo; minutos al mes para mantenerlo",
    gotchas: [
      "Desde el 23 de junio de 2025 el examinador m\u00e9dico env\u00eda tu certificado al estado por v\u00eda electr\u00f3nica - de todos modos verifica que el examinador est\u00e9 en el Registro Nacional antes de pagar el examen.",
      "La prueba de la inspecci\u00f3n anual viaja con el veh\u00edculo; el reporte en s\u00ed se guarda 14 meses. El archivo de calificaci\u00f3n se guarda 3 a\u00f1os despu\u00e9s de que dejes de manejar para la empresa.",
    ],
  },
  roadside: {
    title: "Conoce lo que revisa una inspecci\u00f3n en carretera - incluido tu ingl\u00e9s",
    summary: "Los inspectores revisan el ELD, la tarjeta m\u00e9dica, la tarjeta del seguro, la cab card de IRP y las calcoman\u00edas IFTA, la calcoman\u00eda de inspecci\u00f3n anual y el veh\u00edculo en s\u00ed. Desde el 25 de junio de 2025 tambi\u00e9n aplican la regla de dominio del ingl\u00e9s: el chofer debe poder leer y hablar ingl\u00e9s lo suficiente para comunicarse con el p\u00fablico, entender las se\u00f1ales de tr\u00e1nsito, responder a las autoridades y llenar reportes, y reprobar deja al chofer fuera de servicio en el acto. Entre junio de 2025 y marzo de 2026 esa regla produjo 60,399 infracciones y 19,045 \u00f3rdenes de fuera de servicio.",
    fee: "$0",
    where: "B\u00e1sculas y puntos de inspecci\u00f3n en carretera",
    time: "Permanente",
    gotchas: [
      "La regla est\u00e1 en 49 CFR 391.11(b)(2). FMCSA public\u00f3 una propuesta el 10 de agosto de 2026 para poner los criterios de fuera de servicio en el reglamento.",
      "Una regla aparte, vigente desde el 16 de marzo de 2026, endureci\u00f3 las CDL para choferes domiciliados fuera de Estados Unidos; no cambia nada para residentes de EE. UU.",
    ],
  },
  audit: {
    title: "Aprueba la auditor\u00eda de seguridad de nuevo transportista en tu primer a\u00f1o",
    summary: "Durante tus primeros 18 meses eres 'nuevo transportista' (new entrant) y FMCSA te vigila. Una auditor\u00eda de seguridad llega dentro de tus primeros 12 meses. Diecis\u00e9is infracciones la reprueban autom\u00e1ticamente, y todas son papeleo que t\u00fa controlas: no tener programa de drogas y alcohol, no estar en un grupo aleatorio, un chofer sin CDL vigente, no tener seguro en vigor, no tener registros de horas de servicio, u operar un veh\u00edculo que fue puesto fuera de servicio antes de repararlo. Si repruebas, tienes 60 d\u00edas para demostrar que lo corregiste o tu registro se revoca.",
    fee: "$0",
    where: "Auditor de FMCSA o del estado, normalmente a distancia",
    time: "Unas horas para reunir los registros; unas semanas de ida y vuelta",
    gotchas: [
      "Todo lo de la fase 'Legal en la carretera' es exactamente lo que pide el auditor. Hazlo en el mes uno, no en el mes once.",
      "La auditor\u00eda puede llegar con apenas 3 meses de operaci\u00f3n - no des por hecho que tienes un a\u00f1o.",
    ],
  },
  money: {
    title: "Consigue tu primera carga - y cobra",
    summary: "Los tableros de carga (load boards) son donde los brokers publican fletes; DAT One empieza en $59 al mes y el plan b\u00e1sico de Truckstop en $42. Los brokers suelen pagar 30 a 60 d\u00edas despu\u00e9s de la entrega, por eso la mayor\u00eda de los transportistas nuevos usa una empresa de factoraje que paga en uno o dos d\u00edas y se queda con un porcentaje de cada factura. Una tarjeta de combustible te ahorra centavos en cada gal\u00f3n. Nada de esto es un requisito legal - as\u00ed es como se mueve el dinero.",
    fee: "Tablero de carga $42-$59 al mes; factoraje un porcentaje de cada factura; tarjetas de combustible normalmente gratis",
    where: "Tableros de carga, empresas de factoraje, proveedores de tarjetas de combustible",
    time: "Un d\u00eda para configurarlo",
    gotchas: [
      "Lee el contrato de factoraje - el plazo y la cuota de salida - antes de firmar; la tasa no es el \u00fanico n\u00famero.",
      "Los brokers revisan tu p\u00e1gina de SAFER y tu seguro antes de asignarte carga - una autoridad nueva con todo en orden consigue cargas; una autoridad nueva con estado Pendiente no.",
    ],
  },
};

export function hlStepEs(id: string): HlStepEs | undefined {
  return HL_STEPS_ES[id];
}

// -----------------------------------------------------------
// END OF FILE - lib/haullegal/steps-es.ts (v1 - Spanish for all
// 23 steps and 4 phases)
// If you can see these lines after pasting, the whole file
// made it. Safe to commit.
// -----------------------------------------------------------
