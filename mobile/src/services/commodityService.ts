import { API_URL } from './auth';
import { useAuthStore } from '../stores/useAuthStore';

export type Recommendation = 'good' | 'regular' | 'bad';

export interface PricePoint {
  date: string;
  price: number;
}

export interface Commodity {
  id: string;
  name: string;
  currentPrice: number;
  unit: string;
  forecastPercent: number;
  recommendation: Recommendation;
  history: PricePoint[];
}

/**
 * Fetches all commodities from the backend.
 */
export async function getCommodities(): Promise<Commodity[]> {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_URL}/commodities`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro ao buscar commodities do servidor.');
  }

  return response.json();
}

/**
 * Fetches a specific commodity by ID.
 */
export async function getCommodityById(id: string): Promise<Commodity | undefined> {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_URL}/commodities/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) return undefined;
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Erro ao buscar detalhes da commodity ${id}.`);
  }

  return response.json();
}

// --- ALERTS MOCK (Kept until the alerts backend is ready) ---

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
