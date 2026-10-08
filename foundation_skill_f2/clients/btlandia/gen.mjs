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
    fechaFin: "06/11",
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
      segmento: "Empresa de servicios al campo que quiere exponer en Expo Agro",
      descripcion: "Dueño/a o decisor comercial/marketing de una empresa radicada en las ciudades agro-ganaderas de la cuenca (Santa Fe, Córdoba, La Pampa, Entre Ríos, Buenos Aires) que vende productos y servicios al campo: maquinaria, semillas, agtech, drones, servicios. Quiere un stand en Expo Agro 2027 para llegar a su público objetivo, que está en el predio. La decisión es temporal: los stands se definen entre octubre y noviembre.",
      frase: "Quiero que mi marca esté en Expo Agro, pero no sé por dónde empezar",
      dolores: [
        "No sabe cómo llegar a tener un stand en Expo Agro: cómo se reserva el espacio, cuánto cuesta ni quién lo arma",
        "Sabe que Expo Agro es el evento de las grandes marcas y teme que su stand quede chico frente a ellas",
        "Su competencia ya está asegurando su lugar en Expo Agro 2027 y no estar es regalarle ese público",
        "Quiere posicionar su marca en Expo Agro 2027 con una experiencia que se destaque, no un stand más de esos que la gente pasa de largo",
      ],
      deseos: [
        "Un stand diseñado como experiencia de marca que atraiga al perfil correcto",
        "Un solo partner llave en mano, de la idea al stand funcionando",
        "Captar datos en la expo para el seguimiento comercial posterior",
        "Llegar a Expo Agro 2027 con todo resuelto y sin correr",
      ],
      objeciones: [
        "Ya tengo un constructor de stands de confianza, ¿qué suma una agencia?",
        "¿Conocen el agro o solo hacen eventos corporativos de ciudad?",
        "¿Cuánto más cuesta vs armar el stand por mi cuenta?",
      ],
      recurrencia: "media",
      badge: "Demanda activa · Expo Agro 2027",
      ejemplosMarcas: [
        {
          marca: "Fabricante de maquinaria, semillera, agtech o servicios al campo",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Dueño/a, Gerente Comercial o Gerente de Marketing",
          caso: "Empresa con planta en ciudades como Río Cuarto, Venado Tuerto, Rafaela o Pergamino. Su público objetivo decide en Expo Agro: quiere un stand que convierta el tráfico del predio en leads y recordación de marca, en vez de cuatro paredes con un logo.",
        },
      ],
    },
    {
      segmento: "Mediana y gran empresa que ya hace eventos y entiende su valor",
      descripcion: "Empresa de 100-500+ empleados que ya organiza eventos corporativos, tanto internos para su equipo (convenciones de ventas, kick-offs anuales, viajes de incentivo) como externos para sus clientes (activaciones, lanzamientos, brand experience). El decisor —Director/a de Marketing, Gerente Comercial o Director/a de RRHH— ya sabe que un evento profesional impacta en los resultados del negocio. Puede haber resuelto algunos eventos a pulmón con proveedores sueltos, e incluye a quien ya contrató una agencia que falló y hoy desconfía de volver a delegar.",
      frase: "Quiero llevar los eventos de mi empresa al siguiente nivel",
      dolores: [
        "Resuelve los eventos con proveedores sueltos y el resultado queda por debajo del nivel de su marca",
        "Ya contrató una agencia que le falló y hoy está sesgado a delegar en un tercero",
        "Una falla en un viaje de incentivo o una convención le cuesta relaciones con su equipo y sus clientes",
        "Coordinar proveedores consume tiempo interno y no hay un estándar de calidad garantizado",
      ],
      deseos: [
        "Un partner con estándares de calidad no negociables, cuidados minuto a minuto durante el evento",
        "Una producción a la altura de su marca, tanto en el evento como en lo que después se publica",
        "Un socio de largo plazo que conozca su industria y no arranque de cero en cada evento",
        "Ahorrar tiempo de coordinación sin perder el control creativo",
      ],
      objeciones: [
        "Ya tuvimos una mala experiencia con una agencia, ¿por qué esta sería distinta?",
        "El portfolio de BTLandia es de corporaciones grandes, no se si aplica a nosotros",
        "No quiero perder el control creativo del evento",
        "Cuanto mas cuesta vs lo que ya gastamos internamente?",
      ],
      recurrencia: "media",
      badge: "Demanda activa",
      ejemplosMarcas: [
        {
          marca: "Laboratorio, agroindustria o multinacional",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Director/a de Marketing, Gerente Comercial o Director/a de RRHH",
          caso: "Empresa que ya organiza su convención de ventas, el kick-off anual o el viaje de incentivo para su red. Conoce el impacto de estos eventos en los resultados del negocio y busca un partner que ejecute a la altura de su marca, sin fallas que le cuesten relaciones con su equipo o sus clientes.",
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
      {
        nombre: "Expo Agro: tu marca puede estar ahí",
        dolorQueResuelve: "No sabe cómo llegar a tener un stand en Expo Agro ni por dónde empezar, o teme que su stand quede chico frente a las grandes marcas",
        mensajeClave: "BTLandia te lleva a Expo Agro 2027 de punta a punta con un stand a la altura de las grandes marcas: en el agro desde 2003",
        formato: "2 Videos + 2 Carruseles",
      },
    ],
    piezasPorIcp: [
      {
        icp: "Empresa de servicios al campo que quiere exponer en Expo Agro",
        piezas: [
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Quiere que su marca esté en Expo Agro pero no sabe por dónde empezar: cómo se reserva el espacio, cuánto cuesta ni quién arma el stand.",
            solucion: "BTLandia resuelve el camino completo: hace stands en Expo Agro desde 2003 y acompaña a la marca desde la reserva del espacio hasta el stand funcionando. Tono de los videos de awareness de BTLandia.",
            comunicacion: "[0-4s] HOOK — Toma aérea del predio de Expo Agro colmado, inserts de maquinaria y marcas, texto overlay EXPO AGRO 2027. Voz en off: 'Se viene el evento más importante del 2027, Expo Agro.' [4-10s] BODY — Puros insights y animaciones del evento, cifras en motion graphics (visitantes, marcas presentes, hectáreas del predio), preguntas animadas en overlay (cómo se reserva, cuánto cuesta, quién lo arma). Voz en off: 'Si querés que tu marca esté ahí... pero no sabés por dónde empezar...' [10-17s] BODY — Corte a stands de BTLandia en expos del agro intercalados con planos de drones, maquinarias, semillas y productos que se comercializan en el campo, del boceto al montaje y al stand funcionando con gente. Voz en off: 'En BTLandia hacemos stands en Expo Agro desde el 2003 y te acompañamos desde el inicio hasta el final del evento.' [17-21s] CTA — Placa con texto grande y botón de WhatsApp. Voz en off: '¿Buscás posicionarte en uno de los eventos más importantes de este 2027?... contactanos que te ayudamos.' [21-24s] CIERRE — Motion graphics con logo BTLandia. Voz en off: 'Si hay detalle, está BTLandia.'",
            hook: "Se viene el evento más importante del 2027, Expo Agro.",
            body: "Si querés que tu marca esté ahí... pero no sabés por dónde empezar... En BTLandia hacemos stands en Expo Agro desde el 2003 y te acompañamos desde el inicio hasta el final del evento.",
            cta: "¿Buscás posicionarte en uno de los eventos más importantes de este 2027?... contactanos que te ayudamos. Si hay detalle, está BTLandia.",
            copyAnuncio: "Se viene el evento más importante del 2027, Expo Agro 🌾\n\n🤔 ¿Querés que tu marca esté ahí pero no sabés por dónde empezar?\n✅ Hacemos stands en Expo Agro desde el 2003.\n🤝 Te acompañamos desde el inicio hasta el final del evento.\n\n👉 ¿Buscás posicionarte en uno de los eventos más importantes de este 2027? Escribinos por WhatsApp.\n\nSi hay detalle, está BTLandia.",
            pilar: "Externo (presencia de marca en expos)", tema: "Expo Agro / El evento más importante del 2027",
            formatoNarrativo: "Montage - Highlights de eventos con voz en off",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "20-25s",
            enRevision: false,
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Sabe que Expo Agro es el evento de las grandes marcas y teme que su stand quede chico frente a ellas: estar mal presentado es peor que no estar.",
            solucion: "Stands a la altura de las grandes marcas: BTLandia define junto a la empresa el espacio, el diseño y el presupuesto. Tono de los videos de awareness de BTLandia.",
            comunicacion: "[0-4s] HOOK — Inserts de maquinaria, semillas, drones y tecnología del agro, corte a productores recorriendo stands en Expo Agro. Voz en off: '¿Tu empresa se dedica al rubro Agro? Entonces tu público te espera en Expo Agro 2027.' [4-9s] BODY — Travelling por stands de gran producción de las marcas líderes del agro. Voz en off: 'Expo Agro es el evento de las grandes marcas... y para estar ahí, tu stand tiene que estar a la altura.' [9-17s] BODY — Corte a stands de BTLandia, boceto y reunión de equipo, montaje y stand funcionando con gente. Voz en off: 'En BTLandia diseñamos stands a la altura de las grandes marcas. Definimos juntos el espacio, el diseño y el presupuesto.' [17-21s] CTA — Placa con texto grande y botón de WhatsApp sobre clip del stand activo. Voz en off: '¿Querés diseñar la experiencia de tu marca en Expo Agro 2027?... contactanos que te ayudamos.' [21-24s] CIERRE — Motion graphics con logo BTLandia. Voz en off: 'Si hay detalle, está BTLandia.'",
            hook: "¿Tu empresa se dedica al rubro Agro? Entonces tu público te espera en Expo Agro 2027.",
            body: "Expo Agro es el evento de las grandes marcas... y para estar ahí, tu stand tiene que estar a la altura. En BTLandia diseñamos stands a la altura de las grandes marcas: definimos juntos el espacio, el diseño y el presupuesto.",
            cta: "¿Querés diseñar la experiencia de tu marca en Expo Agro 2027?... contactanos que te ayudamos. Si hay detalle, está BTLandia.",
            copyAnuncio: "¿Tu empresa se dedica al rubro Agro? 🌾\n\n👥 Tu público te espera en Expo Agro 2027.\n🏆 Es el evento de las grandes marcas... y para estar ahí, tu stand tiene que estar a la altura.\n📐 Definimos juntos el espacio, el diseño y el presupuesto.\n\n👉 ¿Querés diseñar la experiencia de tu marca en Expo Agro 2027? Escribinos por WhatsApp.\n\nSi hay detalle, está BTLandia.",
            pilar: "Externo (producción llave en mano)", tema: "Expo Agro / Un stand a la altura de las grandes marcas",
            formatoNarrativo: "Montage - Behind the scenes con voz en off",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Video", tono: "Mixed", estilo: "Lifestyle" },
            duracion: "20-25s",
            enRevision: false,
          },
          {
            formato: "Carrusel (1080x1080)",
            dolor: "Quiere posicionar su marca en Expo Agro 2027 con una experiencia que se destaque, no un stand más de esos que la gente pasa de largo.",
            solucion: "BTLandia diseña experiencias únicas desde el 2003: espacio, diseño, producción y activación de punta a punta para posicionar la marca en Expo Agro 2027.",
            comunicacion: "Carrusel x3 slides enfocado en posicionar la marca en Expo Agro 2027 con la experiencia de BTLandia desde el 2003. Fotos reales de stands y producciones de BTLandia + placas de copy. Todas las slides llevan badge superior con la fecha del evento ('EXPO AGRO · MARZO 2027') + ícono de reloj ⏱ (urgencia de reserva).",
            mensajes: [
              "Slide 1: 'POSICIONÁ TU MARCA EN EXPO AGRO 2027' Visual hero de stand de gran producción con el predio colmado de fondo. Badge 'EXPO AGRO · MARZO 2027' + ícono de reloj ⏱.",
              "Slide 2: 'DESDE EL 2003 DISEÑANDO EXPERIENCIAS ÚNICAS. Stands, activaciones y eventos para que tu marca no pase desapercibida.' Grid de fotos reales de stands y producciones de BTLandia.",
              "Slide 3: '¿Te interesa un stand en Expo Agro 2027? Solicitá tu presupuesto por WhatsApp. Si hay detalle, está BTLandia.' Placa de cierre con logo BTLandia.",
            ],
            copyAnuncio: "Posicioná tu marca en Expo Agro 2027 🌾\n\n🏆 Desde el 2003 diseñando experiencias únicas en stands, activaciones y eventos.\n📐 Espacio, diseño, producción y activación de punta a punta.\n\n👉 ¿Te interesa un stand en Expo Agro 2027? Solicitá tu presupuesto por WhatsApp.\n\nSi hay detalle, está BTLandia.",
            pilar: "Externo (presencia de marca en expos)", tema: "Expo Agro / Posicioná tu marca con una experiencia única",
            formatoNarrativo: "Marca - Storytelling por slides",
            estructuraNarrativa: "Hook - Contenido - Acción",
            tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Lifestyle" },
            enRevision: false,
          },
          {
            formato: "Carrusel (1080x1080)",
            dolor: "Su competencia ya está asegurando su lugar en Expo Agro 2027: no estar frente a todo el agro es regalarle ese público.",
            solucion: "Asegurar la presencia de la marca hoy: BTLandia reserva el espacio y diseña el stand de punta a punta, en el agro desde el 2003.",
            comunicacion: "Carrusel x3 slides enfocado en la presencia de marca + venta del servicio llave en mano de BTLandia. Fotos reales del predio y stands de BTLandia + placas de copy. Todas las slides llevan badge superior con la fecha del evento ('EXPO AGRO · MARZO 2027') + ícono de reloj ⏱ (urgencia de reserva).",
            mensajes: [
              "Slide 1: 'TU MARCA TIENE QUE ESTAR EN EXPO AGRO 2027' Visual hero del predio colmado, maquinaria y marcas del agro. Badge 'EXPO AGRO · MARZO 2027' + ícono de reloj ⏱.",
              "Slide 2: Grid de tres bloques sobre fotos reales de producciones BTLandia. Bloque 1: 'DISEÑO a medida de tu marca'. Bloque 2: 'PRODUCCIÓN y montaje llave en mano'. Bloque 3: 'ACTIVACIÓN y acompañamiento durante todo el evento'.",
              "Slide 3: '¿Querés asegurar tu presencia en Expo Agro 2027? Solicitá tu presupuesto por WhatsApp. Si hay detalle, está BTLandia.' Placa de cierre con logo BTLandia.",
            ],
            copyAnuncio: "Tu marca tiene que estar en Expo Agro 2027 🌾\n\n📐 Diseño a medida de tu marca.\n🏗️ Producción y montaje llave en mano.\n🤝 Activación y acompañamiento durante todo el evento.\n\n👉 ¿Querés asegurar tu presencia en Expo Agro 2027? Solicitá tu presupuesto por WhatsApp.\n\nSi hay detalle, está BTLandia.",
            pilar: "Externo (presencia de marca en expos)", tema: "Expo Agro / Tu marca tiene que estar",
            formatoNarrativo: "Marca - Storytelling por slides",
            estructuraNarrativa: "Afirmación - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Cinematic", estilo: "Lifestyle" },
            enRevision: false,
          },
        ],
      },
    ],
    formatos: ["Video Comercial Vertical (9:16)", "Carrusel (1080x1080)"],
    tono: null,
    resumenPiezas: "4 piezas Expo Agro en revisión (ICP 1)",
    notaPiezas: "Repriorización call 30/09: <b>Expo Agro se adelanta como segunda campaña</b> y el producto Kickoff pasa a <b>fin de noviembre</b> (cierres de año). Las 4 piezas apuntan a <b>empresas del agro que no saben cómo llegar a tener un stand en Expo Agro 2027</b>; los videos siguen el <b>tono de los guiones de awareness</b> (cierre \"Si hay detalle, está BTLandia\"). <b>Pendiente de aprobación de Celes antes de producir</b>: no se produce nada hasta su OK. Pendiente además: <b>lista de 15-20 ciudades agro-ganaderas</b> para cerrar la segmentación.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_btlandia_meta_leadgen_expoagro",
      "ree_btlandia_meta_leadgen_expertise",
      "ree_btlandia_meta_awareness_bts",
    ],
  },

  arquitectura: [
    {
      nombre: "BTLandia_B2B_ExpoAgro",
      objetivo: "Clientes potenciales",
      tituloSeccion: "Campaña B2B Expo Agro (WhatsApp)",
      tituloSubseccion: `Campaña Expo Agro en Meta Ads<span style="display:inline-block;font-family:'IBM Plex Mono', 'Courier New', monospace;font-size:10px;font-weight:600;padding:2px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;margin-left:8px;vertical-align:middle;letter-spacing:0.5px;text-transform:uppercase">En Revision</span>`,
      status: "en-desarrollo",
      destino: "WhatsApp Business de BTLandia",
      conversionCampana: "Clientes potenciales vía WhatsApp",
      descripcionCampana: "Generar <b>leads calificados vía WhatsApp</b> de <b>empresas radicadas en las ciudades agro-ganaderas</b> que venden productos y servicios al campo (maquinaria, semillas, agtech, drones, servicios) y <b>quieren un stand en Expo Agro 2027 para llegar a ese público</b>. El decisor es el dueño o responsable comercial/marketing de esas empresas, no el visitante de la expo. La temporalidad es clave: los stands se definen entre octubre y noviembre, por eso esta campaña se adelanta y el producto Kickoff pasa a fin de noviembre (repriorización call 30/09). BTLandia produce para el sector desde 2003.",
      kpisCampana: ["Cantidad de Conversaciones (leads que entran)", "CPL (costo por lead)", "CTR (interés que genera el anuncio)"],
      presupuestoCampana: { diario: "USD $11.6/día (≈ ARS $17.900)", mensual: "USD $350/mes (≈ ARS $539.000)" },
      notaCampana: "Producto a comunicar: stands y activaciones para Expo Agro 2027. Pendiente de Celes: lista de 15-20 ciudades agro-ganaderas (donde hay plantas y marcas del sector) para cerrar la segmentación geográfica.",
      adSets: [
        {
          nombre: "Conjunto_Decisores_Agro",
          segmentacion: "30-55 años. Geo: ciudades agro-ganaderas de la cuenca — Santa Fe, Córdoba, La Pampa, Entre Ríos y Buenos Aires (Río Cuarto, Venado Tuerto, Rafaela, Gualeguay, Chacabuco, Pergamino, Suipacha; lista final de 15-20 ciudades pendiente de Celes). No capitales: el objetivo son las empresas con plantas en esas ciudades, no el visitante de la expo. Cargos: Director de Marketing, Gerente de Marketing, Gerente Comercial, Brand Manager. Tamaño de empresa: 101-500 empleados, más de 500 empleados. Intereses: agronegocios, maquinaria agrícola, Expoagro",
          ads: [
            "Anuncio_Video_EventoMasImportante_V1 | Se viene el evento más importante del 2027, Expo Agro — si no sabés por dónde empezar, te acompañamos desde el inicio hasta el final del evento",
            "Anuncio_Video_AlturaGrandesMarcas_V1 | ¿Tu empresa se dedica al rubro Agro? Expo Agro es el evento de las grandes marcas — tu stand tiene que estar a la altura, de punta a punta",
            "Anuncio_Carrusel_PosicionaTuMarca_V1 | Posicioná tu marca en Expo Agro 2027 — desde el 2003 diseñando experiencias únicas, solicitá tu presupuesto",
            "Anuncio_Carrusel_TuMarcaTieneQueEstar_V1 | Tu marca tiene que estar en Expo Agro 2027 — diseño, producción y activación de punta a punta, solicitá tu presupuesto",
          ],
        },
      ],
    },
    {
      nombre: "BTLandia_Awareness",
      objetivo: "Awareness",
      descripcionCampana: "Dar <b>visibilidad de BTLandia como marca</b> y generar <b>conciencia en la mediana y gran empresa</b> sobre la importancia de la <b>brand experience</b>, tanto para usuarios internos y externos (empleados, proveedores) como para clientes. La <b>temporada de verano</b> es clave: las marcas buscan generar incentivos y alinear objetivos. Esta campaña sienta las bases para luego empujar la <b>campaña B2B con foco en conversión</b>.",
      status: "activa",
      destino: "Perfil de Instagram (@btlandia)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Seguidores"],
      presupuestoCampana: { diario: "USD $5/día (≈ ARS $7.700)", mensual: "USD $150/mes (≈ ARS $231.000)" },
      bannerPiezas: "8 piezas activas desde el 24/09.",
      adSets: [
        {
          nombre: "Conjunto_General_CABA_GBA",
          segmentacion: "30-55 años, Buenos Aires (+32 km) + Ciudad Autónoma de Buenos Aires. Puestos: Marketing Director, Sales Director, Head of Sales, Director of HR, Head of Human Resources, Human Resources Manager (HR Manager). Tamaño de empresa: 101-500 empleados, más de 500 empleados. Intereses: Gestión de eventos. Modo: Audiencia de Advantage+ (la segmentación funciona como sugerencia; Meta puede expandirla si detecta mejores resultados). Nota: Ajustes post-review 23/09: se sumaron roles de marketing y comercial, se quitó event planner y empresas de menos de 100 empleados · Las piezas de verano se mantienen en el mismo conjunto, filtradas por tamaño de empresa (mediana/grande).",
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

  notas: "BTLandia es el segundo cliente de Foundation F2. Caso puro B2B: servicios de eventos corporativos para medianas empresas. A diferencia de Defu (B2C ecommerce), aca el funnel es WhatsApp > call de diagnóstico > propuesta.\n\nCeles (Celeste Policastro) es la fundadora y principal comercial. Cierra todas las ventas personalmente, lo cual es cuello de botella para escalar. Frany Attadia esta en proceso de incorporación al equipo para soportar la etapa de onboarding y primer contacto con leads.\n\nNicolas Blasotta es un consultor externo que asesora a Celes en estrategia de comunicación. Es necesario coordinar con el para alinear mensajes entre LinkedIn (gestionado por agencia externa hace 1.5+ años) y Meta/IG (gestionado por REE).\n\nEl producto de kick-off paquetizado para medianas empresas todavia no esta definido. Las campañas arrancan con portfolio general de BTLandia y se itera a medida que se valide el ICP y el mensaje. La estacionalidad es clave: octubre-diciembre es temporada alta de eventos corporativos (cierres de ano, kick-offs Q1). Hay que tener campañas activas antes de octubre.\n\nCall 30/09 (Setup CRM): se repriorizó el orden de salida. Expo Agro se adelanta como segunda campaña — los stands se definen entre octubre y noviembre y Celes ya cotiza 4 stands — y el producto Kickoff pasa a fin de noviembre, cuando las empresas tienen los cierres de año mas cocinados. HubSpot se da de alta con info@btlandia.com.ar (genérico, evita depender de una persona); una vez listo se lanza el bot con Marce.\n\nIntegracion CRM: USD 150 one-time incluido en el primer mes (total primer mes USD 650). Se recomienda HubSpot Free por integración nativa con Meta Ads.\n\nFuturo: evaluar agente de IA para clasificación automatica de leads entrantes por WhatsApp e Instagram DMs.",

  // Roadmap
  roadmap: [
    { nombre: "B2B Expo Agro (WhatsApp)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 5 },
      { nombre: "Launch", semanaInicio: 6, semanaFin: 7 },
      { nombre: "Scale", semanaInicio: 8, semanaFin: 8 },
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
      titulo: "Pendientes de Celes",
      responsable: "Celes",
      tiempo: "Esta semana",
      items: [
        "Revisar las 4 piezas Expo Agro (guiones y copys) y aprobar los cambios para habilitar la producción",
        "Pasar la lista de 15-20 ciudades agro-ganaderas (donde hay plantas y marcas del sector) para cerrar la segmentación de Expo Agro",
      ],
    },
    {
      titulo: "Pendientes de REE",
      responsable: "REE Growth",
      tiempo: "Esta semana",
      items: [
        "Awareness activa desde el 24/09 (+40 seguidores con ARS 35.000 invertidos): review de la semana, identificar pieza ganadora y optimizar",
        "Bajada creativa de Expo Agro al equipo (Sergi + creativos) y producción de las 4 piezas una vez aprobadas",
        "Handoff del CRM a Celes: call de flujo de trabajo con HubSpot ya configurado",
        "Enviar recap de la call + link de este documento",
      ],
    },
    {
      titulo: "Proyecto Paralelo: Agente de IA",
      responsable: "REE / BTLandia",
      tiempo: "Semana 3 en adelante",
      items: [
        "Gestión del proyecto a cargo de Marcelo",
        "CRM definido: HubSpot Free con info@btlandia.com.ar (REE lo da de alta y configura)",
        "Avanzar en paralelo con el bot: agente de IA omnicanal que atiende y califica 24/7 los mensajes de WhatsApp e Instagram DMs",
        "El bot filtra los leads por canal: clientes potenciales al CRM, proveedores y hosts a planillas, con aviso al equipo comercial",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call" },
    { semana: 3, label: "Awareness + Review", fecha: "23/09" },
    { semana: 6, label: "Launch Expo Agro + Review", fecha: "13/10" },
    { semana: 8, label: "Review Ads + Final", fecha: "27/10 · 06/11" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Propuesta + KO Call", desc: "Call del 02/09 con Celes: propuesta, kickoff y onboarding. Configuracion de Meta Ads, accesos, CRM. Se deja todo listo para empezar.", status: "done" },
    { semana: "S3", nombre: "Lanzamiento Awareness + Review Foundation", desc: "Martes 23/09. Review del Foundation con Celes: ajustes de audiencia, ICP y piezas. La campaña de Awareness se lanzó el 24/09 con la audiencia ajustada. Catchup CRM / Producto Kickoff.", status: "done", fecha: "23/09" },
    { semana: "S4", nombre: "Setup CRM + Cambio de orden de campañas", desc: "Martes 30/09. Intro a HubSpot (productos, empresas, contactos, negocios); se da de alta con info@btlandia.com.ar. Repriorización de campañas: Expo Agro se adelanta como segunda salida y el producto Kickoff pasa a fin de noviembre. Celes pasa lista de ciudades agro-ganaderas para la segmentación.", status: "done", fecha: "30/09" },
    { semana: "S6", nombre: "Campaña B2B Expo Agro (WhatsApp)", desc: "Martes 13/10. Lanzamiento de la campaña B2B Expo Agro + Call ADS. Segmentación por ciudades agro-ganaderas de la cuenca, marcas de maquinaria, semillas, agtech y drones. Review de 3 semanas de awareness: pieza ganadora, redistribución de presupuesto y chequeo de que la audiencia que trae Meta sea del perfil decisor. La campaña de Awareness se divide por formatos para empujar más lo audiovisual. Activacion del funnel de WhatsApp.", status: "pending", fecha: "13/10" },
    { semana: "S8", nombre: "Review Ads", desc: "Martes 27/10. Seguimiento de campañas activas. Optimizaciones en base a datos, ajustes de audiencias.", status: "pending", fecha: "27/10" },
    { semana: "S9", nombre: "Review Final", desc: "Viernes 06/11. Revision del ciclo completo. Resultados vs KPIs, aprendizajes, recomendaciones para el siguiente ciclo.", status: "pending", fecha: "06/11" },
    { semana: "NOV", nombre: "Campaña Producto Kickoff", desc: "Fin de noviembre. Salida del producto Kickoff paquetizado para mediana empresa, alineada a los cierres de año (kick-offs Q1 ya definidos en los presupuestos). Posterior a Expo Agro vienen los lanzamientos de campaña (marzo-abril) y congresos.", status: "pending", fecha: null },
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
