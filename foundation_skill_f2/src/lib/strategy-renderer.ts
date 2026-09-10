import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { FoundationData, RoadmapInitiative, ReviewEtapa, ReviewMilestone, ReviewMeeting, ProximoPaso, CampanaDefinida } from "../types/foundation.js";
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

// ─── Asset loader (competitor avatars, reference images) ─────────────

function loadAssetBase64(filename: string | null | undefined): string {
  if (!filename) return "";
  const p = resolve(__dirname, `../assets/${filename}`);
  try {
    const ext = filename.split(".").pop()?.toLowerCase() || "jpeg";
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${readFileSync(p).toString("base64")}`;
  } catch {
    return "";
  }
}

// ─── Derive helpers ──────────────────────────────────────────────────

function deriveReviewEtapas(data: FoundationData): ReviewEtapa[] {
  if (data.reviewEtapas?.length) return data.reviewEtapas;

  const etapas: ReviewEtapa[] = [
    { nombre: "Apertura", duracion: "5 min", objetivo: "Recap de Foundation: que se hizo, que queda listo." },
  ];

  let activeCampaigns = data.arquitectura.filter(c => c.status === "activa");
  let devCampaigns = data.arquitectura.filter(c => c.status === "en-desarrollo");
  if (activeCampaigns.length === 0 && devCampaigns.length === 0 && data.arquitectura.length > 0) {
    devCampaigns = data.arquitectura;
  }

  for (const camp of activeCampaigns) {
    etapas.push({
      nombre: camp.nombre.replace(/^[^_]*_/, ""),
      duracion: "10 min",
      objetivo: `Campaña de ${camp.objetivo.toLowerCase()} ya seteada.`,
    });
  }

  for (const camp of devCampaigns) {
    etapas.push({
      nombre: camp.nombre.replace(/^[^_]*_/, ""),
      duracion: "15 min",
      objetivo: `Estrategia de ${camp.objetivo.toLowerCase()}: audiencias, creativos, presupuesto.`,
    });
  }

  etapas.push(
    { nombre: "Demo REE Metrics", duracion: "10 min", objetivo: "Performance en el dashboard." },
    { nombre: "Cierre", duracion: "5 min", objetivo: "Aprobacion para lanzar + agendar proxima Call ADS." },
  );

  return etapas;
}

function deriveMilestones(data: FoundationData, _fechaISO: string | null): ReviewMilestone[] {
  if (data.reviewMilestones?.length) return data.reviewMilestones;
  return [
    { semana: 1, label: "KO Call" },
    { semana: 2, label: "Foundation Review" },
    { semana: 4, label: "Launch" },
    { semana: 6, label: "Call ADS" },
    { semana: 8, label: "Review Final" },
  ];
}

function deriveMeetings(data: FoundationData, _fechaISO: string | null): ReviewMeeting[] {
  if (data.reviewMeetings?.length) return data.reviewMeetings;
  return [
    { semana: "S1", nombre: "KO Call", desc: "Kickoff con el cliente. Configuracion de Meta Ads, accesos.", status: "done" },
    { semana: "S2", nombre: "Foundation Review", desc: "Revision completa del setup. Aprobacion para lanzar.", status: "current" },
    { semana: "S4", nombre: "Launch", desc: "Lanzamiento de campañas.", status: "pending" },
    { semana: "S6", nombre: "Call ADS", desc: "Seguimiento de campañas activas. Optimizaciones.", status: "pending" },
    { semana: "S8", nombre: "Review Final", desc: "Revision del periodo completo. Resultados vs KPIs.", status: "pending" },
  ];
}

function deriveProximosPasos(data: FoundationData): ProximoPaso[] {
  if (data.proximosPasos?.length) return data.proximosPasos;
  const pasos: ProximoPaso[] = [];
  let activeCamps = data.arquitectura.filter(c => c.status === "activa");
  let devCamps = data.arquitectura.filter(c => c.status === "en-desarrollo");
  if (activeCamps.length === 0 && devCamps.length === 0 && data.arquitectura.length > 0) {
    devCamps = data.arquitectura;
  }
  const contacto = data.clientInfo.nombreContacto ?? "el cliente";

  if (activeCamps.length) {
    pasos.push({
      titulo: "Lanzar campaña activa",
      responsable: `REE Growth + ${contacto}`,
      tiempo: "Esta semana",
      items: [
        "Agregar tarjeta de pago en Meta Ads",
        "Configurar Pixel de Meta",
        ...activeCamps.map(c => `Prender campaña ${c.nombre}`),
      ],
    });
  }

  if (devCamps.length) {
    pasos.push({
      titulo: "Creacion de piezas + setup de campañas",
      responsable: "REE Creativos / REE Growth",
      tiempo: "Semanas 2 - 3",
      items: [
        "Produccion de piezas creativas",
        ...devCamps.map(c => `Armado de campaña ${c.nombre}`),
      ],
    });
  }

  if (data.ofertas?.length || data.cambiosEcommerce?.length) {
    pasos.push({
      titulo: "Pricing y E-commerce",
      responsable: `${contacto} + REE Growth`,
      tiempo: "Semanas 2 - 3",
      items: [
        ...(data.ofertas?.length ? ["Crear ofertas/packs en e-commerce"] : []),
        ...(data.cambiosEcommerce?.length ? ["Implementar cambios en tienda online"] : []),
      ],
    });
  }

  return pasos;
}

// ─── TOC builder ─────────────────────────────────────────────────────

interface TocItem {
  id: string;
  title: string;
  desc: string;
}

function buildToc(data: FoundationData): TocItem[] {
  const items: TocItem[] = [];
  items.push({ id: "foundation-review", title: "Foundation Review", desc: "Estructura de la llamada." });

  let activeCampaigns = data.arquitectura.filter(c => c.status === "activa");
  let devCampaigns = data.arquitectura.filter(c => c.status === "en-desarrollo");
  if (activeCampaigns.length === 0 && devCampaigns.length === 0 && data.arquitectura.length > 0) {
    devCampaigns = data.arquitectura;
  }

  for (const camp of activeCampaigns) {
    const totalAds = camp.adSets.reduce((s, as_) => s + as_.ads.length, 0);
    items.push({
      id: slugify(camp.nombre),
      title: `Campaña de ${camp.objetivo}`,
      desc: `${totalAds} piezas ya seteadas.`,
    });
  }

  if (devCampaigns.length) {
    const campNames = devCampaigns.map(c => c.objetivo).join(" + ");
    items.push({
      id: "foundation-campaign",
      title: `Foundation ${campNames}`,
      desc: "Competencia, audiencias, angulos creativos, campaña y e-commerce.",
    });
  }

  items.push({ id: "ree-metrics", title: "REE Metrics", desc: "Dashboard de performance: como ingresar y que vas a ver." });
  items.push({ id: "roadmap", title: "Roadmap de Ejecución", desc: "Plan de ejecución 8 semanas + reuniones." });
  items.push({ id: "proximos-pasos", title: "Proximos Pasos", desc: "Que sigue con la aprobacion." });

  return items;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ─── Main render ─────────────────────────────────────────────────────

export function renderStrategyHtml(data: FoundationData): string {
  const styles = getBaseStyles();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

  let activeCampaigns = data.arquitectura.filter(c => c.status === "activa");
  let devCampaigns = data.arquitectura.filter(c => c.status === "en-desarrollo");

  // Fallback: if no campaign has status, treat all as "en-desarrollo"
  if (activeCampaigns.length === 0 && devCampaigns.length === 0 && data.arquitectura.length > 0) {
    devCampaigns = data.arquitectura;
  }

  // Build sections dynamically
  let sectionNum = 0;
  const sections: string[] = [];

  // 01. Esta Reunion
  sectionNum++;
  sections.push(renderEstaReunion(data, sectionNum));

  // 02+. Active campaigns (each gets its own section)
  for (const camp of activeCampaigns) {
    sectionNum++;
    sections.push(renderActiveCampaign(data, camp, sectionNum));
  }

  // Next. Foundation mega-section (in-development campaigns)
  if (devCampaigns.length) {
    sectionNum++;
    sections.push(renderFoundationCampaigns(data, devCampaigns, sectionNum));
  }

  // REE Metrics
  sectionNum++;
  sections.push(renderReeMetrics(data, sectionNum));

  // Roadmap
  sectionNum++;
  sections.push(renderRoadmap(data, sectionNum));

  // Proximos Pasos
  sectionNum++;
  sections.push(renderProximosPasos(data, sectionNum));

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Foundation Review — ${empresa}</title>
${getFaviconTag()}
<style>${styles}
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
  details.fr-section {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    margin-bottom: 24px;
  }
  details.fr-section > summary {
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
  details.fr-section > summary::-webkit-details-marker { display: none; }
  details.fr-section > summary::after {
    content: "+";
    font-family: ${FONTS.mono};
    font-size: 22px;
    font-weight: 400;
    color: ${COLORS.muted};
    margin-left: auto;
  }
  details.fr-section[open] > summary::after {
    content: "\\2212";
  }
  details.fr-section > .fr-section-body {
    padding: 0 32px 32px;
  }
  details.fr-subsection {
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  details.fr-subsection > summary {
    font-family: ${FONTS.heading};
    font-weight: 700;
    font-size: 16px;
    padding: 16px 20px;
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    text-align: left;
    user-select: none;
  }
  details.fr-subsection > summary::-webkit-details-marker { display: none; }
  details.fr-subsection > summary::after {
    content: "+";
    font-family: ${FONTS.mono};
    font-size: 18px;
    font-weight: 400;
    color: ${COLORS.muted};
    margin-left: auto;
  }
  details.fr-subsection[open] > summary::after {
    content: "\\2212";
  }
  details.fr-subsection[open] > summary {
    border-bottom: 1px solid ${COLORS.border};
  }
  details.fr-subsection > .fr-subsection-body {
    padding: 20px;
  }
  .subsection-num {
    font-family: ${FONTS.mono};
    font-size: 12px;
    font-weight: 600;
    color: ${COLORS.red};
    margin-right: 10px;
  }
</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderToc(data)}
  ${sections.join("\n")}
  ${renderFooter()}
</div>
<a href="#top" class="back-to-top" title="Volver arriba"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header (red bg, white logo) ─────────────────────────────────────

function renderHeader(data: FoundationData): string {
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : null;
  const industria = data.clientInfo.industria ? escapeHtml(data.clientInfo.industria) : null;
  const web = data.clientInfo.sitioWeb ? escapeHtml(data.clientInfo.sitioWeb) : null;
  const duracion = data.datosF1?.duracionProyecto ? escapeHtml(data.datosF1.duracionProyecto) : null;
  const campanas = data.datosF1?.campanasVendidas ?? [];

  const logoB64 = getLogoBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  const badgeStyle = `display:inline-block;font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;text-transform:uppercase;letter-spacing:1px;vertical-align:middle;margin-left:10px`;

  return `
  <div class="header" id="top">
    ${logoHtml}
    <div class="header-label">FOUNDATION REVIEW</div>
    <div class="header-title">${empresa}<span style="${badgeStyle};background:${COLORS.surface};color:${COLORS.red}">Foundation</span><span style="${badgeStyle};background:rgba(255,255,255,0.15);color:${COLORS.surface};border:1px solid rgba(255,255,255,0.3)">Semana 3</span></div>
    <div class="meta-row">
      ${contacto ? `<span>Contacto: ${contacto}</span>` : ""}
      ${industria ? `<span>Industria: ${industria}</span>` : ""}
      ${web ? `<span>Web: <a href="https://${web}" target="_blank" style="color:rgba(255,255,255,0.7);text-decoration:underline">${web}</a></span>` : ""}
      ${duracion ? `<span>Duracion: ${duracion}</span>` : ""}
    </div>
    ${campanas.length ? `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:14px">
      ${campanas.map(c => `<span style="font-family:${FONTS.mono};font-size:11px;padding:4px 12px;background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.2)">${escapeHtml(c)}</span>`).join("")}
    </div>` : ""}
  </div>`;
}

// ─── TOC ─────────────────────────────────────────────────────────────

function renderToc(data: FoundationData): string {
  const items = buildToc(data);
  return `
  <div style="background:${COLORS.surface};border:1px solid ${COLORS.border};padding:24px 32px;margin-bottom:24px">
    <ol style="list-style:none;counter-reset:toc;padding:0;margin:0">
      ${items.map((s, i) => `<li style="counter-increment:toc;margin-bottom:12px"><a href="#${s.id}" style="color:${COLORS.ink};text-decoration:none;font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.red};margin-right:8px;font-weight:600">${String(i + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}</a><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Section wrapper (dropdown) ─────────────────────────────────────

function section(num: number, id: string, title: string, html: string, rawTitle?: boolean): string {
  const pad = String(num).padStart(2, "0");
  const titleHtml = rawTitle ? title : escapeHtml(title);
  return `
  <details class="fr-section" id="${id}">
    <summary><span class="section-num">${pad}</span>${titleHtml}</summary>
    <div class="fr-section-body">
      ${html}
    </div>
  </details>`;
}

function subsection(parentNum: number, subNum: number, title: string, html: string): string {
  const pad = `${parentNum}.${subNum}`;
  return `
  <details class="fr-subsection">
    <summary><span class="subsection-num">${pad}</span>${title}</summary>
    <div class="fr-subsection-body">
      ${html}
    </div>
  </details>`;
}

// ─── 01. Esta Reunion ───────────────────────────────────────────────

function renderEstaReunion(data: FoundationData, num: number): string {
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : "el cliente";
  const parts: string[] = [];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">En esta seccion se describe la estructura de la llamada de Foundation Review con ${contacto}. Vamos a recorrer todo lo que preparamos y al final tenemos la aprobacion para lanzar.</p>`);

  const etapas = deriveReviewEtapas(data);

  // Timeline bar
  parts.push(`<div style="display:flex;gap:3px;margin-bottom:24px">`);
  for (let i = 0; i < etapas.length; i++) {
    const etapa = etapas[i];
    const isEdge = i === 0 || i === etapas.length - 1;
    const bg = isEdge ? COLORS.red : COLORS.slate;
    parts.push(`<div style="flex:1;background:${bg};color:${COLORS.surface};padding:12px 16px;text-align:center">`);
    parts.push(`<div style="font-family:${FONTS.heading};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(etapa.nombre)}</div>`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;color:rgba(255,255,255,0.55);margin-top:3px">${escapeHtml(etapa.duracion)}</div>`);
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  // Etapa descriptions
  for (let i = 0; i < etapas.length; i++) {
    const etapa = etapas[i];
    const isEdge = i === 0 || i === etapas.length - 1;
    const color = isEdge ? COLORS.red : COLORS.slate;
    parts.push(`<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;font-weight:700;padding:3px 8px;background:${color};color:${COLORS.surface};flex-shrink:0">${i + 1}</span>`);
    parts.push(`<div>`);
    parts.push(`<div style="font-family:${FONTS.heading};font-weight:700;font-size:14px;margin-bottom:2px">${escapeHtml(etapa.nombre)}</div>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};line-height:1.5">${escapeHtml(etapa.objetivo)}</div>`);
    parts.push(`</div></div>`);
  }

  return section(num, "foundation-review", "Foundation Review", parts.join("\n"));
}

// ─── Active Campaign Section ────────────────────────────────────────

function renderActiveCampaign(data: FoundationData, campaign: CampanaDefinida, num: number): string {
  const parts: string[] = [];
  const slug = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:8px">Campaña de <strong>${escapeHtml(campaign.objetivo.toLowerCase())}</strong> hacia ${campaign.destino ? escapeHtml(campaign.destino.toLowerCase()) : "el destino definido"} de <strong>${slug}</strong>.</p>`);
  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">El objetivo es nutrir un público, generar <strong>posicionamiento de marca</strong> y conseguir resultados medibles.</p>`);

  // Campaign definition card
  parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
  parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px">`);
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de Campaña</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(campaign.objetivo)}</p></div>`);
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Destino</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(campaign.destino ?? "Por definir")}</p></div>`);

  // HR
  parts.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

  // Audiencia
  const firstAdSet = campaign.adSets[0];
  if (firstAdSet) {
    const { edad, locacion, intereses } = parseSegmentacion(firstAdSet.segmentacion);
    parts.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencia</div>`);
    parts.push(`<ul style="font-size:14px;margin:8px 0 0;padding-left:20px;line-height:1.8">`);
    parts.push(`<li><span style="font-weight:600">Edad:</span> ${escapeHtml(edad)}</li>`);
    if (locacion) parts.push(`<li><span style="font-weight:600">Locación:</span> ${escapeHtml(locacion)}</li>`);
    if (intereses.length) parts.push(`<li><span style="font-weight:600">Intereses:</span> ${intereses.map(i => escapeHtml(i)).join(", ")}</li>`);
    parts.push(`</ul></div>`);
  }

  // HR
  parts.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

  // KPIs + Presupuesto
  const kpisText = campaign.kpisCampana?.length ? campaign.kpisCampana.join(" / ") : "Por definir";
  const presupuestoText = campaign.presupuestoCampana
    ? `${campaign.presupuestoCampana.diario} — ${campaign.presupuestoCampana.mensual}`
    : "Por definir";
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversión (KPIs)</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(kpisText)}</p></div>`);
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(presupuestoText)}</p></div>`);

  parts.push(`</div></div>`);

  // Nomenclatura card
  const totalAds = campaign.adSets.reduce((sum, as_) => sum + as_.ads.length, 0);
  const campNameParts = campaign.nombre.split("_");
  const campSuffix = campNameParts.length > 1 ? campNameParts.slice(1).join("_") : campaign.nombre;

  parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
  parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">`);
  parts.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>Campaña</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${slug}_${escapeHtml(campSuffix)}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">{Empresa}_{Objetivo}</p></div>`);
  parts.push(`<div style="text-align:center;padding:12px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Ad Set</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${escapeHtml(campaign.adSets[0]?.nombre || "")}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Conjunto_{Audiencia}</p></div>`);
  parts.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Ads (${totalAds})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">Anuncio_Reel_V1</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Anuncio_{Formato}_{Angulo}_{V}</p></div>`);
  parts.push(`</div></div>`);

  // Embed grid: Instagram previews
  const allEmbeds: { label: string; embedUrl: string }[] = [];
  for (const adSet of campaign.adSets) {
    for (const ad of adSet.ads) {
      const pipeIdx = ad.indexOf(" | ");
      if (pipeIdx === -1) continue;
      const lbl = ad.substring(0, pipeIdx);
      const urlP = ad.substring(pipeIdx + 3);
      const reelMatch = urlP.match(/\/reel\/([^/]+)/);
      const postMatch = urlP.match(/\/p\/([^/]+)/);
      if (reelMatch) {
        allEmbeds.push({ label: lbl, embedUrl: `https://www.instagram.com/reel/${reelMatch[1]}/embed/` });
      } else if (postMatch) {
        allEmbeds.push({ label: lbl, embedUrl: `https://www.instagram.com/p/${postMatch[1]}/embed/` });
      }
    }
  }
  if (allEmbeds.length) {
    parts.push(`<div class="card-label">Preview de piezas (${allEmbeds.length})</div>`);
    parts.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">`);
    for (const embed of allEmbeds) {
      parts.push(`<div style="text-align:center">`);
      parts.push(`<iframe src="${embed.embedUrl}" style="width:100%;min-height:340px;border:1px solid ${COLORS.border};border-radius:8px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
      parts.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px">${escapeHtml(embed.label)}</div>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);
  }

  parts.push(`<div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:14px;color:#166534"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><strong>${totalAds} piezas listas.</strong> Estas piezas ya están producidas y disponibles para subir a Meta Ads.</div>`);

  const sectionId = slugify(campaign.nombre);
  return section(num, sectionId, `Campaña de ${campaign.objetivo}`, parts.join("\n"));
}

// ─── Foundation Campaigns (in-development) ──────────────────────────

function renderFoundationCampaigns(data: FoundationData, devCampaigns: CampanaDefinida[], num: number): string {
  const parts: string[] = [];
  const slug = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);
  let subNum = 0;

  // ── Subsection: Competencia ────────────────────────────────────────
  if (data.competenciaAds) {
    subNum++;
    const sub: string[] = [];
    sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px">Analisis de los ads activos de la competencia en Meta Ad Library:</p>`);

    // Competitor cards
    const competidores = data.competenciaAds.competidores ?? [];
    if (competidores.length) {
      sub.push(`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:20px">`);
      for (const comp of competidores) {
        const borderColor = comp.activo ? COLORS.red : COLORS.border;
        const statusColor = comp.activo ? COLORS.red : COLORS.muted;
        const icon = comp.activo
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
        const avatarSrc = loadAssetBase64(comp.avatarFile);
        const avatarHtml = avatarSrc
          ? `<img src="${avatarSrc}" width="40" height="40" style="border-radius:50%;object-fit:cover;flex-shrink:0" alt="${escapeHtml(comp.nombre)}">`
          : `<div style="width:40px;height:40px;border-radius:50%;background:${COLORS.border};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:${COLORS.muted};flex-shrink:0">${comp.nombre.charAt(0)}</div>`;
        sub.push(`<div style="padding:14px 16px;border:1px solid ${borderColor};border-radius:8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;align-items:center;gap:12px">`);
        sub.push(avatarHtml);
        sub.push(`<div>`);
        sub.push(`<div style="font-weight:700;font-size:14px;margin-bottom:4px">${escapeHtml(comp.nombre)}</div>`);
        sub.push(`<div style="font-size:12px;color:${statusColor};display:flex;align-items:center;gap:6px">${icon} ${escapeHtml(comp.estado)}</div>`);
        sub.push(`</div></div>`);
      }
      sub.push(`</div>`);
    }

    // Ad Library link
    sub.push(`<div style="font-size:13px;margin-bottom:24px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><a href="${escapeHtml(data.competenciaAds.adLibraryUrl)}" target="_blank" style="color:${COLORS.red};font-weight:600">Ver ads de ${escapeHtml(data.competenciaAds.marca)} en Meta Ad Library</a></div>`);

    // Reference ads — formatos with postUrl (iframe) or imageFile (static image)
    const refFormats = data.competenciaAds.formatos.filter(f => f.postUrl || f.imageFile);
    if (refFormats.length) {
      sub.push(`<div class="card-label" style="margin-bottom:12px">REFERENCIAS DE ADS ACTIVOS (REELS / STORIES / CARRUSELES)</div>`);
      sub.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">`);
      for (const ef of refFormats) {
        sub.push(`<div>`);
        if (ef.postUrl) {
          const embedUrl = ef.postUrl.replace(/\/$/, "") + "/embed";
          sub.push(`<iframe src="${embedUrl}" style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
        } else if (ef.imageFile) {
          const imgB64 = loadAssetBase64(ef.imageFile);
          if (imgB64) {
            sub.push(`<img src="${imgB64}" style="width:100%;min-height:430px;object-fit:cover;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;display:block" alt="">`);
          } else {
            sub.push(`<div style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;color:${COLORS.muted};font-size:13px">Imagen no disponible</div>`);
          }
        }
        // Dolor / Solucion card
        sub.push(`<div style="padding:10px 12px;border:1px solid ${COLORS.border};border-top:none;border-radius:0 0 8px 8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06);font-size:12px;line-height:1.5">`);
        sub.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span><span style="color:${COLORS.red};font-weight:700">Dolor:</span> ${escapeHtml(ef.dolor)}</span></div>`);
        if (ef.solucion) {
          sub.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:8px 0">`);
          sub.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span><span style="color:#16a34a;font-weight:700">Solucion:</span> ${escapeHtml(ef.solucion)}</span></div>`);
        }
        sub.push(`</div>`);
        sub.push(`</div>`);
      }
      sub.push(`</div>`);
    }

    parts.push(subsection(num, subNum, "Competencia", sub.join("\n")));
  }

  // ── Subsection: ICPs ───────────────────────────────────────────────
  if (data.icp.length) {
    subNum++;
    const sub: string[] = [];
    const personIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

    sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">${data.icp.length} perfiles de cliente ideal. Cada uno tiene <strong>dolores</strong>, <strong>deseos</strong> y <strong>objeciones</strong> que atacamos con los <strong>angulos creativos</strong>.</p>`);

    sub.push(`<div style="display:grid;gap:16px;margin-bottom:24px">`);
    for (let i = 0; i < data.icp.length; i++) {
      const icpItem = data.icp[i];
      const isPrimario = icpItem.prioridad === "primario";

      sub.push(`<div style="border:1px solid ${COLORS.border};border-radius:8px;border-left:4px solid ${COLORS.red};box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden">`);

      // Header
      sub.push(`<div style="padding:18px 20px 14px;display:flex;align-items:center;gap:12px">`);
      sub.push(`<div style="width:38px;height:38px;border-radius:50%;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">${personIcon}</div>`);
      sub.push(`<div style="flex:1">`);
      sub.push(`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">`);
      sub.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">ICP ${i + 1}</span>`);
      sub.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px">${escapeHtml(icpItem.segmento)}</span>`);
      sub.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isPrimario ? `background:${COLORS.ink};color:${COLORS.surface}` : `background:${COLORS.bg};color:${COLORS.muted};border:1px solid ${COLORS.border}`}">${isPrimario ? "Primario" : "Secundario"}</span>`);
      const isRecurrente = icpItem.recurrencia === "alta" || icpItem.recurrencia === "media";
      sub.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isRecurrente ? `background:#F0FDF4;color:#22C55E;border:1px solid #BBF7D0` : `background:${COLORS.gapBg};color:${COLORS.escenario2};border:1px solid #FDE68A`}">${isRecurrente ? "Consumo recurrente" : "Consumo ocasional"}</span>`);
      sub.push(`</div></div></div>`);

      // Description
      sub.push(`<div style="padding:0 20px 14px"><p style="font-size:13px;color:${COLORS.muted};margin:0;line-height:1.6">${escapeHtml(icpItem.descripcion)}</p></div>`);

      // Dolores / Deseos / Objeciones grid
      sub.push(`<div style="padding:0 20px 20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">`);

      sub.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Dolores</div>`);
      sub.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const dolor of icpItem.dolores) sub.push(`<li style="margin-bottom:4px">${escapeHtml(dolor)}</li>`);
      sub.push(`</ul></div>`);

      sub.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#22C55E;font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Deseos</div>`);
      sub.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const deseo of icpItem.deseos) sub.push(`<li style="margin-bottom:4px">${escapeHtml(deseo)}</li>`);
      sub.push(`</ul></div>`);

      sub.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.escenario2};font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Objeciones</div>`);
      sub.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const obj of icpItem.objeciones) sub.push(`<li style="margin-bottom:4px">${escapeHtml(obj)}</li>`);
      sub.push(`</ul></div>`);

      sub.push(`</div></div>`);
    }
    sub.push(`</div>`);

    parts.push(subsection(num, subNum, "ICPs", sub.join("\n")));
  }

  // ── Subsection: Angulos Creativos + Piezas ─────────────────────────
  if (data.creativos?.piezasPorIcp?.length || data.creativos?.angulos?.length) {
    subNum++;
    const sub: string[] = [];

    const piezasPorIcpCount = data.creativos?.piezasPorIcp?.length ? data.creativos.piezasPorIcp[0].piezas.length : 0;
    const totalIcps = data.creativos?.piezasPorIcp?.length ?? 0;
    const totalEnUso = piezasPorIcpCount * totalIcps;

    if (totalEnUso > 0) {
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px"><strong>${totalEnUso} piezas en uso</strong> (${piezasPorIcpCount} por cada ICP). Cada pieza ataca un dolor especifico y comunica una solucion.</p>`);
    }

    // ICP exclusion callout (secondary ICPs with low recurrence not included in piezas)
    const excludedIcps = data.icp.filter(i => i.prioridad === "secundario" && i.recurrencia === "baja");
    for (const excluded of excludedIcps) {
      sub.push(`<div style="padding:14px 18px;background:${COLORS.gapBg};border-left:3px solid ${COLORS.escenario2};border-radius:0 6px 6px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>ICP de ${escapeHtml(excluded.segmento)}</strong> no se incluye en esta etapa. Su consumo es ocasional y conviene optimizar los recursos de produccion creativa y presupuesto de ads, hacia los ICPs de consumo recurrente, que tienen mejor retorno para el negocio.</div>`);
    }

    const videoIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
    const imgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
    const shopIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;

    if (data.creativos?.piezasPorIcp?.length) {
      for (let g = 0; g < data.creativos.piezasPorIcp.length; g++) {
        const grupo = data.creativos.piezasPorIcp[g];
        const piezaCount = grupo.piezas.length;

        sub.push(`<details style="border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.05)">`);
        sub.push(`<summary style="padding:16px 20px;cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;user-select:none;background:${COLORS.bg};border-radius:8px">`);
        sub.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">ICP ${g + 1}</span>`);
        sub.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px;flex:1">${escapeHtml(grupo.icp)}</span>`);
        sub.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted}">${piezaCount} piezas</span>`);
        sub.push(`</summary>`);

        sub.push(`<div style="padding:12px 20px 20px;display:grid;gap:10px">`);
        for (let p = 0; p < grupo.piezas.length; p++) {
          const pieza = grupo.piezas[p];
          const fmt = pieza.formato.toLowerCase();
          const isVideo = fmt.includes("video") || fmt.includes("ugc");
          const isShopping = fmt.includes("shopping") || fmt.includes("catalogo");
          const borderLeft = isVideo ? `border-left:4px solid ${COLORS.red}` : isShopping ? `border-left:4px solid #EA580C` : `border-left:4px solid ${COLORS.border}`;
          const formatIcon = isVideo ? videoIcon : isShopping ? shopIcon : imgIcon;
          const formatBadgeBg = isVideo ? COLORS.red : isShopping ? "#EA580C" : COLORS.bg;
          const formatBadgeColor = isVideo || isShopping ? "#fff" : COLORS.muted;

          sub.push(`<div style="padding:14px 16px;border:1px solid ${COLORS.border};border-radius:8px;${borderLeft};background:${COLORS.surface}">`);
          sub.push(`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">`);
          sub.push(`<span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;background:${formatBadgeBg};color:${formatBadgeColor};font-family:${FONTS.mono}">${formatIcon}${escapeHtml(pieza.formato)}</span>`);
          sub.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted}">Pieza ${p + 1}/${piezaCount}</span>`);
          sub.push(`</div>`);

          sub.push(`<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">`);
          sub.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`);
          sub.push(`<span style="font-size:13px;line-height:1.5"><span style="color:${COLORS.red};font-weight:700">Dolor:</span> ${escapeHtml(pieza.dolor)}</span>`);
          sub.push(`</div>`);

          sub.push(`<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">`);
          sub.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`);
          sub.push(`<span style="font-size:13px;line-height:1.5"><span style="color:#16a34a;font-weight:700">Solucion:</span> ${escapeHtml(pieza.solucion)}</span>`);
          sub.push(`</div>`);

          sub.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:8px 0">`);
          if (isVideo && pieza.hook) {
            sub.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px">Guion</div>`);
            sub.push(`<div style="display:grid;gap:6px;font-size:12px;line-height:1.5">`);
            sub.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:${COLORS.red};font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">HOOK</span><span>${escapeHtml(pieza.hook)}</span></div>`);
            if (pieza.body) sub.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:${COLORS.ink};font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">BODY</span><span>${escapeHtml(pieza.body)}</span></div>`);
            if (pieza.cta) sub.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:#16a34a;font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">CTA</span><span>${escapeHtml(pieza.cta)}</span></div>`);
            sub.push(`</div>`);
          } else if (pieza.mensajes && pieza.mensajes.length) {
            sub.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px">Mensajes</div>`);
            sub.push(`<ul style="margin:0;padding-left:16px;font-size:12px;line-height:1.7;color:${COLORS.ink}">`);
            for (const msg of pieza.mensajes) sub.push(`<li>${escapeHtml(msg)}</li>`);
            sub.push(`</ul>`);
          } else {
            sub.push(`<div style="display:flex;align-items:flex-start;gap:6px">`);
            sub.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`);
            sub.push(`<span style="font-size:12px;color:${COLORS.muted};line-height:1.5;font-style:italic">${escapeHtml(pieza.comunicacion)}</span>`);
            sub.push(`</div>`);
          }

          sub.push(`</div>`);
        }
        sub.push(`</div></details>`);
      }
    }

    if (data.creativos?.tono) {
      sub.push(`<div class="callout" style="margin-bottom:12px"><strong>Tono de comunicacion:</strong> ${escapeHtml(data.creativos.tono)}</div>`);
    }

    parts.push(subsection(num, subNum, `Angulos Creativos + Piezas <span style="display:inline-block;font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;margin-left:8px;vertical-align:middle;letter-spacing:0.5px;text-transform:uppercase">En Desarrollo</span>`, sub.join("\n")));
  }

  // ── Subsection: Campaign in Meta Ads (per dev campaign) ────────────
  for (const camp of devCampaigns) {
    subNum++;
    const sub: string[] = [];

    // Relationship to active campaigns
    const activeCamps = data.arquitectura.filter(c => c.status === "activa");
    if (activeCamps.length) {
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Las audiencias son las mismas que en ${activeCamps.map(c => c.objetivo).join(" y ")}. <strong>Mismo publico, distinto objetivo.</strong></p>`);
    }

    // Campaign definition card
    sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px">`);

    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de Campaña</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(camp.objetivo)}</p></div>`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Destino</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(camp.destino ?? (data.clientInfo.sitioWeb ? data.clientInfo.sitioWeb + "/[producto]" : "e-commerce"))}</p></div>`);

    sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Audiencias
    sub.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencias</div>`);
    for (let ai = 0; ai < camp.adSets.length; ai++) {
      const adSet = camp.adSets[ai];
      const { edad, locacion, intereses } = parseSegmentacion(adSet.segmentacion);

      if (ai > 0) sub.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:12px 0">`);
      sub.push(`<div style="font-size:13px;font-weight:700;color:${COLORS.red};margin:${ai === 0 ? "8" : "4"}px 0 4px;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(adSet.nombre)}</div>`);
      sub.push(`<ul style="font-size:14px;margin:4px 0 0;padding-left:20px;line-height:1.8">`);
      sub.push(`<li><span style="font-weight:600">Edad:</span> ${escapeHtml(edad)}</li>`);
      if (locacion) sub.push(`<li><span style="font-weight:600">Locación:</span> ${escapeHtml(locacion)}</li>`);
      if (intereses.length) sub.push(`<li><span style="font-weight:600">Intereses:</span> ${intereses.map(i => escapeHtml(i)).join(", ")}</li>`);
      sub.push(`</ul>`);
    }
    sub.push(`</div>`);

    sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Conversion + Presupuesto
    const kpisText = camp.kpisCampana?.length ? camp.kpisCampana.join(" / ") : "Por definir";
    const presupuestoText = camp.presupuestoCampana
      ? `${camp.presupuestoCampana.mensual} <span style="font-weight:400;color:${COLORS.muted}">(${camp.presupuestoCampana.diario})</span>`
      : "Por definir";
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversion</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(kpisText)}</p></div>`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${presupuestoText}</p></div>`);

    // KPIs row
    if (camp.kpisCampana?.length) {
      sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);
      sub.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>KPIs a evaluar</div><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">${camp.kpisCampana.map(k => `<span style="font-size:13px;font-weight:600;padding:6px 14px;background:#fff;border:1px solid ${COLORS.border};border-radius:6px">${escapeHtml(k)}</span>`).join("")}</div></div>`);
    }

    sub.push(`</div></div>`);

    // Nomenclatura card
    const totalAds = camp.adSets.reduce((sum, as_) => sum + as_.ads.length, 0);
    const campNameParts = camp.nombre.split("_");
    const campSuffix = campNameParts.length > 1 ? campNameParts.slice(1).join("_") : camp.nombre;

    sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">`);
    sub.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>Campaña</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${slug}_${escapeHtml(campSuffix)}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">{Empresa}_{Objetivo}</p></div>`);
    sub.push(`<div style="text-align:center;padding:12px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Ad Sets (${camp.adSets.length})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${escapeHtml(camp.adSets[0]?.nombre || "")}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Conjunto_{ICP}</p></div>`);
    sub.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Ads (${totalAds})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">Anuncio_VideoUGC_V1</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Anuncio_{Formato}_{Angulo}_{V}</p></div>`);
    sub.push(`</div></div>`);

    parts.push(subsection(num, subNum, `Campaña ${camp.objetivo} en Meta Ads`, sub.join("\n")));
  }

  // ── Subsection: Ecommerce ──────────────────────────────────────────
  if (data.pricingComparativa || data.ofertas?.length || data.cambiosEcommerce?.length) {
    subNum++;
    const sub: string[] = [];

    // Pricing comparativa
    if (data.pricingComparativa) {
      const pc = data.pricingComparativa;
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">${escapeHtml(pc.titulo)}</p>`);
      sub.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>${escapeHtml(pc.titulo)}</div>`);
      sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
      sub.push(`<table style="width:100%;margin:0"><thead><tr><th style="text-align:left">Producto</th><th style="text-align:right">Precio</th><th style="text-align:right">Precio/kg</th><th style="text-align:center">Diferencia</th></tr></thead><tbody>`);
      for (const row of pc.rows) {
        const isRef = row.esReferencia;
        const rowStyle = isRef ? `style="border-top:2px solid ${COLORS.border}"` : "";
        const diffBadge = row.diferencia
          ? (isRef
            ? `<span style="background:#FEF2F2;color:#991B1B;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">Referencia</span>`
            : `<span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">${escapeHtml(row.diferencia)}</span>`)
          : "";
        const priceColor = isRef ? `;font-weight:700;color:${COLORS.red}` : ";font-weight:700";
        sub.push(`<tr ${rowStyle}><td><strong>${escapeHtml(row.marca)}</strong> ${escapeHtml(row.producto)}</td><td style="text-align:right">${escapeHtml(row.precio)}</td><td style="text-align:right${priceColor}">${escapeHtml(row.precioPorKg)}</td><td style="text-align:center">${diffBadge}</td></tr>`);
      }
      sub.push(`</tbody></table>`);
      sub.push(`<p style="font-size:13px;color:${COLORS.muted};margin:12px 0 0">${pc.fuente}</p>`);
      sub.push(`</div>`);

      if (pc.sugerencia) {
        sub.push(`<div style="padding:16px 20px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;margin-bottom:24px;font-size:14px;line-height:1.65;color:#9A3412"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${pc.sugerencia}</div>`);
      }
    }

    // Ofertas
    if (data.ofertas && data.ofertas.length) {
      sub.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Ofertas propuestas</div>`);
      sub.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">`);
      for (const oferta of data.ofertas) {
        sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06)">`);
        sub.push(`<div style="font-size:15px;font-weight:700;margin-bottom:8px">${escapeHtml(oferta.nombre)}</div>`);
        const descParts = oferta.descripcion.split(". ");
        const itemsPart = descParts[0];
        const closingSentences = descParts.slice(1).join(". ");
        const items = itemsPart.split(" + ").map((s: string) => s.trim()).filter(Boolean);
        if (items.length > 1) {
          sub.push(`<ul style="font-size:13px;line-height:1.8;color:${COLORS.muted};margin:0 0 8px;padding-left:18px">`);
          for (const item of items) sub.push(`<li>${escapeHtml(item)}</li>`);
          sub.push(`</ul>`);
          if (closingSentences) sub.push(`<p style="font-size:13px;line-height:1.5;color:${COLORS.muted};margin:0 0 12px">${escapeHtml(closingSentences)}</p>`);
        } else {
          sub.push(`<p style="font-size:14px;line-height:1.6;color:${COLORS.muted};margin:0 0 12px">${escapeHtml(oferta.descripcion)}</p>`);
        }
        const contacto = data.clientInfo.nombreContacto ?? "el cliente";
        sub.push(`<div style="font-family:${FONTS.mono};font-size:13px;font-weight:600;color:${oferta.precio ? COLORS.red : COLORS.escenario2}">${oferta.precio ? escapeHtml(oferta.precio) : `Precio por definir con ${escapeHtml(contacto)}`}</div>`);
        sub.push(`</div>`);
      }
      sub.push(`</div>`);
    }

    // Cambios ecommerce
    if (data.cambiosEcommerce && data.cambiosEcommerce.length) {
      const plataforma = data.requerimientosCliente.accesoPlataforma?.nombrePlataforma ?? "e-commerce";
      sub.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Cambios en ${escapeHtml(plataforma)}</div>`);
      sub.push(`<table>`);
      sub.push(`<thead><tr><th>Cambio</th><th>Objetivo</th></tr></thead>`);
      sub.push(`<tbody>`);
      for (const cambio of data.cambiosEcommerce) {
        sub.push(`<tr><td>${escapeHtml(cambio.cambio)}</td><td>${escapeHtml(cambio.objetivo)}</td></tr>`);
      }
      sub.push(`</tbody></table>`);
    }

    const contacto = data.clientInfo.nombreContacto ?? "El cliente";
    sub.push(`<div class="callout callout-red" style="margin-top:16px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>Accion requerida:</strong> ${escapeHtml(contacto)} debe crear estos productos/packs antes de lanzar la campaña.</div>`);
    parts.push(subsection(num, subNum, "Ecommerce", sub.join("\n")));
  }

  const campNames = devCampaigns.map(c => c.objetivo).join(" + ");
  return section(num, "foundation-campaign", `Foundation ${campNames}`, parts.join("\n"));
}

// ─── REE Metrics ─────────────────────────────────────────────────────

function renderReeMetrics(data: FoundationData, num: number): string {
  const parts: string[] = [];
  const plataforma = data.requerimientosCliente.accesoPlataforma?.nombrePlataforma ?? "tu plataforma";

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Es la plataforma de performance donde vas a poder ver en tiempo real como rinden tus campañas. Accedes desde cualquier dispositivo, las 24 horas.</p>`);

  parts.push(`<h3>Como ingresar</h3>`);

  const pasos = [
    { num: "1", titulo: "Ingresa a REE Metrics", desc: "Abri el link en tu navegador (celular o computadora)." },
    { num: "2", titulo: "Inicia sesion", desc: `Usa las credenciales que te enviamos. Tu cuenta publicitaria ya esta configurada.` },
  ];

  parts.push(`<div style="display:grid;gap:12px;margin-bottom:24px">`);
  for (const paso of pasos) {
    parts.push(`<div style="display:flex;align-items:flex-start;gap:14px;padding:16px 20px;border:1px solid ${COLORS.border};border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:14px;font-weight:700;color:${COLORS.surface};background:${COLORS.red};width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;flex-shrink:0">${paso.num}</span>`);
    parts.push(`<div>`);
    parts.push(`<div style="font-weight:700;font-size:14px;margin-bottom:2px">${paso.titulo}</div>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};line-height:1.5">${paso.desc}</div>`);
    parts.push(`</div></div>`);
  }
  parts.push(`</div>`);

  // Link directo
  parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;display:flex;align-items:center;gap:12px">`);
  parts.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`);
  parts.push(`<div><div style="font-size:12px;color:${COLORS.muted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Link directo</div>`);
  parts.push(`<a href="https://metrics.reecreativos.com/" target="_blank" style="font-family:${FONTS.mono};font-size:14px;font-weight:700;color:${COLORS.red};text-decoration:none">metrics.reecreativos.com</a></div>`);
  parts.push(`</div>`);

  // Que vas a ver
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Que vas a ver</h3>`);
  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px">La plataforma conecta tus sistemas en un solo lugar para que puedas ver como rinde tu inversion:</p>`);

  const features = [
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`, titulo: "Dashboard", desc: `Conexion con ${escapeHtml(plataforma)}, campanas de Meta Ads y crecimiento de Instagram organico. Todo en una sola vista, personalizable segun requerimientos.` },
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por que se escala o se frena cada anuncio (Kill/Scale) para que siempre sepas que se hizo y por que." },
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, titulo: "E-Commerce", desc: `Datos de tu ${escapeHtml(plataforma)}: pedidos, facturacion, ticket promedio, clientes unicos, carritos abandonados, top productos y top clientes.` },
  ];

  parts.push(`<div style="display:grid;gap:12px;margin-bottom:24px">`);
  for (const feat of features) {
    parts.push(`<div style="display:flex;align-items:flex-start;gap:14px;padding:14px 20px;border:1px solid ${COLORS.border};border-radius:8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06)">`);
    parts.push(`<div style="flex-shrink:0;margin-top:2px">${feat.icon}</div>`);
    parts.push(`<div>`);
    parts.push(`<div style="font-weight:700;font-size:14px;margin-bottom:2px">${feat.titulo}</div>`);
    parts.push(`<div style="font-size:13px;color:${COLORS.muted};line-height:1.5">${feat.desc}</div>`);
    parts.push(`</div></div>`);
  }
  parts.push(`</div>`);

  // Disclaimer
  parts.push(`<div class="callout" style="display:flex;align-items:flex-start;gap:12px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div><strong>En constante desarrollo:</strong> REE Metrics es una plataforma que estamos mejorando continuamente. A medida que lancemos las campanas y se genere data, vamos a comenzar a relacionar la informacion entre Meta Ads, ${escapeHtml(plataforma)} e Instagram para tener mayor claridad en la toma de decisiones. En un inicio necesitamos lanzar para despues poder cruzar esa data y optimizar.</div></div>`);

  return section(num, "ree-metrics", "REE Metrics", parts.join("\n"));
}

// ─── Roadmap ─────────────────────────────────────────────────────────

function renderRoadmap(data: FoundationData, num: number): string {
  const parts: string[] = [];

  if (data.roadmap && data.roadmap.length) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Plan de ejecución para las primeras 8 semanas del proyecto:</p>`);

    const fechaISO = data.datosF1?.fechaInicioISO ?? null;

    const milestones = deriveMilestones(data, fechaISO);
    const ganttMilestones: GanttMilestone[] = milestones.map(m => ({
      semana: m.semana,
      label: m.label,
      fecha: fechaISO ? weekDate(fechaISO, m.semana) : "",
    }));
    parts.push(renderGantt(data.roadmap, fechaISO, ganttMilestones));

    // Meetings
    const meets = deriveMeetings(data, fechaISO);
    if (meets.length) {
      parts.push(`<h3 style="margin-top:32px">Reuniones del proyecto</h3>`);
      parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px">Que se cubre en cada reunion agendada:</p>`);

      const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg>`;

      parts.push(`<div style="display:grid;gap:12px">`);
      for (const meet of meets) {
        const isCurrent = meet.status === "current";
        const isDone = meet.status === "done";
        const borderColor = isCurrent ? COLORS.red : isDone ? "#16a34a" : COLORS.border;
        const bg = isCurrent ? `background:rgba(221,5,19,0.03);` : isDone ? `background:rgba(22,163,74,0.04);` : "";
        const badge = isCurrent
          ? `<span style="font-size:10px;font-weight:700;background:${COLORS.red};color:#fff;padding:2px 8px;border-radius:4px;margin-left:8px;letter-spacing:0.5px">HOY</span>`
          : isDone
          ? `<span style="margin-left:4px">${checkIcon}</span>`
          : "";

        // Derive fecha from semana string
        const weekNum = parseInt(meet.semana.replace(/\D/g, ""), 10);
        const meetFecha = fechaISO && weekNum ? weekDate(fechaISO, weekNum) : "";

        parts.push(`<div style="padding:14px 20px;border:1px solid ${borderColor};border-radius:8px;${isCurrent || isDone ? `border-width:2px;` : ""}${bg}">`);
        parts.push(`<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">`);
        parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${isDone ? "#16a34a" : COLORS.red}">${escapeHtml(meet.semana)}</span>`);
        parts.push(`<span style="font-weight:700;font-size:14px">${escapeHtml(meet.nombre)}</span>`);
        if (meetFecha) parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted}">${meetFecha}</span>`);
        parts.push(badge);
        parts.push(`</div>`);
        parts.push(`<p style="font-size:13px;color:${COLORS.ink};margin:0;line-height:1.6">${escapeHtml(meet.desc)}</p>`);
        parts.push(`</div>`);
      }
      parts.push(`</div>`);
    }

  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Roadmap pendiente de definición.</p>`);
  }

  return section(num, "roadmap", "Roadmap de Ejecución", parts.join("\n"));
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

function weekDate(fechaInicioISO: string, semana: number): string {
  const base = new Date(fechaInicioISO + "T00:00:00");
  const d = new Date(base);
  d.setDate(base.getDate() + (semana - 1) * 7);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
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
    if (isCurrent) {
      parts.push(`<div style="font-size:8px;font-weight:700;color:#fff;background:${COLORS.red};border-radius:3px;padding:1px 4px;margin-top:2px;display:inline-block">HOY</div>`);
    }
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

        const allActive = weeks.filter((wk) => weekMap[wk]);
        const isRowFirst = w === allActive[0];
        const isRowLast = w === allActive[allActive.length - 1];

        const radius = isRowFirst && isRowLast ? "4px" : isRowFirst ? "4px 0 0 4px" : isRowLast ? "0 4px 4px 0" : "0";
        const ml = isFirst && !isRowFirst ? "1px" : isRowFirst ? "0" : "-3px";
        const mr = (nextFase !== faseName) && !isRowLast ? "1px" : isRowLast ? "0" : "-3px";
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

  // Milestone row
  if (milestones && milestones.length) {
    parts.push(`<div style="display:grid;grid-template-columns:${cols};border-top:1px solid rgba(14,13,12,0.12)">`);
    parts.push(`<div style="padding:8px 20px"></div>`);
    for (const w of weeks) {
      const ms = milestones.find((m) => m.semana === w);
      const isCurrent = currentWeek === w;
      if (ms) {
        parts.push(`<div style="padding:6px 2px;${cellBorder};text-align:center;${isCurrent ? currentBg : ""}">`);
        parts.push(`<div style="font-family:${FONTS.mono};font-size:8px;font-weight:700;letter-spacing:0.5px;color:${COLORS.red};text-transform:uppercase;white-space:nowrap">${escapeHtml(ms.label)}</div>`);
        if (ms.fecha) parts.push(`<div style="font-family:${FONTS.mono};font-size:8px;color:${COLORS.muted};margin-top:1px">${escapeHtml(ms.fecha)}</div>`);
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

// ─── Proximos Pasos ──────────────────────────────────────────────────

function renderProximosPasos(data: FoundationData, num: number): string {
  const parts: string[] = [];
  const pasos = deriveProximosPasos(data);

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Con tu aprobacion, arrancamos con estos ${pasos.length} bloques de trabajo:</p>`);

  parts.push(`<div style="display:grid;gap:16px">`);
  for (let i = 0; i < pasos.length; i++) {
    const p = pasos[i];
    parts.push(`<div style="border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.red};border-radius:8px;padding:16px 20px">`);
    parts.push(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">0${i + 1}</span>`);
    parts.push(`<span style="font-weight:700;font-size:14px">${escapeHtml(p.titulo)}</span>`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted};background:${COLORS.bg};padding:2px 8px;border-radius:4px">${escapeHtml(p.tiempo)}</span>`);
    parts.push(`<span style="font-size:11px;color:${COLORS.ink};background:${COLORS.bg};padding:2px 8px;border-radius:4px;margin-left:auto">${escapeHtml(p.responsable)}</span>`);
    parts.push(`</div>`);
    for (const item of p.items) {
      parts.push(`<div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;line-height:1.5;margin-bottom:4px">`);
      parts.push(`<span style="color:${COLORS.red};font-size:8px;margin-top:5px;flex-shrink:0">&#9632;</span>`);
      parts.push(`<span>${escapeHtml(item)}</span>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  return section(num, "proximos-pasos", "Proximos Pasos", parts.join("\n"));
}

// ─── Segmentacion parser ─────────────────────────────────────────────

function parseSegmentacion(seg: string): { edad: string; locacion: string; intereses: string[] } {
  const dotIdx = seg.indexOf(". ");
  const beforeDot = dotIdx > -1 ? seg.substring(0, dotIdx) : seg;
  const interesesRaw = dotIdx > -1 ? seg.substring(dotIdx + 2) : "";
  const commaIdx = beforeDot.indexOf(", ");
  const edad = commaIdx > -1 ? beforeDot.substring(0, commaIdx).trim() : beforeDot;
  const locacion = commaIdx > -1 ? beforeDot.substring(commaIdx + 2).trim() : "";
  const intereses = interesesRaw.replace(/^Intereses:\s*/i, "").split(",").map((s: string) => s.trim()).filter(Boolean);
  return { edad, locacion, intereses };
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado por REE Creativos
  </div>`;
}
