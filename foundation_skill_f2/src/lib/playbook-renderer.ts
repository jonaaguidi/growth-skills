import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type {
  FoundationData,
  CheckGroup,
  EdgeCase,
  RoadmapInitiative,
} from "../types/foundation.js";
import { getBaseStyles, escapeHtml, COLORS, FONTS } from "./template-parts.js";
import { META_BUSINESS_GUIDE, NOTA_PAUTA } from "./meta-business-guide.js";

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

// ─── Section registry ────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  desc: string;
  html: string;
  open: boolean;
}

function buildSections(data: FoundationData): Section[] {
  const sections: Section[] = [];

  // 01. Setup Interno
  sections.push({
    id: "setup-interno",
    title: "Setup Interno",
    desc: "Timeline, resumen de propuesta y primeros pasos post-cierre.",
    html: renderSetupInternoBody(data),
    open: true,
  });

  // 02. Configuracion y Accesos (Meta + integraciones + requerimientos)
  sections.push({
    id: "configuracion-onboarding",
    title: "Configuracion y Onboarding",
    desc: "Meta Ads, integraciones de plataforma y accesos del cliente.",
    html: renderConfiguracionAccesosBody(data),
    open: true,
  });

  // 03. KO Call (Foundation)
  sections.push({
    id: "ko-call",
    title: "KO Call (Foundation)",
    desc: "Onboarding del cliente, accesos, estrategia y proximos pasos.",
    html: renderKOCallBody(data),
    open: true,
  });

  // 04. Roadmap de Ejecucion
  sections.push({
    id: "roadmap",
    title: "Roadmap de Ejecucion",
    desc: "Gantt 8 semanas, hitos y entregables por fase.",
    html: renderRoadmapBody(data),
    open: true,
  });

  // 05. Estrategia (Foundation)
  sections.push({
    id: "estrategia",
    title: "Estrategia (Foundation)",
    desc: "Palanca, ICP, oferta, calificacion de leads, KPIs y presupuesto.",
    html: renderEstrategiaBody(data),
    open: true,
  });

  // 06. Ejecucion (Build/Launch)
  sections.push({
    id: "ejecucion",
    title: "Ejecucion (Build/Launch)",
    desc: "Creativos, arquitectura de campanas, tracking y lanzamiento.",
    html: renderEjecucionBody(data),
    open: true,
  });

  // 07. Scale
  sections.push({
    id: "scale",
    title: "Scale",
    desc: "Optimizacion continua, reporting y crecimiento a largo plazo.",
    html: renderScaleBody(data),
    open: true,
  });

  // 08. Notas
  if (data.notas) {
    sections.push({
      id: "notas",
      title: "Notas",
      desc: "Contexto adicional, bloqueantes y observaciones.",
      html: renderNotasBody(data),
      open: true,
    });
  }

  return sections;
}

// ─── Main render ─────────────────────────────────────────────────────

export function renderPlaybookHtml(data: FoundationData): string {
  const styles = getBaseStyles();
  const sections = buildSections(data);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Foundation F2 — ${escapeHtml(data.clientInfo.nombreEmpresa)}</title>
${getFaviconTag()}
<style>${styles}</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderToc(sections)}
  ${sections.map((s, i) => renderSection(s, i + 1)).join("\n")}
  ${renderFooter()}
</div>
<a href="#indice" class="back-to-top" title="Volver al indice"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header ──────────────────────────────────────────────────────────

function renderHeader(data: FoundationData): string {
  const { clientInfo } = data;
  const empresa = escapeHtml(clientInfo.nombreEmpresa);
  const contacto = clientInfo.nombreContacto ? escapeHtml(clientInfo.nombreContacto) : null;
  const fecha = clientInfo.fechaCierre ? escapeHtml(clientInfo.fechaCierre) : null;
  const web = clientInfo.sitioWeb ? escapeHtml(clientInfo.sitioWeb) : null;

  const logoB64 = getLogoBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  return `
  <div class="header">
    ${logoHtml}
    <div class="header-label">FOUNDATION FASE 2</div>
    <div class="header-title">${empresa}<span class="badge-interno">INTERNO</span></div>
    <div class="meta-row">
      ${contacto ? `<span>Contacto: ${contacto}</span>` : ""}
      ${fecha ? `<span>Fecha cierre: ${fecha}</span>` : ""}
      ${web ? `<span>Web: <a href="https://${web}" target="_blank" style="color:rgba(255,255,255,0.7);text-decoration:underline">${web}</a></span>` : ""}
      ${clientInfo.industria ? `<span>Industria: ${escapeHtml(clientInfo.industria)}</span>` : ""}
    </div>
    <div class="header-confidencial">Documento confidencial para uso interno del equipo de REE Creativos. No compartir con el cliente.</div>
  </div>`;
}

// ─── TOC ─────────────────────────────────────────────────────────────

function renderToc(sections: Section[]): string {
  return `
  <div class="toc" id="indice">
    <h2>Playbook Foundation</h2>
    <ol>
      ${sections.map((s) => `<li><a href="#${s.id}">${escapeHtml(s.title)}</a><div class="toc-desc">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Section wrapper ─────────────────────────────────────────────────

function renderSection(s: Section, num: number): string {
  const pad = String(num).padStart(2, "0");
  return `
  <details class="collapsible" id="${s.id}"${s.open ? " open" : ""} style="margin-bottom:24px">
    <summary><span class="section-num">${pad}</span>${escapeHtml(s.title)}</summary>
    <div class="section-body">
      ${s.html}
    </div>
  </details>`;
}

// ─── Shared: CheckGroup renderer ─────────────────────────────────────

function renderCheckGroup(group: CheckGroup): string {
  const total = group.items.length;
  const done = group.items.filter((i) => i.status === "hecho").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const parts: string[] = [];
  parts.push(`<div class="checklist-group">`);
  parts.push(`<h4 style="margin-bottom:8px">${escapeHtml(group.titulo)}</h4>`);
  parts.push(`<div class="checklist-progress"><div class="checklist-progress-fill" style="width:${pct}%"></div></div>`);

  for (let idx = 0; idx < group.items.length; idx++) {
    const item = group.items[idx];
    parts.push(`<div class="checklist-item">`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:600;color:${statusColor(item.status)};width:24px;flex-shrink:0;text-align:center;margin-top:2px">${idx + 1}</span>`);
    parts.push(`<div class="checklist-label">${escapeHtml(item.label)}`);
    if (item.notas) {
      parts.push(`<div class="checklist-notes">${escapeHtml(item.notas)}</div>`);
    }
    parts.push(`</div>`);
    parts.push(`<span class="checklist-badge" style="color:${statusColor(item.status)}">${escapeHtml(item.status.toUpperCase())}</span>`);
    parts.push(`</div>`);
  }

  parts.push(`</div>`);
  return parts.join("\n");
}

function statusColor(status: string): string {
  switch (status) {
    case "hecho": return COLORS.escenario1;
    case "pendiente": return COLORS.escenario2;
    case "bloqueado": return COLORS.escenario3;
    default: return COLORS.muted;
  }
}

// ─── Shared: Edge case renderer ──────────────────────────────────────

function renderEdgeCase(ec: EdgeCase): string {
  return `
    <div class="edge-case${ec.aplica ? " activo" : ""}" style="padding:12px 16px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <strong style="font-size:13px">${escapeHtml(ec.condicion)}</strong>
        ${ec.aplica ? `<span class="edge-case-badge" style="margin:0;font-size:10px">APLICA</span>` : ""}
      </div>
      <div class="edge-case-instrucciones" style="font-size:12px;color:${COLORS.muted};line-height:1.5;margin-top:0">
        ${escapeHtml(ec.instrucciones)}
      </div>
    </div>`;
}

// ─── Shared: Gantt renderer ──────────────────────────────────────────

function computeWeekDates(fechaInicioISO: string): string[] {
  const start = new Date(fechaInicioISO + "T00:00:00");
  const dates: string[] = [];
  for (let w = 0; w < 8; w++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + w * 7);
    const dd = String(weekStart.getDate()).padStart(2, "0");
    const mm = String(weekStart.getMonth() + 1).padStart(2, "0");
    dates.push(`${dd}/${mm}`);
  }
  return dates;
}

function computePhaseDateRange(roadmap: RoadmapInitiative[], phaseName: string, fechaInicioISO: string): string {
  const start = new Date(fechaInicioISO + "T00:00:00");
  let minWeek = 999;
  let maxWeek = 0;
  for (const init of roadmap) {
    for (const fase of init.fases) {
      if (fase.nombre === phaseName) {
        if (fase.semanaInicio < minWeek) minWeek = fase.semanaInicio;
        if (fase.semanaFin > maxWeek) maxWeek = fase.semanaFin;
      }
    }
  }
  if (minWeek > maxWeek) return "";
  const phaseStart = new Date(start);
  phaseStart.setDate(start.getDate() + (minWeek - 1) * 7);
  const phaseEnd = new Date(start);
  phaseEnd.setDate(start.getDate() + maxWeek * 7 - 1);
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(phaseStart)} - ${fmt(phaseEnd)}`;
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

  const weekDates = fechaInicioISO ? computeWeekDates(fechaInicioISO) : [];
  const currentWeek = fechaInicioISO ? computeCurrentWeek(fechaInicioISO) : 0;
  const totalWeeks = 8;
  const cols = `200px repeat(${totalWeeks}, 1fr)`;
  const cellBorder = "border-left:1px solid rgba(14,13,12,0.08)";
  const currentBg = `background:rgba(221,5,19,0.06)`;

  const parts: string[] = [];
  parts.push(`<div style="border:1px solid rgba(14,13,12,0.18);background:rgba(14,13,12,0.02)">`);

  // Week headers
  parts.push(`<div style="display:grid;grid-template-columns:${cols};border-bottom:1px solid rgba(14,13,12,0.12)">`);
  parts.push(`<div style="padding:12px 20px;font-family:${FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${COLORS.muted};text-transform:uppercase">Iniciativa</div>`);
  for (let i = 0; i < weeks.length; i++) {
    const isCurrent = currentWeek === weeks[i];
    parts.push(`<div style="padding:10px 0;text-align:center;font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${isCurrent ? COLORS.red : COLORS.muted};${cellBorder};${isCurrent ? currentBg : ""}">`);
    if (isCurrent) {
      parts.push(`<div style="font-size:9px;font-weight:700;color:${COLORS.red};letter-spacing:1px;margin-bottom:1px">HOY</div>`);
    }
    parts.push(`S${weeks[i]}`);
    if (weekDates.length) {
      parts.push(`<div style="font-size:9px;font-weight:400;color:${COLORS.muted};margin-top:2px">${weekDates[i]}</div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  // Milestone row (if any)
  if (milestones && milestones.length) {
    const msMap: Record<number, string> = {};
    for (const ms of milestones) msMap[ms.semana] = ms.label;

    parts.push(`<div style="display:grid;grid-template-columns:${cols};border-bottom:1px solid rgba(14,13,12,0.08)">`);
    parts.push(`<div style="padding:8px 20px;font-family:${FONTS.mono};font-size:10px;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.08em;display:flex;align-items:center">Hitos</div>`);
    for (const w of weeks) {
      const isCurrent = currentWeek === w;
      const msLabel = msMap[w];
      parts.push(`<div style="padding:6px 3px;${cellBorder};text-align:center;${isCurrent ? currentBg : ""}">`);
      if (msLabel) {
        parts.push(`<span style="font-family:${FONTS.mono};font-size:9px;font-weight:700;padding:3px 8px;background:${COLORS.red};color:${COLORS.surface};text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(msLabel)}</span>`);
      }
      parts.push(`</div>`);
    }
    parts.push(`</div>`);
  }

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
    parts.push(`<div style="padding:14px 20px;font-family:${FONTS.heading};font-weight:700;font-size:13px;text-transform:uppercase;display:flex;align-items:center">${escapeHtml(init.nombre)}</div>`);

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

        // Find overall first/last colored cell in this row
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

  parts.push(`</div>`);
  return parts.join("\n");
}

// ─── 01. Setup Interno ───────────────────────────────────────────────

function renderSetupInternoBody(data: FoundationData): string {
  const parts: string[] = [];

  // Resumen de propuesta con timeline
  if (data.datosF1) {
    const f1 = data.datosF1;

    // SVG icons
    const iconCalendar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    const iconFee = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`;
    const iconPauta = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>`;
    const iconCanales = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`;
    const iconCampanas = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

    // Timeline prominente
    if (f1.fechaInicio || f1.fechaFin) {
      parts.push(`<div style="background:${COLORS.slate};color:${COLORS.surface};padding:24px;margin-bottom:36px;border-left:4px solid ${COLORS.red}">`);
      parts.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:12px">${iconCalendar}Timeline del proyecto</div>`);
      parts.push(`<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">`);
      if (f1.fechaInicio) {
        parts.push(`<div><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px">Inicio</div><div style="font-family:${FONTS.heading};font-size:20px;font-weight:700">${escapeHtml(f1.fechaInicio)}</div></div>`);
      }
      if (f1.fechaInicio && f1.fechaFin) {
        parts.push(`<div style="font-family:${FONTS.mono};font-size:18px;color:${COLORS.red};flex-shrink:0">&rarr;</div>`);
      }
      if (f1.fechaFin) {
        parts.push(`<div><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-bottom:4px">Fin</div><div style="font-family:${FONTS.heading};font-size:20px;font-weight:700">${escapeHtml(f1.fechaFin)}</div></div>`);
      }
      if (f1.duracionProyecto) {
        parts.push(`<div style="margin-left:auto;font-family:${FONTS.mono};font-size:12px;padding:6px 14px;background:${COLORS.red};color:${COLORS.surface};font-weight:600">${escapeHtml(f1.duracionProyecto)}</div>`);
      }
      parts.push(`</div></div>`);
    }

    // Datos clave en grid compacto
    parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:36px">`);

    if (f1.inversionMensual) {
      parts.push(`<div style="padding:16px 20px;border:1px solid ${COLORS.border}"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:6px">${iconFee}Fee</div><div style="font-size:15px;font-weight:700">${escapeHtml(f1.inversionMensual)}</div></div>`);
    }
    if (f1.presupuestoPauta) {
      parts.push(`<div style="padding:16px 20px;border:1px solid ${COLORS.border}"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:6px">${iconPauta}Pauta</div><div style="font-size:15px;font-weight:700">${escapeHtml(f1.presupuestoPauta)}</div></div>`);
    }

    parts.push(`</div>`);

    // Canales y campanas
    if (f1.canalesRecomendados.length) {
      parts.push(`<div style="margin-bottom:24px"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px">${iconCanales}Canales</div><div style="display:flex;gap:8px;flex-wrap:wrap">${f1.canalesRecomendados.map((c) => `<span class="canal-chip">${escapeHtml(c)}</span>`).join("")}</div></div>`);
    }

    if (f1.campanasVendidas.length) {
      parts.push(`<div style="margin-bottom:0"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px">${iconCampanas}Campanas</div><div style="display:flex;gap:8px;flex-wrap:wrap">${f1.campanasVendidas.map((c) => `<span class="kpi-chip">${escapeHtml(c)}</span>`).join("")}</div></div>`);
    }
  }

  // Primeros Pasos Post-Cierre
  parts.push(`<hr class="section-divider">`);
  parts.push(renderCheckGroup(data.grupoWhatsApp));

  return parts.join("\n");
}

// ─── 02. Configuracion y Accesos ─────────────────────────────────────

function renderConfiguracionAccesosBody(data: FoundationData): string {
  const mb = data.metaBusiness;
  const r = data.requerimientosCliente;
  const parts: string[] = [];

  // --- Meta Ads ---
  parts.push(`<h3>Meta Ads</h3>`);

  // Principio: el cliente es dueno de su data
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : empresa;
  parts.push(`<div style="background:${COLORS.slate};color:${COLORS.surface};padding:20px;margin-bottom:20px;border-left:4px solid ${COLORS.red};font-size:13px;line-height:1.65">`);
  parts.push(`<strong style="color:${COLORS.surface}">El cliente es dueno de su data.</strong> El Business Portfolio y la cuenta publicitaria se crean junto con ${contacto} durante la KO Call. ${empresa} es el titular de todos sus activos en Meta. REE recibe permisos de administrador para operar.`);
  parts.push(`</div>`);

  const slug = data.clientInfo.slug || data.clientInfo.nombreEmpresa;
  parts.push(`
    <div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-bottom:24px;font-family:${FONTS.mono};font-size:13px">
      <div style="margin-bottom:4px"><strong>Titular:</strong> ${contacto} (${empresa})</div>
      <div style="margin-bottom:8px;font-size:12px;color:${COLORS.muted}">REE accede como admin via ${escapeHtml(mb.cuentaMaestra)}</div>
      <div style="padding-left:20px;border-left:2px solid ${COLORS.border}">
        <div style="padding:4px 0">|-- ${escapeHtml(slug)} - Business Portfolio</div>
        <div style="padding:4px 0">|-- ${escapeHtml(slug)} - Facebook Page</div>
        <div style="padding:4px 0">|-- ${escapeHtml(slug)} - Instagram</div>
        <div style="padding:4px 0">|-- ${escapeHtml(slug)} - Ad Account</div>
        <div style="padding:4px 0">|-- ${escapeHtml(slug)} - Pixel</div>
      </div>
    </div>`);

  // Checklist unificada de Meta: aplanar todos los CheckGroups en uno solo
  const allMetaItems = [
    ...mb.businessPortfolio.items,
    ...mb.facebookPage.items,
    ...mb.instagramBusiness.items,
    ...mb.adAccount.items,
    ...mb.pixel.items,
    ...mb.capi.items,
  ];

  const metaUnifiedGroup: CheckGroup = {
    titulo: "Checklist Meta Ads",
    items: allMetaItems,
  };
  parts.push(renderCheckGroup(metaUnifiedGroup));


  // --- Acceso a plataforma ---
  const ap = r.accesoPlataforma;
  if (ap) {
    parts.push(`<hr class="section-divider">`);
    const platformGroup: CheckGroup = {
      titulo: ap.nombrePlataforma,
      items: ap.items,
    };
    parts.push(renderCheckGroup(platformGroup));
    parts.push(`<div style="padding:12px 16px;background:${COLORS.bg};border:1px solid ${COLORS.border};font-size:13px;margin-top:8px;margin-bottom:24px">${escapeHtml(ap.descripcion)}</div>`);
  }

  // --- Edge Cases ---
  if (mb.edgeCases.length) {
    parts.push(`<hr class="section-divider">`);
    parts.push(`<h3>Edge Cases</h3>`);
    for (const ec of mb.edgeCases) {
      parts.push(renderEdgeCase(ec));
    }
  }

  return parts.join("\n");
}

// ─── 04. KO Call ─────────────────────────────────────────────────────

function renderKOCallBody(data: FoundationData): string {
  const ko = data.koCall;
  const parts: string[] = [];

  const iconCalendar = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

  // --- Date + duration header ---
  if (ko.fechaPropuesta) {
    parts.push(`<div style="background:${COLORS.slate};color:${COLORS.surface};padding:24px;margin-bottom:24px;border-left:4px solid ${COLORS.red};display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">`);
    parts.push(`<div>`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:8px">${iconCalendar}Fecha KO Call</div>`);
    parts.push(`<div style="font-family:${FONTS.heading};font-size:20px;font-weight:700">${escapeHtml(ko.fechaPropuesta)}</div>`);
    parts.push(`</div>`);
    if (ko.duracionTotal) {
      parts.push(`<div style="font-family:${FONTS.mono};font-size:12px;padding:6px 14px;background:${COLORS.red};color:${COLORS.surface};font-weight:600">${escapeHtml(ko.duracionTotal)}</div>`);
    }
    parts.push(`</div>`);
  } else {
    parts.push(`<div class="var-card sin-dato" style="margin-bottom:24px"><div class="var-card-header"><div class="var-card-title">Fecha KO Call</div><span class="var-status-missing"></span></div><div class="var-card-body"><span class="badge-sin-dato">PENDIENTE DE DEFINICION</span></div></div>`);
  }

  // --- Vista General: timeline bar ---
  if (ko.etapas.length) {
    parts.push(`<h3>Vista General</h3>`);

    // Timeline bar
    parts.push(`<div style="display:flex;gap:3px;margin-bottom:16px">`);
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
  }

  // --- Table: ETAPA / OBJETIVO / OUTPUT ---
  if (ko.etapas.length) {
    parts.push(`<table>`);
    parts.push(`<thead><tr><th>Etapa</th><th>Objetivo</th><th>Output</th></tr></thead>`);
    parts.push(`<tbody>`);
    for (let i = 0; i < ko.etapas.length; i++) {
      const etapa = ko.etapas[i];
      const isEdge = i === 0 || i === ko.etapas.length - 1;
      const badgeBg = isEdge ? COLORS.red : COLORS.slate;
      parts.push(`<tr>`);
      parts.push(`<td style="white-space:nowrap;vertical-align:top"><span style="display:inline-block;font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 8px;background:${badgeBg};color:${COLORS.surface};margin-right:6px">${i + 1}</span>${escapeHtml(etapa.nombre)}</td>`);
      parts.push(`<td style="font-size:13px">${escapeHtml(etapa.objetivo)}</td>`);
      parts.push(`<td style="font-size:13px;color:${COLORS.muted}">${escapeHtml(etapa.output)}</td>`);
      parts.push(`</tr>`);
    }
    parts.push(`</tbody></table>`);
  }

  // --- Proxima Reunion ---
  if (ko.proximaReunion) {
    const pr = ko.proximaReunion;

    const iconCal = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
    parts.push(`<div style="background:${COLORS.slate};color:${COLORS.surface};padding:24px;margin-top:36px;border-left:4px solid ${COLORS.escenario1}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:8px">${iconCal}Proxima Reunion</div>`);
    parts.push(`<div style="font-family:${FONTS.heading};font-size:18px;font-weight:700;margin-bottom:4px">${escapeHtml(pr.nombre)}</div>`);
    if (pr.fechaTentativa) {
      parts.push(`<div style="font-family:${FONTS.mono};font-size:12px;color:rgba(255,255,255,0.6)">${escapeHtml(pr.fechaTentativa)}</div>`);
    }
    parts.push(`</div>`);

    if (pr.objetivos.length) {
      parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-top:0">`);
      parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px">Que presentamos</div>`);
      parts.push(`<ul class="fase-entregables">`);
      for (const obj of pr.objetivos) {
        parts.push(`<li>${escapeHtml(obj)}</li>`);
      }
      parts.push(`</ul></div>`);
    }
  }

  return parts.join("\n");
}

// ─── 05. Roadmap de Ejecucion ────────────────────────────────────────

function renderRoadmapBody(data: FoundationData): string {
  const parts: string[] = [];

  if (data.roadmap && data.roadmap.length) {
    const fechaISO = data.datosF1?.fechaInicioISO ?? null;

    // Milestones
    const milestones: GanttMilestone[] = [{ semana: 1, label: "KO Call" }];
    if (data.koCall.proximaReunion) {
      milestones.push({ semana: 3, label: "Foundation Review" });
    }

    parts.push(renderGantt(data.roadmap, fechaISO, milestones));

    // Tracking deliverables for Build phase
    const trackingItems = data.requerimientosCliente.tracking?.items ?? [];

    // Phase cards (proposal style)
    const phases: Array<{ name: string; desc: string; entregables: string[] }> = [
      {
        name: "Foundation",
        desc: "Setup tecnico, accesos, onboarding del cliente.",
        entregables: [
          "KO Call con el cliente",
          "Setup Meta Business (Portfolio, Page, Ad Account)",
          "Accesos a plataformas confirmados",
        ],
      },
      {
        name: "Build",
        desc: "Tracking, creativos, campanas y audiencias.",
        entregables: [
          ...trackingItems.map((i) => i.label),
          "Produccion de creativos",
          "Estructura de campanas en Meta Ads",
          "Audiencias configuradas",
        ],
      },
      {
        name: "Launch",
        desc: "Lanzamiento de campanas. Monitoreo intensivo y primeros datos.",
        entregables: [
          "Campanas activas en Meta Ads",
          "Monitoreo diario de metricas",
          "Ajustes de segmentacion y creativos",
        ],
      },
      {
        name: "Scale",
        desc: "Optimizacion basada en datos. Escalar lo que funciona.",
        entregables: [
          "Optimizacion de campanas por ROAS/CPA",
          "Nuevos angulos creativos",
          "Escalar presupuesto en lo que funciona",
          "Report mensual de resultados",
        ],
      },
    ];

    const phaseColors: Record<string, string> = {
      Foundation: COLORS.slate,
      Build: COLORS.escenario2,
      Launch: COLORS.red,
      Scale: COLORS.escenario1,
    };

    parts.push(`<div style="display:flex;flex-direction:column;gap:12px;margin-top:22px">`);

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const color = phaseColors[phase.name] || COLORS.slate;
      const dateRange = fechaISO ? computePhaseDateRange(data.roadmap, phase.name, fechaISO) : "";

      parts.push(`<div style="border:1px solid rgba(14,13,12,0.18);background:rgba(14,13,12,0.03)">`);

      // Phase header
      parts.push(`<div style="padding:12px 20px;border-bottom:1px solid rgba(14,13,12,0.1);display:flex;justify-content:space-between;align-items:center">`);
      parts.push(`<div style="display:flex;align-items:center;gap:10px">`);
      parts.push(`<span style="font-family:${FONTS.mono};font-size:13px;font-weight:700;color:${COLORS.surface};background:${i === 0 ? COLORS.red : color};width:28px;height:28px;display:flex;align-items:center;justify-content:center">${i + 1}</span>`);
      parts.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px;text-transform:uppercase">${escapeHtml(phase.name)}</span>`);
      parts.push(`</div>`);
      if (dateRange) {
        parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;letter-spacing:0.06em;color:${COLORS.muted}">${dateRange}</span>`);
      }
      parts.push(`</div>`);

      // Description + deliverables
      parts.push(`<div style="padding:10px 20px 14px">`);
      parts.push(`<p style="font-size:13px;line-height:1.4;color:${COLORS.muted};margin:0 0 8px">${escapeHtml(phase.desc)}</p>`);
      for (const d of phase.entregables) {
        parts.push(`<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:2px">`);
        parts.push(`<span style="color:${i === 0 ? COLORS.red : color};font-size:10px;margin-top:4px;flex-shrink:0">&#9632;</span>`);
        parts.push(`<span style="font-size:13px;line-height:1.4;color:rgba(14,13,12,0.78)">${escapeHtml(d)}</span>`);
        parts.push(`</div>`);
      }
      parts.push(`</div></div>`);
    }

    parts.push(`</div>`);
  } else {
    parts.push(`<span class="badge-sin-dato">ROADMAP NO DEFINIDO</span>`);
  }

  return parts.join("\n");
}

// ─── 06. Estrategia ──────────────────────────────────────────────────

function renderEstrategiaBody(data: FoundationData): string {
  const parts: string[] = [];

  // Palanca
  parts.push(`<h3>Palanca Elegida</h3>`);
  if (data.palanca) {
    parts.push(`
      <div class="propuesta-diferencial">
        ${escapeHtml(data.palanca.nombre)}
      </div>
      <p style="font-size:14px;line-height:1.65;margin-bottom:24px">${escapeHtml(data.palanca.justificacion)}</p>`);
  } else {
    parts.push(`<span class="badge-sin-dato">PENDIENTE DE DEFINICION</span>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};margin-top:12px;margin-bottom:24px">La palanca se define en base al diagnostico de F0 y la propuesta de F1. Opciones: Posicionamiento, Oferta, Captacion, Conversion.</div>`);
  }

  // ICP
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>ICP + Buyer Persona</h3>`);
  if (data.icp.length) {
    for (const icp of data.icp) {
      const badgeColor = icp.prioridad === "primario" ? COLORS.red : COLORS.muted;
      const badgeLabel = icp.prioridad.toUpperCase();

      parts.push(`<div class="icp-section">`);
      parts.push(`<div class="icp-desc"><strong>${escapeHtml(icp.segmento)}</strong> <span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:2px 8px;background:${badgeColor};color:${COLORS.surface}">${badgeLabel}</span><br>${escapeHtml(icp.descripcion)}</div>`);
      parts.push(`<div class="icp-columns">`);
      parts.push(`<div class="icp-col"><div class="icp-col-label dolores">Dolores</div><ul class="icp-list">${icp.dolores.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul></div>`);
      parts.push(`<div class="icp-col"><div class="icp-col-label deseos">Deseos</div><ul class="icp-list">${icp.deseos.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul></div>`);
      parts.push(`<div class="icp-col"><div class="icp-col-label objeciones">Objeciones</div><ul class="icp-list">${icp.objeciones.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul></div>`);
      parts.push(`</div></div>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">ICP NO DEFINIDO</span>`);
  }

  // Oferta
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Oferta</h3>`);
  if (data.oferta) {
    parts.push(`
      <div style="padding:20px;border:1px solid ${COLORS.border};margin-bottom:24px">
        <p style="font-size:14px;line-height:1.65;margin-bottom:12px">${escapeHtml(data.oferta.descripcion)}</p>
        <div style="padding:12px 16px;background:${COLORS.bg};border-left:3px solid ${COLORS.red}">
          <div class="card-label">Diferenciador</div>
          <p style="font-size:14px">${escapeHtml(data.oferta.diferenciador)}</p>
        </div>
      </div>`);
  } else {
    parts.push(`<span class="badge-sin-dato">OFERTA NO DEFINIDA</span>`);
  }

  // Calificacion de leads
  parts.push(`<h3>Calificacion de Leads</h3>`);
  if (data.calificacionLeads.length) {
    const catColors: Record<string, string> = { A: COLORS.red, B: COLORS.escenario2, C: COLORS.muted };

    parts.push(`<table>`);
    parts.push(`<thead><tr><th>Categoria</th><th>Descripcion</th><th>Accion</th></tr></thead>`);
    parts.push(`<tbody>`);
    for (const lead of data.calificacionLeads) {
      const color = catColors[lead.categoria] ?? COLORS.ink;
      parts.push(`<tr>`);
      parts.push(`<td><span style="font-family:${FONTS.mono};font-weight:700;color:${color};font-size:16px">${escapeHtml(lead.categoria)}</span></td>`);
      parts.push(`<td>${escapeHtml(lead.descripcion)}</td>`);
      parts.push(`<td>${escapeHtml(lead.accion)}</td>`);
      parts.push(`</tr>`);
    }
    parts.push(`</tbody></table>`);
  } else {
    parts.push(`<span class="badge-sin-dato">SIN DEFINIR</span>`);
  }

  // KPIs
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>KPIs</h3>`);
  if (data.kpis.length) {
    parts.push(`<table>`);
    parts.push(`<thead><tr><th>KPI</th><th>Objetivo</th><th>Fuente</th></tr></thead>`);
    parts.push(`<tbody>`);
    for (const kpi of data.kpis) {
      parts.push(`<tr>`);
      parts.push(`<td><span class="kpi-chip" style="margin:0">${escapeHtml(kpi.nombre)}</span></td>`);
      parts.push(`<td>${kpi.objetivo ? escapeHtml(kpi.objetivo) : `<span style="color:${COLORS.muted}">Por definir</span>`}</td>`);
      parts.push(`<td style="font-size:12px;color:${COLORS.muted}">${escapeHtml(kpi.fuente)}</td>`);
      parts.push(`</tr>`);
    }
    parts.push(`</tbody></table>`);
  } else {
    parts.push(`<span class="badge-sin-dato">SIN KPIS DEFINIDOS</span>`);
  }

  // Presupuesto
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Presupuesto</h3>`);
  if (data.presupuesto) {
    const budgetItems: Array<{ label: string; value: string; highlight?: boolean }> = [
      { label: "Pauta (tarjeta del cliente)", value: data.presupuesto.pauta },
      { label: "Fee REE", value: data.presupuesto.fee },
      { label: "Total", value: data.presupuesto.total },
    ];

    if (data.presupuesto.cplTarget) {
      budgetItems.push({ label: "CPL Target", value: data.presupuesto.cplTarget, highlight: true });
    }

    if (data.presupuesto.limiteGastoCuenta) {
      budgetItems.push({ label: "Limite de Gasto Cuenta", value: data.presupuesto.limiteGastoCuenta });
    }

    parts.push(`<div class="var-stack">`);
    for (const item of budgetItems) {
      parts.push(`
        <div class="var-card">
          <div class="var-card-header"${item.highlight ? ` style="background:${COLORS.red}"` : ""}>
            <div class="var-card-title"${item.highlight ? ` style="color:${COLORS.surface}"` : ""}>${escapeHtml(item.label)}</div>
          </div>
          <div class="var-card-body">
            <p class="var-card-desc" style="font-family:${FONTS.mono};font-size:18px;font-weight:700${item.highlight ? `;color:${COLORS.red}` : ""}">${escapeHtml(item.value)}</p>
          </div>
        </div>`);
    }
    parts.push(`</div>`);

    if (data.presupuesto.limiteGastoCuenta) {
      parts.push(`<div style="padding:12px 16px;background:${COLORS.gapBg};border-left:3px solid ${COLORS.escenario2};font-size:13px;margin-top:16px">Configurar limite de gasto de ${escapeHtml(data.presupuesto.limiteGastoCuenta)} en la cuenta publicitaria del cliente desde Meta Business Suite.</div>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">PRESUPUESTO NO DEFINIDO</span>`);
  }

  return parts.join("\n");
}

// ─── 06. Ejecucion (Build/Launch) ─────────────────────────────────────

function renderEjecucionBody(data: FoundationData): string {
  const parts: string[] = [];

  // Tracking setup
  const tracking = data.requerimientosCliente.tracking;
  if (tracking && tracking.items.length) {
    parts.push(`<h3>Tracking y Analytics</h3>`);
    parts.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:16px">Setup de tracking que se implementa durante Build (S2-S3). Sin tracking no hay datos para optimizar.</p>`);
    parts.push(renderCheckGroup(tracking));
    parts.push(`<hr class="section-divider">`);
  }

  // Angulos creativos
  parts.push(`<h3>Angulos Creativos</h3>`);
  if (data.creativos && data.creativos.angulos.length) {
    parts.push(`<div class="angulo-group-cards">`);
    for (const angulo of data.creativos.angulos) {
      parts.push(`
        <div class="angulo-card">
          <div class="angulo-header">
            <div class="angulo-nombre">${escapeHtml(angulo.nombre)}</div>
          </div>
          <div class="angulo-body">
            <div class="angulo-mensaje">${escapeHtml(angulo.mensajeClave)}</div>
            <div class="angulo-meta">
              <div class="angulo-dolor"><span class="angulo-meta-label">Dolor:</span> ${escapeHtml(angulo.dolorQueResuelve)}</div>
              <div class="angulo-palanca"><span class="angulo-meta-label">Formato:</span> ${escapeHtml(angulo.formato)}</div>
            </div>
          </div>
        </div>`);
    }
    parts.push(`</div>`);

    if (data.creativos.formatos.length) {
      parts.push(`<div style="margin-top:20px"><div class="card-label">Formatos</div>`);
      parts.push(`<div class="kpi-grid" style="margin-top:8px">${data.creativos.formatos.map((f) => `<span class="canal-chip">${escapeHtml(f)}</span>`).join("")}</div></div>`);
    }

    if (data.creativos.tono) {
      parts.push(`<div style="margin-top:16px"><div class="card-label">Tono</div><p style="font-size:14px">${escapeHtml(data.creativos.tono)}</p></div>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">CREATIVOS NO DEFINIDOS</span>`);
  }

  // UTM
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Convencion UTM</h3>`);
  if (data.utm) {
    parts.push(`
      <div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-bottom:16px">
        <div class="card-label">Formato de Campaign</div>
        <p style="font-family:${FONTS.mono};font-size:14px;font-weight:600">${escapeHtml(data.utm.campaignFormat)}</p>
      </div>`);

    if (data.utm.ejemplos.length) {
      parts.push(`<div class="card-label">Ejemplos</div>`);
      parts.push(`<table>`);
      parts.push(`<tbody>`);
      for (const ej of data.utm.ejemplos) {
        parts.push(`<tr><td style="font-family:${FONTS.mono};font-size:13px">${escapeHtml(ej)}</td></tr>`);
      }
      parts.push(`</tbody></table>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">UTM NO DEFINIDO</span>`);
  }

  // Nomenclatura de ads
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Nomenclatura de Ads</h3>`);
  const empresa = data.clientInfo.slug || data.clientInfo.nombreEmpresa;
  parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-bottom:24px">`);
  parts.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:12px">Convencion de nombres para Meta Ads:</p>`);
  parts.push(`<table>`);
  parts.push(`<thead><tr><th>Nivel</th><th>Formato</th><th>Ejemplo</th></tr></thead>`);
  parts.push(`<tbody>`);
  parts.push(`<tr><td style="font-weight:700">Campana</td><td style="font-family:${FONTS.mono};font-size:13px">{Empresa}_{Objetivo}</td><td style="font-family:${FONTS.mono};font-size:13px">${escapeHtml(empresa)}_Leads</td></tr>`);
  parts.push(`<tr><td style="font-weight:700">Ad Set</td><td style="font-family:${FONTS.mono};font-size:13px">Conjunto_{ICP}</td><td style="font-family:${FONTS.mono};font-size:13px">Conjunto_ICP_A</td></tr>`);
  parts.push(`<tr><td style="font-weight:700">Ad</td><td style="font-family:${FONTS.mono};font-size:13px">Anuncio_{Formato}_{Angulo}_{Version}</td><td style="font-family:${FONTS.mono};font-size:13px">Anuncio_Reel_Dolor_V1</td></tr>`);
  parts.push(`</tbody></table>`);
  parts.push(`</div>`);

  // Arquitectura de campanas
  parts.push(`<h3>Campanas</h3>`);
  if (data.arquitectura.length) {
    for (let i = 0; i < data.arquitectura.length; i++) {
      const camp = data.arquitectura[i];
      parts.push(`
      <details class="fase-card">
        <summary class="fase-header">
          <span class="fase-number">${i + 1}</span>
          <span class="fase-nombre">${escapeHtml(camp.nombre)}</span>
          <div class="fase-meta">
            <svg class="fase-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </summary>
        <div class="fase-body">
          <p><strong>Objetivo:</strong> ${escapeHtml(camp.objetivo)}</p>
          ${camp.adSets.length ? camp.adSets.map((as) => `
            <div style="margin-top:16px;padding:12px 16px;border:1px solid ${COLORS.border}">
              <div style="font-family:${FONTS.heading};font-weight:700;font-size:14px;margin-bottom:8px">${escapeHtml(as.nombre)}</div>
              <div class="card-label">Segmentacion</div>
              <p style="font-size:13px;margin-bottom:8px">${escapeHtml(as.segmentacion)}</p>
              ${as.ads.length ? `<div class="card-label">Ads</div><ul class="fase-entregables">${as.ads.map((ad) => `<li>${escapeHtml(ad)}</li>`).join("")}</ul>` : ""}
            </div>`).join("") : ""}
        </div>
      </details>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">ARQUITECTURA NO DEFINIDA</span>`);
  }

  // Capacidad de atencion
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Capacidad de Atencion</h3>`);
  if (data.capacidadAtencion) {
    const validadoColor = data.capacidadAtencion.validado ? COLORS.escenario1 : COLORS.escenario3;
    const validadoLabel = data.capacidadAtencion.validado ? "VALIDADO" : "NO VALIDADO";

    parts.push(`
      <div style="padding:20px;border:1px solid ${COLORS.border};border-left:4px solid ${validadoColor}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h4 style="margin:0">${escapeHtml(data.capacidadAtencion.quienAtiende)}</h4>
          <span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:2px 8px;background:${validadoColor};color:${COLORS.surface}">${validadoLabel}</span>
        </div>
        ${data.capacidadAtencion.capacidadDiaria ? `<p style="font-size:14px;margin-bottom:8px"><strong>Capacidad diaria:</strong> ${escapeHtml(data.capacidadAtencion.capacidadDiaria)}</p>` : ""}
        ${data.capacidadAtencion.tiempoRespuesta ? `<p style="font-size:14px"><strong>Tiempo de respuesta:</strong> ${escapeHtml(data.capacidadAtencion.tiempoRespuesta)}</p>` : ""}
      </div>`);
  } else {
    parts.push(`<span class="badge-sin-dato">CAPACIDAD NO EVALUADA</span>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};margin-top:12px">Validar con el cliente: quien atiende los leads, cuantos puede atender por dia y en cuanto tiempo responde.</div>`);
  }

  return parts.join("\n");
}

// ─── 07. Scale ────────────────────────────────────────────────────────

function renderScaleBody(data: FoundationData): string {
  const parts: string[] = [];

  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : empresa;

  // Intro
  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">A partir de S5 entramos en fase Scale. Las campanas ya estan corriendo, el tracking esta validado y tenemos datos reales. El foco pasa de construir a optimizar y escalar.</p>`);

  // Que hacemos en Scale
  parts.push(`<h3>Que hacemos en esta fase</h3>`);

  const scaleActivities = [
    { title: "Optimizacion de campanas", desc: "Ajustar audiencias, creativos y presupuesto en base a datos reales. Pausar lo que no funciona, escalar lo que si." },
    { title: "Iteracion de creativos", desc: "Nuevas versiones de los angulos que mejor performan. Testear variantes de copy, formato y CTA." },
    { title: "Monitoreo continuo", desc: "Revision diaria de metricas clave (CPA, ROAS, CTR). Alertas tempranas si algo se desvia." },
    { title: "Reporting mensual", desc: "Report con resultados, aprendizajes y plan de accion para el mes siguiente. Se comparte con el cliente." },
  ];

  parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">`);
  for (const act of scaleActivities) {
    parts.push(`<div style="padding:16px 20px;border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.escenario1}">`);
    parts.push(`<div style="font-family:${FONTS.heading};font-weight:700;font-size:14px;margin-bottom:6px">${escapeHtml(act.title)}</div>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};line-height:1.5">${escapeHtml(act.desc)}</div>`);
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  // Cadencia de reuniones
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Cadencia con ${contacto}</h3>`);

  parts.push(`<table>`);
  parts.push(`<thead><tr><th>Frecuencia</th><th>Formato</th><th>Contenido</th></tr></thead>`);
  parts.push(`<tbody>`);
  parts.push(`<tr><td style="font-weight:700">Semanal</td><td>Mensaje WhatsApp</td><td>Update breve de performance, alertas y proximos pasos</td></tr>`);
  parts.push(`<tr><td style="font-weight:700">Mensual</td><td>Reunion + Report</td><td>Resultados del mes, aprendizajes, plan del proximo mes</td></tr>`);
  parts.push(`</tbody></table>`);

  // Metricas de escala
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Criterios para escalar presupuesto</h3>`);

  parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-bottom:16px">`);
  parts.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:12px">Escalamos cuando se cumplen estas condiciones:</p>`);
  parts.push(`<ul class="fase-entregables">`);
  parts.push(`<li>CPA estable o en baja durante 2+ semanas</li>`);
  parts.push(`<li>ROAS positivo y sostenido</li>`);
  parts.push(`<li>Capacidad de atencion del cliente no saturada</li>`);
  parts.push(`<li>Stock/produccion disponible para absorber mas demanda</li>`);
  parts.push(`</ul>`);
  parts.push(`</div>`);

  // Que esperar
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Que puede esperar ${contacto}</h3>`);

  const expectations = [
    "Comunicacion constante via WhatsApp con el equipo de REE",
    "Dashboard REE Metrics actualizado con datos en tiempo real",
    "Report mensual con resultados y recomendaciones",
    "Creativos nuevos cada mes basados en lo que mejor funciona",
    "Propuestas de escalado cuando los numeros lo justifiquen",
  ];

  parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-left:4px solid ${COLORS.escenario1}">`);
  parts.push(`<ul class="fase-entregables">`);
  for (const exp of expectations) {
    parts.push(`<li>${escapeHtml(exp)}</li>`);
  }
  parts.push(`</ul></div>`);

  return parts.join("\n");
}

// ─── 08. Notas ───────────────────────────────────────────────────────

function renderNotasBody(data: FoundationData): string {
  const parts: string[] = [];

  if (data.notas) {
    parts.push(
      data.notas
        .split("\n")
        .filter((p) => p.trim())
        .map((p) => `<p style="margin-bottom:12px;font-size:14px">${escapeHtml(p)}</p>`)
        .join("\n")
    );
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Sin notas adicionales.</p>`);
  }

  return parts.join("\n");
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado automaticamente por REE Foundation Skill F2
  </div>`;
}
