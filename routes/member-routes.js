const router  = require('express').Router();
const ctrl    = require('../controllers/member-controller');
const { protect }   = require('../middleware/auth-middleware');
const { adminOnly } = require('../middleware/admin-middleware');
const upload  = require('../middleware/upload-middleware');
const User = require('../models/user');

router.get('/',                       protect, adminOnly, ctrl.getAllMembers);
router.post('/create',                      protect, adminOnly, ctrl.createMember);
router.get('/:id',                    protect,            ctrl.getMember);
router.put('/:id',                    protect, adminOnly, ctrl.updateMember);
router.put('/:id/status',             protect, adminOnly, ctrl.updateMemberStatus);
router.delete('/:id',                 protect, adminOnly, ctrl.deleteMember);
router.get('/:id/card',               protect,            ctrl.getMemberCard);
router.get('/:id/notifications',      protect,            ctrl.getMemberNotifications);
router.put('/:id/notifications/read', protect, ctrl.markNotificationsRead);
router.put('/:id/photo', protect, adminOnly, upload.single('photo'), async (req, res) => {
  const member = await User.findByIdAndUpdate(
    req.params.id, { photo: req.file?.path }, { new: true }
  ).select('-password');
  res.json(member);
});

module.exports = router;