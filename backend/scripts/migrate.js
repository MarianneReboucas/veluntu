const pool = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Conectando e verificando schema do banco de dados Veluntu SaaS...');

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      await client.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Agencies Table
        CREATE TABLE IF NOT EXISTS public.agencies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          logo_url TEXT,
          country VARCHAR(100) DEFAULT 'Brasil',
          status VARCHAR(50) DEFAULT 'active',
          subscription_plan VARCHAR(50) DEFAULT 'starter',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Users Table
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Travel Packages Table
        CREATE TABLE IF NOT EXISTS public.packages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          destination VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
          currency VARCHAR(3) DEFAULT 'USD',
          duration_days INTEGER DEFAULT 1,
          included_services JSONB DEFAULT '[]'::jsonb,
          max_participants INTEGER DEFAULT 10,
          image_url TEXT,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Reservations / Inquiries Table
        CREATE TABLE IF NOT EXISTS public.reservations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
          agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
          client_name VARCHAR(255) NOT NULL,
          client_email VARCHAR(255) NOT NULL,
          client_phone VARCHAR(50),
          participants_count INTEGER DEFAULT 1,
          travel_date DATE,
          notes TEXT,
          status VARCHAR(50) DEFAULT 'pendente',
          total_price DECIMAL(10, 2) DEFAULT 0.00,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_agencies_email ON public.agencies(email);
        CREATE INDEX IF NOT EXISTS idx_users_agency_id ON public.users(agency_id);
        CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
        CREATE INDEX IF NOT EXISTS idx_packages_agency_id ON public.packages(agency_id);
        CREATE INDEX IF NOT EXISTS idx_reservations_package_id ON public.reservations(package_id);
        CREATE INDEX IF NOT EXISTS idx_reservations_agency_id ON public.reservations(agency_id);
      `);

      await client.query('COMMIT');
      console.log('✅ Tabelas e índices verificados/criados com sucesso!');
    } catch (queryErr) {
      await client.query('ROLLBACK');
      throw queryErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('❌ Erro na migração do banco de dados:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  initDatabase().then(() => {
    console.log('🎉 Migração concluída com sucesso!');
    process.exit(0);
  });
}

module.exports = initDatabase;
