import { z } from "zod";
import type { FoundationData } from "../types/foundation.js";
import { renderBriefHtml } from "../lib/brief-renderer.js";

export const name = "generar-brief-creativos";

export const description =
  "Genera un documento HTML branded de Brief de Creativos para handoff al equipo de produccion. Recibe el mismo FoundationData que generar-foundation-doc.";

export const zodSchema = {
  foundationData: z.string().describe(
    "JSON string con la estructura FoundationData completa. Usa las mismas piezas de creativos.piezasPorIcp con campos opcionales del framework de produccion (pilar, tema, formatoNarrativo, estructuraNarrativa, tratamiento, duracion, referenciaAudiovisual, referenciaGrafica)."
  ),
};

export const inputSchema = {
  type: "object" as const,
  properties: {
    foundationData: {
      type: "string",
      description:
        "JSON string con la estructura FoundationData completa. Usa las mismas piezas de creativos.piezasPorIcp con campos opcionales del framework de produccion.",
    },
  },
  required: ["foundationData"],
};

export async function handler(args: { foundationData: string }) {
  let data: FoundationData;

  try {
    data = JSON.parse(args.foundationData) as FoundationData;
  } catch {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el campo foundationData no es un JSON valido.",
        },
      ],
      isError: true,
    };
  }

  if (!data.clientInfo) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el JSON debe contener al menos clientInfo.",
        },
      ],
      isError: true,
    };
  }

  if (!data.creativos?.piezasPorIcp?.length) {
    return {
      content: [
        {
          type: "text" as const,
          text: "Error: el JSON debe contener creativos.piezasPorIcp con al menos un grupo de piezas.",
        },
      ],
      isError: true,
    };
  }

  const brief = renderBriefHtml(data);

  return {
    content: [
      { type: "text" as const, text: `<!-- BRIEF_CREATIVOS_HTML -->\n${brief}` },
    ],
  };
}
