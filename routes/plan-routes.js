const router = require('express').Router();
const ctrl   = require('../controllers/plan-controller');
const { protect }   = require('../middleware/auth-middleware');
const { adminOnly } = require('../middleware/admin-middleware');

router.get('/',     ctrl.getAllPlans);
router.get('/:id',  ctrl.getPlan);
router.post('/create',adminOnly, ctrl.createPlan);
router.put('/update/:id',  protect, adminOnly, ctrl.updatePlan);
router.delete('/:id', protect, adminOnly, ctrl.deletePlan);

module.exports = router;