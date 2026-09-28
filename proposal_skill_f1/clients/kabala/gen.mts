// Acuerdo comercial de Kabala.
// Regenerar:  npx tsx clients/kabala/gen.mts
// Propuesta:  ree-website/public/proposals/kabala.json

import {
  BLOQUES_PAGOS,
  CLAUSULA_PLAZOS,
  DEFINICION_GO_LIVE,
  seccionesFijas,
} from "../../src/lib/contract-templates.js";
import { renderContract, type AcuerdoData } from "../_render.mts";

const acuerdo: AcuerdoData = {
  slug: "kabala",
  clientName: "Kabala",
  clientResponsible: "Camila Sampayo",
  date: "28/09/2026",
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
        ...BLOQUES_PAGOS,
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
