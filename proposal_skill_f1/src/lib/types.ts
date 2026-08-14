// ── Shared types: contract between MCP tools and the ree-website viewer ──

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

/** ICP definition */
export interface ICPDefinition {
  demographics: string;
  psychographics: string;
  behaviors: string;
  channels: string;
}

/** Competitor entry */
export interface CompetitorEntry {
  name: string;
  positioning: string;
  weakness: string;
}

/** Research section output */
export interface ResearchSection {
  marketOverview: string;
  marketInsights: string[];
  icp: ICPDefinition;
  competitors: CompetitorEntry[];
  dataPoints: { label: string; value: string }[];
}

/** A value proposition angle */
export interface ValueAngle {
  id: string;
  painPoint: string;
  solution: string;
  evidence: string;
  quote?: string;
}

/** Funnel strategy card */
export interface FunnelCard {
  title: string;
  description: string;
  variant: "dark" | "outlined";
}

/** Value props section output */
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

/** Investment section output */
export interface InvestmentSection {
  cpaMaximo: string;
  cplObjetivo: string;
  packages: PricingPackage[];
  scenarios: PricingScenario[];
  footnote: string;
}

/** Method phase (Cómo Trabajamos) */
export interface MethodPhase {
  number: string;
  name: string;
  duration: string;
  description: string;
}

// ── Slide types ──

export interface CoverSlide {
  type: "cover";
  badge: string;
  title: string;
  subtitle: string;
  confidential?: string;
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
  cards: InfoCard[];
  quote?: { text: string; source: string };
}

export interface FindingsSlide {
  type: "findings";
  sectionLabel: string;
  headline: string;
  findings: AuditFinding[];
  keyInsight: string;
}

export interface ResearchSlide {
  type: "research";
  sectionLabel: string;
  headline: string;
  marketPanel: { title: string; content: string; insights: string[] };
  icpPanel: { title: string; icp: ICPDefinition };
  dataPoints: { label: string; value: string }[];
}

export interface ValuePropsSlide {
  type: "value-props";
  sectionLabel: string;
  headline: string;
  angles: ValueAngle[];
  funnels: FunnelCard[];
}

export interface MethodSlide {
  type: "method";
  sectionLabel: string;
  headline: string;
  phases: MethodPhase[];
}

export interface PricingSlide {
  type: "pricing";
  sectionLabel: string;
  headline: string;
  packages: PricingPackage[];
  scenarios: PricingScenario[];
  footnote: string;
}

export interface ClosingSlide {
  type: "closing";
  partnership: string;
  headline: string;
  steps: { number: string; text: string }[];
}

export type Slide =
  | CoverSlide
  | IndexSlide
  | ContentSlide
  | FindingsSlide
  | ResearchSlide
  | ValuePropsSlide
  | MethodSlide
  | PricingSlide
  | ClosingSlide;

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
