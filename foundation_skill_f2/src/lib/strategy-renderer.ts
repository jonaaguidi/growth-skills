import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname, extname } from "path";
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

// ─── Competitor avatars ──────────────────────────────────────────────

function loadCompetitorAvatar(filename: string): string {
  const p = resolve(__dirname, `../assets/${filename}`);
  try {
    return `data:image/jpeg;base64,${readFileSync(p).toString("base64")}`;
  } catch {
    return "";
  }
}

const COMPETITOR_AVATARS: Record<string, string> = {
  Soyana: loadCompetitorAvatar("soyana-avatar.jpg"),
  TofuMania: loadCompetitorAvatar("tofumania-avatar.jpg"),
  Soyland: loadCompetitorAvatar("soyland-avatar.jpg"),
  Sozoe: loadCompetitorAvatar("sozoe-avatar.jpg"),
};

// ─── Soyana reference images ─────────────────────────────────────────

interface RefFormato {
  id: string;
  slides: string[]; // base64 data URIs
}

function loadSoyanaRefImages(): RefFormato[] {
  const refDir = resolve(__dirname, "../assets/soyana-ref");
  if (!existsSync(refDir)) return [];

  try {
    const files = readdirSync(refDir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort();

    // Group by format: f01-s01.jpg, f01-s02.jpg → { id: "f01", slides: [...] }
    const groups: Record<string, string[]> = {};
    for (const file of files) {
      const match = file.match(/^(f\d+)-s\d+\./);
      if (!match) continue;
      const formatId = match[1];
      const filePath = resolve(refDir, file);
      const ext = extname(file).toLowerCase();
      const mime = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
      try {
        const b64 = readFileSync(filePath).toString("base64");
        if (!groups[formatId]) groups[formatId] = [];
        groups[formatId].push(`data:${mime};base64,${b64}`);
      } catch { /* skip unreadable */ }
    }

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, slides]) => ({ id, slides }));
  } catch {
    return [];
  }
}

// ─── Main render ─────────────────────────────────────────────────────

export function renderStrategyHtml(data: FoundationData): string {
  const styles = getBaseStyles();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

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
  ${renderToc()}
  ${renderEstaReunion(data)}
  ${renderAwareness(data)}
  ${renderFoundationB2C(data)}
  ${renderReeMetrics()}
  ${renderRoadmap(data)}
  ${renderProximosPasos(data)}
  ${renderFooter()}
</div>
<a href="#top" class="back-to-top" title="Volver arriba"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header (red bg, white logo — same as other docs) ───────────────

function renderHeader(data: FoundationData): string {
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : null;
  const industria = data.clientInfo.industria ? escapeHtml(data.clientInfo.industria) : null;
  const web = data.clientInfo.sitioWeb ? escapeHtml(data.clientInfo.sitioWeb) : null;
  const duracion = data.datosF1?.duracionProyecto ? escapeHtml(data.datosF1.duracionProyecto) : null;
  const canales = data.datosF1?.canalesRecomendados ?? [];
  const campanas = data.datosF1?.campanasVendidas ?? [];
  const palanca = data.palanca?.nombre ? escapeHtml(data.palanca.nombre) : null;

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

const TOC_ITEMS = [
  { id: "foundation-review", title: "Foundation Review", desc: "Estructura de la llamada." },
  { id: "awareness", title: "Campaña de Awareness", desc: "Posicionamiento de marca: 6 piezas ya seteadas." },
  { id: "b2c", title: "Foundation B2C", desc: "Competencia, audiencias, angulos creativos, campaña de conversion y e-commerce." },
  { id: "ree-metrics", title: "REE Metrics", desc: "Dashboard de performance: como ingresar y que vas a ver." },
  { id: "roadmap", title: "Roadmap de Ejecución", desc: "Plan de ejecución 8 semanas + reuniones." },
  { id: "proximos-pasos", title: "Proximos Pasos", desc: "Que sigue con la aprobacion." },
];

function renderToc(): string {
  return `
  <div style="background:${COLORS.surface};border:1px solid ${COLORS.border};padding:24px 32px;margin-bottom:24px">
    <ol style="list-style:none;counter-reset:toc;padding:0;margin:0">
      ${TOC_ITEMS.map((s, i) => `<li style="counter-increment:toc;margin-bottom:12px"><a href="#${s.id}" style="color:${COLORS.ink};text-decoration:none;font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.red};margin-right:8px;font-weight:600">${String(i + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}</a><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
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

function subsection(num: number, title: string, html: string): string {
  const pad = `3.${num}`;
  return `
  <details class="fr-subsection">
    <summary><span class="subsection-num">${pad}</span>${title}</summary>
    <div class="fr-subsection-body">
      ${html}
    </div>
  </details>`;
}

// ─── 01. Esta Reunion ───────────────────────────────────────────────

function renderEstaReunion(data: FoundationData): string {
  const contacto = data.clientInfo.nombreContacto ? escapeHtml(data.clientInfo.nombreContacto) : "el cliente";
  const parts: string[] = [];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">En esta seccion se describe la estructura de la llamada de Foundation Review con ${contacto}. Vamos a recorrer todo lo que preparamos y al final tenemos la aprobacion para lanzar.</p>`);

  const etapas = [
    { nombre: "Apertura", duracion: "5 min", objetivo: "Recap de Foundation: que se hizo, que queda listo." },
    { nombre: "Awareness", duracion: "10 min", objetivo: "Campaña de posicionamiento ya seteada: 6 piezas listas para pautar y audiencias definidas." },
    { nombre: "B2C", duracion: "15 min", objetivo: "Research de competencia, ICPs, angulos creativos y piezas, campaña de ventas (audiencias, presupuesto, KPIs) y productos/ofertas de ecommerce." },
    { nombre: "Demo REE Metrics", duracion: "10 min", objetivo: "Performance de la campaña de Awareness en el dashboard. Lo de B2C esta por trabajarse." },
    { nombre: "Cierre", duracion: "5 min", objetivo: "Aprobacion para lanzar + agendar proxima Call ADS." },
  ];

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

  return section(1, "foundation-review", "Foundation Review", parts.join("\n"));
}

// ─── 02. Campaña de Awareness ───────────────────────────────────────

function renderAwareness(data: FoundationData): string {
  const parts: string[] = [];

  // Find awareness campaign
  const awareness = data.arquitectura.find((c) => c.nombre.toLowerCase().includes("awareness"));

  if (awareness) {
    const slug = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:8px">Campaña de <strong>interacción</strong> hacia el perfil de Instagram de <strong>${slug}</strong>.</p>`);
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">El objetivo es nutrir un público, generar <strong>posicionamiento de marca</strong> y conseguir <strong>visitas al perfil + followers nuevos</strong>.</p>`);

    // Campaign definition card
    parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px">`);
    parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de Campaña</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${escapeHtml(awareness.objetivo)}</p></div>`);
    parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Destino</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">Perfil de Instagram</p></div>`);

    // HR: Objetivo + Destino separado de Audiencia
    parts.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Audiencia
    const firstAdSet = awareness.adSets[0];
    if (firstAdSet) {
      const seg = firstAdSet.segmentacion;
      const dotIdx = seg.indexOf(". ");
      const beforeDot = dotIdx > -1 ? seg.substring(0, dotIdx) : seg;
      const interesesRaw = dotIdx > -1 ? seg.substring(dotIdx + 2) : "";
      const commaIdx = beforeDot.indexOf(", ");
      const edad = commaIdx > -1 ? beforeDot.substring(0, commaIdx).trim() : beforeDot;
      const locacion = commaIdx > -1 ? beforeDot.substring(commaIdx + 2).trim() : "";
      const intereses = interesesRaw.replace(/^Intereses:\s*/i, "").split(",").map((s: string) => s.trim()).filter(Boolean);

      parts.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencia</div>`);
      parts.push(`<ul style="font-size:14px;margin:8px 0 0;padding-left:20px;line-height:1.8">`);
      parts.push(`<li><span style="font-weight:600">Edad:</span> ${escapeHtml(edad)}</li>`);
      if (locacion) parts.push(`<li><span style="font-weight:600">Locación:</span> ${escapeHtml(locacion)}</li>`);
      if (intereses.length) parts.push(`<li><span style="font-weight:600">Intereses:</span> ${intereses.map(i => escapeHtml(i)).join(", ")}</li>`);
      parts.push(`</ul></div>`);
    }

    // HR: Audiencia separado de Conversión + Presupuesto
    parts.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversión (KPIs)</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">Visitas al Perfil / Followers nuevos</p></div>`);
    parts.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">USD $5/día — $150/mes</p></div>`);

    parts.push(`</div></div>`);

    // Nomenclatura — card separado, 3 columnas
    parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    parts.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">`);
    parts.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>Campaña</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${slug}_Awareness</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">{Empresa}_{Objetivo}</p></div>`);
    parts.push(`<div style="text-align:center;padding:12px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Ad Set</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${escapeHtml(awareness.adSets[0]?.nombre || "")}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Conjunto_{Audiencia}_{Locación}</p></div>`);
    parts.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Ads (${awareness.adSets[0]?.ads.length || 6})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">Anuncio_Reel_V1</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Anuncio_{Formato}_{Angulo}_{V}</p></div>`);
    parts.push(`</div></div>`);

    // Embed grid: Instagram previews
    const allEmbeds: { label: string; embedUrl: string }[] = [];
    for (const adSet of awareness.adSets) {
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

    parts.push(`<div style="margin-top:16px;padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;font-size:14px;color:#166534"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><strong>${awareness.adSets.reduce((sum, as_) => sum + as_.ads.length, 0)} piezas listas.</strong> Estas piezas ya están producidas y disponibles para subir a Meta Ads.</div>`);
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Campaña de awareness pendiente de definicion.</p>`);
  }

  return section(2, "awareness", "Campaña de Awareness", parts.join("\n"));
}

// ─── 03. Foundation B2C ──────────────────────────────────────────────

function renderFoundationB2C(data: FoundationData): string {
  const parts: string[] = [];
  const slug = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);

  // ── 1. Competencia ──────────────────────────────────────────────────
  const sub1: string[] = [];
  sub1.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px">Analisis de los ads activos de la competencia en Meta Ad Library:</p>`);

  // Competencia cards
  const competidores = [
    { nombre: "Soyana", estado: "63 anuncios activos", activo: true },
    { nombre: "Soyland", estado: "Sin pauta activa", activo: false },
    { nombre: "TofuMania", estado: "Sin pauta activa", activo: false },
    { nombre: "Sozoe", estado: "Sin pauta activa", activo: false },
  ];
  sub1.push(`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:20px">`);
  for (const comp of competidores) {
    const borderColor = comp.activo ? COLORS.red : COLORS.border;
    const statusColor = comp.activo ? COLORS.red : COLORS.muted;
    const icon = comp.activo
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    const avatarSrc = COMPETITOR_AVATARS[comp.nombre] || "";
    const avatarHtml = avatarSrc
      ? `<img src="${avatarSrc}" width="40" height="40" style="border-radius:50%;object-fit:cover;flex-shrink:0" alt="${escapeHtml(comp.nombre)}">`
      : `<div style="width:40px;height:40px;border-radius:50%;background:${COLORS.border};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:${COLORS.muted};flex-shrink:0">${comp.nombre.charAt(0)}</div>`;
    sub1.push(`<div style="padding:14px 16px;border:1px solid ${borderColor};border-radius:8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06);display:flex;align-items:center;gap:12px">`);
    sub1.push(avatarHtml);
    sub1.push(`<div>`);
    sub1.push(`<div style="font-weight:700;font-size:14px;margin-bottom:4px">${escapeHtml(comp.nombre)}</div>`);
    sub1.push(`<div style="font-size:12px;color:${statusColor};display:flex;align-items:center;gap:6px">${icon} ${escapeHtml(comp.estado)}</div>`);
    sub1.push(`</div></div>`);
  }
  sub1.push(`</div>`);

  sub1.push(`<div style="font-size:13px;margin-bottom:24px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg><a href="https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=AR&q=soyana" target="_blank" style="color:${COLORS.red};font-weight:600">Ver ads de Soyana en Meta Ad Library</a></div>`);

  // Soyana reference ads — simulated IG posts with dolor tags
  const refImages = loadSoyanaRefImages();
  const compAds = data.competenciaAds;
  const cuenta = compAds?.cuenta || "soyana_alimentos";
  const formatMeta: Record<string, { tipo: string; dolor: string }> = {};
  if (compAds) {
    for (const fm of compAds.formatos) {
      formatMeta[fm.id] = { tipo: fm.tipo, dolor: fm.dolor };
    }
  }

  // References — formatos with postUrl (iframe) or imageFile (static image)
  const refFormats = compAds?.formatos.filter(f => f.postUrl || f.imageFile) ?? [];
  if (refFormats.length) {
    sub1.push(`<div class="card-label" style="margin-bottom:12px">REFERENCIAS DE ADS ACTIVOS (REELS / STORIES / CARRUSELES)</div>`);
    sub1.push(`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px">`);
    for (const ef of refFormats) {
      sub1.push(`<div>`);
      if (ef.postUrl) {
        const embedUrl = ef.postUrl.replace(/\/$/, "") + "/embed";
        sub1.push(`<iframe src="${embedUrl}" style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
      } else if (ef.imageFile) {
        const imgPath = resolve(__dirname, `../assets/${ef.imageFile}`);
        try {
          const ext = ef.imageFile.split(".").pop() || "jpeg";
          const mime = ext === "png" ? "image/png" : "image/jpeg";
          const b64 = readFileSync(imgPath).toString("base64");
          sub1.push(`<img src="data:${mime};base64,${b64}" style="width:100%;min-height:430px;object-fit:cover;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;display:block" alt="">`);
        } catch {
          sub1.push(`<div style="width:100%;min-height:430px;border:1px solid ${COLORS.border};border-radius:8px 8px 0 0;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;color:${COLORS.muted};font-size:13px">Imagen no disponible</div>`);
        }
      }
      // Dolor / Solucion card — pegado al iframe
      sub1.push(`<div style="padding:10px 12px;border:1px solid ${COLORS.border};border-top:none;border-radius:0 0 8px 8px;background:${COLORS.surface};box-shadow:0 1px 3px rgba(0,0,0,0.06);font-size:12px;line-height:1.5">`);
      sub1.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span><span style="color:${COLORS.red};font-weight:700">Dolor:</span> ${escapeHtml(ef.dolor)}</span></div>`);
      if (ef.solucion) {
        sub1.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:8px 0">`);
        sub1.push(`<div style="display:flex;align-items:flex-start;gap:6px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span><span style="color:#16a34a;font-weight:700">Solucion:</span> ${escapeHtml(ef.solucion)}</span></div>`);
      }
      sub1.push(`</div>`);
      sub1.push(`</div>`);
    }
    sub1.push(`</div>`);
  }

  parts.push(subsection(1, "Competencia", sub1.join("\n")));

  // ── 2. ICPs ─────────────────────────────────────────────────────────
  const sub2: string[] = [];

  const personIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  sub2.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">3 perfiles de cliente ideal para la campaña B2C. Cada uno tiene <strong>dolores</strong>, <strong>deseos</strong> y <strong>objeciones</strong> que atacamos con los <strong>angulos creativos</strong>.</p>`);

  if (data.icp.length) {
    sub2.push(`<div style="display:grid;gap:16px;margin-bottom:24px">`);
    for (let i = 0; i < data.icp.length; i++) {
      const icpItem = data.icp[i];
      const isPrimario = icpItem.prioridad === "primario";

      // Card
      sub2.push(`<div style="border:1px solid ${COLORS.border};border-radius:8px;border-left:4px solid ${COLORS.red};box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden">`);

      // Header
      sub2.push(`<div style="padding:18px 20px 14px;display:flex;align-items:center;gap:12px">`);
      sub2.push(`<div style="width:38px;height:38px;border-radius:50%;background:${COLORS.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0">${personIcon}</div>`);
      sub2.push(`<div style="flex:1">`);
      sub2.push(`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">`);
      sub2.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">ICP ${i + 1}</span>`);
      sub2.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px">${escapeHtml(icpItem.segmento)}</span>`);
      sub2.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isPrimario ? `background:${COLORS.ink};color:${COLORS.surface}` : `background:${COLORS.bg};color:${COLORS.muted};border:1px solid ${COLORS.border}`}">${isPrimario ? "Primario" : "Secundario"}</span>`);
      const isRecurrente = icpItem.recurrencia === "alta" || icpItem.recurrencia === "media";
      sub2.push(`<span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;${isRecurrente ? `background:#F0FDF4;color:#22C55E;border:1px solid #BBF7D0` : `background:${COLORS.gapBg};color:${COLORS.escenario2};border:1px solid #FDE68A`}">${isRecurrente ? "Consumo recurrente" : "Consumo ocasional"}</span>`);
      sub2.push(`</div>`);
      sub2.push(`</div>`);
      sub2.push(`</div>`);

      // Description
      sub2.push(`<div style="padding:0 20px 14px"><p style="font-size:13px;color:${COLORS.muted};margin:0;line-height:1.6">${escapeHtml(icpItem.descripcion)}</p></div>`);

      // Dolores / Deseos / Objeciones
      sub2.push(`<div style="padding:0 20px 20px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">`);

      // Dolores
      sub2.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub2.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Dolores</div>`);
      sub2.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const dolor of icpItem.dolores) {
        sub2.push(`<li style="margin-bottom:4px">${escapeHtml(dolor)}</li>`);
      }
      sub2.push(`</ul></div>`);

      // Deseos
      sub2.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub2.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#22C55E;font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Deseos</div>`);
      sub2.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const deseo of icpItem.deseos) {
        sub2.push(`<li style="margin-bottom:4px">${escapeHtml(deseo)}</li>`);
      }
      sub2.push(`</ul></div>`);

      // Objeciones
      sub2.push(`<div style="padding:14px;background:${COLORS.bg};border-radius:6px">`);
      sub2.push(`<div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.escenario2};font-weight:600;margin-bottom:8px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>Objeciones</div>`);
      sub2.push(`<ul style="font-size:12px;margin:0;padding-left:16px;line-height:1.65;color:${COLORS.ink}">`);
      for (const obj of icpItem.objeciones) {
        sub2.push(`<li style="margin-bottom:4px">${escapeHtml(obj)}</li>`);
      }
      sub2.push(`</ul></div>`);

      sub2.push(`</div>`); // close grid
      sub2.push(`</div>`); // close card
    }
    sub2.push(`</div>`);
  }

  parts.push(subsection(2, "ICPs", sub2.join("\n")));

  // ── 3. Angulos Creativos + Piezas ──────────────────────────────────
  const sub3: string[] = [];

  const piezasPorIcp = data.creativos?.piezasPorIcp?.length ? data.creativos.piezasPorIcp[0].piezas.length : 0;
  const totalIcps = data.creativos?.piezasPorIcp?.length ?? 0;
  const totalEnUso = piezasPorIcp * totalIcps;

  sub3.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px"><strong>${totalEnUso} piezas en uso</strong> (${piezasPorIcp} por cada ICP): 3 videos UGC reutilizables para ambos ICPs + 5 piezas graficas personalizadas por cada ICP. Cada pieza ataca un dolor especifico y comunica una solucion.</p>`);

  // Foodie exclusion callout
  const foodieIcp = data.icp.find(i => i.prioridad === "secundario" && i.recurrencia === "baja");
  if (foodieIcp) {
    sub3.push(`<div style="padding:14px 18px;background:${COLORS.gapBg};border-left:3px solid ${COLORS.escenario2};border-radius:0 6px 6px 0;margin-bottom:20px;font-size:13px;line-height:1.6"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>ICP de ${escapeHtml(foodieIcp.segmento)}</strong> no se incluye en esta etapa. Su consumo es ocasional y conviene optimizar los recursos de produccion creativa y presupuesto de ads, hacia los ICPs de consumo recurrente, que tienen mejor retorno para el negocio.</div>`);
  }

  const videoIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
  const imgIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  const shopIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;

  if (data.creativos?.piezasPorIcp?.length) {
    for (let g = 0; g < data.creativos.piezasPorIcp.length; g++) {
      const grupo = data.creativos.piezasPorIcp[g];
      const piezaCount = grupo.piezas.length;

      // Dropdown per ICP
      sub3.push(`<details style="border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.05)">`);
      sub3.push(`<summary style="padding:16px 20px;cursor:pointer;list-style:none;display:flex;align-items:center;gap:10px;user-select:none;background:${COLORS.bg};border-radius:8px">`);
      sub3.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">ICP ${g + 1}</span>`);
      sub3.push(`<span style="font-family:${FONTS.heading};font-weight:700;font-size:15px;flex:1">${escapeHtml(grupo.icp)}</span>`);
      sub3.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted}">${piezaCount} piezas</span>`);
      sub3.push(`</summary>`);

      // Pieces inside dropdown
      sub3.push(`<div style="padding:12px 20px 20px;display:grid;gap:10px">`);
      for (let p = 0; p < grupo.piezas.length; p++) {
        const pieza = grupo.piezas[p];
        const fmt = pieza.formato.toLowerCase();
        const isVideo = fmt.includes("video") || fmt.includes("ugc");
        const isShopping = fmt.includes("shopping") || fmt.includes("catalogo");
        const borderLeft = isVideo ? `border-left:4px solid ${COLORS.red}` : isShopping ? `border-left:4px solid #EA580C` : `border-left:4px solid ${COLORS.border}`;
        const formatIcon = isVideo ? videoIcon : isShopping ? shopIcon : imgIcon;
        const formatBadgeBg = isVideo ? COLORS.red : isShopping ? "#EA580C" : COLORS.bg;
        const formatBadgeColor = isVideo || isShopping ? "#fff" : COLORS.muted;

        sub3.push(`<div style="padding:14px 16px;border:1px solid ${COLORS.border};border-radius:8px;${borderLeft};background:${COLORS.surface}">`);

        // Header: format badge
        sub3.push(`<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">`);
        sub3.push(`<span style="font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;background:${formatBadgeBg};color:${formatBadgeColor};font-family:${FONTS.mono}">${formatIcon}${escapeHtml(pieza.formato)}</span>`);
        sub3.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted}">Pieza ${p + 1}/${piezaCount}</span>`);
        sub3.push(`</div>`);

        // Dolor
        sub3.push(`<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">`);
        sub3.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`);
        sub3.push(`<span style="font-size:13px;line-height:1.5"><span style="color:${COLORS.red};font-weight:700">Dolor:</span> ${escapeHtml(pieza.dolor)}</span>`);
        sub3.push(`</div>`);

        // Solucion
        sub3.push(`<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:8px">`);
        sub3.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`);
        sub3.push(`<span style="font-size:13px;line-height:1.5"><span style="color:#16a34a;font-weight:700">Solucion:</span> ${escapeHtml(pieza.solucion)}</span>`);
        sub3.push(`</div>`);

        // Guion / Mensajes
        sub3.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:8px 0">`);
        if (isVideo && pieza.hook) {
          // Video UGC: Hook / Body / CTA structure
          sub3.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px">Guion</div>`);
          sub3.push(`<div style="display:grid;gap:6px;font-size:12px;line-height:1.5">`);
          sub3.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:${COLORS.red};font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">HOOK</span><span>${escapeHtml(pieza.hook)}</span></div>`);
          if (pieza.body) sub3.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:${COLORS.ink};font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">BODY</span><span>${escapeHtml(pieza.body)}</span></div>`);
          if (pieza.cta) sub3.push(`<div style="display:flex;align-items:flex-start;gap:8px"><span style="font-weight:700;color:#16a34a;font-family:${FONTS.mono};font-size:11px;flex-shrink:0;min-width:40px">CTA</span><span>${escapeHtml(pieza.cta)}</span></div>`);
          sub3.push(`</div>`);
        } else if (pieza.mensajes && pieza.mensajes.length) {
          // Static pieces: Mensajes list
          sub3.push(`<div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px">Mensajes</div>`);
          sub3.push(`<ul style="margin:0;padding-left:16px;font-size:12px;line-height:1.7;color:${COLORS.ink}">`);
          for (const msg of pieza.mensajes) sub3.push(`<li>${escapeHtml(msg)}</li>`);
          sub3.push(`</ul>`);
        } else {
          // Fallback: comunicacion field
          sub3.push(`<div style="display:flex;align-items:flex-start;gap:6px">`);
          sub3.push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`);
          sub3.push(`<span style="font-size:12px;color:${COLORS.muted};line-height:1.5;font-style:italic">${escapeHtml(pieza.comunicacion)}</span>`);
          sub3.push(`</div>`);
        }

        sub3.push(`</div>`); // close piece card
      }
      sub3.push(`</div>`); // close dropdown body
      sub3.push(`</details>`); // close dropdown
    }
  }

  if (data.creativos?.tono) {
    sub3.push(`<div class="callout" style="margin-bottom:12px"><strong>Tono de comunicacion:</strong> ${escapeHtml(data.creativos.tono)}</div>`);
  }

  const b2c = data.arquitectura.find((c) => c.nombre.toLowerCase().includes("conversion") || c.nombre.toLowerCase().includes("b2c") || c.nombre.toLowerCase().includes("ecommerce") || c.nombre.toLowerCase().includes("venta"));

  parts.push(subsection(3, `Angulos Creativos + Piezas <span style="display:inline-block;font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:2px 8px;background:#FEF3C7;color:#92400E;border-radius:4px;margin-left:8px;vertical-align:middle;letter-spacing:0.5px;text-transform:uppercase">En Desarrollo</span>`, sub3.join("\n")));

  // ── 5. Campaña B2C en Meta Ads ──────────────────────────────────────
  const sub5: string[] = [];

  if (b2c) {
    const slugB2C = data.clientInfo.slug?.toUpperCase() || escapeHtml(data.clientInfo.nombreEmpresa);

    // Aclaración sobre relación con awareness
    sub5.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Las audiencias son las mismas que en Awareness. La campaña de Awareness nutre al publico con contenido de branding y posicionamiento, y esta campaña le muestra contenido de conversion con enfoque directo a venta. <strong>Mismo publico, distinto objetivo.</strong></p>`);

    // Campaign definition card (same pattern as awareness)
    sub5.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub5.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 32px">`);

    // Objetivo
    sub5.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Objetivo de Campaña</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">Ventas</p></div>`);
    // Destino
    sub5.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Destino</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">${data.clientInfo.sitioWeb ? escapeHtml(data.clientInfo.sitioWeb) : "e-commerce"}/[producto]</p></div>`);

    // HR
    sub5.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Audiencias (parsed into Edad/Locación/Intereses, same as awareness)
    sub5.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Audiencias</div>`);
    for (let ai = 0; ai < b2c.adSets.length; ai++) {
      const adSet = b2c.adSets[ai];
      const seg = adSet.segmentacion;
      const dotIdx = seg.indexOf(". ");
      const beforeDot = dotIdx > -1 ? seg.substring(0, dotIdx) : seg;
      const interesesRaw = dotIdx > -1 ? seg.substring(dotIdx + 2) : "";
      const commaIdx = beforeDot.indexOf(", ");
      const edad = commaIdx > -1 ? beforeDot.substring(0, commaIdx).trim() : beforeDot;
      const locacion = commaIdx > -1 ? beforeDot.substring(commaIdx + 2).trim() : "";
      const intereses = interesesRaw.replace(/^Intereses:\s*/i, "").split(",").map((s: string) => s.trim()).filter(Boolean);

      if (ai > 0) sub5.push(`<hr style="border:none;border-top:1px solid ${COLORS.border};margin:12px 0">`);
      sub5.push(`<div style="font-size:13px;font-weight:700;color:${COLORS.red};margin:${ai === 0 ? "8" : "4"}px 0 4px;text-transform:uppercase;letter-spacing:0.5px">${escapeHtml(adSet.nombre)}</div>`);
      sub5.push(`<ul style="font-size:14px;margin:4px 0 0;padding-left:20px;line-height:1.8">`);
      sub5.push(`<li><span style="font-weight:600">Edad:</span> ${escapeHtml(edad)}</li>`);
      if (locacion) sub5.push(`<li><span style="font-weight:600">Locación:</span> ${escapeHtml(locacion)}</li>`);
      if (intereses.length) sub5.push(`<li><span style="font-weight:600">Intereses:</span> ${intereses.map(i => escapeHtml(i)).join(", ")}</li>`);
      sub5.push(`</ul>`);
    }
    sub5.push(`</div>`);

    // HR
    sub5.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // Conversion | Presupuesto (2 columns)
    sub5.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Conversion</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">Visitas a pagina de producto / Ventas</p></div>`);
    sub5.push(`<div><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Presupuesto</div><p style="font-size:14px;font-weight:700;margin:4px 0 0">USD $350/mes <span style="font-weight:400;color:${COLORS.muted}">($11.5/dia)</span></p><p style="font-size:13px;color:${COLORS.muted};margin:4px 0 0">USD $175 por audiencia ($5.8/dia)</p></div>`);

    // HR before KPIs
    sub5.push(`<div style="grid-column:1/-1"><hr style="border:none;border-top:1px solid ${COLORS.border};margin:4px 0"></div>`);

    // KPIs a evaluar (full width, flex-row)
    sub5.push(`<div style="grid-column:1/-1"><div class="card-label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>KPIs a evaluar</div><div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px"><span style="font-size:13px;font-weight:600;padding:6px 14px;background:#fff;border:1px solid ${COLORS.border};border-radius:6px">CPA</span><span style="font-size:13px;font-weight:600;padding:6px 14px;background:#fff;border:1px solid ${COLORS.border};border-radius:6px">ROAS</span><span style="font-size:13px;font-weight:600;padding:6px 14px;background:#fff;border:1px solid ${COLORS.border};border-radius:6px">Ticket promedio</span><span style="font-size:13px;font-weight:600;padding:6px 14px;background:#fff;border:1px solid ${COLORS.border};border-radius:6px">Tasa de conversion</span></div></div>`);

    sub5.push(`</div></div>`); // close grid + card

    // Nomenclatura — card separado, 3 columnas (same as awareness)
    const totalAdsB2C = b2c.adSets.reduce((sum, as_) => sum + as_.ads.length, 0);
    sub5.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
    sub5.push(`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">`);
    sub5.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>Campaña</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${slugB2C}_Ventas</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">{Empresa}_{Objetivo}</p></div>`);
    sub5.push(`<div style="text-align:center;padding:12px;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border}"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Ad Sets (${b2c.adSets.length})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">${escapeHtml(b2c.adSets[0]?.nombre || "")}</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Conjunto_{ICP}</p></div>`);
    sub5.push(`<div style="text-align:center;padding:12px"><div class="card-label" style="justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>Ads (${totalAdsB2C})</div><p style="font-size:15px;font-weight:700;margin:8px 0 4px;font-family:${FONTS.mono}">Anuncio_VideoUGC_V1</p><p style="font-size:12px;color:${COLORS.muted};margin:0;font-family:${FONTS.mono}">Anuncio_{Formato}_{Angulo}_{V}</p></div>`);
    sub5.push(`</div></div>`);
  } else {
    sub5.push(`<p style="font-size:14px;color:${COLORS.muted}">Campaña B2C pendiente de definicion.</p>`);
  }

  parts.push(subsection(4, "Campaña B2C en Meta Ads", sub5.join("\n")));

  // ── 6. Productos y Ofertas de Ecommerce ─────────────────────────────
  const sub6: string[] = [];
  sub6.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Comparativa de pricing de DEFU vs su competidor directo (Soyana).</p>`);

  // ── Comparativa de precios DEFU vs Soyana ──
  sub6.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Comparativa de precios: DEFU vs Soyana</div>`);
  sub6.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;margin-bottom:24px;background:${COLORS.bg}">`);
  sub6.push(`<table style="width:100%;margin:0"><thead><tr><th style="text-align:left">Producto (envasado al vacio)</th><th style="text-align:right">Precio</th><th style="text-align:right">Precio/kg</th><th style="text-align:center">Diferencia</th></tr></thead><tbody>`);
  sub6.push(`<tr><td><strong>DEFU</strong> Tofu Comun al Vacio 800g</td><td style="text-align:right">$6.500</td><td style="text-align:right;font-weight:700">$8.125/kg</td><td style="text-align:center"><span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">-67%</span></td></tr>`);
  sub6.push(`<tr><td><strong>DEFU</strong> Tofu Duro al Vacio 800g</td><td style="text-align:right">$8.000</td><td style="text-align:right;font-weight:700">$10.000/kg</td><td style="text-align:center"><span style="background:#DCFCE7;color:#166534;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">-59%</span></td></tr>`);
  sub6.push(`<tr style="border-top:2px solid ${COLORS.border}"><td><strong>Soyana</strong> Tofu Organico Natural 350g</td><td style="text-align:right">$8.500</td><td style="text-align:right;font-weight:700;color:${COLORS.red}">$24.286/kg</td><td style="text-align:center"><span style="background:#FEF2F2;color:#991B1B;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">Referencia</span></td></tr>`);
  sub6.push(`</tbody></table>`);
  sub6.push(`<p style="font-size:13px;color:${COLORS.muted};margin:12px 0 0">Fuente: <a href="https://www.defu.com.ar/productos/" style="color:${COLORS.red}">defu.com.ar</a> y <a href="https://www.soyana.com.ar" style="color:${COLORS.red}">soyana.com.ar</a>. Precios al 02/09/2026.</p>`);
  sub6.push(`</div>`);

  // Sugerencia de pricing
  sub6.push(`<div style="padding:16px 20px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;margin-bottom:24px;font-size:14px;line-height:1.65;color:#9A3412"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>Sugerencia de pricing:</strong> DEFU tiene un diferencial de precio enorme vs Soyana (<strong>hasta 69% mas barato por kg</strong>). Hay margen para subir ligeramente los precios de e-commerce y mejorar la rentabilidad, manteniendo una ventaja clara frente al competidor.</div>`);

  // ── Ofertas propuestas ──
  sub6.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="8 12 12 16 16 8"/></svg>Ofertas propuestas</div>`);

  if (data.ofertas && data.ofertas.length) {
    sub6.push(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">`);
    for (let i = 0; i < data.ofertas.length; i++) {
      const oferta = data.ofertas[i];
      sub6.push(`<div style="padding:20px;border:1px solid ${COLORS.border};border-radius:8px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.06)">`);
      sub6.push(`<div style="font-size:15px;font-weight:700;margin-bottom:8px">${escapeHtml(oferta.nombre)}</div>`);
      // Split description: items before ". " sentence at the end
      const descParts = oferta.descripcion.split(". ");
      const itemsPart = descParts[0];
      const closingSentences = descParts.slice(1).join(". ");
      const items = itemsPart.split(" + ").map((s: string) => s.trim()).filter(Boolean);
      if (items.length > 1) {
        sub6.push(`<ul style="font-size:13px;line-height:1.8;color:${COLORS.muted};margin:0 0 8px;padding-left:18px">`);
        for (const item of items) sub6.push(`<li>${escapeHtml(item)}</li>`);
        sub6.push(`</ul>`);
        if (closingSentences) sub6.push(`<p style="font-size:13px;line-height:1.5;color:${COLORS.muted};margin:0 0 12px">${escapeHtml(closingSentences)}</p>`);
      } else {
        sub6.push(`<p style="font-size:14px;line-height:1.6;color:${COLORS.muted};margin:0 0 12px">${escapeHtml(oferta.descripcion)}</p>`);
      }
      sub6.push(`<div style="font-family:${FONTS.mono};font-size:13px;font-weight:600;color:${oferta.precio ? COLORS.red : COLORS.escenario2}">${oferta.precio ? escapeHtml(oferta.precio) : "Precio por definir con Angel"}</div>`);
      sub6.push(`</div>`);
    }
    sub6.push(`</div>`);
  }

  // Packs ecommerce table
  if (data.cambiosEcommerce && data.cambiosEcommerce.length) {
    sub6.push(`<div class="card-label" style="margin-bottom:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Cambios en Tienda Nube</div>`);
    sub6.push(`<table>`);
    sub6.push(`<thead><tr><th>Cambio</th><th>Objetivo</th></tr></thead>`);
    sub6.push(`<tbody>`);
    for (const cambio of data.cambiosEcommerce) {
      sub6.push(`<tr><td>${escapeHtml(cambio.cambio)}</td><td>${escapeHtml(cambio.objetivo)}</td></tr>`);
    }
    sub6.push(`</tbody></table>`);
  }

  sub6.push(`<div class="callout callout-red" style="margin-top:16px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;margin-right:8px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><strong>Accion requerida:</strong> Angel debe crear estos productos/packs en Tienda Nube antes de lanzar la campaña B2C.</div>`);
  parts.push(subsection(5, "Ecommerce", sub6.join("\n")));

  return section(3, "b2c", "Foundation B2C", parts.join("\n"));
}

// ─── 05. Roadmap ────────────────────────────────────────────────────

function renderRoadmap(data: FoundationData): string {
  const parts: string[] = [];

  if (data.roadmap && data.roadmap.length) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Plan de ejecución para las primeras 8 semanas del proyecto:</p>`);

    const fechaISO = data.datosF1?.fechaInicioISO ?? null;

    const milestones: GanttMilestone[] = [
      { semana: 1, label: "KO Call", fecha: "25/08" },
      { semana: 2, label: "Foundation Review", fecha: "03/09" },
      { semana: 4, label: "Launch B2C", fecha: "22/09" },
      { semana: 6, label: "Call ADS", fecha: "06/10" },
      { semana: 8, label: "Review Final", fecha: "18/10" },
    ];
    parts.push(renderGantt(data.roadmap, fechaISO, milestones));

    // Detalle de cada reunión
    parts.push(`<h3 style="margin-top:32px">Reuniones del proyecto</h3>`);
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:16px">Que se cubre en cada reunion agendada:</p>`);

    const meets: { semana: string; fecha: string; nombre: string; desc: string; status: "done" | "current" | "pending" }[] = [
      { semana: "S1", fecha: "25/08", nombre: "KO Call", desc: "Kickoff con el cliente. Configuracion de Meta Ads, accesos, credenciales e-commerce. Se deja todo listo para empezar.", status: "done" },
      { semana: "S2", fecha: "03/09", nombre: "Foundation Review", desc: "Revision completa del setup: campaña de awareness ya activa, estrategia B2C, audiencias, ofertas, demo de REE Metrics. Aprobacion para lanzar.", status: "current" },
      { semana: "S4", fecha: "22/09", nombre: "Launch Funnel B2C", desc: "Lanzamiento de la campaña de conversion B2C. Review de metricas de awareness (alcance, visitas al perfil, followers). Activacion del funnel de e-commerce con las 16 piezas en uso (13 producidas).", status: "pending" },
      { semana: "S6", fecha: "06/10", nombre: "Call ADS", desc: "Seguimiento de campañas activas. Optimizaciones en base a datos, ajustes de audiencias, nuevos angulos creativos si es necesario.", status: "pending" },
      { semana: "S8", fecha: "18/10", nombre: "Review Final", desc: "Revision del periodo completo. Resultados vs KPIs, aprendizajes, recomendaciones para el siguiente ciclo.", status: "pending" },
    ];

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
      parts.push(`<div style="padding:14px 20px;border:1px solid ${borderColor};border-radius:8px;${isCurrent || isDone ? `border-width:2px;` : ""}${bg}">`);
      parts.push(`<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">`);
      parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${isDone ? "#16a34a" : COLORS.red}">${meet.semana}</span>`);
      parts.push(`<span style="font-weight:700;font-size:14px">${escapeHtml(meet.nombre)}</span>`);
      parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted}">${meet.fecha}</span>`);
      parts.push(badge);
      parts.push(`</div>`);
      parts.push(`<p style="font-size:13px;color:${COLORS.ink};margin:0;line-height:1.6">${escapeHtml(meet.desc)}</p>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);

  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Roadmap pendiente de definición.</p>`);
  }

  return section(5, "roadmap", "Roadmap de Ejecución", parts.join("\n"));
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

/** Compute dd/mm date for the Monday of a given week (1-indexed) from project start ISO */
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

// ─── 04. REE Metrics ─────────────────────────────────────────────────

function renderReeMetrics(): string {
  const parts: string[] = [];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Es la plataforma de performance donde vas a poder ver en tiempo real como rinden tus campañas. Accedes desde cualquier dispositivo, las 24 horas.</p>`);

  // Paso a paso para ingresar
  parts.push(`<h3>Como ingresar</h3>`);

  const tentaculosB64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAHhlWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAECgAwAEAAAAAQAAAEAAAAAAdd52hwAAAAlwSFlzAAALEwAACxMBAJqcGAAAGoFJREFUeAHtenl8XNV97/fOvi+SxtptS7KsxbuFjW2wMWYzqRtCAgnhGSg0FBp4aV8+Tds0TfppyievebxPmyaBlqRJ2qQhpQkpxiwxxHgD74tka7ElWdY2kkaafZ+5M/f2e66k1oBt6LNo3x8+9ujeufeec8/3e377GeBau8bANQauMfDfx4COr9b/970ekP4LX260Yv0qg8G80WY1rbSaLQuMRoMdkqRTCsVMLp8LyLnCORWFo0Vkj4Qyh/z/FXMzfNQvcWFJCYylD5SXzXtoyeKGFcuXLtEtmD8fdocXKkzIF1WkM1mEIhEMjYyg/3w/RkcGQsaY+0095O/5k7v3fJRz/EglwGPc9GBFedWfbt2yqfHmjZvhKalFPGdELKUgnS8iX1ChqIBChKoQRv7PFwoIhifR1X0MPaf2qPnQ2Iu8+hV/YnfvR0HER0KAF21ug63s2xvXrXnwkf+xHb7yOmTzCoYCOcSziqZ3AvQs+CK/UBD4USHOFUmHgk6P3uA4uo++gWjnvkBBjn5+PPrrX841CXNugITIW101v3jkvnvufviB34HZVooKD/jRYzxSQCpLpKRdAy9WX/vMSIIAT4RFXiwWi3BYaCKqFkG2ex35seFP2vUV44ncwMm5JGFOCViIzRY4S//5dx/cfsfWrZ9GPK1i6QKjtqonB7IkoDgDXgCWtFXnomskaBJwsVTMnFt0EtIOH/Qenz7j799qMVa0p7IX5kwd5pQAvWXRU/f+5m88fM/d23FuNAOrWUImB7QT/FSM4AWoGWBi5QV4AfxiaeDXi56hZZAkKEoRaYsXBotVnx3tu8ltq3khnrmQEONdbZszAlzGG9Yta2l57ou/+wX9eFSHFXUm9IzmMRoqIEdjJ5oAqwHkH4Xop4ETIK8Ky6AdKRninqBLUwee63Q6xLJp6L1VKMRDrmxozJHMnX9FG/Qq/4hAZC6a5LS5vvrwZz5jmko5aOVldA3nIAuJ5xtU/hMGbhrgxeCn710sAdNkzDzDmQnCDCTAbjJCJSOu1k3Qm13bq0o3N8/FxOeEACPWrFja3HRbU/NqjIUyyBUNCKf1BG+YNmhixcUK8zht7QVAcW3mKFDS6uuNJkh6E+8JaSB4ksb/2rnFIAgowkQpsFU129S88YH/bwiwm2wf37xhgzGUMmpAe88dw86XnkVHx15+12lGULPsRKW5OkEEZz9Lhkrw/sEO7Hv5GXQe3QFZTokAkX1npUaFQa/jSJQo2gRbTQskg+k32tBmvFoS5kQCSjzemxY3tiCUUNDVuQ8njr8Jg9GMnJybASxUYBb8tDpMEzF7DuTyWehNFgRG+nBk198jl40T/n+QIIDzP1S6R5O3kmpgXxzwORdcLQFzEAr7HF6Pq97qKMXQeAJOlxufuPcPKM5mFBjVyEVZE3dhBy4WeXEuSNFUoSCjqmENqhrX8buKgL8H0cgwPJVLQKlnYETgWsjGURQFeosDBqvHmguH6jhM/9WQMAcEeN1Oh91RUIX4q6iqWQmVvjvLFZV0vKbpM8ELsJypdpw51whgH1VYSi5vgRIj6Q3wVjUzJKYRVQooErjoxy4EL2wCzyQDCbaJC76rAS/6zgEBNqNepzdkC2KiOmTlLA7vfxGh4CDKa1qxbO02zRX8BwHvJgM0lIlYAF1HdiITD3BlvWha93FYSujyKD3AVggJKNIFCAIYFBA4j/QMPLvq+c+BDcjk5YJcyAqfR2N2iOBbWhV8/ye/j1tvcaKv5y2uogEyJ13QPgC5mhZ/rnw8HsS5Q/+AR7Y34wc/fByfe6AVPXv/Hsn4FBQBkuCF+Beo+8oMeGEH1EKe7tFw1cHQHBAQjseTyVg8lUE4PAWPN4a/+OaT6OroQfuJHoQn2pFIxwmaIs6FEx/NIGorq8PI2d146ql70bi4Bs9+62fQGyQ89uhGDJ3ZA9WgJwFCRZgPyvLM6ktQ8zkUckmFvI5wmKtqc0DAVCqWiA+OT01ScE3h9q0rmc+P4YtPfAsbNq5AdaUdofAEpUAHQtBWX5MAnkfjEaxvc5M0Bz5795/AZrPA67UjnU6jxJJAnnZE6H+B4p9NZ0kAySgoKKQiULKJgCRnzl8VenaeAwKgppOpw0MXLlDXgfkLyvH2/na6MRnPffclHDpwhm+h+PNlmusTR/EhIZlMHGvX1OHFF95CJpVHOBTH0cM92sfrMdMQylx9iXGBzPHyQg+4+jwPjtA7ZA4Ox96OcKiranNBAOeV/vXI0FlVb7YimcxD5iSF3/YPB5Fh/m+0OmbAMwPkdMWqEgokoxFmqwX+0Sl4awdXHqgKcOd4Ol8iNJkVe5+G2CaAUfyR/jBOh2VF+d8IB/dMZ0F/MclKiT4SQFUz1TYI+LWdJDaJEVHRn8qqJd+BhGcnSQAVm3I5NTIe/vQ8Gug0N9k2hcaJ8i6YNZCpuT/00r5M/4JGQX1Fqm9GUWHl3uP+OlTfGzUdS5K5JHHRMqLTTfFXHLTmMNIfkGUzzzJx1q1lAYp5aJD7fNVeX5bGJhv4wH8LwajpYikYFO7eIa4OU5Qi1jUhzMGAqwEamYJi9xo+2qBp2T4fvifoYAm8liW7P0bxHj+5tq7HIZQ3q1RKLh7sLcv3gZf9MQSGBmOi4lEkE49v+qsC3ypb9/Rj0NMq+kJDyblS5vZdFX39m42JnuvqJH/Qn/wjnDn1d1JOG5/RZn+vIhn3UGq/w5CsF4WuhpySwx3w1Lbpp8fSbdbmFjnONLhDX3AWuaA1XUY7H8CJ/Z97cjo0Ik3Jbp72AlVq5bDiYcZapPbLQ4i23kkFRY7ub72+M1ywAAiaDPncb2KRJUyodkkJL+TxJQUoR/tPAi3JuIjhzTfp7OdMdvnbPWw8LwL3MNPjacTQz9OncuNE5FHxFnzm8s9pHgKGpn5d8L8UPq8WKFM4dCfJjHhexLM3IRj18Ef8GPF9bQYJ0EUolzv/4IHCypL0qIwKMmTiGUSo3LuqxcMWy3HNKOr1vYvt5c39hK8l+PzSJKA3OAnrb0bFGnx8Z8/v3BfwB/4fCYd/VpnPvZ/xXyaygNjd88Eq/8WJBjPVtzDZCwVmhpxiCBfEFI1NcxM20VVAqXd/p2dUbcNXTv8cRRLrVCqlKT0/EYEjJaO8nnXvxrj+u2djWIiWZ8qv+lXcewn0uKEOqCKuZ9Iqx/IByL8X+h5o14PbkJ2IfFEahYJVFqf/NjMC/Z7vq8RR0U2jKUXVdGb3PNaTCQFQsuxY1OKtbhYZ7W2KuOjp/I54n1Z3/Y+OlFhXJaauH8xaF6MdHhxKz2o9AjC+JbC5zyE/eLIkVv7kcA+OAXJ8TYjKuS0z+HMnjJIWz2JwMBPafOWSTiS+fQaB/n/Hx6NJgXOoHMN3d5FY+f3lJTfG8xk19t8cdpeTBRg4l9eC/2NMqOPwi8qJLsqtYzfxJnDv+5YNXCm8y5OUuFQWm2aCYyg7xgqLdfG+EvxFCT2n5MjQgU7E7+T5M+XpB9vXnhJEsBmX4vW2Rl2j/S9qjsalJGR3NzewAhUVBIpJkZ2PNQFk4FPIx3S9DusBL3pCqdfwl95PvGHuWjEzYL7XKhBOYnbITwB0bYwz3DLBFM+PXVKF49S/VlcT3G7b6E+Y1z+syjuFcr1KRDmFXR17o/1q5hU8Nl5NJE4ODFJ7DWzEXExNSTyTPzMhvNQcSDCWLmLhqb2Wbs2PTgr4b8gRer7aYbhBmSzXm+k65uELxJi/FQptbg8dlcmTF5HuOZiMR5xsLhBwbHGLvY5iVnFUYFSYPpFXdcXkkJOReGblqhYHpCPxjyhJ5s4gNNBqBfgxqvBbC3K5ZM4BrAP98UYJ+cKuQINWxVFZfh0J3pO3UhJcFaSkpH3qkNnZLyeBkJDJ2hO4xNzaKK+0IlGZjxOxqV2gzYa3kmlsK+vW3xwuiIdhKE30nnkdRrJGVCh1kkRQKMV9t+pjI0FPGFCYw8q/PDUZ6uuI3IW59CMjMDGzBJJf+BgXy4sVwm/cP/BKe3u+EkL2b6JrpTUvZZR5/GRZUWZp9FxVkn9DwFZcNADNJjSFGVZujD5dT3TYiuiGVjCfqI+NJ+s80LL1xn1t/yOCiOEfQIi18r57UJ8NX20TL+8EUdLQEPkEzVCZKYIxfvptHLUXJkO2A6f5JBIZhajBM4Iq/H8NnqpQlTJyZXt+PRX98sJfzeCuY+xB6MxPh7f3+f96zfm/lmjD/CXfCKnpHFI9EqfQtfpEn+Yun7nUxU/Mz/Wh6Pd6f0tLHy9qDOHjnT9dKxo9h+ZFaKcIgkO36I/KJqAjjqGiN7Z9FH55SRWiNyh0Jhv8Zg1Zq4UdRYkEE5hfv6XoGHUXsVdKYF8g29K28gWG+JXB/2cE+D2en1eDwm6nyJsJBZT0CWz8c5zSEYkl8b5e8jlKj5iUfLBBHEGPWBJi+YPNcmcgL/3H9n4nfBDfWbP9Xz8lAUKUvIeT9tC3iKW1RNCNC4ESHnVjY2Nj1UuiIlCyS9fqd0zcj8jxQnJyaA2oKiM45dBYHYm3cHHnX8hL3kWY28oi9HVmGSy3x6cYfigBEI1kQZxPPpCl1ysyX3vTjsVjxYlSb9zDJVYY8LpMFRMl6WYILFbfJRYpLuCNhWxCMr1dJCJnIJY4z+PSzk1MzuExA9Nc7Tj4nMcJRE/PmkwC/0HPbfhfRIPYxJqLHt+cDCwKHJ82ot5m3b3LWL3pCRpMHcEbQJ5tAxNwmjRxIkJfpVIyNXp++2J1tPYKfrnOj+3W4onV0iYgTLvmB1JcZNpUfHxO1KRZO5qhP/ZSGJ12B+pWVJFP2F5GNWqNOjKTqTLJm+3hSCvHZSZaJCJZUHSt+F3e4yxWivRCYT23F2N3LsJN1b/FxHd19jzyyYUuF0Kd6KgFjNB/l/UcDO9HQf4yM26t3kCdBJhgpylW2k2yjUQPIkrSZHLvYieSr3+jKJM/Vh4MjTdQ5I8GH8D3vy4H7SKNEdtT7CZ8EfjFICbG6wlZn5Z8j0+MvpU7lhiDRa1chmZhqQ4Bhs8fU8TUr/2AJcFW3RJYvufb/pqbHy8rPT/hcJhCqUYlbcJjfFe5MxHxPOYqYvAFKcfFYAJJJZ5VR4F1sXpK2sIiSgaqSxLbCv5LIxO5lWkfqt6wc3u8c4M+z7VcjGQCl/uAnOgw++K9B3iRBOKJjb+D23KcPIm1+Ge3y3yD41M/dSQijj3pIwuQ/U5Lz7YVs1YEzyBfD9pPHKg1N6UQdnV88VjPjUZxsO/cDbH2v8NZr2Z1BhMGq4EXDaYxDJnCipvJi2ubPmtd9S1qOjv3xsaVMFg0aJUvfRq9Sz/v+QJq3f7I67MdH3TFx8D7yd4/x9Rjc3ZLLb8z1nnnN5XP2VONPJRpJIQkqEcBPpCPL8tTnYIxlqRVi1YwVSKfh9Zj7XQ/SJSHuoTPQETlqIvw05X+ORPDD1Hh5Tnc3Hs4nCl7/tV++8d3J2+Yfy4XPJd4+Ecwt7bJqPp2VIwQR27S5Ii5XAI9PEeEhZYl7Mpi4w0YhySYL7h1V2LCcYSYO+TeBP/0t+Gz5wwMkJYOQX8CByMJiSGnScrP/ffCn7OzAlLREK8uZMATDwT+rK8sI+rKmT4sMdlYRPKn7RZbiB7kQYpNJOq/cBEiYTEiSZbWZBHHBFD/WL/VIy1UqaO5FfZtHr3RCWz4RnFUV0DhHb+Nb7L17kSmkJIqmxnVRlLlUKvnMzm9rUjY+aVfBPaVhD2xnqBuHsm+T6EvEKuGI8+kxsN/PBfR4dRILIBkx3JCfhH/pxIjbcfa8n8NnOmNPhqJlPi0S1UlTxNk5oVCrGMHHwULuZDwu1jPB9oXOMKZVl0G/5gSvQSCh9g+M2PaHYQVR8H4sE/7iJUjIZPMYqL5Y71JhaxFH/TVXNPSE1E8L9PSJCp9/nZ0/hJ0L3yBF6dw91RKKh8n9B8qAiRjhQUFYZy4lx0j5HifJDlC0RYEDqGe9w6nIrt/cYU/H3jvM0NPu/PPhkIdE8N0ey4fVpXMhb1ckL5kpELhK1BLOIEqzBWS1+Ia2UGblXmZl8UVFSiZPz4oFYhG93J/LJYJbqgE8AUpJY3FYkJu2YiZJqtdNmjWt5zBRXQG9hL8Vr8xKDJ4nJxcFj5qlJsOolUY9nBjfBK8j4/M4rUqJn8Gqv6HCl/D5NJIzjP9O5sYuN2zF6T3P7nLUL2Y8r8D0S8hW7qI/sFqJl5KwGZN3tI6x/AxMSXzSvRLzJ1h7eBR14v3W9f/DbbPT3b4gk0ZKwGC1m95JiEr81Bfl2UHnR0nGyyOflcjDvN5n8x+kz8j7vHyj+J8j/cqwZ1FNZ7sTSfr4g8LJOIEGCv2RFAc2fUkk6KD0cR7ycFREbBLVAGTN4b5qdz5YGkYC2p9X3YalyCaEUFeVqww++zzEjhpIcjYKe/gHp5R8YEEkI5hXxwAJePAIsCDnhnUwM9PqUg/8y8Q77IuuPBBZ8cM5jKJaJFECd1dJFPD/8NlA3Jz3TlFhEkxhvJUOBTy5UJx4+JcHq+6tTxj8YyrAAqJmXJ+fXX3GRqWO1vbD+LfWN5LCmnNrB5pDNJa2XSfU2Ahe+LGbCJBXmRPRZdY6gxG/c+XFPGQf68OB2wWcxdKOYWk+gFQqIkiRl5YJo+WXJXV9q3MxR4EREIvG8SBJfB4xvTlwcIhzJOxckiECYgMUG8eMJ+O0CtLFVqq2VXGf2cNYIWZj1kHw+5JTJ1K91c5VpVhRRTsn4O/4N8TXi32m+L3LT2ckkVh9ILo2gk2VGCfPIi4SJ+kwmgQFj2mhREWHwdYhq9cEJWVzYl78PbLbmH6ER/lhEeJYEuHTsX2c5/EZ2rGDKd4IhVU9xU66wfwjG1kBBi/pLpWL9Zz6oaK8N9FgVONBuGEaETuNE8iNdPxjJnLma4KuB9MxnkKiQRqN2Tiy+0Ik8N/cZoSp0Vf7l2xO0s8TkCnhHw5/4WMicWtU4dWOUfKcJAJFQKoB5pBJfOlQOHw9KPNxq2qzEIxm6FnQ9nXXLXLGfWKUQDEh4T3VhS+3gB+JfNc/x5A0hIvZYBGo+NjCJVwM3VDuyqZN4pIiFYZU/g+D4W8zXU4rPPsLW2PNvCGS9uDk60nddVLPUZ6TKHWIHYImEy/yG4MCBVBBt68nf/ykKQnZ7BuHHj+Rt3w4GE3fPRMgQ/9lSJiJAQ2ubMpYZqjwvFRx9LdR/7YM42FJiJhLtS+h3Dq2gFYH2KxIRLPJXq/xU69A8nxjt2OFz2Mq6wUf+I3h98qsUC/39n+u/g3Pvr/k3vu1Qml5j5G9w5XMU9h9D/6njMK7djKLSoWLsRBMGT72LBk89v2LxXr8rC45TYp5kXdDCgVSbdXQfRMjV3m5N9t6e6epMcb9nAWC2n/NlVAIz2JhIpJhB/v/M/eMJ3z9tZX2z+s9dQ9nJ4ffCUlqP5mw1h2qcjcPkmrOPXME8h2IifJGqFLECCh+RjD39V2OB4eePLsHo6czaF+6h3s2LzxZOnfxjQXl9Xe4qtd+h6cQyOagmFnwRfQ1sqOCUjGqQ8rh/2RY4Fo6L2LGK4sA9sTAW8kJzjO5Ek+oQUJaALgLe59/LRhdKQ91u9K/Xsya+tDh5MkgN9RHFT5upAuJ5VPvQeS8fSJB0k48u0Aek0qYf7K3LxYvR8TjAo8l5Nd+eLPZq2LvCZl4+MWXfE40NPWBLBD2N5y5TuXx/9HNxO/0WNg0eSx/fHfSd3MlHmS5FgCxnTyVDAVe/2eb+Hib9w1dCg+Ua62LMK7YHvY0PrJlccXqMN9USDR5RMUmk6D4+PBPK0+DJR3tz1FsEHRIhD7xSNDHYQxHhMQYk8HjaTVTMBR7j/5vLnXiR8mz20V+/k/CtjlL0HqOJmKh0JfDyeDLqkr0Lqm0WT1KcmI71D3qP0WZ6v7g3xQFwzIQJlrq6GqF2r9MK7dcjFW4jCDp3/FXXfRV2IXx4vNy8cjFhUKU1FvZ55RcE/sYRXAFcIEJbSXN9qdCySCvqPj0TS+WYBd2TKkLqX3mPb5e6fj8z8mT9yMnqkJ9R2+FZjNZ/5WYLYjkrqz1x8N+oS5lmGJZMXHe9LxXR+Kh5MKpjGMC8BcxQxKnJiIhMc6xkP+jKPj4V1r42mPvjWBiKR4USCYqfAVV8cVFu1PJOw1HI3UH2Jv0P9eB65yBY5VdXaM3r68L7BsDPIxypv6YIp6J5I2O5V+K+f1fDuby89w5VX2vXHNQauMXCNgWsMzC0D/wfhCk1PEGpvXAAAAABJRU5ErkJggg==";
  const tentaculosImg = `<img src="data:image/png;base64,${tentaculosB64}" alt="Tentaculos" style="height:18px;width:18px;vertical-align:-3px;margin:0 3px;border-radius:4px">`;

  const pasos = [
    { num: "1", titulo: "Ingresa a REE Metrics", desc: "Abri el link en tu navegador (celular o computadora)." },
    { num: "2", titulo: "Inicia sesion", desc: `Usa las mismas credenciales de <strong>Tentaculos</strong>. Tu cuenta publicitaria ya esta configurada.` },
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
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`, titulo: "Dashboard", desc: "Conexion con Tienda Nube, campanas de Meta Ads y crecimiento de Instagram organico. Todo en una sola vista, personalizable segun requerimientos." },
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, titulo: "Timeline", desc: "Registro de cada cambio realizado en Meta Ads. Documentamos por que se escala o se frena cada anuncio (Kill/Scale) para que siempre sepas que se hizo y por que." },
    { icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, titulo: "E-Commerce", desc: "Datos de tu Tienda Nube: pedidos, facturacion, ticket promedio, clientes unicos, carritos abandonados, top productos y top clientes." },
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
  parts.push(`<div class="callout" style="display:flex;align-items:flex-start;gap:12px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${COLORS.escenario2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><div><strong>En constante desarrollo:</strong> REE Metrics es una plataforma que estamos mejorando continuamente. A medida que lancemos las campanas y se genere data, vamos a comenzar a relacionar la informacion entre Meta Ads, Tienda Nube e Instagram para tener mayor claridad en la toma de decisiones. En un inicio necesitamos lanzar para despues poder cruzar esa data y optimizar.</div></div>`);

  return section(4, "ree-metrics", "REE Metrics", parts.join("\n"));
}

// ─── 07. Proximos Pasos ──────────────────────────────────────────────

function renderProximosPasos(_data: FoundationData): string {
  const parts: string[] = [];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Con tu aprobacion, arrancamos con estos 3 bloques de trabajo:</p>`);

  const pasos = [
    {
      titulo: "Lanzar Awareness + Pixel",
      responsable: "REE Growth + Angel",
      tiempo: "Esta semana",
      items: [
        "Agregar tarjeta de debito internacional en Meta Ads para el debito de las campanas (Angel)",
        "Configurar Pixel de Meta en Tienda Nube",
        "Prender la campana de DEFU_Awareness (ya seteada y lista para lanzar)",
        "Monitoreo diario de Alcance / Visitas al Perfil / Seguidores / Interaccion",
      ],
    },
    {
      titulo: "Creacion de Piezas B2C + Setup de Campañas",
      responsable: "REE Creativos / REE Growth",
      tiempo: "Semanas 2 - 3",
      items: [
        "Produccion de 13 piezas (3 videos UGC reutilizables + 5 graficas por ICP)",
        "2 angulos creativos: Vegano/Veggie y Alimentacion Saludable",
        "Armado de campana DEFU_Ventas, conjuntos y anuncios en el Ad Account",
      ],
    },
    {
      titulo: "Pricing y E-commerce",
      responsable: "Angel + REE Growth",
      tiempo: "Semanas 2 - 3",
      items: [
        "Revisar pricing de productos B2C (hay margen vs competencia)",
        "Crear ofertas Mix Degustacion y Mix Stockeate en Tienda Nube",
        "Definir precios finales de los combos antes de lanzar campaña",
      ],
    },
  ];

  parts.push(`<div style="display:grid;gap:16px">`);
  for (let i = 0; i < pasos.length; i++) {
    const p = pasos[i];
    parts.push(`<div style="border:1px solid ${COLORS.border};border-left:3px solid ${COLORS.red};border-radius:8px;padding:16px 20px">`);
    // Header row: number + title + badges
    parts.push(`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red}">0${i + 1}</span>`);
    parts.push(`<span style="font-weight:700;font-size:14px">${escapeHtml(p.titulo)}</span>`);
    parts.push(`<span style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.muted};background:${COLORS.bg};padding:2px 8px;border-radius:4px">${escapeHtml(p.tiempo)}</span>`);
    parts.push(`<span style="font-size:11px;color:${COLORS.ink};background:${COLORS.bg};padding:2px 8px;border-radius:4px;margin-left:auto">${escapeHtml(p.responsable)}</span>`);
    parts.push(`</div>`);
    // Items
    for (const item of p.items) {
      parts.push(`<div style="display:flex;align-items:flex-start;gap:10px;font-size:13px;line-height:1.5;margin-bottom:4px">`);
      parts.push(`<span style="color:${COLORS.red};font-size:8px;margin-top:5px;flex-shrink:0">&#9632;</span>`);
      parts.push(`<span>${escapeHtml(item)}</span>`);
      parts.push(`</div>`);
    }
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  return section(6, "proximos-pasos", "Proximos Pasos", parts.join("\n"));
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado por REE Creativos
  </div>`;
}
