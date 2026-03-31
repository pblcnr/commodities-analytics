import { getCommodityById } from "@/services/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../commodity-detail.css";

// This is necessary since Next 15 Dynamic Route Params are promises.
// Update: Assuming Next 15+ convention where params is awaited or just used directly as Promise in page components.
type Params = Promise<{ id: string }>;

export default async function CommodityDetailPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const commodityId = resolvedParams.id;
  const commodity = await getCommodityById(commodityId);

  if (!commodity) {
    notFound();
  }

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'good': return 'Bom para Compra';
      case 'regular': return 'Momento Regular';
      case 'bad': return 'Aguarde';
      default: return '';
    }
  };

  const isGood = commodity.recommendation === 'good';

  return (
    <div className="commodity-detail">
      <div className="back-link">
        <Link href="/dashboard">← Voltar para Dashboard</Link>
      </div>

      <div className="detail-header">
        <div>
          <h1>{commodity.name}</h1>
          <div className="price-big">R$ {commodity.currentPrice.toFixed(2)} <span className="unit">/ {commodity.unit}</span></div>
        </div>
        <div className="header-actions">
          <Link href="/dashboard/purchases" className="btn-primary">Registrar Compra</Link>
          <Link href="/dashboard/alerts" className="btn-secondary">Criar Alerta</Link>
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
              {commodity.forecastPercent > 0 ? '+' : ''}{commodity.forecastPercent}%
            </div>
            <p className="insight-text">
              {isGood 
                ? `A tendência indica alta de ${commodity.forecastPercent}%. Comprar agora pode representar uma economia significativa, pois os preços devem subir em breve.`
                : commodity.recommendation === 'regular' 
                  ? `O mercado apresenta estabilidade nos próximos 30 dias. A compra pode ser feita de acordo com sua necessidade operacional atual.`
                  : `A tendência é de queda (${commodity.forecastPercent}%). Considere aguardar um momento melhor para efetuar compras grandes, economizando gastos.`
              }
            </p>
          </div>
        </div>

        <div className="card chart-card">
          <h3>Histórico de Preços (Últimos 3 meses)</h3>
          <div className="chart-container">
            {/* Simple CSS-based bar chart for MVP mockup */}
            <div className="bar-chart">
              {commodity.history.map((point, index) => {
                const maxPrice = Math.max(...commodity.history.map(h => h.price)) * 1.1;
                const heightPercent = (point.price / maxPrice) * 100;
                
                return (
                  <div key={index} className="bar-wrapper">
                    <div className="bar">
                      <div className="bar-fill" style={{ height: `${heightPercent}%` }}></div>
                      <div className="bar-tooltip">R$ {point.price.toFixed(2)}</div>
                    </div>
                    <div className="bar-label">{point.date}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
