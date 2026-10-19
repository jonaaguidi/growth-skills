// -- Checklist system --

export type CheckStatus = "pendiente" | "hecho" | "bloqueado" | "no-aplica";

export interface CheckItem {
  label: string;
  status: CheckStatus;
  notas: string | null;
}

export interface CheckGroup {
  titulo: string;
  items: CheckItem[];
}

// -- Client (seeded from F1) --

export interface ClientInfo {
  nombreEmpresa: string;
  slug: string;
  logoFile?: string | null; // path relativo a assets/ (ej. "star-deportes-logo.webp"); si se define, se muestra en el header
  nombreContacto: string | null;
  industria: string | null;
  sitioWeb: string | null;
  email: string | null;
  telefono: string | null;
  fechaCierre: string | null;
}

export interface DatosF1 {
  inversionMensual: string | null;
  presupuestoPauta: string | null;
  cplObjetivo: string | null;
  canalesRecomendados: string[];
  palancaPropuesta: string | null;
  campanasVendidas: string[];
  duracionProyecto: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  fechaInicioISO: string | null;
}

// -- A. Onboarding --

export interface EquipoMiembro {
  nombre: string;
  rol: string;
  telefono: string | null;
}

export interface EdgeCase {
  condicion: string;
  aplica: boolean;
  instrucciones: string;
}

export interface MetaBusinessSetup {
  cuentaMaestra: string;
  businessPortfolio: CheckGroup;
  facebookPage: CheckGroup;
  instagramBusiness: CheckGroup;
  adAccount: CheckGroup;
  pixel: CheckGroup;
  capi: CheckGroup;
  edgeCases: EdgeCase[];
}

export interface AccesoPlataforma {
  nombrePlataforma: string;
  descripcion: string;
  items: CheckItem[];
}

export interface RequerimientosCliente {
  brandAssets: CheckGroup;
  accesoWeb: CheckGroup;
  whatsappInfo: CheckGroup;
  atencionLeads: CheckGroup;
  accesoPlataforma: AccesoPlataforma | null;
  tracking: CheckGroup | null;
}

export interface ProximaReunion {
  nombre: string;
  fechaTentativa: string | null;
  objetivos: string[];
}

export interface KOCallEtapa {
  nombre: string;
  duracion: string;
  objetivo: string;
  output: string;
}

export interface KOCallPlan {
  fechaPropuesta: string | null;
  duracionTotal: string | null;
  etapas: KOCallEtapa[];
  flujoTemas: string[];
  temasWow: string[];
  checklist: CheckGroup;
  proximaReunion: ProximaReunion | null;
}

// -- B. Estrategia --

export interface PalancaElegida {
  nombre: "Posicionamiento" | "Oferta" | "Captacion" | "Conversion";
  justificacion: string;
}

export interface EjemploMarcaICP {
  marca: string;
  rubro: string;
  caso: string; // por que esta marca encaja en el perfil
  rol?: string | null; // rol del decisor (ej. "Director de Marketing")
  avatarFile?: string | null; // path relativo a assets/ (ej. "tostado-avatar.jpg")
}

export interface ICPEstrategico {
  segmento: string;
  descripcion: string;
  frase: string | null;
  dolores: string[];
  deseos: string[];
  objeciones: string[];
  prioridad?: "primario" | "secundario" | null; // si no se define, no se renderiza el badge
  recurrencia: "alta" | "media" | "baja" | null;
  badge?: string | null; // label custom del segundo badge (ej. "Demanda activa"); si no se define, se deriva de recurrencia
  ejemplosMarcas?: EjemploMarcaICP[] | null; // ejemplos ilustrativos de marcas que encajan en el perfil
}

export interface PropuestaDeValor {
  descripcion: string;
  diferenciador: string;
}

export interface CalificacionLead {
  categoria: "A" | "B" | "C";
  descripcion: string;
  accion: string;
}

export interface KPI {
  nombre: string;
  objetivo: string | null;
  fuente: string;
}

export interface Presupuesto {
  pauta: string;
  fee: string;
  total: string;
  cplTarget: string | null;
  limiteGastoCuenta: string | null;
}

export interface AnguloCreativo {
  nombre: string;
  dolorQueResuelve: string;
  mensajeClave: string;
  formato: string;
}

export interface TratamientoCreativo {
  tipo: string | null;    // "Video" | "Carrusel"
  tono: string | null;    // "Orgánico (UGC)" | "Cinematic" | "Mixed"
  estilo: string | null;  // "Lifestyle" | "Motion Graphics" | etc.
}

export interface PiezaCreativa {
  formato: string;
  dolor: string;
  solucion: string;
  comunicacion: string;
  hook?: string;
  body?: string;
  cta?: string;
  mensajes?: string[];

  // Framework de produccion (opcionales, para Brief)
  pilar?: string | null;
  tema?: string | null;
  formatoNarrativo?: string | null;
  estructuraNarrativa?: string | null;
  tratamiento?: TratamientoCreativo | null;
  duracion?: string | null;
  referenciaAudiovisual?: string | null;
  referenciaGrafica?: string | null;
  referencias?: ReferenciaCreativa[] | null;
  enRevision?: boolean | null;
  copyAnuncio?: string | null;

  // Destino (opcionales, para Brief)
  destinoUrls?: string[] | null;
}

export interface ReferenciaCreativa {
  url: string;
  titulo?: string | null;
  tipo?: "link" | "iframe" | "image" | "video" | "carousel" | null;  // null = auto-detect
}

export interface PiezasICP {
  icp: string;
  piezas: PiezaCreativa[];
}

export interface Creativos {
  angulos?: AnguloCreativo[];
  piezasPorIcp?: PiezasICP[];
  formatos: string[];
  tono: string | null;
  resumenPiezas?: string | null; // texto custom del resumen (ej. "4 piezas en revision (ICP 1)"); si no se define, se deriva del conteo
  notaPiezas?: string | null;    // callout visible arriba del bloque de piezas (ej. estado de revision con el cliente)
}

export interface UTMConvention {
  campaignFormat: string;
  ejemplos: string[];
}

export interface CampanaPresupuesto {
  diario: string;       // "USD $5/día"
  mensual: string;      // "USD $150/mes"
}

export interface CampanaDefinida {
  nombre: string;
  objetivo: string;
  descripcionCampana?: string | null;   // descripción estratégica del objetivo
  adSets: { nombre: string; segmentacion: string; ads: string[] }[];
  status?: "activa" | "en-desarrollo" | null;
  tituloSeccion?: string | null;        // titulo custom de la seccion Foundation en el review (ej. "Campaña B2B (WhatsApp)")
  productorPiezas?: string | null;      // quien produce las piezas pendientes; default "Sergio" (equipo REE)
  tituloSubseccion?: string | null;     // titulo custom de la subseccion "Campaña en Meta Ads" (ej. "Campaña B2B en Meta Ads")
  destino?: string | null;              // ej. "Perfil de Instagram"
  kpisCampana?: string[] | null;        // ej. ["Visitas al Perfil"]
  conversionCampana?: string | null;    // evento de conversion de la campana (ej. "Cantidad de Mensajes a WhatsApp"); si no se define, se usa el join de kpisCampana
  presupuestoCampana?: CampanaPresupuesto | null;
  piezas?: PiezaCreativa[] | null;      // creative briefs for pieces in this campaign
  badgesPiezas?: string[] | null;       // badges junto al titulo de la seccion Piezas Creativas (ej. ["En desarrollo", "Equipo Creativo"])
  bannerPiezas?: string | null;         // texto custom del banner verde de piezas (ej. "8 piezas activas desde el 24/09."); si no se define, se usa el default
  notaCampana?: string | null;          // linea destacada al inicio de la subseccion de campana en desarrollo (ej. "Producto a comunicar: Kickoff...")
  conSubsecciones?: boolean | null;     // render as one section with subsections (Meta Ads + Guiones) instead of separate sections
  referencias?: ReferenciaCreativa[] | null;  // creative references for the campaign (visual inspiration grid)
  postesDirectos?: ReferenciaCreativa[] | null;  // content to post organically from the profile (rendered below pieces)
}

export interface CapacidadAtencion {
  quienAtiende: string;
  capacidadDiaria: string | null;
  tiempoRespuesta: string | null;
  validado: boolean;
}

export interface OfertaProducto {
  nombre: string;
  descripcion: string;
  precio: string | null;
}

export interface CambioEcommerce {
  cambio: string;
  objetivo: string;
}

export interface FormatoCompetencia {
  id: string;
  tipo: string;
  dolor: string;
  solucion?: string;
  postUrl?: string;
  imageFile?: string;
}

export interface CompetidorCard {
  nombre: string;
  estado: string;         // "63 anuncios activos"
  activo: boolean;
  avatarFile?: string | null;  // path relativo a assets/
  instagramUrl?: string | null; // URL del perfil de Instagram
}

export interface CompetenciaAds {
  marca: string;
  cuenta: string;
  adLibraryUrl: string;
  formatos: FormatoCompetencia[];
  competidores?: CompetidorCard[] | null;
  observacion?: string | null; // Insight estratégico sobre el panorama competitivo
}

// -- Foundation Review presentation --

export interface ReviewEtapa {
  nombre: string;
  duracion: string;
  objetivo: string;
}

export interface PricingRow {
  marca: string;
  producto: string;
  precio: string;
  precioPorKg: string;
  diferencia: string | null;
  esReferencia?: boolean;
}

export interface PricingComparativa {
  titulo: string;
  rows: PricingRow[];
  fuente: string;
  sugerencia: string | null;
}

export interface ProximoPaso {
  titulo: string;
  responsable: string;
  tiempo: string;
  items: string[];
}

export interface ReviewMilestone {
  semana: number;
  label: string;
  fecha?: string | null; // fecha explicita (ej. "18/09"); si no se define, se calcula como inicio de la semana
}

export interface ReviewMeeting {
  semana: string;
  nombre: string;
  desc: string;
  status: "done" | "current" | "pending";
  fecha?: string | null; // fecha explicita (ej. "23/09"); si no se define, se calcula desde fechaInicioISO + semana
}

// -- Roadmap --

export interface RoadmapFase {
  nombre: string;          // "Foundation" | "Build" | "Launch" | "Scale"
  semanaInicio: number;
  semanaFin: number;
}

export interface RoadmapInitiative {
  nombre: string;          // "Awareness de Marca"
  fases: RoadmapFase[];
}

// -- Top level --

export interface FoundationData {
  clientInfo: ClientInfo;
  datosF1: DatosF1 | null;

  // A. Onboarding
  equipoAsignado: EquipoMiembro[];
  grupoWhatsApp: CheckGroup;
  metaBusiness: MetaBusinessSetup;
  requerimientosCliente: RequerimientosCliente;
  koCall: KOCallPlan;

  // B. Estrategia
  palanca: PalancaElegida | null;
  icp: ICPEstrategico[];
  propuestaDeValor: PropuestaDeValor | null;
  calificacionLeads: CalificacionLead[];
  kpis: KPI[];
  presupuesto: Presupuesto | null;
  creativos: Creativos | null;
  utm: UTMConvention | null;
  arquitectura: CampanaDefinida[];
  capacidadAtencion: CapacidadAtencion | null;

  notas: string | null;

  // Foundation Review extras
  ofertas: OfertaProducto[] | null;
  cambiosEcommerce: CambioEcommerce[] | null;

  // Competencia reference ads
  competenciaAds: CompetenciaAds | null;

  // Referencias moodboard (Pinterest, etc.) for Foundation Review
  referenciasMoodboard?: ReferenciaCreativa[] | null;

  // REE Metrics: override de las cards "Que vas a ver" (opcional; fallback: Dashboard/Timeline/E-Commerce)
  reeMetricsFeatures?: { titulo: string; desc: string }[] | null;
  // REE Metrics: fuente de datos que se cruza en el disclaimer, reemplaza a la plataforma e-commerce (ej. "WhatsApp")
  reeMetricsFuente?: string | null;
  // REE Metrics: link de invitacion para que el cliente setee su contraseña (opcional; si falta, no se renderiza el bloque)
  reeMetricsResetPasswordUrl?: string | null;

  // Roadmap
  roadmap: RoadmapInitiative[];

  // Foundation Review presentation (optional, renderer derives defaults if missing)
  // Section ids rendered as locked (grey, no body, "EN PREPARACION" badge):
  // "foundation-campaign" | "ree-metrics" | "roadmap" | "proximos-pasos" | "piezas-creativas" | slug de campana activa
  seccionesBloqueadas?: string[] | null;
  reviewEtapas?: ReviewEtapa[] | null;
  pricingComparativa?: PricingComparativa | null;
  proximosPasos?: ProximoPaso[] | null;
  reviewMilestones?: ReviewMilestone[] | null;
  reviewMeetings?: ReviewMeeting[] | null;
}
