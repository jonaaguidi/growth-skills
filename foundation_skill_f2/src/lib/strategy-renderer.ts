import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { FoundationData, RoadmapInitiative, ReviewEtapa, ReviewMilestone, ReviewMeeting, ProximoPaso, CampanaDefinida, PiezaCreativa, ReferenciaCreativa } from "../types/foundation.js";
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
    if (camp.conSubsecciones) {
      etapas.push({
        nombre: camp.tituloSeccion ?? camp.nombre.replace(/^[^_]*_/, ""),
        duracion: "15 min",
        objetivo: `Bajada creativa, referencias y piezas para la campaña de ${camp.objetivo.toLowerCase()}.`,
      });
    } else {
      etapas.push({
        nombre: camp.tituloSeccion ?? camp.nombre.replace(/^[^_]*_/, ""),
        duracion: "10 min",
        objetivo: `Campaña de ${camp.objetivo.toLowerCase()} ya seteada.`,
      });
    }
  }

  for (const camp of devCampaigns) {
    etapas.push({
      nombre: camp.tituloSeccion ?? camp.nombre.replace(/^[^_]*_/, ""),
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

function renderEntregaMaterial(data: FoundationData): string {
  const e = data.entregaMaterial;
  if (!e) return "";
  const arbol = e.arbol?.length
    ? `<pre style="font-family:${FONTS.mono};font-size:12px;line-height:1.6;margin:10px 0 0;padding:12px 14px;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:6px;overflow-x:auto">${e.arbol.map(l => escapeHtml(l)).join("\n")}</pre>`
    : "";
  return `<div class="callout" style="margin:0 0 20px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:7px"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg><strong>Entrega del material en ${escapeHtml(e.destino)}:</strong> ${escapeHtml(e.descripcion)}${arbol}</div>`;
}

// ─── TOC builder ─────────────────────────────────────────────────────

interface TocItem {
  id: string;
  title: string;
  desc: string;
  locked?: boolean;
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
    const tocTitle = camp.tituloSeccion ?? `Campaña de ${camp.objetivo}`;
    const tieneSubs = camp.conSubsecciones && (camp.piezas?.length || camp.referencias?.length);
    if (tieneSubs) {
      const nPiezas = camp.piezas?.length ?? 0;
      const nRefs = camp.referencias?.length ?? 0;
      const detalle = nPiezas
        ? `${nPiezas} piezas a producir${nRefs ? ` y ${nRefs} ya publicadas` : ""}`
        : `${nRefs} piezas ya publicadas`;
      items.push({
        id: slugify(camp.nombre),
        title: tocTitle,
        desc: `Campaña en Meta Ads y piezas creativas, ${detalle}.`,
      });
    } else {
      items.push({
        id: slugify(camp.nombre),
        title: tocTitle,
        desc: `${totalAds} piezas ya seteadas.`,
      });
      if (camp.piezas?.length) {
        items.push({
          id: "piezas-creativas",
          title: "Piezas Creativas",
          desc: `Detalle de las ${camp.piezas.length} piezas de la campaña.`,
        });
      }
    }
  }

  if (devCampaigns.length) {
    const campNames = devCampaigns.find(c => c.tituloSeccion)?.tituloSeccion
      ?? `Foundation ${devCampaigns.map(c => c.objetivo).join(" + ")}`;
    const hasEcom = !!(data.pricingComparativa || data.ofertas?.length || data.cambiosEcommerce?.length);
    items.push({
      id: "foundation-campaign",
      title: campNames,
      desc: hasEcom
        ? "Competencia, audiencias, guiones + piezas creativas, campaña y e-commerce."
        : "Competencia, audiencias, guiones + piezas creativas y campaña.",
    });
  }

  items.push({ id: "ree-metrics", title: "REE Metrics", desc: "Dashboard de performance: como ingresar y que vas a ver." });
  items.push({ id: "roadmap", title: "Roadmap de Ejecución", desc: "Plan de ejecución 8 semanas + reuniones." });
  items.push({ id: "proximos-pasos", title: "Proximos Pasos", desc: "Que sigue con la aprobacion." });

  for (const item of items) {
    if (isLocked(data, item.id)) item.locked = true;
  }

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
    if (camp.conSubsecciones && (camp.piezas?.length || camp.referencias?.length)) {
      sections.push(renderActiveCampaignConSubsecciones(data, camp, sectionNum));
    } else {
      sections.push(renderActiveCampaign(data, camp, sectionNum));
      if (camp.piezas?.length) {
        sectionNum++;
        sections.push(renderCampaignPiezas(data, camp, sectionNum));
      }
    }
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
<title>Foundation Review | ${empresa}</title>
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
  .fr-section.fr-locked {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    margin-bottom: 24px;
    opacity: 0.55;
  }
  .fr-locked-summary {
    font-family: ${FONTS.heading};
    font-weight: 700;
    font-size: 20px;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    user-select: none;
    cursor: not-allowed;
  }
  .fr-locked-badge {
    font-family: ${FONTS.mono};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 3px 10px;
    background: #FEF3C7;
    color: #92400E;
    border-radius: 4px;
    margin-left: auto;
    white-space: nowrap;
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
  details > summary::-webkit-details-marker { display: none; }
  details[open] > summary .pieza-toggle { display: none; }
  details:not([open]) > summary .pieza-toggle-open { display: none; }
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
  const industria = data.clientInfo.industria ? escapeHtml(data.clientInfo.industria) : null;
  const web = data.clientInfo.sitioWeb ? escapeHtml(data.clientInfo.sitioWeb) : null;
  const duracion = data.datosF1?.duracionProyecto ? escapeHtml(data.datosF1.duracionProyecto) : null;
  const campanas = data.datosF1?.campanasVendidas ?? [];

  const logoB64 = getLogoBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  // Logo del cliente sobre chip blanco: los logos de marca suelen tener colores
  // que no contrastan contra el rojo del header. Si no hay logoFile, el header
  // queda exactamente igual que antes.
  const clienteLogoSrc = loadAssetBase64(data.clientInfo.logoFile);
  const brandRow = clienteLogoSrc
    ? `<div style="display:flex;align-items:center;gap:18px;margin-bottom:20px">`
      + (logoB64 ? `<img src="data:image/png;base64,${logoB64}" alt="REE Creativos" style="height:40px;display:block">` : "")
      + `<div style="width:1px;height:34px;background:rgba(255,255,255,0.35)"></div>`
      + `<div style="background:${COLORS.surface};border-radius:8px;padding:8px 16px;display:flex;align-items:center"><img src="${clienteLogoSrc}" alt="${empresa}" style="height:40px;display:block"></div>`
      + `</div>`
    : logoHtml;

  const badgeStyle = `display:inline-block;font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;text-transform:uppercase;letter-spacing:1px;vertical-align:middle;margin-left:10px`;

  return `
  <div class="header" id="top">
    ${brandRow}
    <div class="header-label">FOUNDATION REVIEW</div>
    <div class="header-title">${empresa}<span style="${badgeStyle};background:${COLORS.surface};color:${COLORS.red}">Foundation</span><span style="${badgeStyle};background:rgba(255,255,255,0.15);color:${COLORS.surface};border:1px solid rgba(255,255,255,0.3)">Semana 3</span></div>
    <div class="meta-row">
      ${industria ? `<span>Industria: ${industria}</span>` : ""}
      ${duracion ? `<span>Duracion: ${duracion}</span>` : ""}
      ${web ? `<span>Web: <a href="https://${web}" target="_blank" style="color:rgba(255,255,255,0.7);text-decoration:underline">${web}</a></span>` : ""}
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
      ${items.map((s, i) => s.locked
        ? `<li style="counter-increment:toc;margin-bottom:12px;opacity:0.5"><span style="color:${COLORS.muted};font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted};margin-right:8px;font-weight:600">${String(i + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;letter-spacing:0.5px;padding:2px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;margin-left:8px;vertical-align:middle">EN PREPARACION</span></span><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`
        : `<li style="counter-increment:toc;margin-bottom:12px"><a href="#${s.id}" style="color:${COLORS.ink};text-decoration:none;font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.red};margin-right:8px;font-weight:600">${String(i + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}</a><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Section wrapper (dropdown) ─────────────────────────────────────

function section(num: number, id: string, title: string, html: string, rawTitle?: boolean, locked?: boolean): string {
  const pad = String(num).padStart(2, "0");
  const titleHtml = rawTitle ? title : escapeHtml(title);
  if (locked) {
    // Locked section: no body shipped, not expandable
    return `
  <div class="fr-section fr-locked" id="${id}">
    <div class="fr-locked-summary"><span class="section-num">${pad}</span>${titleHtml}<span class="fr-locked-badge"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#92400E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:5px"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>EN PREPARACION</span></div>
  </div>`;
  }
  return `
  <details class="fr-section" id="${id}">
    <summary><span class="section-num">${pad}</span>${titleHtml}</summary>
    <div class="fr-section-body">
      ${html}
    </div>
  </details>`;
}

function isLocked(data: FoundationData, id: string): boolean {
  return !!data.seccionesBloqueadas?.includes(id);
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
    parts.push(`<div style="flex:1;background:${bg};color:${COLORS.surface};padding:12px 16px;text-align:center;display:flex;flex-direction:column;justify-content:center">`);
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
  if (campaign.descripcionCampana) {
    parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.red};margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de la campaña</div><p style="font-size:14px;line-height:1.65;margin:0">${campaign.descripcionCampana}</p></div>`);
  } else {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">El objetivo es nutrir un público, generar <strong>posicionamiento de marca</strong> y conseguir resultados medibles.</p>`);
  }

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
    const parsed = parseSegmentacion(firstAdSet.segmentacion);
    parts.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencia</div>`);
    parts.push(renderSegmentacion(parsed));
    parts.push(`</div>`);
  }

  // HR
  parts.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

  // KPIs + Presupuesto
  const kpisText = campaign.kpisCampana?.length ? campaign.kpisCampana.join(" / ") : "Por definir";
  const presupuestoText = campaign.presupuestoCampana
    ? `${campaign.presupuestoCampana.diario} / ${campaign.presupuestoCampana.mensual}`
    : "Por definir";
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversión (KPIs)</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(kpisText)}</p></div>`);
  parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(presupuestoText)}</p>${data.presupuesto?.tipoCambioNota ? `<p style="font-size:11px;color:${COLORS.muted};margin:4px 0 0">${escapeHtml(data.presupuesto.tipoCambioNota)}</p>` : ""}</div>`);

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

  // Embed grid: Instagram previews + pending mockups
  const allPieces: { label: string; embedUrl: string | null; isVideo?: boolean; isCarousel?: boolean }[] = [];
  for (const adSet of campaign.adSets) {
    for (const ad of adSet.ads) {
      const pipeIdx = ad.indexOf(" | ");
      if (pipeIdx === -1) continue;
      const lbl = ad.substring(0, pipeIdx);
      const urlP = ad.substring(pipeIdx + 3);
      const reelMatch = urlP.match(/\/reel\/([^/]+)/);
      const postMatch = urlP.match(/\/p\/([^/]+)/);
      if (urlP.startsWith("data:video") || urlP.endsWith(".mp4")) {
        allPieces.push({ label: lbl, embedUrl: urlP, isVideo: true });
      } else if (urlP.startsWith("data:image")) {
        allPieces.push({ label: lbl, embedUrl: urlP, isCarousel: true });
      } else if (reelMatch) {
        allPieces.push({ label: lbl, embedUrl: `https://www.instagram.com/reel/${reelMatch[1]}/embed/` });
      } else if (postMatch) {
        allPieces.push({ label: lbl, embedUrl: `https://www.instagram.com/p/${postMatch[1]}/embed/` });
      } else {
        allPieces.push({ label: lbl, embedUrl: null });
      }
    }
  }
  if (allPieces.length) {
    const readyCount = allPieces.filter(p => p.embedUrl).length;
    const pendingCount = allPieces.length - readyCount;
    parts.push(`<div class="card-label">Preview de piezas (${allPieces.length})</div>`);
    parts.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px">`);
    for (const piece of allPieces) {
      parts.push(`<div style="text-align:center">`);
      if (piece.embedUrl && piece.isVideo) {
        parts.push(`<video src="${piece.embedUrl}" controls playsinline preload="metadata" style="width:100%;aspect-ratio:9/16;border:1px solid ${COLORS.border};border-radius:8px;background:#000;object-fit:cover;display:block"></video>`);
      } else if (piece.embedUrl && piece.isCarousel && !piece.embedUrl.includes("||")) {
        parts.push(`<img src="${piece.embedUrl}" style="width:100%;border:1px solid ${COLORS.border};border-radius:8px;display:block">`);
      } else if (piece.embedUrl && piece.isCarousel) {
        const slides = piece.embedUrl.split("||");
        const slidesHtml = slides
          .map(s => `<img src="${s}" style="width:100%;flex:0 0 100%;scroll-snap-align:start;display:block;object-fit:cover">`)
          .join("");
        parts.push(`<style>.ree-carousel::-webkit-scrollbar{display:none}</style>`);
        parts.push(`<div style="position:relative">`);
        parts.push(`<div class="ree-carousel" onscroll="const i=Math.round(this.scrollLeft/this.clientWidth)+1;this.parentElement.querySelector('.ree-car-ind').textContent=i+' / '+this.children.length" style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;border:1px solid ${COLORS.border};border-radius:8px;background:#000">${slidesHtml}</div>`);
        parts.push(`<div class="ree-car-ind" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none">1 / ${slides.length}</div>`);
        parts.push(`<button type="button" onclick="const c=this.parentElement.querySelector('.ree-carousel');c.scrollBy({left:-c.clientWidth,behavior:'smooth'})" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-size:16px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.3)">&#8249;</button>`);
        parts.push(`<button type="button" onclick="const c=this.parentElement.querySelector('.ree-carousel');c.scrollBy({left:c.clientWidth,behavior:'smooth'})" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-size:16px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.3)">&#8250;</button>`);
        parts.push(`</div>`);
      } else if (piece.embedUrl) {
        parts.push(`<iframe src="${piece.embedUrl}" loading="lazy" style="width:100%;aspect-ratio:9/17.5;min-height:520px;border:1px solid ${COLORS.border};border-radius:8px;background:#fff;display:block" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
      } else {
        parts.push(`<div style="width:100%;min-height:340px;border:2px dashed ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:12px;color:${COLORS.muted};font-weight:600">Mockup pendiente</span><span style="font-size:11px;color:${COLORS.muted}">A definir con Sergio</span></div>`);
      }
      parts.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px">${escapeHtml(piece.label)}</div>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);

    if (pendingCount > 0) {
      parts.push(`<div style="margin-top:16px;padding:12px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:14px;color:#92400e"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>${readyCount} piezas listas</strong> · ${pendingCount} mockups pendientes a definir.</div>`);
    } else {
      const bannerText = campaign.bannerPiezas
        ? `<strong>${escapeHtml(campaign.bannerPiezas)}</strong>`
        : `<strong>${totalAds} piezas listas.</strong> Estas piezas ya están producidas y disponibles para subir a Meta Ads.`;
      parts.push(`<div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:14px;color:#166534"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${bannerText}</div>`);
    }
  }

  const sectionId = slugify(campaign.nombre);
  const sectionTitle = campaign.tituloSeccion ?? `Campaña de ${campaign.objetivo}`;
  return section(num, sectionId, sectionTitle, parts.join("\n"), false, isLocked(data, sectionId));
}

// ─── Active Campaign with Subsections (conSubsecciones) ─────────────

function renderReferenciaMedia(ref: ReferenciaCreativa, minHeight: number): string {
  const isIg = ref.url.includes("instagram.com");
  if (ref.tipo === "video" || ref.url.startsWith("data:video/")) {
    return `<video src="${ref.url}" controls playsinline muted style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};background:#000"></video>`;
  }
  if (ref.tipo === "image" || ref.url.startsWith("data:image/")) {
    return `<img src="${ref.url}" style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};object-fit:cover" />`;
  }
  if (ref.tipo === "iframe" || (isIg && !ref.tipo)) {
    const embedUrl = isIg ? ref.url.replace(/\/$/, "") + "/embed" : ref.url;
    return `<iframe src="${embedUrl}" style="width:100%;min-height:${minHeight}px;border:1px solid ${COLORS.border};border-radius:8px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }
  return `<a href="${escapeHtml(ref.url)}" target="_blank" style="display:flex;width:100%;min-height:200px;border:2px solid ${COLORS.border};border-radius:8px;background:${COLORS.bg};flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><span style="font-size:12px;color:${COLORS.red};font-weight:600">Ver referencia</span></a>`;
}

// Referencia ya publicada, como card expandible: embed + que edicion necesita antes de pautar
function renderReferenciaCard(ref: ReferenciaCreativa, index: number): string {
  const necesitaEdicion = !!ref.edicion;
  const estado = ref.estado ?? (necesitaEdicion ? "Requiere edición" : "Lista para pautar");
  const chip = necesitaEdicion
    ? `background:#FEF3C7;color:#92400E;border:1px solid #FDE68A`
    : `background:#F0FDF4;color:#166534;border:1px solid #BBF7D0`;
  const titulo = ref.titulo ?? `Pieza publicada ${index + 1}`;
  const parts: string[] = [];

  parts.push(`<details style="border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:16px;overflow:hidden">`);
  parts.push(`<summary style="padding:14px 20px;background:${COLORS.bg};display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer;list-style:none;user-select:none">`);
  parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;background:${COLORS.ink};color:${COLORS.surface};text-transform:uppercase">${escapeHtml(ref.formato ?? "Publicada")}</span>`);
  parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted}">Pieza ${index + 1}</span>`);
  parts.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:3px 8px;border-radius:4px;${chip}">${escapeHtml(estado)}</span>`);
  parts.push(`<span style="font-size:13px;color:${COLORS.slate};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(titulo)}</span>`);
  parts.push(`<span class="pieza-toggle" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto">+</span><span class="pieza-toggle-open" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto">&minus;</span>`);
  parts.push(`</summary>`);

  parts.push(`<div style="border-top:1px solid ${COLORS.border};padding:20px;display:grid;grid-template-columns:300px 1fr;gap:24px;align-items:start">`);
  parts.push(`<div>${renderReferenciaMedia(ref, 430)}</div>`);
  parts.push(`<div>`);
  if (ref.edicion) {
    parts.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Edición requerida para pauta</div>`);
    const pasos = Array.isArray(ref.edicion) ? ref.edicion : [ref.edicion];
    parts.push(`<ul style="font-size:14px;line-height:1.65;margin:0 0 16px;padding-left:20px">${pasos.map(e => `<li style="margin-bottom:6px">${escapeHtml(e)}</li>`).join("")}</ul>`);
  } else {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin:0 0 16px;color:${COLORS.muted}">Se pauta tal cual está publicada. No requiere edición.</p>`);
  }
  parts.push(`<div class="card-label" style="margin-bottom:6px">Pieza original</div>`);
  parts.push(`<a href="${escapeHtml(ref.url.startsWith("data:") ? "#" : ref.url)}" target="_blank" style="font-size:12px;font-family:${FONTS.mono};color:${COLORS.red};text-decoration:none;word-break:break-all">${escapeHtml(ref.url.startsWith("data:") ? "Archivo entregado por el equipo del cliente" : ref.url)}</a>`);
  parts.push(`</div></div></details>`);
  return parts.join("\n");
}

function renderActiveCampaignConSubsecciones(data: FoundationData, campaign: CampanaDefinida, num: number): string {
  const parts: string[] = [];
  const slug = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);
  const piezas = campaign.piezas ?? [];
  let subNum = 0;

  // ── Subsection 1: Campaña en Meta Ads ─────────────────────────────
  {
    subNum++;
    const sub: string[] = [];

    sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:8px">Campaña de <strong>${escapeHtml(campaign.objetivo.toLowerCase())}</strong> hacia ${campaign.destino ? escapeHtml(campaign.destino.toLowerCase()) : "el destino definido"} de <strong>${slug}</strong>.</p>`);
    if (campaign.descripcionCampana) {
      sub.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.red};margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de la campaña</div><p style="font-size:14px;line-height:1.65;margin:0">${campaign.descripcionCampana}</p></div>`);
    }

    // Campaign definition card
    sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px">`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de Campaña</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(campaign.objetivo)}</p></div>`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Destino</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(campaign.destino ?? "Por definir")}</p></div>`);

    sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Audiencia
    const firstAdSet = campaign.adSets[0];
    if (firstAdSet) {
      const parsed = parseSegmentacion(firstAdSet.segmentacion);
      sub.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencia</div>`);
      sub.push(renderSegmentacion(parsed));
      sub.push(`</div>`);
    }

    sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // KPIs + Presupuesto
    const kpisText = campaign.kpisCampana?.length ? campaign.kpisCampana.join(" / ") : "Por definir";
    const presupuestoText = campaign.presupuestoCampana
      ? `${campaign.presupuestoCampana.diario} / ${campaign.presupuestoCampana.mensual}`
      : "Por definir";
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversión (KPIs)</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(kpisText)}</p></div>`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(presupuestoText)}</p>${data.presupuesto?.tipoCambioNota ? `<p style="font-size:11px;color:${COLORS.muted};margin:4px 0 0">${escapeHtml(data.presupuesto.tipoCambioNota)}</p>` : ""}</div>`);
    sub.push(`</div></div>`);

    // Nomenclatura card
    const totalAds = campaign.adSets.reduce((sum, as_) => sum + as_.ads.length, 0);
    const campNameParts = campaign.nombre.split("_");
    const campSuffix = campNameParts.length > 1 ? campNameParts.slice(1).join("_") : campaign.nombre;

    sub.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">`);
    sub.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>Campaña</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${slug}_${escapeHtml(campSuffix)}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">{Empresa}_{Objetivo}</p></div>`);
    sub.push(`<div style="text-align:center;padding:12px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Ad Set</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${escapeHtml(campaign.adSets[0]?.nombre || "")}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Conjunto_{Audiencia}</p></div>`);
    sub.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Ads (${totalAds})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">Anuncio_Reel_V1</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Anuncio_{Formato}_{Angulo}_{V}</p></div>`);
    sub.push(`</div></div>`);

    parts.push(subsection(num, subNum, campaign.tituloSubseccion ?? `Campaña ${campaign.objetivo} en Meta Ads`, sub.join("\n")));
  }

  // ── Subsection 2: Guiones + Piezas Creativas ──────────────────────
  {
    subNum++;
    const sub: string[] = [];

    const videoCount = piezas.filter(p => p.formato.toLowerCase().includes("reel") || p.formato.toLowerCase().includes("video")).length;
    const staticCount = piezas.length - videoCount;

    const campLabel = campaign.tituloSeccion
      ? campaign.tituloSeccion.replace(/^Campaña\s+(de\s+)?/i, "")
      : campaign.objetivo.toLowerCase();
    const refs = campaign.referencias ?? [];
    const nRefs = refs.length;
    const nEdiciones = refs.filter(r => !!r.edicion).length;
    const totalLanzamiento = piezas.length + nRefs;
    if (piezas.length) {
      const mix = `${videoCount > 0 ? `<strong>${videoCount} video${videoCount > 1 ? "s" : ""}</strong>` : ""}${videoCount > 0 && staticCount > 0 ? " + " : ""}${staticCount > 0 ? `<strong>${staticCount} posteo${staticCount > 1 ? "s" : ""}</strong>` : ""}`;
      if (nRefs) {
        const conEdicion = nEdiciones === nRefs
          ? ", todas con una edición previa para pauta"
          : nEdiciones > 0
            ? `, ${nEdiciones} de ellas con una edición previa para pauta`
            : "";
        sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">La campaña de ${escapeHtml(campLabel)} se lanza con <strong>${totalLanzamiento} piezas</strong>: <strong>${nRefs} ya publicadas</strong> que se reutilizan${conEdicion}, y <strong>${piezas.length} a producir</strong> — ${mix}.</p>`);
      } else {
        sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Bajada creativa de las <strong>${piezas.length} piezas a producir</strong> de la campaña de ${escapeHtml(campLabel)}. ${mix}.</p>`);
      }
    } else {
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">La campaña de ${escapeHtml(campLabel)} se arma con <strong>${nRefs} piezas ya publicadas</strong> en el perfil. No requiere producción nueva.</p>`);
    }

    sub.push(renderEntregaMaterial(data));

    // Campaign references: cards expandibles si alguna trae detalle de edicion, si no grilla simple
    if (nRefs) {
      const titulo = nEdiciones > 0 ? "PIEZAS YA PUBLICADAS" : "REFERENCIAS";
      sub.push(`<div class="card-label" style="margin-bottom:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>${titulo} (${nRefs})</div>`);

      const conDetalle = refs.some(r => !!r.edicion || !!r.estado || !!r.formato);
      if (conDetalle) {
        if (nEdiciones > 0) {
          sub.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:16px">Piezas que ya viven en el perfil y se reutilizan para pauta. Abrí cada una para ver qué edición necesita antes de subirla.</p>`);
        }
        for (let i = 0; i < refs.length; i++) {
          sub.push(renderReferenciaCard(refs[i], i));
        }
        sub.push(`<div style="margin-bottom:24px"></div>`);
      } else {
        sub.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">`);
        for (const ref of refs) {
          sub.push(`<div>`);
          sub.push(ref.url
            ? renderReferenciaMedia(ref, 430)
            : `<div style="width:100%;min-height:200px;border:2px dashed ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:12px;color:${COLORS.muted};font-weight:600">Referencia pendiente</span></div>`);
          if (ref.titulo) {
            sub.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px">${escapeHtml(ref.titulo)}</div>`);
          }
          sub.push(`</div>`);
        }
        sub.push(`</div>`);
      }
    }

    // Piezas
    for (let i = 0; i < piezas.length; i++) {
      sub.push(renderPiezaCardStrategy(piezas[i], i));
    }

    // Postes directos (contenido orgánico a postear desde el perfil)
    if (campaign.postesDirectos?.length) {
      sub.push(`<div class="card-label" style="margin-top:28px;margin-bottom:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>POSTEOS DIRECTOS DESDE EL PERFIL (${campaign.postesDirectos.length})</div>`);
      sub.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:16px">Contenido a publicar orgánicamente desde el perfil de Instagram, sin pauta.</p>`);
      sub.push(`<div style="display:grid;grid-template-columns:repeat(${Math.min(campaign.postesDirectos.length, 3)},1fr);gap:12px;margin-bottom:24px">`);
      for (const ref of campaign.postesDirectos) {
        sub.push(`<div>`);
        if (ref.url) {
          const isIg = ref.url.includes("instagram.com");
          if (ref.tipo === "video" || ref.url.startsWith("data:video/")) {
            sub.push(`<video src="${ref.url}" controls playsinline muted style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};background:#000"></video>`);
          } else if (ref.tipo === "image" || ref.url.startsWith("data:image/")) {
            sub.push(`<img src="${ref.url}" style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};object-fit:cover" />`);
          } else if (isIg) {
            const embedUrl = ref.url.replace(/\/$/, "") + "/embed";
            sub.push(`<iframe src="${embedUrl}" style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
          } else {
            sub.push(`<a href="${escapeHtml(ref.url)}" target="_blank" style="display:block;width:100%;min-height:200px;border:2px solid ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><span style="font-size:12px;color:${COLORS.red};font-weight:600">Ver post</span></a>`);
          }
        }
        if (ref.titulo) {
          sub.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px">${escapeHtml(ref.titulo)}</div>`);
        }
        sub.push(`</div>`);
      }
      sub.push(`</div>`);
    }

    let subTitle = `Guiones + Piezas Creativas`;
    if (campaign.badgesPiezas?.length) {
      const badgeStyles = [
        `background:#FEF3C7;color:#92400E`,
        `background:${COLORS.bg};color:${COLORS.muted};border:1px solid ${COLORS.border}`,
      ];
      const badges = campaign.badgesPiezas.map((b, i) =>
        `<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:3px 8px;border-radius:4px;margin-left:10px;vertical-align:2px;${badgeStyles[Math.min(i, badgeStyles.length - 1)]}">${escapeHtml(b)}</span>`
      ).join("");
      subTitle = `${subTitle}${badges}`;
    }

    parts.push(subsection(num, subNum, subTitle, sub.join("\n")));
  }

  const sectionId = slugify(campaign.nombre);
  const sectionTitle = campaign.tituloSeccion ?? `Campaña de ${campaign.objetivo}`;
  return section(num, sectionId, sectionTitle, parts.join("\n"), false, isLocked(data, sectionId));
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
      sub.push(`<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:20px">`);
      for (const comp of competidores) {
        const avatarSrc = comp.avatarFile?.startsWith("data:") ? comp.avatarFile : loadAssetBase64(comp.avatarFile);
        const avatarImg = avatarSrc
          ? `<img src="${avatarSrc}" width="28" height="28" style="border-radius:50%;object-fit:cover;flex-shrink:0" alt="${escapeHtml(comp.nombre)}">`
          : `<div style="width:28px;height:28px;border-radius:50%;background:${COLORS.border};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:${COLORS.muted};flex-shrink:0">${comp.nombre.charAt(0)}</div>`;
        const avatarHtml = comp.instagramUrl
          ? `<a href="${escapeHtml(comp.instagramUrl)}" target="_blank" style="display:inline-block;line-height:0">${avatarImg}</a>`
          : avatarImg;
        const nombreHtml = comp.instagramUrl
          ? `<a href="${escapeHtml(comp.instagramUrl)}" target="_blank" style="font-weight:600;font-size:12px;color:inherit;text-decoration:none">${escapeHtml(comp.nombre)}</a>`
          : `<span style="font-weight:600;font-size:12px">${escapeHtml(comp.nombre)}</span>`;
        const adLibLink = comp.instagramUrl
          ? `<div style="margin-top:4px"><a href="${escapeHtml(comp.instagramUrl)}" target="_blank" style="font-size:10px;color:${COLORS.red};text-decoration:none;font-weight:600">Ver en Ad Library →</a></div>`
          : "";
        sub.push(`<div style="padding:8px 10px;border:1px solid ${COLORS.border};border-radius:8px;background:${COLORS.surface};display:flex;align-items:flex-start;gap:8px">`);
        sub.push(`<div style="padding-top:1px">${avatarHtml}</div>`);
        sub.push(`<div>${nombreHtml}<div style="font-size:11px;color:${COLORS.muted};line-height:1.4;margin-top:2px">${escapeHtml(comp.estado)}</div>${adLibLink}</div>`);
        sub.push(`</div>`);
      }
      sub.push(`</div>`);
    }

    // Strategic observation
    if (data.competenciaAds.observacion) {
      sub.push(`<div style="padding:16px 20px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:24px;font-size:14px;line-height:1.65;color:#92400e"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><strong>Oportunidad:</strong> ${escapeHtml(data.competenciaAds.observacion).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>")}</div>`);
    }

    // Flyers de la competencia, agrupados por marca y con tiles de tamaño uniforme
    const flyersComp = data.competenciaAds.referenciasFlyers ?? [];
    if (flyersComp.length) {
      sub.push(`<div class="card-label" style="margin-bottom:12px">FLYERS DE LA COMPETENCIA (${flyersComp.length})</div>`);

      const grupos: { nombre: string; items: ReferenciaCreativa[] }[] = [];
      for (const ref of flyersComp) {
        const g = ref.grupo ?? "";
        const prev = grupos.find(x => x.nombre === g);
        if (prev) prev.items.push(ref);
        else grupos.push({ nombre: g, items: [ref] });
      }

      for (const grupo of grupos) {
        if (grupo.nombre) {
          sub.push(`<div style="font-family:${FONTS.mono};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};margin:4px 0 10px">${escapeHtml(grupo.nombre)}</div>`);
        }
        sub.push(`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">`);
        for (const ref of grupo.items) {
          sub.push(`<div>`);
          sub.push(`<div style="width:100%;aspect-ratio:4/5;border:1px solid ${COLORS.border};border-radius:8px;overflow:hidden;background:${COLORS.ink};display:flex">`);
          if (ref.tipo === "video" || ref.url.startsWith("data:video/")) {
            sub.push(`<video src="${ref.url}" controls playsinline muted preload="metadata" style="width:100%;height:100%;object-fit:cover;display:block"></video>`);
          } else if (ref.url) {
            sub.push(`<img src="${ref.url}" style="width:100%;height:100%;object-fit:cover;display:block" />`);
          } else {
            sub.push(`<div style="width:100%;height:100%;border:2px dashed ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:11px;color:${COLORS.muted};font-weight:600">Pendiente</span></div>`);
          }
          sub.push(`</div>`);
          if (ref.titulo) {
            sub.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px;line-height:1.4">${escapeHtml(ref.titulo)}</div>`);
          }
          sub.push(`</div>`);
        }
        sub.push(`</div>`);
      }
    }

    // Reference ads — formatos with postUrl (iframe) or imageFile (static image)
    const refFormats = data.competenciaAds.formatos.filter(f => f.postUrl || f.imageFile);
    if (refFormats.length) {
      sub.push(`<div class="card-label" style="margin-bottom:12px">REFERENCIAS DE ADS ACTIVOS</div>`);
      // Group formats by brand prefix (text before " — ")
      const brandGroups: { brand: string; items: typeof refFormats }[] = [];
      for (const ef of refFormats) {
        const dashIdx = ef.tipo.indexOf(" — ");
        const brand = dashIdx > -1 ? ef.tipo.substring(0, dashIdx) : "";
        const last = brandGroups[brandGroups.length - 1];
        if (last && last.brand === brand) {
          last.items.push(ef);
        } else {
          brandGroups.push({ brand, items: [ef] });
        }
      }
      for (const group of brandGroups) {
        if (group.brand) {
          sub.push(`<div style="font-size:13px;font-weight:700;margin-bottom:8px;color:${COLORS.ink}">${escapeHtml(group.brand)}</div>`);
        }
        sub.push(`<div style="display:grid;grid-template-columns:repeat(${Math.min(group.items.length, 4)},1fr);gap:12px;margin-bottom:20px">`);
        for (const ef of group.items) {
          const caption = ef.tipo.indexOf(" — ") > -1 ? ef.tipo.substring(ef.tipo.indexOf(" — ") + 3) : ef.tipo;
          sub.push(`<div>`);
          if (ef.postUrl) {
            const embedUrl = ef.postUrl.replace(/\/$/, "") + "/embed";
            sub.push(`<iframe src="${embedUrl}" style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
          } else if (ef.imageFile) {
            const imgSrc = ef.imageFile.startsWith("data:") ? ef.imageFile : loadAssetBase64(ef.imageFile);
            if (imgSrc) {
              sub.push(`<img src="${imgSrc}" style="width:100%;max-height:280px;object-fit:cover;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;display:block" alt="">`);
            } else {
              sub.push(`<div style="width:100%;height:280px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;color:${COLORS.muted};font-size:13px">Imagen no disponible</div>`);
            }
          }
          if (ef.dolor && ef.solucion) {
            // Full dolor/solucion card
            sub.push(`<div style="padding:10px 12px;border:1px solid ${COLORS.border};border-top:none;border-radius:0 0 8px 8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06);font-size:12px;line-height:1.5">`);
            sub.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span><span style="color:${COLORS.red};font-weight:700">Dolor:</span> ${escapeHtml(ef.dolor)}</span></div>`);
            sub.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:8px 0">`);
            sub.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span><span style="color:#16a34a;font-weight:700">Solución:</span> ${escapeHtml(ef.solucion)}</span></div>`);
            sub.push(`</div>`);
          } else {
            // Caption-only card
            sub.push(`<div style="padding:8px 10px;border:1px solid ${COLORS.border};border-top:none;border-radius:0 0 8px 8px;background:${COLORS.surface};font-size:11px;color:${COLORS.muted};line-height:1.4">${escapeHtml(caption)}</div>`);
          }
          sub.push(`</div>`);
        }
        sub.push(`</div>`);
      }
    }

    parts.push(subsection(num, subNum, "Competencia", sub.join("\n")));
  }

  // ── Subsection: ICPs ───────────────────────────────────────────────
  if (data.icp.length) {
    subNum++;
    const sub: string[] = [];
    // Avatar del ICP. Sin `icono` definido se mantiene el circulo generico historico,
    // asi que los clientes que no usan el campo renderizan exactamente igual que antes.
    const ICP_ICON_PATHS: Record<string, string> = {
      hombre: `<path d="M16 3h5v5"/><path d="m21 3-6.75 6.75"/><circle cx="10" cy="14" r="6"/>`,
      mujer: `<path d="M12 15v7"/><path d="M9 19h6"/><circle cx="12" cy="9" r="6"/>`,
      nino: `<circle cx="12" cy="6" r="3.2"/><path d="M12 9.2V16"/><path d="M8 11.5h8"/><path d="m9.5 21 2.5-5 2.5 5"/>`,
      familia: `<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>`,
      persona: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
      empresa: `<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>`,
    };
    const personIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    // Cada tipo de ICP lleva su propio color para distinguirlos de un vistazo.
    const ICP_ICON_COLORS: Record<string, { from: string; to: string; border: string; stroke: string; shadow: string }> = {
      hombre: { from: "#EFF6FF", to: "#DBEAFE", border: "#BFDBFE", stroke: "#1D4ED8", shadow: "rgba(29,78,216,0.12)" },
      mujer: { from: "#FDF2F8", to: "#FCE7F3", border: "#F9BBDD", stroke: "#BE185D", shadow: "rgba(190,24,93,0.12)" },
      nino: { from: "#F0FDF4", to: "#DCFCE7", border: "#BBF7D0", stroke: "#15803D", shadow: "rgba(21,128,61,0.12)" },
    };
    const icpAvatar = (icono?: string | null): string => {
      const paths = icono ? ICP_ICON_PATHS[icono] : undefined;
      if (!paths) return `<div style="width:38px;height:38px;border-radius:50%;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">${personIcon}</div>`;
      const c = (icono && ICP_ICON_COLORS[icono]) || { from: "#FFF5F5", to: "#FFE1E4", border: "#FBC7CC", stroke: COLORS.red, shadow: "rgba(221,5,19,0.10)" };
      return `<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(140deg,${c.from} 0%,${c.to} 100%);border:1px solid ${c.border};box-shadow:inset 0 1px 0 rgba(255,255,255,0.8),0 1px 3px ${c.shadow};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="${c.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></div>`;
    };

    const icpLabel = data.icp.length === 1 ? "1 perfil de cliente ideal. Tiene" : `${data.icp.length} perfiles de cliente ideal. Cada uno tiene`;
    sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">${icpLabel} <strong>dolores</strong>, <strong>deseos</strong> y <strong>objeciones</strong> que atacamos con los <strong>angulos creativos</strong>.</p>`);

    sub.push(`<div style="display:grid;gap:16px;margin-bottom:24px">`);
    for (let i = 0; i < data.icp.length; i++) {
      const icpItem = data.icp[i];
      const isPrimario = icpItem.prioridad === "primario";

      sub.push(`<div style="border:1px solid ${COLORS.border};border-radius:8px;border-left:4px solid ${COLORS.red};box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden">`);

      // Header
      sub.push(`<div style="padding:18px 20px 14px;display:flex;align-items:center;gap:12px">`);
      sub.push(icpAvatar(icpItem.icono));
      sub.push(`<div style="flex:1">`);
      sub.push(`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">`);
      sub.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">ICP ${i + 1}</span>`);
      sub.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px">${escapeHtml(icpItem.segmento)}</span>`);
      if (icpItem.prioridad) {
        sub.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isPrimario ? `background:${COLORS.ink};color:${COLORS.surface}` : `background:${COLORS.bg};color:${COLORS.muted};border:1px solid ${COLORS.border}`}">${isPrimario ? "Primario" : "Secundario"}</span>`);
      }
      const isRecurrente = icpItem.recurrencia === "alta" || icpItem.recurrencia === "media";
      sub.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isRecurrente ? `background:#F0FDF4;color:#22C55E;border:1px solid #BBF7D0` : `background:${COLORS.gapBg};color:${COLORS.escenario2};border:1px solid #FDE68A`}">${escapeHtml(icpItem.badge ?? (isRecurrente ? "Consumo recurrente" : "Consumo ocasional"))}</span>`);
      sub.push(`</div></div></div>`);

      // Description
      sub.push(`<div style="padding:0 20px 14px"><p style="font-size:13px;color:${COLORS.muted};margin:0;line-height:1.6">${escapeHtml(icpItem.descripcion)}</p></div>`);

      // Ejemplos de marcas del perfil (Argentina)
      if (icpItem.ejemplosMarcas?.length) {
        const buildingIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${COLORS.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="9" y1="15" x2="9" y2="15.01"/></svg>`;
        sub.push(`<div style="padding:0 20px 14px">`);
        sub.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px;border:1px dashed ${COLORS.border}">`);
        sub.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.ink};font-weight:600;margin-bottom:10px">${buildingIcon}Ejemplos del perfil en Argentina</div>`);
        sub.push(`<div style="display:grid;grid-template-columns:repeat(${Math.min(icpItem.ejemplosMarcas.length, 3)},1fr);gap:10px">`);
        for (const ej of icpItem.ejemplosMarcas) {
          const ejAvatarSrc = ej.avatarFile ? loadAssetBase64(ej.avatarFile) : "";
          const ejAvatar = ejAvatarSrc
            ? `<img src="${ejAvatarSrc}" width="34" height="34" style="border-radius:50%;object-fit:cover;flex-shrink:0;border:1px solid ${COLORS.border}" alt="${escapeHtml(ej.marca)}">`
            : "";
          sub.push(`<div style="padding:12px;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:6px">`);
          sub.push(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">`);
          if (ejAvatar) sub.push(ejAvatar);
          sub.push(`<div><div style="font-family:${FONTS.heading};font-weight:700;font-size:13px;margin-bottom:2px">${escapeHtml(ej.marca)}</div>`);
          sub.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted}">${escapeHtml(ej.rubro)}</div></div>`);
          sub.push(`</div>`);
          if (ej.rol) {
            const rolIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
            sub.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.ink};margin-bottom:6px">${rolIcon}Decisor: <span style="color:${COLORS.red}">${escapeHtml(ej.rol)}</span></div>`);
          }
          sub.push(`<p style="font-size:12px;color:${COLORS.muted};margin:0;line-height:1.55">${escapeHtml(ej.caso)}</p>`);
          sub.push(`</div>`);
        }
        sub.push(`</div>`);
        sub.push(`</div></div>`);
      }

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

  // ── Subsection: Guiones + Piezas + Referencias ─────────────────────
  if (data.creativos?.piezasPorIcp?.length || data.creativos?.angulos?.length) {
    subNum++;
    const sub: string[] = [];

    const piezasPorIcpCount = data.creativos?.piezasPorIcp?.length ? data.creativos.piezasPorIcp[0].piezas.length : 0;
    const totalIcps = data.creativos?.piezasPorIcp?.length ?? 0;
    const totalEnUso = piezasPorIcpCount * totalIcps;

    if (data.creativos?.resumenPiezas) {
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px"><strong>${escapeHtml(data.creativos.resumenPiezas)}</strong>. Cada pieza ataca un dolor especifico y comunica una solucion.</p>`);
    } else if (totalEnUso > 0) {
      sub.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px"><strong>${totalEnUso} piezas en uso</strong> (${piezasPorIcpCount} por cada ICP). Cada pieza ataca un dolor especifico y comunica una solucion.</p>`);
    }

    sub.push(renderEntregaMaterial(data));

    if (data.creativos?.notaPiezas) {
      sub.push(`<div style="padding:14px 18px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;margin-bottom:20px;font-size:13px;line-height:1.65;color:#92400e"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${data.creativos.notaPiezas}</div>`);
    }

    // Dev campaign references grid (merged into this subsection)
    {
      const allRefs = devCampaigns.flatMap(c => c.referencias ?? []);
      if (allRefs.length) {
        sub.push(`<div class="card-label" style="margin-bottom:12px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>REFERENCIAS (${allRefs.length})</div>`);
        sub.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">`);
        for (const ref of allRefs) {
          sub.push(`<div>`);
          if (ref.url) {
            const isIg = ref.url.includes("instagram.com");
            if (ref.tipo === "carousel") {
              const slides = ref.url.split("||");
              const slidesHtml = slides.map(s => `<img src="${s}" style="width:100%;flex:0 0 100%;scroll-snap-align:start;display:block;object-fit:cover">`).join("");
              sub.push(`<style>.ree-carousel::-webkit-scrollbar{display:none}</style>`);
              sub.push(`<div style="position:relative">`);
              sub.push(`<div class="ree-carousel" onscroll="const i=Math.round(this.scrollLeft/this.clientWidth)+1;this.parentElement.querySelector('.ree-car-ind').textContent=i+' / '+this.children.length" style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;border:1px solid ${COLORS.border};border-radius:8px;background:#000">${slidesHtml}</div>`);
              sub.push(`<div class="ree-car-ind" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.55);color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;pointer-events:none">1 / ${slides.length}</div>`);
              sub.push(`<button type="button" onclick="const c=this.parentElement.querySelector('.ree-carousel');c.scrollBy({left:-c.clientWidth,behavior:'smooth'})" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-size:16px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.3)">&#8249;</button>`);
              sub.push(`<button type="button" onclick="const c=this.parentElement.querySelector('.ree-carousel');c.scrollBy({left:c.clientWidth,behavior:'smooth'})" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;border:none;background:rgba(255,255,255,.92);cursor:pointer;font-size:16px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.3)">&#8250;</button>`);
              sub.push(`</div>`);
            } else if (ref.tipo === "video" || ref.url.startsWith("data:video/")) {
              sub.push(`<video src="${ref.url}" controls playsinline muted style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};background:#000"></video>`);
            } else if (ref.tipo === "image" || ref.url.startsWith("data:image/")) {
              sub.push(`<img src="${ref.url}" style="width:100%;border-radius:8px;border:1px solid ${COLORS.border};object-fit:cover" />`);
            } else if (ref.tipo === "iframe" || (isIg && !ref.tipo)) {
              const embedUrl = isIg ? ref.url.replace(/\/$/, "") + "/embed" : ref.url;
              sub.push(`<iframe src="${embedUrl}" style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
            } else {
              sub.push(`<a href="${escapeHtml(ref.url)}" target="_blank" style="display:block;width:100%;min-height:200px;border:2px solid ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-decoration:none"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><span style="font-size:12px;color:${COLORS.red};font-weight:600">Ver referencia</span></a>`);
            }
          } else {
            sub.push(`<div style="width:100%;min-height:200px;border:2px dashed ${COLORS.border};border-radius:8px;background:${COLORS.bg};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span style="font-size:12px;color:${COLORS.muted};font-weight:600">Referencia pendiente</span></div>`);
          }
          if (ref.titulo) {
            sub.push(`<div style="font-size:11px;font-family:${FONTS.mono};color:${COLORS.muted};margin-top:4px">${escapeHtml(ref.titulo)}</div>`);
          }
          sub.push(`</div>`);
        }
        sub.push(`</div>`);
      }
    }

    // ICP exclusion callout (secondary ICPs with low recurrence not included in piezas)
    const excludedIcps = data.icp.filter(i => i.prioridad === "secundario" && i.recurrencia === "baja");
    for (const excluded of excludedIcps) {
      sub.push(`<div style="padding:14px 18px;background:${COLORS.gapBg};border-left:3px solid ${COLORS.escenario2};border-radius:0 6px 6px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>ICP de ${escapeHtml(excluded.segmento)}</strong> no se incluye en esta etapa. Su consumo es ocasional y conviene optimizar los recursos de produccion creativa y presupuesto de ads, hacia los ICPs de consumo recurrente, que tienen mejor retorno para el negocio.</div>`);
    }

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

        sub.push(`<div style="padding:12px 20px 20px">`);
        for (let p = 0; p < grupo.piezas.length; p++) {
          sub.push(renderPiezaCardStrategy(grupo.piezas[p], p));
        }
        sub.push(`</div></details>`);
      }
    }

    if (data.creativos?.tono) {
      sub.push(`<div class="callout" style="margin-bottom:12px"><strong>Tono de comunicacion:</strong> ${escapeHtml(data.creativos.tono)}</div>`);
    }

    parts.push(subsection(num, subNum, `Guiones + Piezas Creativas <span style="display:inline-block;font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;margin-left:8px;vertical-align:middle;letter-spacing:0.5px;text-transform:uppercase">En Revision</span>`, sub.join("\n")));
  }

  // ── Subsection: Campaign in Meta Ads (per dev campaign) ────────────
  for (const camp of devCampaigns) {
    subNum++;
    const sub: string[] = [];

    if (camp.notaCampana) {
      const notaIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
      // Si la nota viene como lista ("- " por linea) se renderiza en bullets; si no, parrafo en negrita
      const notaBullets = camp.notaCampana.split("\n").map(l => l.trim()).filter(l => l.startsWith("- ")).map(l => l.slice(2).trim());
      const notaBody = notaBullets.length
        ? `<ul style="margin:0;padding-left:20px">${notaBullets.map(b => `<li style="margin-bottom:6px">${escapeHtml(b)}</li>`).join("")}</ul>`
        : `<strong>${escapeHtml(camp.notaCampana)}</strong>`;
      sub.push(`<div style="padding:14px 18px;background:${COLORS.bg};border-left:3px solid ${COLORS.red};border-radius:0 6px 6px 0;margin-bottom:20px;font-size:14px;line-height:1.6">${notaBullets.length ? `<div style="font-weight:700;margin-bottom:8px">${notaIcon}Como se ejecuta</div>` : notaIcon}${notaBody}</div>`);
    }

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
      const parsed = parseSegmentacion(adSet.segmentacion);

      if (ai > 0) sub.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:12px 0">`);
      sub.push(`<div style="font-size:13px;font-weight:700;color:${COLORS.red};margin:${ai === 0 ? "8" : "4"}px 0 4px;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(adSet.nombre)}</div>`);
      sub.push(renderSegmentacion(parsed));
    }
    sub.push(`</div>`);

    sub.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Conversion + Presupuesto
    const kpisText = camp.conversionCampana ?? (camp.kpisCampana?.length ? camp.kpisCampana.join(" / ") : "Por definir");
    const presupuestoText = camp.presupuestoCampana
      ? `${camp.presupuestoCampana.mensual} <span style="font-weight:400;color:${COLORS.muted}">(${camp.presupuestoCampana.diario})</span>`
      : "Por definir";
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversion</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(kpisText)}</p></div>`);
    sub.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${presupuestoText}</p>${data.presupuesto?.tipoCambioNota ? `<p style="font-size:11px;color:${COLORS.muted};margin:4px 0 0">${escapeHtml(data.presupuesto.tipoCambioNota)}</p>` : ""}</div>`);

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

    parts.push(subsection(num, subNum, camp.tituloSubseccion ?? `Campaña ${camp.objetivo} en Meta Ads`, sub.join("\n")));
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

    // El callout habla de los packs, asi que solo aplica cuando hay ofertas propuestas
    if (data.ofertas?.length) {
      const contacto = data.clientInfo.nombreContacto ?? "El cliente";
      sub.push(`<div class="callout callout-red" style="margin-top:16px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>Accion requerida:</strong> ${escapeHtml(contacto)} debe crear estos productos/packs antes de lanzar la campaña.</div>`);
    }
    parts.push(subsection(num, subNum, "Ecommerce", sub.join("\n")));
  }

  const sectionTitle = devCampaigns.find(c => c.tituloSeccion)?.tituloSeccion
    ?? `Foundation ${devCampaigns.map(c => c.objetivo).join(" + ")}`;
  return section(num, "foundation-campaign", sectionTitle, parts.join("\n"), false, isLocked(data, "foundation-campaign"));
}

// ─── REE Metrics ─────────────────────────────────────────────────────

function renderReeMetrics(data: FoundationData, num: number): string {
  const parts: string[] = [];
  const plataforma = data.requerimientosCliente.accesoPlataforma?.nombrePlataforma ?? "tu plataforma";

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Es la plataforma de performance donde vas a poder ver en tiempo real como rinden tus campañas. Accedes desde cualquier dispositivo, las 24 horas.</p>`);

  parts.push(`<h3>Como ingresar</h3>`);

  const resetUrl = data.reeMetricsResetPasswordUrl ?? null;

  const pasos = [
    { num: "1", titulo: "Ingresa a REE Metrics", desc: "Abri el link en tu navegador (celular o computadora)." },
    {
      num: "2",
      titulo: resetUrl ? "Setea tu contraseña" : "Inicia sesion",
      desc: resetUrl
        ? `Con el link de invitacion de abajo defines tu contraseña y entras. Tu cuenta publicitaria ya esta configurada.`
        : `Usa las credenciales que te enviamos. Tu cuenta publicitaria ya esta configurada.`,
    },
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

  // Link para setear contraseña (solo si el cliente tiene invitacion pendiente)
  if (resetUrl) {
    parts.push(`<div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:12px;display:flex;align-items:flex-start;gap:12px">`);
    parts.push(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`);
    parts.push(`<div style="min-width:0"><div style="font-size:12px;color:${COLORS.muted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:2px">Setear contraseña</div>`);
    if (data.reeMetricsEmail) {
      parts.push(`<div style="font-size:13px;margin-bottom:6px">Ingresás con <strong style="font-family:${FONTS.mono}">${escapeHtml(data.reeMetricsEmail)}</strong></div>`);
    }
    parts.push(`<a href="${escapeHtml(resetUrl)}" target="_blank" style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red};text-decoration:none;word-break:break-all;line-height:1.45">${escapeHtml(resetUrl)}</a></div>`);
    parts.push(`</div>`);
    if (data.reeMetricsNotaUsuarios) {
      parts.push(`<p style="font-size:13px;color:${COLORS.muted};margin:0 0 12px">${escapeHtml(data.reeMetricsNotaUsuarios)}</p>`);
    }
  }

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

  const featureIcon = (titulo: string): string => {
    const t = titulo.toLowerCase();
    if (t.includes("timeline")) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    if (t.includes("commerce")) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
    if (t.includes("lead") || t.includes("whatsapp")) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  };

  const featuresData = data.reeMetricsFeatures?.length ? data.reeMetricsFeatures : [
    { titulo: "Dashboard", desc: `Conexion con ${escapeHtml(plataforma)}, campañas de Meta Ads y crecimiento de Instagram organico. Todo en una sola vista, personalizable segun requerimientos.` },
    { titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por que se escala o se frena cada anuncio (Kill/Scale) para que siempre sepas que se hizo y por que." },
    { titulo: "E-Commerce", desc: `Datos de tu ${escapeHtml(plataforma)}: pedidos, facturacion, ticket promedio, clientes unicos, carritos abandonados, top productos y top clientes.` },
  ];
  const features = featuresData.map(f => ({ icon: featureIcon(f.titulo), titulo: escapeHtml(f.titulo), desc: data.reeMetricsFeatures?.length ? escapeHtml(f.desc) : f.desc }));

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
  parts.push(`<div class="callout" style="display:flex;align-items:flex-start;gap:12px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div><strong>En constante desarrollo:</strong> REE Metrics es una plataforma que estamos mejorando continuamente. A medida que lancemos las campañas y se genere data, vamos a comenzar a relacionar la informacion entre Meta Ads, ${escapeHtml(data.reeMetricsFuente ?? plataforma)} e Instagram para tener mayor claridad en la toma de decisiones. En un inicio necesitamos lanzar para despues poder cruzar esa data y optimizar.</div></div>`);

  return section(num, "ree-metrics", "REE Metrics", parts.join("\n"), false, isLocked(data, "ree-metrics"));
}

// ─── Roadmap ─────────────────────────────────────────────────────────

function renderRoadmap(data: FoundationData, num: number): string {
  const parts: string[] = [];

  if (data.roadmap && data.roadmap.length) {
    const semanasPlan = Math.max(8, ...data.roadmap.flatMap(i => i.fases.map(f => f.semanaFin)));
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Plan de ejecución para las primeras ${semanasPlan} semanas del proyecto:</p>`);

    const fechaISO = data.datosF1?.fechaInicioISO ?? null;

    const milestones = deriveMilestones(data, fechaISO);
    const ganttMilestones: GanttMilestone[] = milestones.map(m => ({
      semana: m.semana,
      label: m.label,
      fecha: m.fecha ?? (fechaISO ? weekDate(fechaISO, m.semana) : ""),
    }));
    parts.push(renderGantt(data.roadmap, fechaISO, ganttMilestones, data.datosF1?.fechaFin));

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

        // Fecha explicita si existe; si no, derivada de la semana
        const weekNum = parseInt(meet.semana.replace(/\D/g, ""), 10);
        const meetFecha = meet.fecha ?? (fechaISO && weekNum ? weekDate(fechaISO, weekNum) : "");

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

  return section(num, "roadmap", "Roadmap de Ejecución", parts.join("\n"), false, isLocked(data, "roadmap"));
}

// ─── Gantt helpers ───────────────────────────────────────────────────

function computeWeekDateRanges(fechaInicioISO: string, fechaFin?: string | null, totalWeeks = 8): Array<{ start: string; end: string }> {
  const base = new Date(fechaInicioISO + "T00:00:00");
  const fmt = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ranges: Array<{ start: string; end: string }> = [];
  for (let w = 0; w < totalWeeks; w++) {
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() + w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    ranges.push({ start: fmt(weekStart), end: fmt(weekEnd) });
  }
  // fechaFin explicita (DD/MM) estira el cierre de la ultima semana
  if (fechaFin && ranges.length) ranges[ranges.length - 1].end = fechaFin;
  return ranges;
}

function computeCurrentWeek(fechaInicioISO: string, totalWeeks = 8): number {
  const start = new Date(fechaInicioISO + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 0;
  const week = Math.floor(diffDays / 7) + 1;
  return week > totalWeeks ? 0 : week;
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

function renderGantt(roadmap: RoadmapInitiative[], fechaInicioISO?: string | null, milestones?: GanttMilestone[], fechaFin?: string | null): string {
  if (!roadmap.length) return "";

  // El ancho del gantt sale del propio roadmap y de los hitos: un proyecto de 12
  // semanas no puede mostrarse recortado en 8. Minimo 8 para no alterar los
  // roadmaps que ya venian de ese largo.
  const lastPhaseWeek = Math.max(...roadmap.flatMap(i => i.fases.map(f => f.semanaFin)));
  const lastMilestoneWeek = milestones?.length ? Math.max(...milestones.map(m => m.semana)) : 0;
  const totalWeeks = Math.max(8, lastPhaseWeek, lastMilestoneWeek);
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const faseColors: Record<string, string> = {
    Foundation: COLORS.slate,
    Build: COLORS.escenario2,
    Launch: COLORS.red,
    Scale: COLORS.escenario1,
  };

  const weekRanges = fechaInicioISO ? computeWeekDateRanges(fechaInicioISO, fechaFin, totalWeeks) : [];
  const currentWeek = fechaInicioISO ? computeCurrentWeek(fechaInicioISO, totalWeeks) : 0;
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
    parts.push(`<div style="padding:10px 0;text-align:center;font-family:${FONTS.mono};font-size:13px;font-weight:700;color:${isCurrent ? COLORS.red : COLORS.muted};${cellBorder};${isCurrent ? currentBg : ""}">`);
    parts.push(`S${weeks[i]}`);
    if (isCurrent) {
      parts.push(`<div style="font-size:9px;font-weight:700;color:#fff;background:${COLORS.red};border-radius:3px;padding:1px 4px;margin-top:2px;display:inline-block">HOY</div>`);
    }
    if (weekRanges.length) {
      parts.push(`<div style="font-size:10px;font-weight:400;color:${COLORS.muted};margin-top:3px">${weekRanges[i].start}</div>`);
      parts.push(`<div style="font-size:10px;font-weight:400;color:${COLORS.muted}">${weekRanges[i].end}</div>`);
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
    parts.push(`<div style="padding:14px 20px;font-family:${FONTS.heading};font-weight:700;font-size:12px;text-transform:uppercase;display:flex;align-items:center">${escapeHtml(init.nombre)}</div>`);

    for (const w of weeks) {
      const faseName = weekMap[w];
      const isCurrent = currentWeek === w;

      if (!faseName) {
        parts.push(`<div style="padding:14px 3px;${cellBorder};${isCurrent ? currentBg : ""}"></div>`);
      } else {
        const color = faseColors[faseName] || COLORS.slate;
        const prevFase = w > 1 ? weekMap[w - 1] : undefined;
        const nextFase = w < totalWeeks ? weekMap[w + 1] : undefined;
        const isFirst = prevFase !== faseName;

        const allActive = weeks.filter((wk) => weekMap[wk]);
        const isRowFirst = w === allActive[0];
        const isRowLast = w === allActive[allActive.length - 1];

        const radius = isRowFirst && isRowLast ? "4px" : isRowFirst ? "4px 0 0 4px" : isRowLast ? "0 4px 4px 0" : "0";
        // -4px (no -3px) en las barras que continuan una fase: 3px tapan el padding
        // de la celda y el 4to tapa su border-left de 1px, que si no deja una costura
        // clara justo donde ahora cae la etiqueta centrada.
        const ml = isFirst && !isRowFirst ? "1px" : isRowFirst ? "0" : "-4px";
        const mr = (nextFase !== faseName) && !isRowLast ? "1px" : isRowLast ? "0" : "-3px";
        const separator = isFirst && prevFase && prevFase !== faseName ? `border-left:2px solid rgba(255,255,255,0.5)` : "";

        const continuaDerecha = nextFase === faseName;
        parts.push(`<div style="padding:14px 3px;${cellBorder};display:flex;align-items:center;${isCurrent ? currentBg : ""}">`);
        // position/z-index solo en la barra que lleva la etiqueta: si todas son
        // position:relative, la barra de la semana siguiente se pinta encima del
        // texto que desborda y lo tapa.
        const capaLabel = isFirst && continuaDerecha ? "position:relative;z-index:2;overflow:visible;" : "";
        parts.push(`<div style="width:100%;height:28px;background:${color};border-radius:${radius};margin-left:${ml};margin-right:${mr};display:flex;align-items:center;justify-content:center;${capaLabel}${separator}">`);
        if (isFirst) {
          // Etiqueta centrada sobre el tramo completo de la fase: la barra mide una
          // semana, asi que el centro del tramo cae a (semanas / 2) anchos de barra.
          let spanLen = 1;
          while (weekMap[w + spanLen] === faseName) spanLen++;
          const labelPos = continuaDerecha
            ? `position:absolute;left:${spanLen * 50}%;top:50%;transform:translate(-50%,-50%);white-space:nowrap`
            : `white-space:nowrap;overflow:hidden`;
          parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;font-weight:700;letter-spacing:0.06em;color:rgba(255,255,255,0.9);text-transform:uppercase;${labelPos}">${escapeHtml(faseName)}</span>`);
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
      const msSemana = milestones.filter((m) => m.semana === w);
      const isCurrent = currentWeek === w;
      if (msSemana.length) {
        parts.push(`<div style="padding:6px 2px;${cellBorder};text-align:center;${isCurrent ? currentBg : ""}">`);
        for (let k = 0; k < msSemana.length; k++) {
          const ms = msSemana[k];
          parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.4px;color:${COLORS.red};text-transform:uppercase;line-height:1.35;${k ? "margin-top:6px" : ""}">${escapeHtml(ms.label)}</div>`);
          if (ms.fecha) parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;color:${COLORS.muted};margin-top:2px">${escapeHtml(ms.fecha)}</div>`);
        }
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
      const itemHtml = escapeHtml(item).replace(/(https?:\/\/[^\s]+)/g, (u) => `<a href="${u}" target="_blank" style="color:${COLORS.red};font-weight:600;text-decoration:underline">${u.replace(/^https?:\/\//, "")}</a>`);
      parts.push(`<span>${itemHtml}</span>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  return section(num, "proximos-pasos", "Proximos Pasos", parts.join("\n"), false, isLocked(data, "proximos-pasos"));
}

// ─── Segmentacion parser ─────────────────────────────────────────────

interface SegCategoria { label: string; items: string[]; }
interface SegParsed { edad: string; locacion: string; categorias: SegCategoria[]; nota: string | null; }

function parseSegmentacion(seg: string): SegParsed {
  const segments = seg.split(". ");
  const firstSeg = segments[0];
  const commaIdx = firstSeg.indexOf(", ");
  const edad = commaIdx > -1 ? firstSeg.substring(0, commaIdx).trim() : firstSeg;
  const locacion = commaIdx > -1 ? firstSeg.substring(commaIdx + 2).trim() : "";

  const categorias: SegCategoria[] = [];
  let nota: string | null = null;

  for (let i = 1; i < segments.length; i++) {
    const s = segments[i];
    const colonIdx = s.indexOf(": ");
    if (colonIdx > -1) {
      const label = s.substring(0, colonIdx).trim();
      const itemsStr = s.substring(colonIdx + 2).trim();
      if (label.toLowerCase() === "nota") {
        nota = itemsStr;
      } else {
        categorias.push({ label, items: itemsStr.split(",").map(x => x.trim()).filter(Boolean) });
      }
    } else {
      const items = s.split(",").map(x => x.trim()).filter(Boolean);
      if (items.length) categorias.push({ label: "Intereses", items });
    }
  }

  return { edad, locacion, categorias, nota };
}

function renderSegmentacion(s: SegParsed): string {
  const lines: string[] = [];
  lines.push(`<ul style="font-size:14px;margin:8px 0 0;padding-left:20px;line-height:1.8">`);
  lines.push(`<li><span style="font-weight:600">Edad:</span> ${escapeHtml(s.edad)}</li>`);
  if (s.locacion) {
    // Varias zonas separadas por " | " se listan anidadas; una sola queda en linea.
    const zonas = s.locacion.split(" | ").map(z => z.trim()).filter(Boolean);
    if (zonas.length > 1) {
      lines.push(`<li><span style="font-weight:600">Locación:</span>`);
      lines.push(`<ul style="margin:2px 0 4px;padding-left:18px;line-height:1.6">`);
      for (const z of zonas) lines.push(`<li>${escapeHtml(z)}</li>`);
      lines.push(`</ul></li>`);
    } else {
      lines.push(`<li><span style="font-weight:600">Locación:</span> ${escapeHtml(s.locacion)}</li>`);
    }
  }
  for (const cat of s.categorias) {
    lines.push(`<li><span style="font-weight:600">${escapeHtml(cat.label)}:</span>`);
    lines.push(`<ul style="margin:2px 0 4px;padding-left:18px;line-height:1.6">`);
    for (const item of cat.items) {
      lines.push(`<li>${escapeHtml(item)}</li>`);
    }
    lines.push(`</ul></li>`);
  }
  if (s.nota) {
    lines.push(`<li style="color:${COLORS.muted};font-style:italic;margin-top:4px">${escapeHtml(s.nota)}</li>`);
  }
  lines.push(`</ul>`);
  return lines.join("\n");
}

// ─── Campaign Piezas (creative briefs) ──────────────────────────────

function piezaFormatBadge(formato: string): { label: string; color: string; icon: string } {
  const f = formato.toLowerCase();
  const s = `width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;"`;
  if (f.includes("reel") || f.includes("video")) {
    return { label: formato.toUpperCase(), color: COLORS.red, icon: `<svg ${s}><polygon points="5 3 19 12 5 21 5 3"/></svg>` };
  }
  if (f.includes("carrusel")) {
    return { label: formato.toUpperCase(), color: "#7C3AED", icon: `<svg ${s}><rect x="2" y="7" width="15" height="15" rx="2"/><path d="M7 2h13a2 2 0 0 1 2 2v13"/></svg>` };
  }
  return { label: formato.toUpperCase(), color: COLORS.slate, icon: `<svg ${s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` };
}

function piezaPorDefinir(val: string | null | undefined): string {
  return val
    ? escapeHtml(val)
    : `<span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:#FEF3C7;color:#92400E;">Por definir</span>`;
}

function renderPiezaCardStrategy(pieza: PiezaCreativa, index: number): string {
  const badge = piezaFormatBadge(pieza.formato);
  const isVideo = pieza.formato.toLowerCase().includes("reel") || pieza.formato.toLowerCase().includes("video");
  const parts: string[] = [];

  // Header: format badge + pieza number + duration + pillar/tema (collapsible, closed by default)
  const dolorPreview = pieza.dolor.length > 60 ? pieza.dolor.slice(0, 57) + "..." : pieza.dolor;
  parts.push(`<details style="border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:16px;overflow:hidden">`);
  parts.push(`<summary style="padding:14px 20px;background:${COLORS.bg};display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer;list-style:none;user-select:none">`);
  parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;background:${badge.color};color:${COLORS.surface};text-transform:uppercase;display:inline-flex;align-items:center">${badge.icon}${badge.label}</span>`);
  parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted}">Pieza ${index + 1}</span>`);
  if (isVideo && pieza.duracion) {
    parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.ink};color:${COLORS.surface}">${escapeHtml(pieza.duracion)}</span>`);
  }
  parts.push(`<span style="font-size:13px;color:${COLORS.slate};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(dolorPreview)}</span>`);
  if (pieza.tema) {
    parts.push(`<span style="font-size:12px;color:${COLORS.muted}">${escapeHtml(pieza.tema)}</span>`);
  }
  parts.push(`<span class="pieza-toggle" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto">+</span><span class="pieza-toggle-open" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto">&minus;</span>`);
  parts.push(`</summary>`);

  // Body
  parts.push(`<div style="border-top:1px solid ${COLORS.border}">`);

  // Framework grid (Pilar/Tema, Formato Narrativo/Estructura Narrativa, Tratamiento)
  if (pieza.pilar || pieza.tema || pieza.formatoNarrativo || pieza.estructuraNarrativa || pieza.tratamiento) {
    const fwRow = (label1: string, val1: string | null | undefined, label2: string, val2: string | null | undefined) => `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px">${label1}</div>
          <div style="font-size:13px">${piezaPorDefinir(val1)}</div>
        </div>
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px">${label2}</div>
          <div style="font-size:13px">${piezaPorDefinir(val2)}</div>
        </div>
      </div>`;

    const trat = pieza.tratamiento;
    const tratParts: string[] = [];
    if (trat?.tipo) tratParts.push(escapeHtml(trat.tipo));
    if (trat?.tono) tratParts.push(escapeHtml(trat.tono));
    if (trat?.estilo) tratParts.push(escapeHtml(trat.estilo));
    const tratLine = tratParts.length
      ? tratParts.map(t => `<span style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-right:6px">${t}</span>`).join("")
      : piezaPorDefinir(null);

    parts.push(`<div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600">Framework</div>`);
    parts.push(`<div style="display:flex;flex-direction:column;gap:12px">`);
    parts.push(fwRow("Pilar", pieza.pilar, "Tema", pieza.tema));
    parts.push(fwRow("Formato Narrativo", pieza.formatoNarrativo, "Estructura Narrativa", pieza.estructuraNarrativa));
    parts.push(`<div><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px">Tratamiento</div><div style="font-size:13px">${tratLine}</div></div>`);

    parts.push(`</div></div>`);
  }

  // Referencias dentro de la pieza (fuera del bloque framework para que renderice aunque no haya pilar/tema)
  if (pieza.referencias?.length) {
    const refEmbeds: string[] = [];
    const refBadges: string[] = [];
    for (const r of pieza.referencias) {
      if (!r.url) continue;
      const isIg = r.url.includes("instagram.com");
      if (r.tipo === "iframe" || (isIg && !r.tipo)) {
        const embedUrl = isIg ? r.url.replace(/\/$/, "") + "/embed" : r.url;
        refEmbeds.push(`<div style="max-width:400px"><iframe src="${embedUrl}" style="width:100%;min-height:540px;border:1px solid ${COLORS.border};border-radius:8px" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>`);
      } else if (r.tipo === "video" || r.url.startsWith("data:video/")) {
        const cap = r.titulo ? `<div style="font-size:12px;color:${COLORS.muted};margin-top:6px">${escapeHtml(r.titulo)}</div>` : "";
        refEmbeds.push(`<div style="max-width:400px"><video src="${r.url}" controls playsinline preload="metadata" style="width:100%;aspect-ratio:9/16;border:1px solid ${COLORS.border};border-radius:8px;background:#000;object-fit:cover;display:block"></video>${cap}</div>`);
      } else {
        const label = escapeHtml(r.titulo || r.url.substring(0, 40));
        refBadges.push(`<span style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-right:6px;margin-bottom:4px;display:inline-block">${label}</span>`);
      }
    }
    if (refEmbeds.length) {
      parts.push(`<div style="padding:16px 20px;border-top:1px solid ${COLORS.border}"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px">Referencias</div>${refEmbeds.join("")}</div>`);
    }
    if (refBadges.length) {
      parts.push(`<div style="padding:16px 20px;border-top:1px solid ${COLORS.border}"><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px">Referencias</div><div style="font-size:13px;display:flex;flex-wrap:wrap;gap:4px">${refBadges.join("")}</div></div>`);
    }
  }

  // Destino (URLs)
  if (pieza.destinoUrls?.length) {
    const urlsList = pieza.destinoUrls.map(url =>
      `<a href="${escapeHtml(url)}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid ${COLORS.border};text-decoration:none;color:${COLORS.ink};font-family:${FONTS.mono};font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(url)}</span>
      </a>`
    ).join("");
    parts.push(`<div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px;font-weight:600">Destino</div>`);
    parts.push(`<div style="display:flex;flex-direction:column;gap:6px">${urlsList}</div></div>`);
  }

  // Dolor / Solucion
  parts.push(`<div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border}">`);
  parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">`);
  parts.push(`<div><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};margin-bottom:6px;font-weight:600">&#9888; Dolor</div><div style="font-size:13px;line-height:1.5">${escapeHtml(pieza.dolor)}</div></div>`);
  parts.push(`<div><div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.escenario1};margin-bottom:6px;font-weight:600">&#10003; Solución</div><div style="font-size:13px;line-height:1.5">${escapeHtml(pieza.solucion)}</div></div>`);
  parts.push(`</div></div>`);

  // Desglose de Produccion (comunicacion with [0-3s] timeline format)
  if (pieza.comunicacion && /\[\d+-\d+s\]/.test(pieza.comunicacion)) {
    const segments = pieza.comunicacion.match(/\[\d+-\d+s\][^[]+/g) ?? [];
    const rows = segments.map(seg => {
      const timeMatch = seg.match(/\[(\d+-\d+s)\]/);
      const time = timeMatch ? timeMatch[1] : "";
      const rest = seg.replace(/\[\d+-\d+s\]\s*/, "").trim();
      const dashIdx = rest.indexOf("\u2014");
      let label = "";
      let content = rest;
      if (dashIdx > -1) {
        label = rest.slice(0, dashIdx).trim();
        content = rest.slice(dashIdx + 1).trim();
      }
      let toma = content;
      let dialogo = "";
      const colonIdx = content.indexOf(":");
      if (colonIdx > -1) {
        toma = content.slice(0, colonIdx).trim();
        dialogo = content.slice(colonIdx + 1).trim().replace(/^'|'$/g, "").replace(/^'|'$/g, "");
      }
      const labelColor = label.toUpperCase().includes("HOOK") ? COLORS.red
        : label.toUpperCase().includes("CTA") ? COLORS.escenario1
        : label.toUpperCase().includes("CIERRE") ? COLORS.slate
        : COLORS.ink;
      const dialogoHtml = dialogo
        ? `<span style="color:${COLORS.ink};font-weight:600;font-style:italic">&ldquo;${escapeHtml(dialogo)}&rdquo;</span>`
        : `<span style="color:${COLORS.muted};font-style:italic">Sin dialogo</span>`;
      return `
        <div style="display:grid;grid-template-columns:55px 70px 1fr 1fr;gap:12px;padding:10px 0;border-bottom:1px solid ${COLORS.border}">
          <div style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">${escapeHtml(time)}</div>
          <div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${labelColor};text-transform:uppercase;padding-top:2px">${escapeHtml(label)}</div>
          <div style="font-size:12px;line-height:1.5;color:${COLORS.slate}">${escapeHtml(toma)}</div>
          <div style="font-size:12px;line-height:1.5">${dialogoHtml}</div>
        </div>`;
    }).join("");

    parts.push(`<div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600">Desglose de Producción</div>`);
    parts.push(`<div style="display:grid;grid-template-columns:55px 70px 1fr 1fr;gap:12px;padding:8px 0;border-bottom:2px solid ${COLORS.ink};margin-bottom:4px">
      <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600">Tiempo</div>
      <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600">Momento</div>
      <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600">Toma / Visual</div>
      <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600">Dialogo</div>
    </div>`);
    parts.push(`<div>${rows}</div></div>`);
  }

  // Content: Hook/Body/CTA for video, Mensajes for static
  const hasCopyBelow = !!pieza.copyAnuncio || !isVideo;
  if (isVideo && (pieza.hook || pieza.body || pieza.cta)) {
    parts.push(`<div style="padding:16px 20px${hasCopyBelow ? `;border-bottom:1px solid ${COLORS.border}` : ""}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600">Guión</div>`);
    parts.push(`<div style="display:flex;flex-direction:column;gap:10px">`);
    if (pieza.hook) parts.push(`<div><span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.red};text-transform:uppercase;margin-right:8px">HOOK</span><span style="font-size:13px">${escapeHtml(pieza.hook)}</span></div>`);
    if (pieza.body) parts.push(`<div><span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.muted};text-transform:uppercase;margin-right:8px">BODY</span><span style="font-size:13px">${escapeHtml(pieza.body)}</span></div>`);
    if (pieza.cta) parts.push(`<div><span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.escenario1};text-transform:uppercase;margin-right:8px">CTA</span><span style="font-size:13px">${escapeHtml(pieza.cta)}</span></div>`);
    parts.push(`</div></div>`);
  } else if (pieza.mensajes?.length) {
    parts.push(`<div style="padding:16px 20px${hasCopyBelow ? `;border-bottom:1px solid ${COLORS.border}` : ""}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600">Mensajes</div>`);
    parts.push(`<ul style="list-style:none;padding:0;margin:0">`);
    for (const m of pieza.mensajes) {
      parts.push(`<li style="font-size:13px;padding:4px 0 4px 16px;position:relative;border-bottom:1px solid ${COLORS.border}"><span style="position:absolute;left:0;color:${COLORS.red};font-family:${FONTS.mono}">&gt;</span>${escapeHtml(m)}</li>`);
    }
    parts.push(`</ul></div>`);
  }

  // Copy Anuncio
  if (pieza.copyAnuncio) {
    const copyLines = pieza.copyAnuncio.split("\n").map(line =>
      line.trim() === "" ? "<br>" : `<div>${escapeHtml(line)}</div>`
    ).join("");
    parts.push(`<div style="padding:16px 20px${!isVideo ? `;border-bottom:1px solid ${COLORS.border}` : ""}">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600">Copy Anuncio</div>`);
    parts.push(`<div style="background:${COLORS.bg};border:1px solid ${COLORS.border};padding:16px 20px;font-size:13px;line-height:1.6;white-space:pre-line">${copyLines}</div></div>`);
  }

  // Adaptaciones (static pieces include Story adaptation)
  if (!isVideo) {
    parts.push(`<div style="padding:16px 20px">`);
    parts.push(`<div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px;font-weight:600">Adaptaciones</div>`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;padding:4px 10px;background:#E0F2FE;color:#0369A1;display:inline-block">Incluye adaptación Story (1080x1920)</span></div>`);
  }

  parts.push(`</div></details>`);
  return parts.join("\n");
}

function renderCampaignPiezas(data: FoundationData, campaign: CampanaDefinida, num: number): string {
  const piezas = campaign.piezas;
  if (!piezas?.length) return "";

  const parts: string[] = [];

  // Count by format
  const videoCount = piezas.filter(p => p.formato.toLowerCase().includes("reel") || p.formato.toLowerCase().includes("video")).length;
  const staticCount = piezas.length - videoCount;

  // El nombre de la campaña sale de tituloSeccion para no contradecir el titulo de la seccion.
  const campLabel = campaign.tituloSeccion
    ? campaign.tituloSeccion.replace(/^Campaña\s+(de\s+)?/i, "")
    : campaign.objetivo.toLowerCase();
  const videoTxt = `<strong>${videoCount} video${videoCount === 1 ? "" : "s"}</strong>`;
  const staticTxt = `<strong>${staticCount} pieza${staticCount === 1 ? "" : "s"} estática${staticCount === 1 ? "" : "s"}</strong>`;
  const productor = campaign.productorPiezas ?? "Sergio";
  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Lineamiento creativo de las <strong>${piezas.length} piezas pendientes</strong> de la campaña de ${escapeHtml(campLabel)}. ${videoCount > 0 ? videoTxt : ""}${videoCount > 0 && staticCount > 0 ? " + " : ""}${staticCount > 0 ? staticTxt : ""} a producir con ${escapeHtml(productor)}.</p>`);

  parts.push(renderEntregaMaterial(data));

  for (let i = 0; i < piezas.length; i++) {
    parts.push(renderPiezaCardStrategy(piezas[i], i));
  }

  const campSuffix = campaign.nombre.includes("_") ? campaign.nombre.split("_").slice(1).join(" ") : "";
  let title = campSuffix ? `Piezas Creativas (${campSuffix})` : `Piezas Creativas (x${piezas.length})`;
  let rawTitle = false;
  if (campaign.badgesPiezas?.length) {
    const badgeStyles = [
      `background:#FEF3C7;color:#92400E`,
      `background:${COLORS.bg};color:${COLORS.muted};border:1px solid ${COLORS.border}`,
    ];
    const badges = campaign.badgesPiezas.map((b, i) =>
      `<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:3px 8px;border-radius:4px;margin-left:10px;vertical-align:2px;${badgeStyles[Math.min(i, badgeStyles.length - 1)]}">${escapeHtml(b)}</span>`
    ).join("");
    title = `${escapeHtml(title)}${badges}`;
    rawTitle = true;
  }
  return section(num, "piezas-creativas", title, parts.join("\n"), rawTitle, isLocked(data, "piezas-creativas"));
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado por REE Creativos
  </div>`;
}
