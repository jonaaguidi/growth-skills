import { renderOnboardingHtml } from "./dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "./dist/lib/strategy-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const data = {
  clientInfo: {
    nombreEmpresa: "BTLandia",
    slug: "btlandia",
    nombreContacto: "Celeste Policastro",
    industria: "Brand Experiences / Corporate Events / Incentive Travel",
    sitioWeb: "btlandia.com.ar",
    email: null,
    telefono: null,
    fechaCierre: "2026-09-08",
  },
  datosF1: {
    inversionMensual: "USD 500/mes (fee REE)",
    presupuestoPauta: "USD 500/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Meta Ads (Instagram + Facebook)", "WhatsApp Business", "Instagram @btlandia", "CRM (HubSpot)"],
    palancaPropuesta: "Captacion: canal digital B2B para medianas empresas",
    campanasVendidas: ["B2B Lead Gen (WhatsApp)", "Awareness (Instagram)"],
    duracionProyecto: "8 semanas",
    fechaInicio: null,
    fechaFin: null,
    fechaInicioISO: "2026-09-15",
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
      { label: "Crear grupo interno: [REE] BTLandia - Growth", status: "pendiente", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "pendiente", notas: null },
      { label: "Crear grupo cliente: BTLandia x REE Growth", status: "pendiente", notas: null },
      { label: "Agregar a Celeste Policastro al grupo cliente", status: "pendiente", notas: null },
      { label: "Enviar mensaje de bienvenida con agenda de onboarding", status: "pendiente", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Verificar que existe portfolio en growth@reecreativos.com", status: "pendiente", notas: null },
        { label: "Crear sub-portfolio o estructura para BTLandia", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como administradores", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Verificar si BTLandia tiene Facebook Page existente", status: "pendiente", notas: "Revisar si existe Page activa. Si no existe, crear bajo portfolio de growth@." },
        { label: "Vincular Facebook Page al Business Portfolio de growth@", status: "pendiente", notas: null },
        { label: "Completar informacion de la Page (nombre, categoria, foto, portada)", status: "pendiente", notas: null },
        { label: "Agregar a Celes como editora de la Page", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @btlandia es cuenta Business", status: "pendiente", notas: "Si es Personal, Celes debe convertirla a Business desde la app." },
        { label: "Vincular Instagram a la Facebook Page de BTLandia", status: "pendiente", notas: null },
        { label: "Vincular Instagram al portfolio de growth@", status: "pendiente", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Crear cuenta publicitaria: 'BTLandia - Ad Account'", status: "pendiente", notas: null },
        { label: "Configurar timezone: America/Buenos_Aires", status: "pendiente", notas: null },
        { label: "Configurar moneda: USD", status: "pendiente", notas: null },
        { label: "Agregar tarjeta de credito/debito de Celes en Meta", status: "pendiente", notas: "La pauta se paga con la tarjeta del cliente directo en Meta." },
        { label: "Asignar Facebook Page e Instagram a la cuenta", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como Anunciantes", status: "pendiente", notas: null },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Crear Pixel: 'BTLandia - Pixel'", status: "pendiente", notas: null },
        { label: "Instalar Pixel en btlandia.com.ar", status: "pendiente", notas: "El sitio no tiene tracking actualmente. Baja prioridad inicial: el CTA principal es WhatsApp, no web." },
        { label: "Configurar eventos: PageView, Lead, Contact", status: "pendiente", notas: null },
        { label: "Verificar con Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Evaluar necesidad de CAPI (depende de volumen de eventos web)", status: "pendiente", notas: "Baja prioridad inicial. El funnel principal es WhatsApp, no web." },
        { label: "Verificar deduplicacion de eventos (event_id)", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Cero pauta historica en Meta",
        aplica: true,
        instrucciones: "BTLandia nunca invirtio en Meta Ads. No tiene cuenta publicitaria, no tiene Pixel, no tiene historial de campanas. Todo se configura desde cero. Esto significa que no hay data historica para optimizar: las primeras semanas son de aprendizaje del algoritmo.",
      },
      {
        condicion: "Sin tracking en sitio web",
        aplica: true,
        instrucciones: "btlandia.com.ar no tiene Google Tag Manager, Google Analytics 4 ni Meta Pixel instalado. Baja prioridad inicial porque el CTA principal de las campanas es WhatsApp, no el sitio web. Se instala Pixel basico para trackear PageView y Lead, pero no es critico en la primera fase.",
      },
      {
        condicion: "Sin CRM",
        aplica: true,
        instrucciones: "BTLandia no usa CRM actualmente. Se esta evaluando HubSpot, Brevo y Odoo. REE recomienda HubSpot Free por su integracion nativa con Meta Ads y facilidad de uso. Critico para trackear leads y medir conversion. La integracion tiene un costo one-time de USD 150 incluido en el primer mes.",
      },
      {
        condicion: "Agencia externa gestiona LinkedIn",
        aplica: true,
        instrucciones: "Una agencia externa gestiona el LinkedIn de BTLandia desde hace mas de 1.5 anos. REE opera Meta e Instagram de forma independiente. Es necesario alinear calendarios editoriales para evitar mensajes contradictorios o duplicados. Coordinar con Nicolas Blasotta (consultor externo de Celes).",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolucion (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Paleta de colores oficial", status: "pendiente", notas: null },
        { label: "Fotos de eventos del portfolio (Fiat, Stellantis, YPF Agro, Avon, Club Med, Citroen)", status: "pendiente", notas: "Material clave para demostrar expertise y portfolio." },
        { label: "Videos de eventos (BTS, timelapses, highlights de producciones)", status: "pendiente", notas: "Activo clave para contenido de awareness y reels." },
        { label: "Guia de marca / manual de identidad (si existe)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a btlandia.com.ar para futura instalacion de tracking", status: "pendiente", notas: "Baja prioridad inicial. Necesario cuando se implemente Pixel." },
        { label: "Google Analytics (si existe)", status: "pendiente", notas: null },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Numero de WhatsApp Business de BTLandia", status: "pendiente", notas: null },
        { label: "Verificar que sea cuenta Business (no Personal)", status: "pendiente", notas: null },
        { label: "Configurar WhatsApp como destino de campanas de Lead Gen", status: "pendiente", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atencion de Leads",
      items: [
        { label: "Definir quien atiende los leads entrantes (Celes + Frany)", status: "pendiente", notas: "Celes es la principal comercial. Frany puede hacer primer contacto y filtrar." },
        { label: "Definir tiempo maximo de respuesta objetivo (<2h para leads A)", status: "pendiente", notas: null },
        { label: "Configurar notificaciones para leads entrantes", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: null,
    tracking: null,
  },

  koCall: {
    fechaPropuesta: null,
    duracionTotal: "45 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Intro: que vamos a configurar hoy", output: "Contexto alineado" },
      { nombre: "Onboarding Meta", duracion: "25 min", objetivo: "Setup completo de Meta (Page, Portfolio, Ad Account, IG, permisos, tarjeta)", output: "Cuenta publicitaria lista" },
      { nombre: "CRM + WhatsApp", duracion: "10 min", objetivo: "Setup de HubSpot y configuracion de WhatsApp como destino de campanas", output: "CRM y WhatsApp listos" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Proximos pasos + agendar Foundation Review", output: "Foundation Review agendada" },
    ],
    flujoTemas: [
      "Presentacion del equipo asignado y roles",
      "Review de la propuesta aceptada (recap de F1)",
      "Explicar el proceso de Foundation: que se va a hacer y en que orden",
      "Revisar requerimientos pendientes (brand assets, accesos, datos)",
      "Setup de CRM (HubSpot Free) con participacion de Frany",
      "Coordinar con agencia de LinkedIn (Nicolas Blasotta) para alinear calendarios",
      "Definir canales de comunicacion (grupo WhatsApp, frecuencia de updates)",
      "Alinear expectativas: timelines, primeros resultados esperados",
      "Q&A con el cliente",
    ],
    temasWow: [
      "Mostrar ejemplo de dashboard de REE Metrics con data de otro cliente (anonimizado)",
      "Explicar como funciona el tracking de leads y por que importa para B2B",
      "Compartir benchmark de CPL en servicios B2B / eventos corporativos Argentina",
    ],
    checklist: {
      titulo: "Preparacion KO Call",
      items: [
        { label: "Agendar fecha con Celes y Frany", status: "pendiente", notas: null },
        { label: "Enviar invite de Google Calendar", status: "pendiente", notas: null },
        { label: "Preparar deck de presentacion (recap F1 + plan F2)", status: "pendiente", notas: null },
        { label: "Tener datos de benchmark listos (CPL B2B eventos)", status: "pendiente", notas: null },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
        { label: "Coordinar con Nicolas Blasotta (consultor externo) para alineacion", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: null,
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "BTLandia tiene 18 anos de reputacion impecable pero cero captacion digital. El 100% de sus clientes llegan por referidos y networking personal de Celes, lo cual no escala. El segmento de medianas empresas esta completamente desatendido por canal digital. La marca tiene un diferencial unico: expertise de agencia grande con atencion de boutique. Captacion es la palanca correcta: primero que las medianas empresas descubran que BTLandia existe, despues convertir a leads calificados via WhatsApp.",
  },

  icp: [
    {
      segmento: "Director/Gerente de Marketing de Mediana Empresa",
      descripcion: "Decision maker de marketing en empresa de 50-500 empleados, sector industrial/servicios/tecnologia. Tiene presupuesto para eventos pero no tiene una agencia de confianza. Organiza eventos de forma casera o improvisada. 30-50 anos, activo en Meta e Instagram.",
      frase: "Necesito profesionalizar los eventos de mi empresa pero no se por donde empezar",
      dolores: [
        "No tiene una agencia de eventos de confianza para su empresa",
        "Los eventos que organiza internamente quedan mediocres y no generan impacto",
        "Las agencias grandes no le dan bola porque su empresa no es una corporacion",
        "Pierde tiempo buscando proveedores individuales (catering, salon, audio, deco) sin garantia de resultado",
        "No puede evaluar si lo que le cobran es justo porque no tiene referencia del mercado",
      ],
      deseos: [
        "Contratar una agencia llave en mano que se encargue de todo",
        "Generar eventos que impacten a su equipo, clientes o directivos",
        "Un proceso rapido y sin fricciones desde la idea hasta la ejecucion",
        "Encontrar un partner de largo plazo para todos los eventos de la empresa",
      ],
      objeciones: [
        "Debe ser carisimo si trabajan con Fiat y YPF (su portfolio es de corporaciones)",
        "No se si atienden empresas de mi tamano",
        "Podemos hacerlo internamente y ahorrarnos la agencia",
        "No me queda claro que incluye el servicio y que no",
      ],
      prioridad: "primario",
      recurrencia: "media",
    },
    {
      segmento: "Gerente de RRHH de Mediana Empresa en Crecimiento",
      descripcion: "Responsable de cultura y equipo en empresa de 50-300 empleados en crecimiento. Necesita organizar kick-offs, team buildings y eventos de integracion. Piensa en 'alinear al equipo', no en 'contratar agencia de eventos'. 30-45 anos, activo en LinkedIn y Meta.",
      frase: "Quiero alinear a mi equipo pero no se como organizar algo que realmente impacte",
      dolores: [
        "El equipo esta desalineado por el crecimiento rapido de la empresa",
        "No sabe como organizar un evento estrategico que vaya mas alla de un after office",
        "El CEO le pide resultados de cultura pero no le da herramientas ni orientacion",
        "Las opciones que encuentra son o demasiado informales o demasiado caras",
      ],
      deseos: [
        "Un evento de cultura que realmente impacte y alinee al equipo",
        "Un partner que entienda la estrategia detras del evento, no solo la logistica",
        "Usar el kick-off como herramienta de alineacion y motivacion",
        "Poder mostrar al CEO el ROI de invertir en cultura y eventos internos",
      ],
      objeciones: [
        "Una agencia de eventos no va a entender nuestra estrategia de cultura",
        "El presupuesto para eventos internos es acotado",
        "Podemos organizar algo interno sin contratar una agencia",
        "Nunca contrate una agencia de eventos, no se como funciona",
      ],
      prioridad: "primario",
      recurrencia: "baja",
    },
  ],

  propuestaDeValor: {
    descripcion: "Agencia creativa con 18 anos de expertise en eventos corporativos y experiencias de marca. Portfolio de corporaciones de primer nivel (Fiat, Stellantis, YPF Agro, Avon, Club Med, Citroen) con la flexibilidad y atencion personalizada de una agencia boutique. Zero churn reportado en 18 anos. Nuevo producto en desarrollo: kick-off paquetizado para medianas empresas.",
    diferenciador: "Expertise de agencia grande con atencion de agencia boutique. 18 anos, zero churn. Acceso directo a la fundadora. El unico partner que profesionaliza eventos de medianas empresas con el mismo nivel de ejecucion que aplica a corporaciones multinacionales.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Decision maker con evento concreto (fecha, tipo de evento, presupuesto definido). Intent de compra claro.",
      accion: "Contactar a Celes en menos de 2 horas via WhatsApp. Agendar call de diagnostico.",
    },
    {
      categoria: "B",
      descripcion: "Interesado pero sin evento definido. Pregunta generica sobre servicios, capacidades o portfolio. Interes sin urgencia.",
      accion: "Contactar en menos de 24 horas. Enviar portfolio + casos relevantes por WhatsApp.",
    },
    {
      categoria: "C",
      descripcion: "Interaccion en redes (like, comentario, share) sin mensaje directo. O proveedor/promotor que quiere ofrecer servicios.",
      accion: "No requiere contacto directo. Proveedores redirigir a formulario de contacto web.",
    },
  ],

  kpis: [
    { nombre: "CPL (lead calificado via WhatsApp)", objetivo: "USD 15-30", fuente: "Meta Ads + REE Metrics" },
    { nombre: "Leads calificados por mes", objetivo: "15-25 leads/mes", fuente: "WhatsApp + CRM" },
    { nombre: "Tasa de conversion lead > propuesta", objetivo: "20%+", fuente: "CRM (HubSpot)" },
    { nombre: "Pipeline generado (valor estimado)", objetivo: null, fuente: "CRM" },
    { nombre: "Visitas al perfil de Instagram", objetivo: null, fuente: "Instagram Insights" },
    { nombre: "Crecimiento seguidores IG", objetivo: null, fuente: "Instagram Insights" },
    { nombre: "Alcance mensual", objetivo: null, fuente: "Meta Ads" },
    { nombre: "Engagement rate", objetivo: null, fuente: "Instagram Insights" },
  ],

  presupuesto: {
    pauta: "USD 500/mes (tarjeta de Celes en Meta)",
    fee: "USD 500/mes (USD 450 servicio + USD 50 REE Metrics)",
    total: "USD 1,000/mes (fee + pauta)",
    cplTarget: "USD 15-30 por lead calificado via WhatsApp",
    limiteGastoCuenta: "USD 600/mes",
  },

  creativos: {
    angulos: [
      {
        nombre: "Tu evento, nuestro expertise",
        dolorQueResuelve: "La mediana empresa organiza eventos caseros con resultados mediocres",
        mensajeClave: "18 anos de expertise en eventos corporativos al servicio de tu empresa",
        formato: "Carrusel + Video",
      },
      {
        nombre: "El kick-off que tu empresa necesita",
        dolorQueResuelve: "Empresas en crecimiento con equipos desalineados",
        mensajeClave: "El kick-off es una herramienta de alineacion estrategica, no un after office",
        formato: "Video (Celes a camara) + Carrusel",
      },
      {
        nombre: "Eventos que hacen hablar",
        dolorQueResuelve: "Necesidad de awareness y contenido de posicionamiento",
        mensajeClave: "Creatividad + ejecucion con 18 anos de trayectoria",
        formato: "Reels (timelapse, BTS) + Carrusel",
      },
      {
        nombre: "Del presupuesto al evento perfecto",
        dolorQueResuelve: "No sabe cuanto cuesta ni que incluye contratar una agencia de eventos",
        mensajeClave: "Cada evento a medida de tu presupuesto, sin sorpresas",
        formato: "Carrusel + Imagen",
      },
    ],
    formatos: ["Video Comercial Vertical (9:16)", "Carrusel (1080x1080)", "Reel/Timelapse", "Imagen estatica (1080x1350)"],
    tono: "Profesional pero cercano. Autoridad sin arrogancia. Hablar como experto que entiende tus problemas y te los resuelve. Evitar lenguaje generico de agencia. Priorizar casos reales y resultados tangibles sobre promesas vacias.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_btlandia_meta_leadgen_kickoff",
      "ree_btlandia_meta_leadgen_expertise",
      "ree_btlandia_meta_awareness_bts",
    ],
  },

  arquitectura: [
    {
      nombre: "BTLandia_B2B_LeadGen",
      objetivo: "Mensajes (WhatsApp)",
      status: "en-desarrollo",
      destino: "WhatsApp Business de BTLandia",
      kpisCampana: ["Conversaciones iniciadas", "CPL (lead calificado)", "Leads calificados/mes"],
      presupuestoCampana: { diario: "USD $10/día", mensual: "USD $300/mes" },
      adSets: [
        {
          nombre: "Conjunto_Dir_Marketing",
          segmentacion: "30-50 anos, CABA + GBA. Cargos: Director de Marketing, Gerente de Marketing, CMO, Brand Manager. Empresas 50-500 empleados. Intereses: Eventos corporativos, Marketing BTL, Experiencias de marca, Team building",
          ads: [
            "Anuncio_Carrusel_Expertise_V1 | Portfolio BTLandia: Fiat, YPF Agro, Club Med, Citroen",
            "Anuncio_Video_CelesKickoff_V1 | Celes a camara: el kick-off que tu empresa necesita",
            "Anuncio_Carrusel_Kickoff_V1 | Que incluye un kick-off profesional (antes/despues)",
            "Anuncio_Video_BTS_V1 | Timelapse/BTS de montaje de evento corporativo",
            "Anuncio_Imagen_18anos_V1 | 18 anos profesionalizando eventos. Tu empresa es la proxima.",
          ],
        },
        {
          nombre: "Conjunto_RRHH_Operaciones",
          segmentacion: "30-50 anos, CABA + GBA. Cargos: Gerente de RRHH, Director de Operaciones, People Manager, Culture Lead. Empresas 50-300 empleados. Intereses: Team building, Cultura organizacional, Recursos Humanos, Gestion de personas",
          ads: [
            "Anuncio_Video_Celes_V1 | Celes a camara: alinea a tu equipo con un kick-off profesional",
            "Anuncio_Carrusel_Equipos_V1 | Empresas que alinearon sus equipos con BTLandia",
            "Anuncio_Imagen_Cultura_V1 | Cultura no se construye con emails. Se construye con experiencias.",
            "Anuncio_Carrusel_Razones_V1 | 4 razones para profesionalizar los eventos de tu empresa",
            "Anuncio_Video_BTS_V1 | Behind the scenes de team building corporativo",
          ],
        },
      ],
    },
    {
      nombre: "BTLandia_Awareness",
      objetivo: "Interaccion",
      status: "activa",
      destino: "Perfil de Instagram (@btlandia)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Interacciones"],
      presupuestoCampana: { diario: "USD $7/día", mensual: "USD $200/mes" },
      adSets: [
        {
          nombre: "Conjunto_General_CABA_GBA",
          segmentacion: "25-55 anos, CABA + GBA. Intereses: Eventos corporativos, Empresa mediana, Startup, Team building, Fiestas corporativas. Sin CTA directo, solo posicionamiento.",
          ads: [
            "Reel_BTS_ExpoAgro_V1 | Timelapse montaje stand ExpoAgro (YPF Agro)",
            "Reel_Momentos_V1 | Mejores momentos de eventos corporativos BTLandia",
            "Reel_BTS_Produccion_V1 | Behind the scenes de produccion de evento premium",
            "Imagen_Portfolio_V1 | Portfolio: Fiat, Jeep, Iveco, Stellantis, YPF Agro, Avon, Club Med, Citroen",
            "Reel_SalonVacio_V1 | De salon vacio a evento impactante (timelapse transformacion)",
            "Imagen_18anos_V1 | 18 anos creando experiencias que hacen hablar",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Celeste Policastro (Celes) + Frany Attadia (soporte operativo)",
    capacidadDiaria: "Moderada. Celes es la principal comercial y cierra todas las ventas personalmente.",
    tiempoRespuesta: "Variable. Depende de la agenda de Celes. Frany puede hacer primer contacto.",
    validado: false,
  },

  ofertas: null,
  cambiosEcommerce: null,
  competenciaAds: null,

  notas: "BTLandia es el segundo cliente de Foundation F2. Caso puro B2B: servicios de eventos corporativos para medianas empresas. A diferencia de Defu (B2C ecommerce), aca el funnel es WhatsApp > call de diagnostico > propuesta.\n\nCeles (Celeste Policastro) es la fundadora y principal comercial. Cierra todas las ventas personalmente, lo cual es cuello de botella para escalar. Frany Attadia esta en proceso de incorporacion al equipo para soportar la etapa de onboarding y primer contacto con leads.\n\nNicolas Blasotta es un consultor externo que asesora a Celes en estrategia de comunicacion. Es necesario coordinar con el para alinear mensajes entre LinkedIn (gestionado por agencia externa hace 1.5+ anos) y Meta/IG (gestionado por REE).\n\nEl producto de kick-off paquetizado para medianas empresas todavia no esta definido. Las campanas arrancan con portfolio general de BTLandia y se itera a medida que se valide el ICP y el mensaje. La estacionalidad es clave: octubre-diciembre es temporada alta de eventos corporativos (cierres de ano, kick-offs Q1). Hay que tener campanas activas antes de octubre.\n\nIntegracion CRM: USD 150 one-time incluido en el primer mes (total primer mes USD 650). Se recomienda HubSpot Free por integracion nativa con Meta Ads.\n\nFuturo: evaluar agente de IA para clasificacion automatica de leads entrantes por WhatsApp e Instagram DMs.",

  // Roadmap
  roadmap: [
    { nombre: "B2B Lead Gen (WhatsApp)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
    { nombre: "Awareness (Instagram)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
      { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
    ]},
  ],

  // Foundation Review presentation
  proximosPasos: [
    {
      titulo: "Setup Meta + CRM",
      responsable: "REE Growth + Celes",
      tiempo: "Esta semana",
      items: [
        "Crear Business Portfolio, Facebook Page, Ad Account bajo growth@reecreativos.com",
        "Vincular Instagram @btlandia como cuenta Business",
        "Agregar tarjeta de Celes en Meta para debito de campanas",
        "Setup de HubSpot Free + integracion con Meta Ads (USD 150 one-time)",
      ],
    },
    {
      titulo: "Produccion Creativa + Setup Campanas",
      responsable: "REE Creativos / REE Growth",
      tiempo: "Semanas 2 - 3",
      items: [
        "Produccion de ~16 piezas (videos, carruseles, imagenes) para ambas campanas",
        "4 angulos creativos: Expertise, Kick-off, Awareness BTS, Presupuesto",
        "Armado de BTLandia_B2B_LeadGen y BTLandia_Awareness en Meta Ads",
        "Recopilar contenido de eventos pasados de BTLandia (fotos, videos BTS)",
      ],
    },
    {
      titulo: "Coordinacion y Alineacion",
      responsable: "Celes + Frany + REE",
      tiempo: "Semanas 2 - 3",
      items: [
        "Alinear calendario editorial con agencia de LinkedIn",
        "Definir proceso de atencion de leads (Celes + Frany)",
        "Coordinar con Nicolas Blasotta la estrategia de comunicacion",
        "Definir packaging del kick-off paquetizado para medianas empresas",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call" },
    { semana: 3, label: "Foundation Review" },
    { semana: 5, label: "Call ADS" },
    { semana: 7, label: "Call ADS" },
    { semana: 8, label: "Review Final" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "KO Call", desc: "Kickoff con Celes. Configuracion de Meta Ads, accesos, CRM. Se deja todo listo para empezar.", status: "done" },
    { semana: "S3", nombre: "Foundation Review", desc: "Revision completa del setup: campanas definidas, audiencias, angulos creativos, demo REE Metrics. Aprobacion para lanzar.", status: "current" },
    { semana: "S5", nombre: "Launch B2B Lead Gen", desc: "Lanzamiento de la campana B2B Lead Gen. Review de metricas de awareness. Activacion del funnel de WhatsApp.", status: "pending" },
    { semana: "S7", nombre: "Call ADS", desc: "Seguimiento de campanas activas. Optimizaciones en base a datos, ajustes de audiencias.", status: "pending" },
    { semana: "S8", nombre: "Review Final", desc: "Revision del periodo completo. Resultados vs KPIs, aprendizajes, recomendaciones para el siguiente ciclo.", status: "pending" },
  ],
};

// --- Generate 2 HTMLs (onboarding + foundation review, no brief) ---

const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);

// Output dirs
const slug = data.clientInfo.slug;
const baseDir = new URL("./", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outputs = [
  { dir: join(baseDir, "clients-onboardings", slug), file: `onboarding-${slug}.html`, html: onboarding },
  { dir: join(baseDir, "clients-strategies", slug), file: `foundation-review-${slug}.html`, html: strategy },
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
  const desktopPath = join(desktop, out.file);
  writeFileSync(desktopPath, out.html, "utf-8");
  console.log(`Copy: ${desktopPath}`);
}

// Publish Foundation Review to ree-website
const reeWebsiteFoundations = join(baseDir, "..", "..", "ree-website", "public", "foundations");
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
