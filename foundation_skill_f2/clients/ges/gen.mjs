import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// Foundation :: Grupo Editorial Sur (GES) — Campaña de Ventas, 3 libros
//
// Estructura pedida por el equipo: 1 campaña, 3 conjuntos, 6 anuncios.
// Un conjunto por libro, y dentro de cada conjunto 1 video + 1 carrusel.
// Los tres libros empujan la misma mecánica de oferta: comprás el título
// destacado + cualquier otro del catálogo y el envío lo paga GES
// (viernes 13/11 al 19/12).
//
// Precios y contenidos verificados en grupoeditorialsur.com el 04/11/2026.
// Este script genera SOLO el Foundation Review (entregable principal) y
// publica con slug propio "ges": no toca ningún otro cliente.

const URL_MALVINAS = "https://grupoeditorialsur.com/producto/cronica-de-una-incursion-a-malvinas-juan-augrusto-rattenbach/";
const URL_ESPEJO = "https://grupoeditorialsur.com/producto/jose-espejo-el-guardian-de-evita-hernan-brienza/";
const URL_BORGES = "https://grupoeditorialsur.com/producto/codigo-borges-dimensiones-para-repensar-su-literatura-disruptiva-nestor-gabriel-leone/";

const data = {
  clientInfo: {
    nombreEmpresa: "Grupo Editorial Sur",
    slug: "ges",
    logoFile: null,
    nombreContacto: null,
    industria: "Editorial independiente — historia, política y ensayo",
    sitioWeb: "grupoeditorialsur.com",
    email: null,
    telefono: null,
    fechaCierre: null,
  },
  datosF1: {
    inversionMensual: null,
    presupuestoPauta: "USD 300/mes",
    cplObjetivo: null,
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (grupoeditorialsur.com)"],
    palancaPropuesta: "Oferta: el envío lo paga GES cuando el pedido lleva un segundo título",
    campanasVendidas: ["Tráfico al e-commerce"],
    duracionProyecto: "6 semanas (13/11 al 19/12)",
    fechaInicio: "13/11",
    fechaFin: "19/12",
    // S1 = 02/11 (armado del Foundation) ... S8 = 21/12 (review de cierre).
    fechaInicioISO: "2026-11-02",
  },

  // ── A. Onboarding ────────────────────────────────────────────────
  // GES ya está onboardeado bajo growth@reecreativos.com. Se deja el
  // mínimo que el Foundation Review necesita leer.
  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suarez", rol: "Account Lead", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Grupo cliente GES x REE Growth activo", status: "hecho", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Portfolio de Grupo Editorial Sur operativo bajo growth@", status: "hecho", notas: null },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Facebook Page vinculada al portfolio", status: "hecho", notas: null },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "@grupoeditorialsur vinculado al portfolio", status: "hecho", notas: null },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Cuenta publicitaria activa con el medio de pago de GES", status: "hecho", notas: null },
        { label: "Verificar el límite de gasto de la cuenta antes del 13/11", status: "pendiente", notas: "Tiene que quedar por encima de USD 300/mes o Meta corta la campaña a mitad de la promo." },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Pixel instalado en grupoeditorialsur.com (WooCommerce)", status: "hecho", notas: null },
        { label: "Verificar que la compra se registre con el monto del pedido", status: "pendiente", notas: "Sin el monto no podemos saber cuánta plata trajo la campaña ni cuánto fue el ticket promedio." },
        { label: "Verificar que se registren las visitas a las fichas y los carritos iniciados", status: "pendiente", notas: "Son las señales que vamos a mirar al principio, cuando todavía haya pocas compras." },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Revisar si el plugin de Meta para WooCommerce tiene CAPI activo", status: "pendiente", notas: null },
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "La oferta depende de una regla de carrito, no de un producto",
        aplica: true,
        instrucciones: "El envío gratis no es un producto ni un precio: se activa cuando el carrito lleva el título destacado más cualquier otro del catálogo. Si WooCommerce no aplica la regla solo, el anuncio promete algo que el checkout no cumple y se pierde la venta en el último paso. Hay que configurarlo y probarlo con una compra de prueba antes del 13/11.",
      },
      {
        condicion: "Oferta con fecha de vencimiento en el creativo",
        aplica: true,
        instrucciones: "Las 6 piezas dicen fechas y precios en voz alta (13/11 al 19/12, el 30% OFF de José Espejo). Si GES mueve una fecha o un precio hay que rehacer la pieza, no solo el copy del anuncio.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Ejemplares de los 3 libros disponibles para filmar y fotografiar", status: "pendiente", notas: "La producción de las 6 piezas la hace GES. Las 6 se filman y fotografían con el libro en mano, así que hay que tener los 3 ejemplares reservados para la jornada." },
        { label: "Fotos de los pliegos de mapas y del cuadernillo de fotos de Malvinas", status: "pendiente", notas: "Es el diferencial visual del libro y el eje del carrusel del Combo Soberanía." },
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a WordPress / WooCommerce", status: "pendiente", notas: "Necesario para configurar la regla de envío gratis y verificar los eventos del Pixel." },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de WhatsApp Business de GES", status: "pendiente", notas: "La campaña vende en el e-commerce, pero las consultas por stock y envío al interior caen igual por WhatsApp." },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién responde las consultas de la promo", status: "pendiente", notas: "La mecánica del combo genera preguntas (qué títulos entran, hasta cuándo, cuánto tarda el envío). Si no hay quien responda en el día, se cae la venta." },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "WooCommerce",
      descripcion: "E-commerce de Grupo Editorial Sur (grupoeditorialsur.com)",
      items: [
        { label: "Acceso admin a WooCommerce", status: "pendiente", notas: null },
        { label: "Conectar WooCommerce a REE Metrics", status: "pendiente", notas: null },
      ],
    },
    tracking: null,
  },

  koCall: {
    fechaPropuesta: null,
    duracionTotal: "30 min",
    etapas: [],
    flujoTemas: [],
    temasWow: [],
    checklist: { titulo: "Preparación", items: [] },
    proximaReunion: null,
  },

  // ── B. Estrategia ────────────────────────────────────────────────
  palanca: {
    nombre: "Oferta",
    justificacion: "GES no tiene un problema de catálogo ni de contenido: tiene tres títulos con efeméride propia y una comunidad lectora que ya lo sigue en Instagram. Lo que falta es una oferta que haga que el pedido valga el envío. El costo de envío es la fricción que rompe la compra de un libro de $38.600: el flete pesa demasiado sobre un solo título. La mecánica del combo (título destacado + cualquier otro del catálogo y el envío lo paga GES) ataca exactamente ese punto, sube el ticket promedio sin descuento sobre el precio de tapa y mueve catálogo de fondo que hoy no se vende solo. La pauta no inventa demanda: la empuja en las tres semanas del año en que estos tres temas tienen demanda propia.",
  },

  icp: [
    {
      segmento: "Lector de Malvinas y soberanía",
      descripcion: "Persona de 35 a 65 años con interés sostenido en Malvinas, historia militar y soberanía del Atlántico Sur. Veteranos y familiares, docentes de historia, viajeros de Patagonia y lectores de no ficción argentina. Es el segmento con más demanda activa del catálogo: no hay que explicarle por qué el tema importa, hay que mostrarle que este libro dice algo que no leyó antes. Compra por tema, no por autor.",
      frase: "De Malvinas leí todo lo que hay, pero siempre es el mismo relato",
      dolores: [
        "Lo que encuentra sobre Malvinas es manual escolar, panfleto o efeméride de abril",
        "Quiere entender las Islas hoy y no solo la guerra del 82",
        "Nunca estuvo en las Islas ni en el Atlántico Sur y no tiene un relato de primera mano",
        "El costo de envío le duplica la fricción cuando compra un solo libro",
      ],
      deseos: [
        "Un relato de alguien que fue a las Islas y volvió a contarlo",
        "Mapas, fotos y material que le permita ubicar geográficamente lo que lee",
        "Una mirada que combine la crónica de viaje con el análisis político",
        "Comprar directo a la editorial y recibirlo en casa en 24 o 48 horas",
      ],
      objeciones: [
        "¿Es otro libro sobre la guerra o cuenta algo distinto?",
        "¿Cuánto me sale el envío al interior?",
        "¿Quién es el autor y por qué tendría que leerlo a él?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
      badge: "Demanda activa",
      icono: "persona",
    },
    {
      segmento: "Lector de peronismo e historia sindical",
      descripcion: "Persona de 30 a 65 años con militancia o interés fuerte en peronismo, Evita y la historia del movimiento obrero. Lee a Hernán Brienza, sigue discusiones de historia política en redes y compra biografías e investigación periodística. Reconoce al autor antes que al personaje: Brienza es la puerta de entrada, José Espejo es el descubrimiento. La efeméride del 19 de diciembre, aniversario de la muerte de Espejo, le da la excusa de compra.",
      frase: "Si Brienza escribió sobre alguien que yo no conocía, lo quiero leer",
      dolores: [
        "Siente que la historia del peronismo se cuenta siempre con los mismos tres o cuatro nombres",
        "Los dirigentes sindicales de la época quedaron borrados del relato y no encuentra material sobre ellos",
        "Lo que hay sobre la CGT de Evita es académico y difícil de leer, o es militancia sin archivo",
        "Compra de a un libro y el envío le encarece el pedido",
      ],
      deseos: [
        "Una biografía con archivo y testimonios familiares, no con opinión",
        "Entender cómo se construyó el poder sindical en el primer peronismo",
        "Leer a un autor que reconoce y en el que confía",
        "Sumar dos títulos al mismo pedido y no pagar el envío",
      ],
      objeciones: [
        "¿Quién fue José Espejo y por qué debería importarme?",
        "¿Es un libro de divulgación o un ensayo académico?",
        "¿El 30% de descuento está hasta cuándo?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
      badge: "Demanda por efeméride",
      icono: "persona",
    },
    {
      segmento: "Lector de ensayo y crítica literaria",
      descripcion: "Persona de 25 a 60 años, lectora intensiva de ensayo y literatura argentina. Estudiantes y docentes de Letras, periodistas culturales, público de ferias del libro y librerías de barrio. Es el segmento más chico de los tres y el de mayor intención: compra varios títulos por año y le interesa la discusión, no la novedad. A Borges lo leyó, y por eso la única forma de venderle otro libro sobre Borges es prometerle un Borges que no leyó.",
      frase: "¿Otro libro sobre Borges? A ver qué tiene para decir que no se haya dicho",
      dolores: [
        "Hay demasiado escrito sobre Borges y casi todo repite la misma lectura canónica",
        "La crítica académica le resulta endogámica y la divulgación le resulta liviana",
        "Le interesa el Borges político y marginal, y ese es justo el que los biógrafos esquivan",
        "Compra ensayo seguido y el envío por pedido le come el presupuesto de lectura",
      ],
      deseos: [
        "Un ensayo irreverente, con una tesis propia y bien armada",
        "Entrar a Borges por los costados que no están trillados: el mito, la tragedia, el arrabal",
        "Material para pensar la argentinidad y no solo la obra",
        "Armar un pedido de dos o tres títulos de ensayo sin pagar envío",
      ],
      objeciones: [
        "¿Qué aporta este ensayo frente a la bibliografía que ya existe?",
        "¿Quién es Néstor Gabriel Leone?",
        "¿Es un libro para especialistas o lo puedo leer igual?",
      ],
      prioridad: "secundario",
      recurrencia: "alta",
      badge: "Nicho de alta intención",
      icono: "persona",
    },
  ],

  propuestaDeValor: {
    descripcion: "Editorial independiente argentina de historia, política y ensayo. Catálogo con autores reconocidos (Hernán Brienza, Néstor Gabriel Leone, Juan Augusto Rattenbach), venta directa desde grupoeditorialsur.com y entrega a domicilio en 24 a 48 horas.",
    diferenciador: "Catálogo con mirada propia sobre la historia argentina y venta directa de la editorial al lector, sin intermediación de cadena de librerías. Entrega en 24/48 h y la editorial se hace cargo del envío cuando el pedido lleva un segundo título.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Consulta por stock, precio, forma de pago o envío de uno de los 3 títulos destacados. Intención de compra clara.",
      accion: "Responder en menos de 2 horas con el link del producto y la mecánica del combo de envío gratis.",
    },
    {
      categoria: "B",
      descripcion: "Pregunta sobre el contenido del libro, el autor o qué títulos entran en el combo. Interés sin intención inmediata.",
      accion: "Responder en menos de 24 horas con la sinopsis y el link a la colección de combos.",
    },
    {
      categoria: "C",
      descripcion: "Interacción en redes (like, comentario, guardado) sin mensaje. Awareness sin intención.",
      accion: "No requiere contacto directo. Se nutre con el contenido orgánico del perfil y con remarketing.",
    },
  ],

  kpis: [
    { nombre: "Visitas a la web", objetivo: "Es lo que compra la campaña — primera lectura a los 10 días", fuente: "Meta Ads" },
    { nombre: "Costo por visita", objetivo: "A fijar con la primera lectura, y comparar los 3 libros entre sí", fuente: "Meta Ads" },
    { nombre: "Compras en la tienda", objetivo: "Cuántas de las visitas terminan comprando", fuente: "WooCommerce" },
    { nombre: "Ticket promedio", objetivo: "Por encima del precio de un título suelto — es la prueba de que el combo funciona", fuente: "WooCommerce" },
    { nombre: "Pedidos con 2 o más títulos", objetivo: "> 50% de los pedidos de la promo", fuente: "WooCommerce" },
    { nombre: "Carritos iniciados", objetivo: "Señal temprana de interés real, antes de que haya volumen de compras", fuente: "WooCommerce + Pixel" },
    { nombre: "Cuánta gente ve el anuncio y hace clic", objetivo: "Comparar los 3 libros para decidir dónde concentrar el presupuesto", fuente: "Meta Ads" },
    { nombre: "Unidades vendidas por título", objetivo: "Lectura semanal de los 3 títulos destacados", fuente: "WooCommerce" },
  ],

  presupuesto: {
    pauta: "USD 300/mes (medio de pago de GES en Meta): USD 100 por cada uno de los 3 conjuntos",
    fee: "A definir con el equipo REE",
    total: "A definir con el equipo REE",
    cplTarget: null,
    limiteGastoCuenta: "Verificar que esté por encima de USD 300/mes antes del 13/11",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_ges_meta_trafico_malvinas",
      "ree_ges_meta_trafico_espejo",
      "ree_ges_meta_trafico_borges",
    ],
  },

  creativos: {
    // 6 anuncios = 2 piezas por libro (1 video + 1 carrusel).
    // Las piezas son EXCLUSIVAS por ICP: cada libro le habla a un lector distinto,
    // así que no se duplican piezas entre conjuntos. 1 pieza = 1 dolor.
    piezasPorIcp: [
      // ═══════════════════════════════════════════════════════════════
      // ICP 1 — LECTOR DE MALVINAS Y SOBERANÍA
      // Crónica de una incursión a Malvinas — Juan Augusto Rattenbach
      // $38.600 · ISBN 9789878955599 · Combo Soberanía
      // ═══════════════════════════════════════════════════════════════
      {
        icp: "Lector de Malvinas y soberanía",
        piezas: [
          // ─── PIEZA 1 — VIDEO: TODOS OPINAMOS, CASI NADIE FUE ───────
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Malvinas se discute una vez al año, con acto escolar y eslogan. El que quiere entenderlas de verdad encuentra manual, panfleto o efeméride, pero nunca el relato de alguien que haya estado ahí.",
            solucion: "Crónica de una incursión a Malvinas, de Juan Augusto Rattenbach, a $38.600: la crónica de alguien que viajó a las Islas y volvió a contarlo, con los mapas de los viajes y las fotos del autor. Llega a domicilio en 24 o 48 horas.",
            comunicacion: "[0-4s] HOOK — Plano cenital sobre fondo oscuro, dos manos apoyan el libro cerrado y la cámara baja sobre la tapa: 'Todos opinamos de Malvinas. Casi nadie fue.' [4-9s] BODY — Las manos abren el libro en el pliego de mapas y un dedo recorre la ruta del viaje, inserto macro de los nombres de las islas: 'Juan Augusto Rattenbach fue, y volvió con esto.' [9-15s] BODY — Pase rápido de páginas hasta el cuadernillo de fotos, close-up de tres imágenes sostenidas un segundo cada una: 'No es un libro sobre la guerra. Es una crónica de viaje y a la vez un análisis político, con los mapas de los viajes y las fotos que sacó él.' [15-21s] BODY — Cenital del libro abierto con un mate y un cuaderno al costado, la cámara abre lentamente: 'Una guía por la Patagonia y el Atlántico Sur para entender Malvinas desde la experiencia, la memoria y el pensamiento crítico.' [21-26s] CTA — Las manos cierran el libro y lo apoyan de frente a cámara. Badge en edición, Mes de la Soberanía y envío gratis sumando otro título: 'Pedilo en grupoeditorialsur.com, llega en 24 o 48 horas, y si sumás cualquier otro título del catálogo el envío lo paga GES.' [26-29s] CIERRE — Motion graphics sobre fondo blanco. Logo Grupo Editorial Sur y grupoeditorialsur.com.",
            hook: "Todos opinamos de Malvinas. Casi nadie fue.",
            body: "Juan Augusto Rattenbach fue, y volvió con esto. No es un libro sobre la guerra: es una crónica de viaje y a la vez un análisis político, con los mapas de los viajes y las fotos que sacó él. Una guía por la Patagonia y el Atlántico Sur para entender Malvinas desde la experiencia, la memoria y el pensamiento crítico.",
            cta: "Pedilo en grupoeditorialsur.com, llega en 24 o 48 horas, y si sumás cualquier otro título del catálogo el envío lo paga GES.",
            copyAnuncio: "Todos opinamos de Malvinas. Casi nadie fue 🧭\n\n✅ La crónica de Juan Augusto Rattenbach, que viajó a las Islas y volvió a contarlo.\n✅ Entre crónica de viaje y análisis político, con los mapas de los viajes y sus propias fotos.\n✅ Una guía por la Patagonia y el Atlántico Sur para pensar la identidad argentina.\n\n💰 $38.600\n📦 Llega a tu domicilio en 24/48 h.\n🎁 Mes de la Soberanía: sumá cualquier otro título del catálogo y el envío lo paga GES (del 13/11 al 19/12).\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Producto",
            tema: "Malvinas desde la experiencia y no desde el eslogan",
            formatoNarrativo: "Producto en mano — Cenital con voz en off",
            estructuraNarrativa: "Hook - Revelación - Evidencia - Acción",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "26-29s",
            enRevision: false,
            destinoUrls: [URL_MALVINAS],
          },

          // ─── PIEZA 2 — CARRUSEL: COMBO SOBERANÍA ───────────────────
          {
            formato: "Carrusel (1080x1080)",
            dolor: "Quiere el libro, pero el costo de envío pesa demasiado sobre un solo título y no sabe qué más del catálogo de GES vale la pena sumar al pedido.",
            solucion: "Combo Soberanía: Crónica de una incursión a Malvinas a $38.600 más cualquier otro título del catálogo, y el envío lo paga GES del 13/11 al 19/12.",
            comunicacion: "Carrusel de 4 slides. Apertura con la tapa del libro sobre fondo oscuro y tipografía grande, los dos slides del medio con fotos reales del pliego de mapas y del cuadernillo de fotos sobre fondo claro, y cierre con la mecánica del combo en números grandes. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: Apertura — 'Mes de la Soberanía.' Tapa del libro sobre fondo oscuro, tipografía grande, bajada 'La crónica de alguien que fue a Malvinas y volvió a contarlo'.",
              "Slide 2: Qué trae — 'Mapas de los viajes y fotos del autor.' Foto real del pliego de mapas abierto y del cuadernillo de fotos, con una línea de texto al costado.",
              "Slide 3: Qué es — 'Entre crónica de viaje y análisis político.' Libro abierto en cenital con un párrafo subrayado visible y la bajada 'Una guía por la Patagonia y el Atlántico Sur'.",
              "Slide 4: Mecánica + CTA — '$38.600 y el envío lo paga GES.' Tres pasos en números grandes, sumás este libro, elegís cualquier otro título del catálogo, el envío corre por cuenta de GES. Badge 'Del 13/11 al 19/12' y 'Llega en 24/48 h'. CTA 'Pedilo en grupoeditorialsur.com'.",
            ],
            copyAnuncio: "Mes de la Soberanía en Grupo Editorial Sur 🇦🇷\n\n📖 Crónica de una incursión a Malvinas, de Juan Augusto Rattenbach.\n🗺️ Con los mapas de los viajes y las fotos del autor.\n✅ Entre crónica de viaje y análisis político: Malvinas desde la experiencia y la memoria.\n\n💰 $38.600\n🎁 Combo Soberanía: sumá cualquier otro título del catálogo y el envío lo paga GES.\n📅 Del 13/11 al 19/12.\n📦 Llega a tu domicilio en 24/48 h.\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Catálogo",
            tema: "Mecánica del Combo Soberanía — el envío lo paga GES",
            formatoNarrativo: "Oferta — Mecánica paso a paso",
            estructuraNarrativa: "Apertura - Qué trae - Qué es - Mecánica y acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: [URL_MALVINAS],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════
      // ICP 2 — LECTOR DE PERONISMO E HISTORIA SINDICAL
      // José Espejo, el Guardián de Evita — Hernán Brienza
      // $28.609 (antes $40.870, 30% OFF) · ISBN 9789878955469
      // ═══════════════════════════════════════════════════════════════
      {
        icp: "Lector de peronismo e historia sindical",
        piezas: [
          // ─── PIEZA 3 — VIDEO: EL HOMBRE OLVIDADO ───────────────────
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "La historia del peronismo se cuenta siempre con los mismos tres o cuatro nombres. Los dirigentes sindicales de la época quedaron borrados y no hay material accesible sobre ellos.",
            solucion: "José Espejo, el Guardián de Evita, de Hernán Brienza, a $28.609 con 30% de descuento: la biografía del secretario general de la CGT de Evita, reconstruida con archivos y con la memoria de su propia familia.",
            comunicacion: "[0-4s] HOOK — Plano cenital, el libro cerrado sobre una mesa de madera con una taza de café al lado, la cámara baja hasta la tapa: 'Fue el hombre más poderoso del sindicalismo argentino y terminó vendiendo café en el centro.' [4-9s] BODY — Las manos abren el libro y pasan hasta una foto de archivo de Espejo junto a Evita, inserto macro de la imagen: 'Se llamaba José Espejo y fue el secretario general de la CGT de Evita.' [9-16s] BODY — Pase de páginas con el dedo marcando párrafos, corte a la tapa con el nombre de Hernán Brienza en primer plano: 'Hernán Brienza y Damián Ferraris Espejo, nieto de José, bucearon en los archivos, los testimonios y las memorias familiares para traerlo al presente.' [16-22s] BODY — Cenital del libro abierto y la cámara abre lentamente hasta mostrar la mesa completa: 'Del chico que nació en Jáchal al obrero, al delegado, al preso político y al hombre olvidado. Es el arquetipo de una clase trabajadora que despertó su conciencia cívica.' [22-27s] CTA — Las manos cierran el libro y lo apoyan de frente a cámara. Badge en edición, 30% OFF y envío gratis sumando otro título: 'Está en grupoeditorialsur.com con 30% de descuento, y si sumás cualquier otro título el envío lo paga GES.' [27-30s] CIERRE — Motion graphics sobre fondo blanco. Logo Grupo Editorial Sur y grupoeditorialsur.com.",
            hook: "Fue el hombre más poderoso del sindicalismo argentino y terminó vendiendo café en el centro.",
            body: "Se llamaba José Espejo y fue el secretario general de la CGT de Evita. Hernán Brienza y Damián Ferraris Espejo, nieto de José, bucearon en los archivos, los testimonios y las memorias familiares para traerlo al presente. Del chico que nació en Jáchal al obrero, al delegado, al preso político y al hombre olvidado: el arquetipo de una clase trabajadora que despertó su conciencia cívica.",
            cta: "Está en grupoeditorialsur.com con 30% de descuento, y si sumás cualquier otro título el envío lo paga GES.",
            copyAnuncio: "Fue el hombre más poderoso del sindicalismo argentino. Murió vendiendo café en el centro ☕\n\n📖 José Espejo, el Guardián de Evita — el nuevo libro de Hernán Brienza.\n✅ Escrito con Damián Ferraris Espejo, nieto de José: archivos, testimonios y memorias familiares.\n✅ Del chico de Jáchal al secretario general de la CGT de Evita, al preso político y al exiliado.\n\n💰 $28.609 (antes $40.870, 30% OFF)\n🎁 Combo Homenaje: sumá cualquier otro título del catálogo y el envío lo paga GES.\n📅 Del 13/11 al 19/12, aniversario de su fallecimiento.\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Autor",
            tema: "El dirigente borrado de la historia del peronismo",
            formatoNarrativo: "Producto en mano — Cenital con voz en off",
            estructuraNarrativa: "Hook - Quién fue - Cómo se reconstruyó - Acción",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "27-30s",
            enRevision: false,
            destinoUrls: [URL_ESPEJO],
          },

          // ─── PIEZA 4 — CARRUSEL: DE JÁCHAL A LA CGT ────────────────
          {
            formato: "Carrusel (1080x1080)",
            dolor: "No conoce a José Espejo y no entiende por qué debería leer una biografía de alguien de quien nunca escuchó hablar.",
            solucion: "Combo Homenaje a José Espejo: la biografía de Brienza a $28.609 con 30% OFF, contada como el arco de una vida completa, más cualquier otro título del catálogo con el envío pago por GES.",
            comunicacion: "Carrusel de 4 slides que funciona como línea de tiempo de una vida. Apertura con la tapa del libro sobre fondo oscuro, los dos slides del medio con fotos de archivo tratadas y texto grande que marca cada etapa, cierre con el precio y la mecánica del combo. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: Apertura — '¿Quién fue José Espejo?' Tapa del libro sobre fondo oscuro con la bajada 'El Guardián de Evita, por Hernán Brienza'.",
              "Slide 2: El ascenso — 'De Jáchal, San Juan, a la CGT de Evita.' Foto de archivo de Espejo con Evita y tres hitos en texto grande, el niño, el obrero, el delegado, el secretario general.",
              "Slide 3: La caída — 'El preso político, el exiliado, el hombre que terminó vendiendo café en el centro.' Foto de archivo tratada en blanco y negro con la bajada 'Archivos, testimonios y memorias familiares, reconstruidos con su nieto'.",
              "Slide 4: Precio + CTA — '$28.609, antes $40.870. 30% OFF.' Badge 'Combo Homenaje, el envío lo paga GES sumando otro título' y 'Del 13/11 al 19/12'. CTA 'Pedilo en grupoeditorialsur.com'.",
            ],
            copyAnuncio: "¿Quién fue José Espejo, el Guardián de Evita? 🕯️\n\n📖 El nuevo libro de Hernán Brienza, escrito con Damián Ferraris Espejo, nieto de José.\n✅ Del niño que nació en Jáchal al secretario general de la CGT de Evita.\n✅ El preso político, el exiliado, el hombre olvidado que terminó vendiendo café en el centro.\n✅ Una biografía imperdible para entender mejor a nuestro país y sus circunstancias.\n\n💰 $28.609 (antes $40.870, 30% OFF)\n🎁 Combo Homenaje: sumá cualquier otro título y el envío lo paga GES.\n📅 Del 13/11 al 19/12.\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Catálogo",
            tema: "El arco de una vida — del obrero de Jáchal al hombre olvidado",
            formatoNarrativo: "Educativo — Línea de tiempo",
            estructuraNarrativa: "Pregunta - Ascenso - Caída - Precio y acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: [URL_ESPEJO],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════
      // ICP 3 — LECTOR DE ENSAYO Y CRÍTICA LITERARIA
      // Código Borges — Néstor Gabriel Leone · $41.100
      // Combo Homenaje a 40 años de su muerte (1986)
      // ═══════════════════════════════════════════════════════════════
      {
        icp: "Lector de ensayo y crítica literaria",
        piezas: [
          // ─── PIEZA 5 — VIDEO: ¿OTRO LIBRO SOBRE BORGES? ────────────
          {
            formato: "Video Comercial Vertical (9:16)",
            dolor: "Ya leyó Borges y leyó sobre Borges. Lo que encuentra repite la lectura canónica, y la objeción le sale sola, para qué otro libro más sobre el mismo autor.",
            solucion: "Código Borges, de Néstor Gabriel Leone, a $41.100: un ensayo que lo aborda desde los puntos de vista que esquivaron sus biógrafos, el Borges marginal, el político, el que construye un universo popular.",
            comunicacion: "[0-4s] HOOK — Plano cenital, el libro cerrado apoyado sobre una pila de ediciones gastadas de Borges, la cámara baja sobre la tapa: '¿Otro libro sobre Borges? En serio.' [4-8s] HOOK — Una mano saca el libro de la pila y lo deja solo en el centro del cuadro, el resto de los libros queda fuera de foco: 'Sí. Y es el que faltaba.' [8-15s] BODY — Las manos abren el libro y van marcando subrayados con lápiz, inserto macro de un párrafo: 'Código Borges, de Néstor Gabriel Leone, lo lee desde donde no lo leyeron sus biógrafos. El Borges marginal, el político, el que huye hacia los arrabales del Sur y construye un universo popular.' [15-22s] BODY — Pase de páginas en cenital con el lápiz y un cuaderno de notas al costado: 'Borges como mito, Borges como tragedia, Borges como metáfora total del caos de la argentinidad y sus contradicciones.' [22-27s] CTA — Las manos cierran el libro y lo apoyan de frente a cámara. Badge en edición, 40 años y envío gratis sumando otro título: 'A 40 años de su muerte, pedilo en grupoeditorialsur.com, y si sumás cualquier otro título el envío lo paga GES.' [27-30s] CIERRE — Motion graphics sobre fondo blanco. Logo Grupo Editorial Sur y grupoeditorialsur.com.",
            hook: "¿Otro libro sobre Borges? En serio. Sí, y es el que faltaba.",
            body: "Código Borges, de Néstor Gabriel Leone, lo lee desde donde no lo leyeron sus biógrafos: el Borges marginal, el político, el que huye hacia los arrabales del Sur y construye un universo popular. Borges como mito, como tragedia y como metáfora total del caos de la argentinidad y sus contradicciones.",
            cta: "A 40 años de su muerte, pedilo en grupoeditorialsur.com, y si sumás cualquier otro título el envío lo paga GES.",
            copyAnuncio: "¿Otro libro sobre Borges? ¿En serio? 📚\n\nSí. Porque todavía hay mucho para decir.\n\n✅ Código Borges, de Néstor Gabriel Leone: un ensayo profundo, irreverente y disruptivo.\n✅ El Borges marginal, el político, el que huye hacia los arrabales del Sur.\n✅ Borges como mito, como tragedia y como metáfora del caos de la argentinidad.\n\n💰 $41.100\n🎁 Homenaje a 40 años de su muerte: sumá cualquier otro título y el envío lo paga GES.\n📅 Del 13/11 al 19/12.\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Producto",
            tema: "El Borges que los biógrafos esquivaron",
            formatoNarrativo: "Producto en mano — Cenital con voz en off",
            estructuraNarrativa: "Objeción - Resolución - Tesis - Acción",
            tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
            duracion: "27-30s",
            enRevision: false,
            destinoUrls: [URL_BORGES],
          },

          // ─── PIEZA 6 — CARRUSEL: CINCO BORGES ──────────────────────
          {
            formato: "Carrusel (1080x1080)",
            dolor: "No sabe qué tesis trae el ensayo ni en qué se diferencia de la bibliografía que ya existe, y sin eso no paga $41.100 por otro libro sobre Borges.",
            solucion: "Combo Homenaje a 40 años: Código Borges a $41.100, con las entradas del ensayo puestas sobre la mesa de entrada, más cualquier otro título del catálogo con el envío pago por GES.",
            comunicacion: "Carrusel de 4 slides que pone la tesis del ensayo a la vista. Apertura tipográfica sobre fondo oscuro sin foto de producto, dos slides centrales con las dimensiones del libro listadas en texto grande sobre fondo claro, cierre con la tapa, el precio y la mecánica del combo. Adaptar a Story (1080x1920).",
            mensajes: [
              "Slide 1: Apertura — '¿Otro libro sobre Borges? Sí.' Solo tipografía grande sobre fondo oscuro, con la bajada 'Porque todavía hay mucho para decir'.",
              "Slide 2: Las dimensiones — 'El Borges marginal. El político. El que huye hacia los arrabales del Sur.' Lista en texto grande sobre fondo claro, una línea por dimensión.",
              "Slide 3: La tesis — 'Borges como mito, como tragedia y como metáfora total del caos de la argentinidad.' Texto grande con un párrafo del libro citado al pie y el nombre de Néstor Gabriel Leone.",
              "Slide 4: Precio + CTA — '$41.100. Homenaje a 40 años de su muerte.' Tapa del libro, badge 'Sumá cualquier otro título y el envío lo paga GES' y 'Del 13/11 al 19/12'. CTA 'Pedilo en grupoeditorialsur.com'.",
            ],
            copyAnuncio: "Cinco Borges que los biógrafos esquivaron 📖\n\n🔹 El Borges marginal.\n🔹 El político.\n🔹 El que huye hacia los arrabales del Sur.\n🔹 El que construye un universo popular.\n🔹 Borges como mito, como tragedia y como metáfora del caos de la argentinidad.\n\n✅ Código Borges, de Néstor Gabriel Leone: un ensayo profundo, revelador y disruptivo.\n\n💰 $41.100\n🎁 Homenaje a 40 años de su muerte: sumá cualquier otro título y el envío lo paga GES.\n📅 Del 13/11 al 19/12.\n\n👉 Pedilo en grupoeditorialsur.com",
            pilar: "Catálogo",
            tema: "La tesis del ensayo a la vista — qué Borges es este",
            formatoNarrativo: "Educativo — Guía Visual",
            estructuraNarrativa: "Objeción - Dimensiones - Tesis - Precio y acción",
            tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Motion Graphics" },
            enRevision: false,
            destinoUrls: [URL_BORGES],
          },
        ],
      },
    ],
    resumenPiezas: "6 anuncios: 1 video vertical + 1 carrusel por cada uno de los 3 libros, uno por conjunto",
    formatos: ["Video Comercial Vertical (9:16)", "Carrusel (1080x1080)", "Story (1080x1920)"],
    tono: "Serio pero no solemne. Se habla desde el contenido del libro, nunca desde el adjetivo: en lugar de decir que es imperdible, se cuenta qué tiene adentro. Primera línea siempre con un dato o una pregunta que incomode, nada de lenguaje de catálogo ni de contratapa. La efeméride da la fecha, no el argumento.",
    notaPiezas: "Pauta de edición para las 6 piezas: (1) los 3 videos se filman en el mismo rodaje, mismo set cenital, misma luz y misma voz en off, cambia el libro; (2) el libro siempre en mano y abierto, los mapas, las fotos de archivo y los subrayados son el único recurso visual, no hay stock; (3) subtítulos quemados en los 3 videos, centrados y fuera del tercio inferior para que no los tape la UI de Reels; (4) los 3 carruseles comparten grilla tipográfica y badge de mecánica, cambia el contenido; (5) entrega en 9:16 (1080x1920) para video y 1080x1080 más adaptación a Story para los carruseles, a la carpeta compartida de Drive.",
  },

  arquitectura: [
    {
      nombre: "GES_Trafico",
      objetivo: "Tráfico",
      status: "en-desarrollo",
      tituloSeccion: "Foundation — Campaña de Tráfico (3 libros)",
      tituloSubseccion: "Campaña de Tráfico en Meta Ads",
      descripcionCampana: "Una sola campaña que manda gente a la web, con <strong>3 conjuntos y 6 anuncios</strong>, para empujar los tres títulos con efeméride propia entre el viernes 13/11 y el 19/12.<br><br><strong>Qué compramos.</strong> Visitas a las fichas de los 3 libros. No le pedimos a Meta que salga a buscar compradores: con USD 100 por libro no hay volumen de compras para que aprenda a hacerlo. Traemos lectores a la web y la compra la leemos después en la tienda, que es donde se ve de verdad si el libro se vende y si el combo sube el ticket.<br><br><strong>Por qué una sola campaña.</strong> Los tres libros comparten la misma promo y el mismo destino. Partirlos en tres campañas separadas triplica la estructura sin necesidad: una campaña, tres conjuntos, y la lectura se hace por conjunto.<br><br><strong>Un libro, un público, dos anuncios.</strong><br>• <strong>Conjunto_Malvinas_Soberania</strong> — Crónica de una incursión a Malvinas ($38.600). Un video con los mapas y las fotos del autor, y un carrusel con la promo del Combo Soberanía.<br>• <strong>Conjunto_Peronismo_MemoriaSindical</strong> — José Espejo, el Guardián de Evita ($28.609, 30% OFF). Un video sobre el dirigente borrado de la historia, y un carrusel con el arco de su vida.<br>• <strong>Conjunto_Borges_EnsayoLiterario</strong> — Código Borges ($41.100). Un video que ataca la objeción de frente, y un carrusel que pone la tesis del ensayo a la vista.<br><br><strong>La promo es la misma en los tres.</strong> Comprás el título destacado más cualquier otro del catálogo y el envío lo paga GES. No es un descuento sobre el precio de tapa: es sacar del medio el costo del envío a cambio de un segundo libro. Sube el ticket, mueve catálogo de fondo y no toca el margen por unidad.<br><br><strong>Los anuncios son exclusivos de cada conjunto.</strong> Cada libro le habla a un lector distinto, así que no se repite ni un anuncio entre conjuntos. Lo que comparamos entre los tres no es el anuncio, es el libro.",
      destino: "grupoeditorialsur.com — fichas de los 3 títulos destacados",
      kpisCampana: ["Visitas a la web", "Costo por visita", "Compras en la tienda", "Ticket promedio"],
      conversionCampana: "Visitas a grupoeditorialsur.com",
      presupuestoCampana: { diario: "USD $10/día — USD $3,3 por conjunto", mensual: "USD $300/mes — USD $100 por libro" },
      adSets: [
        {
          nombre: "Conjunto_Malvinas_Soberania",
          segmentacion: "35-65 años, Argentina con foco en CABA, Gran Buenos Aires, Córdoba, Santa Fe, Mendoza, Chubut, Santa Cruz y Tierra del Fuego. Intereses: Libros, Lectura, Historia, Libros electrónicos. Comportamiento: Compradores interesados. Demografía: Nivel educativo universitario o superior. Nota: Meta no tiene intereses de temas puntuales como Islas Malvinas, Soberanía nacional o Veteranos de guerra, así que el conjunto se queda con los intereses más genéricos de lectura y de historia y la calificación fina la hace el creativo, que nombra el libro y el autor — en geo es el más amplio de los tres porque suma las provincias del sur donde el tema pega más fuerte, y se lee con el desglose por región de Meta para recortar lo que no rinda.",
          ads: [
            "Anuncio_Reel_CasiNadieFue_V1 | Video cenital, todos opinamos de Malvinas y casi nadie fue — Crónica de una incursión a Malvinas",
            "Anuncio_Carrusel_ComboSoberania_V1 | Carrusel, mapas y fotos del autor más la mecánica del Combo Soberanía",
          ],
        },
        {
          nombre: "Conjunto_Peronismo_MemoriaSindical",
          segmentacion: "30-65 años, Argentina con foco en CABA, Gran Buenos Aires, Santa Fe, Córdoba, Tucumán y San Juan. Intereses: Libros, Lectura, Historia, Libros de política. Comportamiento: Compradores interesados. Demografía: Nivel educativo universitario o superior. Nota: Los intereses de afiliación política como Peronismo, Eva Perón o Sindicalismo ya no existen en el targeting detallado de Meta desde que se dieron de baja las categorías sensibles, así que lo más cerca que se llega es Libros de política sobre una base genérica de lectura e historia, y el filtro real lo hace el creativo, que nombra a Hernán Brienza y a Evita en los primeros tres segundos — San Juan entra en la geo por Jáchal, la localidad donde nació José Espejo.",
          ads: [
            "Anuncio_Reel_HombreOlvidado_V1 | Video cenital, el hombre más poderoso del sindicalismo que terminó vendiendo café — José Espejo",
            "Anuncio_Carrusel_DeJachalALaCGT_V1 | Carrusel línea de tiempo, de Jáchal a la CGT de Evita, 30% OFF",
          ],
        },
        {
          nombre: "Conjunto_Borges_EnsayoLiterario",
          segmentacion: "25-60 años, Argentina con foco en CABA, Gran Buenos Aires, Rosario, La Plata, Córdoba y Mendoza. Intereses: Libros, Lectura, Literatura, Libros electrónicos. Comportamiento: Compradores interesados. Demografía: Campo de estudio Literatura o Humanidades, nivel educativo universitario o superior. Nota: Jorge Luis Borges tampoco es un interés de Meta, así que este conjunto se queda con los intereses genéricos de lectura y literatura y es el único que puede sumar campo de estudio como señal — Literatura y Humanidades es lo más cerca que se llega del perfil — y el creativo que arranca preguntando si hace falta otro libro sobre Borges hace el resto del filtro, con el CPM más alto esperado de los tres y lectura por costo por visita, no por alcance.",
          ads: [
            "Anuncio_Reel_OtroLibroSobreBorges_V1 | Video cenital, ¿otro libro sobre Borges? sí, y es el que faltaba — Código Borges",
            "Anuncio_Carrusel_CincoBorges_V1 | Carrusel, las cinco dimensiones del ensayo y el combo de 40 años",
          ],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Equipo de Grupo Editorial Sur",
    capacidadDiaria: "A validar antes del launch.",
    tiempoRespuesta: "A validar antes del launch.",
    validado: false,
  },

  ofertas: [
    {
      nombre: "Combo Soberanía — Crónica de una incursión a Malvinas",
      descripcion: "Crónica de una incursión a Malvinas, de Juan Augusto Rattenbach + cualquier otro título del catálogo. El envío corre por cuenta de GES. Mes de la Soberanía, del viernes 13/11 al 19/12. Llega a domicilio en 24/48 h.",
      precio: "$38.600 el título destacado",
    },
    {
      nombre: "Combo Homenaje a José Espejo",
      descripcion: "José Espejo, el Guardián de Evita, de Hernán Brienza + cualquier otro título del catálogo. El envío corre por cuenta de GES. Mes homenaje al dirigente sindical, fallecido el 19 de diciembre de 1980, del 13/11 al 19/12.",
      precio: "$28.609 (antes $40.870, 30% OFF)",
    },
    {
      nombre: "Combo Homenaje Borges — 40 años",
      descripcion: "Código Borges, de Néstor Gabriel Leone + cualquier otro título del catálogo. El envío corre por cuenta de GES. Homenaje a 40 años de su muerte, ocurrida en 1986, del 13/11 al 19/12.",
      precio: "$41.100 el título destacado",
    },
  ],

  cambiosEcommerce: [
    { cambio: "Subir la galería completa de cada ficha: tapa, contratapa, lomo y al menos 2 fotos de interior. Hoy Crónica de una incursión a Malvinas tiene 1 sola imagen, y José Espejo y Código Borges tienen 2 (tapa y contratapa)", objetivo: "El lector no puede ver el libro antes de comprarlo. Es la primera razón por la que abandona una ficha de más de $38.000" },
    { cambio: "Fotografiar el interior de los 3 títulos con la tipografía legible, y en Malvinas sumar el pliego de mapas y el cuadernillo de fotos abiertos", objetivo: "Mostrar lo que el libro tiene adentro y que no se ve en la tapa. En Malvinas es el diferencial visual del título" },
    { cambio: "Sumar una foto del libro en mano en las 3 fichas", objetivo: "Dar escala real: el tamaño del libro es la duda silenciosa de toda compra online" },
    { cambio: "Completar la ficha técnica (Información adicional) de los 3 títulos: cantidad de páginas, medidas, peso, encuadernación, año y colección. Hoy solo José Espejo tiene Peso 300 g y Dimensiones 23 × 15 × 3 cm; Malvinas y Borges no tienen ninguna", objetivo: "Son los datos que el lector busca antes de pagar. Sin ellos la objeción queda sin respuesta y se va a buscarla a otro lado" },
    { cambio: "Etiquetar el ISBN como ISBN y no como SKU. Ya está cargado en los 3: 9789878955599 (Malvinas), 9789878955469 (José Espejo) y 9789878955513 (Código Borges)", objetivo: "El ISBN visible da señal de editorial seria y además ayuda a que la ficha aparezca cuando alguien busca el libro por código" },
    { cambio: "Reescribir la descripción corta de los 3 títulos en 2 o 3 líneas que digan de qué trata el libro. Hoy la de José Espejo arranca con emojis y la de Malvinas es una cita larga del autor", objetivo: "Es lo primero que lee quien llega del anuncio. Tiene que confirmar en un segundo que llegó al libro correcto" },
    { cambio: "Ordenar la descripción larga en bloques con subtítulos: de qué trata, qué se lleva el lector, para quién es y sobre el autor", objetivo: "Un bloque de texto corrido no se lee en el celular. Con subtítulos el lector saltea hasta lo que le importa y se queda en la ficha" },
    { cambio: "Poner un badge con la promo arriba del botón Añadir al carrito, con la mecánica y la fecha de cierre (19/12)", objetivo: "Sostener en la ficha la promesa que hizo el anuncio. Si el lector no la encuentra donde paga, no la cree" },
    { cambio: "Activar las valoraciones en los 3 productos y sembrar las primeras reseñas", objetivo: "Los 3 títulos no tienen ninguna reseña cargada. Es la prueba social que hoy la ficha no ofrece" },
    { cambio: "Reemplazar los productos relacionados automáticos por una venta cruzada elegida a mano, proponiendo el segundo título que completa el combo", objetivo: "La promo pide un segundo libro. Si la ficha ya sugiere cuál, el carrito se arma solo en lugar de obligar al lector a buscar en el catálogo" },
  ],

  competenciaAds: {
    marca: "Editoriales independientes de historia y política",
    cuenta: "grupoeditorialsur",
    adLibraryUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=editorial",
    formatos: [],
    competidores: [
      { nombre: "Marea Editorial", estado: "@mareaeditorial — Editorial independiente de no ficción, política y periodismo de investigación. Es el competidor más directo por catálogo y por perfil de lector. Volumen de pauta a verificar en Ad Library antes del launch.", activo: true, instagramUrl: "https://www.instagram.com/mareaeditorial/" },
      { nombre: "Siglo XXI Argentina", estado: "@sigloxxiarg — El jugador grande del segmento: ciencias sociales e historia con respaldo académico y distribución en cadenas. Juega en otra escala de presupuesto y de catálogo.", activo: true, instagramUrl: "https://www.instagram.com/sigloxxiarg/" },
      { nombre: "Futurock", estado: "@futurockok — Brazo editorial de la radio. Su ventaja no es la pauta, es la audiencia propia que ya tiene construida en el aire y en redes. Compite por el mismo lector político.", activo: true, instagramUrl: "https://www.instagram.com/futurockok/" },
      { nombre: "Sudestada", estado: "@libreriasudestada — Revista, librería y editorial con venta directa y comunidad fiel. El modelo más parecido al de GES en cuanto a vender de la editorial al lector sin intermediarios.", activo: true, instagramUrl: "https://www.instagram.com/libreriasudestada/" },
      { nombre: "Ediciones CICCUS", estado: "@edicionesciccus — Catálogo de ciencias sociales, educación y cooperativismo. Perfil más institucional y académico, menos orientado a venta directa al lector final.", activo: true, instagramUrl: "https://www.instagram.com/edicionesciccus/" },
    ],
    observacion: "El segmento de editoriales independientes de historia y política en Argentina compite casi todo por **orgánico y comunidad**, no por pauta: cuentas de Instagram activas, presencia en ferias y venta directa, con poca inversión sostenida en Meta Ads. **Antes del launch hay que verificar el volumen real de pauta de cada una en la Meta Ad Library** — la lectura de arriba es de posicionamiento editorial, no de inversión medida. Si se confirma que el segmento pauta poco, el CPM debería ser bajo y GES entra a competir en un espacio con poca saturación publicitaria. **La oportunidad no está en el libro, está en la mecánica.** El resto comunica novedad, tapa y contratapa. GES puede comunicar algo distinto: el envío lo paga la editorial si sumás un segundo título. Es la única oferta del segmento que ataca la fricción real de comprar un libro online en Argentina, y además mueve catálogo de fondo en lugar de regalar margen.",
  },

  notas: "Foundation de Grupo Editorial Sur. Primer cliente de la vertical editorial. Modelo B2C puro con e-commerce propio (WooCommerce sobre WordPress).\n\nEstructura pedida por el equipo y respetada tal cual: 1 campaña, 3 conjuntos, 6 anuncios. Un conjunto por libro y dos piezas por conjunto, 1 video vertical + 1 carrusel. Las piezas son exclusivas por conjunto porque cada libro le habla a un lector distinto: no se duplica ninguna pieza entre conjuntos.\n\nPrecios y contenidos verificados en grupoeditorialsur.com el 04/11/2026. Crónica de una incursión a Malvinas: $38.600, ISBN 9789878955599. José Espejo, el Guardián de Evita: $28.609 con 30% OFF sobre un precio de lista de $40.870, ISBN 9789878955469. Código Borges: $41.100. Las 6 piezas dicen esos números en voz alta, así que si GES cambia un precio antes del rodaje hay que rehacer la pieza.\n\nALERTA DE VIGENCIA: la ficha de José Espejo marca el precio promocional de $28.609 con vigencia hasta el 18/11/2026, pero la promo del combo corre hasta el 19/12. Hay que confirmar con GES si el 30% OFF se sostiene las 5 semanas. Si no se sostiene, el video y el carrusel de Espejo tienen que decir otro número.\n\nLÍMITE DE APRENDIZAJE: con USD 100/mes por conjunto y un ticket de entre $28.609 y $41.100, cada conjunto va a juntar pocas compras por semana y no alcanza el umbral para que Meta optimice por Compra. Por eso la campaña salió a Tráfico: se paga la visita a la ficha y la compra se lee en la tienda como KPI de negocio. A los 10 días se compara costo por visita entre los 3 conjuntos y qué porcentaje de esas visitas terminó comprando; si un título no levanta, su presupuesto pasa a los otros dos. Se mantuvieron los 3 conjuntos porque es lo que pidió el equipo y porque la lectura por libro es lo que define qué título se escala en enero.\n\nBLOQUEANTE DE LANZAMIENTO: la oferta no es un producto ni un descuento, es una regla de carrito. El envío gratis tiene que aplicarse solo cuando el pedido lleva el título destacado más cualquier otro del catálogo. Si WooCommerce no lo hace automáticamente, el anuncio promete algo que el checkout no cumple y se pierde la venta en el último paso. Hay que configurarlo y validarlo con una compra de prueba de cada combo antes del 13/11.\n\nINTERESES REARMADOS (04/11): la primera versión usaba intereses hiper específicos por tema (Islas Malvinas, Peronismo, Eva Perón, Jorge Luis Borges, Hernán Brienza, Veteranos de guerra, Sindicalismo). No sirven por dos motivos distintos: los de tema puntual nunca existieron en el targeting detallado de Meta, y los de afiliación política se dieron de baja con la eliminación de las categorías sensibles. La segunda versión los reemplazó por una lista intermedia (Libros de historia, Biografías, No ficción, Librerías, Periodismo, Documentales, Ficción literaria, Poesía, Bibliotecas) que sigue siendo demasiado fina: varios de esos nombres tampoco aparecen en el buscador del ad set. Los 3 conjuntos quedaron entonces con el núcleo genérico que sí existe — Libros, Lectura, Historia, Literatura, Libros electrónicos — más comportamiento de compra y nivel educativo, con un único diferenciador por conjunto: Historia en Malvinas, Libros de política en Espejo (el más específico que sobrevive) y Literatura más campo de estudio en Borges. Cada interés hay que confirmarlo en el buscador del ad set al momento de armar la campaña y reemplazar el que no aparezca con el que Meta sugiera al lado. Consecuencia estratégica: con intereses tan amplios la diferenciación entre conjuntos la hace el creativo, no el ad set, así que la prioridad pasa a ser levantar los públicos propios (lista de clientes de WooCommerce, visitantes del sitio, interacciones con el perfil y lookalike 1% de compradores).\n\nCompetencia: las 5 cuentas que pasó el equipo (Marea, Siglo XXI, Futurock, Sudestada, CICCUS) están descriptas por posicionamiento editorial, no por inversión medida. El volumen de anuncios activos de cada una NO está verificado: hay que revisarlo en la Meta Ad Library antes del launch y actualizar las tarjetas con el número real.\n\nDatos que faltan para completar el Foundation: nombre del contacto en GES, fee del servicio, número de WhatsApp Business, acceso admin a WooCommerce y el link de invitación a REE Metrics.",

  referenciasMoodboard: [
    { url: "https://www.instagram.com/grupoeditorialsur/", titulo: "Grupo Editorial Sur — perfil propio" },
    { url: "https://www.instagram.com/mareaeditorial/", titulo: "Marea Editorial — competidor directo" },
    { url: "https://www.instagram.com/sigloxxiarg/", titulo: "Siglo XXI Argentina" },
    { url: "https://www.instagram.com/futurockok/", titulo: "Futurock" },
    { url: "https://www.instagram.com/libreriasudestada/", titulo: "Sudestada — venta directa al lector" },
    { url: "https://www.instagram.com/edicionesciccus/", titulo: "Ediciones CICCUS" },
    { url: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=editorial%20independiente", titulo: "Ad Library — editoriales independientes en Argentina" },
  ],

  entregaMaterial: {
    destino: "Google Drive",
    descripcion: "Las 6 piezas se entregan en una carpeta compartida con GES, agrupadas por libro, con el copy del anuncio en un .txt al lado de cada pieza y las adaptaciones a Story junto a cada carrusel.",
    arbol: [
      "GES x REE Growth/",
      "└── Ventas Noviembre-Diciembre/",
      "    ├── 01 Malvinas/",
      "    │   ├── 01_Video_CasiNadieFue/",
      "    │   └── 02_Carrusel_ComboSoberania/",
      "    ├── 02 Jose Espejo/",
      "    │   ├── 03_Video_HombreOlvidado/",
      "    │   └── 04_Carrusel_DeJachalALaCGT/",
      "    └── 03 Codigo Borges/",
      "        ├── 05_Video_OtroLibroSobreBorges/",
      "        └── 06_Carrusel_CincoBorges/",
    ],
  },

  roadmap: [
    { nombre: "GES_Trafico — 3 libros", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 3, semanaFin: 5 },
      { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
    ]},
  ],

  seccionesBloqueadas: [],

  reviewEtapas: [
    { nombre: "Apertura", duracion: "5 min", objetivo: "Qué trae este documento: la campaña de los 3 libros lista para lanzar el viernes 13/11." },
    { nombre: "Competencia + ICPs", duracion: "10 min", objetivo: "Contra quién competimos en Meta y a qué lector le habla cada uno de los 3 libros." },
    { nombre: "Las 6 piezas", duracion: "20 min", objetivo: "Guion a guion y slide a slide: los 3 videos y los 3 carruseles, con precios y fechas a confirmar." },
    { nombre: "Campaña + presupuesto", duracion: "10 min", objetivo: "1 campaña, 3 conjuntos, 6 anuncios. Audiencias, reparto de los USD 300 y qué se mira a los 10 días." },
    { nombre: "E-commerce", duracion: "10 min", objetivo: "Qué hay que actualizar en WordPress en las 3 fichas de producto, y la regla de envío gratis en WooCommerce." },
    { nombre: "Cierre", duracion: "5 min", objetivo: "Quién hace qué esta semana y aprobación para producir y lanzar." },
  ],

  proximosPasos: [
    {
      titulo: "REE Growth",
      responsable: "REE Growth",
      tiempo: "Semana del 09/11",
      items: [
        "Armar GES_Trafico en Meta Ads: 1 campaña, 3 conjuntos y 6 anuncios, con los USD 300 repartidos entre los 3 libros",
        "Cargar las audiencias: los intereses de los 3 conjuntos más los públicos propios (clientes de la tienda, visitantes de la web y seguidores de @grupoeditorialsur)",
        "Dejar la medición andando y conectar la tienda a REE Metrics",
      ],
    },
    {
      titulo: "Grupo Editorial Sur",
      responsable: "Grupo Editorial Sur",
      tiempo: "Del 09/11 al 12/11",
      items: [
        "Actualizar las 3 páginas de producto en WordPress con los cambios de la sección de E-commerce",
        "Configurar la regla de envío gratis en WooCommerce y probarla comprando los 3 combos. Es el único bloqueante del launch",
        "Producir las 6 piezas con los guiones de este documento y entregarlas en Drive el jueves 12/11",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "KO Call", fecha: "02/11" },
    { semana: 2, label: "Entrega Foundation", fecha: "09/11" },
    { semana: 2, label: "Foundation Review", fecha: "10/11" },
    { semana: 2, label: "Launch", fecha: "13/11" },
    { semana: 3, label: "Call ADS", fecha: "17/11" },
    { semana: 5, label: "Call ADS", fecha: "01/12" },
    { semana: 7, label: "Cierre promo", fecha: "19/12" },
    { semana: 8, label: "Review final", fecha: "22/12" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "KO Call", fecha: "Lunes 02/11", desc: "Arranque del proyecto con GES. Objetivo de la campaña, los 3 títulos a empujar, la mecánica de la promo de envío gratis y el presupuesto de USD 300/mes.", status: "done" },
    { semana: "S1", nombre: "Armado del Foundation", fecha: "03/11 al 07/11", desc: "Bajada de la campaña de los 3 libros: 1 campaña, 3 conjuntos, 6 anuncios. Verificación de precios y contenidos en grupoeditorialsur.com, definición de los 3 lectores y guionado de las 6 piezas.", status: "done" },
    { semana: "S2", nombre: "Entrega del Foundation", fecha: "Lunes 09/11", desc: "Se envía este documento con los 6 guiones cerrados para que arranque la producción de los videos y los carruseles.", status: "done" },
    { semana: "S2", nombre: "Foundation Review", fecha: "Martes 10/11", desc: "Revisión completa con GES: competencia, los 3 lectores, las 6 piezas guion por guion, la campaña en Meta Ads, los cambios en las 3 fichas de producto y la regla de envío gratis en WooCommerce. Aprobación para lanzar.", status: "current" },
    { semana: "S2", nombre: "Launch", fecha: "Viernes 13/11", desc: "Activación de GES_Trafico con los 3 conjuntos y los 6 anuncios, el mismo día que arranca la promo de envío gratis. Compra de prueba de los 3 combos validada antes de encender.", status: "pending" },
    { semana: "S3", nombre: "Call ADS", fecha: "Martes 17/11", desc: "Primera lectura: costo por visita por conjunto, ticket promedio, porcentaje de pedidos con 2 o más títulos y qué formato traccionó por libro. Primera redistribución de presupuesto.", status: "pending" },
    { semana: "S5", nombre: "Call ADS", fecha: "Martes 01/12", desc: "Segunda lectura con tres semanas de datos. Decisión sobre la segunda tanda de piezas y sobre qué título concentra el presupuesto hasta el cierre.", status: "pending" },
    { semana: "S7", nombre: "Cierre promo", fecha: "Sábado 19/12", desc: "Último día de la promo de envío gratis. Se frena la pauta de combo y se evalúa qué sostener en enero.", status: "pending" },
    { semana: "S8", nombre: "Review final", fecha: "Martes 22/12", desc: "Cierre del ciclo: resultados contra KPIs, qué libro escaló, qué dejó la mecánica del combo en ticket promedio y plan para enero.", status: "pending" },
  ],
};

// --- Generar solo el Foundation Review ---
// Es el entregable principal de la skill: las cards de las 6 piezas viven
// adentro del propio documento, así que no hace falta el brief aparte.
// GES ya está onboardeado bajo growth@, así que tampoco se genera el onboarding.

const strategy = renderStrategyHtml(data);

const slug = data.clientInfo.slug;
const clientDir = new URL("./", import.meta.url).pathname;
const projectRoot = new URL("../../", import.meta.url).pathname;
const desktop = join(homedir(), "Desktop");

const outDir = join(clientDir, "strategies");
const outFile = `foundation-review-${slug}.html`;
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, outFile);
if (existsSync(outPath)) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const bakPath = join(outDir, outFile.replace(".html", `.bak.${ts}.html`));
  copyFileSync(outPath, bakPath);
  console.log(`Backup: ${bakPath}`);
}
writeFileSync(outPath, strategy, "utf-8");
console.log(`Done: ${outPath}`);

const desktopPath = join(desktop, outFile);
writeFileSync(desktopPath, strategy, "utf-8");
console.log(`Copy: ${desktopPath}`);

// Publish a ree-website con slug propio (ges)
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
