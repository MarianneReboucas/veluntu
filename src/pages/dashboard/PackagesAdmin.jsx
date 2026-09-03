import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  getAllPackages,
  searchPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../../data/packagesStore';

const darkInput = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  background: '#080c16',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '13px',
  color: '#FFFFFF',
  outline: 'none',
  boxSizing: 'border-box',
};

const darkLabel = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#94a3b8',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const EMPTY_FORM = {
  title: '',
  description: '',
  destination: '',
  price: '',
  priceForTwo: '',
  currency: 'R$',
  duration_days: 7,
  included_services: 'Hospedagem 5 estrelas, Guia em português, Voos internos, Traslados privativos',
  max_participants: 8,
  image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
  status: 'active',
};

export default function PackagesAdmin() {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const toastTimer = useRef(null);

  // Carrega pacotes do store local
  const loadPackages = (q = search) => {
    const result = q.trim() ? searchPackages(q) : getAllPackages();
    setPackages(result);
  };

  useEffect(() => {
    loadPackages(search);
  }, [search]);

  // Toast de feedback
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  const handleOpenModal = (pkg = null) => {
    setFormError('');
    if (pkg) {
      setEditingId(pkg.id);
      const services = Array.isArray(pkg.included_services)
        ? pkg.included_services.join(', ')
        : pkg.included_services || '';
      const fd = {
        title: pkg.title,
        description: pkg.description || '',
        destination: pkg.destination,
        price: pkg.price || pkg.pricePerPerson || '',
        priceForTwo: pkg.priceForTwo || '',
        currency: pkg.currency || 'R$',
        duration_days: pkg.duration_days || 7,
        included_services: services,
        max_participants: pkg.max_participants || 8,
        image_url: pkg.image_url || '',
        status: pkg.status || 'active',
      };
      setFormData(fd);
      setPreviewImg(fd.image_url);
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setPreviewImg(EMPTY_FORM.image_url);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      if (editingId) {
        await updatePackage(editingId, formData);
        showToast('Roteiro atualizado com sucesso no banco!');
      } else {
        await createPackage(formData);
        showToast('Novo roteiro publicado com sucesso!');
      }
      setModalOpen(false);
      loadPackages();
    } catch (err) {
      setFormError(err.message || 'Erro ao salvar roteiro.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Excluir o roteiro "${title}"?\n\nEsta ação não pode ser desfeita.`)) return;
    await deletePackage(id);
    loadPackages();
    showToast('Roteiro excluído do catálogo.');
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'image_url') setPreviewImg(value);
  };

  const statusColor = (s) => {
    if (s === 'active') return '#34d399';
    if (s === 'draft') return '#facc15';
    return '#94a3b8';
  };

  const statusLabel = (s) => {
    if (s === 'active') return 'Ativo';
    if (s === 'draft') return 'Rascunho';
    return 'Arquivado';
  };

  return (
    <DashboardLayout
      title="Gestão de Pacotes & Roteiros"
      subtitle="Cadastre e gerencie as expedições disponíveis no catálogo da sua agência"
      action={
        <button
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}
        >
          + Criar Roteiro
        </button>
      }
    >
      {/* Toast de Feedback */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#17320b', border: '1px solid #cc7a00', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', transition: 'all 0.3s ease' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Barra de Busca */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', background: '#0e1424', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '14px' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por título ou destino..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...darkInput, paddingLeft: '36px', width: '280px' }}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Mostrando <strong style={{ color: '#FFFFFF' }}>{packages.length}</strong> pacote(s)
          </span>
        </div>

        {/* Grid de Pacotes */}
        {packages.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#0e1424', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>Nenhum roteiro encontrado</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>Crie seu primeiro roteiro ou ajuste o filtro de busca.</p>
            <button onClick={() => handleOpenModal()} style={{ padding: '10px 24px', borderRadius: '20px', background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17', fontWeight: '700', fontSize: '12px', border: 'none', cursor: 'pointer' }}>
              Criar Novo Roteiro
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                style={{ background: '#0e1424', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Imagem com badges */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={pkg.image_url}
                    alt={pkg.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  {/* Badge destino */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: '#f3e5ab', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {pkg.destination}
                  </div>
                  {/* Badge status */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', color: statusColor(pkg.status), border: `1px solid ${statusColor(pkg.status)}44`, textTransform: 'uppercase' }}>
                    {statusLabel(pkg.status)}
                  </div>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '14px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pkg.title}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pkg.description}
                    </p>
                  </div>

                  <div>
                    {/* Preço + Duração */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Valor Base</span>
                        <span style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', color: '#d4af37', fontSize: '14px' }}>
                          {pkg.currency} {parseFloat(pkg.price || pkg.pricePerPerson || 0).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Duração</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{pkg.duration_days} dias</span>
                      </div>
                    </div>

                    {/* Inclusões */}
                    {Array.isArray(pkg.included_services) && pkg.included_services.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {pkg.included_services.slice(0, 3).map((s, i) => (
                          <span key={i} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', fontSize: '10px', padding: '2px 8px', borderRadius: '12px' }}>
                            ✓ {s}
                          </span>
                        ))}
                        {pkg.included_services.length > 3 && (
                          <span style={{ color: '#64748b', fontSize: '10px', padding: '2px 8px' }}>
                            +{pkg.included_services.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenModal(pkg)}
                        style={{ flex: 1, padding: '9px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px', fontWeight: '600', color: '#e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                      >
                        Editar Roteiro
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.title)}
                        style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer', fontSize: '12px', fontWeight: '700', transition: 'all 0.2s' }}
                        title="Excluir Pacote"
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.2)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL: CRIAR / EDITAR ROTEIRO
          ========================================================= */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 20px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', overflowY: 'auto' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{ width: '100%', maxWidth: '680px', background: '#0e1424', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '32px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', margin: '20px auto' }}>

            {/* Header do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 4px' }}>
                  {editingId ? 'Editar Roteiro' : 'Novo Roteiro Exclusivo'}
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                  {editingId
                    ? 'Altere os dados do roteiro. As mudanças refletem imediatamente no site e no Planejador.'
                    : 'Preencha os detalhes do roteiro. Ele será publicado no catálogo imediatamente.'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', padding: '6px 12px', borderRadius: '8px', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: '12px' }}>
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Preview da imagem + campo URL */}
              {previewImg && (
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '160px', marginBottom: '4px' }}>
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Título */}
              <div>
                <label style={darkLabel}>Título da Expedição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Safári Privativo Kruger & Vinícolas de Franschhoek"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  style={darkInput}
                />
              </div>

              {/* Destino */}
              <div>
                <label style={darkLabel}>Destino / País *</label>
                <select
                  value={formData.destination}
                  onChange={(e) => handleFieldChange('destination', e.target.value)}
                  style={darkInput}
                  required
                >
                  <option value="">Selecione o destino...</option>
                  <option value="África do Sul">África do Sul</option>
                  <option value="Egito">Egito</option>
                  <option value="Madagascar">Madagascar</option>
                </select>
              </div>

              {/* Valores: Individual + Para 2 Pessoas (com desconto) */}
              <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '11px', color: '#d4af37', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                  Configuração de Preços
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={darkLabel}>Valor Individual (1 Pessoa) *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>R$</span>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        required
                        placeholder="Ex: 24000"
                        value={formData.price}
                        onChange={(e) => handleFieldChange('price', e.target.value)}
                        style={{ ...darkInput, paddingLeft: '36px' }}
                      />
                    </div>
                    {formData.price && (
                      <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                        Preço cobrado para viajante solo
                      </span>
                    )}
                  </div>
                  <div>
                    <label style={darkLabel}>Valor para 2 Pessoas / Casal *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '12px', fontWeight: '600' }}>R$</span>
                      <input
                        type="number"
                        step="100"
                        min="0"
                        required
                        placeholder="Ex: 42000"
                        value={formData.priceForTwo}
                        onChange={(e) => handleFieldChange('priceForTwo', e.target.value)}
                        style={{ ...darkInput, paddingLeft: '36px' }}
                      />
                    </div>
                    {formData.price && formData.priceForTwo && (
                      <span style={{ fontSize: '10px', marginTop: '4px', display: 'block', color: parseFloat(formData.priceForTwo) < parseFloat(formData.price) * 2 ? '#34d399' : '#f87171' }}>
                        {parseFloat(formData.priceForTwo) < parseFloat(formData.price) * 2
                          ? `✓ Desconto de R$ ${(parseFloat(formData.price) * 2 - parseFloat(formData.priceForTwo)).toLocaleString('pt-BR')} aplicado`
                          : `⚠ Sem desconto (seria R$ ${(parseFloat(formData.price) * 2).toLocaleString('pt-BR')} sem desconto)`
                        }
                      </span>
                    )}
                  </div>
                </div>
                {formData.price && formData.priceForTwo && parseFloat(formData.price) > 0 && parseFloat(formData.priceForTwo) > 0 && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <span>Individual: <strong style={{ color: '#d4af37' }}>R$ {parseFloat(formData.price).toLocaleString('pt-BR')}</strong></span>
                    <span>Casal / Dupla: <strong style={{ color: '#d4af37' }}>R$ {parseFloat(formData.priceForTwo).toLocaleString('pt-BR')}</strong></span>
                    <span>Por pessoa (casal): <strong style={{ color: '#34d399' }}>R$ {(parseFloat(formData.priceForTwo) / 2).toLocaleString('pt-BR')}</strong></span>
                  </div>
                )}
              </div>

              {/* Duração + Participantes + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={darkLabel}>Duração (dias)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.duration_days}
                    onChange={(e) => handleFieldChange('duration_days', parseInt(e.target.value) || 1)}
                    style={darkInput}
                  />
                </div>
                <div>
                  <label style={darkLabel}>Máx. Participantes</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.max_participants}
                    onChange={(e) => handleFieldChange('max_participants', parseInt(e.target.value) || 1)}
                    style={darkInput}
                  />
                </div>
                <div>
                  <label style={darkLabel}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    style={darkInput}
                  >
                    <option value="active">Ativo (Público)</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* URL da Imagem */}
              <div>
                <label style={darkLabel}>URL da Foto de Capa</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => handleFieldChange('image_url', e.target.value)}
                  style={darkInput}
                />
                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Cole uma URL de imagem do Unsplash ou outro serviço para a foto de capa.
                </span>
              </div>

              {/* Inclusões VIP */}
              <div>
                <label style={darkLabel}>Inclusões VIP (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Safáris Big Five, Lodge 5 estrelas, Guia privativo em português"
                  value={formData.included_services}
                  onChange={(e) => handleFieldChange('included_services', e.target.value)}
                  style={darkInput}
                />
              </div>

              {/* Descrição */}
              <div>
                <label style={darkLabel}>Descrição do Roteiro</label>
                <textarea
                  rows="4"
                  placeholder="Descreva a experiência, os lodges, a programação e o que torna este roteiro especial..."
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  style={{ ...darkInput, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
                />
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '10px', background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '11px 28px',
                    borderRadius: '10px',
                    background: submitting ? '#6b7280' : 'linear-gradient(135deg, #d4af37, #aa851e)',
                    color: '#0a0e17',
                    fontWeight: '700',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 4px 16px rgba(212,175,55,0.25)',
                  }}
                >
                  {submitting ? 'Salvando...' : editingId ? 'Atualizar Roteiro' : 'Publicar Roteiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
