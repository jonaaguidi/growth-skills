<p align="center">
  <img src="https://growth.reecreativos.com/ree-logo-red.png" alt="REE Growth" width="120" />
</p>

<h1 align="center">REE Tools</h1>

<p align="center">
  <strong>Servicio end-to-end de paid media, potenciado por IA</strong><br/>
  Servidores MCP que automatizan cada fase del proceso comercial y operativo de REE Growth
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-ESM-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MCP-Protocol-DD0513?style=flat-square" alt="MCP" />
  <img src="https://img.shields.io/badge/Claude-AI%20Agent-7C3AED?style=flat-square&logo=anthropic&logoColor=white" alt="Claude" />
  <img src="https://img.shields.io/badge/Skills-3-DD0513?style=flat-square" alt="Skills" />
  <img src="https://img.shields.io/badge/Tools-12-0E0D0C?style=flat-square" alt="Tools" />
</p>

---

## Que es esto

Cada **skill** es un servidor MCP independiente que corresponde a una fase del servicio de REE Growth. Un agente de IA (Claude) ejecuta las tools de cada skill para generar los entregables: documentos HTML branded, presentaciones JSON y acuerdos comerciales.

## Pipeline del servicio

```
  DISCOVERY (F0)              PROPOSAL (F1)                FOUNDATION (F2)
  ══════════════              ═════════════                 ════════════════

  Llamada con el       -->    Presentacion de        -->    Onboarding +
  cliente (Fathom)            diagnostico (12 slides)       Estrategia operativa

  Salida:                     Salida:                       Salida:
  HTML interno                JSON slides + HTML            3 HTMLs branded
  (founders only)             contrato comercial            (interno + cliente)
```

> Cada fase consume los datos de la anterior. El pipeline completo va desde la primera llamada hasta el lanzamiento de campanas.

---

## Fases

### `discovery_skill_f0/` -- Fase 0: Discovery

> Diagnostico interno post-llamada

| | |
|---|---|
| **Entrada** | Transcript de Fathom + criterio de founders |
| **Proceso** | Claude extrae 4P + ICP, unit economics, gaps, plan de accion |
| **Salida** | HTML interno con 8 secciones (no se comparte con el cliente) |
| **Tools** | 1 |

**Secciones del documento:**
La Llamada, La Auditoria, El Research, Propuesta de Valor, Plan de Accion, Valor del Servicio, Notas Adicionales, Resumen y Proximos Pasos

| Tool | Que hace |
|------|----------|
| `generar-discovery-doc` | `DiscoveryData` JSON --> HTML branded self-contained |

**Formulas clave:**
- CPA maximo (CPR) = ticket x (margen / 100) x (% margen para ads / 100)
- CPL objetivo = CPA maximo x (tasa de cierre / 100)
- ROAS breakeven = 1 / (margen / 100)

---

### `proposal_skill_f1/` -- Fase 1: Proposal

> Presentacion de diagnostico + acuerdo comercial

| | |
|---|---|
| **Entrada** | Discovery (F0) + vision de founders + transcript de Fathom |
| **Proceso** | 9 tools construyen secciones, `compose-diagnostic` ensambla 12 slides |
| **Salida** | JSON de presentacion (viewer en `ree-website`) + HTML de contrato |
| **Tools** | 10 |

**12 Slides de la presentacion:**

| # | Slide | Seccion |
|---|-------|---------|
| 1 | `cover` | Portada |
| 2 | `index` | Indice |
| 3 | `content` | 01 - La Llamada |
| 4 | `findings` | 02 - La Auditoria |
| 5 | `research` | 03 - El Research (Mercado) |
| 6 | `competitors` | 03 - El Research (Competencia) |
| 7 | `icp` | 03 - El Research (Cliente Ideal) |
| 8 | `method` | 04 - Como Trabajamos |
| 9 | `roadmap` | 05 - La Propuesta de Valor |
| 10 | `pricing` | 06 - Valor del Servicio |
| 11 | `payment-methods` | 06 - Medios de Pago |
| 12 | `closing` | Cierre |

**Tools:**

| Tool | Que hace |
|------|----------|
| `parse-discovery-call` | Estructura transcript en perfil de cliente |
| `build-audit-section` | Auditoria con findings y key insight |
| `build-research-section` | Mercado con tarjetas |
| `build-competitors-section` | Competencia con market share |
| `build-icp-section` | Cliente ideal con pains/desires/objections |
| `build-roadmap-section` | Roadmap con Gantt y fases |
| `build-value-props` | _(legacy)_ Propuesta de valor con angulos |
| `calculate-investment` | Unit economics + escenarios + pricing |
| `compose-diagnostic` | Ensambla JSON final de 12 slides |
| `generate-contract` | Acuerdo comercial HTML post-aprobacion |

---

### `foundation_skill_f2/` -- Fase 2: Foundation

> Onboarding operativo + estrategia de campanas

| | |
|---|---|
| **Entrada** | Proposal (F1) + Discovery (F0) + input del equipo REE |
| **Proceso** | Claude construye `FoundationData` y genera 3 documentos simultaneamente |
| **Salida** | 3 HTMLs self-contained |
| **Tools** | 1 |

**3 documentos generados:**

| Documento | Para quien | Contenido |
|-----------|------------|-----------|
| **Playbook Interno** | Equipo REE | Setup, accesos, KO Call, roadmap, estrategia, creativos, notas |
| **Onboarding del Cliente** | Cliente | Setup Meta paso a paso, accesos, proximos pasos, Gantt de 8 semanas |
| **Foundation Review** | Cliente | Campanas, roadmap, creativos, KPIs, presupuesto (reunion semana 3) |

| Tool | Que hace |
|------|----------|
| `generar-foundation-doc` | `FoundationData` JSON --> 3 HTMLs branded |

---

## Stack tecnico

| | |
|---|---|
| **Lenguaje** | TypeScript ESM (`"type": "module"`) |
| **Protocolo** | MCP via `@modelcontextprotocol/sdk` |
| **Validacion** | Zod |
| **Runtime** | `tsx` (dev y produccion) |
| **Output** | HTML self-contained (CSS inline, logos base64) |

## Estructura de archivos

```
ree-tools/
  discovery_skill_f0/          # Fase 0
  proposal_skill_f1/           # Fase 1
  foundation_skill_f2/         # Fase 2
  CLAUDE.md                    # Instrucciones para el agente

Cada skill:
  {skill}/
    src/
      index.ts                 # Entry point, registra tools, StdioServerTransport
      types/{type}.ts          # Interfaces TypeScript (data contract)
      tools/{tool}.ts          # MCP tool: name, description, inputSchema, handler
      lib/{renderer}.ts        # Funciones puras: data --> HTML
      lib/template-parts.ts    # CSS, colores REE, fragmentos HTML
      assets/                  # Logos, imagenes (embebidas como base64)
    package.json
    CLAUDE.md                  # Documentacion exhaustiva de la skill
```

## Como ejecutar

Cada skill es un servidor MCP independiente. Se configura en Claude Desktop o Claude Code apuntando al `src/index.ts` con `tsx`:

```bash
# Desarrollo (watch mode)
cd discovery_skill_f0 && npm run dev

# Produccion
cd proposal_skill_f1 && npm start
```

## Branding REE

| Token | Valor |
|-------|-------|
| Rojo REE | `#DD0513` |
| Gradiente | `linear-gradient(150deg, #DD0513 0%, #C00411 55%, #8E030D 100%)` |
| Texto principal | `#0E0D0C` |
| Tipografia body | Archivo 400/600/700 |
| Tipografia headlines | Archivo Black 400 (uppercase) |
| Tipografia labels | Space Mono 400/700 |
| Docs internos | Header rojo, logo blanco, badge "INTERNAL" |
| Docs cliente | Header blanco, logo rojo |

## Documentacion detallada

Cada skill tiene su `CLAUDE.md` con documentacion exhaustiva que el agente usa como contexto:

- **[`discovery_skill_f0/CLAUDE.md`](discovery_skill_f0/CLAUDE.md)** -- Workflow completo, framework 4P + ICP, formulas de unit economics, estructura del documento, casos de referencia (Defu, Grupo Lente)
- **[`proposal_skill_f1/CLAUDE.md`](proposal_skill_f1/CLAUDE.md)** -- 10 tools detalladas, estructura de 12 slides, design tokens, viewer UI (1920x1080 escalado), acuerdo comercial con 8 secciones, reglas de contenido
- **[`foundation_skill_f2/CLAUDE.md`](foundation_skill_f2/CLAUDE.md)** -- 3 documentos con su estructura, onboarding Meta paso a paso, edge cases, naming de ads, KO Call de 45 min, roadmap de 8 semanas

---

<p align="center">
  <sub>REE Growth -- Paid media potenciado por IA</sub>
</p>
