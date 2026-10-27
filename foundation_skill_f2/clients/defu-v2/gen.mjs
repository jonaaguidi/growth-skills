import { renderStrategyHtml } from "../../dist/lib/strategy-renderer.js";
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// Foundation v2 :: DEFU — B2B + Campaña de Conversión v2
//
// Documento acotado: la única bajada nueva son los GUIONES de las 4 piezas de
// Conversión v2 (2 videos + 2 carruseles) que empujan el Combo Tofu Duro 800g
// Restock x6. El B2B entra como campaña en desarrollo, sin creativos, hasta
// validar la capacidad comercial de Angel.
//
// Origen: catchup Sergio x Jonas del 26/10/2026 + top productos últimos 30 días.
// Este script NO toca clients/defu/ ni republica defu.html: usa su propio slug.

const URL_X6 = "https://www.defu.com.ar/productos/combo-tofu-duro-800g-restock-x6-1mecw/";
const URL_DEGUSTACION = "https://www.defu.com.ar/productos/combo-degustacion-de-tofu-completo-3o7l4/";

// Campaña B2B a WhatsApp — APARCADA, no entra en este documento.
// Es algo a conversar con Angel antes de bajarla a papel: el B2B es un proceso
// comercial con seguimiento y negociación, y primero hay que saber quién atiende
// esos mensajes. La estrategia queda escrita acá para retomarla cuando se defina.
// Para reactivarla: volver a meter este objeto en `data.arquitectura`.
const campanaB2BAparcada =   {
    nombre: "DEFU_B2B",
    objetivo: "Mensajes",
    status: "en-desarrollo",
    tituloSeccion: "Campaña B2B (WhatsApp)",
    tituloSubseccion: "Campaña B2B en Meta Ads",
    descripcionCampana: "Captar locales gastronómicos y dietéticas de CABA y Zona Norte que ya usan o revenden tofu, y llevarlos a una conversación de WhatsApp con Angel. La campaña está diseñada pero no se lanza todavía: el B2B no es una compra de carrito, es un proceso comercial con seguimiento, negociación de precio por volumen y entrega pactada. Antes de poner un peso hay que saber quién atiende esos mensajes y en cuánto tiempo.",
    notaCampana: "Bloqueante: validar con Angel la capacidad comercial. Si hoy nadie puede responder un lead B2B en el día, el contacto se enfría y el presupuesto se quema. Si Angel no da abasto, la alternativa es montarle un flujo de captación y calificación automática en WhatsApp antes de encender la pauta.",
    destino: "WhatsApp Business (+54 9 11 2750 2097)",
    kpisCampana: ["Conversaciones iniciadas", "Leads calificados A", "Costo por conversación"],
    conversionCampana: "Mensajes a WhatsApp",
    presupuestoCampana: null,
    adSets: [
      {
        nombre: "Conjunto_Gastronomia_PlantBased",
        segmentacion: "28-55 años, CABA y Zona Norte. Cargo del decisor: Dueño/a de restaurante, Chef, Encargado/a de compras. Tamaño: local gastronómico independiente de 1 a 3 sucursales. Intereses profesionales: Industria de restaurantes, Gastronomía vegana, Cocina asiática, Proveedores de alimentos, Food service, Emprendedores gastronómicos.",
        ads: [
          "Piezas a definir tras validar la capacidad comercial de Angel",
        ],
      },
      {
        nombre: "Conjunto_Retail_Saludable",
        segmentacion: "28-55 años, CABA y Zona Norte. Cargo del decisor: Dueño/a de dietética o almacén natural, Encargado/a de compras. Tamaño: comercio minorista independiente. Intereses profesionales: Comercio minorista de alimentos, Dietéticas, Alimentos orgánicos, Productos naturales, Distribución de alimentos.",
        ads: [
          "Piezas a definir tras validar la capacidad comercial de Angel",
        ],
      },
    ],
  };
void campanaB2BAparcada;

const data = {
  clientInfo: {
    nombreEmpresa: "Defu — The Tofu Co.",
    slug: "defu-v2",
    nombreContacto: "Angel",
    industria: "Alimentos artesanales / Plant-based",
    sitioWeb: "defu.com.ar",
    email: null,
    telefono: null,
    fechaCierre: "2026-08-12",
  },
  datosF1: {
    inversionMensual: "USD 500/mes (fee REE)",
    presupuestoPauta: "USD 750/mes",
    cplObjetivo: "$240 ARS (visita al e-commerce)",
    canalesRecomendados: ["Instagram Ads", "Facebook Ads", "E-commerce (defu.com.ar)", "WhatsApp Business"],
    palancaPropuesta: "Conversión: reconstruir el ROAS con creativo nuevo y geo nueva",
    campanasVendidas: ["Awareness de Marca", "Funnel B2C (Ecommerce)", "Conversión v2"],
    duracionProyecto: "4 semanas (ciclo v2)",
    fechaInicio: null,
    fechaFin: "23/11",
    fechaInicioISO: "2026-10-27",
  },

  // A. Onboarding — ya ejecutado en el ciclo original (agosto 2026).
  // Se deja el mínimo que el Foundation Review necesita leer.
  equipoAsignado: [
    { nombre: "Jonas", rol: "Growth Manager", telefono: null },
    { nombre: "Sergio Suarez", rol: "Account Lead", telefono: null },
    { nombre: "Flor", rol: "Content / Creativos", telefono: null },
  ],

  grupoWhatsApp: {
    titulo: "Grupo WhatsApp",
    items: [
      { label: "Grupo cliente Defu x REE Growth activo", status: "hecho", notas: null },
    ],
  },

  metaBusiness: {
    cuentaMaestra: "growth@reecreativos.com",
    businessPortfolio: { titulo: "Business Portfolio", items: [{ label: "Portfolio y cuenta publicitaria de Defu operativos", status: "hecho", notas: null }] },
    facebookPage: { titulo: "Facebook Page", items: [{ label: "Facebook Page de Defu creada y vinculada", status: "hecho", notas: null }] },
    instagramBusiness: { titulo: "Instagram Business", items: [{ label: "@defu.tofuco vinculado al portfolio", status: "hecho", notas: null }] },
    adAccount: {
      titulo: "Ad Account",
      items: [
        { label: "Cuenta publicitaria activa con tarjeta de Angel", status: "hecho", notas: null },
        { label: "Subir el límite de gasto de la cuenta", status: "pendiente", notas: "Hoy está en USD 550/mes y el plan v2 gasta USD 750/mes. Si no se sube, Meta corta las campañas a mitad de mes." },
      ],
    },
    pixel: { titulo: "Pixel de Meta", items: [{ label: "Pixel instalado en defu.com.ar con eventos de compra", status: "hecho", notas: null }] },
    capi: { titulo: "Conversions API (CAPI)", items: [{ label: "Revisar deduplicación de eventos antes del relanzamiento", status: "pendiente", notas: null }] },
    edgeCases: [],
  },

  requerimientosCliente: {
    brandAssets: {
      titulo: "Brand Assets",
      items: [
        { label: "Fotos de producto del Combo Restock x6 y x9", status: "pendiente", notas: "Necesarias para los 2 carruseles. Se pueden levantar en el rodaje del viernes 30/10." },
      ],
    },
    accesoWeb: {
      titulo: "Acceso Web",
      items: [
        { label: "Acceso admin a Tienda Nube (defu.com.ar)", status: "hecho", notas: null },
      ],
    },
    whatsappInfo: {
      titulo: "WhatsApp",
      items: [
        { label: "Número de WhatsApp Business", status: "hecho", notas: "+54 9 11 2750 2097" },
        { label: "Definir flujo de atención para leads B2B", status: "pendiente", notas: "Bloqueante para lanzar la campaña B2B." },
      ],
    },
    atencionLeads: {
      titulo: "Atención de Leads",
      items: [
        { label: "Validar quién atiende los mensajes B2B y en cuánto tiempo", status: "pendiente", notas: "Angel atiende todo personalmente y administra otros dos locales." },
      ],
    },
    accesoPlataforma: {
      nombrePlataforma: "Tienda Nube",
      descripcion: "E-commerce de Defu (defu.com.ar)",
      items: [
        { label: "Tienda Nube conectada a REE Metrics", status: "hecho", notas: null },
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

  // B. Estrategia
  palanca: {
    nombre: "Conversión",
    justificacion: "La campaña de ventas venía con ROAS por 9. Al duplicar el presupuesto de USD 300 a USD 600/mes el ROAS cayó a por 3 en cuestión de días: se rompió el aprendizaje de la campaña, en el peor mes del año para comprar pauta (CPM inflado por Cyber Monday). La palanca no es gastar más, es repartir mejor. Bajamos la campaña original a su presupuesto rentable y abrimos una campaña nueva, con creativo nuevo y geo nueva, para que el aprendizaje arranque limpio y no canibalice lo que ya funciona.",
  },

  // ICPs de la campaña B2B (en evaluación). Los ICPs B2C ya están
  // documentados en el Foundation original y no se repiten acá.
  icp: [
    {
      segmento: "Gastronomía plant-based",
      descripcion: "Restaurantes veganos y vegetarianos, casas de comida asiática, rotiserías saludables y cocinas de barrio de CABA y Zona Norte que ya usan tofu todos los días. Hoy compran tofu industrial a un mayorista o lo traen del Barrio Chino. Decide el dueño o el chef, casi siempre la misma persona.",
      frase: "Necesito un proveedor de tofu que me entregue siempre, con factura y con la misma calidad todas las semanas",
      dolores: [
        "El tofu industrial le sale barato pero le baja la calidad del plato y el comensal lo nota",
        "Tiene que ir al Barrio Chino a buscar producto y le come medio día de operación",
        "El proveedor actual le falla con el stock justo los fines de semana",
        "No consigue factura ni habilitación sanitaria de quien le vende artesanal",
      ],
      deseos: [
        "Un proveedor local con entrega semanal fija y precio mayorista cerrado",
        "Tofu artesanal con habilitación sanitaria que pueda mostrar en una inspección",
        "Variedad (común, duro, especiado, saborizados) para armar carta sin cambiar de proveedor",
        "Poder pedir por WhatsApp sin tener que llamar ni ir hasta la planta",
      ],
      objeciones: [
        "¿Me vas a poder abastecer todas las semanas o sos un emprendimiento chico?",
        "¿Cuál es el precio por kilo a volumen y desde cuánto me entregás?",
        "Ya tengo proveedor, ¿para qué cambio?",
      ],
      prioridad: "primario",
      recurrencia: "alta",
      badge: "Demanda activa",
      icono: "empresa",
      ejemplosMarcas: [
        {
          marca: "Restaurante vegano, casa de comida asiática o rotisería saludable",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Dueño/a o Chef ejecutivo",
          caso: "Local de CABA o Zona Norte que ya tiene tofu en la carta y lo compra industrial o en el Barrio Chino. Busca un proveedor cerca, con factura y entrega fija, que le levante la calidad del plato sin romperle el costo.",
        },
      ],
    },
    {
      segmento: "Retail saludable",
      descripcion: "Dietéticas, almacenes naturales, tiendas plant-based y cafeterías saludables que revenden producto fresco. No cocinan: compran para góndola o heladera exhibidora. Decide el dueño del local o el encargado de compras.",
      frase: "Quiero sumar tofu fresco a la heladera, pero necesito que rote y que el proveedor me reponga",
      dolores: [
        "La góndola de plant-based la domina una sola marca industrial y no la diferencia de la dietética de la otra cuadra",
        "El producto fresco le vence antes de rotar y pierde plata",
        "No tiene cómo contarle al cliente por qué ese tofu es mejor que el del supermercado",
        "Los mínimos de compra de los mayoristas son más grandes que su rotación real",
      ],
      deseos: [
        "Una marca artesanal con historia propia que le dé diferencial frente al super",
        "Reposición frecuente y en cantidades chicas, acorde a la rotación del local",
        "Material de punto de venta y contenido para comunicar el producto",
        "Margen de reventa claro y precio de lista estable",
      ],
      objeciones: [
        "¿Cuánto me dura en heladera antes de vencer?",
        "¿Cuál es el mínimo de compra y cada cuánto me reponés?",
        "¿Me vas a vender también por e-commerce y competirme el precio?",
      ],
      prioridad: "secundario",
      recurrencia: "media",
      badge: "Demanda latente",
      icono: "empresa",
      ejemplosMarcas: [
        {
          marca: "Dietética de barrio, almacén natural o cafetería plant-based",
          rubro: "Ejemplo ilustrativo del perfil",
          rol: "Dueño/a o Encargado/a de compras",
          caso: "Local de CABA o Zona Norte con heladera exhibidora y clientela fija. Vende plant-based industrial y busca una marca artesanal local que le dé diferencial de góndola sin exigirle un mínimo de compra grande.",
        },
      ],
    },
  ],

  propuestaDeValor: {
    descripcion: "Tofu artesanal fresco, elaborado todos los días por una familia china-argentina en Buenos Aires. Más de 20 productos: tofu en 11 variedades, masas para gyozas, wantán y arrolladitos primavera. Envío en el día en CABA. Único productor artesanal con habilitación sanitaria completa.",
    diferenciador: "Único productor artesanal de tofu con habilitación sanitaria en Buenos Aires. Fresco del día, no industrial. Historia familiar auténtica.",
  },

  calificacionLeads: [
    {
      categoria: "A",
      descripcion: "Local gastronómico o dietética que pide precio mayorista, volumen o condiciones de entrega. Intención de compra clara.",
      accion: "Contacto en menos de 2 horas. Enviar lista mayorista, mínimo de compra y días de entrega.",
    },
    {
      categoria: "B",
      descripcion: "Consulta genérica de un local sobre productos, zona de entrega o habilitación. Interés sin intención inmediata.",
      accion: "Contacto en menos de 24 horas. Enviar catálogo y proponer una visita o muestra.",
    },
    {
      categoria: "C",
      descripcion: "Consumidor final que entra por la campaña B2B. No califica como lead comercial.",
      accion: "Derivar a defu.com.ar con el link de combos. Sin seguimiento manual.",
    },
  ],

  kpis: [
    { nombre: "ROAS Conversión v2", objetivo: "> 3x en las primeras 2 semanas", fuente: "Meta Ads" },
    { nombre: "ROAS DEFU_Ventas (original)", objetivo: "Recuperar > 6x con presupuesto a USD 300/mes", fuente: "Meta Ads" },
    { nombre: "CPA (compra en Tienda Nube)", objetivo: "$12.000 ARS", fuente: "Tienda Nube + Pixel" },
    { nombre: "Ticket promedio", objetivo: "$48.600 a $79.200 ARS (precio de los dos combos)", fuente: "Tienda Nube" },
    { nombre: "Unidades Combo Restock x6", objetivo: "> 23/mes (base últimos 30 días)", fuente: "Tienda Nube" },
    { nombre: "Unidades Combo Degustación", objetivo: "> 16/mes (base últimos 30 días)", fuente: "Tienda Nube" },
    { nombre: "Peso de los 2 combos en la facturación", objetivo: "> 31% (base últimos 30 días)", fuente: "Tienda Nube" },
    { nombre: "CPM", objetivo: "Monitorear vs. octubre — se espera normalización post Cyber Monday", fuente: "Meta Ads" },
  ],

  presupuesto: {
    pauta: "USD 750/mes (tarjeta de Angel en Meta): USD 150 Awareness + USD 300 DEFU_Ventas + USD 300 Conversión v2",
    fee: "USD 500/mes (fee REE Growth)",
    total: "USD 1.250/mes",
    cplTarget: "$240 ARS por visita al e-commerce",
    limiteGastoCuenta: "Subir a USD 800/mes — hoy está en USD 550 y corta la pauta a mitad de mes",
  },

  // Los guiones viven en arquitectura[].piezas (campaña activa).
  // Esta sección queda vacía a propósito: este documento no re-arma el brief por ICP.
  creativos: {
    piezasPorIcp: null,
    angulos: null,
    formatos: ["Video Comercial Vertical (9:16)", "Carrusel (1080x1080)"],
    tono: "Cercano, directo, sin formalidades. Angel a cámara, cocina real, producto en mano. Nada de claims de laboratorio: se muestra la cuenta y el plato.",
  },

  utm: {
    campaignFormat: "ree_{cliente}_{canal}_{objetivo}_{variante}",
    ejemplos: [
      "ree_defu_meta_conversion_combox6",
      "ree_defu_meta_conversion_geonueva",
      "ree_defu_meta_mensajes_b2b",
    ],
  },

  arquitectura: [
    // ─────────────────────────────────────────────────────────────────
    // CAMPAÑA ACTIVA: Conversión v2 — las 4 piezas nuevas viven acá
    // ─────────────────────────────────────────────────────────────────
    {
      nombre: "DEFU_Conversion_v2",
      objetivo: "Ventas",
      status: "activa",
      conSubsecciones: true,
      tituloSeccion: "Campaña de Conversión v2",
      tituloSubseccion: "Campaña de Conversión v2 en Meta Ads",
      descripcionCampana: "Campaña nueva, separada de DEFU_Ventas, para que el aprendizaje arranque limpio y concentrada en los dos productos que ya demostraron que venden.<br><br><strong>Qué pasó.</strong> El ROAS cayó de por 9 a por 3 tres o cuatro días después de duplicar el presupuesto de DEFU_Ventas de USD 300 a USD 600/mes. El salto le reinició el aprendizaje a una campaña que venía rentable, y encima el CPM de Meta está inflado en octubre y noviembre por la pelea de Cyber Monday.<br><br><strong>Qué decidimos.</strong> No subir más presupuesto, repartirlo. DEFU_Ventas vuelve a USD 300/mes y no se le toca nada más. Los otros USD 300 arrancan esta campaña nueva. DEFU_Awareness sigue intacta en USD 150/mes.<br><br><strong>Por qué estos dos productos.</strong> En los últimos 30 días el Combo Degustación de Tofu Completo y el Combo Tofu Duro 800g Restock x6 se llevaron el <strong>31% de la facturación del mes</strong> entre los dos: $1.267.200 (16,6%) y $1.117.800 (14,6%), con 39 unidades sumadas. Son los dos caballos que ya corren solos. En lugar de repartir el presupuesto entre quince combos, esta campaña pone todo el peso ahí.<br><br><strong>Un producto, un público, dos piezas.</strong><br>• <strong>Combo Restock x6 ($48.600)</strong> — le habla a quien ya come tofu y se queda sin. Un video y un carrusel sobre tener el mes resuelto.<br>• <strong>Combo Degustación ($79.200)</strong> — le habla a quien todavía no se animó. Un video de unboxing y un carrusel que explica qué es cada uno de los 11 productos.<br><br><strong>Público ampliado en anillos, no reemplazado.</strong> En lugar de cambiar de público, abrimos radio desde el núcleo que ya convierte hacia afuera.<br>• <strong>Anillo 1, el que ya convierte</strong> — Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo y Vicente López. Es exactamente el público que hoy tiene prendido DEFU_Ventas.<br>• <strong>Anillo 2, Capital pegado al núcleo</strong> — Recoleta, Almagro, Caballito, Chacarita, Villa Ortúzar y Villa del Parque. Solo los barrios que lindan con el Anillo 1, no Capital entera.<br>• <strong>Anillo 3, Gran Buenos Aires Norte y Oeste</strong> — Olivos, La Lucila, Martínez y San Isidro por el norte; Ciudadela, Ramos Mejía, Haedo y Morón por el oeste. Cuatro y cuatro, las más cercanas de cada lado.<br><br>Los tres anillos corren dentro del mismo conjunto: con USD 150 por producto no da para partirlos en seis ad sets sin matar el aprendizaje. La lectura se hace con el desglose por región de Meta, y el anillo que no rinda se corta. Cada conjunto lleva además su propio stack de intereses: recompra para el x6, descubrimiento para el Degustación.",
      destino: "defu.com.ar — Combo Tofu Duro Restock x6 y Combo Degustación de Tofu Completo",
      kpisCampana: ["Compras", "ROAS", "Costo por compra"],
      conversionCampana: "Compras en defu.com.ar",
      presupuestoCampana: { diario: "USD $10/día", mensual: "USD $300/mes" },
      badgesPiezas: ["4 piezas a producir", "Rodaje viernes 30/10"],
      adSets: [
        {
          nombre: "Conjunto_Restock_Recompra",
          segmentacion: "25-45 años, Anillo 1 — el que ya convierte: Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo, Vicente López | Anillo 2 — Capital, pegado al núcleo: Recoleta, Almagro, Caballito, Chacarita, Villa Ortúzar, Villa del Parque | Anillo 3 — GBA Norte y Oeste: Olivos, La Lucila, Martínez, San Isidro, Ciudadela, Ramos Mejía, Haedo, Morón. Intereses: Tofu, Veganismo, Vegetarianismo, Alimentación vegana, Proteína vegetal, Alimentación saludable, Planificación de comidas. Nota: La geo se arma en anillos desde el núcleo que ya convierte hacia afuera — el Anillo 1 es exactamente el público que hoy tenemos prendido en DEFU_Ventas, el 2 abre a Capital completa y el 3 sale a Gran Buenos Aires Norte y Oeste, y leemos el desglose por región en Meta para cortar el anillo que no rinda.",
          ads: [
            "Anuncio_Reel_SinTofu_V1 | Video, te pasó de ir a cocinar y no tener tofu — Combo Restock x6",
            "Anuncio_Carrusel_UnPedidoTodoElMes_V1 | Carrusel, 4,8 kg, 12 comidas y un solo envío — Combo Restock x6",
          ],
        },
        {
          nombre: "Conjunto_Degustacion_Descubrimiento",
          segmentacion: "25-45 años, Anillo 1 — el que ya convierte: Belgrano, Núñez, Palermo, Colegiales, Saavedra, Villa Urquiza, Coghlan, Villa Crespo, Vicente López | Anillo 2 — Capital, pegado al núcleo: Recoleta, Almagro, Caballito, Chacarita, Villa Ortúzar, Villa del Parque | Anillo 3 — GBA Norte y Oeste: Olivos, La Lucila, Martínez, San Isidro, Ciudadela, Ramos Mejía, Haedo, Morón. Intereses: Alimentación saludable, Comida orgánica, Comida natural, Gastronomía china, Cocina asiática, Recetas de cocina, Vegetarianismo, Veganismo, Nutrición. Nota: Mismos tres anillos que el conjunto de recompra, con intereses deliberadamente más amplios — acá buscamos a quien todavía no incorporó el tofu, no a quien ya lo consume.",
          ads: [
            "Anuncio_Reel_ProbalosTodos_V1 | Video unboxing, no sabés cuál tofu comprar — Combo Degustación",
            "Anuncio_Carrusel_OnceTofus_V1 | Carrusel, los 11 productos y qué hacer con cada uno — Combo Degustación",
          ],
        },
      ],
      piezas: [
        // ═══ PRODUCTO A — COMBO TOFU DURO 800g RESTOCK x6 ═══════════
        // $48.600 (antes $54.000, 10% OFF). 4,8 kg. 23 unidades vendidas
        // en los últimos 30 días, 14,6% de la facturación del mes.

        // ─── PIEZA 1 — VIDEO: TE QUEDASTE SIN TOFU ───────────────────
        {
          formato: "Video Comercial Vertical (9:16)",
          dolor: "Compra el tofu de a uno, se le termina a los tres días y justo el día que lo iba a cocinar abre la heladera y no tiene. Termina resolviendo la cena con cualquier otra cosa.",
          solucion: "Combo Tofu Duro 800g Restock x6 a $48.600: seis paquetes al vacío, 4,8 kg de tofu duro artesanal. El mes resuelto en un solo pedido, sin volver a pedir.",
          comunicacion: "[0-3s] HOOK — Angel abre la heladera, plano desde adentro mirando hacia afuera, el estante casi vacío salvo por un paquete abierto a medio usar: 'Te pasó de ir a cocinar y no tener tofu.' [3-7s] BODY — Angel cierra la heladera y apoya el Combo Restock x6 sobre la mesada, los seis paquetes al vacío acomodados en fila: 'Este es el Combo Restock, seis paquetes de tofu duro al vacío de ochocientos gramos.' [7-12s] BODY — Close-up de los paquetes, la mano de Angel los va contando de a uno, inserto macro del sellado al vacío y de la etiqueta: 'Son casi cinco kilos. Tenés tofu para todo el mes sin volver a pedir.' [12-17s] BODY — Angel vuelve a abrir la heladera, ahora cargada con los seis paquetes ordenados en el estante, plano cerrado del estante lleno: 'Lo dejás en la heladera y agarrás uno cuando lo necesitás.' [17-22s] CTA — Angel a cámara con un paquete en la mano, gesto de invitación. Badge en edición, Envío en el día CABA: 'Pedí el Combo Restock x6 en defu.com.ar y te lo mandamos en el día.' [22-25s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
          hook: "Te pasó de ir a cocinar y no tener tofu.",
          body: "Este es el Combo Restock: seis paquetes de tofu duro al vacío de 800 gramos. Son casi 5 kilos, tenés tofu para todo el mes sin volver a pedir. Lo dejás en la heladera y agarrás uno cuando lo necesitás.",
          cta: "Pedí el Combo Restock x6 en defu.com.ar y te lo mandamos en el día.",
          copyAnuncio: "Te pasó de ir a cocinar y no tener tofu 🫠\n\n🫘 Combo Restock x6: seis paquetes de tofu duro al vacío de 800 g.\n💪 4,8 kg — tenés el mes resuelto sin volver a pedir.\n💰 $48.600 (antes $54.000, 10% OFF)\n\n📦 Envío en el día a CABA.\n\n👉 Pedilo en defu.com.ar",
          pilar: "Producto",
          tema: "Quedarse sin stock — el mes resuelto con el Combo x6",
          formatoNarrativo: "Direct to Camera — Talking Head",
          estructuraNarrativa: "Situación - Solución - Beneficio - Acción",
          tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
          duracion: "22-25s",
          enRevision: false,
          destinoUrls: [URL_X6],
        },

        // ─── PIEZA 2 — CARRUSEL: UN PEDIDO, TODO EL MES ──────────────
        {
          formato: "Carrusel (1080x1080)",
          dolor: "Pide tofu una vez por semana y paga envío cada vez. No dimensiona cuánto le rinde un combo ni cuánto se ahorra comprándolo junto.",
          solucion: "Combo Tofu Duro 800g Restock x6 a $48.600 (antes $54.000): 4,8 kg, unas 12 comidas y un solo envío para todo el mes.",
          comunicacion: "Carrusel x4 slides con los números como protagonista, fondo amarillo Defu en el slide de apertura y foto de producto sobre fondo claro en el resto. Composición limpia, tipografía grande. Adaptar a Story (1080x1920).",
          mensajes: [
            "Slide 1: Apertura — 'Un pedido. Todo el mes.' Fondo amarillo Defu, tipografía grande, foto cenital de los 6 paquetes al vacío acomodados en fila.",
            "Slide 2: Qué trae — '6 paquetes de 800 g = 4,8 kg de tofu duro artesanal.' Cenital del combo armado con la cuenta escrita en números grandes al costado.",
            "Slide 3: Qué rinde — 'Son unas 12 comidas. Y un solo envío en todo el mes.' Grilla de 4 platos hechos con tofu duro, a la plancha, salteado, en ensalada y marinado.",
            "Slide 4: Precio + CTA — '$48.600, antes $54.000. 10% OFF.' Badge, 'Envío en el día a CABA'. CTA, 'Pedilo en defu.com.ar'.",
          ],
          copyAnuncio: "Un pedido. Todo el mes 💪\n\n🫘 Combo Restock x6: 6 paquetes de 800 g = 4,8 kg de tofu duro artesanal.\n🍽️ Son unas 12 comidas y un solo envío en todo el mes.\n💰 $48.600 (antes $54.000, 10% OFF)\n\n📦 Envío en el día a CABA.\n\n👉 Pedilo en defu.com.ar",
          pilar: "Producto",
          tema: "Rendimiento y conveniencia del Combo x6",
          formatoNarrativo: "Producto — Showcase",
          estructuraNarrativa: "Afirmación - Evidencia - Precio - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          enRevision: false,
          destinoUrls: [URL_X6],
        },

        // ═══ PRODUCTO B — COMBO DEGUSTACIÓN DE TOFU COMPLETO ════════
        // $79.200 (antes $88.000, 10% OFF). 11 productos distintos.
        // 16 unidades vendidas en los últimos 30 días, 16,6% de la facturación.

        // ─── PIEZA 3 — VIDEO UNBOXING: PROBALOS TODOS ────────────────
        {
          formato: "Video Comercial Vertical (9:16)",
          dolor: "Quiere empezar a comer tofu pero no sabe cuál comprar. Entra a la tienda, ve un montón de productos distintos, le da miedo gastar en algo que capaz no le gusta, y cierra la pestaña sin comprar.",
          solucion: "Combo Degustación de Tofu Completo a $79.200: los 11 productos de Defu en un solo pedido. Prueba todo y después pide el que más le gustó.",
          comunicacion: "[0-3s] HOOK — Angel de pie frente a la mesada con la caja del Combo Degustación cerrada delante, plano medio, fondo limpio: 'No sabés cuál tofu comprar.' [3-6s] HOOK — Angel abre la caja y empieza a sacar productos, corte rápido mientras los va apoyando sobre la mesada: 'Probalos todos.' [6-14s] BODY — Montaje de unboxing, Angel apoya los once productos en fila mientras entran sobreimpresos los nombres de cada uno, medio segundo por producto: 'Tofu duro, común, especiado, aireado, en lámina, fiambre, nuggets y los tres saborizados. Once productos distintos.' [14-19s] BODY — Plano cenital de los once productos desplegados ocupando todo el cuadro, la cámara abre lentamente hasta mostrar la mesada completa: 'Es todo lo que hacemos, en un solo pedido. Probás cada uno y después pedís el que más te gustó.' [19-24s] CTA — Angel a cámara detrás de la mesada llena, gesto de invitación. Badge en edición, Envío en el día CABA: 'Pedí el Combo Degustación en defu.com.ar y te lo mandamos en el día.' [24-27s] CIERRE — Motion graphics sobre fondo amarillo. Logo Defu en color original + defu.com.ar.",
          hook: "No sabés cuál tofu comprar. Probalos todos.",
          body: "Tofu duro, común, especiado, aireado, en lámina, fiambre, nuggets y los tres saborizados: once productos distintos. Es todo lo que hacemos, en un solo pedido. Probás cada uno y después pedís el que más te gustó.",
          cta: "Pedí el Combo Degustación en defu.com.ar y te lo mandamos en el día.",
          copyAnuncio: "¿No sabés cuál tofu comprar? Probalos todos 🫘\n\n📦 Combo Degustación de Tofu Completo: los 11 productos de Defu en un solo pedido.\n✨ Duro, común, especiado, aireado, en lámina, fiambre, nuggets y los 3 saborizados.\n💰 $79.200 (antes $88.000, 10% OFF)\n\n🚚 Envío en el día a CABA.\n\n👉 Pedilo en defu.com.ar",
          pilar: "Producto",
          tema: "Primera compra sin riesgo — probar las 11 variedades",
          formatoNarrativo: "Unboxing — Producto a cámara",
          estructuraNarrativa: "Objeción - Resolución - Despliegue - Acción",
          tratamiento: { tipo: "Video", tono: "Cinematic", estilo: "Lifestyle" },
          duracion: "24-27s",
          enRevision: false,
          destinoUrls: [URL_DEGUSTACION],
        },

        // ─── PIEZA 4 — CARRUSEL: 11 TOFUS, UNO ES EL TUYO ────────────
        {
          formato: "Carrusel (1080x1080)",
          dolor: "No sabe qué es cada tofu ni para qué sirve. Sin saber qué cocinar con cada variedad, no se anima a la primera compra.",
          solucion: "Combo Degustación de Tofu Completo a $79.200 (antes $88.000): los 11 productos agrupados por uso, para saber qué hacer con cada uno desde el primer pedido.",
          comunicacion: "Carrusel x4 slides que funciona como mapa de producto. Slide de apertura sobre fondo amarillo Defu y los dos del medio con fotos grupales sobre fondo claro, cada producto con su uso al lado. Adaptar a Story (1080x1920).",
          mensajes: [
            "Slide 1: Apertura — '11 tofus. Uno es el tuyo.' Fondo amarillo Defu, tipografía grande, foto cenital del combo completo desplegado.",
            "Slide 2: Para cocinar — 'Tofu duro 800 g y 400 g, común 800 g, especiado 1 kg, aireado 1 kg.' Foto grupal de los cinco con una línea de uso al lado de cada uno, a la plancha, salteado, al wok.",
            "Slide 3: Para comer ya — 'Fiambre, lámina, nuggets sabor pollo y los 3 saborizados: provenzal, ají, espinaca y nuez.' Foto grupal, estos no necesitan cocción, van directo al plato o al sándwich.",
            "Slide 4: Precio + CTA — '$79.200, antes $88.000. 10% OFF.' Badge, 'Envío en el día a CABA'. CTA, 'Pedilo en defu.com.ar'.",
          ],
          copyAnuncio: "11 tofus. Uno es el tuyo 🫘\n\n🔥 Para cocinar: duro 800 g y 400 g, común 800 g, especiado 1 kg, aireado 1 kg.\n🥪 Para comer ya: fiambre, lámina, nuggets sabor pollo y los 3 saborizados.\n💰 Combo Degustación completo: $79.200 (antes $88.000, 10% OFF)\n\n📦 Envío en el día a CABA.\n\n👉 Pedilo en defu.com.ar",
          pilar: "Producto",
          tema: "Mapa de producto — qué es cada tofu y para qué sirve",
          formatoNarrativo: "Educativo — Guía Visual",
          estructuraNarrativa: "Apertura - Agrupación por uso - Precio - Acción",
          tratamiento: { tipo: "Carrusel", tono: "Mixed", estilo: "Lifestyle" },
          enRevision: false,
          destinoUrls: [URL_DEGUSTACION],
        },
      ],
    },
  ],

  capacidadAtencion: {
    quienAtiende: "Angel Huang (personalmente)",
    capacidadDiaria: "Limitada. Angel administra otros dos locales además de Defu.",
    tiempoRespuesta: "Variable. Depende de la carga operativa del día.",
    validado: false,
  },

  ofertas: null,
  cambiosEcommerce: null,
  competenciaAds: null,

  notas: "Foundation v2 de DEFU. Acotado a propósito: el documento muestra una sola sección, la Campaña de Conversión v2, y la única bajada nueva son los 4 guiones. El Foundation original (clients/defu) sigue siendo la fuente de verdad del onboarding, los ICPs B2C y la arquitectura de Awareness.\n\nContexto del ciclo: el ROAS cayó de por 9 a por 3 tres o cuatro días después de duplicar el presupuesto de la campaña de ventas (USD 300 a USD 600/mes). Se juntan dos causas, el salto de presupuesto reinició el aprendizaje y octubre/noviembre tiene el CPM inflado por la pelea de Cyber Monday. La corrección es repartir, no gastar más.\n\nProductos elegidos: los dos ganadores de los últimos 30 días. Combo Degustación de Tofu Completo (16 unidades, $1.267.200, 16,6%) y Combo Tofu Duro 800g Restock x6 (23 unidades, $1.117.800, 14,6%). Entre los dos se llevaron el 31% de la facturación del mes. Cada uno recibe 1 video + 1 carrusel y su propio conjunto de anuncios, porque le hablan a momentos distintos del cliente, descubrimiento contra recompra.\n\nPrecios y contenidos verificados en defu.com.ar al 27/10/2026. Combo Restock x6: $48.600, antes $54.000, 10% OFF, 6 paquetes de 800 g = 4,8 kg. Combo Degustación: $79.200, antes $88.000, 10% OFF, 11 productos distintos (duro 800 g, común 800 g, provenzal 250 g, ají 250 g, espinaca y nuez 250 g, duro 400 g, fiambre 300 g, lámina 300 g, aireado 1 kg, especiado 1 kg, nuggets sabor pollo 300 g). Los guiones dicen esos números en voz alta: si Angel cambia precios o composición antes del rodaje, hay que rehacerlos.\n\nALERTA DE STOCK: al 27/10 la ficha del Combo Restock x6 en Tienda Nube marca que queda la última unidad. No tiene sentido poner USD 150/mes a empujar un producto sin stock. Confirmar reposición con Angel antes de lanzar.\n\nA validar antes de publicar: el Carrusel 2 afirma que el Combo x6 rinde unas 12 comidas (2 por paquete de 800 g). Es una estimación razonable pero conviene que Angel la confirme.\n\nA confirmar con Angel antes de lanzar: el envío al Anillo 3. Toda la copy promete envío en el día a CABA, que es cierto, pero el Anillo 3 sale a GBA Norte y Oeste (San Isidro, Ramos Mejía, Haedo, Morón) y hay que saber el costo y el plazo real de entrega ahí. El oeste es el más lejano de la planta, así que es el candidato número uno a cortarse si el flete no cierra. Defu no tiene vehículo propio, depende de Uber y fletes, así que el margen por pedido cambia según la zona.\n\nHistorial de la bajada creativa. La primera versión organizaba las piezas por dolor (la cuenta del mes, el tofu aguado, el precio por unidad, la guía de elección) con el x6 como único héroe. Se reemplazó por una organización por producto: dos combos ganadores, 1 video + 1 carrusel cada uno, público renovado y más amplio. Las versiones anteriores quedan en los backups .bak del HTML y en el historial de git.\n\nLímite de gasto de la cuenta: está en USD 550/mes y el plan v2 gasta USD 750/mes. Hay que subirlo antes de lanzar o Meta corta las campañas a mitad de mes.",
  referenciasMoodboard: [
    { url: "https://www.instagram.com/p/DctbiHskj3y/", titulo: "Soyana — 1 pedido, toda la semana resuelta" },
    { url: "https://www.instagram.com/p/DZ8Xditydvw/", titulo: "Soyana — carrusel de combos armados" },
    { url: "https://www.instagram.com/p/DZV_Q7Jsdih/", titulo: "Soyana — combos y planificación semanal" },
    { url: "https://www.instagram.com/p/DZqJOY4w4ob/", titulo: "Soyana — variedad de saborizados" },
  ],

  entregaMaterial: {
    destino: "Google Drive",
    descripcion: "Las 4 piezas de Conversión v2 se entregan en una carpeta nueva del Drive compartido con Defu, agrupadas por producto y con el copy del anuncio en un .txt al lado de cada pieza.",
    arbol: [
      "Defu x REE Growth/",
      "└── Conversion v2/",
      "    ├── Combo Restock x6/",
      "    │   ├── 01_Video_SinTofu/",
      "    │   └── 02_Carrusel_UnPedidoTodoElMes/",
      "    └── Combo Degustacion/",
      "        ├── 03_Video_ProbalosTodos/",
      "        └── 04_Carrusel_OnceTofus/",
    ],
  },

  roadmap: [
    { nombre: "Conversión v2 (Combo x6)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 1 },
      { nombre: "Build", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Launch", semanaInicio: 2, semanaFin: 2 },
      { nombre: "Scale", semanaInicio: 3, semanaFin: 4 },
    ]},
    { nombre: "B2B (WhatsApp)", fases: [
      { nombre: "Foundation", semanaInicio: 1, semanaFin: 2 },
      { nombre: "Build", semanaInicio: 3, semanaFin: 3 },
      { nombre: "Launch", semanaInicio: 4, semanaFin: 4 },
    ]},
  ],

  seccionesBloqueadas: [],

  proximosPasos: [
    {
      titulo: "Lo que definimos en la call del 26/10",
      responsable: "Sergio + Jonas",
      tiempo: "Call 26/10",
      items: [
        "Diagnóstico: el ROAS cayó de por 9 a por 3 tres o cuatro días después de duplicar el presupuesto de DEFU_Ventas de USD 300 a USD 600/mes. El salto de presupuesto le reinició el aprendizaje a una campaña que venía rentable",
        "Factor externo que agrava: el CPM de Meta está inflado en octubre y noviembre por la pelea de Cyber Monday. Hay reportes de caída de conversiones y calidad de tráfico desde el 18/10, con los paneles de estado de Meta marcando normalidad",
        "Decisión: no se sube más presupuesto. DEFU_Ventas vuelve a USD 300/mes y no se le toca nada más, para que recupere el aprendizaje sin interferencia",
        "Decisión: los otros USD 300 arrancan una campaña nueva en lugar de engordar la existente. Creativo nuevo y geolocalización nueva, así el aprendizaje empieza limpio y no canibaliza lo que ya funciona",
        "DEFU_Awareness no se toca: sigue en USD 150/mes, viene traccionando y acompaña al orgánico (casi 15K seguidores en Instagram)",
        "Producto a empujar: Combo Tofu Duro 800g Restock x6, el combo de mayor rotación de los últimos 30 días con 23 unidades y $1.117.800 facturados",
        "El B2B queda en evaluación, no se lanza con esta tanda. Angel tiene ganas y el negocio existe, pero el B2B es un proceso comercial con seguimiento y negociación, no una compra de carrito. Primero hay que saber quién atiende esos mensajes",
        "Follow-up a Angel el miércoles 28/10 con los próximos pasos y el reparto de presupuesto. El rodaje de las piezas quedó para el viernes 30/10",
        "Idea abierta para más adelante: aprovechar la audiencia que construyó Awareness para un infoproducto de recetas con tofu",
      ],
    },
    {
      titulo: "La nueva bajada creativa",
      responsable: "REE Growth",
      tiempo: "Definido 27/10",
      items: [
        "Cambia el ángulo: la campaña original comunicaba calidad artesanal y producto fresco. Conversión v2 ataca el bolsillo y la cocina del día a día, que es donde está la decisión de compra recurrente",
        "Pieza 1, video talking head con Angel: la cuenta del mes. Comprar de a uno sale $54.000, el Combo x6 sale $48.600",
        "Pieza 2, video demo de cocina en cenital sin talking head: por qué tu tofu queda aguado y se desarma. Dolor puntual de cocina, común vs duro prensado",
        "Pieza 3, carrusel de precio por unidad: suelto $9.000, x6 $8.100, x9 $7.889",
        "Pieza 4, carrusel de guía de elección según cuántas veces por semana comés tofu",
        "Las 4 piezas corren iguales en los dos conjuntos: la variable que se testea es la geolocalización, no el mensaje",
        "Geos nuevas, sin superposición con DEFU_Ventas: CABA Centro-Oeste y CABA Centro-Este. La campaña original sigue en Belgrano, Corredor Norte y Zona Norte",
      ],
    },
    {
      titulo: "Pendientes de REE",
      responsable: "REE Growth",
      tiempo: "Esta semana",
      items: [
        "Bajar DEFU_Ventas de USD 600 a USD 300/mes y no tocarle nada más: es la campaña que viene rentable y cada cambio le reinicia el aprendizaje",
        "Mandarle el follow-up a Angel el miércoles 28/10 con los próximos pasos, el reparto de presupuesto y el push al Combo x6",
        "Subir el límite de gasto de la cuenta publicitaria de USD 550 a USD 800/mes antes de encender la campaña nueva",
        "Crear DEFU_Conversion_v2 con los dos conjuntos de geo nueva (Centro-Oeste y Centro-Este) y las 4 piezas por conjunto",
        "Preguntarle a Angel quién atiende los mensajes B2B y en cuánto tiempo. Si hoy no da abasto, proponerle un flujo de captación y calificación automática en WhatsApp antes de encender la pauta",
      ],
    },
    {
      titulo: "Pendientes de Producción",
      responsable: "Sergio + Flor",
      tiempo: "Rodaje viernes 30/10",
      items: [
        "Grabar la Pieza 1 con Angel a cámara sobre el timeline de este documento: 'La cuenta del mes'. Plano medio en la cocina, mesada despejada y el Combo x6 a mano para que entre a cuadro",
        "Grabar la Pieza 2 con rig cenital y sin cara: solo manos en cuadro, sartén caliente, tabla, cuchillo y adobo. Hacen falta las dos versiones del tofu para la pantalla partida, el común aguado deshaciéndose y el duro entero",
        "Para la pantalla partida de la Pieza 2 hay que cocinar mal a propósito un tofu común: es el plano que sostiene todo el video, no lo dejen para el final del rodaje",
        "Levantar en el mismo rodaje las fotos de producto del Combo x6 y del Combo x9 que necesitan los 2 carruseles (cenital del combo armado, paquetes sueltos separados, heladera cargada)",
        "Producir los 2 carruseles con números grandes y badge de ahorro. Entregar en 1080x1080 más la adaptación a Story 1080x1920",
      ],
    },
    {
      titulo: "Pendientes de Angel",
      responsable: "Angel",
      tiempo: "Antes del rodaje",
      items: [
        "Confirmar que los precios del Combo x6 ($48.600), x9 ($71.000) y Degustación ($79.200) se mantienen las próximas 4 semanas: los guiones dicen los números en voz alta",
        "Confirmar que el Tofu Duro al Vacío 800g va realmente de la bolsa a la sartén sin prensar ni escurrir: es la promesa central de la Pieza 2 y si no se sostiene, el video se cae",
        "Tener stock del Combo x6 para sostener el empuje de la campaña",
        "Responder si hoy tiene con quién atender leads B2B, o si prefiere que le armemos el flujo automático primero",
      ],
    },
  ],

  reviewMilestones: [
    { semana: 1, label: "Follow-up Angel", fecha: "28/10" },
    { semana: 1, label: "Rodaje", fecha: "30/10" },
    { semana: 2, label: "Launch Conv v2", fecha: "03/11" },
    { semana: 3, label: "Call ADS", fecha: "10/11" },
    { semana: 4, label: "Review v2", fecha: "17/11" },
  ],

  reviewMeetings: [
    { semana: "S1", nombre: "Catchup interno", fecha: "26/10", desc: "Catchup Sergio x Jonas. Diagnóstico de la caída del ROAS de por 9 a por 3 tras duplicar el presupuesto, agravada por el CPM inflado de Cyber Monday. Se decide repartir en lugar de subir: DEFU_Ventas vuelve a USD 300/mes y los otros USD 300 arrancan una campaña nueva con creativo y geo nuevos. Se define el push al Combo x6 y el B2B queda en evaluación hasta validar quién atiende los leads.", status: "done" },
    { semana: "S1", nombre: "Follow-up Angel", fecha: "28/10", desc: "Follow-up a Angel con los próximos pasos, el reparto de presupuesto y el push a los dos combos ganadores.", status: "current" },
    { semana: "S1", nombre: "Rodaje", fecha: "30/10", desc: "Rodaje de los 2 videos con Angel sobre los guiones de este documento, más las fotos de producto que necesitan los 2 carruseles.", status: "pending" },
    { semana: "S2", nombre: "Launch Conversión v2", fecha: "03/11", desc: "Activación de DEFU_Conversion_v2 con las 4 piezas en los dos conjuntos de geo nueva. DEFU_Ventas ya corriendo a USD 300/mes.", status: "pending" },
    { semana: "S3", nombre: "Call ADS", fecha: "10/11", desc: "Primera lectura de la campaña nueva: qué pieza traccionó, qué geo rindió mejor y cómo se recuperó el ROAS de la campaña original.", status: "pending" },
    { semana: "S4", nombre: "Review v2", fecha: "17/11", desc: "Revisión del ciclo: resultados vs KPIs, decisión sobre el B2B y plan para Black Friday.", status: "pending" },
  ],
};

// --- Generar solo el Foundation Review ---
// Este documento no regenera el onboarding ni el brief de creativos: el cliente
// ya está onboardeado y las cards de piezas viven en el propio Foundation Review.

// Este doc muestra UNA sola sección: la Campaña de Conversión v2. El Foundation
// Review de apertura, REE Metrics, el Roadmap y los Próximos Pasos se recortan
// del HTML ya renderizado en vez de tocar los renderers, que son compartidos con
// el resto de los clientes y tienen documentos ya entregados.

// Devuelve el índice donde termina el <details> que abre en `start`,
// contando apertura y cierre para no cortar en una subsección anidada.
function finDeDetails(html, start) {
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const abre = html.indexOf("<details", i);
    const cierra = html.indexOf("</details>", i);
    if (cierra === -1) return html.length;
    if (abre !== -1 && abre < cierra) {
      depth++;
      i = abre + "<details".length;
    } else {
      depth--;
      i = cierra + "</details>".length;
      if (depth === 0) return i;
    }
  }
  return html.length;
}

function soloSeccion(html, idConservar) {
  // 1. Quitar el índice: con una sola sección no tiene sentido.
  const toc = html.indexOf("counter-reset:toc");
  if (toc !== -1) {
    const ini = html.lastIndexOf('<div style="background:', toc);
    const finOl = html.indexOf("</ol>", toc);
    const finDiv = html.indexOf("</div>", finOl);
    if (ini !== -1 && finDiv !== -1) {
      html = html.slice(0, ini) + html.slice(finDiv + "</div>".length);
    }
  }

  // 2. Quitar toda sección de primer nivel que no sea la que se conserva.
  const marca = '<details class="fr-section" id="';
  const rangos = [];
  let i = html.indexOf(marca);
  while (i !== -1) {
    const idIni = i + marca.length;
    const id = html.slice(idIni, html.indexOf('"', idIni));
    const fin = finDeDetails(html, i);
    if (id !== idConservar) rangos.push([i, fin]);
    i = html.indexOf(marca, fin);
  }
  for (const [ini, fin] of rangos.reverse()) {
    html = html.slice(0, ini) + html.slice(fin);
  }

  // 3. El renderer arma la nomenclatura con el slug del archivo ("defu-v2"), pero
  //    en Meta la cuenta es la de Defu y la campaña se llama DEFU_Conversion_v2.
  html = html.replace(/DEFU-V2_/g, "DEFU_");

  // 4. Renumerar: la sección que queda pasa a ser la 01 y sus subsecciones 1.x.
  html = html.replace(/<span class="section-num">\d+<\/span>/g, '<span class="section-num">01</span>');
  html = html.replace(/<span class="subsection-num">\d+\.(\d+)<\/span>/g, '<span class="subsection-num">1.$1</span>');

  return html;
}

const strategy = soloSeccion(renderStrategyHtml(data), "defu-conversion-v2");

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

// Publish a ree-website con slug propio (defu-v2): no pisa defu.html
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
