const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

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

    const result = await pool.query(query, params);
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

// Create new reservation
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
        error: 'Nome do cliente e e-mail são obrigatórios.',
      });
    }

    let calculatedPrice = parseFloat(total_price) || 0;

    // If package_id is provided, verify it belongs to agency and calculate price if needed
    if (package_id) {
      const packageCheck = await pool.query(
        'SELECT id, price FROM packages WHERE id = $1 AND agency_id = $2',
        [package_id, agencyId]
      );

      if (packageCheck.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Pacote selecionado não encontrado.' });
      }

      if (!total_price) {
        const count = parseInt(participants_count, 10) || 1;
        calculatedPrice = parseFloat(packageCheck.rows[0].price) * count;
      }
    }

    const reservationId = uuidv4();
    const result = await pool.query(
      `INSERT INTO reservations (
        id, package_id, agency_id, client_name, client_email,
        client_phone, participants_count, travel_date, status, total_price, notes, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        reservationId,
        package_id || null,
        agencyId,
        client_name.trim(),
        client_email.toLowerCase().trim(),
        client_phone || null,
        parseInt(participants_count, 10) || 1,
        travel_date || null,
        (status || 'pendente').toLowerCase(),
        calculatedPrice,
        notes || null,
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
    const { status, travel_date, participants_count, notes, total_price } = req.body;

    // Check ownership
    const check = await pool.query(
      `SELECT r.id FROM reservations r
       LEFT JOIN packages p ON r.package_id = p.id
       WHERE r.id = $1 AND (p.agency_id = $2 OR r.agency_id = $2)`,
      [reservationId, agencyId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reserva não encontrada ou acesso negado.' });
    }

    const result = await pool.query(
      `UPDATE reservations
       SET status = COALESCE($1, status),
           travel_date = COALESCE($2, travel_date),
           participants_count = COALESCE($3, participants_count),
           notes = COALESCE($4, notes),
           total_price = COALESCE($5, total_price),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        status ? status.toLowerCase() : null,
        travel_date,
        participants_count !== undefined ? parseInt(participants_count, 10) : null,
        notes,
        total_price !== undefined ? parseFloat(total_price) : null,
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

    const check = await pool.query(
      `SELECT r.id FROM reservations r
       LEFT JOIN packages p ON r.package_id = p.id
       WHERE r.id = $1 AND (p.agency_id = $2 OR r.agency_id = $2)`,
      [reservationId, agencyId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reserva não encontrada ou acesso negado.' });
    }

    await pool.query('DELETE FROM reservations WHERE id = $1', [reservationId]);

    res.json({
      success: true,
      message: 'Reserva excluída com sucesso!',
    });
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ success: false, error: 'Erro ao deletar reserva: ' + err.message });
  }
};

module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};
