"use client";

import "./dashboard.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiShoppingCart, 
  FiBell, 
  FiUsers, 
  FiChevronDown, 
  FiMenu 
} from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDockVisible, setIsDockVisible] = useState(true);
  const [user, setUser] = useState<{ name: string; role?: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="dashboard-layout">
      {/* Modern Top Header */}
      <header className="top-header">
        <div className="header-left">
          <h2 className="brand-title">Commodities <span className="brand-highlight">Analytics</span><span className="dot">.</span></h2>
        </div>

        <div className="header-right">
          <ThemeToggle />
          <div className="user-profile">
            <div className="user-avatar">{user ? getInitials(user.name) : "US"}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Usuário"}</span>
              <span className="user-role">{user?.role || "Comprador"}</span>
            </div>
          </div>
          <Link href="/" className="logout-btn" onClick={handleLogout}>
            Sair
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <div className="content-scrollable">
          {children}
        </div>
      </main>

      {/* Floating Dock Navigation */}
      <div className={`floating-dock-container ${isDockVisible ? '' : 'hidden'}`}>
        <nav className="floating-dock">
          <Link href="/dashboard" className={`dock-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <FiHome className="dock-item-icon" />
            <span className="dock-label">Dashboard</span>
          </Link>
          <Link href="/dashboard/purchases" className={`dock-item ${pathname === '/dashboard/purchases' ? 'active' : ''}`}>
            <FiShoppingCart className="dock-item-icon" />
            <span className="dock-label">Compras</span>
          </Link>
          <Link href="/dashboard/alerts" className={`dock-item ${pathname === '/dashboard/alerts' ? 'active' : ''}`}>
            <FiBell className="dock-item-icon" />
            <span className="dock-label">Alertas</span>
          </Link>
          <Link href="/dashboard/partners" className={`dock-item ${pathname === '/dashboard/partners' ? 'active' : ''}`}>
            <FiUsers className="dock-item-icon" />
            <span className="dock-label">Parceiros</span>
          </Link>
        </nav>
      </div>

      {/* Floating Toggle Button */}
      <button 
        className={`floating-toggle-btn ${isDockVisible ? '' : 'menu-hidden'}`}
        onClick={() => setIsDockVisible(!isDockVisible)}
        title={isDockVisible ? "Esconder menu" : "Mostrar menu"}
      >
        {isDockVisible ? <FiChevronDown /> : <FiMenu />}
      </button>
    </div>
  );
}
