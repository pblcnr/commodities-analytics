export interface CommodityDto {
  id_materia_prima: number;
  nome: string;
  categoria: string;
  unidade_medida: string;
  ativo: boolean;
}

export interface CommodityHistoryPointDto {
  data_referencia: string;
  preco_medio: number;
  fonte_dado: string;
  regiao: string;
}

export interface CommodityHistoryDto {
  id_materia_prima: number;
  nome: string;
  historico: CommodityHistoryPointDto[];
}

export interface ForecastRequestDto {
  periodos_futuros?: number;
}

export interface ForecastPointDto {
  periodo: string;
  preco_previsto: number;
  variacao_pct: number;
}

export interface ForecastResponseDto {
  id_materia_prima: number;
  nome: string;
  previsoes: ForecastPointDto[];
  modelo_utilizado: string;
  data_geracao: string;
}
