"use client";

import { useState, useEffect } from "react";
import { Commodity, getCommodities } from "@/services/mockData";
import "./purchases.css";

export default function PurchasesPage() {
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

  const selectedCommodity = commodities.find(c => c.id === selectedCommodityId);
  
  let savings = 0;
  if (selectedCommodity && quantity && pricePaid) {
    savings = (selectedCommodity.currentPrice - parseFloat(pricePaid)) * parseFloat(quantity);
  }

  return (
    <div className="purchases-wrapper">
      <div className="purchases-header">
        <h1 className="modern-title">Registrar Nova Compra</h1>
        <p className="modern-subtitle">Acompanhe seus custos e descubra sua economia baseada em dados reais de mercado.</p>
      </div>

      <div className="purchases-split-layout">
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
              <label htmlFor="quantity">Quantidade</label>
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

          <div className="modern-input-group full-width">
            <label htmlFor="date">Data da Compra</label>
            <input 
              type="date" 
              id="date" 
              defaultValue={new Date().toISOString().split('T')[0]} 
              required 
            />
          </div>

          <button type="submit" className="btn-modern-primary mt-4">Simular Economia</button>
        </form>

        <div className="purchases-results-area">
          {selectedCommodity ? (
            <div className="reference-card card">
              <div className="ref-label">Referência Atual de Mercado</div>
              <div className="ref-value">
                R$ {selectedCommodity.currentPrice.toFixed(2)}
                <span className="ref-unit"> / {selectedCommodity.unit}</span>
              </div>
              <div className="ref-trend">
                Tendência (30d): 
                <span className={`badge ${selectedCommodity.recommendation}`}>
                  {selectedCommodity.forecastPercent > 0 ? '+' : ''}{selectedCommodity.forecastPercent}%
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
