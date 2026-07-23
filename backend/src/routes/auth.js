const express = require('express');
const router = express.Router();
const {
  login, logout, getMe, changePassword, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
