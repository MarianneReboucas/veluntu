import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, CalendarCheck, DollarSign, Users, TrendingUp, PlusCircle, 
  ArrowUpRight, Clock, CheckCircle2, XCircle, Sparkles 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo Pacote</span>
        </Link>
      }
    >
      {loading ? (
        <div className="py-20 text-center text-[#d4af37]">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs uppercase tracking-widest">Sincronizando dados...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Revenue */}
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Receita Total</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                USD ${parseFloat(stats?.revenue?.total || 0).toLocaleString('pt-BR')}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                <span>USD ${parseFloat(stats?.revenue?.confirmed || 0).toLocaleString('pt-BR')} confirmados</span>
              </div>
            </div>

            {/* Total Reservations */}
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total de Reservas</span>
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {stats?.reservations?.total || 0}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-amber-400">
                <Clock className="w-3 h-3" />
                <span>{stats?.reservations?.pending || 0} pendentes de aprovação</span>
              </div>
            </div>

            {/* Total Packages */}
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pacotes no Catálogo</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {stats?.packages?.total || 0}
              </p>
              <p className="mt-2 text-[11px] text-slate-400">
                Ticket Médio: USD ${parseFloat(stats?.packages?.avg_price || 0).toFixed(0)}
              </p>
            </div>

            {/* Confirmed Rate */}
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Taxa de Conversão</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {stats?.reservations?.total > 0
                  ? Math.round(((stats?.reservations?.confirmed || 0) / stats.reservations.total) * 100)
                  : 0}%
              </p>
              <p className="mt-2 text-[11px] text-slate-400">
                {stats?.reservations?.confirmed || 0} clientes confirmados
              </p>
            </div>

          </div>

          {/* Recent Bookings Table */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#0e1424] border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Últimas Solicitações de Viagem</h3>
                <p className="text-xs text-slate-400">Clientes interessados em roteiros nos últimos dias</p>
              </div>
              <Link
                to="/dashboard/reservas"
                className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
              >
                <span>Ver Todas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Roteiro</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recent_activity.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <p className="font-semibold text-white">{item.client_name}</p>
                          <p className="text-[11px] text-slate-400">{item.client_email}</p>
                        </td>
                        <td className="py-4 text-slate-300">
                          {item.package_title || 'Roteiro Personalizado'}
                        </td>
                        <td className="py-4 font-serif font-bold text-[#f3e5ab]">
                          USD ${parseFloat(item.total_price || 0).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'confirmada'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : item.status === 'cancelada'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 text-slate-400">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Nenhuma reserva registrada recentemente.
              </div>
            )}
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
