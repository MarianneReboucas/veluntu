const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

const router = express.Router();

// Public auth routes
router.post('/register', authController.registerAgency);
router.post('/login', authController.login);

// Protected user/agency routes
router.get('/me', authenticate, authController.getMe);
router.put('/agency', authenticate, tenantMiddleware, authController.updateAgency);

module.exports = router;
