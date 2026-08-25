const db = require('../config/database');

// Get all reservations for current agency
const getReservations = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { status, search } = req.query;

    let query = `
      SELECT r.*,
             p.title as package_title,
             p.destination as package_destination,
             p.price as package_price,
             p.currency as package_currency
      FROM reservations r
      LEFT JOIN packages p ON r.package_id = p.id
      WHERE (p.agency_id = $1 OR r.agency_id = $1)
    `;
    const params = [agencyId];

    if (status && status !== 'todas') {
      params.push(status.toLowerCase());
      query += ` AND LOWER(r.status) = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (r.client_name ILIKE $${params.length} OR r.client_email ILIKE $${params.length} OR p.title ILIKE $${params.length})`;
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await db.query(query, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar reservas: ' + err.message });
  }
};

// Create new reservation (Agency admin side)
const createReservation = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const {
      package_id,
      client_name,
      client_email,
      client_phone,
      participants_count,
      travel_date,
      status,
      notes,
      total_price,
    } = req.body;

    if (!client_name || !client_email) {
      return res.status(400).json({
        success: false,
        error: 'Nome e e-mail do cliente são obrigatórios.',
      });
    }

    let calculatedPrice = parseFloat(total_price) || 0;

    if (package_id && !total_price) {
      const pkg = await db.query('SELECT price FROM packages WHERE id = $1', [package_id]);
      if (pkg.rows.length > 0) {
        calculatedPrice = (parseFloat(pkg.rows[0].price) || 0) * (parseInt(participants_count) || 1);
      }
    }

    const result = await db.query(
      `INSERT INTO reservations (
        agency_id, package_id, client_name, client_email, client_phone,
        participants_count, travel_date, status, notes, total_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        agencyId,
        package_id || null,
        client_name.trim(),
        client_email.toLowerCase().trim(),
        client_phone || null,
        parseInt(participants_count) || 1,
        travel_date || null,
        status || 'pendente',
        notes || '',
        calculatedPrice,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ success: false, error: 'Erro ao criar reserva: ' + err.message });
  }
};

// Update reservation status / details
const updateReservation = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { reservationId } = req.params;
    const {
      status,
      notes,
      travel_date,
      participants_count,
      total_price,
      client_name,
      client_email,
      client_phone,
    } = req.body;

    const check = await db.query(
      `SELECT r.id FROM reservations r
       LEFT JOIN packages p ON r.package_id = p.id
       WHERE r.id = $1 AND (r.agency_id = $2 OR p.agency_id = $2)`,
      [reservationId, agencyId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reserva não encontrada.' });
    }

    const result = await db.query(
      `UPDATE reservations SET
        status = COALESCE($1, status),
        notes = COALESCE($2, notes),
        travel_date = COALESCE($3, travel_date),
        participants_count = COALESCE($4, participants_count),
        total_price = COALESCE($5, total_price),
        client_name = COALESCE($6, client_name),
        client_email = COALESCE($7, client_email),
        client_phone = COALESCE($8, client_phone),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [
        status ? status.toLowerCase() : null,
        notes !== undefined ? notes : null,
        travel_date || null,
        participants_count !== undefined ? parseInt(participants_count) : null,
        total_price !== undefined ? parseFloat(total_price) : null,
        client_name ? client_name.trim() : null,
        client_email ? client_email.toLowerCase().trim() : null,
        client_phone || null,
        reservationId,
      ]
    );

    res.json({
      success: true,
      message: 'Reserva atualizada com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar reserva: ' + err.message });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { reservationId } = req.params;

    const result = await db.query(
      `DELETE FROM reservations
       WHERE id = $1 AND agency_id = $2
       RETURNING id`,
      [reservationId, agencyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reserva não encontrada.' });
    }

    res.json({
      success: true,
      message: 'Reserva excluída com sucesso!',
    });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ success: false, error: 'Erro ao excluir reserva: ' + err.message });
  }
};

module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
