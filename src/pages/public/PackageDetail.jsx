import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { getPackageById, getAllPackages } from '../../data/packagesStore';

export default function PackageDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialTravelers = parseInt(searchParams.get('travelers')) || 2;
  const [travelers, setTravelers] = useState(initialTravelers);
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updatePkg = () => {
      const found = getPackageById(id) || getAllPackages().find((p) => p.id === id) || getAllPackages()[0];
      setPkg(found);
      setLoading(false);
    };

    updatePkg();
    window.addEventListener('veluntu_packages_updated', updatePkg);
    return () => window.removeEventListener('veluntu_packages_updated', updatePkg);
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', background: 'var(--bg-main)' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#17320B' }}>Carregando detalhes do roteiro...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 20px', background: 'var(--bg-main)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', marginBottom: '16px' }}>Pacote não encontrado</h2>
        <Link to="/pacotes" className="btn btn-primary btn-sm">Ver Todos os Pacotes</Link>
      </div>
    );
  }

  const individualPrice = pkg.price || pkg.pricePerPerson || 24000;
  const totalPairPrice = pkg.priceForTwo || individualPrice * 2;
  const calculatedPrice = travelers === 2 ? totalPairPrice : individualPrice * travelers;
  const services = Array.isArray(pkg.included_services) ? pkg.included_services : [];

  return (
    <div>
      {/* Journey Progress Nav */}
      <div className="journey-steps-bar">
        <Link to="/destinos" className="journey-step">1. Destinos</Link>
        <span className="journey-step-sep">&rarr;</span>
        <Link to={`/pacotes?destination=${encodeURIComponent(pkg.destination)}`} className="journey-step">2. Pacotes em {pkg.destination}</Link>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step active">3. Detalhes: {pkg.title}</span>
      </div>

      {/* Hero Section */}
      <section 
        className="hero" 
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,12,0.45), rgba(15,23,12,0.75)), url('${pkg.image_url}')`,
          minHeight: '440px',
        }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <span className="badge">ROTEIRO EXCLUSIVO VELUNTU</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', margin: '8px 0' }}>{pkg.title}</h1>
          <p className="hero-subtitle">
            {pkg.destination} • {pkg.duration_days} dias e {Math.max(1, pkg.duration_days - 1)} noites de imersão de alto padrão
          </p>
        </div>
      </section>

      {/* Detalhes do Roteiro */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main, #FAF8F5)', paddingTop: '50px', paddingBottom: '90px' }}>
        <div className="container">
          
          <div className="detail-layout">
            
            {/* Coluna Principal: Descrição e Itens */}
            <div>
              <div className="detail-content-card">
                <span className="section-tag">SOBRE ESTA EXPEDIÇÃO</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '2rem', marginBottom: '18px' }}>
                  A Experiência Completa
                </h2>
                
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', marginBottom: '28px' }}>
                  {pkg.description}
                </p>

                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '1.35rem', marginBottom: '16px' }}>
                  Serviços e Exclusividades Inclusas
                </h3>

                <div className="detail-included-grid">
                  {services.map((item, idx) => (
                    <div key={idx} className="detail-inc-item">
                      <span className="inc-check">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '36px', padding: '24px', background: '#F4F7F2', borderRadius: '12px', borderLeft: '4px solid #c99738' }}>
                  <h4 style={{ color: '#17320B', margin: '0 0 8px', fontSize: '1.1rem' }}>Personalização Total do Roteiro</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', lineHeight: '1.6' }}>
                    Todos os nossos pacotes podem ser ajustados com noites extras, alteração de lodges, adição de voos panorâmicos e passeios privativos sob consulta.
                  </p>
                </div>
              </div>
            </div>

            {/* Ficha Técnica e Bloco de Destaque de Preço */}
            <div>
              <div className="detail-spec-card">
                <h3 style={{ fontFamily: 'var(--font-heading)', color: '#141414', fontSize: '1.5rem', marginBottom: '20px' }}>
                  Especificações da Viagem
                </h3>

                <div className="spec-item">
                  <span className="spec-icon">✦</span>
                  <div className="spec-content">
                    <strong>Destino Principal</strong>
                    <span>{pkg.destination}</span>
                  </div>
                </div>

                <div className="spec-item">
                  <span className="spec-icon">✦</span>
                  <div className="spec-content">
                    <strong>Duração da Expedição</strong>
                    <span>{pkg.duration_days} dias / {Math.max(1, pkg.duration_days - 1)} noites</span>
                  </div>
                </div>

                <div className="spec-item">
                  <span className="spec-icon">✦</span>
                  <div className="spec-content">
                    <strong>Tamanho do Grupo</strong>
                    <span>Até {pkg.max_participants || 8} pessoas (Privativo)</span>
                  </div>
                </div>

                <div className="spec-item">
                  <span className="spec-icon">✦</span>
                  <div className="spec-content">
                    <strong>Inclusões VIP</strong>
                    <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      {services.length > 0 ? services.join(' • ') : 'Hospedagens de luxo 5 estrelas, guias especializados e traslados privativos inclusos.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco de Destaque com Alternador de Preço */}
              <div className="detail-cta-card">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#c99738', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Simulação de Cotação
                  </span>
                  <div className="travelers-toggle-bar" style={{ margin: 0, background: 'rgba(255,255,255,0.1)' }}>
                    <button
                      type="button"
                      onClick={() => setTravelers(2)}
                      className={`travelers-toggle-btn ${travelers === 2 ? 'active' : ''}`}
                      style={{ color: travelers === 2 ? '#17320B' : '#FFF', background: travelers === 2 ? '#c99738' : 'transparent' }}
                    >
                      2 Pessoas (Casal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTravelers(1)}
                      className={`travelers-toggle-btn ${travelers === 1 ? 'active' : ''}`}
                      style={{ color: travelers === 1 ? '#17320B' : '#FFF', background: travelers === 1 ? '#c99738' : 'transparent' }}
                    >
                      1 Pessoa (Solo)
                    </button>
                  </div>
                </div>

                <div className="detail-price-box">
                  <h4>{travelers === 2 ? 'Valor Total do Pacote (Para 2 Pessoas)' : 'Valor Individual (1 Pessoa)'}</h4>
                  <div className="detail-price-val">
                    {pkg.currency || 'R$'} {calculatedPrice.toLocaleString('pt-BR')}
                  </div>
                  <span className="detail-price-hint">
                    {travelers === 2
                      ? `Equivalente a ${pkg.currency || 'R$'} ${(calculatedPrice / 2).toLocaleString('pt-BR')} por pessoa com acomodação dupla`
                      : 'Acomodação privativa com concierge'}
                  </span>
                </div>

                <Link
                  to={`/planejar?destination=${encodeURIComponent(pkg.destination)}&package=${encodeURIComponent(pkg.title)}&travelers=${travelers}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '15px', textAlign: 'center', marginBottom: '12px' }}
                >
                  Planejar & Escolher Mês &rarr;
                </Link>

                <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Garantia de atendimento de concierge Veluntu 24/7
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
