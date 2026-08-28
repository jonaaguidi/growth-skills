import { writeFileSync, mkdirSync } from "fs";
import { renderPlaybookHtml } from "../src/lib/playbook-renderer.js";
import { renderOnboardingHtml } from "../src/lib/onboarding-renderer.js";
import type { FoundationData } from "../src/types/foundation.js";

const data: FoundationData = {
  clientInfo: {
    nombreEmpresa: "Defu - The Tofu Co.",
    slug: "defu",
    nombreContacto: "Angel",
    industria: "Alimentacion artesanal (tofu y derivados)",
    sitioWeb: "defu.com.ar",
    email: null,
    telefono: null,
    fechaCierre: "18-08-2026",
  },
  datosF1: {
    inversionMensual: "USD 450/mes (fee REE) + USD 50/mes (REE Metrics)",
    presupuestoPauta: "USD 500/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (defu.com.ar)"],
    palancaPropuesta: "Captacion",
    campanasVendidas: ["Awareness de Marca", "Funnel B2C (E-commerce)"],
    duracionProyecto: "8 semanas",
    fechaInicio: "Jue 20/08/2026",
    fechaFin: "Jue 15/10/2026",
    fechaInicioISO: "2026-08-20",
  },

  // A. Onboarding
  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suarez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],
  grupoWhatsApp: {
    titulo: "Primeros Pasos Post-Cierre",
    items: [
      { label: "Crear grupo WhatsApp: REE Growth <> Defu Tofu", status: "hecho", notas: "Nomenclatura: REE Growth <> {Cliente}" },
      { label: "Agregar equipo REE al grupo", status: "hecho", notas: null },
      { label: "Agregar a Angel Huang al grupo", status: "hecho", notas: null },
      { label: "Enviar mensaje de bienvenida", status: "hecho", notas: "Presentar equipo, confirmar arranque y proximos pasos" },
      { label: "Agendar KO Call con Angel", status: "hecho", notas: "Coordinar fecha/hora para kickoff de onboarding" },
    ],
  },
  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Acceso a Meta",
      items: [
        { label: "Angel ingresa a Meta Business Suite con su Facebook personal", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Angel crea la Facebook Page de Defu desde su cuenta", status: "pendiente", notas: "Defu no tiene Facebook Page. Se crea con Angel en la KO Call." },
        { label: "Configurar info de la Page (nombre, categoria, descripcion, foto)", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Business Portfolio",
      items: [
        { label: "Angel abre su Business Portfolio en Meta Business Suite", status: "pendiente", notas: "El cliente es el titular y dueno de su portfolio" },
      ],
    },
    adAccount: {
      titulo: "Cuenta Publicitaria",
      items: [
        { label: "Angel crea la cuenta publicitaria dentro de su portfolio", status: "pendiente", notas: "El cliente es el titular de la cuenta publicitaria" },
      ],
    },
    pixel: {
      titulo: "Conexion de activos y permisos",
      items: [
        { label: "Conectar Instagram (@defu.tofuco) al Business Portfolio", status: "pendiente", notas: "Defu ya tiene IG, solo conectar" },
        { label: "Conectar Facebook Page al Business Portfolio", status: "pendiente", notas: null },
        { label: "Angel asigna permisos de administrador a growth@reecreativos.com", status: "pendiente", notas: "REE necesita permisos maximos sobre portfolio, Page, IG y Ad Account" },
        { label: "Definir moneda de la cuenta con Angel: USD (recomendado) o ARS", status: "pendiente", notas: "Si elige USD necesita tarjeta internacional (ej. ARQ o cualquier tarjeta que acepte pagos internacionales). Si paga en ARS con tarjeta local le cobran ~40% de impuestos. Recomendamos USD con tarjeta internacional." },
        { label: "Angel agrega tarjeta de pago a la cuenta publicitaria", status: "pendiente", notas: null },
        { label: "REE verifica acceso de admin a portfolio, Page, IG y Ad Account", status: "pendiente", notas: "Ingresar con growth@reecreativos.com y confirmar permisos completos" },
      ],
    },
    capi: {
      titulo: "",
      items: [],
    },
    edgeCases: [
      {
        condicion: "Sin Facebook Page ni cuenta publicitaria",
        aplica: true,
        instrucciones: "Defu no tiene Facebook Page ni cuenta publicitaria activada. Se crean ambas junto con Angel durante la KO Call. Angel es el titular, REE recibe permisos de admin.",
      },
      {
        condicion: "Integracion Tienda Nube + Meta",
        aplica: true,
        instrucciones: "Tienda Nube se conecta con Meta via Pixel y CAPI para trackear conversiones del e-commerce. Requiere acceso admin a Tienda Nube para instalar y configurar.",
      },
    ],
  },
  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolucion (PNG/SVG)", status: "pendiente", notas: null },
        { label: "Fotos de productos (tofu, gyozas, nuggets, etc.)", status: "pendiente", notas: null },
        { label: "Videos de produccion / detras de escena", status: "pendiente", notas: "Storytelling familia Huang y produccion diaria" },
        { label: "Paleta de colores y tipografias de marca", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a defu.com.ar (Tienda Nube)", status: "pendiente", notas: "Para instalar Pixel, GTM y configurar integraciones" },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Numero de WhatsApp Business para atencion de leads", status: "pendiente", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atencion de Leads",
      items: [
        { label: "Definir quien atiende consultas de redes/ecommerce", status: "pendiente", notas: null },
        { label: "Confirmar capacidad de atencion diaria", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "Tienda Nube",
      descripcion: "Necesitamos acceder a tu Tienda Nube para configurar las integraciones: instalar el Pixel de Meta, conectar Google Tag Manager, Google Analytics y configurar el seguimiento de conversiones para REE Metrics.",
      items: [
        { label: "Email o usuario de Tienda Nube", status: "pendiente", notas: null },
        { label: "Contrasena de Tienda Nube", status: "pendiente", notas: null },
        { label: "REE verifica ingreso correcto a Tienda Nube", status: "pendiente", notas: "Ingresar con las credenciales y confirmar acceso admin al panel" },
      ],
    },
    tracking: {
      titulo: "Tracking y Analytics",
      items: [
        { label: "Google Tag Manager instalado en Tienda Nube", status: "pendiente", notas: "Contenedor GTM para gestionar todos los tags de tracking" },
        { label: "Google Analytics (GA4) configurado y conectado", status: "pendiente", notas: "Trafico, comportamiento de usuarios y conversiones" },
        { label: "Pixel de Meta instalado via GTM o integracion nativa", status: "pendiente", notas: "Tracking de eventos para Meta Ads (PageView, ViewContent, AddToCart, Purchase)" },
        { label: "Datos fluyendo a REE Metrics", status: "pendiente", notas: "Verificar que GA4, Meta Ads y Tienda Nube reportan a REE Metrics" },
      ],
    },
  },
  koCall: {
    fechaPropuesta: "Mar 25/08/2026",
    duracionTotal: "45 min",
    etapas: [
      {
        nombre: "Apertura",
        duracion: "5 min",
        objetivo: "Explicar brevemente que hoy vamos a configurar todo lo necesario del lado de Meta Ads para poder integrarlo con REE Metrics, y solicitar los accesos al e-commerce en Tienda Nube para conectarlo a la app.",
        output: "Angel entiende que vamos a hacer hoy.",
      },
      {
        nombre: "Onboarding Meta",
        duracion: "25 min",
        objetivo: "Crear Business Portfolio, Facebook Page y cuenta publicitaria. Conectar Instagram. Asignar permisos de admin a REE. Definir moneda (USD/ARS) y agregar tarjeta de pago.",
        output: "Meta Business configurado. REE con acceso de admin verificado.",
      },
      {
        nombre: "Accesos",
        duracion: "10 min",
        objetivo: "Solicitar credenciales de Tienda Nube (email y password). Verificar ingreso correcto al panel de admin.",
        output: "REE con acceso a Tienda Nube verificado.",
      },
      {
        nombre: "Cierre",
        duracion: "5 min",
        objetivo: "Explicar proximos pasos: en la Foundation Review vemos la estrategia de campanas y dejamos todo listo para lanzar Awareness. Agendar fecha.",
        output: "Foundation Review agendada. Angel sabe que esperar.",
      },
    ],
    flujoTemas: [
      "Presentaciones", "Portfolio", "FB Page", "Ad Account", "Instagram",
      "Permisos", "Moneda", "Tarjeta", "Tienda Nube",
      "Estrategia", "Proximos Pasos",
    ],
    temasWow: [
      "Preview del dashboard REE Metrics",
      "Storytelling familia Huang como angulo creativo principal",
    ],
    checklist: {
      titulo: "Preparacion KO Call",
      items: [
        { label: "Doc de onboarding para Angel listo", status: "pendiente", notas: "Documento que le compartimos a Angel con los pasos a seguir" },
        { label: "Doc de estrategia de campanas listo", status: "pendiente", notas: "Bajada de campanas, roadmap, creativos y presupuesto" },
        { label: "Demo de REE Metrics preparado", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: {
      nombre: "Foundation Review",
      fechaTentativa: "Jue 03/09 o Vie 04/09",
      objetivos: [
        "Mostrar campanas de Awareness configuradas y listas para lanzar",
        "Presentar avances del setup de Funnel B2C (Tienda Nube + Meta)",
        "Dar acceso al dashboard REE Metrics con datos en vivo",
        "Confirmar fecha de lanzamiento de campanas",
      ],
    },
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "Lograr que el reconocimiento B2C le de a Defu la autoridad necesaria para captar leads B2B. Awareness de marca + funnel de conversion en e-commerce.",
  },
  icp: [
    {
      segmento: "B2C - Foodie / Vegano / Comunidad Asiatica",
      descripcion: "25-45 anos, Buenos Aires. Busca tofu artesanal fresco premium.",
      dolores: [
        "No encuentra tofu de calidad en supermercados",
        "Desconoce opciones artesanales locales",
        "Inaccesibilidad fuera del Barrio Chino",
      ],
      deseos: [
        "Productos saludables y locales",
        "Acceso por delivery/e-commerce",
        "Educacion sobre preparacion de tofu",
        "Trazabilidad del producto",
      ],
      objeciones: [
        "Precio premium vs tofu industrial",
        "No se como preparar tofu",
        "No conozco la marca",
      ],
      prioridad: "primario",
    },
    {
      segmento: "B2B - Dieteticas, Restaurantes, Distribuidoras",
      descripcion: "Negocios que necesitan proveedor formal con habilitacion sanitaria. Buscan producto diferenciado.",
      dolores: [
        "Proveedores informales sin habilitacion",
        "Producto generico sin diferenciacion",
        "Falta de formalidad y consistencia en entregas",
      ],
      deseos: [
        "Proveedor habilitado y formal",
        "Producto artesanal premium para diferenciarse",
        "Private label disponible (~50% margen)",
      ],
      objeciones: [
        "Capacidad de produccion para volumen B2B",
        "Cobertura geografica limitada",
      ],
      prioridad: "secundario",
    },
  ],
  oferta: {
    descripcion: "20+ SKUs de tofu artesanal y derivados (gyozas, nuggets, wantan, seitan). Produccion diaria con 30% capacidad disponible. E-commerce con delivery en Buenos Aires.",
    diferenciador: "Unico productor artesanal formal con habilitacion sanitaria en Buenos Aires. Competencia: Soyana (industrial, 80% mercado) e informales sin regulacion.",
  },
  calificacionLeads: [
    { categoria: "A", descripcion: "Compra recurrente en e-commerce o consulta B2B con volumen", accion: "Contactar inmediato, WhatsApp personalizado" },
    { categoria: "B", descripcion: "Primera compra en e-commerce o consulta B2B exploratoria", accion: "Seguimiento en 24hs, enviar catalogo" },
    { categoria: "C", descripcion: "Interaccion en redes sin intencion de compra clara", accion: "Nurturing via contenido organico y retargeting" },
  ],
  kpis: [
    { nombre: "CPA", objetivo: "Por definir post-lanzamiento", fuente: "Meta Ads + REE Metrics" },
    { nombre: "ROAS", objetivo: "Por definir post-lanzamiento", fuente: "Meta Ads + Tienda Nube" },
    { nombre: "Ticket Promedio", objetivo: "Incrementar vs baseline", fuente: "Tienda Nube" },
    { nombre: "Tasa de Conversion", objetivo: "Por definir post-lanzamiento", fuente: "GA4 + Tienda Nube" },
  ],
  presupuesto: {
    pauta: "USD 500/mes",
    fee: "USD 450/mes (REE Growth) + USD 50/mes (REE Metrics)",
    total: "USD 1,000/mes (primer mes USD 1,150 por integracion Tienda Nube)",
    cplTarget: null,
    limiteGastoCuenta: "USD 500/mes",
  },
  creativos: {
    angulos: [
      {
        nombre: "Storytelling Familia",
        dolorQueResuelve: "No conozco la marca / no confio",
        mensajeClave: "Detras de cada pieza de tofu hay 3 generaciones de la familia Huang",
        formato: "Reel / Video corto",
      },
      {
        nombre: "Produccion Artesanal",
        dolorQueResuelve: "No se si es de calidad / es industrial",
        mensajeClave: "Produccion diaria, artesanal, con habilitacion sanitaria",
        formato: "Reel / Carrusel",
      },
      {
        nombre: "Recetas y Educacion",
        dolorQueResuelve: "No se como preparar tofu",
        mensajeClave: "3 recetas faciles con tofu artesanal Defu",
        formato: "Reel / Carrusel / Stories",
      },
      {
        nombre: "Social Proof / Comunidad",
        dolorQueResuelve: "No conozco a nadie que lo compre",
        mensajeClave: "Restaurantes, dieteticas y foodies ya eligen Defu",
        formato: "Reel / Estatico",
      },
    ],
    formatos: ["Reels (video corto)", "Carrusel", "Estatico", "Stories"],
    tono: "Cercano, artesanal, familiar. Mostrar el proceso humano detras del producto. Sin lenguaje corporativo.",
  },
  utm: {
    campaignFormat: "{Empresa}_{Objetivo}_{Segmento}",
    ejemplos: ["Defu_Awareness_Foodie", "Defu_Conversion_Retargeting"],
  },
  arquitectura: [
    {
      nombre: "Defu_Awareness",
      objetivo: "Alcance e interaccion. Construir reconocimiento de marca.",
      adSets: [
        {
          nombre: "Conjunto_Foodie_BA",
          segmentacion: "25-45, Buenos Aires, intereses: alimentacion saludable, cocina asiatica, vegano/vegetariano",
          ads: [
            "Anuncio_Reel_Storytelling_V1",
            "Anuncio_Reel_Produccion_V1",
            "Anuncio_Carrusel_Recetas_V1",
          ],
        },
      ],
    },
    {
      nombre: "Defu_Conversion",
      objetivo: "Ventas en defu.com.ar. Retargeting de visitantes.",
      adSets: [
        {
          nombre: "Conjunto_Retargeting_Web",
          segmentacion: "Visitantes defu.com.ar ultimos 30 dias, interaccion IG/FB ultimos 30 dias",
          ads: [
            "Anuncio_Estatico_Promo_V1",
            "Anuncio_Reel_SocialProof_V1",
          ],
        },
      ],
    },
  ],
  capacidadAtencion: {
    quienAtiende: "Angel Huang (dueno)",
    capacidadDiaria: "Por validar",
    tiempoRespuesta: "Por validar",
    validado: false,
  },

  notas: "Primer mes incluye USD 150 one-time por integracion Tienda Nube.\nDefu tiene 30% de capacidad de produccion disponible para escalar.\n6 listas de precios por canal (private label, mayorista, dieteticas, Barrio Chino, food service, consumidor final).\nCompetencia principal: Soyana (industrial, 80% del mercado).",

  roadmap: [
    {
      nombre: "Awareness de Marca",
      fases: [
        { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
        { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
        { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
        { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
      ],
    },
    {
      nombre: "Funnel B2C E-commerce",
      fases: [
        { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
        { nombre: "Build", semanaInicio: 2, semanaFin: 4 },
        { nombre: "Launch", semanaInicio: 5, semanaFin: 6 },
        { nombre: "Scale", semanaInicio: 7, semanaFin: 8 },
      ],
    },
  ],
  mensajeBienvenida: "Bienvenidos al equipo, Angel! Estamos muy contentos de arrancar a trabajar con Defu. Vamos a potenciar la marca para que mas gente conozca el tofu artesanal de la familia Huang. Aca te dejamos los pasos para arrancar.",
};

// Generate and save
const playbook = renderPlaybookHtml(data);
const onboarding = renderOnboardingHtml(data);

mkdirSync("clients-doc-internos/defu", { recursive: true });
mkdirSync("clients-onboardings/defu", { recursive: true });

writeFileSync("clients-doc-internos/defu/foundation-defu.html", playbook);
writeFileSync("clients-onboardings/defu/onboarding-defu.html", onboarding);

console.log("Generated:");
console.log("  clients-doc-internos/defu/foundation-defu.html");
console.log("  clients-onboardings/defu/onboarding-defu.html");
