const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

// 1. Supabase Client Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://ulszcjjbwptghmptjinw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3pjampid3B0Z2htcHRqaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxODcsImV4cCI6MjEwMjczNDE4N30.6eAWOxjBfVZBTPxcHUMjmv0ttno0FSAwovFQN5wTaq8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// 2. Direct PostgreSQL Connection Pool (Supabase Postgres Database URL)
let pool = null;

const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 5432;
    const db = process.env.DB_NAME || 'postgres';
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASSWORD;
    return `postgresql://${user}:${pass}@${host}:${port}/${db}?sslmode=require`;
  }
  return null;
};

const connectionString = getConnectionString();

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.warn('⚠️ Erro no Pool Postgres Supabase (utilizando fallback Supabase Client):', err.message);
    });
  } catch (e) {
    console.warn('Postgres direct pool não inicializado, fallback para Supabase JS:', e.message);
  }
}

const db = {
  supabase,
  pool,

  /**
   * Helper unificado para executar queries no Supabase Postgres
   */
  async query(text, params = []) {
    // 1. Se direct pg pool estiver ativo, executa via SQL nativo
    if (pool) {
      try {
        return await pool.query(text, params);
      } catch (err) {
        console.warn('Falha no pool direto, tentando via Supabase API:', err.message);
      }
    }

    // 2. Fallback inteligente para Supabase JS Client API
    const trimmed = text.trim();
    const upper = trimmed.toUpperCase();

    // -------------------------------------------------------------
    // SELECT QUERIES
    // -------------------------------------------------------------
    if (upper.startsWith('SELECT')) {
      // Users + Agencies Join
      if (upper.includes('FROM USERS') && upper.includes('JOIN AGENCIES')) {
        if (upper.includes('WHERE LOWER(U.EMAIL) = LOWER($1)') || upper.includes('WHERE U.EMAIL = $1') || upper.includes('LOWER(U.EMAIL) = LOWER')) {
          const email = params[0]?.toLowerCase()?.trim();
          const { data: users, error } = await supabase
            .from('users')
            .select(`
              id, name, email, password, role, agency_id,
              agencies:agency_id ( id, name, subscription_plan, status, logo_url, email, phone, country )
            `)
            .ilike('email', email);

          if (error) throw new Error(error.message);

          const rows = (users || []).map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role,
            agency_id: u.agency_id,
            agency_name: u.agencies?.name,
            subscription_plan: u.agencies?.subscription_plan,
            agency_status: u.agencies?.status,
            logo_url: u.agencies?.logo_url,
          }));

          return { rows, rowCount: rows.length };
        }

        if (upper.includes('WHERE U.ID = $1')) {
          const userId = params[0];
          const { data: users, error } = await supabase
            .from('users')
            .select(`
              id, name, email, role, created_at,
              agencies:agency_id ( id, name, email, phone, country, subscription_plan, logo_url )
            `)
            .eq('id', userId);

          if (error) throw new Error(error.message);

          const rows = (users || []).map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            created_at: u.created_at,
            agency_id: u.agencies?.id,
            agency_name: u.agencies?.name,
            agency_email: u.agencies?.email,
            agency_phone: u.agencies?.phone,
            country: u.agencies?.country,
            subscription_plan: u.agencies?.subscription_plan,
            logo_url: u.agencies?.logo_url,
          }));

          return { rows, rowCount: rows.length };
        }
      }

      // Simple Agencies Select
      if (upper.includes('FROM AGENCIES')) {
        if (upper.includes('WHERE LOWER(EMAIL) = LOWER($1)') || upper.includes('EMAIL = $1')) {
          const { data, error } = await supabase.from('agencies').select('*').ilike('email', params[0]);
          if (error) throw new Error(error.message);
          return { rows: data || [], rowCount: (data || []).length };
        }
        if (upper.includes('WHERE ID = $1')) {
          const { data, error } = await supabase.from('agencies').select('*').eq('id', params[0]);
          if (error) throw new Error(error.message);
          return { rows: data || [], rowCount: (data || []).length };
        }
        const { data, error } = await supabase.from('agencies').select('*');
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      // Simple Users Select
      if (upper.includes('FROM USERS')) {
        if (upper.includes('WHERE LOWER(EMAIL) = LOWER($1)') || upper.includes('EMAIL = $1')) {
          const { data, error } = await supabase.from('users').select('*').ilike('email', params[0]);
          if (error) throw new Error(error.message);
          return { rows: data || [], rowCount: (data || []).length };
        }
        if (upper.includes('WHERE ID = $1')) {
          const { data, error } = await supabase.from('users').select('*').eq('id', params[0]);
          if (error) throw new Error(error.message);
          return { rows: data || [], rowCount: (data || []).length };
        }
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      // Packages Select
      if (upper.includes('FROM PACKAGES')) {
        let query = supabase.from('packages').select('*');
        if (upper.includes('AGENCY_ID = $1') && upper.includes('ID = $1 AND AGENCY_ID = $2')) {
          query = query.eq('id', params[0]).eq('agency_id', params[1]);
        } else if (upper.includes('WHERE ID = $1')) {
          query = query.eq('id', params[0]);
        } else if (upper.includes('AGENCY_ID = $1')) {
          query = query.eq('agency_id', params[0]);
        }
        if (upper.includes("STATUS = 'ACTIVE'") || upper.includes('STATUS = $')) {
          query = query.eq('status', 'active');
        }
        if (params.length > 0 && typeof params[params.length - 1] === 'string' && params[params.length - 1].startsWith('%')) {
          const dest = params[params.length - 1].replace(/%/g, '');
          query = query.ilike('destination', `%${dest}%`);
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      // Reservations Select
      if (upper.includes('FROM RESERVATIONS')) {
        let query = supabase.from('reservations').select('*, packages:package_id ( title, destination, price, currency )');
        if (params.length > 0 && params[0]) {
          query = query.eq('agency_id', params[0]);
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        const rows = (data || []).map((r) => ({
          ...r,
          package_title: r.packages?.title || null,
          package_destination: r.packages?.destination || null,
          package_price: r.packages?.price || null,
          package_currency: r.packages?.currency || null,
        }));
        return { rows, rowCount: rows.length };
      }
    }

    // -------------------------------------------------------------
    // INSERT QUERIES
    // -------------------------------------------------------------
    if (upper.startsWith('INSERT INTO AGENCIES')) {
      const payload = {
        name: params[0],
        email: params[1],
        phone: params[2] || null,
        status: 'active',
        subscription_plan: 'starter',
      };
      const { data, error } = await supabase.from('agencies').insert([payload]).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('INSERT INTO USERS')) {
      const payload = {
        agency_id: params[0],
        name: params[1],
        email: params[2],
        password: params[3],
        role: 'admin',
      };
      const { data, error } = await supabase.from('users').insert([payload]).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('INSERT INTO PACKAGES')) {
      const payload = {
        agency_id: params[0],
        title: params[1],
        description: params[2],
        destination: params[3],
        price: params[4],
        currency: params[5] || 'USD',
        duration_days: params[6] || 1,
        included_services: typeof params[7] === 'string' ? JSON.parse(params[7]) : (params[7] || []),
        image_url: params[8],
        status: params[9] || 'active',
      };
      const { data, error } = await supabase.from('packages').insert([payload]).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('INSERT INTO RESERVATIONS')) {
      const payload = {
        agency_id: params[0],
        package_id: params[1] || null,
        client_name: params[2],
        client_email: params[3],
        client_phone: params[4] || null,
        participants_count: params[5] || 1,
        travel_date: params[6] || null,
        notes: params[7] || '',
        total_price: params[8] || 0,
        status: 'pendente',
      };
      const { data, error } = await supabase.from('reservations').insert([payload]).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // -------------------------------------------------------------
    // UPDATE QUERIES
    // -------------------------------------------------------------
    if (upper.startsWith('UPDATE AGENCIES')) {
      const updateData = {};
      if (params[0]) updateData.name = params[0];
      if (params[1]) updateData.phone = params[1];
      if (params[2]) updateData.logo_url = params[2];
      if (params[3]) updateData.country = params[3];
      updateData.updated_at = new Date().toISOString();

      const agencyId = params[4];
      const { data, error } = await supabase.from('agencies').update(updateData).eq('id', agencyId).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('UPDATE PACKAGES')) {
      const packageId = params[8];
      const updateData = {};
      if (params[0]) updateData.title = params[0];
      if (params[1]) updateData.description = params[1];
      if (params[2]) updateData.destination = params[2];
      if (params[3] !== null && params[3] !== undefined) updateData.price = params[3];
      if (params[4]) updateData.currency = params[4];
      if (params[5] !== null && params[5] !== undefined) updateData.duration_days = params[5];
      if (params[6]) updateData.included_services = typeof params[6] === 'string' ? JSON.parse(params[6]) : params[6];
      if (params[7]) updateData.image_url = params[7];
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase.from('packages').update(updateData).eq('id', packageId).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('UPDATE RESERVATIONS')) {
      const reservationId = params[params.length - 1];
      const updateData = {};
      if (params[0]) updateData.status = params[0];
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase.from('reservations').update(updateData).eq('id', reservationId).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // -------------------------------------------------------------
    // DELETE QUERIES
    // -------------------------------------------------------------
    if (upper.startsWith('DELETE FROM PACKAGES')) {
      const packageId = params[0];
      const { data, error } = await supabase.from('packages').delete().eq('id', packageId).select();
      if (error) throw new Error(error.message);
      return { rows: data || [{ id: packageId }], rowCount: 1 };
    }

    if (upper.startsWith('DELETE FROM RESERVATIONS')) {
      const reservationId = params[0];
      const { data, error } = await supabase.from('reservations').delete().eq('id', reservationId).select();
      if (error) throw new Error(error.message);
      return { rows: data || [{ id: reservationId }], rowCount: 1 };
    }

    // Default error if direct query not handled by mock
    throw new Error(`Query direta não suportada sem DATABASE_URL: ${text.substring(0, 50)}`);
  },

  async getClient() {
    if (pool) return await pool.connect();
    // Return dummy client if only Supabase JS is configured
    return {
      query: this.query.bind(this),
      release: () => {},
    };
  },
};

module.exports = db;
