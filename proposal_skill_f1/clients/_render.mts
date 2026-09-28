// Helper compartido por los generadores de acuerdo de cada cliente.
// Cada clients/<slug>/gen.mts define sus datos y llama a renderContract().

import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { ContractSection } from "../src/lib/contract-types.js";
import { handler } from "../src/tools/generate-contract.js";

export interface AcuerdoData {
  /** Slug del cliente. Define el nombre del archivo: acuerdo-<slug>.html */
  slug: string;
  clientName: string;
  clientResponsible: string;
  /** Fecha del acuerdo en DD/MM/AAAA. */
  date: string;
  serviceTitle?: string;
  totalValue: string;
  /** Usar cuando el pricing es variable, ej. "USD 650 (primer mes) / USD 500/mes". */
  footerValue?: string;
  sections: ContractSection[];
}

/**
 * Renderiza el acuerdo y lo escribe como acuerdo-<slug>.html junto al
 * gen.mts que lo invoca. `genUrl` debe ser el import.meta.url del generador.
 */
export async function renderContract(data: AcuerdoData, genUrl: string): Promise<string> {
  const res = await handler({
    clientName: data.clientName,
    clientResponsible: data.clientResponsible,
    date: data.date,
    serviceTitle: data.serviceTitle,
    totalValue: data.totalValue,
    footerValue: data.footerValue,
    sections: JSON.stringify(data.sections),
  });

  const html = res.content[0].text;
  if (!/^<!doctype|^<html/i.test(html.trim())) {
    throw new Error(`[${data.slug}] el renderer no devolvio HTML: ${html.slice(0, 200)}`);
  }

  const path = `${dirname(fileURLToPath(genUrl))}/acuerdo-${data.slug}.html`;
  writeFileSync(path, html, "utf8");
  console.log(
    `[${data.slug}] OK -> ${path} (${(html.length / 1024).toFixed(1)} KB, ${data.sections.length} secciones)`,
  );
  return path;
}
