import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as generarFoundationDoc from "./tools/generar-foundation-doc.js";

const server = new McpServer({
  name: "foundation-skill-f2",
  version: "0.1.0",
});

server.tool(
  generarFoundationDoc.name,
  generarFoundationDoc.description,
  generarFoundationDoc.zodSchema,
  async (args) => generarFoundationDoc.handler(args)
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
