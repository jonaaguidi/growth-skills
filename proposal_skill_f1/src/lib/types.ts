// ── Shared types: contract between MCP tools and the ree-website viewer ──
// Must stay aligned with ree-website/src/lib/proposal-types.ts

/** Parsed client data from the discovery call */
export interface ClientProfile {
  name: string;
  slug: string;
  industry: string;
  businessModel: string;
  logoUrl?: string;
  painPoints: string[];
  goals: string[];
  currentState: string;
  foundersNotes: string;
  highlightQuote: string;
}

/** A single info card (used in La Llamada section) */
export interface InfoCard {
  label: string;
  value: string;
}

/** An audit finding */
export interface AuditFinding {
  area: string;
  finding: string;
  severity: "critical" | "warning" | "info";
}

/** Audit section output */
export interface AuditSection {
  overallScore: number;
  categories: { name: string; score: number; notes: string }[];
  findings: AuditFinding[];
  keyInsight: string;
  summary: string;
}

/** Competitor (for competitors slide) */
export interface Competitor {
  name: string;
  /** Texto secundario bajo el nombre (ej. lista de marcas del segmento) */
  description?: string;
  share: string;
  strengths: string[];
  weaknesses: string[];
  adsLibraryUrl?: string;
  /** URL de imagen (empieza con "/" o "http") o nombre de SVG built-in: "crown" | "tag" */
  icon?: string;
}

/** ICP profile (for icp slide) */
export interface ICPProfile {
  segment: string;
  /** Pill junto al nombre del segmento (ej. nivel de conciencia del producto) */
  badge?: string;
  description: string;
  pains: string[];
  desires: string[];
  objections: string[];
}

/** Gantt segment within a bar */
export interface GanttSegment {
  startWeek: number;
  endWeek: number;
  color: string;
  label?: string;
}

/** Gantt bar for roadmap */
export interface GanttBar {
  label: string;
  startWeek: number;
  endWeek: number;
  color: string;
  /** Optional sub-segments to show phases within a bar (build, test, optimize) */
  segments?: GanttSegment[];
}

/** Roadmap phase */
export interface RoadmapPhase {
  number: string;
  name: string;
  weeks: string;
  budget?: string;
  description: string;
  /** Texto plano: el viewer NO interpreta HTML en los deliverables */
  deliverables: string[];
  /** Color de la etapa del framework (Foundation/Build/Launch/Scale) */
  color?: string;
}

/** A value proposition angle (legacy, used by build-value-props) */
export interface ValueAngle {
  id: string;
  painPoint: string;
  solution: string;
  evidence: string;
  quote?: string;
}

/** Funnel strategy card (legacy, used by build-value-props) */
export interface FunnelCard {
  title: string;
  description: string;
  variant: "dark" | "outlined";
}

/** Value props section output (legacy) */
export interface ValuePropsSection {
  angles: ValueAngle[];
  funnels: FunnelCard[];
}

/** Pricing scenario row */
export interface PricingScenario {
  label: string;
  budget: string;
  estimatedLeads: string;
  estimatedCPA: string;
  estimatedROAS: string;
}

/** Pricing package */
export interface PricingPackage {
  name: string;
  fee: string;
  adSpend: string;
  features: string[];
  recommended?: boolean;
}

/** Pricing breakdown */
export interface PricingBreakdown {
  items: { concept: string; amount: string; note: string; recurring?: boolean }[];
  /** Caja "Implementacion (1er mes)". Omitir cuando no hay cargo de setup */
  firstMonth?: string;
  monthly: string;
  /** Label de la caja roja. Default: "Fee mensual" */
  monthlyLabel?: string;
  /** Caja gris "Presupuesto Ads (mensual)" */
  adSpend?: string;
  /** Label de la caja gris. Default: "Presupuesto Ads (mensual)" */
  adSpendLabel?: string;
}

/** Investment section output */
export interface InvestmentSection {
  cpaMaximo: string;
  cplObjetivo: string;
  packages: PricingPackage[];
  breakdown?: PricingBreakdown;
  scenarios: PricingScenario[];
  footnote: string;
}

/** Method phase (Cómo Trabajamos) */
export interface MethodPhase {
  number: string;
  name: string;
  duration?: string;
  description: string;
  deliverable?: string;
  deliverableIcon?: string;
}

// ── Section interfaces (tool outputs) ──

/** Research section output (simplified, market only) */
export interface ResearchSection {
  marketCards: { label: string; text: string }[];
  summary?: string;
}

/** Competitors section output */
export interface CompetitorsSection {
  competitors: Competitor[];
  summary?: string;
}

/** ICP section output */
export interface ICPSection {
  profiles: ICPProfile[];
}

/** Roadmap section output */
export interface RoadmapSection {
  description?: string;
  gantt: { totalWeeks: number; bars: GanttBar[] };
  phases: RoadmapPhase[];
}

// ── Slide types ──

export interface CoverSlide {
  type: "cover";
  badge: string;
  badgeLabel?: string;
  title: string;
  subtitle: string;
  confidential?: string;
  /** Logo del cliente junto al de REE. Debe ser una version blanca: el fondo es rojo */
  clientLogo?: string;
  icon?: "chatbot";
}

export interface IndexSlide {
  type: "index";
  label: string;
  title: string;
  items: { number: string; title: string; description: string }[];
}

export interface ContentSlide {
  type: "content";
  sectionLabel: string;
  headline: string;
  summary?: { label: string; value: string };
  cards: InfoCard[];
  quote?: { text: string; source?: string };
}

export interface FindingsSlide {
  type: "findings";
  sectionLabel: string;
  headline: string;
  findings: AuditFinding[];
  clientValue?: { label: string; text: string };
  keyInsight: string;
}

export interface ResearchSlide {
  type: "research";
  sectionLabel: string;
  headline: string;
  marketCards: { label: string; text: string }[];
  summary?: string;
}

export interface CompetitorsSlide {
  type: "competitors";
  sectionLabel: string;
  headline: string;
  competitors: Competitor[];
  summary?: string;
}

export interface ICPSlide {
  type: "icp";
  sectionLabel: string;
  headline: string;
  profiles: ICPProfile[];
  footnote?: string;
}

export interface ValuePropsSlide {
  type: "value-props";
  sectionLabel: string;
  headline: string;
  angles: ValueAngle[];
  funnels: FunnelCard[];
}

export interface RoadmapSlide {
  type: "roadmap";
  sectionLabel: string;
  headline: string;
  description?: string;
  gantt: { totalWeeks: number; bars: GanttBar[] };
  phases: RoadmapPhase[];
  footnote?: string;
}

export interface MethodSlide {
  type: "method";
  sectionLabel: string;
  headline: string;
  phases: MethodPhase[];
  currentPhase?: number;
  bottomNote?: string;
}

export interface PricingSlide {
  type: "pricing";
  sectionLabel: string;
  headline: string;
  packages: PricingPackage[];
  breakdown?: PricingBreakdown;
  scenarios: PricingScenario[];
  footnote: string;
}

/** Columna de un tier de servicio en el slide de tiers */
export interface ServiceTier {
  name: string;
  /** Precio principal, ej. "USD 500/mes" o "A cotizar" */
  price: string;
  /** Aclaracion bajo el precio, ej. "piso de entrada" */
  priceNote?: string;
  /** Pill sobre el nombre, ej. "RECOMENDADO" */
  badge?: string;
  /** Una linea de para quien es el tier */
  tagline: string;
  /** Un valor por cada fila de `rows`, en el mismo orden */
  values: string[];
  /** Resalta la columna en rojo REE */
  highlight?: boolean;
}

/** Tabla comparativa de tiers de servicio */
export interface TiersSlide {
  type: "tiers";
  sectionLabel: string;
  headline: string;
  description?: string;
  /** Labels de las filas de la tabla */
  rows: string[];
  tiers: ServiceTier[];
  /** Reglas generales en la barra oscura de abajo */
  rules?: { label: string; text: string; highlight?: boolean }[];
  footnote?: string;
}

/** Tile de KPI del mock de REE Metrics */
export interface MetricsKpi {
  label: string;
  value: string;
  /** Texto gris bajo el valor, ej. "LEADS DEL PERIODO" */
  note?: string;
  /** Flecha + texto de variacion, ej. { dir: "down", text: "8% . MEJORANDO", tone: "good" } */
  trend?: { dir: "up" | "down"; text: string; tone?: "good" | "bad" };
  /** Borde rojo REE: el numero que importa */
  highlight?: boolean;
}

/** Fila de la tabla de anuncios del mock */
export interface MetricsAdRow {
  name: string;
  utm?: string;
  spend: string;
  results: string;
  cpr: string;
  status: string;
  /** win = verde, test = amarillo, lose = rojo, off = gris */
  tone: "win" | "test" | "lose" | "off";
}

/** Grafico de evolucion del mock */
export interface MetricsChart {
  label: string;
  /** Serie de valores, se escala sola */
  points: number[];
  /** Linea punteada de objetivo, en la misma unidad que `points` */
  objective?: number;
  objectiveLabel?: string;
  /** Prefijo de los valores del eje Y, ej. "$" */
  prefix?: string;
  /** Labels del eje X (inicio, medio, fin) */
  xLabels?: string[];
  seriesLabel?: string;
}

/** Slide de producto de REE Metrics: mock del dashboard + features */
export interface ReeMetricsSlide {
  type: "ree-metrics";
  sectionLabel: string;
  headline: string;
  description?: string;
  dashboard: {
    /** Items del nav del mock. Default: DASHBOARD, INVERSION, TIMELINE, E-COMMERCE, INTEGRACIONES */
    nav?: string[];
    rangeLabel?: string;
    /** Pill del body, ej. "DEMO . DATOS DE MUESTRA" */
    badge?: string;
    kpis: MetricsKpi[];
    tableLabel?: string;
    rows: MetricsAdRow[];
    chart?: MetricsChart;
  };
  /** Cards de abajo: que resuelve la plataforma */
  features?: { label: string; text: string }[];
  footnote?: string;
}

/** Payment method card */
export interface PaymentMethod {
  name: string;
  icon: string;
  details: string[];
}

/** Payment methods slide */
export interface PaymentMethodsSlide {
  type: "payment-methods";
  sectionLabel: string;
  headline: string;
  methods: PaymentMethod[];
  paymentTerms: string;
  currencyNote: string;
  latePayment: string;
  footnote?: string;
}

export interface ClosingSlide {
  type: "closing";
  partnership: string;
  headline: string;
  steps: { number: string; text: string }[];
  /** Logo del cliente junto al de REE. Debe ser una version blanca: el fondo es rojo */
  clientLogo?: string;
}

type SlideExtras = { hidden?: boolean };

export type Slide =
  | (CoverSlide & SlideExtras)
  | (IndexSlide & SlideExtras)
  | (ContentSlide & SlideExtras)
  | (FindingsSlide & SlideExtras)
  | (ResearchSlide & SlideExtras)
  | (CompetitorsSlide & SlideExtras)
  | (ICPSlide & SlideExtras)
  | (ValuePropsSlide & SlideExtras)
  | (RoadmapSlide & SlideExtras)
  | (MethodSlide & SlideExtras)
  | (PricingSlide & SlideExtras)
  | (TiersSlide & SlideExtras)
  | (ReeMetricsSlide & SlideExtras)
  | (PaymentMethodsSlide & SlideExtras)
  | (ClosingSlide & SlideExtras);

/** Full diagnostic presentation JSON */
export interface DiagnosticPresentation {
  version: "1.0";
  client: {
    name: string;
    slug: string;
    industry: string;
    logoUrl?: string;
  };
  createdAt: string;
  slides: Slide[];
}
