// Acuerdo comercial de Micelic.
// Regenerar:  npx tsx clients/micelic/gen.mts
// Propuesta:  ree-website/public/proposals/micelic.json

import {
  BLOQUES_PAGOS,
  CLAUSULA_PLAZOS,
  DEFINICION_GO_LIVE,
  seccionesFijas,
  seccionProrrateo,
} from "../../src/lib/contract-templates.js";
import { renderContract, type AcuerdoData } from "../_render.mts";

const acuerdo: AcuerdoData = {
  slug: "micelic",
  clientName: "Micelic",
  clientResponsible: "Julián Ruiz",
  date: "05/10/2026",
  totalValue: "USD 500/mes",
  sections: [
    {
      number: 1,
      title: "Alcance de la propuesta",
      blocks: [
        {
          type: "paragraph",
          text: "Gestión integral de paid media en Meta Ads (Facebook e Instagram) para Micelic. El servicio cubre la estrategia, el setup técnico, la bajada creativa, la configuración y optimización de campañas y el reporte de resultados. Incluye:",
        },
        {
          type: "includes",
          items: [
            "Estrategia de campañas, definición de audiencias y ángulos de comunicación por ICP.",
            "Setup técnico: Business Manager y cuenta publicitaria propios a nombre de Micelic, identidad de @micelic.ar asociada a los anuncios, validación del Pixel de Meta y eventos de compra en Tienda Nube, conexión de Meta Ads y Tienda Nube a REE Metrics.",
            "**2 campañas** en Meta Ads: **MICELIC_Awareness** (interacción hacia el perfil @micelic.ar) y **MICELIC_Ventas** (conversión hacia micelic.com).",
            "Bajada creativa de las piezas de ambas campañas: guiones de los videos y mensajes de las gráficas, con variantes por ángulo. La producción del contenido queda del lado de Micelic.",
            "Retargeting de visitantes de micelic.com y de quienes interactúan con el perfil de Instagram.",
            "Dashboard en tiempo real vía REE Metrics: CPA, ROAS, ticket promedio y venta real cruzada contra el gasto de pauta.",
            "Reportes de performance quincenales y llamada mensual de estrategia.",
          ],
        },
        {
          type: "excludes",
          items: [
            "Producción audiovisual y de contenido (video, fotografía, edición). Queda a cargo de Micelic sobre la bajada creativa que entrega REE.",
            "Carga e implementación de productos, combos y precios en Tienda Nube (a cargo de Micelic; REE define la estrategia de combos).",
            "Pauta publicitaria (se paga con la tarjeta del cliente directo en Meta)",
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
          text: "El roadmap inicial cubre **8 semanas** contadas desde el Kick Off del **07/10/2026**, con las fases **Foundation, Build, Launch y Scale**. Cumplido ese periodo, el servicio se renueva automáticamente por periodos mensuales. Cualquiera de las partes puede notificar la baja con **30 días** de anticipación.",
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
          text: "El presupuesto de pauta sugerido es de **USD 500/mes**. La distribución entre campañas la define REE dentro de ese presupuesto y se reasigna mes a mes según los resultados de performance.",
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
            { concept: "Fee REE Growth (estrategia, bajada creativa, gestión y optimización)", amount: "USD 450/mes" },
            { concept: "REE Metrics (dashboard con integración a Tienda Nube y Meta Ads)", amount: "USD 50/mes" },
          ],
          total: { concept: "Total mensual", amount: "USD 500/mes" },
        },
        ...BLOQUES_PAGOS,
      ],
    },
    seccionProrrateo(5),
    {
      number: 6,
      title: "Plan de ejecución",
      blocks: [
        {
          type: "paragraph",
          text: "El proyecto se ejecuta en **8 semanas** a partir del Kick Off del **07/10/2026**. Las semanas se cuentan desde esa fecha.",
        },
        {
          type: "bullets",
          items: [
            "**Foundation (S1):** Kick Off el **07/10**, accesos a Meta Business, Tienda Nube e Instagram. Business Manager y cuenta publicitaria propios de Micelic, identidad de @micelic.ar asociada a los anuncios, validación del Pixel con eventos de compra de Tienda Nube e integración con REE Metrics.",
            "**Build (S2-3):** bajada creativa de ambas campañas (guiones y mensajes por ángulo), curaduría del contenido orgánico existente para Awareness, estructura de campañas y segmentación de conjuntos por ICP.",
            "**Launch (S3-5):** activación de **MICELIC_Awareness** la semana del **19/10** y de **MICELIC_Ventas** la semana del **26/10**, con una ventana de aprendizaje de **14 días** por campaña y primer reporte de performance.",
            "**Scale (S5-8):** reasignación de presupuesto hacia los ángulos validados, retargeting sobre visitantes de micelic.com, seguimiento semanal en REE Metrics y análisis de hacia dónde apuntar la siguiente etapa a partir del ángulo ganador.",
          ],
        },
        DEFINICION_GO_LIVE,
        CLAUSULA_PLAZOS,
      ],
    },
    {
      number: 7,
      title: "Reportes y métricas",
      blocks: [
        {
          type: "paragraph",
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real de Meta Ads y Tienda Nube: CPA, ROAS, ticket promedio y la venta real cruzada contra el gasto de pauta. Utilizando la plataforma como apalancamiento, se entregan reportes de performance **quincenales** con análisis y recomendaciones, más una **llamada mensual** de estrategia.",
        },
      ],
    },
    ...seccionesFijas(8),
  ],
};

await renderContract(acuerdo, import.meta.url);
