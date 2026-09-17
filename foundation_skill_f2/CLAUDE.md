# Foundation Skill F2

Servidor MCP para generar documentos de Foundation (Fase 2) de Ree Creativos.

## Docs de referencia (leer segun la tarea)

- **`docs/piezas.md`** — spec completa de `PiezaCreativa`: campos, formato timeline de video, `copyAnuncio`, referencias/embeds, mixes B2C/B2B, guia paso a paso para crear piezas. **Leer SIEMPRE antes de crear o editar piezas creativas.**
- **`docs/documentos.md`** — contrato de datos `FoundationData` campo por campo + estructura detallada de los 3 documentos (Onboarding, Foundation Review, Brief), edge cases, nomenclatura de ads, limite de gasto. **Leer antes de armar el JSON de un cliente nuevo, modificar renderers o depurar el output HTML.**
- **`src/types/foundation.ts`** — interfaces TypeScript (fuente de verdad del contrato de datos).

## REGLA CRITICA: Aislamiento entre clientes

**Cada cliente es independiente. NUNCA tocar archivos de un cliente cuando se trabaja en otro.**

1. **No regenerar docs de otros clientes.** Si estas trabajando en `clients/btlandia/gen.mjs`, NO corras `clients/defu/gen.mjs`. Cada script genera SOLO los docs de su cliente.
2. **No modificar renderers con cambios que afecten docs ya entregados.** Si un Foundation Review ya fue entregado al cliente y esta publicado (ej. `ree-website/public/foundations/{slug}.html`), cualquier cambio en los renderers (`strategy-renderer.ts`, `onboarding-renderer.ts`, `brief-renderer.ts`, `template-parts.ts`) va a alterar el output al regenerar. Antes de modificar un renderer, considerar si hay docs entregados que se van a ver afectados.
3. **No publicar a ree-website sin verificar.** El script `clients/{slug}/gen.mjs` publica automaticamente a `ree-website/public/foundations/`. Si el doc ya fue entregado y esta live, regenerar va a sobreescribir la version entregada. Verificar con `git status` en ree-website antes de hacer deploy.
4. **Si se necesita regenerar un doc ya entregado**, verificar que el output sea identico o comunicar los cambios al equipo antes de deployear.

## REGLA CRITICA: Historial de cambios

**NUNCA sobreescribir un archivo HTML generado sin crear backup primero.**
Antes de escribir cualquier archivo en `clients/{slug}/`, el script de generacion debe:
1. Verificar si el archivo ya existe.
2. Si existe, copiarlo a `{nombre}.bak.{timestamp}.html` en el mismo directorio.
3. Recien entonces escribir la version nueva.

Esto aplica a los 3 documentos (onboarding, foundation-review, brief-creativos) y a cualquier script de generacion (`clients/{slug}/gen.mjs`).

## REGLA: Uso de la ñ en texto renderizado

**Todo texto visible en los documentos generados debe usar la ñ correctamente** (campañas, diseño, señal, pequeña, etc.). NUNCA escribir "campanas", "diseno", "manana" en strings que se renderizan al HTML — ni en los renderers (`src/lib/*.ts`) ni en los datos de cliente (`clients/{slug}/gen.mjs`).

- Aplica solo a texto visible: nombres de variables, tipos, clases CSS e ids (`campanas`, `.campana-card`, `CampanaDefinida`) quedan sin ñ.
- Al terminar un doc, verificar con grep sobre el HTML generado: `grep -o 'campana[s]*\|diseno\|manana\|pequena' clients/{slug}/**/*.html` debe devolver 0 resultados de texto visible.

## Que hace

**El entregable principal de esta skill es UNO solo: el Foundation Review.** Los otros dos documentos se mantienen como herramientas de backup.

Documentos que genera a partir de un mismo `FoundationData`:

1. **Foundation Review** (COMPARTIBLE, **entregable principal**): documento para la reunion de semana 3. Incluye campañas, ICPs, angulos + piezas creativas completas, roadmap, KPIs, presupuesto y proximos pasos. Es el unico que se publica online.
2. **Onboarding del Cliente** (COMPARTIBLE, backup): pasos que el cliente debe hacer para arrancar (FB Page, IG, tarjeta, brand assets).
3. **Brief de Creativos** (INTERNO, backup): handoff para produccion con las piezas por ICP. Solo generarlo si produccion pide un doc separado; las mismas cards ya viven en el Foundation Review. Requiere `creativos.piezasPorIcp`.

## REGLA: Modelos de Foundation segun tipo de negocio

Existen **dos modelos**. Antes de armar el `FoundationData` de un cliente nuevo, definir cual aplica:

| | **B2C** (canonico: `clients/defu/gen.mjs`) | **B2B** (canonico: `clients/btlandia/gen.mjs`) |
|---|---|---|
| Destino | E-commerce del cliente (`destinoUrls` a producto/coleccion) | WhatsApp Business o perfil de IG (normalmente sin `destinoUrls`) |
| Campanas | Venta/conversion. Puede incluir Shopping (Collection Ad) | Lead generation. Ad sets por **nivel de conciencia/demanda** (activa vs latente), no demografia |
| ICPs | Segmentos de consumo (recurrencia de compra) | Madurez de demanda. `badge` custom ("Demanda activa"/"Demanda latente") + `ejemplosMarcas` con empresas reales |
| Ad sets | Targeting demografico/intereses | Cargo del decisor + tamaño de empresa + intereses profesionales |
| Piezas | Mix canonico de 9 (3 video + 3 posteo + 2 carrusel + 1 shopping). **Duplicadas por ICP** (diferenciacion en el ad set, no en el creativo) | **Exclusivas por ICP** (4 c/u): demanda latente → piezas educativas; demanda activa → diferenciacion. 1 pieza = 1 dolor |
| Pilares | Producto / Marca / Comunidad | Adaptados al negocio (ej. BTLandia: Interno / Externo) |
| Formatos | Video 9:16, posteos, carrusel, Shopping | Video 9:16 + Carrusel 1080x1080 + Imagen 1080x1350. Sin Shopping |

En ambos modelos las piezas usan la MISMA estructura completa de `PiezaCreativa` (ver regla siguiente); lo que cambia es la logica estrategica, no el formato de datos. Detalle completo de mixes y duplicacion en `docs/piezas.md`.

## REGLA: Estructura unica de piezas

Existe **una sola forma de desarrollar piezas creativas**: la estructura completa de `PiezaCreativa` (spec en `docs/piezas.md`). Aplica tanto a `creativos.piezasPorIcp` como a `arquitectura[].piezas` — ambos renderizan la misma card completa del brief (`renderPiezaCardStrategy`).

- Toda pieza debe tener: `dolor`, `solucion`, `comunicacion` (timeline `[Xs-Ys] LABEL — visual: 'dialogo'` para video), `hook`/`body`/`cta` o `mensajes[]`, framework completo, `copyAnuncio`, `enRevision: false`.
- **NUNCA crear piezas "resumidas"**: renderizan "Por definir" en amber y sin desglose de produccion. Si una pieza no esta desarrollada, dejarla con `enRevision: true`.
- **Regla critica del timeline**: un solo `:` por segmento (el parser corta toma/dialogo en el primer `:`). Ver ejemplos en `docs/piezas.md`.

## Workflow

1. **Recopilar datos**: Propuesta F1 (compose-diagnostic) + Discovery F0 (ICPs, 4P, auditoria) + input del equipo REE (equipo asignado, edge cases).
2. **Construir el JSON** (`FoundationData`): definir primero B2C o B2B, usar el gen.mjs canonico como ejemplo. Referencia campo por campo en `docs/documentos.md` y `src/types/foundation.ts`.
3. **Crear el script**: copiar el gen.mjs del modelo que corresponda a `clients/{slug}/gen.mjs` y reemplazar el objeto `data`. Todo se resuelve dinamicamente por `data.clientInfo.slug`.
4. **Correr el script** (SIEMPRE compilar primero — el gen script importa desde `dist/`, no desde `src/`):

```bash
npx tsc && node clients/{slug}/gen.mjs
```

| Output | Ruta |
|---|---|
| Onboarding cliente | `clients/{slug}/onboardings/onboarding-{slug}.html` |
| Foundation Review | `clients/{slug}/strategies/foundation-review-{slug}.html` |
| Brief de Creativos | `clients/{slug}/briefs/brief_creatives.html` |
| Desktop (los 3) | `~/Desktop/onboarding-{slug}.html`, `foundation-review-{slug}.html`, `brief_creatives_{slug}.html` |
| ree-website (publish) | `../../ree-website/public/foundations/{slug}.html` |

Si el archivo ya existe, el script crea backup `.bak.{timestamp}.html` antes de sobreescribir. Si el directorio de ree-website no existe (ej. otro dev), el publish se skipea sin error.

5. **Deploy y compartir**: deployar `ree-website` y compartir `https://growth.reecreativos.com/foundation/{slug}`. Los docs internos (onboarding, brief) NO se publican online.
6. **Brief de Creativos** (solo si produccion lo pide): usa el mismo `FoundationData`, lee `creativos.piezasPorIcp`. Si el cliente solo tiene `creativos.angulos`, NO se puede generar — primero convertir angulos a piezas completas.

## Estructura del proyecto

- `src/index.ts` -- entry point, registra los tools y arranca StdioServerTransport.
- `src/types/foundation.ts` -- interfaces TypeScript (contrato de datos).
- `src/tools/generar-foundation-doc.ts` -- tool MCP: recibe JSON `FoundationData`, devuelve onboarding + foundation review HTMLs.
- `src/tools/generar-brief-creativos.ts` -- tool MCP: mismo input, devuelve brief de creativos HTML. Requiere `creativos.piezasPorIcp`.
- `src/lib/onboarding-renderer.ts` -- onboarding KO Call para el cliente (4 secciones dropdown).
- `src/lib/strategy-renderer.ts` -- Foundation Review (6 pasos).
- `src/lib/brief-renderer.ts` -- Brief de Creativos (resumen + piezas por ICP con framework de produccion).
- `src/lib/template-parts.ts` -- CSS, colores REE, getBaseStyles() (interno) + getClientStyles() (cliente).
- `src/lib/meta-business-guide.ts` -- contenido estatico: setup de Meta Business (equipo REE).
- `src/lib/client-onboarding-guide.ts` -- contenido estatico: pasos para el cliente (FB Page, IG, tarjeta).

HTML generado es self-contained (CSS inline, logos base64). Estructura de cada cliente:

```
clients/{slug}/
├── gen.mjs                              ← script de generacion
├── briefs/brief_creatives.html          ← brief de creativos (handoff produccion)
├── onboardings/onboarding-{slug}.html   ← onboarding cliente
└── strategies/foundation-review-{slug}.html ← foundation review
```

## Uso

```bash
cd foundation_skill_f2
npm install
npm run dev    # arranca el server MCP por stdio
```
