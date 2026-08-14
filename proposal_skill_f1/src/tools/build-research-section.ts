import type { ResearchSection } from "../lib/types.js";

export const name = "build-research-section";

export const description =
  "Arma la sección 03 (El Research) con análisis de mercado e ICP. " +
  "Devuelve dos paneles: mercado (overview + insights) y cliente ideal (ICP definido).";

export const inputSchema = {
  type: "object" as const,
  properties: {
    marketOverview: {
      type: "string",
      description: "Overview del mercado/industria del cliente.",
    },
    marketInsights: {
      type: "array",
      items: { type: "string" },
      description: "Insights clave del mercado (3-5 puntos).",
    },
    icp: {
      type: "object",
      properties: {
        demographics: { type: "string" },
        psychographics: { type: "string" },
        behaviors: { type: "string" },
        channels: { type: "string" },
      },
      required: ["demographics", "psychographics", "behaviors", "channels"],
      description: "Definición del ICP (Ideal Customer Profile).",
    },
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          positioning: { type: "string" },
          weakness: { type: "string" },
        },
        required: ["name", "positioning", "weakness"],
      },
      description: "Competidores principales con posicionamiento y debilidades.",
    },
    dataPoints: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
      description: "Data points clave del research (ej: tamaño de mercado, CAC promedio).",
    },
  },
  required: ["marketOverview", "marketInsights", "icp", "competitors", "dataPoints"],
};

interface ResearchInput {
  marketOverview: string;
  marketInsights: string[];
  icp: { demographics: string; psychographics: string; behaviors: string; channels: string };
  competitors: { name: string; positioning: string; weakness: string }[];
  dataPoints: { label: string; value: string }[];
}

export async function handler(args: ResearchInput) {
  const section: ResearchSection = {
    marketOverview: args.marketOverview.trim(),
    marketInsights: args.marketInsights.map((i) => i.trim()).filter(Boolean),
    icp: {
      demographics: args.icp.demographics.trim(),
      psychographics: args.icp.psychographics.trim(),
      behaviors: args.icp.behaviors.trim(),
      channels: args.icp.channels.trim(),
    },
    competitors: args.competitors.map((c) => ({
      name: c.name.trim(),
      positioning: c.positioning.trim(),
      weakness: c.weakness.trim(),
    })),
    dataPoints: args.dataPoints.map((d) => ({
      label: d.label.trim(),
      value: d.value.trim(),
    })),
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(section, null, 2),
      },
    ],
  };
}
