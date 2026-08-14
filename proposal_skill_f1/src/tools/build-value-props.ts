import type { ValuePropsSection, ValueAngle, FunnelCard } from "../lib/types.js";

export const name = "build-value-props";

export const description =
  "Arma la sección 04 (La Propuesta de Valor). " +
  "Genera ángulos priorizados que mapean pain point → solución REE → evidencia, " +
  "más las cards de estrategia de funnel.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    angles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "ID del ángulo (ej: D1, D2, D3)." },
          painPoint: { type: "string" },
          solution: { type: "string" },
          evidence: { type: "string" },
          quote: { type: "string" },
        },
        required: ["id", "painPoint", "solution", "evidence"],
      },
      description: "Ángulos de valor, cada uno mapeando un dolor a una solución.",
    },
    funnels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          variant: { type: "string", enum: ["dark", "outlined"] },
        },
        required: ["title", "description", "variant"],
      },
      description: "Cards de estrategia de funnel (dark = principal, outlined = secundaria).",
    },
  },
  required: ["angles", "funnels"],
};

interface ValuePropsInput {
  angles: { id: string; painPoint: string; solution: string; evidence: string; quote?: string }[];
  funnels: { title: string; description: string; variant: string }[];
}

export async function handler(args: ValuePropsInput) {
  const section: ValuePropsSection = {
    angles: args.angles.map((a) => {
      const angle: ValueAngle = {
        id: a.id.trim(),
        painPoint: a.painPoint.trim(),
        solution: a.solution.trim(),
        evidence: a.evidence.trim(),
      };
      if (a.quote) angle.quote = a.quote.trim();
      return angle;
    }),
    funnels: args.funnels.map((f) => ({
      title: f.title.trim(),
      description: f.description.trim(),
      variant: (f.variant === "dark" ? "dark" : "outlined") as FunnelCard["variant"],
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
