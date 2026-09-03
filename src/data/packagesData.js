export const curatedPackages = [
  {
    id: 'za-1',
    title: 'Expedição Clássica Kruger & Cape Town',
    destination: 'África do Sul',
    duration_days: 10,
    price: 24000,
    priceForTwo: 42000,
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
    priceForTwo: 64000,
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
    priceForTwo: 46000,
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
    title: 'MAR VERMELHO',
    destination: 'Egito',
    duration_days: 7,
    price: 9810000,
    priceForTwo: 18000000,
    pricePerPerson: 9810000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Descanso paradisíaco em resort 5 estrelas beira-mar e mergulhos exclusivos no Mar Vermelho com hospedagem 5 estrelas e voos internos.',
    included_services: [
      'Hospedagem 5 estrelas',
      'Guia em português',
      'Voos internos',
      'Traslados privativos',
    ],
    max_participants: 8,
  },
  {
    id: 'md-1',
    title: 'BAOBÁS',
    destination: 'Madagascar',
    duration_days: 7,
    price: 11790000,
    priceForTwo: 22000000,
    pricePerPerson: 11790000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    description: 'A mágica e imponente Alameda dos Baobás ao pôr do sol e expedições em reservas naturais para observação de fauna única.',
    included_services: [
      'Hospedagem 5 estrelas',
      'Guia em português',
      'Voos internos',
      'Traslados privativos',
    ],
    max_participants: 6,
  },
  {
    id: 'md-2',
    title: 'ILHAS',
    destination: 'Madagascar',
    duration_days: 7,
    price: 12465000,
    priceForTwo: 24000000,
    pricePerPerson: 12465000,
    currency: 'R$',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'Roteiro de contemplação e praias intocadas pelo arquipélago de Nosy Be e ilhas privadas de Tsarabanjina com vilas ecológicas.',
    included_services: [
      'Hospedagem 5 estrelas',
      'Guia em português',
      'Voos internos',
      'Traslados privativos',
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
