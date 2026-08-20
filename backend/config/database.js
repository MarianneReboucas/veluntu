const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ulszcjjbwptghmptjinw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3pjampid3B0Z2htcHRqaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxODcsImV4cCI6MjEwMjczNDE4N30.6eAWOxjBfVZBTPxcHUMjmv0ttno0FSAwovFQN5wTaq8';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

let pgPool = null;
if (process.env.DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  } catch (e) {
    console.warn('Postgres direct pool not initialized, using Supabase client:', e.message);
  }
}

// Database helper that routes through Supabase Client API
const db = {
  supabase,
  pool: pgPool,

  // Helper method for queries
  async query(text, params = []) {
    // If pgPool is active and working, attempt pgPool
    if (pgPool) {
      try {
        return await pgPool.query(text, params);
      } catch (err) {
        console.warn('PG pool error, falling back to Supabase client:', err.message);
      }
    }

    const trimmed = text.trim();
    const upper = trimmed.toUpperCase();

    // ================= SELECT QUERIES =================
    if (upper.startsWith('SELECT')) {
      // 1. SELECT from users WHERE email = $1 (login)
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

      if (upper.includes('FROM AGENCIES') && upper.includes('WHERE EMAIL = $1')) {
        const { data, error } = await supabase
          .from('agencies')
          .select('id, name, email')
          .ilike('email', params[0]);
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      if (upper.includes('FROM USERS') && upper.includes('WHERE EMAIL = $1')) {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email')
          .ilike('email', params[0]);
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      // 2. SELECT from packages
      if (upper.includes('FROM PACKAGES')) {
        let query = supabase.from('packages').select('*');

        if (params.length > 0 && upper.includes('AGENCY_ID = $1')) {
          query = query.eq('agency_id', params[0]);
        }

        if (upper.includes('WHERE ID = $1')) {
          query = query.eq('id', params[0]);
          if (params.length > 1 && upper.includes('AGENCY_ID = $2')) {
            query = query.eq('agency_id', params[1]);
          }
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return { rows: data || [], rowCount: (data || []).length };
      }

      // 3. SELECT from reservations
      if (upper.includes('FROM RESERVATIONS')) {
        let query = supabase
          .from('reservations')
          .select(`
            id, package_id, agency_id, client_name, client_email, client_phone,
            participants_count, travel_date, notes, status, total_price, created_at, updated_at,
            packages:package_id ( title, destination, price, currency )
          `)
          .order('created_at', { ascending: false });

        if (upper.includes('WHERE R.ID = $1') || upper.includes('WHERE ID = $1')) {
          query = query.eq('id', params[0]);
          if (params.length > 1) {
            query = query.eq('agency_id', params[1]);
          }
        } else if (params.length > 0) {
          query = query.eq('agency_id', params[0]);
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        const rows = (data || []).map((r) => ({
          ...r,
          package_title: r.packages?.title || null,
          package_destination: r.packages?.destination || null,
          package_price: r.packages?.price || null,
          package_currency: r.packages?.currency || 'USD',
        }));

        return { rows, rowCount: rows.length };
      }

      // Default generic select fallback
      return { rows: [], rowCount: 0 };
    }

    // ================= INSERT QUERIES =================
    if (upper.startsWith('INSERT INTO AGENCIES')) {
      const row = {
        id: params[0],
        name: params[1],
        email: params[2],
        phone: params[3] || null,
        status: 'active',
        subscription_plan: 'starter',
      };
      const { data, error } = await supabase.from('agencies').insert(row).select();
      if (error) throw new Error(error.message);
      return { rows: data || [row], rowCount: 1 };
    }

    if (upper.startsWith('INSERT INTO USERS')) {
      const row = {
        id: params[0],
        agency_id: params[1],
        name: params[2],
        email: params[3],
        password: params[4],
        role: params[5] || 'admin',
      };
      const { data, error } = await supabase.from('users').insert(row).select();
      if (error) throw new Error(error.message);
      return { rows: data || [row], rowCount: 1 };
    }

    if (upper.startsWith('INSERT INTO PACKAGES')) {
      let services = params[8];
      try {
        if (typeof services === 'string') services = JSON.parse(services);
      } catch (e) {}

      const row = {
        id: params[0],
        agency_id: params[1],
        title: params[2],
        description: params[3],
        destination: params[4],
        price: params[5],
        currency: params[6] || 'USD',
        duration_days: params[7] || 1,
        included_services: services || [],
        max_participants: params[9] || 10,
        image_url: params[10],
      };
      const { data, error } = await supabase.from('packages').insert(row).select();
      if (error) throw new Error(error.message);
      return { rows: data || [row], rowCount: 1 };
    }

    if (upper.startsWith('INSERT INTO RESERVATIONS')) {
      const row = {
        id: params[0],
        package_id: params[1] || null,
        agency_id: params[2] || null,
        client_name: params[3],
        client_email: params[4],
        client_phone: params[5] || null,
        participants_count: params[6] || 1,
        travel_date: params[7] || null,
        status: params[8] || 'pendente',
        total_price: params[9] || 0.0,
        notes: params[10] || null,
      };
      const { data, error } = await supabase.from('reservations').insert(row).select();
      if (error) throw new Error(error.message);
      return { rows: data || [row], rowCount: 1 };
    }

    // ================= UPDATE QUERIES =================
    if (upper.startsWith('UPDATE AGENCIES')) {
      const agencyId = params[4];
      const updates = {};
      if (params[0]) updates.name = params[0];
      if (params[1]) updates.phone = params[1];
      if (params[2]) updates.country = params[2];
      if (params[3]) updates.logo_url = params[3];

      const { data, error } = await supabase
        .from('agencies')
        .update(updates)
        .eq('id', agencyId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('UPDATE PACKAGES')) {
      const packageId = params[9];
      const agencyId = params[10];
      const updates = {};
      if (params[0] !== undefined && params[0] !== null) updates.title = params[0];
      if (params[1] !== undefined && params[1] !== null) updates.description = params[1];
      if (params[2] !== undefined && params[2] !== null) updates.destination = params[2];
      if (params[3] !== undefined && params[3] !== null) updates.price = params[3];
      if (params[4] !== undefined && params[4] !== null) updates.currency = params[4];
      if (params[5] !== undefined && params[5] !== null) updates.duration_days = params[5];
      if (params[6] !== undefined && params[6] !== null) {
        try {
          updates.included_services = JSON.parse(params[6]);
        } catch (e) {
          updates.included_services = params[6];
        }
      }
      if (params[7] !== undefined && params[7] !== null) updates.max_participants = params[7];
      if (params[8] !== undefined && params[8] !== null) updates.image_url = params[8];

      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', packageId)
        .eq('agency_id', agencyId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    if (upper.startsWith('UPDATE RESERVATIONS')) {
      const reservationId = params[5];
      const updates = {};
      if (params[0] !== undefined && params[0] !== null) updates.status = params[0];
      if (params[1] !== undefined && params[1] !== null) updates.travel_date = params[1];
      if (params[2] !== undefined && params[2] !== null) updates.participants_count = params[2];
      if (params[3] !== undefined && params[3] !== null) updates.notes = params[3];
      if (params[4] !== undefined && params[4] !== null) updates.total_price = params[4];

      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', reservationId)
        .select();
      if (error) throw new Error(error.message);
      return { rows: data || [], rowCount: (data || []).length };
    }

    // ================= DELETE QUERIES =================
    if (upper.startsWith('DELETE FROM PACKAGES')) {
      const packageId = params[0];
      const agencyId = params[1];
      const { data, error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageId)
        .eq('agency_id', agencyId)
        .select('id, title');
      if (error) throw new Error(error.message);
      return { rows: data || [{ id: packageId, title: 'Pacote' }], rowCount: 1 };
    }

    if (upper.startsWith('DELETE FROM RESERVATIONS')) {
      const reservationId = params[0];
      const { data, error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId)
        .select('id');
      if (error) throw new Error(error.message);
      return { rows: data || [{ id: reservationId }], rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  },

  // Mock connect for transactions
  async connect() {
    return {
      query: (text, params) => db.query(text, params),
      release: () => {},
    };
  },
};

module.exports = db;
