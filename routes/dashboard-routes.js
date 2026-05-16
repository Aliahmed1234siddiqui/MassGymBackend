const router = require('express').Router();
const { getStats ,getMemberDashboard } = require('../controllers/dashboard-controller');
const { protect }   = require('../middleware/auth-middleware');
const { adminOnly } = require('../middleware/admin-middleware');

router.get('/stats', protect,adminOnly, getStats);
router.get('/member', protect, getMemberDashboard);
module.exports = router;