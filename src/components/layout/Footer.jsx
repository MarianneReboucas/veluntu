import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-col footer-brand">
            <Link to="/" className="logo-btn">
              <span className="logo-text">VELUNTU</span>
              <span className="logo-subtext">TRAVEL DESIGN • ÁFRICA</span>
            </Link>
            <p>Agência de viagens autoral especializada em roteiros sob medida pelo continente africano.</p>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Navegação</h4>
            <ul className="footer-links">
              <li><Link to="/">Explorar</Link></li>
              <li><Link to="/destinos">Destinos</Link></li>
              <li><Link to="/pacotes">Pacotes</Link></li>
              <li><Link to="/planejar">Comece a Planejar</Link></li>
              <li><Link to="/login">Portal da Agência</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Destinos</h4>
            <ul className="footer-links">
              <li><Link to="/destinos">África do Sul</Link></li>
              <li><Link to="/destinos">Egito</Link></li>
              <li><Link to="/destinos">Madagascar</Link></li>
              <li><Link to="/destinos">Tanzânia</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Atendimento</h4>
            <p>Atendimento exclusivo com hora marcada</p>
            <p>contato@veluntu.com.br</p>
            <p>+55 11 99999-8888</p>
          </div>

        </div>

        <div className="footer-bottom text-center">
          <p>© {new Date().getFullYear()} VELUNTU Travel Design. Todos os direitos reservados. Integrado ao Supabase & Vercel.</p>
        </div>
      </div>
    </footer>
  );
}
