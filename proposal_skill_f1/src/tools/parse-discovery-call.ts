import type { ClientProfile } from "../lib/types.js";

export const name = "parse-discovery-call";

export const description =
  "Estructura los datos de la discovery call (Fase 0) en un perfil de cliente. " +
  "Toma el transcript de Fathom, el summary, y la visión de founders para generar " +
  "un perfil normalizado con pain points, objetivos y quote destacada.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    transcript: {
      type: "string",
      description: "Transcript completo de la discovery call (de Fathom).",
    },
    summary: {
      type: "string",
      description: "Resumen de la meeting (de Fathom).",
    },
    foundersVision: {
      type: "string",
      description:
        "Documento de visión de los founders de REE para este cliente: " +
        "criterio experto, prioridades, observaciones clave.",
    },
    clientName: {
      type: "string",
      description: "Nombre del cliente o empresa.",
    },
    industry: {
      type: "string",
      description: "Industria del cliente.",
    },
    businessModel: {
      type: "string",
      description: "Modelo de negocio (e.g. ecommerce, SaaS, servicios profesionales).",
    },
    painPoints: {
      type: "array",
      items: { type: "string" },
      description: "Lista de pain points identificados.",
    },
    goals: {
      type: "array",
      items: { type: "string" },
      description: "Objetivos del cliente.",
    },
    currentState: {
      type: "string",
      description: "Descripción del estado actual del marketing del cliente.",
    },
    highlightQuote: {
      type: "string",
      description: "Quote destacada del cliente durante la llamada.",
    },
  },
  required: [
    "transcript",
    "summary",
    "foundersVision",
    "clientName",
    "industry",
    "businessModel",
    "painPoints",
    "goals",
    "currentState",
    "highlightQuote",
  ],
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ParseInput {
  transcript: string;
  summary: string;
  foundersVision: string;
  clientName: string;
  industry: string;
  businessModel: string;
  painPoints: string[];
  goals: string[];
  currentState: string;
  highlightQuote: string;
}

export async function handler(args: ParseInput) {
  const profile: ClientProfile = {
    name: args.clientName.trim(),
    slug: toSlug(args.clientName),
    industry: args.industry.trim(),
    businessModel: args.businessModel.trim(),
    painPoints: args.painPoints.map((p) => p.trim()).filter(Boolean),
    goals: args.goals.map((g) => g.trim()).filter(Boolean),
    currentState: args.currentState.trim(),
    foundersNotes: args.foundersVision.trim(),
    highlightQuote: args.highlightQuote.trim(),
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(profile, null, 2),
      },
    ],
  };
}
