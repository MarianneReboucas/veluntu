const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ulszcjjbwptghmptjinw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3pjampid3B0Z2htcHRqaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxODcsImV4cCI6MjEwMjczNDE4N30.6eAWOxjBfVZBTPxcHUMjmv0ttno0FSAwovFQN5wTaq8';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not fully configured in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
