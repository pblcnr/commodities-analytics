const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

export interface Commodity {
  id_materia_prima: number;
  nome: string;
  categoria: string;
  unidade_medida: string;
  ativo: boolean;
  variacao_pct?: number;
  preco_atual?: number;
}

export interface CommodityHistoryPoint {
  data_referencia: string;
  preco_medio: number;
  fonte_dado: string;
  regiao: string;
}

export interface CommodityHistory {
  id_materia_prima: number;
  nome: string;
  historico: CommodityHistoryPoint[];
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

export async function getCommodityById(id: string | number): Promise<CommodityHistory | undefined> {
  const response = await fetch(`${API_URL}/commodities/${id}/history`, {
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

export interface ForecastPoint {
  periodo: string;
  preco_previsto: number;
  variacao_pct: number;
}

export interface CommodityForecast {
  id_materia_prima: number;
  nome: string;
  previsoes: ForecastPoint[];
  modelo_utilizado: string;
  data_geracao: string;
}

export async function getCommodityForecast(id: string | number, periodos_futuros: number = 3): Promise<CommodityForecast> {
  const response = await fetch(`${API_URL}/commodities/${id}/forecast`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ periodos_futuros }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch forecast for commodity "${id}"`);
  }

  return response.json();
}
