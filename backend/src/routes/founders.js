const express = require('express');
const router = express.Router();
const { getFounders, getFounder, createFounder, updateFounder, deleteFounder } = require('../controllers/founderController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getFounders)
  .post(protect, authorize('superadmin', 'admin'), upload.single('profileImage'), createFounder);

router.route('/:id')
  .get(getFounder)
  .put(protect, authorize('superadmin', 'admin'), upload.single('profileImage'), updateFounder)
  .delete(protect, authorize('superadmin', 'admin'), deleteFounder);

module.exports = router;
