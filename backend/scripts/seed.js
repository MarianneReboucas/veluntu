const db = require('../config/database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  let client;
  try {
    console.log('🌱 Populando dados iniciais no Neon PostgreSQL para Veluntu SaaS...');

    client = await db.getClient();
    await client.query('BEGIN');

    // 1. Criar Agência Modelo
    const agencyRes = await client.query(
      `INSERT INTO agencies (name, email, phone, country, subscription_plan, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [
        'Veluntu Luxury Travel Expeditions',
        'contato@veluntu.com',
        '+55 11 99999-8888',
        'Brasil',
        'enterprise',
        'active',
      ]
    );
    const agencyId = agencyRes.rows[0].id;

    // 2. Criar Usuário Admin Padrão
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await client.query(
      `INSERT INTO users (agency_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
      [agencyId, 'Marianne Admin', 'admin@veluntu.com', hashedPassword, 'admin']
    );

    // 3. Criar Pacotes Turísticos Exclusivos
    const packages = [
      {
        title: 'Safári Privativo no Serengeti & Cratera de Ngorongoro',
        description: 'Uma expedição inesquecível pelo coração da savana africana com hospedagem em lodges de ultra luxo, safáris guiados privativos e voo panorâmico de balão.',
        destination: 'Tanzânia',
        price: 5400.00,
        currency: 'USD',
        duration_days: 8,
        included_services: JSON.stringify(['Hospedagem 5 Estrelas', 'Guia Especialista em Português', 'Voo de Balão ao Amanhecer', 'Todas as Refeições Gourmet', 'Transfers em Avião Privativo']),
        max_participants: 6,
        image_url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Egito Milenar: Pirâmides VIP & Cruzeiro no Nilo em Dahabiya',
        description: 'Descubra os mistérios do Antigo Egito com acesso exclusivo fora do horário público às Pirâmides de Gizé, seguido de um cruzeiro relaxante em veleiro tradicional privativo no Nilo.',
        destination: 'Egito',
        price: 4200.00,
        currency: 'USD',
        duration_days: 10,
        included_services: JSON.stringify(['Egiptólogo PhD Privativo', 'Acesso VIP sem Filas', 'Cruzeiro Exclusivo Dahabiya', 'Jantar com vista para o Nilo']),
        max_participants: 8,
        image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'África do Sul Suprema: Cape Town & Vinhedos com Safári no Kruger',
        description: 'A combinação perfeita entre a cosmopolita Cidade do Cabo, degustações privadas em Stellenbosch e uma imersão na reserva privada de Sabi Sands.',
        destination: 'África do Sul',
        price: 4950.00,
        currency: 'USD',
        duration_days: 9,
        included_services: JSON.stringify(['Lodge Relais & Châteaux', 'Helicóptero sobre a Table Mountain', 'Degustação Sommelier VIP', 'Safári Noturno com Rangers']),
        max_participants: 10,
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Expedição Selvagem em Madagascar: Baobás & Ilhas Paradisíacas',
        description: 'Explore as florestas de pedra do Tsingy, a lendária Avenida dos Baobás e relaxe nas praias de águas cristalinas de Nosy Be.',
        destination: 'Madagascar',
        price: 4600.00,
        currency: 'USD',
        duration_days: 11,
        included_services: JSON.stringify(['Voo Fretado', 'Eco-Lodge de Charme', 'Mergulho com Tartarugas', 'Guia Naturalista Privado']),
        max_participants: 6,
        image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      },
    ];

    for (const pkg of packages) {
      await client.query(
        `INSERT INTO packages (agency_id, title, description, destination, price, currency, duration_days, included_services, max_participants, image_url, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, 'active')`,
        [
          agencyId,
          pkg.title,
          pkg.description,
          pkg.destination,
          pkg.price,
          pkg.currency,
          pkg.duration_days,
          pkg.included_services,
          pkg.max_participants,
          pkg.image_url,
        ]
      );
    }

    // 4. Criar Reservas de Demonstração
    await client.query(
      `INSERT INTO reservations (agency_id, client_name, client_email, client_phone, participants_count, travel_date, status, notes, total_price)
       VALUES 
       ($1, 'Carlos Eduardo Mendes', 'carlos.mendes@exemplo.com', '+55 11 98888-7777', 2, '2026-10-15', 'confirmada', 'Viagem de lua de mel. Solicitaram champanhe de boas-vindas.', 10800.00),
       ($1, 'Beatriz Alcantara', 'beatriz.a@exemplo.com', '+55 21 97777-6666', 4, '2026-11-05', 'pendente', 'Família com 2 adolescentes. Preferem quartos conectados.', 16800.00),
       ($1, 'Rodrigo Silveira', 'rodrigo.s@exemplo.com', '+55 31 96666-5555', 2, '2026-09-20', 'pendente', 'Interesse no roteiro do Egito com extensão no Cairo.', 8400.00)`,
      [agencyId]
    );

    await client.query('COMMIT');
    console.log('✅ Base de dados Neon populada com sucesso!');
    console.log('🔑 Credenciais de Admin: admin@veluntu.com / admin123');
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('❌ Erro ao popular banco Neon:', err.message);
  } finally {
    if (client) client.release();
    if (db.pool) await db.pool.end();
  }
};

if (require.main === module) {
  seed();
}

module.exports = seed;
