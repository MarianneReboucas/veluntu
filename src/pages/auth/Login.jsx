import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#070a12] px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#0c1220] border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#aa851e] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 mx-auto mb-4">
              <Compass className="w-7 h-7 text-[#0a0e17]" />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide">
              Portal da Agência
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Acesse o painel SaaS de gestão de roteiros e clientes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@veluntu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white placeholder-slate-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Senha de Acesso
                </label>
                <a href="#recuperar" className="text-[11px] text-[#d4af37] hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080c16] border border-white/10 text-sm text-white placeholder-slate-600 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl mt-4"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-slate-400">
            <span>Ainda não é uma agência parceira? </span>
            <Link to="/registro" className="text-[#d4af37] font-semibold hover:underline">
              Cadastre-se aqui
            </Link>
          </div>
        </div>

        {/* Credentials Tip */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-center text-[11px] text-slate-400">
          Credencial demonstrativa: <span className="text-[#f3e5ab] font-medium">admin@veluntu.com</span> / <span className="text-[#f3e5ab] font-medium">admin123</span>
        </div>

      </div>
    </div>
  );
}
