import { renderOnboardingHtml } from "../../dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { renderBriefHtml } from "../../dist/lib/brief-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// Helper: read image file as base64 data URI
const clientDir = new URL("./", import.meta.url).pathname;
function assetDataUri(filename) {
  const path = join(clientDir, "assets", filename);
  if (!existsSync(path)) return null;
  const ext = filename.split(".").pop().toLowerCase();
  const mimeMap = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", mp4: "video/mp4", webm: "video/webm" };
  const mime = mimeMap[ext] || "application/octet-stream";
  return `data:${mime};base64,${readFileSync(path).toString("base64")}`;
}

const data = {
  clientInfo: {
    nombreEmpresa: "Micelic",
    slug: "micelic",
    nombreContacto: "Julián Ruiz",
    industria: "Suplementos naturales / Hongos adaptógenos",
    sitioWeb: "micelic.com",
    email: null,
    telefono: null,
    fechaCierre: "2026-10-05",
  },
  datosF1: {
    inversionMensual: "USD 500/mes (fee REE)",
    presupuestoPauta: "USD 500/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (micelic.com)"],
    palancaPropuesta: "Captación: awareness + funnel B2C ecommerce",
    campanasVendidas: ["Awareness de Marca", "Ventas (E-commerce)"],
    duracionProyecto: "8 semanas",
    fechaInicio: null,
    fechaFin: "29/11",
    // Cronograma alineado a semanas calendario (lunes a domingo).
    // S1 = 05/10 (propuesta aceptada + KO Call 07/10) ... S8 = 23/11-29/11 (Black Friday 27/11).
    fechaInicioISO: "2026-10-05",
  },

  // A. Onboarding
  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] Micelic - Growth", status: "hecho", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "hecho", notas: null },
      { label: "Crear grupo cliente: Micelic x REE Growth", status: "hecho", notas: null },
      { label: "Agregar a Julián Ruiz al grupo cliente", status: "hecho", notas: null },
      { label: "Enviar mensaje de bienvenida con agenda de onboarding", status: "hecho", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Verificar que existe portfolio en growth@reecreativos.com", status: "hecho", notas: null },
        { label: "Crear sub-portfolio o estructura para Micelic", status: "hecho", notas: "Julián ya tenía portfolio propio (Julián Ruiz). Se conectó growth@ como admin." },
        { label: "Agregar equipo REE como administradores", status: "hecho", notas: "Acceso completo otorgado a growth@reecreativos.com en la KO Call del 07/10." },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Verificar si Micelic tiene Facebook Page existente", status: "pendiente", notas: "Revisar si existe Page activa bajo el portfolio de Julián. Si no existe, crear bajo portfolio de growth@." },
        { label: "Vincular Facebook Page al Business Portfolio", status: "pendiente", notas: null },
        { label: "Completar información de la Page (nombre, categoría, foto, portada)", status: "pendiente", notas: null },
        { label: "Agregar a Julián como editor de la Page", status: "pendiente", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @micelic.ar es cuenta Business o Creator", status: "hecho", notas: "Era cuenta Creator. Se cambió a Business durante la KO Call." },
        { label: "Vincular Instagram a Meta Business Suite", status: "hecho", notas: "Conectada en la KO Call del 07/10." },
        { label: "Vincular Instagram al portfolio de growth@", status: "hecho", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Cuenta publicitaria existente de Julián (en ARS)", status: "hecho", notas: "Se mantiene la cuenta en ARS para conservar el historial del algoritmo." },
        { label: "Configurar timezone: America/Buenos_Aires", status: "hecho", notas: null },
        { label: "Moneda: ARS (se mantiene para preservar datos históricos)", status: "hecho", notas: "Pagos en USD vía billetera ARC para evitar el 32% de impuesto de Mercado Pago." },
        { label: "Asignar Instagram @micelic.ar a la cuenta", status: "hecho", notas: null },
        { label: "Agregar equipo REE como Anunciantes", status: "hecho", notas: "Acceso completo a growth@ otorgado en la KO Call." },
        { label: "Verificar tarjeta/método de pago (billetera ARC)", status: "hecho", notas: "Julián paga en USD vía ARC. Evita el 32% de impuesto de Mercado Pago." },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Verificar si existe Pixel en la cuenta", status: "pendiente", notas: "Revisar si la agencia anterior configuró Pixel." },
        { label: "Instalar/verificar Pixel en micelic.com (Tienda Nube)", status: "pendiente", notas: "Tienda Nube tiene integración nativa con Meta Pixel." },
        { label: "Configurar eventos: PageView, ViewContent, AddToCart, Purchase", status: "pendiente", notas: null },
        { label: "Verificar con Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Configurar CAPI vía integración Tienda Nube o Gateway", status: "pendiente", notas: "Verificar si Tienda Nube soporta CAPI nativo." },
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
        { label: "Testear con Test Events en Events Manager", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Cuenta publicitaria en ARS con pagos en USD",
        aplica: true,
        instrucciones: "La cuenta publicitaria de Micelic está configurada en ARS para preservar el historial del algoritmo. Julián paga en USD a través de la billetera ARC, lo que evita el 32% de impuesto que cobra Mercado Pago. Se mantiene esta configuración: no cambiar la moneda de la cuenta a USD.",
      },
      {
        condicion: "Agencia anterior activa ($70k ARS/mes)",
        aplica: true,
        instrucciones: "Micelic tiene una agencia actual que cobra $70k ARS/mes y mantiene 5 anuncios corriendo. La agencia es reactiva, no aporta análisis proactivos. Coordinar la transición: revisar los anuncios existentes para identificar qué funcionó históricamente, luego Julián decide si pausar o mantener esos anuncios durante la fase de build de REE.",
      },
      {
        condicion: "Anuncios activos sin identidad de marca asociada",
        aplica: true,
        instrucciones: "Los 5 anuncios actuales de Micelic no tienen la identidad de @micelic.ar ni el founder (Julián) asociados. Esto desaprovecha la credibilidad del fundador. Los nuevos anuncios deben vincular la identidad de Micelic y posicionar a Julián como cara de la marca.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Paleta de colores oficial", status: "pendiente", notas: null },
        { label: "Fotos de productos en alta calidad (extractos 30ml y 60ml)", status: "pendiente", notas: "Revisar si el perfil de @micelic.ar ya tiene fotos reutilizables." },
        { label: "Videos de Julián hablando de los productos (reels, UGC)", status: "pendiente", notas: "Activo clave: Julián dando la cara es el mayor diferencial de Micelic." },
        { label: "Guía de marca / manual de identidad (si existe)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a Tienda Nube (micelic.com)", status: "hecho", notas: "Julián compartió credenciales directas en la KO Call del 07/10." },
        { label: "Google Analytics (si existe)", status: "pendiente", notas: null },
        { label: "Datos de tráfico y conversión del e-commerce (últimos 3 meses)", status: "pendiente", notas: "Datos iniciales: 114 ventas, ~$1M ARS en Tienda Nube." },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de WhatsApp Business del cliente", status: "pendiente", notas: null },
        { label: "Verificar que sea cuenta Business (no Personal)", status: "pendiente", notas: null },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién atiende los leads entrantes", status: "pendiente", notas: "Julián atiende todo personalmente." },
        { label: "Definir tiempo máximo de respuesta por categoría", status: "pendiente", notas: null },
        { label: "Validar capacidad de atención diaria", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "Tienda Nube",
      descripcion: "E-commerce de Micelic (micelic.com)",
      items: [
        { label: "Acceso admin a Tienda Nube", status: "hecho", notas: "Julián compartió credenciales directas. El usuario invitado no tenía permisos suficientes para conectar a REE Metrics." },
        { label: "Conectar Tienda Nube a REE Metrics", status: "pendiente", notas: null },
      ],
    },
    tracking: null,
  },

  koCall: {
    fechaPropuesta: "07/10/2026",
    duracionTotal: "30 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Intro: qué vamos a configurar hoy", output: "Contexto alineado" },
      { nombre: "Onboarding Meta", duracion: "15 min", objetivo: "Conectar Instagram @micelic.ar a Meta Business Suite, otorgar acceso a growth@", output: "Cuenta publicitaria lista" },
      { nombre: "Accesos", duracion: "5 min", objetivo: "Obtener credenciales de Tienda Nube", output: "Acceso a Tienda Nube" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Próximos pasos: investigación + plan creativo", output: "Foundation Review agendada" },
    ],
    flujoTemas: [
      "Conectar @micelic.ar a Meta Business Suite",
      "Otorgar acceso completo a growth@reecreativos.com",
      "Obtener acceso admin a Tienda Nube",
      "Revisar configuración de cuenta publicitaria (moneda ARS, pagos via ARC)",
      "Definir próximos pasos: investigación de competencia, bajada creativa, plan de la semana siguiente",
    ],
    temasWow: [
      "Mostrar ejemplo de dashboard de REE Metrics con data de otro cliente (anonimizado)",
      "Explicar cómo funciona el tracking de conversiones y por qué importa",
      "Compartir benchmark de CPL en suplementos / D2C Argentina",
    ],
    checklist: {
      titulo: "Preparación KO Call",
      items: [
        { label: "Agendar fecha con Julián", status: "hecho", notas: "Miércoles 07/10 a las 11:30" },
        { label: "Enviar invite de Google Calendar", status: "hecho", notas: null },
        { label: "Preparar agenda de onboarding", status: "hecho", notas: null },
        { label: "Tener datos de benchmark listos", status: "pendiente", notas: null },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: {
      nombre: "Foundation Review",
      fechaTentativa: "Lunes 19/10 (S3)",
      objetivos: [
        "Presentar plan creativo completo (guiones + mensajes)",
        "Revisar estrategia de competencia y ángulos de comunicación",
        "Demo de REE Metrics con datos reales de Micelic",
        "Alinear producción de contenido con Julián",
      ],
    },
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "Micelic no tiene un problema de contenido ni de producto: la producción orgánica es sólida, el e-commerce funciona y Julián ya genera contenido informativo de calidad. Falta la capa de paid media que capitalice ese contenido y la capa de datos que diga qué ángulo convierte. La agencia actual ($70k ARS/mes) es reactiva y no aporta análisis. Con 5 anuncios sin identidad de marca corriendo contra competidores con 210+ anuncios activos, la prioridad es generar awareness con el diferencial del founder y activar el funnel de ventas del e-commerce con tracking completo.",
  },

  icp: [
    {
      segmento: "Consciente del Síntoma",
      descripcion: "Persona de 28-55 años con trabajo demandante e hijos a cargo. Arrastra estrés sostenido, mal descanso o cansancio crónico. No busca un hongo, busca dormir bien, tener más energía o bajar la ansiedad. No tiene conciencia del producto: nunca probó adaptógenos, viene de tomar Clonazepam o café y quiere una alternativa natural. Necesita ver a Micelic varias veces antes de comprar porque necesita generar confianza y entender el producto.",
      frase: "Quiero dormir bien y levantarme con energía, sin pastillas ni 5 cafés",
      dolores: [
        "Duerme mal, se despierta sin energía y arrastra el día con estrés",
        "Depende de café o pastillas para funcionar, sabe que no es sostenible",
        "No encuentra alternativa natural que tenga respaldo real y no sea solo marketing",
        "No sabe qué es un adaptógeno ni por dónde empezar",
      ],
      deseos: [
        "Volver a dormir bien y levantarse con energía real",
        "Una alternativa natural a la medicación, sin efectos secundarios",
        "Entender qué tomar según su problema específico (sueño, energía, concentración)",
        "Comprar de una marca con un founder visible que explique y acompañe",
      ],
      objeciones: [
        "¿Cómo sé que esto tiene respaldo y no es solo marketing?",
        "¿Cuánto tardan en hacer efecto?",
        "¿Esto reemplaza mi medicación?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
    },
    {
      segmento: "Consciente del Producto",
      descripcion: "Persona de 28-55 años que ya consume extractos de hongos adaptógenos. Probó otras marcas y sospecha que están diluidas o no declaran la concentración real. Busca calidad concentrada con métodos de extracción transparentes. Es un consumidor habitual: compra con frecuencia pero está dispuesto a cambiar de marca si encuentra algo mejor o diferenciador en la oferta.",
      frase: "Quiero un extracto que me diga la verdad sobre lo que tiene adentro",
      dolores: [
        "Probó extractos de otras marcas y sospecha que están diluidos",
        "Las marcas no declaran la concentración ni el método de extracción",
        "Paga premium sin saber si realmente está recibiendo calidad",
        "No encuentra una marca argentina con transparencia en el proceso",
        "La marca que usa tiene pocas presentaciones o poca variedad",
        "No encuentra combos o packs que le permitan probar más por menos",
      ],
      deseos: [
        "Un producto con la concentración declarada y el método de extracción explicado",
        "Una marca argentina con un founder visible y una comunidad detrás",
        "Saber exactamente qué hay adentro del frasco",
        "Más variedad de presentaciones: extracto líquido, polvo, combos",
        "Ofertas y packs que premien la compra recurrente (x2, x4, x6)",
        "Mejores opciones de presentación, envío rápido y atención personalizada",
      ],
      objeciones: [
        "Ya tengo mi marca, ¿por qué la cambiaría?",
        "¿Qué diferencial tiene Micelic respecto a la competencia?",
        "¿El precio justifica el cambio?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
    },
  ],

  propuestaDeValor: {
    descripcion: "Extractos de hongos adaptógenos concentrados, con método de extracción declarado y concentración transparente en cada frasco. Reishi, Melena de León, Cordyceps y más. Founder visible (Julián Ruiz) que educa, acompaña y da la cara por la marca. E-commerce con envíos a todo el país.",
    diferenciador: "Founder visible que da la cara y genera confianza humana — algo que los competidores masivos (Fungi Melena con 210 anuncios, caras distintas) no pueden replicar. Transparencia total en concentración y método de extracción.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Contacto que pide precio, quiere comprar, o pregunta por envío/disponibilidad. Intent de compra claro.",
      accion: "Contactar en menos de 2 horas. Responder por WhatsApp con catálogo y opciones de envío.",
    },
    {
      categoria: "B",
      descripcion: "Pregunta genérica sobre productos, para qué sirve cada extracto, o pide información. Interés pero sin intent de compra inmediato.",
      accion: "Contactar en menos de 24 horas. Responder con info y link al e-commerce.",
    },
    {
      categoria: "C",
      descripcion: "Interacción en redes (like, comentario, share) sin mensaje directo. Awareness sin intent.",
      accion: "No requiere contacto directo. Se nutren con contenido orgánico y retargeting.",
    },
  ],

  reeMetricsResetPasswordUrl: "https://tentacles.reecreativos.com/reset-password?token=81ef114c212e266d89cef66b3c03b596c3982653ff1708ee2153206326ccf41b&welcome=true",

  kpis: [
    { nombre: "CPL (visita e-commerce)", objetivo: null, fuente: "Meta Ads + REE Metrics" },
    { nombre: "CPA (venta Tienda Nube)", objetivo: null, fuente: "Tienda Nube + Pixel" },
    { nombre: "ROAS", objetivo: "> 1.5x", fuente: "Meta Ads + REE Metrics" },
    { nombre: "CAC (costo adquisición cliente)", objetivo: null, fuente: "Meta Ads + Tienda Nube" },
    { nombre: "Ticket promedio", objetivo: null, fuente: "Tienda Nube" },
    { nombre: "Tasa de conversión e-commerce", objetivo: "2%+ (benchmark D2C)", fuente: "Tienda Nube Analytics" },
    { nombre: "Alcance mensual", objetivo: null, fuente: "Meta Ads" },
    { nombre: "Crecimiento seguidores IG", objetivo: null, fuente: "Instagram Insights" },
  ],

  presupuesto: {
    pauta: "USD 500/mes — $765.000 ARS (billetera ARC de Julián en Meta): USD 150 Awareness + USD 350 Ventas",
    fee: "USD 500/mes — $765.000 ARS (USD 450 servicio + USD 50 REE Metrics)",
    total: "USD 1.000/mes — $1.530.000 ARS (TC $1.530)",
    cplTarget: null,
    limiteGastoCuenta: null,
  },

  creativos: {
    piezasPorIcp: [
      // ──────────────────────────────────────────────────────────────────────
      // VENTAS — 5 piezas × 2 ICPs = 10 anuncios
      // 1 video + 3 carruseles (post + historia) + 1 Shopping (colección diferente por ICP)
      // ──────────────────────────────────────────────────────────────────────
      {
        icp: "Consciente del Síntoma (5 anuncios)",
        piezas: [

          // --- VIDEO UGC: DOLORES DEL ICP (estrés, mal sueño, cansancio) ---
          {
            formato: "Video UGC Vertical (9:16)",
            dolor: "Estrés sostenido, mal sueño y cansancio crónico. Depende de café o pastillas para funcionar. No conoce los adaptógenos como alternativa.",
            solucion: "Hongos adaptógenos de Micelic como alternativa natural: Reishi para el sueño, Melena de León para la concentración, Cordyceps para la energía. Disponibles en extracto triple concentrado.",
            comunicacion: "Produce la creadora UGC (test mujer vs. Julián como variable de performance). [0-4s] HOOK — Creadora UGC a cámara, plano medio, expresión directa. Isotipo de Micelic fijo en esquina superior (pequeño, permanente todo el video). Subtítulos centrados en mitad inferior del cuadro: \"¿Estrés, mal sueño y cansancio? Existe una solución natural.\"\n\n[4-10s] DOLOR — Creadora UGC a cámara, tono empático, gesticula contando: \"Tomás café o mate para arrancar, a la noche no dormís bien, y al otro día estás peor. Y así todos los días. Cansado.\"\n\n[10-18s] SOLUCIÓN — Creadora UGC levanta los frascos uno por uno, close-up de cada etiqueta: \"Los hongos adaptógenos regulan tu sistema nervioso de forma natural. Reishi para dormir mejor. Melena de León para pensar claro. Cordyceps para la energía, sin café.\"\n\n[18-24s] PRODUCTO — Close-up del producto sobre la mesa: un frasco solo y dos frascos juntos, etiquetas visibles. Creadora UGC en off: \"En Micelic los tenés en extracto triple concentrado. Elegís el que necesitás.\"\n\n[24-30s] CTA — Creadora UGC a cámara, plano medio, tono cercano: \"Entrá a micelic.com y probá el que te hace falta.\" Texto en pantalla: micelic.com + envío gratis.",
            hook: "¿Estrés, mal sueño y cansancio? Existe una solución natural.",
            body: "Los hongos adaptógenos regulan tu sistema nervioso de forma natural. Reishi para dormir, Melena de León para pensar claro, Cordyceps para la energía. En Micelic los tenés en extracto triple concentrado.",
            cta: "Entrá a micelic.com y probá el que necesitás.",
            copyAnuncio: "¿Estrés, mal sueño y cansancio? Existe una solución natural 🍄\n\nLos hongos adaptógenos regulan tu sistema nervioso:\n🌙 Reishi → Sueño profundo\n🧠 Melena de León → Claridad mental\n⚡ Cordyceps → Energía real\n\n✅ Extracto triple concentrado.\n📦 Envíos a todo el país.\n\n👉 Probá el que necesitás en micelic.com",
            pilar: "Producto",
            tema: "Dolores del ICP — extracto triple concentrado",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Dolor - Solución - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "25-35s",
            enRevision: true,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL A: MAL SUEÑO → REISHI (extracto triple concentrado) ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "Duerme mal, se despierta cansado. Depende de pastillas o no encuentra alternativa natural. No conoce Reishi.",
            solucion: "Reishi de Micelic en extracto triple concentrado: calmante natural que regula el sistema nervioso y mejora la calidad de sueño.",
            comunicacion: "Carrusel x4 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Narrativa de dolor a solución: mal sueño → Reishi como alternativa natural.",
            mensajes: [
              "Slide 1: '¿Dormís mal y te levantás destruido?' — Visual de persona agotada, tipografía impactante",
              "Slide 2: 'Miles de personas hoy eligen una alternativa natural' — Visual de Reishi de Micelic: un frasco solo y dos frascos juntos",
              "Slide 3: 'Reishi regula tu sistema nervioso de forma natural. Lo tomás a la noche y vas a notar la diferencia.' — Close-up del producto",
              "Slide 4: CTA 'Probalo en micelic.com — Envíos a todo el país' — Logo Micelic + badge de envío gratis",
            ],
            copyAnuncio: "¿Dormís mal y te levantás destruido? 😴\n\nReishi de Micelic regula tu sistema nervioso de forma natural.\n\n🌙 Extracto triple concentrado.\n✅ Lo tomás a la noche y vas a notar la diferencia.\n📦 Envíos a todo el país.\n\n👉 Probalo en micelic.com",
            pilar: "Producto",
            tema: "Mal sueño → Reishi extracto triple concentrado",
            formatoNarrativo: "Storytelling — Problema a Solución",
            estructuraNarrativa: "Dolor - Solución - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL B: CANSANCIO / NIEBLA MENTAL → CORDYCEPS + MELENA (extracto triple concentrado) ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "Se siente agotado todo el día, sin energía ni concentración. Toma café para funcionar pero no alcanza. No conoce Cordyceps ni Melena de León.",
            solucion: "Cordyceps para energía real sin café + Melena de León para claridad mental. Disponibles en extracto triple concentrado en micelic.com.",
            comunicacion: "Carrusel x4 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Narrativa de dolor a solución: cansancio + niebla mental → Cordyceps y Melena de León.",
            mensajes: [
              "Slide 1: '¿Cansancio todo el día y la cabeza no te funciona?' — Visual de persona agotada frente a la computadora",
              "Slide 2: 'Cordyceps: energía real sin depender del café. Rendís todo el día.' — Visual del extracto de Cordyceps: un frasco solo y dos frascos juntos",
              "Slide 3: 'Melena de León: claridad cognitiva, se te va la niebla mental.' — Visual del extracto de Melena: un frasco solo y dos frascos juntos",
              "Slide 4: CTA 'Encontrá el que necesitás en micelic.com — Envíos a todo el país' — Logo Micelic + badge de envío gratis",
            ],
            copyAnuncio: "¿Cansancio todo el día y la cabeza no te funciona? 🧠⚡\n\n⚡ Cordyceps → Energía real sin depender del café.\n🧠 Melena de León → Claridad cognitiva, se te va la niebla mental.\n\n✅ Extracto triple concentrado.\n📦 Envíos a todo el país.\n\n👉 Encontrá el que necesitás en micelic.com",
            pilar: "Producto",
            tema: "Cansancio + niebla mental → Cordyceps y Melena",
            formatoNarrativo: "Storytelling — Problema a Solución",
            estructuraNarrativa: "Dolor - Solución - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL C: PRODUCTOS INDIVIDUALES + CYBERMONDAY ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "No conoce los adaptógenos y necesita un producto de entrada accesible para probar por primera vez, sin compromiso de volumen.",
            solucion: "Catálogo de productos individuales de Micelic (Reishi, Melena, Cordyceps) en extracto triple concentrado. CyberMonday con envío gratis a todo el país. Bajo ticket de entrada para primera compra.",
            comunicacion: "Carrusel x4-5 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Catálogo de productos individuales con precio y beneficio, cierre con oferta CyberMonday + envío gratis.",
            mensajes: [
              "Slide 1: 'CyberMonday Micelic — Descubrí los Adaptógenos' — Visual de los 3 extractos + badge ENVÍO GRATIS",
              "Slide 2: 'Reishi — Sueño profundo y regulación del estrés' — Foto del producto individual con precio + badge ENVÍO GRATIS",
              "Slide 3: 'Melena de León — Claridad mental y concentración' — Foto del producto individual con precio + badge ENVÍO GRATIS",
              "Slide 4: 'Cordyceps — Energía real sin café' — Foto del producto individual con precio + badge ENVÍO GRATIS",
              "Slide 5: CTA 'CyberMonday: envío gratis a todo el país — Comprá en micelic.com' — Logo Micelic + badge CyberMonday + badge ENVÍO GRATIS",
            ],
            copyAnuncio: "🔥 CyberMonday Micelic — Descubrí los Adaptógenos\n\n🌙 Reishi → Sueño profundo\n🧠 Melena de León → Claridad mental\n⚡ Cordyceps → Energía real\n\n✅ Extracto triple concentrado.\n🚚 ENVÍO GRATIS a todo el país.\n\n👉 Comprá en micelic.com",
            pilar: "Producto",
            tema: "CyberMonday — productos individuales + envío gratis",
            formatoNarrativo: "Producto — Catálogo",
            estructuraNarrativa: "Oferta - Productos - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "E-commerce" },
            enRevision: false,
            destinoUrls: ["https://micelic.com"],
          },

          // --- SHOPPING: COLECCIÓN EXTRACTOS SIMPLES Y DOBLES ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "No conoce los adaptógenos. Necesita un producto de entrada accesible para probar por primera vez.",
            solucion: "Colección de extractos individuales de Micelic en triple concentrado. Productos de entrada con bajo ticket para que pruebe sin compromiso. Requiere crear los productos en Tienda Nube y conectar el catálogo a Meta Ads.",
            comunicacion: "Collection Ad con catálogo dinámico. Hero image o video arriba + grilla de productos debajo. La colección muestra los extractos individuales (Reishi, Melena, Cordyceps) como productos de entrada para el ICP que todavía no probó adaptógenos.",
            mensajes: [
              "Hero: visual de los extractos de Micelic, un frasco solo y dos frascos juntos, con mensaje de entrada (ej. 'Probá tu primer adaptógeno')",
              "Grilla: productos del catálogo de Tienda Nube con precio, foto y botón de compra",
            ],
            copyAnuncio: "Probá tu primer adaptógeno 🍄\n\n🌙 Reishi → Sueño\n🧠 Melena de León → Concentración\n⚡ Cordyceps → Energía\n\n✅ Extracto triple concentrado.\n📦 Envíos a todo el país.\n\n👉 Comprá en micelic.com",
            pilar: "Producto",
            tema: "Shopping — extractos individuales (entrada)",
            formatoNarrativo: "Catálogo dinámico",
            estructuraNarrativa: "Hero - Grilla de productos",
            tratamiento: { tipo: "Shopping", tono: "Mixed", estilo: "E-commerce" },
            enRevision: false,
            destinoUrls: ["https://micelic.com"],
          },
        ],
      },
      {
        icp: "Consciente del Producto (5 anuncios)",
        piezas: [

          // --- VIDEO UGC: DOLORES DEL ICP (calidad dudosa, poca variedad, quiere más) ---
          {
            formato: "Video UGC Vertical (9:16)",
            dolor: "Ya consume adaptógenos pero sospecha que están diluidos, la marca no declara concentración, tiene pocas presentaciones y no innova.",
            solucion: "Micelic: extractos con concentración declarada, triple extracción, 3 variedades en extracto. Packs x2, x4 y x6 para que el que ya consume suba de una unidad al pack.",
            comunicacion: "Produce la creadora UGC (test mujer vs. Julián como variable de performance). [0-4s] HOOK — Creadora UGC a cámara, plano medio, tono de desafío. Isotipo de Micelic fijo en esquina superior (pequeño, permanente todo el video). Subtítulos centrados en mitad inferior del cuadro: \"Ya tomás adaptógenos — pero ¿sabés qué tiene adentro tu extracto?\"\n\n[4-10s] DOLOR — Creadora UGC a cámara, tono directo, levanta un frasco genérico (sin marca): \"La mayoría de las marcas no declara la concentración ni el método de extracción. Pagás premium y no sabés si realmente estás recibiendo calidad.\"\n\n[10-18s] SOLUCIÓN — Creadora UGC muestra los frascos de Micelic uno por uno, close-up de cada etiqueta con la concentración visible: \"En Micelic cada frasco te dice exactamente qué tiene adentro. Triple extracción. Reishi, Melena de León, Cordyceps.\"\n\n[18-24s] OFERTA — Toma frontal de los packs x2, x4 y x6 sobre la mesa. Creadora UGC en off: \"Armate el combo de alto rendimiento o stockeate con tu favorito. Packs con descuento y envío gratis.\"\n\n[24-30s] CTA — Creadora UGC a cámara, plano medio, tono cercano: \"Armá tu combo en micelic.com.\" Texto en pantalla: micelic.com + envío gratis.",
            hook: "Ya tomás adaptógenos — pero ¿sabés qué tiene adentro tu extracto?",
            body: "En Micelic cada frasco declara la concentración y el método de extracción. Tenemos Reishi, Melena y Cordyceps en extracto. Pack x6 de alto rendimiento o stockeate con tu favorito en x2.",
            cta: "Armá tu combo en micelic.com.",
            copyAnuncio: "Ya tomás adaptógenos — pero ¿sabés qué tiene adentro tu extracto? 🍄\n\nEn Micelic cada frasco declara la concentración.\n\n🌙 Reishi + 🧠 Melena + ⚡ Cordyceps\n✅ Pack x6 de alto rendimiento.\n📦 Envíos a todo el país.\n\n👉 Armá tu combo en micelic.com",
            pilar: "Producto",
            tema: "Dolores del ICP — calidad, variedad, packs",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Dolor - Solución - Acción",
            tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
            duracion: "25-35s",
            enRevision: true,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL A: COMBO x6 ALTO RENDIMIENTO + x2 STOCK ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "Quiere potenciar los efectos combinando adaptógenos pero no encuentra packs ni combos accesibles. Compra de a uno y paga de más.",
            solucion: "Combo x6 de alto rendimiento (Reishi x2 + Melena x2 + Cordyceps x2) o pack x2 del mismo extracto para quien quiere stockear una sola variedad. Descuento por volumen + envío gratis a todo el país.",
            comunicacion: "Carrusel x5 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Narrativa de upgrade: combo x6 con las 3 variedades para potenciar el efecto + pack x2 del favorito para el que prefiere una sola. Envío gratis en todas las opciones.",
            mensajes: [
              "Slide 1: 'Combo x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2' — Visual hero con los 6 frascos juntos + badge ENVÍO GRATIS",
              "Slide 2: 'Reishi para dormir. Melena para pensar. Cordyceps para rendir. Combinados se potencian.' — Cada producto con su beneficio",
              "Slide 3: 'Pack x2: stockeate con tu favorito. Dos frascos del mismo extracto.' — Visual del pack x2 con precio y descuento + badge ENVÍO GRATIS",
              "Slide 4: 'Concentración declarada en cada frasco. Descuento por volumen.' — Badge de calidad + ahorro",
              "Slide 5: CTA 'Armá tu combo en micelic.com — Envío gratis a todo el país' — Logo Micelic + badge ENVÍO GRATIS",
            ],
            copyAnuncio: "Combo x6 Alto Rendimiento 🍄🔥\n\n🌙 Reishi → Sueño\n🧠 Melena → Concentración\n⚡ Cordyceps → Energía\n\nCombinados se potencian.\n📦 Pack x2: stockeate con tu favorito (dos frascos del mismo).\n\n✅ Descuento por volumen.\n🚚 ENVÍO GRATIS a todo el país.\n\n👉 Armá tu combo en micelic.com",
            pilar: "Producto",
            tema: "Combo x6 alto rendimiento + x2 stock + envío gratis",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: true,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL B: CATÁLOGO DE PACKS + ENVÍO GRATIS ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "Ya consume adaptógenos, compra de a uno y quiere opciones de volumen para stockearse o armar el combo completo.",
            solucion: "Escalera completa de packs Micelic: x2 del extracto individual, x4 del dúo y x6 de alto rendimiento. Envío gratis a todo el país.",
            comunicacion: "Carrusel x5 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Arranca con afirmación sobre el efecto de los adaptógenos, luego recorre la escalera de packs de menor a mayor volumen: x2, x4 y x6. CTA directo a la tienda.",
            mensajes: [
              "Slide 1: 'Los adaptógenos regulan tu sistema nervioso, te dan energía y mejoran tu descanso.' — Afirmación sobre el efecto. Visual de los 3 extractos de Micelic + badge ENVÍO GRATIS",
              "Slide 2: 'Pack x2: elegí tu favorito y llevate dos.' — Visual de los packs x2 individuales (Reishi x2, Melena x2, Cordyceps x2) con precio + badge ENVÍO GRATIS",
              "Slide 3: 'Pack x4 Dúo: combiná dos variedades, x2 de cada una.' — Visual del pack x4 con precio + badge ENVÍO GRATIS",
              "Slide 4: 'Pack x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2. Combinados se potencian.' — Visual del pack x6 con precio y mayor descuento + badge ENVÍO GRATIS",
              "Slide 5: CTA 'Comprá ya en la tienda — Envío gratis a todo el país' — Logo Micelic + botón de compra + badge ENVÍO GRATIS",
            ],
            copyAnuncio: "Los adaptógenos regulan tu sistema nervioso, te dan energía y mejoran tu descanso 🍄\n\n💧 Pack x2: elegí tu favorito y llevate dos\n🤝 Pack x4 Dúo: combiná dos variedades\n🔥 Pack x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2\n\n🚚 ENVÍO GRATIS a todo el país.\n\n👉 Comprá ya en micelic.com",
            pilar: "Producto",
            tema: "Escalera de packs x2 / x4 / x6 + envío gratis",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmación - Evidencia - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: true,
            destinoUrls: ["https://micelic.com"],
          },

          // --- CARRUSEL C: PACKS x2 / x4 / x6 EN OFERTA + CYBERMONDAY ---
          {
            formato: "Carrusel Post + Historia (1080x1350 / 1080x1920)",
            dolor: "Ya consume adaptógenos, compra de a uno y paga de más. Busca stockearse con descuento y aprovechar ofertas temporales.",
            solucion: "Packs x2, x4 y x6 de Micelic con descuento CyberMonday + envío gratis a todo el país. Desde dos frascos del favorito hasta el combo de alto rendimiento con las 3 variedades.",
            comunicacion: "Carrusel x4-5 slides producido en 2 formatos: post (1080x1350) para feed e historia (1080x1920) para Stories. Catálogo de packs con precio y descuento, cierre con oferta CyberMonday + envío gratis.",
            mensajes: [
              "Slide 1: 'CyberMonday Micelic — Stockeate y ahorrá' — Visual de los packs x2, x4 y x6 + badge ENVÍO GRATIS",
              "Slide 2: 'Combo x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2' — Foto del pack con precio y descuento + badge ENVÍO GRATIS",
              "Slide 3: 'Pack x2 de tu favorito: Reishi x2 / Melena x2 / Cordyceps x2' — Foto de los 3 packs con precio + badge ENVÍO GRATIS",
              "Slide 4: 'Pack x4 Dúo: combiná 2 variedades y ahorrá más' — Foto del pack x4 con precio y mayor descuento + badge ENVÍO GRATIS",
              "Slide 5: CTA 'CyberMonday: descuento + envío gratis a todo el país — Comprá en micelic.com' — Logo Micelic + badge CyberMonday + badge ENVÍO GRATIS",
            ],
            copyAnuncio: "🔥 CyberMonday Micelic — Stockeate y ahorrá\n\n🔥 Combo x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2\n🌙 Reishi x2 / 🧠 Melena x2 / ⚡ Cordyceps x2\n🤝 Pack x4 Dúo: combiná 2 variedades\n\n✅ Descuento por pack.\n🚚 ENVÍO GRATIS a todo el país.\n\n👉 Comprá en micelic.com",
            pilar: "Producto",
            tema: "CyberMonday — packs x2/x4/x6 + envío gratis",
            formatoNarrativo: "Producto — Catálogo",
            estructuraNarrativa: "Oferta - Productos - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "E-commerce" },
            enRevision: true,
            destinoUrls: ["https://micelic.com"],
          },

          // --- SHOPPING: COLECCIÓN PACKS x2 / x4 / x6 ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "Ya sabe lo que quiere pero compra de a uno. Busca packs, combos y mejor precio por volumen.",
            solucion: "Colección de packs x2, x4 y x6 de Micelic. Descuento por volumen + envío gratis. Requiere crear los productos en Tienda Nube y conectar el catálogo a Meta Ads.",
            comunicacion: "Collection Ad con catálogo dinámico. Hero image o video arriba + grilla de productos debajo. La colección muestra los packs x2 (extracto individual), x4 (dúo) y x6 (alto rendimiento, las 3 variedades) para el ICP que ya consume y quiere stockearse o upgradear.",
            mensajes: [
              "Hero: visual de los packs x2, x4 y x6 con mensaje de oferta (ej. 'Stockeate y ahorrá')",
              "Grilla: productos del catálogo de Tienda Nube con precio, foto y botón de compra",
            ],
            copyAnuncio: "Stockeate y ahorrá 🍄\n\n🔥 Combo x6 Alto Rendimiento: Reishi x2 + Melena x2 + Cordyceps x2\n🤝 Pack x4 Dúo: dos variedades\n💧 Pack x2: Reishi x2 / Melena x2 / Cordyceps x2\n\n✅ Descuento por pack + envío gratis.\n\n👉 Elegí tu pack en micelic.com",
            pilar: "Producto",
            tema: "Shopping — packs x2 / x4 / x6 (upgrade)",
            formatoNarrativo: "Catálogo dinámico",
            estructuraNarrativa: "Hero - Grilla de productos",
            tratamiento: { tipo: "Shopping", tono: "Mixed", estilo: "E-commerce" },
            enRevision: false,
            destinoUrls: ["https://micelic.com"],
          },
        ],
      },
    ],
    resumenPiezas: "10 anuncios de Ventas: 5 por ICP (1 video UGC + 3 carruseles post+historia + 1 Shopping). 2 carruseles por dolor + 1 carrusel de productos CyberMonday con envío gratis. Cada ICP tiene su propia colección de Shopping.",
    formatos: ["Video Comercial (9:16)", "Feed (1080x1350)", "Reel / Story (1080x1920)", "Carrusel (1080x1080)"],
    tono: "Cercano, directo, educativo. Se habla como alguien que sabe del tema y quiere compartirlo, sin sobrevender: explicar con calma, como en una charla. Evitar lenguaje corporativo o demasiado publicitario. Priorizar transparencia, autenticidad y confianza del founder sobre claims genéricos. El tono refleja que Micelic es una marca con un humano detrás. Las piezas que produce la creadora UGC mantienen el mismo tono: cambia la cara, no la forma de hablar.",
    notaPiezas: "Pauta de edición para handoff a la creadora UGC — aplica a los 4 videos guionados: (1) Isotipo de Micelic fijo en la esquina superior izquierda, chico, permanente todo el video. (2) Subtítulos centrados a la altura de la cara, nunca en el tercio inferior: ahí la UI de Reels tapa el texto. (3) Close-ups de etiqueta con la concentración visible — cada extracto tiene su color, el detalle del frasco es lo que diferencia. (4) Entrega en 9:16 (1080x1920) a Drive compartido. El reparto de producción es: creadora UGC los 4 videos guionados (2 de Awareness + 2 de Ventas), Julián los 8 carruseles y los packs en Tienda Nube.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_micelic_meta_awareness_educativo",
      "ree_micelic_meta_conversion_ecommerce",
      "ree_micelic_meta_retargeting_visitantes",
    ],
  },

  arquitectura: [
    {
      nombre: "MICELIC_Awareness",
      objetivo: "Interacción",
      status: "activa",
      conSubsecciones: true,
      tituloSeccion: "Campaña de Awareness",
      descripcionCampana: "Construir una audiencia medible con y sin conciencia de la existencia de hongos adaptógenos y sus beneficios. La idea es generar conciencia tanto del producto como de la marca a gente que ya consume y a gente que todavía no. Nutrimos la audiencia previo a venderle directamente.",
      destino: "Perfil de Instagram (@micelic.ar)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Interacciones"],
      conversionCampana: "Visitas al Perfil de Instagram",
      presupuestoCampana: { diario: "USD $5/día — $7.650 ARS", mensual: "USD $150/mes — $229.500 ARS" },
      adSets: [
        {
          nombre: "Conjunto_General_Argentina",
          segmentacion: "28-55 años, Buenos Aires, CABA, Córdoba, Santa Fe, Mendoza, Tucumán, Entre Ríos, Salta, Misiones, Corrientes. Intereses de salud: Salud y bienestar, Salud natural, Vida saludable, Medicina natural, Remedios naturales, Nutrición, Alimentación saludable, Bienestar mental, Dormir bien, Estrés, Ejercicio físico. Conjunto amplio a propósito: el algoritmo optimiza hacia quién interactúa con @micelic.ar.",
          ads: [
            "Anuncio_Reel_Organico_V1 | Reel ya publicado en @micelic.ar: charla distendida de Julián sobre adaptógenos (114K views)",
            "Anuncio_Reel_ComoTomar_V1 | Reel curado del Drive: cómo tomar adaptógenos y qué efectos esperar",
            "Anuncio_Reel_AdaptogenoBarato_V1 | Reel curado del Drive: ¿adaptógeno barato? concentración y duración real",
            "Anuncio_Video_Estres_V1 | Estrés, ansiedad → solución con adaptógenos de Micelic",
            "Anuncio_Video_TiposHongos_V1 | ¿Son todos iguales? No, cada hongo produce un efecto distinto",
            "Anuncio_Carrusel_Estres_V1 | Carrusel: estrés + beneficios por extracto (adaptación del video)",
            "Anuncio_Carrusel_TiposHongos_V1 | Carrusel: tipos de hongos + beneficios (adaptación del video)",
          ],
        },
      ],
      piezas: [
        // --- REEL 1: Reel orgánico de @micelic.ar, se promociona tal cual ---
        {
          formato: "Reel curado de @micelic.ar",
          dolor: "No conoce Micelic ni los hongos adaptógenos.",
          solucion: "Reel ya publicado en @micelic.ar que se pauta como anuncio sin edición. 114K views acumuladas (parte vino de pauta) — se empuja con tráfico pago. Pendiente: regrabar con el packaging actual de Mushblend.",
          comunicacion: "Contenido ya publicado en @micelic.ar con 114K views acumuladas. Se promociona tal cual para amplificar el alcance con pauta mientras Julián regraba la versión con la etiqueta nueva.",
          enRevision: false,
          referencias: [
            { url: "https://www.instagram.com/reel/DZ7vTUgK_A0/", titulo: "Reel @micelic.ar — 114K views", tipo: "iframe" },
          ],
        },

        // --- REEL 2: Video curado del Drive, se pauta tal cual ---
        {
          formato: "Reel curado de Drive (9:16)",
          dolor: "No sabe cómo se toman los hongos adaptógenos ni qué efectos esperar. Es la primera pregunta de cualquiera que recién conoce la categoría.",
          solucion: "Video ya producido por Julián que explica cómo tomar los extractos y qué efectos esperar. Resuelve la objeción de entrada sin vender: posiciona a Micelic como la marca que enseña.",
          comunicacion: "Video ya grabado y disponible en el Drive del cliente, con calidad de estudio. Se pauta tal cual, sin re-edición. Julián a cámara explicando posología y efectos esperados.",
          enRevision: false,
          referencias: [
            { url: assetDataUri("aw-como-tomar.mp4"), titulo: "Cómo tomar adaptógenos y qué efectos esperar", tipo: "video" },
          ],
        },

        // --- REEL 3: Video curado del Drive, se pauta tal cual ---
        {
          formato: "Reel curado de Drive (9:16)",
          dolor: "Compara por precio sin entender que un extracto barato y diluido obliga a tomar más gotas por día y rinde menos.",
          solucion: "Video ya producido por Julián que compara concentración y duración real: un frasco de 100 ml que pide 70 gotas por día dura 15 días, contra los 30 ml concentrados de Micelic que duran un mes. Instala el criterio de concentración antes de hablar de precio.",
          comunicacion: "Video ya grabado y disponible en el Drive del cliente, con calidad de estudio. Se pauta tal cual, sin re-edición. Julián a cámara con el frasco en mano, explicando posología y rendimiento.",
          enRevision: false,
          referencias: [
            { url: assetDataUri("aw-adaptogeno-barato.mp4"), titulo: "¿Adaptógeno barato? Cuánto dura y qué tan concentrado está", tipo: "video" },
          ],
        },

        // --- VIDEO 4: ESTRÉS / ADAPTÓGENOS ---
        {
          formato: "Video UGC Vertical (9:16)",
          dolor: "Vive con estrés, ansiedad e malestar. No sabe que los hongos adaptógenos pueden regular su sistema nervioso de forma natural.",
          solucion: "Hongos adaptógenos de Micelic: mejoran la calidad de sueño, la claridad cognitiva y la gestión del estrés. Triple extracción y concentración declarada en cada frasco.",
          comunicacion: "Produce la creadora UGC (test mujer vs. Julián como variable de performance). [0-4s] HOOK — Creadora UGC a cámara, plano medio, expresión seria y directa. Isotipo de Micelic fijo en esquina superior (pequeño, permanente todo el video). Subtítulos centrados en mitad inferior del cuadro: \"Si sentís estrés, ansiedad, malestar… es momento de que hagas algo.\"\n\n[4-12s] CONTEXTO — Creadora UGC a cámara, tono cercano: \"Miles de personas hoy optan por usar medicina natural para mejorar su estilo de vida. Los hongos adaptógenos regulan tu sistema nervioso de forma natural.\"\n\n[10-18s] SOLUCIÓN — Creadora UGC a cámara en su espacio de trabajo, muestra tres frascos uno por uno, levantándolos a cámara: \"Reishi para dormir mejor. Melena de León para pensar más claro. Cordyceps para obtener energía real, sin café.\"\n\n[18-26s] AUTORIDAD — Close-up de los tres frascos, mostrando la variedad de productos. Creadora UGC en off: \"En Micelic nos dedicamos a que te lleguen los extractos de la mejor calidad. Los tenés en las tres variedades, en extracto triple concentrado.\"\n\n[26-32s] CTA — Creadora UGC a cámara, plano medio, tono cercano, apoya los frascos sobre la mesa: \"Si querés aprender más sobre cómo podés mejorar tu bienestar, seguí a @micelic.ar.\" Texto en pantalla: @micelic.ar.",
          hook: "Si sentís estrés, ansiedad, malestar… es momento de que hagas algo.",
          body: "Los hongos adaptógenos regulan tu sistema nervioso de forma natural. Reishi para dormir mejor, Melena de León para pensar más claro, Cordyceps para energía real. En Micelic nos dedicamos a que te llegue de la mejor calidad: triple extracción, concentración declarada.",
          cta: "Seguí a @micelic.ar para aprender más.",
          copyAnuncio: "Si sentís estrés, ansiedad, malestar… es momento de que hagas algo 🍄\n\nLos hongos adaptógenos regulan tu sistema nervioso de forma natural:\n🌙 Reishi → Mejor sueño\n🧠 Melena de León → Claridad cognitiva\n⚡ Cordyceps → Más energía\n\n✅ Triple extracción. Concentración declarada.\n\n👉 Seguí a @micelic.ar",
          pilar: "Producto",
          tema: "Estrés y adaptógenos",
          formatoNarrativo: "Direct to Camera — Talking Head",
          estructuraNarrativa: "Problema - Solución - Autoridad - Acción",
          tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
          duracion: "30-60s",
          enRevision: false,
        },

        // --- VIDEO 5: TIPOS DE HONGOS / NO SON TODOS IGUALES ---
        {
          formato: "Video UGC Vertical (9:16)",
          dolor: "No sabe que existen distintos tipos de hongos adaptógenos ni que cada uno tiene un efecto diferente. Los mete a todos en la misma bolsa o directamente desconoce la categoría.",
          solucion: "Julián explica que no son todos iguales, cada hongo produce un efecto distinto y combinados se potencian. Muestra la línea completa de extractos de Micelic.",
          comunicacion: "Produce la creadora UGC (test mujer vs. Julián como variable de performance). [0-4s] HOOK — Voz de otra persona (estilo entrevista), plano medio de la creadora UGC escuchando la pregunta: \"¿Cuántos tipos de hongos adaptógenos existen? ¿Son todos iguales?\"\n\n[4-8s] RESPUESTA — Creadora UGC a cámara, niega con la cabeza, tono enfático: \"No. No son todos iguales ni tampoco producen el mismo efecto. Incluso juntos se potencian.\"\n\n[8-14s] REISHI — Creadora UGC levanta el frasco de Reishi a cámara, close-up de la etiqueta: \"Está Reishi, para descansar mejor. Regula el cortisol y mejora la calidad de sueño.\"\n\n[14-20s] MELENA — Creadora UGC levanta el frasco de Melena de León, close-up de la etiqueta: \"La Melena de León, para claridad cognitiva. Te saca la niebla mental y mejora la concentración.\"\n\n[20-26s] CORDYCEPS — Creadora UGC levanta el frasco de Cordyceps, close-up de la etiqueta: \"El Cordyceps, para energía real. Rendís todo el día sin depender del café.\"\n\n[26-32s] LÍNEA COMPLETA — Toma frontal de los tres frascos en primera plana, uno al lado del otro, etiquetas visibles. Creadora UGC en off: \"Cada uno hace algo distinto y combinados se potencian.\"\n\n[32-37s] CTA — Creadora UGC a cámara, parado detrás de los tres frascos: \"Si querés saber cómo cuidar tu salud de forma natural, seguí a @micelic.ar.\" Texto en pantalla: @micelic.ar.",
          hook: "¿Cuántos tipos de hongos adaptógenos existen? ¿Son todos iguales?",
          body: "No son todos iguales ni producen el mismo efecto. Incluso juntos se potencian. Reishi para descansar mejor. Melena de León para claridad cognitiva. Cordyceps para energía real.",
          cta: "Seguí a @micelic.ar para saber cuál te conviene.",
          copyAnuncio: "¿Cuántos tipos de hongos adaptógenos existen? ¿Son todos iguales? 🍄\n\nNo. No son todos iguales ni producen el mismo efecto. Incluso juntos se potencian:\n\n🌙 Reishi → Descanso y regulación del cortisol.\n🧠 Melena de León → Claridad cognitiva y concentración.\n⚡ Cordyceps → Energía real sin depender del café.\n\n✅ Triple extracción. Concentración declarada en cada frasco.\n\n👉 Seguí a @micelic.ar",
          pilar: "Producto",
          tema: "Tipos de hongos y sus efectos",
          formatoNarrativo: "Direct to Camera — Educativo",
          estructuraNarrativa: "Pregunta - Respuesta - Desglose - Acción",
          tratamiento: { tipo: "Video", tono: "Orgánico (UGC)", estilo: "Lifestyle" },
          duracion: "30-60s",
          enRevision: false,
        },

        // --- CARRUSEL 6: ADAPTACIÓN DEL VIDEO 4 (ESTRÉS / ADAPTÓGENOS) ---
        {
          formato: "Carrusel (1080x1080)",
          dolor: "Vive con estrés, ansiedad e malestar. No sabe que los hongos adaptógenos pueden regular su sistema nervioso de forma natural.",
          solucion: "Adaptación visual del Video 3 en formato carrusel: primer slide con el mensaje de dolor, slides siguientes con los beneficios de cada extracto.",
          comunicacion: "Carrusel x3 slides. Adaptación del video de estrés/adaptógenos a formato estático para captar audiencia que no consume video.",
          mensajes: [
            "Slide 1: Mensaje principal — '¿Estrés, ansiedad, malestar? Los hongos adaptógenos pueden ayudarte.' Fondo limpio, tipografía grande, frasco de Micelic como elemento visual.",
            "Slide 2: Beneficios por extracto — Reishi: 'Regula el cortisol y mejora tu sueño' / Melena de León: 'Claridad cognitiva y concentración' / Cordyceps: 'Energía real sin depender del café'. Foto de cada frasco con su beneficio.",
            "Slide 3: Cierre — 'Triple extracción. Concentración declarada en cada frasco.' + CTA: 'Seguí a @micelic.ar'.",
          ],
          copyAnuncio: "¿Estrés, ansiedad, malestar? Los hongos adaptógenos pueden ayudarte 🍄\n\n🌙 Reishi → Regula el cortisol y mejora tu sueño.\n🧠 Melena de León → Claridad cognitiva y concentración.\n⚡ Cordyceps → Energía real sin depender del café.\n\n✅ Triple extracción. Concentración declarada.\n\n👉 Seguí a @micelic.ar",
          pilar: "Producto",
          tema: "Estrés y adaptógenos (versión carrusel)",
          formatoNarrativo: "Educativo — Guía Visual",
          estructuraNarrativa: "Problema - Beneficios - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          enRevision: false,
        },

        // --- CARRUSEL 7: ADAPTACIÓN DEL VIDEO 5 (TIPOS DE HONGOS) ---
        {
          formato: "Carrusel (1080x1080)",
          dolor: "No sabe que existen distintos tipos de hongos adaptógenos ni que cada uno tiene un efecto diferente.",
          solucion: "Adaptación visual del Video 4 en formato carrusel: primer slide con la pregunta, slides siguientes con cada extracto y su beneficio específico.",
          comunicacion: "Carrusel x3 slides. Adaptación del video de tipos de hongos a formato estático para captar audiencia que no consume video.",
          mensajes: [
            "Slide 1: Pregunta — '¿Son todos los hongos adaptógenos iguales? No.' Tipografía grande, fondo limpio, los tres frascos de Micelic en primera plana uno al lado del otro.",
            "Slide 2: Desglose por extracto — Reishi: 'Descanso y regulación del cortisol' / Melena de León: 'Claridad cognitiva y concentración' / Cordyceps: 'Energía sostenida sin café'. Foto individual de cada frasco con su beneficio al lado.",
            "Slide 3: Cierre — 'Cada uno hace algo distinto. Combinados se potencian. Triple extracción, concentración declarada.' + CTA: 'Seguí a @micelic.ar'.",
          ],
          copyAnuncio: "¿Son todos los hongos adaptógenos iguales? No 🍄\n\nCada uno produce un efecto distinto, e incluso juntos se potencian:\n\n🌙 Reishi → Descanso y regulación del cortisol.\n🧠 Melena de León → Claridad cognitiva y concentración.\n⚡ Cordyceps → Energía sostenida sin café.\n\n✅ Triple extracción. Concentración declarada.\n\n👉 Seguí a @micelic.ar",
          pilar: "Producto",
          tema: "Tipos de hongos y sus efectos (versión carrusel)",
          formatoNarrativo: "Educativo — Guía Visual",
          estructuraNarrativa: "Pregunta - Desglose - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          enRevision: false,
        },
      ],
      bannerPiezas: "6 anuncios de Awareness (2 reels curados + 2 videos + 2 carruseles).",
    },
    {
      nombre: "MICELIC_Ventas",
      objetivo: "Ventas",
      status: "en-desarrollo",
      tituloSubseccion: "Campaña de Ventas en Meta Ads",
      descripcionCampana: "Convertir la audiencia construida en Awareness en ventas en micelic.com. Cada ICP recibe piezas diferentes: al Consciente del Síntoma se le vende desde el dolor (sueño, estrés, energía) hacia el combo de alto rendimiento; al Consciente del Producto se le vende variedad, oferta y el upgrade al combo. En CyberMonday (~02/11) y Black Friday (27/11) se activan variantes con descuento + envío gratis dentro de esta misma campaña.",
      notaCampana: "CyberMonday (~02/11) y Black Friday (27/11) se trabajan como variantes dentro de esta campaña: ads con oferta temporal (combos, packs, envío gratis). Julián define las ofertas con anticipación.",
      destino: "micelic.com",
      kpisCampana: ["Visitas a página de producto", "Compras", "ROAS"],
      presupuestoCampana: { diario: "USD $11,7/día — $17.901 ARS", mensual: "USD $350/mes — $535.500 ARS" },
      adSets: [
        {
          nombre: "Conjunto_Consciente_Sintoma",
          segmentacion: "28-55 años, Buenos Aires, CABA, Córdoba, Santa Fe, Mendoza, Tucumán, Entre Ríos, Salta, Misiones, Corrientes. No conoce el producto, busca solución al síntoma. Intereses: Insomnio, Estrés, Ansiedad, Trastornos del sueño, Relajación, Salud mental, Remedios naturales, Medicina natural, Suplementos dietéticos, Dormir bien. Comportamiento: busca soluciones a problemas de sueño, estrés o cansancio crónico.",
          ads: [
            "Anuncio_Video_Dolores_Sintoma_V1 | Julián UGC: estrés + mal sueño + cansancio → adaptógenos de Micelic en extracto triple concentrado",
            "Anuncio_Carrusel_Sueno_V1 | Post+Historia: ¿dormís mal? → Reishi extracto triple concentrado — CTA a micelic.com",
            "Anuncio_Carrusel_Energia_V1 | Post+Historia: cansancio + niebla mental → Cordyceps y Melena — CTA a micelic.com",
            "Anuncio_Carrusel_CyberMonday_Sintoma_V1 | Post+Historia: productos individuales CyberMonday + envío gratis — CTA a micelic.com",
            "Anuncio_Shopping_Sintoma_V1 | Collection Ad: colección de extractos individuales (productos de entrada) — requiere crear productos y conectar catálogo",
          ],
        },
        {
          nombre: "Conjunto_Consciente_Producto",
          segmentacion: "28-55 años, Buenos Aires, CABA, Córdoba, Santa Fe, Mendoza, Tucumán, Entre Ríos, Salta, Misiones, Corrientes. Ya consume suplementos o adaptógenos, busca oferta y variedad. Intereses: Suplementos dietéticos, Medicina alternativa, Herbolaria, Naturopatía, Alimentos orgánicos, Superalimentos, Ayurveda, Alimentos funcionales. Comportamiento: compradores online frecuentes de suplementos y productos naturales.",
          ads: [
            "Anuncio_Video_Dolores_Producto_V1 | Julián UGC: ¿sabés qué tiene tu frasco? → calidad + variedad + packs de Micelic",
            "Anuncio_Carrusel_ComboX6_V1 | Post+Historia: combo x6 alto rendimiento (Reishi x2 + Melena x2 + Cordyceps x2) — CTA a micelic.com",
            "Anuncio_Carrusel_Escalera_V1 | Post+Historia: escalera de packs x2 / x4 / x6 — CTA a micelic.com",
            "Anuncio_Carrusel_CyberMonday_Producto_V1 | Post+Historia: packs x2/x4/x6 CyberMonday + descuento + envío gratis — CTA a micelic.com",
            "Anuncio_Shopping_Producto_V1 | Collection Ad: colección de packs x2 / x4 / x6 — requiere crear productos y conectar catálogo",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Julián Ruiz (personalmente)",
    capacidadDiaria: "Moderada. Julián gestiona la marca, la producción y la atención al cliente.",
    tiempoRespuesta: "Variable. Depende de la carga operativa del día.",
    validado: false,
  },

  ofertas: [
    { nombre: "Pack x2 — extracto individual (Reishi / Melena / Cordyceps)", descripcion: "Dos frascos del mismo extracto. Producto nuevo en Tienda Nube, con el precio del pack ya cargado y el badge en la foto. Reemplaza al descuento por cantidad. Envío gratis a todo el país.", precio: null },
    { nombre: "Pack x4 — dúo (combina 2 variedades)", descripcion: "Cuatro frascos: x2 de cada una de las dos variedades elegidas. Producto nuevo con precio de pack. Envío gratis.", precio: null },
    { nombre: "Pack x6 — alto rendimiento (las 3 variedades)", descripcion: "Seis frascos: Reishi x2 + Melena de León x2 + Cordyceps x2. El pack de mayor ticket, para el consumidor que ya tomaba adaptógenos. Envío gratis.", precio: null },
  ],
  cambiosEcommerce: [
    { cambio: "Subir el pack x2 de cada extracto individual (Reishi, Melena de León, Cordyceps) como producto nuevo", objetivo: "Que el cliente que compraba una unidad se lleve dos: duplica el ticket en el escalón más accesible" },
    { cambio: "Subir el pack x4 del dúo (x2 de cada una de las 2 variedades elegidas)", objetivo: "Incentivar la compra combinada y aumentar el valor del carrito" },
    { cambio: "Subir el pack x6 de alto rendimiento (Reishi x2 + Melena x2 + Cordyceps x2)", objetivo: "Máximo ticket para el consumidor que ya toma adaptógenos y quiere stockearse" },
    { cambio: "Dar de baja el badge \"hasta 15% comprando en cantidad\": lo reemplazan los packs como producto con precio propio", objetivo: "Que la oferta se vea en la foto y el precio del producto, no como una condición al final del checkout" },
    { cambio: "Configurar descuento de CyberMonday en todos los packs", objetivo: "Pequeño descuento porcentual que active la urgencia sin destruir margen" },
    { cambio: "Activar envío gratis a todo el país durante CyberMonday", objetivo: "Eliminar la fricción del costo de envío como barrera de compra" },
{ cambio: "Verificar que todos los productos tengan fotos de calidad, precios actualizados y stock cargado", objetivo: "Catálogo listo para Meta Ads Shopping (Collection Ad)" },
  ],

  competenciaAds: {
    marca: "Fungi Melena",
    cuenta: "fungimelena",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=fungi%20melena",
    formatos: [
      // Fungi Melena — Carrusel "Botiquín Nocturno"
      { id: "f01", tipo: "Fungi Melena — Botiquín Nocturno (portada)", dolor: "", solucion: "", imageFile: assetDataUri("ref-fungi-melena-botiquin-1.jpg") },
      { id: "f02", tipo: "Fungi Melena — Reishi: calmante natural", dolor: "", solucion: "", imageFile: assetDataUri("ref-fungi-melena-botiquin-2.jpg") },
      { id: "f03", tipo: "Fungi Melena — Ashwagandha: equilibrador hormonal", dolor: "", solucion: "", imageFile: assetDataUri("ref-fungi-melena-botiquin-3.jpg") },
      { id: "f04", tipo: "Fungi Melena — Combo perfecto", dolor: "", solucion: "", imageFile: assetDataUri("ref-fungi-melena-botiquin-4.jpg") },
      // Cultivamente
      { id: "f05", tipo: "Cultivamente — Dormir bien + social proof", dolor: "", solucion: "", imageFile: assetDataUri("ref-cultivamente-1.jpg") },
      { id: "f06", tipo: "Cultivamente — ¿Vivís estresada? dolor-solución", dolor: "", solucion: "", imageFile: assetDataUri("ref-cultivamente-2.jpg") },
      // REM Argentina
      { id: "f07", tipo: "REM Argentina — Promo 6x5 + envío gratis", dolor: "", solucion: "", imageFile: assetDataUri("ref-rem-1.jpg") },
      { id: "f08", tipo: "REM Argentina — Blend Regenerativo (Melena+Cordyceps)", dolor: "", solucion: "", imageFile: assetDataUri("ref-rem-2.jpg") },
      { id: "f09", tipo: "REM Argentina — Blend Tres (Melena+Reishi+Cordyceps)", dolor: "", solucion: "", imageFile: assetDataUri("ref-rem-3.jpg") },
      { id: "f10", tipo: "REM Argentina — Blend Dúo (Melena+Reishi)", dolor: "", solucion: "", imageFile: assetDataUri("ref-rem-4.jpg") },
      // InterSer
      { id: "f11", tipo: "InterSer — ¿Te diagnosticaron SIBO?", dolor: "", solucion: "", imageFile: assetDataUri("ref-interser-1.jpg") },
      { id: "f12", tipo: "InterSer — Para restaurar tu microbiota", dolor: "", solucion: "", imageFile: assetDataUri("ref-interser-2.jpg") },
      { id: "f13", tipo: "InterSer — Melena de León para mucosa digestiva", dolor: "", solucion: "", imageFile: assetDataUri("ref-interser-3.jpg") },
    ],
    competidores: [
      { nombre: "Fungi Melena", estado: "210 anuncios activos — Líder en volumen. Mezcla masiva de UGC con caras distintas, flyers de conversión con descuento y gráficos dolor-solución (sueño, ansiedad, hormonas). Sin founder visible. Apuesta a volumen de creatividades y broad.", activo: true, avatarFile: assetDataUri("avatar-fungi-melena.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=510360202150229" },
      { nombre: "Unifungi", estado: "52 anuncios activos — Posicionamiento premium/científico. Extractos ultra concentrados con COA por lote. Usa red de profesionales de salud como canal de autoridad. Creatividades más limpias y educativas.", activo: true, avatarFile: assetDataUri("avatar-unifungi.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=149783778219310" },
      { nombre: "Cultivamente", estado: "25 anuncios activos — Contenido educativo y orgánico. Menos volumen pero anuncios consistentes. Bajaron de 36 a 25 la semana anterior, posible optimización de creatividades.", activo: true, avatarFile: assetDataUri("avatar-cultivamente.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=298265543361326" },
      { nombre: "InterSer", estado: "21 anuncios activos — Mayoría carruseles e historias, sin video. Formato catálogo de suplementos. No usa UGC ni talking head.", activo: true, avatarFile: assetDataUri("avatar-interser.png"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=242313028968763" },
      { nombre: "Kaya", estado: "160 anuncios activos — Segunda marca con más volumen. Dos líneas (adaptógenos + cosmética). Kits temáticos (Anti-estrés, Menopausia, Glow). Tinturas madre y gift cards. Apuesta fuerte a paid con catálogo amplio.", activo: true, avatarFile: assetDataUri("avatar-kaya.png"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=360860550451372" },
      { nombre: "REM Argentina", estado: "15 anuncios activos — Triple extracto, blend de 3 hongos. Tienda Nube. Menos volumen pero posicionamiento claro en calidad de extracción.", activo: true, avatarFile: assetDataUri("avatar-rem-fungi.png"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=491280060730747" },
    ],
    observacion: "El mercado de adaptógenos en Argentina está dominado por **2 estrategias** — **volumen masivo de creatividades sin identidad de marca** (Fungi Melena, 210 ads con caras distintas; Kaya, 160 ads con catálogo amplio) vs. **posicionamiento científico/premium con poco volumen** (Unifungi, REM). **Ninguno combina las dos cosas: founder visible + volumen de creatividades + oferta agresiva.** Micelic tiene el diferencial de **Julián dando la cara**, lo que genera confianza humana que la competencia no replica. La campaña de Ventas sale a buscar a los **2 ICPs con ofertas distintas**: al **Consciente del Síntoma** (no conoce adaptógenos) se le vende el beneficio con packs introductorios; al **Consciente del Producto** (ya consume) se le vende calidad, transparencia y packs x2/x4/x6 para subir ticket. En **CyberMonday y Black Friday** se activan variantes con descuento + envío gratis sobre la misma estructura.",
  },

  notas: "Micelic es el primer cliente de Foundation F2 en la vertical de suplementos/adaptógenos. Modelo B2C puro con e-commerce (Tienda Nube).\n\nJulián Ruiz es el founder y cara de la marca. Su presencia genera confianza humana que la competencia masiva (Fungi Melena, 210 anuncios con caras distintas) no puede replicar. Este es el diferencial más fuerte.\n\nLa agencia actual cobra $70k ARS/mes y es reactiva. Los 5 anuncios actuales no tienen la identidad de Micelic asociada. Revisar el historial de rendimiento antes de decidir si se pausan.\n\nLa cuenta publicitaria está en ARS (se mantiene para preservar historial del algoritmo). Julián paga en USD vía billetera ARC para evitar el 32% de impuesto de Mercado Pago.\n\nDatos iniciales de Tienda Nube: 114 ventas, ~$1M ARS. Ticket promedio estimado: ~$8.770 ARS.\n\nCompetidor adicional a investigar: Intercer (21 anuncios activos, mayormente carruseles/historias, sin video — señalado por Julián en la KO Call).",

  referenciasMoodboard: [
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=fungi%20melena", titulo: "Fungi Melena — Ad Library (210 anuncios activos)" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=unifungi", titulo: "Unifungi — Ad Library (52 anuncios activos)" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=cultivamente", titulo: "Cultivamente — Ad Library (25 anuncios activos)" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=intercer%20hongos", titulo: "Intercer — Ad Library (21 anuncios activos)" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=adaptogenos", titulo: "Búsqueda general: adaptógenos en Argentina" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=hongos%20medicinales", titulo: "Búsqueda general: hongos medicinales en Argentina" },
  ],

  // Roadmap
  roadmap: [
    // Awareness: no hubo Build de produccion (se curaron 2 reels existentes de @micelic.ar),
    // por eso pasa de Foundation (S1: setup + accesos) a Launch el 15/10 (S2).
    { nombre: "Awareness de Marca", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Launch", semanaInicio: 2, semanaFin: 3 },
      { nombre: "Scale", semanaInicio: 4, semanaFin: 8 },
    ]},
    // Ventas: Foundation (setup + pixel + REE Metrics) S1-S2, produccion de las 4 piezas
    // en S3 tras el Foundation Review del 19/10, Launch 27/10 (S4) + CyberMonday (S5), Scale S6-S8.
    { nombre: "Ventas (E-commerce)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
  ],

  seccionesBloqueadas: [],

  proximosPasos: [
    {
      titulo: "Pendientes de Julián",
      responsable: "Julián",
      tiempo: "Esta semana",
      items: [
        "Crear los packs x2 (extracto individual), x4 (dúo) y x6 (alto rendimiento) en Tienda Nube como productos nuevos, con foto, precio de pack y stock cargado",
        "Dar de baja el badge \"hasta 15% comprando en cantidad\" de la web: lo reemplazan los packs como producto",
        "Producir las piezas gráficas: 2 carruseles de Awareness + 6 carruseles de Ventas (post + historia) sobre la bajada creativa de este documento",
        "Regrabar los 2 reels orgánicos con el packaging actual (las etiquetas que muestran son las viejas). Se pautan igual mientras tanto: son de interacción, no de conversión",
        "Pasar a la creadora UGC los 4 guiones de video + la pauta de edición de este documento",
      ],
    },
    {
      titulo: "Pendientes de la Creadora UGC",
      responsable: "Creadora UGC",
      tiempo: "Esta semana",
      items: [
        "Producir los 2 videos de Awareness: 'Estrés / adaptógenos' y '¿Son todos iguales?' sobre el guión y timeline de este documento",
        "Producir los 2 videos de Ventas: '¿Estrés, mal sueño y cansancio?' para el ICP Consciente del Síntoma y '¿Sabés qué tiene adentro tu extracto?' para el Consciente del Producto",
        "Respetar la pauta de edición: isotipo de Micelic fijo en esquina superior izquierda, subtítulos a la altura de la cara (nunca en el tercio inferior, que lo tapa la UI de Reels), close-ups de etiqueta con la concentración visible",
        "Entregar en 9:16 (1080x1920) a un Drive compartido con REE",
      ],
    },
    {
      titulo: "Pendientes de REE",
      responsable: "REE Growth",
      tiempo: "Esta semana",
      items: [
        "Lanzar MICELIC_Awareness el 21/10 con los 4 reels curados (2 orgánicos de @micelic.ar + 2 del Drive). Sumar los 2 videos UGC y los 2 carruseles a medida que se produzcan",
        "Lanzar MICELIC_Ventas una vez recibidas las piezas de ventas — objetivo: tener ambas campañas activas antes del primer Review de ADS (10/11) y CyberMonday (02/11)",
        "Configurar las 2 colecciones de Meta Shopping (una por ICP) una vez que Julián tenga los packs cargados en Tienda Nube",
        "Testear creadora UGC (mujer) contra Julián (hombre) como variable de performance en Awareness",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call", fecha: "07/10" },
    { semana: 2, label: "Foundation Review", fecha: "19/10" },
    { semana: 3, label: "Launch AW", fecha: "21/10" },
    { semana: 4, label: "Launch Ventas", fecha: "27/10" },
    { semana: 5, label: "CyberMonday", fecha: "02/11" },
    { semana: 6, label: "Call ADS", fecha: "10/11" },
    { semana: 8, label: "Black Friday", fecha: "27/11" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Propuesta + KO Call", desc: "Propuesta el 05/10 (aceptada) y Kick Off el 07/10. Configuración de Meta Business Suite, conexión de @micelic.ar, acceso a Tienda Nube. Todo listo para arrancar.", status: "done", fecha: "07/10" },
    { semana: "S2", nombre: "Foundation Review", desc: "Domingo 19/10. Revisión completa: plan creativo, guiones, piezas, segmentación, demo REE Metrics. Aprobación para producir contenido y lanzar awareness + ventas.", status: "current", fecha: "19/10" },
    { semana: "S3", nombre: "Launch Awareness", desc: "Martes 21/10. Activación de MICELIC_Awareness con 2 reels curados de @micelic.ar. Primera señal de alcance y costo por resultado con la identidad de Julián al frente.", status: "pending", fecha: "21/10" },
    { semana: "S4", nombre: "Launch Ventas", desc: "Martes 27/10. Activación de MICELIC_Ventas. Julián produce contenido sobre la bajada creativa de REE. Primer testeo con 4 piezas × 2 ICPs.", status: "pending", fecha: "27/10" },
    { semana: "S6", nombre: "Call ADS", desc: "Martes 10/11. Review de CyberMonday, análisis de pieza ganadora, redistribución de presupuesto. Preparar variantes de Black Friday: definir oferta, combos y copies con Julián.", status: "pending", fecha: "10/11" },
    { semana: "S8", nombre: "Review Final + Black Friday", desc: "Martes 24/11. Black Friday (27/11) con variantes activas dentro de MICELIC_Ventas. Revisión del ciclo completo, resultados vs KPIs y plan del siguiente periodo.", status: "pending", fecha: "24/11" },
  ],
};

// --- Generate 3 HTMLs ---

const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);
const brief = renderBriefHtml(data);

// Output dirs
const slug = data.clientInfo.slug;
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
