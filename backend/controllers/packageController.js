const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Get all packages for current agency
const getPackages = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { search, destination } = req.query;

    let query = 'SELECT * FROM packages WHERE agency_id = $1';
    const params = [agencyId];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    if (destination) {
      params.push(`%${destination}%`);
      query += ` AND destination ILIKE $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching packages:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pacotes: ' + err.message });
  }
};

// Get single package by ID
const getPackageById = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { packageId } = req.params;

    const result = await pool.query(
      'SELECT * FROM packages WHERE id = $1 AND agency_id = $2',
      [packageId, agencyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pacote não encontrado.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching package:', err);
    res.status(500).json({ success: false, error: 'Erro ao buscar pacote.' });
  }
};

// Create new package
const createPackage = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const {
      title,
      description,
      destination,
      price,
      currency,
      duration_days,
      included_services,
      max_participants,
      image_url,
    } = req.body;

    if (!title || !destination || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        error: 'Título, destino e preço são obrigatórios.',
      });
    }

    let servicesJson = '[]';
    if (Array.isArray(included_services)) {
      servicesJson = JSON.stringify(included_services);
    } else if (typeof included_services === 'string') {
      try {
        servicesJson = JSON.stringify(
          included_services.split(',').map((s) => s.trim()).filter(Boolean)
        );
      } catch (e) {
        servicesJson = JSON.stringify([included_services]);
      }
    }

    const packageId = uuidv4();
    const result = await pool.query(
      `INSERT INTO packages (
        id, agency_id, title, description, destination, price,
        currency, duration_days, included_services, max_participants, image_url, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        packageId,
        agencyId,
        title.trim(),
        description || '',
        destination.trim(),
        parseFloat(price) || 0,
        currency || 'USD',
        parseInt(duration_days, 10) || 1,
        servicesJson,
        parseInt(max_participants, 10) || 10,
        image_url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Pacote criado com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating package:', err);
    res.status(500).json({ success: false, error: 'Erro ao criar pacote: ' + err.message });
  }
};

// Update package
const updatePackage = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { packageId } = req.params;
    const {
      title,
      description,
      destination,
      price,
      currency,
      duration_days,
      included_services,
      max_participants,
      image_url,
    } = req.body;

    // Check ownership
    const check = await pool.query(
      'SELECT id FROM packages WHERE id = $1 AND agency_id = $2',
      [packageId, agencyId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pacote não encontrado ou acesso negado.' });
    }

    let servicesJson = undefined;
    if (included_services !== undefined) {
      if (Array.isArray(included_services)) {
        servicesJson = JSON.stringify(included_services);
      } else if (typeof included_services === 'string') {
        servicesJson = JSON.stringify(
          included_services.split(',').map((s) => s.trim()).filter(Boolean)
        );
      }
    }

    const result = await pool.query(
      `UPDATE packages
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           destination = COALESCE($3, destination),
           price = COALESCE($4, price),
           currency = COALESCE($5, currency),
           duration_days = COALESCE($6, duration_days),
           included_services = COALESCE($7, included_services),
           max_participants = COALESCE($8, max_participants),
           image_url = COALESCE($9, image_url),
           updated_at = NOW()
       WHERE id = $10 AND agency_id = $11
       RETURNING *`,
      [
        title,
        description,
        destination,
        price !== undefined ? parseFloat(price) : null,
        currency,
        duration_days !== undefined ? parseInt(duration_days, 10) : null,
        servicesJson,
        max_participants !== undefined ? parseInt(max_participants, 10) : null,
        image_url,
        packageId,
        agencyId,
      ]
    );

    res.json({
      success: true,
      message: 'Pacote atualizado com sucesso!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ success: false, error: 'Erro ao atualizar pacote: ' + err.message });
  }
};

// Delete package
const deletePackage = async (req, res) => {
  try {
    const agencyId = req.agencyId;
    const { packageId } = req.params;

    const result = await pool.query(
      'DELETE FROM packages WHERE id = $1 AND agency_id = $2 RETURNING id, title',
      [packageId, agencyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Pacote não encontrado ou acesso negado.' });
    }

    res.json({
      success: true,
      message: `Pacote "${result.rows[0].title}" excluído com sucesso!`,
    });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ success: false, error: 'Erro ao deletar pacote: ' + err.message });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
