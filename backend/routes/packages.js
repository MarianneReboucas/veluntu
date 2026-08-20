const express = require('express');
const authenticate = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const packageController = require('../controllers/packageController');

const router = express.Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', packageController.getPackages);
router.get('/:packageId', packageController.getPackageById);
router.post('/', packageController.createPackage);
router.put('/:packageId', packageController.updatePackage);
router.delete('/:packageId', packageController.deletePackage);

module.exports = router;
