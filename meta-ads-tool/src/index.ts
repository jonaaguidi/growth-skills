import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as listAccounts from "./tools/meta-ads/list-accounts.js";
import * as auditCampaigns from "./tools/meta-ads/audit-campaigns.js";
import * as getInsights from "./tools/meta-ads/get-insights.js";

const server = new McpServer({
  name: "ree-tools",
  version: "0.1.0",
});

// list-accounts
server.tool(
  listAccounts.name,
  listAccounts.description,
  { userId: z.string().optional() },
  async (args) => listAccounts.handler(args)
);

// audit-campaigns
server.tool(
  auditCampaigns.name,
  auditCampaigns.description,
  {
    adAccountId: z.string(),
    includeInsights: z.boolean().optional(),
  },
  async (args) => auditCampaigns.handler(args)
);

// get-insights
server.tool(
  getInsights.name,
  getInsights.description,
  {
    objectId: z.string(),
    datePreset: z.string().optional(),
    since: z.string().optional(),
    until: z.string().optional(),
    level: z.enum(["account", "campaign", "adset", "ad"]).optional(),
    timeIncrement: z.string().optional(),
  },
  async (args) => getInsights.handler(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
