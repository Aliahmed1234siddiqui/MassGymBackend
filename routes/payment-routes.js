const router = require('express').Router();
const ctrl   = require('../controllers/payment-controller');
const { protect }   = require('../middleware/auth-middleware');
const { adminOnly } = require('../middleware/admin-middleware');

router.get('/',                    protect, adminOnly, ctrl.getAllPayments);
router.post('/create',                   protect, adminOnly, ctrl.createPayment);
router.put('/:id/status',          protect, adminOnly, ctrl.updatePaymentStatus);
router.post('/send-renewal-reminders', protect, adminOnly, ctrl.sendRenewalReminders);
router.get('/member/:id', protect, ctrl.getMemberPayments);
module.exports = router;