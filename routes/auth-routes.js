const router = require('express').Router();
const { login, changePassword , getMe } = require('../controllers/auth-controller');
const { protect } = require('../middleware/auth-middleware');

router.post('/login',login);
router.put('/change-password',  protect, changePassword);
router.get('/me', protect, getMe);
module.exports = router;