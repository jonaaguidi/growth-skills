import type { InvestmentSection, PricingBreakdown } from "../lib/types.js";
import {
  calculateMaxCPA,
  calculateTargetCPL,
  buildScenarios,
  formatCurrency,
  DEFAULT_PACKAGES,
} from "../lib/pricing.js";

export const name = "calculate-investment";

export const description =
  "Calcula unit economics (CPA máximo, CPL objetivo) y arma la sección 06 (El Plan + La Inversión). " +
  "Genera 3 escenarios de inversión y paquetes de pricing.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    averageTicket: {
      type: "number",
      description: "Ticket promedio del cliente en USD.",
    },
    margin: {
      type: "number",
      description: "Margen de ganancia (0-1). Default: 0.3.",
    },
    acquisitionPct: {
      type: "number",
      description: "% del margen dedicado a adquisición (0-1). Default: 0.15.",
    },
    closeRate: {
      type: "number",
      description: "Tasa de cierre lead → cliente (0-1). Default: 0.2.",
    },
    budgets: {
      type: "array",
      items: { type: "number" },
      description: "3 presupuestos mensuales de pauta para los escenarios (USD).",
    },
    currency: {
      type: "string",
      description: "Moneda para mostrar. Default: USD.",
    },
    packages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          fee: { type: "string" },
          adSpend: { type: "string" },
          features: { type: "array", items: { type: "string" } },
          recommended: { type: "boolean" },
        },
        required: ["name", "fee", "adSpend", "features"],
      },
      description: "Paquetes personalizados. Si no se envían, usa los default de REE.",
    },
    footnote: {
      type: "string",
      description: "Nota al pie sobre los escenarios.",
    },
    breakdown: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              concept: { type: "string" },
              amount: { type: "string" },
              note: { type: "string" },
            },
            required: ["concept", "amount", "note"],
          },
        },
        firstMonth: { type: "string" },
        monthly: { type: "string" },
      },
      required: ["items", "firstMonth", "monthly"],
      description: "Desglose detallado de costos (fee, pauta, integraciones).",
    },
  },
  required: ["averageTicket", "budgets"],
};

interface InvestmentInput {
  averageTicket: number;
  margin?: number;
  acquisitionPct?: number;
  closeRate?: number;
  budgets: number[];
  currency?: string;
  packages?: {
    name: string;
    fee: string;
    adSpend: string;
    features: string[];
    recommended?: boolean;
  }[];
  footnote?: string;
  breakdown?: PricingBreakdown;
}

export async function handler(args: InvestmentInput) {
  const currency = args.currency ?? "USD";
  const margin = args.margin ?? undefined;
  const acquisitionPct = args.acquisitionPct ?? undefined;
  const closeRate = args.closeRate ?? undefined;

  const maxCPA = calculateMaxCPA(args.averageTicket, margin, acquisitionPct);
  const targetCPL = calculateTargetCPL(maxCPA, closeRate);

  const scenarios = buildScenarios(
    args.averageTicket,
    args.budgets.slice(0, 3),
    currency,
    margin,
    acquisitionPct,
    closeRate
  );

  const section: InvestmentSection = {
    cpaMaximo: formatCurrency(Math.round(maxCPA), currency),
    cplObjetivo: formatCurrency(Math.round(targetCPL), currency),
    packages: args.packages ?? DEFAULT_PACKAGES,
    scenarios,
    footnote:
      args.footnote ??
      "Los escenarios son estimaciones basadas en benchmarks de la industria. " +
        "Los resultados reales dependen de la calidad de creativos, landing pages y proceso de ventas.",
  };

  if (args.breakdown) {
    section.breakdown = args.breakdown;
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(section, null, 2),
      },
    ],
  };
}
