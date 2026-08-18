import { renderDiscoveryHtml } from "./dist/lib/html-renderer.js";
import { tryComputeCpl } from "./dist/lib/formulas.js";
import { writeFileSync } from "fs";

const data = {
  clientInfo: {
    nombreCliente: "Angel Huang",
    nombreEmpresa: "Defu — The Tofu Co.",
    sitioWeb: "defu.com.ar",
    fechaLlamada: "2026-08-05",
    fathomUrl: "https://fathom.video/share/DqVm58DxAMEF3_X87AdzQyZef5krywKs",
  },
  resumenEjecutivo:
    "Defu es una marca familiar de tofu artesanal con base en Buenos Aires (local en Barrio Chino, Belgrano + planta en Villa Martelli). La familia Huang (chino-argentina) produce tofu artesanal fresco. Angel Huang es quien gestiona la operacion comercial. Se diferencia del tofu industrial (Soyana, importadores chinos informales) por calidad, frescura y proceso artesanal.\n\nOpera con cuatro lineas: tofu (duro, suave, sedoso, especiado, frito, bacon, laminas), masas (gyozas, wantan), arrolladitos primavera, y private label (produce tofu con marca blanca para Casa Vegana en Carrefour). Vende B2C (e-commerce + local) y B2B (restaurantes, dieteticas, distribuidoras como Green & Co, cadenas como Espiro Sushi).\n\nLas ventas estan estancadas. Tiene capacidad de crecer ~30% sin sumar personal y duplicar con un turno extra. Cuello de botella operativo: sin CRM, logistica artesanal, Angel administra 2 locales mas. Nunca invirtio en pauta digital. Busca generar awareness para que mayoristas lo conozcan antes del contacto comercial.",
  citasTextuales: [
    {
      texto: "La idea es que la marca sea un poco mas conocida, de modo que nosotros, si empezamos a buscar leads calificados, ya sea de distribuidores mayoristas o restaurantes, la gente cuando nos compre ya nos conozcan con anterioridad.",
      contexto: "Explicando su objetivo principal con marketing",
    },
    {
      texto: "Si hacemos una campana y termina siendo muy exitosa, por mi otro lado tengo que ver si voy a ser capaz de sustentarlo, porque si hacen un super buen trabajo y aca no tenemos la capacidad de captarlo y de atenderlo, no tiene mucho sentido.",
      contexto: "Sobre su miedo a no poder abastecer si crece demasiado rapido",
    },
    {
      texto: "Todo es muy artesanal, es todo muy por WhatsApp, no tengo un sistema definido.",
      contexto: "Describiendo como maneja las ventas y pedidos actualmente",
    },
    {
      texto: "Las ventas estan estancadas. La idea es que podamos crecer, la produccion en realidad tampoco llego a la capacidad productiva maxima, pero tampoco estamos muy lejos.",
      contexto: "Reconociendo que el negocio no crece y que hay espacio limitado",
    },
    {
      texto: "Podriamos hacer mas o menos un 30% mas. Si agregamos mas mano de obra, podriamos duplicar. Seria agregar un turno mas.",
      contexto: "Sobre la capacidad de escalar produccion",
    },
    {
      texto: "Soyana debe ocupar mas o menos el 80% del mercado y entre todo lo demas, ocuparemos el 20%.",
      contexto: "Estimacion propia de market share vs competencia",
    },
    {
      texto: "Yo lo que quiero saber es hasta donde puedo pedirles, porque armar sistemas eso no corresponde a marketing, la parte logistica, conseguir mejor logistica, eso tampoco depende de ustedes.",
      contexto: "Preguntando sobre el alcance del servicio de REE Growth",
    },
  ],
  variables: {
    icp: {
      valor: "Diverso segun canal. B2C: foodie/vegano/comunidad asiatica en Buenos Aires, 25-45 anos, busca tofu artesanal fresco. B2B Dieteticas: necesitan proveedor formal con habilitacion. B2B Food Service: restaurantes asiaticos y cadenas (Espiro Sushi). B2B Distribuidoras: Green & Co redistribuye a dieteticas a nivel nacional. Private Label: Casa Vegana vende tofu de Defu con su marca en Carrefour.",
      notas: null,
    },
    producto: {
      valor: "Tres lineas: tofu (duro, suave, sedoso, especiado, frito, bacon, laminas), masas (gyozas, wantan) y arrolladitos primavera. +20 SKUs. Fresco: 3-4 dias de vida util. Pasteurizado: ~1 mes. Capacidad de produccion: puede crecer ~30% sin sumar personal, duplicable con un turno extra.",
      notas: null,
    },
    precio: {
      valor: "6 listas por canal: private label/produccion a fason (~50% margen bruto — ej: Casa Vegana vende tofu de Defu en Carrefour), mayorista, dieteticas (mismo precio que le daria el distribuidor), Barrio Chino (precio intermedio), food service y consumidor final (~75% margen bruto). Rango general de margen bruto: 50-75% segun canal. Plazos de pago: 7 dias general, Green & Co 30 dias, Casa Vegana 14 dias.",
      notas: null,
    },
    plaza: {
      valor: "Local en Barrio Chino (Belgrano) como hub de despacho + venta directa. Planta en Villa Martelli (2 envios diarios). E-commerce en Tienda Nube (defu.com.ar) con envio en el dia. WhatsApp como canal de pedidos principal. Distribucion via Uber y fletes (sin vehiculo propio). B2B: Green & Co, Dieteticas Eneldo, Espiro Sushi, Casa Vegana. Cobertura Buenos Aires.",
      notas: null,
    },
    promocion: {
      valor: "Cero inversion en pauta digital. Crecimiento 100% organico: Instagram (@defu.tofuco), boca a boca, trafico del local. Sin CRM, sin base de datos, sin email marketing, sin automatizacion — todo por WhatsApp. Soyana (competidor principal, ~80% del mercado) tiene 70 anuncios activos.",
      notas: null,
    },
  },
  auditoria: {
    presenciaDigital: "Instagram (@defu.tofuco) como canal principal. Sitio web con e-commerce activo (defu.com.ar) con envios en el dia. Local fisico en Barrio Chino, Belgrano. Sin presencia en otras plataformas digitales ni en marketplaces.",
    canalesActivos: ["Instagram", "E-commerce (defu.com.ar)", "WhatsApp (+54 9 1127502097)", "Local fisico Barrio Chino"],
    contenidoActual: "Instagram orientado a B2C con recetas y usos del tofu. Se esta incorporando storytelling de la familia de Angel y trabajando el posicionamiento de Defu como la marca #1 en tofu artesanal.",
    pautaActual: "Cero inversion en pauta digital. Nunca hizo ads. Soyana (competidor principal) tiene 70 anuncios activos.",
    ecommerce: "Tienda Nube (defu.com.ar) funcionando. Catalogo completo con precios en ARS. Envios en el dia. Multiples medios de pago (debito, credito, Mercado Pago, transferencia, efectivo). Sin trafico pagado.",
    problemasPrincipales: [
      "Ventas estancadas — sin crecimiento interanual",
      "Cero inversion en pauta digital mientras Soyana tiene 70 anuncios activos",
      "Sin CRM ni base de datos de clientes — todo por WhatsApp manual",
      "Angel es cuello de botella administrativo (maneja Defu + 2 locales mas)",
      "Logistica deficiente — perdieron vehiculo propio, dependen de Uber y fletes",
      "Estrategia de contenido y storytelling de marca en desarrollo con el equipo de REE",
      "Datos de negocio no analizados — tiene la data pero no la procesa",
      "Capacidad de produccion limitada (~30% de crecimiento sin sumar personal)",
    ],
  },
  research: {
    tamanoMercado: "Mercado de tofu en Argentina dominado por Soyana (~80%). Defu estima tener ~20% del restante junto con otros productores chicos. Mercado de alimentos plant-based en crecimiento sostenido.",
    tendencia: "Crecimiento del interes en alimentacion saludable y plant-based en Argentina. El segmento artesanal/premium esta emergiendo pero Soyana domina con distribucion masiva.",
    demandaNicho: "Ventas relativamente estables todo el ano. Pico leve en invierno (sopas, ravioles, +10-20%). Dip leve en mayo/junio. Verano es la epoca mas baja. No hay estacionalidad fuerte.",
    competidores: [
      {
        nombre: "Soyana",
        cuotaMercado: "~80% del mercado de tofu en Argentina",
        fortalezas: [
          "Distribucion nacional (dieteticas + supermercados)",
          "Marca mas reconocida del pais",
          "Certificacion organica",
          "70 anuncios activos en pauta digital",
          "Variedad de productos mas alla del tofu",
        ],
        debilidades: [
          "Producto industrial, no artesanal",
          "No tiene frescura del dia",
          "No tiene local fisico / relacion directa con cliente",
        ],
        pautaActiva: "70 anuncios activos (dato mencionado en la llamada)",
      },
      {
        nombre: "Productores chinos informales",
        cuotaMercado: "Nicho: supermercados asiaticos en Buenos Aires",
        fortalezas: [
          "Precio bajo",
          "Red de supermercados asiaticos establecida",
          "Producto conocido por comunidad china",
        ],
        debilidades: [
          "Sin codigo sanitario ni habilitacion",
          "Sin marca propia",
          "Sin presencia digital",
          "Producto de calidad variable",
        ],
        pautaActiva: "Ninguna",
      },
    ],
    estacionalidad: "Relativamente estable. Pico leve invierno (+10-20%), dip leve mayo/junio, verano mas bajo. Sin estacionalidad fuerte segun Angel.",
    notasResearch: "Defu tiene una posicion unica: es el unico productor artesanal formal (con habilitacion) en Buenos Aires. Soyana domina pero con producto industrial. Los informales compiten en precio pero sin legalidad. Hay espacio claro para Defu en el segmento premium/artesanal si logra comunicar su diferencial.",
  },
  icp: [
    {
      titulo: "B2C — Consumidor Final",
      descripcion: "Persona de 25-45 anos en Buenos Aires, foodie, comunidad asiatica o vegano/vegetariano que busca tofu artesanal fresco y no lo encuentra en supermercados.",
      dolores: [
        "No encuentra tofu de calidad en supermercados (solo Soyana industrial o informales sin habilitacion)",
        "El tofu del super no tiene sabor ni buena textura",
        "No sabe donde comprar tofu artesanal fresco fuera del Barrio Chino",
        "Asocia el tofu con un producto insipido por malas experiencias con tofu industrial",
        "No conoce la variedad de productos que se pueden hacer con tofu (masas, arrolladitos, etc.)",
      ],
      deseos: [
        "Comer mas saludable con productos artesanales y locales",
        "Acceso facil a tofu fresco sin ir al Barrio Chino (delivery/e-commerce)",
        "Descubrir recetas y formas de cocinar con tofu",
        "Conocer la historia y el origen de lo que consume",
        "Tener un proveedor de confianza al que pueda recomprar regularmente",
      ],
      objeciones: [
        "Es mas caro que Soyana del supermercado",
        "No se como cocinar tofu (experiencia previa con tofu industrial malo)",
        "No sabia que existia tofu artesanal en Buenos Aires",
        "Prefiero comprar todo en un solo lugar (supermercado/dietetica)",
        "No se si hacen envio a mi zona",
        "El producto fresco dura pocos dias",
      ],
    },
    {
      titulo: "B2B — Dieteticas, Food Service, Distribuidoras y Private Label",
      descripcion: "Dieteticas que necesitan proveedor formal con habilitacion. Restaurantes asiaticos y cadenas (Espiro Sushi). Distribuidoras como Green & Co que redistribuyen a nivel nacional. Private label: marcas como Casa Vegana que venden tofu de Defu con su marca en Carrefour.",
      dolores: [
        "Necesita proveedor con habilitacion sanitaria (RNE/RNPA) para cumplir normas",
        "Quiere producto fresco de calidad constante con entrega confiable",
        "Proveedores informales no ofrecen garantias ni facturacion",
        "Pocos proveedores artesanales formales en Buenos Aires — el mercado es Soyana industrial o informales",
        "Falta de opciones de producto diferenciado para destacar en carta o gondola",
      ],
      deseos: [
        "Proveedor que no compita con su precio al publico",
        "Producto diferenciado (artesanal) para destacar en su menu/oferta",
        "Listas de precios claras y plazos de pago definidos",
        "Proveedor con habilitacion completa para cumplir auditorias y normativa",
        "Posibilidad de produccion a fason / private label con marca propia",
      ],
      objeciones: [
        "No se si hacen envios a mi zona / frecuencia de entrega",
        "Volumen minimo de pedido",
        "Vida util corta del producto fresco (3-4 dias)",
        "Ya tengo proveedor actual (Soyana) con distribucion estable",
        "No conozco la marca — no se si van a poder cumplir con la demanda",
      ],
    },
  ],
  propuestaDeValor: {
    diferencial: "Defu es el unico productor artesanal de tofu con habilitacion sanitaria completa en Buenos Aires. Producto fresco elaborado diariamente por una familia china-argentina con tradicion en la produccion de tofu. Eso es lo que lo diferencia: calidad artesanal, cuidado en el proceso y trato directo con el productor.",
    angulos: [
      {
        nombre: "Tofu de verdad",
        audiencia: "B2C",
        dolorQueResuelve: "El consumidor no encuentra tofu de calidad — solo Soyana industrial o informales sin habilitacion",
        mensaje: "Tofu artesanal, fresco del dia, elaborado con cuidado. Una vez que lo probas, el del supermercado no vuelve a ser opcion. Produccion diaria, envio en el dia a tu puerta.",
        palanca: "Comparacion directa artesanal vs industrial: sabor, textura, frescura",
      },
      {
        nombre: "De nuestra familia a tu mesa",
        audiencia: "B2C",
        dolorQueResuelve: "No conoce la historia detras del producto ni tiene conexion con el productor",
        mensaje: "Defu nace en Barrio Chino. Una familia china-argentina que hace tofu como se hace de verdad, todos los dias. Conoces quien lo hace, como lo hace y de donde viene.",
        palanca: "Storytelling familiar + origen autentico + transparencia del proceso",
      },
      {
        nombre: "Mucho mas que tofu",
        audiencia: "B2C",
        dolorQueResuelve: "Asocia el tofu con un producto aburrido e insipido, no sabe que mas se puede hacer con el",
        mensaje: "Masas para gyozas, arrolladitos primavera, tofu especiado, frito, bacon, laminas. Mas de 20 productos artesanales frescos para descubrir una cocina que no sabias que existia.",
        palanca: "Variedad de catalogo + recetas + educacion sobre usos del tofu",
      },
      {
        nombre: "Tu proveedor artesanal con respaldo",
        audiencia: "B2B",
        dolorQueResuelve: "Necesita proveedor formal con habilitacion, calidad constante y trato confiable",
        mensaje: "Habilitacion sanitaria completa, produccion diaria, 6 listas de precios por canal y trato directo con el productor. Un proveedor que no compite con tu precio al publico y se adapta a tu operacion.",
        palanca: "Unico artesanal formal + listas diferenciadas + relacion directa sin intermediarios",
      },
      {
        nombre: "Tu marca, nuestro tofu",
        audiencia: "B2B",
        dolorQueResuelve: "Quiere ofrecer tofu artesanal con su propia marca pero no tiene capacidad de produccion",
        mensaje: "Produccion a fason con la calidad artesanal de Defu bajo tu marca. Ya lo hacemos para Casa Vegana en Carrefour. Vos vendes, nosotros producimos.",
        palanca: "Private label con respaldo sanitario + caso de exito existente (Casa Vegana/Carrefour)",
      },
      {
        nombre: "Trato directo con el productor",
        audiencia: "B2B",
        dolorQueResuelve: "Depende de intermediarios o distribuidoras grandes sin trato personalizado",
        mensaje: "Hablas directo con quien produce. Pedidos por WhatsApp, listas de precios pensadas para no competir con tu canal, y flexibilidad para adaptarnos a tu operacion.",
        palanca: "Relacion directa + personalizacion por canal + sin friccion de intermediarios",
      },
    ],
  },
  angulosDeValor: null,
  calculoCpl: {
    ticket: 40000,
    margen: 75,
    porcentajeMargenParaAds: 40,
    tasaDeCierre: 2,
    cpaMaximo: null,
    cplObjetivo: null,
    cplMercado: null,
    escenario: null,
  },
  propuestaEstrategica: {
    objetivoGeneral: "Posicionar a Defu como la marca referente de tofu artesanal en Buenos Aires y activar el canal B2C para explotar el 30-40% de margen de produccion disponible. Primero awareness, despues conversion. El B2B se avanza por WhatsApp una vez que el canal B2C este activo y validado.",
    fases: [
      {
        nombre: "Awareness de Marca",
        lapso: "Semanas 1-4",
        inversion: "USD 100-150/mes",
        descripcion: "2-3 semanas de ejecucion para armar todo (creativos, segmentacion, perfil) + 14 dias de launch para validar creativo ganador. Campana de interaccion en Meta Ads con objetivo de visitas al perfil de Instagram. Un conjunto de 6-8 creativos (videos, flyers, carruseles) que rueden simultaneamente para generar awareness en Buenos Aires. Corre en paralelo con el Funnel B2C pero es mas corta — se enfoca en que conozcan la marca.",
        entregables: [
          "Campana de interaccion en Meta Ads (objetivo: visitas al perfil de IG)",
          "6-8 creativos variados: videos de proceso artesanal, carruseles de productos, flyers de marca",
          "Storytelling de marca: historia de la familia Huang, Barrio Chino, produccion diaria",
          "Segmentacion: Buenos Aires, intereses en alimentacion saludable, cocina asiatica, vegano/vegetariano",
          "Optimizacion de perfil de Instagram y bio para recibir el trafico",
        ],
      },
      {
        nombre: "Funnel B2C (Ecommerce)",
        lapso: "Semanas 1-8",
        inversion: "USD 200-250/mes",
        descripcion: "4-5 semanas operativas para armar el funnel de ventas + 14 dias de launch para validar angulo y creativo ganador a traves de data de REE Metrics. Campana de ventas orientada a conversion hacia defu.com.ar (Tienda Nube). Conectar Meta Ads con Tienda Nube para trackear ventas y medir traccion real. Definir minimo de compra para envio gratis (objetivo: ticket promedio ~$100,000 ARS) y armar combos/promociones para subir el ticket.",
        entregables: [
          "Campana de conversion en Meta Ads hacia defu.com.ar",
          "Integracion Meta Ads via REE Metrics (incluido en el servicio)",
          "Integracion con Tienda Nube (Pixel, eventos de compra, CAPI) — se cobra como ticket aparte",
          "Retargeting de visitantes del sitio y del perfil de IG",
          "Definir minimo de compra para envio gratis (subir ticket promedio)",
          "Combos y promociones de varios productos para incentivar ticket alto",
          "Dashboard de metricas: CPA, ROAS, ticket promedio, tasa de conversion",
        ],
      },
      {
        nombre: "Funnel B2B (WhatsApp + Bot)",
        lapso: null,
        inversion: null,
        descripcion: "Requiere las dos etapas previas (awareness + funnel B2C) para generar la autoridad de marca necesaria para que el B2B te tome en cuenta. Piezas creativas con enfoque en dolores de los ICPs B2B (habilitacion, calidad constante, trato directo, private label). Prospeccion por WhatsApp con respaldo de marca posicionada. Implementar bot inteligente que filtre consultas, califique leads y derive segun tipo de cliente (B2C/B2B), reduciendo la carga operativa sobre Angel.",
        entregables: [
          "Bot inteligente en WhatsApp: filtrado de consultas, calificacion de leads, derivacion por tipo de cliente",
          "Listado de prospectos B2B (dieteticas, restaurantes, distribuidoras en Buenos Aires)",
          "Mensajes de prospeccion por WhatsApp con respaldo de marca posicionada",
          "Listas de precios por canal listas para enviar",
          "Seguimiento de leads B2B y pipeline basico",
        ],
      },
    ],
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (defu.com.ar)", "WhatsApp Business"],
    kpisPropuestos: ["Visitas al perfil de IG (awareness)", "Alcance e impresiones", "Crecimiento de seguidores IG", "Trafico al e-commerce", "Ticket promedio por pedido", "Tasa de conversion e-commerce", "CPA por venta B2C", "ROAS"],
    notasPropuesta: "El plan explota el margen de produccion disponible (~30-40%) con el canal B2C primero. La integracion con Meta Ads viene incluida en el servicio via REE Metrics. La integracion con Tienda Nube se cobra como ticket aparte. El B2B no requiere pauta por ahora — se trabaja por WhatsApp aprovechando el awareness generado. La estrategia debe ser gradual para no saturar la capacidad operativa de Angel.",
  },
  valorServicio: {
    lineas: [
      {
        concepto: "Implementacion",
        monto: "USD 400-600",
        descripcion: "Setup de campanas, creativos iniciales, estrategia, configuracion de Meta Ads y REE Metrics.",
        tipo: "unico",
      },
      {
        concepto: "Integracion Tienda Nube",
        monto: "USD 150-250",
        descripcion: "Conexion e-commerce, tracking de conversiones, configuracion de catalogo.",
        tipo: "por-proyecto",
      },
      {
        concepto: "Fee mensual de mantenimiento",
        monto: "USD 200-350",
        descripcion: "Gestion de campanas, optimizacion, reportes, soporte continuo.",
        tipo: "mensual",
      },
    ],
    notaRoi: "La inversion inicial del servicio (implementacion + integracion) es de USD 550-850. Con el escenario moderado (CPR al 65% del maximo), la ganancia bruta mensual despues de pauta es de ~$844,000 ARS — la inversion inicial se recupera en el primer mes de operacion. Con el escenario conservador (CPR al maximo tolerable), la ganancia bruta mensual es de ~$450,000 ARS y la recuperacion toma ~2 meses. En ambos casos, el fee mensual queda cubierto por la ganancia que genera el canal B2C.",
    aclaraciones: [
      "Valores estimativos sujetos a scope final",
      "No incluye presupuesto de pauta (ads)",
    ],
  },
  gaps: [
    {
      variable: "Presupuesto para Ads",
      descripcion: "No se definio presupuesto disponible para pauta digital. Se menciono que el fee de Growth seria menor al de REE contenido actual.",
      prioridad: "alta",
      preguntaSugerida: "Angel, cuanto presupuesto mensual podrias destinar a publicidad digital para arrancar? (sugerimos minimo $50,000-100,000 ARS/mes para empezar con awareness)",
    },
    {
      variable: "Ticket Promedio Ponderado",
      descripcion: "Hay multiples listas de precios y canales, pero no se obtuvo un ticket promedio ponderado por canal ni el mix de ventas B2B vs B2C.",
      prioridad: "alta",
      preguntaSugerida: "Cuanto es tu venta promedio por pedido en el e-commerce (B2C)? Y en mayorista, cual es el pedido promedio? Que porcentaje de tus ventas totales es B2C vs B2B?",
    },
    {
      variable: "Tasa de Conversion",
      descripcion: "No se conoce la tasa de conversion del e-commerce ni de consultas WhatsApp a ventas.",
      prioridad: "alta",
      preguntaSugerida: "De cada 100 visitas a defu.com.ar, cuantas terminan comprando? Y de los mensajes que llegan por WhatsApp, que porcentaje termina en venta?",
    },
    {
      variable: "Capacidad Exacta",
      descripcion: "Se menciono ~30% de margen y posibilidad de duplicar con turno extra, pero no hay numero concreto de pedidos/dia o kg/semana.",
      prioridad: "alta",
      preguntaSugerida: "Cuantos pedidos B2C y B2B despachas por semana hoy? Cual es tu techo antes de necesitar sumar el turno extra?",
    },
    {
      variable: "Margenes por Canal",
      descripcion: "Se dieron rangos amplios (50-75%) pero no hay margen neto por canal despues de logistica, que es un costo significativo al usar Uber/fletes.",
      prioridad: "media",
      preguntaSugerida: "Cuanto te cuesta en promedio el envio de un pedido B2C (via Uber) y cuanto un envio mayorista? Necesitamos calcular el margen neto real despues de logistica.",
    },
    {
      variable: "Datos Historicos",
      descripcion: "Angel menciono que tiene datos de ventas en su sistema pero no los tiene analizados. No los compartio.",
      prioridad: "media",
      preguntaSugerida: "Podrias compartir el export de ventas de los ultimos 6-12 meses? Necesitamos ver la tendencia, el mix de productos y los canales para armar el modelo de viabilidad.",
    },
    {
      variable: "Metricas Web",
      descripcion: "No se conoce trafico, sesiones, ni metricas del e-commerce (defu.com.ar).",
      prioridad: "media",
      preguntaSugerida: "Tenes Google Analytics o Tienda Nube Analytics en defu.com.ar? Si es asi, podrias darnos acceso o compartir las metricas de trafico y conversion de los ultimos 3 meses?",
    },
  ],
  notasAdicionales: "Participantes de la llamada: por REE — Sergio Suarez, Jonas (dev), Marce (socio/tech), Flor. Por Defu — Angel Huang.\n\nAngel es chino-argentino. Su familia tiene tradicion en la produccion de tofu. Esta historia es un activo de marca no explotado para storytelling.\n\nAngel administra 2 locales mas aparte de Defu — esto explica el cuello de botella administrativo y la necesidad de soluciones que no sumen carga operativa.\n\nLa planta de produccion esta en Villa Martelli. Producen de 6am a 2pm. Dos envios diarios de planta al local en Barrio Chino. Todo se despacha desde el local de Barrio Chino.\n\nSolian tener vehiculo propio para distribucion, ya no lo tienen. En el corto plazo planean conseguir transporte propio de nuevo.\n\nClientes B2B relevantes: Green & Co (distribuidora de dieteticas, pago a 30 dias), Dieteticas Eneldo, Espiro Sushi (cadena), Casa Vegana (private label para Carrefour, pago a 14 dias).\n\nProducto fresco tiene 3-4 dias de vida util. Envasado pasteurizado ~1 mes. El pasteurizado se mueve mucho mas pero el fresco es parte de la identidad de marca.\n\nAngel no discrimina clientes por canal — atiende todo por igual. No llego al punto de que la produccion no abastezca, excepto en temporadas pico puntuales.\n\nSe acordo que REE preparara una propuesta personalizada para la semana siguiente. El fee mensual de Growth seria menor al que paga actualmente por el servicio de contenido de REE.",
  proximosPasos: [
    "Debatir internamente (founders REE) este diagnostico y alinear vision de propuesta",
    "Definir scope y pricing del servicio de Growth para Defu (mensual + tickets de sistemas)",
    "Desarrollar la propuesta final con roadmap por fases, creativos y presupuesto para presentar a Angel",
  ],
  resumenCierre: "Defu tiene una posicion unica en el mercado: es el unico productor artesanal de tofu con habilitacion sanitaria en Buenos Aires, frente a Soyana (industrial, ~80% del mercado, 70 anuncios activos en pauta) y productores informales sin habilitacion ni marca. Las ventas estan estancadas, nunca invirtio en pauta digital y toda la operacion comercial es manual — sin CRM, sin base de datos, todo por WhatsApp. Hay capacidad de produccion ociosa (~30% sin sumar personal, duplicable con un turno extra) y un diferencial de marca no explotado: la historia de la familia Huang, el proceso artesanal y la frescura del producto.\n\nLa estrategia propuesta es por fases: primero awareness en Meta Ads para que Defu sea conocido mas alla de Barrio Chino, despues activar un funnel de conversion hacia el e-commerce (defu.com.ar) con retargeting e integracion de Tienda Nube via REE Metrics. El canal B2B se trabaja en paralelo por WhatsApp, aprovechando la autoridad de marca que genera la pauta. Los numeros de viabilidad son favorables: con un escenario moderado, la inversion en el servicio de REE se recupera en el primer mes de operacion del canal B2C.",
};

// Auto-compute CPL if possible
const computed = tryComputeCpl({
  ticket: data.calculoCpl.ticket,
  margen: data.calculoCpl.margen,
  porcentajeMargenParaAds: data.calculoCpl.porcentajeMargenParaAds,
  tasaDeCierre: data.calculoCpl.tasaDeCierre,
  cplMercado: data.calculoCpl.cplMercado,
});
if (computed) {
  data.calculoCpl.cpaMaximo = computed.cpaMaximo;
  data.calculoCpl.cplObjetivo = computed.cplObjetivo;
  data.calculoCpl.escenario = computed.escenario;
}

const html = renderDiscoveryHtml(data);
const outDir = new URL("./Clients/defu/", import.meta.url);
writeFileSync(new URL("discovery-defu.html", outDir), html, "utf-8");
console.log("Done: Clientes/defu/discovery-defu.html");
