"use client";

import { useState, useEffect } from "react";
import { Commodity, getCommodities, createAlert } from "@/services/mockData";
import Link from "next/link";
import "../alerts.css";

export default function NewAlertPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedCommodityId, setSelectedCommodityId] = useState("");
  const [condition, setCondition] = useState("Abaixo");
  const [targetPrice, setTargetPrice] = useState("");
  const [channel, setChannel] = useState("Telegram");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCommodities().then(setCommodities);
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const comm = commodities.find(c => c.id === selectedCommodityId);
    if (!comm) return;

    setIsSubmitting(true);

    let conditionText = "";
    if (condition === "bom") {
      conditionText = "Recomendação mudar para BOM";
    } else {
      conditionText = `Preço ${condition === 'Acima' ? 'subir acima' : 'cair abaixo'} de R$ ${parseFloat(targetPrice).toFixed(2)}`;
    }

    const newAlert = {
      id: Math.random().toString(),
      commodityName: comm.name,
      condition: conditionText,
      channel,
      active: true,
    };

    await createAlert(newAlert);
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form
    setSelectedCommodityId("");
    setTargetPrice("");
    setCondition("Abaixo");
    setChannel("Telegram");
  };

  const handleCreateAnother = () => {
    setIsSuccess(false);
  };

  return (
    <div className="alerts-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="alerts-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="modern-title">Novo Alerta</h1>
          <p className="modern-subtitle">Configure uma nova regra para ser avisado sobre o mercado.</p>
        </div>
        <Link href="/dashboard/alerts" className="btn-modern-action">
          ← Voltar para Alertas
        </Link>
      </div>

      {isSuccess ? (
        <div className="card glass scale-in" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--status-good)' }}>Alerta Criado com Sucesso!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            A regra foi salva e você será notificado assim que a condição for atingida.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={handleCreateAnother} className="btn-modern-action">
              Criar Outro
            </button>
            <Link href="/dashboard/alerts" className="btn-modern-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Ver Meus Alertas
            </Link>
          </div>
        </div>
      ) : (
        <form className="modern-form card glass" onSubmit={handleCreateAlert}>
          <div className="form-section-title">Regras do Alerta</div>
          
          <div className="modern-input-group full-width">
            <label htmlFor="commodity">Matéria-Prima</label>
            <div className="select-wrapper">
              <select 
                id="commodity"
                required 
                value={selectedCommodityId} 
                onChange={e => setSelectedCommodityId(e.target.value)}
              >
                <option value="" disabled>Selecione a commodity</option>
                {commodities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modern-input-group full-width">
            <label htmlFor="condition">Qual a condição?</label>
            <div className="select-wrapper">
              <select 
                id="condition"
                value={condition} 
                onChange={e => setCondition(e.target.value)}
              >
                <option value="Abaixo">Preço cair abaixo de</option>
                <option value="Acima">Preço subir acima de</option>
                <option value="bom">Recomendação da IA mudar para Bom</option>
              </select>
            </div>
          </div>

          {condition !== "bom" && (
            <div className="modern-input-group full-width">
              <label htmlFor="targetPrice">Preço alvo (R$)</label>
              <div className="input-with-icon">
                <span className="icon">R$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  id="targetPrice"
                  required 
                  placeholder="Ex: 50.00" 
                  value={targetPrice}
                  onChange={e => setTargetPrice(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          <div className="modern-input-group full-width">
            <label htmlFor="channel">Receber por</label>
            <div className="select-wrapper">
              <select 
                id="channel"
                value={channel} 
                onChange={e => setChannel(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Telegram">✈️ Telegram (Recomendado)</option>
                <option value="E-mail">📧 E-mail</option>
                <option value="WhatsApp">💬 WhatsApp</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-modern-primary mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Regra"}
          </button>
        </form>
      )}
    </div>
  );
}
