# Reestructuración de campañas Meta Ads — Star Deportes

**Fecha:** 11 de noviembre de 2026
**Cuenta publicitaria:** 486119648799424 · **Business:** 231240640803963
**Estado al cierre:** ambas campañas publicadas y encendidas (En preparación)

---

## 1. Contexto

La cuenta venía con las campañas de venta fragmentadas en varios conjuntos de anuncios chicos, cada uno con una audiencia distinta y acotada. Eso partía el presupuesto y la señal de conversión: ningún conjunto acumulaba el volumen necesario para que Meta saliera de aprendizaje.

El objetivo del día fue **reconstruir la estructura de venta B2C reutilizando las campañas y creativos ya existentes**, no armar todo de cero.

---

## 2. Decisiones estratégicas y por qué

| Decisión | Razón |
|---|---|
| **Consolidar 3 conjuntos en 1** (`Conjunto_General_3Anillos`) con los 17 anuncios juntos | El presupuesto fragmentado impedía salir de aprendizaje. Un solo conjunto concentra la señal de conversión. |
| **Audiencia nueva y más amplia** (`Base_B2C_General_3Anillos`) | La audiencia anterior (1,5-1,8M) era demasiado chica para una campaña de conversión. La nueva llega a 7,1-8,4M. |
| **Volver a los 3 cordones del GBA, sin CABA** | Pedido explícito del cliente: atacar zonas aledañas, no meterse en Capital. |
| **Reducir intereses de 18 a 7** | Dejar solo los principales. Demasiados intereses diluyen la señal y le quitan margen de optimización a Meta. |
| **Presupuesto a ARS 40.000/día** (≈60% del inicial) | Recopilar data sin quemar caja hasta tener señal de conversión. |
| **Lanzar los 17 creativos activos** | Meta segmenta desde el creativo. Darle todas las variantes para que encuentre el ganador. |
| **Nomenclatura limpia** (sin sufijo "- Copia") | Quedaban 11 anuncios con el sufijo de la duplicación. Se limpiaron todos. |
| **Shopping en campaña aparte**, con la misma audiencia nueva | No mezclar catálogo con los anuncios de marca ni romper los anuncios ya establecidos. |
| **Un anuncio por ICP en Shopping**, cada uno con su conjunto de productos | El conjunto de productos se declara **a nivel anuncio**, no a nivel conjunto. Con un solo ad set, la única forma de mostrar los 3 ICPs es con 3 anuncios. |
| **RTG pospuesto** hasta tener mínimo 5 ventas | Sin conversiones no hay a quién remarketear. |
| **Conjuntos viejos pausados, no borrados** | Conservan su historial de aprendizaje y métricas por si hay que volver. |
| **Dominio: no relevante** | Descartado del plan por decisión del equipo. |

### Sobre que las dos campañas compiten entre sí

Ventas (40k/día) y Shopping (15k/día) apuntan a la misma audiencia, misma geo, misma gente. Se señaló el riesgo de que se pisen en la subasta y de que la señal de conversión se parta en dos.

**Decisión del equipo: es deliberado.** Se lanzan ambas en paralelo para poder **evaluar y comparar las dos campañas** con la misma audiencia como variable controlada.

---

## 3. Lo que quedó armado

### `StarDeportes_Ventas_B2C_General` — ID 120250342260860390

- **Presupuesto:** ARS 40.000/día, CBO (presupuesto de la campaña)
- **Objetivo:** Ventas · **Evento:** Compra · **Ubicación de la conversión:** Sitio web
- **Dataset:** Star (Pixel ID 3618437238187724)
- **Atribución:** Estándar (7 días clic / 1 día interacción / 1 día visualización)
- **Conjunto:** `Conjunto_General_3Anillos` — ID 120250342261010390
  - Audiencia guardada `Base_B2C_General_3Anillos`
  - 20 localidades (3 cordones del GBA, incluye Zona Oeste; **sin CABA**)
  - Edad mínima 21 · rango 21-65+ · todos los géneros
  - 7 intereses principales
  - Advantage+ audience: **activo**
  - Alcance estimado: 7,1-8,4M
- **17 anuncios activos**, todos con nomenclatura limpia

### `StarDeportes_Ventas_B2C_Shopping` — ID 120250233741410390

- **Presupuesto:** ARS 15.000/día
- **Conjunto activo:** `Conjunto_General_3Anillos_Shopping` — ID 120250233741450390
  - Misma audiencia `Base_B2C_General_3Anillos`
- **3 anuncios, uno por ICP**, cada uno con su conjunto de productos:

| Anuncio | Conjunto de productos |
|---|---|
| `Shopping_Hombre` | `SET_Hombre_Calzado` |
| `Shopping_Mujer` | `SET_Mujer_Calzado` |
| `Shopping_Ninos` | `SET_Ninos_Familia` |

- **Conjuntos pausados** (historial intacto, no borrados):
  - `Conjunto_Mujer_25_50` — ID 120250233741430390 — 22.104 ARS gastados, 12.698 impresiones
  - `Conjunto_Padres_Hijos_3_12` — ID 120250233741440390 — 21.947 ARS gastados, 12.862 impresiones

---

## 4. Hallazgo 1 — El catálogo conectado a nivel campaña

### El problema

La campaña de Ventas tiene el catálogo "Star Deportes - Catálogo" conectado **a nivel campaña**. El requerimiento era que **en Ventas no apareciera ningún producto del catálogo**: el catálogo solo se muestra en la campaña Shopping, y ahí con el conjunto de productos por ICP que corresponda.

### Por qué no se pudo sacar el catálogo

`Datos de productos` a nivel campaña queda **bloqueado después de crear la campaña**. Solo se puede editar en un duplicado sin publicar, y al quitarlo (opción "No usar catálogo") **se destruye toda la configuración de creativos de los anuncios**:

- El contenido se vacía ("Especifica el contenido multimedia que debe mostrarse con este anuncio")
- Aparece el error bloqueante `#2061015 El campo 'link' es obligatorio`
- Los formatos se resetean de Secuencia a "Un solo vídeo o imagen"

Se probó en un duplicado descartable y se confirmó. El duplicado roto se eliminó.

### La solución

El catálogo a nivel campaña **no muestra productos por sí solo**. Los productos aparecen por un control separado a nivel anuncio:

> **Anuncio → Experiencias publicitarias → Opciones de visualización del formato → Secuencia / Colección → checkbox "Mostrar productos"**

Meta lo deja **activado por defecto**. Se auditaron los 17 anuncios y se desactivó donde estaba prendido. Desactivarlo **no rompe el creativo**, y al guardar Meta pone automáticamente "Orígenes de anuncios → Productos: Desactivado".

### Anuncios corregidos (6)

| Anuncio | Qué tenía |
|---|---|
| `04_Posteo_Cuotas40Marcas` | "Mostrar productos" en Secuencia y Colección |
| `06_Collection_Hombre` | "Mostrar lo más destacado del sitio web" en Secuencia |
| `01_VideoUGC_Atencion` | "Mostrar productos" en Secuencia y Colección |
| `03_Posteo_VestiATuHijo` | "Mostrar productos" en Secuencia y Colección |
| `02_Posteo_PlacardFamilia` | "Mostrar productos" en Secuencia y Colección |
| `02_Carrusel_Looks` | **El conjunto "Store collection – Todos los productos" asignado.** Lo más grave: Meta lo había auto-seleccionado. Se pasó a "No mostrar productos". |

Los otros 11 ya estaban limpios.

### Nota sobre los anuncios Collection

Los anuncios `05_Collection_Ninos`, `06_Collection_Hombre` y `06_Collection_Mujer` **tienen esa nomenclatura pero no son anuncios de catálogo: son carruseles**. Todos usan `Origen del contenido: Subida manual`. El Shopping se hace en campaña aparte.

---

## 5. Hallazgo 2 — "Lo más destacado del sitio web"

### Qué es

Una extensión que **scrapea stardeportes.com** y pega una fila de "destacados" junto al creativo. No sale del catálogo: sale del sitio. Por eso sobrevivió a la limpieza de productos del punto anterior.

Al abrirlo se vio qué traía realmente: **Imágenes + Enlaces contextuales scrapeados, y eran productos**. `05_Posteo_Novedades` tenía 22 imágenes y 16 enlaces contextuales cargados.

### Por qué se apagó

- **Rompe la coherencia creativo → landing.** Cada anuncio tiene su URL pensada (`/mujer1/`, `/nino1/`, etc.). Los destacados mandan el clic a páginas que no se eligieron.
- **No se controla qué aparece.** Con 1.758 SKUs en el feed, el scrape puede levantar productos sin stock o categorías sin relación con el ángulo del anuncio.
- **Ensucia la lectura de datos.** Arrancando sin conversiones y con 40k/día para generar señal, si parte de los clics se va por una superficie no controlada no se sabe si funcionó el ángulo o el destacado.
- **Es la misma clase de problema que el catálogo:** superficie automática, contenido no curado.

El argumento a favor es que Meta estima mejoras de CTR/CPA por estas extensiones, pero son estimaciones genéricas, no de esta cuenta. Se puede testear más adelante como variable deliberada, con baseline.

### ⚠️ Dos controles independientes

Esto es lo más importante de esta sección:

> **Apagar "Mostrar lo más destacado" en Experiencias interactivas NO apaga el origen.**

Son dos switches distintos:

1. **Experiencias interactivas → "Mostrar lo más destacado"** → si se *renderiza*
2. **Orígenes de anuncios → Extensiones → "Lo más destacado del sitio web"** → si Meta *scrapea el sitio*

Varios anuncios tenían el primero en "Desactivada" pero el segundo seguía en "Sí". **Hay que apagar el origen**, que es el control real.

**Ruta del control correcto:**
`Anuncio → Experiencias publicitarias → Orígenes de anuncios → Editar → Extensiones → Lo más destacado del sitio web → expandir (chevron derecho) → desmarcar "Imágenes" y "Enlaces contextuales"`

Al desmarcar ambos, el badge pasa de **Sí** a **No**.

### Anuncios corregidos (11)

`01_VideoUGC_LineaMujer` · `01_VideoUGC_Talles` · `01_VideoUGC_Atencion` · `02_Posteo_PlacardFamilia` · `03_Posteo_TiendaOnline` · `03_Posteo_VestiATuHijo` · `03_Posteo_Cuotas` · `04_Posteo_Cuotas40Marcas` · `04_Posteo_StockTalle` · `05_Posteo_MarcasOficiales` · `05_Posteo_Novedades`

Los otros 6 ya lo tenían desactivado: los 2 carruseles, las 3 collection y `04_Posteo_LineaMujer`. En esos, "Orígenes de anuncios" aparece como **(0/1)** — solo tienen "Enlaces a sitios" y está apagado.

---

## 6. Aprendizajes técnicos de Ads Manager

Para el equipo, cosas que costaron encontrar:

- **El conjunto de productos se declara a nivel ANUNCIO**, en `Contenido del anuncio → Contenido multimedia de productos`. No a nivel conjunto de anuncios ni campaña.
- **`Datos de productos` a nivel campaña queda bloqueado después de crear la campaña.** Solo editable en un duplicado sin publicar, y quitarlo destruye los creativos.
- **La edición masiva de anuncios NO expone "Opciones de visualización del formato".** Solo muestra "Orígenes de anuncios" y "Experiencias interactivas". Hay que ir anuncio por anuncio.
- **Los anuncios con personalización por ubicación** (ej. "14 ubicaciones", "Historias de Instagram") pueden no exponer la sección de opciones de formato.
- **Nunca usar Escape para cerrar un dropdown:** cierra el panel de edición entero y descarta las ediciones sin guardar. Usar "Cerrar" y después "Cerrar" en el prompt de publicación.
- **"Descartar borradores" descarta TODOS los borradores de la cuenta**, no solo el que se está viendo. Cuidado con ese botón.
- **La barra de herramientas se mueve** cuando hay una campaña seleccionada: aparece un botón "Publicar" que empuja a "Duplicar" a la derecha. Verificar antes de clickear.
- **La tabla de anuncios es virtualizada y no scrollea con la rueda del mouse.** Alternativas: navegar por URL con `selected_ad_ids`, o usar el árbol lateral del panel de edición.
- **Ordenar la tabla de anuncios no reordena las filas** (probado con `sort=name~1` y `sort=spend~1`).

---

## 7. Publicación

Se publicó todo junto desde **"Revisar y publicar"**, que agrupa los borradores de las dos campañas:

| | Cantidad | Errores |
|---|---|---|
| Campaña | 1 (`StarDeportes_Ventas_B2C_General`, NUEVO) | 0 |
| Conjuntos de anuncios | 2 (uno por campaña) | 0 |
| Anuncios | 20 (17 Ventas + 3 Shopping) | 0 |

Los 2 conjuntos viejos de Shopping no aparecieron en el publish porque están pausados y no tenían cambios pendientes.

Post-publicación ambas campañas quedaron desactivadas y se encendieron manualmente. Estado actual: **En preparación** (Meta procesando, pasa a Activa en unas horas).

---

## 8. Estado al cierre

| Campaña | Estado | Presupuesto | Histórico |
|---|---|---|---|
| `StarDeportes_Ventas_B2C_General` | Encendida, En preparación | ARS 40.000/día | 0 ARS (nueva) |
| `StarDeportes_Ventas_B2C_Shopping` | Encendida, En preparación | ARS 15.000/día | 67.032 ARS, 36.938 impresiones, CTR 3,60%, 752 visitas a la página |

**Total diario: ARS 55.000.**

---

## 9. Próximos pasos y qué mirar

1. **No tocar nada los primeros 7 días.** La primera semana se va a ver mal: eso es aprendizaje, no fracaso.
2. **Salida de aprendizaje.** Meta necesita ~50 conversiones por conjunto por semana. Con 40.000/día son 280.000/semana, o sea un CPA objetivo de ~5.600 ARS. Con los CPM de la cuenta (~1.700-2.000) eso da ~155.000 impresiones semanales; a ~1% de conversión en sitio se llega justo. **No esperar salir de aprendizaje antes de 10-14 días.**
3. **Comparar ambas campañas** con la audiencia como variable controlada: ese es el punto de haberlas lanzado en paralelo.
4. **RTG recién con mínimo 5 ventas.**
5. **Pendiente, sin resolver:** quedó activo **"Resúmenes del sitio web"** en varios anuncios. Es texto scrapeado del sitio (puntos de venta tipo "6 cuotas sin interés", "envío gratis"), no imágenes de producto. No se tocó porque no estaba en el alcance del pedido, pero es de la misma familia que "Lo más destacado". Decidir si se saca.
6. **Observación menor:** `06_Collection_Mujer` tiene "Navegación de productos" en verde como destino personalizado. El toggle está bloqueado por falta de catálogo en el anuncio (tiene "No mostrar productos"), así que no debería dispararse. Conviene verificarlo en la preview real ahora que está publicado.

---

## 10. Referencia rápida de IDs

```
Cuenta publicitaria       486119648799424
Business                  231240640803963
Pixel (dataset "Star")    3618437238187724

Campaña Ventas            120250342260860390
  └ Conjunto_General_3Anillos           120250342261010390   (17 anuncios)

Campaña Shopping          120250233741410390
  ├ Conjunto_General_3Anillos_Shopping  120250233741450390   (3 anuncios, activo)
  ├ Conjunto_Mujer_25_50                120250233741430390   (pausado)
  └ Conjunto_Padres_Hijos_3_12          120250233741440390   (pausado)
```

**URL para navegar directo a un anuncio:**

```
https://adsmanager.facebook.com/adsmanager/manage/ads/edit/standalone
  ?act=486119648799424
  &business_id=231240640803963
  &global_scope_id=231240640803963
  &selected_ad_ids=<AD_ID>
  &selected_adset_ids=<ADSET_ID>
  &selected_campaign_ids=<CAMPAIGN_ID>
  &treenav=true
  &current_step=0
```
