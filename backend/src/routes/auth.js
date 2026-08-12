const express = require('express');
const router = express.Router();
const {
  register, login, logout, getMe, changePassword, forgotPassword, resetPassword, getUsers,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('superadmin', 'admin'), getUsers);
router.put('/change-password', protect, changePassword);

module.exports = router;
