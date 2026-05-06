"use client";

import { useState, useEffect } from "react";
import { Commodity, getCommodities } from "@/services/commodities";
import "./orders.css";

export default function OrdersPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedCommodityId, setSelectedCommodityId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    getCommodities().then(setCommodities);
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  // IMPORTANT: normalizar ambos os lados para string para evitar falha silenciosa
  // quando a API retorna id como number mas o <select> sempre envia string.
  const selectedCommodity = commodities.find(
    (c) => String(c.id) === String(selectedCommodityId)
  );
  
  let savings = 0;
  if (selectedCommodity && quantity && pricePaid) {
    // (preco_mercado - preco_pago) * quantidade
    // positivo = economia, negativo = pagou mais caro que o mercado
    savings =
      (selectedCommodity.actual_price - parseFloat(pricePaid)) *
      parseFloat(quantity);
  }

  return (
    <div className="orders-wrapper">
      <div className="orders-header">
        <h1 className="modern-title">Calcular Custo de Compra</h1>
        <p className="modern-subtitle">Descubra sua economia baseada em dados reais de mercado.</p>
      </div>

      <div className="orders-split-layout">
        <form className="modern-form card glass" onSubmit={handleCalculate}>
          <div className="form-section-title">Detalhes da Transação</div>
          
          <div className="modern-input-group full-width">
            <label htmlFor="commodity">Matéria-Prima</label>
            <div className="select-wrapper">
              <select 
                id="commodity" 
                required
                value={selectedCommodityId}
                onChange={(e) => {
                  setSelectedCommodityId(e.target.value);
                  setShowResult(false);
                }}
              >
                <option value="" disabled>Selecione a commodity</option>
                {commodities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-modern">
            <div className="modern-input-group">
              <label htmlFor="quantity">Quantidade (KG)</label>
              <div className="input-with-icon">
                <span className="icon">📦</span>
                <input 
                  type="number" 
                  id="quantity" 
                  min="1" 
                  step="0.01"
                  placeholder="Ex: 500" 
                  required 
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setShowResult(false);
                  }}
                />
              </div>
            </div>
            
            <div className="modern-input-group">
              <label htmlFor="pricePaid">Preço Unitário</label>
              <div className="input-with-icon">
                <span className="icon">R$</span>
                <input 
                  type="number" 
                  id="pricePaid" 
                  min="0" 
                  step="0.01"
                  placeholder="0.00" 
                  required 
                  value={pricePaid}
                  onChange={(e) => {
                    setPricePaid(e.target.value);
                    setShowResult(false);
                  }}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn-modern-primary mt-4">Calcular Compra</button>
        </form>

        <div className="orders-results-area">
          {selectedCommodity ? (
            <div className="reference-card card">
              <div className="ref-label">Referência Atual de Mercado</div>
              <div className="ref-value">
                R$ {selectedCommodity.actual_price.toFixed(2)}
              </div>
              <div className="ref-trend">
                Tendência (30d): 
                <span className={`badge ${selectedCommodity.classification}`}>
                  {selectedCommodity.variation_percentage > 0 ? '+' : ''}{selectedCommodity.variation_percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          ) : (
             <div className="empty-placeholder card">
               Selecione uma matéria-prima para ver os valores de referência
             </div>
          )}

          {showResult && selectedCommodity && (
            <div className={`result-card-modern ${savings >= 0 ? 'good-deal' : 'bad-deal'}`}>
              <div className="result-backdrop"></div>
              <div className="result-content">
                <div className="result-badge">
                  {savings >= 0 ? 'Economia Gerada' : 'Oportunidade Perdida'}
                </div>
                <div className="result-total">
                  R$ {Math.abs(savings).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="result-message">
                  {savings >= 0 
                  ? "Excelente negócio! Você comprou abaixo da média do mercado."
                  : "Sua compra ficou acima da média. Use nossas IA para planejar a próxima."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
