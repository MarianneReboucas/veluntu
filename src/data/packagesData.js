export const curatedPackages = [
  {
    id: 'za-1',
    title: 'Expedição Clássica Kruger & Cape Town',
    destination: 'África do Sul',
    duration_days: 10,
    price: 24000,
    priceForTwo: 42000,   // Desconto de R$ 6.000 para casal
    pricePerPerson: 24000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    description: 'Vivencie os Big Five em lodges 5 estrelas no Parque Kruger com safáris privativos em 4x4 abertos, seguido por dias deslumbrantes em Cape Town com subida na Table Mountain e degustações exclusivas nas vinícolas de Franschhoek.',
    included_services: [
      'Safáris dos Big Five no Kruger',
      'Lodge 5 estrelas all-inclusive',
      'Hospedagem boutique em Cape Town',
      'Degustações nas vinícolas de Franschhoek',
      'Concierge bilíngue Veluntu 24h',
    ],
    max_participants: 8,
  },
  {
    id: 'za-2',
    title: 'Safári Ultra Luxo Sabi Sands & Rota dos Vinhos',
    destination: 'África do Sul',
    duration_days: 12,
    price: 36000,
    priceForTwo: 64000,   // Desconto de R$ 8.000 para casal
    pricePerPerson: 36000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Experiência de alta gastronomia e vida selvagem com vilas privativas na reserva fechada de Sabi Sands, voo cênico de helicóptero sobre Cape Town e acomodações em vinhedos históricos de Stellenbosch.',
    included_services: [
      'Vilas privativas com piscina aquecida',
      'Reserva privada de Sabi Sands',
      'Voo panorâmico de helicóptero',
      'Jantares harmonizados com sommeliers',
      'Aeronaves fretadas entre destinos',
    ],
    max_participants: 6,
  },
  {
    id: 'eg-1',
    title: 'Egito Milenar & Cruzeiro Privativo no Rio Nilo',
    destination: 'Egito',
    duration_days: 11,
    price: 26000,
    priceForTwo: 46000,   // Desconto de R$ 6.000 para casal
    pricePerPerson: 26000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    description: 'Descubra as Grandes Pirâmides de Gizé com egiptólogo PhD privativo fora do horário público, seguido de navegação exclusiva em veleiro tradicional Dahabiya pelo Rio Nilo com serviço de alta gastronomia.',
    included_services: [
      'Acesso privativo sem filas às Pirâmides',
      'Cruzeiro exclusivo em Dahabiya no Nilo',
      'Templos de Luxor, Karnak & Vale dos Reis',
      'Egiptólogo privativo em português',
      'Hospedagem em palácios históricos no Cairo',
    ],
    max_participants: 8,
  },
  {
    id: 'eg-2',
    title: 'Rota dos Faraós & Oásis do Mar Vermelho',
    destination: 'Egito',
    duration_days: 14,
    price: 32000,
    priceForTwo: 56000,   // Desconto de R$ 8.000 para casal
    pricePerPerson: 32000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
    description: 'Imersão histórica e espiritual profunda pelo Cairo Antigo, Monte Sinai ao amanhecer, navegação pelos templos do Alto Egito e descanso paradisíaco em resort 5 estrelas beira-mar em Hurghada.',
    included_services: [
      'Subida ao Monte Sinai ao amanhecer',
      'Resort 5 estrelas beira-mar no Mar Vermelho',
      'Mergulho e passeios marítimos privativos',
      'Cruzeiro pelo Rio Nilo com pensão completa',
      'Transfers VIP em jatos executivos regionais',
    ],
    max_participants: 8,
  },
  {
    id: 'md-1',
    title: 'Santuários Naturais & Alameda dos Baobás',
    destination: 'Madagascar',
    duration_days: 10,
    price: 28000,
    priceForTwo: 50000,   // Desconto de R$ 6.000 para casal
    pricePerPerson: 28000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    description: 'A mágica e imponente Alameda dos Baobás ao pôr do sol, expedições em reservas naturais para observação de lêmures raros e relaxamento exclusivo nas águas mornas e cristalinas de Nosy Be.',
    included_services: [
      'Alameda dos Baobás com fotógrafo privativo',
      'Santuários de lêmures em Andasibe',
      'Eco-resort de luxo pé na areia em Nosy Be',
      'Voos fretados privativos internos',
      'Guia naturalista especialista dedicado',
    ],
    max_participants: 6,
  },
  {
    id: 'md-2',
    title: 'Ilhas Tropicais de Nosy Be & Florestas Raras',
    destination: 'Madagascar',
    duration_days: 12,
    price: 34000,
    priceForTwo: 60000,   // Desconto de R$ 8.000 para casal
    pricePerPerson: 34000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'Roteiro de contemplação e praias intocadas pelo arquipélago de Nosy Be e ilhas privadas de Tsarabanjina, com passeios de catamarã, mergulhos exclusivos e vilas ecológicas de ultra luxo.',
    included_services: [
      'Vilas privativas nas ilhas de Tsarabanjina',
      'Catamarã privativo com tripulação e chef',
      'Snorkeling e mergulho com tartarugas marinhas',
      'Safári botânico e de fauna endêmica',
      'Concierge Veluntu com atendimento 24h',
    ],
    max_participants: 6,
  },
];

export function getPackagesByDestination(destination) {
  if (!destination || destination === 'all' || destination === 'Todos os Destinos') {
    return curatedPackages;
  }

  const normalized = destination.toLowerCase().trim();
  return curatedPackages.filter((p) =>
    p.destination.toLowerCase().includes(normalized) ||
    normalized.includes(p.destination.toLowerCase())
  );
}

export function getPackageById(id) {
  return curatedPackages.find((p) => p.id === id) || null;
}
