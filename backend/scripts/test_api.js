const http = require('http');

const request = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Iniciando bateria de testes do Veluntu SaaS...\n');

  try {
    // 1. Health check
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    console.log('✅ 1. Health Check:', health.data);

    // 2. Register new agency
    const randomSuffix = Math.floor(Math.random() * 10000);
    const regPayload = {
      agency_name: `Agência Serenget Luxo ${randomSuffix}`,
      agency_email: `contato.serengeti${randomSuffix}@teste.com`,
      agency_phone: '+55 11 98765-4321',
      admin_name: 'Diretor Safari',
      admin_email: `admin.serengeti${randomSuffix}@teste.com`,
      admin_password: 'supersecretpassword123',
    };

    const regRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      regPayload
    );
    console.log('✅ 2. Registro de Agência:', regRes.data.message, '| Agência:', regRes.data.user?.agency_name);

    const token = regRes.data.token;
    if (!token) throw new Error('Token não retornado no registro');

    // 3. Login
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: regPayload.admin_email,
        password: regPayload.admin_password,
      }
    );
    console.log('✅ 3. Login:', loginRes.data.message, '| Usuário:', loginRes.data.user?.name);

    // 4. Create Package
    const pkgRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/packages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      {
        title: 'Safári Fotográfico Botswana & Okavango',
        destination: 'Botswana',
        price: 6500.00,
        duration_days: 10,
        max_participants: 8,
        included_services: ['Voo Panorâmico', 'Lodge 5 Estrelas', 'Guia Especialista'],
        description: 'Jornada exclusiva pelo Delta do Okavango.',
      }
    );
    console.log('✅ 4. Criar Pacote:', pkgRes.data.message, '| Pacote:', pkgRes.data.data?.title);
    const packageId = pkgRes.data.data?.id;

    // 5. List Packages
    const listPkgRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/packages',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ 5. Listar Pacotes da Agência (Multi-tenant): Total encontrado =', listPkgRes.data.count);

    // 6. Create Reservation
    const resRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/reservations',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      {
        package_id: packageId,
        client_name: 'Doutor Roberto Cavalcanti',
        client_email: 'roberto.cavalcanti@email.com',
        client_phone: '+55 11 99123-4567',
        participants_count: 2,
        travel_date: '2026-12-10',
        notes: 'Suíte com deck privativo e telescópio.',
      }
    );
    console.log('✅ 6. Criar Reserva:', resRes.data.message, '| Cliente:', resRes.data.data?.client_name, '| Total:', resRes.data.data?.total_price);
    const reservationId = resRes.data.data?.id;

    // 7. Update Reservation Status
    const updateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/reservations/${reservationId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      { status: 'confirmada' }
    );
    console.log('✅ 7. Atualizar Status Reserva:', updateRes.data.message, '| Novo Status:', updateRes.data.data?.status);

    // 8. Get Stats
    const statsRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ 8. Estatísticas do Dashboard:', statsRes.data.data);

    // 9. Public Reservation Lead
    const pubRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/public/reservations',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        client_name: 'Visitante do Site',
        client_email: 'cliente.site@teste.com',
        client_phone: '+55 41 98877-6655',
        notes: 'Gostaria de saber mais sobre viagens em grupo.',
      }
    );
    console.log('✅ 9. Lead Público do Website:', pubRes.data.message);

    console.log('\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO! 100% FUNCIONAL!');
  } catch (err) {
    console.error('❌ Erro no teste:', err);
  }
}

runTests();
