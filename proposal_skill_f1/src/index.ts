import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import * as parseDiscoveryCall from "./tools/parse-discovery-call.js";
import * as buildAuditSection from "./tools/build-audit-section.js";
import * as buildResearchSection from "./tools/build-research-section.js";
import * as buildCompetitorsSection from "./tools/build-competitors-section.js";
import * as buildICPSection from "./tools/build-icp-section.js";
import * as buildRoadmapSection from "./tools/build-roadmap-section.js";
import * as buildValueProps from "./tools/build-value-props.js";
import * as calculateInvestment from "./tools/calculate-investment.js";
import * as composeDiagnostic from "./tools/compose-diagnostic.js";

const server = new McpServer({
  name: "diagnostico-skill-f1",
  version: "0.2.0",
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

// build-research-section (simplified — market only)
server.tool(
  buildResearchSection.name,
  buildResearchSection.description,
  {
    marketCards: z.array(
      z.object({ label: z.string(), text: z.string() })
    ),
    summary: z.string().optional(),
  },
  async (args) => buildResearchSection.handler(args)
);

// build-competitors-section
server.tool(
  buildCompetitorsSection.name,
  buildCompetitorsSection.description,
  {
    competitors: z.array(
      z.object({
        name: z.string(),
        share: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
      })
    ),
    summary: z.string().optional(),
  },
  async (args) => buildCompetitorsSection.handler(args)
);

// build-icp-section
server.tool(
  buildICPSection.name,
  buildICPSection.description,
  {
    profiles: z.array(
      z.object({
        segment: z.string(),
        description: z.string(),
        pains: z.array(z.string()),
        desires: z.array(z.string()),
        objections: z.array(z.string()),
      })
    ),
  },
  async (args) => buildICPSection.handler(args)
);

// build-roadmap-section
server.tool(
  buildRoadmapSection.name,
  buildRoadmapSection.description,
  {
    description: z.string().optional(),
    totalWeeks: z.number(),
    bars: z.array(
      z.object({
        label: z.string(),
        startWeek: z.number(),
        endWeek: z.number(),
        color: z.string(),
      })
    ),
    phases: z.array(
      z.object({
        number: z.string(),
        name: z.string(),
        weeks: z.string(),
        budget: z.string().optional(),
        description: z.string(),
        deliverables: z.array(z.string()),
      })
    ),
  },
  async (args) => buildRoadmapSection.handler(args)
);

// build-value-props (legacy — kept for backward compatibility)
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
    breakdown: z
      .object({
        items: z.array(
          z.object({
            concept: z.string(),
            amount: z.string(),
            note: z.string(),
          })
        ),
        firstMonth: z.string(),
        monthly: z.string(),
      })
      .optional(),
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
    badgeLabel: z.string().optional(),
    llamadaCards: z.array(z.object({ label: z.string(), value: z.string() })),
    llamadaSummary: z
      .object({ label: z.string(), value: z.string() })
      .optional(),
    llamadaQuote: z.string(),
    llamadaQuoteSource: z.string().optional(),
    auditSection: z.string(),
    researchSection: z.string(),
    competitorsSection: z.string(),
    icpSection: z.string(),
    roadmapSection: z.string(),
    currentPhase: z.number().optional(),
    methodPhases: z
      .array(
        z.object({
          number: z.string(),
          name: z.string(),
          duration: z.string(),
          description: z.string(),
          deliverable: z.string().optional(),
          deliverableIcon: z.string().optional(),
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
