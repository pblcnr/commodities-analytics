import "./dashboard.css";
import Link from "next/link";
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon-small">C</div>
          <h2>Analytics</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item">
            Dashboard
          </Link>
          <Link href="/dashboard/purchases" className="nav-item">
            Compras
          </Link>
          <Link href="/dashboard/alerts" className="nav-item">
            Alertas
          </Link>
        </nav>

        <div className="sidebar-footer">
          <ThemeToggle />
          <div className="user-profile">
            <div className="user-avatar">US</div>
            <div className="user-info">
              <span className="user-name">Usuário</span>
              <span className="user-role">Comprador</span>
            </div>
          </div>
          <Link href="/" className="logout-btn">
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <header className="mobile-header">
          <div className="logo-icon-small">C</div>
          <h2>Analytics</h2>
          {/* Menu icon placeholder for mobile */}
          <button className="mobile-menu-btn">☰</button>
        </header>
        <div className="content-scrollable">
          {children}
        </div>
      </main>
    </div>
  );
}
