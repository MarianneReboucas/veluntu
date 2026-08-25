const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'veluntu_saas_jwt_secret_super_secure_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Register new agency and admin user
const registerAgency = async (req, res) => {
  let client;
  try {
    const {
      agency_name,
      agency_email,
      agency_phone,
      admin_name,
      admin_email,
      admin_password,
    } = req.body;

    // Validation
    if (!agency_name || !agency_email || !admin_name || !admin_email || !admin_password) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos.',
      });
    }

    if (admin_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'A senha deve ter no mínimo 6 caracteres.',
      });
    }

    client = await db.getClient();

    // Check existing email
    const existingAgency = await client.query(
      'SELECT id FROM agencies WHERE LOWER(email) = LOWER($1)',
      [agency_email.trim()]
    );
    if (existingAgency.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Este e-mail de agência já está cadastrado.',
      });
    }

    const existingUser = await client.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [admin_email.trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Este e-mail de usuário já está cadastrado.',
      });
    }

    await client.query('BEGIN');

    // 1. Create Agency
    const agencyResult = await client.query(
      `INSERT INTO agencies (name, email, phone, status, subscription_plan)
       VALUES ($1, $2, $3, 'active', 'starter')
       RETURNING *`,
      [agency_name.trim(), agency_email.toLowerCase().trim(), agency_phone || null]
    );
    const agency = agencyResult.rows[0];

    // 2. Hash Password and Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(admin_password, salt);

    const userResult = await client.query(
      `INSERT INTO users (agency_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, 'admin')
       RETURNING id, agency_id, name, email, role, created_at`,
      [agency.id, admin_name.trim(), admin_email.toLowerCase().trim(), hashedPassword]
    );
    const user = userResult.rows[0];

    // 3. Create default sample packages for the new agency
    await client.query(
      `INSERT INTO packages (agency_id, title, description, destination, price, currency, duration_days, included_services, image_url, status)
       VALUES 
       ($1, 'Safári no Serengeti & Cratera de Ngorongoro', 'Experiência de luxo com Big Five, tendas exclusivas e balonismo ao amanhecer.', 'Tanzânia', 4850.00, 'USD', 7, '["Hospedagem 5 estrelas", "Guia privativo em português", "Voos cênicos", "Pensão completa"]'::jsonb, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', 'active'),
       ($1, 'Pirâmides de Gizé & Cruzeiro no Nilo em Dahabiya', 'Jornada privada pela história milenar do Egito com egiptólogo exclusivo.', 'Egito', 3900.00, 'USD', 9, '["Cruzeiro Privativo Dahabiya", "Acesso VIP às Pirâmides", "Todos os traslados e voos internos", "Jantares temáticos"]'::jsonb, 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80', 'active')`,
      [agency.id]
    );

    await client.query('COMMIT');

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        agencyId: agency.id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Agência e administrador cadastrados com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      agency: {
        id: agency.id,
        name: agency.name,
        email: agency.email,
        subscription_plan: agency.subscription_plan,
        logo_url: agency.logo_url,
      },
    });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Error in registerAgency:', err);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao registrar agência: ' + err.message,
    });
  } finally {
    if (client) client.release();
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, forneça e-mail e senha.',
      });
    }

    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.password, u.role, u.agency_id,
              a.name as agency_name, a.subscription_plan, a.status as agency_status, a.logo_url
       FROM users u
       JOIN agencies a ON u.agency_id = a.id
       WHERE LOWER(u.email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Verifique seu e-mail e senha.',
      });
    }

    const user = result.rows[0];

    if (user.agency_status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'A conta da sua agência está desativada ou com pendências.',
      });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Verifique seu e-mail e senha.',
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        agencyId: user.agency_id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      agency: {
        id: user.agency_id,
        name: user.agency_name,
        subscription_plan: user.subscription_plan,
        logo_url: user.logo_url,
      },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao autenticar usuário: ' + err.message,
    });
  }
};

// Get current logged-in user profile
const getMe = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              a.id as agency_id, a.name as agency_name, a.email as agency_email,
              a.phone as agency_phone, a.country, a.subscription_plan, a.logo_url
       FROM users u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          role: row.role,
          created_at: row.created_at,
        },
        agency: {
          id: row.agency_id,
          name: row.agency_name,
          email: row.agency_email,
          phone: row.agency_phone,
          country: row.country,
          subscription_plan: row.subscription_plan,
          logo_url: row.logo_url,
        },
      },
    });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar perfil: ' + err.message });
  }
};

module.exports = {
  registerAgency,
  login,
  getMe,
};
