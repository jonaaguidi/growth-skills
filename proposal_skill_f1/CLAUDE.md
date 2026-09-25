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
| `compose-diagnostic` | Ensambla JSON final de la presentación (12 slides) |
| `generate-contract` | Genera HTML de contrato (terminos y condiciones) con branding REE |
| `build-value-props` | *(legacy)* Arma propuesta de valor con ángulos priorizados |

## Estructura de 12 slides

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
| 11 | `payment-methods` | 06 · VALOR DEL SERVICIO |
| 12 | `closing` | (cierre) |

**Orden de presentacion:** El metodo (como trabajamos) va ANTES del roadmap. Primero se explica el framework (Foundation, Build, Launch, Scale) y despues se muestra como se aplica al cliente.

**Sin discovery call:** Si no hubo llamada (el brief viene directo del cliente o de founders), la seccion 01 se renombra a "EL PUNTO DE PARTIDA" en vez de "LA LLAMADA" (en el slide content y en el item del indice). El resto de la estructura no cambia; el research se hace con el brief + web research (ecommerce, IG, competencia).

## Notas sobre competencia (slide 6)

- Cada competidor soporta `description` (texto secundario bajo el nombre, ej. lista de marcas del segmento: "King of the Kongo · Bomba Project · Fréres") e `icon`.
- `icon` acepta URL de imagen (empieza con "/" o "http", se renderiza circular 44px) o nombre de SVG built-in: `"crown"` (segmento lider) | `"tag"` (moda masiva/precio). Los SVG siguen el estilo de los icons de medios de pago: outline rojo REE, fondo `rgba(221,5,19,0.06)`, rect redondeado.
- Verificar competidores con web research antes de afirmarlos (que existan, que pauten, tamano relativo). Linkear `adsLibraryUrl` a la Meta Ads Library cuando pautan.

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
- **Cada etapa del framework tiene un color fijo, identico en todas las barras** (patron btlandia/caribetienda/kabala): Foundation `#DD0513` (rojo), Build `#0E0D0C` (negro), Launch `#E8A013` (amarillo), Scale `#12A150` (verde). NO usar shades progresivos por barra ni colores del cliente en el Gantt.
- Las **phase cards** de abajo son las 4 etapas del framework (Foundation/Build/Launch/Scale), NO una card por campana. Cada card explica que se hace en esa etapa para este cliente, con el `color` de su etapa.
- La `description` del slide soporta `<b>` (se renderiza con dangerouslySetInnerHTML). Usar negritas para guiar la lectura: cantidad de piezas, nombres de campanas, objetivos.
- Foundation siempre es 1 semana. Build, Launch y Scale varían segun la complejidad del canal.
- Ambos canales deben sumar el mismo total de semanas.
- Los deliverables solo incluyen trabajo que REE ejecuta. No prometer puesta a punto de perfiles de IG ni cambios en el ecommerce del cliente salvo acuerdo explicito.

## Notas sobre medios de pago (slide 11)

- El slide de medios de pago se genera automaticamente por `compose-diagnostic` con defaults.
- Los 3 metodos default son: Efectivo, Cripto (USDT), Transferencia Bancaria.
- Los defaults estan en `src/lib/templates.ts` (`DEFAULT_PAYMENT_METHODS` y `DEFAULT_PAYMENT_TERMS`).
- Se pueden overridear pasando `paymentMethods`, `paymentTerms`, `currencyNote` y/o `latePayment` a `compose-diagnostic`.
- El slide comparte `sectionLabel` con pricing ("06 . VALOR DEL SERVICIO") y hereda el `footnote` del pricing.
- Debajo de las cards se muestra una barra oscura con 3 aclaraciones en flex-col: Facturacion (mes vencido, del 1 al 10), Cotizacion (dolar oficial dolarhoy.com), Mora (recargo 10% desde dia 10).
- Los icons de medios de pago son SVG outline en rojo REE con fondo traslucido (`rgba(221,5,19,0.06)`), border redondeado del mismo color.
- Este slide siempre se incluye en toda propuesta nueva. No es opcional.

## Notas sobre pricing

- La pauta de Meta Ads se paga con la tarjeta del cliente directo en Meta. El cliente controla su propia cuenta.
- Para fees chicos (ej. USD 500/mes) el breakdown puede simplificarse a 2 lineas: "Servicio mensual REE Growth" (con nota de que incluye REE Metrics e integraciones como Tienda Nube) + "Pauta Meta Ads". Para fees mas grandes, REE Metrics se desglosa como linea separada (USD 50/mes) y el fee se ajusta para que el total no cambie.
- Las integraciones de setup (Pixel, CAPI, eventos en Tienda Nube/Shopify) entran dentro del servicio, no se cobran como pago unico salvo que se acuerde lo contrario.
- **Cajas de resumen del breakdown**: `monthly` renderiza la caja roja "Fee mensual"; `adSpend` agrega una caja gris "Presupuesto Ads (mensual)"; `firstMonth` agrega una tercera caja "Implementacion (1er mes)". Cuando fee y pauta son componentes separados, usar `monthly` + `adSpend` (2 cajas con distinto color), no sumarlos en una sola caja.
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
URL de producción: `https://growth.reecreativos.com/proposals/[slug]` (deploy automático al pushear a `main` de reecreativos/growth).

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

## Acuerdo Comercial (generate-contract)

Despues de que el cliente acepta la propuesta (slides), se genera un acuerdo comercial de terminos y condiciones. El tool `generate-contract` produce un HTML con branding REE listo para imprimir/exportar a PDF.

### Flujo del acuerdo

```
1. Cliente acepta la propuesta (slides)
2. Claude lee la propuesta y extrae datos relevantes
3. Claude arma las secciones del acuerdo usando datos de la propuesta
4. Claude usa generate-contract para renderizar el HTML
5. Claude guarda el HTML en contracts/{slug}-contrato.html
6. Se abre en navegador para imprimir/exportar a PDF
```

### Mapping: Slide de propuesta a Seccion del acuerdo

| Slide propuesta | Seccion acuerdo | Datos que extrae |
|----------------|-----------------|-------------------|
| Slide 3: LA LLAMADA | 1. Alcance | Producto, equipo, canales, que incluye/no incluye |
| Slide 4: LA AUDITORIA | 1. Alcance (setup tecnico) | Findings de tracking: que instalar (Pixel, Shopping, REE Metrics) |
| Slide 9: ROADMAP | 5. Plan de ejecucion | Semanas por fase (Foundation/Build/Launch/Scale), semana de go-live |
| Slide 10: CAMPANAS | 1. Alcance + 5. Plan de ejecucion | Cantidad de campanas, piezas, tipos (venta/interaccion) |
| Slide 11: PRICING | 4. Facturacion y pagos | Montos (setup, mensual, pauta), breakdown Concepto/Monto |
| Slide 11: PRICING | 3. Pauta publicitaria | Presupuesto de pauta sugerido |
| Slide 11: PRICING | 6. Reportes y metricas | REE Metrics USD 50/mes incluido en fee |
| Slide 8: METODO | 2. Duracion del servicio | Fases del framework, duracion total |
| (Reglas fijas REE) | 7. Datos y confidencialidad | Siempre igual |
| (Reglas fijas REE) | 8. Comunicacion | Siempre igual (L-V 10:00-18:00 Argentina) |

Las secciones 7 y 8 son fijas (no dependen de la propuesta). Las secciones 1-6 se arman con datos de la propuesta. El mapping es una referencia, no una regla rigida. Claude usa su criterio para extraer los datos relevantes.

### Reglas de contenido

- **Negritas**: solo datos duros (montos, fechas, cantidades, frecuencias). No decorativas.
- **Tildes y enes**: todo el contenido en espanol con acentos correctos.
- "REE" siempre en mayusculas (nunca "REe").
- Mes vencido: el fee se paga a mes vencido, factura del 1 al 10 del mes siguiente.
- Pauta: la tarjeta del cliente va directo en Meta, REE no intermedia.
- Precios en USD con espacio: "USD 1,500/mes". Footer siempre aclara "NO incluyen IVA".
- `footerValue`: si el pricing tiene estructura variable (ej. primer mes distinto al recurrente), usar `footerValue` para texto descriptivo como "USD 1,500 (primer mes) / USD 1,000/mes (recurrente)". Si se omite, el footer usa `totalValue`.

### Reglas de diseno/impresion

- @page margin: `20mm 20mm` para impresion correcta en PDF.
- print padding: `0 !important` (el @page maneja los margenes).
- Desmarcar "Headers and footers" en el dialogo de impresion del navegador.
- `page-break-inside: avoid` en cada seccion.
- body font-size: `10.5px`, h2: `11.5px`.

### Secciones default (8)

Las secciones default estan en `src/lib/contract-templates.ts`. Claude las usa como base y puede agregar, quitar o modificar secciones segun el cliente.

1. Alcance de la propuesta (incluye/no incluye)
2. Duracion del servicio (3 meses minimo)
3. Pauta publicitaria (tarjeta del cliente en Meta)
4. Facturacion y pagos (tabla Concepto/Monto, mes vencido, cotizacion dolar, recargo 10%)
5. Plan de ejecucion (Foundation, Build, Launch, Scale con semanas, clausula de plazos)
6. Reportes y metricas (REE Metrics USD 50/mes incluido, quincenales/mensuales)
7. Datos y confidencialidad
8. Comunicacion (lunes a viernes 10:00-18:00 hora Argentina)

### Clausula de plazos (obligatoria en seccion 5)

"Los plazos del roadmap no se pausan por demoras en la entrega de creativos, accesos o aprobaciones por parte del cliente o de su equipo. El calendario y la facturacion siguen corriendo independientemente de estos tiempos de espera."

### Block types para secciones

- `paragraph`: texto libre (soporta **bold** markdown)
- `bullets`: lista generica con disc
- `includes`: lista con encabezado implicito
- `excludes`: lista con encabezado "No incluye:" subrayado
- `paymentTable`: tabla con header Concepto/Monto, rows, total opcional
- `note`: texto en italica
