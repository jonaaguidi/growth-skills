import { renderOnboardingHtml } from "../../dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { renderBriefHtml } from "../../dist/lib/brief-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// Helper: read image file as base64 data URI
const assetsDir = new URL("./assets/", import.meta.url).pathname;
function assetDataUri(filename) {
  const path = join(assetsDir, filename);
  if (!existsSync(path)) return null;
  const ext = filename.split(".").pop().toLowerCase();
  const mimeMap = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", mp4: "video/mp4", webm: "video/webm" };
  const mime = mimeMap[ext] || "application/octet-stream";
  return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
}

const data = {
  clientInfo: {
    nombreEmpresa: "Star Deportes",
    slug: "star-deportes",
    logoFile: "star-deportes-logo.webp",
    nombreContacto: "el equipo de Star Deportes",
    industria: "Retail de indumentaria deportiva",
    sitioWeb: "stardeportes.com",
    email: null,
    telefono: null,
    fechaCierre: "2026-10-05",
  },
  datosF1: {
    inversionMensual: "USD 1,000/mes (fee REE, USD 1,500 el primer mes)",
    presupuestoPauta: "USD 2,000/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (stardeportes.com)", "WhatsApp Business", "Meta Ads Shopping"],
    palancaPropuesta: "Captación: awareness + funnel B2C ecommerce + crédito personal",
    campanasVendidas: ["B2C Hombre (~10 piezas)", "B2C Mujer (~10 piezas)", "B2C Kids (~10 piezas)", "Brand Awareness (~8 piezas)", "Crédito Personal (~8 piezas)"],
    duracionProyecto: "12 semanas",
    fechaInicio: null,
    fechaFin: null,
    fechaInicioISO: "2026-10-05",
  },

  // A. Onboarding
  equipoAsignado: [
    { nombre: "Jonathan Guidi", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suarez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] Star Deportes - Growth", status: "hecho", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "hecho", notas: null },
      { label: "Crear grupo cliente: Grupo Lente x REE Growth", status: "hecho", notas: null },
      { label: "Agregar a Matías, Leandro y Diego al grupo cliente", status: "hecho", notas: null },
      { label: "Enviar mensaje de bienvenida con agenda de onboarding", status: "hecho", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Verificar que existe portfolio en growth@reecreativos.com", status: "pendiente", notas: null },
        { label: "Crear sub-portfolio o estructura para Star Deportes", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como administradores", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Verificar Facebook Page existente de Star Deportes", status: "pendiente", notas: "Star Deportes tiene Facebook Page activa con Meta Ads corriendo hace años." },
        { label: "Vincular Facebook Page al portfolio de growth@", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como editores", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @stardeportes es cuenta Business", status: "pendiente", notas: "189k seguidores. Canal digital principal del cliente." },
        { label: "Vincular Instagram a la Facebook Page de Star Deportes", status: "pendiente", notas: null },
        { label: "Vincular Instagram al portfolio de growth@", status: "pendiente", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Obtener acceso a la cuenta publicitaria existente de Star Deportes", status: "pendiente", notas: "Tienen cuenta de Meta Ads activa hace años, solo para posicionamiento." },
        { label: "Verificar timezone: America/Buenos_Aires", status: "pendiente", notas: null },
        { label: "Verificar moneda: ARS", status: "pendiente", notas: null },
        { label: "Confirmar tarjeta de crédito/débito del cliente en Meta", status: "pendiente", notas: "La pauta se paga con la tarjeta del cliente directo en Meta." },
        { label: "Asignar Facebook Page e Instagram a la cuenta", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como Anunciantes", status: "pendiente", notas: null },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Instalar Meta Pixel en stardeportes.com (Tienda Nube)", status: "pendiente", notas: "CRITICO: llevan años invirtiendo en Meta Ads sin Pixel. Sin retargeting ni atribución de conversiones." },
        { label: "Configurar eventos: PageView, ViewContent, AddToCart, Purchase", status: "pendiente", notas: "Tienda Nube tiene integración nativa con Meta Pixel." },
        { label: "Verificar con Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Configurar CAPI via integración Tienda Nube o GTM", status: "pendiente", notas: "GTM ya instalado (GTM-5M8VNBMR). Verificar si Tienda Nube soporta CAPI nativo." },
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
        { label: "Testear con Test Events en Events Manager", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Meta Pixel NO instalado (años sin tracking)",
        aplica: true,
        instrucciones: "Star Deportes lleva años invirtiendo en Meta Ads sin Pixel instalado en stardeportes.com. Tienen GA4 (G-EPK43L7K2K) y GTM (GTM-5M8VNBMR) pero sin eventos de conversión para Meta. Esto es el fix #1 antes de cualquier campaña de conversión. Instalar Pixel via GTM o integración nativa de Tienda Nube.",
      },
      {
        condicion: "Campañas existentes mal segmentadas",
        aplica: true,
        instrucciones: "Las campañas de posicionamiento se mezclan con las locales, generando consultas de zonas fuera de cobertura (ej. La Rioja preguntando por crédito personal). Auditar la estructura de campañas existentes y separar audiencias antes de lanzar las nuevas campañas.",
      },
      {
        condicion: "Crédito personal solo presencial",
        aplica: true,
        instrucciones: "El crédito personal (cupos $450k-600k ARS) solo funciona en sucursales físicas por riesgo de mora. Las campañas de crédito personal deben estar geolocalizadas a un radio de 20km de cada sucursal. No ofrecer crédito vía e-commerce.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Paleta de colores oficial", status: "pendiente", notas: null },
        { label: "Fotos de productos en alta calidad por categoría", status: "pendiente", notas: "Equipo de branding de 5 personas + 2 diseñadores. Tienen producción mensual activa." },
        { label: "Videos existentes de redes sociales para reutilizar", status: "pendiente", notas: "Contenido de @stardeportes (189k seguidores) para campaña de Awareness." },
        { label: "Guía de marca / manual de identidad (si existe)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a Tienda Nube (stardeportes.com)", status: "pendiente", notas: "Necesario para instalar Pixel, configurar Shopping y revisar datos de ventas." },
        { label: "Google Analytics (GA4 G-EPK43L7K2K) — verificar acceso", status: "pendiente", notas: "GA4 ya instalado. Necesitamos acceso para configurar funnel de conversión." },
        { label: "Acceso a Meta Ads (cuenta publicitaria existente)", status: "pendiente", notas: "Solicitado en KO Call del 05/10." },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de WhatsApp Business del cliente", status: "pendiente", notas: "Usan Callbell como CRM centralizador (WhatsApp, IG, TikTok, FB)." },
        { label: "Verificar que sea cuenta Business (no Personal)", status: "pendiente", notas: null },
        { label: "Definir número destino para campañas de crédito personal", status: "pendiente", notas: "Puede ser un número por sucursal o uno central con derivación." },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién atiende los leads entrantes de e-commerce", status: "pendiente", notas: "Actualmente agentes humanos con turnos en Callbell." },
        { label: "Definir quién atiende consultas de crédito personal", status: "pendiente", notas: "Requiere atención en sucursal. Definir flujo de derivación." },
        { label: "Definir tiempo máximo de respuesta", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "Tienda Nube",
      descripcion: "E-commerce de Star Deportes (stardeportes.com). Está integrado con DragonFish, el sistema de gestión que maneja stock, pedidos y devoluciones de las 13 sucursales, pero REE Metrics se conecta a Tienda Nube y a Meta Ads, no a DragonFish.",
      items: [
        { label: "Verificar integración DragonFish ↔ Tienda Nube", status: "pendiente", notas: "Ya está conectado: stock, pedidos, devoluciones." },
        { label: "Verificar si DragonFish tiene API para consultas de stock", status: "pendiente", notas: "Para futura automatización de consultas en Callbell." },
      ],
    },
    tracking: {
      titulo: "Tracking",
      items: [
        { label: "GA4 configurado con funnel de conversión (view_item, add_to_cart, begin_checkout, purchase)", status: "pendiente", notas: "GA4 instalado pero sin eventos de e-commerce configurados." },
        { label: "Meta Pixel instalado en stardeportes.com", status: "pendiente", notas: "CRITICO. Sin Pixel no hay retargeting ni atribución." },
        { label: "CAPI configurada y deduplicada", status: "pendiente", notas: null },
        { label: "Meta Ads Shopping (catálogo dinámico) configurado", status: "pendiente", notas: "Conectar catálogo de Tienda Nube a Meta." },
        { label: "REE Metrics conectado (Meta Ads + Tienda Nube)", status: "pendiente", notas: null },
      ],
    },
  },

  koCall: {
    fechaPropuesta: "05/10/2026",
    duracionTotal: "30 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Intro: alineamiento Q4 y próximos pasos", output: "Equipo alineado" },
      { nombre: "Estrategia", duracion: "15 min", objetivo: "Revisión de las 3 campañas (Awareness, B2C, Crédito Personal), timeline y entregables", output: "Estrategia validada" },
      { nombre: "Accesos", duracion: "5 min", objetivo: "Solicitar accesos a Meta Ads y Tienda Nube", output: "Accesos en proceso" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Próximos pasos + timeline de briefs creativos", output: "Agenda definida" },
    ],
    flujoTemas: [
      "Alineamiento de campañas Q4: Awareness, B2C (Hombre/Mujer/Kids), Crédito Personal",
      "Timeline: Awareness en 1-2 semanas, B2C y Crédito en 2-3 semanas",
      "Accesos: Meta Ads + Tienda Nube para configurar tracking",
      "Bajada creativa: Jonathan envía briefs, equipo Star Deportes produce las piezas",
      "Estacionalidad: Día de la Madre, Cyber Monday, Black Friday, Navidad",
      "Márgenes y productos estrella para orientar campañas B2C",
    ],
    temasWow: [
      "Mostrar ejemplo de REE Metrics con atribución de ventas por anuncio",
      "Explicar cómo el tracking de conversiones mide el ROI de cada peso invertido",
      "Compartir benchmark de competidores: Mateu (45 ads), Open Sports (99 ads), Solo Deportes (73 ads)",
    ],
    checklist: {
      titulo: "Preparación KO Call",
      items: [
        { label: "KO Call realizada el 05/10/2026", status: "hecho", notas: null },
        { label: "Accesos a Meta Ads y Tienda Nube solicitados", status: "pendiente", notas: "Solicitado en la call, pendiente de recibir." },
        { label: "Análisis de ventas de Tienda Nube (últimos 90 días)", status: "pendiente", notas: "Jonathan analiza datos al recibir accesos." },
        { label: "Preparar briefs creativos para equipo de branding", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: {
      nombre: "Foundation Review",
      fechaTentativa: "19/10/2026",
      objetivos: [
        "Presentar estrategia completa: ICPs, campañas, piezas creativas",
        "Revisar datos de Tienda Nube y productos estrella",
        "Validar briefs creativos con el equipo de branding",
        "Confirmar presupuesto de pauta por campaña",
      ],
    },
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "Star Deportes tiene 189k seguidores en Instagram y 13 años de presencia física, pero cero campañas de conversión y un e-commerce que representa el 0.01% de las ventas. Los competidores operan con masividad de testeo (217 anuncios activos combinados entre Mateu, Open Sports y Solo Deportes). La prioridad es activar el canal B2C (e-commerce) y medir el ROI de la inversión por primera vez, explotando el diferencial del crédito personal que ningún competidor ofrece. Captación es la palanca correcta: primero instalar la infraestructura de medición, después convertir.",
  },

  icp: [
    {
      segmento: "Familia de zona periférica",
      descripcion: "Persona de 28-50 años en pueblos y ciudades periféricas de La Plata y provincia de Buenos Aires (Coronel Brandsen, Magdalena, San Vicente, Saladillo, Los Hornos, Berisso, Ensenada). Compra indumentaria deportiva para toda la familia (hijos, pareja, propia). Conoce Star Deportes por cercanía física. Valora el crédito personal como método de pago principal. Tickets altos ($70k-130k por item) que necesita financiar.",
      frase: "Necesito equipar a mis hijos para el colegio y no llego a pagar todo de contado",
      dolores: [
        "El ticket de calzado e indumentaria deportiva es alto y no siempre tiene tarjeta de crédito",
        "Las cadenas grandes no llegan a su ciudad y no ofrecen financiación directa",
        "Necesita renovar calzado y ropa deportiva de toda la familia en una sola compra",
        "No sabe que Star Deportes tiene e-commerce con envío a domicilio",
      ],
      deseos: [
        "Comprar indumentaria deportiva de calidad cerca de su casa",
        "Acceder a crédito personal sin requisitos bancarios (sin tarjeta, sin banco)",
        "Encontrar variedad de productos deportivos para toda la familia en un solo lugar",
        "Financiar compras grandes en cuotas cómodas",
      ],
      objeciones: [
        "Los precios son similares a otras cadenas, no veo ventaja en precio",
        "No sé si hacen envíos a mi zona desde la web",
        "Prefiero probarme el calzado en persona antes de comprar",
        "No conozco la tienda online, siempre compro en la sucursal",
      ],
      prioridad: "primario",
      recurrencia: "alta",
    },
    {
      segmento: "Comprador online (provincia de BA)",
      descripcion: "Persona de 25-45 años en provincia de Buenos Aires (Zona Oeste, Zona Sur, interior) que descubre Star Deportes por pauta digital. No tiene sucursal cerca. Busca marcas deportivas alternativas (Fila, New Balance, Skechers, Crocs, Salomon) que no encuentra fácilmente en su zona. Compra con tarjeta en cuotas sin interés vía e-commerce.",
      frase: "Quiero zapatillas de buena marca sin tener que ir hasta La Plata",
      dolores: [
        "No encuentra variedad de marcas deportivas alternativas en su zona",
        "Las cadenas grandes priorizan Nike/Adidas/Puma, no tiene opciones de Fila, Skechers, Crocs, etc.",
        "No conoce Star Deportes porque no hay sucursal en su ciudad",
        "Los costos de envío pueden ser altos para compras de calzado",
      ],
      deseos: [
        "Comprar online con cuotas sin interés y envío gratis",
        "Descubrir marcas deportivas que no encuentra en tiendas de su zona",
        "Recibir el producto en su casa sin tener que viajar",
        "Tener la misma variedad y precios que en la tienda física",
      ],
      objeciones: [
        "No conozco la marca Star Deportes, no sé si es confiable",
        "No puedo acceder al crédito personal desde el e-commerce",
        "Prefiero comprar en MercadoLibre donde ya tengo cuenta",
        "¿Y si el talle no me queda? ¿Puedo devolver?",
      ],
      prioridad: "primario",
      recurrencia: "media",
    },
  ],

  propuestaDeValor: {
    descripcion: "Cadena de indumentaria deportiva con 13 años en provincia de Buenos Aires. 13 sucursales en ciudades periféricas donde las grandes cadenas no llegan. 40+ marcas alternativas (Fila, New Balance, Skechers, Crocs, Salomon, Topper, Head, Reebok). Crédito personal directo en sucursal (cupos hasta $600k ARS, mora <10%). E-commerce con envío a todo el país. 2, 3 y 6 cuotas sin interés.",
    diferenciador: "Único competidor con crédito personal directo (sin tarjeta, sin banco). Dominio de la periferia: cuasi-monopolio en varias localidades donde Mateu, Open Sports y Solo Deportes no tienen presencia. 40+ marcas que las cadenas grandes no priorizan.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Consulta de crédito personal en WhatsApp o consulta de compra directa en e-commerce. Intent de compra claro o interés en financiación.",
      accion: "Contacto en menos de 2 horas. Derivar a sucursal más cercana (crédito) o responder con link al producto (e-commerce).",
    },
    {
      categoria: "B",
      descripcion: "Pregunta sobre stock, talles, envíos o precios. Interés sin intent de compra inmediato.",
      accion: "Contacto en menos de 24 horas vía Callbell. Responder con info y link a stardeportes.com.",
    },
    {
      categoria: "C",
      descripcion: "Interacción en redes (like, comentario, share) sin mensaje directo. Awareness sin intent.",
      accion: "No requiere contacto directo. Se nutren con contenido orgánico y retargeting.",
    },
  ],

  kpis: [
    { nombre: "CPA (venta Tienda Nube)", objetivo: "Por definir (sin datos históricos)", fuente: "Tienda Nube + Pixel" },
    { nombre: "ROAS", objetivo: "> 1.5x (breakeven + margen)", fuente: "Meta Ads + REE Metrics" },
    { nombre: "Ticket promedio e-commerce", objetivo: "$85,000+ ARS", fuente: "Tienda Nube" },
    { nombre: "Tasa de conversión e-commerce", objetivo: "2%+ (benchmark retail)", fuente: "Tienda Nube Analytics" },
    { nombre: "CPL crédito personal", objetivo: "Por definir", fuente: "Meta Ads (mensajes WhatsApp)" },
    { nombre: "Alcance mensual", objetivo: null, fuente: "Meta Ads" },
    { nombre: "Ventas e-commerce mensuales", objetivo: null, fuente: "Tienda Nube + REE Metrics" },
  ],

  presupuesto: {
    pauta: "USD 2,000/mes — ARS $3.080.000/mes (tarjeta del cliente en Meta): USD 200 Awareness (ARS $308.000) + USD 1,500 B2C Ventas (ARS $2.310.000: USD 500 Hombre + USD 500 Mujer + USD 500 Kids) + USD 300 Crédito Personal (ARS $462.000). Valores en pesos al dólar oficial BNA venta de $1.540 (19/10/2026), sin percepciones impositivas de la tarjeta.",
    fee: "USD 1,000/mes — ARS $1.540.000/mes (fee REE Growth; USD 1,500 — ARS $2.310.000 el primer mes)",
    total: "USD 3,000/mes — ARS $4.620.000/mes (USD 3,500 — ARS $5.390.000 el primer mes)",
    cplTarget: null,
    limiteGastoCuenta: "USD 2,200/mes — ARS $3.388.000/mes",
    tipoCambioNota: "Pesos al dólar oficial BNA venta de $1.540 (19/10/2026). No incluye percepciones impositivas de la tarjeta.",
  },

  creativos: {
    angulos: [
      {
        nombre: "La tienda deportiva de tu ciudad",
        dolorQueResuelve: "No tiene acceso a tiendas deportivas con variedad de marcas en su localidad. Para comprar tiene que viajar a La Plata o comprar online sin poder probarse.",
        mensajeClave: "Star Deportes está en tu ciudad. 40+ marcas deportivas, todos los talles, y la atención de siempre.",
        formato: "Video UGC + Posteo geolocalizados por sucursal",
      },
      {
        nombre: "Crédito personal: comprá hoy, pagá cómodo",
        dolorQueResuelve: "El ticket de calzado es alto ($70k-130k). No tiene tarjeta de crédito o el límite no le alcanza. Posterga compras que necesita.",
        mensajeClave: "Comprás lo que necesitás y lo pagás en cuotas con crédito personal. Sin tarjeta, sin banco, directo en el local.",
        formato: "Video UGC + Posteo con CTA a WhatsApp",
      },
      {
        nombre: "40+ marcas que no encontrás en cualquier lado",
        dolorQueResuelve: "Las cadenas grandes priorizan Nike/Adidas/Puma. Quien busca marcas alternativas no las encuentra fuera de centros urbanos.",
        mensajeClave: "Fila, New Balance, Skechers, Crocs, Salomon y 40 marcas más. Todo en un solo lugar.",
        formato: "Carrusel de productos + Meta Ads Shopping",
      },
      {
        nombre: "Tu tienda deportiva, ahora también online",
        dolorQueResuelve: "No sabe que Star Deportes tiene e-commerce. Quiere ver catálogo y precios antes de ir al local o comprar desde su casa.",
        mensajeClave: "Toda la variedad de Star Deportes en tu celular. Envío a todo el país. 2, 3 y 6 cuotas sin interés.",
        formato: "Video UGC + Carrusel + Shopping Collection Ad",
      },
      {
        nombre: "Equipá a toda la familia",
        dolorQueResuelve: "Padres que necesitan renovar calzado y ropa de toda la familia (inicio de clases, cambio de temporada). El ticket total es muy alto.",
        mensajeClave: "Todo para él, para ella y para los chicos. En cuotas sin interés o con crédito personal.",
        formato: "Video UGC + Carrusel por categoría (Hombre/Mujer/Kids)",
      },
    ],
    piezasPorIcp: [
      {
        icp: "Familia de zona periférica",
        piezas: [
          // --- VIDEO 1: Dolor zapatillas rotas → crédito personal ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Necesita renovar las zapatillas de sus hijos pero el ticket es alto y no llega a pagar todo de contado",
            solucion: "En Star Deportes tiene crédito personal: se lleva todo hoy y paga en cuotas sin tarjeta, sin banco. Cupos hasta $600.000.",
            comunicacion: "[0-3s] HOOK — Plano cerrado de zapatillas gastadas/rotas de nene en el piso. Mano las agarra y las muestra a cámara: '¿Las zapatillas de tus hijos ya están así?' [3-7s] BODY — Corte a interior de sucursal Star Deportes. Madre con dos hijos eligiendo zapatillas, probándose talles. Planos cortos de estantes con variedad de marcas: 'En Star Deportes tenés más de 40 marcas para toda la familia.' [7-14s] BODY — La madre paga en mostrador. Insert de texto en pantalla: CRÉDITO PERSONAL / SIN TARJETA / SIN BANCO. Empleado entrega bolsa: 'Y con crédito personal te llevás todo hoy y pagás en cuotas. Sin tarjeta, sin banco.' [14-18s] CTA — Familia saliendo del local con bolsas. Badge en edición con dirección de sucursal: 'Vení a Star Deportes [ciudad]. Te esperamos.' [18-22s] CIERRE — Logo Star Deportes + dirección de sucursal + ícono WhatsApp.",
            hook: "¿Las zapatillas de tus hijos ya están así?",
            body: "En Star Deportes tenés más de 40 marcas para toda la familia. Y con crédito personal te llevás todo hoy y pagás en cuotas. Sin tarjeta, sin banco.",
            cta: "Vení a Star Deportes. Te esperamos.",
            copyAnuncio: "¿Las zapatillas de tus hijos ya dieron todo? 👟\n\n🏪 En Star Deportes tenés 40+ marcas para toda la familia.\n💳 Crédito personal: llevate todo hoy y pagá en cuotas. Sin tarjeta, sin banco.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Escribinos por WhatsApp",
            pilar: "Producto",
            tema: "Crédito personal + renovación familiar",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
          },
          // --- VIDEO 2: Dolor falta de opciones en su zona → variedad Star Deportes ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "No tiene una tienda deportiva con variedad de marcas cerca de su casa. Para comprar tiene que viajar a La Plata o conformarse con lo que hay.",
            solucion: "Star Deportes está en su ciudad con 40+ marcas deportivas, todos los talles y atención personalizada.",
            comunicacion: "[0-3s] HOOK — Persona caminando por calle de pueblo, mira su celular buscando 'zapatillas deportivas'. Gesto de frustración: '¿Cansado de no encontrar lo que buscás en tu zona?' [3-8s] BODY — Corte a interior de sucursal Star Deportes. Travelling lento por góndolas mostrando variedad: Fila, Skechers, New Balance, Crocs, Topper. Close-ups de modelos: 'En Star Deportes tenés Fila, Skechers, New Balance, Crocs, Salomon y 40 marcas más.' [8-14s] BODY — Empleado atendiendo, persona probándose zapatillas, sonriendo. Ambiente de confianza: 'Todos los talles, atención personalizada, y a metros de tu casa.' [14-18s] CTA — Fachada de sucursal con logo visible. Badge con dirección: 'Star Deportes [ciudad]. La tienda deportiva de tu zona.' [18-22s] CIERRE — Logo Star Deportes + mapa con las 13 sucursales marcadas.",
            hook: "¿Cansado de no encontrar lo que buscás en tu zona?",
            body: "En Star Deportes tenés Fila, Skechers, New Balance, Crocs, Salomon y 40 marcas más. Todos los talles, atención personalizada, y a metros de tu casa.",
            cta: "Star Deportes. La tienda deportiva de tu zona.",
            copyAnuncio: "¿Cansado de no encontrar variedad en tu zona? 😤\n\n👟 Fila, Skechers, New Balance, Crocs, Salomon y 40 marcas más.\n✅ Todos los talles. Atención personalizada.\n💳 Crédito personal y cuotas sin interés.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Encontrá tu sucursal más cercana",
            pilar: "Marca",
            tema: "Cercanía + variedad local",
            formatoNarrativo: "Direct to Camera — Storytelling",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
          },
          // --- POSTEO: Crédito personal hero ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "No llega a pagar de contado un par de zapatillas o la ropa deportiva que necesita. Posterga la compra porque el ticket es alto.",
            solucion: "Crédito personal Star Deportes: llevate todo hoy y pagá en cuotas. Sin tarjeta, sin banco. Cupos hasta $600.000 ARS.",
            comunicacion: "Flyer con claim grande: 'COMPRÁ HOY, PAGÁ CÓMODO'. Imagen de productos (zapatillas + indumentaria) con precio visible. Badge: 'Crédito Personal — Sin tarjeta, sin banco'. CTA a WhatsApp. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: zapatillas + ropa deportiva sobre fondo limpio. Claim grande: 'COMPRÁ HOY, PAGÁ CÓMODO'",
              "Badge destacado: 'Crédito Personal — Sin tarjeta, sin banco — Cupos hasta $600.000'",
              "CTA: 'Consultá en tu sucursal más cercana' + ícono WhatsApp",
            ],
            copyAnuncio: "COMPRÁ HOY, PAGÁ CÓMODO 💪\n\n💳 Crédito Personal Star Deportes\n✅ Sin tarjeta. Sin banco. Directo en el local.\n🏷️ Cupos hasta $600.000.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Consultá por WhatsApp",
            pilar: "Producto",
            tema: "Crédito personal como diferencial",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
          },
          // --- CARRUSEL: Equipá a toda la familia ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "Necesita comprar calzado y ropa para toda la familia (hijos, pareja) y el gasto total se vuelve inmanejable.",
            solucion: "En Star Deportes encontrás todo para hombre, mujer y kids. 40+ marcas, cuotas sin interés y crédito personal.",
            comunicacion: "Carrusel x4 slides mostrando productos por categoría. Cada slide con productos representativos y precios. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 'EQUIPÁ A TODA LA FAMILIA' — Visual de familia con bolsas Star Deportes. Badge: 'Cuotas sin interés + Crédito Personal'",
              "Slide 2: HOMBRE — 3-4 modelos de zapatillas masculinas (Fila, Topper, New Balance) con precio visible",
              "Slide 3: MUJER — 3-4 modelos femeninos (47 Street, Skechers, Crocs) con precio visible",
              "Slide 4: KIDS — 3-4 modelos infantiles (Addnice, Topper, Fila) con precio visible. CTA: 'Comprá en stardeportes.com o visitá tu sucursal'",
            ],
            copyAnuncio: "Equipá a toda la familia en un solo lugar 🏠\n\n👟 Hombre: Fila, New Balance, Topper\n👠 Mujer: 47 Street, Skechers, Crocs\n🧒 Kids: Addnice, Topper, Fila\n\n💳 Cuotas sin interés + Crédito Personal.\n📦 Envío a todo el país o retirá en sucursal.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Compra familiar completa",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
        ],
      },
      {
        icp: "Comprador online (provincia de BA)",
        piezas: [
          // --- VIDEO 1: Tu tienda deportiva, ahora online ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "No conoce Star Deportes porque no hay sucursal en su zona. Busca marcas alternativas online pero no sabe dónde comprar con confianza.",
            solucion: "Star Deportes tiene e-commerce con envío a todo el país. 40+ marcas, 2/3/6 cuotas sin interés. Envío gratis desde $150k.",
            comunicacion: "[0-3s] HOOK — Pantalla de celular scrolleando tiendas online, todo caro o sin stock. Texto overlay: '¿No encontrás lo que buscás online?' [3-8s] BODY — Transición a pantalla de stardeportes.com navegando el catálogo. Products reales pasando: zapatillas Fila, Skechers, New Balance con precios visibles: 'En stardeportes.com tenés 40+ marcas deportivas con todos los talles.' [8-14s] BODY — Persona recibiendo paquete en su casa, abriendo caja, sacando zapatillas. Sonrisa de satisfacción: 'Envío a todo el país. Envío gratis desde $150.000. Y pagás en 2, 3 o 6 cuotas sin interés.' [14-18s] CTA — Persona con zapatillas puestas. Badge en edición: stardeportes.com: 'Entrá a stardeportes.com y elegí las tuyas.' [18-22s] CIERRE — Logo Star Deportes + stardeportes.com + badges de cuotas.",
            hook: "¿No encontrás lo que buscás online?",
            body: "En stardeportes.com tenés 40+ marcas deportivas con todos los talles. Envío a todo el país, gratis desde $150.000. Y pagás en 2, 3 o 6 cuotas sin interés.",
            cta: "Entrá a stardeportes.com y elegí las tuyas.",
            copyAnuncio: "¿No encontrás lo que buscás? 🤔\n\n👟 40+ marcas deportivas en stardeportes.com\n📦 Envío a todo el país. Gratis desde $150.000.\n💳 2, 3 y 6 cuotas sin interés.\n\n🏪 13 años de trayectoria. 13 sucursales en provincia de BA.\n\n👉 Comprá en stardeportes.com",
            pilar: "Marca",
            tema: "E-commerce awareness",
            formatoNarrativo: "Direct to Camera — Product Demo",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- VIDEO 2: Dolor marcas alternativas no disponibles ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Las cadenas de su zona solo tienen Nike, Adidas y Puma. Busca marcas alternativas (Fila, New Balance, Skechers, Crocs) pero no las encuentra.",
            solucion: "Star Deportes tiene más de 40 marcas que las cadenas grandes no priorizan. Todo online con envío y cuotas sin interés.",
            comunicacion: "[0-3s] HOOK — Persona en tienda de shopping mirando estantes: solo Nike, Adidas, Puma. Gesto de 'siempre lo mismo': '¿Siempre las mismas marcas?' [3-8s] BODY — Corte a catálogo visual de Star Deportes. Grid de logos: Fila, New Balance, Skechers, Crocs, Salomon, Topper, Head, Reebok, Converse. Transición rápida entre productos: 'Fila, New Balance, Skechers, Crocs, Salomon... y más de 40 marcas que no encontrás en cualquier lado.' [8-14s] BODY — Close-ups de productos con precios: zapatilla Fila $89k, Skechers $95k, Crocs $45k. Badge: '6 cuotas sin interés': 'Con precios accesibles y hasta 6 cuotas sin interés.' [14-18s] CTA — Pantalla de stardeportes.com con carrito: 'Entrá a stardeportes.com. Envío gratis desde $150.000.' [18-22s] CIERRE — Logo Star Deportes + stardeportes.com.",
            hook: "¿Siempre las mismas marcas?",
            body: "Fila, New Balance, Skechers, Crocs, Salomon y más de 40 marcas que no encontrás en cualquier lado. Con precios accesibles y hasta 6 cuotas sin interés.",
            cta: "Entrá a stardeportes.com. Envío gratis desde $150.000.",
            copyAnuncio: "¿Cansado de las mismas 3 marcas? 🙄\n\n👟 Fila · New Balance · Skechers · Crocs · Salomon · Topper · Head · Reebok y 40+ marcas más.\n💳 Hasta 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n👉 Descubrí todo en stardeportes.com",
            pilar: "Producto",
            tema: "Variedad de marcas alternativas",
            formatoNarrativo: "Educativo / Demostrativo — Comparativo",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- POSTEO: Envío gratis + cuotas ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "No sabe que puede comprar online en Star Deportes con envío gratis y cuotas sin interés. Asocia la marca solo a tienda física.",
            solucion: "stardeportes.com: e-commerce con envío a todo el país, gratis desde $150k, y 2/3/6 cuotas sin interés.",
            comunicacion: "Flyer de conversión con productos hero (zapatillas bestseller), precios visibles, badges de envío y cuotas. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: 3-4 zapatillas bestseller con precio visible. Composición limpia sobre fondo blanco/gris.",
              "Badges: 'Envío a todo el país' + 'Gratis desde $150.000' + '6 cuotas sin interés'",
              "CTA: 'Comprá en stardeportes.com'",
            ],
            copyAnuncio: "Tu próximo par te espera online 👟\n\n📦 Envío a todo el país. Gratis desde $150.000.\n💳 2, 3 y 6 cuotas sin interés.\n🏪 13 años de trayectoria. +40 marcas.\n\n👉 Comprá en stardeportes.com",
            pilar: "Marca",
            tema: "E-commerce + envío + cuotas",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL: Catálogo por categoría ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "No conoce el catálogo de Star Deportes ni sabe qué marcas y precios manejan. Sin referencia, no se anima a comprar online.",
            solucion: "Catálogo visual por categoría: hombre, mujer, kids. Productos reales con precios y link directo a stardeportes.com.",
            comunicacion: "Carrusel x5 slides con productos reales del catálogo, organizados por categoría. Cada slide con marca, modelo y precio. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 'DESCUBRÍ TODO EL CATÁLOGO' — Logo Star Deportes. Badge: '40+ marcas · Envío gratis desde $150k'",
              "Slide 2: Calzado Hombre — Zapatillas Fila running + New Balance casual + Topper urbana. Precio de cada uno.",
              "Slide 3: Calzado Mujer — Skechers Go Walk + 47 Street urbana + Crocs. Precio de cada uno.",
              "Slide 4: Kids — Addnice escolar + Topper botín + Fila running. Precio de cada uno.",
              "Slide 5: CTA 'Comprá en stardeportes.com — Envío a todo el país — Cuotas sin interés'",
            ],
            copyAnuncio: "Descubrí todo el catálogo de Star Deportes 🛍️\n\n👟 Hombre: Fila · New Balance · Topper\n👠 Mujer: Skechers · 47 Street · Crocs\n🧒 Kids: Addnice · Topper · Fila\n\n📦 Envío a todo el país. Gratis desde $150.000.\n💳 Cuotas sin interés.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Catálogo online por categoría",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- META ADS SHOPPING — COLLECTION AD ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "No conoce Star Deportes ni sabe que puede comprar indumentaria deportiva online con envío a todo el país",
            solucion: "Anuncio de catálogo dinámico con productos de Star Deportes: calzado, indumentaria y accesorios de 40+ marcas. El usuario navega el catálogo completo y compra directo.",
            comunicacion: "Collection Ad en Meta Ads: imagen hero de producto (lifestyle, variedad de zapatillas) + catálogo dinámico debajo. El usuario navega toda la tienda sin salir de Instagram/Facebook. Destino: stardeportes.com.",
            mensajes: [
              "Hero image: foto lifestyle con variedad de zapatillas (Fila, Skechers, New Balance, Topper). Copy overlay: '40+ marcas deportivas · Envío a todo el país'",
              "Catálogo debajo: productos por categoría (calzado hombre, calzado mujer, calzado kids, indumentaria, accesorios)",
              "CTA del anuncio: 'Comprar ahora' → stardeportes.com. Formato nativo de Meta Ads Shopping, no requiere pieza gráfica tradicional.",
            ],
            copyAnuncio: "👟 40+ marcas deportivas con envío a todo el país.\n\n🛒 Explorá todo el catálogo y comprá directo.\n💳 Cuotas sin interés.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Catálogo shopping",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catálogo - CTA directo",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
        ],
      },
    ],
    formatos: ["Video Comercial (9:16)", "Feed (1080x1350)", "Reel / Story (1080x1920)", "Carrusel (1080x1080)", "Meta Ads Shopping"],
    tono: "Cercano, directo, de barrio. Habla como un vecino que te recomienda la tienda de la esquina. Nada corporativo. Priorizar autenticidad, situaciones reales y dolores cotidianos. Mencionar la ciudad/localidad en cada pieza para generar identificación.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_stardeportes_meta_awareness_marca",
      "ree_stardeportes_meta_conversion_hombre",
      "ree_stardeportes_meta_conversion_mujer",
      "ree_stardeportes_meta_conversion_kids",
      "ree_stardeportes_meta_mensajes_credito",
    ],
  },

  arquitectura: [
    {
      nombre: "StarDeportes_Awareness",
      objetivo: "Interacción",
      tituloSeccion: "Campaña de Awareness",
      productorPiezas: "el equipo de branding de Star Deportes",
      tituloSubseccion: "Campaña de Awareness en Meta Ads",
      conSubsecciones: true,
      referencias: [
        {
          url: "https://www.instagram.com/p/Ddtu3IFxrv9/",
          titulo: "Nos mudamos enfrente — nueva sucursal Los Hornos (137 y 62)",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "El contenido no cambia: se pauta tal cual el mensaje de sucursal nueva en Los Hornos, 137 y 62.",
            "Agregar una placa de cierre animada de 3-4s, la misma para las piezas 1, 2 y 4.",
            "En esa placa: el cierre de la campaña, vení a cualquiera de nuestras sucursales o comprá directamente online en stardeportes.com, más el logo de Star Deportes y @stardeportes para seguir en redes.",
          ],
        },
        {
          url: "https://www.instagram.com/p/DdjkoGbRVyg/",
          titulo: "Vení a conocer la nueva sucursal 137 y 62",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "El contenido no cambia: se mantiene el mensaje de la sucursal nueva.",
            "Reforzar en pantalla la dirección y la localidad, 137 y 62 Los Hornos, para que se entienda sin audio.",
            "Agregar la misma placa de cierre animada de 3-4s, la que también lleva la pieza 4.",
            "En esa placa: el cierre de la campaña, vení a cualquiera de nuestras sucursales o comprá directamente online en stardeportes.com, más el logo de Star Deportes y @stardeportes para seguir en redes.",
          ],
        },
        {
          url: "https://www.instagram.com/reel/DdZOuHhx3wH/",
          titulo: "Promos bancarias en sucursal — Banco Provincia, Cuenta DNI y NaranjaX",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Reemplazar la placa de \"PROMOS SEPTIEMBRE\" por \"PROMOS OCTUBRE\", o directamente por las promos vigentes sin el mes para no tener que reeditar la pieza cada 30 días.",
            "Confirmar que las tres promos sigan vigentes (Banco Provincia, Cuenta DNI y NaranjaX). Si alguna cayó, sacarla de la placa antes de pautar: es un beneficio bancario y se vence sin aviso.",
            "Agregar el cierre de marca con logo, @stardeportes y stardeportes.com.",
          ],
        },
        {
          url: "https://www.instagram.com/p/DdMZAQ4Rxqq/",
          titulo: "Modelos urbanos con promos",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Recortar unos 10 segundos del reel.",
            "Agregar la misma placa de cierre animada de 3-4s que llevan las piezas 1 y 2.",
            "En esa placa: el cierre de la campaña, vení a cualquiera de nuestras sucursales o comprá directamente online, el logo de Star Deportes y @stardeportes para seguir en redes, y además el CTA \"Estos MODELOS y más en\" con el badge de stardeportes.com.",
          ],
        },
        {
          url: "https://www.instagram.com/p/DdHNbdrRli0/",
          titulo: "Outfits con promos",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Reemplazar el mes de la placa de promos bancarias por OCTUBRE, o directamente dejar las promos vigentes sin el mes para no tener que reeditar la pieza cada 30 días.",
            "Agregar el cierre de marca con logo y stardeportes.com.",
          ],
        },
      ],
      descripcionCampana: "Comunicar la existencia de Star Deportes y la variedad de marcas que maneja: más de 40 marcas deportivas, todos los talles y para toda la familia. El cierre de todas las piezas es el mismo doble camino: vení a cualquiera de nuestras sucursales o comprá directamente online en stardeportes.com.",
      status: "activa",
      destino: "Perfil de Instagram (@stardeportes)",
      bannerPiezas: "5 reels ya publicados en @stardeportes, cada uno con su edición pendiente antes de pautar. A eso se suman 3 piezas nuevas a producir.",
      notaCampana: "Los 2 reels de la sucursal 137 y 62 comunican la apertura de Los Hornos y se pautan con ese mensaje; van al conjunto geolocalizado de La Plata. No necesitan cambios de contenido, solo cierre de marca. Otros 2 reels llevan la placa de promos bancarias de septiembre, así que necesitan una edición más antes de pautarse; si no, se pauta una promoción vencida. El quinto, el de modelos urbanos, solo necesita recorte y placa de cierre. A eso se suman 3 piezas nuevas a producir: 1 video UGC de marca y 2 flyers en formato posteo con su adaptación a story. Total de la campaña: 8 piezas.",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Seguidores"],
      piezas: [
        {
          formato: "Video UGC Vertical (9:16)",
          dolor: "No conoce Star Deportes. No sabe que existe una tienda con más de 40 marcas deportivas en su zona, así que cuando necesita zapatillas o indumentaria va directo a las cadenas grandes o compra en Mercado Libre.",
          solucion: "Star Deportes es la tienda deportiva más completa de la zona: más de 40 marcas, todos los colores y todos los talles, 13 sucursales en provincia de Buenos Aires y crédito personal propio para renovar el placard de toda la familia.",
          comunicacion: "[0-3s] HOOK — Chica filma en selfie caminando por la vereda, cámara en mano, luz natural, tono espontáneo. De fondo tiene que verse el cartel de Star Deportes o la fachada del local: '¿Nunca escuchaste hablar de Star Deportes?' [3-8s] BODY — Entra al local filmando, plano amplio de las paredes de calzado y las góndolas llenas: '¡Es la tienda deportiva más completa de la zona y tenemos más de 40 marcas!' [8-14s] BODY — Recorre la pared de zapatillas, close-ups de los logos de las marcas y de los talles en las cajas: '47 Street, Topper, Fila, Atomik, Reebok, todos los colores, todos los talles.' [14-19s] BODY — Plano del mostrador, insert del cartel de la sucursal con el nombre de la localidad, una clienta entregando el DNI: 'Contamos con 13 sucursales en Buenos Aires y créditos personales propios, para que puedas renovar tu placard o el de tu familia.' [19-23s] CTA — Corte a ella en su casa abriendo la bolsa y mostrando las zapatillas a cámara, insert del celular navegando la tienda: 'Si querés saber más, seguinos en @stardeportes o visitá nuestra web.' [23-25s] CIERRE — Motion graphics sobre fondo rojo. Logo Star Deportes, @stardeportes y stardeportes.com.",
          hook: "¿Nunca escuchaste hablar de Star Deportes?",
          body: "¡Es la tienda deportiva más completa de la zona y tenemos más de 40 marcas! 47 Street, Topper, Fila, Atomik, Reebok, todos los colores, todos los talles. Contamos con 13 sucursales en Buenos Aires y créditos personales propios, para que puedas renovar tu placard o el de tu familia.",
          cta: "Si querés saber más, seguinos en @stardeportes o visitá nuestra web.",
          copyAnuncio: "¿Nunca escuchaste hablar de Star Deportes? 👟\n\n✅ La tienda deportiva más completa de la zona, con más de 40 marcas: 47 Street, Topper, Fila, Atomik, Reebok y muchas más.\n✅ Todos los colores y todos los talles, para toda la familia.\n✅ 13 sucursales en provincia de Buenos Aires.\n✅ Créditos personales propios para que renueves tu placard o el de tu familia.\n\n📦 ¿No tenés una cerca? Enviamos a todo el país.\n\n👉 Seguinos en @stardeportes o entrá a stardeportes.com",
          pilar: "Marca",
          tema: "Presentación de marca — marcas, talles, sucursales y crédito propio",
          formatoNarrativo: "UGC — Testimonial a cámara",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Casual", estilo: "UGC" },
          duracion: "23-25s",
          destinoUrls: ["https://stardeportes.com/"],
          enRevision: false,
        },
        {
          formato: "Posteo Rectangular (1080x1350)",
          dolor: "Vive en La Plata o en un barrio de la periferia y no sabe que tiene una sucursal de Star Deportes a pocas cuadras. Asume que para comprar indumentaria deportiva tiene que ir al centro o a un shopping.",
          solucion: "8 de las 13 sucursales están en el Gran La Plata: dos en el centro, dos en Los Hornos, y una en Lisandro Olmos, Villa Elisa, Ensenada y Berisso. Desde cualquier barrio de la zona hay una a minutos.",
          comunicacion: "Flyer vertical con mapa estilizado de La Plata y alrededores, con pines rojos sobre las sucursales y los nombres de los barrios legibles alrededor. Claim grande arriba. Debajo del mapa, listado de las localidades con sucursal en dos columnas. Franja inferior con el CTA de Instagram. Adaptar a Story (1080x1920) agrandando el mapa y dejando el listado en una sola columna.",
          mensajes: [
            "Visual: mapa de La Plata y alrededores con pines rojos sobre las sucursales. Claim grande, TENÉS UN STAR DEPORTES A MINUTOS DE TU CASA",
            "Copy: localidades con sucursal en dos columnas — La Plata (x2), Los Hornos (x2), Lisandro Olmos, Villa Elisa, Ensenada, Berisso",
            "Badge + CTA: franja inferior con 'Seguinos en Instagram, @stardeportes' y el logo",
          ],
          copyAnuncio: "Tenés un Star Deportes a minutos de tu casa 📍\n\n✅ 8 sucursales en el Gran La Plata: centro, Los Hornos, Lisandro Olmos, Villa Elisa, Ensenada y Berisso.\n✅ Más de 40 marcas deportivas, todos los colores y todos los talles.\n✅ Vivís en City Bell, Gonnet, Ringuelet, Tolosa, Villa Elvira, Altos de San Lorenzo, Melchor Romero o Abasto, tenés una a minutos.\n\n👉 Seguinos en @stardeportes",
          pilar: "Marca",
          tema: "Cobertura de sucursales en el Gran La Plata",
          formatoNarrativo: "Informativo — Mapa de cobertura",
          estructuraNarrativa: "Claim - Prueba - Acción",
          tratamiento: { tipo: "Imagen", tono: "Informativo", estilo: "Flat / Mapa ilustrado" },
          destinoUrls: ["https://www.instagram.com/stardeportes/"],
          enRevision: false,
        },
        {
          formato: "Posteo Rectangular (1080x1350)",
          dolor: "Cree que para encontrar variedad de marcas tiene que ir a un shopping o comprar online, porque no sabe qué marcas maneja Star Deportes.",
          solucion: "Más de 40 marcas en una sola tienda. La grilla de logos lo muestra de un vistazo, sin que haya que leer nada.",
          comunicacion: "Flyer vertical con grilla de logos de marcas sobre fondo limpio, ordenados en filas parejas y con el mismo peso visual. Claim grande arriba. Línea de refuerzo debajo de la grilla. Franja inferior con el CTA de Instagram. Usar los logos tal como figuran en stardeportes.com. Adaptar a Story (1080x1920) pasando la grilla a menos columnas y más filas.",
          mensajes: [
            "Visual: grilla de logos sobre fondo limpio. Claim grande, MÁS DE 40 MARCAS EN UN SOLO LUGAR",
            "Copy: logos de 47 Street, Topper, Fila, Atomik, Reebok, Puma, Converse, New Balance, Skechers, Crocs, Havaianas, Umbro, Diadora, Head, Everlast y Salomon",
            "Copy: línea de refuerzo debajo de la grilla — 'Todos los colores, todos los talles, para toda la familia'",
            "Badge + CTA: franja inferior con 'Seguinos en Instagram, @stardeportes' y el logo",
          ],
          copyAnuncio: "Más de 40 marcas en un solo lugar 👟\n\n✅ 47 Street, Topper, Fila, Atomik, Reebok, Puma, Converse, New Balance, Skechers, Crocs, Havaianas y muchas más.\n✅ Todos los colores, todos los talles, para toda la familia.\n✅ 13 sucursales en provincia de Buenos Aires.\n\n👉 Seguinos en @stardeportes",
          pilar: "Producto",
          tema: "Variedad de marcas",
          formatoNarrativo: "Informativo — Grilla de marcas",
          estructuraNarrativa: "Claim - Prueba - Acción",
          tratamiento: { tipo: "Imagen", tono: "Directo", estilo: "Flat / Grilla de logos" },
          destinoUrls: ["https://www.instagram.com/stardeportes/"],
          enRevision: false,
        },
      ],
      presupuestoCampana: { diario: "USD $6,7/día (ARS $10.318)", mensual: "USD $200/mes (ARS $308.000)" },
      adSets: [
        {
          nombre: "Conjunto_General_LaPlata_20km",
          segmentacion: "25-55 años, La Plata y alrededores (radio 20km: La Plata, Ensenada, Berisso, Los Hornos, Villa Elisa, Lisandro Olmos, City Bell, Gonnet). Intereses: Deporte, Indumentaria deportiva, Zapatillas, Running, Fitness, Fútbol, Moda deportiva",
          ads: [
            "Reel_SucursalNueva_V1 | https://www.instagram.com/p/Ddtu3IFxrv9/",
            "Reel_SucursalNueva_V2 | https://www.instagram.com/p/DdjkoGbRVyg/",
            "Reel_PromosBancarias_V1 | https://www.instagram.com/reel/DdZOuHhx3wH/",
            "Reel_ModelosUrbanos_V1 | https://www.instagram.com/p/DdMZAQ4Rxqq/",
          ],
        },
        {
          nombre: "Conjunto_Interior_Sucursales",
          segmentacion: "25-55 años, radio 20km alrededor de sucursales del interior (San Vicente, Coronel Brandsen, Magdalena, Saladillo). Intereses: Deporte, Indumentaria deportiva, Zapatillas",
          ads: [
            "Reel_OutfitsPromos_V1 | https://www.instagram.com/p/DdHNbdrRli0/",
          ],
        },
      ],
    },
    {
      nombre: "StarDeportes_Ventas_B2C",
      objetivo: "Ventas",
      descripcionCampana: "Generar conversiones directas en stardeportes.com. 3 conjuntos de anuncios segmentados por categoría (Hombre ~10 piezas, Mujer ~10 piezas, Kids ~10 piezas = ~30 piezas nuevas producidas por el equipo de branding de Star Deportes). Se lanza simultáneamente en S7 para validar cuál categoría tiene mayor tracción y redistribuir presupuesto hacia el ganador antes de Black Friday (S8). Meta Pixel + Shopping conectados para atribución end-to-end.",
      status: "en-desarrollo",
      tituloSeccion: "Campaña B2C (E-commerce)",
      tituloSubseccion: "Campaña B2C en Meta Ads",
      destino: "stardeportes.com/[categoría]",
      kpisCampana: ["Visitas a página de producto", "AddToCart", "Compras", "ROAS"],
      conversionCampana: "Compras en Tienda Nube",
      presupuestoCampana: { diario: "USD $50/día (ARS $77.000)", mensual: "USD $1,500/mes (ARS $2.310.000)" },
      conSubsecciones: true,
      adSets: [
        {
          nombre: "Conjunto_Hombre",
          segmentacion: "Hombres 25-55 años, provincia de Buenos Aires. Intereses: Deporte, Running, Fútbol, Fitness, Zapatillas deportivas, Calzado masculino. Presupuesto: ~USD $500/mes",
          ads: [
            "Video UGC 1 | Dolor: no encuentra marcas alternativas → variedad Star Deportes",
            "Posteo 1 | Hero de producto: zapatillas Fila/New Balance/Topper con precio",
            "Carrusel 1 | Catálogo hombre: 4 productos bestseller con precio",
            "Shopping | Collection Ad — catálogo dinámico calzado hombre",
          ],
        },
        {
          nombre: "Conjunto_Mujer",
          segmentacion: "Mujeres 25-55 años, provincia de Buenos Aires. Intereses: Moda, Moda deportiva, Zapatillas, Fitness, Yoga, Pilates, 47 Street. Presupuesto: ~USD $500/mes",
          ads: [
            "Video UGC 1 | Dolor: siempre las mismas marcas → 47 Street, Skechers, Crocs",
            "Posteo 1 | Hero de producto: zapatillas Skechers/47 Street con precio",
            "Carrusel 1 | Catálogo mujer: 4 productos bestseller con precio",
            "Shopping | Collection Ad — catálogo dinámico calzado mujer",
          ],
        },
        {
          nombre: "Conjunto_Kids",
          segmentacion: "Adultos 28-50 años (padres), provincia de Buenos Aires. Intereses: Familia, Hijos, Escuela, Deporte infantil, Calzado escolar. Presupuesto: ~USD $500/mes",
          ads: [
            "Video UGC 1 | Dolor: zapatillas rotas de los hijos → renovar en cuotas",
            "Posteo 1 | Hero de producto: zapatillas Addnice/Topper kids con precio",
            "Carrusel 1 | Catálogo kids: 4 productos bestseller con precio",
            "Shopping | Collection Ad — catálogo dinámico calzado kids",
          ],
        },
      ],
      notaCampana: "Los primeros 14 días son de testeo. Se validan formatos, ángulos y categorías. Después se redistribuye presupuesto hacia los ganadores.",
    },
    {
      nombre: "StarDeportes_CreditoPersonal",
      objetivo: "Mensajes",
      descripcionCampana: "Comunicar el diferencial que ningún competidor tiene: crédito propio de Star Deportes, sin tarjeta y sin banco, que se saca en la sucursal con el DNI. Dos cupos según la documentación que presente, $500.000 con recibo de sueldo, monotributo o jubilación y $450.000 solo con DNI. El crédito es exclusivamente presencial y válido para productos de las sucursales, así que la campaña va estrictamente geolocalizada al radio de cada local y el cierre de todas las piezas es el mismo, escribinos por WhatsApp y te decimos si podés acceder.",
      status: "activa",
      tituloSeccion: "Campaña Crédito Personal (WhatsApp)",
      tituloSubseccion: "Campaña Crédito Personal en Meta Ads",
      conSubsecciones: true,
      referencias: [
        {
          url: "https://www.instagram.com/p/Ddg33v_R-qB/",
          titulo: "Cómo funcionan los planes de crédito personal",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Reemplazar el hook: arranca con «A ver qué prefiere el algoritmo», que es un chiste de contenido orgánico y en pauta no significa nada. Poner en los primeros 3s una placa que interpele, del tipo «VIENDO SI APROVECHÁS LOS CRÉDITOS PERSONALES DE STAR DEPORTES, ¿O VAS A SEGUIR ESPERANDO?».",
            "Dejar un solo plan en pantalla, el de $450.000 sólo con DNI, y mandar el resto a la conversación. Hoy la pieza explica los dos planes completos, así que el usuario se va con la duda resuelta y no escribe.",
            "Cambiar el CTA orgánico por el de pauta, escribinos por WhatsApp: la campaña corre con objetivo Mensajes y no hay bio ni comentarios donde derivar.",
            "Quemar subtítulos: en pauta la mayoría la ve sin sonido.",
            "Agregar la placa de cierre de la campaña, la misma para las piezas 1 a 4: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: "https://www.instagram.com/p/Dd4K0XhuVYh/",
          titulo: "Estilos hay muchos, créditos como los nuestros no",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Es la pieza más fuerte de diferenciación y la única cuyo copy ya pide los datos concretos. Subir eso al video: «pasame tu nombre, tu teléfono y tu documento y te averiguo enseguida». Decirle al usuario exactamente qué mandar es lo que convierte una vista en conversación.",
            "Agregar una placa corta que explicite que el crédito es propio de Star Deportes, sin tarjeta y sin banco, porque el claim solo no lo dice.",
            "Sumar en pantalla el requisito de tener domicilio en la zona de alguna de nuestras sucursales. Hoy está sólo en el copy y filtra consultas que después no cierran.",
            "Agregar la placa de cierre de la campaña, la misma para las piezas 1 a 4: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: "https://www.instagram.com/p/DdUB8IDR6Um/",
          titulo: "Crédito personal — cupos y financiación",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Hoy es un gemelo de la pieza 1: mismo copy palabra por palabra, misma portada y mismo mensaje, sólo cambia el hook orgánico. Si se pautan las dos en el mismo conjunto compiten entre sí por la misma entrega.",
            "Diferenciarla: que esta sea la pieza del cómo se paga, que es la segunda duda que más llega. Hasta 4 cuotas, la primera en el momento con el plan de DNI o a los 30 días con recibo, y las cuotas se abonan en efectivo en sucursal.",
            "Hook propio, distinto al de la pieza 1, en clave de duda concreta sobre cómo se paga el crédito.",
            "Agregar la placa de cierre de la campaña, la misma para las piezas 1 a 4: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: "https://www.instagram.com/p/Dcgi_uauFe3/",
          titulo: "Crédito personal para regalos",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Mantener el ángulo de regalo, que es el que mejor funciona de acá a Navidad, pero sacar la referencia festiva puntual del posteo original para que la pieza aguante todo Q4 sin reeditarse.",
            "Hook de conversación en clave regalo, del tipo «¿Ya pensaste los regalos de fin de año? Fijate si podés usar el crédito».",
            "Agregar la aclaración de que se compra en la sucursal.",
            "Agregar la placa de cierre de la campaña, la misma para las piezas 1 a 4: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: assetDataUri("ref-credito-historia-montos.jpg"),
          tipo: "image",
          titulo: "Historia — montos por documentación ($500.000 con recibo / $450.000 solo DNI)",
          formato: "Historia 1080x1920",
          estado: "Requiere edición",
          edicion: [
            "Reemplazar el CTA de abajo, respondé esta historia, que es orgánico y no existe en pauta, por escribinos por WhatsApp con el ícono.",
            "Es el único cambio imprescindible: el resto de la placa, los dos montos con su requisito y la aclaración de que es válido para productos de nuestras sucursales, se pauta tal cual está.",
            "Adaptar también a 1080x1350 para que pueda correr en feed además de historias.",
          ],
        },
      ],
      destino: "WhatsApp Business (sucursal más cercana)",
      kpisCampana: ["Mensajes a WhatsApp", "CPL por consulta"],
      conversionCampana: "Cantidad de mensajes a WhatsApp",
      presupuestoCampana: { diario: "USD $10/día (ARS $15.400)", mensual: "USD $300/mes (ARS $462.000)" },
      adSets: [
        {
          nombre: "Conjunto_Credito_LaPlata",
          segmentacion: "25-55 años, La Plata y alrededores (radio 20km: La Plata, Ensenada, Berisso, Los Hornos, Villa Elisa, Lisandro Olmos, City Bell, Gonnet). Intereses: Deporte, Indumentaria deportiva, Zapatillas, Running, Fitness, Fútbol, Moda deportiva, Compras, Financiación, Crédito. Exclusión: personas fuera del radio de sucursales",
          ads: [
            "Reel_CreditoPersonal_V1 | https://www.instagram.com/p/Ddg33v_R-qB/",
            "Reel_CreditoPersonal_V2 | https://www.instagram.com/p/Dd4K0XhuVYh/",
          ],
        },
        {
          nombre: "Conjunto_Credito_Interior",
          segmentacion: "25-55 años, radio 20km de sucursales interior (San Vicente, Coronel Brandsen, Magdalena, Saladillo). Intereses: Deporte, Indumentaria deportiva, Zapatillas, Compras, Financiación, Crédito",
          ads: [
            "Reel_CreditoPersonal_V3 | https://www.instagram.com/p/DdUB8IDR6Um/",
            "Reel_CreditoPersonal_V4 | https://www.instagram.com/p/Dcgi_uauFe3/",
          ],
        },
      ],
      notaCampana: "El crédito personal es el diferencial #1 de Star Deportes frente a Mateu, Open Sports y Solo Deportes. Ningún competidor ofrece financiación directa sin tarjeta. Como el crédito solo se otorga en el local, la campaña se pauta estrictamente dentro del radio de cada sucursal: un lead fuera de ese radio no se puede atender y ensucia el CPL.",
      piezas: [
        {
          formato: "Video UGC Vertical (9:16)",
          dolor: "Necesita renovar calzado e indumentaria deportiva, el ticket es alto y no tiene tarjeta de crédito, así que posterga la compra o la hace de a poco.",
          solucion: "Crédito propio de Star Deportes: se saca en la sucursal con el DNI, sin tarjeta y sin banco, se aprueba en el momento y se usa el mismo día.",
          comunicacion: "[0-3s] HOOK — Vendedora filma en selfie en la puerta de la sucursal, cámara en mano, luz natural, tono espontáneo: '¿Querés renovar tu placard o el de tu familia?' [3-8s] BODY — Camina hacia adentro mostrando la pared de calzado y las góndolas llenas: 'En Star Deportes el crédito te lo damos nosotros, no es un banco ni una tarjeta.' [8-14s] BODY — Plano del mostrador, una clienta entrega el DNI, insert de la placa con los dos montos: 'Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento, y si traés recibo de sueldo el cupo te sube a $500.000.' [14-19s] BODY — Recorre la góndola junto a la clienta eligiendo unas zapatillas y un conjunto, close-ups de los productos: 'Lo usás ahí mismo para llevarte lo que quieras de la sucursal.' [19-23s] CTA — La clienta sale con la bolsa, la vendedora mira a cámara y sonríe, badge en edición con el ícono de WhatsApp: 'Escribinos por WhatsApp que te contamos más.' [23-25s] CIERRE — Motion graphics sobre fondo rojo. Logo Star Deportes, las localidades del conjunto y el ícono de WhatsApp.",
          hook: "¿Querés renovar tu placard o el de tu familia?",
          body: "En Star Deportes el crédito te lo damos nosotros, no es un banco ni una tarjeta. Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento, y si traés recibo de sueldo el cupo te sube a $500.000. Lo usás ahí mismo para llevarte lo que quieras de la sucursal.",
          cta: "Escribinos por WhatsApp que te contamos más.",
          copyAnuncio: "¿Querés renovar tu placard o el de tu familia? 👟\n\n✅ El crédito te lo damos nosotros, sin tarjeta y sin banco.\n✅ Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento.\n✅ $500.000 con DNI + recibo de sueldo, monotributo o jubilación.\n✅ $450.000 sólo con tu DNI.\n\n📍 Válido para productos de nuestras sucursales.\n\n👉 Escribinos por WhatsApp que te contamos más",
          pilar: "Producto",
          tema: "Crédito propio sin tarjeta ni banco",
          formatoNarrativo: "UGC — Vendedora a cámara",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Casual", estilo: "UGC" },
          duracion: "23-25s",
          enRevision: false,
        },
        {
          formato: "Posteo Rectangular (1080x1350)",
          dolor: "No sabe si califica ni qué papeles le van a pedir, y no pregunta para no exponerse a que le digan que no.",
          solucion: "Los dos cupos publicados con su requisito al lado, para que sepa de antemano a cuál puede acceder antes de escribir.",
          comunicacion: "Flyer vertical sobre fondo rojo con líneas radiales, en la misma línea gráfica de las historias de crédito que la marca ya viene usando. Claim grande arriba. Dos bloques de monto apilados, el de $500.000 en negro y el de $450.000 en rojo, cada uno con su requisito en una línea chica encima. Franja inferior blanca con la aclaración de sucursales y el CTA de WhatsApp. Adaptar a Story (1080x1920) estirando el fondo y dejando los dos bloques centrados.",
          mensajes: [
            "Visual: fondo rojo con líneas radiales. Claim grande, CRÉDITOS PERSONALES SIN TARJETA Y SIN BANCO",
            "Copy: dos bloques de monto — '$500.000 con DNI + recibo de sueldo, monotributo o jubilación' y '$450.000 sólo con tu DNI'",
            "Badge + CTA: franja inferior con 'Válido para productos de nuestras sucursales' y 'Escribinos por WhatsApp y consultá tu cupo'",
          ],
          copyAnuncio: "Créditos personales sin tarjeta y sin banco 💳\n\n✅ $500.000 con DNI + recibo de sueldo, monotributo o jubilación.\n✅ $450.000 sólo con tu DNI.\n✅ Te lo aprobamos en la sucursal, en el momento.\n\n📍 Válido para productos de nuestras sucursales.\n\n👉 Escribinos por WhatsApp y consultá tu cupo",
          pilar: "Producto",
          tema: "Cupos y requisitos del crédito personal",
          formatoNarrativo: "Producto — Hero Shot",
          estructuraNarrativa: "Afirmación - Evidencia",
          tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
          enRevision: false,
        },
        {
          formato: "Posteo Rectangular (1080x1350)",
          dolor: "Tiene que renovar el calzado y la ropa deportiva de toda la familia de una sola vez y no le entra en el presupuesto del mes.",
          solucion: "Con el crédito personal equipa a toda la familia en una sola compra en la sucursal y la paga en cuotas.",
          comunicacion: "Flyer vertical con hero de tres pares de zapatillas alineados de mayor a menor talle, de adulto a chico, y un conjunto deportivo detrás. Claim grande arriba. Bloque de tres beneficios con íconos en el medio. Franja inferior con la aclaración de sucursales y el CTA de WhatsApp. Adaptar a Story (1080x1920) dejando el hero arriba y los beneficios apilados.",
          mensajes: [
            "Visual: tres pares de zapatillas alineados de mayor a menor talle con un conjunto deportivo detrás. Claim grande, EQUIPÁ A TODA LA FAMILIA EN UNA SOLA COMPRA",
            "Copy: tres beneficios con íconos — 'Crédito propio, sin tarjeta y sin banco', 'Hasta $500.000 de cupo', 'Más de 40 marcas para toda la familia'",
            "Badge + CTA: franja inferior con 'Solo en nuestras sucursales' y 'Escribinos por WhatsApp'",
          ],
          copyAnuncio: "Equipá a toda la familia en una sola compra 👟\n\n✅ Crédito propio de Star Deportes, sin tarjeta y sin banco.\n✅ Hasta $500.000 de cupo, aprobado en el momento.\n✅ Más de 40 marcas y todos los talles, para chicos y grandes.\n\n📍 Solo en nuestras sucursales.\n\n👉 Escribinos por WhatsApp y consultá tu cupo",
          pilar: "Producto",
          tema: "Compra familiar financiada con crédito propio",
          formatoNarrativo: "Producto — Hero Shot",
          estructuraNarrativa: "Problema - Solución",
          tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
          enRevision: false,
        },
      ],
      bannerPiezas: "Las 5 piezas ya publicadas se reutilizan con una edición previa para pauta. Las 3 piezas a producir las arma el equipo de branding de Star Deportes con el brief de abajo.",
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Equipo de agentes en Callbell (CRM centralizado) con turnos rotativos",
    capacidadDiaria: "Buena. Equipo dedicado con CRM. La consulta de stock es manual (agente verifica en DragonFish).",
    tiempoRespuesta: "Variable. Depende del turno. No hay automatización de respuestas de stock.",
    validado: false,
  },

  ofertas: [
    {
      nombre: "Kit Deportivo Familiar",
      descripcion: "Combo de zapatillas para padre + madre + hijo/a. Compra 3 pares juntos con descuento o cuotas sin interés extendidas. Ideal para inicio de clases o cambio de temporada.",
      precio: "Por definir (calcular sobre ticket promedio $85k x3 = $255k con incentivo)",
    },
    {
      nombre: "Equipamiento Completo",
      descripcion: "Zapatilla + conjunto deportivo (remera/buzo + pantalón/calza) del mismo color/marca. Aumenta el ticket promedio incentivando la compra cruzada calzado → indumentaria.",
      precio: "Por definir",
    },
  ],

  cambiosEcommerce: [
    { cambio: "Instalar Meta Pixel vía GTM o integración nativa Tienda Nube", objetivo: "Habilitar retargeting y atribución de conversiones" },
    { cambio: "Configurar CAPI (Conversions API)", objetivo: "Deduplicar eventos y mejorar señal de conversión" },
    { cambio: "Activar Meta Ads Shopping (catálogo dinámico)", objetivo: "Habilitar Collection Ads y Advantage+ Shopping" },
    { cambio: "Configurar eventos de e-commerce en GA4 (view_item, add_to_cart, purchase)", objetivo: "Mapear customer journey completo en el sitio" },
  ],

  competenciaAds: {
    marca: "Mateu Sports / Open Sports / Solo Deportes",
    cuenta: "mateusports / opensports / solodeportes",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=star+deportes",
    formatos: [
      { id: "f01", tipo: "Carrusel", dolor: "No sabe qué zapatilla elegir entre tantas marcas y modelos" },
      { id: "f02", tipo: "Shopping / Catálogo", dolor: "Quiere ver precios y comprar sin salir de Instagram" },
      { id: "f03", tipo: "Video UGC", dolor: "Busca inspiración para su próxima compra deportiva" },
      { id: "f04", tipo: "Imagen estática", dolor: "Quiere saber si tiene el producto en su talle y precio" },
    ],
    competidores: [
      { nombre: "Mateu Sports", estado: "45 anuncios activos", activo: true, instagramUrl: "https://www.instagram.com/mateusports/" },
      { nombre: "Open Sports", estado: "99 anuncios activos", activo: true, instagramUrl: "https://www.instagram.com/opensportsarg/" },
      { nombre: "Solo Deportes", estado: "73 anuncios activos", activo: true, instagramUrl: "https://www.instagram.com/solodeportes/" },
    ],
    observacion: "Los tres competidores principales mantienen 217 anuncios activos combinados con masividad de testeo por ICP, formato y producto. Star Deportes tiene 0 campañas de conversión activas. Ninguno de los tres competidores ofrece crédito personal directo — es el diferencial exclusivo de Star Deportes.",
  },

  notas: "Star Deportes (Grupo Lente) es un caso clásico de empresa madura en lo físico pero sin desarrollar en lo digital. 13 sucursales, 13 años de trayectoria, 189k seguidores en IG, pero cero atribución digital y un e-commerce que representa el 0.01% de las ventas.\n\nEl crédito personal es el diferencial más fuerte: ningún competidor lo ofrece. Pero solo funciona presencialmente, por lo que las campañas de crédito deben ser estrictamente geolocalizadas.\n\nEl equipo de branding del cliente (5 personas, 2 diseñadores) produce las piezas. REE entrega los briefs creativos (pilares, hooks, guiones, referencias). Son 5 campañas con ~46 piezas totales según el acuerdo comercial: B2C Hombre (~10), B2C Mujer (~10), B2C Kids (~10), Awareness (~8) y Crédito Personal (~8). Awareness y Crédito Personal reutilizan contenido existente de @stardeportes (no requieren producción nueva). Las ~30 piezas B2C las produce el equipo de Star Deportes con briefs de REE.\n\nLas 3 campañas comparten el mismo ciclo: Foundation S1-S2, Build S3, Launch S4-S5 y Scale desde S6. Las 2 semanas de Launch son de validación: se prueban formatos, ángulos y categorías, y recién con esa data se redistribuye presupuesto en Scale.\n\nEstacionalidad clave Q4: Día de la Madre (18/10), CyberMonday de CACE (2 al 4/11, con Cyber Week hasta el 8/11), Black Friday (27/11) y Navidad (25/12). El CyberMonday argentino es a principios de noviembre, no el lunes posterior a Black Friday. Al lanzar las 3 campañas en S4 (26/10), el CyberMonday cae a solo una semana del lanzamiento, en plena validación: sirve para leer demanda real, no para escalar. A Black Friday, en cambio, se llega con unas 4 semanas de data y ya en fase Scale.",

  entregaMaterial: {
    destino: "Google Drive",
    descripcion: "El material terminado se entrega en una carpeta de Google Drive compartida con REE, con una carpeta por campaña y, dentro, una carpeta por pieza. Cada carpeta de pieza lleva todos sus formatos exportados juntos (el vertical, la adaptación a historia, los slides del carrusel), sin subcarpetas por formato.",
    arbol: [
      "Star Deportes — Creativos/",
      "├── Awareness/",
      "│   └── VideoReel_v1/",
      "├── Crédito Personal/",
      "│   └── VideoReel_v1/",
      "└── B2C Ventas/",
      "    └── VideoReel_v1/",
    ],
  },

  // Proximos pasos — explicitos (si no se definen, strategy-renderer los deriva de arquitectura/ofertas)
  proximosPasos: [
    {
      titulo: "Instalar el Pixel de Meta en el e-commerce",
      responsable: "Equipo web Star Deportes + REE Growth",
      tiempo: "Esta semana — bloqueante",
      items: [
        "Verificado con la Prueba de Eventos del Pixel: no se dispara ningún evento en stardeportes.com. El Pixel no está instalado.",
        "Instalarlo desde Google Tag Manager (GTM-5M8VNBMR), que ya está activo en el sitio. No requiere tocar el código de Tienda Nube.",
        "Cargar la etiqueta base del Pixel en GTM con disparador All Pages y publicar el contenedor.",
        "Configurar los eventos de conversión: PageView, ViewContent, AddToCart, InitiateCheckout y Purchase.",
        "Revalidar con la Prueba de Eventos y el Meta Pixel Helper antes de prender cualquier campaña de conversión.",
        "Sin Pixel no hay retargeting ni atribución de ventas: la campaña B2C de Ventas no se puede medir.",
      ],
    },
    {
      titulo: "Lanzar Awareness y Crédito Personal",
      responsable: "REE Growth + equipo Star Deportes",
      tiempo: "Esta semana",
      items: [
        "Confirmar accesos a la cuenta publicitaria de Meta Ads",
        "Confirmar tarjeta de pago del cliente en Meta Ads",
        "Prender campaña StarDeportes_Awareness",
        "Prender campaña StarDeportes_CreditoPersonal",
      ],
    },
    {
      titulo: "Creación de piezas + setup de campaña B2C",
      responsable: "Equipo de branding Star Deportes + REE Growth",
      tiempo: "Semanas 4 - 6",
      items: [
        "REE entrega los briefs creativos por categoría (Hombre / Mujer / Kids)",
        "Producción de las ~30 piezas B2C por el equipo de branding del cliente",
        "Armado de la campaña StarDeportes_Ventas_B2C en Meta Ads",
        "Conectar el catálogo de Tienda Nube a Meta para habilitar Shopping",
      ],
    },
    {
      titulo: "Pricing y E-commerce",
      responsable: "Equipo Star Deportes + REE Growth",
      tiempo: "Semanas 2 - 3",
      items: [
        "Definir precios de los packs (Kit Deportivo Familiar, Equipamiento Completo)",
        "Crear las ofertas/packs en Tienda Nube",
        "Implementar los cambios de tracking en la tienda online",
      ],
    },
  ],

  // Roadmap — Foundation S1-S2 (2 semanas), Build S3 (1 semana), Launch S4-S5 (2 semanas
  // para validar data) y Scale S6-S8. Mismas fases para las 3 campañas.
  // El gantt cubre las primeras 8 semanas; Call ADS (S9) y Review Final (S12)
  // siguen en reviewMeetings, que no esta acotado a la ventana del gantt.
  // REE Metrics
  reeMetricsFeatures: [
    { titulo: "Dashboard", desc: "Conexión con Tienda Nube, campañas de Meta Ads y crecimiento de Instagram orgánico. Todo en una sola vista, personalizable según requerimientos." },
    { titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por qué se escala o se frena cada anuncio (Kill/Scale) para que siempre sepas qué se hizo y por qué." },
    { titulo: "E-Commerce", desc: "Datos de tu Tienda Nube: pedidos, facturación, ticket promedio, clientes únicos, carritos abandonados, top productos y top clientes." },
  ],
  reeMetricsFuente: "Tienda Nube",
  reeMetricsResetPasswordUrl: "https://tentacles.reecreativos.com/reset-password?token=ba699596fc6af08eae817a94210aa2df1eb8de14b918fd45e68e2a14f9cab2f9&welcome=true",
  reeMetricsEmail: "leandro@grupolente.com",
  reeMetricsNotaUsuarios: "Si el equipo necesita más accesos, avisanos y damos de alta los usuarios que hagan falta.",

  roadmap: [
    { nombre: "Brand Awareness", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
    { nombre: "Crédito Personal (WhatsApp)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
    { nombre: "B2C Ventas (E-commerce)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
  ],

  // Calendario real — coherente con acuerdo: 12 semanas desde 05/10/2026
  // S1=05/10, S2=12/10, S3=19/10, S4=26/10, S5=02/11, S6=09/11, S7=16/11, S8=23/11, S9=30/11, S10=07/12, S11=14/12, S12=21/12
  reviewMilestones: [
    { semana: 1, label: "KO Call", fecha: "05/10" },
    { semana: 3, label: "Foundation Review", fecha: "20/10" },
    { semana: 4, label: "Launch 3 campañas", fecha: "26/10" },
    { semana: 5, label: "CyberMonday", fecha: "02-04/11" },
    { semana: 6, label: "Inicio Scale", fecha: "09/11" },
    { semana: 8, label: "Black Friday", fecha: "27/11" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "KO Call", fecha: "05/10", desc: "Kickoff con el cliente. Alineamiento Q4, solicitud de accesos a Meta Ads y Tienda Nube.", status: "done" },
    { semana: "S3", nombre: "Foundation Review", fecha: "20/10", desc: "Revisión de estrategia completa: ICPs, las 3 campañas, piezas creativas y briefs para el equipo de Star Deportes.", status: "current" },
    { semana: "S4", nombre: "Launch de las 3 campañas", fecha: "26/10", desc: "Activación simultánea de Awareness, Crédito Personal y B2C. Awareness y Crédito arrancan con contenido reutilizado de @stardeportes; B2C con las piezas producidas por el equipo de Star Deportes.", status: "pending" },
    { semana: "S5", nombre: "CyberMonday (CACE)", fecha: "02-04/11", desc: "Primer pico estacional, en plena ventana de Launch. Las campañas llegan con solo una semana en el aire, así que se usa para recolectar data de demanda real más que para escalar. Cyber Week del 5 al 8/11.", status: "pending" },
    { semana: "S6", nombre: "Inicio de Scale", fecha: "09/11", desc: "Cierre de las 2 semanas de Launch. Con data de validación, se redistribuye presupuesto hacia campañas, ángulos y categorías ganadoras.", status: "pending" },
    { semana: "S8", nombre: "Black Friday", fecha: "27/11", desc: "Pico estacional principal. Las campañas llegan con ~4 semanas de data y ya en fase Scale. Escalar presupuesto sobre lo validado y activar piezas estacionales de ofertas.", status: "pending" },
    { semana: "S9", nombre: "Call ADS", fecha: "01/12", desc: "Seguimiento post Black Friday. Review de resultados estacionales, redistribución de presupuesto y optimización para el cierre de año (Navidad).", status: "pending" },
    { semana: "S12", nombre: "Review Final", fecha: "21/12", desc: "Revisión del ciclo Q4 completo (12 semanas). Resultados vs KPIs. ICPs, formatos y zonas ganadoras. Plan del siguiente ciclo.", status: "pending" },
  ],
};

// --- Generate 3 HTMLs ---

const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);
const brief = renderBriefHtml(data);

// Output dirs
const slug = data.clientInfo.slug;
const clientDir = new URL("./", import.meta.url).pathname;
const projectRoot = new URL("../../", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outputs = [
  { dir: join(clientDir, "onboardings"), file: `onboarding-${slug}.html`, html: onboarding },
  { dir: join(clientDir, "strategies"), file: `foundation-review-${slug}.html`, html: strategy },
  { dir: join(clientDir, "briefs"), file: `brief_creatives.html`, html: brief },
];

for (const out of outputs) {
  mkdirSync(out.dir, { recursive: true });
  const path = join(out.dir, out.file);

  // Backup before overwrite
  if (existsSync(path)) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const bakName = out.file.replace(".html", `.bak.${ts}.html`);
    const bakPath = join(out.dir, bakName);
    copyFileSync(path, bakPath);
    console.log(`Backup: ${bakPath}`);
  }

  writeFileSync(path, out.html, "utf-8");
  console.log(`Done: ${path}`);

  // Copy to Desktop
  const desktopFile = out.file.includes("brief_creatives") ? `brief_creatives_${slug}.html` : out.file;
  const desktopPath = join(desktop, desktopFile);
  writeFileSync(desktopPath, out.html, "utf-8");
  console.log(`Copy: ${desktopPath}`);
}

// Publish Foundation Review to ree-website
const reeWebsiteFoundations = join(projectRoot, "..", "..", "ree-website", "public", "foundations");
if (existsSync(reeWebsiteFoundations)) {
  const publishPath = join(reeWebsiteFoundations, `${slug}.html`);
  if (existsSync(publishPath)) {
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    copyFileSync(publishPath, join(reeWebsiteFoundations, `${slug}.bak.${ts}.html`));
  }
  writeFileSync(publishPath, strategy, "utf-8");
  console.log(`Publish: ${publishPath}`);
} else {
  console.log(`Skip publish: ${reeWebsiteFoundations} not found`);
}
