const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * Classificação retornada pela IA da API externa.
 * Valores esperados: "bom" | "regular" | "ruim"
 */
export type Classification = 'bom' | 'regular' | 'ruim' | string;

/**
 * Payload serializado retornado pelo backend após integração com a API externa (listagem).
 */
export interface Commodity {
  id: string;
  name: string;
  actual_price: number;
  variation_percentage: number;
  classification: Classification;
}

/** Um ponto do histórico de preços. */
export interface HistoryItem {
  data_referencia: string;
  preco_medio: number;
  fonte_dado?: string;
  regiao?: string;
}

/** Uma previsão futura de preço. */
export interface ForecastItem {
  periodo: string;
  preco_previsto: number;
  variacao_pct: number;
}

/**
 * Payload enriquecido retornado pelo backend para a página de detalhe de uma commodity.
 * Agrega: histórico (GET /history), classificação (POST /classify) e previsões (POST /predict).
 */
export interface CommodityDetail {
  nome: string;
  id_materia_prima: string;
  preco_atual: number;
  previsao_media_futura: number;
  variacao_percentual: number;
  classificacao: Classification;
  justificativa: string;
  modelo_utilizado: string;
  data_geracao: string;
  historico: HistoryItem[];
  previsoes: ForecastItem[];
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

export async function getCommodityById(id: string): Promise<CommodityDetail | undefined> {
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
