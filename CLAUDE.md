# Ree Tools

Coleccion de servidores MCP (Model Context Protocol) que implementan el servicio end-to-end de REE Growth para clientes de paid media. Cada skill corresponde a una fase del proceso comercial y operativo.

## Pipeline

El servicio sigue un flujo secuencial de 3 fases. Cada fase consume datos de la anterior:

1. **Discovery (F0)** -- Llamada inicial con el cliente. Genera documento HTML interno con diagnostico, 4P + ICP, unit economics y plan de accion.
2. **Proposal (F1)** -- Convierte el discovery en presentacion de diagnostico para el cliente (JSON de 12 slides renderizado en ree-website) + acuerdo comercial HTML.
3. **Foundation (F2)** -- Post-cierre. Genera 3 documentos: playbook interno, onboarding del cliente y foundation review para la reunion de semana 3.

## Estructura

Cada subdirectorio es un servidor MCP independiente:

- `discovery_skill_f0/` -- Fase 0 Discovery (1 tool, genera HTML interno). Ver `discovery_skill_f0/CLAUDE.md`.
- `proposal_skill_f1/` -- Fase 1 Propuesta (10 tools, genera JSON de presentacion + contrato HTML). Ver `proposal_skill_f1/CLAUDE.md`.
- `foundation_skill_f2/` -- Fase 2 Foundation (1 tool, genera 3 HTMLs: playbook, onboarding, strategy). Ver `foundation_skill_f2/CLAUDE.md`.

## Convenciones

- TypeScript, ESM (`"type": "module"`).
- Cada tool es un archivo que exporta `name`, `description`, `inputSchema` y `handler`.
- Cada servidor MCP tiene su propio `package.json` y se ejecuta de forma independiente.
- HTML generado es self-contained (CSS inline, logos base64). No requiere assets externos.
- Branding REE: rojo `#DD0513`, tipografia Archivo / Archivo Black / Space Mono.
