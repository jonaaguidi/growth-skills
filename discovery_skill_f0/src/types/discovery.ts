// --- Client info ---

export interface ClientInfo {
  nombreCliente: string | null;
  nombreEmpresa: string | null;
  sitioWeb: string | null;
  fechaLlamada: string | null;
  fathomUrl: string | null;
}

// --- 1. La Llamada: variables del discovery (4P + ICP) ---

export interface VariableDiscovery {
  valor: string | null;
  notas: string | null;
}

export interface DiscoveryVariables {
  icp: VariableDiscovery;
  producto: VariableDiscovery;
  precio: VariableDiscovery;
  plaza: VariableDiscovery;
  promocion: VariableDiscovery;
}

export interface CitaTextual {
  texto: string;
  contexto: string | null;
}

// --- 2. La Auditoria: estado actual de marketing ---

export interface AuditoriaMarketing {
  presenciaDigital: string | null;
  canalesActivos: string[];
  contenidoActual: string | null;
  pautaActual: string | null;
  ecommerce: string | null;
  problemasPrincipales: string[];
}

// --- 3. El Research: mercado + ICP ---

export interface CompetidorAnalisis {
  nombre: string;
  cuotaMercado: string | null;
  fortalezas: string[];
  debilidades: string[];
  pautaActiva: string | null;
}

export interface ResearchMercado {
  tamanoMercado: string | null;
  tendencia: string | null;
  demandaNicho: string | null;
  competidores: CompetidorAnalisis[];
  estacionalidad: string | null;
  notasResearch: string | null;
}

export interface ICPDefinido {
  titulo: string;
  descripcion: string;
  ejemplo: string | null;
  dolores: string[];
  deseos: string[];
  objeciones: string[];
}

// --- 4. Propuesta de Valor: angulos ---

export interface AnguloValor {
  nombre: string;
  audiencia: "B2C" | "B2B" | "ambos";
  dolorQueResuelve: string;
  mensaje: string;
  solucion: string;
  ejemplo: string | null;
}

export interface PropuestaDeValor {
  diferencial: string;
  angulos: AnguloValor[];
  notaExpansion: string | null;
}

// --- 5. Viabilidad (CPL) ---

export interface CalculoCPL {
  ticket: number | null;
  margen: number | null;
  porcentajeMargenParaAds: number | null;
  tasaDeCierre: number | null;
  cpaMaximo: number | null;
  cplObjetivo: number | null;
  cplMercado: number | null;
  escenario: 1 | 2 | 3 | null;
}

// --- 6. El Plan + La Inversion ---

export interface FasePropuesta {
  nombre: string;
  descripcion: string;
  lapso: string | null;
  inversion: string | null;
  entregables: string[];
}

export interface PropuestaEstrategica {
  objetivoGeneral: string;
  fases: FasePropuesta[];
  canalesRecomendados: string[];
  kpisPropuestos: string[];
  notasPropuesta: string | null;
}

// --- Valor del Servicio ---

export interface LineaInversion {
  concepto: string;
  monto: string;
  descripcion: string;
  tipo: "unico" | "mensual" | "por-proyecto";
}

export interface ValorServicio {
  lineas: LineaInversion[];
  notaRoi: string;
  aclaraciones: string[];
}

// --- Gaps y extras ---

export interface GapItem {
  variable: string;
  descripcion: string;
  prioridad: "alta" | "media" | "baja";
  preguntaSugerida: string;
}

// --- Top-level ---

export interface DiscoveryData {
  clientInfo: ClientInfo;
  // 1. La Llamada
  resumenEjecutivo: string | null;
  citasTextuales: CitaTextual[];
  variables: DiscoveryVariables;
  // 2. La Auditoria
  auditoria: AuditoriaMarketing | null;
  // 3. El Research
  research: ResearchMercado | null;
  icp: ICPDefinido[] | null;
  // 4. Propuesta de Valor
  propuestaDeValor: PropuestaDeValor | null;
  /** @deprecated usar propuestaDeValor */
  angulosDeValor?: AnguloValor[] | null;
  // 5. Viabilidad
  calculoCpl: CalculoCPL;
  // 6. El Plan
  propuestaEstrategica: PropuestaEstrategica | null;
  // 7. Valor del Servicio
  valorServicio: ValorServicio | null;
  // 7b. Valor del Servicio (Bajo riesgo)
  valorServicioBajoRiesgo: {
    descripcion: string;
    lineas: LineaInversion[];
    aclaraciones: string[];
  } | null;
  // Gaps y notas
  gaps: GapItem[];
  notasAdicionales: string | null;
  // Cierre
  proximosPasos: string[] | null;
  resumenCierre: string | null;
}
