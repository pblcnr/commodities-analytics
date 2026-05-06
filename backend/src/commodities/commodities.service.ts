import { Injectable, NotFoundException } from '@nestjs/common';
import { CommodityDto, CommodityHistoryDto, ForecastResponseDto, ForecastPointDto } from './dto/commodity.dto';

@Injectable()
export class CommoditiesService {
  private readonly commodities: CommodityDto[] = [
    {
      id_materia_prima: 1,
      nome: 'Milho',
      categoria: 'Grãos',
      unidade_medida: 'Saca 60kg',
      ativo: true,
    },
    {
      id_materia_prima: 2,
      nome: 'Soja',
      categoria: 'Grãos',
      unidade_medida: 'Saca 80kg',
      ativo: true,
    },
  ];

  private readonly histories: CommodityHistoryDto[] = [
    {
      id_materia_prima: 1,
      nome: 'Milho',
      historico: [
        {
          data_referencia: '2024-01-01',
          preco_medio: 65.50,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
        {
          data_referencia: '2024-02-01',
          preco_medio: 63.20,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
        {
          data_referencia: '2024-03-01',
          preco_medio: 60.00,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
      ],
    },
    {
      id_materia_prima: 2,
      nome: 'Soja',
      historico: [
        {
          data_referencia: '2024-01-01',
          preco_medio: 125.00,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
        {
          data_referencia: '2024-02-01',
          preco_medio: 124.00,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
        {
          data_referencia: '2024-03-01',
          preco_medio: 122.50,
          fonte_dado: 'CEPEA',
          regiao: 'PR',
        },
      ],
    },
  ];

  findAll(): CommodityDto[] {
    return this.commodities;
  }

  findByIdWithHistory(id: number): CommodityHistoryDto {
    const history = this.histories.find((h) => h.id_materia_prima === id);
    if (!history) {
      throw new NotFoundException(`Commodity history with id "${id}" not found`);
    }
    return history;
  }

  getForecast(id: number, periodos_futuros: number): ForecastResponseDto {
    // TODO: Integrar com rota externa /api/v1/predict
    // Mockando os dados para a IA Insight e o frontend

    const commodity = this.commodities.find((c) => c.id_materia_prima === id);
    if (!commodity) {
      throw new NotFoundException(`Commodity with id "${id}" not found for forecasting`);
    }

    // Mock response dependendo do ID da commodity
    let previsoes: ForecastPointDto[] = [];
    if (id === 1) { // Milho
      previsoes = [
        { periodo: "2024-05", preco_previsto: 68.45, variacao_pct: 2.5 },
        { periodo: "2024-06", preco_previsto: 70.10, variacao_pct: 4.2 },
        { periodo: "2024-07", preco_previsto: 71.50, variacao_pct: 6.0 }
      ];
    } else if (id === 2) { // Soja
      previsoes = [
        { periodo: "2024-05", preco_previsto: 120.00, variacao_pct: -2.0 }, // Exemplo negativo para verificação
        { periodo: "2024-06", preco_previsto: 118.50, variacao_pct: -3.2 },
        { periodo: "2024-07", preco_previsto: 125.00, variacao_pct: 2.0 }
      ];
    } else {
      previsoes = [
        { periodo: "2024-05", preco_previsto: 100.00, variacao_pct: 1.0 }
      ];
    }

    return {
      id_materia_prima: id,
      nome: commodity.nome,
      previsoes: previsoes.slice(0, periodos_futuros),
      modelo_utilizado: "XGBRegressor",
      data_geracao: "2024-04-20T14:30:00"
    };
  }
}
