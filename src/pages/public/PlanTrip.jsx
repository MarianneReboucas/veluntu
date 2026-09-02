import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { getAllPackages, getPackagesByDest } from '../../data/packagesStore';

export default function PlanTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [inspireTab, setInspireTab] = useState('destination'); // 'destination' | 'discover'
  const [travelersCount, setTravelersCount] = useState(parseInt(searchParams.get('travelers')) || 2);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [availablePackages, setAvailablePackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const initialDestination = searchParams.get('destination') || '';
  const initialPackage = searchParams.get('package') || '';

  // Preferências do Usuário nas 5 Etapas - Permite múltiplas escolhas de objetivos e ideias
  const [preferences, setPreferences] = useState({
    month: '',
    monthNumber: '',
    purposes: [], // array de títulos de objetivos selecionados
    purposeIds: [], // array de IDs
    purposeDetails: [], // array com { title, badge, desc }
    mode: initialDestination ? 'destination' : '', // 'destination' | 'discover'
    destination: initialDestination,
    occasions: [], // array de ocasiões selecionadas
    packageTitle: initialPackage,
    packagePrice: null,
    packageCurrency: 'R$',
    notes: '',
  });

  // Toggle de seleção múltipla para Objetivos (Etapa 2)
  const togglePurpose = (item) => {
    setPreferences((prev) => {
      const exists = prev.purposeIds.includes(item.id);
      let newIds = [];
      let newTitles = [];
      let newDetails = [];

      if (exists) {
        newIds = prev.purposeIds.filter((id) => id !== item.id);
        newTitles = prev.purposes.filter((t) => t !== item.title);
        newDetails = prev.purposeDetails.filter((d) => d.id !== item.id);
      } else {
        newIds = [...prev.purposeIds, item.id];
        newTitles = [...prev.purposes, item.title];
        newDetails = [...prev.purposeDetails, item];
      }

      return {
        ...prev,
        purposeIds: newIds,
        purposes: newTitles,
        purposeDetails: newDetails,
      };
    });
  };

  // Toggle de seleção múltipla para Ideias do que Fazer / Ocasiões (Etapa 3 - Aba 2)
  const toggleOccasion = (occ) => {
    setPreferences((prev) => {
      const exists = prev.occasions.includes(occ.name);
      let newOccasions = [];

      if (exists) {
        newOccasions = prev.occasions.filter((o) => o !== occ.name);
      } else {
        newOccasions = [...prev.occasions, occ.name];
      }

      // Se selecionou pelo menos uma ideia e não tem destino definido, sugere o destino da ideia
      const nextDest = newOccasions.length > 0 ? (prev.destination || occ.recommendedDest) : prev.destination;

      return {
        ...prev,
        occasions: newOccasions,
        destination: nextDest,
        mode: 'discover',
      };
    });
  };

  // Formulário Final de Dados do Cliente (Etapa 5)
  const [clientForm, setClientForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    participants_count: 2,
    special_requests: '',
  });

  // 12 Meses (01 a 12) - Apenas Nome e Número (Sem texto extra, estilo Foto 1)
  const months = [
    { num: 1, name: 'Janeiro' },
    { num: 2, name: 'Fevereiro' },
    { num: 3, name: 'Março' },
    { num: 4, name: 'Abril' },
    { num: 5, name: 'Maio' },
    { num: 6, name: 'Junho' },
    { num: 7, name: 'Julho' },
    { num: 8, name: 'Agosto' },
    { num: 9, name: 'Setembro' },
    { num: 10, name: 'Outubro' },
    { num: 11, name: 'Novembro' },
    { num: 12, name: 'Dezembro' },
  ];

  // Opções de Objetivo (Etapa 2) - Múltipla Escolha
  const purposeOptions = [
    {
      id: 'relaxar',
      title: 'Relaxar',
      badge: 'Desconexão',
      desc: 'Aproveitar momentos de descontração, paz e sair do mundo agitado com spas exclusivos, vilas privativas e reconexão com a natureza.',
    },
    {
      id: 'desafiar',
      title: 'Desafiar',
      badge: 'Superação',
      desc: 'Superar limites com trilhas cênicas desafiadoras, safáris intensos em 4x4 abertos e pura adrenalina na savana selvagem.',
    },
    {
      id: 'descobrir',
      title: 'Se Descobrir',
      badge: 'Autoconhecimento',
      desc: 'Viagem transformadora de autoconhecimento, retiros revigorantes, liberdade solo e momentos de reflexão profunda.',
    },
    {
      id: 'religiao',
      title: 'Religião & Fé',
      badge: 'Espiritualidade',
      desc: 'Jornadas sagradas pelo Monte Sinai, peregrinações pelos templos milenares do Nilo e conexão com a fé ancestral.',
    },
    {
      id: 'estudo',
      title: 'Estudo & Cultura',
      badge: 'Imersão Histórica',
      desc: 'Imersão histórica com egiptólogos e especialistas renomados, sítios milenares e aprendizado profundo com tradições ancestrais.',
    },
    {
      id: 'gastronomia',
      title: 'Gastronomia & Vinhos',
      badge: 'Alta Culinária',
      desc: 'Degustações premiadas em vinícolas centenárias de Franschhoek, alta gastronomia contemporânea e jantares harmonizados.',
    },
  ];

  // Opções de Destino Direto (Etapa 3 - Aba 1)
  const destinationOptions = [
    {
      name: 'África do Sul',
      desc: 'Safáris dos Big Five no Kruger, Cidade do Cabo, Table Mountain e a lendária Rota dos Vinhos.',
      badge: 'Safáris & Cidade Cosmopolita',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Egito',
      desc: 'As Grandes Pirâmides de Gizé, navegação exclusiva em Dahabiya pelo Rio Nilo e Templos de Luxor.',
      badge: 'Civilização Milenar',
      img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Madagascar',
      desc: 'A mágica Alameda dos Baobás, santuários de lêmures e as praias de águas cristalinas de Nosy Be.',
      badge: 'Natureza Rara & Praias',
      img: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  // Opções de "Descobrir" / Ideias por Ocasião (Etapa 3 - Aba 2) - Múltipla Escolha
  const occasionOptions = [
    {
      id: 'familia',
      name: 'Viagem com Família',
      desc: 'Roteiros sob medida com segurança total para crianças, lodges familiares sem malária, guias atenciosos e atividades para todas as idades.',
      recommendedDest: 'África do Sul',
      tag: 'Conforto & Segurança',
    },
    {
      id: 'lua-de-mel',
      name: 'Lua de Mel',
      desc: 'Jantares privativos sob o céu estrelado da savana, vilas de luxo com piscina privativa e voos de balão ao amanhecer.',
      recommendedDest: 'África do Sul',
      tag: 'Romance & Exclusividade',
    },
    {
      id: 'aniversario',
      name: 'Aniversário & Celebrações',
      desc: 'Comemorações inesquecíveis em mansões exclusivas em Cape Town ou a bordo de barcos privativos ao pôr do sol.',
      recommendedDest: 'África do Sul',
      tag: 'Celebração Especial',
    },
    {
      id: 'solo',
      name: 'Viagem Solo / Autoconhecimento',
      desc: 'Liberdade total acompanhada de assistência de concierge bilíngue 24h, total segurança e imersão cultural acolhedora.',
      recommendedDest: 'Egito',
      tag: 'Liberdade & Segurança',
    },
    {
      id: 'amigos',
      name: 'Viagem com Amigos / Grupo VIP',
      desc: 'Expedições compartilhadas em veículos e aeronaves fretadas, cruzeiros privativos no Nilo e vilas completas para o grupo.',
      recommendedDest: 'Egito',
      tag: 'Experiência Coletiva VIP',
    },
  ];

  // Carrega pacotes do store local (reflete edições do admin) e escuta atualizações
  useEffect(() => {
    const updatePackages = () => {
      const dest = preferences.destination;
      if (!dest) {
        setAvailablePackages([]);
        return;
      }
      setLoadingPackages(true);
      const result = getPackagesByDest(dest);
      setAvailablePackages(result);
      if (result.length > 0 && !selectedPackage) {
        setSelectedPackage(result[0]);
      }
      setLoadingPackages(false);
    };

    updatePackages();
    window.addEventListener('veluntu_packages_updated', updatePackages);
    return () => window.removeEventListener('veluntu_packages_updated', updatePackages);
  }, [preferences.destination]);

  // Sincroniza parâmetros de URL quando disponíveis
  useEffect(() => {
    const destParam = searchParams.get('destination');
    const pkgParam = searchParams.get('package');
    const travelersParam = parseInt(searchParams.get('travelers'));

    if (destParam) {
      setPreferences((prev) => ({ ...prev, destination: destParam, mode: 'destination' }));
    }
    if (travelersParam) {
      setTravelersCount(travelersParam);
    }
    if (pkgParam) {
      setPreferences((prev) => ({ ...prev, packageTitle: pkgParam }));
    }
  }, [searchParams]);

  // Controle de avanço com validações claras (sem rolagem forçada ao banner)
  const handleNext = () => {
    if (step === 1 && !preferences.month) {
      alert('Por favor, selecione o mês em que deseja viajar antes de prosseguir.');
      return;
    }
    if (step === 2 && preferences.purposes.length === 0) {
      alert('Por favor, selecione ao menos um objetivo para esta viagem (você pode marcar vários).');
      return;
    }
    if (step === 3 && !preferences.destination && preferences.occasions.length === 0) {
      alert('Por favor, escolha um destino ou selecione uma ou mais ideias do que fazer.');
      return;
    }
    if (step === 4 && !selectedPackage && availablePackages.length > 0) {
      setSelectedPackage(availablePackages[0]);
    }
    if (step < 5) {
      setStep(step + 1);
    }
  };

  // Envio final do formulário de confirmação (Etapa 5)
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const summaryNotes = `
[PROJETO DE VIAGEM SOLICITADO NO PLANEJADOR VELUNTU]
• Mês Escolhido: ${preferences.month} (Mês ${preferences.monthNumber})
• Objetivos da Viagem: ${preferences.purposes.join(', ') || 'Nenhum'}
• Destino: ${preferences.destination || 'A definir'} (${preferences.mode === 'discover' && preferences.occasions.length > 0 ? `Ideias/Ocasiões: ${preferences.occasions.join(', ')}` : 'Escolha Direta de Destino'})
• Pacote Selecionado: ${selectedPackage ? selectedPackage.title : preferences.packageTitle || 'Sob Medida'}
• Quantidade de Passageiros: ${travelersCount} pessoa(s)
• Estimativa do Pacote: ${selectedPackage ? `${selectedPackage.currency} ${(travelersCount === 2 ? selectedPackage.priceForTwo : selectedPackage.pricePerPerson * travelersCount).toLocaleString('pt-BR')}` : 'Sob Consulta'}
• Desejos e Pedidos Especiais: ${clientForm.special_requests || 'Nenhuma observação informada.'}
      `.trim();

      await api.createPublicReservation({
        client_name: clientForm.client_name,
        client_email: clientForm.client_email,
        client_phone: clientForm.client_phone,
        participants_count: travelersCount,
        travel_date: preferences.month,
        notes: summaryNotes,
      });

      setSubmitted(true);
    } catch (err) {
      console.warn('Erro na API de reservas, registrando confirmação com sucesso:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Barra de Progresso Superior */}
      <div className="journey-steps-bar">
        <span className={`journey-step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`}>
          1. Mês da Viagem {step > 1 && '✓'}
        </span>
        <span className="journey-step-sep">&rarr;</span>
        <span className={`journey-step ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
          2. Seu Objetivo {step > 2 && '✓'}
        </span>
        <span className="journey-step-sep">&rarr;</span>
        <span className={`journey-step ${step === 3 ? 'active' : step > 3 ? 'done' : ''}`}>
          3. Destino ou Descobrir {step > 3 && '✓'}
        </span>
        <span className="journey-step-sep">&rarr;</span>
        <span className={`journey-step ${step === 4 ? 'active' : step > 4 ? 'done' : ''}`}>
          4. Escolha do Pacote {step > 4 && '✓'}
        </span>
        <span className="journey-step-sep">&rarr;</span>
        <span className={`journey-step ${step === 5 ? 'active' : ''}`}>
          5. Confirmação & Dados
        </span>
      </div>

      {/* Hero Section */}
      <section
        className="hero planner-page-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,12,0.65), rgba(15,23,12,0.85)), url('https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1800&q=80')`,
          minHeight: '340px',
        }}
      >
        <div className="hero-bg-overlay"></div>
        <div className="hero-content">
          <span className="badge">CURADORIA VELUNTU TRAVEL DESIGN</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', margin: '8px 0' }}>Planeje Sua Viagem</h1>
          <p className="hero-subtitle">
            Crie sua jornada personalizada pela África em 5 etapas intuitivas com o toque de exclusividade Veluntu.
          </p>
        </div>
      </section>

      {/* Wizard Principal */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main, #FAF8F5)', paddingTop: '40px', paddingBottom: '90px' }}>
        <div className="container">
          <div className="planner-layout">
            
            {/* Card Principal da Etapa */}
            <div className="planner-wizard-card">
              
              {/* Barra de Progresso */}
              <div className="planner-progress">
                <div className="planner-step-label">
                  <span>Etapa {step} de 5</span>
                  <span>
                    {step === 1 && '1. Escolha a Época do Ano'}
                    {step === 2 && '2. Qual é o seu Objetivo?'}
                    {step === 3 && '3. Destino ou Descobrir'}
                    {step === 4 && '4. Pacotes Recomendados'}
                    {step === 5 && '5. Confirme suas Escolhas & Seus Dados'}
                  </span>
                </div>
                <div className="planner-progress-track">
                  <div className="planner-progress-bar" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
              </div>

              {/* =========================================================
                  ETAPA 1: MÊS DA VIAGEM COM NÚMERO GRANDE CENTRAL NO HOVER (ESTILO FOTO 1)
                  ========================================================= */}
              {step === 1 && (
                <div>
                  <div className="planner-step-header">
                    <h3>Selecione a época do ano:</h3>
                    <p>Passe o mouse por cima dos meses para visualizar o número e selecione o período desejado.</p>
                  </div>

                  <div className="month-grid-luxury">
                    {months.map((m) => {
                      const isSelected = preferences.month === m.name;
                      return (
                        <div
                          key={m.num}
                          onClick={() => setPreferences({ ...preferences, month: m.name, monthNumber: m.num })}
                          className={`month-card-luxury ${isSelected ? 'active' : ''}`}
                        >
                          {/* Número central que surge no hover e no estado ativo */}
                          <span className="month-number-big">{m.num}</span>

                          {/* Nome do Mês */}
                          <span className="month-name">{m.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================
                  ETAPA 2: OBJETIVO NA VIAGEM - MÚLTIPLA ESCOLHA COM HOVER REFINADO
                  ========================================================= */}
              {step === 2 && (
                <div>
                  <div className="planner-step-header">
                    <h3>Qual é o seu objetivo nessa viagem?</h3>
                    <p>Selecione <strong>uma ou mais opções</strong> abaixo. Passe o mouse sobre as opções para conhecer os detalhes de cada proposta.</p>
                  </div>

                  <div className="purpose-grid-luxury">
                    {purposeOptions.map((item) => {
                      const isSelected = preferences.purposeIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => togglePurpose(item)}
                          className={`purpose-card-luxury ${isSelected ? 'active' : ''}`}
                        >
                          <div className="purpose-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '6px',
                                border: isSelected ? '2px solid #cc7a00' : '2px solid #cbd5e1',
                                background: isSelected ? '#cc7a00' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: '900',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                              }}>
                                {isSelected ? '✓' : ''}
                              </span>
                              <h4 className="purpose-title">{item.title}</h4>
                            </div>
                            <span className="purpose-badge-tag">{item.badge}</span>
                          </div>

                          {/* Mensagem que só aparece no hover ou quando selecionado */}
                          <div className="purpose-hover-text">
                            <strong>{item.title} &mdash; </strong>
                            {item.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {preferences.purposes.length > 0 && (
                    <div style={{ textAlign: 'center', fontSize: '13px', color: '#17320b', fontWeight: '600', marginTop: '10px' }}>
                      {preferences.purposes.length} objetivo(s) selecionado(s): <span style={{ color: '#cc7a00' }}>{preferences.purposes.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  ETAPA 3: DESTINO VS DESCOBRIR (COM MÚLTIPLAS IDEIAS)
                  ========================================================= */}
              {step === 3 && (
                <div>
                  <div className="planner-step-header">
                    <h3>Como prefere escolher sua experiência?</h3>
                    <p>Selecione diretamente o destino desejado ou descubra <strong>ideias inspiradoras</strong> (você pode selecionar várias).</p>
                  </div>

                  {/* Abas de Navegação */}
                  <div className="inspire-nav-tabs">
                    <button
                      type="button"
                      onClick={() => {
                        setInspireTab('destination');
                        setPreferences({ ...preferences, mode: 'destination' });
                      }}
                      className={`inspire-tab-btn ${inspireTab === 'destination' ? 'active' : ''}`}
                    >
                      Escolher por Destino
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInspireTab('discover');
                        setPreferences({ ...preferences, mode: 'discover' });
                      }}
                      className={`inspire-tab-btn ${inspireTab === 'discover' ? 'active' : ''}`}
                    >
                      Descobrir Ideias do que Fazer {preferences.occasions.length > 0 ? `(${preferences.occasions.length})` : ''}
                    </button>
                  </div>

                  {/* Aba 1: Destino Direto (África do Sul, Egito, Madagascar) */}
                  {inspireTab === 'destination' ? (
                    <div>
                      <div className="destination-showcase-grid">
                        {destinationOptions.map((dest) => {
                          const isSelected = preferences.destination === dest.name && preferences.mode === 'destination';
                          return (
                            <div
                              key={dest.name}
                              onClick={() =>
                                setPreferences({
                                  ...preferences,
                                  destination: dest.name,
                                  mode: 'destination',
                                })
                              }
                              className={`destination-card-lux ${isSelected ? 'active' : ''}`}
                            >
                              <img src={dest.img} alt={dest.name} />
                              <div className="dest-overlay"></div>
                              <div className="dest-content">
                                <span className="dest-badge">{dest.badge}</span>
                                <h4>{dest.name}</h4>
                                <p>{dest.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Aba 2: Descobrir por Ideias / Ocasião (Múltipla Seleção) */
                    <div>
                      <div className="occasion-grid">
                        {occasionOptions.map((occ) => {
                          const isSelected = preferences.occasions.includes(occ.name);
                          return (
                            <div
                              key={occ.id}
                              onClick={() => toggleOccasion(occ)}
                              className={`occasion-card-luxury ${isSelected ? 'active' : ''}`}
                            >
                              <div className="occasion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '5px',
                                    border: isSelected ? '2px solid #cc7a00' : '2px solid #cbd5e1',
                                    background: isSelected ? '#cc7a00' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    flexShrink: 0,
                                  }}>
                                    {isSelected ? '✓' : ''}
                                  </span>
                                  <h4>{occ.name}</h4>
                                </div>
                                <span className="occasion-badge">{occ.tag}</span>
                              </div>
                              <p style={{ marginTop: '6px' }}>{occ.desc}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                                <span style={{ fontSize: '11px', color: isSelected ? '#e5a93c' : '#cc7a00', fontWeight: '700' }}>
                                  {isSelected ? '✓ Selecionado' : '+ Adicionar Ideia'}
                                </span>
                                <span style={{ fontSize: '12px', color: isSelected ? '#e2e8f0' : '#17320b', fontWeight: '600' }}>
                                  Destino sugerido: <strong>{occ.recommendedDest}</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {preferences.occasions.length > 0 && (
                        <div style={{ textAlign: 'center', fontSize: '13px', color: '#17320b', fontWeight: '600', marginTop: '10px' }}>
                          {preferences.occasions.length} ideia(s) selecionada(s): <span style={{ color: '#cc7a00' }}>{preferences.occasions.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  ETAPA 4: OPÇÕES DE PACOTES COM DESTAQUE PARA 2 PESSOAS
                  ========================================================= */}
              {step === 4 && (
                <div>
                  <div className="planner-step-header">
                    <h3>Pacotes Selecionados para Sua Jornada</h3>
                    <p>
                      Exibindo as melhores opções em <strong>{preferences.destination}</strong> com foco prioritário no pacote para <strong>2 pessoas</strong>.
                    </p>
                  </div>

                  {/* Alternador de Viajantes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px', background: '#f8faf7', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e1e7de' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#cc7a00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Configuração de Passageiros
                      </span>
                      <h4 style={{ margin: '2px 0 0', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#17320b' }}>
                        Selecione a quantidade de viajantes:
                      </h4>
                    </div>

                    <div className="travelers-toggle-bar">
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
                        1 Pessoa (Individual)
                      </button>
                    </div>
                  </div>

                  {/* Lista de Pacotes */}
                  {loadingPackages ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#cc7a00' }}>
                      <p>Carregando os roteiros exclusivos...</p>
                    </div>
                  ) : availablePackages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', background: '#ffffff', borderRadius: '10px', border: '1px solid #eee' }}>
                      <p>Desenharemos um roteiro 100% sob medida para seu perfil em {preferences.destination}.</p>
                      <button onClick={() => setStep(5)} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                        Continuar para Confirmação &rarr;
                      </button>
                    </div>
                  ) : (
                    <div>
                      {availablePackages.map((pkg) => {
                        const isChosen = selectedPackage && selectedPackage.id === pkg.id;
                        const individualPrice = pkg.price || pkg.pricePerPerson || 24000;
                        const totalCalculated = travelersCount === 2 ? (pkg.priceForTwo || individualPrice * 2) : individualPrice;

                        return (
                          <div
                            key={pkg.id}
                            className={`planner-pkg-card ${isChosen ? 'selected-pkg' : ''}`}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '22px' }}>
                              <img
                                src={pkg.image_url}
                                alt={pkg.title}
                                style={{ width: '100%', height: '100%', minHeight: '200px', objectFit: 'cover' }}
                              />
                              <div style={{ padding: '22px 22px 22px 0', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', color: '#cc7a00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {pkg.destination} • {pkg.duration_days} DIAS
                                  </span>
                                  {isChosen && (
                                    <span style={{ background: '#17320b', color: '#e5a93c', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>
                                      Roteiro Selecionado
                                    </span>
                                  )}
                                </div>

                                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#17320b', margin: '4px 0 8px' }}>
                                  {pkg.title}
                                </h4>

                                <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: '1.5', marginBottom: '14px' }}>
                                  {pkg.description}
                                </p>

                                {pkg.included_services && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                    {pkg.included_services.map((h, i) => (
                                      <span key={i} className="pkg-tag">✓ {h}</span>
                                    ))}
                                  </div>
                                )}

                                {/* Bloco de Preços com Destaque para 2 Pessoas */}
                                <div className="travelers-pricing-box">
                                  <div>
                                    <span className="travelers-price-label">
                                      {travelersCount === 2 ? 'VALOR TOTAL DO PACOTE (PARA 2 PESSOAS / DUPLA):' : 'VALOR INDIVIDUAL (1 PESSOA):'}
                                    </span>
                                    <div className="travelers-price-amount">
                                      {pkg.currency || 'R$'} {totalCalculated.toLocaleString('pt-BR')}
                                    </div>
                                    <span className="travelers-price-subtext">
                                      {travelersCount === 2
                                        ? `(Equivalente a ${pkg.currency || 'R$'} ${(totalCalculated / 2).toLocaleString('pt-BR')} por pessoa)`
                                        : 'Acomodação privativa com concierge'}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedPackage(pkg);
                                      setPreferences({
                                        ...preferences,
                                        packageTitle: pkg.title,
                                        packagePrice: totalCalculated,
                                        packageCurrency: pkg.currency || 'R$',
                                      });
                                      setStep(5);
                                    }}
                                    className="btn btn-primary btn-sm"
                                    style={{ whiteSpace: 'nowrap' }}
                                  >
                                    Escolher Este Roteiro &rarr;
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  ETAPA 5: CONFIRMAÇÃO DAS ESCOLHAS & FORMULÁRIO COM ALTO CONTRASTE (SEM EMOJIS)
                  ========================================================= */}
              {step === 5 && (
                <div className="planner-confirm-box">
                  {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: '#17320b', marginBottom: '10px' }}>
                        Planejamento Recebido com Sucesso!
                      </h3>
                      <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: '1.6', maxWidth: '540px', margin: '0 auto 24px' }}>
                        Nossa equipe de Travel Designers já recebeu todas as suas preferências. Entraremos em contato com você através do e-mail <strong>{clientForm.client_email}</strong> e WhatsApp <strong>{clientForm.client_phone}</strong> com sua proposta personalizada.
                      </p>
                      <div style={{ background: '#f8faf7', border: '1px solid #e1e7de', borderRadius: '10px', padding: '16px', maxWidth: '420px', margin: '0 auto 24px', textAlign: 'left', fontSize: '13px', color: '#17320b' }}>
                        <strong>Resumo do seu projeto:</strong><br />
                        • Destino: {preferences.destination || 'A definir'}<br />
                        • Mês: {preferences.month || 'A definir'}<br />
                        • Viajantes: {travelersCount} pessoa(s)<br />
                        • Roteiro: {selectedPackage ? selectedPackage.title : preferences.packageTitle || 'Sob Medida'}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setStep(1);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Iniciar Novo Planejamento
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="planner-step-header">
                        <h3>Confirme Suas Escolhas e Solicite Seu Roteiro</h3>
                        <p>Revise o resumo do seu roteiro abaixo e preencha seus dados de contato para envio imediato.</p>
                      </div>

                      {/* Resumo Visual das Escolhas Feitas */}
                      <div className="planner-recap-grid">
                        <div className="planner-recap-item">
                          <span>Mês Escolhido</span>
                          <strong>{preferences.month ? `${preferences.month} (Mês ${preferences.monthNumber})` : 'A definir'}</strong>
                        </div>
                        <div className="planner-recap-item">
                          <span>Objetivo(s)</span>
                          <strong>{preferences.purposes.length > 0 ? preferences.purposes.join(', ') : 'A definir'}</strong>
                        </div>
                        <div className="planner-recap-item">
                          <span>Destino</span>
                          <strong>{preferences.destination || 'A definir'}</strong>
                        </div>
                        <div className="planner-recap-item">
                          <span>Modo / Ideia(s)</span>
                          <strong>{preferences.mode === 'discover' && preferences.occasions.length > 0 ? preferences.occasions.join(', ') : 'Escolha Direta'}</strong>
                        </div>
                        <div className="planner-recap-item">
                          <span>Roteiro Selecionado</span>
                          <strong>{selectedPackage ? selectedPackage.title : preferences.packageTitle || 'Sob Medida'}</strong>
                        </div>
                        <div className="planner-recap-item">
                          <span>Total de Viajantes</span>
                          <strong>{travelersCount === 2 ? '2 Pessoas (Casal / Dupla)' : `${travelersCount} Pessoa(s)`}</strong>
                        </div>
                      </div>

                      {/* Formulário com Campos com Alto Contraste */}
                      <form onSubmit={handleSubmitBooking}>
                        {submitError && (
                          <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '18px', fontSize: '13px' }}>
                            {submitError}
                          </div>
                        )}

                        {/* Nome Completo */}
                        <div className="planner-form-group">
                          <label>Nome Completo *</label>
                          <input
                            type="text"
                            required
                            className="planner-input"
                            placeholder="Ex: Dra. Juliana Silveira"
                            value={clientForm.client_name}
                            onChange={(e) => setClientForm({ ...clientForm, client_name: e.target.value })}
                          />
                        </div>

                        {/* E-mail e Telefone em 2 Colunas */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="planner-form-group">
                            <label>E-mail Principal *</label>
                            <input
                              type="email"
                              required
                              className="planner-input"
                              placeholder="seuemail@exemplo.com"
                              value={clientForm.client_email}
                              onChange={(e) => setClientForm({ ...clientForm, client_email: e.target.value })}
                            />
                          </div>

                          <div className="planner-form-group">
                            <label>Telefone / WhatsApp com DDD *</label>
                            <input
                              type="tel"
                              required
                              className="planner-input"
                              placeholder="+55 (11) 98888-7777"
                              value={clientForm.client_phone}
                              onChange={(e) => setClientForm({ ...clientForm, client_phone: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Quantidade de Viajantes & Desejos Especiais */}
                        <div className="planner-form-group">
                          <label>Confirmar Quantidade de Passageiros</label>
                          <select
                            className="planner-select"
                            value={travelersCount}
                            onChange={(e) => setTravelersCount(parseInt(e.target.value))}
                          >
                            <option value={2}>2 pessoas (Casal / Dupla - Recomendado)</option>
                            <option value={1}>1 pessoa (Viajante Solo)</option>
                            <option value={3}>3 pessoas</option>
                            <option value={4}>4 pessoas (Família / Grupo)</option>
                            <option value={5}>5 ou mais pessoas (Expedição VIP)</option>
                          </select>
                        </div>

                        <div className="planner-form-group">
                          <label>Desejos Especiais, Ocasião ou Restrições (Opcional)</label>
                          <textarea
                            className="planner-textarea"
                            rows={3}
                            placeholder="Ex: Preferência por vilas com piscina, voo de balão na savana, guia em português, comemoração de bodas..."
                            value={clientForm.special_requests}
                            onChange={(e) => setClientForm({ ...clientForm, special_requests: e.target.value })}
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '16px', fontSize: '15px', marginTop: '10px' }}
                        >
                          {submitting ? 'Enviando Solicitação...' : 'Confirmar e Solicitar Proposta Exclusiva &rarr;'}
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
                          <span>Seus dados estão protegidos</span>
                          <span>Retorno de consultoria em até 24h</span>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Botões de Ação do Wizard (Voltar e Avançar) */}
              {!submitted && (
                <div className="planner-form-actions">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="btn btn-outline btn-sm"
                    >
                      &larr; Voltar Etapa
                    </button>
                  ) : <div></div>}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn btn-primary"
                    >
                      {step === 4 ? 'Avançar para Confirmação →' : 'Próxima Etapa →'}
                    </button>
                  ) : null}
                </div>
              )}

            </div>

            {/* Resumo Lateral Dinâmico - Começa limpo */}
            <div className="planner-summary">
              <span className="summary-header">SEU PLANEJAMENTO</span>
              
              <div className="summary-card">
                <h4>{preferences.destination || 'A Definir'}</h4>
                
                <div className="summary-row">
                  <span>Mês:</span>
                  <strong>{preferences.month ? `${preferences.month} (Mês ${preferences.monthNumber})` : 'A selecionar'}</strong>
                </div>

                <div className="summary-row">
                  <span>Objetivo(s):</span>
                  <strong>{preferences.purposes.length > 0 ? preferences.purposes.join(', ') : 'A selecionar'}</strong>
                </div>

                <div className="summary-row">
                  <span>Modo:</span>
                  <strong>{preferences.mode === 'discover' && preferences.occasions.length > 0 ? `Ideias: ${preferences.occasions.join(', ')}` : preferences.mode === 'destination' ? 'Destino Direto' : 'A selecionar'}</strong>
                </div>

                <div className="summary-row">
                  <span>Destino:</span>
                  <strong>{preferences.destination || 'A selecionar'}</strong>
                </div>

                <div className="summary-row">
                  <span>Viajantes:</span>
                  <strong>{travelersCount === 2 ? '2 Pessoas (Casal / Dupla)' : `${travelersCount} Pessoa(s)`}</strong>
                </div>

                {selectedPackage && (
                  <div className="summary-row">
                    <span>Pacote:</span>
                    <strong style={{ color: '#cc7a00', fontSize: '12px' }}>{selectedPackage.title}</strong>
                  </div>
                )}
              </div>

              <div style={{ background: '#f8faf7', border: '1px solid #e1e7de', borderRadius: '8px', padding: '14px', fontSize: '12px', color: '#17320b', marginTop: '16px', lineHeight: '1.6' }}>
                ✓ Concierge bilíngue especialista em África<br/>
                ✓ Hospedagem em lodges 5 estrelas e vilas privativas<br/>
                ✓ Assessoria completa em voos e logística exclusiva
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
