// Regenera los acuerdos comerciales de este directorio:
//   npx tsx contracts/gen.mts
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { handler } from "../src/tools/generate-contract.js";

const OUT = dirname(fileURLToPath(import.meta.url));
const DATE = "28/09/2026";

const FIJAS = (n: number) => [
  {
    number: n,
    title: "Datos y confidencialidad",
    blocks: [
      {
        type: "paragraph",
        text: "Los datos de campañas, audiencias y resultados son **propiedad del cliente**. REE los procesa exclusivamente para operar el servicio contratado. Ambas partes se comprometen a mantener **confidencialidad** sobre la información técnica y comercial a la que accedan durante la relación comercial.",
      },
    ],
  },
  {
    number: n + 1,
    title: "Comunicación",
    blocks: [
      {
        type: "paragraph",
        text: "El horario de atención es de **lunes a viernes de 10:00 a 18:00 hs** (hora Argentina). La comunicación oficial del proyecto se realiza por WhatsApp. Las solicitudes fuera de horario se atienden el siguiente día hábil.",
      },
    ],
  },
];

const PAGOS = [
  {
    type: "paragraph",
    text: "Los pagos en pesos se toman a la **cotización de venta del dólar oficial** publicada en **dolarhoy.com** el día del pago.",
  },
  {
    type: "paragraph",
    text: "Aceptamos **efectivo, transferencia bancaria y transferencia en USDT** (a la dirección y red que indiquemos; las comisiones de red corren por cuenta del cliente).",
  },
  {
    type: "paragraph",
    text: "Desde el día 10 de vencido el pago se aplica un recargo del **10%** sobre el saldo, y REE puede **suspender el servicio** hasta regularizar.",
  },
];

const CLAUSULA_PLAZOS = {
  type: "paragraph",
  text: "**Los plazos del roadmap no se pausan** por demoras en la entrega de creativos, accesos o aprobaciones por parte del cliente o de su equipo. El calendario y la facturación siguen corriendo independientemente de estos tiempos de espera.",
};

const GO_LIVE = {
  type: "paragraph",
  text: "Se entiende por **go-live** el momento en que las campañas están activas en Meta Ads y generando alcance e impresiones, con el tracking configurado y el dashboard operativo.",
};

// ─────────────────────────────── DEFU ───────────────────────────────

const defu = {
  clientName: "Defu - The Tofu Co.",
  clientResponsible: "Angel Huang",
  date: DATE,
  totalValue: "USD 500/mes",
  footerValue: "USD 650 (primer mes) / USD 500/mes (recurrente)",
  sections: [
    {
      number: 1,
      title: "Alcance de la propuesta",
      blocks: [
        {
          type: "paragraph",
          text: "Gestión integral de paid media en Meta Ads (Facebook e Instagram) para Defu. El servicio cubre la estrategia, el setup técnico, la configuración y optimización de campañas y el reporte de resultados. Incluye:",
        },
        {
          type: "includes",
          items: [
            "Estrategia de campañas, definición de audiencias y ángulos de comunicación.",
            "Setup técnico: instalación del Pixel de Meta, CAPI y eventos de compra en Tienda Nube, conexión de Meta Ads y Tienda Nube a REE Metrics.",
            "**2 campañas** en Meta Ads: **DEFU_Awareness** (interacción hacia el perfil @defu.tofuco, **6 piezas**) y **DEFU_Ventas** (conversión hacia defu.com.ar, **9 piezas creativas** publicadas en **2 conjuntos por ICP**, lo que da **18 anuncios** en pauta).",
            "Retargeting de visitantes del sitio y de quienes interactúan con el perfil de Instagram.",
            "Dashboard en tiempo real vía REE Metrics: CPA, ROAS, ticket promedio y tasa de conversión.",
            "Reportes de performance y reuniones de seguimiento quincenales.",
          ],
        },
        {
          type: "excludes",
          items: [
            "Producción audiovisual (video, fotografía profesional)",
            "Creación de productos, packs y definición de precios en el ecommerce (a cargo de Defu)",
            "Pauta publicitaria (se paga con la tarjeta del cliente directo en Meta)",
            "Licencias de terceros o herramientas no incluidas en REE Metrics",
          ],
        },
        {
          type: "note",
          text: "Cualquier canal, integración o funcionalidad adicional será presupuestado aparte.",
        },
      ],
    },
    {
      number: 2,
      title: "Duración del servicio",
      blocks: [
        {
          type: "paragraph",
          text: "El roadmap inicial cubre **8 semanas** contadas desde el Kick Off del **25/08/2026**, con las fases **Foundation, Build, Launch y Scale**. Cumplido ese periodo, el servicio se renueva automáticamente por periodos mensuales. Cualquiera de las partes puede notificar la baja con **30 días** de anticipación.",
        },
      ],
    },
    {
      number: 3,
      title: "Pauta publicitaria",
      blocks: [
        {
          type: "paragraph",
          text: "Se pone la tarjeta del cliente directamente en Meta Ads. El gasto publicitario se debita de la cuenta del cliente. REE no intermedia ni gestiona el cobro de la pauta.",
        },
        {
          type: "paragraph",
          text: "El presupuesto de pauta sugerido es de **USD 500/mes**. La distribución entre las campañas de Awareness y Ventas se define en la estrategia (Foundation) y se redistribuye mes a mes según los resultados de performance.",
        },
      ],
    },
    {
      number: 4,
      title: "Facturación y pagos",
      blocks: [
        {
          type: "paragraph",
          text: "El fee de servicio se paga a mes vencido y se factura del **1 al 10 del mes siguiente** al periodo de servicio.",
        },
        {
          type: "paymentTable",
          rows: [
            { concept: "Mes 1 (servicio + REE Metrics + integración Tienda Nube)", amount: "USD 650" },
            { concept: "Mes 2 en adelante (servicio + REE Metrics)", amount: "USD 500/mes" },
          ],
        },
        ...PAGOS,
      ],
    },
    {
      number: 5,
      title: "Plan de ejecución",
      blocks: [
        {
          type: "paragraph",
          text: "El proyecto se ejecuta en **8 semanas** a partir del Kick Off del **25/08/2026**. Las semanas se cuentan desde esa fecha.",
        },
        {
          type: "bullets",
          items: [
            "**Foundation (S1-2):** Kick Off el **25/08**, accesos y configuración de Meta Ads, estrategia de ambas campañas, definición de audiencias, Pixel y eventos en Tienda Nube, integración con REE Metrics. Foundation Review el **01/09**.",
            "**Build (S2-4):** producción y montaje de las 6 piezas de Awareness y las 9 piezas creativas de Ventas, estructuración de campañas y duplicado en los 2 conjuntos por ICP.",
            "**Launch (S4-6):** activación de campañas el **15/09**, testeo de piezas con inversión real y Call ADS de seguimiento el **29/09**.",
            "**Scale (S6-8):** optimización de presupuesto, retargeting, escalado de creativos ganadores y pausa de los que no traccionan. Review Final el **13/10**.",
          ],
        },
        GO_LIVE,
        CLAUSULA_PLAZOS,
      ],
    },
    {
      number: 6,
      title: "Reportes y métricas",
      blocks: [
        {
          type: "paragraph",
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real de Meta Ads, Tienda Nube e Instagram orgánico. Utilizando la plataforma como apalancamiento, se entregan reportes de performance con análisis y recomendaciones: **quincenales** durante Launch, **mensuales** a partir de Scale.",
        },
      ],
    },
    ...FIJAS(7),
  ],
};

// ───────────────────────────── BTLANDIA ─────────────────────────────

const btlandia = {
  clientName: "BTLandia",
  clientResponsible: "Celeste Policastro",
  date: DATE,
  totalValue: "USD 500/mes",
  sections: [
    {
      number: 1,
      title: "Alcance de la propuesta",
      blocks: [
        {
          type: "paragraph",
          text: "Gestión integral de paid media en Meta Ads (Facebook e Instagram) para BTLandia. El servicio cubre la estrategia, el setup técnico, la configuración y optimización de campañas y el reporte de resultados. Incluye:",
        },
        {
          type: "includes",
          items: [
            "Estrategia de campañas, definición de audiencias y ángulos por ICP (Marketing, Comercial y RRHH de medianas y grandes empresas).",
            "Setup técnico: Meta Business Suite y cuenta publicitaria, conexión de WhatsApp Business como destino de campaña, integración de Meta Ads con REE Metrics.",
            "**2 campañas** en Meta Ads con **16 piezas** a desarrollar: **BTLANDIA_Awareness** (**8 piezas** hacia el perfil @btlandia) y **BTLANDIA_B2B_LeadGen** (**8 piezas** de conversión hacia WhatsApp Business).",
            "Bajada de línea creativa (briefs, guiones y ángulos) para las piezas de ambas campañas.",
            "Dashboard en tiempo real vía REE Metrics: alcance, visitas al perfil, mensajes y CPL.",
            "Reportes de performance y reuniones de seguimiento quincenales.",
          ],
        },
        {
          type: "excludes",
          items: [
            "Producción audiovisual (video, fotografía profesional)",
            "Pauta publicitaria (se paga con la tarjeta del cliente directo en Meta)",
            "Licencias o suscripciones de herramientas de terceros",
            "Desarrollo de chatbot o automatización de WhatsApp (objeto de una propuesta separada)",
          ],
        },
        {
          type: "paragraph",
          text: "A medida que se extienda el servicio se pueden incorporar **campañas adicionales** según las oportunidades del calendario comercial de BTLandia (por ejemplo, ExpoAgro). Cada campaña adicional se define y acuerda con el cliente antes de su ejecución.",
        },
        {
          type: "note",
          text: "La producción de contenido creativo se coordina con REE Agencia y el equipo de BTLandia. Cualquier canal, integración o funcionalidad adicional será presupuestado aparte.",
        },
      ],
    },
    {
      number: 2,
      title: "Duración del servicio",
      blocks: [
        {
          type: "paragraph",
          text: "El roadmap inicial cubre **8 semanas** contadas desde el Kick Off del **02/09/2026**, con las fases **Foundation, Build, Launch y Scale**. Cumplido ese periodo, el servicio se renueva automáticamente por periodos mensuales. Cualquiera de las partes puede notificar la baja con **30 días** de anticipación.",
        },
      ],
    },
    {
      number: 3,
      title: "Pauta publicitaria",
      blocks: [
        {
          type: "paragraph",
          text: "Se pone la tarjeta del cliente directamente en Meta Ads. El gasto publicitario se debita de la cuenta del cliente. REE no intermedia ni gestiona el cobro de la pauta.",
        },
        {
          type: "paragraph",
          text: "El presupuesto de pauta sugerido es de **USD 500/mes**, distribuido actualmente en **USD 150/mes** para Awareness y **USD 350/mes** para B2B Lead Gen. La distribución se redistribuye al final de cada ciclo quincenal según los resultados de performance.",
        },
      ],
    },
    {
      number: 4,
      title: "Facturación y pagos",
      blocks: [
        {
          type: "paragraph",
          text: "El fee de servicio se paga a mes vencido y se factura del **1 al 10 del mes siguiente** al periodo de servicio.",
        },
        {
          type: "paymentTable",
          rows: [
            { concept: "Servicio mensual REE Growth (incluye REE Metrics)", amount: "USD 500/mes" },
          ],
        },
        ...PAGOS,
      ],
    },
    {
      number: 5,
      title: "Plan de ejecución",
      blocks: [
        {
          type: "paragraph",
          text: "El proyecto se ejecuta en **8 semanas** a partir del Kick Off del **02/09/2026**. Las semanas se cuentan desde esa fecha.",
        },
        {
          type: "bullets",
          items: [
            "**Foundation (S1-3):** Kick Off el **02/09**, configuración de Meta Ads, accesos e integración con REE Metrics, brief creativo de ambas campañas. Foundation Review el **23/09** con ajustes de ICP, audiencia y piezas.",
            "**Build (S2-5):** desarrollo de las 8 piezas de Awareness y las 8 piezas de conversión de la campaña B2B, estructuración de campañas con conjuntos por ICP y ángulo, validación end to end del funnel (anuncio, WhatsApp, REE Metrics).",
            "**Launch (S3-6):** Awareness activa desde el **24/09**. Lanzamiento de la campaña B2B Lead Gen el **06/10** junto a la Call ADS, con review de las primeras 2 semanas de Awareness.",
            "**Scale (S6-8):** escalado de presupuesto a los anuncios ganadores, pausa de los que no traccionan y optimización de audiencias. Review Ads el **20/10** y Review Final el **30/10**.",
          ],
        },
        GO_LIVE,
        CLAUSULA_PLAZOS,
      ],
    },
    {
      number: 6,
      title: "Reportes y métricas",
      blocks: [
        {
          type: "paragraph",
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real: alcance, visitas al perfil, seguidores, mensajes y CPL. Utilizando la plataforma como apalancamiento, se entregan reportes de performance con análisis y recomendaciones: **quincenales** durante Launch, **mensuales** a partir de Scale.",
        },
      ],
    },
    ...FIJAS(7),
  ],
};

// ────────────────────────────── KABALA ──────────────────────────────

const kabala = {
  clientName: "Kabala",
  clientResponsible: "Camila Sampayo",
  date: DATE,
  totalValue: "USD 500/mes",
  sections: [
    {
      number: 1,
      title: "Alcance de la propuesta",
      blocks: [
        {
          type: "paragraph",
          text: "Gestión integral de paid media en Meta Ads (Facebook e Instagram) para Kabala. El servicio cubre la estrategia, el setup técnico, la configuración y optimización de campañas y el reporte de resultados. Incluye:",
        },
        {
          type: "includes",
          items: [
            "Estrategia de ambas campañas: ángulos de comunicación, audiencias y plan de las 10 piezas.",
            "Research de competencia: qué pautan y cómo se posicionan las marcas del segmento.",
            "Setup técnico: integración con Tienda Nube (Pixel, CAPI y eventos ViewContent, AddToCart, InitiateCheckout y Purchase) y conexión a REE Metrics.",
            "**2 campañas** en Meta Ads con **10 piezas** (**4 videos + 6 gráficas**): **Awareness** hacia el perfil de Instagram y **Ecommerce** hacia kabala.com.ar, con tráfico segmentado a cada categoría (Pantalones, Camperas, Buzos).",
            "Retargeting de visitantes del sitio y de quienes interactúan con la marca.",
            "Dashboard en tiempo real vía REE Metrics: CPA, ROAS, ticket promedio y conversión por categoría.",
            "Optimización continua y reunión quincenal de performance.",
          ],
        },
        {
          type: "excludes",
          items: [
            "Producción y edición de piezas creativas (las 10 piezas se pautan con material provisto por Kabala)",
            "Producción audiovisual (video, fotografía profesional)",
            "Pauta publicitaria (se paga con la tarjeta del cliente directo en Meta)",
            "Licencias de terceros o herramientas no incluidas en REE Metrics",
          ],
        },
        {
          type: "note",
          text: "La producción o edición de piezas puede realizarse con REE Agencia, sujeta a presupuesto aparte. Cualquier canal, integración o funcionalidad adicional será presupuestado aparte.",
        },
      ],
    },
    {
      number: 2,
      title: "Duración del servicio",
      blocks: [
        {
          type: "paragraph",
          text: "El roadmap inicial cubre **8 semanas** contadas desde el Kick Off (fecha a definir con el equipo de Kabala para hacer el traspaso de accesos), con las fases **Foundation, Build, Launch y Scale**. Cumplido ese periodo, el servicio se renueva automáticamente por periodos mensuales. Cualquiera de las partes puede notificar la baja con **30 días** de anticipación.",
        },
      ],
    },
    {
      number: 3,
      title: "Pauta publicitaria",
      blocks: [
        {
          type: "paragraph",
          text: "Se pone la tarjeta del cliente directamente en Meta Ads. El gasto publicitario se debita de la cuenta del cliente. REE no intermedia ni gestiona el cobro de la pauta.",
        },
        {
          type: "paragraph",
          text: "El presupuesto de pauta sugerido es de **USD 500/mes**. La distribución entre las campañas de Awareness y Ecommerce se define en la estrategia (Foundation) y se redistribuye mes a mes según los resultados de performance.",
        },
      ],
    },
    {
      number: 4,
      title: "Facturación y pagos",
      blocks: [
        {
          type: "paragraph",
          text: "El fee de servicio se paga a mes vencido y se factura del **1 al 10 del mes siguiente** al periodo de servicio.",
        },
        {
          type: "paymentTable",
          rows: [
            {
              concept: "Servicio mensual REE Growth (incluye REE Metrics e integración Tienda Nube)",
              amount: "USD 500/mes",
            },
          ],
        },
        {
          type: "note",
          text: "La integración de Tienda Nube (Pixel, CAPI y eventos de conversión) está incluida en el servicio y no se cobra como pago único.",
        },
        ...PAGOS,
      ],
    },
    {
      number: 5,
      title: "Plan de ejecución",
      blocks: [
        {
          type: "paragraph",
          text: "El proyecto se ejecuta en **8 semanas** a partir del Kick Off. Las semanas se cuentan desde esa fecha.",
        },
        {
          type: "bullets",
          items: [
            "**Foundation (S1):** Kick Off, accesos y configuración de Meta Business, Tienda Nube y REE Metrics, estrategia de ambas campañas, research de competencia y definición de segmentación (varones de 20 a 32 años, CABA y alrededores, interesados en moda, streetwear y cultura urbana).",
            "**Build (S2-3):** montaje de la campaña de Awareness con enfoque de branding hacia Instagram, montaje de la campaña de Ecommerce con cada pieza dirigida a su categoría, integración de Tienda Nube con Pixel, CAPI y eventos de conversión.",
            "**Launch (S3-5):** Awareness activa en la **semana 3** y Ecommerce en la **semana 4**, testeo de las 10 piezas con inversión real y primeros eventos de conversión medidos en vivo en REE Metrics.",
            "**Scale (S5-8):** presupuesto al creativo y la audiencia ganadora de cada campaña, retargeting, validación del producto ganador y planificación del siguiente ciclo.",
          ],
        },
        GO_LIVE,
        CLAUSULA_PLAZOS,
      ],
    },
    {
      number: 6,
      title: "Reportes y métricas",
      blocks: [
        {
          type: "paragraph",
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real de Meta Ads, Tienda Nube e Instagram orgánico. Utilizando la plataforma como apalancamiento, se entregan reportes de performance con análisis y recomendaciones: **quincenales** durante Launch, **mensuales** a partir de Scale.",
        },
      ],
    },
    ...FIJAS(7),
  ],
};

// ─────────────────────────────── Run ────────────────────────────────

const jobs = [
  { slug: "defu", data: defu },
  { slug: "btlandia", data: btlandia },
  { slug: "kabala", data: kabala },
];

for (const { slug, data } of jobs) {
  const res = await handler({
    clientName: data.clientName,
    clientResponsible: data.clientResponsible,
    date: data.date,
    totalValue: data.totalValue,
    footerValue: (data as any).footerValue,
    sections: JSON.stringify(data.sections),
  });
  const html = res.content[0].text;
  if (!html.startsWith("<!DOCTYPE") && !html.startsWith("<!doctype") && !html.startsWith("<html")) {
    console.error(`[${slug}] ERROR:`, html.slice(0, 200));
    continue;
  }
  const path = `${OUT}/${slug}-contrato.html`;
  writeFileSync(path, html, "utf8");
  console.log(`[${slug}] OK -> ${path} (${(html.length / 1024).toFixed(1)} KB, ${data.sections.length} secciones)`);
}
