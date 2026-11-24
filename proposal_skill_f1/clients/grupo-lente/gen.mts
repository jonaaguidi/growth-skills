// Acuerdo comercial de Grupo Lente / Star Deportes.
// Regenerar:  npx tsx clients/grupo-lente/gen.mts
// Reemplaza al acuerdo legacy hecho a mano (04/09/2026): Kick Off real el 05/10/2026.

import {
  BLOQUES_PAGOS,
  CLAUSULA_PLAZOS,
  DEFINICION_GO_LIVE,
  seccionesFijas,
} from "../../src/lib/contract-templates.js";
import { renderContract, type AcuerdoData } from "../_render.mts";

const acuerdo: AcuerdoData = {
  slug: "grupo-lente",
  clientName: "Grupo Lente / Star Deportes",
  clientResponsible: "Matías Chirino / Leandro Chirino",
  date: "05/10/2026",
  totalValue: "USD 1,000/mes",
  footerValue: "USD 1,500 (primer mes) / USD 1,000/mes (recurrente)",
  sections: [
    {
      number: 1,
      title: "Alcance de la propuesta",
      blocks: [
        {
          type: "paragraph",
          text: "Gestión integral de paid media en Meta Ads (Facebook e Instagram). El servicio cubre la estrategia, setup técnico, configuración de campañas, bajada de línea creativa, optimización y reporte de resultados. Incluye:",
        },
        {
          type: "includes",
          items: [
            "Estrategia de campañas y definición de audiencias.",
            "Setup técnico: alta de Meta Pixel en Tienda Nube, configuración de Meta Ads Shopping (catálogo dinámico), conexión de Meta Ads y Tienda Nube a REE Metrics.",
            "**5 campañas** en Meta Ads (**~46 piezas totales**): B2C Hombre (~10), B2C Mujer (~10), B2C Kids (~10), Brand Awareness (~8), Crédito Personal (~8).",
            "Bajada de línea creativa (briefs, copy, dirección visual) para que el equipo de branding de Star Deportes ejecute las piezas.",
            "Reuniones y reportes quincenales/mensuales de performance.",
            "Dashboard en tiempo real vía REE Metrics.",
          ],
        },
        {
          type: "excludes",
          items: [
            "Producción y ejecución de creativos (a cargo del equipo de branding de Star Deportes)",
            "Producción audiovisual (video, fotografía profesional)",
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
          text: "El compromiso mínimo es de **3 meses calendario (12 semanas)**. El roadmap inicial contempla las fases **Foundation, Build, Launch y Scale** dentro de ese periodo, contadas desde el Kick Off del **05/10/2026**. Cumplido ese periodo, el servicio se renueva automáticamente por periodos mensuales. Cualquiera de las partes puede notificar la baja con **30 días** de anticipación.",
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
          text: "El presupuesto de pauta sugerido es de **USD 2,000/mes**. La distribución entre campañas se define en la estrategia (Foundation) y se redistribuye mes a mes según los resultados de performance.",
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
            { concept: "Mes 1 (setup + integración + servicio + REE Metrics)", amount: "USD 1,500" },
            { concept: "Mes 2 en adelante (servicio + REE Metrics)", amount: "USD 1,000/mes" },
          ],
        },
        {
          type: "paragraph",
          text: "El mes de inicio (octubre 2026) se factura **completo**, según lo acordado entre las partes. **Primer pago: del 1 al 10 de noviembre de 2026.**",
        },
        ...BLOQUES_PAGOS,
      ],
    },
    {
      number: 5,
      title: "Prorrateo por días de servicio",
      blocks: [
        {
          type: "paragraph",
          text: "A partir del mes 2, el fee mensual corresponde a un **mes completo** de servicio. Si el servicio finaliza en un mes parcial, el fee de ese mes se **prorratea por los días efectivos de servicio**: se cuenta desde el primer día del mes hasta la fecha de finalización.",
        },
        {
          type: "note",
          text: "El prorrateo aplica únicamente al fee de REE. La pauta publicitaria se debita de la tarjeta del cliente según el gasto real en Meta Ads, por lo que ya resulta proporcional a los días de campaña activa.",
        },
      ],
    },
    {
      number: 6,
      title: "Plan de ejecución",
      blocks: [
        {
          type: "paragraph",
          text: "El proyecto se ejecuta en **12 semanas** a partir del Kick Off del **05/10/2026**. Las semanas se cuentan desde esa fecha.",
        },
        {
          type: "bullets",
          items: [
            "**Foundation (S1-3):** Kick Off el **05/10**, onboarding, estrategia, instalación de Meta Pixel en Tienda Nube, configuración de Meta Ads Shopping (catálogo dinámico), integración de Meta Ads + Tienda Nube + Pixel en REE Metrics, briefs creativos para el equipo de Star Deportes.",
            "**Build (S4-6):** armado y/o reutilización de las piezas, estructuración de las 5 campañas, segmentación por zona, intereses y rango etario.",
            "**Launch (S6-9):** activación de campañas, optimización continua, reportes quincenales vía REE Metrics (CPA, ROAS, ticket por zona).",
            "**Scale (S9-12):** optimización del presupuesto, pausa de lo que no funciona, escalado de ganadores, demand mapping y análisis de hacia dónde apuntar la siguiente etapa a partir de los ángulos ganadores.",
          ],
        },
        {
          type: "paragraph",
          text: "La campaña de Awareness se activa en la **semana 3** (semana del **19/10**) y las campañas de venta B2C y Crédito Personal en la **semana 7** (semana del **16/11**), sujeto al Gantt de la propuesta.",
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
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real. Utilizando la plataforma como apalancamiento, se entregan reportes de performance con análisis y recomendaciones: **quincenales** durante Launch, **mensuales** a partir de Scale.",
        },
      ],
    },
    ...seccionesFijas(8),
  ],
};

await renderContract(acuerdo, import.meta.url);
