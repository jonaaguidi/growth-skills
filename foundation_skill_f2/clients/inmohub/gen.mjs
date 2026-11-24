import { renderOnboardingHtml } from "../../dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { renderBriefHtml } from "../../dist/lib/brief-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const data = {
  clientInfo: {
    nombreEmpresa: "InmoHub",
    slug: "inmohub",
    nombreContacto: "Jonathan Aguidi",
    industria: "PropTech / Real Estate SaaS",
    sitioWeb: "inmohub.tech",
    email: null,
    telefono: null,
    fechaCierre: "2026-10-08",
  },
  datosF1: {
    inversionMensual: "USD 300/mes (fee REE)",
    presupuestoPauta: "USD 200/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "Landing page (inmohub.tech)"],
    palancaPropuesta: "Captación: awareness + funnel B2B-to-B2C (landing → signup)",
    campanasVendidas: ["Contenido Orgánico", "Awareness de Marca", "Conversiones (Landing page)"],
    duracionProyecto: "8 semanas",
    fechaInicio: null,
    fechaFin: null,
    fechaInicioISO: "2026-10-12",
  },

  // ═══════════════════════════════════════════════════════════════
  // A. ONBOARDING
  // ═══════════════════════════════════════════════════════════════

  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] InmoHub - Growth", status: "pendiente", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "pendiente", notas: null },
      { label: "Crear grupo cliente: InmoHub x REE Growth", status: "pendiente", notas: null },
      { label: "Agregar a Jonathan Aguidi al grupo cliente", status: "pendiente", notas: null },
      { label: "Enviar mensaje de bienvenida con agenda de onboarding", status: "pendiente", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Verificar que existe portfolio en growth@reecreativos.com", status: "pendiente", notas: null },
        { label: "Crear sub-portfolio o estructura para InmoHub", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como administradores", status: "pendiente", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Verificar si InmoHub tiene Facebook Page existente", status: "pendiente", notas: "Revisar si existe Page activa. Si no existe, crear bajo portfolio de growth@." },
        { label: "Vincular Facebook Page al Business Portfolio", status: "pendiente", notas: null },
        { label: "Completar información de la Page (nombre, categoría, foto, portada)", status: "pendiente", notas: null },
        { label: "Agregar a Jonathan como editor de la Page", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @inmohub.crm es cuenta Business o Creator", status: "pendiente", notas: "Si es Personal, convertir a Business." },
        { label: "Vincular Instagram a Meta Business Suite", status: "pendiente", notas: null },
        { label: "Vincular Instagram al portfolio de growth@", status: "pendiente", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Crear o vincular cuenta publicitaria para InmoHub", status: "pendiente", notas: null },
        { label: "Configurar timezone: America/Buenos_Aires", status: "pendiente", notas: null },
        { label: "Configurar moneda: USD", status: "pendiente", notas: null },
        { label: "Asignar Instagram @inmohub.crm a la cuenta", status: "pendiente", notas: null },
        { label: "Agregar equipo REE como Anunciantes", status: "pendiente", notas: null },
        { label: "Verificar tarjeta/método de pago", status: "pendiente", notas: null },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Crear Pixel de Meta para InmoHub", status: "pendiente", notas: null },
        { label: "Instalar Pixel en inmohub.tech", status: "pendiente", notas: "Verificar con el equipo de desarrollo de InmoHub la forma de instalación." },
        { label: "Configurar eventos: PageView, Lead (registro), CompleteRegistration", status: "pendiente", notas: null },
        { label: "Verificar con Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Configurar CAPI en inmohub.tech (server-side)", status: "pendiente", notas: "Coordinar con el equipo de desarrollo de Jonathan." },
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
        { label: "Testear con Test Events en Events Manager", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "SaaS sin e-commerce — tracking de registros",
        aplica: true,
        instrucciones: "InmoHub no tiene e-commerce. El evento de conversión principal es el registro en inmohub.tech (Lead o CompleteRegistration). Configurar el Pixel para trackear el flujo landing → signup → dashboard. Coordinar con Jonathan la implementación del evento server-side si la landing tiene formulario custom.",
      },
      {
        condicion: "Presupuesto bajo (USD 200/mes)",
        aplica: true,
        instrucciones: "El presupuesto total de pauta es USD 200/mes (USD 70 awareness + USD 130 conversiones). Con este nivel de inversión, la estrategia prioriza eficiencia: pocas campañas, segmentación precisa, piezas con alto potencial de engagement orgánico. No fragmentar en más de 2 ad sets por campaña.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Paleta de colores oficial", status: "pendiente", notas: null },
        { label: "Capturas del dashboard / interfaz de InmoHub", status: "pendiente", notas: "Screenshots de alta calidad del CRM, módulo Ads y Bot para usar en piezas gráficas." },
        { label: "Videos de Jonathan mostrando InmoHub (demos, UGC)", status: "pendiente", notas: "Activo clave: Jonathan dando la cara como founder-agente es el mayor diferencial." },
        { label: "Guía de marca / manual de identidad (si existe)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a inmohub.tech (para instalar Pixel)", status: "pendiente", notas: null },
        { label: "Google Analytics (si existe)", status: "pendiente", notas: null },
        { label: "Datos de tráfico y registros del último mes", status: "pendiente", notas: null },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de WhatsApp Business de InmoHub", status: "pendiente", notas: null },
        { label: "Verificar que sea cuenta Business (no Personal)", status: "pendiente", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién atiende los leads entrantes (registros)", status: "pendiente", notas: "Jonathan atiende personalmente." },
        { label: "Definir tiempo máximo de respuesta para demos solicitadas", status: "pendiente", notas: null },
        { label: "Validar capacidad de atención diaria", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: null,
    tracking: {
      titulo: "Tracking de Conversiones",
      items: [
        { label: "Identificar evento de registro en inmohub.tech", status: "pendiente", notas: "URL de thank-you page o evento JS al completar signup." },
        { label: "Configurar evento Lead o CompleteRegistration en Pixel", status: "pendiente", notas: null },
        { label: "Conectar eventos a REE Metrics", status: "pendiente", notas: null },
      ],
    },
  },

  koCall: {
    fechaPropuesta: "12/10/2026",
    duracionTotal: "30 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Intro: qué vamos a configurar hoy", output: "Contexto alineado" },
      { nombre: "Onboarding Meta", duracion: "15 min", objetivo: "Conectar Instagram @inmohub.crm a Meta Business Suite, crear cuenta publicitaria, otorgar acceso a growth@", output: "Cuenta publicitaria lista" },
      { nombre: "Accesos", duracion: "5 min", objetivo: "Obtener acceso admin a inmohub.tech para Pixel", output: "Acceso a landing page" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Próximos pasos: investigación + plan creativo", output: "Foundation Review agendada" },
    ],
    flujoTemas: [
      "Conectar @inmohub.crm a Meta Business Suite",
      "Otorgar acceso completo a growth@reecreativos.com",
      "Crear o vincular cuenta publicitaria",
      "Obtener acceso a inmohub.tech para instalar Pixel",
      "Definir próximos pasos: bajada creativa, Pixel, plan de la semana siguiente",
    ],
    temasWow: [
      "Mostrar ejemplo de dashboard de REE Metrics con data de otro cliente (anonimizado)",
      "Explicar cómo el tracking de registros conecta pauta con signups reales",
      "Compartir benchmark de CPL en SaaS B2B Argentina",
    ],
    checklist: {
      titulo: "Preparación KO Call",
      items: [
        { label: "Agendar fecha con Jonathan", status: "pendiente", notas: "Lunes 12/10" },
        { label: "Enviar invite de Google Calendar", status: "pendiente", notas: null },
        { label: "Preparar agenda de onboarding", status: "pendiente", notas: null },
        { label: "Tener datos de benchmark listos", status: "pendiente", notas: null },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: {
      nombre: "Foundation Review",
      fechaTentativa: "Semana del 27/10",
      objetivos: [
        "Presentar plan creativo completo (guiones + mensajes)",
        "Revisar estrategia de campañas y segmentación",
        "Demo de REE Metrics con datos reales de InmoHub",
        "Alinear producción de contenido con Jonathan",
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // B. ESTRATEGIA
  // ═══════════════════════════════════════════════════════════════

  palanca: {
    nombre: "Captacion",
    justificacion: "InmoHub tiene producto validado (CRM + Ads + Bot + OS) pero visibilidad limitada en el mercado argentino de agentes inmobiliarios. Jonathan trabajó como manager comercial en inmobiliarias y conoce los dolores del rubro de primera mano — un diferencial que ningún competidor genérico puede replicar. La prioridad es generar awareness posicionando a Jonathan como referente tech del rubro y activar un funnel de conversiones hacia inmohub.tech con tracking completo de registros.",
  },

  icp: [
    {
      segmento: "Agente inmobiliario sin ads",
      descripcion: "Agente de 25-55 años que gestiona propiedades y clientes en Excel, WhatsApp y libretas. No hace publicidad digital. No sabe que existe tecnología específica para real estate. Pierde leads por no responder a tiempo y no tiene forma de medir su inversión en marketing (si la hace). Necesita ver el producto varias veces antes de registrarse porque no confía en herramientas genéricas.",
      frase: "Necesito ordenar mis propiedades y clientes, pero no hay nada hecho para inmobiliarios",
      dolores: [
        "Gestiona propiedades, contactos y seguimiento en Excel/WhatsApp — pierde datos y tiempo",
        "Pierde leads por no responder a tiempo (el 80% se va en 5 minutos)",
        "No sabe que existe tecnología específica para agentes inmobiliarios",
        "No tiene forma de medir qué le funciona y qué no en su gestión comercial",
      ],
      deseos: [
        "Un sistema que centralice propiedades, contactos y seguimiento en un solo lugar",
        "Responder consultas al instante sin estar pegado al celular",
        "Una herramienta pensada para el negocio inmobiliario, no genérica",
        "Tener visibilidad de su pipeline y saber qué funciona",
      ],
      objeciones: [
        "¿Esto es para inmobiliarias grandes o también para agentes independientes?",
        "¿Cuánto cuesta y qué incluye el plan gratuito?",
        "Ya uso WhatsApp y Excel, ¿por qué cambiaría?",
      ],
      prioridad: "primario",
      recurrencia: null,
      badge: "Demanda latente",
    },
    {
      segmento: "Agente con ads sin resultados",
      descripcion: "Agente de 25-55 años que ya invierte en publicidad digital (Instagram Ads, portales) pero no mide resultados. Sabe que necesita generar leads online pero no conecta la inversión con ventas reales. Pierde dinero en ads sin saber cuántos leads genera ni cuál es su costo por lead. Gestiona contactos manualmente y no tiene seguimiento automatizado.",
      frase: "Gasto en publicidad pero no sé cuántos clientes me genera",
      dolores: [
        "Invierte en ads pero no mide cuántos leads ni ventas genera",
        "No conecta la inversión en publicidad con resultados concretos",
        "Pierde leads por no responder a tiempo — no tiene automatización",
        "Gestiona todo manualmente sin CRM ni sistema de seguimiento",
      ],
      deseos: [
        "Saber exactamente cuántos leads genera cada peso invertido en ads",
        "Un sistema que conecte pauta, leads y seguimiento en un solo flujo",
        "Automatizar la respuesta inicial para no perder oportunidades",
        "Tener métricas claras de su embudo comercial",
      ],
      objeciones: [
        "Ya gasto en publicidad, ¿por qué sumar otro costo?",
        "¿InmoHub realmente me va a mostrar el ROI de mis ads?",
        "¿Es difícil de implementar? No tengo equipo técnico.",
      ],
      prioridad: "primario",
      recurrencia: null,
      badge: "Demanda activa",
    },
  ],

  propuestaDeValor: {
    descripcion: "Plataforma que se conecta a tu WhatsApp con Inteligencia Artificial para detectar y clasificar automáticamente todos los mensajes relacionados con propiedades o primeros contactos. Integra portales inmobiliarios (ZonaProp, ArgenProp, MercadoLibre), Meta Ads y Google Calendar. Cada cliente que te consulta por cualquier canal queda registrado automáticamente con su origen.",
    diferenciador: "Jonathan trabajó como manager comercial en inmobiliarias y vio de primera mano cómo los agentes pierden operaciones por no tener tecnología. InmoHub no es un CRM genérico — es una app que se conecta a tu WhatsApp + IA para capturar lo que otros agentes pierden. Mientras ellos buscan en chats, vos tenés todo registrado.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Se registró en inmohub.tech, pidió demo o escribió preguntando precios/planes. Intent de compra claro.",
      accion: "Contactar en menos de 2 horas. Responder por WhatsApp con link a demo y opciones de plan.",
    },
    {
      categoria: "B",
      descripcion: "Visitó inmohub.tech sin registrarse, interactuó con contenido de producto o preguntó por funcionalidades. Interés sin intent inmediato.",
      accion: "Contactar en menos de 24 horas. Nutrir con contenido educativo y casos de uso.",
    },
    {
      categoria: "C",
      descripcion: "Interacción en redes (like, comentario, share) sin visita al sitio. Awareness sin intent.",
      accion: "No requiere contacto directo. Se nutren con contenido orgánico y retargeting.",
    },
  ],

  kpis: [
    { nombre: "CPL (visita a landing)", objetivo: null, fuente: "Meta Ads + REE Metrics" },
    { nombre: "CPA (registro en inmohub.tech)", objetivo: null, fuente: "Meta Ads + Pixel" },
    { nombre: "Registros/mes", objetivo: null, fuente: "inmohub.tech + Pixel" },
    { nombre: "Tasa de conversión landing → signup", objetivo: null, fuente: "Pixel + REE Metrics" },
    { nombre: "Alcance mensual", objetivo: null, fuente: "Meta Ads" },
    { nombre: "Crecimiento seguidores IG", objetivo: null, fuente: "Instagram Insights" },
  ],

  presupuesto: {
    pauta: "USD 200/mes (USD 70 awareness + USD 130 conversiones)",
    fee: "USD 300/mes (USD 250 servicio + USD 50 REE Metrics)",
    total: "USD 500/mes",
    cplTarget: null,
    limiteGastoCuenta: null,
  },

  creativos: {
    piezasPorIcp: [
      // ────────────────────────────────────────────────────────────────
      // GTM PLAN — CONVERSIÓN (BOFU)
      // 9 piezas × 2 ICPs (B2C duplicadas, diferenciación por targeting)
      // 3 videos UGC + 3 posteos producto/FOMO + 3 carruseles educativos
      // Destino: inmohub.tech (registro)
      // ────────────────────────────────────────────────────────────────
      {
        icp: "Agente inmobiliario sin ads (9 anuncios)",
        piezas: [
          // --- CV1: VIDEO — TU NEGOCIO ESTÁ EN LA CALLE ---
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si sos agente inmobiliario, tu negocio está en la calle, no llevando métricas en un Excel. Mientras organizás planillas, las consultas siguen cayendo al WhatsApp sin que nadie las registre.", solucion: "InmoHub se conecta a tu WhatsApp con IA y clasifica cada mensaje automáticamente — venta, alquiler o captación. Vos salí a mostrar propiedades, el CRM se carga solo.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC, exterior/calle: 'Si sos agente inmobiliario, tu negocio está en la calle, no en una planilla de Excel.' [3-8s] BODY — Jonathan caminando, tomas de propiedades en venta: 'Mientras vos estás mostrando un departamento, te caen 5 consultas al WhatsApp. Si no las registrás, se te escapan.' [8-14s] BODY — Screen recording InmoHub clasificando leads: 'InmoHub se conecta a tu WhatsApp con IA. Clasifica cada consulta automáticamente: venta, alquiler o captación. El CRM se carga solo.' [14-18s] CTA — Jonathan cierra: 'Entrá a inmohub.tech y empezá hoy.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si sos agente inmobiliario, tu negocio está en la calle, no en una planilla de Excel.", body: "Mientras vos estás mostrando un departamento, te caen 5 consultas al WhatsApp. Si no las registrás, se te escapan. InmoHub se conecta a tu WhatsApp con IA. Clasifica cada consulta automáticamente: venta, alquiler o captación. El CRM se carga solo.", cta: "Entrá a inmohub.tech y empezá hoy.", copyAnuncio: "Si sos agente inmobiliario, tu negocio está en la calle 🏠\n\nNo en una planilla de Excel.\n\n❌ Mientras mostrás propiedades, las consultas caen al WhatsApp\n❌ Si no las registrás, se te escapan\n\n✅ InmoHub se conecta a tu WhatsApp con IA\n✅ Clasifica cada consulta: venta, alquiler o captación\n✅ El CRM se carga solo\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "Tu negocio está en la calle — el CRM se carga solo", formatoNarrativo: "Direct to Camera — UGC", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV2: VIDEO — SI HACÉS CAMPAÑAS PUBLICITARIAS ---
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si sos agente inmobiliario y hacés campañas publicitarias, las consultas caen al WhatsApp mezcladas con todo lo demás. No sabés cuáles vienen de tu pauta, cuáles de portales y cuáles de orgánico.", solucion: "InmoHub conecta Meta Ads con tu WhatsApp y tu CRM. Cada lead trazado desde el anuncio hasta el cierre. Sabés cuánto gastaste y cuántas operaciones generaste.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar.' [3-8s] BODY — Inserts de ads de propiedades, Jonathan narra: 'Las consultas te caen al WhatsApp mezcladas con todo. No sabés cuáles vienen de tu pauta y cuáles no. Estás invirtiendo a ciegas.' [8-14s] BODY — Screen recording InmoHub mostrando origen de cada lead: 'InmoHub conecta Meta Ads con tu WhatsApp. Cada lead trazado desde el anuncio hasta el cierre.' [14-18s] CTA — Jonathan cierra: 'Entrá a inmohub.tech y empezá a medir.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar.", body: "Las consultas te caen al WhatsApp mezcladas con todo. No sabés cuáles vienen de tu pauta y cuáles no. Estás invirtiendo a ciegas. InmoHub conecta Meta Ads con tu WhatsApp. Cada lead trazado desde el anuncio hasta el cierre.", cta: "Entrá a inmohub.tech y empezá a medir.", copyAnuncio: "Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar 📊\n\n❌ Las consultas caen al WhatsApp mezcladas con todo\n❌ No sabés cuáles vienen de tu pauta\n\n✅ InmoHub conecta Meta Ads con tu WhatsApp\n✅ Cada lead trazado desde el anuncio hasta el cierre\n✅ Sabés cuánto gastaste y cuántas operaciones generaste\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "Campañas publicitarias — trazá cada lead hasta el cierre", formatoNarrativo: "Direct to Camera — UGC + Screen Demo", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV3: VIDEO — SI VENDÉS PROPIEDADES O DESARROLLOS ---
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si vendés propiedades o desarrollos inmobiliarios, cada consulta que te llega es una oportunidad. Pero entre WhatsApp, portales y redes, perdés el rastro de quién preguntó por qué propiedad.", solucion: "InmoHub es una plataforma para potenciar la comercialización de tus propiedades. Conecta WhatsApp, Meta Ads, portales y Google Calendar. Cada cliente registrado automáticamente con su origen.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar.' [3-8s] BODY — Tomas de propiedades, edificios: 'Te imaginás tener registrado a cada cliente que te consultó por cada canal? WhatsApp, portales, publicidad, redes.' [8-14s] BODY — Screen recording de InmoHub: 'InmoHub conecta todo. Cada consulta clasificada por IA, cada propiedad conectada automáticamente, cada canal medido.' [14-18s] CTA — Jonathan cierra: 'Registrate en inmohub.tech.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar.", body: "Te imaginás tener registrado a cada cliente que te consultó por cada canal? WhatsApp, portales, publicidad, redes. InmoHub conecta todo. Cada consulta clasificada por IA, cada propiedad conectada automáticamente, cada canal medido.", cta: "Registrate en inmohub.tech.", copyAnuncio: "Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar 🏗️\n\n¿Te imaginás tener registrado a cada cliente de cada canal?\n\n✅ WhatsApp + IA clasifica cada consulta\n✅ Cada propiedad conectada automáticamente\n✅ Portales, ads y redes — todo medido\n\nInmoHub conecta todo.\n\n👉 Registrate en inmohub.tech", pilar: "Producto", tema: "Propiedades y desarrollos — conectá todos tus canales", formatoNarrativo: "Direct to Camera — UGC + Screen Demo", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV4: POSTEO — FOMO: CADA CONSULTA SIN REGISTRAR ---
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Cada consulta que le llega al agente y no registra es una operación que pierde. Mientras revisa chats buscando datos, otro agente ya tiene todo organizado.", solucion: "InmoHub clasifica cada consulta con IA (venta, alquiler, captación) y la conecta con la propiedad correcta. Todo automático.", comunicacion: "Flyer FOMO con screenshot de InmoHub mostrando leads clasificados con badges (Venta/Alquiler/Captación). Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot de InmoHub con leads clasificados (badges verde 'Venta', azul 'Alquiler', naranja 'Captación'). Mockup celular.", "Headline: 'CADA CONSULTA QUE NO REGISTRÁS ES UNA OPERACIÓN QUE PERDÉS' en tipografía bold.", "Bullets: 'IA clasifica: venta, alquiler o captación' / 'Conecta cada consulta con la propiedad correcta' / 'El CRM se carga solo'.", "CTA: 'Entrá a inmohub.tech' con botón destacado."], copyAnuncio: "Cada consulta que no registrás es una operación que perdés ⚡\n\n🤖 InmoHub clasifica cada consulta con IA:\n✅ Venta → badge verde\n✅ Alquiler → badge azul\n✅ Captación → badge naranja\n\nConecta cada consulta con la propiedad correcta. Automático.\n\nMientras vos buscás en chats, otro agente ya tiene todo registrado.\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "FOMO — cada consulta sin registrar es una operación perdida", formatoNarrativo: "Producto — FOMO CTA", estructuraNarrativa: "Dato impactante - Evidencia - Urgencia", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV5: POSTEO — EL CRM QUE SE CARGA SOLO ---
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes inmobiliarios pierden horas cargando datos en planillas que después no consultan. El CRM debería cargarse solo.", solucion: "InmoHub es el CRM que se carga solo. Te escriben por WhatsApp → la IA clasifica venta, alquiler o captación → conecta la propiedad → aparece en tu pipeline. Vos no tocás nada.", comunicacion: "Flyer de producto con screenshot del pipeline kanban de InmoHub. Claim directo + beneficios. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot del pipeline kanban con leads en diferentes etapas (Nuevo → Contactado → Visita → Oferta). Mockup desktop + celular.", "Headline: 'EL CRM QUE SE CARGA SOLO' en tipografía bold.", "Subtítulo: 'Te escriben por WhatsApp → la IA clasifica → conecta la propiedad → aparece en tu pipeline. Vos no tocás nada.'", "CTA: 'Probalo en inmohub.tech' con botón destacado."], copyAnuncio: "El CRM que se carga solo 🤖\n\nTe escriben por WhatsApp → la IA clasifica (venta, alquiler, captación) → conecta la propiedad → aparece en tu pipeline.\n\nVos no tocás nada.\n\n✅ Sin cargar datos\n✅ Sin planillas\n✅ Sin perder clientes\n\n👉 Probalo en inmohub.tech", pilar: "Producto", tema: "El CRM que se carga solo — claim principal", formatoNarrativo: "Producto — Claim", estructuraNarrativa: "Afirmación - Evidencia - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV6: POSTEO — SOCIAL PROOF / DASHBOARD ---
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes inmobiliarios no tienen visibilidad de su embudo comercial. No saben cuántos leads tienen, cuántos convirtieron ni qué canal funciona mejor.", solucion: "Dashboard de InmoHub con métricas en tiempo real: leads por semana, tasa de conversión, pipeline value, performance por campaña.", comunicacion: "Screenshot real del dashboard de InmoHub con métricas. Diseño product-led, que el producto hable por sí mismo. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot real del dashboard de InmoHub mostrando KPIs (leads hoy, conversión lead→visita→cierre, pipeline value, campañas activas). Full-width.", "Headline: 'ESTO ES LO QUE VEN LOS AGENTES QUE YA USAN INMOHUB' en tipografía bold.", "Subtítulo: 'Tu negocio con números, no con sensaciones.'", "CTA: 'Empezá en inmohub.tech' con botón destacado."], copyAnuncio: "Esto es lo que ven los agentes que ya usan InmoHub 📊\n\n✅ Leads por semana\n✅ Conversión: lead → visita → cierre\n✅ Valor del pipeline\n✅ Qué campaña funciona y cuál no\n\nTu negocio con números, no con sensaciones.\n\n👉 Empezá en inmohub.tech", pilar: "Producto", tema: "Dashboard — tu negocio con números", formatoNarrativo: "Producto — Social Proof", estructuraNarrativa: "Evidencia visual - Afirmación - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV7: CARRUSEL — DE WHATSAPP CAÓTICO A PIPELINE ---
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "El WhatsApp del agente inmobiliario es un caos de consultas mezcladas. No sabe quién preguntó por cuál propiedad, si quiere comprar o alquilar, ni de dónde vino.", solucion: "InmoHub transforma ese caos en un pipeline organizado. Cada consulta clasificada, cada propiedad conectada, cada etapa visible.", comunicacion: "Carrusel x5 slides mostrando la transformación de WhatsApp caótico a InmoHub organizado. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'DE WHATSAPP CAÓTICO A PIPELINE ORGANIZADO' Visual: split screen — WhatsApp con 50 chats sin leer vs InmoHub pipeline limpio.", "Slide 2: ANTES — 'Consultas mezcladas, audios sin escuchar, no sabés quién preguntó por cuál propiedad'. Screenshot de WhatsApp caótico.", "Slide 3: AHORA — 'Cada consulta clasificada por IA: VENTA / ALQUILER / CAPTACIÓN'. Screenshot de InmoHub con badges.", "Slide 4: AHORA — 'Cada lead conectado con la propiedad correcta automáticamente'. Screenshot del pipeline con propiedad vinculada.", "Slide 5: CTA — 'Empezá hoy. El CRM se carga solo. inmohub.tech'"], copyAnuncio: "De WhatsApp caótico a pipeline organizado 📱→📊\n\n❌ ANTES: consultas mezcladas, audios sin escuchar, datos perdidos\n✅ AHORA: cada consulta clasificada por IA (venta/alquiler/captación)\n✅ AHORA: cada lead conectado con la propiedad correcta\n\nEl CRM se carga solo.\n\n👉 Empezá hoy en inmohub.tech", pilar: "Producto", tema: "Transformación — de WhatsApp caótico a pipeline", formatoNarrativo: "Educativo — Antes/Ahora", estructuraNarrativa: "Problema - Transformación - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV8: CARRUSEL — QUÉ VES EN TU PRIMER DÍA ---
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes creen que implementar un CRM lleva semanas de configuración y carga de datos. No arrancan porque les da pereza el setup.", solucion: "Con InmoHub arrancás hoy y operás hoy. Te registrás, conectás WhatsApp, y cuando llega el primer lead ya está clasificado en tu pipeline.", comunicacion: "Carrusel x5 slides mostrando el onboarding y el primer lead moment. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: '¿QUÉ PASA EN TU PRIMER DÍA CON INMOHUB?' Visual: emoji reloj + 'Empezás hoy, operás hoy.'", "Slide 2: '10:00 — Te registrás en inmohub.tech' Screenshot del checkout. 30 segundos.", "Slide 3: '10:05 — Conectás tu WhatsApp' Screenshot del onboarding paso WhatsApp. 5 minutos.", "Slide 4: '10:15 — Te llega el primer lead y el CRM se carga solo' Screenshot de la primera clasificación IA: badge VENTA + propiedad conectada.", "Slide 5: CTA — 'Sin configuración, sin carga de datos, sin excusas. inmohub.tech'"], copyAnuncio: "¿Qué pasa en tu primer día con InmoHub? ⏱️\n\n10:00 → Te registrás (30 seg)\n10:05 → Conectás tu WhatsApp (5 min)\n10:15 → Te llega el primer lead y el CRM se carga solo\n\n🤖 La IA clasifica: venta, alquiler o captación\n🏠 Conecta la consulta con la propiedad\n\nSin configuración. Sin carga de datos.\n\n👉 Empezá hoy en inmohub.tech", pilar: "Producto", tema: "Primer día — empezás hoy, operás hoy", formatoNarrativo: "Educativo — Journey", estructuraNarrativa: "Pregunta - Timeline - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          // --- CV9: CARRUSEL — CONECTÁ TODO ---
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes usan WhatsApp, portales, Meta Ads y Google Calendar por separado. Nada está conectado. Pierden clientes entre herramientas.", solucion: "InmoHub conecta todo en una sola plataforma: WhatsApp con IA, portales inmobiliarios, Meta Ads y Google Calendar.", comunicacion: "Carrusel x5 slides presentando cada integración. Íconos + screenshots. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'CONECTÁ TODO EN UN SOLO LUGAR' Logos de WhatsApp, Meta, ZonaProp, ArgenProp, ML, Google Calendar. 'InmoHub integra las herramientas que ya usás.'", "Slide 2: 'WHATSAPP + IA' — 'Se conecta a tu WhatsApp y detecta cada consulta por propiedades. Clasifica automáticamente: venta, alquiler, captación.'", "Slide 3: 'PORTALES' — 'ZonaProp, ArgenProp, MercadoLibre. Sabé cuántos clientes te llegan de cada portal y cuántas operaciones cerraste.'", "Slide 4: 'META ADS + CALENDAR' — 'Tu inversión trazada hasta el cierre. Visitas sincronizadas con Google Calendar.'", "Slide 5: CTA — 'Todo conectado, todo medido. Registrate en inmohub.tech'"], copyAnuncio: "Conectá todo en un solo lugar 🔗\n\n📱 WhatsApp + IA → clasifica cada consulta\n🏠 ZonaProp, ArgenProp, ML → medí cada portal\n📈 Meta Ads → trazá tu inversión hasta el cierre\n📅 Google Calendar → visitas sincronizadas\n\nTodo conectado, todo medido.\n\n👉 Registrate en inmohub.tech", pilar: "Producto", tema: "Conectá todo — WhatsApp + Portales + Ads + Calendar", formatoNarrativo: "Producto — Showcase", estructuraNarrativa: "Afirmación - Evidencia - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
        ],
      },
      {
        icp: "Agente con ads sin resultados (9 anuncios)",
        piezas: [
          // --- DUPLICADOS (mismas 9 piezas, diferenciación por targeting) ---
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si sos agente inmobiliario, tu negocio está en la calle, no llevando métricas en un Excel. Mientras organizás planillas, las consultas siguen cayendo al WhatsApp sin que nadie las registre.", solucion: "InmoHub se conecta a tu WhatsApp con IA y clasifica cada mensaje automáticamente — venta, alquiler o captación. Vos salí a mostrar propiedades, el CRM se carga solo.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC, exterior/calle: 'Si sos agente inmobiliario, tu negocio está en la calle, no en una planilla de Excel.' [3-8s] BODY — Jonathan caminando, tomas de propiedades en venta: 'Mientras vos estás mostrando un departamento, te caen 5 consultas al WhatsApp. Si no las registrás, se te escapan.' [8-14s] BODY — Screen recording InmoHub clasificando leads: 'InmoHub se conecta a tu WhatsApp con IA. Clasifica cada consulta automáticamente: venta, alquiler o captación. El CRM se carga solo.' [14-18s] CTA — Jonathan cierra: 'Entrá a inmohub.tech y empezá hoy.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si sos agente inmobiliario, tu negocio está en la calle, no en una planilla de Excel.", body: "Mientras vos estás mostrando un departamento, te caen 5 consultas al WhatsApp. Si no las registrás, se te escapan. InmoHub se conecta a tu WhatsApp con IA. Clasifica cada consulta automáticamente: venta, alquiler o captación. El CRM se carga solo.", cta: "Entrá a inmohub.tech y empezá hoy.", copyAnuncio: "Si sos agente inmobiliario, tu negocio está en la calle 🏠\n\nNo en una planilla de Excel.\n\n❌ Mientras mostrás propiedades, las consultas caen al WhatsApp\n❌ Si no las registrás, se te escapan\n\n✅ InmoHub se conecta a tu WhatsApp con IA\n✅ Clasifica cada consulta: venta, alquiler o captación\n✅ El CRM se carga solo\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "Tu negocio está en la calle — el CRM se carga solo", formatoNarrativo: "Direct to Camera — UGC", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si sos agente inmobiliario y hacés campañas publicitarias, las consultas caen al WhatsApp mezcladas con todo lo demás. No sabés cuáles vienen de tu pauta, cuáles de portales y cuáles de orgánico.", solucion: "InmoHub conecta Meta Ads con tu WhatsApp y tu CRM. Cada lead trazado desde el anuncio hasta el cierre. Sabés cuánto gastaste y cuántas operaciones generaste.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar.' [3-8s] BODY — Inserts de ads de propiedades, Jonathan narra: 'Las consultas te caen al WhatsApp mezcladas con todo. No sabés cuáles vienen de tu pauta y cuáles no. Estás invirtiendo a ciegas.' [8-14s] BODY — Screen recording InmoHub mostrando origen de cada lead: 'InmoHub conecta Meta Ads con tu WhatsApp. Cada lead trazado desde el anuncio hasta el cierre.' [14-18s] CTA — Jonathan cierra: 'Entrá a inmohub.tech y empezá a medir.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar.", body: "Las consultas te caen al WhatsApp mezcladas con todo. No sabés cuáles vienen de tu pauta y cuáles no. Estás invirtiendo a ciegas. InmoHub conecta Meta Ads con tu WhatsApp. Cada lead trazado desde el anuncio hasta el cierre.", cta: "Entrá a inmohub.tech y empezá a medir.", copyAnuncio: "Si sos agente inmobiliario y hacés campañas publicitarias, esto te va a interesar 📊\n\n❌ Las consultas caen al WhatsApp mezcladas con todo\n❌ No sabés cuáles vienen de tu pauta\n\n✅ InmoHub conecta Meta Ads con tu WhatsApp\n✅ Cada lead trazado desde el anuncio hasta el cierre\n✅ Sabés cuánto gastaste y cuántas operaciones generaste\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "Campañas publicitarias — trazá cada lead hasta el cierre", formatoNarrativo: "Direct to Camera — UGC + Screen Demo", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Video Comercial Vertical (9:16)", dolor: "Si vendés propiedades o desarrollos inmobiliarios, cada consulta que te llega es una oportunidad. Pero entre WhatsApp, portales y redes, perdés el rastro de quién preguntó por qué propiedad.", solucion: "InmoHub es una plataforma para potenciar la comercialización de tus propiedades. Conecta WhatsApp, Meta Ads, portales y Google Calendar. Cada cliente registrado automáticamente con su origen.", comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar.' [3-8s] BODY — Tomas de propiedades, edificios: 'Te imaginás tener registrado a cada cliente que te consultó por cada canal? WhatsApp, portales, publicidad, redes.' [8-14s] BODY — Screen recording de InmoHub: 'InmoHub conecta todo. Cada consulta clasificada por IA, cada propiedad conectada automáticamente, cada canal medido.' [14-18s] CTA — Jonathan cierra: 'Registrate en inmohub.tech.' [18-20s] CIERRE — Logo InmoHub + inmohub.tech.", hook: "Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar.", body: "Te imaginás tener registrado a cada cliente que te consultó por cada canal? WhatsApp, portales, publicidad, redes. InmoHub conecta todo. Cada consulta clasificada por IA, cada propiedad conectada automáticamente, cada canal medido.", cta: "Registrate en inmohub.tech.", copyAnuncio: "Si vendés propiedades o desarrollos inmobiliarios, esto te va a interesar 🏗️\n\n¿Te imaginás tener registrado a cada cliente de cada canal?\n\n✅ WhatsApp + IA clasifica cada consulta\n✅ Cada propiedad conectada automáticamente\n✅ Portales, ads y redes — todo medido\n\nInmoHub conecta todo.\n\n👉 Registrate en inmohub.tech", pilar: "Producto", tema: "Propiedades y desarrollos — conectá todos tus canales", formatoNarrativo: "Direct to Camera — UGC + Screen Demo", estructuraNarrativa: "Hook - Contenido - Acción", tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" }, duracion: "15-20s", enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Cada consulta que le llega al agente y no registra es una operación que pierde. Mientras revisa chats buscando datos, otro agente ya tiene todo organizado.", solucion: "InmoHub clasifica cada consulta con IA (venta, alquiler, captación) y la conecta con la propiedad correcta. Todo automático.", comunicacion: "Flyer FOMO con screenshot de InmoHub mostrando leads clasificados con badges (Venta/Alquiler/Captación). Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot de InmoHub con leads clasificados (badges verde 'Venta', azul 'Alquiler', naranja 'Captación'). Mockup celular.", "Headline: 'CADA CONSULTA QUE NO REGISTRÁS ES UNA OPERACIÓN QUE PERDÉS' en tipografía bold.", "Bullets: 'IA clasifica: venta, alquiler o captación' / 'Conecta cada consulta con la propiedad correcta' / 'El CRM se carga solo'.", "CTA: 'Entrá a inmohub.tech' con botón destacado."], copyAnuncio: "Cada consulta que no registrás es una operación que perdés ⚡\n\n🤖 InmoHub clasifica cada consulta con IA:\n✅ Venta → badge verde\n✅ Alquiler → badge azul\n✅ Captación → badge naranja\n\nConecta cada consulta con la propiedad correcta. Automático.\n\nMientras vos buscás en chats, otro agente ya tiene todo registrado.\n\n👉 Entrá a inmohub.tech", pilar: "Producto", tema: "FOMO — cada consulta sin registrar es una operación perdida", formatoNarrativo: "Producto — FOMO CTA", estructuraNarrativa: "Dato impactante - Evidencia - Urgencia", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes inmobiliarios pierden horas cargando datos en planillas que después no consultan. El CRM debería cargarse solo.", solucion: "InmoHub es el CRM que se carga solo. Te escriben por WhatsApp → la IA clasifica venta, alquiler o captación → conecta la propiedad → aparece en tu pipeline. Vos no tocás nada.", comunicacion: "Flyer de producto con screenshot del pipeline kanban de InmoHub. Claim directo + beneficios. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot del pipeline kanban con leads en diferentes etapas (Nuevo → Contactado → Visita → Oferta). Mockup desktop + celular.", "Headline: 'EL CRM QUE SE CARGA SOLO' en tipografía bold.", "Subtítulo: 'Te escriben por WhatsApp → la IA clasifica → conecta la propiedad → aparece en tu pipeline. Vos no tocás nada.'", "CTA: 'Probalo en inmohub.tech' con botón destacado."], copyAnuncio: "El CRM que se carga solo 🤖\n\nTe escriben por WhatsApp → la IA clasifica (venta, alquiler, captación) → conecta la propiedad → aparece en tu pipeline.\n\nVos no tocás nada.\n\n✅ Sin cargar datos\n✅ Sin planillas\n✅ Sin perder clientes\n\n👉 Probalo en inmohub.tech", pilar: "Producto", tema: "El CRM que se carga solo — claim principal", formatoNarrativo: "Producto — Claim", estructuraNarrativa: "Afirmación - Evidencia - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes inmobiliarios no tienen visibilidad de su embudo comercial. No saben cuántos leads tienen, cuántos convirtieron ni qué canal funciona mejor.", solucion: "Dashboard de InmoHub con métricas en tiempo real: leads por semana, tasa de conversión, pipeline value, performance por campaña.", comunicacion: "Screenshot real del dashboard de InmoHub con métricas. Diseño product-led, que el producto hable por sí mismo. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot real del dashboard de InmoHub mostrando KPIs (leads hoy, conversión lead→visita→cierre, pipeline value, campañas activas). Full-width.", "Headline: 'ESTO ES LO QUE VEN LOS AGENTES QUE YA USAN INMOHUB' en tipografía bold.", "Subtítulo: 'Tu negocio con números, no con sensaciones.'", "CTA: 'Empezá en inmohub.tech' con botón destacado."], copyAnuncio: "Esto es lo que ven los agentes que ya usan InmoHub 📊\n\n✅ Leads por semana\n✅ Conversión: lead → visita → cierre\n✅ Valor del pipeline\n✅ Qué campaña funciona y cuál no\n\nTu negocio con números, no con sensaciones.\n\n👉 Empezá en inmohub.tech", pilar: "Producto", tema: "Dashboard — tu negocio con números", formatoNarrativo: "Producto — Social Proof", estructuraNarrativa: "Evidencia visual - Afirmación - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "El WhatsApp del agente inmobiliario es un caos de consultas mezcladas. No sabe quién preguntó por cuál propiedad, si quiere comprar o alquilar, ni de dónde vino.", solucion: "InmoHub transforma ese caos en un pipeline organizado. Cada consulta clasificada, cada propiedad conectada, cada etapa visible.", comunicacion: "Carrusel x5 slides mostrando la transformación de WhatsApp caótico a InmoHub organizado. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'DE WHATSAPP CAÓTICO A PIPELINE ORGANIZADO' Visual: split screen — WhatsApp con 50 chats sin leer vs InmoHub pipeline limpio.", "Slide 2: ANTES — 'Consultas mezcladas, audios sin escuchar, no sabés quién preguntó por cuál propiedad'. Screenshot de WhatsApp caótico.", "Slide 3: AHORA — 'Cada consulta clasificada por IA: VENTA / ALQUILER / CAPTACIÓN'. Screenshot de InmoHub con badges.", "Slide 4: AHORA — 'Cada lead conectado con la propiedad correcta automáticamente'. Screenshot del pipeline con propiedad vinculada.", "Slide 5: CTA — 'Empezá hoy. El CRM se carga solo. inmohub.tech'"], copyAnuncio: "De WhatsApp caótico a pipeline organizado 📱→📊\n\n❌ ANTES: consultas mezcladas, audios sin escuchar, datos perdidos\n✅ AHORA: cada consulta clasificada por IA (venta/alquiler/captación)\n✅ AHORA: cada lead conectado con la propiedad correcta\n\nEl CRM se carga solo.\n\n👉 Empezá hoy en inmohub.tech", pilar: "Producto", tema: "Transformación — de WhatsApp caótico a pipeline", formatoNarrativo: "Educativo — Antes/Ahora", estructuraNarrativa: "Problema - Transformación - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes creen que implementar un CRM lleva semanas de configuración y carga de datos. No arrancan porque les da pereza el setup.", solucion: "Con InmoHub arrancás hoy y operás hoy. Te registrás, conectás WhatsApp, y cuando llega el primer lead ya está clasificado en tu pipeline.", comunicacion: "Carrusel x5 slides mostrando el onboarding y el primer lead moment. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: '¿QUÉ PASA EN TU PRIMER DÍA CON INMOHUB?' Visual: emoji reloj + 'Empezás hoy, operás hoy.'", "Slide 2: '10:00 — Te registrás en inmohub.tech' Screenshot del checkout. 30 segundos.", "Slide 3: '10:05 — Conectás tu WhatsApp' Screenshot del onboarding paso WhatsApp. 5 minutos.", "Slide 4: '10:15 — Te llega el primer lead y el CRM se carga solo' Screenshot de la primera clasificación IA: badge VENTA + propiedad conectada.", "Slide 5: CTA — 'Sin configuración, sin carga de datos, sin excusas. inmohub.tech'"], copyAnuncio: "¿Qué pasa en tu primer día con InmoHub? ⏱️\n\n10:00 → Te registrás (30 seg)\n10:05 → Conectás tu WhatsApp (5 min)\n10:15 → Te llega el primer lead y el CRM se carga solo\n\n🤖 La IA clasifica: venta, alquiler o captación\n🏠 Conecta la consulta con la propiedad\n\nSin configuración. Sin carga de datos.\n\n👉 Empezá hoy en inmohub.tech", pilar: "Producto", tema: "Primer día — empezás hoy, operás hoy", formatoNarrativo: "Educativo — Journey", estructuraNarrativa: "Pregunta - Timeline - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
          { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes usan WhatsApp, portales, Meta Ads y Google Calendar por separado. Nada está conectado. Pierden clientes entre herramientas.", solucion: "InmoHub conecta todo en una sola plataforma: WhatsApp con IA, portales inmobiliarios, Meta Ads y Google Calendar.", comunicacion: "Carrusel x5 slides presentando cada integración. Íconos + screenshots. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'CONECTÁ TODO EN UN SOLO LUGAR' Logos de WhatsApp, Meta, ZonaProp, ArgenProp, ML, Google Calendar. 'InmoHub integra las herramientas que ya usás.'", "Slide 2: 'WHATSAPP + IA' — 'Se conecta a tu WhatsApp y detecta cada consulta por propiedades. Clasifica automáticamente: venta, alquiler, captación.'", "Slide 3: 'PORTALES' — 'ZonaProp, ArgenProp, MercadoLibre. Sabé cuántos clientes te llegan de cada portal y cuántas operaciones cerraste.'", "Slide 4: 'META ADS + CALENDAR' — 'Tu inversión trazada hasta el cierre. Visitas sincronizadas con Google Calendar.'", "Slide 5: CTA — 'Todo conectado, todo medido. Registrate en inmohub.tech'"], copyAnuncio: "Conectá todo en un solo lugar 🔗\n\n📱 WhatsApp + IA → clasifica cada consulta\n🏠 ZonaProp, ArgenProp, ML → medí cada portal\n📈 Meta Ads → trazá tu inversión hasta el cierre\n📅 Google Calendar → visitas sincronizadas\n\nTodo conectado, todo medido.\n\n👉 Registrate en inmohub.tech", pilar: "Producto", tema: "Conectá todo — WhatsApp + Portales + Ads + Calendar", formatoNarrativo: "Producto — Showcase", estructuraNarrativa: "Afirmación - Evidencia - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false, destinoUrls: ["https://inmohub.tech"] },
        ],
      },
    ],
    resumenPiezas: "GTM Plan: 27 piezas totales — 12 orgánicas (6 posteos + 3 carruseles + 3 videos animados) + 6 awareness (3 UGC + 3 orgánicas boosted) + 9 BOFU duplicadas por ICP (3 videos + 3 posteos + 3 carruseles)",
    formatos: ["Video Comercial (9:16)", "Feed (1080x1350)", "Carrusel (1080x1080)"],
    tono: "FOMO + exclusividad + urgencia. Comunicación que genera sensación de estar perdiéndose algo: 'mientras vos perdés el contexto, otro agente ya cerró esa operación'. Cada guion nombra al agente inmobiliario y usa su idioma (propiedades, captación, clientes, operaciones, portales). Jonathan habla desde la experiencia real del rubro, suelto, cámara frontal UGC. Estilo audiovisual: videos de propiedades en Puerto Madero, edificios en construcción, oficina. Edición con preset y tipografía de subtítulo definida. Buscar marcar estilo audiovisual propio.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_inmohub_meta_awareness_founder",
      "ree_inmohub_meta_conversion_crm",
      "ree_inmohub_meta_conversion_bot",
    ],
  },

  arquitectura: [
    // ═══════════════════════════════════════════════════════════════
    // CAMPAÑA 1: ORGÁNICO — 12 piezas de contenido para @inmohub.crm
    // 6 posts/stories + 3 carruseles + 3 videos animados de feature
    // Sin pauta — publicación orgánica en el perfil
    // ═══════════════════════════════════════════════════════════════
    {
      nombre: "INMOHUB_Organico",
      objetivo: "Contenido Orgánico",
      status: "activa",
      conSubsecciones: true,
      tituloSeccion: "Contenido Orgánico",
      descripcionCampana: "Plan de contenido orgánico para posicionar @inmohub.crm como referente de tecnología inmobiliaria en Argentina. 12 piezas que traducen las features técnicas del producto en comunicación para agentes: clasificación IA, transcripción de audios, matching de propiedades, pipeline automático, portales, dashboard y Proppy. Se publican en feed e historias sin pauta. Las 3 mejores piezas se boostean luego en la campaña de Awareness.",
      destino: "Perfil de Instagram (@inmohub.crm)",
      kpisCampana: ["Alcance", "Guardados", "Shares", "Crecimiento seguidores"],
      conversionCampana: "Engagement y crecimiento de audiencia orgánica",
      adSets: [
        {
          nombre: "Publicación_Orgánica",
          segmentacion: "Publicación directa en @inmohub.crm (feed + stories). Sin pauta paga.",
          ads: [
            "ORG01_Posteo_CRM_V1 | El CRM que se carga solo",
            "ORG02_Posteo_IAClasifica_V1 | IA clasifica: venta, alquiler, captación",
            "ORG03_Posteo_Audios_V1 | Transcribe audios de WhatsApp con IA",
            "ORG04_Posteo_FOMO_V1 | Mientras buscás en chats, otro agente ya cerró",
            "ORG05_Posteo_PWA_V1 | Instalalo como app en tu celular",
            "ORG06_Posteo_Pricing_V1 | $149.900/mes — sin contrato",
            "ORG07_Carrusel_5Cosas_V1 | 5 cosas que InmoHub hace mientras mostrás propiedades",
            "ORG08_Carrusel_AntesAhora_V1 | ANTES vs AHORA — el día a día del agente",
            "ORG09_Carrusel_4Pasos_V1 | Cómo funciona InmoHub en 4 pasos",
            "ORG10_VideoAnim_Flujo_V1 | Del WhatsApp al pipeline — flujo completo",
            "ORG11_VideoAnim_Pipeline_V1 | Pipeline kanban en acción",
            "ORG12_VideoAnim_Dashboard_V1 | Dashboard + Proppy — métricas y asistente IA",
          ],
        },
      ],
      piezas: [
        // ── ORG1: POST — EL CRM QUE SE CARGA SOLO ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes inmobiliarios cargan datos manualmente en Excel o Google Sheets que después no consultan. Pierden horas por semana en trabajo administrativo que no genera operaciones.", solucion: "InmoHub es el CRM que se carga solo. Se conecta a tu WhatsApp con IA, clasifica cada consulta (venta, alquiler, captación) y la conecta con la propiedad correspondiente. El agente no carga nada.", comunicacion: "Flyer de producto con screenshot del pipeline kanban de InmoHub. Claim principal en tipografía bold. Mockup celular + desktop. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot del pipeline kanban con leads en etapas (Nuevo → Contactado → Visita → Oferta). Mockup celular y desktop side by side.", "Headline: 'EL CRM QUE SE CARGA SOLO' en tipografía bold.", "Subtítulo: 'Te escriben por WhatsApp → la IA clasifica → conecta la propiedad → aparece en tu pipeline.'", "CTA: '@inmohub.crm — Link en bio' con botón destacado."], copyAnuncio: "El CRM que se carga solo 🤖\n\nTe escriben por WhatsApp → la IA clasifica (venta, alquiler, captación) → conecta la propiedad → aparece en tu pipeline.\n\nVos no tocás nada.\n\n✅ Sin cargar datos manualmente\n✅ Sin planillas de Excel\n✅ Sin perder clientes\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "El CRM que se carga solo — claim principal", formatoNarrativo: "Producto — Claim", estructuraNarrativa: "Afirmación - Evidencia - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG2: POST — IA CLASIFICA: VENTA / ALQUILER / CAPTACIÓN ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Los agentes reciben consultas por WhatsApp sin saber si el cliente quiere comprar, alquilar o listar su propiedad para vender. Todo se mezcla en un chat interminable.", solucion: "InmoHub usa Inteligencia Artificial para clasificar cada mensaje automáticamente en tres categorías: Venta, Alquiler o Captación. El agente lo ve al instante con badges de color.", comunicacion: "Screenshot de InmoHub con leads clasificados mostrando badges de color (verde 'Venta', azul 'Alquiler', naranja 'Captación'). Tipografía bold. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot de InmoHub con 3 leads clasificados, cada uno con badge de color: Venta (verde), Alquiler (azul), Captación (naranja).", "Headline: 'LA IA QUE CLASIFICA CADA CONSULTA POR VOS' en tipografía bold.", "Bullets: 'Venta → badge verde' / 'Alquiler → badge azul' / 'Captación → badge naranja'. Automático.", "CTA: '@inmohub.crm — Link en bio'."], copyAnuncio: "La IA que clasifica cada consulta por vos 🤖\n\nTe escriben por WhatsApp → InmoHub clasifica automáticamente:\n\n🟢 Venta\n🔵 Alquiler\n🟠 Captación\n\nSin que hagas nada. Lo ves al instante.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "IA clasifica — venta, alquiler, captación", formatoNarrativo: "Producto — Feature", estructuraNarrativa: "Problema - Feature - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG3: POST — TRANSCRIBE AUDIOS DE WHATSAPP ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Más de la mitad de las consultas inmobiliarias llegan por audio de WhatsApp. No siempre podés escucharlos al momento — estás mostrando una propiedad, manejando, en reunión. Perdés información y contexto.", solucion: "InmoHub transcribe cada audio de WhatsApp con IA y lo procesa como texto. No necesitás escuchar para saber qué te pidieron.", comunicacion: "Screenshot de InmoHub mostrando un audio de WhatsApp con su transcripción completa y la clasificación IA aplicada. Visual limpio, feature-led. Adaptar a Story (1080x1920).", mensajes: ["Visual: screenshot de conversación en InmoHub con un audio de WhatsApp y su transcripción debajo: 'Hola, vi un 3 ambientes en Palermo que publicaste en ZonaProp, me interesa...'", "Headline: 'TRANSCRIBE AUDIOS DE WHATSAPP CON IA' en tipografía bold.", "Subtítulo: 'No necesitás escuchar para saber qué te pidieron.'", "CTA: '@inmohub.crm — Link en bio'."], copyAnuncio: "¿Cuántos audios de WhatsApp tenés sin escuchar ahora mismo? 🎙️\n\nInmoHub transcribe cada audio con IA y lo procesa como texto.\n\n✅ Te llega un audio → lo transcribe al instante\n✅ Clasifica la consulta: venta, alquiler o captación\n✅ No necesitás escuchar para saber qué te pidieron\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Transcripción de audios — no pierdas consultas", formatoNarrativo: "Producto — Feature", estructuraNarrativa: "Problema - Feature - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG4: POST — FOMO DOLOR ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Cada consulta que el agente no registra es una operación que pierde. Mientras busca en chats de WhatsApp, otro agente ya contactó a ese cliente y cerró la operación.", solucion: "InmoHub registra cada consulta automáticamente con IA. No se te escapa nada.", comunicacion: "Flyer FOMO con fondo oscuro, tipografía bold blanca. Mensaje de urgencia y exclusividad. Adaptar a Story (1080x1920).", mensajes: ["Visual: fondo oscuro con frase en tipografía grande y bold. Contraste alto. Estilo editorial.", "Frase principal: 'MIENTRAS VOS BUSCÁS EN CHATS, OTRO AGENTE YA CERRÓ ESA OPERACIÓN'.", "Subtítulo: 'InmoHub registra cada consulta automáticamente. El CRM se carga solo.'", "CTA: '@inmohub.crm — Link en bio'."], copyAnuncio: "Mientras vos buscás en chats de WhatsApp, otro agente ya cerró esa operación ⚡\n\n❌ Consultas que no respondés a tiempo\n❌ Clientes que no registrás\n❌ Datos que perdés entre conversaciones\n\n✅ InmoHub registra cada consulta automáticamente\n✅ El CRM se carga solo\n\n👉 @inmohub.crm — Link en bio", pilar: "Marca", tema: "FOMO — lo que perdés mientras no registrás", formatoNarrativo: "Dato — FOMO", estructuraNarrativa: "Dato impactante - Solución - Urgencia", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG5: POST — PWA: INSTALALO COMO APP ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes necesitan acceso rápido a su CRM desde el celular pero no quieren descargar apps pesadas que ocupan espacio y tardan en cargar.", solucion: "InmoHub se instala como app nativa en tu celular (PWA). Sin descargar de ningún store, se abre como cualquier app y tu CRM siempre a un toque.", comunicacion: "Mockup de celular con InmoHub instalado como app nativa en la home screen, al lado de WhatsApp e Instagram. Visual limpio, product-led. Adaptar a Story (1080x1920).", mensajes: ["Visual: mockup de celular mostrando InmoHub como app instalada en la home screen, al lado de WhatsApp e Instagram.", "Headline: 'INSTALALO COMO APP EN TU CELULAR' en tipografía bold.", "Subtítulo: 'Sin descargar de ningún store. Se abre como cualquier app. Tu CRM siempre a un toque.'", "CTA: '@inmohub.crm — Link en bio'."], copyAnuncio: "Tu CRM siempre a un toque 📱\n\nInmoHub se instala como app nativa en tu celular.\n\n✅ Sin descargar de ningún store\n✅ Se abre como cualquier app\n✅ Tus leads, pipeline y propiedades en el bolsillo\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "PWA — instalalo como app en tu celular", formatoNarrativo: "Producto — Feature", estructuraNarrativa: "Problema - Feature - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG6: POST — PRICING ──
        { formato: "Posteo Rectangular (1080x1350)", dolor: "Agentes creen que un CRM con IA es caro o requiere contratos largos. No evalúan herramientas porque asumen que no pueden pagarlas.", solucion: "InmoHub cuesta $149.900/mes. Sin contrato, cancelás cuando quieras. Empezás hoy y operás hoy.", comunicacion: "Flyer de pricing limpio con el número grande y destacado. Diseño minimalista con los features principales. Adaptar a Story (1080x1920).", mensajes: ["Visual: fondo limpio con '$149.900/mes' en tipografía grande y bold. Logo InmoHub.", "Headline: 'CRM + IA PARA AGENTES INMOBILIARIOS'.", "Bullets: 'WhatsApp + IA que clasifica consultas' / 'Pipeline automático' / 'Portales + Ads medidos' / 'Sin contrato — cancelás cuando quieras'.", "CTA: '@inmohub.crm — Link en bio'."], copyAnuncio: "CRM + IA para agentes inmobiliarios 🏠\n\n$149.900/mes\n\n✅ WhatsApp + IA que clasifica cada consulta\n✅ Pipeline que se carga solo\n✅ Portales + Ads medidos\n✅ Sin contrato — cancelás cuando quieras\n\nEmpezás hoy, operás hoy.\n\n👉 @inmohub.crm — Link en bio", pilar: "Marca", tema: "Pricing — accesible y sin compromiso", formatoNarrativo: "Producto — Pricing", estructuraNarrativa: "Precio - Features - Acción", tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG7: CARRUSEL — 5 COSAS QUE INMOHUB HACE MIENTRAS MOSTRÁS PROPIEDADES ──
        { formato: "Posteo Cuadrado (1080x1080)", dolor: "El agente inmobiliario pasa gran parte del día fuera de su oficina mostrando propiedades. Mientras tanto, las consultas siguen llegando al WhatsApp y nadie las gestiona.", solucion: "InmoHub trabaja en segundo plano mientras el agente está en la calle. Clasifica consultas, transcribe audios, conecta propiedades, detecta portales y registra cada lead.", comunicacion: "Carrusel x6 slides educativo. Cada slide presenta una cosa que InmoHub hace automáticamente. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: '5 COSAS QUE INMOHUB HACE MIENTRAS VOS MOSTRÁS PROPIEDADES' Visual: agente mostrando departamento + notificaciones de InmoHub.", "Slide 2: '1. CLASIFICA CADA CONSULTA CON IA' — 'Venta, alquiler o captación. Automáticamente.'", "Slide 3: '2. TRANSCRIBE TUS AUDIOS DE WHATSAPP' — 'Si te mandan un audio, InmoHub lo transcribe y lo procesa.'", "Slide 4: '3. DETECTA DE QUÉ PORTAL VIENE CADA CLIENTE' — 'ZonaProp, ArgenProp, MercadoLibre → sabés el origen de cada uno.'", "Slide 5: '4. CONECTA CADA CONSULTA CON LA PROPIEDAD CORRECTA' — 'IA de matching automático.'", "Slide 6: '5. REGISTRA CADA LEAD EN TU PIPELINE' — 'Cuando volvés de la calle, tu CRM ya está cargado. @inmohub.crm'"], copyAnuncio: "5 cosas que InmoHub hace mientras vos mostrás propiedades 🏠\n\n1️⃣ Clasifica cada consulta con IA (venta/alquiler/captación)\n2️⃣ Transcribe tus audios de WhatsApp\n3️⃣ Detecta de qué portal viene cada cliente\n4️⃣ Conecta la consulta con la propiedad correcta\n5️⃣ Registra cada lead en tu pipeline\n\nCuando volvés de la calle, tu CRM ya está cargado.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "5 cosas automáticas — el CRM trabaja solo", formatoNarrativo: "Educativo — Listicle", estructuraNarrativa: "Premisa - Lista - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG8: CARRUSEL — ANTES vs AHORA ──
        { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes inmobiliarios gestionan su negocio con Excel, WhatsApp y memoria. Pierden datos, clientes y tiempo en trabajo administrativo que no genera operaciones.", solucion: "InmoHub reemplaza el caos por un pipeline organizado con IA. De buscar en chats a tener todo registrado automáticamente.", comunicacion: "Carrusel x5 slides comparativo antes/después. Split screen o alternating slides. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'ANTES vs AHORA — El día a día de un agente inmobiliario' Visual: split screen Excel caótico vs InmoHub pipeline.", "Slide 2: 'ANTES — Buscás clientes en 200 chats de WhatsApp' → 'AHORA — Cada consulta clasificada y registrada automáticamente'.", "Slide 3: 'ANTES — No sabés de dónde vienen tus clientes' → 'AHORA — Portales, ads y orgánico: todo trazado con origen'.", "Slide 4: 'ANTES — Escuchás 15 audios por día para encontrar datos' → 'AHORA — Audios transcritos automáticamente con IA'.", "Slide 5: CTA — 'Pasá del antes al ahora. @inmohub.crm — Link en bio'."], copyAnuncio: "ANTES vs AHORA — El día a día de un agente inmobiliario 📊\n\n❌ ANTES: buscás clientes en 200 chats\n✅ AHORA: cada consulta clasificada automáticamente\n\n❌ ANTES: no sabés de dónde vienen tus clientes\n✅ AHORA: portales, ads y orgánico trazados\n\n❌ ANTES: 15 audios por día sin escuchar\n✅ AHORA: audios transcritos con IA\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Antes vs Ahora — transformación del agente", formatoNarrativo: "Educativo — Antes/Ahora", estructuraNarrativa: "Problema - Transformación - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG9: CARRUSEL — CÓMO FUNCIONA INMOHUB EN 4 PASOS ──
        { formato: "Posteo Cuadrado (1080x1080)", dolor: "Agentes no entienden cómo funciona un CRM con IA. Creen que es complicado de configurar y requiere semanas de setup.", solucion: "InmoHub funciona en 4 pasos simples: conectás WhatsApp → la IA clasifica → matching de propiedad → aparece en tu pipeline. Empezás hoy, operás hoy.", comunicacion: "Carrusel x5 slides step-by-step. Cada paso con screenshot o ícono. Adaptar a Story (1080x1920).", mensajes: ["Slide 1: 'CÓMO FUNCIONA INMOHUB EN 4 PASOS' Visual: logo InmoHub + íconos de los 4 pasos.", "Slide 2: 'PASO 1 — CONECTÁS TU WHATSAPP' — 'InmoHub se conecta a tu WhatsApp en 5 minutos. No cambia nada para vos ni para tus clientes.'", "Slide 3: 'PASO 2 — LA IA CLASIFICA CADA MENSAJE' — 'Detecta consultas por propiedades automáticamente. Clasifica: venta, alquiler o captación.'", "Slide 4: 'PASO 3 — MATCHING DE PROPIEDAD' — 'Conecta cada consulta con la propiedad correspondiente de tu cartera.'", "Slide 5: 'PASO 4 — APARECE EN TU PIPELINE' — 'Cada lead listo para gestionar. Nuevo → Contactado → Visita → Cierre. @inmohub.crm'"], copyAnuncio: "Cómo funciona InmoHub en 4 pasos 🚀\n\n1️⃣ Conectás tu WhatsApp (5 min)\n2️⃣ La IA clasifica cada mensaje (venta/alquiler/captación)\n3️⃣ Matching automático de propiedad\n4️⃣ Aparece en tu pipeline listo para gestionar\n\nSin configuración, sin cargar datos.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Cómo funciona — 4 pasos simples", formatoNarrativo: "Educativo — Step by Step", estructuraNarrativa: "Pregunta - Pasos - Acción", tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" }, enRevision: false },
        // ── ORG10: VIDEO ANIMADO — FLUJO COMPLETO DEL LEAD ──
        { formato: "Video Animado Vertical (9:16)", dolor: "Los agentes no visualizan cómo funciona un CRM con IA en la práctica. Necesitan ver el producto en acción para entender el valor.", solucion: "Demo animada del flujo completo: un cliente escribe por WhatsApp → InmoHub detecta la consulta → la IA clasifica (Venta) → matching con propiedad → aparece en el pipeline.", comunicacion: "[0-3s] HOOK — Animación de mensaje de WhatsApp entrando: 'Hola, vi un 3 ambientes en Palermo que publicaste...' Texto overlay: 'ESTO PASA CUANDO TE ESCRIBEN POR WHATSAPP'. [3-6s] BODY — Screen recording: el mensaje aparece en inbox, la IA lo clasifica con badge verde 'VENTA'. Animación del badge apareciendo. [6-9s] BODY — IA hace matching con propiedad '3 amb Palermo'. Líneas animadas conectando contacto con propiedad. [9-12s] BODY — Lead aparece en pipeline kanban columna 'Nuevo' con info completa: nombre, propiedad, origen, clasificación. [12-15s] CTA — Texto overlay: 'El CRM que se carga solo. @inmohub.crm' Logo InmoHub.", hook: "Esto pasa cuando te escriben por WhatsApp.", body: "InmoHub detecta la consulta, la IA clasifica automáticamente como Venta, conecta con la propiedad de tu cartera y aparece en tu pipeline. Vos no tocás nada.", cta: "El CRM que se carga solo. @inmohub.crm", copyAnuncio: "Esto pasa cuando te escriben por WhatsApp 📱\n\n1️⃣ Te llega un mensaje\n2️⃣ InmoHub lo detecta automáticamente\n3️⃣ La IA clasifica: Venta ✅\n4️⃣ Matching con la propiedad de tu cartera\n5️⃣ Aparece en tu pipeline\n\nVos no tocás nada.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Flujo completo — del WhatsApp al pipeline", formatoNarrativo: "Demo — Screen Recording + Motion Graphics", estructuraNarrativa: "Trigger - Proceso - Resultado", tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Motion Graphics" }, duracion: "12-15s", enRevision: false },
        // ── ORG11: VIDEO ANIMADO — PIPELINE KANBAN EN ACCIÓN ──
        { formato: "Video Animado Vertical (9:16)", dolor: "Los agentes no tienen visibilidad de en qué etapa está cada cliente. No saben cuántos leads nuevos tienen, cuántos contactaron ni cuántos están por cerrar.", solucion: "Pipeline kanban de InmoHub: columnas Nuevo → Contactado → Visita → Oferta → Cierre. Cada lead con clasificación, propiedad y origen. Drag & drop entre etapas.", comunicacion: "[0-3s] HOOK — Animación del pipeline vacío que se llena con leads entrantes. Texto overlay: 'ASÍ SE VE TU NEGOCIO CUANDO TODO ESTÁ ORGANIZADO'. [3-7s] BODY — Screen recording del pipeline kanban con leads en columnas: Nuevo (3), Contactado (2), Visita (1), Oferta (1). Zoom in a card: nombre, propiedad, badge 'Venta', origen 'WhatsApp'. [7-11s] BODY — Drag & drop animado de lead de 'Visita' a 'Oferta'. Pipeline se actualiza. Contadores cambian con micro-animaciones. [11-15s] CTA — Texto overlay: 'Tu pipeline se arma solo con InmoHub. @inmohub.crm' Logo InmoHub.", hook: "Así se ve tu negocio cuando todo está organizado.", body: "Pipeline kanban con cada lead clasificado, cada propiedad conectada y cada etapa visible. Nuevo → Contactado → Visita → Oferta → Cierre. Se arma solo.", cta: "Tu pipeline se arma solo con InmoHub. @inmohub.crm", copyAnuncio: "Así se ve tu negocio cuando todo está organizado 📊\n\n🟢 Nuevo → Contactado → Visita → Oferta → Cierre\n\n✅ Cada lead con su clasificación\n✅ Cada propiedad conectada\n✅ Cada etapa visible\n\nTu pipeline se arma solo con InmoHub.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Pipeline kanban — cada lead en su etapa", formatoNarrativo: "Demo — Screen Recording + Motion Graphics", estructuraNarrativa: "Afirmación visual - Demo - Resultado", tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Motion Graphics" }, duracion: "12-15s", enRevision: false },
        // ── ORG12: VIDEO ANIMADO — DASHBOARD + PROPPY ──
        { formato: "Video Animado Vertical (9:16)", dolor: "Los agentes no miden su negocio. No saben cuántos leads generan por semana, cuál es su tasa de conversión ni qué canal funciona mejor. Toman decisiones por sensación.", solucion: "Dashboard de InmoHub con métricas en tiempo real + Proppy, el asistente de IA que responde preguntas sobre tu negocio en lenguaje natural.", comunicacion: "[0-3s] HOOK — Screen del dashboard con KPIs animándose (contadores subiendo): leads semanales, conversión, pipeline value. Texto overlay: 'TU NEGOCIO CON NÚMEROS, NO CON SENSACIONES'. [3-7s] BODY — Zoom in al dashboard: leads por semana (gráfico de barras), tasa de conversión lead→visita→cierre, desglose por canal (WhatsApp, ZonaProp, Meta Ads). [7-11s] BODY — Transición a Proppy (chat IA): alguien escribe '¿Cuántos leads nuevos tuve esta semana?' y Proppy responde con datos del CRM. Animación de typing y respuesta. [11-15s] CTA — Texto overlay: 'Medí tu negocio inmobiliario con InmoHub. @inmohub.crm' Logo InmoHub.", hook: "Tu negocio con números, no con sensaciones.", body: "Dashboard con métricas en tiempo real: leads, conversión, pipeline value, performance por canal. Y Proppy, tu asistente IA que responde preguntas sobre tu negocio.", cta: "Medí tu negocio inmobiliario con InmoHub. @inmohub.crm", copyAnuncio: "Tu negocio con números, no con sensaciones 📊\n\n📈 Dashboard en tiempo real:\n✅ Leads por semana\n✅ Conversión: lead → visita → cierre\n✅ Performance por canal\n\n🤖 Proppy — asistente IA:\n'¿Cuántos leads nuevos tuve esta semana?'\nTe responde con datos de tu CRM.\n\n👉 @inmohub.crm — Link en bio", pilar: "Producto", tema: "Dashboard + Proppy — métricas y asistente IA", formatoNarrativo: "Demo — Screen Recording + Motion Graphics", estructuraNarrativa: "Afirmación - Demo - Feature", tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Motion Graphics" }, duracion: "12-15s", enRevision: false },
      ],
      bannerPiezas: "12 piezas orgánicas (6 posteos + 3 carruseles + 3 videos animados de feature). Publicar en feed + stories de @inmohub.crm.",
    },
    // ═══════════════════════════════════════════════════════════════
    // CAMPAÑA 2: AWARENESS — 3 videos UGC + 3 orgánicas boosted
    // Presupuesto: USD 70/mes
    // ═══════════════════════════════════════════════════════════════
    {
      nombre: "INMOHUB_Awareness",
      objetivo: "Interacción",
      status: "activa",
      conSubsecciones: true,
      tituloSeccion: "Campaña de Awareness",
      descripcionCampana: "Campaña paga de awareness con 6 piezas: 3 videos UGC de Jonathan (founder story, WhatsApp #1, portales) + 3 piezas orgánicas boosted (CRM que se carga solo, FOMO dolor, 5 cosas que InmoHub hace). Los videos UGC construyen marca personal, las orgánicas boosted amplían el alcance del contenido que mejor performó. Dos conjuntos por nivel de conciencia: demanda latente (agentes sin ads) y demanda activa (agentes con ads). Objetivo: crecimiento de audiencia + visitas al perfil.",
      destino: "Perfil de Instagram (@inmohub.crm)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Interacciones"],
      conversionCampana: "Visitas al Perfil de Instagram",
      presupuestoCampana: { diario: "USD $2,3/día", mensual: "USD $70/mes" },
      adSets: [
        {
          nombre: "Conjunto_SinAds",
          segmentacion: "25-55 años, Argentina. Intereses: Agente inmobiliario, Bienes raíces, Inmobiliaria, Broker inmobiliario, Propiedades en venta, Real estate",
          ads: [
            "Anuncio_Reel_FounderStory_V1 | Trabajé en Real Estate y creé InmoHub — WhatsApp + IA",
            "Anuncio_Reel_WhatsApp1_V1 | WhatsApp es tu canal #1 y perdés contexto",
            "Anuncio_Reel_Portales_V1 | Si usás portales inmobiliarios, esto te va a interesar",
            "Boost_ORG01_CRM_V1 | El CRM que se carga solo (pieza orgánica boosted)",
            "Boost_ORG04_FOMO_V1 | Mientras buscás en chats, otro agente ya cerró (pieza orgánica boosted)",
            "Boost_ORG07_5Cosas_V1 | 5 cosas que InmoHub hace mientras mostrás propiedades (pieza orgánica boosted)",
          ],
        },
        {
          nombre: "Conjunto_ConAds",
          segmentacion: "25-55 años, Argentina. Intereses: Meta Ads, Facebook Ads, Marketing inmobiliario, CRM, Lead generation, Publicidad online, Marketing digital",
          ads: [
            "Anuncio_Reel_FounderStory_V1 | Trabajé en Real Estate y creé InmoHub — WhatsApp + IA",
            "Anuncio_Reel_WhatsApp1_V1 | WhatsApp es tu canal #1 y perdés contexto",
            "Anuncio_Reel_Portales_V1 | Si usás portales inmobiliarios, esto te va a interesar",
            "Boost_ORG01_CRM_V1 | El CRM que se carga solo (pieza orgánica boosted)",
            "Boost_ORG04_FOMO_V1 | Mientras buscás en chats, otro agente ya cerró (pieza orgánica boosted)",
            "Boost_ORG07_5Cosas_V1 | 5 cosas que InmoHub hace mientras mostrás propiedades (pieza orgánica boosted)",
          ],
        },
      ],
      piezas: [
        // ── AW1: VIDEO — FOUNDER STORY (POR QUÉ INMOHUB) ──
        {
          formato: "Video Comercial Vertical (9:16)",
          dolor: "Agentes inmobiliarios pierden clientes y operaciones por no tener tecnología que gestione sus procesos comerciales. No saben que existe una solución creada desde adentro del rubro.",
          solucion: "Jonathan trabajó en Real Estate, encontró los dolores de gestionar procesos comerciales y creó InmoHub — una app que se conecta a tu WhatsApp + IA para detectar y clasificar todos tus mensajes.",
          comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC, fondo propiedades Puerto Madero: 'Hace un tiempo tuve la oportunidad de trabajar en Real Estate.' [3-8s] BODY — Inserts de propiedades en Puerto Madero, edificios en construcción, oficina. Jonathan narra suelto: 'En mi paso por el rubro aprendí muchísimo sobre el área comercial. Y en todo ese aprendizaje encontré muchos dolores a la hora de gestionar procesos comerciales.' [8-14s] BODY — Transición a screen recording de InmoHub en celular: 'Por eso decidí crear InmoHub, una app que se conecta a tu WhatsApp con Inteligencia Artificial para detectar y clasificar todos tus mensajes.' [14-18s] CTA — Jonathan cierra mirando a cámara: 'Si querés saber cómo funciona, seguí a @inmohub.crm.' [18-20s] CIERRE — Motion graphics con logo InmoHub + @inmohub.crm.",
          hook: "Hace un tiempo tuve la oportunidad de trabajar en Real Estate.",
          body: "En mi paso por el rubro aprendí muchísimo sobre el área comercial. Y en todo ese aprendizaje encontré muchos dolores a la hora de gestionar procesos comerciales. Por eso decidí crear InmoHub, una app que se conecta a tu WhatsApp con Inteligencia Artificial para detectar y clasificar todos tus mensajes.",
          cta: "Si querés saber cómo funciona, seguí a @inmohub.crm.",
          copyAnuncio: "Hace un tiempo tuve la oportunidad de trabajar en Real Estate 🏠\n\nEn mi paso por el rubro encontré muchos dolores a la hora de gestionar procesos comerciales.\n\nPor eso creé InmoHub — una app que se conecta a tu WhatsApp con IA para detectar y clasificar todos tus mensajes.\n\n🤖 Detecta consultas por propiedades automáticamente\n📊 Registra cada cliente de cada canal\n\n👉 Seguí a @inmohub.crm",
          pilar: "Marca",
          tema: "Founder story — por qué creé InmoHub",
          formatoNarrativo: "Direct to Camera — UGC Storytelling",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
          duracion: "15-20s",
          enRevision: false,
        },

        // ── AW2: VIDEO — WHATSAPP ES TU CANAL #1 ──
        {
          formato: "Video Comercial Vertical (9:16)",
          dolor: "Si sos agente inmobiliario o inmobiliaria, WhatsApp es tu canal número uno de ventas. Entre la cantidad de consultas y conversaciones, perdés contexto y se complica el seguimiento. Así es como se pierden operaciones.",
          solucion: "InmoHub se conecta a tu WhatsApp con IA y detecta automáticamente cada mensaje relacionado con propiedades o primeros contactos. Los levanta al sistema sin que hagas nada.",
          comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si sos agente inmobiliario o inmobiliaria, WhatsApp probablemente sea tu canal número uno de ventas.' [3-8s] BODY — Inserts de WhatsApp con múltiples chats, notificaciones acumuladas, Jonathan narra: 'Muchas veces entre la cantidad de consultas y conversaciones que se van llevando, perdés mucho contexto y se complica el seguimiento. Así es como se pierden operaciones.' [8-14s] BODY — Screen recording de InmoHub detectando y clasificando mensajes: 'InmoHub viene a solucionar eso con tecnología e Inteligencia Artificial. Se conecta a tu WhatsApp y detecta automáticamente cada consulta por propiedades.' [14-18s] CTA — Jonathan cierra: 'Seguí a @inmohub.crm y te muestro cómo funciona.' [18-20s] CIERRE — Motion graphics con logo InmoHub + @inmohub.crm.",
          hook: "Si sos agente inmobiliario o inmobiliaria, WhatsApp probablemente sea tu canal número uno de ventas.",
          body: "Muchas veces entre la cantidad de consultas y conversaciones que se van llevando, perdés mucho contexto y se complica el seguimiento. Así es como se pierden operaciones. InmoHub viene a solucionar eso con tecnología e Inteligencia Artificial. Se conecta a tu WhatsApp y detecta automáticamente cada consulta por propiedades.",
          cta: "Seguí a @inmohub.crm y te muestro cómo funciona.",
          copyAnuncio: "Si sos agente inmobiliario, WhatsApp es tu canal #1 de ventas 📱\n\nEntre la cantidad de consultas y conversaciones perdés contexto y seguimiento.\n\n❌ Así es como se pierden operaciones.\n\n✅ InmoHub se conecta a tu WhatsApp con IA y detecta cada consulta por propiedades automáticamente.\n\nMientras vos perdés el contexto, otro agente ya cerró esa operación.\n\n👉 Seguí a @inmohub.crm",
          pilar: "Producto",
          tema: "WhatsApp + IA — tu canal #1 conectado",
          formatoNarrativo: "Direct to Camera — UGC + Screen Demo",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
          duracion: "15-20s",
          enRevision: false,
        },

        // ── AW3: VIDEO — PORTALES INMOBILIARIOS ──
        {
          formato: "Video Comercial Vertical (9:16)",
          dolor: "Si sos agente inmobiliario y usás portales inmobiliarios, ¿sabés cuántos clientes te llegan de cada uno? ZonaProp, ArgenProp, MercadoLibre — todo cae al WhatsApp y perdés el rastro.",
          solucion: "InmoHub registra cada cliente que te consulta por cada canal y te dice de dónde viene cada uno. Portales, WhatsApp, ads — todo conectado.",
          comunicacion: "[0-3s] HOOK — Jonathan cámara frontal UGC: 'Si sos agente inmobiliario y usás portales inmobiliarios, esto te va a interesar.' [3-8s] BODY — Logos de ZonaProp, ArgenProp, MercadoLibre, Jonathan narra: 'ZonaProp, ArgenProp, MercadoLibre. Te llegan consultas de todos lados, caen a tu WhatsApp y perdés el rastro de cuál vino de dónde.' [8-14s] BODY — Screen recording de InmoHub mostrando origen de cada contacto: 'InmoHub registra cada cliente que te consulta y te dice de qué portal viene. Sabés exactamente qué funciona y qué no.' [14-18s] CTA — Jonathan cierra: 'Seguí a @inmohub.crm para ver cómo funciona.' [18-20s] CIERRE — Motion graphics con logo InmoHub + @inmohub.crm.",
          hook: "Si sos agente inmobiliario y usás portales inmobiliarios, esto te va a interesar.",
          body: "ZonaProp, ArgenProp, MercadoLibre. Te llegan consultas de todos lados, caen a tu WhatsApp y perdés el rastro de cuál vino de dónde. InmoHub registra cada cliente que te consulta y te dice de qué portal viene. Sabés exactamente qué funciona y qué no.",
          cta: "Seguí a @inmohub.crm para ver cómo funciona.",
          copyAnuncio: "Si sos agente inmobiliario y usás portales inmobiliarios, esto te va a interesar 🏠\n\nZonaProp, ArgenProp, MercadoLibre — te llegan consultas de todos lados.\n\n❌ Caen al WhatsApp y perdés el rastro.\n✅ InmoHub registra cada cliente y te dice de qué portal viene.\n\n¿Sabés cuántos clientes te generó cada portal este mes?\n\n👉 Seguí a @inmohub.crm",
          pilar: "Producto",
          tema: "Portales inmobiliarios — registrá el origen de cada cliente",
          formatoNarrativo: "Direct to Camera — UGC + Screen Demo",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
          duracion: "15-20s",
          enRevision: false,
        },

      ],
      bannerPiezas: "6 piezas de Awareness: 3 videos UGC de Jonathan (producción nueva) + 3 piezas orgánicas boosted (ya producidas en campaña orgánica).",
      notaCampana: "Las 3 piezas orgánicas boosted (ORG01, ORG04, ORG07) se publican primero como contenido orgánico. Las que mejor performan se boostean con presupuesto de awareness.",
    },
    {
      nombre: "INMOHUB_Conversiones",
      objetivo: "Conversiones",
      status: "en-desarrollo",
      tituloSubseccion: "Campaña de Conversiones en Meta Ads",
      destino: "inmohub.tech",
      kpisCampana: ["Visitas a landing", "Registros", "CPA"],
      conversionCampana: "Registros en inmohub.tech",
      presupuestoCampana: { diario: "USD $4,3/día", mensual: "USD $130/mes" },
      adSets: [
        {
          nombre: "Conjunto_SinAds",
          segmentacion: "25-55 años, Argentina. Intereses: Agente inmobiliario, Bienes raíces, Inmobiliaria, Gestión de propiedades, Emprendimiento, Productividad",
          ads: [
            "Anuncio_Reel_EnLaCalle_V1 | Tu negocio está en la calle, no en Excel",
            "Anuncio_Reel_Campanas_V1 | Si hacés campañas publicitarias, esto te interesa",
            "Anuncio_Reel_Portales_V1 | Propiedades y desarrollos — conectá todos tus canales",
            "Anuncio_Imagen_FOMO_V1 | Cada consulta sin registrar es una operación perdida",
            "Anuncio_Imagen_CRM_V1 | El CRM que se carga solo — claim directo",
            "Anuncio_Imagen_Dashboard_V1 | Tu negocio con números, no con sensaciones",
            "Anuncio_Carrusel_Pipeline_V1 | De WhatsApp caótico a pipeline organizado",
            "Anuncio_Carrusel_PrimerDia_V1 | ¿Qué pasa en tu primer día con InmoHub?",
            "Anuncio_Carrusel_ConectaTodo_V1 | Conectá WhatsApp + Portales + Ads + Calendar",
          ],
        },
        {
          nombre: "Conjunto_ConAds",
          segmentacion: "25-55 años, Argentina. Intereses: Meta Ads, Facebook Ads, Marketing inmobiliario, CRM inmobiliario, Lead generation, Publicidad digital",
          ads: [
            "Anuncio_Reel_EnLaCalle_V1 | Tu negocio está en la calle, no en Excel",
            "Anuncio_Reel_Campanas_V1 | Si hacés campañas publicitarias, esto te interesa",
            "Anuncio_Reel_Portales_V1 | Propiedades y desarrollos — conectá todos tus canales",
            "Anuncio_Imagen_FOMO_V1 | Cada consulta sin registrar es una operación perdida",
            "Anuncio_Imagen_CRM_V1 | El CRM que se carga solo — claim directo",
            "Anuncio_Imagen_Dashboard_V1 | Tu negocio con números, no con sensaciones",
            "Anuncio_Carrusel_Pipeline_V1 | De WhatsApp caótico a pipeline organizado",
            "Anuncio_Carrusel_PrimerDia_V1 | ¿Qué pasa en tu primer día con InmoHub?",
            "Anuncio_Carrusel_ConectaTodo_V1 | Conectá WhatsApp + Portales + Ads + Calendar",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Jonathan Aguidi (personalmente)",
    capacidadDiaria: "Moderada. Jonathan gestiona desarrollo, ventas y soporte de InmoHub.",
    tiempoRespuesta: "Variable. Depende de la carga operativa del día.",
    validado: false,
  },

  ofertas: null,
  cambiosEcommerce: null,
  competenciaAds: null,
  referenciasMoodboard: null,

  notas: "GTM PLAN — InmoHub (PropTech SaaS, founder Jonathan Aguidi).\n\nESTRATEGIA DE 3 CAMPAÑAS:\n1. Orgánico (12 piezas): contenido para @inmohub.crm que traduce features técnicas en comunicación para agentes. 6 posteos (CRM, IA, audios, FOMO, PWA, pricing) + 3 carruseles (5 cosas, antes/ahora, 4 pasos) + 3 videos animados de feature (flujo lead, pipeline, dashboard+Proppy). Se publican sin pauta.\n2. Awareness (6 piezas, USD 70/mes): 3 videos UGC de Jonathan (founder story, WhatsApp #1, portales) + 3 orgánicas boosted (las que mejor performan).\n3. Conversiones (9 piezas × 2 ICPs, USD 130/mes): 3 videos UGC + 3 posteos + 3 carruseles con destino inmohub.tech. Piezas duplicadas en ambos ICPs (B2C), diferenciación por targeting.\n\nPRODUCTO: 'El CRM que se carga solo' — WhatsApp + IA clasifica (venta/alquiler/captación), matching de propiedades, transcripción de audios, portales (ZonaProp, ArgenProp, ML), Meta Ads, Google Calendar, pipeline kanban, dashboard, Proppy (asistente IA), PWA.\n\nCOMUNICACIÓN: FOMO + exclusividad + urgencia. Cada guion nombra al agente inmobiliario y usa su vocabulario (propiedades, captación, operaciones, portales). Jonathan habla desde experiencia real, UGC frontal. Estilo: propiedades en Puerto Madero, preset de edición, tipografía de subtítulo propia.\n\nFUNNEL UPSELL: CRM (gateway) → Bot IA (upsell) → Ads (upsell) → OS (enterprise/custom).\n\nPricing: ARS $149.900/mes, sin contrato.",

  // REE Metrics customization
  reeMetricsFeatures: [
    { titulo: "Dashboard", desc: "Visualización en tiempo real de inversión, leads y registros por campaña." },
    { titulo: "Timeline", desc: "Historial de actividad y cambios en las campañas." },
    { titulo: "Registros SaaS", desc: "Tracking de registros en inmohub.tech por fuente y campaña." },
  ],
  reeMetricsFuente: "Landing Page",

  // Roadmap
  roadmap: [
    { nombre: "Contenido Orgánico", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Scale", semanaInicio: 4, semanaFin: 8 },
    ]},
    { nombre: "Awareness de Marca", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
      { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
    ]},
    { nombre: "Conversiones (Landing)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
  ],

  seccionesBloqueadas: [],

  proximosPasos: [
    {
      titulo: "Pendientes de Jonathan",
      responsable: "Jonathan",
      tiempo: "Esta semana",
      items: [
        "Compartir brand assets: logo en alta, paleta de colores, capturas del dashboard/pipeline/inbox de InmoHub",
        "Grabar 3 videos UGC de awareness (founder story, WhatsApp #1, portales) sobre la bajada creativa de REE",
        "Grabar 3 videos UGC de conversión (en la calle, campañas publicitarias, propiedades/desarrollos)",
        "Confirmar pricing y URL de registro (inmohub.tech) — verificar flujo de signup completo",
        "Proveer acceso a la app para screen recordings de los 3 videos animados",
      ],
    },
    {
      titulo: "Pendientes de REE",
      responsable: "REE Growth",
      tiempo: "Esta semana",
      items: [
        "Configurar Meta Business Suite y cuenta publicitaria",
        "Instalar y verificar Pixel de Meta en inmohub.tech",
        "Conectar Meta Ads a REE Metrics",
        "Producir 12 piezas de contenido orgánico (6 posteos + 3 carruseles + 3 videos animados)",
        "Editar 6 videos UGC de Jonathan (3 awareness + 3 conversión)",
        "Diseñar 6 piezas gráficas de conversión (3 posteos + 3 carruseles)",
        "Agendar Foundation Review para la semana del 27/10",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call", fecha: "12/10" },
    { semana: 2, label: "Launch Awareness", fecha: "19/10" },
    { semana: 3, label: "Foundation Review", fecha: "27/10" },
    { semana: 4, label: "Launch Conversiones", fecha: "03/11" },
    { semana: 6, label: "Call ADS", fecha: "17/11" },
    { semana: 8, label: "Review Final", fecha: "01/12" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Propuesta + KO Call", desc: "Propuesta aceptada el 08/10 y Kick Off el 12/10. Configuración de Meta Business Suite, conexión de @inmohub.crm, acceso a inmohub.tech para Pixel. Todo listo para arrancar.", status: "done", fecha: "12/10" },
    { semana: "S3", nombre: "Foundation Review", desc: "Revisión completa: plan creativo, guiones, piezas, segmentación, demo REE Metrics. Aprobación para producir contenido y lanzar conversiones.", status: "pending", fecha: "27/10" },
    { semana: "S4", nombre: "Launch Conversiones", desc: "Activación de INMOHUB_Conversiones. 9 piezas × 2 ICPs (3 videos UGC + 3 posteos + 3 carruseles) con destino a inmohub.tech.", status: "pending", fecha: "03/11" },
    { semana: "S6", nombre: "Call ADS", desc: "Seguimiento de ambas campañas. Análisis de pieza ganadora, redistribución de presupuesto, optimización de audiencias.", status: "pending", fecha: "17/11" },
    { semana: "S8", nombre: "Review Final", desc: "Revisión del periodo completo. Resultados vs KPIs y plan del siguiente ciclo.", status: "pending", fecha: "01/12" },
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

  // Copy to Desktop (use slug-suffixed name to avoid cross-client collisions)
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
