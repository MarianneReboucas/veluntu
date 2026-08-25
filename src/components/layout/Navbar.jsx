import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, agency, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar" id="navbar">
      <div className="nav-container">
        
        {/* Logo Original */}
        <Link to="/" className="logo-btn" id="logoBtn">
          <span className="logo-text">VELUNTU</span>
          <span className="logo-subtext">TRAVEL DESIGN • ÁFRICA</span>
        </Link>
        
        {/* Menu Principal Original */}
        <nav className={`nav-menu ${mobileOpen ? 'active' : ''}`} id="navMenu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Explorar</Link>
          <Link to="/destinos" className={`nav-link ${location.pathname === '/destinos' ? 'active' : ''}`}>Destinos</Link>
          <Link to="/pacotes" className={`nav-link ${location.pathname === '/pacotes' ? 'active' : ''}`}>Pacotes</Link>
          <Link to="/contato" className={`nav-link ${location.pathname === '/contato' ? 'active' : ''}`}>Contato</Link>
          
          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-link" style={{ color: '#c99738', fontWeight: '700' }}>
              Painel SaaS ({agency?.name?.split(' ')[0] || user?.name})
            </Link>
          ) : (
            <Link to="/login" className="nav-link" style={{ color: '#c99738', fontWeight: '700' }}>
              Administrador
            </Link>
          )}
        </nav>

        {/* CTA Action */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/planejar" className="btn btn-primary btn-sm">
            Comece a Planejar
          </Link>
          
          <button 
            className="mobile-toggle" 
            id="mobileToggle" 
            aria-label="Abrir Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </header>
  );
}
