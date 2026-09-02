import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getAllPackages, getPackagesByDest } from '../../data/packagesStore';

export default function Packages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [travelersCount, setTravelersCount] = useState(2);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const destQuery = searchParams.get('destination') || 'all';
  const [activeTab, setActiveTab] = useState(destQuery);

  const tabs = [
    { id: 'all', label: 'Todos os Destinos' },
    { id: 'África do Sul', label: 'África do Sul' },
    { id: 'Egito', label: 'Egito' },
    { id: 'Madagascar', label: 'Madagascar' },
  ];

  // Sincroniza activeTab quando searchParams mudam
  useEffect(() => {
    const current = searchParams.get('destination') || 'all';
    setActiveTab(current);
  }, [searchParams]);

  // Lê pacotes do store local (que inclui edições do admin) e escuta atualizações
  useEffect(() => {
    const updateList = () => {
      setLoading(true);
      const result = activeTab === 'all' ? getAllPackages() : getPackagesByDest(activeTab);
      setPackages(result);
      setLoading(false);
    };

    updateList();

    window.addEventListener('veluntu_packages_updated', updateList);
    return () => window.removeEventListener('veluntu_packages_updated', updateList);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ destination: tabId });
    }
  };

  return (
    <div>
      {/* Journey Progress Nav */}
      <div className="journey-steps-bar">
        <Link to="/planejar" className="journey-step">1. Planejamento Sob Medida</Link>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step active">2. Pacotes & Roteiros Disponíveis (Atual)</span>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step">3. Definir Mês & Detalhes</span>
      </div>

      {/* Hero Section */}
      <section 
        className="hero packages-hero" 
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,12,0.6), rgba(15,23,12,0.8)), url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1800&q=80')`,
          minHeight: '360px',
        }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <span className="badge">CATÁLOGO EXCLUSIVO VELUNTU</span>
          <h1 className="hero-title" style={{ fontSize: '3.2rem', margin: '8px 0' }}>Roteiros & Pacotes de Viagem</h1>
          <p className="hero-subtitle">
            Selecione o seu roteiro preferido e avance para escolher o mês ideal e suas preferências exclusivas.
          </p>
        </div>
      </section>

      {/* Destination Filter Tabs, Traveler Switcher & Catalog */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main, #FAF8F5)', paddingTop: '40px', paddingBottom: '90px' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            {/* Abas de Destino */}
            <div className="destination-tabs" style={{ marginBottom: 0 }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`dest-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Alternador 2 Pessoas vs 1 Pessoa */}
            <div className="travelers-toggle-bar" style={{ margin: 0 }}>
              <button
                type="button"
                onClick={() => setTravelersCount(2)}
                className={`travelers-toggle-btn ${travelersCount === 2 ? 'active' : ''}`}
              >
                2 Pessoas (Casal / Dupla)
              </button>
              <button
                type="button"
                onClick={() => setTravelersCount(1)}
                className={`travelers-toggle-btn ${travelersCount === 1 ? 'active' : ''}`}
              >
                1 Pessoa (Solo)
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-orange, #CC7A00)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '600' }}>Carregando pacotes exclusivos...</p>
            </div>
          ) : packages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #eaeaea', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#141414', marginBottom: '10px' }}>
                Nenhum pacote encontrado em {activeTab === 'all' ? 'nossos destinos' : activeTab}
              </h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Nosso time de Travel Designers desenha expedições totalmente sob medida para você.
              </p>
              <Link to="/planejar" className="btn btn-primary btn-sm">Criar Roteiro Personalizado</Link>
            </div>
          ) : (
            <div className="packages-full-grid">
              {packages.map((pkg) => {
                const individualPrice = pkg.price || pkg.pricePerPerson || 24000;
                const totalPrice = travelersCount === 2 ? (pkg.priceForTwo || individualPrice * 2) : individualPrice;
                const services = Array.isArray(pkg.included_services) ? pkg.included_services : [];

                return (
                  <article key={pkg.id} className="pkg-full-card">
                    <Link to={`/pacotes/${pkg.id}?travelers=${travelersCount}`} className="pkg-full-img-wrap" style={{ display: 'block' }}>
                      <img src={pkg.image_url} alt={pkg.title} />
                      <span className="pkg-full-badge">{pkg.destination}</span>
                    </Link>

                    <div className="pkg-full-body">
                      <h3 className="pkg-full-title">
                        <Link to={`/pacotes/${pkg.id}?travelers=${travelersCount}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {pkg.title}
                        </Link>
                      </h3>
                      <div className="pkg-full-meta">
                        <span>{pkg.duration_days} dias / {Math.max(1, pkg.duration_days - 1)} noites</span>
                        <span>Até {pkg.max_participants || 8} viajantes</span>
                      </div>

                      {services.length > 0 && (
                        <div className="pkg-full-tags">
                          {services.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="pkg-tag">✓ {s}</span>
                          ))}
                        </div>
                      )}

                      {/* Ajuste de Preço com Destaque para 2 Pessoas */}
                      <div className="pkg-full-footer">
                        <div className="pkg-price-tag">
                          {pkg.currency || 'R$'} {totalPrice.toLocaleString('pt-BR')}
                          <span>
                            {travelersCount === 2
                              ? `Valor total para 2 pessoas (${pkg.currency || 'R$'} ${(totalPrice / 2).toLocaleString('pt-BR')} por pessoa)`
                              : 'Pacote individual para 1 pessoa'}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <Link
                            to={`/planejar?destination=${encodeURIComponent(pkg.destination)}&package=${encodeURIComponent(pkg.title)}&travelers=${travelersCount}`}
                            className="btn btn-primary btn-sm"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Planejar & Escolher Mês &rarr;
                          </Link>
                          
                          <Link
                            to={`/pacotes/${pkg.id}?travelers=${travelersCount}`}
                            className="btn btn-outline btn-sm"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
