import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const packageTitle = searchParams.get('package') || '';
  const destination = searchParams.get('destination') || '';
  const travelers = parseInt(searchParams.get('travelers')) || 2;
  const month = searchParams.get('month') || '';
  const purpose = searchParams.get('purpose') || '';
  const occasion = searchParams.get('occasion') || '';

  const initialNotes = [
    packageTitle ? `Pacote de interesse: ${packageTitle}` : '',
    destination ? `Destino pretendido: ${destination}` : '',
    month ? `Época prevista: ${month}` : '',
    purpose ? `Perfil / O que busca: ${purpose}` : '',
    occasion ? `Ocasião: ${occasion}` : '',
  ].filter(Boolean).join('\n');

  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    subject: packageTitle ? 'Solicitar Proposta Sob Medida / Pacote' : 'Relatar um Problema / Suporte',
    participants_count: travelers,
    travel_date: '',
    notes: initialNotes,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fullNotes = `[Assunto / Canal SAC: ${form.subject}]\n${form.notes}`;
      await api.createPublicReservation({
        ...form,
        notes: fullNotes,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section Oficial do SAC */}
      <section className="sac-hero" style={{ background: 'linear-gradient(135deg, #0f190e 0%, #17320b 100%)', padding: '90px 20px 70px', textAlign: 'center' }}>
        <div className="hero-content" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <span className="badge" style={{ letterSpacing: '2px' }}>CENTRAL DE ATENDIMENTO & CONCIERGE</span>
          <h1 className="hero-title" style={{ fontSize: '3rem', color: '#FFFFFF', margin: '14px 0 16px', fontFamily: 'var(--font-heading)' }}>
            Atendimento Exclusivo Veluntu
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
            Nossa equipe de consultoria e concierge está à sua disposição para esclarecimento de dúvidas, assessoria de roteiros e suporte contínuo antes e durante sua viagem.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal do SAC */}
      <section className="section" style={{ backgroundColor: 'var(--bg-main, #FAF8F5)', paddingTop: '40px', paddingBottom: '90px' }}>
        <div className="container">
          
          {/* 4 Cards de Destaque no Topo do SAC */}
          <div className="sac-top-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
            
            {/* Card 1: E-mail SAC */}
            <div className="sac-top-card" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '11px', color: '#CC7A00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                Canal Oficial
              </span>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '1.15rem', margin: '0 0 6px' }}>E-mail de Atendimento</h4>
              <strong style={{ display: 'block', fontSize: '13.5px', color: '#17320B', marginBottom: '6px' }}>atendimento@veluntu.com.br</strong>
              <span style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', display: 'block' }}>Envie sua solicitação a qualquer momento. Resposta prioritária.</span>
            </div>

            {/* Card 2: Horário de Atendimento */}
            <div className="sac-top-card" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '11px', color: '#CC7A00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                Disponibilidade
              </span>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '1.15rem', margin: '0 0 6px' }}>Horário Operacional</h4>
              <strong style={{ display: 'block', fontSize: '13.5px', color: '#17320B', marginBottom: '6px' }}>07:00 às 18:00 (Brasília)</strong>
              <span style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', display: 'block' }}>Atendimento de segunda a sexta-feira para novas solicitações.</span>
            </div>

            {/* Card 3: WhatsApp & Telefone */}
            <div className="sac-top-card" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '11px', color: '#CC7A00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                Contato Direto
              </span>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '1.15rem', margin: '0 0 6px' }}>WhatsApp & Central</h4>
              <strong style={{ display: 'block', fontSize: '13.5px', color: '#17320B', marginBottom: '6px' }}>+55 (11) 99999-8888</strong>
              <span style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', display: 'block' }}>Linha direta com consultores especialistas em África.</span>
            </div>

            {/* Card 4: Plantão Emergencial */}
            <div className="sac-top-card" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '24px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '11px', color: '#CC7A00', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
                Suporte Em Viagem
              </span>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: '#17320B', fontSize: '1.15rem', margin: '0 0 6px' }}>Concierge 24/7</h4>
              <strong style={{ display: 'block', fontSize: '13.5px', color: '#17320B', marginBottom: '6px' }}>Plantão Global 24 Horas</strong>
              <span style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5', display: 'block' }}>Assistência contínua em tempo real para viajantes em trânsito.</span>
            </div>

          </div>

          {/* Layout Principal em 2 Colunas */}
          <div className="sac-main-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', alignItems: 'start' }}>
            
            {/* Coluna 1: Informações & Diretrizes do SAC */}
            <div className="sac-info-box" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <span style={{ color: '#CC7A00', fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                PADRÃO DE ATENDIMENTO VELUNTU
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: '#17320B', marginBottom: '14px' }}>
                Como Funciona Nosso Atendimento
              </h3>
              <p style={{ color: '#4B5563', fontSize: '14.5px', lineHeight: '1.7', marginBottom: '28px' }}>
                Cada cliente e agência parceira conta com atendimento individualizado e atencioso. Garantimos uma análise detalhada da sua solicitação com retorno ágil e transparente.
              </p>

              <div className="sac-guidelines-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#17320b', color: '#e5a93c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    01
                  </div>
                  <div>
                    <strong style={{ color: '#17320B', fontSize: '15px', display: 'block', marginBottom: '3px' }}>Registro da Solicitação</strong>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: '1.6' }}>Preencha o formulário ao lado ou entre em contato pelo e-mail atendimento@veluntu.com.br.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#17320b', color: '#e5a93c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    02
                  </div>
                  <div>
                    <strong style={{ color: '#17320B', fontSize: '15px', display: 'block', marginBottom: '3px' }}>Análise &amp; Triagem Especializada</strong>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: '1.6' }}>Nossa equipe de consultores analisa detalhadamente o seu caso durante o horário operacional (07:00 às 18:00).</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#17320b', color: '#e5a93c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                    03
                  </div>
                  <div>
                    <strong style={{ color: '#17320B', fontSize: '15px', display: 'block', marginBottom: '3px' }}>Retorno &amp; Solução Completa</strong>
                    <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B', lineHeight: '1.6' }}>Entramos em contato direto por e-mail ou WhatsApp para apresentar a solução detalhada, proposta ou esclarecimento.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '14px 18px', background: '#F8FAF7', border: '1px solid #E1E7DE', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#17320B', fontWeight: '600' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 0 3px rgba(52,211,153,0.2)' }}></span>
                <span>Central de Atendimento Operacional (07:00 às 18:00)</span>
              </div>
            </div>

            {/* Coluna 2: Formulário Oficial de Mensagem & Relato de Problemas */}
            <div className="sac-form-card" style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#17320B', marginBottom: '10px' }}>
                    Solicitação Recebida com Sucesso
                  </h3>
                  <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', maxWidth: '460px', margin: '0 auto 24px' }}>
                    Sua mensagem foi registrada na Central de Atendimento Veluntu. Nossa equipe responderá através do e-mail <strong>{form.client_email}</strong> ou pelo WhatsApp informado dentro do horário operacional.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ ...form, notes: '' });
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Enviar Nova Mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.6' }}>
                      Preencha os campos abaixo com suas informações para que nossa equipe possa te atender com prioridade.
                    </p>
                  </div>

                  {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                      {error}
                    </div>
                  )}

                  {/* Assunto / Tipo de Atendimento */}
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#17320B', marginBottom: '6px' }}>
                      TIPO DE SOLICITAÇÃO / ASSUNTO
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#121814', fontSize: '14px', outline: 'none' }}
                    >
                      <option value="Relatar um Problema / Suporte">Relatar um Problema / Suporte Técnico</option>
                      <option value="Dúvidas sobre Reserva / Roteiro">Dúvidas sobre Reserva ou Roteiro</option>
                      <option value="Alteração ou Cancelamento">Alteração ou Cancelamento de Viagem</option>
                      <option value="Solicitar Proposta Sob Medida / Pacote">Solicitar Proposta Sob Medida / Pacote</option>
                      <option value="Elogios, Sugestões ou Feedback">Elogios, Sugestões ou Feedback</option>
                      <option value="Outros Assuntos">Outros Assuntos</option>
                    </select>
                  </div>

                  {/* Nome Completo */}
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#17320B', marginBottom: '6px' }}>
                      NOME COMPLETO
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo Mendes"
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#121814', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  {/* E-mail e Telefone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#17320B', marginBottom: '6px' }}>
                        E-MAIL DE CONTATO
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com"
                        value={form.client_email}
                        onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#121814', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#17320B', marginBottom: '6px' }}>
                        NÚMERO DE CONTATO / WHATSAPP
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+55 (11) 99999-8888"
                        value={form.client_phone}
                        onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#121814', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Mensagem / Relato do Problema */}
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#17320B', marginBottom: '6px' }}>
                      {form.subject.includes('Problema') ? 'DESCREVA O PROBLEMA OU OCORRÊNCIA' : 'MENSAGEM / DETALHES DA SOLICITAÇÃO'}
                    </label>
                    <textarea
                      required
                      placeholder={
                        form.subject.includes('Problema')
                          ? 'Descreva detalhadamente o ocorrido, erro encontrado, data ou código de reserva se houver, para que nosso SAC resolva rapidamente...'
                          : 'Escreva sua mensagem, dúvida, pedidos especiais ou solicitação...'
                      }
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows="5"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: '#121814', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                    ></textarea>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                    {loading ? 'Enviando Mensagem...' : 'Enviar Mensagem ao SAC →'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                    <span>Atendimento sigiloso e seguro</span>
                    <span>Horário: 07:00 às 18:00</span>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
