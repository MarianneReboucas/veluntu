import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Compass, LayoutDashboard, Package, CalendarCheck, BarChart3, Settings, 
  LogOut, PlusCircle, Bell, User, ExternalLink, Menu, X, Shield 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, title, subtitle, action }) {
  const { user, agency, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Pacotes & Roteiros', path: '/dashboard/pacotes', icon: Package },
    { label: 'Reservas & Clientes', path: '/dashboard/reservas', icon: CalendarCheck },
    { label: 'Estatísticas', path: '/dashboard/estatisticas', icon: BarChart3 },
    { label: 'Configurações', path: '/dashboard/configuracoes', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0e1424] border-b border-[#d4af37]/20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
            <Compass className="w-5 h-5 text-black" />
          </div>
          <span className="font-serif font-bold text-lg tracking-wider text-white">VELUNTU</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#d4af37]" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-[#0c1220] border-r border-[#d4af37]/15 flex flex-col justify-between z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa851e] flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
                <Compass className="w-6 h-6 text-[#0a0e17]" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold tracking-wider text-white">VELUNTU</h1>
                <span className="text-[10px] tracking-widest text-[#d4af37] uppercase font-semibold">
                  SaaS Multi-Tenant
                </span>
              </div>
            </Link>
          </div>

          {/* Agency Badge */}
          <div className="m-4 p-3.5 rounded-xl bg-[#141d30] border border-[#d4af37]/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#f3e5ab] font-bold text-sm">
                {agency?.name ? agency.name.charAt(0) : 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="text-sm font-semibold text-white truncate">
                  {agency?.name || 'Sua Agência'}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#d4af37]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="uppercase tracking-wider font-semibold">Plano {agency?.subscription_plan || 'Starter'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent border-l-4 border-[#d4af37] text-[#f3e5ab] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-white/5 bg-[#0a0e18]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-medium">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user?.name || 'Administrador'}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top bar inside dashboard */}
        <header className="px-6 py-5 bg-[#0b101c]/80 backdrop-blur-md border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Ver Site Público</span>
            </Link>

            {action}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
