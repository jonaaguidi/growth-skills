# Piezas Creativas — Spec completa

Referencia completa para crear y editar piezas creativas (`PiezaCreativa`). Aplica a los DOS lugares donde viven piezas:

1. **`creativos.piezasPorIcp`** — piezas renderizadas en la subseccion "Guiones + Piezas Creativas" del Foundation Review (paso 03) y en el Brief de Creativos.
2. **`arquitectura[].piezas`** — piezas de campana activa, renderizadas en la seccion "Piezas Creativas ({sufijo de campana})" del Foundation Review (ej. "Piezas Creativas (Awareness)").

**Ambos lugares renderizan la MISMA card completa del brief** (`renderPiezaCardStrategy` en `strategy-renderer.ts`): card expandible con Framework (pilar, tema, formato narrativo, estructura narrativa, tratamiento), Destino, Dolor/Solucion, Desglose de Produccion (timeline parseado de `comunicacion`), Guion o Mensajes, Copy Anuncio y Adaptaciones. En "Guiones + Piezas Creativas" las cards van agrupadas en un dropdown por ICP. NO existe una version "resumida" de card: toda pieza que entre al Foundation Review se levanta con la estructura completa del brief.

Ejemplos canonicos: `clients/defu/gen.mjs` (B2C) y `clients/btlandia/gen.mjs` (B2B).

## Estructura completa obligatoria

Toda pieza (video o grafica) debe tener la estructura completa:

- **Video (Reel/UGC)**: `dolor`, `solucion`, `comunicacion` en formato timeline `[Xs-Ys] LABEL — visual: 'dialogo'` (un solo `:` por segmento), `hook`/`body`/`cta`, framework completo (`pilar`, `tema`, `formatoNarrativo`, `estructuraNarrativa`, `tratamiento`, `duracion`), `copyAnuncio`, `destinoUrls`, `enRevision: false`.
- **Grafica (Imagen/Carrusel/Story/Shopping)**: `dolor`, `solucion`, `comunicacion` descriptiva, `mensajes[]` estructurados (patron Visual / Copy / Badge+CTA; en carruseles cada item = "Slide N: ..."), framework completo (sin `duracion`), `copyAnuncio`, `destinoUrls`, `enRevision: false`.

**NUNCA crear piezas "resumidas"** (solo dolor/solucion/hook suelto): sin la estructura completa, el Foundation Review y el brief renderizan campos "Por definir" en amber y el desglose de produccion no aparece. Si una pieza todavia no esta desarrollada, dejarla con `enRevision: true` en lugar de entregarla incompleta.

## Guia: como crear piezas para un nuevo cliente

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
7. **Escribir copyAnuncio** — Copy completo del ad tal como aparece en Meta (ver "Formato de copyAnuncio" abajo).
8. **Agregar destinoUrls** — URLs del producto/coleccion en el e-commerce. Array de strings.
9. **Agregar referencias** — Usar `referencias: [{ url, titulo }]` con URLs de IG/Pinterest/YT/TikTok. Preferir embed sobre texto libre.
10. **Marcar `enRevision: false`** — Para que la pieza sea visible y expandible en el brief. Sin esto, la pieza queda bloqueada en gris.

## Mix de piezas recomendado

### Mix B2C (canonico, basado en Defu — 9 piezas unicas)

| Formato | Cantidad | Uso | Duracion |
|---------|----------|-----|----------|
| Video Comercial Vertical (9:16) | 3 | Talking head, demo producto, UGC. Awareness y storytelling | 15-22s |
| Posteo Rectangular (1080x1350) | 3 | Imagen + copy. Conversion y remarketing. Incluye adaptacion Story (1080x1920) | — |
| Posteo Cuadrado / Carrusel (1080x1080) | 2 | Catalogo, comparacion, paso a paso. 3-4 slides | — |
| Meta Ads Shopping (Collection Ad) | 1 | Catalogo dinamico del e-commerce. Venta directa | — |

El mix puede variar segun el cliente y la industria. Lo importante es cubrir las 3 funciones: video (awareness/storytelling), estatico (conversion/producto) y shopping (venta directa). Clientes con e-commerce fuerte pueden necesitar mas shopping; clientes de servicios pueden no necesitar shopping.

### Mix B2B (referencia BTLandia, 4 piezas por ICP, exclusivas)

El orden dentro de cada ICP es fijo: video / video / posteo + story / carrusel x3:

| Orden | Formato | Cantidad por ICP | Uso | Duracion |
|-------|---------|------------------|-----|----------|
| 1-2 | Video Comercial Vertical (9:16) | 2 | Talking head del founder, highlights de eventos. Autoridad y educacion. Siempre hablan a interno + externo | 20-25s |
| 3 | Posteo Rectangular (1080x1350) | 1 | Flyer de confianza/metricas. Incluye adaptacion Story (1080x1920) | — |
| 4 | Carrusel (1080x1080) | 1 | Diferenciacion, transparencia de presupuesto. 3 slides | — |

Sin Shopping. El CTA de todas las piezas apunta a WhatsApp.

## Patron de duplicacion por ICP

Las mismas piezas se pueden asignar a multiples grupos de ICP cuando:
- Los dolores son compartidos entre segmentos (no especificos de uno)
- La diferenciacion entre ICPs se hace en el **ad set de Meta** (targeting por intereses/demograficos), no en el creativo

Metricas del brief:
- **"Producir"** = piezas unicas (combinaciones unicas de `formato + dolor`). Es el trabajo real de produccion.
- **"Pautar"** = total de instancias en Meta Ads (piezas × ICPs). Es lo que se configura en la cuenta publicitaria.

Ejemplo Defu: 9 piezas unicas × 2 ICPs = 9 a producir, 18 a pautar.

Si un ICP tiene dolores muy distintos al resto, crear piezas exclusivas para ese segmento en lugar de duplicar.

**Este patron de duplicacion es tipico de B2C.** En el modelo B2B las piezas son exclusivas por ICP (los niveles de conciencia son distintos: demanda activa vs latente), asi que no se duplica: cada ICP recibe sus propias piezas atacando sus propios dolores.

## Formato de copyAnuncio

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

## Estructura de `creativos.piezasPorIcp`

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

## Campos de `PiezaCreativa`

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

## Formato de `ReferenciaCreativa`

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

## Moodboard global: `referenciasMoodboard`

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

## Donde encontrar referencias para el brief

- **Meta Ad Library** (`facebook.com/ads/library`): buscar competidores por nombre. Filtrar pais y status activo.
- **TikTok Creative Center** (`ads.tiktok.com/business/creativecenter`): Top Ads por industria.
- **Instagram**: reels de competidores y marcas referentes. URL tipo `instagram.com/reel/XXX` o `instagram.com/p/XXX`.
- **Pinterest**: pins de estilo visual / moodboard. URL tipo `pinterest.com/pin/XXX`.
- **Foreplay** (`foreplay.co`): banco de ads filtrable por industria y formato.
- **`competenciaAds`** del propio `FoundationData`: si el cliente ya tiene analisis de competencia con `postUrl`, reusar esas URLs como referencias del moodboard.
