import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { ContractData, ContractBlock, ContractSection } from "./contract-types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Design tokens ────────────────────────────────────────────────────

const COLORS = {
  ink: "#0E0D0C",
  muted: "#6B6B6B",
  border: "#D0D0D0",
} as const;

const FONTS = {
  body: "'Archivo', 'Helvetica Neue', Arial, sans-serif",
} as const;

// ── Helpers ──────────────────────────────────────────────────────────

function getLogoBase64(): string {
  const logoPath = resolve(__dirname, "../assets/logo-black.png");
  try {
    return readFileSync(logoPath).toString("base64");
  } catch {
    return "";
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert **bold** markdown to <strong> tags (after escapeHtml) */
function inlineBold(escaped: string): string {
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** Escape HTML then apply inline bold */
function formatText(text: string): string {
  return inlineBold(escapeHtml(text));
}

// ── Block renderers ──────────────────────────────────────────────────

function renderParagraph(text: string): string {
  return `<p style="margin:0 0 4px;line-height:1.38">${formatText(text)}</p>`;
}

function renderBullets(items: string[]): string {
  const lis = items
    .map(
      (item) =>
        `<li style="margin-bottom:0;line-height:1.38;padding-left:2px">${formatText(item)}</li>`
    )
    .join("\n");
  return `<ul style="margin:0 0 5px;padding-left:18px;list-style-type:disc">\n${lis}\n</ul>`;
}

function renderIncludes(items: string[]): string {
  const lis = items
    .map(
      (item) =>
        `<li style="margin-bottom:0;line-height:1.38;padding-left:2px">${formatText(item)}</li>`
    )
    .join("\n");
  return `<ul style="margin:0 0 5px;padding-left:18px;list-style-type:disc">\n${lis}\n</ul>`;
}

function renderExcludes(items: string[]): string {
  const lis = items
    .map(
      (item) =>
        `<li style="margin-bottom:0;line-height:1.38;padding-left:2px">${formatText(item)}</li>`
    )
    .join("\n");
  return `<div style="margin:0 0 4px">
  <p style="margin:0 0 2px;text-decoration:underline">No incluye:</p>
<ul style="margin:0 0 5px;padding-left:18px;list-style-type:disc">
${lis}
</ul>
</div>`;
}

function renderPaymentTable(
  rows: { concept: string; amount: string }[],
  total?: { concept: string; amount: string }
): string {
  const parts: string[] = [];
  parts.push(
    `<table style="width:100%;border-collapse:collapse;margin:3px 0 6px">`
  );
  parts.push(`<tbody>`);

  // Header row
  parts.push(`<tr>
  <td style="padding:3px 6px;font-weight:700">Concepto</td>
  <td style="padding:3px 6px;font-weight:700;text-align:right">Monto</td>
</tr>`);

  for (const r of rows) {
    parts.push(`<tr style="border-bottom:1px solid #EAEAEA">
  <td style="padding:3px 6px">${formatText(r.concept)}</td>
  <td style="padding:3px 6px;text-align:right;white-space:nowrap">${escapeHtml(r.amount)}</td>
</tr>`);
  }

  if (total) {
    parts.push(`<tr>
  <td style="padding:3px 6px;font-weight:700;line-height:1.38">${formatText(total.concept)}</td>
  <td style="padding:3px 6px;text-align:right;font-weight:700;white-space:nowrap">${escapeHtml(total.amount)}</td>
</tr>`);
  }

  parts.push(`</tbody>`);
  parts.push(`</table>`);
  return parts.join("\n");
}

function renderNote(text: string): string {
  return `<p style="margin:0 0 4px;font-style:italic;line-height:1.38">${formatText(text)}</p>`;
}

function renderBlock(block: ContractBlock): string {
  switch (block.type) {
    case "paragraph":
      return renderParagraph(block.text);
    case "bullets":
      return renderBullets(block.items);
    case "includes":
      return renderIncludes(block.items);
    case "excludes":
      return renderExcludes(block.items);
    case "paymentTable":
      return renderPaymentTable(block.rows, block.total);
    case "note":
      return renderNote(block.text);
    default:
      return "";
  }
}

// ── Section renderer ─────────────────────────────────────────────────

function renderSection(section: ContractSection): string {
  const blocks = section.blocks.map(renderBlock).join("\n");

  return `
<div style="margin-bottom:12px;page-break-inside:avoid">
  <h2 style="margin:0 0 3px;font-family:${FONTS.body};font-size:11.5px;font-weight:700;color:${COLORS.ink}">${section.number}. ${escapeHtml(section.title)}</h2>
  <div>
    ${blocks}
  </div>
</div>`;
}

// ── Main renderer ────────────────────────────────────────────────────

export function renderContract(data: ContractData): string {
  const logoB64 = getLogoBase64();
  const logoImg = logoB64
    ? `<img src="data:image/png;base64,${logoB64}" alt="REE" style="height:42px">`
    : `<span style="font-family:${FONTS.body};font-size:34px;font-weight:900;color:${COLORS.ink}">REE</span>`;

  const author = data.header.author ?? "REE Creativos";
  const sectionsHtml = data.sections.map(renderSection).join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Acuerdo Comercial - ${escapeHtml(data.header.clientName)} x REE Growth</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: ${FONTS.body};
    background: #fff;
    color: ${COLORS.ink};
    line-height: 1.38;
    font-size: 10.5px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @media print {
    body { padding: 0; background: #fff; }
    .page { box-shadow: none; margin: 0; max-width: 100%; padding: 0 !important; }
  }

  @page {
    margin: 20mm 20mm;
  }
</style>
</head>
<body>

<div class="page" style="max-width:860px;margin:0 auto;padding:80px 44px 60px;background:#fff">

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
    ${logoImg}
    <div style="text-align:right">
      <div style="font-family:'Archivo Black', ${FONTS.body};font-size:20px;font-weight:900;color:${COLORS.ink};line-height:1.2">${escapeHtml(data.header.serviceTitle)}</div>
      <div style="font-size:12px;color:${COLORS.ink};font-style:italic">Términos y Condiciones</div>
    </div>
  </div>

  <!-- Separator -->
  <hr style="border:none;border-top:1px solid ${COLORS.border};margin:0 0 8px">

  <!-- Client info -->
  <div style="margin-bottom:12px;font-size:10.5px;font-style:italic;line-height:1.3;color:${COLORS.ink}">
    <div>Cliente: ${escapeHtml(data.header.clientName)}</div>
    <div>Responsable: ${escapeHtml(data.header.clientResponsible)}</div>
    <div>Fecha: ${escapeHtml(data.header.date)}</div>
    <div>Autor: ${escapeHtml(author)}</div>
  </div>

  <!-- Sections -->
  ${sectionsHtml}

  <!-- Footer -->
  <div style="border-top:1px solid ${COLORS.ink};margin-top:6px;padding-top:8px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <p style="font-size:9.5px;color:${COLORS.ink}">*Los precios <strong>NO</strong> incluyen IVA</p>
      <p style="font-size:13px;font-weight:700;color:${COLORS.ink};text-align:right">VALOR: ${escapeHtml(data.footerValue ?? data.totalValue)}</p>
    </div>
    <div style="text-align:center">
      <p style="font-family:'Archivo Black', ${FONTS.body};font-size:20px;color:${COLORS.ink};margin-bottom:2px">ESTAMOS PARA CREAR</p>
      <p style="font-size:10px;color:${COLORS.muted}">www.reecreativos.com</p>
    </div>
  </div>

</div>

</body>
</html>`;
}
