import type { ContractSection, ContractData } from "../lib/contract-types.js";
import { renderContract } from "../lib/contract-renderer.js";

export const name = "generate-contract";

export const description =
  "Genera un acuerdo comercial (terminos y condiciones) en HTML con branding REE. " +
  "Se usa despues de que el cliente aprueba la propuesta (slides). " +
  "Recibe datos del cliente, secciones del acuerdo y valor total. " +
  "Devuelve HTML listo para guardar en clients/{slug}/acuerdo-{slug}.html e imprimir/exportar a PDF.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    clientName: {
      type: "string",
      description: "Nombre del cliente o empresa.",
    },
    clientResponsible: {
      type: "string",
      description: "Nombre del responsable/contacto del cliente.",
    },
    date: {
      type: "string",
      description: "Fecha del contrato (ej. '01/07/2026').",
    },
    serviceTitle: {
      type: "string",
      description:
        "Titulo del servicio (default: 'Growth: Paid Media').",
    },
    totalValue: {
      type: "string",
      description: "Valor total del servicio (ej. 'USD 2.500/mes').",
    },
    footerValue: {
      type: "string",
      description:
        "Texto descriptivo del valor para el footer (ej. 'USD 1,500 (primer mes) / USD 1,000/mes (recurrente)'). " +
        "Si se omite, se usa totalValue.",
    },
    sections: {
      type: "string",
      description:
        "JSON string con array de ContractSection[]. Cada seccion tiene number, title y blocks. " +
        "Blocks puede ser: paragraph (text), bullets (items), includes (items), excludes (items), " +
        "paymentTable (rows con concept/amount, total opcional), note (text).",
    },
  },
  required: [
    "clientName",
    "clientResponsible",
    "date",
    "totalValue",
    "sections",
  ],
};

interface GenerateContractInput {
  clientName: string;
  clientResponsible: string;
  date: string;
  serviceTitle?: string;
  totalValue: string;
  footerValue?: string;
  sections: string;
}

export async function handler(args: GenerateContractInput) {
  let parsedSections: ContractSection[];
  try {
    parsedSections = JSON.parse(args.sections) as ContractSection[];
  } catch {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el campo 'sections' no es un JSON valido.",
        },
      ],
    };
  }

  const data: ContractData = {
    header: {
      serviceTitle: args.serviceTitle ?? "Growth: Paid Media",
      clientName: args.clientName.trim(),
      clientResponsible: args.clientResponsible.trim(),
      date: args.date.trim(),
    },
    sections: parsedSections,
    totalValue: args.totalValue.trim(),
    footerValue: args.footerValue?.trim(),
  };

  const html = renderContract(data);

  return {
    content: [
      {
        type: "text" as const,
        text: html,
      },
    ],
  };
}
