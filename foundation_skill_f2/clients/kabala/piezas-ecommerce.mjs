// Piezas de la campaña de Ecommerce de Kabala (8 piezas: 3 video + 2 posteo + 2 carrusel + 1 shopping).
// Destino: kabala.com.ar. Se pautan en los 2 conjuntos de audiencia: la diferenciación
// ocurre en el ad set (madurez de compra), no en el creativo.
// 7 piezas a producir (EC-3 opcional) + 1 shopping de catálogo = 8 anuncios a pautar.

const HOME = "https://kabala.com.ar/";

/** @param {(f: string) => string} assetDataUri */
export function buildPiezasEcommerce(assetDataUri) {
  return [
    // --- EC-1: VIDEO UGC GRWM / UNBOXING — MUJER ---
    {
      formato: "Video UGC Vertical (9:16)",
      dolor: "Ve ropa oversize en fotos de catálogo y no sabe cómo queda puesta en alguien real. No tiene referencia de cómo armar un outfit completo con Kabala ni de qué se siente abrir el paquete.",
      solucion: "Una chica joven hace un GRWM o unboxing del drop Kabala en cámara. Muestra el paquete, cada prenda, cómo la combina y cómo cae el oversize en su cuerpo real.",
      comunicacion: "[0-3s] HOOK — Chica joven en su habitación, cámara en mano, abre el paquete de Kabala o muestra las prendas colgadas: 'GRWM con el drop de Kabala' o 'Unboxing Kabala Drop.' [3-8s] BODY — Saca la primera prenda (remera o buzo), close-up de la tela, la etiqueta y la caída oversize: 'Mirá la calidad de esto, cien por ciento algodón.' [8-14s] BODY — Se pone el pantalón, muestra el tiro alto y la caída baggy, gira frente al espejo: 'El oversize es real, no es un talle de hombre agrandado.' [14-19s] BODY — Look completo, se muestra de cuerpo entero, acomoda las prendas: 'Son ediciones de cincuenta unidades, cuando se termina no vuelve.' [19-23s] CTA — A cámara, gesto directo: 'Está todo en kabala punto com punto ar, envío gratis en CABA.' [23-25s] CIERRE — Texto en pantalla con logo de Kabala y kabala.com.ar.",
      hook: "GRWM con el drop de Kabala / Unboxing Kabala Drop.",
      body: "Mirá la calidad de esto, cien por ciento algodón. El oversize es real, no es un talle de hombre agrandado. Son ediciones de cincuenta unidades, cuando se termina no vuelve.",
      cta: "Está todo en kabala.com.ar, envío gratis en CABA.",
      copyAnuncio: "GRWM con el drop de Kabala 🔥\n\n✅ 100% algodón, oversize real desde la moldería.\n✅ ~50 unidades por artículo, edición limitada.\n✅ Diseño de autor, producción argentina.\n\n📦 Envío gratis CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 kabala.com.ar",
      pilar: "Producto",
      tema: "GRWM / Unboxing — Mujer",
      formatoNarrativo: "UGC — Get Ready With Me / Unboxing",
      estructuraNarrativa: "Hook - Contenido - Accion",
      tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
      duracion: "23-25s",
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: assetDataUri("ref-video-ventas-2.mp4"), titulo: "Referencia 1 — Video UGC", tipo: "video" },
        { url: assetDataUri("ref-video-ventas.mp4"), titulo: "Referencia 2 — Video UGC", tipo: "video" },
      ],
    },

    // --- EC-2: VIDEO UGC GRWM / UNBOXING — HOMBRE ---
    {
      formato: "Video UGC Vertical (9:16)",
      dolor: "Ve ropa streetwear online pero no sabe cómo queda en un pibe real, fuera de la foto de catálogo. No tiene referencia de cómo armar un outfit oversize ni de qué viene en el paquete.",
      solucion: "Un pibe joven hace un GRWM o unboxing del drop Kabala en cámara. Muestra el paquete, cada prenda, cómo combina y cómo queda el oversize en su cuerpo.",
      comunicacion: "[0-3s] HOOK — Pibe joven en su habitación o balcón, cámara en mano, abre el paquete de Kabala o muestra las prendas: 'Unboxing Kabala Drop' o 'GRWM con Kabala.' [3-8s] BODY — Saca la remera o buzo, muestra la estampa del monumento en el bolsillo y la caída oversize: 'Mirá este detalle, estampa de un monumento argentino. Cien por ciento algodón.' [8-14s] BODY — Se pone el pantalón, muestra el tiro alto y la pierna ancha, camina para mostrar la caída: 'El oversize de verdad se corta así desde el molde, no es un talle más grande.' [14-19s] BODY — Look completo, se muestra de cuerpo entero con zapatillas: 'Cincuenta unidades nada más, cuando se termina no vuelve.' [19-23s] CTA — A cámara, gesto directo: 'Está todo en kabala punto com punto ar, envío gratis en CABA.' [23-25s] CIERRE — Texto en pantalla con logo de Kabala y kabala.com.ar.",
      hook: "Unboxing Kabala Drop / GRWM con Kabala.",
      body: "Mirá este detalle, estampa de un monumento argentino. Cien por ciento algodón. El oversize de verdad se corta así desde el molde, no es un talle más grande. Cincuenta unidades nada más, cuando se termina no vuelve.",
      cta: "Está todo en kabala.com.ar, envío gratis en CABA.",
      copyAnuncio: "Unboxing Kabala Drop 🔥\n\n✅ Estampas de monumentos argentinos, producción local.\n✅ Oversize real desde la moldería, no un talle más grande.\n✅ ~50 unidades por artículo, edición limitada.\n\n📦 Envío gratis CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 kabala.com.ar",
      pilar: "Producto",
      tema: "GRWM / Unboxing — Hombre",
      formatoNarrativo: "UGC — Get Ready With Me / Unboxing",
      estructuraNarrativa: "Hook - Contenido - Accion",
      tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
      duracion: "23-25s",
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: assetDataUri("ref-video-ventas-3.mp4"), titulo: "Referencia 3 — Video UGC", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-4.mp4"), titulo: "Referencia 4 — Video UGC", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-5.mp4"), titulo: "Referencia 5 — Video UGC", tipo: "video" },
      ],
    },

    // --- EC-3: VIDEO COMERCIAL OPCIONAL (split-screen, estilo Ref 4/5) ---
    {
      formato: "Video Comercial Vertical (9:16)",
      dolor: "Con solo dos videos UGC la variación creativa es limitada. Un tercer video con un enfoque más comercial y producido permite posicionar el drop como catálogo visual y empujar la conversión directa.",
      solucion: "Video corto comercial con pantalla dividida en mitades y tercios (estilo Scuffers Ref 4/5): tomas de distintas prendas del drop que van rotando en cada panel. Sin textos ni subtítulos, solo el logo de Kabala. Puramente visual.",
      comunicacion: "[0-2s] HOOK — Pantalla dividida en 2 mitades verticales (1/2 + 1/2): modelo con buzo en un panel, close-up de la textura en el otro. Logo Kabala fijo en esquina. Beat de música arranca. [2-5s] BODY — Transición a pantalla dividida en 3 tercios verticales (1/3 + 1/3 + 1/3): tres prendas distintas del drop, cada tercio muestra un modelo o close-up diferente. [5-8s] BODY — Vuelve a 2 mitades: modelo con pantalón oversize en un panel, close-up del bordado o estampa del monumento en el otro. Los paneles cambian al ritmo del beat. [8-11s] BODY — 3 tercios: campera en el izquierdo, remera en el centro, detalle de etiqueta en el derecho. Cortes rápidos dentro de cada tercio. [11-14s] BODY — 2 mitades: modelo con look completo en panel grande, close-up de costura o cierre en panel chico. [14-16s] BODY — 3 tercios finales: tres looks completos distintos, uno por tercio, modelos en movimiento. [16-18s] CIERRE — Pantalla completa con logo Kabala centrado.",
      mensajes: [
        "Sin diálogo ni texto en pantalla. Solo logo Kabala fijo en esquina.",
        "Pantalla dividida alternando entre 2 mitades (1/2 + 1/2) y 3 tercios (1/3 + 1/3 + 1/3).",
        "Cada panel muestra una prenda distinta del drop o un close-up de textura, bordado o estampa.",
        "Cortes al ritmo del beat. Cierre con logo Kabala a pantalla completa.",
      ],
      copyAnuncio: "Drop Octubre 🔥\n\n✅ 100% algodón, producción argentina.\n✅ ~50 unidades por artículo, edición limitada.\n✅ Oversize real desde la moldería.\n\n📦 Envío gratis a CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 kabala.com.ar",
      pilar: "Producto",
      tema: "Video comercial split-screen — Drop Octubre",
      formatoNarrativo: "Montaje comercial — Split-screen de producto",
      estructuraNarrativa: "Hook - Catálogo visual - Cierre",
      tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Fashion" },
      duracion: "16-18s",
      enRevision: true,
      destinoUrls: [HOME],
      referencias: [
        { url: assetDataUri("ref-video-ventas-4.mp4"), titulo: "Referencia 4", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-5.mp4"), titulo: "Referencia 5", tipo: "video" },
      ],
    },

    // --- EC-4: POSTEO CUADRADO — HOMBRE ---
    {
      formato: "Posteo Cuadrado (1080x1080)",
      dolor: "No conoce la marca ni sabe que hay un drop con stock limitado. No tiene motivo para entrar al e-commerce.",
      solucion: "Foto profesional del modelo hombre con look del drop, logo de Kabala y mensaje de envío gratis CABA. Estructura limpia tipo editorial, sin ruido visual.",
      comunicacion: "Pieza cuadrada con foto profesional del modelo hombre con look completo del drop. Logo de Kabala en esquina. Mensaje: 'Envío gratis a CABA · 24-48hs' y 'Drop Octubre · Edición limitada'. CTA: kabala.com.ar. Estructura visual como referencias 7/8/9: foto editorial de producto con tipografía mínima.",
      mensajes: [
        "Visual: foto profesional del modelo hombre con look completo del drop. Plano completo o tres cuartos, tratamiento editorial.",
        "Logo Kabala en esquina.",
        "'Envío gratis a CABA · 24-48hs' + 'Drop Octubre · Edición limitada'.",
        "CTA: kabala.com.ar.",
      ],
      copyAnuncio: "Drop Octubre 🔥\n\n✅ Oversize real, 100% algodón, producción argentina.\n✅ ~50 unidades por artículo, edición limitada.\n\n📦 Envío gratis a CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 kabala.com.ar",
      pilar: "Producto",
      tema: "Drop Octubre — Hombre",
      formatoNarrativo: "Editorial — Foto profesional con logo",
      estructuraNarrativa: "Producto - Beneficio - CTA",
      tratamiento: { tipo: "Imagen", tono: "Cinematic", estilo: "Fashion" },
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: assetDataUri("ref-ventas-4.jpg"), titulo: "Referencia 7", tipo: "image" },
        { url: assetDataUri("ref-ventas-5.jpg"), titulo: "Referencia 8", tipo: "image" },
        { url: assetDataUri("ref-ventas-6.jpg"), titulo: "Referencia 6", tipo: "image" },
      ],
    },

    // --- EC-5: POSTEO CUADRADO — MUJER ---
    {
      formato: "Posteo Cuadrado (1080x1080)",
      dolor: "No conoce la marca ni sabe que hay un drop con stock limitado. No tiene motivo para entrar al e-commerce.",
      solucion: "Foto profesional de la modelo mujer con look del drop, logo de Kabala y mensaje de envío gratis CABA. Estructura limpia tipo editorial, sin ruido visual.",
      comunicacion: "Pieza cuadrada con foto profesional de la modelo mujer con look completo del drop. Logo de Kabala en esquina. Mensaje: 'Envío gratis a CABA · 24-48hs' y 'Drop Octubre · Edición limitada'. CTA: kabala.com.ar. Estructura visual como referencias 7/8/9: foto editorial de producto con tipografía mínima.",
      mensajes: [
        "Visual: foto profesional de la modelo mujer con look completo del drop. Plano completo o tres cuartos, tratamiento editorial.",
        "Logo Kabala en esquina.",
        "'Envío gratis a CABA · 24-48hs' + 'Drop Octubre · Edición limitada'.",
        "CTA: kabala.com.ar.",
      ],
      copyAnuncio: "Drop Octubre 🔥\n\n✅ Oversize unisex real, 100% algodón, producción argentina.\n✅ ~50 unidades por artículo, edición limitada.\n\n📦 Envío gratis a CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 kabala.com.ar",
      pilar: "Producto",
      tema: "Drop Octubre — Mujer",
      formatoNarrativo: "Editorial — Foto profesional con logo",
      estructuraNarrativa: "Producto - Beneficio - CTA",
      tratamiento: { tipo: "Imagen", tono: "Cinematic", estilo: "Fashion" },
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: assetDataUri("ref-ventas-4.jpg"), titulo: "Referencia 7", tipo: "image" },
        { url: assetDataUri("ref-ventas-5.jpg"), titulo: "Referencia 8", tipo: "image" },
        { url: assetDataUri("ref-ventas-6.jpg"), titulo: "Referencia 6", tipo: "image" },
      ],
    },

    // --- EC-6: CARRUSEL DROP HOMBRE (4 imágenes) ---
    {
      formato: "Carrusel (1080x1080) — 4 imágenes",
      dolor: "Ve una prenda suelta en el feed y no sabe que hay un drop completo con varias prendas. No tiene motivo para entrar al e-commerce ni urgencia para comprar.",
      solucion: "Carrusel de 4 imágenes del drop masculino: portada con el drop, dos fotos profesionales del modelo con logo Kabala, y cierre con headline de urgencia.",
      comunicacion: "Carrusel de 4 imágenes del drop hombre. Imagen 1: portada con modelo hombre con look completo del drop, tipografía bold 'DROP HOMBRE' + logo Kabala. Imagen 2: foto profesional del modelo con prenda del drop, logo Kabala en esquina. Imagen 3: otra foto profesional del modelo con otra prenda o ángulo diferente, logo Kabala en esquina. Imagen 4: headline en tipografía bold '¿Te lo vas a perder?' + subtítulo 'Edición limitada' + CTA kabala.com.ar + logo Kabala.",
      mensajes: [
        "Imagen 1: Portada — Modelo hombre con look completo del drop. Tipografía bold: 'DROP HOMBRE'. Logo Kabala en esquina.",
        "Imagen 2: Foto profesional del modelo con prenda del drop. Logo Kabala en esquina.",
        "Imagen 3: Otra foto profesional del modelo con otra prenda o ángulo diferente. Logo Kabala en esquina.",
        "Imagen 4: Headline en bold: '¿Te lo vas a perder?' Subtítulo: 'Edición limitada'. CTA: kabala.com.ar. Logo Kabala.",
      ],
      copyAnuncio: "DROP HOMBRE 🔥\n\n✅ Oversize real, 100% algodón.\n✅ ~50 unidades por artículo, edición limitada.\n✅ Moldería y estampas propias.\n\n📦 Envío gratis CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 ¿Te lo vas a perder? kabala.com.ar",
      pilar: "Producto",
      tema: "Drop Hombre — Carrusel",
      formatoNarrativo: "Catálogo — Drop con fotos profesionales",
      estructuraNarrativa: "Portada - Producto - CTA",
      tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Fashion" },
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: [assetDataUri("ref-carrusel-ventas-1.jpg"), assetDataUri("ref-carrusel-ventas-2.jpg"), assetDataUri("ref-carrusel-ventas-3.jpg")].join("||"), titulo: "Referencia 9 — Carrusel de producto", tipo: "carousel" },
      ],
    },

    // --- EC-7: CARRUSEL DROP MUJER (4 imágenes) ---
    {
      formato: "Carrusel (1080x1080) — 4 imágenes",
      dolor: "Ve una prenda suelta en el feed y no sabe que hay un drop completo con varias prendas. No tiene motivo para entrar al e-commerce ni urgencia para comprar.",
      solucion: "Carrusel de 4 imágenes del drop femenino: portada con el drop, dos fotos profesionales de la modelo con logo Kabala, y cierre con headline de urgencia.",
      comunicacion: "Carrusel de 4 imágenes del drop mujer. Imagen 1: portada con modelo mujer con look completo del drop, tipografía bold 'DROP MUJER' + logo Kabala. Imagen 2: foto profesional de la modelo con prenda del drop, logo Kabala en esquina. Imagen 3: otra foto profesional de la modelo con otra prenda o ángulo diferente, logo Kabala en esquina. Imagen 4: headline en tipografía bold '¿Te lo vas a perder?' + subtítulo 'Edición limitada' + CTA kabala.com.ar + logo Kabala.",
      mensajes: [
        "Imagen 1: Portada — Modelo mujer con look completo del drop. Tipografía bold: 'DROP MUJER'. Logo Kabala en esquina.",
        "Imagen 2: Foto profesional de la modelo con prenda del drop. Logo Kabala en esquina.",
        "Imagen 3: Otra foto profesional de la modelo con otra prenda o ángulo diferente. Logo Kabala en esquina.",
        "Imagen 4: Headline en bold: '¿Te lo vas a perder?' Subtítulo: 'Edición limitada'. CTA: kabala.com.ar. Logo Kabala.",
      ],
      copyAnuncio: "DROP MUJER 🔥\n\n✅ Oversize unisex real, 100% algodón.\n✅ ~50 unidades por artículo, edición limitada.\n✅ Moldería y estampas propias.\n\n📦 Envío gratis CABA en 24-48hs.\n💰 Hasta 3 cuotas sin interés.\n\n👉 ¿Te lo vas a perder? kabala.com.ar",
      pilar: "Producto",
      tema: "Drop Mujer — Carrusel",
      formatoNarrativo: "Catálogo — Drop con fotos profesionales",
      estructuraNarrativa: "Portada - Producto - CTA",
      tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Fashion" },
      enRevision: false,
      destinoUrls: [HOME],
      referencias: [
        { url: [assetDataUri("ref-carrusel-ventas-1.jpg"), assetDataUri("ref-carrusel-ventas-2.jpg"), assetDataUri("ref-carrusel-ventas-3.jpg")].join("||"), titulo: "Referencia 9 — Carrusel de producto", tipo: "carousel" },
      ],
    },

    // --- EC-8: META ADS SHOPPING (COLLECTION AD) ---
    {
      formato: "Meta Ads Shopping (Collection Ad)",
      dolor: "Ve una prenda suelta en el feed y no encuentra el resto del catálogo ni los precios.",
      solucion: "Collection Ad con todos los productos del e-commerce, la colección completa o el drop próximo a sacar. El usuario navega la tienda sin salir de Instagram.",
      comunicacion: "Formato nativo de Meta Ads. Se alimenta del catálogo de Tienda Nube sincronizado con Meta. Puede mostrar todos los productos del e-commerce, una colección completa o el drop próximo. No requiere pieza gráfica: requiere el catálogo cargado, el Pixel midiendo ViewContent y Purchase, y el stock por talle actualizado antes de encender.",
      pilar: "Producto",
      tema: "Catálogo shopping",
      formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
      estructuraNarrativa: "Catálogo - CTA directo",
      tratamiento: { tipo: "Formato nativo de Meta", tono: "Mixed", estilo: "Producto" },
      enRevision: false,
      destinoUrls: [HOME],
    },
  ];
}
