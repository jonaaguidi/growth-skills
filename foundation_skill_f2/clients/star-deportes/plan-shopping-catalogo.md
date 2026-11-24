# Star Deportes — Plan de ejecución: campaña de catálogo (Meta Ads Shopping)

> Objetivo: levantar una campaña de **ventas de catálogo** con 3 conjuntos de productos (uno por ICP), filtrando lo que no tiene stock, y correrla separada de la B2C.
> Estado base: Foundation Review publicado. Catálogo Meta figura pendiente.

---

## ⚠️ Decisión a tomar antes de construir nada

**El Shopping ya existe como anuncio #8 dentro de los 3 conjuntos B2C.**

Si además lanzás la campaña nueva, tenés el mismo producto compitiéndote contra vos mismo en la misma audiencia. Meta no te lo impide, te lo cobra.

**Recomendación: sacar el anuncio de Shopping de los 3 conjuntos B2C** y que la campaña de catálogo sea la única dueña de ese formato.

Razones:
1. Un anuncio de catálogo y uno estático no se optimizan igual. En el mismo conjunto, Meta vuelca la entrega hacia uno y te deja al otro sin datos.
2. No podés leer el rendimiento del catálogo si está mezclado con 7 piezas estáticas.
3. La campaña de catálogo optimiza a nivel producto, no a nivel anuncio. Es otra mecánica.

Con eso los conjuntos B2C quedan en 7 piezas y la campaña nueva en 3 anuncios, uno por ICP.

---

## Fase 0 — Gate: sin esto no se puede empezar

Todos figuran como pendientes en el Foundation. Verificar cuáles se resolvieron.

| Requisito | Por qué bloquea |
|---|---|
| **Acceso admin a Tienda Nube** | Sin esto no se conecta el catálogo ni se verifica el feed |
| **Catálogo conectado a Meta** (Commerce Manager) | Es el insumo de todo lo demás |
| **Meta Pixel + CAPI en stardeportes.com** | Sin eventos de compra, la campaña no puede optimizar por conversión. Quedaría optimizando por clics, que para catálogo es tirar plata |
| **Acceso a la cuenta de Meta Ads** | Solicitado en el KO Call del 05/10 |

**El Pixel es el más crítico.** Una campaña de catálogo sin señal de compra es una grilla de productos optimizada por tráfico. Si el Pixel no está, esto no sale.

---

## Fase 1 — Auditar el feed antes de armar los conjuntos

Commerce Manager → Catálogo → **Elementos**. Antes de crear ningún conjunto, hay que saber con qué se cuenta.

**Qué contar:**
- Cuántos productos subieron vs. cuántos hay publicados en Tienda Nube
- Cuántos están **rechazados** y por qué (imagen, precio, categoría)
- Cuántos figuran **sin stock**

**Qué campos verificar que lleguen poblados:**

| Campo | Para qué lo necesitamos |
|---|---|
| `availability` | **El filtro de stock.** Es el campo que sostiene todo el plan |
| `brand` | Las reglas por marca de los 3 sets |
| `product_type` / `google_product_category` | Separar calzado de indumentaria |
| `gender`, `age_group` | Separar hombre / mujer / niños |
| `price`, `sale_price` | Mostrar precio real y ofertas |
| `image_link` | Sin imagen el producto no se entrega |
| `item_group_id` | Agrupa los talles de un mismo modelo |

**Este paso define el resto.** Si `brand` o `gender` vienen vacíos, los conjuntos por reglas no se pueden armar y hay que ir a selección manual o a corregir la carga en Tienda Nube.

---

## Fase 2 — Los 3 conjuntos de productos

Commerce Manager → Catálogo → **Conjuntos de productos** → Crear conjunto.

**La regla de stock va en los tres, siempre:**
```
Disponibilidad (availability)  ES  "en stock"
```
Esto es lo que hace que el filtro se mantenga solo. Si los productos se eligen a mano, en una semana estás anunciando lo que ya no tenés.

### SET_Hombre_Calzado
```
availability   = en stock
Y  brand       ∈ [Fila, Topper, Reebok, Montagne]
Y  gender      = male          (o product_type contiene "hombre")
```

### SET_Mujer_Calzado
```
availability   = en stock
Y  brand       ∈ [47 Street, Skechers, Topper, Fila]
Y  gender      = female        (o product_type contiene "mujer")
```

### SET_Ninos_Familia
```
availability   = en stock
Y  brand       ∈ [Atomik, Addnice, Umbro, Topper]
Y  age_group   = kids          (o product_type contiene "niño")
```

### El tope de 12 SKUs: hay que elegir

El brief dice máximo 12 SKUs por set para que la grilla no se diluya. **Un conjunto por reglas no se puede capar en 12** — devuelve todo lo que matchea.

| Opción | Ventaja | Costo |
|---|---|---|
| **A · Por reglas** *(recomendada)* | El stock se filtra solo, para siempre. Cero mantenimiento | El set tiene el tamaño que tenga |
| **B · Selección manual de 12** | Control exacto de la grilla | Alguien tiene que podarlo cada vez que algo se agota. En la práctica, nadie lo hace |
| **C · Reglas + etiqueta** | Curaduría y stock automático | Requiere que Tienda Nube exporte `custom_label`. Verificar si lo hace |

**Recomendación: A.** El problema que estamos resolviendo es justamente no anunciar lo que no hay. Una grilla de 30 productos con stock real vale más que una de 12 curada que muestra tres pares agotados.

Si el feed soporta `custom_label`, C es mejor que las dos. Verificarlo en la Fase 1.

### El problema de los talles

El dolor central del ICP es *"nunca hay stock en mi talle"*. Un producto puede figurar **en stock** porque le queda **un solo talle**.

El anuncio no puede resolverlo: Meta anuncia a nivel modelo (`item_group_id`), no a nivel talle. Lo que sí hay que hacer es que el clic caiga en la ficha del producto con la grilla de talles visible, no en una categoría. Eso al menos le evita al usuario la frustración de descubrirlo en el carrito.

Vale anotarlo como riesgo medido: si el CTR es bueno y la conversión mala, el culpable probable es este.

---

## Fase 3 — La campaña

**Nombre:** `StarDeportes_Shopping_Catalogo`

**Objetivo:** Ventas → ubicación de conversión **Sitio web** → modalidad **ventas del catálogo** (el catálogo se elige a nivel campaña).

**3 conjuntos de anuncios**, uno por ICP, cada uno apuntando a su conjunto de productos:

| Conjunto | Product set | Audiencia |
|---|---|---|
| `Shopping_Hombre_25_50` | SET_Hombre_Calzado | La misma del B2C: hombres 25-50, anillos 1-3 |
| `Shopping_Mujer_25_50` | SET_Mujer_Calzado | La misma del B2C: mujeres 25-50, anillos 1-3 |
| `Shopping_Familia` | SET_Ninos_Familia | La misma del B2C: 25-50 todos los géneros, intereses por edad de los hijos |

**Audiencias:** reutilizar las guardadas de B2C. Al no haber historial de Pixel todavía, esto arranca como **prospecting en frío**, no retargeting. El retargeting (visitantes, AddToCart, carrito abandonado) recién tiene sentido cuando el Pixel tenga 2-3 semanas de datos — queda como Fase 6.

**Optimización:** Compras. Si el volumen de compras es muy bajo las primeras semanas, Meta va a sugerir bajar a AddToCart. Es aceptable como puente, pero hay que volver a Compras apenas haya señal.

**Presupuesto:** a definir. Los conjuntos B2C tienen ~USD 500/mes cada uno sobre un total de USD 1.500. Dos caminos:

- **Incremental:** sumar USD 15/día (≈ USD 450/mes) y dejar B2C intacto.
- **Reasignado:** sacarle USD 15/día al B2C, que pasa de USD 50 a USD 35/día.

Yo arrancaría **reasignado y en USD 5/día por conjunto**. El catálogo suele traer el costo por compra más bajo de todas las campañas porque le habla a gente con intención de producto; si rinde, la decisión de subirlo la toman los números a los 14 días y no una proyección de hoy.

---

## Fase 4 — QA antes de publicar

- [ ] Los 3 conjuntos de productos devuelven **más de 0 productos** (parece obvio; una regla mal armada devuelve vacío y el anuncio no entrega)
- [ ] Ningún producto sin stock aparece en la vista previa de los sets
- [ ] Los precios de la grilla coinciden con stardeportes.com
- [ ] El clic cae en la **ficha de producto**, no en una categoría
- [ ] Las imágenes se ven bien en formato cuadrado (el catálogo recorta)
- [ ] El Pixel dispara `ViewContent`, `AddToCart` y `Purchase` — probado con el Test Events de Meta
- [ ] El anuncio de Shopping fue **removido de los 3 conjuntos B2C**
- [ ] Ubicaciones y audiencias espejadas del B2C

---

## Fase 5 — Qué mirar y cuándo

| Momento | Qué se decide |
|---|---|
| **72 h** | ¿Entrega? Si un conjunto no gastó, el product set está vacío o la audiencia es muy chica |
| **7 días** | ROAS por conjunto. Cuál de los 3 ICPs compra online de verdad |
| **14 días** | Redistribuir presupuesto hacia el ICP ganador. Cruzar con el desglose por anillo geográfico: es el dato que dice si el anillo 3 (Zona Oeste, sin sucursal) compra o solo mira |
| **21 días** | Con Pixel maduro, abrir el conjunto de retargeting |

**KPIs:** ROAS · Costo por compra · AddToCart → Purchase · Productos vendidos por set.

El número que más importa al principio no es el ROAS sino **cuál de los tres ICPs compra online**. Eso todavía no está validado, y define dónde va el presupuesto antes de Black Friday.

---

## Orden de ejecución

```
0 · Destrabar accesos y Pixel          ← bloqueante, no depende de nosotros
1 · Auditar el feed                     ← 30 min, define todo lo demás
2 · Crear los 3 conjuntos de productos  ← 1 h
3 · Sacar Shopping de los conjuntos B2C ← 10 min
4 · Armar la campaña                    ← 1 h
5 · QA                                  ← 30 min
6 · Publicar
```

Las fases 1 a 5 son medio día de trabajo. **El cuello de botella real es la Fase 0**, que depende del cliente.
