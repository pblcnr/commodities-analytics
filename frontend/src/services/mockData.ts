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

// In-memory array to persist across routes during dev
export let mockAlerts: AlertModel[] = [
  {
    id: "1",
    commodityName: "Milho",
    condition: "Preço cair abaixo de R$ 50,00",
    channel: "Telegram",
    active: true,
  },
  {
    id: "2",
    commodityName: "Soja",
    condition: "Recomendação mudar para BOM",
    channel: "E-mail",
    active: true,
  }
];

export async function getAlerts(): Promise<AlertModel[]> {
  return new Promise(resolve => setTimeout(() => resolve([...mockAlerts]), 200));
}

export async function createAlert(alert: AlertModel): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      mockAlerts = [...mockAlerts, alert];
      resolve();
    }, 400);
  });
}

export async function toggleAlertStatus(id: string): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      mockAlerts = mockAlerts.map(a => a.id === id ? { ...a, active: !a.active } : a);
      resolve();
    }, 200);
  });
}

export async function deleteAlert(id: string): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      mockAlerts = mockAlerts.filter(a => a.id !== id);
      resolve();
    }, 200);
  });
}
