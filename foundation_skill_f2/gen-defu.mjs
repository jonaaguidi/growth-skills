import { renderPlaybookHtml } from "./dist/lib/playbook-renderer.js";
import { renderOnboardingHtml } from "./dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "./dist/lib/strategy-renderer.js";
import { writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const data = {
  clientInfo: {
    nombreEmpresa: "Defu — The Tofu Co.",
    slug: "defu",
    nombreContacto: "Angel Huang",
    industria: "Alimentos artesanales / Plant-based",
    sitioWeb: "defu.com.ar",
    email: null,
    telefono: null,
    fechaCierre: "2026-08-12",
  },
  datosF1: {
    inversionMensual: "USD 200-350/mes (fee REE)",
    presupuestoPauta: "USD 100-250/mes",
    cplObjetivo: "$240 ARS (visita al e-commerce)",
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (defu.com.ar)", "WhatsApp Business"],
    palancaPropuesta: "Captacion: awareness + funnel B2C ecommerce",
  },

  // A. Onboarding
  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suarez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] Defu - Growth", status: "pendiente", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "pendiente", notas: null },
      { label: "Crear grupo cliente: Defu x REE Growth", status: "pendiente", notas: null },
      { label: "Agregar a Angel Huang al grupo cliente", status: "pendiente", notas: null },
      { label: "Enviar mensaje de bienvenida con agenda de onboarding", status: "pendiente", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Verificar que existe portfolio en growth@reecreativos.com", status: "pendiente", notas: null },
        { label: "Crear sub-portfolio o estructura para Defu", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como administradores", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Crear Facebook Page para Defu bajo portfolio de growth@", status: "pendiente", notas: "DEFU no tiene Facebook Page. Se crea desde cero." },
        { label: "Completar informacion de la Page (nombre, categoria, foto, portada)", status: "pendiente", notas: null },
        { label: "Agregar a Angel como editor de la Page", status: "pendiente", notas: null },
        { label: "Publicar al menos 1 post inicial", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @defu.tofuco es cuenta Business", status: "pendiente", notas: "Si es Personal, Angel debe convertirla a Business desde la app." },
        { label: "Vincular Instagram a la Facebook Page de Defu", status: "pendiente", notas: null },
        { label: "Vincular Instagram al portfolio de growth@", status: "pendiente", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Crear cuenta publicitaria: 'Defu - Ad Account'", status: "pendiente", notas: null },
        { label: "Configurar timezone: America/Buenos_Aires", status: "pendiente", notas: null },
        { label: "Configurar moneda: ARS", status: "pendiente", notas: null },
        { label: "Agregar tarjeta de credito/debito de Angel en Meta", status: "pendiente", notas: "La pauta se paga con la tarjeta del cliente directo en Meta." },
        { label: "Asignar Facebook Page e Instagram a la cuenta", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como Anunciantes", status: "pendiente", notas: null },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Crear Pixel: 'Defu - Pixel'", status: "pendiente", notas: null },
        { label: "Instalar Pixel en defu.com.ar (Tienda Nube)", status: "pendiente", notas: "Tienda Nube tiene integracion nativa con Meta Pixel." },
        { label: "Configurar eventos: PageView, ViewContent, AddToCart, Purchase", status: "pendiente", notas: null },
        { label: "Verificar con Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Configurar CAPI via integracion Tienda Nube o Gateway", status: "pendiente", notas: "Verificar si Tienda Nube soporta CAPI nativo." },
        { label: "Verificar deduplicacion de eventos (event_id)", status: "pendiente", notas: null },
        { label: "Testear con Test Events en Events Manager", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Cliente no tiene Facebook Page",
        aplica: true,
        instrucciones: "Defu no tiene Facebook Page existente. Se debe crear una nueva Page directamente bajo el Business Portfolio de growth@reecreativos.com. Usar nombre comercial 'Defu - The Tofu Co.', categoria 'Comida y bebida', completar con los brand assets del cliente. Angel debe ser agregado como editor una vez creada.",
      },
      {
        condicion: "Instagram puede ser cuenta Personal",
        aplica: true,
        instrucciones: "Verificar el tipo de cuenta de @defu.tofuco. Si es Personal, Angel debe convertirla a Business desde Configuracion > Cuenta > Cambiar a cuenta profesional. Luego vincular a la Facebook Page recien creada.",
      },
      {
        condicion: "Sin vehiculo propio para distribucion",
        aplica: true,
        instrucciones: "Defu no tiene vehiculo propio actualmente. Dependen de Uber y fletes. Esto impacta el costo por envio y el margen neto B2C. Al definir combos y minimo de compra para envio gratis, considerar que el costo de envio puede ser alto. Validar con Angel el costo promedio por envio.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolucion (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Paleta de colores oficial", status: "pendiente", notas: null },
        { label: "Fotos de productos en alta calidad", status: "pendiente", notas: "Defu tiene Instagram activo, posiblemente ya tenga fotos." },
        { label: "Videos de proceso artesanal (planta, produccion)", status: "pendiente", notas: "Activo clave para storytelling de marca." },
        { label: "Guia de marca / manual de identidad (si existe)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a Tienda Nube (defu.com.ar)", status: "pendiente", notas: "Necesario para instalar Pixel y configurar tracking." },
        { label: "Google Analytics (si existe)", status: "pendiente", notas: null },
        { label: "Datos de trafico y conversion del e-commerce (ultimos 3 meses)", status: "pendiente", notas: null },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Numero de WhatsApp Business del cliente", status: "hecho", notas: "+54 9 1127502097" },
        { label: "Verificar que sea cuenta Business (no Personal)", status: "pendiente", notas: null },
        { label: "Mensaje de bienvenida automatico configurado", status: "pendiente", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atencion de Leads",
      items: [
        { label: "Definir quien atiende los leads entrantes", status: "pendiente", notas: "Angel atiende todo personalmente, es cuello de botella." },
        { label: "Definir tiempo maximo de respuesta por categoria", status: "pendiente", notas: null },
        { label: "Validar capacidad de atencion diaria", status: "pendiente", notas: null },
      ],
    },
  },

  koCall: {
    fechaPropuesta: null,
    agenda: [
      "Presentacion del equipo asignado y roles",
      "Review de la propuesta aceptada (recap de F1)",
      "Explicar el proceso de Foundation: que se va a hacer y en que orden",
      "Revisar requerimientos pendientes (brand assets, accesos, datos)",
      "Definir canales de comunicacion (grupo WhatsApp, frecuencia de updates)",
      "Alinear expectativas: timelines, primeros resultados esperados",
      "Q&A con el cliente",
    ],
    temasWow: [
      "Mostrar ejemplo de dashboard de REE Metrics con data de otro cliente (anonimizado)",
      "Explicar como funciona el tracking de conversiones y por que importa",
      "Compartir benchmark de CPL en alimentos artesanales / D2C Argentina",
    ],
    checklist: {
      titulo: "Preparacion KO Call",
      items: [
        { label: "Agendar fecha con el cliente", status: "pendiente", notas: null },
        { label: "Enviar invite de Google Calendar", status: "pendiente", notas: null },
        { label: "Preparar deck de presentacion (recap F1 + plan F2)", status: "pendiente", notas: null },
        { label: "Tener datos de benchmark listos", status: "pendiente", notas: null },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
      ],
    },
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "Defu no tiene presencia en pauta digital. El competidor principal (Soyana) tiene 70 anuncios activos. La prioridad es generar awareness y activar el canal B2C (e-commerce) para explotar el 30-40% de capacidad de produccion ociosa. La marca tiene un diferencial fuerte (unico artesanal con habilitacion) que no esta siendo comunicado. Captacion es la palanca correcta: primero que te conozcan, despues convertir.",
  },

  icp: [
    {
      segmento: "B2C: Consumidor Final",
      descripcion: "Persona de 25-45 anos en Buenos Aires, foodie, comunidad asiatica o vegano/vegetariano que busca tofu artesanal fresco.",
      dolores: [
        "No encuentra tofu de calidad en supermercados",
        "El tofu del super no tiene sabor ni buena textura",
        "No sabe donde comprar tofu artesanal fresco fuera del Barrio Chino",
        "Asocia el tofu con un producto insipido por malas experiencias",
      ],
      deseos: [
        "Comer mas saludable con productos artesanales y locales",
        "Acceso facil a tofu fresco sin ir al Barrio Chino (delivery/e-commerce)",
        "Descubrir recetas y formas de cocinar con tofu",
        "Tener un proveedor de confianza para recompra regular",
      ],
      objeciones: [
        "Es mas caro que Soyana del supermercado",
        "No se como cocinar tofu",
        "No sabia que existia tofu artesanal en Buenos Aires",
        "El producto fresco dura pocos dias",
      ],
      prioridad: "primario",
    },
    {
      segmento: "B2B: Dieteticas, Food Service, Distribuidoras",
      descripcion: "Negocios que necesitan proveedor formal de tofu con habilitacion sanitaria, calidad constante y trato directo.",
      dolores: [
        "Necesita proveedor con habilitacion sanitaria (RNE/RNPA)",
        "Pocos proveedores artesanales formales en Buenos Aires",
        "Proveedores informales no ofrecen garantias ni facturacion",
      ],
      deseos: [
        "Proveedor que no compita con su precio al publico",
        "Producto diferenciado para destacar en carta/gondola",
        "Listas de precios claras y plazos de pago definidos",
      ],
      objeciones: [
        "Ya tengo proveedor (Soyana) con distribucion estable",
        "No conozco la marca",
        "Vida util corta del producto fresco",
      ],
      prioridad: "secundario",
    },
  ],

  oferta: {
    descripcion: "Tofu artesanal fresco, elaborado todos los dias por una familia china-argentina en Buenos Aires. Mas de 20 productos: tofu (7 variedades), masas para gyozas, wantan y arrolladitos primavera. Envio en el dia. Unico productor artesanal con habilitacion sanitaria completa.",
    diferenciador: "Unico productor artesanal de tofu con habilitacion sanitaria en Buenos Aires. Fresco del dia, no industrial. Historia familiar autentica.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Contacto que pide precio, quiere comprar, o pregunta por delivery/disponibilidad. Intent de compra claro.",
      accion: "Contacto en menos de 2 horas. Responder por WhatsApp con catalogo y opciones de envio.",
    },
    {
      categoria: "B",
      descripcion: "Pregunta generica sobre productos, si hacen envios a su zona, o pide informacion. Interes pero sin intent de compra inmediato.",
      accion: "Contacto en menos de 24 horas. Responder con info y link al e-commerce.",
    },
    {
      categoria: "C",
      descripcion: "Interaccion en redes (like, comentario, share) sin mensaje directo. Awareness sin intent.",
      accion: "No requiere contacto directo. Se nutren con contenido organico y retargeting.",
    },
  ],

  kpis: [
    { nombre: "CPL (visita e-commerce)", objetivo: "$240 ARS", fuente: "Meta Ads + REE Metrics" },
    { nombre: "CPA (venta Tienda Nube)", objetivo: "$12,000 ARS", fuente: "Tienda Nube + Pixel" },
    { nombre: "ROAS", objetivo: "> 1.33x (breakeven)", fuente: "Meta Ads" },
    { nombre: "Ticket promedio", objetivo: "$40,000+ ARS", fuente: "Tienda Nube" },
    { nombre: "Tasa de conversion e-commerce", objetivo: "2%+ (benchmark D2C)", fuente: "Tienda Nube Analytics" },
    { nombre: "Alcance mensual", objetivo: null, fuente: "Meta Ads" },
    { nombre: "Crecimiento seguidores IG", objetivo: null, fuente: "Instagram Insights" },
  ],

  presupuesto: {
    pauta: "USD 100-250/mes (tarjeta de Angel en Meta)",
    fee: "USD 200-350/mes (fee REE Growth)",
    total: "USD 300-600/mes",
    cplTarget: "$240 ARS por visita al e-commerce",
    limiteGastoCuenta: "USD 300/mes",
  },

  creativos: {
    angulos: [
      {
        nombre: "Tofu de verdad",
        dolorQueResuelve: "El consumidor no encuentra tofu de calidad",
        mensajeClave: "Tofu artesanal, fresco del dia. Una vez que lo probas, el del supermercado no vuelve a ser opcion.",
        formato: "Video corto (Reels/Stories) mostrando proceso artesanal vs industrial",
      },
      {
        nombre: "De nuestra familia a tu mesa",
        dolorQueResuelve: "No conoce la historia detras del producto",
        mensajeClave: "Defu nace en Barrio Chino. Una familia china-argentina que hace tofu como se hace de verdad, todos los dias.",
        formato: "Carrusel storytelling: fotos de la familia, la planta, el proceso",
      },
      {
        nombre: "Mucho mas que tofu",
        dolorQueResuelve: "Asocia el tofu con un producto aburrido",
        mensajeClave: "Masas para gyozas, arrolladitos primavera, tofu especiado, frito, bacon. Mas de 20 productos para descubrir.",
        formato: "Carrusel de producto / video de recetas",
      },
    ],
    formatos: ["Reels/Stories (video 9:16)", "Carrusel (feed)", "Imagen estatica (feed)", "Story con link al e-commerce"],
    tono: "Directo, autentico, cercano. Mostrar el proceso real. Sin lenguaje corporativo. Storytelling familiar.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_defu_meta_awareness_tofudeverdad",
      "ree_defu_meta_conversion_ecommerce",
      "ree_defu_meta_retargeting_visitantes",
    ],
  },

  arquitectura: [
    {
      nombre: "Awareness: Interaccion (visitas al perfil IG)",
      objetivo: "Generar awareness de marca en Buenos Aires. Que conozcan a Defu mas alla de Barrio Chino.",
      adSets: [
        {
          nombre: "Foodie / Healthy Buenos Aires",
          segmentacion: "Buenos Aires, 25-45 anos, intereses: alimentacion saludable, cocina asiatica, vegano/vegetariano, tofu, comida artesanal",
          ads: [
            "Video: proceso artesanal en la planta (angulo 'Tofu de verdad')",
            "Carrusel: historia de la familia Huang (angulo 'De nuestra familia')",
            "Imagen: catalogo de 20+ productos (angulo 'Mucho mas que tofu')",
          ],
        },
      ],
    },
    {
      nombre: "Conversion: Ventas E-commerce (defu.com.ar)",
      objetivo: "Generar ventas directas en Tienda Nube. Optimizar por evento Purchase.",
      adSets: [
        {
          nombre: "Prospeccion: Lookalike de compradores",
          segmentacion: "Lookalike de compradores en Tienda Nube (post-Pixel). Buenos Aires, 25-45 anos.",
          ads: [
            "Video con CTA directo al e-commerce (combo 'Comida China Casera')",
            "Carrusel de productos con precios y boton 'Comprar ahora'",
          ],
        },
        {
          nombre: "Retargeting: Visitantes del sitio",
          segmentacion: "Custom audience: visitantes de defu.com.ar ultimos 14 dias que no compraron.",
          ads: [
            "Reminder: 'Tu tofu te espera' con descuento de primera compra",
            "Testimonio / UGC de cliente satisfecho",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Angel Huang (personalmente)",
    capacidadDiaria: "Limitada. Angel administra 2 locales mas ademas de Defu.",
    tiempoRespuesta: "Variable. Depende de la carga operativa del dia.",
    validado: false,
  },

  notas: "DEFU es el primer cliente de Foundation F2. Los edge cases de este cliente (sin FB Page, posible IG Personal, sin vehiculo propio) son referencia para el proceso estandar.\n\nAngel es cuello de botella operativo: atiende todo personalmente y administra otros locales. Cualquier flujo de leads debe considerar su capacidad limitada. En una fase posterior se puede implementar un bot de WhatsApp para filtrar y calificar automaticamente.\n\nLa estrategia es gradual: primero awareness (que conozcan a Defu), luego conversion B2C (e-commerce). El B2B no lleva pauta por ahora, se trabaja organicamente aprovechando el awareness generado.",

  // Roadmap & bienvenida
  roadmap: [
    { nombre: "Awareness de Marca", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
      { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
    ]},
    { nombre: "Funnel B2C (Ecommerce)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 4 },
      { nombre: "Launch", semanaInicio: 5, semanaFin: 6 },
      { nombre: "Scale", semanaInicio: 7, semanaFin: 8 },
    ]},
  ],
  mensajeBienvenida: "Angel, bienvenido a REE Growth. Somos tu equipo de crecimiento digital. Vamos a posicionar a Defu como la marca referente de tofu artesanal en Buenos Aires y activar tu canal de ventas online.",
};

// --- Generate 3 HTMLs ---

const playbook = renderPlaybookHtml(data);
const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);

// Output dirs
const baseDir = new URL("./", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outputs = [
  { dir: join(baseDir, "clients-doc-internos", "defu"), file: "foundation-defu.html", html: playbook },
  { dir: join(baseDir, "clients-onboardings", "defu"), file: "onboarding-defu.html", html: onboarding },
  { dir: join(baseDir, "clients-strategies", "defu"), file: "estrategia-defu.html", html: strategy },
];

for (const out of outputs) {
  mkdirSync(out.dir, { recursive: true });
  const path = join(out.dir, out.file);
  writeFileSync(path, out.html, "utf-8");
  console.log(`Done: ${path}`);

  // Copy to Desktop
  const desktopPath = join(desktop, out.file);
  writeFileSync(desktopPath, out.html, "utf-8");
  console.log(`Copy: ${desktopPath}`);
}
