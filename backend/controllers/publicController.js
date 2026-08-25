const db = require('../config/database');

// Get all public packages (e.g., for website visitors)
const getPublicPackages = async (req, res) => {
  try {
    const { destination } = req.query;

    let query = `
      SELECT id, title, description, destination, price, currency, duration_days, 
             included_services, max_participants, image_url, created_at
      FROM packages
      WHERE status = 'active'
    `;
    const params = [];

    if (destination) {
      params.push(`%${destination}%`);
      query += ` AND destination ILIKE $${params.length}`;
    }

    query += ' ORDER BY created_at DESC LIMIT 30';

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching public packages:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pacotes públicos: ' + err.message });
  }
};

// Submit lead / reservation from public planner or contact form
const createPublicReservation = async (req, res) => {
  try {
    const {
      package_id,
      client_name,
      client_email,
      client_phone,
      participants_count,
      travel_date,
      notes,
    } = req.body;

    if (!client_name || !client_email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e e-mail são obrigatórios para enviar sua solicitação.',
      });
    }

    let agencyId = null;
    let totalPrice = 0;

    if (package_id) {
      const pkgResult = await db.query(
        'SELECT agency_id, price FROM packages WHERE id = $1',
        [package_id]
      );

      if (pkgResult.rows.length > 0) {
        const pkg = pkgResult.rows[0];
        agencyId = pkg.agency_id;
        const count = parseInt(participants_count) || 1;
        totalPrice = (parseFloat(pkg.price) || 0) * count;
      }
    }

    // Fallback: If no package selected, assign to first active agency
    if (!agencyId) {
      const agencyResult = await db.query('SELECT id FROM agencies LIMIT 1');
      if (agencyResult.rows.length > 0) {
        agencyId = agencyResult.rows[0].id;
      }
    }

    const insertResult = await db.query(
      `INSERT INTO reservations (
        agency_id, package_id, client_name, client_email, client_phone,
        participants_count, travel_date, status, notes, total_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendente', $8, $9)
      RETURNING *`,
      [
        agencyId,
        package_id || null,
        client_name.trim(),
        client_email.toLowerCase().trim(),
        client_phone || null,
        parseInt(participants_count) || 1,
        travel_date || null,
        notes || '',
        totalPrice,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Sua solicitação foi enviada com sucesso! Nossos especialistas entrarão em contato em breve.',
      data: insertResult.rows[0],
    });
  } catch (err) {
    console.error('Error in createPublicReservation:', err);
    res.status(500).json({
      success: false,
      error: 'Erro no servidor ao enviar sua solicitação: ' + err.message,
    });
  }
};

module.exports = {
  getPublicPackages,
  createPublicReservation,
};
