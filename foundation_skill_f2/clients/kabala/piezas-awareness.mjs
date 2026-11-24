// Piezas de la campaña de Awareness de Kabala (4 piezas: 2 videos + 2 posteos).
// Destino: perfil de Instagram @kabala.ar. Objetivo: hacer conocida la marca
// de una forma cool por la zona (Palermo / CABA), posicionando a Kabala como
// marca de diseño de autor antes de salir a vender.
// 2 posteos adicionales ya listos (posteos directos desde el perfil, sin pauta).

const IG = "https://www.instagram.com/kabala.ar/";

export const piezasAwareness = [
  // --- AW-1: VIDEO FOUNDER / DISEÑO DE AUTOR ---
  {
    formato: "Video Reel (1080x1920)",
    dolor: "Compra streetwear sin saber quién lo hizo ni dónde se produjo. El diseño que consume está masificado y no tiene autor: la misma prenda la tienen miles de personas.",
    solucion: "Kabala es diseño de autor con nombre y cara: Camila diseña, hace la moldería y produce en talleres argentinos. Estampas de monumentos argentinos en los bolsillos y ediciones de ~50 unidades por artículo.",
    comunicacion: "[0-3s] HOOK — Cami en plano medio dentro del local de Palermo, directo a cámara, percheros detrás: 'Toda la ropa que tenés puesta la diseñó alguien. La pregunta es quién.' [3-8s] BODY — Inserts rápidos del local por afuera, percheros por dentro, close-ups de costuras y detalles de las prendas, tomas de producciones fotográficas: 'Yo soy Cami, diseñadora de indumentaria y productora de moda, y en Kabala hacemos cada prenda, desde cero.' [8-14s] BODY — Close-ups de un bordado, de la estampa del monumento argentino en el bolsillo trasero y de la etiqueta interna: '100% industria argentina, nada importado.' [14-19s] BODY — Cami hablando a cámara, levanta una prenda de Kabala y la muestra: 'Cincuenta unidades por artículo. Cuando se termina, se termina.' [19-24s] CTA — Cami vuelve a cámara con gesto de invitación, badge en edición con Local en Palermo: 'Seguinos en Instagram y mirá lo que se viene.' [24-27s] CIERRE — Motion graphics con el logo de Kabala.",
    hook: "Toda la ropa que tenés puesta la diseñó alguien. La pregunta es quién.",
    body: "Yo soy Cami, diseñadora de indumentaria y productora de moda, y en Kabala hacemos cada prenda, desde cero. 100% industria argentina, nada importado. Cincuenta unidades por artículo: cuando se termina, se termina.",
    cta: "Seguinos en Instagram y mirá lo que se viene.",
    copyAnuncio: "Toda la ropa que tenés puesta la diseñó alguien. La pregunta es quién 👀\n\n✅ Moldería propia y producción en talleres argentinos.\n✅ Estampas de monumentos argentinos en los bolsillos.\n✅ ~50 unidades por artículo: cuando se termina, se termina.\n\n📍 Local en Palermo.",
    pilar: "Marca",
    tema: "Diseño de autor e industria nacional",
    formatoNarrativo: "Direct to Camera — Founder Storytelling",
    estructuraNarrativa: "Hook - Contenido - Accion",
    tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
    duracion: "22-27s",
    enRevision: false,
    destinoUrls: [IG],
  },

  // --- AW-2: VIDEO LOOKBOOK / SUBTÍTULOS RÁPIDOS ---
  {
    formato: "Video Reel (1080x1920)",
    dolor: "No conoce la marca ni sabe que existe un local de diseño de autor en Palermo. La descubre en el feed entre cientos de marcas que se ven iguales y no tiene razón para detenerse.",
    solucion: "Un lookbook puramente visual con tomas de las producciones ya hechas, sin diálogo. Subtítulos rápidos palabra por palabra en el centro de la pantalla con el claim de marca y logo de Kabala fijo en el borde superior durante todo el video.",
    comunicacion: "[0-2s] HOOK — Beat de música arranca, logo de Kabala aparece en el borde superior (fijo durante todo el video). Toma rápida de modelo caminando, subtítulo centrado palabra por palabra: 'HECHA' [2-3s] HOOK — Corte a toma de modelo posando con campera, subtítulo centrado: 'PARA' [3-4s] HOOK — Corte a close-up de prenda, subtítulo centrado: 'DESTACAR' [4-6s] HOOK — Toma de modelo con look completo, subtítulo centrado: 'Y NO' / 'PARA' / 'ENCAJAR' (palabra por palabra rápido) [6-9s] BODY — Montaje rápido de tomas de sesión fotográfica (modelo con pantalón oversize, plano medio con movimiento), logo Kabala fijo arriba [9-12s] BODY — Toma de modelo con buzo, close-up de bordado y textura de tela. Toma de modelo con remera, close-up de la estampa del monumento en el bolsillo trasero [12-15s] BODY — Montaje rápido de close-ups de detalles (etiquetas, costuras, cierres, texturas de algodón) [15-18s] BODY — Subtítulo centrado en grande, tipografía bold: '100% INDUSTRIA ARGENTINA', sobre montaje de tomas del local y percheros [18-21s] CTA — Modelo en plano abierto con look completo, badge Local en Palermo [21-24s] CIERRE — Motion graphics con logo de Kabala",
    hook: "HECHA / PARA / DESTACAR / Y NO / PARA / ENCAJAR (subtítulos rápidos palabra por palabra en el centro de la pantalla).",
    body: "Lookbook visual con tomas de producciones ya hechas. Close-ups de prendas, texturas, bordados, estampas, costuras. 100% Industria Argentina.",
    cta: "Local en Palermo.",
    copyAnuncio: "Hecha para destacar, y no para encajar 🔥\n\n✅ 100% industria argentina, diseño de autor.\n✅ Moldería y estampas propias.\n✅ Oversize real, 100% algodón.\n✅ ~50 unidades por artículo.\n\n📍 Local en Palermo.",
    pilar: "Marca",
    tema: "Lookbook visual con subtítulos rápidos",
    formatoNarrativo: "Montaje — Lookbook con Tipografía",
    estructuraNarrativa: "Hook - Contenido - Accion",
    tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Fashion" },
    duracion: "21-24s",
    referenciaAudiovisual: "Referencia directa: anuncio de Meta Ad Library (Ref 1 de Awareness). Estilo de montaje rápido sin diálogo, con subtítulos palabra por palabra centrados en pantalla y logo fijo en el borde superior.",
    enRevision: false,
    destinoUrls: [IG],
  },

  // --- AW-3: POSTEO MANIFIESTO / CLAIM DE MARCA ---
  {
    formato: "Posteo Cuadrado (1080x1080). Adaptar a Historia (1080x1920)",
    dolor: "Se viste con lo mismo que todos porque las marcas masivas le ofrecen el mismo producto que a millones. No tiene una marca que le hable de identidad en lugar de tendencia.",
    solucion: "El claim de Kabala como manifiesto: Hecha para destacar, y no para encajar. Grilla de close-ups de producto con el claim centrado, estilo Mertra September Drop.",
    comunicacion: "Pieza editorial de manifiesto estilo Ref 4. Grilla de close-ups de productos Kabala (texturas, bordados, estampas, etiquetas, costuras, cierres). Cuadrícula apretada sin separación. Sobre la grilla, centrado, el claim en tipografía de marca a gran tamaño. Tratamiento oscuro, contraste alto.",
    mensajes: [
      "Visual: grilla de close-ups de productos Kabala (texturas, bordados, estampas, etiquetas, costuras, cierres). Fotos apretadas sin separación, cuadrícula completa.",
      "Claim centrado sobre la grilla: 'HECHA PARA DESTACAR, Y NO PARA ENCAJAR.'",
      "Esquina inferior: logo de Kabala.",
      "Referencia directa: Ref 4 (Mertra September Drop).",
    ],
    copyAnuncio: "Hecha para destacar, y no para encajar 🔥\n\n✅ Diseño de autor.\n✅ Industria nacional.\n✅ Ediciones limitadas.\n\n📍 Local en Palermo.",
    pilar: "Marca",
    tema: "Manifiesto de identidad",
    formatoNarrativo: "Editorial — Manifiesto",
    estructuraNarrativa: "Afirmacion - Evidencia",
    tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Fashion" },
    enRevision: false,
    destinoUrls: [IG],
  },

  // --- AW-4: POSTEO DROP VERANO / COMING SOON ---
  {
    formato: "Posteo Cuadrado (1080x1080). Adaptar a Historia (1080x1920)",
    dolor: "No conoce la marca ni sabe que tiene producto nuevo. La descubre por el feed y no tiene motivo para seguirla porque no ve movimiento ni lanzamientos.",
    solucion: "Generar expectativa con un drop de verano: 2 fotos (hombre y mujer) con el logo de Kabala en el centro y textos pequeños debajo anunciando el drop. El local de Palermo como punto de contacto físico.",
    comunicacion: "Pieza de anticipación estilo drop. Dos fotos lado a lado: modelo hombre y modelo mujer con prendas Kabala (mismo estilo que Ref 5, plano completo con 2 ángulos). Logo de Kabala centrado en el medio de la composición. Debajo del logo, textos pequeños: 'DROP VERANO - PROXIMAMENTE / PALERMO'. Tratamiento oscuro, contraste alto.",
    mensajes: [
      "Visual: 2 fotos de modelo (hombre y mujer) con prendas Kabala, plano completo, mismo estilo que Ref 5.",
      "Logo de Kabala centrado en el medio de la composición.",
      "Debajo del logo, textos pequeños: 'DROP VERANO - PROXIMAMENTE / PALERMO'.",
      "Referencia directa: Ref 5 (Mertra Orbit Hood & Joggers).",
    ],
    copyAnuncio: "Drop Verano 🔥 Coming soon.\n\n✅ Oversize unisex, 100% algodón.\n✅ Moldería y estampas propias.\n✅ Ediciones de ~50 unidades.\n\n📍 Palermo.",
    pilar: "Marca",
    tema: "Drop verano / Coming soon",
    formatoNarrativo: "Editorial — Anticipacion de drop",
    estructuraNarrativa: "Afirmacion - Evidencia",
    tratamiento: { tipo: "Imagen", tono: "Cinematic", estilo: "Producto" },
    enRevision: false,
    destinoUrls: [IG],
  },
];
