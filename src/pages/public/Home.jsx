import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function Home() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const res = await api.getPublicPackages();
        if (res.success && res.data) {
          setPackages(res.data);
        }
      } catch (e) {
        console.error('Erro ao carregar pacotes:', e);
      }
    };
    fetchPublicData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <span className="badge">AGÊNCIA ESPECIALISTA EM ÁFRICA</span>
          <h1 className="hero-title">Sua próxima grande expedição pela África</h1>
          <p className="hero-subtitle">
            Desenhamos roteiros exclusivos e privativos pela África do Sul, Egito e Madagascar. Viva jornadas inesquecíveis criadas sob medida para o seu estilo.
          </p>
          <div className="hero-cta-group">
            <Link to="/destinos" className="btn btn-outline">Explorar destinos</Link>
            <Link to="/planejar" className="btn btn-primary">Comece a Planejar</Link>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Descubra a experiência</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Destinos em Destaque Section */}
      <section className="section destinos-section" id="destinos">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">CURADORIA DE VIAGENS</span>
            <h2 className="section-title">Destinos em Destaque</h2>
            <p className="section-description">Selecione o cenário da sua próxima jornada pelo continente africano.</p>
          </div>

          <div className="destinos-grid">
            {/* África do Sul */}
            <article className="destino-card">
              <div className="destino-img-wrapper">
                <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80" alt="África do Sul - Safári e Savana" loading="lazy" />
                <span className="destino-badge">Safári &amp; Vinhedos</span>
              </div>
              <div className="destino-body">
                <h3 className="destino-title">África do Sul</h3>
                <p className="destino-text">Encontros com a vida selvagem no Kruger, degustações em adegas históricas e a beleza cosmopolita de Cape Town.</p>
                <div className="destino-highlights">
                  <span><i className="icon">✦</i> Lodges Privativos na Savana</span>
                  <span><i className="icon">✦</i> Rota dos Vinhos em Franschhoek</span>
                  <span><i className="icon">✦</i> Praias e Montanha da Mesa</span>
                </div>
                <Link to="/destinos" className="btn-link">Explorar África do Sul &rarr;</Link>
              </div>
            </article>

            {/* Egito */}
            <article className="destino-card">
              <div className="destino-img-wrapper">
                <img src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80" alt="Egito - Pirâmides de Gizé" loading="lazy" />
                <span className="destino-badge">História &amp; Navegação</span>
              </div>
              <div className="destino-body">
                <h3 className="destino-title">Egito</h3>
                <p className="destino-text">Cruzeiros privativos pelo Rio Nilo, pirâmides milenares e acesso exclusivo a templos acompanhado de egiptólogos.</p>
                <div className="destino-highlights">
                  <span><i className="icon">✦</i> Navegação Dahabiya no Nilo</span>
                  <span><i className="icon">✦</i> Templos de Luxor e Aswan</span>
                  <span><i className="icon">✦</i> Mar Vermelho e Oásis</span>
                </div>
                <Link to="/destinos" className="btn-link">Explorar Egito &rarr;</Link>
              </div>
            </article>

            {/* Madagascar */}
            <article className="destino-card">
              <div className="destino-img-wrapper">
                <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80" alt="Madagascar - Baobás e Praias" loading="lazy" />
                <span className="destino-badge">Natureza Rara</span>
              </div>
              <div className="destino-body">
                <h3 className="destino-title">Madagascar</h3>
                <p className="destino-text">A magia da Alameda dos Baobás, santuários de lêmures e praias intocadas de águas cristalinas em Nosy Be.</p>
                <div className="destino-highlights">
                  <span><i className="icon">✦</i> Alameda dos Baobás Milenares</span>
                  <span><i className="icon">✦</i> Expedições na Vida Selvagem</span>
                  <span><i className="icon">✦</i> Resort Privativo em Nosy Be</span>
                </div>
                <Link to="/destinos" className="btn-link">Explorar Madagascar &rarr;</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Experiências - Azul Secundário #283346 */}
      <section className="section experiencias-section" id="experiencias">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag light">EXPERIÊNCIAS NOBRES</span>
            <h2 className="section-title light">Estilos de Expedição</h2>
            <p className="section-description" style={{ color: 'rgba(250, 248, 245, 0.8)' }}>
              Curadorias exclusivas divididas por estilo de vivência no continente.
            </p>
          </div>

          <div className="exp-categories-grid">
            <div className="exp-cat-card">
              <div className="exp-cat-img">
                <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80" alt="Safáris de Luxo" />
              </div>
              <div className="exp-cat-content">
                <span className="exp-cat-badge">01. VIDA SELVAGEM</span>
                <h3 className="exp-cat-title">Safáris Privativos</h3>
                <p className="exp-cat-desc">Lodges 5 estrelas em reservas privadas com rangers dedicados e safáris de balão.</p>
                <Link to="/pacotes" className="btn-link-white">Ver Roteiros &rarr;</Link>
              </div>
            </div>

            <div className="exp-cat-card">
              <div className="exp-cat-img">
                <img src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80" alt="História do Egito" />
              </div>
              <div className="exp-cat-content">
                <span className="exp-cat-badge">02. CIVILIZAÇÃO</span>
                <h3 className="exp-cat-title">História &amp; O Nilo</h3>
                <p className="exp-cat-desc">Cruzeiros em Dahabiyas privativas com egiptólogos renomados e acesso exclusivo a tumbas.</p>
                <Link to="/pacotes" className="btn-link-white">Ver Roteiros &rarr;</Link>
              </div>
            </div>

            <div className="exp-cat-card">
              <div className="exp-cat-img">
                <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="Vinhos e Gastronomia" />
              </div>
              <div className="exp-cat-content">
                <span className="exp-cat-badge">03. GASTRONOMIA</span>
                <h3 className="exp-cat-title">Cape Winelands</h3>
                <p className="exp-cat-desc">Degustações privadas em vinícolas centenárias e jantares harmonizados em Stellenbosch.</p>
                <Link to="/pacotes" className="btn-link-white">Ver Roteiros &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais da Veluntu Section */}
      <section className="section diferenciais-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">DIFERENCIAIS VELUNTU</span>
            <h2 className="section-title">Por Que Viajar Conosco</h2>
            <p className="section-description">Desenhamos expedições pensadas em cada detalhe para que sua viagem seja perfeita.</p>
          </div>

          <div className="diferenciais-grid">
            <div className="dif-item">
              <div className="dif-symbol">✦</div>
              <h4>Roteiros 100% Personalizados</h4>
              <p>Não trabalhamos com pacotes padronizados genéricos. Sua viagem é desenhada sob medida conforme suas preferências, ritmo e desejos.</p>
            </div>
            <div className="dif-item">
              <div className="dif-symbol">✦</div>
              <h4>Especialistas no Continente</h4>
              <p>Nossa equipe vivencia a África de perto. Recomendamos os melhores lodges, guias locais e momentos inesquecíveis.</p>
            </div>
            <div className="dif-item">
              <div className="dif-symbol">✦</div>
              <h4>Suporte &amp; Concierge 24/7</h4>
              <p>Acompanhamento dedicado do início ao fim da sua viagem para garantir total tranquilidade, segurança e exclusividade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Agência Section */}
      <section className="section sobre-section" id="sobre">
        <div className="container">
          <div className="sobre-grid">
            <div className="sobre-content">
              <span className="section-tag">SOBRE A VELUNTU</span>
              <h2 className="section-title">Agência Especialista em Travel Design Africano</h2>
              <p>A VELUNTU é uma agência de viagens especializada em transformar sonhos de exploração pelo continente africano em roteiros perfeitamente executados.</p>
              <p>Acreditamos que viajar para a África é uma experiência visceral e inesquecível. Por isso, combinamos curadoria exigente, hospedagens de alta categoria e logística segura para entregar viagens memoráveis na África do Sul, Egito e Madagascar.</p>
              <div style={{ marginTop: '25px' }}>
                <Link to="/planejar" className="btn btn-primary">Comece a Planejar Sua Viagem &rarr;</Link>
              </div>
            </div>
            <div className="sobre-img-container">
              <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80" alt="Veluntu Travel Design África" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box Final */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box text-center">
            <span className="section-tag light">COMECE SEU PLANEJAMENTO</span>
            <h2 className="section-title light">Pronto para viver a sua grande expedição?</h2>
            <p style={{ color: 'rgba(250, 248, 245, 0.85)', margin: '20px auto 35px', maxWidth: '600px' }}>
              Envie suas preferências de viagem e receba um projeto de roteiro personalizado elaborado pelos nossos consultores especialistas.
            </p>
            <div>
              <Link to="/planejar" className="btn btn-primary btn-lg">Solicitar Proposta Sob Medida</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
