// Acuerdo comercial de BTLandia.
// Regenerar:  npx tsx clients/btlandia/gen.mts
// Propuesta:  ree-website/public/proposals/btlandia.json

import {
  BLOQUES_PAGOS,
  CLAUSULA_PLAZOS,
  DEFINICION_GO_LIVE,
  seccionesFijas,
} from "../../src/lib/contract-templates.js";
import { renderContract, type AcuerdoData } from "../_render.mts";

const acuerdo: AcuerdoData = {
  slug: "btlandia",
  clientName: "BTLandia",
  clientResponsible: "Celeste Policastro",
  date: "28/09/2026",
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
            "Producción audiovisual (video, fotografía profesional). Queda sujeta a la disponibilidad de piezas con REE Agencia. La cantidad de piezas puede extenderse en caso de ser necesario y se cotiza de forma aparte.",
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
        ...BLOQUES_PAGOS,
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
            "**Launch (S3-7):** Awareness activa desde el **24/09**. Lanzamiento de la campaña B2B Lead Gen el **13/10** junto a la Call ADS, con review de las primeras **3 semanas** de Awareness.",
            "**Scale (S7-8):** escalado de presupuesto a los anuncios ganadores, pausa de los que no traccionan y optimización de audiencias. Review Ads el **27/10** y Review Final el **06/11**.",
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
          text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con métricas en tiempo real: alcance, visitas al perfil, seguidores, mensajes y CPL. Utilizando la plataforma como apalancamiento, se entregan reportes de performance con análisis y recomendaciones: **quincenales** durante Launch, **mensuales** a partir de Scale.",
        },
      ],
    },
    ...seccionesFijas(7),
  ],
};

await renderContract(acuerdo, import.meta.url);
