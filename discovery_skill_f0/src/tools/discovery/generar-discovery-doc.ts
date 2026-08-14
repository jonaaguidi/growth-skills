import { z } from "zod";
import type { DiscoveryData } from "../../types/discovery.js";
import { tryComputeCpl } from "../../lib/formulas.js";
import { renderDiscoveryHtml } from "../../lib/html-renderer.js";

export const name = "generar-discovery-doc";

export const description =
  "Genera un documento HTML branded de Discovery Fase 0 a partir de los datos estructurados extraidos de una llamada con cliente. El documento es INTERNO (para founders de REE, no para el cliente).";

const citaTextualSchema = z.object({
  texto: z.string(),
  contexto: z.string().nullable(),
});

const gapItemSchema = z.object({
  variable: z.string(),
  descripcion: z.string(),
  prioridad: z.enum(["alta", "media", "baja"]),
  preguntaSugerida: z.string(),
});

export const zodSchema = {
  discoveryData: z.string().describe(
    "JSON string con la estructura DiscoveryData completa. Incluye: clientInfo, variables (4P + ICP: icp, producto, precio, plaza, promocion), calculoCpl, gaps, resumenEjecutivo, citasTextuales y notasAdicionales."
  ),
};

export const inputSchema = {
  type: "object" as const,
  properties: {
    discoveryData: {
      type: "string",
      description:
        "JSON string con la estructura DiscoveryData completa. Incluye: clientInfo, variables (4P + ICP: icp, producto, precio, plaza, promocion), calculoCpl, gaps, resumenEjecutivo, citasTextuales y notasAdicionales.",
    },
  },
  required: ["discoveryData"],
};

export async function handler(args: { discoveryData: string }) {
  let data: DiscoveryData;

  try {
    data = JSON.parse(args.discoveryData) as DiscoveryData;
  } catch {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el campo discoveryData no es un JSON valido.",
        },
      ],
      isError: true,
    };
  }

  if (!data.clientInfo || !data.variables) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el JSON debe contener al menos clientInfo y variables.",
        },
      ],
      isError: true,
    };
  }

  // Auto-calcular CPL si no viene calculado pero los datos existen
  if (data.calculoCpl.cpaMaximo === null || data.calculoCpl.cplObjetivo === null) {
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
  }

  const html = renderDiscoveryHtml(data);

  return {
    content: [
      {
        type: "text" as const,
        text: html,
      },
    ],
  };
}
