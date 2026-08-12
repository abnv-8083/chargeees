const express = require('express');
const router = express.Router();
const {
  getHero, updateHero, getAbout, updateAbout,
  getVision, updateVision, getMission, updateMission,
} = require('../controllers/sectionController');
const { protect, authorize } = require('../middleware/auth');

// Hero
router.route('/hero').get(getHero).put(protect, authorize('superadmin', 'admin', 'editor'), updateHero);
// About
router.route('/about').get(getAbout).put(protect, authorize('superadmin', 'admin', 'editor'), updateAbout);
// Vision
router.route('/vision').get(getVision).put(protect, authorize('superadmin', 'admin', 'editor'), updateVision);
// Mission
router.route('/mission').get(getMission).put(protect, authorize('superadmin', 'admin', 'editor'), updateMission);

module.exports = router;
