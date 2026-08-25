import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function Contact() {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createPublicReservation({
        client_name: form.client_name,
        client_email: form.client_email,
        client_phone: form.client_phone,
        notes: `[Mensagem via Fale Conosco]: ${form.notes}`,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-white py-16">
      <div className="container-custom">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#d4af37] text-xs uppercase tracking-widest font-bold">Atendimento Privativo</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Fale com a Veluntu
          </h1>
          <p className="text-slate-400 text-sm">
            Nossa equipe de concierge está à disposição para esclarecer dúvidas e apresentar o portfólio completo de expedições.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          
          {/* Info cards */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">E-mail Corporativo</h3>
              <p className="text-xs text-slate-400">concierge@veluntu.com</p>
              <p className="text-[11px] text-[#d4af37]">Resposta em menos de 2h úteis</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">Central Telefônica & WhatsApp</h3>
              <p className="text-xs text-slate-400">+55 11 99999-8888</p>
              <p className="text-[11px] text-emerald-400">Atendimento 24/7 para clientes em viagem</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1424] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 flex items-center justify-center text-[#d4af37]">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">Bases Operacionais</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                São Paulo (Itaim Bibi) | Cape Town (V&A Waterfront) | Cairo (Zamalek)
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-[#0e1424] border border-[#d4af37]/30 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Mensagem Enviada!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Agradecemos seu contato. Nosso concierge retornará em breve pelo canal de sua preferência.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-white mb-2">Envie sua Mensagem</h3>
                
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="carlos@exemplo.com"
                      value={form.client_email}
                      onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+55 11 9..."
                      value={form.client_phone}
                      onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Como podemos te ajudar?</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Descreva sua dúvida, interesse em destinos ou solicitação de parceria..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-xs text-white focus:border-[#d4af37] outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl mt-2"
                >
                  {loading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
