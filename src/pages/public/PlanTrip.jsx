import React, { useState } from 'react';
import { Compass, Sparkles, Send, CheckCircle2, MapPin, Calendar, DollarSign, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function PlanTrip() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    destination: 'Tanzânia',
    participants_count: 2,
    travel_date: '',
    budget_range: 'USD 5.000 a 10.000',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const destinations = ['Egito & Nilo', 'Tanzânia & Serengeti', 'África do Sul & Kruger', 'Madagascar', 'Quênia & Maasai Mara', 'Botsuana & Okavango', 'Personalizado / Múltiplos Países'];
  const budgets = ['USD 3.000 a 5.000 por pessoa', 'USD 5.000 a 10.000 por pessoa', 'Acima de USD 10.000 por pessoa (Ultra Luxo)'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createPublicReservation({
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        participants_count: form.participants_count,
        travel_date: form.travel_date,
        notes: `Destino Desejado: ${form.destination} | Faixa de Orçamento: ${form.budget_range} | Detalhes: ${form.notes}`,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-white py-16">
      <div className="container-custom max-w-3xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#d4af37] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Consultoria Privativa Sob Medida</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-1 mb-4">
            Desenhe Seu Roteiro dos Sonhos
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Informe suas preferências de viagem para que nossos especialistas desenhem uma jornada exclusiva e impecável.
          </p>
        </div>

        {/* Form or Success message */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e1424] border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/5">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">Solicitação Recebida com Sucesso!</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Um de nossos especialistas em África entrará em contato em até 24 horas úteis com uma proposta desenhada especialmente para você.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Personal info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Juliana Silveira"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">E-mail Principal</label>
                  <input
                    type="email"
                    required
                    placeholder="juliana@exemplo.com"
                    value={form.client_email}
                    onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+55 (11) 98888-7777"
                    value={form.client_phone}
                    onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quantidade de Viajantes</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.participants_count}
                    onChange={(e) => setForm({ ...form, participants_count: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Destination & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Destino de Interesse</label>
                  <select
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d} value={d} className="bg-[#0e1424]">{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimativa de Investimento</label>
                  <select
                    value={form.budget_range}
                    onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  >
                    {budgets.map((b) => (
                      <option key={b} value={b} className="bg-[#0e1424]">{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mês ou Data Pretendida de Embarque</label>
                <input
                  type="date"
                  value={form.travel_date}
                  onChange={(e) => setForm({ ...form, travel_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Desejos Especiais, Ocasião ou Restrições</label>
                <textarea
                  rows="3"
                  placeholder="Ex: Viagem de lua de mel, interesse em safári aéreo e degustação de vinhos..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white focus:border-[#d4af37] outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl mt-4"
              >
                {loading ? (
                  <span>Enviando Projeto...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Solicitar Projeto de Viagem Exclusivo</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
