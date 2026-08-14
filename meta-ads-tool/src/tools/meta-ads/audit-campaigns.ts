import { createMetaClient } from "../../lib/meta-client.js";

export const name = "audit-campaigns";

export const description =
  "Obtiene las campanas de una cuenta de anuncios de Meta y analiza su performance. " +
  "Devuelve el listado de campanas con su estado y metricas si se solicitan.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    adAccountId: {
      type: "string",
      description: "ID de la cuenta de anuncios (ej: act_123456789).",
    },
    includeInsights: {
      type: "boolean",
      description: "Si true, obtiene tambien insights a nivel campana (last_30d).",
    },
  },
  required: ["adAccountId"],
};

export async function handler(args: { adAccountId: string; includeInsights?: boolean }) {
  const client = createMetaClient();
  const campaigns = await client.getCampaigns(args.adAccountId);

  let insights = null;
  if (args.includeInsights) {
    insights = await client.getInsights(args.adAccountId, {
      datePreset: "last_30d",
      level: "campaign",
    });
  }

  const summary = {
    totalCampaigns: campaigns.data.length,
    byStatus: campaigns.data.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    campaigns: campaigns.data,
    ...(insights ? { insights: insights.data } : {}),
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(summary, null, 2),
      },
    ],
  };
}
