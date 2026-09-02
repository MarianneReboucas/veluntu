const pool = require('../config/database');

const tenantMiddleware = async (req, res, next) => {
  try {


    if (!agencyId) {
      return res.status(403).json({
        success: false,
        error: 'Identificador da agência (agency_id) não encontrado na sessão.',
      });
    }

    // Attach agencyId to request context
    req.agencyId = agencyId;
    next();
  } catch (err) {
    console.error('Tenant middleware error:', err);
    res.status(500).json({
      success: false,
      error: 'Erro ao validar inquilino (tenant).',
    });
  }
};

module.exports = tenantMiddleware;
