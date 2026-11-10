import type { AnalyzeProductInput, Product, RoiCalculationResult } from '@scanprofit/shared-types';

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

export async function searchAmazonProduct(params: {
  upc?: string | null;
  title?: string | null;
}): Promise<Product | null> {
  const query = new URLSearchParams();
  if (params.upc) query.set('upc', params.upc);
  if (params.title) query.set('title', params.title);

  if (!query.toString()) return null;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/analyzer/search?${query.toString()}`);
  } catch {
    throw new ApiUnreachableError();
  }

  if (response.status === 404) return null;

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? `Error ${response.status} al buscar el producto en Amazon.`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return response.json() as Promise<Product>;
}
