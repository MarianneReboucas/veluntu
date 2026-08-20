const express = require('express');
const authenticate = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const reservationController = require('../controllers/reservationController');

const router = express.Router();

// All routes require authentication and tenant context
router.use(authenticate);
router.use(tenantMiddleware);

router.get('/', reservationController.getReservations);
router.post('/', reservationController.createReservation);
router.put('/:reservationId', reservationController.updateReservation);
router.delete('/:reservationId', reservationController.deleteReservation);

module.exports = router;
