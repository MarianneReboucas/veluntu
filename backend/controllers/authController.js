const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'veluntu_saas_jwt_secret_super_secure_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Register new agency and admin user
const registerAgency = async (req, res) => {
  const client = await pool.connect();
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

    // Check existing email
    const existingAgency = await client.query(
      'SELECT id FROM agencies WHERE email = $1',
      [agency_email.toLowerCase().trim()]
    );
    if (existingAgency.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Este e-mail de agência já está cadastrado.',
      });
    }

    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [admin_email.toLowerCase().trim()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Este e-mail de usuário já está cadastrado.',
      });
    }

    await client.query('BEGIN');

    const agencyId = uuidv4();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    const agencyResult = await client.query(
      `INSERT INTO agencies (id, name, email, phone, status, subscription_plan, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'active', 'starter', NOW(), NOW())
       RETURNING id, name, email, phone, subscription_plan`,
      [agencyId, agency_name.trim(), agency_email.toLowerCase().trim(), agency_phone || null]
    );

    const userResult = await client.query(
      `INSERT INTO users (id, agency_id, name, email, password, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'admin', NOW(), NOW())
       RETURNING id, name, email, role, agency_id`,
      [userId, agencyId, admin_name.trim(), admin_email.toLowerCase().trim(), hashedPassword]
    );

    await client.query('COMMIT');

    const agency = agencyResult.rows[0];
    const user = userResult.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        agency_id: user.agency_id,
        agency_name: agency.name,
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
        agency_id: user.agency_id,
        agency_name: agency.name,
        subscription_plan: agency.subscription_plan,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar agência: ' + err.message,
    });
  } finally {
    client.release();
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Informe e-mail e senha.',
      });
    }

    const result = await pool.query(
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
        error: 'A conta desta agência está inativa ou suspensa.',
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas. Verifique seu e-mail e senha.',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        agency_id: user.agency_id,
        agency_name: user.agency_name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agency_id: user.agency_id,
        agency_name: user.agency_name,
        subscription_plan: user.subscription_plan,
        logo_url: user.logo_url,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar login: ' + err.message,
    });
  }
};

// Get current user profile and agency info
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              a.id as agency_id, a.name as agency_name, a.email as agency_email,
              a.phone as agency_phone, a.country, a.subscription_plan, a.logo_url
       FROM users u
       JOIN agencies a ON u.agency_id = a.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar perfil.' });
  }
};

// Update agency settings
const updateAgency = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { name, phone, country, logo_url } = req.body;

    const result = await pool.query(
      `UPDATE agencies
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           country = COALESCE($3, country),
           logo_url = COALESCE($4, logo_url),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, email, phone, country, logo_url, subscription_plan`,
      [name, phone, country, logo_url, agencyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Agência não encontrada.' });
    }

    res.json({
      success: true,
      message: 'Dados da agência atualizados com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating agency:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar dados da agência.' });
  }
};

module.exports = {
  registerAgency,
  login,
  getMe,
  updateAgency,
};
