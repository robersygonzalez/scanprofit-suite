import type { AnalyzeProductInput, RoiCalculationResult } from '@scanprofit/shared-types';

const API_BASE_URL = 'http://localhost:3000';

export class ApiUnreachableError extends Error {
  constructor() {
    super('No se pudo conectar con el backend. Verifica que esté corriendo en localhost:3000.');
    this.name = 'ApiUnreachableError';
  }
}

export async function calculateRoi(
  input: AnalyzeProductInput,
): Promise<RoiCalculationResult> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/analyzer/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiUnreachableError();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? `Error ${response.status} al calcular el ROI.`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return response.json() as Promise<RoiCalculationResult>;
}
