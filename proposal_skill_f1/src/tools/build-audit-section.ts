import type { AuditSection, AuditFinding } from "../lib/types.js";

export const name = "build-audit-section";

export const description =
  "Arma la sección 02 (La Auditoría) de la propuesta. " +
  "Recibe hallazgos de auditoría de Meta Ads, tracking y contenido, " +
  "y devuelve la sección estructurada con score, findings y key insight.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    overallScore: {
      type: "number",
      description: "Score general de la auditoría (1-10).",
    },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          score: { type: "number" },
          notes: { type: "string" },
        },
        required: ["name", "score", "notes"],
      },
      description: "Categorías evaluadas con score individual.",
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          finding: { type: "string" },
          severity: {
            type: "string",
            enum: ["critical", "warning", "info"],
          },
        },
        required: ["area", "finding", "severity"],
      },
      description: "Hallazgos individuales de la auditoría.",
    },
    keyInsight: {
      type: "string",
      description: "El hallazgo clave más importante (para la card destacada).",
    },
    summary: {
      type: "string",
      description: "Resumen narrativo de la auditoría.",
    },
  },
  required: ["overallScore", "categories", "findings", "keyInsight", "summary"],
};

interface AuditInput {
  overallScore: number;
  categories: { name: string; score: number; notes: string }[];
  findings: { area: string; finding: string; severity: string }[];
  keyInsight: string;
  summary: string;
}

export async function handler(args: AuditInput) {
  const section: AuditSection = {
    overallScore: Math.max(1, Math.min(10, Math.round(args.overallScore))),
    categories: args.categories.map((c) => ({
      name: c.name.trim(),
      score: Math.max(1, Math.min(10, Math.round(c.score))),
      notes: c.notes.trim(),
    })),
    findings: args.findings.map((f) => ({
      area: f.area.trim(),
      finding: f.finding.trim(),
      severity: (["critical", "warning", "info"].includes(f.severity)
        ? f.severity
        : "info") as AuditFinding["severity"],
    })),
    keyInsight: args.keyInsight.trim(),
    summary: args.summary.trim(),
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
