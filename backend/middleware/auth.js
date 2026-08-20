const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação não fornecido. Faça login para continuar.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'veluntu_saas_jwt_secret_super_secure_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado. Faça login novamente.',
    });
  }
};

module.exports = authenticate;
