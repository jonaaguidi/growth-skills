import { renderOnboardingHtml } from "../../dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { renderBriefHtml } from "../../dist/lib/brief-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Previews comprimidos (540x960) embebidos como data URI en el Foundation Review
const videoDataUri = (file) =>
  `data:video/mp4;base64,${readFileSync(join(__dirname, "assets", file)).toString("base64")}`;
const REEL_VERANO = videoDataUri("reel-verano-externo.mp4");
const REEL_FINDEANO = videoDataUri("reel-findeano-interno.mp4");
const imgDataUri = (file) =>
  `data:image/jpeg;base64,${readFileSync(join(__dirname, "assets", file)).toString("base64")}`;
// Slides del carrusel unidos por "||" — el renderer los muestra como carrusel navegable
const CARRUSEL_CIERRE = ["05", "06", "07", "08"]
  .map((n) => imgDataUri(`carrusel-cierredeano-${n}.jpg`))
  .join("||");
// Imagen Verano: formato story 9:16 para el preview (existe tambien la version feed 4:5 en assets/imagen-verano-04.jpg)
const IMAGEN_VERANO = imgDataUri("imagen-verano-03.jpg");
// Carrusel Temporada Alta: hook stand en verano → experiencias → metricas 2.000/200 → CTA 18 años
const CARRUSEL_TEMPORADA = ["01", "02", "03", "04"]
  .map((n) => imgDataUri(`carrusel-temporadaalta-${n}.jpg`))
  .join("||");

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
    fechaFin: "30/10",
    fechaInicioISO: "2026-09-02",
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
        { label: "Completar información de la Page (nombre, categoria, foto, portada)", status: "pendiente", notas: null },
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
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Cero pauta histórica en Meta",
        aplica: true,
        instrucciones: "BTLandia nunca invirtio en Meta Ads. No tiene cuenta publicitaria, no tiene Pixel, no tiene historial de campañas. Todo se configura desde cero. Esto significa que no hay data histórica para optimizar: las primeras semanas son de aprendizaje del algoritmo.",
      },
      {
        condicion: "Sin tracking en sitio web",
        aplica: true,
        instrucciones: "btlandia.com.ar no tiene Google Tag Manager, Google Analytics 4 ni Meta Pixel instalado. Baja prioridad inicial porque el CTA principal de las campañas es WhatsApp, no el sitio web. Se instala Pixel básico para trackear PageView y Lead, pero no es crítico en la primera fase.",
      },
      {
        condicion: "Sin CRM",
        aplica: true,
        instrucciones: "BTLandia no usa CRM actualmente. Se esta evaluando HubSpot, Brevo y Odoo. REE recomienda HubSpot Free por su integración nativa con Meta Ads y facilidad de uso. Critico para trackear leads y medir conversión. La integración tiene un costo one-time de USD 150 incluido en el primer mes.",
      },
      {
        condicion: "Agencia externa gestiona LinkedIn",
        aplica: true,
        instrucciones: "Una agencia externa gestiona el LinkedIn de BTLandia desde hace mas de 1.5 años. REE opera Meta e Instagram de forma independiente. Es necesario alinear calendarios editoriales para evitar mensajes contradictorios o duplicados. Coordinar con Nicolas Blasotta (consultor externo de Celes).",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
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
        { label: "Configurar WhatsApp como destino de campañas de Lead Gen", status: "pendiente", notas: null },
      ],
    },
    atenciónLeads: {
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
      { nombre: "CRM + WhatsApp", duracion: "10 min", objetivo: "Setup de HubSpot y configuración de WhatsApp como destino de campañas", output: "CRM y WhatsApp listos" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Proximos pasos + agendar Foundation Review", output: "Foundation Review agendada" },
    ],
    flujoTemas: [
      "Presentacion del equipo asignado y roles",
      "Review de la propuesta aceptada (recap de F1)",
      "Explicar el proceso de Foundation: que se va a hacer y en que orden",
      "Revisar requerimientos pendientes (brand assets, accesos, datos)",
      "Setup de CRM (HubSpot Free) con participacion de Frany",
      "Coordinar con agencia de LinkedIn (Nicolas Blasotta) para alinear calendarios",
      "Definir canales de comunicación (grupo WhatsApp, frecuencia de updates)",
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
        { label: "Coordinar con Nicolas Blasotta (consultor externo) para alineación", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: null,
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "BTLandia tiene 18 años de reputacion impecable pero cero captacion digital. El 100% de sus clientes llegan por referidos y networking personal de Celes, lo cual no escala. El segmento de medianas empresas esta completamente desatendido por canal digital. La marca tiene un diferencial único: expertise de agencia grande con atención de boutique. Captacion es la palanca correcta: primero que las medianas empresas descubran que BTLandia existe, despues convertir a leads calificados via WhatsApp.",
  },

  icp: [
    {
      segmento: "Mediana empresa que ya hace eventos",
      descripcion: "Empresa de 50-200 empleados que ya organiza eventos corporativos, tanto internos para su equipo (kick-offs, convenciones, team buildings) como externos para sus clientes (activaciones, lanzamientos, brand experience). Busca profesionalizar la experiencia y encontrar un partner estratégico que eleve el nivel de producción. Incluye también a la empresa que ya contrató una agencia y tuvo una mala experiencia: busca un partner confiable que ejecute a la altura.",
      frase: "Quiero llevar los eventos de mi empresa al siguiente nivel",
      dolores: [
        "Los eventos que organiza quedan bien pero no generan el impacto esperado",
        "Coordinar proveedores individuales consume tiempo y no garantiza resultado",
        "No tiene un partner estratégico que entienda la marca y el objetivo del evento",
        "Siente que sus eventos no se diferencian de los de cualquier otra empresa",
        "Ya contrató una agencia que no ejecutó a la altura y desconfía de volver a delegar",
      ],
      deseos: [
        "Un partner llave en mano que profesionalice la experiencia completa",
        "Eventos que generen impacto real en clientes, equipo y directivos",
        "Elevar el nivel de producción sin multiplicar la complejidad operativa",
        "Un socio de largo plazo para todos los eventos del año",
      ],
      objeciones: [
        "Ya tenemos nuestro propio sistema armado y funciona razonable",
        "El portfolio de BTLandia es de corporaciones grandes, no se si aplica a nosotros",
        "No quiero perder el control creativo del evento",
        "Cuanto mas cuesta vs lo que ya gastamos internamente?",
      ],
      recurrencia: "media",
      badge: "Demanda activa",
      ejemplosMarcas: [
        {
          marca: "Tostado",
          rubro: "Gastronomía / Cafeterías",
          rol: "Director/a de Marketing o Brand Manager",
          avatarFile: "tostado-avatar.jpg",
          caso: "Evento externo: lanzamiento de su nueva línea de sánguches con una brand experience en la costa atlántica, activando en 5 paradores principales (Pinamar, Cariló, Mar del Plata, Villa Gesell y Costa Esmeralda). Ya organiza aperturas y lanzamientos con proveedores sueltos. El salto es un partner integral que eleve el nivel de producción y facilite la logística integral.",
        },
      ],
    },
    {
      segmento: "Mediana empresa que quiere empezar a hacer eventos",
      descripcion: "Empresa de 30-150 empleados que nunca contrató una agencia de eventos ni organizó experiencias de marca a nivel profesional. Intuye que un evento potenciaría su marca, ya sea interno para fortalecer la cultura de su equipo o externo para fomentar la brand experience con sus clientes, pero no sabe por dónde empezar ni cuánto cuesta.",
      frase: "Quiero explorar que haria un evento profesional por mi marca",
      dolores: [
        "No comprende el valor de los eventos presenciales, ni internos para su equipo ni externos para sus clientes",
        "No sabe como funciona contratar una agencia de brand experience ni que esperar",
        "No tiene referencia de cuanto cuesta ni que incluye una producción profesional",
        "Siente que los eventos son para empresas mas grandes o con mas presupuesto",
        "No puede justificar la inversion ante directivos sin evidencia de impacto",
      ],
      deseos: [
        "Entender que potenciaria un evento profesional en su empresa",
        "Una primera experiencia accesible y sin riesgo para probar el formato",
        "Poder mostrar resultados tangibles al equipo directivo",
        "Descubrir como una brand experience impacta en empleados, proveedores y clientes",
      ],
      objeciones: [
        "Nunca hicimos un evento profesional, no se si es para nosotros",
        "El presupuesto es limitado, no sabemos si nos alcanza",
        "Podemos hacer algo interno sin contratar una agencia",
        "No estoy seguro de que el retorno justifique la inversion",
      ],
      recurrencia: "baja",
      badge: "Demanda latente",
      ejemplosMarcas: [
        {
          marca: "Pinturerías REX",
          rubro: "Retail / Pinturerías",
          rol: "Gerente Comercial o Gerente de RRHH",
          avatarFile: "rex-avatar.jpg",
          caso: "Evento interno: kick-off con su equipo comercial y de sucursales orientado a la mejora de procesos comerciales y de la experiencia del usuario en el punto de venta. Todavía no dimensiona el valor de un evento presencial para alinear a toda la red ni trabajó con una agencia.",
        },
      ],
    },
  ],

  propuestaDeValor: {
    descripcion: "Agencia creativa con 18 años de expertise en eventos corporativos y experiencias de marca. Portfolio de corporaciones de primer nivel (Fiat, Stellantis, YPF Agro, Avon, Club Med, Citroen) con la flexibilidad y atención personalizada de una agencia boutique. Zero churn reportado en 18 años. Nuevo producto en desarrollo: kick-off paquetizado para medianas empresas.",
    diferenciador: "Expertise de agencia grande con atención de agencia boutique. 18 años, zero churn. Acceso directo a la fundadora. El único partner que profesionaliza eventos de medianas empresas con el mismo nivel de ejecución que aplica a corporaciones multinacionales.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Decision maker con evento concreto (fecha, tipo de evento, presupuesto definido). Intent de compra claro.",
      accion: "Contactar a Celes en menos de 2 horas via WhatsApp. Agendar call de diagnóstico.",
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
    { nombre: "Tasa de conversión lead > propuesta", objetivo: "20%+", fuente: "CRM (HubSpot)" },
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
    limiteGastoCuenta: null,
  },

  creativos: {
    angulos: [
      {
        nombre: "Partner que eleva el nivel",
        dolorQueResuelve: "Ya organiza eventos pero no generan el impacto esperado y coordinar proveedores sueltos agota",
        mensajeClave: "Un solo partner llave en mano con 18 años de producción profesional, para eventos internos y externos",
        formato: "Video BTS + Carrusel",
      },
      {
        nombre: "Experiencias que se recuerdan",
        dolorQueResuelve: "Sus eventos no se diferencian y ya tuvo una agencia que no ejecutó a la altura",
        mensajeClave: "18 años y cero clientes perdidos creando brand experiences que hacen hablar, en plena temporada alta",
        formato: "Carrusel + Imagen",
      },
      {
        nombre: "El valor de la brand experience",
        dolorQueResuelve: "No comprende el valor de los eventos presenciales, ni internos ni externos",
        mensajeClave: "Un kick-off alinea a tu equipo y una activación de verano pone tu marca en las manos de tus clientes",
        formato: "Video (Celes a cámara) + Imagen",
      },
      {
        nombre: "Tu primer evento, sin vueltas",
        dolorQueResuelve: "No sabe cómo funciona contratar una agencia de brand experience ni cuánto cuesta",
        mensajeClave: "Proceso claro en 4 pasos y presupuesto a medida de tu empresa",
        formato: "Carrusel educativo",
      },
    ],
    piezasPorIcp: [
      {
        icp: "Mediana empresa que ya hace eventos",
        piezas: [
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Los eventos que organiza (internos y externos) quedan bien pero no generan el impacto esperado.",
            solucion: "Producción profesional de BTLandia: diseño de la experiencia completa para la marca, tanto en eventos internos (kick-offs, celebraciones) como externos (lanzamientos, activaciones).",
            comunicacion: "[0-3s] HOOK — Inserts rápidos de momentos reales de eventos ya realizados (escenografía, luces, gente reaccionando), cortes al ritmo de la música. Texto overlay con la pregunta. Voz en off: 'Los eventos de tu empresa se hacen... ¿pero generan impacto?' [3-10s] BODY — Siguen los inserts rápidos, variedad de eventos internos y externos, branding de marca, pantallas, detalles de producción. Voz en off: 'La diferencia no está en la idea. Está en el diseño de la experiencia completa para tu marca.' [10-17s] BODY — Tomas más lentas, slow motion de los mejores momentos, equipo aplaudiendo, gente viviendo la experiencia. Voz en off: 'Este es el impacto que produce un evento cuando lo produce un equipo con 18 años de experiencia.' [17-22s] CTA — Placa final con texto grande sobre clip del evento. Voz en off: 'Tu próximo evento puede marcar la diferencia, contactanos por WhatsApp.' [22-25s] CIERRE — Motion graphics con logo BTLandia.",
            hook: "Los eventos de tu empresa se hacen... ¿pero generan impacto?",
            body: "La diferencia no está en la idea. Está en el diseño de la experiencia completa para tu marca. Este es el impacto que produce un evento cuando lo produce un equipo con 18 años de experiencia.",
            cta: "Tu próximo evento puede marcar la diferencia, contactanos por WhatsApp.",
            copyAnuncio: "Los eventos de tu empresa se hacen... ¿pero generan impacto? 🤔\n\n🎬 La diferencia no está en la idea: está en el diseño de la experiencia completa para tu marca.\n🏆 18 años produciendo eventos internos y externos para las marcas más grandes del país.\n\n👉 Escribinos por WhatsApp y diseñemos tu próximo evento.",
            pilar: "Interno + Externo (eventos para el equipo y para clientes)", tema: "Impacto / Diseño de experiencia completa",
            formatoNarrativo: "Montage - Highlights de eventos con voz en off",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "20-25s",
            enRevision: false,
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Organizar un evento para su empresa es un caos: proveedores sueltos y nadie que entienda la marca y sus necesidades.",
            solucion: "BTLandia como partner estratégico que diseña cada evento alineado a las necesidades de la marca: 18 años creando brand experiences para Fiat, YPF y Avon, entre otras, tanto en eventos internos como externos.",
            comunicacion: "[0-3s] HOOK — Celes plano medio, directa a cámara, fondo limpio: 'Entendemos el caos que es organizar un evento para tu empresa.' [3-9s] BODY — Inserts de eventos reales de BTLandia, logos de marcas en pantalla. Voz de Celes: 'Por eso... hace 18 años diseñamos brand experiences para marcas como Fiat, YPF, Avon, entre otras.' [9-13s] BODY — Clips de producción y detalles de branding a medida. Voz de Celes: 'Diseñamos cada evento alineado a las necesidades de tu marca.' [13-18s] BODY — Clips alternando eventos internos (equipos celebrando) y experiencias externas con consumidores. Voz de Celes: 'Desde eventos internos que alinean los objetivos de tu equipo, hasta activaciones que ponen a tu marca en manos de los consumidores.' [18-22s] CTA — Celes cierra mirando a cámara, placa con texto grande: 'Escribinos por WhatsApp y diseñemos la experiencia de tu marca juntos.' [22-25s] CIERRE — Motion graphics con logo BTLandia.",
            hook: "Entendemos el caos que es organizar un evento para tu empresa.",
            body: "Por eso... hace 18 años diseñamos brand experiences para marcas como Fiat, YPF, Avon, entre otras. Diseñamos cada evento alineado a las necesidades de tu marca: desde eventos internos que alinean los objetivos de tu equipo, hasta activaciones que ponen a tu marca en manos de los consumidores.",
            cta: "Escribinos por WhatsApp y diseñemos la experiencia de tu marca juntos.",
            copyAnuncio: "Entendemos el caos que es organizar un evento para tu empresa 🤯\n\n🏆 Por eso hace 18 años diseñamos brand experiences para marcas como Fiat, YPF y Avon, entre otras.\n🎯 Cada evento se diseña alineado a las necesidades de tu marca.\n✅ Desde eventos internos que alinean los objetivos de tu equipo, hasta activaciones que ponen a tu marca en manos de los consumidores.\n\n👉 Escribinos por WhatsApp y diseñemos la experiencia de tu marca juntos.",
            pilar: "Interno + Externo (eventos para el equipo y para clientes)", tema: "Partner estratégico / Evento adaptado a tu marca",
            formatoNarrativo: "Direct to Camera - Talking Head",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
            duracion: "20-25s",
            enRevision: false,
          },
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Invierte en eventos que se hacen por cumplir y no dejan impacto: plata quemada sin retorno.",
            solucion: "Un evento diseñado desde el objetivo de la marca genera impacto que se recuerda: 18 años de producción profesional para marcas de primer nivel.",
            comunicacion: "Flyer de impacto/ROI. Imagen hero de un momento memorable de evento BTLandia de gran producción con placa del hook. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: foto de un momento memorable de evento real de BTLandia (gran producción, gente celebrando/asombrada). Composición limpia con placa de texto.",
              "Copy principal: 'UN EVENTO SIN IMPACTO ES TIEMPO Y PLATA PERDIDA' Subcopy: 'Un evento bien diseñado genera impacto en tu equipo y en tus clientes. 18 años produciendo eventos para marcas de primer nivel.'",
              "CTA: 'Escribinos por WhatsApp y diseñemos tu próximo evento.'",
            ],
            copyAnuncio: "Un evento sin impacto es tiempo y plata perdida 💸\n\n🎯 Un evento bien diseñado genera impacto: alinea a tu equipo y pone tu marca en la cabeza de tus clientes.\n🏆 18 años produciendo eventos para marcas de primer nivel.\n\n👉 Escribinos por WhatsApp y diseñemos tu próximo evento.",
            pilar: "Interno + Externo (impacto de la inversión)", tema: "Impacto / Inversión que se recuerda",
            formatoNarrativo: "Marca - Hero Shot",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Cinematic", estilo: "Lifestyle" },
            enRevision: false,
          },
          {
            formato: "Carrusel (1080x1080)",
            dolor: "La temporada alta se le viene encima sin un plan: ni un kick-off que alinee al equipo para el 2027 ni una activación que aproveche el verano.",
            solucion: "Dos jugadas para la temporada alta: un kick-off que alinea a tu equipo para el 2027 o una activación de verano que pone tu marca en la cabeza de las personas.",
            comunicacion: "Carrusel x3 slides enfocado en aprovechar la temporada alta con las dos jugadas (kick-off interno 2027 / activación externa de verano). Fotos reales de BTLandia + placas de copy.",
            mensajes: [
              "Slide 1: 'EL MEJOR MOMENTO DEL AÑO PARA TU MARCA' Visual hero de activación de verano llena de gente.",
              "Slide 2: Grid dividido en dos. Sobre foto de kick-off: 'KICK-OFF 2027: alineá los objetivos con tu equipo'. Sobre foto de activación: 'ACTIVACIÓN DE VERANO: tu marca en la cabeza de tus clientes'.",
              "Slide 3: '18 años produciendo eventos que impactan. Escribinos por WhatsApp.' Placa de cierre con logo BTLandia.",
            ],
            copyAnuncio: "El mejor momento del año para tu marca ☀️\n\n🎯 Kick-off 2027: alineá los objetivos con tu equipo.\n🔥 Activación de verano: tu marca en la cabeza de tus clientes.\n🏆 18 años produciendo eventos que impactan.\n\n👉 Escribinos por WhatsApp y diseñemos tu temporada alta.",
            pilar: "Interno + Externo (temporada alta)", tema: "Temporada alta / Kick-off 2027 y activaciones de verano",
            formatoNarrativo: "Marca - Storytelling por slides",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Lifestyle" },
            enRevision: false,
          },
        ],
      },
      {
        icp: "Mediana empresa que quiere empezar a hacer eventos",
        piezas: [
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "No comprende el valor de los eventos presenciales, ni internos para su equipo ni externos para sus clientes.",
            solucion: "Pieza educativa que muestra las dos caras del evento presencial: el kick-off que alinea al equipo y la activación de verano que pone el producto en las manos de los clientes.",
            comunicacion: "[0-3s] HOOK — Celes plano medio, directa a cámara, texto overlay con la pregunta: '¿Sabés lo que un evento presencial puede hacer por tu empresa?' [3-9s] BODY — Inserts de kick-offs y team buildings, equipos celebrando y compartiendo. Voz de Celes: 'Un kick-off alinea a tu equipo detrás de los objetivos del año y fortalece la cultura para encarar nuevos desafíos.' [9-15s] BODY — Inserts de activaciones externas, stands llenos, gente probando producto. Voz de Celes: 'Una activación en verano pone tu producto en las manos de tus clientes. Más de 2000 personas pueden vivir la experiencia de tu marca.' [15-20s] CTA — Celes cierra a cámara, placa con texto grande: '¿Cuál es el próximo objetivo de tu empresa? Escribinos por WhatsApp y diseñemos la próxima experiencia de tu marca.' [20-23s] CIERRE — Motion graphics con logo BTLandia.",
            hook: "¿Sabés lo que un evento presencial puede hacer por tu empresa?",
            body: "Un kick-off alinea a tu equipo detrás de los objetivos del año y fortalece la cultura para encarar nuevos desafíos. Una activación en verano pone tu producto en las manos de tus clientes: más de 2000 personas pueden vivir la experiencia de tu marca.",
            cta: "¿Cuál es el próximo objetivo de tu empresa? Escribinos por WhatsApp y diseñemos la próxima experiencia de tu marca.",
            copyAnuncio: "¿Sabés lo que un evento presencial puede hacer por tu empresa? 🤔\n\n🎯 Un kick-off alinea a tu equipo detrás de los objetivos del año y fortalece la cultura para encarar nuevos desafíos.\n🎪 Una activación en verano pone tu producto en las manos de tus clientes: más de 2000 personas pueden vivir la experiencia de tu marca.\n\n👉 ¿Cuál es el próximo objetivo de tu empresa? Escribinos por WhatsApp y diseñemos la próxima experiencia de tu marca.",
            pilar: "Interno + Externo (valor del evento presencial)", tema: "Educativo / Valor del evento",
            formatoNarrativo: "Direct to Camera - Talking Head",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
            duracion: "20-23s",
            enRevision: false,
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Siente que los eventos son para empresas más grandes o con más presupuesto.",
            solucion: "BTS de un evento real de mediana empresa: el mismo nivel de producción de las grandes marcas, a la medida del presupuesto de una empresa como la suya.",
            comunicacion: "[0-3s] HOOK — Clips de un kick-off de mediana empresa en pleno desarrollo, equipo celebrando. Texto overlay: 'No hace falta ser una multinacional para organizar eventos de alto impacto.' [3-10s] BODY — BTS del montaje y momentos del evento, dinámicas de equipo, risas genuinas. Voz en off: 'Trabajamos hace 18 años con las marcas más grandes del país. Hoy ese mismo nivel de producción está al alcance de tu empresa.' [10-16s] BODY — Clips alternando kick-offs y activaciones de verano llenas de gente. Voz en off: 'Se viene el cierre de año y un evento puede preparar a tu equipo para el 2027 o hacer que tu marca llegue a las personas correctas en el verano.' [16-21s] CTA — Placa final sobre clip del evento. Voz en off: 'Tu empresa también puede hacer eventos de alto impacto. Escribinos por WhatsApp.' [21-24s] CIERRE — Motion graphics con logo BTLandia.",
            hook: "No hace falta ser una multinacional para organizar eventos de alto impacto.",
            body: "Trabajamos hace 18 años con las marcas más grandes del país. Hoy ese mismo nivel de producción está al alcance de tu empresa. Se viene el cierre de año y un evento puede preparar a tu equipo para el 2027 o hacer que tu marca llegue a las personas correctas en el verano.",
            cta: "Tu empresa también puede hacer eventos de alto impacto. Escribinos por WhatsApp.",
            copyAnuncio: "No hace falta ser una multinacional para organizar eventos de alto impacto 🔥\n\n🏆 Trabajamos hace 18 años con las marcas más grandes del país. Hoy ese mismo nivel de producción está al alcance de tu empresa.\n☀️ Se viene el cierre de año y un evento puede preparar a tu equipo para el 2027 o hacer que tu marca llegue a las personas correctas en el verano.\n\n👉 Tu empresa también puede hacer eventos de alto impacto. Escribinos por WhatsApp.",
            pilar: "Interno + Externo (accesibilidad)", tema: "Accesibilidad / Primer evento",
            formatoNarrativo: "BTS - Montaje con voz en off",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
            duracion: "20-24s",
            enRevision: false,
          },
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "No sabe cómo funciona contratar una agencia de brand experience ni qué esperar.",
            solucion: "BTLandia resuelve el evento de punta a punta: el cliente cuenta su objetivo y la agencia diseña, produce y ejecuta todo.",
            comunicacion: "Flyer educativo para el primer evento. Imagen hero del equipo BTLandia en plena producción de un evento real. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: foto del equipo BTLandia produciendo un evento real (montaje, dirección, detalle de marca).",
              "Copy principal: '¿NUNCA HICISTE UN EVENTO PARA TU EMPRESA?' Subcopy: 'Nos contás tu objetivo y nos encargamos del resto: idea, producción y ejecución. 18 años haciendo eventos para marcas de primer nivel.'",
              "CTA: 'Escribinos por WhatsApp y te contamos cómo funciona.'",
            ],
            copyAnuncio: "¿Nunca hiciste un evento para tu empresa? 🤔\n\n✅ Nos contás tu objetivo.\n🎯 Nosotros diseñamos, producimos y ejecutamos todo.\n🏆 18 años haciendo eventos para marcas de primer nivel.\n\n👉 Escribinos por WhatsApp y te contamos cómo funciona.",
            pilar: "Interno + Externo (primer evento)", tema: "Cómo funciona / Primer evento",
            formatoNarrativo: "Marca - Hero Shot",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
          },
          {
            formato: "Carrusel (1080x1080)",
            dolor: "No comprende los beneficios concretos de un evento presencial, ni interno para su equipo ni externo para sus clientes.",
            solucion: "Carrusel educativo con los beneficios de cada tipo de evento: qué gana el equipo con un evento interno y qué gana la marca con una activación.",
            comunicacion: "Carrusel educativo x4 slides sobre beneficios del evento presencial. Fotos reales + placas de copy con checks.",
            mensajes: [
              "Slide 1: Badge 'TEMPORADA ALTA' por encima del hook '¿SABÉS TODO LO QUE UN EVENTO PUEDE HACER POR TU EMPRESA?' Visual hero de evento corporativo lleno de gente.",
              "Slide 2: 'EVENTOS PARA TU EQUIPO' con 3 checks sobre foto de kick-off: '✔ Alinea a tu equipo detrás de los objetivos' / '✔ Fortalece la cultura de tu empresa' / '✔ Motiva a las personas para los desafíos del 2027'.",
              "Slide 3: 'BRAND EXPERIENCES PARA TUS CLIENTES' con 3 checks sobre foto de activación de verano: '✔ Pone tu producto en las manos de tus clientes' / '✔ Hace que tu marca se recuerde' / '✔ Llega a miles de personas en un solo día'.",
              "Slide 4: '¿Vas a dejar pasar la temporada alta? Escribinos por WhatsApp.' Placa de cierre con logo BTLandia.",
            ],
            copyAnuncio: "¿Sabés todo lo que un evento puede hacer por tu empresa? 🤔\n\n🎯 Eventos para tu equipo: alinean los objetivos, fortalecen la cultura y motivan para los desafíos del 2027.\n☀️ Brand experiences: ponen tu producto en las manos de tus clientes y hacen que tu marca se recuerde.\n\n👉 ¿Vas a dejar pasar la temporada alta? Escribinos por WhatsApp.",
            pilar: "Interno + Externo (beneficios del evento presencial)", tema: "Educativo / Beneficios del evento presencial",
            formatoNarrativo: "Educativo - Lista de beneficios",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
          },
        ],
      },
    ],
    formatos: ["Video Comercial Vertical (9:16)", "Posteo Rectangular (1080x1350)", "Carrusel (1080x1080)"],
    tono: null,
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
      tituloSeccion: "Campaña B2B (WhatsApp)",
      tituloSubseccion: "Campaña B2B en Meta Ads",
      status: "en-desarrollo",
      destino: "WhatsApp Business de BTLandia",
      conversionCampana: "Cantidad de Mensajes a WhatsApp",
      kpisCampana: ["Cantidad de Conversaciones (leads que entran)", "CPL (costo por lead)", "CTR (interés que genera el anuncio)"],
      presupuestoCampana: { diario: "USD $11.6/día (≈ ARS $17.900)", mensual: "USD $350/mes (≈ ARS $539.000)" },
      adSets: [
        {
          nombre: "Conjunto_Mediana_Activa",
          segmentacion: "30-55 años, CABA + GBA. Cargos: Director de Marketing, Gerente de Marketing, Brand Manager, CMO. Empresas 50-200 empleados. Intereses: Eventos corporativos, Brand experience, Marketing BTL, Lanzamientos de producto, Team building",
          ads: [
            "Anuncio_Video_ImpactoEventos_V1 | Highlights de eventos reales: los eventos se hacen... ¿pero generan impacto?",
            "Anuncio_Video_CelesPartner_V1 | Celes a cámara: entendemos el caos de organizar un evento, diseñamos la experiencia de tu marca",
            "Anuncio_Posteo_PlataPerdida_V1 | Un evento sin impacto es tiempo y plata perdida",
            "Anuncio_Carrusel_TemporadaAlta_V1 | Kick-off 2027 o activación de verano, aprovechá la temporada alta",
          ],
        },
        {
          nombre: "Conjunto_Mediana_Latente",
          segmentacion: "30-55 años, CABA + GBA. Cargos: Gerente Comercial, Gerente de RRHH, Director de Operaciones, People Manager. Empresas 30-150 empleados. Intereses: Cultura organizacional, Team building, Recursos Humanos, Incentivos laborales, Experiencia del cliente",
          ads: [
            "Anuncio_Video_ValorEvento_V1 | Celes a cámara: qué hace un evento presencial por tu empresa, interno y externo",
            "Anuncio_Video_PrimerEvento_V1 | No hace falta ser una multinacional para organizar eventos de alto impacto",
            "Anuncio_Posteo_ComoFunciona_V1 | Nunca hiciste un evento: nos contás tu objetivo y nos encargamos del resto",
            "Anuncio_Carrusel_Beneficios_V1 | Beneficios del evento presencial: internos para tu equipo y activaciones para tus clientes",
          ],
        },
      ],
    },
    {
      nombre: "BTLandia_Awareness",
      objetivo: "Awareness",
      descripcionCampana: "Dar <b>visibilidad de BTLandia como marca</b> y generar <b>conciencia en la mediana empresa</b> sobre la importancia de la <b>brand experience</b>, tanto para usuarios internos y externos (empleados, proveedores) como para clientes. La <b>temporada de verano</b> es clave: las marcas buscan generar incentivos y alinear objetivos. Esta campaña sienta las bases para luego empujar la <b>campaña B2B con foco en conversión</b>.",
      status: "activa",
      destino: "Perfil de Instagram (@btlandia)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Seguidores"],
      presupuestoCampana: { diario: "USD $5/día (≈ ARS $7.700)", mensual: "USD $150/mes (≈ ARS $231.000)" },
      adSets: [
        {
          nombre: "Conjunto_General_CABA_GBA",
          segmentacion: "30-55 años, CABA + GBA (radio 40 km). Puestos: Event Planner/Coordinator, Human Resources Manager, Director of Human Resources. Tamaño de empresa: 11-100 empleados, 101-500 empleados, más de 500 empleados. Intereses: Gestión de eventos, Gestión de recursos humanos, Pequeñas y medianas empresas. Comportamientos: Administradores de páginas de empresa, Pequeños empresarios.",
          ads: [
            "Reel_Top3_V1 | https://www.instagram.com/p/DcenJEiEzVA/",
            "Reel_Momentos_V1 | https://www.instagram.com/p/DbWkSCmEvjd/",
            "Reel_BTS_Produccion_V1 | https://www.instagram.com/p/DcKAqs8iAIz/",
            `Reel_Verano_Externo_V1 | ${REEL_VERANO}`,
            `Reel_FinDeAño_Interno_V1 | ${REEL_FINDEANO}`,
            `Imagen_Verano_V1 | ${IMAGEN_VERANO}`,
            `Carrusel_CierreDeAño_V1 | ${CARRUSEL_CIERRE}`,
            `Carrusel_TemporadaAlta_V1 | ${CARRUSEL_TEMPORADA}`,
          ],
        },
      ],
      // piezasOcultas: renombrado para que NO se renderice la seccion "Piezas Creativas" (indice + page). Renombrar a "piezas" para reactivarla.
      piezasOcultas: [
        {
          formato: "Reel",
          dolor: "La mediana empresa no visualiza el impacto real que un evento puede generar en su audiencia externa.",
          solucion: "Resultados reales de los eventos BTLandia: más de 2000 personas pasaron por el stand, 200 hicieron el test drive. Métricas tangibles.",
          comunicacion: "[0-3s] HOOK — Apertura con clips reutilizados de eventos BTLandia, gente circulando, texto overlay con la pregunta. Voz en off: '¿Qué efectos tiene hacer eventos para tu empresa?' [3-9s] BODY — Secuencia de clips de distintos eventos, stands, gente interactuando con la marca. Voz en off: 'Estos fueron parte de nuestros eventos.' [9-16s] BODY — Clips del test drive, primeros planos de gente con el producto. Contadores animados en edición (2000 y 200). Voz en off: 'Más de 2000 personas pasaron por el stand. 200 hicieron el test drive. ¡Métricas reales que impactan!' [16-24s] CTA — Mejores momentos de los eventos en secuencia rápida, placa con texto grande sobre el último clip. Voz en off: 'Tu marca también puede generar esto. Contactanos y diseñemos la experiencia de tu marca.' [24-28s] CIERRE — Motion graphics con logo BTLandia + @btlandia.",
          hook: "¿Qué efectos tiene hacer eventos para tu empresa?",
          body: "Estos fueron parte de nuestros eventos. Más de 2000 personas pasaron por el stand. 200 hicieron el test drive. ¡Métricas reales que impactan!",
          cta: "Tu marca también puede generar esto. Contactanos y diseñemos la experiencia de tu marca.",
          copyAnuncio: "¿Qué efectos tiene hacer eventos para tu empresa? 🤔\n\n🎪 Estos fueron parte de nuestros eventos.\n👥 Más de 2000 personas pasaron por el stand.\n✅ 200 hicieron el test drive.\n\n📊 ¡Métricas reales que impactan!\n\n👉 Tu marca también puede generar esto. Contactanos y diseñemos la experiencia de tu marca. Seguinos en @btlandia",
          pilar: "Externo (eventos para clientes / audiencia externa)", tema: "Incentive Travel / Verano",
          formatoNarrativo: "Caso de Éxito - Voz en off sobre clips reutilizados",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
          duracion: "20-30s",
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
        },
        {
          formato: "Reel",
          dolor: "La mediana empresa no dimensiona la oportunidad de los eventos presenciales en temporada alta y cree que armar uno está fuera de su alcance.",
          solucion: "Presencia de marca en temporada alta con eventos de producto para cualquier industria. Presupuesto flexible que se adapta a cada empresa.",
          comunicacion: "[0-4s] HOOK — Clips reutilizados de eventos en verano, stands llenos de gente, distintas marcas (no automotrices). Texto overlay con la pregunta. Voz en off: '¿Sabés cuántas personas visitan un stand durante el verano?' [4-8s] HOOK — Primeros planos de gente sonriendo, probando producto, interactuando con la marca. Voz en off: '¿Y sabés cuántas se enamoran de tu marca?' [8-16s] BODY — Secuencia de activaciones al aire libre, temporada alta, producto en primer plano, texto overlay con frases clave. Voz en off: 'En temporada alta la gente sale a vivir experiencias. Un buen evento pone tu marca en sus manos.' [16-24s] CTA — Placa final con texto grande sobre clip de evento. Voz en off: 'Armemos tu experiencia a medida, adaptada a tu empresa.' [24-28s] CIERRE — Motion graphics con logo BTLandia + @btlandia.",
          hook: "¿Sabés cuántas personas visitan un stand durante el verano? ¿Y sabés cuántas se enamoran de tu marca?",
          body: "En temporada alta la gente sale a vivir experiencias. Un buen evento pone tu marca en sus manos.",
          cta: "Armemos tu experiencia a medida, adaptada a tu empresa.",
          copyAnuncio: "¿Sabés cuántas personas visitan un stand durante el verano? 🤔\n\n💘 ¿Y sabés cuántas se enamoran de tu marca?\n\n☀️ En temporada alta la gente sale a vivir experiencias.\n🎪 Un buen evento pone tu marca en sus manos.\n\n💰 Presupuesto flexible.\n\n👉 Armemos tu experiencia a medida, adaptada a tu empresa. Escribinos por DM en @btlandia",
          pilar: "Externo (eventos para clientes / audiencia externa)", tema: "Brand Experience / Temporada Alta",
          formatoNarrativo: "Pregunta Retórica - Voz en off sobre clips reutilizados",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
          duracion: "20-30s",
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
        },
        {
          formato: "Imagen",
          dolor: "Las marcas pierden la oportunidad de la temporada alta: la gente está en la calle y ellas siguen solo en lo digital.",
          solucion: "Un stand o activación en temporada alta pone el producto en las manos de la gente y suma presencia de marca.",
          comunicacion: "Flyer de activación de marca en verano. Imagen hero de activación real de BTLandia en exteriores. Adaptar a Story (1080x1920).",
          mensajes: [
            "Visual hero: foto de activación real de BTLandia en exteriores (stand lleno, verano, gente interactuando con el producto). Composición limpia con la gente como protagonista.",
            "Copy principal: 'ESTE VERANO PONÉ TU MARCA EN LAS MANOS DE LA GENTE' Subcopy: 'Stands, activaciones y experiencias de producto. Sumá presencia en la temporada alta con un evento a medida.'",
            "Badge: 'Temporada alta'. CTA: 'Contactanos y diseñemos la experiencia de tu marca. @btlandia'",
          ],
          copyAnuncio: "ESTE VERANO PONÉ TU MARCA EN LAS MANOS DE LA GENTE ☀️\n\n🎪 Stands, activaciones y experiencias de producto.\n👥 En temporada alta la gente sale a vivir experiencias.\n\n💰 Presupuesto flexible, adaptado a tu empresa.\n\n👉 Contactanos y diseñemos la experiencia de tu marca. @btlandia",
          pilar: "Externo (eventos para clientes / audiencia externa)", tema: "Brand Experience / Temporada Alta",
          formatoNarrativo: "Marca - Hero Shot",
          estructuraNarrativa: "Afirmación - Evidencia",
          tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
        },
        {
          formato: "Carrusel",
          dolor: "La mediana empresa no dimensiona cuánta gente puede conocer su producto en un evento de temporada alta.",
          solucion: "Un evento bien diseñado convierte el tráfico del verano en presencia de marca, con métricas reales y experiencia a medida.",
          comunicacion: "Carrusel x4 slides enfocado en activar presencia de marca en verano. Fotos de activaciones reales de BTLandia + placas de copy. Adaptar a Story (1080x1920).",
          mensajes: [
            "Slide 1: Badge 'Temporada alta' encima del headline. '¿SABÉS CUÁNTAS PERSONAS VISITAN UN STAND EN VERANO?' Visual hero de stand lleno de gente.",
            "Slide 2: 'Más de 2000 personas pasaron por un stand. 200 probaron el producto.' Foto de activación real con contadores en placa.",
            "Slide 3: 'En temporada alta la gente sale a vivir experiencias. Un buen evento pone tu marca en sus manos.' Visual de gente interactuando con el producto.",
            "Slide 4: '18 años creando experiencias que hacen hablar. ¡Armemos tu experiencia a medida!' Placa de cierre con logo BTLandia + @btlandia.",
          ],
          copyAnuncio: "¿Sabés cuántas personas visitan un stand en verano? 🤔\n\n👥 Más de 2000 personas pasaron por un stand.\n✅ 200 probaron el producto.\n☀️ En temporada alta la gente sale a vivir experiencias.\n\n💰 Presupuesto flexible, adaptado a tu empresa.\n\n👉 ¡Armemos tu experiencia a medida! Escribinos por DM en @btlandia",
          pilar: "Externo (eventos para clientes / audiencia externa)", tema: "Presencia de Marca / Verano",
          formatoNarrativo: "Marca - Storytelling por slides",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
        },
        {
          formato: "Imagen",
          dolor: "Las empresas se quedan en lo digital y no fomentan la cultura interna con experiencias presenciales.",
          solucion: "Un Kick Off o brand experience profesional fortalece la cultura y alinea al Talento Humano de la empresa para el próximo año.",
          comunicacion: "Flyer con claim de cultura y llamado a la acción. Imagen hero de evento corporativo real de BTLandia. Adaptar a Story (1080x1920).",
          mensajes: [
            "Visual hero: foto de evento corporativo real de BTLandia (iluminación, escenografía, gente compartiendo). Composición limpia con el equipo como protagonista.",
            "Copy principal: 'SALÍ DE LO DIGITAL, FOMENTÁ LA CULTURA DE TU EQUIPO' Subcopy: 'Kick Off, cierre de año, viajes de incentivo y brand experience. Experiencias presenciales que fortalecen y alinean al Talento Humano de tu empresa.'",
            "CTA: 'Anticipate al 2027 con tu empresa. @btlandia'",
          ],
          copyAnuncio: "SALÍ DE LO DIGITAL, FOMENTÁ LA CULTURA DE TU EQUIPO 🔥\n\n🎯 Kick Off, cierre de año, viajes de incentivo y brand experience.\n🤝 Experiencias presenciales que fortalecen y alinean al Talento Humano de tu empresa.\n\n📅 Anticipate al 2027 con tu empresa.\n\n👉 Seguinos en @btlandia",
          pilar: "Interno (eventos para el equipo / cultura interna)", tema: "Cultura / Talento Humano",
          formatoNarrativo: "Marca - Hero Shot",
          estructuraNarrativa: "Afirmación - Evidencia",
          tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
        },
        {
          formato: "Carrusel",
          dolor: "Los equipos cierran el año sin alinearse ni definir los objetivos del 2027.",
          solucion: "Un Kick Off presencial alinea al equipo detrás de los objetivos del 2027 y arranca el año con energía.",
          comunicacion: "Carrusel x4 slides enfocado en alineación de objetivos 2027. Fotos de eventos reales de BTLandia + placas de copy. Adaptar a Story (1080x1920).",
          mensajes: [
            "Slide 1: Badge 'Cierre de año' encima del headline. '¡EL ÉXITO DE TU EMPRESA EN 2027 COMIENZA AHORA!' Visual hero de evento corporativo BTLandia, copy grande sobre la foto.",
            "Slide 2: '¿Tu equipo ya tiene claros los objetivos del 2027?' Grid de 3 fotos de eventos internos (Kick Off, cierre de año, activación).",
            "Slide 3: 'Un equipo alineado desde el momento 0 genera resultados extraordinarios.' Visual de equipo compartiendo sobre foto de evento real.",
            "Slide 4: '18 años creando experiencias que hacen hablar. ¿Listos para el 2027? ¡Diseñemos la experiencia de tu evento!' Placa de cierre con logo BTLandia + @btlandia.",
          ],
          copyAnuncio: "¡El éxito de tu empresa en 2027 comienza ahora! 🚀\n\n🎯 ¿Tu equipo ya tiene claros los objetivos del año?\n🤝 Un equipo alineado desde el momento 0 genera resultados extraordinarios.\n🏆 18 años creando experiencias que hacen hablar.\n\n👉 ¡Diseñemos la experiencia de tu evento! Seguinos en @btlandia",
          pilar: "Interno (eventos para el equipo / cultura interna)", tema: "Kick Off / Objetivos 2027",
          formatoNarrativo: "Marca - Storytelling por slides",
          estructuraNarrativa: "Hook - Contenido - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          destinoUrls: ["https://www.instagram.com/btlandia/"],
          enRevision: false,
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
  competenciaAds: {
    marca: "Ostara 360",
    cuenta: "btlandia",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=111082821696831",
    formatos: [
      { id: "f01", tipo: "Carrusel Portfolio", dolor: "No sabe a quien contratar porque todas las agencias parecen iguales", solucion: "Mostrar portfolio con marcas reconocibles genera confianza instantanea (Ostara 360 y Magnetica usan este formato)" },
      { id: "f02", tipo: "Video Testimonial / Caso de Exito", dolor: "No confía en una agencia que no conoce: necesita prueba social", solucion: "Video con cliente real contando su experiencia genera credibilidad B2B (TIE Meetings y NINCH usan testimoniales)" },
      { id: "f03", tipo: "Reel BTS / Timelapse", dolor: "No puede imaginar como va a quedar el evento", solucion: "Timelapse de montaje muestra la escala de producción y genera aspiracion (InMotion y Magnetica publican BTS)" },
      { id: "f04", tipo: "Carrusel Educativo", dolor: "No sabe que incluye contratar una agencia de eventos ni cuanto cuesta", solucion: "Contenido educativo (que incluye, como funciona, que esperar) reduce la barrera de consulta" },
      { id: "f05", tipo: "Video Founder / Talking Head", dolor: "Las agencias parecen frias y corporativas, quiere trato humano", solucion: "La fundadora hablando directo a camara humaniza la marca y diferencia de agencias grandes (enfoque boutique)" },
      { id: "f06", tipo: "Imagen Evento Destacado", dolor: "Los eventos de su empresa quedan mediocres y sin impacto visual", solucion: "Foto hero de un evento de alto impacto (iluminacion, producción, escenografia) inspira al decision maker" },
    ],
    competidores: [
      // Directos
      { nombre: "Ostara 360", estado: "20 años, BTL + endomarketing, top 10 MICE Argentina", activo: true, instagramUrl: "https://www.instagram.com/ostara360/", avatarFile: "ostara360-avatar.jpg" },
      { nombre: "We Create", estado: "Agencia creativa de Ostara, brand experiences + activaciones", activo: true, instagramUrl: "https://www.instagram.com/wecreate_wa/", avatarFile: "wecreate-avatar.jpg" },
      { nombre: "TIE Meetings", estado: "17 años, experiencias multimedia para eventos corporativos", activo: true, instagramUrl: "https://www.instagram.com/tiemeetings/", avatarFile: "tiemeetings-avatar.jpg" },
      { nombre: "InMotion", estado: "Produccion integral, Argentina + Chile, eventos + activaciones", activo: true, instagramUrl: "https://www.instagram.com/inmotionproductora/", avatarFile: "inmotion-avatar.jpg" },
      { nombre: "Muti", estado: "Agencia de experiencias de marca, Argentina + Mexico", activo: true, instagramUrl: "https://www.instagram.com/mutisagencia/", avatarFile: "muti-avatar.jpg" },
      { nombre: "Magnetica", estado: "25 años, convenciones globales + producción audiovisual, 500+ profesionales", activo: true, instagramUrl: "https://www.instagram.com/magneticalatam", avatarFile: "magnetica-avatar.jpg" },
      // Indirectos (PR / comunicación / BTL)
      { nombre: "NINCH", estado: "12 años, PR + brand experience, Google/MeLi/Kimberly-Clark, oficinas ARG+MX", activo: true, instagramUrl: "https://www.instagram.com/ninaboreal/", avatarFile: "ninch-avatar.jpg" },
      { nombre: "Sunshine Lab", estado: "B Corp, agencia creativa sustentable, Natura/Adidas", activo: true, instagramUrl: "https://www.instagram.com/labsunshine/", avatarFile: "sunshinelab-avatar.jpg" },
      { nombre: "Black Out", estado: "Agencia de eventos y producción", activo: true, instagramUrl: "https://www.instagram.com/blackout.arg/", avatarFile: "blackout-avatar.jpg" },
    ],
    observacion: "Casi ninguno de los competidores directos e indirectos invierte en **posicionamiento pago en Instagram y Facebook** (salvo Ostara 360). Todos realizan **comunicación orgánica** orientada al branding y posicionamiento de marca, mostrando eventos, experiencias y producciones. Sus clientes son en su mayoría **empresas consolidadas**, similar al portfolio de BTLandia.\n\nEsto genera una **oportunidad clara**: al no existir competencia directa/indirecta buscando posicionarse en la plataforma, queda espacio para **generar presencia de forma más sencilla ante audiencias calificadas** sobre la existencia de BTLandia y la **oportunidad de la temporada alta**, tanto para **internos (equipo)** como para **externos (clientes)**.",
  },

  notas: "BTLandia es el segundo cliente de Foundation F2. Caso puro B2B: servicios de eventos corporativos para medianas empresas. A diferencia de Defu (B2C ecommerce), aca el funnel es WhatsApp > call de diagnóstico > propuesta.\n\nCeles (Celeste Policastro) es la fundadora y principal comercial. Cierra todas las ventas personalmente, lo cual es cuello de botella para escalar. Frany Attadia esta en proceso de incorporación al equipo para soportar la etapa de onboarding y primer contacto con leads.\n\nNicolas Blasotta es un consultor externo que asesora a Celes en estrategia de comunicación. Es necesario coordinar con el para alinear mensajes entre LinkedIn (gestionado por agencia externa hace 1.5+ años) y Meta/IG (gestionado por REE).\n\nEl producto de kick-off paquetizado para medianas empresas todavia no esta definido. Las campañas arrancan con portfolio general de BTLandia y se itera a medida que se valide el ICP y el mensaje. La estacionalidad es clave: octubre-diciembre es temporada alta de eventos corporativos (cierres de ano, kick-offs Q1). Hay que tener campañas activas antes de octubre.\n\nIntegracion CRM: USD 150 one-time incluido en el primer mes (total primer mes USD 650). Se recomienda HubSpot Free por integración nativa con Meta Ads.\n\nFuturo: evaluar agente de IA para clasificación automatica de leads entrantes por WhatsApp e Instagram DMs.",

  // Roadmap
  roadmap: [
    { nombre: "B2B Lead Gen (WhatsApp)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 4 },
      { nombre: "Launch", semanaInicio: 5, semanaFin: 6 },
      { nombre: "Scale", semanaInicio: 7, semanaFin: 8 },
    ]},
    { nombre: "Awareness (Instagram)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
      { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
    ]},
  ],

  // REE Metrics: enfoque leads B2B + awareness (BTLandia no tiene e-commerce)
  reeMetricsFeatures: [
    { titulo: "Dashboard", desc: "Campañas de Meta Ads y crecimiento de Instagram orgánico en una sola vista: alcance, visitas al perfil y seguidores de la campaña de awareness. Personalizable según requerimientos." },
    { titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por qué se escala o se frena cada anuncio (Kill/Scale) para que siempre sepas qué se hizo y por qué." },
    { titulo: "Leads B2B (WhatsApp)", desc: "Seguimiento de los leads que consultan por WhatsApp desde la campaña B2B: cantidad de conversaciones iniciadas y costo por lead (CPL)." },
  ],
  reeMetricsFuente: "WhatsApp",

  // Foundation Review presentation
  // Secciones bloqueadas: [] = todas visibles (agregar ids para bloquear: "foundation-campaign", "ree-metrics", "roadmap", "proximos-pasos")
  seccionesBloqueadas: [],
  proximosPasos: [
    {
      titulo: "Aprobaciones",
      responsable: "Celes + REE",
      tiempo: "Esta semana",
      items: [
        "Aprobar la campaña de Awareness → arrancamos a generar conciencia de BTLandia",
        "Aprobar los guiones y piezas creativas de B2B para comenzar a desarrollar",
        "Habilitar acceso a REE Metrics para visibilizar la tracción de la pauta de Awareness",
      ],
    },
    {
      titulo: "Producción + Setup B2B",
      responsable: "REE Creativos / REE Growth",
      tiempo: "Semana 3 en adelante",
      items: [
        "Producción de las piezas B2B aprobadas",
        "Armado de BTLandia_B2B_LeadGen en Meta Ads",
        "Activación del funnel B2B de WhatsApp",
      ],
    },
    {
      titulo: "Proyecto Paralelo: Agente de IA",
      responsable: "REE / BTLandia",
      tiempo: "Semana 3 en adelante",
      items: [
        "Del lado de BTLandia: definir el CRM a utilizar",
        "Avanzar en paralelo con el bot: agente de IA omnicanal que atiende y califica 24/7 los mensajes de WhatsApp e Instagram DMs",
        "El bot filtra los leads por canal: clientes potenciales al CRM, proveedores y hosts a planillas, con aviso al equipo comercial",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call" },
    { semana: 3, label: "Awareness + Review", fecha: "23/09" },
    { semana: 5, label: "Launch B2B + Review", fecha: "06/10" },
    { semana: 7, label: "Review Ads", fecha: "20/10" },
    { semana: 8, label: "Review Final", fecha: "30/10" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Propuesta + KO Call", desc: "Call del 02/09 con Celes: propuesta, kickoff y onboarding. Configuracion de Meta Ads, accesos, CRM. Se deja todo listo para empezar.", status: "done" },
    { semana: "S3", nombre: "Lanzamiento Awareness + Review Foundation", desc: "Martes 23/09. Lanzamiento de la campaña de Awareness + review del Foundation para comenzar a desarrollar las piezas y armar el funnel B2B. Catchup CRM / Producto KO.", status: "current", fecha: "23/09" },
    { semana: "S5", nombre: "Campaña B2B (WhatsApp)", desc: "Martes 06/10. Lanzamiento de la campaña B2B Lead Gen + Call ADS. Review de metricas de awareness. Activacion del funnel de WhatsApp.", status: "pending", fecha: "06/10" },
    { semana: "S7", nombre: "Review Ads", desc: "Martes 20/10. Seguimiento de campañas activas. Optimizaciones en base a datos, ajustes de audiencias.", status: "pending", fecha: "20/10" },
    { semana: "S8", nombre: "Review Final", desc: "Viernes 30/10. Revision del periodo completo (8 semanas). Resultados vs KPIs, aprendizajes, recomendaciones para el siguiente ciclo.", status: "pending", fecha: "30/10" },
  ],
};

// --- Generate 3 HTMLs (onboarding + foundation review + brief) ---

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
