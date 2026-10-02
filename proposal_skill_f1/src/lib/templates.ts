import type { MethodPhase, PaymentMethod } from "./types.js";

// ── Static content: REE method 5 phases ──

export const REE_METHOD_PHASES: MethodPhase[] = [
  {
    number: "1",
    name: "DIAGNÓSTICO",
    duration: "2-4 días",
    description:
      "Diagnóstico integral del negocio: entender el estadio del cliente y sus necesidades.",
    deliverable: "Diagnóstico + Value Proposition",
    deliverableIcon: "clipboard",
  },
  {
    number: "2",
    name: "FOUNDATION",
    duration: "5-7 días",
    description:
      "Los cimientos: la estrategia que mejor se adapta al cliente según el diagnóstico.",
    deliverable: "Presentación: Estrategia de Marketing",
    deliverableIcon: "presentation",
  },
  {
    number: "3",
    name: "BUILD",
    duration: "7-14 días",
    description:
      "Construir el sistema completo (creativos, campañas, ecommerce, tracking, panel) sin encender nada.",
    deliverable: "Funnel completo + Dashboard entregado",
    deliverableIcon: "grid",
  },
  {
    number: "4",
    name: "LAUNCH",
    duration: "14 días",
    description:
      "Validar con inversión real: testear ángulos y encontrar el ganador.",
    deliverable: "Primeros Leads + Reporte de Launch en REE Metrics",
    deliverableIcon: "target",
  },
  {
    number: "5",
    name: "SCALE",
    duration: "Ciclos de 7-10 días",
    description:
      "Data-driven ads: escalar el presupuesto del creativo ganador y replicar el formato que convirtió.",
    deliverable: "Reporte Mensual + Plan",
    deliverableIcon: "chart",
  },
];

// ── Closing slide defaults ──

export const DEFAULT_CLOSING = {
  headline: "¿COMENZAMOS?",
  steps: [
    { number: "01", text: "Confirmación" },
    { number: "02", text: "Config. Meta Business, Tienda Nube y REE Metrics" },
    { number: "03", text: "Lanzamiento de Campaña Awareness" },
  ],
};

// ── Payment methods defaults ──

export const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: "Efectivo",
    icon: "cash",
    details: [
      "Pago en pesos argentinos o dolares.",
      "Se coordina entrega con el equipo de REE.",
    ],
  },
  {
    name: "Cripto (USDT)",
    icon: "crypto",
    details: [
      "Transferencia en USDT a la dirección y red que indiquemos.",
      "Las comisiones de red corren por cuenta del cliente.",
    ],
  },
  {
    name: "Transferencia Bancaria",
    icon: "bank",
    details: [
      "Transferencia a cuenta bancaria de REE.",
      "Pagos en pesos: cotización de venta del dólar oficial (dolarhoy.com) el día del pago.",
    ],
  },
];

export const DEFAULT_PAYMENT_TERMS = {
  paymentTerms: "El servicio se factura a mes vencido, del 1 al 10 del mes siguiente.",
  currencyNote: "Pagos en pesos: se toman a la cotización de venta del dólar oficial publicada en dolarhoy.com el día del pago.",
  latePayment: "Desde el día 10 de vencido el pago, se aplica un recargo del 10% sobre el saldo. REE puede suspender el servicio hasta regularizar.",
};

// ── Index section names ──

export const SECTION_INDEX = [
  { number: "01", title: "LA LLAMADA", description: "Lo que escuchamos en la discovery call." },
  { number: "02", title: "LA AUDITORÍA", description: "Estado actual de tu marketing digital." },
  { number: "03", title: "EL RESEARCH", description: "Mercado, competencia e ICP." },
  { number: "04", title: "LA PROPUESTA DE VALOR", description: "Roadmap a medida de las necesidades de tu negocio." },
  { number: "05", title: "CÓMO TRABAJAMOS", description: "Nuestro método de 5 fases + REE Metrics." },
  { number: "06", title: "VALOR DEL SERVICIO", description: "Inversión, costos de Meta Ads y próximos pasos." },
];
