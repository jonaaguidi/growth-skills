import { renderPlaybookHtml } from "./dist/lib/playbook-renderer.js";
import { renderOnboardingHtml } from "./dist/lib/onboarding-renderer.js";
import { renderStrategyHtml } from "./dist/lib/strategy-renderer.js";
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
    piezasPorIcp: [
      {
        icp: "Vegano / Veggie",
        piezas: [
          {
            formato: "Video UGC",
            dolor: "El tofu del super no tiene sabor ni buena textura, parece goma",
            solucion: "Mix Degustacion: proba tofu de calidad con 7 variedades en un solo pedido",
            comunicacion: "",
            hook: "Deje de comprar el tofu del super. Te cuento por que.",
            body: "Persona mostrando la diferencia de textura y sabor entre el tofu industrial y el artesanal de Defu. Corte, textura, color. Prueba en camara.",
            cta: "Proba todas las variedades con el Mix Degustacion. Link en bio.",
          },
          {
            formato: "Video UGC",
            dolor: "Necesita stockearse pero no tiene una forma simple de hacerlo",
            solucion: "Mix Stockeate: 12 unidades para tener tofu todo el mes",
            comunicacion: "",
            hook: "Asi organizo mis comidas para todo el mes.",
            body: "Persona mostrando como arma su heladera con los 12 tofus del Mix Stockeate. Meal prep visual, multiples comidas resueltas.",
            cta: "Pedilo en defu.com.ar. 12 tofus en tu puerta.",
          },
          {
            formato: "Video UGC",
            dolor: "Los productos 'saludables' del super son ultraprocesados disfrazados",
            solucion: "Tofu artesanal con 3 ingredientes reales: soja, agua y nigari",
            comunicacion: "",
            hook: "Leiste la etiqueta de tu comida saludable? Te va a sorprender.",
            body: "Comparar etiquetas: ingredientes del tofu industrial vs los 3 ingredientes de Defu (soja, agua, nigari). Reaccion al leer la lista del industrial.",
            cta: "Consumi proteina organica de verdad. defu.com.ar",
          },
          {
            formato: "Imagen",
            dolor: "Necesita stockearse pero no tiene una forma simple de hacerlo",
            solucion: "Mix Stockeate: 12 unidades de tofu para tener siempre disponible",
            comunicacion: "",
            mensajes: [
              "Visual del Mix Stockeate con los 12 productos",
              "Copy: 'Tu quincena de tofu resuelta en 1 pedido'",
              "Precio del combo + envio en el dia. CTA en defu.com.ar",
            ],
          },
          {
            formato: "Carrusel",
            dolor: "No conoce la marca, nunca compro tofu artesanal online",
            solucion: "Comparacion visual: tofu industrial vs produccion artesanal diaria",
            comunicacion: "",
            mensajes: [
              "Slide 1: Foto tofu de super vs tofu Defu (comparativa visual directa)",
              "Slide 2-3: Proceso artesanal, la familia, produccion del dia",
              "Slide 4: CTA 'Proba la diferencia. Mix Degustacion en defu.com.ar'",
            ],
          },
          {
            formato: "Imagen",
            dolor: "No confia en la cadena de frio ni en el proceso de produccion industrial",
            solucion: "Produccion diaria con habilitacion sanitaria completa",
            comunicacion: "",
            mensajes: [
              "Producto hero con claim: 'Fresco del dia, no del freezer'",
              "Badge de habilitacion sanitaria visible",
              "CTA al e-commerce",
            ],
          },
          {
            formato: "Story",
            dolor: "Necesita otros productos para saborizar su tofu",
            solucion: "Mix Degustacion incluye saborizados (Espinaca y Nuez, Provenzal, Aji) listos para comer",
            comunicacion: "",
            mensajes: [
              "Grilla visual de los productos del Mix Degustacion",
              "Copy: 'Saborizados incluidos, no tenes que agregar nada'",
              "Swipe up al combo en defu.com.ar",
            ],
          },
          {
            formato: "Carrusel",
            dolor: "Siempre cocina lo mismo con tofu porque no tiene ideas",
            solucion: "Recetario visual con platos distintos usando variedades del Mix Degustacion",
            comunicacion: "",
            mensajes: [
              "Slide 1: '5 recetas, 5 tofus distintos'",
              "Slides 2-5: Plato terminado + variedad de tofu usada en cada receta",
              "Slide 6: CTA al Mix Degustacion en defu.com.ar",
            ],
          },
        ],
      },
      {
        icp: "Alimentacion Saludable",
        piezas: [
          {
            formato: "Video UGC",
            dolor: "El tofu del super no tiene sabor ni buena textura, parece goma",
            solucion: "Mix Degustacion: proba tofu de calidad con 7 variedades en un solo pedido",
            comunicacion: "",
            hook: "Deje de comprar el tofu del super. Te cuento por que.",
            body: "Persona mostrando la diferencia de textura y sabor entre el tofu industrial y el artesanal de Defu. Corte, textura, color. Prueba en camara.",
            cta: "Proba todas las variedades con el Mix Degustacion. Link en bio.",
          },
          {
            formato: "Video UGC",
            dolor: "Necesita stockearse pero no tiene una forma simple de hacerlo",
            solucion: "Mix Stockeate: 12 unidades para tener tofu todo el mes",
            comunicacion: "",
            hook: "Asi organizo mis comidas para todo el mes.",
            body: "Persona mostrando como arma su heladera con los 12 tofus del Mix Stockeate. Meal prep visual, multiples comidas resueltas.",
            cta: "Pedilo en defu.com.ar. 12 tofus en tu puerta.",
          },
          {
            formato: "Video UGC",
            dolor: "Los productos 'saludables' del super son ultraprocesados disfrazados",
            solucion: "Tofu artesanal con 3 ingredientes reales: soja, agua y nigari",
            comunicacion: "",
            hook: "Leiste la etiqueta de tu comida saludable? Te va a sorprender.",
            body: "Comparar etiquetas: ingredientes del tofu industrial vs los 3 ingredientes de Defu (soja, agua, nigari). Reaccion al leer la lista del industrial.",
            cta: "Consumi proteina organica de verdad. defu.com.ar",
          },
          {
            formato: "Imagen",
            dolor: "No sabe donde comprar tofu de calidad cerca",
            solucion: "E-commerce con delivery en el dia, directo del productor",
            comunicacion: "",
            mensajes: [
              "Visual de delivery con copy: 'Tofu artesanal en tu puerta, sin ir al Barrio Chino'",
              "Zona de cobertura (CABA/ZN) + envio en el dia",
              "CTA al Mix Degustacion o Mix Stockeate en defu.com.ar",
            ],
          },
          {
            formato: "Story",
            dolor: "Quiere incorporar tofu pero no sabe como cocinarlo",
            solucion: "Receta rapida con tofu saborizado que ya viene listo para comer",
            comunicacion: "",
            mensajes: [
              "Receta express: cortar tofu saborizado, agregar a ensalada o wrap",
              "Copy: 'Cena lista en 5 minutos. Sin saber cocinar.'",
              "Swipe up al Mix Degustacion en defu.com.ar",
            ],
          },
          {
            formato: "Carrusel",
            dolor: "Quiere incorporar tofu pero no sabe que variedad elegir",
            solucion: "Mix Degustacion: 7 variedades para descubrir cual te gusta mas",
            comunicacion: "",
            mensajes: [
              "Slide 1: 'No sabes que tofu elegir? Probalos todos.'",
              "Slide 2-3: Cada variedad del mix con sugerencia de uso (comun para salteados, duro para plancha, saborizados para ensalada)",
              "Slide 4: CTA al Mix Degustacion en defu.com.ar",
            ],
          },
          {
            formato: "Imagen",
            dolor: "Le cuesta armar una dieta variada sin caer siempre en los mismos productos",
            solucion: "Mix Stockeate: 12 unidades para resolver toda la quincena",
            comunicacion: "",
            mensajes: [
              "Visual del Mix Stockeate con copy: 'Tu quincena resuelta en 1 pedido'",
              "Precio del combo + envio en el dia",
              "CTA directo al combo en defu.com.ar",
            ],
          },
          {
            formato: "Carrusel",
            dolor: "No conoce la marca ni sabe que existe tofu artesanal local",
            solucion: "Familia china-argentina produciendo tofu artesanal todos los dias en Buenos Aires",
            comunicacion: "",
            mensajes: [
              "Slide 1: 'Conoce a la familia detras de tu tofu'",
              "Slide 2: Historia familiar y tradicion",
              "Slide 3: Proceso artesanal, produccion diaria",
              "Slide 4: CTA 'Proba el tofu de verdad. Mix Degustacion en defu.com.ar'",
            ],
          },
        ],
      },
      // Foodie / Comida China excluido: consumo ocasional, conviene optimizar recursos hacia ICPs recurrentes
    ],
    formatos: ["Video UGC (Reels 9:16)", "Carrusel (feed)", "Imagen estatica (feed)", "Story con link al e-commerce"],
    tono: null,
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
      objetivo: "Ventas. Destino: defu.com.ar/[producto]. Optimizar por visitas a pagina de producto y compras.",
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

const playbook = renderPlaybookHtml(data);
const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);

// Output dirs
const slug = data.clientInfo.slug;
const baseDir = new URL("./", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outputs = [
  { dir: join(baseDir, "clients-doc-internos", slug), file: `foundation-${slug}.html`, html: playbook },
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

