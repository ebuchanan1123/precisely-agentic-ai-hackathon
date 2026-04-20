import type { EvaluateRequest, EvaluateResponse } from './types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function evaluateSite(payload: EvaluateRequest): Promise<EvaluateResponse> {
  const response = await fetch(`${apiBaseUrl}/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(err?.message ?? 'Unable to evaluate location. Please try again.');
  }

  return response.json();
}
