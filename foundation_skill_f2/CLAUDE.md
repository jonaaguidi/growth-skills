# Foundation Skill F2

Servidor MCP para generar documentos de Foundation (Fase 2) de Ree Creativos.

## Que hace

Genera 3 documentos HTML branded a partir de un mismo `FoundationData`:

1. **Playbook Interno** (INTERNO, no compartir): todo el playbook operativo (onboarding + estrategia + checklists + roadmap) para el equipo REE. Header rojo, logo blanco, badge INTERNO.
2. **Onboarding del Cliente** (COMPARTIBLE): pasos que el cliente debe hacer para arrancar (crear FB Page, vincular IG, tarjeta de pago, brand assets). Header blanco, logo rojo, sin info confidencial.
3. **Estrategia de Campanas** (COMPARTIBLE): bajada detallada de campanas, roadmap 8 semanas, angulos creativos, KPIs, presupuesto. Header blanco, logo rojo.

## Workflow: como usar esta skill

### Paso 1 -- Recopilar datos

Los datos vienen de tres fuentes:
1. **Propuesta F1 (compose-diagnostic)**: datos del cliente, canales, inversion, palanca propuesta.
2. **Discovery F0**: ICPs, variables 4P, auditoria.
3. **Input del equipo REE**: equipo asignado, edge cases, requerimientos del cliente.

### Paso 2 -- Construir el JSON

Armar la estructura `FoundationData` (ver `src/types/foundation.ts`). Campos clave:

**clientInfo**: datos basicos del cliente (empresa, slug, contacto, industria, web).

**datosF1**: resumen de la propuesta aceptada (inversion, pauta, CPL, canales, palanca, campanas vendidas, duracion del proyecto, fechas de inicio y fin).

**Parte A - Onboarding**:
- equipoAsignado: miembros del equipo REE con rol y telefono.
- grupoWhatsApp: checklist de creacion de grupos internos y con el cliente.
- metaBusiness: setup completo bajo growth@reecreativos.com (portfolio, FB Page, IG, Ad Account, Pixel, CAPI). Incluir edgeCases activos.
- requerimientosCliente: brand assets, acceso web, WhatsApp info, atencion de leads, acceso a plataforma e-commerce (opcional).
- koCall: fecha, agenda, temas WOW, checklist de preparacion.

**Parte B - Estrategia**:
- palanca: Posicionamiento / Oferta / Captacion / Conversion + justificacion.
- icp: segmentos con dolores/deseos/objeciones y prioridad (primario/secundario).
- oferta: descripcion + diferenciador.
- calificacionLeads: matriz A/B/C con descripcion y accion.
- kpis: metricas con objetivo y fuente.
- presupuesto: pauta, fee, total, CPL target, limite de gasto cuenta publicitaria.
- creativos: angulos (nombre, dolor, mensaje, formato) + formatos + tono.
- utm: formato de campaign + ejemplos.
- arquitectura: campanas con ad sets y ads.
- capacidadAtencion: quien atiende, capacidad diaria, tiempo de respuesta, validado.

**Roadmap y bienvenida**:
- roadmap: iniciativas con fases (Foundation/Build/Launch/Scale) y semanas.
- mensajeBienvenida: mensaje personalizado para el doc de onboarding del cliente.

### Paso 3 -- Generar los documentos

Llamar al tool `generar-foundation-doc` pasando el JSON completo como string en `foundationData`.

El tool retorna 3 content items:
1. `<!-- PLAYBOOK_HTML -->` -- Doc interno completo
2. `<!-- ONBOARDING_HTML -->` -- Onboarding para el cliente
3. `<!-- STRATEGY_HTML -->` -- Estrategia de campanas

### Paso 4 -- Guardar los HTMLs

Guardar en las carpetas correspondientes:
- `clients-doc-internos/{slug}/foundation-{slug}.html` -- Playbook interno
- `clients-onboardings/{slug}/onboarding-{slug}.html` -- Onboarding cliente
- `clients-strategies/{slug}/estrategia-{slug}.html` -- Estrategia cliente

Informar al usuario que puede abrir cada uno en el browser.

## Estructura del proyecto

- `src/index.ts` -- entry point, registra el tool y arranca StdioServerTransport.
- `src/types/foundation.ts` -- interfaces TypeScript (contrato de datos).
- `src/tools/generar-foundation-doc.ts` -- tool MCP: recibe JSON, devuelve 3 HTMLs.
- `src/lib/playbook-renderer.ts` -- doc interno completo (8 secciones collapsibles).
- `src/lib/onboarding-renderer.ts` -- onboarding KO Call para el cliente (4 secciones dropdown).
- `src/lib/strategy-renderer.ts` -- estrategia de campanas (6 secciones abiertas).
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

**Output:** 3 content items (HTMLs autocontenidos con CSS inline y logos base64).

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

## Doc 3: Estrategia de Campanas (6 secciones abiertas)

Header blanco, logo rojo, titulo "ESTRATEGIA DE CAMPANAS".

1. **Objetivo** -- Palanca elegida + justificacion en lenguaje simple
2. **Tus Campanas** -- Nomenclatura de ads + campanas con ad sets y ads, lenguaje claro
3. **Tu Roadmap** -- Gantt visual 8 semanas + 4 cards explicando fases
4. **Creativos** -- Angulos creativos + formatos + tono de comunicacion
5. **KPIs y Presupuesto** -- Metricas en lenguaje simple + desglose presupuesto + limite de gasto cuenta
6. **Proximos Pasos** -- Que sigue despues de aprobar la estrategia

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

Cada cliente tiene sus docs en 3 carpetas:
- `clients-doc-internos/{slug}/foundation-{slug}.html` -- playbook interno
- `clients-onboardings/{slug}/onboarding-{slug}.html` -- onboarding cliente
- `clients-strategies/{slug}/estrategia-{slug}.html` -- estrategia cliente
