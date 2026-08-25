import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, Users, DollarSign, Mail, Phone, 
  CheckCircle, Clock, XCircle, ChevronDown, Edit, Sparkles 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

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

  useEffect(() => {
    loadReservations();
  }, [statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateReservation(id, { status: newStatus });
      loadReservations();
    } catch (err) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza de que deseja remover este registro de reserva?')) return;
    try {
      await api.deleteReservation(id);
      loadReservations();
    } catch (err) {
      alert('Erro ao remover: ' + err.message);
    }
  };

  return (
    <DashboardLayout
      title="Gestão de Reservas & Leads"
      subtitle="Acompanhe solicitações de clientes, propostas emitidas e confirmações de embarque"
    >
      <div className="space-y-6">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1424] p-4 rounded-2xl border border-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou roteiro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white placeholder-slate-500 focus:border-[#d4af37] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['todas', 'pendente', 'confirmada', 'cancelada'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors capitalize whitespace-nowrap ${
                  statusFilter === st
                    ? 'btn-gold text-black'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        {loading ? (
          <div className="py-20 text-center text-[#d4af37]">
            <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Carregando solicitações...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="p-12 text-center bg-[#0e1424] border border-white/5 rounded-2xl">
            <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-white mb-1">Nenhuma solicitação encontrada</h3>
            <p className="text-xs text-slate-400">
              Quando novos clientes preencherem formulários no site, eles aparecerão automaticamente aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 hover:border-[#d4af37]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        res.status === 'confirmada'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : res.status === 'cancelada'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {res.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Recebido em {new Date(res.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-white">
                      {res.client_name}
                    </h4>
                    <p className="text-xs text-[#f3e5ab] font-medium mt-0.5">
                      Roteiro: {res.package_title || 'Consultoria VIP Personalizada'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                      <a href={`mailto:${res.client_email}`} className="hover:underline">{res.client_email}</a>
                    </span>
                    {res.client_phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                        <a href={`tel:${res.client_phone}`} className="hover:underline">{res.client_phone}</a>
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{res.participants_count} viajante(s)</span>
                    </span>
                    {res.travel_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Data: {new Date(res.travel_date).toLocaleDateString('pt-BR')}</span>
                      </span>
                    )}
                  </div>

                  {res.notes && (
                    <p className="text-xs text-slate-400 bg-black/30 p-3 rounded-xl border border-white/5 italic">
                      "{res.notes}"
                    </p>
                  )}
                </div>

                {/* Right side: Value & Status Controls */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Valor Previsto</span>
                    <span className="font-serif text-xl font-bold text-[#d4af37]">
                      USD ${parseFloat(res.total_price || 0).toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white focus:border-[#d4af37] outline-none"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmada">Confirmada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>

                    <button
                      onClick={() => handleDelete(res.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
