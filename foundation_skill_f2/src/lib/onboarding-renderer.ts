import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { FoundationData, RoadmapInitiative } from "../types/foundation.js";
import { getBaseStyles, escapeHtml, COLORS, FONTS } from "./template-parts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLogoBase64(): string {
  const logoPath = resolve(__dirname, "../assets/logo-white.png");
  try {
    return readFileSync(logoPath).toString("base64");
  } catch {
    return "";
  }
}

function getFaviconTag(): string {
  const faviconPath = resolve(__dirname, "../assets/favicon.jpg");
  try {
    const b64 = readFileSync(faviconPath).toString("base64");
    return `<link rel="icon" type="image/jpeg" href="data:image/jpeg;base64,${b64}">`;
  } catch {
    return "";
  }
}

// ─── Main render ─────────────────────────────────────────────────────

export function renderOnboardingHtml(data: FoundationData): string {
  const styles = getBaseStyles();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KO Call — ${empresa}</title>
${getFaviconTag()}
<style>${styles}
  .step-list {
    list-style: none;
    counter-reset: steps;
    padding: 0;
  }
  .step-list li {
    counter-increment: steps;
    padding: 14px 20px 14px 56px;
    margin-bottom: 8px;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    font-size: 14px;
    position: relative;
  }
  .step-list li::before {
    content: counter(steps);
    position: absolute;
    left: 20px;
    top: 14px;
    font-family: ${FONTS.mono};
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.red};
  }
  .callout {
    padding: 16px 20px;
    border-left: 3px solid ${COLORS.escenario2};
    background: ${COLORS.gapBg};
    font-size: 13px;
    margin: 16px 0;
  }
  .callout-red {
    border-left-color: ${COLORS.red};
    background: #FFF0F0;
  }
  details.ob-section {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    margin-bottom: 24px;
  }
  details.ob-section > summary {
    font-family: ${FONTS.heading};
    font-weight: 700;
    font-size: 20px;
    padding: 24px 32px;
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    user-select: none;
  }
  details.ob-section > summary::-webkit-details-marker { display: none; }
  details.ob-section > summary::after {
    content: "+";
    font-family: ${FONTS.mono};
    font-size: 22px;
    font-weight: 400;
    color: ${COLORS.muted};
    margin-left: auto;
  }
  details.ob-section[open] > summary::after {
    content: "\u2212";
  }
  details.ob-section > .ob-section-body {
    padding: 0 32px 32px;
  }
</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderToc()}
  ${renderVistaGeneral(data)}
  ${renderMetaSetup(data)}
  ${renderAccesos(data)}
  ${renderProximosPasos(data)}
  ${renderFooter()}
</div>
<a href="#top" class="back-to-top" title="Volver arriba"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header (same as internal doc: red bg, white logo) ──────────────

function renderHeader(data: FoundationData): string {
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : null;

  const logoB64 = getLogoBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  return `
  <div class="header" id="top">
    ${logoHtml}
    <div class="header-label">KO CALL</div>
    <div class="header-title">${empresa}<span style="display:inline-block;background:${COLORS.surface};color:${COLORS.red};font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:2px 8px;text-transform:uppercase;letter-spacing:1px;margin-left:12px;vertical-align:middle">Onboarding</span></div>
    <div class="meta-row">
      ${contacto ? `<span>Contacto: ${contacto}</span>` : ""}
      ${data.koCall.fechaPropuesta ? `<span>Fecha: ${escapeHtml(data.koCall.fechaPropuesta)}</span>` : ""}
      ${data.koCall.duracionTotal ? `<span>Duracion: ${escapeHtml(data.koCall.duracionTotal)}</span>` : ""}
    </div>
  </div>`;
}

// ─── TOC ─────────────────────────────────────────────────────────────

function renderToc(): string {
  const items = [
    { id: "vista-general", title: "Vista General", desc: "Que vamos a hacer en esta llamada." },
    { id: "setup-meta", title: "Setup Meta", desc: "Crear Portfolio, Page, Ad Account, conectar Instagram, permisos y tarjeta." },
    { id: "accesos", title: "Accesos", desc: "Credenciales de Tienda Nube para tracking e integraciones." },
    { id: "proximos-pasos", title: "Proximos Pasos", desc: "Que hacemos nosotros esta semana y proxima reunion." },
  ];

  return `
  <div style="background:${COLORS.surface};border:1px solid ${COLORS.border};padding:24px 32px;margin-bottom:24px">
    <ol style="list-style:none;counter-reset:toc;padding:0;margin:0">
      ${items.map((s) => `<li style="counter-increment:toc;margin-bottom:12px"><a href="#${s.id}" style="color:${COLORS.ink};text-decoration:none;font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.red};margin-right:8px;font-weight:600">${String(items.indexOf(s) + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}</a><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Section wrapper ─────────────────────────────────────────────────

function section(num: number, title: string, html: string): string {
  const pad = String(num).padStart(2, "0");
  const ids = ["vista-general", "setup-meta", "accesos", "proximos-pasos"];
  const id = ids[num - 1] || `section-${num}`;
  return `
  <details class="ob-section" id="${id}" open>
    <summary><span class="section-num">${pad}</span>${escapeHtml(title)}</summary>
    <div class="ob-section-body">
      ${html}
    </div>
  </details>`;
}

// ─── 01. Vista General ──────────────────────────────────────────────

function renderVistaGeneral(data: FoundationData): string {
  const ko = data.koCall;
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : "el cliente";
  const parts: string[] = [];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">${contacto}, en esta llamada vamos a configurar juntos todo lo necesario para arrancar a trabajar con tu marca. Al final, dejamos agendada la proxima reunion.</p>`);

  // Timeline bar
  if (ko.etapas.length) {
    parts.push(`<div style="display:flex;gap:3px;margin-bottom:24px">`);
    for (let i = 0; i < ko.etapas.length; i++) {
      const etapa = ko.etapas[i];
      const isEdge = i === 0 || i === ko.etapas.length - 1;
      const bg = isEdge ? COLORS.red : COLORS.slate;
      parts.push(`<div style="flex:1;background:${bg};color:${COLORS.surface};padding:12px 16px;text-align:center">`);
      parts.push(`<div style="font-family:${FONTS.heading};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(etapa.nombre)}</div>`);
      if (etapa.duracion) {
        parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;color:rgba(255,255,255,0.55);margin-top:3px">${escapeHtml(etapa.duracion)}</div>`);
      }
      parts.push(`</div>`);
    }
    parts.push(`</div>`);

    // Etapa descriptions
    for (let i = 0; i < ko.etapas.length; i++) {
      const etapa = ko.etapas[i];
      const isEdge = i === 0 || i === ko.etapas.length - 1;
      const color = isEdge ? COLORS.red : COLORS.slate;
      parts.push(`<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">`);
      parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;font-weight:700;padding:3px 8px;background:${color};color:${COLORS.surface};flex-shrink:0">${i + 1}</span>`);
      parts.push(`<div>`);
      parts.push(`<div style="font-family:${FONTS.heading};font-weight:700;font-size:14px;margin-bottom:2px">${escapeHtml(etapa.nombre)}</div>`);
      parts.push(`<div style="font-size:13px;color:${COLORS.muted};line-height:1.5">${escapeHtml(etapa.objetivo)}</div>`);
      parts.push(`</div></div>`);
    }
  }

  return section(1, "Vista General", parts.join("\n"));
}

// ─── 02. Setup Meta ─────────────────────────────────────────────────

function renderMetaSetup(data: FoundationData): string {
  const parts: string[] = [];
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : "el cliente";

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Vamos a crear tu presencia publicitaria en Meta. Vos sos el titular de todo: nosotros recibimos permisos de administrador para operar.</p>`);

  // Paso a paso unificado
  const pasos = [
    "Ingresa a facebook.com con tu cuenta personal de Facebook.",
    "Crea una Facebook Page para tu marca: nombre, categoria, descripcion y foto de perfil.",
    "Crea tu Business Portfolio (nombre de tu marca) en business.facebook.com.",
    "Crea una cuenta publicitaria dentro de tu Business Portfolio.",
    "Conecta tu cuenta de Instagram (@defu.tofuco) al Business Portfolio.",
    "Conecta la Facebook Page al Business Portfolio.",
    "Asigna permisos de administrador a growth@reecreativos.com (sobre Portfolio, Page, Instagram y Ad Account).",
    "Defini la moneda de la cuenta publicitaria: USD (recomendado) o ARS.",
    "Agrega tu tarjeta de pago a la cuenta publicitaria.",
  ];

  parts.push(`<ol class="step-list">`);
  for (const paso of pasos) {
    parts.push(`<li>${escapeHtml(paso)}</li>`);
  }
  parts.push(`</ol>`);

  const iconCurrency = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`;
  const iconCheck = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

  // Callout moneda
  parts.push(`<div class="callout callout-red" style="margin-top:20px">`);
  parts.push(`${iconCurrency}<strong>Moneda USD vs ARS:</strong> Si tu tarjeta es en pesos argentinos, Meta cobra ~40% de impuestos sobre el gasto en USD. Recomendamos usar una tarjeta internacional en dolares (ej. ARQ o cualquier tarjeta que acepte pagos internacionales).`);
  parts.push(`</div>`);

  // Verificacion
  parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.escenario1};margin-top:12px;font-size:13px">`);
  parts.push(`${iconCheck}<strong>Verificacion:</strong> Una vez completados los pasos, nosotros ingresamos con growth@reecreativos.com y verificamos que tenemos acceso completo a Portfolio, Page, Instagram y Ad Account.`);
  parts.push(`</div>`);

  return section(2, "Setup Meta", parts.join("\n"));
}

// ─── 03. Accesos ────────────────────────────────────────────────────

function renderAccesos(data: FoundationData): string {
  const parts: string[] = [];
  const ap = data.requerimientosCliente.accesoPlataforma;

  if (ap) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">${escapeHtml(ap.descripcion)}</p>`);

    parts.push(`<ol class="step-list">`);
    parts.push(`<li>Compartinos tu email o usuario de ${escapeHtml(ap.nombrePlataforma)}.</li>`);
    parts.push(`<li>Compartinos tu contrasena de ${escapeHtml(ap.nombrePlataforma)}.</li>`);
    parts.push(`</ol>`);

    const iconCheck = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.escenario1};margin-top:20px;font-size:13px">`);
    parts.push(`${iconCheck}<strong>Verificacion:</strong> Ingresamos con las credenciales y verificamos que tenemos acceso admin al panel de ${escapeHtml(ap.nombrePlataforma)}.`);
    parts.push(`</div>`);
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">No se requieren accesos adicionales a plataformas.</p>`);
  }

  return section(3, "Accesos", parts.join("\n"));
}

// ─── 04. Proximos Pasos ─────────────────────────────────────────────

function renderProximosPasos(data: FoundationData): string {
  const parts: string[] = [];
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : "el cliente";

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">${contacto}, con todo configurado hoy, nosotros arrancamos a trabajar en lo siguiente:</p>`);

  const pasos = [
    "Integrar Meta Ads y Tienda Nube en REE Metrics para tener toda la data centralizada",
    "Configurar los KPIs que vamos a medir en la plataforma",
    "Armar la estructura de campanas y audiencias en Meta Ads",
    "Definir los creativos para la campana de Awareness",
    "Definir los angulos de venta para la campana B2C (se presentan en la Foundation Review)",
  ];

  parts.push(`<ul style="list-style:none;padding:0">`);
  for (const paso of pasos) {
    parts.push(`<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">`);
    parts.push(`<span style="color:${COLORS.red};font-size:10px;margin-top:5px;flex-shrink:0">&#9632;</span>`);
    parts.push(`<span style="font-size:14px;line-height:1.5">${escapeHtml(paso)}</span>`);
    parts.push(`</div>`);
  }
  parts.push(`</ul>`);

  // Gantt roadmap (milestones below as a separate row)
  if (data.roadmap && data.roadmap.length) {
    const fechaISO = data.datosF1?.fechaInicioISO ?? null;
    const milestones: GanttMilestone[] = [{ semana: 1, label: "KO Call", fecha: "25/08" }];
    if (data.koCall.proximaReunion) {
      milestones.push({ semana: 3, label: "Foundation Review", fecha: "03/09" });
    }
    milestones.push({ semana: 5, label: "Call ADS", fecha: "18/09" });
    milestones.push({ semana: 7, label: "Call ADS", fecha: "02/10" });
    milestones.push({ semana: 8, label: "Call Review ADS", fecha: "15/10" });
    parts.push(`<div style="margin-top:32px">`);
    parts.push(`<h3>Roadmap</h3>`);
    parts.push(renderGantt(data.roadmap, fechaISO, milestones));
    parts.push(`</div>`);
  }

  // Proxima reunion (compact)
  if (data.koCall.proximaReunion) {
    const pr = data.koCall.proximaReunion;
    const iconCal = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

    parts.push(`<div style="background:${COLORS.slate};color:${COLORS.surface};padding:24px;margin-top:32px;border-left:4px solid ${COLORS.escenario1}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:8px">${iconCal}Proxima Reunion</div>`);
    parts.push(`<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">`);
    parts.push(`<div style="font-family:${FONTS.heading};font-size:18px;font-weight:700">${escapeHtml(pr.nombre)}</div>`);
    if (pr.fechaTentativa) {
      parts.push(`<div style="font-family:${FONTS.mono};font-size:13px;color:rgba(255,255,255,0.6)">${escapeHtml(pr.fechaTentativa)}</div>`);
    }
    parts.push(`</div>`);
    parts.push(`</div>`);

    if (pr.objetivos.length) {
      parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-top:0">`);
      parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px">Que vamos a ver</div>`);
      for (const obj of pr.objetivos) {
        parts.push(`<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px">`);
        parts.push(`<span style="color:${COLORS.escenario1};font-size:10px;margin-top:5px;flex-shrink:0">&#9632;</span>`);
        parts.push(`<span style="font-size:13px;line-height:1.5">${escapeHtml(obj)}</span>`);
        parts.push(`</div>`);
      }
      parts.push(`</div>`);
    }
  }

  // Contacto
  const iconWa = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${COLORS.escenario1}" style="vertical-align:middle;margin-right:8px;flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-top:24px;font-size:13px;display:flex;align-items:center">`);
  parts.push(`${iconWa}<span>Si tenes alguna duda, escribinos al grupo de WhatsApp.</span>`);
  parts.push(`</div>`);

  return section(4, "Proximos Pasos", parts.join("\n"));
}

// ─── Gantt helpers ───────────────────────────────────────────────────

function computeWeekDateRanges(fechaInicioISO: string): Array<{ start: string; end: string }> {
  const base = new Date(fechaInicioISO + "T00:00:00");
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ranges: Array<{ start: string; end: string }> = [];
  for (let w = 0; w < 8; w++) {
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    ranges.push({ start: fmt(weekStart), end: fmt(weekEnd) });
  }
  return ranges;
}

function computeCurrentWeek(fechaInicioISO: string): number {
  const start = new Date(fechaInicioISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0;
  const week = Math.floor(diffDays / 7) + 1;
  return week > 8 ? 0 : week;
}

interface GanttMilestone {
  semana: number;
  label: string;
  fecha: string;
}

function renderGantt(roadmap: RoadmapInitiative[], fechaInicioISO?: string | null, milestones?: GanttMilestone[]): string {
  if (!roadmap.length) return "";

  const weeks = [1, 2, 3, 4, 5, 6, 7, 8];
  const faseColors: Record<string, string> = {
    Foundation: COLORS.slate,
    Build: COLORS.escenario2,
    Launch: COLORS.red,
    Scale: COLORS.escenario1,
  };

  const weekRanges = fechaInicioISO ? computeWeekDateRanges(fechaInicioISO) : [];
  const currentWeek = fechaInicioISO ? computeCurrentWeek(fechaInicioISO) : 0;
  const totalWeeks = 8;
  const cols = `200px repeat(${totalWeeks}, 1fr)`;
  const cellBorder = "border-left:1px solid rgba(14,13,12,0.08)";
  const currentBg = `background:rgba(221,5,19,0.06)`;

  const parts: string[] = [];
  parts.push(`<div style="border:1px solid rgba(14,13,12,0.18);background:rgba(14,13,12,0.02)">`);

  // Week headers
  parts.push(`<div style="display:grid;grid-template-columns:${cols};border-bottom:1px solid rgba(14,13,12,0.12)">`);
  parts.push(`<div style="padding:12px 20px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${COLORS.muted};text-transform:uppercase"></div>`);
  for (let i = 0; i < weeks.length; i++) {
    const isCurrent = currentWeek === weeks[i];
    parts.push(`<div style="padding:10px 0;text-align:center;font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${isCurrent ? COLORS.red : COLORS.muted};${cellBorder};${isCurrent ? currentBg : ""}">`);
    parts.push(`S${weeks[i]}`);
    if (weekRanges.length) {
      parts.push(`<div style="font-size:9px;font-weight:400;color:${COLORS.muted};margin-top:2px">${weekRanges[i].start}</div>`);
      parts.push(`<div style="font-size:9px;font-weight:400;color:${COLORS.muted}">${weekRanges[i].end}</div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  // Initiative rows
  for (let r = 0; r < roadmap.length; r++) {
    const init = roadmap[r];
    const isLast = r === roadmap.length - 1;

    const weekMap: Record<number, string> = {};
    for (const fase of init.fases) {
      for (let w = fase.semanaInicio; w <= fase.semanaFin; w++) {
        weekMap[w] = fase.nombre;
      }
    }

    parts.push(`<div style="display:grid;grid-template-columns:${cols};${isLast ? "" : "border-bottom:1px solid rgba(14,13,12,0.08);"}">`);
    parts.push(`<div style="padding:14px 20px;font-family:${FONTS.heading};font-weight:700;font-size:11px;text-transform:uppercase;display:flex;align-items:center">${escapeHtml(init.nombre)}</div>`);

    for (const w of weeks) {
      const faseName = weekMap[w];
      const isCurrent = currentWeek === w;

      if (!faseName) {
        parts.push(`<div style="padding:14px 3px;${cellBorder};${isCurrent ? currentBg : ""}"></div>`);
      } else {
        const color = faseColors[faseName] || COLORS.slate;
        const prevFase = w > 1 ? weekMap[w - 1] : undefined;
        const nextFase = w < 8 ? weekMap[w + 1] : undefined;
        const isFirst = prevFase !== faseName;
        const isLastBar = nextFase !== faseName;

        const allActive = weeks.filter((wk) => weekMap[wk]);
        const isRowFirst = w === allActive[0];
        const isRowLast = w === allActive[allActive.length - 1];

        const radius = isRowFirst && isRowLast ? "4px" : isRowFirst ? "4px 0 0 4px" : isRowLast ? "0 4px 4px 0" : "0";
        const ml = isFirst && !isRowFirst ? "1px" : isRowFirst ? "0" : "-3px";
        const mr = isLastBar && !isRowLast ? "1px" : isRowLast ? "0" : "-3px";
        const separator = isFirst && prevFase && prevFase !== faseName ? `border-left:2px solid rgba(255,255,255,0.5)` : "";

        parts.push(`<div style="padding:14px 3px;${cellBorder};display:flex;align-items:center;${isCurrent ? currentBg : ""}">`);
        parts.push(`<div style="width:100%;height:28px;background:${color};border-radius:${radius};margin-left:${ml};margin-right:${mr};display:flex;align-items:center;justify-content:center;${separator}">`);
        if (isFirst) {
          parts.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.06em;color:rgba(255,255,255,0.9);text-transform:uppercase;white-space:nowrap;overflow:hidden">${escapeHtml(faseName)}</span>`);
        }
        parts.push(`</div></div>`);
      }
    }

    parts.push(`</div>`);
  }

  // Milestone row (below campaigns, compact)
  if (milestones && milestones.length) {
    parts.push(`<div style="display:grid;grid-template-columns:${cols};border-top:1px solid rgba(14,13,12,0.12)">`);
    parts.push(`<div style="padding:8px 20px"></div>`);
    for (const w of weeks) {
      const ms = milestones.find((m) => m.semana === w);
      const isCurrent = currentWeek === w;
      if (ms) {
        parts.push(`<div style="padding:6px 2px;${cellBorder};text-align:center;${isCurrent ? currentBg : ""}">`);
        parts.push(`<div style="font-family:${FONTS.mono};font-size:8px;font-weight:700;letter-spacing:0.5px;color:${COLORS.red};text-transform:uppercase;white-space:nowrap">${escapeHtml(ms.label)}</div>`);
        parts.push(`<div style="font-family:${FONTS.mono};font-size:8px;color:${COLORS.muted};margin-top:1px">${escapeHtml(ms.fecha)}</div>`);
        parts.push(`</div>`);
      } else {
        parts.push(`<div style="padding:6px 2px;${cellBorder};${isCurrent ? currentBg : ""}"></div>`);
      }
    }
    parts.push(`</div>`);
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado por REE Creativos
  </div>`;
}
