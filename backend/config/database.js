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
  if (process.env.DB_HOST && process.env.DB_USER) {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 5432;
    const db = process.env.DB_NAME || 'postgres';
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASSWORD || '';
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

    // SELECT
    if (upper.startsWith('SELECT')) {
      if (upper.includes('FROM USERS') && upper.includes('JOIN AGENCIES')) {
        if (upper.includes('WHERE LOWER(U.EMAIL) = LOWER($1)') || upper.includes('WHERE U.EMAIL = $1')) {
          const email = params[0]?.toLowerCase();
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

      if (upper.includes('FROM AGENCIES') && upper.includes('WHERE LOWER(EMAIL) = LOWER($1)')) {
        const { data, error } = await supabase.from('agencies').select('*').ilike('email', params[0]);
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      if (upper.includes('FROM USERS') && upper.includes('WHERE LOWER(EMAIL) = LOWER($1)')) {
        const { data, error } = await supabase.from('users').select('*').ilike('email', params[0]);
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      if (upper.includes('FROM PACKAGES')) {
        let query = supabase.from('packages').select('*');
        if (upper.includes('AGENCY_ID = $1')) {
          query = query.eq('agency_id', params[0]);
        }
        if (upper.includes('WHERE ID = $1')) {
          query = query.eq('id', params[0]);
        }
        if (upper.includes("STATUS = 'ACTIVE'")) {
          query = query.eq('status', 'active');
        }
        query = query.order('created_at', { ascending: false });
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      if (upper.includes('FROM RESERVATIONS')) {
        let query = supabase.from('reservations').select('*, packages:package_id ( title, destination, price, currency )');
        if (params.length > 0) {
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

    // INSERT INTO RESERVATIONS
    if (upper.startsWith('INSERT INTO RESERVATIONS')) {
      const payload = {
        agency_id: params[0],
        package_id: params[1],
        client_name: params[2],
        client_email: params[3],
        client_phone: params[4],
        participants_count: params[5],
        travel_date: params[6],
        status: params[7],
        notes: params[8],
        total_price: params[9],
      };
      const { data, error } = await supabase.from('reservations').insert([payload]).select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // Default error if direct query not handled by mock
    throw new Error(`Query direta não suportada sem DATABASE_URL. Configure DATABASE_URL do Supabase no .env: ${text.substring(0, 40)}`);
  },

  async getClient() {
    if (pool) return await pool.connect();
    // Return dummy client if only Supabase JS is configured
    return {
      query: this.query,
      release: () => {},
    };
  },
};

module.exports = db;
