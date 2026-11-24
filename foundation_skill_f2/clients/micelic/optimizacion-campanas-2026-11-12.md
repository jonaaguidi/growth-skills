# Spec de optimización Meta Ads — Micelic

**Fecha:** 12 de noviembre de 2026
**Cuenta publicitaria:** 779315441294945 ("Julian en Argentina") · **Business:** 126235843751530 · **Pixel:** Lic Julian Ruiz · **Moneda:** ARS
**Estado (12 nov, cierre del día):** presupuestos y anuncios publicados y verificados en tabla. Ventas ON ENCENDIDA el 12 nov a 7.700/día por pedido de Jonathan. Total REE en vivo: 25.650/día. Jonathan le avisa a Julián el 13 nov.

---

## 1. Contexto

El cliente (Julián) tenía corriendo sus propias campañas antes de contratar a REE. Las campañas REE arrancaron el 27 de octubre de 2026. Ambas estructuras conviven sobre el mismo pixel y el cliente se preocupó por el presupuesto duplicado. Apagó `Ventas ON` a nivel campaña alrededor del 8-9 de noviembre.

Auditoría del 12 de noviembre (30 días, 13 oct - 11 nov):

| Campaña | Dueño | Estado | Gasto 30d | Compras | ROAS | CPA | CPM |
|---|---|---|---|---|---|---|---|
| Ventas ON | cliente | apagada (campaña), conjunto activo a 10k/día | 278.845 | 27 | 6,43 | 10.328 | 5.335 |
| MICELIC_Ventas | REE | activa, 2 conjuntos de 9k/día | 279.291 | 22 | 5,99 | 12.695 | 9.054 |
| MICELIC_Awareness | REE | activa, 7.650/día | 183.774 | — | — | 11/visita perfil | 1.063 |
| Clientes potenciales ON | cliente | activa, 10k/día, lead form B2B | 276.326 | 190 leads | — | 1.454/lead | 5.999 |

Conclusión: las dos campañas de venta convivieron 16 días sin canibalizarse y ambas sostuvieron ROAS ~6. Ventas ON (Advantage+ broad Argentina) compra más barato. MICELIC_Ventas (ciudades + intereses) paga CPM 70% más caro y ya tiene frecuencia 3,5 con solo 9.500 personas alcanzadas.

---

## 2. Decisión acordada con Jonathan

- **Presupuesto total:** los "500 USD" asignados equivalen a lo que hoy corren las campañas REE: **25.650 ARS/día** (18.000 MICELIC_Ventas + 7.650 Awareness ≈ 770k/mes). Se asume esa cifra como el 100%.
- **30% a Ventas ON** (reencendida con optimizaciones): **7.700 ARS/día**.
- **70% restante (17.950/día) a MICELIC_Ventas + Awareness.** Se financia el 30% recortando Awareness en mayor proporción, pero sin apagarla.
- `Clientes potenciales ON` no entra en este reparto: objetivo distinto (leads B2B). No se toca.

### Reparto final

| Campaña / conjunto | Antes | Después | Δ |
|---|---|---|---|
| Ventas ON · MICELIC VENTAS | 10.000 (campaña apagada) | **7.700** | −2.300 |
| MICELIC_Ventas · Conjunto_Consciente_Sintoma | 9.000 | **8.500** | −500 |
| MICELIC_Ventas · Conjunto_Consciente_Producto | 9.000 | **6.000** | −3.000 |
| MICELIC_Awareness · Conjunto_General_Argentina | 7.650 | **3.450** | −4.200 |
| **Total** | 25.650 (+10.000 de Ventas ON si estuviera prendida) | **25.650** | 0 |

Síntoma recibe más que Producto porque rinde mejor (ROAS 7,2 vs 4,7 en 30d).

---

## 3. Cambios a ejecutar

### 3.1 Ventas ON (campaña 120253213945110102 · conjunto 120253213945120102)

| # | Cambio | Razón |
|---|---|---|
| 1 | Presupuesto diario del conjunto: 10.000 → **7.700** | 30% del total |
| 2 | Apagar **MUSHBLEND 3** | 0 compras en 30d, CTR 0,93% |
| 3 | Dejar activos: **MUSHBLEND 2** (21 compras, ROAS 6), **AD CARRUSEL** (ROAS 12), **AD MES 2 MELENA DE LEON** (ROAS 18), **AD MES 2 ASHWAGANDHA** (ROAS 6) | Son los que tuvieron tracción |
| 4 | Dejar apagados: AD INSTA 2, MUSHBLEND, AD FLAYER, CATALOGO, AD INSTA 1, CORDYCEPS, AD NUTRICIONISTA | AD INSTA 2 y MUSHBLEND son banco de rotación para cuando MUSHBLEND 2 se fatigue |
| 5 | Revisar por qué AD CARRUSEL y MUSHBLEND 3 figuran "Sin entregar" | Puede ser rechazo o problema de creativo |
| 6 | **NO tocar** segmentación, evento, puja ni atribución | Es la configuración aprendida |
| 7 | **NO encender la campaña** hasta revisión de Jonathan | Pedido explícito |

### 3.2 MICELIC_Awareness

| # | Cambio | Razón |
|---|---|---|
| 8 | Conjunto_General_Argentina: 7.650 → **3.450** | Financia el 30% de Ventas ON sin apagar awareness |

### 3.3 MICELIC_Ventas (campaña 120256565961700102)

**Conjunto_Consciente_Producto**

| # | Cambio | Razón |
|---|---|---|
| 9 | Presupuesto: 9.000 → **6.000** | Conjunto con peor ROAS (4,7) |
| 10 | Apagar **Anuncio_Video_Concentracion_V1** | Se come el 61% del conjunto con CPA 21k y ROAS 3,6. 40 carritos, cierra poco |
| 11 | Apagar **Anuncio_ShoppingAds** (el de Producto) | 0 compras, "poco presupuesto utilizado" |
| 12 | Dejar activos: Video_Dolores_Producto_V1 (ROAS 5,5), Carrusel_v2 (ROAS 16), Carrusel_v1 (ROAS 4,9) | |

**Conjunto_Consciente_Sintoma (120256565961710102)**

| # | Cambio | Razón |
|---|---|---|
| 13 | Presupuesto: 9.000 → **8.500** | Mejor conjunto, recorte mínimo |
| 14 | Apagar **Anuncio_Carrusel_Reishi** | 0 compras, CTR 0,97% |
| 15 | Dejar activos: Video_Dolores_Sintoma_V1 (ROAS 8,7), ShoppingAds (ROAS 10, subiendo), Carrusel_Cordyceps_Melena (ROAS 5) | |

### 3.4 Fuera de alcance hoy

- Tercer conjunto broad Argentina en MICELIC_Ventas (cambio estructural, semana próxima).
- V2 de Video_Dolores_Sintoma_V1 (pedido a producción).
- API de conversiones.

---

## 4. Orden de ejecución

1. Presupuestos (Ventas ON, Awareness, Producto, Síntoma) por edición inline en la vista Conjuntos de anuncios.
2. Toggles de anuncios en la vista Anuncios de cada campaña.
3. Verificar en tabla que los valores quedaron como la sección 2.
4. Reportar a Jonathan. Ventas ON se enciende solo con su OK.

## 5. Seguimiento post-encendido

- Ventas ON: si en 7 días el CPA supera 15k, bajar a 6k/día. Si ROAS ≥5, sostener.
- MICELIC_Ventas: revisar fatiga de Video_Dolores_Sintoma_V1 (cayó a ROAS 3,8 en la última semana).
- Awareness: a 3.450/día el costo por visita a perfil debería mantenerse ~11-13.

---

## 6. Estado final publicado (verificado 12 nov)

| Cambio | Antes | Ahora |
|---|---|---|
| Ventas ON · MICELIC VENTAS (presupuesto) | 10.000/día | 7.700/día (campaña ENCENDIDA 12 nov) |
| MICELIC_Ventas · Conjunto_Consciente_Producto | 9.000/día | 6.000/día |
| MICELIC_Ventas · Conjunto_Consciente_Sintoma | 9.000/día | 8.500/día |
| MICELIC_Awareness · Conjunto_General_Argentina | 7.650/día | 3.450/día |
| Ventas ON · AD CARRUSEL | apagado por el cliente | activo (en revisión, no entrega hasta encender la campaña) |
| Ventas ON · MUSHBLEND 3 | ya estaba apagado | sin cambios |
| MICELIC_Ventas · Anuncio_Video_Concentracion_V1 | activo | apagado |
| MICELIC_Ventas · Anuncio_ShoppingAds (Producto) | activo | apagado |
| MICELIC_Ventas · Anuncio_Carrusel_Reishi | activo | apagado |

Ventas ON encendida el 12 nov. Se rechazó la sugerencia de Meta de subir a 22.253/día. Pendiente: hablar con Julián lunes/martes sobre Clientes potenciales ON (10k/día, fuera del reparto).

## 7. Mensaje para Julián (13 nov)

Juli! Te cuento rapido: ya volvi a encender Ventas ON, que venia rindiendo muy bien, y redistribui el presupuesto entre esa, nuestra campaña de ventas y awareness, asi seguimos dentro de lo asignado sin duplicar nada.

Lo unico que te quiero comentar aparte es la campaña de clientes potenciales, que sigue corriendo con su propio presupuesto. Lo vemos lunes o martes y lo cerramos ahi.
