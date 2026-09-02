import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const s = {
  card: {
    padding: '24px',
    borderRadius: '16px',
    background: '#0e1424',
    border: '1px solid rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardLabel: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' },
  cardValue: { fontFamily: "'Cinzel', serif", fontSize: '28px', fontWeight: '800', color: '#FFFFFF', margin: '12px 0 8px' },
  cardSub: { fontSize: '11px', color: '#64748b' },
  cardIcon: (bg, color) => ({
    width: '36px', height: '36px', borderRadius: '10px', background: bg, border: `1px solid ${color}40`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: color,
  }),
};

export default function Overview() {
  const { agency } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <DashboardLayout
      title="Visão Geral"
      subtitle={`Bem-vindo ao centro de operações da ${agency?.name || 'sua Agência'}`}
      action={
        <Link
          to="/dashboard/pacotes"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #aa851e)', color: '#0a0e17', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}
        >
          ＋ Novo Pacote
        </Link>
      }
    >
      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center', color: '#d4af37' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⌛</div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px' }}>Sincronizando dados...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>

            {/* Receita Total */}
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={s.cardLabel}>Receita Total</span>
                <div style={s.cardIcon('rgba(52,211,153,0.1)', '#34d399')}>R$</div>
              </div>
              <p style={s.cardValue}>
                R$ {parseFloat(stats?.revenue?.total || 0).toLocaleString('pt-BR')}
              </p>
              <div style={{ ...s.cardSub, color: '#34d399' }}>
                R$ {parseFloat(stats?.revenue?.confirmed || 0).toLocaleString('pt-BR')} confirmados
              </div>
            </div>

            {/* Total Reservas */}
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={s.cardLabel}>Total de Reservas</span>
                <div style={s.cardIcon('rgba(212,175,55,0.1)', '#d4af37')}>RES</div>
              </div>
              <p style={s.cardValue}>{stats?.reservations?.total || 0}</p>
              <div style={{ ...s.cardSub, color: '#fbbf24' }}>
                {stats?.reservations?.pending || 0} pendentes de aprovação
              </div>
            </div>

            {/* Total Pacotes */}
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={s.cardLabel}>Pacotes no Catálogo</span>
                <div style={s.cardIcon('rgba(96,165,250,0.1)', '#60a5fa')}>CAT</div>
              </div>
              <p style={s.cardValue}>{stats?.packages?.total || 0}</p>
              <div style={s.cardSub}>
                Ticket Médio: R$ {parseFloat(stats?.packages?.avg_price || 0).toFixed(0)}
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={s.cardLabel}>Taxa de Conversão</span>
                <div style={s.cardIcon('rgba(168,85,247,0.1)', '#a855f7')}>%</div>
              </div>
              <p style={s.cardValue}>
                {stats?.reservations?.total > 0
                  ? Math.round(((stats?.reservations?.confirmed || 0) / stats.reservations.total) * 100)
                  : 0}%
              </p>
              <div style={s.cardSub}>
                {stats?.reservations?.confirmed || 0} clientes confirmados
              </div>
            </div>
          </div>

          {/* Tabela de Reservas Recentes */}
          <div style={{ ...s.card, padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                  Últimas Solicitações de Viagem
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Clientes interessados em roteiros nos últimos dias
                </p>
              </div>
              <Link to="/dashboard/reservas" style={{ fontSize: '12px', fontWeight: '600', color: '#d4af37', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Ver Todas ↗
              </Link>
            </div>

            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px' }}>
                      <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Cliente</th>
                      <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Roteiro</th>
                      <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Valor</th>
                      <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Status</th>
                      <th style={{ paddingBottom: '12px', fontWeight: '600' }}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_activity.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 0' }}>
                          <div style={{ fontWeight: '600', color: '#FFFFFF' }}>{item.client_name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{item.client_email}</div>
                        </td>
                        <td style={{ padding: '14px 8px', color: '#94a3b8' }}>
                          {item.package_title || 'Roteiro Personalizado'}
                        </td>
                        <td style={{ padding: '14px 8px', fontFamily: "'Cinzel', serif", fontWeight: '700', color: '#f3e5ab' }}>
                          R$ {parseFloat(item.total_price || 0).toLocaleString('pt-BR')}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            ...(item.status === 'confirmada'
                              ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
                              : item.status === 'cancelada'
                              ? { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }
                              : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' })
                          }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px', color: '#64748b' }}>
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: '13px' }}>
                Nenhuma reserva registrada recentemente.
              </div>
            )}
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
