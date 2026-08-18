import type { CompetitorsSection } from "../lib/types.js";

export const name = "build-competitors-section";

export const description =
  "Arma la sección de competencia (slide competitors). " +
  "Recibe competidores con market share, fortalezas y debilidades.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          share: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
        },
        required: ["name", "share", "strengths", "weaknesses"],
      },
      description: "Competidores principales con market share, fortalezas y debilidades.",
    },
    summary: {
      type: "string",
      description: "Resumen del análisis competitivo con posicionamiento diferencial del cliente.",
    },
  },
  required: ["competitors"],
};

interface CompetitorsInput {
  competitors: { name: string; share: string; strengths: string[]; weaknesses: string[] }[];
  summary?: string;
}

export async function handler(args: CompetitorsInput) {
  const section: CompetitorsSection = {
    competitors: args.competitors.map((c) => ({
      name: c.name.trim(),
      share: c.share.trim(),
      strengths: c.strengths.map((s) => s.trim()),
      weaknesses: c.weaknesses.map((w) => w.trim()),
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
