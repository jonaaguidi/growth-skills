import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type { FoundationData, PiezaCreativa, ReferenciaCreativa } from "../types/foundation.js";
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

// ─── Helpers ────────────────────────────────────────────────────────

function isVideoFormat(formato: string): boolean {
  const f = formato.toLowerCase();
  if (f.includes("story")) return false; // "Reel / Story" is story, not video
  return f.includes("video") || f.includes("reel") || f.includes("ugc");
}

function isStory(formato: string): boolean {
  return formato.toLowerCase().includes("story");
}

function isCarruselFormat(formato: string): boolean {
  return formato.toLowerCase().includes("carrusel");
}

function isShoppingFormat(formato: string): boolean {
  return formato.toLowerCase().includes("shopping");
}

function formatBadgeColor(formato: string): string {
  if (isVideoFormat(formato)) return COLORS.red;
  if (isStory(formato)) return "#0369A1";
  if (isCarruselFormat(formato)) return "#7C3AED";
  if (isShoppingFormat(formato)) return "#059669";
  return COLORS.slate;
}

// SVG icons (inline, 14x14) per format type
function formatIcon(formato: string): string {
  const s = `width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px;"`;
  if (isVideoFormat(formato)) {
    // Play triangle
    return `<svg ${s}><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  }
  if (isStory(formato)) {
    // Smartphone
    return `<svg ${s}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`;
  }
  if (isCarruselFormat(formato)) {
    // Layers icon for carousel
    return `<svg ${s}><rect x="2" y="7" width="15" height="15" rx="2"/><path d="M7 2h13a2 2 0 0 1 2 2v13"/></svg>`;
  }
  if (isShoppingFormat(formato)) {
    // Shopping bag icon
    return `<svg ${s}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  }
  // Posteo (rectangular / cuadrado) — image icon
  return `<svg ${s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
}

function porDefinir(value: string | null | undefined): string {
  if (!value) return `<span style="background:${COLORS.gapBg};border:1px solid ${COLORS.gapBorder};padding:2px 8px;font-family:${FONTS.mono};font-size:12px;">Por definir</span>`;
  return escapeHtml(value);
}

function shouldEmbed(ref: ReferenciaCreativa): boolean {
  if (ref.tipo === "iframe") return true;
  if (ref.tipo === "link") return false;
  // Auto-detect: Instagram, YouTube, TikTok, Pinterest
  const url = ref.url.toLowerCase();
  return /instagram\.com\/(p|reel|tv)\//.test(url)
    || /youtube\.com\/watch|youtu\.be\/|youtube\.com\/shorts/.test(url)
    || /tiktok\.com\/@.*\/video\//.test(url)
    || /pinterest\.(?:com|es|com\.mx|com\.ar)\/pin\//.test(url);
}

function getEmbedUrl(url: string): string {
  // Instagram → embed
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/);
  if (igMatch) return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`;
  // YouTube → embed
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // TikTok → embed
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/${ttMatch[1]}`;
  // Pinterest → embed
  const pinMatch = url.match(/pinterest\.(?:com|es|com\.mx|com\.ar)\/pin\/(\d+)/);
  if (pinMatch) return `https://assets.pinterest.com/ext/embed.html?id=${pinMatch[1]}`;
  return url;
}

function renderReferencias(refs: ReferenciaCreativa[]): string {
  return refs.map((ref, i) => {
    const titulo = ref.titulo ? escapeHtml(ref.titulo) : `Referencia ${i + 1}`;
    if (shouldEmbed(ref)) {
      const embedUrl = getEmbedUrl(ref.url);
      return `
        <div style="margin-bottom:12px;">
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px;">${titulo}</div>
          <div style="position:relative;max-width:400px;">
            <iframe src="${escapeHtml(embedUrl)}" style="border:1px solid ${COLORS.border};width:100%;min-height:480px;" frameborder="0" allowfullscreen loading="lazy"></iframe>
          </div>
          <a href="${escapeHtml(ref.url)}" target="_blank" style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.red};text-decoration:none;display:inline-block;margin-top:4px;">Abrir original &rarr;</a>
        </div>`;
    }
    // Link only
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border:1px solid ${COLORS.border};margin-bottom:8px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        <div style="flex:1;min-width:0;">
          <div style="font-size:13px;font-weight:600;">${titulo}</div>
          <a href="${escapeHtml(ref.url)}" target="_blank" style="font-family:${FONTS.mono};font-size:11px;color:${COLORS.red};text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;">${escapeHtml(ref.url)}</a>
        </div>
      </div>`;
  }).join("");
}

// ─── Header ─────────────────────────────────────────────────────────

function renderHeader(data: FoundationData): string {
  const logo = getLogoBase64();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);
  const logoTag = logo
    ? `<img src="data:image/png;base64,${logo}" alt="REE" class="header-logo">`
    : "";

  const campanas = data.datosF1?.campanasVendidas ?? [];
  const campanaBadges = campanas.length
    ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">${campanas.map(c => `<span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:4px 10px;background:rgba(255,255,255,0.15);color:${COLORS.surface};border:1px solid rgba(255,255,255,0.25);">${escapeHtml(c)}</span>`).join("")}</div>`
    : "";

  return `
  <div class="header" id="top">
    ${logoTag}
    <div class="header-label">Brief de Creativos</div>
    <div class="header-title">${empresa}</div>
    ${campanaBadges}
    <div class="header-confidencial">DOCUMENTO INTERNO - NO COMPARTIR CON EL CLIENTE</div>
  </div>`;
}

// ─── TOC ────────────────────────────────────────────────────────────

function renderToc(data: FoundationData): string {
  const groups = data.creativos?.piezasPorIcp ?? [];

  const items: { id: string; title: string; desc: string }[] = [
    { id: "resumen", title: "Resumen", desc: "Total de piezas, formatos, ICPs y contexto del proyecto" },
    { id: "framework", title: "Framework de Produccion", desc: "Pilares, formatos narrativos, estructura, tratamiento y tono" },
  ];

  for (const group of groups) {
    const slug = group.icp.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    items.push({
      id: `piezas-${slug}`,
      title: `Piezas - ICP ${group.icp}`,
      desc: `${group.piezas.length} piezas creativas para ${group.icp}`,
    });
  }

  if (data.referenciasMoodboard?.length) {
    items.push({ id: "referencias", title: "Referencias", desc: "Moodboard visual y referencias de estilo" });
  }

  return `
  <div style="background:${COLORS.surface};border:1px solid ${COLORS.border};padding:24px 32px;margin-bottom:24px">
    <ol style="list-style:none;counter-reset:toc;padding:0;margin:0">
      ${items.map((s, i) => `<li style="counter-increment:toc;margin-bottom:12px"><a href="#${s.id}" style="color:${COLORS.ink};text-decoration:none;font-size:14px;font-weight:600"><span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.red};margin-right:8px;font-weight:600">${String(i + 1).padStart(2, "0")}.</span>${escapeHtml(s.title)}</a><div style="font-size:12px;font-weight:400;color:${COLORS.muted};margin-top:2px;padding-left:28px">${escapeHtml(s.desc)}</div></li>`).join("\n      ")}
    </ol>
  </div>`;
}

// ─── Resumen ────────────────────────────────────────────────────────

function renderResumen(data: FoundationData): string {
  const creativos = data.creativos;
  if (!creativos?.piezasPorIcp?.length) {
    return `<div class="section" style="padding:32px;">
      <h2>Sin piezas creativas definidas</h2>
      <p style="color:${COLORS.muted};">El campo creativos.piezasPorIcp esta vacio. Completa las piezas por ICP para generar el brief.</p>
    </div>`;
  }

  const allPiezas = creativos.piezasPorIcp.flatMap(g => g.piezas);
  const totalPautar = allPiezas.length;

  // Deduplicate: piezas con mismo (formato + dolor) across ICPs count once for production
  const seen = new Set<string>();
  let totalProducir = 0;
  for (const p of allPiezas) {
    const key = `${p.formato}|||${p.dolor}`;
    if (!seen.has(key)) {
      seen.add(key);
      totalProducir++;
    }
  }

  // Use creativos.formatos (delivery formats) if available, otherwise derive from pieces
  const formatTypes = creativos.formatos?.length
    ? creativos.formatos
    : [...new Set(allPiezas.map(p => p.formato))];

  // --- Stat cards (2 cols: producir vs pautar) ---
  const statCards = `
    <div class="m-stack" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
      <div style="background:${COLORS.red};padding:28px;text-align:center;">
        <div style="font-family:${FONTS.mono};font-size:42px;font-weight:700;color:${COLORS.surface};line-height:1;">${totalProducir}</div>
        <div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.7);margin-top:10px;">Piezas a producir</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px;">Piezas unicas que el equipo debe crear</div>
      </div>
      <div style="background:${COLORS.ink};padding:28px;text-align:center;">
        <div style="font-family:${FONTS.mono};font-size:42px;font-weight:700;color:${COLORS.surface};line-height:1;">${totalPautar}</div>
        <div style="font-family:${FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.5);margin-top:10px;">Piezas a pautar</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;">Total incluyendo piezas compartidas entre ICPs</div>
      </div>
    </div>`;

  // --- Tipos de formato (with icons) ---
  const formatChips = formatTypes.map(fmt => {
    const color = formatBadgeColor(fmt);
    const icon = formatIcon(fmt);
    return `<span style="font-family:${FONTS.mono};font-size:12px;font-weight:600;padding:8px 16px;background:${color};color:${COLORS.surface};display:inline-flex;align-items:center;">${icon}${escapeHtml(fmt)}</span>`;
  }).join("");

  const tiposFormato = `
    <div style="border:1px solid ${COLORS.border};padding:20px;margin-bottom:24px;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Tipos de formato</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">${formatChips}</div>
    </div>`;

  return `
  <div style="background:${COLORS.surface};border:1px solid ${COLORS.border};margin-bottom:24px;" id="resumen">
    <div style="display:flex;align-items:center;padding:24px 32px;border-bottom:1px solid ${COLORS.border};">
      <span class="section-num">01</span>
      <span style="font-family:${FONTS.heading};font-weight:700;font-size:20px;">Resumen del Brief</span>
    </div>
    <div style="padding:32px;">
      ${statCards}
      ${tiposFormato}
    </div>
  </div>`;
}

// ─── Framework Guide ────────────────────────────────────────────────

function renderFrameworkGuide(data: FoundationData): string {
  const creativos = data.creativos;
  const tono = creativos?.tono;

  // --- Helper: category with sub-items ---
  const catBlock = (title: string, items: string[]) =>
    `<div style="border:1px solid ${COLORS.border};padding:14px 16px;margin-bottom:8px;">
      <div style="font-family:${FONTS.heading};font-weight:700;font-size:13px;margin-bottom:6px;">${escapeHtml(title)}</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${items.map(i => `<span style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.bg};border:1px solid ${COLORS.border};">${escapeHtml(i)}</span>`).join("")}</div>
    </div>`;

  // --- Helper: structure row ---
  const structRow = (name: string, steps: string[]) =>
    `<div style="display:flex;align-items:center;gap:4px;padding:8px 0;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:11px;font-weight:600;min-width:200px;color:${COLORS.ink};">${escapeHtml(name)}</div>
      <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">${steps.map((s, i) => `${i > 0 ? `<span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>` : ""}
        <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${i === 0 ? COLORS.red : i === steps.length - 1 ? COLORS.red : COLORS.ink};color:${COLORS.surface};">${escapeHtml(s)}</span>`).join("")}</div>
    </div>`;

  // --- 1. Pilar + Tema ---
  const pilarTemaHtml = `
    <div style="margin-bottom:28px;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};font-weight:600;margin-bottom:12px;">Pilar y Tema</div>
      <div style="font-size:12px;color:${COLORS.slate};margin-bottom:12px;line-height:1.5;">El <strong>pilar</strong> es el eje estrategico del contenido (ej: Identidad de Marca, Producto, Educacion). El <strong>tema</strong> es el angulo especifico dentro del pilar (ej: bajo el pilar Producto, los temas pueden ser "Variedad artesanal", "Conveniencia", "Meal prep"). Pilar y tema son especificos de cada cliente y se definen en la estrategia.</div>
      <div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-family:${FONTS.mono};font-size:11px;padding:3px 10px;background:${COLORS.red};color:${COLORS.surface};font-weight:600;">PILAR</span>
          <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
          <span style="font-family:${FONTS.mono};font-size:11px;padding:3px 10px;background:${COLORS.ink};color:${COLORS.surface};">TEMA</span>
          <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
          <span style="font-size:12px;color:${COLORS.slate};">Contenido de la pieza</span>
        </div>
        <div style="font-size:12px;color:${COLORS.muted};line-height:1.5;">Ejemplo: Pilar "Producto" → Tema "Variedad y calidad artesanal" → Video de degustacion del Mix.</div>
      </div>
    </div>`;

  // --- 2. Formato Narrativo ---
  const formatoNarrHtml = `
    <div style="margin-bottom:28px;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};font-weight:600;margin-bottom:12px;">Formato Narrativo</div>
      <div style="font-size:12px;color:${COLORS.slate};margin-bottom:12px;line-height:1.5;">Define <strong>como se cuenta la historia</strong>, no el formato tecnico (video/posteo). Cada formato narrativo tiene sub-variantes que se pueden usar segun la pieza.</div>
      <div class="m-stack" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        ${catBlock("Direct to Camera", ["Talking Head", "Story Time", "Commentary"])}
        ${catBlock("Conversacion", ["Interview", "Podcast", "Street Interview", "Vox Pop", "Debate"])}
        ${catBlock("Educativo / Demostrativo", ["Tutorial", "Explainer", "Breakdown", "Demo"])}
        ${catBlock("Documental / Proceso / Transformacion", ["Vlog", "BTS", "Day in the Life", "Mini Doc", "Journey", "Before and After", "Experiment", "Making of"])}
        ${catBlock("Ficcion", ["Sketch", "Micro Drama", "Roleplay", "Parody"])}
        ${catBlock("Social Native", ["POV", "Reaction", "Meme", "Trend", "Challenge", "Duets"])}
        ${catBlock("Producto", ["Showcase", "Unboxing", "Product Demo", "Lifestyle", "Testimonial"])}
      </div>
    </div>`;

  // --- 3. Estructura Narrativa ---
  const estructuraHtml = `
    <div style="margin-bottom:28px;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};font-weight:600;margin-bottom:12px;">Estructura Narrativa</div>
      <div style="font-size:12px;color:${COLORS.slate};margin-bottom:12px;line-height:1.5;">La secuencia de momentos que define el orden narrativo de la pieza. Cada estructura es un patron probado para capturar atencion y llevar a la accion.</div>
      <div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};">
        ${structRow("Problem - Solution", ["Problema", "Solucion"])}
        ${structRow("Problem - Agitation - Solution", ["Problema", "Agitacion", "Solucion"])}
        ${structRow("Hook - Contenido - Accion", ["Hook", "Contenido", "Accion"])}
        ${structRow("Hook - Contexto - Recompensa", ["Hook", "Contexto", "Recompensa"])}
        ${structRow("Question & Answer", ["Pregunta", "Respuesta"])}
        ${structRow("Afirmacion - Evidencia", ["Afirmacion", "Evidencia"])}
        ${structRow("Creencia - Ruptura - Explicacion", ["Creencia", "Ruptura", "Explicacion"])}
        ${structRow("Expectativa - Contraste", ["Expectativa", "Contraste"])}
        ${structRow("Estado - Transformacion - Resultado", ["Estado Inicial", "Transformacion", "Resultado"])}
        <div style="padding:8px 0;">
          <div style="display:flex;align-items:center;gap:4px;">
            <div style="font-family:${FONTS.mono};font-size:11px;font-weight:600;min-width:200px;color:${COLORS.ink};">Clasica (5 actos)</div>
            <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;">
              <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${COLORS.red};color:${COLORS.surface};">Intro</span>
              <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
              <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${COLORS.ink};color:${COLORS.surface};">Conflicto</span>
              <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
              <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${COLORS.ink};color:${COLORS.surface};">Desarrollo</span>
              <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
              <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${COLORS.ink};color:${COLORS.surface};">Climax</span>
              <span style="color:${COLORS.muted};font-family:${FONTS.mono};font-size:10px;">&rarr;</span>
              <span style="font-family:${FONTS.mono};font-size:11px;padding:2px 8px;background:${COLORS.red};color:${COLORS.surface};">Solucion</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // --- 4. Tratamiento ---
  const tratamientoHtml = `
    <div style="margin-bottom:28px;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};font-weight:600;margin-bottom:12px;">Tratamiento</div>
      <div style="font-size:12px;color:${COLORS.slate};margin-bottom:12px;line-height:1.5;">Define como se ejecuta visualmente la pieza. Tres dimensiones: tipo de pieza, tono de produccion y estilo visual.</div>
      <div class="m-stack-3" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div style="border:1px solid ${COLORS.border};padding:16px;">
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};font-weight:600;margin-bottom:12px;">Tipo</div>
          <div style="font-size:12px;line-height:2;">
            <div><strong>Video</strong> - Pieza audiovisual con guion</div>
            <div><strong>Carrusel</strong> - Secuencia de slides</div>
          </div>
        </div>
        <div style="border:1px solid ${COLORS.border};padding:16px;">
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};font-weight:600;margin-bottom:12px;">Tono</div>
          <div style="font-size:12px;line-height:2;">
            <div><strong>Organico (UGC)</strong> - Celular, persona real, sin produccion pesada</div>
            <div><strong>Cinematic</strong> - Produccion profesional, cinematografia cuidada</div>
            <div><strong>Mixed</strong> - Combina elementos organicos con edicion profesional</div>
          </div>
        </div>
        <div style="border:1px solid ${COLORS.border};padding:16px;">
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};font-weight:600;margin-bottom:12px;">Estilo</div>
          <div style="font-size:12px;line-height:2;">
            <div><strong>Drama</strong></div>
            <div><strong>Comedia</strong></div>
            <div><strong>Ficcion</strong></div>
            <div><strong>Lifestyle</strong></div>
            <div><strong>Motion Graphics</strong></div>
            <div><strong>Animado</strong></div>
            <div><strong>Timelapse</strong></div>
            <div><strong>Stop Motion</strong></div>
          </div>
        </div>
      </div>
    </div>`;

  // --- Tono de comunicacion ---
  const tonoHtml = tono ? `
    <div style="margin-bottom:0;">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${COLORS.muted};font-weight:600;margin-bottom:12px;">Tono de comunicacion</div>
      <div style="padding:16px 20px;background:${COLORS.bg};border:1px solid ${COLORS.border};font-size:13px;line-height:1.6;">${escapeHtml(tono)}</div>
    </div>` : "";

  return `
  <details class="collapsible" id="framework">
    <summary>
      <span class="section-num">02</span>
      Framework de Produccion
    </summary>
    <div class="section-body" style="padding:32px;">
      <div style="font-size:13px;color:${COLORS.slate};line-height:1.6;margin-bottom:24px;max-width:720px;">Cada pieza creativa se define con 5 dimensiones del framework de produccion. Esta guia explica cada dimension para que el equipo pueda interpretar las fichas de cada pieza correctamente.</div>
      ${pilarTemaHtml}
      ${formatoNarrHtml}
      ${estructuraHtml}
      ${tratamientoHtml}
      ${tonoHtml}
    </div>
  </details>`;
}

// ─── Pieza Card ─────────────────────────────────────────────────────

function renderPiezaCard(pieza: PiezaCreativa, index: number, total: number): string {
  const isVideo = isVideoFormat(pieza.formato);
  const isCarrusel = pieza.tratamiento?.tipo === "Carrusel";
  const isShopping = isShoppingFormat(pieza.formato);
  const slideCount = isCarrusel && pieza.mensajes ? pieza.mensajes.length : 0;
  const badgeLabel = isCarrusel
    ? `Carrusel x${slideCount}`
    : pieza.formato;
  const badgeColor = isCarrusel ? "#7C3AED" : isShopping ? "#059669" : formatBadgeColor(pieza.formato);
  const formato = escapeHtml(badgeLabel.toUpperCase());

  // Framework grid
  const frameworkRows: string[] = [];
  const addRow = (label1: string, val1: string | null | undefined, label2: string, val2: string | null | undefined) => {
    frameworkRows.push(`
      <div class="m-stack" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px;">${label1}</div>
          <div style="font-size:13px;">${porDefinir(val1)}</div>
        </div>
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px;">${label2}</div>
          <div style="font-size:13px;">${porDefinir(val2)}</div>
        </div>
      </div>`);
  };

  addRow("Pilar", pieza.pilar, "Tema", pieza.tema);
  addRow("Formato Narrativo", pieza.formatoNarrativo, "Estructura Narrativa", pieza.estructuraNarrativa);

  // Tratamiento (full width)
  const trat = pieza.tratamiento;
  const tratParts: string[] = [];
  if (trat) {
    if (trat.tipo) tratParts.push(escapeHtml(trat.tipo));
    if (trat.tono) tratParts.push(escapeHtml(trat.tono));
    if (trat.estilo) tratParts.push(escapeHtml(trat.estilo));
  }
  const tratLine = tratParts.length
    ? tratParts.map(t => `<span style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.bg};border:1px solid ${COLORS.border};margin-right:6px;">${t}</span>`).join("")
    : porDefinir(null);

  const frameworkSection = `
    <div class="m-pad" style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Framework</div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${frameworkRows.join("")}
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:4px;">Tratamiento</div>
          <div style="font-size:13px;">${tratLine}</div>
        </div>
      </div>
    </div>`;

  // Destino (URLs de landing)
  let destinoSection = "";
  if (pieza.destinoUrls?.length) {
    const urlsList = pieza.destinoUrls.map(url =>
      `<a href="${escapeHtml(url)}" target="_blank" style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid ${COLORS.border};text-decoration:none;color:${COLORS.ink};font-family:${FONTS.mono};font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:background 0.15s;" onmouseover="this.style.background='${COLORS.bg}'" onmouseout="this.style.background='transparent'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${COLORS.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(url)}</span>
      </a>`
    ).join("");

    destinoSection = `
    <div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px;font-weight:600;">Destino</div>
      <div style="display:flex;flex-direction:column;gap:6px;">${urlsList}</div>
    </div>`;
  }

  // Dolor / Solucion
  const dolorSolucion = `
    <div class="m-pad" style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div class="m-stack" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.red};margin-bottom:6px;font-weight:600;">&#9888; Dolor</div>
          <div style="font-size:13px;line-height:1.5;">${escapeHtml(pieza.dolor)}</div>
        </div>
        <div>
          <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.escenario1};margin-bottom:6px;font-weight:600;">&#10003; Solucion</div>
          <div style="font-size:13px;line-height:1.5;">${escapeHtml(pieza.solucion)}</div>
        </div>
      </div>
    </div>`;

  // Production breakdown (comunicacion with [0-3s] format)
  const hasBreakdown = pieza.comunicacion && /\[\d+-\d+s\]/.test(pieza.comunicacion);
  let breakdownSection = "";
  if (hasBreakdown) {
    // Parse segments: [0-3s] LABEL — visual description: 'dialogue'
    const segments = pieza.comunicacion.match(/\[\d+-\d+s\][^[]+/g) ?? [];
    const rows = segments.map(seg => {
      const timeMatch = seg.match(/\[(\d+-\d+s)\]/);
      const time = timeMatch ? timeMatch[1] : "";
      const rest = seg.replace(/\[\d+-\d+s\]\s*/, "").trim();
      // Split on first — to get label and content
      const dashIdx = rest.indexOf("\u2014");
      let label = "";
      let content = rest;
      if (dashIdx > -1) {
        label = rest.slice(0, dashIdx).trim();
        content = rest.slice(dashIdx + 1).trim();
      }
      // Split content on colon to separate toma/visual from dialogue
      // Everything before ':' is the shot description, after ':' is dialogue (in quotes)
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
        ? `<span style="color:${COLORS.ink};font-weight:600;font-style:italic;">&ldquo;${escapeHtml(dialogo)}&rdquo;</span>`
        : `<span style="color:${COLORS.muted};font-style:italic;">Sin dialogo</span>`;
      return `
        <div style="display:grid;grid-template-columns:55px 70px 1fr 1fr;gap:12px;padding:10px 0;border-bottom:1px solid ${COLORS.border};">
          <div style="font-family:${FONTS.mono};font-size:12px;font-weight:700;color:${COLORS.red};">${escapeHtml(time)}</div>
          <div style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${labelColor};text-transform:uppercase;padding-top:2px;">${escapeHtml(label)}</div>
          <div style="font-size:12px;line-height:1.5;color:${COLORS.slate};">${escapeHtml(toma)}</div>
          <div style="font-size:12px;line-height:1.5;">${dialogoHtml}</div>
        </div>`;
    }).join("");

    breakdownSection = `
    <div class="m-pad" style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Desglose de Produccion</div>
      <div class="m-scroll">
        <div class="m-scroll-inner">
          <div style="display:grid;grid-template-columns:55px 70px 1fr 1fr;gap:12px;padding:8px 0;border-bottom:2px solid ${COLORS.ink};margin-bottom:4px;">
            <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600;">Tiempo</div>
            <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600;">Momento</div>
            <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600;">Toma / Visual</div>
            <div style="font-family:${FONTS.mono};font-size:9px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};font-weight:600;">Dialogo</div>
          </div>
          <div>${rows}</div>
        </div>
      </div>
    </div>`;
  }

  // Content section (guion for video, mensajes for static)
  let contentSection = "";
  if (isVideo && (pieza.hook || pieza.body || pieza.cta)) {
    contentSection = `
    <div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Guion</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.red};text-transform:uppercase;margin-right:8px;">HOOK</span>
          <span style="font-size:13px;">${porDefinir(pieza.hook)}</span>
        </div>
        <div>
          <span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.muted};text-transform:uppercase;margin-right:8px;">BODY</span>
          <span style="font-size:13px;">${porDefinir(pieza.body)}</span>
        </div>
        <div>
          <span style="font-family:${FONTS.mono};font-size:10px;font-weight:700;color:${COLORS.escenario1};text-transform:uppercase;margin-right:8px;">CTA</span>
          <span style="font-size:13px;">${porDefinir(pieza.cta)}</span>
        </div>
      </div>
    </div>`;
  } else if (pieza.mensajes?.length) {
    contentSection = `
    <div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Mensajes</div>
      <ul style="list-style:none;padding:0;margin:0;">
        ${pieza.mensajes.map(m => `<li style="font-size:13px;padding:4px 0 4px 16px;position:relative;border-bottom:1px solid ${COLORS.border};"><span style="position:absolute;left:0;color:${COLORS.red};font-family:${FONTS.mono};">&gt;</span>${escapeHtml(m)}</li>`).join("")}
      </ul>
    </div>`;
  }

  // Copy Anuncio section
  let copyAnuncioSection = "";
  if (pieza.copyAnuncio) {
    const copyLines = pieza.copyAnuncio.split("\n").map(line =>
      line.trim() === "" ? "<br>" : `<div>${escapeHtml(line)}</div>`
    ).join("");
    copyAnuncioSection = `
    <div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:12px;font-weight:600;">Copy Anuncio</div>
      <div style="background:${COLORS.bg};border:1px solid ${COLORS.border};padding:16px 20px;font-size:13px;line-height:1.6;white-space:pre-line;">${copyLines}</div>
    </div>`;
  }

  // Adaptaciones section (feed/carrusel → incluye story)
  let adaptacionesSection = "";
  if (!isVideo && !isShopping) {
    adaptacionesSection = `
    <div style="padding:16px 20px;border-bottom:1px solid ${COLORS.border};">
      <div style="font-family:${FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${COLORS.muted};margin-bottom:8px;font-weight:600;">Adaptaciones</div>
      <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#0369A1;color:${COLORS.surface};font-family:${FONTS.mono};font-size:11px;font-weight:600;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
        Incluye adaptacion Story (1080x1920)
      </div>
    </div>`;
  }

  // Summary label: dolor truncated for preview
  const dolorPreview = pieza.dolor.length > 60 ? pieza.dolor.slice(0, 57) + "..." : pieza.dolor;
  const enRevision = pieza.enRevision !== false;

  // Piezas en revision: locked, opaque, no expandable
  if (enRevision) {
    return `
    <div style="border:1px solid ${COLORS.border};margin-bottom:16px;opacity:0.45;pointer-events:none;">
      <div class="m-wrap m-pad" style="padding:14px 20px;background:${COLORS.bg};display:flex;align-items:center;gap:12px;">
        <span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;background:${badgeColor};color:${COLORS.surface};text-transform:uppercase;display:inline-flex;align-items:center;">${formatIcon(badgeLabel)}${formato}</span>

        <span class="m-hide" style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted};">Pieza ${index + 1}/${total}</span>
        <span style="font-family:${FONTS.mono};font-size:10px;font-weight:600;padding:3px 8px;background:#E8A013;color:${COLORS.surface};text-transform:uppercase;letter-spacing:0.5px;">EN REVISI\u00D3N</span>
        <span class="m-hide" style="font-size:13px;color:${COLORS.slate};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(dolorPreview)}</span>
      </div>
    </div>`;
  }

  return `
  <details style="border:1px solid ${COLORS.border};margin-bottom:16px;">
    <summary class="m-wrap m-pad" style="padding:14px 20px;background:${COLORS.bg};display:flex;align-items:center;gap:12px;cursor:pointer;list-style:none;user-select:none;">
      <span style="font-family:${FONTS.mono};font-size:11px;font-weight:600;padding:3px 10px;background:${badgeColor};color:${COLORS.surface};text-transform:uppercase;display:inline-flex;align-items:center;">${formatIcon(badgeLabel)}${formato}</span>
      <span class="m-hide" style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted};">Pieza ${index + 1}/${total}</span>
      <span class="m-hide" style="font-size:13px;color:${COLORS.slate};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(dolorPreview)}</span>
      ${isVideo && pieza.duracion ? `<span class="m-hide" style="font-family:${FONTS.mono};font-size:11px;padding:3px 8px;background:${COLORS.ink};color:${COLORS.surface};margin-left:auto;">${escapeHtml(pieza.duracion)}</span>` : ""}
      <span class="pieza-toggle" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto;">+</span><span class="pieza-toggle-open" style="font-family:${FONTS.mono};font-size:18px;font-weight:400;color:${COLORS.muted};margin-left:auto;">&minus;</span>
    </summary>
    <div style="border-top:1px solid ${COLORS.border};">
    ${frameworkSection}
    ${destinoSection}
    ${dolorSolucion}
    ${contentSection}
    ${copyAnuncioSection}
    ${breakdownSection}
    ${adaptacionesSection}
    </div>
  </details>`;
}

// ─── Pinterest Moodboard ────────────────────────────────────────────

function getPinEmbedUrl(url: string): string | null {
  const m = url.match(/pinterest\.(?:com|es|com\.mx|com\.ar)\/pin\/(\d+)/);
  if (m) return `https://assets.pinterest.com/ext/embed.html?id=${m[1]}`;
  const sub = url.match(/\.pinterest\.com\/pin\/(\d+)/);
  if (sub) return `https://assets.pinterest.com/ext/embed.html?id=${sub[1]}`;
  return null;
}

function getMoodboardEmbedUrl(url: string): string | null {
  // Pinterest
  const pinUrl = getPinEmbedUrl(url);
  if (pinUrl) return pinUrl;
  // Instagram
  const igMatch = url.match(/instagram\.com\/(p|reel|tv)\/([^/?]+)/);
  if (igMatch) return `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/${ttMatch[1]}`;
  return null;
}

function renderMoodboard(refs: ReferenciaCreativa[], sectionNum: number): string {
  const items = refs.map((ref, i) => {
    const titulo = ref.titulo ? escapeHtml(ref.titulo) : `Referencia ${i + 1}`;
    const embedUrl = getMoodboardEmbedUrl(ref.url);
    return `
    <div style="border:1px solid ${COLORS.border};overflow:hidden;background:${COLORS.surface};">
      ${embedUrl
        ? `<iframe src="${escapeHtml(embedUrl)}" style="width:100%;height:450px;border:none;" frameborder="0" scrolling="no" allowfullscreen loading="lazy"></iframe>`
        : `<div style="padding:20px;text-align:center"><a href="${escapeHtml(ref.url)}" target="_blank" style="color:${COLORS.red};font-size:13px;word-break:break-all">${escapeHtml(ref.url)}</a></div>`
      }
      <div style="padding:8px 12px;font-size:12px;font-family:${FONTS.mono};color:${COLORS.muted};border-top:1px solid ${COLORS.border}">${titulo}</div>
    </div>`;
  }).join("");

  return `
  <details class="collapsible" open id="referencias">
    <summary>
      <span class="section-num">${String(sectionNum).padStart(2, "0")}</span>
      Referencias
      <span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted};margin-left:12px;">(${refs.length} pins)</span>
    </summary>
    <div class="section-body">
      <p style="font-size:14px;line-height:1.65;margin-bottom:20px">Moodboard visual y referencias de estilo para las piezas creativas:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
        ${items}
      </div>
    </div>
  </details>`;
}

// ─── ICP Section ────────────────────────────────────────────────────

function renderIcpSection(icpName: string, piezas: PiezaCreativa[], sectionNum: number): string {
  const cards = piezas.map((p, i) => renderPiezaCard(p, i, piezas.length)).join("");
  const slug = icpName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return `
  <details class="collapsible" open id="piezas-${slug}">
    <summary>
      <span class="section-num">${String(sectionNum).padStart(2, "0")}</span>
      Piezas - ICP ${escapeHtml(icpName)}
      <span style="font-family:${FONTS.mono};font-size:12px;color:${COLORS.muted};margin-left:12px;">(${piezas.length} piezas)</span>
    </summary>
    <div class="section-body">
      ${cards}
    </div>
  </details>`;
}

// ─── Footer ─────────────────────────────────────────────────────────

function renderFooter(): string {
  const year = new Date().getFullYear();
  return `<div class="footer">${year} REE Creativos - Brief de Creativos<br><a href="https://growth.reecreativos.com">growth.reecreativos.com</a></div>`;
}

// ─── Main render ────────────────────────────────────────────────────

export function renderBriefHtml(data: FoundationData): string {
  const styles = getBaseStyles();
  const empresa = escapeHtml(data.clientInfo.nombreEmpresa);

  let sectionNum = 2; // 01=Resumen, 02=Framework

  const icpSections = (data.creativos?.piezasPorIcp ?? [])
    .map((group) => {
      sectionNum++;
      return renderIcpSection(group.icp, group.piezas, sectionNum);
    })
    .join("");

  const moodboardRefs = data.referenciasMoodboard;
  let moodboardSection = "";
  if (moodboardRefs?.length) {
    sectionNum++;
    moodboardSection = renderMoodboard(moodboardRefs, sectionNum);
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Brief de Creativos | ${empresa}</title>
${getFaviconTag()}
<style>${styles}
  details > summary::-webkit-details-marker { display: none; }
  details[open] > summary .pieza-toggle { display: none; }
  details:not([open]) > summary .pieza-toggle-open { display: none; }
  details[open] > summary { border-bottom: none; }
</style>
</head>
<body>
<div class="container">
  ${renderHeader(data)}
  ${renderToc(data)}
  ${renderResumen(data)}
  ${renderFrameworkGuide(data)}
  ${icpSections}
  ${moodboardSection}
  ${renderFooter()}
</div>
<a href="#top" class="back-to-top" title="Volver arriba"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M12 19V5M5 12l7-7 7 7"/></svg></a>
</body>
</html>`;
}
