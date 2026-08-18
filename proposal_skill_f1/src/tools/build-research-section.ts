import type { ResearchSection } from "../lib/types.js";

export const name = "build-research-section";

export const description =
  "Arma la sección 03 (El Research — Mercado) con tarjetas de mercado. " +
  "Competidores e ICP se manejan en tools separadas (build-competitors-section, build-icp-section).";

export const inputSchema = {
  type: "object" as const,
  properties: {
    marketCards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          text: { type: "string" },
        },
        required: ["label", "text"],
      },
      description: "Tarjetas de mercado (ej: tamaño de mercado, tendencia, demanda, estacionalidad).",
    },
    summary: {
      type: "string",
      description: "Resumen opcional del research de mercado.",
    },
  },
  required: ["marketCards"],
};

interface ResearchInput {
  marketCards: { label: string; text: string }[];
  summary?: string;
}

export async function handler(args: ResearchInput) {
  const section: ResearchSection = {
    marketCards: args.marketCards.map((c) => ({
      label: c.label.trim(),
      text: c.text.trim(),
    })),
  };

  if (args.summary) {
    section.summary = args.summary.trim();
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
