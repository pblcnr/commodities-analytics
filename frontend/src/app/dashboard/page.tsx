"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCommodities, getCommodityForecast, getCommodityById, Commodity } from "@/services/commodities";
import "./dashboard-page.css";

export default function DashboardPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCommodities()
      .then(async (data) => {
        // Busca o forecast do 1º mes e o historico mais recente
        const commoditiesWithData = await Promise.all(
          data.map(async (c) => {
            try {
              const [forecast, history] = await Promise.all([
                getCommodityForecast(c.id_materia_prima, 1).catch(() => null),
                getCommodityById(c.id_materia_prima).catch(() => null)
              ]);
              
              const variacao_pct = forecast?.previsoes?.[0]?.variacao_pct || 0;
              const preco_atual = history && history.historico && history.historico.length > 0 
                ? history.historico[history.historico.length - 1].preco_medio 
                : 0;

              return { ...c, variacao_pct, preco_atual };
            } catch {
              return { ...c, variacao_pct: 0, preco_atual: 0 };
            }
          })
        );
        setCommodities(commoditiesWithData);
      })
      .catch(() => setError("Não foi possível carregar os dados. Verifique sua conexão."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Carregando dados do mercado...</p>
        </div>
        <div className="grid-cards">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card commodity-card" style={{ opacity: 0.4, minHeight: 120 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1>Dashboard</h1>
          <p style={{ color: "var(--danger, #ef4444)" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Acompanhe suas matérias-primas e veja seu status.</p>
      </div>

      <div className="grid-cards">
        {commodities.map((item) => (
          <Link href={`/dashboard/commodity/${item.id_materia_prima}`} key={item.id_materia_prima} className="card commodity-card">
            <div className="commodity-header">
              <h3>{item.nome}</h3>
              <span className={`badge ${item.ativo ? 'good' : 'bad'}`}>
                {item.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="commodity-price-info">
              <div className="commodity-price-block">
                <span className="price">
                  R$ {item.preco_atual ? item.preco_atual.toFixed(2) : '--.--'}
                </span>
                <span className="unit">/ {item.unidade_medida}</span>
              </div>

              <div className="commodity-forecast">
                <span className="forecast-label">Previsão (30d):</span>
                <span className={`forecast-value ${item.variacao_pct > 0 ? 'up' : item.variacao_pct < 0 ? 'down' : 'neutral'}`}>
                  {item.variacao_pct > 0 ? '+' : ''}{item.variacao_pct ?? '--'}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
