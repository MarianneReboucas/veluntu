import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Building2, User, Mail, Lock, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    agency_name: '',
    agency_email: '',
    agency_phone: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao registrar agência.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#070a12] px-4 py-12">
      <div className="w-full max-w-xl">
        
        <div className="p-8 md:p-10 rounded-3xl bg-[#0c1220] border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa851e] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 mx-auto mb-4">
              <Building2 className="w-6 h-6 text-[#0a0e17]" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
              Credenciamento de Agência
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cadastre sua agência e comece a vender roteiros de alto padrão na África
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Agency Data */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">Dados da Agência</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Fantasia da Agência</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aurora Luxury Journeys"
                  value={formData.agency_name}
                  onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Institucional</label>
                  <input
                    type="email"
                    required
                    placeholder="contato@agencia.com"
                    value={formData.agency_email}
                    onChange={(e) => setFormData({ ...formData, agency_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+55 11 9999-8888"
                    value={formData.agency_phone}
                    onChange={(e) => setFormData({ ...formData, agency_phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Admin User Data */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">Administrador Principal</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Marianne Rebouças"
                  value={formData.admin_name}
                  onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Acesso (Login)</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@agencia.com"
                    value={formData.admin_email}
                    onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Senha Provisória</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Mínimo 6 dígitos"
                    value={formData.admin_password}
                    onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl mt-6"
            >
              {loading ? (
                <span>Criando Agência...</span>
              ) : (
                <>
                  <span>Criar Conta de Agência</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            <span>Já possui uma conta ativa? </span>
            <Link to="/login" className="text-[#d4af37] font-semibold hover:underline">
              Fazer Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
