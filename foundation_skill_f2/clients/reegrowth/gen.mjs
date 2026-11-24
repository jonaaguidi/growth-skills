import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const FORM_URL = "https://growth.reecreativos.com/#agendar";

const data = {
  clientInfo: {
    nombreEmpresa: "REE Growth",
    slug: "reegrowth",
    nombreContacto: "Equipo REE",
    industria: "Paid Media / Growth Marketing (B2B)",
    sitioWeb: "growth.reecreativos.com",
    email: "growth@reecreativos.com",
    telefono: null,
    fechaCierre: "2026-09-29",
  },
  datosF1: {
    inversionMensual: "USD 300/mes (pauta propia)",
    presupuestoPauta: "USD 300/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Meta Ads (Instagram + Facebook)", "Landing growth.reecreativos.com", "REE Metrics"],
    palancaPropuesta: "Captación: abrir un canal pago que no dependa de referidos",
    campanasVendidas: ["BOFU Lead Gen (Formulario)"],
    duracionProyecto: "8 semanas",
    fechaInicio: "29/09",
    fechaFin: "24/11",
    fechaInicioISO: "2026-09-29",
  },

  // A. Onboarding (no se renderiza en el Foundation Review, se mantiene por contrato de datos)
  equipoAsignado: [
    { nombre: "Jonás", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suárez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] Growth - Captación", status: "pendiente", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "pendiente", notas: null },
      { label: "Definir quién atiende los leads que entran por el formulario", status: "pendiente", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Usar el portfolio propio de growth@reecreativos.com", status: "hecho", notas: "REE ya opera su propio Business Portfolio." },
        { label: "Verificar permisos del equipo REE", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Verificar Facebook Page de REE Creativos", status: "pendiente", notas: null },
        { label: "Vincular Page al Business Portfolio", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que la cuenta de Instagram sea Business", status: "pendiente", notas: null },
        { label: "Vincular Instagram al portfolio", status: "pendiente", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Crear cuenta publicitaria: 'REE Growth - Ad Account'", status: "pendiente", notas: null },
        { label: "Configurar timezone America/Buenos_Aires y moneda USD", status: "pendiente", notas: null },
        { label: "Cargar medio de pago", status: "pendiente", notas: null },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Instalar Pixel en growth.reecreativos.com", status: "pendiente", notas: "Requisito previo al lanzamiento." },
        { label: "Configurar evento Lead en el envío del formulario", status: "pendiente", notas: "El formulario de #agendar es la conversión de la campaña." },
        { label: "Verificar con Meta Pixel Helper y Test Events", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Evaluar CAPI para el evento Lead del formulario", status: "pendiente", notas: "Segunda fase, una vez validado el volumen." },
      ],
    },
    edgeCases: [
      {
        condicion: "Cliente propio (REE sobre REE)",
        aplica: true,
        instrucciones: "REE Growth aplica su propio framework F0-F1-F2 sobre sí misma. No hay cliente externo que apruebe: las decisiones se toman internamente y el Foundation Review funciona como documento de alineación del equipo.",
      },
      {
        condicion: "Cero pauta histórica en la cuenta",
        aplica: true,
        instrucciones: "REE nunca pautó para captar clientes propios. No hay data histórica ni píxel con volumen. Las primeras semanas son de aprendizaje del algoritmo con presupuesto acotado (USD 10/día).",
      },
      {
        condicion: "Tracking del formulario sin verificar",
        aplica: true,
        instrucciones: "El formulario de growth.reecreativos.com/#agendar todavía no dispara el evento Lead. Sin ese evento la campaña de conversión no puede optimizar. Es bloqueante para el lanzamiento.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo REE en alta resolución (PNG + vector)", status: "hecho", notas: null },
        { label: "Paleta y tipografías de marca", status: "hecho", notas: "Rojo #DD0513, Archivo / Archivo Black / Space Mono." },
        { label: "Capturas y clips de REE Metrics para los videos", status: "pendiente", notas: "Material clave para las piezas 1 y 2." },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso al repo de ree-website para instalar el Pixel", status: "hecho", notas: null },
        { label: "Google Analytics / Vercel Analytics de la landing", status: "pendiente", notas: null },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "No aplica: el destino de la campaña es el formulario de la landing", status: "no-aplica", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién toma el diagnóstico de 45 min", status: "pendiente", notas: null },
        { label: "Definir tiempo máximo de respuesta (<24h)", status: "pendiente", notas: null },
        { label: "Configurar notificación de formulario enviado", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: null,
    tracking: {
      titulo: "Tracking",
      items: [
        { label: "Pixel de Meta en growth.reecreativos.com", status: "pendiente", notas: null },
        { label: "Evento Lead en el submit del formulario", status: "pendiente", notas: null },
        { label: "Verificación end-to-end del envío", status: "pendiente", notas: null },
      ],
    },
  },

  koCall: {
    fechaPropuesta: null,
    duracionTotal: "45 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Contexto: por qué REE abre canal pago", output: "Contexto alineado" },
      { nombre: "Setup técnico", duracion: "20 min", objetivo: "Pixel, evento Lead y verificación del formulario", output: "Tracking listo" },
      { nombre: "Campaña", duracion: "15 min", objetivo: "Armado de REEGROWTH_Leads y el ad set", output: "Campaña cargada" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Próximos pasos y fecha de lanzamiento", output: "Lanzamiento agendado" },
    ],
    flujoTemas: [
      "Por qué el 100% de los clientes llega por referidos y por qué eso no escala",
      "ICP de demanda activa: quién ya invierte en Meta Ads y no sabe qué le funciona",
      "Las 4 piezas y el dolor que ataca cada una",
      "Setup del Pixel y el evento Lead del formulario",
      "Presupuesto y expectativa de CPL",
    ],
    temasWow: [
      "Mostrar el propio dashboard de REE Metrics como demo en vivo",
      "Mostrar el Timeline de Kill/Scale de un cliente activo (anonimizado)",
    ],
    checklist: {
      titulo: "Preparación KO Call",
      items: [
        { label: "Instalar Pixel en la landing", status: "pendiente", notas: null },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
        { label: "Tener las 4 piezas aprobadas internamente", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: null,
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "REE Growth tiene el posicionamiento, la oferta y la landing resueltos: el framework de 5 fases está definido, REE Metrics está operativo y la propuesta de valor está escrita. Lo que falta es canal. Hoy el 100% de los clientes llega por referidos y networking, que no escala ni es predecible. Captación es la palanca correcta: abrir un canal pago BOFU que lleve a quien ya invierte en Meta Ads —y no sabe qué le funciona— directo al formulario de diagnóstico.",
  },

  icp: [
    {
      segmento: "Marca, empresa o emprendedor que ya invierte en Meta Ads y no sabe qué le funciona",
      descripcion: "Negocio que ya pauta de forma sostenida (USD 500-5.000/mes), sea e-commerce o servicio. El decisor es el dueño/fundador o el responsable de marketing. Ya pasó por un freelance o una agencia, o maneja la cuenta él mismo. No discute si hay que pautar: eso ya está resuelto. Lo que no tiene es criterio para decidir qué escalar y qué frenar.",
      frase: "Invierto todos los meses, pero no sé qué me está funcionando",
      dolores: [
        "Invierte todos los meses sin saber qué anuncio trae clientes y cuál quema presupuesto",
        "Se produce y se pauta sin analizar qué ángulo convierte: nada se testea, nada se aprende",
        "Piezas lindas, likes y alcance, pero las ventas no llegan",
        "No entiende Meta Ads ni los reportes: no puede leer qué se hizo ni cuánto generó la inversión",
      ],
      deseos: [
        "Saber qué anuncio trae clientes y a qué costo",
        "Un método con criterio para decidir qué escalar y qué frenar",
        "Reportes legibles sin tener que ser experto en Meta Ads",
        "Que cada peso invertido se mida, se optimice y se escale",
      ],
      objeciones: [
        "Ya trabajé con una agencia y no vi resultados",
        "El fee me sale más que la pauta",
        "Ya tengo quien me maneja la pauta",
        "Necesito resultados ya, no en 3 meses",
      ],
      recurrencia: "media",
      badge: "Demanda activa",
      ejemplosMarcas: [
        {
          marca: "E-commerce con pauta sostenida",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Dueño / Fundador",
          caso: "Marca con tienda online que invierte todos los meses en Meta Ads y escala el presupuesto sin poder leer qué producto o qué ángulo sostiene las ventas. Cuando el ROAS baja, la única palanca que conoce es subir o bajar el presupuesto.",
        },
        {
          marca: "Marca de servicio o B2B",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Responsable de Marketing",
          caso: "Empresa de servicio que terceriza la pauta y recibe reportes de alcance e impresiones. No sabe cuántos leads llegaron de cada anuncio ni cuántos de esos cerraron, así que no puede defender el presupuesto ante la dirección.",
        },
      ],
    },
  ],

  propuestaDeValor: {
    descripcion: "Servicio de paid media operado de punta a punta con un framework de 5 fases: Diagnóstico, Foundation, Build, Launch y Scale. REE produce las piezas, arma la estructura de campañas, testea ángulos y documenta cada decisión de Kill/Scale en REE Metrics, el dashboard propio donde el cliente ve en tiempo real qué anuncio trae clientes y a qué costo.",
    diferenciador: "No es una agencia que pauta y reporta alcance. Es un método con criterio de decisión: cada anuncio se testea contra un dolor concreto del ICP, y cada cambio en la cuenta queda registrado con su porqué en un Timeline que el cliente puede leer sin ser experto.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Ya invierte en Meta Ads de forma sostenida (USD 500+/mes), el decisor completa el formulario y tiene una necesidad concreta.",
      accion: "Contactar en menos de 24 horas y agendar el diagnóstico de 45 min.",
    },
    {
      categoria: "B",
      descripcion: "Invierte poco o de forma intermitente, o el formulario lo completa alguien que no decide el presupuesto.",
      accion: "Contactar en 48 horas, calificar presupuesto y madurez antes de agendar.",
    },
    {
      categoria: "C",
      descripcion: "No invierte en pauta, busca empleo, ofrece servicios o es otra agencia.",
      accion: "No agendar diagnóstico. Descartar y excluir del retargeting.",
    },
  ],

  kpis: [
    { nombre: "Formularios enviados", objetivo: "8-12 por mes", fuente: "Meta Ads + REE Metrics" },
    { nombre: "CPL (costo por formulario)", objetivo: "USD 25-40", fuente: "Meta Ads" },
    { nombre: "CTR", objetivo: "1,2%+", fuente: "Meta Ads" },
    { nombre: "Tasa de conversión de la landing", objetivo: "3%+", fuente: "REE Metrics" },
    { nombre: "Diagnósticos agendados", objetivo: null, fuente: "Calendario comercial" },
    { nombre: "Tasa de cierre diagnóstico > propuesta", objetivo: null, fuente: "Seguimiento comercial" },
  ],

  presupuesto: {
    pauta: "USD 300/mes (USD 10/día)",
    fee: "Operación interna (equipo REE Growth)",
    total: "USD 300/mes de pauta",
    cplTarget: "USD 25-40 por formulario enviado",
    limiteGastoCuenta: "USD 300/mes a nivel cuenta publicitaria",
  },

  creativos: {
    piezasPorIcp: [
      {
        icp: "Marca, empresa o emprendedor que ya invierte en Meta Ads y no sabe qué le funciona",
        piezas: [
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Invierte todos los meses sin saber qué anuncio trae clientes y cuál quema presupuesto.",
            solucion: "El método de 5 fases de REE Growth (Diagnóstico, Foundation, Build, Launch, Scale) más REE Metrics: cada anuncio se testea, se mide y se decide con datos, no con intuición.",
            comunicacion: "[0-3s] HOOK — Plano medio directo a cámara, fondo limpio, texto overlay con la pregunta: 'Ponés plata en ads todos los meses... ¿sabés cuál te trae clientes?' [3-7s] BODY — Insert de una cuenta de Meta Ads con muchas filas y métricas, zoom lento sobre las columnas: 'La mayoría no lo sabe, y ahí es donde se quema el presupuesto.' [7-12s] BODY — Vuelve a cámara, motion graphics laterales con las 5 fases (Diagnóstico, Foundation, Build, Launch, Scale) apareciendo una a una: 'Nosotros trabajamos con un método de 5 fases, cada anuncio se testea contra un dolor concreto y se mide.' [12-16s] BODY — Screen recording del dashboard de REE Metrics, cursor recorriendo las tarjetas de campaña: 'En REE Metrics ves qué anuncio trae clientes y a qué costo, sin ser experto.' [16-20s] CTA — Cierra mirando a cámara, placa roja con la URL de la landing y el badge de 45 min: 'Agendá tu diagnóstico gratuito de 45 minutos desde el link.' [20-22s] CIERRE — Motion graphics con logo REE Growth sobre fondo negro y la URL.",
            hook: "Ponés plata en ads todos los meses... ¿sabés cuál te trae clientes?",
            body: "La mayoría no lo sabe, y ahí es donde se quema el presupuesto. Nosotros trabajamos con un método de 5 fases, cada anuncio se testea contra un dolor concreto y se mide. En REE Metrics ves qué anuncio trae clientes y a qué costo, sin ser experto.",
            cta: "Agendá tu diagnóstico gratuito de 45 minutos desde el link.",
            copyAnuncio: "Ponés plata en ads todos los meses... ¿sabés cuál te trae clientes? 🤔\n\n🔥 La mayoría no lo sabe: ahí es donde se quema el presupuesto.\n✅ Método de 5 fases: Diagnóstico → Foundation → Build → Launch → Scale.\n📊 En REE Metrics ves qué anuncio trae clientes y a qué costo, sin ser experto.\n\n👉 Agendá tu diagnóstico gratuito de 45 min en growth.reecreativos.com",
            pilar: "Método (cómo trabaja REE)",
            tema: "Claridad de inversión / Qué anuncio trae clientes",
            formatoNarrativo: "Direct to Camera - Talking Head con inserts de producto",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Motion Graphics" },
            duracion: "18-22s",
            destinoUrls: [FORM_URL],
            enRevision: false,
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "No entiende Meta Ads ni los reportes: no puede leer qué se hizo ni cuánto generó la inversión.",
            solucion: "REE Metrics traduce la cuenta publicitaria a un dashboard legible y un Timeline donde queda registrado cada decisión de Kill o Scale con su porqué.",
            comunicacion: "[0-4s] HOOK — Screen recording de la interfaz de Meta Ads con columnas y filtros, scroll rápido y confuso, texto overlay con la frase: 'Si abrís Meta Ads y no entendés nada, no es tu culpa.' [4-9s] BODY — Sigue el screen recording, cursor abriendo menús anidados y reportes exportados a planilla: 'La plataforma está hecha para operadores, no para vos que ponés la plata.' [9-15s] BODY — Corte al dashboard de REE Metrics, transición limpia, cursor recorriendo las tarjetas de gasto, alcance y resultados: 'Por eso armamos REE Metrics, un tablero donde ves en una sola pantalla qué se gastó y qué generó.' [15-21s] BODY — Screen recording del Timeline, se abren dos entradas etiquetadas Kill y Scale con su nota: 'Y un Timeline donde queda registrado cada anuncio que frenamos y cada uno que escalamos, con el porqué.' [21-24s] CTA — Placa roja a pantalla completa con la URL y el badge de 45 min: 'Agendá tu diagnóstico gratuito y te mostramos tu cuenta en vivo.' [24-25s] CIERRE — Motion graphics con logo REE Growth sobre fondo negro.",
            hook: "Si abrís Meta Ads y no entendés nada, no es tu culpa.",
            body: "La plataforma está hecha para operadores, no para vos que ponés la plata. Por eso armamos REE Metrics, un tablero donde ves en una sola pantalla qué se gastó y qué generó. Y un Timeline donde queda registrado cada anuncio que frenamos y cada uno que escalamos, con el porqué.",
            cta: "Agendá tu diagnóstico gratuito y te mostramos tu cuenta en vivo.",
            copyAnuncio: "Si abrís Meta Ads y no entendés nada, no es tu culpa 😮‍💨\n\n⚙️ La plataforma está hecha para operadores, no para vos que ponés la plata.\n📊 REE Metrics: un tablero donde ves en una pantalla qué se gastó y qué generó.\n🧾 Timeline: cada anuncio que frenamos y cada uno que escalamos, con el porqué.\n\n👉 Agendá tu diagnóstico gratuito de 45 min y te mostramos tu cuenta en vivo.",
            pilar: "Producto (REE Metrics)",
            tema: "Legibilidad / Transparencia de la operación",
            formatoNarrativo: "Screen Recording - Demo de producto con voz en off",
            estructuraNarrativa: "Problema - Producto - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Motion Graphics" },
            duracion: "20-25s",
            destinoUrls: [FORM_URL],
            enRevision: false,
          },
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Piezas lindas, likes y alcance, pero las ventas no llegan.",
            solucion: "Análisis de ángulos antes de producir: cada pieza ataca un dolor concreto del comprador, y el que convierte se escala. La creatividad apunta a vender, no a gustar.",
            comunicacion: "Flyer hero de alto contraste sobre fondo negro con el claim en Archivo Black rojo y blanco. Composición limpia, un solo mensaje. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: fondo negro con textura sutil, claim tipográfico a pantalla completa en Archivo Black. Sin foto de producto, la tipografía es el visual.",
              "Copy principal: 'LOS LIKES NO PAGAN SUELDOS' Subcopy: 'Piezas lindas, alcance y comentarios, pero las ventas no llegan. Sin análisis de ángulos, la creatividad no apunta al comprador.'",
              "CTA: 'Agendá tu diagnóstico gratuito de 45 min en growth.reecreativos.com' con el logo REE Growth al pie.",
            ],
            copyAnuncio: "LOS LIKES NO PAGAN SUELDOS 💸\n\n❌ Piezas lindas, alcance y comentarios, pero las ventas no llegan.\n🎯 Sin análisis de ángulos, la creatividad no apunta al comprador.\n✅ Cada pieza que producimos ataca un dolor concreto, y el ángulo que convierte se escala.\n\n👉 Agendá tu diagnóstico gratuito de 45 min en growth.reecreativos.com",
            pilar: "Método (cómo trabaja REE)",
            tema: "Creatividad que vende / Análisis de ángulos",
            formatoNarrativo: "Marca - Hero Tipográfico",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Cinematic", estilo: "Motion Graphics" },
            destinoUrls: [FORM_URL],
            enRevision: false,
          },
          {
            formato: "Carrusel (1080x1080)",
            dolor: "Se produce y se pauta sin analizar qué ángulo convierte: nada se testea, nada se aprende.",
            solucion: "Las 5 fases de REE Growth (Diagnóstico, Foundation, Build, Launch, Scale): un proceso donde cada ángulo se testea contra un dolor, se mide y se decide escalar o frenar con datos.",
            comunicacion: "Carrusel x3 slides sobre fondo negro con placas tipográficas en Archivo Black y acentos rojos. Motion graphics simples, sin fotografía. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 'PAUTAR SIN TESTEAR ES APOSTAR' Subcopy chico: 'Se produce, se lanza y no se aprende nada.' Fondo negro con el claim a pantalla completa.",
              "Slide 2: Las 5 fases en fila con numeración y línea de conexión roja: '01 Diagnóstico · 02 Foundation · 03 Build · 04 Launch · 05 Scale'. Subcopy: 'Cada ángulo se testea contra un dolor concreto del comprador.'",
              "Slide 3: 'El que convierte se escala. El que no, se frena y queda documentado.' Placa de cierre con logo REE Growth y el CTA 'Diagnóstico gratuito de 45 min en growth.reecreativos.com'.",
            ],
            copyAnuncio: "Pautar sin testear es apostar 🎲\n\n❌ Se produce, se lanza y no se aprende nada.\n✅ 5 fases: Diagnóstico → Foundation → Build → Launch → Scale.\n🎯 Cada ángulo se testea contra un dolor concreto del comprador.\n📈 El que convierte se escala. El que no, se frena y queda documentado.\n\n👉 Agendá tu diagnóstico gratuito de 45 min en growth.reecreativos.com",
            pilar: "Método (cómo trabaja REE)",
            tema: "Testeo de ángulos / Las 5 fases",
            formatoNarrativo: "Marca - Storytelling por slides",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Motion Graphics" },
            destinoUrls: [FORM_URL],
            enRevision: false,
          },
        ],
      },
    ],
    formatos: ["Video Comercial Vertical (9:16)", "Posteo Rectangular (1080x1350)", "Carrusel (1080x1080)"],
    tono: "Directo, sin vueltas ni promesas infladas. Habla de plata, de criterio y de datos. Nada de jerga de agencia.",
    resumenPiezas: "4 piezas BOFU (ICP 1) — 1 dolor por pieza",
    notaPiezas: "Las 4 piezas apuntan al mismo destino: el formulario de diagnóstico de growth.reecreativos.com. Cada una ataca un dolor distinto del ICP de demanda activa, para poder leer en el testeo qué dolor tracciona más.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_reegrowth_meta_leads_quefunciona",
      "ree_reegrowth_meta_leads_metricsilegible",
      "ree_reegrowth_meta_leads_likesnopagan",
    ],
  },

  arquitectura: [
    {
      nombre: "REEGROWTH_Leads",
      objetivo: "Clientes potenciales (formulario en la landing)",
      descripcionCampana: "Campaña <b>BOFU directa a conversión</b>. Lleva a quien <b>ya invierte en Meta Ads</b> y no tiene claridad de qué le funciona al <b>formulario de diagnóstico</b> de growth.reecreativos.com. No busca awareness ni seguidores: busca <b>formularios enviados</b> de decisores con presupuesto de pauta activo.",
      tituloSeccion: "Campaña BOFU (Formulario)",
      tituloSubseccion: "Campaña BOFU en Meta Ads",
      status: "en-desarrollo",
      destino: "Formulario de la landing (growth.reecreativos.com/#agendar)",
      conversionCampana: "Formularios enviados (evento Lead en la landing)",
      kpisCampana: [
        "Formularios enviados (leads que entran)",
        "CPL (costo por formulario)",
        "CTR (interés que genera el anuncio)",
        "Tasa de conversión de la landing",
      ],
      presupuestoCampana: { diario: "USD $10/día", mensual: "USD $300/mes" },
      notaCampana: "Requisito previo al lanzamiento: Pixel instalado en growth.reecreativos.com y evento Lead disparándose en el envío del formulario. Sin ese evento la campaña de conversión no puede optimizar.",
      adSets: [
        {
          nombre: "Conjunto_YaInvierteEnAds",
          segmentacion: "25-55 años, Argentina. Cargos: dueño o fundador, director de marketing, gerente de marketing, e-commerce manager. Intereses: publicidad en redes sociales, marketing digital, comercio electrónico, emprendimiento. Comportamiento: administradores de páginas de Facebook",
          ads: [
            "Anuncio_Video_QueTeFunciona_V1 | Talking head: ponés plata en ads todos los meses, ¿sabés cuál te trae clientes?",
            "Anuncio_Video_MetaIlegible_V1 | Screen recording: si abrís Meta Ads y no entendés nada, no es tu culpa",
            "Anuncio_Posteo_LikesNoPagan_V1 | Hero tipográfico: los likes no pagan sueldos",
            "Anuncio_Carrusel_5Fases_V1 | Carrusel x3: pautar sin testear es apostar, las 5 fases",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Equipo comercial de REE Growth (Jonás + Sergio)",
    capacidadDiaria: "Hasta 2 diagnósticos de 45 min por día sin afectar la operación de clientes activos.",
    tiempoRespuesta: "Objetivo: menos de 24 horas desde el envío del formulario.",
    validado: false,
  },

  ofertas: null,
  cambiosEcommerce: null,
  competenciaAds: {
    marca: "agencias de paid media (Argentina)",
    cuenta: "Relevamiento de 9 cuentas de referencia",
    adLibraryUrl:
      "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&media_type=all&q=agencia%20de%20marketing&search_type=keyword_unordered",
    competidores: [
      {
        nombre: "Gótica",
        estado: "Marca DTC que se volvió viral y derivó en mentorías de Meta Ads y agencia propia (Gótica Metrics). Founder visible: Milagros Cocilobo.",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/goticabsas/",
      },
      {
        nombre: "Cáscara Collective",
        estado: "Colectivo creativo + formación por cohortes (PENTÁGONO, La Cáscara). Se aniche por disciplina (creatividad), no por rubro.",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/cascaragram/",
      },
      {
        nombre: "Techof",
        estado: "Agencia done-for-you de Meta, Google y TikTok Ads. Sin fundador visible en el perfil: tracciona por volumen de contenido (~26K seguidores).",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/techof__/",
      },
      {
        nombre: "Marketing & ADS",
        estado: "Agencia boutique con tope declarado de 20 clientes simultáneos (e-commerce, SaaS, B2B). Sin fundador visible (~18K seguidores).",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/marketing.and.ads/",
      },
      {
        nombre: "Clica",
        estado: "Anichada en e-commerce (Especialista Tiendanube), con servicios productizados. Founder visible: Mathias Chu, con marca personal desdoblada.",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/somos.clica/",
      },
      {
        nombre: "Everest Media",
        estado: "Anichada en e-commerce con foco en Tiendanube (Argentina y Uruguay). Founder visible: Federico Bongiorno.",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/everestmedia/",
      },
      {
        nombre: "BOMBA",
        estado: "Agencia 360 (branding, contenido, eventos y pauta), no paid media puro. Founder visible: Pupy Ortiz Basualdo.",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/agenciabomba/",
      },
      {
        nombre: "Qualita Studio",
        estado: "Agencia full-service (branding, SEO y paid media), no performance puro. Buenos Aires, desde 2021. Founders visibles: Matías Mendelberg y Juan Saissac (~36K seguidores).",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/qualita.studio/",
      },
      {
        nombre: "Dinámica",
        estado: "Marketing inmobiliario, 100% mono-rubro. Servicio propio (ELITE 360) + línea formativa (InmoFactory).",
        activo: true,
        avatarFile: null,
        instagramUrl: "https://www.instagram.com/dinamicarealestate/",
      },
    ],
    formatos: [],
    observacion:
      "El relevamiento de estas 9 cuentas muestra dos movimientos claros en el mercado argentino, y hoy REE no está parada en ninguno de los dos.\n\n" +
      "**1. Anichamiento por rubro.** Las agencias que más traccionan dejaron de venderle a cualquier negocio y se pararon sobre un vertical: e-commerce (Clica y Everest Media, ambas ancladas en Tiendanube y en su programa de Especialistas) e inmobiliario (Dinámica, mono-rubro, con servicio y formación propios). Los directorios del rubro ya listan estas categorías por separado, con decenas de agencias compitiendo dentro de cada una. REE hoy compite en la categoría genérica de performance, que es la más poblada y la que menos permite diferenciarse.\n\n" +
      "**2. La marca personal empuja a la agencia.** En 6 de las 9 cuentas hay un fundador con cara y nombre visible. El patrón más fuerte no es solo mostrar la cara, sino un stack de tres capas: **marca personal → producto formativo → agencia**. Gótica arrancó como marca de accesorios, se volvió viral, monetizó en mentorías de Meta Ads y recién después abrió la agencia. Clica separa la agencia de la marca personal del fundador, que vende consultoría 1 a 1 y un programa grupal. Cáscara vende bootcamps antes que servicio. Dinámica tiene su propia línea de formación.\n\n" +
      "**Contracara:** Techof y Marketing & ADS traccionan sin fundador visible, apoyadas en volumen de contenido. La marca personal acelera, pero no es condición necesaria.\n\n" +
      "**Dónde queda REE.** Por lo que comunican en sus perfiles y sitios, todas venden resultados y facturación. Ninguna vende **claridad y trazabilidad**, que es exactamente el dolor del ICP: no saber qué anuncio trae clientes. REE Metrics y el Timeline de Kill/Scale son el activo que ninguna de las 9 muestra. La campaña BOFU se para ahí: no competir por ser la mejor agencia, sino por ser la única que muestra qué pasó con cada peso invertido.",
  },

  notas: "REE Growth como cliente propio: se aplica el mismo framework F0-F1-F2 que se vende, sobre la propia agencia.\n\nDiagnóstico: REE tiene resueltos posicionamiento, oferta y landing. El framework de 5 fases está definido y REE Metrics está operativo. El cuello de botella es la captación: el 100% de los clientes llega por referidos y networking, que no escala ni permite proyectar pipeline.\n\nDecisión estratégica: arrancar directo por BOFU en vez de construir awareness. El ICP de demanda activa ya sabe que tiene que pautar (no hay que convencerlo de eso), así que el anuncio puede ir directo al dolor de no saber qué le funciona y al formulario de diagnóstico.\n\nPresupuesto acotado a propósito: USD 10/día durante 8 semanas para validar CPL y qué dolor tracciona antes de escalar. Con 4 piezas en un solo ad set, el objetivo de las primeras semanas es leer qué ángulo gana.\n\nBloqueante: el evento Lead del formulario todavía no está implementado. Es requisito previo al lanzamiento.\n\nCompetencia: se relevaron 9 cuentas de referencia. Dos tendencias a resolver como decisión de posicionamiento: anichamiento por vertical (e-commerce e inmobiliario son los más consolidados) y empuje de la marca desde el perfil personal del fundador. Pendiente: verificar en Meta Ad Library cuáles de esas cuentas pautan efectivamente y capturar referencias de ads.",

  // Roadmap
  roadmap: [
    {
      nombre: "BOFU Lead Gen (Formulario)",
      fases: [
        { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
        { nombre: "Build", semanaInicio: 2, semanaFin: 3 },
        { nombre: "Launch", semanaInicio: 4, semanaFin: 6 },
        { nombre: "Scale", semanaInicio: 7, semanaFin: 8 },
      ],
    },
  ],

  // REE Metrics: enfoque lead gen por formulario (REE no vende e-commerce acá)
  reeMetricsFeatures: [
    { titulo: "Dashboard", desc: "Campañas de Meta Ads en una sola vista: gasto, alcance, CTR y formularios enviados. Personalizable según requerimientos." },
    { titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por qué se escala o se frena cada anuncio (Kill/Scale) para que siempre quede claro qué se hizo y por qué." },
    { titulo: "Formularios", desc: "Seguimiento de los formularios enviados desde la landing: cantidad, costo por formulario (CPL) y qué anuncio los originó." },
  ],
  reeMetricsFuente: "el formulario de la landing",

  // Foundation Review presentation
  seccionesBloqueadas: [],

  proximosPasos: [
    {
      titulo: "Producción de piezas",
      responsable: "REE Creativos",
      tiempo: "Semanas 2-3",
      items: [
        "Producir las 4 piezas BOFU aprobadas en este documento",
        "Grabar los 2 videos 9:16 (talking head + screen recording de REE Metrics)",
        "Armar el carrusel de 3 slides y el posteo hero tipográfico",
        "Entregar las adaptaciones a Story (1080x1920) de las piezas estáticas",
      ],
    },
    {
      titulo: "Setup técnico",
      responsable: "REE Growth",
      tiempo: "Esta semana",
      items: [
        "Instalar el Pixel de Meta y configurar el evento Lead en el formulario de la landing",
        "Verificar el envío end-to-end con Test Events antes de lanzar",
        "Conectar la cuenta publicitaria a REE Metrics",
        "Armar la campaña REEGROWTH_Leads con el conjunto Conjunto_YaInvierteEnAds",
      ],
    },
    {
      titulo: "Decisiones de posicionamiento",
      responsable: "Equipo REE",
      tiempo: "Antes del Launch",
      items: [
        "Verificar en Meta Ad Library cuáles de los 9 competidores están pautando hoy y con qué ángulos",
        "Definir si la comunicación se aniche por vertical (e-commerce es el más maduro) o se mantiene transversal",
        "Definir si las piezas se empujan también desde el perfil personal del fundador, además de la cuenta de REE Growth",
        "Capturar referencias de ads de la competencia para sumarlas a la sección de Competencia",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "Foundation + Setup", fecha: "29/09" },
    { semana: 3, label: "Launch BOFU", fecha: "13/10" },
    { semana: 6, label: "Review Ads", fecha: "03/11" },
    { semana: 8, label: "Review Final", fecha: "24/11" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Foundation Review + Setup", desc: "Lunes 29/09. Revisión de este documento con el equipo: ICP, las 4 piezas y la estructura de campaña. Se arranca el setup técnico del Pixel y el evento Lead del formulario.", status: "current", fecha: "29/09" },
    { semana: "S3", nombre: "Launch BOFU", desc: "Lunes 13/10. Lanzamiento de REEGROWTH_Leads con las 4 piezas producidas. Verificación del tracking end-to-end y del primer formulario de prueba.", status: "pending", fecha: "13/10" },
    { semana: "S6", nombre: "Review Ads", desc: "Lunes 03/11. Tres semanas de data: qué dolor tracciona más, CPL por pieza, redistribución del presupuesto y decisiones de Kill/Scale.", status: "pending", fecha: "03/11" },
    { semana: "S8", nombre: "Review Final", desc: "Lunes 24/11. Cierre del ciclo de 8 semanas. Resultados vs KPIs, calidad de los leads que llegaron al diagnóstico y decisión de escalar el presupuesto.", status: "pending", fecha: "24/11" },
  ],
};

// --- Generate Foundation Review (unico entregable de este cliente) ---

const strategy = renderStrategyHtml(data);

// Output dirs
const slug = data.clientInfo.slug;
const clientDir = new URL("./", import.meta.url).pathname;
const projectRoot = new URL("../../", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outputs = [
  { dir: join(clientDir, "strategies"), file: `foundation-review-${slug}.html`, html: strategy },
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

  const desktopPath = join(desktop, out.file);
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
