export const COLORS = {
  red: "#DD0513",
  ink: "#0E0D0C",
  slate: "#363636",
  bg: "#F6F5F2",
  surface: "#FFFFFF",
  gapBg: "#FFF8E1",
  gapBorder: "#E8A013",
  escenario1: "#12A150",
  escenario2: "#E8A013",
  escenario3: "#DD0513",
  muted: "#6B6B6B",
  border: "#E0DFDC",
} as const;

export const FONTS = {
  heading: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
  body: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
} as const;

export function getBaseStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Lato:wght@400;700&family=Poppins:wght@600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${FONTS.body};
      background: ${COLORS.bg};
      color: ${COLORS.ink};
      line-height: 1.6;
      padding: 40px 20px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    h1, h2, h3, h4 {
      font-family: ${FONTS.heading};
      font-weight: 700;
      line-height: 1.2;
    }

    h1 { font-size: 28px; }
    h2 { font-size: 22px; margin-bottom: 16px; }
    h3 { font-size: 18px; margin-bottom: 12px; }

    .section {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 0;
      padding: 32px;
      margin-bottom: 24px;
    }

    .header {
      background: ${COLORS.red};
      color: ${COLORS.surface};
      padding: 40px 32px;
      margin-bottom: 24px;
      border-radius: 0;
    }

    .header-logo {
      height: 40px;
      margin-bottom: 20px;
    }

    .header-label {
      font-family: ${FONTS.mono};
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: rgba(255,255,255,0.7);
      margin-bottom: 8px;
    }

    .header-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .header-subtitle {
      font-family: ${FONTS.mono};
      font-size: 14px;
      color: rgba(255,255,255,0.7);
    }

    .header-confidencial {
      font-family: ${FONTS.mono};
      font-size: 11px;
      color: rgba(255,255,255,0.5);
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.15);
    }

    .badge-interno {
      display: inline-block;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-left: 12px;
      vertical-align: middle;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .card {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 0;
      padding: 20px;
    }

    .card-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${COLORS.muted};
      margin-bottom: 8px;
    }

    .card-value {
      font-family: ${FONTS.mono};
      font-size: 20px;
      font-weight: 600;
      color: ${COLORS.ink};
    }

    .card-notes {
      font-size: 13px;
      color: ${COLORS.muted};
      margin-top: 8px;
    }

    .sin-dato {
      background: ${COLORS.gapBg};
      border: 1px solid ${COLORS.gapBorder};
    }

    .badge-sin-dato {
      display: inline-block;
      background: ${COLORS.gapBorder};
      color: ${COLORS.surface};
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid ${COLORS.ink};
      color: ${COLORS.muted};
    }

    td {
      padding: 12px;
      border-bottom: 1px solid ${COLORS.border};
      vertical-align: top;
    }

    .footer {
      font-family: ${FONTS.mono};
      font-size: 12px;
      color: ${COLORS.muted};
      text-align: center;
      padding: 24px;
      border-top: 1px solid ${COLORS.border};
      margin-top: 24px;
    }

    .footer a {
      color: ${COLORS.red};
      text-decoration: none;
    }

    .back-to-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 32px;
      height: 32px;
      background: ${COLORS.ink};
      color: #fff;
      font-size: 14px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.15);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .back-to-top:hover {
      background: ${COLORS.red};
    }

    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      font-family: ${FONTS.mono};
      font-size: 13px;
      color: rgba(255,255,255,0.7);
      margin-top: 12px;
    }
    .meta-row > span {
      white-space: nowrap;
    }

    /* --- TOC / Indice --- */
    .toc {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 24px 32px;
      margin-bottom: 24px;
    }

    .toc h2 {
      font-size: 16px;
      margin-bottom: 12px;
    }

    .toc ol {
      list-style: none;
      counter-reset: toc;
      padding: 0;
    }

    .toc li {
      counter-increment: toc;
      margin-bottom: 12px;
    }

    .toc li::before {
      content: counter(toc, decimal-leading-zero) ".";
      font-family: ${FONTS.mono};
      font-size: 12px;
      color: ${COLORS.red};
      margin-right: 8px;
      font-weight: 600;
    }

    .toc a {
      color: ${COLORS.ink};
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }

    .toc a:hover {
      color: ${COLORS.red};
    }

    .toc-desc {
      font-size: 12px;
      font-weight: 400;
      color: ${COLORS.muted};
      margin-top: 2px;
      padding-left: 28px;
    }

    /* --- Collapsible sections --- */
    details.collapsible {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      margin-bottom: 24px;
    }

    .section-num {
      font-family: ${FONTS.mono};
      font-size: 13px;
      font-weight: 600;
      color: ${COLORS.red};
      margin-right: 12px;
    }

    details.collapsible > summary {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 20px;
      padding: 24px 32px;
      cursor: pointer;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      user-select: none;
    }

    details.collapsible > summary::-webkit-details-marker { display: none; }

    details.collapsible > summary::after {
      content: "+";
      font-family: ${FONTS.mono};
      font-size: 22px;
      font-weight: 400;
      color: ${COLORS.muted};
      margin-left: auto;
      transition: transform 0.15s;
    }

    details.collapsible[open] > summary::after {
      content: "−";
    }

    details.collapsible > .section-body {
      padding: 0 32px 32px;
    }

    /* --- Variable cards (single-column stack) --- */
    .var-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .var-card {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .var-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      border-bottom: 1px solid ${COLORS.border};
      background: ${COLORS.bg};
    }

    .var-card-title {
      font-family: ${FONTS.heading};
      font-size: 15px;
      font-weight: 700;
      color: ${COLORS.ink};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .var-status-ok {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: ${COLORS.escenario1};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .var-status-missing {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: ${COLORS.gapBorder};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .var-card-body {
      padding: 20px 24px;
    }

    .var-card-desc {
      font-size: 14px;
      line-height: 1.65;
      color: ${COLORS.ink};
      margin: 0;
    }

    .var-card.sin-dato .var-card-header {
      background: ${COLORS.gapBg};
      border-bottom-color: ${COLORS.gapBorder};
    }

    .var-card.sin-dato {
      border-color: ${COLORS.gapBorder};
    }

    /* --- ICP --- */
    .icp-section {
      margin-bottom: 20px;
    }

    .icp-desc {
      font-size: 15px;
      margin-bottom: 20px;
      padding: 16px 20px;
      background: ${COLORS.bg};
      border-left: 3px solid ${COLORS.red};
    }

    .icp-columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .icp-col {
      padding: 20px;
      border: 1px solid ${COLORS.border};
    }

    .icp-col-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .icp-col-label.dolores { color: ${COLORS.red}; }
    .icp-col-label.deseos { color: ${COLORS.escenario1}; }
    .icp-col-label.objeciones { color: ${COLORS.escenario2}; }

    .icp-list {
      list-style: none;
      padding: 0;
      font-size: 13px;
    }

    .icp-list li {
      padding: 4px 0;
      border-bottom: 1px solid ${COLORS.border};
    }

    .icp-list li:last-child {
      border-bottom: none;
    }

    /* --- Propuesta de valor / Palanca --- */
    .propuesta-diferencial {
      font-family: ${FONTS.heading};
      font-size: 16px;
      font-weight: 600;
      line-height: 1.6;
      padding: 24px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
      margin-bottom: 28px;
      border-left: 4px solid ${COLORS.red};
    }

    /* --- Angulo cards --- */
    .angulo-group {
      margin-bottom: 28px;
    }

    .angulo-group-label {
      font-family: ${FONTS.heading};
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${COLORS.muted};
      margin-bottom: 12px;
    }

    .angulo-group-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .angulo-card {
      border: 1px solid ${COLORS.border};
    }

    .angulo-header {
      padding: 14px 20px;
      background: ${COLORS.bg};
      border-bottom: 1px solid ${COLORS.border};
    }

    .angulo-nombre {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .angulo-body {
      padding: 20px;
    }

    .angulo-mensaje {
      font-size: 14px;
      line-height: 1.65;
      margin-bottom: 14px;
    }

    .angulo-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .angulo-meta-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${COLORS.muted};
      margin-right: 6px;
    }

    .angulo-dolor {
      font-size: 13px;
      color: ${COLORS.muted};
    }

    .angulo-palanca {
      font-size: 13px;
      color: ${COLORS.red};
    }

    /* --- KPI chips --- */
    .kpi-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .kpi-chip {
      font-family: ${FONTS.mono};
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .canal-chip {
      font-family: ${FONTS.mono};
      font-size: 12px;
      padding: 6px 14px;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.red};
      color: ${COLORS.red};
    }

    /* --- Fases --- */
    .fase-card {
      border: 1px solid ${COLORS.border};
      margin-bottom: 12px;
    }

    .fase-card summary.fase-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: ${COLORS.bg};
      cursor: pointer;
      flex-wrap: wrap;
      list-style: none;
    }

    .fase-card summary.fase-header::-webkit-details-marker {
      display: none;
    }

    .fase-card[open] summary.fase-header {
      border-bottom: 1px solid ${COLORS.border};
    }

    .fase-meta {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .fase-chevron {
      transition: transform 0.2s;
      color: ${COLORS.muted};
    }

    .fase-card[open] .fase-chevron {
      transform: rotate(180deg);
    }

    .fase-meta-tag {
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .fase-meta-tag.inversion {
      background: ${COLORS.red};
    }

    .fase-number {
      font-family: ${FONTS.mono};
      font-size: 13px;
      font-weight: 600;
      background: ${COLORS.red};
      color: ${COLORS.surface};
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fase-nombre {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 16px;
    }

    .fase-body {
      padding: 20px;
    }

    .fase-body p {
      margin-bottom: 12px;
    }

    .fase-entregables {
      list-style: none;
      padding: 0;
    }

    .fase-entregables li {
      font-size: 13px;
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
    }

    .fase-entregables li::before {
      content: ">";
      position: absolute;
      left: 0;
      color: ${COLORS.red};
      font-family: ${FONTS.mono};
    }

    .section-divider {
      border: none;
      border-top: 1px solid ${COLORS.border};
      margin: 32px 0;
    }

    /* --- Cierre / Proximos Pasos --- */
    .cierre-pasos {
      list-style: none;
      counter-reset: pasos;
      padding: 0;
    }

    .cierre-pasos li {
      counter-increment: pasos;
      padding: 14px 20px 14px 56px;
      margin-bottom: 8px;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      font-size: 14px;
      position: relative;
    }

    .cierre-pasos li::before {
      content: counter(pasos);
      position: absolute;
      left: 20px;
      top: 14px;
      font-family: ${FONTS.mono};
      font-size: 13px;
      font-weight: 600;
      color: ${COLORS.red};
    }

    /* ============================================================
       Foundation F2: Checklist, Edge Case, Equipo table
       ============================================================ */

    /* --- Checklist items (4 estados) --- */
    .checklist-group { margin-bottom: 24px; }
    .checklist-progress { height: 4px; background: ${COLORS.border}; margin-bottom: 16px; }
    .checklist-progress-fill { height: 100%; background: ${COLORS.escenario1}; }
    .checklist-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-bottom: 1px solid ${COLORS.border}; }
    .checklist-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
    .checklist-dot.pendiente { background: ${COLORS.escenario2}; }
    .checklist-dot.hecho { background: ${COLORS.escenario1}; }
    .checklist-dot.bloqueado { background: ${COLORS.escenario3}; }
    .checklist-dot.no-aplica { background: ${COLORS.muted}; }
    .checklist-label { flex: 1; font-size: 14px; }
    .checklist-badge { font-family: ${FONTS.mono}; font-size: 10px; font-weight: 600; padding: 2px 8px; text-transform: uppercase; }
    .checklist-notes { font-size: 12px; color: ${COLORS.muted}; margin-top: 4px; font-style: italic; }

    /* --- Edge case callouts --- */
    .edge-case { padding: 16px 20px; margin-bottom: 16px; border-left: 3px solid ${COLORS.escenario2}; background: ${COLORS.gapBg}; }
    .edge-case.activo { border-left-color: ${COLORS.escenario3}; background: #FFF0F0; }
    .edge-case-badge { font-family: ${FONTS.mono}; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${COLORS.escenario3}; margin-bottom: 8px; }
    .edge-case-instrucciones ol { padding-left: 20px; font-size: 13px; }
    .edge-case-instrucciones li { margin-bottom: 6px; }

    /* --- Equipo table --- */
    .equipo-table { width: 100%; border-collapse: collapse; }
    .equipo-table td { padding: 10px 16px; border-bottom: 1px solid ${COLORS.border}; }
    .equipo-table .rol { font-family: ${FONTS.mono}; font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; }

    /* === Mobile (iPhone 14 Pro: 393px) === */
    @media (max-width: 480px) {
      body { padding: 16px 8px; }
      .container { max-width: 100%; }
      .header { padding: 24px 16px; }
      .header-title { font-size: 22px; }
      .header-label { font-size: 10px; letter-spacing: 1.5px; }
      .header-confidencial { font-size: 10px; }
      h2 { font-size: 18px; }
      h3 { font-size: 16px; }
      .section { padding: 16px; }
      .grid-2 { grid-template-columns: 1fr; }
      .grid-3 { grid-template-columns: 1fr; }
      .icp-columns { grid-template-columns: 1fr; }
      details.collapsible > summary { padding: 16px; font-size: 16px; }
      details.collapsible > .section-body { padding: 0 16px 16px; }
      .toc { padding: 16px; }
      .toc a { font-size: 13px; }
      .card { padding: 14px; }
      .card-value { font-size: 16px; }
      table { font-size: 12px; }
      th, td { padding: 8px; }
      .checklist-item { padding: 10px 12px; }
      .meta-row { flex-direction: column; gap: 8px; }
      .meta-row > span { white-space: normal; }

      /* Brief mobile utility classes */
      .m-stack { grid-template-columns: 1fr !important; }
      .m-stack-3 { grid-template-columns: 1fr !important; }
      .m-scroll { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
      .m-scroll-inner { min-width: 500px; }
      .m-wrap { flex-wrap: wrap !important; }
      .m-gap-8 { gap: 8px !important; }
      .m-pad { padding: 12px 16px !important; }
      .m-text-sm { font-size: 12px !important; }

      /* Pieza card: hide non-essential in summary */
      .m-hide { display: none !important; }
      .pieza-toggle, .pieza-toggle-open { display: none !important; }

      /* Resumen section */
      .brief-resumen-pad { padding: 16px !important; }

      /* TOC: tighter */
      .toc-desc { padding-left: 20px; }

      /* Header badges wrap */
      .header-confidencial { font-size: 9px; }
    }

  `;
}

export function getClientStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Lato:wght@400;700&family=Poppins:wght@600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${FONTS.body};
      background: ${COLORS.bg};
      color: ${COLORS.ink};
      line-height: 1.6;
      padding: 40px 20px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    h1, h2, h3, h4 {
      font-family: ${FONTS.heading};
      font-weight: 700;
      line-height: 1.2;
    }

    h1 { font-size: 28px; }
    h2 { font-size: 22px; margin-bottom: 16px; }
    h3 { font-size: 18px; margin-bottom: 12px; }

    /* --- Client header (white bg, red logo) --- */
    .header-client {
      background: ${COLORS.surface};
      color: ${COLORS.ink};
      padding: 40px 32px;
      margin-bottom: 24px;
      border: 1px solid ${COLORS.border};
    }

    .header-client .header-logo {
      height: 40px;
      margin-bottom: 20px;
    }

    .header-client .header-label {
      font-family: ${FONTS.mono};
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: ${COLORS.muted};
      margin-bottom: 8px;
    }

    .header-client .header-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
      text-transform: uppercase;
      color: ${COLORS.ink};
    }

    .header-client .meta-row {
      display: flex;
      gap: 24px;
      font-family: ${FONTS.mono};
      font-size: 13px;
      color: ${COLORS.muted};
      margin-top: 12px;
    }

    /* --- Open sections (no collapsible) --- */
    .section-client {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      margin-bottom: 24px;
    }

    .section-client-header {
      display: flex;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 1px solid ${COLORS.border};
    }

    .section-num {
      font-family: ${FONTS.mono};
      font-size: 13px;
      font-weight: 600;
      color: ${COLORS.red};
      margin-right: 12px;
    }

    .section-title {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 20px;
    }

    .section-body {
      padding: 32px;
    }

    /* --- Cards --- */
    .card-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${COLORS.muted};
      margin-bottom: 8px;
    }

    /* --- Step list --- */
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

    /* --- Callout (notes, warnings) --- */
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

    /* --- Checklist (simple, for client) --- */
    .client-checklist {
      list-style: none;
      padding: 0;
    }

    .client-checklist li {
      padding: 12px 16px 12px 40px;
      border-bottom: 1px solid ${COLORS.border};
      font-size: 14px;
      position: relative;
    }

    .client-checklist li::before {
      content: "";
      position: absolute;
      left: 16px;
      top: 16px;
      width: 12px;
      height: 12px;
      border: 2px solid ${COLORS.border};
    }

    /* --- Gantt chart --- */
    .gantt-container {
      overflow-x: auto;
      margin: 20px 0;
    }

    .gantt-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      table-layout: fixed;
    }

    .gantt-table th {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: center;
      padding: 10px 8px;
      border-bottom: 2px solid ${COLORS.ink};
      color: ${COLORS.muted};
    }

    .gantt-table th:first-child {
      text-align: left;
      width: 200px;
    }

    .gantt-table td {
      padding: 8px;
      border-bottom: 1px solid ${COLORS.border};
      vertical-align: middle;
      text-align: center;
    }

    .gantt-table td:first-child {
      text-align: left;
      font-weight: 600;
      font-size: 13px;
    }

    .gantt-bar {
      height: 24px;
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${FONTS.mono};
      font-size: 10px;
      font-weight: 600;
      color: ${COLORS.surface};
    }

    .gantt-bar.foundation { background: ${COLORS.ink}; }
    .gantt-bar.build { background: ${COLORS.escenario2}; }
    .gantt-bar.launch { background: ${COLORS.red}; }
    .gantt-bar.scale { background: ${COLORS.escenario1}; }

    /* --- Phase cards --- */
    .phase-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 24px;
    }

    .phase-card {
      padding: 20px;
      border: 1px solid ${COLORS.border};
    }

    .phase-card-title {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .phase-dot {
      width: 10px;
      height: 10px;
      flex-shrink: 0;
    }

    .phase-dot.foundation { background: ${COLORS.ink}; }
    .phase-dot.build { background: ${COLORS.escenario2}; }
    .phase-dot.launch { background: ${COLORS.red}; }
    .phase-dot.scale { background: ${COLORS.escenario1}; }

    .phase-card-desc {
      font-size: 13px;
      color: ${COLORS.muted};
      line-height: 1.5;
    }

    /* --- Angulo cards --- */
    .angulo-group-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .angulo-card {
      border: 1px solid ${COLORS.border};
    }

    .angulo-header {
      padding: 14px 20px;
      background: ${COLORS.bg};
      border-bottom: 1px solid ${COLORS.border};
    }

    .angulo-nombre {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .angulo-body {
      padding: 20px;
    }

    .angulo-mensaje {
      font-size: 14px;
      line-height: 1.65;
      margin-bottom: 14px;
    }

    .angulo-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .angulo-meta-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${COLORS.muted};
      margin-right: 6px;
    }

    .angulo-dolor {
      font-size: 13px;
      color: ${COLORS.muted};
    }

    .angulo-palanca {
      font-size: 13px;
      color: ${COLORS.red};
    }

    /* --- ICP columns (for strategy) --- */
    .icp-section {
      margin-bottom: 20px;
    }

    .icp-desc {
      font-size: 15px;
      margin-bottom: 20px;
      padding: 16px 20px;
      background: ${COLORS.bg};
      border-left: 3px solid ${COLORS.red};
    }

    .icp-columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }

    .icp-col {
      padding: 20px;
      border: 1px solid ${COLORS.border};
    }

    .icp-col-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .icp-col-label.dolores { color: ${COLORS.red}; }
    .icp-col-label.deseos { color: ${COLORS.escenario1}; }
    .icp-col-label.objeciones { color: ${COLORS.escenario2}; }

    .icp-list {
      list-style: none;
      padding: 0;
      font-size: 13px;
    }

    .icp-list li {
      padding: 4px 0;
      border-bottom: 1px solid ${COLORS.border};
    }

    .icp-list li:last-child {
      border-bottom: none;
    }

    /* --- KPI chips + canal chips --- */
    .kpi-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .kpi-chip {
      font-family: ${FONTS.mono};
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .canal-chip {
      font-family: ${FONTS.mono};
      font-size: 12px;
      padding: 6px 14px;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.red};
      color: ${COLORS.red};
    }

    /* --- Campaign tree (strategy) --- */
    .campana-card {
      border: 1px solid ${COLORS.border};
      margin-bottom: 16px;
    }

    .campana-header {
      padding: 16px 20px;
      background: ${COLORS.bg};
      border-bottom: 1px solid ${COLORS.border};
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .campana-number {
      font-family: ${FONTS.mono};
      font-size: 13px;
      font-weight: 600;
      background: ${COLORS.red};
      color: ${COLORS.surface};
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .campana-nombre {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 16px;
    }

    .campana-body {
      padding: 20px;
    }

    .campana-body p {
      margin-bottom: 12px;
    }

    /* --- Var cards (budget) --- */
    .var-stack {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .var-card {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .var-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      border-bottom: 1px solid ${COLORS.border};
      background: ${COLORS.bg};
    }

    .var-card-title {
      font-family: ${FONTS.heading};
      font-size: 15px;
      font-weight: 700;
      color: ${COLORS.ink};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .var-card-body {
      padding: 20px 24px;
    }

    .var-card-desc {
      font-size: 14px;
      line-height: 1.65;
      color: ${COLORS.ink};
      margin: 0;
    }

    /* --- Propuesta diferencial --- */
    .propuesta-diferencial {
      font-family: ${FONTS.heading};
      font-size: 16px;
      font-weight: 600;
      line-height: 1.6;
      padding: 24px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
      margin-bottom: 28px;
      border-left: 4px solid ${COLORS.red};
    }

    /* --- Table --- */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    th {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid ${COLORS.ink};
      color: ${COLORS.muted};
    }

    td {
      padding: 12px;
      border-bottom: 1px solid ${COLORS.border};
      vertical-align: top;
    }

    /* --- Section divider --- */
    .section-divider {
      border: none;
      border-top: 1px solid ${COLORS.border};
      margin: 32px 0;
    }

    /* --- Welcome box --- */
    .welcome-box {
      padding: 24px;
      background: ${COLORS.bg};
      border-left: 4px solid ${COLORS.red};
      font-size: 15px;
      line-height: 1.65;
      margin-bottom: 24px;
    }

    /* --- Equipo table --- */
    .equipo-table { width: 100%; border-collapse: collapse; }
    .equipo-table td { padding: 10px 16px; border-bottom: 1px solid ${COLORS.border}; }
    .equipo-table .rol { font-family: ${FONTS.mono}; font-size: 11px; color: ${COLORS.muted}; text-transform: uppercase; }

    /* --- Footer --- */
    .footer {
      font-family: ${FONTS.mono};
      font-size: 12px;
      color: ${COLORS.muted};
      text-align: center;
      padding: 24px;
      border-top: 1px solid ${COLORS.border};
      margin-top: 24px;
    }

    /* --- Back to top --- */
    .back-to-top {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 32px;
      height: 32px;
      background: ${COLORS.ink};
      color: #fff;
      font-size: 14px;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.15);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .back-to-top:hover {
      background: ${COLORS.red};
    }

    /* --- Fase entregables (list with arrow) --- */
    .fase-entregables {
      list-style: none;
      padding: 0;
    }

    .fase-entregables li {
      font-size: 13px;
      padding: 4px 0;
      padding-left: 16px;
      position: relative;
    }

    .fase-entregables li::before {
      content: ">";
      position: absolute;
      left: 0;
      color: ${COLORS.red};
      font-family: ${FONTS.mono};
    }

    /* === Mobile (iPhone 14 Pro: 393px) === */
    @media (max-width: 480px) {
      body { padding: 16px 8px; }
      .container { max-width: 100%; }
      .header-client { padding: 24px 16px; }
      .header-client .header-title { font-size: 22px; }
      .header-client .header-label { font-size: 10px; }
      .header-client .meta-row { flex-direction: column; gap: 8px; }
      h2 { font-size: 18px; }
      h3 { font-size: 16px; }
      .section-client-header { padding: 16px; font-size: 16px; }
      .section-body { padding: 16px; }
      .icp-columns { grid-template-columns: 1fr; }
      .phase-cards { grid-template-columns: 1fr; }
      .gantt-container { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .gantt-table { min-width: 600px; }
      .welcome-box { padding: 16px; font-size: 14px; }
      .propuesta-diferencial { padding: 16px; font-size: 14px; }
      .campana-header { flex-wrap: wrap; padding: 12px 16px; }
      .campana-body { padding: 16px; }
      .var-card-header { padding: 10px 16px; }
      .var-card-body { padding: 16px; }
      .step-list li { padding: 12px 16px 12px 40px; font-size: 13px; }
      .callout { padding: 12px 16px; }
      table { font-size: 12px; }
      th, td { padding: 8px; }
      .kpi-chip, .canal-chip { font-size: 11px; padding: 4px 10px; }
      .angulo-header { padding: 12px 16px; }
      .angulo-body { padding: 16px; }
      .icp-desc { padding: 12px 16px; font-size: 14px; }

      /* Shared mobile utility classes */
      .m-stack { grid-template-columns: 1fr !important; }
      .m-stack-3 { grid-template-columns: 1fr !important; }
      .m-scroll { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
      .m-scroll-inner { min-width: 500px; }
      .m-wrap { flex-wrap: wrap !important; }
      .m-pad { padding: 12px 16px !important; }
    }
  `;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatCurrency(value: number, moneda: string | null): string {
  const cur = moneda ?? "USD";
  return `${cur} ${value.toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
