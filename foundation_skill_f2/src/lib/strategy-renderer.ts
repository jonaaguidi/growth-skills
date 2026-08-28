import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { FoundationData, RoadmapInitiative } from "../types/foundation.js";
import { getClientStyles, escapeHtml, COLORS, FONTS } from "./template-parts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLogoRedBase64(): string {
  const logoPath = resolve(__dirname, "../assets/logo-red.png");
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

export function renderStrategyHtml(data: FoundationData): string {
  const styles = getClientStyles();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Estrategia de Campanas — ${empresa}</title>
${getFaviconTag()}
<style>${styles}</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderObjetivo(data)}
  ${renderCampanas(data)}
  ${renderRoadmap(data)}
  ${renderCreativos(data)}
  ${renderKPIsPresupuesto(data)}
  ${renderProximosPasos(data)}
  ${renderFooter()}
</div>
<a href="#top" class="back-to-top" title="Volver arriba"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header ──────────────────────────────────────────────────────────

function renderHeader(data: FoundationData): string {
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

  const logoB64 = getLogoRedBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  return `
  <div class="header-client" id="top">
    ${logoHtml}
    <div class="header-label">ESTRATEGIA DE CAMPANAS</div>
    <div class="header-title">${empresa}</div>
  </div>`;
}

// ─── Section wrapper ─────────────────────────────────────────────────

function section(num: number, title: string, html: string): string {
  const pad = String(num).padStart(2, "0");
  return `
  <div class="section-client">
    <div class="section-client-header">
      <span class="section-num">${pad}</span>
      <span class="section-title">${escapeHtml(title)}</span>
    </div>
    <div class="section-body">
      ${html}
    </div>
  </div>`;
}

// ─── 01. Objetivo ────────────────────────────────────────────────────

function renderObjetivo(data: FoundationData): string {
  const parts: string[] = [];

  if (data.palanca) {
    parts.push(`
      <div class="propuesta-diferencial">
        ${escapeHtml(data.palanca.nombre)}
      </div>`);

    // Simplify justification for client
    parts.push(`<p style="font-size:14px;line-height:1.65">${escapeHtml(data.palanca.justificacion)}</p>`);
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Objetivo pendiente de definicion.</p>`);
  }

  return section(1, "Objetivo", parts.join("\n"));
}

// ─── 02. Tus Campanas ────────────────────────────────────────────────

function renderCampanas(data: FoundationData): string {
  const parts: string[] = [];

  if (data.arquitectura.length) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:24px">Estas son las campanas que vamos a correr para tu marca:</p>`);

    // Nomenclatura de ads
    parts.push(`<div style="padding:20px;border:1px solid ${COLORS.border};margin-bottom:24px">`);
    parts.push(`<div class="card-label">Nomenclatura de creacion de ads</div>`);
    parts.push(`<p style="font-size:13px;color:${COLORS.muted};margin-bottom:12px">Todos los elementos en Meta Ads siguen esta convencion de nombres:</p>`);
    parts.push(`<table>`);
    parts.push(`<thead><tr><th>Nivel</th><th>Formato</th><th>Ejemplo</th></tr></thead>`);
    parts.push(`<tbody>`);
    const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
    parts.push(`<tr><td style="font-weight:700">Campana</td><td style="font-family:${FONTS.mono};font-size:13px">{Empresa}_{Objetivo}</td><td style="font-family:${FONTS.mono};font-size:13px">${empresa}_Leads</td></tr>`);
    parts.push(`<tr><td style="font-weight:700">Ad Set</td><td style="font-family:${FONTS.mono};font-size:13px">Conjunto_{ICP}</td><td style="font-family:${FONTS.mono};font-size:13px">Conjunto_ICP_A</td></tr>`);
    parts.push(`<tr><td style="font-weight:700">Ad</td><td style="font-family:${FONTS.mono};font-size:13px">Anuncio_{Formato}_{Angulo}_{Version}</td><td style="font-family:${FONTS.mono};font-size:13px">Anuncio_Reel_Dolor_V1</td></tr>`);
    parts.push(`</tbody></table>`);
    parts.push(`</div>`);

    for (let i = 0; i < data.arquitectura.length; i++) {
      const camp = data.arquitectura[i];

      parts.push(`<div class="campana-card">`);
      parts.push(`<div class="campana-header">`);
      parts.push(`<span class="campana-number">${i + 1}</span>`);
      parts.push(`<span class="campana-nombre">${escapeHtml(camp.nombre)}</span>`);
      parts.push(`</div>`);
      parts.push(`<div class="campana-body">`);
      parts.push(`<p><strong>Objetivo:</strong> ${escapeHtml(camp.objetivo)}</p>`);

      if (camp.adSets.length) {
        for (const adSet of camp.adSets) {
          parts.push(`<div style="margin-top:16px;padding:12px 16px;border:1px solid ${COLORS.border}">`);
          parts.push(`<div style="font-family:${FONTS.heading};font-weight:700;font-size:14px;margin-bottom:8px">${escapeHtml(adSet.nombre)}</div>`);
          parts.push(`<div class="card-label">A quien va dirigido</div>`);
          parts.push(`<p style="font-size:13px;margin-bottom:8px">${escapeHtml(adSet.segmentacion)}</p>`);
          if (adSet.ads.length) {
            parts.push(`<div class="card-label">Anuncios</div>`);
            parts.push(`<ul class="fase-entregables">${adSet.ads.map((ad) => `<li>${escapeHtml(ad)}</li>`).join("")}</ul>`);
          }
          parts.push(`</div>`);
        }
      }

      parts.push(`</div></div>`);
    }
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Campanas pendientes de definicion.</p>`);
  }

  return section(2, "Tus Campanas", parts.join("\n"));
}

// ─── 03. Tu Roadmap ──────────────────────────────────────────────────

function renderRoadmap(data: FoundationData): string {
  const parts: string[] = [];

  if (data.roadmap && data.roadmap.length) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Este es el plan de ejecucion para las primeras 8 semanas:</p>`);

    // Gantt chart
    parts.push(renderGantt(data.roadmap));

    // Phase cards
    parts.push(`<div class="phase-cards">`);

    const phases: Array<{ name: string; cls: string; desc: string }> = [
      { name: "Foundation", cls: "foundation", desc: "Preparamos todo: accesos, cuentas, tracking. Dejamos la infraestructura lista para lanzar." },
      { name: "Build", cls: "build", desc: "Creamos los anuncios, armamos las audiencias y configuramos las campanas." },
      { name: "Launch", cls: "launch", desc: "Lanzamos las campanas. Monitoreamos los primeros resultados y hacemos ajustes rapidos." },
      { name: "Scale", cls: "scale", desc: "Optimizamos en base a los datos. Escalamos lo que funciona y exploramos nuevos angulos." },
    ];

    for (const phase of phases) {
      parts.push(`
        <div class="phase-card">
          <div class="phase-card-title">
            <span class="phase-dot ${phase.cls}"></span>
            ${escapeHtml(phase.name)}
          </div>
          <div class="phase-card-desc">${escapeHtml(phase.desc)}</div>
        </div>`);
    }

    parts.push(`</div>`);
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Roadmap pendiente de definicion.</p>`);
  }

  return section(3, "Tu Roadmap", parts.join("\n"));
}

// ─── Gantt renderer ──────────────────────────────────────────────────

function renderGantt(roadmap: RoadmapInitiative[]): string {
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8];
  const faseClass: Record<string, string> = {
    Foundation: "foundation",
    Build: "build",
    Launch: "launch",
    Scale: "scale",
  };

  const parts: string[] = [];
  parts.push(`<div class="gantt-container"><table class="gantt-table">`);
  parts.push(`<thead><tr><th>Iniciativa</th>${weeks.map((w) => `<th>S${w}</th>`).join("")}</tr></thead>`);
  parts.push(`<tbody>`);

  for (const init of roadmap) {
    parts.push(`<tr><td>${escapeHtml(init.nombre)}</td>`);

    const weekMap: Record<number, string> = {};
    for (const fase of init.fases) {
      for (let w = fase.semanaInicio; w <= fase.semanaFin; w++) {
        weekMap[w] = fase.nombre;
      }
    }

    let w = 1;
    while (w <= 8) {
      const faseName = weekMap[w];
      if (!faseName) {
        parts.push(`<td></td>`);
        w++;
      } else {
        let span = 1;
        while (w + span <= 8 && weekMap[w + span] === faseName) span++;
        const cls = faseClass[faseName] || "foundation";
        parts.push(`<td colspan="${span}"><div class="gantt-bar ${cls}">${escapeHtml(faseName)}</div></td>`);
        w += span;
      }
    }

    parts.push(`</tr>`);
  }

  parts.push(`</tbody></table></div>`);
  return parts.join("\n");
}

// ─── 04. Creativos ───────────────────────────────────────────────────

function renderCreativos(data: FoundationData): string {
  const parts: string[] = [];

  if (data.creativos && data.creativos.angulos.length) {
    parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Estos son los angulos creativos que vamos a usar en tus anuncios:</p>`);

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
              <div class="angulo-palanca"><span class="angulo-meta-label">Formato:</span> ${escapeHtml(angulo.formato)}</div>
            </div>
          </div>
        </div>`);
    }
    parts.push(`</div>`);

    // Formatos
    if (data.creativos.formatos.length) {
      parts.push(`<div style="margin-top:20px"><div class="card-label">Formatos que vamos a usar</div>`);
      parts.push(`<div class="kpi-grid" style="margin-top:8px">${data.creativos.formatos.map((f) => `<span class="canal-chip">${escapeHtml(f)}</span>`).join("")}</div></div>`);
    }

    // Tono
    if (data.creativos.tono) {
      parts.push(`<div style="margin-top:16px"><div class="card-label">Tono de comunicacion</div><p style="font-size:14px">${escapeHtml(data.creativos.tono)}</p></div>`);
    }
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Creativos pendientes de definicion.</p>`);
  }

  return section(4, "Creativos", parts.join("\n"));
}

// ─── 05. KPIs y Presupuesto ──────────────────────────────────────────

function renderKPIsPresupuesto(data: FoundationData): string {
  const parts: string[] = [];

  // KPIs in simple language
  parts.push(`<h3>Metricas que vamos a medir</h3>`);
  if (data.kpis.length) {
    parts.push(`<table>`);
    parts.push(`<thead><tr><th>Metrica</th><th>Objetivo</th></tr></thead>`);
    parts.push(`<tbody>`);
    for (const kpi of data.kpis) {
      parts.push(`<tr>`);
      parts.push(`<td><span class="kpi-chip" style="margin:0">${escapeHtml(kpi.nombre)}</span></td>`);
      parts.push(`<td>${kpi.objetivo ? escapeHtml(kpi.objetivo) : `<span style="color:${COLORS.muted}">Por definir</span>`}</td>`);
      parts.push(`</tr>`);
    }
    parts.push(`</tbody></table>`);
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">KPIs pendientes de definicion.</p>`);
  }

  // Presupuesto
  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Presupuesto</h3>`);
  if (data.presupuesto) {
    const budgetItems: Array<{ label: string; value: string; highlight?: boolean }> = [
      { label: "Pauta (tu tarjeta en Meta)", value: data.presupuesto.pauta },
      { label: "Fee REE Growth", value: data.presupuesto.fee },
      { label: "Total mensual", value: data.presupuesto.total },
    ];

    if (data.presupuesto.cplTarget) {
      budgetItems.push({ label: "CPL Target", value: data.presupuesto.cplTarget, highlight: true });
    }

    if (data.presupuesto.limiteGastoCuenta) {
      budgetItems.push({ label: "Limite de gasto de la cuenta", value: data.presupuesto.limiteGastoCuenta });
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

    parts.push(`<div class="callout" style="margin-top:16px">La pauta se paga con tu tarjeta directamente en Meta. REE no maneja tu plata de ads. El fee de REE se factura aparte.</div>`);

    if (data.presupuesto.limiteGastoCuenta) {
      parts.push(`<div class="callout callout-red" style="margin-top:12px"><strong>Limite de gasto:</strong> Tu cuenta publicitaria tiene configurado un limite de gasto de ${escapeHtml(data.presupuesto.limiteGastoCuenta)}. Este limite protege tu inversion y se puede ajustar en cualquier momento.</div>`);
    }
  } else {
    parts.push(`<p style="font-size:14px;color:${COLORS.muted}">Presupuesto pendiente de definicion.</p>`);
  }

  return section(5, "KPIs y Presupuesto", parts.join("\n"));
}

// ─── 06. Proximos Pasos ──────────────────────────────────────────────

function renderProximosPasos(_data: FoundationData): string {
  const parts: string[] = [];

  const pasos = [
    "Revisar esta estrategia y darnos tu feedback",
    "Aprobar los angulos creativos y el presupuesto",
    "Enviarnos los brand assets (fotos, videos, logo) para crear los anuncios",
    "Coordinar la KO Call para alinear los ultimos detalles",
    "Arrancar con la fase Foundation del roadmap",
  ];

  parts.push(`<p style="font-size:14px;line-height:1.65;margin-bottom:20px">Una vez que apruebes esta estrategia, estos son los pasos que siguen:</p>`);

  parts.push(`<ol class="step-list">`);
  for (const paso of pasos) {
    parts.push(`<li>${escapeHtml(paso)}</li>`);
  }
  parts.push(`</ol>`);

  return section(6, "Proximos Pasos", parts.join("\n"));
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(): string {
  return `
  <div class="footer">
    Documento generado por REE Creativos
  </div>`;
}
