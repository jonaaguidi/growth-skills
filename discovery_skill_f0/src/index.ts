import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as generarDiscoveryDoc from "./tools/discovery/generar-discovery-doc.js";

const server = new McpServer({
  name: "discovery-skill-f0",
  version: "0.1.0",
});

server.tool(
  generarDiscoveryDoc.name,
  generarDiscoveryDoc.description,
  generarDiscoveryDoc.zodSchema,
  async (args) => generarDiscoveryDoc.handler(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
