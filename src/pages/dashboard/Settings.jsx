import React, { useState } from 'react';
import { Building2, Shield, CreditCard, Check, Sparkles, User, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { agency, user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="Configurações da Agência"
      subtitle="Gerencie os dados institucionais, plano de assinatura e preferências da plataforma"
    >
      <div className="max-w-4xl space-y-8">
        
        {/* Plan status banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141d30] to-[#0c1220] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">Plano {agency?.subscription_plan || 'Starter'}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">Acesso ilimitado a pacotes, leads em tempo real e relatórios</p>
            </div>
          </div>

          <button className="btn-gold px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
            Fazer Upgrade VIP
          </button>
        </div>

        {/* Agency Profile Form */}
        <div className="p-8 rounded-2xl bg-[#0e1424] border border-white/5 space-y-6">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#d4af37]" />
            <span>Perfil Corporativo</span>
          </h3>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Configurações salvas com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Agência</label>
                <input
                  type="text"
                  defaultValue={agency?.name || 'Veluntu Travel'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  defaultValue={agency?.email || 'contato@agencia.com'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone Principal</label>
                <input
                  type="tel"
                  defaultValue={agency?.phone || '+55 11 99999-8888'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">País Sede</label>
                <input
                  type="text"
                  defaultValue={agency?.country || 'Brasil'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
