// ─── NOTE ─────────────────────────────────────────────────────────────────────
// Commodity types and data have been moved to the backend.
// Use `@/services/commodities` for commodity-related fetches.
// ──────────────────────────────────────────────────────────────────────────────

export interface AlertModel {
  id: string;
  commodityName: string;
  condition: string;
  channel: string;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAlerts(): Promise<AlertModel[]> {
  const response = await fetch(`${API_URL}/alerts`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Failed to fetch alerts');
  return response.json();
}

export async function createAlert(alert: AlertModel): Promise<void> {
  // O endpoint de criação será implementado quando o banco de dados for adicionado.
  // Por enquanto retorna uma promessa resolvida como solicitado.
  return Promise.resolve();
}

export async function toggleAlertStatus(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/alerts/${id}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to toggle alert');
}

export async function deleteAlert(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/alerts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete alert');
}
