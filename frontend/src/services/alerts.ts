import { apiClient } from "@/lib/api-client";

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

export async function getAlerts(): Promise<AlertModel[]> {
  return apiClient.get<AlertModel[]>('/alerts', {
    cache: 'no-store',
  });
}

export async function createAlert(alert: AlertModel): Promise<void> {
  // O endpoint de criação será implementado quando o banco de dados for adicionado.
  // Por enquanto retorna uma promessa resolvida como solicitado.
  return Promise.resolve();
}

export async function toggleAlertStatus(id: string): Promise<void> {
  return apiClient.patch(`/alerts/${id}/toggle`);
}

export async function deleteAlert(id: string): Promise<void> {
  return apiClient.delete(`/alerts/${id}`);
}
