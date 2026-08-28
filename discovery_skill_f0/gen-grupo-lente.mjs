import { renderDiscoveryHtml } from "./dist/lib/html-renderer.js";
import { tryComputeCpl } from "./dist/lib/formulas.js";
import { writeFileSync, mkdirSync } from "fs";

const data = {
  clientInfo: {
    nombreCliente: "Diego, Matias y Leandro",
    nombreEmpresa: "Grupo Lente (Star Deportes)",
    sitioWeb: "stardeportes.com",
    fechaLlamada: "2026-08-24",
    fathomUrl: "https://fathom.video/calls/796331302",
  },
  resumenEjecutivo:
    "Grupo Lente opera bajo la marca comercial **Star Deportes** (stardeportes.com, IG @stardeportes). Es una cadena de indumentaria deportiva con **13 años de trayectoria** en la provincia de Buenos Aires. Opera **13 sucursales fisicas** con una estrategia deliberada de evitar los cascos urbanos grandes (donde compiten cadenas como **Mateu Sports**, **Open Sports** y **Solo Deportes**) y dominar pueblos y ciudades perifericas de La Plata (Ensenada, Berisso, Lisandro Olmos, Los Hornos, Villa Elisa, San Vicente, Coronel Brandsen, Magdalena, Saladillo), donde tienen un **cuasi-monopolio** tras adquirir competidores locales.\n\nSe diferencian por calidad de atencion y servicio, y por ofrecer **credito personal interno** (cupos de **$450k-600k ARS**) con mora de un solo digito. En la llamada mencionaron que no venden Nike ni Adidas, aunque la web muestra **40+ marcas** como Puma, Fila, Converse, New Balance, Skechers, Crocs, Topper, Head, Reebok, entre otras. El ticket promedio se ubica entre **$70,000 y $100,000 ARS**. Ofrecen 2, 3 y 6 cuotas sin interes online y envio gratis a partir de $150,000 ARS.\n\nSu negocio fisico esta maduro y es rentable, con KPIs, tableros de control y 13 años de datos estacionales. Sin embargo, su canal digital esta sin desarrollar: el e-commerce en **Tienda Nube** tiene apenas un mes y representa el **0.01% de las ventas**. Tienen **GA4** y **GTM** instalados, pero **no tienen Meta Pixel ni eventos de conversion** configurados en Meta Ads, lo que hace imposible trackear ventas o hacer retargeting. Llevan años invirtiendo en Meta Ads pero exclusivamente para posicionamiento de marca, **sin campanas de conversion ni atribucion de ventas**. Su principal dolor es no poder medir el ROI de la inversion publicitaria ni saber cuanto impacta en ventas reales.",
  citasTextuales: [
    {
      texto: "Creo que llegamos a un techo sobre el cual no podemos seguir avanzando, principalmente por todo esto que vienen comentando, asociado a la informacion y como generar decisiones en base a la informacion.",
      contexto: "Diego explicando por que sienten que Instagram ya no les alcanza para crecer",
    },
    {
      texto: "No sabemos si eso se termina efectivamente convirtiendo en venta. Hasta hoy diria que es posicionamiento. No hemos hecho estrategia de venta, pura y exclusivamente de venta.",
      contexto: "Leandro reconociendo que nunca hicieron campanas orientadas a conversion",
    },
    {
      texto: "La parte donde se nos hace el cuello de botella ya es empezar a generar visibilidad en la pauta.",
      contexto: "Diego sobre donde se traba su operacion de marketing",
    },
    {
      texto: "Si nosotros cortamos ese presupuesto al dia de hoy, yo no puedo decir en cuanto porcentaje se caerian en las ventas. Se caerian? Si, creo que si. Ahora, hay un porcentaje en el que no lo sabemos.",
      contexto: "Diego y Matias admitiendo que no tienen forma de medir el impacto de la pauta en ventas",
    },
    {
      texto: "Nuestra financiera creo que tiene un mejor performance que nuestra casa de deporte, de alguna manera.",
      contexto: "Diego revelando que el negocio de creditos personales rinde mas que el retail",
    },
    {
      texto: "Tomamos la decision de irnos a distintos pueblos, a distintas ciudades, alejadas de todas estas cadenas.",
      contexto: "Estrategia fundacional: evitar centros urbanos donde las cadenas grandes dominan. En digital se replica: apuntar con Meta Ads a zonas perifericas y pueblos donde la competencia no pauta, ganando por oferta accesible, credito personal y envio a domicilio.",
    },
    {
      texto: "Nuestro metodo para el directo, si pudieramos elegir uno, seria el credito personal.",
      contexto: "Matias sobre cual es la palanca comercial que mas les gustaria explotar",
    },
  ],
  variables: {
    icp: {
      valor: "**B2C, retail fisico.** Cliente de **pueblos y ciudades perifericas** de La Plata y provincia de Buenos Aires (Coronel Brandsen, Magdalena, San Vicente, Saladillo, Zona Oeste). Busca indumentaria deportiva con buena atencion y **financiacion accesible**. No prioriza grandes marcas (Nike, Adidas, Puma). Valora el **credito personal** como metodo de pago principal. Segmento que no es atendido por las grandes cadenas que se concentran en centros urbanos.",
      notas: "No se detallo un perfil demografico especifico (edad, genero). La expansion fisica apunta a **Zona Oeste**; la expansion online abarca toda la **provincia de Buenos Aires**. Explicitamente descartaron entrar a CABA.",
    },
    producto: {
      valor: "**Indumentaria deportiva**: calzado (zapatillas, botines, botas, ojotas), ropa (remeras, buzos, camperas, pantalones, calzas, shorts) y accesorios (pelotas, bolsos, mochilas, gorras, fitness, natacion). **40+ marcas**: Puma, Fila, Converse, New Balance, Skechers, Crocs, Salomon, Topper, Head, Reebok, Umbro, Everlast, Diadora, 47 Street, Addnice, entre otras. En la llamada mencionaron **no vender Nike ni Adidas**. 13 años de experiencia con conocimiento profundo de **estacionalidad** (ej: inicio de clases = calzado nino). Categorias: **hombre, mujer, nino**. Equipo de branding de **5 personas** con **2 disenadores** internos.",
      notas: "En la llamada Diego dijo que no venden Nike, Adidas ni Puma, pero la web (stardeportes.com) **si lista Puma, Reebok y Converse**. Rango de precios visible en web: **$89,899 - $129,899 ARS**.",
    },
    precio: {
      valor: "Precios similares a la competencia. Ticket promedio entre **$70,000 y $100,000 ARS**. Online ofrecen **2, 3 y 6 cuotas sin interes**. Envio gratis a partir de **$150,000 ARS**. Diferenciacion por **servicio y calidad de atencion**, no por precio. **Credito personal interno** como metodo de pago distintivo en sucursales: cupos de **$450,000, $500,000 y $600,000 ARS** con escala progresiva segun historial. **Mora de un solo digito**. El negocio financiero (creditos) tiene **mejor performance que el retail** en si.",
      notas: "No se obtuvieron **margenes por producto**. Relevamiento de precios de la web (36 productos muestreados): promedio hombre **$111k**, mujer **$85k**, nino **$54k**. Promedio general por item: **~$83k ARS**. Rango: $3,499 (medias) a $229,899 (Salomon). Calzado domina entre $75k-$130k. El **credito personal es exclusivamente presencial** (no funciona online por riesgo de mora). Online solo ofrecen cuotas sin interes via tarjeta.",
    },
    plaza: {
      valor: "**13 sucursales fisicas** en la provincia de Buenos Aires: La Plata I (Calle 51 N625), La Plata II (Calle 12 N1341), Ensenada (La Merced N138), Berisso (Montevideo N1201), Lisandro Olmos (Calle 44 N5091), Los Hornos I (Calle 137 N1453), Los Hornos II (Calle 137 N1566), Villa Elisa (Arana N499), San Vicente (Av. 25 de Mayo N43), Coronel Brandsen (Mitre N149), Magdalena (Miguens N1031), Saladillo I (Av. Rivadavia N2764), Saladillo II (Ruta 205 Km 182). Horarios: L-S 9-20hs (Gran La Plata) o 9-13/16-20:30hs (interior). Estrategia fundacional: **evitar centros urbanos** donde operan cadenas grandes e ir a pueblos donde lograron **cuasi-monopolio** comprando competidores locales. En La Plata ciudad son **~#4** (detras de Mateu Sports, Open Sports, Solo Deportes). E-commerce en **Tienda Nube** (stardeportes.com), iniciado hace ~1 mes, **0.01% de las ventas**. **DragonFish** integrado con Tienda Nube. Retiro en cualquier sucursal + delivery (envio gratis desde $150k). Expansion prevista: **Zona Oeste** (fisico), provincia de Buenos Aires (online).",
      notas: "**8 sucursales** en el Gran La Plata (La Plata, Ensenada, Berisso, Lisandro Olmos, Los Hornos, Villa Elisa) y **5 en interior** (San Vicente, Coronel Brandsen, Magdalena, 2 en Saladillo). Hicieron una venta online en **Neuquen**, lo que sugiere demanda fuera de su zona. No tienen interes en entrar a CABA. NOTA: en el transcript Fathom transcribio 'Branson' pero la sucursal real es **Coronel Brandsen**.",
    },
    promocion: {
      valor: "**Instagram** con **189k seguidores** (canal digital principal). **Meta Ads** activos hace años, exclusivamente para **posicionamiento de marca** y trafico a tiendas fisicas. Campanas locales con radio de ~30km alrededor de cada sucursal + campanas de crecimiento de seguidores. CRM **Callbell** centraliza WhatsApp, Instagram, TikTok y Facebook en una unica plataforma, con agentes humanos respondiendo consultas. Equipo de branding de **5 personas** + **2 disenadores**. Planificacion mensual de contenido. Trabajo de branding recurrente en redes: suben historias y contenido de forma diaria, pero las piezas **no tienen un angulo apuntado a un ICP definido** en muchos casos y **no estan enfocadas a conversion**. Presupuesto de ads definido pero no compartido. **No producen contenido UGC** orientado a ofertas por categoria. Herramientas de analitica instaladas (**GA4**, **GTM**) pero **sin Meta Pixel ni eventos de conversion** configurados.",
      notas: "Problema de segmentacion: campanas de posicionamiento se mezclaron con campanas locales, generando consultas de zonas lejanas (ej: La Rioja) que no pueden acceder al credito personal. La consulta de stock via CRM es **100% manual** (agente abre **DragonFish** en otra pantalla). **No hay automatizacion** entre Callbell y DragonFish.",
    },
  },
  auditoria: {
    presenciaDigital: "**GA4** instalado (G-EPK43L7K2K). **GTM** instalado (GTM-5M8VNBMR). **Meta Pixel: NO instalado** (critico: llevan años invirtiendo en Meta Ads sin pixel). **CAPI: no configurado**. Sin eventos de conversion definidos en el sitio. Tienen el contenedor GTM pero **no estan trackeando nada relevante para Meta Ads**. reCAPTCHA v2/v3 activo. Datos estructurados de empresa y productos configurados en el sitio (mejora SEO, no impacta en Ads).",
    canalesActivos: [
      "Instagram @stardeportes (189k seguidores, canal digital principal)",
      "Facebook /stardeportes (Meta Ads, solo posicionamiento)",
      "TikTok @star.deportes",
      "E-commerce stardeportes.com (Tienda Nube, Store ID 7238827, reciente)",
      "Callbell (CRM centralizando WhatsApp, Instagram, TikTok y Facebook)",
      "13 sucursales fisicas (canal principal de ventas, 95%+ de la facturacion)",
    ],
    contenidoActual: "Equipo interno de branding de **5 personas** con **2 disenadores**. Produccion mensual de piezas audiovisuales, flyers y contenido para redes. Campanas estacionales (Dia del Nino, inicio de clases). **No producen contenido UGC** orientado a ofertas por categoria (ropa deportiva masculina, ninos, calzado, accesorios). **No hay variaciones de creativos por audiencia/producto**. Oportunidad de producir UGC por categoria y marca para testing en Ads.",
    pautaActual: "**Meta Ads** activos hace varios años. Presupuesto creciente pero **monto no compartido**. Campanas de **posicionamiento + locales** (radio 30km por sucursal). Crecimiento de seguidores (**189k**). **Sin campanas de conversion** ni venta directa al e-commerce. La competencia opera con **masividad de testeo (217 anuncios activos combinados)** mientras Grupo Lente **no tiene ninguna campana de conversion**.",
    ecommerce: "**Tienda Nube** (stardeportes.com) lanzado hace ~1 mes. Representa **0.01% de las ventas**. **40+ marcas** en catalogo: Puma, Fila, Converse, New Balance, Skechers, Crocs, Salomon, Topper, Head, Reebok, Umbro, Montagne, Addnice, Everlast y mas. Categorias: **calzado** (zapatillas, botines), **indumentaria** (remeras, pantalones, camperas), **accesorios** (medias, mochilas). **2, 3 y 6 cuotas sin interes**. Envio gratis desde **$150k ARS**. Integrado con **DragonFish** (stock, pedidos, devoluciones). Retiro en 13 sucursales o delivery via Correo Argentino. **Sin Meta Pixel, sin CAPI, sin eventos de conversion.**",
    problemasPrincipales: [
      "Cero atribucion de ventas: no pueden medir el ROI de la inversion en Meta Ads",
      "Sin campanas de conversion: toda la pauta es posicionamiento, nunca hicieron venta directa",
      "Segmentacion deficiente: campanas de branding se mezclan con locales, generando consultas de zonas fuera de cobertura (ej: La Rioja preguntando por credito personal)",
      "E-commerce sin desarrollar: 0.01% de las ventas, sin trafico pagado ni optimizacion",
      "Meta Pixel NO instalado: llevan años invirtiendo en Meta Ads sin pixel, imposible hacer retargeting o medir conversiones del sitio",
      "Consulta de stock manual: agentes del CRM Callbell consultan DragonFish en otra pantalla, sin integracion automatizada",
      "Credito personal no digitalizable: el metodo de pago mas potente solo funciona presencialmente, necesita chatbot para derivar a sucursal",
      "Sin contenido UGC por categoria: no producen creativos diferenciados para ropa masculina, ninos, calzado, accesorios",
    ],
  },
  research: {
    tamanoMercado: "Mercado de indumentaria deportiva en Argentina. **Nike, Adidas y Puma concentran ~60%** del mercado. Grupo Lente compite en el segmento de **marcas alternativas**, dominando la **periferia de La Plata** y pueblos de la provincia de Buenos Aires. La competencia opera con **masividad de pauta digital: 217 anuncios activos** combinados entre Mateu, Open Sports y Solo Deportes.",
    tendencia: "El **e-commerce de indumentaria deportiva sigue creciendo** en Argentina. Grupo Lente reconoce que el canal online **complementa el fisico** (la web funciona como catalogo que genera visitas a sucursales). Inflacion en el rubro hace 2 años, pero **siguen vendiendo mas**. Los competidores ya tienen **e-commerce consolidados** con cuotas sin interes y envio gratis.",
    demandaNicho: "**Estacionalidad bien conocida** por Grupo Lente (**13 años de datos**). Picos en **inicio de clases** (calzado nino), **Dia del Nino**, cambios de temporada. Preparan compras con anticipacion segun patrones historicos. Oportunidad de **campanas estacionales** con formatos variados.",
    competidores: [
      {
        nombre: "Mateu Sports",
        cuotaMercado: "45 anuncios activos en Meta | mateusports.com.ar",
        fortalezas: [
          "Lider absoluto en La Plata ciudad (duplica facturacion de Grupo Lente en esa zona)",
          "120 años de marca y reconocimiento local",
          "Presencia en periferia: sucursales en City Bell, Los Hornos, Ensenada, Berisso, San Carlos y Gonnet",
          "E-commerce maduro con catalogo completo y marca ON (premium running)",
          "45 anuncios activos en Meta: testeo variado de formatos y creativos",
        ],
        debilidades: [
          "No ofrece credito personal directo al consumidor (solo cuotas via tarjetas y MercadoPago)",
          "Sin presencia en pueblos del interior de la provincia (San Vicente, Brandsen, Magdalena, Saladillo) donde Grupo Lente opera sin competencia",
        ],
        pautaActiva: "45 anuncios activos en Meta. Cadena centenaria fundada en 1905, referente historico en La Plata con 13 sucursales + 4 tiendas Aurelius (linea premium de moda deportiva). 5 generaciones de trayectoria. Portafolio de 30+ marcas incluyendo Nike, Adidas, Puma, Asics, Saucony, New Balance, Under Armour, Converse, Salomon y marca propia. E-commerce con filtros por precio, disciplina y genero. Precios de $4,800 a $155,000 ARS. Promocion recurrente de 50% OFF en segunda unidad.",
      },
      {
        nombre: "Open Sports",
        cuotaMercado: "99 anuncios activos en Meta | opensports.com.ar",
        fortalezas: [
          "Mayor volumen de pauta del segmento: 99 anuncios activos en Meta",
          "80 sucursales en 34 ciudades de 5 provincias, incluyendo pueblos del interior de BA (Azul, Bolivar, Chascomus, Dolores, Mercedes, 9 de Julio)",
          "Marcas propias + franquicias internacionales (Crocs, Adidas, Lacoste)",
          "Tres formatos de tienda (Premium/Line/Outlet) para distintos segmentos",
          "Expansion activa y agresiva (Patagonia, nuevas provincias)",
        ],
        debilidades: [
          "No ofrece credito personal directo al consumidor (solo cuotas via tarjetas y promos bancarias)",
          "Presencia periferica en La Plata limitada a 1 local en Gonnet, sin Ensenada, Berisso ni Los Hornos",
          "Modelo mixto de locales propios y franquicias, lo cual puede generar variaciones en la experiencia segun la sucursal",
        ],
        pautaActiva: "99 anuncios activos en Meta. Cadena con 64+ años de historia, originaria de Mar del Plata. Opera 80 sucursales en 34 ciudades de 5 provincias (Buenos Aires, La Pampa, Rio Negro, Neuquen, Santa Fe) y 3 canales de e-commerce. Portfolio de marcas propias (Open Sports, Trip Store, Run&Bike, Florida Premium Outlet, Rossi Rossi) + franquicias de Crocs, Adidas y Lacoste. Tres formatos de tienda: Premium, Line y Outlet. Expansion reciente a Patagonia con 2 nuevas sucursales. Lleva el mayor volumen de pauta digital del segmento.",
      },
      {
        nombre: "Solo Deportes",
        cuotaMercado: "73 anuncios activos en Meta | solodeportes.com.ar",
        fortalezas: [
          "Domina Zona Oeste de Buenos Aires (zona de expansion objetivo de Grupo Lente)",
          "73 anuncios activos en Meta: alto volumen de testeo nichado",
          "Logistica propia (2 depositos, envios a todo el pais)",
          "E-commerce consolidado con cuotas sin interes y envio gratis",
          "560+ empleados, operacion profesionalizada",
        ],
        debilidades: [
          "No ofrece credito personal al consumidor (solo cuotas via tarjetas, Ahora 12 y MercadoPago)",
          "Solo 1 sucursal en La Plata (Calle 8), sin presencia en periferia ni pueblos del interior",
          "Concentrado en CABA y Zona Oeste/Sur del GBA, sin cobertura en provincia de Buenos Aires interior",
        ],
        pautaActiva: "73 anuncios activos en Meta. Cadena con 40+ años de trayectoria, fuerte presencia en Zona Oeste y Sur de Buenos Aires. Opera 26-30 sucursales, 560+ empleados, 1 centro logistico con 2 depositos propios. Portfolio de 60+ marcas incluyendo Nike, Adidas, Puma, Reebok, Converse, Under Armour. E-commerce con envio gratis desde $149,999 ARS, cuotas sin interes. Sucursales clave en Moron, Castelar, Ituzaingo, Merlo, San Justo, Avellaneda (zonas de expansion objetivo de Grupo Lente). Tiene 1 sucursal en La Plata.",
      },
    ],
    estacionalidad: "Bien documentada con 13 años de datos. Picos: inicio de clases (calzado nino/escolar), Dia del Nino. Compras anticipadas segun patrones historicos. No se detallaron meses especificos de baja.",
    notasResearch: "Los tres competidores principales mantienen una **masividad de testeo en Meta Ads** (45 + 99 + 73 = **217 anuncios activos combinados**), posicionando gran cantidad de anuncios nichados por ICP, formato y angulo. **Open Sports lidera con 99 anuncios**, seguido por **Solo Deportes (73)** y **Mateu (45)**. Grupo Lente **no tiene ninguna campana de conversion activa**, solo posicionamiento. La oportunidad es clara: replicar la masividad de testeo pero con el diferencial unico del **credito personal** (ningun competidor ofrece financiacion directa) y un **chatbot omnicanal** que ninguno de los tres tiene. Mateu compite en la periferia de La Plata pero **no llega a los pueblos del interior**. Open Sports si tiene presencia en pueblos del interior de BA, pero **no ofrece credito personal** ni atencion personalizada como Grupo Lente. Solo Deportes esta concentrado en **CABA/GBA Oeste** y no tiene cobertura ni en periferia ni en interior. Expansion a **Zona Sur y Zona Oeste** de Buenos Aires. Solo Deportes ya domina Zona Oeste (Moron, Castelar, Ituzaingo, Merlo, San Justo). La estrategia de Ads debe **validar audiencias en estas zonas antes de expandir presencia fisica**. Campanas digitales como testeo de mercado.",
  },
  icp: [
    {
      titulo: "B2C - Cliente de Sucursal Fisica (core)",
      descripcion: "**Cliente actual de las 13 sucursales.** Persona de pueblos y ciudades perifericas de La Plata y provincia de Buenos Aires, con **perfiles variados de edad y genero** (hombres, mujeres, padres comprando para hijos). Busca indumentaria deportiva con buena atencion, variedad de marcas alternativas (no Nike/Adidas/Puma) y financiacion accesible via credito personal. Es la base de clientes ya validada sobre la que se construyen los subtipos de ICP diferenciados por genero.",
      ejemplo: "**Laura, 38 años, Coronel Brandsen.** Madre de dos hijos (8 y 12 años). Trabaja como administrativa en una empresa local. **Conoce Star Deportes** porque es la unica tienda deportiva de la ciudad y ya compro ahi varias veces. Tiene **credito personal activo** con cupo de $500k. Cada inicio de clases va con los dos chicos a renovar zapatillas y ropa deportiva para el colegio, y aprovecha para llevarse algo propio (calzas, zapatillas de gym). **Compra todo en una sola visita** y financia el total en cuotas. No compara precios online porque valora ver el producto, probarse talles y la atencion personalizada de la sucursal. No sigue a la marca en redes; la conoce por proximidad fisica y boca a boca.",
      dolores: [
        "No tiene acceso a cadenas grandes en su localidad (solo estan en centros urbanos)",
        "Necesita financiacion para compras de calzado/indumentaria (tickets altos)",
        "Las cadenas grandes no ofrecen atencion personalizada ni credito directo",
        "Opciones limitadas de marcas deportivas en pueblos chicos",
      ],
      deseos: [
        "Comprar indumentaria deportiva de calidad cerca de su casa",
        "Acceder a credito personal sin requisitos bancarios complejos",
        "Recibir atencion personalizada y buen servicio postventa",
        "Encontrar variedad de productos deportivos para toda la familia",
      ],
      objeciones: [
        "No conozco la marca (fuera de la zona de cobertura actual)",
        "Prefiero comprar en cadenas que vendan Nike/Adidas",
        "No se si hacen envios a mi zona (para e-commerce)",
        "Los precios son similares a la competencia, no hay ventaja en precio",
      ],
    },
    {
      titulo: "B2C - Cliente E-commerce (en desarrollo)",
      descripcion: "**Mismo perfil base que el cliente de sucursal** (variedad de edades y genero), pero descubre Grupo Lente por redes sociales o pauta digital en lugar de por cercania fisica. Persona en provincia de Buenos Aires (y potencialmente otras provincias) que busca indumentaria deportiva online. No tiene acceso al credito personal (exclusivamente presencial), compra con **medios de pago digitales** (cuotas sin interes via tarjeta). Canal en desarrollo: representa el 0.01% de las ventas actuales.",
      ejemplo: "**Facundo, 31 años, Merlo (Zona Oeste).** Trabaja en una oficina en CABA y entrena running 3 veces por semana. Busca zapatillas Fila o Skechers para correr, pero en su zona la opcion mas cercana es Solo Deportes (precios altos). **No conoce Star Deportes**; lo descubre por un anuncio en Instagram con un carrusel de zapatillas de running con 6 cuotas sin interes. Entra al e-commerce, compara precios, ve envio gratis y compra online con tarjeta. **No tiene acceso al credito personal** porque no hay sucursal en su zona, pero le interesan las cuotas sin interes porque en 3 pagos se le hace mas facil.",
      dolores: [
        "No encuentra el producto que busca en tiendas locales de su zona",
        "No tiene acceso a la variedad de marcas alternativas que ofrece Grupo Lente",
        "No conoce la marca porque no hay presencia fisica en su zona",
      ],
      deseos: [
        "Comprar online con delivery o retiro en sucursal",
        "Descubrir marcas deportivas alternativas a las grandes (Nike, Adidas, Puma)",
        "Acceder a la misma variedad y servicio que en la tienda fisica pero desde su casa",
      ],
      objeciones: [
        "No conozco la marca, no se si es confiable",
        "No puedo acceder al credito personal desde el e-commerce",
        "Prefiero comprar en marketplaces donde ya tengo cuenta (MercadoLibre)",
        "El costo de envio puede ser alto para mi zona",
      ],
    },
  ],
  propuestaDeValor: {
    diferencial: "Star Deportes es **la cadena deportiva de Zona Sur**. Mientras Mateu Sports, Open Sports y Solo Deportes pelean por los centros urbanos, Star Deportes domina las localidades perifericas de la provincia de Buenos Aires donde las grandes cadenas no llegan. 13 años de presencia local, **cuasi-monopolio en varias localidades**, y un sistema de **credito personal directo** (sin tarjeta, sin banco) que ningun competidor ofrece. El posicionamiento se construye sobre tres pilares: **cercania** (la tienda deportiva de tu zona), **financiacion accesible** (credito personal con cupos de hasta $600k) y **variedad de marcas** (40+ marcas alternativas a Nike/Adidas que las cadenas grandes no priorizan).",
    notaExpansion: "La expansion digital sigue una logica de **caracol**: primero se potencia donde ya hay fuerza local (sucursales existentes), luego se testean ciudades cercanas a esa presencia, y gradualmente se exploran zonas mas alejadas e incluso otras provincias. Siempre escalonado, **validando con data antes de avanzar al siguiente anillo**. Primer anillo de expansion: **Guernica, Glew, Alejandro Korn, Burzaco, Malvinas Argentinas**, subiendo ciudad por ciudad desde las zonas mas cercanas a la presencia actual. Si las campanas geolocalizadas en una zona sin presencia fisica generan consultas y ventas online consistentes, es senal de demanda real para evaluar apertura de local.",
    angulos: [
      {
        nombre: "La tienda deportiva de tu ciudad",
        audiencia: "B2C",
        dolorQueResuelve: "No tiene acceso a tiendas deportivas con variedad de marcas y talles en su ciudad. Para comprar tiene que viajar a La Plata centro o comprar online sin poder probarse.",
        mensaje: "Star Deportes esta en tu ciudad. 40+ marcas deportivas, todos los talles, y la atencion de siempre. No necesitas viajar a La Plata para equiparte.",
        solucion: "Star Deportes tiene **13 sucursales** distribuidas en ciudades perifericas donde las cadenas grandes no estan. Comunica cercania nombrando la ciudad y la direccion exacta de la sucursal en cada pieza. El consumidor reconoce su barrio, su esquina, y siente que la marca es local.",
        ejemplo: "**Instagram Stories** con foto de la sucursal de Coronel Brandsen. Copy: 'En Brandsen ya tenes tu tienda deportiva. 40 marcas, todos los talles. Star Deportes, Mitre 149.' La persona reconoce la esquina, siente que es para ella.",
      },
      {
        nombre: "Credito personal: compra hoy, paga comodo",
        audiencia: "B2C",
        dolorQueResuelve: "El ticket de calzado e indumentaria deportiva es alto ($70k-$130k por item). No siempre tiene tarjeta de credito o el limite necesario. Posterga compras que necesita porque no puede pagar de contado.",
        mensaje: "Compras lo que necesitas y lo pagas en cuotas con credito personal. Sin tarjeta, sin banco, directo en el local. Cupos de hasta $600.000.",
        solucion: "Star Deportes ofrece **credito personal directo** en sucursal, algo que ningun competidor tiene (ni Mateu, ni Open Sports, ni Solo Deportes). El consumidor accede a financiacion sin intermediarios bancarios. Para comunicarlo se usan hooks diferenciados: la madre que equipa a los hijos para el cole, el hombre que viene postergando botines, los padres que necesitan renovar de una vez.",
        ejemplo: "**Reels** mostrando a una clienta en Los Hornos eligiendo zapatillas con sus hijos. Voz en off: 'Se llevo todo y lo paga en cuotas con credito personal. Sin tarjeta, sin banco. Solo en Star Deportes.' Cierra con direccion y CTA a WhatsApp.",
      },
      {
        nombre: "Variedad de marcas que no encontras en cualquier lado",
        audiencia: "B2C",
        dolorQueResuelve: "Las cadenas grandes priorizan Nike, Adidas y Puma. Quien busca marcas alternativas (Fila, New Balance, Skechers, Crocs, Salomon, Topper) no las encuentra facilmente fuera de los centros urbanos.",
        mensaje: "Fila, New Balance, Skechers, Crocs, Salomon y 40 marcas mas. Todo en un solo lugar, con todos los talles.",
        solucion: "Star Deportes tiene un catalogo de **40+ marcas** que las cadenas grandes no priorizan. Comunica profundidad de surtido mostrando productos concretos con precios, organizados por categoria y marca. El consumidor ve que no necesita ir a otro lado.",
        ejemplo: "**Carrusel** con 5 slides: Fila running ($89k), botines Topper ($75k), Skechers casual ($95k), Crocs ($45k), New Balance 574 ($110k). Cada slide con precio y boton de compra. Ultimo slide: 'Y 40 marcas mas en stardeportes.com'.",
      },
      {
        nombre: "Tu tienda deportiva, ahora tambien online",
        audiencia: "B2C",
        dolorQueResuelve: "Quiere ver catalogo y precios antes de ir al local, o comprar desde su casa si no tiene sucursal cerca. No sabe que Star Deportes tiene e-commerce.",
        mensaje: "Toda la variedad de Star Deportes en tu celular. Envio a toda la provincia o retira en la sucursal mas cercana. 2, 3 y 6 cuotas sin interes.",
        solucion: "Star Deportes tiene **e-commerce** (stardeportes.com) con el mismo catalogo y precios que las sucursales, envio gratis desde $150k y retiro en 13 sucursales. Donde hay local, el online complementa lo presencial. Donde no hay local, es el primer contacto con la marca y funciona como sensor de demanda para la expansion en caracol.",
        ejemplo: "**Anuncio de conversion** en Berisso/Ensenada (zona con sucursal). Imagen de zapatillas Skechers con precio y '3 cuotas sin interes. Retira en Star Deportes Ensenada o te lo enviamos.' El que ya conoce el local ve el online como complemento.",
      },
      {
        nombre: "Star Deportes llega a tu zona",
        audiencia: "B2C",
        dolorQueResuelve: "Vive en zonas con caracteristicas similares a donde Star Deportes ya opera (Guernica, Glew, Alejandro Korn, Burzaco, Malvinas Argentinas, Zona Oeste) donde hay ICPs con perfil parecido al cliente actual. No tiene una tienda deportiva de confianza con variedad y buen precio. Las cadenas grandes no le ofrecen atencion personalizada ni financiacion accesible.",
        mensaje: "Star Deportes ahora tambien te llega. 40+ marcas deportivas con envio a tu puerta o retiro en la sucursal mas cercana. Cuotas sin interes. stardeportes.com",
        solucion: "Star Deportes extiende su alcance digital hacia ciudades cercanas a su presencia fisica, **subiendo ciudad por ciudad**. El consumidor de Guernica o Glew recibe un anuncio que le muestra variedad, precios y envio gratis, conectandolo con una marca que opera a pocos kilometros de su casa. Es el **primer anillo de expansion**: zonas aledañas donde la marca aun no tiene local pero puede atender con e-commerce y delivery. Desde ahi se sube gradualmente: Burzaco, Malvinas Argentinas, y asi sucesivamente.",
        ejemplo: "**Carrusel por zona** con 4-5 slides de productos (zapatillas, botines, ropa) con precio visible y tag '6 cuotas sin interes'. Ultimo slide: 'Envio gratis a [ciudad]. stardeportes.com'. Se lanza el mismo carrusel en Guernica, Glew, Alejandro Korn, Burzaco y Zona Oeste en paralelo. Se comparan resultados por zona: donde se generaron mas ventas y mejor CPA es donde hay demanda real.",
      },
    ],
  },
  calculoCpl: {
    ticket: null,
    margen: null,
    porcentajeMargenParaAds: null,
    tasaDeCierre: null,
    cpaMaximo: null,
    cplObjetivo: null,
    cplMercado: null,
    escenario: null,
  },
  propuestaEstrategica: {
    objetivoGeneral: "Estrategia de expansion via **Meta Ads + Tienda Nube**. Lanzamiento integral de 10/12 semanas para obtener la mejor data posible y optimizar segun resultados. **5 campanas, ~52 anuncios activos** en el pico:\n\n- **Campana 1: B2C Hombre (Venta)** — Objetivo de conversion al e-commerce. Conjuntos por categoria (calzado, indumentaria, accesorios) y por zona. 8-16 anuncios variando formato y angulo. Conversion: **visitas a la pagina / ventas**. ~12 anuncios.\n- **Campana 2: B2C Mujer (Venta)** — Misma estructura. Conjuntos por categoria y zona. Hooks en compra personal + compra para hijos. Conversion: **visitas a la pagina / ventas**. ~12 anuncios.\n- **Campana 3: B2C Kids (Venta)** — Misma estructura. Conjuntos por categoria (calzado escolar, botines, ropa deportiva) y zona. Hooks estacionales. Conversion: **visitas a la pagina / ventas**. ~12 anuncios.\n- **Campana 4: Awareness (Interaccion)** — Frecuencia para que el consumidor nos conozca, confie y opte por Star Deportes. Conjuntos por zona (sucursales y expansion). Contenido de marca. Conversion: **visitas al perfil de IG + seguidores nuevos**. ~8 anuncios.\n- **Campana 5: Credito Personal (Interaccion)** — Derivar consultas a sucursal. Conjuntos por ciudad/sucursal. Hooks geolocalizados por genero. Conversion: **consultas por canal** (WhatsApp, Instagram, Messenger). ~8 anuncios.\n\n**Total: ~52 anuncios** (36 de venta + 16 de interaccion). Infraestructura: Meta Pixel + CAPI + REE Metrics + Shopping (catalogo Tienda Nube). La data de las 10 semanas define ICPs ganadores, formatos ganadores, zonas con demanda real y donde escalar presupuesto.",
    fases: [
      {
        nombre: "FOUNDATION: Setup Tecnico + Handoff Creativo",
        lapso: "Semanas 1-3",
        inversion: null,
        descripcion: "Etapa de cimientos. Setup tecnico completo (atribucion Meta + analitica del sitio) + handoff creativo con el equipo de branding de Star Deportes. Se define la estrategia creativa, se entregan los briefs por segmento y el equipo de branding comparte una base de piezas graficas segmentadas por categoria para research y seleccion. Se arranca la produccion y seleccion de las ~52 piezas.",
        entregables: [
          "Meta Pixel + CAPI instalados en stardeportes.com",
          "Setup GTM: eventos personalizados de e-commerce (view_item, add_to_cart, begin_checkout, purchase) para mapear el customer journey completo en Tienda Nube",
          "GA4 configurado con funnel de conversion: visitas por pagina, categorias mas vistas, puntos de fuga del checkout",
          "REE Metrics conectado (atribucion Meta Ads + Tienda Nube)",
          "Meta Ads Shopping configurado (catalogo dinamico)",
          "Auditoria de campanas actuales + estructura de cuenta optimizada",
          "Handoff creativo con equipo de branding: briefs por segmento, angulos, formatos y categorias",
          "Inicio de produccion creativa (~52 piezas)",
        ],
      },
      {
        nombre: "BUILD: Produccion Creativa + Estructura de Campanas",
        lapso: "Semanas 3-6",
        inversion: null,
        descripcion: "Produccion de las ~52 piezas en coordinacion con el equipo de branding de Star Deportes (5 personas, 2 disenadores). En paralelo, armado de la estructura de las 5 campanas en Meta Ads con sus conjuntos de anuncios por categoria, zona e ICP. Validacion end-to-end del funnel (ad > Tienda Nube > REE Metrics). Al final del build, todo esta listo para lanzar.",
        entregables: [
          "~36 piezas de conversion B2C producidas (12 Hombre + 12 Mujer + 12 Kids)",
          "~8 piezas de awareness producidas",
          "~8 piezas de oferta de credito producidas",
          "Total: ~52 anuncios listos para lanzar",
          "5 campanas estructuradas en Meta Ads con conjuntos de anuncios configurados",
          "Segmentacion por zona: sucursales, aledañas (Guernica, Glew, Alejandro Korn, Burzaco), expansion (Zona Oeste)",
          "Validacion end-to-end del funnel: ad > Tienda Nube > REE Metrics",
        ],
      },
      {
        nombre: "LAUNCH: Lanzamiento Integral",
        lapso: "Semanas 7-8",
        inversion: null,
        descripcion: "Las 5 campanas corren en paralelo a maxima capacidad. 3 campanas de venta (Hombre, Mujer, Kids) con ~36 anuncios + 1 campana de awareness con ~8 anuncios + 1 campana de credito con ~8 anuncios. ~52 anuncios activos. Reportes quincenales. El objetivo es generar el maximo volumen de data en el menor tiempo posible.",
        entregables: [
          "~52 anuncios activos en el pico (36 venta + 16 interaccion)",
          "Retargeting de visitantes y carritos abandonados",
          "Reportes quincenales: CPA, ROAS, ticket promedio por anuncio y zona",
          "Identificacion temprana de ganadores y perdedores por segmento/zona/formato",
        ],
      },
      {
        nombre: "SCALE: Optimizacion + Cierre de Ciclo",
        lapso: "Semanas 9-10",
        inversion: null,
        descripcion: "Se pausan los anuncios sin traccion y se escala presupuesto hacia los ganadores. Analisis integral de los 3 ejes. Reporte final con ICPs ganadores, formatos ganadores, zonas con demanda real (input para expansion en caracol). El ciclo se repite con la data recopilada: nuevo foundation con los aprendizajes, nuevas piezas optimizadas, y segundo lanzamiento enfocado en lo que funciono.",
        entregables: [
          "Reporte integral del ciclo (conversion, awareness, credito)",
          "ICPs ganadores por segmento y zona",
          "Formatos y angulos con mejor performance",
          "Mapa de demanda por zona (input para expansion en caracol)",
          "Redistribucion de presupuesto hacia ganadores",
          "Plan de segundo ciclo basado en data recopilada",
        ],
      },
    ],
    canalesRecomendados: [
      "Meta Ads (Instagram + Facebook): conversion, awareness, oferta local",
      "E-commerce Tienda Nube (stardeportes.com)",
      "Meta Ads Shopping (catalogo dinamico)",
      "REE Metrics (atribucion y reportes)",
    ],
    kpisPropuestos: [
      "// B2C Venta (Campanas 1-3)",
      "Visitas a la pagina / Ventas en Tienda Nube",
      "CPA por venta",
      "ROAS por campana",
      "// Awareness (Campana 4)",
      "Visitas al perfil de IG / Seguidores nuevos",
      "Alcance por zona",
      "Frecuencia",
      "// Credito Personal (Campana 5)",
      "Consultas por canal (WhatsApp, IG, Messenger)",
      "Costo por consulta",
      "CPL por consulta",
    ],
    notasPropuesta: "Roadmap de lanzamiento integral: 10/12 semanas, ~52 anuncios activos en el pico. El objetivo no es optimizar desde el dia 1 sino obtener la mayor cantidad de data posible para luego redistribuir presupuesto segun resultados. La produccion creativa se coordina con el equipo de branding de Star Deportes (5 personas, 2 disenadores).",
  },
  valorServicio: {
    lineas: [
      {
        concepto: "Mes 1: Integracion + Setup",
        monto: "USD 1,500",
        descripcion: "Integracion Tienda Nube a REE Metrics (ventas, pedidos, carritos abandonados). Integracion Meta Ads a REE Metrics (atribucion de campanas, CPA, ROAS). Integracion WhatsApp / IG / Messenger a REE Metrics (tracking de consultas por canal). Meta Pixel + Conversions API (CAPI) via GTM. Eventos de e-commerce en GA4 (view_item, add_to_cart, begin_checkout, purchase). Meta Ads Shopping (catalogo dinamico de Tienda Nube). Auditoria y reestructuracion de campanas existentes. Handoff creativo con equipo de branding + produccion y seleccion de ~52 piezas.",
        tipo: "unico",
      },
      {
        concepto: "Servicio REE Growth",
        monto: "USD 1,000/mes",
        descripcion: "Lanzamiento y gestion de 5 campanas (3 venta B2C + 1 awareness + 1 credito personal, ~52 anuncios). REE Metrics: reportes quincenales, dashboards de atribucion, analisis de funnel. Reuniones de seguimiento quincenales con el equipo de Star Deportes. Optimizacion continua de campanas segun data (pausar perdedores, escalar ganadores). Colaboracion con equipo de branding para rotacion de piezas y nuevos creativos. Ciclos de scale + nuevos lanzamientos basados en data del ciclo anterior.",
        tipo: "mensual",
      },
      {
        concepto: "Presupuesto de Pauta (Ads)",
        monto: "USD 2,000/mes",
        descripcion: "Se activa a partir de la semana 6 (launch). Quedan 4/6 semanas de campanas activas para validar el funnel y obtener data real (3 semanas de testeo / 3 semanas de optimizacion). B2C Hombre (Venta) — ~USD 500. B2C Mujer (Venta) — ~USD 500. B2C Kids (Venta) — ~USD 500. Credito Personal (Interaccion) — ~USD 300. Awareness (Interaccion) — ~USD 200.",
        tipo: "por-proyecto",
      },
    ],
    notaRoi: "Desarrollamos el **funnel end-to-end** de Star Deportes y validamos su oferta digitalmente. Conectamos el e-commerce, las campanas y los canales de consulta en un solo lugar para que cada peso invertido en publicidad se pueda medir. Durante 3 meses montamos la infraestructura, lanzamos las campanas y optimizamos en base a resultados reales. El objetivo es que al final del ciclo tengan **datos concretos** de que funciona, que no, y donde conviene escalar.",
    aclaraciones: [
      "Valores estimativos sujetos a scope final tras relevamiento",
      "Contenido UGC producido en coordinacion con el equipo de branding de Star Deportes",
      "El presupuesto de pauta se redistribuye segun performance al final de cada ciclo",
    ],
  },
  valorServicioBajoRiesgo: {
    descripcion: "Version **minima viable** del proyecto completo en **8 semanas (2 meses)**. Se prenden las **3 campanas B2C de venta** (Hombre, Mujer, Kids) con 8 anuncios cada una (**8x3 = 24 anuncios en total**) en las zonas de las sucursales existentes. No es la forma mas eficiente (el plan integral genera mas data y optimiza mejor), pero permite **validar el funnel e-commerce por genero**, obtener un CPA real por segmento y escalar si los resultados lo justifican.",
    lineas: [
      {
        concepto: "Mes 1: Integracion + Setup",
        monto: "USD 800",
        descripcion: "Integracion Tienda Nube a REE Metrics (ventas, pedidos, carritos). Meta Pixel + Conversions API (CAPI) via GTM. Eventos de e-commerce en GA4 (view_item, add_to_cart, begin_checkout, purchase). Auditoria y reestructuracion de campanas existentes. Handoff creativo con equipo de branding + produccion de ~24 piezas (8 por genero).",
        tipo: "unico",
      },
      {
        concepto: "Servicio REE Growth (Bajo Riesgo)",
        monto: "USD 600/mes",
        descripcion: "Lanzamiento y gestion de 3 campanas B2C de venta (Hombre, Mujer, Kids, ~24 anuncios). REE Metrics: reportes quincenales, dashboard de atribucion. Reuniones de seguimiento quincenales. Optimizacion continua segun data. Colaboracion con equipo de branding para rotacion de piezas.",
        tipo: "mensual",
      },
      {
        concepto: "Presupuesto de Pauta (Ads)",
        monto: "USD 900/mes",
        descripcion: "Se activa a partir de la semana 4 (launch). Quedan 4 semanas de campanas activas para validar el funnel y obtener data real (2 semanas de testeo / 2 semanas de optimizacion). B2C Hombre (Venta) — ~USD 300. B2C Mujer (Venta) — ~USD 300. B2C Kids (Venta) — ~USD 300.",
        tipo: "por-proyecto",
      },
    ],
    aclaraciones: [
      "No incluye campanas de awareness, credito personal ni Shopping (catalogo dinamico)",
      "Si los resultados son positivos, se puede escalar al plan integral sin perder lo implementado",
      "Ideal para validar el modelo antes de comprometer el presupuesto completo",
    ],
  },
  gaps: [
    {
      variable: "Ticket Promedio",
      descripcion: "No se menciono el ticket promedio de venta ni en tiendas fisicas ni en e-commerce. Sin este dato no se puede calcular CPA maximo ni viabilidad financiera.",
      prioridad: "alta",
      preguntaSugerida: "Cual es el ticket promedio de venta en sus tiendas fisicas? Y en el e-commerce, aunque sea con pocas ventas, cual fue el promedio?",
    },
    {
      variable: "Margen Bruto",
      descripcion: "Solo se menciono que los precios son 'similares a la competencia'. No se obtuvieron margenes por producto ni por canal. Sin margenes no se puede calcular el CPA maximo tolerable.",
      prioridad: "alta",
      preguntaSugerida: "Cual es el margen bruto promedio de sus productos? Varia mucho entre calzado e indumentaria?",
    },
    {
      variable: "Presupuesto Actual de Ads",
      descripcion: "Mencionaron que tienen un presupuesto definido de Meta Ads pero no compartieron el monto. Es critico para dimensionar las campanas de conversion.",
      prioridad: "alta",
      preguntaSugerida: "Cuanto estan invirtiendo mensualmente en Meta Ads actualmente? Estarian dispuestos a aumentar ese presupuesto si se demuestra ROI positivo?",
    },
    {
      variable: "Meta Pixel",
      descripcion: "La web stardeportes.com NO tiene Meta Pixel instalado. Llevan años invirtiendo en Meta Ads sin tracking de conversiones del sitio. Esto es el primer fix critico antes de cualquier campana de conversion.",
      prioridad: "alta",
      preguntaSugerida: "Necesitamos acceso al Meta Business Suite para instalar el Pixel y configurar la API de Conversiones (CAPI) en stardeportes.com. Es el paso #1 antes de lanzar campanas de conversion.",
    },
    {
      variable: "Facturacion Mensual",
      descripcion: "No se conoce la facturacion mensual total ni el split por sucursal. Necesario para dimensionar el potencial de crecimiento via e-commerce.",
      prioridad: "media",
      preguntaSugerida: "Podrian compartir la facturacion mensual promedio (total y por sucursal)? Nos ayuda a estimar cuanto representaria el e-commerce como canal adicional.",
    },
    {
      variable: "APIs de Callbell y DragonFish",
      descripcion: "Se propuso integrar Callbell (CRM) con DragonFish (gestion) para automatizar stock, pero no se verifico si ambos sistemas tienen APIs disponibles.",
      prioridad: "media",
      preguntaSugerida: "DragonFish tiene API abierta o alguna forma de consultar stock programaticamente? Y Callbell, permite integraciones con bots o tiene API?",
    },
    {
      variable: "Acceso a Tienda Nube Admin",
      descripcion: "Ya tenemos la URL (stardeportes.com) pero necesitamos acceso al panel de administracion de Tienda Nube para configurar integraciones, revisar metricas de trafico y ventas, e instalar el Meta Pixel.",
      prioridad: "media",
      preguntaSugerida: "Podrian darnos acceso colaborador al panel de Tienda Nube de stardeportes.com? Necesitamos configurar el Meta Pixel, revisar metricas y preparar la integracion con REE Metrics.",
    },
    {
      variable: "Cuenta de Meta Ads",
      descripcion: "No se pidio acceso ni se reviso la estructura actual de las campanas de Meta Ads.",
      prioridad: "media",
      preguntaSugerida: "Podrian darnos acceso de lectura a su cuenta de Meta Business Suite? Necesitamos auditar la estructura de campanas y el historico de inversiones.",
    },
  ],
  notasAdicionales: null,
  proximosPasos: [
    "Founders REE revisan este diagnostico y dan feedback sobre vision, enfoque e iteraciones",
    "Iterar el diagnostico y desarrollar dos propuestas para el cliente: una integral y otra de bajo riesgo mas adaptada",
    "Evaluar ambas propuestas internamente antes de presentar a Grupo Lente",
  ],
  resumenCierre: "Grupo Lente (**Star Deportes**, stardeportes.com) es un caso clasico de **empresa madura en lo fisico pero sin desarrollar en lo digital**. **13 sucursales** en provincia de Buenos Aires, **13 años** dominando la periferia de La Plata con **cuasi-monopolio** en varios pueblos, equipo de branding de **5 personas**, **189k seguidores** en IG, presencia en 3 redes (IG, FB, TikTok), y un diferencial competitivo fuerte en el **credito personal**. **40+ marcas** deportivas en catalogo. Tienen **13 años de data estacional** pero **cero atribucion digital**: saben exactamente cuando venden mas, pero no pueden medir que genera cada peso invertido en publicidad.\n\nLa infraestructura digital tiene **gaps criticos**: llevan años invirtiendo en Meta Ads pero **NO tienen Meta Pixel** en el sitio (solo GA4 y GTM). No pueden hacer **retargeting** basico ni medir conversiones. Su e-commerce tiene un mes y representa el **0.01% de las ventas**. **Nunca hicieron campanas de conversion**. Mientras tanto, la competencia opera con masividad de testeo: **Mateu (45 anuncios activos)**, **Solo Deportes (73)** y **Open Sports (99)**, posicionando creativos nichados por ICP, formato y producto. Ninguno de los tres ofrece **credito personal directo al consumidor**.\n\n- **Infraestructura de medicion** que nunca tuvieron: Pixel + CAPI + REE Metrics para atribuir cada peso invertido a una venta real.\n- **Campanas de conversion reales** al e-commerce, segmentadas por genero y categoria.\n- **Credito personal** como diferencial unico que ningun competidor ofrece, derivando consultas por WhatsApp.\n- **Ads geolocalizados** para validar demanda por zona y guiar la expansion fisica a nuevas localidades.\n\nEl foco deberia ser **ir por el integral**. Si no cierra, tenemos el **paso de bajo riesgo** como alternativa para entrar y demostrar resultados.",
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
const outPath = new URL("./discovery-grupo-lente.html", import.meta.url);
writeFileSync(outPath, html, "utf-8");
console.log("Done: discovery-grupo-lente.html");
