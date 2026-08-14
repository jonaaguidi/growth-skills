import { createMetaClient } from "../../lib/meta-client.js";

export const name = "get-insights";

export const description =
  "Obtiene metricas de rendimiento (spend, impressions, clicks, CTR, CPC, etc.) " +
  "de una cuenta, campana, adset o ad de Meta, con filtros de fecha y nivel de desglose.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    objectId: {
      type: "string",
      description: "ID del objeto de Meta (cuenta act_*, campana, adset o ad).",
    },
    datePreset: {
      type: "string",
      description:
        "Preset de fecha: today, yesterday, last_7d, last_14d, last_30d, this_month, last_month, etc.",
    },
    since: {
      type: "string",
      description: "Fecha inicio (YYYY-MM-DD). Usar junto con 'until'.",
    },
    until: {
      type: "string",
      description: "Fecha fin (YYYY-MM-DD). Usar junto con 'since'.",
    },
    level: {
      type: "string",
      enum: ["account", "campaign", "adset", "ad"],
      description: "Nivel de desglose de los insights.",
    },
    timeIncrement: {
      type: "string",
      description: "Desglose temporal: '1' para diario, '7' para semanal, 'monthly', etc.",
    },
  },
  required: ["objectId"],
};

export async function handler(args: {
  objectId: string;
  datePreset?: string;
  since?: string;
  until?: string;
  level?: "account" | "campaign" | "adset" | "ad";
  timeIncrement?: string;
}) {
  const client = createMetaClient();
  const result = await client.getInsights(args.objectId, {
    datePreset: args.datePreset,
    timeRange: args.since && args.until ? { since: args.since, until: args.until } : undefined,
    level: args.level,
    timeIncrement: args.timeIncrement,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result.data, null, 2),
      },
    ],
  };
}
