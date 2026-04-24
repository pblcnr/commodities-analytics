"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../login.css"; // Reaproveita os estilos do login
import ThemeToggle from "@/components/ThemeToggle";
import { register } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      
      // Após registrar com sucesso, redireciona para o login
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer registro. Verifique os dados fornecidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <ThemeToggle />
      </div>
      <div className="login-card glass">
        <div className="logo">
          <div className="logo-icon">C</div>
          <h1>Commodities Analytics</h1>
        </div>
        <p className="subtitle">Crie sua conta</p>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Seu nome completo" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="seu@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
          Já possui conta? <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Faça login</Link>
        </div>
      </div>
    </main>
  );
}
