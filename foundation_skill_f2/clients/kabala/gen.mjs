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

import { piezasAwareness } from "./piezas-awareness.mjs";
import { buildPiezasEcommerce } from "./piezas-ecommerce.mjs";
const piezasEcommerce = buildPiezasEcommerce(assetDataUri);

const ICP_1 = "Explorador de tendencia (18-27)";
const ICP_2 = "Comprador de diseño (27-35)";

const data = {
  clientInfo: {
    nombreEmpresa: "Kabala",
    slug: "kabala",
    nombreContacto: "Camila Sampayo",
    industria: "Indumentaria · Streetwear de diseño",
    sitioWeb: "kabala.com.ar",
    email: null,
    telefono: null,
    fechaCierre: "2026-09-28",
  },
  datosF1: {
    inversionMensual: "USD 500/mes (fee REE Growth)",
    presupuestoPauta: "USD 500/mes",
    cplObjetivo: "A validar con los márgenes de Kabala. Techo tentativo de CAC: USD 20 en pantalones, USD 25 en camperas.",
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (kabala.com.ar)", "Local Palermo"],
    palancaPropuesta: "Posicionamiento: awareness de marca primero, después conversión en el e-commerce",
    campanasVendidas: ["Campaña Awareness", "Campaña Ecommerce"],
    duracionProyecto: "8 semanas",
    fechaInicio: "28/09/2026",
    fechaFin: "22/11/2026",
    fechaInicioISO: "2026-09-28",
  },

  // A. Onboarding
  equipoAsignado: [
    { nombre: "Jonathan Guidi", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suárez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Crear grupo interno: [REE] Kabala - Growth", status: "pendiente", notas: null },
      { label: "Agregar equipo REE al grupo interno", status: "pendiente", notas: null },
      { label: "Crear grupo cliente: Kabala Growth", status: "hecho", notas: "Creado durante el Kick Off del 28/09." },
      { label: "Agregar a Camila Sampayo al grupo cliente", status: "hecho", notas: null },
      { label: "Agregar a Flor al grupo cliente", status: "hecho", notas: "Sumada como responsable de contenido y creativos." },
      { label: "Enviar minuta del Kick Off con los entregables pedidos", status: "pendiente", notas: "Comprometido en la llamada: listas de competidores y referentes, manual de marca, márgenes y objetivo de venta mensual." },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: {
      titulo: "Business Portfolio",
      items: [
        { label: "Crear la estructura de Business de Kabala", status: "hecho", notas: "KO Call 01/10: se armó bajo una cuenta de Facebook nueva creada con el email de Kabala (la cuenta vieja de Cami no se pudo recuperar)." },
        { label: "Agregar equipo REE como administradores", status: "hecho", notas: "growth@reecreativos.com invitado con permisos totales sobre Page, Instagram y cuenta publicitaria. Jonathan validó el acceso en la misma llamada." },
      ],
    },
    facebookPage: {
      titulo: "Facebook Page",
      items: [
        { label: "Crear Facebook Page para Kabala", status: "hecho", notas: "Creada en la KO Call del 01/10 bajo la cuenta nueva de Facebook de Kabala." },
        { label: "Resolver la cuenta de Facebook que administra la Page", status: "hecho", notas: "La cuenta que Cami había creado no se pudo recuperar: se dio de alta una nueva con el email de Kabala." },
        { label: "Completar información de la Page (foto, portada, categoría)", status: "pendiente", notas: "La info básica quedó cargada en la llamada. Completar foto de perfil, portada y categoría con los assets del manual de marca." },
        { label: "Publicar al menos 1 posteo inicial", status: "pendiente", notas: "Requisito de Meta para que la Page sea elegible para pautar." },
      ],
    },
    instagramBusiness: {
      titulo: "Instagram Business",
      items: [
        { label: "Verificar que @kabala.ar es cuenta Business", status: "hecho", notas: "Conectada vía Meta Business Suite en la KO Call del 01/10." },
        { label: "Vincular @kabala.ar a la Facebook Page de Kabala", status: "hecho", notas: "Hecho en la KO Call del 01/10." },
        { label: "Vincular Instagram al Business de Kabala", status: "hecho", notas: "Conectada como activo comercial de la cuenta publicitaria." },
      ],
    },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Crear cuenta publicitaria: 'Kabala - Ad Account'", status: "hecho", notas: "Creada en la KO Call del 01/10." },
        { label: "Configurar timezone: America/Buenos_Aires", status: "hecho", notas: null },
        { label: "Configurar moneda: USD", status: "hecho", notas: "Se configuró en dólares para evitar la percepción RG (~45%) de pagar en pesos. Implica pagar con una cuenta en USD." },
        { label: "Cargar el método de pago de Kabala en Meta", status: "pendiente", notas: "La pauta se paga con medio de pago del cliente directo en Meta. Con la cuenta en USD, Cami necesita una cuenta en dólares (tipo Arquiv / dólar A) para el débito." },
        { label: "Asignar Facebook Page e Instagram a la cuenta", status: "hecho", notas: "Activos conectados en la KO Call." },
        { label: "Configurar límite de gasto de la cuenta", status: "pendiente", notas: "USD 550/mes, para blindar el presupuesto de USD 500." },
        { label: "Agregar equipo REE como Anunciantes", status: "hecho", notas: "growth@ quedó con permisos totales desde el Business." },
      ],
    },
    pixel: {
      titulo: "Pixel de Meta",
      items: [
        { label: "Crear Pixel: 'Kabala - Pixel'", status: "hecho", notas: "Dado de alta el 06/10 desde el Events Manager." },
        { label: "Instalar Pixel en kabala.com.ar (Tienda Nube)", status: "pendiente", notas: "Vía la integración de partner de Tienda Nube. REE tiene acceso admin a la tienda (credenciales compartidas en la KO Call)." },
        { label: "Configurar eventos: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase", status: "pendiente", notas: "Los 4 eventos de conversión están comprometidos en el acuerdo comercial." },
        { label: "Verificar con Test Events / Meta Pixel Helper", status: "pendiente", notas: null },
      ],
    },
    capi: {
      titulo: "Conversions API (CAPI)",
      items: [
        { label: "Activar CAPI vía la integración nativa de Tienda Nube", status: "pendiente", notas: null },
        { label: "Verificar deduplicación de eventos (event_id)", status: "pendiente", notas: null },
        { label: "Testear con Test Events en Events Manager", status: "pendiente", notas: null },
      ],
    },
    edgeCases: [
      {
        condicion: "Cliente no tenía Facebook Page (resuelto en la KO Call)",
        aplica: false,
        instrucciones: "Resuelto el 01/10: se creó la Page bajo una cuenta de Facebook nueva con el email de Kabala.",
      },
      {
        condicion: "Instagram sin vincular a Facebook Page (resuelto en la KO Call)",
        aplica: false,
        instrucciones: "Resuelto el 01/10: @kabala.ar quedó vinculado a la Page y conectado al Business.",
      },
      {
        condicion: "Pixel y eventos de conversión a medio instalar",
        aplica: true,
        instrucciones: "kabala.com.ar no tenía ningún Pixel: cero dato de quién visita, qué mira ni qué producto convierte. El 06/10 se dio de alta 'Kabala - Pixel' en el Events Manager. Falta completar la integración de partner con Tienda Nube (Pixel + CAPI) y verificar los eventos ViewContent, AddToCart, InitiateCheckout y Purchase con Test Events. Sigue siendo el bloqueante duro del Launch de Ecommerce: sin eventos no se puede optimizar ni medir CAC por categoría.",
      },
      {
        condicion: "Producción de contenido limitada y semanal",
        aplica: true,
        instrucciones: "Camila trabaja sola y el contenido es el cuello de botella real del proyecto, no la pauta. La primera producción con modelo se realizó el viernes 02/10 en Puerto Madero y el material se entrega por Drive. Está sumando a una persona para contenido y evalúa un pack mensual de estudio. Implicancia operativa: la campaña de Awareness se arma con las piezas de esa producción y la de Ecommerce espera la segunda tanda. No comprometer volumen de creativos por encima de la capacidad de producción real.",
      },
      {
        condicion: "Productos de mujer sin subir a Tienda Nube",
        aplica: true,
        instrucciones: "La producción con modelo mujer se realizó el 02/10: la comunicación deja de leer 100% masculina. El pendiente ahora es que Cami suba los productos de mujer a Tienda Nube: sin eso el catálogo queda masculino, el Collection Ad (EC-6) sale incompleto y las piezas de Ecommerce no tienen destino completo. Confirmar además que quedó fotografiado el mismo pantalón en varón y en mujer para la pieza de calce unisex (EC-2).",
      },
      {
        condicion: "Gestión de stock manual en Tienda Nube",
        aplica: true,
        instrucciones: "No hay sistema de gestión: Tienda Nube es a la vez el e-commerce y el control de stock del local de Palermo, cargado a mano por Camila. Con ~50 unidades por artículo y talles acotados, el riesgo es pautar hacia un talle agotado o vender en la web algo que ya salió del local. Antes de encender cada campaña hay que verificar profundidad de stock por talle. Si el proyecto escala a más puntos de venta, evaluar un sistema de gestión (tipo Dragonfish) conectado a Tienda Nube.",
      },
    ],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Manual de marca", status: "pendiente", notas: "Camila lo ofreció en el Kick Off y lo envía por el grupo de WhatsApp." },
        { label: "Logo en alta resolución (PNG transparente + vector)", status: "pendiente", notas: null },
        { label: "Fotos de e-commerce sobre fondo blanco", status: "hecho", notas: "Producidas la semana del 21/09 para el lanzamiento de la web." },
        { label: "Producción con modelo mujer", status: "hecho", notas: "Realizada el viernes 02/10 en Puerto Madero. El material se sube al Drive compartido." },
        { label: "Mismo pantalón fotografiado en varón y en mujer", status: "pendiente", notas: "Insumo de la pieza de calce unisex (EC-2). Confirmar con Cami que quedó registrado en la producción del 02/10." },
        { label: "Material de taller y proceso (bocetos, moldería, serigrafía)", status: "pendiente", notas: "Insumo de las piezas de Awareness AW-1 y AW-4. Puede grabarse con celular." },
        { label: "Lista de 5 competidores", status: "hecho", notas: "Enviada por Cami. Jonathan la investiga en la Ad Library del segmento." },
        { label: "Lista de 5 inspiraciones (marcas que le funcionan)", status: "pendiente", notas: null },
        { label: "Lista de 5 referentes de cómo muestran su marca", status: "pendiente", notas: "Referencias de comunicación, no de indumentaria. Sergio lo aclaró explícitamente en la llamada." },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a Tienda Nube (kabala.com.ar)", status: "hecho", notas: "Credenciales compartidas por Cami en la KO Call del 01/10." },
        { label: "Subir productos de mujer a Tienda Nube", status: "pendiente", notas: "Post-producción del 02/10. Bloqueante del Launch de Ecommerce: sin estos productos el catálogo y el Collection Ad quedan masculinos." },
        { label: "URLs finales de las categorías (Pantalones, Camperas, Buzos, Remeras)", status: "pendiente", notas: "Destino de cada pieza de la campaña de Ecommerce." },
        { label: "Datos de tráfico y ventas del e-commerce", status: "pendiente", notas: "La web se lanzó la semana del 21/09: el histórico es mínimo, sirve como línea de base." },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de contacto de Camila", status: "hecho", notas: "En poder de Sergio. Grupo 'Kabala Growth' ya creado." },
        { label: "Definir si se usa WhatsApp Business para consultas de venta", status: "pendiente", notas: "Hoy las consultas entran por DM de Instagram y por el local." },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Definir quién responde los DM de Instagram", status: "pendiente", notas: "Hoy responde Camila desde el local. Es cuello de botella." },
        { label: "Preparar respuestas rápidas de talles, envíos y cambios", status: "pendiente", notas: "Son las 3 objeciones que más frenan la compra según el research del ICP." },
        { label: "Validar capacidad de atención en horario del local", status: "pendiente", notas: null },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "Tienda Nube",
      descripcion: "kabala.com.ar corre en Tienda Nube, que además funciona como el control de stock del local de Palermo. Necesitamos acceso de administrador para instalar el Pixel, activar CAPI y configurar los eventos de conversión.",
      items: [
        { label: "Usuario y contraseña de administrador, o invitación al equipo REE", status: "pendiente", notas: null },
        { label: "Verificar el plan de Tienda Nube (la integración con Meta requiere plan pago)", status: "pendiente", notas: null },
        { label: "Confirmar que el stock por talle está actualizado antes de encender pauta", status: "pendiente", notas: "~50 unidades por artículo. Riesgo de pautar hacia un talle agotado." },
      ],
    },
    tracking: {
      titulo: "Tracking y Medición",
      items: [
        { label: "Pixel de Meta instalado y verificado", status: "pendiente", notas: "'Kabala - Pixel' dado de alta el 06/10. Falta la integración con Tienda Nube y la verificación de eventos. Bloqueante del Launch de Ecommerce." },
        { label: "CAPI activo vía integración de Tienda Nube", status: "pendiente", notas: null },
        { label: "Tienda Nube conectada a REE Metrics", status: "pendiente", notas: null },
        { label: "Márgenes por categoría para calcular el CAC tope", status: "pendiente", notas: "Camila los tiene en un Excel. Pantalones es la categoría de margen más ajustado; camperas y el resto tienen más aire." },
        { label: "Objetivo de venta mensual", status: "pendiente", notas: "Camila lo tiene calculado para cubrir alquiler, servicios y repago de la inversión inicial. Es el norte del proyecto." },
      ],
    },
  },

  koCall: {
    fechaPropuesta: "Jueves 01/10/2026, 11:00",
    duracionTotal: "45 min",
    etapas: [
      { nombre: "Apertura", duracion: "5 min", objetivo: "Qué vamos a configurar hoy: Meta Ads, Tienda Nube y REE Metrics", output: "Contexto alineado" },
      { nombre: "Onboarding Meta", duracion: "25 min", objetivo: "Crear la Facebook Page, vincular @kabala.ar, dar de alta la cuenta publicitaria y cargar la tarjeta", output: "Cuenta publicitaria lista para pautar" },
      { nombre: "Accesos", duracion: "10 min", objetivo: "Obtener acceso admin a Tienda Nube e instalar el Pixel", output: "Pixel instalado y verificado" },
      { nombre: "Cierre", duracion: "5 min", objetivo: "Repasar entregables pendientes y agendar el Foundation Review", output: "Foundation Review agendado" },
    ],
    flujoTemas: [
      "Presentación del equipo asignado: Jonathan (Growth), Sergio (Account), Flor (Contenido)",
      "Recap del acuerdo: 2 campañas, 10 piezas, USD 500 de fee + USD 500 de pauta, 8 semanas",
      "Crear la Facebook Page de Kabala y vincular @kabala.ar (hoy no existe ninguna de las dos cosas)",
      "Dar de alta la cuenta publicitaria, moneda ARS y tarjeta de Camila",
      "Instalar Pixel y CAPI en Tienda Nube y probar los eventos en vivo",
      "Repasar los entregables de Camila: manual de marca, 5 competidores, 5 inspiraciones, 5 referentes, márgenes y objetivo de venta",
      "Confirmar la producción del viernes 02/10: modelo mujer + mismo pantalón en varón y mujer",
      "Alinear expectativas: Awareness prende en S3, Ecommerce en S4",
    ],
    temasWow: [
      "Demo de REE Metrics: mostrar el customer journey completo de una venta en otro cliente de indumentaria (anonimizado), de qué anuncio vino hasta el checkout",
      "Calcular en vivo el CAC tope por categoría a partir del margen: por qué en pantalones podemos pagar hasta USD 20 y en camperas hasta USD 25",
      "Abrir la Ad Library de King of the Kongo y Bomba Project y mostrar qué están pautando hoy en el feed donde Kabala todavía no aparece",
      "Cómo salir a Black Friday sin bajar el precio: financiación en cuotas, cupón de recompra y servicio de estilismo en lugar de descuento",
    ],
    checklist: {
      titulo: "Preparación KO Call",
      items: [
        { label: "Confirmar fecha con Camila", status: "hecho", notas: "Jueves 01/10 a las 11:00, acordado en el Kick Off." },
        { label: "Enviar invite de Google Calendar", status: "pendiente", notas: null },
        { label: "Enviar acuerdo comercial para firma", status: "pendiente", notas: "Comprometido en la llamada del 28/09." },
        { label: "Enviar minuta del Kick Off con los entregables", status: "pendiente", notas: null },
        { label: "Pedirle a Camila que esté en la computadora (no en el celular)", status: "pendiente", notas: "El Kick Off se hizo desde el celular y por eso no se pudo configurar Meta. Es requisito para la KO Call." },
        { label: "Preparar demo de REE Metrics", status: "pendiente", notas: null },
        { label: "Tener abierta la Ad Library de los competidores del segmento", status: "pendiente", notas: null },
      ],
    },
    proximaReunion: {
      nombre: "Foundation Review",
      fechaTentativa: "Viernes 09/10 o Lunes 12/10/2026",
      objetivos: [
        "Presentar la estrategia completa de las 2 campañas y las 10 piezas",
        "Mostrar el research de competencia del segmento streetwear",
        "Validar los 2 ICPs y la segmentación de cada ad set",
        "Demo de REE Metrics con los eventos de Tienda Nube ya midiendo",
        "Aprobar el encendido de la campaña de Awareness",
      ],
    },
  },

  // B. Estrategia
  palanca: {
    nombre: "Posicionamiento",
    justificacion:
      "Kabala tiene producto, local y e-commerce, pero no tiene audiencia: cero pauta histórica, sin Pixel y un Instagram que crece orgánicamente. En un segmento donde los referentes del rubro superan los 200 mil seguidores, salir directo a vender sin marca construida obliga a pagar cada venta a precio completo desde el primer día. La palanca es posicionamiento: primero se construye una audiencia amplia con la campaña de Awareness hacia @kabala.ar, y después se recortan fragmentos de esa audiencia para la campaña de Ecommerce. El argumento de posicionamiento es el diferencial real del producto: diseño de autor, moldería y estampas propias, producción argentina y ediciones de ~50 unidades.",
  },

  icp: [
    {
      segmento: ICP_1,
      descripcion:
        "Varones y mujeres de 18 a 27 años de CABA y GBA, con consumo alto de moda y presencia fuerte en Instagram y TikTok. Compran por estética y por lo que la prenda dice de ellos. Tienen presupuesto acotado y compran de a una prenda, pero con frecuencia: siguen drops, esperan lanzamientos y renuevan por temporada. Ticket promedio bajo dentro de la grilla de Kabala (remeras, buzos, pantalones de entrada). Es el segmento que sigue a la competencia en busca de drops nuevos y exclusivos.",
      frase: "No quiero la campera que tienen todos, quiero la que nadie sabe de dónde saqué.",
      dolores: [
        "Se cruza con la misma prenda en tres personas el mismo día: todo lo que compra está masificado.",
        "Compra oversize en marcas masivas y le queda un talle grande mal cortado, no un oversize real.",
        "Los precios de las marcas de streetwear consolidadas le quedan fuera de alcance.",
        "No sabe qué talle pedir online y prefiere no comprar antes que equivocarse.",
      ],
      deseos: [
        "Encontrar marcas chicas antes de que se vuelvan masivas y poder decir que las descubrió.",
        "Un calce oversize que caiga bien de verdad, con tiro y largo pensados.",
        "Piezas que se noten: bordados, estampas y detalles que no se ven en el resto del feed.",
        "Poder financiar la compra en cuotas sin resignar la prenda que quiere.",
      ],
      objeciones: [
        "¿Cuánto? Es caro para lo que gasto habitualmente en ropa.",
        "¿Qué talle soy? No tengo referencia de cómo queda puesto.",
        "No conozco la marca, ¿me llega lo que compro?",
        "¿Puedo cambiarlo si no me va?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
    },
    {
      segmento: ICP_2,
      descripcion:
        "Varones y mujeres de 27 a 35 años de CABA y GBA con ingreso propio y criterio formado. Compran menos veces pero gastan más por compra: son los que se llevan la campera de $150.000 y el pantalón en el mismo ticket. Valoran origen, materiales y trabajo de diseño, y pagan por eso si se les demuestra. Es el segmento que deja más ganancia por venta.",
      frase: "Si voy a gastar esto en una prenda, quiero saber quién la hizo y con qué.",
      dolores: [
        "Paga precio de diseño y recibe producto de catálogo global sin ninguna particularidad.",
        "No entiende por qué una prenda nacional cuesta lo que cuesta: no ve el trabajo que hay detrás.",
        "Compró prendas caras que se deformaron o destiñeron a los dos lavados.",
        "Las marcas del segmento le hablan a alguien diez años más joven que él.",
      ],
      deseos: [
        "Comprar diseño argentino con nombre y cara detrás, no una marca sin origen.",
        "Prendas de algodón que aguanten uso real y no se arruinen en una temporada.",
        "Tener algo de edición limitada: que no lo tenga todo el mundo.",
        "Resolver la compra en un solo pedido, con envío rápido y cambios sin fricción.",
      ],
      objeciones: [
        "¿Justifica el precio frente a una marca internacional que ya conozco?",
        "¿Es realmente producción nacional o es importado reetiquetado?",
        "¿Cómo es la calidad de la tela y la costura si no puedo tocarla?",
        "Si compro online y no me va, ¿qué pasa?",
      ],
      prioridad: "primario",
      recurrencia: "media",
    },
  ],

  propuestaDeValor: {
    descripcion:
      "Kabala es una marca argentina de streetwear de diseño de autor: oversize unisex en 100% algodón, con moldería y estampas propias y producción en talleres nacionales. Cada artículo se produce en ediciones de alrededor de 50 unidades, con estampas de monumentos argentinos y bordados hechos por la marca. Se compra en kabala.com.ar con envío a todo el país, envío gratis desde $200.000, entrega en CABA en 24-48hs y hasta 3 cuotas sin interés, o en el local de Palermo.",
    diferenciador:
      "Hecha para destacar, y no para encajar. A diferencia del streetwear consolidado (que ya es masivo) y de la moda genérica (que solo etiqueta oversize un talle grande), en Kabala hay una diseñadora que hace la moldería, la estampa y la producción: el diseño tiene autor y la edición tiene límite.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion:
        "Consulta con intención de compra concreta: pregunta por talle, stock o envío de un artículo puntual, o llega al checkout y no lo cierra. Viene de la campaña de Ecommerce o del retargeting.",
      accion:
        "Responder dentro de la hora con el talle disponible y el link directo al producto. Ofrecer las 3 cuotas sin interés y el umbral de envío gratis de $200.000 para levantar el ticket.",
    },
    {
      categoria: "B",
      descripcion:
        "Interés en la marca sin producto definido: pregunta por precios generales, por la grilla de talles o si hay local físico. Viene mayormente de Awareness.",
      accion:
        "Responder con la guía de talles y el link a la categoría que corresponda. Invitar al local de Palermo si está en zona: el cierre presencial convierte mejor en ticket alto.",
    },
    {
      categoria: "C",
      descripcion:
        "Interacción sin intención comercial: comentarios, consultas por canje, pedidos de descuento o preguntas por líneas que no existen todavía.",
      accion:
        "No invertir tiempo de atención. Los pedidos de descuento se responden con financiación y cupón de recompra, nunca con rebaja sobre el precio de la prenda.",
    },
  ],

  kpis: [
    { nombre: "Visitas al perfil de Instagram", objetivo: "Métrica principal de Awareness", fuente: "Meta Ads / REE Metrics" },
    { nombre: "Tasa visita → seguidor", objetivo: "10% en el primer mes", fuente: "Meta Ads + Instagram Insights" },
    { nombre: "Seguidores nuevos", objetivo: "Crecimiento sostenido mes a mes", fuente: "Instagram Insights" },
    { nombre: "CAC (Costo de adquisición)", objetivo: "Hasta USD 20 en pantalones y USD 25 en camperas", fuente: "REE Metrics" },
    { nombre: "ROAS", objetivo: "A definir con los márgenes reales por categoría", fuente: "REE Metrics" },
    { nombre: "Compras", objetivo: "Línea de base a medir en el primer mes de Ecommerce", fuente: "Pixel + CAPI (Tienda Nube)" },
    { nombre: "Ticket promedio", objetivo: "Elevarlo hacia el umbral de envío gratis de $200.000", fuente: "Tienda Nube / REE Metrics" },
    { nombre: "Tasa de conversión del e-commerce", objetivo: "Línea de base a medir desde el Launch", fuente: "Pixel + CAPI (Tienda Nube)" },
    { nombre: "Conversión por categoría", objetivo: "Identificar la categoría ganadora para escalar", fuente: "REE Metrics" },
  ],

  presupuesto: {
    pauta: "USD 500/mes (pago de Kabala directo en Meta, cuenta publicitaria en USD): USD 150 Awareness + USD 350 Ecommerce",
    fee: "USD 500/mes (incluye REE Metrics e integración de Tienda Nube)",
    total: "USD 1.000/mes",
    cplTarget: "CAC tope tentativo: USD 20 en pantalones, USD 25 en camperas. Se recalcula con los márgenes reales.",
    limiteGastoCuenta: "USD 550/mes",
  },

  creativos: {
    piezasPorIcp: [
      { icp: ICP_1, piezas: piezasEcommerce },
      { icp: ICP_2, piezas: piezasEcommerce },
    ],
    formatos: [
      "Video UGC (9:16)",
      "Posteo Cuadrado (1080x1080)",
      "Carrusel (1080x1080) — 4 imágenes",
      "Meta Ads Shopping",
    ],
    tono: null,
    resumenPiezas:
      "7 piezas a producir (3 videos + 2 posteos + 2 carruseles) + 1 shopping de catálogo. EC-3 opcional. Se pautan en los 2 conjuntos de audiencia.",
    notaPiezas:
      "Las 8 piezas de Ecommerce se pautan en los 2 conjuntos de audiencia: la diferenciación ocurre en la segmentación del ad set, no en el creativo. Producción: 7 piezas únicas a producir (EC-3 opcional) + 1 shopping de catálogo. En total se lanzan 16 piezas a pautar en los dos conjuntos, sumadas a las 6 de Awareness (22 en total).",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_kabala_meta_awareness_disenodeautor",
      "ree_kabala_meta_conversion_ecommerce",
      "ree_kabala_meta_retargeting_visitantes",
    ],
  },

  arquitectura: [
    {
      nombre: "KABALA_Awareness",
      objetivo: "Interacción",
      status: "activa",
      conSubsecciones: true,
      tituloSeccion: "Campaña de Awareness",
      descripcionCampana:
        "Construir una audiencia amplia y medible alrededor de la marca antes de salir a vender. Se van a lanzar 6 piezas. Un solo conjunto amplio, sin fragmentar: el objetivo es juntar volumen de gente que interactúa con Kabala para después recortar audiencias de ese pool en la campaña de Ecommerce. Peso geográfico en Palermo por el local físico.",
      destino: "Perfil de Instagram (@kabala.ar)",
      kpisCampana: ["Visitas al Perfil", "Alcance", "Seguidores nuevos", "Tasa visita → seguidor"],
      conversionCampana: "Visitas al Perfil de Instagram",
      presupuestoCampana: { diario: "USD $5/día", mensual: "USD $150/mes" },
      adSets: [
        {
          nombre: "Conjunto_Amplio_CABA_Palermo",
          segmentacion:
            "Varones y mujeres de 20 a 35 años. CABA / GBA (Palermo +7 km a la redonda). Intereses: Streetwear, Urban Fashion, Designer Clothing, Unisex Clothing, Sneakers, Street Style, Fashion Design. Conjunto único y amplio a propósito: no se fragmenta en esta etapa.",
          ads: [
            "AW-1 | Video founder: diseño de autor e industria nacional",
            "AW-2 | Video lookbook: subtítulos rápidos + montaje visual",
            "AW-3 | Posteo manifiesto: Hecha para destacar, y no para encajar",
            "AW-4 | Posteo drop verano: coming soon + grilla de close-ups",
          ],
        },
      ],
      piezas: piezasAwareness,
      referencias: [
        { url: assetDataUri("ref1-ad-library-video.mp4"), titulo: "Referencia 1 — Video Ad Library (Meta Ads ID 929197493237212)", tipo: "video" },
        { url: assetDataUri("ref5-ad-library-video2.mp4"), titulo: "Referencia 2 — Video Ad Library (montaje rápido con subtítulos)", tipo: "video" },
        { url: assetDataUri("nude-project-pants.jpg"), titulo: "Referencia 3 — Modelo con pantalón, plano completo editorial", tipo: "image" },
        { url: assetDataUri("mertra-september-drop.jpg"), titulo: "Referencia 4 — Grilla de close-ups de producto con logo centrado (Mertra September Drop)", tipo: "image" },
        { url: assetDataUri("mertra-orbit-hood-joggers.jpg"), titulo: "Referencia 5 — Modelo con look completo, 2 ángulos frente y espalda (Mertra Orbit Hood & Joggers)", tipo: "image" },
        { url: assetDataUri("bomba-modelo-oversize.jpg"), titulo: "Referencia 6 — Modelo con oversize, plano completo urbano", tipo: "image" },
      ],
      postesDirectos: [
        { url: "https://www.instagram.com/p/DdpRzyWHTZJ/", titulo: "Posteo 1 — Publicar desde @kabala.ar" },
        { url: "https://www.instagram.com/p/DeDJu2YnSPp/", titulo: "Posteo 2 — Publicar desde @kabala.ar" },
      ],
      bannerPiezas: "6 anuncios de Awareness a pautar (2 videos + 2 posteos + 2 posteos directos desde el perfil).",
    },
    {
      nombre: "KABALA_Ventas",
      objetivo: "Ventas",
      status: "en-desarrollo",
      tituloSubseccion: "Campaña de Ecommerce en Meta Ads",
      descripcionCampana:
        "Convertir la audiencia construida en Awareness en ventas en kabala.com.ar. Dos conjuntos por madurez de compra con 2 tipos de audiencias jóvenes a testear: el explorador de tendencia (18-27, ticket bajo, alta frecuencia) y el comprador de diseño (27-35, ticket alto, menor frecuencia). Las 6 piezas se pautan en ambos conjuntos: la diferenciación es de audiencia, no de creativo.",
      destino: "kabala.com.ar (home y categorías: Pantalones, Camperas, Buzos, Remeras)",
      kpisCampana: ["Visitas a página de producto", "Compras", "ROAS", "Ticket promedio"],
      conversionCampana: "Compras (Purchase)",
      presupuestoCampana: { diario: "USD $11,7/día", mensual: "USD $350/mes" },
      adSets: [
        {
          nombre: "Conjunto_Explorador_Tendencia",
          segmentacion:
            "Varones y mujeres de 18 a 27 años. CABA / GBA (Palermo +7 km a la redonda). Intereses: Streetwear, Urban Fashion, Sneakers, Street Style, Unisex Clothing, Fashion Trends. Se suma audiencia similar a partir de los interactuadores de la campaña de Awareness.",
          ads: [
            "EC-1 | Video UGC GRWM / Unboxing — Mujer",
            "EC-2 | Video UGC GRWM / Unboxing — Hombre",
            "EC-3 | Video Comercial Split-Screen — Drop Octubre (opcional)",
            "EC-4 | Posteo Drop Octubre — Hombre",
            "EC-5 | Posteo Drop Octubre — Mujer",
            "EC-6 | Carrusel Drop Hombre (4 imágenes)",
            "EC-7 | Carrusel Drop Mujer (4 imágenes)",
            "EC-8 | Meta Ads Shopping — Catálogo completo o drop próximo",
          ],
        },
        {
          nombre: "Conjunto_Comprador_Diseno",
          segmentacion:
            "Varones y mujeres de 27 a 35 años. CABA / GBA (Palermo +7 km a la redonda). Intereses: Designer Clothing, Fashion Design, Streetwear, Unisex Clothing, Online Shopping, Premium Fashion. Comportamiento: compradores online frecuentes. Se suma audiencia similar a partir de los interactuadores de Awareness y retargeting de visitantes del sitio.",
          ads: [
            "EC-1 | Video UGC GRWM / Unboxing — Mujer",
            "EC-2 | Video UGC GRWM / Unboxing — Hombre",
            "EC-3 | Video Comercial Split-Screen — Drop Octubre (opcional)",
            "EC-4 | Posteo Drop Octubre — Hombre",
            "EC-5 | Posteo Drop Octubre — Mujer",
            "EC-6 | Carrusel Drop Hombre (4 imágenes)",
            "EC-7 | Carrusel Drop Mujer (4 imágenes)",
            "EC-8 | Meta Ads Shopping — Catálogo completo o drop próximo",
          ],
        },
      ],
      badgesPiezas: ["En desarrollo", "Depende de producción 02/10"],
      referencias: [
        { url: assetDataUri("ref-video-ventas-2.mp4"), titulo: "Referencia 1 — Video UGC", tipo: "video" },
        { url: assetDataUri("ref-video-ventas.mp4"), titulo: "Referencia 2 — Video UGC (Biblioteca de Anuncios)", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-3.mp4"), titulo: "Referencia 3 — Video UGC (Biblioteca de Anuncios 2)", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-4.mp4"), titulo: "Referencia 4", tipo: "video" },
        { url: assetDataUri("ref-video-ventas-5.mp4"), titulo: "Referencia 5", tipo: "video" },
        { url: assetDataUri("ref-ventas-6.jpg"), titulo: "Referencia 6", tipo: "image" },
        { url: assetDataUri("ref-ventas-4.jpg"), titulo: "Referencia 7", tipo: "image" },
        { url: assetDataUri("ref-ventas-5.jpg"), titulo: "Referencia 8", tipo: "image" },
        { url: [assetDataUri("ref-carrusel-ventas-1.jpg"), assetDataUri("ref-carrusel-ventas-2.jpg"), assetDataUri("ref-carrusel-ventas-3.jpg")].join("||"), titulo: "Referencia 9 — Carrusel de producto (3 imágenes)", tipo: "carousel" },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Camila Sampayo (personalmente, desde el local de Palermo)",
    capacidadDiaria:
      "Limitada. Camila atiende el local, diseña, produce y responde los DM. El contenido y la atención son el cuello de botella real del proyecto, no la pauta.",
    tiempoRespuesta: "Variable según la carga del local. Sin proceso definido ni respuestas rápidas armadas.",
    validado: false,
  },

  notas:
    "Kabala arrancó en etapa cero de pauta: sin Facebook Page, sin cuenta publicitaria, sin Pixel y con la web recién lanzada la semana del 21/09. El setup se hizo en la KO Call del 01/10: Page creada bajo una cuenta de Facebook nueva con el email de la marca (la cuenta vieja de Cami no se pudo recuperar), @kabala.ar vinculado, cuenta publicitaria en USD (para evitar la percepción RG de ~45% de pagar en pesos) y growth@ como admin con permisos totales. Pendientes del setup: método de pago en dólares (tipo Arquiv / dólar A), límite de gasto de USD 550/mes y completar Pixel + CAPI vía Tienda Nube ('Kabala - Pixel' dado de alta el 06/10). La producción con modelo mujer se realizó el 02/10 en Puerto Madero; el material se entrega por Drive y falta que Cami suba los productos de mujer a Tienda Nube.\n\nDiferencias con la propuesta F1 que quedaron resueltas en el Kick Off: (1) la propuesta asumía un negocio puramente online, pero Kabala abrió local físico en Palermo hace 3 semanas, que en esta estrategia entra como peso geográfico del conjunto de Awareness; (2) la propuesta segmentaba 'varones de 20 a 32 años', pero la producción es unisex y las ventas reales van de los 16 a los 30 y pico en ambos géneros, por lo que los 2 ICPs se definen por madurez de compra y no por género.\n\nRegla de marca no negociable: Camila no hace sale ni descuentos. Para Black Friday la palanca es financiación en cuotas sin interés, cupón de recompra y servicio de estilismo. Las camperas no se liquidan: se reposicionan con el ángulo de viaje al frío del hemisferio norte en enero.\n\nEl contenido es la restricción dura del proyecto. Camila trabaja sola, está sumando una persona para contenido y evalúa un pack mensual de estudio. Las 10 piezas del acuerdo están dimensionadas contra esa capacidad real: no comprometer más volumen de creativos.\n\nPendientes de Camila comprometidos en el Kick Off: manual de marca, 5 inspiraciones, 5 referentes de comunicación (no de indumentaria), márgenes por categoría, objetivo de venta mensual, subir los productos de mujer a Tienda Nube y confirmar la foto del mismo pantalón en varón y en mujer para EC-2. Ya entregados: lista de competidores (en investigación en Ad Library) y la producción del 02/10 con modelo mujer.\n\nOrgánico fuera de scope de pauta: Camila planea un canal de YouTube con contenido técnico de confección y día a día de la marca, máquinas expendedoras en el local y una línea de niños para el año que viene. Nada de eso lleva pauta en este ciclo.",

  ofertas: null,

  cambiosEcommerce: null,

  competenciaAds: {
    marca: "Streetwear argentino",
    cuenta: "Segmento",
    adLibraryUrl: "",
    formatos: [
      { id: "f01", tipo: "Video / Reel", dolor: "No conoce la marca ni vio las prendas puestas en un cuerpo real" },
      { id: "f02", tipo: "Shopping / Catálogo", dolor: "Ve una prenda en el feed y no encuentra el resto del catálogo ni el precio" },
      { id: "f03", tipo: "Lookbook", dolor: "No sabe cómo combinar la prenda ni cómo se ve el look completo" },
      { id: "f04", tipo: "Carrusel", dolor: "No sabe qué talle pedir ni cómo cae el oversize en su cuerpo" },
      { id: "f05", tipo: "Imagen estática", dolor: "Duda del origen y la calidad: no sabe si es producción nacional o importado reetiquetado" },
    ],
    competidores: [
      { nombre: "King of the Kongo", estado: "18 anuncios activos en ARG", activo: true, avatarFile: assetDataUri("avatar-king-of-the-kongo.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=515147638593317" },
      { nombre: "Bomba Project", estado: "52 anuncios activos en ARG", activo: true, avatarFile: assetDataUri("avatar-bomba-project.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=102879075240540" },
      { nombre: "Fréres", estado: "28 anuncios activos en ARG", activo: true, avatarFile: assetDataUri("avatar-freres.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=1796449460437201" },
      { nombre: "Harvey Willys", estado: "29 anuncios activos en ARG", activo: true, avatarFile: assetDataUri("avatar-harvey-willys.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=196453127561199" },
      { nombre: "Strides", estado: "910 anuncios activos a nivel global", activo: true, avatarFile: assetDataUri("avatar-strides.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=100264978928447" },
      { nombre: "Nude Project", estado: "3400 anuncios activos a nivel global", activo: true, avatarFile: assetDataUri("avatar-nude-project.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[mode]=total_impressions&sort_data[direction]=desc&view_all_page_id=299266634324735" },
      { nombre: "Scuffers", estado: "240 anuncios activos en ARG", activo: true, avatarFile: assetDataUri("avatar-scuffers.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=1339125179482841" },
      { nombre: "Mertra", estado: "110 anuncios activos a nivel global", activo: true, avatarFile: assetDataUri("avatar-mertra.jpg"), instagramUrl: "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=105621341878784" },
    ],
    observacion:
      "El segmento local está dominado por streetwear consolidado (King of the Kongo, Bomba Project, Fréres, Harvey Willys) que ya tiene audiencia construida y compite por precio y volumen de producto. A nivel global, marcas como Strides, Nude Project, Scuffers y Mertra son la referencia de posicionamiento y comunicación para Kabala: diseño de autor, ediciones limitadas y producción propia. **Kabala compite en ese espacio de diseño de autor con edición limitada y prendas 100% industria argentina, que es exactamente el hueco que las marcas locales consolidadas no ocupan.**",
  },

  referenciasMoodboard: null,

  reeMetricsFeatures: [
    {
      titulo: "Dashboard",
      desc: "CPA, ROAS, ticket promedio y conversión por categoría de Meta Ads y Tienda Nube en tiempo real, sin esperar el reporte.",
    },
    {
      titulo: "Customer Journey",
      desc: "De qué anuncio vino cada venta, qué producto miró antes y dónde abandonó el checkout. Atribución real, no la estimada de Meta.",
    },
    {
      titulo: "E-Commerce",
      desc: "Ventas de Tienda Nube cruzadas con la pauta: qué categoría convierte mejor y cuánto cuesta cada venta por categoría.",
    },
  ],

  roadmap: [
    {
      nombre: "Awareness de Marca",
      fases: [
        { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
        { nombre: "Build", semanaInicio: 2, semanaFin: 2 },
        { nombre: "Launch", semanaInicio: 3, semanaFin: 4 },
        { nombre: "Scale", semanaInicio: 5, semanaFin: 8 },
      ],
    },
    {
      nombre: "Funnel Ecommerce (B2C)",
      fases: [
        { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
        { nombre: "Build", semanaInicio: 2, semanaFin: 3 },
        { nombre: "Launch", semanaInicio: 4, semanaFin: 5 },
        { nombre: "Scale", semanaInicio: 6, semanaFin: 8 },
      ],
    },
  ],

  // Calendario real de Kabala. Kick Off 28/09/2026 (lunes).
  // S1 28/09-04/10 · S2 05/10-11/10 · S3 12/10-18/10 · S4 19/10-25/10
  // S5 26/10-01/11 · S6 02/11-08/11 · S7 09/11-15/11 · S8 16/11-22/11
  reviewMilestones: [
    { semana: 1, label: "KO Call", fecha: "01/10" },
    { semana: 3, label: "Foundation Review", fecha: "09/10 o 12/10" },
    { semana: 3, label: "Launch AW", fecha: "15/10" },
    { semana: 4, label: "Launch B2C", fecha: "21/10" },
    { semana: 6, label: "Call ADS", fecha: "04/11" },
    { semana: 8, label: "Review Final", fecha: "18/11" },
  ],

  reviewMeetings: [
    {
      semana: "S1",
      nombre: "KO Call",
      fecha: "01/10",
      desc: "Setup de Meta realizado: Page creada con cuenta nueva de Facebook, @kabala.ar vinculado, cuenta publicitaria en USD y REE como admin. Quedaron pendientes el método de pago y el Pixel (dado de alta el 06/10).",
      status: "done",
    },
    {
      semana: "S2",
      nombre: "Foundation Review",
      fecha: "09/10 o 12/10",
      desc: "Estrategia de las 2 campañas, los 2 ICPs y las piezas creativas. Aprobación para producir el contenido y encender.",
      status: "current",
    },
    {
      semana: "S3",
      nombre: "Launch Awareness",
      fecha: "15/10",
      desc: "Activación de KABALA_Awareness hacia @kabala.ar. Testeo de las 4 piezas con inversión real.",
      status: "pending",
    },
    {
      semana: "S4",
      nombre: "Launch Ecommerce",
      fecha: "21/10",
      desc: "Activación de KABALA_Ventas hacia kabala.com.ar con los eventos de conversión ya midiendo en REE Metrics.",
      status: "pending",
    },
    {
      semana: "S6",
      nombre: "Call ADS",
      fecha: "04/11",
      desc: "Seguimiento de ambas campañas activas. Presupuesto al creativo y la audiencia ganadora. Plan de Black Friday sin descuento.",
      status: "pending",
    },
    {
      semana: "S8",
      nombre: "Review Final",
      fecha: "18/11",
      desc: "Resultados del ciclo completo vs KPIs y plan del siguiente. Las campañas entran a Black Friday (27/11) ya rodadas.",
      status: "pending",
    },
  ],

  proximosPasos: [
    {
      titulo: "Setear las campañas",
      responsable: "REE Growth",
      tiempo: "Semana del 06/10",
      items: [
        "Montar KABALA_Awareness y KABALA_Ventas en Meta Ads con las audiencias definidas",
        "Configurar los conjuntos de anuncios por madurez de compra (Explorador de tendencia / Comprador de diseño)",
        "Dejar las campañas listas para encender en cuanto el contenido esté aprobado",
      ],
    },
    {
      titulo: "Generar el contenido para lanzar",
      responsable: "Camila",
      tiempo: "1 semana post Foundation Review",
      items: [
        "Subir los productos de mujer a Tienda Nube (bloqueante del lanzamiento de Ecommerce)",
        "Producir las piezas de Awareness (2 videos + 2 posteos) y las de Ecommerce (videos UGC, posteos y carruseles del drop)",
        "Entregar el material editado por Drive para que REE suba los anuncios",
      ],
    },
  ],
};

// --- Generate 3 HTMLs ---

const onboarding = renderOnboardingHtml(data);
const strategy = renderStrategyHtml(data);
const brief = renderBriefHtml(data);

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
