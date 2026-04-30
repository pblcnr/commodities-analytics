"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommodityChart from "@/components/CommodityChart";
import { getCommodityById, Commodity } from "@/services/commodities";
import "../commodity-detail.css";

type Params = Promise<{ id: string }>;

function getRecommendationText(rec: string) {
  switch (rec) {
    case "good": return "Bom para Compra";
    case "regular": return "Momento Regular";
    case "bad": return "Aguarde";
    default: return "";
  }
}

export default function CommodityDetailPage({ params }: { params: Params }) {
  const { id: commodityId } = use(params);
  const [commodity, setCommodity] = useState<Commodity | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    getCommodityById(commodityId)
      .then((data) => {
        if (!data) {
          setNotFoundFlag(true);
        } else {
          setCommodity(data);
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

  const isGood = commodity.recommendation === "good";

  return (
    <div className="commodity-detail">
      <div className="back-link">
        <Link href="/dashboard">← Voltar para Dashboard</Link>
      </div>

      <div className="detail-header">
        <div>
          <h1>{commodity.name}</h1>
          <div className="price-big">
            R$ {commodity.currentPrice.toFixed(2)}{" "}
            <span className="unit">/ {commodity.unit}</span>
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
            <span className={`badge ${commodity.recommendation}`}>
              {getRecommendationText(commodity.recommendation)}
            </span>
          </div>
          <div className="insight-body">
            <div className="forecast-big">
              {commodity.forecastPercent > 0 ? "+" : ""}{commodity.forecastPercent}%
            </div>
            <p className="insight-text">
              {isGood
                ? `A tendência indica alta de ${commodity.forecastPercent}%. Comprar agora pode representar uma economia significativa, pois os preços devem subir em breve.`
                : commodity.recommendation === "regular"
                ? `O mercado apresenta estabilidade nos próximos 30 dias. A compra pode ser feita de acordo com sua necessidade operacional atual.`
                : `A tendência é de queda (${commodity.forecastPercent}%). Considere aguardar um momento melhor para efetuar compras grandes, economizando gastos.`}
            </p>
          </div>
        </div>

        <div className="card chart-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Histórico de Preços (Últimos 3 meses)</h3>
            <span
              className="badge good"
              style={{
                fontSize: "0.8rem",
                background: "rgba(0, 198, 255, 0.1)",
                color: "#00c6ff",
                border: "1px solid rgba(0, 198, 255, 0.2)",
              }}
            >
              Gráfico Evolutivo
            </span>
          </div>
          <CommodityChart data={commodity.history} unit={commodity.unit} />
        </div>
      </div>
    </div>
  );
}
