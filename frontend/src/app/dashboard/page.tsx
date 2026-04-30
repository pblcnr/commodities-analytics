"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCommodities, Commodity } from "@/services/commodities";
import "./dashboard-page.css";

function getRecommendationText(rec: string) {
  switch (rec) {
    case "good": return "Bom para Compra";
    case "regular": return "Momento Regular";
    case "bad": return "Aguarde";
    default: return "";
  }
}

export default function DashboardPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCommodities()
      .then(setCommodities)
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
        <p>Acompanhe suas matérias-primas e veja a recomendação de IA.</p>
      </div>

      <div className="grid-cards">
        {commodities.map((item) => (
          <Link href={`/dashboard/commodity/${item.id}`} key={item.id} className="card commodity-card">
            <div className="commodity-header">
              <h3>{item.name}</h3>
              <span className={`badge ${item.recommendation}`}>
                {getRecommendationText(item.recommendation)}
              </span>
            </div>

            <div className="commodity-price-info">
              <span className="price">R$ {item.currentPrice.toFixed(2)}</span>
              <span className="unit">/ {item.unit}</span>
            </div>

            <div className="commodity-forecast">
              <span className="forecast-label">Previsão (30d):</span>
              <span className={`forecast-value ${item.forecastPercent > 0 ? "up" : "down"}`}>
                {item.forecastPercent > 0 ? "+" : ""}{item.forecastPercent}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
