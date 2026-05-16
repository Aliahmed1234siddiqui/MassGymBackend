const router = require('express').Router();
const ctrl   = require('../controllers/report-controller');
const { protect }   = require('../middleware/auth-middleware');
const { adminOnly } = require('../middleware/admin-middleware');

router.get('/payments', protect, adminOnly, ctrl.getPaymentReport);
router.get('/members',  protect, adminOnly, ctrl.getMemberReport);

module.exports = router;