# Discovery Skill F0

Servidor MCP para generar documentos de Discovery Fase 0 de Ree Creativos.

## Que hace

Recibe datos estructurados (extraidos por Claude de un transcript de Fathom) y genera un documento HTML branded interno para debatir con los founders. No es para el cliente.

## Workflow: como usar esta skill

Cuando el usuario pega un link de Fathom o pide generar un Discovery F0, seguir estos pasos en orden:

### Paso 1 — Obtener el transcript

1. Llamar `get_recording_by_url` con el link de Fathom para obtener el `recording_id` y `url`.
2. Llamar `get_meeting_summary` y `get_meeting_transcript` en paralelo con el `recording_id`.

### Paso 2 — Analizar y extraer datos

Leer el transcript completo y extraer toda la informacion que encaje en la estructura `DiscoveryData` (ver `src/types/discovery.ts`). Ser exhaustivo:

**ClientInfo**: nombre del contacto, empresa, sitio web, fecha de la llamada, URL de Fathom.

**5 Variables del Discovery (4P + ICP)** — el nucleo del framework, basado en las 4P de Kotler + ICP:
- **ICP**: a quien le vende, B2B vs B2C, cliente ideal, segmentos, ubicacion geografica.
- **Producto**: que vende, catalogo, lineas de producto, producto estrella, capacidad de produccion, diferenciador.
- **Precio**: como cobra, margenes por canal, listas de precios, plazos de pago, ticket promedio.
- **Plaza**: donde vende, canales de distribucion, logistica, cobertura geografica, e-commerce, local fisico.
- **Promocion**: como se da a conocer, inversion en ads, contenido, redes, CRM, automatizacion, pauta.

Para cada variable: `valor` es la descripcion desarrollada de lo que se detecto. Si el dato NO se menciono en la llamada, poner `null` en el valor y explicar en `notas` que no se discutio. Las notas sirven para contexto adicional, observaciones y datos faltantes. Nunca inventar datos.

**Calculo CPL**: llenar ticket, margen, porcentajeMargenParaAds, tasaDeCierre y cplMercado si se mencionaron. Los campos calculados (cpaMaximo, cplObjetivo, escenario) pueden ir null — el tool los calcula automaticamente.

**Valor del Servicio**: estimar las lineas de inversion para el cliente. Cada linea tiene concepto, monto (ej: "USD 400-600"), descripcion y tipo ("unico", "mensual" o "por-proyecto"). Incluir nota de ROI concreta basada en los escenarios de viabilidad (en cuanto tiempo recupera la inversion con escenario conservador y moderado) y aclaraciones al pie.

**Gaps**: listar datos que faltaron o quedaron ambiguos. Para cada gap:
- variable afectada
- descripcion del gap
- prioridad (alta/media/baja)
- pregunta sugerida para que los founders le pregunten al cliente

**Citas textuales**: extraer 4-8 frases textuales del cliente que revelen insights clave. Incluir contexto de en que momento de la conversacion se dijeron.

**Resumen ejecutivo**: 2-3 parrafos que sinteticen la situacion del cliente, sus objetivos y las principales conclusiones.

**Proximos pasos**: maximo 3 pasos concretos. El ultimo siempre debe ser desarrollar la propuesta final para presentar al cliente.

**Notas adicionales**: cualquier cosa relevante que no encaje en las otras secciones (ej: quienes participaron, acuerdos, restricciones mencionadas).

### Paso 3 — Generar el documento

Llamar al tool `generar-discovery-doc` pasando el JSON completo como string en el campo `discoveryData`.

### Paso 4 — Guardar el HTML

Guardar el HTML retornado en un archivo. Sugerir `~/Desktop/discovery-[nombre-empresa].html` salvo que el usuario indique otra ubicacion. Informar al usuario que puede abrir el archivo directamente en el browser.

## Estructura del proyecto

- `src/index.ts` — entry point, registra el tool y arranca StdioServerTransport.
- `src/types/discovery.ts` — interfaces TypeScript (contrato de datos).
- `src/tools/discovery/generar-discovery-doc.ts` — tool MCP: recibe JSON, devuelve HTML.
- `src/lib/html-renderer.ts` — funcion pura: DiscoveryData -> HTML string.
- `src/lib/template-parts.ts` — CSS, colores REE, fragmentos HTML.
- `src/lib/formulas.ts` — calculos CPA maximo / CPL objetivo.

## Uso

```bash
cd discovery_skill_f0
npm install
npx tsx src/index.ts          # arranca el server MCP por stdio
```

## Tool: `generar-discovery-doc`

**Input:** un string JSON con la estructura `DiscoveryData` (ver `src/types/discovery.ts`).

**Output:** HTML autocontenido (CSS inline) que se puede abrir directo en browser.

## Secciones del documento

1. **La Llamada** — Resumen ejecutivo, citas textuales, variables del discovery (4P + ICP)
2. **La Auditoria** — Estado actual de marketing digital: canales, contenido, pauta, problemas
3. **El Research** — Mercado, competidores, ICPs definidos con dolores/deseos/objeciones
4. **Propuesta de Valor del Cliente** — Diferencial competitivo y angulos de comunicacion por audiencia
5. **Plan de Accion** — Fases de trabajo, Gantt, canales, KPIs, viabilidad financiera (formula CPR + escenarios de rentabilidad)
6. **Valor del Servicio** — Tabla de inversion (concepto/tipo/monto), nota de ROI, aclaraciones
7. **Notas Adicionales** — Contexto extra de la llamada (participantes, acuerdos, observaciones)
8. **Resumen y Proximos Pasos** — Sintesis del diagnostico + 3 pasos concretos

## Formulas

- CPA maximo (CPR) = ticket * (margen / 100) * (% margen para ads / 100)
- CPL objetivo = CPA maximo * (tasa de cierre / 100)
- ROAS breakeven = 1 / (margen / 100)
- Escenario: ratio CPL objetivo / CPL mercado >= 1.2 (favorable), >= 0.8 (ajustado), < 0.8 (inviable)

## Estructura de la llamada de Discovery

La llamada de Discovery sigue una estructura de 3 etapas + follow-up post-call. Documento operativo completo en `~/Desktop/guia-llamadas-ree-growth.html`.

### Etapa 1 — Apertura y Contexto (~5 min)
1. **Presentacion**: cada persona se presenta con nombre y rol. Si Jona esta solo, se presenta como Growth Manager de REE.
2. **Explicar que es REE Growth**: las 3 verticales (Marketing + Tech + Data). Un servicio/producto integral para ayudar a las empresas a crecer en ventas de forma medible.
3. **Escuchar la intencion del cliente**: pregunta abierta ("¿Que te trajo aca? ¿Cual es el objetivo que buscas alcanzar?"). Luego comentar que se le va a realizar una serie de preguntas sobre su negocio para comprender el estadio actual.

### Etapa 2 — El Diagnostico 4P + ICP (~30-40 min)
Recorrer las 5 variables del framework. El orden es flexible, se sigue el hilo natural de la conversacion.

1. **ICP (Cliente Ideal)**: tipo de cliente (B2B/B2C/mixto), segmentos (cual le sirve mas por margenes), ciclo de venta (cuanto tarda en cerrar, si recompra, cada cuanto), geografia.
2. **Producto**: oferta (producto, servicio o ambos), capacidad de crecimiento, diferenciador, estacionalidad. Aplica tanto para productos fisicos como servicios.
3. **Precio**: estructura de precios, margenes por canal (input critico para CPR), ticket promedio, plazos de pago.
4. **Plaza (Distribucion)**: canales de venta, distribucion por canal, logistica, clientes clave.
5. **Promocion**: marketing actual, inversion en ads, sistemas (CRM, automatizacion), crecimiento, competencia.

Cada pregunta tiene prioridad: CORE (obligatoria), PROFUNDIZAR (si la conversacion lo permite), SI DA (si hay tiempo).

### Etapa 3 — Cierre y Proximos Pasos (~5-10 min)
1. **Resumen**: resumir lo escuchado en 3-4 puntos para confirmar que se entendio bien.
2. **Que sigue**: explicar que se arma un roadmap personalizado + propuesta. Anticipar la estructura de inversion (servicio unico + fee mensual) sin dar numeros.
3. **Agendar fecha y mandar invite**: no salir sin fecha concreta. Mandar invite de Google Calendar antes de cortar. Si no esta en el calendario, no existe.
4. **Datos pendientes**: pedir lo que el cliente pueda compartir (fotos, catalogo, planilla de stock). No es bloqueante.

### Follow-up — Entre la Discovery y la Propuesta
1. **Mensaje post-call (mismo dia)**: idealmente crear un grupo de WhatsApp con todos los involucrados. Si no, mensaje 1 a 1. Agradecer, confirmar fecha, recordar datos pendientes.
2. **Confirmar invite de calendario**: verificar que fue aceptada. Si no, recordatorio en 24hs.
3. **Recopilar datos pendientes**: si el cliente quedo en pasar algo, hacer seguimiento a las 48hs.
4. **Reminder pre-reunion (24-48hs antes)**: confirmar que sigue en pie y generar expectativa.

## Convenciones de UI del documento

El renderer (`html-renderer.ts` + `template-parts.ts`) genera un HTML con convenciones de UI fijas. Estas convenciones deben mantenerse en todas las generaciones. Los datos cambian, la UI no.

### Formato de texto enriquecido

Los campos de texto soportan `**bold**` (doble asterisco markdown). El renderer convierte `**texto**` a `<strong>texto</strong>` en el HTML. Usar negritas para:
- Nombres de sistemas y herramientas: `**Callbell**`, `**DragonFish**`, `**Meta Pixel**`
- Numeros clave: `**189k seguidores**`, `**40+ marcas**`, `**0.01% de las ventas**`
- Frases de alto impacto: `**Sin Meta Pixel, sin CAPI, sin eventos de conversion.**`
- Primera oracion de una variable si es definitoria: `**B2C, retail fisico.**`

### Variables del Discovery (4P + ICP)

Las 5 variables se renderizan como cards colapsables (`<details>/<summary>`). Cada card tiene:
- Header con titulo en UPPERCASE y dot verde (tiene dato) o amarillo (sin dato)
- Body con la descripcion (`valor`) y notas en gris debajo
- Click en el header colapsa/expande el body

### Canales Activos

Los canales se renderizan como badges con icono SVG a la izquierda, no como chips de texto plano. El renderer auto-detecta el icono segun el nombre del canal (Instagram, Facebook, TikTok, WhatsApp/Callbell, E-commerce, Sucursales, REE Metrics). La primera parte del nombre (antes del primer parentesis o guion) se pone en `<strong>`.

### Problemas Identificados

Cada problema tiene un emoji auto-asignado segun keywords del texto:
- 📊 atribucion/medir/ROI
- 🎯 conversion
- 📍 segmentacion/zona
- 🛒 e-commerce
- 🚫 pixel/tracking
- 🔄 stock/manual/CRM
- 💳 credito/financiacion
- 📸 contenido/UGC
- ⚠️ default

El texto del problema antes del primer ":" se pone en `<strong>`.

### Gantt

El Gantt es dinamico: calcula automaticamente la cantidad de semanas (minimo 8) a partir del `lapso` maximo de las fases. Los colores de las barras alternan entre rojo REE y negro. Cada fase con `lapso` definido aparece como barra.

### Plan Cards (Valor del Servicio)

Si hay lineas con tipo `"mensual"`, el renderer las separa automaticamente:
- Lineas `"unico"` y `"por-proyecto"` van en una tabla de "Implementacion Base"
- Lineas `"mensual"` se renderizan como cards lado a lado (Plan Testeo vs Plan Integral)
- Si el concepto contiene "integral" o "recomendado", la card se marca con borde rojo y header rojo (`.plan-integral`)
- El tag entre parentesis del concepto (ej: "bajo riesgo") se extrae y muestra como badge
- La descripcion se parte en bullets por ". " para mostrar una lista limpia
- Si no hay lineas mensuales, todo va en la tabla generica (backward compatible)

### Seccion de Auditoria

La auditoria tiene 4 items en grid de 2 columnas:
- "Tracking y Medicion" (full width, spanning 2 columnas)
- "Contenido Actual"
- "Pauta Publicitaria"
- "E-commerce" (full width)

Debajo: canales activos (badges con iconos) y problemas (con emojis).

### Angulos y Propuesta de Valor

Los angulos se agrupan automaticamente por audiencia: B2C y B2B. Los de audiencia "ambos" aparecen en ambos grupos. Soportan texto enriquecido (`**bold**`) en mensaje, dolor y palanca.

### Seccion de Cierre

El resumen de cierre se renderiza con borde izquierdo rojo. Los proximos pasos se numeran automaticamente con counter CSS.

## Caso de referencia: Defu — The Tofu Co.

Primer discovery generado con esta skill. Ver `gen-defu.mjs` como ejemplo completo de `DiscoveryData`.

- **Cliente**: Angel Huang, Defu (tofu artesanal, Buenos Aires)
- **Situacion**: ventas estancadas, cero pauta digital, operacion manual, capacidad ociosa ~30%
- **Competencia**: Soyana (~80% mercado, 70 anuncios activos) + informales sin habilitacion
- **Diferencial**: unico artesanal con habilitacion sanitaria en Buenos Aires
- **Estrategia**: awareness Meta Ads → funnel B2C e-commerce → B2B por WhatsApp
- **Viabilidad**: CPR maximo $12,000 ARS, ROAS breakeven 1.33x, escenario moderado recupera inversion en el primer mes
- **Valor del servicio**: implementacion USD 400-600 (unico), integracion Tienda Nube USD 150-250 (por proyecto), fee mensual USD 200-350

## Caso de referencia: Grupo Lente — Star Deportes

Segundo discovery. Ver `gen-grupo-lente.mjs` como ejemplo de `DiscoveryData` con plan cards, competidores detallados, ICPs por genero y chatbot omnicanal.

- **Cliente**: Diego, Matias y Leandro, Grupo Lente (Star Deportes, 13 sucursales, periferia La Plata)
- **Situacion**: 13 anos de operacion fisica madura, cuasi-monopolio en pueblos. Digital sin desarrollar: 0.01% ventas online, sin Meta Pixel, sin campanas de conversion. 189k seguidores en IG.
- **Competencia**: Mateu Sports (45 ads), Open Sports (99 ads), Solo Deportes (73 ads) = 217 anuncios activos combinados
- **Diferencial**: credito personal interno (cupos $450k-600k, mora un digito), presencia en pueblos donde las cadenas no llegan
- **Estrategia**: funnel B2C e-commerce + campanas locales creditos personales + chatbot omnicanal. Digital como sensor de demanda para expansion presencial.
- **ICPs por genero**: Mujer 25-45 (renueva placard + hijos), Hombre 25-45 (equipamiento deportivo + hijos), Padres para hijos (estacional: cole, Dia del Nino)
- **Valor del servicio**: implementacion USD 500-700 (unico), Plan Testeo USD 300-400/mes, Plan Integral USD 400-600/mes (plan cards side-by-side)
