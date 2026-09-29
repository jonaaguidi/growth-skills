// ── Default contract sections for Growth (Paid Media) ──

import type { ContractBlock, ContractSection } from "./contract-types.js";

export const DEFAULT_GROWTH_SECTIONS: ContractSection[] = [
  {
    number: 1,
    title: "Alcance de la propuesta",
    blocks: [
      {
        type: "paragraph",
        text: "Gestion integral de paid media en Meta Ads (Facebook e Instagram). El servicio cubre la estrategia, ejecucion, optimizacion y reporte de campanas publicitarias digitales. Incluye:",
      },
      {
        type: "includes",
        items: [
          "Estrategia de campanas y definicion de audiencias.",
          "Creacion, configuracion y optimizacion de campanas en Meta Ads.",
          "Diseno de creativos estaticos (hasta 8 piezas por mes).",
          "Reportes mensuales de performance con analisis y recomendaciones.",
          "Dashboard en tiempo real via REE Metrics.",
          "Reuniones de seguimiento quincenales.",
        ],
      },
      {
        type: "excludes",
        items: [
          "Produccion audiovisual (video, fotografia profesional)",
          "Pauta publicitaria (se paga con la tarjeta del cliente directo en Meta)",
          "Licencias de terceros o herramientas no incluidas en REE Metrics",
        ],
      },
      {
        type: "note",
        text: "Cualquier canal, integracion o funcionalidad adicional sera presupuestado aparte.",
      },
    ],
  },
  {
    number: 2,
    title: "Duracion del servicio",
    blocks: [
      {
        type: "paragraph",
        text: "El compromiso minimo es de **3 (tres) meses** calendario. El servicio arranca con la entrega de la estrategia (Foundation) y se renueva automaticamente por periodos mensuales.",
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
        text: "El presupuesto de pauta recomendado se define en la estrategia (Foundation) y se ajusta mes a mes segun los resultados.",
      },
    ],
  },
  {
    number: 4,
    title: "Facturacion y pagos",
    blocks: [
      {
        type: "paymentTable",
        rows: [
          { concept: "Fee REE Growth", amount: "USD 2,450/mes" },
          { concept: "REE Metrics (dashboard)", amount: "USD 50/mes" },
        ],
        total: { concept: "Total mensual", amount: "USD 2,500/mes" },
      },
      {
        type: "paragraph",
        text: "El servicio se factura a **mes vencido**, del 1 al 10 del mes siguiente. El pago debe realizarse dentro de los **10 (diez) dias** corridos posteriores a la emision de la factura.",
      },
      {
        type: "paragraph",
        text: "Los pagos en pesos se toman a la **cotizacion de venta del dolar oficial** publicada en **dolarhoy.com** el dia del pago.",
      },
      {
        type: "paragraph",
        text: "Aceptamos **efectivo, transferencia bancaria y transferencia en USDT** (a la direccion y red que indiquemos; las comisiones de red corren por cuenta del cliente).",
      },
      {
        type: "paragraph",
        text: "Desde el dia 10 de vencido el pago se aplica un recargo del **10%** sobre el saldo, y REE puede **suspender el servicio** hasta regularizar.",
      },
    ],
  },
  {
    number: 5,
    title: "Plan de ejecucion",
    blocks: [
      {
        type: "paragraph",
        text: "El proyecto se ejecuta en 4 fases:",
      },
      {
        type: "bullets",
        items: [
          "**Foundation** (semana 1): estrategia, audiencias, setup tecnico y creativos iniciales.",
          "**Build** (semanas 2-3): configuracion de campanas, tracking y dashboard.",
          "**Launch** (semanas 3-4): go-live de campanas, monitoreo intensivo.",
          "**Scale** (semana 5 en adelante): optimizacion continua, testing de creativos y escalado.",
        ],
      },
      {
        type: "paragraph",
        text: "Se entiende por **go-live** el momento en que las campanas estan activas en Meta Ads y generando impresiones, con el tracking configurado y el dashboard operativo.",
      },
      {
        type: "paragraph",
        text: "Los plazos del roadmap no se pausan por demoras en la entrega de creativos, accesos o aprobaciones por parte del cliente o de su equipo. El calendario y la facturacion siguen corriendo independientemente de estos tiempos de espera.",
      },
    ],
  },
  {
    number: 6,
    title: "Reportes y metricas",
    blocks: [
      {
        type: "paragraph",
        text: "El cliente tiene acceso al dashboard REE Metrics (**USD 50/mes** incluido en el fee) con metricas en tiempo real: CPL, CPA, ROAS, leads y conversiones. El apalancamiento de REE Metrics permite tomar decisiones basadas en datos sin depender de reportes manuales.",
      },
      {
        type: "paragraph",
        text: "Adicionalmente, se entregan reportes de performance **quincenales o mensuales** (segun el plan) con analisis de resultados, hallazgos y recomendaciones para el periodo siguiente.",
      },
    ],
  },
  {
    number: 7,
    title: "Datos y confidencialidad",
    blocks: [
      {
        type: "paragraph",
        text: "Los datos de campanas, audiencias y resultados son propiedad del cliente. REE los procesa exclusivamente para operar el servicio contratado, con las medidas de seguridad correspondientes. Ambas partes mantienen confidencialidad sobre la informacion tecnica y comercial a la que accedan.",
      },
    ],
  },
  {
    number: 8,
    title: "Comunicacion",
    blocks: [
      {
        type: "paragraph",
        text: "El horario de atencion de REE es de lunes a viernes de **10:00 hs a 18:00 hs** (hora Argentina). La comunicacion oficial se realiza mediante WhatsApp. Los mensajes fuera de horario se responden el siguiente dia habil.",
      },
    ],
  },
];

// ── Clausulas estandar de REE, compartidas por todos los acuerdos ──
// Los acuerdos por cliente viven en clients/<slug>/gen.mts y arman sus
// secciones 1-6 a medida, pero reutilizan estos bloques para que el texto
// legal no se reescriba (ni se desincronice) en cada contrato.

/** Bloques de condiciones de pago para la seccion "Facturacion y pagos". */
export const BLOQUES_PAGOS: ContractBlock[] = [
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

/**
 * Prorrateo del fee en meses parciales (inicio y baja).
 * Va en la seccion "Facturacion y pagos", despues de la tabla de montos.
 */
export const CLAUSULA_PRORRATEO: ContractBlock = {
  type: "paragraph",
  text: "Cuando el período facturado es **parcial**, el fee mensual se **prorratea por días efectivos de servicio** sobre el mes calendario correspondiente. El mes de inicio se cuenta desde la fecha del Kick Off y el mes de baja hasta la fecha de finalización del servicio.",
};

/** Definicion de go-live. Va en la seccion "Plan de ejecucion". */
export const DEFINICION_GO_LIVE: ContractBlock = {
  type: "paragraph",
  text: "Se entiende por **go-live** el momento en que las campañas están activas en Meta Ads y generando alcance e impresiones, con el tracking configurado y el dashboard operativo.",
};

/** Clausula de plazos. Obligatoria en la seccion "Plan de ejecucion". */
export const CLAUSULA_PLAZOS: ContractBlock = {
  type: "paragraph",
  text: "**Los plazos del roadmap no se pausan** por demoras en la entrega de creativos, accesos o aprobaciones por parte del cliente o de su equipo. El calendario y la facturación siguen corriendo independientemente de estos tiempos de espera.",
};

/**
 * Secciones fijas de cierre (datos/confidencialidad y comunicacion).
 * No dependen del cliente. `desde` es el numero de la primera seccion.
 */
export const seccionesFijas = (desde: number): ContractSection[] => [
  {
    number: desde,
    title: "Datos y confidencialidad",
    blocks: [
      {
        type: "paragraph",
        text: "Los datos de campañas, audiencias y resultados son **propiedad del cliente**. REE los procesa exclusivamente para operar el servicio contratado. Ambas partes se comprometen a mantener **confidencialidad** sobre la información técnica y comercial a la que accedan durante la relación comercial.",
      },
    ],
  },
  {
    number: desde + 1,
    title: "Comunicación",
    blocks: [
      {
        type: "paragraph",
        text: "El horario de atención es de **lunes a viernes de 10:00 a 18:00 hs** (hora Argentina). La comunicación oficial del proyecto se realiza por WhatsApp. Las solicitudes fuera de horario se atienden el siguiente día hábil.",
      },
    ],
  },
];
