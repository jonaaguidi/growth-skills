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
  share: string;
  strengths: string[];
  weaknesses: string[];
}

/** ICP profile (for icp slide) */
export interface ICPProfile {
  segment: string;
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
  deliverables: string[];
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
  firstMonth: string;
  monthly: string;
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
  duration: string;
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
}

export interface MethodSlide {
  type: "method";
  sectionLabel: string;
  headline: string;
  phases: MethodPhase[];
  currentPhase?: number;
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
}

export type Slide =
  | CoverSlide
  | IndexSlide
  | ContentSlide
  | FindingsSlide
  | ResearchSlide
  | CompetitorsSlide
  | ICPSlide
  | ValuePropsSlide
  | RoadmapSlide
  | MethodSlide
  | PricingSlide
  | PaymentMethodsSlide
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
