const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(protect, authorize('superadmin', 'admin', 'editor'), createService);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('superadmin', 'admin', 'editor'), updateService)
  .delete(protect, authorize('superadmin', 'admin'), deleteService);

module.exports = router;
