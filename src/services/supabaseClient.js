import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ulszcjjbwptghmptjinw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3pjampid3B0Z2htcHRqaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxODcsImV4cCI6MjEwMjczNDE4N30.6eAWOxjBfVZBTPxcHUMjmv0ttno0FSAwovFQN5wTaq8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;
