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

export interface ICPEstrategico {
  segmento: string;
  descripcion: string;
  dolores: string[];
  deseos: string[];
  objeciones: string[];
  prioridad: "primario" | "secundario";
}

export interface CalificacionLead {
  categoria: "A" | "B" | "C";
  descripcion: string;
  accion: string;
}

export interface AnguloCreativo {
  nombre: string;
  dolorQueResuelve: string;
  mensajeClave: string;
  formato: string;
}

export interface UTMConvention {
  campaignFormat: string;
  ejemplos: string[];
}

export interface CampanaDefinida {
  nombre: string;
  objetivo: string;
  adSets: { nombre: string; segmentacion: string; ads: string[] }[];
}

export interface CapacidadAtencion {
  quienAtiende: string;
  capacidadDiaria: string | null;
  tiempoRespuesta: string | null;
  validado: boolean;
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
  requerimientosCliente: {
    brandAssets: CheckGroup;
    accesoWeb: CheckGroup;
    whatsappInfo: CheckGroup;
    atencionLeads: CheckGroup;
    accesoPlataforma: AccesoPlataforma | null;
    tracking: CheckGroup | null;
  };
  koCall: KOCallPlan;

  // B. Estrategia
  palanca: PalancaElegida | null;
  icp: ICPEstrategico[];
  oferta: { descripcion: string; diferenciador: string } | null;
  calificacionLeads: CalificacionLead[];
  kpis: { nombre: string; objetivo: string | null; fuente: string }[];
  presupuesto: {
    pauta: string;
    fee: string;
    total: string;
    cplTarget: string | null;
    limiteGastoCuenta: string | null;
  } | null;
  creativos: {
    angulos: AnguloCreativo[];
    formatos: string[];
    tono: string | null;
  } | null;
  utm: UTMConvention | null;
  arquitectura: CampanaDefinida[];
  capacidadAtencion: CapacidadAtencion | null;

  notas: string | null;

  // Foundation Review extras
  ofertas: { nombre: string; descripcion: string; precio: string | null }[] | null;
  cambiosEcommerce: { cambio: string; objetivo: string }[] | null;

  // Competencia reference ads
  competenciaAds: {
    marca: string;
    cuenta: string;
    adLibraryUrl: string;
    formatos: { id: string; tipo: string; dolor: string; postUrl?: string }[];
  } | null;

  // Roadmap & bienvenida
  roadmap: RoadmapInitiative[];
  mensajeBienvenida: string | null;
}
