import React from 'react';
import { Link } from 'react-router-dom';

export default function Destinations() {
  const destinations = [
    {
      id: 'africadosul',
      title: 'África do Sul',
      badge: 'Safári & Vinhedos',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      description: 'Encontros com a vida selvagem no Kruger, degustações em adegas históricas e a beleza cosmopolita de Cape Town.',
      highlights: [
        'Lodges Privativos na Savana',
        'Rota dos Vinhos em Franschhoek',
        'Praias e Montanha da Mesa'
      ],
      filter: 'África do Sul'
    },
    {
      id: 'egito',
      title: 'Egito',
      badge: 'História & Navegação',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      description: 'Cruzeiros privativos pelo Rio Nilo, pirâmides milenares e acesso exclusivo a templos acompanhado de egiptólogos.',
      highlights: [
        'Navegação Dahabiya no Nilo',
        'Templos de Luxor e Aswan',
        'Mar Vermelho e Oásis'
      ],
      filter: 'Egito'
    },
    {
      id: 'madagascar',
      title: 'Madagascar',
      badge: 'Natureza Rara',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      description: 'A magia da Alameda dos Baobás, santuários de lêmures e praias intocadas de águas cristalinas em Nosy Be.',
      highlights: [
        'Alameda dos Baobás Milenares',
        'Expedições na Vida Selvagem',
        'Resort Privativo em Nosy Be'
      ],
      filter: 'Madagascar'
    },
  ];

  return (
    <div>
      {/* Journey Progress Nav */}
      <div className="journey-steps-bar">
        <Link to="/planejar" className="journey-step done">1. Comece a Planejar ✓</Link>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step active">2. Destinos (Atual)</span>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step">3. Pacotes de Viagem</span>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step">4. Detalhes do Pacote</span>
        <span className="journey-step-sep">&rarr;</span>
        <span className="journey-step">5. Fale com a Veluntu</span>
      </div>

      {/* Hero Section */}
      <section 
        className="hero" 
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,12,0.55), rgba(15,23,12,0.7)), url('https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1800&q=80')`,
          minHeight: '420px',
          height: '50vh'
        }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <span className="badge">CURADORIA DE DESTINOS</span>
          <h1 className="hero-title" style={{ fontSize: '3.4rem' }}>Escolha Seu Destino Africano</h1>
          <p className="hero-subtitle">Selecione o cenário da sua próxima jornada para descobrir os roteiros disponíveis.</p>
        </div>
      </section>

      {/* Grid de Destinos */}
      <section className="section destinos-section" id="destinos">
        <div className="container">
          
          <div className="preferences-bar">
            <p><strong>Dica da Curadoria:</strong> Você pode combinar múltiplos países em um único roteiro privativo.</p>
            <Link to="/planejar" className="btn btn-outline btn-sm">Refazer Planejador &rarr;</Link>
          </div>

          <div className="destinos-grid">
            {destinations.map((dest) => (
              <article key={dest.id} className="destino-card">
                <Link to={`/pacotes?destination=${encodeURIComponent(dest.filter)}`} className="destino-img-wrapper" style={{ display: 'block' }}>
                  <img src={dest.image} alt={dest.title} loading="lazy" />
                  <span className="destino-badge">{dest.badge}</span>
                </Link>
                <div className="destino-body">
                  <h3 className="destino-title">
                    <Link to={`/pacotes?destination=${encodeURIComponent(dest.filter)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {dest.title}
                    </Link>
                  </h3>
                  <p className="destino-text">{dest.description}</p>
                  <div className="destino-highlights">
                    {dest.highlights.map((h, i) => (
                      <span key={i}><i className="icon">✦</i> {h}</span>
                    ))}
                  </div>
                  <Link to={`/pacotes?destination=${encodeURIComponent(dest.filter)}`} className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                    Ver Pacotes de {dest.title} &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
