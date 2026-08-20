// Frontend Application Configuration
const CONFIG = {
  API_URL: window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? `${window.location.origin}/api`
    : '/api',
  SUPABASE_URL: 'https://ulszcjjbwptghmptjinw.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsc3pjampid3B0Z2htcHRqaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTgxODcsImV4cCI6MjEwMjczNDE4N30.6eAWOxjBfVZBTPxcHUMjmv0ttno0FSAwovFQN5wTaq8',
  PLATFORM_NAME: 'VELUNTU SaaS',
  CURRENCY_SYMBOL: 'USD $',
};

// Export to window
window.APP_CONFIG = CONFIG;
