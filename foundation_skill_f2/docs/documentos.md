# Documentos generados — Referencia detallada

Estructura detallada de los 3 documentos que genera la skill, el contrato de datos `FoundationData` y convenciones asociadas (edge cases, nomenclatura de ads, limite de gasto).

## Contrato de datos: `FoundationData`

Fuente de verdad: `src/types/foundation.ts`. Ejemplos canonicos: `clients/defu/gen.mjs` (B2C) y `clients/btlandia/gen.mjs` (B2B).

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
- `arquitectura`: campanas con ad sets y ads. Array, requerido. Cada campana puede incluir `piezas` (PiezaCreativa[]) — **las piezas de campana usan SIEMPRE la estructura completa del Brief de Creativos** (ver `docs/piezas.md`).
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

## Doc 1: Onboarding del Cliente (4 secciones dropdown)

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

## Doc 2: Foundation Review (6 pasos fijos)

Header rojo, logo blanco, titulo "FOUNDATION REVIEW". Documento para la reunion de Foundation Review (semana 3).

La estructura es dinamica: las secciones se generan segun el `status` de las campanas en `arquitectura`.

### Estructura de 6 pasos

| Paso | Titulo | Contenido |
|------|--------|-----------|
| 01 | Foundation Review | Timeline bar con etapas de la llamada (derivadas automaticamente de las campanas) |
| 02 | Campaña [Activa] | Campaña lista para lanzar: nomenclatura, audiencia, KPIs, embeds IG, callout verde "N piezas listas". **Se omite si no hay campanas activas.** |
| 03 | Foundation [Strategy] | Mega-seccion con subsecciones: Competencia, ICPs, Guiones + Piezas Creativas, Campaña en Meta Ads, E-commerce. **Se omite si no hay campanas en desarrollo.** |
| 04 | REE Metrics | Dashboard: como ingresar, que vas a ver |
| 05 | Roadmap | Gantt 8 semanas + reuniones del proyecto |
| 06 | Proximos Pasos | Cards con responsable, tiempo, items |

### Campos requeridos en campanas (`arquitectura`)

Cada campana en `arquitectura` debe tener estos campos para la estructura de 6 pasos:

- `status`: `"activa"` o `"en-desarrollo"`. Define si la campana va en paso 02 (activa) o paso 03 (en-desarrollo).
- `destino`: string describiendo a donde apunta la campana (ej. "Perfil de Instagram (@defu.tofuco)", "WhatsApp Business de BTLandia").
- `kpisCampana`: array de strings con los KPIs de la campana (ej. ["Visitas al Perfil", "Alcance", "Interacciones"]).
- `presupuestoCampana`: objeto con `diario` y `mensual` (ej. { diario: "USD $5/dia", mensual: "USD $150/mes" }).
- `tituloSubseccion` (opcional): titulo custom de la subseccion "Campaña en Meta Ads" del paso 03 (ej. "Campaña B2B en Meta Ads"). Si no se define, se usa `Campaña {objetivo} en Meta Ads`.
- `conversionCampana` (opcional): evento de conversion mostrado en la card "Conversion" (ej. "Cantidad de Mensajes a WhatsApp"). Si no se define, se usa el join de `kpisCampana`.

### Subseccion "Guiones + Piezas Creativas" (`creativos.piezasPorIcp`, paso 03)

Dentro de la mega-seccion Foundation (paso 03), la subseccion "Guiones + Piezas Creativas" renderiza las piezas de `creativos.piezasPorIcp` agrupadas en un dropdown `<details>` por ICP (header: "ICP N" + nombre del segmento + contador de piezas). Dentro de cada grupo, **cada pieza se renderiza con la card completa del brief** (`renderPiezaCardStrategy`), exactamente la misma que usa la seccion "Piezas Creativas ({sufijo de campana})" de la campana activa: Framework, Destino, Dolor/Solucion, Desglose de Produccion, Guion/Mensajes, Copy Anuncio y Adaptaciones.

**Esta es la forma estandar de levantar piezas en todo Foundation Review nuevo.** Al generar o regenerar un Foundation, las piezas de `creativos.piezasPorIcp` deben venir con la estructura completa de `PiezaCreativa` (ver `docs/piezas.md`); si una pieza viene resumida, la card muestra "Por definir" en amber y el desglose de produccion no aparece.

Ejemplo de referencia: `clients/btlandia/gen.mjs` (`creativos.piezasPorIcp` con 2 ICPs, todas las piezas con framework completo, timeline y copyAnuncio).

### Seccion "Piezas Creativas" (`arquitectura[].piezas`)

Si la campana activa tiene `piezas` (PiezaCreativa[]), el Foundation Review inserta una seccion **"Piezas Creativas ({sufijo de campana})"** despues de la campana activa, ej. "Piezas Creativas (Awareness)" para `BTLandia_Awareness` (fallback "(xN)" si el nombre de campana no tiene sufijo). La numeracion del TOC y de las secciones se ajusta automaticamente.

**Las piezas de campana siguen la MISMA estructura que el Brief de Creativos** (ver `docs/piezas.md`). El renderer (`renderPiezaCardStrategy` en `strategy-renderer.ts`) muestra por pieza una card expandible con las mismas secciones que la card del brief:

| Seccion | Fuente | Notas |
|---|---|---|
| Framework | `pilar`, `tema`, `formatoNarrativo`, `estructuraNarrativa`, `tratamiento` | null = "Por definir" amber |
| Destino | `destinoUrls` | Links clickeables |
| Dolor / Solucion | `dolor`, `solucion` | Grid 2 columnas |
| Desglose de Produccion | `comunicacion` con formato timeline `[Xs-Ys]` | Columnas Tiempo / Momento / Toma-Visual / Dialogo. Solo si `comunicacion` matchea el formato |
| Guion (video) / Mensajes (grafica) | `hook`/`body`/`cta` o `mensajes[]` | Hook rojo, CTA verde |
| Copy Anuncio | `copyAnuncio` | Bloque monoespaciado |
| Adaptaciones | automatico (solo graficas) | Badge "Incluye adaptacion Story (1080x1920)" |

Ejemplo de referencia: `clients/btlandia/gen.mjs` (campana `BTLandia_Awareness`, 4 piezas: 2 Reels con timeline + 1 Imagen + 1 Carrusel).

### Secciones bloqueadas (`seccionesBloqueadas`)

Campo opcional en `FoundationData`. Array de ids de seccion que se renderizan bloqueadas: grises, sin body (el contenido NO se incluye en el HTML), badge amber "EN PREPARACION", y el item del TOC queda gris sin link. Util para entregas parciales (ej. entregar solo hasta el paso 03).

Ids validos: `"foundation-campaign"`, `"ree-metrics"`, `"roadmap"`, `"proximos-pasos"`, `"piezas-creativas"`, o el slug de la campana activa.

```js
seccionesBloqueadas: ["foundation-campaign", "ree-metrics", "roadmap", "proximos-pasos"],
```

### Fallback para backward compatibility

Si ninguna campana tiene `status` definido, el renderer trata todas como `"en-desarrollo"`. Esto mantiene compatibilidad con datos legacy que no tienen el campo `status`.

## Doc 3: Brief de Creativos (piezas por ICP con framework de produccion)

Header rojo, logo blanco, badge "DOCUMENTO INTERNO". Documento de handoff para el equipo de produccion.

**IMPORTANTE:** El brief requiere `creativos.piezasPorIcp` (array de `PiezasICP`). Si el cliente solo tiene `creativos.angulos`, NO se puede generar el brief — primero hay que convertir los angulos a piezas concretas con dolor/solucion/comunicacion por ICP.

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

Se renderiza en el doc de Estrategia (seccion Tus Campanas).

La misma convencion se usa en el Brief de Creativos para nombrar las piezas de forma consistente con Meta Ads Manager. Ejemplo: `Anuncio_Reel_TofuDeVerdad_V1`, `Anuncio_Carrusel_Stockeate_V1`, `Anuncio_Shopping_Catalogo_V1`.

## Limite de Gasto por Cuenta Publicitaria

Campo `presupuesto.limiteGastoCuenta` (string | null). Define el tope de gasto que se configura en la cuenta publicitaria del cliente en Meta Business Suite.

Se renderiza en:
- Onboarding del Cliente (seccion Cuenta Publicitaria): callout informando al cliente del limite.
- Estrategia de Campanas (seccion KPIs y Presupuesto): var-card + callout.

## Meta Business: nota clave

La pauta se paga con la tarjeta del cliente directo en Meta. REE no cobra porcentaje sobre ad spend. Todo se centraliza bajo growth@reecreativos.com.
