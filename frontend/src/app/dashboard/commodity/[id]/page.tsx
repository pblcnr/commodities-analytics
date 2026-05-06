"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommodityChart from "@/components/CommodityChart";
import { getCommodityById, getCommodityForecast, CommodityHistory, CommodityHistoryPoint, CommodityForecast } from "@/services/commodities";
import "../commodity-detail.css";

type Params = Promise<{ id: string }>;

export default function CommodityDetailPage({ params }: { params: Params }) {
  const { id: commodityId } = use(params);
  const [commodity, setCommodity] = useState<CommodityHistory | null>(null);
  const [forecast, setForecast] = useState<CommodityForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  const [chartView, setChartView] = useState<'history' | 'forecast'>('history');

  useEffect(() => {
    Promise.all([
      getCommodityById(commodityId),
      getCommodityForecast(commodityId, 3).catch(() => null)
    ])
      .then(([historyData, forecastData]) => {
        if (!historyData) {
          setNotFoundFlag(true);
        } else {
          setCommodity(historyData);
          setForecast(forecastData);
        }
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [commodityId]);

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !commodity) {
    return (
      <div className="commodity-detail">
        <div className="back-link">
          <Link href="/dashboard">← Voltar para Dashboard</Link>
        </div>
        <div className="detail-header" style={{ opacity: 0.4 }}>
          <div>
            <h1>Carregando...</h1>
            <div className="price-big">R$ --,--</div>
          </div>
        </div>
      </div>
    );
  }

  // Pega o preço mais recente se houver histórico para mostrar no header
  const currentPrice = commodity.historico.length > 0 
    ? commodity.historico[commodity.historico.length - 1].preco_medio 
    : 0;

  // Mapeia os dados do histórico para o formato que o CommodityChart espera
  const chartData = commodity.historico.map((point: CommodityHistoryPoint) => ({
    date: point.data_referencia,
    price: point.preco_medio
  }));

  const forecastChartData = forecast?.previsoes?.map((point) => ({
    date: point.periodo,
    price: point.preco_previsto
  })) || [];

  const currentChartData = chartView === 'history' ? chartData : forecastChartData;

  // Extrai a previsão de IA do primeiro mês
  const firstForecast = forecast?.previsoes?.[0];
  const forecastPercent = firstForecast ? firstForecast.variacao_pct : 0;
  const isPositive = forecastPercent > 0;
  const isNegative = forecastPercent < 0;

  return (
    <div className="commodity-detail">
      <div className="back-link">
        <Link href="/dashboard">← Voltar para Dashboard</Link>
      </div>

      <div className="detail-header">
        <div>
          <h1>{commodity.nome}</h1>
          <div className="price-big">
            R$ {currentPrice.toFixed(2)}{" "}
            <span className="unit">Preço Atual</span>
          </div>
        </div>
        <div className="header-actions">
          <Link href="/dashboard/purchases" className="btn-primary">
            Registrar Compra
          </Link>
          <Link href="/dashboard/alerts" className="btn-secondary">
            Criar Alerta
          </Link>
        </div>
      </div>

      <div className="insight-grid">
        <div className="card ai-insight glass">
          <div className="insight-header">
            <h3>Previsão IA (30 dias)</h3>
            <span className={`badge ${isPositive ? 'bad' : 'good'}`}>
              {isPositive ? 'Alerta de Alta' : 'Bom para Compra'}
            </span>
          </div>
          <div className="insight-body">
            <div className="forecast-big" style={{ color: isPositive ? "var(--danger, #ef4444)" : (isNegative ? "var(--success, #10b981)" : "") }}>
              {isPositive ? "+" : ""}{forecastPercent}%
            </div>
            <p className="insight-text">
              {forecast ? (
                <>A tendência indica {isPositive ? "alta" : "queda"} de {Math.abs(forecastPercent)}%. {isPositive ? "Comprar agora pode representar uma economia antes que os preços subam." : "Aguarde um pouco mais para realizar compras, pois os preços devem cair."} (Modelo: {forecast.modelo_utilizado})</>
              ) : (
                "Carregando previsões da IA..."
              )}
            </p>
          </div>
        </div>

        <div className="card chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <h3>{chartView === 'history' ? 'Histórico de Preços (Últimos meses)' : 'Preços Futuros (Previsão)'}</h3>
            
            <div className="view-toggle" style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setChartView('history')}
                className={`btn-${chartView === 'history' ? 'primary' : 'secondary'}`}
                style={{ padding: "0.4rem 1rem", fontSize: "0.9rem", borderRadius: "8px", border: "none", cursor: "pointer" }}
              >
                Histórico
              </button>
              <button 
                onClick={() => setChartView('forecast')}
                className={`btn-${chartView === 'forecast' ? 'primary' : 'secondary'}`}
                style={{ padding: "0.4rem 1rem", fontSize: "0.9rem", borderRadius: "8px", border: "none", cursor: forecast && forecast.previsoes.length > 0 ? "pointer" : "not-allowed", opacity: forecast && forecast.previsoes.length > 0 ? 1 : 0.5 }}
                disabled={!forecast || forecast.previsoes.length === 0}
              >
                Previsão IA
              </button>
            </div>
          </div>
          <CommodityChart data={currentChartData} unit="Un" />
        </div>
      </div>
    </div>
  );
}
