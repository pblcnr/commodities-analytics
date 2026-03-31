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

export const mockCommodities: Commodity[] = [
  {
    id: 'milho',
    name: 'Milho',
    currentPrice: 58.40,
    unit: 'Saca 60kg',
    forecastPercent: 4.5,
    recommendation: 'good',
    history: [
      { date: '2026-01', price: 54.0 },
      { date: '2026-02', price: 55.5 },
      { date: '2026-03', price: 58.40 },
    ],
  },
  {
    id: 'soja',
    name: 'Soja',
    currentPrice: 122.50,
    unit: 'Saca 60kg',
    forecastPercent: -1.2,
    recommendation: 'regular',
    history: [
      { date: '2026-01', price: 125.0 },
      { date: '2026-02', price: 124.0 },
      { date: '2026-03', price: 122.50 },
    ],
  },
  {
    id: 'arroz',
    name: 'Arroz',
    currentPrice: 105.00,
    unit: 'Saca 50kg',
    forecastPercent: -5.0,
    recommendation: 'bad',
    history: [
      { date: '2026-01', price: 112.0 },
      { date: '2026-02', price: 108.0 },
      { date: '2026-03', price: 105.00 },
    ],
  },
  {
    id: 'cafe',
    name: 'Café Arábica',
    currentPrice: 1020.00,
    unit: 'Saca 60kg',
    forecastPercent: 8.0,
    recommendation: 'good',
    history: [
      { date: '2026-01', price: 950.0 },
      { date: '2026-02', price: 980.0 },
      { date: '2026-03', price: 1020.00 },
    ],
  },
  {
    id: 'feijao',
    name: 'Feijão Carioca',
    currentPrice: 280.00,
    unit: 'Saca 60kg',
    forecastPercent: 1.5,
    recommendation: 'regular',
    history: [
      { date: '2026-01', price: 275.0 },
      { date: '2026-02', price: 278.0 },
      { date: '2026-03', price: 280.00 },
    ],
  }
];

export async function getCommodities(): Promise<Commodity[]> {
  // Simulating async network delay
  return new Promise(resolve => setTimeout(() => resolve(mockCommodities), 400));
}

export async function getCommodityById(id: string): Promise<Commodity | undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockCommodities.find(c => c.id === id));
    }, 400);
  });
}

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
