const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const supabase = db.supabase;

const seedData = async () => {
  try {
    console.log('🌱 Populando dados de demonstração no Veluntu SaaS via Supabase...');

    // 1. Check/Insert demo agency
    const { data: existingAgencies } = await supabase
      .from('agencies')
      .select('id')
      .eq('email', 'contato@veluntu.com.br');

    let agencyId;
    if (!existingAgencies || existingAgencies.length === 0) {
      agencyId = uuidv4();
      const { error: agencyErr } = await supabase.from('agencies').insert({
        id: agencyId,
        name: 'Veluntu Travel Design',
        email: 'contato@veluntu.com.br',
        phone: '+55 (11) 99999-8888',
        country: 'Brasil',
        status: 'active',
        subscription_plan: 'enterprise',
      });
      if (agencyErr) throw new Error(agencyErr.message);
      console.log('✅ Agência demo criada.');
    } else {
      agencyId = existingAgencies[0].id;
      console.log('ℹ️ Agência demo já existe.');
    }

    // 2. Check/Insert demo admin user
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@veluntu.com.br');

    if (!existingUsers || existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const { error: userErr } = await supabase.from('users').insert({
        id: uuidv4(),
        agency_id: agencyId,
        name: 'Marianne Admin',
        email: 'admin@veluntu.com.br',
        password: hashedPassword,
        role: 'admin',
      });
      if (userErr) throw new Error(userErr.message);
      console.log('✅ Usuário admin criado: admin@veluntu.com.br / admin123');
    } else {
      console.log('ℹ️ Usuário admin demo já existe.');
    }

    // 3. Check/Insert demo packages
    const { data: existingPkgs } = await supabase
      .from('packages')
      .select('id')
      .eq('agency_id', agencyId);

    if (!existingPkgs || existingPkgs.length === 0) {
      const demoPackages = [
        {
          id: uuidv4(),
          agency_id: agencyId,
          title: 'Expedição África do Sul & Kruger Privativo',
          description: 'Lodges exclusivos na savana, degustações em Franschhoek e a rota cênica de Cape Town com guias privativos.',
          destination: 'África do Sul (Kruger & Cape Town)',
          price: 5800.00,
          currency: 'USD',
          duration_days: 10,
          included_services: ['Safári 4x4 Privativo', 'Lodge 5 Estrelas', 'Degustação de Vinhos', 'Voos Internos', 'Guia Especialista'],
          max_participants: 8,
          image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
        },
        {
          id: uuidv4(),
          agency_id: agencyId,
          title: 'Jornada pelo Nilo & Mistérios do Egito Antigo',
          description: 'Navegação em Dahabiya de luxo pelo Rio Nilo, acesso privativo às Pirâmides de Gizé e Templos de Luxor e Aswan.',
          destination: 'Egito (Cairo, Luxor & Aswan)',
          price: 4600.00,
          currency: 'USD',
          duration_days: 8,
          included_services: ['Cruzeiro Fluvial Boutique', 'Egiptólogo Exclusivo', 'Entradas VIP nos Monumentos', 'Hotéis Históricos'],
          max_participants: 12,
          image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
        },
        {
          id: uuidv4(),
          agency_id: agencyId,
          title: 'Paraíso Secreto de Madagascar & Ilhas Tropicais',
          description: 'Avenida dos Baobás, florestas com lêmures e refúgio exclusivo nas águas cristalinas do arquipélago de Nosy Be.',
          destination: 'Madagascar (Morondava & Nosy Be)',
          price: 5200.00,
          currency: 'USD',
          duration_days: 9,
          included_services: ['Resort Pé na Areia', 'Safári Noturno de Lêmures', 'Transfer em Barco Rápido', 'Pensão Completa'],
          max_participants: 6,
          image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        },
      ];

      const { error: pkgErr } = await supabase.from('packages').insert(demoPackages);
      if (pkgErr) throw new Error(pkgErr.message);
      console.log('✅ Pacotes de demonstração inseridos.');

      // Insert sample reservation
      const { error: resErr } = await supabase.from('reservations').insert({
        id: uuidv4(),
        package_id: demoPackages[0].id,
        agency_id: agencyId,
        client_name: 'Carlos Eduardo Mendes',
        client_email: 'carlos.mendes@email.com',
        client_phone: '+55 11 98765-4321',
        participants_count: 2,
        travel_date: '2026-10-15',
        status: 'confirmada',
        total_price: 11600.00,
        notes: 'Lua de mel. Preferência por suíte com vista para a savana.',
      });
      if (resErr) throw new Error(resErr.message);
      console.log('✅ Reserva de demonstração inserida.');
    } else {
      console.log('ℹ️ Pacotes demo já existem.');
    }

    console.log('🎉 Seed finalizado com sucesso!');
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
