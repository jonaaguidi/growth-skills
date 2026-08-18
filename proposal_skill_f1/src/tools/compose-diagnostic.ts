import type {
  DiagnosticPresentation,
  Slide,
  AuditSection,
  ResearchSection,
  CompetitorsSection,
  ICPSection,
  RoadmapSection,
  InvestmentSection,
  InfoCard,
  MethodPhase,
} from "../lib/types.js";
import { REE_METHOD_PHASES, DEFAULT_CLOSING, SECTION_INDEX } from "../lib/templates.js";

export const name = "compose-diagnostic";

export const description =
  "Ensambla el JSON final de la presentación de diagnóstico (11 slides). " +
  "Toma todas las secciones generadas por las otras tools y produce " +
  "el array de slides tipados listo para el viewer en ree-website.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    clientName: { type: "string" },
    clientSlug: { type: "string" },
    clientIndustry: { type: "string" },
    clientLogoUrl: { type: "string" },
    badgeLabel: { type: "string", description: "Subtítulo del badge en el cover (ej: DIAGNÓSTICO + PROPUESTA DE VALOR)." },
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
    llamadaSummary: {
      type: "object",
      properties: {
        label: { type: "string" },
        value: { type: "string" },
      },
      required: ["label", "value"],
      description: "Card de resumen/objetivo que aparece arriba de las cards (label + value con HTML).",
    },
    llamadaQuote: { type: "string" },
    llamadaQuoteSource: { type: "string" },
    // Section 02: La Auditoría (JSON string from build-audit-section)
    auditSection: { type: "string", description: "JSON output from build-audit-section." },
    // Section 03: El Research — Mercado (JSON string from build-research-section)
    researchSection: { type: "string", description: "JSON output from build-research-section." },
    // Section 03: El Research — Competencia (JSON string from build-competitors-section)
    competitorsSection: { type: "string", description: "JSON output from build-competitors-section." },
    // Section 03: El Research — ICP (JSON string from build-icp-section)
    icpSection: { type: "string", description: "JSON output from build-icp-section." },
    // Section 04: Roadmap (JSON string from build-roadmap-section)
    roadmapSection: { type: "string", description: "JSON output from build-roadmap-section." },
    // Section 05: Cómo Trabajamos
    currentPhase: { type: "number", description: "Fase actual del método (1-5). Se resalta en el slide." },
    methodPhases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "string" },
          name: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" },
          deliverable: { type: "string" },
          deliverableIcon: { type: "string" },
        },
        required: ["number", "name", "duration", "description"],
      },
      description: "Override de las fases del método. Si no se envía, usa el default.",
    },
    // Section 06: Valor del Servicio (JSON string from calculate-investment)
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
    "auditSection",
    "researchSection",
    "competitorsSection",
    "icpSection",
    "roadmapSection",
    "investmentSection",
  ],
};

interface ComposeInput {
  clientName: string;
  clientSlug: string;
  clientIndustry: string;
  clientLogoUrl?: string;
  badgeLabel?: string;
  llamadaCards: InfoCard[];
  llamadaSummary?: { label: string; value: string };
  llamadaQuote: string;
  llamadaQuoteSource?: string;
  auditSection: string;
  researchSection: string;
  competitorsSection: string;
  icpSection: string;
  roadmapSection: string;
  currentPhase?: number;
  methodPhases?: MethodPhase[];
  investmentSection: string;
  closingHeadline?: string;
  closingSteps?: { number: string; text: string }[];
}

export async function handler(args: ComposeInput) {
  const audit: AuditSection = JSON.parse(args.auditSection);
  const research: ResearchSection = JSON.parse(args.researchSection);
  const competitors: CompetitorsSection = JSON.parse(args.competitorsSection);
  const icp: ICPSection = JSON.parse(args.icpSection);
  const roadmap: RoadmapSection = JSON.parse(args.roadmapSection);
  const investment: InvestmentSection = JSON.parse(args.investmentSection);
  const phases = args.methodPhases ?? REE_METHOD_PHASES;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const confidential = `CONFIDENCIAL · ${dd}-${mm}-${yyyy}`;

  const slides: Slide[] = [
    // 1. Cover
    {
      type: "cover",
      badge: "FASE 1",
      badgeLabel: args.badgeLabel ?? "DIAGNÓSTICO + PROPUESTA DE VALOR",
      title: "PROPUESTA",
      subtitle: `Diagnóstico del negocio y propuesta de valor personalizada para ${args.clientName}.`,
      confidential,
    },
    // 2. Index
    {
      type: "index",
      label: "ÍNDICE",
      title: "EL RECORRIDO",
      items: SECTION_INDEX,
    },
    // 3. La Llamada (content)
    {
      type: "content",
      sectionLabel: "01 · LA LLAMADA — DISCOVERY CALL",
      headline: args.clientName.toUpperCase(),
      ...(args.llamadaSummary ? { summary: args.llamadaSummary } : {}),
      cards: args.llamadaCards,
      quote: {
        text: args.llamadaQuote,
        ...(args.llamadaQuoteSource ? { source: args.llamadaQuoteSource } : {}),
      },
    },
    // 4. La Auditoría (findings)
    {
      type: "findings",
      sectionLabel: "02 · LA AUDITORÍA — MARKETING DIGITAL",
      headline: "LO QUE ESTÁ PASANDO HOY",
      findings: audit.findings,
      keyInsight: audit.keyInsight,
    },
    // 5. El Mercado (research)
    {
      type: "research",
      sectionLabel: "03 · EL RESEARCH — MERCADO",
      headline: "EL MERCADO",
      marketCards: research.marketCards,
      ...(research.summary ? { summary: research.summary } : {}),
    },
    // 6. La Competencia (competitors)
    {
      type: "competitors",
      sectionLabel: "03 · EL RESEARCH — COMPETENCIA",
      headline: "LA COMPETENCIA",
      competitors: competitors.competitors,
      ...(competitors.summary ? { summary: competitors.summary } : {}),
    },
    // 7. Cliente Ideal (icp)
    {
      type: "icp",
      sectionLabel: "03 · EL RESEARCH — CLIENTE IDEAL",
      headline: "TU CLIENTE IDEAL",
      profiles: icp.profiles,
    },
    // 8. Roadmap
    {
      type: "roadmap",
      sectionLabel: "04 · LA PROPUESTA DE VALOR",
      headline: "ROADMAP DE EJECUCIÓN",
      ...(roadmap.description ? { description: roadmap.description } : {}),
      gantt: roadmap.gantt,
      phases: roadmap.phases,
    },
    // 9. Cómo Trabajamos (method)
    {
      type: "method",
      sectionLabel: "05 · CÓMO TRABAJAMOS",
      headline: "EL MÉTODO: 5 FASES + REE METRICS",
      phases,
      ...(args.currentPhase ? { currentPhase: args.currentPhase } : {}),
    },
    // 10. Valor del Servicio (pricing)
    {
      type: "pricing",
      sectionLabel: "06 · VALOR DEL SERVICIO",
      headline: `LO QUE PROPONEMOS PARA ${args.clientName.toUpperCase()}`,
      packages: investment.packages,
      ...(investment.breakdown ? { breakdown: investment.breakdown } : {}),
      scenarios: investment.scenarios,
      footnote: investment.footnote,
    },
    // 11. Closing
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
