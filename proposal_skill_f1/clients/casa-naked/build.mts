// Propuesta (Fase 1) de Casa Naked.
// Regenerar:  npx tsx clients/casa-naked/build.mts
// Output:     ree-website/public/proposals/casa-naked.json
//
// Secciones generadas con los tools MCP de diagnostico-skill-f1 y ensambladas
// aca para aplicar las convenciones de CLAUDE.md que compose-diagnostic todavia
// no cubre: metodo antes del roadmap, colores fijos del Gantt por etapa del
// framework, logo del cliente en portada y cierre.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  REE_METHOD_PHASES,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_PAYMENT_TERMS,
} from "../../src/lib/templates.js";
import type { DiagnosticPresentation } from "../../src/lib/types.js";

const CLIENT_LOGO = "/casa-naked-logo-white.png";
const CONFIDENTIAL = "CONFIDENCIAL · 05-10-2026";

// Colores fijos por etapa del framework (identicos en todas las barras).
const FOUNDATION = "#DD0513";
const BUILD = "#0E0D0C";
const LAUNCH = "#E8A013";
const SCALE = "#12A150";

const FOOTNOTE =
  "La producción de contenido (video, fotografía profesional y UGC) va por REE Agencia y se detalla en la lámina Producción de Lanzamiento. " +
  "REE Growth entrega la bajada creativa de cada pieza. El presupuesto de pauta puede arrancar en USD 350 a 400 y " +
  "escalar con la data del lanzamiento. <b>Los precios no incluyen IVA.</b>";

const FOOTNOTE_PRODUCCION =
  "Producción a cargo de REE Agencia: 1 día de rodaje en el local con filmmaker y dirección creativa, más postproducción " +
  "(edición y color). El contenido alimenta las 2 campañas del primer ciclo y queda disponible para reutilizar en el feed " +
  "de @casanaked. El rodaje se coordina con el local terminado. <b>Los precios no incluyen IVA.</b>";

const presentation: DiagnosticPresentation = {
  version: "1.0",
  client: {
    name: "Casa Naked",
    slug: "casa-naked",
    industry: "Cafetería de especialidad · Moda circular",
    logoUrl: CLIENT_LOGO,
  },
  createdAt: "2026-10-05T12:00:00.000Z",
  slides: [
    // 1 · Portada
    {
      type: "cover",
      badge: "FASE 1",
      badgeLabel: "DIAGNÓSTICO + PROPUESTA DE VALOR",
      title: "PROPUESTA",
      subtitle: "Diagnóstico del negocio y propuesta de valor personalizada para Casa Naked.",
      confidential: CONFIDENTIAL,
      clientLogo: CLIENT_LOGO,
    },

    // 2 · Índice
    {
      type: "index",
      label: "ÍNDICE",
      title: "EL RECORRIDO",
      items: [
        { number: "01", title: "LA LLAMADA", description: "Lo que escuchamos en la discovery call." },
        { number: "02", title: "LA AUDITORÍA", description: "Estado actual de tu marketing digital." },
        { number: "03", title: "EL RESEARCH", description: "Mercado, competencia e ICP." },
        { number: "04", title: "CÓMO TRABAJAMOS", description: "Nuestro método de 5 fases + REE Metrics." },
        { number: "05", title: "LA PROPUESTA DE VALOR", description: "Roadmap a medida del lanzamiento." },
        { number: "06", title: "VALOR DEL SERVICIO", description: "Inversión, producción de contenido y costos de Meta Ads." },
      ],
    },

    // 3 · La Llamada
    {
      type: "content",
      sectionLabel: "01 · LA LLAMADA / DISCOVERY CALL",
      headline: "CASA NAKED",
      summary: {
        label: "OBJETIVO",
        value:
          "Acompañar la apertura presencial con un <b>lanzamiento digital</b> en un radio circular de <b>5 a 6 km</b> de Villa Crespo, la zona donde nuestro cliente nos puede consumir más fácilmente.",
      },
      cards: [
        {
          label: "PRODUCTO",
          value:
            "Dos unidades bajo un mismo techo: <b>cafetería de especialidad</b> al frente y <b>moda circular</b> en el fondo. Evolución de Naked3r (las 3R: reducir, reutilizar, reciclar). Stock de <b>prenda única</b>: cada pieza es exclusiva y no se repone.",
        },
        {
          label: "PRECIO",
          value:
            "Dos tickets con lógicas opuestas: <b>café</b> (bajo, alta frecuencia, hasta varias veces por semana) e <b>indumentaria circular</b> (medio, baja frecuencia). El mix entre ambos y las promociones de apertura se definen en Foundation.",
        },
        {
          label: "PLAZA",
          value:
            "Local <b>a la calle</b> en Villa Crespo, a una cuadra de Av. Corrientes. Apertura entre el <b>15 y el 20 de octubre</b>. Reemplaza al PH cerrado donde funcionaba Naked3r. Ecommerce propio <b>desactualizado</b>, fuera del alcance hasta renovarlo.",
        },
        {
          label: "PROMOCIÓN",
          value:
            "Instagram <b>@casanaked</b> (~8.000 seguidores heredados de Naked3r), gestionado por Andrea sin estructura. <b>Cero inversión en pauta digital.</b> Sin contenido producido profesionalmente, sin base de WhatsApp y sin CRM.",
        },
      ],
      quote: {
        text:
          "No quiero hacer conocida solo la cafetería: quiero la experiencia de venir a tomar un café con moda circular. O te venís a comprar algo y te tomás el café, o al revés. Mirá a la redonda de donde nosotros vamos a estar: no hay nada como lo que vamos a poner.",
        source: "Andrea Jurado · Discovery Call",
      },
    },

    // 4 · La Auditoría
    {
      type: "findings",
      sectionLabel: "02 · LA AUDITORÍA / MARKETING DIGITAL",
      headline: "LO QUE ESTÁ PASANDO HOY",
      findings: [
        {
          area: "SETUP DE META ADS",
          finding:
            "No existe <b>página de Facebook</b> vinculada al perfil, requisito obligatorio para pautar. Tampoco hay <b>Meta Business Suite</b> ni cuenta publicitaria creadas. Hoy la marca no puede encender un anuncio aunque quisiera: es lo primero que hay que resolver.",
          severity: "critical",
        },
        {
          area: "PAUTA PUBLICITARIA",
          finding:
            "<b>Cero inversión en pauta digital</b> en toda la historia de la marca. Sin píxel instalado, sin audiencias armadas y sin histórico de conversiones. Meta arranca sin data: por eso las primeras 2 semanas de Launch son de recolección, no de optimización.",
          severity: "critical",
        },
        {
          area: "CONTENIDO Y ACTIVOS",
          finding:
            "Instagram <b>@casanaked</b> (rebrand de @naked3r, ~8.000 seguidores) gestionado por Andrea sin estructura, con foco en producto de moda circular. <b>No hay material del nuevo concepto</b>: ni del café, ni de la deco, ni del local. El espacio todavía se está montando, así que el activo visual central no existe.",
          severity: "warning",
        },
        {
          area: "CANAL DE CONVERSIÓN",
          finding:
            "El ecommerce está desactualizado y sin la temporada de primavera cargada. El modelo de <b>prenda única</b> hace que mantener el catálogo online sea costoso en tiempo. Queda fuera del alcance inicial: el canal de conversión de esta etapa es <b>WhatsApp Business</b>, que hoy no está configurado como destino de campaña.",
          severity: "warning",
        },
      ],
      keyInsight:
        "La apertura es el puntapié inicial: usarla para generar ruido en la zona y atraer clientes nuevos, y capturar ese reconocimiento en seguidores del radio de 5 a 6 km y en conversaciones de WhatsApp consultando por ofertas, tanto de la cafetería como de moda circular.",
    },

    // 5 · El Research / Mercado
    {
      type: "research",
      sectionLabel: "03 · EL RESEARCH / MERCADO",
      headline: "EL MERCADO",
      marketCards: [
        {
          label: "LA ZONA",
          text:
            "Villa Crespo es <b>polo gastronómico reconocido</b> por el Gobierno de la Ciudad. El circuito de cafés de especialidad se concentra en dos ejes: <b>Aguirre y Malabia</b>, y el corredor <b>Corrientes hacia Dorrego</b>. Casa Naked abre a una cuadra de Corrientes, dentro del segundo eje pero en una cuadra sin oferta equivalente.",
        },
        {
          label: "TENDENCIA",
          text:
            "La tendencia 2026 en CABA es el <b>punto de venta como punto de encuentro</b>: locales que combinan café de especialidad con showroom de indumentaria. El caso más cercano es <b>Artífice Café</b> (Godoy Cruz 1369), con la marca de básicos nuevos ABC adentro. El formato híbrido ya está validado; <b>nadie lo hace con moda circular</b>.",
        },
        {
          label: "MODA CIRCULAR",
          text:
            "Dejó de ser nicho. <b>Renová tu Vestidor supera 1,5 millones de usuarios</b> y <b>Galpón de Ropa llegó a 11 puntos de venta</b>, incluyendo su entrada a shoppings en 2026. La segunda mano se normalizó como decisión de compra, no como último recurso.",
        },
        {
          label: "ESTACIONALIDAD",
          text:
            "La apertura cae en <b>primavera</b>, el mejor momento del año para un local a la calle: cambio de temporada, recambio de guardarropa y clima que empuja el consumo en vereda. El valle es enero y febrero, cuando el barrio se vacía.",
        },
      ],
      summary:
        "El contexto juega a favor: el café ya está <b>validado en el barrio</b> con demanda constante, la moda circular dejó de ser nicho y está en <b>plena expansión</b>, y la apertura llega con la <b>estacionalidad de consumo</b> a favor. El momento es ideal para lanzar anuncios que comuniquen correctamente la idea.",
    },

    // 6 · El Research / Competencia
    {
      type: "competitors",
      sectionLabel: "03 · EL RESEARCH / COMPETENCIA",
      headline: "LA COMPETENCIA",
      competitors: [
        {
          name: "Cafés de especialidad de Villa Crespo",
          description: "Crespín · Malvón · Bilbo · DOC Café · 1021 · La Noire",
          icon: "crown",
          share: "Compiten por la ocasión del café",
          strengths: [
            "Años de operación y clientela de barrio ya fidelizada",
            "Concentrados en el eje Aguirre y Malabia, que ya funciona como circuito",
            "Tostadores propios o rotativos y pastelería como gancho de recompra",
          ],
          weaknesses: [
            "Venden solo café: no hay una segunda razón para entrar",
            "Compiten entre sí dentro de las mismas cuadras",
            "Crecen por boca a boca y prensa, sin pauta ni base propia de clientes",
          ],
        },
        {
          name: "Moda circular de escala",
          description: "Galpón de Ropa · Renová tu Vestidor · Juan Pérez Vintage · Eureka · Urban Luxury",
          icon: "tag",
          share: "Compiten por la compra de segunda mano",
          strengths: [
            "Volumen y rotación de stock que una tienda chica no iguala",
            "Renová tu Vestidor con más de 1,5 millones de usuarios",
            "Galpón de Ropa con 11 locales y entrada a shoppings",
            "Precio bajo como propuesta central y pauta digital activa",
          ],
          weaknesses: [
            "Experiencia de compra masiva, sin curaduría ni trato personal",
            "No dan ninguna razón para quedarse en el lugar",
            "Ni la prenda ni el espacio son memorables",
            "No construyen comunidad de barrio ni recurrencia semanal",
          ],
        },
      ],
      summary:
        "El diferencial competitivo está en la <b>experiencia de la marca</b>: la modalidad híbrida de <b>café más moda circular</b> hace que el local no sea solo un lugar de café, sino un lugar para ver y hablar de moda. Y frente a la oferta de cafeterías de la zona, el <b>trato humano</b> es la diferencia clave.",
    },

    // 7 · El Research / Cliente Ideal
    {
      type: "icp",
      sectionLabel: "03 · EL RESEARCH / CLIENTE IDEAL",
      headline: "TU CLIENTE IDEAL",
      profiles: [
        {
          segment: "Persona: La vecina del radio de 5 km",
          badge: "Sin conciencia de la marca",
          description:
            "Persona de 25 a 45 años que vive o trabaja en Villa Crespo, Palermo, Almagro o Caballito. Busca un trato diferencial y humano a la hora de consumir un café, con intención de ver algo distinto, como puede ser una prenda exclusiva.",
          pains: [
            "Los cafés que le gustan están todos en el mismo eje y siempre llenos",
            "En su cuadra solo hay tiendas de ropa que no le hablan a ella",
            "Comprar ropa nueva cada temporada se volvió inviable por precio",
            "No tiene dónde tomar un café que además le resuelva otra cosa",
            "Le incomoda el consumo de fast fashion pero no encuentra alternativa cómoda",
          ],
          desires: [
            "Descubrir el lugar del barrio antes de que se llene",
            "Encontrar una prenda que nadie más va a tener",
            "Que la atienda la dueña y no un empleado rotativo",
            "Consumir de forma más consciente sin resignar estética",
            "Un plan de sábado a la mañana que no sea ir al shopping",
          ],
          objections: [
            "No sé dónde queda, nunca caminé por esa cuadra",
            "La ropa usada me da reparo por talles y estado",
            "¿El café es bueno de verdad o es la excusa para venderme ropa?",
            "Ya tengo mi café de siempre y no lo cambio",
            "No conozco la marca, no sé si vale el desvío",
          ],
        },
        {
          segment: "Persona: La compradora histórica de Naked3r",
          badge: "Con conciencia de la marca",
          description:
            "Los ~8.000 seguidores heredados del Instagram de Naked3r. Ya compró o siguió la marca cuando funcionaba como tienda de moda circular. Conoce el concepto de las 3R y elige la marca por criterio, no por precio. Al lanzar la pauta se nutre a esta base comunicándole el nuevo valor que trae Casa Naked: la experiencia de café más moda circular.",
          pains: [
            "El local que conocía cerró y no sabe si la marca sigue existiendo",
            "El stock es de prenda única: si no va rápido, se lo pierde",
            "El ecommerce está desactualizado y no encuentra la temporada nueva",
            "No siempre vive cerca de Villa Crespo",
            "No tiene forma de enterarse cuándo entra mercadería nueva",
          ],
          desires: [
            "Enterarse primero cuando entra stock, antes que el resto",
            "Ver la prenda puesta y probársela, no comprar a ciegas",
            "Que la marca tenga un lugar fijo al que volver",
            "Combinar la compra con un plan y no solo con una transacción",
            "Seguir apoyando un proyecto con impacto ambiental concreto",
          ],
          objections: [
            "Me queda lejos de casa para ir sin un motivo fuerte",
            "¿Es la misma marca o cambió de propuesta?",
            "Prefiero comprar online y que me lo manden",
            "La moda circular curada es más cara que una feria americana",
            "¿Van a tener mi talle si hay una sola prenda de cada cosa?",
          ],
        },
      ],
    },

    // 8 · Cómo Trabajamos
    {
      type: "method",
      sectionLabel: "04 · CÓMO TRABAJAMOS",
      headline: "EL MÉTODO: 5 FASES + REE METRICS",
      currentPhase: 1,
      // Sin duraciones: los tiempos reales de este lanzamiento los fija el roadmap.
      phases: REE_METHOD_PHASES.map(({ duration, ...phase }) => phase),
    },

    // 9 · Roadmap
    {
      type: "roadmap",
      sectionLabel: "05 · LA PROPUESTA DE VALOR",
      headline: "ROADMAP DE EJECUCIÓN",
      description:
        "Casa Naked abre entre el <b>15 y el 20 de octubre</b>, pero la apertura no es una fecha: es una <b>ventana de lanzamiento de 8 semanas</b>. Primero instalar la experiencia de café más moda circular en un radio de 5 a 6 km, después convertir ese reconocimiento en visitas al local y conversaciones por WhatsApp. <b>2 campañas</b> en Meta Ads: <b>CASANAKED_Awareness</b> (interacción hacia @casanaked) y <b>CASANAKED_WhatsApp</b> (conversión a WhatsApp Business para take away y consulta de prendas). El ecommerce queda fuera de este ciclo hasta que esté renovado.",
      gantt: {
        totalWeeks: 8,
        bars: [
          {
            label: "Awareness (Instagram)",
            startWeek: 1,
            endWeek: 8,
            color: BUILD,
            segments: [
              { startWeek: 1, endWeek: 1, color: FOUNDATION, label: "Foundation" },
              { startWeek: 2, endWeek: 3, color: BUILD, label: "Build" },
              { startWeek: 4, endWeek: 5, color: LAUNCH, label: "Launch" },
              { startWeek: 6, endWeek: 8, color: SCALE, label: "Scale" },
            ],
          },
          {
            label: "Conversión (WhatsApp)",
            startWeek: 1,
            endWeek: 8,
            color: FOUNDATION,
            segments: [
              { startWeek: 1, endWeek: 1, color: FOUNDATION, label: "Foundation" },
              { startWeek: 2, endWeek: 3, color: BUILD, label: "Build" },
              { startWeek: 4, endWeek: 5, color: LAUNCH, label: "Launch" },
              { startWeek: 6, endWeek: 8, color: SCALE, label: "Scale" },
            ],
          },
        ],
      },
      phases: [
        {
          number: "1",
          name: "Foundation",
          weeks: "Semana 1 · 13/10 al 19/10",
          color: FOUNDATION,
          description: "",
          deliverables: [
            "Kick Off el 13/10: way of working, handoff de accesos y objetivos del lanzamiento",
            "Setup de Meta Business Suite, página de Facebook y cuenta publicitaria de Casa Naked",
            "WhatsApp Business como destino de campaña: catálogo, respuestas rápidas y horarios",
            "Integración de Meta Ads con REE Metrics",
            "Foundation Review el 20/10: ICP validado, ángulos de comunicación y brief creativo de ambas campañas",
          ],
        },
        {
          number: "2",
          name: "Build",
          weeks: "Semanas 2-3 · 20/10 al 02/11",
          color: BUILD,
          description: "",
          deliverables: [
            "Bajada creativa de Awareness: guiones, headlines y referencias de las piezas de la experiencia",
            "Bajada creativa de WhatsApp: ángulos de take away, prenda única y promoción de apertura",
            "Campañas estructuradas en Meta Ads con geosegmentación de 5 a 6 km y conjuntos por ICP",
            "Validación end to end del funnel: anuncio, perfil de Instagram, WhatsApp Business y REE Metrics",
          ],
        },
        {
          number: "3",
          name: "Launch",
          weeks: "Semanas 4-5 · 03/11 al 16/11",
          color: LAUNCH,
          description: "",
          deliverables: [
            "Awareness activa desde el 03/11, optimizada a visitas al perfil y seguidores nuevos",
            "Campaña de WhatsApp activa desde el 03/11, alineada al lanzamiento oficial de la marca",
            "2 semanas de recolección de data: qué ángulo trae perfil y qué ángulo trae mensajes",
            "Launch Review el 17/11: alcance, visitas al perfil, mensajes y costo por mensaje",
          ],
        },
        {
          number: "4",
          name: "Scale",
          weeks: "Semanas 6-8 · 17/11 al 07/12",
          color: SCALE,
          description: "",
          deliverables: [
            "Escalar presupuesto a los anuncios ganadores y pausar los que no traccionan",
            "Refinar la geosegmentación según de dónde vienen los que efectivamente escriben",
            "Retargeting de quienes interactuaron con el perfil y no llegaron a escribir",
            "Calendario de diciembre: regalería y cierre de temporada",
            "Review Final el 08/12: plan del segundo ciclo y evaluación del ecommerce cuando esté renovado",
          ],
        },
      ],
    },

    // 10 · Valor del Servicio
    {
      type: "pricing",
      sectionLabel: "06 · VALOR DEL SERVICIO",
      headline: "LO QUE PROPONEMOS PARA CASA NAKED",
      packages: [
        {
          name: "",
          fee: "USD 500/mes",
          adSpend: "USD 500/mes en pauta (directo en Meta Ads)",
          features: [
            "Estrategia y gestión de 2 campañas en Meta Ads con geosegmentación de 5 a 6 km",
            "1 campaña de awareness hacia el perfil @casanaked",
            "1 campaña de conversión a WhatsApp Business: take away y consulta de prendas",
            "Bajada de línea creativa: guiones, headlines, formatos y referencias de cada pieza",
            "Setup de Meta Business Suite, página de Facebook y WhatsApp Business como destino",
            "Acceso a REE Metrics: dashboard en vivo del lanzamiento",
            "Optimización continua y reunión quincenal de performance",
          ],
          recommended: true,
        },
      ],
      breakdown: {
        items: [
          {
            concept: "Servicio REE Growth",
            amount: "USD 450/mes",
            note: "Estrategia, setup, gestión y optimización de 2 campañas en Meta Ads. Bajada creativa, reportes quincenales y reuniones de seguimiento.",
            recurring: true,
          },
          {
            concept: "REE Metrics",
            amount: "USD 50/mes",
            note: "Dashboard en vivo: alcance, visitas al perfil, seguidores nuevos, mensajes y costo por mensaje.",
            recurring: true,
          },
          {
            concept: "Presupuesto de Pauta",
            amount: "USD 500/mes",
            note: "Se pone tu tarjeta directamente en Meta Ads, el gasto publicitario se debita de tu cuenta. Se redistribuye entre campañas según performance.",
            recurring: true,
          },
        ],
        monthly: "USD 500/mes",
        adSpend: "USD 500/mes",
      },
      scenarios: [],
      footnote: FOOTNOTE,
    },

    // 11 · Producción de Lanzamiento (REE Agencia)
    {
      type: "pricing",
      sectionLabel: "06 · VALOR DEL SERVICIO",
      headline: "PRODUCCIÓN DE LANZAMIENTO",
      packages: [],
      breakdown: {
        items: [
          {
            concept: "Rodaje de lanzamiento (sin actores)",
            amount: "ARS 1.780.000",
            note: "3 videos UGC (Andrea a cámara o creadora UGC), 2 videos cinematic y 10 a 12 fotos de producto con cámara profesional: cafetería, prendas y el espacio.",
            recurring: false,
          },
          {
            concept: "Rodaje de lanzamiento (con actores)",
            amount: "ARS 2.200.000",
            note: "El mismo rodaje sumando actores para el cinematic de storytelling: la conversación entre amigas que termina en Casa Naked.",
            recurring: false,
          },
        ],
        monthly: "ARS 1.780.000",
        monthlyLabel: "Sin actores · pago único",
        adSpend: "ARS 2.200.000",
        adSpendLabel: "Con actores · pago único",
      },
      scenarios: [],
      footnote: FOOTNOTE_PRODUCCION,
    },

    // 12 · Medios de Pago
    {
      type: "payment-methods",
      sectionLabel: "06 · VALOR DEL SERVICIO",
      headline: "MEDIOS DE PAGO",
      methods: DEFAULT_PAYMENT_METHODS,
      paymentTerms: DEFAULT_PAYMENT_TERMS.paymentTerms,
      currencyNote: DEFAULT_PAYMENT_TERMS.currencyNote,
      latePayment: DEFAULT_PAYMENT_TERMS.latePayment,
      footnote: FOOTNOTE,
    },

    // 13 · Cierre
    {
      type: "closing",
      partnership: "REE GROWTH × CASA NAKED",
      headline: "¿COMENZAMOS?",
      clientLogo: CLIENT_LOGO,
      steps: [
        { number: "01", text: "Confirmación de la propuesta" },
        { number: "02", text: "KO 13/10 :: Way of working + Handoff de accesos" },
        { number: "03", text: "Comenzar etapa de Foundation" },
      ],
    },
  ],
};

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../../../../ree-website/public/proposals/casa-naked.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(presentation, null, 2) + "\n", "utf8");
console.log(`✓ ${out}`);
