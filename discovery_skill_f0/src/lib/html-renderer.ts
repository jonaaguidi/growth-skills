import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type {
  DiscoveryData,
  VariableDiscovery,
  GapItem,
  CompetidorAnalisis,
  AnguloValor,
  PropuestaDeValor,
  ValorServicio,
} from "../types/discovery.js";
import { getBaseStyles, escapeHtml, formatCurrency, COLORS, FONTS } from "./template-parts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLogoBase64(): string {
  const logoPath = resolve(__dirname, "../assets/logo-white.png");
  try {
    return readFileSync(logoPath).toString("base64");
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

function buildSections(data: DiscoveryData): Section[] {
  const sections: Section[] = [];

  sections.push({
    id: "llamada",
    title: "La Llamada",
    desc: "Lo que el cliente nos conto: su negocio, sus numeros y sus necesidades en sus propias palabras.",
    html: renderLlamadaBody(data),
    open: true,
  });

  sections.push({
    id: "auditoria",
    title: "La Auditoria",
    desc: "Estado actual de su marketing digital: canales, contenido, pauta y problemas detectados.",
    html: renderAuditoriaBody(data),
    open: true,
  });

  sections.push({
    id: "research",
    title: "El Research",
    desc: "Analisis del mercado, competidores y definicion del cliente ideal con sus dolores y deseos.",
    html: renderResearchBody(data),
    open: true,
  });

  if (data.propuestaDeValor || data.angulosDeValor?.length) {
    sections.push({
      id: "propuesta-valor",
      title: "Propuesta de Valor del Cliente",
      desc: "Diferencial competitivo del cliente y angulos de comunicacion por audiencia.",
      html: renderPropuestaBody(data),
      open: true,
    });
  }

  if (data.propuestaEstrategica) {
    sections.push({
      id: "plan",
      title: "Plan de Accion",
      desc: "Fases de trabajo, canales recomendados, entregables, KPIs y viabilidad financiera.",
      html: renderPlanBody(data) + renderViabilidadBody(data),
      open: true,
    });
  }

  if (data.valorServicio) {
    sections.push({
      id: "valor-servicio",
      title: "Valor del Servicio",
      desc: "Inversion estimativa para la implementacion y operacion del servicio de Growth.",
      html: renderValorServicioBody(data),
      open: true,
    });
  }

  if (data.notasAdicionales) {
    sections.push({
      id: "notas",
      title: "Notas Adicionales",
      desc: "Contexto extra de la llamada: participantes, acuerdos y observaciones.",
      html: renderNotasBody(data),
      open: false,
    });
  }

  if (data.resumenCierre || data.proximosPasos?.length) {
    sections.push({
      id: "cierre",
      title: "Resumen y Proximos Pasos",
      desc: "Sintesis del diagnostico, lo que le vamos a proponer al cliente y los pasos inmediatos.",
      html: renderCierreBody(data),
      open: true,
    });
  }

  return sections;
}

// ─── Main render ─────────────────────────────────────────────────────

export function renderDiscoveryHtml(data: DiscoveryData): string {
  const styles = getBaseStyles();
  const sections = buildSections(data);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Discovery F0 — ${escapeHtml(data.clientInfo.nombreEmpresa ?? "Cliente")}</title>
<style>${styles}</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderToc(sections)}
  ${sections.map((s, i) => renderSection(s, i + 1)).join("\n")}
  ${renderFooter(data)}
</div>
<a href="#indice" class="back-to-top" title="Volver al indice"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}

// ─── Header ──────────────────────────────────────────────────────────

function renderHeader(data: DiscoveryData): string {
  const { clientInfo } = data;
  const empresa = escapeHtml(clientInfo.nombreEmpresa ?? "—");
  const contacto = clientInfo.nombreCliente ? escapeHtml(clientInfo.nombreCliente) : null;
  const fecha = clientInfo.fechaLlamada ? escapeHtml(clientInfo.fechaLlamada) : null;
  const web = clientInfo.sitioWeb ? escapeHtml(clientInfo.sitioWeb) : null;

  const logoB64 = getLogoBase64();
  const logoHtml = logoB64
    ? `<img class="header-logo" src="data:image/png;base64,${logoB64}" alt="REE Creativos">`
    : "";

  const fathomLink = clientInfo.fathomUrl
    ? `<a href="${escapeHtml(clientInfo.fathomUrl)}" style="color:rgba(255,255,255,0.7);text-decoration:none;font-family:${FONTS.mono};font-size:12px">Ver grabacion en Fathom &rarr;</a>`
    : "";

  return `
  <div class="header">
    ${logoHtml}
    <div class="header-label">DISCOVERY FASE 0</div>
    <div class="header-title">${empresa}<span class="badge-interno">INTERNO</span></div>
    <div class="meta-row">
      ${contacto ? `<span>Contacto: ${contacto}</span>` : ""}
      ${fecha ? `<span>Fecha: ${fecha}</span>` : ""}
      ${web ? `<span>Web: <a href="https://${web}" target="_blank" style="color:rgba(255,255,255,0.7);text-decoration:underline">${web}</a></span>` : ""}
      ${fathomLink ? `<span>${fathomLink}</span>` : ""}
    </div>
    <div class="header-confidencial">Documento confidencial para uso interno de los Founders de REE Creativos. No compartir con el cliente.</div>
  </div>`;
}

// ─── TOC ─────────────────────────────────────────────────────────────

function renderToc(sections: Section[]): string {
  return `
  <div class="toc" id="indice">
    <h2>El Recorrido</h2>
    <ol>
      ${sections.map((s) => `<li><a href="#${s.id}">${escapeHtml(s.title)}</a><div class="toc-desc">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Section wrapper ─────────────────────────────────────────────────

function renderSection(s: Section, num: number): string {
  const pad = String(num).padStart(2, "0");
  return `
  <details class="collapsible" id="${s.id}"${s.open ? " open" : ""}>
    <summary><span class="section-num">${pad}</span>${escapeHtml(s.title)}</summary>
    <div class="section-body">
      ${s.html}
    </div>
  </details>`;
}

// ─── 01. La Llamada ──────────────────────────────────────────────────

function renderLlamadaBody(data: DiscoveryData): string {
  const parts: string[] = [];

  // Resumen
  if (data.resumenEjecutivo) {
    parts.push(`<h3>Resumen Ejecutivo</h3>`);
    parts.push(
      data.resumenEjecutivo
        .split("\n")
        .filter((p) => p.trim())
        .map((p) => `<p style="margin-bottom:12px">${escapeHtml(p)}</p>`)
        .join("\n")
    );
  }

  // Citas
  if (data.citasTextuales.length) {
    parts.push(`<h3 style="margin-top:24px">Citas Textuales</h3>`);
    parts.push(
      data.citasTextuales
        .map(
          (c) => `<div class="cita">&ldquo;${escapeHtml(c.texto)}&rdquo;${c.contexto ? `<div class="cita-contexto">${escapeHtml(c.contexto)}</div>` : ""}</div>`
        )
        .join("\n")
    );
  }

  // Variables
  parts.push(`<h3 style="margin-top:24px">Variables del Discovery (ICPs + 4P)</h3>`);
  parts.push(renderVariablesGrid(data));

  return parts.join("\n");
}

function renderVarCard(label: string, v: VariableDiscovery): string {
  const hasDato = v.valor !== null;
  const cls = hasDato ? "var-card" : "var-card sin-dato";
  const dot = hasDato ? `<span class="var-status-ok"></span>` : `<span class="var-status-missing"></span>`;

  return `
    <div class="${cls}">
      <div class="var-card-header"><div class="var-card-title">${escapeHtml(label)}</div>${dot}</div>
      <div class="var-card-body">
        ${hasDato ? `<p class="var-card-desc">${escapeHtml(v.valor!)}</p>` : `<span class="badge-sin-dato">SIN DATO</span>`}
      </div>
    </div>`;
}

function renderVariablesGrid(data: DiscoveryData): string {
  const v = data.variables;

  return `
    <div class="var-stack">
      ${renderVarCard("ICP", v.icp)}
      ${renderVarCard("Producto", v.producto)}
      ${renderVarCard("Precio", v.precio)}
      ${renderVarCard("Plaza", v.plaza)}
      ${renderVarCard("Promocion", v.promocion)}
    </div>`;
}

// ─── 02. La Auditoria ────────────────────────────────────────────────

function renderAuditoriaBody(data: DiscoveryData): string {
  const a = data.auditoria;
  if (!a) {
    return `<span class="badge-sin-dato">SIN DATA DE AUDITORIA</span>
    <div class="card-notes" style="margin-top:12px">Falta analizar la presencia digital actual, canales, contenido y pauta.</div>`;
  }

  const parts: string[] = [];

  // Grid de items
  const items: Array<{ label: string; value: string | null }> = [
    { label: "Presencia Digital", value: a.presenciaDigital },
    { label: "Contenido Actual", value: a.contenidoActual },
    { label: "Pauta Publicitaria", value: a.pautaActual },
    { label: "E-commerce", value: a.ecommerce },
  ];

  parts.push(`<div class="audit-grid">`);
  for (const item of items) {
    parts.push(`
      <div class="audit-item">
        <div class="card-label">${escapeHtml(item.label)}</div>
        ${item.value ? `<p style="font-size:14px">${escapeHtml(item.value)}</p>` : `<span class="badge-sin-dato">SIN DATO</span>`}
      </div>`);
  }
  parts.push(`</div>`);

  // Canales activos
  if (a.canalesActivos.length) {
    parts.push(`<div class="card-label">Canales Activos</div>`);
    parts.push(`<div class="kpi-grid" style="margin-bottom:20px">${a.canalesActivos.map((c) => `<span class="canal-chip">${escapeHtml(c)}</span>`).join("")}</div>`);
  }

  // Problemas
  if (a.problemasPrincipales.length) {
    parts.push(`<div class="card-label">Problemas Identificados</div>`);
    parts.push(`<ul class="audit-problems">${a.problemasPrincipales.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`);
  }

  return parts.join("\n");
}

// ─── 03. El Research ─────────────────────────────────────────────────

function renderResearchBody(data: DiscoveryData): string {
  const parts: string[] = [];

  // Research de mercado
  const r = data.research;
  if (r) {
    const marketItems: Array<{ label: string; value: string | null }> = [
      { label: "Tamano de Mercado", value: r.tamanoMercado },
      { label: "Tendencia", value: r.tendencia },
      { label: "Demanda del Nicho", value: r.demandaNicho },
      { label: "Estacionalidad", value: r.estacionalidad },
    ];

    parts.push(`<h3>Mercado</h3>`);
    parts.push(`<div class="audit-grid">`);
    for (const item of marketItems) {
      if (item.value) {
        parts.push(`<div class="audit-item"><div class="card-label">${escapeHtml(item.label)}</div><p style="font-size:14px">${escapeHtml(item.value)}</p></div>`);
      }
    }
    parts.push(`</div>`);

    // Competidores (dentro de Mercado)
    if (r.competidores.length) {
      parts.push(`<div style="margin-top:20px">`);
      parts.push(r.competidores.map(renderCompetidor).join("\n"));
      parts.push(`</div>`);
    }

    if (r.notasResearch) {
      parts.push(`<div class="card-notes" style="margin-top:16px">${escapeHtml(r.notasResearch)}</div>`);
    }
  } else {
    parts.push(`<h3>Mercado</h3><span class="badge-sin-dato">PENDIENTE DE RESEARCH</span>`);
  }

  // Separador
  parts.push(`<hr class="section-divider">`);

  // ICPs
  parts.push(`<h3>ICP — Cliente Ideal</h3>`);
  const icps = data.icp;
  if (icps && icps.length) {
    for (const icp of icps) {
      parts.push(`<div class="icp-section">`);
      parts.push(`<div class="icp-desc"><strong>${escapeHtml(icp.titulo)}</strong><br>${escapeHtml(icp.descripcion)}</div>`);
      parts.push(`<div class="icp-columns">`);
      parts.push(`<div class="icp-col"><div class="icp-col-label dolores">Dolores</div><ul class="icp-list">${icp.dolores.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul></div>`);
      parts.push(`<div class="icp-col"><div class="icp-col-label deseos">Deseos</div><ul class="icp-list">${icp.deseos.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul></div>`);
      parts.push(`<div class="icp-col"><div class="icp-col-label objeciones">Objeciones</div><ul class="icp-list">${icp.objeciones.map((o) => `<li>${escapeHtml(o)}</li>`).join("")}</ul></div>`);
      parts.push(`</div></div>`);
    }
  } else {
    parts.push(`<span class="badge-sin-dato">ICP NO DEFINIDO</span>`);
  }

  return parts.join("\n");
}

function renderCompetidor(c: CompetidorAnalisis): string {
  return `
    <div class="comp-card">
      <div class="comp-header">
        <span class="comp-name">${escapeHtml(c.nombre)}</span>
        ${c.cuotaMercado ? `<span class="comp-share">${escapeHtml(c.cuotaMercado)}</span>` : ""}
      </div>
      <div class="comp-body">
        <div>
          <div class="comp-list-label">Fortalezas</div>
          <ul class="comp-list">${c.fortalezas.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        </div>
        <div>
          <div class="comp-list-label weak">Debilidades</div>
          <ul class="comp-list">${c.debilidades.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
        </div>
      </div>
      ${c.pautaActiva ? `<div style="padding:10px 20px;font-size:12px;color:${COLORS.muted};border-top:1px solid ${COLORS.border}">Pauta: ${escapeHtml(c.pautaActiva)}</div>` : ""}
    </div>`;
}

// ─── 04. Propuesta de Valor ──────────────────────────────────────────

function renderAnguloCard(a: AnguloValor): string {
  return `
    <div class="angulo-card">
      <div class="angulo-header">
        <div class="angulo-nombre">${escapeHtml(a.nombre)}</div>
      </div>
      <div class="angulo-body">
        <div class="angulo-mensaje">${escapeHtml(a.mensaje)}</div>
        <div class="angulo-meta">
          <div class="angulo-dolor"><span class="angulo-meta-label">Dolor:</span> ${escapeHtml(a.dolorQueResuelve)}</div>
          <div class="angulo-palanca"><span class="angulo-meta-label">Palanca:</span> ${escapeHtml(a.palanca)}</div>
        </div>
      </div>
    </div>`;
}

function renderAnguloGroup(label: string, angulos: AnguloValor[]): string {
  if (!angulos.length) return "";
  return `
    <div class="angulo-group">
      <div class="angulo-group-label">${escapeHtml(label)}</div>
      <div class="angulo-group-cards">
        ${angulos.map(renderAnguloCard).join("\n")}
      </div>
    </div>`;
}

function renderPropuestaBody(data: DiscoveryData): string {
  const parts: string[] = [];

  const pv = data.propuestaDeValor;
  const angulos = pv?.angulos ?? data.angulosDeValor ?? [];

  // Diferencial central
  if (pv?.diferencial) {
    parts.push(`<div class="propuesta-diferencial">${escapeHtml(pv.diferencial)}</div>`);
  }

  // Agrupar por audiencia
  const b2c = angulos.filter((a) => a.audiencia === "B2C" || a.audiencia === "ambos");
  const b2b = angulos.filter((a) => a.audiencia === "B2B" || a.audiencia === "ambos");

  parts.push(renderAnguloGroup("B2C — Consumidor Final", b2c));
  parts.push(renderAnguloGroup("B2B — Comercios y Distribuidoras", b2b));

  return parts.join("\n");
}

// ─── 05. Viabilidad ──────────────────────────────────────────────────

function renderViabilidadBody(data: DiscoveryData): string {
  const c = data.calculoCpl;
  const parts: string[] = [];

  parts.push(`<hr class="section-divider">`);
  parts.push(`<h3>Viabilidad Financiera — Canal B2C</h3>`);

  if (c.ticket !== null && c.margen !== null && c.porcentajeMargenParaAds !== null && c.tasaDeCierre !== null) {
    const gananciaBruta = c.ticket * (c.margen / 100);
    const cpaMax = c.cpaMaximo ?? gananciaBruta * (c.porcentajeMargenParaAds / 100);
    const cplObj = c.cplObjetivo ?? cpaMax * (c.tasaDeCierre / 100);
    const roasBreakeven = 1 / (c.margen / 100);

    // Paso a paso
    parts.push(`<div class="viabilidad-steps">`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">1. Ticket Promedio B2C</div>
      <div class="viabilidad-step-value">$${fmtNum(c.ticket)}</div>
      <div class="viabilidad-step-explain">Estimado conservador por pedido. Con envio gratis a partir de $100.000 y combos (Comida China Casera: Tofu + productos de la web) el ticket real puede ser mayor.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">2. Margen Bruto</div>
      <div class="viabilidad-step-value">${c.margen}%</div>
      <div class="viabilidad-step-explain">Margen bruto para consumidor final segun Angel. Ganancia bruta por venta: $${fmtNum(gananciaBruta)}.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">3. % del Margen Destinado a Ads</div>
      <div class="viabilidad-step-value">${c.porcentajeMargenParaAds}%</div>
      <div class="viabilidad-step-explain">Porcentaje de la ganancia bruta que se reinvierte en pauta. Conservador: queda un ${100 - c.porcentajeMargenParaAds}% de la ganancia limpia despues de ads.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">4. CPR Maximo (Venta en Tienda Nube)</div>
      <div class="viabilidad-step-value">$${fmtNum(cpaMax)}</div>
      <div class="viabilidad-step-explain">Lo maximo que podemos pagar por cada venta (resultado) sin perder plata en ads. Formula: $${fmtNum(c.ticket)} × ${c.margen}% × ${c.porcentajeMargenParaAds}% = $${fmtNum(cpaMax)}.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">5. Tasa de Conversion E-commerce</div>
      <div class="viabilidad-step-value">${c.tasaDeCierre}%</div>
      <div class="viabilidad-step-explain">Estimado conservador para D2C alimentos en Argentina. De cada 100 visitas al e-commerce, ${c.tasaDeCierre} terminan comprando. Se valida con data real de Tienda Nube via REE Metrics.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">6. CPL Objetivo (Visita al E-commerce)</div>
      <div class="viabilidad-step-value">$${fmtNum(cplObj)}</div>
      <div class="viabilidad-step-explain">Lo maximo que podemos pagar por cada visita al e-commerce. Formula: CPR maximo × tasa de conversion = $${fmtNum(cpaMax)} × ${c.tasaDeCierre}%.</div>
    </div>`);

    parts.push(`<div class="viabilidad-step">
      <div class="viabilidad-step-label">7. ROAS Breakeven</div>
      <div class="viabilidad-step-value">${roasBreakeven.toFixed(2)}x</div>
      <div class="viabilidad-step-explain">ROAS minimo para no perder plata. Por debajo de ${roasBreakeven.toFixed(2)}x cada venta nos cuesta mas de lo que ganamos. Es el inverso del margen bruto: 1 / ${c.margen}%.</div>
    </div>`);

    parts.push(`</div>`);

    // Formula teorica + traducida
    parts.push(`<div class="viabilidad-formula">
      <div class="viabilidad-formula-title">Formula: CPR Objetivo</div>
      <div class="viabilidad-formula-block">
        <div class="viabilidad-formula-teorica">CPR maximo = Ticket × Margen × % destinado a Ads</div>
        <div class="viabilidad-formula-traducida">$${fmtNum(cpaMax)} = $${fmtNum(c.ticket)} × ${c.margen}% × ${c.porcentajeMargenParaAds}%</div>
      </div>
      <p>Si el CPR (costo por resultado/venta) es <strong>menor a $${fmtNum(cpaMax)}</strong>, cada venta deja ganancia. Si es mayor, perdemos plata en cada venta.</p>
      <div class="viabilidad-formula-block" style="margin-top:16px">
        <div class="viabilidad-formula-teorica">ROAS breakeven = 1 / Margen</div>
        <div class="viabilidad-formula-traducida">${roasBreakeven.toFixed(2)}x = 1 / ${c.margen}%</div>
      </div>
      <p>Cualquier ROAS por encima de <strong>${roasBreakeven.toFixed(2)}x</strong> es rentable. Por debajo, la pauta cuesta mas de lo que genera.</p>
    </div>`);

    // Escenarios de rentabilidad
    const inversionArs = 300000;
    const gananciaNetaPorVenta = gananciaBruta - cpaMax;

    const scenarios = [
      { label: "Pesimista", cpr: cpaMax, desc: "CPR = maximo tolerable" },
      { label: "Moderado", cpr: Math.round(cpaMax * 0.65), desc: "CPR al 65% del maximo" },
      { label: "Optimista", cpr: Math.round(cpaMax * 0.4), desc: "CPR al 40% del maximo" },
    ];

    parts.push(`<div class="viabilidad-formula viabilidad-formula-gray">
      <div class="viabilidad-formula-title">Escenarios de Rentabilidad</div>
      <p style="margin-bottom:16px">Con una inversion estimada de USD 200-250/mes (~$${fmtNum(inversionArs)} ARS), estos son los escenarios segun el CPR real que logremos en Tienda Nube:</p>
      <table class="viabilidad-tabla">
        <thead><tr><th>Escenario</th><th>CPR (por venta)</th><th>Ventas / mes</th><th>Revenue</th><th>ROAS</th><th>Ganancia bruta</th></tr></thead>
        <tbody>
          ${scenarios.map((s) => {
            const ventas = Math.floor(inversionArs / s.cpr);
            const revenue = ventas * c.ticket!;
            const roas = revenue / inversionArs;
            const gananciaNeta = ventas * (gananciaBruta - s.cpr);
            const roasClass = roas >= 3 ? "escenario-1" : roas >= 2 ? "escenario-2" : "escenario-3";
            return `<tr>
              <td><strong>${s.label}</strong><br><span style="font-size:11px;color:${COLORS.muted}">${s.desc}</span></td>
              <td>$${fmtNum(s.cpr)}</td>
              <td>${ventas}</td>
              <td>$${fmtNum(revenue)}</td>
              <td class="${roasClass}" style="font-weight:700">${roas.toFixed(1)}x</td>
              <td>$${fmtNum(gananciaNeta)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <p style="margin-top:16px">Con ofertas tipo "Comida China Casera" (tofu + productos combinados) y envio gratis a $100.000, el ticket real puede superar los $${fmtNum(c.ticket)} y mejorar el ROAS en todos los escenarios.</p>
      <p><strong>Pendiente: pedirle a Angel que armemos ofertas/combos para mejorar el ticket y el margen del canal B2C.</strong></p>
    </div>`);
  } else {
    parts.push(`<span class="badge-sin-dato">FALTAN DATOS PARA CALCULAR</span>`);
    parts.push(`<div class="card-notes" style="margin-top:12px">Se necesitan: ticket promedio, margen %, porcentaje de margen para ads y tasa de cierre.</div>`);
  }

  return parts.join("\n");
}

// ─── 06. El Plan ─────────────────────────────────────────────────────

function parseWeekRange(lapso: string | null): [number, number] | null {
  if (!lapso) return null;
  const m = lapso.match(/(\d+)\s*-\s*(\d+)/);
  if (m) return [parseInt(m[1]), parseInt(m[2])];
  const single = lapso.match(/(\d+)/);
  if (single) return [parseInt(single[1]), parseInt(single[1])];
  return null;
}

function renderPlanBody(data: DiscoveryData): string {
  const p = data.propuestaEstrategica!;
  const parts: string[] = [];

  parts.push(`<p style="margin-bottom:20px;font-size:15px">${escapeHtml(p.objetivoGeneral)}</p>`);

  // Canales
  if (p.canalesRecomendados.length) {
    parts.push(`<div class="card-label">Canales Recomendados</div>`);
    parts.push(`<div class="kpi-grid" style="margin-bottom:20px">${p.canalesRecomendados.map((c) => `<span class="canal-chip">${escapeHtml(c)}</span>`).join("")}</div>`);
  }

  // Gantt visual (solo fases con lapso definido)
  const ganttColors = [COLORS.red, COLORS.ink];
  const ganttFases = p.fases.filter((f) => f.lapso !== null);
  const totalWeeks = 8;
  parts.push(`<div class="gantt">`);
  parts.push(`<div class="gantt-header">${Array.from({ length: totalWeeks }, (_, i) => `<span class="gantt-week">S${i + 1}</span>`).join("")}</div>`);
  for (let i = 0; i < ganttFases.length; i++) {
    const f = ganttFases[i];
    const range = parseWeekRange(f.lapso);
    parts.push(`<div class="gantt-row">`);
    parts.push(`<div class="gantt-bar-container">${Array.from({ length: totalWeeks }, (_, w) => {
      const active = range && w + 1 >= range[0] && w + 1 <= range[1];
      return `<span class="gantt-cell${active ? " active" : ""}" style="${active ? `background:${ganttColors[i % ganttColors.length]}` : ""}"></span>`;
    }).join("")}</div>`);
    parts.push(`<div class="gantt-label">${escapeHtml(f.nombre)}</div>`);
    parts.push(`</div>`);
  }
  parts.push(`</div>`);

  // Fases desplegables
  for (let i = 0; i < p.fases.length; i++) {
    const f = p.fases[i];
    const metaTags: string[] = [];
    if (f.lapso) metaTags.push(`<span class="fase-meta-tag">${escapeHtml(f.lapso)}</span>`);
    if (f.inversion) metaTags.push(`<span class="fase-meta-tag inversion">${escapeHtml(f.inversion)}</span>`);
    parts.push(`
    <details class="fase-card">
      <summary class="fase-header">
        <span class="fase-number">${i + 1}</span>
        <span class="fase-nombre">${escapeHtml(f.nombre)}</span>
        <div class="fase-meta">
          ${metaTags.join("")}
          <svg class="fase-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </summary>
      <div class="fase-body">
        <p>${escapeHtml(f.descripcion)}</p>
        ${f.entregables.length ? `<ul class="fase-entregables">${f.entregables.map((e) => `<li>${escapeHtml(e)}</li>`).join("")}</ul>` : ""}
      </div>
    </details>`);
  }

  // KPIs
  if (p.kpisPropuestos.length) {
    parts.push(`<div style="margin-top:8px"><div class="card-label">KPIs Propuestos</div>`);
    parts.push(`<div class="kpi-grid">${p.kpisPropuestos.map((k) => `<span class="kpi-chip">${escapeHtml(k)}</span>`).join("")}</div></div>`);
  }

  if (p.notasPropuesta) {
    parts.push(`<div class="card-notes" style="margin-top:20px">${escapeHtml(p.notasPropuesta)}</div>`);
  }

  return parts.join("\n");
}

// ─── Valor del Servicio ───────────────────────────────────────────────

function renderValorServicioBody(data: DiscoveryData): string {
  const vs = data.valorServicio!;
  const parts: string[] = [];

  const tipoBadgeLabels: Record<string, string> = {
    unico: "UNICO",
    mensual: "MENSUAL",
    "por-proyecto": "POR PROYECTO",
  };

  parts.push(`<table class="valor-tabla">`);
  parts.push(`<thead><tr><th>Concepto</th><th>Tipo</th><th>Monto</th></tr></thead>`);
  parts.push(`<tbody>`);
  for (const linea of vs.lineas) {
    parts.push(`<tr>`);
    parts.push(`<td><strong>${escapeHtml(linea.concepto)}</strong><br><span style="font-size:12px;color:${COLORS.muted}">${escapeHtml(linea.descripcion)}</span></td>`);
    parts.push(`<td><span class="valor-tipo-badge tipo-${linea.tipo}">${tipoBadgeLabels[linea.tipo] ?? linea.tipo.toUpperCase()}</span></td>`);
    parts.push(`<td style="font-family:${FONTS.mono};font-weight:700">${escapeHtml(linea.monto)}</td>`);
    parts.push(`</tr>`);
  }
  parts.push(`</tbody></table>`);

  parts.push(`<div class="valor-roi">`);
  parts.push(`<div class="valor-roi-label">ROI Estimado</div>`);
  parts.push(`<p>${escapeHtml(vs.notaRoi)}</p>`);
  parts.push(`</div>`);

  if (vs.aclaraciones.length) {
    parts.push(`<div class="valor-aclaraciones">`);
    for (const nota of vs.aclaraciones) {
      parts.push(`<p>${escapeHtml(nota)}</p>`);
    }
    parts.push(`</div>`);
  }

  return parts.join("\n");
}

// ─── Gaps ────────────────────────────────────────────────────────────

function renderGapsBody(data: DiscoveryData): string {
  if (!data.gaps.length) return "";
  return `
    <hr class="section-divider">
    <h3>Gaps y Preguntas Pendientes</h3>
    <table>
      <thead><tr><th>Variable</th><th>Gap</th><th>Prioridad</th><th>Pregunta Sugerida</th></tr></thead>
      <tbody>${data.gaps.map(renderGapRow).join("\n")}</tbody>
    </table>`;
}

function renderGapRow(gap: GapItem): string {
  return `<tr><td>${escapeHtml(gap.variable)}</td><td>${escapeHtml(gap.descripcion)}</td><td class="prioridad-${gap.prioridad}">${gap.prioridad.toUpperCase()}</td><td>${escapeHtml(gap.preguntaSugerida)}</td></tr>`;
}

// ─── Notas ───────────────────────────────────────────────────────────

function renderNotasBody(data: DiscoveryData): string {
  if (!data.notasAdicionales) return "";
  return data.notasAdicionales
    .split("\n")
    .filter((p) => p.trim())
    .map((p) => `<p style="margin-bottom:12px">${escapeHtml(p)}</p>`)
    .join("\n");
}

// ─── Cierre ─────────────────────────────────────────────────────────

function renderCierreBody(data: DiscoveryData): string {
  const parts: string[] = [];

  if (data.resumenCierre) {
    parts.push(`<div class="cierre-resumen">`);
    parts.push(
      data.resumenCierre
        .split("\n")
        .filter((p) => p.trim())
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("\n")
    );
    parts.push(`</div>`);
  }

  if (data.proximosPasos?.length) {
    parts.push(`<h3 style="margin-top:24px">Proximos Pasos</h3>`);
    parts.push(`<ol class="cierre-pasos">`);
    for (const paso of data.proximosPasos) {
      parts.push(`<li>${escapeHtml(paso)}</li>`);
    }
    parts.push(`</ol>`);
  }

  return parts.join("\n");
}

// ─── Footer ──────────────────────────────────────────────────────────

function renderFooter(_data: DiscoveryData): string {
  return `
  <div class="footer">
    Documento generado automaticamente por REE Discovery Skill F0
  </div>`;
}

function fmtNum(n: number): string {
  return n.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
