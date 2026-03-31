import "./login.css";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
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
        <p className="subtitle">Previsões inteligentes de matérias-primas</p>
        
        <form className="login-form" action="/dashboard">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="seu@email.com" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
      </div>
    </main>
  );
}
