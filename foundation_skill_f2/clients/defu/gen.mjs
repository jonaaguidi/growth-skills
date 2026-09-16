import { renderOnboardingHtml } from "../../dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { renderBriefHtml } from "../../dist/lib/brief-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const data = {
  clientInfo: {
    nombreEmpresa: "Defu — The Tofu Co.",
    slug: "defu",
    nombreContacto: "Angel",
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
    campanasVendidas: ["Awareness de Marca", "Funnel B2C (Ecommerce)"],
    duracionProyecto: "8 semanas",
    fechaInicio: null,
    fechaFin: null,
    fechaInicioISO: "2026-08-25",
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
        instrucciones: "Defu no tiene vehiculo propio actualmente. Dependen de Uber y fletes. Esto impacta el costo por envio y el margen neto B2C. Al definir combos y minimo de compra para envio, considerar que el costo de envio puede ser alto. Validar con Angel el costo promedio por envio.",
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
    accesoPlataforma: null,
    tracking: null,
  },

  koCall: {
    fechaPropuesta: null,
    duracionTotal: "45 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Intro: que vamos a configurar hoy", output: "Contexto alineado" },
      { nombre: "Onboarding Meta", duracion: "25 min", objetivo: "Setup completo de Meta (Page, Portfolio, Ad Account, IG, permisos, tarjeta)", output: "Cuenta publicitaria lista" },
      { nombre: "Accesos", duracion: "10 min", objetivo: "Obtener credenciales de plataforma e-commerce", output: "Acceso a Tienda Nube" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Proximos pasos + agendar Foundation Review", output: "Foundation Review agendada" },
    ],
    flujoTemas: [
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
    proximaReunion: null,
  },

  // B. Estrategia
  palanca: {
    nombre: "Captacion",
    justificacion: "Defu no tiene presencia en pauta digital. El competidor principal (Soyana) tiene 70 anuncios activos. La prioridad es generar awareness y activar el canal B2C (e-commerce) para explotar el 30-40% de capacidad de produccion ociosa. La marca tiene un diferencial fuerte (unico artesanal con habilitacion) que no esta siendo comunicado. Captacion es la palanca correcta: primero que te conozcan, despues convertir.",
  },

  icp: [
    {
      segmento: "Vegano / Veggie",
      descripcion: "Persona de 25-45 años en Buenos Aires que sigue una dieta vegana o vegetariana. El tofu es parte de su alimentacion diaria, no un producto ocasional. Busca un proveedor confiable para recompra quincenal o mensual.",
      frase: "Necesito tofu artesanal de verdad, no el industrial del supermercado",
      dolores: [
        "No encuentra tofu de calidad en supermercados (solo Soyana industrial)",
        "El tofu del super no tiene sabor ni buena textura, parece goma",
        "Las opciones de tofu son escasas",
        "No confia en la cadena de frio ni en el proceso de produccion industrial",
      ],
      deseos: [
        "Tener un proveedor confiable de tofu artesanal fresco para recompra regular",
        "Acceso facil por e-commerce con delivery en el dia",
        "Variedad de tofu (firme, sedoso, especiado, frito)",
        "Saber que el producto es artesanal, local y con habilitacion sanitaria",
        "Poder stockearme con combos de forma simple y rapida",
      ],
      objeciones: [
        "El producto fresco dura pocos dias",
        "No sabia que existia tofu artesanal en Buenos Aires",
        "Necesito otros productos para saborizar mi tofu",
      ],
      prioridad: "primario",
      recurrencia: "alta",
    },
    {
      segmento: "Alimentacion Saludable",
      descripcion: "Persona de 25-45 años que busca comer sano con productos naturales, artesanales y locales. Incorpora tofu como parte de una dieta equilibrada, no como base diaria. Compra con menor frecuencia pero aun asi es recurrente su compra si el producto es de su agrado.",
      frase: "Quiero comer mejor sin resignar sabor, con productos reales",
      dolores: [
        "Los productos 'saludables' del supermercado son ultraprocesados disfrazados",
        "No sabe donde comprar tofu de calidad cerca",
        "Quiere incorporar tofu pero no sabe como cocinarlo o que variedad elegir",
        "Le cuesta armar una dieta variada sin caer siempre en los mismos productos",
      ],
      deseos: [
        "Sumar tofu de calidad sin dejar de comer rico",
        "Descubrir recetas y formas nuevas de cocinar con tofu",
        "Comprar directo al productor con garantia de frescura",
        "Recibir el producto en su casa sin ir al Barrio Chino",
        "Poder stockearme con combos de forma simple y rapida",
      ],
      objeciones: [
        "No se como cocinar tofu, me queda feo",
        "No conozco la marca",
        "Necesito otros productos para saborizar mi tofu",
      ],
      prioridad: "primario",
      recurrencia: "media",
    },
    {
      segmento: "Foodie / Comida China",
      descripcion: "Persona de 25-45 años apasionada por la cocina asiatica, que quiere hacer comida china autentica en casa. Consumidor ocasional: compra para una receta o evento especifico, no como habito semanal.",
      frase: "Quiero hacer gyozas caseras como en un restaurante chino de verdad",
      dolores: [
        "No consigue ingredientes asiaticos de calidad fuera del Barrio Chino",
        "Las masas para gyozas y arrolladitos del supermercado son genericas",
        "Cocinar comida china casera requiere ingredientes que no son faciles de encontrar",
        "Los restaurantes chinos autenticos son pocos y caros para comer seguido",
      ],
      deseos: [
        "Hacer gyozas, arrolladitos primavera y tofu casero con ingredientes autenticos",
        "Tener todos los ingredientes en un solo pedido con delivery",
        "Descubrir productos nuevos (tofu bacon, tofu frito, tofu especiado)",
        "Comprar de una familia china-argentina que sabe hacer tofu de verdad",
      ],
      objeciones: [
        "Ya compro en el Barrio Chino cuando necesito",
        "No se si el delivery llega a mi zona",
        "Nunca compre comida por e-commerce",
      ],
      prioridad: "secundario",
      recurrencia: "baja",
    },
  ],

  propuestaDeValor: {
    descripcion: "Tofu artesanal fresco, elaborado todos los dias por una familia china-argentina en Buenos Aires. Mas de 20 productos: tofu (11 variedades), masas para gyozas, wantan y arrolladitos primavera. Envio en el dia. Unico productor artesanal con habilitacion sanitaria completa.",
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
    { nombre: "CAC (costo adquisicion cliente)", objetivo: "$25,000 ARS", fuente: "Meta Ads + Tienda Nube" },
    { nombre: "LTV (lifetime value)", objetivo: "$160,000+ ARS (4+ compras)", fuente: "Tienda Nube" },
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
    // 3 videos compartidos (mismos angulos para ambos ICPs)
    // Se repiten en cada grupo porque el brief se organiza por ICP
    piezasPorIcp: [
      {
        icp: "Vegano / Veggie",
        piezas: [
          
          // --- 3 VIDEOS (angulos compartidos, ya producidos) ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "El tofu es feo, sin sabor y de mala calidad — la experiencia generica del super",
            solucion: "Combo Degustacion de Tofu Completo: variedades de tofu artesanal fresco elaborado con soja agroecologica. Cada uno con su sabor y textura propia.",
            comunicacion: "[0-3s] HOOK — Angel plano medio, directo a camara, fondo limpio: 'Si pensas que el tofu es feo y no tiene sabor...' [3-5s] Camara baja revelando el Combo Degustacion desplegado debajo de Angel: '...es porque nunca probaste tofu artesanal.' [5-10s] BODY — Angel senala los productos, close-ups de cada variedad, texturas y colores: 'Este es el Combo Degustacion de Defu: distintas variedades de tofu artesanal fresco...' [10-15s] BODY — Inserts rapidos, corte de tofu mostrando interior, variedad visual del combo completo: '...elaborado con soja agroecologica. Cada uno con su sabor y textura propia.' [15-19s] CTA — Angel cierra mirando a camara, gesto de invitacion. Badge en edicion, Envio en el dia CABA: 'Entra a defu.com.ar, hace tu pedido y te lo enviamos en el dia.' [19-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Si pensas que el tofu es feo y no tiene sabor, es porque nunca probaste tofu artesanal.",
            body: "Este es el Combo Degustacion de Defu: distintas variedades de tofu artesanal fresco, elaborado con soja agroecologica. Cada uno con su sabor y textura propia.",
            cta: "Entra a defu.com.ar, hace tu pedido y te lo enviamos en el dia.",
            pilar: "Producto",
            tema: "Calidad artesanal vs experiencia generica",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/productos/combo-degustacion-de-tofu-completo-3o7l4/"],
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Come mal porque no sabe como cocinar rico y sano a la vez — sin ideas, sin variedad, sin ingredientes listos",
            solucion: "Combos Restock de tofu artesanal para todo el mes. Sumalo a ensaladas, salteados, tacos, frito — come rico y sano todos los dias.",
            comunicacion: "[0-3s] HOOK — Angel en cocina, plano medio directo a camara. Fondo limpio, sin productos a la vista: 'Estas cansado de no saber que cocinar?' [3-7s] BODY — Angel presenta los combos Restock. El pack de tofu comun x6, el pack de tofu duro x6 y el combo saborizado surtido x9 entran a cuadro, los acomoda sobre la mesada mostrando la variedad de productos, colores y contrastes entre variedades: 'Con nuestros combos Restock tenes tofu artesanal para todo el mes.' [7-13s] BODY — Montaje rapido, corte a tofu en ensalada, salteado con verduras en sarten, armando tacos, tofu frito dorado. Cada plato 1.5s: 'Sumalo a ensaladas, salteados, tacos, frito... come rico y sano todos los dias.' [13-18s] CTA — Angel vuelve a camara, gesto de invitacion. Combos Restock visibles en mesada detras. Badge en edicion, Envio en el dia CABA: 'Pedi tu combo en la tienda online y te lo enviamos en el dia a tu casa.' [18-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Estas cansado de no saber que cocinar?",
            body: "Con nuestros combos Restock tenes tofu artesanal para todo el mes. Sumalo a ensaladas, salteados, tacos, frito... come rico y sano todos los dias.",
            cta: "Pedi tu combo en la tienda online y te lo enviamos en el dia a tu casa.",
            pilar: "Producto",
            tema: "Organizacion y planificacion alimentaria",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Consume proteina vegetal de mala calidad, ultraprocesada y con aditivos — no sabe que hay algo mejor",
            solucion: "Packs de tofu artesanal nutritivo de Defu en x3, x6 y x9 unidades. Distintas variedades para elegir: comun, duro, saborizados. Elaborado con soja agroecologica, agua y nigari.",
            comunicacion: "[0-3s] HOOK — Angel plano medio, directo a camara, fondo limpio: 'Si queres comer sano de verdad, empeza por la proteina vegetal de calidad.' [3-8s] BODY — Inserts cinematicos de los packs sobre mesada, pack de tofu comun x6, pack de tofu duro x6 y combo saborizado surtido x9. Angel los va presentando, close-ups de cada pack entrando a cuadro: 'No consumas mas ese tofu procesado. Esto es tofu artesanal de Defu: packs de x3, x6 y x9 en distintas variedades.' [8-13s] BODY — Montaje de close-ups, corte de tofu mostrando textura, variedades lado a lado destacando colores y contrastes: 'Comun, duro, saborizados. Proteina pura de soja agroecologica, agua y nigari — nada mas.' [13-18s] CTA — Angel vuelve a camara con pack en mano, gesto de invitacion. Badge en edicion, Envio en el dia CABA: 'Elegi tu pack en defu.com.ar y te lo enviamos en el dia.' [18-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Si queres comer sano de verdad, empeza por la proteina vegetal de calidad.",
            body: "No consumas mas ese tofu procesado. Esto es tofu artesanal de Defu: packs de x3, x6 y x9 en distintas variedades. Comun, duro, saborizados. Proteina pura de soja agroecologica, agua y nigari — nada mas.",
            cta: "Elegi tu pack en defu.com.ar y te lo enviamos en el dia.",
            pilar: "Producto",
            tema: "Proteina vegetal de calidad",
            formatoNarrativo: "Educativo / Demostrativo — Product Demo",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 1: DOLOR PROTEINA VEGETAL + BAJAS CALORIAS (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Consume proteina vegetal de mala calidad — ultraprocesada, con aditivos y llena de calorias vacias. No sabe que hay una alternativa limpia y baja en calorias.",
            solucion: "Tofu artesanal Defu: proteina vegetal pura, baja en calorias, sin aditivos. Soja agroecologica, agua y nigari. Combos con envio en el dia a CABA.",
            comunicacion: "Flyer comparativo: proteina vegetal industrial vs tofu artesanal Defu. Contraste visual de ingredientes y calorias. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual de contraste: etiqueta nutricional de proteina vegetal industrial (calorias altas, lista larga de ingredientes) vs tofu Defu (bajo en calorias, 3 ingredientes)",
              "Copy solucion: 'Tofu artesanal Defu: bajo en calorias, alto en proteina. Soja agroecologica, agua y nigari.' CTA: 'Conocelos en defu.com.ar'",
            ],
            copyAnuncio: "Tu proteina vegetal tiene mas calorias y aditivos que proteina real 😳\n\n🫘 Tofu artesanal Defu: bajo en calorias, alto en proteina.\n🌱 Soja agroecologica, agua y nigari. Nada mas.\n\n📦 Envio en el dia a CABA.\n\n👉 Conocelos en defu.com.ar",
            pilar: "Marca",
            tema: "Proteina limpia y baja en calorias",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Expectativa - Contraste",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 2: DOLOR COMPARTIDO — COME TOFU DE VERDAD (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Nunca probo tofu artesanal de verdad. Solo conoce el tofu industrial del super: insipido, gomoso, aburrido. Cree que el tofu es asi.",
            solucion: "Tofu artesanal Defu, fresco del dia, con sabor y textura de verdad. 11 variedades. Envio en el dia a CABA.",
            comunicacion: "Pieza de awareness/conversion con claim aspiracional 'COME TOFU DE VERDAD'. Imagen hero de variedades de tofu artesanal (colores, texturas, frescura). Foco en el producto como protagonista. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: variedad de tofus artesanales Defu sobre mesada/tabla (texturas, colores naturales, frescura visible). Composicion limpia, foco en producto.",
              "Copy principal: 'COME TOFU DE VERDAD.' Subcopy: 'Artesanal, fresco del dia, 11 variedades. Hecho con soja agroecologica, agua y nigari.'",
              "Badge: 'Envio en el dia a CABA'. CTA: 'Pedilo en defu.com.ar'",
            ],
            copyAnuncio: "COMÉ TOFU DE VERDAD 🔥\n\n🌱 Artesanal, fresco del dia, 11 variedades.\n🫘 Hecho con soja agroecologica, agua y nigari. Nada mas.\n\n📦 Envio en el dia a CABA.\n\n👉 Pedilo en defu.com.ar",
            pilar: "Marca",
            tema: "Tofu de verdad vs tofu industrial",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 3: COMBO DEGUSTACION (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "No sabe que tofu elegir entre tantas opciones, paralisis de eleccion",
            solucion: "Combo Degustacion de Tofu Completo: 11 variedades de tofu artesanal en 1 pedido para probar todos.",
            comunicacion: "Producto hero con las 11 variedades desplegadas y precio. Eliminar la paralisis de eleccion con un solo combo. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual del Combo Degustacion desplegado mostrando las 11 variedades con nombre de cada una",
              "Copy: 'NO ELIJAS. PROBA TODOS. 11 variedades de tofu artesanal en 1 combo.'",
              "Badge: 'Envio en el dia a CABA'. CTA: 'Compralo en defu.com.ar'",
            ],
            copyAnuncio: "NO ELIJAS. PROBA TODOS 🙌\n\n✨ 11 variedades de tofu artesanal en 1 combo.\n\n📦 Envio en el dia a CABA.\n\n👉 Compralo en defu.com.ar",
            pilar: "Producto",
            tema: "Primera compra sin riesgo",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/productos/combo-degustacion-de-tofu-completo-3o7l4/"],
          },
          // --- PIEZA 4: COMBOS RESTOCK + SABORIZADOS (Carrusel x4) ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "Se le acaba el tofu y tiene que comprar cada semana. No tiene forma simple de stockearse con variedad ni de probar saborizados.",
            solucion: "Combos Restock y Saborizados Defu: Tofu Comun x6, Tofu Duro x6, Saborizados (Espinaca y Nuez, Provenzal, Aji), Surtido x9. Tu mes de tofu resuelto en 1 pedido.",
            comunicacion: "Carrusel x4 slides mostrando toda la linea de combos de stockeo. Cada slide un grupo de producto con precio. Estilo referencia Soyana. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: '1 pedido. Todo el mes resuelto.' — Visual hero tipo Soyana: caja/display con productos, copy grande de conveniencia. Badge: 'Envio en el dia a CABA'",
              "Slide 2: Combos Restock — Tofu Comun x6 + Tofu Duro x6. Visual de ambos packs juntos mostrando volumen",
              "Slide 3: Combos Saborizados — Espinaca y Nuez / Provenzal / Aji + Surtido x9 (los 3 sabores). Visual de los 3 sabores + surtido",
              "Slide 4: CTA 'Arma tu combo en defu.com.ar/combos-defu — Envio en el dia a CABA'",
            ],
            copyAnuncio: "1 pedido. Todo el mes resuelto 💪\n\nCombos Restock y Saborizados de tofu artesanal:\n🟢 Tofu Comun x6\n🟢 Tofu Duro x6\n🟡 Saborizados: Espinaca y Nuez / Provenzal / Aji\n🟡 Surtido x9 (los 3 sabores)\n\n📦 Envio en el dia a CABA.\n\n👉 Arma tu combo en defu.com.ar",
            pilar: "Producto",
            tema: "Conveniencia y recompra",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            referenciaGrafica: "Ref: Soyana — caja abierta con productos plant-based, copy grande '1 pedido. Toda la semana RESUELTA. Sin pensar todos los dias que como hoy'. Tono lifestyle, foto cenital de caja con productos visibles. Adaptar concepto visual al branding Defu.",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 5: CATALOGO DE COMBOS (Carrusel x3) ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "No conoce todas las opciones de combos disponibles ni sabe cual le conviene",
            solucion: "Catalogo completo de combos Defu: Degustacion, Restock Comun, Restock Duro, Saborizados y Surtido. Todos con envio en el dia a CABA",
            comunicacion: "Guia de compra rapida: presentar todos los combos como opciones claras segun necesidad del usuario. Carrusel x3 slides max. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 'Cual es tu combo ideal? Todos con envio en el dia a CABA.'",
              "Slide 2: Grid visual — Para probar: Combo Degustacion / Para stockearte: Restock Comun x6 - Duro x6 / Saborizados: Espinaca y Nuez, Provenzal, Aji / Surtido x9 (los 3 sabores)",
              "Slide 3: CTA 'Elegi el tuyo en defu.com.ar/combos-defu — Envio en el dia a CABA'",
            ],
            copyAnuncio: "¿Cual es tu combo ideal? 🤔\n\n🥇 Para probar: Combo Degustacion\n📦 Para stockearte: Tofu Comun x6 · Tofu Duro x6\n🌶️ Saborizados: Espinaca y Nuez / Provenzal / Aji\n🎁 Surtido x9 (los 3 sabores)\n\n🚀 Todos con envio en el dia a CABA.\n\n👉 Elegi el tuyo en defu.com.ar",
            pilar: "Producto",
            tema: "Catalogo de combos",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 6: META ADS SHOPPING — COLLECTION AD ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "No conoce la marca ni sabe que puede comprar tofu artesanal online con delivery en el dia",
            solucion: "Anuncio de catalogo dinamico con varios productos de Defu: combos, tofu por unidad, saborizados, masas y mas. El usuario navega el catalogo completo y compra directo.",
            comunicacion: "Collection Ad en Meta Ads: imagen hero de producto (lifestyle, variedad de productos sobre mesada) + catalogo dinamico debajo. El usuario navega toda la tienda sin salir de Instagram/Facebook. Destino: tienda completa defu.com.ar.",
            mensajes: [
              "Hero image: foto lifestyle con variedad de productos Defu (tofus, saborizados, masas, combos). Copy overlay: 'Tofu artesanal con envio en el dia a CABA'",
              "Catalogo debajo: productos individuales (Tofu Comun, Duro, Especiado), saborizados, masas para gyozas/wantan/arrolladitos, combos",
              "CTA del anuncio: 'Comprar ahora' → defu.com.ar. Formato nativo de Meta Ads Shopping, no requiere pieza grafica tradicional.",
            ],
            copyAnuncio: "🌱 Tofu artesanal con envio en el dia a CABA.\n\n🛒 Explora todos nuestros productos y compra directo.\n\n👉 defu.com.ar",
            pilar: "Producto",
            tema: "Catalogo shopping",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catalogo - CTA directo",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/"],
          },
        ],
      },
      {
        icp: "Alimentacion Saludable",
        piezas: [
          
          // --- 3 VIDEOS (angulos compartidos, ya producidos) ---
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "El tofu es feo, sin sabor y de mala calidad — la experiencia generica del super",
            solucion: "Combo Degustacion de Tofu Completo: variedades de tofu artesanal fresco elaborado con soja agroecologica. Cada uno con su sabor y textura propia.",
            comunicacion: "[0-3s] HOOK — Angel plano medio, directo a camara, fondo limpio: 'Si pensas que el tofu es feo y no tiene sabor...' [3-5s] Camara baja revelando el Combo Degustacion desplegado debajo de Angel: '...es porque nunca probaste tofu artesanal.' [5-10s] BODY — Angel senala los productos, close-ups de cada variedad, texturas y colores: 'Este es el Combo Degustacion de Defu: distintas variedades de tofu artesanal fresco...' [10-15s] BODY — Inserts rapidos, corte de tofu mostrando interior, variedad visual del combo completo: '...elaborado con soja agroecologica. Cada uno con su sabor y textura propia.' [15-19s] CTA — Angel cierra mirando a camara, gesto de invitacion. Badge en edicion, Envio en el dia CABA: 'Entra a defu.com.ar, hace tu pedido y te lo enviamos en el dia.' [19-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Si pensas que el tofu es feo y no tiene sabor, es porque nunca probaste tofu artesanal.",
            body: "Este es el Combo Degustacion de Defu: distintas variedades de tofu artesanal fresco, elaborado con soja agroecologica. Cada uno con su sabor y textura propia.",
            cta: "Entra a defu.com.ar, hace tu pedido y te lo enviamos en el dia.",
            pilar: "Producto",
            tema: "Calidad artesanal vs experiencia generica",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/productos/combo-degustacion-de-tofu-completo-3o7l4/"],
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Come mal porque no sabe como cocinar rico y sano a la vez — sin ideas, sin variedad, sin ingredientes listos",
            solucion: "Combos Restock de tofu artesanal para todo el mes. Sumalo a ensaladas, salteados, tacos, frito — come rico y sano todos los dias.",
            comunicacion: "[0-3s] HOOK — Angel en cocina, plano medio directo a camara. Fondo limpio, sin productos a la vista: 'Estas cansado de no saber que cocinar?' [3-7s] BODY — Angel presenta los combos Restock. El pack de tofu comun x6, el pack de tofu duro x6 y el combo saborizado surtido x9 entran a cuadro, los acomoda sobre la mesada mostrando la variedad de productos, colores y contrastes entre variedades: 'Con nuestros combos Restock tenes tofu artesanal para todo el mes.' [7-13s] BODY — Montaje rapido, corte a tofu en ensalada, salteado con verduras en sarten, armando tacos, tofu frito dorado. Cada plato 1.5s: 'Sumalo a ensaladas, salteados, tacos, frito... come rico y sano todos los dias.' [13-18s] CTA — Angel vuelve a camara, gesto de invitacion. Combos Restock visibles en mesada detras. Badge en edicion, Envio en el dia CABA: 'Pedi tu combo en la tienda online y te lo enviamos en el dia a tu casa.' [18-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Estas cansado de no saber que cocinar?",
            body: "Con nuestros combos Restock tenes tofu artesanal para todo el mes. Sumalo a ensaladas, salteados, tacos, frito... come rico y sano todos los dias.",
            cta: "Pedi tu combo en la tienda online y te lo enviamos en el dia a tu casa.",
            pilar: "Producto",
            tema: "Organizacion y planificacion alimentaria",
            formatoNarrativo: "Direct to Camera — Talking Head",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Consume proteina vegetal de mala calidad, ultraprocesada y con aditivos — no sabe que hay algo mejor",
            solucion: "Packs de tofu artesanal nutritivo de Defu en x3, x6 y x9 unidades. Distintas variedades para elegir: comun, duro, saborizados. Elaborado con soja agroecologica, agua y nigari.",
            comunicacion: "[0-3s] HOOK — Angel plano medio, directo a camara, fondo limpio: 'Si queres comer sano de verdad, empeza por la proteina vegetal de calidad.' [3-8s] BODY — Inserts cinematicos de los packs sobre mesada, pack de tofu comun x6, pack de tofu duro x6 y combo saborizado surtido x9. Angel los va presentando, close-ups de cada pack entrando a cuadro: 'No consumas mas ese tofu procesado. Esto es tofu artesanal de Defu: packs de x3, x6 y x9 en distintas variedades.' [8-13s] BODY — Montaje de close-ups, corte de tofu mostrando textura, variedades lado a lado destacando colores y contrastes: 'Comun, duro, saborizados. Proteina pura de soja agroecologica, agua y nigari — nada mas.' [13-18s] CTA — Angel vuelve a camara con pack en mano, gesto de invitacion. Badge en edicion, Envio en el dia CABA: 'Elegi tu pack en defu.com.ar y te lo enviamos en el dia.' [18-22s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
            hook: "Si queres comer sano de verdad, empeza por la proteina vegetal de calidad.",
            body: "No consumas mas ese tofu procesado. Esto es tofu artesanal de Defu: packs de x3, x6 y x9 en distintas variedades. Comun, duro, saborizados. Proteina pura de soja agroecologica, agua y nigari — nada mas.",
            cta: "Elegi tu pack en defu.com.ar y te lo enviamos en el dia.",
            pilar: "Producto",
            tema: "Proteina vegetal de calidad",
            formatoNarrativo: "Educativo / Demostrativo — Product Demo",
            estructuraNarrativa: "Hook - Contenido - Accion",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "15-22s",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 1: DOLOR PROTEINA VEGETAL + BAJAS CALORIAS (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Consume proteina vegetal de mala calidad — ultraprocesada, con aditivos y llena de calorias vacias. No sabe que hay una alternativa limpia y baja en calorias.",
            solucion: "Tofu artesanal Defu: proteina vegetal pura, baja en calorias, sin aditivos. Soja agroecologica, agua y nigari. Combos con envio en el dia a CABA.",
            comunicacion: "Flyer comparativo: proteina vegetal industrial vs tofu artesanal Defu. Contraste visual de ingredientes y calorias. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual de contraste: etiqueta nutricional de proteina vegetal industrial (calorias altas, lista larga de ingredientes) vs tofu Defu (bajo en calorias, 3 ingredientes)",
              "Copy solucion: 'Tofu artesanal Defu: bajo en calorias, alto en proteina. Soja agroecologica, agua y nigari.' CTA: 'Conocelos en defu.com.ar'",
            ],
            copyAnuncio: "Tu proteina vegetal tiene mas calorias y aditivos que proteina real 😳\n\n🫘 Tofu artesanal Defu: bajo en calorias, alto en proteina.\n🌱 Soja agroecologica, agua y nigari. Nada mas.\n\n📦 Envio en el dia a CABA.\n\n👉 Conocelos en defu.com.ar",
            pilar: "Marca",
            tema: "Proteina limpia y baja en calorias",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Expectativa - Contraste",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 2: DOLOR COMPARTIDO — COME TOFU DE VERDAD (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "Nunca probo tofu artesanal de verdad. Solo conoce el tofu industrial del super: insipido, gomoso, aburrido. Cree que el tofu es asi.",
            solucion: "Tofu artesanal Defu, fresco del dia, con sabor y textura de verdad. 11 variedades. Envio en el dia a CABA.",
            comunicacion: "Pieza de awareness/conversion con claim aspiracional 'COME TOFU DE VERDAD'. Imagen hero de variedades de tofu artesanal (colores, texturas, frescura). Foco en el producto como protagonista. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual hero: variedad de tofus artesanales Defu sobre mesada/tabla (texturas, colores naturales, frescura visible). Composicion limpia, foco en producto.",
              "Copy principal: 'COME TOFU DE VERDAD.' Subcopy: 'Artesanal, fresco del dia, 11 variedades. Hecho con soja agroecologica, agua y nigari.'",
              "Badge: 'Envio en el dia a CABA'. CTA: 'Pedilo en defu.com.ar'",
            ],
            copyAnuncio: "COMÉ TOFU DE VERDAD 🔥\n\n🌱 Artesanal, fresco del dia, 11 variedades.\n🫘 Hecho con soja agroecologica, agua y nigari. Nada mas.\n\n📦 Envio en el dia a CABA.\n\n👉 Pedilo en defu.com.ar",
            pilar: "Marca",
            tema: "Tofu de verdad vs tofu industrial",
            formatoNarrativo: "Producto — Hero Shot",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 3: COMBO DEGUSTACION (Feed + Story) ---
          {
            formato: "Posteo Rectangular (1080x1350)",
            dolor: "No sabe que tofu elegir entre tantas opciones, paralisis de eleccion",
            solucion: "Combo Degustacion de Tofu Completo: 11 variedades de tofu artesanal en 1 pedido para probar todos.",
            comunicacion: "Producto hero con las 11 variedades desplegadas y precio. Eliminar la paralisis de eleccion con un solo combo. Adaptar a Story (1080x1920).",
            mensajes: [
              "Visual del Combo Degustacion desplegado mostrando las 11 variedades con nombre de cada una",
              "Copy: 'NO ELIJAS. PROBA TODOS. 11 variedades de tofu artesanal en 1 combo.'",
              "Badge: 'Envio en el dia a CABA'. CTA: 'Compralo en defu.com.ar'",
            ],
            copyAnuncio: "NO ELIJAS. PROBA TODOS 🙌\n\n✨ 11 variedades de tofu artesanal en 1 combo.\n\n📦 Envio en el dia a CABA.\n\n👉 Compralo en defu.com.ar",
            pilar: "Producto",
            tema: "Primera compra sin riesgo",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Imagen", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/productos/combo-degustacion-de-tofu-completo-3o7l4/"],
          },
          // --- PIEZA 4: COMBOS RESTOCK + SABORIZADOS (Carrusel x4) ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "Se le acaba el tofu y tiene que comprar cada semana. No tiene forma simple de stockearse con variedad ni de probar saborizados.",
            solucion: "Combos Restock y Saborizados Defu: Tofu Comun x6, Tofu Duro x6, Saborizados (Espinaca y Nuez, Provenzal, Aji), Surtido x9. Tu mes de tofu resuelto en 1 pedido.",
            comunicacion: "Carrusel x4 slides mostrando toda la linea de combos de stockeo. Cada slide un grupo de producto con precio. Estilo referencia Soyana. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: '1 pedido. Todo el mes resuelto.' — Visual hero tipo Soyana: caja/display con productos, copy grande de conveniencia. Badge: 'Envio en el dia a CABA'",
              "Slide 2: Combos Restock — Tofu Comun x6 + Tofu Duro x6. Visual de ambos packs juntos mostrando volumen",
              "Slide 3: Combos Saborizados — Espinaca y Nuez / Provenzal / Aji + Surtido x9 (los 3 sabores). Visual de los 3 sabores + surtido",
              "Slide 4: CTA 'Arma tu combo en defu.com.ar/combos-defu — Envio en el dia a CABA'",
            ],
            copyAnuncio: "1 pedido. Todo el mes resuelto 💪\n\nCombos Restock y Saborizados de tofu artesanal:\n🟢 Tofu Comun x6\n🟢 Tofu Duro x6\n🟡 Saborizados: Espinaca y Nuez / Provenzal / Aji\n🟡 Surtido x9 (los 3 sabores)\n\n📦 Envio en el dia a CABA.\n\n👉 Arma tu combo en defu.com.ar",
            pilar: "Producto",
            tema: "Conveniencia y recompra",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            referenciaGrafica: "Ref: Soyana — caja abierta con productos plant-based, copy grande '1 pedido. Toda la semana RESUELTA. Sin pensar todos los dias que como hoy'. Tono lifestyle, foto cenital de caja con productos visibles. Adaptar concepto visual al branding Defu.",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 5: CATALOGO DE COMBOS (Carrusel x3) ---
          {
            formato: "Posteo Cuadrado (1080x1080)",
            dolor: "No conoce todas las opciones de combos disponibles ni sabe cual le conviene",
            solucion: "Catalogo completo de combos Defu: Degustacion, Restock Comun, Restock Duro, Saborizados y Surtido. Todos con envio en el dia a CABA",
            comunicacion: "Guia de compra rapida: presentar todos los combos como opciones claras segun necesidad del usuario. Carrusel x3 slides max. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: 'Cual es tu combo ideal? Todos con envio en el dia a CABA.'",
              "Slide 2: Grid visual — Para probar: Combo Degustacion / Para stockearte: Restock Comun x6 - Duro x6 / Saborizados: Espinaca y Nuez, Provenzal, Aji / Surtido x9 (los 3 sabores)",
              "Slide 3: CTA 'Elegi el tuyo en defu.com.ar/combos-defu — Envio en el dia a CABA'",
            ],
            copyAnuncio: "¿Cual es tu combo ideal? 🤔\n\n🥇 Para probar: Combo Degustacion\n📦 Para stockearte: Tofu Comun x6 · Tofu Duro x6\n🌶️ Saborizados: Espinaca y Nuez / Provenzal / Aji\n🎁 Surtido x9 (los 3 sabores)\n\n🚀 Todos con envio en el dia a CABA.\n\n👉 Elegi el tuyo en defu.com.ar",
            pilar: "Producto",
            tema: "Catalogo de combos",
            formatoNarrativo: "Producto — Showcase",
            estructuraNarrativa: "Afirmacion - Evidencia",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/combos-defu/"],
          },
          // --- PIEZA 6: META ADS SHOPPING — COLLECTION AD ---
          {
            formato: "Meta Ads Shopping (Collection Ad)",
            dolor: "No conoce la marca ni sabe que puede comprar tofu artesanal online con delivery en el dia",
            solucion: "Anuncio de catalogo dinamico con varios productos de Defu: combos, tofu por unidad, saborizados, masas y mas. El usuario navega el catalogo completo y compra directo.",
            comunicacion: "Collection Ad en Meta Ads: imagen hero de producto (lifestyle, variedad de productos sobre mesada) + catalogo dinamico debajo. El usuario navega toda la tienda sin salir de Instagram/Facebook. Destino: tienda completa defu.com.ar.",
            mensajes: [
              "Hero image: foto lifestyle con variedad de productos Defu (tofus, saborizados, masas, combos). Copy overlay: 'Tofu artesanal con envio en el dia a CABA'",
              "Catalogo debajo: productos individuales (Tofu Comun, Duro, Especiado), saborizados, masas para gyozas/wantan/arrolladitos, combos",
              "CTA del anuncio: 'Comprar ahora' → defu.com.ar. Formato nativo de Meta Ads Shopping, no requiere pieza grafica tradicional.",
            ],
            copyAnuncio: "🌱 Tofu artesanal con envio en el dia a CABA.\n\n🛒 Explora todos nuestros productos y compra directo.\n\n👉 defu.com.ar",
            pilar: "Producto",
            tema: "Catalogo shopping",
            formatoNarrativo: "Meta Ads — Collection / Advantage+ Shopping",
            estructuraNarrativa: "Catalogo - CTA directo",
            enRevision: false,
            destinoUrls: ["https://www.defu.com.ar/"],
          },
        ],
      },
      // Foodie / Comida China excluido: consumo ocasional, conviene optimizar recursos hacia ICPs recurrentes
    ],
    formatos: ["Video Comercial (9:16)", "Feed (1080x1350)", "Reel / Story (1080x1920)", "Carrusel (1080x1080)", "Meta Ads Shopping"],
    tono: "Cercano, directo, sin formalidades. Habla como un amigo que te recomienda algo que realmente le gusta. Evitar lenguaje corporativo o demasiado publicitario. Priorizar autenticidad y prueba real sobre claims genericos.",
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
      nombre: "DEFU_Awareness",
      objetivo: "Interacción",
      status: "activa",
      destino: "Perfil de Instagram (@defu.tofuco)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Interacciones"],
      presupuestoCampana: { diario: "USD $3/día", mensual: "USD $90/mes" },
      adSets: [
        {
          nombre: "Conjunto_General_CABA/ZN",
          segmentacion: "25-45 años, CABA/ZN (Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo, Vicente López). Intereses: Tofu, Veganismo, Vegetarianismo, Alimentación vegana, Gastronomía vegetariana, Gastronomía china, Alimentación saludable",
          ads: [
            "Reel posicionamiento 1 | instagram.com/defu.tofuco/reel/Dboj311iXkX",
            "Reel posicionamiento 2 | instagram.com/defu.tofuco/reel/DcuDokLDtpS",
            "Reel posicionamiento 3 | instagram.com/defu.tofuco/reel/DcRvAaxD_4H",
            "Imagen estatica 1 | instagram.com/defu.tofuco/p/Db_p9iejL7r",
            "Reel posicionamiento 4 | instagram.com/defu.tofuco/reel/DbtryXDiuIl",
            "Imagen estatica 2 | instagram.com/defu.tofuco/p/DC-Do-PRr5g",
          ],
        },
      ],
    },
    {
      nombre: "DEFU_Ventas",
      objetivo: "Ventas",
      status: "en-desarrollo",
      destino: "defu.com.ar/[producto]",
      kpisCampana: ["Visitas a pagina de producto", "Compras", "ROAS"],
      presupuestoCampana: { diario: "USD $5/día", mensual: "USD $150/mes" },
      adSets: [
        {
          nombre: "Conjunto_Vegano_Veggie",
          segmentacion: "25-45 años, CABA/ZN (Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo, Vicente López). Intereses: Tofu, Veganismo, Vegetarianismo, Alimentación vegana, Gastronomía vegetariana, Proteína vegetal",
          ads: [
            "Video UGC 1 | Dolor: tofu industrial vs artesanal",
            "Video UGC 2 | Behind the scenes produccion artesanal",
            "Carrusel | Industrial vs artesanal",
            "Imagen | Fresco del dia + habilitacion sanitaria",
            "Story | Grilla de productos + swipe up",
            "Imagen | Social proof vegano",
            "Carrusel | Recetario 5 platos con tofu",
          ],
        },
        {
          nombre: "Conjunto_Alimentacion_Saludable",
          segmentacion: "25-45 años, CABA/ZN (Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo, Vicente López). Intereses: Alimentación saludable, Comida orgánica, Comida natural, Nutrición",
          ads: [
            "Video UGC | Etiquetas industrial vs artesanal",
            "Carrusel | 3 ingredientes, nada mas",
            "Imagen | Combo semanal + envio en el dia",
            "Story | Receta rapida con tofu listo",
            "Imagen | Del productor a tu mesa",
            "Carrusel | Comer sano no tiene que ser caro",
            "Imagen | Producto hero artesanal + local",
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

  ofertas: [
    {
      nombre: "Mix Degustacion",
      descripcion: "1x Tofu Comun al Vacio 800g ($6.500) + 1x Tofu Duro al Vacio 800g ($8.000) + 1x Tofu Especiado 1kg ($10.500) + 2x Tofu Saborizado Espinaca y Nuez 250g ($6.000 c/u) + 2x Tofu Saborizado Provenzal 250g ($6.000 c/u) + 2x Tofu Saborizado al Aji 250g ($6.000 c/u). Variedad completa para probar todos los tipos de tofu. Ideal para primera compra. Aplica a ambos ICPs.",
      precio: "Valor individual: $61.000 — Precio combo por definir",
    },
    {
      nombre: "Mix Stockeate",
      descripcion: "6x Tofu Comun al Vacio 800g ($6.500 c/u) + 6x Tofu Duro al Vacio 800g ($8.000 c/u). 12 unidades en total. Para el consumidor recurrente que siempre quiere tener tofu disponible para usar y condimentar a su gusto. Aplica a ambos ICPs.",
      precio: "Valor individual: $87.000 — Precio combo por definir",
    },
  ],

  cambiosEcommerce: null,

  competenciaAds: {
    marca: "Soyana",
    cuenta: "soyana_alimentos",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=soyana",
    formatos: [
      { id: "f01", tipo: "Carrusel", dolor: "No encuentra variedad de productos plant-based en un solo lugar" },
      { id: "f02", tipo: "Shopping / Catalogo", dolor: "No sabe cuanto cuestan ni donde comprar packs de tofu" },
      { id: "f03", tipo: "Imagen estatica", dolor: "Quiere stockearse saludable pero no encuentra packs convenientes" },
      { id: "f04", tipo: "Reel", dolor: "No tiene tiempo para cocinar y termina comiendo cualquier cosa", solucion: "El Tofu Listo de Soyana ya viene preparado y te resuelve 4 comidas semanales sin esfuerzo", postUrl: "https://www.instagram.com/p/DbEgvV7M5A2/" },
      { id: "f05", tipo: "Reel", dolor: "Come mal por falta de organizacion y no sabe como planificar sus comidas", solucion: "Combos ya armados de Soyana que simplifican la planificacion y te permiten organizarte mas rapido", postUrl: "https://www.instagram.com/p/DZV_Q7Jsdih/" },
      { id: "f06", tipo: "Reel", dolor: "Necesita sumar proteina a sus comidas pero cree que es dificil o complicado (Orientado a Vegetarianos/Veganos)", solucion: "El tofu es alto en proteinas y facil de incorporar a cualquier comida del dia", postUrl: "https://www.instagram.com/p/DYX56KuyVQW/" },
      { id: "f07", tipo: "Reel", dolor: "Las picadas tradicionales te dejan lleno y pesado", solucion: "Con el combo de tofus saborizados podes variar de la tipica picada, facil y rapido", postUrl: "https://www.instagram.com/p/DZqJOY4w4ob/" },
      { id: "f08", tipo: "Carrusel", dolor: "Llegar cansado, abrir la heladera y no tener nada resuelto. Terminas pidiendo delivery otra vez", solucion: "Con 1 pedido tenes toda la semana resuelta. Sin pensar todos los dias que como hoy", postUrl: "https://www.instagram.com/p/DctbiHskj3y/" },
      { id: "f09", tipo: "Carrusel", dolor: "No sabe que combo elegir ni como sumar tofu a sus comidas", solucion: "Combos armados listos para comprar online, con variedad de productos en un solo pedido", postUrl: "https://www.instagram.com/p/DZ8Xditydvw/" },
    ],
  },

  notas: "DEFU es el primer cliente de Foundation F2. Los edge cases de este cliente (sin FB Page, posible IG Personal, sin vehiculo propio) son referencia para el proceso estandar.\n\nAngel es cuello de botella operativo: atiende todo personalmente y administra otros locales. Cualquier flujo de leads debe considerar su capacidad limitada. En una fase posterior se puede implementar un bot de WhatsApp para filtrar y calificar automaticamente.\n\nLa estrategia es gradual: primero awareness (que conozcan a Defu), luego conversion B2C (e-commerce). El B2B no lleva pauta por ahora, se trabaja organicamente aprovechando el awareness generado.",

  // Referencias moodboard
  referenciasMoodboard: [
    // Video — Reels Soyana (competencia)
    { url: "https://www.instagram.com/p/DbEgvV7M5A2/", titulo: "Soyana — Tofu Listo, sin tiempo para cocinar" },
    { url: "https://www.instagram.com/p/DZV_Q7Jsdih/", titulo: "Soyana — Combos planificacion semanal" },
    { url: "https://www.instagram.com/p/DYX56KuyVQW/", titulo: "Soyana — Proteina facil de incorporar" },
    { url: "https://www.instagram.com/p/DZqJOY4w4ob/", titulo: "Soyana — Picada con tofus saborizados" },
    // Estatico — Pinterest
    { url: "https://ar.pinterest.com/pin/961096376731442635/" },
    { url: "https://ar.pinterest.com/pin/961096376743414367/" },
    { url: "https://ar.pinterest.com/pin/961096376728675693/" },
    { url: "https://ar.pinterest.com/pin/339388521932148561/" },
    { url: "https://ar.pinterest.com/pin/961096376731239175/" },
    { url: "https://ar.pinterest.com/pin/961096376730514140/" },
    { url: "https://ar.pinterest.com/pin/1105211564791649511/" },
    { url: "https://ar.pinterest.com/pin/961096376730712531/" },
  ],

  // Roadmap
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

