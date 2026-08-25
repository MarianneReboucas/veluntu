import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles, Compass } from 'lucide-react';

export default function Destinations() {
  const destinations = [
    {
      id: 'egito',
      title: 'Egito Milenar',
      tagline: 'O Berço dos Faraós & O Nilo',
      image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      description: 'Uma imersão privada de Cairo a Luxor e Aswan. Navegação exclusiva em veleiros tradicionais Dahabiya, acesso privativo aos templos de Abu Simbel e voo de balão sobre Tebas.',
      highlights: ['Pirâmides de Gizé com Acesso VIP', 'Cruzeiro Privativo Dahabiya', 'Egiptólogo PhD Dedicado', 'Túmulo de Tutancâmon'],
    },
    {
      id: 'tanzania',
      title: 'Tanzânia & Serengeti',
      tagline: 'O Espetáculo Selvagem da Terra',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      description: 'Testemunhe a Grande Migração dos gnus e zebras no Serengeti e explore a colossal Cratera de Ngorongoro. Finalize com dias de descanso absoluto nas praias de Zanzibar.',
      highlights: ['Lodges Singita & Four Seasons', 'Safári Aéreo em Balão ao Nascer do Sol', 'Encontro com Tribos Maasai Tradicionais', 'Resorts Privados em Zanzibar'],
    },
    {
      id: 'africa-do-sul',
      title: 'África do Sul',
      tagline: 'Cosmopolitismo, Vinhos & Big Five',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      description: 'A fascinante Cidade do Cabo, hotéis boutique de luxo, as vinícolas centenárias de Franschhoek e a adrenalina dos safáris no Kruger e nas reservas de Sabi Sands.',
      highlights: ['Degustações Privadas com Sommeliers', 'Safári Noturno nos Melhores Lodges', 'Helicóptero sobre a Table Mountain', 'Gastronomia Premiada Michelin'],
    },
    {
      id: 'madagascar',
      title: 'Madagascar',
      tagline: 'Santuário de Biodiversidade',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      description: 'Uma ilha incomparável no planeta. Caminhe pela mágica Avenida dos Baobás, observe lêmures em seu habitat preservado e relaxe em ilhas secretas com águas cristalinas.',
      highlights: ['Avenida dos Baobás ao Pôr do Sol', 'Mergulho com Tartarugas em Nosy Be', 'Expedição Tsingy de Bemaraha', 'Eco-Lodges de Ultra Charme'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c16] text-white py-16">
      <div className="container-custom">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#d4af37] text-xs uppercase tracking-widest font-bold">Catálogo de Territórios</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Destinos Extraordinários na África
          </h1>
          <p className="text-slate-400 text-sm">
            Conheça as regiões mais emblemáticas do continente africano trabalhadas com o padrão inegociável da Veluntu.
          </p>
        </div>

        <div className="space-y-12">
          {destinations.map((dest, idx) => (
            <div
              key={dest.id}
              className={`p-6 sm:p-8 rounded-3xl bg-[#0e1424] border border-[#d4af37]/20 flex flex-col lg:flex-row items-center gap-8 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="w-full lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden relative group">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#f3e5ab] border border-white/10 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{dest.title}</span>
                </div>
              </div>

              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {dest.tagline}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {dest.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {dest.description}
                </p>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Destaques Exclusivos:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {dest.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to={`/pacotes?destination=${encodeURIComponent(dest.title.split(' ')[0])}`}
                    className="btn-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <span>Ver Roteiros Disponíveis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
