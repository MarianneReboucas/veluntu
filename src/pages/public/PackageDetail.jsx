import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Users, DollarSign, Check, ArrowRight, ShieldCheck, 
  Send, Sparkles, AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';

export default function PackageDetail() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking Form State
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    participants_count: 2,
    travel_date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.getPublicPackages();
        if (res.success && res.data) {
          const found = res.data.find((p) => p.id === id);
          if (found) {
            setPkg(found);
          } else {
            setError('Roteiro não encontrado.');
          }
        }
      } catch (err) {
        setError('Erro ao carregar detalhes do pacote.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.createPublicReservation({
        ...form,
        package_id: id,
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Sua solicitação foi enviada com sucesso!');
        setForm({
          client_name: '',
          client_email: '',
          client_phone: '',
          participants_count: 2,
          travel_date: '',
          notes: '',
        });
      }
    } catch (err) {
      setError(err.message || 'Erro ao enviar sua solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c16] flex items-center justify-center text-[#d4af37]">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-[#080c16] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md p-8 bg-[#0e1424] border border-white/10 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">{error || 'Pacote não encontrado'}</h2>
          <p className="text-xs text-slate-400 mb-6">O roteiro selecionado pode ter sido desativado ou o link está incorreto.</p>
          <Link to="/pacotes" className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase">
            Ver Todos os Roteiros
          </Link>
        </div>
      </div>
    );
  }

  const services = Array.isArray(pkg.included_services)
    ? pkg.included_services
    : typeof pkg.included_services === 'string'
    ? JSON.parse(pkg.included_services || '[]')
    : [];

  return (
    <div className="min-h-screen bg-[#080c16] text-white pb-20">
      
      {/* Banner Top */}
      <div className="relative h-[55vh] min-h-[400px]">
        <img
          src={pkg.image_url}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/60 to-transparent" />

        <div className="container-custom absolute bottom-10 left-0 right-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3.5 py-1 rounded-full bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {pkg.destination}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              {pkg.duration_days} Dias de Viagem
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white max-w-3xl leading-tight">
            {pkg.title}
          </h1>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container-custom mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Main Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description */}
            <div className="p-8 rounded-2xl bg-[#0e1424] border border-white/5 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#f3e5ab]">Sobre a Experiência</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
            </div>

            {/* Included Services */}
            <div className="p-8 rounded-2xl bg-[#0e1424] border border-white/5 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#f3e5ab]">Inclusões de Alto Padrão</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.length > 0 ? (
                  services.map((srv, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#d4af37]" />
                      </div>
                      <span className="text-xs text-slate-200 font-medium leading-relaxed">{srv}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Todos os transfers, hospedagem 5 estrelas e guias privativos inclusos.</p>
                )}
              </div>
            </div>

            {/* VIP Guarantee */}
            <div className="p-6 rounded-2xl bg-[#0a1626] border border-[#d4af37]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white">Garantia Veluntu Black</h4>
                <p className="text-xs text-slate-300">
                  Assistência 24h em português, seguros de viagem com cobertura internacional integral e cancelamento flexível.
                </p>
              </div>
            </div>

          </div>

          {/* Right / Booking Form Card */}
          <div>
            <div className="sticky top-28 p-8 rounded-2xl bg-[#0e1424] border border-[#d4af37]/40 shadow-2xl shadow-[#d4af37]/10">
              
              <div className="border-b border-white/10 pb-6 mb-6">
                <span className="text-xs text-slate-400 uppercase tracking-widest block">Investimento Privativo</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-[#d4af37]">
                    {pkg.currency} ${parseFloat(pkg.price).toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-slate-400">/ por pessoa</span>
                </div>
              </div>

              {successMsg ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="font-serif text-lg font-bold text-emerald-300">Solicitação Recebida!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{successMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Seu Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo"
                      value={form.client_name}
                      onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail para Contato</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={form.client_email}
                      onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+55 11 9..."
                        value={form.client_phone}
                        onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Viajantes</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={form.participants_count}
                        onChange={(e) => setForm({ ...form, participants_count: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Data Prevista de Embarque</label>
                    <input
                      type="date"
                      value={form.travel_date}
                      onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Observações ou Preferências</label>
                    <textarea
                      rows="2"
                      placeholder="Ex: Aniversário de casamento, preferências de acomodação..."
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white focus:border-[#d4af37] outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-gold py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg mt-2"
                  >
                    {submitting ? (
                      <span>Enviando...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Solicitar Roteiro VIP</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
