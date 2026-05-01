"use client";

import React, { useState, useMemo, useEffect } from "react";
import "./partners.css";
import { 
  IoStorefrontOutline, 
  IoCloseOutline, 
  IoLocationOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoDocumentTextOutline,
  IoMapOutline
} from "react-icons/io5";
import { getEnterprises, Enterprise } from "../../../services/enterprises";
export default function PartnersPage() {
  const [filterType, setFilterType] = useState<string>("Todos");
  const [partners, setPartners] = useState<Enterprise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Enterprise | null>(null);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setIsLoading(true);
        const data = await getEnterprises();
        setPartners(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching enterprises:", err);
        setError("Não foi possível carregar os parceiros. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  // Extract unique commodity types for the filter dropdown
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    partners.forEach(p => p.type.forEach(t => types.add(t)));
    return ["Todos", ...Array.from(types).sort()];
  }, [partners]);

  // Filter partners based on selection
  const filteredPartners = useMemo(() => {
    if (filterType === "Todos") return partners;
    return partners.filter(p => p.type.includes(filterType));
  }, [filterType, partners]);

  const handleOpenModal = (partner: Enterprise) => {
    setSelectedPartner(partner);
  };

  const handleCloseModal = () => {
    setSelectedPartner(null);
  };

  return (
    <div className="partners-container">
      <div className="partners-header">
        <h1>Parceiros</h1>
        <select 
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {allTypes.map(type => (
            <option key={type} value={type}>
              {type === "Todos" ? "Filtrar por Produto (Todos)" : type}
            </option>
          ))}
        </select>
      </div>

      <div className="partners-grid">
        {isLoading ? (
          // Skeleton Loading
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="partner-card" style={{ animation: "pulse 1.5s infinite" }}>
              <div className="partner-card-header">
                <div className="partner-icon" style={{ background: "#e0e0e0", width: "40px", height: "40px", borderRadius: "8px" }}></div>
                <div className="partner-info">
                  <div style={{ background: "#e0e0e0", height: "20px", width: "150px", borderRadius: "4px", marginBottom: "8px" }}></div>
                  <div style={{ background: "#e0e0e0", height: "14px", width: "100px", borderRadius: "4px" }}></div>
                </div>
              </div>
              <div style={{ background: "#e0e0e0", height: "36px", width: "100%", borderRadius: "6px", marginTop: "1rem" }}></div>
            </div>
          ))
        ) : error ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--error-color)' }}>
            {error}
          </div>
        ) : (
          filteredPartners.map(partner => (
            <div key={partner.id} className="partner-card">
              <div className="partner-card-header">
                <div className="partner-icon">
                  <IoStorefrontOutline />
                </div>
                <div className="partner-info">
                  <h3>{partner.enterprise_name}</h3>
                </div>
              </div>
              <button 
                className="btn-details"
                onClick={() => handleOpenModal(partner)}
              >
                Mais detalhes
              </button>
            </div>
          ))
        )}

        {!isLoading && !error && filteredPartners.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Nenhum parceiro encontrado para o filtro selecionado.
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedPartner && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <div className="partner-icon" style={{ background: 'transparent' }}>
                  <IoStorefrontOutline size={24} />
                </div>
                <h2>{selectedPartner.enterprise_name}</h2>
                <span className="status-badge ativo">Ativo</span>
              </div>
              <button className="btn-close" onClick={handleCloseModal}>
                <IoCloseOutline />
              </button>
            </div>

            <div className="modal-body">
              <div className="info-row">
                <IoDocumentTextOutline />
                <div className="info-text">
                  CNPJ: <strong>{selectedPartner.cnpj}</strong>
                </div>
              </div>
              
              <div className="info-row">
                <IoCallOutline />
                <div className="info-text">
                  Telefone: <strong>{selectedPartner.phone}</strong>
                </div>
              </div>

              <div className="info-row">
                <IoLocationOutline />
                <div className="info-text">
                  Endereço: <strong>{selectedPartner.address} CEP {selectedPartner.cep}</strong>
                </div>
              </div>

              <div className="info-row">
                <IoMailOutline />
                <div className="info-text">
                  Email: <strong>{selectedPartner.email}</strong>
                </div>
              </div>

              <div className="info-row">
                <IoStorefrontOutline />
                <div className="info-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  Mercadorias: 
                  {selectedPartner.type.map((t, idx) => (
                    <span key={idx} className="status-badge" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="map-container" style={{ width: '100%', height: '200px', marginTop: '0.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPartner.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={handleCloseModal}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
