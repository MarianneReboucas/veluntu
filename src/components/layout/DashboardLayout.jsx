import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, title, subtitle, action }) {
  const { user, agency, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: '📊' },
    { label: 'Pacotes & Roteiros', path: '/dashboard/pacotes', icon: '📦' },
    { label: 'Reservas & Clientes', path: '/dashboard/reservas', icon: '📅' },
    { label: 'Configurações', path: '/dashboard/configuracoes', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', background: '#070a12', color: '#e2e8f0', display: 'flex', flexDirection: 'row', position: 'relative' }}>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="dashboard-sidebar-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          minWidth: '260px',
          background: '#0c1220',
          borderRight: '1px solid rgba(212,175,55,0.15)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 999,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div>
          {/* Sidebar Header / Logo */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #aa851e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}>
                🧭
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '16px', color: '#FFFFFF', letterSpacing: '2px' }}>VELUNTU</div>
                <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#d4af37', textTransform: 'uppercase', fontWeight: '600' }}>
                  Painel Admin
                </div>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="dashboard-sidebar-close-btn"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
              }}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          {/* Agency Badge */}
          <div style={{ margin: '14px', padding: '12px', borderRadius: '12px', background: '#141d30', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f3e5ab', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                {agency?.name ? agency.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {agency?.name || 'Sua Agência'}
                </div>
                <div style={{ fontSize: '10px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#34d399', borderRadius: '50%', display: 'inline-block' }}></span>
                  Plano {agency?.subscription_plan || 'Starter'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '0 10px', marginTop: '6px' }}>
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    marginBottom: '4px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: active ? '600' : '400',
                    color: active ? '#f3e5ab' : '#94a3b8',
                    background: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #d4af37' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Info */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#0a0e18' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e2a3a', border: '1px solid #2d3a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{user?.name || 'Administrador'}</div>
                <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', borderRadius: '6px', fontSize: '16px', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#f87171'}
              onMouseOut={e => e.currentTarget.style.color = '#64748b'}
            >
              ⬅️
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>

        {/* Top Header Bar */}
        <header className="dashboard-header" style={{
          padding: '16px 24px',
          background: 'rgba(11,16,28,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="dashboard-menu-toggle"
              style={{
                display: 'none',
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '8px',
                color: '#d4af37',
                padding: '8px 10px',
                cursor: 'pointer',
                fontSize: '18px',
              }}
              aria-label="Abrir Menu Admin"
            >
              ☰
            </button>

            <div>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '0.5px' }}>{title}</h1>
              {subtitle && <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>{subtitle}</p>}
            </div>
          </div>

          <div className="dashboard-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/"
              target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}
            >
              🌐 <span>Ver Site</span>
            </Link>
            {action}
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-page-body" style={{ padding: '24px', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
