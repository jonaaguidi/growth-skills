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
    campanasVendidas: ["B2C Hombre joven adulto (8 piezas)", "B2C Mujer joven adulta (8 piezas)", "B2C Padres/madres de familia (8 piezas)", "Brand Awareness (~8 piezas)", "Crédito Personal (~8 piezas)"],
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
      "Alineamiento de campañas Q4: Awareness, B2C (Hombre / Mujer / Padres), Crédito Personal",
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
    justificacion: "Star Deportes tiene 189k seguidores en Instagram y 13 años de presencia física, pero cero campañas de conversión y un e-commerce que representa el 0.01% de las ventas. Los competidores operan con masividad de testeo (220 anuncios activos combinados entre Dexter, Open Sports, Mateu y Solo Deportes al 19/10/2026). La prioridad es activar el canal B2C (e-commerce) y medir el ROI de la inversión por primera vez, explotando el diferencial del crédito personal que ningún competidor ofrece. Captación es la palanca correcta: primero instalar la infraestructura de medición, después convertir.",
  },

  icp: [
    {
      segmento: "Hombre joven adulto",
      icono: "hombre",
      descripcion: "Hombre de 25 a 50 años en La Plata y zonas particulares de provincia de Buenos Aires (Berisso, Ensenada, Los Hornos, Coronel Brandsen, Magdalena, San Vicente, Saladillo). Compra calzado e indumentaria deportiva para sí mismo: fútbol, gimnasio, running o zapatilla de uso diario. Decide por modelo y marca, compara precio online antes de ir al local y pregunta por talle. Ticket de $70.000 a $130.000 por par.",
      frase: "Quiero el modelo que me gusta, en mi talle y al precio que me cierra",
      dolores: [
        "Las cadenas grandes priorizan Nike, Adidas y Puma, y nunca tienen stock en su talle",
        "No encuentra Fila, New Balance, Salomon, Topper o Reebok cerca de su casa",
        "El par que quiere sale entre $70.000 y $130.000 de una sola vez y lo termina postergando",
        "No sabe que Star Deportes vende online con envío a todo el país",
      ],
      deseos: [
        "Encontrar el modelo que busca en su talle sin tener que viajar hasta La Plata",
        "Variedad real de marcas para elegir, no tres opciones repetidas",
        "Financiar el par en cuotas sin interés o con el crédito personal de la sucursal",
        "Ver precio, modelo y talle disponible antes de ir al local",
      ],
      objeciones: [
        "No conozco Star Deportes como tienda online, no sé si es confiable",
        "¿Tienen mi talle? Del 43 para arriba nunca hay stock",
        "Prefiero probarme la zapatilla antes de comprarla",
        "¿Es producto original de la marca o réplica?",
      ],
      prioridad: "primario",
      recurrencia: "media",
      badge: "Compra individual",
    },
    {
      segmento: "Mujer joven adulta",
      icono: "mujer",
      descripcion: "Mujer de 25 a 50 años en La Plata y zonas particulares de provincia de Buenos Aires (Berisso, Ensenada, Los Hornos, Coronel Brandsen, Magdalena, San Vicente, Saladillo). Compra calzado e indumentaria deportiva para sí misma: gimnasio, pilates, yoga, caminata y zapatilla de uso diario combinable. Le importa el modelo, el color y la temporada. Marcas de referencia: 47 Street, Skechers, Crocs, Fila, New Balance, Topper. Ticket de $70.000 a $130.000 por par.",
      frase: "Busco una zapatilla que me sirva para entrenar y para el día a día",
      dolores: [
        "La oferta de línea mujer en su zona es siempre la misma y en pocos modelos y colores",
        "Termina comprando un modelo de hombre en talle chico porque no hay línea de mujer",
        "No encuentra 47 Street, Skechers ni Crocs cerca de su casa",
        "El par que le gusta sale entre $70.000 y $130.000 y no siempre llega de contado",
      ],
      deseos: [
        "Modelos y colores de temporada en línea de mujer, no unisex adaptado",
        "Resolver calzado e indumentaria (calza, buzo, conjunto) en un solo lugar",
        "Comprar desde el celular en 2, 3 o 6 cuotas sin interés",
        "Ver el modelo y el color real antes de decidir",
      ],
      objeciones: [
        "¿Tienen línea de mujer o son todos modelos de hombre en talle chico?",
        "No conozco la tienda online, ¿qué pasa si el talle no me queda?",
        "El color de la foto nunca es el color real",
        "¿Los precios de la web son los mismos que en la sucursal?",
      ],
      prioridad: "primario",
      recurrencia: "media",
      badge: "Compra individual",
    },
    {
      segmento: "Padre / madre de familia",
      icono: "nino",
      descripcion: "Adulto de 25 a 50 años con hijos de 3 a 12 años, en La Plata y zonas particulares de provincia de Buenos Aires. Compra para sí mismo y para sus hijos en la misma visita: renueva por crecimiento del pie, inicio de clases, deporte del club o rotura. Lleva de 2 a 4 pares por compra, con un total de $150.000 a $350.000. El crédito personal de la sucursal es lo que define si la compra se cierra hoy o se posterga.",
      frase: "Necesito equipar a mis hijos y a mí, y no llego a pagar todo de contado",
      dolores: [
        "Lleva de 2 a 4 pares por vez y el total se vuelve inmanejable ($150.000 a $350.000)",
        "A sus hijos les queda chico el calzado cada 4 a 6 meses y hay que renovar sí o sí",
        "No tiene tarjeta de crédito o el límite no le alcanza para el total de la compra",
        "Tiene que recorrer dos o tres tiendas distintas para resolver adulto y niños",
      ],
      deseos: [
        "Resolver adulto y niños en una sola compra y en un solo lugar",
        "Acceder al crédito personal sin tarjeta y sin banco para financiar el total",
        "Marcas de niño con calidad real (Addnice, Topper, Fila kids), no lo más barato",
        "Conocer precios y talles de toda la familia antes de ir al local",
      ],
      objeciones: [
        "¿El crédito personal me alcanza para varios pares o es para uno solo?",
        "¿Tengo que ir a la sucursal o puedo sacar el crédito desde la web?",
        "A mis hijos les crece el pie, no quiero gastar en algo caro que dure poco",
        "¿Tienen talles de niño y de adulto del mismo modelo?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
      badge: "Compra familiar",
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
    pauta: "USD 2,000/mes — ARS $3.080.000/mes (tarjeta del cliente en Meta): USD 200 Awareness (ARS $308.000) + USD 1,500 B2C Ventas (ARS $2.310.000: USD 500 Hombre + USD 500 Mujer + USD 500 Padres) + USD 300 Crédito Personal (ARS $462.000). Valores en pesos al dólar oficial BNA venta de $1.540 (19/10/2026), sin percepciones impositivas de la tarjeta.",
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
        icp: "Hombre joven adulto",
        piezas: [
          // --- VIDEO UGC 1: Dolor sin stock en su talle → 40+ marcas y todos los talles ---
          {
            formato: "Video UGC Vertical (9:16)",
            dolor: "Las cadenas grandes priorizan Nike, Adidas y Puma, y nunca tienen stock en su talle. Va al local, se entusiasma con un modelo y se vuelve con las manos vacías.",
            solucion: "Star Deportes tiene más de 40 marcas con stock de talles grandes en sucursal. Se prueba, se lleva el par el mismo día y lo paga en 2, 3 o 6 cuotas sin interés.",
            comunicacion: "[0-3s] HOOK — Plano cerrado de la pared de zapatillas de la sucursal, mano del protagonista pasando por los modelos y frenando en uno: '¿Fuiste a comprar zapatillas y no tenían tu talle?' [3-8s] BODY — Travelling por las góndolas mostrando cajas abiertas de Fila, New Balance, Topper, Salomon y Reebok, inserts rápidos de etiquetas de talle: 'En Star Deportes tenés más de 40 marcas y stock de talles grandes.' [8-14s] BODY — El protagonista se prueba el par sentado en el banco, se para, camina y asiente conforme mientras el empleado le trae una segunda caja: 'Te lo probás, te lo llevás hoy y lo pagás en 2, 3 o 6 cuotas sin interés.' [14-18s] CTA — Protagonista saliendo con la bolsa, fachada de la sucursal con el logo visible y badge en edición con stardeportes.com: 'Pasá por Star Deportes o entrá a stardeportes.com.' [18-22s] CIERRE — Motion graphics sobre fondo rojo con el logo Star Deportes, stardeportes.com y los badges de cuotas sin interés.",
            hook: "¿Fuiste a comprar zapatillas y no tenían tu talle?",
            body: "En Star Deportes tenés más de 40 marcas y stock de talles grandes. Te lo probás, te lo llevás hoy y lo pagás en 2, 3 o 6 cuotas sin interés.",
            cta: "Pasá por Star Deportes o entrá a stardeportes.com.",
            copyAnuncio: "¿Fuiste a comprar zapatillas y no tenían tu talle? 😤\n\n👟 Más de 40 marcas: Fila, New Balance, Topper, Salomon, Reebok y más.\n✅ Stock de talles grandes en sucursal.\n💳 2, 3 y 6 cuotas sin interés.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Mirá los modelos en stardeportes.com",
            pilar: "Producto",
            tema: "Variedad de marcas y disponibilidad de talles",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- VIDEO UGC 2 (CYBERMONDAY): Dolor viene postergando el par → ofertas de la tienda online ---
          {
            badge: "CyberMonday",
            formato: "Video UGC Vertical (9:16)",
            dolor: "El par que quiere sale entre $70.000 y $130.000 y lo viene postergando desde hace meses. Espera una fecha con descuento real y no sabe que Star Deportes participa del CyberMonday.",
            solucion: "CyberMonday en stardeportes.com del 2 al 4 de noviembre (Cyber Week hasta el 8), con las ofertas de la tienda, 2, 3 y 6 cuotas sin interés y envío gratis desde $150.000.",
            comunicacion: "[0-3s] HOOK — Protagonista en el sillón con el celular, mira el precio de una zapatilla y cierra la app con fastidio, placa de CYBERMONDAY entrando por el costado: '¿Venís bancando ese par desde hace meses?' [3-8s] BODY — Pantalla de stardeportes.com en CyberMonday, scroll por los modelos con las placas de descuento sobre cada producto (los porcentajes finales los confirma el cliente antes de producción), inserts de los logos de Fila, New Balance y Topper: 'Del 2 al 4 de noviembre es CyberMonday en stardeportes.com.' [8-14s] BODY — Close-up del carrito con dos productos cargados y el total, insert de texto con 2, 3 Y 6 CUOTAS SIN INTERÉS y ENVÍO GRATIS DESDE $150.000: 'Aprovechás las ofertas de la tienda, lo pagás en 2, 3 o 6 cuotas sin interés y con envío gratis desde $150.000.' [14-18s] CTA — Protagonista abriendo la caja en su casa y probándose las zapatillas, placa final con las fechas: 'Del 2 al 4 de noviembre en stardeportes.com. No lo dejes pasar.' [18-22s] CIERRE — Motion graphics sobre fondo rojo con el logo Star Deportes, la placa de CyberMonday y stardeportes.com.",
            hook: "¿Venís bancando ese par desde hace meses?",
            body: "Del 2 al 4 de noviembre es CyberMonday en stardeportes.com. Aprovechás las ofertas de la tienda, lo pagás en 2, 3 o 6 cuotas sin interés y con envío gratis desde $150.000.",
            cta: "Del 2 al 4 de noviembre en stardeportes.com. No lo dejes pasar.",
            copyAnuncio: "¿Venís bancando ese par desde hace meses? 👟\n\n🔥 CYBERMONDAY del 2 al 4 de noviembre en stardeportes.com\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n✅ Fila, New Balance, Topper, Salomon y más de 40 marcas.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — ofertas de la tienda online",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL 1: Dolor no sabe qué modelo elegir → catálogo por uso ---
          {
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "No sabe qué zapatilla le conviene para lo que hace. Entra a la tienda, ve cincuenta modelos parecidos y elige por precio o por color.",
            solucion: "Carrusel que ordena el catálogo por uso real (fútbol, gimnasio, running y uso diario) con 2 modelos recomendados y precio en cada slide.",
            comunicacion: "Carrusel x4 slides, uno por uso. Cada slide con 2 modelos recortados sobre fondo liso, nombre de marca y modelo, precio visible y un badge con el uso. Mantener la misma grilla y tipografía en los 4 slides para que se lea como una guía. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: FÚTBOL — 2 modelos de botín o papi (Topper, Penalty) con precio visible. Badge, Para la cancha",
              "Slide 2: GIMNASIO — 2 modelos de training (Reebok, Fila) con precio visible. Badge, Para entrenar",
              "Slide 3: RUNNING — 2 modelos de running (New Balance, Salomon) con precio visible. Badge, Para correr",
              "Slide 4: USO DIARIO — 2 modelos urbanos (Fila, Topper) con precio visible. CTA, Mirá todos los modelos en stardeportes.com",
            ],
            copyAnuncio: "¿Qué zapatilla te conviene? 🤔\n\n⚽ Fútbol: Topper, Penalty\n🏋️ Gimnasio: Reebok, Fila\n🏃 Running: New Balance, Salomon\n👟 Uso diario: Fila, Topper\n\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 Elegí la tuya en stardeportes.com",
            pilar: "Producto",
            tema: "Guía de elección por uso",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL 2 (CYBERMONDAY): Dolor no sabe qué marcas entran en la oferta → ofertas marca por marca ---
          {
            badge: "CyberMonday",
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "No encuentra Fila, New Balance, Salomon ni Topper cerca de su casa, y cuando llega una fecha de descuento no sabe qué marcas entran ni cuánto bajan de verdad.",
            solucion: "Carrusel de CyberMonday con las ofertas de la tienda marca por marca, con el precio anterior tachado y el precio CyberMonday visible en cada slide.",
            comunicacion: "Carrusel x4 slides de ofertas de CyberMonday, una marca por slide. Cada slide con la placa de CYBERMONDAY arriba, el modelo en oferta recortado al centro, el precio anterior tachado y el precio CyberMonday en tipografía grande (los porcentajes finales los confirma el cliente antes de producción). Último slide con los beneficios de la tienda y las fechas. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: FILA — modelo en oferta con el precio anterior tachado y el precio CyberMonday en grande. Placa de CYBERMONDAY arriba",
              "Slide 2: NEW BALANCE — modelo en oferta con el precio anterior tachado y el precio CyberMonday en grande",
              "Slide 3: SALOMON + TOPPER — dos modelos en oferta con precio anterior y precio CyberMonday",
              "Slide 4: BENEFICIOS — 2, 3 y 6 cuotas sin interés, envío gratis desde $150.000 y las fechas del 2 al 4 de noviembre. CTA, Comprá en stardeportes.com",
            ],
            copyAnuncio: "🔥 CYBERMONDAY en Star Deportes\n\n👟 Fila, New Balance, Salomon, Topper y más de 40 marcas en oferta.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n📅 Del 2 al 4 de noviembre. Cyber Week hasta el 8.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — ofertas por marca",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 1: Dolor no sabe que hay e-commerce → hero stardeportes.com ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "No sabe que Star Deportes vende online. Conoce las sucursales de toda la vida pero nunca entró a la web, así que si no tiene local cerca no compra.",
            solucion: "Star Deportes tiene e-commerce propio con el catálogo completo, envío a todo el país y 2, 3 y 6 cuotas sin interés.",
            comunicacion: "Flyer hero con tres modelos de zapatilla de hombre recortados en diagonal sobre fondo rojo de marca. Claim grande arriba. Franja inferior con los badges de envío y cuotas, y la URL en tipografía mono destacada. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: tres modelos de zapatilla de hombre recortados en diagonal sobre fondo rojo. Claim grande, LA TIENDA DE SIEMPRE, AHORA ONLINE",
              "Franja de badges, Envío a todo el país — 2, 3 y 6 cuotas sin interés — Más de 40 marcas",
              "CTA en tipografía mono destacada, stardeportes.com",
            ],
            copyAnuncio: "La tienda de siempre, ahora online 📱\n\n👟 Todo el catálogo de Star Deportes en tu celular.\n📦 Envío a todo el país.\n💳 2, 3 y 6 cuotas sin interés.\n\n🏪 13 años y 13 sucursales en provincia de Buenos Aires.\n\n👉 stardeportes.com",
            pilar: "Marca",
            tema: "Lanzamiento del canal online",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 2: Objeción del talle → consultá stock antes de ir ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "Duda si van a tener su talle. Del 43 para arriba se acostumbró a que no haya stock, así que ni se molesta en ir hasta el local.",
            solucion: "Consulta el modelo y el talle por WhatsApp antes de viajar. El equipo verifica stock en la sucursal más cercana y le confirma.",
            comunicacion: "Flyer de servicio con una captura simulada de conversación de WhatsApp al centro (consulta de talle y respuesta con confirmación de stock). Claim arriba, ícono de WhatsApp y CTA abajo. Sin producto protagonista para que se lea como mensaje de servicio. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual central: captura simulada de WhatsApp con la consulta de un modelo y talle, y la respuesta confirmando stock en sucursal",
              "Claim grande arriba, ANTES DE VIAJAR, PREGUNTÁ",
              "CTA abajo con ícono de WhatsApp, Consultá modelo y talle y te confirmamos stock",
            ],
            copyAnuncio: "Antes de viajar, preguntá 📲\n\n👟 Decinos el modelo y el talle que buscás.\n✅ Te confirmamos stock en la sucursal más cercana.\n🚗 No vas al local al azar.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Escribinos por WhatsApp",
            pilar: "Marca",
            tema: "Consulta de stock y talle",
            formatoNarrativo: "Producto — Servicio",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
          },
          // --- FLYER 3: Objeción originalidad → retail oficial, 13 años ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "No conoce la tienda online y desconfía del producto. En redes vio demasiadas cuentas que venden réplicas, así que asume que el precio bajo es sospechoso.",
            solucion: "Star Deportes es retail oficial de más de 40 marcas, con 13 años de trayectoria y 13 sucursales físicas donde el producto se puede ver y cambiar.",
            comunicacion: "Flyer de confianza con una grilla de logos de las marcas oficiales que trabaja Star Deportes. Claim arriba, tres pruebas en franja inferior (años, sucursales, marcas). Sin precio, la pieza vende confianza, no oferta. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual central: grilla de logos de marcas oficiales (Fila, New Balance, Topper, Salomon, Reebok, Skechers, Crocs y más)",
              "Claim grande arriba, PRODUCTO ORIGINAL DE MARCA OFICIAL",
              "Franja inferior con tres pruebas, 13 años de trayectoria — 13 sucursales físicas — Más de 40 marcas oficiales",
            ],
            copyAnuncio: "Producto original de marca oficial ✅\n\n🏪 13 años de trayectoria.\n📍 13 sucursales físicas en provincia de Buenos Aires.\n👟 Más de 40 marcas oficiales.\n\n🔄 Lo ves, te lo probás y lo cambiás en el local.\n\n👉 Mirá el catálogo en stardeportes.com",
            pilar: "Marca",
            tema: "Confianza y trayectoria",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- SHOPPING: Collection Ad calzado e indumentaria hombre ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "Quiere ver modelos, talles y precios de hombre sin navegar todo el catálogo ni salir de Instagram.",
            solucion: "Collection Ad sobre el catálogo de Tienda Nube, acotado a 12 productos de hombre y liderado por Atomik, Fila y Topper, que son las marcas con mejor rotación en esa categoría.",
            comunicacion: "Formato nativo de Meta Ads Shopping sobre el catálogo de Tienda Nube. Requiere el feed conectado y un set de productos acotado a 12 SKUs como máximo, para que la grilla no se diluya. La portada es un hero de producto; abajo la grilla dinámica con modelo, marca y precio actualizado. No requiere pieza gráfica tradicional.",
            mensajes: [
              "Set de productos: máximo 12 SKUs de hombre, liderado por Atomik, Fila y Topper. Resto del cupo con New Balance, Reebok y Salomon",
              "Portada del Collection Ad: hero con tres modelos de hombre y claim, Atomik, Fila y Topper con envío a todo el país",
              "Grilla dinámica: modelo, marca y precio actualizado desde el catálogo. Priorizar productos con stock de todos los talles",
              "CTA del anuncio, Comprar ahora, al producto específico en stardeportes.com",
            ],
            copyAnuncio: "👟 Calzado e indumentaria de hombre: Atomik, Fila, Topper y más.\n\n🛒 Modelos, talles y precios actualizados.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Catálogo dinámico hombre",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catálogo - CTA directo",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
        ],
      },
      {
        icp: "Mujer joven adulta",
        piezas: [
          // --- VIDEO UGC 1 (CYBERMONDAY): Dolor se le pasan las fechas de descuento → línea mujer en oferta online ---
          {
            badge: "CyberMonday",
            formato: "Video UGC Vertical (9:16)",
            dolor: "Guarda capturas de zapatillas que nunca compra y las fechas de descuento se le pasan, porque no sigue a la marca ni sabe que Star Deportes vende online.",
            solucion: "CyberMonday en stardeportes.com del 2 al 4 de noviembre (Cyber Week hasta el 8), con toda la línea de mujer en oferta, 2, 3 y 6 cuotas sin interés y envío gratis desde $150.000.",
            comunicacion: "[0-3s] HOOK — Protagonista scrolleando la galería del celular, se ven varias capturas guardadas de la misma zapatilla, placa de CYBERMONDAY entrando por el costado: '¿Tenés el celular lleno de capturas de zapatillas que nunca comprás?' [3-8s] BODY — Pantalla de stardeportes.com en CyberMonday, scroll por la sección de mujer con las placas de descuento sobre cada producto (los porcentajes finales los confirma el cliente antes de producción), inserts de los logos de 47 Street, Skechers y Crocs: 'Del 2 al 4 de noviembre es CyberMonday y toda la línea de mujer está en stardeportes.com.' [8-14s] BODY — Close-up del checkout con el total y el plan de cuotas, insert de texto con 2, 3 Y 6 CUOTAS SIN INTERÉS y ENVÍO GRATIS DESDE $150.000: 'Aprovechás las ofertas, lo pagás en 2, 3 o 6 cuotas sin interés y te llega a tu casa.' [14-18s] CTA — Protagonista abriendo el paquete en su casa y probándose las zapatillas frente al espejo, placa final con las fechas: 'Del 2 al 4 de noviembre en stardeportes.com.' [18-22s] CIERRE — Motion graphics sobre fondo rojo con el logo Star Deportes, la placa de CyberMonday y stardeportes.com.",
            hook: "¿Tenés el celular lleno de capturas de zapatillas que nunca comprás?",
            body: "Del 2 al 4 de noviembre es CyberMonday y toda la línea de mujer está en stardeportes.com. Aprovechás las ofertas, lo pagás en 2, 3 o 6 cuotas sin interés y te llega a tu casa.",
            cta: "Del 2 al 4 de noviembre en stardeportes.com.",
            copyAnuncio: "¿Tenés el celular lleno de capturas de zapatillas que nunca comprás? 📱\n\n🔥 CYBERMONDAY del 2 al 4 de noviembre en stardeportes.com\n👟 Toda la línea de mujer en oferta: 47 Street, Skechers, Crocs, Fila y más.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — línea mujer en oferta",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- VIDEO UGC 2: Dolor compra modelo de hombre en talle chico → línea mujer real ---
          {
            formato: "Video UGC Vertical (9:16)",
            dolor: "Termina comprando un modelo de hombre en talle chico porque donde compra no hay línea de mujer. La zapatilla le queda ancha, le molesta y no la usa.",
            solucion: "Star Deportes tiene línea de mujer real, con horma y talles de mujer, no modelos unisex adaptados. Se prueba en la sucursal y la cambia si no le queda.",
            comunicacion: "[0-3s] HOOK — Plano cerrado de los pies de la protagonista en una zapatilla visiblemente ancha, mueve el pie dentro del calzado: '¿Terminás comprando el modelo de hombre en talle chico?' [3-8s] BODY — Corte al sector de mujer de la sucursal, la empleada le trae dos cajas de línea mujer, inserts de las etiquetas de talle y horma: 'En Star Deportes tenés línea de mujer de verdad, con horma y talles de mujer.' [8-14s] BODY — La protagonista se prueba el par, camina, se para en puntas de pie y asiente conforme frente al espejo: 'Te la probás acá, caminás con ella, y si no te queda la cambiás en el local.' [14-18s] CTA — Plano de la protagonista con las zapatillas puestas saliendo del local, badge en edición con el ícono de WhatsApp: 'Consultá tu talle por WhatsApp y te lo reservamos.' [18-22s] CIERRE — Motion graphics sobre fondo rojo con el logo Star Deportes y el mapa de las 13 sucursales.",
            hook: "¿Terminás comprando el modelo de hombre en talle chico?",
            body: "En Star Deportes tenés línea de mujer de verdad, con horma y talles de mujer. Te la probás acá, caminás con ella, y si no te queda la cambiás en el local.",
            cta: "Consultá tu talle por WhatsApp y te lo reservamos.",
            copyAnuncio: "¿Terminás comprando el modelo de hombre en talle chico? 👟\n\n✅ Línea de mujer de verdad: horma y talles de mujer.\n🔄 Te la probás en el local y la cambiás si no te queda.\n💳 2, 3 y 6 cuotas sin interés.\n\n📍 13 sucursales en provincia de Buenos Aires.\n\n👉 Consultá tu talle por WhatsApp",
            pilar: "Producto",
            tema: "Línea mujer con horma propia",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "18-22s",
            enRevision: false,
          },
          // --- CARRUSEL 1: Dolor no sabe cómo combinar → look completo ---
          {
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "Compra la zapatilla sola y después no sabe con qué combinarla. Tiene que recorrer otra tienda para la calza o el buzo y nunca cierra el conjunto.",
            solucion: "Carrusel que arma tres looks completos (entrenar, caminar y uso diario) con calzado más indumentaria de Star Deportes y el precio de cada combinación.",
            comunicacion: "Carrusel x4 slides. Cada slide con un look completo en flat lay (zapatilla, prenda inferior y prenda superior) sobre fondo liso, con el precio de cada pieza al costado y el total abajo. Mantener la misma grilla en los tres looks. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: TRES LOOKS, UN SOLO LUGAR — flat lay general con los tres conjuntos. Badge, Calzado e indumentaria en Star Deportes",
              "Slide 2: LOOK ENTRENAR — zapatilla de training, calza y top con precio de cada pieza y total abajo",
              "Slide 3: LOOK CAMINAR — zapatilla de caminata, calza larga y buzo con precio de cada pieza y total abajo",
              "Slide 4: LOOK USO DIARIO — zapatilla urbana, jogger y buzo oversize con precio y total. CTA, Armá tu look en stardeportes.com",
            ],
            copyAnuncio: "Tres looks completos, un solo lugar 👟\n\n🏋️ Entrenar: zapatilla + calza + top\n🚶 Caminar: zapatilla + calza larga + buzo\n👜 Uso diario: zapatilla urbana + jogger + buzo\n\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 Armá el tuyo en stardeportes.com",
            pilar: "Producto",
            tema: "Venta cruzada calzado más indumentaria",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL 2 (CYBERMONDAY): Dolor no sabe qué entra en la oferta → ofertas de línea mujer marca por marca ---
          {
            badge: "CyberMonday",
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "No encuentra 47 Street, Skechers ni Fila cerca de su casa, y en las fechas de descuento no sabe qué modelos de mujer entran realmente en oferta.",
            solucion: "Carrusel de CyberMonday con las ofertas de línea mujer marca por marca, con el precio anterior tachado y el precio CyberMonday visible en cada slide.",
            comunicacion: "Carrusel x4 slides de ofertas de CyberMonday de línea mujer, una marca por slide. Cada slide con la placa de CYBERMONDAY arriba, el modelo en oferta recortado al centro, el precio anterior tachado y el precio CyberMonday en tipografía grande (los porcentajes finales los confirma el cliente antes de producción). Último slide con los beneficios y las fechas. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 47 STREET — modelo de mujer en oferta con el precio anterior tachado y el precio CyberMonday en grande. Placa de CYBERMONDAY arriba",
              "Slide 2: SKECHERS — modelo de mujer en oferta con el precio anterior tachado y el precio CyberMonday en grande",
              "Slide 3: CROCS + FILA — dos modelos en oferta con precio anterior y precio CyberMonday",
              "Slide 4: BENEFICIOS — 2, 3 y 6 cuotas sin interés, envío gratis desde $150.000 y las fechas del 2 al 4 de noviembre. CTA, Comprá en stardeportes.com",
            ],
            copyAnuncio: "🔥 CYBERMONDAY en línea de mujer\n\n👟 47 Street, Skechers, Fila, New Balance, Crocs y Topper en oferta.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n📅 Del 2 al 4 de noviembre. Cyber Week hasta el 8.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — ofertas de línea mujer",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 1: Dolor ticket alto → cuotas sin interés ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "El par que le gusta sale entre $70.000 y $130.000 y no siempre llega de contado. Lo guarda en favoritos y espera una promoción que no llega.",
            solucion: "En Star Deportes paga en 2, 3 o 6 cuotas sin interés, tanto en la web como en la sucursal, sin esperar una fecha especial.",
            comunicacion: "Flyer de financiación con dos modelos de mujer recortados sobre fondo rojo de marca y el precio en cuotas en tipografía grande al centro. Franja inferior con los medios de pago y la URL. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: dos modelos de mujer recortados sobre fondo rojo con el precio en cuotas en tipografía grande",
              "Claim grande arriba, LLEVATELAS HOY, PAGALAS EN CUOTAS",
              "Franja inferior, 2, 3 y 6 cuotas sin interés — En la web y en sucursal — stardeportes.com",
            ],
            copyAnuncio: "Llevatelas hoy, pagalas en cuotas 👟\n\n💳 2, 3 y 6 cuotas sin interés.\n🛒 En la web y en sucursal.\n📦 Envío a todo el país.\n\n🏪 Más de 40 marcas con línea de mujer completa.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Financiación del ticket individual",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 2: Dolor no sabe que hay e-commerce → hero online mujer ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "No sabe que Star Deportes vende online. Asocia la marca a la sucursal del centro y nunca buscó el catálogo de mujer en la web.",
            solucion: "Star Deportes tiene e-commerce propio con toda la línea de mujer, envío a todo el país y 2, 3 y 6 cuotas sin interés.",
            comunicacion: "Flyer hero con un mockup de celular mostrando el catálogo de mujer de stardeportes.com y dos modelos recortados saliendo de la pantalla. Claim arriba, franja de badges abajo. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: mockup de celular con el catálogo de mujer de stardeportes.com y dos modelos recortados saliendo de la pantalla",
              "Claim grande arriba, TODA LA LÍNEA DE MUJER EN TU CELULAR",
              "Franja de badges abajo, Envío a todo el país — 2, 3 y 6 cuotas sin interés — stardeportes.com",
            ],
            copyAnuncio: "Toda la línea de mujer en tu celular 📱\n\n👟 47 Street, Skechers, Crocs, Fila, New Balance y más.\n📦 Envío a todo el país.\n💳 2, 3 y 6 cuotas sin interés.\n\n🏪 13 años y 13 sucursales en provincia de Buenos Aires.\n\n👉 stardeportes.com",
            pilar: "Marca",
            tema: "Lanzamiento del canal online",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 3: Objeción color y talle → cambios en sucursal ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "No compra online porque el color de la foto nunca es el color real y no sabe qué pasa si el talle no le queda.",
            solucion: "Compra online y cambia en cualquiera de las 13 sucursales, o consulta color y talle por WhatsApp antes de comprar.",
            comunicacion: "Flyer de servicio con el mismo modelo mostrado en tres colores reales en fila, fotografiado con luz neutra. Claim arriba y las dos garantías en franja inferior. Sin precio, la pieza resuelve objeción. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual central: el mismo modelo en tres colores reales en fila, fotografiado con luz neutra para que el color se lea tal cual es",
              "Claim grande arriba, COMPRÁ ONLINE, CAMBIÁ EN EL LOCAL",
              "Franja inferior con las dos garantías, Cambios en cualquiera de las 13 sucursales — Consultá color y talle por WhatsApp",
            ],
            copyAnuncio: "Comprá online, cambiá en el local 🔄\n\n🎨 Los colores, tal cual son.\n📍 Cambios en cualquiera de las 13 sucursales.\n📲 Consultá color y talle por WhatsApp antes de comprar.\n\n💳 2, 3 y 6 cuotas sin interés.\n\n👉 stardeportes.com",
            pilar: "Marca",
            tema: "Cambios y consulta previa",
            formatoNarrativo: "Producto — Servicio",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- SHOPPING: Collection Ad calzado e indumentaria mujer ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "Quiere ver la línea de mujer con modelos, talles y precios sin navegar todo el catálogo ni salir de Instagram.",
            solucion: "Collection Ad sobre el catálogo de Tienda Nube, acotado a 12 productos de mujer, con 47 Street, Skechers y Fila como primarias y New Balance, Crocs y Topper como secundarias.",
            comunicacion: "Formato nativo de Meta Ads Shopping sobre el catálogo de Tienda Nube. Requiere el feed conectado y un set de productos acotado a 12 SKUs como máximo, para que la grilla no se diluya. La portada es un hero de producto; abajo la grilla dinámica con modelo, marca y precio actualizado. No requiere pieza gráfica tradicional.",
            mensajes: [
              "Set de productos: máximo 12 SKUs de mujer. Primarias, 47 Street, Skechers y Fila. Secundarias, New Balance, Crocs y Topper",
              "Portada del Collection Ad: hero con tres modelos de mujer y claim, 47 Street, Skechers y Fila con envío a todo el país",
              "Grilla dinámica: modelo, marca y precio actualizado desde el catálogo. Priorizar productos con stock de todos los talles",
              "CTA del anuncio, Comprar ahora, al producto específico en stardeportes.com",
            ],
            copyAnuncio: "👟 Línea mujer: 47 Street, Skechers, Fila, New Balance, Crocs y Topper.\n\n🛒 Modelos, talles y precios actualizados.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Catálogo dinámico mujer",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catálogo - CTA directo",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
        ],
      },
      {
        icp: "Padre / madre de familia",
        piezas: [
          // --- VIDEO UGC 1: Dolor total inmanejable → combo familiar ---
          {
            formato: "Video UGC Vertical (9:16)",
            dolor: "Tiene que renovar el calzado de los tres de la familia en la misma salida y comprar par por par le sale una fortuna.",
            solucion: "Combo familiar: dos o tres pares juntos a mejor precio que comprados por separado, con todos los talles disponibles online.",
            comunicacion: "[0-3s] HOOK — Madre filma en selfie en la puerta de casa con tres pares gastados en la mano, luz natural, tono espontáneo: '¿A los tres les quedó chico el mismo mes?' [3-9s] BODY — Corte a la tienda online en el celular, scroll por calzado de niño y de adulto, se arman tres pares en el carrito: 'En stardeportes.com armás el combo familiar y te sale menos que comprando par por par.' [9-15s] BODY — Insert del carrito con el total y el ahorro del combo marcado en pantalla: 'Dos o tres pares juntos, con todos los talles y las marcas de siempre.' [15-20s] CTA — Los tres estrenando en la vereda, la madre mira a cámara: 'Entrá a stardeportes.com y armá el combo de tu familia.' [20-22s] CIERRE — Motion graphics sobre fondo rojo. Logo Star Deportes y stardeportes.com.",
            hook: "¿A los tres les quedó chico el mismo mes?",
            body: "En stardeportes.com armás el combo familiar y te sale menos que comprando par por par. Dos o tres pares juntos, con todos los talles y las marcas de siempre.",
            cta: "Entrá a stardeportes.com y armá el combo de tu familia.",
            copyAnuncio: "¿A los tres les quedó chico el mismo mes? 👟\n\n✅ Combo familiar: 2 o 3 pares juntos a mejor precio que par por par.\n✅ Todos los talles, de niño y de adulto.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Combo familiar de calzado",
            formatoNarrativo: "UGC — Testimonial a cámara",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Casual", estilo: "UGC" },
            duracion: "20-22s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- VIDEO UGC 2 (CYBERMONDAY): Dolor la renovación cae en el peor momento → equipar a los chicos en la oferta online ---
          {
            badge: "CyberMonday",
            formato: "Video UGC Vertical (9:16)",
            dolor: "A sus hijos les queda chico el calzado y la renovación cae siempre en el peor momento del mes. Cuando llega una fecha de descuento ya gastó la plata en otra cosa.",
            solucion: "CyberMonday en stardeportes.com del 2 al 4 de noviembre (Cyber Week hasta el 8), para equipar a los chicos y a los grandes de una sola vez, en 2, 3 y 6 cuotas sin interés y con envío gratis desde $150.000.",
            comunicacion: "[0-3s] HOOK — Plano cerrado de un pie de niño que no entra en la zapatilla, la madre deja de forzarla y agarra el celular, placa de CYBERMONDAY entrando por el costado: '¿Le quedó chico justo ahora?' [3-8s] BODY — Pantalla de stardeportes.com en CyberMonday, scroll por el sector de niños y después por el de adulto con las placas de descuento sobre cada producto (los porcentajes finales los confirma el cliente antes de producción): 'Del 2 al 4 de noviembre es CyberMonday en stardeportes.com.' [8-15s] BODY — Carrito en pantalla con tres pares cargados y el total, insert de texto con 2, 3 Y 6 CUOTAS SIN INTERÉS y ENVÍO GRATIS DESDE $150.000: 'Equipás a los chicos y al grande de una sola vez, en 2, 3 o 6 cuotas sin interés y con envío gratis desde $150.000.' [15-19s] CTA — Los chicos abriendo las cajas en casa y estrenando las zapatillas, placa final con las fechas: 'Del 2 al 4 de noviembre en stardeportes.com.' [19-23s] CIERRE — Motion graphics sobre fondo rojo con el logo Star Deportes, la placa de CyberMonday y stardeportes.com.",
            hook: "¿Le quedó chico justo ahora?",
            body: "Del 2 al 4 de noviembre es CyberMonday en stardeportes.com. Equipás a los chicos y al grande de una sola vez, en 2, 3 o 6 cuotas sin interés y con envío gratis desde $150.000.",
            cta: "Del 2 al 4 de noviembre en stardeportes.com.",
            copyAnuncio: "¿Le quedó chico justo ahora? 👟\n\n🔥 CYBERMONDAY del 2 al 4 de noviembre en stardeportes.com\n👨‍👩‍👧‍👦 Equipá a los chicos y a los grandes de una sola vez.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — compra familiar online",
            formatoNarrativo: "Direct to Camera — Situacional",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "19-23s",
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL 1: Dolor recorrer 2-3 tiendas → adulto y niños en un lugar ---
          {
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "Tiene que recorrer dos o tres tiendas distintas para resolver adulto y niños. Pierde la tarde, compara precios de a pedazos y termina comprando a medias.",
            solucion: "Carrusel que muestra que en Star Deportes se resuelve papá, mamá y niños en una sola compra, con modelos y precio por integrante y el total abajo.",
            comunicacion: "Carrusel x4 slides, uno por integrante de la familia más un cierre con el total. Cada slide con 2 modelos recortados sobre fondo liso, marca y precio visible. Slide final con la suma de la compra familiar y el badge de cuotas sin interés. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: PAPÁ — 2 modelos de hombre (Fila, Topper) con marca y precio visible. Badge, Todo en Star Deportes",
              "Slide 2: MAMÁ — 2 modelos de mujer (47 Street, Skechers) con marca y precio visible",
              "Slide 3: NIÑOS — 2 modelos infantiles (Addnice, Topper kids) con marca y precio visible",
              "Slide 4: UNA SOLA COMPRA — suma de la compra familiar en tipografía grande, badge con 2, 3 y 6 cuotas sin interés, y CTA, Comprá en stardeportes.com o comprá en stardeportes.com",
            ],
            copyAnuncio: "Papá, mamá y los chicos. Una sola compra 👨‍👩‍👧‍👦\n\n👟 Papá: Fila, Topper\n👠 Mamá: 47 Street, Skechers\n🧒 Niños: Addnice, Topper kids\n\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país o retirá en el local.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Compra familiar completa",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- CARRUSEL 2 (CYBERMONDAY): Objeción gastar caro en algo que dura poco → packs familiares en oferta ---
          {
            badge: "CyberMonday",
            formato: "Carrusel (1080x1080, 3-4 slides)",
            dolor: "No quiere gastar caro en calzado de niño que le va a quedar chico, así que espera una oferta real. Pero cuando llega no sabe qué conviene comprar junto ni cuánto ahorra de verdad.",
            solucion: "Carrusel de CyberMonday con el calzado infantil y de adulto en oferta, y el ahorro total de resolver la compra familiar en una sola operación, con precio anterior y precio CyberMonday.",
            comunicacion: "Carrusel x4 slides de ofertas de CyberMonday para la familia. Los dos primeros muestran el calzado en oferta (niños y adulto) con el precio anterior tachado y el precio CyberMonday en grande, el tercero el ahorro de resolver toda la familia junta y el cuarto los beneficios de la tienda (los porcentajes finales los confirma el cliente antes de producción). Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: NIÑOS EN OFERTA — 3 modelos de Addnice, Topper kids y Fila kids con el precio anterior tachado y el precio CyberMonday en grande. Placa de CYBERMONDAY arriba",
              "Slide 2: ADULTO EN OFERTA — 2 modelos de hombre y 2 de mujer con el precio anterior tachado y el precio CyberMonday",
              "Slide 3: TODA LA FAMILIA JUNTA — flat lay con tres pares y el ahorro total marcado en grande sobre el precio de lista",
              "Slide 4: BENEFICIOS — 2, 3 y 6 cuotas sin interés, envío gratis desde $150.000 y las fechas del 2 al 4 de noviembre. CTA, Comprá en stardeportes.com",
            ],
            copyAnuncio: "🔥 CYBERMONDAY para toda la familia\n\n🧒 Calzado infantil en oferta: Addnice, Topper kids y Fila kids.\n👟 Adulto en oferta: hombre y mujer.\n👨‍👩‍👧 Resolvé a los chicos y a los grandes de una sola vez.\n\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío gratis desde $150.000.\n📅 Del 2 al 4 de noviembre. Cyber Week hasta el 8.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "CyberMonday — calzado familiar en oferta",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 1: Dolor sin tarjeta o límite insuficiente → los dos cupos ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "El total de la compra familiar le entra justo y no sabe en cuántas cuotas puede pagarlo ni con qué tarjeta.",
            solucion: "2, 3 y 6 cuotas sin interés con las tarjetas de siempre, publicado antes de que pregunte.",
            comunicacion: "Flyer cuadrado sobre fondo rojo con líneas radiales. Logo arriba, claim grande en el centro y debajo una fila con los logos de los medios de pago aceptados. Franja inferior con el dominio. Adaptar a Historia (1080x1920) estirando el fondo y apilando los logos en dos filas.",
            mensajes: [
              "Visual: fondo rojo con líneas radiales. Logo arriba y claim grande, 2, 3 Y 6 CUOTAS SIN INTERÉS",
              "Copy: fila con los logos de los medios de pago aceptados, tarjetas de crédito y débito",
              "Copy: línea de refuerzo debajo, Todos los talles y envío a todo el país",
              "Badge + CTA: franja inferior con 'Comprá en stardeportes.com'",
            ],
            copyAnuncio: "2, 3 y 6 cuotas sin interés 💳\n\n✅ Con las tarjetas de siempre.\n✅ Calzado e indumentaria para toda la familia.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Cuotas sin interés y medios de pago",
            formatoNarrativo: "Informativo — Placa de oferta",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Directo", estilo: "Flat" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 2: Objecion de presupuesto para varios pares → combo familiar ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "A los chicos les queda chico el calzado cada cuatro o seis meses y cada renovación lo agarra desprevenido.",
            solucion: "Combo de temporada con calzado de niño por talle, para resolver la renovación completa de una sola vez.",
            comunicacion: "Flyer cuadrado con tres pares de calzado de niño alineados de menor a mayor talle sobre fondo limpio. Claim grande arriba. Debajo, una línea con el rango de talles disponibles. Franja inferior con el dominio. Adaptar a Historia (1080x1920) dejando los pares en vertical.",
            mensajes: [
              "Visual: tres pares de calzado de niño alineados de menor a mayor talle. Claim grande, LES QUEDA CHICO CADA SEIS MESES",
              "Copy: línea con el rango de talles disponibles y las marcas de niño, Addnice, Umbro y Topper",
              "Copy: refuerzo del combo de temporada, Llevá dos o tres pares juntos y pagá menos que por separado",
              "Badge + CTA: franja inferior con 'Comprá en stardeportes.com'",
            ],
            copyAnuncio: "Les queda chico cada seis meses 👟\n\n✅ Combo de temporada: 2 o 3 pares juntos a mejor precio.\n✅ Addnice, Umbro, Topper y más, en todos los talles de niño.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Renovación por crecimiento",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Directo", estilo: "Flat" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- FLYER 3: Dolor renovación obligada por colegio y club → equipamiento de temporada ---
          {
            formato: "Posteo Cuadrado (1080x1080) + Historia (1080x1920)",
            dolor: "La renovación le cae encima por el colegio y por el deporte del club. Tiene que comprar calzado y conjunto para cada hijo en la misma quincena.",
            solucion: "Kit de equipamiento por hijo (calzado más conjunto deportivo) con todo en el mismo lugar, financiado en 2, 3 y 6 cuotas sin interés.",
            comunicacion: "Flyer de temporada con un flat lay de equipamiento completo por niño (zapatilla, conjunto y mochila) sobre fondo liso, con los ítems etiquetados. Claim arriba y la financiación en la franja inferior. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual central: flat lay de equipamiento completo por niño (zapatilla, conjunto deportivo y mochila) con cada ítem etiquetado",
              "Claro grande arriba, EQUIPÁ A CADA CHICO DE UNA VEZ",
              "Franja inferior, Calzado más conjunto en el mismo lugar — 2, 3 y 6 cuotas sin interés — stardeportes.com",
            ],
            copyAnuncio: "Equipá a cada chico de una vez 🎒\n\n👟 Calzado deportivo\n👕 Conjunto (remera o buzo + pantalón o calza)\n🎒 Mochila\n\n✅ Todo en el mismo lugar, para el colegio y para el club.\n💳 2, 3 y 6 cuotas sin interés.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Equipamiento escolar y deportivo",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://stardeportes.com/"],
          },
          // --- SHOPPING: Collection Ad kids más adulto ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "Necesita ver calzado de niño por talle y precio sin recorrer todo el catálogo ni ir al local a preguntar.",
            solucion: "Collection Ad sobre el catálogo de Tienda Nube, acotado a 12 productos de niño y liderado por Addnice y Umbro, que son las marcas de la categoría.",
            comunicacion: "Formato nativo de Meta Ads Shopping sobre el catálogo de Tienda Nube. Requiere el feed conectado y un set de productos acotado a 12 SKUs como máximo, para que la grilla no se diluya. La portada es un hero de producto; abajo la grilla dinámica con modelo, marca y precio actualizado. No requiere pieza gráfica tradicional.",
            mensajes: [
              "Set de productos: máximo 12 SKUs de niño, liderado por Addnice y Umbro. Resto del cupo con Topper y Fila kids",
              "Portada del Collection Ad: hero con calzado de niño por talle y claim, Addnice y Umbro para toda la familia",
              "Grilla dinámica: modelo, marca y precio actualizado desde el catálogo. Priorizar productos con stock de todos los talles",
              "CTA del anuncio, Comprar ahora, al producto específico en stardeportes.com",
            ],
            copyAnuncio: "👟 Calzado de niño: Addnice, Umbro, Topper y más.\n\n🛒 Todos los talles, precios actualizados.\n💳 2, 3 y 6 cuotas sin interés.\n📦 Envío a todo el país.\n\n👉 stardeportes.com",
            pilar: "Producto",
            tema: "Catálogo dinámico familiar",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catálogo - CTA directo",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
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
      "ree_stardeportes_meta_conversion_padres",
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
            "Agregar una placa de cierre animada de 3-4s, la misma para las piezas 1 y 2.",
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
            "Agregar la misma placa de cierre animada de 3-4s.",
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
          formato: "Posteo Cuadrado (1080x1080)",
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
          formato: "Posteo Cuadrado (1080x1080)",
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
            "Reel_OutfitsPromos_V1 | https://www.instagram.com/p/DdHNbdrRli0/",
          ],
        },
      ],
    },
    {
      nombre: "StarDeportes_Ventas_B2C",
      objetivo: "Ventas",
      descripcionCampana: "Generar conversiones directas en stardeportes.com. Tres conjuntos de anuncios segmentados por género y por rol de compra, no por categoría de producto, porque el creativo le habla a una persona y no a un rubro. Hombre joven adulto, mujer joven adulta y padre o madre de familia que compra para sí y para sus hijos de 3 a 12 años. Cada conjunto lleva sus 8 piezas exclusivas (2 video UGC, 2 carruseles, 3 flyers y 1 Meta Ads Shopping con productos específicos del género), o sea 24 piezas nuevas producidas por el equipo de branding de Star Deportes. Se lanzan los tres en simultáneo en S4 (26/10) para leer cuál perfil convierte mejor y redistribuir presupuesto hacia el ganador antes de Black Friday (S8). Meta Pixel y Shopping conectados para atribución end-to-end.",
      status: "en-desarrollo",
      tituloSeccion: "Campaña B2C (E-commerce)",
      tituloSubseccion: "Campaña B2C en Meta Ads",
      destino: "stardeportes.com",
      kpisCampana: ["Visitas a página de producto", "AddToCart", "Compras", "ROAS"],
      conversionCampana: "Compras en Tienda Nube",
      presupuestoCampana: { diario: "USD $50/día (ARS $77.000)", mensual: "USD $1,500/mes (ARS $2.310.000)" },
      conSubsecciones: true,
      adSets: [
        {
          nombre: "Conjunto_Hombre_25_50",
          segmentacion: "Hombres de 25 a 50 años, una sola audiencia que cubre los tres anillos | Anillo 1, donde hay sucursal: La Plata, Ensenada, Berisso, Los Hornos, Lisandro Olmos, Villa Elisa, San Vicente, Coronel Brandsen, Magdalena y Saladillo | Anillo 2, aledañas a los locales: Guernica, Glew, Alejandro Korn, Burzaco y Malvinas Argentinas | Anillo 3, Zona Oeste sin presencia física: Merlo, Morón, Castelar, Ituzaingó y San Justo. Intereses: Fútbol, Running, Gimnasio y fitness, Zapatillas deportivas, Indumentaria deportiva, Fila, New Balance, Topper, Reebok, Salomon. Presupuesto: ~USD $500/mes (ARS $770.000)",
          ads: [
            "Video UGC 1 | Dolor: no hay stock en su talle → 40+ marcas con talles grandes",
            "Video UGC 2 (CYBERMONDAY) | Dolor: viene postergando el par → ofertas de la tienda, cuotas sin interés y envío gratis",
            "Carrusel 1 | Guía de elección por uso: fútbol, gimnasio, running y uso diario",
            "Carrusel 2 (CYBERMONDAY) | Ofertas marca por marca con precio anterior y precio CyberMonday: Fila, New Balance, Salomon, Topper",
            "Flyer 1 | La tienda de siempre, ahora online — hero stardeportes.com",
            "Flyer 2 | Antes de viajar, preguntá — consulta de stock y talle por WhatsApp",
            "Flyer 3 | Producto original de marca oficial — 13 años, 13 sucursales, 40+ marcas",
            "Shopping | Collection Ad — catálogo dinámico de calzado e indumentaria de hombre",
          ],
        },
        {
          nombre: "Conjunto_Mujer_25_50",
          segmentacion: "Mujeres de 25 a 50 años, una sola audiencia que cubre los tres anillos | Anillo 1, donde hay sucursal: La Plata, Ensenada, Berisso, Los Hornos, Lisandro Olmos, Villa Elisa, San Vicente, Coronel Brandsen, Magdalena y Saladillo | Anillo 2, aledañas a los locales: Guernica, Glew, Alejandro Korn, Burzaco y Malvinas Argentinas | Anillo 3, Zona Oeste sin presencia física: Merlo, Morón, Castelar, Ituzaingó y San Justo. Intereses: Gimnasio y fitness, Pilates, Yoga, Running, Caminata, Moda deportiva, 47 Street, Skechers, Crocs, Fila, New Balance. Presupuesto: ~USD $500/mes (ARS $770.000)",
          ads: [
            "Video UGC 1 (CYBERMONDAY) | Dolor: se le pasan las fechas de descuento → línea mujer en oferta online",
            "Video UGC 2 | Dolor: compra modelo de hombre en talle chico → línea mujer con horma propia",
            "Carrusel 1 | Tres looks completos: calzado + indumentaria para entrenar, caminar y uso diario",
            "Carrusel 2 (CYBERMONDAY) | Ofertas de línea mujer marca por marca: 47 Street, Skechers, Crocs, Fila",
            "Flyer 1 | Llevatelas hoy, pagalas en cuotas — 2, 3 y 6 cuotas sin interés",
            "Flyer 2 | Toda la línea de mujer en tu celular — hero stardeportes.com",
            "Flyer 3 | Comprá online, cambiá en el local — color real, talle y cambios en sucursal",
            "Shopping | Collection Ad — catálogo dinámico de calzado e indumentaria de mujer",
          ],
        },
        {
          nombre: "Conjunto_Padres_Hijos_3_12",
          segmentacion: "Todos los géneros, 25 a 50 años, una sola audiencia que cubre los tres anillos | Anillo 1, donde hay sucursal: La Plata, Ensenada, Berisso, Los Hornos, Lisandro Olmos, Villa Elisa, San Vicente, Coronel Brandsen, Magdalena y Saladillo | Anillo 2, aledañas a los locales: Guernica, Glew, Alejandro Korn, Burzaco y Malvinas Argentinas | Anillo 3, Zona Oeste sin presencia física: Merlo, Morón, Castelar, Ituzaingó y San Justo. Intereses de Meta por edad de los hijos: Padres con hijos en edad preescolar (3-5 años), Padres con hijos en edad escolar temprana (6-8 años), Padres con preadolescentes (9-12 años). Sumar: Deporte infantil, Vuelta al colegio, Familia, Crianza, Addnice, Topper. Presupuesto: ~USD $500/mes (ARS $770.000)",
          ads: [
            "Video UGC 1 | Dolor: el total de la compra familiar es $150k-350k → crédito personal con DNI",
            "Video UGC 2 (CYBERMONDAY) | Dolor: la renovación cae en el peor momento → equipar a chicos y grandes en la oferta online",
            "Carrusel 1 | Papá, mamá y los chicos: una sola compra con precio por integrante y total",
            "Carrusel 2 (CYBERMONDAY) | Calzado de niños y de adulto en oferta + ahorro de la compra familiar junta",
            "Flyer 1 | Crédito personal sin tarjeta y sin banco — los dos cupos ($500k / $450k)",
            "Flyer 2 | Un crédito, toda la familia — qué entra en el cupo de $500.000",
            "Flyer 3 | Equipá a cada chico de una vez — calzado + conjunto + mochila",
            "Shopping | Collection Ad — catálogo dinámico de niños más bestsellers de adulto",
          ],
        },
      ],
    },
    {
      nombre: "StarDeportes_CreditoPersonal",
      objetivo: "Mensajes",
      descripcionCampana: "Comunicar el diferencial que ningún competidor tiene: crédito propio de Star Deportes, sin tarjeta y sin banco, que se saca en la sucursal con el DNI. Dos cupos según la documentación que presente, $500.000 con recibo de sueldo y $450.000 solo con DNI. El crédito es exclusivamente presencial y válido para productos de las sucursales, así que la campaña va estrictamente geolocalizada al radio de cada local y el cierre de todas las piezas es el mismo, escribinos por WhatsApp y te decimos si podés acceder.",
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
            "Agregar la placa de cierre de la campaña: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: "https://www.instagram.com/p/Dd4K0XhuVYh/",
          titulo: "Estilos hay muchos, créditos como los nuestros no",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Recortar el video hasta la toma en la que los dos muestran su outfit. Tiene que quedar dinámico y corto.",
            "Agregar la placa de cierre de la campaña: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: "https://www.instagram.com/p/DdUB8IDR6Um/",
          titulo: "Crédito personal — cupos y financiación",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Cambio mínimo: debajo del headline va un botón de CONSULTANOS POR WHATSAPP. Aparte, y sin relación con ese botón, el logo de Star Deportes va en la parte inferior del video, fijo durante toda la pieza. El resto se pauta tal cual está.",
          ],
        },
        {
          url: "https://www.instagram.com/p/Dcgi_uauFe3/",
          titulo: "Crédito personal para regalos",
          formato: "Reel 9:16",
          estado: "Requiere edición",
          edicion: [
            "Agregar la placa de cierre de la campaña: logo de Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos ($450.000 sólo con DNI y $500.000 con DNI más recibo) y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          ],
        },
        {
          url: assetDataUri("ref-credito-historia-montos.jpg"),
          tipo: "image",
          titulo: "Historia — montos por documentación ($500.000 con recibo / $450.000 solo DNI)",
          formato: "Historia 1080x1920",
          estado: "Requiere edición",
          edicion: [
            "Reemplazar el CTA de abajo, RESPONDÉ ESTA HISTORIA, que es orgánico y no existe en pauta, por CONSULTANOS POR WHATSAPP con el ícono.",
            "Es el único cambio de contenido: el resto de la placa, los dos montos con su requisito y la aclaración de que es válido para productos de nuestras sucursales, se pauta tal cual está.",
            "Entregar la misma pieza en posteo 1080x1080 además de la historia 1080x1920, para que pueda correr en feed.",
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
            "Reel_CreditoPersonal_V3 | https://www.instagram.com/p/DdUB8IDR6Um/",
            "Reel_CreditoPersonal_V4 | https://www.instagram.com/p/Dcgi_uauFe3/",
            "Historia_CreditoMontos_V1",
            "VideoUGC_CreditoPropio_V1",
            "Posteo_LlevateloAhora_V1",
            "Posteo_CompraFamiliar_V1",
          ],
        },
      ],
      notaCampana: "El crédito personal es el diferencial #1 de Star Deportes frente a Mateu, Open Sports y Solo Deportes. Ningún competidor ofrece financiación directa sin tarjeta. Como el crédito solo se otorga en el local, la campaña se pauta estrictamente dentro del radio de cada sucursal: un lead fuera de ese radio no se puede atender y ensucia el CPL.",
      piezas: [
        {
          formato: "Video UGC Vertical (9:16)",
          dolor: "Necesita renovar calzado e indumentaria deportiva, el ticket es alto y no tiene tarjeta de crédito, así que posterga la compra o la hace de a poco.",
          solucion: "Crédito propio de Star Deportes: se saca en la sucursal con el DNI, sin tarjeta y sin banco, se aprueba en el momento y se usa el mismo día.",
          comunicacion: "[0-3s] HOOK — Vendedora filma en selfie en la puerta de la sucursal, cámara en mano, luz natural, tono espontáneo: '¿Querés renovar tu placard o el de tu familia?' [3-8s] BODY — Camina hacia adentro mostrando la pared de calzado y las góndolas llenas: 'En Star Deportes el crédito te lo damos nosotros, no es un banco ni una tarjeta.' [8-14s] BODY — Plano del mostrador, una clienta entrega el DNI, insert de la placa con los dos montos: 'Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento, y si traés recibo de sueldo el cupo te sube a $500.000.' [14-19s] BODY — Recorre la góndola junto a la clienta eligiendo unas zapatillas y un conjunto, close-ups de los productos: 'Lo usás ahí mismo para llevarte lo que quieras de la sucursal.' [19-23s] CTA — La clienta sale con la bolsa, la vendedora mira a cámara y sonríe, badge en edición con el ícono de WhatsApp: 'Escribinos por WhatsApp que te contamos más.' [23-25s] CIERRE — Placa de cierre de la campaña en motion graphics sobre fondo rojo. Logo Star Deportes, el título CRÉDITOS PERSONALES CON TU DNI, los dos cupos y un botón verde con el logo de WhatsApp que diga CONSULTANOS POR WHATSAPP.",
          hook: "¿Querés renovar tu placard o el de tu familia?",
          body: "En Star Deportes el crédito te lo damos nosotros, no es un banco ni una tarjeta. Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento, y si traés recibo de sueldo el cupo te sube a $500.000. Lo usás ahí mismo para llevarte lo que quieras de la sucursal.",
          cta: "Escribinos por WhatsApp que te contamos más.",
          copyAnuncio: "¿Querés renovar tu placard o el de tu familia? 👟\n\n✅ El crédito te lo damos nosotros, sin tarjeta y sin banco.\n✅ Venís con tu DNI a la sucursal más cercana y te damos de alta en el momento.\n✅ $500.000 con DNI + recibo de sueldo.\n✅ $450.000 sólo con tu DNI.\n\n📍 Válido para productos de nuestras sucursales.\n\n👉 Escribinos por WhatsApp que te contamos más",
          pilar: "Producto",
          tema: "Crédito propio sin tarjeta ni banco",
          formatoNarrativo: "UGC — Vendedora a cámara",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Casual", estilo: "UGC" },
          duracion: "23-25s",
          enRevision: false,
        },
        {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "Necesita el calzado o la indumentaria ahora, se le rompieron las zapatillas o arranca el torneo, pero cobra a fin de mes y hoy no tiene con qué pagarlo.",
            solucion: "Con DNI y recibo de sueldo se lleva el producto en el momento y la primera cuota recién la paga a los 30 días. Se lo lleva hoy y no desembolsa nada hasta cobrar.",
            comunicacion: "Flyer vertical sobre fondo rojo con líneas radiales, en la misma línea gráfica de las historias de crédito que la marca ya viene usando. Logo de Star Deportes arriba de todo, debajo el claim grande y debajo un subtítulo chico con la condición, todo centrado. Dos bloques de monto apilados, el de $500.000 en negro y el de $450.000 en rojo, cada uno con su requisito en una línea chica encima. Franja inferior blanca con la aclaración de sucursales y el CTA de WhatsApp. Adaptar a Story (1080x1920) estirando el fondo y dejando los dos bloques centrados.",
            mensajes: [
              "Visual: fondo rojo con líneas radiales. Logo de Star Deportes arriba de todo y, debajo, el claim grande LLEVATELO AHORA, PAGALO A FIN DE MES. Todo alineado al centro.",
              "Copy: justo debajo del claim, un subtítulo chico que diga CON DNI + RECIBO DE SUELDO",
              "Copy: dos bloques de monto — '$500.000 con DNI + recibo de sueldo' y '$450.000 sólo con tu DNI'",
              "Badge + CTA: franja inferior con 'Válido para productos de nuestras sucursales' y 'Escribinos por WhatsApp y consultá tu cupo'",
            ],
            copyAnuncio: "Llevátelo ahora, pagalo a fin de mes 💳\n\n✅ Con DNI + recibo de sueldo: hasta $500.000 y la primera cuota recién a los 30 días.\n✅ Sólo con tu DNI: $450.000, primera cuota en el momento.\n✅ Te lo aprobamos en la sucursal, al toque.\n\n📍 Válido para productos de nuestras sucursales.\n\n👉 Escribinos por WhatsApp y consultá tu cupo",
            pilar: "Producto",
            tema: "Llevátelo ahora, pagalo a fin de mes",
            formatoNarrativo: "Informativo — Placa de oferta",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
          },
        {
          formato: "Posteo Cuadrado (1080x1080)",
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

  cambiosEcommerce: [
    { cambio: "Verificar si el Meta Pixel está realmente instalado en stardeportes.com", objetivo: "Es el único punto crítico por ahora: la cuenta no registra eventos, así que no sabemos si el Pixel no está instalado o si está instalado pero sin disparar. Revisar con Meta Pixel Helper y Events Manager antes de tocar cualquier otra cosa. Sin eventos no hay retargeting, ni atribución de ventas, ni Shopping" },
    { cambio: "Ir trabajando las piezas del banner de CyberMonday en el e-commerce, con las promociones correspondientes", objetivo: "Que el usuario que llega desde el anuncio encuentre la misma promo en la home. Si el anuncio dice CyberMonday y la tienda no lo muestra, se cae la conversión. Las piezas se preparan antes del 2/11." },
  ],

  competenciaAds: {
    marca: "Dexter / Open Sports / Mateu Sports / Solo Deportes",
    cuenta: "dexterarg / opensportsarg / mateusports / solodeportes",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=deportes",
    formatos: [
      { id: "f01", tipo: "Carrusel", dolor: "No sabe qué zapatilla elegir entre tantas marcas y modelos" },
      { id: "f02", tipo: "Shopping / Catálogo", dolor: "Quiere ver precios y comprar sin salir de Instagram" },
      { id: "f03", tipo: "Video UGC", dolor: "Busca inspiración para su próxima compra deportiva" },
      { id: "f04", tipo: "Imagen estática", dolor: "Quiere saber si tiene el producto en su talle y precio" },
    ],
    competidores: [
      { nombre: "Dexter", estado: "74 anuncios activos — catálogo segmentado por talle (38 al 45), 6 cuotas y promo Naranja los lunes y martes", activo: true, instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&search_type=page&view_all_page_id=165485560463142", avatarFile: assetDataUri("dexter-icon.jpg") },
      { nombre: "Open Sports", estado: "51 anuncios activos — 12 cuotas con Mercado Pago, 1er cambio gratis y pauta geolocalizada a sus 3 sucursales de La Plata", activo: true, instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&search_type=page&view_all_page_id=121160444636581", avatarFile: assetDataUri("opensports-icon.jpg") },
      { nombre: "Mateu Sports", estado: "37 anuncios activos — hasta 50% OFF permanente, cupón de $10.000 y la camiseta oficial de Estudiantes", activo: true, instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&search_type=page&view_all_page_id=275097215864333", avatarFile: assetDataUri("mateu-icon.jpg") },
      { nombre: "Solo Deportes", estado: "34 anuncios activos — catálogo producto a producto, 3 cuotas y creativos que rotan cada pocas horas", activo: true, instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&search_type=page&view_all_page_id=121811267897708", avatarFile: assetDataUri("solodeportes-icon.png") },
    ],
    referenciasFlyers: [
      { url: assetDataUri("comp-dexter-01.jpg"), tipo: "image", grupo: "Flyers", titulo: "Dexter — calza adidas $55.299, 6 cuotas de $9.217 + 20% de reintegro Galicia los jueves y viernes" },
      { url: assetDataUri("comp-dexter-02.jpg"), tipo: "image", grupo: "Flyers", titulo: "Dexter — promo NaranjaX, lunes y martes 20% OFF con tope de $30.000 y 9 cuotas sin interés. La pieza no muestra ningún producto" },
      { url: assetDataUri("comp-dexter-03.jpg"), tipo: "image", grupo: "Flyers", titulo: "Dexter — RENOVÁ TU EQUIPO, lifestyle con 6 cuotas sin interés y envío gratis desde $159.999" },
      { url: assetDataUri("comp-dexter-04.jpg"), tipo: "image", grupo: "Flyers", titulo: "Dexter — promo BBVA, martes 20% de reintegro con tope de $50.000 y 9 cuotas sin interés en compras desde $250.000, pagando con MODO" },
      { url: assetDataUri("comp-mateu-01.jpg"), tipo: "image", grupo: "Flyers", titulo: "Mateu Sports — 3, 6 y 9 cuotas sin interés y hasta 50% OFF por tiempo limitado" },
      { url: assetDataUri("comp-mateu-02.jpg"), tipo: "image", grupo: "Flyers", titulo: "Mateu Sports — retargeting de carrito abandonado, $10.000 de regalo con el código MATEU10K" },
      { url: assetDataUri("comp-mateu-03.jpg"), tipo: "image", grupo: "Flyers", titulo: "Mateu Sports — +400 productos en oferta, lifestyle con una barra de Instagram simulada en el medio de la pieza" },
      { url: assetDataUri("comp-solo-01.jpg"), tipo: "image", grupo: "Flyers", titulo: "Solo Deportes — 6 cuotas sin interés con tarjetas bancarias en compras desde $150.000. La pieza no muestra producto" },
      { url: assetDataUri("comp-dexter-ugc.mp4"), tipo: "video", grupo: "Videos", titulo: "Dexter — video UGC grabado dentro del local (46s)" },
      { url: assetDataUri("comp-video-02.mp4"), tipo: "video", grupo: "Videos", titulo: "Solo Deportes — video de producto, manos presentando modelos uno por uno (27s)" },
      { url: assetDataUri("comp-video-03.mp4"), tipo: "video", grupo: "Videos", titulo: "Recorrido por el local con carteles de hasta 60% OFF (68s)" },
      { url: assetDataUri("comp-video-04.mp4"), tipo: "video", grupo: "Videos", titulo: "Open Sports — video vertical de 23s" },
    ],
    observacion: "Relevamiento del 19/10/2026 en Meta Ad Library (Argentina): **196 anuncios activos combinados** entre los cuatro.\n\n**Los cuatro venden lo mismo y de la misma forma.** Catálogo dinámico producto a producto, con packshot, precio y CTA a la web. La diferencia la hacen en financiación: Open Sports 12 cuotas con Mercado Pago, Mateu hasta 9, Dexter 6 más promo Naranja, Solo Deportes 3.\n\n**El hueco no es el precio, es el acceso.** **Las cuatro promesas asumen tarjeta bancaria o Mercado Pago.** Ninguno le habla al que no tiene tarjeta ni ofrece crédito propio sin banco. Ese cliente está concentrado en los partidos de ingresos medios y bajos de provincia de Buenos Aires, **que es exactamente donde Star Deportes ya tiene presencia.**\n\n**Dónde pararse, en tres anillos.** La expansión sigue la lógica de caracol de la propuesta, primero donde ya hay local, después las aledañas, y el e-commerce para lo que queda lejos. B2C sale con **una sola audiencia que cubre los tres anillos**, no con piezas distintas por zona, y el desglose por región a los 14 días dice dónde está respondiendo.\n• **Anillo 1, donde hay sucursal** (Ensenada, Berisso, Los Hornos, Villa Elisa, San Vicente, Brandsen, Magdalena, Saladillo). Es el núcleo: marca conocida.\n• **Anillo 2, aledañas a los locales** (Guernica, Glew, Alejandro Korn, Burzaco, Malvinas Argentinas). Si una zona genera ventas online consistentes, es señal de demanda real.\n• **Anillo 3, Zona Oeste sin presencia física** (Merlo, Morón, Castelar, Ituzaingó, San Justo). Sólo e-commerce. Es el territorio que Solo Deportes ya domina, así que se lee como testeo, no como escala.\n• **Anillo 4, otras provincias** (Santa Fe, Córdoba, Entre Ríos, Mendoza). **No entra en esta etapa.** Queda anotado como el siguiente paso de la expansión, recién cuando los tres primeros anillos tengan data y el e-commerce esté midiendo bien.\n\nEn las tres zonas B2C comunica lo mismo: **producto, descuentos y medios de pago**. El crédito personal no entra acá, tiene su propia campaña y es presencial.",
  },

  notas: "Star Deportes (Grupo Lente) es un caso clásico de empresa madura en lo físico pero sin desarrollar en lo digital. 13 sucursales, 13 años de trayectoria, 189k seguidores en IG, pero cero atribución digital y un e-commerce que representa el 0.01% de las ventas.\n\nEl crédito personal es el diferencial más fuerte: ningún competidor lo ofrece. Pero solo funciona presencialmente, por lo que las campañas de crédito deben ser estrictamente geolocalizadas.\n\nEl equipo de branding del cliente (5 personas, 2 diseñadores) produce las piezas. REE entrega los briefs creativos (pilares, hooks, guiones, referencias). Son 5 campañas con ~40 piezas totales: B2C Hombre joven adulto (8), B2C Mujer joven adulta (8), B2C Padres y madres de familia (8), Awareness (~8) y Crédito Personal (~8). Awareness y Crédito Personal reutilizan contenido existente de @stardeportes (no requieren producción nueva). Las 24 piezas B2C las produce el equipo de Star Deportes con briefs de REE.\n\nLos ICPs B2C se segmentan por género y rol de compra, no por categoría de producto: hombre joven adulto (25-40), mujer joven adulta (25-40) y padre o madre de familia (30-50) que compra para sí y para sus hijos de 3 a 12 años. El tercer conjunto usa los intereses de Meta por edad de los hijos (preescolar 3-5, escolar temprana 6-8 y preadolescentes 9-12). Cada ICP tiene sus 8 piezas exclusivas: 2 video UGC, 2 carruseles, 3 flyers y 1 Meta Ads Shopping con productos específicos del género. De esas 8, dos son de CyberMonday (1 video y 1 carrusel) y van sólo en la ventana del 2 al 4 de noviembre, apuntando a stardeportes.com con los beneficios de la tienda.\n\nLas 3 campañas comparten el mismo ciclo: Foundation S1-S2, Build S3, Launch S4-S5 y Scale desde S6. Las 2 semanas de Launch son de validación: se prueban formatos, ángulos y categorías, y recién con esa data se redistribuye presupuesto en Scale.\n\nEstacionalidad clave Q4: Día de la Madre (18/10), CyberMonday de CACE (2 al 4/11, con Cyber Week hasta el 8/11), Black Friday (27/11) y Navidad (25/12). El CyberMonday argentino es a principios de noviembre, no el lunes posterior a Black Friday. Al lanzar las 3 campañas en S4 (26/10), el CyberMonday cae a solo una semana del lanzamiento, en plena validación: sirve para leer demanda real, no para escalar. A Black Friday, en cambio, se llega con unas 4 semanas de data y ya en fase Scale.",

  entregaMaterial: {
    destino: "Google Drive",
    descripcion: "El material terminado se entrega en una carpeta de Google Drive compartida con REE, con una carpeta por campaña y, dentro, una carpeta por pieza. Cada carpeta de pieza lleva todos sus formatos exportados juntos (el vertical, la adaptación a historia, los slides del carrusel), sin subcarpetas por formato. El árbol de abajo es un ejemplo de la estructura y de cómo nombrar las carpetas, no el listado de piezas.",
    arbol: [
      "Star Deportes — Creativos/",
      "├── Awareness/",
      "│   ├── VideoReel_v1/",
    ],
  },

  // Proximos pasos — explicitos (si no se definen, strategy-renderer los deriva de arquitectura/ofertas)
  proximosPasos: [
    {
      titulo: "Lo que necesitamos de Star Deportes",
      responsable: "Equipo de Star Deportes",
      tiempo: "Antes del lanzamiento",
      items: [
        "Pasarnos el acceso a Google Tag Manager (GTM-5M8VNBMR), que ya está activo en el sitio, o instalar ustedes el Pixel de Meta desde ese contenedor. Hoy no se dispara ningún evento en stardeportes.com.",
        "Producir las piezas solicitadas de cada campaña y entregarlas en el Drive compartido, con la estructura de carpetas de la sección de entrega.",
      ],
    },
    {
      titulo: "Lo que hacemos de nuestro lado",
      responsable: "REE Growth",
      tiempo: "Antes del lanzamiento",
      items: [
        "Validar que los eventos del Pixel disparen correctamente antes de prender la campaña B2C: PageView, ViewContent, AddToCart, InitiateCheckout y Purchase.",
        "Avanzar con el setup completo de las 3 campañas en Meta Ads y dejarlas listas para lanzar.",
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
