import Link from "next/link";
import { getCommodities } from "@/services/mockData";
import "./dashboard-page.css";

export default async function DashboardPage() {
  const commodities = await getCommodities();

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'good': return 'Bom para Compra';
      case 'regular': return 'Momento Regular';
      case 'bad': return 'Aguarde';
      default: return '';
    }
  };

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

            <div className={`commodity-forecast`}>
              <span className="forecast-label">Previsão (30d):</span>
              <span className={`forecast-value ${item.forecastPercent > 0 ? 'up' : 'down'}`}>
                {item.forecastPercent > 0 ? '+' : ''}{item.forecastPercent}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
