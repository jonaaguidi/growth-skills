import type { RoadmapSection } from "../lib/types.js";

export const name = "build-roadmap-section";

export const description =
  "Arma la sección de Roadmap (slide roadmap) con diagrama Gantt y fases de ejecución. " +
  "Reemplaza a la propuesta de valor como sección 04.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    description: {
      type: "string",
      description: "Descripción general del roadmap y objetivo estratégico.",
    },
    totalWeeks: {
      type: "number",
      description: "Duración total del roadmap en semanas (para el Gantt).",
    },
    bars: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          startWeek: { type: "number" },
          endWeek: { type: "number" },
          color: { type: "string" },
        },
        required: ["label", "startWeek", "endWeek", "color"],
      },
      description: "Barras del diagrama Gantt.",
    },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "string" },
          name: { type: "string" },
          weeks: { type: "string" },
          budget: { type: "string" },
          description: { type: "string" },
          deliverables: { type: "array", items: { type: "string" } },
        },
        required: ["number", "name", "weeks", "description", "deliverables"],
      },
      description: "Fases del roadmap con entregables.",
    },
  },
  required: ["totalWeeks", "bars", "phases"],
};

interface RoadmapInput {
  description?: string;
  totalWeeks: number;
  bars: { label: string; startWeek: number; endWeek: number; color: string }[];
  phases: {
    number: string;
    name: string;
    weeks: string;
    budget?: string;
    description: string;
    deliverables: string[];
  }[];
}

export async function handler(args: RoadmapInput) {
  const section: RoadmapSection = {
    gantt: {
      totalWeeks: args.totalWeeks,
      bars: args.bars.map((b) => ({
        label: b.label.trim(),
        startWeek: b.startWeek,
        endWeek: b.endWeek,
        color: b.color.trim(),
      })),
    },
    phases: args.phases.map((p) => {
      const phase: RoadmapSection["phases"][number] = {
        number: p.number.trim(),
        name: p.name.trim(),
        weeks: p.weeks.trim(),
        description: p.description.trim(),
        deliverables: p.deliverables.map((d) => d.trim()),
      };
      if (p.budget) phase.budget = p.budget.trim();
      return phase;
    }),
  };

  if (args.description) {
    section.description = args.description.trim();
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
