const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getDashboardStats } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getSettings)
  .put(protect, authorize('superadmin', 'admin'), upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]), updateSettings);

router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
