import { getCommodityById } from "@/services/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommodityChart from "@/components/CommodityChart";
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Histórico de Preços (Últimos 3 meses)</h3>
            <span className="badge good" style={{ fontSize: '0.8rem', background: 'rgba(0, 198, 255, 0.1)', color: '#00c6ff', border: '1px solid rgba(0, 198, 255, 0.2)' }}>Gráfico Evolutivo</span>
          </div>
          <CommodityChart data={commodity.history} unit={commodity.unit} />
        </div>
      </div>
    </div>
  );
}
