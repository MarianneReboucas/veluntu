import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Search, Sparkles, Filter } from 'lucide-react';
import { api } from '../../services/api';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);

  const destinationsList = ['Todos', 'Egito', 'Tanzânia', 'África do Sul', 'Madagascar', 'Quênia', 'Botsuana'];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const dest = selectedDestination === 'Todos' ? '' : selectedDestination;
        const res = await api.getPublicPackages(dest);
        if (res.success && res.data) {
          setPackages(res.data);
        }
      } catch (err) {
        console.error('Erro ao buscar pacotes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [selectedDestination]);

  return (
    <div className="min-h-screen bg-[#080c16] text-white py-12">
      <div className="container-custom">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#d4af37] text-xs uppercase tracking-widest font-bold">Coleções de Alto Padrão</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Roteiros & Expedições Exclusivas
          </h1>
          <p className="text-slate-400 text-sm">
            Selecione uma de nossas experiências consagradas ou solicite adaptações personalizadas para sua data e grupo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {destinationsList.map((dest) => {
            const active = (selectedDestination === '' && dest === 'Todos') || selectedDestination === dest;
            return (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest === 'Todos' ? '' : dest)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  active
                    ? 'btn-gold shadow-lg shadow-[#d4af37]/20 text-[#0b0f19]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                }`}
              >
                {dest}
              </button>
            );
          })}
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#d4af37]">
            <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm tracking-widest uppercase">Carregando experiências...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="py-16 text-center bg-[#0d1322] border border-white/5 rounded-2xl max-w-xl mx-auto p-8">
            <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-white mb-2">Nenhum pacote encontrado</h3>
            <p className="text-xs text-slate-400 mb-6">
              Não encontramos pacotes para este filtro no momento. Fale com nossos concierges para desenhar um roteiro sob medida.
            </p>
            <Link to="/planejar" className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase">
              Montar Roteiro Personalizado
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl overflow-hidden bg-[#0d1322] border border-[#d4af37]/20 flex flex-col hover:border-[#d4af37]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4af37]/5 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#080c16]/80 backdrop-blur-md border border-[#d4af37]/40 px-3 py-1 rounded-full text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#080c16]/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{pkg.duration_days} Dias</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#f3e5ab] transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {pkg.description}
                    </p>

                    {/* Included Services preview */}
                    {pkg.included_services && Array.isArray(pkg.included_services) && pkg.included_services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {pkg.included_services.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Investimento</span>
                      <span className="font-serif text-xl font-bold text-[#d4af37]">
                        {pkg.currency} ${parseFloat(pkg.price).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <Link
                      to={`/pacotes/${pkg.id}`}
                      className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
