# Diagnóstico Skill F1

Servidor MCP para la Fase 1 (Diagnóstico + Propuesta) de REE Growth.

## Qué hace

Convierte los datos de la Discovery Call (Fase 0) + la visión de founders en una presentación de diagnóstico con branding REE. El output es un JSON que el viewer en `ree-website/proposals/[slug]` renderiza como slides navegables.

## Reglas de estilo para el contenido generado

- **NO usar em dashes** (—). Se ven AI. Usar comas, puntos, paréntesis o dos puntos en su lugar.
- **NO usar flechas** (→). Usar "a", "hacia", "luego" o simplemente separar con puntos.
- Escribir con tono directo y de consultor. No copiar frases del cliente textualmente como si fueran propias.
- El objetivo/summary debe ser una síntesis estratégica, no un parafraseo de la cita del cliente.

## 3 Inputs del proceso

1. **Documento de visión de founders**: criterio experto y prioridades de los founders de REE para el cliente.
2. **Discovery Call** (Fathom link): transcript y summary de la llamada con el cliente.
3. **Documento de Fase 0**: datos estructurados del discovery.

## Tools MCP

| Tool | Descripción |
|------|-------------|
| `parse-discovery-call` | Estructura datos del transcript + visión de founders. Produce perfil del cliente |
| `build-audit-section` | Arma sección de auditoría con findings y key insight |
| `build-research-section` | Arma sección de mercado con marketCards |
| `build-competitors-section` | Arma sección de competencia con share, fortalezas y debilidades |
| `build-icp-section` | Arma sección de cliente ideal con perfiles, dolores, deseos y objeciones |
| `build-roadmap-section` | Arma sección de roadmap con Gantt y fases de ejecución |
| `calculate-investment` | Calcula unit economics + genera paquetes, breakdown y escenarios |
| `compose-diagnostic` | Ensambla JSON final de la presentación (11 slides) |
| `build-value-props` | *(legacy)* Arma propuesta de valor con ángulos priorizados |

## Estructura de 11 slides

| # | Tipo | Sección |
|---|------|---------|
| 1 | `cover` | (portada) |
| 2 | `index` | (índice) |
| 3 | `content` | 01 · LA LLAMADA |
| 4 | `findings` | 02 · LA AUDITORÍA |
| 5 | `research` | 03 · EL RESEARCH, MERCADO |
| 6 | `competitors` | 03 · EL RESEARCH, COMPETENCIA |
| 7 | `icp` | 03 · EL RESEARCH, CLIENTE IDEAL |
| 8 | `method` | 04 · CÓMO TRABAJAMOS |
| 9 | `roadmap` | 05 · LA PROPUESTA DE VALOR |
| 10 | `pricing` | 06 · VALOR DEL SERVICIO |
| 11 | `closing` | (cierre) |

**Orden de presentacion:** El metodo (como trabajamos) va ANTES del roadmap. Primero se explica el framework (Foundation, Build, Launch, Scale) y despues se muestra como se aplica al cliente.

## Flujo de orquestación

```
1. Usuario entrega Fathom link + visión de founders
2. Claude usa Fathom MCP: get_recording_by_url, luego get_meeting_transcript + summary
3. Claude usa meta-ads-tool MCP (si aplica): audit-campaigns + get-insights
4. Claude usa diagnostico-skill-f1:
   parse-discovery-call
   build-audit-section
   build-research-section + build-competitors-section + build-icp-section
   build-roadmap-section
   calculate-investment
   compose-diagnostic
5. Claude escribe JSON a ree-website/public/proposals/[slug].json
6. Presentación visible en /proposals/[slug]
```

## Notas sobre el roadmap

- El Gantt usa **segmentos** con los terminos del framework: Foundation, Build, Launch, Scale.
- Cada segmento tiene un color progresivo (claro = foundation, oscuro = scale).
- Foundation siempre es 1 semana. Build, Launch y Scale varían segun la complejidad del canal.
- Ambos canales deben sumar el mismo total de semanas.

## Notas sobre pricing

- La pauta de Meta Ads se paga con la tarjeta del cliente directo en Meta. El cliente controla su propia cuenta.
- REE Metrics se desglosa como linea separada en el breakdown (USD 50/mes), el fee de REE Growth se ajusta para que el total no cambie.
- En el breakdown, dejar claro que la pauta no pasa por REE: "Se pone tu tarjeta directamente en Meta Ads, el gasto publicitario se debita de tu cuenta."
- Los precios siempre deben indicar que no incluyen IVA (en bold en el footnote).
- Moneda: USD con espacio (ej. "USD 500/mes").

## Uso

```bash
cd proposal_skill_f1
npm install
npm run dev    # arranca el server MCP por stdio
```

## Viewer

La presentación se renderiza en `ree-website` en la ruta `/proposals/[slug]`.
El JSON va en `ree-website/public/proposals/[slug].json`.

### Viewer UI

**Arquitectura scale-based**
- Cada slide se renderiza a tamaño fijo 1920x1080px con inline styles.
- El viewer (`slide-viewer.tsx`) aplica `transform: scale(factor)` donde `factor = Math.min(containerWidth/1920, containerHeight/1080)`.
- Un `ResizeObserver` recalcula el scale en cada resize del container.
- NO se usan breakpoints responsivos. El escalado CSS maneja todos los tamaños de pantalla.

**Sidebar de thumbnails**
- Panel lateral izquierdo con miniaturas clickeables de cada slide.
- Cada thumbnail renderiza el componente real del slide a escala miniatura (130px de ancho).
- Navegación por click, flechas de teclado, o swipe.

**Mobile orientation gate**
- En portrait + ancho <= 768px se muestra un overlay fullscreen pidiendo rotar el teléfono.
- Hook `usePortraitMobile()` en `slide-viewer.tsx` escucha `matchMedia` change events.

**Tipografías**
- Cargadas via `next/font/google` en `layout.tsx` con CSS variables.
- `--font-archivo` (Archivo 400/600/700): body text.
- `--font-archivo-black` (Archivo Black 400): headlines uppercase.
- `--font-space-mono` (Space Mono 400/700): labels, section markers, monospace accents.

**Logos**
- Slides con fondo rojo/oscuro (cover, closing): `/ree-logo-white.png`
- Slides con fondo blanco (inner slides): `/ree-logo-red.png` (absoluto top-right)
- Index slide footer: `/ree-logo-red.png`
- Disponible también: `/ree-logo-black.png`

**Design tokens**
- Rojo REE: `#DD0513`, gradiente: `linear-gradient(150deg, #DD0513 0%, #C00411 55%, #8E030D 100%)`
- Fondo slides internos: `#FFFFFF`
- Texto principal: `#0E0D0C`
- Grid overlay (cover/closing): `rgba(255,255,255,0.07)` líneas de 120px
- Card borders: `rgba(14,13,12,0.18)` o `rgba(14,13,12,0.2)`
- Card bg: `rgba(14,13,12,0.03)`
- Padding slides: `76px 100px 60px` (inner), `80px 100px 64px` (cover/closing)

**Referencia de diseño**
- Archivo fuente: `DEFU - Auditoria + Propuesta.dc.html` (Claude Design export)
- Todas las medidas en px fijos a 1920x1080
