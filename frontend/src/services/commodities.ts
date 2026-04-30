const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

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

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCommodities(): Promise<Commodity[]> {
  const response = await fetch(`${API_URL}/commodities`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch commodities');
  }

  return response.json();
}

export async function getCommodityById(id: string): Promise<Commodity | undefined> {
  const response = await fetch(`${API_URL}/commodities/${id}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (response.status === 404) {
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch commodity "${id}"`);
  }

  return response.json();
}
