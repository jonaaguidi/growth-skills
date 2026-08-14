import type { MethodPhase } from "./types.js";

// ── Static content: REE method 5 phases ──

export const REE_METHOD_PHASES: MethodPhase[] = [
  {
    number: "01",
    name: "DIAGNÓSTICO",
    duration: "Semana 1",
    description:
      "Auditoría completa de tu situación actual: pauta, tracking, contenido y funnel. Entendemos dónde estás antes de proponer a dónde ir.",
  },
  {
    number: "02",
    name: "ESTRATEGIA",
    duration: "Semana 2",
    description:
      "Definimos ICP, ángulos de comunicación, estructura de campañas y KPIs. Todo alineado a tus objetivos de negocio.",
  },
  {
    number: "03",
    name: "PRODUCCIÓN",
    duration: "Semana 3",
    description:
      "Creamos los creativos, copies, landing pages y configuramos las campañas. Todo listo para lanzar.",
  },
  {
    number: "04",
    name: "LANZAMIENTO",
    duration: "Semana 4",
    description:
      "Activamos campañas, monitoreamos métricas en tiempo real con REE Metrics. Ajustes diarios en la primera semana.",
  },
  {
    number: "05",
    name: "OPTIMIZACIÓN",
    duration: "Ongoing",
    description:
      "Ciclos de testing, iteración de creativos y scaling. Reportes en vivo + reuniones recurrentes de performance.",
  },
];

// ── Closing slide defaults ──

export const DEFAULT_CLOSING = {
  headline: "EMPECEMOS.",
  steps: [
    { number: "01", text: "Confirmás el plan que más se ajusta a tus objetivos." },
    { number: "02", text: "Transferís el 50% de adelanto para arrancar." },
    { number: "03", text: "Arrancamos la Fase 2 — Estrategia + Setup en 48hs." },
  ],
};

// ── Index section names ──

export const SECTION_INDEX = [
  { number: "01", title: "LA LLAMADA", description: "Lo que escuchamos en la discovery call." },
  { number: "02", title: "LA AUDITORÍA", description: "Estado actual de tu marketing digital." },
  { number: "03", title: "EL RESEARCH", description: "Mercado, competencia e ICP." },
  { number: "04", title: "LA PROPUESTA DE VALOR", description: "Ángulos que responden a tus dolores." },
  { number: "05", title: "CÓMO TRABAJAMOS", description: "Nuestro método de 5 fases." },
  { number: "06", title: "EL PLAN + LA INVERSIÓN", description: "Paquetes, escenarios y próximos pasos." },
];
