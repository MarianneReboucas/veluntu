const express = require('express');
const authenticate = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', statsController.getDashboardStats);

module.exports = router;
