const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./backend/routes/auth');
const packageRoutes = require('./backend/routes/packages');
const reservationRoutes = require('./backend/routes/reservations');
const statsRoutes = require('./backend/routes/stats');
const publicRoutes = require('./backend/routes/public');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();

// Security and Logging
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Unsplash images, Google Fonts and Leaflet CDN
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration
const allowedOrigins = [
  process.env.APP_URL,
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || true) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado pelo CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve project root (works in both local and Vercel serverless)
const ROOT_DIR = path.resolve(__dirname);

// Serve static frontend files and public website
app.use('/frontend', express.static(path.join(ROOT_DIR, 'frontend')));
app.use('/css', express.static(path.join(ROOT_DIR, 'css')));
app.use('/js', express.static(path.join(ROOT_DIR, 'js')));
app.use(express.static(ROOT_DIR));

// Explicit root route — serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/public', publicRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Veluntu SaaS Multi-Tenant',
    supabase_configured: Boolean(process.env.SUPABASE_URL),
    timestamp: new Date().toISOString(),
  });
});

// Direct friendly routes for SaaS
app.get('/login', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'frontend', 'auth.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'frontend', 'dashboard.html'));
});

// Error handling middleware
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Veluntu SaaS rodando em http://localhost:${PORT}`);
    console.log(`✨ Painel SaaS:   http://localhost:${PORT}/frontend/dashboard.html`);
    console.log(`🔐 Login SaaS:    http://localhost:${PORT}/frontend/auth.html`);
    console.log(`🌍 Vitrine Web:   http://localhost:${PORT}/index.html`);
    console.log(`📊 API Base URL:  http://localhost:${PORT}/api`);
    console.log(`=================================================\n`);
  });
}

module.exports = app;
