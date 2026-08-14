export const COLORS = {
  red: "#DD0513",
  ink: "#0E0D0C",
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

    .escenario {
      font-family: ${FONTS.mono};
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      display: inline-block;
    }

    .escenario-1 {
      background: ${COLORS.escenario1};
      color: ${COLORS.surface};
    }

    .escenario-2 {
      background: ${COLORS.escenario2};
      color: ${COLORS.surface};
    }

    .escenario-3 {
      background: ${COLORS.escenario3};
      color: ${COLORS.surface};
    }

    .formula {
      font-family: ${FONTS.mono};
      font-size: 13px;
      background: ${COLORS.bg};
      padding: 16px;
      border: 1px solid ${COLORS.border};
      margin-bottom: 16px;
    }

    .viabilidad-steps {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: ${COLORS.border};
      border: 1px solid ${COLORS.border};
      margin-bottom: 20px;
    }

    .viabilidad-step {
      display: grid;
      grid-template-columns: 240px 140px 1fr;
      gap: 24px;
      background: ${COLORS.surface};
      padding: 14px 20px;
      align-items: center;
    }

    .viabilidad-step-label {
      font-family: ${FONTS.heading};
      font-size: 13px;
      font-weight: 700;
    }

    .viabilidad-step-value {
      font-family: ${FONTS.mono};
      font-size: 15px;
      font-weight: 700;
      color: ${COLORS.red};
    }

    .viabilidad-step-explain {
      font-size: 12px;
      color: ${COLORS.muted};
      line-height: 1.5;
    }

    .viabilidad-resumen {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      padding: 20px 24px;
    }

    .viabilidad-resumen-title {
      font-family: ${FONTS.heading};
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .viabilidad-resumen p {
      font-size: 14px;
      line-height: 1.65;
      margin: 0 0 10px;
    }

    .viabilidad-resumen p:last-child {
      margin-bottom: 0;
    }

    .viabilidad-tabla {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .viabilidad-tabla th {
      font-family: ${FONTS.heading};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      text-align: left;
      padding: 8px 12px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .viabilidad-tabla td {
      padding: 10px 12px;
      border-bottom: 1px solid ${COLORS.border};
      font-family: ${FONTS.mono};
      font-size: 13px;
    }

    .viabilidad-tabla tr:last-child td {
      border-bottom: none;
    }

    .viabilidad-tabla .escenario-1 { color: ${COLORS.escenario1}; background: transparent; }
    .viabilidad-tabla .escenario-2 { color: ${COLORS.escenario2}; background: transparent; }
    .viabilidad-tabla .escenario-3 { color: ${COLORS.escenario3}; background: transparent; }

    .cita {
      border-left: 3px solid ${COLORS.red};
      padding: 12px 16px;
      margin-bottom: 12px;
      background: ${COLORS.bg};
      font-style: italic;
    }

    .cita-contexto {
      font-style: normal;
      font-size: 12px;
      color: ${COLORS.muted};
      margin-top: 4px;
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

    .prioridad-alta { color: ${COLORS.red}; font-weight: 700; }
    .prioridad-media { color: ${COLORS.escenario2}; font-weight: 600; }
    .prioridad-baja { color: ${COLORS.muted}; }

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
      gap: 24px;
      font-family: ${FONTS.mono};
      font-size: 13px;
      color: rgba(255,255,255,0.7);
      margin-top: 12px;
    }

    .p4-card {
      padding: 20px;
      border: 1px solid ${COLORS.border};
      margin-bottom: 12px;
    }

    .p4-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${COLORS.red};
      margin-bottom: 8px;
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

    .var-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .var-tag {
      display: inline-block;
      font-family: ${FONTS.mono};
      font-size: 11px;
      padding: 2px 8px;
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.muted};
    }

    /* --- Propuesta --- */
    /* --- Gantt --- */
    .gantt {
      margin-bottom: 24px;
      border: 1px solid ${COLORS.border};
      padding: 20px;
      background: ${COLORS.bg};
    }

    .gantt-header {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      margin-bottom: 12px;
    }

    .gantt-week {
      font-family: ${FONTS.mono};
      font-size: 10px;
      color: ${COLORS.muted};
      text-align: center;
    }

    .gantt-row {
      margin-bottom: 8px;
    }

    .gantt-bar-container {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      margin-bottom: 4px;
    }

    .gantt-cell {
      height: 20px;
      background: ${COLORS.border};
    }

    .gantt-cell.active {
      opacity: 1;
    }

    .gantt-label {
      font-family: ${FONTS.heading};
      font-size: 11px;
      font-weight: 600;
      color: ${COLORS.muted};
      text-transform: uppercase;
      letter-spacing: 0.3px;
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
      content: "→";
      position: absolute;
      left: 0;
      color: ${COLORS.red};
      font-family: ${FONTS.mono};
    }

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

    /* --- Auditoria --- */
    .audit-problems {
      list-style: none;
      padding: 0;
    }

    .audit-problems li {
      padding: 10px 16px;
      margin-bottom: 8px;
      background: ${COLORS.gapBg};
      border-left: 3px solid ${COLORS.gapBorder};
      font-size: 14px;
    }

    .audit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .audit-item {
      padding: 16px 20px;
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
    }

    .audit-item .card-label {
      margin-bottom: 6px;
    }

    /* --- Research / Competidores --- */
    .comp-card {
      border: 1px solid ${COLORS.border};
      margin-bottom: 12px;
    }

    .comp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: ${COLORS.bg};
      border-bottom: 1px solid ${COLORS.border};
    }

    .comp-name {
      font-family: ${FONTS.heading};
      font-weight: 700;
      font-size: 15px;
    }

    .comp-share {
      font-family: ${FONTS.mono};
      font-size: 12px;
      color: ${COLORS.muted};
    }

    .comp-body {
      padding: 16px 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .comp-list-label {
      font-family: ${FONTS.mono};
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${COLORS.escenario1};
      margin-bottom: 6px;
    }

    .comp-list-label.weak {
      color: ${COLORS.red};
    }

    .comp-list {
      list-style: none;
      padding: 0;
      font-size: 13px;
    }

    .comp-list li {
      padding: 2px 0;
    }

    .section-divider {
      border: none;
      border-top: 1px solid ${COLORS.border};
      margin: 32px 0;
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

    /* --- Propuesta de Valor --- */
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

    /* --- Viabilidad: formula --- */
    .viabilidad-formula {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 20px 24px;
      margin-top: 20px;
    }

    .viabilidad-formula-title {
      font-family: ${FONTS.heading};
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .viabilidad-formula-block {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      padding: 14px 20px;
      margin-bottom: 12px;
    }

    .viabilidad-formula-teorica {
      font-family: ${FONTS.mono};
      font-size: 13px;
      color: ${COLORS.muted};
      margin-bottom: 4px;
    }

    .viabilidad-formula-traducida {
      font-family: ${FONTS.mono};
      font-size: 16px;
      font-weight: 700;
      color: ${COLORS.red};
    }

    .viabilidad-formula-gray {
      background: ${COLORS.bg};
    }

    .viabilidad-formula p {
      font-size: 14px;
      line-height: 1.65;
      margin: 0 0 4px;
    }

    /* --- Valor del Servicio --- */
    .valor-tabla {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .valor-tabla th {
      font-family: ${FONTS.heading};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      text-align: left;
      padding: 10px 16px;
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .valor-tabla td {
      padding: 14px 16px;
      border-bottom: 1px solid ${COLORS.border};
      vertical-align: middle;
    }

    .valor-tabla tr:last-child td {
      border-bottom: none;
    }

    .valor-tipo-badge {
      display: inline-block;
      font-family: ${FONTS.mono};
      font-size: 10px;
      font-weight: 600;
      padding: 3px 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .valor-tipo-badge.tipo-unico {
      background: ${COLORS.ink};
      color: ${COLORS.surface};
    }

    .valor-tipo-badge.tipo-mensual {
      background: ${COLORS.red};
      color: ${COLORS.surface};
    }

    .valor-tipo-badge.tipo-por-proyecto {
      background: ${COLORS.escenario2};
      color: ${COLORS.surface};
    }

    .valor-roi {
      background: ${COLORS.bg};
      border-left: 3px solid ${COLORS.escenario1};
      padding: 16px 20px;
      margin-bottom: 16px;
    }

    .valor-roi-label {
      font-family: ${FONTS.mono};
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${COLORS.escenario1};
      margin-bottom: 6px;
    }

    .valor-roi p {
      font-size: 14px;
      line-height: 1.65;
      margin: 0;
    }

    .valor-aclaraciones {
      padding: 12px 16px;
    }

    .valor-aclaraciones p {
      font-family: ${FONTS.mono};
      font-size: 12px;
      color: ${COLORS.muted};
      margin: 0 0 4px;
    }

    .valor-aclaraciones p:last-child {
      margin-bottom: 0;
    }

    /* --- Cierre / Proximos Pasos --- */
    .cierre-resumen {
      padding: 20px 24px;
      background: ${COLORS.bg};
      border-left: 3px solid ${COLORS.red};
      margin-bottom: 20px;
    }

    .cierre-resumen p {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .cierre-resumen p:last-child {
      margin-bottom: 0;
    }

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
