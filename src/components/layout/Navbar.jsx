import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, agency, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="navbar" id="navbar">
      <div className="nav-container">
        
        {/* Logo Original */}
        <Link to="/" className="logo-btn" id="logoBtn" onClick={closeMenu}>
          <span className="logo-text">VELUNTU</span>
          <span className="logo-subtext">TRAVEL DESIGN • ÁFRICA</span>
        </Link>
        
        {/* Menu Principal */}
        <nav className={`nav-menu ${mobileOpen ? 'active' : ''}`} id="navMenu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMenu}>Explorar</Link>
          <Link to="/destinos" className={`nav-link ${location.pathname === '/destinos' ? 'active' : ''}`} onClick={closeMenu}>Destinos</Link>
          <Link to="/pacotes" className={`nav-link ${location.pathname === '/pacotes' ? 'active' : ''}`} onClick={closeMenu}>Pacotes</Link>
          <Link to="/contato" className={`nav-link ${location.pathname === '/contato' ? 'active' : ''}`} onClick={closeMenu}>Contato</Link>

          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-link" style={{ color: '#c99738', fontWeight: '700' }} onClick={closeMenu}>
              Admin ({agency?.name?.split(' ')[0] || user?.name})
            </Link>
          ) : (
            <Link to="/login" className="nav-link" style={{ color: '#c99738', fontWeight: '700' }} onClick={closeMenu}>
              Administrador
            </Link>
          )}

          <div className="mobile-menu-cta" style={{ display: 'none', marginTop: '16px', width: '100%' }}>
            <Link to="/planejar" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }} onClick={closeMenu}>
              Comece a Planejar
            </Link>
          </div>
        </nav>

        {/* CTA Action */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/planejar" className="btn btn-primary btn-sm desktop-only-cta">
            Comece a Planejar
          </Link>
          
          <button 
            className={`mobile-toggle ${mobileOpen ? 'open' : ''}`} 
            id="mobileToggle" 
            aria-label="Abrir Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
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
