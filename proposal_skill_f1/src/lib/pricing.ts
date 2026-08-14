import type { PricingPackage, PricingScenario } from "./types.js";

// ── REE Pricing constants ──

export const DEFAULT_MARGIN = 0.3;
export const DEFAULT_ACQUISITION_PCT = 0.15;
export const DEFAULT_CLOSE_RATE = 0.2;

export const DEFAULT_PACKAGES: PricingPackage[] = [
  {
    name: "Estándar",
    fee: "USD 1.500/mes",
    adSpend: "USD 1.000–2.000/mes",
    features: [
      "Gestión de pauta Meta + Google",
      "Creativos estáticos (4/mes)",
      "Reportes mensuales",
      "Reunión mensual de revisión",
    ],
  },
  {
    name: "Intensivo",
    fee: "USD 2.500/mes",
    adSpend: "USD 2.000–5.000/mes",
    features: [
      "Gestión de pauta Meta + Google",
      "Creativos estáticos + video (8/mes)",
      "Dashboard REE Metrics en vivo",
      "Reunión quincenal de optimización",
      "Testing A/B de creativos",
    ],
    recommended: true,
  },
  {
    name: "Agresivo",
    fee: "USD 4.000/mes",
    adSpend: "USD 5.000–15.000/mes",
    features: [
      "Gestión full-funnel Meta + Google + TikTok",
      "Producción creativa ilimitada",
      "Dashboard REE Metrics en vivo",
      "Reunión semanal de performance",
      "Testing A/B + iteración de creativos",
      "Landing pages dedicadas",
    ],
  },
];

// ── Unit economics helpers ──

/** CPA máximo = ticket × margen × % de presupuesto dedicado a adquisición */
export function calculateMaxCPA(
  averageTicket: number,
  margin: number = DEFAULT_MARGIN,
  acquisitionPct: number = DEFAULT_ACQUISITION_PCT
): number {
  return averageTicket * margin * acquisitionPct;
}

/** CPL objetivo = CPA máximo × tasa de cierre */
export function calculateTargetCPL(
  maxCPA: number,
  closeRate: number = DEFAULT_CLOSE_RATE
): number {
  return maxCPA * closeRate;
}

/** Build 3 scenarios (conservative, moderate, aggressive) */
export function buildScenarios(
  averageTicket: number,
  budgets: number[],
  currency: string = "USD",
  margin: number = DEFAULT_MARGIN,
  acquisitionPct: number = DEFAULT_ACQUISITION_PCT,
  closeRate: number = DEFAULT_CLOSE_RATE
): PricingScenario[] {
  const labels = ["Conservador", "Moderado", "Agresivo"];
  const maxCPA = calculateMaxCPA(averageTicket, margin, acquisitionPct);
  const targetCPL = calculateTargetCPL(maxCPA, closeRate);

  return budgets.map((budget, i) => {
    const estimatedLeads = Math.round(budget / targetCPL);
    const estimatedClients = Math.round(estimatedLeads * closeRate);
    const revenue = estimatedClients * averageTicket;
    const roas = budget > 0 ? (revenue / budget).toFixed(1) : "—";

    return {
      label: labels[i] ?? `Escenario ${i + 1}`,
      budget: `${currency} ${budget.toLocaleString("es-AR")}`,
      estimatedLeads: `${estimatedLeads} leads/mes`,
      estimatedCPA: `${currency} ${Math.round(maxCPA).toLocaleString("es-AR")}`,
      estimatedROAS: `${roas}x`,
    };
  });
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return `${currency} ${amount.toLocaleString("es-AR")}`;
}
