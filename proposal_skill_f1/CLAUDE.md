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
- Los `deliverables` de las phase cards son **texto plano**: el viewer los renderiza como `{d}`, no con dangerouslySetInnerHTML. Un `<b>` ahi sale impreso literal como `&lt;b&gt;`. Ver "Que campos aceptan HTML".
- Foundation siempre es 1 semana. Build, Launch y Scale varían segun la complejidad del canal.
- Ambos canales deben sumar el mismo total de semanas.
- Los deliverables solo incluyen trabajo que REE ejecuta. No prometer puesta a punto de perfiles de IG ni cambios en el ecommerce del cliente salvo acuerdo explicito.

## Que campos aceptan HTML

Solo estos campos pasan por `dangerouslySetInnerHTML`. En cualquier otro, un `<b>` sale impreso literal:

| Slide | Campos con HTML |
|-------|-----------------|
| `content` | `summary.value`, `cards[].value` |
| `findings` | `findings[].finding`, `clientValue.text` |
| `research` | `marketCards[].text`, `summary` |
| `competitors` | `summary` |
| `icp` | `footnote` |
| `roadmap` | `description`, `footnote` |
| `pricing` | `footnote` |
| `payment-methods` | `footnote` |
| `campaigns` | `description` |

**No aceptan HTML** (texto plano): `roadmap.phases[].deliverables`, `findings.keyInsight`, `pricing.breakdown.items[].note`, `competitors[].strengths/weaknesses/description`, `icp.profiles[].pains/desires/objections`, `content.quote.text`, `index.items[].description`.

Chequeo rapido sobre el JSON generado: buscar `<` en los campos que no estan en la tabla de arriba.

## Verificar overflow antes de entregar

Los slides se renderizan a **1920x1080 fijo** y el contenido que no entra **se desborda en silencio**: no hay scroll ni clamp, el viewer solo escala el contenedor. Nada en el typecheck lo detecta.

Hay que medirlo en el browser con el server local arriba:

```js
// playwright: por cada div de 1920x1080, el bottom del hijo mas bajo
const bottom = Math.max(...[...el.querySelectorAll("*")]
  .map(c => (c.getBoundingClientRect().bottom - top) / scale));
// bottom > 1080  =>  desborda
```

Los que se desbordan primero son **competencia** (3 competidores con 4 fortalezas y 4 debilidades cada uno ya queda al limite, sumado al `summary`) y **roadmap** (`description` larga mas 5 deliverables por card). Referencias sanas: `description` del roadmap hasta ~300 caracteres, 2 competidores con 4 y 4, o 3 competidores con 3 y 3.

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

### Un acuerdo por cliente en `clients/<slug>/`

Cada acuerdo vive en su propia carpeta, con el generador y el HTML juntos. Misma convencion que `foundation_skill_f2/clients/<slug>/`.

```
clients/
  _render.mts              helper compartido: AcuerdoData + renderContract()
  defu/
    gen.mts                datos del acuerdo (fuente de verdad)
    acuerdo-defu.html      output generado, NO editar a mano
  btlandia/
    gen.mts
    acuerdo-btlandia.html
  kabala/
    gen.mts
    acuerdo-kabala.html
  grupo-lente/
    acuerdo-grupo-lente.html   legacy, hecho a mano, sin generador
```

Regenerar un acuerdo:

```bash
npx tsx clients/<slug>/gen.mts
```

`renderContract(acuerdo, import.meta.url)` escribe `acuerdo-<slug>.html` al lado del `gen.mts` que lo invoca. El HTML es un artefacto: **cualquier cambio de contenido se hace en el `gen.mts` y se regenera**, nunca editando el HTML.

### Clausulas compartidas

El texto legal que no cambia entre clientes vive en `src/lib/contract-templates.ts` y se importa desde cada `gen.mts`:

| Export | Que es | Donde va |
|--------|--------|----------|
| `BLOQUES_PAGOS` | Cotizacion dolar, medios de pago, recargo 10% | Facturacion y pagos, al final |
| `seccionProrrateo(n)` | Seccion completa de prorrateo del fee | Seccion propia, despues de Facturacion |
| `DEFINICION_GO_LIVE` | Definicion de go-live | Plan de ejecucion |
| `CLAUSULA_PLAZOS` | Los plazos no se pausan | Plan de ejecucion, obligatoria |
| `seccionesFijas(desde)` | Datos/confidencialidad + Comunicacion | Cierre, `...seccionesFijas(8)` |
| `DEFAULT_GROWTH_SECTIONS` | Las 8 secciones default completas | Base para un cliente nuevo |

Si hay que cambiar una clausula legal, se cambia ahi y se regeneran todos los acuerdos. No duplicar el texto en el `gen.mts` del cliente.

### Flujo del acuerdo

```
1. Cliente acepta la propuesta (slides)
2. Claude lee ree-website/public/proposals/<slug>.json y extrae datos relevantes
3. Claude crea clients/<slug>/gen.mts copiando el de un cliente similar,
   arma las secciones de contenido con los datos de la propuesta e importa
   las clausulas compartidas (BLOQUES_PAGOS, seccionProrrateo,
   DEFINICION_GO_LIVE, CLAUSULA_PLAZOS, seccionesFijas)
4. npx tsx clients/<slug>/gen.mts genera acuerdo-<slug>.html
5. Se abre en navegador para imprimir/exportar a PDF
6. Se commitean juntos el gen.mts y el HTML
```

El acuerdo debe quedar **alineado con la propuesta**: montos, campanas, fechas del roadmap y presupuesto total de pauta tienen que coincidir con el JSON. Si se corrige uno, corregir el otro en el mismo commit. El detalle operativo (cantidad de piezas, distribucion de pauta por campana) vive en la propuesta y **no baja al acuerdo**, ver "Nivel de detalle".

El tool MCP `generate-contract` es el mismo renderer, para el caso en que se quiera generar un acuerdo sin dejar un `gen.mts` en el repo.

### Mapping: Slide de propuesta a Seccion del acuerdo

| Slide propuesta | Seccion acuerdo | Datos que extrae |
|----------------|-----------------|-------------------|
| Slide 3: LA LLAMADA | 1. Alcance | Producto, equipo, canales, que incluye/no incluye |
| Slide 4: LA AUDITORIA | 1. Alcance (setup tecnico) | Findings de tracking: que instalar (Pixel, Shopping, REE Metrics) |
| Slide 9: ROADMAP | 6. Plan de ejecucion | Semanas por fase (Foundation/Build/Launch/Scale), semana de go-live |
| Slide 10: CAMPANAS | 1. Alcance + 6. Plan de ejecucion | Cantidad de campanas, nombre y objetivo de cada una (sin conteo de piezas) |
| Slide 11: PRICING | 4. Facturacion y pagos | Montos (setup, mensual, pauta), breakdown Concepto/Monto |
| Slide 11: PRICING | 3. Pauta publicitaria | Presupuesto total de pauta sugerido (sin distribucion por campana) |
| Slide 11: PRICING | 7. Reportes y metricas | REE Metrics USD 50/mes incluido en fee |
| Slide 8: METODO | 2. Duracion del servicio | Fases del framework, duracion total |
| (Reglas fijas REE) | 5. Prorrateo por dias | Siempre igual, `seccionProrrateo(5)` |
| (Reglas fijas REE) | 8. Datos y confidencialidad | Siempre igual |
| (Reglas fijas REE) | 9. Comunicacion | Siempre igual (L-V 10:00-18:00 Argentina) |

Las secciones 5, 8 y 9 son fijas (no dependen de la propuesta). Las secciones 1-4, 6 y 7 se arman con datos de la propuesta. El mapping es una referencia, no una regla rigida. Claude usa su criterio para extraer los datos relevantes.

### Reglas de contenido

- **Negritas**: solo datos duros (montos, fechas, cantidades, frecuencias). No decorativas.
- **Tildes y enes**: todo el contenido en espanol con acentos correctos.
- "REE" siempre en mayusculas (nunca "REe").
- Mes vencido: el fee se paga a mes vencido, factura del 1 al 10 del mes siguiente.
- Pauta: la tarjeta del cliente va directo en Meta, REE no intermedia.
- Precios en USD con espacio: "USD 1,500/mes". Footer siempre aclara "NO incluyen IVA".
- `footerValue`: si el pricing tiene estructura variable (ej. primer mes distinto al recurrente), usar `footerValue` para texto descriptivo como "USD 1,500 (primer mes) / USD 1,000/mes (recurrente)". Si se omite, el footer usa `totalValue`.

### Nivel de detalle: que NO va en el acuerdo

El acuerdo fija el **compromiso comercial**, no el plan operativo. Todo lo que puede variar mes a mes sin renegociar el contrato se deja fuera, para no generar una obligacion contractual sobre un numero que en la practica se ajusta.

**No incluir cantidad de piezas creativas.** Nada de "8 piezas", "9 piezas creativas en 2 conjuntos por ICP", "18 anuncios". Las campanas se describen por **nombre, tipo y objetivo**:

> "**2 campanas** en Meta Ads: **DEFU_Awareness** (interaccion hacia el perfil @defu.tofuco) y **DEFU_Ventas** (conversion hacia defu.com.ar)."

La cantidad de piezas vive en la propuesta (slides) y en el Foundation (F2), donde se puede ajustar sin tocar el acuerdo. En el bullet de Build del Plan de ejecucion se dice "los creativos de ambas campanas", no un numero. Tampoco se promete extension de piezas en el bloque de excludes: la produccion audiovisual "queda sujeta a la disponibilidad de REE Agencia y se cotiza de forma aparte".

**No incluir la distribucion de pauta por campana.** Nada de "USD 150/mes para Awareness y USD 350/mes para Ventas". En la seccion 3 va solo el **total sugerido** y quien decide el reparto:

> "El presupuesto de pauta sugerido es de **USD 500/mes**. La distribucion entre campanas la define REE dentro de ese presupuesto y se reasigna mes a mes segun los resultados de performance."

Excepcion: si el cliente pidio explicitamente un split fijo por campana, se deja documentado. Por default, no.

### Reglas de diseno/impresion

- @page margin: `20mm 20mm` para impresion correcta en PDF.
- print padding: `0 !important` (el @page maneja los margenes).
- Desmarcar "Headers and footers" en el dialogo de impresion del navegador.
- `page-break-inside: avoid` en cada seccion.
- body font-size: `10.5px`, h2: `11.5px`.

### Secciones del acuerdo (9)

Las secciones default estan en `src/lib/contract-templates.ts`. Claude las usa como base y puede agregar, quitar o modificar secciones segun el cliente.

1. Alcance de la propuesta (incluye/no incluye)
2. Duracion del servicio (3 meses minimo)
3. Pauta publicitaria (tarjeta del cliente en Meta, presupuesto total sugerido)
4. Facturacion y pagos (tabla Concepto/Monto, mes vencido, cotizacion dolar, recargo 10%)
5. Prorrateo por dias de servicio (`seccionProrrateo(5)`)
6. Plan de ejecucion (Foundation, Build, Launch, Scale con semanas, clausula de plazos)
7. Reportes y metricas (REE Metrics USD 50/mes incluido, quincenales/mensuales)
8. Datos y confidencialidad
9. Comunicacion (lunes a viernes 10:00-18:00 hora Argentina)

`DEFAULT_GROWTH_SECTIONS` todavia trae las 8 originales (sin prorrateo). Al armar un cliente nuevo, agregar `seccionProrrateo` y renumerar. Los acuerdos vigentes con la estructura nueva son `clients/defu/` y `clients/btlandia/`, sirven de molde.

### Clausula de plazos (obligatoria en Plan de ejecucion)

"Los plazos del roadmap no se pausan por demoras en la entrega de creativos, accesos o aprobaciones por parte del cliente o de su equipo. El calendario y la facturacion siguen corriendo independientemente de estos tiempos de espera."

### Prorrateo: seccion propia, no una oracion suelta

El fee es mensual pero el Kick Off casi nunca cae el dia 1, y la baja tampoco cae a fin de mes. Sin esto queda ambiguo si el mes de arranque se cobra completo.

Va como **seccion propia** del acuerdo, no como un parrafo perdido dentro de Facturacion y pagos. Es una condicion economica que el cliente tiene que poder encontrar y citar, y enterrada al final de la seccion 4 (entre cotizacion del dolar, medios de pago y recargo por mora) se lee como letra chica. Se usa `seccionProrrateo(n)` y se ubica **inmediatamente despues de Facturacion y pagos**:

```ts
{
  number: 4,
  title: "Facturación y pagos",
  blocks: [ /* paymentTable */, ...BLOQUES_PAGOS ],
},
seccionProrrateo(5),
{
  number: 6,
  title: "Plan de ejecución",
  // ...
},
```

Insertarla **corre la numeracion** del resto: Plan de ejecucion pasa a 6, Reportes a 7 y el cierre a `...seccionesFijas(8)`. El acuerdo queda de **9 secciones**.

La seccion tiene tres bloques: la regla general, un `bullets` con los dos casos (mes de inicio desde el Kick Off, mes de baja hasta la finalizacion) y un `note` que acota el alcance. Ese ultimo bloque importa: el prorrateo aplica **solo al fee de REE**, no a la pauta, porque la pauta se debita de la tarjeta del cliente segun lo que Meta gaste y ya es proporcional por definicion.

Ojo con el mes 1 cuando tiene un monto distinto al recurrente (ej. incluye una integracion de setup): el prorrateo corre sobre el fee, el cargo unico de setup se cobra completo. Si el cliente arranca a mitad de mes y el mes 1 esta bundleado en una sola linea de la `paymentTable`, conviene separar fee y setup en dos filas para que el calculo sea inequivoco.

### Block types para secciones

- `paragraph`: texto libre (soporta **bold** markdown)
- `bullets`: lista generica con disc
- `includes`: lista con encabezado implicito
- `excludes`: lista con encabezado "No incluye:" subrayado
- `paymentTable`: tabla con header Concepto/Monto, rows, total opcional
- `note`: texto en italica
