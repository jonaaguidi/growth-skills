import { z } from "zod";
import type { FoundationData } from "../types/foundation.js";
import { renderPlaybookHtml } from "../lib/playbook-renderer.js";
import { renderOnboardingHtml } from "../lib/onboarding-renderer.js";
import { renderStrategyHtml } from "../lib/strategy-renderer.js";

export const name = "generar-foundation-doc";

export const description =
  "Genera 3 documentos HTML branded de Foundation Fase 2: (1) Playbook interno completo, (2) Onboarding para el cliente, (3) Estrategia de campanas para el cliente.";

export const zodSchema = {
  foundationData: z.string().describe(
    "JSON string con la estructura FoundationData completa. Incluye: clientInfo, datosF1, equipoAsignado, grupoWhatsApp, metaBusiness, requerimientosCliente, koCall, palanca, icp, propuestaDeValor, calificacionLeads, kpis, presupuesto, creativos, utm, arquitectura, capacidadAtencion, notas y roadmap."
  ),
};

export const inputSchema = {
  type: "object" as const,
  properties: {
    foundationData: {
      type: "string",
      description:
        "JSON string con la estructura FoundationData completa. Incluye: clientInfo, datosF1, equipoAsignado, grupoWhatsApp, metaBusiness, requerimientosCliente, koCall, palanca, icp, propuestaDeValor, calificacionLeads, kpis, presupuesto, creativos, utm, arquitectura, capacidadAtencion, notas y roadmap.",
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

  const playbook = renderPlaybookHtml(data);
  const onboarding = renderOnboardingHtml(data);
  const strategy = renderStrategyHtml(data);

  return {
    content: [
      { type: "text" as const, text: `<!-- PLAYBOOK_HTML -->\n${playbook}` },
      { type: "text" as const, text: `<!-- ONBOARDING_HTML -->\n${onboarding}` },
      { type: "text" as const, text: `<!-- STRATEGY_HTML -->\n${strategy}` },
    ],
  };
}
