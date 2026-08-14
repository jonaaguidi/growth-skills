import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as parseDiscoveryCall from "./tools/parse-discovery-call.js";
import * as buildAuditSection from "./tools/build-audit-section.js";
import * as buildResearchSection from "./tools/build-research-section.js";
import * as buildValueProps from "./tools/build-value-props.js";
import * as calculateInvestment from "./tools/calculate-investment.js";
import * as composeDiagnostic from "./tools/compose-diagnostic.js";

const server = new McpServer({
  name: "diagnostico-skill-f1",
  version: "0.1.0",
});

// parse-discovery-call
server.tool(
  parseDiscoveryCall.name,
  parseDiscoveryCall.description,
  {
    transcript: z.string(),
    summary: z.string(),
    foundersVision: z.string(),
    clientName: z.string(),
    industry: z.string(),
    businessModel: z.string(),
    painPoints: z.array(z.string()),
    goals: z.array(z.string()),
    currentState: z.string(),
    highlightQuote: z.string(),
  },
  async (args) => parseDiscoveryCall.handler(args)
);

// build-audit-section
server.tool(
  buildAuditSection.name,
  buildAuditSection.description,
  {
    overallScore: z.number(),
    categories: z.array(
      z.object({ name: z.string(), score: z.number(), notes: z.string() })
    ),
    findings: z.array(
      z.object({
        area: z.string(),
        finding: z.string(),
        severity: z.enum(["critical", "warning", "info"]),
      })
    ),
    keyInsight: z.string(),
    summary: z.string(),
  },
  async (args) => buildAuditSection.handler(args)
);

// build-research-section
server.tool(
  buildResearchSection.name,
  buildResearchSection.description,
  {
    marketOverview: z.string(),
    marketInsights: z.array(z.string()),
    icp: z.object({
      demographics: z.string(),
      psychographics: z.string(),
      behaviors: z.string(),
      channels: z.string(),
    }),
    competitors: z.array(
      z.object({ name: z.string(), positioning: z.string(), weakness: z.string() })
    ),
    dataPoints: z.array(z.object({ label: z.string(), value: z.string() })),
  },
  async (args) => buildResearchSection.handler(args)
);

// build-value-props
server.tool(
  buildValueProps.name,
  buildValueProps.description,
  {
    angles: z.array(
      z.object({
        id: z.string(),
        painPoint: z.string(),
        solution: z.string(),
        evidence: z.string(),
        quote: z.string().optional(),
      })
    ),
    funnels: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        variant: z.enum(["dark", "outlined"]),
      })
    ),
  },
  async (args) => buildValueProps.handler(args)
);

// calculate-investment
server.tool(
  calculateInvestment.name,
  calculateInvestment.description,
  {
    averageTicket: z.number(),
    margin: z.number().optional(),
    acquisitionPct: z.number().optional(),
    closeRate: z.number().optional(),
    budgets: z.array(z.number()),
    currency: z.string().optional(),
    packages: z
      .array(
        z.object({
          name: z.string(),
          fee: z.string(),
          adSpend: z.string(),
          features: z.array(z.string()),
          recommended: z.boolean().optional(),
        })
      )
      .optional(),
    footnote: z.string().optional(),
  },
  async (args) => calculateInvestment.handler(args)
);

// compose-diagnostic
server.tool(
  composeDiagnostic.name,
  composeDiagnostic.description,
  {
    clientName: z.string(),
    clientSlug: z.string(),
    clientIndustry: z.string(),
    clientLogoUrl: z.string().optional(),
    llamadaCards: z.array(z.object({ label: z.string(), value: z.string() })),
    llamadaQuote: z.string(),
    llamadaQuoteSource: z.string(),
    auditSection: z.string(),
    researchSection: z.string(),
    valuePropsSection: z.string(),
    methodPhases: z
      .array(
        z.object({
          number: z.string(),
          name: z.string(),
          duration: z.string(),
          description: z.string(),
        })
      )
      .optional(),
    investmentSection: z.string(),
    closingHeadline: z.string().optional(),
    closingSteps: z
      .array(z.object({ number: z.string(), text: z.string() }))
      .optional(),
  },
  async (args) => composeDiagnostic.handler(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
