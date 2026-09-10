# Foundation Skill F2

Servidor MCP para generar documentos de Foundation (Fase 2) de Ree Creativos.

## REGLA CRITICA: Aislamiento entre clientes

**Cada cliente es independiente. NUNCA tocar archivos de un cliente cuando se trabaja en otro.**

1. **No regenerar docs de otros clientes.** Si estas trabajando en `gen-btlandia.mjs`, NO corras `gen-defu.mjs`. Cada script genera SOLO los docs de su cliente.
2. **No modificar renderers con cambios que afecten docs ya entregados.** Si un Foundation Review ya fue entregado al cliente y esta publicado (ej. `ree-website/public/foundations/{slug}.html`), cualquier cambio en los renderers (`strategy-renderer.ts`, `onboarding-renderer.ts`, `brief-renderer.ts`, `template-parts.ts`) va a alterar el output al regenerar. Antes de modificar un renderer, considerar si hay docs entregados que se van a ver afectados.
3. **No publicar a ree-website sin verificar.** El script `gen-{slug}.mjs` publica automaticamente a `ree-website/public/foundations/`. Si el doc ya fue entregado y esta live, regenerar va a sobreescribir la version entregada. Verificar con `git status` en ree-website antes de hacer deploy.
4. **Si se necesita regenerar un doc ya entregado**, verificar que el output sea identico o comunicar los cambios al equipo antes de deployear.

## REGLA CRITICA: Historial de cambios

**NUNCA sobreescribir un archivo HTML generado sin crear backup primero.**
Antes de escribir cualquier archivo en `clients-*/`, el script de generacion debe:
1. Verificar si el archivo ya existe.
2. Si existe, copiarlo a `{nombre}.bak.{timestamp}.html` en el mismo directorio.
3. Recien entonces escribir la version nueva.

Esto aplica a los 4 documentos (playbook, onboarding, foundation-review, brief-creativos) y a cualquier script de generacion (`gen-*.mjs`).

## Que hace

Genera 4 documentos HTML branded a partir de un mismo `FoundationData`:

1. **Playbook Interno** (INTERNO, no compartir): todo el playbook operativo (onboarding + estrategia + checklists + roadmap) para el equipo REE. Header rojo, logo blanco, badge INTERNO.
2. **Onboarding del Cliente** (COMPARTIBLE): pasos que el cliente debe hacer para arrancar (crear FB Page, vincular IG, tarjeta de pago, brand assets). Header blanco, logo rojo, sin info confidencial.
3. **Foundation Review** (COMPARTIBLE): documento para la reunion de Foundation Review (semana 3). Incluye campanas, roadmap, creativos, KPIs, presupuesto y proximos pasos. Header blanco, logo rojo.
4. **Brief de Creativos** (INTERNO, no compartir): documento de handoff para el equipo de produccion con las piezas creativas desglosadas por ICP. Header rojo, logo blanco, badge INTERNO.

## Workflow: como usar esta skill

### Paso 1 -- Recopilar datos

Los datos vienen de tres fuentes:
1. **Propuesta F1 (compose-diagnostic)**: datos del cliente, canales, inversion, palanca propuesta.
2. **Discovery F0**: ICPs, variables 4P, auditoria.
3. **Input del equipo REE**: equipo asignado, edge cases, requerimientos del cliente.

### Paso 2 -- Construir el JSON

Armar la estructura `FoundationData` (ver `src/types/foundation.ts`). Usar `gen-defu.mjs` como ejemplo canonico de referencia.

**Identidad del cliente** (requeridos):
- `clientInfo`: datos basicos (empresa, slug, contacto, industria, web). Requerido.
- `datosF1`: resumen de la propuesta aceptada (inversion, pauta, CPL, canales, palanca, campanas vendidas, duracion, fechas). Opcional (null si no hay F1).

**Parte A - Onboarding** (requeridos):
- `equipoAsignado`: miembros del equipo REE con rol y telefono.
- `grupoWhatsApp`: checklist de creacion de grupos internos y con el cliente.
- `metaBusiness`: setup completo bajo growth@reecreativos.com (portfolio, FB Page, IG, Ad Account, Pixel, CAPI). Incluir edgeCases activos.
- `requerimientosCliente` (tipo `RequerimientosCliente`): brandAssets, accesoWeb, whatsappInfo, atencionLeads (requeridos), accesoPlataforma y tracking (opcionales, null si no aplica).
- `koCall`: fecha, agenda, temas WOW, checklist de preparacion.

**Parte B - Estrategia** (opcionales salvo arquitectura):
- `palanca`: Posicionamiento / Oferta / Captacion / Conversion + justificacion. Opcional (null).
- `icp`: segmentos con dolores/deseos/objeciones y prioridad (primario/secundario). Array, puede estar vacio.
- `propuestaDeValor` (tipo `PropuestaDeValor`): descripcion + diferenciador de la propuesta de valor. Opcional (null). NO confundir con `ofertas` (packs de producto).
- `calificacionLeads`: matriz A/B/C con descripcion y accion. Array.
- `kpis` (tipo `KPI[]`): metricas con nombre, objetivo y fuente. Array.
- `presupuesto` (tipo `Presupuesto`): pauta, fee, total, cplTarget, limiteGastoCuenta. Opcional (null).
- `creativos` (tipo `Creativos`): puede usar `angulos` (AnguloCreativo[]) o `piezasPorIcp` (PiezasICP[]) + formatos + tono. Opcional (null).
- `utm`: formato de campaign + ejemplos. Opcional (null).
- `arquitectura`: campanas con ad sets y ads. Array, requerido.
- `capacidadAtencion`: quien atiende, capacidad diaria, tiempo de respuesta, validado. Opcional (null).

**Extras** (opcionales):
- `notas`: contexto libre, bloqueantes, observaciones. Opcional (null).
- `ofertas` (tipo `OfertaProducto[]`): packs de producto con nombre, descripcion, precio. Opcional (null). NO confundir con `propuestaDeValor`.
- `cambiosEcommerce` (tipo `CambioEcommerce[]`): cambios sugeridos al e-commerce. Opcional (null).
- `competenciaAds` (tipo `CompetenciaAds`): referencia de ads del competidor. Opcional (null).

**Referencias moodboard** (opcional):
- `referenciasMoodboard` (tipo `ReferenciaCreativa[]`): referencias visuales globales para el brief de creativos (Pinterest, Instagram, YouTube, TikTok). Se renderiza como ultima seccion del brief con embeds en grid. Opcional (null o ausente si no hay refs).

**Roadmap** (requerido):
- `roadmap`: iniciativas con fases (Foundation/Build/Launch/Scale) y semanas.

### Paso 3 -- Crear el script de generacion

Copiar `gen-defu.mjs` a `gen-{slug}.mjs` y reemplazar el objeto `data` con los datos del nuevo cliente. El script es un template reutilizable: todo se resuelve dinamicamente por `data.clientInfo.slug`.

`gen-defu.mjs` es el ejemplo canonico de referencia.

### Paso 4 -- Correr el script

```bash
node gen-{slug}.mjs
```

El script genera automaticamente:

| Output | Ruta |
|---|---|
| Playbook interno | `clients-doc-internos/{slug}/foundation-{slug}.html` |
| Onboarding cliente | `clients-onboardings/{slug}/onboarding-{slug}.html` |
| Foundation Review | `clients-strategies/{slug}/foundation-review-{slug}.html` |
| Brief de Creativos | `briefs/{slug}/brief_creatives.html` |
| Desktop (los 4) | `~/Desktop/foundation-{slug}.html`, `onboarding-{slug}.html`, `foundation-review-{slug}.html`, `brief_creatives.html` |
| ree-website (publish) | `../../ree-website/public/foundations/{slug}.html` |

Si el archivo ya existe, el script crea un backup `.bak.{timestamp}.html` antes de sobreescribir.

Si el directorio de ree-website no existe (ej. otro dev), el publish se skipea sin error.

### Paso 5 -- Deploy y compartir

1. Hacer deploy de `ree-website` para que el link quede live.
2. Compartir `https://growth.reecreativos.com/foundation/{slug}` con el cliente.
3. Los docs internos (playbook, onboarding, brief de creativos) NO se publican online, solo se usan internamente.

### Paso 6 -- Brief de Creativos (handoff a produccion)

Despues de la Foundation Review, se genera el Brief de Creativos para hacer handoff al equipo de produccion. El brief usa el **mismo `FoundationData`** — lee las piezas de `creativos.piezasPorIcp` y las presenta con el framework de produccion.

**IMPORTANTE:** El brief requiere `creativos.piezasPorIcp` (array de `PiezasICP`). Si el cliente solo tiene `creativos.angulos` (como BTLandia), NO se puede generar el brief — primero hay que convertir los angulos a piezas concretas con dolor/solucion/comunicacion por ICP.

**IMPORTANTE:** Siempre compilar TypeScript antes de correr el gen script:

```bash
npx tsc && node gen-{slug}.mjs
```

El gen script importa desde `./dist/` (JS compilado), no desde `./src/` (TS fuente). Si no se compila, los cambios en renderers no se reflejan en el HTML.

#### Estructura de `creativos.piezasPorIcp`

```js
creativos: {
  piezasPorIcp: [
    {
      icp: "Nombre del ICP",           // debe coincidir con data.icp[].segmento
      piezas: [ /* PiezaCreativa[] */ ]
    },
  ],
  formatos: ["Video Comercial (9:16)", "Feed (1080x1350)", ...],
  tono: "Cercano, directo, sin formalidades...",
}
```

#### Campos de `PiezaCreativa`

**Requeridos (siempre):**

| Campo | Tipo | Descripcion | Ejemplo Defu |
|---|---|---|---|
| `formato` | string | Tipo de pieza. Define badge de color y logica de render | `"Video Comercial Vertical (9:16)"`, `"Posteo Rectangular (1080x1350)"`, `"Posteo Cuadrado (1080x1080)"`, `"Meta Ads Shopping (Collection Ad)"` |
| `dolor` | string | Dolor del ICP que ataca esta pieza | `"El tofu es feo, sin sabor y de mala calidad — la experiencia generica del super"` |
| `solucion` | string | Solucion que presenta la pieza | `"Combo Degustacion de Tofu Completo: variedades de tofu artesanal fresco..."` |
| `comunicacion` | string | Descripcion de la pieza. Si tiene formato `[0-3s] HOOK —` se parsea como desglose de produccion con timeline | `"[0-3s] HOOK — Angel plano medio... [3-5s] BODY — ..."` |

**Video (cuando formato contiene "video", "reel" o "ugc"):**

| Campo | Tipo | Descripcion |
|---|---|---|
| `hook` | string | Frase de apertura (se renderiza en rojo) |
| `body` | string | Cuerpo del guion |
| `cta` | string | Call to action (se renderiza en verde) |

**Estatico (cuando formato contiene "posteo", "carrusel", "story", "shopping"):**

| Campo | Tipo | Descripcion |
|---|---|---|
| `mensajes` | string[] | Bullet list de mensajes/slides. En carruseles, cada item es un slide |

**Framework de produccion (todos opcionales, null = "Por definir" amber):**

| Campo | Tipo | Descripcion |
|---|---|---|
| `pilar` | string | Pilar de contenido: "Producto", "Marca", "Comunidad" |
| `tema` | string | Tema especifico: "Calidad artesanal vs experiencia generica" |
| `formatoNarrativo` | string | Formato narrativo: "Direct to Camera — Talking Head", "Producto — Showcase" |
| `estructuraNarrativa` | string | Estructura: "Hook - Contenido - Accion", "Afirmacion - Evidencia" |
| `tratamiento` | `{ tipo, tono, estilo }` | Tipo: "Video"/"Carrusel"/"Imagen". Tono: "Cinematic"/"Mixed"/"Organico (UGC)". Estilo: "Lifestyle"/"Motion Graphics" |
| `duracion` | string | Solo video. Se muestra como badge negro: "15-22s" |

**Copy y destino (opcionales):**

| Campo | Tipo | Descripcion |
|---|---|---|
| `copyAnuncio` | string | Copy completo del anuncio (con emojis, saltos de linea). Se renderiza en bloque monoespaciado |
| `destinoUrls` | string[] | URLs de destino del ad. Se renderizan como links clickeables con icono |

**Referencias por pieza (opcionales, 3 formas mutuamente excluyentes):**

| Campo | Tipo | Uso |
|---|---|---|
| `referencias` | `ReferenciaCreativa[]` | Array de refs con embed automatico (IG, YT, TikTok, Pinterest). **Preferir este.** |
| `referenciaAudiovisual` | string | Solo video. Texto libre: "Ref: reel de @marca — hook directo a camara" |
| `referenciaGrafica` | string | Solo estatico. Texto libre: "Ref: Soyana — caja abierta con productos" |

Prioridad de render: `referencias` > `referenciaAudiovisual`/`referenciaGrafica` > estado vacio "A completar".

**Control de estado:**

| Campo | Tipo | Descripcion |
|---|---|---|
| `enRevision` | boolean | `false` = pieza lista (expandible). `true` o undefined = pieza bloqueada (gris, opaca, no expandible, badge "EN REVISION"). Default: `true` — **hay que poner `enRevision: false` explicitamente para que la pieza sea visible** |

#### Formato de `ReferenciaCreativa`

```js
{ url: "https://www.instagram.com/reel/ABC123/", titulo: "Ref hook UGC" }
{ url: "https://ar.pinterest.com/pin/123456/", titulo: "Moodboard lifestyle" }
{ url: "https://www.youtube.com/watch?v=ABC", titulo: "Ref cinematica" }
```

El campo `tipo` es opcional y casi nunca se necesita:
- `null` (default): auto-detecta por URL si embeber como iframe o mostrar como link
- `"iframe"`: forzar embed como iframe
- `"link"`: forzar render como link clickeable (no iframe)

**Plataformas con embed automatico:** Instagram (`/p/`, `/reel/`, `/tv/`), YouTube, TikTok, Pinterest (`.com`, `.es`, `.com.mx`, `.com.ar`, subdominios como `ar.pinterest.com`).

#### Moodboard global: `referenciasMoodboard`

Campo en `FoundationData` (no dentro de `creativos`). Array de `ReferenciaCreativa[]` que se renderiza como ultima seccion del brief en un grid responsive. Ideal para mood general, estilo visual y referencias de competencia.

```js
referenciasMoodboard: [
  // Video — embeds de Instagram
  { url: "https://www.instagram.com/p/DbEgvV7M5A2/", titulo: "Soyana — Tofu Listo" },
  // Estatico — embeds de Pinterest
  { url: "https://ar.pinterest.com/pin/961096376731442635/" },
],
```

Soporta las mismas plataformas que las referencias por pieza (IG, YT, TikTok, Pinterest). Si la URL no matchea ninguna plataforma, se renderiza como link.

#### Output del brief

El brief se genera automaticamente con el resto de los docs al correr `npx tsc && node gen-{slug}.mjs`.

| Output | Ruta |
|---|---|
| Brief de Creativos | `briefs/{slug}/brief_creatives.html` |
| Desktop | `~/Desktop/brief_creatives.html` |

El brief NO se publica en ree-website (es documento interno de produccion).

Con el brief entregado, se cierra la etapa de Foundation.

#### Donde encontrar referencias para el brief

- **Meta Ad Library** (`facebook.com/ads/library`): buscar competidores por nombre. Filtrar pais y status activo.
- **TikTok Creative Center** (`ads.tiktok.com/business/creativecenter`): Top Ads por industria.
- **Instagram**: reels de competidores y marcas referentes. URL tipo `instagram.com/reel/XXX` o `instagram.com/p/XXX`.
- **Pinterest**: pins de estilo visual / moodboard. URL tipo `pinterest.com/pin/XXX`.
- **Foreplay** (`foreplay.co`): banco de ads filtrable por industria y formato.
- **`competenciaAds`** del propio `FoundationData`: si el cliente ya tiene analisis de competencia con `postUrl`, reusar esas URLs como referencias del moodboard.

## Estructura del proyecto

- `src/index.ts` -- entry point, registra los tools y arranca StdioServerTransport.
- `src/types/foundation.ts` -- interfaces TypeScript (contrato de datos).
- `src/tools/generar-foundation-doc.ts` -- tool MCP: recibe JSON, devuelve onboarding + foundation review HTMLs.
- `src/tools/generar-brief-creativos.ts` -- tool MCP: recibe JSON, devuelve brief de creativos HTML.
- `src/lib/playbook-renderer.ts` -- doc interno completo (8 secciones collapsibles).
- `src/lib/onboarding-renderer.ts` -- onboarding KO Call para el cliente (4 secciones dropdown).
- `src/lib/strategy-renderer.ts` -- Foundation Review (6 secciones abiertas).
- `src/lib/brief-renderer.ts` -- Brief de Creativos (resumen + piezas por ICP con framework de produccion).
- `src/lib/template-parts.ts` -- CSS, colores REE, getBaseStyles() (interno) + getClientStyles() (cliente).
- `src/lib/meta-business-guide.ts` -- contenido estatico: pasos para setup de Meta Business (equipo REE).
- `src/lib/client-onboarding-guide.ts` -- contenido estatico: pasos para el cliente (FB Page, IG, tarjeta).

## Uso

```bash
cd foundation_skill_f2
npm install
npm run dev    # arranca el server MCP por stdio
```

## Tool: `generar-foundation-doc`

**Input:** un string JSON con la estructura `FoundationData` (ver `src/types/foundation.ts`).

**Output:** 2 content items (onboarding + foundation review, HTMLs autocontenidos con CSS inline y logos base64).

## Tool: `generar-brief-creativos`

**Input:** un string JSON con la estructura `FoundationData` (mismo input que generar-foundation-doc).

**Output:** 1 content item (brief de creativos HTML). Requiere `creativos.piezasPorIcp` con al menos un grupo de piezas.

## Doc 1: Playbook Interno (7 secciones collapsibles)

Header rojo, logo blanco, badge INTERNO, info confidencial.

1. **Setup Interno** -- Equipo asignado, resumen de propuesta (fee, pauta, canales, campanas, duracion), primeros pasos post-cierre (WhatsApp + bienvenida + KO Call)
2. **Configuracion y Accesos** -- Meta Ads (cuenta maestra + checklist unificada), integraciones de plataforma (Tienda Nube/Shopify con credenciales + conexion Pixel/Meta), requerimientos del cliente (brand assets, acceso web, WhatsApp, atencion leads), edge cases
3. **KO Call** -- Fecha, agenda, temas WOW, checklist de preparacion
4. **Roadmap de Ejecucion** -- Gantt 8 semanas + cards por fase (Foundation/Build/Launch/Scale)
5. **Estrategia** -- Palanca + ICP + oferta + calificacion leads + KPIs + presupuesto + limite de gasto cuenta
6. **Creativos y Arquitectura** -- Nomenclatura de ads + angulos creativos + UTM + campanas > ad sets > ads + capacidad atencion
7. **Notas** -- Contexto, bloqueantes, observaciones

## Doc 2: Onboarding del Cliente (4 secciones dropdown)

Documento para compartir con el cliente durante la KO Call. Header rojo, logo blanco (mismo estilo que doc interno), badge "ONBOARDING".

### Estructura

1. **Vista General** -- Intro personalizada + timeline bar con etapas del KO + descripcion de cada etapa (numero, nombre, objetivo)
2. **Setup Meta** -- Proceso paso a paso para crear presencia publicitaria (9 pasos: login FB, crear Page, crear Business Portfolio, crear Ad Account, conectar IG, conectar Page, asignar permisos a growth@, moneda, tarjeta). Incluye callout USD vs ARS y bloque de verificacion
3. **Accesos** -- Credenciales de plataforma e-commerce (ej. Tienda Nube). Incluye bloque de verificacion
4. **Proximos Pasos** -- Que hace REE esta semana (5 items: integraciones, KPIs, campanas, creativos, ofertas B2C) + Gantt roadmap + Foundation Review + contacto WhatsApp

### Etapas del KO Call

La KO Call se divide en 4 etapas con duracion asignada (total ~45 min):

| Etapa | Duracion | Objetivo |
|---|---|---|
| Apertura | 5 min | Intro: que vamos a configurar hoy (Meta Ads + REE Metrics + accesos e-commerce) |
| Onboarding Meta | 25 min | Setup completo de Meta (Page, Portfolio, Ad Account, IG, permisos, tarjeta) |
| Accesos | 10 min | Obtener credenciales de plataforma e-commerce |
| Cierre | 5 min | Proximos pasos + agendar Foundation Review |

### Gantt y Milestones

El roadmap muestra un Gantt de 8 semanas con rangos de fechas (inicio a inicio de la siguiente semana). Debajo de las campanas se renderizan milestones con fecha:

| Milestone | Semana | Descripcion |
|---|---|---|
| KO Call | S1 | Llamada de kickoff con el cliente |
| Foundation Review | S3 | Revision de todo el setup + demo REE Metrics + aprobacion para lanzar |
| Call ADS | S5, S7 | Calls de seguimiento de campanas activas (cada ~2 semanas) |
| Call Review ADS | S8 | Revision final del periodo de campanas |

Los milestones se definen en el renderer (no en el JSON del cliente) porque dependen de la estructura estandar del proyecto.

### Diseno

- Secciones con `<details open>` (dropdown con toggle +/-)
- Indice (TOC) con 4 items descriptivos y anchor links
- Timeline bar: etapas edge (Apertura/Cierre) en rojo, etapas centrales en slate
- Callouts con iconos: moneda ($), verificacion (check verde), WhatsApp (icono verde)
- Gantt sin marcador "HOY", solo semanas S1-S8 con rangos de fechas
- Cierre con icono WhatsApp: "Si tenes alguna duda, escribinos al grupo de WhatsApp."
- Usa getBaseStyles() (estilo interno) y logo blanco sobre header rojo

## Doc 3: Foundation Review (6 pasos fijos)

Header rojo, logo blanco, titulo "FOUNDATION REVIEW". Documento para la reunion de Foundation Review (semana 3).

La estructura es dinamica: las secciones se generan segun el `status` de las campanas en `arquitectura`.

### Estructura de 6 pasos

| Paso | Titulo | Contenido |
|------|--------|-----------|
| 01 | Foundation Review | Timeline bar con etapas de la llamada (derivadas automaticamente de las campanas) |
| 02 | Campaña [Activa] | Campaña lista para lanzar: nomenclatura, audiencia, KPIs, embeds IG, callout verde "N piezas listas". **Se omite si no hay campanas activas.** |
| 03 | Foundation [Strategy] | Mega-seccion con subsecciones: Competencia, ICPs, Angulos+Piezas, Campaña en Meta Ads, E-commerce. **Se omite si no hay campanas en desarrollo.** |
| 04 | REE Metrics | Dashboard: como ingresar, que vas a ver |
| 05 | Roadmap | Gantt 8 semanas + reuniones del proyecto |
| 06 | Proximos Pasos | Cards con responsable, tiempo, items |

### Campos requeridos en campanas (`arquitectura`)

Cada campana en `arquitectura` debe tener estos campos para la estructura de 6 pasos:

- `status`: `"activa"` o `"en-desarrollo"`. Define si la campana va en paso 02 (activa) o paso 03 (en-desarrollo).
- `destino`: string describiendo a donde apunta la campana (ej. "Perfil de Instagram (@defu.tofuco)", "WhatsApp Business de BTLandia").
- `kpisCampana`: array de strings con los KPIs de la campana (ej. ["Visitas al Perfil", "Alcance", "Interacciones"]).
- `presupuestoCampana`: objeto con `diario` y `mensual` (ej. { diario: "USD $5/dia", mensual: "USD $150/mes" }).

### Fallback para backward compatibility

Si ninguna campana tiene `status` definido, el renderer trata todas como `"en-desarrollo"`. Esto mantiene compatibilidad con datos legacy que no tienen el campo `status`.

## Doc 4: Brief de Creativos (piezas por ICP con framework de produccion)

Header rojo, logo blanco, badge "DOCUMENTO INTERNO". Documento de handoff para el equipo de produccion.

### Secciones del brief

| Seccion | Titulo | Contenido |
|---------|--------|-----------|
| 01 | Resumen | Datos del cliente (de datosF1), stat cards (piezas a producir vs pautar), desglose por formato, ICPs involucrados, formatos de entrega y tono |
| 02 | Framework de Produccion | Guia visual del framework: pilares, formatos narrativos, estructura, tratamiento y tono. Referencia para el equipo de produccion |
| 03+ | Piezas - ICP {Nombre} | Una seccion collapsible por cada ICP en `creativos.piezasPorIcp`. Cards expandibles por pieza |
| Ultima | Referencias | Moodboard global con embeds de Pinterest/Instagram/YouTube/TikTok. **Solo se renderiza si `referenciasMoodboard` tiene items.** |

### Card por pieza audiovisual (Video/UGC/Reel)

- Badge formato (rojo) + numero de pieza + badge duracion (negro)
- Framework: grid 2 columnas (Pilar, Tema, Formato Narrativo, Estructura Narrativa) + Tratamiento (tipo, tono, estilo)
- Destino: URLs clickeables de la landing/producto
- Dolor / Solucion (grid 2 columnas)
- Guion: Hook (rojo), Body, CTA (verde)
- Copy Anuncio: texto completo del ad en bloque monoespaciado
- Desglose de Produccion: timeline con columnas Tiempo / Momento / Toma / Dialogo (se parsea automaticamente de `comunicacion` si tiene formato `[0-3s] LABEL — ...`)
- Referencias: embeds de IG/YT/TikTok/Pinterest o texto libre

### Card por pieza estatica (Imagen/Carrusel/Story)

- Badge formato (gris/violeta/azul segun tipo) + numero de pieza
- Framework (mismo grid)
- Destino
- Dolor / Solucion
- Mensajes (bullet list, en carruseles cada item = 1 slide)
- Copy Anuncio
- Adaptaciones: nota automatica "Incluye adaptacion Story (1080x1920)"
- Referencias

### Colores de badge por formato

| Formato | Color | Icono |
|---------|-------|-------|
| Video / Reel / UGC | Rojo `#DD0513` | Play triangle |
| Story | Azul `#0369A1` | Smartphone |
| Carrusel | Violeta `#7C3AED` | Layers |
| Shopping | Verde `#059669` | Shopping bag |
| Posteo (feed) | Gris slate | Image |

### Piezas en revision

Si `enRevision` es `true` o undefined, la pieza se renderiza bloqueada: gris, opaca (45%), no expandible, badge amarillo "EN REVISION". **Poner `enRevision: false` explicitamente para que la pieza sea visible y expandible.**

Campos null/undefined del framework se renderizan como "Por definir" con fondo amber.

## Edge Cases

El sistema soporta edge cases configurables. Los mas comunes:
- **Sin Facebook Page**: el cliente no tiene Page, se crea bajo el portfolio de growth@.
- **Sin Instagram Business**: la cuenta es Personal, hay que convertirla.
- **Sin sitio web / sin Pixel**: se configura desde cero.

Cuando `aplica === true`, el edge case se muestra con borde rojo y badge "APLICA A ESTE CLIENTE" (solo en doc interno).

## Nomenclatura de Ads

Convencion de nombres para crear campanas, ad sets y ads en Meta Ads:

| Nivel | Formato | Ejemplo |
|---|---|---|
| Campana | `{Empresa}_{Objetivo}` | `Defu_Leads` |
| Ad Set | `Conjunto_{ICP}` | `Conjunto_ICP_A` |
| Ad | `Anuncio_{Formato}_{Angulo}_{Version}` | `Anuncio_Reel_Dolor_V1` |

Se renderiza en el doc de Estrategia (seccion Tus Campanas) y en el Playbook Interno (seccion Creativos y Arquitectura).

## Limite de Gasto por Cuenta Publicitaria

Campo `presupuesto.limiteGastoCuenta` (string | null). Define el tope de gasto que se configura en la cuenta publicitaria del cliente en Meta Business Suite.

Se renderiza en:
- Onboarding del Cliente (seccion Cuenta Publicitaria): callout informando al cliente del limite.
- Estrategia de Campanas (seccion KPIs y Presupuesto): var-card + callout.
- Playbook Interno (seccion Estrategia/Presupuesto): var-card + nota operativa para el equipo.

## Meta Business: nota clave

La pauta se paga con la tarjeta del cliente directo en Meta. REE no cobra porcentaje sobre ad spend. Todo se centraliza bajo growth@reecreativos.com.

## Clients

Cada cliente tiene sus docs en 4 carpetas:
- `clients-doc-internos/{slug}/foundation-{slug}.html` -- playbook interno
- `clients-onboardings/{slug}/onboarding-{slug}.html` -- onboarding cliente
- `clients-strategies/{slug}/estrategia-{slug}.html` -- estrategia cliente
- `briefs/{slug}/brief_creatives.html` -- brief de creativos (handoff produccion)
