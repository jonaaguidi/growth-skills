# Foundation Skill F2

Servidor MCP para generar documentos de Foundation (Fase 2) de Ree Creativos.

## REGLA CRITICA: Aislamiento entre clientes

**Cada cliente es independiente. NUNCA tocar archivos de un cliente cuando se trabaja en otro.**

1. **No regenerar docs de otros clientes.** Si estas trabajando en `clients/btlandia/gen.mjs`, NO corras `clients/defu/gen.mjs`. Cada script genera SOLO los docs de su cliente.
2. **No modificar renderers con cambios que afecten docs ya entregados.** Si un Foundation Review ya fue entregado al cliente y esta publicado (ej. `ree-website/public/foundations/{slug}.html`), cualquier cambio en los renderers (`strategy-renderer.ts`, `onboarding-renderer.ts`, `brief-renderer.ts`, `template-parts.ts`) va a alterar el output al regenerar. Antes de modificar un renderer, considerar si hay docs entregados que se van a ver afectados.
3. **No publicar a ree-website sin verificar.** El script `clients/{slug}/gen.mjs` publica automaticamente a `ree-website/public/foundations/`. Si el doc ya fue entregado y esta live, regenerar va a sobreescribir la version entregada. Verificar con `git status` en ree-website antes de hacer deploy.
4. **Si se necesita regenerar un doc ya entregado**, verificar que el output sea identico o comunicar los cambios al equipo antes de deployear.

## REGLA: Uso de la ñ en texto renderizado

**Todo texto visible en los documentos generados debe usar la ñ correctamente** (campañas, diseño, señal, pequeña, etc.). NUNCA escribir "campanas", "diseno", "manana" en strings que se renderizan al HTML — ni en los renderers (`src/lib/*.ts`) ni en los datos de cliente (`clients/{slug}/gen.mjs`).

- Aplica solo a texto visible: nombres de variables, tipos, clases CSS e ids (`campanas`, `.campana-card`, `CampanaDefinida`) quedan sin ñ.
- Al terminar un doc, verificar con grep sobre el HTML generado: `grep -o 'campana[s]*\|diseno\|manana\|pequena' clients/{slug}/**/*.html` debe devolver 0 resultados de texto visible.

## REGLA CRITICA: Historial de cambios

**NUNCA sobreescribir un archivo HTML generado sin crear backup primero.**
Antes de escribir cualquier archivo en `clients/{slug}/`, el script de generacion debe:
1. Verificar si el archivo ya existe.
2. Si existe, copiarlo a `{nombre}.bak.{timestamp}.html` en el mismo directorio.
3. Recien entonces escribir la version nueva.

Esto aplica a los 3 documentos (onboarding, foundation-review, brief-creativos) y a cualquier script de generacion (`clients/{slug}/gen.mjs`).

## Que hace

**El entregable principal de esta skill es UNO solo: el Foundation Review.** Los otros dos documentos (Onboarding y Brief de Creativos) se mantienen como herramientas de backup, pero en el flujo actual no son necesarios: el Foundation Review ya incluye las piezas creativas con la estructura completa del brief (ver "REGLA: estructura unica de piezas").

Documentos que puede generar a partir de un mismo `FoundationData`:

1. **Foundation Review** (COMPARTIBLE, **entregable principal**): documento para la reunion de Foundation Review (semana 3). Incluye campanas, ICPs, angulos + piezas creativas completas, roadmap, KPIs, presupuesto y proximos pasos. Header blanco, logo rojo. Es el unico que se publica online.
2. **Onboarding del Cliente** (COMPARTIBLE, backup): pasos que el cliente debe hacer para arrancar (crear FB Page, vincular IG, tarjeta de pago, brand assets). Header blanco, logo rojo, sin info confidencial.
3. **Brief de Creativos** (INTERNO, backup): documento de handoff para el equipo de produccion con las piezas creativas desglosadas por ICP. Header rojo, logo blanco, badge INTERNO. Solo generarlo si el equipo de produccion pide un doc separado; las mismas cards ya viven en el Foundation Review.

## REGLA: Modelos de Foundation segun tipo de negocio (B2C vs B2B)

Existen **dos modelos de Foundation**. Antes de armar el `FoundationData` de un cliente nuevo, definir cual aplica:

### Modelo B2C (referencia canonica: `clients/defu/gen.mjs`)

Es el modelo original. Aplica a clientes que venden a consumidor final (e-commerce, retail, alimentos, etc.):

- **Destino de campanas**: e-commerce del cliente. Las piezas llevan `destinoUrls` a paginas de producto/coleccion.
- **Campanas**: orientadas a venta/conversion. Puede incluir Shopping (Collection Ad) con catalogo dinamico.
- **ICPs**: segmentos de consumo (recurrencia alta/media/baja). La prioridad se define por recurrencia de compra.
- **Piezas**: mix canonico de 9 piezas (3 video + 3 posteo rectangular + 2 carrusel + 1 shopping). Pilares "Producto" / "Marca" / "Comunidad".
- **Duplicacion por ICP**: las mismas piezas se asignan a varios ICPs; la diferenciacion se hace en el ad set de Meta (targeting), no en el creativo. Ej. Defu: 9 unicas x 2 ICPs = 18 a pautar.
- **Extras tipicos**: `ofertas` (packs), `cambiosEcommerce`, `pricingComparativa`.

### Modelo B2B (referencia canonica: `clients/btlandia/gen.mjs`)

Aplica a clientes que venden a empresas (servicios, agencias, proveedores corporativos):

- **Destino de campanas**: WhatsApp Business (click-to-message) o perfil de Instagram. Las piezas normalmente NO llevan `destinoUrls` (el destino es WhatsApp, sin URL de producto).
- **Campanas**: lead generation. Los conjuntos de anuncios se arman por **nivel de conciencia/demanda del ICP**, no por demografia de consumo. Ej. BTLandia: `Conjunto_Demanda_Activa` (ya compra este tipo de servicio) y `Conjunto_Demanda_Latente` (todavia no lo compra, hay que educarlo).
- **ICPs**: definidos por madurez de demanda. Usar `badge` custom ("Demanda activa" / "Demanda latente") y `ejemplosMarcas` con empresas reales que encajan en el perfil (con rol del decisor y avatar).
- **Segmentacion de ad sets**: por cargo del decisor (ej. "Cargos: Director de Marketing, Gerente de RRHH...") + tamano de empresa (empleados) + intereses profesionales.
- **Piezas**: exclusivas por ICP (NO duplicadas). Cada pieza ataca 1 dolor especifico del ICP (1 pieza = 1 dolor). Ej. BTLandia: 5 piezas por ICP, 10 en total. El ICP de demanda latente lleva piezas **educativas** (como funciona el proceso, cuanto cuesta, valor del servicio); el de demanda activa lleva piezas de **diferenciacion** (por que nosotros, track record, servicio integral).
- **Pilares**: adaptados al negocio (ej. BTLandia: "Interno (eventos para el equipo)" / "Externo (eventos para clientes)"), no los pilares B2C de Producto/Marca/Comunidad.
- **Formatos**: Video 9:16 + Carrusel 1080x1080 + Imagen 1080x1350. Sin Shopping (no hay catalogo e-commerce).

En ambos modelos las piezas usan la MISMA estructura completa de `PiezaCreativa` (ver regla siguiente); lo que cambia es la logica estrategica, no el formato de datos.

## Workflow: como usar esta skill

### Paso 1 -- Recopilar datos

Los datos vienen de tres fuentes:
1. **Propuesta F1 (compose-diagnostic)**: datos del cliente, canales, inversion, palanca propuesta.
2. **Discovery F0**: ICPs, variables 4P, auditoria.
3. **Input del equipo REE**: equipo asignado, edge cases, requerimientos del cliente.

### Paso 2 -- Construir el JSON

Armar la estructura `FoundationData` (ver `src/types/foundation.ts`). Primero definir el modelo segun el tipo de negocio (ver "REGLA: Modelos de Foundation segun tipo de negocio"):

- **B2C** → usar `clients/defu/gen.mjs` como ejemplo canonico.
- **B2B** → usar `clients/btlandia/gen.mjs` como ejemplo canonico.

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
- `arquitectura`: campanas con ad sets y ads. Array, requerido. Cada campana puede incluir `piezas` (PiezaCreativa[]) — **las piezas de campana usan SIEMPRE la estructura completa del Brief de Creativos** (ver "REGLA: estructura unica de piezas" abajo).
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

Copiar el gen.mjs del modelo que corresponda (`clients/defu/gen.mjs` para B2C, `clients/btlandia/gen.mjs` para B2B) a `clients/{slug}/gen.mjs` y reemplazar el objeto `data` con los datos del nuevo cliente. El script es un template reutilizable: todo se resuelve dinamicamente por `data.clientInfo.slug`.

### Paso 4 -- Correr el script

```bash
npx tsc && node clients/{slug}/gen.mjs
```

El script genera automaticamente:

| Output | Ruta |
|---|---|
| Onboarding cliente | `clients/{slug}/onboardings/onboarding-{slug}.html` |
| Foundation Review | `clients/{slug}/strategies/foundation-review-{slug}.html` |
| Brief de Creativos | `clients/{slug}/briefs/brief_creatives.html` |
| Desktop (los 3) | `~/Desktop/onboarding-{slug}.html`, `foundation-review-{slug}.html`, `brief_creatives_{slug}.html` |
| ree-website (publish) | `../../ree-website/public/foundations/{slug}.html` |

Si el archivo ya existe, el script crea un backup `.bak.{timestamp}.html` antes de sobreescribir.

Si el directorio de ree-website no existe (ej. otro dev), el publish se skipea sin error.

### Paso 5 -- Deploy y compartir

1. Hacer deploy de `ree-website` para que el link quede live.
2. Compartir `https://growth.reecreativos.com/foundation/{slug}` con el cliente.
3. Los docs internos (onboarding, brief de creativos) NO se publican online, solo se usan internamente.

### Paso 6 -- Brief de Creativos (handoff a produccion)

Despues de la Foundation Review, se genera el Brief de Creativos para hacer handoff al equipo de produccion. El brief usa el **mismo `FoundationData`** — lee las piezas de `creativos.piezasPorIcp` y las presenta con el framework de produccion.

**IMPORTANTE:** El brief requiere `creativos.piezasPorIcp` (array de `PiezasICP`). Si el cliente solo tiene `creativos.angulos` (como BTLandia), NO se puede generar el brief — primero hay que convertir los angulos a piezas concretas con dolor/solucion/comunicacion por ICP.

**IMPORTANTE:** Siempre compilar TypeScript antes de correr el gen script:

```bash
npx tsc && node clients/{slug}/gen.mjs
```

El gen script importa desde `../../dist/` (JS compilado), no desde `./src/` (TS fuente). Si no se compila, los cambios en renderers no se reflejan en el HTML.

#### REGLA: estructura unica de piezas (brief Y foundation review)

Existe **una sola forma de desarrollar piezas creativas** en esta skill: la estructura completa de `PiezaCreativa` documentada en esta seccion (la del Brief de Creativos, con `clients/defu/gen.mjs` como ejemplo canonico B2C y `clients/btlandia/gen.mjs` como ejemplo canonico B2B). Aplica en los DOS lugares donde viven piezas:

1. **`creativos.piezasPorIcp`** — piezas renderizadas en la subseccion "Angulos Creativos + Piezas" del Foundation Review (paso 03) y en el Brief de Creativos.
2. **`arquitectura[].piezas`** — piezas de campana activa, renderizadas en la seccion "Piezas Creativas (xN)" del Foundation Review.

**Ambos lugares renderizan la MISMA card completa del brief** (`renderPiezaCardStrategy` en `strategy-renderer.ts`): card expandible con Framework (pilar, tema, formato narrativo, estructura narrativa, tratamiento), Destino, Dolor/Solucion, Desglose de Produccion (timeline parseado de `comunicacion`), Guion o Mensajes, Copy Anuncio y Adaptaciones. En "Angulos Creativos + Piezas" las cards van agrupadas en un dropdown por ICP. NO existe una version "resumida" de card: toda pieza que entre al Foundation Review se levanta con la estructura completa del brief.

En ambos casos, **toda pieza (video o grafica) debe tener la estructura completa**:

- **Video (Reel/UGC)**: `dolor`, `solucion`, `comunicacion` en formato timeline `[Xs-Ys] LABEL — visual: 'dialogo'` (un solo `:` por segmento), `hook`/`body`/`cta`, framework completo (`pilar`, `tema`, `formatoNarrativo`, `estructuraNarrativa`, `tratamiento`, `duracion`), `copyAnuncio`, `destinoUrls`, `enRevision: false`.
- **Grafica (Imagen/Carrusel/Story/Shopping)**: `dolor`, `solucion`, `comunicacion` descriptiva, `mensajes[]` estructurados (patron Visual / Copy / Badge+CTA; en carruseles cada item = "Slide N: ..."), framework completo (sin `duracion`), `copyAnuncio`, `destinoUrls`, `enRevision: false`.

**NUNCA crear piezas "resumidas"** (solo dolor/solucion/hook suelto): sin la estructura completa, el Foundation Review y el brief renderizan campos "Por definir" en amber y el desglose de produccion no aparece. Si una pieza todavia no esta desarrollada, dejarla con `enRevision: true` en lugar de entregarla incompleta.

#### Guia: como crear piezas para un nuevo cliente

Proceso para ir de "tengo los ICPs y la estrategia" a piezas concretas listas para produccion. Aplica igual para `creativos.piezasPorIcp` (brief) y `arquitectura[].piezas` (foundation review):

1. **Partir de los dolores del ICP** — Cada pieza ataca un dolor especifico de `data.icp[].dolores`. El dolor define el angulo creativo. Una pieza = un dolor.
2. **Definir solucion** — La solucion es el producto/oferta que resuelve ese dolor. Debe ser concreta: nombre del combo/pack, precio, beneficio tangible. No generica.
3. **Elegir formato** — Segun el tipo de mensaje:
   - Video (9:16): storytelling, demos de producto, talking head, UGC. Para awareness y consideracion.
   - Posteo rectangular (1080x1350): imagen + copy largo. Para conversion y remarketing.
   - Carrusel cuadrado (1080x1080): catalogo, comparacion, paso a paso. 3-4 slides por carrusel.
   - Shopping (Collection Ad): catalogo dinamico con productos del e-commerce. Para venta directa.
4. **Escribir comunicacion** — Para video: usar formato timeline con separacion estricta entre visual y dialogo. Para estatico: describir la pieza visualmente (composicion, texto overlay, producto).

   **Formato timeline para video (campo `comunicacion`):**

   Cada segmento sigue el patron: `[Xs-Ys] LABEL — descripcion visual/toma: 'dialogo hablado'`

   - **LABEL**: `HOOK`, `BODY`, `CTA` o `CIERRE`. Siempre en mayusculas, seguido de ` — ` (em dash con espacios). Se renderiza en la columna "Momento".
   - **Descripcion visual** (antes del `:`): todo lo que se VE en pantalla (plano, movimiento de camara, inserts, badges, graficos). Se renderiza en la columna "Toma / Visual".
   - **Dialogo** (despues del `:`): SOLO la parte hablada, entre comillas simples `'...'`. Se renderiza en la columna "Dialogo".

   **Regla critica: un solo `:` por segmento.** El parser separa toma de dialogo en el PRIMER `:` que encuentra despues del `—`. Si la descripcion visual contiene `:` extra (ej. `Badge en edicion: Envio en el dia`), el parser va a cortar mal. Usar comas o parentesis en su lugar.

   Ejemplo correcto:
   ```
   [0-3s] HOOK — Angel plano medio, directo a camara, fondo limpio: 'Si pensas que el tofu es feo y no tiene sabor...'
   [3-5s] HOOK — Camara baja revelando el Combo Degustacion: '...es porque nunca probaste tofu artesanal.'
   [5-10s] BODY — Angel senala los productos, close-ups de cada variedad: 'Este es el Combo Degustacion de Defu...'
   [10-15s] BODY — Inserts rapidos, corte de tofu mostrando interior: '...elaborado con soja agroecologica.'
   [15-19s] CTA — Angel cierra mirando a camara. Badge en edicion, Envio en el dia CABA: 'Entra a defu.com.ar y te lo enviamos en el dia.'
   [19-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu + defu.com.ar.
   ```

   Ejemplo incorrecto (`:` extra rompe el parser):
   ```
   [10-15s] Inserts rapidos: corte de tofu mostrando interior: '...elaborado con soja agroecologica.'
   [15-19s] CTA — Badge en edicion: Envio en el dia CABA: 'Entra a defu.com.ar...'
   ```
5. **Escribir hook/body/cta (video) o mensajes (estatico)** — Video: `hook` es la frase de apertura (2-3s), `body` desarrolla el argumento, `cta` cierra con accion. Estatico: `mensajes[]` son los bullets o slides.
6. **Completar framework de produccion** — `pilar`, `tema`, `formatoNarrativo`, `estructuraNarrativa`, `tratamiento` (tipo/tono/estilo), `duracion` (solo video). Todos deben estar presentes; null = "Por definir" amber en el brief.
7. **Escribir copyAnuncio** — Copy completo del ad tal como aparece en Meta (ver convencion abajo en "Formato de copyAnuncio").
8. **Agregar destinoUrls** — URLs del producto/coleccion en el e-commerce. Array de strings.
9. **Agregar referencias** — Usar `referencias: [{ url, titulo }]` con URLs de IG/Pinterest/YT/TikTok. Preferir embed sobre texto libre.
10. **Marcar `enRevision: false`** — Para que la pieza sea visible y expandible en el brief. Sin esto, la pieza queda bloqueada en gris.

#### Mix de piezas recomendado

Mix canonico basado en Defu (9 piezas unicas):

| Formato | Cantidad | Uso | Duracion |
|---------|----------|-----|----------|
| Video Comercial Vertical (9:16) | 3 | Talking head, demo producto, UGC. Awareness y storytelling | 15-22s |
| Posteo Rectangular (1080x1350) | 3 | Imagen + copy. Conversion y remarketing. Incluye adaptacion Story (1080x1920) | — |
| Posteo Cuadrado / Carrusel (1080x1080) | 2 | Catalogo, comparacion, paso a paso. 3-4 slides | — |
| Meta Ads Shopping (Collection Ad) | 1 | Catalogo dinamico del e-commerce. Venta directa | — |

El mix puede variar segun el cliente y la industria. Lo importante es cubrir las 3 funciones: video (awareness/storytelling), estatico (conversion/producto) y shopping (venta directa). Clientes con e-commerce fuerte pueden necesitar mas shopping; clientes de servicios pueden no necesitar shopping.

**Mix B2B** (referencia BTLandia, 5 piezas por ICP, exclusivas):

| Formato | Cantidad por ICP | Uso | Duracion |
|---------|------------------|-----|----------|
| Video Comercial Vertical (9:16) | 2 | Talking head del founder, BTS/timelapse. Autoridad y educacion | 20-25s |
| Carrusel (1080x1080) | 2 | Proceso paso a paso, comparacion, diferenciacion. 4 slides | — |
| Imagen (1080x1350) | 1 | Flyer de confianza/metricas. Incluye adaptacion Story (1080x1920) | — |

Sin Shopping. El CTA de todas las piezas apunta a WhatsApp.

#### Patron de duplicacion por ICP

Las mismas piezas se pueden asignar a multiples grupos de ICP cuando:
- Los dolores son compartidos entre segmentos (no especificos de uno)
- La diferenciacion entre ICPs se hace en el **ad set de Meta** (targeting por intereses/demograficos), no en el creativo

Metricas del brief:
- **"Producir"** = piezas unicas (combinaciones unicas de `formato + dolor`). Es el trabajo real de produccion.
- **"Pautar"** = total de instancias en Meta Ads (piezas × ICPs). Es lo que se configura en la cuenta publicitaria.

Ejemplo Defu: 9 piezas unicas × 2 ICPs = 9 a producir, 18 a pautar.

Si un ICP tiene dolores muy distintos al resto, crear piezas exclusivas para ese segmento en lugar de duplicar.

**Este patron de duplicacion es tipico de B2C.** En el modelo B2B las piezas son exclusivas por ICP (los niveles de conciencia son distintos: demanda activa vs latente), asi que no se duplica: cada ICP recibe sus propias piezas atacando sus propios dolores (ver "REGLA: Modelos de Foundation segun tipo de negocio").

#### Formato de copyAnuncio

Convenciones para escribir el copy del anuncio (campo `copyAnuncio` de PiezaCreativa):

```
🔥 [Hook fuerte — primera linea que se ve en el feed]

✅ [Beneficio/argumento 1]
✅ [Beneficio/argumento 2]
✅ [Beneficio/argumento 3]

💰 [Precio/oferta concreta]
📦 [Envio/logistica]

👉 [CTA con URL o instruccion]
```

Reglas:
- Primera linea es el hook — debe generar curiosidad o atacar el dolor directo
- Usar emojis al inicio de cada linea como marcadores visuales
- Bloques separados por `\n\n` (doble salto de linea)
- Incluir precio concreto cuando aplique (no "consultar precio")
- CTA final con emoji de flecha `👉` y accion especifica
- El copy se renderiza en bloque monoespaciado en el brief

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
| `comunicacion` | string | Descripcion de la pieza. Si tiene formato `[0-3s] HOOK —` se parsea como desglose de produccion con timeline. **Separar visual de dialogo con un unico `:` por segmento** (ver "Formato timeline para video" arriba) | `"[0-3s] HOOK — Angel plano medio, fondo limpio: 'Si pensas que el tofu es feo...' [3-5s] BODY — ..."` |

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

El brief se genera automaticamente con el resto de los docs al correr `npx tsc && node clients/{slug}/gen.mjs`.

| Output | Ruta |
|---|---|
| Brief de Creativos | `clients/{slug}/briefs/brief_creatives.html` |
| Desktop | `~/Desktop/brief_creatives_{slug}.html` |

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

### Subseccion "Angulos Creativos + Piezas" (`creativos.piezasPorIcp`, paso 03)

Dentro de la mega-seccion Foundation (paso 03), la subseccion "Angulos Creativos + Piezas" renderiza las piezas de `creativos.piezasPorIcp` agrupadas en un dropdown `<details>` por ICP (header: "ICP N" + nombre del segmento + contador de piezas). Dentro de cada grupo, **cada pieza se renderiza con la card completa del brief** (`renderPiezaCardStrategy`), exactamente la misma que usa la seccion "Piezas Creativas (xN)" de la campana activa: Framework, Destino, Dolor/Solucion, Desglose de Produccion, Guion/Mensajes, Copy Anuncio y Adaptaciones.

**Esta es la forma estandar de levantar piezas en todo Foundation Review nuevo.** Al generar o regenerar un Foundation, las piezas de `creativos.piezasPorIcp` deben venir con la estructura completa de `PiezaCreativa` (ver "REGLA: estructura unica de piezas"); si una pieza viene resumida, la card muestra "Por definir" en amber y el desglose de produccion no aparece.

Ejemplo de referencia: `clients/btlandia/gen.mjs` (`creativos.piezasPorIcp` con 2 ICPs x 5 piezas, todas con framework completo, timeline y copyAnuncio).

### Seccion "Piezas Creativas" (`arquitectura[].piezas`)

Si la campana activa tiene `piezas` (PiezaCreativa[]), el Foundation Review inserta una seccion **"Piezas Creativas (xN)"** despues de la campana activa (la numeracion del TOC y de las secciones se ajusta automaticamente).

**Las piezas de campana siguen la MISMA estructura que el Brief de Creativos** (ver "REGLA: estructura unica de piezas" arriba). El renderer (`renderPiezaCardStrategy` en `strategy-renderer.ts`) muestra por pieza una card expandible con las mismas secciones que la card del brief:

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

## Clients

Cada cliente es una unidad autocontenida en `clients/{slug}/`:

```
clients/{slug}/
├── gen.mjs                              ← script de generacion
├── briefs/brief_creatives.html          ← brief de creativos (handoff produccion)
├── onboardings/onboarding-{slug}.html   ← onboarding cliente
└── strategies/foundation-review-{slug}.html ← foundation review
```
