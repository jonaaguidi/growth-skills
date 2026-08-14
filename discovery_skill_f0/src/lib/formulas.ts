export interface CplResult {
  cpaMaximo: number;
  cplObjetivo: number;
}

/**
 * CPA maximo = ticket * (margen / 100) * (porcentajeMargenParaAds / 100)
 * CPL objetivo = CPA maximo * (tasaDeCierre / 100)
 */
export function calcularCpl(
  ticket: number,
  margen: number,
  porcentajeMargenParaAds: number,
  tasaDeCierre: number
): CplResult {
  const cpaMaximo = ticket * (margen / 100) * (porcentajeMargenParaAds / 100);
  const cplObjetivo = cpaMaximo * (tasaDeCierre / 100);
  return { cpaMaximo, cplObjetivo };
}

/**
 * Escenario basado en ratio CPL objetivo / CPL mercado:
 * - Escenario 1 (favorable): ratio >= 1.2
 * - Escenario 2 (ajustado):  ratio >= 0.8 && < 1.2
 * - Escenario 3 (inviable):  ratio < 0.8
 */
export function determinarEscenario(
  cplObjetivo: number,
  cplMercado: number
): 1 | 2 | 3 {
  const ratio = cplObjetivo / cplMercado;
  if (ratio >= 1.2) return 1;
  if (ratio >= 0.8) return 2;
  return 3;
}

/**
 * Intenta calcular CPL con los datos disponibles.
 * Retorna null si faltan campos necesarios.
 */
export function tryComputeCpl(params: {
  ticket: number | null;
  margen: number | null;
  porcentajeMargenParaAds: number | null;
  tasaDeCierre: number | null;
  cplMercado: number | null;
}): {
  cpaMaximo: number;
  cplObjetivo: number;
  escenario: 1 | 2 | 3 | null;
} | null {
  if (
    params.ticket === null ||
    params.margen === null ||
    params.porcentajeMargenParaAds === null ||
    params.tasaDeCierre === null
  ) {
    return null;
  }

  const { cpaMaximo, cplObjetivo } = calcularCpl(
    params.ticket,
    params.margen,
    params.porcentajeMargenParaAds,
    params.tasaDeCierre
  );

  const escenario =
    params.cplMercado !== null
      ? determinarEscenario(cplObjetivo, params.cplMercado)
      : null;

  return { cpaMaximo, cplObjetivo, escenario };
}
