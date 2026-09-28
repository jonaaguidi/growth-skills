// Acuerdo comercial de Defu - The Tofu Co.
// Regenerar:  npx tsx clients/defu/gen.mts
// Propuesta:  ree-website/public/proposals/defu.json

import {
  BLOQUES_PAGOS,
  CLAUSULA_PLAZOS,
  DEFINICION_GO_LIVE,
  seccionesFijas,
} from "../../src/lib/contract-templates.js";
import { renderContract, type AcuerdoData } from "../_render.mts";

const acuerdo: AcuerdoData = {
  slug: "defu",
  clientName: "Defu - The Tofu Co.",
  clientResponsible: "Angel Huang",
  date: "28/09/2026",
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
          text: "El presupuesto de pauta sugerido es de **USD 500/mes**, distribuido actualmente en **USD 150/mes** para Awareness y **USD 350/mes** para el funnel B2C de ventas. La distribución se redistribuye mes a mes según los resultados de performance.",
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
        ...BLOQUES_PAGOS,
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
        DEFINICION_GO_LIVE,
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
    ...seccionesFijas(7),
  ],
};

await renderContract(acuerdo, import.meta.url);
