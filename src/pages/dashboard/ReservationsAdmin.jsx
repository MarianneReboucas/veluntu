import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

const statusStyle = (status) => {
  if (status === 'confirmada') return { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' };
  if (status === 'cancelada') return { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' };
  return { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' };
};

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('todas');
  const [search, setSearch] = useState('');

  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await api.getReservations(statusFilter, search);
      if (res.success && res.data) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, [statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateReservation(id, { status: newStatus });
      loadReservations();
    } catch (err) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza de que deseja remover este registro?')) return;
    try {
      await api.deleteReservation(id);
      loadReservations();
    } catch (err) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  const cardStyle = { padding: '24px', borderRadius: '16px', background: '#0e1424', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px', transition: 'border-color 0.2s ease' };

  return (
    <DashboardLayout
      title="Gestão de Reservas & Leads"
      subtitle="Acompanhe solicitações de clientes, propostas emitidas e confirmações de embarque"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Filtros e Busca */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', background: '#0e1424', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>BUSCA</span>
            <input
              type="text"
              placeholder="Buscar por cliente, e-mail ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...darkInput, paddingLeft: '60px', width: '320px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['todas', 'pendente', 'confirmada', 'cancelada'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  ...(statusFilter === st
                    ? { background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#94a3b8' })
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Reservas */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#d4af37' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⌛</div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Carregando solicitações...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#0e1424', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>Nenhuma solicitação encontrada</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Quando novos clientes preencherem formulários no site, eles aparecerão aqui.</p>
          </div>
        ) : (
          reservations.map((res) => (
            <div
              key={res.id}
              style={cardStyle}
              onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                {/* Lado Esquerdo */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', ...statusStyle(res.status) }}>
                      {res.status}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Recebido em {new Date(res.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                    {res.client_name}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#f3e5ab', fontWeight: '500', marginBottom: '12px' }}>
                    Roteiro: {res.package_title || 'Consultoria VIP Personalizada'}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#94a3b8', marginBottom: res.notes ? '12px' : 0 }}>
                    <span>E-mail: <a href={`mailto:${res.client_email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{res.client_email}</a></span>
                    {res.client_phone && <span>Tel: <a href={`tel:${res.client_phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{res.client_phone}</a></span>}
                    <span>{res.participants_count} viajante(s)</span>
                    {res.travel_date && <span>Data: {new Date(res.travel_date).toLocaleDateString('pt-BR')}</span>}
                  </div>

                  {res.notes && (
                    <p style={{ fontSize: '11px', color: '#64748b', background: 'rgba(0,0,0,0.25)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', fontStyle: 'italic', marginTop: '12px' }}>
                      "{res.notes}"
                    </p>
                  )}
                </div>

                {/* Lado Direito */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Valor Previsto</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '20px', fontWeight: '700', color: '#d4af37' }}>
                      R$ {parseFloat(res.total_price || 0).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '8px', background: '#080c16', border: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#FFFFFF', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>

                    <button
                      onClick={() => handleDelete(res.id)}
                      style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
