# Ree Tools

Coleccion de servidores MCP (Model Context Protocol) con herramientas de IA para paid media.

## Estructura

Cada subdirectorio es un servidor MCP independiente:

- `meta-ads-tool/` — Server MCP para Meta (Facebook/Instagram) Ads. Ver `meta-ads-tool/CLAUDE.md`.
- `discovery_skill_f0/` — Server MCP para Discovery Fase 0 (genera documento HTML interno). Ver `discovery_skill_f0/CLAUDE.md`.
- `proposal_skill_f1/` — Server MCP para Propuesta Fase 1 (genera JSON de presentación para el cliente → viewer en ree-website). Ver `proposal_skill_f1/CLAUDE.md`.

## Convenciones

- TypeScript, ESM (`"type": "module"`).
- Cada tool es un archivo que exporta `name`, `description`, `inputSchema` y `handler`.
- Cada servidor MCP tiene su propio `package.json` y se ejecuta de forma independiente.
