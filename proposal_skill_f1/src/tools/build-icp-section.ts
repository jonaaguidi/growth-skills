import type { ICPSection } from "../lib/types.js";

export const name = "build-icp-section";

export const description =
  "Arma la sección de Cliente Ideal (slide icp). " +
  "Recibe perfiles de ICP con segmento, dolores, deseos y objeciones.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    profiles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          segment: { type: "string" },
          description: { type: "string" },
          pains: { type: "array", items: { type: "string" } },
          desires: { type: "array", items: { type: "string" } },
          objections: { type: "array", items: { type: "string" } },
        },
        required: ["segment", "description", "pains", "desires", "objections"],
      },
      description: "Perfiles de cliente ideal con segmento, descripción, dolores, deseos y objeciones.",
    },
  },
  required: ["profiles"],
};

interface ICPInput {
  profiles: {
    segment: string;
    description: string;
    pains: string[];
    desires: string[];
    objections: string[];
  }[];
}

export async function handler(args: ICPInput) {
  const section: ICPSection = {
    profiles: args.profiles.map((p) => ({
      segment: p.segment.trim(),
      description: p.description.trim(),
      pains: p.pains.map((s) => s.trim()),
      desires: p.desires.map((s) => s.trim()),
      objections: p.objections.map((s) => s.trim()),
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
