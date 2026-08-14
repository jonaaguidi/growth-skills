# Diagnóstico Skill F1

Servidor MCP para la Fase 1 (Diagnóstico + Propuesta) de REE Growth.

## Qué hace

Convierte los datos de la Discovery Call (Fase 0) + la visión de founders en una presentación de diagnóstico con branding REE. El output es un JSON que el viewer en `ree-website/proposals/[slug]` renderiza como slides navegables.

## 3 Inputs del proceso

1. **Documento de visión de founders** — criterio experto y prioridades de los founders de REE para el cliente.
2. **Discovery Call** (Fathom link) — transcript y summary de la llamada con el cliente.
3. **Documento de Fase 0** — datos estructurados del discovery.

## Tools MCP

| Tool | Descripción |
|------|-------------|
| `parse-discovery-call` | Estructura datos del transcript + visión de founders → perfil del cliente |
| `build-audit-section` | Arma sección de auditoría con findings y key insight |
| `build-research-section` | Arma sección de research con mercado + ICP |
| `build-value-props` | Arma propuesta de valor con ángulos priorizados |
| `calculate-investment` | Calcula unit economics + genera paquetes y escenarios |
| `compose-diagnostic` | Ensambla JSON final de la presentación |

## Flujo de orquestación

```
1. Usuario → Fathom link + visión de founders
2. Claude → Fathom MCP: get_recording_by_url → get_meeting_transcript + summary
3. Claude → meta-ads-tool MCP (si aplica): audit-campaigns + get-insights
4. Claude → diagnostico-skill-f1:
   parse-discovery-call → build-audit-section → build-research-section →
   build-value-props → calculate-investment → compose-diagnostic
5. Claude → Write JSON a ree-website/public/proposals/[slug].json
6. Presentación en /proposals/[slug]
```

## Uso

```bash
cd proposal_skill_f1
npm install
npm run dev    # arranca el server MCP por stdio
```

## Viewer

La presentación se renderiza en `ree-website` en la ruta `/proposals/[slug]`.
El JSON va en `ree-website/public/proposals/[slug].json`.
