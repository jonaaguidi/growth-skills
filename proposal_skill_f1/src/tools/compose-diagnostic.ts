import type {
  DiagnosticPresentation,
  Slide,
  AuditSection,
  ResearchSection,
  ValuePropsSection,
  InvestmentSection,
  InfoCard,
  MethodPhase,
} from "../lib/types.js";
import { REE_METHOD_PHASES, DEFAULT_CLOSING, SECTION_INDEX } from "../lib/templates.js";

export const name = "compose-diagnostic";

export const description =
  "Ensambla el JSON final de la presentación de diagnóstico. " +
  "Toma todas las secciones generadas por las otras tools y produce " +
  "el array de slides tipados listo para el viewer en ree-website.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    clientName: { type: "string" },
    clientSlug: { type: "string" },
    clientIndustry: { type: "string" },
    clientLogoUrl: { type: "string" },
    // Section 01: La Llamada
    llamadaCards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
    },
    llamadaQuote: { type: "string" },
    llamadaQuoteSource: { type: "string" },
    // Section 02: La Auditoría (JSON string from build-audit-section)
    auditSection: { type: "string", description: "JSON output from build-audit-section." },
    // Section 03: El Research (JSON string from build-research-section)
    researchSection: { type: "string", description: "JSON output from build-research-section." },
    // Section 04: La Propuesta de Valor (JSON string from build-value-props)
    valuePropsSection: { type: "string", description: "JSON output from build-value-props." },
    // Section 05: Cómo Trabajamos (optional override)
    methodPhases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "string" },
          name: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" },
        },
        required: ["number", "name", "duration", "description"],
      },
      description: "Override de las fases del método. Si no se envía, usa el default.",
    },
    // Section 06: El Plan (JSON string from calculate-investment)
    investmentSection: { type: "string", description: "JSON output from calculate-investment." },
    // Closing
    closingHeadline: { type: "string" },
    closingSteps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "string" },
          text: { type: "string" },
        },
        required: ["number", "text"],
      },
    },
  },
  required: [
    "clientName",
    "clientSlug",
    "clientIndustry",
    "llamadaCards",
    "llamadaQuote",
    "llamadaQuoteSource",
    "auditSection",
    "researchSection",
    "valuePropsSection",
    "investmentSection",
  ],
};

interface ComposeInput {
  clientName: string;
  clientSlug: string;
  clientIndustry: string;
  clientLogoUrl?: string;
  llamadaCards: InfoCard[];
  llamadaQuote: string;
  llamadaQuoteSource: string;
  auditSection: string;
  researchSection: string;
  valuePropsSection: string;
  methodPhases?: MethodPhase[];
  investmentSection: string;
  closingHeadline?: string;
  closingSteps?: { number: string; text: string }[];
}

export async function handler(args: ComposeInput) {
  const audit: AuditSection = JSON.parse(args.auditSection);
  const research: ResearchSection = JSON.parse(args.researchSection);
  const valueProps: ValuePropsSection = JSON.parse(args.valuePropsSection);
  const investment: InvestmentSection = JSON.parse(args.investmentSection);
  const phases = args.methodPhases ?? REE_METHOD_PHASES;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const confidential = `CONFIDENCIAL · ${dd}-${mm}-${yyyy}`;

  const slides: Slide[] = [
    // Cover
    {
      type: "cover",
      badge: "FASE 1",
      title: "AUDITORÍA.",
      subtitle: `Diagnóstico + Propuesta para ${args.clientName}`,
      confidential,
    },
    // Index
    {
      type: "index",
      label: "ÍNDICE",
      title: "EL RECORRIDO",
      items: SECTION_INDEX,
    },
    // 01 — La Llamada
    {
      type: "content",
      sectionLabel: "01 · LA LLAMADA — LO QUE ESCUCHAMOS",
      headline: "TU NEGOCIO, EN TUS PALABRAS",
      cards: args.llamadaCards,
      quote: {
        text: args.llamadaQuote,
        source: args.llamadaQuoteSource,
      },
    },
    // 02 — La Auditoría
    {
      type: "findings",
      sectionLabel: "02 · LA AUDITORÍA",
      headline: "LO QUE ESTÁ PASANDO HOY",
      findings: audit.findings,
      keyInsight: audit.keyInsight,
    },
    // 03 — El Research
    {
      type: "research",
      sectionLabel: "03 · EL RESEARCH — MERCADO + ICP",
      headline: "LO QUE DICTA TU MERCADO",
      marketPanel: {
        title: "El Mercado",
        content: research.marketOverview,
        insights: research.marketInsights,
      },
      icpPanel: {
        title: "Tu Cliente Ideal",
        icp: research.icp,
      },
      dataPoints: research.dataPoints,
    },
    // 04 — La Propuesta de Valor
    {
      type: "value-props",
      sectionLabel: "04 · LA PROPUESTA DE VALOR",
      headline: "ÁNGULOS QUE RESPONDEN A ESOS DOLORES",
      angles: valueProps.angles,
      funnels: valueProps.funnels,
    },
    // 05 — Cómo Trabajamos
    {
      type: "method",
      sectionLabel: "05 · CÓMO TRABAJAMOS",
      headline: "UN MÉTODO, NO UNA PROMESA",
      phases,
    },
    // 06 — El Plan + La Inversión
    {
      type: "pricing",
      sectionLabel: "06 · EL PLAN + LA INVERSIÓN",
      headline: `LO QUE PROPONEMOS PARA ${args.clientName.toUpperCase()}`,
      packages: investment.packages,
      scenarios: investment.scenarios,
      footnote: investment.footnote,
    },
    // Closing
    {
      type: "closing",
      partnership: `REE GROWTH × ${args.clientName.toUpperCase()}`,
      headline: args.closingHeadline ?? DEFAULT_CLOSING.headline,
      steps: args.closingSteps ?? DEFAULT_CLOSING.steps,
    },
  ];

  const presentation: DiagnosticPresentation = {
    version: "1.0",
    client: {
      name: args.clientName,
      slug: args.clientSlug,
      industry: args.clientIndustry,
      ...(args.clientLogoUrl ? { logoUrl: args.clientLogoUrl } : {}),
    },
    createdAt: today.toISOString(),
    slides,
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(presentation, null, 2),
      },
    ],
  };
}
