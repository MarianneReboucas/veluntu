import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, MapPin, Calendar, DollarSign, 
  X, Check, Image as ImageIcon, Sparkles, AlertCircle 
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { api } from '../../services/api';

export default function PackagesAdmin() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    price: '',
    currency: 'USD',
    duration_days: 7,
    included_services: '',
    max_participants: 8,
    image_url: '',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadPackages = async () => {
    try {
      setLoading(true);
      const res = await api.getPackages(search);
      if (res.success && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Erro ao carregar pacotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [search]);

  const handleOpenModal = (pkg = null) => {
    setFormError('');
    if (pkg) {
      setEditingId(pkg.id);
      const services = Array.isArray(pkg.included_services)
        ? pkg.included_services.join(', ')
        : pkg.included_services || '';

      setFormData({
        title: pkg.title,
        description: pkg.description || '',
        destination: pkg.destination,
        price: pkg.price,
        currency: pkg.currency || 'USD',
        duration_days: pkg.duration_days || 7,
        included_services: services,
        max_participants: pkg.max_participants || 8,
        image_url: pkg.image_url || '',
        status: pkg.status || 'active',
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        destination: '',
        price: '',
        currency: 'USD',
        duration_days: 7,
        included_services: 'Hospedagem 5 estrelas, Guia em português, Voos internos, Traslados privativos',
        max_participants: 8,
        image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
        status: 'active',
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      const servicesArray = formData.included_services
        ? formData.included_services.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        included_services: servicesArray,
      };

      if (editingId) {
        await api.updatePackage(editingId, payload);
      } else {
        await api.createPackage(payload);
      }

      setModalOpen(false);
      loadPackages();
    } catch (err) {
      setFormError(err.message || 'Erro ao salvar pacote.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza de que deseja excluir este pacote turístico?')) return;

    try {
      await api.deletePackage(id);
      loadPackages();
    } catch (err) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  return (
    <DashboardLayout
      title="Gestão de Pacotes & Roteiros"
      subtitle="Cadastre e gerencie as expedições disponíveis no catálogo da sua agência"
      action={
        <button
          onClick={() => handleOpenModal()}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Roteiro</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1424] p-4 rounded-2xl border border-white/5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por título ou país..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white placeholder-slate-500 focus:border-[#d4af37] outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">
            Mostrando <strong className="text-white">{packages.length}</strong> pacote(s)
          </span>
        </div>

        {/* Packages Table / Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#d4af37]">
            <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Carregando roteiros...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center bg-[#0e1424] border border-white/5 rounded-2xl">
            <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-white mb-1">Nenhum pacote cadastrado</h3>
            <p className="text-xs text-slate-400 mb-6">Crie seu primeiro roteiro para exibi-lo no site da agência.</p>
            <button
              onClick={() => handleOpenModal()}
              className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase"
            >
              Criar Novo Roteiro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#0e1424] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-[#d4af37]/40 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#f3e5ab] border border-white/10 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                    {pkg.status}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white mb-1.5 line-clamp-1">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mb-4">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Valor Base</span>
                        <span className="font-serif font-bold text-[#d4af37] text-base">
                          {pkg.currency} ${parseFloat(pkg.price).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">Duração</span>
                        <span className="text-xs text-slate-300 font-semibold">{pkg.duration_days} dias</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(pkg)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                        title="Excluir Pacote"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal Criar / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0e1424] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {editingId ? 'Editar Roteiro' : 'Novo Roteiro Exclusivo'}
                </h3>
                <p className="text-xs text-slate-400">Preencha os detalhes do roteiro no catálogo</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Expedição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Safári Privativo em Ngorongoro & Serengeti"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destino / País</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tanzânia"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preço por Pessoa (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 4850.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duração (Dias)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Máx. Participantes</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  >
                    <option value="active">Ativo (Público)</option>
                    <option value="draft">Rascunho</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Foto de Capa (Unsplash / CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inclusões VIP (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Hospedagem 5★, Guia Privativo, Voos Cênicos, Refeições Gourmet"
                  value={formData.included_services}
                  onChange={(e) => setFormData({ ...formData, included_services: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição do Roteiro</label>
                <textarea
                  rows="4"
                  placeholder="Descreva a magia, os lodges e a programação da viagem..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white focus:border-[#d4af37] outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
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
